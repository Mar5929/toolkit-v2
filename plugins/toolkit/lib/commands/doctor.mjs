// toolkit doctor: every problem with its fix.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { runChecks, computerChecks } from '../project/checks.mjs';

export const summary = 'Check the Toolkit V2 setup of this project and this computer, and list every problem with its fix.';

export const help = `Usage:
  toolkit doctor [--json]

Checks this computer (Node, the plugin-root pointer, the Codex wrapper, the
Claude Code and Codex plugin copies), the instructions (CLAUDE.md files that
stop AGENTS.md loading, settings that do the same, AGENTS.md markers, rules
list, placeholders, size), the plugin switches in both hosts, Codex trust for
this folder and its hooks, the scaffold (missing, out of date, changed by the
project, left over), Salesforce skill copies, the tracker and memory, ntn and
Hindsight, the backup age, and worktrees.

Exit code 0 when there are no problems and no warnings; 1 otherwise. Notes
never change the exit code. In a folder that is not a Toolkit V2 project yet,
it checks this computer only and exits 4.`;

const LABEL = { problem: 'Problems', warning: 'Warnings', note: 'Notes' };

function notProjectReport(ctx, err) {
  const findings = computerChecks({ env: ctx.env });
  const lines = [err.message, 'toolkit init sets it up (the project-setup skill asks the questions first).'];
  if (findings.length) {
    lines.push('', 'This computer:');
    for (const f of findings) lines.push(`- ${f.message}${f.fix ? ` Fix: ${f.fix}` : ''}`);
  } else {
    lines.push('', 'This computer: no problems found (Node, the plugin-root pointer, and the Codex wrapper).');
  }
  out(ctx, lines, { ok: false, project: null, error: { code: EXIT.NOT_PROJECT, message: err.message }, findings });
  return EXIT.NOT_PROJECT;
}

export async function run(argv, ctx) {
  parseArgs(argv, { boolean: ['json'], string: ['host'] });
  let project;
  try {
    project = requireProject(ctx.cwd);
  } catch (err) {
    if (err && err.code === EXIT.NOT_PROJECT) return notProjectReport(ctx, err);
    throw err;
  }
  const { findings } = await runChecks(project, { env: ctx.env, pluginRoot: ctx.pluginRoot, fetch: ctx.fetch });
  const lines = [`Toolkit doctor for ${project.config.project && project.config.project.name ? project.config.project.name : 'this project'} (${project.root}).`];
  let n = 0;
  for (const severity of ['problem', 'warning', 'note']) {
    const list = findings.filter((f) => f.severity === severity);
    if (!list.length) continue;
    lines.push('', `${LABEL[severity]} (${list.length}):`);
    for (const f of list) {
      if (severity === 'note') {
        lines.push(`- ${f.message}${f.fix ? ` ${f.fix}` : ''}`);
      } else {
        n += 1;
        lines.push(`${n}. ${f.message}`);
        if (f.fix) lines.push(`   Fix: ${f.fix}`);
      }
    }
  }
  const problems = findings.filter((f) => f.severity === 'problem').length;
  const warnings = findings.filter((f) => f.severity === 'warning').length;
  lines.push('', problems || warnings
    ? `Result: ${problems} problem${problems === 1 ? '' : 's'} and ${warnings} warning${warnings === 1 ? '' : 's'}.`
    : 'Result: clean. No problems and no warnings.');
  out(ctx, lines, { ok: !problems && !warnings, root: project.root, problems, warnings, findings });
  return problems || warnings ? EXIT.ERROR : EXIT.OK;
}
