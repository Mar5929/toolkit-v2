// toolkit export --to <dir>: back up .work-items/ and .memory/.

import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { exportProject } from '../project/backup.mjs';

export const summary = 'Back up the Git-ignored .work-items/ and .memory/ folders to a folder (they exist on this computer only).';

export const help = `Usage:
  toolkit export --to <folder>

Copies .work-items/ (with its state file) and .memory/, the parts this project
uses, into <folder>/work-items and <folder>/memory, with toolkit-export.json
describing the copy. The folder must be new, empty, or an earlier export. Use a
folder outside the project. Hindsight and Notion memory are not included:
toolkit memory export covers every memory backend. toolkit import --from
<folder> restores it.`;

export async function run(argv, ctx) {
  const { flags } = parseArgs(argv, { string: ['to', 'host'], boolean: ['json'] });
  const to = Array.isArray(flags.to) ? flags.to[flags.to.length - 1] : flags.to;
  if (!to || to === true) throw new ToolkitError(EXIT.INVALID, 'Give the folder to export to: toolkit export --to <folder>.');
  const project = requireProject(ctx.cwd);
  const res = await exportProject(project, path.resolve(ctx.cwd, to));
  const lines = [`Exported to ${res.dir}:`, ...res.parts.map((p) => `  - ${p.from} -> ${p.name}/ (${p.files} file${p.files === 1 ? '' : 's'})`)];
  const memory = project.config.memory && project.config.memory.type;
  if (memory && memory !== 'builtin') lines.push(`Memory lives in ${memory}, so it is not in this backup. toolkit memory export --to <folder> backs it up.`);
  out(ctx, lines, { ok: true, ...res });
  return EXIT.OK;
}
