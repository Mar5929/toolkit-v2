// The checks behind `toolkit doctor`, and the quick subset the session
// briefing shows as setup warnings. Every finding names its fix.
//
// runChecks(project, { env, pluginRoot, quick, fetch }) -> { findings, facts }
//   finding: { id, area, severity: 'problem'|'warning'|'note', message, fix }
//   quick: no network calls, no child programs except git, no scaffold plan.
//
// Checks (ARCHITECTURE sections 2, 3, 7, 9; critiques P5, P10, I17, I18, M19):
//   the computer: Node version, the plugin-root pointer and the Codex wrapper,
//     the Claude and Codex copies of the plugin at the same version
//   instructions: the root CLAUDE.md imports AGENTS.md (the model's one
//     CLAUDE.md), other CLAUDE.md files that stop Claude Code reading AGENTS.md,
//     settings that do the same, AGENTS.md markers, span, leftover prompts, size
//   plugins: enabledPlugins in .claude/settings.json and the plugin switches
//     in .codex/config.toml
//   Codex: trust for this folder and for the Toolkit V2 hooks
//   scaffold: missing files, out-of-date files, files changed by the project,
//     leftovers, merge conflicts (the same plan `toolkit sync --dry-run` shows)
//   Salesforce: the skill copies in .claude/skills and .agents/skills match,
//     the org aliases are recorded
//   project hooks: every script a hook in .claude/settings.json or
//     .codex/hooks.json runs from the project exists (a quick check too, since
//     a missing script fails on every tool call or every stop)
//   tracker and memory health, ntn signed in, Hindsight health, backup age,
//     worktrees Git can no longer find
//   Claude Code settings the toolkit needs: no AI credit on commits and pull
//     requests (attribution) and the larger skill list (skillListingBudgetFraction)
//   Codex on this computer: the Toolkit V2 plugins switched off for every
//     folder in ~/.codex/config.toml, and its copy of the toolkit not older
//     than this one
//   the current focus has the model's heading and "Last updated:" line, and a
//     Notion project is not still on the older single Memory database
//
// A finding with `host` ('codex') can only be cleared in that host; toolkit
// doctor run from the other host lists it without counting it in its exit code.

import fs from 'node:fs';
import path from 'node:path';
import { run } from '../core/util.mjs';
import { hasSpan, spanBody, buildSpan, readRules } from './render.mjs';
import { planManifest, projectHosts, readHosts, HOSTS_FIX, PROPOSAL_PATH, DEFAULT_PLUGIN_ROOT } from './manifest.mjs';
import { MODEL_DIR } from './model-scaffold.mjs';
import { tomlGet } from './toml.mjs';
import {
  claudeHome, claudeOldPlugins, codexOldPlugins, codexPluginOnEverywhere, codexTrust, codexHookTrustKeys, compareVersions, homeDir,
  installedPluginCopies, pluginVersion, readJson, wantedV2Plugins, MARKETPLACE, OLD_MARKETPLACE, V2_PLUGINS, MACHINE_WIDE_PLUGINS,
} from './hosts.mjs';
import { readPointer, pointerPath, isCompleteRoot, isInstalledRoot, wrapperState, onPath, readCodexHooksSeen, codexHooksHash } from './machine.mjs';
import { readExportRecord, backupParts, backupSetting, BACKUP_MAX_AGE_DAYS } from './backup.mjs';
import { projectCodexRules, ruleDecision } from './codex-rules.mjs';
import { ASK_FIRST_COMMANDS } from '../cli.mjs';

