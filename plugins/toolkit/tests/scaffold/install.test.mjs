// Install checks: the install list that lib/project/model-scaffold.mjs builds
// from scaffold/model/ and scaffold/CONDITIONS.json, and what the install
// engine (lib/project/manifest.mjs, the code behind toolkit init and toolkit
// sync) writes for every tracker x memory x Salesforce setup, for each host,
// when an existing repository is adopted, after a setup change, and after the
// owner edits files. Rules: templates/TEMPLATE-LANGUAGE.md. The file-by-file
// comparison with the model is in parity.test.mjs.
//
// Run from the repository root: node --test 'plugins/toolkit/tests/**/*.test.mjs'
// It needs no environment variables. It writes only to temporary folders.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { planManifest, applyPlan, planSummary, planWrites, projectHosts, readHosts } from '../../lib/project/manifest.mjs';
import { hasMarkers } from '../../lib/project/render.mjs';
import {
  buildManifest, listModelFiles, unmatchedRules, TOOLKIT_ENTRIES, WHEN_VALUES, MODEL_DIR, IMPORT_RECORD,
} from '../../lib/project/model-scaffold.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN = path.resolve(HERE, '..', '..');
const MODEL = path.join(PLUGIN, ...MODEL_DIR.split('/'));
const manifest = buildManifest(PLUGIN);
const TODAY = '2026-09-26';
const MODES = ['copy', 'agents-md', 'append', 'merge-json', 'merge-toml', 'seed'];

// ------------------------------------------------------------------ helpers

function walk(dir) {
  return fs.readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  }).sort();
}
const read = (p) => fs.readFileSync(p, 'utf8');

const made = [];
after(() => {
  for (const d of made) fs.rmSync(d, { recursive: true, force: true });
});
function tmpDir(name) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `toolkit-scaffold-${name}-`)));
  made.push(dir);
  return dir;
}

// A home folder with no Claude Code or Codex settings, so the engine never reads
// the real ~/.claude or ~/.codex.
const HOME = tmpDir('home');
const ENV = {
  HOME,
  CLAUDE_CONFIG_DIR: path.join(HOME, '.claude'),
  CODEX_HOME: path.join(HOME, '.codex'),
  TOOLKIT_V2_CONFIG_DIR: path.join(HOME, '.config', 'toolkit-v2'),
  TOOLKIT_TODAY: TODAY,
};

