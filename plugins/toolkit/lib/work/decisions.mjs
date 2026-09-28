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
import { readTemplate } from '../core/templates.mjs';
import { isTerminal, isApproved, stageNumber, stageShort, typeNeedsRequirements } from './lifecycle.mjs';
import { parseQuestions, isOpenOwnerQuestion, getLabel, parseRoadmap, checkGates, isTemplateRow, isPlaceholder, designHasOptions, designStatusFromBody } from './model.mjs';

// ------------------------------------------------------------------ what waits on the owner

/**
 * Collect every decision waiting on the owner: one entry per real question.
 * The general "waiting on the owner" entry is left out for an item that has a
 * more specific one (an open question, a proposed design, the stage 11 result
 * approval, a gate), so one decision is never counted twice. The agent-led
 * delivery offer is not listed here: it is the agent's step, not the owner's
 * question (collectAgentTodos lists it).
 * @param {Array<{ id: string, meta: object, body?: string, archived?: boolean, children?: string[], design?: { status?: string, body?: string } | null }>} items
 * @param {{ ownerName?: string }} [opts]
 * @returns {Array<{ id: string, title: string, kind: string, what: string, detail: string, continueWith: string }>}
 *   kind: waiting_on_owner | open_question | design_proposed | result_approval | gate
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
    const mine = [];
    const add = (kind, what, detail, skill) => mine.push({ id, title, kind, what, detail: detail || '', continueWith: skill });

    for (const g of checkGates(meta, { body })) add('gate', g.message, g.question, 'work-decide');
    if (!terminal) {
      let waiting = null;
      if (String(meta.waiting_on || '').trim().toLowerCase() === 'owner') {
        const next = getLabel(body, 'Next action', { section: 'Overview' });
        waiting = { id, title, kind: 'waiting_on_owner', what: `${id} is waiting on the owner (${stageShort(meta.stage)}).`, detail: next && !isPlaceholder(next) ? `Next action: ${next}` : '', continueWith: 'work-decide' };
      }
      const designStatus = item.design && item.design.status ? item.design.status : meta.design;
      // A design made from the template, with no option written yet, is a
      // draft: nothing waits for the owner's approval (sample run a, round 3:
      // "The design for WI-001 is proposed" while its options section said
      // only "Pending Mike's answer to Q-03"). Known only when the caller
      // read the design's text (item.design.body); otherwise it counts as proposed.
      const designBody = item.design && typeof item.design.body === 'string' ? item.design.body : null;
      const designWaits = designStatus === 'proposed' && (designBody === null || designHasOptions(designBody));
      const resultWaits = stageNumber(meta.stage) === 11 && !isApproved(meta.result_approved);
      // An open question that asks for the design choice itself is the same
      // decision as the proposed design: one line, not two (sample run a,
      // round 2: "Q-02: Which version source do you approve: Option A or B?"
      // and "The design is proposed" were counted as 2 decisions). The same
      // goes for a question that asks the owner to approve the result at
      // stage 11 (sample run c, round 3: 4 decisions listed for 2).
      const designQuestions = [];
      const resultQuestions = [];
      for (const q of parseQuestions(body)) {
        if (!isOpenOwnerQuestion(q, ownerName)) continue;
        if (designWaits && isDesignQuestion(q)) {
          designQuestions.push(q);
          continue;
        }
        if (resultWaits && isResultQuestion(q)) {
          resultQuestions.push(q);
          continue;
        }
        add('open_question', `${q.id || 'Question'}: ${q.question}`, q.affects && !isPlaceholder(q.affects) ? `Affects ${q.affects}.` : '', 'work-decide');
      }
      const askedBy = (qs) => (qs.length ? ` ${qs.map((q) => `${q.id || 'A question'} asks it: ${q.question}`).join(' ')} Recording the approval marks ${qs.length === 1 ? 'that row' : 'those rows'} Answered.` : '');
      if (designWaits) {
        add('design_proposed', `The design for ${id} is proposed and waits for the owner's approval.`, `Approve with: toolkit work approve ${id} --design --by <name>.${askedBy(designQuestions)}`, 'work-decide');
      }
      if (resultWaits) {
        add('result_approval', `${id} is at 11 User approval: the owner reviews the result.`, `Approve with: toolkit work approve ${id} --result --by <name>.${askedBy(resultQuestions)}`, 'work-decide');
      }
      // The general entry only when nothing more specific says what he decides.
      if (waiting && !mine.length) mine.push(waiting);
    }
    out.push(...mine);
  }
  return out;
}

/**
 * True when an Open Questions row asks the owner to choose or approve the
 * design: it names a design option ("Option A or B?"), or it asks him to
 * approve, choose, or pick the design, an option, or an approach. A question
 * that only mentions the design ("Should the design compare two approaches?",
 * "May a team of three write the design?") is its own decision (sample run a,
 * round 3). Only the question text counts, not the Affects column.
 */
