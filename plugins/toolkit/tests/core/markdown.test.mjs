import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  splitSections, flattenSections, getSection, replaceSection,
  parseTable, renderTable, appendTableRow, replaceTable, normalizeHeading,
} from '../../lib/core/markdown.mjs';
import { parse, stringify } from '../../lib/core/frontmatter.mjs';
import { EXIT } from '../../lib/core/output.mjs';

const MODEL_TEMPLATE = '/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project/.work-items/work-item-template/WORK-ITEM.md';
const hasModel = fs.existsSync(MODEL_TEMPLATE);
const skip = !hasModel && 'model project not found';
const modelBody = () => parse(fs.readFileSync(MODEL_TEMPLATE, 'utf8')).body;

function outline(nodes, depth = 0) {
  return nodes.flatMap((n) => [`${'  '.repeat(depth)}${n.level} ${n.heading}`, ...outline(n.children, depth + 1)]);
}

test('model WORK-ITEM.md: section tree', { skip }, () => {
  const body = modelBody();
  const tree = splitSections(body);
  assert.deepEqual(outline(tree), [
    '1 WI-001: <Work item title>',
    '  2 Overview',
    '  2 Roadmap',
    '  2 Tasks',
    '    3 P1 — <Phase 1 name>',
    '    3 P2 — <Phase 2 name>',
    '  2 Recent History',
    '  2 Open Questions',
    '  2 Requirements',
    '    3 Starting request',
    '    3 Agreed goal',
    '    3 Active requirements',
    '      4 R-01 — <Required outcome>',
    '      4 R-02 — <Required outcome>',
    '    3 Acceptance',
    '  2 Notes',
    '    3 Decisions and context',
    '    3 Resume here',
    '    3 Solution options and considerations',
  ]);
  // Offsets and text agree with the body.
  for (const node of flattenSections(tree)) {
    assert.equal(body.slice(node.start, node.end), node.text);
    assert.equal(body.slice(node.contentStart, node.end), node.content);
    assert.ok(node.text.startsWith('#'.repeat(node.level) + ' '));
    assert.equal(body.split('\n')[node.line - 1], node.text.split('\n')[0]);
  }
  // The root view of the tree.
  assert.equal(tree.level, 0);
  assert.equal(tree.text, body);
  assert.equal(tree.children, tree);
  assert.equal(tree.preamble, '\n');
  // Sibling sections tile the parent with no gaps.
  const top = tree[0];
  assert.equal(top.children[0].start, top.contentStart + 1);
  top.children.forEach((child, i) => {
    if (i > 0) assert.equal(child.start, top.children[i - 1].end);
  });
  assert.equal(top.children[top.children.length - 1].end, body.length);
});

test('model WORK-ITEM.md: getSection by name, level, path, and prefix', { skip }, () => {
  const body = modelBody();
  const overview = getSection(body, 'Overview');
  assert.equal(overview.level, 2);
  assert.match(overview.content, /^\n\*\*Goal:\*\* <The outcome/);
  assert.ok(overview.content.endsWith('<Roadmap, parent work item, design, or external links.>\n\n'));
  assert.equal(getSection(body, '## Overview').start, overview.start);
  assert.equal(getSection(body, '  overview ').start, overview.start);
  assert.equal(getSection(body, 'Overview', { level: 3 }), null);
  assert.equal(getSection(body, 'Nope'), null);

  const r01 = getSection(body, ['Requirements', 'R-01'], { match: 'prefix' });
  assert.equal(r01.heading, 'R-01 — <Required outcome>');
  assert.equal(getSection(body, 'R-01', { match: 'prefix' }).start, r01.start);
  assert.equal(getSection(body, 'R-0', { match: 'prefix' }), null, 'prefix must end at a word boundary');
  assert.equal(getSection(body, 'Requirements > Active requirements').heading, 'Active requirements');
  assert.equal(getSection(body, ['Notes', 'Starting request']), null, 'path parts must nest');
  assert.equal(getSection(body, 'Tasks').children.length, 2);
});

test('model WORK-ITEM.md: replaceSection changes only that section', { skip }, () => {
  const body = modelBody();
  const newOverview = [
    '**Goal:** Ship the login fix.',
    '',
    '**Current position:** Requirements drafted.',
    '',
    '**Next action:** owner reviews R-01.',
    '',
    '**Blockers:** None.',
    '',
    '**Related items:** WI-002',
  ].join('\n');
  const next = replaceSection(body, 'Overview', newOverview);
  assert.equal(getSection(next, 'Overview').content, `\n${newOverview}\n\n`);
  // Every other level-2 section is byte for byte the same.
  const before = splitSections(body)[0].children;
  const after = splitSections(next)[0].children;
  assert.equal(after.length, before.length);
  before.forEach((sec, i) => {
    if (sec.heading === 'Overview') return;
    assert.equal(after[i].text, sec.text, sec.heading);
  });
  // The text around the section is unchanged.
  const old = getSection(body, 'Overview');
  assert.equal(next.slice(0, old.start), body.slice(0, old.start));
  assert.ok(next.endsWith(body.slice(old.end)));
});

