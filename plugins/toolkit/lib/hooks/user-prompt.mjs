// UserPromptSubmit (ARCHITECTURE section 6): start the turn in session state,
// rescan the local tracker cheaply (report items the owner moved), and add one
// factual line when the prompt holds an explicit keep phrase.
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
import { keepPhrase, KEEP_LINE } from './phrases.mjs';

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
  await updateSession(project, io.host, input, io.env, (state) => {
    // Codex turns a Stop reason into a new prompt; it is not a new request from the owner.
    if (state.lastStopReason && prompt.trim() === String(state.lastStopReason).trim()) followUp = true;
    lastReported = state.trackerReported || null;
  });
  if (followUp) return null;

  const lines = [];
  const scan = await rescan(project, io, lastReported);
  if (scan.lines.length) {
    lines.push('Changes found in the work tracker since the last toolkit command (the work-organize skill handles moves and copies; the next toolkit work command brings the records in step):');
    lines.push(...scan.lines.map((l) => `- ${l}`));
  }
  const phrase = keepPhrase(prompt);
  await updateSession(project, io.host, input, io.env, (state) => {
    const turn = startTurn(state, input);
    turn.keep = phrase;
    turn.baseline = recordBaseline(project);
    if (scan.fingerprint) state.trackerReported = scan.fingerprint;
  });
  if (phrase) lines.push(KEEP_LINE);
  return lines.length ? contextOutput('UserPromptSubmit', lines.join('\n')) : null;
}
