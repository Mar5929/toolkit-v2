import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { atomicWrite, readText, exists, sha256, walk, ensureDir } from '../../lib/core/fsx.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FSX_URL = pathToFileURL(path.resolve(HERE, '../../lib/core/fsx.mjs')).href;

const made = [];
after(() => {
  for (const dir of made) fs.rmSync(dir, { recursive: true, force: true });
});

function tempDir() {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'toolkit-fsx-')));
  made.push(dir);
  return dir;
}

test('atomicWrite creates a file with mode 0644 and parent folders', () => {
  const dir = tempDir();
  const file = path.join(dir, 'a', 'b', 'note.md');
  const written = atomicWrite(file, 'hello\n');
  assert.equal(written, file);
  assert.equal(fs.readFileSync(file, 'utf8'), 'hello\n');
  assert.equal(fs.statSync(file).mode & 0o777, 0o644);
  assert.deepEqual(fs.readdirSync(path.dirname(file)), ['note.md'], 'no temp file left behind');
});

test('atomicWrite gives mode 0644 even under a strict umask', () => {
  const dir = tempDir();
  const file = path.join(dir, 'strict.txt');
  const script = `const { atomicWrite } = await import(${JSON.stringify(FSX_URL)}); process.umask(0o077); atomicWrite(${JSON.stringify(file)}, 'x');`;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--input-type=module', '--no-deprecation', '-e', script], { stdio: 'inherit' });
    child.on('close', (code) => {
      try {
        assert.equal(code, 0);
        assert.equal(fs.statSync(file).mode & 0o777, 0o644);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
});

test('atomicWrite replaces content and keeps the mode of an existing file', () => {
  const dir = tempDir();
  const script = path.join(dir, 'run.sh');
  fs.writeFileSync(script, '#!/bin/sh\necho old\n');
  fs.chmodSync(script, 0o755);
  atomicWrite(script, '#!/bin/sh\necho new\n');
  assert.equal(fs.readFileSync(script, 'utf8'), '#!/bin/sh\necho new\n');
  assert.equal(fs.statSync(script).mode & 0o777, 0o755);
});

test('atomicWrite writes Buffers and unicode text exactly', () => {
  const dir = tempDir();
  const bin = Buffer.from([0, 1, 2, 255]);
  atomicWrite(path.join(dir, 'bin.dat'), bin);
  assert.deepEqual(fs.readFileSync(path.join(dir, 'bin.dat')), bin);
  const text = 'café — “quotes” 😀\n';
  atomicWrite(path.join(dir, 'u.txt'), text);
  assert.equal(readText(path.join(dir, 'u.txt')), text);
});

test('atomicWrite through a symbolic link updates the target and keeps the link', () => {
  const dir = tempDir();
  const target = path.join(dir, 'real.txt');
  const link = path.join(dir, 'link.txt');
  fs.writeFileSync(target, 'one');
  fs.symlinkSync(target, link);
  atomicWrite(link, 'two');
  assert.equal(fs.lstatSync(link).isSymbolicLink(), true);
  assert.equal(fs.readFileSync(target, 'utf8'), 'two');
});

test('atomicWrite cleans up its temp file when the rename fails', () => {
  const dir = tempDir();
  const target = path.join(dir, 'folder');
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, 'inside'), 'x');
  assert.throws(() => atomicWrite(target, 'text'));
  assert.deepEqual(fs.readdirSync(dir), ['folder'], 'no temp file left behind');
});

test('readers never see a half-written file', async () => {
  const dir = tempDir();
  const file = path.join(dir, 'big.txt');
  const a = 'A'.repeat(2 * 1024 * 1024);
  const b = 'B'.repeat(3 * 1024 * 1024);
  atomicWrite(file, a);
  const writer = `const { atomicWrite } = await import(${JSON.stringify(FSX_URL)});
const a = 'A'.repeat(${a.length}); const b = 'B'.repeat(${b.length});
for (let i = 0; i < 40; i++) atomicWrite(${JSON.stringify(file)}, i % 2 ? a : b);`;
  const child = spawn(process.execPath, ['--input-type=module', '-e', writer], { stdio: 'inherit' });
  const done = new Promise((resolve) => child.on('close', resolve));
  let finished = false;
  done.then(() => { finished = true; });
  let reads = 0;
  while (!finished) {
    const text = fs.readFileSync(file, 'utf8');
    assert.ok(text === a || text === b, `read ${text.length} characters that are neither version`);
    reads++;
    await new Promise((r) => setImmediate(r));
  }
  assert.equal(await done, 0);
  assert.ok(reads > 0);
  assert.deepEqual(fs.readdirSync(dir), ['big.txt']);
});

test('readText, exists, ensureDir', () => {
  const dir = tempDir();
  assert.equal(readText(path.join(dir, 'missing.txt')), null);
  assert.equal(readText(path.join(dir, 'missing', 'deeper.txt')), null);
  fs.writeFileSync(path.join(dir, 'file'), 'x');
  assert.equal(readText(path.join(dir, 'file', 'under-a-file')), null);
  assert.throws(() => readText(dir), /EISDIR/);
  assert.equal(exists(dir), true);
  assert.equal(exists(path.join(dir, 'file')), true);
  assert.equal(exists(path.join(dir, 'nope')), false);
  const made = ensureDir(path.join(dir, 'x', 'y'));
  assert.equal(fs.statSync(made).isDirectory(), true);
  ensureDir(made);
});

test('sha256 of text and Buffers', () => {
  assert.equal(sha256(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert.equal(sha256('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(sha256(Buffer.from('abc')), sha256('abc'));
  assert.equal(sha256('café'), sha256(Buffer.from('café', 'utf8')));
});

test('walk lists files depth first in name order, and skip leaves folders out', () => {
  const dir = tempDir();
  for (const rel of ['b.md', 'a/2.md', 'a/1.md', 'a/_skip/x.md', '.git/config', 'c/d/e.md']) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), rel);
  }
  fs.symlinkSync(path.join(dir, 'a'), path.join(dir, 'link-to-a'));
  fs.symlinkSync(path.join(dir, 'b.md'), path.join(dir, 'link-to-b.md'));
  fs.symlinkSync(path.join(dir, 'gone.md'), path.join(dir, 'dangling.md'));
  const seen = [];
  const files = walk(dir, {
    skip: (name, full, entry) => {
      seen.push([name, typeof full, typeof entry.isDirectory]);
      return name === '.git' || name.startsWith('_');
    },
  }).map((f) => path.relative(dir, f));
  assert.deepEqual(files, ['a/1.md', 'a/2.md', 'b.md', 'c/d/e.md', 'link-to-b.md']);
  assert.ok(seen.every(([, full, fn]) => full === 'string' && fn === 'function'));
  assert.deepEqual(walk(path.join(dir, 'missing')), []);
  assert.equal(walk(dir).length, 7);
});
