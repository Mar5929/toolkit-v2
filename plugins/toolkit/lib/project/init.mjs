// `toolkit init`: set up Toolkit V2 in a Git repository (ARCHITECTURE sections
// 3 and 9, templates/TEMPLATE-LANGUAGE.md).
//
// Order, so that a failure at any step leaves a project that init can simply
// run on again (critique M9):
//  1. Work out the settings from the flags (and an earlier .toolkit.json).
//  2. Plan the whole scaffold: the model project's files in scaffold/model/
//     as scaffold/CONDITIONS.json says, plus the toolkit's additions. A setup
//     marker error stops here, before any write.
//  3. Check the Hindsight server answers, before anything is made in Notion.
//     Nothing local is written yet.
//  4. Wire the backends: `notion ensure-project` (it first checks that a root
//     page is known) and `hindsight ensure-bank`.
//     Their ids are kept in <git common dir>/toolkit-v2/init-pending.json, so a
//     second run after a later failure reuses them instead of making new ones.
//  5. Write the scaffold, AGENTS.md with its rules span, the merged settings,
//     and the model's .work-items/ or .memory/ files.
//  6. Build DASHBOARD.md (toolkit work sync) and MEMORY.md (toolkit memory reindex).
//  7. Write .toolkit.json, last. A new project records its setup date
//     (project.created); the toolkit's own templates render {{today}} as it.

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { gitInfo, loadConfig, mainCheckoutRoot, saveConfig, CONFIG_FILE, TOOLKIT_MARK } from '../core/config.mjs';
import { atomicWrite } from '../core/fsx.mjs';
import { run } from '../core/util.mjs';
import { planManifest, applyPlan, planLines, planSummary, setupDate, todayFor, readHosts } from './manifest.mjs';
import { parseBackupDir } from './backup.mjs';
import {
  newConfig, checkKey, keyFromName, checkChoice, parseHosts, parseDeclined, describeSetup, TRACKERS, MEMORIES,
} from './setup.mjs';

const PENDING_FILE = 'init-pending.json';

function pendingPath(root) {
  const info = gitInfo(root);
  return info ? path.join(info.commonDir, 'toolkit-v2', PENDING_FILE) : null;
}

function readPending(root) {
  const file = pendingPath(root);
  if (!file) return {};
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function writePending(root, data) {
  const file = pendingPath(root);
  if (!file) return;
  try {
    atomicWrite(file, `${JSON.stringify({ ...data, saved: new Date().toISOString() }, null, 2)}\n`);
  } catch {
    // Only a convenience for a second run.
  }
}

function clearPending(root) {
  const file = pendingPath(root);
  if (!file) return;
  try {
    fs.unlinkSync(file);
  } catch {
    // Already gone.
  }
}

/** The Git top level for --dir (or the current folder). Init needs a Git repository. */
export function resolveRoot(dirFlag, cwd) {
  const dir = path.resolve(cwd || process.cwd(), dirFlag || '.');
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new ToolkitError(EXIT.INVALID, `${dir} is not a folder.`, { fix: 'Give --dir <an existing project folder>.' });
  }
  const info = gitInfo(dir);
  if (!info) {
    throw new ToolkitError(EXIT.INVALID, `${dir} is not in a Git repository. Toolkit V2 finds the project, the work items, and memory through Git.`, {
      fix: `Run git init in ${dir} (with the owner's yes), then run toolkit init again.`,
    });
  }
  const real = fs.realpathSync(dir);
  if (dirFlag && real !== info.top) {
    throw new ToolkitError(EXIT.INVALID, `${dir} is inside the Git repository ${info.top}, not at its top. Toolkit V2 sets up a whole repository.`, {
      fix: `Run toolkit init --dir ${info.top}.`,
    });
  }
  return info.top;
}

function gitUserName(root) {
  const res = run('git', ['config', 'user.name'], { cwd: root, timeoutMs: 5000 });
  return res.code === 0 && res.stdout.trim() ? res.stdout.trim() : null;
}

/**
 * The settings init will write.
 * @returns {{ config, rerun: boolean, changes: string[] }}
 */
