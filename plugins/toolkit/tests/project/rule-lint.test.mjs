// Rule files follow Claude Code's guidance for rules (Mike, 2026-09-29,
// dev/GOAL.md "Rules follow Claude Code best practices"): the checks in
// lib/project/rule-lint.mjs, the owner-preferences.md format `toolkit rule
// add` writes, its size, vague, conflict, and section warnings and what it
// prints after an add, and the toolkit doctor check of a project's rules
// (lib/project/rule-checks.mjs).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk, PLUGIN_ROOT } from './helpers.mjs';
import {
  RULE_LIMITS, expandBraces, globMatches, globProblems, isVague, lintRule, lintRuleSet, lintText, namedSkills, parseRule, ruleSize,
} from '../../lib/project/rule-lint.mjs';
import { addEntry, newRuleText, parseRuleDoc, serializeRuleDoc, ruleChangeWarnings, similarSections } from '../../lib/project/owner-rules.mjs';
import { describeRule, readRules } from '../../lib/project/render.mjs';

after(cleanup);

const RULE = path.join('.claude', 'rules', 'owner-preferences.md');
const MODEL = path.join(PLUGIN_ROOT, 'scaffold', 'model');

const checks = (name, text, opts) => lintRule(parseRule(name, text), opts).map((f) => `${f.check}:${f.severity}`);

test('every model rule passes the rule checks, and no two model rules repeat or contradict each other', () => {
  const rules = readRules(MODEL).map((r) => parseRule(r.name, r.text));
  assert.ok(rules.length >= 18, 'the model has its rules');
  for (const r of rules) assert.deepEqual(lintRule(r).filter((f) => f.severity === 'error'), [], r.name);
  assert.deepEqual(lintRuleSet(rules), []);
  // The byte limit is a proposal waiting for Mike's yes, so only Claude Code's line target is asserted here.
  for (const r of rules.filter((x) => !x.scoped)) assert.ok(ruleSize(r).lines <= RULE_LIMITS.alwaysOnLines, `${r.name} is within the always-on line target`);
  // Wording: only session-handoff.md (Mike's approved paragraph, waiting for his answer) is over the length limit.
  assert.deepEqual([...new Set(rules.flatMap((r) => lintText(r)).map((f) => f.rule))], ['session-handoff.md']);
});

test('frontmatter: only paths, as a list, that parses; otherwise Claude Code loads the rule everywhere or ignores the field', () => {
  assert.deepEqual(checks('ok.md', '---\npaths:\n  - "src/**"\n---\n\n# Source\n\n- Run `npm test` after an edit.\n'), []);
  assert.deepEqual(checks('bad.md', '---\npaths:\n  - [\n---\n# X\n\n- Run `a`.\n'), ['frontmatter:error']);
  assert.deepEqual(checks('extra.md', '---\ndescription: x\n---\n# X\n\n- Run `a`.\n'), ['frontmatter:error', 'frontmatter:error']);
  assert.deepEqual(checks('string.md', '---\npaths: "src/**, lib/**"\n---\n# X\n\n- Run `a`.\n'), ['frontmatter:warning']);
  assert.deepEqual(checks('empty.md', '---\npaths: []\n---\n# X\n\n- Run `a`.\n'), ['frontmatter:error']);
});

