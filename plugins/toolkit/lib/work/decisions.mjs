// Decisions: what waits on the owner (`toolkit work decisions`), and the
// project-wide decision log DECISIONS.md (`toolkit decision add`, ARCHITECTURE 4.6).

import fs from 'node:fs';
import path from 'node:path';
import { atomicWrite, readText, ensureDir } from '../core/fsx.mjs';
import { withLock } from '../core/lock.mjs';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { parseTable, appendTableRow, renderTable } from '../core/markdown.mjs';
import { today as todayDate, run } from '../core/util.mjs';
import { gitInfo } from '../core/config.mjs';
import { isTerminal, isApproved, stageNumber, stageShort, typeNeedsRequirements } from './lifecycle.mjs';
import { parseQuestions, isOpenOwnerQuestion, getLabel, parseRoadmap, checkGates, isTemplateRow, isPlaceholder } from './model.mjs';

// ------------------------------------------------------------------ what waits on the owner

/**
 * Collect every decision waiting on the owner.
 * @param {Array<{ id: string, meta: object, body?: string, archived?: boolean, children?: string[], design?: { status?: string } | null }>} items
 * @param {{ ownerName?: string }} [opts]
 * @returns {Array<{ id: string, title: string, kind: string, what: string, detail: string, continueWith: string }>}
 *   kind: waiting_on_owner | open_question | design_proposed | result_approval | delivery_offer | gate
 */
export function collectOwnerDecisions(items, { ownerName } = {}) {
  const out = [];
  for (const item of items) {
    const meta = item.meta || {};
    const id = item.id || meta.id;
    const title = meta.title || '';
    const body = item.body || '';
    if (item.archived) continue;
    const terminal = isTerminal(meta.status);
    const add = (kind, what, detail, skill) => out.push({ id, title, kind, what, detail: detail || '', continueWith: skill });

    for (const g of checkGates(meta, { body })) add('gate', g.message, g.question, 'work-decide');
    if (terminal) continue;

    if (String(meta.waiting_on || '').trim().toLowerCase() === 'owner') {
      const next = getLabel(body, 'Next action', { section: 'Overview' });
      add('waiting_on_owner', `${id} is waiting on the owner (${stageShort(meta.stage)}).`, next && !isPlaceholder(next) ? `Next action: ${next}` : '', 'work-decide');
    }
    for (const q of parseQuestions(body)) {
      if (!isOpenOwnerQuestion(q, ownerName)) continue;
      add('open_question', `${q.id || 'Question'}: ${q.question}`, q.affects && !isPlaceholder(q.affects) ? `Affects ${q.affects}.` : '', 'work-decide');
    }
    const designStatus = item.design && item.design.status ? item.design.status : meta.design;
    if (designStatus === 'proposed') {
      add('design_proposed', `The design for ${id} is proposed and waits for the owner's approval.`, `Approve with: toolkit work approve ${id} --design --by <name>.`, 'work-decide');
    }
    if (stageNumber(meta.stage) === 11 && !isApproved(meta.result_approved)) {
      add('result_approval', `${id} is at 11 User approval: the owner reviews the result.`, `Approve with: toolkit work approve ${id} --result --by <name>.`, 'work-decide');
    }
    // The offer is made when work starts on a big goal (work-on, stage 03 or later), not while it is in Backlog.
    const big = (stageNumber(meta.stage) ?? 0) >= 3 ? bigReason(item) : null;
    if (big && (!meta.delivery || meta.delivery === 'not-offered')) {
      add('delivery_offer', `The agent-led delivery offer has not been made for ${id} (${big}).`, 'work-delegate asks the owner once per goal.', 'work-delegate');
    }
  }
  return out;
}

/** Why an item counts as big enough for the delivery offer, or null. */
export function bigReason(item) {
  const meta = item.meta || {};
  if (Array.isArray(item.children) && item.children.length) return `it has ${item.children.length} sub-item${item.children.length === 1 ? '' : 's'}`;
  const phases = parseRoadmap(item.body || '').filter((p) => !p.placeholder);
  if (phases.length >= 2) return `its roadmap has ${phases.length} phases`;
  const n = stageNumber(meta.stage);
  if ((typeNeedsRequirements(meta.type) || meta.type === 'solution-design') && n !== null && n >= 3) return `it is a ${meta.type} item past requirements`;
  return null;
}

