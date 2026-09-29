// UserPromptSubmit (ARCHITECTURE section 6): start the turn in session state,
// rescan the local tracker cheaply (report items the owner moved), add one
// factual line when the prompt holds an explicit keep phrase, and pass on
// once what the Stop hook saved as a memory proposal at the end of the last
// turn (lib/hooks/stop.mjs).
//
// The rescan only reads. Derived values (parent from location, status from
// stage) are written only by toolkit work commands and the SessionStart sync
// (ARCHITECTURE 4.2), so this hook never rewrites an item file the owner may
// have open. Until one of those writes, the same change would be found on
// every prompt, so the session state keeps the tracker fingerprint last
// reported and a change is reported once per session.

import { contextOutput } from './output.mjs';
import { findProject, trackerType, recordBaseline } from './common.mjs';
import { updateSession, startTurn } from './session.mjs';
import { keepPhrase, saveWords, KEEP_LINE } from './phrases.mjs';
import { writeTurnFacts } from './turn-facts.mjs';
import { secretKind } from '../memory/contract.mjs';

async function rescan(project, io, lastReported) {
  if (trackerType(project) !== 'local') return { lines: [], fingerprint: null };
  const { checkChanged, scanTree } = await import('../work/state.mjs');
  const check = checkChanged(project.mainRoot || project.root);
  if (!check.changed) return { lines: [], fingerprint: null };
  const fingerprint = scanTree(check.trackerDir).fingerprint || null;
  if (fingerprint && fingerprint === lastReported) return { lines: [], fingerprint };
  const { openTracker } = await import('../work/driver.mjs');
  const { reportLines } = await import('../work/report.mjs');
  const tracker = await openTracker(project, { env: io.env, cwd: project.root, pluginRoot: io.pluginRoot });
  const report = await tracker.sync({ quick: true, write: false });
  return { lines: reportLines(report), fingerprint };
}

export async function userPrompt(input, io) {
  const cwd = input.cwd || io.cwd;
  const project = findProject(cwd);
  if (!project) return null;
  const prompt = String(input.prompt || '');

  let followUp = false;
  let lastReported = null;
  let proposalNotes = [];
  await updateSession(project, io.host, input, io.env, (state) => {
    // Codex turns a Stop reason into a new prompt; it is not a new request from the owner.
    if (state.lastStopReason && prompt.trim() === String(state.lastStopReason).trim()) followUp = true;
    lastReported = state.trackerReported || null;
    if (!followUp && Array.isArray(state.proposalNotes) && state.proposalNotes.length) {
      proposalNotes = state.proposalNotes;
      state.proposalNotes = [];
    }
  });
  if (followUp) return null;

  const lines = [...proposalNotes];
  const scan = await rescan(project, io, lastReported);
  if (scan.lines.length) {
    lines.push('Changes found in the work tracker since the last toolkit command (the work-organize skill handles moves and copies; the next toolkit work command brings the records in step):');
    lines.push(...scan.lines.map((l) => `- ${l}`));
  }
  const phrase = keepPhrase(prompt);
  let facts = null;
  await updateSession(project, io.host, input, io.env, (state) => {
    // Whether the reply before this prompt asked the owner about memory: this
    // prompt answers it (PostToolUse, a save that claims his approval).
    const answersMemoryQuestion = Boolean(state.lastReplyAskedMemory);
    state.lastReplyAskedMemory = false;
    const turn = startTurn(state, input);
    turn.prompted = true;
    turn.keep = phrase;
    turn.saveWords = saveWords(prompt);
    // The owner's words, so a proposal the Stop hook saves can quote a fact he
    // stated (close-out finding 5). Never a secret; at most 600 characters.
    turn.prompt = secretKind(prompt) ? null : prompt.replace(/\s+/g, ' ').trim().slice(0, 600);
    turn.answersMemoryQuestion = answersMemoryQuestion;
    turn.baseline = recordBaseline(project, io.env);
    if (scan.fingerprint) state.trackerReported = scan.fingerprint;
    facts = {
      host: io.host,
      turn: turn.n,
      key: turn.key,
      at: turn.startedAt,
      prompted: true,
      keep: turn.keep,
      saveWords: turn.saveWords,
      answersMemoryQuestion,
    };
  });
  // The facts a toolkit command run in this turn reads (lib/hooks/turn-facts.mjs):
  // a save that claims the owner's approval in a turn with no keep phrase,
  // save words, or answer to a memory question is saved as a proposal.
  if (facts && input.session_id) writeTurnFacts(project, input.session_id, facts);
  if (phrase) lines.push(KEEP_LINE);
  return lines.length ? contextOutput('UserPromptSubmit', lines.join('\n')) : null;
}
