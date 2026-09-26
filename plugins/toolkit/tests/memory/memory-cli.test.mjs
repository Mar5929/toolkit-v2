import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { FOCUS_SECTIONS } from '../../lib/memory/contract.mjs';
import { addWorktree, body, cleanup, makeProject, runToolkit, tempDir, PLUGIN } from './helpers.mjs';

after(cleanup);

const FOCUS = `# Current focus\n\n${FOCUS_SECTIONS.map((h) => `## ${h}\n\n- WI-002\n`).join('\n')}`;

function saveArgs(name, extra = []) {
  return ['memory', 'save', '--type', 'feedback', '--name', name, '--description', `Rule about ${name}.`, '--body', body(`Rule ${name}.`), ...extra];
}

test('save from a worktree with --approved-by, then get, list, find (text and JSON)', async () => {
  const { root } = makeProject();
  const wt = addWorktree(root);
  const saved = await runToolkit([...saveArgs('deploy-window', ['--approved-by', 'Mike']), '--json'], { cwd: wt });
  assert.equal(saved.code, 0, saved.stdout + saved.stderr);
  assert.equal(saved.json.key, 'feedback_deploy_window');
  assert.equal(saved.json.created, true);
  assert.equal(saved.json.approved_by, 'Mike');
  assert.equal(saved.json.path, path.join(root, '.memory', 'feedback_deploy_window.md'));
  const text = fs.readFileSync(saved.json.path, 'utf8');
  assert.match(text, /^approved_by: Mike$/m);
  assert.match(text, /^source: Mike, \d{4}-\d{2}-\d{2}$/m);

  const human = await runToolkit(saveArgs('second-rule'), { cwd: wt });
  assert.equal(human.code, 0);
  assert.match(human.stdout, /^Saved to memory: feedback_second_rule \(new record\)\./);
  assert.match(fs.readFileSync(path.join(root, '.memory', 'feedback_second_rule.md'), 'utf8'), /^source: Agent session, /m);

  const got = await runToolkit(['memory', 'get', 'feedback_deploy_window'], { cwd: root });
  assert.equal(got.stdout, text);
  const list = await runToolkit(['memory', 'list'], { cwd: wt });
  assert.equal(list.stdout, '- feedback_deploy_window: Rule about deploy-window.\n- feedback_second_rule: Rule about second-rule.\n');
  const found = await runToolkit(['memory', 'find', 'deploy', 'window', '--json'], { cwd: wt });
  assert.equal(found.json.results[0].key, 'feedback_deploy_window');
  const none = await runToolkit(['memory', 'find', 'zebra'], { cwd: wt });
  assert.equal(none.code, 0);
  assert.match(none.stdout, /No memory records match "zebra"/);
});

test('save reads the body from standard input and takes missing fields from its frontmatter', async () => {
  const { root } = makeProject();
  const input = '---\ntype: reference\nname: grafana_dashboard\ndescription: Where the uptime dashboard lives.\nsource: Mike, 2026-09-20\nlast_verified: unknown\n---\n\n**Remember:** The dashboard is under Ops.\n';
  const res = await runToolkit(['memory', 'save', '--body-file', '-', '--json'], { cwd: root, stdin: input });
  assert.equal(res.code, 0, res.stdout);
  assert.equal(res.json.key, 'reference_grafana_dashboard');
  const text = fs.readFileSync(path.join(root, '.memory', 'reference_grafana_dashboard.md'), 'utf8');
  assert.match(text, /^name: grafana-dashboard$/m);
  assert.match(text, /^source: Mike, 2026-09-20$/m);
  assert.match(text, /^last_verified: unknown$/m);
  assert.match(text, /\*\*Remember:\*\* The dashboard is under Ops\.\n$/);
  const fileBody = path.join(root, 'note.md');
  fs.writeFileSync(fileBody, body('From a file.'));
  const res2 = await runToolkit(['memory', 'save', '--type', 'user', '--name', 'likes-short-replies', '--description', 'Mike wants short replies.', '--body-file', 'note.md'], { cwd: root });
  assert.equal(res2.code, 0, res2.stderr);
  const missing = await runToolkit(['memory', 'save', '--type', 'user', '--name', 'x', '--description', 'y', '--body-file', 'nope.md'], { cwd: root });
  assert.equal(missing.code, 2);
  assert.match(missing.stderr, /there is no such file/);
});

