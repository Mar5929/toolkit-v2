// Memory after Mike's split of 2026-09-29 (dev/GOAL.md "Rules, skills, and
// memory each hold one kind of thing"):
// - four prefixes: a new feedback_ record or fact is refused and points at
//   toolkit rule add; an older feedback_ record is still read, doctor reports
//   it, and tidy --plan lists how to move each part (cross-type split works);
// - the index groups the four prefixes (a Feedback section only while such
//   records are there) and names where a proposal would go;
// - every concept ends with "## Gotchas and lessons"; --lesson records a
//   lesson with a Seen line; the same lesson again adds a date;
// - promotion: tidy --plan lists lessons that proved themselves; promote
//   proposes, and after the owner's yes writes the rule or a skill skeleton
//   and marks the lesson promoted;
// - F1: Hindsight find shows the section that matched.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, initProject, read, tk } from '../project/helpers.mjs';
import { HindsightDriver } from '../../lib/memory/hindsight.mjs';
import { addLesson, lessonsOf, planPromotions, parseLessons, ruleArea, seenSessions } from '../../lib/memory/lessons.mjs';
import { matchingSectionSnippet, searchTerms } from '../../lib/memory/contract.mjs';

after(cleanup);

const mem = (root, f) => path.join(root, '.memory', f);

/** An older feedback_ record, as a project made before the split holds it. */
function oldFeedback(root) {
  fs.writeFileSync(mem(root, 'feedback_ways_of_working.md'), [
    '---',
    'name: feedback_ways_of_working',
    'description: How the owner wants the agent to work',
    'updated: 2026-09-20',
    'metadata:',
    '  type: feedback',
    'status: current',
    'source: Mike, 2026-09-20',
    'last_verified: 2026-09-20',
    'authorization: Approved by Mike on 2026-09-20',
    'supersedes: none',
    '---',
    '',
    '# Ways of working',
    '',
    '## Force-push',
    '',
    '**Remember:** Never force-push to any branch.',
    '',
    '## Laptop',
    '',
    '**Remember:** Mike works on a MacBook Air.',
    '',
  ].join('\n'));
}