test('model WORK-ITEM.md: replacing a section with its own content changes nothing', { skip }, () => {
  const body = modelBody();
  for (const node of flattenSections(splitSections(body))) {
    const path = node.heading;
    assert.equal(replaceSection(body, path, node.content, { level: node.level }), body, `content of ${path}`);
    assert.equal(replaceSection(body, path, node.content.trim(), { level: node.level }), body, `trimmed content of ${path}`);
    assert.equal(replaceSection(body, path, node.text, { level: node.level }), body, `whole text of ${path}`);
  }
});

test('model WORK-ITEM.md: replacing a parent section replaces its sub-sections', { skip }, () => {
  const body = modelBody();
  const next = replaceSection(body, 'Requirements', '**Overall status:** Finalized  \nAll approved.');
  assert.equal(getSection(next, 'Starting request'), null);
  assert.equal(getSection(next, 'R-01', { match: 'prefix' }), null);
  assert.equal(getSection(next, 'Requirements').content, '\n**Overall status:** Finalized  \nAll approved.\n\n');
  assert.ok(getSection(next, 'Notes'));
  assert.ok(getSection(next, 'Open Questions'));
});

test('model WORK-ITEM.md: the last section, a renamed heading, and a missing section', { skip }, () => {
  const body = modelBody();
  const last = replaceSection(body, 'Solution options and considerations', 'None yet.');
  assert.ok(last.endsWith('### Solution options and considerations\n\nNone yet.\n'));
  assert.equal(last.slice(0, getSection(body, 'Solution options and considerations').start),
    body.slice(0, getSection(body, 'Solution options and considerations').start));

  const renamed = replaceSection(body, 'Resume here', '### Resume from here\n\nStart at P1-T01.');
  assert.equal(getSection(renamed, 'Resume here'), null);
  assert.equal(getSection(renamed, 'Resume from here').content, '\nStart at P1-T01.\n\n');

  assert.throws(() => replaceSection(body, 'No such section', 'x'), (err) => err.code === EXIT.INVALID && /No such section/.test(err.message));
  const created = replaceSection(body, 'Evidence', 'Test output here.', { create: true });
  assert.ok(created.startsWith(body));
  assert.ok(created.endsWith('\n\n## Evidence\n\nTest output here.\n'));
  assert.equal(getSection(created, 'Evidence').level, 2);
});

test('model WORK-ITEM.md: add a Recent History row and write the file back', { skip }, () => {
  const text = fs.readFileSync(MODEL_TEMPLATE, 'utf8');
  const { data, body } = parse(text);
  const history = getSection(body, 'Recent History');
  const content = appendTableRow(history.content, ['2026-09-26', 'Work item created', 'Discovery starts'], { dropPlaceholderRows: true });
  const nextBody = replaceSection(body, 'Recent History', content);
  const table = parseTable(getSection(nextBody, 'Recent History').content);
  assert.deepEqual(table.headers, ['Date', 'Change or decision', 'Effect on the work']);
  assert.deepEqual(table.rows, [['2026-09-26', 'Work item created', 'Discovery starts']]);
  data.stage = '01-discovery';
  const file = stringify(data, nextBody);
  const again = parse(file);
  assert.equal(again.data.stage, '01-discovery');
  assert.equal(getSection(again.body, 'Open Questions').text, getSection(body, 'Open Questions').text);
  assert.equal(file.length - text.length, '| 2026-09-26 | Work item created | Discovery starts |'.length
    - '| <YYYY-MM-DD> | <What happened> | <What changed or what happens next> |'.length
    + '01-discovery'.length - '<Current lifecycle stage>'.length);
});

