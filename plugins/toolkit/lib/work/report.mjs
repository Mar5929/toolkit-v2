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
import { collectOwnerDecisions, collectAgentTodos, withDesignBodies } from './decisions.mjs';
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
    // The item's last change date, so the briefing can tell when the current
    // focus is older than the work (staleFocusLine in lib/project/brief.mjs).
    updated: meta.updated && !isPlaceholder(meta.updated) ? meta.updated : null,
  };
}

/** A record location (".work-items/cli/WI-001-x/WORK-ITEM.md") as its folder inside .work-items ("cli/WI-001-x"). */
function folderOf(loc) {
  const s = String(loc || '').replace(/^\.work-items\//, '');
  const i = s.lastIndexOf('/');
  return i === -1 ? '(the top of .work-items)' : s.slice(0, i);
}

function fileOf(loc) {
  const s = String(loc || '');
  return s.slice(s.lastIndexOf('/') + 1);
}

function lastPart(p) {
  const s = String(p || '');
  return s.slice(s.lastIndexOf('/') + 1);
}

const under = (p) => (!p || p === 'none' ? 'a top-level item' : `a sub-item of ${p}`);

/**
 * One line about a tracker change, ready to say to the owner as it is
 * (sample run a, round 3: the agent read "Renamed folder ... Its parent WI-001
 * moved too." and told Mike "WI-002 is now nested under it", which was
 * already true; what changed was the folder name). It starts with the kind of
 * change and says what changed and what stayed the same.
 */
export function moveOwnerLine(m) {
  const id = m.id;
  const before = m.parentBefore;
  const after = m.parentAfter;
  const parentChanged = after !== undefined && before !== undefined && before !== after;
  const parentPart = parentChanged
    ? (after === 'none' ? ` It is now a top-level item. It was a sub-item of ${before}.` : ` Its parent is now ${after}. It was ${under(before)}.`)
    : after !== undefined ? ` It is still ${under(after)}.` : '';
  const archPart = m.archivedAfter && !m.archivedBefore ? ` It is archived now.` : !m.archivedAfter && m.archivedBefore ? ` It is no longer archived.` : '';
  switch (m.kind) {
    case 'folder-renamed': {
      const was = lastPart(folderOf(m.from));
      const now = lastPart(folderOf(m.to));
      const rest = m.parentMoved && !parentChanged
        ? ` It moved along with its parent ${m.parentMoved}'s folder, and it is still a sub-item of ${m.parentMoved}.`
        : parentPart;
      return `Renamed folder: ${id}'s folder was renamed by hand from ${was} to ${now}; the item itself is the same.${rest}`;
    }
    case 'file-renamed':
      return `Renamed file: ${id} is now ${m.to} (was ${fileOf(m.from)}), in the same folder.${parentPart}`;
    case 'returned':
      return `Found again: ${id} was missing and is back, now in ${folderOf(m.to)}.${parentPart}${archPart}`;
    case 'reparented':
      if (after === 'none') return `Re-parented: ${id} was made a top-level item in Notion by hand. It was a sub-item of ${before}.`;
      return `Re-parented: ${id} was put under ${after} in Notion by hand. Its parent is now ${after}. It was ${under(before)}.`;
    case 'archived':
      return `Archived: ${id} was archived in Notion by hand (its Archived box was ticked), so it is hidden from the board and the briefing.`;
    case 'unarchived':
      return `Unarchived: ${id} was taken out of the archive in Notion by hand (its Archived box was cleared).`;
    default:
      if (m.withParent) return `Moved: ${id} moved along with its parent ${m.withParent}; its folder is now ${folderOf(m.to)}.`;
      return `Moved: ${id} from ${folderOf(m.from)} to ${folderOf(m.to)} (${lastPart(folderOf(m.from)) === lastPart(folderOf(m.to)) ? 'moved' : 'moved and renamed'} by hand).${parentPart}${archPart}`;
  }
}

/**
 * Plain lines for a sync report. `full` also lists the derived values brought
 * in step. A move is one line the agent can say to the owner as it is
 * (moveOwnerLine).
 */
export function reportLines(report, { full = false } = {}) {
  if (!report) return [];
  const lines = [];
  for (const m of report.moves || []) {
    if (m.withParent && !full) continue;
    lines.push(moveOwnerLine(m));
  }
  for (const a of report.adopted || []) lines.push(`Adopted: ${a.id} at ${a.location}. ${a.reason || ''}`.trim());
  for (const r of report.renumbered || []) {
    lines.push(`Renumbered a copy: ${r.location} had id ${r.from}, which ${r.originalId || r.from} at ${r.original} already uses. The copy is now ${r.to}.`);
  }
  for (const m of report.missing || []) {
    lines.push(`Missing: ${m.id}${m.title ? ` (${m.title})` : ''} was at ${m.lastLocation} and is no longer found. Ask the owner whether it was removed on purpose (then toolkit work cancel ${m.id} --reason '<the owner’s words>') or moved outside ${TRACKER_DIR}/ (work-organize).`);
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
  const items = await withDesignBodies(tracker, await listItems(tracker, { fetchBodies: true }));
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
  const ownerName = project.config.project && project.config.project.owner;
  const decisions = collectOwnerDecisions(live, { ownerName });
  const agentTodos = collectAgentTodos(live, { ownerName });
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
    agentTodos,
    next: thisItem && !isTerminal(thisItem.meta.status) ? itemSummary(thisItem) : ranked.length ? itemSummary(ranked[0]) : null,
    counts,
  };
}
