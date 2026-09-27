// Every hook event, for both hosts, fed the recorded inputs in fixtures/.
// ARCHITECTURE section 6 is the specification.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, git, initProject, makeHome, makeRepo, read, tempDir, testEnv, tk } from '../project/helpers.mjs';
import { fixture, updatePatch } from './fixtures.mjs';
import { hasKeepPhrase } from '../../lib/hooks/phrases.mjs';

after(cleanup);

const HOSTS = ['claude', 'codex'];
let seq = 0;

/** Run one hook event in this process. Returns { code, out (parsed JSON or null), raw }. */
async function hook(root, env, host, event, input) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(input) });
  const raw = res.stdout;
  let out = null;
  if (raw.trim()) out = JSON.parse(raw);
  return { code: res.code, out, raw, stderr: res.stderr };
}

function vars(root, extra = {}) {
  seq += 1;
  return { CWD: root, SESSION: `sess-${seq}`, TURN: `turn-${seq}`, ...extra };
}

function assertCodexSafe(out, event) {
  if (!out) return;
  if (event === 'pre-tool') {
    for (const k of ['continue', 'stopReason', 'suppressOutput']) assert.equal(out[k], undefined, `Codex PreToolUse never returns ${k}`);
    if (out.hookSpecificOutput && out.hookSpecificOutput.permissionDecision) assert.equal(out.hookSpecificOutput.permissionDecision, 'deny');
  }
}

async function setup(opts = {}) {
  const p = await initProject(opts);
  return p;
}

// ------------------------------------------------------------------ outside a V2 project

test('outside a Toolkit V2 project every event prints nothing and exits 0, in both hosts', async () => {
  const plain = makeRepo();
  const foreign = makeRepo();
  fs.writeFileSync(path.join(foreign, '.toolkit.json'), '{"toolkit":"something-else"}\n');
  const env = testEnv(makeHome());
  for (const root of [plain, foreign, tempDir()]) {
    for (const host of HOSTS) {
      const v = vars(root, { PROMPT: 'From now on use tabs.', COMMAND: 'git add -A', FILE: path.join(root, '.work-items', 'DASHBOARD.md'), PATCH: updatePatch('.work-items/DASHBOARD.md', 'a', 'b') });
      const inputs = host === 'claude'
        ? [['session-start', 'session-start.startup'], ['user-prompt', 'user-prompt'], ['pre-tool', 'pre-tool.bash'], ['pre-tool', 'pre-tool.write'], ['post-tool', 'post-tool.write'], ['stop', 'stop']]
        : [['session-start', 'session-start.startup'], ['user-prompt', 'user-prompt'], ['pre-tool', 'pre-tool.bash'], ['pre-tool', 'pre-tool.apply-patch'], ['post-tool', 'post-tool.apply-patch'], ['stop', 'stop']];
      for (const [event, name] of inputs) {
        const r = await hook(root, env, host, event, fixture(host, name, v));
        assert.equal(r.code, 0, `${host} ${event}`);
        assert.equal(r.raw, '', `${host} ${event} prints nothing outside a V2 project`);
      }
    }
  }
});

test('bad or empty input is ignored quietly', async () => {
  const { root, env } = await setup();
  for (const host of HOSTS) {
    for (const event of ['session-start', 'user-prompt', 'pre-tool', 'post-tool', 'stop']) {
      const bad = await tk(root, ['hook', event, '--host', host], { env, stdin: 'not json' });
      assert.equal(bad.code, 0);
      assert.equal(bad.stdout, '');
    }
  }
  const unknown = await tk(root, ['hook', 'pre-compact', '--host', 'claude'], { env, stdin: '{}' });
  assert.equal(unknown.code, 2);
});

// ------------------------------------------------------------------ SessionStart

