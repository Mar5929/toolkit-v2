// Scaffold checks: scaffold/MANIFEST.json against the files on disk, and what
// the install engine (lib/project/manifest.mjs, the code behind toolkit init
// and toolkit sync) writes for every tracker x memory x Salesforce setup, for
// each host, when an existing repository is adopted, after a setup change, and
// after the owner edits files. Rules: templates/TEMPLATE-LANGUAGE.md.
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
import { parse as fmParse } from '../../lib/core/frontmatter.mjs';
import { planManifest, applyPlan, planSummary, loadManifest, projectHosts, readHosts } from '../../lib/project/manifest.mjs';
import { renderTemplate, TOKENS } from '../../lib/project/render.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN = path.resolve(HERE, '..', '..');
const manifest = loadManifest(PLUGIN);
const TODAY = '2026-09-26';

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
    proposals: s.proposals,
    conflicts: s.conflicts,
    notReflected: plan.notReflected,
  };
}

const rel = (dir) => walk(dir).map((f) => path.relative(dir, f));

// ------------------------------------------------------------------ checks

const SETUPS = [];
for (const tracker of ['local', 'notion', 'github', 'jira']) {
  for (const memory of ['builtin', 'hindsight', 'notion']) {
    for (const salesforce of [false, true]) SETUPS.push({ tracker, memory, salesforce });
  }
}
const STALE = /Second Brain|\bV1\b|issue 419|#419|memory-curator|toolkit-manual|RULES\.md|memory\.py|\.toolkit-memory|knowledge\/memory\//;
const SALESFORCE_WORDS = /salesforce|sfdx|force-app|\bsf /i;
// Files that name Salesforce plugins only to switch them on or off.
const SWITCH_FILES = new Set(['.codex/config.toml', '.claude/settings.json']);
const TOKEN_OR_MARKER = new RegExp(`\\{\\{(${TOKENS.map((t) => t.replace('.', '\\.')).join('|')})\\}\\}|<!-- if `);

test('MANIFEST.json lists every scaffold and template file, and nothing else', () => {
  const onDisk = [...walk(path.join(PLUGIN, 'scaffold')), ...walk(path.join(PLUGIN, 'templates'))]
    .map((p) => path.relative(PLUGIN, p)).filter((p) => p !== path.join('scaffold', 'MANIFEST.json'));
  const listed = new Set([...manifest.files.map((e) => e.source), ...manifest.runtime.map((e) => e.source)]);
  assert.deepEqual(onDisk.filter((p) => !listed.has(p)), [], 'files on disk that MANIFEST.json does not list');
  assert.deepEqual([...listed].filter((p) => !fs.existsSync(path.join(PLUGIN, p))), [], 'listed files that do not exist');
  for (const e of manifest.files) {
    assert.ok(manifest.conditions.includes(e.condition), `${e.source}: condition ${e.condition}`);
    assert.ok(manifest.modes.includes(e.mode), `${e.source}: mode ${e.mode}`);
    if (e.host) assert.ok(manifest.hosts.includes(e.host), `${e.source}: host ${e.host}`);
    const hasToken = TOKEN_OR_MARKER.test(read(path.join(PLUGIN, e.source)));
    assert.equal(e.template, hasToken, `${e.source}: template flag ${e.template}, tokens or markers ${hasToken}`);
  }
  const seen = new Set();
  for (const e of manifest.files) {
    const k = `${e.target}|${e.condition}|${e.host || ''}`;
    assert.ok(!seen.has(k), `two entries for ${k}`);
    seen.add(k);
  }
  assert.match(manifest.description, /Rebuild with node dev\/tools\/build-manifest\.mjs\./);
});

test('host-specific targets carry a host: .claude/settings, output styles, and skills for Claude Code; .codex/ and .agents/ for Codex', () => {
  for (const e of manifest.files) {
    if (e.target.startsWith('.codex/') || e.target.startsWith('.agents/')) assert.equal(e.host, 'codex', e.target);
    if (e.target === '.claude/settings.json' || e.target.startsWith('.claude/output-styles/') || e.target.startsWith('.claude/skills/')) assert.equal(e.host, 'claude-code', e.target);
  }
});