export const AGENTS_MAX_BYTES = 24 * 1024;
export const EXPORT_MAX_AGE_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;
const AGENTS_BLOCKERS = ['CLAUDE.md', path.join('.claude', 'CLAUDE.md'), 'CLAUDE.local.md'];
const FEATURE_FLAG_VARS = ['DISABLE_GROWTHBOOK', 'DISABLE_TELEMETRY', 'DO_NOT_TRACK', 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC'];
const PROVIDER_VARS = ['CLAUDE_CODE_USE_BEDROCK', 'CLAUDE_CODE_USE_VERTEX', 'CLAUDE_CODE_USE_FOUNDRY'];

function finding(list, id, area, severity, message, fix = null, extra = null) {
  list.push({ id, area, severity, message, fix, ...(extra || {}) });
}

/**
 * The permissions.ask rules the toolkit's Claude Code settings add
 * (templates/settings/claude-toolkit.json; decision 12). The Codex side is
 * templates/codex/toolkit.rules.
 */
export const TOOLKIT_ASK_RULES = Object.freeze([
  'Bash(toolkit machine-setup)',
  'Bash(toolkit machine-setup *)',
  'Bash(toolkit memory delete *)',
  'Bash(toolkit memory import *)',
  'Bash(toolkit import *)',
  'Bash(toolkit hindsight service install)',
  'Bash(toolkit hindsight service install *)',
  'Bash(toolkit hindsight service start)',
  'Bash(toolkit hindsight service start *)',
]);

/** The skillListingBudgetFraction that the toolkit's Claude Code settings set (templates/settings/claude-toolkit.json). */
export const SKILL_BUDGET = 0.02;

/**
 * True when Claude Code's `attribution` setting hides the AI credit on commits
 * and pull requests: false, or { commit: '', pr: '' }
 * (ai-external-knowledge/claude-code/settings-reference.md, "attribution").
 */
export function hidesAttribution(value) {
  if (value === false) return true;
  return Boolean(value) && typeof value === 'object' && value.commit === '' && value.pr === '';
}

export { compareVersions };

function truthy(v) {
  return v !== undefined && v !== null && v !== '' && v !== '0' && String(v).toLowerCase() !== 'false';
}

// ------------------------------------------------------------------ instructions

/** True when a CLAUDE.md text imports the AGENTS.md next to it (a line "@AGENTS.md" or "@./AGENTS.md"). */
export function importsAgents(text) {
  return String(text || '').split(/\r?\n/).some((l) => /^\s*@(\.\/)?AGENTS\.md\s*$/.test(l));
}

/**
 * CLAUDE.md files that stop Claude Code reading AGENTS.md: the project folder
 * and every folder above it. When the project's own CLAUDE.md imports
 * AGENTS.md (the model's root CLAUDE.md is exactly "@AGENTS.md"), Claude Code
 * reads AGENTS.md through that import, so no file on the path blocks it.
 */
export function claudeMdOnPath(root, env = process.env) {
  const own = path.join(path.resolve(root), 'CLAUDE.md');
  let ownText = null;
  try {
    ownText = fs.readFileSync(own, 'utf8');
  } catch {
    ownText = null;
  }
  if (ownText !== null && importsAgents(ownText)) return [];
  const found = [];
  const home = path.resolve(homeDir(env));
  let dir = path.resolve(root);
  for (;;) {
    for (const name of AGENTS_BLOCKERS) {
      // ~/.claude/CLAUDE.md is the user's own file and does not block AGENTS.md.
      if (dir === home && name === path.join('.claude', 'CLAUDE.md')) continue;
      const file = path.join(dir, name);
      if (fs.existsSync(file)) found.push(file);
    }
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return found;
}

/** CLAUDE.md files inside the project below its top folder (the model has one CLAUDE.md, at the top). */
export function claudeMdInside(root) {
  const found = new Set();
  const res = run('git', ['ls-files', '-co', '--exclude-standard', '--', '*CLAUDE.md', '*CLAUDE.local.md'], { cwd: root, timeoutMs: 10000 });
  if (res.code === 0) {
    for (const line of res.stdout.split('\n').map((s) => s.trim()).filter(Boolean)) {
      if (!line.includes('/')) continue;
      if (/(^|\/)(CLAUDE\.md|CLAUDE\.local\.md)$/.test(line)) found.add(path.join(root, line));
    }
  }
  for (const dir of ['.memory', 'requirements', 'docs']) {
    for (const name of ['CLAUDE.md', 'CLAUDE.local.md']) {
      const file = path.join(root, dir, name);
      if (fs.existsSync(file)) found.add(file);
    }
  }
  return [...found].sort();
}

function settingsFiles(project, env) {
  return [
    { label: '~/.claude/settings.json', file: path.join(claudeHome(env), 'settings.json'), user: true },
    { label: '.claude/settings.json', file: path.join(project.root, '.claude', 'settings.json') },
    { label: '.claude/settings.local.json', file: path.join(project.root, '.claude', 'settings.local.json') },
  ];
}

function checkInstructions(project, env, findings, { quick }) {
  const hosts = projectHosts(project.config);
  if (hosts.includes('claude-code')) {
    const own = path.join(project.root, 'CLAUDE.md');
    let ownText = null;
    try {
      ownText = fs.readFileSync(own, 'utf8');
    } catch {
      ownText = null;
    }
    if (ownText !== null && !importsAgents(ownText)) {
      finding(findings, 'claude-md-no-import', 'instructions', 'problem',
        'CLAUDE.md does not import AGENTS.md. With a CLAUDE.md in the project, Claude Code reads CLAUDE.md files only, so it never sees AGENTS.md.',
        'Ask the owner, then move the extra text into AGENTS.md (or a rule) and make CLAUDE.md the single line @AGENTS.md, as the model has it.');
    }
  }
  const onPathFiles = claudeMdOnPath(project.root, env);
  for (const file of onPathFiles) {
    if (file === path.join(project.root, 'CLAUDE.md')) continue;
    finding(findings, 'claude-md-on-path', 'instructions', 'problem',
      `${file} exists. A CLAUDE.md, .claude/CLAUDE.md, or CLAUDE.local.md in the project folder or a folder above it stops Claude Code from reading AGENTS.md, unless the project's own CLAUDE.md imports it.`,
      'Run toolkit sync to add the model\'s CLAUDE.md (the single line @AGENTS.md), or ask the owner and move that file\'s content into AGENTS.md.');
  }
  if (!quick) {
    for (const file of claudeMdInside(project.root)) {
      const hasAgents = fs.existsSync(path.join(path.dirname(file), 'AGENTS.md'));
      finding(findings, 'claude-md-inside', 'instructions', 'warning',
        `${path.relative(project.root, file)} exists. The model has one CLAUDE.md, at the top of the project, holding only @AGENTS.md${hasAgents ? '; the AGENTS.md in this folder is the one to keep current' : ''}.`,
        'Ask the owner, then move its content into that folder\'s AGENTS.md and remove it.');
    }
  }
  if (hosts.includes('claude-code')) {
    for (const v of FEATURE_FLAG_VARS) {
      if (truthy(env[v])) {
        finding(findings, 'agents-md-env', 'instructions', 'problem', `The environment variable ${v} is set. With it, Claude Code reads only CLAUDE.md files and never AGENTS.md.`, `Remove ${v} from the shell profile or the settings "env" block (ask the owner).`);
      }
    }
    for (const v of PROVIDER_VARS) {
      if (truthy(env[v])) finding(findings, 'agents-md-provider', 'instructions', 'warning', `${v} is set. Claude Code does not read AGENTS.md natively with third-party model providers.`, 'Use the Anthropic provider for Toolkit V2 projects, or ask the owner how to proceed.');
    }
    for (const s of settingsFiles(project, env)) {
      const data = readJson(s.file);
      if (!data) continue;
      if (data.disableAllHooks === true) finding(findings, 'disable-all-hooks', 'instructions', 'problem', `${s.label} sets disableAllHooks. That turns off the toolkit hooks and Claude Code's reading of AGENTS.md.`, `Remove disableAllHooks from ${s.label} (ask the owner).`);
      if (data.allowManagedHooksOnly === true) finding(findings, 'managed-hooks-only', 'instructions', 'problem', `${s.label} sets allowManagedHooksOnly. That turns off the toolkit hooks and Claude Code's reading of AGENTS.md.`, `Remove allowManagedHooksOnly from ${s.label} (ask the owner).`);
      for (const v of FEATURE_FLAG_VARS) {
        if (data.env && truthy(data.env[v])) finding(findings, 'agents-md-env', 'instructions', 'problem', `${s.label} sets ${v} in its "env" block. With it, Claude Code never reads AGENTS.md.`, `Remove ${v} from ${s.label} (ask the owner).`);
      }
      if (data.enabledPlugins && data.enabledPlugins['agents-md@builtin'] === false) {
        finding(findings, 'agents-md-plugin-off', 'instructions', 'problem', `${s.label} turns off the built-in agents-md plugin, so Claude Code does not read AGENTS.md.`, `Turn it back on in /plugin or remove "agents-md@builtin": false from ${s.label}.`);
      }
      const opt = data.pluginConfigs && data.pluginConfigs['agents-md@builtin'] && data.pluginConfigs['agents-md@builtin'].options && data.pluginConfigs['agents-md@builtin'].options.instructionFiles;
      if (s.user && (opt === 'claude-md' || opt === 'managed-only')) {
        finding(findings, 'agents-md-setting', 'instructions', 'problem', `The Claude Code "Project instructions" setting is ${opt}, so AGENTS.md is not read.`, 'Set it back to claude-md-or-agents-md in /config (ask the owner).');
      }
    }
  }
  const agentsFile = path.join(project.root, 'AGENTS.md');
  let agents = null;
  try {
    agents = fs.readFileSync(agentsFile, 'utf8');
  } catch {
    agents = null;
  }
  if (agents === null) {
    finding(findings, 'agents-md-missing', 'instructions', 'problem', 'AGENTS.md is missing. It is the project manual both hosts read.', 'Run toolkit sync.');
    return;
  }
  if (!hasSpan(agents)) {
    const proposal = fs.existsSync(path.join(project.root, ...PROPOSAL_PATH.split('/')));
    finding(findings, 'agents-md-no-v2', 'instructions', 'problem',
      `AGENTS.md has no Toolkit V2 sections (the <!-- toolkit:rules:start --> and <!-- toolkit:rules:end --> markers are missing).${proposal ? ` The Toolkit V2 version is in ${PROPOSAL_PATH}.` : ''}`,
      `The project-setup skill shows the owner the difference and, after his yes, merges the V2 sections and the two markers into AGENTS.md; then run toolkit sync.${proposal ? '' : ` Run toolkit sync first: it writes the proposal to ${PROPOSAL_PATH}.`}`);
  } else {
    const want = buildSpan(readRules(project.root));
    if (spanBody(agents) !== want) finding(findings, 'agents-md-span', 'instructions', 'problem', 'The rules list in AGENTS.md does not match the files in .claude/rules/.', 'Run toolkit sync.');
  }
  const tokens = agents.match(/\{\{[^{}]*\}\}/g);
  if (tokens) finding(findings, 'agents-md-tokens', 'instructions', 'problem', `AGENTS.md still has template tokens: ${[...new Set(tokens)].join(', ')}.`, 'Replace them with the real values, or run toolkit sync if the file is the toolkit\'s own copy.');
  if (/^\s*<!-- (if .+|endif) -->\s*$/m.test(agents)) finding(findings, 'agents-md-markers', 'instructions', 'problem', 'AGENTS.md still has template block markers (<!-- if ... --> or <!-- endif -->).', 'Remove the markers and the blocks that do not apply to this project.');
  if (agents.includes('(Filled by toolkit init')) finding(findings, 'agents-md-unfilled', 'instructions', 'problem', 'The rules list in AGENTS.md was never filled.', 'Run toolkit sync.');
  if (Buffer.byteLength(agents) > AGENTS_MAX_BYTES) {
    finding(findings, 'agents-md-size', 'instructions', 'problem', `AGENTS.md is ${Math.round(Buffer.byteLength(agents) / 1024)} KiB. Codex reads at most 32 KiB of AGENTS.md files in total, so nested ones and the end of this one may be cut.`, 'Move detail into skills, rules, or requirements/ and keep AGENTS.md under 24 KiB.');
  }
  if (/<Verified project commands/.test(agents)) finding(findings, 'agents-md-commands', 'instructions', 'note', 'The AGENTS.md Commands table has no verified build, test, or deploy commands yet.', 'Add them once they are known and verified.');
}

// ------------------------------------------------------------------ plugins and Codex

function checkPlugins(project, env, findings) {
  const hosts = projectHosts(project.config);
  const wanted = wantedV2Plugins(project.config);
  if (hosts.includes('claude-code')) {
    const file = path.join(project.root, '.claude', 'settings.json');
    let settings = null;
    let bad = false;
    try {
      settings = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      bad = err.code !== 'ENOENT';
      settings = null;
    }
    if (bad) {
      finding(findings, 'claude-settings-json', 'plugins', 'problem', '.claude/settings.json is not valid JSON, so Claude Code ignores it.', 'Fix the JSON, then run toolkit sync.');
    } else if (settings) {
      const enabled = settings.enabledPlugins || {};
      const wrong = Object.entries(wanted).filter(([id, v]) => enabled[id] !== v).map(([id, v]) => `${id} should be ${v}`);
      const old = claudeOldPlugins(env).map((n) => `${n}@${OLD_MARKETPLACE}`).filter((id) => enabled[id] !== false).map((id) => `${id} should be false`);
      if (wrong.length || old.length) {
        finding(findings, 'claude-plugins', 'plugins', 'problem', `Claude Code plugin switches in .claude/settings.json are not as the toolkit needs them: ${[...wrong, ...old].join('; ')}.`, 'Run toolkit sync. If .claude/settings.json was changed by the project, set these enabledPlugins values by hand.');
      }
    }
  }
  if (hosts.includes('codex')) {
    const file = path.join(project.root, '.codex', 'config.toml');
    let text = null;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      text = null;
    }
    if (text !== null) {
      const wrong = [];
      for (const [id, v] of Object.entries(wanted)) if (tomlGet(text, ['plugins', id, 'enabled']) !== v) wrong.push(`${id} should be ${v}`);
      for (const n of codexOldPlugins(env)) {
        const id = `${n}@${OLD_MARKETPLACE}`;
        if (tomlGet(text, ['plugins', id, 'enabled']) !== false) wrong.push(`${id} should be false`);
      }
      if (wrong.length) finding(findings, 'codex-plugins', 'plugins', 'problem', `Codex plugin switches in .codex/config.toml are not as the toolkit needs them: ${wrong.join('; ')}.`, 'Run toolkit sync. If the file was changed by the project, set these [plugins."..."] enabled values by hand.');
    }
  }
}

/**
 * The two settings the toolkit's Claude Code fragment sets: `attribution`
 * with empty commit and pr texts, so Claude Code adds no AI credit to commits
 * and pull requests (sample run claude-a found it on four of five commits),
 * and skillListingBudgetFraction 0.02, so every Toolkit V2 skill description
 * stays in Claude's skill list (Mike approved, 2026-09-27). A settings.local.json
 * that sets attribution again wins over the project file, so it is read too.
 */
function checkClaudeSettings(project, findings) {
  if (!projectHosts(project.config).includes('claude-code')) return;
  const settings = readJson(path.join(project.root, '.claude', 'settings.json'));
  if (!settings) return; // Missing or not valid JSON: the scaffold and plugin checks report it.
  const local = readJson(path.join(project.root, '.claude', 'settings.local.json')) || {};
  const attribution = Object.prototype.hasOwnProperty.call(local, 'attribution') ? local.attribution : settings.attribution;
  const where = Object.prototype.hasOwnProperty.call(local, 'attribution') ? '.claude/settings.local.json' : '.claude/settings.json';
  if (!hidesAttribution(attribution)) {
    finding(findings, 'claude-attribution', 'plugins', 'problem',
      attribution === undefined
        ? '.claude/settings.json has no "attribution" setting, so Claude Code adds a Co-Authored-By line naming the AI to commits and a "Generated with" line to pull requests whenever the owner\'s own settings are not loaded.'
        : `${where} sets "attribution" to ${JSON.stringify(attribution)}, so Claude Code can add AI credit to commits and pull requests.`,
      'Run toolkit sync; it adds "attribution": {"commit": "", "pr": "", "sessionUrl": false}. If the file was changed by the project, set that value by hand.');
  }
  // The risky toolkit commands ask the owner first (decision 12).
  const ask = [...(((settings.permissions || {}).ask) || []), ...(((local.permissions || {}).ask) || [])];
  const missingAsk = TOOLKIT_ASK_RULES.filter((r) => !ask.includes(r));
  if (missingAsk.length) {
    finding(findings, 'claude-ask-rules', 'plugins', 'warning',
      `.claude/settings.json does not make Claude Code ask the owner before ${missingAsk.length === TOOLKIT_ASK_RULES.length ? 'the toolkit commands that are hard to undo' : 'some toolkit commands that are hard to undo'} (missing permissions.ask: ${missingAsk.join(', ')}). They would run without his yes.`,
      'Run toolkit sync; it adds them. If the file was changed by the project, add them to permissions.ask by hand.');
  }
  const budget = Object.prototype.hasOwnProperty.call(local, 'skillListingBudgetFraction') ? local.skillListingBudgetFraction : settings.skillListingBudgetFraction;
  if (!(typeof budget === 'number' && budget >= SKILL_BUDGET)) {
    finding(findings, 'claude-skill-budget', 'plugins', 'warning',
      `.claude/settings.json ${budget === undefined ? 'does not set skillListingBudgetFraction' : `sets skillListingBudgetFraction to ${JSON.stringify(budget)}`}. At Claude Code's default (0.01, 1% of the context window) the skill list drops descriptions when many skills are installed, and Claude is then less likely to pick the right Toolkit V2 skill.`,
      `Run toolkit sync; it sets "skillListingBudgetFraction": ${SKILL_BUDGET}. If the file was changed by the project, set it by hand.`);
  }
}

/**
 * The Codex twin of the claude-ask-rules check (decision 12): the project's
 * .codex/rules/*.rules files must make Codex ask the owner (a "prompt" or
 * "forbidden" rule) before each ask-first toolkit command. A project that
 * changed .codex/rules/toolkit.rules keeps its own file, so sync alone never
 * adds the prompt rules there.
 */
function checkCodexAskRules(project, findings, { pluginRoot }) {
  if (!projectHosts(project.config).includes('codex')) return;
  const { files, rules } = projectCodexRules(project.root);
  if (!files.length) return; // No rules file: the scaffold check reports the missing .codex/rules/toolkit.rules.
  const missing = ASK_FIRST_COMMANDS.map((c) => ['toolkit', ...c])
    .filter((words) => !['prompt', 'forbidden'].includes(ruleDecision(rules, [...words, 'x'])))
    .map((words) => words.join(' '));
  if (!missing.length) return;
  const template = path.join(pluginRoot || DEFAULT_PLUGIN_ROOT, 'templates', 'codex', 'toolkit.rules');
  finding(findings, 'codex-ask-rules', 'codex', 'warning',
    `.codex/rules/ does not make Codex ask the owner before ${missing.length === ASK_FIRST_COMMANDS.length ? 'the toolkit commands that are hard to undo' : 'some toolkit commands that are hard to undo'}: ${missing.join(', ')}. The general toolkit rule allows ${missing.length === 1 ? 'it' : 'them'}, so ${missing.length === 1 ? 'it runs' : 'they run'} without his yes.`,
    `Run toolkit sync. If the project changed .codex/rules/toolkit.rules, sync leaves it alone: copy the prefix_rule entries with decision = "prompt" for these commands from ${template} into it, above the general toolkit rule (ask the owner first).`,
    { host: 'codex', commands: missing });
}

function checkCodex(project, env, findings) {
  if (!projectHosts(project.config).includes('codex')) return;
  const trust = codexTrust(project.root, env);
  if (trust !== 'trusted') {
    finding(findings, 'codex-trust', 'codex', 'warning',
      `Codex does not trust this folder (${project.root})${trust ? `: trust_level is ${trust}` : ''}. Codex loads the project's .codex/ settings, plugin switches, and hooks only in a trusted folder. Trust is tied to the folder path, so moving the project turns it off.`,
      'The owner opens Codex in this folder and trusts it when Codex asks.', { host: 'codex' });
  }
  // Codex names a plugin hook "<plugin>@<marketplace>:<file>...:<event>:<i>:<j>"
  // (seen in ~/.codex/config.toml: "browser@openai-bundled:plugin.json#hooks[0]:stop:0:0").
  const hookKeys = codexHookTrustKeys(`toolkit@${MARKETPLACE}:`, env);
  if (!hookKeys.length) {
    finding(findings, 'codex-hook-trust', 'codex', 'warning', 'The Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no briefing, no memory reminder, no guards).', 'The owner opens /hooks in Codex once and trusts the Toolkit V2 hooks.', { host: 'codex' });
  } else {
    // A trust entry exists; is it for the hooks Codex would run now? (final review M10)
    const seen = readCodexHooksSeen(env);
    const codexCopies = installedPluginCopies('toolkit', env).filter((c) => c.host === 'codex' && c.path && c.version).sort((a, b) => compareVersions(a.version, b.version));
    const newest = codexCopies.length ? codexCopies[codexCopies.length - 1] : null;
    const now = newest ? codexHooksHash(newest.path) : null;
    if (seen && now && seen.hash !== now) {
      finding(findings, 'codex-hook-changed', 'codex', 'warning',
        `The Toolkit V2 hooks changed since Codex last ran them (Codex last ran the hooks of toolkit ${seen.version || 'an older version'}; its copy is now ${newest.version}). Codex skips a changed hook until the owner trusts it again.`,
        'The owner opens /hooks in Codex and trusts the Toolkit V2 hooks again.', { host: 'codex' });
    }
  }
  if (project.config.salesforce && project.config.salesforce.enabled && fs.existsSync(path.join(project.root, '.codex', 'hooks.json'))) {
    const sfKeys = codexHookTrustKeys(path.join(project.root, '.codex', 'hooks.json'), env);
    if (!sfKeys.length) finding(findings, 'codex-sf-hook-trust', 'codex', 'warning', 'The Salesforce org guards in .codex/hooks.json are not trusted in Codex yet, so Codex does not run them.', 'The owner opens /hooks in Codex in this project and trusts the two Salesforce guards.', { host: 'codex' });
  }
}

/**
 * Codex on this computer (Codex setup run, 2026-09-26): `codex plugin add`
 * writes enabled = true for the plugin in ~/.codex/config.toml, which loads it
 * in every Codex folder, claude-toolkit projects included. Toolkit V2 plugins
 * stay off there and on only in a project whose own .codex/config.toml turns
 * them on. Codex also runs its own copy of a plugin, filed under the version,
 * so after a toolkit update it runs the older copy until the plugin is added
 * again.
 */
function checkCodexMachine(project, env, findings, { pluginRoot }) {
  // The toolkit plugin itself is on for every folder (decision 10); only the others are reported.
  const on = V2_PLUGINS.filter((name) => !MACHINE_WIDE_PLUGINS.includes(name) && codexPluginOnEverywhere(name, env));
  if (on.length) {
    finding(findings, 'codex-plugins-everywhere', 'computer', 'warning',
      `~/.codex/config.toml turns ${on.length === 1 ? 'this Toolkit V2 plugin' : 'these Toolkit V2 plugins'} on for every folder: ${on.map((n) => `${n}@${MARKETPLACE}`).join(', ')}. Codex then loads ${on.length === 1 ? 'it' : 'them'} in every project, including claude-toolkit projects. codex plugin add does this after every install or update.`,
      'With the owner\'s yes, run toolkit machine-setup: it sets enabled = false for them in ~/.codex/config.toml (toolkit itself stays on). Each project set up by toolkit init turns them on for itself.');
  }
  if (!projectHosts(project.config).includes('codex')) return;
  const running = pluginVersion(pluginRoot || DEFAULT_PLUGIN_ROOT);
  const codex = installedPluginCopies('toolkit', env).filter((c) => c.host === 'codex' && c.version).map((c) => c.version);
  if (running && codex.length && codex.every((v) => compareVersions(v, running) < 0)) {
    const newest = [...codex].sort(compareVersions).pop();
    finding(findings, 'codex-plugin-old', 'computer', 'warning',
      `Codex runs toolkit ${newest}, which is older than this toolkit (${running}). Codex runs the copy it made at install time, so it misses the newer commands and fixes.`,
      'With the owner\'s yes, run codex plugin add toolkit@toolkit-v2 (and the other Toolkit V2 plugins), then toolkit machine-setup to switch them off for every folder again.');
  }
}

function checkComputer(project, env, findings) {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) finding(findings, 'node-version', 'computer', 'problem', `Node.js ${process.versions.node} is older than 20.`, 'Install Node.js 20 or newer (ask the owner).');
  // The pointer and the wrapper are for Codex (and for a terminal). A Claude
  // Code-only project does not need them (final review M4). The message names
  // the pointer file this computer really reads (TOOLKIT_V2_CONFIG_DIR).
  const hosts = project.config && Object.keys(project.config).length ? projectHosts(project.config) : ['claude-code', 'codex'];
  if (hosts.includes('codex')) {
    const file = pointerPath(env);
    const pointer = readPointer(env);
    if (!pointer) {
      finding(findings, 'plugin-pointer', 'computer', 'warning', `${file} is missing, so the toolkit wrapper cannot find the toolkit.`, 'Run toolkit machine-setup (the session-start hook also refreshes it in Toolkit V2 projects).');
    } else if (!isCompleteRoot(pointer)) {
      finding(findings, 'plugin-pointer', 'computer', 'warning', `${file} names ${pointer}, which has no bin/toolkit or no scaffold/CONDITIONS.json, so the wrapper uses its fallback folder.`, 'Run toolkit machine-setup (the session-start hook also refreshes it in Toolkit V2 projects).');
    } else if (!isInstalledRoot(pointer, env)) {
      finding(findings, 'plugin-pointer', 'computer', 'warning', `${file} names ${pointer}, which is not an installed copy of toolkit@${MARKETPLACE} (the Claude Code or Codex plugin cache, or the registered marketplace source folder). A test copy there can go out of date or be deleted.`, 'Run toolkit machine-setup from an installed copy (ask the owner first).');
    }
    const w = wrapperState(env);
    if (!w.exists) finding(findings, 'wrapper-missing', 'computer', 'warning', `The toolkit wrapper script ${w.path} is missing, so Codex cannot run toolkit commands by name.`, 'Run toolkit machine-setup.');
    else if (!w.ours) finding(findings, 'wrapper-foreign', 'computer', 'warning', `${w.path} exists but was not written by toolkit machine-setup.`, 'Ask the owner, then move it aside and run toolkit machine-setup.');
    else if (!onPath(path.dirname(w.path), env)) finding(findings, 'wrapper-path', 'computer', 'warning', `${path.dirname(w.path)} is not on the PATH, so the wrapper is not found by name.`, 'Add it to the PATH in the shell profile (ask the owner).');
  }
  const copies = installedPluginCopies('toolkit', env);
  const claude = copies.filter((c) => c.host === 'claude-code' && c.version).map((c) => c.version);
  const codex = copies.filter((c) => c.host === 'codex' && c.version).map((c) => c.version);
  if (claude.length && codex.length && !claude.some((v) => codex.includes(v))) {
    finding(findings, 'plugin-versions', 'computer', 'warning', `Claude Code runs toolkit ${claude.join(', ')} and Codex runs toolkit ${codex.join(', ')}. Two versions can write the tracker and memory differently.`, 'Update the older copy (claude plugin update toolkit@toolkit-v2, or codex plugin add toolkit@toolkit-v2), with the owner\'s yes.');
  }
}