test('SessionStart returns the briefing as additionalContext, refreshes the plugin-root pointer, and syncs the local tracker', async () => {
  const { root, env } = await setup();
  await tk(root, ['work', 'new', '--title', 'Login page'], { env });
  await tk(root, ['work', 'new', '--title', 'Password reset'], { env });
  const moved = path.join(root, '.work-items', fs.readdirSync(path.join(root, '.work-items')).find((n) => n.startsWith('WI-001')), 'WI-002-password-reset');
  fs.renameSync(path.join(root, '.work-items', 'WI-002-password-reset'), moved);
  let first = true;
  for (const [host, name] of [['claude', 'session-start.startup'], ['codex', 'session-start.startup'], ['claude', 'session-start.resume'], ['codex', 'session-start.compact']]) {
    const r = await hook(root, env, host, 'session-start', fixture(host, name, vars(root)));
    if (first) {
      assert.match(r.out.hookSpecificOutput.additionalContext, /Changes found in the tracker[^\n]*\n- Moved: WI-002 from [^\n]* Its parent is now WI-001\./, 'the first briefing reports the move');
      first = false;
    }
    assert.equal(r.code, 0);
    assert.equal(r.out.hookSpecificOutput.hookEventName, 'SessionStart');
    const text = r.out.hookSpecificOutput.additionalContext;
    assert.match(text, /^Project briefing: Acme CRM/);
    assert.ok(text.length <= 6000);
    assert.equal(/Always-on rules/.test(text), host === 'codex', `${host}: the rules list is for Codex only`);
    assert.equal(/How to write replies/.test(text), host === 'codex');
    assert.doesNotMatch(text, /^(Read|Run|You must|Please)\b/m, 'written as facts, not orders');
  }
  assert.equal(read(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'plugin-root')).trim().endsWith(path.join('plugins', 'toolkit')), true);
  const dashboard = read(path.join(root, '.work-items', 'DASHBOARD.md'));
  assert.match(dashboard, /WI-002/);
  const list = await tk(root, ['work', 'show', 'WI-002', '--json'], { env });
  assert.equal(list.json.item ? list.json.item.parent : list.json.parent || list.json.meta.parent, 'WI-001', 'the session-start sync gave WI-002 its new parent');
});

test('session state goes to the plugin data folder when the host gives one', async () => {
  const { root, env } = await setup();
  const data = tempDir('tk-data-');
  await hook(root, { ...env, CLAUDE_PLUGIN_DATA: data }, 'claude', 'session-start', fixture('claude', 'session-start.startup', vars(root, { SESSION: 'abc-123' })));
  assert.ok(fs.existsSync(path.join(data, 'sessions', 'abc-123.json')));
  const codexData = tempDir('tk-data-');
  await hook(root, { ...env, PLUGIN_DATA: codexData, CLAUDE_PLUGIN_DATA: data }, 'codex', 'session-start', fixture('codex', 'session-start.startup', vars(root, { SESSION: 'thr-9' })));
  assert.ok(fs.existsSync(path.join(codexData, 'sessions', 'thr-9.json')), 'Codex uses PLUGIN_DATA even though it also sets CLAUDE_PLUGIN_DATA');
  await hook(root, env, 'claude', 'session-start', fixture('claude', 'session-start.startup', vars(root, { SESSION: 'no-data' })));
  assert.ok(fs.existsSync(path.join(root, '.git', 'toolkit-v2', 'sessions', 'no-data.json')));
});

// ------------------------------------------------------------------ UserPromptSubmit and Stop

