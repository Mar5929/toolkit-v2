// toolkit hindsight ...: the local Hindsight memory server and this project's bank.
//
// ensure-bank      create the project's bank when its id is free, set the
//                  toolkit settings, and record the id in .toolkit.json
// health           is the server up, and is this project's bank set up?
// service install|status|start|stop
//                  the launchd agent local.toolkit-v2.hindsight on this Mac
//
// For tests, two environment variables keep the real LaunchAgent untouched:
//   TOOLKIT_HINDSIGHT_PLIST   the plist path to use instead of ~/Library/LaunchAgents/...
//   TOOLKIT_LAUNCHCTL         a program to run instead of launchctl
//   TOOLKIT_HINDSIGHT_HOME    the home folder written into the plist instead of the real one

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { CONFIG_FILE, requireProject, saveConfig } from '../core/config.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { DEFAULT_URL, HindsightClient, assertBankId } from '../hindsight/client.mjs';
import { bankIdFor, ensureBank, settingsProblems } from '../hindsight/bank.mjs';
import { createService, defaultPlistPath, defaultRunner } from '../hindsight/service.mjs';

export const summary = 'Set up the local Hindsight memory server: the project bank, a health check, and the background service.';

export const help = `Usage:
  toolkit hindsight ensure-bank [--bank <id>] [--url <url>]
  toolkit hindsight health [--url <url>]
  toolkit hindsight service install [--no-wait]
  toolkit hindsight service status
  toolkit hindsight service start [--no-wait]
  toolkit hindsight service stop

ensure-bank creates the bank named by .toolkit.json hindsight.bank. The first
time, it makes the id from the project key (with p- in front when the key does
not start with a letter), and when a bank with that id already exists, it uses
-2, -3, ... instead: a bank that exists belongs to someone else, even when it
has the same key. It sets the bank to store records exactly, to allow only
read-only MCP tools, and to answer find --reflect in plain English, and writes
the bank id into .toolkit.json. Running it again changes only what is missing.
A bank that .toolkit.json names but that was made for another project key is
refused; name it with --bank to use it anyway.
The server is ${DEFAULT_URL} unless .toolkit.json hindsight.url says otherwise.`;

const SUBCOMMANDS = ['ensure-bank', 'health', 'service'];

export async function run(argv, ctx) {
  const [sub, ...rest] = argv;
  if (!sub || sub === 'help') {
    out(ctx, help, { subcommands: SUBCOMMANDS, help });
    return EXIT.OK;
  }
  if (sub === 'ensure-bank') return ensureBankCommand(rest, ctx);
  if (sub === 'health') return healthCommand(rest, ctx);
  if (sub === 'service') return serviceCommand(rest, ctx);
  throw new ToolkitError(EXIT.INVALID, `Unknown hindsight command "${sub}". Commands: ${SUBCOMMANDS.join(', ')}.`, { fix: 'Run toolkit help hindsight.' });
}

function flagString(flags, name) {
  const v = flags[name];
  if (Array.isArray(v)) throw new ToolkitError(EXIT.INVALID, `--${name} was given more than once.`);
  if (v === true) throw new ToolkitError(EXIT.INVALID, `--${name} needs a value.`);
  return v === undefined || v === null ? undefined : String(v);
}

/** The project, or null outside one. */
function optionalProject(cwd) {
  try {
    return requireProject(cwd);
  } catch (err) {
    if (err && err.code === EXIT.NOT_PROJECT) return null;
    throw err;
  }
}

function clientFor(ctx, project, urlFlag, bank) {
  const hs = (project && project.config && project.config.hindsight) || {};
  return new HindsightClient({ url: urlFlag || hs.url || DEFAULT_URL, bank, fetch: ctx.fetch });
}

// ---------------------------------------------------------------- ensure-bank

