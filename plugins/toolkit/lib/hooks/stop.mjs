// Stop (ARCHITECTURE section 6; critique P8). Two jobs:
//
// 1. Memory proposals (final review I5; goal adjustment 2): when the turn's
//    last assistant message asks "Save to memory: <summary>?" and no proposal
//    was saved this turn, the hook saves one itself with
//    `toolkit memory save --proposal` (lib/hooks/proposal.mjs). It never
//    blocks for this. The next UserPromptSubmit tells the agent the key, so
//    the owner's yes becomes toolkit memory approve and his no toolkit memory
//    reject. A summary is saved at most once per session, never when the
//    turn already saved the same text, and never when it looks like a
//    secret. A record found only because it is about the same subject does
//    not stop the save (the owner reviews every proposal). Concept memory
//    (Mike, 2026-09-28): when the save says the fact belongs in an existing
//    concept, the proposal names that concept and a section heading, and the
//    owner's yes (toolkit memory approve) adds it there. When the message
//    asks in other words ("Save it to memory?"), the hook blocks once and
//    asks for the exact form or a proposal saved by the agent (verifier,
//    2026-09-28: 3 of 4 live-run questions used other words).
// 2. Silent unless, once per turn:
//    - the owner used an explicit keep phrase this turn and nothing was
//      recorded (no rule, memory save, work-item change, or decision; a rule
//      counts from its command or from a change to an owner-preferences.md
//      file, verifier 2026-09-29), or
//    - a work-item record edited this turn still fails validation.
//    Guarded by stop_hook_active. The reason never contains a keep phrase,
//    because Codex turns it into a new user prompt. Output is JSON or nothing.

import fs from 'node:fs';
import { stopOutput } from './output.mjs';
import { findProject, baselineMoved } from './common.mjs';
import { updateSession, turnKey } from './session.mjs';
import { resolveRecorded } from './post-tool.mjs';
import { proposalQuestions, looseQuestion, memoryQuestionAsked, namesOpenProposal, normalizeSummary, proposalArgs, proposalName, proposalType, ownerWording, statedInPrompt, proposalRuleSection } from './proposal.mjs';
import { CLOSEST_WHY, compareRecords } from '../memory/similar.mjs';
import { secretKind } from '../memory/contract.mjs';

/** The block for a question to save something to memory in other words than "Save to memory: <one line>?". */
export const LOOSE_REASON = "You asked the owner to save something to memory. Ask it as 'Save to memory: <one line>?' or save it now with toolkit memory save ... --proposal.";

export const KEEP_REASON = 'The owner asked this turn for something to be kept for later sessions, and nothing was recorded: no rule, memory save, work item change, or decision. Record it with the memory-save skill, which picks its home (an instruction for how the agent works: toolkit rule add; a fact: memory), or with work-on if it is a task, or say in one line why it was not recorded.';

/** How long the hook waits for one proposal save (the Stop hook timeout is 15 seconds). */
export const PROPOSAL_SAVE_MS = 10000;
/**
 * The time all proposal saves of one Stop hook may take together, counted
 * from the start of the hook. The host stops the hook at 15 seconds, and the
 * rest of the hook (session state, validation, output) needs the remainder
 * (verifier, 2026-09-28: two saves in a row could each take 10 seconds).
 */
export const STOP_SAVE_BUDGET_MS = 11000;
/** A save, or a second try, is not started with less time left than this. */
export const MIN_SAVE_MS = 2500;

async function invalidEdits(project, edits) {
  if (!edits || !edits.length) return [];
  const { validateFile } = await import('../work/ops.mjs');
  const config = project.config;
  const prefix = (config.tracker && config.tracker.idPrefix) || 'WI';
  const owner = config.project && config.project.owner;
  const bad = [];
  for (const e of edits) {
    const abs = resolveRecorded(project, e.path);
    if (!fs.existsSync(abs)) continue;
    let res;
    try {
      res = validateFile(abs, { prefix, ownerName: owner });
    } catch {
      continue;
    }
    const problems = [...res.errors.map((x) => x.message), ...res.gates.map((g) => g.question || g.message)];
    if (problems.length) bad.push({ id: res.id || e.id || e.path, path: e.path, problems });
  }
  return bad;
}