test('globs: an unclosed "[" or "{", a leading "/", and too many brace patterns are refused; matching follows Claude Code', () => {
  assert.match(globProblems('photos [2024/**'), /no closing "\]"/);
  assert.equal(globProblems('photos \\[2024/**'), null);
  assert.match(globProblems('/src/**'), /relative to the project root/);
  assert.match(globProblems('src/*.{ts,tsx'), /no closing "\}"/);
  assert.deepEqual(expandBraces('src/*.{ts,tsx}'), ['src/*.ts', 'src/*.tsx']);
  assert.equal(expandBraces('{a,b}/{c,d}/*.{ts,tsx}').length, 8);
  const many = `---\npaths:\n  - "${Array.from({ length: 4 }, () => '{a,b,c,d,e,f}').join('/')}/x"\n---\n# X\n\n- Run \`a\`.\n`;
  assert.deepEqual(checks('many.md', many), ['glob:error'], '6^4 = 1,296 patterns is over the 1,000 budget');
  assert.equal(globMatches('*.md', 'README.md'), true);
  assert.equal(globMatches('*.md', 'docs/README.md'), false, '*.md is the project root only');
  assert.equal(globMatches('**/README.md', 'README.md'), true);
  assert.equal(globMatches('**/README.md', 'a/b/README.md'), true);
  assert.equal(globMatches('src/**/*.{ts,tsx}', 'src/x/y.tsx'), true);
  assert.equal(globMatches('force-app/**/permissionsets/**', 'force-app/main/default/permissionsets/A.xml'), true);
});

test('a rule needs a "# " heading and at least one specific instruction; a numbered procedure belongs in a skill', () => {
  assert.deepEqual(checks('noheading.md', 'Some words.\n\n- Use tabs in `src/`.\n'), ['heading:error']);
  assert.deepEqual(checks('narrative.md', '# History\n\nThe project was started in 2020 by a team.\n'), ['instruction:error']);
  assert.deepEqual(checks('vague.md', '# Style\n\n- Format code properly.\n- Be careful with tests.\n'), ['instruction:error']);
  assert.equal(isVague('Format code properly.'), true);
  assert.equal(isVague('Use 2-space indentation.'), false);
  assert.equal(isVague('Lead every status reply with the answer. (2026-09-29, Mike in chat)'), false);
  assert.deepEqual(checks('sentence.md', '# Handoff\n\nWhen the owner asks, use the `handoff` skill.\n'), [], 'an instruction may be a sentence');
  const steps = '# Release\n\n1. Open it.\n2. Edit it.\n3. Save it.\n4. Test it.\n5. Ship it.\n';
  assert.deepEqual(checks('steps.md', steps), ['procedure:error']);
  assert.deepEqual(checks('short.md', '# Release\n\n1. Open `a`.\n2. Edit `a`.\n3. Save `a`.\n4. Test `a`.\n'), [], 'four steps is not a procedure yet');
});

test('an always-on rule over 4,096 bytes is a warning (the number waits for Mike\'s yes); over 200 lines is an error; the same text with paths is neither', () => {
  const body = `# Big\n\n${Array.from({ length: 120 }, (_, i) => `- Run \`cmd${i}\` before the deploy of item number ${i}.`).join('\n')}\n`;
  assert.ok(Buffer.byteLength(body) > RULE_LIMITS.alwaysOnBytes);
  assert.deepEqual(checks('big.md', body), ['size:warning']);
  assert.deepEqual(checks('big.md', `---\npaths:\n  - "src/**"\n---\n${body}`), []);
  const long = `# Long\n\n${Array.from({ length: 210 }, (_, i) => `- Run \`c${i}\`.`).join('\n')}\n`;
  assert.ok(Buffer.byteLength(long) < RULE_LIMITS.alwaysOnBytes);
  assert.deepEqual(checks('long.md', long), ['size:error']);
});

test('wording: a list item or paragraph over 400 characters, a paragraph over three lines, and emphasis are warnings; code is not checked', () => {
  const text = (name, t) => lintText(parseRule(name, t)).map((f) => `${f.check}:${f.severity}:${f.line}`);
  const long = 'Run `npm test` before you commit. '.repeat(13).trim();
  assert.ok(long.length > RULE_LIMITS.textChars);
  assert.deepEqual(text('item.md', `# X\n\n- ${long}\n- Run \`a\`.\n`), ['length:warning:3']);
  assert.deepEqual(text('para.md', `# X\n\n${long}\n`), ['length:warning:3']);
  assert.deepEqual(text('wrapped.md', '# X\n\nRun `a` first.\nThen run `b`.\nThen run `c`.\nThen run `d`.\n'), ['length:warning:3']);
  assert.deepEqual(text('ok.md', '# X\n\nRun `a` first.\nThen run `b`.\nThen run `c`.\n\n- Deploy to UAT, then\n  to production.\n'), []);
  assert.deepEqual(text('caps.md', '# X\n\n- IMPORTANT: run `a`.\n- You MUST run `b`.\n- Run **only** `c`.\n- Read `NEVER.md` and README.md.\n'), ['emphasis:warning:3', 'emphasis:warning:4', 'emphasis:warning:5']);
  assert.deepEqual(text('fence.md', '# X\n\n```\nNEVER ' + 'x'.repeat(500) + '\n```\n\n- Run `a`.\n'), []);
  assert.deepEqual(namedSkills(parseRule('s.md', '# S\n\n- Open the `sf-deploy-check` skill, then the `handoff` skill.\n')).map((x) => x.name), ['sf-deploy-check', 'handoff']);
});

