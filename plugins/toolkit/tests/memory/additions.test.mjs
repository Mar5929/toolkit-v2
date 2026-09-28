// The memory additions Mike approved on 2026-09-27 (GOAL "Memory additions"),
// the rules around them, and the memory fixes from the round 3 sample runs:
// - saved proposals: save --proposal, approve, reject, listProposals, and the
//   Lore Status a proposal gets in Notion (proposed, then accepted);
// - the duplicate check in toolkit memory save;
// - clean deletes: forgetInCache;
// - the model's bold labels in a record body (runs a and claude-a);
// - the current focus keeps its heading and "Last updated:" line (runs b and claude-a).

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { requireProject } from '../../lib/core/config.mjs';
import {
  completeFocus, focusShapeProblems, isProposal, modelLabels, parseFocus, proposalText, recordSummary, normalizeRecord, topicBody,
} from '../../lib/memory/contract.mjs';
import { compareRecords, bodyWords } from '../../lib/memory/similar.mjs';
import { recallMatches, recallTier, recordTags, PROPOSAL_TAG } from '../../lib/memory/hindsight.mjs';
import { approveRecord, listProposals, rejectProposal } from '../../lib/memory/proposals.mjs';
import { cachePath, forgetInCache, readCache } from '../../lib/memory/startup.mjs';
import { createDriver as createNotionDriver } from '../../lib/memory/notion.mjs';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureProject } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { FakeNotion, fakeRunner, seedProjects } from '../notion/fake-notion.mjs';
import { body, cleanup, makeProject, runToolkit } from './helpers.mjs';

after(cleanup);

function save(root, name, description, point, extra = []) {
  return runToolkit(['memory', 'save', '--type', 'project', '--name', name, '--description', description, '--body', body(point), ...extra], { cwd: root });
}

// ------------------------------------------------------------------ proposals

test('a proposal is needs-review with a "Proposed by" authorization; a restored record is not a proposal', () => {
  const base = { type: 'project', name: 'x', description: 'X.', source: 'Mike, 2026-09-28', body: body('X.') };
  const p = normalizeRecord({ ...base, status: 'needs-review', authorization: proposalText('2026-09-28') });
  assert.equal(p.authorization, 'Proposed by the agent on 2026-09-28; the owner has not answered');
  assert.equal(isProposal(p), true);
  assert.equal(recordSummary(p).proposal, true);
  assert.equal(isProposal(normalizeRecord({ ...base, status: 'needs-review', authorization: 'Approved by Mike on 2026-09-01' })), false);
  assert.equal(isProposal(normalizeRecord({ ...base, status: 'current', authorization: proposalText('2026-09-28') })), false);
});

test('save --proposal refuses an approver, another status, and a key that is already an approved record', async () => {
  const { root } = makeProject();
  const withApprover = await save(root, 'a', 'A fact.', 'A.', ['--proposal', '--approved-by', 'Mike']);
  assert.equal(withApprover.code, 2);
  assert.match(withApprover.stderr, /A proposal has no approver yet/);
  const withStatus = await save(root, 'a', 'A fact.', 'A.', ['--proposal', '--status', 'current']);
  assert.equal(withStatus.code, 2);
  assert.equal((await save(root, 'kept', 'The kept rule', 'Kept.', ['--approved-by', 'Mike'])).code, 0);
  const version = (await runToolkit(['memory', 'get', 'project_kept', '--json'], { cwd: root })).json.version;
  const over = await save(root, 'kept', 'The kept rule', 'Changed.', ['--proposal', '--expect', version]);
  assert.equal(over.code, 2);
  assert.match(over.stderr, /project_kept is already a current record, so it was not saved as a proposal/);
});

