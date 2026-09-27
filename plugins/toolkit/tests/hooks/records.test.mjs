// The work item record guards (lib/hooks/records.mjs) and the Codex briefing
// that a hook delivers. Sample run b (round 1) found an agent writing a whole
// WORK-ITEM.md with `cat > ... <<'EOF'` and a hand-set stage, and every run
// found the hook-delivered Codex briefing saying the hooks do not run.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, makeHome, read, tk } from '../project/helpers.mjs';
import { fixture, updatePatch } from './fixtures.mjs';

after(cleanup);

let seq = 0;
function vars(root, extra = {}) {
  seq += 1;
  return { CWD: root, SESSION: `rec-${seq}`, TURN: `turn-${seq}`, ...extra };
}

async function hook(root, env, host, event, input) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(input) });
  return { code: res.code, out: res.stdout.trim() ? JSON.parse(res.stdout) : null, raw: res.stdout };
}

async function project() {
  const p = await initProject();
  const r = await tk(p.root, ['work', 'new', '--title', 'Login page', '--type', 'build'], { env: p.env });
  assert.equal(r.code, 0, r.stderr);
  const file = (await tk(p.root, ['work', 'show', 'WI-001', '--path'], { env: p.env })).stdout.trim();
  return { ...p, file, rel: path.relative(p.root, file) };
}

test('a shell command that writes a work item record or a generated file is refused in both hosts; reading one is not', async () => {
  const { root, env, rel } = await project();
  const writes = [
    `cat > ${rel} <<'EOF'\n---\nid: WI-001\nstage: 08-build\n---\nEOF`,
    `echo "extra" >> ${rel}`,
    `printf 'x' | tee ${rel}`,
    `sed -i '' 's/Backlog/In Progress/' ${rel}`,
    `cp /tmp/draft.md ${rel}`,
    `python3 - <<'EOF'\nfrom pathlib import Path\nPath('${rel}').write_text('x')\nEOF`,
    `node -e "require('fs').writeFileSync('${rel}', 'x')"`,
    'echo x > .work-items/DASHBOARD.md',
  ];
  for (const host of ['claude', 'codex']) {
    for (const cmd of writes) {
      const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: cmd })));
      assert.ok(r.out, `${host}: ${cmd} is refused`);
      assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny', `${host}: ${cmd}`);
      assert.match(r.out.hookSpecificOutput.permissionDecisionReason, /toolkit work|generated file/);
    }
    const reads = [
      `cat ${rel}`,
      `sed -n 1,20p ${rel}`,
      `grep stage ${rel}`,
      `cp ${rel} /tmp/copy-of-record.md`,
      'toolkit work show WI-001 --section Overview',
      'toolkit work edit WI-001 --section "Agreed goal" --set-file /tmp/x/goal.md',
      "echo 'see WORK-ITEM.md for details' > /tmp/notes.txt",
    ];
    for (const cmd of reads) {
      const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: cmd })));
      assert.equal(r.raw, '', `${host}: ${cmd} is allowed`);
    }
  }
});

