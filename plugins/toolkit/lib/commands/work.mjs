// toolkit work ...: the work-item commands (ARCHITECTURE 5).
// Every command except `lifecycle` finds the project, opens the tracker named
// in .toolkit.json, and first runs a cheap rescan that reports items the owner
// moved, renamed, copied, or edited by hand.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { run as runProgram, slugify } from '../core/util.mjs';
import { lifecycleData, stageShort, normalizeStatus, normalizeWaitingOn, isTerminal, STATUSES } from '../work/lifecycle.mjs';
import { composeDoc, getSectionWhole, sectionNames, canonicalId, normalizeMeta, getLabel, isPlaceholder } from '../work/model.mjs';
import { openTracker } from '../work/driver.mjs';
import {
  opNew, opSet, opApprove, opDesign, opHistory, opEdit, opFinish, opCancel, opMove, rankNext, opValidate, validateFile, mustGet, listItems,
} from '../work/ops.mjs';
import { collectOwnerDecisions, collectAgentTodos, withDesignBodies, collectMemoryProposals } from '../work/decisions.mjs';
import { treeLines } from '../work/dashboard.mjs';
import { worktreeItem, TRACKER_DIR } from '../work/state.mjs';
import { itemSummary, reportLines } from '../work/report.mjs';

export { reportLines };

export const summary = 'Work items: create, list, show, change, approve, finish, and sync them. toolkit work lifecycle shows the stages.';

const USAGE = `Usage:
  toolkit work lifecycle
  toolkit work new --title <t> [--type <t>] [--parent <id> [--covers R-02,R-03]] [--stage <s>] [--priority <p>] [--request <text>] [--group <folder>]
  toolkit work list [--status <s>] [--waiting-on <w>] [--tree] [--all]
  toolkit work show <id> [--section <heading>] [--path]
  toolkit work edit <id> --section <heading> (--set-file <file|-> | --text <text>) | --section <heading> --append-row "<a | b | c>" | --label <name> --value <text> | --remove-guide
  toolkit work set <id> [--stage <s>] [--waiting-on <w>] [--priority <p>] [--type <t>] [--delivery <d>] [--title <t>] [--parent <id|none>] [--reopen] [--note <why>]
  toolkit work approve <id> --requirements|--design|--result --by <name>
  toolkit work design <id> [--create] [--set-file <file|-> | --text <text>] [--status proposed|approved|superseded] [--by <name>]
  toolkit work history <id> --note <text> [--effect <text>]
  toolkit work move <id> --under <id|group|archive|root>
  toolkit work finish <id> --by <name> --evidence <text> [--quote <owner's words>] [--allow-open-sub-items]
  toolkit work cancel <id> --reason <text> [--by <name>]
  toolkit work next
  toolkit work decisions
  toolkit work sync
  toolkit work validate [<id|file>]

--covers: a sub-item that delivers some of the parent's approved requirements
links them (the text stays in the parent) and inherits the parent's
requirements approval, so the owner is not asked twice.
--quote: finish needs the owner's own words approving the result when no
result approval is recorded yet (toolkit work approve <id> --result records one).
finish then backs up .work-items/ and .memory/ (and Hindsight memory) to the
backup folder in .toolkit.json backup.dir, one folder per day; with no folder
set it says how to set one.
--set-file - reads the text from standard input. --text gives the text in
the command itself, so no file is needed.
--remove-guide: removes the template's fill-in guide comment above Overview.

Exit codes: 0 ok, 1 error, 2 validation failure or a refused gate, 3 not supported for this tracker, 4 not a toolkit project.
Skills find an item's file only with: toolkit work show <id> --path`;

export function help() {
  return USAGE;
}

const SPEC = {
  string: ['title', 'type', 'parent', 'stage', 'priority', 'request', 'group', 'status', 'waiting-on', 'section', 'set-file', 'append-row',
    'label', 'value', 'delivery', 'by', 'under', 'evidence', 'reason', 'note', 'effect', 'host', 'covers', 'quote', 'text'],
  boolean: ['tree', 'all', 'path', 'requirements', 'design', 'result', 'create', 'reopen', 'allow-open-sub-items', 'json', 'remove-guide'],
};

function has(flags, name) {
  return Object.prototype.hasOwnProperty.call(flags, name) && flags[name] !== undefined;
}

function one(flags, name) {
  const v = flags[name];
  if (Array.isArray(v)) return v[v.length - 1];
  return v;
}

function needId(args, sub) {
  const id = args._[0];
  if (!id) throw new ToolkitError(EXIT.INVALID, `toolkit work ${sub} needs an item id, for example WI-007.`, { fix: `toolkit work ${sub} <id> ...` });
  return id;
}

async function readFileArg(ctx, file) {
  if (file === '-') return ctx.stdin();
  const abs = path.resolve(ctx.cwd, file);
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch (err) {
    throw new ToolkitError(EXIT.ERROR, `The file ${abs} could not be read: ${err.message}`, { path: abs });
  }
}

/**
 * The text of --set-file <file|-> or --text <text>, or undefined when neither
 * is given. --text lets a Codex session pass the text in the command, with no
 * temporary file to name or clean up (sample run b, round 2).
 */