async function ensureBankCommand(argv, ctx) {
  const { flags } = parseArgs(argv, { string: ['bank', 'url', 'host'] });
  const project = optionalProject(ctx.cwd);
  const bankFlag = flagString(flags, 'bank');
  const urlFlag = flagString(flags, 'url');
  if (!project && !bankFlag) {
    throw new ToolkitError(EXIT.NOT_PROJECT, 'This folder is not a Toolkit V2 project, so there is no project bank to set up.', {
      fix: 'Run it in the project folder, or give --bank <id>.',
    });
  }
  const config = project ? project.config : null;
  const hs = (config && config.hindsight) || {};
  const projectKey = config && config.project ? config.project.key : undefined;
  const projectName = config && config.project ? config.project.name : undefined;
  if (!bankFlag && !hs.bank && !projectKey) {
    throw new ToolkitError(EXIT.INVALID, '.toolkit.json has neither hindsight.bank nor project.key, so there is no bank id to use.', {
      fix: 'Give --bank <id>.',
    });
  }
  const wanted = bankFlag || hs.bank || bankIdFor(projectKey);
  if (!wanted) {
    throw new ToolkitError(EXIT.INVALID, `No Hindsight bank id can be made from the project key "${projectKey}".`, {
      fix: 'Give --bank <id>, using lower-case letters, digits, and dashes, starting with a letter.',
    });
  }
  try {
    assertBankId(wanted);
  } catch (err) {
    err.details = {
      ...(err.details || {}),
      fix: bankFlag
        ? 'Give --bank <id>, using lower-case letters, digits, and dashes, starting with a letter.'
        : 'Fix hindsight.bank in .toolkit.json, or give --bank <id>.',
    };
    throw err;
  }
  const claimed = Boolean(bankFlag) || Boolean(hs.bank);
  const client = clientFor(ctx, project, urlFlag);
  await client.health();
  const res = await ensureBank({ client, bank: wanted, projectKey: projectKey || wanted, projectName, claimed, explicit: Boolean(bankFlag) });

  let configPath = null;
  const url = urlFlag || hs.url || DEFAULT_URL;
  if (project && (hs.bank !== res.bank || (urlFlag && hs.url !== urlFlag) || !hs.url)) {
    const next = { ...config, hindsight: { ...hs, url, bank: res.bank } };
    const target = fs.existsSync(path.join(project.root, CONFIG_FILE)) ? project.root : project.mainRoot;
    configPath = saveConfig(target, next);
  }

  const lines = [];
  if (res.created) lines.push(`Created the Hindsight bank ${res.bank} at ${client.url}.`);
  else if (res.relation === 'this-project') lines.push(`The Hindsight bank ${res.bank} at ${client.url} already exists and belongs to this project.`);
  else if (res.relation === 'other-project') lines.push(`The Hindsight bank ${res.bank} at ${client.url} was made for the project ${res.owner}. It is used because --bank named it.`);
  else lines.push(`The Hindsight bank ${res.bank} at ${client.url} already exists. The toolkit did not make it; it is used because ${bankFlag ? '--bank' : '.toolkit.json'} names it.`);
  if (res.skipped.length) lines.push(`Skipped ids that already exist on the server: ${res.skipped.map((s) => s.bank).join(', ')}.`);
  lines.push(res.changed.length ? `Settings set: ${res.changed.join(', ')}.` : 'Its settings were already right; nothing changed.');
  if (configPath) lines.push(`Recorded hindsight.bank = ${res.bank} in ${configPath}.`);
  out(ctx, lines, { ok: true, action: 'ensure-bank', url: client.url, ...res, configPath });
  return EXIT.OK;
}

// ---------------------------------------------------------------- health

async function healthCommand(argv, ctx) {
  const { flags } = parseArgs(argv, { string: ['url', 'host'] });
  const project = optionalProject(ctx.cwd);
  const hs = (project && project.config && project.config.hindsight) || {};
  const client = clientFor(ctx, project, flagString(flags, 'url'));
  const report = { ok: false, url: client.url, server: null, version: null, bank: null };
  const lines = [];
  try {
    report.server = await client.health();
    report.version = await client.version().catch(() => null);
  } catch (err) {
    lines.push(`Hindsight is not reachable at ${client.url}.`, err.message, 'Check the service with: toolkit hindsight service status');
    out(ctx, lines, report);
    return EXIT.ERROR;
  }
  const healthy = report.server && report.server.status === 'healthy';
  lines.push(`Hindsight at ${client.url}: ${healthy ? 'healthy' : `not healthy (${JSON.stringify(report.server)})`}${report.version && report.version.api_version ? `, version ${report.version.api_version}` : ''}.`);
  let bankOk = true;
  if (hs.bank) {
    const row = await client.getBank(hs.bank);
    const cfg = row ? await client.getBankConfig(hs.bank) : null;
    if (cfg === null) {
      bankOk = false;
      report.bank = { id: hs.bank, exists: false, problems: ['does not exist'] };
      lines.push(`This project's bank ${hs.bank} does not exist. Run toolkit hindsight ensure-bank.`);
    } else {
      const problems = settingsProblems(cfg);
      // The bank row and the document list are current at once; GET .../stats can lag behind writes.
      const documents = await client.forBank(hs.bank).countDocuments();
      const lastWrite = row.last_write_at || null;
      report.bank = { id: hs.bank, exists: true, problems, documents, lastWrite };
      lines.push(`This project's bank ${hs.bank}: ${documents} document${documents === 1 ? '' : 's'}, last write ${lastWrite || 'never'}.`);
      if (problems.length) {
        bankOk = false;
        lines.push(...problems.map((p) => `- ${p}`), 'Fix with: toolkit hindsight ensure-bank');
      }
    }
  } else if (project && project.config.memory && project.config.memory.type === 'hindsight') {
    bankOk = false;
    lines.push('.toolkit.json has no hindsight.bank yet. Run toolkit hindsight ensure-bank.');
  }
  report.ok = Boolean(healthy && bankOk);
  out(ctx, lines, report);
  return report.ok ? EXIT.OK : EXIT.ERROR;
}

