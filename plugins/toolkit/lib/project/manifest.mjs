// The install engine behind `toolkit init`, `toolkit sync`, and the scaffold
// checks in `toolkit doctor`. It follows scaffold/MANIFEST.json and
// templates/TEMPLATE-LANGUAGE.md exactly:
//
// - planManifest() reads every source and target, renders templates, and
//   decides what to do with each target. It writes nothing, so a template
//   error stops init before any file is written, and `sync --dry-run` and
//   doctor can show the plan.
// - applyPlan() writes the plan: every file first, then AGENTS.md with its
//   rules span built from the rule files as they are after the writes.
//
// A target is judged once, before its first entry runs (several entries may
// share one target: the two .gitignore parts, the two .claude/settings.json
// fragments):
//   missing    the file does not exist
//   unchanged  its SHA-256 equals the `installed` entry (AGENTS.md without its span)
//   changed    it differs from the `installed` entry: the project changed it
//   untracked  it exists and has no `installed` entry
//
// What happens (mode init | sync):
//   missing                  install, record the hash
//   unchanged                rebuild from the current sources and values; write when it differs
//   changed                  leave it; list it, with what the toolkit would add or change
//   untracked, init          copy: keep; append, merge-json, merge-toml: merge and record the hash
//   untracked, sync          like changed
//   AGENTS.md, no markers    keep; write the Toolkit V2 version to the proposal file
//   AGENTS.md, untracked,    keep, rebuild the span, and record the hash of the toolkit's
//     both markers           own version (init and sync): see planAdoptedAgents()
// `{{today}}` renders as the setup date, .toolkit.json `project.created`
// (renderDate), so a later render gives the same text.
// A target whose condition or host no longer holds is never deleted; when the
// toolkit wrote it, it is listed as left over.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { atomicWrite, ensureDir, sha256 } from '../core/fsx.mjs';
import { today as localToday } from '../core/util.mjs';
import { renderTemplate, keysReadBy, hashText, hasSpan, buildSpan, fillSpan, spanBody, describeRule } from './render.mjs';
import { mergeToml } from './toml.mjs';
import { buildKnowledgeIndex, INDEX_TARGET } from './knowledge-index.mjs';
import { claudeOldPlugins, codexOldPlugins, OLD_MARKETPLACE } from './hosts.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_PLUGIN_ROOT = path.resolve(HERE, '..', '..');
export const PROPOSAL_PATH = '.toolkit-cache/AGENTS.proposed.md';
export const MAIN_CHECKOUT_DIRS = Object.freeze(['.work-items/', '.memory/']);
export const HOSTS = Object.freeze(['claude-code', 'codex']);

/** Targets whose content comes from a generator, not from their seed. */
const GENERATORS = {
  [INDEX_TARGET]: (project) => buildKnowledgeIndex(project.root).text,
};

export function loadManifest(pluginRoot = DEFAULT_PLUGIN_ROOT) {
  const file = path.join(pluginRoot, 'scaffold', 'MANIFEST.json');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new ToolkitError(EXIT.ERROR, `The scaffold manifest ${file} could not be read: ${err.message}`, {
      fix: 'Reinstall or update the toolkit plugin.',
    });
  }
  if (!manifest || !Array.isArray(manifest.files)) {
    throw new ToolkitError(EXIT.ERROR, `The scaffold manifest ${file} has no "files" list.`, { fix: 'Reinstall or update the toolkit plugin.' });
  }
  return manifest;
}

/** True when a MANIFEST condition holds for a project. */
export function conditionHolds(condition, config) {
  const c = config || {};
  const tracker = String((c.tracker && c.tracker.type) || 'local');
  const memory = String((c.memory && c.memory.type) || 'builtin');
  switch (condition) {
    case 'always': return true;
    case 'salesforce': return Boolean(c.salesforce && c.salesforce.enabled);
    case 'tracker:local': return tracker === 'local';
    case 'memory:builtin': return memory === 'builtin';
    case 'memory:hindsight': return memory === 'hindsight';
    case 'memory:notion': return memory === 'notion';
    default: return false;
  }
}

/** The hosts a project serves (default both). */
export function projectHosts(config) {
  const h = config && Array.isArray(config.hosts) ? config.hosts.map(String) : null;
  return h && h.length ? h : [...HOSTS];
}

