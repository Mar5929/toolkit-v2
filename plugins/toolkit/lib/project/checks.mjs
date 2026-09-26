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
//   instructions: CLAUDE.md files on the path, settings that stop Claude Code
//     reading AGENTS.md, AGENTS.md markers, span, leftover placeholders, size
//   plugins: enabledPlugins in .claude/settings.json and the plugin switches
//     in .codex/config.toml
//   Codex: trust for this folder and for the Toolkit V2 hooks
//   scaffold: missing files, out-of-date files, files changed by the project,
//     leftovers, merge conflicts (the same plan `toolkit sync --dry-run` shows)
//   Salesforce: the skill copies in .claude/skills and .agents/skills match,
//     the org aliases are recorded
//   tracker and memory health, ntn signed in, Hindsight health, backup age,
//     worktrees Git can no longer find

import fs from 'node:fs';
import path from 'node:path';
import { run } from '../core/util.mjs';
import { hasSpan, spanBody, buildSpan, readRules } from './render.mjs';
import { planManifest, projectHosts, readHosts, HOSTS_FIX, PROPOSAL_PATH, DEFAULT_PLUGIN_ROOT } from './manifest.mjs';
import { tomlGet } from './toml.mjs';
import {
  claudeHome, claudeOldPlugins, codexOldPlugins, codexTrust, codexHookTrustKeys, homeDir,
  installedPluginCopies, readJson, wantedV2Plugins, MARKETPLACE, OLD_MARKETPLACE,
} from './hosts.mjs';
import { readPointer, isPluginRoot, wrapperState, onPath } from './machine.mjs';
import { readExportRecord } from './backup.mjs';

