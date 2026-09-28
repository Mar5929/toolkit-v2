import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createDriver, BuiltinDriver, INDEX_MAX_LINES, reindexVault, buildIndex } from '../../lib/memory/builtin.mjs';
import { exportMemory, importMemory, MANIFEST_FILE } from '../../lib/memory/transfer.mjs';
import { memoryBriefing } from '../../lib/memory/startup.mjs';
import { requireProject } from '../../lib/core/config.mjs';
import { EXIT } from '../../lib/core/output.mjs';
import { FOCUS_SECTIONS, normalizeRecord, serializeRecord } from '../../lib/memory/contract.mjs';
import { readTemplate, templatePath } from '../../lib/core/templates.mjs';
import { addWorktree, body, cleanup, makeProject, runToolkit, tempDir } from './helpers.mjs';

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
  // Superseded: the note stays in place (the model's "supersede in place"), says so, and the index marks it.
  const retired = await d.retire('project_payments_api', { supersededBy: 'project_billing_cycle', reason: 'Replaced.' });
  assert.equal(retired.record.status, 'retired');
  assert.equal(retired.record.superseded_by, 'project_billing_cycle');
  assert.ok(fs.existsSync(file));
  assert.match(fs.readFileSync(file, 'utf8'), /\nstatus: superseded\n[\s\S]*\*\*Superseded 2026-09-26:\*\* Replaced by \[project_billing_cycle\]\(project_billing_cycle\.md\)\. Replaced\./);
  assert.match(fs.readFileSync(path.join(root, '.memory', 'project_billing_cycle.md'), 'utf8'), /\nsupersedes: project_payments_api\n/, 'the replacement records what it supersedes');
  assert.deepEqual((await d.list()).map((r) => r.key), ['project_billing_cycle']);
  assert.deepEqual((await d.list({ status: 'retired' })).map((r) => r.key), ['project_payments_api']);
  assert.equal((await d.find('payments')).results.length, 0);
  assert.equal((await d.find('payments', { all: true })).results.length, 1);
  assert.match(fs.readFileSync(path.join(root, '.memory', 'MEMORY.md'), 'utf8'), /^- \[project_payments_api\.md\]\(project_payments_api\.md\) — About payments-api\. \[superseded\]$/m);

  const restored = await d.restore('project_payments_api');
  assert.equal(restored.record.status, 'needs-review');
  assert.equal(restored.record.superseded_by, null);
  assert.ok(fs.existsSync(file));
  assert.match(fs.readFileSync(path.join(root, '.memory', 'project_billing_cycle.md'), 'utf8'), /\nsupersedes: none\n/);
  assert.match(fs.readFileSync(path.join(root, '.memory', 'MEMORY.md'), 'utf8'), /^- \[project_payments_api\.md\]\(project_payments_api\.md\) — About payments-api\. \[needs-review\]$/m);

  // Archived: moved to archive/ and left out of the index.
  await d.retire('project_payments_api', { reason: 'Gone.' });
  assert.ok(!fs.existsSync(file));
  assert.match(fs.readFileSync(path.join(root, '.memory', 'archive', 'project_payments_api.md'), 'utf8'), /\nstatus: archived\n[\s\S]*\*\*Archived 2026-09-26:\*\* Gone\./);
  assert.doesNotMatch(fs.readFileSync(path.join(root, '.memory', 'MEMORY.md'), 'utf8'), /project_payments_api/);
  await d.restore('project_payments_api');
  assert.ok(fs.existsSync(file));

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
  assert.match(text, /user_half_done\.md uses the older toolkit record format/);
  const got = await d.get('project_broken');
  assert.equal(got.valid, false);
});

test('template files and the seed template are not records', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  fs.mkdirSync(vault, { recursive: true });
  fs.writeFileSync(path.join(vault, 'topic-template.md'), '---\nname: <slug>\n---\n');
  fs.copyFileSync(templatePath('memory/topic'), path.join(vault, 'project_topic_template.md'));
  const d = await driverFor(root);
  assert.deepEqual(await d.list({ status: 'all' }), []);
  assert.deepEqual((await d.status()).problems.filter((p) => !/MEMORY\.md/.test(p.where)), [], 'the seed template link to project_related_topic.md is not a broken link');
});