test('an update keeps the old source; --supersedes retires the old record', async () => {
  const { root } = makeProject();
  await runToolkit([...saveArgs('old-rule'), '--source', 'Mike in the kickoff call, 2026-09-01'], { cwd: root });
  await runToolkit(saveArgs('old-rule'), { cwd: root });
  assert.match(fs.readFileSync(path.join(root, '.memory', 'feedback_old_rule.md'), 'utf8'), /^source: Mike in the kickoff call, 2026-09-01$/m);
  const res = await runToolkit([...saveArgs('new-rule', ['--supersedes', 'feedback_old_rule']), '--json'], { cwd: root });
  assert.equal(res.code, 0, res.stdout);
  assert.equal(res.json.retired, 'feedback_old_rule');
  const old = await runToolkit(['memory', 'get', 'feedback_old_rule', '--json'], { cwd: root });
  assert.equal(old.json.status, 'retired');
  assert.equal(old.json.superseded_by, 'feedback_new_rule');
  const bad = await runToolkit(saveArgs('third-rule', ['--supersedes', 'feedback_missing']), { cwd: root });
  assert.equal(bad.code, 1);
  assert.match(bad.stderr, /feedback_third_rule was saved, but feedback_missing was not retired/);
});

test('stale --expect is refused with exit 2', async () => {
  const { root } = makeProject();
  const first = await runToolkit([...saveArgs('versioned'), '--json'], { cwd: root });
  const ok = await runToolkit([...saveArgs('versioned'), '--last-verified', 'unknown', '--expect', first.json.version.slice(0, 12)], { cwd: root });
  assert.equal(ok.code, 0, ok.stderr);
  const stale = await runToolkit([...saveArgs('versioned'), '--expect', first.json.version], { cwd: root });
  assert.equal(stale.code, 2);
  const absent = await runToolkit([...saveArgs('versioned'), '--expect', 'absent'], { cwd: root });
  assert.equal(absent.code, 2);
});

test('delete needs --owner-approved; retire and restore work by key', async () => {
  const { root } = makeProject();
  await runToolkit(saveArgs('to-remove'), { cwd: root });
  const refused = await runToolkit(['memory', 'delete', 'feedback_to_remove'], { cwd: root });
  assert.equal(refused.code, 2);
  assert.match(refused.stderr, /needs the owner's explicit approval/);
  const fake = await runToolkit(['memory', 'delete', 'feedback_to_remove', '--owner-approved=x'], { cwd: root });
  assert.equal(fake.code, 2);
  assert.ok(fs.existsSync(path.join(root, '.memory', 'feedback_to_remove.md')));

  const retired = await runToolkit(['memory', 'retire', 'feedback_to_remove', '--reason', 'No longer true.'], { cwd: root });
  assert.equal(retired.code, 0);
  assert.match(retired.stdout, /Undo with: toolkit memory restore feedback_to_remove/);
  const restored = await runToolkit(['memory', 'restore', 'feedback_to_remove'], { cwd: root });
  assert.equal(restored.code, 0);
  const list = await runToolkit(['memory', 'list', '--status', 'needs-review'], { cwd: root });
  assert.match(list.stdout, /feedback_to_remove \[needs review\]/);

  const deleted = await runToolkit(['memory', 'delete', 'feedback_to_remove', '--owner-approved'], { cwd: root });
  assert.equal(deleted.code, 0, deleted.stderr);
  assert.equal(deleted.stdout, 'Deleted feedback_to_remove. This cannot be undone.\n');
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'feedback_to_remove.md')));
  const gone = await runToolkit(['memory', 'get', 'feedback_to_remove'], { cwd: root });
  assert.equal(gone.code, 1);
});

