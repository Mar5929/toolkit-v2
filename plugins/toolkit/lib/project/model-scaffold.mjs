// The scaffold: scaffold/model/ (an exact copy of the model project, made by
// dev/tools/import-model.mjs) plus scaffold/CONDITIONS.json (which paths
// install when, and the few changes init makes to a model file), plus the
// toolkit's own additions in templates/ (the files the model does not hold).
// Rules: templates/TEMPLATE-LANGUAGE.md.
//
// buildManifest(pluginRoot) -> { files: [entry], conditions }
//   entry: { source, target, when: [condition], mode, model, template, generated, fills, binary, execBits }
//   condition: tracker:local | memory:builtin | salesforce | host:claude-code | host:codex
//   mode: copy | agents-md | append | merge-json | merge-toml | seed
//   binary: the model file is not UTF-8 text (an image, for example); it is
//     copied as bytes. execBits: the model file's executable bits (mode & 0o111).
// renderModelFile(entry, text, config, conditions) -> { text, skip }
//   the setup markers, the <Project name> fill, and the Salesforce removals
//   (jsonRemove, lineRemove) for one model file.
// applyRemovals(rel, text, config, conditions) -> { text, removed }
//   the same Salesforce removals applied to a project's own copy of a file
//   (sync uses it on a file the project has not changed).

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { renderMarkers, hasMarkers } from './render.mjs';

export const MODEL_DIR = 'scaffold/model';
export const CONDITIONS_FILE = 'scaffold/CONDITIONS.json';
/** The import record in scaffold/model/. It is never installed. */
export const IMPORT_RECORD = '.import.json';

/** Model files the toolkit merges into a project's own copy instead of copying. */
export const MERGE_JSON_TARGETS = Object.freeze(['.claude/settings.json', '.codex/hooks.json']);
/** Model files whose missing lines are appended to a project's own copy. */
export const APPEND_TARGETS = Object.freeze(['.gitignore']);
export const AGENTS_TARGET = 'AGENTS.md';

/**
 * The toolkit's own additions: files and entries the model does not hold.
 * They run after the model's entry for the same target.
 */
export const TOOLKIT_ENTRIES = Object.freeze([
  { source: 'templates/settings/claude-toolkit.json', target: '.claude/settings.json', when: ['host:claude-code'], mode: 'merge-json', toolkit: 'claude-settings' },
  { source: 'templates/codex/config-base.toml', target: '.codex/config.toml', when: ['host:codex'], mode: 'merge-toml', template: true, toolkit: 'codex-config' },
  { source: 'templates/codex/toolkit.rules', target: '.codex/rules/toolkit.rules', when: ['host:codex'], mode: 'copy', toolkit: 'codex-rules' },
  { source: 'templates/gitignore/toolkit.gitignore', target: '.gitignore', when: [], mode: 'append', toolkit: 'gitignore' },
]);

export const WHEN_VALUES = Object.freeze(['tracker:local', 'memory:builtin', 'salesforce', 'host:claude-code', 'host:codex']);

// ------------------------------------------------------------------ globs

/**
 * A small glob: `**` matches any number of whole path segments (none
 * included), `*` any text inside one segment, `?` one character. Paths use `/`.
 */
export function globToRegExp(glob) {
  let re = '';
  const parts = String(glob).split('/');
  parts.forEach((part, i) => {
    const last = i === parts.length - 1;
    if (part === '**') {
      re += last ? '.*' : '(?:[^/]+/)*';
      return;
    }
    re += part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]');
    if (!last) re += '/';
  });
  return new RegExp(`^${re}$`);
}

export function matches(glob, rel) {
  return globToRegExp(glob).test(rel);
}

// ------------------------------------------------------------------ reading

