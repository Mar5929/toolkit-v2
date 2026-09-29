// Hook fixes from the round 3 sample runs and the Claude Code run claude-a:
// - PreToolUse refuses a git commit or a gh pr create/edit whose message gives
//   an AI credit (both hosts), and a toolkit command whose double-quoted text
//   holds a backtick (the shell would run it);
// - PostToolUse names toolkit work design for a DESIGN.md edited directly;
// - the Stop hook counts approve, reject, rename, and focus --text as memory writes.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { aiCreditLine, checkAiCredit, backtickInDoubleQuotes, backtickInUnquotedHeredoc, commandSources, recordKind, substitutionInDoubleQuotes, toolkitCommands } from '../../lib/hooks/shell.mjs';
import { directEditNote } from '../../lib/hooks/post-tool.mjs';
import { TRAILER_MODEL, TRAILER_LOWER, CODEX_TRAILER, COPILOT_TRAILER, GENERATED_LINK, GENERATED_CODEX, GENERATED_AI, TRAILER_IN_SENTENCE } from '../credit-lines.mjs';

after(cleanup);

let seq = 0;
function vars(root, extra = {}) {
  seq += 1;
  return { CWD: root, SESSION: `r3-sess-${seq}`, TURN: `r3-turn-${seq}`, ...extra };
}

async function hook(root, env, host, event, input) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(input) });
  return { code: res.code, raw: res.stdout, out: res.stdout.trim() ? JSON.parse(res.stdout) : null };
}

const CLAUDE_TRAILER = TRAILER_MODEL;
const HEREDOC_COMMIT = `git commit -m "$(cat <<'EOF'\nAdd the greet command\n\n${CLAUDE_TRAILER}\nEOF\n)"`;
const PR_BODY = `gh pr create --title "Greet" --body "## Summary\n- adds greet\n\n${GENERATED_LINK}"`;

test('aiCreditLine finds a Co-Authored-By line naming an AI and a "Generated with" line naming one, and nothing else', () => {
  assert.equal(aiCreditLine(`Fix\n\n${CLAUDE_TRAILER}`), CLAUDE_TRAILER);
  assert.ok(aiCreditLine(CODEX_TRAILER));
  assert.ok(aiCreditLine(COPILOT_TRAILER));
  assert.ok(aiCreditLine(GENERATED_LINK));
  assert.ok(aiCreditLine(GENERATED_AI));
  assert.equal(aiCreditLine('Co-Authored-By: Jane Doe <jane@example.com>'), null, 'a human co-author is allowed');
  assert.equal(aiCreditLine('Generated with make docs'), null);
  assert.equal(aiCreditLine(TRAILER_IN_SENTENCE), null, 'the words inside a sentence are not a credit line');
});

test('checkAiCredit reads -m, --trailer, a heredoc message, -F files, and gh pr text', () => {
  assert.equal(checkAiCredit(HEREDOC_COMMIT).what, 'commit');
  assert.equal(checkAiCredit(`git commit -m "Fix" -m "${CLAUDE_TRAILER}"`).line, CLAUDE_TRAILER);
  assert.ok(checkAiCredit(`git commit -m "Fix" --trailer "${TRAILER_LOWER}"`));
  assert.ok(checkAiCredit('git commit -F msg.txt', { readFile: (f) => (f === 'msg.txt' ? `Fix\n\n${CLAUDE_TRAILER}\n` : null) }));
  assert.equal(checkAiCredit(PR_BODY).what, 'pull request');
  assert.ok(checkAiCredit('gh pr edit 12 --body-file body.md', { readFile: () => `Text\n\n${GENERATED_CODEX}\n` }));
  assert.equal(checkAiCredit('git commit -m "Fix the greet command"'), null);
  assert.equal(checkAiCredit(`echo "${CLAUDE_TRAILER}"`), null, 'only a commit or a pull request is checked');
  assert.equal(checkAiCredit('git log --format=%B -1'), null);
});

test('PreToolUse refuses a commit or a pull request with an AI credit in both hosts, and lets a clean one run', async () => {
  const { root, env } = await initProject();
  for (const host of ['claude', 'codex']) {
    for (const cmd of [HEREDOC_COMMIT, PR_BODY, `git commit -m "Fix" -m "${CLAUDE_TRAILER}"`]) {
      const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: cmd })));
      assert.equal(r.code, 0);
      assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny', `${host}: ${cmd}`);
      assert.match(r.out.hookSpecificOutput.permissionDecisionReason, /gives an AI credit/);
      assert.match(r.out.hookSpecificOutput.permissionDecisionReason, /Remove that line and run the command again/);
    }
    const clean = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: 'git commit -m "Add the greet command\n\nCo-Authored-By: Jane Doe <jane@example.com>"' })));
    assert.equal(clean.raw, '', `${host}: a human co-author is allowed`);
  }
  // A message file is read from the session folder.
  fs.writeFileSync(path.join(root, 'msg.txt'), `Fix\n\n${CLAUDE_TRAILER}\n`);
  const fromFile = await hook(root, env, 'claude', 'pre-tool', fixture('claude', 'pre-tool.bash', vars(root, { COMMAND: 'git commit -F msg.txt' })));
  assert.equal(fromFile.out.hookSpecificOutput.permissionDecision, 'deny');
});