function python(code, ...args) {
  try {
    execFileSync('python3', ['-c', code, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true };
  } catch (err) {
    if (err.code === 'ENOENT') return { ok: null };
    return { ok: false, message: String(err.stderr || err.message) };
  }
}
const hasPython = (mod) => python(`import ${mod}`).ok === true;

function config({ tracker = 'local', memory = 'builtin', salesforce = false, idPrefix = 'WI', hosts = ['claude-code', 'codex'] } = {}) {
  const c = {
    toolkit: 'toolkit-v2',
    schema: 1,
    project: { name: 'Acme CRM', key: 'acme-crm', owner: 'Mike', created: TODAY },
    tracker: { type: tracker, idPrefix },
    memory: { type: memory },
    salesforce: { enabled: salesforce },
    notion: {},
    hindsight: {},
    installed: {},
  };
  if (hosts !== null) c.hosts = hosts;
  return c;
}

/** Run the install engine as init or sync does, and keep the installed hashes. */
function run(cfg, dir, { mode = 'init', changedSettings } = {}) {
  const plan = planManifest({ root: dir, mainRoot: dir, config: cfg }, { mode, env: ENV, pluginRoot: PLUGIN, changedSettings });
  const applied = applyPlan(plan);
  cfg.installed = plan.installed;
  const s = planSummary(plan);
  return {
    written: applied.written.map((w) => w.target),
    changedByProject: s.changedByProject.map((c) => c.target),
    leftovers: s.leftovers,
    proposals: s.proposals,
    conflicts: s.conflicts,
    notReflected: plan.notReflected,
  };
}

const rel = (dir) => walk(dir).map((f) => path.relative(dir, f));

const SETUPS = [];
for (const tracker of ['local', 'notion', 'github', 'jira']) {
  for (const memory of ['builtin', 'hindsight', 'notion']) {
    for (const salesforce of [false, true]) SETUPS.push({ tracker, memory, salesforce });
  }
}
const SALESFORCE_WORDS = /salesforce|sfdx|force-app|\bsf /i;
// Files that name Salesforce outside a Salesforce block: the settings files
// switch the Salesforce plugin off, and AGENTS.md lists Salesforce as a setup choice.
const SALESFORCE_MENTION_OK = new Set(['.codex/config.toml', '.claude/settings.json', 'AGENTS.md']);

// ------------------------------------------------------------------ the install list

test('the install list has every model file once, and every toolkit file it names exists', () => {
  const modelFiles = listModelFiles(PLUGIN);
  assert.ok(modelFiles.length > 100, `${modelFiles.length} model files`);
  assert.ok(!modelFiles.includes(IMPORT_RECORD), 'the import record is not installed');
  const modelEntries = manifest.files.filter((e) => e.model);
  assert.deepEqual(modelEntries.map((e) => e.target), modelFiles);
  for (const e of manifest.files) {
    assert.ok(fs.existsSync(path.join(PLUGIN, e.source)), `${e.source} exists`);
    assert.ok(MODES.includes(e.mode), `${e.source}: mode ${e.mode}`);
    for (const w of e.when) assert.ok(WHEN_VALUES.includes(w), `${e.source}: condition ${w}`);
    if (e.model) {
      const text = read(path.join(PLUGIN, e.source));
      assert.equal(e.template, hasMarkers(text) || e.fills.length > 0, `${e.source}: template flag`);
      assert.equal(e.source, `${MODEL_DIR}/${e.target}`, 'a model file installs at the same path');
    }
  }
  const toolkitSources = new Set(TOOLKIT_ENTRIES.map((e) => e.source));
  const RUNTIME_ONLY = new Set(['templates/TEMPLATE-LANGUAGE.md', 'templates/hindsight/local.toolkit-v2.hindsight.plist.tmpl']);
  const inTemplates = walk(path.join(PLUGIN, 'templates')).map((p) => path.relative(PLUGIN, p));
  assert.deepEqual(inTemplates.filter((p) => !toolkitSources.has(p) && !RUNTIME_ONLY.has(p)), [], 'templates/ holds only the toolkit\'s own files');
  assert.ok(!fs.existsSync(path.join(PLUGIN, 'scaffold', 'MANIFEST.json')), 'MANIFEST.json is gone');
  assert.ok(!fs.existsSync(path.join(PLUGIN, 'scaffold', 'base')) && !fs.existsSync(path.join(PLUGIN, 'scaffold', 'salesforce')), 'the old scaffold trees are gone');
});

test('templates/ holds no copy of a model file', () => {
  const modelTexts = new Map(listModelFiles(PLUGIN).map((f) => [read(path.join(MODEL, f)), f]));
  for (const p of walk(path.join(PLUGIN, 'templates'))) {
    assert.ok(!modelTexts.has(read(p)), `${path.relative(PLUGIN, p)} is a copy of the model's ${modelTexts.get(read(p))}`);
  }
});

test('every CONDITIONS.json rule matches the model copy, and the import record says where it came from', () => {
  const files = listModelFiles(PLUGIN);
  assert.deepEqual(unmatchedRules(manifest.conditions, files, (f) => read(path.join(MODEL, f))), []);
  const record = JSON.parse(read(path.join(MODEL, IMPORT_RECORD)));
  assert.deepEqual(Object.keys(record), ['source', 'branch', 'commit', 'dirty', 'importedAt']);
  assert.match(record.commit, /^[0-9a-f]{40}$/);
  assert.ok(typeof manifest.conditions.notes.salesforce === 'string' && manifest.conditions.notes.salesforce.length > 100, 'the Salesforce decisions are explained');
});

test('host-specific targets: CLAUDE.md, .claude/settings, output styles, and skills for Claude Code; .codex/ and .agents/ for Codex', () => {
  for (const e of manifest.files) {
    if (e.target.startsWith('.codex/') || e.target.startsWith('.agents/')) assert.ok(e.when.includes('host:codex'), e.target);
    if (['CLAUDE.md', '.claude/settings.json'].includes(e.target) || e.target.startsWith('.claude/output-styles/') || e.target.startsWith('.claude/skills/')) {
      assert.ok(e.when.includes('host:claude-code'), e.target);
    }
    if (e.target.startsWith('.claude/rules/') || e.target.startsWith('.claude/hooks/')) assert.ok(!e.when.some((w) => w.startsWith('host:')), `${e.target} installs for both hosts`);
  }
});

test('every SKILL.md and rule in the model has frontmatter a strict YAML parser accepts', { skip: !hasPython('yaml') && 'PyYAML is not installed' }, () => {
  const files = walk(MODEL).filter((p) => p.endsWith('SKILL.md') || p.includes(`${path.sep}.claude${path.sep}rules${path.sep}`));
  assert.ok(files.length > 10);
  for (const f of files) {
    const m = /^---\n([\s\S]*?)\n---\n/.exec(read(f));
    if (!m) continue;
    const res = python('import sys,yaml; yaml.safe_load(sys.argv[1])', m[1]);
    assert.notEqual(res.ok, false, `${path.relative(PLUGIN, f)}: ${res.message}`);
  }
});

// ------------------------------------------------------------------ each setup

for (const setup of SETUPS) {
  const name = `${setup.tracker}-${setup.memory}-${setup.salesforce ? 'sf' : 'plain'}`;
  test(`install ${name}`, (t) => {
    const dir = tmpDir(name);
    const cfg = config(setup);
    run(cfg, dir);
    const files = rel(dir);
    assert.ok(files.length > 20, 'too few files');
    const agents = read(path.join(dir, 'AGENTS.md'));
    const lines = agents.split('\n').length - 1;
    t.diagnostic(`${files.length} files; AGENTS.md ${lines} lines, ${Buffer.byteLength(agents)} bytes`);
    assert.ok(lines <= 150, `AGENTS.md has ${lines} lines`);
    assert.match(agents, /^# Acme CRM: agent guide$/m);
    if (setup.tracker === 'github') assert.ok(agents.includes('`#12`') && !agents.includes('WI-0'));
    if (setup.tracker === 'jira') assert.ok(agents.includes('Jira key') && !agents.includes('WI-0'));
    if (['local', 'notion'].includes(setup.tracker)) assert.ok(agents.includes('`WI-001`'));
    if (setup.memory === 'hindsight') assert.ok(agents.includes('the local Hindsight server on this computer'));
    assert.equal(files.includes('.claude/rules/work-item-folders.md'), setup.tracker === 'local');
    assert.equal(files.some((f) => f.startsWith('.work-items/')), setup.tracker === 'local');
    assert.equal(files.some((f) => f.startsWith('.memory/')), setup.memory === 'builtin');
    assert.equal(files.includes('.codex/hooks.json'), setup.salesforce, '.codex/hooks.json holds only the Salesforce guards');
    for (const f of files) {
      const text = read(path.join(dir, f));
      assert.ok(!/<!-- (if [^>]*|endif) -->/.test(text), `marker left in ${f}`);
      if (!setup.salesforce && !SALESFORCE_MENTION_OK.has(f)) assert.ok(!SALESFORCE_WORDS.test(text), `Salesforce wording in ${f}: ${(SALESFORCE_WORDS.exec(text) || [])[0]}`);
    }
    if (!setup.salesforce) {
      // The model names Salesforce outside its Salesforce blocks only as a setup choice.
      const outside = agents.split('\n').filter((l) => SALESFORCE_WORDS.test(l));
      const allowed = ['<!-- Project setup fill-in guide:', '| `.toolkit.json` | Setup choices:'];
      assert.deepEqual(outside.filter((l) => !allowed.some((a) => l.startsWith(a))), [], 'AGENTS.md names Salesforce only as a setup choice');
    }
    JSON.parse(read(path.join(dir, '.claude/settings.json')));
    if (setup.salesforce) JSON.parse(read(path.join(dir, '.codex/hooks.json')));
    const toml = python('import tomllib,sys; tomllib.load(open(sys.argv[1],"rb"))', path.join(dir, '.codex/config.toml'));
    assert.notEqual(toml.ok, false, `.codex/config.toml: ${toml.message}`);
    const gi = read(path.join(dir, '.gitignore'));
    for (const need of ['/.work-items/', '.memory/', '/.toolkit-cache/', '/.toolkit-decisions.lock', '.claude/worktrees/']) assert.ok(gi.split('\n').includes(need), `.gitignore lacks ${need}`);
    assert.equal(gi.split('\n').includes('.sfdx/'), setup.salesforce);
  });
}

// ------------------------------------------------------------------ hosts, adopting, changes

test('hosts: a Claude-only project gets no .codex/ or .agents/, a Codex-only project no Claude files, and no hosts means both', () => {
  const a = tmpDir('claude-only');
  const ca = config({ salesforce: true, hosts: ['claude-code'] });
  run(ca, a);
  assert.ok(fs.existsSync(path.join(a, '.claude/settings.json')) && fs.existsSync(path.join(a, 'CLAUDE.md')));
  assert.ok(fs.existsSync(path.join(a, '.claude/skills/sf-deploy-check/SKILL.md')));
  assert.ok(!fs.existsSync(path.join(a, '.codex')) && !fs.existsSync(path.join(a, '.agents')));
  // A later sync keeps it that way.
  run(ca, a, { mode: 'sync' });
  assert.ok(!fs.existsSync(path.join(a, '.codex')) && !fs.existsSync(path.join(a, '.agents')));

  const b = tmpDir('codex-only');
  run(config({ salesforce: true, hosts: ['codex'] }), b);
  assert.ok(fs.existsSync(path.join(b, '.codex/config.toml')) && fs.existsSync(path.join(b, '.codex/hooks.json')) && fs.existsSync(path.join(b, '.agents/skills/sf-data-change/SKILL.md')));
  assert.ok(!fs.existsSync(path.join(b, '.claude/settings.json')) && !fs.existsSync(path.join(b, '.claude/output-styles')) && !fs.existsSync(path.join(b, '.claude/skills')) && !fs.existsSync(path.join(b, 'CLAUDE.md')));
  // Codex needs these too: its hooks run the same guard scripts, and AGENTS.md lists the rules.
  assert.ok(fs.existsSync(path.join(b, '.claude/hooks/guard-protected-orgs.cjs')), 'the Codex guards run the .claude/hooks scripts');
  assert.ok(fs.existsSync(path.join(b, '.claude/rules/keep-work-item-current.md')));

  const c = tmpDir('no-hosts');
  const cc = config({ hosts: null });
  assert.equal('hosts' in cc, false);
  assert.deepEqual(projectHosts(cc), ['claude-code', 'codex']);
  assert.deepEqual(projectHosts({ hosts: [] }), ['claude-code', 'codex']);
  assert.deepEqual(projectHosts({ hosts: ['claude'] }), ['claude-code']);
  assert.deepEqual(projectHosts({ hosts: ['codex', 'claude-code'] }), ['claude-code', 'codex']);
  assert.deepEqual(projectHosts({ hosts: ['an-editor'] }), ['claude-code', 'codex'], 'only unknown names: both');
  // A string from a hand edit is split on commas; it is never widened to both hosts.
  assert.deepEqual(readHosts({ hosts: 'claude-code' }), { hosts: ['claude-code'], problem: null });
  assert.deepEqual(readHosts({ hosts: 'Codex' }), { hosts: ['codex'], problem: null });
  assert.deepEqual(readHosts({ hosts: 'codex, claude' }), { hosts: ['claude-code', 'codex'], problem: null });
  assert.deepEqual(readHosts({ hosts: ['claude-code,codex'] }), { hosts: ['claude-code', 'codex'], problem: null });
  assert.deepEqual(readHosts({}), { hosts: ['claude-code', 'codex'], problem: null });
  assert.deepEqual(readHosts({ hosts: null }), { hosts: ['claude-code', 'codex'], problem: null });
  // A value that cannot be read fully is a problem, with what could be read.
  assert.deepEqual(readHosts({ hosts: 'claude code' }).hosts, ['claude-code', 'codex']);
  assert.match(readHosts({ hosts: 'claude code' }).problem, /"claude code" is not a host/);
  assert.deepEqual(readHosts({ hosts: ['codex', 'cursor'] }).hosts, ['codex']);
  assert.match(readHosts({ hosts: ['codex', 'cursor'] }).problem, /"cursor" is not a host/);
  assert.match(readHosts({ hosts: ['an-editor', 7] }).problem, /"an-editor", 7 are not hosts/);
  assert.match(readHosts({ hosts: 42 }).problem, /which is not a list of hosts/);
  assert.match(readHosts({ hosts: { claude: true } }).problem, /which is not a list of hosts/);
  assert.match(readHosts({ hosts: '' }).problem, /names no host/);
  assert.match(readHosts({ hosts: [] }).problem, /names no host/);
  assert.throws(() => planManifest({ root: c, config: { ...cc, hosts: 'claude code' } }, { mode: 'sync' }), (e) => e.code === 2 && /not a host.*Nothing was changed/.test(e.message));
  run(cc, c);
  assert.ok(fs.existsSync(path.join(c, '.claude/settings.json')) && fs.existsSync(path.join(c, '.codex/config.toml')));
});

test('adopting a repository: AGENTS.md is kept with a proposal; settings, config.toml, and .gitignore are merged', () => {
  const dir = tmpDir('adopt');
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Old manual\n\nOpen the work skill.\n');
  fs.mkdirSync(path.join(dir, '.codex'));
  fs.writeFileSync(path.join(dir, '.codex/config.toml'), 'model = "gpt-5"\n\n[features]\nweb_search = true\n');
  fs.mkdirSync(path.join(dir, '.claude'));
  fs.writeFileSync(path.join(dir, '.claude/settings.json'), '{\n  "model": "opus",\n  "permissions": { "deny": ["Bash(rm -rf *)", "Bash(git add -A)"] }\n}\n');
  fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules/\n*.log\n');
  const cfg = config();
  const report = run(cfg, dir);
  assert.equal(read(path.join(dir, 'AGENTS.md')), '# Old manual\n\nOpen the work skill.\n');
  assert.equal(report.proposals.length, 1);
  const proposal = read(path.join(dir, '.toolkit-cache/AGENTS.proposed.md'));
  assert.ok(proposal.includes('# Acme CRM: agent guide') && proposal.includes('`.claude/rules/keep-work-item-current.md`'));
  const toml = read(path.join(dir, '.codex/config.toml'));
  assert.ok(toml.startsWith('model = "gpt-5"'));
  assert.match(toml, /\[plugins\."toolkit@toolkit-v2"\]\nenabled = true/);
  assert.match(toml, /\[features\]\nweb_search = true/);
  assert.equal((toml.match(/\[plugins\."toolkit@toolkit-v2"\]/g) || []).length, 1);
  const parsed = python('import tomllib,sys; d=tomllib.load(open(sys.argv[1],"rb")); assert d["plugins"]["work@toolkit-v2"]["enabled"] is True; assert d["features"]["web_search"] is True', path.join(dir, '.codex/config.toml'));
  assert.notEqual(parsed.ok, false, parsed.message);
  const settings = JSON.parse(read(path.join(dir, '.claude/settings.json')));
  assert.equal(settings.model, 'opus', 'the project\'s own setting stays');
  assert.equal(settings.permissions.deny[0], 'Bash(rm -rf *)');
  assert.equal(settings.permissions.deny.filter((d) => d === 'Bash(git add -A)').length, 1, 'the model\'s deny list is joined without duplicates');
  assert.ok(settings.permissions.deny.includes('Bash(git push --force *)'));
  assert.equal(settings.outputStyle, 'Plain English');
  assert.equal(settings.enabledPlugins['toolkit@toolkit-v2'], true);
  const gi = read(path.join(dir, '.gitignore'));
  assert.ok(gi.startsWith('node_modules/\n*.log\n\n'));
  assert.equal((gi.match(/^\*\.log$/gm) || []).length, 1, '*.log is not added twice');
  assert.ok(gi.includes('/.work-items/') && gi.includes('/.toolkit-cache/'));
  // A dotted key for a V2 plugin is a conflict: the file is left alone.
  const other = tmpDir('adopt-dotted');
  fs.mkdirSync(path.join(other, '.codex'));
  const dotted = 'plugins."toolkit@toolkit-v2".enabled = false\n';
  fs.writeFileSync(path.join(other, '.codex/config.toml'), dotted);
  const r2 = run(config(), other);
  assert.equal(read(path.join(other, '.codex/config.toml')), dotted);
  assert.equal(r2.conflicts.length, 1);
});

test('setup change: Salesforce on adds the model\'s Salesforce files and entries to files nobody changed; off again takes the entries out and leaves the files as left over', () => {
  const dir = tmpDir('sf-change');
  const cfg = config();
  run(cfg, dir);
  const readme = path.join(dir, 'README.md');
  fs.appendFileSync(readme, '\nOwner note.\n');
  cfg.salesforce.enabled = true;
  const r1 = run(cfg, dir, { mode: 'sync', changedSettings: [{ key: 'salesforce.enabled', from: false, to: true }] });
  assert.ok(fs.existsSync(path.join(dir, 'sfdx-project.json')) && fs.existsSync(path.join(dir, '.codex/hooks.json')));
  assert.match(read(path.join(dir, 'PROJECT.md')), /Why this Salesforce project exists/, 'an unchanged model file is rendered again');
  assert.match(read(readme), /How to identify the correct environment/, 'a changed file keeps its text');
  assert.deepEqual(r1.notReflected, ['README.md was changed by the project, so it still describes salesforce.enabled false. Update it by hand.']);
  const settings = JSON.parse(read(path.join(dir, '.claude/settings.json')));
  assert.equal(settings.hooks.PreToolUse[0].hooks.length, 2);
  assert.equal(settings.enabledPlugins['sf-architect-solutioning@toolkit-v2'], true);
  assert.match(read(path.join(dir, '.gitignore')), /^\.sfdx\/$/m);
  assert.match(read(path.join(dir, 'AGENTS.md')), /`\.claude\/rules\/salesforce-org-safety\.md`/);
  cfg.salesforce.enabled = false;
  const r2 = run(cfg, dir, { mode: 'sync' });
  assert.ok(fs.existsSync(path.join(dir, 'sfdx-project.json')), 'nothing is deleted');
  assert.ok(r2.leftovers.includes('sfdx-project.json') && r2.leftovers.includes('.codex/hooks.json'));
  const off = JSON.parse(read(path.join(dir, '.claude/settings.json')));
  assert.equal(off.enabledPlugins['sf-architect-solutioning@toolkit-v2'], false);
  // An unchanged settings file loses the Salesforce hooks and permission rules,
  // so no hook runs a left-over script the owner may delete.
  assert.equal(off.hooks, undefined, 'no Salesforce hook is left');
  assert.deepEqual([...off.permissions.deny, ...(off.permissions.ask || [])].filter((r) => /^Bash\(sfd?x? /.test(r)), []);
  assert.ok(off.permissions.deny.includes('Bash(git add -A)') && off.permissions.allow.includes('Bash(toolkit *)'), 'the other entries stay');
  assert.ok(!read(path.join(dir, '.gitignore')).split('\n').includes('.sfdx/'), 'the Salesforce .gitignore lines are gone');
  assert.ok(r2.written.includes('.claude/settings.json') && r2.written.includes('.gitignore'));
  // The same as a project that never had Salesforce, apart from the order of keys.
  const never = tmpDir('sf-never');
  run(config(), never);
  const sorted = (v) => (Array.isArray(v) ? v.map(sorted) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sorted(v[k])])) : v);
  assert.deepEqual(sorted(off), sorted(JSON.parse(read(path.join(never, '.claude/settings.json')))));
  // A second sync changes nothing, and Salesforce on again brings the entries back.
  const r3 = run(cfg, dir, { mode: 'sync' });
  assert.deepEqual(r3.written, []);
  cfg.salesforce.enabled = true;
  run(cfg, dir, { mode: 'sync' });
  const on = JSON.parse(read(path.join(dir, '.claude/settings.json')));
  assert.equal(on.hooks.PreToolUse[0].hooks.length, 2);
  assert.equal(on.hooks.Stop[0].hooks.length, 1);
  assert.ok(on.permissions.deny.includes('Bash(sf org delete *)'));
});

