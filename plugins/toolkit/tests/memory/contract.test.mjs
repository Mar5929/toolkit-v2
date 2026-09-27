import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  keyFor, splitKey, isValidKey, assertKey, canonicalKey, normalizeName, NAME_MAX, normalizeRecord, validateRecord, assertValidRecord,
  serializeRecord, parseRecord, checkExpect, versionOf, validateFocus, assertValidFocus, keywordScore, searchTerms,
  changeRecordStatus, retireNote, restoreNote, matchesFilter, countRecords, sortRecords, loadDriver, isPlaceholder,
  DESCRIPTION_MAX, FOCUS_SECTIONS, NO_AUTHORIZATION, topicBody, parseFocus, findLinks, repairLinks, rebaseLinks, brokenLinks,
  changeSupersedes, renameRecordText, supersededByFromBody, approverFrom, storedStatus, latestStatusNote, repairLinksWithDriver,
  fitLinks, recordSummary,
} from '../../lib/memory/contract.mjs';
import { readTemplate } from '../../lib/core/templates.mjs';
import { EXIT } from '../../lib/core/output.mjs';
import { cleanup, tempDir } from './helpers.mjs';

after(cleanup);

const base = () => normalizeRecord({
  type: 'feedback',
  name: 'deploy-window',
  description: 'Deploys happen on Tuesday mornings only.',
  source: 'Mike in chat, 2026-09-26',
  body: '# Deploy window\n\n**Remember:** Deploy only on Tuesday mornings.\n',
}, { today: '2026-09-26' });

test('keys: type plus name with dashes turned into underscores, and back', () => {
  assert.equal(keyFor('feedback', 'deploy-window'), 'feedback_deploy_window');
  assert.deepEqual(splitKey('feedback_deploy_window'), { type: 'feedback', name: 'deploy-window' });
  assert.equal(splitKey('focus'), null);
  assert.equal(splitKey('other_thing'), null);
  assert.ok(isValidKey('event_2026_launch'));
  assert.ok(!isValidKey('Feedback_x'));
  assert.throws(() => assertKey('nope'), (err) => err.code === EXIT.INVALID);
  assert.equal(normalizeName('Deploy Window!'), 'deploy-window');
  assert.equal(normalizeName('account_data_model'), 'account-data-model');
});

test('a key typed with dashes (as the memory skill writes them) finds the same record', () => {
  assert.equal(canonicalKey('feedback_no-force-push'), 'feedback_no_force_push');
  assert.equal(canonicalKey('feedback-no-force-push'), 'feedback_no_force_push');
  assert.equal(canonicalKey(' Project_Payments-API '), 'project_payments_api');
  assert.equal(canonicalKey('focus'), 'focus');
  assert.equal(assertKey('feedback_no-force-push'), 'feedback_no_force_push');
  assert.equal(assertKey('feedback_merge-only-by-pull-request'), 'feedback_merge_only_by_pull_request');
  assert.ok(!isValidKey('feedback_no-force-push'), 'stored keys stay in one spelling');
  assert.throws(() => assertKey('idea_x'), (err) => err.code === EXIT.INVALID);
  const r = normalizeRecord({ key: 'feedback_no-force-push', description: 'd', source: 's', body: 'b', status: 'retired', superseded_by: 'feedback_new-rule' }, { today: '2026-09-26' });
  assert.equal(r.key, 'feedback_no_force_push');
  assert.equal(r.name, 'no-force-push');
  assert.equal(r.superseded_by, 'feedback_new_rule');
});