/** True when an entry installs for this project: its condition and its host both hold. */
export function entryApplies(entry, config) {
  if (!conditionHolds(entry.condition, config)) return false;
  return !entry.host || projectHosts(config).includes(entry.host);
}

/** Targets under .work-items/ and .memory/ live in the main checkout. */
export function targetBase(target, project) {
  return MAIN_CHECKOUT_DIRS.some((d) => target.startsWith(d)) ? (project.mainRoot || project.root) : project.root;
}

export function targetPath(target, project) {
  return path.join(targetBase(target, project), ...target.split('/'));
}

function readOrNull(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) return null;
    if (err && err.code === 'EISDIR') {
      throw new ToolkitError(EXIT.ERROR, `${file} is a folder, where the toolkit expects a file.`, { path: file, fix: 'Move the folder aside, then run the command again.' });
    }
    throw err;
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's local date (TOOLKIT_TODAY in tests). */
export function todayFor(env) {
  const t = env && env.TOOLKIT_TODAY;
  return t && DATE_RE.test(t) ? t : localToday();
}

/** The project's setup date from .toolkit.json `project.created`, or null. */
export function setupDate(config) {
  const d = config && config.project && config.project.created;
  return typeof d === 'string' && DATE_RE.test(d) ? d : null;
}

/**
 * The date `{{today}}` renders as: the day the project was set up. Every
 * later render (sync, config set, doctor) gives the same text, so a file
 * nobody changed never looks out of date only because the calendar moved.
 * A project with no recorded setup date renders today's date.
 */
export function renderDate(config, env) {
  return setupDate(config) || todayFor(env);
}

// ------------------------------------------------------------------ modes

/** `append`: add each non-blank source line the target lacks, after one blank line. */
export function appendText(target, source) {
  if (target === null || target === undefined) return source;
  const have = new Set(target.split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim() !== ''));
  const lines = source.split(/\r?\n/);
  const missing = lines.filter((l) => l.trim() !== '' && !have.has(l.trimEnd()));
  if (!missing.length) return target;
  const block = [];
  for (const l of lines) {
    if (l.trim() === '') {
      if (block.length && block[block.length - 1] !== '') block.push('');
      continue;
    }
    if (!have.has(l.trimEnd())) block.push(l);
  }
  while (block.length && block[block.length - 1] === '') block.pop();
  return `${target.replace(/\s*$/, '')}\n\n${block.join('\n')}\n`;
}

/** The non-blank source lines an append would add. */
export function appendMissing(target, source) {
  const have = new Set(String(target || '').split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim() !== ''));
  return source.split(/\r?\n/).filter((l) => l.trim() !== '' && !have.has(l.trimEnd()));
}

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** `merge-json`: objects key by key, arrays joined without exact duplicates, other values: the source wins. */
export function mergeJson(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    const seen = new Set(target.map((x) => JSON.stringify(x)));
    return target.concat(source.filter((x) => !seen.has(JSON.stringify(x))));
  }
  if (isObject(target) && isObject(source)) {
    const out = { ...target };
    for (const k of Object.keys(source)) out[k] = Object.prototype.hasOwnProperty.call(target, k) ? mergeJson(target[k], source[k]) : source[k];
    return out;
  }
  return source;
}

/** The dotted paths where `after` adds or changes something relative to `before`. */
export function jsonChanges(before, after, prefix = '') {
  const out = [];
  if (isObject(before) && isObject(after)) {
    for (const k of Object.keys(after)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if (!Object.prototype.hasOwnProperty.call(before, k)) out.push(`add ${p}`);
      else out.push(...jsonChanges(before[k], after[k], p));
    }
    return out;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    const seen = new Set(before.map((x) => JSON.stringify(x)));
    for (const x of after) if (!seen.has(JSON.stringify(x))) out.push(`add ${JSON.stringify(x)} to ${prefix}`);
    return out;
  }
  if (JSON.stringify(before) !== JSON.stringify(after)) out.push(`set ${prefix} to ${JSON.stringify(after)}`);
  return out;
}

