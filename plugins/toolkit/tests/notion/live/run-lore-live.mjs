// Live check of Notion memory in Lore's layout, run by hand against the private
// test page "Toolkit V2 Notion test area (safe to delete)". It covers checks 1
// and 2 of dev/research/lore.md section 10 and the move of an older project:
//
//   1. ensure-project makes a "Memory" page under a new project row and Lore's
//      five databases in it. The structure is read back from Notion and
//      compared with the pinned Lore schema (the same test Lore's drift check
//      makes: every property, type, option, and relation target).
//   2. The toolkit memory checks against Lore's Memories database: save and get
//      the exact text, find, list, retire (superseded and archived), restore,
//      rename, delete, a stale version refused, focus, and glossary.
//   3. An older project (one "Memory" database on its row) is moved into the
//      Lore layout: every record reads back with the same version, the old
//      database is renamed and nothing is deleted, and a second run changes nothing.
//
//   TOOLKIT_NOTION_LIVE=1 node plugins/toolkit/tests/notion/live/run-lore-live.mjs [--out <file.json>]
//
// Needs `ntn` signed in (set NOTION_WORKSPACE_ID when the workspace that holds
// the test area is not ntn's default). The test area id is in
// dev/test-runs/notion-test-area.json. Each run makes two project rows,
// "Lore layout check <time>" and "Lore move check <time>", and leaves them for
// inspection and for Lore's own read tools. It never writes this computer's
// real ~/.config/toolkit-v2/notion.json. Prints one line per check; exits 1 on
// a failure. --out writes the ids and urls it made as JSON.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { main } from '../../../lib/cli.mjs';
import { NotionClient, normalizeId } from '../../../lib/notion/client.mjs';
import { childrenOf } from '../../../lib/notion/ensure.mjs';
import { MEMORY_PROPERTIES, RECORD_TYPE_TAGS, LORE_MEMORY_ADDED_PROPERTIES, OLD_MEMORY_DATABASE_TITLE } from '../../../lib/notion/schema.mjs';
import { VAULT_DATABASES, VAULT_TITLES, loreProperties } from '../../../lib/notion/lore-schema.mjs';
import { loadDriver } from '../../../lib/memory/contract.mjs';
import { readValue } from '../../../lib/notion/props.mjs';

if (process.env.TOOLKIT_NOTION_LIVE !== '1') {
  console.error('This test writes to Notion. Set TOOLKIT_NOTION_LIVE=1 to run it.');
  process.exit(2);
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const area = JSON.parse(fs.readFileSync(path.join(REPO, 'dev/test-runs/notion-test-area.json'), 'utf8'));
const outFlag = process.argv.indexOf('--out');
const outFile = outFlag > 0 ? process.argv[outFlag + 1] : null;
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'toolkit-lore-live-'));
const env = { ...process.env, TOOLKIT_V2_CONFIG_DIR: path.join(dir, 'machine') };
const today = new Date().toISOString().slice(0, 10);
const summary = { stamp, testArea: area.pageId };

function makeProject(name, key) {
  const root = path.join(dir, key);
  fs.mkdirSync(root);
  spawnSync('git', ['init', '-q'], { cwd: root });
  fs.writeFileSync(path.join(root, '.toolkit.json'), `${JSON.stringify({
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name, key, owner: 'Mike' },
    tracker: { type: 'local' },
    memory: { type: 'notion', approval: 'onboarding' },
    salesforce: { enabled: false },
    hosts: ['claude-code', 'codex'],
    notion: {},
    hindsight: {},
    installed: {},
  }, null, 2)}\n`);
  return root;
}

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
async function toolkit(cwd, args) {
  const chunks = [];
  const sink = { write: (s) => chunks.push(String(s)) };
  const code = await main(args, { cwd, env, stdout: sink, stderr: sink, stdin: '' });
  return { code, out: chunks.join('') };
}
const readConfig = (root) => JSON.parse(fs.readFileSync(path.join(root, '.toolkit.json'), 'utf8'));
const plain = (rich) => (Array.isArray(rich) ? rich.map((r) => r.plain_text ?? '').join('') : '');
const client = new NotionClient({ rootPageId: area.pageId, env });

// ------------------------------------------------------------------ 1. the layout