async function textArg(ctx, flags) {
  const fromFile = has(flags, 'set-file');
  const inline = has(flags, 'text');
  if (fromFile && inline) throw new ToolkitError(EXIT.INVALID, 'Give --set-file or --text, not both.');
  if (inline) return String(one(flags, 'text'));
  if (fromFile) return readFileArg(ctx, one(flags, 'set-file'));
  return undefined;
}

// ------------------------------------------------------------------ text helpers

const summaryOf = itemSummary;

function withChanges(changes, lines) {
  const extra = reportLines(changes);
  if (!extra.length) return lines;
  return ['Tracker changes found (work-organize handles moves, copies, and missing items; work-decide handles questions for the owner):', ...extra.map((l) => `  ${l}`), '', ...lines];
}

/** Files under the tracker that cannot be read (local tracker), as problem objects. */
function brokenOf(tracker) {
  if (typeof tracker.brokenRecords !== 'function') return [];
  try {
    return tracker.brokenRecords();
  } catch {
    return [];
  }
}

function padTable(rows) {
  if (!rows.length) return [];
  const widths = rows[0].map((_, c) => Math.max(...rows.map((r) => String(r[c] ?? '').length)));
  return rows.map((r) => r.map((cell, c) => (c === r.length - 1 ? String(cell ?? '') : String(cell ?? '').padEnd(widths[c]))).join('  ').trimEnd());
}

// ------------------------------------------------------------------ subcommands

function cmdLifecycle(ctx) {
  const data = lifecycleData();
  const lines = ['Stages (the status follows the stage):'];
  lines.push(...padTable([
    ...data.stages.map((s) => [`  ${s.stage}`, s.status, s.label, `Continue with: ${s.continueWith.join(' or ')}`]),
    ...data.terminal.map((t) => [`  (${t.status})`, t.status, `Set only by ${t.setBy}.`, `Continue with: ${t.continueWith.join(', ')}`]),
  ]));
  lines.push(`  An item with waiting_on: owner continues with ${data.waitingOnOwner.continueWith}, whatever its stage.`);
  lines.push('', 'Statuses:');
  lines.push(...padTable(data.statuses.map((s) => [`  ${s.status}`, s.meaning])));
  lines.push('', 'Types:');
  lines.push(...padTable(data.types.map((t) => [`  ${t.type}`, t.label])));
  lines.push(`  Other lower-case words are allowed as types.`);
  lines.push('', `Priorities: ${data.priorities.join(', ')}. Waiting on: ${data.waitingOn.join(', ')}. Delivery: ${data.delivery.join(', ')}.`);
  lines.push('', 'Approval gates:');
  for (const g of data.gates) lines.push(`  ${g.gate}: asked by ${g.askedBy}; recorded with ${g.command}. ${g.rule}`);
  lines.push('', 'What counts as approval:');
  for (const r of data.approvalRules) lines.push(`  - ${r}`);
  lines.push('', 'Rules:');
  for (const r of data.rules) lines.push(`  - ${r}`);
  out(ctx, lines, { ok: true, ...data });
  return EXIT.OK;
}

async function cmdNew(ctx, tracker, project, args, changes) {
  const f = args.flags;
  const res = await opNew(tracker, project, {
    title: one(f, 'title'),
    type: one(f, 'type'),
    parent: one(f, 'parent'),
    stage: one(f, 'stage'),
    priority: one(f, 'priority'),
    request: one(f, 'request'),
    group: one(f, 'group'),
    covers: has(f, 'covers') ? f.covers : undefined,
    today: tracker.today ? tracker.today() : undefined,
  });
  const s = summaryOf(res.record);
  const lines = [`Created ${res.id}: ${s.title} (${s.stageLabel}, ${s.status}${s.parent && s.parent !== 'none' ? `, sub-item of ${s.parent}` : ''}) at ${res.record.location}.`];
  if (res.covers && res.covers.length) lines.push(`It delivers ${s.parent} ${res.covers.join(', ')} and inherits that requirements approval (${res.inherited}).`);
  if (res.parentDesign) lines.push(`${res.parentDesign}'s approved design covers it, so it starts at planning with no design of its own.`);
  if (res.inheritedDelivery) lines.push(`Delivery: ${res.inheritedDelivery}, as recorded for ${s.parent}.`);
  lines.push(`Continue with ${s.continueWith}.`);
  out(ctx, withChanges(changes, lines), { ok: true, id: res.id, item: s, path: res.record.path || null, changes });
  return EXIT.OK;
}

