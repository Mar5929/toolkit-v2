// toolkit init: set up Toolkit V2 in a Git repository. The work is in lib/project/init.mjs.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { initProject } from '../project/init.mjs';

export const summary = 'Set up Toolkit V2 in this repository: scaffold, AGENTS.md, rules, settings, and the chosen tracker and memory. Safe to run again.';

export const help = `Usage:
  toolkit init --name <name> --tracker <local|notion|github|jira> --memory <builtin|hindsight|notion>
               [--key <key>] [--owner <name>] [--salesforce] [--dir <path>] [--hosts claude-code,codex]

Copies the scaffold (never .work-items/ items or .memory/ records), writes
AGENTS.md with its rules list, .claude/settings.json (the Toolkit V2 plugins on,
the claude-toolkit plugins off), the Codex plugin switches and command rule,
the Plain English output style, and the Salesforce kit with --salesforce. It
creates .work-items/ or .memory/ as chosen, or sets up the Notion databases
(toolkit notion ensure-project) or the Hindsight bank (toolkit hindsight
ensure-bank). .toolkit.json is written last, so a failed run can simply be run
again. A file the project already has is kept; .gitignore, the settings, and
the Codex config get the toolkit's lines merged in.

--key defaults to the name in lower case with dashes. --owner defaults to
git config user.name. --hosts defaults to both. --dir must be the top of a Git
repository (default: the current repository).`;

const SPEC = {
  string: ['name', 'key', 'tracker', 'memory', 'owner', 'dir', 'hosts', 'host'],
  boolean: ['salesforce', 'json'],
};

export async function run(argv, ctx) {
  const { flags } = parseArgs(argv, SPEC);
  const last = (v) => (Array.isArray(v) ? v[v.length - 1] : v);
  const res = await initProject({
    name: last(flags.name),
    key: last(flags.key),
    tracker: last(flags.tracker),
    memory: last(flags.memory),
    owner: last(flags.owner),
    dir: last(flags.dir),
    hosts: flags.hosts,
    salesforce: flags.salesforce === true,
  }, { cwd: ctx.cwd, env: ctx.env, pluginRoot: ctx.pluginRoot, fetch: ctx.fetch });
  out(ctx, res.lines, {
    ok: true,
    root: res.root,
    mainRoot: res.mainRoot,
    rerun: res.rerun,
    config: res.config,
    changes: res.report.changes,
    backends: res.report.backends,
    notes: res.report.notes,
    ...res.summary,
  });
  return EXIT.OK;
}