function parseJsonTarget(text, target) {
  try {
    return JSON.parse(text);
  } catch (err) {
    const e = new Error(`${target} is not valid JSON (${err.message}), so it was left alone.`);
    e.conflict = true;
    throw e;
  }
}

// ------------------------------------------------------------------ sources

/** The source text for an entry, rendered when it is a template, with the per-computer additions. */
function sourceText(entry, ctx) {
  const key = `${entry.source}|${entry.template ? 'T' : ''}`;
  if (ctx.sourceCache.has(key)) return ctx.sourceCache.get(key);
  const file = path.join(ctx.pluginRoot, ...entry.source.split('/'));
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    throw new ToolkitError(EXIT.ERROR, `The scaffold file ${entry.source} is missing from the toolkit plugin (${err.message}).`, {
      fix: 'Reinstall or update the toolkit plugin.',
    });
  }
  const raw = text;
  if (entry.template) text = renderTemplate(text, ctx.config, { file: entry.source, today: ctx.today });
  text = withMachineAdditions(entry, text, ctx);
  const result = { text, raw };
  ctx.sourceCache.set(key, result);
  return result;
}

/**
 * Per-computer additions (ARCHITECTURE section 2): every claude-toolkit plugin
 * this computer has is turned off in the project, not only the ones the
 * fragment names.
 */
function withMachineAdditions(entry, text, ctx) {
  if (entry.source === 'templates/settings/claude-base.json') {
    const extra = ctx.claudeOldPlugins || [];
    if (!extra.length) return text;
    let obj;
    try {
      obj = JSON.parse(text);
    } catch {
      return text;
    }
    obj.enabledPlugins = obj.enabledPlugins || {};
    let added = false;
    for (const name of extra) {
      const id = `${name}@${OLD_MARKETPLACE}`;
      if (!Object.prototype.hasOwnProperty.call(obj.enabledPlugins, id)) {
        obj.enabledPlugins[id] = false;
        added = true;
      }
    }
    return added ? `${JSON.stringify(obj, null, 2)}\n` : text;
  }
  if (entry.source === 'templates/codex/config-base.toml') {
    const extra = (ctx.codexOldPlugins || []).filter((name) => !text.includes(`[plugins."${name}@${OLD_MARKETPLACE}"]`));
    if (!extra.length) return text;
    const blocks = extra.map((name) => `\n[plugins."${name}@${OLD_MARKETPLACE}"]\nenabled = false\n`).join('');
    return `${text.replace(/\n+$/, '\n')}${blocks}`;
  }
  return text;
}

// ------------------------------------------------------------------ plan

/**
 * Plan the manifest for a project.
 * @param {{ root, mainRoot, config }} project  config is the intended .toolkit.json
 * @param {{ mode?: 'init'|'sync', pluginRoot?: string, env?: object, today?: string,
 *           changedSettings?: Array<{ key, from, to }>, manifest?: object }} [opts]
 */
