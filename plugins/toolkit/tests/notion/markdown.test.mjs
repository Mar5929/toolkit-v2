// Markdown both ways between the local form and Notion's Markdown.
// The *.notion.md fixtures are what Notion really returned on 2026-09-26.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  toNotion, fromNotion, normalizeLocal, sameLocal, planUpdate, stripTitle, withTitle, escapeInline, unescapeInline,
  undoAutoLinks, detectTableStyle, notionLeaves,
} from '../../lib/notion/markdown.mjs';
import { parse } from '../../lib/core/frontmatter.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(HERE, 'fixtures');
const read = (...p) => fs.readFileSync(path.join(FIX, ...p), 'utf8');

// The templates the plugin ships. The exact round-trip tests read these files,
// so a change to a shipped template is tested as it is.
const SHIPPED = path.resolve(HERE, '..', '..', 'templates');

function templateBody(file) {
  return stripTitle(parse(read('templates', file)).body).body;
}

function shippedBody(file) {
  return stripTitle(parse(fs.readFileSync(path.join(SHIPPED, file), 'utf8')).body).body;
}

test('WORK-ITEM.md: what Notion returned converts back to the exact template body', () => {
  const local = read('markdown', 'work-item.local.md');
  const notion = read('markdown', 'work-item.notion.md');
  assert.equal(fromNotion(notion, { styleFrom: local }).markdown, local);
});

test('DESIGN.md: what Notion returned converts back to the exact template body', () => {
  const local = read('markdown', 'design.local.md');
  const notion = read('markdown', 'design.notion.md');
  assert.equal(fromNotion(notion, { styleFrom: local }).markdown, local);
});

test('round trip through the converter is exact for the shipped templates', () => {
  for (const file of ['WORK-ITEM.md', 'DESIGN.md']) {
    const body = shippedBody(file);
    const back = fromNotion(toNotion(body), { styleFrom: body }).markdown;
    assert.equal(back, body, `the shipped ${file} changed in the round trip`);
    assert.ok(sameLocal(fromNotion(toNotion(body)).markdown, body), `the shipped ${file} does not round-trip without a style source`);
  }
});

test('round trip is exact for the model templates and the earlier template copies in fixtures', () => {
  // fixtures/templates/WORK-ITEM.md and DESIGN.md are the templates as they were
  // when the Notion responses were recorded; they are extra inputs, not the shipped text.
  for (const file of ['WORK-ITEM.md', 'DESIGN.md', 'model-WORK-ITEM.md', 'model-DESIGN.md']) {
    const body = templateBody(file);
    const back = fromNotion(toNotion(body), { styleFrom: body }).markdown;
    assert.equal(back, body, `${file} changed in the round trip`);
  }
});

test('what the converter sends matches what Notion stores, except automatic links', () => {
  const local = read('markdown', 'work-item.local.md');
  const notion = read('markdown', 'work-item.notion.md');
  assert.equal(toNotion(local), notion);
});

test('tables are sent as <table> and come back as pipe tables', () => {
  const md = '| A | B |\n|---|---|\n| x \\| y | <z> `c\\|d` |\n| **bold** | [l](https://a.b) |\n';
  const n = toNotion(md);
  assert.match(n, /^<table header-row="true">/);
  assert.match(n, /<td>x \\\| y<\/td>/);
  assert.match(n, /<td>\\<z\\> `c\|d`<\/td>/);
  assert.equal(fromNotion(n).markdown, md);
});

test('placeholders, dollar signs, braces, and carets are escaped for Notion and restored', () => {
  const line = 'Costs $5 for <Term> {x} ^ and `code <kept>` and [a](https://b.c) and <br> stays';
  const esc = escapeInline(line);
  assert.equal(esc, 'Costs \\$5 for \\<Term\\> \\{x\\} \\^ and `code <kept>` and [a](https://b.c) and <br> stays');
  assert.equal(unescapeInline(esc), line);
});

test('Notion markup the owner added (a callout, a color) passes through untouched', () => {
  const notion = '## Notes\n<callout icon="💡" color="yellow_bg">\n\tMike added this.\n</callout>\nText {color="red"}';
  const local = fromNotion(notion).markdown;
  assert.match(local, /<callout icon="💡" color="yellow_bg">\n\tMike added this.\n<\/callout>/);
  assert.equal(toNotion(local), notion);
});

