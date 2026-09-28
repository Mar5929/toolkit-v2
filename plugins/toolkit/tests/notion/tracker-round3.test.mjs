// Notion tracker fixes from sample run c, round 3 and the Notion rebuild
// check: the design approval is all or nothing and survives header lines
// Notion joined into one paragraph; "Design approved" starts as "no"; a bare
// WORK-ITEM.md is sent as code text; a new title reaches the design page; and
// history rows say "a top-level item", never "none (top level)".

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureProject } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { createTracker } from '../../lib/notion/tracker.mjs';
import { readValue } from '../../lib/notion/props.mjs';
import { newRecordText, parseDoc, parseHistory, designStatusFromBody, getLabel } from '../../lib/work/model.mjs';
import { opApprove, opDesign, opSet } from '../../lib/work/ops.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';
import { readTemplate } from '../../lib/core/templates.mjs';

const WI_TEMPLATE = readTemplate('work-item');
const TODAY = '2026-09-27';

async function setup(fakeOptions = {}) {
  const fake = new FakeNotion();
  Object.assign(fake.options, fakeOptions);
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-round3-'));
  const config = {
    toolkit: 'toolkit-v2',
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike Rihm' },
    tracker: { type: 'notion', idPrefix: 'TV2' },
    memory: { type: 'builtin' },
    notion: {},
  };
  const { notion } = await ensureProject({ client, config, mainRoot: root, rootPageId: fake.rootPageId, now: () => new Date('2026-09-27T12:00:00Z') });
  config.notion = notion;
  const project = { root, mainRoot: root, config };
  const open = () => createTracker(project, { client, today: TODAY, verifyRetryMs: 0 });
  return { fake, client, project, notion, open };
}

function record(title) {
  return parseDoc(newRecordText(WI_TEMPLATE, {
    id: 'WI-001', title, type: 'task', stage: '04-solution-design', status: 'In Progress', parent: 'none', waiting_on: 'none', priority: 'medium',
    delivery: 'not-offered', requirements_approved: 'no', design: 'none', result_approved: 'no', updated: TODAY,
  }));
}

// What the agent saved in sample run c, round 3 (s05): header lines with no Markdown line breaks.
const DESIGN = (id) => `# ${id}: Brief — solution design\n\n**Requirements:** ${id}\n**Design status:** Proposed\n**Requirements checked:** ${id} Requirements, 2026-09-27\n**Last updated:** 2026-09-27\n**Design approval:** Pending\n\n## What this design solves\n\nA short brief at the top of README.md.\n\n## Design options\n\n### Option A — One short brief\n\nThree bullets.\n`;

const designPage = (fake, id) => Object.values(fake.pages).find((p) => /solution design$/.test(fake.titleOf(p)) && fake.titleOf(p).startsWith(`${id}:`));
const itemPage = (fake, notion, title) => Object.values(fake.pages).find((p) => p.parent.data_source_id === notion.workItems.dataSourceId && fake.titleOf(p) === title);

test('a design saved with header lines on consecutive lines keeps them apart in Notion, and approve --design records the approval', async () => {
  const { fake, notion, project, open } = await setup();
  const t = await open();
  const id = await t.create({ meta: record('Brief').meta, body: record('Brief').body });
  assert.equal(id, 'TV2-001');
  const saved = await opDesign(t, project, id, { create: true, text: DESIGN(id), today: TODAY });
  assert.equal(saved.design.meta.status, 'proposed');
  const stored = designPage(fake, id).markdown;
  assert.match(stored, /\*\*Requirements:\*\* TV2-001<br>\*\*Design status:\*\* Proposed<br>/, 'each header label on its own line in Notion');
  const res = await opApprove(t, project, id, { what: 'design', by: 'Mike Rihm', today: TODAY });
  assert.equal(res.approval, '2026-09-27 by Mike Rihm');
  const d = await t.getDesign(id);
  assert.equal(d.meta.status, 'approved');
  assert.equal(d.meta.approved, '2026-09-27 by Mike Rihm');
  assert.equal(readValue(itemPage(fake, notion, 'Brief'), notion.workItems.properties.designApproved), '2026-09-27 by Mike Rihm');
  const item = await t.get(id);
  assert.equal(item.meta.design, 'approved');
  assert.equal(parseHistory(item.body)[0].change, 'Design approved by Mike Rihm.');
});

