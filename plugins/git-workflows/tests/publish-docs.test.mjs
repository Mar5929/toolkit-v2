import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cleanPath, generatedPaths, KNOWLEDGE_INDEX } from '../skills/publish-docs/scripts/publish-docs.mjs';

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
function project(name, files) {
  const remote = join(base, `${name}.git`);
  const source = join(base, name);
  git(base, 'init', '--bare', '-q', remote);
  mkdirSync(source);
  git(source, 'init', '-q', '-b', 'main');
  git(source, 'config', 'user.name', 'Fixture Owner');
  git(source, 'config', 'user.email', 'fixture@example.invalid');
  git(source, 'config', 'core.autocrlf', 'false');
  for (const [path, content] of Object.entries(files)) write(join(source, path), content);
  git(source, 'add', '--', ...Object.keys(files));
  git(source, 'commit', '-q', '-m', 'Initial files');
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
