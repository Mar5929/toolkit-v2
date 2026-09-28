// ensure-root and ensure-project fixes from the Notion rebuild check and the
// 2026-09-26 archive of Mike's root page: the registry columns in the "All
// Projects" view, Status Active on the project row, archived and trashed pages
// told apart, an archived project row never replaced by a new one, and a row
// made with the New button used instead of a second row.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureRoot, ensureProject, goneState } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES, PROJECTS_REGISTRY_PROPERTIES } from '../../lib/notion/schema.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';

function config(extra = {}) {
  return {
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: 'local', idPrefix: 'WI' },
    memory: { type: 'builtin', approval: 'onboarding' },
    salesforce: { enabled: false },
    notion: {},
    ...extra,
  };
}

function setup() {
  const fake = new FakeNotion();
  const projects = seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  return { fake, projects, client };
}

const now = () => new Date('2026-09-28T12:00:00Z');
const rows = (fake, projects) => Object.values(fake.pages).filter((p) => p.parent && p.parent.data_source_id === projects.dataSourceId);
const title = (s) => ({ title: [{ type: 'text', text: { content: s } }] });

/** The seeded Projects database's only view, set up like Mike's "All Projects" table. */
function allProjectsView(fake, projects) {
  const view = Object.values(fake.views).find((v) => v.parent.database_id === projects.databaseId);
  const ds = fake.dataSources[projects.dataSourceId];
  view.name = 'All Projects';
  view.configuration = {
    type: 'table',
    properties: ['Project', 'Status', 'Priority', 'Owner'].map((n) => ({ property_id: decodeURIComponent(ds.properties[n].id), visible: true })),
  };
  return view;
}

test('goneState tells the trash from Notion\'s archive', () => {
  assert.equal(goneState({ in_trash: true, is_archived: false }), 'trash');
  assert.equal(goneState({ in_trash: false, is_archived: true }), 'archived');
  assert.equal(goneState({ archived: true }), 'trash', 'the older API word for the trash');
  assert.equal(goneState({ in_trash: false, is_archived: false }), null);
});

test('ensure-root adds the registry columns to the "All Projects" view once, and keeps a column Mike hid', async () => {
  const { fake, projects, client } = setup();
  const view = allProjectsView(fake, projects);
  const first = await ensureRoot({ client, rootPageId: fake.rootPageId });
  assert.deepEqual(first.problems, []);
  const shown = view.configuration.properties;
  const ds = fake.dataSources[projects.dataSourceId];
  for (const p of PROJECTS_REGISTRY_PROPERTIES) {
    const id = decodeURIComponent(ds.properties[p.name].id);
    assert.ok(shown.some((q) => q.property_id === id && q.visible), `${p.name} is shown`);
  }
  assert.deepEqual(shown.slice(0, 4).map((q) => q.visible), [true, true, true, true], 'the columns already there are kept, in order');
  assert.ok(first.added.includes('All Projects view: Key'), first.added.join('; '));
  // A second run writes nothing, and a hidden registry column stays hidden.
  const keyId = decodeURIComponent(ds.properties.Key.id);
  view.configuration.properties = view.configuration.properties.map((q) => (q.property_id === keyId ? { ...q, visible: false } : q));
  const before = fake.writes().length;
  const second = await ensureRoot({ client, rootPageId: fake.rootPageId, stored: first.projects });
  assert.deepEqual(second.added, []);
  assert.equal(fake.writes().length, before);
  assert.equal(view.configuration.properties.find((q) => q.property_id === keyId).visible, false);
  // --check reports a missing column and writes nothing.
  view.configuration.properties = view.configuration.properties.filter((q) => q.property_id !== keyId);
  const check = await ensureRoot({ client, rootPageId: fake.rootPageId, stored: first.projects, check: true });
  assert.ok(check.problems.some((p) => /"All Projects" view of the Projects database does not show the columns Key/.test(p)), check.problems.join('\n'));
  assert.equal(fake.writes().length, before);
});

test('adding the registry columns sends the view\'s whole configuration back, so its other settings are kept', async () => {
  const { fake, projects, client } = setup();
  const view = allProjectsView(fake, projects);
  view.configuration.wrap_cells = true;
  view.configuration.frozen_column_index = 1;
  const sent = [];
  const real = client.updateView.bind(client);
  client.updateView = async (id, body) => {
    sent.push(JSON.parse(JSON.stringify(body)));
    return real(id, body);
  };
  await ensureRoot({ client, rootPageId: fake.rootPageId });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].configuration.type, 'table');
  assert.equal(sent[0].configuration.wrap_cells, true, 'a Notion that replaces the configuration keeps wrap_cells');
  assert.equal(sent[0].configuration.frozen_column_index, 1);
  assert.equal(sent[0].configuration.properties.length, 4 + PROJECTS_REGISTRY_PROPERTIES.length);
});

