import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, readRecord, recordPath, readState, trackerDir, TODAY, approveRequirements } from './helpers.mjs';
import { parseDoc, parseHistory, getLabel, parseQuestions, getH1 } from '../../lib/work/model.mjs';

after(cleanup);

test('lifecycle prints stages, statuses, types, gates, and approval rules without a project', async () => {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR || '/tmp'), 'tk-nolife-'));
  const r = await tk(dir, ['work', 'lifecycle']);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /01-discovery\s+Backlog\s+Working out what the owner wants\.\s+Continue with: work-requirements/);
  assert.match(r.stdout, /03-requirements-approved\s+Ready.*Continue with: solution-design or work-on/);
  assert.match(r.stdout, /waiting_on: owner continues with work-decide/);
  assert.match(r.stdout, /What counts as approval/);
  const j = await tk(dir, ['work', 'lifecycle', '--json']);
  assert.equal(j.json.stages.length, 14);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('outside a project, work commands exit 4', async () => {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR || '/tmp'), 'tk-none-'));
  const r = await tk(dir, ['work', 'list']);
  assert.equal(r.code, 4);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('new creates a folder with the template record, state, and dashboard', async () => {
  const dir = makeProject();
  const r = await tk(dir, ['work', 'new', '--title', 'Login page', '--type', 'build', '--request', 'Make a login page.', '--json']);
  assert.equal(r.code, 0, r.stdout + r.stderr);
  assert.equal(r.json.id, 'WI-001');
  assert.equal(r.json.item.status, 'Backlog');
  assert.equal(r.json.item.continueWith, 'work-requirements');
  const file = path.join(trackerDir(dir), 'WI-001-login-page', 'WORK-ITEM.md');
  assert.equal(r.json.path, file);
  const doc = parseDoc(fs.readFileSync(file, 'utf8'));
  assert.equal(doc.meta.type, 'build');
  assert.equal(doc.meta.stage, '01-discovery');
  assert.equal(doc.meta.updated, TODAY);
  assert.equal(getH1(doc.body).heading, 'WI-001: Login page');
  const state = readState(dir);
  assert.equal(state.schema, 1);
  assert.equal(state.highWater, 1);
  assert.equal(state.items['WI-001'].path, 'WI-001-login-page/WORK-ITEM.md', 'relative path');
  assert.ok(fs.existsSync(path.join(trackerDir(dir), 'DASHBOARD.md')));
  assert.equal(await recordPath(dir, 'wi-1'), file, 'ids are matched loosely');
});

test('new refuses bad input with exit 2', async () => {
  const dir = makeProject();
  assert.equal((await tk(dir, ['work', 'new'])).code, 2);
  assert.equal((await tk(dir, ['work', 'new', '--title', 'X', '--stage', 'launch'])).code, 2);
  assert.equal((await tk(dir, ['work', 'new', '--title', 'X', '--type', 'build', '--stage', '08'])).code, 2);
  assert.equal((await tk(dir, ['work', 'new', '--title', 'X', '--stage', '03'])).code, 2);
  assert.equal((await tk(dir, ['work', 'new', '--title', 'X', '--parent', 'WI-050'])).code, 1);
});

test('sub-items nest inside the parent folder and the parent gets a history row', async () => {
  const dir = makeProject();
  const parent = await newItem(dir, 'Checkout');
  const child = await newItem(dir, 'Card payments', ['--parent', parent]);
  assert.equal(child, 'WI-002');
  const file = await recordPath(dir, child);
  assert.equal(file, path.join(trackerDir(dir), 'WI-001-checkout', 'WI-002-card-payments', 'WORK-ITEM.md'));
  assert.equal(parseDoc(fs.readFileSync(file, 'utf8')).meta.parent, 'WI-001');
  const hist = parseHistory(parseDoc(await readRecord(dir, parent)).body);
  assert.match(hist[0].change, /Sub-item WI-002 created/);
  const tree = await tk(dir, ['work', 'list', '--tree']);
  assert.match(tree.stdout, /^WI-001 {2}Checkout .*\n {2}WI-002 {2}Card payments/m);
  const show = await tk(dir, ['work', 'show', parent, '--json']);
  assert.deepEqual(show.json.item.children, ['WI-002']);
});