test('every SKILL.md and rule has frontmatter a strict YAML parser accepts', { skip: !hasPython('yaml') && 'PyYAML is not installed' }, () => {
  const bySource = new Map(manifest.files.map((e) => [e.source, e]));
  const files = walk(path.join(PLUGIN, 'scaffold')).filter((p) => p.endsWith('SKILL.md') || p.includes(`${path.sep}.claude${path.sep}rules${path.sep}`));
  assert.ok(files.length > 10);
  for (const f of files) {
    const entry = bySource.get(path.relative(PLUGIN, f));
    const text = entry && entry.template ? renderTemplate(read(f), config({ salesforce: true }), { file: f, today: TODAY }) : read(f);
    const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (!m) continue;
    const res = python('import sys,yaml; yaml.safe_load(sys.argv[1])', m[1]);
    assert.notEqual(res.ok, false, `${path.relative(PLUGIN, f)}: ${res.message}`);
  }
});

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
    assert.ok(lines <= 120, `AGENTS.md has ${lines} lines`);
    assert.ok(!/<[^>\n!]+>/.test(agents.replace(/<!-- toolkit:rules:(start|end) -->/g, '')), 'AGENTS.md holds a placeholder');
    if (setup.tracker === 'github') assert.ok(agents.includes('`#12`') && !agents.includes('WI-0'));
    if (setup.tracker === 'jira') assert.ok(agents.includes('Jira key') && !agents.includes('WI-0'));
    if (['local', 'notion'].includes(setup.tracker)) assert.ok(agents.includes('`WI-001`'));
    if (setup.memory === 'hindsight') assert.ok(agents.includes('memory bank `acme-crm`'));
    for (const f of files) {
      assert.ok(!/(^|\/)CLAUDE(\.local)?\.md$/.test(f), `CLAUDE file ${f}`);
      const text = read(path.join(dir, f));
      assert.ok(!STALE.test(text), `stale name in ${f}: ${(STALE.exec(text) || [])[0]}`);
      if (/\.(py|cjs)$/.test(f)) continue;
      assert.ok(!/\{\{/.test(text), `token left in ${f}`);
      assert.ok(!/<!-- (if [^>]*|endif) -->/.test(text), `marker left in ${f}`);
      if (!setup.salesforce && !SWITCH_FILES.has(f)) assert.ok(!SALESFORCE_WORDS.test(text), `Salesforce wording in ${f}`);
    }
    JSON.parse(read(path.join(dir, '.claude/settings.json')));
    if (setup.salesforce) JSON.parse(read(path.join(dir, '.codex/hooks.json')));
    const toml = python('import tomllib,sys; tomllib.load(open(sys.argv[1],"rb"))', path.join(dir, '.codex/config.toml'));
    assert.notEqual(toml.ok, false, `.codex/config.toml: ${toml.message}`);
    const gi = read(path.join(dir, '.gitignore'));
    for (const need of ['/.work-items/', '/.memory/', '/.toolkit-cache/', '/.toolkit-decisions.lock']) assert.ok(gi.includes(need), `.gitignore lacks ${need}`);
    if (setup.salesforce) assert.ok(gi.includes('.sfdx/'));
    // The paths match every folder the publish-docs skill accepts; delivery/ is harmless without Salesforce.
    const kdc = fmParse(read(path.join(dir, '.claude/rules/knowledge-direct-commit.md'))).data.paths;
    for (const p of ['requirements/**', 'docs/**', 'ai-external-knowledge/**', 'delivery/**', 'DECISIONS.md', 'PROJECT.md', 'PROJECT-ROADMAP.md', '**/README.md']) assert.ok(kdc.includes(p), `knowledge-direct-commit.md paths lack ${p}`);
  });
}