test('a proposal saved again without the owner\'s answer stays a proposal; --status current is refused; --approved-by approves it', async () => {
  const { root } = makeProject();
  assert.equal((await save(root, 'idea', 'An idea to keep', 'An idea.', ['--proposal'])).code, 0);
  const v1 = (await runToolkit(['memory', 'get', 'project_idea', '--json'], { cwd: root })).json.version;
  const again = await save(root, 'idea', 'An idea to keep', 'An idea, reworded.', ['--expect', v1, '--json']);
  assert.equal(again.code, 0, again.stderr);
  assert.equal(again.json.proposal, true);
  const v2 = (await runToolkit(['memory', 'get', 'project_idea', '--json'], { cwd: root })).json.version;
  const forced = await save(root, 'idea', 'An idea to keep', 'An idea.', ['--expect', v2, '--status', 'current']);
  assert.equal(forced.code, 2);
  assert.match(forced.stderr, /is a proposal the owner has not answered, so it cannot be saved as current/);
  const yes = await save(root, 'idea', 'An idea to keep', 'An idea.', ['--expect', v2, '--approved-by', 'Mike', '--json']);
  assert.equal(yes.code, 0, yes.stderr);
  assert.equal(yes.json.proposal, false);
  const rec = (await runToolkit(['memory', 'get', 'project_idea', '--json'], { cwd: root })).json;
  assert.equal(rec.status, 'current');
});

test('approve needs --by, refuses a retired record, changes nothing on a current one, and approves a restored record', async () => {
  const { root } = makeProject();
  await save(root, 'rule', 'A rule for approve', 'Rule.', ['--approved-by', 'Mike']);
  const noBy = await runToolkit(['memory', 'approve', 'project_rule'], { cwd: root });
  assert.equal(noBy.code, 2);
  assert.match(noBy.stderr, /Say who approved it: toolkit memory approve project_rule --by <name>\./);
  const current = await runToolkit(['memory', 'approve', 'project_rule', '--by', 'Mike'], { cwd: root });
  assert.equal(current.code, 0);
  assert.match(current.stdout, /already a current memory record; nothing changed/);
  await runToolkit(['memory', 'retire', 'project_rule'], { cwd: root });
  const retired = await runToolkit(['memory', 'approve', 'project_rule', '--by', 'Mike'], { cwd: root });
  assert.equal(retired.code, 2);
  assert.match(retired.stderr, /is archived, so there is nothing to approve/);
  await runToolkit(['memory', 'restore', 'project_rule'], { cwd: root });
  const restored = await runToolkit(['memory', 'approve', 'project_rule', '--by', 'Mike'], { cwd: root });
  assert.equal(restored.code, 0, restored.stderr);
  const missing = await runToolkit(['memory', 'approve', 'project_nothing', '--by', 'Mike'], { cwd: root });
  assert.equal(missing.code, 1);
});

test('reject deletes only a proposal, repairs links to it, and never touches an approved record', async () => {
  const { root } = makeProject();
  await save(root, 'maybe', 'A possible deploy rule', 'Maybe.', ['--proposal']);
  await runToolkit(['memory', 'save', '--type', 'project', '--name', 'linker', '--description', 'Links to the proposal', '--body', '# Linker\n\n**Remember:** See [maybe](project_maybe.md).\n', '--approved-by', 'Mike'], { cwd: root });
  const res = await runToolkit(['memory', 'reject', 'project_maybe', '--json'], { cwd: root });
  assert.equal(res.code, 0, res.stderr);
  assert.equal(res.json.deleted, true);
  assert.deepEqual(res.json.linksRepaired, ['project_linker']);
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'project_maybe.md')));
  assert.doesNotMatch(fs.readFileSync(path.join(root, '.memory', 'MEMORY.md'), 'utf8'), /project_maybe/);
  const refused = await runToolkit(['memory', 'reject', 'project_linker'], { cwd: root });
  assert.equal(refused.code, 2);
  assert.match(refused.stderr, /project_linker is a current record, so it was not rejected/);
  assert.ok(fs.existsSync(path.join(root, '.memory', 'project_linker.md')));
});

test('list and find mark a proposal; find names the proposals it left out', async () => {
  const { root } = makeProject();
  await save(root, 'friday-release', 'Releases go out on Fridays', 'Releases go out on Fridays.', ['--proposal']);
  const list = await runToolkit(['memory', 'list'], { cwd: root });
  assert.match(list.stdout, /^- project_friday_release \[proposal: the owner has not answered\]: Releases go out on Fridays$/m);
  const find = await runToolkit(['memory', 'find', 'releases', 'fridays'], { cwd: root });
  assert.match(find.stdout, /^No memory records match "releases fridays"\.\n1 saved proposal also matches; it is not a fact until the owner answers\. toolkit memory find 'releases fridays' --proposals shows it\.$/m, 'the printed command quotes the query so it runs as shown');
  const all = await runToolkit(['memory', 'find', 'releases', '--all', '--json'], { cwd: root });
  assert.equal(all.json.results[0].proposal, true);
});

