// `toolkit export --to <dir>` and `toolkit import --from <dir>` (critique I17):
// a backup of the two Git-ignored folders that exist on one computer only,
// the local tracker (.work-items/) and built-in memory (.memory/).
//
// Export folder layout:
//   work-items/...            a copy of .work-items/ (state file included, lock left out)
//   memory/...                a copy of .memory/ (lock left out)
//   toolkit-export.json       what was exported, from where, and when
//
// Hindsight and Notion memory are not in this backup: `toolkit memory export`
// covers every memory backend. The time of the last export is kept in
// <git common dir>/toolkit-v2/export.json for the doctor's backup warning.
//
// Import treats two kinds of file as state, not as the owner's content:
// the generated files (DASHBOARD.md, MEMORY.md), and .memory/.toolkit-meta.json
// (last save and last export times). The meta file is merged: the later time
// of each kind wins. The export writes its own time into that file after the
// copy, so without the merge every import into the same project would stop on it.

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { atomicWrite, ensureDir, sha256, walk } from '../core/fsx.mjs';
import { gitInfo } from '../core/config.mjs';
import { withLock } from '../core/lock.mjs';
import { run } from '../core/util.mjs';

export const EXPORT_MANIFEST = 'toolkit-export.json';
export const EXPORT_RECORD = 'export.json';

export const PART_NAMES = Object.freeze(['work-items', 'memory']);

const PARTS = [
  { name: 'work-items', dir: '.work-items', uses: (c) => ((c.tracker && c.tracker.type) || 'local') === 'local', generated: ['DASHBOARD.md'], state: '.toolkit-state.json', meta: null },
  { name: 'memory', dir: '.memory', uses: (c) => ((c.memory && c.memory.type) || 'builtin') === 'builtin', generated: ['MEMORY.md'], state: null, meta: '.toolkit-meta.json' },
];

