import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  parseDoc, serializeDoc, applyMetaPatch, composeDoc, getH1, setH1, getSectionText, setSectionText, getLabel, setLabel,
  appendHistory, appendSectionRow, splitRowText, parseRoadmap, parseTasks, parseRequirements, parseQuestions, parseHistory,
  validateRecord, validateDesign, checkGates, newRecordText, newDesignText, reconcileRecord, snapshotWritten, canonicalId,
  parseId, isPlaceholder, isTemplateRow, overallFor, sectionNames, isOpenOwnerQuestion,
} from '../../lib/work/model.mjs';
import { BUILTIN_WORK_ITEM, BUILTIN_DESIGN, loadTemplate } from '../../lib/work/templates.mjs';
import { PLUGIN_ROOT } from './helpers.mjs';

// Frozen copies of the model project's templates (taken 2026-09-26). Tests never
// read the model project itself: it changes while other sessions work on it.
const MODEL_TEMPLATE_DIR = path.join(PLUGIN_ROOT, 'tests', 'notion', 'fixtures', 'templates');

function templates() {
  const list = [
    { name: 'built-in WORK-ITEM.md', text: BUILTIN_WORK_ITEM },
    { name: 'built-in DESIGN.md', text: BUILTIN_DESIGN },
  ];
  for (const f of ['WORK-ITEM.md', 'DESIGN.md']) {
    const plugin = path.join(PLUGIN_ROOT, 'templates', f);
    if (fs.existsSync(plugin)) list.push({ name: `plugin ${f}`, text: fs.readFileSync(plugin, 'utf8') });
    const model = path.join(MODEL_TEMPLATE_DIR, `model-${f}`);
    if (fs.existsSync(model)) list.push({ name: `model project ${f}`, text: fs.readFileSync(model, 'utf8') });
  }
  return list;
}

const FIELDS = {
  id: 'WI-000', title: 'Login page', type: 'build', stage: '01-discovery', status: 'Backlog', parent: 'none', waiting_on: 'none',
  priority: 'medium', delivery: 'not-offered', requirements_approved: 'no', design: 'none', result_approved: 'no', updated: '2026-09-26',
};

function fresh(extra = {}) {
  const text = newRecordText(loadTemplate('WORK-ITEM.md').text, { ...FIELDS, id: 'WI-004', ...extra });
  return { text, ...parseDoc(text) };
}

test('every template round-trips byte for byte through parse and serialize', () => {
  const list = templates();
  assert.ok(list.length >= 2);
  for (const t of list) {
    const d = parseDoc(t.text);
    assert.equal(serializeDoc(d.data, d.body), t.text, t.name);
  }
});

test('changing one frontmatter key rewrites only that line and keeps hard line breaks', () => {
  for (const t of templates().filter((x) => x.name.includes('WORK-ITEM'))) {
    const d = parseDoc(t.text);
    applyMetaPatch(d.data, { title: 'New title: with colon' });
    const out = serializeDoc(d.data, d.body);
    const before = t.text.split('\n');
    const after = out.split('\n');
    assert.equal(after.length, before.length, t.name);
    const diff = after.filter((l, i) => l !== before[i]);
    assert.deepEqual(diff, ['title: "New title: with colon"'], t.name);
    assert.equal(parseDoc(out).meta.title, 'New title: with colon');
  }
});

test('new frontmatter keys are placed in the 4.2 order', () => {
  const d = parseDoc('---\nid: WI-001\ntitle: A\nstatus: Backlog\n---\n\n# WI-001: A\n');
  applyMetaPatch(d.data, { stage: '01-discovery', updated: '2026-09-26', type: 'task' });
  assert.deepEqual(Object.keys(d.data), ['id', 'title', 'type', 'stage', 'status', 'updated']);
});