// ------------------------------------------------------------------ scaffold

function checkScaffold(project, env, findings, { pluginRoot }) {
  // An unreadable hosts value is already reported (config-hosts); the plan cannot run until it is fixed.
  if (readHosts(project.config).problem) return null;
  let plan;
  try {
    plan = planManifest(project, { mode: 'sync', env, pluginRoot });
  } catch (err) {
    finding(findings, 'scaffold-plan', 'scaffold', 'problem', `The scaffold could not be checked: ${err.message}`, (err.details && err.details.fix) || 'Reinstall or update the toolkit plugin.');
    return null;
  }
  const by = (action) => plan.targets.filter((t) => t.action === action);
  const missing = by('install');
  if (missing.length) finding(findings, 'scaffold-missing', 'scaffold', 'problem', `${missing.length} scaffold file${missing.length === 1 ? ' is' : 's are'} missing: ${missing.map((t) => t.target).slice(0, 12).join(', ')}${missing.length > 12 ? ', ...' : ''}.`, 'Run toolkit sync.');
  const unrecorded = plan.targets.filter((t) => t.adoptedIdentical);
  if (unrecorded.length) finding(findings, 'scaffold-unrecorded', 'scaffold', 'warning', `${unrecorded.length} scaffold file${unrecorded.length === 1 ? ' matches' : 's match'} the toolkit's version but ${unrecorded.length === 1 ? 'is' : 'are'} not recorded in .toolkit.json (an earlier setup stopped part way): ${unrecorded.map((t) => t.target).slice(0, 8).join(', ')}${unrecorded.length > 8 ? ', ...' : ''}.`, 'Run toolkit sync; it records them, so later updates reach them.');
  const outdated = by('update');
  if (outdated.length) finding(findings, 'scaffold-outdated', 'scaffold', 'warning', `${outdated.length} scaffold file${outdated.length === 1 ? ' is' : 's are'} older than the toolkit's version and unchanged by the project: ${outdated.map((t) => t.target).join(', ')}.`, 'Run toolkit sync.');
  const agents = plan.targets.find((t) => t.target === 'AGENTS.md');
  if (agents && agents.spanOnly && !findings.some((f) => f.id === 'agents-md-span')) {
    finding(findings, 'agents-md-span', 'instructions', 'problem', 'The rules list in AGENTS.md does not match the files in .claude/rules/.', 'Run toolkit sync.');
  }
  for (const t of by('adopt')) {
    finding(findings, 'scaffold-adopt', 'scaffold', 'warning', `${t.target} has the Toolkit V2 sections, but the toolkit has not recorded it yet, so sync cannot tell later changes apart.`, 'Run toolkit sync.');
  }
  for (const t of by('conflict')) finding(findings, 'scaffold-conflict', 'scaffold', 'problem', t.conflicts.join(' '), `Fix ${t.target} by hand (define each setting one way only), then run toolkit sync.`);
  const changed = by('changed').filter((t) => !t.target.startsWith('.memory/') && !t.target.startsWith('.work-items/'));
  for (const t of changed) {
    if (t.preexisting && !t.would.length) {
      finding(findings, 'scaffold-changed', 'scaffold', 'note', `${t.target} is the project's own file from before the toolkit, so sync leaves it alone and the toolkit's version was never installed.`, 'The project-setup skill can show the owner the toolkit\'s version, and merges it only after his yes.');
      continue;
    }
    finding(findings, 'scaffold-changed', 'scaffold', 'note', `${t.target} was changed by the project, so sync leaves it alone.${t.would.length ? ` The toolkit would: ${t.would.join('; ')}.` : ' The toolkit\'s own version has not changed since it was installed, so the project\'s differences from it stay as they are.'}`, t.would.length ? 'The project-setup skill shows these to the owner and makes the changes he approves.' : null);
  }
  for (const t of by('leftover')) finding(findings, 'scaffold-leftover', 'scaffold', 'note', `${t.target} is left over from an earlier setup (its condition no longer holds).`, 'Ask the owner whether to keep or delete it.');
  return plan;
}