export function buildInitConfig(root, opts, existing, { today, env = process.env } = {}) {
  const changes = [];
  const created = today || todayFor(process.env);
  // The backup folder the owner gave in the setup interview (decision 13).
  const backupDir = opts.backupDir !== undefined && opts.backupDir !== null && opts.backupDir !== true
    ? parseBackupDir(opts.backupDir, { root, mainRoot: mainCheckoutRoot(root), env })
    : undefined;
  if (!existing) {
    if (!opts.name || !String(opts.name).trim()) {
      throw new ToolkitError(EXIT.INVALID, 'Give the project name: toolkit init --name "<name>" --tracker <local|notion|github|jira> --memory <builtin|hindsight|notion>.');
    }
    if (!opts.tracker) throw new ToolkitError(EXIT.INVALID, 'Say where work items live: --tracker local, notion, github, or jira.');
    if (!opts.memory) throw new ToolkitError(EXIT.INVALID, 'Say which memory system to use: --memory builtin, hindsight, or notion.');
    const name = String(opts.name).trim();
    const key = checkKey(opts.key ? String(opts.key).trim() : keyFromName(name));
    const config = newConfig({
      name,
      key,
      owner: opts.owner ? String(opts.owner).trim() : gitUserName(root) || 'Owner',
      created,
      tracker: checkChoice(opts.tracker, TRACKERS, 'tracker'),
      memory: checkChoice(opts.memory, MEMORIES, 'memory'),
      salesforce: Boolean(opts.salesforce),
      hosts: parseHosts(opts.hosts),
      declined: parseDeclined(opts.decline),
      backupDir,
    });
    return { config, rerun: false, changes };
  }
  const config = JSON.parse(JSON.stringify(existing));
  const set = (obj, key, value, label) => {
    if (value === undefined || value === null) return;
    if (JSON.stringify(obj[key]) !== JSON.stringify(value)) {
      changes.push(`${label}: ${JSON.stringify(obj[key] ?? null)} -> ${JSON.stringify(value)}`);
      obj[key] = value;
    }
  };
  config.project = config.project || {};
  config.tracker = config.tracker || { type: 'local', idPrefix: 'WI' };
  config.memory = config.memory || { type: 'builtin', approval: 'onboarding' };
  config.salesforce = config.salesforce || { enabled: false };
  if (opts.name) set(config.project, 'name', String(opts.name).trim(), 'project.name');
  if (opts.key) set(config.project, 'key', checkKey(String(opts.key).trim()), 'project.key');
  if (opts.owner) set(config.project, 'owner', String(opts.owner).trim(), 'project.owner');
  if (opts.tracker) set(config.tracker, 'type', checkChoice(opts.tracker, TRACKERS, 'tracker'), 'tracker.type');
  if (opts.memory) set(config.memory, 'type', checkChoice(opts.memory, MEMORIES, 'memory'), 'memory.type');
  if (opts.salesforce) set(config.salesforce, 'enabled', true, 'salesforce.enabled');
  if (opts.hosts !== undefined && opts.hosts !== null) set(config, 'hosts', parseHosts(opts.hosts), 'hosts');
  if (opts.decline !== undefined && opts.decline !== null) {
    const declined = [...new Set([...(Array.isArray(config.declined) ? config.declined : []), ...parseDeclined(opts.decline)])];
    if (declined.length) set(config, 'declined', declined, 'declined');
  }
  if (backupDir !== undefined) {
    config.backup = config.backup && typeof config.backup === 'object' ? config.backup : {};
    set(config.backup, 'dir', backupDir, 'backup.dir');
  }
  if (!config.project.key) config.project.key = checkKey(keyFromName(config.project.name || path.basename(root)));
  // A project set up before the setup date was recorded: from now on, today is its setup date.
  if (!setupDate(config)) config.project.created = created;
  // A hosts value init cannot read stops init; it is never widened to both hosts.
  const { hosts, problem } = readHosts(config);
  if (problem) {
    throw new ToolkitError(EXIT.INVALID, `${problem} Init changed nothing.`, {
      fix: 'Ask the owner which hosts the project uses, then run toolkit init again with --hosts claude-code (or codex, or claude-code,codex).',
    });
  }
  // A hand-written value such as "claude-code" is saved as a list.
  if (config.hosts !== undefined && JSON.stringify(config.hosts) !== JSON.stringify(hosts)) {
    changes.push(`hosts: ${JSON.stringify(config.hosts)} -> ${JSON.stringify(hosts)}`);
  }
  config.hosts = hosts;
  if (!config.tracker.idPrefix) config.tracker.idPrefix = 'WI';
  if (!config.memory.approval) config.memory.approval = 'onboarding';
  if (!config.notion) config.notion = {};
  if (!config.hindsight) config.hindsight = {};
  if (!config.installed) config.installed = {};
  if (!config.schema) config.schema = 1;
  return { config, rerun: true, changes };
}

