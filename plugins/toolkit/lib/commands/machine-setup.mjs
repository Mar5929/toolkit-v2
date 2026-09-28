// toolkit machine-setup: the Codex wrapper script, the plugin-root pointer, and program checks.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { machineSetup } from '../project/machine.mjs';

export const summary = 'Set up this computer: the toolkit wrapper script for Codex, the plugin-root pointer, the Toolkit V2 plugin switches for every Codex folder, and checks for node, git, ntn, ollama, and Hindsight.';

export const help = `Usage:
  toolkit machine-setup [--offline]

Writes ~/.local/bin/toolkit, a small script (not a link) that runs the
installed toolkit plugin named in ~/.config/toolkit-v2/plugin-root, and points
that file at this plugin copy. Only an installed copy is ever named there: the
Claude Code or Codex plugin cache for the toolkit-v2 marketplace, or the
marketplace source folder that claude plugin marketplace add or codex plugin
marketplace add registered. A plugin cache copy of the same or a newer
version is named instead of the source folder, because other sessions edit
the source folder. Run from any other copy (for example a test copy loaded
with --plugin-dir), it leaves the pointer alone and says so; the wrapper
still falls back to the registered source folder. A pointer to a newer
installed version is kept. The session-start hook keeps the pointer current
inside Toolkit V2 projects. An existing ~/.local/bin/toolkit that this
command did not write is left alone and reported.
In ~/.codex/config.toml it sets enabled = false for every Toolkit V2 plugin
except toolkit (codex plugin add turns each one on for every folder after
every install or update), and enabled = true for toolkit, which holds only
project-setup and hooks that do nothing outside a Toolkit V2 project. Every
other line is kept. Projects set up by toolkit init turn the other plugins on
for themselves. It reports whether Claude Code has toolkit@toolkit-v2 on for
every folder (claude plugin enable toolkit@toolkit-v2 does that).
Then it checks node, git, ntn (and whether it is signed in), ollama, and the
local Hindsight server. --offline skips the checks that use the network or
run ntn whoami. It changes nothing else. Projects ask the owner before this
command runs (Claude Code permissions.ask, Codex prompt rule).`;

export async function run(argv, ctx) {
  const { flags } = parseArgs(argv, { boolean: ['offline', 'json'], string: ['host'] });
  const res = await machineSetup({ env: ctx.env, pluginRoot: ctx.pluginRoot, fetch: ctx.fetch, network: flags.offline !== true });
  const lines = [...res.lines];
  if (res.problems.length) {
    lines.push('', 'Needs attention:');
    for (const p of res.problems) lines.push(`- ${p}`);
  }
  out(ctx, lines, { ok: res.problems.length === 0, pointer: res.pointer, wrapper: res.wrapper, codex: res.codex, tools: res.tools, problems: res.problems });
  return res.problems.length ? EXIT.ERROR : EXIT.OK;
}