test('normalizeRecord fills defaults and computes the key', () => {
  const r = base();
  assert.equal(r.key, 'feedback_deploy_window');
  assert.equal(r.status, 'current');
  assert.equal(r.superseded_by, null);
  assert.equal(r.saved, '2026-09-26');
  assert.equal(r.last_verified, '2026-09-26');
  assert.equal(r.approved_by, null);
  assert.equal(r.authorization, NO_AUTHORIZATION);
  assert.deepEqual(r.supersedes, []);
  assert.deepEqual(validateRecord(r), []);
  const approved = normalizeRecord({ ...r, approved_by: 'Mike', authorization: undefined }, { today: '2026-09-26' });
  assert.equal(approved.authorization, 'Approved by Mike on 2026-09-26');
  assert.equal(approverFrom(approved.authorization), 'Mike');
  // The model writes name as the whole key (the file name without .md).
  const modelName = normalizeRecord({ type: 'project', name: 'project_account_model', description: 'd', source: 's', body: 'b' }, { today: '2026-09-26' });
  assert.equal(modelName.key, 'project_account_model');
  assert.equal(modelName.name, 'account-model');
  const fromKey = normalizeRecord({ key: 'project_payments_api', description: 'x', source: 's', body: 'b' }, { today: '2026-09-26' });
  assert.equal(fromKey.type, 'project');
  assert.equal(fromKey.name, 'payments-api');
});

test('the description limit does not depend on the name; a name over 60 characters is refused, never cut', () => {
  const longest = 'payments-gateway-reconciliation-landmark-for-quarterly-close';
  assert.equal(longest.length, NAME_MAX);
  const r = normalizeRecord({ ...base(), key: undefined, type: 'project', name: longest, description: 'd'.repeat(DESCRIPTION_MAX) }, { today: '2026-09-26' });
  assert.equal(r.name, longest);
  assert.deepEqual(validateRecord(r), [], 'a 60-character name and a 150-character description are both fine');
  const tooLong = { ...r, description: 'd'.repeat(DESCRIPTION_MAX + 1) };
  assert.match(validateRecord(tooLong).join(' '), /description is 151 characters; the limit is 150/);

  // Two long names that start the same would have become one key if they were cut.
  const alpha = normalizeRecord({ ...base(), key: undefined, name: 'a-very-long-name-that-goes-on-and-on-about-the-payments-gateway-alpha' }, { today: '2026-09-26' });
  const beta = normalizeRecord({ ...base(), key: undefined, name: 'a-very-long-name-that-goes-on-and-on-about-the-payments-gateway-beta' }, { today: '2026-09-26' });
  assert.notEqual(alpha.key, beta.key);
  assert.throws(() => assertValidRecord(alpha), (err) => err.code === EXIT.INVALID && /Name is 69 characters; the limit is 60\. Give a shorter name/.test(err.message));
});

test('a "<" in a value is fine; a whole-value placeholder and an email are refused with clear messages', () => {
  assert.deepEqual(validateRecord({ ...base(), source: 'Mike said a < b in chat, 2026-09-26' }), []);
  assert.deepEqual(validateRecord({ ...base(), body: '**Remember:** keep lines < 50 and use <br> in tables.\n' }), []);
  const placeholder = validateRecord({ ...base(), source: '<Person, conversation, or document with absolute date>' }).join(' ');
  assert.match(placeholder, /source is still a template placeholder/);
  const email = validateRecord({ ...base(), source: 'Mike <michael@example.com> 2026-09-26' }).join(' ');
  assert.match(email, /source contains an email address/);
  assert.doesNotMatch(email, /placeholder/);
  const bodyPlaceholder = validateRecord({ ...base(), body: '**Remember:** <One durable point.>\n' }).join(' ');
  assert.match(bodyPlaceholder, /body still has a template placeholder/);
  assert.ok(isPlaceholder('`<YYYY-MM-DD>`'));
  assert.ok(!isPlaceholder('a < b > c'));
});

test('validateRecord lists every broken rule; assertValidRecord refuses with INVALID', () => {
  const problems = validateRecord({ key: 'x', type: 'idea', name: 'Bad Name', description: '', status: 'old', source: '', saved: 'today', last_verified: 'soon', body: '' });
  assert.ok(problems.length >= 7, problems.join('\n'));
  assert.throws(() => assertValidRecord({ ...base(), description: '' }), (err) => err.code === EXIT.INVALID && /Description is missing/.test(err.message));
  assert.match(validateRecord({ ...base(), superseded_by: 'feedback_other' }).join(' '), /only a retired record can be superseded/);
  assert.deepEqual(validateRecord({ ...base(), status: 'retired', superseded_by: 'feedback_other' }), []);
});