export function planManifest(project, opts = {}) {
  const mode = opts.mode || 'sync';
  const env = opts.env || process.env;
  const pluginRoot = opts.pluginRoot || DEFAULT_PLUGIN_ROOT;
  const manifest = opts.manifest || loadManifest(pluginRoot);
  const config = project.config || {};
  const installed = { ...((config && config.installed) || {}) };
  const ctx = {
    pluginRoot,
    config,
    today: opts.today || renderDate(config, env),
    sourceCache: new Map(),
    claudeOldPlugins: claudeOldPlugins(env),
    codexOldPlugins: codexOldPlugins(env),
  };

  const byTarget = new Map();
  for (const e of manifest.files) {
    if (!byTarget.has(e.target)) byTarget.set(e.target, []);
    byTarget.get(e.target).push(e);
  }

  const targets = [];
  for (const [target, all] of byTarget) {
    const entries = all.filter((e) => entryApplies(e, config));
    const abs = targetPath(target, project);
    const before = readOrNull(abs);
    const t = { target, abs, entries, before, after: null, action: 'none', record: false, would: [], conflicts: [], notes: [], template: entries.some((e) => e.template) };
    targets.push(t);
    if (!entries.length) {
      if (before !== null && installed[target]) t.action = 'leftover';
      continue;
    }
    const recorded = installed[target] || null;
    const currentHash = before === null ? null : sha256(hashText(target, before));
    const status = before === null ? 'missing' : !recorded ? 'untracked' : currentHash === recorded ? 'unchanged' : 'changed';
    t.status = status;

    if (GENERATORS[target]) {
      planGenerated(t, project, { mode, recorded });
      continue;
    }

    try {
      if (before !== null && status !== 'unchanged' && entries.some((e) => e.mode === 'agents-md') && !hasSpan(before)) {
        // An AGENTS.md without the span markers is kept; the Toolkit V2 version goes to the proposal file.
        t.action = 'propose';
        t.proposal = compute(entries, null, ctx, target).text;
        t.notes.push(`kept the project's AGENTS.md; the Toolkit V2 version is in ${PROPOSAL_PATH}`);
      } else if (status === 'missing') {
        t.after = compute(entries, null, ctx, target).text;
        t.action = 'install';
        t.record = true;
      } else if (status === 'unchanged') {
        t.after = compute(entries, before, ctx, target).text;
        t.action = sameText(target, t.after, before) ? 'same' : 'update';
        t.record = true;
      } else if (status === 'untracked' && entries.some((e) => e.mode === 'agents-md')) {
        // Both span markers are there (the case without them is a proposal, above).
        planAdoptedAgents(t, ctx, before);
      } else if (status === 'untracked' && mode === 'init') {
        planInitExisting(t, ctx, before);
      } else {
        planChanged(t, ctx, before, recorded, opts.changedSettings);
      }
    } catch (err) {
      if (err && err.conflict) {
        t.action = 'conflict';
        t.conflicts.push(err.message);
        t.after = null;
      } else {
        throw err;
      }
    }
  }

  // The rules span, built from the rule files as they will be after the writes.
  const agents = targets.find((t) => t.target === 'AGENTS.md');
  const rules = plannedRules(project, targets);
  const span = buildSpan(rules);
  if (agents) {
    const base = agents.after !== null ? agents.after : agents.before;
    if (base !== null && hasSpan(base) && agents.action !== 'propose' && agents.action !== 'conflict') {
      const filled = fillSpan(base, span);
      if (agents.after !== null) {
        agents.after = filled;
        if (agents.action === 'update' && filled === agents.before) agents.action = 'same';
      } else if (filled !== agents.before) {
        agents.after = filled;
        agents.spanOnly = true;
      }
      agents.spanChanged = agents.before === null || spanBody(agents.before) !== span;
    }
    if (agents.action === 'propose' && agents.proposal) agents.proposal = fillSpan(agents.proposal, span);
  }

  const directories = (manifest.directories || [])
    .filter((d) => conditionHolds(d.condition, config))
    .map((d) => ({ target: d.target, abs: targetPath(d.target, project), exists: fs.existsSync(targetPath(d.target, project)) }));

  // The installed map after the plan is applied.
  const nextInstalled = { ...installed };
  for (const t of targets) {
    if (!t.record) continue;
    const hash = t.recordHash || (t.after !== null ? sha256(hashText(t.target, t.after)) : null);
    if (hash) nextInstalled[t.target] = hash;
  }

  return {
    mode,
    project,
    today: ctx.today,
    targets,
    directories,
    span,
    rules: rules.map((r) => describeRule(r.name, r.text)),
    installed: nextInstalled,
    installedChanged: JSON.stringify(sortKeys(nextInstalled)) !== JSON.stringify(sortKeys(installed)),
    notReflected: targets.flatMap((t) => t.notReflected || []),
  };
}

function sortKeys(obj) {
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
}

/** AGENTS.md is compared without its span, which is filled in after the plan. */
function sameText(target, a, b) {
  if (a === null || b === null) return a === b;
  return hashText(target, a) === hashText(target, b);
}

