// The work-item lifecycle: the fourteen stages, the six statuses, the types,
// the other field values, and the approval gates. Every tracker uses these.
// `toolkit work lifecycle` prints them; no skill repeats them.
//
// Stage rules (ARCHITECTURE 4.1):
// - Status follows stage: 01-02 Backlog, 03 Ready, 04-11 In Progress,
//   12-14 In Review.
// - Stages may be skipped, repeated, and revisited.
// - Done and Cancelled are set only by `toolkit work finish` and
//   `toolkit work cancel`, never by a stage.
// - `build` and `data-load` items cannot reach stage 03 or later without a
//   recorded requirements approval.

export const STAGES = Object.freeze([
  { id: '01-discovery', n: 1, name: 'Discovery', label: 'Working out what the owner wants.', status: 'Backlog', next: ['work-requirements'] },
  { id: '02-refinement', n: 2, name: 'Refinement', label: 'Turning that into requirements.', status: 'Backlog', next: ['work-requirements'] },
  { id: '03-requirements-approved', n: 3, name: 'Requirements approved', label: 'The owner approved the requirements.', status: 'Ready', next: ['solution-design', 'work-on'] },
  { id: '04-solution-design', n: 4, name: 'Solution design', label: 'Deciding how it gets built.', status: 'In Progress', next: ['solution-design'] },
  { id: '05-breakdown', n: 5, name: 'Breakdown', label: 'Splitting work that is too large.', status: 'In Progress', next: ['work-organize'] },
  { id: '06-implementation-plan', n: 6, name: 'Implementation plan', label: 'Ordering the build steps.', status: 'In Progress', next: ['work-on'] },
  { id: '07-tracking-setup', n: 7, name: 'Tracking setup', label: 'Creating build tracking when needed.', status: 'In Progress', next: ['work-on'] },
  { id: '08-build', n: 8, name: 'Build', label: 'Producing the requested change.', status: 'In Progress', next: ['work-on'] },
  { id: '09-testing', n: 9, name: 'Testing', label: 'Checking it against the requirements.', status: 'In Progress', next: ['work-check'] },
  { id: '10-bug-fixing', n: 10, name: 'Bug fixing', label: 'Fixing what testing found.', status: 'In Progress', next: ['work-check'] },
  { id: '11-user-approval', n: 11, name: 'User approval', label: 'The owner reviews the result.', status: 'In Progress', next: ['work-check'] },
  { id: '12-pr-and-push', n: 12, name: 'Pull request and push', label: 'Repository work is in a pushed pull request.', status: 'In Review', next: ['work-finish'] },
  { id: '13-deployment', n: 13, name: 'Deployment', label: 'The result is put where it belongs.', status: 'In Review', next: ['work-finish'] },
  { id: '14-spec-update', n: 14, name: 'Specification update', label: 'Lasting specifications match the result.', status: 'In Review', next: ['work-finish'] },
]);

export const STATUSES = Object.freeze(['Backlog', 'Ready', 'In Progress', 'In Review', 'Done', 'Cancelled']);
export const TERMINAL_STATUSES = Object.freeze(['Done', 'Cancelled']);
export const ACTIVE_STATUSES = Object.freeze(['Ready', 'In Progress', 'In Review']);

export const STATUS_MEANINGS = Object.freeze({
  Backlog: 'Logged; requirements are still being worked out (stages 01-02).',
  Ready: 'Requirements approved; work can start (stage 03).',
  'In Progress': 'The item is active (stages 04-11). It does not mean building has started.',
  'In Review': 'The result is in a pull request, being deployed, or being written into the specifications (stages 12-14).',
  Done: 'The owner accepted the result. Set only by toolkit work finish.',
  Cancelled: 'Work stopped without the result. Set only by toolkit work cancel.',
});