const loreRoot = makeProject(`Lore layout check ${stamp}`, `lore-${stamp.toLowerCase()}`);
let cfg;
let mem;

await check('ensure-root on the test area', async () => {
  const r = await toolkit(loreRoot, ['notion', 'ensure-root', '--root-page', area.pageId, '--json']);
  assert(r.code === 0, r.out);
});
await check('check 1: ensure-project makes the Memory page with Lore\'s five databases', async () => {
  const r = await toolkit(loreRoot, ['notion', 'ensure-project', '--json']);
  assert(r.code === 0, r.out);
  const j = JSON.parse(r.out);
  cfg = readConfig(loreRoot);
  mem = cfg.notion.memory;
  assert(mem && mem.layout === 'lore', 'the memory block is not a Lore block');
  summary.lore = { projectPage: cfg.notion.project.url, memoryPage: mem.pageUrl, memoryPageId: mem.pageId, memories: mem.url, databases: mem.databases, projectRowId: mem.projectRowId };
  return `${j.report.created.length} created (${j.report.created.join(', ')}), ${j.calls} calls; ${mem.pageUrl}`;
});
if (!mem) {
  console.log('Setup failed, so the other checks were not run.');
  process.exit(1);
}
await check('check 1: read back from Notion, the Memory page holds exactly the five databases, titled as Lore needs', async () => {
  const kids = await childrenOf(client, mem.pageId);
  const titles = kids.filter((k) => k.kind === 'database').map((k) => k.title);
  assert(JSON.stringify(titles) === JSON.stringify(['Projects', 'Topics', 'Memories', 'Entities', 'Facts']), `child databases: ${titles.join(', ')}`);
  const page = await client.getPage(mem.pageId);
  assert(normalizeId(page.parent.page_id) === normalizeId(cfg.notion.project.pageId), 'the Memory page is not a child of the project row');
  const rowKids = (await childrenOf(client, cfg.notion.project.pageId)).map((k) => `${k.kind}:${k.title}`).sort();
  return `project row holds ${rowKids.join(', ')}`;
});
await check('check 1 (drift): every Lore property, type, option, and relation target is in Notion', async () => {
  const ids = Object.fromEntries(VAULT_DATABASES.map((w) => [w, mem.databases[w].dataSourceId]));
  let n = 0;
  for (const which of VAULT_DATABASES) {
    const live = (await client.getDataSource(ids[which])).properties;
    for (const want of loreProperties(which, ids)) {
      const type = Object.keys(want.spec)[0];
      const got = live[want.name];
      assert(got, `${VAULT_TITLES[which]} lacks ${want.name}`);
      assert(got.type === type, `${VAULT_TITLES[which]}.${want.name} is ${got.type}, Lore expects ${type}`);
      if (type === 'select' || type === 'multi_select') {
        const have = new Set(got[type].options.map((o) => o.name));
        const missing = want.spec[type].options.filter((o) => !have.has(o.name)).map((o) => o.name);
        assert(!missing.length, `${VAULT_TITLES[which]}.${want.name} lacks ${missing.join(', ')}`);
      }
      if (type === 'relation') {
        assert(normalizeId(got.relation.data_source_id) === normalizeId(want.spec.relation.data_source_id), `${VAULT_TITLES[which]}.${want.name} points at another database`);
        assert(got.relation.type === want.spec.relation.type, `${VAULT_TITLES[which]}.${want.name} is ${got.relation.type}, Lore expects ${want.spec.relation.type}`);
      }
      n += 1;
    }
    if (which === 'memories') {
      for (const p of LORE_MEMORY_ADDED_PROPERTIES) assert(live[p.name], `Memories lacks the toolkit column ${p.name}`);
      const tags = new Set(live.Tags.multi_select.options.map((o) => o.name));
      for (const t of RECORD_TYPE_TAGS) assert(tags.has(t.name), `Tags lacks ${t.name}`);
    }
  }
  return `${n} Lore properties checked, plus ${LORE_MEMORY_ADDED_PROPERTIES.length} toolkit columns and the five type tags`;
});
await check('check 1: ensure-project again changes nothing and does not rewrite .toolkit.json', async () => {
  const before = fs.readFileSync(path.join(loreRoot, '.toolkit.json'), 'utf8');
  const r = await toolkit(loreRoot, ['notion', 'ensure-project', '--json']);
  const j = JSON.parse(r.out);
  assert(!j.report.created.length && !j.report.added.length && !j.report.problems.length && !j.report.notes.length, JSON.stringify(j.report));
  assert(j.configFile === null && fs.readFileSync(path.join(loreRoot, '.toolkit.json'), 'utf8') === before, '.toolkit.json was written again');
  return `${j.calls} calls`;
});

