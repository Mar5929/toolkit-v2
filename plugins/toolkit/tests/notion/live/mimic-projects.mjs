// Live setup, run by hand: builds a Projects database in the private Notion
// test area that mimics the real one on the "AI Agent Second Brain" page
// (same properties, a board grouped by Status, an "All Projects" table, one
// sample row). Never touches anything outside the test area.
//
//   node plugins/toolkit/tests/notion/live/mimic-projects.mjs
//
// The test area id is read from dev/test-runs/notion-test-area.json. The new
// database ids are written back into that file.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NotionClient, normalizeId } from '../../../lib/notion/client.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../../lib/notion/schema.mjs';
import { childrenOf, listViews } from '../../../lib/notion/ensure.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const AREA_FILE = path.resolve(HERE, '../../../../../dev/test-runs/notion-test-area.json');
const area = JSON.parse(fs.readFileSync(AREA_FILE, 'utf8'));
const client = new NotionClient({ rootPageId: area.pageId });

const kids = await childrenOf(client, area.pageId);
let db = null;
const existing = kids.find((k) => k.kind === 'database' && k.title === 'Projects');
if (existing) {
  db = await client.getDatabase(existing.id);
  console.log('Projects database already exists:', db.id);
} else {
  const properties = {};
  for (const p of PROJECTS_BASE_PROPERTIES) properties[p.name] = p.spec;
  db = await client.createDatabase({
    parent: { type: 'page_id', page_id: area.pageId },
    title: [{ type: 'text', text: { content: 'Projects' } }],
    is_inline: true,
    icon: { type: 'emoji', emoji: '🎯' },
    initial_data_source: { properties },
  });
  console.log('Created the Projects database:', db.id);
}
const dsId = normalizeId(db.data_sources[0].id);
const ds = await client.getDataSource(dsId);
const status = ds.properties.Status;
const views = await listViews(client, db.id);
if (!views.some((v) => v.type === 'board')) {
  await client.createView({
    database_id: db.id,
    data_source_id: dsId,
    name: 'Active Projects',
    type: 'board',
    position: { type: 'start' },
    configuration: { type: 'board', group_by: { type: 'status', property_id: status.id, group_by: 'option', sort: { type: 'manual' }, hide_empty_groups: false } },
  });
}
const tables = (await listViews(client, db.id)).filter((v) => v.type === 'table');
if (tables.length && tables[0].name !== 'All Projects') await client.updateView(tables[0].id, { name: 'All Projects' });
const rows = await client.queryAll(dsId);
if (!rows.length) {
  await client.createPage({
    parent: { type: 'data_source_id', data_source_id: dsId },
    properties: {
      Project: { title: [{ type: 'text', text: { content: 'Claude Toolkit (sample row)' } }] },
      Status: { status: { name: 'Backlog' } },
      Priority: { select: { name: 'Medium' } },
    },
    markdown: 'A sample row, like the real "Claude Toolkit" row. Safe to delete.',
  });
}
area.projectsDatabaseId = normalizeId(db.id);
area.projectsDataSourceId = dsId;
fs.writeFileSync(AREA_FILE, `${JSON.stringify(area, null, 2)}\n`);
const back = await client.getDataSource(dsId);
console.log(JSON.stringify({
  databaseId: area.projectsDatabaseId,
  dataSourceId: dsId,
  statusOptions: back.properties.Status.status.options.map((o) => o.name),
  statusGroups: back.properties.Status.status.groups.map((g) => `${g.name}: ${g.option_ids.length}`),
  properties: Object.keys(back.properties),
  views: (await listViews(client, db.id)).map((v) => `${v.type}: ${v.name}`),
  calls: client.stats.calls,
}, null, 2));
