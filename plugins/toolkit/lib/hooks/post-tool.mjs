// PostToolUse (ARCHITECTURE section 6):
// - Bash: records toolkit memory writes, work-item writes, and decisions in
//   session state, so Stop knows something was recorded (critique B4).
// - Write, Edit, MultiEdit, apply_patch on a work-item record: validates it
//   (never rewrites it, critique I2) and returns any error or gate question as
//   additionalContext. `decision: "block"` only for a gate violation, with a
//   reason that stays true when Codex puts it in place of the tool result.
// - A .memory/ record changed by hand: rebuilds MEMORY.md under the lock.

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

async function onBash(input, io, cwd) {
  const cmd = input.tool_input && typeof input.tool_input.command === 'string' ? input.tool_input.command : '';
  if (!/toolkit/.test(cmd)) return null;
  const found = toolkitCommands(cmd).map((c) => ({ c, kind: recordKind(c) })).filter((x) => x.kind);
  if (!found.length || commandFailed(input)) return null;
  const project = findProject(cwd);
  if (!project) return null;
  await updateSession(project, io.host, input, io.env, (state) => {
    const turn = currentTurn(state, input);
    for (const { c, kind } of found) turn.records.push({ kind, what: `toolkit ${c.group} ${c.sub}`, at: new Date().toISOString() });
  });
  return null;
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
    }
    if (memoryType(project) === 'builtin' && isMemoryTopic(f.path, project)) memoryTouched = true;
  }
  if (memoryTouched) {
    const { reindexVault } = await import('../memory/builtin.mjs');
    await reindexVault(project.mainRoot || project.root);
  }
  if (edits.length || memoryTouched) {
    await updateSession(project, io.host, input, io.env, (state) => {
      const turn = currentTurn(state, input);
      for (const e of edits) if (!turn.edits.some((x) => x.path === e.path)) turn.edits.push(e);
      if (memoryTouched) turn.records.push({ kind: 'memory-file', what: 'a .memory/ record was edited', at: new Date().toISOString() });
    });
  }
  return postToolOutput({ context: contexts.join('\n'), blockReason: blocks.join(' ') || null });
}

/** Absolute path of a project-relative path recorded in session state. */
export function resolveRecorded(project, rel) {
  const inMain = path.join(project.mainRoot || project.root, ...rel.split('/'));
  if (fs.existsSync(inMain)) return inMain;
  return path.join(project.root, ...rel.split('/'));
}
