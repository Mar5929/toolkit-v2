import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cleanPath, generatedPaths, hasRemote, remoteNames, worktreeHolding, KNOWLEDGE_INDEX } from '../skills/publish-docs/scripts/publish-docs.mjs';

const script = resolve(dirname(fileURLToPath(import.meta.url)), '../skills/publish-docs/scripts/publish-docs.mjs');
const base = resolve(mkdtempSync(join(tmpdir(), 'publish-docs-test-')));
const workspaces = [];

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  return result;
}
function git(cwd, ...args) {
  const result = run('git', args, cwd);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
function startSave(source, ...paths) {
  const result = run(process.execPath, [script, 'start', '--branch', 'main', '--', ...paths], source);
  assert.equal(result.status, 0, result.stderr);
  const workspace = result.stdout.trim();
  assert.equal(basename(dirname(workspace)), basename(base));
  workspaces.push({ source, workspace });
  return workspace;
}
/** A repository with no remote at all, the way a new local project starts. */
function localProject(name, files) {
  const source = join(base, name);
  mkdirSync(source);
  git(source, 'init', '-q', '-b', 'main');
  git(source, 'config', 'user.name', 'Fixture Owner');
  git(source, 'config', 'user.email', 'fixture@example.invalid');
  git(source, 'config', 'core.autocrlf', 'false');
  for (const [path, content] of Object.entries(files)) write(join(source, path), content);
  git(source, 'add', '--', ...Object.keys(files));
  git(source, 'commit', '-q', '-m', 'Initial files');
  return source;
}
function project(name, files) {
  const remote = join(base, `${name}.git`);
  git(base, 'init', '--bare', '-q', remote);
  const source = localProject(name, files);
  git(source, 'remote', 'add', 'origin', remote);
  git(source, 'push', '-q', '-u', 'origin', 'main');
  return source;
}

test.after(() => {
  for (const { source, workspace } of workspaces) {
    if (existsSync(workspace)) run('git', ['worktree', 'remove', '--force', workspace], source);
  }
  rmSync(base, { recursive: true, force: true });
});

test('path rules accept V2 document homes and refuse everything else', () => {
  for (const path of [
    'requirements/billing.md',
    'requirements/AREA-TEMPLATE.md',
    'system-guide/billing.md',
    'system-guide/diagrams/flow.png',
    'DECISIONS.md',
    'PROJECT.md',
    'PROJECT-ROADMAP.md',
    'tools/permissions/PERMISSIONS-RUNBOOK.md',
    'README.md',
    'system-guide/README.md',
    'tools/kb/README.md',
    'ai-external-knowledge/claude-code/hooks.md',
    'delivery/deployment/component-tracker.csv',
    'delivery/deployment/_master/package.xml',
    'delivery/data/.gitignore',
    'delivery/data/production-backups/.gitignore',
    'delivery/data/data-loads/WI-012-account-load/LOAD-STEPS.md',
    'delivery/.gitignore',
    'system-guide/diagrams/flow.svg',
    'system-guide/diagrams/screen.JPG',
    'system-guide/client/statement-of-work.pdf',
    'system-guide/notes.txt',
  ]) assert.equal(cleanPath(path), path);

  for (const path of [
    '.memory/MEMORY.md',
    '.memory/project_billing.md',
    '.work-items/WI-001-login/WORK-ITEM.md',
    '.work-items/DASHBOARD.md',
    'AGENTS.md',
    'requirements/AGENTS.md',
    'CLAUDE.md',
    '.claude/rules/humanize-outbound-text.md',
    '.claude/skills/sf-deploy-check/SKILL.md',
    '.claude/settings.json',
    'scripts/build.mjs',
    'system-guide/tool.py',
    // docs/ is not a project document folder in the model.
    'docs/notes.md',
    'docs/system-guide/billing.md',
    // Only the runbook in tools/; the rest of tools/ is code and its notes.
    'tools/permissions/permsets.py',
    'tools/permissions/NOTES.md',
    'tools/kb/notes.md',
    'tools/PERMISSIONS-RUNBOOK.md',
    'delivery/deployment/deploy.sh',
    'force-app/main/default/classes/Invoice.cls',
    'src/change.js',
    'SOUL.md',
    'knowledge/memory/current.md',
    'prds/billing.md',
    // Data under delivery/data/ is refused whatever .gitignore says.
    'delivery/data/production-backups/prod-backup-09262026-acct/Account.json',
    'delivery/data/production-backups/prod-backup-09262026-acct/Account.xml',
    'delivery/data/data-loads/load.csv',
    'delivery/data/data-loads/notes.txt',
    'Delivery/Data/data-loads/load.csv',
    // Only document file types.
    'system-guide/config.json',
    'system-guide/export.xlsx',
    'delivery/deployment/settings.yaml',
    'requirements/billing',
    // Hidden files and folders.
    'system-guide/.env',
    '.env',
    'system-guide/.drafts/plan.md',
    '.github/README.md',
    'system-guide/.gitignore',
    // Instruction files in any letter case.
    'system-guide/agents.md',
    'requirements/Claude.md',
    'system-guide/tool/skill.MD',
  ]) assert.throws(() => cleanPath(path), /Not a documentation save path/, path);

  for (const path of ['/etc/passwd', '../other/README.md', 'system-guide/', 'system-guide//a.md', '.git/config'])
    assert.throws(() => cleanPath(path), /Expected a project-relative file path/, path);

  assert.deepEqual(generatedPaths(['ai-external-knowledge/claude-code/hooks.md']),
    ['ai-external-knowledge/claude-code/hooks.md', KNOWLEDGE_INDEX]);
  assert.deepEqual(generatedPaths(['system-guide/a.md']), ['system-guide/a.md']);
  assert.deepEqual(generatedPaths([KNOWLEDGE_INDEX]), [KNOWLEDGE_INDEX]);
});

test('parallel saves have separate staging areas and a remote race is recoverable', () => {
  const source = project('project', {
    'README.md': '# Project\n',
    'system-guide/existing.md': '# Existing\n',
    'force-app/objects/large.xml': '<root/>\n',
  });

  const codeSave = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'src/change.js'], source);
  assert.equal(codeSave.status, 1);
  assert.match(codeSave.stderr, /Not a documentation save path/);

  const first = startSave(source, 'system-guide/first.md');
  const second = startSave(source, 'system-guide/second.md');
  assert.equal(existsSync(join(first, 'force-app', 'objects', 'large.xml')), false);
  assert.equal(existsSync(join(second, 'force-app', 'objects', 'large.xml')), false);
  git(first, 'mv', 'system-guide/existing.md', 'system-guide/first.md');
  const renamed = run(process.execPath, [script, 'publish', '--message', 'Rename another document'], first);
  assert.equal(renamed.status, 1);
  assert.match(renamed.stderr, /Other staged changes are present: system-guide\/existing\.md/);
  git(first, 'reset', '-q', '--', 'system-guide/existing.md', 'system-guide/first.md');
  git(first, 'checkout', '--', 'system-guide/existing.md');
  rmSync(join(first, 'system-guide', 'first.md'));
  write(join(first, 'system-guide', 'first.md'), '# First\n');
  write(join(second, 'system-guide', 'second.md'), '# Second\n');
  git(first, 'add', '--', 'system-guide/first.md');
  git(second, 'add', '--', 'system-guide/second.md');
  assert.equal(git(first, 'diff', '--cached', '--name-only'), 'system-guide/first.md');
  assert.equal(git(second, 'diff', '--cached', '--name-only'), 'system-guide/second.md');
  assert.equal(git(source, 'status', '--porcelain'), '');

  write(join(first, 'system-guide', 'unexpected.md'), '# Unexpected\n');
  const incomplete = run(process.execPath, [script, 'publish', '--message', 'Save first document'], first);
  assert.equal(incomplete.status, 1);
  assert.match(incomplete.stderr, /Unpublished files remain/);
  rmSync(join(first, 'system-guide', 'unexpected.md'));
  const one = run(process.execPath, [script, 'publish', '--message', 'Save first document'], first);
  assert.equal(one.status, 0, one.stderr);
  const stale = run(process.execPath, [script, 'publish', '--message', 'Save second document'], second);
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /default branch advanced/);
  assert.equal(git(second, 'status', '--porcelain'), '');
  git(second, 'rebase', 'FETCH_HEAD');
  const two = run(process.execPath, [script, 'publish', '--message', 'Save second document'], second);
  assert.equal(two.status, 0, two.stderr);
  git(source, 'fetch', '-q', 'origin', 'main');
  assert.equal(git(source, 'show', 'FETCH_HEAD:system-guide/first.md'), '# First');
  assert.equal(git(source, 'show', 'FETCH_HEAD:system-guide/second.md'), '# Second');
  assert.equal(readFileSync(join(source, 'system-guide', 'existing.md'), 'utf8'), '# Existing\n');
});

