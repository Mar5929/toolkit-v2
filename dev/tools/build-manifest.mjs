// Builds plugins/toolkit/scaffold/MANIFEST.json from the files on disk.
// Run from anywhere: node dev/tools/build-manifest.mjs
//   --check   write nothing; exit 1 when MANIFEST.json is not what this tool writes.
// Rules for every field: plugins/toolkit/templates/TEMPLATE-LANGUAGE.md.
// Adding a scaffold or template file: add it here when it needs a condition,
// host, mode, or template flag other than the defaults, then run this tool.
// plugins/toolkit/tests/scaffold/render.test.mjs checks the result.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../plugins/toolkit');
const CHECK = process.argv.includes('--check');
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
}).sort();
const rel = (p) => relative(ROOT, p);

const files = [];
const add = (source, target, { condition = 'always', template = false, mode = 'copy', host } = {}) => {
  const e = { source, target, condition, template, mode };
  if (host) e.host = host;
  files.push(e);
};

// ---- base scaffold
const BASE = join(ROOT, 'scaffold/base');
const baseTemplates = new Set(['README.md', 'PROJECT.md', '.claude/rules/work-item-folders.md']);
const baseConditions = { '.claude/rules/work-item-folders.md': 'tracker:local' };
for (const p of walk(BASE)) {
  const t = relative(BASE, p);
  if (t === '.gitignore') { add(rel(p), '.gitignore', { mode: 'append' }); continue; }
  add(rel(p), t, { condition: baseConditions[t] || 'always', template: baseTemplates.has(t) });
}

// ---- templates installed into every project
add('templates/AGENTS.md.tmpl', 'AGENTS.md', { template: true, mode: 'agents-md' });
add('templates/settings/claude-base.json', '.claude/settings.json', { mode: 'merge-json', host: 'claude-code' });
add('templates/output-styles/plain-english.md', '.claude/output-styles/plain-english.md', { host: 'claude-code' });
add('templates/codex/config-base.toml', '.codex/config.toml', { template: true, mode: 'merge-toml', host: 'codex' });
add('templates/codex/toolkit.rules', '.codex/rules/toolkit.rules', { host: 'codex' });

// ---- tracker and memory choices
add('templates/WORK-ITEM.md', '.work-items/work-item-template/WORK-ITEM.md', { condition: 'tracker:local' });
add('templates/DESIGN.md', '.work-items/work-item-template/DESIGN.md', { condition: 'tracker:local' });
add('templates/memory/AGENTS.md', '.memory/AGENTS.md', { condition: 'memory:builtin' });
add('templates/memory/CURRENT_FOCUS.md', '.memory/CURRENT_FOCUS.md', { condition: 'memory:builtin', template: true });
add('templates/memory/terminology-glossary.md', '.memory/terminology-glossary.md', { condition: 'memory:builtin' });
add('templates/memory/memory-criteria.md', '.memory/memory-criteria.md', { condition: 'memory:builtin' });

// ---- Salesforce overlay
const SF = join(ROOT, 'scaffold/salesforce');
const sfTemplates = new Set(['sfdx-project.json']);
for (const p of walk(SF)) {
  const t = relative(SF, p);
  if (t === '.gitignore') { add(rel(p), '.gitignore', { condition: 'salesforce', mode: 'append' }); continue; }
  const m = /^skills\/([^/]+)\/(.+)$/.exec(t);
  if (m) {
    add(rel(p), `.claude/skills/${m[1]}/${m[2]}`, { condition: 'salesforce', host: 'claude-code' });
    add(rel(p), `.agents/skills/${m[1]}/${m[2]}`, { condition: 'salesforce', host: 'codex' });
    continue;
  }
  add(rel(p), t, { condition: 'salesforce', template: sfTemplates.has(t) });
}
add('templates/settings/claude-salesforce.json', '.claude/settings.json', { condition: 'salesforce', mode: 'merge-json', host: 'claude-code' });
add('templates/codex/hooks-salesforce.json', '.codex/hooks.json', { condition: 'salesforce', mode: 'merge-json', host: 'codex' });

