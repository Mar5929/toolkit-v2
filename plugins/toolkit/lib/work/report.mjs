// Shared views of the tracker for commands, the session briefing, and hooks:
// one-item summaries, plain lines for a sync report, and workSummary(), the
// whole picture the SessionStart briefing needs.
//
// workSummary never throws for a tracker the toolkit does not drive (GitHub
// Issues, Jira) or a missing Notion driver: hooks must fail open, so it returns
// { unsupported: true, message } instead.

import { EXIT } from '../core/output.mjs';
import { stageShort, continueWith, isTerminal } from './lifecycle.mjs';
import { normalizeMeta, getLabel, isPlaceholder } from './model.mjs';
import { collectOwnerDecisions } from './decisions.mjs';
import { openTracker } from './driver.mjs';
import { rankNext, listItems } from './ops.mjs';
import { worktreeItem, TRACKER_DIR } from './state.mjs';

/** The fields a list, a briefing, or JSON output shows for one item. */
export function itemSummary(item) {
  const meta = normalizeMeta(item.meta || {});
  const next = item.body ? getLabel(item.body, 'Next action', { section: 'Overview' }) : null;
  return {
    id: item.id,
    title: meta.title,
    type: meta.type,
    stage: meta.stage,
    stageLabel: stageShort(meta.stage),
    status: meta.status,
    waiting_on: meta.waiting_on,
    priority: meta.priority,
    delivery: meta.delivery,
    parent: item.parent !== undefined ? item.parent : meta.parent,
    children: item.children || [],
    archived: Boolean(item.archived),
    group: item.group || '',
    location: item.location,
    design: item.design ? item.design.status : meta.design,
    continueWith: continueWith(meta),
    nextAction: next && !isPlaceholder(next) ? next : null,
  };
}

/** Plain lines for a sync report. `full` also lists the derived values brought in step. */
export function reportLines(report, { full = false } = {}) {
  if (!report) return [];
  const lines = [];
  for (const m of report.moves || []) {
    if (m.withParent && !full) continue;
    const parentNote = m.parentAfter !== undefined && m.parentBefore !== m.parentAfter
      ? ` Its parent is now ${m.parentAfter === 'none' ? 'none (top level)' : m.parentAfter}.`
      : '';
    const archNote = m.archivedAfter && !m.archivedBefore ? ' It is now archived.' : !m.archivedAfter && m.archivedBefore ? ' It is no longer archived.' : '';
    if (m.kind === 'folder-renamed') lines.push(`Renamed folder: ${m.id} is now at ${m.to} (was ${m.from}).${parentNote}`);
    else if (m.kind === 'file-renamed') lines.push(`Renamed file: ${m.id} is now ${m.to} (was ${m.from}).`);
    else if (m.kind === 'returned') lines.push(`Found again: ${m.id} was missing and is now at ${m.to}.${parentNote}${archNote}`);
    else if (m.kind === 'reparented') lines.push(`Re-parented: ${m.id}.${parentNote}`);
    else lines.push(`Moved: ${m.id} from ${m.from} to ${m.to}.${parentNote}${archNote}${m.withParent ? ` (moved with ${m.withParent})` : ''}`);
  }
  for (const a of report.adopted || []) lines.push(`Adopted: ${a.id} at ${a.location}. ${a.reason || ''}`.trim());
  for (const r of report.renumbered || []) {
    lines.push(`Renumbered a copy: ${r.location} had id ${r.from}, which ${r.originalId || r.from} at ${r.original} already uses. The copy is now ${r.to}.`);
  }
  for (const m of report.missing || []) {
    lines.push(`Missing: ${m.id}${m.title ? ` (${m.title})` : ''} was at ${m.lastLocation} and is no longer found. Ask the owner whether it was removed on purpose (then toolkit work cancel ${m.id} --reason "<the owner's words>") or moved outside ${TRACKER_DIR}/ (work-organize).`);
  }
  for (const e of report.ownerEdits || []) lines.push(`Changed by hand: ${e.id} ${e.field} "${e.from}" -> "${e.to}". ${e.note || ''}`.trim());
  for (const q of report.questions || []) lines.push(`Question for the owner: ${q.question}`);
  if (full) for (const d of report.derived || []) lines.push(`In step: ${d.id} ${d.field} "${d.from}" -> "${d.to}".`);
  for (const p of report.problems || []) lines.push(`${p.severity === 'error' ? 'Problem' : 'Warning'}: ${p.message}`);
  return lines;
}

/**
 * Everything the session briefing needs about work items.
 * @param {{ root, mainRoot, config }} project from requireProject()
 * @param {{ cwd?: string, env?: object, pluginRoot?: string, sync?: 'quick'|'full'|false, tracker?: object }} [opts]
 *   sync: 'full' for SessionStart (a full `work sync`), 'quick' for a prompt hook, false to read only.
 * @returns {Promise<object>} { tracker, unsupported, message, report, reportLines, worktree, thisItem,
 *   active, waitingOnOwner, next, counts }
 */
export async function workSummary(project, opts = {}) {
  const { cwd = project.root, env = process.env, pluginRoot, sync = 'quick' } = opts;
  const type = String((project.config.tracker && project.config.tracker.type) || 'local');
  let tracker = opts.tracker;
  if (!tracker) {
    try {
      tracker = await openTracker(project, { env, cwd, pluginRoot });
    } catch (err) {
      if (err && err.code === EXIT.UNSUPPORTED) return { tracker: type, unsupported: true, message: err.message };
      throw err;
    }
  }
  const report = sync ? await tracker.sync({ quick: sync !== 'full' }) : null;
  const items = await listItems(tracker, { fetchBodies: true });
  let wt = { branch: null, id: null };
  try {
    wt = worktreeItem(cwd, tracker.prefix || 'WI');
  } catch {
    // Not a Git checkout.
  }
  const live = items.filter((i) => !i.archived);
  const thisItem = wt.id ? live.find((i) => i.id === wt.id) || null : null;
  const active = live
    .filter((i) => ['In Progress', 'In Review', 'Ready'].includes(i.meta.status))
    .map((i) => ({ ...itemSummary(i), thisWorktree: Boolean(thisItem && thisItem.id === i.id) }));
  const decisions = collectOwnerDecisions(live, { ownerName: project.config.project && project.config.project.owner });
  const ranked = rankNext(items);
  const counts = { backlog: 0, ready: 0, inProgress: 0, inReview: 0, done: 0, cancelled: 0, archived: items.length - live.length };
  const key = { Backlog: 'backlog', Ready: 'ready', 'In Progress': 'inProgress', 'In Review': 'inReview', Done: 'done', Cancelled: 'cancelled' };
  for (const i of live) if (key[i.meta.status]) counts[key[i.meta.status]] += 1;
  return {
    tracker: tracker.type || type,
    unsupported: false,
    report,
    reportLines: reportLines(report),
    worktree: wt,
    thisItem: thisItem ? itemSummary(thisItem) : null,
    active,
    waitingOnOwner: decisions,
    next: thisItem && !isTerminal(thisItem.meta.status) ? itemSummary(thisItem) : ranked.length ? itemSummary(ranked[0]) : null,
    counts,
  };
}
