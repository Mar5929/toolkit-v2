import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify, update, needsQuotes } from '../../lib/core/frontmatter.mjs';
import { walk } from '../../lib/core/fsx.mjs';
import { EXIT } from '../../lib/core/output.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN = path.resolve(HERE, '..', '..');
const MODEL_PROJECT = '/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project';
const MODEL_TEMPLATE = path.join(MODEL_PROJECT, '.work-items', 'work-item-template', 'WORK-ITEM.md');
const hasModel = fs.existsSync(MODEL_TEMPLATE);

test('model WORK-ITEM.md: parse reads every key in order', { skip: !hasModel && 'model project not found' }, () => {
  const text = fs.readFileSync(MODEL_TEMPLATE, 'utf8');
  const { data, body, hasFrontmatter } = parse(text);
  assert.equal(hasFrontmatter, true);
  assert.deepEqual(Object.keys(data), ['id', 'title', 'type', 'status', 'stage', 'active_phase', 'requirements_status', 'design']);
  assert.equal(data.id, 'WI-001');
  assert.equal(data.title, '<Work item title>');
  assert.equal(data.status, '<Backlog | In Progress | Blocked | Done>');
  assert.equal(data.active_phase, 'P1');
  assert.equal(data.requirements_status, 'refining');
  assert.equal(data.design, '<Link to design, if one exists>');
  assert.ok(body.startsWith('\n# WI-001: <Work item title>\n'));
  assert.equal(text.endsWith(body), true);
});

test('model WORK-ITEM.md: stringify(parse(text)) gives the same bytes', { skip: !hasModel && 'model project not found' }, () => {
  const text = fs.readFileSync(MODEL_TEMPLATE, 'utf8');
  const { data, body } = parse(text);
  assert.equal(stringify(data, body), text);
});

test('model WORK-ITEM.md: a fresh object (no remembered style) also gives the same bytes', { skip: !hasModel && 'model project not found' }, () => {
  const text = fs.readFileSync(MODEL_TEMPLATE, 'utf8');
  const { data, body } = parse(text);
  assert.equal(stringify({ ...data }, body), text);
});

test('model WORK-ITEM.md: changing one key changes only that line', { skip: !hasModel && 'model project not found' }, () => {
  const text = fs.readFileSync(MODEL_TEMPLATE, 'utf8');
  const { data, body } = parse(text);
  data.stage = '01-discovery';
  data.title = 'Fix login: "remember me" box';
  data.updated = '2026-09-26';
  const next = stringify(data, body);
  const before = text.split('\n');
  const after = next.split('\n');
  assert.equal(after.length, before.length + 1, 'one new line for the new key');
  assert.equal(after[2], 'title: "Fix login: \\"remember me\\" box"');
  assert.equal(after[5], 'stage: 01-discovery');
  assert.equal(after[9], 'updated: 2026-09-26');
  assert.equal(after[10], '---');
  const again = parse(next);
  assert.equal(again.data.title, 'Fix login: "remember me" box');
  assert.equal(again.data.updated, '2026-09-26');
  assert.equal(again.body, body);
  assert.deepEqual(Object.keys(again.data).slice(-1), ['updated']);
});

test('model WORK-ITEM.md: removing a key removes its line', { skip: !hasModel && 'model project not found' }, () => {
  const text = fs.readFileSync(MODEL_TEMPLATE, 'utf8');
  const { data, body } = parse(text);
  delete data.active_phase;
  const next = stringify(data, body);
  assert.equal(next.includes('active_phase'), false);
  assert.equal(next, text.replace('active_phase: P1\n', ''));
});

test('update() patches keys in place and removes undefined ones', { skip: !hasModel && 'model project not found' }, () => {
  const text = fs.readFileSync(MODEL_TEMPLATE, 'utf8');
  const next = update(text, { status: 'In Progress', active_phase: undefined, parent: 'none' });
  const { data } = parse(next);
  assert.equal(data.status, 'In Progress');
  assert.equal('active_phase' in data, false);
  assert.equal(data.parent, 'none');
  assert.deepEqual(Object.keys(data), ['id', 'title', 'type', 'status', 'stage', 'requirements_status', 'design', 'parent']);
});

test('every frontmatter file in the model project round-trips exactly', { skip: !hasModel && 'model project not found' }, () => {
  const files = walk(MODEL_PROJECT, { skip: (name) => name === '.git' || name === 'node_modules' })
    .filter((f) => f.endsWith('.md'));
  let checked = 0;
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const parsed = parse(text);
    if (!parsed.hasFrontmatter) continue;
    checked++;
    assert.equal(stringify(parsed.data, parsed.body), text, `round trip of ${path.relative(MODEL_PROJECT, file)}`);
  }
  assert.ok(checked >= 5, `expected several frontmatter files, found ${checked}`);
});

