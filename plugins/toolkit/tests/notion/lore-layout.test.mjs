// Notion memory in Lore's layout, against the fake Notion: the structure Lore
// expects (dev/research/lore.md sections 3 and 8, option C), how a toolkit
// record maps to a Memories row, and the move of an older project from the
// single Memory database into the Lore layout.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureProject } from '../../lib/notion/ensure.mjs';
import {
  PROJECTS_BASE_PROPERTIES, MEMORY_PROPERTIES, LORE_MEMORY_ADDED_PROPERTIES, RECORD_TYPE_TAGS, OLD_MEMORY_DATABASE_TITLE,
} from '../../lib/notion/schema.mjs';
import { VAULT_DATABASES, VAULT_TITLES, loreProperties, loreTagOptions, LORE_COMMIT } from '../../lib/notion/lore-schema.mjs';
import { createDriver } from '../../lib/memory/notion.mjs';
import { writeValue } from '../../lib/notion/props.mjs';
import { FakeNotion, fakeRunner, seedProjects } from './fake-notion.mjs';

const now = () => new Date('2026-09-26T12:00:00');
const LATER = () => Date.parse('2026-09-27T12:00:00Z');

function config(memory = 'notion') {
  return {
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: 'local' },
    memory: { type: memory, approval: 'onboarding' },
    salesforce: { enabled: false },
    notion: {},
  };
}

function base() {
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-lore-'));
  return { fake, client, root };
}

async function loreProject() {
  const { fake, client, root } = base();
  const cfg = config();
  const res = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now });
  cfg.notion = res.notion;
  const driver = await createDriver({ root, mainRoot: root, config: cfg, env: {}, now, client, clock: LATER });
  return { fake, client, root, cfg, res, driver };
}

const plain = (rich) => (Array.isArray(rich) ? rich.map((r) => r.plain_text ?? (r.text && r.text.content) ?? '').join('') : '');
const recordKeyOf = (page) => plain(((page.properties || {})['Record Key'] || {}).rich_text);
const rowOf = (fake, key) => Object.values(fake.pages).find((p) => !p.in_trash && recordKeyOf(p) === key);
const value = (page, name) => (page.properties || {})[name];
const childDatabases = (fake, pageId) => (fake.children[pageId] || []).filter((c) => c.kind === 'database' && !fake.databases[c.id].in_trash).map((c) => fake.databases[c.id]);

// ------------------------------------------------------------------ the structure Lore expects

test('the Memory page holds exactly Lore\'s five databases, with Lore\'s titles, in Lore\'s order', async () => {
  const { fake, res } = await loreProject();
  const m = res.notion.memory;
  assert.equal(m.layout, 'lore');
  assert.equal(m.lore.commit, LORE_COMMIT);
  const page = fake.pages[m.pageId];
  assert.equal(fake.titleOf(page), 'Memory');
  assert.equal(page.parent.page_id, res.notion.project.pageId, 'the Memory page is a child of the project row');
  assert.match(page.markdown, /layout of Lore/);
  const dbs = childDatabases(fake, m.pageId);
  assert.deepEqual(dbs.map((d) => plain(d.title)), ['Projects', 'Topics', 'Memories', 'Entities', 'Facts']);
  for (const which of VAULT_DATABASES) assert.equal(m.databases[which].databaseId, dbs.find((d) => plain(d.title) === VAULT_TITLES[which]).id);
  assert.equal(m.databaseId, m.databases.memories.databaseId);
  assert.equal(m.dataSourceId, m.databases.memories.dataSourceId);
});