test('hosts: a Claude-only project gets no .codex/ or .agents/, a Codex-only project no Claude settings, and no hosts means both', () => {
  const a = tmpDir('claude-only');
  const ca = config({ salesforce: true, hosts: ['claude-code'] });
  run(ca, a);
  assert.ok(fs.existsSync(path.join(a, '.claude/settings.json')));
  assert.ok(fs.existsSync(path.join(a, '.claude/skills/sf-deploy-check/SKILL.md')));
  assert.ok(!fs.existsSync(path.join(a, '.codex')) && !fs.existsSync(path.join(a, '.agents')));
  // A later sync keeps it that way.
  run(ca, a, { mode: 'sync' });
  assert.ok(!fs.existsSync(path.join(a, '.codex')) && !fs.existsSync(path.join(a, '.agents')));

  const b = tmpDir('codex-only');
  run(config({ salesforce: true, hosts: ['codex'] }), b);
  assert.ok(fs.existsSync(path.join(b, '.codex/config.toml')) && fs.existsSync(path.join(b, '.agents/skills/sf-data-change/SKILL.md')));
  assert.ok(!fs.existsSync(path.join(b, '.claude/settings.json')) && !fs.existsSync(path.join(b, '.claude/output-styles')) && !fs.existsSync(path.join(b, '.claude/skills')));
  // Codex needs these too: its hooks run the same guard scripts, and AGENTS.md lists the rules.
  assert.ok(fs.existsSync(path.join(b, '.claude/hooks/guard-protected-orgs.cjs')), 'the Codex guards run the .claude/hooks scripts');
  assert.ok(fs.existsSync(path.join(b, '.claude/rules/work-item-stages.md')));

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

test('adopting a repository: AGENTS.md is kept with a proposal, config.toml and .gitignore are merged', () => {
  const dir = tmpDir('adopt');
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Old manual\n\nOpen the work skill.\n');
  fs.mkdirSync(path.join(dir, '.codex'));
  fs.writeFileSync(path.join(dir, '.codex/config.toml'), 'model = "gpt-5"\n\n[features]\nweb_search = true\n');
  fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules/\n*.log\n');
  const cfg = config();
  const report = run(cfg, dir);
  assert.equal(read(path.join(dir, 'AGENTS.md')), '# Old manual\n\nOpen the work skill.\n');
  assert.equal(report.proposals.length, 1);
  const proposal = read(path.join(dir, '.toolkit-cache/AGENTS.proposed.md'));
  assert.ok(proposal.includes('# Acme CRM') && proposal.includes('`.claude/rules/work-item-stages.md`'));
  const toml = read(path.join(dir, '.codex/config.toml'));
  assert.ok(toml.startsWith('model = "gpt-5"'));
  assert.match(toml, /\[plugins\."toolkit@toolkit-v2"\]\nenabled = true/);
  assert.match(toml, /\[features\]\nweb_search = true/);
  assert.equal((toml.match(/\[plugins\."toolkit@toolkit-v2"\]/g) || []).length, 1);
  const parsed = python('import tomllib,sys; d=tomllib.load(open(sys.argv[1],"rb")); assert d["plugins"]["work@toolkit-v2"]["enabled"] is True; assert d["features"]["web_search"] is True', path.join(dir, '.codex/config.toml'));
  assert.notEqual(parsed.ok, false, parsed.message);
  const gi = read(path.join(dir, '.gitignore'));
  assert.ok(gi.startsWith('node_modules/\n*.log\n\n'));
  assert.equal((gi.match(/^\*\.log$/gm) || []).length, 1, '*.log is not added twice');
  assert.ok(gi.includes('/.work-items/'));
  // A dotted key for a V2 plugin is a conflict: the file is left alone.
  const other = tmpDir('adopt-dotted');
  fs.mkdirSync(path.join(other, '.codex'));
  const dotted = 'plugins."toolkit@toolkit-v2".enabled = false\n';
  fs.writeFileSync(path.join(other, '.codex/config.toml'), dotted);
  const r2 = run(config(), other);
  assert.equal(read(path.join(other, '.codex/config.toml')), dotted);
  assert.equal(r2.conflicts.length, 1);
});

test('setup change: a new id prefix re-renders unchanged files only', () => {
  const dir = tmpDir('prefix');
  const cfg = config();
  run(cfg, dir);
  assert.ok(read(path.join(dir, 'AGENTS.md')).includes('`WI-001`'));
  cfg.tracker.idPrefix = 'ACME';
  const report = run(cfg, dir, { mode: 'sync' });
  assert.ok(read(path.join(dir, 'AGENTS.md')).includes('`ACME-001`'));
  assert.ok(read(path.join(dir, '.claude/rules/work-item-folders.md')).includes('`ACME-001`'));
  assert.ok(report.written.includes('AGENTS.md'));
  // The owner edits the rule; the next prefix change leaves it alone and names it.
  const rule = path.join(dir, '.claude/rules/work-item-folders.md');
  fs.appendFileSync(rule, '\n- Owner note.\n');
  cfg.tracker.idPrefix = 'AC';
  const r2 = run(cfg, dir, { mode: 'sync', changedSettings: [{ key: 'tracker.idPrefix', from: 'ACME', to: 'AC' }] });
  assert.ok(read(rule).includes('ACME-001') && read(rule).includes('Owner note.'));
  assert.ok(r2.changedByProject.includes('.claude/rules/work-item-folders.md'));
  assert.ok(r2.notReflected.some((n) => n.includes('.claude/rules/work-item-folders.md')), JSON.stringify(r2.notReflected));
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