test('backtickInDoubleQuotes: a toolkit command with `...` inside double quotes, not single quotes, escapes, or heredocs', () => {
  assert.equal(backtickInDoubleQuotes('toolkit work edit WI-001 --section "Starting request" --text "where `node bin/greet.js Mike` prints `Hello, Mike!`."'), true);
  assert.equal(backtickInDoubleQuotes("toolkit work edit WI-001 --text 'where `node bin/greet.js` runs'"), false);
  assert.equal(backtickInDoubleQuotes('toolkit work edit WI-001 --text "where \\`node\\` runs"'), false);
  assert.equal(backtickInDoubleQuotes("toolkit memory focus --set-file - <<'EOF'\n# Current focus \"`x`\"\nEOF"), false);
  assert.equal(backtickInDoubleQuotes('git commit -m "a `b`"'), false, 'only toolkit commands');
  assert.equal(backtickInDoubleQuotes('toolkit memory focus --text "$(cat focus.md)"'), false, '$(...) is left alone');
});

test('backtickInUnquotedHeredoc: a toolkit command reading <<EOF text with `...` or $(...); a quoted end word is fine', () => {
  assert.equal(backtickInUnquotedHeredoc('toolkit memory focus --set-file - <<EOF\n# Current focus `x`\nEOF'), true);
  assert.equal(backtickInUnquotedHeredoc('toolkit memory save --body-file - <<-END\n**Remember:** $(date)\nEND'), true);
  assert.equal(backtickInUnquotedHeredoc("toolkit memory focus --set-file - <<'EOF'\n# Current focus `x`\nEOF"), false);
  assert.equal(backtickInUnquotedHeredoc('toolkit memory focus --set-file - <<"EOF"\n`x`\nEOF'), false);
  assert.equal(backtickInUnquotedHeredoc('toolkit memory focus --set-file - <<EOF\n# Current focus\nEOF'), false);
  assert.equal(backtickInUnquotedHeredoc('cat <<EOF\n`x`\nEOF'), false, 'only toolkit commands');
});

test('PreToolUse refuses a toolkit command whose double-quoted text holds a backtick, in both hosts', async () => {
  const { root, env } = await initProject();
  for (const host of ['claude', 'codex']) {
    const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: 'toolkit work edit WI-001 --section "Starting request" --text "run `node bin/greet.js Mike`"' })));
    assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny', host);
    assert.match(r.out.hookSpecificOutput.permissionDecisionReason, /Put the text in single quotes instead/);
    const ok = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: "toolkit work edit WI-001 --section 'Starting request' --text 'run `node bin/greet.js Mike`'" })));
    assert.equal(ok.raw, '', `${host}: single quotes are fine`);
    const heredoc = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: 'toolkit memory focus --set-file - <<EOF\n# Current focus `x`\nEOF' })));
    assert.equal(heredoc.out.hookSpecificOutput.permissionDecision, 'deny', `${host}: unquoted heredoc`);
    assert.match(heredoc.out.hookSpecificOutput.permissionDecisionReason, /Quote the end word \(<<'EOF'\)/);
  }
});

test('the backtick checks look only at the toolkit command\'s own words', () => {
  assert.equal(backtickInDoubleQuotes('git commit -m "fix `foo`" && toolkit work show WI-001'), false, 'the backtick is in the git command');
  assert.equal(backtickInDoubleQuotes('toolkit work show WI-001; echo "`date`"'), false);
  assert.equal(backtickInDoubleQuotes('cd app && toolkit work edit WI-001 --text "run `greet`"'), true);
  assert.equal(backtickInUnquotedHeredoc('cat <<EOF > notes.md\n`x`\nEOF\ntoolkit work show WI-001'), false, 'the here-document is read by cat');
  assert.equal(backtickInUnquotedHeredoc('toolkit memory focus --set-file - <<EOF\n# Current focus `x`\nEOF\necho done'), true);
  assert.deepEqual(commandSources('a && b "x;y" | c <<E\nbody $(z)\nE\nd').map((c) => c.text.trim()), ['a', 'b "x;y"', 'c <<E', 'd']);
});