export function loadConditions(pluginRoot) {
  const file = path.join(pluginRoot, ...CONDITIONS_FILE.split('/'));
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new ToolkitError(EXIT.ERROR, `The scaffold conditions file ${file} could not be read: ${err.message}`, { fix: 'Reinstall or update the toolkit plugin.' });
  }
  for (const rule of data.only || []) {
    if (!WHEN_VALUES.includes(rule.when)) {
      throw new ToolkitError(EXIT.ERROR, `${CONDITIONS_FILE} names an unknown condition "${rule.when}". Known: ${WHEN_VALUES.join(', ')}.`, { fix: 'Fix CONDITIONS.json in the toolkit plugin.' });
    }
  }
  return data;
}

/** Every file in scaffold/model/ as sorted relative paths with `/`, the import record left out. */
export function listModelFiles(pluginRoot) {
  const root = path.join(pluginRoot, ...MODEL_DIR.split('/'));
  const out = [];
  const visit = (dir, rel) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      if (!rel) {
        throw new ToolkitError(EXIT.ERROR, `The model copy ${root} is missing from the toolkit plugin (${err.message}).`, { fix: 'Reinstall or update the toolkit plugin.' });
      }
      throw err;
    }
    for (const e of entries) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) visit(path.join(dir, e.name), r);
      else if (e.isFile() && r !== IMPORT_RECORD) out.push(r);
    }
  };
  visit(root, '');
  return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** The conditions a model path installs under (every one must hold). */
export function whenFor(rel, conditions) {
  const out = [];
  for (const rule of (conditions && conditions.only) || []) {
    if ((rule.paths || []).some((p) => matches(p, rel)) && !out.includes(rule.when)) out.push(rule.when);
  }
  return out;
}

function trackerType(c) {
  return String((c && c.tracker && c.tracker.type) || 'local');
}

function memoryType(c) {
  return String((c && c.memory && c.memory.type) || 'builtin');
}

function salesforceOn(c) {
  return Boolean(c && c.salesforce && c.salesforce.enabled);
}

/**
 * True when one condition holds. `hosts` is the list of hosts the project
 * serves (the caller reads it from .toolkit.json).
 */
export function whenHolds(when, config, hosts) {
  switch (when) {
    case 'always': return true;
    case 'tracker:local': return trackerType(config) === 'local';
    case 'memory:builtin': return memoryType(config) === 'builtin';
    case 'memory:hindsight': return memoryType(config) === 'hindsight';
    case 'memory:notion': return memoryType(config) === 'notion';
    case 'salesforce': return salesforceOn(config);
    case 'not salesforce': return !salesforceOn(config);
    case 'host:claude-code': return (hosts || []).includes('claude-code');
    case 'host:codex': return (hosts || []).includes('codex');
    default: return false;
  }
}

/** The setting each condition reads (for "a changed file still describes ..."). */
export const WHEN_KEYS = Object.freeze({
  'tracker:local': 'tracker.type',
  'memory:builtin': 'memory.type',
  salesforce: 'salesforce.enabled',
  'host:claude-code': 'hosts',
  'host:codex': 'hosts',
});

function modeFor(rel, generated) {
  if (generated) return 'seed';
  if (rel === AGENTS_TARGET) return 'agents-md';
  if (MERGE_JSON_TARGETS.includes(rel)) return 'merge-json';
  if (APPEND_TARGETS.includes(rel)) return 'append';
  return 'copy';
}

/** The fill rules that apply to one model path. */
function fillsFor(rel, conditions) {
  return ((conditions && conditions.fill) || []).filter((f) => (f.paths || []).includes(rel));
}

/**
 * Every file toolkit init may install, in order: the model's files (sorted by
 * path), then the toolkit's additions.
 */