function compute(entries, base, ctx, target) {
  let text = base;
  const would = [];
  for (const e of entries) {
    const { text: src } = sourceText(e, ctx);
    switch (e.mode) {
      case 'copy':
      case 'agents-md':
        text = src;
        break;
      case 'append': {
        would.push(...appendMissing(text, src).map((l) => `add the line "${l}"`));
        text = appendText(text, src);
        break;
      }
      case 'merge-json': {
        const current = text === null ? {} : parseJsonTarget(text, target);
        const incoming = JSON.parse(src);
        const merged = mergeJson(current, incoming);
        would.push(...jsonChanges(current, merged));
        if (text !== null && JSON.stringify(merged) === JSON.stringify(current)) break;
        text = `${JSON.stringify(merged, null, 2)}\n`;
        break;
      }
      case 'merge-toml': {
        const r = mergeToml(text, src);
        if (r.conflicts.length) {
          const err = new Error(`${target} sets ${r.conflicts.length === 1 ? 'a plugin switch' : 'plugin switches'} another way, so the toolkit left it alone: ${r.conflicts.join('; ')}.`);
          err.conflict = true;
          throw err;
        }
        would.push(...r.added.map((a) => `add ${a}`), ...r.replaced.map((a) => `set ${a}`));
        text = r.text;
        break;
      }
      default:
        throw new ToolkitError(EXIT.ERROR, `The scaffold manifest names an unknown install mode "${e.mode}" for ${e.target}.`);
    }
  }
  return { text, would };
}

function planGenerated(t, project, { mode, recorded }) {
  const text = GENERATORS[t.target](project);
  if (t.before === null) {
    t.after = text;
    t.action = 'install';
    t.record = true;
    return;
  }
  if (!recorded && mode === 'init') {
    t.action = 'keep';
    t.notes.push('kept the project\'s file');
    return;
  }
  if (!recorded) {
    t.action = 'changed';
    t.would.push(`it is generated: run toolkit index knowledge to rebuild it`);
    return;
  }
  // A generated file the toolkit owns is always rebuilt; hand edits are refused
  // by the PreToolUse hook. Its installed entry keeps the hash of the first
  // install, so rebuilding it never rewrites .toolkit.json.
  t.after = text;
  t.action = text === t.before ? 'same' : 'update';
  t.record = false;
}

/**
 * An AGENTS.md with both span markers and no `installed` entry: the owner
 * merged the Toolkit V2 proposal into the project's own AGENTS.md (or
 * .toolkit.json was set up again). The file is kept as it is and its span is
 * rebuilt. The hash recorded is that of the toolkit's own rendered version,
 * not of the merged file:
 * - when the file is the toolkit's version (apart from the span), it is
 *   "unchanged" from now on, so a later sync or `config set` renders it again;
 * - when it also holds the project's own text, it is "changed by the project"
 *   from now on, so no later sync replaces that text with the template.
 */
function planAdoptedAgents(t, ctx, before) {
  const fresh = compute(t.entries, null, ctx, t.target).text;
  t.action = 'adopt';
  t.record = true;
  t.recordHash = sha256(hashText(t.target, fresh));
  t.adoptedSame = sameText(t.target, fresh, before);
  t.notes.push(t.adoptedSame
    ? 'it is the Toolkit V2 version, so sync keeps all of it up to date from now on'
    : 'it also has the project\'s own text, so sync keeps only its rules list up to date and never replaces the rest');
}

function planInitExisting(t, ctx, before) {
  const modes = new Set(t.entries.map((e) => e.mode));
  if (modes.has('copy')) {
    t.action = 'keep';
    t.notes.push('kept the project\'s file');
    return;
  }
  const { text, would } = compute(t.entries, before, ctx, t.target);
  t.after = text;
  t.would = would;
  t.action = text === before ? 'same' : 'merge';
  t.record = true;
}

function planChanged(t, ctx, before, recorded, changedSettings) {
  t.action = 'changed';
  const modes = new Set(t.entries.map((e) => e.mode));
  if (modes.has('append') || modes.has('merge-json') || modes.has('merge-toml')) {
    const { text, would } = compute(t.entries, before, ctx, t.target);
    t.would = text === before ? [] : would;
  } else {
    const fresh = compute(t.entries, null, ctx, t.target).text;
    if (!recorded) t.would.push('the project had this file before the toolkit; the toolkit version was not installed');
    else if (sha256(hashText(t.target, fresh)) !== recorded) t.would.push('the toolkit\'s own version has changed since it was installed');
  }
  if (t.template && changedSettings && changedSettings.length) {
    const notes = [];
    for (const e of t.entries) {
      if (!e.template) continue;
      const reads = keysReadBy(sourceText(e, ctx).raw);
      for (const cond of [e.condition]) {
        if (cond === 'salesforce') reads.add('salesforce.enabled');
        if (cond === 'tracker:local') reads.add('tracker.type');
        if (cond && cond.startsWith('memory:')) reads.add('memory.type');
      }
      for (const s of changedSettings) {
        if (reads.has(s.key)) notes.push(`${t.target} was changed by the project, so it still describes ${s.key} ${formatValue(s.from)}. Update it by hand.`);
      }
    }
    t.notReflected = [...new Set(notes)];
  }
}