test('a V2 save publishes root documents, system-guide/, delivery files, the permissions runbook, and the knowledge index with no pre-commit hook', () => {
  const source = project('v2-project', {
    '.gitignore': '.memory/\n/.work-items/\ndelivery/data/*.csv\nsystem-guide/private/\n',
    '.toolkit.json': '{"toolkit": "toolkit-v2", "schema": 1}\n',
    'PROJECT.md': '# Project\n',
    'DECISIONS.md': '# Decisions\n',
    'requirements/billing.md': '# Billing\n',
    'system-guide/billing.md': '# Billing guide\n',
    'ai-external-knowledge/INDEX.md': '# Index\n',
    'ai-external-knowledge/claude-code/hooks.md': '# Hooks\n',
    'delivery/deployment/component-tracker.csv': 'Component,Type\n',
    'tools/permissions/PERMISSIONS-RUNBOOK.md': '# Permissions runbook\n',
    'tools/permissions/permsets.py': 'print("permission sets")\n',
    'force-app/objects/large.xml': '<root/>\n',
  });
  const hook = resolve(source, git(source, 'rev-parse', '--git-path', 'hooks/pre-commit'));
  assert.equal(existsSync(hook), false);

  const ignored = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'system-guide/private/notes.md'], source);
  assert.equal(ignored.status, 1);
  assert.match(ignored.stderr, /Not a documentation save path: system-guide\/private\/notes\.md \(Git ignores it/);
  const data = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'delivery/data/load.csv'], source);
  assert.equal(data.status, 1);
  assert.match(data.stderr, /Not a documentation save path: delivery\/data\/load\.csv \(delivery\/data\/ holds load files/);
  const memory = run(process.execPath, [script, 'start', '--branch', 'main', '--', '.memory/MEMORY.md'], source);
  assert.equal(memory.status, 1);
  assert.match(memory.stderr, /local and Git-ignored/);
  const codeFile = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'tools/permissions/permsets.py'], source);
  assert.equal(codeFile.status, 1);
  assert.match(codeFile.stderr, /Not a documentation save path: tools\/permissions\/permsets\.py/);

  const paths = [
    'PROJECT.md',
    'DECISIONS.md',
    'PROJECT-ROADMAP.md',
    'requirements/billing.md',
    'system-guide/billing.md',
    'ai-external-knowledge/claude-code/hooks.md',
    'delivery/deployment/component-tracker.csv',
    'tools/permissions/PERMISSIONS-RUNBOOK.md',
  ];
  const workspace = startSave(source, ...paths);
  const marker = JSON.parse(readFileSync(join(git(workspace, 'rev-parse', '--absolute-git-dir'), 'toolkit-docsave.json'), 'utf8'));
  assert.ok(marker.paths.includes(KNOWLEDGE_INDEX));
  assert.equal(existsSync(join(workspace, 'force-app', 'objects', 'large.xml')), false);
  assert.equal(existsSync(join(workspace, 'requirements', 'billing.md')), true);
  assert.equal(existsSync(join(workspace, 'delivery', 'deployment', 'component-tracker.csv')), true);
  assert.equal(existsSync(join(workspace, 'system-guide', 'billing.md')), true);
  assert.equal(existsSync(join(workspace, 'tools', 'permissions', 'PERMISSIONS-RUNBOOK.md')), true);

  write(join(workspace, 'PROJECT.md'), '# Project\n\nUpdated.\n');
  write(join(workspace, 'DECISIONS.md'), '# Decisions\n\n| D-1 | Use Postgres |\n');
  write(join(workspace, 'PROJECT-ROADMAP.md'), '# Roadmap\n');
  write(join(workspace, 'requirements', 'billing.md'), '# Billing\n\nR-01 delivered.\n');
  write(join(workspace, 'system-guide', 'billing.md'), '# Billing guide\n\nInvoices are sent monthly.\n');
  write(join(workspace, 'tools', 'permissions', 'PERMISSIONS-RUNBOOK.md'), '# Permissions runbook\n\nStep 1 checked.\n');
  write(join(workspace, 'ai-external-knowledge', 'claude-code', 'hooks.md'), '# Hooks\n\nRefreshed.\n');
  write(join(workspace, KNOWLEDGE_INDEX), '# Index\n\n- claude-code/hooks.md\n');
  write(join(workspace, 'delivery', 'deployment', 'component-tracker.csv'), 'Component,Type\nInvoice__c,CustomObject\n');
  git(workspace, 'add', '--', ...paths, KNOWLEDGE_INDEX);

  const published = run(process.execPath, [script, 'publish', '--message', 'Save project documents'], workspace);
  assert.equal(published.status, 0, published.stderr);
  assert.match(published.stdout, /Published [0-9a-f]+ to origin\/main\./);
  git(source, 'fetch', '-q', 'origin', 'main');
  assert.match(git(source, 'show', 'FETCH_HEAD:delivery/deployment/component-tracker.csv'), /Invoice__c/);
  assert.match(git(source, 'show', 'FETCH_HEAD:ai-external-knowledge/INDEX.md'), /claude-code\/hooks\.md/);
  assert.match(git(source, 'show', 'FETCH_HEAD:PROJECT-ROADMAP.md'), /Roadmap/);
  assert.match(git(source, 'show', 'FETCH_HEAD:system-guide/billing.md'), /sent monthly/);
  assert.match(git(source, 'show', 'FETCH_HEAD:tools/permissions/PERMISSIONS-RUNBOOK.md'), /Step 1 checked/);

  const again = run(process.execPath, [script, 'publish', '--message', 'Nothing new'], workspace);
  assert.equal(again.status, 1);
  assert.match(again.stderr, /No changes to publish/);
});