function localDate(env) {
  const fixed = env && env.TOOLKIT_TODAY;
  if (fixed && /^\d{4}-\d{2}-\d{2}$/.test(fixed)) return fixed;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function sink() {
  let text = '';
  return { write: (s) => { text += s; return true; }, get text() { return text; } };
}

/**
 * Run one toolkit command in this process, with a deadline: PROPOSAL_SAVE_MS,
 * or less when the hook's own deadline (a time in milliseconds) is nearer.
 * Returns { code, json, stderr }, { timedOut: true, ms }, or, with less than
 * MIN_SAVE_MS left, { skipped: true } without running it.
 */
async function runToolkit(args, { cwd, env, deadline: until = null }) {
  const ms = Math.min(PROPOSAL_SAVE_MS, until === null ? PROPOSAL_SAVE_MS : until - Date.now());
  if (ms < MIN_SAVE_MS) return { skipped: true };
  const { main } = await import('../cli.mjs');
  const stdout = sink();
  const stderr = sink();
  let timer;
  const deadline = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true, ms }), ms);
  });
  const work = main(args, { cwd, env, stdout, stderr, stdin: '' }).then((code) => {
    let json = null;
    try {
      json = JSON.parse(stdout.text);
    } catch {
      json = null;
    }
    return { code, json, stderr: stderr.text };
  });
  try {
    return await Promise.race([work, deadline]);
  } finally {
    clearTimeout(timer);
  }
}

function errorOf(res) {
  if (res.skipped) return 'the Stop hook had too little time left to save it';
  if (res.timedOut) return `the save did not finish in ${Math.round((res.ms || PROPOSAL_SAVE_MS) / 1000)} seconds`;
  // With --json the error is on standard output.
  const fromJson = res.json && res.json.error && typeof res.json.error.message === 'string' ? res.json.error.message : '';
  const text = String(fromJson || res.stderr || '').replace(/^Error:\s*/, '').split('\n')[0].trim();
  return text || `toolkit memory save exited ${res.code}`;
}

/** The similar records of a refused save: [{ key, proposal, why }], or null when the save was not refused for that. */
function similarOf(res) {
  if (res.skipped || res.timedOut || res.code !== 2 || !res.json || !res.json.error || !res.json.error.details) return null;
  const list = res.json.error.details.similar;
  return Array.isArray(list) && list.length ? list : null;
}

/**
 * The concept a refused save said the fact belongs in (concept memory):
 * { concept, section }, or null when the save was not refused for that.
 */
function belongsOf(res) {
  if (res.skipped || res.timedOut || res.code !== 2 || !res.json || !res.json.error || !res.json.error.details) return null;
  const s = res.json.error.details.suggestion;
  return s && s.concept ? { concept: s.concept, section: s.section || null } : null;
}

/** True when a section proposal was refused because a record with its name exists. */
function nameTaken(res) {
  return !res.skipped && !res.timedOut && res.code === 2 && res.json && res.json.error && /already has a record/.test(String(res.json.error.message || ''));
}

/**
 * Save each unanswered "Save to memory: <summary>?" of this turn as a
 * proposal. Returns { saved: [{ key, summary }], similar: [{ summary,
 * matches: [{ key, proposal, why }] }], secret: [{ kind }], failed:
 * [{ summary, error }] }.
 */
