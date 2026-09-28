// `toolkit config get | set`: read and change .toolkit.json (ARCHITECTURE
// section 3). A key that a template token, a condition, or a host reads is a
// setup change: set saves it and then runs `toolkit sync` (TEMPLATE-LANGUAGE,
// "Setup changes").

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { getPath, setPath, saveConfig } from '../core/config.mjs';
import { TRACKERS, MEMORIES, APPROVALS, KEY_RE, PREFIX_RE, parseHosts, parseDeclined } from './setup.mjs';
import { configRoot } from './sync.mjs';
import { readHosts, HOSTS_FIX } from './manifest.mjs';

/** Keys that templates, conditions, or hosts read: changing one runs sync. */
export const SETUP_KEYS = Object.freeze(['project.name', 'project.key', 'project.owner', 'tracker.type', 'tracker.idPrefix', 'memory.type', 'hindsight.bank', 'salesforce.enabled', 'hosts', 'declined']);

const KNOWN = {
  'project.name': { kind: 'text' },
  'project.key': { kind: 'key' },
  'project.owner': { kind: 'text' },
  'tracker.type': { kind: 'choice', values: TRACKERS },
  'tracker.idPrefix': { kind: 'prefix' },
  'memory.type': { kind: 'choice', values: MEMORIES },
  'memory.approval': { kind: 'choice', values: APPROVALS },
  'salesforce.enabled': { kind: 'boolean' },
  hosts: { kind: 'hosts' },
  declined: { kind: 'declined' },
  'hindsight.url': { kind: 'url' },
  'hindsight.bank': { kind: 'text' },
};

const OPEN_PREFIXES = ['salesforce.orgs.', 'notion.', 'hindsight.'];
const PROTECTED = ['toolkit', 'schema', 'installed', 'project.created'];

function describeAllowed() {
  return `${Object.keys(KNOWN).join(', ')}, and keys under salesforce.orgs., notion., and hindsight.`;
}

/** The rule for a key, or throws INVALID for a key config set does not change. */
export function settingRule(key) {
  const k = String(key || '');
  if (!k) throw new ToolkitError(EXIT.INVALID, 'Name the setting, for example: toolkit config set memory.approval trusted.');
  if (PROTECTED.some((p) => k === p || k.startsWith(`${p}.`))) {
    throw new ToolkitError(EXIT.INVALID, `${k} is kept by the toolkit itself and is not changed with config set.`, {
      fix: k.startsWith('installed') ? 'Run toolkit sync; it keeps the installed hashes.' : k === 'project.created' ? 'Leave it as it is. It is the setup date that the scaffold files show.' : 'Leave it as it is.',
    });
  }
  if (KNOWN[k]) return KNOWN[k];
  if (OPEN_PREFIXES.some((p) => k.startsWith(p) && k.length > p.length)) return { kind: 'text' };
  throw new ToolkitError(EXIT.INVALID, `${k} is not a setting in .toolkit.json. Settings: ${describeAllowed()}.`);
}

/** Turn the text given on the command line into the stored value. */
export function parseSettingValue(key, raw) {
  const rule = settingRule(key);
  const text = raw === undefined || raw === null ? '' : String(raw);
  switch (rule.kind) {
    case 'choice': {
      const v = text.trim().toLowerCase();
      if (!rule.values.includes(v)) throw new ToolkitError(EXIT.INVALID, `${key} must be one of ${rule.values.join(', ')}; "${text}" is not.`);
      return v;
    }
    case 'boolean': {
      const v = text.trim().toLowerCase();
      if (['true', 'yes', 'on', '1'].includes(v)) return true;
      if (['false', 'no', 'off', '0'].includes(v)) return false;
      throw new ToolkitError(EXIT.INVALID, `${key} must be true or false; "${text}" is not.`);
    }
    case 'key': {
      const v = text.trim();
      if (!KEY_RE.test(v)) throw new ToolkitError(EXIT.INVALID, `"${v}" is not a usable project key. Use lower-case letters, digits, and single dashes.`);
      return v;
    }
    case 'prefix': {
      const v = text.trim().toUpperCase();
      if (!PREFIX_RE.test(v)) throw new ToolkitError(EXIT.INVALID, `"${text}" is not a usable id prefix. Use 1 to 10 capital letters or digits, starting with a letter, for example ACME.`);
      return v;
    }
    case 'hosts':
      return parseHosts(text);
    case 'declined':
      return parseDeclined(text);
    case 'url': {
      const v = text.trim();
      if (!/^https?:\/\/[^\s]+$/.test(v)) throw new ToolkitError(EXIT.INVALID, `${key} must be a web address such as http://127.0.0.1:8888.`);
      return v.replace(/\/+$/, '');
    }
    default: {
      if (!text.trim()) throw new ToolkitError(EXIT.INVALID, `Give a value for ${key}.`);
      return text.trim();
    }
  }
}

/** True when the local tracker already has items (its ids would no longer match a new prefix). */
function localItemsExist(mainRoot) {
  const stateFile = path.join(mainRoot, '.work-items', '.toolkit-state.json');
  try {
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    return (Number.isInteger(state.highWater) && state.highWater > 0) || Object.keys(state.items || {}).length > 0;
  } catch {
    return false;
  }
}