function formatValue(v) {
  if (v === undefined || v === null || v === '') return '(not set)';
  return Array.isArray(v) ? v.join(',') : String(v);
}

/** The project's rule files after the planned writes: [{ name, text }]. */
function plannedRules(project, targets) {
  const dir = path.join(project.root, '.claude', 'rules');
  const rules = new Map();
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if ((e.isFile() || e.isSymbolicLink()) && e.name.endsWith('.md')) {
        try {
          rules.set(e.name, fs.readFileSync(path.join(dir, e.name), 'utf8'));
        } catch {
          // Unreadable: left out.
        }
      }
    }
  } catch {
    // No rules folder yet.
  }
  for (const t of targets) {
    const m = /^\.claude\/rules\/([^/]+\.md)$/.exec(t.target);
    if (m && t.after !== null) rules.set(m[1], t.after);
  }
  return [...rules.entries()].map(([name, text]) => ({ name, text })).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

// ------------------------------------------------------------------ apply

/** True when applying the plan would write something. */
export function planWrites(plan) {
  return plan.targets.some((t) => t.after !== null && t.after !== t.before)
    || plan.targets.some((t) => t.action === 'propose')
    || plan.directories.some((d) => !d.exists);
}

function writeFile(abs, text) {
  try {
    atomicWrite(abs, text);
  } catch (err) {
    if (err && (err.code === 'EPERM' || err.code === 'EACCES' || err.code === 'EROFS')) {
      throw new ToolkitError(EXIT.ERROR, `Could not write ${abs}: ${err.message}.`, {
        path: abs,
        fix: 'In Codex, the sandbox protects .codex/ and folders outside this worktree: approve running the toolkit command outside the sandbox, then run it again. Nothing else needs undoing; the command is safe to run again.',
      });
    }
    throw err;
  }
}

/**
 * Write the plan. Returns { written: [{ target, action }], proposal, directories }.
 * Files are written first, then AGENTS.md, so its span matches the rule files.
 */
export function applyPlan(plan) {
  const written = [];
  const later = [];
  for (const t of plan.targets) {
    if (t.after === null || t.after === t.before) continue;
    if (t.target === 'AGENTS.md') {
      later.push(t);
      continue;
    }
    writeFile(t.abs, t.after);
    written.push({ target: t.target, action: t.action });
  }
  for (const t of later) {
    writeFile(t.abs, t.after);
    written.push({ target: t.target, action: t.spanOnly ? 'span' : t.action });
  }
  let proposal = null;
  const agents = plan.targets.find((t) => t.target === 'AGENTS.md' && t.action === 'propose');
  if (agents && agents.proposal) {
    proposal = path.join(plan.project.root, ...PROPOSAL_PATH.split('/'));
    writeFile(proposal, agents.proposal);
  }
  const directories = [];
  for (const d of plan.directories) {
    if (d.exists) continue;
    ensureDir(d.abs);
    directories.push(d.target);
  }
  return { written, proposal, directories };
}

