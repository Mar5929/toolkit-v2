import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createDriver, BuiltinDriver, INDEX_MAX_ENTRIES, reindexVault } from '../../lib/memory/builtin.mjs';
import { exportMemory, importMemory, MANIFEST_FILE } from '../../lib/memory/transfer.mjs';
import { memoryBriefing } from '../../lib/memory/startup.mjs';
import { requireProject } from '../../lib/core/config.mjs';
import { EXIT } from '../../lib/core/output.mjs';
import { FOCUS_SECTIONS } from '../../lib/memory/contract.mjs';
import { addWorktree, body, cleanup, makeProject } from './helpers.mjs';

after(cleanup);

const fixed = () => new Date('2026-09-26T15:00:00Z');

function rec(name, extra = {}) {
  return {
    type: 'project',
    name,
    description: `About ${name}.`,
    source: 'Mike in chat, 2026-09-26',
    body: body(`Point about ${name}.`),
    ...extra,
  };
}

async function driverFor(cwd) {
  const project = requireProject(cwd);
  return createDriver({ root: project.root, mainRoot: project.mainRoot, config: project.config, now: fixed });
}

const FOCUS = `# Current focus\n\n${FOCUS_SECTIONS.map((h) => `## ${h}\n\n- WI-001 (keep < 50 lines)\n`).join('\n')}`;

test('save, get, list, find, retire, restore, delete: the full record lifecycle', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  const saved = await d.save(rec('payments-api', { approved_by: 'Mike' }), { expect: 'absent' });
  assert.equal(saved.key, 'project_payments_api');
  assert.equal(saved.created, true);
  const file = path.join(root, '.memory', 'project_payments_api.md');
  assert.ok(fs.existsSync(file));
  const got = await d.get('project_payments_api');
  assert.equal(got.text, fs.readFileSync(file, 'utf8'));
  assert.equal(got.version, saved.version);
  assert.equal(got.approved_by, 'Mike');
  assert.equal(got.valid, true);

  assert.deepEqual((await d.list()).map((r) => r.key), ['project_payments_api']);
  const found = await d.find('payments point');
  assert.equal(found.mode, 'keyword');
  assert.equal(found.results[0].key, 'project_payments_api');

  await d.save(rec('billing-cycle'));
  const retired = await d.retire('project_payments_api', { supersededBy: 'project_billing_cycle', reason: 'Replaced.' });
  assert.equal(retired.record.status, 'retired');
  assert.equal(retired.record.superseded_by, 'project_billing_cycle');
  assert.ok(!fs.existsSync(file));
  assert.ok(fs.existsSync(path.join(root, '.memory', 'archive', 'project_payments_api.md')));
  assert.deepEqual((await d.list()).map((r) => r.key), ['project_billing_cycle']);
  assert.deepEqual((await d.list({ status: 'retired' })).map((r) => r.key), ['project_payments_api']);
  assert.equal((await d.find('payments')).results.length, 0);
  assert.equal((await d.find('payments', { all: true })).results.length, 1);
  assert.doesNotMatch(fs.readFileSync(path.join(root, '.memory', 'MEMORY.md'), 'utf8'), /project_payments_api/);

  const restored = await d.restore('project_payments_api');
  assert.equal(restored.record.status, 'needs-review');
  assert.equal(restored.record.superseded_by, null);
  assert.ok(fs.existsSync(file));
  assert.match(fs.readFileSync(path.join(root, '.memory', 'MEMORY.md'), 'utf8'), /project_payments_api\.md\): About payments-api\. \(needs review\)/);

  await d.delete('project_payments_api');
  assert.equal(await d.get('project_payments_api'), null);
  await assert.rejects(d.delete('project_payments_api'), (err) => err.code === EXIT.ERROR && /no memory record/.test(err.message));
  await assert.rejects(d.retire('project_nothing'), (err) => err.code === EXIT.ERROR);
});

test('expect: absent refuses an existing key; a stale version refuses and changes nothing', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  const first = await d.save(rec('alpha'));
  await assert.rejects(d.save(rec('alpha'), { expect: 'absent' }), (err) => err.code === EXIT.INVALID);
  const second = await d.save(rec('alpha', { description: 'Second text.' }), { expect: first.version });
  assert.equal(second.created, false);
  const before = fs.readFileSync(path.join(root, '.memory', 'project_alpha.md'), 'utf8');
  await assert.rejects(d.save(rec('alpha', { description: 'Third text.' }), { expect: first.version }), (err) => err.code === EXIT.INVALID && /changed since it was read/.test(err.message));
  assert.equal(fs.readFileSync(path.join(root, '.memory', 'project_alpha.md'), 'utf8'), before);
});

