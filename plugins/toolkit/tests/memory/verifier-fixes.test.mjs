// Fixes for the concept-memory verifier findings of 2026-09-28:
// - section links whose heading holds a bracket or "#" (headingAnchor,
//   findLinks): rename, supersede, split, and the broken-link check follow them;
// - a section save, merge, split, or approve keeps the concept's authorization
//   line, and a fact whose approval differs records it on its section;
// - Hindsight holds a local lock around every read-change-write;
// - a one-fact proposal that names no concept is approved only under a
//   concept name the agent gives (approve --concept);
// - a record merged into a concept leaves MEMORY.md;
// - --type/--name --section to an existing concept keeps its summary;
// - --append adds no second Remember label;
// - the "belongs in the concept" heading is the best match, or none on a tie;
// - memory find shows the section that matched;
// - rename updates the concept of waiting proposals;
// - the Stop hook's proposal saves share one deadline;
// - an index date for a record with no `updated` comes from last_verified.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { today } from '../../lib/core/util.mjs';
import { requireProject } from '../../lib/core/config.mjs';
import { parse as parseFrontmatter } from '../../lib/core/frontmatter.mjs';
import {
  approvalNote, anchorHeading, findLinks, headingAnchor, loadDriver, mergedInto, repairLinks, sameApproval,
} from '../../lib/memory/contract.mjs';
import { addEvidenceNote, editConceptText, editRecordWith, getSection, suggestConcept } from '../../lib/memory/concepts.mjs';
import { HindsightDriver } from '../../lib/memory/hindsight.mjs';
import { saveProposals, proposalNotes, MIN_SAVE_MS } from '../../lib/hooks/stop.mjs';
import { cleanup, makeProject, runToolkit, tempDir } from './helpers.mjs';

after(cleanup);

const DAY = today();

async function tk(root, args, { code = 0 } = {}) {
  const res = await runToolkit(args, { cwd: root });
  assert.equal(res.code, code, `toolkit ${args.join(' ')} gave ${res.code}:\n${res.stdout}${res.stderr}`);
  return res;
}

const read = (root, file) => fs.readFileSync(path.join(root, '.memory', file), 'utf8');
const bodyOf = (root, file) => parseFrontmatter(read(root, file)).body;

function oneFact(root, type, name, description, title, point, extra = []) {
  return tk(root, ['memory', 'save', '--type', type, '--name', name, '--description', description,
    '--body', `# ${title}\n\n**Remember:** ${point}\n`, '--source', 'Mike, 2026-09-20', '--approved-by', 'Mike', '--new-concept', ...extra]);
}

// ------------------------------------------------------------------ 1. brackets and "#" in a section heading

