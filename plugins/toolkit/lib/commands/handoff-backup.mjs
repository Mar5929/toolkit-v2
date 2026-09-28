// toolkit handoff-backup: the automatic backup the handoff skill runs as its
// last step (Mike, 2026-09-28, decision 13). The same backup runs after every
// toolkit work finish. The work is in lib/project/backup.mjs (autoBackup).

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { autoBackup } from '../project/backup.mjs';

export const summary = 'Back up .work-items/ and .memory/ (and Hindsight memory) to the project\'s backup folder; the handoff skill runs it last.';

export const help = `Usage:
  toolkit handoff-backup

Exports the Git-ignored .work-items/ and .memory/ folders (and the Hindsight
memory, which lives on this computer too) to <backup.dir>/<project key>-<date>/,
one folder per day, where backup.dir is the backup folder in .toolkit.json.
When today's folder already holds more files than the project has now (a
fresh clone, or the project on a new computer), the backup goes to a new
folder, <project key>-<date>-<HHMMSS>, and today's earlier backup is kept as
it was. The work finish command runs the same backup. With no backup folder
set it changes nothing and says how to set one (toolkit config set backup.dir
<folder>, or none). A project with nothing on this computer only (Notion tracker and Notion
memory) has nothing to back up. Exit 1 when the backup failed; the handoff
then tells the owner.`;

export async function run(argv, ctx) {
  parseArgs(argv, { boolean: ['json'], string: ['host'] });
  const project = requireProject(ctx.cwd);
  const res = await autoBackup(project, { env: ctx.env, fetch: ctx.fetch });
  const line = res.line
    || (res.status === 'declined' ? 'The owner chose no backup folder (backup.dir is none), so nothing was backed up.'
      : res.status === 'nothing' ? 'Nothing to back up: this project keeps its work items and memory outside this computer.' : '');
  out(ctx, line, { ok: res.status !== 'failed', status: res.status, dir: res.dir || null, parts: res.parts, errors: res.errors });
  return res.status === 'failed' ? EXIT.ERROR : EXIT.OK;
}
