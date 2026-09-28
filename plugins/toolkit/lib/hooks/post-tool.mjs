// PostToolUse (ARCHITECTURE section 6):
// - Bash: records toolkit memory writes, work-item writes, and decisions in
//   session state, so Stop knows something was recorded (critique B4).
// - Write, Edit, MultiEdit, apply_patch on a work-item record: validates it
//   (never rewrites it, critique I2) and returns any error or gate question as
//   additionalContext. `decision: "block"` only for a gate violation, with a
//   reason that stays true when Codex puts it in place of the tool result.
// - A .memory/ record changed by hand: rebuilds MEMORY.md under the lock.
// - A shell command (not a toolkit command) that names a WORK-ITEM.md: checks
//   that record after the command ran.
// - The first direct body edit of a record in a session: one line saying that
//   toolkit work edit is the way to change a record's text.

import fs from 'node:fs';
import path from 'node:path';
import { postToolOutput } from './output.mjs';
import { findProject, memoryType } from './common.mjs';
import { updateSession, currentTurn } from './session.mjs';
import { toolkitCommands, recordKind } from './shell.mjs';
import { editedPaths, isWorkItemFile, isMemoryTopic, projectRelative, projectPath, mightMatter } from './paths.mjs';

/** True when the tool output shows the command failed. */
export function commandFailed(input) {
  const r = input.tool_response;
  if (typeof r === 'string') {
    const m = /^Exit code:\s*(\d+)/m.exec(r);
    if (m && Number(m[1]) !== 0) return true;
    return /^Error: /m.test(r) || /"ok":\s*false/.test(r);
  }
  if (r && typeof r === 'object') {
    if (typeof r.exit_code === 'number' && r.exit_code !== 0) return true;
    if (typeof r.exitCode === 'number' && r.exitCode !== 0) return true;
    const err = String(r.stderr || '');
    const outText = String(r.stdout || '');
    return /^Error: /m.test(err) || /"ok":\s*false/.test(outText);
  }
  return false;
}

function listText(items, max = 3) {
  const shown = items.slice(0, max).map((e) => e.message || e.question || String(e));
  return `${shown.join(' ')}${items.length > max ? ` (and ${items.length - max} more)` : ''}`;
}

/**
 * Validate the work item records a shell command names (a write the pre-tool
 * hook did not recognise still gets checked). Returns the same shape as an
 * edit: context lines and block reasons.
 */
