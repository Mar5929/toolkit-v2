// Session state for the hooks (ARCHITECTURE section 6; critique B4).
//
// One file per session: $CLAUDE_PLUGIN_DATA (Claude Code) or $PLUGIN_DATA
// (Codex) + /sessions/<session_id>.json, else
// <git common dir>/toolkit-v2/sessions/<session_id>.json. Files older than 7
// days are removed at session start.
//
// {
//   schema: 1, sessionId, host, project, startedAt, source,
//   turns: <count>,
//   turn: {
//     key,            the host's turn id (Codex turn_id, Claude prompt_id), when given
//     n, startedAt,
//     keep,           the keep phrase the owner used this turn, or null
//     prompted        true when UserPromptSubmit started the turn
//     saveWords       true when the prompt holds words that can ask for a save
//     answersMemoryQuestion  true when the reply before the prompt asked about memory
//     baseline,       file times at the start of the turn (a fallback record check)
//     records: [{ kind: memory|work|decision|memory-file, what, at, proposal? }],
//     edits:   [{ path, id }]   work-item records edited with Write, Edit, or apply_patch
//     stopBlocked     true once Stop has kept this turn going
//   },
//   lastStopReason    the text Stop last gave (Codex turns it into a prompt; it is not a new request)
//   lastReplyAskedMemory  true when the last reply asked the owner about memory (Stop sets it)
//   trackerReported   the .work-items/ fingerprint whose changes UserPromptSubmit last reported
//   proposedSummaries "Save to memory: <summary>?" questions already saved as proposals (normalized)
//   proposalNotes     what Stop saved as proposals; the next UserPromptSubmit passes it on once
// }

import fs from 'node:fs';
import path from 'node:path';
import { gitInfo } from '../core/config.mjs';
import { atomicWrite, ensureDir } from '../core/fsx.mjs';
import { withLock } from '../core/lock.mjs';

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function safeId(id) {
  const s = String(id || 'no-session').replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120);
  return s || 'no-session';
}

/** The folder of the session files. */
export function sessionsDir(project, host, env = process.env) {
  const data = host === 'codex' ? env.PLUGIN_DATA || env.CLAUDE_PLUGIN_DATA : env.CLAUDE_PLUGIN_DATA || env.PLUGIN_DATA;
  if (data) return path.join(data, 'sessions');
  const info = gitInfo(project.mainRoot || project.root);
  if (info) return path.join(info.commonDir, 'toolkit-v2', 'sessions');
  return path.join(project.root, '.toolkit-cache', 'sessions');
}

export function sessionFile(project, host, sessionId, env) {
  return path.join(sessionsDir(project, host, env), `${safeId(sessionId)}.json`);
}

export function readSession(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

/** Read, change, and write one session's state under its own lock. fn(state) may return a value. */
export async function updateSession(project, host, input, env, fn) {
  const dir = sessionsDir(project, host, env);
  ensureDir(dir);
  const id = safeId(input && input.session_id);
  const file = path.join(dir, `${id}.json`);
  return withLock(dir, async () => {
    const state = readSession(file) || {
      schema: 1,
      sessionId: input && input.session_id ? String(input.session_id) : null,
      host,
      project: project.mainRoot || project.root,
      startedAt: new Date().toISOString(),
      turns: 0,
      turn: null,
    };
    const result = await fn(state);
    state.updated = new Date().toISOString();
    atomicWrite(file, `${JSON.stringify(state, null, 2)}\n`);
    return result;
  }, { name: `${id}.lock`, waitMs: 4000 });
}

/** The host's id for the current turn: Codex turn_id, Claude Code prompt_id. */
export function turnKey(input) {
  return (input && (input.turn_id || input.prompt_id)) || null;
}

/** Start a new turn in the state. */
export function startTurn(state, input, extra = {}) {
  state.turns = (state.turns || 0) + 1;
  state.turn = {
    key: turnKey(input),
    n: state.turns,
    startedAt: new Date().toISOString(),
    keep: null,
    baseline: null,
    records: [],
    edits: [],
    stopBlocked: false,
    ...extra,
  };
  return state.turn;
}

/** The current turn, starting one when the host says a new turn began (its turn id changed) or none exists. */
export function currentTurn(state, input) {
  const key = turnKey(input);
  if (!state.turn || (key && state.turn.key && state.turn.key !== key)) return startTurn(state, input);
  if (key && !state.turn.key) state.turn.key = key;
  return state.turn;
}

/** Remove session files older than 7 days. Never throws. */
export function cleanupSessions(dir, now = Date.now()) {
  let removed = 0;
  try {
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.json')) continue;
      const file = path.join(dir, name);
      try {
        if (now - fs.statSync(file).mtimeMs > SESSION_MAX_AGE_MS) {
          fs.unlinkSync(file);
          removed++;
        }
      } catch {
        // Gone already.
      }
    }
  } catch {
    // No folder yet.
  }
  return removed;
}
