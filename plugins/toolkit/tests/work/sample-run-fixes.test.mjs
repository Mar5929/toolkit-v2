// Work engine fixes from the round 1 sample runs (dev/test-runs/a-d):
// a renamed sub-item folder under a moved parent, one entry per owner
// decision, the delivery offer as an agent to-do, newest-first history,
// template guides, Done shown as Done, sub-items that inherit an approval,
// and a history effect for every `work set` row.

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { makeProject, cleanup, tk, newItem, readRecord, trackerDir, approveRequirements, recordCheck } from './helpers.mjs';
import { parseDoc, parseHistory, getSectionWhole } from '../../lib/work/model.mjs';
import { reportLines } from '../../lib/work/report.mjs';

after(cleanup);

const W = (dir, ...p) => path.join(trackerDir(dir), ...p);

test('a sub-item folder the owner renamed while he also moved its parent is reported as renamed, not hidden as "moved with its parent"', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Shout flag');
  const b = await newItem(dir, 'Help option', ['--parent', a]);
  fs.renameSync(W(dir, 'WI-001-shout-flag', 'WI-002-help-option'), W(dir, 'WI-001-shout-flag', 'help-option'));
  fs.mkdirSync(W(dir, 'cli-options'));
  fs.renameSync(W(dir, 'WI-001-shout-flag'), W(dir, 'cli-options', 'WI-001-shout-flag'));
  const r = await tk(dir, ['work', 'list', '--json']);
  const child = r.json.changes.moves.find((m) => m.id === b);
  assert.equal(child.kind, 'folder-renamed');
  assert.equal(child.withParent, undefined);
  const lines = reportLines(r.json.changes);
  // One line per change, ready to say to the owner (sample run a, round 3):
  // the parent moved into a group; the sub-item's folder was renamed and it is still the parent's sub-item.
  assert.ok(lines.includes('Moved: WI-001 from WI-001-shout-flag to cli-options/WI-001-shout-flag (moved by hand). It is still a top-level item.'), lines.join('\n'));
  assert.ok(lines.includes("Renamed folder: WI-002's folder was renamed by hand from WI-002-help-option to help-option; the item itself is the same. It moved along with its parent WI-001's folder, and it is still a sub-item of WI-001."), lines.join('\n'));

  // A sub-item that only moved with its parent stays out of the short report.
  const dir2 = makeProject();
  const c = await newItem(dir2, 'Parent');
  await newItem(dir2, 'Child', ['--parent', c]);
  fs.mkdirSync(W(dir2, 'group'));
  fs.renameSync(W(dir2, 'WI-001-parent'), W(dir2, 'group', 'WI-001-parent'));
  const r2 = await tk(dir2, ['work', 'list', '--json']);
  assert.equal(r2.json.changes.moves.find((m) => m.id === 'WI-002').withParent, 'WI-001');
  assert.equal(reportLines(r2.json.changes).filter((l) => /WI-002/.test(l)).length, 0);
});

test('one decision is counted once: the general "waiting on the owner" line goes when a more specific one exists', async () => {
  const dir = makeProject();
  const a = await newItem(dir, 'Review me', ['--type', 'task', '--stage', '11']);
  await tk(dir, ['work', 'set', a, '--waiting-on', 'owner']);
  const b = await newItem(dir, 'Just waiting', ['--type', 'task']);
  await tk(dir, ['work', 'set', b, '--waiting-on', 'owner']);
  const c = await newItem(dir, 'Asked', ['--type', 'task']);
  await tk(dir, ['work', 'set', c, '--waiting-on', 'owner']);
  await tk(dir, ['work', 'edit', c, '--section', 'Open Questions', '--append-row', 'Q-01 | Colour? | R-01 | Open | owner']);
  const r = await tk(dir, ['work', 'decisions', '--json']);
  const of = (id) => r.json.decisions.filter((d) => d.id === id).map((d) => d.kind);
  assert.deepEqual(of(a), ['result_approval']);
  assert.deepEqual(of(b), ['waiting_on_owner']);
  assert.deepEqual(of(c), ['open_question']);
  assert.equal(r.json.count, 3);
  const text = await tk(dir, ['work', 'decisions']);
  assert.match(text.stdout, /^3 decisions wait on the owner:/);
});

