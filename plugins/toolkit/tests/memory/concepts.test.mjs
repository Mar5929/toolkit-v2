// Concept memory (Mike, 2026-09-28, dev/GOAL.md "Concept memory, like
// Anthropic's project memory"): one record per concept or area, keeping the
// five prefixes; a title, a one-line summary, and an updated date at the top;
// new facts go into their concept under a heading; a new record only for a new
// concept; events stay their own records; the index lists title, summary, and
// updated date, grouped by prefix. Covered here:
// - the section functions (lib/memory/concepts.mjs);
// - toolkit memory save --concept/--section: add, replace (--expect), append,
//   remove, the lock, the duplicate check that names the concept a fact
//   belongs in, list and index lines;
// - proposals that name their concept, and the Stop hook's proposal;
// - merge, split, and tidy --plan, including a project that already has many
//   one-fact files (nothing changes until the owner's yes), with Obsidian
//   links following to the section;
// - the Hindsight driver (a section save writes the whole document again) and
//   the Notion driver (a section save sends only that section, as update_content).

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { today } from '../../lib/core/util.mjs';
import { requireProject } from '../../lib/core/config.mjs';
import { parse as parseFrontmatter } from '../../lib/core/frontmatter.mjs';
import {
  conceptParts, editConceptText, editRecordWith, getSection, isOneFact, mergeSections, planTidy, sectionText, spliceSection,
  suggestConcept, withEvidence, CONCEPT_MAX_SECTIONS,
} from '../../lib/memory/concepts.mjs';
import {
  brokenLinks, headingAnchor, normalizeRecord, parseRecord, recordSummary, repairLinks, serializeRecord, setUpdated, versionOf,
} from '../../lib/memory/contract.mjs';
import { compareRecords, bodyPoints } from '../../lib/memory/similar.mjs';
import { HindsightDriver } from '../../lib/memory/hindsight.mjs';
import { HindsightClient, DEFAULT_URL } from '../../lib/hindsight/client.mjs';
import { ensureBank } from '../../lib/hindsight/bank.mjs';
import { saveProposals, proposalNotes } from '../../lib/hooks/stop.mjs';
import { listProposals } from '../../lib/memory/proposals.mjs';
import { NotionClient } from '../../lib/notion/client.mjs';
import { ensureProject } from '../../lib/notion/ensure.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { createDriver as createNotionDriver } from '../../lib/memory/notion.mjs';
import { FakeNotion, fakeRunner, seedProjects } from '../notion/fake-notion.mjs';
import { cleanup, makeProject, runToolkit, spawnToolkit } from './helpers.mjs';

after(cleanup);

const DAY = today();

/** Run toolkit in a project and check the exit code. */
async function tk(root, args, { code = 0, stdin } = {}) {
  const res = await runToolkit(args, { cwd: root, stdin });
  assert.equal(res.code, code, `toolkit ${args.join(' ')} gave ${res.code}:\n${res.stdout}${res.stderr}`);
  return res;
}

const read = (root, file) => fs.readFileSync(path.join(root, '.memory', file), 'utf8');

/** A new concept with its first section, approved by Mike. */
function newConcept(root, type, name, description, heading, text, extra = []) {
  return tk(root, ['memory', 'save', '--type', type, '--name', name, '--description', description, '--section', heading, '--body', text, '--approved-by', 'Mike', ...extra]);
}

/** A record in the older one-fact format (no "##" section), saved as its own concept. */
function oneFact(root, type, name, description, point, extra = []) {
  const title = name.replace(/-/g, ' ');
  return tk(root, ['memory', 'save', '--type', type, '--name', name, '--description', description,
    '--body', `# ${title[0].toUpperCase()}${title.slice(1)}\n\n**Remember:** ${point}\n\n**Why:** Not stated by the owner.\n`,
    '--source', 'Mike, 2026-09-20', '--approved-by', 'Mike', '--new-concept', ...extra]);
}

// ------------------------------------------------------------------ the section functions