// ------------------------------------------------------------------ project hooks

const ROOT_MARK = '\u0001ROOT\u0001';
// How the project's hook commands name the project folder: Claude Code sets
// CLAUDE_PROJECT_DIR; the model's Codex hooks ask Git for the top folder.
const ROOT_EXPRESSIONS = [
  /\$\{CLAUDE_PROJECT_DIR\}/g,
  /\$CLAUDE_PROJECT_DIR\b/g,
  /\$\(\s*git rev-parse --show-toplevel\s*\)/g,
  /`\s*git rev-parse --show-toplevel\s*`/g,
];
const SCRIPT_EXT = /\.(?:c?js|mjs|ts|py|sh|bash|zsh|rb|pl|ps1)$/i;

function markRoot(s) {
  let out = String(s);
  for (const re of ROOT_EXPRESSIONS) out = out.replace(re, ROOT_MARK);
  return out;
}

/** Split a shell command into words: quotes and backslashes are honored, and ; & | < > ( ) end a word. */
function shellWords(command) {
  const words = [];
  let cur = '';
  let has = false;
  let quote = null;
  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && quote === '"' && i + 1 < command.length) cur += command[++i];
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      has = true;
    } else if (ch === '\\' && i + 1 < command.length) {
      cur += command[++i];
      has = true;
    } else if (/\s/.test(ch) || ';&|<>()'.includes(ch)) {
      if (has) words.push(cur);
      cur = '';
      has = false;
    } else {
      cur += ch;
      has = true;
    }
  }
  if (has) words.push(cur);
  return words;
}