test('a model file that is not text is copied as bytes, and an executable model file stays executable', () => {
  // A copy of the plugin's scaffold and templates with two extra model files.
  const plugin = tmpDir('plugin');
  fs.cpSync(path.join(PLUGIN, 'scaffold'), path.join(plugin, 'scaffold'), { recursive: true });
  fs.cpSync(path.join(PLUGIN, 'templates'), path.join(plugin, 'templates'), { recursive: true });
  const model = path.join(plugin, ...MODEL_DIR.split('/'));
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0xfe, 0x80, 0x0a]);
  fs.writeFileSync(path.join(model, 'system-guide', 'diagram.png'), png);
  const script = path.join(model, 'tests', 'run-checks.sh');
  fs.writeFileSync(script, '#!/bin/sh\necho checks\n');
  fs.chmodSync(script, 0o755);
  const m = buildManifest(plugin);
  const image = m.files.find((e) => e.target === 'system-guide/diagram.png');
  assert.equal(image.binary, true);
  assert.equal(image.template, false);
  assert.equal(m.files.find((e) => e.target === 'tests/run-checks.sh').execBits, 0o111);

  const dir = tmpDir('binary');
  const cfg = config();
  const go = (mode) => {
    const plan = planManifest({ root: dir, mainRoot: dir, config: cfg }, { mode, env: ENV, pluginRoot: plugin });
    const applied = applyPlan(plan);
    cfg.installed = plan.installed;
    return { plan, written: applied.written.map((w) => w.target) };
  };
  go('init');
  const installedImage = path.join(dir, 'system-guide', 'diagram.png');
  assert.ok(fs.readFileSync(installedImage).equals(png), 'the image is installed byte for byte');
  assert.match(cfg.installed['system-guide/diagram.png'], /^[0-9a-f]{64}$/);
  assert.equal(fs.statSync(path.join(dir, 'tests', 'run-checks.sh')).mode & 0o111, 0o111, 'the script is executable');
  assert.equal(fs.statSync(path.join(dir, 'README.md')).mode & 0o111, 0, 'a plain model file is not');

  // A second run writes nothing.
  const again = planManifest({ root: dir, mainRoot: dir, config: cfg }, { mode: 'sync', env: ENV, pluginRoot: plugin });
  assert.equal(again.targets.find((t) => t.target === 'system-guide/diagram.png').action, 'same');
  assert.equal(planWrites(again), false);

  // A new image in the model replaces an unchanged one; an image the project changed is kept.
  const png2 = Buffer.concat([png, Buffer.from([0x01, 0xff])]);
  fs.writeFileSync(path.join(model, 'system-guide', 'diagram.png'), png2);
  assert.deepEqual(go('sync').written, ['system-guide/diagram.png']);
  assert.ok(fs.readFileSync(installedImage).equals(png2));
  const mine = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
  fs.writeFileSync(installedImage, mine);
  fs.writeFileSync(path.join(model, 'system-guide', 'diagram.png'), png);
  const r = go('sync');
  assert.deepEqual(r.written, []);
  assert.equal(r.plan.targets.find((t) => t.target === 'system-guide/diagram.png').action, 'changed');
  assert.ok(fs.readFileSync(installedImage).equals(mine));

  // A file that is not text can only be copied: a generated (seed) file, for example, stops the plan.
  fs.writeFileSync(path.join(model, '.memory', 'MEMORY.md'), png);
  assert.throws(() => planManifest({ root: tmpDir('binary-seed'), config: config() }, { mode: 'init', env: ENV, pluginRoot: plugin }), /\.memory\/MEMORY\.md is not UTF-8 text/);
});