export async function saveProposals(project, summaries, { cwd, env, deadline = Date.now() + STOP_SAVE_BUDGET_MS, rules = new Set(), prompt = null }) {
  const out = { saved: [], similar: [], secret: [], failed: [] };
  const ownerName = project.config.project && project.config.project.owner;
  const date = localDate(env);
  // Every save and every second try shares the hook's one deadline.
  const run = (a) => runToolkit(a, { cwd, env, deadline });
  for (const summary of summaries) {
    // A secret is never saved, and never repeated in a note.
    const kind = secretKind(summary);
    if (kind) {
      out.secret.push({ kind });
      continue;
    }
    // "Add to the project rules: X?", or an instruction for how the agent works: a rule proposal.
    const ruleForm = rules.has(normalizeSummary(summary));
    const rule = ruleForm || proposalType(summary, ownerName) === 'rule';
    const stated = statedInPrompt(summary, prompt);
    const base = { ownerName, date, rule, ruleForm, stated };
    let args = proposalArgs(summary, base);
    let res = await run(args);
    // Concept memory: the fact belongs in an existing concept, so the proposal
    // names that concept, and the owner's yes adds it there as a section.
    const belongs = rule ? null : belongsOf(res);
    let concept = null;
    if (belongs) {
      concept = belongs.concept;
      // The section heading is a few words from the fact (close-out finding 6),
      // not the whole sentence the refused save used as its title.
      args = proposalArgs(summary, { ...base, concept });
      res = await run(args);
      if (nameTaken(res)) {
        const stem = proposalName(ownerWording(summary, ownerName), proposalType(summary, ownerName)).slice(0, 40);
        res = await run(proposalArgs(summary, { ...base, concept, name: `proposal-${stem}-2` }));
      }
    }
    let similar = similarOf(res);
    // The same name, but not the same meaning: try once more under another name.
    if (similar && similar.every((x) => x.why === 'the same key')) {
      const stem = proposalName(ownerWording(summary, ownerName), rule ? 'user' : proposalType(summary, ownerName));
      res = await run(proposalArgs(summary, { ...base, name: `${rule ? 'rule-' : ''}${stem}`.slice(0, 47).replace(/-+$/, '') + '-2' }));
      similar = similarOf(res);
    }
    // Only about the same subject: the owner reviews every proposal, so it is saved anyway.
    if (similar && similar.every((x) => x.why === CLOSEST_WHY)) {
      res = await run([...args, '--allow-similar']);
      similar = similarOf(res);
    }
    if (!res.skipped && !res.timedOut && res.code === 0 && res.json && res.json.key) {
      out.saved.push({ key: res.json.key, summary, ...(concept ? { concept } : {}), ...(rule ? { rule: proposalRuleSection(summary) } : {}) });
    } else if (similar) {
      out.similar.push({ summary, ...(ruleForm ? { ruleForm: true } : {}), matches: similar.map((x) => ({ key: x.key, proposal: Boolean(x.proposal), why: x.why })) });
    } else {
      out.failed.push({ summary, error: errorOf(res) });
    }
  }
  return out;
}