test('every Lore property is there with Lore\'s type, options, and relation target (Lore\'s drift check finds nothing)', async () => {
  const { fake, res } = await loreProject();
  const m = res.notion.memory;
  const ids = Object.fromEntries(VAULT_DATABASES.map((w) => [w, m.databases[w].dataSourceId]));
  for (const which of VAULT_DATABASES) {
    const live = fake.dataSources[ids[which]].properties;
    for (const want of loreProperties(which, ids)) {
      const type = Object.keys(want.spec)[0];
      const got = live[want.name];
      assert.ok(got, `${VAULT_TITLES[which]} lacks ${want.name}`);
      assert.equal(got.type, type, `${VAULT_TITLES[which]}.${want.name} type`);
      if (type === 'select' || type === 'multi_select') {
        const have = got[type].options.map((o) => o.name);
        for (const o of want.spec[type].options) assert.ok(have.includes(o.name), `${VAULT_TITLES[which]}.${want.name} lacks the option ${o.name}`);
      }
      if (type === 'relation') {
        assert.equal(got.relation.data_source_id, want.spec.relation.data_source_id, `${VAULT_TITLES[which]}.${want.name} points at the wrong database`);
        assert.equal(got.relation.type, want.spec.relation.type, `${VAULT_TITLES[which]}.${want.name} relation kind`);
      }
    }
  }
  const mem = fake.dataSources[ids.memories].properties;
  assert.equal(mem.Supersedes.relation.data_source_id, ids.memories);
  assert.equal(mem.Topic.relation.data_source_id, ids.topics);
  assert.equal(fake.dataSources[ids.facts].properties.SubjectEntity.relation.data_source_id, ids.entities);
  // Tags: Lore's 40 default tags plus the five record types.
  assert.deepEqual(mem.Tags.multi_select.options.map((o) => o.name), [...loreTagOptions().map((o) => o.name), ...RECORD_TYPE_TAGS.map((o) => o.name)]);
  for (const p of LORE_MEMORY_ADDED_PROPERTIES) assert.ok(mem[p.name], `Memories lacks the toolkit column ${p.name}`);
  assert.deepEqual(Object.keys(res.notion.memory.properties).sort(), [
    'agent', 'author', 'authorization', 'extra', 'keywords', 'kind', 'lastEdited', 'lastVerified', 'project', 'recordKey',
    'saved', 'source', 'sourceNote', 'status', 'supersededBy', 'supersedes', 'synopsis', 'tags', 'title',
  ]);
});

test('the Memory page\'s Projects database has one row for the project, found by Path "."', async () => {
  const { fake, res } = await loreProject();
  const m = res.notion.memory;
  const rows = Object.values(fake.pages).filter((p) => p.parent && p.parent.data_source_id === m.databases.projects.dataSourceId);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, m.projectRowId);
  assert.equal(fake.titleOf(rows[0]), 'Sample app');
  assert.equal(value(rows[0], 'Type').select.name, 'project');
  assert.equal(plain(value(rows[0], 'Path').rich_text), '.');
  assert.equal(value(rows[0], 'Status').select.name, 'active');
});

test('the Memories database has the Index and Retired views', async () => {
  const { fake, res } = await loreProject();
  const views = Object.values(fake.views).filter((v) => v.parent.database_id === res.notion.memory.databaseId);
  assert.deepEqual(views.map((v) => v.name).sort(), ['Index', 'Retired']);
  const index = views.find((v) => v.name === 'Index');
  assert.deepEqual(index.filter.and.map((f) => f.select.does_not_equal), ['superseded', 'deprecated', 'rejected']);
  assert.equal(index.sorts[0].property, res.notion.memory.properties.recordKey);
});

test('ensure-project repairs a removed Lore property, a removed Tags option, and a removed database, and reports a relation to the wrong database', async () => {
  const { fake, client, root, cfg, res } = await loreProject();
  const m = res.notion.memory;
  const mem = fake.dataSources[m.dataSourceId];
  delete mem.properties.Pinned;
  mem.properties.Tags.multi_select.options = mem.properties.Tags.multi_select.options.filter((o) => o.name !== 'gotcha');
  fake.databases[m.databases.facts.databaseId].in_trash = true;
  const again = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now });
  assert.ok(again.report.added.includes('Memories: Pinned'), again.report.added.join('; '));
  assert.ok(again.report.added.includes('Memories: Tags: gotcha'));
  assert.ok(again.report.created.includes('Facts database'));
  assert.deepEqual(again.report.problems, []);
  assert.notEqual(again.notion.memory.databases.facts.databaseId, m.databases.facts.databaseId);
  assert.deepEqual(childDatabases(fake, m.pageId).map((d) => plain(d.title)), ['Projects', 'Topics', 'Memories', 'Entities', 'Facts']);
  // A relation that points at another database is reported, not changed.
  const topic = fake.dataSources[m.dataSourceId].properties.Topic;
  topic.relation.data_source_id = m.databases.entities.dataSourceId;
  const third = await ensureProject({ client, config: { ...cfg, notion: again.notion }, mainRoot: root, rootPageId: fake.rootPageId, now });
  assert.ok(third.report.problems.some((p) => /"Topic" points at another database/.test(p)), third.report.problems.join('\n'));
  assert.equal(topic.relation.data_source_id, m.databases.entities.dataSourceId);
});