export function buildManifest(pluginRoot) {
  const conditions = loadConditions(pluginRoot);
  const generated = new Set(((conditions.generated) || []).map((g) => g.path));
  const files = [];
  const rels = listModelFiles(pluginRoot);
  // The import tool refuses a copy that misses a rule, so a rule that matches
  // nothing here means the plugin copy lost files (for example a clone made
  // before the Git-ignored .memory/ and .work-items/ templates were tracked).
  // Installing from it would set up a project without them.
  const modelDir = path.join(pluginRoot, ...MODEL_DIR.split('/'));
  const problems = unmatchedRules(conditions, rels, (rel) => fs.readFileSync(path.join(modelDir, ...rel.split('/')), 'utf8'));
  if (problems.length) {
    throw new ToolkitError(EXIT.ERROR, `The toolkit plugin's model copy (${MODEL_DIR}/) is incomplete: it does not match ${CONDITIONS_FILE} (${problems.slice(0, 4).join('; ')}${problems.length > 4 ? `; and ${problems.length - 4} more` : ''}). Nothing was changed.`, {
      fix: 'Reinstall or update the toolkit plugin. In the toolkit-v2 repository, node dev/tools/import-model.mjs --check names what is missing.',
    });
  }
  for (const rel of rels) {
    const source = `${MODEL_DIR}/${rel}`;
    const abs = path.join(pluginRoot, ...source.split('/'));
    const fills = fillsFor(rel, conditions);
    let buf = null;
    let execBits = 0;
    try {
      buf = fs.readFileSync(abs);
      execBits = fs.statSync(abs).mode & 0o111;
    } catch {
      buf = null;
    }
    const binary = buf !== null && !isUtf8(buf);
    const template = !binary && (fills.length > 0 || (buf !== null && hasMarkers(buf.toString('utf8'))));
    files.push({
      source,
      target: rel,
      when: whenFor(rel, conditions),
      mode: modeFor(rel, generated.has(rel)),
      model: true,
      template,
      generated: generated.has(rel),
      fills,
      binary,
      execBits,
    });
  }
  for (const e of TOOLKIT_ENTRIES) files.push({ ...e, when: [...e.when], model: false, template: Boolean(e.template), generated: false, fills: [], binary: false, execBits: 0 });
  return { files, conditions };
}

/** True when a file's bytes are UTF-8 text (they survive a decode and encode unchanged). */
export function isUtf8(buf) {
  return Buffer.from(buf.toString('utf8'), 'utf8').equals(buf);
}

/** True when a CONDITIONS.json rule changes a model file's text (a fill, a lineRemove, or a jsonRemove). */
export function rulesChangeText(rel, conditions) {
  const c = conditions || {};
  return fillsFor(rel, c).length > 0 || [...(c.lineRemove || []), ...(c.jsonRemove || [])].some((r) => r.path === rel);
}

// ------------------------------------------------------------------ rendering one model file

function valueOf(config, key) {
  let at = config;
  for (const k of String(key).split('.')) at = at && typeof at === 'object' ? at[k] : undefined;
  return at === undefined || at === null ? '' : String(at);
}

/** Replace the fill text on heading lines (or every line) with the setting's value. */
export function applyFills(text, fills, config) {
  if (!fills || !fills.length) return text;
  const lines = String(text).split('\n');
  for (const f of fills) {
    const value = valueOf(config, f.value);
    if (!value) continue;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].includes(f.text)) continue;
      if (f.lines === 'headings' && !/^#{1,6} /.test(lines[i])) continue;
      lines[i] = lines[i].split(f.text).join(value);
    }
  }
  return lines.join('\n');
}

/** Drop the lines a lineRemove rule names (compared without trailing spaces). */
export function applyLineRemove(text, rule) {
  const drop = new Set((rule.lines || []).map((l) => l.trimEnd()));
  return String(text).split('\n').filter((l) => !drop.has(l.replace(/\r$/, '').trimEnd())).join('\n');
}

function hookRuns(handler, needles) {
  const parts = [handler && handler.command, ...((handler && Array.isArray(handler.args)) ? handler.args : [])];
  return parts.some((s) => typeof s === 'string' && needles.some((n) => s.includes(n)));
}

/**
 * Apply a jsonRemove rule to parsed JSON (a copy is returned).
 * Returns { data, changed, noHooksLeft, removed }: removed names each entry
 * taken out, in plain words.
 */
