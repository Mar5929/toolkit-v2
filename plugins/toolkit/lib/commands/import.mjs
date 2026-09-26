// toolkit import --from <dir>: restore .work-items/ and .memory/ from a toolkit export.

import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { importProject } from '../project/backup.mjs';

export const summary = 'Restore .work-items/ and .memory/ from a folder written by toolkit export.';

export const help = `Usage:
  toolkit import --from <folder> [--only work-items|memory] [--dry-run] [--replace]

Copies the export's work-items/ and memory/ into this project's .work-items/
and .memory/ (the parts this project uses). --only work-items or --only memory
restores one part and leaves the other alone. A file that is identical, a
generated file, a seed the project never changed, or an empty state file is
replaced. .memory/.toolkit-meta.json is merged: the later save time and the
later export time are kept. Any other file that differs is a conflict, and
then nothing is written unless --replace is given (after the owner's yes).
Files that are only in the project are never deleted. Afterwards the dashboard
and the memory index are rebuilt. --dry-run lists what would change. A
memory-only backup goes back with toolkit memory import --from <folder>.`;

export async function run(argv, ctx) {
  const { flags } = parseArgs(argv, { string: ['from', 'host', 'only'], boolean: ['dry-run', 'replace', 'json'] });
  const from = Array.isArray(flags.from) ? flags.from[flags.from.length - 1] : flags.from;
  if (!from || from === true) throw new ToolkitError(EXIT.INVALID, 'Give the export folder: toolkit import --from <folder>.');
  const project = requireProject(ctx.cwd);
  const res = await importProject(project, path.resolve(ctx.cwd, from), {
    dryRun: flags['dry-run'] === true,
    replace: flags.replace === true,
    only: flags.only === undefined || flags.only === true ? [] : flags.only,
    env: ctx.env,
    pluginRoot: ctx.pluginRoot,
  });
  const verb = res.dryRun ? 'Would write' : 'Wrote';
  const lines = [`${res.dryRun ? 'Dry run: nothing was written. ' : ''}Import from ${res.from} (exported ${res.exportedAt || 'at an unknown time'} from ${res.exportedFrom || 'an unknown folder'}).`];
  lines.push(`${verb} ${res.written.length} file${res.written.length === 1 ? '' : 's'}${res.replaced.length ? ` (${res.replaced.length} replacing the project's copy)` : ''}${res.merged.length ? ` (${res.merged.join(', ')} merged)` : ''}; ${res.same.length} already identical.`);
  for (const f of res.written.slice(0, 20)) lines.push(`  - ${f}`);
  if (res.written.length > 20) lines.push(`  - ... and ${res.written.length - 20} more`);
  for (const s of res.skipped) lines.push(`Skipped ${s}`);
  if (!res.dryRun && res.written.length) lines.push('Rebuilt the work-item dashboard and the memory index.');
  out(ctx, lines, { ok: true, ...res });
  return EXIT.OK;
}