test('listProposals lists the proposals oldest first, and falls back to the cache when the backend cannot be read', async () => {
  const { root } = makeProject();
  for (const [name, description, extra] of [['second', 'The second proposal here', ['--proposal']], ['first', 'The first proposal made', ['--proposal']], ['fact', 'An approved fact only', ['--approved-by', 'Mike']]]) {
    const res = await save(root, name, description, `${description}.`, extra);
    assert.equal(res.code, 0, res.stderr);
  }
  const project = requireProject(root);
  const list = await listProposals(project);
  assert.deepEqual(list.map((p) => p.key), ['project_first', 'project_second']);
  assert.deepEqual(Object.keys(list[0]).sort(), ['description', 'key', 'saved', 'source']);
  assert.match(list[0].saved, /^\d{4}-\d{2}-\d{2}$/);

  // A Hindsight project whose server does not answer: the list comes from the cache.
  const hs = makeProject({ memory: { type: 'hindsight' }, hindsight: { url: 'http://127.0.0.1:9', bank: 'tkv2-test-none' } });
  const hsProject = requireProject(hs.root);
  const file = cachePath(hsProject);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ schema: 2, backend: 'hindsight', identity: 'hindsight tkv2-test-none http://127.0.0.1:9', focus: '', records: [
    { key: 'project_cached', type: 'project', description: 'A cached proposal', status: 'needs-review', proposal: true, saved: '2026-09-27', source: 'Agent session, 2026-09-27' },
    { key: 'project_other', type: 'project', description: 'A fact', status: 'current', proposal: false, saved: '2026-09-27', source: 'Mike' },
  ] }));
  assert.deepEqual(await listProposals(hsProject), [{ key: 'project_cached', description: 'A cached proposal', saved: '2026-09-27', source: 'Agent session, 2026-09-27' }]);
  fs.rmSync(file);
  await assert.rejects(listProposals(hsProject), (err) => err.code === 1);
});