test('--check on a new project reports the missing Memory page and writes nothing', async () => {
  const { fake, client, root } = base();
  const first = await ensureProject({ client, config: config('builtin'), mainRoot: root, rootPageId: fake.rootPageId, now });
  const cfg = { ...config(), notion: first.notion };
  const before = fake.writes().length;
  const res = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now, check: true });
  assert.equal(fake.writes().length, before);
  assert.ok(res.report.problems.includes('The Memory page (Lore layout) is missing.'));
});

// ------------------------------------------------------------------ a record as a Memories row

const BODY = '# Tuesday deploys\n\n**Remember:** Deploys happen only on Tuesday mornings.\n\n**Why:** The on-call person is free then.\n';
const INPUT = { type: 'feedback', name: 'deploy-window', description: 'Deploy only on Tuesday mornings', source: 'Mike, 2026-09-26', approved_by: 'Mike', body: BODY };

test('a saved record fills Lore\'s columns as option C says, and the toolkit columns', async () => {
  const { fake, driver, res } = await loreProject();
  await driver.save(INPUT);
  const row = rowOf(fake, 'feedback_deploy_window');
  assert.equal(fake.titleOf(row), 'Tuesday deploys', 'Title is the body\'s "# Title" line');
  assert.equal(plain(value(row, 'Keywords').rich_text), 'feedback_deploy_window');
  assert.equal(plain(value(row, 'Record Key').rich_text), 'feedback_deploy_window');
  assert.equal(plain(value(row, 'Synopsis').rich_text), 'Deploy only on Tuesday mornings');
  assert.equal(value(row, 'Kind').select.name, 'note');
  assert.deepEqual(value(row, 'Tags').multi_select.map((o) => o.name), ['feedback']);
  assert.equal(value(row, 'Status').select.name, 'accepted');
  assert.equal(value(row, 'Source').select.name, 'manual');
  assert.equal(plain(value(row, 'Author').rich_text), 'Mike');
  assert.deepEqual(value(row, 'Project').relation.map((r) => r.id), [res.notion.memory.projectRowId]);
  assert.equal(plain(value(row, 'Source note').rich_text), 'Mike, 2026-09-26');
  assert.equal(plain(value(row, 'Authorization').rich_text), 'Approved by Mike on 2026-09-26');
  assert.equal(plain(value(row, 'Last verified').rich_text), '2026-09-26');
  assert.equal(value(row, 'Saved').date.start, '2026-09-26');
  assert.equal(plain(value(row, 'Other fields').rich_text), '');
  assert.ok(row.markdown.startsWith('**Remember:**'), 'the page body is the record body without its title line');
});

test('Status follows the record: needs-review is proposed, superseded is superseded, archived is deprecated; Supersedes points at the rows', async () => {
  const { fake, driver } = await loreProject();
  await driver.save(INPUT);
  await driver.save({ type: 'project', name: 'release-days', description: 'Releases go out any weekday', source: 'Mike, 2026-09-26', body: '**Remember:** Any weekday.\n' });
  await driver.save({ type: 'user', name: 'prefers-short', description: 'Mike likes short replies', source: 'Mike, 2026-09-26', status: 'needs-review', body: '**Remember:** Short replies.\n' });
  assert.equal(value(rowOf(fake, 'user_prefers_short'), 'Status').select.name, 'proposed');
  const r = await driver.retire('feedback_deploy_window', { supersededBy: 'project_release_days', reason: 'Replaced.' });
  assert.equal(r.record.status, 'retired');
  const old = rowOf(fake, 'feedback_deploy_window');
  assert.equal(value(old, 'Status').select.name, 'superseded');
  assert.equal(plain(value(old, 'Superseded by').rich_text), 'project_release_days');
  const successor = rowOf(fake, 'project_release_days');
  assert.deepEqual(value(successor, 'Supersedes').relation.map((x) => x.id), [old.id], 'the relation points at the row it replaced');
  assert.equal(plain(value(successor, 'Other fields').rich_text), '', 'the keys are not kept twice');
  assert.deepEqual((await driver.get('project_release_days')).supersedes, ['feedback_deploy_window']);
  await driver.retire('user_prefers_short', { reason: 'Not true.' });
  assert.equal(value(rowOf(fake, 'user_prefers_short'), 'Status').select.name, 'deprecated');
  assert.equal((await driver.get('user_prefers_short')).stored_status, 'archived');
  await driver.restore('user_prefers_short');
  assert.equal(value(rowOf(fake, 'user_prefers_short'), 'Status').select.name, 'proposed');
});

