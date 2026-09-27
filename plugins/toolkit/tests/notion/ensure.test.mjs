// ensure-root and ensure-project against the fake Notion: build, run again
// (nothing changes), repair what was removed, and --check.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureRoot, ensureProject, samePropertyId, listViews, prefixCandidates } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES, PROJECTS_REGISTRY_PROPERTIES, workItemProperties, LORE_MEMORY_ADDED_PROPERTIES, RECORD_TYPE_TAGS } from '../../lib/notion/schema.mjs';
import { VAULT_DATABASES, VAULT_TITLES, loreProperties, loreTagOptions } from '../../lib/notion/lore-schema.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const recorded = (name) => JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures', 'responses', name), 'utf8'));

function config(tracker = 'notion', memory = 'notion') {
  return {
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: tracker, idPrefix: 'WI' },
    memory: { type: memory, approval: 'onboarding' },
    salesforce: { enabled: false },
    notion: {},
  };
}

function setup() {
  const fake = new FakeNotion();
  const projects = seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  return { fake, projects, client };
}

const now = () => new Date('2026-09-26T12:00:00Z');

test('samePropertyId compares encoded and decoded ids', () => {
  assert.ok(samePropertyId('%5DC%5DU', ']C]U'));
  assert.ok(samePropertyId('title', 'title'));
  assert.ok(!samePropertyId('abc', 'abd'));
  assert.ok(!samePropertyId(null, 'x'));
});

test('ensureRoot adds the registry properties to the existing Projects database, once', async () => {
  const { fake, projects, client } = setup();
  const first = await ensureRoot({ client, rootPageId: fake.rootPageId });
  assert.equal(first.created, false);
  assert.equal(first.projects.databaseId, projects.databaseId);
  assert.deepEqual(first.added, PROJECTS_REGISTRY_PROPERTIES.map((p) => p.name));
  const ds = fake.dataSources[projects.dataSourceId];
  for (const p of [...PROJECTS_BASE_PROPERTIES, ...PROJECTS_REGISTRY_PROPERTIES]) assert.ok(ds.properties[p.name], `${p.name} missing`);
  const writesBefore = fake.writes().length;
  const second = await ensureRoot({ client, rootPageId: fake.rootPageId, stored: first.projects });
  assert.deepEqual(second.added, []);
  assert.deepEqual(second.problems, []);
  assert.equal(fake.writes().length, writesBefore, 'a second run writes nothing');
});

test('ensureRoot creates the Projects database when the root page has none', async () => {
  const fake = new FakeNotion();
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const res = await ensureRoot({ client, rootPageId: fake.rootPageId });
  assert.equal(res.created, true);
  const ds = fake.dataSources[res.projects.dataSourceId];
  assert.ok(ds.properties.Project && ds.properties.Key && ds.properties.Status);
  assert.deepEqual(ds.properties.Status.status.options.map((o) => o.name), ['Backlog', 'Planned', 'Active', 'Blocked', 'Complete', 'Archived']);
});

test('ensureRoot refuses a root page it cannot see', async () => {
  const { client } = setup();
  await assert.rejects(ensureRoot({ client, rootPageId: '00000000-0000-0000-0000-000000000000' }), /was not found/);
});