export const TYPES = Object.freeze([
  { id: 'discovery', label: 'Finding out what is needed.' },
  { id: 'solution-design', label: 'Designing how something gets built.' },
  { id: 'build', label: 'Producing a change. Needs approved requirements before stage 03.' },
  { id: 'data-load', label: 'Loading or changing data. Needs approved requirements before stage 03.' },
  { id: 'repository-maintenance', label: 'Keeping the repository in order.' },
  { id: 'research', label: 'Answering a question with sources.' },
  { id: 'task', label: 'A small piece of work.' },
  { id: 'bug', label: 'Something that does not work as it should.' },
  { id: 'enhancement', label: 'An improvement to something that works.' },
]);
export const TYPE_IDS = Object.freeze(TYPES.map((t) => t.id));
export const DEFAULT_TYPE = 'task';

export const PRIORITIES = Object.freeze(['urgent', 'high', 'medium', 'low']);
export const DEFAULT_PRIORITY = 'medium';
export const DELIVERY = Object.freeze(['agent-led', 'owner-led', 'not-offered']);
export const DESIGN_STATUSES = Object.freeze(['proposed', 'approved', 'superseded']);
export const ITEM_DESIGN_VALUES = Object.freeze(['proposed', 'approved', 'superseded', 'none']);

/** The work-item frontmatter keys, in the order they are written (ARCHITECTURE 4.2). */
export const FIELD_ORDER = Object.freeze([
  'id', 'title', 'type', 'stage', 'status', 'parent', 'waiting_on', 'priority',
  'delivery', 'requirements_approved', 'design', 'result_approved', 'updated',
]);
/** Keys from the older model template that V2 drops. */
export const DROPPED_FIELDS = Object.freeze(['active_phase', 'requirements_status']);
/** The DESIGN.md frontmatter keys, in order. */
export const DESIGN_FIELD_ORDER = Object.freeze(['work_item', 'status', 'approved']);

/** The skills that continue each stage, from SKILL-INDEX 2.1. */
export const CONTINUE_TERMINAL = 'work-finish';
/** What a Done or Cancelled item continues with: nothing (sample runs a and d, round 3). */
export const CONTINUE_FINISHED = 'nothing (finished)';
export const CONTINUE_WAITING_ON_OWNER = 'work-decide';
/** An item that breaks an approval gate continues here: the owner answers the gate question first. */
export const CONTINUE_GATE = 'work-decide';

export const APPROVAL_RULES = Object.freeze([
  'Only the owner\'s explicit words count as approval. Quote them in the record.',
  'A question, a suggestion, a tentative answer, or a saved draft is not approval.',
  'Approval never covers merge, deployment, spending, or publishing.',
  'Approval survives later stages. A stage alone does not prove approval: check the approval field.',
  'A hand change that skips a gate is kept and reported as a question for the owner. It is never reverted.',
]);

export const GATES = Object.freeze([
  { gate: 'Requirements approval', askedBy: 'work-requirements', command: 'toolkit work approve <id> --requirements --by <name>', rule: 'build and data-load items cannot reach stage 03 or later without it. Sets stage 03 when the item is earlier.' },
  { gate: 'Design approval', askedBy: 'solution-design', command: 'toolkit work approve <id> --design --by <name>', rule: 'The design stays proposed until the owner approves it.' },
  { gate: 'Result approval (stage 11)', askedBy: 'work-check', command: 'toolkit work approve <id> --result --by <name>', rule: 'The owner approves the result before it is finished.' },
  { gate: 'Done', askedBy: 'work-finish', command: 'toolkit work finish <id> --by <name> --evidence <text> [--quote <owner\'s words>]', rule: 'Only this command sets Done. With no recorded result approval it needs --quote, the owner\'s own words approving the result, and records that approval.' },
  { gate: 'Cancel', askedBy: 'work-finish', command: 'toolkit work cancel <id> --reason <text>', rule: 'Only this command sets Cancelled. The reason is the owner\'s words.' },
  { gate: 'Delivery offer and team', askedBy: 'work-delegate', command: 'toolkit work set <id> --delivery agent-led|owner-led', rule: 'Offered once per goal; the detail goes in Notes > Decisions and context.' },
  { gate: 'Project-wide decision', askedBy: 'work-decide', command: 'toolkit decision add --decision <text> --why <text> --by <name>', rule: 'A row in DECISIONS.md at the project root.' },
]);

// ------------------------------------------------------------------ stages

const STAGE_BY_ID = new Map(STAGES.map((s) => [s.id, s]));