function skipName(name) {
  return name === '.lock' || name.endsWith('.lock') || name.endsWith('.tmp') || name === '.DS_Store' || name.includes('.takeover');
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function rel(base, file) {
  return path.relative(base, file).split(path.sep).join('/');
}

/** Where the last export time is kept, or null outside Git. */
export function exportRecordPath(project) {
  const info = gitInfo(project.mainRoot || project.root);
  return info ? path.join(info.commonDir, 'toolkit-v2', EXPORT_RECORD) : null;
}

/** { lastExport, to } from the export record, or null. */
export function readExportRecord(project) {
  const file = exportRecordPath(project);
  if (!file) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function partsFor(config) {
  return PARTS.filter((p) => p.uses(config || {}));
}

/** Check an --only list: [] means every part. */
export function checkParts(only) {
  const list = (Array.isArray(only) ? only : only ? [only] : []).flatMap((v) => String(v).split(',')).map((v) => v.trim()).filter(Boolean);
  for (const name of list) {
    if (!PART_NAMES.includes(name)) {
      throw new ToolkitError(EXIT.INVALID, `"${name}" is not a part of a toolkit export. Use --only work-items or --only memory.`);
    }
  }
  return [...new Set(list)];
}

/** True when Git ignores files in a folder inside the repository at `root`. */
function gitIgnores(root, dir) {
  const r = rel(root, path.join(dir, EXPORT_MANIFEST));
  const res = run('git', ['check-ignore', '-q', '--', r], { cwd: root, timeoutMs: 5000 });
  return res.code === 0;
}

function time(v) {
  const t = Date.parse(v || '');
  return Number.isNaN(t) ? null : t;
}

/**
 * Merge two copies of .memory/.toolkit-meta.json: the project's copy wins,
 * except that the later last-save and the later last-export (each with the
 * fields that go with it) are kept. Returns text, or null when neither parses.
 */
export function mergeMemoryMeta(currentText, incomingText) {
  const parse = (t) => {
    try {
      const v = JSON.parse(t);
      return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  };
  const cur = parse(currentText);
  const inc = parse(incomingText);
  if (!cur && !inc) return null;
  if (!cur) return `${JSON.stringify(inc, null, 2)}\n`;
  if (!inc) return currentText;
  const out = { ...inc, ...cur };
  const later = (a, b) => (time(b) !== null && (time(a) === null || time(b) > time(a)));
  if (later(cur.lastSave, inc.lastSave)) {
    for (const k of ['lastSave', 'lastAction', 'lastKey']) if (k in inc) out[k] = inc[k];
  }
  if (later(cur.lastExport, inc.lastExport)) {
    for (const k of ['lastExport', 'lastExportTo']) if (k in inc) out[k] = inc[k];
  }
  return `${JSON.stringify(out, null, 2)}\n`;
}

function unsupported(config) {
  const tracker = (config.tracker && config.tracker.type) || 'local';
  const memory = (config.memory && config.memory.type) || 'builtin';
  return new ToolkitError(EXIT.UNSUPPORTED, `This project keeps work items in ${tracker} and memory in ${memory}, so there is no .work-items/ or .memory/ folder to back up.`, {
    fix: 'Use toolkit memory export --to <folder> to back up memory from any backend.',
  });
}

/**
 * Copy .work-items/ and .memory/ (the parts this project uses) to `toDir`.
 * Returns { dir, parts: [{ name, files }], manifest }.
 */
export async function exportProject(project, toDir, { now = () => new Date() } = {}) {
  const config = project.config || {};
  const parts = partsFor(config);
  if (!parts.length) throw unsupported(config);
  const mainRoot = project.mainRoot || project.root;
  const target = path.resolve(toDir);
  for (const p of parts) {
    if (isInside(target, path.join(mainRoot, p.dir))) {
      throw new ToolkitError(EXIT.INVALID, `The export folder ${target} is inside ${p.dir}/. Pick a folder outside it, for example one outside the project.`);
    }
  }
  // A folder inside the project that Git does not ignore would put the work
  // items and memory where they could be committed.
  for (const base of [...new Set([project.root, mainRoot])]) {
    if (isInside(target, base) && !gitIgnores(base, target)) {
      throw new ToolkitError(EXIT.INVALID, `The export folder ${target} is inside the project, and Git does not ignore it, so the work items and memory could be committed. Nothing was written.`, {
        fix: 'Pick a folder outside the project, for example ~/Backups/<project>.',
      });
    }
  }
  if (fs.existsSync(target)) {
    if (!fs.statSync(target).isDirectory()) throw new ToolkitError(EXIT.INVALID, `${target} is a file, not a folder.`);
    const names = fs.readdirSync(target);
    if (names.length && !names.includes(EXPORT_MANIFEST)) {
      throw new ToolkitError(EXIT.INVALID, `${target} already has files and is not an earlier toolkit export, so nothing was written.`, {
        fix: 'Give a new or empty folder, or the folder of an earlier toolkit export.',
      });
    }
  }
  ensureDir(target);
  const result = [];
  const files = [];
  const copyPart = async (p) => {
    const src = path.join(mainRoot, p.dir);
    const dest = path.join(target, p.name);
    fs.rmSync(dest, { recursive: true, force: true });
    const list = fs.existsSync(src) ? walk(src, { skip: (name) => skipName(name) }) : [];
    for (const file of list) {
      const r = rel(src, file);
      const out = path.join(dest, ...r.split('/'));
      ensureDir(path.dirname(out));
      fs.copyFileSync(file, out);
      files.push(`${p.name}/${r}`);
    }
    result.push({ name: p.name, from: `${p.dir}/`, files: list.length });
  };
  // Each folder is copied under its own lock, so the copy is never half-written.
  for (const p of parts) {
    const src = path.join(mainRoot, p.dir);
    if (fs.existsSync(src)) await withLock(src, () => copyPart(p), { name: '.lock' });
    else await copyPart(p);
  }
  const manifest = {
    toolkit: 'toolkit-v2',
    kind: 'project-export',
    schema: 1,
    project: { name: config.project && config.project.name, key: config.project && config.project.key },
    exportedAt: now().toISOString(),
    from: mainRoot,
    parts: result,
    files: files.sort(),
  };
  atomicWrite(path.join(target, EXPORT_MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  const recordFile = exportRecordPath(project);
  if (recordFile) {
    try {
      atomicWrite(recordFile, `${JSON.stringify({ lastExport: manifest.exportedAt, to: target, parts: result.map((r) => r.name) }, null, 2)}\n`);
    } catch {
      // The export itself is done.
    }
  }
  if (parts.some((p) => p.name === 'memory')) {
    try {
      const { createDriver } = await import('../memory/builtin.mjs');
      const driver = await createDriver({ root: project.root, mainRoot });
      await driver.markExport(target);
    } catch {
      // Only the memory status line depends on it.
    }
  }
  return { dir: target, parts: result, manifest };
}

function readManifest(dir) {
  const file = path.join(dir, EXPORT_MANIFEST);
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    throw new ToolkitError(EXIT.INVALID, `${dir} is not a toolkit export: ${EXPORT_MANIFEST} is missing or unreadable.`, {
      fix: 'Give the folder that toolkit export --to wrote. A memory-only backup goes back with toolkit memory import --from <folder>.',
    });
  }
  if (!manifest || manifest.kind !== 'project-export') {
    throw new ToolkitError(EXIT.INVALID, `${dir} is not a toolkit project export.`, { fix: 'A memory-only backup goes back with toolkit memory import --from <folder>.' });
  }
  return manifest;
}

/** True when a state file holds no items yet (a fresh tracker). */
function emptyState(text) {
  try {
    const s = JSON.parse(text);
    return !(Number.isInteger(s.highWater) && s.highWater > 0) && !Object.keys(s.items || {}).length;
  } catch {
    return false;
  }
}

/**
 * Restore an export into this project's .work-items/ and .memory/.
 * A file already there is replaced only when it is identical, generated, a
 * seed the project never changed, or an empty state file; any other
 * difference is a conflict, and nothing is written unless `replace` is true.
 * Returns { parts, written, same, conflicts, skipped, dryRun }.
 */
export async function importProject(project, fromDir, { dryRun = false, replace = false, only = [], env, pluginRoot } = {}) {
  const config = project.config || {};
  const mainRoot = project.mainRoot || project.root;
  const source = path.resolve(fromDir);
  const manifest = readManifest(source);
  const wanted = checkParts(only);
  const installed = config.installed || {};
  const plan = [];
  const conflicts = [];
  const same = [];
  const skipped = [];
  for (const p of PARTS) {
    const src = path.join(source, p.name);
    if (wanted.length && !wanted.includes(p.name)) continue;
    if (!fs.existsSync(src)) {
      if (wanted.includes(p.name)) skipped.push(`${p.name}/: the export has no ${p.name}/ folder.`);
      continue;
    }
    if (!p.uses(config)) {
      skipped.push(`${p.name}/: this project does not keep ${p.dir}/ (it uses another ${p.name === 'memory' ? 'memory backend' : 'tracker'}).`);
      continue;
    }
    for (const file of walk(src, { skip: (name) => skipName(name) })) {
      const r = rel(src, file);
      const dest = path.join(mainRoot, p.dir, ...r.split('/'));
      const incoming = fs.readFileSync(file);
      let current = null;
      try {
        current = fs.readFileSync(dest);
      } catch {
        current = null;
      }
      const label = `${p.dir}/${r}`;
      if (current === null) {
        plan.push({ dest, data: incoming, label });
      } else if (current.equals(incoming)) {
        same.push(label);
      } else if (p.meta === r) {
        const merged = mergeMemoryMeta(current.toString('utf8'), incoming.toString('utf8'));
        if (merged === null || merged === current.toString('utf8')) same.push(label);
        else plan.push({ dest, data: merged, label, merged: true });
      } else {
        const text = current.toString('utf8');
        const seedUnchanged = installed[label] && installed[label] === sha256(text);
        const generated = p.generated.includes(r);
        const freshState = p.state === r && emptyState(text);
        if (seedUnchanged || generated || freshState || replace) plan.push({ dest, data: incoming, label, replaced: true });
        else conflicts.push(label);
      }
    }
  }
  if (conflicts.length && !replace) {
    throw new ToolkitError(EXIT.INVALID, `The export and this project both have different versions of ${conflicts.length} file${conflicts.length === 1 ? '' : 's'}, so nothing was imported: ${conflicts.slice(0, 10).join(', ')}${conflicts.length > 10 ? ', ...' : ''}.`, {
      conflicts,
      fix: 'Compare them first. To overwrite the project\'s copies with the export, run the import again with --replace (after the owner\'s yes).',
    });
  }
  if (!dryRun && plan.length) {
    const byDir = new Map();
    for (const item of plan) {
      const dir = item.label.startsWith('.work-items/') ? path.join(mainRoot, '.work-items') : path.join(mainRoot, '.memory');
      if (!byDir.has(dir)) byDir.set(dir, []);
      byDir.get(dir).push(item);
    }
    for (const [dir, items] of byDir) {
      ensureDir(dir);
      await withLock(dir, () => {
        for (const item of items) atomicWrite(item.dest, item.data);
      }, { name: '.lock' });
    }
    if (partsFor(config).some((p) => p.name === 'work-items') && plan.some((i) => i.label.startsWith('.work-items/'))) {
      const { openTracker } = await import('../work/driver.mjs');
      const tracker = await openTracker(project, { env, cwd: project.root, pluginRoot });
      await tracker.sync({ quick: false });
    }
    if (plan.some((i) => i.label.startsWith('.memory/'))) {
      const { reindexVault } = await import('../memory/builtin.mjs');
      await reindexVault(mainRoot);
    }
  }
  return {
    from: source,
    exportedAt: manifest.exportedAt,
    exportedFrom: manifest.from,
    parts: wanted.length ? wanted : PARTS.filter((p) => p.uses(config)).map((p) => p.name),
    written: plan.map((i) => i.label),
    replaced: plan.filter((i) => i.replaced).map((i) => i.label),
    merged: plan.filter((i) => i.merged).map((i) => i.label),
    same,
    conflicts,
    skipped,
    dryRun,
  };
}