test('approve --design works on a design page Notion already holds as one joined header paragraph', async () => {
  const { fake, project, open } = await setup();
  const t = await open();
  const id = await t.create({ meta: record('Brief').meta, body: record('Brief').body });
  await opDesign(t, project, id, { create: true, text: DESIGN(id), today: TODAY });
  // As Notion stored it in sample run c, round 3.
  const page = designPage(fake, id);
  page.markdown = page.markdown.replace(/\*\*Requirements:\*\* TV2-001<br>\*\*Design status:\*\* Proposed<br>\*\*Requirements checked:\*\* TV2-001 Requirements, 2026-09-27<br>\*\*Last updated:\*\* 2026-09-27<br>\*\*Design approval:\*\* Pending/,
    '**Requirements:** TV2-001 **Design status:** Proposed **Requirements checked:** TV2-001 Requirements, 2026-09-27 **Last updated:** 2026-09-27 **Design approval:** Pending');
  assert.match(page.markdown, /TV2-001 \*\*Design status:\*\* Proposed \*\*Requirements checked/);
  const res = await opApprove(t, project, id, { what: 'design', by: 'Mike Rihm', today: TODAY });
  assert.equal(res.record.meta.design, 'approved');
  const d = await t.getDesign(id);
  assert.equal(d.meta.status, 'approved');
  assert.equal(designStatusFromBody(d.body), 'approved');
  assert.match(designPage(fake, id).markdown, /\*\*Design status:\*\* Approved<br>/, 'the header is split into lines again');
});

test('a design approval that does not read back is not half written: the property, the item, and the text stay as they were', async () => {
  const { fake, notion, project, open } = await setup();
  const t = await open();
  const id = await t.create({ meta: record('Brief').meta, body: record('Brief').body });
  await opDesign(t, project, id, { create: true, text: DESIGN(id), today: TODAY });
  const before = designPage(fake, id).markdown;
  // Notion does not keep the new status line: it stores Draft instead of Approved.
  const real = t.client.patchMarkdown.bind(t.client);
  t.client.patchMarkdown = async (pageId, body) => {
    const swap = (x) => String(x).replace('**Design status:** Approved', '**Design status:** Draft');
    if (body.type === 'update_content') {
      return real(pageId, { ...body, update_content: { content_updates: body.update_content.content_updates.map((op) => ({ ...op, new_str: swap(op.new_str) })) } });
    }
    return real(pageId, { ...body, replace_content: { new_str: swap(body.replace_content.new_str) } });
  };
  await assert.rejects(opApprove(t, project, id, { what: 'design', by: 'Mike Rihm', today: TODAY }), (err) => {
    assert.match(err.message, /^The design approval of TV2-001 was not recorded: .* Nothing was approved\.$/);
    assert.match(err.message, /The design was written back as it was\./);
    return true;
  });
  t.client.patchMarkdown = real;
  assert.equal(readValue(itemPage(fake, notion, 'Brief'), notion.workItems.properties.designApproved), 'no', 'the property was never written');
  const item = await t.get(id);
  assert.equal(item.meta.design, 'proposed');
  assert.ok(!parseHistory(item.body).some((h) => /Design approved/.test(h.change)));
  assert.equal(designPage(fake, id).markdown.replace(/<br>/g, ''), before.replace(/<br>/g, ''));
  assert.equal((await t.getDesign(id)).meta.status, 'proposed');
});

test('design text that says Approved does not approve the design in Notion', async () => {
  const { project, open } = await setup();
  const t = await open();
  const id = await t.create({ meta: record('Brief').meta, body: record('Brief').body });
  await opDesign(t, project, id, { create: true, text: DESIGN(id), today: TODAY });
  const res = await opDesign(t, project, id, { text: DESIGN(id).replace('**Design status:** Proposed', '**Design status:** Approved').replace('**Design approval:** Pending', '**Design approval:** Mike Rihm, 2026-09-27'), today: TODAY });
  assert.equal(res.design.meta.status, 'proposed');
  assert.equal(res.design.meta.approved, 'no');
  assert.equal((await t.get(id)).meta.design, 'proposed');
});