export function isDesignQuestion(q) {
  const text = String(q.question || '');
  if (/\b[Oo]ption [A-Z]\b/.test(text)) return true;
  return /\b(approve|approves|approved|choose|chooses|pick|select|go with|prefer|sign off on|accept)\b[^?.]*\b(design|option|options|approach)\b/i.test(text)
    || /\b(which|what)\b[^?.]*\b(option|approach)\b[^?.]*\b(approve|choose|pick|want|prefer|go with)\b/i.test(text)
    // "Which approach should we take: the plain file or the database?" asks
    // for the choice without a verb such as approve or pick (verifier, fix round 2).
    || /\b(which|what)\s+(?:of\s+the\s+(?:two\s+|three\s+)?)?(options?|approach(?:es)?)(?=\s*[?:,]|\s+(?:should|shall|do|does|would|will|is|are|to|for|fits|works|suits)\b)[^?]*\?/i.test(text);
}

/**
 * True when an Open Questions row asks the owner to approve or accept the
 * result ("Do you approve the TV2-001 result at 6216321?"). At stage 11 it is
 * the same decision as the result approval (sample run c, round 3).
 */
export function isResultQuestion(q) {
  const text = String(q.question || '');
  return /\b(approve|approves|accept|accepts|sign off on|happy with|ok with|okay with)\b/i.test(text)
    && /\b(result|results|build|change|changes|work|brief|output)\b/i.test(text)
    && !/\brequirement/i.test(text)
    && !isDesignQuestion(q);
}

/**
 * True when an Open Questions row asks the owner to approve the requirements
 * ("Do you approve requirements R-01 to R-03?"). Recording that approval
 * answers it, as the design and result approvals answer theirs.
 */
export function isRequirementsQuestion(q) {
  const text = String(q.question || '');
  return /\b(approve|approves|accept|accepts|sign off on|agree to|ok with|okay with|happy with)\b[^?]*\brequirements?\b/i.test(text);
}

/**
 * True when an open Open Questions row already asks the owner about agent-led
 * delivery. "Would you like agents to take responsibility for delivering
 * this?" counts (sample runs b and d, round 3: the offer was listed twice
 * because "delivering" did not match), and so does a row whose Affects says delivery.
 */
export function deliveryAsked(body, ownerName) {
  return parseQuestions(body).some((q) => isOpenOwnerQuestion(q, ownerName) && isDeliveryQuestion(q));
}

/** True when an Open Questions row asks who delivers the work: agent-led or owner-led. */
export function isDeliveryQuestion(q) {
  const text = String(q.question || '');
  return /\b(?:agent|owner)-led\b|\bteam of agents\b|\bagent team\b/i.test(text)
    || /\bagents?\b[^?]*\b(?:deliver|delivering|delivery|take responsibility|take on|take over|build it)\b/i.test(text)
    || /\bdeliver(?:y|ing)?\b[^?]*\bagents?\b/i.test(text)
    || /\bdelivery\b/i.test(q.affects || '');
}

/**
 * The agent's own steps that the tracker shows: the agent-led delivery offer
 * that work-delegate makes once per big goal. Listed only while the offer can
 * still shape the work (stages 03 to 07), never for a finished item, and not
 * when an open question already asks it.
 * @returns {Array<{ id: string, title: string, kind: 'delivery_offer', what: string, detail: string, continueWith: string }>}
 */