/** Plain lines describing a plan (for init, sync, and sync --dry-run). */
export function planLines(plan, { applied = false } = {}) {
  const lines = [];
  const groups = {
    install: [], update: [], merge: [], span: [], keep: [], adopt: [], changed: [], propose: [], conflict: [], leftover: [],
  };
  for (const t of plan.targets) {
    if (t.action === 'install') groups.install.push(t);
    else if (t.action === 'update') groups.update.push(t);
    else if (t.action === 'merge') groups.merge.push(t);
    else if (t.action === 'keep') groups.keep.push(t);
    else if (t.action === 'adopt') groups.adopt.push(t);
    else if (t.action === 'changed') groups.changed.push(t);
    else if (t.action === 'propose') groups.propose.push(t);
    else if (t.action === 'conflict') groups.conflict.push(t);
    else if (t.action === 'leftover') groups.leftover.push(t);
    if (t.spanOnly) groups.span.push(t);
  }
  const list = (title, items, fmt = (t) => t.target) => {
    if (!items.length) return;
    lines.push(title);
    for (const t of items) lines.push(`  - ${fmt(t)}`);
  };
  if (groups.install.length > 12) {
    // A long list is shown by folder: "- .claude/rules/ (8 files)".
    const byFolder = new Map();
    for (const t of groups.install) {
      const parts = t.target.split('/');
      const folder = parts.length === 1 ? '(project folder)' : `${parts.slice(0, Math.min(2, parts.length - 1)).join('/')}/`;
      byFolder.set(folder, (byFolder.get(folder) || 0) + 1);
    }
    lines.push(`${applied ? 'Added' : 'Would add'} ${groups.install.length} files:`);
    for (const [folder, n] of byFolder) lines.push(`  - ${folder} (${n} file${n === 1 ? '' : 's'})`);
  } else {
    list(`${applied ? 'Added' : 'Would add'} ${groups.install.length} file${groups.install.length === 1 ? '' : 's'}:`, groups.install);
  }
  list(`${applied ? 'Updated' : 'Would update'} (the toolkit's copy, unchanged by the project):`, groups.update);
  list(`${applied ? 'Merged the toolkit\'s lines into' : 'Would merge the toolkit\'s lines into'} the project's files:`, groups.merge, (t) => `${t.target}${t.would.length ? `: ${t.would.join('; ')}` : ''}`);
  if (groups.span.length) lines.push(applied ? 'Rebuilt the rules list in AGENTS.md.' : 'Would rebuild the rules list in AGENTS.md.');
  list('Kept the project\'s own file (the toolkit never replaces it):', groups.keep, (t) => `${t.target}${t.notes.length ? ` (${t.notes.join('; ')})` : ''}`);
  list(applied ? 'Has the Toolkit V2 sections, so the toolkit now tracks it:' : 'Has the Toolkit V2 sections, so sync would start tracking it:', groups.adopt, (t) => `${t.target}: ${t.notes.join('; ')}`);
  list('Changed by the project, left alone:', groups.changed, (t) => `${t.target}${t.would.length ? `. The toolkit would: ${t.would.join('; ')}` : '. Nothing new from the toolkit.'}`);
  list('AGENTS.md has no Toolkit V2 sections:', groups.propose, () => `kept the project's AGENTS.md; the Toolkit V2 version is in ${PROPOSAL_PATH}. The project-setup skill merges it after the owner's yes.`);
  list('Could not merge:', groups.conflict, (t) => t.conflicts.join(' '));
  list('Left over from an earlier setup (not deleted; the owner decides):', groups.leftover);
  const dirs = plan.directories.filter((d) => !d.exists);
  if (dirs.length) lines.push(`${applied ? 'Created' : 'Would create'} folders: ${dirs.map((d) => d.target).join(', ')}.`);
  for (const n of plan.notReflected) lines.push(n);
  return lines;
}

/** A compact summary of a plan for JSON output. */
export function planSummary(plan) {
  const pick = (action) => plan.targets.filter((t) => t.action === action).map((t) => t.target);
  return {
    added: pick('install'),
    updated: pick('update'),
    merged: plan.targets.filter((t) => t.action === 'merge').map((t) => ({ target: t.target, changes: t.would })),
    kept: pick('keep'),
    adopted: pick('adopt'),
    unchanged: pick('same'),
    changedByProject: plan.targets.filter((t) => t.action === 'changed').map((t) => ({ target: t.target, toolkitWould: t.would })),
    proposals: pick('propose').length ? [PROPOSAL_PATH] : [],
    conflicts: plan.targets.filter((t) => t.action === 'conflict').map((t) => ({ target: t.target, message: t.conflicts.join(' ') })),
    leftovers: pick('leftover'),
    spanRebuilt: plan.targets.some((t) => t.target === 'AGENTS.md' && (t.spanOnly || t.spanChanged)),
    directories: plan.directories.filter((d) => !d.exists).map((d) => d.target),
    notReflected: plan.notReflected,
  };
}