async function cmdList(ctx, tracker, project, args, changes) {
  const f = args.flags;
  let items = await listItems(tracker);
  const all = Boolean(f.all);
  const statusFilter = has(f, 'status') ? [].concat(f.status).flatMap((s) => String(s).split(',')).map((s) => normalizeStatus(s) || s.trim()) : null;
  if (statusFilter) {
    const bad = statusFilter.filter((s) => !STATUSES.includes(s));
    if (bad.length) throw new ToolkitError(EXIT.INVALID, `Unknown status: ${bad.join(', ')}. Statuses: ${STATUSES.join(', ')}.`);
  }
  const waitFilter = has(f, 'waiting-on') ? normalizeWaitingOn(one(f, 'waiting-on')) || String(one(f, 'waiting-on')).trim().toLowerCase() : null;
  items = items.filter((i) => {
    const m = normalizeMeta(i.meta || {});
    if (!all && i.archived) return false;
    if (statusFilter) return statusFilter.includes(m.status);
    if (!all && isTerminal(m.status)) return false;
    return true;
  });
  if (waitFilter) {
    items = items.filter((i) => {
      const w = normalizeWaitingOn(i.meta.waiting_on) || '';
      return waitFilter === 'external' ? w.startsWith('external') : w === waitFilter;
    });
  }
  const wt = safeWorktree(ctx.cwd, tracker.prefix);
  const summaries = items.map(summaryOf);
  const broken = brokenOf(tracker);
  const brokenIds = new Set(broken.map((b) => b.id).filter(Boolean));
  let missing = [];
  if (all && typeof tracker.knownIds === 'function') {
    const present = new Set((await listItems(tracker)).map((i) => i.id));
    missing = tracker.knownIds().filter((id) => !present.has(id) && !brokenIds.has(id));
  }
  const lines = [];
  if (wt.id) lines.push(`This worktree (branch ${wt.branch}) works on ${wt.id}.`, '');
  if (!items.length) {
    lines.push(all ? 'No work items.' : 'No open work items. Add --all to include finished, cancelled, and archived ones.');
  } else if (f.tree) {
    const byId = new Map(items.map((i) => [i.id, i]));
    const treeItems = items.map((i) => ({ ...i, meta: normalizeMeta(i.meta || {}), parent: i.parent !== undefined ? i.parent : i.meta.parent }))
      .map((i) => (i.parent && !byId.has(i.parent) ? { ...i, parent: 'none' } : i));
    lines.push(...treeLines(treeItems, {
      bullet: '',
      indent: '  ',
      // A finished item shows only Done or Cancelled: its last stage is history, not where it stands.
      label: (it) => `${it.id}  ${it.meta.title}  (${isTerminal(it.meta.status) ? it.meta.status : `${stageShort(it.meta.stage)}, ${it.meta.status}`}${!isTerminal(it.meta.status) && it.meta.waiting_on && it.meta.waiting_on !== 'none' ? `, waiting on ${it.meta.waiting_on}` : ''}${it.archived ? ', archived' : ''})${wt.id === it.id ? '  <- this worktree' : ''}`,
    }));
  } else {
    const rows = [['ID', 'Stage', 'Status', 'Waiting on', 'Title']];
    for (const s of summaries) rows.push([s.id + (wt.id === s.id ? '*' : ''), isTerminal(s.status) ? '-' : s.stageLabel, s.status || '', !isTerminal(s.status) && s.waiting_on && s.waiting_on !== 'none' ? s.waiting_on : '', `${s.title}${s.archived ? ' (archived)' : ''}${s.parent && s.parent !== 'none' ? ` [sub-item of ${s.parent}]` : ''}`]);
    lines.push(...padTable(rows));
    if (wt.id && summaries.some((s) => s.id === wt.id)) lines.push('', '* this worktree\'s item');
  }
  if (missing.length) lines.push('', `Missing (known to the tracker, not found): ${missing.join(', ')}.`);
  if (broken.length && !(changes && (changes.problems || []).some((p) => p.code === 'unreadable_record'))) {
    lines.push('', 'Cannot be read (fix by hand; the toolkit leaves these files alone):');
    for (const b of broken) lines.push(`  ${b.message}`);
  }
  out(ctx, withChanges(changes, lines), { ok: true, items: summaries, missing, unreadable: broken, worktree: wt, changes });
  return EXIT.OK;
}

function safeWorktree(cwd, prefix) {
  try {
    return worktreeItem(cwd, prefix);
  } catch {
    return { branch: null, id: null };
  }
}

async function cmdShow(ctx, tracker, project, args, changes) {
  const id = needId(args, 'show');
  const rec = await mustGet(tracker, id);
  const f = args.flags;
  if (f.path) {
    const where = rec.path || rec.location;
    out(ctx, where, { ok: true, id: rec.id, path: rec.path || null, location: rec.location, changes });
    return EXIT.OK;
  }
  if (has(f, 'section')) {
    const heading = one(f, 'section');
    const text = getSectionWhole(rec.body, heading);
    if (text === null) {
      throw new ToolkitError(EXIT.ERROR, `${rec.id} has no section "${heading}". Sections: ${sectionNames(rec.body).join(', ')}.`, { id: rec.id, sections: sectionNames(rec.body) });
    }
    out(ctx, withChanges(changes, [text]), { ok: true, id: rec.id, section: heading, text, location: rec.location, changes });
    return EXIT.OK;
  }
  const s = summaryOf(rec);
  const design = await tracker.getDesign(rec.id);
  // A sub-item with no design of its own is built from its parent's approved
  // design (work-organize step 6); say so, so work-check reads that design.
  const inherited = design ? null : await parentDesignOf(tracker, s.parent);
  const designText = design ? `${design.meta.status} (${design.location})`
    : inherited ? `none of its own; ${inherited.id}'s design is approved (${inherited.location}). Read it with: toolkit work design ${inherited.id}` : 'none';
  const branch = worktreeBranch(rec.id, s.title);
  const header = [
    `${rec.id}: ${s.title}`,
    `Location: ${rec.path || rec.location}`,
    // A finished item shows Done or Cancelled: its last stage is history.
    `Stage: ${isTerminal(s.status) ? s.status : `${s.stageLabel} (${s.status})`} | Waiting on: ${s.waiting_on || 'none'} | Continue with: ${s.continueWith}`,
    `Parent: ${s.parent || 'none'} | Sub-items: ${s.children.length ? s.children.join(', ') : 'none'} | Design: ${designText}${s.archived ? ' | Archived' : ''}`,
    // The branch name to use, with this item's own prefix (sample run c, round 3: wi-001 for TV2-001).
    ...(isTerminal(s.status) ? [] : [`Worktree branch for this item: ${branch.branch} (folder ${branch.folder})`]),
    '',
  ];
  const text = composeDoc(rec.meta, rec.body);
  out(ctx, withChanges(changes, [...header, text.replace(/\s+$/, '')]), {
    ok: true, id: rec.id, item: s, meta: rec.meta, body: rec.body, location: rec.location, path: rec.path || null, worktreeBranch: isTerminal(s.status) ? null : branch,
    design: design ? { status: design.meta.status, location: design.location, path: design.path || null }
      : inherited ? { status: 'approved', inheritedFrom: inherited.id, location: inherited.location, path: inherited.path || null } : null,
    changes,
  });
  return EXIT.OK;
}