test('a linked worktree reads and writes the main checkout memory', async () => {
  const { root } = makeProject();
  const wt = addWorktree(root);
  const fromWorktree = await driverFor(wt);
  assert.equal(fromWorktree.location, path.join(root, '.memory'));
  await fromWorktree.save(rec('shared-fact'));
  assert.ok(fs.existsSync(path.join(root, '.memory', 'project_shared_fact.md')));
  assert.ok(!fs.existsSync(path.join(wt, '.memory')));
  const fromMain = await driverFor(root);
  assert.equal((await fromMain.get('project_shared_fact')).description, 'About shared-fact.');
  await fromMain.focusSet(FOCUS);
  assert.equal((await fromWorktree.focusGet()).text, FOCUS);
});

test('files are written readable by everyone (0644), not owner-only', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await d.save(rec('mode-check'));
  await d.focusSet(FOCUS);
  for (const name of ['project_mode_check.md', 'MEMORY.md', 'CURRENT_FOCUS.md', '.toolkit-meta.json']) {
    const mode = fs.statSync(path.join(root, '.memory', name)).mode & 0o777;
    assert.equal(mode, 0o644, `${name} has mode ${mode.toString(8)}`);
  }
  await d.save(rec('mode-check', { description: 'Changed.' }));
  assert.equal(fs.statSync(path.join(root, '.memory', 'project_mode_check.md')).mode & 0o777, 0o644);
});

test('owner-only files from an older vault become 0644 on the next write; status names them; reindex fixes the rest', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await d.save(rec('from-model'));
  await d.save(rec('untouched'));
  const vault = path.join(root, '.memory');
  const modeOf = (name) => fs.statSync(path.join(vault, name)).mode & 0o777;
  // The model project left its files owner-only (-rw-------).
  for (const name of ['MEMORY.md', 'project_from_model.md', 'project_untouched.md']) fs.chmodSync(path.join(vault, name), 0o600);
  const st = await d.status();
  assert.ok(st.problems.some((p) => p.where === '.memory/project_untouched.md' && /mode 644/.test(p.problem)), JSON.stringify(st.problems));
  await d.save(rec('from-model', { description: 'Saved again.' }));
  assert.equal(modeOf('project_from_model.md'), 0o644);
  assert.equal(modeOf('MEMORY.md'), 0o644);
  assert.equal(modeOf('project_untouched.md'), 0o600, 'a file the save did not write keeps its mode');
  const res = await d.reindex();
  assert.match(res.detail, /1 files made readable by everyone/);
  assert.equal(modeOf('project_untouched.md'), 0o644);
  assert.ok(!(await d.status()).problems.some((p) => /mode 644/.test(p.problem)));
});

test('retire refuses a replacement that does not exist; keys typed with dashes work', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await d.save(rec('newer'));
  await assert.rejects(d.retire('project_newer', { supersededBy: 'project_nothing_here' }), (err) => err.code === EXIT.INVALID && /project_nothing_here does not exist/.test(err.message));
  assert.equal((await d.get('project_newer')).status, 'current', 'nothing changed');
  await assert.rejects(d.retire('project_newer', { supersededBy: 'project_newer' }), (err) => err.code === EXIT.INVALID && /by itself/.test(err.message));
  await d.save(rec('no-force-push', { type: 'feedback' }));
  assert.equal((await d.get('feedback_no-force-push')).key, 'feedback_no_force_push');
  const retired = await d.retire('project_newer', { supersededBy: 'feedback_no-force-push' });
  assert.equal(retired.record.superseded_by, 'feedback_no_force_push');
  await d.restore('project-newer');
  await d.delete('project_newer');
  assert.equal(await d.get('project_newer'), null);
});

