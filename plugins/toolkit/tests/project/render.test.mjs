// The template language (templates/TEMPLATE-LANGUAGE.md) and the TOML merge,
// checked piece by piece.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { renderTemplate, renderMarkers, buildSpan, fillSpan, hashText, spanBody, keysReadBy, SPAN_START, SPAN_END } from '../../lib/project/render.mjs';
import { buildManifest, renderModelFile, applyFills, applyJsonRemove, applyLineRemove, applyRemovals } from '../../lib/project/model-scaffold.mjs';
import { mergeToml, tomlGet, parseKeyPath } from '../../lib/project/toml.mjs';
import { appendText, mergeJson, jsonChanges } from '../../lib/project/manifest.mjs';
import { buildKnowledgeIndex } from '../../lib/project/knowledge-index.mjs';
import { PLUGIN_ROOT, tempDir } from './helpers.mjs';

const CFG = {
  project: { name: 'Acme CRM', key: 'acme-crm', owner: 'Mike' },
  tracker: { type: 'local', idPrefix: 'WI' },
  memory: { type: 'builtin' },
  salesforce: { enabled: false },
};

test('tokens are replaced and conditional blocks kept or dropped', () => {
  const src = '# {{project.name}}\n\n<!-- if salesforce -->\nSF only\n<!-- endif -->\n<!-- if not salesforce -->\nNot SF, key {{project.key}}\n<!-- endif -->\n<!-- if tracker=local -->\nIDs {{tracker.idPrefix}}-12\n<!-- endif -->\n\n\n\nEnd {{today}}\n';
  const out = renderTemplate(src, CFG, { file: 't.md', today: '2026-09-26' });
  assert.equal(out, '# Acme CRM\n\nNot SF, key acme-crm\nIDs WI-12\n\nEnd 2026-09-26\n');
  const sf = renderTemplate(src, { ...CFG, salesforce: { enabled: true } }, { today: 'x' });
  assert.match(sf, /SF only/);
  assert.doesNotMatch(sf, /Not SF/);
});

test('{{hindsight.bank}} is the bank init chose, or the project key before one is chosen', () => {
  assert.equal(renderTemplate('bank {{hindsight.bank}}\n', CFG), 'bank acme-crm\n');
  assert.equal(renderTemplate('bank {{hindsight.bank}}\n', { ...CFG, hindsight: { bank: 'acme-crm-2' } }), 'bank acme-crm-2\n');
  assert.ok(keysReadBy('{{hindsight.bank}}').has('hindsight.bank'));
});

test('template errors name the file and line and stop the render', () => {
  assert.throws(() => renderTemplate('a\n{{project.nope}}\n', CFG, { file: 'x.md' }), (e) => e.code === 2 && /x\.md, line 2/.test(e.message) && /\{\{project\.nope\}\}/.test(e.message));
  assert.throws(() => renderTemplate('{{ project.name }}\n', CFG, { file: 'x.md' }), /unknown token/);
  assert.throws(() => renderTemplate('<!-- if salesforce -->\n<!-- if tracker=local -->\n<!-- endif -->\n', CFG, { file: 'x.md' }), /inside the block/);
  assert.throws(() => renderTemplate('<!-- endif -->\n', CFG, { file: 'x.md' }), /endif with no open block/);
  assert.throws(() => renderTemplate('<!-- if salesforce -->\nx\n', CFG, { file: 'x.md' }), /never closed/);
  assert.throws(() => renderTemplate('<!-- if moon -->\nx\n<!-- endif -->\n', CFG, { file: 'x.md' }), /unknown condition "moon"/);
});

test('other HTML comments are ordinary text and CRLF files keep their line endings', () => {
  assert.equal(renderTemplate('<!-- guidance -->\nx\n', CFG), '<!-- guidance -->\nx\n');
  assert.equal(renderTemplate('a\r\n\r\n\r\nb\r\n', CFG), 'a\r\n\r\nb\r\n');
});