/**
 * The project files a hook handler runs, as paths relative to the project
 * folder: a word that starts with the project folder ($CLAUDE_PROJECT_DIR,
 * $(git rev-parse --show-toplevel)), or a relative path to a script file
 * (tools/kb/hook.py). A word with any other variable (such as a plugin's own
 * folder) is not a project file and is skipped.
 */
export function hookScriptPaths(handler) {
  if (!handler || typeof handler.command !== 'string') return [];
  const words = Array.isArray(handler.args)
    ? [handler.command, ...handler.args].filter((w) => typeof w === 'string').map(markRoot)
    : shellWords(markRoot(handler.command));
  const out = [];
  for (const w of words) {
    if (w.startsWith(`${ROOT_MARK}/`)) {
      const rel = w.slice(ROOT_MARK.length + 1).replace(/^\.\//, '');
      if (rel && !rel.includes('$') && !rel.includes(ROOT_MARK)) out.push(rel);
    } else if (!w.includes('$') && !w.includes(ROOT_MARK) && !w.startsWith('-') && !w.startsWith('~') && !path.isAbsolute(w) && w.includes('/') && SCRIPT_EXT.test(w)) {
      out.push(w.replace(/^\.\//, ''));
    }
  }
  return [...new Set(out)];
}

/** Every hook in the project's .claude/settings.json and .codex/hooks.json runs a script that exists. */
function checkHookScripts(project, findings) {
  for (const rel of ['.claude/settings.json', '.codex/hooks.json']) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(project.root, ...rel.split('/')), 'utf8'));
    } catch {
      continue; // Missing, or not valid JSON (the scaffold check reports that).
    }
    const hooks = data && typeof data === 'object' ? data.hooks : null;
    if (!hooks || typeof hooks !== 'object') continue;
    const missing = [];
    for (const [event, groups] of Object.entries(hooks)) {
      if (!Array.isArray(groups)) continue;
      for (const g of groups) {
        for (const h of (g && Array.isArray(g.hooks) ? g.hooks : [])) {
          if (!h || (h.type && h.type !== 'command')) continue;
          for (const script of hookScriptPaths(h)) {
            if (!fs.existsSync(path.join(project.root, ...script.split('/')))) missing.push(`${event} runs ${script}`);
          }
        }
      }
    }
    if (!missing.length) continue;
    const one = missing.length === 1;
    finding(findings, 'hook-script-missing', 'hooks', 'problem',
      `${rel} registers ${one ? 'a hook whose script is' : `${missing.length} hooks whose scripts are`} missing, so ${one ? 'it fails' : 'they fail'} every time ${one ? 'it runs' : 'they run'}: ${[...new Set(missing)].join('; ')}.`,
      `Run toolkit sync: when Salesforce is off, it takes the Salesforce hooks out of a ${rel} the project has not changed. Otherwise restore the missing file, or remove the hook from ${rel} with the owner's yes.`);
  }
}