test('MEMORY.md marks a saved proposal as not a fact, not as an ordinary record that needs review', () => {
  const text = buildIndex([
    { key: 'project_release_day', type: 'project', description: 'Releases go out on Fridays', stored_status: 'needs-review', proposal: true },
    { key: 'project_review_me', type: 'project', description: 'Needs a look', stored_status: 'needs-review' },
  ]);
  assert.match(text, /^- \[project_release_day\.md\]\(project_release_day\.md\) — Releases go out on Fridays \[proposal: not a fact until the owner answers\]$/m);
  assert.match(text, /^- \[project_review_me\.md\]\(project_review_me\.md\) — Needs a look \[needs-review\]$/m);
});

test('the model .memory/ folder, copied as setup copies it, reindexes to the model MEMORY.md byte for byte', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  fs.cpSync(path.dirname(templatePath('memory/MEMORY')), vault, { recursive: true });
  const res = await reindexVault(root);
  assert.equal(res.count, 0);
  assert.equal(fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8'), readTemplate('memory/MEMORY'));
  assert.equal(buildIndex([]), readTemplate('memory/MEMORY'));
  const d = await driverFor(root);
  const st = await d.status();
  assert.deepEqual(st.problems, [], JSON.stringify(st.problems));
  assert.equal((await d.focusGet()).text, readTemplate('memory/CURRENT_FOCUS'));
  assert.equal((await d.glossaryGet()).text, readTemplate('memory/glossary'));
});

test('the first write adds missing seed files from the model templates', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  await d.save(rec('first'));
  const vault = path.join(root, '.memory');
  assert.equal(fs.readFileSync(path.join(vault, 'CURRENT_FOCUS.md'), 'utf8'), readTemplate('memory/CURRENT_FOCUS'));
  assert.equal(fs.readFileSync(path.join(vault, 'terminology-glossary.md'), 'utf8'), readTemplate('memory/glossary'));
  assert.equal(fs.readFileSync(path.join(vault, 'memory-criteria.md'), 'utf8'), readTemplate('memory/criteria'));
  assert.equal(fs.readFileSync(path.join(vault, 'AGENTS.md'), 'utf8'), readTemplate('memory/AGENTS'));
  // A seed the owner already changed is never replaced.
  fs.writeFileSync(path.join(vault, 'memory-criteria.md'), '# Mine\n');
  await d.save(rec('second'));
  assert.equal(fs.readFileSync(path.join(vault, 'memory-criteria.md'), 'utf8'), '# Mine\n');
});

test('links between notes: rename, supersede, archive, and delete repair every note that pointed at the changed one', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  const vault = path.join(root, '.memory');
  const read = (f) => fs.readFileSync(path.join(vault, f), 'utf8');
  await d.save(rec('billing'));
  await d.save(rec('ledger'));
  await d.save(rec('accounts', { body: '# Accounts\n\n**Remember:** One org per account.\n\n**Related memories:** [billing](project_billing.md) and [the ledger](project_ledger.md).\n' }));
  await d.save(rec('invoices', { body: '# Invoices\n\n**Remember:** Monthly.\n\n**Related memories:** [project_billing](project_billing.md); [accounts](project_accounts.md).\n' }));
  await d.focusSet(`# Current focus\n\nLast updated: 2026-09-26, test\n\n## Now\n\n- See [billing](project_billing.md).\n\n## Waiting on the owner\n\n- None.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- None.\n`);

  // Rename: links point at the new file; words that were the old key follow too.
  const renamed = await d.rename('project_billing', 'reference_billing_rules');
  assert.equal(renamed.key, 'reference_billing_rules');
  assert.deepEqual(renamed.linksRepaired.sort(), ['CURRENT_FOCUS.md', 'project_accounts', 'project_invoices']);
  assert.ok(!fs.existsSync(path.join(vault, 'project_billing.md')));
  assert.match(read('reference_billing_rules.md'), /^---\nname: reference_billing_rules\ndescription: About billing\.\nmetadata:\n  type: reference\n/);
  assert.match(read('project_accounts.md'), /\[billing\]\(reference_billing_rules\.md\) and \[the ledger\]\(project_ledger\.md\)/);
  assert.match(read('project_invoices.md'), /\[reference_billing_rules\]\(reference_billing_rules\.md\); \[accounts\]\(project_accounts\.md\)/);
  assert.match(read('CURRENT_FOCUS.md'), /See \[billing\]\(reference_billing_rules\.md\)/);
  assert.match(read('MEMORY.md'), /## Reference\n\n- \[reference_billing_rules\.md\]\(reference_billing_rules\.md\) — About billing\./);
  await assert.rejects(d.rename('project_ledger', 'project_accounts'), (err) => err.code === EXIT.INVALID && /already exists/.test(err.message));

  // Supersede (merge): links point at the replacement.
  const merged = await d.retire('project_ledger', { supersededBy: 'reference_billing_rules' });
  assert.deepEqual(merged.linksRepaired, ['project_accounts']);
  assert.match(read('project_accounts.md'), /\[the ledger\]\(reference_billing_rules\.md\)/);
  assert.match(read('reference_billing_rules.md'), /\nsupersedes: project_ledger\n/);

  // Archive: the link becomes its words plus "(archived)"; the archived note's own links start with ../.
  const archived = await d.retire('project_accounts', { reason: 'Moved to the CRM.' });
  assert.deepEqual(archived.linksRepaired, ['project_invoices']);
  assert.match(read('project_invoices.md'), /; accounts \(archived\)\./);
  assert.match(read('archive/project_accounts.md'), /\[billing\]\(\.\.\/reference_billing_rules\.md\)/);
  assert.deepEqual((await d.status()).problems, [], 'no broken links after the repairs');

  // Delete: the link keeps its words only.
  await d.save(rec('notes', { body: '# Notes\n\n**Remember:** x\n\n**Related memories:** [invoices](project_invoices.md)\n' }));
  const deleted = await d.delete('project_invoices');
  assert.deepEqual(deleted.linksRepaired, ['project_notes']);
  assert.match(read('project_notes.md'), /\*\*Related memories:\*\* invoices\n/);

  // A link to a note that does not exist is reported by status.
  await d.save(rec('dangling', { body: '# Dangling\n\n**Remember:** x\n\n**Related memories:** [gone](project_gone.md)\n' }));
  const st = await d.status();
  assert.ok(st.problems.some((p) => p.where === '.memory/project_dangling.md' && /links to project_gone\.md, which does not exist/.test(p.problem)), JSON.stringify(st.problems));
});

