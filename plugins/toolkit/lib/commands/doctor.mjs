// toolkit doctor: every problem with its fix.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { runChecks, computerChecks } from '../project/checks.mjs';

export const summary = 'Check the Toolkit V2 setup of this project and this computer, and list every problem with its fix.';

export const help = `Usage:
  toolkit doctor [--json]

Checks this computer (Node, the plugin-root pointer, the Codex wrapper, the
Claude Code and Codex plugin copies), the instructions (a CLAUDE.md that does
not import AGENTS.md, other CLAUDE.md files that stop AGENTS.md loading,
settings that do the same, AGENTS.md markers, rules
list, placeholders, size), the plugin switches in both hosts, Codex trust for
this folder and its hooks, the scaffold (missing, out of date, changed by the
project, left over), Salesforce skill copies, the tracker and memory, ntn and
Hindsight, the backup age, and worktrees.

Also checks the Claude Code settings that keep AI credit off commits and pull
requests ("attribution") and keep every skill description in the skill list
(skillListingBudgetFraction), that ~/.codex/config.toml does not turn the
Toolkit V2 plugins on for every folder, that Codex does not run an older copy
of the toolkit, that the current focus has its heading and "Last updated:"
line, and that Notion memory is in Lore's layout.

Exit code 0 when there are no problems and no warnings; 1 otherwise. Notes
never change the exit code. A warning that only the other host can clear (the
Codex trust warnings, when doctor runs in Claude Code) is listed but does not
change the exit code. In a folder that is not a Toolkit V2 project yet, it
checks this computer only and exits 4.`;

const HOST_WORDS = { codex: 'Codex', claude: 'Claude Code' };

/** The host a finding can only be cleared in, when doctor runs in the other host; else null. */
export function otherHost(finding, host) {
  if (!finding || !finding.host || !host) return null;
  const wanted = finding.host === 'claude-code' ? 'claude' : finding.host;
  return wanted === host ? null : wanted;
}

const LABEL = { problem: 'Problems', warning: 'Warnings', note: 'Notes' };

function notProjectReport(ctx, err) {
  const findings = computerChecks({ env: ctx.env });
  const lines = [err.message, 'toolkit init sets it up (the project-setup skill asks the questions first).'];
  if (findings.length) {
    lines.push('', 'This computer:');
    // Each line says how much it matters: a warning never blocks toolkit init
    // (final run, claude-local problem 3: setup stopped for a pointer warning).
    const WORD = { problem: 'Problem', warning: 'Warning', note: 'Note' };
    for (const f of findings) lines.push(`- ${WORD[f.severity] || 'Warning'}: ${f.message}${f.fix ? ` Fix: ${f.fix}` : ''}`);
    if (!findings.some((f) => f.severity === 'problem')) lines.push('None of these blocks toolkit init.');
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
  // Sample run claude-a: from Claude Code the Codex trust warnings can never
  // be cleared, so they are listed apart and do not fail the run.
  const elsewhere = findings.filter((f) => f.severity !== 'note' && otherHost(f, ctx.host));
  let n = 0;
  for (const severity of ['problem', 'warning', 'note']) {
    const list = findings.filter((f) => f.severity === severity && !elsewhere.includes(f));
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
  if (elsewhere.length) {
    const hosts = [...new Set(elsewhere.map((f) => HOST_WORDS[otherHost(f, ctx.host)] || otherHost(f, ctx.host)))].join(' and ');
    lines.push('', `For ${hosts} only (${elsewhere.length}; the owner clears ${elsewhere.length === 1 ? 'it' : 'them'} in ${hosts}, so ${elsewhere.length === 1 ? 'it does' : 'they do'} not change this result):`);
    for (const f of elsewhere) lines.push(`- ${f.message}${f.fix ? ` Fix: ${f.fix}` : ''}`);
  }
  const counted = findings.filter((f) => !elsewhere.includes(f));
  const problems = counted.filter((f) => f.severity === 'problem').length;
  const warnings = counted.filter((f) => f.severity === 'warning').length;
  lines.push('', problems || warnings
    ? `Result: ${problems} problem${problems === 1 ? '' : 's'} and ${warnings} warning${warnings === 1 ? '' : 's'}.`
    : `Result: clean. No problems and no warnings${elsewhere.length ? ` here (${elsewhere.length} for ${[...new Set(elsewhere.map((f) => HOST_WORDS[otherHost(f, ctx.host)]))].join(' and ')} only)` : ''}.`);
  out(ctx, lines, { ok: !problems && !warnings, root: project.root, problems, warnings, otherHost: elsewhere.length, findings });
  return problems || warnings ? EXIT.ERROR : EXIT.OK;
}