test('the model template is read: seven sections, H1, labels, tables, tasks, requirements', () => {
  const t = templates().find((x) => x.name.includes('WORK-ITEM') && !x.name.startsWith('built-in')) || templates()[0];
  const d = parseDoc(t.text);
  assert.deepEqual(sectionNames(d.body), ['Overview', 'Roadmap', 'Tasks', 'Recent History', 'Open Questions', 'Requirements', 'Notes']);
  assert.deepEqual(getH1(d.body).id, 'WI-001');
  assert.equal(getLabel(d.body, 'Overall status', { section: 'Requirements' }), 'Refining');
  assert.ok(isPlaceholder(getLabel(d.body, 'Next action', { section: 'Overview' })));
  assert.equal(parseTasks(d.body).map((x) => x.id).join(','), 'P1-T01,P1-T02,P2-T01');
  assert.deepEqual(parseTasks(d.body)[1].dependsOn, ['P1-T01']);
  assert.deepEqual(parseRequirements(d.body).map((r) => r.id), ['R-01', 'R-02']);
  assert.equal(parseQuestions(d.body)[0].placeholder, true);
  assert.equal(parseRoadmap(d.body).length, 2);
  assert.equal(parseHistory(d.body).length, 0);
});

test('a new record from the template has 4.2 frontmatter, the real title, Refining, and one history row', () => {
  const r = fresh({ request: 'Please add a login page.' });
  assert.deepEqual(Object.keys(r.meta), ['id', 'title', 'type', 'stage', 'status', 'parent', 'waiting_on', 'priority', 'delivery', 'requirements_approved', 'design', 'result_approved', 'updated']);
  assert.match(r.text, /^requirements_approved: no$/m);
  assert.equal(getH1(r.body).heading, 'WI-004: Login page');
  assert.equal(getLabel(r.body, 'Overall status', { section: 'Requirements' }), 'Refining');
  assert.equal(getSectionText(r.body, 'Starting request'), 'Please add a login page.');
  const hist = parseHistory(r.body);
  assert.equal(hist.length, 1);
  assert.equal(hist[0].date, '2026-09-26');
  assert.equal(r.text.split('\n').filter((l) => / {2}$/.test(l)).length >= 20, true, 'hard line breaks kept');
  const v = validateRecord(r.text);
  assert.deepEqual(v.errors, []);
  assert.deepEqual(v.gates, []);
  assert.equal(v.ok, true);
});

test('section helpers read and replace text, labels, and table rows', () => {
  let { body } = fresh();
  body = setSectionText(body, 'Requirements > Agreed goal', 'Mike can log in with email.');
  assert.equal(getSectionText(body, 'Agreed goal'), 'Mike can log in with email.');
  assert.ok(getSectionText(body, 'Active requirements').includes('R-01'), 'neighbour sections untouched');
  body = setLabel(body, 'Next action', 'Ask Mike about SSO (agent).', { section: 'Overview' });
  assert.equal(getLabel(body, 'Next action', { section: 'Overview' }), 'Ask Mike about SSO (agent).');
  body = setLabel(body, 'Overall status', 'Finalized', { section: 'Requirements' });
  assert.match(body, /^\*\*Overall status:\*\* Finalized {2}$/m, 'hard break kept');
  body = appendSectionRow(body, 'Open Questions', splitRowText('Q-01 | Use SSO? | R-01 | Open | owner'));
  const qs = parseQuestions(body);
  assert.equal(qs.length, 1, 'template row replaced');
  assert.equal(qs[0].question, 'Use SSO?');
  assert.ok(isOpenOwnerQuestion(qs[0]));
  body = appendHistory(body, { date: '2026-09-27', change: 'A | pipe', effect: 'x' });
  assert.equal(parseHistory(body).at(-1).change, 'A | pipe');
  assert.deepEqual(splitRowText('| a | b \\| c | d |'), ['a', 'b | c', 'd']);
  assert.ok(isTemplateRow(['Q-01', '<Specific unanswered question>', 'R-01, P1-T02', 'Open', '<owner, or the person or role>']));
  assert.ok(!isTemplateRow(['Q-02', 'Should we use <b>?', 'R-01', 'Open', 'owner']));
});

test('ids are compared by prefix and number', () => {
  assert.equal(canonicalId('wi-7'), 'WI-007');
  assert.equal(canonicalId('7', 'WI'), 'WI-007');
  assert.equal(canonicalId('WI-1234'), 'WI-1234');
  assert.equal(parseId('nope'), null);
});