test('every model file and toolkit template renders for all 24 setups without leftover markers', () => {
  const { files, conditions } = buildManifest(PLUGIN_ROOT);
  const templates = files.filter((f) => f.template);
  assert.ok(templates.some((t) => t.target === 'AGENTS.md') && templates.some((t) => t.target === 'README.md') && templates.some((t) => t.target === 'PROJECT.md'));
  let renders = 0;
  for (const tracker of ['local', 'notion', 'github', 'jira']) {
    for (const memory of ['builtin', 'hindsight', 'notion']) {
      for (const salesforce of [false, true]) {
        const cfg = { ...CFG, tracker: { type: tracker, idPrefix: 'WI' }, memory: { type: memory }, salesforce: { enabled: salesforce } };
        for (const t of templates) {
          const text = fs.readFileSync(path.join(PLUGIN_ROOT, t.source), 'utf8');
          const out = t.model ? renderModelFile(t, text, cfg, conditions).text : renderTemplate(text, cfg, { file: t.source, today: '2026-09-26' });
          assert.doesNotMatch(out, /^\s*<!-- (if .+|endif) -->\s*$/m, t.source);
          if (t.model) assert.doesNotMatch(out.split('\n').filter((l) => /^#{1,6} /.test(l)).join('\n'), /<Project name>/, `${t.source}: the name is filled in its headings`);
          renders++;
        }
      }
    }
  }
  assert.ok(renders >= 24 * 4);
});

test('renderMarkers changes nothing but the marker lines and the blocks that do not apply', () => {
  const src = 'a\n\n<!-- if salesforce -->\nSF\n<!-- endif -->\n<!-- if not salesforce -->\nplain {{project.name}}\n<!-- endif -->\n\n\n\nend';
  assert.equal(renderMarkers(src, CFG), 'a\n\nplain {{project.name}}\n\n\n\nend', 'tokens and blank lines stay as they are');
  assert.equal(renderMarkers('x\r\n<!-- if salesforce -->\r\ny\r\n<!-- endif -->\r\nz\r\n', CFG), 'x\r\nz\r\n');
  assert.throws(() => renderMarkers('<!-- if moon -->\nx\n<!-- endif -->\n', CFG, { file: 'm.md' }), (e) => e.code === 2 && /m\.md, line 1 has an unknown condition "moon"/.test(e.message));
  assert.throws(() => renderMarkers('<!-- if salesforce -->\n<!-- if tracker=local -->\n<!-- endif -->\n', CFG), /inside the block/);
});

test('the project name fills heading lines only', () => {
  const fills = [{ text: '<Project name>', value: 'project.name', lines: 'headings' }];
  assert.equal(applyFills('# <Project name>: guide\n\nreplace <Project name> here\n## <Project name>\n', fills, CFG), '# Acme CRM: guide\n\nreplace <Project name> here\n## Acme CRM\n');
});

test('the Salesforce removals: hooks and permission rules come out of the settings, lines out of .gitignore', () => {
  const settings = {
    hooks: {
      Stop: [{ hooks: [{ type: 'command', command: 'python3 tools/kb/graph_freshness_hook.py' }] }],
      PreToolUse: [{ matcher: 'Bash', hooks: [{ command: 'node guard-protected-orgs.cjs' }, { command: 'node mine.js' }] }],
    },
    permissions: { deny: ['Bash(git add -A)', 'Bash(sf org delete *)'], ask: ['Bash(sf apex run *)'] },
  };
  const rule = { hookCommandContains: ['guard-protected-orgs.cjs', 'tools/kb/graph_freshness_hook.py'], values: { 'permissions.deny': ['Bash(sf org delete *)'], 'permissions.ask': ['Bash(sf apex run *)'] } };
  const r = applyJsonRemove(settings, rule);
  assert.equal(r.changed, true);
  assert.deepEqual(r.data, { hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ command: 'node mine.js' }] }] }, permissions: { deny: ['Bash(git add -A)'] } });
  assert.equal(r.noHooksLeft, false);
  assert.deepEqual(r.removed, [
    'remove the Stop hook "python3 tools/kb/graph_freshness_hook.py"',
    'remove the PreToolUse hook "node guard-protected-orgs.cjs"',
    'remove "Bash(sf org delete *)" from permissions.deny',
    'remove "Bash(sf apex run *)" from permissions.ask',
  ]);
  assert.equal(applyJsonRemove({ hooks: { PreToolUse: [{ hooks: [{ command: 'node guard-protected-orgs.cjs' }] }] } }, rule).noHooksLeft, true);
  assert.equal(applyLineRemove('.memory/\n.sfdx/\n*.log\n', { lines: ['.sfdx/'] }), '.memory/\n*.log\n');

  // The same rules on a project's own copy, only when the project is not a Salesforce project.
  const conditions = {
    jsonRemove: [{ path: '.claude/settings.json', unless: 'salesforce', ...rule }],
    lineRemove: [{ path: '.gitignore', unless: 'salesforce', lines: ['.sfdx/'] }],
  };
  const text = `${JSON.stringify(settings, null, 2)}\n`;
  const off = applyRemovals('.claude/settings.json', text, { salesforce: { enabled: false } }, conditions);
  assert.deepEqual(JSON.parse(off.text), r.data);
  assert.equal(off.removed.length, 4);
  assert.deepEqual(applyRemovals('.claude/settings.json', text, { salesforce: { enabled: true } }, conditions), { text, removed: [] });
  assert.deepEqual(applyRemovals('.gitignore', '.memory/\n.sfdx/\n', {}, conditions), { text: '.memory/\n', removed: ['remove the line ".sfdx/"'] });
  assert.deepEqual(applyRemovals('.claude/settings.json', '{ not json', {}, conditions), { text: '{ not json', removed: [] }, 'a file that is not JSON is left for the merge to report');
});