test('data under delivery/data/ and hidden files are refused even when Git does not ignore them', () => {
  const source = project('data-guard', {
    '.gitignore': '.memory/\n/.work-items/\n',
    'delivery/data/production-backups/.gitignore': '*.csv\n*.xlsx\n*.xls\n!.gitignore\n',
    'delivery/data/data-loads/.gitignore': '*.csv\n*.xlsx\n*.xls\n!.gitignore\n',
    'system-guide/existing.md': '# Existing\n',
  });
  write(join(source, 'delivery/data/production-backups/prod-backup-09262026-acct/Account.json'),
    '[{"Id": "001000000000001AAA", "Email": "person@example.invalid"}]\n');
  write(join(source, 'system-guide/.env'), 'API_KEY=placeholder\n');
  const notIgnored = run('git', ['check-ignore', '-q', '--', 'delivery/data/production-backups/prod-backup-09262026-acct/Account.json'], source);
  assert.equal(notIgnored.status, 1, 'the fixture must not ignore the JSON backup, so the path rule is what refuses it');

  const backup = run(process.execPath, [script, 'start', '--branch', 'main', '--',
    'delivery/data/production-backups/prod-backup-09262026-acct/Account.json'], source);
  assert.equal(backup.status, 1);
  assert.match(backup.stderr, /delivery\/data\/ holds load files and backups/);
  const env = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'system-guide/.env'], source);
  assert.equal(env.status, 1);
  assert.match(env.stderr, /hidden files and folders/);
  const instructions = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'system-guide/agents.md'], source);
  assert.equal(instructions.status, 1);
  assert.match(instructions.stderr, /instruction files/);

  git(source, 'fetch', '-q', 'origin', 'main');
  assert.equal(git(source, 'ls-tree', '-r', '--name-only', 'FETCH_HEAD').split('\n').some(path => path.endsWith('.json') || path.endsWith('.env')), false);
});

