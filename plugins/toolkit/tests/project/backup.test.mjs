// toolkit export and toolkit import (critique I17), toolkit index knowledge,
// and toolkit machine-setup.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { cleanup, initProject, makeHome, listFiles, read, testEnv, tk, tempDir, PLUGIN_ROOT } from './helpers.mjs';
import { wrapperScript, WRAPPER_MARK } from '../../lib/project/machine.mjs';

after(cleanup);

async function seeded() {
  const p = await initProject();
  const { root, env } = p;
  for (const args of [
    ['work', 'new', '--title', 'Login page'],
    ['work', 'new', '--title', 'Password reset', '--parent', 'WI-001'],
    ['memory', 'save', '--type', 'feedback', '--name', 'short-answers', '--description', 'The owner wants short answers', '--body', '## Remember\n\nShort answers.\n'],
  ]) {
    const r = await tk(root, args, { env });
    assert.equal(r.code, 0, `${args.join(' ')}: ${r.stderr || r.stdout}`);
  }
  return p;
}

test('export copies .work-items/ with its state file and .memory/, and records the time', async () => {
  const { root, env } = await seeded();
  const out = path.join(tempDir(), 'backup');
  const res = await tk(root, ['export', '--to', out, '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  const files = listFiles(out);
  assert.ok(files.includes('toolkit-export.json'));
  assert.ok(files.includes('work-items/.toolkit-state.json'), 'the state file is included');
  assert.ok(files.some((f) => /^work-items\/WI-001-[^/]+\/WI-002-[^/]+\/WORK-ITEM\.md$/.test(f)), 'the nested sub-item is included');
  assert.ok(files.includes('memory/feedback_short_answers.md'));
  assert.ok(!files.some((f) => f.endsWith('.lock')));
  const record = JSON.parse(read(path.join(root, '.git', 'toolkit-v2', 'export.json')));
  assert.equal(record.to, out);
  // A second export to the same folder replaces the earlier one.
  const again = await tk(root, ['export', '--to', out], { env });
  assert.equal(again.code, 0, again.stderr);
  // A folder with other files is refused, and so is a folder inside .work-items/.
  const other = tempDir();
  fs.writeFileSync(path.join(other, 'x.txt'), 'x');
  assert.equal((await tk(root, ['export', '--to', other], { env })).code, 2);
  assert.equal((await tk(root, ['export', '--to', path.join(root, '.work-items', 'bk')], { env })).code, 2);
});

test('import restores into a fresh project on another computer; a real difference is a conflict unless --replace', async () => {
  const { root, env } = await seeded();
  const out = path.join(tempDir(), 'backup');
  assert.equal((await tk(root, ['export', '--to', out], { env })).code, 0);

  const fresh = await initProject();
  const dry = await tk(fresh.root, ['import', '--from', out, '--dry-run', '--json'], { env: fresh.env });
  assert.equal(dry.code, 0, dry.stderr);
  assert.ok(dry.json.written.some((f) => f.endsWith('feedback_short_answers.md')));
  assert.ok(!fs.existsSync(path.join(fresh.root, '.memory', 'feedback_short_answers.md')), 'the dry run wrote nothing');
  const res = await tk(fresh.root, ['import', '--from', out], { env: fresh.env });
  assert.equal(res.code, 0, res.stderr);
  const list = await tk(fresh.root, ['work', 'list', '--json'], { env: fresh.env });
  assert.equal(list.code, 0, list.stderr);
  assert.deepEqual(list.json.items.map((i) => i.id).sort(), ['WI-001', 'WI-002']);
  const mem = await tk(fresh.root, ['memory', 'get', 'feedback_short_answers'], { env: fresh.env });
  assert.equal(mem.code, 0, mem.stderr);
  assert.match(read(path.join(fresh.root, '.memory', 'MEMORY.md')), /feedback_short_answers/);
  const next = await tk(fresh.root, ['work', 'new', '--title', 'Third', '--json'], { env: fresh.env });
  assert.match(next.stdout, /WI-003/, 'ids continue after the imported high-water mark');

  // A project with its own different copy of a file: conflict, nothing written.
  const other = await seeded();
  const focus = path.join(other.root, '.memory', 'feedback_short_answers.md');
  fs.writeFileSync(focus, read(focus).replace('Short answers.', 'Long answers.'));
  const conflict = await tk(other.root, ['import', '--from', out], { env: other.env });
  assert.equal(conflict.code, 2);
  assert.match(conflict.stderr, /different versions/);
  assert.match(read(focus), /Long answers/);
  const replaced = await tk(other.root, ['import', '--from', out, '--replace'], { env: other.env });
  assert.equal(replaced.code, 0, replaced.stderr);
  assert.match(read(focus), /Short answers/);
});

test('restoring into the same project after its export: the memory meta file is merged, not a conflict', async () => {
  const { root, env } = await seeded();
  const out = path.join(tempDir(), 'backup');
  assert.equal((await tk(root, ['export', '--to', out], { env })).code, 0);
  // A save after the export makes the project's last-save time newer than the export's.
  const save = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploy-day', '--description', 'Deploys happen on Thursday', '--body', 'Thursday.\n'], { env });
  assert.equal(save.code, 0, save.stderr);
  const metaFile = path.join(root, '.memory', '.toolkit-meta.json');
  const metaBefore = JSON.parse(read(metaFile));
  fs.rmSync(path.join(root, '.work-items'), { recursive: true, force: true });
  const doctor = await tk(root, ['doctor', '--json'], { env });
  const missing = doctor.json.findings.find((f) => f.id === 'tracker-missing');
  assert.match(missing.fix, /toolkit import --from <folder> --only work-items/);
  const res = await tk(root, ['import', '--from', out, '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.ok(res.json.written.some((f) => f.startsWith('.work-items/')));
  const meta = JSON.parse(read(metaFile));
  assert.equal(meta.lastSave, metaBefore.lastSave, 'the later save time is kept');
  assert.equal(meta.lastExport, metaBefore.lastExport);
  assert.equal(meta.lastExportTo, out);
  assert.ok(fs.existsSync(path.join(root, '.memory', 'project_deploy_day.md')), 'a record saved after the export stays');
  const list = await tk(root, ['work', 'list', '--json'], { env });
  assert.deepEqual(list.json.items.map((i) => i.id).sort(), ['WI-001', 'WI-002']);
});

test('import --only restores one part and leaves the other alone', async () => {
  const { root, env } = await seeded();
  const out = path.join(tempDir(), 'backup');
  assert.equal((await tk(root, ['export', '--to', out], { env })).code, 0);
  const record = path.join(root, '.memory', 'feedback_short_answers.md');
  fs.writeFileSync(record, read(record).replace('Short answers.', 'Long answers.'));
  fs.rmSync(path.join(root, '.work-items'), { recursive: true, force: true });
  const all = await tk(root, ['import', '--from', out], { env });
  assert.equal(all.code, 2, 'the changed memory record is a conflict');
  const only = await tk(root, ['import', '--from', out, '--only', 'work-items', '--json'], { env });
  assert.equal(only.code, 0, only.stderr);
  assert.deepEqual(only.json.parts, ['work-items']);
  assert.ok(!only.json.written.some((f) => f.startsWith('.memory/')));
  assert.match(read(record), /Long answers/);
  assert.ok(fs.existsSync(path.join(root, '.work-items', '.toolkit-state.json')));
  const bad = await tk(root, ['import', '--from', out, '--only', 'tracker'], { env });
  assert.equal(bad.code, 2);
  assert.match(bad.stderr, /--only work-items or --only memory/);
});

test('export refuses a folder inside the project that Git does not ignore, and accepts an ignored one', async () => {
  const { root, env } = await seeded();
  const inside = await tk(root, ['export', '--to', path.join(root, 'backups')], { env });
  assert.equal(inside.code, 2);
  assert.match(inside.stderr, /Git does not ignore it/);
  assert.ok(!fs.existsSync(path.join(root, 'backups')), 'nothing was written');
  const ignored = await tk(root, ['export', '--to', path.join(root, '.toolkit-cache', 'backup')], { env });
  assert.equal(ignored.code, 0, ignored.stderr);
});

test('export and import say there is nothing to back up for a Notion or Hindsight project', async () => {
  const root = (await initProject({ tracker: 'github' })).root;
  const cfgFile = path.join(root, '.toolkit.json');
  const cfg = JSON.parse(read(cfgFile));
  cfg.memory.type = 'hindsight';
  fs.writeFileSync(cfgFile, JSON.stringify(cfg));
  const env = testEnv(makeHome());
  const res = await tk(root, ['export', '--to', path.join(tempDir(), 'b')], { env });
  assert.equal(res.code, 3);
  assert.match(res.stderr, /toolkit memory export/);
});

test('toolkit index knowledge rebuilds INDEX.md from SOURCE-RECORD.md files', async () => {
  const { root, env } = await initProject();
  const topic = path.join(root, 'ai-external-knowledge', 'node-docs');
  fs.mkdirSync(topic);
  fs.writeFileSync(path.join(topic, 'SOURCE-RECORD.md'), '# Node.js test runner\n\n- Publisher: OpenJS Foundation.\n- Captured on: 2026-09-25.\n\n## Project use\n\nRead before writing tests.\n');
  let res = await tk(root, ['index', 'knowledge', '--check'], { env });
  assert.equal(res.code, 1);
  res = await tk(root, ['index', 'knowledge'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(read(path.join(root, 'ai-external-knowledge', 'INDEX.md')), /\| \[node-docs\/\]\(node-docs\/\) \| OpenJS Foundation: Node\.js test runner \| 2026-09-25 \| Read before writing tests\. \|/);
  res = await tk(root, ['index', 'knowledge', '--check'], { env });
  assert.equal(res.code, 0);
  const sync = await tk(root, ['sync', '--json'], { env });
  assert.deepEqual(sync.json.changedByProject, [], 'the generated index is never counted as changed by the project');
  assert.equal((await tk(root, ['index', 'things'], { env })).code, 2);
});

test('machine-setup writes the wrapper script and the pointer; the wrapper runs the toolkit', async () => {
  const home = makeHome();
  const env = testEnv(home, { PATH: `${path.join(home, '.local', 'bin')}${path.delimiter}${process.env.PATH}` });
  const res = await tk(home, ['machine-setup', '--offline', '--json'], { env });
  assert.equal(res.code, 0, res.stdout);
  const wrapper = path.join(home, '.local', 'bin', 'toolkit');
  const text = read(wrapper);
  assert.ok(text.startsWith('#!/bin/sh\n'));
  assert.ok(text.includes(WRAPPER_MARK));
  assert.ok(fs.statSync(wrapper).mode & 0o100, 'executable');
  assert.ok(!fs.lstatSync(wrapper).isSymbolicLink(), 'a regular file, not a link');
  assert.equal(read(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'plugin-root')).trim(), PLUGIN_ROOT);
  const run = spawnSync('/bin/sh', [wrapper, 'version'], { env, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout.trim(), /^\d+\.\d+\.\d+$/);
  // With the pointer gone, the wrapper uses its fallback folder.
  fs.rmSync(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'plugin-root'));
  const fallback = spawnSync('/bin/sh', [wrapper, 'version'], { env, encoding: 'utf8' });
  assert.equal(fallback.status, 0, fallback.stderr);
  // Running it again changes nothing; a wrapper someone else wrote is left alone.
  const again = await tk(home, ['machine-setup', '--offline'], { env });
  assert.match(again.stdout, /already up to date/);
  // Codex lists the V2 skills only in a project init set up, so the output says how to start one.
  assert.match(again.stdout, /Codex: the toolkit plugin is not on for every folder yet, so the Toolkit V2 skills appear only in a project that toolkit init has set up\. To start a new project from Codex, first run toolkit init in a terminal/);
  fs.writeFileSync(wrapper, '#!/bin/sh\necho mine\n');
  const foreign = await tk(home, ['machine-setup', '--offline'], { env });
  assert.equal(foreign.code, 1);
  assert.match(foreign.stdout, /was not written by toolkit machine-setup, so it was left alone/);
  assert.equal(read(wrapper), '#!/bin/sh\necho mine\n');
});

test('the wrapper with no pointer and no fallback says what to do', () => {
  const dir = tempDir();
  const wrapper = path.join(dir, 'toolkit');
  fs.writeFileSync(wrapper, wrapperScript(path.join(dir, 'nowhere')), { mode: 0o755 });
  const res = spawnSync('/bin/sh', [wrapper, 'version'], { env: { ...process.env, TOOLKIT_V2_CONFIG_DIR: path.join(dir, 'cfg') }, encoding: 'utf8' });
  assert.equal(res.status, 127);
  assert.match(res.stderr, /Toolkit V2 plugin folder was not found/);
});
