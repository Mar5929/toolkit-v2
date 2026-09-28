// The hook fixes from the final independent review (dev/final-review.md) and
// the confirmation runs of 2026-09-28:
// - I5: the Stop hook saves an unanswered "Save to memory: <summary>?" as a
//   proposal itself, in both hosts, once per summary (recorded Stop inputs);
// - I7: a Codex note for a toolkit command whose apostrophe is written '\''
//   or whose quote is unmatched;
// - M1: the AI credit guard covers merges, tags, notes, releases, issues, and
//   pull request comments;
// - M10: the Codex SessionStart hook records the hooks it ran from;
// - confirm-a 5: a direct edit of an approved design is told every time.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { proposalQuestions, proposalName, proposalType, proposalArgs } from '../../lib/hooks/proposal.mjs';
import { codexApostropheProblem, unmatchedQuote, checkAiCredit } from '../../lib/hooks/shell.mjs';
import { APOSTROPHE_NOTES, aiCreditReason } from '../../lib/hooks/pre-tool.mjs';
import { readCodexHooksSeen, codexHooksHash } from '../../lib/project/machine.mjs';

after(cleanup);

const HOSTS = ['claude', 'codex'];
let seq = 0;

async function hook(root, env, host, event, input) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(input) });
  return { code: res.code, out: res.stdout.trim() ? JSON.parse(res.stdout) : null, raw: res.stdout };
}

/** One turn: UserPromptSubmit with a prompt, then Stop with the last assistant message. */
async function turn(root, env, host, { session, prompt = 'How does it look?', message, active = false }) {
  seq += 1;
  const TURN = `turn-${seq}`;
  const up = await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', { CWD: root, SESSION: session, TURN, PROMPT: prompt }));
  const stop = await hook(root, env, host, 'stop', fixture(host, 'stop', { CWD: root, SESSION: session, TURN, MESSAGE: message, STOP_ACTIVE: active }));
  return { up, stop };
}

async function proposals(root, env) {
  const res = await tk(root, ['memory', 'list', '--status', 'needs-review', '--json'], { env });
  return (res.json.records || res.json.results || []).filter((r) => r.proposal);
}

// ------------------------------------------------------------------ I5: proposals

test('proposalQuestions finds "Save to memory: <summary>?" with bold or quote marks, and nothing else', () => {
  assert.deepEqual(proposalQuestions('Done.'), []);
  assert.deepEqual(proposalQuestions('Save to memory: Mike runs tally only on his Mac mini with Node 22?'), ['Mike runs tally only on his Mac mini with Node 22']);
  assert.deepEqual(proposalQuestions('All set.\n\n**Save to memory:** "Mike reads replies on his phone"? I have not saved it.'), ['Mike reads replies on his phone']);
  assert.deepEqual(proposalQuestions('Save to memory: “give distinct documentation work its own work item”?'), ['give distinct documentation work its own work item']);
  assert.deepEqual(proposalQuestions('Should I save it to memory?'), [], 'only the exact question form');
  assert.deepEqual(proposalQuestions('Save to memory: yes?'), [], 'a summary needs at least two words that carry meaning');
  assert.equal(proposalName('Mike runs tally only on his Mac mini with Node 22'), 'mike-runs-tally-only-his-mac-mini-node-22');
  assert.equal(proposalType('Mike prefers short replies', 'Mike'), 'user');
  assert.equal(proposalType('The agent should run tests before asking', 'Mike'), 'feedback');
  assert.equal(proposalType('Deploys happen on Tuesdays', 'Mike'), 'project');
  const args = proposalArgs('Deploys happen on Tuesdays', { ownerName: 'Mike', date: '2026-09-28' });
  assert.ok(args.includes('--proposal'));
  assert.ok(!args.includes('--approved-by'), 'a proposal never has an approver');
});