test('two rules that say the same thing, or one says always and the other never, are found', () => {
  const a = parseRule('a.md', '# A\n\n- Always force-push the release branch after tagging it.\n- Stage paths by name and read the full staged diff.\n');
  const b = parseRule('b.md', '# B\n\n- Never force-push the release branch after tagging it.\n- Stage paths by name and read the full staged diff.\n');
  const found = lintRuleSet([a, b]).map((f) => `${f.check}:${f.rule}:${f.line}`);
  assert.deepEqual(found.sort(), ['conflict:b.md:3', 'duplicate:b.md:4']);
  // Lines of one file are compared with each other only when asked (the owner's files).
  const one = parseRule('o.md', '# O\n\n## Git\n\n- Always force-push the release branch.\n\n## Other\n\n- Never force-push the release branch.\n');
  assert.deepEqual(lintRuleSet([one]), []);
  assert.deepEqual(lintRuleSet([one], { withinFile: ['o.md'] }).map((f) => f.check), ['conflict']);
});

test('a line that forbids a command in a code span and another that names it with no never are a possible contradiction (a warning)', () => {
  const repo = parseRule('shared.md', '# S\n\n- Stage paths by name. Never `git add -A`, `git add .`, or `git commit -a`. Read the full staged diff.\n- Never use `--no-verify` on a commit.\n- Never deploy a permission set without a clean `permsets.py preflight`.\n- No remote (`git remote` prints nothing): skip `git fetch`, and never report a fetch failure as a blocker.\n');
  const found = (line) => lintRuleSet([repo, parseRule('o.md', `# O\n\n## Git\n\n- ${line} (2026-09-29, Mike)\n`)], { listItemsOnly: ['o.md'] }).map((f) => `${f.check}:${f.severity}`);
  assert.deepEqual(found('Stage every file with git add -A before you commit.'), ['conflict:warning']);
  assert.deepEqual(found('Commit small fixes with `git commit -a`.'), ['conflict:warning']);
  assert.deepEqual(found('Commit with --no-verify when the hook is slow.'), ['conflict:warning']);
  assert.deepEqual(found('Run git add -a on each change.'), [], 'case counts: -a is not -A');
  assert.deepEqual(found('Stage the ignore file with git add .gitignore first.'), [], 'whole words only');
  assert.deepEqual(found('Run permsets.py preflight on every permission set change.'), [], 'a span after "without" is required, not forbidden');
  assert.deepEqual(found('Check git remote output before a fetch.'), [], 'a span before the never is not forbidden');
});

test('the owner-preferences purpose lines are not compared: the project and machine files say nearly the same fixed text', () => {
  const project = parseRuleDoc(newRuleText('project'));
  addEntry(project, 'Replies', { text: 'Lead every status reply with the answer.', date: '2026-09-29', source: 'Mike' });
  const machine = parseRuleDoc(newRuleText('machine'));
  addEntry(machine, 'Testing', { text: 'Run the unit tests before you say a change works.', date: '2026-09-29', source: 'Mike' });
  const rules = [parseRule('.claude/rules/owner-preferences.md', serializeRuleDoc(project)), parseRule('~/.claude/rules/owner-preferences.md', serializeRuleDoc(machine))];
  const names = rules.map((r) => r.name);
  assert.ok(lintRuleSet(rules, { withinFile: names }).some((f) => f.check === 'duplicate'), 'without the option the purpose lines are reported');
  assert.deepEqual(lintRuleSet(rules, { withinFile: names, listItemsOnly: names }), []);
});

