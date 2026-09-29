// The verifier findings of 2026-09-28 on the memory proposal Stop hook and the
// duplicate check:
// - I5: questions in other words than "Save to memory: <one line>?" (3 of 4
//   in the live runs) get one block that asks for the exact form; the exact
//   form also allows bold before the colon and "project memory";
// - I6: the closest-match rule no longer stops a different fact (the org
//   alias pair), the Stop hook saves a proposal that is only about the same
//   subject, and its notes never tell the agent to update another record;
// - minor 9: the AI credit guard also finds a credit in the middle of a line;
// - minor 2: a similar proposal is named with approve and reject, a secret is
//   named as a secret, and a reply that only reports an earlier question
//   saves nothing.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanup, initProject, tk } from '../project/helpers.mjs';
import { fixture } from './fixtures.mjs';
import { proposalQuestions, looseQuestion } from '../../lib/hooks/proposal.mjs';
import { LOOSE_REASON } from '../../lib/hooks/stop.mjs';
import { hasKeepPhrase } from '../../lib/hooks/phrases.mjs';
import { compareRecords, differsByValue } from '../../lib/memory/similar.mjs';
import { aiCreditLine, checkAiCredit } from '../../lib/hooks/shell.mjs';
import { GENERATED, GENERATED_LOWER, TRAILER_IN_SENTENCE, WRITTEN_USING } from '../credit-lines.mjs';

after(cleanup);

const HOSTS = ['claude', 'codex'];
let seq = 0;

async function hook(root, env, host, event, input) {
  const res = await tk(root, ['hook', event, '--host', host], { env, stdin: JSON.stringify(input) });
  return { code: res.code, out: res.stdout.trim() ? JSON.parse(res.stdout) : null, raw: res.stdout };
}

/** One turn: UserPromptSubmit, optional commands run through PostToolUse, then Stop with the last assistant message. */
async function turn(root, env, host, { session, prompt = 'How does it look?', message, active = false, commands = [] }) {
  seq += 1;
  const TURN = `turn-${seq}`;
  const up = await hook(root, env, host, 'user-prompt', fixture(host, 'user-prompt', { CWD: root, SESSION: session, TURN, PROMPT: prompt }));
  for (const { cmd, args } of commands) {
    const res = await tk(root, args, { env });
    assert.equal(res.code, 0, res.stderr);
    await hook(root, env, host, 'post-tool', fixture(host, 'post-tool.bash', { CWD: root, SESSION: session, TURN, COMMAND: cmd, STDOUT: res.stdout }));
  }
  const stop = await hook(root, env, host, 'stop', fixture(host, 'stop', { CWD: root, SESSION: session, TURN, MESSAGE: message, STOP_ACTIVE: active }));
  return { up, stop, TURN };
}

/** The Stop block reason, in either host's output form, or null. */
function blockReason(host, stop) {
  if (!stop.out) return null;
  return host === 'codex' ? stop.out.reason : stop.out.hookSpecificOutput.additionalContext;
}

async function proposals(root, env) {
  const res = await tk(root, ['memory', 'list', '--status', 'needs-review', '--json'], { env });
  return (res.json.records || res.json.results || []).filter((r) => r.proposal);
}

function context(up) {
  return up.out ? up.out.hookSpecificOutput.additionalContext : '';
}

// The questions the agents asked in the live runs (dev/test-runs/confirm-d-hindsight/evidence.md s10 and s18; confirm-a-local sP5).
const LIVE_QUESTIONS = [
  'One possible preference to save: give distinct documentation work its own item. **Save it to memory?**',
  'Save this to project memory? Yes or no?',
  "Do you want 'work with me directly on small changes, without helper agents' saved as a standing preference for this project?",
];

// ------------------------------------------------------------------ question forms

test('the exact form allows bold before the colon and "project memory"; a report of an earlier question is not a question', () => {
  assert.deepEqual(proposalQuestions('**Save to memory**: Mike prefers greetings in capitals?'), ['Mike prefers greetings in capitals']);
  assert.deepEqual(proposalQuestions('Save to project memory: The test machine is the Mac mini?'), ['The test machine is the Mac mini']);
  assert.deepEqual(proposalQuestions('Earlier I asked "Save to memory: Mike prefers greetings in capitals?" and you said yes, so I approved it.'), []);
  assert.deepEqual(proposalQuestions('You said yes to "Save to memory: Mike prefers greetings in capitals?", so it is saved.'), []);
  assert.deepEqual(proposalQuestions('Memory already has the deploy day. Save to memory: Deploys stop on Fridays?'), ['Deploys stop on Fridays']);
});