test('set changes the stage and status together and enforces the build gate', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Importer', ['--type', 'build']);
  const refused = await tk(dir, ['work', 'set', id, '--stage', '08-build']);
  assert.equal(refused.code, 2);
  assert.match(refused.stderr, /requirements approval/);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.stage, '01-discovery', 'nothing changed');
  const direct03 = await tk(dir, ['work', 'set', id, '--stage', '03']);
  assert.equal(direct03.code, 2);
  const ok = await tk(dir, ['work', 'set', id, '--stage', '2', '--waiting-on', 'owner', '--priority', 'high', '--json']);
  assert.equal(ok.code, 0, ok.stdout);
  assert.equal(ok.json.set.item.stage, '02-refinement');
  assert.equal(ok.json.set.item.waiting_on, 'owner');
  assert.equal(ok.json.set.item.continueWith, 'work-decide');
  const task = await newItem(dir, 'Tidy docs');
  const t = await tk(dir, ['work', 'set', task, '--stage', 'build', '--json']);
  assert.equal(t.json.set.item.status, 'In Progress', 'non-build types may skip the gate');
  const typeChange = await tk(dir, ['work', 'set', task, '--type', 'build']);
  assert.equal(typeChange.code, 2, 'changing to build past 03 is refused');
  const hist = parseHistory(parseDoc(await readRecord(dir, task)).body);
  assert.match(hist[0].change, /stage 01 Discovery -> 08 Build \(status In Progress\)/);
  const bad = await tk(dir, ['work', 'set', task, '--waiting-on', 'bob']);
  assert.equal(bad.code, 2);
  const title = await tk(dir, ['work', 'set', task, '--title', 'Tidy the docs']);
  assert.equal(title.code, 0);
  assert.equal(getH1(parseDoc(await readRecord(dir, task)).body).title, 'Tidy the docs');
});

test('approve records requirements, design, and result approvals', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Report export', ['--type', 'build']);
  // The goal is written before the approval is recorded (sample run b, round 2).
  const blank = await tk(dir, ['work', 'approve', id, '--requirements', '--by', 'Mike', '--json']);
  assert.equal(blank.code, 2, 'refused while the Agreed goal is the template text');
  assert.match(blank.stdout + blank.stderr, /Agreed goal still holds the template text/);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.requirements_approved, 'no', 'nothing was recorded');
  assert.equal((await tk(dir, ['work', 'edit', id, '--section', 'Agreed goal', '--text', 'Export the report as CSV.'])).code, 0);
  const req = await tk(dir, ['work', 'approve', id, '--requirements', '--by', 'Mike', '--json']);
  assert.equal(req.code, 0, req.stdout);
  assert.equal(req.json.item.stage, '03-requirements-approved');
  assert.equal(req.json.item.status, 'Ready');
  let doc = parseDoc(await readRecord(dir, id));
  assert.equal(doc.meta.requirements_approved, `${TODAY} by Mike`);
  assert.equal(getLabel(doc.body, 'Overall status', { section: 'Requirements' }), 'Finalized');
  assert.equal((await tk(dir, ['work', 'set', id, '--stage', '08-build'])).code, 0, 'gate passes after approval');

  assert.equal((await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike'])).code, 1, 'no design yet');
  const created = await tk(dir, ['work', 'design', id, '--create', '--json']);
  assert.equal(created.code, 0, created.stdout);
  assert.equal(created.json.status, 'proposed');
  assert.equal(created.json.path, path.join(path.dirname(await recordPath(dir, id)), 'DESIGN.md'));
  assert.equal(parseDoc(await readRecord(dir, id)).meta.design, 'proposed');
  const dApprove = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike']);
  assert.equal(dApprove.code, 0, dApprove.stderr);
  const design = parseDoc(fs.readFileSync(created.json.path, 'utf8'));
  assert.equal(design.meta.status, 'approved');
  assert.equal(design.meta.approved, `${TODAY} by Mike`);
  assert.match(design.body, /^\*\*Design status:\*\* Approved {2}$/m);
  assert.match(design.body, /^\*\*Design approval:\*\* Approved by Mike on \d{4}-\d{2}-\d{2}$/m);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.design, 'approved');

  const res = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike']);
  assert.equal(res.code, 0);
  doc = parseDoc(await readRecord(dir, id));
  assert.equal(doc.meta.result_approved, `${TODAY} by Mike`);
  assert.equal((await tk(dir, ['work', 'approve', id, '--result'])).code, 2, '--by required');
  assert.equal((await tk(dir, ['work', 'approve', id, '--by', 'Mike'])).code, 2, 'what is approved is required');
});