test('headingAnchor writes brackets, "#", and "%" encoded; findLinks reads a target with balanced brackets', () => {
  assert.equal(headingAnchor('Grafana (prod) alerts'), '#Grafana%20%28prod%29%20alerts');
  assert.equal(headingAnchor('Tax #2'), '#Tax%20%232');
  assert.equal(headingAnchor('50% rollout'), '#50%25%20rollout');
  assert.equal(anchorHeading(headingAnchor('Grafana (prod) alerts')), 'grafana (prod) alerts');
  assert.equal(anchorHeading(headingAnchor('Tax #2')), 'tax #2');
  assert.equal(anchorHeading(headingAnchor('50% rollout')), '50% rollout');
  // A link written before the fix, with the brackets as they are, is still a link.
  const links = findLinks('See [alerts](reference_grafana.md#Grafana%20(prod)%20alerts) and [b](b.md).');
  assert.deepEqual(links.map((l) => [l.target, l.anchor]), [['reference_grafana.md', '#Grafana%20(prod)%20alerts'], ['b.md', '']]);
  const fixed = repairLinks('See [alerts](reference_grafana.md#Grafana%20(prod)%20alerts).', '', {
    kind: 'rename', from: 'reference_grafana', to: 'reference_monitoring', fromPath: 'reference_grafana.md', toPath: 'reference_monitoring.md',
  });
  assert.equal(fixed.count, 1);
  assert.match(fixed.text, /\(reference_monitoring\.md#Grafana%20\(prod\)%20alerts\)/);
});

test('a concept with a bracketed section: merge, then rename, and the link follows each time; status finds no broken link', async () => {
  const { root } = makeProject();
  await oneFact(root, 'reference', 'grafana', 'Grafana dashboards for the app', 'Grafana', 'Dashboards are at grafana.example.test.');
  await oneFact(root, 'reference', 'grafana-prod', 'Grafana alerts for production', 'Grafana (prod) alerts', 'Production alerts page the on-call phone.');
  await oneFact(root, 'user', 'role', 'Mike is the only developer and on call', 'Role', 'Mike is on call. See [prod alerts](reference_grafana_prod.md).');
  await tk(root, ['memory', 'merge', 'reference_grafana_prod', '--into', 'reference_grafana', '--approved-by', 'Mike']);
  assert.match(read(root, 'user_role.md'), /\[prod alerts\]\(reference_grafana\.md#Grafana%20%28prod%29%20alerts\)/);
  const renamed = await tk(root, ['memory', 'rename', 'reference_grafana', '--to', 'reference_monitoring', '--json']);
  assert.ok(renamed.json.linksRepaired.includes('user_role'), JSON.stringify(renamed.json));
  assert.match(read(root, 'user_role.md'), /\[prod alerts\]\(reference_monitoring\.md#Grafana%20%28prod%29%20alerts\)/);
  const status = await tk(root, ['memory', 'status', '--json']);
  assert.deepEqual(status.json.problems.filter((p) => /links to/.test(p.problem)), []);
  // A link to a section the concept does not have is still reported.
  fs.appendFileSync(path.join(root, '.memory', 'user_role.md'), '\nSee [tax](reference_monitoring.md#Tax%20%232).\n');
  const broken = await tk(root, ['memory', 'status', '--json']);
  assert.ok(broken.json.problems.some((p) => /a section that reference_monitoring does not have/.test(p.problem)), JSON.stringify(broken.json.problems));
});

// ------------------------------------------------------------------ 2. the approval of one fact

test('approvalNote: none when the save has the concept\'s approval; a note when it differs', () => {
  assert.equal(approvalNote(`Approved by Mike on ${DAY}`, 'Approved by Mike on 2026-09-20', DAY), null);
  assert.equal(approvalNote(`Approved by Mike Rihm on ${DAY}`, 'Approved by Mike on 2026-09-20', DAY), null, 'first name and full name are the same person');
  assert.equal(approvalNote('No approval recorded', 'Approved by Mike on 2026-09-20', DAY), `Saved on ${DAY} with no approval recorded.`);
  assert.equal(approvalNote(`Approved by Mike on ${DAY}`, 'No approval recorded', DAY), `Approved by Mike on ${DAY}.`);
  assert.equal(approvalNote('Trusted grant', 'Approved by Mike on 2026-09-20', DAY), `Trusted grant on ${DAY}.`);
  assert.equal(approvalNote('Proposed by the agent on 2026-09-28; the owner has not answered', 'No approval recorded', DAY), null);
  assert.ok(sameApproval('Approved by Mike', 'Approved by Mike Rihm on 2026-09-01'));
  assert.ok(!sameApproval('Approved by Mike', 'Approved by Anna on 2026-09-01'));
  assert.equal(addEvidenceNote('**Remember:** x.\n\n**Evidence and limits:** Mike, 2026-09-20.\n\n**Related memories:** None.', 'Approved by Anna on 2026-09-28.'),
    '**Remember:** x.\n\n**Evidence and limits:** Mike, 2026-09-20. Approved by Anna on 2026-09-28.\n\n**Related memories:** None.');
  assert.equal(addEvidenceNote('**Remember:** x.\n\n**Evidence and limits:** Saved on 2026-09-20 with no approval recorded.', null, { dropUnapproved: true }), '**Remember:** x.');
});

test('an approved section in an unapproved concept records its approval; the owner\'s later yes to an unapproved section is recorded in it', async () => {
  const { root } = makeProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'invoicing', '--description', 'Invoicing: runs, tax, and currency', '--section', 'Invoice run', '--body', 'Invoices go out on the 1st.']);
  assert.match(read(root, 'project_invoicing.md'), /^authorization: No approval recorded$/m);
  const approved = await tk(root, ['memory', 'save', '--concept', 'project_invoicing', '--section', 'Tax rounding', '--body', 'Tax is rounded per line.', '--approved-by', 'Mike', '--json']);
  assert.equal(approved.json.sectionApproval, `Approved by Mike on ${DAY}.`);
  assert.match(read(root, 'project_invoicing.md'), /^authorization: No approval recorded$/m, 'the concept line is not changed');
  assert.equal(getSection(bodyOf(root, 'project_invoicing.md'), 'Tax rounding'), `**Remember:** Tax is rounded per line.\n\n**Evidence and limits:** Approved by Mike on ${DAY}.`);
  assert.equal(getSection(bodyOf(root, 'project_invoicing.md'), 'Invoice run'), '**Remember:** Invoices go out on the 1st.', 'the concept line covers it');

  // An approved concept: an unapproved section records that, and the owner's
  // later yes to the same words (here with --append) records his approval in it.
  const { root: r2 } = makeProject();
  await tk(r2, ['memory', 'save', '--type', 'project', '--name', 'invoicing', '--description', 'Invoicing: runs, tax, and currency', '--section', 'Invoice run', '--body', 'Invoices go out on the 1st.', '--approved-by', 'Mike']);
  await tk(r2, ['memory', 'save', '--concept', 'project_invoicing', '--section', 'Currency', '--body', 'All invoices are in euros.']);
  assert.equal(getSection(bodyOf(r2, 'project_invoicing.md'), 'Currency'), `**Remember:** All invoices are in euros.\n\n**Evidence and limits:** Saved on ${DAY} with no approval recorded.`);
  assert.match(read(r2, 'project_invoicing.md'), new RegExp(`^authorization: Approved by Mike on ${DAY}$`, 'm'));
  const yes = await tk(r2, ['memory', 'save', '--concept', 'project_invoicing', '--section', 'Currency', '--append', '--body', 'All invoices are in euros.', '--approved-by', 'Mike', '--json']);
  assert.equal(yes.json.section.action, 'approved');
  assert.equal(getSection(bodyOf(r2, 'project_invoicing.md'), 'Currency'), '**Remember:** All invoices are in euros.', 'the "no approval" words go; the concept line covers it now');
  // The same text again: nothing to change.
  const again = await tk(r2, ['memory', 'save', '--concept', 'project_invoicing', '--section', 'Currency', '--append', '--body', 'All invoices are in euros.', '--approved-by', 'Mike', '--json']);
  assert.equal(again.json.changed, false);
});

test('merge and split keep an existing concept\'s authorization; a merged fact with no approval says so in its section', async () => {
  const { root } = makeProject();
  await tk(root, ['memory', 'save', '--type', 'feedback', '--name', 'ways-of-working', '--description', 'How Mike wants the agent to work', '--section', 'Questions', '--body', 'Ask one question at a time.', '--approved-by', 'Anna']);
  await tk(root, ['memory', 'save', '--type', 'feedback', '--name', 'no-tables', '--description', 'No tables in replies', '--body', '# No tables\n\n**Remember:** No tables in replies.\n', '--new-concept']);
  await oneFact(root, 'feedback', 'short-replies', 'Short replies', 'Short replies', 'Keep replies short.');
  await tk(root, ['memory', 'merge', 'feedback_no_tables', 'feedback_short_replies', '--into', 'feedback_ways_of_working', '--approved-by', 'Mike']);
  const text = read(root, 'feedback_ways_of_working.md');
  assert.match(text, /^authorization: Approved by Anna on /m, 'the concept keeps its own line');
  const body = parseFrontmatter(text).body;
  assert.match(getSection(body, 'No tables'), /with no approval recorded\.$/);
  assert.match(getSection(body, 'Short replies'), /Approved by Mike on 2026-09-\d\d\.$/, 'approved by someone other than the concept\'s approver');

  const before = parseFrontmatter(read(root, 'feedback_ways_of_working.md')).data.authorization;
  await tk(root, ['memory', 'split', 'feedback_ways_of_working', '--section', 'Short replies', '--into', 'feedback_replies', '--description', 'How replies are written', '--approved-by', 'Mike']);
  assert.equal(parseFrontmatter(read(root, 'feedback_ways_of_working.md')).data.authorization, before, 'the source keeps its line');
  assert.match(read(root, 'feedback_replies.md'), new RegExp(`^authorization: Approved by Mike on ${DAY}$`, 'm'), 'a concept the split starts has the owner\'s yes');
});

// ------------------------------------------------------------------ 3. Hindsight lock

/** A fake Hindsight client over shared documents; `gate` holds one read until it is opened. */
function hindsightClient(docs, { gate = null } = {}) {
  let reads = 0;
  return {
    bank: 'tkv2-test-lock',
    url: 'http://127.0.0.1:0',
    async bankExists() { return true; },
    async getDocument(id) {
      const snap = docs.has(id) ? { ...docs.get(id) } : null;
      reads++;
      if (gate && reads === 1) await gate;
      return snap;
    },
    async retain(items) {
      for (const it of items) docs.set(it.document_id, { id: it.document_id, original_text: it.content, tags: it.tags, document_metadata: it.metadata });
      return { success: true };
    },
    async listAllDocuments() { return [...docs.values()].map((d) => ({ id: d.id, document_metadata: d.document_metadata, tags: d.tags })); },
    async deleteDocument(id) { return docs.delete(id) ? {} : null; },
  };
}

test('Hindsight: two section saves to one concept at the same time both land (the lock)', async () => {
  const docs = new Map();
  const lockDir = tempDir('hs-lock-');
  const now = () => new Date('2026-09-28T12:00:00');
  await new HindsightDriver({ client: hindsightClient(docs), now, lockDir }).save({
    type: 'project', name: 'billing', description: 'Billing', source: 'Mike, 2026-09-28', body: '# Billing\n\n## Stripe\n\n**Remember:** Stripe.\n',
  }, { expect: 'absent' });
  let open;
  const gate = new Promise((resolve) => { open = resolve; });
  const add = (driver, heading) => editRecordWith(driver, 'project_billing', (s) => {
    const e = editConceptText(s.text, 'project_billing', { heading, content: `**Remember:** ${heading}.`, day: '2026-09-28' });
    return { text: e.text, action: e.action };
  });
  // B takes the lock, reads the old text, and waits; A must wait for B.
  const b = add(new HindsightDriver({ client: hindsightClient(docs, { gate }), now, lockDir }), 'Tax');
  await new Promise((r) => setTimeout(r, 50));
  const a = add(new HindsightDriver({ client: hindsightClient(docs), now, lockDir }), 'Refunds');
  await new Promise((r) => setTimeout(r, 50));
  open();
  const [rb, ra] = await Promise.all([b, a]);
  assert.equal(rb.action, 'added');
  assert.equal(ra.action, 'added');
  const headings = docs.get('project_billing').original_text.match(/^## .*/gm);
  assert.deepEqual(headings, ['## Stripe', '## Tax', '## Refunds'], 'no save lost the other one\'s section');
  assert.ok(!fs.existsSync(path.join(lockDir, '.lock')), 'the lock is gone after the writes');
});

// ------------------------------------------------------------------ 4. a proposal that starts a new concept

test('approve --concept: into an existing concept (its line kept), a new concept, or in place; a wrong type and an event are handled', async () => {
  const { root } = makeProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'testing', '--description', 'How and when tests run', '--section', 'Test command', '--body', 'Run npm test.', '--approved-by', 'Anna']);
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'tests-run-before-every-commit', '--description', 'Tests run before every commit', '--body', '# Tests run before every commit\n\n**Remember:** Tests run before every commit.\n', '--proposal', '--new-concept']);
  const refused = await tk(root, ['memory', 'approve', 'project_tests_run_before_every_commit', '--by', 'Mike', '--json'], { code: 2 });
  assert.match(refused.json.error.message, /it starts a new concept, and its key and title name the fact, not a concept/);
  assert.match(refused.json.error.message, /an existing project concept \(project_testing \(Testing\)\)/);
  assert.deepEqual(refused.json.error.details.concepts, ['project_testing']);
  await tk(root, ['memory', 'approve', 'project_tests_run_before_every_commit', '--by', 'Mike', '--concept', 'user_testing'], { code: 2 });
  const joined = await tk(root, ['memory', 'approve', 'project_tests_run_before_every_commit', '--by', 'Mike', '--concept', 'project_testing', '--json']);
  assert.equal(joined.json.merged, true);
  const text = read(root, 'project_testing.md');
  assert.match(text, /^authorization: Approved by Anna on /m);
  assert.equal(getSection(parseFrontmatter(text).body, 'Tests run before every commit'),
    `**Remember:** Tests run before every commit.\n\n**Evidence and limits:** Agent session, ${DAY}. Approved by Mike on ${DAY}.`);
  assert.ok(!fs.existsSync(path.join(root, '.memory', 'project_tests_run_before_every_commit.md')));

  // An event proposal is its own record: no concept is asked for.
  await tk(root, ['memory', 'save', '--type', 'event', '--name', 'ci-outage', '--description', 'CI was down on 2026-09-27', '--body', '# CI outage\n\n**Remember:** CI was down for two hours.\n', '--proposal']);
  const event = await tk(root, ['memory', 'approve', 'event_ci_outage', '--by', 'Mike', '--json']);
  assert.equal(event.json.changed, true);
  assert.equal(event.json.key, 'event_ci_outage');
});

test('the Stop hook note and toolkit memory get tell the agent to name the concept on a yes', async () => {
  const { root } = makeProject();
  const project = requireProject(root);
  const res = await saveProposals(project, ['The staging database resets every Sunday night'], { cwd: root, env: { ...process.env } });
  assert.equal(res.saved.length, 1);
  const key = res.saved[0].key;
  assert.match(proposalNotes(res)[0], new RegExp(`his yes is toolkit memory approve ${key} --by <name> --concept project_<subject> \\(the concept it goes in`));
  const got = await tk(root, ['memory', 'get', key]);
  assert.match(got.stdout, new RegExp(`His yes: toolkit memory approve ${key} --by <name> --concept project_<subject>`));
  // With no time left in the hook, nothing starts, and the note says why.
  const late = await saveProposals(project, ['The office plant needs water on Mondays'], { cwd: root, env: { ...process.env }, deadline: Date.now() + MIN_SAVE_MS - 500 });
  assert.equal(late.saved.length, 0);
  assert.equal(late.failed[0].error, 'the Stop hook had too little time left to save it');
});

// ------------------------------------------------------------------ 5. the index after a merge

test('records merged into a concept leave MEMORY.md; a plain supersede still shows [superseded]', async () => {
  const { root } = makeProject();
  await oneFact(root, 'feedback', 'no-force-push', 'Never force-push', 'No force-push', 'Never force-push.');
  await oneFact(root, 'feedback', 'plain-replies', 'Replies in plain English', 'Plain replies', 'Write replies in plain English.');
  await oneFact(root, 'feedback', 'one-question', 'One question at a time', 'One question', 'Ask one question at a time.');
  await tk(root, ['memory', 'merge', 'feedback_no_force_push', 'feedback_plain_replies', 'feedback_one_question', '--into', 'feedback_ways_of_working', '--title', 'Ways of working', '--description', 'How Mike wants the agent to work', '--approved-by', 'Mike']);
  const index = read(root, 'MEMORY.md');
  const feedback = index.split('## Feedback')[1].split('## Project')[0].trim().split('\n');
  assert.deepEqual(feedback, [`- [Ways of working](feedback_ways_of_working.md) — How Mike wants the agent to work (updated ${DAY})`]);
  assert.ok(fs.existsSync(path.join(root, '.memory', 'feedback_no_force_push.md')), 'the file stays, so old links resolve');
  const driver = await loadDriver(requireProject(root));
  assert.equal(mergedInto(await driver.get('feedback_no_force_push')), 'feedback_ways_of_working');
  assert.deepEqual((await tk(root, ['memory', 'status', '--json'])).json.problems, []);

  await oneFact(root, 'project', 'deploy-day', 'Deploys on Tuesdays', 'Deploy day', 'Deploys go out on Tuesdays.');
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploys', '--description', 'When deploys go out', '--section', 'Deploy day', '--body', 'Deploys go out on Thursdays.', '--supersedes', 'project_deploy_day', '--approved-by', 'Mike']);
  assert.match(read(root, 'MEMORY.md'), /\(project_deploy_day\.md\) — Deploys on Tuesdays \(updated [\d-]+\) \[superseded\]/);
  assert.equal(mergedInto(await driver.get('project_deploy_day')), null);
});

// ------------------------------------------------------------------ 6. smaller fixes

test('--type/--name --section to a concept that exists keeps its summary and says so', async () => {
  const { root } = makeProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'billing', '--description', 'How billing works: invoice runs, tax rounding, and refunds', '--section', 'Invoice run', '--body', 'Invoices go out on the 1st.', '--approved-by', 'Mike']);
  const res = await tk(root, ['memory', 'save', '--type', 'project', '--name', 'billing', '--description', 'Different summary', '--section', 'Refunds', '--body', 'Refunds are paid within 30 days.', '--approved-by', 'Mike']);
  assert.match(res.stdout, /The summary of project_billing was kept: "How billing works: invoice runs, tax rounding, and refunds"\./);
  assert.match(read(root, 'project_billing.md'), /^description: "How billing works: invoice runs, tax rounding, and refunds"$/m);
  const changed = await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Tax rounding', '--body', 'Tax is rounded per line.', '--description', 'Billing: invoice runs, tax, refunds', '--approved-by', 'Mike']);
  assert.match(changed.stdout, /The summary of project_billing changed from "How billing works: invoice runs, tax rounding, and refunds" to "Billing: invoice runs, tax, refunds"\./);
});