test('model WORK-ITEM.md: tables parse and render back to the same text', { skip }, () => {
  const body = modelBody();
  for (const name of ['Roadmap', 'Recent History', 'Open Questions']) {
    const section = getSection(body, name);
    const table = parseTable(section.content);
    assert.equal(table.found, true, name);
    assert.equal(renderTable(table.headers, table.rows), section.content.slice(table.start, table.end), name);
    assert.equal(replaceTable(section.content, table.headers, table.rows), section.content, name);
  }
  const questions = parseTable(getSection(body, 'Open Questions').content);
  assert.deepEqual(questions.headers, ['ID', 'Question', 'Affects', 'Status', 'Decision needed from']);
  assert.deepEqual(questions.objects[0], {
    ID: 'Q-01', Question: '<Specific unanswered question>', Affects: 'R-01, P1-T02', Status: 'Open', 'Decision needed from': '<Person or role>',
  });
  const roadmap = parseTable(getSection(body, 'Roadmap').content);
  assert.equal(roadmap.rows.length, 2);
  assert.equal(roadmap.rows[0][0], 'P1 — <Phase 1 name>');
});

test('headings inside fenced code are not sections', () => {
  const body = '# Title\n\n```md\n# Not a heading\n## Also not\n```\n\n~~~\n## Nope\n~~~\n\n## Real\n\ntext\n';
  assert.deepEqual(outline(splitSections(body)), ['1 Title', '  2 Real']);
  assert.equal(getSection(body, 'Also not'), null);
  const next = replaceSection(body, 'Title', 'Replaced.');
  assert.equal(next, '# Title\n\nReplaced.\n');
});

test('heading forms: closing hashes, extra spaces, no space after #, and #hashtags', () => {
  const body = '## Closed ##\n\na\n\n##NotAHeading\n\n###   Spaced   out  \n\nb\n\n#hashtag line\n';
  const nodes = flattenSections(splitSections(body));
  assert.deepEqual(nodes.map((n) => [n.level, n.heading]), [[2, 'Closed'], [3, 'Spaced   out']]);
  assert.equal(getSection(body, 'spaced out').level, 3);
  assert.equal(normalizeHeading('  Spaced \t OUT '), 'spaced out');
  assert.equal(splitSections('no headings\n').preamble, 'no headings\n');
});

test('replaceSection keeps the spacing a file already uses, and CRLF endings', () => {
  const body = '## A\n\none\n\n## B\ntwo\n';
  assert.equal(replaceSection(body, 'A', '\n\n  first\n\n\n'), '## A\n\n  first\n\n## B\ntwo\n');
  assert.equal(replaceSection(body, 'A', ''), '## A\n\n## B\ntwo\n');
  assert.equal(replaceSection(body, 'B', 'three'), '## A\n\none\n\n## B\nthree\n', 'no blank line after B, as before');
  const wide = '# T\n\n\n## A\n\n\nold\n\n\n## B\n\nx\n\n';
  assert.equal(replaceSection(wide, 'A', 'new'), '# T\n\n\n## A\n\n\nnew\n\n\n## B\n\nx\n\n');
  assert.equal(replaceSection(wide, 'B', 'y'), '# T\n\n\n## A\n\n\nold\n\n\n## B\n\ny\n\n');
  assert.equal(replaceSection('## A\n\nold', 'A', 'new'), '## A\n\nnew', 'no newline at the end stays that way');
  assert.equal(replaceSection('## A\n\n## B\n', 'A', 'filled'), '## A\n\nfilled\n\n## B\n', 'an empty section gets one blank line each side');
  const index = '## User\n\n\n## Feedback\n\n\n';
  assert.equal(replaceSection(index, 'User', ''), index, 'an empty section stays as it was');
  assert.equal(replaceSection(index, 'Feedback', '   \n'), index);
  const crlf = '## A\r\n\r\none\r\n\r\n## B\r\n\r\ntwo\r\n';
  assert.equal(replaceSection(crlf, 'A', 'uno\ndos'), '## A\r\n\r\nuno\r\ndos\r\n\r\n## B\r\n\r\ntwo\r\n');
  // A heading on the last line with no newline.
  assert.equal(replaceSection('## Only', 'Only', 'body'), '## Only\n\nbody\n');
  // create on an empty body.
  assert.equal(replaceSection('', '### New', 'x', { create: true }), '### New\n\nx\n');
});