test('a new feedback_ record or fact is refused and points at toolkit rule add; an older one is read, reported, and moved out', async () => {
  const { root, env } = await initProject();
  const refused = await tk(root, ['memory', 'save', '--type', 'feedback', '--name', 'ways', '--description', 'How to work', '--section', 'Replies', '--body', 'Keep replies short.', '--approved-by', 'Mike', '--json'], { env });
  assert.equal(refused.code, 2);
  assert.match(refused.json.error.message, /the feedback_ type is retired\. An instruction for how the agent works .* is a rule, not memory: toolkit rule add --section '<area>'/);
  assert.equal(fs.existsSync(mem(root, 'feedback_ways.md')), false);

  oldFeedback(root);
  await tk(root, ['memory', 'reindex'], { env });
  assert.match(read(mem(root, 'MEMORY.md')), /## Feedback \(retired type: memory-tidy moves these to the rules and concepts\)\n\n- \[Ways of working\]\(feedback_ways_of_working\.md\)/);
  const get = await tk(root, ['memory', 'get', 'feedback_ways_of_working'], { env });
  assert.equal(get.code, 0, 'still read');
  const section = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Replies', '--body', 'Short replies.', '--approved-by', 'Mike'], { env });
  assert.equal(section.code, 2, 'no new fact goes into it');
  const rename = await tk(root, ['memory', 'rename', 'feedback_ways_of_working', '--to', 'feedback_how_to_work'], { env });
  assert.equal(rename.code, 2);

  const doctor = await tk(root, ['doctor', '--json'], { env });
  const f = doctor.json.findings.find((x) => x.id === 'memory-feedback-retired');
  assert.ok(f, JSON.stringify(doctor.json.findings.map((x) => x.id)));
  assert.equal(f.severity, 'warning');
  assert.deepEqual(f.keys, ['feedback_ways_of_working']);
  assert.match(f.fix, /memory-tidy skill: toolkit memory tidy --plan lists each part/);

  const plan = await tk(root, ['memory', 'tidy', '--plan', '--json'], { env });
  assert.deepEqual(plan.json.migrate.map((m) => [m.key, m.parts.map((p) => p.heading)]), [['feedback_ways_of_working', ['Force-push', 'Laptop']]]);
  assert.ok(!plan.json.merges.some((m) => m.members.some((x) => x.key.startsWith('feedback_'))), 'never merged as memory');
  const human = await tk(root, ['memory', 'tidy', '--plan'], { env });
  assert.match(human.stdout, /An instruction: toolkit rule add --section 'Git' --text '<the instruction>' --source 'memory record feedback_ways_of_working, saved 2026-09-20'/);
  assert.match(human.stdout, /A fact: toolkit memory split feedback_ways_of_working --section 'Laptop' --into <user_ or project_ concept> --approved-by <owner>/);

  // The migration after the owner's yes: the fact to a user_ concept (a cross-type split), the instruction to the rules, then retire.
  const split = await tk(root, ['memory', 'split', 'feedback_ways_of_working', '--section', 'Laptop', '--into', 'user_profile', '--title', 'Profile', '--description', 'Mike: his role and his computer', '--approved-by', 'Mike'], { env });
  assert.equal(split.code, 0, split.stderr);
  assert.match(read(mem(root, 'user_profile.md')), /## Laptop\n\n\*\*Remember:\*\* Mike works on a MacBook Air\./);
  await tk(root, ['rule', 'add', '--section', 'Git', '--text', 'Never force-push to any branch.', '--source', 'memory record feedback_ways_of_working, saved 2026-09-20'], { env });
  await tk(root, ['memory', 'retire', 'feedback_ways_of_working', '--reason', 'Moved to the rules and concepts'], { env });
  const after2 = await tk(root, ['doctor', '--json'], { env });
  assert.ok(!after2.json.findings.some((x) => x.id === 'memory-feedback-retired'));
  assert.doesNotMatch(read(mem(root, 'MEMORY.md')), /## Feedback/, 'the section goes with the last feedback_ record');
});

test('an older feedback_ proposal is a rule proposal: the owner\'s yes writes it to the rules', async () => {
  const { root, env } = await initProject();
  fs.writeFileSync(mem(root, 'feedback_one_question.md'), '---\nname: feedback_one_question\ndescription: Ask one requirements question at a time\nmetadata:\n  type: feedback\nstatus: needs-review\nsource: Agent question in a session, 2026-09-27\nlast_verified: unknown\nauthorization: Proposed by the agent on 2026-09-27; the owner has not answered\nsupersedes: none\n---\n\n# Ask one requirements question at a time\n\n**Remember:** Ask one requirements question at a time.\n');
  const yes = await tk(root, ['memory', 'approve', 'feedback_one_question', '--by', 'Mike', '--section', 'Questions', '--json'], { env });
  assert.equal(yes.code, 0, yes.stderr);
  assert.match(read(path.join(root, '.claude', 'rules', 'owner-preferences.md')), /## Questions\n\n- Ask one requirements question at a time\. \(\d{4}-\d{2}-\d{2}, Mike said yes to the agent's question\)/);
  assert.equal(fs.existsSync(mem(root, 'feedback_one_question.md')), false);
});

test('every new concept ends with Gotchas and lessons; --lesson records one, and the same heading again adds a date', async () => {
  const { root, env } = await initProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploys', '--description', 'How deploys work', '--section', 'Deploy window', '--body', 'Deploys go out on Tuesdays.', '--approved-by', 'Mike'], { env });
  assert.match(read(mem(root, 'project_deploys.md')), /## Deploy window\n\n\*\*Remember:\*\* Deploys go out on Tuesdays\.\n\n## Gotchas and lessons\n\nNone yet\.\n$/);
  await tk(root, ['memory', 'save', '--concept', 'project_deploys', '--section', 'Release branch', '--body', 'Releases come from the release branch.', '--approved-by', 'Mike'], { env });
  assert.match(read(mem(root, 'project_deploys.md')), /## Release branch\n\n[^#]*\n## Gotchas and lessons\n\nNone yet\.\n$/, 'a new section goes before the lessons');

  const first = await tk(root, ['memory', 'save', '--concept', 'project_deploys', '--lesson', 'The deploy check needs the VPN', '--body', 'The deploy check times out with the VPN off. Turn it on first.', '--source', 'WI-012 build', '--json'], { env });
  assert.equal(first.code, 0, first.stderr);
  assert.equal(first.json.lesson.action, 'added');
  const text = read(mem(root, 'project_deploys.md'));
  assert.match(text, /## Gotchas and lessons\n\n### The deploy check needs the VPN\n\nThe deploy check times out with the VPN off\. Turn it on first\.\n\n\*\*Seen:\*\* \d{4}-\d{2}-\d{2} \(WI-012 build\)\n$/);
  assert.doesNotMatch(text, /None yet/);
  // The same lesson again the same day: nothing changes. On another day (the Seen line moved back): a date is added.
  const same = await tk(root, ['memory', 'save', '--concept', 'project_deploys', '--lesson', 'the deploy check needs the VPN', '--json'], { env });
  assert.equal(same.json.lesson.action, 'unchanged');
  fs.writeFileSync(mem(root, 'project_deploys.md'), read(mem(root, 'project_deploys.md')).replace(/\*\*Seen:\*\* \d{4}-\d{2}-\d{2}/, '**Seen:** 2026-09-20'));
  const again = await tk(root, ['memory', 'save', '--concept', 'project_deploys', '--lesson', 'The deploy check needs the VPN', '--source', 'WI-014 build'], { env });
  assert.match(again.stdout, /came up again: .* \(2 sessions\)/);
  assert.match(again.stdout, /toolkit memory promote project_deploys --section 'The deploy check needs the VPN' --to rule/);
  assert.match(read(mem(root, 'project_deploys.md')), /\*\*Seen:\*\* 2026-09-20 \(WI-012 build\); \d{4}-\d{2}-\d{2} \(WI-014 build\)/);
  // A lesson never goes into an event, and --lesson takes no approval flags.
  assert.equal((await tk(root, ['memory', 'save', '--concept', 'project_deploys', '--lesson', 'X', '--approved-by', 'Mike'], { env })).code, 2);
});

test('promotion: tidy --plan lists a lesson seen twice; promote proposes and changes nothing; the owner\'s yes writes the rule or a skill skeleton and marks the lesson', async () => {
  const { root, env } = await initProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploys', '--description', 'How deploys work', '--section', 'Deploy window', '--body', 'Deploys go out on Tuesdays.', '--approved-by', 'Mike'], { env });
  await tk(root, ['memory', 'save', '--concept', 'project_deploys', '--lesson', 'The deploy check needs the VPN', '--body', 'Turn on the VPN before the deploy check.'], { env });
  await tk(root, ['memory', 'save', '--concept', 'project_deploys', '--lesson', 'Staging seed', '--body', 'Run the seed script after a staging reset.'], { env });
  let plan = await tk(root, ['memory', 'tidy', '--plan', '--json'], { env });
  assert.deepEqual(plan.json.promotions, [], 'seen once: not yet');
  fs.writeFileSync(mem(root, 'project_deploys.md'), read(mem(root, 'project_deploys.md')).replace(/(### The deploy check needs the VPN[\s\S]*?\*\*Seen:\*\* )(\d{4}-\d{2}-\d{2})/, '$12026-09-20; $2'));
  plan = await tk(root, ['memory', 'tidy', '--plan', '--json'], { env });
  assert.deepEqual(plan.json.promotions.map((p) => [p.key, p.heading, p.sessions]), [['project_deploys', 'The deploy check needs the VPN', 2]]);

  const before = read(mem(root, 'project_deploys.md'));
  const proposal = await tk(root, ['memory', 'promote', 'project_deploys', '--section', 'The deploy check needs the VPN', '--to', 'rule', '--json'], { env });
  assert.equal(proposal.code, 0, proposal.stderr);
  assert.equal(proposal.json.changed, false);
  assert.equal(proposal.json.ask, 'Make this a project rule: Turn on the VPN before the deploy check?');
  assert.equal(proposal.json.plan.section, 'Testing', 'the area its words name');
  assert.equal(read(mem(root, 'project_deploys.md')), before);
  assert.equal(fs.existsSync(path.join(root, '.claude', 'rules', 'owner-preferences.md')), false);

  const yes = await tk(root, ['memory', 'promote', 'project_deploys', '--section', 'The deploy check needs the VPN', '--to', 'rule', '--rule-section', 'Deploys', '--approved-by', 'Mike', '--json'], { env });
  assert.equal(yes.code, 0, yes.stderr);
  assert.match(read(path.join(root, '.claude', 'rules', 'owner-preferences.md')), /## Deploys\n\n- Turn on the VPN before the deploy check\. \(\d{4}-\d{2}-\d{2}, Mike approved promoting the lesson "The deploy check needs the VPN" from memory \(project_deploys\)\)/);
  assert.match(read(mem(root, 'project_deploys.md')), /\*\*Promoted:\*\* \d{4}-\d{2}-\d{2}, to the project rule in `\.claude\/rules\/owner-preferences\.md`, section "Deploys"\. Follow that; this lesson stays as its history\./);
  const twice = await tk(root, ['memory', 'promote', 'project_deploys', '--section', 'The deploy check needs the VPN', '--to', 'rule', '--approved-by', 'Mike'], { env });
  assert.equal(twice.code, 2);
  plan = await tk(root, ['memory', 'tidy', '--plan', '--json'], { env });
  assert.deepEqual(plan.json.promotions, [], 'a promoted lesson is not listed again');

  const skill = await tk(root, ['memory', 'promote', 'project_deploys', '--section', 'Staging seed', '--to', 'skill', '--approved-by', 'Mike', '--json'], { env });
  assert.equal(skill.code, 0, skill.stderr);
  const file = path.join(root, '.claude', 'skills', 'staging-seed', 'SKILL.md');
  assert.match(read(file), /^---\nname: staging-seed\ndescription: '<Fill in: what this skill does/);
  assert.match(read(file), /The lesson "Staging seed" in memory \(project_deploys\): Run the seed script after a staging reset\./);
  assert.equal(skill.json.copyTo, '.agents/skills/staging-seed/SKILL.md', 'the project also uses Codex');
  assert.match(read(mem(root, 'project_deploys.md')), /### Staging seed[\s\S]*\*\*Promoted:\*\* \d{4}-\d{2}-\d{2}, to the project skill `\.claude\/skills\/staging-seed\/SKILL\.md`\./);
});

test('lessons helpers: parse, seen again, a lesson like it in another concept, and the owner confirming one', () => {
  let t = addLesson('None yet.', 'VPN first', { text: 'Turn on the VPN.', date: '2026-09-20', source: 'WI-1' }).text;
  assert.equal(t, '### VPN first\n\nTurn on the VPN.\n\n**Seen:** 2026-09-20 (WI-1)');
  t = addLesson(t, 'vpn first', { date: '2026-09-22' }).text;
  assert.match(t, /\*\*Seen:\*\* 2026-09-20 \(WI-1\); 2026-09-22$/);
  assert.equal(parseLessons(t).lessons.length, 1);
  const rec = (key, lessons) => ({ key, type: 'project', status: 'current', body: `# ${key}\n\n## A\n\n**Remember:** x.\n\n## Gotchas and lessons\n\n${lessons}\n` });
  const plan = planPromotions([
    rec('project_deploys', '### Staging resets\n\nRun the seed script after staging resets on Sunday.\n\n**Seen:** 2026-09-20'),
    rec('project_testing', '### Seed after reset\n\nThe seed script must run after the Sunday staging resets.\n\n**Seen:** 2026-09-21'),
    rec('project_billing', '### Refund rounding\n\nRound refunds per line.\n\n**Owner confirmed:** 2026-09-22\n\n**Seen:** 2026-09-22'),
  ], { ownerName: 'Mike' });
  assert.deepEqual(plan.map((p) => [p.key, p.heading]), [['project_deploys', 'Staging resets'], ['project_testing', 'Seed after reset'], ['project_billing', 'Refund rounding']]);
  assert.match(plan[2].why[0], /the owner confirmed it/);
  assert.deepEqual(lessonsOf(rec('project_x', 'None yet.').body), []);
});

test('two sessions on one day count as two when their sources differ; Git words pick the rule area first (verifier, 2026-09-29)', () => {
  let t = addLesson('None yet.', 'VPN first', { text: 'Turn on the VPN.', date: '2026-09-29', source: 'setup session' }).text;
  const again = addLesson(t, 'VPN first', { date: '2026-09-29', source: 'setup session' });
  assert.equal(again.action, 'unchanged', 'the same session again');
  assert.equal(addLesson(t, 'VPN first', { date: '2026-09-29' }).action, 'unchanged', 'no source: the date is enough');
  const other = addLesson(t, 'VPN first', { date: '2026-09-29', source: 'backup session' });
  assert.equal(other.action, 'seen-again');
  t = other.text;
  assert.match(t, /\*\*Seen:\*\* 2026-09-29 \(setup session\); 2026-09-29 \(backup session\)$/);
  assert.deepEqual(seenSessions('2026-09-29 (setup session); 2026-09-29 (backup session)'), ['2026-09-29', '2026-09-29']);
  assert.deepEqual(seenSessions('2026-09-28, 2026-09-29'), ['2026-09-28', '2026-09-29'], 'a hand-written list of dates');
  const rec = { key: 'project_hindsight', type: 'project', status: 'current', body: `# Hindsight\n\n## Port\n\n**Remember:** 8888.\n\n## Gotchas and lessons\n\n${t}\n` };
  assert.deepEqual(planPromotions([rec]).map((p) => [p.heading, p.sessions]), [['VPN first', 2]]);

  assert.equal(ruleArea('Commit style Keep commits short'), 'Git');
  assert.equal(ruleArea('Lead every status reply with the answer'), 'Replies');
  assert.equal(ruleArea('Write tests with node:test'), 'Testing');
});

test('an event gets no Gotchas and lessons section; tidy --plan moves a one-fact feedback_ record with merge, which works', async () => {
  const { root, env } = await initProject();
  const ev = await tk(root, ['memory', 'save', '--type', 'event', '--name', 'outage-sept', '--description', 'The staging outage of September 20', '--section', 'What happened', '--body', 'Staging was down for two hours.', '--approved-by', 'Mike'], { env });
  assert.equal(ev.code, 0, ev.stderr);
  assert.doesNotMatch(read(mem(root, 'event_outage_sept.md')), /Gotchas and lessons/);

  fs.writeFileSync(mem(root, 'feedback_laptop.md'), '---\nname: feedback_laptop\ndescription: Mike works on a MacBook Air\nmetadata:\n  type: feedback\nstatus: current\nsource: Mike, 2026-09-20\nlast_verified: 2026-09-20\nauthorization: Approved by Mike on 2026-09-20\nsupersedes: none\n---\n\n# Laptop\n\n**Remember:** Mike works on a MacBook Air.\n');
  await tk(root, ['memory', 'save', '--type', 'user', '--name', 'profile', '--description', 'Who Mike is and what he uses', '--section', 'Role', '--body', 'Mike owns the project.', '--approved-by', 'Mike'], { env });
  const plan = await tk(root, ['memory', 'tidy', '--plan'], { env });
  assert.match(plan.stdout, /A fact: toolkit memory merge feedback_laptop --into <user_ or project_ concept> --approved-by <owner> \(it has no "## " sections, so the whole record moves\)/);
  assert.doesNotMatch(plan.stdout, /toolkit memory split feedback_laptop/);
  const merged = await tk(root, ['memory', 'merge', 'feedback_laptop', '--into', 'user_profile', '--approved-by', 'Mike'], { env });
  assert.equal(merged.code, 0, merged.stderr);
  assert.match(read(mem(root, 'user_profile.md')), /Mike works on a MacBook Air\./);
});

test('F1: Hindsight find shows the section that matched, not the start of the chunk', async () => {
  const body = '---\nname: project_deploy\ndescription: How deploys work\nmetadata:\n  type: project\nstatus: current\n---\n\n# Deploy\n\n## Deploy approvals\n\n**Remember:** Every deploy needs an approval from Anna.\n\n## Deploy window\n\n**Remember:** Deploys go out on Tuesdays after 6 pm.\n';
  const client = {
    bank: 'b', url: 'http://fake',
    bankExists: async () => true,
    recall: async () => ({ results: [{ document_id: 'project_deploy', text: '**Remember:** Deploys go out on Tuesdays after 6 pm.', scores: { final: 0.5 }, metadata: { key: 'project_deploy', type: 'project', status: 'current', name: 'deploy', description: 'How deploys work' } }] }),
    getDocument: async () => ({ original_text: body, document_metadata: {} }),
  };
  const driver = new HindsightDriver({ client });
  const res = await driver.find('tuesday deploy');
  const hit = [...res.results, ...res.maybe][0];
  assert.ok(hit, JSON.stringify(res));
  assert.equal(hit.snippet, 'Deploy window: **Remember:** Deploys go out on Tuesdays after 6 pm.');
  assert.equal(hit.chunk, undefined, 'the chunk is not part of the result');
  // A match by meaning only: the section that holds the returned piece.
  assert.equal(matchingSectionSnippet(body.split('---\n\n')[1], searchTerms('when do releases happen'), 'Deploys go out on Tuesdays after 6 pm.'), 'Deploy window: **Remember:** Deploys go out on Tuesdays after 6 pm.');
});