// ------------------------------------------------------------------ Salesforce

function checkSalesforce(project, findings, { pluginRoot }) {
  const c = project.config;
  if (!(c.salesforce && c.salesforce.enabled)) return;
  const orgs = c.salesforce.orgs || {};
  const missing = ['sandbox', 'production'].filter((k) => !orgs[k]);
  if (missing.length) finding(findings, 'sf-orgs', 'salesforce', 'warning', `The Salesforce org alias for ${missing.join(' and ')} is not recorded in .toolkit.json.`, missing.map((k) => `toolkit config set salesforce.orgs.${k} <alias>`).join(' and '));
  const hosts = projectHosts(c);
  // The model holds each Salesforce skill twice, with the same text: .claude/skills/ and .agents/skills/.
  const srcDir = path.join(pluginRoot || DEFAULT_PLUGIN_ROOT, ...MODEL_DIR.split('/'), '.claude', 'skills');
  let skills = [];
  try {
    skills = fs.readdirSync(srcDir).filter((n) => n.startsWith('sf-') && fs.existsSync(path.join(srcDir, n, 'SKILL.md')));
  } catch {
    skills = [];
  }
  for (const name of skills) {
    const read = (p) => {
      try {
        return fs.readFileSync(p, 'utf8');
      } catch {
        return null;
      }
    };
    const source = read(path.join(srcDir, name, 'SKILL.md'));
    const claude = hosts.includes('claude-code') ? read(path.join(project.root, '.claude', 'skills', name, 'SKILL.md')) : undefined;
    const agentsCopy = hosts.includes('codex') ? read(path.join(project.root, '.agents', 'skills', name, 'SKILL.md')) : undefined;
    if (claude !== undefined && agentsCopy !== undefined && claude !== null && agentsCopy !== null && claude !== agentsCopy) {
      finding(findings, 'sf-skill-copies', 'salesforce', 'problem', `The two copies of the ${name} skill differ (.claude/skills/${name}/SKILL.md and .agents/skills/${name}/SKILL.md), so Claude Code and Codex follow different steps.`, 'Make them the same: keep the right one and copy it over the other.');
    } else {
      const copy = claude !== undefined ? claude : agentsCopy;
      if (copy && source && copy !== source) finding(findings, 'sf-skill-changed', 'salesforce', 'note', `The ${name} skill in this project differs from the toolkit's version.`, null);
    }
  }
}

// ------------------------------------------------------------------ tracker, memory, backup

function gitIgnored(root, rel) {
  const res = run('git', ['check-ignore', '-q', rel], { cwd: root, timeoutMs: 5000 });
  return res.code === 0 ? true : res.code === 1 ? false : null;
}

async function checkTracker(project, env, findings, { quick, pluginRoot }) {
  const c = project.config;
  const type = (c.tracker && c.tracker.type) || 'local';
  const mainRoot = project.mainRoot || project.root;
  if (type === 'local') {
    const dir = path.join(mainRoot, '.work-items');
    if (!fs.existsSync(dir)) {
      finding(findings, 'tracker-missing', 'tracker', 'problem', `The work-item folder ${dir} is missing.`, 'If the owner has a backup, restore it with toolkit import --from <folder> --only work-items. Otherwise run toolkit sync to start an empty tracker.');
      return;
    }
    if (gitIgnored(mainRoot, '.work-items/') === false) finding(findings, 'tracker-not-ignored', 'tracker', 'problem', '.work-items/ is not Git-ignored, so work items could be committed.', 'Add /.work-items/ to .gitignore (toolkit sync adds it when .gitignore is the toolkit\'s own copy).');
    const state = readJson(path.join(dir, '.toolkit-state.json'));
    if (state && Number.isInteger(state.schema) && state.schema > 1) finding(findings, 'tracker-state-newer', 'tracker', 'problem', `The work-item state file was written by a newer toolkit (schema ${state.schema}).`, 'Update the toolkit plugin.');
    if (!quick) {
      const { scanTree } = await import('../work/state.mjs');
      const { validateFile } = await import('../work/ops.mjs');
      const tree = scanTree(dir);
      const bad = [];
      const questions = [];
      for (const f of tree.files) {
        let res;
        try {
          res = validateFile(f.abs, { prefix: (c.tracker && c.tracker.idPrefix) || 'WI', ownerName: c.project && c.project.owner });
        } catch {
          continue;
        }
        if (!res.id && res.kind === 'record' && !res.errors.some((e) => e.code === 'bad_frontmatter')) continue;
        if (res.errors.length) bad.push(res.id || path.relative(mainRoot, f.abs));
        if (res.gates.length) questions.push(res.id || path.relative(mainRoot, f.abs));
      }
      if (bad.length) finding(findings, 'tracker-invalid', 'tracker', 'warning', `${bad.length} work item file${bad.length === 1 ? ' has' : 's have'} validation errors: ${[...new Set(bad)].join(', ')}.`, 'Run toolkit work validate for the details and fix each one.');
      if (questions.length) finding(findings, 'tracker-questions', 'tracker', 'note', `Work items with gate questions for the owner: ${[...new Set(questions)].join(', ')}.`, 'The work-decide skill asks them.');
    }
  } else if (type === 'notion') {
    const wi = c.notion && c.notion.workItems;
    if (!wi || !wi.dataSourceId) finding(findings, 'notion-work-items', 'tracker', 'problem', 'The Notion Work Items database is not set up for this project (.toolkit.json has no notion.workItems ids).', 'Run toolkit notion ensure-project.');
  } else {
    const { trackerInstructionsPath } = await import('../work/driver.mjs');
    const where = trackerInstructionsPath(type, pluginRoot, { env });
    finding(findings, 'tracker-instructions', 'tracker', 'note', `Work items live in ${type === 'github' ? 'GitHub Issues' : 'Jira'}. toolkit work does not manage them; agents follow ${where.path || where.rel}.`, null);
  }
}

