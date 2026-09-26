// Live end-to-end check of the Notion layer, run by hand against the private
// test page "Toolkit V2 Notion test area (safe to delete)". It never touches
// anything outside that page, and it never writes this computer's real
// ~/.config/toolkit-v2/notion.json.
//
//   TOOLKIT_NOTION_LIVE=1 node plugins/toolkit/tests/notion/live/run-live.mjs
//
// Needs `ntn` signed in. The test area id is in dev/test-runs/notion-test-area.json
// (run mimic-projects.mjs first to build the Projects database there).
// Each run makes a new project row "Live run <time>" in the test area and
// leaves it there for inspection. Prints one line per check; exits 1 on a failure.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { main } from '../../../lib/cli.mjs';
import { NotionClient } from '../../../lib/notion/client.mjs';
import { openTracker } from '../../../lib/work/driver.mjs';
import { loadDriver } from '../../../lib/memory/contract.mjs';
import { newRecordText, newDesignText, parseDoc, setLabel, appendHistory } from '../../../lib/work/model.mjs';

if (process.env.TOOLKIT_NOTION_LIVE !== '1') {
  console.error('This test writes to Notion. Set TOOLKIT_NOTION_LIVE=1 to run it.');
  process.exit(2);
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const area = JSON.parse(fs.readFileSync(path.join(REPO, 'dev/test-runs/notion-test-area.json'), 'utf8'));
const TEMPLATES = path.resolve(HERE, '../../../templates');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'toolkit-notion-live-'));
const project = path.join(dir, 'project');
fs.mkdirSync(project);
spawnSync('git', ['init', '-q'], { cwd: project });
const env = { ...process.env, TOOLKIT_V2_CONFIG_DIR: path.join(dir, 'machine') };
fs.writeFileSync(path.join(project, '.toolkit.json'), `${JSON.stringify({
  toolkit: 'toolkit-v2',
  schema: 1,
  project: { name: `Live run ${stamp}`, key: `live-${stamp.toLowerCase()}`, owner: 'Mike' },
  tracker: { type: 'notion', idPrefix: 'WI' },
  memory: { type: 'notion', approval: 'onboarding' },
  salesforce: { enabled: false },
  hosts: ['claude-code', 'codex'],
  notion: {},
  hindsight: {},
  installed: {},
}, null, 2)}\n`);