test('conceptParts and spliceSection: add, replace, append, and remove one section; every other line stays', () => {
  const body = '# Ways of working\n\n## Questions\n\n**Remember:** One question at a time.\n\n```md\n## not a section\n```\n\n## Replies\n\n**Remember:**   Short replies.\n';
  const parts = conceptParts(body);
  assert.equal(parts.title, 'Ways of working');
  assert.equal(parts.lead, '');
  assert.deepEqual(parts.sections.map((s) => s.heading), ['Questions', 'Replies'], 'a heading inside fenced code is not a section');
  assert.equal(getSection(body, ' questions: '), '**Remember:** One question at a time.\n\n```md\n## not a section\n```', 'headings compare without case, spacing, or a colon');

  const added = spliceSection(body, 'Git habits', '**Remember:** No force-push.');
  assert.equal(added.action, 'added');
  assert.equal(added.body, `${body.replace(/\n$/, '')}\n\n## Git habits\n\n**Remember:** No force-push.\n`, 'added at the end; the rest byte for byte');

  const replaced = spliceSection(body, 'questions', '**Remember:** Ask two at most.');
  assert.equal(replaced.action, 'replaced');
  assert.equal(replaced.heading, 'Questions', 'the heading keeps the way the body writes it');
  assert.match(replaced.previous, /One question at a time/);
  assert.ok(replaced.body.endsWith('## Replies\n\n**Remember:**   Short replies.\n'), 'the next section is untouched');
  assert.doesNotMatch(replaced.body, /not a section/, 'the fenced block belonged to the replaced section');

  const appended = spliceSection(body, 'Replies', '**Remember:** No tables.', { mode: 'append' });
  assert.equal(appended.action, 'appended');
  assert.match(appended.body, /## Replies\n\n\*\*Remember:\*\* {3}Short replies\.\n\n\*\*Remember:\*\* No tables\.\n$/);

  const removed = spliceSection(body, 'Questions', '', { mode: 'remove' });
  assert.equal(removed.action, 'removed');
  assert.equal(removed.body, '# Ways of working\n\n## Replies\n\n**Remember:**   Short replies.\n');
  assert.throws(() => spliceSection(body, 'Missing', '', { mode: 'remove' }), /no section "Missing"/);

  assert.equal(spliceSection(body, 'Replies', '**Remember:**   Short replies.').action, 'unchanged');
  assert.ok(isOneFact('# Old\n\n**Remember:** x.\n'));
  assert.ok(!isOneFact(body));
});

test('sectionText: the given text in the model label format, one section at a time', () => {
  assert.equal(sectionText('Keep replies short.', 'Replies'), '**Remember:** Keep replies short.');
  assert.equal(sectionText('# A record title\n\n## Replies\n\n## Why\nThe owner said so.\n\nremember: Keep them short.', 'Replies'),
    '**Why:** The owner said so.\n\n**Remember:** Keep them short.', 'a leading title and the same heading are dropped; labels are bold');
  assert.equal(sectionText('**Remember:** x.\n\n### A detail\n\nMore.', 'Replies'), '**Remember:** x.\n\n### A detail\n\nMore.', 'a ### heading inside a section is fine');
  assert.throws(() => sectionText('**Remember:** x.\n\n## Another sub-topic\n\ny', 'Replies'), /holds its own heading: ## Another sub-topic/);
  assert.throws(() => sectionText('   \n', 'Replies'), /is empty/);
  assert.equal(withEvidence('**Remember:** x.\n\n**Related memories:** None.', 'Mike, 2026-09-20.'),
    '**Remember:** x.\n\n**Evidence and limits:** Mike, 2026-09-20.\n\n**Related memories:** None.', 'evidence goes in the template\'s place');
});

test('editConceptText changes one section and the updated date; every other line keeps its exact text', () => {
  const text = [
    '---',
    'name: feedback_ways_of_working',
    '# a comment the owner wrote',
    'description: How the owner wants the agent to work',
    'metadata:',
    '  type: feedback',
    '  origin: obsidian',
    'status: current',
    'source: Mike, 2026-09-20',
    'last_verified: 2026-09-20',
    'authorization: Approved by Mike on 2026-09-20',
    'supersedes: none',
    'host_field: kept',
    '---',
    '',
    '# Ways of working',
    '',
    '## Questions',
    '',
    '**Remember:**  One question at a time.',
    '',
  ].join('\n');
  const res = editConceptText(text, 'feedback_ways_of_working', {
    heading: 'Replies', content: '**Remember:** Short replies.', day: '2026-09-28', fields: { authorization: 'Approved by Mike on 2026-09-28' },
  });
  assert.equal(res.action, 'added');
  assert.equal(res.text, text
    .replace('description: How the owner wants the agent to work\n', 'description: How the owner wants the agent to work\nupdated: 2026-09-28\n')
    .replace('authorization: Approved by Mike on 2026-09-20', 'authorization: Approved by Mike on 2026-09-28')
    .replace(/\n$/, '\n\n## Replies\n\n**Remember:** Short replies.\n'));
  const { record, problems } = parseRecord(res.text, 'feedback_ways_of_working');
  assert.deepEqual(problems, []);
  assert.equal(record.updated, '2026-09-28');
  assert.deepEqual(record.extra, { host_field: 'kept' });
  // setUpdated puts a new key under description, and changes an existing one in place.
  const data = { name: 'x', description: 'd', metadata: { type: 'user' } };
  assert.deepEqual(Object.keys(setUpdated(data, '2026-09-28')), ['name', 'description', 'updated', 'metadata']);
  assert.deepEqual(Object.keys(setUpdated(data, '2026-09-29')), ['name', 'description', 'updated', 'metadata']);
  assert.equal(data.updated, '2026-09-29');
});

test('the duplicate check compares every section and names the one that holds the same fact', () => {
  const concept = { description: 'How the owner wants the agent to work', body: '# Ways\n\n## Questions\n\n**Remember:** Ask one requirements question at a time and wait for the answer.\n\n## Replies\n\n**Remember:** Keep replies short, plain, and without tables.\n' };
  assert.deepEqual(bodyPoints(concept.body).map((p) => p.heading), ['Questions', 'Replies']);
  const same = compareRecords({ description: 'x', body: '# X\n\n**Remember:** Keep replies short and plain, without tables.\n' }, concept);
  assert.equal(same.similar, true);
  assert.equal(same.section, 'Replies');
  const other = compareRecords({ description: 'x', body: '# X\n\n**Remember:** Deploys go out on Tuesdays after the evening standup.\n' }, concept);
  assert.equal(other.similar, false);
});

// ------------------------------------------------------------------ save --concept --section (built-in)

test('a new concept starts with a section: title, summary, and updated date at the top; the index lists them by prefix', async () => {
  const { root } = makeProject();
  await newConcept(root, 'feedback', 'ways-of-working', 'How Mike wants the agent to work with him', 'Questions', 'Ask one requirements question at a time.');
  const text = read(root, 'feedback_ways_of_working.md');
  assert.match(text, new RegExp(`^---\\nname: feedback_ways_of_working\\ndescription: How Mike wants the agent to work with him\\nupdated: ${DAY}\\nmetadata:\\n  type: feedback\\n`));
  assert.match(text, /\n---\n\n# Ways of working\n\n## Questions\n\n\*\*Remember:\*\* Ask one requirements question at a time\.\n$/);
  const index = read(root, 'MEMORY.md');
  assert.match(index, new RegExp(`## Feedback\\n\\n- \\[Ways of working\\]\\(feedback_ways_of_working\\.md\\) — How Mike wants the agent to work with him \\(updated ${DAY}\\)\\n`));
  const list = await tk(root, ['memory', 'list']);
  assert.equal(list.stdout, `- feedback_ways_of_working: Ways of working — How Mike wants the agent to work with him (updated ${DAY})\n`);
  const json = await tk(root, ['memory', 'list', '--json']);
  assert.equal(json.json.records[0].title, 'Ways of working');
  assert.equal(json.json.records[0].updated, DAY);
  // No starter concepts: a new project has none until a fact is saved.
  const fresh = makeProject();
  assert.equal((await tk(fresh.root, ['memory', 'list'])).stdout, 'No memory records.\n');
});

test('a section is added without rewriting the rest; replacing one needs --expect; --append and --remove work; the output says how to undo', async () => {
  const { root } = makeProject();
  await newConcept(root, 'feedback', 'ways-of-working', 'How Mike wants the agent to work with him', 'Questions', 'Ask one requirements question at a time.');
  const file = path.join(root, '.memory', 'feedback_ways_of_working.md');
  // The owner edits the note in Obsidian: a comment and odd spacing in a section this save does not touch.
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('**Remember:** Ask', '<!-- keep -->\n**Remember:**   Ask'));
  const before = fs.readFileSync(file, 'utf8');

  const add = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Replies', '--body', 'Keep replies short.', '--source', 'Mike, in chat, 2026-09-28', '--approved-by', 'Mike', '--json']);
  assert.equal(add.json.section.action, 'added');
  assert.equal(add.json.key, 'feedback_ways_of_working');
  assert.equal(add.json.replyLine, "Saved to memory: Replies (in Ways of working). Say 'forget that' to undo.");
  const after1 = fs.readFileSync(file, 'utf8');
  const [beforeHead, beforeBody] = before.split('\n---\n');
  const [afterHead, afterBody] = after1.split('\n---\n');
  assert.ok(afterBody.startsWith(beforeBody.replace(/\n$/, '')), 'the old body is kept byte for byte');
  assert.match(afterBody, /## Replies\n\n\*\*Remember:\*\* Keep replies short\.\n\n\*\*Evidence and limits:\*\* Mike, in chat, 2026-09-28\.\n$/);
  assert.equal(afterHead, beforeHead, 'the frontmatter is the same (same day, same approval)');

  // The same heading again: refused without --expect, and nothing changes.
  const refused = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'replies', '--body', 'No tables.', '--approved-by', 'Mike'], { code: 2 });
  assert.match(refused.stderr, /already has a section "replies", so it was not changed/);
  assert.match(refused.stderr, /--expect <version>.*--append/s);
  assert.equal(fs.readFileSync(file, 'utf8'), after1);

  // A stale --expect is refused; the right one replaces only that section.
  await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Replies', '--body', 'No tables.', '--expect', '0123456789ab', '--approved-by', 'Mike'], { code: 2 });
  const got = await tk(root, ['memory', 'get', 'feedback_ways_of_working', '--json']);
  const rep = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Replies', '--body', 'Keep replies under ten lines.', '--expect', got.json.version, '--approved-by', 'Mike', '--json']);
  assert.equal(rep.json.section.action, 'replaced');
  assert.match(rep.json.previous, /Keep replies short/);
  assert.match(rep.json.replyLine, /^Updated in memory: Replies \(in Ways of working\)/);
  assert.ok(fs.readFileSync(file, 'utf8').includes('<!-- keep -->\n**Remember:**   Ask'), 'the other section is untouched');

  // --append adds under a heading it already has.
  const app = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Replies', '--append', '--body', 'No tables in replies.', '--approved-by', 'Mike', '--json']);
  assert.equal(app.json.section.action, 'appended');
  assert.match(getSection(parseFrontmatter(fs.readFileSync(file, 'utf8')).body, 'Replies'), /ten lines\.\n\nNo tables in replies\.$/, 'text added under a heading gets no second Remember label');

  // --remove needs --expect; the undo line of an add is a remove.
  await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Replies', '--remove'], { code: 2 });
  const add2 = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Git', '--body', 'Never force-push.', '--approved-by', 'Mike']);
  const undo = /^Undo: (toolkit memory save .*)$/m.exec(add2.stdout)[1].split(' ').slice(1).map((w) => w.replace(/^'|'$/g, ''));
  const removed = await tk(root, [...undo, '--json']);
  assert.equal(removed.json.section.action, 'removed');
  assert.equal(removed.json.previous, '**Remember:** Never force-push.');
  assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /## Git/);

  // A section of a record that does not exist, a retired one, or with its own ## heading is refused.
  const missing = await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Invoices', '--body', 'x', '--approved-by', 'Mike'], { code: 1 });
  assert.match(missing.stderr, /There is no memory record project_billing/);
  assert.match(missing.stderr, /--type project --name billing --description '<one-line summary of the concept>' --section 'Invoices'/);
  await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'X', '--body', '**Remember:** a.\n\n## Y\n\nb', '--approved-by', 'Mike'], { code: 2 });
  assert.deepEqual((await tk(root, ['memory', 'status', '--json'])).json.problems, []);
});