test('looseQuestion finds the live-run questions, and nothing in a message with the exact form or a report', () => {
  for (const q of LIVE_QUESTIONS) assert.ok(looseQuestion(q), q);
  assert.equal(looseQuestion('Save to memory: Mike prefers greetings in capitals?'), null);
  assert.equal(looseQuestion('**Save to memory**: Mike prefers greetings in capitals?'), null);
  assert.equal(looseQuestion('I saved it to memory as project_x. Anything else?'), null);
  assert.equal(looseQuestion('Done. The tests pass.'), null);
  assert.equal(hasKeepPhrase(LOOSE_REASON), false, 'Codex turns the reason into a prompt, so it holds no keep phrase');
  assert.match(LOOSE_REASON, /Save to memory: <one line>\?/);
});

for (const host of HOSTS) {
  test(`${host}: a question in other words blocks once and saves nothing; the exact form then saves the proposal`, async () => {
    const { root, env } = await initProject();
    for (const [i, q] of LIVE_QUESTIONS.entries()) {
      const session = `loose-${host}-${i}`;
      const r = await turn(root, env, host, { session, message: q });
      assert.equal(blockReason(host, r.stop), LOOSE_REASON, q);
      // The agent's answer to the block, in the same turn: stop_hook_active is true.
      seq += 1;
      const again = await hook(root, env, host, 'stop', fixture(host, 'stop', { CWD: root, SESSION: session, TURN: r.TURN, MESSAGE: q, STOP_ACTIVE: true }));
      assert.equal(again.raw, '', 'never twice in one turn');
    }
    assert.equal((await proposals(root, env)).length, 0);
    const exact = await turn(root, env, host, { session: `loose-${host}-exact`, message: 'Understood. **Save to memory**: give distinct documentation work its own work item?' });
    assert.equal(exact.stop.raw, '');
    const list = await proposals(root, env);
    assert.equal(list.length, 1);
    assert.match(list[0].description, /^give distinct documentation work its own work item$/);
  });
}

test('a question in other words does not block when the turn saved to memory', async () => {
  const { root, env } = await initProject();
  const cmd = "toolkit memory save --type user --name capitals --description 'Greetings are in capitals' --body 'Greetings are in capitals.' --approved-by Mike";
  const r = await turn(root, env, 'claude', {
    session: 'loose-saved',
    message: 'I saved your preference. Should I also save the flag order to memory?',
    commands: [{ cmd, args: ['memory', 'save', '--type', 'user', '--name', 'capitals', '--description', 'Greetings are in capitals', '--body', 'Greetings are in capitals.', '--approved-by', 'Mike'] }],
  });
  assert.equal(r.stop.raw, '');
});

test('a reply that only reports an earlier question, or a question whose text the turn saved, saves nothing', async () => {
  const { root, env } = await initProject();
  const reported = await turn(root, env, 'codex', { session: 'reported', message: 'Earlier I asked "Save to memory: Mike prefers greetings in capitals?" and you said yes, so I approved it.' });
  assert.equal(reported.stop.raw, '');
  const fact = 'Mike tests on the Mac mini';
  const cmd = `toolkit memory save --type user --name test-machine --description '${fact}' --body '${fact}.' --approved-by Mike`;
  const saved = await turn(root, env, 'codex', {
    session: 'same-turn',
    message: `Saved to memory: user_test_machine. Save to memory: ${fact}?`,
    commands: [{ cmd, args: ['memory', 'save', '--type', 'user', '--name', 'test-machine', '--description', fact, '--body', `${fact}.`, '--approved-by', 'Mike'] }],
  });
  assert.equal(saved.stop.raw, '');
  assert.equal((await proposals(root, env)).length, 0);
});

// ------------------------------------------------------------------ I6: different facts