test('two-space Markdown line breaks publish; conflict markers are refused with the reason', () => {
  const source = project('line-breaks', {
    'PROJECT-ROADMAP.md': '# Roadmap\n',
    'requirements/billing.md': '# Billing\n',
  });
  const workspace = startSave(source, 'PROJECT-ROADMAP.md', 'requirements/billing.md');
  write(join(workspace, 'PROJECT-ROADMAP.md'), '# Roadmap\n\n**Now:** WI-012 billing  \n**Next:** WI-014 export  \n');
  write(join(workspace, 'requirements', 'billing.md'),
    '# Billing\n\n## R-01 Invoice total\n\n**Status:** delivered  \n**Delivered by:** WI-012  \n');
  git(workspace, 'add', '--', 'PROJECT-ROADMAP.md', 'requirements/billing.md');
  const published = run(process.execPath, [script, 'publish', '--message', 'Save the roadmap and billing requirements'], workspace);
  assert.equal(published.status, 0, published.stderr);
  git(source, 'fetch', '-q', 'origin', 'main');
  assert.match(git(source, 'show', 'FETCH_HEAD:PROJECT-ROADMAP.md'), /WI-012 billing {2}\n/);

  write(join(workspace, 'requirements', 'billing.md'), '# Billing\n\n<<<<<<< HEAD\nOne\n=======\nTwo\n>>>>>>> other\n');
  git(workspace, 'add', '--', 'requirements/billing.md');
  const conflicted = run(process.execPath, [script, 'publish', '--message', 'Save a conflicted file'], workspace);
  assert.equal(conflicted.status, 1);
  assert.match(conflicted.stderr, /conflict markers or whitespace errors/);
  assert.match(conflicted.stderr, /requirements\/billing\.md:\d+: leftover conflict marker/);
});

