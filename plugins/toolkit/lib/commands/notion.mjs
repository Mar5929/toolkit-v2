// toolkit notion ensure-root | ensure-project
//
// ensure-root     Under the root page ("AI Agent Second Brain"), find the
//                 Projects database (or create it) and add the registry
//                 properties the toolkit uses. Saves the root page and Projects
//                 ids for this computer (~/.config/toolkit-v2/notion.json) and,
//                 inside a project, in .toolkit.json.
// ensure-project  For this project: its row in Projects; when the tracker is
//                 Notion, its Work Items database with the board and table
//                 views; when memory is Notion, its "Memory" page in Lore's
//                 layout (Lore's five databases; records are rows of Memories)
//                 and the Current focus and Terminology glossary pages. A
//                 project still on the older single Memory database has its
//                 records moved into the Lore layout. Saves every id
//                 in the "notion" block of .toolkit.json. Safe to run again: it
//                 adds only what is missing and repairs what was removed.
//                 .toolkit.json is written only when an id changed; the time of
//                 the last check is kept in the Git-ignored cache (ensure.json).
//
// Both refuse to write anywhere outside the root page.

import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { findProjectRoot, loadConfig, requireProject, saveConfig } from '../core/config.mjs';
import { NotionClient, normalizeId } from '../notion/client.mjs';
import { clientFor, readMachineConfig, writeMachineConfig, resolveRootPageId, machineConfigDir, writeCache } from '../notion/context.mjs';
import { ensureRoot, ensureProject } from '../notion/ensure.mjs';

export const summary = 'Set up or repair the Notion Projects database and this project\'s Work Items and Memory databases.';

export const help = `Usage:
  toolkit notion ensure-root [--root-page <id or URL>] [--projects-database <id or URL>] [--check]
  toolkit notion ensure-project [--project-name <name>] [--root-page <id or URL>] [--projects-database <id or URL>] [--check]

ensure-root makes sure the Projects database under the root page has the
toolkit's registry properties (Key, Tracker, Memory system, and others).
ensure-project builds or repairs this project's row, its Work Items database
(when tracker.type is notion), and its memory (when memory.type is notion): a
"Memory" page in the layout of Lore (github.com/makenotion/lore) holding the
Projects, Topics, Memories, Entities, and Facts databases, plus the Current
focus and Terminology glossary pages. A project still on the older single
Memory database has its records copied into the Memories database and read
back; the old database is then renamed "Old memory database (safe to delete)".
Both only add what is missing and never delete.

The root page is taken from --root-page, then .toolkit.json notion.rootPageId,
then this computer's ~/.config/toolkit-v2/notion.json. Every write outside the
root page is refused.

The Projects database is found by its stored id, then by the title "Projects"
on the root page. --projects-database names it instead; it must be under the
root page, and then the toolkit never creates a second one.

--check reports what is missing without changing anything (exit 1 when
something is missing). Run it first on a root page that already has content.

Needs the Notion CLI: install with "npm install -g ntn" and sign in with
"ntn login". TOOLKIT_NTN_BIN points at another ntn program.`;

const SPEC = {
  'root-page': 'string',
  'projects-database': 'string',
  'project-name': 'string',
  check: 'boolean',
};

export const ENSURE_CACHE_FILE = 'ensure.json';

function listLines(title, items) {
  if (!items || !items.length) return [];
  return [title, ...items.map((i) => `  - ${i}`)];
}

/** A Notion id or URL given as a flag, or null when the flag is absent. Exit 2 when it holds no id. */
function idFlag(flags, name) {
  const raw = flags[name];
  if (raw === undefined || raw === null || raw === false) return null;
  const id = normalizeId(String(raw));
  if (!id) {
    throw new ToolkitError(EXIT.INVALID, `--${name} "${raw}" is not a Notion id or URL.`, {
      fix: `Give the page's id (32 letters and digits, with or without dashes) or its Notion link, for example --${name} https://www.notion.so/My-page-0123456789abcdef0123456789abcdef.`,
    });
  }
  return id;
}

function saveMachine(env, root) {
  const current = readMachineConfig(env);
  const next = {
    ...current,
    rootPageId: root.rootPageId,
    projects: root.projects ? { databaseId: root.projects.databaseId, dataSourceId: root.projects.dataSourceId } : current.projects,
    updated: new Date().toISOString(),
  };
  return writeMachineConfig(env, next);
}

/** The notion block without the fields that change on every run. */
function comparable(block) {
  if (!block || typeof block !== 'object') return null;
  const { verifiedAt, ...rest } = block;
  return JSON.stringify(rest);
}