test('a new project row is Active; a row with no Status gets Active; a Status Mike set is kept', async () => {
  const { fake, projects, client } = setup();
  const res = await ensureProject({ client, config: config(), mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  assert.equal(fake.pages[res.notion.project.pageId].properties.Status.status.name, 'Active');
  // A row made before this fix.
  fake.pages[res.notion.project.pageId].properties.Status.status = null;
  const again = await ensureProject({ client, config: { ...config(), notion: res.notion }, mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  assert.equal(fake.pages[res.notion.project.pageId].properties.Status.status.name, 'Active');
  assert.ok(again.report.notes.includes('The project row had no Status; it is now Active.'));
  fake.pages[res.notion.project.pageId].properties.Status.status = { name: 'Planned', color: 'blue' };
  await ensureProject({ client, config: { ...config(), notion: res.notion }, mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  assert.equal(fake.pages[res.notion.project.pageId].properties.Status.status.name, 'Planned');
  assert.equal(rows(fake, projects).length, 1);
});

test('an archived root page and a trashed one get different messages and fixes', async () => {
  const { fake, client } = setup();
  fake.pages[fake.rootPageId].is_archived = true;
  await assert.rejects(ensureRoot({ client, rootPageId: fake.rootPageId }), (err) => {
    assert.match(err.message, /is archived in Notion \(it is not in the trash\)\.$/);
    assert.match(err.details.fix, /restore it from the archive/);
    return true;
  });
  fake.pages[fake.rootPageId].is_archived = false;
  fake.pages[fake.rootPageId].in_trash = true;
  await assert.rejects(ensureRoot({ client, rootPageId: fake.rootPageId }), (err) => {
    assert.match(err.message, /is in the Notion trash\.$/);
    assert.match(err.details.fix, /Restore it from the trash/);
    return true;
  });
});

test('an archived project row is never replaced by a new row, whether it is stored or found by its Key', async () => {
  const { fake, projects, client } = setup();
  const first = await ensureProject({ client, config: config(), mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  const row = fake.pages[first.notion.project.pageId];
  row.is_archived = true;
  const stored = await ensureProject({ client, config: { ...config(), notion: first.notion }, mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  assert.equal(rows(fake, projects).length, 1, 'no second row');
  assert.ok(stored.report.problems.some((p) => /stored in \.toolkit\.json, is archived in Notion \(it is not in the trash\)\. Its page holds this project's work items and memory, so no new row was made\./.test(p)), stored.report.problems.join('\n'));
  assert.deepEqual(stored.notion, first.notion, 'the .toolkit.json block is left as it was');
  // A new clone, with no ids: the row is found by its Key.
  const byKey = await ensureProject({ client, config: config(), mainRoot: '/p2', rootPageId: fake.rootPageId, now });
  assert.equal(rows(fake, projects).length, 1);
  assert.ok(byKey.report.problems.some((p) => /found by its Key "sample-app", is archived in Notion/.test(p)), byKey.report.problems.join('\n'));
});

test('a row made with the New button (no Key) is used instead of a second row; two such rows are a question', async () => {
  const { fake, projects, client } = setup();
  await ensureRoot({ client, rootPageId: fake.rootPageId });
  const made = await client.createPage({ parent: { type: 'data_source_id', data_source_id: projects.dataSourceId }, properties: { Project: title('Sample app') } });
  const res = await ensureProject({ client, config: config(), mainRoot: '/p1', rootPageId: fake.rootPageId, now });
  assert.equal(res.notion.project.pageId.replace(/-/g, ''), made.id.replace(/-/g, ''));
  assert.equal(rows(fake, projects).length, 1);
  assert.equal(fake.pages[made.id].properties.Key.rich_text[0].text.content, 'sample-app');
  assert.ok(res.report.notes.some((n) => /Used the row "Sample app" made in Notion with the New button \(it had no Key\)\. Its Key is now sample-app\./.test(n)), res.report.notes.join('\n'));

  const other = setup();
  await ensureRoot({ client: other.client, rootPageId: other.fake.rootPageId });
  for (let i = 0; i < 2; i++) await other.client.createPage({ parent: { type: 'data_source_id', data_source_id: other.projects.dataSourceId }, properties: { Project: title('Sample app') } });
  const two = await ensureProject({ client: other.client, config: config(), mainRoot: '/p1', rootPageId: other.fake.rootPageId, now });
  assert.equal(rows(other.fake, other.projects).length, 2, 'no third row');
  assert.ok(two.report.problems.some((p) => /2 rows in the Projects database are named "Sample app" and have no Key/.test(p)), two.report.problems.join('\n'));
});
