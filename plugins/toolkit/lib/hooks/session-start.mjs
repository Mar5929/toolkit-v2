// SessionStart (ARCHITECTURE section 6): inside a Toolkit V2 project only,
// refresh the plugin-root pointer, run `work sync` for the local tracker,
// make the automatic backup when one is due, and return the briefing as
// additionalContext. Outside a V2 project it does nothing (decision 10: the
// toolkit plugin is on for every folder).

import { contextOutput } from './output.mjs';
import { findProject, trackerType } from './common.mjs';
import { updateSession, sessionsDir, cleanupSessions } from './session.mjs';

export async function sessionStart(input, io) {
  const { host, env, pluginRoot } = io;
  const cwd = input.cwd || io.cwd;
  const project = findProject(cwd);
  if (!project) return null;
  // Only an installed copy of the toolkit is ever named in the pointer, and a
  // newer one is never replaced by an older one (final review I1).
  const { refreshPointer, recordCodexHooksSeen } = await import('../project/machine.mjs');
  refreshPointer(pluginRoot, env);
  // Codex runs this hook only while it trusts the Toolkit V2 hooks; doctor
  // compares this record with the hooks file Codex would run now.
  if (host === 'codex') recordCodexHooksSeen(pluginRoot, env);

  const source = String(input.source || 'startup');
  await updateSession(project, host, input, env, (state) => {
    if (source === 'startup' || source === 'clear') {
      state.turn = null;
      state.lastStopReason = null;
    }
    state.source = source;
  });
  cleanupSessions(sessionsDir(project, host, env));

  // The automatic backup, when a day has passed without one (decision 13):
  // work finish and handoff back up too, but a session that ends without
  // either must not leave the tracker and memory unsaved for long. Only the
  // two folders here; the Hindsight export is left to work finish and
  // handoff, which have time for it.
  let backupLine = null;
  try {
    const { backupDue, autoBackup } = await import('../project/backup.mjs');
    if (backupDue(project, { env })) {
      const res = await autoBackup(project, { env, filesOnly: true });
      if (res.line) backupLine = res.status === 'done' ? `${res.line} (automatic: the last backup was more than a day old)` : res.line;
    }
  } catch {
    // The briefing's backup warning still says what is due.
  }

  const { buildBriefing } = await import('../project/brief.mjs');
  const brief = await buildBriefing(project, {
    host,
    env,
    pluginRoot,
    cwd,
    sync: trackerType(project) === 'local' ? 'full' : 'quick',
    // Notion: a quick live check (2-second deadline) so the owner's hand moves are reported at session start.
    liveNotion: true,
    fromHook: true,
    fetch: io.fetch,
  });
  return contextOutput('SessionStart', backupLine ? `${brief.text}\n\n${backupLine}` : brief.text);
}
