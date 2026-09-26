// File helpers. Every function here is synchronous, so a caller may use it
// with or without `await`.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { EXIT, ToolkitError } from './output.mjs';

/** Create a folder and its parents when missing. Returns the folder path. */
export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** True when the path exists (file, folder, or a link that resolves). */
export function exists(p) {
  try {
    fs.statSync(p);
    return true;
  } catch {
    return false;
  }
}

/** The file's text as UTF-8, or null when the file does not exist. */
export function readText(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) return null;
    throw err;
  }
}

/** Hex SHA-256 of a string or Buffer. Strings are hashed as UTF-8. */
export function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function resolveWriteTarget(p) {
  // Write through a symbolic link to the file it points to, so the link survives.
  try {
    const st = fs.lstatSync(p);
    if (st.isSymbolicLink()) return fs.realpathSync(p);
  } catch {
    // Missing file or dangling link: write at the given path.
  }
  return p;
}

/**
 * Write a file so that readers never see a half-written file: write a temp
 * file in the same folder, flush it, then rename it over the target.
 * New files get mode 0644; an existing file keeps its mode.
 * The file is read back afterwards; a mismatch throws "saved but not verified".
 * Returns the path written.
 */
export function atomicWrite(p, text, { verify = true } = {}) {
  const target = resolveWriteTarget(path.resolve(p));
  const dir = path.dirname(target);
  ensureDir(dir);

  let mode = 0o644;
  try {
    mode = fs.statSync(target).mode & 0o7777;
  } catch {
    // New file.
  }

  const data = typeof text === 'string' || Buffer.isBuffer(text) ? text : String(text);
  const tmp = path.join(dir, `.${path.basename(target)}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`);
  let fd;
  try {
    fd = fs.openSync(tmp, 'wx', 0o600);
    fs.writeFileSync(fd, data);
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = undefined;
    fs.chmodSync(tmp, mode);
    fs.renameSync(tmp, target);
  } catch (err) {
    if (fd !== undefined) {
      try { fs.closeSync(fd); } catch { /* already closed */ }
    }
    try { fs.unlinkSync(tmp); } catch { /* not created or already renamed */ }
    throw err;
  }

  if (verify) {
    const back = fs.readFileSync(target);
    const expected = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    if (!back.equals(expected)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${target} does not match what was written.`, { path: target });
    }
  }
  return target;
}

/**
 * List every file under `dir`, depth first, sorted by name at each level.
 * `skip(name, fullPath, dirent)` returning true leaves out that file or folder
 * (a skipped folder is not entered). Links to folders are not followed.
 * Returns absolute paths. A missing folder gives [].
 */
export function walk(dir, { skip } = {}) {
  const root = path.resolve(dir);
  const files = [];
  const visit = (current) => {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (err) {
      if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) return;
      throw err;
    }
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (skip && skip(entry.name, full, entry)) continue;
      if (entry.isDirectory()) {
        visit(full);
      } else if (entry.isFile()) {
        files.push(full);
      } else if (entry.isSymbolicLink()) {
        try {
          if (fs.statSync(full).isFile()) files.push(full);
        } catch {
          // Dangling link: leave it out.
        }
      }
    }
  };
  visit(root);
  return files;
}