/**
 * The worktree branch and folder for an item: claude/<prefix>-<number>-<slug>,
 * with the item's own prefix in lower case (tv2-001 for TV2-001), so
 * `toolkit work` finds the item from the branch name.
 */
export function worktreeBranch(id, title) {
  const slug = slugify(title || '', 30) || 'work';
  const name = `${String(id).toLowerCase()}-${slug}`;
  return { branch: `claude/${name}`, folder: `.claude/worktrees/${name}` };
}

/** The parent's design when it is approved: { id, location, path }, else null. */
async function parentDesignOf(tracker, parent) {
  if (!parent || parent === 'none') return null;
  try {
    const d = await tracker.getDesign(parent);
    if (d && d.meta && d.meta.status === 'approved') return { id: canonicalId(parent, tracker.prefix) || parent, location: d.location, path: d.path || null };
  } catch {
    // A parent that cannot be read: the item shows no design, as before.
  }
  return null;
}

async function cmdEdit(ctx, tracker, project, args, changes) {
  const id = needId(args, 'edit');
  const f = args.flags;
  const text = await textArg(ctx, f);
  const res = await opEdit(tracker, id, {
    section: one(f, 'section'),
    text,
    appendRow: one(f, 'append-row'),
    label: one(f, 'label'),
    value: one(f, 'value'),
    removeGuide: Boolean(f['remove-guide']),
    today: tracker.today ? tracker.today() : undefined,
  });
  const what = f['remove-guide'] ? 'the fill-in guide' : has(f, 'label') ? `"${one(f, 'label')}"` : `"${one(f, 'section')}"`;
  if (f['remove-guide']) {
    const line = res.changed ? `Removed the template's fill-in guide from ${res.id}.` : `${res.id} has no fill-in guide; nothing changed.`;
    out(ctx, withChanges(changes, [line]), { ok: true, id: res.id, changed: res.changed, location: res.record.location, changes });
    return EXIT.OK;
  }
  const line = res.changed ? `Saved ${what} in ${res.id}.` : `${res.id}: ${what} already had that text; nothing changed.`;
  const lines = [line];
  const warnings = res.warnings || [];
  // What the edit itself broke, so it is fixed now and not found sessions later.
  for (const w of warnings) lines.push(`${w.level === 'error' ? 'Error' : w.level === 'question' ? 'Question for the owner' : 'Warning'} after this edit: ${w.message}`);
  out(ctx, withChanges(changes, lines), { ok: true, id: res.id, changed: res.changed, location: res.record.location, warnings, changes });
  return EXIT.OK;
}