test('the delivery offer is an agent to-do, listed only from stage 03 to 07, and not when an open question already asks it', async () => {
  const dir = makeProject();
  const big = await newItem(dir, 'Big goal', ['--type', 'task', '--stage', '04']);
  await newItem(dir, 'Part one', ['--parent', big]);
  const late = await newItem(dir, 'Big but built', ['--type', 'task', '--stage', '11']);
  await newItem(dir, 'Late part', ['--parent', late]);
  const asked = await newItem(dir, 'Big and asked', ['--type', 'task', '--stage', '04']);
  await newItem(dir, 'Asked part', ['--parent', asked]);
  await tk(dir, ['work', 'edit', asked, '--section', 'Open Questions', '--append-row', 'Q-01 | Shall a team of agents deliver this (agent-led delivery)? | P1 | Open | owner']);
  const r = await tk(dir, ['work', 'decisions', '--json']);
  assert.deepEqual(r.json.agentTodos.filter((t) => t.kind === 'delivery_offer').map((t) => t.id), [big]);
  // The item at 11 has no acceptance check recorded: that is its own to-do (the owner's decision of 2026-09-28).
  assert.deepEqual(r.json.agentTodos.filter((t) => t.kind === 'acceptance_check').map((t) => t.id), [late]);
  assert.ok(!r.json.decisions.some((d) => d.kind === 'delivery_offer'));
  const text = await tk(dir, ['work', 'decisions']);
  assert.match(text.stdout, /Agent to-do \(the agent's step, not a decision the owner is waiting on\):\n {2}- Make the agent-led delivery offer for WI-001/);
  const dash = fs.readFileSync(W(dir, 'DASHBOARD.md'), 'utf8');
  assert.match(dash, /## Agent to-do\n\n\| ID \| Title \| What the agent does next \| Continue with \|\n\|---\|---\|---\|---\|\n\| WI-001 \|/);
  const brief = await tk(dir, ['brief']);
  assert.match(brief.stdout, /Agent to-do \(not a decision the owner is waiting on\):\n- WI-001 Big goal: Make the agent-led delivery offer/);
});

test('Recent History is newest first, and the CLI removes the section guide and fills the effect of a set row', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Greeting', ['--type', 'task']);
  await tk(dir, ['work', 'history', id, '--note', 'First note.', '--effect', 'One.']);
  await tk(dir, ['work', 'set', id, '--priority', 'high']);
  await tk(dir, ['work', 'edit', id, '--section', 'Recent History', '--append-row', `2026-09-26 | Row added with --append-row. | Two.`]);
  const doc = parseDoc(await readRecord(dir, id));
  const hist = parseHistory(doc.body);
  assert.deepEqual(hist.map((h) => h.change), ['Row added with --append-row.', 'Set priority high.', 'First note.', 'Created.']);
  assert.match(hist[1].effect, /Continue with /, 'a set row always says its effect');
  assert.doesNotMatch(getSectionWhole(doc.body, 'Recent History'), /<!--/);
});

test('the template\'s item guide goes when the requirements are approved, and validate warns about one left from stage 03 on', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Export', ['--type', 'build']);
  assert.match(await readRecord(dir, id), /<!-- Fill-in guide/, 'a new local item keeps the guide while it is being filled');
  await approveRequirements(dir, id);
  assert.doesNotMatch(await readRecord(dir, id), /Fill-in guide/);

  const task = await newItem(dir, 'Tidy', ['--type', 'task', '--stage', '06']);
  const v = await tk(dir, ['work', 'validate', task, '--json']);
  const warnings = JSON.stringify(v.json);
  assert.match(warnings, /guide_left/);
});

test('a finished item shows only Done in the list, the tree, and the dashboard', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Shipped', ['--type', 'task', '--stage', '09']);
  await recordCheck(dir, id);
  await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike']);
  const fin = await tk(dir, ['work', 'finish', id, '--by', 'Mike', '--evidence', 'Tests pass.']);
  assert.equal(fin.code, 0, fin.stderr);
  const tree = await tk(dir, ['work', 'list', '--tree', '--all']);
  assert.match(tree.stdout, /WI-001 {2}Shipped {2}\(Done\)/);
  assert.doesNotMatch(tree.stdout, /09 Testing/);
  const table = await tk(dir, ['work', 'list', '--all']);
  assert.doesNotMatch(table.stdout, /09 Testing/);
});