export const AGENTS_MAX_BYTES = 24 * 1024;
export const EXPORT_MAX_AGE_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;
const AGENTS_BLOCKERS = ['CLAUDE.md', path.join('.claude', 'CLAUDE.md'), 'CLAUDE.local.md'];
const FEATURE_FLAG_VARS = ['DISABLE_GROWTHBOOK', 'DISABLE_TELEMETRY', 'DO_NOT_TRACK', 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC'];
const PROVIDER_VARS = ['CLAUDE_CODE_USE_BEDROCK', 'CLAUDE_CODE_USE_VERTEX', 'CLAUDE_CODE_USE_FOUNDRY'];

function finding(list, id, area, severity, message, fix = null) {
  list.push({ id, area, severity, message, fix });
}

function truthy(v) {
  return v !== undefined && v !== null && v !== '' && v !== '0' && String(v).toLowerCase() !== 'false';
}

// ------------------------------------------------------------------ instructions

/** CLAUDE.md files that stop Claude Code reading AGENTS.md: the project folder and every folder above it. */
export function claudeMdOnPath(root, env = process.env) {
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

/** CLAUDE.md files inside the project below its top folder. */
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
  const onPathFiles = claudeMdOnPath(project.root, env);
  for (const file of onPathFiles) {
    finding(findings, 'claude-md-on-path', 'instructions', 'problem',
      `${file} exists. A CLAUDE.md, .claude/CLAUDE.md, or CLAUDE.local.md in the project folder or a folder above it stops Claude Code from reading AGENTS.md.`,
      'Ask the owner, then move its content into AGENTS.md (or a rule) and remove the file.');
  }
  if (!quick) {
    for (const file of claudeMdInside(project.root)) {
      const hasAgents = fs.existsSync(path.join(path.dirname(file), 'AGENTS.md'));
      finding(findings, 'claude-md-inside', 'instructions', hasAgents ? 'problem' : 'warning',
        `${path.relative(project.root, file)} exists. Toolkit V2 uses AGENTS.md only${hasAgents ? ', and this file hides the AGENTS.md in the same folder from Claude Code' : ''}.`,
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
  if (/Not recorded yet/.test(agents)) finding(findings, 'agents-md-commands', 'instructions', 'note', 'The AGENTS.md Commands table has no verified run or test commands yet.', 'Add them once they are known and verified.');
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

function checkCodex(project, env, findings) {
  if (!projectHosts(project.config).includes('codex')) return;
  const trust = codexTrust(project.root, env);
  if (trust !== 'trusted') {
    finding(findings, 'codex-trust', 'codex', 'warning',
      `Codex does not trust this folder (${project.root})${trust ? `: trust_level is ${trust}` : ''}. Codex loads the project's .codex/ settings, plugin switches, and hooks only in a trusted folder. Trust is tied to the folder path, so moving the project turns it off.`,
      'The owner opens Codex in this folder and trusts it when Codex asks.');
  }
  // Codex names a plugin hook "<plugin>@<marketplace>:<file>...:<event>:<i>:<j>"
  // (seen in ~/.codex/config.toml: "browser@openai-bundled:plugin.json#hooks[0]:stop:0:0").
  const hookKeys = codexHookTrustKeys(`toolkit@${MARKETPLACE}:`, env);
  if (!hookKeys.length) {
    finding(findings, 'codex-hook-trust', 'codex', 'warning', 'The Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no briefing, no memory reminder, no guards).', 'The owner opens /hooks in Codex once and trusts the Toolkit V2 hooks.');
  }
  if (project.config.salesforce && project.config.salesforce.enabled && fs.existsSync(path.join(project.root, '.codex', 'hooks.json'))) {
    const sfKeys = codexHookTrustKeys(path.join(project.root, '.codex', 'hooks.json'), env);
    if (!sfKeys.length) finding(findings, 'codex-sf-hook-trust', 'codex', 'warning', 'The Salesforce org guards in .codex/hooks.json are not trusted in Codex yet, so Codex does not run them.', 'The owner opens /hooks in Codex in this project and trusts the two Salesforce guards.');
  }
}

function checkComputer(project, env, findings) {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) finding(findings, 'node-version', 'computer', 'problem', `Node.js ${process.versions.node} is older than 20.`, 'Install Node.js 20 or newer (ask the owner).');
  const pointer = readPointer(env);
  if (!pointer || !isPluginRoot(pointer)) {
    finding(findings, 'plugin-pointer', 'computer', 'warning', pointer ? `~/.config/toolkit-v2/plugin-root names ${pointer}, which has no bin/toolkit.` : '~/.config/toolkit-v2/plugin-root is missing, so the Codex wrapper cannot find the toolkit.', 'Run toolkit machine-setup (every session start also refreshes it).');
  }
  if (projectHosts(project.config).includes('codex')) {
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
    finding(findings, 'scaffold-changed', 'scaffold', 'note', `${t.target} was changed by the project, so sync leaves it alone.${t.would.length ? ` The toolkit would: ${t.would.join('; ')}.` : ' Nothing new from the toolkit.'}`, t.would.length ? 'The project-setup skill shows these to the owner and makes the changes he approves.' : null);
  }
  for (const t of by('leftover')) finding(findings, 'scaffold-leftover', 'scaffold', 'note', `${t.target} is left over from an earlier setup (its condition no longer holds).`, 'Ask the owner whether to keep or delete it.');
  return plan;
}

// ------------------------------------------------------------------ Salesforce

function checkSalesforce(project, findings, { pluginRoot }) {
  const c = project.config;
  if (!(c.salesforce && c.salesforce.enabled)) return;
  const orgs = c.salesforce.orgs || {};
  const missing = ['sandbox', 'production'].filter((k) => !orgs[k]);
  if (missing.length) finding(findings, 'sf-orgs', 'salesforce', 'warning', `The Salesforce org alias for ${missing.join(' and ')} is not recorded in .toolkit.json.`, missing.map((k) => `toolkit config set salesforce.orgs.${k} <alias>`).join(' and '));
  const hosts = projectHosts(c);
  const srcDir = path.join(pluginRoot || DEFAULT_PLUGIN_ROOT, 'scaffold', 'salesforce', 'skills');
  let skills = [];
  try {
    skills = fs.readdirSync(srcDir).filter((n) => fs.existsSync(path.join(srcDir, n, 'SKILL.md')));
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
        finding(findings, 'hindsight-down', 'memory', 'problem', `The local Hindsight server at ${client.url} does not answer (${err.message}).`, 'Check it with toolkit hindsight service status; start it with toolkit hindsight service start after the owner\'s yes.');
      }
    }
  } else if (type === 'notion') {
    const mem = c.notion && c.notion.memory;
    if (!mem || !mem.dataSourceId) finding(findings, 'notion-memory', 'memory', 'problem', 'The Notion Memory database is not set up for this project (.toolkit.json has no notion.memory ids).', 'Run toolkit notion ensure-project.');
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

/** The backup warning (M19): the last export of .work-items/ and .memory/ is older than 7 days. */
export function checkBackup(project, findings, { now = Date.now() } = {}) {
  const c = project.config;
  const local = ((c.tracker && c.tracker.type) || 'local') === 'local';
  const builtin = ((c.memory && c.memory.type) || 'builtin') === 'builtin';
  if (!local && !builtin) return;
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
  const what = [local ? '.work-items/' : null, builtin ? '.memory/' : null].filter(Boolean).join(' and ');
  if (last) {
    const age = Math.floor((now - last) / DAY);
    if (age > EXPORT_MAX_AGE_DAYS) finding(findings, 'backup-old', 'backup', 'warning', `The last backup of ${what} was ${age} days ago. Git ignores these folders, so they exist only on this computer.`, 'Run toolkit export --to <a backup folder outside the project>.');
  } else if (since && now - since > EXPORT_MAX_AGE_DAYS * DAY) {
    finding(findings, 'backup-never', 'backup', 'warning', `${what} ${local && builtin ? 'have' : 'has'} never been backed up. Git ignores ${local && builtin ? 'these folders' : 'this folder'}, so ${local && builtin ? 'they exist' : 'it exists'} only on this computer.`, 'Run toolkit export --to <a backup folder outside the project>.');
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
  checkBackup(project, findings, { now: opts.now || Date.now() });
  if (quick) return { findings, plan: null };
  checkComputer(project, env, findings);
  checkPlugins(project, env, findings);
  const plan = checkScaffold(project, env, findings, { pluginRoot });
  checkSalesforce(project, findings, { pluginRoot });
  await checkTracker(project, env, findings, { quick, pluginRoot });
  await checkMemory(project, env, findings, { quick, fetch: opts.fetch });
  checkNtn(project, env, findings);
  checkWorktrees(project, findings);
  return { findings, plan };
}