async function cmdSet(ctx, tracker, project, args, changes) {
  const id = needId(args, 'set');
  const f = args.flags;
  const lines = [];
  const data = { ok: true, id: canonicalId(id, tracker.prefix) || id, changes };
  const fields = { stage: one(f, 'stage'), waitingOn: one(f, 'waiting-on'), priority: one(f, 'priority'), type: one(f, 'type'), delivery: one(f, 'delivery'), title: one(f, 'title') };
  const setting = Object.values(fields).some((v) => v !== undefined) || f.reopen;
  const setOpts = { ...fields, reopen: Boolean(f.reopen), note: one(f, 'note') };
  const today = tracker.today ? tracker.today() : undefined;
  if (has(f, 'parent')) {
    // Check the other changes first, so a refused gate never follows a move that already happened.
    if (setting) await opSet(tracker, id, setOpts, { today, dryRun: true });
    const p = String(one(f, 'parent')).trim();
    const moved = await opMove(tracker, id, p.toLowerCase() === 'none' ? 'root' : p, { today });
    data.move = moved;
    lines.push(moved.unchanged ? `${moved.id} is already there.` : `Moved ${moved.id}${moved.to ? ` to ${moved.to}` : ''}. Parent: ${moved.parentAfter}.`);
  }
  if (setting) {
    const res = await opSet(tracker, id, setOpts, { today, ownerName: project && project.config && project.config.project ? project.config.project.owner || null : null });
    data.set = { changed: res.changed, changes: res.changes, item: summaryOf(res.record) };
    if (res.changed) {
      const s = summaryOf(res.record);
      lines.push(`Updated ${res.id}: ${res.changes.join('; ')}.`, `Now ${s.stageLabel} (${s.status}). Continue with ${s.continueWith}.`);
    } else lines.push(`${res.id} already has those values; nothing changed.`);
    if (res.closedQuestions && res.closedQuestions.length) lines.push(`Marked ${res.closedQuestions.join(', ')} Answered: ${res.closedQuestions.length === 1 ? 'it' : 'they'} asked for this delivery choice.`);
    if (res.clearedWaiting) lines.push('It is no longer waiting on the owner (waiting_on: none).');
    if (res.stillWaiting && res.stillWaiting.length) lines.push(`It still waits on the owner for ${res.stillWaiting.join(', ')} (waiting_on: owner).`);
    for (const w of res.warnings || []) lines.push(`Note: ${w}`);
    for (const n of res.notes || []) lines.push(n);
    data.closedQuestions = res.closedQuestions || [];
    data.warnings = res.warnings || [];
    data.notes = res.notes || [];
    if (res.folder) data.folder = res.folder;
  } else if (!has(f, 'parent')) {
    throw new ToolkitError(EXIT.INVALID, 'Nothing to set. Give at least one of --stage, --waiting-on, --priority, --type, --delivery, --title, --parent.');
  }
  out(ctx, withChanges(changes, lines), data);
  return EXIT.OK;
}

async function cmdApprove(ctx, tracker, project, args, changes) {
  const id = needId(args, 'approve');
  const f = args.flags;
  const whats = ['requirements', 'design', 'result'].filter((w) => f[w]);
  if (whats.length !== 1) throw new ToolkitError(EXIT.INVALID, 'Give exactly one of --requirements, --design, or --result.');
  const res = await opApprove(tracker, project, id, { what: whats[0], by: one(f, 'by'), today: tracker.today ? tracker.today() : undefined });
  const s = summaryOf(res.record);
  const lines = [`Recorded: ${res.what} of ${res.id} approved (${res.approval}).`];
  if (res.clearedWaiting) lines.push('It is no longer waiting on the owner (waiting_on: none).');
  if (res.closedQuestions && res.closedQuestions.length) lines.push(`Marked ${res.closedQuestions.join(', ')} Answered: ${res.closedQuestions.length === 1 ? 'it' : 'they'} asked for this approval.`);
  if (res.stillWaiting && res.stillWaiting.length) lines.push(`It still waits on the owner for ${res.stillWaiting.join(', ')} (waiting_on: owner).`);
  lines.push(`Now ${s.stageLabel} (${s.status}). Continue with ${s.continueWith}.`);
  for (const w of res.warnings) lines.push(`Note: ${w}`);
  out(ctx, withChanges(changes, lines), { ok: true, id: res.id, approved: res.what, approval: res.approval, clearedWaiting: Boolean(res.clearedWaiting), stillWaiting: res.stillWaiting || [], closedQuestions: res.closedQuestions || [], warnings: res.warnings, item: s, changes });
  return EXIT.OK;
}

async function cmdDesign(ctx, tracker, project, args, changes) {
  const id = needId(args, 'design');
  const f = args.flags;
  const text = await textArg(ctx, f);
  const res = await opDesign(tracker, project, id, {
    create: Boolean(f.create), text, status: one(f, 'status'), by: one(f, 'by'), today: tracker.today ? tracker.today() : undefined,
  });
  const d = res.design;
  if (!res.changed && res.existed) {
    out(ctx, withChanges(changes, [`${res.id} already has a design (${d.meta.status}) at ${d.path || d.location}; nothing changed.`]), {
      ok: true, id: res.id, created: false, existed: true, status: d.meta.status, location: d.location, path: d.path || null, changes,
    });
    return EXIT.OK;
  }
  if (!res.changed) {
    const full = composeDoc(d.meta, d.body, ['work_item', 'status', 'approved']);
    out(ctx, withChanges(changes, [`Design of ${res.id} (${d.meta.status}) at ${d.path || d.location}`, '', full.replace(/\s+$/, '')]), {
      ok: true, id: res.id, meta: d.meta, body: d.body, location: d.location, path: d.path || null, changes,
    });
    return EXIT.OK;
  }
  const lines = [`${res.created ? 'Created' : 'Saved'} the design of ${res.id} (${d.meta.status}) at ${d.path || d.location}.`];
  for (const w of res.warnings || []) lines.push(`Note: ${w}`);
  if (d.meta.status === 'proposed') lines.push('It is proposed until the owner approves it: toolkit work approve <id> --design --by <name>.');
  out(ctx, withChanges(changes, lines), { ok: true, id: res.id, created: Boolean(res.created), status: d.meta.status, location: d.location, path: d.path || null, warnings: res.warnings || [], changes });
  return EXIT.OK;
}