test('serializeRecord writes the model topic template YAML; parseRecord reads it back, keeping extra keys', () => {
  const r = normalizeRecord({ ...base(), approved_by: 'Mike', authorization: undefined, extra: { tags: ['a', 'b'] }, metadata: { type: 'feedback', origin: 'chat' } }, { today: '2026-09-26' });
  const text = serializeRecord(r);
  assert.equal(text, [
    '---',
    'name: feedback_deploy_window',
    'description: Deploys happen on Tuesday mornings only.',
    'metadata:',
    '  type: feedback',
    '  origin: chat',
    'status: current',
    'source: Mike in chat, 2026-09-26',
    'last_verified: 2026-09-26',
    'authorization: Approved by Mike on 2026-09-26',
    'supersedes: none',
    'tags: [a, b]',
    '---',
    '',
    '# Deploy window',
    '',
    '**Remember:** Deploy only on Tuesday mornings.',
    '',
  ].join('\n'));
  const { record, problems } = parseRecord(text, 'feedback_deploy_window');
  assert.deepEqual(problems, []);
  assert.equal(record.approved_by, 'Mike');
  assert.equal(record.superseded_by, null);
  assert.equal(record.type, 'feedback');
  assert.equal(record.stored_status, 'current');
  assert.deepEqual(record.extra, { tags: ['a', 'b'] });
  assert.deepEqual(record.metadata, { type: 'feedback', origin: 'chat' });
  assert.equal(serializeRecord(record), text);
  // The seed template is not a record.
  const seed = parseRecord(readTemplate('memory/topic'), 'project_topic_template');
  assert.equal(seed.record.status, 'template');
});

test('the model topic template fields map onto the record, and every model status word is read', () => {
  const tpl = readTemplate('memory/topic');
  const filled = tpl
    .replace('name: topic-template', 'name: project_account_model')
    .replace('status: template', 'status: needs-review')
    .replace('<Person, conversation, or document with absolute date>', 'Mike, 2026-09-26')
    .replace('<YYYY-MM-DD or unknown>', 'unknown')
    .replace('<Approved card or explicit request, or trusted grant>', 'Explicit request from Mike, 2026-09-26')
    .replace('supersedes: none', 'supersedes: [project_old_model, project_accounts]\nhost_field: kept');
  const { record } = parseRecord(filled, 'project_account_model');
  assert.equal(record.type, 'project');
  assert.equal(record.status, 'needs-review');
  assert.equal(record.last_verified, 'unknown');
  assert.equal(record.authorization, 'Explicit request from Mike, 2026-09-26');
  assert.deepEqual(record.supersedes, ['project_old_model', 'project_accounts']);
  assert.deepEqual(record.extra, { host_field: 'kept' });
  for (const [word, status] of [['current', 'current'], ['needs-review', 'needs-review'], ['superseded', 'retired'], ['archived', 'retired']]) {
    const t = serializeRecord(base()).replace('status: current', `status: ${word}`);
    const got = parseRecord(t, 'feedback_deploy_window').record;
    assert.equal(got.status, status, word);
    assert.equal(got.stored_status, word);
  }
  // A name that is not the file name is reported.
  const wrong = serializeRecord(base()).replace('name: feedback_deploy_window', 'name: feedback_other');
  assert.match(parseRecord(wrong, 'feedback_deploy_window').problems.join(' '), /does not match the file name/);
});

test('a record in the older toolkit format is still read and is written again in the model format', () => {
  const legacy = '---\nname: deploy-window\ntype: feedback\ndescription: Old one\nstatus: retired\nsuperseded_by: feedback_new_rule\nsource: Mike, 2026-09-01\nsaved: 2026-09-01\nlast_verified: 2026-09-01\napproved_by: Mike\n---\n\n**Remember:** Old.\n';
  const { record, problems } = parseRecord(legacy, 'feedback_deploy_window');
  assert.deepEqual(problems, []);
  assert.equal(record.legacy, true);
  assert.equal(record.status, 'retired');
  assert.equal(record.superseded_by, 'feedback_new_rule');
  assert.equal(record.approved_by, 'Mike');
  assert.equal(record.saved, '2026-09-01');
  const again = serializeRecord(record);
  assert.match(again, /^---\nname: feedback_deploy_window\ndescription: Old one\nmetadata:\n  type: feedback\nstatus: superseded\n/);
  assert.match(again, /authorization: Approved by Mike\n/);
  assert.doesNotMatch(again, /^(type|saved|superseded_by|approved_by):/m);
});