test('with no remote, a save commits on the local default branch by fast-forward and never fetches or pushes', () => {
  const source = localProject('no-remote', {
    'README.md': '# Project\n',
    'requirements/billing.md': '# Billing\n',
  });
  assert.equal(hasRemote(source), false);
  const before = git(source, 'rev-parse', 'main');

  const started = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'requirements/billing.md'], source);
  assert.equal(started.status, 0, started.stderr);
  assert.match(started.stderr, /No remote: this save will be committed locally on main/);
  const workspace = started.stdout.trim();
  workspaces.push({ source, workspace });
  const marker = JSON.parse(readFileSync(join(git(workspace, 'rev-parse', '--absolute-git-dir'), 'toolkit-docsave.json'), 'utf8'));
  assert.equal(marker.local, true);
  assert.equal(marker.base, before);

  write(join(workspace, 'requirements', 'billing.md'), '# Billing\n\nR-01 delivered.\n');
  git(workspace, 'add', '--', 'requirements/billing.md');
  const published = run(process.execPath, [script, 'publish', '--message', 'Save the billing requirements'], workspace);
  assert.equal(published.status, 0, published.stderr);
  const head = git(workspace, 'rev-parse', 'HEAD');
  assert.equal(published.stdout.trim(), `No remote: committed locally. ${head} is on main.`);
  assert.doesNotMatch(published.stderr, /origin|fetch|push/);

  // The main checkout has main checked out: it moved forward, working tree included.
  assert.equal(git(source, 'rev-parse', 'main'), head);
  assert.equal(git(source, 'rev-parse', 'HEAD^'), before);
  assert.equal(readFileSync(join(source, 'requirements', 'billing.md'), 'utf8'), '# Billing\n\nR-01 delivered.\n');
  assert.equal(git(source, 'status', '--porcelain'), '');
  assert.equal(git(source, 'remote'), '');

  const again = run(process.execPath, [script, 'publish', '--message', 'Nothing new'], workspace);
  assert.equal(again.status, 1);
  assert.match(again.stderr, /No changes to publish/);
});

