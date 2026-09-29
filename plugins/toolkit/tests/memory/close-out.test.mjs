// Close-out fix R-M6 (dev/final-review.md, "Re-review 2026-09-28"): the
// memory-save skill's reply lines were paraphrased in three of five final
// runs. toolkit memory save, approve, and reject now print the filled line,
// ready to copy word for word.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { cleanup, makeProject, runToolkit } from './helpers.mjs';

after(cleanup);

const LINE = 'Reply line for the owner, word for word (memory-save): ';

test('save, approve, and reject print the memory-save reply line with the record title', async () => {
  const { root } = makeProject();
  const record = '# Deploys wait for Tuesday\n\n**Remember:** Deploy only on Tuesday mornings.\n\n**Why:** The owner said so.\n';
  const saved = await runToolkit(['memory', 'save', '--type', 'project', '--name', 'deploy-day', '--description', 'Deploy only on Tuesday mornings', '--body', record, '--source', 'Mike, 2026-09-28', '--approved-by', 'Mike'], { cwd: root });
  assert.equal(saved.code, 0, saved.stdout + saved.stderr);
  assert.ok(saved.stdout.includes(`${LINE}Saved to memory: Deploys wait for Tuesday. Say 'forget that' to undo.`), saved.stdout);

  const json = await runToolkit(['memory', 'get', 'project_deploy_day', '--json'], { cwd: root });
  const updated = await runToolkit(['memory', 'save', '--type', 'project', '--name', 'deploy-day', '--description', 'Deploy only on Tuesday mornings before 10', '--body', record.replace('mornings.', 'mornings before 10.'), '--source', 'Mike, 2026-09-28', '--expect', json.json.version, '--approved-by', 'Mike', '--json'], { cwd: root });
  assert.equal(updated.code, 0, updated.stdout + updated.stderr);
  assert.equal(updated.json.replyLine, "Updated in memory: Deploys wait for Tuesday. Say 'undo that' to put back the old wording.");

  const proposal = await runToolkit(['memory', 'save', '--type', 'project', '--name', 'ghost-slugs', '--description', 'Ghost keeps only the first 190 characters of a slug', '--body', '# Ghost slugs\n\n**Remember:** Ghost keeps only the first 190 characters of a slug.\n', '--source', 'Agent question, 2026-09-28', '--proposal'], { cwd: root });
  assert.equal(proposal.code, 0, proposal.stdout + proposal.stderr);
  assert.ok(proposal.stdout.includes(`${LINE}Saved as a proposal for your yes or no: Ghost slugs.`), proposal.stdout);
  // Concept memory: the yes names the concept the fact starts (verifier, 2026-09-28).
  const approved = await runToolkit(['memory', 'approve', 'project_ghost_slugs', '--by', 'Mike', '--concept', 'project_ghost', '--title', 'Ghost'], { cwd: root });
  assert.equal(approved.code, 0, approved.stdout + approved.stderr);
  assert.ok(approved.stdout.includes(`${LINE}Saved to memory: Ghost slugs (in Ghost). Say 'forget that' to undo.`), approved.stdout);

  await runToolkit(['memory', 'save', '--type', 'project', '--name', 'bill-group', '--description', 'Bills are usually split four ways', '--body', '# Bills split four ways\n\n**Remember:** Bills are usually split four ways.\n', '--source', 'Agent question, 2026-09-28', '--proposal'], { cwd: root });
  const rejected = await runToolkit(['memory', 'reject', 'project_bill_group', '--json'], { cwd: root });
  assert.equal(rejected.code, 0, rejected.stdout + rejected.stderr);
  assert.equal(rejected.json.replyLine, 'Not saved: Bills split four ways. I will not suggest it again.');
});

test('a save with no approval recorded gets no reply line: it is a mistake to fix first', async () => {
  const { root } = makeProject();
  const res = await runToolkit(['memory', 'save', '--type', 'project', '--name', 'deploy-day', '--description', 'Deploy only on Tuesday mornings', '--body', '# Deploy day\n\n**Remember:** Deploy only on Tuesday mornings.\n', '--source', 'Mike, 2026-09-28'], { cwd: root });
  assert.equal(res.code, 0, res.stdout + res.stderr);
  assert.doesNotMatch(res.stdout, /Reply line for the owner/);
  assert.match(res.stdout, /was saved with no approval recorded/);
});