async function checkNamedRecords(cmd, cwd, project) {
  const contexts = [];
  const blocks = [];
  const names = [...new Set((String(cmd).match(/[^\s'"`()<>|;&]*WORK-ITEM\.md/g) || []))];
  if (!names.length) return { contexts, blocks };
  const { isRecordPath } = await import('./records.mjs');
  const { validateFile } = await import('../work/ops.mjs');
  const config = project.config;
  const prefix = (config.tracker && config.tracker.idPrefix) || 'WI';
  const owner = config.project && config.project.owner;
  for (const name of names) {
    const abs = projectPath(path.resolve(cwd, name), project);
    if (!isRecordPath(abs, project) || !fs.existsSync(abs)) continue;
    const res = validateFile(abs, { prefix, ownerName: owner });
    const rel = projectRelative(abs, project);
    const who = res.id || rel;
    if (res.errors.length) contexts.push(`${who} (${rel}) has ${res.errors.length} problem${res.errors.length === 1 ? '' : 's'} after this command: ${listText(res.errors)} toolkit work validate ${res.id || rel} lists every problem.`);
    if (res.gates.length) blocks.push(`${rel} now skips an approval gate for ${who}: ${listText(res.gates)} Put the previous value back, or ask the owner and record the answer with toolkit work approve ${res.id || '<id>'} (the work-decide skill).`);
  }
  return { contexts, blocks };
}

/** The value of --<name> <value> or --<name>=<value> in a command's words, or null. */
export function flagValue(args, name) {
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === `--${name}`) return i + 1 < args.length ? args[i + 1] : null;
    if (a.startsWith(`--${name}=`)) return a.slice(name.length + 3);
  }
  return null;
}

async function onBash(input, io, cwd) {
  const cmd = input.tool_input && typeof input.tool_input.command === 'string' ? input.tool_input.command : '';
  const namesRecord = /WORK-ITEM\.md/.test(cmd);
  if (!/toolkit/.test(cmd) && !namesRecord) return null;
  const found = toolkitCommands(cmd).map((c) => ({ c, kind: recordKind(c) })).filter((x) => x.kind);
  const project = (found.length && !commandFailed(input)) || namesRecord ? findProject(cwd) : null;
  if (!project) return null;
  if (found.length && !commandFailed(input)) {
    await updateSession(project, io.host, input, io.env, (state) => {
      const turn = currentTurn(state, input);
      for (const { c, kind } of found) {
        const rec = { kind, what: `toolkit ${c.group} ${c.sub}`, at: new Date().toISOString() };
        // The Stop hook saves an unanswered "Save to memory?" as a proposal unless the agent already did.
        if (c.group === 'memory' && c.sub === 'save' && c.args.includes('--proposal')) rec.proposal = true;
        // The description saved, so the Stop hook does not propose the same text again.
        if (c.group === 'memory' && c.sub === 'save') {
          const d = flagValue(c.args, 'description');
          if (d) rec.description = d.slice(0, 200);
        }
        turn.records.push(rec);
      }
    });
  }
  // A command that is not a toolkit command and names a record: check the record after it ran.
  if (namesRecord && !toolkitCommands(cmd).length) {
    const { onlyReads } = await import('./records.mjs');
    if (onlyReads(cmd)) return null;
    const { contexts, blocks } = await checkNamedRecords(cmd, cwd, project);
    if (contexts.length || blocks.length) return postToolOutput({ context: contexts.join('\n'), blockReason: blocks.join(' ') || null });
  }
  return null;
}

const BODY_EDIT_NOTE = 'toolkit work edit <id> --section \'<heading>\' --set-file <file> changes a section the same way in every tracker and keeps the toolkit\'s record of what it wrote; prefer it to editing the file.';
// A design has its own command (sample run b named the section command for a DESIGN.md).
const DESIGN_EDIT_NOTE = 'toolkit work design <id> --set-file <file> (or --text \'<text>\') saves a design the same way in every tracker and keeps its status; prefer it to editing DESIGN.md.';

/** True when a DESIGN.md file's frontmatter says status: approved. */
function approvedDesignFile(file) {
  try {
    const head = fs.readFileSync(file, 'utf8').split(/\r?\n---\s*\r?\n/)[0];
    return /^status:\s*["']?approved["']?\s*$/m.test(head);
  } catch {
    return false;
  }
}

/** The line for an approved design edited directly: the owner hears what changed, and the change is recorded. */
export function approvedDesignNote(who) {
  return `The approved design of ${who} was edited directly. The approval covered the design as it was: tell the owner what changed, record it with toolkit work history ${who} --note 'Design text changed after approval: <what changed>', and ask him again when the change alters what gets built. toolkit work design ${who} --set-file <file> records this row for you next time.`;
}

/** The reminder line for records edited directly: [{ who, design }]. */
export function directEditNote(edits) {
  const names = (list) => (list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}` : list[0]);
  const lines = [];
  const designs = edits.filter((e) => e.design).map((e) => e.who);
  const records = edits.filter((e) => !e.design).map((e) => e.who);
  if (records.length) lines.push(`${names(records)} ${records.length > 1 ? 'were' : 'was'} edited directly and ${records.length > 1 ? 'pass' : 'passes'} validation. ${BODY_EDIT_NOTE}`);
  if (designs.length) lines.push(`The design of ${names(designs)} was edited directly and passes validation. ${DESIGN_EDIT_NOTE}`);
  return lines.join('\n');
}

export async function postTool(input, io) {
  const cwd = input.cwd || io.cwd;
  if (input.tool_name === 'Bash') return onBash(input, io, cwd);
  const files = editedPaths(input, cwd);
  if (!files.length || !files.some((f) => mightMatter(f.path))) return null;
  const project = findProject(cwd);
  if (!project) return null;
  const config = project.config;
  const prefix = (config.tracker && config.tracker.idPrefix) || 'WI';
  const owner = config.project && config.project.owner;
  const contexts = [];
  const blocks = [];
  const edits = [];
  const directEdits = [];
  const approvedDesigns = [];
  let memoryTouched = false;
  const { validateFile } = await import('../work/ops.mjs');
  for (const given of files) {
    if (given.action === 'Delete File') continue;
    const f = { ...given, path: projectPath(given.path, project) };
    if (isWorkItemFile(f.path, project) && fs.existsSync(f.path)) {
      const res = validateFile(f.path, { prefix, ownerName: owner });
      const unreadable = res.errors.some((e) => e.code === 'bad_frontmatter');
      if (!res.id && !unreadable) continue; // plain notes inside an item folder
      const rel = projectRelative(f.path, project);
      const who = res.id || rel;
      edits.push({ path: rel, id: res.id || null });
      if (res.errors.length) {
        contexts.push(`${who} (${rel}) was saved with ${res.errors.length} problem${res.errors.length === 1 ? '' : 's'}: ${listText(res.errors)} The file was not changed by the toolkit. toolkit work validate ${res.id || rel} lists every problem.`);
      }
      if (res.gates.length) {
        blocks.push(`The edit to ${rel} was saved, and it skips an approval gate for ${who}: ${listText(res.gates)} Put the previous value back, or ask the owner and record the answer with toolkit work approve ${res.id || '<id>'} (the work-decide skill).`);
      }
      if (!res.errors.length && !res.gates.length) directEdits.push({ who, design: path.basename(f.path) === 'DESIGN.md' });
      // An edit to an approved design is told every time, not once per session
      // (sample run confirm-a: the second direct edit, to an approved design, got no message).
      if (res.kind === 'design' && approvedDesignFile(f.path)) approvedDesigns.push(who);
    }
    if (memoryType(project) === 'builtin' && isMemoryTopic(f.path, project)) memoryTouched = true;
  }
  if (memoryTouched) {
    const { reindexVault } = await import('../memory/builtin.mjs');
    await reindexVault(project.mainRoot || project.root);
  }
  let remind = false;
  const reminded = directEdits.filter((e) => !(e.design && approvedDesigns.includes(e.who)));
  if (edits.length || memoryTouched) {
    await updateSession(project, io.host, input, io.env, (state) => {
      const turn = currentTurn(state, input);
      for (const e of edits) if (!turn.edits.some((x) => x.path === e.path)) turn.edits.push(e);
      if (memoryTouched) turn.records.push({ kind: 'memory-file', what: 'a .memory/ record was edited', at: new Date().toISOString() });
      // One reminder per session that toolkit work edit is the way to change a record's text.
      if (reminded.length && !state.remindedBodyEdit) {
        state.remindedBodyEdit = true;
        remind = true;
      }
    });
  }
  if (remind) contexts.push(directEditNote(reminded));
  for (const who of [...new Set(approvedDesigns)]) contexts.push(approvedDesignNote(who));
  return postToolOutput({ context: contexts.join('\n'), blockReason: blocks.join(' ') || null });
}

/** Absolute path of a project-relative path recorded in session state. */
export function resolveRecorded(project, rel) {
  const inMain = path.join(project.mainRoot || project.root, ...rel.split('/'));
  if (fs.existsSync(inMain)) return inMain;
  return path.join(project.root, ...rel.split('/'));
}