test('the "belongs in the concept" heading is the section that matches best, and none on a tie', async () => {
  const { root } = makeProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'billing', '--description', 'Billing: invoices and refunds', '--section', 'Invoice run', '--body', 'Invoices go out on the 1st.', '--approved-by', 'Mike']);
  await tk(root, ['memory', 'save', '--concept', 'project_billing', '--section', 'Refunds', '--body', 'Refunds are paid back within 30 days.', '--approved-by', 'Mike']);
  const driver = await loadDriver(requireProject(root));
  const s = await suggestConcept(driver, { key: 'project_refund_invoice_rule', type: 'project', name: 'refund-invoice-rule', description: 'Refunds after 30 days need a credit invoice' });
  assert.equal(s.key, 'project_billing');
  assert.equal(s.heading, 'Refunds');
  const tie = await suggestConcept(driver, { key: 'project_refund_invoice_rule', type: 'project', name: 'refund-invoice', description: 'A refund invoice' });
  assert.equal(tie.heading, null, 'a tie names no section');
});

test('memory find shows the section that matched, not the start of the concept', async () => {
  const { root } = makeProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploy', '--description', 'How deploys are approved and when they go out', '--section', 'Deploy approvals', '--body', 'Every deploy needs an approval from Anna in the release channel before it starts.', '--approved-by', 'Mike']);
  await tk(root, ['memory', 'save', '--concept', 'project_deploy', '--section', 'Deploy window', '--body', 'Deploys go out on Tuesdays after 6 pm.', '--approved-by', 'Mike']);
  const res = await tk(root, ['memory', 'find', 'tuesday deploy', '--json']);
  assert.equal(res.json.results[0].key, 'project_deploy');
  assert.match(res.json.results[0].snippet, /^Deploy window: \*\*Remember:\*\* Deploys go out on Tuesdays after 6 pm\./);
});