test('validation reports errors, warnings, and gate questions', () => {
  const bad = fresh().text
    .replace('status: Backlog', 'status: Blocked')
    .replace('## Tasks', '## Jobs')
    .replace('# WI-004: Login page', '# WI-009: Login page')
    .replace('updated: 2026-09-26', 'updated: 2026-09-26\nactive_phase: P1');
  const v = validateRecord(bad);
  const codes = v.errors.map((e) => e.code);
  assert.ok(codes.includes('bad_status'));
  assert.ok(codes.includes('missing_section'));
  assert.ok(codes.includes('h1_id_mismatch'));
  assert.ok(v.warnings.some((w) => w.code === 'dropped_field'));
  assert.equal(v.ok, false);

  const mismatch = validateRecord(fresh().text.replace('status: Backlog', 'status: In Review'));
  assert.ok(mismatch.warnings.some((w) => w.code === 'status_stage_mismatch'));

  const past03 = validateRecord(fresh({ stage: '08-build', status: 'In Progress' }).text);
  assert.equal(past03.gates[0].code, 'requirements_not_approved');
  assert.equal(past03.ok, false);

  const taskOk = validateRecord(fresh({ type: 'task', stage: '08-build', status: 'In Progress' }).text);
  assert.deepEqual(taskOk.gates, []);

  const done = validateRecord(fresh({ type: 'task', stage: '11-user-approval', status: 'Done' }).text);
  assert.ok(done.gates.some((g) => g.code === 'done_without_result_approval'));

  const finalized = fresh({ type: 'task' });
  const fb = setLabel(finalized.body, 'Overall status', 'Finalized', { section: 'Requirements' });
  assert.ok(checkGates(finalized.meta, { body: fb }).some((g) => g.code === 'finalized_without_approval'));

  const prefix = validateRecord(fresh().text, { prefix: 'ACME' });
  assert.ok(prefix.errors.some((e) => e.code === 'bad_id_prefix'));

  const owner = fresh();
  const ob = appendSectionRow(owner.body, 'Open Questions', ['Q-01', 'SSO?', 'R-01', 'Open', 'Mike']);
  assert.ok(validateRecord({ meta: owner.meta, body: ob }, { ownerName: 'Mike' }).warnings.some((w) => w.code === 'owner_by_name'));
});

test('a new design has frontmatter, the item id, and today', () => {
  const text = newDesignText(loadTemplate('DESIGN.md').text, { id: 'WI-004', title: 'Login page', date: '2026-09-26' });
  const d = parseDoc(text);
  assert.deepEqual(d.meta, { work_item: 'WI-004', status: 'proposed', approved: 'no' });
  assert.equal(getH1(d.body).heading, 'WI-004: Login page — solution design');
  assert.match(d.body, /^Requirements: WI-004/m);
  assert.match(d.body, /^Date: 2026-09-26/m);
  const item = fresh();
  const v = validateDesign(text, { itemId: 'WI-004', itemBody: item.body, itemMeta: { design: 'proposed' } });
  assert.deepEqual(v.errors, []);
  assert.ok(v.ok);
  const wrong = validateDesign(text, { itemId: 'WI-005' });
  assert.ok(wrong.errors.some((e) => e.code === 'work_item_mismatch'));
  const approvedNoRecord = validateDesign(text.replace('status: proposed', 'status: approved'));
  assert.ok(approvedNoRecord.gates.some((g) => g.code === 'design_approved_without_record'));
  const extraReq = validateDesign(text.replace('#### R-02', '#### R-09'), { itemBody: item.body });
  assert.ok(extraReq.warnings.some((w) => w.code === 'unknown_requirement'));
});

// ------------------------------------------------------------------ owner edits

function written(meta, body, sources) {
  return snapshotWritten(meta, body, sources);
}