/** The lines the next UserPromptSubmit gives the agent about what the Stop hook saved. */
export function proposalNotes(result) {
  const lines = [];
  for (const s of result.saved) {
    if (s.rule) {
      lines.push(`At the end of the last turn the toolkit saved the unanswered question about "${s.summary}" as a rule proposal: ${s.key}. It is an instruction for how the agent works, so a yes adds it to the project rules (.claude/rules/owner-preferences.md, section "${s.rule}"), not to memory. It is not a rule yet. If the owner answers it now, his yes is toolkit memory approve ${s.key} --by <name> (--section '<area>' for another section) and his no is toolkit memory reject ${s.key}; otherwise work-decide asks him later.`);
      continue;
    }
    const joins = s.concept ? ` for the concept ${s.concept} (his yes adds it there as a section)` : '';
    // A proposal that names no concept starts one: the agent names it on the
    // yes (toolkit memory approve refuses a one-fact proposal without --concept).
    const yes = s.concept
      ? `toolkit memory approve ${s.key} --by <name>`
      : `toolkit memory approve ${s.key} --by <name> --concept ${conceptPrefix(s.key)}<subject> (the concept it goes in: an existing one, or a new one named for its subject, with --title and --description)`;
    lines.push(`At the end of the last turn the toolkit saved the unanswered "Save to memory: ${s.summary}?" as a memory proposal${joins}: ${s.key}. It is not a fact. If the owner answers it now, his yes is ${yes} and his no is toolkit memory reject ${s.key}; otherwise work-decide asks him later.`);
  }
  for (const s of result.similar || []) {
    const proposals = s.matches.filter((m) => m.proposal).map((m) => m.key);
    const records = s.matches.filter((m) => !m.proposal).map((m) => m.key);
    // The question as it was asked: the rules form or the memory form.
    const asked = s.ruleForm ? `"Add to the project rules: ${s.summary}?"` : `"Save to memory: ${s.summary}?"`;
    if (proposals.length) {
      const [one] = proposals;
      const answer = proposals.length === 1
        ? `his yes is toolkit memory approve ${one} --by <name> and his no is toolkit memory reject ${one}`
        : `his yes is toolkit memory approve <key> --by <name> and his no is toolkit memory reject <key>, with the key of the proposal he answered`;
      lines.push(`The unanswered ${asked} was not saved again: memory already has the ${s.ruleForm ? 'rule proposal' : 'proposal'} ${proposals.join(', ')} like it, which the owner has not answered. If he answers it now, ${answer}; otherwise work-decide asks him later.`);
    }
    if (records.length) {
      const check = records.length === 1 ? `toolkit memory get ${records[0]}` : 'toolkit memory get <key> for each';
      lines.push(`The unanswered ${asked} was not saved as a proposal: memory already has ${records.join(', ')} about the same subject. Check whether it is the same fact (${check}). If it is a different fact and the owner says yes, save it with toolkit memory save ... --allow-similar --approved-by <name>.`);
    }
  }
  for (const s of result.secret || []) {
    lines.push(`The last turn asked the owner to save something to memory that looks like it holds ${s.kind}. It was not saved: secrets never go in memory. Do not save it. With the owner's yes, save only where the secret is kept, for example "The staging key is in 1Password under Staging".`);
  }
  for (const s of result.failed) {
    lines.push(`The unanswered "Save to memory: ${s.summary}?" could not be saved as a proposal (${s.error}). Save it now with toolkit memory save ... --proposal, so it is kept until the owner answers.`);
  }
  return lines;
}

/** The type prefix of a key, with its underscore: 'project_x' -> 'project_'. */
function conceptPrefix(key) {
  const m = /^([a-z]+_)/.exec(String(key ?? ''));
  return m ? m[1] : '<type>_';
}

/** True when a summary is the same text as, or very like, a description the turn already saved. */
function savedThisTurn(summary, descriptions) {
  return descriptions.some((d) => normalizeSummary(d) === normalizeSummary(summary) || compareRecords({ description: d }, { description: summary }).similar);
}