for (const host of HOSTS) {
  test(`${host}: an unanswered "Save to memory: <summary>?" is saved as a proposal by the Stop hook, once, and the next prompt names its key`, async () => {
    const { root, env } = await initProject();
    const session = `prop-${host}`;
    const message = 'WI-001 is at stage 06.\n\nSave to memory: Mike runs tally only on his Mac mini with Node 22?';
    const first = await turn(root, env, host, { session, message });
    assert.equal(first.stop.code, 0);
    assert.equal(first.stop.raw, '', 'saving a proposal never blocks the turn');
    let list = await proposals(root, env);
    assert.equal(list.length, 1);
    const key = list[0].key;
    assert.equal(key, 'user_mike_runs_tally_only_his_mac_mini_node_22');
    const rec = await tk(root, ['memory', 'get', key, '--json'], { env });
    assert.equal(rec.json.status, 'needs-review');
    assert.match(rec.json.authorization, /^Proposed by the agent on \d{4}-\d{2}-\d{2}/);
    assert.match(rec.json.body, /\*\*Remember:\*\* Mike runs tally only on his Mac mini with Node 22\./);
    assert.match(rec.json.body, /\*\*Why:\*\* Not stated by the owner\./);

    // The next prompt (the owner's reply, which does not answer) tells the agent the key, once.
    const next = await turn(root, env, host, { session, prompt: 'Which folder do I run it from?', message: 'Run it from the WI-001 worktree.' });
    const context = next.up.out.hookSpecificOutput.additionalContext;
    assert.match(context, new RegExp(`saved the unanswered "Save to memory: Mike runs tally only on his Mac mini with Node 22\\?" as a memory proposal: ${key}\\.`));
    assert.match(context, new RegExp(`toolkit memory approve ${key} --by <name>`));
    assert.match(context, new RegExp(`toolkit memory reject ${key}`));
    const later = await turn(root, env, host, { session, prompt: 'Thanks.', message: 'You are welcome.' });
    assert.ok(!later.up.out || !/memory proposal/.test(later.up.out.hookSpecificOutput.additionalContext), 'said once');

    // The same question again, in this session or another: never a second record.
    await turn(root, env, host, { session, message });
    await turn(root, env, host, { session: `${session}-b`, message });
    list = await proposals(root, env);
    assert.equal(list.length, 1, 'never twice for the same summary');
    assert.ok((await tk(root, ['work', 'decisions'], { env })).stdout.includes(key), 'work-decide lists it');
  });
}

test('the Stop hook leaves the proposal to the agent when it saved one itself this turn', async () => {
  const { root, env } = await initProject();
  for (const host of HOSTS) {
    seq += 1;
    const session = `self-${host}`;
    const TURN = `turn-${seq}`;
    await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', { CWD: root, SESSION: session, TURN, PROMPT: 'Anything to remember?' }));
    const fact = host === 'claude' ? 'Mike reads replies on his phone' : 'Deploys wait for the Friday release window';
    const name = `self-saved-${host}`;
    const cmd = `toolkit memory save --type user --name ${name} --description '${fact}' --body '${fact}.' --proposal`;
    const saved = await tk(root, ['memory', 'save', '--type', 'user', '--name', name, '--description', fact, '--body', `${fact}.`, '--proposal'], { env });
    assert.equal(saved.code, 0, saved.stderr);
    await hook(root, env, host, 'post-tool', fixture(host, 'post-tool.bash', { CWD: root, SESSION: session, TURN, COMMAND: cmd, STDOUT: saved.stdout }));
    const stop = await hook(root, env, host, 'stop', fixture(host, 'stop', { CWD: root, SESSION: session, TURN, MESSAGE: `Save to memory: A different wording about phone replies for ${host}?` }));
    assert.equal(stop.raw, '');
  }
  const list = await proposals(root, env);
  assert.deepEqual(list.map((r) => r.key).sort(), ['user_self_saved_claude', 'user_self_saved_codex']);
});

