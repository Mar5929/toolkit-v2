// Shared facts about a project's setup choices: the allowed values, the
// config shape, and the plain words used to describe them.

import { EXIT, ToolkitError } from '../core/output.mjs';
import { slugify } from '../core/util.mjs';
import { HOSTS, projectHosts } from './manifest.mjs';

export const TRACKERS = Object.freeze(['local', 'notion', 'github', 'jira']);
export const MEMORIES = Object.freeze(['builtin', 'hindsight', 'notion']);
export const APPROVALS = Object.freeze(['onboarding', 'trusted']);
export const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const PREFIX_RE = /^[A-Z][A-Z0-9]{0,9}$/;
export const CONFIG_SCHEMA = 1;

export const TRACKER_WORDS = Object.freeze({
  local: 'local folders in .work-items/',
  notion: 'the Notion Work Items database',
  github: 'GitHub Issues (written instructions only)',
  jira: 'Jira (written instructions only)',
});

export const MEMORY_WORDS = Object.freeze({
  builtin: 'built-in memory in .memory/',
  hindsight: 'the local Hindsight server',
  notion: 'Notion, in Lore\'s layout (a Memory page on the project row with Lore\'s databases)',
});

export const HOST_WORDS = Object.freeze({ 'claude-code': 'Claude Code', codex: 'Codex' });

/**
 * Scaffold files the owner may decline during setup. A declined file is
 * listed in .toolkit.json "declined": init does not install it, sync never
 * adds it back, and doctor does not report it missing.
 */
export const OPTIONAL_FILES = Object.freeze(['SOUL.md']);

/**
 * Read a --decline or `config set declined` value ("SOUL.md", a comma list,
 * an array, or "none" or "" for no file) into a checked list.
 */
export function parseDeclined(value) {
  if (value === undefined || value === null || value === true) return [];
  const raw = Array.isArray(value) ? value.flatMap((v) => String(v).split(',')) : String(value).split(',');
  const out = [];
  for (const part of raw.map((s) => s.trim()).filter(Boolean)) {
    if (part.toLowerCase() === 'none') continue;
    const name = OPTIONAL_FILES.find((f) => f.toLowerCase() === part.toLowerCase());
    if (!name) {
      throw new ToolkitError(EXIT.INVALID, `"${part}" is not a file the owner can decline. Optional files: ${OPTIONAL_FILES.join(', ')}.`);
    }
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

/** Read a --hosts value ("claude-code,codex", or an array) into a checked list. */
export function parseHosts(value) {
  if (value === undefined || value === null || value === true) return [...HOSTS];
  const raw = Array.isArray(value) ? value.flatMap((v) => String(v).split(',')) : String(value).split(',');
  const out = [];
  for (const h of raw.map((s) => s.trim().toLowerCase()).filter(Boolean)) {
    const name = h === 'claude' || h === 'claudecode' ? 'claude-code' : h;
    if (!HOSTS.includes(name)) {
      throw new ToolkitError(EXIT.INVALID, `"${h}" is not a host. Use claude-code, codex, or both: --hosts claude-code,codex.`);
    }
    if (!out.includes(name)) out.push(name);
  }
  if (!out.length) throw new ToolkitError(EXIT.INVALID, 'Give at least one host: --hosts claude-code,codex.');
  return HOSTS.filter((h) => out.includes(h));
}

export function checkKey(key) {
  if (!KEY_RE.test(String(key || ''))) {
    throw new ToolkitError(EXIT.INVALID, `"${key}" is not a usable project key. Use lower-case letters, digits, and single dashes, for example acme-crm.`, {
      fix: 'Give --key <short-key>.',
    });
  }
  return key;
}

/** Letters that Unicode does not split into a plain letter and an accent. */
const LETTERS = { ø: 'o', Ø: 'O', æ: 'ae', Æ: 'AE', œ: 'oe', Œ: 'OE', ß: 'ss', đ: 'd', Đ: 'D', ð: 'd', Ð: 'D', ł: 'l', Ł: 'L', þ: 'th', Þ: 'TH', ı: 'i' };

export function keyFromName(name) {
  const plain = String(name || '').replace(/[øØæÆœŒßđĐðÐłŁþÞı]/g, (c) => LETTERS[c]);
  const key = slugify(plain, 40);
  return key || null;
}

export function checkChoice(value, allowed, flag) {
  const v = String(value || '').trim().toLowerCase();
  if (!allowed.includes(v)) {
    throw new ToolkitError(EXIT.INVALID, `--${flag} "${value}" is not one of ${allowed.join(', ')}.`, { fix: `Give --${flag} ${allowed.join('|')}.` });
  }
  return v;
}

/**
 * A fresh .toolkit.json in the ARCHITECTURE section 3 key order.
 * `project.created` is the setup date: the `{{today}}` token renders as it.
 */
export function newConfig({ name, key, owner, created, tracker, memory, salesforce, hosts, declined }) {
  const config = {
    toolkit: 'toolkit-v2',
    schema: CONFIG_SCHEMA,
    project: created ? { name, key, owner, created } : { name, key, owner },
    tracker: { type: tracker, idPrefix: 'WI' },
    memory: { type: memory, approval: 'onboarding' },
    salesforce: salesforce ? { enabled: true, orgs: {} } : { enabled: false },
    hosts,
  };
  if (Array.isArray(declined) && declined.length) config.declined = [...declined];
  return { ...config, notion: {}, hindsight: {}, installed: {} };
}

/** The optional files a project declined (.toolkit.json "declined"), as a set. */
export function declinedFiles(config) {
  const list = config && Array.isArray(config.declined) ? config.declined : [];
  return new Set(list.filter((f) => OPTIONAL_FILES.includes(f)));
}

/** One line describing a project's choices. */
export function describeSetup(config) {
  const c = config || {};
  const p = c.project || {};
  const tracker = (c.tracker && c.tracker.type) || 'local';
  const memory = (c.memory && c.memory.type) || 'builtin';
  const prefix = (c.tracker && c.tracker.idPrefix) || 'WI';
  const hosts = projectHosts(c).map((h) => HOST_WORDS[h] || h).join(' and ');
  const ids = tracker === 'local' || tracker === 'notion' ? ` (ids like ${prefix}-001)` : '';
  return `${p.name || 'This project'} (${p.key || 'no key'}), owner ${p.owner || 'not set'}. Work items: ${TRACKER_WORDS[tracker] || tracker}${ids}. Memory: ${MEMORY_WORDS[memory] || memory}. Salesforce: ${c.salesforce && c.salesforce.enabled ? 'yes' : 'no'}. Hosts: ${hosts}.`;
}