test('the rules span has the exact TEMPLATE-LANGUAGE format', () => {
  const rules = [
    { name: 'offer-context-handoff.md', text: '# Offer a Handoff Before Heavy Work in a Long Session\n\nx\n' },
    { name: 'knowledge-direct-commit.md', text: '---\npaths:\n  - "requirements/**"\n  - "PROJECT-ROADMAP.md"\n  - "PROJECT.md"\n---\n# Knowledge\n' },
    { name: 'ai-external-knowledge.md', text: '---\npaths:\n  - "ai-external-knowledge/**"\n---\n# Outside\n' },
    { name: 'humanize-outbound-text.md', text: '# Humanize Anything Sent to Another Person\n' },
  ];
  const expected = [
    'Always on. Claude Code loads these at session start. Codex: read each one at session start.',
    '- `.claude/rules/humanize-outbound-text.md`: Humanize Anything Sent to Another Person',
    '- `.claude/rules/offer-context-handoff.md`: Offer a Handoff Before Heavy Work in a Long Session',
    '',
    'Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.',
    '',
    '| Paths | Rule |',
    '| --- | --- |',
    '| `ai-external-knowledge/**` | `.claude/rules/ai-external-knowledge.md` |',
    '| `requirements/**`, `PROJECT-ROADMAP.md`, `PROJECT.md` | `.claude/rules/knowledge-direct-commit.md` |',
  ].join('\n');
  assert.equal(buildSpan(rules), expected);
  assert.equal(buildSpan(rules.filter((r) => !r.text.startsWith('---'))).includes('Path-scoped'), false);
  assert.equal(buildSpan(rules.filter((r) => r.text.startsWith('---'))).startsWith('Path-scoped'), true);
});

test('fillSpan replaces only the lines between the markers, and the hash ignores them', () => {
  const doc = `# Title\n\nMine\n${SPAN_START}\n(old)\n${SPAN_END}\n\nMore\n`;
  const filled = fillSpan(doc, 'new line 1\nnew line 2');
  assert.equal(filled, `# Title\n\nMine\n${SPAN_START}\nnew line 1\nnew line 2\n${SPAN_END}\n\nMore\n`);
  assert.equal(spanBody(filled), 'new line 1\nnew line 2');
  assert.equal(hashText('AGENTS.md', doc), hashText('AGENTS.md', filled));
  assert.notEqual(hashText('AGENTS.md', doc), hashText('AGENTS.md', doc.replace('Mine', 'Yours')));
  assert.equal(hashText('README.md', doc), doc);
  assert.equal(fillSpan('no markers\n', 'x'), 'no markers\n');
});

test('keysReadBy names the settings a template reads', () => {
  const keys = keysReadBy('{{project.name}} {{today}}\n<!-- if memory=hindsight -->\nx\n<!-- endif -->\n<!-- if salesforce -->\n<!-- endif -->\n');
  assert.deepEqual([...keys].sort(), ['memory.type', 'project.name', 'salesforce.enabled']);
});

test('append adds only missing non-blank lines after one blank line', () => {
  assert.equal(appendText(null, 'a\nb\n'), 'a\nb\n');
  assert.equal(appendText('x\na\n', 'a\nb\n'), 'x\na\n\nb\n');
  assert.equal(appendText('a\nb\n', 'a\n\nb\n'), 'a\nb\n');
  assert.equal(appendText('x\n\n\n', '\n# Head\n/one/\n\n/two/\n'), 'x\n\n# Head\n/one/\n\n/two/\n');
});

test('merge-json joins arrays, merges objects, and lets the source win for other values', () => {
  const merged = mergeJson({ a: 1, list: [1, 2], keep: true, o: { x: 1 } }, { a: 2, list: [2, 3], o: { y: 2 } });
  assert.deepEqual(merged, { a: 2, list: [1, 2, 3], keep: true, o: { x: 1, y: 2 } });
  const changes = jsonChanges({ a: 1, list: [1], keep: true }, merged);
  assert.deepEqual(changes.sort(), ['add 2 to list', 'add 3 to list', 'add o', 'set a to 2']);
});