test('focus and glossary through the command', async () => {
  const { root } = makeProject();
  const empty = await runToolkit(['memory', 'focus'], { cwd: root });
  assert.match(empty.stdout, /There is no current focus yet/);
  const set = await runToolkit(['memory', 'focus', '--set-file', '-'], { cwd: root, stdin: FOCUS });
  assert.equal(set.code, 0, set.stderr);
  assert.match(set.stdout, /Saved the current focus \(\d+ lines\)/);
  const got = await runToolkit(['memory', 'focus'], { cwd: root });
  assert.equal(got.stdout, FOCUS);
  const bad = await runToolkit(['memory', 'focus', '--set-file', '-'], { cwd: root, stdin: '# Focus\n\n## Recent decisions\n' });
  assert.equal(bad.code, 2);
  assert.match(bad.stderr, /needs these ## sections/);
  const g = await runToolkit(['memory', 'glossary', '--set-file', '-', '--json'], { cwd: root, stdin: '# Terminology glossary\n\n- WI: work item\n' });
  assert.equal(g.code, 0);
  assert.equal(g.json.kind, 'glossary');
});

test('status, reindex, export, and import through the command', async () => {
  const { root } = makeProject();
  await runToolkit(saveArgs('status-rule'), { cwd: root });
  const st = await runToolkit(['memory', 'status'], { cwd: root });
  assert.equal(st.code, 0, st.stdout + st.stderr);
  assert.match(st.stdout, /^Backend: builtin$/m);
  assert.match(st.stdout, /^Healthy: yes$/m);
  assert.match(st.stdout, /^Records: 1 current, 0 needing review, 0 retired$/m);
  assert.match(st.stdout, /^Last save: \d{4}-\d{2}-\d{2}T/m);
  const ri = await runToolkit(['memory', 'reindex', '--json'], { cwd: root });
  assert.equal(ri.json.count, 1);
  const dir = path.join(tempDir(), 'memory-backup');
  const ex = await runToolkit(['memory', 'export', '--to', dir], { cwd: root });
  assert.equal(ex.code, 0, ex.stderr);
  assert.match(ex.stdout, /Exported 1 memory record \(0 retired\)/);
  const other = makeProject();
  const im = await runToolkit(['memory', 'import', '--from', dir], { cwd: other.root });
  assert.equal(im.code, 0, im.stdout);
  assert.ok(fs.existsSync(path.join(other.root, '.memory', 'feedback_status_rule.md')));
});

test('exit codes: not a project 4, unknown backend 2, missing driver 3, unknown subcommand 2', async () => {
  const plain = tempDir();
  const notProject = await runToolkit(['memory', 'list'], { cwd: plain });
  assert.equal(notProject.code, 4);

  const odd = makeProject({ memory: { type: 'cloud' } });
  const unknown = await runToolkit(['memory', 'list'], { cwd: odd.root });
  assert.equal(unknown.code, 2);
  assert.match(unknown.stderr, /memory.type is "cloud"/);

  const notionFile = path.join(PLUGIN, 'lib', 'memory', 'notion.mjs');
  if (!fs.existsSync(notionFile)) {
    const notion = makeProject({ memory: { type: 'notion' } });
    const missing = await runToolkit(['memory', 'list'], { cwd: notion.root });
    assert.equal(missing.code, 3);
    assert.match(missing.stderr, /notion memory driver is not installed/);
  }

  const hs = makeProject({ memory: { type: 'hindsight' } });
  const noBank = await runToolkit(['memory', 'list'], { cwd: hs.root });
  assert.equal(noBank.code, 2);
  assert.match(noBank.stderr, /no hindsight.bank/);
  // status reports the missing bank as a problem instead of refusing to run.
  const noBankStatus = await runToolkit(['memory', 'status', '--json'], { cwd: hs.root });
  assert.equal(noBankStatus.code, 1);
  assert.equal(noBankStatus.json.healthy, false);
  assert.deepEqual(noBankStatus.json.problems, [{ where: '.toolkit.json', problem: 'has no hindsight.bank.' }]);

  const { root } = makeProject();
  const bad = await runToolkit(['memory', 'frobnicate'], { cwd: root });
  assert.equal(bad.code, 2);
  const reflect = await runToolkit(['memory', 'find', 'x', 'y', '--reflect'], { cwd: root });
  assert.equal(reflect.code, 3);
  const helpText = await runToolkit(['memory'], { cwd: plain });
  assert.equal(helpText.code, 0);
  assert.match(helpText.stdout, /toolkit memory save --type/);
});

test('an update keeps approved_by, other frontmatter fields, and last_verified unless given again', async () => {
  const { root } = makeProject();
  const file = path.join(root, '.memory', 'feedback_kept_fields.md');
  const input = '---\ntype: feedback\nname: kept-fields\ndescription: Rule about kept fields.\nsource: Mike, 2026-09-01\nlast_verified: 2026-09-01\nticket: WI-007\n---\n\n**Remember:** Keep them.\n';
  const first = await runToolkit(['memory', 'save', '--body-file', '-', '--approved-by', 'Mike'], { cwd: root, stdin: input });
  assert.equal(first.code, 0, first.stderr);
  assert.match(fs.readFileSync(file, 'utf8'), /^ticket: WI-007$/m);

  const update = await runToolkit(saveArgs('kept-fields'), { cwd: root });
  assert.equal(update.code, 0, update.stderr);
  const text = fs.readFileSync(file, 'utf8');
  assert.match(text, /^approved_by: Mike$/m);
  assert.match(text, /^ticket: WI-007$/m);
  assert.match(text, /^last_verified: 2026-09-01$/m);
  assert.match(text, /^source: Mike, 2026-09-01$/m);

  // A record that needed review and is saved again has just been checked.
  await runToolkit(['memory', 'retire', 'feedback_kept_fields'], { cwd: root });
  await runToolkit(['memory', 'restore', 'feedback_kept_fields'], { cwd: root });
  const reviewed = await runToolkit(saveArgs('kept-fields'), { cwd: root });
  assert.equal(reviewed.code, 0, reviewed.stderr);
  const after = fs.readFileSync(file, 'utf8');
  assert.match(after, /^status: current$/m);
  assert.doesNotMatch(after, /^last_verified: 2026-09-01$/m);
  assert.match(after, /^last_verified: \d{4}-\d{2}-\d{2}$/m);
  assert.match(after, /^approved_by: Mike$/m);
});

test('a name over 60 characters is refused (exit 2) instead of being cut into another record\'s key', async () => {
  const { root } = makeProject();
  const alpha = await runToolkit(saveArgs('a-very-long-name-that-goes-on-and-on-about-the-payments-gateway-alpha'), { cwd: root });
  assert.equal(alpha.code, 2);
  assert.match(alpha.stderr, /Name is 69 characters; the limit is 60/);
  assert.ok(!fs.existsSync(path.join(root, '.memory')), 'nothing was written');
});

test('keys typed with dashes work for get, retire, --superseded-by, and --supersedes', async () => {
  const { root } = makeProject();
  await runToolkit(saveArgs('no-force-push'), { cwd: root });
  const got = await runToolkit(['memory', 'get', 'feedback_no-force-push', '--json'], { cwd: root });
  assert.equal(got.code, 0, got.stderr);
  assert.equal(got.json.key, 'feedback_no_force_push');
  await runToolkit(saveArgs('merge-only-by-pull-request'), { cwd: root });
  const retired = await runToolkit(['memory', 'retire', 'feedback_no-force-push', '--superseded-by', 'feedback_merge-only-by-pull-request', '--json'], { cwd: root });
  assert.equal(retired.code, 0, retired.stderr);
  assert.equal(retired.json.superseded_by, 'feedback_merge_only_by_pull_request');
  const saved = await runToolkit([...saveArgs('newest-rule', ['--supersedes', 'feedback_merge-only-by-pull-request']), '--json'], { cwd: root });
  assert.equal(saved.code, 0, saved.stderr);
  assert.equal(saved.json.retired, 'feedback_merge-only-by-pull-request'.replace(/-/g, '_'));
});

test('retire --superseded-by a key that does not exist is refused (exit 2) and changes nothing', async () => {
  const { root } = makeProject();
  await runToolkit(saveArgs('newer'), { cwd: root });
  const res = await runToolkit(['memory', 'retire', 'feedback_newer', '--superseded-by', 'feedback_nothing_here'], { cwd: root });
  assert.equal(res.code, 2);
  assert.match(res.stderr, /feedback_newer was not retired: the replacement feedback_nothing_here does not exist/);
  assert.match(fs.readFileSync(path.join(root, '.memory', 'feedback_newer.md'), 'utf8'), /^status: current$/m);
});