test('a new item and a card made with the New button get "no" in Design approved', async () => {
  const { fake, client, notion, open } = await setup();
  const t = await open();
  await t.create({ meta: record('Made by the toolkit').meta, body: record('Made by the toolkit').body });
  assert.equal(readValue(itemPage(fake, notion, 'Made by the toolkit'), notion.workItems.properties.designApproved), 'no');
  await client.createPage({ parent: { type: 'data_source_id', data_source_id: notion.workItems.dataSourceId }, properties: { [notion.workItems.names.title]: { title: [{ type: 'text', text: { content: 'Made in Notion' } }] } } });
  const report = await (await open()).sync();
  assert.equal(report.adopted.length, 1);
  assert.equal(readValue(itemPage(fake, notion, 'Made in Notion'), notion.workItems.properties.designApproved), 'no');
});

test('WORK-ITEM.md in a work item or design is sent as code text, so Notion does not link it', async () => {
  const { fake, notion, project, open } = await setup({ autolinkMd: true });
  const t = await open();
  const body = record('Linked').body.replace('<The owner’s original request, in their words or a faithful short summary.>', 'Keep WORK-ITEM.md and docs/area.md as they are.');
  const id = await t.create({ meta: record('Linked').meta, body });
  const page = itemPage(fake, notion, 'Linked');
  assert.match(page.markdown, /Keep `WORK-ITEM\.md` and `docs\/area\.md` as they are\./);
  assert.doesNotMatch(page.markdown, /\]\(http:\/\/WORK-ITEM\.md\)/);
  await opDesign(t, project, id, { create: true, today: TODAY });
  assert.doesNotMatch(designPage(fake, id).markdown, /http:\/\/WORK-ITEM\.md/);
  assert.match(designPage(fake, id).markdown, /`WORK-ITEM\.md`/);
});

test('a new title reaches the design page title in Notion', async () => {
  const { fake, project, open } = await setup();
  const t = await open();
  const id = await t.create({ meta: record('Old name').meta, body: record('Old name').body });
  await opDesign(t, project, id, { create: true, today: TODAY });
  const res = await opSet(t, id, { title: 'New name' }, { today: TODAY });
  assert.ok(res.notes.includes('The design page title now has the new title.'), res.notes.join('\n'));
  assert.ok(designPage(fake, id), 'still found');
  assert.equal(fake.titleOf(designPage(fake, id)), 'TV2-001: New name — solution design');
});

test('a sub-item moved in Notion by hand from the top level: the parent\'s row says "it was a top-level item"', async () => {
  const { client, notion, open } = await setup();
  const t = await open();
  const a = await t.create({ meta: record('A').meta, body: record('A').body });
  const b = await t.create({ meta: record('B').meta, body: record('B').body });
  await t.sync();
  const pa = await t.findPage(a);
  const pb = await t.findPage(b);
  await client.updatePage(pb.id, { properties: { [notion.workItems.properties.parent]: { relation: [{ id: pa.id }] } } });
  const report = await (await open()).sync({ quick: true });
  assert.deepEqual(report.moves.map((m) => [m.id, m.kind, m.parentBefore, m.parentAfter]), [[b, 'reparented', 'none', a]]);
  const parent = await (await open()).get(a);
  const row = parseHistory(parent.body).find((h) => h.change.includes(`Sub-item ${b}`));
  assert.equal(row.change, `Sub-item ${b} moved here in Notion by hand (it was a top-level item).`);
  assert.doesNotMatch(parent.body, /none \(top level\)/);
});

test('a parent changed in Notion by hand: the item and both parents update Related items', async () => {
  const { client, notion, open } = await setup();
  const t = await open();
  const a = await t.create({ meta: record('A').meta, body: record('A').body });
  const b = await t.create({ meta: { ...record('B').meta, parent: a }, body: record('B').body });
  const c = await t.create({ meta: record('C').meta, body: record('C').body });
  await t.sync();
  const pc = await t.findPage(c);
  const pb = await t.findPage(b);
  await client.updatePage(pb.id, { properties: { [notion.workItems.properties.parent]: { relation: [{ id: pc.id }] } } });
  await (await open()).sync({ quick: true });
  const rel = async (id) => getLabel((await (await open()).get(id)).body, 'Related items', { section: 'Overview' });
  assert.equal(await rel(b), `Parent ${c}.`);
  assert.equal(await rel(c), `Sub-items: ${b}.`);
  assert.notEqual(await rel(a), `Sub-items: ${b}.`);
});