// ---------------------------------------------------------------- service

function serviceFor(ctx) {
  const env = ctx.env || process.env;
  const plistPath = env.TOOLKIT_HINDSIGHT_PLIST || defaultPlistPath();
  const launchctl = env.TOOLKIT_LAUNCHCTL;
  const runner = launchctl
    ? (cmd, args) => defaultRunner(cmd === 'launchctl' ? launchctl : cmd, args)
    : defaultRunner;
  return createService({ plistPath, runner, home: env.TOOLKIT_HINDSIGHT_HOME || os.homedir() });
}

async function waitForHealth(client, seconds) {
  const until = Date.now() + seconds * 1000;
  while (Date.now() < until) {
    try {
      const h = await client.health({ timeoutMs: 2000 });
      if (h && h.status === 'healthy') return true;
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function serviceCommand(argv, ctx) {
  const { _, flags } = parseArgs(argv, { boolean: ['no-wait', 'wait'], string: ['url', 'host'] });
  const action = _[0];
  if (!['install', 'status', 'start', 'stop'].includes(action)) {
    throw new ToolkitError(EXIT.INVALID, 'Say what to do with the service: toolkit hindsight service install, status, start, or stop.');
  }
  if (process.platform !== 'darwin' && !(ctx.env && ctx.env.TOOLKIT_LAUNCHCTL)) {
    throw new ToolkitError(EXIT.UNSUPPORTED, 'The Hindsight background service uses launchd, which only macOS has.');
  }
  const service = serviceFor(ctx);
  const project = optionalProject(ctx.cwd);
  const client = clientFor(ctx, project, flagString(flags, 'url'));
  const noWait = flags['no-wait'] === true || flags.wait === false;

  if (action === 'status') {
    const st = await service.status();
    let healthy = false;
    try {
      const h = await client.health();
      healthy = Boolean(h && h.status === 'healthy');
    } catch {
      healthy = false;
    }
    const lines = [
      `Service: ${st.label}`,
      `Plist: ${st.plistPath} (${st.installed ? 'installed' : 'not installed'}${st.sameAsTemplate === false ? ', differs from the toolkit template' : ''})`,
      `launchd: ${st.loaded ? (st.running ? `loaded and running, pid ${st.pid}` : `loaded, not running${st.lastExit ? `, last exit ${st.lastExit}` : ''}`) : 'not loaded'}`,
      `Server at ${client.url}: ${healthy ? 'healthy' : 'not answering'}`,
    ];
    if (!st.installed) lines.push('Install with: toolkit hindsight service install');
    else if (st.sameAsTemplate === false) lines.push('Bring it in line with the template: toolkit hindsight service install');
    out(ctx, lines, { ok: st.loaded && healthy, ...st, healthy, url: client.url });
    return st.loaded && healthy ? EXIT.OK : EXIT.ERROR;
  }

  const res = await service[action]();
  const lines = [res.message];
  let healthy = null;
  if (res.changed && action !== 'stop' && !noWait) {
    healthy = await waitForHealth(client, 30);
    lines.push(healthy ? `The server at ${client.url} is healthy.` : `The server at ${client.url} did not answer within 30 seconds. Check the log in ~/.hindsight/logs/.`);
  }
  out(ctx, lines, { ok: healthy !== false, action, ...res, healthy });
  return healthy === false ? EXIT.ERROR : EXIT.OK;
}