test('the closest-match rule does not stop a different fact: names, values, and opposite words differ', () => {
  const body = (s) => `# ${s}\n\n**Remember:** ${s}.\n`;
  const pairs = [
    ['The staging org alias is acme-uat', 'The production org alias is acme-prod'],
    ['Run all tests before each commit', 'Run all tests after each merge'],
    ['Mike reviews pull requests on Fridays', 'Mike merges pull requests on Mondays'],
  ];
  for (const [a, b] of pairs) {
    assert.equal(differsByValue(a, b), true, `${a} / ${b}`);
    const cmp = compareRecords({ description: a, body: body(a) }, { description: b, body: body(b) });
    assert.equal(cmp.similar, false, `${a} / ${b}`);
    assert.equal(cmp.close, false, `${a} / ${b}`);
  }
  // The confirm-d reworded copy is still caught.
  assert.equal(compareRecords({ description: 'Document every command-line flag in the README' }, { description: 'Explain each command-line flag in the README file' }).similar, true);
  assert.equal(differsByValue('Document every command-line flag in the README', 'Explain each command-line flag in the README file'), false);
});

test('toolkit memory save: the production org alias belongs in the staging alias concept, as its own section, never as an update', async () => {
  // Concept memory (Mike, 2026-09-28): a new fact about the same subject goes
  // into that concept as a section; the check names the concept and never
  // tells the agent to overwrite the staging fact.
  const { root, env } = await initProject();
  const save = (name, s, extra = []) => tk(root, ['memory', 'save', '--type', 'project', '--name', name, '--description', s, '--body', `# ${s}\n\n**Remember:** ${s}.\n`, '--approved-by', 'Mike', ...extra, '--json'], { env });
  assert.equal((await save('staging-org-alias', 'The staging org alias is acme-uat')).code, 0);
  const prod = await save('production-org-alias', 'The production org alias is acme-prod');
  assert.equal(prod.code, 2, prod.stdout);
  assert.match(prod.json.error.message, /belongs in the concept project_staging_org_alias/);
  assert.equal(prod.json.error.details.suggestion.concept, 'project_staging_org_alias');
  assert.doesNotMatch(prod.json.error.details.fix, /--expect/);
  // As a section of that concept it is saved: a different value is a different fact.
  const section = await tk(root, ['memory', 'save', '--concept', 'project_staging_org_alias', '--section', 'Production org alias', '--body', 'The production org alias is acme-prod.', '--approved-by', 'Mike', '--json'], { env });
  assert.equal(section.code, 0, section.stdout);
  assert.equal(section.json.section.action, 'added');
  // Now the concept holds that fact, so a separate record of it is a duplicate, named by its section.
  const again = await save('production-org-alias', 'The production org alias is acme-prod', ['--new-concept']);
  assert.equal(again.code, 2, again.stdout);
  assert.match(again.json.error.message, /project_staging_org_alias, in its section "Production org alias", very similar text/);
});

test('Stop hook: the production org alias question is saved as a proposal for the staging alias concept, and no note tells the agent to update the staging record', async () => {
  const { root, env } = await initProject();
  const s = 'The staging org alias is acme-uat';
  assert.equal((await tk(root, ['memory', 'save', '--type', 'project', '--name', 'staging-org-alias', '--description', s, '--body', `# ${s}\n\n**Remember:** ${s}.\n`, '--approved-by', 'Mike'], { env })).code, 0);
  const r = await turn(root, env, 'codex', { session: 'alias', message: 'Save to memory: The production org alias is acme-prod?' });
  assert.equal(r.stop.raw, '');
  const list = await proposals(root, env);
  assert.deepEqual(list.map((x) => x.key), ['project_proposal_the_production_org_alias_is_acme_prod']);
  assert.equal(list[0].concept, 'project_staging_org_alias');
  const next = await turn(root, env, 'codex', { session: 'alias', prompt: 'Later.', message: 'OK.' });
  assert.doesNotMatch(context(next.up), /update that record|--expect/);
  assert.match(context(next.up), /as a memory proposal for the concept project_staging_org_alias \(his yes adds it there as a section\): project_proposal_the_production_org_alias_is_acme_prod/);
});