test('a supersedes key with no row is kept in Other fields, and the text reads back the same', async () => {
  const { fake, driver } = await loreProject();
  const res = await driver.save({ ...INPUT, supersedes: ['feedback_gone_rule'] });
  const row = rowOf(fake, 'feedback_deploy_window');
  assert.deepEqual(value(row, 'Supersedes').relation, []);
  assert.deepEqual(JSON.parse(plain(value(row, 'Other fields').rich_text)), { supersedes: ['feedback_gone_rule'] });
  const got = await driver.get('feedback_deploy_window');
  assert.deepEqual(got.supersedes, ['feedback_gone_rule']);
  assert.equal(got.version, res.version);
  assert.match(got.text, /\nsupersedes: feedback_gone_rule\n/);
});

test('metadata keys and other frontmatter keys are kept in Other fields', async () => {
  const { fake, driver } = await loreProject();
  const res = await driver.save({ ...INPUT, metadata: { type: 'feedback', origin: 'import' }, extra: { reviewer: 'Mike' } });
  const row = rowOf(fake, 'feedback_deploy_window');
  assert.deepEqual(JSON.parse(plain(value(row, 'Other fields').rich_text)), { reviewer: 'Mike', metadata: { type: 'feedback', origin: 'import' } });
  const got = await driver.get('feedback_deploy_window');
  assert.equal(got.version, res.version);
  assert.match(got.text, /\nmetadata:\n  type: feedback\n  origin: import\n/);
  assert.match(got.text, /\nreviewer: Mike\n/);
});

test('rows Lore\'s own tools make are left out of list and find, named by status, and never changed', async () => {
  const { fake, client, driver, res } = await loreProject();
  await driver.save(INPUT);
  const m = res.notion.memory;
  const lore = await client.createPage({
    parent: { type: 'data_source_id', data_source_id: m.dataSourceId },
    properties: { title: writeValue('title', 'Session synopsis: deploys'), [m.properties.kind]: writeValue('select', 'note'), [m.properties.source]: writeValue('select', 'autosave_learning') },
    markdown: 'Deploys went out on a Tuesday.',
  });
  assert.deepEqual((await driver.list({ status: 'all' })).map((r) => r.key), ['feedback_deploy_window']);
  assert.deepEqual((await driver.find('tuesday')).results.map((r) => r.key), ['feedback_deploy_window']);
  const s = await driver.status();
  assert.equal(s.healthy, true);
  assert.equal(s.problems.length, 1);
  assert.match(s.problems[0].problem, /"Session synopsis: deploys"\) has no Record Key/);
  const before = fake.writes().filter((c) => c.path.includes(lore.id)).length;
  await driver.save({ ...INPUT, description: 'Changed' }, { expect: (await driver.get('feedback_deploy_window')).version });
  assert.equal(fake.writes().filter((c) => c.path.includes(lore.id)).length, before);
});

test('tags added in Notion or by Lore stay when the toolkit saves the record again', async () => {
  const { fake, client, driver, res } = await loreProject();
  const first = await driver.save(INPUT);
  const row = rowOf(fake, 'feedback_deploy_window');
  await client.updatePage(row.id, { properties: { [res.notion.memory.properties.tags]: { multi_select: [{ name: 'feedback' }, { name: 'deployment' }] } } });
  await driver.save({ ...INPUT, description: 'Changed' }, { expect: first.version });
  assert.deepEqual(value(rowOf(fake, 'feedback_deploy_window'), 'Tags').multi_select.map((o) => o.name), ['feedback', 'deployment']);
  assert.equal((await driver.get('feedback_deploy_window')).type, 'feedback');
});