test('design reads, replaces, and supersedes', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Search');
  assert.equal((await tk(dir, ['work', 'design', id])).code, 1);
  await tk(dir, ['work', 'design', id, '--create']);
  const twice = await tk(dir, ['work', 'design', id, '--create', '--json']);
  assert.equal(twice.json.existed, true, 'a second --create changes nothing');
  const read = await tk(dir, ['work', 'design', id, '--json']);
  assert.equal(read.json.meta.work_item, 'WI-001');
  const draft = path.join(dir, 'draft.md');
  fs.writeFileSync(draft, '---\nwork_item: WI-099\nstatus: approved\n---\n\n# WI-001: Search — solution design\n\nStatus: approved\n\n## What this solves\n\nFinding things.\n');
  const set = await tk(dir, ['work', 'design', id, '--set-file', draft, '--json']);
  assert.equal(set.code, 0, set.stdout);
  assert.equal(set.json.status, 'proposed', 'a file cannot approve itself');
  const saved = parseDoc(fs.readFileSync(set.json.path, 'utf8'));
  assert.equal(saved.meta.work_item, 'WI-001', 'work_item forced to the item');
  assert.match(saved.body, /Finding things/);
  assert.match(saved.body, /^Status: proposed/m);
  assert.equal((await tk(dir, ['work', 'design', id, '--status', 'approved'])).code, 2, 'approval needs --by');
  const sup = await tk(dir, ['work', 'design', id, '--status', 'superseded', '--json']);
  assert.equal(sup.json.status, 'superseded');
  assert.equal(parseDoc(await readRecord(dir, id)).meta.design, 'superseded');
});

test('edit replaces a section, appends a row, and sets a label; show reads a section', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Billing');
  const goal = path.join(dir, 'goal.md');
  fs.writeFileSync(goal, 'Invoices go out on the first of the month.\n');
  assert.equal((await tk(dir, ['work', 'edit', id, '--section', 'Requirements > Agreed goal', '--set-file', goal])).code, 0);
  assert.equal((await tk(dir, ['work', 'edit', id, '--section', 'Open Questions', '--append-row', 'Q-01 | Which currency? | R-01 | Open | owner'])).code, 0);
  assert.equal((await tk(dir, ['work', 'edit', id, '--label', 'Next action', '--value', 'Ask Mike about currency (agent).'])).code, 0);
  const stdinEdit = await tk(dir, ['work', 'edit', id, '--section', 'Resume here', '--set-file', '-'], { stdin: 'Start with Q-01.\n' });
  assert.equal(stdinEdit.code, 0, stdinEdit.stderr);
  const doc = parseDoc(await readRecord(dir, id));
  assert.match(doc.body, /### Agreed goal\n\nInvoices go out on the first of the month\.\n/);
  assert.equal(parseQuestions(doc.body)[0].question, 'Which currency?');
  assert.equal(getLabel(doc.body, 'Next action', { section: 'Overview' }), 'Ask Mike about currency (agent).');
  const sec = await tk(dir, ['work', 'show', id, '--section', 'Agreed goal']);
  assert.equal(sec.stdout.trim(), '### Agreed goal\n\nInvoices go out on the first of the month.');
  const missing = await tk(dir, ['work', 'edit', id, '--section', 'Nope', '--set-file', goal]);
  assert.equal(missing.code, 2);
  assert.match(missing.stderr, /Nope.*Sections: Overview, Roadmap/);
  assert.equal((await tk(dir, ['work', 'edit', id, '--section', 'Overview'])).code, 2);
  const decisions = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(decisions.json.decisions.some((d) => d.kind === 'open_question' && d.what.includes('Which currency?')));
});

