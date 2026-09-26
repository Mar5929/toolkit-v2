// Live, run by hand: saves real Notion responses from the private test area
// into tests/notion/fixtures/responses/, so the unit tests run offline on
// shapes Notion really returns.
//
//   node plugins/toolkit/tests/notion/live/record-fixtures.mjs <project folder set up by ensure-project>
//
// Only reads. User objects (which carry an email address) are never saved.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NotionClient } from '../../../lib/notion/client.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..', 'fixtures', 'responses');
const project = process.argv[2];
if (!project) {
  console.error('Give the folder of a project that ensure-project set up in the test area.');
  process.exit(2);
}
const cfg = JSON.parse(fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8')).notion;
const client = new NotionClient({ rootPageId: cfg.rootPageId });
const save = (name, data) => {
  const scrub = JSON.parse(JSON.stringify(data, (k, v) => (k === 'request_id' || k === 'avatar_url' || k === 'person' ? undefined : v)));
  fs.writeFileSync(path.join(OUT, name), `${JSON.stringify(scrub, null, 2)}\n`);
  console.log('saved', name);
};
fs.mkdirSync(OUT, { recursive: true });
save('projects-data-source.json', await client.getDataSource(cfg.projects.dataSourceId));
if (cfg.workItems) {
  save('work-items-data-source.json', await client.getDataSource(cfg.workItems.dataSourceId));
  save('work-items-board-view.json', await client.getView(cfg.workItems.views.board));
  save('work-items-table-view.json', await client.getView(cfg.workItems.views.allItems));
  const rows = await client.queryAll(cfg.workItems.dataSourceId);
  save('work-items-query.json', { object: 'list', results: rows, has_more: false, next_cursor: null });
  const withChild = rows.find((r) => Object.values(r.properties).some((p) => p.type === 'unique_id' && p.unique_id.number === 1));
  if (withChild) save('work-item-markdown.json', await client.getMarkdown(withChild.id));
}
if (cfg.memory) {
  save('memory-data-source.json', await client.getDataSource(cfg.memory.dataSourceId));
  save('memory-query.json', { object: 'list', results: await client.queryAll(cfg.memory.dataSourceId), has_more: false, next_cursor: null });
  save('focus-markdown.json', await client.getMarkdown(cfg.memory.pages.focus));
}
save('project-children.json', { object: 'list', results: await client.childrenAll(cfg.project.pageId), has_more: false, next_cursor: null });
console.log('calls', client.stats.calls);