async function runEnsureRoot(flags, ctx) {
  const env = ctx.env || process.env;
  const flagRoot = idFlag(flags, 'root-page');
  const projectsDatabaseId = idFlag(flags, 'projects-database');
  let project = null;
  const root = findProjectRoot(ctx.cwd);
  const config = root ? loadConfig(root) : null;
  if (config) project = { root, config };
  const rootPageId = flagRoot || resolveRootPageId({ config, env });
  if (!rootPageId) {
    throw new ToolkitError(EXIT.INVALID, 'No Notion root page is known yet.', {
      fix: 'Run toolkit notion ensure-root --root-page <id or URL of the AI Agent Second Brain page>.',
    });
  }
  const client = project ? clientFor({ config, root, env, rootPageId }) : new NotionClient({ rootPageId, env });
  const machine = readMachineConfig(env);
  const stored = (config && config.notion && normalizeId(config.notion.rootPageId || '') === rootPageId && config.notion.projects)
    || (normalizeId(machine.rootPageId || '') === rootPageId && machine.projects)
    || {};
  const result = await ensureRoot({ client, rootPageId, stored, check: Boolean(flags.check), projectsDatabaseId });
  let machineFile = null;
  let configFile = null;
  if (!flags.check && result.projects) {
    machineFile = saveMachine(env, result);
    if (project) {
      const before = comparable(config.notion);
      const nextNotion = { ...(config.notion || {}), rootPageId: result.rootPageId, projects: { databaseId: result.projects.databaseId, dataSourceId: result.projects.dataSourceId, properties: result.projects.properties } };
      if (comparable(nextNotion) !== before) {
        config.notion = nextNotion;
        configFile = saveConfig(root, config);
      }
    }
  }
  const lines = [
    result.projects
      ? `The Projects database under the root page is ${result.created ? 'new' : 'in place'}: ${result.projects.url || result.projects.databaseId}`
      : 'The Projects database is missing under the root page.',
    ...listLines('Added:', result.added),
    ...listLines('Problems:', result.problems),
  ];
  if (!result.added.length && !result.problems.length && result.projects) lines.push('Nothing was missing.');
  if (machineFile) lines.push(`Saved the root page and Projects ids for this computer in ${machineFile}.`);
  if (configFile) lines.push(`Saved them in ${configFile}.`);
  out(ctx, lines, { ok: result.problems.length === 0, ...result, machineFile, configFile, calls: client.stats.calls });
  return result.problems.length ? EXIT.ERROR : EXIT.OK;
}

async function runEnsureProject(flags, ctx) {
  const env = ctx.env || process.env;
  const flagRoot = idFlag(flags, 'root-page');
  const projectsDatabaseId = idFlag(flags, 'projects-database');
  const project = requireProject(ctx.cwd);
  const config = project.config;
  const original = JSON.stringify(config);
  if (flags['project-name']) {
    config.project = { ...(config.project || {}), name: String(flags['project-name']) };
  }
  if (!config.project || !config.project.key) {
    throw new ToolkitError(EXIT.INVALID, '.toolkit.json has no project.key, so the project row cannot be found.', {
      fix: 'Run toolkit config set project.key <short-slug>, then try again.',
    });
  }
  const rootPageId = flagRoot || resolveRootPageId({ config, env });
  if (!rootPageId) {
    throw new ToolkitError(EXIT.INVALID, 'No Notion root page is known yet.', {
      fix: 'Run toolkit notion ensure-root --root-page <id or URL of the AI Agent Second Brain page> first.',
    });
  }
  if (!config.notion || normalizeId(config.notion.rootPageId || '') !== rootPageId) {
    const machine = readMachineConfig(env);
    config.notion = { ...(config.notion || {}), rootPageId };
    if (!config.notion.projects && normalizeId(machine.rootPageId || '') === rootPageId && machine.projects) config.notion.projects = machine.projects;
  }
  const cacheRoot = project.mainRoot || project.root;
  const client = clientFor({ config, root: cacheRoot, env, rootPageId });
  const { notion, report } = await ensureProject({
    client, config, root: project.root, mainRoot: project.mainRoot, rootPageId, check: Boolean(flags.check), projectsDatabaseId,
  });
  let configFile = null;
  let machineFile = null;
  if (!flags.check) {
    config.notion = notion;
    if (report.trackerPrefix && config.tracker && config.tracker.idPrefix !== report.trackerPrefix) config.tracker.idPrefix = report.trackerPrefix;
    // .toolkit.json is committed: write it only when something in it changed.
    if (JSON.stringify(config) !== original) configFile = saveConfig(project.root, config);
    if (report.verifiedAt) writeCache(cacheRoot, ENSURE_CACHE_FILE, { verifiedAt: report.verifiedAt, problems: report.problems.length });
    const machine = readMachineConfig(env);
    if (!machine.rootPageId && notion.projects) {
      machineFile = saveMachine(env, { rootPageId: notion.rootPageId, projects: notion.projects });
    }
  }
  const lines = [];
  if (notion.project && notion.project.url) lines.push(`Project page: ${notion.project.url}`);
  if (notion.workItems && notion.workItems.url) lines.push(`Work Items database: ${notion.workItems.url}`);
  if (notion.memory && notion.memory.layout === 'lore' && notion.memory.pageUrl) lines.push(`Memory page (Lore layout): ${notion.memory.pageUrl}`);
  if (notion.memory && notion.memory.url) lines.push(`${notion.memory.layout === 'lore' ? 'Memories database' : 'Memory database'}: ${notion.memory.url}`);
  lines.push(...listLines('Created:', report.created), ...listLines('Added:', report.added), ...listLines('Note:', report.notes), ...listLines('Problems:', report.problems));
  if (!report.created.length && !report.added.length && !report.problems.length) lines.push('Everything was already in place.');
  if (configFile) lines.push(`Saved the Notion ids in ${configFile}.`);
  if (machineFile) lines.push(`Saved the root page for this computer in ${machineFile} (${machineConfigDir(env)}).`);
  out(ctx, lines, { ok: report.problems.length === 0, notion, report, configFile, machineFile, calls: client.stats.calls });
  return report.problems.length ? EXIT.ERROR : EXIT.OK;
}

export async function run(argv, ctx) {
  const { _: pos, flags } = parseArgs(argv, SPEC);
  const sub = pos[0];
  if (sub === 'ensure-root') return runEnsureRoot(flags, ctx);
  if (sub === 'ensure-project') return runEnsureProject(flags, ctx);
  throw new ToolkitError(EXIT.INVALID, sub ? `Unknown notion command "${sub}". Use ensure-root or ensure-project.` : 'Say what to do: toolkit notion ensure-root, or toolkit notion ensure-project.', {
    fix: 'Run toolkit help notion.',
  });
}
