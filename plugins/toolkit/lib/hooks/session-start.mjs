// SessionStart (ARCHITECTURE section 6): refresh the plugin-root pointer, run
// `work sync` for the local tracker, and return the briefing as
// additionalContext.

import { contextOutput } from './output.mjs';
import { findProject, trackerType } from './common.mjs';
import { updateSession, sessionsDir, cleanupSessions } from './session.mjs';

export async function sessionStart(input, io) {
  const { host, env, pluginRoot } = io;
  const cwd = input.cwd || io.cwd;
  // The pointer is refreshed in every folder: it only says where this plugin copy is.
  const { refreshPointer } = await import('../project/machine.mjs');
  refreshPointer(pluginRoot, env);

  const project = findProject(cwd);
  if (!project) return null;

  const source = String(input.source || 'startup');
  await updateSession(project, host, input, env, (state) => {
    if (source === 'startup' || source === 'clear') {
      state.turn = null;
      state.lastStopReason = null;
    }
    state.source = source;
  });
  cleanupSessions(sessionsDir(project, host, env));

  const { buildBriefing } = await import('../project/brief.mjs');
  const brief = await buildBriefing(project, {
    host,
    env,
    pluginRoot,
    cwd,
    sync: trackerType(project) === 'local' ? 'full' : 'quick',
    fetch: io.fetch,
  });
  return contextOutput('SessionStart', brief.text);
}