test('topicBody adds the title and the Remember label, and renames the older Related label', () => {
  assert.equal(topicBody('Deploy on Tuesdays.', { name: 'deploy-window' }), '# Deploy window\n\n**Remember:** Deploy on Tuesdays.\n');
  assert.equal(topicBody('# Mine\n\n**Remember:** x\n\n**Related:** [a](project_a.md)\n'), '# Mine\n\n**Remember:** x\n\n**Related memories:** [a](project_a.md)\n');
  const full = '# T\n\n**Remember:** a\n\n**Why:** b\n';
  assert.equal(topicBody(full), full, 'a body in the topic format is not changed');
});

test('parseRecord reports a file with no frontmatter or a type that does not match its key', () => {
  assert.match(parseRecord('just text\n', 'user_x').problems.join(' '), /no frontmatter/);
  const text = serializeRecord(base());
  assert.match(parseRecord(text, 'project_deploy_window').problems.join(' '), /metadata\.type "feedback" does not match the key/);
});

test('checkExpect: absent, a version, a short prefix, and stale versions', () => {
  checkExpect(null, undefined);
  checkExpect('abc', undefined);
  checkExpect(null, 'absent');
  assert.throws(() => checkExpect('abcdef0123', 'absent'), (err) => err.code === EXIT.INVALID && /already exists/.test(err.message));
  const v = versionOf('hello');
  checkExpect(v, v);
  checkExpect(v, v.slice(0, 12));
  assert.throws(() => checkExpect(v, v.slice(0, 4)), (err) => err.code === EXIT.INVALID);
  assert.throws(() => checkExpect(v, versionOf('other')), (err) => err.code === EXIT.INVALID && /changed since it was read/.test(err.message));
  assert.throws(() => checkExpect(null, v), (err) => err.code === EXIT.INVALID && /no longer exists/.test(err.message));
});