// ------------------------------------------------------------------ 2. the memory checks

const p = (root, config) => ({ root, mainRoot: root, config });
let memory;
const BODY = '# Zephyr deploy window\n\n**Remember:** Deploy on Tuesdays only.\n\n**Why:** On-call is free. Costs $0 | cheap <for now>.\n\n**Related memories:** WI-001 and `docs/deploy.md`.\n';
await check('check 2: save and get give back the exact text; the row has Lore\'s columns', async () => {
  memory = await loadDriver(p(loreRoot, cfg), { env });
  const s = await memory.save({ type: 'feedback', name: 'deploy-window', description: 'Deploy on Tuesdays only', source: `Mike, ${today}`, approved_by: 'Mike', body: BODY }, { expect: 'absent' });
  const g = await memory.get('feedback_deploy_window');
  assert(g.version === s.version && g.body === BODY, 'text changed');
  const row = await memory.findRow('feedback_deploy_window');
  const q = mem.properties;
  const got = {
    Title: readValue(row, 'title'), Keywords: readValue(row, q.keywords), 'Record Key': readValue(row, q.recordKey), Synopsis: readValue(row, q.synopsis),
    Kind: readValue(row, q.kind), Tags: readValue(row, q.tags), Status: readValue(row, q.status), Source: readValue(row, q.source),
    Author: readValue(row, q.author), Project: readValue(row, q.project), Authorization: readValue(row, q.authorization),
  };
  assert(got.Title === 'Zephyr deploy window' && got.Keywords === 'feedback_deploy_window' && got['Record Key'] === 'feedback_deploy_window', JSON.stringify(got));
  assert(got.Kind === 'note' && got.Tags.join() === 'feedback' && got.Status === 'accepted' && got.Source === 'manual' && got.Author === 'Mike', JSON.stringify(got));
  assert(got.Project.map(normalizeId).join() === normalizeId(mem.projectRowId), 'Project relation');
  summary.lore.recordUrl = row.url;
  return `version ${s.version.slice(0, 12)}; ${JSON.stringify(got)}`;
});
await check('check 2: find and list', async () => {
  assert((await memory.find('tuesdays')).results.length === 1, 'find by a body word');
  await memory.save({ type: 'project', name: 'release-days', description: 'Releases go out any weekday', source: `Mike, ${today}`, body: '**Remember:** Any weekday.\n\n**Related memories:** [deploy window](feedback_deploy_window.md)\n' }, { expect: 'absent' });
  const all = (await memory.list()).map((r) => r.key).join(',');
  assert(all === 'feedback_deploy_window,project_release_days', all);
  assert((await memory.list({ type: 'project' })).length === 1, 'list --type');
  return all;
});
await check('check 2: retire --superseded-by sets Status superseded and the Supersedes relation', async () => {
  const r = await memory.retire('feedback_deploy_window', { supersededBy: 'project_release_days', reason: 'Live test.' });
  assert(r.record.status === 'retired' && r.record.superseded_by === 'project_release_days', JSON.stringify(r.record.superseded_by));
  const oldRow = await memory.findRow('feedback_deploy_window');
  const newRow = await memory.findRow('project_release_days');
  assert(readValue(oldRow, mem.properties.status) === 'superseded', 'old Status');
  const rel = readValue(newRow, mem.properties.supersedes).map(normalizeId);
  assert(rel.join() === normalizeId(oldRow.id), `Supersedes relation ${rel.join()}`);
  assert((await memory.get('project_release_days')).supersedes.join() === 'feedback_deploy_window', 'supersedes read back');
  assert((await memory.list()).length === 1, 'retired still listed');
  return `links repaired: ${r.linksRepaired.join(', ') || 'none'}`;
});
await check('check 2: restore sets Status proposed (needs-review)', async () => {
  const r = await memory.restore('feedback_deploy_window');
  assert(r.record.status === 'needs-review', r.record.status);
  assert(readValue(await memory.findRow('feedback_deploy_window'), mem.properties.status) === 'proposed', 'Status');
  assert((await memory.get('project_release_days')).supersedes.length === 0, 'successor still supersedes it');
});
await check('check 2: retire without a replacement sets Status deprecated (archived)', async () => {
  const r = await memory.retire('feedback_deploy_window', { reason: 'Live test archive.' });
  assert(r.record.stored_status === 'archived', r.record.stored_status);
  assert(readValue(await memory.findRow('feedback_deploy_window'), mem.properties.status) === 'deprecated', 'Status');
  await memory.restore('feedback_deploy_window');
});
await check('check 2: rename changes Record Key and Keywords on the same page and repairs links', async () => {
  // The archive above turned the link in project_release_days into words, so a new record links to it.
  assert(/deploy window \(archived\)/.test((await memory.get('project_release_days')).body), 'the archive did not turn the link into words');
  await memory.save({ type: 'project', name: 'rollout', description: 'How a rollout goes', source: `Mike, ${today}`, body: '**Remember:** Follow the window.\n\n**Related memories:** [deploy window](feedback_deploy_window.md)\n' }, { expect: 'absent' });
  const before = await memory.findRow('feedback_deploy_window');
  const r = await memory.rename('feedback_deploy_window', 'feedback_release_window');
  const after = await memory.findRow('feedback_release_window');
  assert(normalizeId(after.id) === normalizeId(before.id), 'a new page was made');
  assert(readValue(after, mem.properties.keywords) === 'feedback_release_window', 'Keywords');
  assert(readValue(after, mem.properties.recordKey) === 'feedback_release_window', 'Record Key');
  assert(await memory.get('feedback_deploy_window') === null, 'old key still found');
  assert(/\[deploy window\]\(feedback_release_window\.md\)/.test((await memory.get('project_rollout')).body), 'link not repaired');
  return `links repaired: ${r.linksRepaired.join(', ')}`;
});
await check('check 2: a stale version is refused', async () => {
  let refused = false;
  try {
    await memory.save({ type: 'project', name: 'release-days', description: 'x', source: 'Mike', body: '**Remember:** x\n' }, { expect: '0000000000000000' });
  } catch (err) {
    refused = err.code === 2;
  }
  assert(refused, 'not refused');
});
await check('check 2: delete moves the row to the Notion trash', async () => {
  const row = await memory.findRow('feedback_release_window');
  await memory.delete('feedback_release_window');
  assert(await memory.get('feedback_release_window') === null, 'still there');
  const page = await client.getPage(row.id);
  assert(page.in_trash === true, 'not in the trash');
});
await check('check 2: focus and glossary round trip exactly (child pages of the project row)', async () => {
  const focus = `# Current focus\n\nUpdated: ${today}\n\n## Now\n\n- Lore layout check.\n\n## Waiting on the owner\n\n- Nothing.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- Read the Memory page.\n`;
  await memory.focusSet(focus);
  assert((await memory.focusGet()).text === focus, 'focus changed');
  const gl = '# Terminology glossary\n\n| Term | Meaning |\n| --- | --- |\n| Vault | The Memory page that holds Lore\'s five databases |\n';
  await memory.glossarySet(gl);
  assert((await memory.glossaryGet()).text === gl, 'glossary changed');
  const kids = await childrenOf(client, cfg.notion.project.pageId);
  assert(kids.some((k) => k.kind === 'page' && normalizeId(k.id) === normalizeId(mem.pages.focus || cfg.notion.memory.pages.focus)), 'focus is not a child page of the project row');
});
await check('check 2: list after rename and delete', async () => {
  const all = (await memory.list({ status: 'all' })).map((r) => r.key).join(',');
  assert(all === 'project_release_days,project_rollout', all);
  return all;
});
await check('check 2: status is healthy', async () => {
  const s = await memory.status();
  assert(s.healthy && !s.problems.length, `${s.detail} ${JSON.stringify(s.problems)}`);
  return s.detail;
});
await check('a record left for Lore\'s own read tools', async () => {
  const s = await memory.save({ type: 'reference', name: 'zephyr-runbook', description: 'Where the Zephyr runbook lives', source: `Mike, ${today}`, body: '# Zephyr runbook\n\n**Remember:** The runbook is in docs/runbook.md; quokka is the code word.\n' }, { expect: 'absent' });
  summary.lore.searchRecord = { key: 'reference_zephyr_runbook', titleWord: 'Zephyr', bodyOnlyWord: 'quokka', version: s.version };
  return 'reference_zephyr_runbook (title word "Zephyr", body-only word "quokka")';
});

