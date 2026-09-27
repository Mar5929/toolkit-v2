// toolkit sync and toolkit config set (TEMPLATE-LANGUAGE "Sync" and "Setup
// changes"): hand edits are never overwritten, missing files come back, the
// rules span follows .claude/rules/, and a setup change renders the files
// nobody changed again.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, makeHome, makeRepo, read, sha, snapshot, testEnv, tk } from './helpers.mjs';
import { tomlGet } from '../../lib/project/toml.mjs';
import { hashText } from '../../lib/project/render.mjs';

after(cleanup);

function config(root) {
  return JSON.parse(read(path.join(root, '.toolkit.json')));
}

test('sync after a hand edit: the edited file is left alone and listed; a deleted file comes back', async () => {
  const { root, env } = await initProject();
  fs.appendFileSync(path.join(root, 'README.md'), '\nMy own notes.\n');
  const readme = read(path.join(root, 'README.md'));
  fs.rmSync(path.join(root, '.claude', 'rules', 'session-handoff.md'));
  const dry = await tk(root, ['sync', '--dry-run', '--json'], { env });
  assert.equal(dry.code, 0);
  assert.deepEqual(dry.json.added, ['.claude/rules/session-handoff.md']);
  assert.deepEqual(dry.json.changedByProject.map((c) => c.target), ['README.md']);
  assert.ok(!fs.existsSync(path.join(root, '.claude', 'rules', 'session-handoff.md')), 'the dry run wrote nothing');
  const res = await tk(root, ['sync'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Changed by the project, left alone:\n {2}- README\.md/);
  assert.equal(read(path.join(root, 'README.md')), readme);
  assert.ok(fs.existsSync(path.join(root, '.claude', 'rules', 'session-handoff.md')));
  const second = await tk(root, ['sync', '--json'], { env });
  assert.deepEqual(second.json.added, []);
  assert.deepEqual(second.json.updated, []);
});

test('the rules list in AGENTS.md follows .claude/rules/, even when the rest of AGENTS.md was changed by the project', async () => {
  const { root, env } = await initProject();
  const agentsFile = path.join(root, 'AGENTS.md');
  fs.writeFileSync(agentsFile, read(agentsFile).replace('## Project map', '## Project map\n\nMike\'s own line.'));
  fs.writeFileSync(path.join(root, '.claude', 'rules', 'my-rule.md'), '# Use Tabs in Makefiles\n');
  fs.writeFileSync(path.join(root, '.claude', 'rules', 'api-style.md'), '---\npaths:\n  - "src/api/**"\n---\n# API style\n');
  const res = await tk(root, ['sync', '--json'], { env });
  assert.equal(res.code, 0);
  assert.equal(res.json.spanRebuilt, true);
  const agents = read(agentsFile);
  assert.match(agents, /Mike's own line\./);
  assert.match(agents, /- `\.claude\/rules\/my-rule\.md`: Use Tabs in Makefiles/);
  assert.match(agents, /\| `src\/api\/\*\*` \| `\.claude\/rules\/api-style\.md` \|/);
  assert.deepEqual(res.json.changedByProject.map((c) => c.target), ['AGENTS.md']);
  const again = await tk(root, ['sync', '--json'], { env });
  assert.equal(again.json.spanRebuilt, false);
});

test('merge targets changed by the project list what the toolkit would add', async () => {
  const { root, env } = await initProject();
  const gi = path.join(root, '.gitignore');
  fs.writeFileSync(gi, read(gi).replace('/.toolkit-cache/\n', '').concat('dist/\n'));
  const settings = path.join(root, '.claude', 'settings.json');
  const s = JSON.parse(read(settings));
  delete s.autoMemoryEnabled;
  s.enabledPlugins['work@toolkit-v2'] = false;
  fs.writeFileSync(settings, `${JSON.stringify(s, null, 2)}\n`);
  const before = { gi: read(gi), settings: read(settings) };
  const res = await tk(root, ['sync', '--dry-run', '--json'], { env });
  const byTarget = Object.fromEntries(res.json.changedByProject.map((c) => [c.target, c.toolkitWould]));
  assert.deepEqual(byTarget['.gitignore'], ['add the line "/.toolkit-cache/"']);
  assert.ok(byTarget['.claude/settings.json'].includes('add autoMemoryEnabled'));
  assert.ok(byTarget['.claude/settings.json'].includes('set enabledPlugins.work@toolkit-v2 to true'));
  await tk(root, ['sync'], { env });
  assert.equal(read(gi), before.gi, 'never written');
  assert.equal(read(settings), before.settings, 'never written');
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.ok(doctor.json.findings.some((f) => f.id === 'claude-plugins' && f.severity === 'problem'));
});

test('config set tracker.idPrefix: new items take the prefix; the model files name it through .toolkit.json and stay as they are', async () => {
  const { root, env } = await initProject();
  const agentsBefore = read(path.join(root, 'AGENTS.md'));
  const res = await tk(root, ['config', 'set', 'tracker.idPrefix', 'acme'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Set tracker\.idPrefix to ACME \(was WI\)\./);
  assert.match(res.stdout, /toolkit sync ran/);
  assert.equal(read(path.join(root, 'AGENTS.md')), agentsBefore, 'AGENTS.md says the prefix is tracker.idPrefix in .toolkit.json');
  assert.match(agentsBefore, /the prefix is `tracker\.idPrefix` in `\.toolkit\.json`/);
  assert.equal(config(root).tracker.idPrefix, 'ACME');
  const item = await tk(root, ['work', 'new', '--title', 'First', '--json'], { env });
  assert.equal(item.code, 0, item.stderr || item.stdout);
  assert.match(item.stdout, /ACME-001/);
  const refused = await tk(root, ['config', 'set', 'tracker.idPrefix', 'OTHER'], { env });
  assert.equal(refused.code, 2);
  assert.match(refused.stderr, /already has work items/);
});

test('config set memory.type: files nobody changed follow; a changed AGENTS.md is named with the setting it no longer reflects; old seeds are left over, not deleted', async () => {
  const { root, env } = await initProject();
  const agentsFile = path.join(root, 'AGENTS.md');
  fs.writeFileSync(agentsFile, read(agentsFile).replace('# Acme CRM: agent guide', '# Acme CRM (edited): agent guide'));
  const res = await tk(root, ['config', 'set', 'memory.type', 'hindsight', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.deepEqual(res.json.sync.notReflected, ['AGENTS.md was changed by the project, so it still describes memory.type builtin. Update it by hand.']);
  assert.match(read(agentsFile), /built-in memory in `\.memory\/`/);
  assert.match(read(path.join(root, 'PROJECT.md')), /this project's bank on the local Hindsight server/, 'PROJECT.md, unchanged by the project, follows');
  assert.doesNotMatch(read(path.join(root, 'README.md')), /## Project memory/, 'README.md follows too');
  assert.ok(fs.existsSync(path.join(root, '.memory', 'CURRENT_FOCUS.md')), 'nothing is deleted');
  const dry = await tk(root, ['sync', '--dry-run', '--json'], { env });
  assert.ok(dry.json.leftovers.includes('.memory/CURRENT_FOCUS.md'));
});

test('config set salesforce.enabled true adds the Salesforce kit; hosts change adds the other host\'s files', async () => {
  const { root, env } = await initProject({ hosts: 'claude-code' });
  assert.ok(!fs.existsSync(path.join(root, '.codex')));
  let res = await tk(root, ['config', 'set', 'hosts', 'claude-code,codex'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.equal(tomlGet(read(path.join(root, '.codex', 'config.toml')), ['plugins', 'toolkit@toolkit-v2', 'enabled']), true);
  res = await tk(root, ['config', 'set', 'salesforce.enabled', 'true'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.ok(fs.existsSync(path.join(root, '.claude', 'hooks', 'guard-protected-orgs.cjs')));
  assert.ok(fs.existsSync(path.join(root, '.agents', 'skills', 'sf-deploy-check', 'SKILL.md')));
  assert.equal(JSON.parse(read(path.join(root, '.claude', 'settings.json'))).enabledPlugins['sf-architect-solutioning@toolkit-v2'], true);
  assert.match(read(path.join(root, 'AGENTS.md')), /Salesforce org aliases are in `\.toolkit\.json`/);
  assert.match(read(path.join(root, 'AGENTS.md')), /`\.claude\/rules\/salesforce-org-safety\.md`: Salesforce Org Safety/, 'the rules list follows the new rule files');
  const settings = JSON.parse(read(path.join(root, '.claude', 'settings.json')));
  assert.equal(settings.hooks.PreToolUse[0].hooks.length, 2, 'the model\'s guard hooks are merged in');
  assert.ok(settings.permissions.deny.includes('Bash(sf org delete *)'));
  assert.ok(fs.existsSync(path.join(root, '.codex', 'hooks.json')));
  assert.match(read(path.join(root, '.gitignore')), /^\.sfdx\/$/m);
});

test('config get and set: values, protected keys, and bad values', async () => {
  const { root, env } = await initProject();
  let res = await tk(root, ['config', 'get', 'memory.approval'], { env });
  assert.equal(res.stdout.trim(), 'onboarding');
  res = await tk(root, ['config', 'set', 'memory.approval', 'trusted'], { env });
  assert.equal(res.code, 0);
  assert.doesNotMatch(res.stdout, /toolkit sync ran/, 'not a setup key');
  assert.equal(config(root).memory.approval, 'trusted');
  res = await tk(root, ['config', 'get', 'project', '--json'], { env });
  assert.deepEqual(res.json.value, { name: 'Acme CRM', key: 'acme-crm', owner: 'Mike', created: '2026-09-26' });
  res = await tk(root, ['config', 'set', 'salesforce.orgs.sandbox', 'acme-uat'], { env });
  assert.equal(res.code, 0);
  assert.equal(config(root).salesforce.orgs.sandbox, 'acme-uat');
  res = await tk(root, ['config', 'get', 'nothing.here'], { env });
  assert.equal(res.code, 1);
  for (const [key, value] of [['installed.x', 'y'], ['toolkit', 'x'], ['memory.type', 'cloud'], ['tracker.type', 'trello'], ['salesforce.enabled', 'maybe'], ['hosts', 'cursor'], ['colour', 'red'], ['project.key', 'Bad Key']]) {
    const before = read(path.join(root, '.toolkit.json'));
    res = await tk(root, ['config', 'set', key, value], { env });
    assert.equal(res.code, 2, `${key}=${value}`);
    assert.equal(read(path.join(root, '.toolkit.json')), before);
  }
  const snap = snapshot(root);
  res = await tk(root, ['config', 'set', 'memory.approval', 'trusted'], { env });
  assert.match(res.stdout, /already trusted; nothing changed/);
  assert.deepEqual(snapshot(root), snap);
});

test('an AGENTS.md without the span markers is kept, and sync writes the Toolkit V2 version as a proposal', async () => {
  const { root, env } = await initProject();
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Our own manual\n');
  const res = await tk(root, ['sync', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.deepEqual(res.json.proposals, ['.toolkit-cache/AGENTS.proposed.md']);
  assert.equal(read(path.join(root, 'AGENTS.md')), '# Our own manual\n');
  const proposal = read(path.join(root, '.toolkit-cache', 'AGENTS.proposed.md'));
  assert.match(proposal, /^# Acme CRM: agent guide$/m);
  assert.match(proposal, /- `\.claude\/rules\/keep-work-item-current\.md`: Keep the Active Work Item Accurate/);
  const brief = await tk(root, ['brief'], { env });
  assert.match(brief.stdout, /Setup warnings[^\n]*\n- AGENTS\.md has no Toolkit V2 sections/);
});

// ------------------------------------------------------------------ adopting an existing AGENTS.md

async function adoptedRepo() {
  const root = makeRepo();
  const env = testEnv(makeHome());
  fs.writeFileSync(path.join(root, 'AGENTS.md'), '# My own agent notes\n\nUse pnpm.\n');
  const res = await tk(root, ['init', '--name', 'My App', '--tracker', 'local', '--memory', 'builtin', '--owner', 'Mike'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.equal(config(root).installed['AGENTS.md'], undefined);
  return { root, env, proposal: read(path.join(root, '.toolkit-cache', 'AGENTS.proposed.md')) };
}

test('adopting: the owner takes the proposal whole, sync records AGENTS.md, and a later config set renders it again', async () => {
  const { root, env, proposal } = await adoptedRepo();
  const agentsFile = path.join(root, 'AGENTS.md');
  fs.writeFileSync(agentsFile, proposal);
  const doctorBefore = await tk(root, ['doctor', '--json'], { env });
  assert.ok(doctorBefore.json.findings.some((f) => f.id === 'scaffold-adopt' && f.fix === 'Run toolkit sync.'));
  const res = await tk(root, ['sync', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.deepEqual(res.json.adopted, ['AGENTS.md']);
  assert.equal(config(root).installed['AGENTS.md'], sha(hashText('AGENTS.md', read(agentsFile))));
  const again = await tk(root, ['sync', '--json'], { env });
  assert.deepEqual(again.json.adopted, []);
  assert.deepEqual(again.json.changedByProject, [], 'AGENTS.md is the toolkit\'s own copy now');
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!doctor.json.findings.some((f) => /^scaffold-/.test(f.id) && /AGENTS\.md/.test(f.message)), JSON.stringify(doctor.json.findings));
  const set = await tk(root, ['config', 'set', 'memory.type', 'hindsight'], { env });
  assert.equal(set.code, 0, set.stderr);
  assert.match(read(agentsFile), /the local Hindsight server on this computer/);
});

test('adopting: a merge that keeps the project\'s own text is recorded, its span is kept current, and no sync replaces the text', async () => {
  const { root, env, proposal } = await adoptedRepo();
  const agentsFile = path.join(root, 'AGENTS.md');
  const merged = proposal.replace(/^# My App: agent guide$/m, '# My App: agent guide\n\nUse pnpm.');
  assert.notEqual(merged, proposal);
  fs.writeFileSync(agentsFile, merged);
  fs.writeFileSync(path.join(root, '.claude', 'rules', 'my-rule.md'), '# Use Tabs in Makefiles\n');
  const res = await tk(root, ['sync'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Has the Toolkit V2 sections, so the toolkit now tracks it:\n {2}- AGENTS\.md: it also has the project's own text/);
  assert.ok(config(root).installed['AGENTS.md']);
  const text = read(agentsFile);
  assert.match(text, /Use pnpm\./);
  assert.match(text, /- `\.claude\/rules\/my-rule\.md`: Use Tabs in Makefiles/);
  const again = await tk(root, ['sync', '--json'], { env });
  assert.deepEqual(again.json.changedByProject.map((c) => c.target), ['AGENTS.md']);
  assert.ok(!again.json.changedByProject[0].toolkitWould.some((w) => /before the toolkit/.test(w)));
  const set = await tk(root, ['config', 'set', 'memory.type', 'hindsight', '--json'], { env });
  assert.equal(set.code, 0, set.stderr);
  assert.deepEqual(set.json.sync.notReflected, ['AGENTS.md was changed by the project, so it still describes memory.type builtin. Update it by hand.']);
  assert.match(read(agentsFile), /Use pnpm\./, 'never replaced by the template');
});

// ------------------------------------------------------------------ the setup date and the project name

test('the setup date is recorded once: a later day finds nothing out of date and sync writes nothing', async () => {
  const { root, env } = await initProject();
  assert.equal(config(root).project.created, '2026-09-26');
  const later = { ...env, TOOLKIT_TODAY: '2026-10-30' };
  const dry = await tk(root, ['sync', '--dry-run', '--json'], { env: later });
  assert.deepEqual(dry.json.updated, []);
  const doctor = await tk(root, ['doctor', '--json'], { env: later });
  assert.ok(!doctor.json.findings.some((f) => f.id === 'scaffold-outdated'), JSON.stringify(doctor.json.findings.filter((f) => f.id === 'scaffold-outdated')));
  const snap = snapshot(root);
  const sync = await tk(root, ['sync'], { env: later });
  assert.equal(sync.code, 0, sync.stderr);
  assert.deepEqual(snapshot(root), snap, 'sync on a later day writes nothing');
  const refused = await tk(root, ['config', 'set', 'project.created', '2026-01-01'], { env: later });
  assert.equal(refused.code, 2);
});

test('config set project.name fills the new name into the headings of files nobody changed', async () => {
  const { root, env } = await initProject();
  const readme = path.join(root, 'README.md');
  fs.writeFileSync(readme, `${read(readme)}\nOur own line.\n`);
  const set = await tk(root, ['config', 'set', 'project.name', 'Acme Portal', '--json'], { env });
  assert.equal(set.code, 0, set.stderr);
  assert.match(read(path.join(root, 'AGENTS.md')), /^# Acme Portal: agent guide$/m);
  assert.match(read(path.join(root, 'PROJECT.md')), /^# Acme Portal$/m);
  assert.match(read(path.join(root, 'PROJECT.md')), /replace <Project name> and every angle-bracket prompt/, 'the fill-in guide keeps its words');
  assert.match(read(readme), /^# Acme CRM$/m, 'a file the project changed keeps its text');
  assert.deepEqual(set.json.sync.notReflected, ['README.md was changed by the project, so it still describes project.name Acme CRM. Update it by hand.']);
});

test('a project with no recorded setup date gets one from its next sync, and the sync after that writes nothing', async () => {
  const { root, env } = await initProject();
  const cfgFile = path.join(root, '.toolkit.json');
  const cfg = config(root);
  delete cfg.project.created;
  fs.writeFileSync(cfgFile, `${JSON.stringify(cfg, null, 2)}\n`);
  const later = { ...env, TOOLKIT_TODAY: '2026-10-30' };
  const first = await tk(root, ['sync'], { env: later });
  assert.equal(first.code, 0, first.stderr);
  assert.equal(config(root).project.created, '2026-10-30');
  const snap = snapshot(root);
  const next = await tk(root, ['sync'], { env: { ...env, TOOLKIT_TODAY: '2026-11-15' } });
  assert.equal(next.code, 0, next.stderr);
  assert.deepEqual(snapshot(root), snap);
});

test('config set of the tracker or memory backend names the next step and the records it no longer shows', async () => {
  const { root, env } = await initProject();
  assert.equal((await tk(root, ['work', 'new', '--title', 'Login page'], { env })).code, 0);
  assert.equal((await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploy-day', '--description', 'Deploys on Thursday', '--body', 'Thursday.\n'], { env })).code, 0);
  const mem = await tk(root, ['config', 'set', 'memory.type', 'hindsight', '--json'], { env });
  assert.equal(mem.code, 0, mem.stderr);
  assert.deepEqual(mem.json.next, ['Next: run toolkit hindsight ensure-bank to make this project\'s memory bank (toolkit hindsight health checks the server first). Until then, memory commands cannot reach it.']);
  assert.match(mem.json.warnings[0], /^Warning: \.memory\/ holds 1 memory record\. .*toolkit memory export --to <folder>/);
  const tracker = await tk(root, ['config', 'set', 'tracker.type', 'notion'], { env });
  assert.equal(tracker.code, 0, tracker.stderr);
  assert.match(tracker.stdout, /Warning: \.work-items\/ holds 1 work item\. Work items are now read from Notion/);
  assert.match(tracker.stdout, /Next: run toolkit notion ensure-project/);
  const back = await tk(root, ['config', 'set', 'tracker.type', 'local', '--json'], { env });
  assert.deepEqual(back.json.warnings, []);
  assert.deepEqual(back.json.next, []);
});

test('a deleted memory index comes back from sync with the saved records listed, and a deleted knowledge index comes back as the model\'s', async () => {
  const { root, env } = await initProject();
  const saved = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploy-day', '--description', 'Deploys on Thursday', '--body', 'Thursday.\n', '--approved-by', 'Mike'], { env });
  assert.equal(saved.code, 0, saved.stderr || saved.stdout);
  const index = path.join(root, '.memory', 'MEMORY.md');
  fs.rmSync(index);
  fs.rmSync(path.join(root, 'ai-external-knowledge', 'INDEX.md'));
  const res = await tk(root, ['sync'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(read(index), /deploy.day/i, 'the index lists the record, not only the model\'s empty layout');
  assert.match(read(path.join(root, 'ai-external-knowledge', 'INDEX.md')), /^# Outside documentation index$/m);
  assert.equal(config(root).installed['.memory/MEMORY.md'], undefined);
});
