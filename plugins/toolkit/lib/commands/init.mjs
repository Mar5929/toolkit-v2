// toolkit init: set up Toolkit V2 in a Git repository. The work is in lib/project/init.mjs.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { initProject } from '../project/init.mjs';

export const summary = 'Set up Toolkit V2 in this repository: the model project\'s files, AGENTS.md, rules, settings, and the chosen tracker and memory. Safe to run again.';

export const help = `Usage:
  toolkit init --name <name> --tracker <local|notion|github|jira> --memory <builtin|hindsight|notion>
               [--key <key>] [--owner <name>] [--salesforce] [--dir <path>] [--hosts claude-code,codex]
               [--decline SOUL.md] [--backup-dir <folder|none>]

Copies the model project's files from the plugin's scaffold/model/, byte for
byte, as scaffold/CONDITIONS.json says: .work-items/ only for the local
tracker, .memory/ only for built-in memory, the Salesforce files only with
--salesforce, and each host's own files only for that host. AGENTS.md,
README.md, and PROJECT.md keep only the blocks for the choices made, with the
project name in their headings; AGENTS.md gets its rules list. The model's
.claude/settings.json gets the toolkit's entries (the Toolkit V2 plugins on,
the claude-toolkit plugins off), and Codex gets the plugin switches and the
command rule. It sets up the Notion databases (toolkit notion ensure-project)
or the Hindsight bank (toolkit hindsight ensure-bank) when chosen.
.toolkit.json is written last, so a failed run can simply be run again. A file
the project already has is kept; .gitignore, the settings, and the Codex files
get the toolkit's lines merged in.

--key defaults to the name in lower case with dashes. --owner defaults to
git config user.name. --hosts defaults to both. --dir must be the top of a Git
repository (default: the current repository). --decline SOUL.md records that
the owner does not want SOUL.md: it is not installed, sync never adds it back,
and doctor does not report it missing (toolkit config set declined changes it
later). --backup-dir is the folder outside the project for the automatic
backups of .work-items/ and .memory/ (and Hindsight memory), for example
~/Backups/toolkit; none records that the owner wants no backup folder. toolkit
config set backup.dir changes it later.

Files in .codex/ and .agents/ are written first. The Codex sandbox refuses
them, so inside Codex init stops before writing anything else and prints the
exact command for the owner to run in a terminal.`;

const SPEC = {
  string: ['name', 'key', 'tracker', 'memory', 'owner', 'dir', 'hosts', 'host', 'decline', 'backup-dir'],
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
    decline: flags.decline,
    backupDir: last(flags['backup-dir']),
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