// ------------------------------------------------------------------ 3. moving an older project

const moveRoot = makeProject(`Lore move check ${stamp}`, `lore-move-${stamp.toLowerCase()}`);
let moveCfg;
let oldDb;
const versions = {};
await check('move: an older project with records in one "Memory" database', async () => {
  // A project row, as ensure-project made it before the Lore layout (memory set to builtin for this first run).
  const c0 = readConfig(moveRoot);
  fs.writeFileSync(path.join(moveRoot, '.toolkit.json'), `${JSON.stringify({ ...c0, memory: { type: 'builtin' } }, null, 2)}\n`);
  let r = await toolkit(moveRoot, ['notion', 'ensure-project', '--json']);
  assert(r.code === 0, r.out);
  const c1 = readConfig(moveRoot);
  const projectPageId = c1.notion.project.pageId;
  const properties = Object.fromEntries(MEMORY_PROPERTIES.map((q) => [q.name, q.spec]));
  oldDb = await client.createDatabase({ parent: { type: 'page_id', page_id: projectPageId }, title: [{ type: 'text', text: { content: 'Memory' } }], is_inline: true, icon: { type: 'emoji', emoji: '🧠' }, initial_data_source: { properties } });
  const ds = await client.getDataSource(oldDb.data_sources[0].id);
  const old = {
    databaseId: normalizeId(oldDb.id),
    dataSourceId: normalizeId(oldDb.data_sources[0].id),
    url: oldDb.url,
    properties: Object.fromEntries(MEMORY_PROPERTIES.map((q) => [q.key, ds.properties[q.name].id])),
    names: Object.fromEntries(MEMORY_PROPERTIES.map((q) => [q.key, q.name])),
  };
  // Focus and glossary pages as the older layout made them.
  const focus = await client.createPage({ parent: { type: 'page_id', page_id: projectPageId }, properties: { title: { title: [{ type: 'text', text: { content: 'Current focus' } }] } }, markdown: `Updated: ${today}\n\n## Now\n\n- Move check.\n\n## Waiting on the owner\n\n- Nothing.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- Check the move.` });
  const glossary = await client.createPage({ parent: { type: 'page_id', page_id: projectPageId }, properties: { title: { title: [{ type: 'text', text: { content: 'Terminology glossary' } }] } }, markdown: '| Term | Meaning |\n| --- | --- |\n| Move | Copy into the Lore layout |' });
  moveCfg = { ...c1, memory: { type: 'notion', approval: 'onboarding' }, notion: { ...c1.notion, memory: { ...old, views: {}, pages: { focus: normalizeId(focus.id), glossary: normalizeId(glossary.id) } } } };
  fs.writeFileSync(path.join(moveRoot, '.toolkit.json'), `${JSON.stringify(moveCfg, null, 2)}\n`);
  const legacy = await loadDriver(p(moveRoot, moveCfg), { env });
  assert(legacy.lore === false, 'the driver did not read the older layout');
  await legacy.save({ type: 'feedback', name: 'deploy-window', description: 'Deploy on Tuesdays only', source: `Mike, ${today}`, approved_by: 'Mike', body: '# Tuesday deploys\n\n**Remember:** Deploy on Tuesdays only.\n' });
  await legacy.save({ type: 'project', name: 'release-days', description: 'Releases go out any weekday', source: `Mike, ${today}`, body: '**Remember:** Any weekday.\n\n| Day | Ok |\n| --- | --- |\n| Monday | yes |\n' });
  await legacy.retire('feedback_deploy_window', { supersededBy: 'project_release_days', reason: 'Move check.' });
  await legacy.save({ type: 'reference', name: 'links', description: 'Where the docs are', source: `Mike, ${today}`, metadata: { type: 'reference', origin: 'import' }, extra: { reviewer: 'Mike' }, body: '**Remember:** docs/ holds them.\n\n**Related memories:** [release days](project_release_days.md)\n' });
  await legacy.save({ type: 'event', name: 'launch', description: 'The launch happened', source: `Mike, ${today}`, body: '**Remember:** Launched.\n' });
  await legacy.retire('event_launch', { reason: 'Old news.' });
  await legacy.save({ type: 'user', name: 'prefers-short', description: 'Mike likes short replies', source: `Mike, ${today}`, status: 'needs-review', body: '**Remember:** Short replies.\n' });
  for (const s of await legacy.list({ status: 'all' })) versions[s.key] = (await legacy.get(s.key)).version;
  summary.move = { projectPage: c1.notion.project.url, oldDatabase: oldDb.url, oldDatabaseId: normalizeId(oldDb.id), versionsBefore: versions };
  return `${Object.keys(versions).length} records in ${oldDb.url}`;
});
await check('move: ensure-project copies every record into the Lore layout and renames the old database', async () => {
  const r = await toolkit(moveRoot, ['notion', 'ensure-project', '--json']);
  const j = JSON.parse(r.out);
  assert(r.code === 0, JSON.stringify(j.report && j.report.problems));
  moveCfg = readConfig(moveRoot);
  assert(moveCfg.notion.memory.layout === 'lore', 'the memory block is not a Lore block');
  const db = await client.getDatabase(oldDb.id);
  assert(plain(db.title) === OLD_MEMORY_DATABASE_TITLE, `old database title "${plain(db.title)}"`);
  assert(!db.in_trash, 'the old database is in the trash');
  const oldRows = await client.queryAll(oldDb.data_sources[0].id);
  assert(oldRows.length === Object.keys(versions).length, `${oldRows.length} rows left in the old database`);
  summary.move.memoryPage = moveCfg.notion.memory.pageUrl;
  summary.move.memories = moveCfg.notion.memory.url;
  summary.move.notes = j.report.notes;
  return j.report.notes.join(' ');
});
await check('move: every record reads back from the Lore layout with the same version', async () => {
  const driver = await loadDriver(p(moveRoot, moveCfg), { env });
  assert(driver.lore === true, 'the driver did not read the Lore layout');
  const after = {};
  for (const [key, version] of Object.entries(versions)) {
    const g = await driver.get(key);
    assert(g, `${key} is missing`);
    after[key] = g.version;
    assert(g.version === version, `${key}: ${version.slice(0, 12)} before, ${g.version.slice(0, 12)} after`);
  }
  const successor = await driver.findRow('project_release_days');
  const old = await driver.findRow('feedback_deploy_window');
  assert(readValue(successor, moveCfg.notion.memory.properties.supersedes).map(normalizeId).join() === normalizeId(old.id), 'Supersedes relation');
  summary.move.versionsAfter = after;
  return Object.entries(after).map(([k, v]) => `${k} ${v.slice(0, 12)}`).join(', ');
});
await check('move: ensure-project again changes nothing', async () => {
  const before = fs.readFileSync(path.join(moveRoot, '.toolkit.json'), 'utf8');
  const r = await toolkit(moveRoot, ['notion', 'ensure-project', '--json']);
  const j = JSON.parse(r.out);
  assert(!j.report.created.length && !j.report.added.length && !j.report.problems.length && !j.report.notes.length, JSON.stringify(j.report));
  assert(fs.readFileSync(path.join(moveRoot, '.toolkit.json'), 'utf8') === before, '.toolkit.json was written again');
  return `${j.calls} calls`;
});

const failed = results.filter((r) => !r.ok);
summary.results = results;
if (outFile) fs.writeFileSync(outFile, `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\n${results.length - failed.length} of ${results.length} checks passed in ${Math.round((Date.now() - started) / 1000)} s.`);
console.log(`Lore layout project: ${summary.lore.projectPage}; move project: ${summary.move ? summary.move.projectPage : 'none'}`);
process.exitCode = failed.length ? 1 : 0;