test('an H1 renamed by hand becomes the title, with a history row', () => {
  const r = fresh({ type: 'task' });
  const w = written(r.meta, r.body, { parent: 'none', design: 'none' });
  const body = setH1(r.body, 'WI-004', 'Sign-in page');
  const res = reconcileRecord({ meta: r.meta, body, sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(res.patch.title, 'Sign-in page');
  assert.equal(res.ownerEdits[0].field, 'title');
  assert.match(parseHistory(res.body).at(-1).change, /^Changed by hand: title/);
  assert.equal(res.patch.updated, '2026-09-27');
});

test('a title changed by hand in the frontmatter updates the H1', () => {
  const r = fresh({ type: 'task' });
  const w = written(r.meta, r.body, { parent: 'none', design: 'none' });
  const res = reconcileRecord({ meta: { ...r.meta, title: 'Sign-in page' }, body: r.body, sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(getH1(res.body).title, 'Sign-in page');
  assert.equal(res.ownerEdits[0].field, 'title');
});

test('a stage changed by hand derives the status; on a build item past 03 it asks the owner', () => {
  const task = fresh({ type: 'task' });
  const wt = written(task.meta, task.body, { parent: 'none', design: 'none' });
  const r1 = reconcileRecord({ meta: { ...task.meta, stage: '04-solution-design' }, body: task.body, sources: { parent: 'none', design: 'none' }, written: wt, today: '2026-09-27' });
  assert.equal(r1.patch.status, 'In Progress');
  assert.deepEqual(r1.questions, []);
  assert.equal(r1.ownerEdits[0].field, 'stage');

  const build = fresh();
  const wb = written(build.meta, build.body, { parent: 'none', design: 'none' });
  const r2 = reconcileRecord({ meta: { ...build.meta, stage: '08-build' }, body: build.body, sources: { parent: 'none', design: 'none' }, written: wb, today: '2026-09-27' });
  assert.equal(r2.patch.status, 'In Progress', 'kept and derived, never reverted');
  assert.equal(r2.questions[0].code, 'requirements_not_approved');
  assert.equal(r2.patch.stage, undefined, 'stage not moved back');
});

test('status set to Done by hand is kept and reported', () => {
  const r = fresh({ type: 'task', stage: '08-build', status: 'In Progress' });
  const w = written(r.meta, r.body, { parent: 'none', design: 'none' });
  const res = reconcileRecord({ meta: { ...r.meta, status: 'Done' }, body: r.body, sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(res.patch.status, undefined);
  assert.equal(res.ownerEdits[0].field, 'status');
  assert.match(res.ownerEdits[0].note, /no evidence recorded/);
  assert.equal(res.questions[0].code, 'done_without_result_approval');
});

test('a non-terminal status set by hand is kept, and the next pass does not undo it', () => {
  const r = fresh({ type: 'task', stage: '04-solution-design', status: 'In Progress' });
  const w = written(r.meta, r.body, { parent: 'none', design: 'none' });
  const meta = { ...r.meta, status: 'In Review' };
  const res = reconcileRecord({ meta, body: r.body, sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(res.patch.status, undefined);
  assert.equal(res.written.statusKept, true);
  const again = reconcileRecord({ meta: { ...meta, ...res.patch }, body: res.body, sources: { parent: 'none', design: 'none' }, written: res.written, today: '2026-09-27' });
  assert.equal(again.changed, false);
  assert.deepEqual(again.ownerEdits, []);
});

test('parent follows location; a parent typed by hand is kept with a question', () => {
  const r = fresh({ type: 'task' });
  const first = reconcileRecord({ meta: r.meta, body: r.body, sources: { parent: 'WI-001', design: 'none' }, written: null, today: '2026-09-27' });
  assert.equal(first.patch.parent, 'WI-001');
  const w = written({ ...r.meta, parent: 'WI-001' }, r.body, { parent: 'WI-001', design: 'none' });
  const moved = reconcileRecord({ meta: { ...r.meta, parent: 'WI-001' }, body: r.body, sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(moved.patch.parent, 'none', 'folder moved out: parent follows');
  const typed = reconcileRecord({ meta: { ...r.meta, parent: 'WI-003' }, body: r.body, sources: { parent: 'WI-001', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(typed.patch.parent, undefined);
  assert.equal(typed.questions[0].code, 'parent_location_mismatch');
  const later = reconcileRecord({ meta: { ...r.meta, parent: 'WI-003' }, body: typed.body, sources: { parent: 'WI-001', design: 'none' }, written: typed.written, today: '2026-09-27' });
  assert.equal(later.changed, false);
});

test('Overall status follows requirements_approved; Finalized typed by hand asks the owner', () => {
  const r = fresh({ type: 'task' });
  const w = written(r.meta, r.body, { parent: 'none', design: 'none' });
  const approved = reconcileRecord({ meta: { ...r.meta, requirements_approved: '2026-09-27 by Mike' }, body: r.body, sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(getLabel(approved.body, 'Overall status', { section: 'Requirements' }), 'Finalized');
  const hand = reconcileRecord({ meta: r.meta, body: setLabel(r.body, 'Overall status', 'Finalized', { section: 'Requirements' }), sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(getLabel(hand.body, 'Overall status', { section: 'Requirements' }), 'Finalized');
  assert.equal(hand.questions[0].code, 'finalized_without_approval');
  assert.equal(overallFor('no'), 'Refining');
});

test('design follows the design file status', () => {
  const r = fresh({ type: 'task' });
  const w = written(r.meta, r.body, { parent: 'none', design: 'none' });
  const res = reconcileRecord({ meta: r.meta, body: r.body, sources: { parent: 'none', design: 'proposed' }, written: w, today: '2026-09-27' });
  assert.equal(res.patch.design, 'proposed');
  const hand = reconcileRecord({ meta: { ...r.meta, design: 'approved' }, body: r.body, sources: { parent: 'none', design: 'none' }, written: w, today: '2026-09-27' });
  assert.equal(hand.patch.design, undefined);
  assert.equal(hand.questions[0].code, 'design_approved_by_hand');
});

test('composeDoc writes known keys first', () => {
  const text = composeDoc({ extra: 'x', title: 'T', id: 'WI-001' }, '\n# WI-001: T\n');
  assert.ok(text.startsWith('---\nid: WI-001\ntitle: T\nextra: x\n---\n'));
});

test('the built-in templates have the same structure as the plugin templates (so the fallback cannot drift)', () => {
  const shape = (text) => {
    const d = parseDoc(text);
    const headings = [];
    for (const line of d.body.split('\n')) {
      const m = /^(#{1,6})\s+(.*)$/.exec(line);
      if (m) headings.push(`${m[1]} ${m[2].trim()}`);
    }
    const labels = d.body.split('\n').map((l) => /^\s*(?:[-*]\s+)?\*\*([^*]+):\*\*/.exec(l)).filter(Boolean).map((m) => m[1]);
    const tables = d.body.split('\n').filter((l) => /^\|.*\|$/.test(l.trim()) && !/^\|[-\s|]+\|$/.test(l.trim())).length;
    const lineLabels = d.body.split('\n').map((l) => /^([A-Z][A-Za-z ]*):[ \t]/.exec(l)).filter(Boolean).map((m) => m[1]);
    return { keys: Object.keys(d.meta), headings, labels, lineLabels, tables };
  };
  for (const [name, builtin] of [['WORK-ITEM.md', BUILTIN_WORK_ITEM], ['DESIGN.md', BUILTIN_DESIGN]]) {
    const plugin = path.join(PLUGIN_ROOT, 'templates', name);
    if (!fs.existsSync(plugin)) continue;
    assert.deepEqual(shape(builtin), shape(fs.readFileSync(plugin, 'utf8')), `update the built-in ${name} in lib/work/templates.mjs to match templates/${name}`);
  }
});

test('a frontmatter the reader cannot read is a validation error, never a thrown error', () => {
  const bad = '---\nid: WI-001\ntitle: [draft] login\n---\n\n# WI-001: x\n';
  assert.equal(validateRecord(bad).errors[0].code, 'bad_frontmatter');
  assert.equal(validateDesign('---\nwork_item: WI-001\nstatus: "open\n---\n').errors[0].code, 'bad_frontmatter');
});