async function cmdHistory(ctx, tracker, project, args, changes) {
  const id = needId(args, 'history');
  const f = args.flags;
  const res = await opHistory(tracker, id, { note: one(f, 'note'), effect: one(f, 'effect'), today: tracker.today ? tracker.today() : undefined });
  out(ctx, withChanges(changes, [`Added a Recent History row to ${res.id}.`]), { ok: true, id: res.id, changes });
  return EXIT.OK;
}

async function cmdMove(ctx, tracker, project, args, changes) {
  const id = needId(args, 'move');
  const f = args.flags;
  if (!has(f, 'under')) throw new ToolkitError(EXIT.INVALID, '--under <id|group|archive|root> is required.');
  const res = await opMove(tracker, id, one(f, 'under'), { today: tracker.today ? tracker.today() : undefined });
  const lines = res.unchanged
    ? [`${res.id} is already at ${res.to}; nothing moved.`]
    : [`Moved ${res.id}${res.nested ? ` and its ${res.nested} nested item${res.nested === 1 ? '' : 's'}` : ''} from ${res.from} to ${res.to}.`, `Parent: ${res.parentAfter}${res.archived ? '. It is archived: hidden from the briefing and toolkit work next.' : '.'}`];
  out(ctx, withChanges(changes, lines), { ok: true, ...res, changes });
  return EXIT.OK;
}

async function cmdFinish(ctx, tracker, project, args, changes) {
  const id = needId(args, 'finish');
  const f = args.flags;
  const res = await opFinish(tracker, id, { by: one(f, 'by'), evidence: one(f, 'evidence'), quote: one(f, 'quote'), allowOpenSubItems: Boolean(f['allow-open-sub-items']), today: tracker.today ? tracker.today() : undefined });
  const lines = [`${res.id} is Done. Result approval: ${res.resultApproval}.`];
  if (res.openSubItems.length) lines.push(`Open sub-items left: ${res.openSubItems.map((k) => `${k.id} (${k.status})`).join(', ')}.`);
  for (const w of res.warnings || []) lines.push(`Note: ${w}`);
  // Every finished item is backed up at once (decision 13): the tracker and
  // built-in memory are Git-ignored and exist only on this computer.
  const { autoBackup } = await import('../project/backup.mjs');
  const backup = await autoBackup(project, { env: ctx.env, fetch: ctx.fetch });
  if (backup.line) lines.push(backup.line);
  out(ctx, withChanges(changes, lines), {
    ok: true, id: res.id, status: 'Done', resultApproval: res.resultApproval, openSubItems: res.openSubItems, warnings: res.warnings || [], changes,
    backup: { status: backup.status, dir: backup.dir || null, parts: backup.parts, errors: backup.errors },
  });
  return EXIT.OK;
}

async function cmdCancel(ctx, tracker, project, args, changes) {
  const id = needId(args, 'cancel');
  const f = args.flags;
  const res = await opCancel(tracker, id, { reason: one(f, 'reason'), by: one(f, 'by'), today: tracker.today ? tracker.today() : undefined });
  const lines = [`${res.id} is Cancelled.`];
  if (res.openSubItems.length) lines.push(`Its open sub-items need a decision: ${res.openSubItems.map((k) => `${k.id} (${k.status})`).join(', ')}.`);
  out(ctx, withChanges(changes, lines), { ok: true, id: res.id, status: 'Cancelled', openSubItems: res.openSubItems, changes });
  return EXIT.OK;
}

async function itemsWithBodies(tracker) {
  return withDesignBodies(tracker, await listItems(tracker, { fetchBodies: true }));
}

async function cmdNext(ctx, tracker, project, args, changes) {
  const items = await itemsWithBodies(tracker);
  const ranked = rankNext(items);
  const wt = safeWorktree(ctx.cwd, tracker.prefix);
  const decisions = collectOwnerDecisions(items, { ownerName: project.config.project && project.config.project.owner });
  let pick = null;
  let reason = '';
  const mine = wt.id ? items.find((i) => i.id === wt.id && !i.archived && !isTerminal(i.meta.status)) : null;
  if (mine) {
    pick = mine;
    reason = `This worktree's branch ${wt.branch} names ${mine.id}.`;
  } else if (ranked.length) {
    pick = ranked[0];
    reason = `${pick.meta.status}, priority ${pick.meta.priority || 'medium'}, not blocked.`;
  }
  const lines = [];
  if (pick) {
    const s = summaryOf(pick);
    const next = getLabel(pick.body || '', 'Next action', { section: 'Overview' });
    lines.push(`Next: ${s.id} ${s.title} (${s.stageLabel}, ${s.status}). ${reason}`);
    if (next && !isPlaceholder(next)) lines.push(`Next action: ${next}`);
    lines.push(`Continue with ${s.continueWith}.`);
  } else {
    const backlog = items.filter((i) => !i.archived && i.meta.status === 'Backlog').length;
    lines.push(`Nothing is ready to work on.${backlog ? ` ${backlog} item${backlog === 1 ? ' is' : 's are'} in Backlog (work-requirements).` : ''}`);
  }
  const others = ranked.filter((i) => !pick || i.id !== pick.id).slice(0, 4).map(summaryOf);
  if (others.length) {
    lines.push('', 'Also ready:');
    for (const o of others) lines.push(`  ${o.id} ${o.title} (${o.stageLabel}, ${o.status})`);
  }
  if (decisions.length) lines.push('', `${decisions.length} decision${decisions.length === 1 ? ' waits' : 's wait'} on the owner (work-decide; toolkit work decisions lists them).`);
  out(ctx, withChanges(changes, lines), { ok: true, next: pick ? summaryOf(pick) : null, reason, others, waitingOnOwner: decisions.length, worktree: wt, changes });
  return EXIT.OK;
}