async function checkMemory(project, env, findings, { quick, fetch: fetchFn }) {
  const c = project.config;
  const type = (c.memory && c.memory.type) || 'builtin';
  const mainRoot = project.mainRoot || project.root;
  if (type === 'builtin') {
    if (gitIgnored(mainRoot, '.memory/') === false) finding(findings, 'memory-not-ignored', 'memory', 'problem', '.memory/ is not Git-ignored, so memory could be committed.', 'Add /.memory/ to .gitignore.');
    try {
      const { createDriver } = await import('../memory/builtin.mjs');
      const driver = await createDriver({ root: project.root, mainRoot });
      const st = await driver.status();
      if (!st.healthy) finding(findings, 'memory-unhealthy', 'memory', 'problem', st.detail, 'Run toolkit sync to add the .memory/ seeds, then toolkit memory status.');
      for (const p of st.problems || []) {
        if (!st.healthy && p.problem === 'does not exist.') continue;
        finding(findings, 'memory-problem', 'memory', 'warning', `${p.where} ${p.problem}`, /reindex/.test(p.problem) ? 'Run toolkit memory reindex.' : 'Run toolkit memory status for details.');
      }
    } catch (err) {
      finding(findings, 'memory-error', 'memory', 'problem', `Built-in memory could not be read: ${err.message}`, 'Run toolkit memory status for details.');
    }
  } else if (type === 'hindsight') {
    const hs = c.hindsight || {};
    if (!hs.bank) finding(findings, 'hindsight-bank', 'memory', 'problem', '.toolkit.json has no hindsight.bank yet, so memory has nowhere to go.', 'Run toolkit hindsight ensure-bank.');
    if (!quick) {
      const { HindsightClient, DEFAULT_URL } = await import('../hindsight/client.mjs');
      const { settingsProblems } = await import('../hindsight/bank.mjs');
      const client = new HindsightClient({ url: hs.url || DEFAULT_URL, fetch: fetchFn, timeoutMs: 3000 });
      try {
        const h = await client.health({ timeoutMs: 2000 });
        if (!h || h.status !== 'healthy') throw new Error(`it answered ${JSON.stringify(h)}`);
        if (hs.bank) {
          const row = await client.getBank(hs.bank);
          const cfg = row ? await client.getBankConfig(hs.bank) : null;
          if (!cfg) finding(findings, 'hindsight-bank-missing', 'memory', 'problem', `The Hindsight bank ${hs.bank} does not exist on ${client.url}.`, 'Run toolkit hindsight ensure-bank.');
          else for (const p of settingsProblems(cfg)) finding(findings, 'hindsight-bank-settings', 'memory', 'warning', `Hindsight bank ${hs.bank}: ${p}`, 'Run toolkit hindsight ensure-bank.');
        }
      } catch (err) {
        if (err && err.details && err.details.sandbox) {
          finding(findings, 'hindsight-sandbox', 'memory', 'warning', `The Codex sandbox blocked doctor's request to the local Hindsight server at ${client.url}, so it was not checked. The server itself may be running.`, 'Run toolkit doctor alone on its own line, so the project\'s .codex/rules/toolkit.rules runs it outside the sandbox, or run it in a terminal.');
        } else {
          finding(findings, 'hindsight-down', 'memory', 'problem', `The local Hindsight server at ${client.url} does not answer (${err.message}).`, 'Check it with toolkit hindsight service status; start it with toolkit hindsight service start after the owner\'s yes.');
        }
      }
    }
  } else if (type === 'notion') {
    const mem = c.notion && c.notion.memory;
    if (!mem || !mem.dataSourceId) finding(findings, 'notion-memory', 'memory', 'problem', 'The Notion memory is not set up for this project: .toolkit.json has no notion.memory ids for its Memory page and Lore\'s databases on it.', 'Run toolkit notion ensure-project.');
    else if (mem.layout !== 'lore') {
      finding(findings, 'notion-memory-old-layout', 'memory', 'problem',
        'This project\'s Notion memory is still in the older single Memory database. Toolkit V2 keeps Notion memory in Lore\'s layout: a Memory page on the project row with Lore\'s databases, so Lore\'s tools can read it.',
        'Run toolkit notion ensure-project: it copies every record into the Lore layout, checks each one, and records the new ids.');
    }
  }
  if (!quick && type !== 'builtin') await checkFocusShape(project, env, findings, { fetch: fetchFn });
}

/**
 * Hindsight and Notion: the current focus has the model's "# Current focus"
 * heading and a dated "Last updated:" line (built-in memory reports this in
 * toolkit memory status). A backend that cannot be read in 5 seconds is
 * skipped; its own checks report that.
 */
async function checkFocusShape(project, env, findings, { fetch: fetchFn }) {
  const controller = new AbortController();
  let timer;
  try {
    const { loadDriver, focusShapeProblems } = await import('../memory/contract.mjs');
    const work = (async () => {
      const driver = await loadDriver(project, { env, fetch: fetchFn, timeoutMs: 5000, signal: controller.signal });
      return driver.focusGet();
    })();
    work.catch(() => {});
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error('no answer in 5 seconds'));
      }, 5000);
    });
    const doc = await Promise.race([work, deadline]);
    for (const p of focusShapeProblems(doc && doc.text)) {
      finding(findings, 'memory-focus-shape', 'memory', 'warning', `The current focus ${p}`, 'Save it again with toolkit memory focus --text \'<text>\'; the command adds the heading and the "Last updated:" line when they are missing.');
    }
  } catch {
    // Unreachable memory is reported by the checks above.
  } finally {
    clearTimeout(timer);
  }
}

function checkNtn(project, env, findings) {
  const c = project.config;
  const usesNotion = (c.tracker && c.tracker.type) === 'notion' || (c.memory && c.memory.type) === 'notion';
  if (!usesNotion) return;
  const bin = env.TOOLKIT_NTN_BIN || 'ntn';
  const res = run(bin, ['whoami'], { timeoutMs: 15000, env });
  if (res.code === 127) finding(findings, 'ntn-missing', 'notion', 'problem', 'The Notion CLI (ntn) is not installed, and this project uses Notion.', 'Install it with npm install -g ntn (ask the owner), then the owner runs ntn login.');
  else if (res.code !== 0) finding(findings, 'ntn-signed-out', 'notion', 'problem', `The Notion CLI is not signed in (ntn whoami failed${res.stderr ? `: ${res.stderr.trim().split('\n')[0]}` : ''}).`, 'The owner runs ntn login himself; it opens a browser sign-in. In Codex, toolkit commands must run outside the sandbox, which blocks the keychain.');
}

function newestTime(...values) {
  const times = values.filter(Boolean).map((v) => Date.parse(v)).filter((n) => Number.isFinite(n));
  return times.length ? Math.max(...times) : null;
}

function birthTime(p) {
  try {
    const st = fs.statSync(p);
    return st.birthtimeMs || st.ctimeMs;
  } catch {
    return null;
  }
}

/**
 * True when a backup folder can be made: it exists, or its nearest existing
 * parent is a real folder, not the top of the disk or /Volumes (a drive that
 * is not plugged in).
 */