test('history adds a row; finish and cancel set the terminal statuses with their rules', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Onboarding email', ['--type', 'task']);
  assert.equal((await tk(dir, ['work', 'history', id, '--note', 'Mike chose plain text.', '--effect', 'No HTML template.'])).code, 0);
  let hist = parseHistory(parseDoc(await readRecord(dir, id)).body);
  assert.deepEqual([hist[0].change, hist[0].effect], ['Mike chose plain text.', 'No HTML template.']);
  assert.equal((await tk(dir, ['work', 'finish', id, '--by', 'Mike'])).code, 2, 'evidence required');
  const child = await newItem(dir, 'Subject line', ['--parent', id]);
  const blocked = await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'Sent a test email.']);
  assert.equal(blocked.code, 2);
  assert.match(blocked.stderr, /open sub-items: WI-002/);
  const cancel = await tk(dir, ['work', 'cancel', child, '--reason', 'Not needed after all.', '--json']);
  assert.equal(cancel.code, 0);
  // With no recorded result approval, Done needs the owner's own words.
  const noWords = await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'Sent a test email.', '--json']);
  assert.equal(noWords.code, 2, noWords.stdout);
  assert.equal(JSON.parse(noWords.stdout || noWords.stderr).error.details.gate, 'result_not_approved');
  assert.notEqual(parseDoc(await readRecord(dir, id)).meta.status, 'Done', 'nothing changed');
  const fin = await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'Sent a test email.', '--quote', 'Looks good, mark it done.', '--json']);
  assert.equal(fin.code, 0, fin.stdout);
  const doc = parseDoc(await readRecord(dir, id));
  assert.equal(doc.meta.status, 'Done');
  assert.equal(doc.meta.result_approved, `${TODAY} by Mike`);
  hist = parseHistory(doc.body);
  assert.match(hist[0].effect, /Evidence: Sent a test email\./);
  assert.match(hist[0].change, /Result approved by Mike: "Looks good, mark it done\."/);
  assert.doesNotMatch(doc.body, /Fill-in guide/, 'finishing removes the template\'s item guide');
  assert.equal((await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'x'])).code, 2, 'already Done');
  const list = await tk(dir, ['work', 'list', '--json']);
  assert.equal(list.json.items.length, 0, 'finished items are hidden by default');
  const all = await tk(dir, ['work', 'list', '--all', '--json']);
  assert.equal(all.json.items.length, 2);
  const reopen = await tk(dir, ['work', 'set', id, '--stage', '10']);
  assert.equal(reopen.code, 2, 'a Done item needs --reopen');
  assert.equal((await tk(dir, ['work', 'set', id, '--stage', '10', '--reopen'])).code, 0);
  assert.equal(parseDoc(await readRecord(dir, id)).meta.status, 'In Progress');
});

test('finish refuses a build item with no requirements approval', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Data import', ['--type', 'data-load']);
  const r = await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'Loaded.']);
  assert.equal(r.code, 2);
  assert.match(r.stderr, /no recorded requirements approval/);
});

test('move nests, groups, archives, and returns items; archive is hidden from next and the briefing lists', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Alpha');
  const b = await newItem(dir, 'Beta');
  await tk(dir, ['work', 'set', a, '--stage', '06']);
  await tk(dir, ['work', 'set', b, '--stage', '06']);
  const under = await tk(dir, ['work', 'move', b, '--under', a, '--json']);
  assert.equal(under.code, 0, under.stdout);
  assert.equal(under.json.parentAfter, 'WI-001');
  assert.equal(parseDoc(await readRecord(dir, b)).meta.parent, 'WI-001');
  assert.match(parseHistory(parseDoc(await readRecord(dir, b)).body)[0].effect, /Parent is now WI-001/);
  assert.equal((await tk(dir, ['work', 'move', a, '--under', b])).code, 2, 'no cycles');
  const grp = await tk(dir, ['work', 'move', a, '--under', 'billing', '--json']);
  assert.equal(grp.code, 0);
  assert.equal(grp.json.nested, 1);
  assert.equal(await recordPath(dir, b), path.join(trackerDir(dir), 'billing', 'WI-001-alpha', 'WI-002-beta', 'WORK-ITEM.md'));
  assert.equal(parseDoc(await readRecord(dir, a)).meta.parent, 'none', 'a group does not change the parent');
  assert.equal(parseDoc(await readRecord(dir, b)).meta.parent, 'WI-001', 'sub-items move with their parent');
  const sync = await tk(dir, ['work', 'sync', '--json']);
  assert.equal(sync.json.moves.length, 0, 'moves made by the command are not reported as hand moves');
  const next1 = await tk(dir, ['work', 'next', '--json']);
  assert.equal(next1.json.next.id, 'WI-001');
  const arch = await tk(dir, ['work', 'move', a, '--under', 'archive', '--json']);
  assert.equal(arch.json.archived, true);
  assert.ok(fs.existsSync(path.join(trackerDir(dir), 'archive', 'billing', 'WI-001-alpha', 'WORK-ITEM.md')));
  const next2 = await tk(dir, ['work', 'next', '--json']);
  assert.equal(next2.json.next, null, 'archived items are never recommended');
  const list = await tk(dir, ['work', 'list', '--json']);
  assert.equal(list.json.items.length, 0);
  const dash = fs.readFileSync(path.join(trackerDir(dir), 'DASHBOARD.md'), 'utf8');
  assert.match(dash, /2 archived items are in archive\/ and not shown/);
  const back = await tk(dir, ['work', 'move', a, '--under', 'root', '--json']);
  assert.equal(back.json.archived, false);
  assert.equal((await tk(dir, ['work', 'move', a, '--under', '../x'])).code, 2, 'unsafe group names refused');
  assert.equal((await tk(dir, ['work', 'move', a, '--under', 'WI-077'])).code, 1);
  const setParent = await tk(dir, ['work', 'set', b, '--parent', 'none', '--json']);
  assert.equal(setParent.code, 0, setParent.stdout);
  assert.equal(parseDoc(await readRecord(dir, b)).meta.parent, 'none');
});