test('a keep phrase answered only with a question still blocks once: the owner\'s words are the approval, not a proposal', async () => {
  const { root, env } = await initProject();
  const r = await turn(root, env, 'claude', { session: 'keep-q', prompt: 'Remember that deploys happen on Tuesdays.', message: 'Save to memory: deploys happen on Tuesdays?' });
  assert.match(r.stop.out.hookSpecificOutput.additionalContext, /nothing was recorded/);
  assert.match(r.stop.out.hookSpecificOutput.additionalContext, /was saved as the proposal project_deploys_happen_tuesdays; the owner's own words approve it: toolkit memory approve project_deploys_happen_tuesdays --by <owner>\./);
  assert.equal((await proposals(root, env)).length, 1, 'the question is kept as a proposal meanwhile');
  const next = await turn(root, env, 'claude', { session: 'keep-q', prompt: 'Thanks.', message: 'Done.' });
  assert.ok(!next.up.out || !/memory proposal/.test(next.up.out.hookSpecificOutput.additionalContext), 'the block already named it');
});

test('a proposal the duplicate check refuses is not saved, and the next prompt names the similar record', async () => {
  const { root, env } = await initProject();
  const saved = await tk(root, ['memory', 'save', '--type', 'user', '--name', 'cli-flags-readme', '--description', 'Document every command-line flag in the README', '--body', '# Flags\n\n**Remember:** Mike prefers every command-line flag to be documented in the README.\n', '--approved-by', 'Mike'], { env });
  assert.equal(saved.code, 0, saved.stderr);
  const r = await turn(root, env, 'codex', { session: 'dup', message: 'Save to memory: explain each command-line flag in the README file?' });
  assert.equal(r.stop.raw, '');
  assert.equal((await proposals(root, env)).length, 0);
  const next = await turn(root, env, 'codex', { session: 'dup', prompt: 'Later.', message: 'OK.' });
  assert.match(next.up.out.hookSpecificOutput.additionalContext, /was not saved as a proposal: memory already has user_cli_flags_readme about the same subject\. Check whether it is the same fact/);
  assert.doesNotMatch(next.up.out.hookSpecificOutput.additionalContext, /--expect|update that record/);
});

// ------------------------------------------------------------------ I7: apostrophes in Codex

test('Codex: a toolkit command with the apostrophe escape, or an unmatched quote, gets a note; Claude Code gets none', async () => {
  assert.equal(codexApostropheProblem("toolkit memory find 'Mike'\\''s README preference'"), 'escaped');
  assert.equal(codexApostropheProblem("toolkit work history WI-001 --note 'Owner'''s words: Approved.'"), 'unmatched');
  assert.equal(codexApostropheProblem("toolkit work history WI-001 --note 'Owner’s words: Approved.'"), null);
  assert.equal(codexApostropheProblem("git commit -m 'it'\\''s done'"), null, 'only toolkit commands');
  assert.equal(unmatchedQuote("echo 'a' \"b\""), false);
  assert.equal(unmatchedQuote("echo 'a"), true);

  const { root, env } = await initProject();
  const escaped = "toolkit memory find 'Mike'\\''s README preference'";
  const codex = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.bash', { CWD: root, COMMAND: escaped }));
  assert.equal(codex.out.hookSpecificOutput.additionalContext, APOSTROPHE_NOTES.escaped);
  assert.equal(codex.out.hookSpecificOutput.permissionDecision, undefined, 'a note, never a refusal');
  assert.match(APOSTROPHE_NOTES.escaped, /Write the apostrophe as ’ \(U\+2019\)/);
  const unmatched = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.bash', { CWD: root, COMMAND: "toolkit work history WI-001 --note 'Owner'''s words: Approved.'" }));
  assert.equal(unmatched.out.hookSpecificOutput.additionalContext, APOSTROPHE_NOTES.unmatched);
  const claude = await hook(root, env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.bash', { CWD: root, COMMAND: escaped }));
  assert.equal(claude.raw, '', 'the escape works in Claude Code');
  const typographic = await hook(root, env, 'codex', 'pre-tool', fixture('codex', 'pre-tool.bash', { CWD: root, COMMAND: "toolkit memory find 'Mike’s README preference'" }));
  assert.equal(typographic.raw, '');
});

// ------------------------------------------------------------------ M1: AI credit

test('the AI credit guard covers merges, tags, notes, releases, issues, and pull request comments', async () => {
  const credit = 'Co-Authored-By: Claude <noreply@anthropic.com>';
  const cases = [
    [`git merge --no-ff claude/wi-001-x -m 'Merge WI-001' -m '${credit}'`, 'commit'],
    ["git tag -a v1.0 -m 'v1.0\n\nGenerated with Claude Code'", 'tag'],
    [`git notes add -m '${credit}'`, 'note'],
    ["gh release create v1.0 --notes 'Release 1.0\n\nGenerated with Claude Code'", 'release'],
    ["gh issue create --title 'Bug' --body 'Steps.\n\nGenerated with Claude Code'", 'issue'],
    ["gh issue comment 12 --body 'Fixed.\n\nGenerated with Claude Code'", 'issue'],
    ["gh pr comment 7 --body 'Looks good.\n\nGenerated with Claude Code'", 'pull request'],
  ];
  for (const [cmd, what] of cases) {
    const hit = checkAiCredit(cmd);
    assert.ok(hit, cmd);
    assert.equal(hit.what, what, cmd);
  }
  assert.equal(checkAiCredit("git merge --ff-only claude/wi-001-x"), null);
  assert.equal(checkAiCredit("gh issue create --title 'Bug' --body 'Co-Authored-By: Sam Lee <sam@example.com>'"), null, 'a person is not AI credit');
  assert.match(aiCreditReason({ what: 'tag', line: 'Generated with Claude Code' }), /This tag message gives an AI credit.*No tag was made\./);

  const { root, env } = await initProject();
  for (const host of HOSTS) {
    const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', { CWD: root, COMMAND: cases[1][0] }));
    assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny', host);
  }
});

// ------------------------------------------------------------------ M10: the hooks Codex ran

test('the Codex SessionStart hook records the hooks file it ran from; Claude Code does not', async () => {
  const { root, env } = await initProject();
  await hook(root, env, 'claude', 'session-start', fixture('claude', 'session-start.startup', { CWD: root, SESSION: 'm10-a' }));
  assert.equal(readCodexHooksSeen(env), null);
  await hook(root, env, 'codex', 'session-start', fixture('codex', 'session-start.startup', { CWD: root, SESSION: 'm10-b' }));
  const seen = readCodexHooksSeen(env);
  assert.ok(seen);
  assert.equal(seen.hash, codexHooksHash(path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..')));
});

test('doctor warns when the hooks Codex would run now differ from the ones it last ran', async () => {
  const { root, env, home } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  const cfg = path.join(home, '.codex', 'config.toml');
  fs.appendFileSync(cfg, '\n[hooks.state."toolkit@toolkit-v2:hooks/codex-hooks.json:session_start:0:0"]\ntrusted_hash = "sha256:0000"\n');
  const copy = path.join(home, '.codex', 'plugins', 'cache', 'toolkit-v2', 'toolkit', '0.2.9', 'hooks');
  fs.mkdirSync(copy, { recursive: true });
  fs.writeFileSync(path.join(copy, 'codex-hooks.json'), '{"description":"a newer hooks file","hooks":{}}\n');
  fs.mkdirSync(env.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'codex-hooks-seen.json'), JSON.stringify({ hash: 'old', version: '0.2.4' }));
  const res = await tk(root, ['doctor', '--json', '--host', 'codex'], { env });
  const f = res.json.findings.find((x) => x.id === 'codex-hook-changed');
  assert.ok(f, JSON.stringify(res.json.findings.map((x) => x.id)));
  assert.match(f.message, /Codex last ran the hooks of toolkit 0\.2\.4; its copy is now 0\.2\.9/);
  assert.match(f.fix, /\/hooks/);
});

// ------------------------------------------------------------------ confirm-a 5: approved designs

test('a direct edit of an approved design is told every time, outside the once-per-session reminder', async () => {
  const { root, env } = await initProject();
  await tk(root, ['work', 'new', '--title', 'Search', '--type', 'task'], { env });
  await tk(root, ['work', 'design', 'WI-001', '--create'], { env });
  const design = (await tk(root, ['work', 'design', 'WI-001', '--json'], { env })).json.path;
  fs.writeFileSync(design, read(design).replace(/^<Before an option is chosen[^\n]*>$/m, 'Option A: one search box.'));
  assert.equal((await tk(root, ['work', 'approve', 'WI-001', '--design', '--by', 'Mike'], { env })).code, 0);
  for (const n of [1, 2]) {
    fs.writeFileSync(design, read(design).replace('Option A: one search box.', `Option A: one search box, round ${n}.`).replace(/, round \d\./, `, round ${n}.`));
    const r = await hook(root, env, 'claude', 'post-tool', fixture('claude', 'post-tool.edit', { CWD: root, SESSION: 'des-1', FILE: design, OLD: 'a', NEW: 'b' }));
    assert.match(r.out.hookSpecificOutput.additionalContext, /The approved design of WI-001 was edited directly\. The approval covered the design as it was: tell the owner what changed/, `edit ${n}`);
  }
});

// ------------------------------------------------------------------ I8: the backup at session start

test('SessionStart makes the automatic backup when a backup folder is set and a day has passed, once', async () => {
  const { root, env, home } = await initProject({ extraArgs: ['--backup-dir', '~/Backups/toolkit'] });
  for (const host of HOSTS) {
    const r = await hook(root, env, host, 'session-start', fixture(host, 'session-start.startup', { CWD: root, SESSION: `bk-${host}` }));
    const text = r.out.hookSpecificOutput.additionalContext;
    if (host === 'claude') {
      assert.match(text, /Backed up \.work-items\/ and \.memory\/ to .*acme-crm-\d{4}-\d{2}-\d{2}\. \(automatic: the last backup was more than a day old\)/);
      assert.doesNotMatch(text, /never been backed up/);
    } else {
      assert.doesNotMatch(text, /Backed up/, 'not again the same day');
    }
  }
  const folder = path.join(home, 'Backups', 'toolkit');
  assert.equal(fs.readdirSync(folder).length, 1);
  // No folder set: nothing is backed up, and the briefing says to ask for one.
  const other = await initProject();
  const r = await hook(other.root, other.env, 'claude', 'session-start', fixture('claude', 'session-start.startup', { CWD: other.root, SESSION: 'bk-none' }));
  assert.match(r.out.hookSpecificOutput.additionalContext, /No backup folder is set/);
});
