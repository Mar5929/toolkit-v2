import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  findProjectRoot, mainCheckoutRoot, loadConfig, requireProject, saveConfig,
  getPath, setPath, gitInfo, CONFIG_FILE,
} from '../../lib/core/config.mjs';
import { EXIT } from '../../lib/core/output.mjs';

// Test repositories are made with the owner's Git settings switched off, so a
// global hook or signing rule on this computer cannot change the result.
const GIT_ENV = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'Toolkit Test',
  GIT_AUTHOR_EMAIL: 'test@example.invalid',
  GIT_COMMITTER_NAME: 'Toolkit Test',
  GIT_COMMITTER_EMAIL: 'test@example.invalid',
};

function git(cwd, ...args) {
  const res = spawnSync('git', args, { cwd, env: GIT_ENV, encoding: 'utf8' });
  assert.equal(res.status, 0, `git ${args.join(' ')} failed: ${res.stderr}`);
  return res.stdout.trim();
}

const made = [];
after(() => {
  for (const dir of made) fs.rmSync(dir, { recursive: true, force: true });
});

function tempDir(prefix = 'toolkit-config-') {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
  made.push(dir);
  return dir;
}

const CONFIG = {
  toolkit: 'toolkit-v2',
  schema: 1,
  project: { name: 'Acme CRM', key: 'acme-crm', owner: 'Mike' },
  tracker: { type: 'local', idPrefix: 'WI' },
  memory: { type: 'builtin', approval: 'onboarding' },
  salesforce: { enabled: false },
  hosts: ['claude-code', 'codex'],
  notion: {},
  hindsight: {},
  installed: {},
};

function makeRepoWithWorktree() {
  const base = tempDir();
  const main = path.join(base, 'acme');
  fs.mkdirSync(main);
  git(main, 'init', '-q', '-b', 'main');
  fs.writeFileSync(path.join(main, 'README.md'), 'hello\n');
  git(main, 'add', 'README.md');
  git(main, 'commit', '-q', '-m', 'start');
  const beforeConfig = git(main, 'rev-parse', 'HEAD');
  fs.writeFileSync(path.join(main, CONFIG_FILE), `${JSON.stringify(CONFIG, null, 2)}\n`);
  git(main, 'add', CONFIG_FILE);
  git(main, 'commit', '-q', '-m', 'set up toolkit');
  const worktree = path.join(base, 'acme-wi-007');
  git(main, 'worktree', 'add', '-q', '-b', 'wi-007-login', worktree);
  fs.mkdirSync(path.join(worktree, 'src', 'deep'), { recursive: true });
  const oldWorktree = path.join(base, 'acme-old');
  git(main, 'worktree', 'add', '-q', '-b', 'old-branch', oldWorktree, beforeConfig);
  return { base, main, worktree, oldWorktree };
}

test('project discovery inside a linked Git worktree', () => {
  const { main, worktree } = makeRepoWithWorktree();
  const deep = path.join(worktree, 'src', 'deep');

  assert.equal(findProjectRoot(deep), worktree);
  assert.equal(findProjectRoot(worktree), worktree);
  assert.equal(mainCheckoutRoot(deep), main);
  assert.equal(mainCheckoutRoot(worktree), main);

  const info = gitInfo(deep);
  assert.equal(info.top, worktree);
  assert.equal(info.commonDir, path.join(main, '.git'));
  assert.notEqual(info.gitDir, info.commonDir);

  const project = requireProject(deep);
  assert.equal(project.root, worktree);
  assert.equal(project.mainRoot, main);
  assert.deepEqual(project.config, CONFIG);
});

test('project discovery in the main checkout', () => {
  const { main } = makeRepoWithWorktree();
  fs.mkdirSync(path.join(main, 'docs'));
  assert.equal(findProjectRoot(path.join(main, 'docs')), main);
  assert.equal(mainCheckoutRoot(path.join(main, 'docs')), main);
  const project = requireProject(path.join(main, 'docs'));
  assert.equal(project.root, main);
  assert.equal(project.mainRoot, main);
});

test('a path that does not exist yet, or a file, starts from its nearest folder', () => {
  const { main, worktree } = makeRepoWithWorktree();
  assert.equal(findProjectRoot(path.join(worktree, 'not', 'made', 'yet')), worktree);
  assert.equal(mainCheckoutRoot(path.join(worktree, 'README.md')), main);
});

test('a worktree on a branch from before setup uses the main checkout settings', () => {
  const { main, oldWorktree } = makeRepoWithWorktree();
  assert.equal(fs.existsSync(path.join(oldWorktree, CONFIG_FILE)), false);
  assert.equal(loadConfig(oldWorktree), null);
  const project = requireProject(oldWorktree);
  assert.equal(project.root, oldWorktree);
  assert.equal(project.mainRoot, main);
  assert.equal(project.config.project.key, 'acme-crm');
});

