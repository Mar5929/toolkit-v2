// toolkit config get [<key>] | set <key> <value>

import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { requireProject, getPath } from '../core/config.mjs';
import { setSetting, formatSetting, afterSetting, SETUP_KEYS } from '../project/settings.mjs';
import { syncProject } from '../project/sync.mjs';

export const summary = 'Read or change a setting in .toolkit.json; a setup change (tracker, memory, prefix, Salesforce, hosts, names) also runs toolkit sync.';

export const help = `Usage:
  toolkit config get [<key>]
  toolkit config set <key> <value>

Keys use dots, for example memory.type or salesforce.orgs.sandbox.
Setup keys (${SETUP_KEYS.join(', ')}) are read by the scaffold templates, so
setting one saves it and then runs toolkit sync: files nobody changed are
rendered again; a file the project changed keeps its text and is named in the
report. hosts takes a comma list: claude-code,codex. salesforce.enabled takes
true or false. The id prefix can change only before the first work item.`;

export async function run(argv, ctx) {
  // The dispatcher shows help for `toolkit <command> --help`; this covers --help after a subcommand too.
  if (argv.includes('--help') || argv.includes('-h')) {
    out(ctx, [`toolkit config: ${summary}`, '', help], { name: 'config', summary, help });
    return EXIT.OK;
  }
  const { _: pos } = parseArgs(argv, { boolean: ['json'], string: ['host'] });
  const [sub, key, ...rest] = pos;
  const project = requireProject(ctx.cwd);
  if (sub === 'get' || !sub) {
    if (!key) {
      out(ctx, JSON.stringify(project.config, null, 2), project.config);
      return EXIT.OK;
    }
    const value = getPath(project.config, key);
    if (value === undefined) {
      throw new ToolkitError(EXIT.ERROR, `${key} is not set in .toolkit.json.`, { key });
    }
    out(ctx, formatSetting(value), { ok: true, key, value });
    return EXIT.OK;
  }
  if (sub === 'set') {
    if (!key || !rest.length) throw new ToolkitError(EXIT.INVALID, 'Give the setting and its value: toolkit config set <key> <value>.');
    const raw = rest.join(' ');
    const res = setSetting(project, key, raw);
    const lines = [res.changed ? `Set ${key} to ${formatSetting(res.to)} (was ${formatSetting(res.from)}).` : `${key} is already ${formatSetting(res.to)}; nothing changed.`];
    let sync = null;
    if (res.changed && res.setup) {
      const s = await syncProject(project, { env: ctx.env, pluginRoot: ctx.pluginRoot, changedSettings: [{ key, from: res.from, to: res.to }] });
      sync = s.summary;
      lines.push('This setting is part of the project setup, so toolkit sync ran:', ...s.lines.map((l) => `  ${l}`));
    }
    const after = res.changed ? afterSetting(project, key, res.from, res.to) : { next: [], warnings: [] };
    lines.push(...after.warnings, ...after.next);
    out(ctx, lines, { ok: true, key, from: res.from, to: res.to, changed: res.changed, sync, warnings: after.warnings, next: after.next });
    return EXIT.OK;
  }
  throw new ToolkitError(EXIT.INVALID, `Unknown config command "${sub}". Use toolkit config get [<key>] or toolkit config set <key> <value>.`);
}