for (const host of HOSTS) {
  test(`${host}: a keep phrase adds one line; Stop blocks once when nothing was recorded, and never twice`, async () => {
    const { root, env } = await setup();
    const v = vars(root, { PROMPT: 'From now on, answer in two lines.' });
    const up = await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', v));
    assert.equal(up.out.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
    assert.equal(up.out.hookSpecificOutput.additionalContext, 'The owner stated something to keep; memory-save records it, or work-on if it is a task.');
    const stop1 = await hook(root, env, host, 'stop', fixture(host, 'stop', v));
    assert.equal(stop1.code, 0);
    const reason = host === 'codex' ? stop1.out.reason : stop1.out.hookSpecificOutput.additionalContext;
    if (host === 'codex') {
      assert.equal(stop1.out.decision, 'block');
      assert.equal(stop1.out.hookSpecificOutput, undefined);
    } else {
      assert.equal(stop1.out.hookSpecificOutput.hookEventName, 'Stop');
      assert.equal(stop1.out.decision, undefined);
    }
    assert.match(reason, /nothing was recorded/);
    assert.equal(hasKeepPhrase(reason), false, 'the reason never holds a keep phrase');
    const again = await hook(root, env, host, 'stop', fixture(host, 'stop', v));
    assert.equal(again.raw, '', 'at most once per turn');
    const active = await hook(root, env, host, 'stop', fixture(host, 'stop', { ...v, STOP_ACTIVE: true }));
    assert.equal(active.raw, '', 'stop_hook_active stops it');
    if (host === 'codex') {
      // Codex sends the reason back as a prompt: it is not a new request.
      const follow = await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', { ...v, TURN: 'turn-follow', PROMPT: reason }));
      assert.equal(follow.raw, '');
    }
  });

  test(`${host}: a memory save recorded by PostToolUse keeps Stop silent`, async () => {
    const { root, env } = await setup();
    const v = vars(root, { PROMPT: 'Remember that the client wants weekly reports.' });
    await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', v));
    const cmd = 'toolkit memory save --type project --name weekly-reports --description "The client wants weekly reports" --body-file /tmp/b.md';
    const post = await hook(root, env, host, 'post-tool', fixture(host, 'post-tool.bash', { ...v, COMMAND: cmd, STDOUT: 'Saved project_weekly_reports.' }));
    assert.equal(post.raw, '');
    const stop = await hook(root, env, host, 'stop', fixture(host, 'stop', v));
    assert.equal(stop.raw, '');
  });

  test(`${host}: a failed memory save does not count, and a save seen only on disk does`, async () => {
    const { root, env } = await setup();
    const v = vars(root, { PROMPT: 'Note that invoices go out on the 1st.' });
    await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', v));
    const failed = host === 'codex'
      ? fixture(host, 'post-tool.bash', { ...v, COMMAND: 'toolkit memory save --type project --name x', STDOUT: 'Exit code: 2\nOutput:\nError: --description is needed.' })
      : fixture(host, 'post-tool.bash', { ...v, COMMAND: 'toolkit memory save --type project --name x', STDERR: 'Error: --description is needed.' });
    await hook(root, env, host, 'post-tool', failed);
    // The save that worked ran outside the hooks' view (for example in a subshell).
    const saved = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'invoice-day', '--description', 'Invoices go out on the 1st', '--body', '## Remember\n\nThe 1st.\n'], { env });
    assert.equal(saved.code, 0, saved.stderr);
    const stop = await hook(root, env, host, 'stop', fixture(host, 'stop', v));
    assert.equal(stop.raw, '', 'the memory folder changed this turn, so something was recorded');
  });

  test(`${host}: prompts without a keep phrase add nothing and Stop stays silent`, async () => {
    const { root, env } = await setup();
    for (const prompt of ['Build the login page.', 'Do you remember the billing bug?', 'Never mind.', 'It always fails on CI.']) {
      const v = vars(root, { PROMPT: prompt });
      const up = await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', v));
      assert.equal(up.raw, '', prompt);
      const stop = await hook(root, env, host, 'stop', fixture(host, 'stop', v));
      assert.equal(stop.raw, '', prompt);
    }
  });
}

test('UserPromptSubmit reports an item folder the owner moved during the session', async () => {
  const { root, env } = await setup();
  await tk(root, ['work', 'new', '--title', 'Login page'], { env });
  await tk(root, ['work', 'new', '--title', 'Billing'], { env });
  const parent = fs.readdirSync(path.join(root, '.work-items')).find((n) => n.startsWith('WI-001'));
  fs.renameSync(path.join(root, '.work-items', 'WI-002-billing'), path.join(root, '.work-items', parent, 'WI-002-billing'));
  const moved = path.join(root, '.work-items', parent, 'WI-002-billing', 'WORK-ITEM.md');
  const itemBefore = read(moved);
  for (const host of HOSTS) {
    const v = vars(root, { PROMPT: 'carry on' });
    const r = await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', v));
    assert.match(r.out.hookSpecificOutput.additionalContext, /Changes found in the work tracker/, host);
    assert.match(r.out.hookSpecificOutput.additionalContext, /WI-002[^\n]*parent is now WI-001/, host);
    const again = await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', { ...v, TURN: `${v.TURN}-b`, PROMPT: 'and then?' }));
    assert.equal(again.raw, '', `${host}: reported once per session`);
  }
  assert.equal(read(moved), itemBefore, 'the prompt hook only reads; it never rewrites an item file');
  assert.equal((await tk(root, ['work', 'sync'], { env })).code, 0);
  assert.match(read(moved), /^parent: WI-001$/m, 'toolkit work sync brings the record in step');
  const after = await hook(root, env, 'claude', 'user-prompt', fixture('claude', 'user-prompt', vars(root, { PROMPT: 'next' })));
  assert.equal(after.raw, '', 'nothing new after the sync');
});