test('merge-toml: a new file is the source; tables and keys are added or replaced', () => {
  const source = '# Top comment\n\n[plugins."toolkit@toolkit-v2"]\nenabled = true\n\n# Old one off\n[plugins."old@claude-toolkit"]\nenabled = false\n';
  assert.equal(mergeToml(null, source).text, source);
  const target = 'model = "x"\n\n[plugins."toolkit@toolkit-v2"]\nenabled = false\nnote = "mine"\n\n[other]\nk = 1\n';
  const r = mergeToml(target, source);
  assert.deepEqual(r.conflicts, []);
  assert.equal(tomlGet(r.text, ['plugins', 'toolkit@toolkit-v2', 'enabled']), true);
  assert.equal(tomlGet(r.text, ['plugins', 'toolkit@toolkit-v2', 'note']), 'mine');
  assert.equal(tomlGet(r.text, ['plugins', 'old@claude-toolkit', 'enabled']), false);
  assert.equal(tomlGet(r.text, ['other', 'k']), 1);
  assert.match(r.text, /# Old one off\n\[plugins\."old@claude-toolkit"\]/);
  assert.doesNotMatch(r.text, /# Top comment/);
  assert.deepEqual(r.replaced, ['plugins."toolkit@toolkit-v2".enabled']);
  const again = mergeToml(r.text, source);
  assert.equal(again.text, r.text);
  assert.equal(again.changed, false);
});

test('merge-toml leaves a file alone when a setting is defined another way', () => {
  const source = '[plugins."toolkit@toolkit-v2"]\nenabled = true\n';
  for (const target of [
    'plugins."toolkit@toolkit-v2".enabled = false\n',
    '[plugins]\n"toolkit@toolkit-v2" = { enabled = false }\n',
    'plugins = { "toolkit@toolkit-v2" = { enabled = true } }\n',
  ]) {
    const r = mergeToml(target, source);
    assert.equal(r.text, target, target);
    assert.equal(r.conflicts.length, 1, target);
  }
});

test('the TOML reader finds trust and inline-table values', () => {
  const text = 'a = 1\n[projects."/Users/me/app"]\ntrust_level = "trusted"\n\n[plugins]\n"x@y" = { enabled = false }\nnotify = [\n  "a",\n  "b",\n]\n';
  assert.equal(tomlGet(text, ['projects', '/Users/me/app', 'trust_level']), 'trusted');
  assert.equal(tomlGet(text, ['plugins', 'x@y', 'enabled']), false);
  assert.deepEqual(tomlGet(text, ['plugins', 'notify']), ['a', 'b']);
  assert.deepEqual(parseKeyPath('plugins."a.b@c".enabled'), ['plugins', 'a.b@c', 'enabled']);
});

test('the knowledge index with no topics is exactly the model\'s INDEX.md, and lists a topic from its SOURCE-RECORD.md', () => {
  const root = tempDir();
  fs.mkdirSync(path.join(root, 'ai-external-knowledge'), { recursive: true });
  const seed = fs.readFileSync(path.join(PLUGIN_ROOT, 'scaffold', 'model', 'ai-external-knowledge', 'INDEX.md'), 'utf8');
  assert.equal(buildKnowledgeIndex(root).text, seed, 'no INDEX.md yet: the model\'s text');
  fs.writeFileSync(path.join(root, 'ai-external-knowledge', 'INDEX.md'), seed);
  assert.equal(buildKnowledgeIndex(root).text, seed, 'no topics: the file stays as it is');
  fs.mkdirSync(path.join(root, 'ai-external-knowledge', 'stripe-api'));
  fs.writeFileSync(path.join(root, 'ai-external-knowledge', 'stripe-api', 'SOURCE-RECORD.md'), '# Stripe API reference\n\n- Publisher: Stripe.\n- Original documentation home: https://docs.stripe.com/api.\n- Captured on: 2026-09-20.\n\n## Project use\n\nRead before changing the billing code.\n');
  fs.mkdirSync(path.join(root, 'ai-external-knowledge', 'no-record'));
  const { text, topics } = buildKnowledgeIndex(root);
  assert.equal(topics.length, 2);
  assert.match(text, /\| \[stripe-api\/\]\(stripe-api\/\) \| Stripe: Stripe API reference \(https:\/\/docs\.stripe\.com\/api\) \| 2026-09-20 \| Read before changing the billing code\. \|/);
  assert.match(text, /\| \[no-record\/\]\(no-record\/\) \| No SOURCE-RECORD\.md yet \|/);
  assert.doesNotMatch(text, /<Link to an actual topic folder/, 'the placeholder row is replaced');
  const withoutTable = (t) => t.split('\n').filter((l) => !l.startsWith('| ')).join('\n');
  assert.equal(withoutTable(text), withoutTable(seed), 'the text around the table is the model\'s');
});