// ------------------------------------------------------------------ backends

async function wireNotion(project, { env, report }) {
  const { resolveRootPageId, clientFor, readMachineConfig, writeMachineConfig, writeCache } = await import('../notion/context.mjs');
  const { ensureProject } = await import('../notion/ensure.mjs');
  const { config } = project;
  const rootPageId = resolveRootPageId({ config, env });
  if (!rootPageId) {
    throw new ToolkitError(EXIT.INVALID, 'This project uses Notion, but no Notion root page is known on this computer yet.', {
      fix: 'Run toolkit notion ensure-root --root-page <id or link of the AI Agent Second Brain page>, then run toolkit init again.',
    });
  }
  const cacheRoot = project.mainRoot || project.root;
  const client = clientFor({ config, root: cacheRoot, env, rootPageId });
  const { notion, report: r } = await ensureProject({ client, config, root: project.root, mainRoot: project.mainRoot, rootPageId });
  if (r.problems.length) {
    throw new ToolkitError(EXIT.ERROR, `Setting up the Notion databases reported problems: ${r.problems.join(' ')}`, {
      problems: r.problems,
      fix: 'Fix what it names (toolkit notion ensure-project --check lists it), then run toolkit init again.',
    });
  }
  config.notion = notion;
  if (r.trackerPrefix && config.tracker.idPrefix !== r.trackerPrefix) config.tracker.idPrefix = r.trackerPrefix;
  report.notes.push(...r.notes);
  if (r.verifiedAt) writeCache(cacheRoot, 'ensure.json', { verifiedAt: r.verifiedAt, problems: 0 });
  const machine = readMachineConfig(env);
  if (!machine.rootPageId && notion.projects) {
    writeMachineConfig(env, { ...machine, rootPageId: notion.rootPageId, projects: { databaseId: notion.projects.databaseId, dataSourceId: notion.projects.dataSourceId }, updated: new Date().toISOString() });
  }
  report.backends.push({
    backend: 'notion',
    created: r.created,
    added: r.added,
    notes: r.notes,
    projectPage: notion.project && notion.project.url,
    workItems: notion.workItems && notion.workItems.url,
    memory: notion.memory && notion.memory.url,
    calls: client.stats ? client.stats.calls : null,
  });
  if (notion.project && notion.project.url) report.notes.push(`Notion project page: ${notion.project.url}`);
}

/**
 * Check that the local Hindsight server answers. Runs before any backend is
 * set up (Notion included), so a server that is down stops init with nothing
 * written anywhere. Returns the client for wireHindsight.
 */
async function checkHindsight(project, { fetch: fetchFn }) {
  const { HindsightClient, DEFAULT_URL } = await import('../hindsight/client.mjs');
  const hs = project.config.hindsight || {};
  const url = hs.url || DEFAULT_URL;
  const client = new HindsightClient({ url, fetch: fetchFn });
  try {
    await client.health();
  } catch (err) {
    if (err && err.details && err.details.sandbox) {
      // The Codex sandbox blocked the request: the server may be fine, and
      // init cannot run here at all. Say so, with the exact command for a
      // terminal (sample run d, round 2: the fix said to start a running server).
      const command = initCommandLine(project.config, project.root);
      throw new ToolkitError(EXIT.ERROR, `The Codex sandbox blocked init's request to the local Hindsight server at ${url}, so init cannot check it from here. The server itself may be running. Nothing was written.`, {
        sandbox: true,
        command,
        fix: `Ask the owner to run this in a Terminal window (outside Codex), or to approve running it outside the Codex sandbox: ${command}. Keep every setup answer as he gave it.`,
      });
    }
    throw new ToolkitError(EXIT.ERROR, `This project uses Hindsight memory, but the local Hindsight server at ${url} does not answer (${err.message}). Nothing was written.`, {
      fix: 'Check it with toolkit hindsight service status, start it (toolkit hindsight service start) after the owner\'s yes, then run toolkit init again.',
    });
  }
  return { client, url };
}