test('a section save with no approval in onboarding mode prints the note; the concept keeps its approval line and the section records its own', async () => {
  const { root } = makeProject();
  await newConcept(root, 'project', 'billing', 'Billing: Stripe setup, invoices, and refunds', 'Stripe', 'Stripe handles invoices and refunds.');
  const plain = await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Invoice day', '--body', 'Invoices go out on the 1st.']);
  assert.match(plain.stdout, /^Note: this change to project_billing was saved with no approval recorded/m);
  const text = read(root, 'project_billing.md');
  assert.match(text, new RegExp(`^authorization: Approved by Mike on ${DAY}$`, 'm'), 'one unapproved section does not change the concept line (verifier, 2026-09-28)');
  assert.equal(getSection(parseFrontmatter(text).body, 'Invoice day'), `**Remember:** Invoices go out on the 1st.\n\n**Evidence and limits:** Saved on ${DAY} with no approval recorded.`);
  assert.equal(getSection(parseFrontmatter(text).body, 'Stripe'), '**Remember:** Stripe handles invoices and refunds.', 'the approved fact is untouched');
});

test('two section saves at the same moment, from two processes, both land (the lock)', async () => {
  const { root } = makeProject();
  await newConcept(root, 'project', 'billing', 'Billing: Stripe setup, invoices, and refunds', 'Stripe', 'Stripe handles invoices and refunds.');
  const runs = await Promise.all(['Refund window', 'Invoice day', 'Tax rates'].map((h, i) => spawnToolkit(['memory', 'save', '--concept', 'project_billing', '--section', h, '--body', `Fact number ${i} about ${h}.`, '--approved-by', 'Mike'], { cwd: root })));
  for (const r of runs) assert.equal(r.code, 0, r.stderr);
  const parts = conceptParts(parseFrontmatter(read(root, 'project_billing.md')).body);
  assert.deepEqual(parts.sections.map((s) => s.heading).sort(), ['Invoice day', 'Refund window', 'Stripe', 'Tax rates']);
});

