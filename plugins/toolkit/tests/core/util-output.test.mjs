import { test } from 'node:test';
import assert from 'node:assert/strict';
import { today, nowIso, slugify, run } from '../../lib/core/util.mjs';
import { EXIT, ToolkitError, isToolkitError, out, fail } from '../../lib/core/output.mjs';

function sink() {
  const s = { text: '', write(chunk) { s.text += chunk; return true; } };
  return s;
}

test('today() is the local date as YYYY-MM-DD', () => {
  const d = new Date();
  const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const value = today();
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
  // Allow for the test running across midnight.
  assert.ok(value === expected || value > expected);
  assert.equal(today(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(today(new Date(2026, 11, 31, 0, 1)), '2026-12-31');
});

test('nowIso() is an ISO time in UTC', () => {
  assert.match(nowIso(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  assert.equal(nowIso(new Date(Date.UTC(2026, 8, 26, 14, 3))), '2026-09-26T14:03:00.000Z');
});

test('slugify', () => {
  assert.equal(slugify('Fix the Login Page!'), 'fix-the-login-page');
  assert.equal(slugify('  Café crème   brûlée  '), 'cafe-creme-brulee');
  assert.equal(slugify("Mike's “big” idea"), 'mikes-big-idea');
  assert.equal(slugify('WI-007: Add sub-items'), 'wi-007-add-sub-items');
  assert.equal(slugify('---'), '');
  assert.equal(slugify(''), '');
  assert.equal(slugify(null), '');
  assert.equal(slugify(42), '42');
  const long = slugify('Build the Notion tracker driver with markdown conversion both ways');
  assert.ok(long.length <= 40, long);
  assert.equal(long, 'build-the-notion-tracker-driver-with');
  assert.equal(slugify('abcdefghijklmnopqrstuvwxyz', 10), 'abcdefghij');
  assert.equal(slugify('one two three four', 9), 'one-two');
  assert.ok(!slugify('word '.repeat(20), 12).endsWith('-'));
});

test('run: success, failure, input, cwd, missing program, timeout', () => {
  const ok = run(process.execPath, ['-e', 'process.stdout.write("out"); process.stderr.write("err")']);
  assert.deepEqual({ code: ok.code, stdout: ok.stdout, stderr: ok.stderr }, { code: 0, stdout: 'out', stderr: 'err' });

  assert.equal(run(process.execPath, ['-e', 'process.exit(3)']).code, 3);

  const echoed = run(process.execPath, ['-e', 'process.stdin.pipe(process.stdout)'], { input: 'piped text' });
  assert.equal(echoed.stdout, 'piped text');

  const where = run(process.execPath, ['-e', 'process.stdout.write(process.cwd())'], { cwd: '/' });
  assert.equal(where.stdout, '/');

  const missing = run('definitely-not-a-real-program-xyz', []);
  assert.equal(missing.code, 127);
  assert.match(missing.stderr, /not found/);

  const slow = run(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'], { timeoutMs: 200 });
  assert.equal(slow.code, 124);
  assert.equal(slow.timedOut, true);

  const env = run(process.execPath, ['-e', 'process.stdout.write(process.env.TK_TEST || "")'], { env: { ...process.env, TK_TEST: 'yes' } });
  assert.equal(env.stdout, 'yes');
});

test('EXIT codes', () => {
  assert.deepEqual({ ...EXIT }, { OK: 0, ERROR: 1, INVALID: 2, UNSUPPORTED: 3, NOT_PROJECT: 4 });
  assert.equal(Object.isFrozen(EXIT), true);
});

test('ToolkitError carries code, message, and details', () => {
  const err = new ToolkitError(EXIT.UNSUPPORTED, 'GitHub Issues has no driver.', { fix: 'Read the instructions.' });
  assert.ok(err instanceof Error);
  assert.equal(err.name, 'ToolkitError');
  assert.equal(err.code, 3);
  assert.equal(err.message, 'GitHub Issues has no driver.');
  assert.deepEqual(err.details, { fix: 'Read the instructions.' });
  assert.deepEqual(JSON.parse(JSON.stringify(err)), { code: 3, message: 'GitHub Issues has no driver.', details: { fix: 'Read the instructions.' } });
  assert.equal(new ToolkitError(99, 'odd code').code, EXIT.ERROR);
  assert.equal(isToolkitError(err), true);
  assert.equal(isToolkitError(new Error('x')), false);
});

test('out() prints text, or JSON with --json', () => {
  const stdout = sink();
  out({ stdout }, 'Saved WI-001.', { id: 'WI-001' });
  assert.equal(stdout.text, 'Saved WI-001.\n');

  const lines = sink();
  out({ stdout: lines }, ['one', 'two']);
  assert.equal(lines.text, 'one\ntwo\n');

  const quiet = sink();
  out({ stdout: quiet }, '');
  assert.equal(quiet.text, '');

  const json = sink();
  out({ stdout: json, json: true }, 'Saved WI-001.', { id: 'WI-001', ok: true });
  assert.deepEqual(JSON.parse(json.text), { id: 'WI-001', ok: true });

  const noData = sink();
  out({ stdout: noData, json: true }, 'Just text');
  assert.deepEqual(JSON.parse(noData.text), { text: 'Just text' });
});

test('fail() prints the error, returns its code, and records it on ctx', () => {
  const stderr = sink();
  const ctx = { stderr, stdout: sink() };
  const code = fail(ctx, new ToolkitError(EXIT.NOT_PROJECT, 'Not a project.', { fix: 'Run toolkit init.' }));
  assert.equal(code, 4);
  assert.equal(ctx.exitCode, 4);
  assert.equal(stderr.text, 'Error: Not a project.\nFix: Run toolkit init.\n');
  assert.equal(ctx.stdout.text, '');

  const jsonCtx = { json: true, stdout: sink(), stderr: sink() };
  assert.equal(fail(jsonCtx, new ToolkitError(EXIT.INVALID, 'Bad stage.', { stage: '99' })), 2);
  assert.deepEqual(JSON.parse(jsonCtx.stdout.text), { ok: false, error: { code: 2, message: 'Bad stage.', details: { stage: '99' } } });
  assert.equal(jsonCtx.stderr.text, '');

  const plainErr = { stderr: sink(), env: {} };
  assert.equal(fail(plainErr, new Error('surprise')), 1);
  assert.equal(plainErr.stderr.text, 'Unexpected error: surprise\n');

  const debug = { stderr: sink(), env: { TOOLKIT_DEBUG: '1' } };
  fail(debug, new Error('with stack'));
  assert.match(debug.stderr.text, /at /);

  const unexpectedJson = { json: true, stdout: sink() };
  fail(unexpectedJson, new TypeError('bad'));
  assert.deepEqual(JSON.parse(unexpectedJson.stdout.text), { ok: false, error: { code: 1, message: 'bad', unexpected: true } });
});