async function wireHindsight(project, { client, url, report }) {
  const { bankIdFor, ensureBank } = await import('../hindsight/bank.mjs');
  const { config } = project;
  const hs = config.hindsight || {};
  const key = config.project.key;
  const wanted = hs.bank || bankIdFor(key);
  if (!wanted) throw new ToolkitError(EXIT.INVALID, `No Hindsight bank id can be made from the project key "${key}".`, { fix: 'Give --key with lower-case letters, digits, and dashes.' });
  const res = await ensureBank({ client, bank: wanted, projectKey: key, projectName: config.project.name, claimed: Boolean(hs.bank), explicit: false });
  config.hindsight = { ...hs, url, bank: res.bank };
  report.backends.push({ backend: 'hindsight', bank: res.bank, created: res.created, changed: res.changed, skipped: res.skipped });
  report.notes.push(`Hindsight memory bank: ${res.bank}${res.created ? ' (new)' : ''}.`);
}

// ------------------------------------------------------------------ init

function quoteArg(value) {
  const v = String(value);
  return /^[A-Za-z0-9_.,/:@%+=-]+$/.test(v) ? v : `"${v.replace(/(["\\$`])/g, '\\$1')}"`;
}

/** The toolkit init command that repeats this setup, for the owner to run in a terminal. */
export function initCommandLine(config, root) {
  const parts = ['toolkit', 'init', '--dir', quoteArg(root), '--name', quoteArg(config.project.name), '--key', quoteArg(config.project.key),
    '--tracker', config.tracker.type, '--memory', config.memory.type, '--owner', quoteArg(config.project.owner)];
  if (config.salesforce && config.salesforce.enabled) parts.push('--salesforce');
  if (Array.isArray(config.hosts)) parts.push('--hosts', config.hosts.join(','));
  if (Array.isArray(config.declined) && config.declined.length) parts.push('--decline', config.declined.join(','));
  if (config.backup && config.backup.dir) parts.push('--backup-dir', quoteArg(config.backup.dir));
  return parts.join(' ');
}

/**
 * A write refused by the operating system (the Codex sandbox refuses .codex/
 * and .agents/): the error names the exact command for the owner to run in a
 * terminal, with the same answers. The answers are never changed to get past it.
 */
function refusedWrite(err, config, root) {
  const cause = err && err.details && err.details.path ? err : null;
  if (!cause) return err;
  const command = initCommandLine(config, root);
  return new ToolkitError(EXIT.ERROR, `${err.message} Files in .codex/ and .agents/ are written first, so no other setup file was written by this run.`, {
    path: err.details.path,
    command,
    fix: `Ask the owner to run this in a Terminal window (outside Codex), or to approve running it outside the Codex sandbox: ${command}. Keep every setup answer as he gave it. It is safe to run again: files an earlier run wrote are recorded, not treated as the project's own.`,
  });
}

/**
 * Run init. opts: { name, key, tracker, memory, salesforce, owner, dir, hosts }.
 * io: { cwd, env, pluginRoot, fetch }.
 * Returns { root, mainRoot, config, rerun, plan, summary, lines, report }.
 */
