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
import { parseQuestions, parseHistory, parseTasks, isOpenOwnerQuestion, getLabel, parseRoadmap, checkGates, isTemplateRow, isPlaceholder, designHasOptions, designStatusFromBody } from './model.mjs';

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
 * that work-delegate makes once per big goal, and the acceptance check a
 * result at 11 User approval still needs. The offer is listed only while it
 * can still shape the work (stages 03 to 07), never for a finished item, and
 * not when an open question already asks it.
 * @returns {Array<{ id: string, title: string, kind: 'delivery_offer' | 'acceptance_check', what: string, detail: string, continueWith: string }>}
 */
export function collectAgentTodos(items, { ownerName } = {}) {
  const out = [];
  for (const item of items) {
    const meta = item.meta || {};
    const id = item.id || meta.id;
    if (item.archived || isTerminal(meta.status)) continue;
    // A result at 11 User approval with no acceptance check since its last
    // build: the agent starts one before asking (the owner's decision of 2026-09-28).
    if (stageNumber(meta.stage) === 11 && !isApproved(meta.result_approved) && !acceptanceCheckRecorded(item.body || '')) {
      out.push({ id, title: meta.title || '', kind: 'acceptance_check', what: acceptanceCheckNote(id, 'todo'), detail: 'It runs whoever built the change.', continueWith: 'work-check' });
    }
    // The offer is made once per goal, at the top item: a sub-item is part of
    // its parent's goal (sample run d, round 2 listed both).
    const parent = item.parent !== undefined ? item.parent : meta.parent;
    if (parent && String(parent).trim().toLowerCase() !== 'none') continue;
    const n = stageNumber(meta.stage) ?? 0;
    // Owner-led recorded by the small-item rule is looked at again once the
    // item grew: a split, a second phase, or more than two tasks (close-out
    // 2026-09-28, finding 3), while the build has not finished.
    const grown = smallItemRecorded(item) ? grownReason(item) : null;
    if (grown && n >= 3 && n <= 8) {
      out.push({ id, title: meta.title || '', kind: 'delivery_offer', what: deliveryRelookNote(id, grown), detail: 'work-delegate asks the owner once per goal.', continueWith: 'work-delegate' });
      continue;
    }
    if (n < 3 || n > 7) continue;
    if (meta.delivery && meta.delivery !== 'not-offered') continue;
    const big = bigReason(item);
    if (!big || deliveryAsked(item.body || '', ownerName)) continue;
    out.push({ id, title: meta.title || '', kind: 'delivery_offer', what: `Make the agent-led delivery offer for ${id} (${big}).`, detail: 'work-delegate asks the owner once per goal.', continueWith: 'work-delegate' });
  }
  return out;
}

// ------------------------------------------------------------------ the acceptance check