test('outside Git, the nearest folder with .toolkit.json is the project', () => {
  const base = tempDir();
  if (gitInfo(base)) return; // The temp folder is inside a Git repository on this computer; nothing to check.
  fs.writeFileSync(path.join(base, CONFIG_FILE), JSON.stringify(CONFIG));
  const deep = path.join(base, 'a', 'b');
  fs.mkdirSync(deep, { recursive: true });
  assert.equal(findProjectRoot(deep), base);
  assert.equal(mainCheckoutRoot(deep), base);
  assert.equal(requireProject(deep).root, base);

  const empty = tempDir();
  assert.equal(findProjectRoot(empty), null);
  assert.equal(mainCheckoutRoot(empty), null);
  assert.throws(() => requireProject(empty), (err) => err.code === EXIT.NOT_PROJECT && /not a Toolkit V2 project/.test(err.message));
});

test('a Git repository without toolkit settings is not a project', () => {
  const dir = tempDir();
  git(dir, 'init', '-q');
  assert.equal(findProjectRoot(dir), dir);
  assert.throws(() => requireProject(dir), (err) => {
    assert.equal(err.code, EXIT.NOT_PROJECT);
    assert.equal(err.details.root, dir);
    assert.match(err.details.fix, /toolkit init/);
    return true;
  });
});

test('loadConfig: missing, other tools, wrong shape, and bad JSON', () => {
  const dir = tempDir();
  assert.equal(loadConfig(dir), null);
  assert.equal(loadConfig(null), null);
  fs.writeFileSync(path.join(dir, CONFIG_FILE), JSON.stringify({ toolkit: 'something-else' }));
  assert.equal(loadConfig(dir), null);
  fs.writeFileSync(path.join(dir, CONFIG_FILE), JSON.stringify(['toolkit-v2']));
  assert.equal(loadConfig(dir), null);
  fs.writeFileSync(path.join(dir, CONFIG_FILE), '{ "toolkit": "toolkit-v2", }');
  assert.throws(() => loadConfig(dir), (err) => {
    assert.equal(err.code, EXIT.INVALID);
    assert.match(err.message, /not valid JSON/);
    return true;
  });
  fs.writeFileSync(path.join(dir, CONFIG_FILE), JSON.stringify(CONFIG));
  assert.deepEqual(loadConfig(dir), CONFIG);
});

test('saveConfig writes formatted JSON atomically and refuses a config without the mark', () => {
  const dir = tempDir();
  const file = saveConfig(dir, CONFIG);
  assert.equal(file, path.join(dir, CONFIG_FILE));
  assert.equal(fs.readFileSync(file, 'utf8'), `${JSON.stringify(CONFIG, null, 2)}\n`);
  assert.equal(fs.statSync(file).mode & 0o777, 0o644);
  const changed = structuredClone(CONFIG);
  setPath(changed, 'memory.type', 'hindsight');
  setPath(changed, 'hindsight.url', 'http://127.0.0.1:8888');
  saveConfig(dir, changed);
  assert.equal(loadConfig(dir).memory.type, 'hindsight');
  assert.deepEqual(Object.keys(loadConfig(dir)), Object.keys(CONFIG));
  assert.deepEqual(fs.readdirSync(dir), [CONFIG_FILE]);
  assert.throws(() => saveConfig(dir, { schema: 1 }), (err) => err.code === EXIT.INVALID);
  assert.throws(() => saveConfig(dir, null), (err) => err.code === EXIT.INVALID);
  assert.equal(loadConfig(dir).memory.type, 'hindsight', 'a refused save changes nothing');
});

test('getPath and setPath', () => {
  const obj = structuredClone(CONFIG);
  assert.equal(getPath(obj, 'tracker.type'), 'local');
  assert.equal(getPath(obj, 'project'), obj.project);
  assert.equal(getPath(obj, 'missing.deeper'), undefined);
  assert.equal(getPath(obj, 'tracker.type.length'), undefined, 'strings are not walked into');
  assert.equal(getPath(obj, ['salesforce', 'enabled']), false);
  assert.equal(getPath(obj, 'toString'), undefined, 'inherited properties are not settings');

  assert.equal(setPath(obj, 'salesforce.orgs.sandbox', 'acme-dev'), obj);
  assert.deepEqual(obj.salesforce, { enabled: false, orgs: { sandbox: 'acme-dev' } });
  setPath(obj, 'brand.new', 1);
  assert.deepEqual(obj.brand, { new: 1 });
  setPath(obj, 'notion', null);
  setPath(obj, 'notion.page', 'abc');
  assert.deepEqual(obj.notion, { page: 'abc' });
  assert.throws(() => setPath(obj, 'tracker.type.inner', 1), (err) => err.code === EXIT.INVALID);
  for (const bad of ['', 'a..b', '__proto__.polluted', 'constructor.prototype.x', 'a.prototype']) {
    assert.throws(() => setPath({}, bad, 1), (err) => err.code === EXIT.INVALID, bad);
  }
  assert.throws(() => getPath({}, '__proto__'), (err) => err.code === EXIT.INVALID);
  assert.equal({}.polluted, undefined);
});