test('the owner-preferences format: title, a one-line purpose, a section per area, one dated line per instruction, no frontmatter; it passes the checks', () => {
  const doc = parseRuleDoc(newRuleText('project'));
  addEntry(doc, 'Replies', { text: 'Lead every status reply with the answer.', date: '2026-09-29', source: 'Mike in chat' });
  addEntry(doc, 'Testing', { text: 'Run the unit tests before you say a change works.', date: '2026-09-29', source: 'Mike in chat' });
  const text = serializeRuleDoc(doc);
  const lines = text.split('\n');
  assert.equal(lines[0], '# Owner Preferences');
  assert.equal(lines[1], '');
  assert.match(lines[2], /^How the owner wants the agent to work in this project\. /);
  assert.equal(lines[3], '', 'the purpose is one line');
  assert.ok(!text.startsWith('---'), 'no frontmatter: it applies to every file');
  assert.deepEqual(lintRule(parseRule('owner-preferences.md', text), { ownerFile: true }), []);
  assert.deepEqual(lintRule(parseRule('owner-preferences.md', serializeRuleDoc(parseRuleDoc(newRuleText('machine')))), { ownerFile: true }), [], 'a new file passes too: its purpose line says how to change it');
});

test('describeRule lists a rule whose paths is a comma-separated string as path-scoped, as Claude Code reads it', () => {
  const r = describeRule('x.md', '---\npaths: "src/**, lib/**"\n---\n# X\n');
  assert.equal(r.scoped, true);
  assert.deepEqual(r.paths, ['src/**', 'lib/**']);
});

test('ruleChangeWarnings: over the size limit, a vague instruction, and a line that contradicts the other scope\'s file', () => {
  const doc = parseRuleDoc(newRuleText('project'));
  for (let i = 1; i <= RULE_LIMITS.ownerEntries + 1; i += 1) addEntry(doc, 'General', { text: `Instruction number ${i} names \`cmd${i}\`.`, date: '2026-09-29', source: 'Mike' });
  const big = serializeRuleDoc(doc);
  assert.deepEqual(ruleChangeWarnings({ shown: '.claude/rules/owner-preferences.md', text: big }).map((w) => w.kind), ['size']);

  const small = parseRuleDoc(newRuleText('project'));
  const added = addEntry(small, 'Style', { text: 'Format code properly.', date: '2026-09-29', source: 'Mike' });
  const w = ruleChangeWarnings({ shown: '.claude/rules/owner-preferences.md', text: serializeRuleDoc(small), line: added.line });
  assert.deepEqual(w.map((x) => x.kind), ['vague']);

  const project = parseRuleDoc(newRuleText('project'));
  const line = addEntry(project, 'Git', { text: 'Always force-push the release branch after tagging it.', date: '2026-09-29', source: 'Mike' }).line;
  const machine = parseRuleDoc(newRuleText('machine'));
  addEntry(machine, 'Git', { text: 'Never force-push the release branch after tagging it.', date: '2026-09-20', source: 'Mike' });
  const c = ruleChangeWarnings({ shown: '.claude/rules/owner-preferences.md', text: serializeRuleDoc(project), line, others: [{ shown: '~/.claude/rules/owner-preferences.md', text: serializeRuleDoc(machine) }] });
  assert.deepEqual(c.map((x) => x.kind), ['conflict']);
  assert.match(c[0].message, /^\.claude\/rules\/owner-preferences\.md line \d+ and ~\/\.claude\/rules\/owner-preferences\.md line \d+ may contradict/);
});