test('model rule and memory files: block lists and nested maps', { skip: !hasModel && 'model project not found' }, () => {
  const rule = parse(fs.readFileSync(path.join(MODEL_PROJECT, '.claude/rules/production-data.md'), 'utf8'));
  assert.deepEqual(rule.data.paths, ['delivery/data/**', 'engagement/data/**']);
  const memory = parse(fs.readFileSync(path.join(MODEL_PROJECT, '.memory/project_topic_template.md'), 'utf8'));
  assert.deepEqual(memory.data.metadata, { type: 'project' });
  assert.equal(memory.data.supersedes, 'none');
  const style = parse(fs.readFileSync(path.join(MODEL_PROJECT, '.claude/output-styles/plain-english.md'), 'utf8'));
  assert.equal(style.data['keep-coding-instructions'], true);
});

test('plugin templates round-trip when they exist', () => {
  for (const name of ['WORK-ITEM.md', 'DESIGN.md']) {
    const file = path.join(PLUGIN, 'templates', name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const { data, body } = parse(text);
    assert.equal(stringify(data, body), text, name);
  }
});

test('text without frontmatter', () => {
  assert.deepEqual(parse('# Title\n\nBody\n'), { data: {}, body: '# Title\n\nBody\n', hasFrontmatter: false });
  assert.deepEqual(parse(''), { data: {}, body: '', hasFrontmatter: false });
  assert.deepEqual(parse(null), { data: {}, body: '', hasFrontmatter: false });
  // Unclosed block: not frontmatter.
  const unclosed = '---\nid: WI-001\n# Title\n';
  assert.deepEqual(parse(unclosed), { data: {}, body: unclosed, hasFrontmatter: false });
  // A horizontal rule later in the file is not frontmatter.
  const rule = 'Intro\n---\nMore\n';
  assert.equal(parse(rule).hasFrontmatter, false);
  // stringify with no keys gives the body alone.
  assert.equal(stringify({}, 'Body\n'), 'Body\n');
  assert.equal(stringify(null, 'Body\n'), 'Body\n');
});

test('empty frontmatter block, closing with ..., and closing at end of file', () => {
  const empty = parse('---\n---\nBody\n');
  assert.equal(empty.hasFrontmatter, true);
  assert.deepEqual(empty.data, {});
  assert.equal(empty.body, 'Body\n');
  assert.equal(stringify(empty.data, empty.body), '---\n---\nBody\n');

  const dots = parse('---\na: 1\n...\nBody');
  assert.deepEqual(dots.data, { a: 1 });
  assert.equal(dots.body, 'Body');
  assert.equal(stringify(dots.data, dots.body), '---\na: 1\n...\nBody');

  const atEnd = parse('---\na: b\n---');
  assert.deepEqual(atEnd.data, { a: 'b' });
  assert.equal(atEnd.body, '');
  assert.equal(stringify(atEnd.data, atEnd.body), '---\na: b\n---');
});

test('scalar types', () => {
  const { data } = parse([
    '---',
    'text: hello world',
    'empty:',
    'tilde: ~',
    'nul: null',
    'yes_bool: true',
    'no_bool: False',
    'int: 42',
    'neg: -7',
    'float: 3.5',
    'padded: 007',
    'version: 1.2.3',
    'date: 2026-09-26',
    'big: 12345678901234567890',
    'yesword: yes',
    'url: https://example.com/a#b',
    'time: 10:30',
    'dq: "a \\"quoted\\" \\\\ value\\n"',
    "sq: 'it''s'",
    'unicode: café — ok',
    'hash_in: C#',
    'comment: kept # dropped',
    '---',
    '',
  ].join('\n'));
  assert.deepEqual(data, {
    text: 'hello world',
    empty: null,
    tilde: null,
    nul: null,
    yes_bool: true,
    no_bool: false,
    int: 42,
    neg: -7,
    float: 3.5,
    padded: '007',
    version: '1.2.3',
    date: '2026-09-26',
    big: '12345678901234567890',
    yesword: 'yes',
    url: 'https://example.com/a#b',
    time: '10:30',
    dq: 'a "quoted" \\ value\n',
    sq: "it's",
    unicode: 'café — ok',
    hash_in: 'C#',
    comment: 'kept',
  });
});

test('lists: inline, block, same-indent block, lists of maps, nested lists', () => {
  const { data } = parse([
    '---',
    'inline: [a, "b, c", 3, true, [x, y]]',
    'empty_list: []',
    'block:',
    '  - one',
    '  - "two: quoted"',
    '  # a comment between items',
    '  - three',
    'flush:',
    '- left',
    '- right',
    'people:',
    '  - name: Mike',
    '    role: owner',
    '  - name: Agent',
    '    role: builder',
    'nested:',
    '  - - a',
    '    - b',
    '  - c',
    'map: {a: 1, b: "two", c: [x]}',
    '---',
    '',
  ].join('\n'));
  assert.deepEqual(data.inline, ['a', 'b, c', 3, true, ['x', 'y']]);
  assert.deepEqual(data.empty_list, []);
  assert.deepEqual(data.block, ['one', 'two: quoted', 'three']);
  assert.deepEqual(data.flush, ['left', 'right']);
  assert.deepEqual(data.people, [{ name: 'Mike', role: 'owner' }, { name: 'Agent', role: 'builder' }]);
  assert.deepEqual(data.nested, [['a', 'b'], 'c']);
  assert.deepEqual(data.map, { a: 1, b: 'two', c: ['x'] });
});

test('nested maps and block text', () => {
  const text = [
    '---',
    'metadata:',
    '  type: project',
    '  owner:',
    '    name: Mike',
    'literal: |',
    '  line one',
    '    indented',
    '',
    '  line three',
    'folded: >-',
    '  a folded',
    '  paragraph',
    '',
    '  second',
    'after: done',
    '---',
    'Body',
  ].join('\n');
  const { data, body } = parse(text);
  assert.deepEqual(data.metadata, { type: 'project', owner: { name: 'Mike' } });
  assert.equal(data.literal, 'line one\n  indented\n\nline three\n');
  assert.equal(data.folded, 'a folded paragraph\nsecond');
  assert.equal(data.after, 'done');
  assert.equal(body, 'Body');
  assert.equal(stringify(data, body), text);
});

test('multi-line plain and quoted values', () => {
  const { data } = parse('---\ndescription: a long line\n  that continues\ntitle: "quoted and\n  folded"\n---\n');
  assert.equal(data.description, 'a long line that continues');
  assert.equal(data.title, 'quoted and folded');
});

test('comments are not data, and survive a round trip on unchanged keys', () => {
  const text = '---\n# About this record\nid: WI-002 # the id\n\nstatus: Ready\n# trailing note\n---\nBody\n';
  const { data, body } = parse(text);
  assert.deepEqual(data, { id: 'WI-002', status: 'Ready' });
  assert.equal(stringify(data, body), text);
  data.id = 'WI-003';
  assert.equal(stringify(data, body), '---\n# About this record\nid: WI-003\n\nstatus: Ready\n# trailing note\n---\nBody\n');
});

test('stringify quotes exactly the strings that need quotes, and parse reads them back', () => {
  const values = {
    plain: 'Simple words',
    placeholder: '<Backlog | In Progress | Done>',
    empty: '',
    yes: 'yes',
    truth: 'true',
    nil: 'null',
    number: '123',
    float: '1.5',
    leadingZero: '007',
    colon: 'a: b',
    endsColon: 'label:',
    hash: 'Fix #12',
    startHash: '#tag',
    dash: '- item',
    bracket: '[not a list]',
    brace: '{not: map}',
    star: '*bold*',
    quote: '"already"',
    single: "'single'",
    leading: '  spaced',
    trailing: 'spaced  ',
    newline: 'line one\nline two',
    tab: 'a\tb',
    unicode: 'naïve — “quotes”',
    dashes: '---',
    date: '2026-09-26',
    percent: '%complete',
    at: '@mention',
    backtick: '`code`',
    pipe: '| table',
    greater: '> quote',
    question: '? what',
    url: 'https://example.com/x?y=1#z',
  };
  const text = stringify(values, '');
  const back = parse(text).data;
  assert.deepEqual(back, values);
  const lines = Object.fromEntries(text.split('\n').filter((l) => l.includes(': ') || l.endsWith(':')).map((l) => {
    const idx = l.indexOf(':');
    return [l.slice(0, idx), l.slice(idx + 2)];
  }));
  assert.equal(lines.plain, 'Simple words');
  assert.equal(lines.placeholder, '<Backlog | In Progress | Done>');
  assert.equal(lines.date, '2026-09-26');
  assert.equal(lines.url, 'https://example.com/x?y=1#z');
  assert.equal(lines.unicode, 'naïve — “quotes”');
  assert.equal(lines.yes, '"yes"');
  assert.equal(lines.number, '"123"');
  assert.equal(lines.hash, '"Fix #12"');
  assert.equal(lines.newline, '"line one\\nline two"');
  assert.equal(needsQuotes('Simple words'), false);
  assert.equal(needsQuotes('a, b'), false);
  assert.equal(needsQuotes('a, b', true), true);
});

test('stringify writes keys in the given order, with lists and maps', () => {
  const data = {
    zeta: 1,
    alpha: 'a',
    tags: ['x', 'needs, quote', 2],
    none: [],
    nothing: null,
    skipped: undefined,
    meta: { type: 'project', flags: { on: true } },
    empty: {},
    people: [{ name: 'Mike', role: 'owner' }, 'plain'],
    long: Array.from({ length: 30 }, (_, i) => `item-${i}`),
  };
  const text = stringify(data, 'Body\n');
  assert.ok(text.startsWith('---\nzeta: 1\nalpha: a\ntags: [x, "needs, quote", 2]\nnone: []\nnothing:\nmeta:\n  type: project\n  flags:\n    on: true\nempty: {}\npeople:\n  - name: Mike\n    role: owner\n  - plain\nlong:\n  - item-0\n'));
  assert.ok(text.endsWith('  - item-29\n---\nBody\n'));
  const back = parse(text).data;
  const expected = { ...data };
  delete expected.skipped;
  assert.deepEqual(back, expected);
});

test('round trip of generated data with awkward values', () => {
  const data = {
    id: 'WI-010',
    title: 'Colon: here, # hash, "quotes" and \'apostrophes\'',
    list: ['a: b', '#c', '', null, false, 0, -1.25, 'x\ny'],
    nested: { deeper: { list: [{ k: 'v' }] } },
    control: 'bell\x07char',
  };
  const text = stringify(data, '');
  assert.deepEqual(parse(text).data, data);
  assert.equal(stringify(parse(text).data, parse(text).body), text);
});

test('CRLF files keep their line endings', () => {
  const text = '---\r\nid: WI-001\r\ntitle: Test\r\n---\r\nBody\r\n';
  const { data, body } = parse(text);
  assert.deepEqual(data, { id: 'WI-001', title: 'Test' });
  assert.equal(body, 'Body\r\n');
  assert.equal(stringify(data, body), text);
  data.title = 'Changed';
  assert.equal(stringify(data, body), '---\r\nid: WI-001\r\ntitle: Changed\r\n---\r\nBody\r\n');
});

test('a byte order mark is ignored', () => {
  const { data, hasFrontmatter } = parse('\ufeff---\na: b\n---\n');
  assert.equal(hasFrontmatter, true);
  assert.deepEqual(data, { a: 'b' });
});

test('changing a nested value rewrites only that key', () => {
  const text = '---\npaths:\n  - "a/**"\n  - "b/**"\nname: rule\n---\n';
  const { data, body } = parse(text);
  assert.equal(stringify(data, body), text);
  data.paths.push('c/**');
  assert.equal(stringify(data, body), '---\npaths: [a/**, b/**, c/**]\nname: rule\n---\n');
});

test('malformed frontmatter throws a validation error with the line number', () => {
  const cases = [
    ['---\nid: WI-001\njust words\n---\n', 3],
    ['---\n  indented: first\n---\n', 2],
    ['---\nlist: [a, b\n---\n', 2],
    ['---\ntitle: "unclosed\n---\n', 2],
    ['---\n__proto__: x\n---\n', 2],
    ['---\nkey: "a" trailing\n---\n', 2],
  ];
  for (const [text, line] of cases) {
    assert.throws(() => parse(text), (err) => {
      assert.equal(err.code, EXIT.INVALID, text);
      assert.equal(err.details.line, line, text);
      assert.match(err.message, /Frontmatter line/);
      return true;
    });
  }
  assert.throws(() => stringify(['a'], ''), (err) => err.code === EXIT.INVALID);
});

test('prototype keys are never set on the data object', () => {
  const { data } = parse('---\nsafe: 1\n---\n');
  assert.equal(Object.getPrototypeOf(data), Object.prototype);
  assert.throws(() => update('---\na: 1\n---\n', JSON.parse('{"__proto__": {"polluted": true}}')), (err) => err.code === EXIT.INVALID);
  assert.equal({}.polluted, undefined);
});
