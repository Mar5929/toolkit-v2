// toolkit machine-setup: the Codex wrapper script, the plugin-root pointer, and program checks.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { machineSetup } from '../project/machine.mjs';

export const summary = 'Set up this computer: the toolkit wrapper script for Codex, the plugin-root pointer, the Toolkit V2 plugins switched off for every Codex folder, and checks for node, git, ntn, ollama, and Hindsight.';

export const help = `Usage:
  toolkit machine-setup [--offline]

Writes ~/.local/bin/toolkit, a small script (not a link) that runs the
installed toolkit plugin named in ~/.config/toolkit-v2/plugin-root, and points
that file at this plugin copy. Every session-start hook keeps the pointer
current. An existing ~/.local/bin/toolkit that this command did not write is
left alone and reported. When ~/.codex/config.toml turns a Toolkit V2 plugin
on for every folder (codex plugin add does this after every install or
update), it sets enabled = false for that plugin there and keeps every other
line; projects set up by toolkit init turn the plugins on for themselves.
Then it checks node, git, ntn (and whether it is signed in), ollama, and the
local Hindsight server. --offline skips the checks that use the network or
run ntn whoami. It changes nothing else.`;

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