export function collectAgentTodos(items, { ownerName } = {}) {
  const out = [];
  for (const item of items) {
    const meta = item.meta || {};
    const id = item.id || meta.id;
    if (item.archived || isTerminal(meta.status)) continue;
    // The offer is made once per goal, at the top item: a sub-item is part of
    // its parent's goal (sample run d, round 2 listed both).
    const parent = item.parent !== undefined ? item.parent : meta.parent;
    if (parent && String(parent).trim().toLowerCase() !== 'none') continue;
    const n = stageNumber(meta.stage) ?? 0;
    if (n < 3 || n > 7) continue;
    if (meta.delivery && meta.delivery !== 'not-offered') continue;
    const big = bigReason(item);
    if (!big || deliveryAsked(item.body || '', ownerName)) continue;
    out.push({ id, title: meta.title || '', kind: 'delivery_offer', what: `Make the agent-led delivery offer for ${id} (${big}).`, detail: 'work-delegate asks the owner once per goal.', continueWith: 'work-delegate' });
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

/**
 * Read the design text of each open item whose design is proposed and whose
 * design text the tracker did not return with the list (Notion), so
 * collectOwnerDecisions can tell a draft design from one that waits for the
 * owner. A design that cannot be read is left as it was (counted as proposed).
 */
export async function withDesignBodies(tracker, items) {
  for (const item of items) {
    const meta = item.meta || {};
    const status = item.design && item.design.status ? item.design.status : meta.design;
    if (item.archived || isTerminal(meta.status) || status !== 'proposed') continue;
    if (item.design && typeof item.design.body === 'string') continue;
    try {
      // The Notion tracker reads only the design page's text (one call).
      if (typeof tracker.designBody === 'function') {
        const body = await tracker.designBody(item.id);
        if (typeof body === 'string') item.design = { ...(item.design || {}), status: (item.design && item.design.status) || designStatusFromBody(body) || status, body };
        continue;
      }
      const d = await tracker.getDesign(item.id);
      if (d) item.design = { ...(item.design || {}), status: (item.design && item.design.status) || d.meta.status, body: d.body };
    } catch {
      // Left as it was.
    }
  }
  return items;
}

/**
 * The memory records that wait for the owner's yes or no: saved proposals
 * (status needs-review), from lib/memory/proposals.mjs listProposals(project).
 * An older toolkit without that file, or a memory system that cannot be read,
 * gives an empty list and a problem line instead of an error.
 * opts go to listProposals ({ env }).
 * @returns {Promise<{ proposals: Array<{ key, description, saved, source }>, problem: string|null }>}
 */
export async function collectMemoryProposals(project, opts = {}) {
  let mod;
  try {
    mod = await import('../memory/proposals.mjs');
  } catch {
    return { proposals: [], problem: null };
  }
  if (!mod || typeof mod.listProposals !== 'function') return { proposals: [], problem: null };
  try {
    const list = await mod.listProposals(project, opts);
    return { proposals: Array.isArray(list) ? list.filter((p) => p && p.key) : [], problem: null };
  } catch (err) {
    return { proposals: [], problem: `The memory proposals could not be read (${String(err && err.message ? err.message : err).replace(/\.$/, '')}).` };
  }
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

/** The text of a new DECISIONS.md: the model's template (DECISIONS.md at the model's root), as it is. */
export function decisionsTemplate() {
  return readTemplate('decisions');
}

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
    const created = text === null;
    // A new file starts from the model's DECISIONS.md: its intro and the empty table.
    const base = created ? decisionsTemplate() : text;
    const t = findDecisionsTable(base);
    if (!t) {
      const trimmed = base.replace(/\s+$/, '');
      out = `${trimmed}${trimmed ? '\n\n' : ''}${renderTable([...DECISION_HEADERS], [DECISION_HEADERS.map((h) => row[h])])}`;
    } else {
      const cells = t.headers.map((h) => {
        const key = DECISION_HEADERS.find((k) => k.toLowerCase() === h.trim().toLowerCase());
        return key ? row[key] : '';
      });
      const tableText = base.slice(t.start, t.end);
      const updated = appendTableRow(tableText.endsWith('\n') ? tableText : `${tableText}\n`, cells, { dropPlaceholderRows: (r) => isTemplateRow(r) });
      const rest = base.slice(t.end);
      out = base.slice(0, t.start) + (tableText.endsWith('\n') || !rest ? updated : updated.replace(/\n$/, '')) + rest;
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
