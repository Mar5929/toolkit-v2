// toolkit sync: add missing scaffold files and rebuild the ones nobody changed.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { syncProject } from '../project/sync.mjs';

export const summary = 'Add missing scaffold files and update the ones the project never changed; a file the project changed is never overwritten.';

export const help = `Usage:
  toolkit sync [--dry-run]

Runs the scaffold manifest again with the current .toolkit.json values. A file
still exactly as the toolkit wrote it is rebuilt; a missing file is added; a
file the project changed is left alone and listed, with what the toolkit would
add or change. The rules list in AGENTS.md is rebuilt every time. Nothing is
ever deleted: files for choices no longer made are listed as left over.
--dry-run shows the same report and writes nothing.`;

export async function run(argv, ctx) {
  const { flags } = parseArgs(argv, { boolean: ['dry-run', 'json'], string: ['host'] });
  const project = requireProject(ctx.cwd);
  const res = await syncProject(project, { dryRun: flags['dry-run'] === true, env: ctx.env, pluginRoot: ctx.pluginRoot });
  const lines = [flags['dry-run'] ? 'Dry run: nothing was written.' : `Synced ${project.root} with the toolkit scaffold.`, ...res.lines];
  out(ctx, lines, { ok: res.summary.conflicts.length === 0, dryRun: flags['dry-run'] === true, root: project.root, ...res.summary });
  return res.summary.conflicts.length ? EXIT.ERROR : EXIT.OK;
}