test('one broken record file never blocks other saves; status reports it', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await d.save(rec('good-one'));
  const vault = path.join(root, '.memory');
  fs.writeFileSync(path.join(vault, 'project_broken.md'), '---\nname: broken\ntype: [unclosed\n---\nbody\n');
  fs.writeFileSync(path.join(vault, 'user_half_done.md'), '---\nname: half-done\ntype: user\ndescription: Something.\nstatus: current\nsource: <Person and date>\nsaved: 2026-09-26\nlast_verified: unknown\n---\n\n**Remember:** x\n');
  const saved = await d.save(rec('good-two'));
  assert.equal(saved.key, 'project_good_two');
  const keys = (await d.list()).map((r) => r.key);
  assert.ok(keys.includes('project_good_one') && keys.includes('project_good_two'));
  assert.ok(keys.includes('user_half_done'), 'a readable record with a rule problem is still listed');
  assert.ok(!keys.includes('project_broken'));
  const st = await d.status();
  assert.equal(st.healthy, true);
  const text = st.problems.map((p) => `${p.where} ${p.problem}`).join('\n');
  assert.match(text, /project_broken\.md is skipped/);
  assert.match(text, /user_half_done\.md source is still a template placeholder/);
  const got = await d.get('project_broken');
  assert.equal(got.valid, false);
});

test('template files and the seed template are not records', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  fs.mkdirSync(vault, { recursive: true });
  fs.writeFileSync(path.join(vault, 'topic-template.md'), '---\nname: <slug>\n---\n');
  fs.writeFileSync(path.join(vault, 'project_topic_template.md'), '---\nname: topic-template\ndescription: x\nmetadata:\n  type: project\nstatus: template\n---\n');
  const d = await driverFor(root);
  assert.deepEqual(await d.list({ status: 'all' }), []);
  assert.deepEqual((await d.status()).problems.filter((p) => !/MEMORY\.md/.test(p.where)), []);
});