async function cmdDecisions(ctx, tracker, project, args, changes) {
  const items = await itemsWithBodies(tracker);
  const ownerName = project.config.project && project.config.project.owner;
  const decisions = collectOwnerDecisions(items, { ownerName });
  const agentTodos = collectAgentTodos(items, { ownerName });
  // Memory records saved as proposals wait for the owner's yes or no too
  // (Mike, 2026-09-27: an unanswered "Save to memory?" is listed here until he answers).
  const memory = await collectMemoryProposals(project, { env: ctx.env });
  const proposals = memory.proposals;
  const count = decisions.length + proposals.length;
  const lines = [];
  if (!count) lines.push('Nothing is waiting on the owner.');
  else {
    lines.push(`${count} decision${count === 1 ? ' waits' : 's wait'} on the owner:`);
    let current = null;
    for (const d of decisions) {
      if (d.id !== current) {
        current = d.id;
        lines.push('', `${d.id} ${d.title}`);
      }
      lines.push(`  - ${d.what}${d.detail ? ` ${d.detail}` : ''} (${d.continueWith})`);
    }
    if (proposals.length) {
      lines.push('', `Memory proposals (saved, not yet approved; agents do not rely on them until the owner says yes or no):`);
      const sentence = (t) => { const x = String(t || '').trim(); return !x ? '(no description).' : /[.!?]$/.test(x) ? x : `${x}.`; };
      for (const p of proposals) {
        lines.push(`  - ${p.key}: ${sentence(p.description)}${p.saved ? ` Saved ${p.saved}.` : ''} Yes: toolkit memory approve ${p.key} --by <name>. No: toolkit memory reject ${p.key}. (work-decide)`);
      }
    }
  }
  if (memory.problem) lines.push('', `Warning: ${memory.problem}`);
  if (agentTodos.length) {
    lines.push('', 'Agent to-do (the agent\'s step, not a decision the owner is waiting on):');
    for (const t of agentTodos) lines.push(`  - ${t.what} ${t.detail} (${t.continueWith})`);
  }
  out(ctx, withChanges(changes, lines), { ok: true, count, decisions, memoryProposals: proposals, agentTodos, changes, ...(memory.problem ? { memoryProblem: memory.problem } : {}) });
  return EXIT.OK;
}

async function cmdSync(ctx, tracker) {
  const report = await tracker.sync({ quick: false });
  const lines = reportLines(report, { full: true });
  if (!lines.length) lines.push('Nothing changed: every item is where the tracker expected it, and every derived value is in step.');
  else lines.unshift('Sync report:');
  if (tracker.type === 'local') lines.push('', `Dashboard: ${TRACKER_DIR}/DASHBOARD.md`);
  out(ctx, lines, { ok: true, ...report });
  return EXIT.OK;
}

function gitignoreProblem(project) {
  const res = runProgram('git', ['check-ignore', '-q', `${TRACKER_DIR}/`], { cwd: project.mainRoot, timeoutMs: 5000 });
  if (res.code === 1) return { severity: 'warning', message: `${TRACKER_DIR}/ is not Git-ignored in ${project.mainRoot}. Add /${TRACKER_DIR}/ to .gitignore.` };
  return null;
}