function simplify(text) {
  return String(text).trim().toLowerCase().replace(/[\s_]+/g, '-');
}

/**
 * The stage object for a value, or null. Accepts the full id (`08-build`),
 * a number (`8`, `08`), or a name (`build`, `bug fixing`, `Build`).
 */
export function findStage(value) {
  if (value === null || value === undefined) return null;
  const raw = simplify(value);
  if (!raw) return null;
  if (STAGE_BY_ID.has(raw)) return STAGE_BY_ID.get(raw);
  if (/^\d{1,2}$/.test(raw)) return STAGES.find((s) => s.n === Number(raw)) || null;
  const m = /^(\d{1,2})-(.+)$/.exec(raw);
  if (m) {
    const byNumber = STAGES.find((s) => s.n === Number(m[1]));
    if (byNumber && byNumber.id.slice(3) === m[2]) return byNumber;
    return null;
  }
  return STAGES.find((s) => s.id.slice(3) === raw || simplify(s.name) === raw) || null;
}

/** The stage id (`08-build`) for a value, or null when it is not a known stage. */
export function normalizeStage(value) {
  const s = findStage(value);
  return s ? s.id : null;
}

/** The stage number 1-14, or null. */
export function stageNumber(value) {
  const s = findStage(value);
  return s ? s.n : null;
}

/** The status a stage sets: Backlog, Ready, In Progress, or In Review. Null for an unknown stage. */
export function statusForStage(value) {
  const s = findStage(value);
  return s ? s.status : null;
}

/** A short plain label: "08 Build". */
export function stageShort(value) {
  const s = findStage(value);
  if (!s) return value ? String(value) : 'no stage';
  return `${String(s.n).padStart(2, '0')} ${s.name}`;
}

/**
 * The approval gates an item's frontmatter breaks, as codes. model.checkGates
 * gives the same gates with messages (and one more that needs the body).
 * - requirements_not_approved: a build or data-load item at stage 03 or later
 *   (or Ready, In Progress, In Review, Done) with no recorded requirements approval.
 * - done_without_result_approval: Done with no recorded result approval.
 * @returns {string[]}
 */
export function brokenGates(meta = {}) {
  const codes = [];
  const n = stageNumber(meta.stage);
  if (typeNeedsRequirements(meta.type) && !isApproved(meta.requirements_approved)) {
    const active = ['Ready', 'In Progress', 'In Review', 'Done'].includes(meta.status);
    if ((n !== null && n >= 3) || active) codes.push('requirements_not_approved');
  }
  if (meta.status === 'Done' && !isApproved(meta.result_approved)) codes.push('done_without_result_approval');
  return codes;
}

/**
 * The skill that continues an item, from its frontmatter.
 * - A broken approval gate (brokenGates) goes to work-decide: the owner answers first.
 * - waiting_on: owner goes to work-decide.
 * - Done and Cancelled continue with nothing: the work is finished.
 * - Stage 11 with the result approval recorded goes to work-finish.
 * - Otherwise the stage's first continuing skill.
 */
export function continueWith(meta = {}) {
  const { stage, status, waiting_on: waitingOn } = meta || {};
  if (brokenGates(meta || {}).length) return CONTINUE_GATE;
  if (waitingOn && String(waitingOn).trim().toLowerCase() === 'owner' && !isTerminal(status)) return CONTINUE_WAITING_ON_OWNER;
  if (isTerminal(status)) return CONTINUE_FINISHED;
  const s = findStage(stage);
  if (!s) return 'work-on';
  if (s.n === 11 && isApproved(meta.result_approved)) return CONTINUE_TERMINAL;
  return s.next[0];
}

/** Every skill that may continue a stage, for the lifecycle table. */
export function continueChoices(stage) {
  const s = findStage(stage);
  return s ? [...s.next] : ['work-on'];
}

// ------------------------------------------------------------------ statuses and types

export function isStatus(value) {
  return STATUSES.includes(value);
}

export function normalizeStatus(value) {
  if (value === null || value === undefined) return null;
  const v = String(value).trim().toLowerCase().replace(/[\s_-]+/g, ' ');
  return STATUSES.find((s) => s.toLowerCase() === v) || null;
}

