// What the hooks know about the owner's current turn, kept where the
// `toolkit` command can read it (close-out 2026-09-28, R-I4 in code).
//
// The hooks keep their session state in the host's plugin data folder, which
// a `toolkit` command run from the agent's shell cannot find. So the
// UserPromptSubmit hook also writes the few facts a command needs to a file
// named for the session:
//
//   <git common dir>/toolkit-v2/turns/<session id>.json
//   { schema, sessionId, host, turn, key, at, prompted, keep, saveWords, answersMemoryQuestion }
//
// A command finds its own session from the environment the host gives the
// shell: CLAUDE_CODE_SESSION_ID in Claude Code, CODEX_THREAD_ID in Codex. Both
// equal the session_id the host gives its hooks (a Codex hook's session_id is
// the thread id: dev/test-runs/closeout-codex/sessions, *.thread.txt against
// *.hookstate.json). With no such variable (a terminal the owner runs), or no
// file for it, or a file older than MAX_AGE_MS, the command gets null and
// behaves as before.

import fs from 'node:fs';
import path from 'node:path';
import { gitInfo } from '../core/config.mjs';
import { atomicWrite, ensureDir } from '../core/fsx.mjs';
import { safeId } from './session.mjs';

export const TURN_FACTS_SCHEMA = 1;
/** A turn file older than this is not trusted: the turn it describes is long over. */
export const MAX_AGE_MS = 12 * 60 * 60 * 1000;

/** The folder of the turn files for a project. */
export function turnsDir(project) {
  const base = project.mainRoot || project.root;
  const info = gitInfo(base);
  if (info) return path.join(info.commonDir, 'toolkit-v2', 'turns');
  return path.join(base, '.toolkit-cache', 'turns');
}

/** The session id the host gave this process's environment, or null. */
export function sessionIdFromEnv(env = process.env) {
  const id = (env && (env.CLAUDE_CODE_SESSION_ID || env.CODEX_THREAD_ID)) || '';
  return String(id).trim() || null;
}

/** Write the facts of the turn that just started. Never throws. */
export function writeTurnFacts(project, sessionId, facts) {
  if (!sessionId) return false;
  try {
    const dir = turnsDir(project);
    ensureDir(dir);
    atomicWrite(path.join(dir, `${safeId(sessionId)}.json`), `${JSON.stringify({ schema: TURN_FACTS_SCHEMA, sessionId: String(sessionId), ...facts }, null, 2)}\n`);
    return true;
  } catch {
    return false;
  }
}

/** The facts of this process's session's current turn, or null. */
export function readTurnFacts(project, env = process.env, { now = Date.now() } = {}) {
  const id = sessionIdFromEnv(env);
  if (!id) return null;
  try {
    const file = path.join(turnsDir(project), `${safeId(id)}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data || typeof data !== 'object' || data.sessionId !== id) return null;
    const at = Date.parse(data.at || '');
    if (!Number.isFinite(at) || now - at > MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * True when the owner's message this turn holds no keep phrase and no other
 * words asking for a save, and does not answer a memory question: whatever
 * he said is a remark made in passing, so a save cannot claim his approval.
 */
export function passingRemark(facts) {
  return Boolean(facts && facts.prompted && !facts.keep && !facts.saveWords && !facts.answersMemoryQuestion);
}

/** Remove turn files older than MAX_AGE_MS. Never throws. */
export function cleanupTurnFacts(project, now = Date.now()) {
  try {
    const dir = turnsDir(project);
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.json')) continue;
      const file = path.join(dir, name);
      try {
        if (now - fs.statSync(file).mtimeMs > MAX_AGE_MS) fs.unlinkSync(file);
      } catch {
        // Gone already.
      }
    }
  } catch {
    // No folder yet.
  }
}