// ------------------------------------------------------------------ PreToolUse

test('PreToolUse refuses hand edits of generated files in both hosts, and allows other edits', async () => {
  const { root, env } = await setup();
  const generated = ['.work-items/DASHBOARD.md', '.work-items/.toolkit-state.json', '.memory/MEMORY.md', 'ai-external-knowledge/INDEX.md'];
  for (const rel of generated) {
    for (const name of ['pre-tool.write', 'pre-tool.edit', 'pre-tool.multiedit']) {
      const r = await hook(root, env, 'claude', 'pre-tool', fixture('claude', name, vars(root, { FILE: path.join(root, rel), OLD: 'a', NEW: 'b' })));
      assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny', `${name} ${rel}`);
      assert.match(r.out.hookSpecificOutput.permissionDecisionReason, new RegExp(`${rel.replace(/\./g, '\\.')} is a generated file`));
    }
    const c = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.apply-patch', vars(root, { PATCH: updatePatch(rel, 'a', 'b') })));
    assert.equal(c.out.hookSpecificOutput.permissionDecision, 'deny', `codex ${rel}`);
    assertCodexSafe(c.out, 'pre-tool');
  }
  assert.match((await hook(root, env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.write', vars(root, { FILE: path.join(root, '.memory', 'MEMORY.md') })))).out.hookSpecificOutput.permissionDecisionReason, /toolkit memory reindex/);
  assert.match((await hook(root, env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.write', vars(root, { FILE: path.join(root, 'ai-external-knowledge', 'INDEX.md') })))).out.hookSpecificOutput.permissionDecisionReason, /toolkit index knowledge/);
  for (const rel of ['README.md', '.memory/project_x.md', 'docs/INDEX.md']) {
    const r = await hook(root, env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.write', vars(root, { FILE: path.join(root, rel) })));
    assert.equal(r.raw, '', rel);
    const c = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.apply-patch', vars(root, { PATCH: updatePatch(rel, 'a', 'b') })));
    assert.equal(c.raw, '', rel);
  }
  // A body line of a work item record may be edited; a new record made by hand is refused (toolkit work new makes one).
  const rec = '.work-items/WI-001-x/WORK-ITEM.md';
  const body = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.apply-patch', vars(root, { PATCH: updatePatch(rec, 'a', 'b') })));
  assert.equal(body.raw, '', 'a body edit');
  const made = await hook(root, env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.write', vars(root, { FILE: path.join(root, rec), CONTENT: '---\nid: WI-001\n---\n' })));
  assert.equal(made.out.hookSpecificOutput.permissionDecision, 'deny');
  assert.match(made.out.hookSpecificOutput.permissionDecisionReason, /toolkit work new/);
});

test('PreToolUse refuses the git commands the settings deny list names, in both hosts', async () => {
  const { root, env } = await setup();
  for (const host of HOSTS) {
    for (const cmd of ['git add -A', 'git add .', 'git commit -am "x"', 'git commit -m x --no-verify', 'git push --force origin main', 'git clean -fdx']) {
      const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: cmd })));
      assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny', `${host} ${cmd}`);
      assert.equal(r.out.hookSpecificOutput.hookEventName, 'PreToolUse');
      assertCodexSafe(r.out, 'pre-tool');
    }
    for (const cmd of ['git add src/a.js', 'git commit -m "add all"', 'git push origin main', 'git clean -fd', 'ls -la', 'toolkit work list']) {
      const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: cmd })));
      assert.equal(r.raw, '', `${host} ${cmd}`);
    }
  }
});