async function cmdValidate(ctx, tracker, project, args, changes) {
  const target = args._[0];
  const owner = project.config.project && project.config.project.owner;
  if (target && !canonicalId(target, null) && fs.existsSync(path.resolve(ctx.cwd, target))) {
    const res = validateFile(path.resolve(ctx.cwd, target), { prefix: tracker.prefix, ownerName: owner });
    const lines = [`${res.file} (${res.kind === 'design' ? 'design' : 'work item'} ${res.id || ''}): ${res.errors.length} error${res.errors.length === 1 ? '' : 's'}, ${res.warnings.length} warning${res.warnings.length === 1 ? '' : 's'}, ${res.gates.length} approval gate problem${res.gates.length === 1 ? '' : 's'}.`];
    for (const e of res.errors) lines.push(`  Error: ${e.message}`);
    for (const g of res.gates) lines.push(`  Question for the owner: ${g.question}`);
    for (const w of res.warnings) lines.push(`  Warning: ${w.message}`);
    out(ctx, lines, { ok: res.ok, ...res });
    return res.ok ? EXIT.OK : EXIT.INVALID;
  }
  const res = await opValidate(tracker, { id: target, ownerName: owner });
  const problems = [...((changes && changes.problems) || [])];
  if (!target && tracker.type === 'local') {
    const gp = gitignoreProblem(project);
    if (gp) problems.push(gp);
    const broken = brokenOf(tracker);
    for (const b of broken) if (!problems.some((p) => p.message === b.message)) problems.push(b);
    const brokenIds = new Set(broken.map((b) => b.id).filter(Boolean));
    if (typeof tracker.knownIds === 'function') {
      const present = new Set(res.results.map((r) => r.id));
      for (const k of tracker.knownIds()) if (!present.has(k) && !brokenIds.has(k)) problems.push({ severity: 'warning', message: `${k} is known to the tracker but its record was not found (moved out of ${TRACKER_DIR}/ or deleted).` });
    }
  }
  const lines = [];
  let clean = 0;
  for (const r of res.results) {
    const d = r.design || { errors: [], warnings: [], gates: [] };
    const count = r.errors.length + r.warnings.length + r.gates.length + d.errors.length + d.warnings.length + d.gates.length;
    if (!count) {
      clean++;
      continue;
    }
    lines.push(`${r.id} (${r.location}):`);
    for (const e of r.errors) lines.push(`  Error: ${e.message}`);
    for (const g of r.gates) lines.push(`  Question for the owner: ${g.question}`);
    for (const w of r.warnings) lines.push(`  Warning: ${w.message}`);
    for (const e of d.errors) lines.push(`  Design error: ${e.message}`);
    for (const g of d.gates) lines.push(`  Design question for the owner: ${g.question}`);
    for (const w of d.warnings) lines.push(`  Design warning: ${w.message}`);
  }
  for (const p of problems) lines.push(`${p.severity === 'error' ? 'Problem' : 'Warning'}: ${p.message}`);
  const errors = res.results.reduce((n, r) => n + r.errors.length + (r.design ? r.design.errors.length : 0), 0);
  const gates = res.results.reduce((n, r) => n + r.gates.length + (r.design ? r.design.gates.length : 0), 0);
  // "questions for the owner" counted only the approval gate problems, so it
  // said 0 while Q-01 waited on him (sample runs a and d, round 3). The gate
  // problems and the open owner questions are counted apart.
  const openOwner = res.results.reduce((n, r) => n + (r.openOwnerQuestions || 0), 0);
  lines.unshift(`Checked ${res.results.length} item${res.results.length === 1 ? '' : 's'}: ${clean} clean, ${errors} error${errors === 1 ? '' : 's'}, ${gates} approval gate problem${gates === 1 ? '' : 's'}. ${openOwner ? `${openOwner} open question${openOwner === 1 ? ' waits' : 's wait'} on the owner (toolkit work decisions lists ${openOwner === 1 ? 'it' : 'them'}).` : 'No open question waits on the owner.'}`);
  const ok = res.ok && !problems.some((p) => p.severity === 'error');
  out(ctx, withChanges(changes, lines), { ok, results: res.results, problems, changes });
  return ok ? EXIT.OK : EXIT.INVALID;
}

const COMMANDS = {
  new: cmdNew,
  list: cmdList,
  show: cmdShow,
  edit: cmdEdit,
  set: cmdSet,
  approve: cmdApprove,
  design: cmdDesign,
  history: cmdHistory,
  move: cmdMove,
  finish: cmdFinish,
  cancel: cmdCancel,
  next: cmdNext,
  decisions: cmdDecisions,
  sync: cmdSync,
  validate: cmdValidate,
};

/**
 * The quick check for hand changes that runs before every work command. It
 * never stops the command itself: a read still prints its result when the
 * check fails, with the failure as a warning (sample run c, round 2: three
 * reads exited 1 because the check's own write could not be verified).
 */
export async function checkHandChanges(tracker) {
  try {
    return await tracker.sync({ quick: true });
  } catch (err) {
    const changes = { changed: false, moves: [], adopted: [], renumbered: [], ownerEdits: [], questions: [], derived: [], missing: [], problems: [] };
    changes.problems.push({ severity: 'warning', code: 'sync_failed', message: `The check for changes made by hand did not finish (${String(err && err.message ? err.message : err).replace(/\s+$/, '')}). This command ran anyway; toolkit work sync runs the check again.` });
    return changes;
  }
}

export async function run(argv, ctx) {
  const sub = argv[0];
  if (!sub || sub === 'help' || sub === '--help' || sub === '-h') {
    out(ctx, USAGE, { ok: true, usage: USAGE, commands: ['lifecycle', ...Object.keys(COMMANDS)] });
    return EXIT.OK;
  }
  if (sub === 'lifecycle') return cmdLifecycle(ctx);
  const handler = COMMANDS[sub];
  if (!handler) {
    throw new ToolkitError(EXIT.INVALID, `Unknown work command "${sub}". Commands: lifecycle, ${Object.keys(COMMANDS).join(', ')}.`, { fix: 'Run toolkit work help.' });
  }
  const args = parseArgs(argv.slice(1), SPEC);
  const project = requireProject(ctx.cwd);
  const tracker = await openTracker(project, { env: ctx.env, cwd: ctx.cwd, pluginRoot: ctx.pluginRoot });
  if (sub === 'sync') return handler(ctx, tracker, project, args);
  const changes = await checkHandChanges(tracker);
  // Hand changes found later, once a write holds the lock, are added to the same report.
  if (typeof tracker.collectReports === 'function') tracker.collectReports(changes);
  return handler(ctx, tracker, project, args, changes);
}