const manifest = {
  schema: 1,
  description: 'Every file toolkit init installs. Paths in "source" are relative to plugins/toolkit/. Entries run in order. Rules for "condition", "host", "template", "mode", "generated", "state", and "runtime": templates/TEMPLATE-LANGUAGE.md. Rebuild with node dev/tools/build-manifest.mjs.',
  conditions: ['always', 'salesforce', 'tracker:local', 'memory:builtin', 'memory:hindsight', 'memory:notion'],
  hosts: ['claude-code', 'codex'],
  modes: ['copy', 'agents-md', 'append', 'merge-json', 'merge-toml'],
  files,
  directories: [
    { target: 'force-app', condition: 'salesforce' },
    { target: 'delivery/meeting-notes', condition: 'salesforce' },
    { target: 'delivery/deliverables', condition: 'salesforce' },
  ],
  generated: [
    { target: 'AGENTS.md', span: 'toolkit:rules', by: 'toolkit init, toolkit sync', condition: 'always', from: '.claude/rules/*.md' },
    { target: '.toolkit.json', by: 'toolkit init (written last)', condition: 'always' },
    { target: 'ai-external-knowledge/INDEX.md', by: 'toolkit index knowledge', condition: 'always', note: 'Installed as a seed, then regenerated; never edited by hand.' },
    { target: '.work-items/DASHBOARD.md', by: 'toolkit work sync', condition: 'tracker:local', runAtInit: true },
    { target: '.memory/MEMORY.md', by: 'toolkit memory reindex', condition: 'memory:builtin', runAtInit: true },
  ],
  state: [
    { target: '.work-items/.toolkit-state.json', by: 'toolkit work', condition: 'tracker:local', note: 'State, not generated: the ID-to-path map and the highest ID used. toolkit export includes it. Never edited by hand.' },
    { target: '.work-items/.lock', by: 'toolkit work', condition: 'tracker:local', note: 'Held only while a command runs.' },
    { target: '.memory/.lock', by: 'toolkit memory', condition: 'memory:builtin', note: 'Held only while a command runs.' },
    { target: '.toolkit-decisions.lock', by: 'toolkit decision add', condition: 'always', note: 'Held only while a command runs. Listed in .gitignore.' },
  ],
  runtime: [
    { source: 'templates/WORK-ITEM.md', usedBy: 'toolkit work new when .work-items/work-item-template/ is missing; the Notion page body; the GitHub and Jira written instructions', condition: 'always' },
    { source: 'templates/DESIGN.md', usedBy: 'toolkit work design --create when the project copy is missing; the Notion "Solution Design" subpage', condition: 'always' },
    { source: 'templates/memory/CURRENT_FOCUS.md', usedBy: 'toolkit notion ensure-project: the first text of the Current focus page', condition: 'memory:notion' },
    { source: 'templates/memory/terminology-glossary.md', usedBy: 'toolkit notion ensure-project: the first text of the Terminology glossary page', condition: 'memory:notion' },
    { source: 'templates/memory/topic-template.md', usedBy: 'no command reads it: a reference copy of one stored memory record (the frontmatter toolkit memory save writes, and the body sections the memory-save skill asks for)', condition: 'always' },
    { source: 'templates/hindsight/local.toolkit-v2.hindsight.plist.tmpl', usedBy: 'toolkit hindsight service install: writes ~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist with {{HOME}} filled in', condition: 'memory:hindsight' },
    { source: 'templates/TEMPLATE-LANGUAGE.md', usedBy: 'documentation for init, sync, and doctor', condition: 'always' },
  ],
};
const target = join(ROOT, 'scaffold/MANIFEST.json');
const text = `${JSON.stringify(manifest, null, 2)}\n`;
let current = null;
try {
  current = readFileSync(target, 'utf8');
} catch {
  current = null;
}
if (CHECK) {
  if (current === text) {
    console.log(`MANIFEST.json is up to date (${files.length} files).`);
  } else {
    console.log('MANIFEST.json is out of date. Run: node dev/tools/build-manifest.mjs');
    process.exitCode = 1;
  }
} else if (current === text) {
  console.log(`MANIFEST.json was already up to date (${files.length} files).`);
} else {
  writeFileSync(target, text);
  console.log(`Wrote MANIFEST.json (${files.length} files).`);
}