test('ensureProject builds the row, Work Items, Memory, views, and pages', async () => {
  const { fake, client } = setup();
  const cfg = config();
  const { notion, report } = await ensureProject({ client, config: cfg, root: null, mainRoot: '/work/sample-app', rootPageId: fake.rootPageId, now });
  assert.deepEqual(report.problems, []);
  assert.ok(report.created.includes('Work Items database'));
  assert.ok(report.created.includes('Memory page (Lore layout)'));
  assert.ok(report.created.includes('Memories database'));
  const row = fake.pages[notion.project.pageId];
  assert.equal(fake.titleOf(row), 'Sample app');
  const ds = fake.dataSources[notion.workItems.dataSourceId];
  for (const p of workItemProperties()) assert.ok(ds.properties[p.name], `Work Items lacks ${p.name}`);
  assert.equal(ds.properties.Stage.select.options.length, 14);
  assert.deepEqual(ds.properties.Status.status.groups.map((g) => [g.name, g.option_ids.length]), [['To-do', 2], ['In progress', 2], ['Complete', 2]]);
  assert.equal(ds.properties.ID.unique_id.prefix, 'WI');
  assert.equal(ds.properties['Parent item'].relation.dual_property.synced_property_name, 'Sub-items');
  assert.ok(ds.properties['Sub-items'] && ds.properties.Blocking && ds.properties['Blocked by']);
  const views = await listViews(client, notion.workItems.databaseId);
  const board = views.find((v) => v.id === notion.workItems.views.board);
  assert.equal(board.type, 'board');
  assert.ok(samePropertyId(board.configuration.group_by.property_id, notion.workItems.properties.stage));
  const table = views.find((v) => v.id === notion.workItems.views.allItems);
  assert.equal(table.name, 'All items');
  assert.ok(samePropertyId(table.configuration.subtasks.property_id, notion.workItems.properties.parent));
  const mem = fake.dataSources[notion.memory.dataSourceId];
  assert.equal(notion.memory.layout, 'lore');
  for (const p of loreProperties('memories', { projects: 'x', topics: 'x', memories: 'x' })) assert.ok(mem.properties[p.name], `Memories lacks Lore's ${p.name}`);
  for (const p of LORE_MEMORY_ADDED_PROPERTIES) assert.ok(mem.properties[p.name], `Memories lacks ${p.name}`);
  // Focus and glossary stay child pages of the project row, next to the Memory page.
  const kids = (fake.children[notion.project.pageId] || []).map((c) => (c.kind === 'page' ? fake.titleOf(fake.pages[c.id]) : fake.databases[c.id].title[0].text.content));
  assert.deepEqual(kids.sort(), ['Current focus', 'Memory', 'Terminology glossary', 'Work Items']);
  assert.equal(fake.titleOf(fake.pages[notion.memory.pages.focus]), 'Current focus');
  assert.match(fake.pages[notion.memory.pages.focus].markdown, /## Now/);
  assert.equal(fake.titleOf(fake.pages[notion.memory.pages.glossary]), 'Terminology glossary');
  // Registry values on the row.
  const reg = fake.dataSources[notion.projects.dataSourceId];
  const valueOf = (name) => row.properties[name];
  assert.equal(valueOf('Tracker').select.name, 'notion');
  assert.equal(valueOf('Memory system').select.name, 'notion');
  assert.equal(valueOf('Key').rich_text[0].text.content, 'sample-app');
  assert.equal(valueOf('Work items data source').rich_text[0].text.content, notion.workItems.dataSourceId);
  assert.ok(reg);
});

test('ensureProject run again changes nothing and writes nothing', async () => {
  const { fake, client } = setup();
  const cfg = config();
  const first = await ensureProject({ client, config: cfg, mainRoot: '/work/sample-app', rootPageId: fake.rootPageId, now });
  cfg.notion = first.notion;
  const before = fake.writes().length;
  const later = () => new Date('2026-09-30T12:00:00Z');
  const second = await ensureProject({ client, config: cfg, mainRoot: '/work/sample-app', rootPageId: fake.rootPageId, now: later });
  const { verifiedAt, ...report } = second.report;
  assert.ok(verifiedAt);
  assert.deepEqual(report, { created: [], added: [], problems: [], notes: [], trackerPrefix: 'WI' });
  assert.equal(fake.writes().length, before, 'not even the registry values are written again');
  assert.deepEqual(second.notion, first.notion, 'the .toolkit.json block is the same');
  assert.equal(second.notion.verifiedAt, undefined, 'the check time is not in .toolkit.json');
  assert.equal(fake.pages[first.notion.project.pageId].properties['Set up on'].date.start, '2026-09-26', 'Set up on keeps the first date');
});

test('a registry value that changed is written again, and only that one', async () => {
  const { fake, client } = setup();
  const cfg = config();
  const first = await ensureProject({ client, config: cfg, mainRoot: '/work/sample-app', rootPageId: fake.rootPageId, now });
  cfg.notion = first.notion;
  const before = fake.writes().length;
  await ensureProject({ client, config: cfg, mainRoot: '/work/moved-app', rootPageId: fake.rootPageId, now });
  const writes = fake.writes().slice(before);
  assert.equal(writes.length, 1);
  assert.deepEqual(Object.keys(writes[0].body.properties), ['Local path']);
});

test('ensureProject finds the project row by Key when .toolkit.json has no ids (a new clone)', async () => {
  const { fake, client } = setup();
  const first = await ensureProject({ client, config: config(), mainRoot: '/a', rootPageId: fake.rootPageId, now });
  const second = await ensureProject({ client, config: config(), mainRoot: '/b', rootPageId: fake.rootPageId, now });
  assert.equal(second.notion.project.pageId, first.notion.project.pageId);
  assert.equal(second.notion.workItems.databaseId, first.notion.workItems.databaseId, 'found by title under the project page');
  assert.deepEqual(second.report.created, []);
});

test('ensureProject repairs a deleted view, a deleted select option, and a deleted property', async () => {
  const { fake, client } = setup();
  const cfg = config();
  const first = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  cfg.notion = first.notion;
  delete fake.views[first.notion.workItems.views.board];
  const ds = fake.dataSources[first.notion.workItems.dataSourceId];
  ds.properties.Stage.select.options = ds.properties.Stage.select.options.filter((o) => o.name !== '08-build');
  delete ds.properties['Next action'];
  const again = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  assert.ok(again.report.created.includes('Work Items view: Board'));
  assert.ok(again.report.added.includes('Work Items: Stage: 08-build'));
  assert.ok(again.report.added.includes('Work Items: Next action'));
  assert.equal(fake.dataSources[first.notion.workItems.dataSourceId].properties.Stage.select.options.length, 14);
  assert.deepEqual(again.report.problems, []);
});

test('a column Mike renamed is still found by its id', async () => {
  const { fake, client } = setup();
  const cfg = config();
  const first = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  cfg.notion = first.notion;
  await client.updateDataSource(first.notion.workItems.dataSourceId, { properties: { Priority: { name: 'How urgent' } } });
  const again = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  assert.deepEqual(again.report.added, []);
  assert.equal(again.notion.workItems.names.priority, 'How urgent');
});

test('a second project gets its own ID prefix, because Notion allows one database per prefix', async () => {
  const { fake, client } = setup();
  const one = await ensureProject({ client, config: config(), mainRoot: '/a', rootPageId: fake.rootPageId, now });
  assert.equal(one.notion.workItems.idPrefix, 'WI');
  const other = { ...config(), project: { name: 'Billing portal', key: 'billing-portal', owner: 'Mike' } };
  const two = await ensureProject({ client, config: other, mainRoot: '/b', rootPageId: fake.rootPageId, now });
  assert.equal(two.notion.workItems.idPrefix, 'BP');
  assert.equal(two.report.trackerPrefix, 'BP');
  assert.match(two.report.notes[0], /WI is already used/);
  const ds = fake.dataSources[two.notion.workItems.dataSourceId];
  assert.equal(ds.properties.ID.unique_id.prefix, 'BP');
  const again = await ensureProject({ client, config: { ...other, tracker: { type: 'notion', idPrefix: 'BP' }, notion: two.notion }, mainRoot: '/b', rootPageId: fake.rootPageId, now });
  assert.deepEqual(again.report.notes, []);
});

test('prefixCandidates starts with the configured prefix and falls back to the project key', () => {
  assert.deepEqual(prefixCandidates('WI', 'sample-app').slice(0, 4), ['WI', 'SA', 'SAMPLE', 'SAMPLEAPP']);
  assert.deepEqual(prefixCandidates('wi', 'x').slice(0, 2), ['WI', 'X']);
  assert.ok(prefixCandidates('WI', 'toolkit-v2-test').includes('TVT'));
});

test('only the systems in use get a database', async () => {
  const { fake, client } = setup();
  const res = await ensureProject({ client, config: config('local', 'notion'), mainRoot: '/w', rootPageId: fake.rootPageId, now });
  assert.equal(res.notion.workItems, undefined);
  assert.ok(res.notion.memory);
  const res2 = await ensureProject({ client, config: { ...config('local', 'builtin'), project: { name: 'Other', key: 'other' } }, mainRoot: '/w2', rootPageId: fake.rootPageId, now });
  assert.equal(res2.notion.workItems, undefined);
  assert.equal(res2.notion.memory, undefined);
  assert.ok(res2.notion.project.pageId, 'a registry row is still made');
});

test('--check reports what is missing and writes nothing', async () => {
  const { fake, client } = setup();
  const before = fake.writes().length;
  const res = await ensureProject({ client, config: config(), mainRoot: '/w', rootPageId: fake.rootPageId, check: true, now });
  assert.equal(fake.writes().length, before);
  assert.ok(res.report.problems.some((p) => /registry|Key|no row/i.test(p)));
});

test('the recorded Work Items schema from Notion has what the toolkit expects', () => {
  const ds = recorded('work-items-data-source.json');
  const names = Object.keys(ds.properties);
  for (const p of workItemProperties()) {
    if (p.key === 'designApproved') continue; // added after the recording
    assert.ok(names.includes(p.name), `recorded schema lacks ${p.name}`);
  }
  assert.equal(ds.properties['Parent item'].relation.dual_property.synced_property_name, 'Sub-items');
  const board = recorded('work-items-board-view.json');
  assert.ok(samePropertyId(board.configuration.group_by.property_id, ds.properties.Stage.id));
  const table = recorded('work-items-table-view.json');
  assert.ok(samePropertyId(table.configuration.subtasks.property_id, ds.properties['Parent item'].id));
});

// ------------------------------------------------------------------ scope: stored ids outside the root page

/** A top-level page next to the root page (outside it), with a database on it. */
function outsideArea(fake) {
  const other = fake.addPage({ parent: { type: 'workspace', workspace: true }, title: 'Someone else\'s page' });
  const db = fake.route('POST', 'v1/databases', {
    parent: { type: 'page_id', page_id: other.id },
    title: [{ type: 'text', text: { content: 'Work Items' } }],
    is_inline: true,
    initial_data_source: { properties: { Name: { title: {} } } },
  }, {});
  const page = fake.addPage({ parent: { type: 'page_id', page_id: other.id }, title: 'Outside page' });
  return { other, db, dataSourceId: db.data_sources[0].id, page };
}

function touches(fake, ids, from = 0) {
  return fake.writes().slice(from).filter((c) => ids.some((id) => JSON.stringify(c).includes(id)));
}

test('a stored Work Items database outside the root page is not used or changed', async () => {
  const { fake, client } = setup();
  const cfg = config();
  const first = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  const out = outsideArea(fake);
  cfg.notion = { ...first.notion, workItems: { ...first.notion.workItems, databaseId: out.db.id, dataSourceId: out.dataSourceId } };
  const before = fake.writes().length;
  const again = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  assert.deepEqual(touches(fake, [out.db.id, out.dataSourceId, out.other.id], before), [], 'nothing outside the root page was written');
  assert.deepEqual(Object.keys(fake.dataSources[out.dataSourceId].properties), ['Name']);
  assert.ok(again.report.problems.some((p) => /stored Work Items database .* is outside the root page, so it was not used/.test(p)));
  assert.equal(again.notion.workItems.databaseId, first.notion.workItems.databaseId, 'the Work Items database on the project page is found by its title');
});

test('a stored Work Items database outside the root page is replaced by a new one when the project page has none', async () => {
  const { fake, client } = setup();
  const out = outsideArea(fake);
  const cfg = config('notion', 'builtin');
  const res = await ensureProject({ client, config: { ...cfg, notion: { workItems: { databaseId: out.db.id } } }, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  assert.equal(touches(fake, [out.db.id, out.dataSourceId, out.other.id]).length, 0);
  assert.notEqual(res.notion.workItems.databaseId, out.db.id);
  assert.equal(fake.databases[res.notion.workItems.databaseId].parent.page_id, res.notion.project.pageId);
});

test('a stored project page outside the root page is not used, and nothing is created under it', async () => {
  const { fake, client } = setup();
  const out = outsideArea(fake);
  const cfg = { ...config(), notion: { project: { pageId: out.page.id } } };
  const res = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  assert.equal(touches(fake, [out.page.id, out.other.id]).length, 0, 'nothing was written to or under the outside page');
  assert.equal((fake.children[out.page.id] || []).length, 0);
  assert.notEqual(res.notion.project.pageId, out.page.id);
  assert.ok(res.report.problems.some((p) => /stored project row .* not a row of the Projects database under the root page/.test(p)));
  assert.ok(res.report.created.some((c) => /Project row/.test(c)));
});

test('stored focus and glossary pages outside the root page are not used', async () => {
  const { fake, client } = setup();
  const cfg = config('local', 'notion');
  const first = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  const out = outsideArea(fake);
  cfg.notion = { ...first.notion, memory: { ...first.notion.memory, pages: { focus: out.page.id, glossary: first.notion.memory.pages.glossary } } };
  const again = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  assert.equal(again.notion.memory.pages.focus, first.notion.memory.pages.focus);
  assert.ok(again.report.problems.some((p) => /Current focus page .* is outside the root page/.test(p)));
});

test('--check with stored ids outside the root page reports them and writes nothing', async () => {
  const { fake, client } = setup();
  const cfg = config();
  const first = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  const out = outsideArea(fake);
  cfg.notion = { ...first.notion, workItems: { ...first.notion.workItems, databaseId: out.db.id } };
  const before = fake.writes().length;
  const res = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, check: true, now });
  assert.equal(fake.writes().length, before);
  assert.ok(res.report.problems.some((p) => /outside the root page/.test(p)));
});

test('a stored Projects database outside the root page is not used', async () => {
  const { fake, client, projects } = setup();
  const out = outsideArea(fake);
  const res = await ensureRoot({ client, rootPageId: fake.rootPageId, stored: { databaseId: out.db.id } });
  assert.equal(res.projects.databaseId, projects.databaseId, 'the Projects database on the root page is found by its title');
  assert.ok(res.problems.some((p) => /stored Projects database .* outside the root page/.test(p)));
  assert.equal(touches(fake, [out.db.id, out.dataSourceId]).length, 0);
});

test('a Projects database named on the command line must be under the root page and is never replaced', async () => {
  const { fake, client, projects } = setup();
  const out = outsideArea(fake);
  await assert.rejects(ensureRoot({ client, rootPageId: fake.rootPageId, projectsDatabaseId: out.db.id }), (err) => err.code === 2 && /not under the root page/.test(err.message));
  await assert.rejects(ensureRoot({ client, rootPageId: fake.rootPageId, projectsDatabaseId: '11111111-2222-3333-4444-555555555555' }), (err) => err.code === 2 && /was not found/.test(err.message));
  const before = Object.keys(fake.databases).length;
  const res = await ensureRoot({ client, rootPageId: fake.rootPageId, projectsDatabaseId: projects.databaseId });
  assert.equal(res.projects.databaseId, projects.databaseId);
  assert.equal(Object.keys(fake.databases).length, before, 'no second Projects database');
});

test('a copied .toolkit.json whose row belongs to another project leaves that row alone', async () => {
  const { fake, client } = setup();
  const one = await ensureProject({ client, config: config(), mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  const rowOne = fake.pages[one.notion.project.pageId];
  const snapshot = JSON.stringify(rowOne.properties);
  const copy = { ...config(), project: { name: 'Copy', key: 'proj-copy', owner: 'Mike' }, notion: one.notion };
  const before = fake.writes().length;
  const res = await ensureProject({ client, config: copy, mainRoot: '/p4', rootPageId: fake.rootPageId, now });
  assert.equal(JSON.stringify(rowOne.properties), snapshot, 'the other project\'s row is unchanged');
  assert.equal(touches(fake, [one.notion.project.pageId, one.notion.workItems.dataSourceId, one.notion.memory.dataSourceId], before).length, 0);
  assert.notEqual(res.notion.project.pageId, one.notion.project.pageId);
  assert.notEqual(res.notion.workItems.databaseId, one.notion.workItems.databaseId, 'the copy gets its own Work Items database');
  assert.notEqual(res.notion.memory.databaseId, one.notion.memory.databaseId);
  assert.ok(res.report.notes.some((n) => /Key "sample-app", not "proj-copy"/.test(n)));
  const rowCopy = fake.pages[res.notion.project.pageId];
  assert.equal(rowCopy.properties.Key.rich_text[0].text.content, 'proj-copy');
  assert.equal(rowCopy.properties['Local path'].rich_text[0].text.content, '/p4');
  assert.deepEqual(res.report.problems, []);
});

test('a stored row with an empty Key is still used and gets the Key', async () => {
  const { fake, client } = setup();
  const one = await ensureProject({ client, config: config(), mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  fake.pages[one.notion.project.pageId].properties.Key.rich_text = [];
  const again = await ensureProject({ client, config: { ...config(), notion: one.notion }, mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  assert.equal(again.notion.project.pageId, one.notion.project.pageId);
  assert.equal(fake.pages[one.notion.project.pageId].properties.Key.rich_text[0].text.content, 'sample-app');
});

test('a select option added back keeps the descriptions of the options already there', async () => {
  const { fake, client } = setup();
  const cfg = config('notion', 'builtin');
  const first = await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  cfg.notion = first.notion;
  const ds = fake.dataSources[first.notion.workItems.dataSourceId];
  ds.properties.Stage.select.options = ds.properties.Stage.select.options.filter((o) => o.name !== '08-build');
  const before = fake.writes().length;
  await ensureProject({ client, config: cfg, mainRoot: '/w', rootPageId: fake.rootPageId, now });
  const patch = fake.writes().slice(before).find((c) => c.method === 'PATCH' && c.body && c.body.properties && c.body.properties.Stage);
  const sent = patch.body.properties.Stage.select.options;
  const kept = sent.filter((o) => o.id);
  assert.ok(kept.length >= 13);
  assert.ok(kept.every((o) => o.description), 'every existing option is sent with its description');
});