export function applyJsonRemove(data, rule) {
  const out = JSON.parse(JSON.stringify(data));
  let changed = false;
  const removed = [];
  const needles = rule.hookCommandContains || [];
  if (needles.length && out && out.hooks && typeof out.hooks === 'object') {
    for (const event of Object.keys(out.hooks)) {
      const groups = out.hooks[event];
      if (!Array.isArray(groups)) continue;
      const kept = [];
      for (const g of groups) {
        if (!g || !Array.isArray(g.hooks)) {
          kept.push(g);
          continue;
        }
        const handlers = g.hooks.filter((h) => !hookRuns(h, needles));
        for (const h of g.hooks) if (hookRuns(h, needles)) removed.push(`remove the ${event} hook ${JSON.stringify([h.command, ...(Array.isArray(h.args) ? h.args : [])].filter(Boolean).join(' '))}`);
        if (handlers.length !== g.hooks.length) changed = true;
        if (handlers.length) kept.push({ ...g, hooks: handlers });
      }
      if (kept.length) out.hooks[event] = kept;
      else delete out.hooks[event];
    }
    if (!Object.keys(out.hooks).length) delete out.hooks;
  }
  for (const [key, values] of Object.entries(rule.values || {})) {
    const parts = key.split('.');
    let parent = out;
    for (const k of parts.slice(0, -1)) parent = parent && typeof parent === 'object' ? parent[k] : undefined;
    const last = parts[parts.length - 1];
    if (!parent || !Array.isArray(parent[last])) continue;
    const before = parent[last].length;
    for (const v of parent[last]) if (values.includes(v)) removed.push(`remove ${JSON.stringify(v)} from ${key}`);
    parent[last] = parent[last].filter((v) => !values.includes(v));
    if (parent[last].length !== before) changed = true;
    if (!parent[last].length) delete parent[last];
  }
  const noHooksLeft = !(out && out.hooks && Object.keys(out.hooks).length);
  return { data: out, changed, noHooksLeft, removed };
}

/**
 * The lineRemove and jsonRemove rules that apply to this project, applied to
 * a project's own copy of a model file (for example .claude/settings.json
 * after Salesforce is turned off). A file that is not valid JSON is returned
 * as it is; the merge reports it. Returns { text, removed }.
 */
export function applyRemovals(rel, text, config, conditions) {
  if (typeof text !== 'string') return { text, removed: [] };
  const sf = salesforceOn(config);
  let out = text;
  const removed = [];
  for (const rule of (conditions && conditions.lineRemove) || []) {
    if (rule.path !== rel || !ruleApplies(rule, sf)) continue;
    const drop = new Set((rule.lines || []).map((l) => l.trimEnd()));
    for (const l of out.split('\n')) {
      const k = l.replace(/\r$/, '').trimEnd();
      if (drop.has(k)) removed.push(`remove the line "${k}"`);
    }
    out = applyLineRemove(out, rule);
  }
  for (const rule of (conditions && conditions.jsonRemove) || []) {
    if (rule.path !== rel || !ruleApplies(rule, sf)) continue;
    let data;
    try {
      data = JSON.parse(out);
    } catch {
      continue;
    }
    const r = applyJsonRemove(data, rule);
    if (!r.changed) continue;
    out = `${JSON.stringify(r.data, null, 2)}\n`;
    removed.push(...r.removed);
  }
  return { text: out, removed };
}

/**
 * The text a model file installs as for a project, or { skip: true } when a
 * rule leaves the file out (a hooks file with no hooks left).
 * @param {object} entry a buildManifest entry
 * @param {string} text the model file's text
 * @param {object} config the project's .toolkit.json values
 * @param {object} conditions CONDITIONS.json
 */