// ------------------------------------------------------------------ moving an older project

/**
 * A project set up before the Lore layout: one "Memory" database on its row
 * (the older schema), the focus and glossary pages beside it, and records
 * saved by the driver in that layout.
 */
async function oldProject({ stored = true } = {}) {
  const { fake, client, root } = base();
  const first = await ensureProject({ client, config: config('builtin'), mainRoot: root, rootPageId: fake.rootPageId, now });
  const projectPageId = first.notion.project.pageId;
  const props = Object.fromEntries(MEMORY_PROPERTIES.map((p) => [p.name, p.spec]));
  const db = fake.route('POST', 'v1/databases', {
    parent: { type: 'page_id', page_id: projectPageId }, title: [{ type: 'text', text: { content: 'Memory' } }], is_inline: true, initial_data_source: { properties: props },
  }, {});
  const dataSourceId = db.data_sources[0].id;
  const ds = fake.dataSources[dataSourceId];
  const focus = fake.addPage({ parent: { type: 'page_id', page_id: projectPageId }, title: 'Current focus', markdown: '## Now\n- WI-001.' });
  const glossary = fake.addPage({ parent: { type: 'page_id', page_id: projectPageId }, title: 'Terminology glossary', markdown: '| Term | Meaning |\n| --- | --- |\n| WI | Work item |' });
  const old = {
    databaseId: db.id,
    dataSourceId,
    url: db.url,
    properties: Object.fromEntries(MEMORY_PROPERTIES.map((p) => [p.key, ds.properties[p.name].id])),
    names: Object.fromEntries(MEMORY_PROPERTIES.map((p) => [p.key, p.name])),
    views: {},
    pages: { focus: focus.id, glossary: glossary.id },
  };
  const cfg = { ...config(), notion: { ...first.notion, memory: old } };
  const legacy = await createDriver({ root, mainRoot: root, config: cfg, env: {}, now, client, clock: LATER });
  assert.equal(legacy.lore, false);
  await legacy.save(INPUT);
  await legacy.save({ type: 'project', name: 'release-days', description: 'Releases go out any weekday', source: 'Mike, 2026-09-26', body: '**Remember:** Any weekday.\n\n| Day | Ok |\n| --- | --- |\n| Monday | yes |\n' });
  await legacy.retire('feedback_deploy_window', { supersededBy: 'project_release_days', reason: 'Replaced.' });
  await legacy.save({ type: 'reference', name: 'links', description: 'Where the docs are', source: 'Mike, 2026-09-26', metadata: { type: 'reference', origin: 'import' }, extra: { reviewer: 'Mike' }, body: '**Remember:** docs/ holds them.\n\n**Related memories:** [release days](project_release_days.md)\n' });
  await legacy.save({ type: 'event', name: 'launch', description: 'The launch happened', source: 'Mike, 2026-09-26', body: '**Remember:** Launched.\n' });
  await legacy.retire('event_launch', { reason: 'Old news.' });
  await legacy.save({ type: 'user', name: 'prefers-short', description: 'Mike likes short replies', source: 'Mike, 2026-09-26', status: 'needs-review', body: '**Remember:** Short replies.\n' });
  const versions = {};
  for (const r of await legacy.list({ status: 'all' })) versions[r.key] = (await legacy.get(r.key)).version;
  if (!stored) cfg.notion = { ...first.notion };
  return { fake, client, root, cfg, db, old, versions, focus, glossary, legacy };
}

test('before the move, the driver still reads and writes the older Memory database', async () => {
  const { legacy, versions } = await oldProject();
  assert.equal(Object.keys(versions).length, 5);
  assert.equal((await legacy.get('project_release_days')).supersedes[0], 'feedback_deploy_window');
  assert.match(legacy.location, /the Notion Memory database/);
});