test('the duplicate check says which concept a new fact belongs in, instead of saving a second file; --new-concept overrides; events never get one', async () => {
  const { root } = makeProject();
  await newConcept(root, 'project', 'billing', 'Billing: Stripe setup, invoices, and refunds', 'Stripe', 'Stripe handles every invoice, refund, and payment dispute for the shop.');
  const res = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'billing-invoice-day', '--description', 'Billing invoices go out on the 1st of each month', '--body', 'Invoices go out on the 1st.', '--approved-by', 'Mike', '--json'], { code: 2 });
  const err = res.json.error;
  assert.match(err.message, /^project_billing_invoice_day was not saved: it belongs in the concept project_billing \("Billing"\), which shares its words \(billing, invoice\)\./);
  assert.equal(err.details.suggestion.concept, 'project_billing');
  assert.match(err.details.fix, /toolkit memory save --concept project_billing --section 'Billing invoice day' --body-file <file>/);
  assert.match(err.details.fix, /save it again with --new-concept/);
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'project_billing_invoice_day.md')), 'nothing was saved');
  // Another type never belongs in a project concept, and an event is always its own record.
  await tk(root, ['memory', 'save', '--type', 'event', '--name', 'billing-migration', '--description', 'Billing moved to Stripe invoices on 2026-09-01', '--body', 'Moved.', '--approved-by', 'Mike']);
  const ref = await tk(root, ['memory', 'save', '--type', 'reference', '--name', 'billing-dashboard', '--description', 'The Stripe billing dashboard for invoices', '--body', 'It is under Ops.', '--approved-by', 'Mike'], { code: 2 });
  assert.doesNotMatch(ref.stderr, /belongs in the concept/, 'a reference never goes into a project concept');
  assert.match(ref.stderr, /about the same subject/, 'the older same-subject check still asks to compare');
  await tk(root, ['memory', 'save', '--type', 'reference', '--name', 'billing-dashboard', '--description', 'The Stripe billing dashboard for invoices', '--body', 'It is under Ops.', '--approved-by', 'Mike', '--allow-similar']);
  // --new-concept: the agent read the concept and says this is another one.
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'billing-invoice-day', '--description', 'Billing invoices go out on the 1st of each month', '--body', 'Invoices go out on the 1st.', '--approved-by', 'Mike', '--new-concept']);
  // The words of a fact that matches no concept: saved as a new concept at once.
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploy-window', '--description', 'Deploys happen on Tuesdays after 6 pm', '--body', 'Deploys happen on Tuesdays after 6 pm.', '--approved-by', 'Mike']);

  // The same fact already in a section of another record is a duplicate, named by its section.
  const twin = await tk(root, ['memory', 'save', '--concept', 'project_deploy_window', '--section', 'Payment provider', '--body', 'Stripe handles the invoices, refunds, and payment disputes for our shop.', '--approved-by', 'Mike', '--json'], { code: 2 });
  assert.match(twin.json.error.message, /project_billing, in its section "Stripe", very similar text/);
  // And inside the same concept, under another heading.
  const inside = await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Provider', '--body', 'Stripe handles all invoices, refunds, and payment disputes of the shop.', '--approved-by', 'Mike', '--json'], { code: 2 });
  assert.match(inside.json.error.message, /project_billing already holds this fact under "Stripe"/);
});

test('suggestConcept reads the owner\'s name as no subject word and names the closest section', async () => {
  const { root } = makeProject();
  await newConcept(root, 'user', 'profile', 'Mike Rihm: role, working hours, and how he likes updates', 'Working hours', 'Mike works 9 to 5 Eastern.');
  const driver = await (await import('../../lib/memory/contract.mjs')).loadDriver(requireProject(root));
  const s = await suggestConcept(driver, { key: 'user_update_style', type: 'user', name: 'update-style', description: 'Mike likes short updates' }, { ignore: ['Mike', 'Rihm'] });
  assert.equal(s && s.key, 'user_profile', 'updates is a summary word of the profile');
  assert.equal(await suggestConcept(driver, { key: 'user_mike_rihm', type: 'user', name: 'mike-rihm', description: 'Mike Rihm' }, { ignore: ['Mike', 'Rihm'] }), null);
  const w = await suggestConcept(driver, { key: 'user_working_days', type: 'user', name: 'working-days', description: 'Working days are Monday to Thursday' }, { ignore: ['Mike'] });
  assert.equal(w.heading, 'Working hours');
});

// ------------------------------------------------------------------ proposals name their concept

test('a proposal for an existing concept is its own record naming the concept; approve adds it there; reject deletes it', async () => {
  const { root } = makeProject();
  await newConcept(root, 'feedback', 'ways-of-working', 'How Mike wants the agent to work with him', 'Questions', 'Ask one requirements question at a time.');
  const prop = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Reply length', '--body', 'Keep replies under ten lines.', '--proposal', '--json']);
  assert.equal(prop.json.key, 'feedback_proposal_reply_length');
  assert.equal(prop.json.proposal, true);
  assert.equal(prop.json.concept, 'feedback_ways_of_working');
  assert.match(read(root, 'feedback_proposal_reply_length.md'), /^concept: feedback_ways_of_working\nsection: Reply length\n/m);
  assert.doesNotMatch(read(root, 'feedback_ways_of_working.md'), /Reply length/, 'the concept is not changed before the owner answers');
  const list = await tk(root, ['memory', 'list']);
  assert.match(list.stdout, /^- feedback_proposal_reply_length \[proposal for feedback_ways_of_working: the owner has not answered\]: Reply length — Keep replies under ten lines\./m);
  assert.match(read(root, 'MEMORY.md'), /\(feedback_proposal_reply_length\.md\) — Keep replies under ten lines\. \(updated [\d-]+\) \[proposal: not a fact until the owner answers\]/);
  const decisions = await tk(root, ['work', 'decisions']);
  assert.match(decisions.stdout, /feedback_proposal_reply_length: Keep replies under ten lines\. Saved [\d-]+\. A yes adds it to the concept feedback_ways_of_working\./);
  assert.deepEqual((await listProposals(requireProject(root))).map((p) => [p.key, p.concept]), [['feedback_proposal_reply_length', 'feedback_ways_of_working']]);
  // The same proposal name again is refused, never replaced.
  await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Reply length', '--body', 'Keep replies under five lines.', '--proposal'], { code: 2 });

  const yes = await tk(root, ['memory', 'approve', 'feedback_proposal_reply_length', '--by', 'Mike', '--json']);
  assert.equal(yes.json.merged, true);
  assert.equal(yes.json.key, 'feedback_ways_of_working');
  assert.equal(yes.json.section.heading, 'Reply length');
  assert.equal(yes.json.replyLine, "Saved to memory: Reply length (in Ways of working). Say 'forget that' to undo.");
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'feedback_proposal_reply_length.md')), 'the proposal record is gone');
  const concept = read(root, 'feedback_ways_of_working.md');
  assert.match(concept, /## Reply length\n\n\*\*Remember:\*\* Keep replies under ten lines\./);
  assert.match(concept, new RegExp(`^authorization: Approved by Mike on ${DAY}$`, 'm'));

  const second = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Tables', '--body', 'Never use tables in replies.', '--proposal', '--json']);
  const no = await tk(root, ['memory', 'reject', second.json.key, '--json']);
  assert.equal(no.json.deleted, true);
  assert.doesNotMatch(read(root, 'feedback_ways_of_working.md'), /Tables/);

  // A proposal whose concept is gone: the yes names the concept it goes in
  // (verifier, 2026-09-28: it became a record named after its fact).
  const third = await tk(root, ['memory', 'save', '--concept', 'feedback_ways_of_working', '--section', 'Emoji', '--body', 'No emoji in replies.', '--proposal', '--json']);
  await tk(root, ['memory', 'retire', 'feedback_ways_of_working']);
  const refused = await tk(root, ['memory', 'approve', third.json.key, '--by', 'Mike'], { code: 2 });
  assert.match(refused.stderr, /It named the concept feedback_ways_of_working, which is not in memory now\./);
  assert.match(refused.stderr, /--concept feedback_<subject>/);
  assert.ok(fs.existsSync(path.join(root, '.memory', `${third.json.key}.md`)), 'nothing changed');
  const own = await tk(root, ['memory', 'approve', third.json.key, '--by', 'Mike', '--concept', 'feedback_replies', '--title', 'Replies', '--description', 'How Mike wants replies written', '--json']);
  assert.equal(own.json.created, true);
  assert.equal(own.json.key, 'feedback_replies');
  assert.ok(!fs.existsSync(path.join(root, '.memory', `${third.json.key}.md`)), 'the proposal record is gone');
  const replies = read(root, 'feedback_replies.md');
  assert.match(replies, /^description: How Mike wants replies written$/m);
  assert.match(replies, /\n# Replies\n\n## Emoji\n\n\*\*Remember:\*\* No emoji in replies\./);
  assert.doesNotMatch(replies, /^concept:/m);
});