test('placeholders that start with a Notion tag name are still escaped', () => {
  const md = '<File or folder that changed>\n\n<Image of the page> and <u name> and <Summary here>\n';
  const n = toNotion(md);
  assert.equal(n, '\\<File or folder that changed\\>\n\\<Image of the page\\> and \\<u name\\> and \\<Summary here\\>');
  assert.equal(fromNotion(n).markdown, md);
});

test('hard breaks become <br> and come back as two spaces and the list indent', () => {
  const md = '- [ ] **P1-T01 — Task** · In Progress  \n  **Work:** Do it.  \n  **Done when:** Checked.\n- [x] Done task\n';
  const n = toNotion(md);
  assert.equal(n, '- [ ] **P1-T01 — Task** · In Progress<br>**Work:** Do it.<br>**Done when:** Checked.\n- [x] Done task');
  assert.equal(fromNotion(n).markdown, md);
});

test('soft line breaks are kept as line breaks (they read back as hard breaks)', () => {
  const md = 'Line one\nline two\n';
  const back = fromNotion(toNotion(md)).markdown;
  assert.equal(back, 'Line one  \nline two\n');
  assert.ok(sameLocal(back, md));
});

test('nested lists use tabs in Notion and the parent indent locally', () => {
  const md = '- a\n  - b\n    - c\n- d\n\n1. first\n2. second\n   - child\n';
  const n = toNotion(md);
  assert.equal(n, '- a\n\t- b\n\t\t- c\n- d\n1. first\n2. second\n\t- child');
  assert.equal(fromNotion(n).markdown, md);
});

test('automatic links Notion adds to file names are removed', () => {
  assert.equal(undoAutoLinks('see [WORK-ITEM.md](http://WORK-ITEM.md) and docs/[file.md](http://file.md)'), 'see WORK-ITEM.md and docs/file.md');
  assert.equal(undoAutoLinks('[example](https://example.com)'), '[example](https://example.com)');
  assert.equal(undoAutoLinks('[https://x.y](https://x.y)'), 'https://x.y');
});