const results = [];
const started = Date.now();
async function check(name, fn) {
  const t0 = Date.now();
  try {
    const note = await fn();
    results.push({ name, ok: true, ms: Date.now() - t0, note: note || '' });
    console.log(`PASS  ${name}${note ? ` - ${note}` : ''} (${Date.now() - t0} ms)`);
  } catch (err) {
    results.push({ name, ok: false, ms: Date.now() - t0, note: err.message });
    console.log(`FAIL  ${name} - ${err.message}`);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
async function toolkit(args) {
  const chunks = [];
  const sink = { write: (s) => chunks.push(String(s)) };
  const code = await main(args, { cwd: project, env, stdout: sink, stderr: sink, stdin: '' });
  return { code, out: chunks.join('') };
}

const tpl = fs.readFileSync(path.join(TEMPLATES, 'WORK-ITEM.md'), 'utf8');
const dtpl = fs.readFileSync(path.join(TEMPLATES, 'DESIGN.md'), 'utf8');
const today = new Date().toISOString().slice(0, 10);
const rec = (title, extra = {}) => parseDoc(newRecordText(tpl, {
  id: 'WI-001', title, type: 'build', stage: '01-discovery', status: 'Backlog', parent: 'none', waiting_on: 'none', priority: 'medium',
  delivery: 'not-offered', requirements_approved: 'no', design: 'none', result_approved: 'no', updated: today, ...extra,
}));

let cfg;
let tracker;
let memory;
let ids = {};

await check('ensure-root on the test area Projects database', async () => {
  const r = await toolkit(['notion', 'ensure-root', '--root-page', area.pageId, '--json']);
  assert(r.code === 0, r.out);
  return `${JSON.parse(r.out).added.length} properties added`;
});
await check('ensure-project builds the row, Work Items, Memory, views, pages', async () => {
  const r = await toolkit(['notion', 'ensure-project', '--json']);
  assert(r.code === 0, r.out);
  const j = JSON.parse(r.out);
  cfg = JSON.parse(fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8'));
  return `${j.report.created.length} created, ${j.calls} calls, ID prefix ${cfg.tracker.idPrefix}; ${cfg.notion.project.url}${j.report.notes.length ? `; note: ${j.report.notes.join(' ')}` : ''}`;
});
if (!cfg || !cfg.notion || !cfg.notion.workItems) {
  console.log('Setup failed, so the other checks were not run.');
  process.exit(1);
}
await check('ensure-project again changes nothing and writes nothing', async () => {
  const before = fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8');
  const c = new NotionClient({ rootPageId: area.pageId });
  const r = await toolkit(['notion', 'ensure-project', '--json']);
  const j = JSON.parse(r.out);
  assert(!j.report.created.length && !j.report.added.length && !j.report.problems.length && !j.report.notes.length, JSON.stringify(j.report));
  assert(j.configFile === null && fs.readFileSync(path.join(project, '.toolkit.json'), 'utf8') === before, '.toolkit.json was written again');
  const row = await c.getPage(cfg.notion.project.pageId);
  return `${j.calls} calls; the stored ids were checked by walking parents; project row last edited ${row.last_edited_time}`;
});
await check('scope walk on real objects: in scope under the project page, out of scope beside it', async () => {
  // Reads only: a client whose root is the project page.
  const c = new NotionClient({ rootPageId: cfg.notion.project.pageId });
  const wi = cfg.notion.workItems;
  const inside = [
    ['database', wi.databaseId], ['data_source', wi.dataSourceId], ['view', wi.views.board],
    ['page', cfg.notion.memory.pages.focus], ['data_source', cfg.notion.memory.dataSourceId],
  ];
  for (const [kind, id] of inside) assert(await c.isUnderRoot({ kind, id }), `${kind} ${id} should be under the project page`);
  assert(!(await c.isUnderRoot({ kind: 'database', id: area.projectsDatabaseId })), 'the Projects database is not under the project page');
  assert(!(await c.isUnderRoot({ kind: 'page', id: area.pageId })), 'the test area page is not under the project page');
  return `${c.stats.calls} read calls`;
});

const p = () => ({ root: project, mainRoot: project, config: cfg });
await check('tracker: create a parent and a sub-item', async () => {
  tracker = await openTracker(p(), { env });
  const a = rec('Login page');
  ids.a = await tracker.create({ meta: a.meta, body: a.body });
  const b = rec('Login page styles');
  ids.b = await tracker.create({ meta: { ...b.meta, parent: ids.a }, body: b.body });
  const got = await tracker.get(ids.b);
  assert(got.meta.parent === ids.a, `parent is ${got.meta.parent}`);
  return `${ids.a}, ${ids.b}`;
});
await check('tracker: update a section and properties from a fresh read', async () => {
  const g = await tracker.get(ids.a);
  const body = appendHistory(setLabel(g.body, 'Next action', 'Write the requirements (agent).', { section: 'Overview' }), { date: today, change: 'Started.', effect: 'None.' });
  const u = await tracker.update(ids.a, { meta: { stage: '02-refinement' }, body, expectBody: g.body });
  assert(u.meta.stage === '02-refinement' && u.nextAction === 'Write the requirements (agent).', 'values did not read back');
});
await check('tracker: design subpage create, read, update', async () => {
  const d = await tracker.setDesign(ids.a, newDesignText(dtpl, { id: ids.a, title: 'Login page', date: today }), { create: true });
  const d2 = await tracker.setDesign(ids.a, d.text.replace('status: proposed', 'status: approved').replace('approved: no', `approved: ${today} by Mike`));
  assert(d2.meta.status === 'approved', 'design status');
  return d.location;
});
await check('tracker: Mike edits Goal in Notion while the agent edits history; both kept', async () => {
  const before = await tracker.get(ids.a);
  const client = tracker.client;
  const page = await tracker.findPage(ids.a);
  const md = await client.getMarkdown(page.id);
  const goal = md.markdown.split('\n').find((l) => l.startsWith('**Goal:**'));
  await client.patchMarkdown(page.id, { type: 'update_content', update_content: { content_updates: [{ old_str: goal, new_str: '**Goal:** Written by Mike in Notion.' }] } });
  const u = await tracker.update(ids.a, { body: appendHistory(before.body, { date: today, change: 'Agent row.', effect: 'None.' }), expectBody: before.body });
  assert(u.body.includes('Written by Mike in Notion.') && u.body.includes('Agent row.'), 'merge lost an edit');
  let conflict = false;
  try {
    await tracker.update(ids.a, { body: setLabel(before.body, 'Goal', 'Agent goal.', { section: 'Overview' }), expectBody: before.body });
  } catch (err) {
    conflict = Boolean(err.details && err.details.conflict);
  }
  assert(conflict, 'a clash in the same section was not a conflict');
});
await check('sync: New-button card adopted', async () => {
  await tracker.sync();
  await tracker.client.createPage({ parent: { type: 'data_source_id', data_source_id: cfg.notion.workItems.dataSourceId }, properties: { title: { title: [{ type: 'text', text: { content: 'Password reset' } }] } } });
  const r = await tracker.sync({ quick: true });
  assert(r.adopted.length === 1, JSON.stringify(r.adopted));
  ids.c = r.adopted[0].id;
  const g = await tracker.get(ids.c);
  assert(g.meta.stage === '01-discovery' && g.meta.status === 'Backlog' && g.body.includes('## Requirements'), 'not filled');
  return ids.c;
});
await check('sync: Stage dragged and parent cleared by hand', async () => {
  const page = await tracker.findPage(ids.b);
  await tracker.client.updatePage(page.id, { properties: { [cfg.notion.workItems.properties.stage]: { select: { name: '08-build' } }, [cfg.notion.workItems.properties.parent]: { relation: [] } } });
  const r = await tracker.sync({ quick: true });
  assert(r.moves.some((m) => m.id === ids.b && m.kind === 'reparented'), 'no move reported');
  assert(r.ownerEdits.some((e) => e.id === ids.b && e.field === 'stage'), 'no owner edit');
  assert(r.questions.some((q) => q.code === 'requirements_not_approved'), 'no gate question');
  const g = await tracker.get(ids.b);
  assert(g.meta.status === 'In Progress', `status ${g.meta.status}`);
});
await check('sync: trashed card reported missing', async () => {
  const page = await tracker.findPage(ids.c);
  await tracker.client.updatePage(page.id, { in_trash: true });
  const r = await tracker.sync({ quick: true });
  assert(r.missing.some((m) => m.id === ids.c), JSON.stringify(r.missing));
});
await check('move: under, archive, root', async () => {
  await tracker.move(ids.b, ids.a);
  await tracker.move(ids.b, 'archive');
  const m = await tracker.move(ids.b, 'root');
  assert(m.parentAfter === 'none' && !m.archived, JSON.stringify(m));
});
await check('quick sync with no change is one call', async () => {
  await tracker.sync({ quick: true });
  const before = tracker.client.stats.calls;
  await tracker.sync({ quick: true });
  const n = tracker.client.stats.calls - before;
  assert(n === 1, `${n} calls`);
});

await check('memory: save and get give back the exact text', async () => {
  memory = await loadDriver(p(), { env });
  const body = '**Remember:** Deploy on Tuesdays only.\n\n**Why:** On-call is free. Costs $0 | cheap <for now>.\n\n**Related:** WI-001 and `docs/deploy.md`.\n';
  const s = await memory.save({ type: 'feedback', name: 'deploy-window', description: 'Deploy on Tuesdays only', source: `Mike, ${today}`, body }, { expect: 'absent' });
  const g = await memory.get('feedback_deploy_window');
  assert(g.version === s.version && g.body === body, 'text changed');
});
await check('memory: find, retire, restore, stale expect', async () => {
  assert((await memory.find('tuesday')).results.length === 1, 'find');
  await memory.retire('feedback_deploy_window', { reason: 'Live test.' });
  assert((await memory.list()).length === 0, 'retired still listed');
  await memory.restore('feedback_deploy_window');
  let refused = false;
  try {
    await memory.save({ type: 'feedback', name: 'deploy-window', description: 'x', source: 'Mike', body: '**Remember:** x\n' }, { expect: '0000000000000000' });
  } catch (err) {
    refused = err.code === 2;
  }
  assert(refused, 'stale expect was not refused');
});
await check('memory: focus and glossary round trip exactly', async () => {
  const focus = `# Current focus\n\nUpdated: ${today}\n\n## Now\n\n- ${ids.a}.\n\n## Waiting on the owner\n\n- Nothing.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- Read ${ids.a}.\n`;
  await memory.focusSet(focus);
  assert((await memory.focusGet()).text === focus, 'focus changed');
  const gl = '# Terminology glossary\n\n| Term | Meaning |\n| --- | --- |\n| WI | Work item id prefix |\n';
  await memory.glossarySet(gl);
  assert((await memory.glossaryGet()).text === gl, 'glossary changed');
});
await check('memory: status and delete', async () => {
  const s = await memory.status();
  assert(s.healthy, s.detail);
  await memory.delete('feedback_deploy_window');
  assert((await memory.get('feedback_deploy_window')) === null, 'still there');
});

await check('scope: a write outside the root is refused before anything is written', async () => {
  const c = new NotionClient({ rootPageId: cfg.notion.workItems.databaseId ? cfg.notion.project.pageId : area.pageId });
  let refused = 0;
  try {
    await c.updatePage(cfg.notion.memory.pages.focus, { properties: {} });
  } catch {
    refused = -1; // the focus page is under the project page, so this must pass
  }
  try {
    await c.createPage({ parent: { type: 'page_id', page_id: area.pageId }, properties: { title: { title: [] } } });
  } catch (err) {
    if (/not under the root page/.test(err.message)) refused++;
  }
  try {
    await c.createPage({ parent: { type: 'workspace', workspace: true }, properties: {} });
  } catch (err) {
    if (/top of the workspace/.test(err.message)) refused++;
  }
  assert(refused === 2, `refused ${refused} of 2`);
});

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length} of ${results.length} checks passed in ${Math.round((Date.now() - started) / 1000)} s. Project page: ${cfg && cfg.notion && cfg.notion.project ? cfg.notion.project.url : 'none'}`);
process.exitCode = failed.length ? 1 : 0;