test('Stop hook: a question about the same subject as a record is saved as a proposal for that concept', async () => {
  const { root, env } = await initProject();
  const s = 'Every work item needs a design';
  assert.equal((await tk(root, ['memory', 'save', '--type', 'project', '--name', 'items-need-design', '--description', s, '--body', `# ${s}\n\n**Remember:** ${s}.\n`, '--approved-by', 'Mike'], { env })).code, 0);
  // The command alone stops it and names the concept, without telling the agent to overwrite the record.
  const t = 'Every work item needs a test plan';
  const direct = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'items-need-test-plan', '--description', t, '--body', `# ${t}\n\n**Remember:** ${t}.\n`, '--approved-by', 'Mike'], { env });
  assert.equal(direct.code, 2);
  assert.match(direct.stderr, /belongs in the concept project_items_need_design/);
  assert.match(direct.stderr, /When it is a different concept, save it again with --new-concept/);
  assert.doesNotMatch(direct.stderr, /--expect/);
  // The Stop hook saves the proposal anyway, for that concept: the owner reviews every proposal.
  const r = await turn(root, env, 'claude', { session: 'subject', message: `Save to memory: ${t}?` });
  assert.equal(r.stop.raw, '');
  const list = await proposals(root, env);
  assert.deepEqual(list.map((x) => x.key), ['project_proposal_every_work_item_needs_a_test_plan']);
  assert.equal(list[0].concept, 'project_items_need_design');
});

// ------------------------------------------------------------------ minor 2: the notes

test('Stop hook: a question like an unanswered proposal names approve and reject, never --expect', async () => {
  const { root, env } = await initProject();
  const first = await turn(root, env, 'claude', { session: 'prop-1', message: 'Save to memory: Mike prefers every command-line flag documented in the README?' });
  assert.equal(first.stop.raw, '');
  const [prop] = await proposals(root, env);
  assert.ok(prop);
  // Another session asks the same fact in other words.
  const second = await turn(root, env, 'claude', { session: 'prop-2', message: 'Save to memory: Mike wants each command-line flag documented in the README file?' });
  assert.equal(second.stop.raw, '');
  assert.equal((await proposals(root, env)).length, 1, 'not saved twice');
  const next = await turn(root, env, 'claude', { session: 'prop-2', prompt: 'Later.', message: 'OK.' });
  const note = context(next.up);
  assert.match(note, new RegExp(`memory already has the proposal ${prop.key} like it, which the owner has not answered`));
  assert.match(note, /toolkit memory approve <key> --by <name>/);
  assert.match(note, /toolkit memory reject <key>/);
  assert.doesNotMatch(note, /--expect/);
});

test('Stop hook: a question that holds a secret is not saved, and the note says so without the secret', async () => {
  const { root, env } = await initProject();
  const r = await turn(root, env, 'codex', { session: 'secret', message: 'Save to memory: The admin password is hunter2 for staging?' });
  assert.equal(r.stop.raw, '');
  assert.equal((await proposals(root, env)).length, 0);
  const next = await turn(root, env, 'codex', { session: 'secret', prompt: 'Later.', message: 'OK.' });
  const note = context(next.up);
  assert.match(note, /looks like it holds a password\. It was not saved: secrets never go in memory/);
  assert.doesNotMatch(note, /hunter2/);
  assert.doesNotMatch(note, /Save it now with toolkit memory save/);
});

// ------------------------------------------------------------------ minor 9: AI credit mid-line

test('the AI credit guard finds a credit in the middle of a line when an AI name follows', () => {
  const tag = checkAiCredit(`git tag -a v1.0 -m "Release 1.0. ${GENERATED}"`);
  assert.deepEqual(tag, { what: 'tag', line: `Release 1.0. ${GENERATED}` });
  const release = checkAiCredit(`gh api repos/acme/app/releases -f tag_name=v1.0 -f 'name=Release 1.0, ${GENERATED_LOWER}'`);
  assert.equal(release && release.what, 'release');
  assert.ok(checkAiCredit(`git commit -m "Docs update, ${WRITTEN_USING}"`));
  assert.equal(checkAiCredit('git commit -m "Fixtures generated with make"'), null);
  assert.equal(aiCreditLine('Notes written by Mike about the Codex hooks'), null);
  assert.equal(aiCreditLine('Tests made with the Codex CLI harness'), null);
  assert.equal(aiCreditLine(TRAILER_IN_SENTENCE), null, 'a Co-Authored-By inside a sentence is not a credit line');
});