/** The number of work items the local tracker knows, from its state file. */
function localItemCount(mainRoot) {
  try {
    const state = JSON.parse(fs.readFileSync(path.join(mainRoot, '.work-items', '.toolkit-state.json'), 'utf8'));
    return Object.keys(state.items || {}).length;
  } catch {
    return 0;
  }
}

/**
 * The number of memory records in .memory/ (files named <type>_<slug>.md).
 * The model's topic template (status: template) is not a record.
 */
function builtinRecordCount(mainRoot) {
  const dir = path.join(mainRoot, '.memory');
  try {
    return fs.readdirSync(dir).filter((n) => {
      if (!/^(user|feedback|project|reference|event)_.+\.md$/.test(n)) return false;
      try {
        return !/^status:\s*template\s*$/m.test(fs.readFileSync(path.join(dir, n), 'utf8').split(/\n---\s*\n/)[0]);
      } catch {
        return true;
      }
    }).length;
  } catch {
    return 0;
  }
}

const BACKEND_WORDS = { local: '.work-items/', notion: 'Notion', github: 'GitHub Issues', jira: 'Jira', builtin: '.memory/', hindsight: 'the local Hindsight server' };

/**
 * What the owner needs to know after a tracker or memory change:
 * { next: [lines], warnings: [lines] }. The next steps are the commands that
 * set up the new backend; the warnings name records the toolkit no longer shows.
 */
export function afterSetting(project, key, from, to) {
  const config = project.config || {};
  const mainRoot = project.mainRoot || project.root;
  const next = [];
  const warnings = [];
  const notion = config.notion || {};
  if (key === 'tracker.type' && to === 'notion' && !notion.workItems) {
    next.push('Next: run toolkit notion ensure-project to make this project\'s Work Items database in Notion. Until then, toolkit work commands cannot reach it.');
  }
  if (key === 'memory.type' && to === 'notion' && !notion.memory) {
    next.push('Next: run toolkit notion ensure-project to make this project\'s Memory page in Notion, with Lore\'s databases on it. Until then, memory commands cannot reach it.');
  }
  if (key === 'memory.type' && to === 'hindsight' && !(config.hindsight && config.hindsight.bank)) {
    next.push('Next: run toolkit hindsight ensure-bank to make this project\'s memory bank (toolkit hindsight health checks the server first). Until then, memory commands cannot reach it.');
  }
  if (key === 'tracker.type' && (from || 'local') === 'local' && to !== 'local') {
    const n = localItemCount(mainRoot);
    if (n) {
      warnings.push(`Warning: .work-items/ holds ${n} work item${n === 1 ? '' : 's'}. Work items are now read from ${BACKEND_WORDS[to] || to}, so the toolkit no longer shows ${n === 1 ? 'it' : 'them'}. Nothing was moved or deleted. To see ${n === 1 ? 'it' : 'them'} again: toolkit config set tracker.type local.`);
    }
  }
  if (key === 'memory.type' && (from || 'builtin') === 'builtin' && to !== 'builtin') {
    const n = builtinRecordCount(mainRoot);
    if (n) {
      warnings.push(`Warning: .memory/ holds ${n} memory record${n === 1 ? '' : 's'}. Memory is now read from ${BACKEND_WORDS[to] || to}, so the toolkit no longer shows ${n === 1 ? 'it' : 'them'}. Nothing was moved or deleted. To move ${n === 1 ? 'it' : 'them'}: set memory.type back to builtin, run toolkit memory export --to <folder>, set memory.type to ${to} again, then run toolkit memory import --from <folder>.`);
    }
  }
  return { next, warnings };
}

/**
 * Change one setting. A setting that is not a setup key is saved at once.
 * A setup key is only changed in memory (`save: false` is returned): the
 * caller runs toolkit sync and saves .toolkit.json only when the sync worked,
 * so a failed sync leaves the old value (see commands/config.mjs).
 * Returns { key, from, to, changed, setup, saved }.
 */
export function setSetting(project, key, raw) {
  const root = configRoot(project);
  const value = parseSettingValue(key, raw);
  const config = project.config;
  const from = getPath(config, key);
  if (JSON.stringify(from) === JSON.stringify(value)) {
    return { key, from, to: value, changed: false, setup: SETUP_KEYS.includes(key) };
  }
  // Another setup key would run sync, and sync stops on a hosts value it cannot read.
  const hostsProblem = key !== 'hosts' && SETUP_KEYS.includes(key) ? readHosts(config).problem : null;
  if (hostsProblem) {
    throw new ToolkitError(EXIT.INVALID, `${hostsProblem} Fix hosts first; nothing was saved.`, { fix: HOSTS_FIX });
  }
  if (key === 'tracker.idPrefix' && (config.tracker && config.tracker.type) === 'local' && localItemsExist(project.mainRoot || project.root)) {
    throw new ToolkitError(EXIT.INVALID, `The local tracker already has work items numbered ${from || 'WI'}-..., so the id prefix cannot change now. Nothing was saved.`, {
      fix: 'Keep the current prefix. The prefix is set right after init, before the first work item.',
    });
  }
  const setup = SETUP_KEYS.includes(key);
  setPath(config, key, value);
  if (!setup) saveConfig(root, config);
  return { key, from, to: value, changed: true, setup, saved: !setup, root };
}

/** Format a value for plain output. */
export function formatSetting(value) {
  if (value === undefined) return '(not set)';
  if (value !== null && typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}