// Fix round 2 (verifier): a Notion update writes the item's text before its
// properties, so a failed property write left "Design approved by ..." and
// Q-01 Answered on an item whose design was written back to Draft.
const WITH_QUESTIONS = (body) => body.replace(
  '| Q-01 | <Specific unanswered question> | R-01, P1-T02 | Open | <owner, or another person or role> |',
  '| Q-01 | Which option do you approve: Option A or Option B? | design | Open | owner |',
);
const sameId = (a, b) => String(a).replace(/-/g, '') === String(b).replace(/-/g, '');

async function approvalSetup() {
  const s = await setup();
  const t = await s.open();
  const base = record('Brief');
  const id = await t.create({ meta: { ...base.meta, waiting_on: 'owner' }, body: WITH_QUESTIONS(base.body) });
  await opDesign(t, s.project, id, { create: true, text: DESIGN(id), today: TODAY });
  const item = itemPage(s.fake, s.notion, 'Brief');
  return { ...s, t, id, item, textBefore: (await t.get(id)).body };
}

test('approve --design: a failed property write on the item takes the history row and Q-01 back out, and restores the design', async () => {
  const { t, id, item, notion, fake, project, textBefore } = await approvalSetup();
  const realUpdate = t.client.updatePage.bind(t.client);
  let failures = 0;
  t.client.updatePage = async (pageId, body) => {
    if (!failures && sameId(pageId, item.id) && body.properties && body.properties[notion.workItems.properties.design]) {
      failures++;
      throw new Error('Notion returned 502 Bad Gateway.');
    }
    return realUpdate(pageId, body);
  };
  await assert.rejects(opApprove(t, project, id, { what: 'design', by: 'Mike Rihm', today: TODAY }), (err) => {
    assert.match(err.message, /^The design approval of TV2-001 was not recorded: the design was saved, but TV2-001 itself could not be updated \(Notion returned 502 Bad Gateway\)\./);
    assert.match(err.message, /The design was written back as it was\./);
    assert.match(err.message, /the Recent History row "Design approved by Mike Rihm\." and Q-01 marked Answered were taken out of TV2-001 again\. Nothing was approved\.$/);
    return true;
  });
  t.client.updatePage = realUpdate;
  assert.equal(failures, 1);
  const after = await t.get(id);
  assert.equal(after.meta.design, 'proposed');
  assert.equal(after.meta.waiting_on, 'owner');
  assert.ok(!parseHistory(after.body).some((h) => /Design approved/.test(h.change)), 'no approval row is left');
  assert.equal(after.body, textBefore, 'the item text is as it was');
  assert.match(after.body, /\| Q-01 \| Which option do you approve: Option A or Option B\? \| design \| Open \| owner \|/);
  const d = await t.getDesign(id);
  assert.equal(d.meta.status, 'proposed');
  assert.equal(d.meta.approved, 'no');
  assert.equal(readValue(itemPage(fake, notion, 'Brief'), notion.workItems.properties.designApproved), 'no');
});

test('approve --design: when the item was saved but its first check read stale, the approval stands with a warning', async () => {
  const { t, id, project } = await approvalSetup();
  const realUpdate = t.update.bind(t);
  let stale = 0;
  t.update = async (key, args) => {
    const rec = await realUpdate(key, args);
    if (!stale && args.meta && args.meta.design === 'approved') {
      stale++;
      return { ...rec, meta: { ...rec.meta, design: 'proposed' } };
    }
    return rec;
  };
  const res = await opApprove(t, project, id, { what: 'design', by: 'Mike Rihm', today: TODAY });
  t.update = realUpdate;
  assert.equal(stale, 1);
  assert.equal(res.record.meta.design, 'approved');
  assert.match(res.warnings[0], /^TV2-001 was saved, but its first check failed \(Saved but not verified: TV2-001 design reads "proposed" instead of "approved"\)\. Reading it again shows design: approved, so the approval is recorded\.$/);
  assert.deepEqual(res.closedQuestions, ['Q-01']);
  const d = await t.getDesign(id);
  assert.equal(d.meta.status, 'approved', 'the design is not written back while the item says approved');
  const item = await t.get(id);
  assert.equal(parseHistory(item.body).filter((h) => h.change === 'Design approved by Mike Rihm.').length, 1);
});