test('next ranks In Progress over Ready, skips blocked and Backlog items, and prefers higher priority', async () => {
  const dir = makeProject();
  const ready = await newItem(dir, 'Ready one', ['--type', 'task']);
  await approveRequirements(dir, ready);
  const low = await newItem(dir, 'Low', ['--stage', '08', '--priority', 'low']);
  const high = await newItem(dir, 'High', ['--stage', '08', '--priority', 'high']);
  const blocked = await newItem(dir, 'Blocked', ['--stage', '08', '--priority', 'urgent']);
  await tk(dir, ['work', 'set', blocked, '--waiting-on', 'owner']);
  await newItem(dir, 'Backlog item');
  const next = await tk(dir, ['work', 'next', '--json']);
  assert.equal(next.json.next.id, high);
  assert.deepEqual(next.json.others.map((o) => o.id), [low, ready]);
  assert.equal(next.json.waitingOnOwner >= 1, true);
});

test('decisions collects waiting_on owner, owner questions, proposed designs, stage 11, gates, and delivery offers', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Waiting', ['--type', 'task']);
  await tk(dir, ['work', 'set', a, '--waiting-on', 'owner']);
  const b = await newItem(dir, 'Designing', ['--type', 'task']);
  await tk(dir, ['work', 'design', b, '--create']);
  // A design just made from the template has no option yet: a draft, not a decision (sample run a, round 3).
  const draft = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(!draft.json.decisions.some((x) => x.id === b && x.kind === 'design_proposed'), 'a draft design waits for no approval');
  const designPath = path.join(path.dirname(await recordPath(dir, b)), 'DESIGN.md');
  fs.writeFileSync(designPath, fs.readFileSync(designPath, 'utf8').replace('### Option A — <Short name>', '### Option A — One greeting file'));
  const c = await newItem(dir, 'Reviewing', ['--type', 'task', '--stage', '11']);
  const d = await newItem(dir, 'Big one', ['--type', 'task', '--stage', '04']);
  await newItem(dir, 'Part', ['--parent', d]);
  const early = await newItem(dir, 'Big but still in backlog', ['--type', 'task']);
  await newItem(dir, 'Early part', ['--parent', early]);
  const e = await newItem(dir, 'Asked', ['--type', 'task']);
  await tk(dir, ['work', 'edit', e, '--section', 'Open Questions', '--append-row', 'Q-01 | Colour? | R-01 | Open | owner']);
  await tk(dir, ['work', 'edit', e, '--section', 'Open Questions', '--append-row', 'Q-02 | Font? | R-01 | Answered | owner']);
  const r = await tk(dir, ['work', 'decisions', '--json']);
  const kinds = new Map(r.json.decisions.map((x) => [`${x.id}:${x.kind}`, x]));
  assert.ok(kinds.has(`${a}:waiting_on_owner`));
  assert.ok(kinds.has(`${b}:design_proposed`));
  assert.ok(kinds.has(`${c}:result_approval`));
  // The delivery offer is the agent's step, listed apart from the owner's decisions.
  assert.ok(!kinds.has(`${d}:delivery_offer`), 'not counted as a decision waiting on the owner');
  const todos = new Map(r.json.agentTodos.map((x) => [`${x.id}:${x.kind}`, x]));
  assert.ok(todos.has(`${d}:delivery_offer`));
  assert.equal(todos.get(`${d}:delivery_offer`).continueWith, 'work-delegate');
  assert.ok(!todos.has(`${early}:delivery_offer`), 'no delivery offer while the item is in Backlog (before 03)');
  assert.ok(kinds.has(`${e}:open_question`));
  assert.equal(r.json.decisions.filter((x) => x.id === e && x.kind === 'open_question').length, 1, 'answered questions are left out');
  await tk(dir, ['work', 'set', d, '--delivery', 'agent-led']);
  const r2 = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(!r2.json.agentTodos.some((x) => x.id === d && x.kind === 'delivery_offer'));
  const dash = fs.readFileSync(path.join(trackerDir(dir), 'DASHBOARD.md'), 'utf8');
  assert.match(dash, /## Waiting on the owner\n\n\| ID \| Title \| What is needed \| Continue with \|/);
  assert.match(dash, /Colour\?/);
});