test('Notion (Lore layout): a proposal is Status proposed, approve makes it accepted, reject moves it to the trash', async () => {
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-proposal-'));
  const now = () => new Date('2026-09-28T12:00:00');
  const config = { toolkit: 'toolkit-v2', project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' }, tracker: { type: 'local' }, memory: { type: 'notion', approval: 'onboarding' }, notion: {} };
  const { notion } = await ensureProject({ client, config, mainRoot: root, rootPageId: fake.rootPageId, now });
  config.notion = notion;
  const driver = await createNotionDriver({ root, mainRoot: root, config, env: process.env, now, client, clock: () => Date.parse('2026-09-29T12:00:00Z') });
  const statusOf = (key) => {
    const page = Object.values(fake.pages).find((pg) => pg.properties && pg.properties['Record Key'] && pg.properties['Record Key'].rich_text.map((r) => r.plain_text).join('') === key);
    return page ? { status: page.properties.Status.select && page.properties.Status.select.name, trash: Boolean(page.in_trash) } : null;
  };
  const input = (name) => ({ type: 'project', name, description: `The ${name} idea`, source: 'Agent session, 2026-09-28', status: 'needs-review', authorization: proposalText('2026-09-28'), body: body(`The ${name} idea.`) });
  await driver.save(input('release-day'));
  await driver.save(input('plant-day'));
  assert.deepEqual(statusOf('project_release_day'), { status: 'proposed', trash: false });
  assert.deepEqual((await listProposals({ config, root, mainRoot: root }, { driver })).map((p) => p.key), ['project_plant_day', 'project_release_day']);
  assert.deepEqual((await driver.find('release day idea')).results, [], 'find leaves a proposal out');
  assert.equal((await driver.find('release day idea', { proposals: true })).results[0].key, 'project_release_day');

  const ok = await approveRecord(driver, 'project_release_day', { by: 'Mike', today: '2026-09-28' });
  assert.equal(ok.changed, true);
  assert.deepEqual(statusOf('project_release_day'), { status: 'accepted', trash: false });
  assert.equal((await driver.get('project_release_day')).authorization, 'Approved by Mike on 2026-09-28');
  await assert.rejects(rejectProposal(driver, 'project_release_day'), (err) => err.code === 2);
  const no = await rejectProposal(driver, 'project_plant_day');
  assert.equal(no.trash, true);
  assert.equal(statusOf('project_plant_day').trash, true);
  assert.equal(await driver.get('project_plant_day'), null);
});

test('Hindsight recall: a hit is an answer only by shared words or a very high score; a mid score only may be about it', () => {
  const hit = (score, extra = {}) => ({ key: 'project_stack', description: 'The app uses Node 20', text: '**Remember:** Node 20, no npm packages.', score, ...extra });
  assert.equal(recallTier('What is the office wifi password?', hit(0.000012)), 'none', 'a record that scores like the rest is not an answer');
  assert.equal(recallTier('What is the office wifi password?', hit(0.5)), 'answer', 'a very high score');
  assert.equal(recallTier('What is the office wifi password?', hit(0.001)), 'answer');
  assert.equal(recallTier('packages policy', hit(0.000001)), 'answer', 'half of the words are in the record');
  assert.equal(recallTier('which database does billing use', hit(0.000054)), 'none', 'no word is shared: "use" is too common to count');
  assert.equal(recallTier('Do we use TypeScript?', hit(0.00046, { key: 'project_writing_style', description: 'Replies use plain English', text: 'Replies use plain English.' })), 'maybe',
    'a mid score with only a common word shared may be about it, never an answer');
  // Measured 2026-09-28: the plain-English record scored 0.00028 for this question, which it does not answer.
  assert.equal(recallTier('What language is the backend written in?', hit(0.00028, { key: 'project_writing_style', description: 'Replies use plain English', text: 'Replies use plain English.' })), 'maybe');
  assert.equal(recallTier('what style of replies', hit(0.00006), { noise: 0.000005 }), 'maybe', '12 times the lowest score');
  assert.equal(recallTier('what style of replies', hit(0.00006), { noise: 0.00001 }), 'none', '6 times is not enough');
  assert.equal(recallTier('what style of replies', hit(0.00003), { noise: 0.000001 }), 'none', 'below the floor');
  assert.equal(recallTier('what style of replies', hit(null)), 'none', 'no score and no shared words');
  assert.equal(recallMatches('packages policy', hit(0.000001)), true);
  assert.equal(recallMatches('What language is the backend written in?', hit(0.00028)), false, 'recallMatches is true only for an answer');
});

test('Hindsight tags a saved proposal, so recall can leave it out', () => {
  const r = normalizeRecord({ type: 'project', name: 'x', description: 'X.', source: 'Mike, 2026-09-28', status: 'needs-review', authorization: proposalText('2026-09-28'), body: body('X.') });
  assert.deepEqual(recordTags(r), ['kind:record', 'type:project', 'status:needs-review', PROPOSAL_TAG]);
  assert.deepEqual(recordTags({ ...r, status: 'current' }), ['kind:record', 'type:project', 'status:current']);
});

// ------------------------------------------------------------------ duplicate check

test('compareRecords: the same or nearly the same description or text is similar; a different fact is not', () => {
  assert.equal(compareRecords({ description: 'Deploys happen on Tuesday mornings' }, { description: 'Deploys happen on Thursday mornings' }).similar, true);
  assert.equal(compareRecords({ description: 'The app uses Node 20' }, { description: 'The app uses Postgres 16' }).similar, false);
  assert.equal(compareRecords({ description: 'Stack' }, { description: 'stack.' }).similar, true, 'the same words');
  const a = { description: 'Release notes', body: '# A\n\n**Remember:** Release notes go in docs/releases with one file per version and a date.\n' };
  const b2 = { description: 'Where changelogs live', body: '# B\n\n**Remember:** Release notes go in docs/releases, one file per version, with its date.\n' };
  assert.equal(compareRecords(a, b2).similar, true);
  assert.equal(compareRecords(a, b2).why, 'very similar text');
  assert.deepEqual(bodyWords('# Title\n\n**Remember:** Not stated by the owner.\n\n**Why:** x\n'), [], 'labels and template words are left out');
  // Only the durable point is compared: the same stock reason does not make two facts one.
  const why = '\n\n**Why:** The owner said so in chat on the first day of the project, when he set it up.\n';
  const one = { description: 'Staging host name', body: `# A\n\n**Remember:** The staging host is called blue.${why}` };
  const two = { description: 'Invoice day', body: `# B\n\n**Remember:** Invoices go out on the first of the month.${why}` };
  assert.equal(compareRecords(one, two).similar, false);
});

test('save refuses the same key or a similar record, lists them, and saves with --expect, --supersedes, or --allow-similar', async () => {
  const { root } = makeProject();
  assert.equal((await save(root, 'deploy-day', 'Deploys happen on Tuesday mornings', 'Deploys happen on Tuesday mornings.')).code, 0);
  const same = await save(root, 'deploy-day', 'Deploys happen on Tuesday mornings', 'Deploys happen on Tuesday mornings, early.', ['--json']);
  assert.equal(same.code, 2);
  assert.equal(same.json.error.details.similar[0].key, 'project_deploy_day');
  assert.equal(same.json.error.details.similar[0].why, 'the same key');
  const human = await save(root, 'deploy-day', 'Deploys happen on Tuesday mornings', 'x.');
  assert.match(human.stderr, /^Error: project_deploy_day was not saved: memory already has a record like it\.\n- project_deploy_day, the same key: Deploys happen on Tuesday mornings\nFix: To update project_deploy_day, read it with toolkit memory get project_deploy_day and save again with --expect [0-9a-f]{12}\./);

  const similar = await save(root, 'deploy-thursday', 'Deploys happen on Thursday mornings', 'Deploys happen on Thursday mornings.');
  assert.equal(similar.code, 2);
  assert.match(similar.stderr, /- project_deploy_day, a very similar description: Deploys happen on Tuesday mornings/);
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'project_deploy_thursday.md')), 'nothing was written');

  const version = (await runToolkit(['memory', 'get', 'project_deploy_day', '--json'], { cwd: root })).json.version;
  assert.equal((await save(root, 'deploy-day', 'Deploys happen on Tuesday mornings', 'Deploys happen on Tuesday mornings, early.', ['--expect', version])).code, 0);
  assert.equal((await save(root, 'deploy-thursday', 'Deploys happen on Thursday mornings', 'Deploys happen on Thursday mornings.', ['--supersedes', 'project_deploy_day'])).code, 0);
  assert.equal((await save(root, 'deploy-friday', 'Deploys happen on Friday mornings', 'Deploys happen on Friday mornings.', ['--allow-similar'])).code, 0);
  assert.equal((await save(root, 'stack', 'The app uses Node 20 and no packages', 'Node 20, no npm packages.')).code, 0, 'a different fact saves');
});