test('a plugin copy that lost model files stops the install before anything is written', () => {
  // The Git-ignored .memory/ and .work-items/ templates are missing, as in a
  // clone made before they were tracked with git add -f.
  const plugin = tmpDir('plugin-partial');
  fs.cpSync(path.join(PLUGIN, 'scaffold'), path.join(plugin, 'scaffold'), { recursive: true });
  fs.cpSync(path.join(PLUGIN, 'templates'), path.join(plugin, 'templates'), { recursive: true });
  fs.rmSync(path.join(plugin, MODEL_DIR, '.memory'), { recursive: true });
  fs.rmSync(path.join(plugin, MODEL_DIR, '.work-items'), { recursive: true });
  const dir = tmpDir('partial');
  assert.throws(() => planManifest({ root: dir, mainRoot: dir, config: config() }, { mode: 'init', env: ENV, pluginRoot: plugin }),
    (e) => /model copy \(scaffold\/model\/\) is incomplete/.test(e.message) && /\.work-items\/\*\* matches no file/.test(e.message) && /Reinstall/.test(e.details.fix));
  assert.deepEqual(fs.readdirSync(dir), []);
});

test('sync keeps the owner\'s settings, and a span rebuild does not mark AGENTS.md as changed', () => {
  const dir = tmpDir('sync');
  const cfg = config({ salesforce: true });
  run(cfg, dir);
  const settingsPath = path.join(dir, '.claude/settings.json');
  const settings = JSON.parse(read(settingsPath));
  settings.enabledPlugins['session-skills@toolkit-v2'] = false;
  const askBefore = settings.permissions.ask || [];
  assert.ok(askBefore.length > 0, 'the settings have ask rules');
  const removed = askBefore[0];
  settings.permissions.ask = askBefore.slice(1);
  fs.writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
  const r1 = run(cfg, dir, { mode: 'sync' });
  const after1 = JSON.parse(read(settingsPath));
  assert.equal(after1.enabledPlugins['session-skills@toolkit-v2'], false);
  assert.ok(!after1.permissions.ask.includes(removed));
  assert.ok(r1.changedByProject.includes('.claude/settings.json'));
  // A new rule changes the span; AGENTS.md still counts as unchanged.
  fs.writeFileSync(path.join(dir, '.claude/rules/zz-new-rule.md'), '# A New Rule\n\nText.\n');
  const r2 = run(cfg, dir, { mode: 'sync' });
  assert.match(read(path.join(dir, 'AGENTS.md')), /`\.claude\/rules\/zz-new-rule\.md`: A New Rule/);
  assert.ok(!r2.changedByProject.includes('AGENTS.md'));
  // An owner edit outside the span: kept, span still rebuilt, and now changed by the project.
  const agentsPath = path.join(dir, 'AGENTS.md');
  const text = read(agentsPath);
  const heading = (/^## .+$/m.exec(text) || [])[0];
  assert.ok(heading, 'AGENTS.md has a second-level heading');
  fs.writeFileSync(agentsPath, text.replace(heading, `${heading}\n\nOwner line.`));
  fs.rmSync(path.join(dir, '.claude/rules/zz-new-rule.md'));
  const r3 = run(cfg, dir, { mode: 'sync' });
  const agents = read(agentsPath);
  assert.ok(agents.includes('Owner line.') && !agents.includes('zz-new-rule'));
  assert.ok(r3.changedByProject.includes('AGENTS.md'));
});

test('generated files are installed from the model when missing and never replaced or recorded', () => {
  const dir = tmpDir('seed');
  const cfg = config();
  run(cfg, dir);
  const index = path.join(dir, 'ai-external-knowledge/INDEX.md');
  assert.equal(read(index), read(path.join(MODEL, 'ai-external-knowledge/INDEX.md')));
  assert.equal(cfg.installed['ai-external-knowledge/INDEX.md'], undefined);
  assert.equal(cfg.installed['.memory/MEMORY.md'], undefined);
  fs.writeFileSync(index, '# Rebuilt by a toolkit command\n');
  const r = run(cfg, dir, { mode: 'sync' });
  assert.equal(read(index), '# Rebuilt by a toolkit command\n');
  assert.ok(!r.changedByProject.includes('ai-external-knowledge/INDEX.md'));
  fs.rmSync(index);
  run(cfg, dir, { mode: 'sync' });
  assert.equal(read(index), read(path.join(MODEL, 'ai-external-knowledge/INDEX.md')), 'a missing generated file comes back');
});