/** The skill that continues each decision kind. */
export function decisionSkill(kind) {
  return kind === 'delivery_offer' ? 'work-delegate' : 'work-decide';
}

// ------------------------------------------------------------------ DECISIONS.md

export const DECISIONS_FILE = 'DECISIONS.md';
export const DECISION_HEADERS = Object.freeze(['ID', 'Date', 'Decision', 'Why', 'Decided by', 'Replaces']);
/** Inside the shared Git folder (<git-common-dir>/toolkit-v2/): the lock and the highest decision number ever given. */
export const DECISIONS_STATE_FOLDER = 'toolkit-v2';
export const DECISIONS_LOCK = 'decisions.lock';
export const DECISIONS_STATE = 'decisions.json';
/** Outside Git there is one checkout: the lock sits at the project root under this name. */
const DECISIONS_LOCK_NO_GIT = '.toolkit-decisions.lock';

export const DECISIONS_HEADER_TEXT = `# Decisions

Project-wide decisions, one row each. Add a row with \`toolkit decision add\`.
Never change or remove a row: a later decision names the one it replaces.
Decisions about one work item stay in that work item.

`;

/** Parse a decision id such as D-7, D7, or D-007. Returns the number or null. */
export function decisionNumber(value) {
  const m = /^D-?0*(\d+)$/i.exec(String(value ?? '').trim());
  return m ? Number(m[1]) : null;
}

/** Find the decisions table in DECISIONS.md text: { start, end, headers, rows, objects } or null. */
export function findDecisionsTable(text) {
  const src = String(text ?? '');
  let offset = 0;
  while (offset < src.length) {
    const t = parseTable(src.slice(offset));
    if (!t.found) return null;
    const lower = t.headers.map((h) => h.trim().toLowerCase());
    if (lower.includes('id') && lower.includes('decision')) {
      return { ...t, start: t.start + offset, end: t.end + offset };
    }
    offset += t.end > 0 ? t.end : src.length;
  }
  return null;
}

/** Every decision row: [{ id, n, date, decision, why, by, replaces }]. */
export function readDecisions(text) {
  const t = findDecisionsTable(text);
  if (!t) return [];
  return t.objects
    .filter((o, i) => !isTemplateRow(t.rows[i]))
    .map((o) => ({
      id: o.ID ?? '',
      n: decisionNumber(o.ID),
      date: o.Date ?? '',
      decision: o.Decision ?? '',
      why: o.Why ?? '',
      by: o['Decided by'] ?? '',
      replaces: o.Replaces ?? '',
    }));
}

/**
 * Where the decision lock and the high-water number live for a checkout.
 * Every worktree of one repository shares its Git common folder, so parallel
 * sessions in different worktrees use one lock and one number.
 * @returns {{ dir: string, lockName: string, stateFile: string|null, shared: boolean }}
 */
export function decisionsLockPlace(root) {
  let info = null;
  try {
    info = gitInfo(root);
  } catch {
    info = null;
  }
  if (info && info.commonDir) {
    const dir = path.join(info.commonDir, DECISIONS_STATE_FOLDER);
    return { dir, lockName: DECISIONS_LOCK, stateFile: path.join(dir, DECISIONS_STATE), shared: true };
  }
  return { dir: root, lockName: DECISIONS_LOCK_NO_GIT, stateFile: null, shared: false };
}

/** The folder of every checkout of the repository (git worktree list), or []. */
export function worktreeRoots(root) {
  const res = run('git', ['worktree', 'list', '--porcelain'], { cwd: root, timeoutMs: 10000 });
  if (res.code !== 0) return [];
  return res.stdout.split(/\r?\n/).filter((l) => l.startsWith('worktree ')).map((l) => l.slice('worktree '.length).trim()).filter(Boolean);
}