// ------------------------------------------------------------------ clean deletes

test('forgetInCache takes records out of the briefing cache at once and leaves the rest', () => {
  const { root } = makeProject({ memory: { type: 'hindsight' }, hindsight: { bank: 'tkv2-test-cache' } });
  const project = requireProject(root);
  const file = cachePath(project);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ schema: 2, backend: 'hindsight', focus: 'x', records: [{ key: 'project_a' }, { key: 'project_b' }, { key: 'project_c' }] }));
  assert.deepEqual(forgetInCache(project, ['project_a', 'project_c']), { ok: true, removed: 2 });
  const after = readCache(project);
  assert.deepEqual(after.records.map((r) => r.key), ['project_b']);
  assert.equal(after.focus, 'x');
  assert.deepEqual(forgetInCache(project, ['project_zzz']), { ok: true, removed: 0 });
});

test('save --supersedes takes the replaced record out of the briefing cache, even when no refresh follows', async () => {
  // Built-in memory does not refresh the cache after a write, so the cache
  // below changes only through forgetInCache: the same path a failed Hindsight
  // or Notion refresh leaves.
  const { root } = makeProject();
  assert.equal((await save(root, 'deploy-day', 'Deploys happen on Tuesday mornings', 'Deploys happen on Tuesday mornings.')).code, 0);
  const project = requireProject(root);
  const file = cachePath(project);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ schema: 2, backend: 'builtin', focus: '', records: [{ key: 'project_deploy_day', status: 'current' }, { key: 'project_other', status: 'current' }] }));
  const res = await save(root, 'deploy-thursday', 'Deploys happen on Thursday mornings', 'Deploys happen on Thursday mornings.', ['--supersedes', 'project_deploy_day']);
  assert.equal(res.code, 0, res.stderr);
  assert.deepEqual(readCache(project).records.map((r) => r.key), ['project_other']);
});

// ------------------------------------------------------------------ labels