export function backupReachable(dir) {
  let cur = path.resolve(dir);
  for (;;) {
    if (fs.existsSync(cur)) return cur !== path.parse(cur).root && cur !== '/Volumes';
    const up = path.dirname(cur);
    if (up === cur) return false;
    cur = up;
  }
}

/**
 * The backup checks (M19; decision 13; final review I8). The local tracker,
 * built-in memory, and Hindsight memory exist only on this computer.
 * - No backup folder set (.toolkit.json backup.dir): a warning that suggests
 *   one, from the first day.
 * - A backup folder set: a warning when the last backup is more than
 *   BACKUP_MAX_AGE_DAYS (1) day old, or when nothing was ever backed up and
 *   the folders are more than a day old; and when the folder cannot be
 *   reached.
 * - The owner chose no backup folder (backup.dir none): the older 7-day
 *   reminder, as a note.
 */
export function checkBackup(project, findings, { now = Date.now(), env = process.env } = {}) {
  const c = project.config;
  const parts = backupParts(c);
  if (!parts.length) return;
  const local = parts.some((p) => p.name === 'work-items');
  const builtin = parts.some((p) => p.name === 'memory');
  const mainRoot = project.mainRoot || project.root;
  const record = readExportRecord(project);
  let memoryExport = null;
  if (builtin) {
    const meta = readJson(path.join(mainRoot, '.memory', '.toolkit-meta.json'));
    memoryExport = meta && meta.lastExport;
  }
  const last = newestTime(record && record.lastExport, local ? null : memoryExport);
  const folders = [local ? path.join(mainRoot, '.work-items') : null, builtin ? path.join(mainRoot, '.memory') : null].filter(Boolean);
  const oldest = folders.map(birthTime).filter(Boolean);
  const since = oldest.length ? Math.min(...oldest) : null;
  const what = parts.map((p) => p.words).join(' and ');
  const plural = parts.length > 1;
  const setting = backupSetting(project, env);
  const age = last ? Math.floor((now - last) / DAY) : null;
  if (!setting) {
    finding(findings, 'backup-folder', 'backup', 'warning',
      `No backup folder is set. ${what} ${plural ? 'exist' : 'exists'} only on this computer (Git ignores ${plural ? 'them' : 'it'})${last ? `, and the last backup was ${age} day${age === 1 ? '' : 's'} ago` : ', and nothing has been backed up yet'}.`,
      'Ask the owner for a backup folder outside the project (for example ~/Backups/toolkit, a synced folder, or an external drive), then run toolkit config set backup.dir <folder>; toolkit work finish and toolkit handoff-backup then back up by themselves. If he wants no backup folder: toolkit config set backup.dir none.');
    return;
  }
  if (setting.declined) {
    const limit = EXPORT_MAX_AGE_DAYS * DAY;
    if (last ? now - last > limit : since && now - since > limit) {
      finding(findings, last ? 'backup-old' : 'backup-never', 'backup', 'note',
        last ? `The last backup of ${what} was ${age} days ago, and the owner chose no backup folder. Git ignores ${plural ? 'these folders' : 'this folder'}, so ${plural ? 'they exist' : 'it exists'} only on this computer.`
          : `${what} ${plural ? 'have' : 'has'} never been backed up, and the owner chose no backup folder.`,
        'Run toolkit export --to <a backup folder outside the project>, or ask the owner for a backup folder (toolkit config set backup.dir <folder>).');
    }
    return;
  }
  const limit = BACKUP_MAX_AGE_DAYS * DAY;
  if (!backupReachable(setting.dir)) {
    finding(findings, 'backup-unreachable', 'backup', 'warning', `The backup folder ${setting.dir} (backup.dir ${setting.raw}) cannot be reached: the drive it is on is not there. An external drive may not be plugged in.`, 'Ask the owner to connect the drive, or to pick another folder: toolkit config set backup.dir <folder>.');
  }
  if (last) {
    if (now - last > limit) finding(findings, 'backup-old', 'backup', 'warning', `The last backup of ${what} was ${age} day${age === 1 ? '' : 's'} ago. Git ignores ${plural ? 'these folders' : 'this folder'}, so ${plural ? 'they exist' : 'it exists'} only on this computer.`, `Run toolkit handoff-backup: it backs up to ${setting.dir}.`);
  } else if (since && now - since > limit) {
    finding(findings, 'backup-never', 'backup', 'warning', `${what} ${plural ? 'have' : 'has'} never been backed up. Git ignores ${plural ? 'these folders' : 'this folder'}, so ${plural ? 'they exist' : 'it exists'} only on this computer.`, `Run toolkit handoff-backup: it backs up to ${setting.dir}.`);
  }
}

function checkWorktrees(project, findings) {
  const res = run('git', ['worktree', 'list', '--porcelain'], { cwd: project.root, timeoutMs: 10000 });
  if (res.code !== 0) return;
  let current = null;
  for (const line of res.stdout.split('\n')) {
    if (line.startsWith('worktree ')) current = line.slice(9);
    if (line.startsWith('prunable') && current) {
      finding(findings, 'worktree-prunable', 'worktrees', 'warning', `Git lists the worktree ${current}, but its folder is gone or moved.`, 'If it moved, run git worktree repair <new folder>; if it was deleted, run git worktree prune (ask the owner first).');
    }
  }
}

function checkConfig(project, findings) {
  const c = project.config;
  if (Number.isInteger(c.schema) && c.schema > 1) finding(findings, 'config-newer', 'toolkit', 'problem', `.toolkit.json was written by a newer toolkit (schema ${c.schema}).`, 'Update the toolkit plugin.');
  if (!c.project || !c.project.key) finding(findings, 'config-key', 'toolkit', 'problem', '.toolkit.json has no project.key.', 'toolkit config set project.key <short-key>');
  const { problem } = readHosts(c);
  if (problem) finding(findings, 'config-hosts', 'toolkit', 'problem', `${problem} Init and sync stop until it is fixed, and the other checks assume ${projectHosts(c).join(' and ')}.`, HOSTS_FIX);
}

// ------------------------------------------------------------------ all

/** The computer checks alone, for a folder that is not a Toolkit V2 project yet. */
export function computerChecks({ env = process.env } = {}) {
  const findings = [];
  checkComputer({ root: null, config: {} }, env, findings);
  return findings;
}

/**
 * Run the checks. opts: { env, pluginRoot, quick, fetch, now }.
 * Returns { findings, plan }.
 */
export async function runChecks(project, opts = {}) {
  const env = opts.env || process.env;
  const quick = Boolean(opts.quick);
  const pluginRoot = opts.pluginRoot || DEFAULT_PLUGIN_ROOT;
  const findings = [];
  checkConfig(project, findings);
  checkInstructions(project, env, findings, { quick });
  checkCodex(project, env, findings);
  checkHookScripts(project, findings);
  checkClaudeSettings(project, findings);
  checkCodexAskRules(project, findings, { pluginRoot });
  checkBackup(project, findings, { now: opts.now || Date.now(), env });
  if (quick) return { findings, plan: null };
  checkComputer(project, env, findings);
  checkCodexMachine(project, env, findings, { pluginRoot });
  checkPlugins(project, env, findings);
  const plan = checkScaffold(project, env, findings, { pluginRoot });
  checkSalesforce(project, findings, { pluginRoot });
  await checkTracker(project, env, findings, { quick, pluginRoot });
  await checkMemory(project, env, findings, { quick, fetch: opts.fetch });
  checkNtn(project, env, findings);
  checkWorktrees(project, findings);
  return { findings, plan };
}