test('with no remote, a default branch that moved on is refused until the save workspace is brought current', () => {
  const source = localProject('no-remote-advanced', {
    'PROJECT.md': '# Project\n',
    'system-guide/billing.md': '# Billing guide\n',
  });
  const workspace = startSave(source, 'system-guide/billing.md');
  write(join(source, 'PROJECT.md'), '# Project\n\nAnother session committed this.\n');
  git(source, 'add', '--', 'PROJECT.md');
  git(source, 'commit', '-q', '-m', 'Another session');
  const moved = git(source, 'rev-parse', 'main');

  write(join(workspace, 'system-guide', 'billing.md'), '# Billing guide\n\nInvoices are sent monthly.\n');
  git(workspace, 'add', '--', 'system-guide/billing.md');
  const stale = run(process.execPath, [script, 'publish', '--message', 'Save the billing guide'], workspace);
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /The default branch main advanced/);
  assert.equal(git(source, 'rev-parse', 'main'), moved, 'a refused save never moves the default branch');

  git(workspace, 'rebase', '-q', 'main');
  const current = run(process.execPath, [script, 'publish', '--message', 'Save the billing guide'], workspace);
  assert.equal(current.status, 0, current.stderr);
  assert.match(current.stdout, /^No remote: committed locally\./);
  assert.equal(git(source, 'rev-parse', 'main^'), moved);
  assert.match(readFileSync(join(source, 'system-guide', 'billing.md'), 'utf8'), /sent monthly/);
  assert.match(readFileSync(join(source, 'PROJECT.md'), 'utf8'), /Another session/);
});

test('with no remote, an uncommitted copy of a saved file in the main checkout stops the fast-forward and is never overwritten', () => {
  const source = localProject('no-remote-dirty', {
    'requirements/billing.md': '# Billing\n',
    'system-guide/other.md': '# Other\n',
  });
  const before = git(source, 'rev-parse', 'main');
  const workspace = startSave(source, 'requirements/billing.md');
  // This session's own edit, still in the main checkout.
  write(join(source, 'requirements', 'billing.md'), '# Billing\n\nDraft in the main checkout.\n');
  // Another session's unrelated uncommitted edit.
  write(join(source, 'system-guide', 'other.md'), '# Other\n\nAnother session is editing this.\n');

  write(join(workspace, 'requirements', 'billing.md'), '# Billing\n\nR-01 delivered.\n');
  git(workspace, 'add', '--', 'requirements/billing.md');
  const blocked = run(process.execPath, [script, 'publish', '--message', 'Save the billing requirements'], workspace);
  assert.equal(blocked.status, 1);
  assert.match(blocked.stderr, /could not be moved forward/);
  assert.match(blocked.stderr, /git restore -- <file>/);
  assert.equal(git(source, 'rev-parse', 'main'), before);
  assert.match(readFileSync(join(source, 'requirements', 'billing.md'), 'utf8'), /Draft in the main checkout/);

  git(source, 'restore', '--', 'requirements/billing.md');
  const retried = run(process.execPath, [script, 'publish', '--message', 'Save the billing requirements'], workspace);
  assert.equal(retried.status, 0, retried.stderr);
  assert.equal(git(source, 'rev-parse', 'main'), git(workspace, 'rev-parse', 'HEAD'));
  assert.match(readFileSync(join(source, 'requirements', 'billing.md'), 'utf8'), /R-01 delivered/);
  assert.match(readFileSync(join(source, 'system-guide', 'other.md'), 'utf8'), /Another session is editing this/,
    'the other session\'s uncommitted edit is kept');
});