test('validate checks every item and its design, and exits 2 on errors or gate questions', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Clean item', ['--type', 'task']);
  const ok = await tk(dir, ['work', 'validate']);
  assert.equal(ok.code, 0, ok.stdout);
  assert.match(ok.stdout, /Checked 1 item: 1 clean/);
  const file = await recordPath(dir, id);
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('priority: medium', 'priority: someday'));
  const bad = await tk(dir, ['work', 'validate', id, '--json']);
  assert.equal(bad.code, 2);
  assert.ok(bad.json.results[0].errors.some((e) => e.code === 'bad_priority'));
  const byFile = await tk(dir, ['work', 'validate', file]);
  assert.equal(byFile.code, 2);
  assert.match(byFile.stdout, /priority "someday"/);
  fs.writeFileSync(path.join(dir, '.gitignore'), '');
  const gi = await tk(dir, ['work', 'validate', '--json']);
  assert.ok(gi.json.problems.some((p) => p.message.includes('not Git-ignored')));
});

test('the dashboard lists in-progress, ready, backlog, recently done, and the tree', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Building', ['--stage', '08']);
  await tk(dir, ['work', 'edit', a, '--label', 'Next action', '--value', 'Write the parser (agent).']);
  const b = await newItem(dir, 'Ready', ['--type', 'task']);
  await approveRequirements(dir, b);
  await newItem(dir, 'Later');
  const d = await newItem(dir, 'Finished');
  await tk(dir, ['work', 'finish', d, '--by', 'Mike', '--evidence', 'Done.', '--quote', 'Done, thanks.']);
  const dash = fs.readFileSync(path.join(trackerDir(dir), 'DASHBOARD.md'), 'utf8');
  assert.match(dash, /## In progress[\s\S]*\| WI-001 \| Building \| 08 Build \| In Progress \|  \| Write the parser \(agent\)\. \|/);
  assert.match(dash, /## Ready[\s\S]*\| WI-002 \| Ready \|/);
  assert.match(dash, /## Backlog[\s\S]*\| WI-003 \| Later \|/);
  assert.match(dash, /## Recently done[\s\S]*\| WI-004 \| Finished \| Done \| 2026-09-26 \|/);
  assert.match(dash, /## Tree\n\n- WI-001 Building \(08 Build, In Progress\)/);
  const again = await tk(dir, ['work', 'sync']);
  assert.equal(again.code, 0);
  assert.equal(fs.readFileSync(path.join(trackerDir(dir), 'DASHBOARD.md'), 'utf8'), dash, 'stable when nothing changed');
  fs.rmSync(path.join(trackerDir(dir), 'DASHBOARD.md'));
  await tk(dir, ['work', 'list']);
  assert.ok(fs.existsSync(path.join(trackerDir(dir), 'DASHBOARD.md')), 'rebuilt when deleted');
});

test('show prints the location, stage, and continuing skill, and --path gives the absolute file', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Profile page', ['--stage', '09']);
  const r = await tk(dir, ['work', 'show', id]);
  assert.equal(r.code, 0);
  assert.match(r.stdout, /^WI-001: Profile page\nLocation: \//);
  assert.match(r.stdout, /Stage: 09 Testing \(In Progress\) \| Waiting on: none \| Continue with: work-check/);
  assert.match(r.stdout, /^---\nid: WI-001/m);
  const p = await tk(dir, ['work', 'show', id, '--path']);
  assert.ok(path.isAbsolute(p.stdout.trim()));
  assert.equal((await tk(dir, ['work', 'show', 'WI-404'])).code, 1);
  assert.equal((await tk(dir, ['work', 'show'])).code, 2);
  assert.equal((await tk(dir, ['work', 'bogus'])).code, 2);
});

test('an item that breaks an approval gate is not recommended by next and continues with work-decide', async () => {
  const dir = makeProject();
  const gated = await newItem(dir, 'Importer', ['--type', 'build']);
  const plain = await newItem(dir, 'Tidy up', ['--type', 'task', '--stage', '08', '--priority', 'low']);
  const file = await recordPath(dir, gated);
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('stage: 01-discovery', 'stage: 08-build').replace('priority: medium', 'priority: urgent'));
  const show = await tk(dir, ['work', 'show', gated, '--json']);
  assert.equal(show.json.item.continueWith, 'work-decide');
  const next = await tk(dir, ['work', 'next', '--json']);
  assert.equal(next.json.next.id, plain, 'the gated urgent build item is left out');
  assert.ok(!next.json.others.some((o) => o.id === gated));
  const decisions = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(decisions.json.decisions.some((d) => d.id === gated && d.kind === 'gate'));
  await approveRequirements(dir, gated);
  const after2 = await tk(dir, ['work', 'next', '--json']);
  assert.equal(after2.json.next.id, gated, 'once approved, it is recommended again');
  assert.equal(after2.json.next.continueWith, 'work-on');
});

test('approving the result at 11 continues with work-finish, and an approval ends waiting on the owner', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Report', ['--type', 'task', '--stage', '11']);
  await tk(dir, ['work', 'set', id, '--waiting-on', 'owner']);
  const before = await tk(dir, ['work', 'show', id, '--json']);
  assert.equal(before.json.item.continueWith, 'work-decide');
  const r = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike', '--json']);
  assert.equal(r.code, 0, r.stdout);
  assert.equal(r.json.clearedWaiting, true);
  assert.equal(r.json.item.waiting_on, 'none');
  assert.equal(r.json.item.continueWith, 'work-finish');
  const text = await tk(dir, ['work', 'show', id]);
  assert.match(text.stdout, /Continue with: work-finish/);
  const doc = parseDoc(await readRecord(dir, id));
  assert.match(parseHistory(doc.body)[0].effect, /No longer waiting on the owner\./);
  const noWait = await newItem(dir, 'Other', ['--type', 'task', '--stage', '11']);
  const r2 = await tk(dir, ['work', 'approve', noWait, '--result', '--by', 'Mike', '--json']);
  assert.equal(r2.json.clearedWaiting, false);
});

test('set with --parent and a refused gate changes nothing, not even the folder', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Parent');
  const b = await newItem(dir, 'Child build', ['--type', 'build']);
  const before = await recordPath(dir, b);
  const r = await tk(dir, ['work', 'set', b, '--parent', a, '--stage', '08']);
  assert.equal(r.code, 2);
  assert.match(r.stderr, /need the owner's recorded requirements approval/);
  assert.equal(await recordPath(dir, b), before, 'the folder did not move');
  const ok = await tk(dir, ['work', 'set', b, '--parent', a, '--priority', 'high', '--json']);
  assert.equal(ok.code, 0, ok.stdout);
  const doc = parseDoc(await readRecord(dir, b));
  assert.equal(doc.meta.parent, a);
  assert.equal(doc.meta.priority, 'high');
});

test('--help anywhere in a work command shows the help and changes nothing', async () => {
  const dir = makeProject();
  const res = await tk(dir, ['work', 'new', '--title', 'Should not exist', '--help']);
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /^toolkit work: /);
  assert.equal(fs.existsSync(path.join(dir, '.work-items')) && fs.readdirSync(path.join(dir, '.work-items')).some((n) => /Should|should/.test(n)), false, 'no item was created');
  const list = await tk(dir, ['work', 'list', '--json']);
  assert.equal(list.code, 0, list.stderr);
  assert.doesNotMatch(list.stdout, /Should not exist/);
  const short = await tk(dir, ['work', 'set', 'WI-001', '--stage', '02-requirements', '-h']);
  assert.equal(short.code, 0, short.stderr);
  assert.match(short.stdout, /^toolkit work: /);
});