test('Stop hook: an unanswered question whose words match a concept is saved as a proposal for that concept', async () => {
  const { root } = makeProject();
  await newConcept(root, 'feedback', 'ways-of-working', 'How Mike wants the agent to work with him', 'Replies', 'Keep replies plain.');
  const project = requireProject(root);
  const res = await saveProposals(project, ['Keep replies under five lines'], { cwd: root, env: { ...process.env } });
  assert.deepEqual(res.saved, [{ key: 'feedback_proposal_keep_replies_under_five_lines', summary: 'Keep replies under five lines', concept: 'feedback_ways_of_working' }]);
  assert.match(proposalNotes(res)[0], /as a memory proposal for the concept feedback_ways_of_working \(his yes adds it there as a section\): feedback_proposal_keep_replies_under_five_lines/);
  const yes = await tk(root, ['memory', 'approve', 'feedback_proposal_keep_replies_under_five_lines', '--by', 'Mike']);
  assert.match(yes.stdout, /its fact is now in the concept feedback_ways_of_working/);
  const concept = read(root, 'feedback_ways_of_working.md');
  assert.match(concept, /## Keep replies under five lines\n\n\*\*Remember:\*\* Keep replies under five lines\./);
  assert.doesNotMatch(concept, /Do not rely on this/, 'the hook\'s waiting words are gone after the yes');
  // A question that matches no concept is still a proposal for a new concept.
  const other = await saveProposals(project, ['The staging database resets every Sunday night'], { cwd: root, env: { ...process.env } });
  assert.equal(other.saved.length, 1);
  assert.equal(other.saved[0].concept, undefined);
});

// ------------------------------------------------------------------ tidy --plan, merge, split

test('a project with many one-fact files: tidy --plan proposes concepts and changes nothing; merge runs only with the owner\'s yes; links follow to the section', async () => {
  const { root } = makeProject();
  await oneFact(root, 'feedback', 'no-force-push', 'Never force-push to any branch', 'Never force-push.');
  await oneFact(root, 'feedback', 'plain-replies', 'Replies use plain English', 'Write replies in plain English.');
  await oneFact(root, 'feedback', 'one-question', 'Ask one question at a time', 'Ask one question at a time.');
  await oneFact(root, 'project', 'deploy-window', 'Deploys happen on Tuesdays after 6 pm', 'Deploys happen on Tuesdays after 6 pm.');
  await oneFact(root, 'project', 'deploy-checks', 'The deploy checks run in CI first', 'Run the deploy checks in CI. See [deploy window](project_deploy_window.md).');
  await oneFact(root, 'project', 'billing-provider', 'Stripe handles invoices', 'Stripe handles invoices.');
  await oneFact(root, 'user', 'role', 'Mike is the only developer', 'Mike is the only developer.');
  await tk(root, ['memory', 'save', '--type', 'event', '--name', 'moved-off-heroku', '--description', 'Moved off Heroku on 2026-09-01', '--body', 'Moved to Fly.', '--approved-by', 'Mike']);
  await tk(root, ['memory', 'focus', '--text', '# Current focus\n\n## Now\n\n- See [deploy window](project_deploy_window.md).\n\n## Waiting on the owner\n\nNone.\n\n## Untracked to-dos\n\nNone.\n\n## Next session starts with\n\nNone.\n']);
  const vault = path.join(root, '.memory');
  const snapshot = () => Object.fromEntries(fs.readdirSync(vault).filter((f) => f.endsWith('.md')).map((f) => [f, fs.readFileSync(path.join(vault, f), 'utf8')]));
  const before = snapshot();

  const plan = await tk(root, ['memory', 'tidy', '--plan', '--json']);
  assert.equal(plan.json.changed, false);
  assert.deepEqual(plan.json.merges.map((m) => [m.into, m.exists, m.members.map((x) => x.key)]), [
    ['feedback_ways_of_working', false, ['feedback_no_force_push', 'feedback_one_question', 'feedback_plain_replies']],
    ['project_deploy', false, ['project_deploy_checks', 'project_deploy_window']],
  ]);
  assert.deepEqual(plan.json.stay.map((s) => s.key).sort(), ['event_moved_off_heroku', 'project_billing_provider', 'user_role']);
  const human = await tk(root, ['memory', 'tidy', '--plan']);
  assert.match(human.stdout, /^Concept memory plan\. Nothing was changed/);
  assert.match(human.stdout, /toolkit memory merge project_deploy_checks project_deploy_window --into project_deploy --title 'Deploy' --description '.+' --approved-by <owner>/);
  assert.deepEqual(snapshot(), before, 'the plan changed no file');
  await tk(root, ['memory', 'tidy'], { code: 2 });

  // Without the owner's yes, nothing is merged.
  const noYes = await tk(root, ['memory', 'merge', 'project_deploy_window', 'project_deploy_checks', '--into', 'project_deploys', '--description', 'When and how deploys happen'], { code: 2 });
  assert.match(noYes.stderr, /needs the owner's yes: add --approved-by <owner>/);
  assert.deepEqual(snapshot(), before);

  const merged = await tk(root, ['memory', 'merge', 'project_deploy_window', 'project_deploy_checks', '--into', 'project_deploys', '--title', 'Deploys', '--description', 'When and how deploys happen', '--approved-by', 'Mike', '--json']);
  assert.equal(merged.json.created, true);
  assert.deepEqual(merged.json.merged.map((m) => [m.key, m.heading, m.retired]), [['project_deploy_window', 'Deploy window', true], ['project_deploy_checks', 'Deploy checks', true]]);
  const concept = read(root, 'project_deploys.md');
  assert.match(concept, /^supersedes: \[project_deploy_window, project_deploy_checks\]$/m);
  assert.match(concept, /^last_verified: [\d-]+$/m);
  assert.match(concept, /# Deploys\n\n## Deploy window\n\n\*\*Remember:\*\* Deploys happen on Tuesdays after 6 pm\.\n\n\*\*Why:\*\* Not stated by the owner\.\n\n\*\*Evidence and limits:\*\* Mike, 2026-09-20\.\n\n## Deploy checks\n/);
  assert.match(concept, /See \[deploy window\]\(project_deploys\.md#Deploy%20window\)\./, 'a link between two merged records points at the section');
  assert.match(read(root, 'project_deploy_window.md'), /^status: superseded$/m);
  assert.match(read(root, 'project_deploy_window.md'), /Replaced by \[project_deploys\]\(project_deploys\.md#Deploy%20window\)\. Merged into project_deploys, section "Deploy window"\./);
  assert.match(read(root, 'CURRENT_FOCUS.md'), /See \[deploy window\]\(project_deploys\.md#Deploy%20window\)\./, 'links elsewhere follow to the section');
  // Obsidian links still work: every link points at a file that exists.
  assert.deepEqual((await tk(root, ['memory', 'status', '--json'])).json.problems, []);
  for (const f of fs.readdirSync(vault).filter((x) => x.endsWith('.md'))) {
    assert.deepEqual(brokenLinks(read(root, f), '', { exists: (p) => fs.existsSync(path.join(vault, p)) }), [], f);
  }
  assert.match(read(root, 'MEMORY.md'), /- \[Deploys\]\(project_deploys\.md\) — When and how deploys happen \(updated [\d-]+\)\n/);

  // The feedback merge into the default concept, then the plan has nothing left to merge.
  await tk(root, ['memory', 'merge', 'feedback_no_force_push', 'feedback_one_question', 'feedback_plain_replies', '--into', 'feedback_ways_of_working', '--description', 'How Mike wants the agent to work', '--approved-by', 'Mike']);
  const after2 = await tk(root, ['memory', 'tidy', '--plan', '--json']);
  assert.deepEqual(after2.json.merges, []);
  // A later one-fact file whose words match an existing concept is planned into it.
  await oneFact(root, 'project', 'deploy-freeze', 'No deploys during the December freeze', 'No deploys from Dec 20 to Jan 2.');
  const again = await tk(root, ['memory', 'tidy', '--plan', '--json']);
  assert.deepEqual(again.json.merges.map((m) => [m.into, m.exists, m.members.map((x) => x.key)]), [['project_deploys', true, ['project_deploy_freeze']]]);
  // Merge refuses a different type, an event, and a proposal.
  await tk(root, ['memory', 'merge', 'user_role', '--into', 'project_deploys', '--approved-by', 'Mike'], { code: 2 });
  await tk(root, ['memory', 'merge', 'event_moved_off_heroku', '--into', 'project_deploys', '--approved-by', 'Mike'], { code: 2 });
});

test('split moves sections to another concept, and links to those sections follow; tidy --plan names a concept that grew too large', async () => {
  const { root } = makeProject();
  await newConcept(root, 'project', 'billing', 'Billing: Stripe setup, invoices, and refunds', 'Stripe', 'Stripe handles invoices and refunds.');
  await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Refund window', '--body', 'Refunds are allowed for 30 days.', '--approved-by', 'Mike']);
  await newConcept(root, 'reference', 'dashboards', 'Where the dashboards live', 'Refunds', 'See [refund window](project_billing.md#Refund%20window) and [billing](project_billing.md).');
  const res = await tk(root, ['memory', 'split', 'project_billing', '--section', 'refund window', '--into', 'project_refunds', '--description', 'Refund rules', '--approved-by', 'Mike', '--json']);
  assert.equal(res.json.created, true);
  assert.deepEqual(res.json.linksRepaired, ['reference_dashboards']);
  assert.doesNotMatch(read(root, 'project_billing.md'), /Refund window/);
  assert.match(read(root, 'project_refunds.md'), /# Refunds\n\n## Refund window\n\n\*\*Remember:\*\* Refunds are allowed for 30 days\./);
  const dash = read(root, 'reference_dashboards.md');
  assert.match(dash, /\[refund window\]\(project_refunds\.md#Refund%20window\)/, 'a link to the moved section follows it');
  assert.match(dash, /\[billing\]\(project_billing\.md\)/, 'a link to the concept stays');
  await tk(root, ['memory', 'split', 'project_billing', '--section', 'Stripe', '--into', 'project_refunds'], { code: 2 });

  // A concept with too many sections is named in the plan.
  for (let i = 0; i <= CONCEPT_MAX_SECTIONS; i++) {
    await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', `Rule ${i}`, '--body', `Billing rule number ${i} is about case ${i * 7} only.`, '--approved-by', 'Mike', '--allow-similar']);
  }
  const plan = await tk(root, ['memory', 'tidy', '--plan', '--json']);
  assert.deepEqual(plan.json.large.map((l) => l.key), ['project_billing']);
  assert.match((await tk(root, ['memory', 'tidy', '--plan'])).stdout, /project_billing \("Billing"\) has 22 sections .* toolkit memory split project_billing --section '<heading>'/);
});

test('a removed section: links to it point at the concept itself; status reports a link to a section that does not exist', async () => {
  const { root } = makeProject();
  await newConcept(root, 'project', 'billing', 'Billing: Stripe setup, invoices, and refunds', 'Stripe', 'Stripe handles invoices and refunds.');
  await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Refund window', '--body', 'Refunds are allowed for 30 days.', '--approved-by', 'Mike']);
  await newConcept(root, 'reference', 'dashboards', 'Where the dashboards live', 'Refunds', 'See [refund window](project_billing.md#Refund%20window).');
  const got = await tk(root, ['memory', 'get', 'project_billing', '--json']);
  const res = await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Refund window', '--remove', '--expect', got.json.version, '--approved-by', 'Mike', '--json']);
  assert.deepEqual(res.json.linksRepaired, ['reference_dashboards']);
  assert.match(read(root, 'reference_dashboards.md'), /See \[refund window\]\(project_billing\.md\)\./);
  assert.deepEqual((await tk(root, ['memory', 'status', '--json'])).json.problems, []);
  // A link the owner wrote by hand to a heading that is not there is reported.
  const file = path.join(root, '.memory', 'reference_dashboards.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('project_billing.md)', 'project_billing.md#Chargebacks)'));
  const st = await tk(root, ['memory', 'status', '--json']);
  assert.match(st.json.problems.map((p) => p.problem).join(' '), /links to project_billing\.md#Chargebacks, a section that project_billing does not have/);
});

test('planTidy groups by subject word and type, never moves events, and names new concepts after the shared word', () => {
  const rec = (key, description, body) => normalizeRecord({ key, description, source: 'Mike, 2026-09-20', body }, { today: '2026-09-20' });
  const plan = planTidy([
    rec('project_api_rate_limit', 'The API allows 100 requests a minute', '# API rate limit\n\n**Remember:** 100 a minute.\n'),
    rec('project_api_keys_location', 'API keys live in 1Password', '# API keys location\n\n**Remember:** In 1Password.\n'),
    rec('event_api_outage', 'The API was down on 2026-09-10', '# API outage\n\n**Remember:** Down.\n'),
    rec('reference_status_page', 'The status page URL', '# Status page\n\n**Remember:** status.example.com\n'),
  ]);
  assert.deepEqual(plan.merges.map((m) => [m.into, m.title, m.members.map((x) => x.key)]), [['project_api', 'Api', ['project_api_keys_location', 'project_api_rate_limit']]]);
  assert.ok(plan.merges[0].description.length <= 150);
  assert.deepEqual(plan.stay.map((s) => s.key).sort(), ['event_api_outage', 'reference_status_page']);
  const merged = mergeSections('# Api\n', [rec('project_api_rate_limit', 'x', '# API rate limit\n\n**Superseded 2026-09-01:** old.\n\n**Remember:** 100.\n')]);
  assert.equal(merged.body, '# Api\n\n## API rate limit\n\n**Remember:** 100.\n\n**Evidence and limits:** Mike, 2026-09-20.\n', 'a dated status line is history, not a fact');
});

// ------------------------------------------------------------------ Hindsight: one document per concept

/** An in-memory stand-in for the Hindsight client: documents with text, tags, and metadata. */
function fakeHindsightClient() {
  const docs = new Map();
  return {
    bank: 'tkv2-test-fake',
    url: 'http://127.0.0.1:0',
    docs,
    writes: [],
    async bankExists() { return true; },
    async getDocument(id) { return docs.has(id) ? { ...docs.get(id) } : null; },
    async retain(items) {
      for (const it of items) {
        this.writes.push(it.document_id);
        docs.set(it.document_id, { id: it.document_id, original_text: it.content, tags: it.tags, document_metadata: it.metadata, updated_at: new Date().toISOString() });
      }
      return { success: true };
    },
    async listAllDocuments() { return [...docs.values()].map((d) => ({ id: d.id, document_metadata: d.document_metadata, tags: d.tags })); },
    async deleteDocument(id) { return docs.delete(id) ? {} : null; },
  };
}

test('Hindsight: one document per concept; a section save writes that document again with every other line kept; list gives title, summary, and updated date', async () => {
  const client = fakeHindsightClient();
  const driver = new HindsightDriver({ client, now: () => new Date('2026-09-28T12:00:00') });
  await driver.save({ type: 'project', name: 'billing', description: 'Billing: Stripe setup, invoices, and refunds', source: 'Mike, 2026-09-28', body: '# Billing\n\n## Stripe\n\n**Remember:**  Stripe handles invoices.\n' }, { expect: 'absent' });
  const first = client.docs.get('project_billing').original_text;
  const res = await editRecordWith(driver, 'project_billing', (stored) => {
    const e = editConceptText(stored.text, 'project_billing', { heading: 'Refunds', content: '**Remember:** 30 days.', day: '2026-09-29' });
    return { text: e.text, action: e.action };
  });
  assert.equal(res.action, 'added');
  const text = client.docs.get('project_billing').original_text;
  assert.equal(text, first.replace('updated: 2026-09-28', 'updated: 2026-09-29').replace(/\n$/, '\n\n## Refunds\n\n**Remember:** 30 days.\n'));
  assert.equal(res.version, versionOf(text));
  assert.deepEqual(client.writes, ['project_billing', 'project_billing'], 'the whole document, once per save');
  const meta = client.docs.get('project_billing').document_metadata;
  assert.equal(meta.title, 'Billing');
  assert.equal(meta.updated, '2026-09-29');
  assert.equal(meta.sections, 'Stripe | Refunds');
  const [summary] = await driver.list();
  assert.equal(summary.title, 'Billing');
  assert.equal(summary.updated, '2026-09-29');
  // A stale --expect is refused before anything is written.
  await assert.rejects(editRecordWith(driver, 'project_billing', (s) => ({ text: s.text }), { expect: '0123456789ab' }), /changed since it was read/);
  assert.equal(client.writes.length, 2);
});

const hindsight = new HindsightClient({ url: DEFAULT_URL });
let hindsightUp = false;
const liveBanks = [];
before(async () => {
  try {
    const h = await hindsight.health({ timeoutMs: 2000 });
    hindsightUp = Boolean(h && h.status === 'healthy');
  } catch {
    hindsightUp = false;
  }
});
after(async () => {
  for (const bank of liveBanks) {
    if (!bank.startsWith('tkv2-test-')) continue;
    try {
      await hindsight.deleteBank(bank);
    } catch {
      // Already gone.
    }
  }
});

test('Hindsight (live server): a concept saved with a section, a section added, list and find read it as one document', { timeout: 120000 }, async (t) => {
  if (!hindsightUp) {
    t.skip(`the Hindsight server is not running at ${DEFAULT_URL}`);
    return;
  }
  const bank = `tkv2-test-concept-${crypto.randomBytes(3).toString('hex')}`;
  liveBanks.push(bank);
  await ensureBank({ client: hindsight, bank, projectKey: bank, claimed: true });
  const { root } = makeProject({ memory: { type: 'hindsight' }, hindsight: { url: DEFAULT_URL, bank }, key: bank });
  await newConcept(root, 'project', 'billing', 'Billing: Stripe setup, invoices, and refunds', 'Stripe', 'Stripe handles invoices and refunds.');
  const add = await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Refund window', '--body', 'Refunds are allowed for 30 days.', '--approved-by', 'Mike', '--json']);
  assert.equal(add.json.section.action, 'added');
  const got = await tk(root, ['memory', 'get', 'project_billing', '--json']);
  assert.deepEqual(conceptParts(got.json.body).sections.map((s) => s.heading), ['Stripe', 'Refund window']);
  const list = await tk(root, ['memory', 'list']);
  assert.match(list.stdout, new RegExp(`^- project_billing: Billing — Billing: Stripe setup, invoices, and refunds \\(updated ${DAY}\\)$`, 'm'));
  const found = await tk(root, ['memory', 'find', 'refund window days', '--json']);
  assert.deepEqual([...new Set(found.json.results.map((r) => r.key))], ['project_billing'], 'one document per concept');
});

// ------------------------------------------------------------------ Notion: one Memories row per concept

async function notionSetup() {
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const client = new NotionClient({ rootPageId: fake.rootPageId, runner: fakeRunner(fake), minIntervalMs: 0 });
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os_tmp()), 'notion-concept-'));
  const now = () => new Date('2026-09-28T12:00:00');
  const config = {
    toolkit: 'toolkit-v2',
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike' },
    tracker: { type: 'local' },
    memory: { type: 'notion', approval: 'onboarding' },
    notion: {},
  };
  const { notion } = await ensureProject({ client, config, mainRoot: root, rootPageId: fake.rootPageId, now });
  config.notion = notion;
  const driver = await createNotionDriver({ root, mainRoot: root, config, env: process.env, now, client, clock: () => Date.parse('2026-09-29T12:00:00Z') });
  return { fake, driver, root };
}

/** The Record Key of a Memories row in the fake. */
function recordKeyOf(page) {
  const v = page.properties && page.properties['Record Key'];
  return v && Array.isArray(v.rich_text) ? v.rich_text.map((r) => r.plain_text).join('') : '';
}

function os_tmp() {
  return process.env.TMPDIR || '/tmp';
}

test('Notion: one Memories row per concept; a section save sends only that section as update_content, and keeps an owner edit in another section', async () => {
  const { fake, driver } = await notionSetup();
  await driver.save({ type: 'project', name: 'billing', description: 'Billing: Stripe setup, invoices, and refunds', source: 'Mike, 2026-09-28', body: '# Billing\n\n## Stripe\n\n**Remember:** Stripe handles invoices.\n\n## Refunds\n\n**Remember:** 30 days.\n' }, { expect: 'absent' });
  const rows = Object.values(fake.pages).filter((p) => recordKeyOf(p) === 'project_billing');
  assert.equal(rows.length, 1, 'one Memories row for the whole concept');
  const [summary] = await driver.list();
  assert.equal(summary.title, 'Billing');
  assert.equal(summary.updated, '2026-09-28');

  const before = fake.calls.length;
  const res = await editRecordWith(driver, 'project_billing', (stored) => {
    // The owner edits the Refunds section in Notion while this save is being prepared.
    const page = rows[0];
    page.markdown = page.markdown.replace('30 days.', '30 days, owner edit.');
    page.last_edited_time = fake.now();
    const e = editConceptText(stored.text, 'project_billing', { heading: 'Invoice day', content: '**Remember:** The 1st of each month.', day: '2026-09-29' });
    return { text: e.text, action: e.action };
  });
  assert.equal(res.action, 'added');
  const patches = fake.calls.slice(before).filter((c) => c.method === 'PATCH' && c.path.endsWith('/markdown'));
  assert.equal(patches.length, 1);
  assert.equal(patches[0].body.type, 'update_content', 'a targeted update, not the whole page');
  const ops = patches[0].body.update_content.content_updates;
  assert.ok(ops.every((op) => !op.new_str.includes('Stripe handles')), JSON.stringify(ops));
  assert.ok(ops.some((op) => op.new_str.includes('## Invoice day')), JSON.stringify(ops));
  const got = await driver.get('project_billing');
  assert.deepEqual(conceptParts(got.body).sections.map((s) => s.heading), ['Stripe', 'Refunds', 'Invoice day']);
  assert.match(got.body, /30 days, owner edit\./, 'the owner\'s edit in another section is kept');
  assert.equal(got.updated, '2026-09-29');
  assert.equal(recordSummary(got).updated, '2026-09-29');
  assert.match(got.text, /^updated: 2026-09-29$/m);
});

test('a record summary carries the title, the updated date, and a proposal\'s concept', () => {
  const r = normalizeRecord({ key: 'feedback_proposal_tables', description: 'No tables', source: 'Agent, 2026-09-28', status: 'needs-review', authorization: 'Proposed by the agent on 2026-09-28; the owner has not answered', body: '# Tables\n\n**Remember:** No tables.\n', extra: { concept: 'feedback_ways_of_working', section: 'Tables' } }, { today: '2026-09-28' });
  const s = recordSummary(r);
  assert.equal(s.title, 'Tables');
  assert.equal(s.updated, '2026-09-28');
  assert.equal(s.concept, 'feedback_ways_of_working');
  assert.equal(s.section, 'Tables');
  assert.match(serializeRecord(r), /^concept: feedback_ways_of_working\nsection: Tables\n---/m);
  assert.equal(repairLinks('[w](project_a.md)', '', { kind: 'supersede', from: 'project_a', to: 'project_b', anchor: headingAnchor('Deploy window') }).text, '[w](project_b.md#Deploy%20window)');
  assert.equal(repairLinks('[[project_a]]', '', { kind: 'supersede', from: 'project_a', to: 'project_b', anchor: headingAnchor('Deploy window') }).text, '[[project_b#Deploy window]]');
});
