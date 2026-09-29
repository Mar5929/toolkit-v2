// toolkit rule add | update | list (Mike, 2026-09-29, dev/GOAL.md "Rules,
// skills, and memory each hold one kind of thing"): the owner's instructions
// for how the agent works are rules, kept in the project's always-on
// .claude/rules/owner-preferences.md (a "## " section per area, each line
// dated with its source), or with --machine in ~/.claude/rules/ for every
// project. The AGENTS.md rules list is rebuilt so Codex reads the file; every
// change holds a lock and is read back; --machine asks the owner first in
// both hosts.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk, tkSpawn } from './helpers.mjs';
import { askFirstCommand } from '../../lib/cli.mjs';
import { parseRuleDoc, entriesOf, addEntry, updateEntry, serializeRuleDoc, newRuleText } from '../../lib/project/owner-rules.mjs';
import { spanBody } from '../../lib/project/render.mjs';

after(cleanup);

const RULE = path.join('.claude', 'rules', 'owner-preferences.md');

test('rule add makes the file on first use, with a section per area and each line dated with its source; AGENTS.md lists it', async () => {
  const { root, env } = await initProject();
  const before = read(path.join(root, 'AGENTS.md'));
  assert.doesNotMatch(spanBody(before), /owner-preferences/);

  const res = await tk(root, ['rule', 'add', '--section', 'Replies', '--text', 'Lead every status reply with the answer', '--source', 'Mike in chat', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.equal(res.json.created, true);
  assert.equal(res.json.entry, 1);
  assert.equal(res.json.agentsUpdated, true);
  assert.equal(res.json.replyLine, "Added to the project rules: Lead every status reply with the answer. Say 'undo that' to take it out.");
  assert.equal(read(path.join(root, RULE)), [
    '# Owner Preferences',
    '',
    'How the owner wants the agent to work in this project. Follow every line, every session. Each line ends with the date and where the instruction came from. Change this file only with `toolkit rule add` or `toolkit rule update`, after the owner says so.',
    '',
    '## Replies',
    '',
    '- Lead every status reply with the answer. (2026-09-26, Mike in chat)',
    '',
  ].join('\n'));

  const agents = read(path.join(root, 'AGENTS.md'));
  assert.match(spanBody(agents), /^- `\.claude\/rules\/owner-preferences\.md`: Owner Preferences$/m, 'always on: Codex reads it at session start');
  const doctor = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!doctor.json.findings.some((f) => f.id === 'agents-md-span' || f.id === 'agents-md-changed'), JSON.stringify(doctor.json.findings.map((f) => f.id)));

  // A second instruction in the same area, and one in a new area.
  const second = await tk(root, ['rule', 'add', '--section', 'replies', '--text', 'Keep status replies under ten lines.', '--source', 'Mike in chat', '--json'], { env });
  assert.equal(second.json.entry, 2);
  assert.equal(second.json.section, 'Replies', 'the area is matched without regard to case');
  assert.equal(second.json.agentsUpdated, false);
  await tk(root, ['rule', 'add', '--section', 'Git', '--text', 'Never force-push.', '--source', 'Mike in chat', '--date', '2026-09-27'], { env });
  const text = read(path.join(root, RULE));
  assert.match(text, /## Replies\n\n- Lead every status reply with the answer\. \(2026-09-26, Mike in chat\)\n- Keep status replies under ten lines\. \(2026-09-26, Mike in chat\)\n\n## Git\n\n- Never force-push\. \(2026-09-27, Mike in chat\)\n$/);

  // The same instruction twice, a secret, and a missing source are refused; nothing changes.
  const dup = await tk(root, ['rule', 'add', '--section', 'Replies', '--text', 'lead every status reply with the answer!', '--source', 'Mike'], { env });
  assert.equal(dup.code, 2);
  assert.match(dup.stderr, /already has this instruction \(line 1, 2026-09-26\)/);
  const secret = await tk(root, ['rule', 'add', '--section', 'Keys', '--text', 'Use the key sk-live-4f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c', '--source', 'Mike'], { env });
  assert.equal(secret.code, 2);
  assert.doesNotMatch(secret.stderr, /sk-live/);
  assert.equal((await tk(root, ['rule', 'add', '--section', 'Git', '--text', 'Rebase before merge.'], { env })).code, 2);
  assert.equal(read(path.join(root, RULE)), text);

  // list shows the numbered instructions.
  const list = await tk(root, ['rule', 'list', '--project'], { env });
  assert.match(list.stdout, /## Replies\n {4}1\. Lead every status reply with the answer\. \(2026-09-26, Mike in chat\)\n {4}2\. Keep status replies/);
});

test('rule update changes or removes one instruction by number or words; the section goes when it is empty', async () => {
  const { root, env } = await initProject();
  await tk(root, ['rule', 'add', '--section', 'Replies', '--text', 'Lead with the answer.', '--source', 'Mike in chat'], { env });
  await tk(root, ['rule', 'add', '--section', 'Replies', '--text', 'Use tables for status.', '--source', 'Mike in chat'], { env });
  const changed = await tk(root, ['rule', 'update', '--section', 'Replies', '--match', 'tables', '--text', 'Use a table for any status of three or more items.', '--source', 'Mike in chat, again', '--date', '2026-09-28', '--json'], { env });
  assert.equal(changed.code, 0, changed.stderr);
  assert.equal(changed.json.entry, 2);
  assert.equal(changed.json.previous, '- Use tables for status. (2026-09-26, Mike in chat)');
  assert.match(read(path.join(root, RULE)), /- Use a table for any status of three or more items\. \(2026-09-28, Mike in chat, again\)/);
  const ambiguous = await tk(root, ['rule', 'update', '--section', 'Replies', '--match', 'e', '--remove'], { env });
  assert.equal(ambiguous.code, 2);
  assert.match(ambiguous.stderr, /found 2 instructions/);
  await tk(root, ['rule', 'update', '--section', 'Replies', '--entry', '2', '--remove'], { env });
  await tk(root, ['rule', 'update', '--section', 'Replies', '--entry', '1', '--remove'], { env });
  assert.doesNotMatch(read(path.join(root, RULE)), /## Replies/);
  assert.equal((await tk(root, ['rule', 'update', '--section', 'Replies', '--entry', '1', '--remove'], { env })).code, 2);
});

test('--machine writes the Claude Code user rules folder, only when it comes right after the command word; both hosts ask first', async () => {
  const { root, env } = await initProject();
  const wrong = await tk(root, ['rule', 'add', '--section', 'Replies', '--machine', '--text', 'Plain English.', '--source', 'Mike'], { env });
  assert.equal(wrong.code, 2);
  assert.match(wrong.stderr, /--machine must come right after "add"/);
  const machineFile = path.join(env.CLAUDE_CONFIG_DIR, 'rules', 'owner-preferences.md');
  assert.equal(fs.existsSync(machineFile), false);

  const res = await tk(root, ['rule', 'add', '--machine', '--section', 'Replies', '--text', 'Write in plain English.', '--source', 'Mike in chat', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.equal(res.json.scope, 'machine');
  assert.match(read(machineFile), /^# Owner Preferences for Every Project\n\nHow the owner wants the agent to work in every project on this computer\./);
  assert.equal(fs.existsSync(path.join(root, RULE)), false, 'the project file is untouched');
  assert.equal(askFirstCommand('rule', ['add', '--machine', '--section', 'x']), 'rule add --machine');
  assert.equal(askFirstCommand('rule', ['update', '--machine']), 'rule update --machine');
  assert.equal(askFirstCommand('rule', ['add', '--section', 'x']), null, 'a project rule needs no prompt');

  // The Codex briefing names the machine file; Claude Code loads it by itself.
  const brief = await tk(root, ['brief', '--host', 'codex'], { env });
  assert.match(brief.stdout, new RegExp(`- ${machineFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: the owner's preferences for every project`));
  const list = await tk(root, ['rule', 'list'], { env });
  assert.match(list.stdout, /\.claude\/rules\/owner-preferences\.md: none yet\./);
  assert.match(list.stdout, /1\. Write in plain English\./);
});

test('two rule adds at the same moment, from two processes, both land (the lock)', async () => {
  const { root, env } = await initProject();
  const runs = await Promise.all(['First', 'Second', 'Third'].map((w) => tkSpawn(root, ['rule', 'add', '--section', 'Replies', '--text', `${w} instruction.`, '--source', 'Mike'], { env })));
  for (const r of runs) assert.equal(r.code, 0, r.stderr);
  const doc = parseRuleDoc(read(path.join(root, RULE)));
  assert.deepEqual(entriesOf(doc.sections[0]).map((e) => e.text).sort(), ['First instruction.', 'Second instruction.', 'Third instruction.']);
});

test('the rule file format keeps lines the toolkit did not write', () => {
  const doc = parseRuleDoc(`${newRuleText('project')}\n## Replies\n\nA note Mike wrote by hand.\n\n- Lead with the answer. (2026-09-26, Mike)\n`);
  addEntry(doc, 'Replies', { text: 'Short replies.', date: '2026-09-27', source: 'Mike' });
  updateEntry(doc, 'Replies', { entry: 1, text: 'Lead with the answer, always.', date: '2026-09-28', source: 'Mike' });
  const text = serializeRuleDoc(doc);
  assert.match(text, /## Replies\n\nA note Mike wrote by hand\.\n\n- Lead with the answer, always\. \(2026-09-28, Mike\)\n- Short replies\. \(2026-09-27, Mike\)\n$/);
});