test('parseTable: escaped pipes, short rows, alignment, and no table', () => {
  const text = 'Intro\n\n| Name | Note |\n| :--- | ---: |\n| a \\| b | x |\n| short |\n\nAfter\n';
  const t = parseTable(text);
  assert.equal(t.found, true);
  assert.deepEqual(t.headers, ['Name', 'Note']);
  assert.deepEqual(t.rows, [['a | b', 'x'], ['short', '']]);
  assert.deepEqual(t.align, ['left', 'right']);
  assert.equal(text.slice(t.start, t.end), '| Name | Note |\n| :--- | ---: |\n| a \\| b | x |\n| short |\n');
  assert.equal(t.rowSpans.length, 2);

  const none = parseTable('No table here\n---\n');
  assert.equal(none.found, false);
  assert.deepEqual(none.headers, []);
  assert.deepEqual(none.rows, []);
  // A pipe line followed by a rule with a different cell count is not a table.
  assert.equal(parseTable('a | b\n---\n').found, false);
  // A table inside a code fence is ignored.
  assert.equal(parseTable('```\n| a |\n|---|\n```\n').found, false);
  // A table with no body rows.
  const headOnly = parseTable('| A | B |\n|---|---|\n');
  assert.deepEqual(headOnly.rows, []);
  assert.equal(headOnly.end, '| A | B |\n|---|---|\n'.length);
});

test('renderTable escapes pipes and line breaks and accepts objects', () => {
  const out = renderTable(['Date', 'Change'], [['2026-09-26', 'a | b\nsecond line'], { Date: '2026-09-27', Change: 'ok' }, ['only one']]);
  assert.equal(out, '| Date | Change |\n|---|---|\n| 2026-09-26 | a \\| b<br>second line |\n| 2026-09-27 | ok |\n| only one |  |\n');
  assert.deepEqual(parseTable(out).rows[0], ['2026-09-26', 'a | b<br>second line']);
  assert.throws(() => renderTable(['A'], [['1', '2']]), (err) => err.code === EXIT.INVALID);
  assert.throws(() => renderTable(['A'], [{ B: '1' }]), (err) => err.code === EXIT.INVALID);
  assert.throws(() => renderTable([], []), (err) => err.code === EXIT.INVALID);
});

test('appendTableRow: placement, placeholders, custom drop rule, and new tables', () => {
  const section = '\nIntro.\n\n| ID | Question | Status |\n|---|---|---|\n| Q-01 | <Question> | Open |\n| <ID> | <Question> | <Status> |\n\nText after.\n';
  const kept = appendTableRow(section, ['Q-02', 'Real question?', 'Open']);
  assert.equal(kept, '\nIntro.\n\n| ID | Question | Status |\n|---|---|---|\n| Q-01 | <Question> | Open |\n| <ID> | <Question> | <Status> |\n| Q-02 | Real question? | Open |\n\nText after.\n');
  const dropped = appendTableRow(section, { ID: 'Q-02', Question: 'Real?', Status: 'Open' }, { dropPlaceholderRows: true });
  assert.equal(dropped, '\nIntro.\n\n| ID | Question | Status |\n|---|---|---|\n| Q-01 | <Question> | Open |\n| Q-02 | Real? | Open |\n\nText after.\n');
  const custom = appendTableRow(section, ['Q-02', 'x', 'Open'], { dropPlaceholderRows: (cells) => cells[0] === 'Q-01' });
  assert.equal(parseTable(custom).rows.map((r) => r[0]).join(','), '<ID>,Q-02');
  // A table at the very end with no final newline.
  assert.equal(appendTableRow('| A |\n|---|\n| 1 |', ['2']), '| A |\n|---|\n| 1 |\n| 2 |');
  // No table: error, or a new table when headers are given.
  assert.throws(() => appendTableRow('Just text.\n', ['x']), (err) => err.code === EXIT.INVALID);
  assert.equal(appendTableRow('Just text.\n', ['x', 'y'], { headers: ['A', 'B'] }), 'Just text.\n\n| A | B |\n|---|---|\n| x | y |\n');
  assert.equal(appendTableRow('', ['x'], { headers: ['A'] }), '| A |\n|---|\n| x |\n');
  assert.throws(() => appendTableRow(section, ['1', '2', '3', '4']), (err) => err.code === EXIT.INVALID);
});

test('replaceTable swaps only the first table', () => {
  const text = 'a\n\n| X |\n|---|\n| 1 |\n\n| Y |\n|---|\n| 2 |\n';
  assert.equal(replaceTable(text, ['X'], [['9'], ['8']]), 'a\n\n| X |\n|---|\n| 9 |\n| 8 |\n\n| Y |\n|---|\n| 2 |\n');
  assert.throws(() => replaceTable('none', ['X'], []), (err) => err.code === EXIT.INVALID);
});

test('empty and missing input', () => {
  assert.deepEqual([...splitSections('')], []);
  assert.deepEqual([...splitSections(undefined)], []);
  assert.equal(getSection('', 'x'), null);
  assert.equal(parseTable(undefined).found, false);
  assert.equal(path.basename(MODEL_TEMPLATE), 'WORK-ITEM.md');
});
