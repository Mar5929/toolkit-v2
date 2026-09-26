// The pieces the hooks decide with: command-line splitting, the git rules,
// toolkit command recognition, keep phrases, and apply_patch file names.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitCommands, checkGit, toolkitCommands, recordKind } from '../../lib/hooks/shell.mjs';
import { keepPhrase, hasKeepPhrase, KEEP_LINE } from '../../lib/hooks/phrases.mjs';
import { patchFiles } from '../../lib/hooks/paths.mjs';
import { KEEP_REASON } from '../../lib/hooks/stop.mjs';
import { GIT_REASONS } from '../../lib/hooks/shell.mjs';

test('command lines are split into simple commands with quotes removed', () => {
  assert.deepEqual(splitCommands('cd "a b" && git add -A; echo \'x y\' | wc -l'), [['cd', 'a b'], ['git', 'add', '-A'], ['echo', 'x y'], ['wc', '-l']]);
  assert.deepEqual(splitCommands('(git status) || $(git commit -a)'), [['git', 'status'], ['git', 'commit', '-a']]);
  assert.deepEqual(splitCommands('git commit -m "fix: add -A handling"'), [['git', 'commit', '-m', 'fix: add -A handling']]);
  assert.deepEqual(splitCommands('echo a \\\n  b # comment'), [['echo', 'a', 'b']]);
});

test('the git rules deny what the model settings deny, in any argument order', () => {
  const denied = {
    'git add -A': 'git-add-all',
    'git add --all': 'git-add-all',
    'git add .': 'git-add-all',
    'cd src && git add .': 'git-add-all',
    'git -C /tmp/x add -A': 'git-add-all',
    'GIT_TRACE=1 git add -- .': 'git-add-all',
    'git commit -a -m "x"': 'git-commit-all',
    'git commit -am "x"': 'git-commit-all',
    'git commit --all': 'git-commit-all',
    'git commit -m "x" --no-verify': 'git-commit-no-verify',
    'git commit -nm "x"': 'git-commit-no-verify',
    'git push --force': 'git-force-push',
    'git push origin main --force': 'git-force-push',
    'git push -f origin main': 'git-force-push',
    'git push -uf origin main': 'git-force-push',
    'git push --force-with-lease=main:abc origin main': 'git-force-push',
    'git push origin +main': 'git-force-push',
    'git clean -fdx': 'git-clean-ignored',
    'git clean -fX': 'git-clean-ignored',
    'git clean -f -d -x': 'git-clean-ignored',
  };
  for (const [cmd, rule] of Object.entries(denied)) {
    const v = checkGit(cmd);
    assert.ok(v, `${cmd} is denied`);
    assert.equal(v.rule, rule, cmd);
  }
  for (const cmd of [
    'git add src/app.js README.md',
    'git add -p src/app.js',
    'git add ./src',
    'git commit -m "add all the things -a"',
    'git commit -m "x"',
    'git commit --amend --no-edit',
    'git push origin main',
    'git push -u origin feature',
    'git clean -fd',
    'git clean -n -x',
    'git status',
    'echo git add -A',
    'grep -r "git push --force" docs',
  ]) {
    assert.equal(checkGit(cmd), null, `${cmd} is allowed`);
  }
  assert.equal(checkGit('git clean -fdx', { mainCheckout: false }), null, 'git clean -x is allowed in a linked worktree');
  assert.equal(checkGit('git clean -fdx', { guardClean: false }), null, 'and in a project with no Git-ignored data');
  for (const reason of Object.values(GIT_REASONS)) assert.ok(!/\bask\b/i.test(reason.split('.')[0]));
});

test('toolkit commands are recognised, and only writes count as records', () => {
  const cmds = toolkitCommands('toolkit memory save --type feedback --name x && node /p/bin/toolkit work set WI-001 --stage 03-requirements-approved; toolkit memory find billing');
  assert.deepEqual(cmds.map((c) => `${c.group} ${c.sub}`), ['memory save', 'work set', 'memory find']);
  assert.deepEqual(cmds.map(recordKind), ['memory', 'work', null]);
  assert.equal(recordKind(toolkitCommands('toolkit memory focus --set-file /tmp/f.md')[0]), 'memory');
  assert.equal(recordKind(toolkitCommands('toolkit memory focus')[0]), null);
  assert.equal(recordKind(toolkitCommands('toolkit memory import --from x --dry-run')[0]), null);
  assert.equal(recordKind(toolkitCommands('toolkit decision add --decision a --why b --by Mike')[0]), 'decision');
  assert.equal(recordKind(toolkitCommands('toolkit work list')[0]), null);
});

