// Copy project memory to a folder of Markdown files and back, for any backend.
//
// An export folder has the same layout as the built-in .memory/ folder:
//   <key>.md                       records in use, and superseded records
//   archive/<key>.md               archived records (retired with no replacement)
//   CURRENT_FOCUS.md               the current focus (when there is one)
//   terminology-glossary.md        the glossary (when there is one)
//   toolkit-memory-export.json     what was exported, from where, and when
// so it doubles as a backup and as the way to move memory between backends.

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { atomicWrite, ensureDir, readText } from '../core/fsx.mjs';
import { parseRecord, storedStatus, validateFocus, validateGlossary } from './contract.mjs';

export const MANIFEST_FILE = 'toolkit-memory-export.json';
const FOCUS_FILE = 'CURRENT_FOCUS.md';
const GLOSSARY_FILE = 'terminology-glossary.md';
const RECORD_FILE_RE = /^((?:user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)*)\.md$/;

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

/**
 * Write every record (all statuses), the focus, and the glossary to `dir`.
 * The folder must be new, empty, or an earlier export (whose listed files are
 * replaced). Returns { dir, records, retired, focus, glossary, manifest }.
 */
export async function exportMemory(driver, dir, { now = () => new Date(), forbidden = [] } = {}) {
  const target = path.resolve(dir);
  for (const f of forbidden) {
    if (f && isInside(target, path.resolve(f))) {
      throw new ToolkitError(EXIT.INVALID, `The export folder ${target} is inside ${f}. Pick a folder outside the memory folder.`);
    }
  }
  let previous = null;
  if (fs.existsSync(target)) {
    if (!fs.statSync(target).isDirectory()) throw new ToolkitError(EXIT.INVALID, `${target} is a file, not a folder.`);
    const names = fs.readdirSync(target);
    if (names.length) {
      const manifestText = readText(path.join(target, MANIFEST_FILE));
      if (manifestText === null) {
        throw new ToolkitError(EXIT.INVALID, `${target} already has files and is not an earlier memory export, so nothing was written.`, {
          fix: 'Give a new or empty folder.',
        });
      }
      try {
        previous = JSON.parse(manifestText);
      } catch {
        previous = { files: [] };
      }
    }
  }
  ensureDir(target);
  const summaries = await driver.list({ status: 'all' });
  const files = [];
  let retired = 0;
  for (const s of summaries) {
    const rec = await driver.get(s.key);
    if (!rec) continue;
    // Archived records go to archive/ (superseded ones stay beside the others), as in built-in memory.
    const archived = storedStatus(rec) === 'archived';
    const relPath = archived ? path.join('archive', `${rec.key}.md`) : `${rec.key}.md`;
    if (rec.status === 'retired') retired++;
    atomicWrite(path.join(target, relPath), rec.text);
    files.push(relPath);
  }
  const focus = await driver.focusGet();
  if (focus.text) {
    atomicWrite(path.join(target, FOCUS_FILE), focus.text);
    files.push(FOCUS_FILE);
  }
  const glossary = await driver.glossaryGet();
  if (glossary.text) {
    atomicWrite(path.join(target, GLOSSARY_FILE), glossary.text);
    files.push(GLOSSARY_FILE);
  }
  if (previous && Array.isArray(previous.files)) {
    for (const old of previous.files) {
      if (typeof old !== 'string' || files.includes(old)) continue;
      const full = path.resolve(target, old);
      if (isInside(full, target)) fs.rmSync(full, { force: true });
    }
  }
  const manifest = {
    schema: 1,
    exportedAt: now().toISOString(),
    backend: driver.backend,
    from: driver.location,
    records: summaries.length,
    retired,
    files,
  };
  atomicWrite(path.join(target, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
  if (typeof driver.markExport === 'function') await driver.markExport(target);
  return { dir: target, records: summaries.length, retired, focus: Boolean(focus.text), glossary: Boolean(glossary.text), manifest };
}

/** The record files of an export folder: [{ key, file }]. */
export function exportFiles(dir) {
  const out = [];
  for (const [sub, where] of [['', 'active'], ['archive', 'archive']]) {
    let names = [];
    try {
      names = fs.readdirSync(path.join(dir, sub));
    } catch {
      continue;
    }
    for (const name of names.sort()) {
      const m = RECORD_FILE_RE.exec(name);
      if (m) out.push({ key: m[1], file: path.join(dir, sub, name), where });
    }
  }
  return out;
}

/**
 * Save every record, the focus, and the glossary from an export folder (or a
 * .memory folder) into the driver. Existing records with the same key are
 * replaced. A file that breaks a rule is skipped and reported; the rest are
 * saved. dryRun: check only. Returns { imported, skipped, focus, glossary }.
 */
export async function importMemory(driver, dir, { dryRun = false } = {}) {
  const source = path.resolve(dir);
  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    throw new ToolkitError(EXIT.INVALID, `${source} is not a folder.`);
  }
  const imported = [];
  const skipped = [];
  const seen = new Set();
  for (const { key, file } of exportFiles(source)) {
    if (seen.has(key)) {
      skipped.push({ file, problem: `is a second copy of ${key}.` });
      continue;
    }
    seen.add(key);
    const text = readText(file);
    const { record, problems } = parseRecord(text, key);
    if (record.status === 'template') continue;
    if (problems.length) {
      skipped.push({ file, problem: problems.join(' ') });
      continue;
    }
    if (!dryRun) {
      try {
        await driver.save(record);
      } catch (err) {
        skipped.push({ file, problem: err.message });
        continue;
      }
    }
    imported.push(key);
  }
  let focus = false;
  const focusText = readText(path.join(source, FOCUS_FILE));
  if (focusText !== null && focusText.trim()) {
    const problems = validateFocus(focusText);
    if (problems.length) skipped.push({ file: path.join(source, FOCUS_FILE), problem: problems.join(' ') });
    else {
      if (!dryRun) await driver.focusSet(focusText);
      focus = true;
    }
  }
  let glossary = false;
  const glossaryText = readText(path.join(source, GLOSSARY_FILE));
  if (glossaryText !== null && glossaryText.trim() && !validateGlossary(glossaryText).length) {
    if (!dryRun) await driver.glossarySet(glossaryText);
    glossary = true;
  }
  return { from: source, imported, skipped, focus, glossary, dryRun };
}
