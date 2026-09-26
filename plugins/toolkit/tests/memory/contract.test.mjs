import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  keyFor, splitKey, isValidKey, assertKey, canonicalKey, normalizeName, NAME_MAX, normalizeRecord, validateRecord, assertValidRecord,
  serializeRecord, parseRecord, checkExpect, versionOf, validateFocus, assertValidFocus, keywordScore, searchTerms,
  changeRecordStatus, retireNote, matchesFilter, countRecords, sortRecords, loadDriver, isPlaceholder,
  DESCRIPTION_MAX, FOCUS_SECTIONS,
} from '../../lib/memory/contract.mjs';
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
  assert.deepEqual(validateRecord(r), []);
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

test('serializeRecord and parseRecord round-trip, keeping extra frontmatter keys', () => {
  const r = { ...base(), approved_by: 'Mike', extra: { tags: ['a', 'b'] } };
  const text = serializeRecord(r);
  assert.match(text, /^---\nname: deploy-window\ntype: feedback\n/);
  assert.match(text, /superseded_by: none\n/);
  assert.match(text, /approved_by: Mike\ntags: \[a, b\]\n---\n\n# Deploy window/);
  const { record, problems } = parseRecord(text, 'feedback_deploy_window');
  assert.deepEqual(problems, []);
  assert.equal(record.approved_by, 'Mike');
  assert.equal(record.superseded_by, null);
  assert.deepEqual(record.extra, { tags: ['a', 'b'] });
  assert.equal(serializeRecord(record), text);
  const noApproval = serializeRecord(base());
  assert.doesNotMatch(noApproval, /approved_by/);
});

test('parseRecord reports a file with no frontmatter or a type that does not match its key', () => {
  assert.match(parseRecord('just text\n', 'user_x').problems.join(' '), /no frontmatter/);
  const text = serializeRecord(base());
  assert.match(parseRecord(text, 'project_deploy_window').problems.join(' '), /does not match the key/);
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

test('changeRecordStatus keeps other lines and adds the dated note', () => {
  const text = serializeRecord({ ...base(), approved_by: 'Mike' });
  const retired = changeRecordStatus(text, { status: 'retired', supersededBy: 'feedback_new_window', note: retireNote('2026-09-27', { reason: 'Rule changed.', supersededBy: 'feedback_new_window' }) }, 'feedback_deploy_window');
  assert.match(retired, /status: retired\n/);
  assert.match(retired, /superseded_by: feedback_new_window\n/);
  assert.match(retired, /approved_by: Mike\n/);
  assert.match(retired, /\*\*Retired 2026-09-27:\*\* Rule changed\. Replaced by feedback_new_window\.\n$/);
  assert.throws(() => changeRecordStatus('no frontmatter', { status: 'retired' }, 'user_x'), (err) => err.code === EXIT.INVALID);
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