test('reindex writes a record in the older toolkit format in the model topic format', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  fs.mkdirSync(vault, { recursive: true });
  fs.writeFileSync(path.join(vault, 'feedback_old_rule.md'), '---\nname: old-rule\ntype: feedback\ndescription: An old rule.\nstatus: current\nsuperseded_by: none\nsource: Mike, 2026-09-01\nsaved: 2026-09-01\nlast_verified: 2026-09-01\napproved_by: Mike\n---\n\n# Old rule\n\n**Remember:** x\n');
  const d = await driverFor(root);
  assert.match((await d.status()).problems.map((p) => p.problem).join(' '), /older toolkit record format/);
  const res = await d.reindex();
  assert.match(res.detail, /1 files written again in the model's topic format/);
  const text = fs.readFileSync(path.join(vault, 'feedback_old_rule.md'), 'utf8');
  assert.equal(text, '---\nname: feedback_old_rule\ndescription: An old rule.\nmetadata:\n  type: feedback\nstatus: current\nsource: Mike, 2026-09-01\nlast_verified: 2026-09-01\nauthorization: Approved by Mike\nsupersedes: none\n---\n\n# Old rule\n\n**Remember:** x\n');
  assert.equal((await d.get('feedback_old_rule')).approved_by, 'Mike');
});

const HAND_SUPERSEDED = [
  '---',
  'name: project_hand_superseded',
  'description: The old release cadence, written by hand.',
  'metadata:',
  '  type: project',
  'status: superseded',
  'source: Mike in Obsidian, 2026-09-20',
  'last_verified: 2026-09-20',
  'authorization: Approved by Mike on 2026-09-20',
  'supersedes: none',
  '---',
  '',
  '# Hand superseded',
  '',
  '**Remember:** Releases went out every second Friday.',
  '',
  '**Related memories:** [release train](project_release_train.md)',
  '',
].join('\n');