test('ensure-project moves every record into the Lore layout with the same text, then renames the old database; nothing is deleted', async () => {
  const { fake, client, root, cfg, db, versions, focus, glossary } = await oldProject();
  const oldRows = Object.values(fake.pages).filter((p) => p.parent && p.parent.data_source_id === db.data_sources[0].id).map((p) => p.id);
  const res = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now });
  assert.deepEqual(res.report.problems, []);
  assert.ok(res.report.notes.some((n) => /^Moved 5 records from the old Memory database/.test(n)), res.report.notes.join('\n'));
  assert.ok(res.report.notes.some((n) => /renamed "Old memory database \(safe to delete\)"/.test(n)));
  const m = res.notion.memory;
  assert.equal(m.layout, 'lore');
  assert.deepEqual(m.pages, { focus: focus.id, glossary: glossary.id }, 'focus and glossary stay the same child pages');
  assert.equal(m.migratedFrom.databaseId, db.id);
  assert.equal(m.migratedFrom.records, 5);
  // The old database is still there, renamed, with every row.
  assert.equal(plain(fake.databases[db.id].title), OLD_MEMORY_DATABASE_TITLE);
  assert.equal(fake.databases[db.id].in_trash, false);
  for (const id of oldRows) assert.equal(fake.pages[id].in_trash, false);
  // Every record reads back with the same text, so the same version.
  const driver = await createDriver({ root, mainRoot: root, config: { ...cfg, notion: res.notion }, env: {}, now, client, clock: LATER });
  for (const [key, version] of Object.entries(versions)) assert.equal((await driver.get(key)).version, version, key);
  const successor = rowOf(fake, 'project_release_days');
  assert.deepEqual(value(successor, 'Supersedes').relation.map((x) => x.id), [rowOf(fake, 'feedback_deploy_window').id]);
  assert.equal(value(rowOf(fake, 'event_launch'), 'Status').select.name, 'deprecated');
  // The registry points at the Memories data source.
  const row = fake.pages[res.notion.project.pageId];
  assert.equal(plain(row.properties['Memory data source'].rich_text), m.dataSourceId);
  // A second run changes nothing.
  const before = fake.writes().length;
  const again = await ensureProject({ client, config: { ...cfg, notion: res.notion }, mainRoot: root, rootPageId: fake.rootPageId, now });
  const { verifiedAt, ...report } = again.report;
  assert.deepEqual(report, { created: [], added: [], problems: [], notes: [] });
  assert.equal(fake.writes().length, before);
  assert.deepEqual(again.notion, res.notion);
});

test('an older project found by title (no ids in .toolkit.json, a new clone) is moved too', async () => {
  const { fake, client, root, cfg, db, versions } = await oldProject({ stored: false });
  const res = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now });
  assert.deepEqual(res.report.problems, []);
  assert.equal(plain(fake.databases[db.id].title), OLD_MEMORY_DATABASE_TITLE);
  const driver = await createDriver({ root, mainRoot: root, config: { ...cfg, notion: res.notion }, env: {}, now, client, clock: LATER });
  assert.deepEqual((await driver.list({ status: 'all' })).map((r) => r.key).sort(), Object.keys(versions).sort());
});

test('a row with no key keeps the old database\'s name; the records still move; the next run renames it once the row is gone', async () => {
  const { fake, client, root, cfg, db, old } = await oldProject();
  const stray = fake.route('POST', 'v1/pages', { parent: { type: 'data_source_id', data_source_id: old.dataSourceId }, properties: { title: { title: [{ type: 'text', text: { content: 'Untitled idea' } }] } } }, {});
  const res = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now });
  assert.equal(res.notion.memory.layout, 'lore', 'every record moved, so the project uses the Lore layout');
  assert.equal(res.notion.memory.migratedFrom, undefined);
  assert.ok(res.report.problems.some((p) => /1 row with no memory key .*"Untitled idea"/.test(p)), res.report.problems.join('\n'));
  assert.ok(res.report.problems.some((p) => /keeps its name until every row is moved/.test(p)));
  assert.equal(plain(fake.databases[db.id].title), 'Memory');
  fake.pages[stray.id].in_trash = true; // Mike deletes the stray row.
  const again = await ensureProject({ client, config: { ...cfg, notion: res.notion }, mainRoot: root, rootPageId: fake.rootPageId, now });
  assert.deepEqual(again.report.problems, []);
  assert.ok(again.report.notes.some((n) => /5 records were already there with the same text/.test(n)), again.report.notes.join('\n'));
  assert.equal(plain(fake.databases[db.id].title), OLD_MEMORY_DATABASE_TITLE);
  assert.equal(again.notion.memory.migratedFrom.databaseId, db.id);
});

