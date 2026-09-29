// Work engine fixes from the final confirmation round 1 (2026-09-28). Each
// test names the run and finding it covers (dev/test-runs/final-*/evidence.md).

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { makeProject, cleanup, tk, newItem, readRecord, recordCheck } from './helpers.mjs';
import { parseDoc, validateRecord, newRecordText } from '../../lib/work/model.mjs';
import { fenceBareDesignHeader, staleNextAction } from '../../lib/work/ops.mjs';
import { readTemplate } from '../../lib/core/templates.mjs';

after(cleanup);

const SHORT_DESIGN = (id) => `# ${id}: Brief — solution design\n\n**Requirements:** ${id}  \n**Design status:** Proposed  \n**Requirements checked:** ${id} Requirements, 2026-09-28  \n**Last updated:** 2026-09-28  \n**Design approval:** Pending\n\n## What this design solves\n\nA short brief.\n\n## Design options\n\n### Option A — One short brief\n\nThree bullets at the top of README.md.\n\n## Selected design\n\nOption A: three bullets at the top of README.md.\n`;

test('notion 3: design text with work_item, status, and approved lines but no --- fences is read as the header, with a note', async () => {
  const fenced = fenceBareDesignHeader('work_item: TFR-001\nstatus: proposed\napproved: "no"\n\n# TFR-001: Old — solution design\n\nText.\n');
  assert.deepEqual(fenced.keys, ['work_item', 'status', 'approved']);
  assert.match(fenced.text, /^---\nwork_item: TFR-001\nstatus: proposed\napproved: "no"\n---\n\n# TFR-001/);
  assert.deepEqual(fenceBareDesignHeader('---\nwork_item: X\n---\n# X\n').keys, [], 'fenced text is left as it is');
  assert.deepEqual(fenceBareDesignHeader('# WI-001: A — solution design\n\nstatus: fine\n').keys, [], 'a status line in the body is text');

  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  const res = await tk(dir, ['work', 'design', id, '--text', `work_item: ${id}\nstatus: proposed\napproved: "no"\n\n${SHORT_DESIGN(id)}`]);
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Note: The text started with work_item, status, approved lines without the --- fences\. They were read as the design's header, not saved as design text\./);
  const shown = await tk(dir, ['work', 'design', id]);
  assert.doesNotMatch(parseDoc(shown.stdout.slice(shown.stdout.indexOf('---'))).body, /work_item:/, 'the header lines are not in the design text');
});

test('hindsight L1: a proposed design missing template sections gets a note at save time, and approve --design names them again', async () => {
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  await tk(dir, ['work', 'design', id, '--create']);
  const saved = await tk(dir, ['work', 'design', id, '--text', SHORT_DESIGN(id)]);
  assert.equal(saved.code, 0, saved.stderr);
  assert.match(saved.stdout, /Note: The design of .* has no "## Requirements and design readiness", .*"## Diagrams".* sections; the template has them\. Add them before you ask the owner to approve the design\./);
  const approved = await tk(dir, ['work', 'approve', id, '--design', '--by', 'Mike Rihm']);
  assert.equal(approved.code, 0, approved.stdout + approved.stderr);
  assert.match(approved.stdout, /Note: The approved design of .* has no .*"## Diagrams".* sections\. Adding them now changes the text the owner approved: tell him what was added\./);
  // A design created from the template has every section: no note.
  const id2 = await newItem(dir, 'Other', ['--type', 'task']);
  const created = await tk(dir, ['work', 'design', id2, '--create']);
  assert.doesNotMatch(created.stdout, /has no "## /);
});

test('codex-local: toolkit work next counts memory proposals, like toolkit work decisions', async () => {
  const dir = makeProject({ owner: 'Mike Rihm' });
  await newItem(dir, 'Something', ['--type', 'task']);
  const body = '# Ghost slugs\n\n**Remember:** Ghost keeps only the first 190 characters of a slug.\n\n**Why:** Not stated by the owner.\n';
  const p = await tk(dir, ['memory', 'save', '--type', 'project', '--name', 'ghost-slug-limit', '--description', 'Ghost keeps only the first 190 characters of a slug', '--body', body, '--source', 'Agent question, 2026-09-26', '--proposal']);
  assert.equal(p.code, 0, p.stdout + p.stderr);
  const next = await tk(dir, ['work', 'next', '--json']);
  assert.equal(next.code, 0, next.stderr);
  assert.equal(next.json.waitingOnOwner, 1);
  assert.equal(next.json.memoryProposals, 1);
  const text = await tk(dir, ['work', 'next']);
  assert.match(text.stdout, /1 decision waits on the owner \(1 memory proposal; work-decide; toolkit work decisions lists them\)\./);
  const decisions = await tk(dir, ['work', 'decisions']);
  assert.match(decisions.stdout, /^1 decision waits on the owner:/m);
});

test('codex-local: a parent whose every phase is delivered by sub-items has no "Tasks has no task lines" warning', () => {
  const tpl = readTemplate('work-item');
  const doc = parseDoc(newRecordText(tpl, {
    id: 'WI-001', title: 'Slug tool', type: 'task', stage: '14-spec-update', status: 'Done', parent: 'none', waiting_on: 'none', priority: 'medium',
    delivery: 'owner-led', requirements_approved: '2026-09-28 by Mike Rihm', design: 'approved', result_approved: '2026-09-28 by Mike Rihm', updated: '2026-09-28',
  }));
  const roadmap = (subs) => `A phase is complete when its tasks are complete and its exit result has been checked.\n\n| Phase | Outcome | Status | Exit result | Sub-items |\n| --- | --- | --- | --- | --- |\n| P1 — Basic slug | Convert a title | Done | Checks passed | ${subs[0]} |\n| P2 — Maximum length | Limit the slug | Done | Checks passed | ${subs[1]} |\n`;
  const withSections = (subs) => {
    let body = doc.body.replace(/## Roadmap[\s\S]*?(?=\n## Tasks)/, `## Roadmap\n\n${roadmap(subs)}`);
    body = body.replace(/## Tasks[\s\S]*?(?=\n## )/, '## Tasks\n\n### P1 — Basic slug\n\nWI-002 owns the implementation.\n\n### P2 — Maximum length\n\nWI-003 owns the implementation.\n');
    return body;
  };
  const both = validateRecord({ meta: doc.meta, body: withSections(['WI-002', 'WI-003']) }, { children: ['WI-002', 'WI-003'] });
  assert.ok(!both.warnings.some((w) => w.code === 'no_task_lines'), both.warnings.map((w) => w.code).join(', '));
  const oneMissing = validateRecord({ meta: doc.meta, body: withSections(['WI-002', 'none']) }, { children: ['WI-002'] });
  assert.ok(oneMissing.warnings.some((w) => w.code === 'no_task_lines'), 'a phase with no sub-item still needs tasks');
});

test('codex-salesforce: approving a result whose Next action still asks for it gives a note', async () => {
  assert.equal(staleNextAction({ id: 'WI-001', body: '## Overview\n\n**Next action:** Ask Mike to approve the WI-001 result.\n' }, 'result'),
    'WI-001\'s Overview still says "Next action: Ask Mike to approve the WI-001 result.". Write the step after this approval: toolkit work edit WI-001 --label \'Next action\' --value \'<next step>\'.');
  assert.equal(staleNextAction({ id: 'WI-001', body: '## Overview\n\n**Next action:** Ship it with work-finish.\n' }, 'result'), null);
  assert.equal(staleNextAction({ id: 'WI-001', body: '## Overview\n\n**Next action:** Ask Mike to approve the design.\n' }, 'result'), null, 'a different approval');
  const dir = makeProject();
  const id = await newItem(dir, 'Brief', ['--type', 'task']);
  const edit = await tk(dir, ['work', 'edit', id, '--label', 'Next action', '--value', `Ask Mike to approve the ${id} result.`]);
  assert.equal(edit.code, 0, edit.stdout + edit.stderr);
  await recordCheck(dir, id);
  const res = await tk(dir, ['work', 'approve', id, '--result', '--by', 'Mike Rihm']);
  assert.equal(res.code, 0, res.stdout + res.stderr);
  assert.match(res.stdout, /Overview still says "Next action: Ask Mike to approve the .* result\.". Write the step after this approval/);
  assert.ok(parseDoc(await readRecord(dir, id)).meta.result_approved.startsWith('2026-09-26 by Mike Rihm'));
});