export function renderModelFile(entry, text, config, conditions) {
  const rel = entry.target;
  let out = text;
  if (entry.template) {
    out = renderMarkers(out, config, { file: entry.source });
    out = applyFills(out, entry.fills, config);
  }
  const sf = salesforceOn(config);
  for (const rule of (conditions && conditions.lineRemove) || []) {
    if (rule.path !== rel || !ruleApplies(rule, sf)) continue;
    out = applyLineRemove(out, rule);
  }
  for (const rule of (conditions && conditions.jsonRemove) || []) {
    if (rule.path !== rel || !ruleApplies(rule, sf)) continue;
    let data;
    try {
      data = JSON.parse(out);
    } catch (err) {
      throw new ToolkitError(EXIT.ERROR, `The model file ${entry.source} is not valid JSON (${err.message}).`, { fix: 'Fix the model, run node dev/tools/import-model.mjs, and reinstall the toolkit plugin.' });
    }
    const r = applyJsonRemove(data, rule);
    if (rule.skipFileWhenNoHooksLeft && r.noHooksLeft) return { text: null, skip: true };
    if (r.changed) out = `${JSON.stringify(r.data, null, 2)}\n`;
  }
  return { text: out, skip: false };
}

/** A lineRemove or jsonRemove rule applies when its "unless" condition does not hold. */
function ruleApplies(rule, salesforce) {
  if (rule.unless === 'salesforce') return !salesforce;
  if (rule.when === 'salesforce') return salesforce;
  return true;
}

// ------------------------------------------------------------------ rule checks (the import tool)

/**
 * Every install rule of CONDITIONS.json that matches nothing in a file list.
 * readFile(rel) returns a file's text. Used by dev/tools/import-model.mjs.
 */
export function unmatchedRules(conditions, files, readFile) {
  const problems = [];
  const any = (glob) => files.some((f) => matches(glob, f));
  for (const rule of conditions.only || []) {
    if (!WHEN_VALUES.includes(rule.when)) problems.push(`"only": unknown condition "${rule.when}"`);
    for (const p of rule.paths || []) if (!any(p)) problems.push(`"only" (${rule.when}): ${p} matches no file`);
  }
  for (const g of conditions.generated || []) if (!files.includes(g.path)) problems.push(`"generated": ${g.path} is not in the model`);
  for (const f of conditions.fill || []) {
    for (const p of f.paths || []) {
      if (!files.includes(p)) {
        problems.push(`"fill": ${p} is not in the model`);
        continue;
      }
      const lines = readFile(p).split('\n');
      const hit = lines.some((l) => l.includes(f.text) && (f.lines !== 'headings' || /^#{1,6} /.test(l)));
      if (!hit) problems.push(`"fill": ${p} has no ${f.lines === 'headings' ? 'heading line holding' : 'line holding'} ${f.text}`);
    }
  }
  for (const r of conditions.jsonRemove || []) {
    if (!files.includes(r.path)) {
      problems.push(`"jsonRemove": ${r.path} is not in the model`);
      continue;
    }
    let data;
    try {
      data = JSON.parse(readFile(r.path));
    } catch (err) {
      problems.push(`"jsonRemove": ${r.path} is not valid JSON (${err.message})`);
      continue;
    }
    for (const needle of r.hookCommandContains || []) {
      const found = Object.values((data && data.hooks) || {}).some((groups) => Array.isArray(groups)
        && groups.some((g) => g && Array.isArray(g.hooks) && g.hooks.some((h) => hookRuns(h, [needle]))));
      if (!found) problems.push(`"jsonRemove": no hook in ${r.path} runs ${needle}`);
    }
    for (const [key, values] of Object.entries(r.values || {})) {
      let at = data;
      for (const k of key.split('.')) at = at && typeof at === 'object' ? at[k] : undefined;
      if (!Array.isArray(at)) {
        problems.push(`"jsonRemove": ${r.path} has no list at ${key}`);
        continue;
      }
      for (const v of values) if (!at.includes(v)) problems.push(`"jsonRemove": ${r.path} ${key} has no ${JSON.stringify(v)}`);
    }
  }
  for (const r of conditions.lineRemove || []) {
    if (!files.includes(r.path)) {
      problems.push(`"lineRemove": ${r.path} is not in the model`);
      continue;
    }
    const have = new Set(readFile(r.path).split(/\r?\n/).map((l) => l.trimEnd()));
    for (const l of r.lines || []) if (!have.has(l)) problems.push(`"lineRemove": ${r.path} has no line ${JSON.stringify(l)}`);
  }
  return problems;
}