test('the tricky sample Notion returned reads back sensibly', () => {
  const back = fromNotion(read('markdown', 'tricky.notion.md')).markdown;
  assert.match(back, /Costs \$5 and \$10 here\. Curly \{braces\} and caret \^ and tilde ~/);
  assert.match(back, /path docs\/file\.md and WI-001/);
  assert.match(back, /^- bullet a\n {2}- nested b\n {4}- nested c\n- bullet d$/m);
  assert.match(back, /^#### Heading five$/m);
});

test('child pages are listed and left out of the local body', () => {
  const md = JSON.parse(read('responses', 'work-item-markdown.json')).markdown;
  const res = fromNotion(md);
  assert.equal(res.children.length, 1);
  assert.equal(res.children[0].type, 'page');
  assert.match(res.children[0].title, /solution design$/);
  assert.ok(!res.markdown.includes('<page'));
});

test('stripTitle and withTitle', () => {
  assert.deepEqual(stripTitle('# WI-001: A\n\n## Overview\n'), { title: 'WI-001: A', body: '## Overview\n' });
  assert.equal(withTitle('WI-001: A', '## Overview\n'), '# WI-001: A\n\n## Overview\n');
  assert.deepEqual(stripTitle('## Overview\n'), { title: null, body: '## Overview\n' });
});

test('detectTableStyle', () => {
  assert.equal(detectTableStyle('| a |\n| --- |\n'), 'spaced');
  assert.equal(detectTableStyle('| a |\n|---|\n'), 'compact');
  assert.equal(detectTableStyle('no table'), 'compact');
});

test('normalizeLocal ignores spacing, table padding, and escapes, not words', () => {
  assert.ok(sameLocal('# A\n\n\ntext  \nmore\n', '# A\n\ntext\nmore'));
  assert.ok(sameLocal('| a | b |\n| --- | --- |\n| 1 | 2 |', '|a|b|\n|---|---|\n|1|2|'));
  assert.ok(sameLocal('5 \\* 3', '5 * 3'));
  assert.ok(!sameLocal('Goal: A', 'Goal: B'));
  assert.equal(normalizeLocal(''), '');
});

// ------------------------------------------------------------------ planUpdate

const NOTION_PAGE = read('markdown', 'work-item.notion.md');
const LOCAL = fromNotion(NOTION_PAGE).markdown;

test('planUpdate: no change gives nothing to do', () => {
  assert.deepEqual(planUpdate({ fresh: NOTION_PAGE, next: LOCAL }), { type: 'none' });
});

test('planUpdate: one changed section gives one update_content with old text from the fresh read', () => {
  const next = LOCAL.replace('**Next action:** <The next specific action and its owner.>', '**Next action:** Ask the owner (agent).');
  const plan = planUpdate({ fresh: NOTION_PAGE, next });
  assert.equal(plan.type, 'update_content');
  assert.equal(plan.ops.length, 1);
  assert.ok(NOTION_PAGE.includes(plan.ops[0].old_str));
  assert.ok(plan.ops[0].old_str.startsWith('## Overview'));
  assert.match(plan.ops[0].new_str, /\*\*Next action:\*\* Ask the owner \(agent\)\./);
});

test('planUpdate: two separate sections give two operations', () => {
  const next = LOCAL
    .replace('**Goal:** <The outcome this work item is meant to achieve.>', '**Goal:** Log in.')
    .replace('<Where the next person or session should pick up.>', 'Start at R-01.');
  const plan = planUpdate({ fresh: NOTION_PAGE, next });
  assert.equal(plan.ops.length, 2);
});

test('planUpdate: an owner edit in another section is kept (three-way)', () => {
  const base = LOCAL;
  const ownerFresh = NOTION_PAGE.replace('**Goal:** \\<The outcome this work item is meant to achieve.\\>', '**Goal:** Mike wrote this.');
  const next = base.replace('<Where the next person or session should pick up.>', 'Start at R-01.');
  const plan = planUpdate({ fresh: ownerFresh, base, next });
  assert.equal(plan.type, 'update_content');
  assert.equal(plan.ops.length, 1);
  assert.ok(!plan.ops[0].old_str.includes('Goal'));
});

test('planUpdate: an owner edit in the same section is a conflict', () => {
  const base = LOCAL;
  const ownerFresh = NOTION_PAGE.replace('**Goal:** \\<The outcome this work item is meant to achieve.\\>', '**Goal:** Mike wrote this.');
  const next = base.replace('**Goal:** <The outcome this work item is meant to achieve.>', '**Goal:** The agent wrote this.');
  assert.throws(() => planUpdate({ fresh: ownerFresh, base, next }), (err) => err.details && err.details.conflicts && err.details.conflicts.length === 1);
});

test('planUpdate: the owner making the same change is not a conflict', () => {
  const base = LOCAL;
  const ownerFresh = NOTION_PAGE.replace('**Goal:** \\<The outcome this work item is meant to achieve.\\>', '**Goal:** Same words.');
  const next = base.replace('**Goal:** <The outcome this work item is meant to achieve.>', '**Goal:** Same words.');
  assert.deepEqual(planUpdate({ fresh: ownerFresh, base, next }), { type: 'none' });
});

function applyOps(page, plan) {
  let applied = page;
  for (const op of plan.ops) {
    assert.equal(applied.split(op.old_str).length - 1, 1, 'old_str must be found once');
    applied = applied.replace(op.old_str, () => op.new_str);
  }
  return applied;
}

const OWNER_TASK_EDIT = (text) => text.replace('**Depends on:** P1-T01.', '**Depends on:** P1-T01 and Mike.');

test('planUpdate: an owner edit in a section between two changed sections is kept, not a conflict', () => {
  const base = LOCAL;
  const ownerFresh = OWNER_TASK_EDIT(NOTION_PAGE);
  assert.notEqual(ownerFresh, NOTION_PAGE);
  const next = base
    .replace('**Goal:** <The outcome this work item is meant to achieve.>', '**Goal:** Log in.')
    .replace('<Where the next person or session should pick up.>', 'Start at R-01.');
  const plan = planUpdate({ fresh: ownerFresh, base, next });
  assert.equal(plan.type, 'update_content');
  assert.equal(plan.ops.length, 2);
  for (const op of plan.ops) assert.ok(!op.old_str.includes('P1-T01 and Mike'), 'the owner\'s section is not replaced');
  const applied = applyOps(ownerFresh, plan);
  assert.ok(sameLocal(fromNotion(applied).markdown, OWNER_TASK_EDIT(next)));
});

test('planUpdate: an added section and a changed section keep an owner edit in a section between them', () => {
  const base = LOCAL;
  const ownerFresh = OWNER_TASK_EDIT(NOTION_PAGE);
  const next = base
    .replace('**Goal:** <The outcome this work item is meant to achieve.>', '**Goal:** Log in.')
    .replace('## Notes\n', '## Risks\n\nNone yet.\n\n## Notes\n');
  const plan = planUpdate({ fresh: ownerFresh, base, next });
  assert.equal(plan.type, 'update_content');
  const applied = applyOps(ownerFresh, plan);
  assert.ok(sameLocal(fromNotion(applied).markdown, OWNER_TASK_EDIT(next)));
});

test('planUpdate: a removed section the owner also removed is not a conflict', () => {
  const base = LOCAL;
  const ownerFresh = NOTION_PAGE.replace(/### Resume here\n[^\n]*\n/, '');
  const next = base.replace(/### Resume here\n\n[^\n]*\n\n/, '');
  assert.deepEqual(planUpdate({ fresh: ownerFresh, base, next }), { type: 'none' });
});

test('planUpdate: a new section is inserted next to its neighbor', () => {
  const next = LOCAL.replace('## Notes\n', '## Risks\n\nNone yet.\n\n## Notes\n');
  const plan = planUpdate({ fresh: NOTION_PAGE, next });
  assert.equal(plan.type, 'update_content');
  const applied = NOTION_PAGE.replace(plan.ops[0].old_str, plan.ops[0].new_str);
  assert.ok(sameLocal(fromNotion(applied).markdown, next));
});

test('planUpdate: a removed section is removed', () => {
  const next = LOCAL.replace(/### Resume here\n\n[^\n]*\n\n/, '');
  const plan = planUpdate({ fresh: NOTION_PAGE, next });
  let applied = NOTION_PAGE;
  for (const op of plan.ops) applied = applied.replace(op.old_str, op.new_str);
  assert.ok(sameLocal(fromNotion(applied).markdown, next));
});

test('planUpdate: a child page tag in the changed range is kept', () => {
  const fresh = JSON.parse(read('responses', 'work-item-markdown.json')).markdown;
  const local = fromNotion(fresh).markdown;
  const next = `${local.trimEnd()}\n- **For R-09:** One more idea.\n`;
  const plan = planUpdate({ fresh, next });
  const tag = fresh.split('\n').find((l) => l.startsWith('<page'));
  for (const op of plan.ops) {
    if (op.old_str.includes(tag)) assert.ok(op.new_str.includes(tag));
  }
  let applied = fresh;
  for (const op of plan.ops) applied = applied.replace(op.old_str, op.new_str);
  assert.ok(applied.includes(tag));
});

test('planUpdate: an empty page gets replace_content', () => {
  const plan = planUpdate({ fresh: '', next: '## Overview\n\nHi.\n' });
  assert.equal(plan.type, 'replace_content');
  assert.equal(plan.new_str, '## Overview\nHi.');
});

test('planUpdate: repeated identical sections still get unique old text', () => {
  const fresh = '## A\nsame\n## B\nx\n## A\nsame';
  const local = fromNotion(fresh).markdown;
  const next = local.replace(/## A\n\nsame\n$/, '## A\n\nchanged\n');
  const plan = planUpdate({ fresh, next });
  let applied = fresh;
  for (const op of plan.ops) {
    assert.equal(applied.split(op.old_str).length - 1, 1, 'old_str must be unique');
    applied = applied.replace(op.old_str, op.new_str);
  }
  assert.ok(sameLocal(fromNotion(applied).markdown, next));
});

test('notionLeaves splits on headings outside tables and code', () => {
  const leaves = notionLeaves('intro\n## A\n```\n## not a heading\n```\n## B\n<table>\n<tr>\n<td>## no</td>\n</tr>\n</table>');
  assert.deepEqual(leaves.map((l) => l.heading), [null, 'A', 'B']);
});