test('git clean -x is refused only in the main checkout, and only when the project keeps Git-ignored data', async () => {
  const { root, env } = await setup();
  git(root, ['add', '.gitignore']);
  git(root, ['commit', '-q', '-m', 'first']);
  const wt = path.join(path.dirname(root), 'wt-clean');
  git(root, ['worktree', 'add', '-q', wt, '-b', 'wi-001-clean']);
  fs.copyFileSync(path.join(root, '.toolkit.json'), path.join(wt, '.toolkit.json'));
  const inWorktree = await hook(wt, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.bash', vars(wt, { COMMAND: 'git clean -fdx' })));
  assert.equal(inWorktree.raw, '');
  // A project that keeps no Git-ignored data (GitHub tracker, Hindsight memory).
  // It is set up with built-in memory and then switched in .toolkit.json, so the
  // test never creates a memory bank on the real local Hindsight server (sample
  // run d found 17 leftover acme-crm banks from an earlier version of this test).
  const other = await setup({ tracker: 'github', memory: 'builtin' });
  const cfgFile = path.join(other.root, '.toolkit.json');
  const cfg = JSON.parse(read(cfgFile));
  cfg.memory.type = 'hindsight';
  cfg.hindsight = { bank: 'tkv2-test-not-created' };
  fs.writeFileSync(cfgFile, `${JSON.stringify(cfg, null, 2)}\n`);
  const r = await hook(other.root, other.env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.bash', vars(other.root, { COMMAND: 'git clean -fdx' })));
  assert.equal(r.raw, '');
});

// ------------------------------------------------------------------ PostToolUse

async function itemFile(root, env, args = ['--title', 'Login page', '--type', 'build']) {
  const r = await tk(root, ['work', 'new', ...args, '--json'], { env });
  assert.equal(r.code, 0, r.stderr || r.stdout);
  const id = (r.stdout.match(/WI-\d{3}/) || [])[0];
  const file = (await tk(root, ['work', 'show', id, '--path'], { env })).stdout.trim();
  return { id, file };
}

test('PostToolUse validates an edited work item without rewriting it, and blocks only a skipped gate (Claude Code)', async () => {
  const { root, env } = await setup();
  const { id, file } = await itemFile(root, env);
  // An error: a status that is not one of the six.
  fs.writeFileSync(file, read(file).replace(/^status: .*$/m, 'status: Blocked'));
  const before = read(file);
  const v = vars(root, { FILE: file, OLD: 'status: Backlog', NEW: 'status: Blocked' });
  const r = await hook(root, env, 'claude', 'post-tool', fixture('claude', 'post-tool.edit', v));
  assert.equal(r.out.decision, undefined, 'an error is context, not a block');
  assert.match(r.out.hookSpecificOutput.additionalContext, new RegExp(`${id} \\(\\.work-items/[^)]+\\) was saved with \\d+ problem`));
  assert.equal(read(file), before, 'the hook never rewrites the file');
  // A skipped gate: a build item moved to 08 with no requirements approval.
  fs.writeFileSync(file, before.replace(/^status: .*$/m, 'status: In Progress').replace(/^stage: .*$/m, 'stage: 08-build'));
  const g = await hook(root, env, 'claude', 'post-tool', fixture('claude', 'post-tool.write', { ...v, CONTENT: 'x' }));
  assert.equal(g.out.decision, 'block');
  assert.match(g.out.reason, /^The edit to \.work-items\/[^ ]+ was saved, and it skips an approval gate for WI-001/);
  assert.match(g.out.reason, /toolkit work approve WI-001/);
  // Stop: the record still fails, so the turn is kept going once.
  const stop = await hook(root, env, 'claude', 'stop', fixture('claude', 'stop', v));
  assert.match(stop.out.hookSpecificOutput.additionalContext, /WI-001 \(\.work-items\/[^)]+\) was edited this turn and still fails validation/);
});

test('PostToolUse reads the apply_patch file names (Codex) and a clean edit gives no output', async () => {
  const { root, env } = await setup();
  const { file } = await itemFile(root, env, ['--title', 'Login page']);
  const rel = path.relative(root, file);
  fs.writeFileSync(file, read(file).replace(/^priority: .*$/m, 'priority: high'));
  const v = vars(root, { PATCH: updatePatch(rel, 'priority: medium', 'priority: high'), REL: rel });
  // The first clean direct edit in a session gets one line about toolkit work edit; later ones say nothing.
  const first = await hook(root, env, 'codex', 'post-tool', fixture('codex', 'post-tool.apply-patch', v));
  assert.match(first.out.hookSpecificOutput.additionalContext, /toolkit work edit <id> --section/);
  const clean = await hook(root, env, 'codex', 'post-tool', fixture('codex', 'post-tool.apply-patch', v));
  assert.equal(clean.raw, '');
  fs.writeFileSync(file, read(file).replace(/^type: .*$/m, 'type: build').replace(/^stage: .*$/m, 'stage: 09-testing').replace(/^status: .*$/m, 'status: In Progress'));
  const gate = await hook(root, env, 'codex', 'post-tool', fixture('codex', 'post-tool.apply-patch', v));
  assert.equal(gate.out.decision, 'block');
  assert.match(gate.out.reason, /was saved, and it skips an approval gate/);
  assert.equal(gate.out.continue, undefined);
});

test('PostToolUse rebuilds MEMORY.md after a .memory/ record is edited by hand, and that counts as recorded', async () => {
  const { root, env } = await setup();
  const saved = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploy-day', '--description', 'Deploys happen on Fridays', '--body', '## Remember\n\nFridays.\n'], { env });
  assert.equal(saved.code, 0, saved.stderr);
  const v = vars(root, { PROMPT: 'Keep in mind deploys moved to Thursday.' });
  await hook(root, env, 'claude', 'user-prompt', fixture('claude', 'user-prompt', v));
  const recordFile = path.join(root, '.memory', 'project_deploy_day.md');
  fs.writeFileSync(recordFile, read(recordFile).replace('Deploys happen on Fridays', 'Deploys happen on Thursdays'));
  const r = await hook(root, env, 'claude', 'post-tool', fixture('claude', 'post-tool.edit', { ...v, FILE: recordFile, OLD: 'Fridays', NEW: 'Thursdays' }));
  assert.equal(r.raw, '');
  assert.match(read(path.join(root, '.memory', 'MEMORY.md')), /Deploys happen on Thursdays/);
  const stop = await hook(root, env, 'claude', 'stop', fixture('claude', 'stop', v));
  assert.equal(stop.raw, '');
});

test('the GitHub tracker: hooks run and say nothing about work items', async () => {
  const { root, env } = await setup({ tracker: 'github' });
  const s = await hook(root, env, 'codex', 'session-start', fixture('codex', 'session-start.startup', vars(root)));
  assert.match(s.out.hookSpecificOutput.additionalContext, /GitHub Issues/);
  const u = await hook(root, env, 'codex', 'user-prompt', fixture('codex', 'user-prompt', vars(root, { PROMPT: 'go' })));
  assert.equal(u.raw, '');
});

test('paths given through a symbolic link to the project are still guarded and validated', async () => {
  const { root, env } = await setup();
  const { id, file } = await itemFile(root, env);
  const link = path.join(tempDir(), 'link');
  fs.symlinkSync(root, link);
  const viaLink = (p) => path.join(link, path.relative(root, p));
  for (const host of HOSTS) {
    const input = host === 'claude'
      ? fixture('claude', 'pre-tool.write', vars(link, { FILE: path.join(link, '.work-items', 'DASHBOARD.md') }))
      : fixture('codex', 'pre-tool.apply-patch', vars(link, { PATCH: updatePatch('.work-items/DASHBOARD.md', 'a', 'b') }));
    const r = await hook(link, env, host, 'pre-tool', input);
    assert.equal(r.out && r.out.hookSpecificOutput.permissionDecision, 'deny', host);
  }
  fs.writeFileSync(file, read(file).replace(/^status: .*$/m, 'status: Blocked'));
  const post = await hook(link, env, 'claude', 'post-tool', fixture('claude', 'post-tool.edit', vars(link, { FILE: viaLink(file), OLD: 'a', NEW: 'b' })));
  assert.match(post.out.hookSpecificOutput.additionalContext, new RegExp(`${id} \\(\\.work-items/[^)]+\\) was saved with \\d+ problem`));
});