test('a sub-item that covers approved parent requirements inherits the approval; the parent keeps its requirements', async () => {
  const dir = makeProject();
  const parent = await newItem(dir, 'Greet CLI', ['--type', 'build']);
  const reqs = '#### R-01 — Greets by name\n\n**Status:** Finalized  \n**Applies to:** Everyone.  \n**Required behavior:** Prints Hello, <name>.  \n**Boundaries and exceptions:** None identified.  \n**Acceptance check:** greet Mike prints Hello, Mike.  \n**Decision record:** Mike.  \n**Open questions:** None.\n\n#### R-02 — Shouts\n\n**Status:** Finalized  \n**Applies to:** Everyone.  \n**Required behavior:** --shout prints in capitals.  \n**Boundaries and exceptions:** None identified.  \n**Acceptance check:** greet --shout Mike prints HELLO, MIKE.  \n**Decision record:** Mike.  \n**Open questions:** None.';
  const tmp = fs.mkdtempSync(path.join(dir, '..', 'reqs-'));
  fs.writeFileSync(path.join(tmp, 'reqs.md'), reqs);
  assert.equal((await tk(dir, ['work', 'edit', parent, '--section', 'Active requirements', '--set-file', path.join(tmp, 'reqs.md')])).code, 0);
  fs.rmSync(tmp, { recursive: true, force: true });

  const early = await tk(dir, ['work', 'new', '--title', 'Shout flag', '--type', 'build', '--parent', parent, '--covers', 'R-02']);
  assert.equal(early.code, 2, 'no approval to inherit yet');
  await approveRequirements(dir, parent);
  const bad = await tk(dir, ['work', 'new', '--title', 'X', '--parent', parent, '--covers', 'R-09']);
  assert.equal(bad.code, 2);
  assert.match(bad.stderr, /has no requirement R-09/);

  const r = await tk(dir, ['work', 'new', '--title', 'Shout flag', '--type', 'build', '--parent', parent, '--covers', 'R2', '--json']);
  assert.equal(r.code, 0, r.stdout + r.stderr);
  const child = parseDoc(await readRecord(dir, r.json.id));
  assert.equal(child.meta.requirements_approved, '2026-09-26 by Mike');
  assert.equal(child.meta.stage, '03-requirements-approved');
  assert.equal(child.meta.status, 'Ready');
  assert.match(child.body, /Covers WI-001 R-02\./);
  assert.doesNotMatch(child.body, /--shout prints in capitals/, 'the requirement text stays in the parent');
  const par = parseDoc(await readRecord(dir, parent));
  assert.match(par.body, /#### R-02 — Shouts/, 'the parent keeps R-02, with its number');
  assert.equal(par.meta.requirements_approved, '2026-09-26 by Mike');
  assert.match(parseHistory(par.body)[0].effect, /delivers R-02\. Those requirements stay here, unchanged and approved\./);
  const decisions = await tk(dir, ['work', 'decisions', '--json']);
  assert.ok(!decisions.json.decisions.some((d) => d.id === r.json.id), 'nothing about the child waits on the owner');
});
