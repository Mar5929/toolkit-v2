import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../../lib/core/args.mjs';
import { EXIT } from '../../lib/core/output.mjs';

const plain = (flags) => JSON.parse(JSON.stringify(flags));

test('--flag value, --flag=value, and positionals', () => {
  const { _, flags } = parseArgs(['new', '--title', 'Fix login', '--type=bug', 'extra'], { string: ['title', 'type'] });
  assert.deepEqual(_, ['new', 'extra']);
  assert.deepEqual(plain(flags), { title: 'Fix login', type: 'bug' });
});

test('boolean flags never take the next word', () => {
  const { _, flags } = parseArgs(['list', '--all', 'WI-001', '--tree'], { boolean: ['all', 'tree'] });
  assert.deepEqual(_, ['list', 'WI-001']);
  assert.deepEqual(plain(flags), { all: true, tree: true });
});

test('boolean flags with explicit values and --no-', () => {
  const spec = { boolean: ['dry-run', 'verify'] };
  assert.equal(parseArgs(['--dry-run=false'], spec).flags['dry-run'], false);
  assert.equal(parseArgs(['--dry-run=yes'], spec).flags['dry-run'], true);
  assert.equal(parseArgs(['--no-verify'], spec).flags.verify, false);
  assert.throws(() => parseArgs(['--verify=maybe'], spec), (err) => err.code === EXIT.INVALID);
  // --no-x for a flag that is not a declared boolean is its own flag.
  assert.equal(parseArgs(['--no-cache'], spec).flags['no-cache'], true);
});

test('json and help are always boolean', () => {
  const { _, flags } = parseArgs(['show', '--json', 'WI-004', '--help']);
  assert.deepEqual(_, ['show', 'WI-004']);
  assert.equal(flags.json, true);
  assert.equal(flags.help, true);
});

test('repeated flags become arrays; declared arrays are always arrays', () => {
  assert.deepEqual(parseArgs(['--tag', 'a', '--tag=b', '--tag', 'c']).flags.tag, ['a', 'b', 'c']);
  assert.deepEqual(parseArgs(['--tag', 'a'], { array: ['tag'] }).flags.tag, ['a']);
  assert.deepEqual(parseArgs([], { array: ['tag'] }).flags.tag, []);
  assert.deepEqual(parseArgs(['--v', '--v'], { boolean: ['v'] }).flags.v, [true, true]);
});

test('undeclared flags: value when one follows, else true', () => {
  const { _, flags } = parseArgs(['--under', 'WI-002', '--force', '--size', '-1', 'pos']);
  assert.equal(flags.under, 'WI-002');
  assert.equal(flags.force, true);
  assert.equal(flags.size, true, 'a word starting with - is not taken as a value');
  assert.deepEqual(_, ['-1', 'pos']);
});

test('declared string flags take the next word even when it starts with -', () => {
  const { flags } = parseArgs(['--note', '-- not a flag --', '--offset', '-3'], { string: ['note', 'offset'] });
  assert.equal(flags.note, '-- not a flag --');
  assert.equal(flags.offset, '-3');
  assert.throws(() => parseArgs(['--title'], { string: ['title'] }), (err) => err.code === EXIT.INVALID && /--title needs a value/.test(err.message));
});

test('values may contain = and spaces; empty values are kept', () => {
  const { flags } = parseArgs(['--set=a=b', '--body=', '--why', 'because it is'], { string: ['why'] });
  assert.equal(flags.set, 'a=b');
  assert.equal(flags.body, '');
  assert.equal(flags.why, 'because it is');
});

test('-- ends the flags', () => {
  const { _, flags } = parseArgs(['--json', '--', '--not-a-flag', '-x']);
  assert.deepEqual(_, ['--not-a-flag', '-x']);
  assert.deepEqual(plain(flags), { json: true });
});

test('short names, aliases, grouped booleans', () => {
  const spec = { boolean: ['all', 'verbose'], string: ['title'], alias: { a: 'all', v: 'verbose', t: 'title' } };
  assert.deepEqual(plain(parseArgs(['-t', 'Hello', '-av'], spec).flags), { title: 'Hello', all: true, verbose: true });
  assert.deepEqual(plain(parseArgs(['-t=Hi'], spec).flags), { title: 'Hi' });
  assert.deepEqual(parseArgs(['-x'], spec).flags.x, true);
  assert.throws(() => parseArgs(['-t'], spec), (err) => err.code === EXIT.INVALID);
});

test('node:util style spec', () => {
  const spec = {
    title: { type: 'string', short: 't' },
    all: { type: 'boolean', default: false },
    tag: { type: 'string', multiple: true },
    stage: 'string',
    tree: 'boolean',
  };
  const { _, flags } = parseArgs(['-t', 'X', '--tag', 'a', '--tree', 'rest', '--stage', '03-requirements-approved'], spec);
  assert.deepEqual(_, ['rest']);
  assert.deepEqual(plain(flags), { title: 'X', tag: ['a'], tree: true, stage: '03-requirements-approved', all: false });
  const wrapped = parseArgs(['--all', 'x'], { options: { all: { type: 'boolean' } } });
  assert.deepEqual(wrapped._, ['x']);
});

test('defaults apply only when the flag is missing', () => {
  const spec = { string: ['priority'], default: { priority: 'medium' } };
  assert.equal(parseArgs([], spec).flags.priority, 'medium');
  assert.equal(parseArgs(['--priority', 'high'], spec).flags.priority, 'high');
});

test('strict mode rejects unknown flags', () => {
  const spec = { boolean: ['all'], strict: true };
  assert.throws(() => parseArgs(['--all', '--bogus', 'x', '-q'], spec), (err) => {
    assert.equal(err.code, EXIT.INVALID);
    assert.match(err.message, /--bogus/);
    assert.match(err.message, /-q/);
    return true;
  });
  assert.doesNotThrow(() => parseArgs(['--all', '--json'], spec));
  assert.throws(() => parseArgs(['--x'], { strict: true, title: 'string' }), (err) => err.code === EXIT.INVALID);
  assert.doesNotThrow(() => parseArgs(['--title', 'y'], { strict: true, title: 'string' }));
});

test('camelCase reads work for dashed names but are not listed', () => {
  const { flags } = parseArgs(['--dry-run', '--waiting-on', 'owner'], { boolean: ['dry-run'] });
  assert.equal(flags.dryRun, true);
  assert.equal(flags.waitingOn, 'owner');
  assert.deepEqual(Object.keys(flags), ['dry-run', 'waiting-on']);
});

test('prototype names are refused', () => {
  assert.throws(() => parseArgs(['--__proto__', 'x']), (err) => err.code === EXIT.INVALID);
  assert.equal({}.x, undefined);
});

test('no arguments, no spec, numbers as positionals', () => {
  assert.deepEqual(parseArgs(), { _: [], flags: {} });
  assert.deepEqual(parseArgs(['-5', '7']), { _: ['-5', '7'], flags: {} });
  assert.deepEqual(parseArgs([3, 'x']), { _: ['3', 'x'], flags: {} });
});