test('a hand-written superseded note stays in the vault root through reindex and is listed in MEMORY.md', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  const vault = path.join(root, '.memory');
  await d.save(rec('release-train', { body: '# Release train\n\n**Remember:** Monthly.\n\n**Related memories:** [old cadence](project_hand_superseded.md)\n' }));
  const file = path.join(vault, 'project_hand_superseded.md');
  fs.writeFileSync(file, HAND_SUPERSEDED);

  const st = await d.status();
  assert.doesNotMatch(st.problems.map((p) => p.problem).join(' '), /archived but not in archive/);
  const res = await d.reindex();
  assert.doesNotMatch(res.detail, /moved/);
  assert.equal(fs.readFileSync(file, 'utf8'), HAND_SUPERSEDED, 'the hand-written file is left exactly as it was');
  assert.ok(!fs.existsSync(path.join(vault, 'archive', 'project_hand_superseded.md')));
  assert.match(fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8'), /^- \[project_hand_superseded\.md\]\(project_hand_superseded\.md\) — The old release cadence, written by hand\. \[superseded\]$/m);

  const got = await d.get('project_hand_superseded');
  assert.equal(got.status, 'retired');
  assert.equal(got.stored_status, 'superseded');
  assert.equal(got.superseded_by, null);
  const listed = (await d.list({ status: 'all' })).find((r) => r.key === 'project_hand_superseded');
  assert.equal(listed.stored_status, 'superseded');
  assert.deepEqual((await d.status()).problems, [], 'no broken links and nothing out of place');

  // The command shows the word too, and saving the note's own text changes nothing.
  const list = await runToolkit(['memory', 'list', '--status', 'all'], { cwd: root });
  assert.match(list.stdout, /^- project_hand_superseded \[superseded\]: The old release cadence, written by hand\.$/m);
  const get = await runToolkit(['memory', 'get', 'project_hand_superseded'], { cwd: root });
  const f = path.join(tempDir(), 'note.md');
  fs.writeFileSync(f, get.stdout);
  // The same key again is an update: the duplicate check wants the version that was read.
  const again = await runToolkit(['memory', 'save', '--body-file', f], { cwd: root });
  assert.equal(again.code, 2, 'the same key without --expect is refused');
  assert.match(again.stderr, /project_hand_superseded \(retired\), the same key/);
  const saved = await runToolkit(['memory', 'save', '--body-file', f, '--expect', got.version], { cwd: root });
  assert.equal(saved.code, 0, saved.stderr);
  assert.equal(fs.readFileSync(file, 'utf8'), HAND_SUPERSEDED);
});

test('saving a superseded note from its own memory get text keeps it superseded, in place, with its links', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  const d = await driverFor(root);
  await d.save(rec('release-train-v2'));
  await d.save(rec('release-train', { body: '# Release train\n\n**Remember:** Trains leave monthly.\n\n**Related memories:** [v2](project_release_train_v2.md)\n' }));
  await d.save(rec('deploys', { body: '# Deploys\n\n**Remember:** Follow the train.\n\n**Related memories:** [train](project_release_train.md)\n' }));
  const retired = await runToolkit(['memory', 'retire', 'project_release_train', '--superseded-by', 'project_release_train_v2'], { cwd: root });
  assert.equal(retired.code, 0, retired.stderr);
  const file = path.join(vault, 'project_release_train.md');
  const before = fs.readFileSync(file, 'utf8');
  assert.match(before, /\nstatus: superseded\n/);

  const get = await runToolkit(['memory', 'get', 'project_release_train'], { cwd: root });
  const f = path.join(tempDir(), 'note.md');
  fs.writeFileSync(f, get.stdout.replace('Trains leave monthly.', 'Trains left monthly.'));
  const saved = await runToolkit(['memory', 'save', '--body-file', f, '--expect', (await d.get('project_release_train')).version], { cwd: root });
  assert.equal(saved.code, 0, saved.stderr);

  assert.ok(fs.existsSync(file), 'still in the vault root');
  assert.ok(!fs.existsSync(path.join(vault, 'archive', 'project_release_train.md')));
  const after = fs.readFileSync(file, 'utf8');
  assert.equal(after, before.replace('Trains leave monthly.', 'Trains left monthly.'), 'only the edited word changed');
  const got = await d.get('project_release_train');
  assert.equal(got.stored_status, 'superseded');
  assert.equal(got.superseded_by, 'project_release_train_v2');
  assert.deepEqual((await d.status()).problems, [], 'no broken links');
});

