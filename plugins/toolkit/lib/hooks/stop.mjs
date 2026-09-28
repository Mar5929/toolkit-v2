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
//    not stop the save (the owner reviews every proposal). When the message
//    asks in other words ("Save it to memory?"), the hook blocks once and
//    asks for the exact form or a proposal saved by the agent (verifier,
//    2026-09-28: 3 of 4 live-run questions used other words).
// 2. Silent unless, once per turn:
//    - the owner used an explicit keep phrase this turn and nothing was
//      recorded (no memory save, work-item change, or decision), or
//    - a work-item record edited this turn still fails validation.
//    Guarded by stop_hook_active. The reason never contains a keep phrase,
//    because Codex turns it into a new user prompt. Output is JSON or nothing.

import fs from 'node:fs';
import { stopOutput } from './output.mjs';
import { findProject, baselineMoved } from './common.mjs';
import { updateSession, turnKey } from './session.mjs';
import { resolveRecorded } from './post-tool.mjs';
import { proposalQuestions, looseQuestion, normalizeSummary, proposalArgs, proposalName, proposalType, ownerWording } from './proposal.mjs';
import { CLOSEST_WHY, compareRecords } from '../memory/similar.mjs';
import { secretKind } from '../memory/contract.mjs';

/** The block for a question to save something to memory in other words than "Save to memory: <one line>?". */
export const LOOSE_REASON = "You asked the owner to save something to memory. Ask it as 'Save to memory: <one line>?' or save it now with toolkit memory save ... --proposal.";

export const KEEP_REASON = 'The owner asked this turn for something to be kept for later sessions, and nothing was recorded: no memory save, work item change, or decision. Record it with the memory-save skill (or work-on if it is a task), or say in one line why it was not recorded.';

/** How long the hook waits for one proposal save (the Stop hook timeout is 15 seconds). */
export const PROPOSAL_SAVE_MS = 10000;

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

/** Run one toolkit command in this process, with a deadline. Returns { code, json, stderr } or { timedOut: true }. */
async function runToolkit(args, { cwd, env }) {
  const { main } = await import('../cli.mjs');
  const stdout = sink();
  const stderr = sink();
  let timer;
  const deadline = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true }), PROPOSAL_SAVE_MS);
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
  if (res.timedOut) return `the save did not finish in ${PROPOSAL_SAVE_MS / 1000} seconds`;
  // With --json the error is on standard output.
  const fromJson = res.json && res.json.error && typeof res.json.error.message === 'string' ? res.json.error.message : '';
  const text = String(fromJson || res.stderr || '').replace(/^Error:\s*/, '').split('\n')[0].trim();
  return text || `toolkit memory save exited ${res.code}`;
}

/** The similar records of a refused save: [{ key, proposal, why }], or null when the save was not refused for that. */
function similarOf(res) {
  if (res.timedOut || res.code !== 2 || !res.json || !res.json.error || !res.json.error.details) return null;
  const list = res.json.error.details.similar;
  return Array.isArray(list) && list.length ? list : null;
}

/**
 * Save each unanswered "Save to memory: <summary>?" of this turn as a
 * proposal. Returns { saved: [{ key, summary }], similar: [{ summary,
 * matches: [{ key, proposal, why }] }], secret: [{ kind }], failed:
 * [{ summary, error }] }.
 */
export async function saveProposals(project, summaries, { cwd, env }) {
  const out = { saved: [], similar: [], secret: [], failed: [] };
  const ownerName = project.config.project && project.config.project.owner;
  const date = localDate(env);
  for (const summary of summaries) {
    // A secret is never saved, and never repeated in a note.
    const kind = secretKind(summary);
    if (kind) {
      out.secret.push({ kind });
      continue;
    }
    const args = proposalArgs(summary, { ownerName, date });
    let res = await runToolkit(args, { cwd, env });
    let similar = similarOf(res);
    // The same name, but not the same meaning: try once more under another name.
    if (similar && similar.every((x) => x.why === 'the same key')) {
      res = await runToolkit(proposalArgs(summary, { ownerName, date, name: `${proposalName(ownerWording(summary, ownerName), proposalType(summary, ownerName)).slice(0, 47)}-2` }), { cwd, env });
      similar = similarOf(res);
    }
    // Only about the same subject: the owner reviews every proposal, so it is saved anyway.
    if (similar && similar.every((x) => x.why === CLOSEST_WHY)) {
      res = await runToolkit([...args, '--allow-similar'], { cwd, env });
      similar = similarOf(res);
    }
    if (!res.timedOut && res.code === 0 && res.json && res.json.key) {
      out.saved.push({ key: res.json.key, summary });
    } else if (similar) {
      out.similar.push({ summary, matches: similar.map((x) => ({ key: x.key, proposal: Boolean(x.proposal), why: x.why })) });
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
    lines.push(`At the end of the last turn the toolkit saved the unanswered "Save to memory: ${s.summary}?" as a memory proposal: ${s.key}. It is not a fact. If the owner answers it now, his yes is toolkit memory approve ${s.key} --by <name> and his no is toolkit memory reject ${s.key}; otherwise work-decide asks him later.`);
  }
  for (const s of result.similar || []) {
    const proposals = s.matches.filter((m) => m.proposal).map((m) => m.key);
    const records = s.matches.filter((m) => !m.proposal).map((m) => m.key);
    if (proposals.length) {
      lines.push(`The unanswered "Save to memory: ${s.summary}?" was not saved again: memory already has the proposal ${proposals.join(', ')} like it, which the owner has not answered. If he answers it now, his yes is toolkit memory approve <key> --by <name> and his no is toolkit memory reject <key>; otherwise work-decide asks him later.`);
    }
    if (records.length) {
      lines.push(`The unanswered "Save to memory: ${s.summary}?" was not saved as a proposal: memory already has ${records.join(', ')} about the same subject. Check whether it is the same fact (toolkit memory get <key>). If it is a different fact and the owner says yes, save it with toolkit memory save ... --allow-similar --approved-by <name>.`);
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

/** True when a summary is the same text as, or very like, a description the turn already saved. */
function savedThisTurn(summary, descriptions) {
  return descriptions.some((d) => normalizeSummary(d) === normalizeSummary(summary) || compareRecords({ description: d }, { description: summary }).similar);
}

export async function stop(input, io) {
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
  const questions = proposalQuestions(message);
  await updateSession(project, io.host, input, io.env, (state) => {
    const turn = state.turn;
    const sameTurn = turn && !(key && turn.key && key !== turn.key);
    if (sameTurn && !turn.stopBlocked) pending = turn;
    const memoryWrites = sameTurn ? (turn.records || []).filter((r) => r.kind === 'memory') : [];
    const turnSavedProposal = memoryWrites.some((r) => r.proposal);
    // Other wording: asked about once, when the turn saved nothing to memory.
    if (!questions.length && !memoryWrites.length) loose = looseQuestion(message);
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
  const keepUnrecorded = Boolean(pending && pending.keep && !(pending.records && pending.records.length) && !baselineMoved(project, pending.baseline));

  // 2. Save the unanswered questions as proposals. Never blocks.
  let savedNow = [];
  if (asked.length) {
    const result = await saveProposals(project, asked, { cwd: project.root, env: io.env });
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
    for (const s of savedNow) reasons.push(`The question "Save to memory: ${s.summary}?" was saved as the proposal ${s.key}; the owner's own words approve it: toolkit memory approve ${s.key} --by <owner>.`);
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