test('rename points waiting proposals at the new concept key', async () => {
  const { root } = makeProject();
  await tk(root, ['memory', 'save', '--type', 'project', '--name', 'deploy', '--description', 'How deploys work', '--section', 'Deploy window', '--body', 'Deploys go out on Tuesdays.', '--approved-by', 'Mike']);
  const prop = await tk(root, ['memory', 'save', '--concept', 'project_deploy', '--section', 'Freeze', '--body', 'No deploys in the last week of December.', '--proposal', '--json']);
  const renamed = await tk(root, ['memory', 'rename', 'project_deploy', '--to', 'project_releases', '--json']);
  assert.deepEqual(renamed.json.proposalsRetargeted, [prop.json.key]);
  assert.match(read(root, `${prop.json.key}.md`), /^concept: project_releases$/m);
  const yes = await tk(root, ['memory', 'approve', prop.json.key, '--by', 'Mike', '--json']);
  assert.equal(yes.json.key, 'project_releases');
  assert.match(read(root, 'project_releases.md'), /## Freeze/);
});

test('an index date for a record written before concept memory comes from last_verified, not the file time', async () => {
  const { root } = makeProject();
  await oneFact(root, 'project', 'stack', 'The app uses Node 20', 'Stack', 'Node 20.');
  const file = path.join(root, '.memory', 'project_stack.md');
  fs.writeFileSync(file, read(root, 'project_stack.md').replace(/^updated: .*\n/m, '').replace(/^last_verified: .*$/m, 'last_verified: 2026-08-01'));
  await tk(root, ['memory', 'reindex']);
  assert.match(read(root, 'MEMORY.md'), /\(project_stack\.md\) — The app uses Node 20 \(updated 2026-08-01\)/);
  const list = await tk(root, ['memory', 'list', '--json']);
  assert.equal(list.json.records.find((r) => r.key === 'project_stack').updated, '2026-08-01');
});