export async function stop(input, io) {
  const started = Date.now();
  const cwd = input.cwd || io.cwd;
  const project = findProject(cwd);
  if (!project) return null;
  const active = input.stop_hook_active === true || input.stop_hook_active === 'true';
  const key = turnKey(input);

  // 1. The turn's own state: what it recorded, and which summaries this session already proposed.
  let pending = null;
  let asked = [];
  let loose = null;
  const message = input.last_assistant_message;
  const asks = proposalQuestions(message, { withKind: true });
  const questions = asks.map((a) => a.summary);
  const rules = new Set(asks.filter((a) => a.rule).map((a) => normalizeSummary(a.summary)));
  let prompt = null;
  await updateSession(project, io.host, input, io.env, (state) => {
    const turn = state.turn;
    const sameTurn = turn && !(key && turn.key && key !== turn.key);
    if (sameTurn && !turn.stopBlocked) pending = turn;
    if (sameTurn && typeof turn.prompt === 'string') prompt = turn.prompt;
    const memoryWrites = sameTurn ? (turn.records || []).filter((r) => r.kind === 'memory') : [];
    const turnSavedProposal = memoryWrites.some((r) => r.proposal);
    // The next prompt answers a memory question this reply asks (PostToolUse
    // then lets a save with --approved-by through without a note).
    state.lastReplyAskedMemory = memoryQuestionAsked(message);
    // Other wording: asked about once, when the turn saved nothing to memory
    // and the question is not about a proposal memory already holds (final
    // run, claude-local problem 1: work-decide's question about an existing
    // proposal was asked a second time).
    if (!questions.length && !memoryWrites.length && !namesOpenProposal(message, state.proposedSummaries || [])) loose = looseQuestion(message);
    if (!questions.length) return;
    const done = new Set(state.proposedSummaries || []);
    const savedDescriptions = memoryWrites.map((r) => r.description).filter(Boolean);
    if (turnSavedProposal) {
      // The agent saved the proposal itself; remember the summaries so a later turn does not save them again.
      for (const q of questions) done.add(normalizeSummary(q));
    } else {
      // A question whose text this turn already saved is not proposed again.
      asked = questions.filter((q) => !done.has(normalizeSummary(q)) && !savedThisTurn(q, savedDescriptions));
      for (const q of questions) done.add(normalizeSummary(q));
    }
    state.proposedSummaries = [...done].slice(-50);
  });

  // Measured before the hook saves anything itself: a proposal the hook saves
  // is not the owner's "remember that" being recorded.
  const keepUnrecorded = Boolean(pending && pending.keep && !(pending.records && pending.records.length) && !baselineMoved(project, pending.baseline, io.env));

  // 2. Save the unanswered questions as proposals. Never blocks.
  let savedNow = [];
  if (asked.length) {
    const result = await saveProposals(project, asked, { cwd: project.root, env: io.env, deadline: started + STOP_SAVE_BUDGET_MS, rules, prompt });
    savedNow = result.saved;
    // When the owner's own keep phrase is still unrecorded, the block below
    // names the proposal to approve, so the next prompt does not call it unanswered.
    const notes = proposalNotes(keepUnrecorded && !active ? { ...result, saved: [] } : result);
    await updateSession(project, io.host, input, io.env, (state) => {
      if (notes.length) state.proposalNotes = [...(state.proposalNotes || []), ...notes].slice(-6);
      // A save that failed may be tried again when the question comes back.
      if (result.failed.length) {
        const failed = new Set(result.failed.map((f) => normalizeSummary(f.summary)));
        state.proposedSummaries = (state.proposedSummaries || []).filter((x) => !failed.has(x));
      }
      if (state.turn && result.saved.length && (!key || !state.turn.key || state.turn.key === key)) {
        for (const s of result.saved) state.turn.records.push({ kind: 'memory', what: 'toolkit memory save --proposal (Stop hook)', proposal: true, key: s.key, at: new Date().toISOString() });
      }
    });
  }

  // 3. The once-per-turn checks.
  if (active || !pending) return null;
  const reasons = [];
  if (loose) reasons.push(LOOSE_REASON);
  if (keepUnrecorded) {
    reasons.push(KEEP_REASON);
    // The owner's keep phrase is his approval: the proposal the hook just saved becomes a fact with his yes.
    for (const s of savedNow) {
      reasons.push(s.rule
        ? `The question about "${s.summary}" was saved as the rule proposal ${s.key}; the owner's own words approve it: toolkit memory approve ${s.key} --by <owner> (it is added to .claude/rules/owner-preferences.md).`
        : `The question "Save to memory: ${s.summary}?" was saved as the proposal ${s.key}; the owner's own words approve it: toolkit memory approve ${s.key} --by <owner>${s.concept ? '' : ` --concept ${conceptPrefix(s.key)}<subject>`}.`);
    }
  }
  const bad = await invalidEdits(project, pending.edits);
  for (const b of bad) {
    reasons.push(`${b.id} (${b.path}) was edited this turn and still fails validation: ${b.problems.slice(0, 2).join(' ')}${b.problems.length > 2 ? ` (and ${b.problems.length - 2} more)` : ''} Fix the file, or run toolkit work validate ${b.id} for the full list.`);
  }
  if (!reasons.length) return null;
  const reason = reasons.join(' ');
  await updateSession(project, io.host, input, io.env, (state) => {
    if (state.turn && state.turn.n === pending.n) state.turn.stopBlocked = true;
    state.lastStopReason = reason;
  });
  return stopOutput(io.host, reason);
}