export function isTerminal(status) {
  return TERMINAL_STATUSES.includes(status);
}

export function isKnownType(type) {
  return TYPE_IDS.includes(type);
}

/** Any lower-case kebab-case word is a valid type; the known ones are listed in TYPES. */
export function isValidType(type) {
  return typeof type === 'string' && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(type);
}

/** True for the types that cannot reach stage 03 without recorded requirements approval. */
export function typeNeedsRequirements(type) {
  return type === 'build' || type === 'data-load';
}

export function normalizePriority(value) {
  if (value === null || value === undefined) return null;
  const v = String(value).trim().toLowerCase();
  return PRIORITIES.includes(v) ? v : null;
}

export function normalizeDelivery(value) {
  if (value === null || value === undefined) return null;
  const v = String(value).trim().toLowerCase().replace(/[\s_]+/g, '-');
  return DELIVERY.includes(v) ? v : null;
}

/**
 * waiting_on values: owner, agent, none, or "external: <who>".
 * Returns the normal form, or null when the value is not valid.
 */
export function normalizeWaitingOn(value) {
  if (value === null || value === undefined) return null;
  const v = String(value).trim();
  const lower = v.toLowerCase();
  if (lower === 'owner' || lower === 'agent' || lower === 'none') return lower;
  const m = /^external\s*:?\s*(.*)$/i.exec(v);
  if (m) {
    const who = m[1].trim();
    return who ? `external: ${who}` : null;
  }
  return null;
}

/** An approval value: "no", or "YYYY-MM-DD by <name>". Returns { ok, date, by }. */
export function parseApproval(value) {
  if (value === null || value === undefined) return { ok: false, approved: false, missing: true };
  const v = String(value).trim();
  if (v.toLowerCase() === 'no' || v === '') return { ok: true, approved: false };
  const m = /^(\d{4}-\d{2}-\d{2})\s+by\s+(.+)$/.exec(v);
  if (m) return { ok: true, approved: true, date: m[1], by: m[2].trim() };
  return { ok: false, approved: false };
}

export function formatApproval(date, by) {
  return `${date} by ${String(by).trim()}`;
}

export function isApproved(value) {
  return parseApproval(value).approved === true;
}

/** Everything `toolkit work lifecycle` prints, as data. */
export function lifecycleData() {
  return {
    stages: STAGES.map((s) => ({
      stage: s.id,
      name: s.name,
      label: s.label,
      status: s.status,
      continueWith: [...s.next],
    })),
    terminal: [
      { status: 'Done', continueWith: [CONTINUE_FINISHED], setBy: 'toolkit work finish <id> --by <name> --evidence <text>' },
      { status: 'Cancelled', continueWith: [CONTINUE_FINISHED], setBy: 'toolkit work cancel <id> --reason <text>' },
    ],
    waitingOnOwner: { continueWith: CONTINUE_WAITING_ON_OWNER },
    statuses: STATUSES.map((s) => ({ status: s, meaning: STATUS_MEANINGS[s] })),
    types: TYPES.map((t) => ({ type: t.id, label: t.label, needsRequirementsApproval: typeNeedsRequirements(t.id) })),
    priorities: [...PRIORITIES],
    waitingOn: ['owner', 'agent', 'external: <who>', 'none'],
    delivery: [...DELIVERY],
    gates: GATES.map((g) => ({ ...g })),
    approvalRules: [...APPROVAL_RULES],
    rules: [
      'Status follows stage: 01-02 Backlog, 03 Ready, 04-11 In Progress, 12-14 In Review.',
      'Stages may be skipped, repeated, and revisited. Record a one-line reason when a move is not obvious.',
      'Pull-request stages (12) apply only to repository work.',
      'Blocking is waiting_on plus the Overview Blockers line, never a status.',
      'An item waiting on the owner continues with work-decide, whatever its stage.',
      'An item that breaks an approval gate continues with work-decide until the owner answers.',
      'An item at 11 User approval whose result approval is recorded continues with work-finish.',
      'A Done or Cancelled item continues with nothing: it is finished. Reopen it with toolkit work set <id> --stage <s> --reopen.',
    ],
  };
}