test('approve --design: when the history row cannot be taken out again, the error says exactly what is left', async () => {
  const { t, id, item, notion, project } = await approvalSetup();
  const realUpdate = t.client.updatePage.bind(t.client);
  const realPatch = t.client.patchMarkdown.bind(t.client);
  let itemTextWrites = 0;
  t.client.updatePage = async (pageId, body) => {
    if (sameId(pageId, item.id) && body.properties && body.properties[notion.workItems.properties.design]) throw new Error('Notion returned 502 Bad Gateway.');
    return realUpdate(pageId, body);
  };
  t.client.patchMarkdown = async (pageId, body) => {
    if (sameId(pageId, item.id) && ++itemTextWrites > 1) throw new Error('Notion returned 503 Service Unavailable.');
    return realPatch(pageId, body);
  };
  await assert.rejects(opApprove(t, project, id, { what: 'design', by: 'Mike Rihm', today: TODAY }), (err) => {
    assert.match(err.message, /The design was written back as it was\. TV2-001 still has the Recent History row "Design approved by Mike Rihm\." and Q-01 marked Answered, which could not be taken out\. Nothing was approved\.$/);
    assert.deepEqual(err.details.left, ['the Recent History row "Design approved by Mike Rihm."', 'Q-01 marked Answered']);
    return true;
  });
  t.client.updatePage = realUpdate;
  t.client.patchMarkdown = realPatch;
  assert.equal((await t.getDesign(id)).meta.status, 'proposed');
  assert.equal((await t.get(id)).meta.design, 'proposed');
});

test('the decision list reads a proposed design in Notion with one call when its page is known, and still tells a draft from a design with options', async () => {
  const { withDesignBodies, collectOwnerDecisions } = await import('../../lib/work/decisions.mjs');
  const { listItems } = await import('../../lib/work/ops.mjs');
  const { project, open } = await setup();
  const t = await open();
  const a = await t.create({ meta: record('With options').meta, body: record('With options').body });
  const b = await t.create({ meta: record('Draft only').meta, body: record('Draft only').body });
  await opDesign(t, project, a, { create: true, text: DESIGN(a), today: TODAY });
  await opDesign(t, project, b, { create: true, today: TODAY });
  const t2 = await open();
  const items = await listItems(t2, { fetchBodies: true });
  const calls = [];
  for (const m of ['getPage', 'getMarkdown', 'queryAll', 'childrenAll']) {
    const real = t2.client[m].bind(t2.client);
    t2.client[m] = async (...args) => {
      calls.push(m);
      return real(...args);
    };
  }
  await withDesignBodies(t2, items);
  assert.deepEqual(calls, ['getMarkdown', 'getMarkdown'], 'one read per proposed design');
  const kinds = collectOwnerDecisions(items).filter((d) => d.kind === 'design_proposed').map((d) => d.id);
  assert.deepEqual(kinds, [a], 'the template-only design is a draft, not waiting for approval');
});

test('an older item with a blank "Design approved" gets "no" on the next sync; an approved one is left alone', async () => {
  const { fake, client, notion, open } = await setup();
  const t = await open();
  await t.create({ meta: record('Older item').meta, body: record('Older item').body });
  await t.create({ meta: { ...record('Approved item').meta, design: 'approved' }, body: record('Approved item').body });
  const prop = notion.workItems.properties.designApproved;
  for (const title of ['Older item', 'Approved item']) await client.updatePage(itemPage(fake, notion, title).id, { properties: { [prop]: { rich_text: [] } } });
  assert.equal(readValue(itemPage(fake, notion, 'Older item'), prop) || '', '');
  await (await open()).sync();
  assert.equal(readValue(itemPage(fake, notion, 'Older item'), prop), 'no');
  assert.equal(readValue(itemPage(fake, notion, 'Approved item'), prop) || '', '', 'its approval value is not known, so it is not written');
  const before = fake.writes().length;
  await (await open()).sync();
  assert.equal(fake.writes().length, before, 'a second sync writes nothing');
});