test('substitutionInDoubleQuotes finds $(...) in a double-quoted toolkit argument only', () => {
  assert.equal(substitutionInDoubleQuotes('toolkit work history WI-001 --note "built at $(git rev-parse HEAD)"'), true);
  assert.equal(substitutionInDoubleQuotes("toolkit work history WI-001 --note 'built at $(git rev-parse HEAD)'"), false, 'single quotes keep the words');
  assert.equal(substitutionInDoubleQuotes('toolkit work history WI-001 --note "built at \\$(x)"'), false, 'escaped');
  assert.equal(substitutionInDoubleQuotes('git commit -m "at $(date)" && toolkit work show WI-001'), false, 'not the toolkit command');
});

test('PreToolUse notes $(...) in a toolkit argument, and does not blame toolkit for another command\'s backtick, in both hosts', async () => {
  const { root, env } = await initProject();
  for (const host of ['claude', 'codex']) {
    const note = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: 'toolkit work history WI-001 --note "built at $(git rev-parse HEAD)"' })));
    assert.equal(note.code, 0);
    assert.equal(note.out.hookSpecificOutput.permissionDecision, undefined, `${host}: a note, not a refusal`);
    assert.match(note.out.hookSpecificOutput.additionalContext, /has \$\(\.\.\.\) inside double quotes/);
    const joined = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: 'git commit -m "fix `foo`" && toolkit work show WI-001' })));
    const decision = joined.out && joined.out.hookSpecificOutput ? joined.out.hookSpecificOutput.permissionDecision : undefined;
    assert.notEqual(decision, 'deny', `${host}: ${joined.raw}`);
  }
});

test('checkAiCredit also reads gh api calls on a pull request path', () => {
  const credit = GENERATED_LINK;
  assert.equal(checkAiCredit(`gh api repos/o/r/pulls -f title=Greet -f body="Adds greet\n\n${credit}"`).line, credit);
  assert.equal(checkAiCredit('gh api -X PATCH repos/o/r/pulls/12 -F body=@b.md', { readFile: (f) => (f === 'b.md' ? `Text\n\n${GENERATED_CODEX}\n` : null) }).what, 'pull request');
  assert.ok(checkAiCredit('gh api repos/o/r/pulls --input pr.json', { readFile: () => JSON.stringify({ title: 'Greet', body: `Adds greet\n\n${CLAUDE_TRAILER}` }) }));
  assert.equal(checkAiCredit('gh api repos/o/r/pulls -f title=Greet -f body="Adds greet"'), null);
  assert.equal(checkAiCredit('gh api repos/o/r/issues/3/comments -f body="Looks good"'), null);
});

test('PreToolUse refuses a gh api pull request body with an AI credit, in both hosts', async () => {
  const { root, env } = await initProject();
  for (const host of ['claude', 'codex']) {
    const r = await hook(root, env, host, 'pre-tool', fixture(host, 'pre-tool.bash', vars(root, { COMMAND: `gh api repos/o/r/pulls -f title=Greet -f body="Adds greet\n\n${GENERATED_LINK}"` })));
    assert.equal(r.out.hookSpecificOutput.permissionDecision, 'deny', host);
    assert.match(r.out.hookSpecificOutput.permissionDecisionReason, /pull request text gives an AI credit/);
  }
});

test('the memory writes the Stop hook counts include approve, reject, rename, and focus --text', () => {
  const kinds = (line) => toolkitCommands(line).map(recordKind);
  assert.deepEqual(kinds('toolkit memory approve project_x --by Mike'), ['memory']);
  assert.deepEqual(kinds('toolkit memory reject project_x'), ['memory']);
  assert.deepEqual(kinds('toolkit memory rename project_x --to project_y'), ['memory']);
  assert.deepEqual(kinds("toolkit memory focus --text '# Current focus'"), ['memory']);
  assert.deepEqual(kinds('toolkit memory glossary --text=x'), ['memory']);
  assert.deepEqual(kinds('toolkit memory focus'), [null], 'reading the focus records nothing');
});

test('PostToolUse names toolkit work design for a design edited directly, and toolkit work edit for a record', () => {
  assert.match(directEditNote([{ who: 'WI-001', design: true }]), /^The design of WI-001 was edited directly and passes validation\. toolkit work design <id> --set-file <file>/);
  assert.match(directEditNote([{ who: 'WI-001', design: false }]), /^WI-001 was edited directly and passes validation\. toolkit work edit <id> --section/);
  const both = directEditNote([{ who: 'WI-001', design: false }, { who: 'WI-002', design: true }]).split('\n');
  assert.equal(both.length, 2);
});