test('similarSections: a new heading that shares a word with an existing one', () => {
  const doc = parseRuleDoc(newRuleText('project'));
  addEntry(doc, 'Replies', { text: 'Lead every status reply with the answer.', date: '2026-09-29', source: 'Mike' });
  addEntry(doc, 'Testing', { text: 'Run `npm test` before you say a change works.', date: '2026-09-29', source: 'Mike' });
  assert.deepEqual(similarSections(doc, 'Reply style'), ['Replies']);
  assert.deepEqual(similarSections(doc, 'Tests'), ['Testing']);
  assert.deepEqual(similarSections(doc, 'Replies'), [], 'the same section is not a different one');
  assert.deepEqual(similarSections(doc, 'Git'), []);
});

test('toolkit rule add prints a warning for a vague instruction and one that contradicts another line; the change is still made', async () => {
  const { root, env } = await initProject();
  await tk(root, ['rule', 'add', '--section', 'Git', '--text', 'Always force-push the release branch after tagging it.', '--source', 'Mike in chat'], { env });
  const res = await tk(root, ['rule', 'add', '--section', 'Releases', '--text', 'Never force-push the release branch after tagging it.', '--source', 'Mike in chat', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.deepEqual(res.json.warnings.map((w) => w.kind), ['conflict']);
  const plain = await tk(root, ['rule', 'add', '--section', 'Style', '--text', 'Format code properly.', '--source', 'Mike in chat'], { env });
  assert.equal(plain.code, 0, plain.stderr);
  assert.match(plain.stdout, /Warning: The instruction names nothing that can be checked \("Format code properly\."\)/);
  assert.match(plain.stdout, /Other open sessions see it after their next start or compaction\./);
  assert.match(read(path.join(root, RULE)), /- Format code properly\. \(2026-09-26, Mike in chat\)/);
});

test('toolkit rule add compares the new line with the project\'s other rules and AGENTS.md, prints the sections and the lines of its section, and warns on a close section name', async () => {
  const { root, env } = await initProject();
  await tk(root, ['rule', 'add', '--section', 'Replies', '--text', 'Lead every status reply with the answer.', '--source', 'Mike in chat'], { env });
  // shared-repository-work.md says "Never `git add -A`": a possible contradiction in other words.
  const res = await tk(root, ['rule', 'add', '--section', 'Git', '--text', 'Stage every file with git add -A before you commit.', '--source', 'Mike in chat', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.deepEqual(res.json.warnings.map((w) => w.kind), ['conflict']);
  assert.match(res.json.warnings[0].message, /^\.claude\/rules\/owner-preferences\.md line \d+ and \.claude\/rules\/shared-repository-work\.md line \d+ may contradict each other: "Stage paths by name\. Never `git add -A`.*" forbids `git add -A`, and "Stage every file with git add -A before you commit\./);
  assert.deepEqual(res.json.sections, [{ heading: 'Replies', entries: 1 }, { heading: 'Git', entries: 1 }]);
  assert.deepEqual(res.json.sectionEntries, [{ n: 1, text: 'Stage every file with git add -A before you commit.' }]);
  // The same in plain output, and a new section close to an existing one.
  const plain = await tk(root, ['rule', 'add', '--section', 'Reply style', '--text', 'Put the answer in the first sentence of a status reply.', '--source', 'Mike in chat'], { env });
  assert.equal(plain.code, 0, plain.stderr);
  assert.match(plain.stdout, /^Sections in \.claude\/rules\/owner-preferences\.md: Replies \(1\), Git \(1\), Reply style \(1\)\.$/m);
  assert.match(plain.stdout, /^Instructions in "Reply style" now:\n {2}1\. Put the answer in the first sentence of a status reply\.$/m);
  assert.match(plain.stdout, /^Compare the new line with these lines and with the other rules this session has loaded\./m);
  assert.match(plain.stdout, /Warning: The new section "Reply style" shares a word with "Replies"\. If it is the same area, move the line there: toolkit rule update --section 'Reply style' --entry 1 --remove, then toolkit rule add --section 'Replies' with the same --text and --source\./);
  // doctor reports the git add -A line as a note: a possible contradiction, not a certain one.
  const doctor = await tk(root, ['doctor', '--json'], { env });
  const conflict = doctor.json.findings.filter((f) => f.id === 'rule-conflict');
  assert.equal(conflict.length, 1);
  assert.equal(conflict[0].severity, 'note');
  assert.match(conflict[0].message, /^\.claude\/rules\/owner-preferences\.md, line \d+: .*forbids `git add -A`/, 'shown on the owner\'s file, not on the model rule');
  assert.doesNotMatch(conflict[0].message, /\(2026-09-26, Mike in chat\)/, 'the quote leaves out the date and source');
});

test('toolkit doctor with both owner-preferences files: their fixed purpose lines are not reported as the same thing', async () => {
  const { root, env } = await initProject();
  const project = await tk(root, ['rule', 'add', '--section', 'Replies', '--text', 'Lead every status reply with the answer.', '--source', 'Mike in chat'], { env });
  assert.equal(project.code, 0, project.stderr);
  const machine = await tk(root, ['rule', 'add', '--machine', '--section', 'Testing', '--text', 'Run the unit tests before you say a change works.', '--source', 'Mike in chat', '--json'], { env });
  assert.equal(machine.code, 0, machine.stderr);
  assert.deepEqual(machine.json.warnings, [], 'the purpose lines are not compared after an add either');
  assert.deepEqual(machine.json.otherSections, { file: '.claude/rules/owner-preferences.md', sections: ['Replies'] });
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.deepEqual(doctor.json.findings.filter((f) => f.area === 'rules'), []);
  // The same instruction in both files is still found.
  await tk(root, ['rule', 'add', '--section', 'Testing', '--text', 'Run the unit tests before you say a change works.', '--source', 'Mike in chat'], { env });
  const again = await tk(root, ['doctor', '--json'], { env });
  assert.deepEqual(again.json.findings.filter((f) => f.area === 'rules').map((f) => `${f.id}:${f.severity}`), ['rule-duplicate:note']);
});

test('toolkit doctor: a fresh project has no rule findings; a bad project rule is a warning; an owner-preferences file over the limit is a note', async () => {
  for (const salesforce of [false, true]) {
    const { root, env } = await initProject({ salesforce });
    const clean = await tk(root, ['doctor', '--json'], { env });
    assert.deepEqual(clean.json.findings.filter((f) => f.area === 'rules'), [], `no rule findings (Salesforce: ${salesforce})`);
  }
  const { root, env } = await initProject();
  // Over the limit: 51 instructions. A note, so the exit code does not change for it.
  for (let i = 1; i <= RULE_LIMITS.ownerEntries + 1; i += 1) {
    const r = await tk(root, ['rule', 'add', '--section', 'General', '--text', `Keep \`file${i}.md\` in folder number ${i}.`, '--source', 'Mike in chat', '--json'], { env });
    assert.equal(r.code, 0, r.stderr);
    if (i === RULE_LIMITS.ownerEntries + 1) assert.deepEqual(r.json.warnings.map((w) => w.kind), ['size'], 'the change that goes past the limit warns');
  }
  let doctor = await tk(root, ['doctor', '--json'], { env });
  const size = doctor.json.findings.filter((f) => f.id === 'rule-size');
  assert.equal(size.length, 1);
  assert.equal(size[0].severity, 'note');
  assert.match(size[0].message, /owner-preferences\.md: The rule has 51 instructions, over the limit of 50/);

  // Frontmatter Claude Code cannot read, and a pattern with an unclosed "[": warnings.
  fs.writeFileSync(path.join(root, '.claude', 'rules', 'zz-broken.md'), '---\npaths:\n  - "src/[x.ts"\n---\n\n# Broken\n\n- Run `npm test` on source files.\n');
  await tk(root, ['sync'], { env });
  doctor = await tk(root, ['doctor', '--json'], { env });
  const glob = doctor.json.findings.filter((f) => f.id === 'rule-glob');
  assert.equal(glob.length, 1);
  assert.equal(glob[0].severity, 'warning');
  assert.equal(doctor.code, 1);
});