test('with no remote and the default branch checked out nowhere, the branch moves forward and every checkout stays as it was', () => {
  const source = localProject('no-remote-elsewhere', {
    'DECISIONS.md': '# Decisions\n',
  });
  git(source, 'switch', '-q', '-c', 'claude/wi-001-feature');
  assert.equal(worktreeHolding(source, 'main'), null);
  const workspace = startSave(source, 'DECISIONS.md');
  write(join(workspace, 'DECISIONS.md'), '# Decisions\n\n| D-1 | Use Postgres |\n');
  git(workspace, 'add', '--', 'DECISIONS.md');
  const published = run(process.execPath, [script, 'publish', '--message', 'Record D-1'], workspace);
  assert.equal(published.status, 0, published.stderr);
  assert.equal(git(source, 'rev-parse', 'main'), git(workspace, 'rev-parse', 'HEAD'));
  assert.equal(git(source, 'rev-parse', '--abbrev-ref', 'HEAD'), 'claude/wi-001-feature');
  assert.equal(readFileSync(join(source, 'DECISIONS.md'), 'utf8'), '# Decisions\n');
  assert.equal(git(source, 'status', '--porcelain'), '');
});

test('with no remote, a default branch that does not exist is named in the refusal', () => {
  const source = localProject('no-remote-branch', { 'README.md': '# Project\n' });
  const missing = run(process.execPath, [script, 'start', '--branch', 'trunk', '--', 'README.md'], source);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /No remote, and there is no local branch trunk/);
});

test('with no remote, an untracked copy of a new saved file in the main checkout is refused with the delete step', () => {
  const source = localProject('no-remote-new-file', { 'requirements/billing.md': '# Billing\n' });
  const before = git(source, 'rev-parse', 'main');
  const workspace = startSave(source, 'requirements/export.md');
  // This session first wrote the new requirements area in the main checkout.
  write(join(source, 'requirements', 'export.md'), '# Export\n\nDraft in the main checkout.\n');

  write(join(workspace, 'requirements', 'export.md'), '# Export\n\nR-01 export to CSV.\n');
  git(workspace, 'add', '--', 'requirements/export.md');
  const blocked = run(process.execPath, [script, 'publish', '--message', 'Add the export requirements'], workspace);
  assert.equal(blocked.status, 1);
  assert.match(blocked.stderr, /could not be moved forward/);
  assert.match(blocked.stderr, /for a new file this session created there, delete that copy \(rm <file>\)/);
  assert.equal(git(source, 'rev-parse', 'main'), before, 'a refused fast-forward never moves the default branch');
  assert.match(readFileSync(join(source, 'requirements', 'export.md'), 'utf8'), /Draft in the main checkout/);

  // git restore cannot help with an untracked file; deleting this session's copy does.
  rmSync(join(source, 'requirements', 'export.md'));
  const retried = run(process.execPath, [script, 'publish', '--message', 'Add the export requirements'], workspace);
  assert.equal(retried.status, 0, retried.stderr);
  assert.equal(git(source, 'rev-parse', 'main'), git(workspace, 'rev-parse', 'HEAD'));
  assert.match(readFileSync(join(source, 'requirements', 'export.md'), 'utf8'), /R-01 export to CSV/);
  assert.equal(git(source, 'status', '--porcelain'), '');
});

test('a repository whose remotes do not include origin is refused at start with the remote names', () => {
  const source = localProject('upstream-only', { 'requirements/billing.md': '# Billing\n' });
  const remote = join(base, 'upstream-only.git');
  git(base, 'init', '--bare', '-q', remote);
  git(source, 'remote', 'add', 'upstream', remote);
  assert.deepEqual(remoteNames(source), ['upstream']);
  assert.equal(hasRemote(source), true);
  const worktreesBefore = git(source, 'worktree', 'list', '--porcelain');

  const refused = run(process.execPath, [script, 'start', '--branch', 'main', '--', 'requirements/billing.md'], source);
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /no remote named origin \(its remotes: upstream\)/);
  assert.match(refused.stderr, /git remote rename <name> origin/);
  assert.equal(refused.stdout, '', 'no save workspace path is printed');
  assert.equal(git(source, 'worktree', 'list', '--porcelain'), worktreesBefore, 'no save workspace is made');
});

test('the usage line shows the commit message in single quotes', () => {
  const source = localProject('usage-quotes', { 'README.md': '# Project\n' });
  const usage = run(process.execPath, [script, 'publish'], source);
  assert.equal(usage.status, 1);
  assert.match(usage.stderr, /publish --message 'Commit message'/);
});