function readHighWater(stateFile) {
  if (!stateFile) return 0;
  const text = readText(stateFile);
  if (text === null) return 0;
  try {
    const n = JSON.parse(text).highWater;
    return Number.isInteger(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/**
 * Add a decision to DECISIONS.md at the project root.
 * The id is one more than the highest of: the number kept in the shared Git
 * folder (never reused), and every row in the DECISIONS.md of every worktree of
 * the repository (committed or not). It is assigned under one lock in the
 * shared Git folder, so two sessions in different worktrees never get the same id.
 * @returns {Promise<{ id: string, file: string, row: object, created: boolean }>}
 */
export async function addDecision(root, { decision, why, by, replaces, date, mainRoot } = {}) {
  for (const [flag, value] of [['--decision', decision], ['--why', why], ['--by', by]]) {
    if (!value || !String(value).trim()) {
      throw new ToolkitError(EXIT.INVALID, `${flag} is required.`, { fix: 'toolkit decision add --decision <text> --why <text> --by <name> [--replaces D-n]' });
    }
  }
  const file = path.join(root, DECISIONS_FILE);
  const place = decisionsLockPlace(root);
  if (place.shared) ensureDir(place.dir);
  return withLock(place.dir, () => {
    const text = readText(file);
    const others = new Set([mainRoot, ...(place.shared ? worktreeRoots(root) : [])].filter(Boolean).map((p) => path.resolve(p)));
    others.delete(path.resolve(root));
    const ownRows = readDecisions(text || '');
    const otherRows = [];
    for (const dir of others) {
      let t;
      try {
        t = readText(path.join(dir, DECISIONS_FILE));
      } catch {
        t = null;
      }
      if (t) otherRows.push(...readDecisions(t));
    }
    let replacesId = '';
    if (replaces && String(replaces).trim()) {
      const n = decisionNumber(replaces);
      const target = n === null ? null : ownRows.find((r) => r.n === n) || otherRows.find((r) => r.n === n);
      if (!target) {
        throw new ToolkitError(EXIT.INVALID, `--replaces ${replaces} does not name a decision in ${DECISIONS_FILE}.`, { known: ownRows.map((r) => r.id) });
      }
      replacesId = target.id;
    }
    const highest = [...ownRows, ...otherRows].reduce((m, r) => (r.n !== null && r.n > m ? r.n : m), readHighWater(place.stateFile));
    const next = highest + 1;
    const id = `D-${next}`;
    const row = { ID: id, Date: date || todayDate(), Decision: String(decision).trim(), Why: String(why).trim(), 'Decided by': String(by).trim(), Replaces: replacesId };
    let out;
    let created = false;
    if (text === null) {
      created = true;
      out = DECISIONS_HEADER_TEXT + renderTable([...DECISION_HEADERS], [DECISION_HEADERS.map((h) => row[h])]);
    } else {
      const t = findDecisionsTable(text);
      if (!t) {
        const base = text.replace(/\s+$/, '');
        out = `${base}${base ? '\n\n' : ''}${renderTable([...DECISION_HEADERS], [DECISION_HEADERS.map((h) => row[h])])}`;
      } else {
        const cells = t.headers.map((h) => {
          const key = DECISION_HEADERS.find((k) => k.toLowerCase() === h.trim().toLowerCase());
          return key ? row[key] : '';
        });
        const tableText = text.slice(t.start, t.end);
        const updated = appendTableRow(tableText.endsWith('\n') ? tableText : `${tableText}\n`, cells, { dropPlaceholderRows: (r) => isTemplateRow(r) });
        const rest = text.slice(t.end);
        out = text.slice(0, t.start) + (tableText.endsWith('\n') || !rest ? updated : updated.replace(/\n$/, '')) + rest;
      }
    }
    // The number is kept first: if writing the file fails after this, the id is skipped, never given twice.
    if (place.stateFile) atomicWrite(place.stateFile, `${JSON.stringify({ highWater: next, updated: new Date().toISOString() }, null, 2)}\n`);
    atomicWrite(file, out);
    const back = readDecisions(fs.readFileSync(file, 'utf8'));
    if (!back.some((r) => r.id === id)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${id} was not found in ${file} after writing.`, { path: file });
    }
    return { id, file, row, created };
  }, { name: place.lockName });
}