test('MEMORY.md is generated, stable, and capped; reindex moves misplaced files', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  const vault = path.join(root, '.memory');
  await d.save(rec('one'));
  await d.save({ ...rec('two'), type: 'user' });
  const index = fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8');
  assert.match(index, /^# Memory index\n/);
  assert.ok(index.indexOf('## User') < index.indexOf('## Project'), 'types in fixed order');
  assert.match(index, /- \[project_one\]\(project_one\.md\): About one\./);
  const again = await d.reindex();
  assert.equal(again.changed, 0);
  assert.equal(fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8'), index);

  // A hand-edited status: the file sits in the wrong folder until reindex.
  const f = path.join(vault, 'project_one.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('status: current', 'status: retired'));
  assert.match((await d.status()).problems.map((p) => p.problem).join(' '), /retired but not in archive/);
  const res = await reindexVault(root);
  assert.ok(res.changed >= 1);
  assert.ok(fs.existsSync(path.join(vault, 'archive', 'project_one.md')));
  assert.doesNotMatch(fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8'), /project_one/);

  // Hand edits of MEMORY.md are replaced by the next write.
  fs.writeFileSync(path.join(vault, 'MEMORY.md'), 'hand edit\n');
  assert.match((await d.status()).problems.map((p) => p.problem).join(' '), /out of date/);
  await d.save(rec('three'));
  assert.match(fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8'), /project_three/);
});

test('the index lists at most INDEX_MAX_ENTRIES records and counts the rest', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  const d = new BuiltinDriver({ vault, now: fixed });
  fs.mkdirSync(vault, { recursive: true });
  const template = (await d.save(rec('seed'))).record.text;
  for (let i = 0; i < INDEX_MAX_ENTRIES + 5; i++) {
    fs.writeFileSync(path.join(vault, `event_e${String(i).padStart(3, '0')}.md`), template.replace('name: seed', `name: e${String(i).padStart(3, '0')}`).replace('type: project', 'type: event'));
  }
  await d.reindex();
  const index = fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8');
  assert.equal((index.match(/^- \[(?:user|feedback|project|reference|event)_/gm) || []).length, INDEX_MAX_ENTRIES);
  assert.match(index, /6 more records are not listed here/);
});

test('focus and glossary: set, get, stale expect refused', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  assert.deepEqual(await d.focusGet(), { text: '', version: null });
  const set = await d.focusSet(FOCUS, { expect: 'absent' });
  assert.equal(set.lines, FOCUS.trimEnd().split('\n').length);
  const got = await d.focusGet();
  assert.equal(got.version, set.version);
  await assert.rejects(d.focusSet(FOCUS, { expect: 'absent' }), (err) => err.code === EXIT.INVALID);
  await assert.rejects(d.focusSet('## Now\n'), (err) => err.code === EXIT.INVALID);
  const g = await d.glossarySet('# Terminology glossary\n\n| Term | Meaning |\n| --- | --- |\n| WI | work item |\n');
  assert.equal((await d.glossaryGet()).version, g.version);
  await assert.rejects(d.glossarySet('   '), (err) => err.code === EXIT.INVALID);
});

test('status reads the last save time from .toolkit-meta.json', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  const empty = await d.status();
  assert.equal(empty.healthy, false);
  assert.match(empty.detail, /does not exist yet/);
  await d.save(rec('timed'));
  const meta = JSON.parse(fs.readFileSync(path.join(root, '.memory', '.toolkit-meta.json'), 'utf8'));
  assert.equal(meta.lastSave, '2026-09-26T15:00:00.000Z');
  assert.equal(meta.lastAction, 'create');
  assert.equal(meta.lastKey, 'project_timed');
  const st = await d.status();
  assert.equal(st.lastSave, '2026-09-26T15:00:00.000Z');
  assert.equal(st.counts.current, 1);
  assert.equal(st.counts.byType.project, 1);
  assert.deepEqual(st.problems, []);
});

test('find --reflect is not supported by the built-in backend (exit 3)', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await assert.rejects(d.find('anything', { reflect: true }), (err) => err.code === EXIT.UNSUPPORTED);
  await assert.rejects(d.find('a'), (err) => err.code === EXIT.INVALID);
});

test('export and import move every record, the focus, and the glossary', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await d.save(rec('keep-me'));
  await d.save(rec('old-one'));
  await d.retire('project_old_one', { reason: 'Old.' });
  await d.focusSet(FOCUS);
  await d.glossarySet('# Terminology glossary\n\n- WI: work item\n');
  const out = path.join(path.dirname(root), 'backup');
  const res = await exportMemory(d, out);
  assert.equal(res.records, 2);
  assert.equal(res.retired, 1);
  assert.ok(fs.existsSync(path.join(out, 'project_keep_me.md')));
  assert.ok(fs.existsSync(path.join(out, 'archive', 'project_old_one.md')));
  assert.ok(fs.existsSync(path.join(out, MANIFEST_FILE)));
  assert.ok((await d.status()).lastExport);
  await assert.rejects(exportMemory(d, path.join(root, '.memory', 'x'), { forbidden: [path.join(root, '.memory')] }), (err) => err.code === EXIT.INVALID);
  fs.mkdirSync(path.join(path.dirname(root), 'busy'));
  fs.writeFileSync(path.join(path.dirname(root), 'busy', 'other.txt'), 'x');
  await assert.rejects(exportMemory(d, path.join(path.dirname(root), 'busy')), (err) => err.code === EXIT.INVALID);
  await exportMemory(d, out); // an earlier export may be replaced

  const other = makeProject();
  const d2 = await driverFor(other.root);
  const dry = await importMemory(d2, out, { dryRun: true });
  assert.equal(dry.imported.length, 2);
  assert.deepEqual(await d2.list({ status: 'all' }), []);
  const imp = await importMemory(d2, out);
  assert.deepEqual(imp.skipped, []);
  assert.equal((await d2.get('project_keep_me')).text, (await d.get('project_keep_me')).text);
  assert.equal((await d2.get('project_old_one')).status, 'retired');
  assert.equal((await d2.focusGet()).text, FOCUS);
  assert.match((await d2.glossaryGet()).text, /WI: work item/);
});

test('the startup briefing reads built-in memory live and never throws', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await d.save(rec('startup-fact'));
  await d.focusSet(FOCUS);
  const project = requireProject(root);
  const b = await memoryBriefing(project);
  assert.equal(b.ok, true);
  assert.equal(b.source, 'live');
  assert.match(b.text, /Project memory \(builtin\): 1 record\./);
  assert.match(b.text, /## Now/);
  assert.match(b.text, /- project_startup_fact: About startup-fact\./);
  const small = await memoryBriefing(project, { maxChars: 120 });
  assert.ok(small.text.length <= 120, small.text);
  const broken = await memoryBriefing({ ...project, config: { ...project.config, memory: { type: 'hindsight' }, hindsight: {} } });
  assert.equal(broken.ok, false);
  assert.match(broken.text, /could not be read/);
});