test('--check on an older project says the records will move, and writes nothing', async () => {
  const { fake, client, root, cfg } = await oldProject();
  const before = fake.writes().length;
  const res = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now, check: true });
  assert.equal(fake.writes().length, before);
  assert.ok(res.report.problems.some((p) => /still in the older Memory database/.test(p)));
  assert.equal(res.notion.memory.databaseId, cfg.notion.memory.databaseId, '.toolkit.json keeps the older block');
});

test('a record that cannot be copied keeps the project on the old database, which keeps its name', async () => {
  const { fake, client, root, cfg, db } = await oldProject();
  // The Memories database refuses the first body write for one record.
  const runner = client.runner;
  let failed = false;
  client.runner = async (args, opts) => {
    if (!failed && args[1] === 'v1/pages' && args.includes('POST') && String(opts.input || '').includes('prefers_short')) {
      failed = true;
      return { code: 5, stdout: '', stderr: 'error: Public API request failed (400 Bad Request validation_error): refused on purpose' };
    }
    return runner(args, opts);
  };
  const res = await ensureProject({ client, config: cfg, mainRoot: root, rootPageId: fake.rootPageId, now });
  client.runner = runner;
  assert.ok(res.report.problems.some((p) => /user_prefers_short was not moved/.test(p)), res.report.problems.join('\n'));
  assert.ok(res.report.problems.some((p) => /keeps using the old Memory database/.test(p)));
  assert.equal(res.notion.memory.layout, undefined, '.toolkit.json still names the older database');
  assert.equal(res.notion.memory.databaseId, db.id);
  assert.equal(plain(fake.databases[db.id].title), 'Memory');
  const again = await ensureProject({ client, config: { ...cfg, notion: res.notion }, mainRoot: root, rootPageId: fake.rootPageId, now });
  assert.deepEqual(again.report.problems, []);
  assert.equal(again.notion.memory.layout, 'lore');
  assert.equal(plain(fake.databases[db.id].title), OLD_MEMORY_DATABASE_TITLE);
});

// ------------------------------------------------------------------ the pinned schema against Lore itself

const LORE_CLONE = process.env.TOOLKIT_LORE_CLONE;

test('the pinned schema equals what Lore\'s own createVaultDatabases sends (set TOOLKIT_LORE_CLONE to a built clone)', { skip: !LORE_CLONE && 'TOOLKIT_LORE_CLONE is not set' }, () => {
  const script = `
    import { createVaultDatabases } from ${JSON.stringify(path.join(LORE_CLONE, 'dist', 'index.js'))};
    const calls = [];
    const client = {
      databases: { create: async (a) => { calls.push(a); return { id: 'db', data_sources: [{ id: '$' + a.title[0].text.content.toLowerCase() }] }; } },
      dataSources: { update: async (a) => { calls.push(a); return {}; } },
    };
    await createVaultDatabases(client, 'PAGE');
    console.log(JSON.stringify(calls));`;
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const calls = JSON.parse(run.stdout);
  const ids = { projects: '$projects', topics: '$topics', memories: '$memories', entities: '$entities' };
  const strip = (props) => JSON.parse(JSON.stringify(props, (k, v) => (k === 'type' && (v === 'single_property' || v === 'dual_property') ? undefined : v)));
  const byTitle = Object.fromEntries(calls.filter((c) => c.title).map((c) => [c.title[0].text.content, c]));
  for (const which of VAULT_DATABASES) {
    const ours = Object.fromEntries(loreProperties(which, which === 'memories' ? { projects: ids.projects, topics: ids.topics } : ids).map((p) => [p.name, p.spec]));
    const lore = byTitle[VAULT_TITLES[which]].initial_data_source.properties;
    assert.deepEqual(Object.keys(ours), Object.keys(lore), `${VAULT_TITLES[which]} property names and order`);
    assert.deepEqual(strip(ours), lore, VAULT_TITLES[which]);
  }
  const selfRelations = calls.find((c) => c.data_source_id).properties;
  const oursSelf = Object.fromEntries(loreProperties('memories', ids).slice(-3).map((p) => [p.name, p.spec]));
  assert.deepEqual(strip(oursSelf), selfRelations);
});