test('a file edit that changes a record\'s header is refused; a body edit is allowed (Claude Code and Codex)', async () => {
  const { root, env, file, rel } = await project();
  const text = read(file);
  const stageLine = /^stage: .*$/m.exec(text)[0];
  const deny = async (host, name, extra) => {
    const r = await hook(root, env, host, 'pre-tool', fixture(host, name, vars(root, extra)));
    assert.ok(r.out, `${name} is refused`);
    assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny');
    assert.match(r.out.hookSpecificOutput.permissionDecisionReason, /changes the header of .*\(stage\).*toolkit work set/);
  };
  await deny('claude', 'pre-tool.edit', { FILE: file, OLD: stageLine, NEW: 'stage: 08-build' });
  await deny('claude', 'pre-tool.multiedit', { FILE: file, OLD: stageLine, NEW: 'stage: 08-build' });
  await deny('claude', 'pre-tool.write', { FILE: file, CONTENT: text.replace(stageLine, 'stage: 08-build') });
  await deny('codex', 'pre-tool.apply-patch', { PATCH: updatePatch(rel, stageLine, 'stage: 08-build') });

  const goal = /\*\*Goal:\*\* .*$/m.exec(text)[0];
  const ok = [
    ['claude', 'pre-tool.edit', { FILE: file, OLD: goal, NEW: '**Goal:** Mike can sign in with email.' }],
    ['claude', 'pre-tool.write', { FILE: file, CONTENT: text.replace(goal, '**Goal:** Mike can sign in with email.') }],
    ['codex', 'pre-tool.apply-patch', { PATCH: updatePatch(rel, goal, '**Goal:** Mike can sign in with email.') }],
  ];
  for (const [host, name, extra] of ok) {
    const r = await hook(root, env, host, 'pre-tool', fixture(host, name, vars(root, extra)));
    assert.equal(r.raw, '', `${host} ${name}: a body edit is allowed`);
  }
});

test('PostToolUse checks a record a shell command named, after the command ran', async () => {
  const { root, env, file, rel } = await project();
  fs.writeFileSync(file, read(file).replace(/^status: .*$/m, 'status: Blocked'));
  for (const host of ['claude', 'codex']) {
    const r = await hook(root, env, host, 'post-tool', fixture(host, 'post-tool.bash', vars(root, { COMMAND: `some-editor --in-place ${rel}` })));
    assert.ok(r.out, host);
    assert.match(r.out.hookSpecificOutput.additionalContext, /WI-001 \(\.work-items\/[^)]+\) has \d+ problems? after this command/);
  }
  // Reading a record that has problems says nothing: only a command that may have written it is checked.
  const reading = await hook(root, env, 'claude', 'post-tool', fixture('claude', 'post-tool.bash', vars(root, { COMMAND: `cat ${rel} && grep stage ${rel}` })));
  assert.equal(reading.raw, '');
  fs.writeFileSync(file, read(file).replace(/^status: .*$/m, 'status: In Progress').replace(/^stage: .*$/m, 'stage: 08-build'));
  const gate = await hook(root, env, 'claude', 'post-tool', fixture('claude', 'post-tool.bash', vars(root, { COMMAND: `some-editor ${rel}` })));
  assert.equal(gate.out.decision, 'block');
  assert.match(gate.out.reason, /skips an approval gate for WI-001/);
});

test('the briefing a Codex hook delivers leaves out the trust findings the hook itself disproves; toolkit brief and doctor keep them', async () => {
  const { root, env } = await initProject();
  const hookRun = await hook(root, env, 'codex', 'session-start', fixture('codex', 'session-start.startup', vars(root)));
  const text = hookRun.out.hookSpecificOutput.additionalContext;
  assert.doesNotMatch(text, /hooks are not trusted in Codex/);
  assert.doesNotMatch(text, /Codex does not trust this folder/, 'the toolkit plugin is off machine-wide, so the project config turned it on: the folder is trusted');
  const brief = await tk(root, ['brief', '--host', 'codex'], { env });
  assert.match(brief.stdout, /hooks are not trusted in Codex/);
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.ok(doctor.json.findings.some((f) => f.id === 'codex-hook-trust'));

  // With the toolkit plugin on for every folder, the hook runs in an untrusted folder too: that finding stays.
  const home = makeHome();
  fs.appendFileSync(path.join(home, '.codex', 'config.toml'), '\n[plugins."toolkit@toolkit-v2"]\nenabled = true\n');
  const other = await initProject({ home });
  const run2 = await hook(other.root, other.env, 'codex', 'session-start', fixture('codex', 'session-start.startup', vars(other.root)));
  const text2 = run2.out.hookSpecificOutput.additionalContext;
  assert.match(text2, /Codex does not trust this folder/);
  assert.doesNotMatch(text2, /hooks are not trusted in Codex/);
});