test('keep phrases: explicit phrases fire; questions, negations, and broad words do not', () => {
  for (const p of [
    'Remember that deploys happen on Fridays.',
    'remember this: the client prefers email',
    'From now on, use tabs.',
    "Don't ever push to main.",
    'Do not ever delete the backups.',
    'Note that the staging org is acme-uat.',
    'Going forward, name branches after the item.',
    'Keep in mind that the API is slow.',
  ]) {
    assert.ok(keepPhrase(p), p);
  }
  for (const p of [
    'Do you remember the billing bug?',
    'do you remember that bug from last week?',
    'I don\'t remember this at all.',
    'Never mind, carry on.',
    'It always fails on this test.',
    'That never worked.',
    'Build the login page.',
    '```\nnote that this is pasted log text\n```\nWhat does this error mean?',
    '> from now on the server is down\nWhat does that quote mean?',
  ]) {
    assert.equal(keepPhrase(p), null, p);
  }
  assert.equal(hasKeepPhrase(KEEP_REASON), false, 'the Stop reason has no keep phrase');
  assert.equal(hasKeepPhrase(KEEP_LINE), false, 'the reminder line itself has no keep phrase');
});

test('apply_patch file names are read from the patch headers', () => {
  const patch = '*** Begin Patch\n*** Add File: docs/new.md\n+hello\n*** Update File: .work-items/WI-001-x/WORK-ITEM.md\n@@\n-a\n+b\n*** Move to: .work-items/WI-002-y/WORK-ITEM.md\n*** Delete File: old.txt\n*** End Patch';
  assert.deepEqual(patchFiles(patch), [
    { path: 'docs/new.md', action: 'Add File' },
    { path: '.work-items/WI-001-x/WORK-ITEM.md', action: 'Update File' },
    { path: '.work-items/WI-002-y/WORK-ITEM.md', action: 'Move to' },
    { path: 'old.txt', action: 'Delete File' },
  ]);
});

test('here-document bodies are text, not commands', () => {
  assert.equal(checkGit('git commit -F - <<EOF\nFix the login page\ngit push -f origin main\nEOF'), null);
  assert.equal(checkGit("cat > CONTRIBUTING.md <<'EOF'\nNever run this:\ngit add -A\nEOF\ngit status"), null);
  assert.equal(checkGit('git commit -m "$(cat <<\'EOF\'\nmsg git add -A\nEOF\n)"'), null);
  assert.equal(checkGit('cat <<< "git add -A"'), null, 'a here-string is one word');
  assert.equal(checkGit('cat <<-EOF > notes.txt\n\tgit add -A\n\tEOF\ngit add -A').rule, 'git-add-all', 'the command after the body is still read');
  assert.equal(checkGit('cat <<A <<B\ngit add -A\nA\ngit push -f\nB\ngit add .').rule, 'git-add-all');
  assert.equal(checkGit('cat <<A <<B\ngit add -A\nA\ngit push -f\nB\ngit status'), null);
});

test('git add :/ stages everything; bash -c, sh -c, and eval command strings are read', () => {
  for (const c of ['git add :/', 'git add -- :/', "git add ':(top)'", 'bash -c "git add -A"', 'eval "git add ."', 'sudo bash -c "cd x && git add ."']) {
    assert.equal(checkGit(c).rule, 'git-add-all', c);
  }
  assert.equal(checkGit('bash -lc "git push --force"').rule, 'git-force-push');
  assert.equal(checkGit("sh -c 'git commit -am wip'").rule, 'git-commit-all');
  for (const c of ['git add :/src/a.js', 'bash build.sh -c', 'bash -c "git add src/a.js"']) assert.equal(checkGit(c), null, c);
  assert.deepEqual(toolkitCommands('bash -c "toolkit memory save --type user --name x"').map((t) => `${t.group} ${t.sub}`), ['memory save']);
});