test('reindex of an older record with superseded_by keeps the replacement and stays in the root', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  const d = await driverFor(root);
  await d.save(rec('release-train-v2'));
  const file = path.join(vault, 'project_release_train.md');
  fs.writeFileSync(file, [
    '---',
    'name: release-train',
    'type: project',
    'description: The monthly release train.',
    'status: retired',
    'superseded_by: project_release_train_v2',
    'source: Mike, 2026-09-01',
    'saved: 2026-09-01',
    'last_verified: 2026-09-01',
    'approved_by: Mike',
    '---',
    '',
    'Trains leave monthly.',
    '',
    '**Related:** [v2](project_release_train_v2.md)',
    '',
  ].join('\n'));

  const res = await d.reindex();
  assert.doesNotMatch(res.detail, /moved/);
  assert.match(res.detail, /1 files written again in the model's topic format/);
  assert.ok(fs.existsSync(file), 'still in the vault root');
  const text = fs.readFileSync(file, 'utf8');
  assert.equal(text, [
    '---',
    'name: project_release_train',
    'description: The monthly release train.',
    'metadata:',
    '  type: project',
    'status: superseded',
    'source: Mike, 2026-09-01',
    'last_verified: 2026-09-01',
    'authorization: Approved by Mike',
    'supersedes: none',
    '---',
    '',
    '# Release train',
    '',
    '**Superseded 2026-09-01:** Replaced by [project_release_train_v2](project_release_train_v2.md).',
    '',
    '**Remember:** Trains leave monthly.',
    '',
    '**Related memories:** [v2](project_release_train_v2.md)',
    '',
  ].join('\n'));
  const got = await d.get('project_release_train');
  assert.equal(got.superseded_by, 'project_release_train_v2');
  assert.equal(got.stored_status, 'superseded');

  // A second reindex leaves it where it is.
  const again = await d.reindex();
  assert.doesNotMatch(again.detail, /moved|written again/);
  assert.equal(fs.readFileSync(file, 'utf8'), text);
  assert.match(fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8'), /^- \[project_release_train\.md\]\(project_release_train\.md\) — The monthly release train\. \[superseded\]$/m);
  assert.deepEqual((await d.status()).problems, []);
});

test('saving over an archived note rebases its links', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  const d = await driverFor(root);
  await d.save(rec('release-train-v2'));
  await d.save(rec('old-cadence', { body: '# Old cadence\n\n**Remember:** Every second Friday.\n\n**Related memories:** [train](project_release_train_v2.md)\n' }));
  await d.retire('project_old_cadence', { reason: 'Replaced by the train.' });
  const archived = path.join(vault, 'archive', 'project_old_cadence.md');
  assert.match(fs.readFileSync(archived, 'utf8'), /\[train\]\(\.\.\/project_release_train_v2\.md\)/);

  // The body an agent gets from memory get (links written for archive/), saved again as current.
  const got = await d.get('project_old_cadence');
  await d.save(rec('old-cadence', { body: got.body }));
  const active = path.join(vault, 'project_old_cadence.md');
  assert.ok(fs.existsSync(active));
  assert.ok(!fs.existsSync(archived));
  const text = fs.readFileSync(active, 'utf8');
  assert.match(text, /\[train\]\(project_release_train_v2\.md\)/);
  assert.match(text, /# Old cadence\n\n\*\*Restored 2026-09-26:\*\* check that this is still true\.\n\n\*\*Archived 2026-09-26:\*\* Replaced by the train\./);
  assert.deepEqual((await d.status()).problems, []);

  // Archived again, then saved with a body written for the vault root: that link is kept.
  await d.retire('project_old_cadence');
  await d.save(rec('old-cadence', { body: '# Old cadence\n\n**Remember:** x\n\n**Related memories:** [train](project_release_train_v2.md)\n' }));
  assert.match(fs.readFileSync(active, 'utf8'), /\[train\]\(project_release_train_v2\.md\)/);

  // A note saved as archived moves into archive/ and its links follow.
  await d.save(rec('old-cadence', { status: 'archived', body: '# Old cadence\n\n**Remember:** x\n\n**Related memories:** [train](project_release_train_v2.md)\n' }));
  assert.ok(!fs.existsSync(active));
  assert.match(fs.readFileSync(archived, 'utf8'), /\nstatus: archived\n[\s\S]*\[train\]\(\.\.\/project_release_train_v2\.md\)/);
  assert.deepEqual((await d.status()).problems, []);

  // status reports a relative link that leaves the vault and finds nothing.
  await d.save(rec('stray', { body: '# Stray\n\n**Remember:** x\n\n**Related memories:** [train](../project_release_train_v2.md)\n' }));
  const st = await d.status();
  assert.ok(st.problems.some((p) => p.where === '.memory/project_stray.md'
    && /links to project_release_train_v2\.md \(outside \.memory\/\), which does not exist: \[train\]\(\.\.\/project_release_train_v2\.md\)\. Correct the link, then save the note again with toolkit memory save/.test(p.problem)), JSON.stringify(st.problems));
});

test('superseding: an archived replacement is refused; a chain keeps each note\'s history; a missing replacement is reported', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  const read = (f) => fs.readFileSync(path.join(vault, f), 'utf8');
  const d = await driverFor(root);
  await d.save(rec('a'));
  await d.save(rec('b'));
  await d.save(rec('c'));
  await d.save(rec('gone'));
  await d.retire('project_gone');
  await assert.rejects(d.retire('project_a', { supersededBy: 'project_gone' }), (err) => err.code === EXIT.INVALID && /project_gone is archived/.test(err.message));
  const cli = await runToolkit(['memory', 'retire', 'project_a', '--superseded-by', 'project_gone'], { cwd: root });
  assert.equal(cli.code, EXIT.INVALID);
  assert.match(cli.stderr, /the replacement project_gone is archived/);
  assert.match(read('project_a.md'), /\nstatus: current\n/, 'nothing changed');

  // A superseded by B, then B superseded by C: A still says B replaced it.
  await d.retire('project_a', { supersededBy: 'project_b' });
  await d.retire('project_b', { supersededBy: 'project_c' });
  assert.match(read('project_a.md'), /\*\*Superseded 2026-09-26:\*\* Replaced by \[project_b\]\(project_b\.md\)\./);
  assert.equal((await d.get('project_a')).superseded_by, 'project_b');

  // When the replacement is deleted, status says so.
  await d.delete('project_c');
  const st = await d.status();
  assert.ok(st.problems.some((p) => p.where === '.memory/project_b.md' && /is superseded by project_c, which does not exist/.test(p.problem)), JSON.stringify(st.problems));
});