test('the current focus needs its four sections, allows "<", and is capped at 50 lines', () => {
  const good = `# Current focus\n\n${FOCUS_SECTIONS.map((h) => `## ${h}\n\n- keep lines < 50\n`).join('\n')}`;
  assert.deepEqual(validateFocus(good), []);
  assert.deepEqual(validateFocus(good.replace('## Waiting on the owner', '## waiting ON the owner')), []);
  assert.match(validateFocus('## Now\n\n- x\n').join(' '), /needs these ## sections: Waiting on the owner, Untracked to-dos, Next session starts with/);
  assert.match(validateFocus(`${good}\n## Recent decisions\n\n- y\n`).join(' '), /do not belong there: Recent decisions/);
  const long = `${good}${'\n- more'.repeat(40)}\n`;
  assert.match(validateFocus(long).join(' '), /lines; the limit is 50/);
  assert.throws(() => assertValidFocus(''), (err) => err.code === EXIT.INVALID);
});

test('keyword search scores key, description, and body', () => {
  const terms = searchTerms('When do we deploy on Tuesday?');
  assert.deepEqual(terms, ['deploy', 'tuesday']);
  const { score, snippet } = keywordScore(base(), terms);
  assert.ok(score >= 3 + 2 + 2, `score ${score}`);
  assert.match(snippet, /Tuesday/);
  assert.equal(keywordScore(base(), ['payments']).score, 0);
});

test('changeRecordStatus writes superseded or archived, keeps other lines, and puts the dated note under the title', () => {
  const text = serializeRecord({ ...base(), approved_by: 'Mike', authorization: undefined, body: '# Deploy window\n\n**Remember:** x\n\n**Related memories:** [stack](project_stack.md)\n' });
  const superseded = changeRecordStatus(text, { status: 'retired', supersededBy: 'feedback_new_window', note: retireNote('2026-09-27', { reason: 'Rule changed.', supersededBy: 'feedback_new_window' }) }, 'feedback_deploy_window');
  assert.match(superseded, /\nstatus: superseded\n/);
  assert.match(superseded, /authorization: Approved by Mike\n/);
  assert.match(superseded, /# Deploy window\n\n\*\*Superseded 2026-09-27:\*\* Replaced by \[feedback_new_window\]\(feedback_new_window\.md\)\. Rule changed\.\n\n\*\*Remember:\*\* x/);
  assert.equal(superseded.replace(/status: superseded/, 'status: current').replace(/\n\*\*Superseded[^\n]*\n/, ''), text, 'nothing else changed');
  const s = parseRecord(superseded, 'feedback_deploy_window').record;
  assert.equal(s.status, 'retired');
  assert.equal(s.superseded_by, 'feedback_new_window');
  assert.equal(supersededByFromBody(s.body), 'feedback_new_window');

  // Archived: the note says why, and the note's own links now start with ../ (it moves to archive/).
  const archived = changeRecordStatus(text, { status: 'retired', note: retireNote('2026-09-27', { reason: 'No longer true.' }) }, 'feedback_deploy_window');
  assert.match(archived, /\nstatus: archived\n/);
  assert.match(archived, /\*\*Archived 2026-09-27:\*\* No longer true\./);
  assert.match(archived, /\[stack\]\(\.\.\/project_stack\.md\)/);
  const a = parseRecord(archived, 'feedback_deploy_window').record;
  assert.equal(a.status, 'retired');
  assert.equal(a.superseded_by, null);

  // Restored: needs-review, links back to the vault root, superseded_by cleared.
  const restored = changeRecordStatus(archived, { status: 'needs-review', note: restoreNote('2026-09-28') }, 'feedback_deploy_window');
  assert.match(restored, /\nstatus: needs-review\n/);
  assert.match(restored, /\[stack\]\(project_stack\.md\)/);
  assert.equal(parseRecord(changeRecordStatus(superseded, { status: 'needs-review' }, 'feedback_deploy_window'), 'feedback_deploy_window').record.superseded_by, null);
  assert.throws(() => changeRecordStatus('no frontmatter', { status: 'retired' }, 'user_x'), (err) => err.code === EXIT.INVALID);
});

test('supersedes and rename change only their own frontmatter lines', () => {
  const text = serializeRecord(base());
  const one = changeSupersedes(text, { add: ['feedback_old'] });
  assert.match(one, /\nsupersedes: feedback_old\n/);
  const two = changeSupersedes(one, { add: ['feedback_older'] });
  assert.match(two, /\nsupersedes: \[feedback_old, feedback_older\]\n/);
  assert.equal(changeSupersedes(two, { add: ['feedback_old'] }), two, 'no change, same text');
  assert.equal(changeSupersedes(changeSupersedes(two, { remove: ['feedback_older'] }), { remove: ['feedback_old'] }), text);
  const renamed = renameRecordText(text, 'project_deploy_rules');
  assert.match(renamed, /^---\nname: project_deploy_rules\n/);
  assert.match(renamed, /metadata:\n  type: project\n/);
  assert.equal(renamed.split('\n').length, text.split('\n').length);
});

test('links: found outside code, repaired on rename, supersede, archive, and delete, and broken ones reported', () => {
  const note = [
    '**Related memories:** [billing](project_billing.md), [[project_billing|bills]], [project_billing](./project_billing.md#top).',
    'Not a link: `[billing](project_billing.md)`; outside the vault: [spec](../requirements/spec.md); a site: [n](https://example.com/a.md).',
    '```',
    '[billing](project_billing.md)',
    '```',
  ].join('\n');
  assert.equal(findLinks(note).length, 5, 'three links to the note, one outside the vault, one URL');
  const renamed = repairLinks(note, '', { kind: 'rename', from: 'project_billing', to: 'project_invoices' });
  assert.equal(renamed.count, 3);
  assert.match(renamed.text, /\[billing\]\(project_invoices\.md\), \[\[project_invoices\|bills\]\], \[project_invoices\]\(project_invoices\.md#top\)\./);
  assert.match(renamed.text, /`\[billing\]\(project_billing\.md\)`/, 'code is left alone');
  assert.match(renamed.text, /```\n\[billing\]\(project_billing\.md\)\n```/);
  const archived = repairLinks(note, '', { kind: 'archive', from: 'project_billing' });
  assert.match(archived.text, /^\*\*Related memories:\*\* billing \(archived\), bills \(archived\), project_billing \(archived\)\./);
  const deleted = repairLinks(note, '', { kind: 'delete', from: 'project_billing' });
  assert.match(deleted.text, /^\*\*Related memories:\*\* billing, bills, project_billing\./);
  // From a note in archive/, a link to the vault root starts with ../.
  const fromArchive = repairLinks('[b](../project_billing.md)', 'archive', { kind: 'supersede', from: 'project_billing', to: 'project_invoices' });
  assert.equal(fromArchive.text, '[b](../project_invoices.md)');
  // A link to a file outside the vault follows the move too.
  assert.equal(rebaseLinks('[b](project_b.md) [c](../x/c.md) [u](https://example.com/a.md)', '', 'archive').text, '[b](../project_b.md) [c](../../x/c.md) [u](https://example.com/a.md)');
  assert.equal(rebaseLinks('[b](../project_b.md) [c](../../x/c.md)', 'archive', '').text, '[b](project_b.md) [c](../x/c.md)');
  const exists = (p) => p === 'project_a.md';
  assert.deepEqual(brokenLinks('[a](project_a.md) [b](project_b.md) [[project_c]] [s](../req.md)', '', { exists }).map((b) => b.path), ['project_b.md', 'project_c.md']);
});

test('a retired record keeps its stored word: superseded stays superseded without a replacement key', () => {
  // The word decides; superseded_by is only the fallback for the older word "retired".
  assert.equal(storedStatus({ status: 'retired', stored_status: 'superseded', superseded_by: null }), 'superseded');
  assert.equal(storedStatus({ status: 'retired', stored_status: 'archived', superseded_by: 'project_x' }), 'archived');
  assert.equal(storedStatus({ status: 'retired', stored_status: 'retired', superseded_by: 'project_x' }), 'superseded');
  assert.equal(storedStatus({ status: 'retired', superseded_by: null }), 'archived');
  assert.equal(storedStatus({ status: 'retired', body: '# T\n\n**Superseded 2026-09-01:** Replaced by x.\n' }), 'superseded');
  assert.equal(storedStatus({ status: 'current', stored_status: 'superseded' }), 'current');

  // The newest dated note counts: an older Superseded line under an Archived one does not name a replacement.
  const history = '# T\n\n**Archived 2026-09-03:** Gone.\n\n**Superseded 2026-09-01:** Replaced by [project_b](project_b.md).\n';
  assert.equal(latestStatusNote(history), 'archived');
  assert.equal(supersededByFromBody(history), null);
  assert.equal(supersededByFromBody('# T\n\n**Superseded 2026-09-01:** Replaced by [project_b](project_b.md).\n'), 'project_b');

  // normalizeRecord keeps the word given and the one read from a file.
  const given = normalizeRecord({ ...base(), status: 'superseded' }, { today: '2026-09-26' });
  assert.equal(given.status, 'retired');
  assert.equal(given.stored_status, 'superseded');
  assert.equal(given.superseded_by, null);
  assert.match(serializeRecord(given), /\nstatus: superseded\n/);
  const text = serializeRecord(given);
  const { record } = parseRecord(text, 'feedback_deploy_window');
  assert.equal(record.stored_status, 'superseded');
  assert.equal(serializeRecord(normalizeRecord(record, { today: '2026-09-30' })), text, 'a round trip changes nothing');
  assert.equal(recordSummary(record).stored_status, 'superseded');
  const archived = normalizeRecord({ ...base(), status: 'archived', superseded_by: 'feedback_other' }, { today: '2026-09-26' });
  assert.equal(archived.superseded_by, null, 'an archived record has no replacement');
  assert.equal(storedStatus(archived), 'archived');

  // A replacement known only from a field is written into the body, dated by the record's save date.
  const older = normalizeRecord({ ...base(), status: 'retired', superseded_by: 'feedback_new_window', saved: '2026-09-01' });
  assert.match(older.body, /^# Deploy window\n\n\*\*Superseded 2026-09-01:\*\* Replaced by \[feedback_new_window\]\(feedback_new_window\.md\)\.\n\n\*\*Remember:\*\*/);
  assert.equal(parseRecord(serializeRecord(older), 'feedback_deploy_window').record.superseded_by, 'feedback_new_window');
});

test('link repair for a supersede leaves the Superseded line alone; fitLinks rebases only links that need it', () => {
  const a = '# A\n\n**Superseded 2026-09-01:** Replaced by [project_b](project_b.md).\n\n**Related memories:** [b](project_b.md)\n';
  const fixed = repairLinks(a, '', { kind: 'supersede', from: 'project_b', to: 'project_c' });
  assert.equal(fixed.count, 1);
  assert.match(fixed.text, /Replaced by \[project_b\]\(project_b\.md\)\./);
  assert.match(fixed.text, /\[b\]\(project_c\.md\)/);
  // A rename still moves it: the old file is gone.
  assert.match(repairLinks(a, '', { kind: 'rename', from: 'project_b', to: 'project_c' }).text, /Replaced by \[project_c\]\(project_c\.md\)\./);

  const files = new Set(['project_x.md', '../docs/spec.md']);
  const exists = (p) => files.has(p);
  // Written for archive/, moving to the root: rebased. Written for the root already: kept.
  assert.equal(fitLinks('[x](../project_x.md) [y](project_x.md) [s](../../docs/spec.md) [n](project_none.md)', 'archive', '', exists).text,
    '[x](project_x.md) [y](project_x.md) [s](../docs/spec.md) [n](project_none.md)');
  assert.equal(fitLinks('[x](project_x.md)', '', 'archive', exists).text, '[x](../project_x.md)');

  // brokenLinks checks a link that leaves the vault only when asked to.
  const text = '[a](../project_x.md) [b](../docs/spec.md) [c](../docs/none.md)';
  assert.deepEqual(brokenLinks(text, '', { exists }), []);
  assert.deepEqual(brokenLinks(text, '', { exists, outside: exists }).map((b) => [b.path, b.outside]), [['../project_x.md', true], ['../docs/none.md', true]]);
});

/** A driver kept in memory, for repairLinksWithDriver. failKeys: saves of these keys throw. */
function fakeDriver(records, { failKeys = [] } = {}) {
  const store = new Map(records.map((r) => {
    const rec = normalizeRecord(r, { today: '2026-09-26' });
    return [rec.key, serializeRecord(rec)];
  }));
  const saved = [];
  let focus = '# Current focus\n\n## Now\n\n- See [old](project_old.md).\n';
  return {
    saved,
    store,
    async list() {
      return [...store.keys()].map((key) => recordSummary(parseRecord(store.get(key), key).record));
    },
    async get(key) {
      const text = store.get(key);
      if (!text) return null;
      return { ...parseRecord(text, key).record, text, version: versionOf(text) };
    },
    async save(input) {
      const rec = normalizeRecord(input, { today: '2026-09-26' });
      if (failKeys.includes(rec.key)) throw new Error(`The memory record ${rec.key} was not saved. Description is missing.`);
      store.set(rec.key, serializeRecord(rec));
      saved.push(rec.key);
      return { key: rec.key };
    },
    async focusGet() {
      return { text: focus, version: versionOf(focus) };
    },
    async focusSet(text) {
      focus = text;
      return { version: versionOf(text) };
    },
    focusText: () => focus,
  };
}

test('repairLinksWithDriver keeps going past a record it cannot save and reports it', async () => {
  const note = (name, extra = {}) => ({
    type: 'project',
    name,
    description: `About ${name}.`,
    source: 'Mike, 2026-09-26',
    body: `# ${name}\n\n**Remember:** x\n\n**Related memories:** [old](project_old.md)\n`,
    ...extra,
  });
  const driver = fakeDriver([note('alpha'), note('broken'), note('zeta')], { failKeys: ['project_broken'] });
  // A record stored before the topic format: no title and no Remember label.
  driver.store.set('project_raw', '---\nname: project_raw\ndescription: Raw.\nmetadata:\n  type: project\nstatus: current\nsource: Mike, 2026-09-01\nlast_verified: 2026-09-01\nauthorization: Trusted grant\nsupersedes: none\n---\n\nSee [old](project_old.md).\n');
  const res = await repairLinksWithDriver(driver, { kind: 'rename', from: 'project_old', to: 'project_new' });
  assert.deepEqual(res.repaired, ['project_alpha', 'project_zeta', 'project_raw', 'focus']);
  assert.deepEqual(res.failed.map((f) => f.key), ['project_broken']);
  assert.match(res.failed[0].reason, /Description is missing/);
  assert.match(driver.store.get('project_alpha'), /\[old\]\(project_new\.md\)/);
  assert.match(driver.store.get('project_broken'), /\[old\]\(project_old\.md\)/, 'the note that could not be saved is unchanged');
  assert.match(driver.focusText(), /\[old\]\(project_new\.md\)/);
  assert.deepEqual(res.reformatted, ['project_raw'], 'the older body gained a title and the Remember label');
  assert.match(driver.store.get('project_raw'), /\n# Raw\n\n\*\*Remember:\*\* See \[old\]\(project_new\.md\)\.\n$/);
});

test('parseFocus reads the model focus: the fill-in guide and prompts are left out', () => {
  const seed = parseFocus(readTemplate('memory/CURRENT_FOCUS'));
  assert.equal(seed.filled, false);
  assert.equal(seed.lastUpdated, '');
  assert.deepEqual(seed.sections.map((s) => s.heading), [...FOCUS_SECTIONS]);
  assert.deepEqual(validateFocus(readTemplate('memory/CURRENT_FOCUS')), [], 'the model seed is a valid focus');
  const real = parseFocus('# Current focus\n\nLast updated: `2026-09-26, handoff, agent`\n\n## Now\n\n- WI-012 CSV export\n\n## Waiting on the owner\n\n- None.\n\n## Untracked to-dos\n\n- `<x>`\n\n## Next session starts with\n\n- Continue WI-012.\n');
  assert.equal(real.filled, true);
  assert.equal(real.lastUpdated, '2026-09-26, handoff, agent');
  assert.deepEqual(real.sections.map((s) => s.lines.length), [1, 1, 0, 1]);
});

test('list filters, counts, and sorting are shared by every driver', () => {
  const s = [
    { key: 'user_b', type: 'user', status: 'current' },
    { key: 'feedback_a', type: 'feedback', status: 'retired' },
    { key: 'user_a', type: 'user', status: 'needs-review' },
  ];
  assert.deepEqual(s.filter((x) => matchesFilter(x, {})).map((x) => x.key), ['user_b', 'user_a']);
  assert.deepEqual(s.filter((x) => matchesFilter(x, { status: 'all' })).length, 3);
  assert.deepEqual(s.filter((x) => matchesFilter(x, { status: 'retired' })).map((x) => x.key), ['feedback_a']);
  assert.deepEqual(sortRecords(s).map((x) => x.key), ['user_a', 'user_b', 'feedback_a']);
  const c = countRecords(s);
  assert.equal(c.total, 3);
  assert.equal(c.retired, 1);
  assert.equal(c['needs-review'], 1);
  assert.equal(c.byType.user, 2);
  assert.equal(c.byType.feedback, 0);
});

test('loadDriver: unknown type is INVALID, a missing driver file is UNSUPPORTED (exit 3)', async () => {
  const project = { root: '/nowhere', mainRoot: '/nowhere', config: { memory: { type: 'cloud' } } };
  await assert.rejects(loadDriver(project), (err) => err.code === EXIT.INVALID);
  const empty = tempDir();
  const notion = { ...project, config: { memory: { type: 'notion' } } };
  await assert.rejects(loadDriver(notion, { driversDir: empty }), (err) => err.code === EXIT.UNSUPPORTED && /notion memory driver is not installed/.test(err.message));
  fs.writeFileSync(path.join(empty, 'notion.mjs'), 'export const backend = "notion";\n');
  await assert.rejects(loadDriver(notion, { driversDir: empty }), (err) => err.code === EXIT.UNSUPPORTED && /does not export createDriver/.test(err.message));
  const builtin = await loadDriver({ root: empty, mainRoot: empty, config: { memory: { type: 'builtin' } } });
  assert.equal(builtin.backend, 'builtin');
  assert.equal(builtin.location, path.join(empty, '.memory'));
});