// Before the owner is asked to approve a result, one acceptance-checker that
// did not build the change checks it, whoever built it (the owner's decision
// of 2026-09-28, dev/GOAL.md; final re-review R-B1: "no agent team" skipped
// the check in 3 of 5 final runs). work-check records the check with a
// history note that holds "acceptance-checker: <its verdict>". Only that
// recorded form counts, with a verdict word in it (verifier, 2026-09-28: a
// note "Asked whether to start the acceptance-checker" counted as a check).
const CHECK_RAN = /\bacceptance[- ]checker(?:\s+agent)?(?:(?:'s|’s)\s+verdict)?\s*:\s*([^;\n]*)/gi;
/** The verdict words of the acceptance-checker agent's report (plugins/work/agents/acceptance-checker.md). */
const VERDICT = /\b(?:met|ready|pass(?:ed|es)?|fail(?:ed|s)?)\b/i;
// Words that say the check itself did not run. Only these count: "gaps: a
// manual step not run" in the same note is about the result, not the check.
const CHECK_NOT_RAN = new RegExp([
  String.raw`\bacceptance[- ]checker\s*:\s*(?:none|not run|skipped|did not run|could not run)\b`,
  String.raw`\bno (?:independent|acceptance)(?: agent)?[- ]check(?:er)?\b`,
  String.raw`\bwithout (?:an? )?(?:independent|acceptance)(?: agent)?[- ]check(?:er)?\b`,
  String.raw`\b(?:independent|acceptance)(?: agent)?[- ]check(?:er)? (?:did not|could not|didn['’]t|couldn['’]t|was not|wasn['’]t) (?:run|start)`,
].join('|'), 'i');
/** A Recent History row that starts a build or a fix: a stage change to 08 Build or 10 Bug fixing. */
const BUILD_ROW = /->\s*(?:08|10)\b/;

/**
 * True when the Recent History (newest first) shows an acceptance-checker
 * check after the last build or fix. A check before that row checked older
 * work, so it does not count.
 */
export function acceptanceCheckRecorded(body) {
  for (const row of parseHistory(body)) {
    const text = `${row.change} ${row.effect}`;
    if (checkVerdict(text) && !CHECK_NOT_RAN.test(text)) return true;
    if (BUILD_ROW.test(row.change)) return false;
  }
  return false;
}

/**
 * The words a history row carries when a result was approved or finished
 * without an independent check: `--no-independent-check --reason <text>`,
 * allowed only when the host cannot start a worker (close-out 2026-09-28,
 * R-B1 in code).
 */
export const NO_CHECK_WORDS = 'without an independent acceptance check';

/**
 * The Change column of the row `toolkit work approve --result
 * --no-independent-check --reason <text>` writes, and only that row: "Result
 * approved by <who> without an independent acceptance check: <reason>." A
 * note that only holds the words (toolkit work history --note '... without an
 * independent acceptance check yet') is not a skip (verifier, 2026-09-29).
 */
const SKIP_ROW = new RegExp(`^Result approved by \\S.*? ${NO_CHECK_WORDS}: \\S`);

/**
 * True when the Recent History (newest first), after the last build or fix,
 * shows an acceptance-checker verdict, or the result approval row that
 * --no-independent-check wrote (its reason is in that row). What toolkit work
 * finish needs. With { resultApproved: false } (the item has no recorded
 * result approval), only a verdict counts: a skip row is the approval's own
 * row, so it cannot stand without it.
 */
export function acceptanceCheckOrSkipRecorded(body, { resultApproved = true } = {}) {
  for (const row of parseHistory(body)) {
    const text = `${row.change} ${row.effect}`;
    if (checkVerdict(text) && !CHECK_NOT_RAN.test(text)) return true;
    if (resultApproved && SKIP_ROW.test(String(row.change).trim())) return true;
    if (BUILD_ROW.test(row.change)) return false;
  }
  return false;
}

/**
 * The refusal of a result approval or a finish with no acceptance check
 * recorded since the last build (exit 2). when: 'approve' or 'finish'.
 */
export function acceptanceCheckRefusal(id, when) {
  const action = when === 'finish' ? `${id} was not finished` : `The result approval of ${id} was not recorded`;
  return {
    message: `${action}: no acceptance-checker verdict is recorded since its last move to 08 Build or 10 Bug fixing. One acceptance-checker that did not build it checks the result first, whoever built it: "no agent team" or owner-led delivery does not remove it (the owner's decision of 2026-09-28). Nothing was changed.`,
    gate: 'acceptance_check_missing',
    fix: `Start one acceptance-checker now (work-check, step 3), then record its verdict: toolkit work history ${id} --note 'Checked: <what>; acceptance-checker: <its verdict>; evidence: <where>; gaps: <gaps or none>'. Then run this command again. Only when this host has no way to start a worker: add --no-independent-check --reason '<why no worker could start>', and tell the owner no independent check ran.`,
  };
}

/** True when a history text records "acceptance-checker: <verdict>" with a verdict word. */
function checkVerdict(text) {
  CHECK_RAN.lastIndex = 0;
  let m;
  while ((m = CHECK_RAN.exec(text)) !== null) {
    if (VERDICT.test(m[1])) {
      CHECK_RAN.lastIndex = 0;
      return true;
    }
  }
  return false;
}

/**
 * The note for an item at 11 User approval (when: 'stage'), a result approved
 * (when: 'approve'), or the decisions list (when: 'todo') with no acceptance
 * check recorded since its last build.
 */
export function acceptanceCheckNote(id, when) {
  const record = `record its verdict: toolkit work history ${id} --note 'Checked: <what>; acceptance-checker: <its verdict>; evidence: <where>; gaps: <gaps or none>'`;
  const noWorker = 'Only when this host has no way to start a worker, check it yourself and tell the owner that no independent check ran, and why.';
  if (when === 'approve') {
    return `No acceptance-checker check of ${id} is recorded since its last build. The owner's approval is recorded, but the independent check comes before a result approval, whoever built the change: start one acceptance-checker now (work-check, step 3), tell the owner what it finds before work-finish goes on, and ${record}. ${noWorker}`;
  }
  if (when === 'todo') {
    return `Start one acceptance-checker for ${id} before asking the owner to approve its result: no check is recorded since its last build.`;
  }
  return `${id} is at 11 User approval, and no acceptance-checker check is recorded since its last build. Before you ask the owner to approve the result, start one acceptance-checker that did not build it (work-check, step 3). It runs whoever built the change: "no agent team" or owner-led delivery does not remove it. Then ${record}. ${noWorker}`;
}

/** The words that mark owner-led delivery recorded by the small-item rule (work-delegate, agent-led-delivery.md section 1). */
const SMALL_ITEM = /\bsmall\s+item\b/i;

/**
 * True when an item's owner-led delivery was recorded by the small-item rule
 * (its newest delivery history row says "Small item"), not by the owner's
 * answer to the offer.
 */
export function smallItemRecorded(item) {
  const meta = item.meta || {};
  if (meta.delivery !== 'owner-led') return false;
  for (const row of parseHistory(item.body || '')) {
    const text = `${row.change} ${row.effect}`;
    if (/\bdelivery\s+(?:owner-led|agent-led|not-offered)\b/i.test(row.change)) return SMALL_ITEM.test(text);
  }
  return false;
}

/**
 * Why an item is no longer small, or null: sub-items, two or more roadmap
 * phases, or more than two tasks.
 */
export function grownReason(item) {
  const big = bigReason({ ...item, meta: { ...(item.meta || {}), type: 'task' } });
  if (big) return big;
  // The template's example tasks ("<Task 1 name>") are not tasks.
  const tasks = parseTasks(item.body || '').filter((t) => !isPlaceholder(t.name));
  if (tasks.length > 2) return `its plan has ${tasks.length} tasks`;
  return null;
}

/** The note when an item recorded as small grew. */
export function deliveryRelookNote(id, reason) {
  return `${id} was recorded owner-led as a small item, and now ${reason}. Look at the delivery offer again (work-delegate, section 1 of agent-led-delivery.md): a small item is one or two tasks with no sub-items.`;
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