test('record bodies get the model\'s bold labels, whatever form the agent wrote', () => {
  const headings = topicBody('## Remember\n\nDeploys on Tuesday.\n\n## Why\n\nThe on-call person is free.\n\n### How to apply\n\nCheck the day.\n\n## Related memories\n\n- [stack](project_stack.md)\n', { name: 'deploy-day' });
  assert.equal(headings, '# Deploy day\n\n**Remember:** Deploys on Tuesday.\n\n**Why:** The on-call person is free.\n\n**How to apply:** Check the day.\n\n**Related memories:**\n\n- [stack](project_stack.md)\n');
  assert.equal(topicBody('# X\n\nRemember: A fact.\n\nWhy: A reason.\n\nEvidence and limits: Chat.\n'), '# X\n\n**Remember:** A fact.\n\n**Why:** A reason.\n\n**Evidence and limits:** Chat.\n');
  assert.equal(topicBody('# X\n\n**Remember:** Remember: a fact.\n'), '# X\n\n**Remember:** a fact.\n', 'the label is not written twice');
  assert.equal(topicBody('# X\n\n**Why**: because.\n\n**remember:** it.\n'), '# X\n\n**Why:** because.\n\n**Remember:** it.\n');
  assert.equal(topicBody('# X\n\n## Remember\n\nRemember: one.\n'), '# X\n\n**Remember:** one.\n');
  assert.equal(modelLabels('```\nWhy: in code\n```'), '```\nWhy: in code\n```', 'code blocks are left alone');
});

test('toolkit memory save writes the labels in the model\'s form', async () => {
  const { root } = makeProject();
  const res = await runToolkit(['memory', 'save', '--type', 'user', '--name', 'short-replies', '--description', 'Mike wants short replies', '--body', '## Remember\n\nRemember: short replies.\n\n## Why\n\nHe reads on a phone.\n', '--approved-by', 'Mike'], { cwd: root });
  assert.equal(res.code, 0, res.stderr);
  const text = fs.readFileSync(path.join(root, '.memory', 'user_short_replies.md'), 'utf8');
  assert.match(text, /\n\*\*Remember:\*\* short replies\.\n\n\*\*Why:\*\* He reads on a phone\.\n$/);
});

// ------------------------------------------------------------------ focus shape