test('MEMORY.md is generated, stable, and capped; reindex moves misplaced files', async () => {
  const { root } = makeProject();
  const d = await driverFor(root);
  const vault = path.join(root, '.memory');
  await d.save(rec('one'));
  await d.save({ ...rec('two'), type: 'user' });
  const index = fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8');
  assert.ok(index.startsWith(readTemplate('memory/MEMORY').split('\n## User')[0]), 'the model intro');
  assert.ok(index.indexOf('## User') < index.indexOf('## Project'), 'types in fixed order');
  assert.match(index, /^- \[project_one\.md\]\(project_one\.md\) — About one\.$/m);
  assert.ok(index.endsWith(readTemplate('memory/MEMORY').slice(readTemplate('memory/MEMORY').indexOf('## Other memory views'))), 'the model "Other memory views" section');
  const again = await d.reindex();
  assert.equal(again.changed, 0);
  assert.equal(fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8'), index);

  // A hand-edited status: the file sits in the wrong folder until reindex.
  const f = path.join(vault, 'project_one.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('status: current', 'status: archived'));
  assert.match((await d.status()).problems.map((p) => p.problem).join(' '), /archived but not in archive/);
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

test('the index is never cut; status reports it when it is over its budget', async () => {
  const { root } = makeProject();
  const vault = path.join(root, '.memory');
  const d = new BuiltinDriver({ vault, now: fixed });
  fs.mkdirSync(vault, { recursive: true });
  const n = INDEX_MAX_LINES;
  for (let i = 0; i < n; i++) {
    const key = `e${String(i).padStart(3, '0')}`;
    fs.writeFileSync(path.join(vault, `event_${key}.md`), serializeRecord(normalizeRecord({ ...rec(key), type: 'event' }, { today: '2026-09-26' })));
  }
  await d.reindex();
  const index = fs.readFileSync(path.join(vault, 'MEMORY.md'), 'utf8');
  assert.equal((index.match(/^- \[event_/gm) || []).length, n, 'every topic is listed');
  const st = await d.status();
  assert.ok(st.problems.some((p) => /over its budget/.test(p.problem)), JSON.stringify(st.problems));
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
  const g = await d.glossarySet(readTemplate('memory/glossary').replace('| <Term> | <System, team, or process> | <Concise verified meaning> | <How this differs from another use, if relevant> | <Decision or source link and date> | <Current or needs review; date> |', '| WI | Work tracking | A work item | Not a Jira issue | Mike, 2026-09-26 | Current, 2026-09-26 |'));
  assert.match((await d.glossaryGet()).text, /^\| WI \| Work tracking \|/m);
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
