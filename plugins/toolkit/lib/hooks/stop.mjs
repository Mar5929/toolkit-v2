// Stop (ARCHITECTURE section 6; critique P8). Silent unless, once per turn:
// - the owner used an explicit keep phrase this turn and nothing was recorded
//   (no memory save, work-item change, or decision), or
// - a work-item record edited this turn still fails validation.
// Guarded by stop_hook_active. The reason never contains a keep phrase,
// because Codex turns it into a new user prompt. Output is JSON or nothing.

import fs from 'node:fs';
import { stopOutput } from './output.mjs';
import { findProject, baselineMoved } from './common.mjs';
import { updateSession, turnKey } from './session.mjs';
import { resolveRecorded } from './post-tool.mjs';

export const KEEP_REASON = 'The owner asked this turn for something to be kept for later sessions, and nothing was recorded: no memory save, work item change, or decision. Record it with the memory-save skill (or work-on if it is a task), or say in one line why it was not recorded.';

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

export async function stop(input, io) {
  if (input.stop_hook_active === true || input.stop_hook_active === 'true') return null;
  const cwd = input.cwd || io.cwd;
  const project = findProject(cwd);
  if (!project) return null;
  let reason = null;
  let pending = null;
  await updateSession(project, io.host, input, io.env, (state) => {
    const turn = state.turn;
    if (!turn || turn.stopBlocked) return;
    const key = turnKey(input);
    if (key && turn.key && key !== turn.key) return;
    pending = turn;
  });
  if (!pending) return null;
  const reasons = [];
  if (pending.keep && !(pending.records && pending.records.length) && !baselineMoved(project, pending.baseline)) reasons.push(KEEP_REASON);
  const bad = await invalidEdits(project, pending.edits);
  for (const b of bad) {
    reasons.push(`${b.id} (${b.path}) was edited this turn and still fails validation: ${b.problems.slice(0, 2).join(' ')}${b.problems.length > 2 ? ` (and ${b.problems.length - 2} more)` : ''} Fix the file, or run toolkit work validate ${b.id} for the full list.`);
  }
  if (!reasons.length) return null;
  reason = reasons.join(' ');
  await updateSession(project, io.host, input, io.env, (state) => {
    if (state.turn && state.turn.n === pending.n) state.turn.stopBlocked = true;
    state.lastStopReason = reason;
  });
  return stopOutput(io.host, reason);
}