test('completeFocus keeps the heading and a dated Last updated line, and adds them when missing', () => {
  const sections = '## Now\n\n- WI-001\n\n## Waiting on the owner\n\n- None.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- None.\n';
  const bare = completeFocus(sections, { today: '2026-09-28' });
  assert.deepEqual(bare.added, ['heading', 'last updated']);
  assert.equal(bare.text, `# Current focus\n\nLast updated: 2026-09-28, saved with toolkit memory focus\n\n${sections}`);
  const noHeading = completeFocus(`Last updated: 2026-09-28, Mike\n\n${sections}`, { today: '2026-09-28' });
  assert.deepEqual(noHeading.added, ['heading']);
  assert.match(noHeading.text, /^# Current focus\n\nLast updated: 2026-09-28, Mike\n\n## Now/);
  const kept = `# Current focus\n\nLast updated: 2026-09-28, Mike\n\n${sections}`;
  assert.deepEqual(completeFocus(kept, { today: '2026-09-28' }), { text: kept, added: [] }, "today's date and its source are kept");
  const prompt = completeFocus(`# Current focus\n\nLast updated: \`<YYYY-MM-DD, source, and person or agent>\`\n\n${sections}`, { today: '2026-09-28' });
  assert.deepEqual(prompt.added, ['last updated']);
  assert.match(prompt.text, /^Last updated: 2026-09-28, saved with toolkit memory focus$/m);
});

test('completeFocus sets an older or missing date to today, and accepts the bold form', () => {
  const sections = '## Now\n\n- WI-001\n\n## Next session starts with\n\n- None.\n';
  // Last week's focus copied forward and saved today: the save is today's update.
  const old = completeFocus(`# Current focus\n\nLast updated: 2026-09-20, handoff, agent\n\n${sections}`, { today: '2026-09-28' });
  assert.deepEqual(old.added, ['date']);
  assert.equal(old.text, `# Current focus\n\nLast updated: 2026-09-28, saved with toolkit memory focus\n\n${sections}`);
  const noDate = completeFocus(`# Current focus\n\nLast updated: after the WI-002 handoff\n\n${sections}`, { today: '2026-09-28' });
  assert.deepEqual(noDate.added, ['date']);
  assert.match(noDate.text, /^Last updated: 2026-09-28, saved with toolkit memory focus$/m);
  // A bold line is the same line: no second one is added.
  for (const bold of ['**Last updated:** 2026-09-20', '**Last updated**: 2026-09-20']) {
    const res = completeFocus(`# Current focus\n\n${bold}\n\n${sections}`, { today: '2026-09-28' });
    assert.deepEqual(res.added, ['date'], bold);
    assert.equal(res.text.match(/Last updated/g).length, 1, bold);
    assert.match(res.text, /^Last updated: 2026-09-28, saved with toolkit memory focus$/m);
  }
  const boldToday = completeFocus(`# Current focus\n\n**Last updated:** 2026-09-28, Mike\n\n${sections}`, { today: '2026-09-28' });
  assert.deepEqual(boldToday.added, []);
  assert.match(boldToday.text, /^Last updated: 2026-09-28, Mike$/m, "written in the model's plain form");
  assert.deepEqual(focusShapeProblems(`# Current focus\n\n**Last updated:** 2026-09-20\n\n${sections}`), [], 'the bold form has a date');
  assert.equal(parseFocus(`# Current focus\n\n**Last updated:** 2026-09-20, Mike\n\n${sections}`).lastUpdated, '2026-09-20, Mike');
});

test('focusShapeProblems names a missing heading or date, but not in the setup template', () => {
  const template = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'scaffold', 'model', '.memory', 'CURRENT_FOCUS.md'), 'utf8');
  assert.deepEqual(focusShapeProblems(template), []);
  assert.deepEqual(focusShapeProblems(''), []);
  const noHeading = focusShapeProblems('Last updated: 2026-09-27\n\n## Now\n\n- WI-001\n');
  assert.equal(noHeading.length, 1);
  assert.match(noHeading[0], /no "# Current focus" heading/);
  const noDate = focusShapeProblems('# Current focus\n\n## Now\n\n- WI-001\n');
  assert.equal(noDate.length, 1);
  assert.match(noDate[0], /no "Last updated:" line/);
});

test('toolkit memory focus stamps today over last week\'s date and says so', async () => {
  const { root } = makeProject();
  const res = await runToolkit(['memory', 'focus', '--text', '# Current focus\n\n**Last updated:** 2020-01-06, handoff, agent\n\n## Now\n\n- WI-001\n\n## Waiting on the owner\n\n- None.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- None.\n'], { cwd: root });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /^Set "Last updated:" to \d{4}-\d{2}-\d{2}: the text had an older date or none, and this save is today's update\.$/m);
  assert.doesNotMatch(res.stdout, /Added what the model's focus has/);
  const saved = fs.readFileSync(path.join(root, '.memory', 'CURRENT_FOCUS.md'), 'utf8');
  assert.equal(saved.match(/Last updated/g).length, 1);
  assert.doesNotMatch(saved, /2020-01-06/);
  assert.match(saved, /^Last updated: \d{4}-\d{2}-\d{2}, saved with toolkit memory focus$/m);
});

test('memory status (and so doctor) reports a built-in focus that lost its heading or date', async () => {
  const { root } = makeProject();
  await runToolkit(['memory', 'focus', '--text', '# Current focus\n\n## Now\n\n- WI-001\n\n## Waiting on the owner\n\n- None.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- None.\n'], { cwd: root });
  const clean = await runToolkit(['memory', 'status', '--json'], { cwd: root });
  assert.deepEqual(clean.json.problems.filter((p) => /CURRENT_FOCUS/.test(p.where)), [], 'the command added the date');
  // Written past the command (by hand), without either.
  fs.writeFileSync(path.join(root, '.memory', 'CURRENT_FOCUS.md'), '## Now\n\n- WI-001\n\n## Waiting on the owner\n\n- None.\n\n## Untracked to-dos\n\n- None.\n\n## Next session starts with\n\n- None.\n');
  const st = await runToolkit(['memory', 'status', '--json'], { cwd: root });
  const focus = st.json.problems.filter((p) => p.where === '.memory/CURRENT_FOCUS.md').map((p) => p.problem);
  assert.equal(focus.length, 2);
  assert.match(focus.join(' '), /toolkit memory focus --text/);
});