export async function initProject(opts, io = {}) {
  const env = io.env || process.env;
  const root = resolveRoot(opts.dir, io.cwd);
  const mainRoot = mainCheckoutRoot(root) || root;
  const configFile = path.join(root, CONFIG_FILE);
  if (fs.existsSync(configFile)) {
    let raw = null;
    try {
      raw = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    } catch (err) {
      throw new ToolkitError(EXIT.INVALID, `${configFile} is not valid JSON (${err.message}), so init changed nothing.`, { fix: 'Fix or remove .toolkit.json, then run toolkit init again.' });
    }
    if (!raw || raw.toolkit !== TOOLKIT_MARK) {
      throw new ToolkitError(EXIT.INVALID, `${configFile} exists but is not a Toolkit V2 settings file (it has no "toolkit": "${TOOLKIT_MARK}"), so init changed nothing.`, {
        fix: 'Move that file aside if it belongs to another tool, then run toolkit init again.',
      });
    }
    if (Number.isInteger(raw.schema) && raw.schema > 1) {
      throw new ToolkitError(EXIT.ERROR, `.toolkit.json was written by a newer toolkit (schema ${raw.schema}), so init changed nothing.`, { fix: 'Update the toolkit plugin.' });
    }
  }
  const existing = loadConfig(root);
  const { config, rerun, changes } = buildInitConfig(root, opts, existing, { today: todayFor(env), env });

  // Values from an earlier run that stopped after wiring a backend.
  const pending = readPending(root);
  if (pending.key === config.project.key) {
    if (pending.hindsight && pending.hindsight.bank && !config.hindsight.bank) config.hindsight = { ...pending.hindsight };
    if (pending.notion && Object.keys(pending.notion).length && !(config.notion && config.notion.project)) config.notion = { ...pending.notion };
    if (pending.idPrefix && config.tracker.idPrefix === 'WI' && config.tracker.type === 'notion') config.tracker.idPrefix = pending.idPrefix;
  }

  const project = { root, mainRoot, config };
  const report = { notes: [], backends: [], changes };

  // 2. Plan first: a template error stops init before anything is written.
  planManifest(project, { mode: 'init', env, pluginRoot: io.pluginRoot });

  // 3-4. Backends. The Hindsight server is checked before Notion is touched,
  // so a server that is down leaves nothing half set up.
  const usesNotion = config.tracker.type === 'notion' || config.memory.type === 'notion';
  const hindsight = config.memory.type === 'hindsight' ? await checkHindsight(project, { fetch: io.fetch }) : null;
  if (usesNotion) await wireNotion(project, { env, report });
  if (hindsight) await wireHindsight(project, { ...hindsight, report });
  if (usesNotion || config.memory.type === 'hindsight') {
    writePending(root, { key: config.project.key, notion: config.notion, hindsight: config.hindsight, idPrefix: config.tracker.idPrefix });
  }

  // 5. The scaffold, planned again with the final settings (the id prefix may have changed).
  const plan = planManifest(project, { mode: 'init', env, pluginRoot: io.pluginRoot });
  let applied;
  try {
    applied = applyPlan(plan);
  } catch (err) {
    throw refusedWrite(err, config, root);
  }

  // 6. Generated files that should exist from the start. On a second run the
  // tracker is only brought in step when it changed since the last toolkit
  // write, so a run that changes nothing writes nothing.
  if (config.tracker.type === 'local') {
    const dashboard = path.join(mainRoot, '.work-items', 'DASHBOARD.md');
    const { openTracker } = await import('../work/driver.mjs');
    const tracker = await openTracker(project, { env, cwd: root, pluginRoot: io.pluginRoot });
    await tracker.sync({ quick: rerun && fs.existsSync(dashboard) });
  }
  if (config.memory.type === 'builtin') {
    const { reindexVault } = await import('../memory/builtin.mjs');
    await reindexVault(mainRoot);
  }

  // 7. .toolkit.json, last (not rewritten when nothing in it changed).
  config.installed = plan.installed;
  const text = `${JSON.stringify(config, null, 2)}\n`;
  let current = null;
  try {
    current = fs.readFileSync(configFile, 'utf8');
  } catch {
    current = null;
  }
  if (current !== text) saveConfig(root, config);
  clearPending(root);

  const summary = planSummary(plan);
  const lines = [];
  lines.push(rerun
    ? `Toolkit V2 was already set up in ${root}. Init ran again and changed only what was missing or out of date.`
    : `Set up Toolkit V2 in ${root}.`);
  lines.push(describeSetup(config));
  if (changes.length) lines.push(`Settings changed: ${changes.join('; ')}.`);
  lines.push(...planLines(plan, { applied: true }));
  if (!applied.written.length && !applied.directories.length) lines.push('Every scaffold file was already in place.');
  for (const n of report.notes) lines.push(n);
  lines.push(`Wrote ${CONFIG_FILE} last.`);
  const next = ['Next:'];
  if (config.hosts.includes('claude-code')) next.push('- Start a new Claude Code session in this project so it loads the settings, the hooks, and the Plain English style.');
  if (config.hosts.includes('codex')) next.push('- In Codex, the owner opens /hooks once and trusts the Toolkit V2 hooks. Codex skips plugin hooks until he does.');
  if (!(config.backup && config.backup.dir) && (config.tracker.type === 'local' || ['builtin', 'hindsight'].includes(config.memory.type))) {
    next.push('- Ask the owner for a backup folder outside the project (for example ~/Backups/toolkit), then run toolkit config set backup.dir <folder>, or none when he wants no backup. The work items and memory are Git-ignored, so they exist only on this computer until they are backed up.');
  }
  next.push('- Run toolkit doctor to check the setup.');
  lines.push(...next);
  return { root, mainRoot, config, rerun, plan, summary, applied, lines, report };
}
