// Close-out checks for a Notion tracker (dev/final-review.md, "Re-review
// 2026-09-28", and the final Notion run):
// - design text whose header lines come without the --- fences leaves no
//   stale "work_item: ... status: ..." paragraph on the Notion design page;
// - the briefing's timeout line does not end ".).";
// - the acceptance check note works with a Notion tracker too.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../../lib/cli.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { notionReadProblem } from '../../lib/project/brief.mjs';
import { FakeNotion, seedProjects } from './fake-notion.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const made = [];
after(() => {
  for (const d of made) fs.rmSync(d, { recursive: true, force: true });
});

async function notionProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-close-out-'));
  made.push(dir);
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const state = path.join(dir, 'fake-notion.json');
  fs.writeFileSync(state, JSON.stringify(fake.toJSON()));
  const project = path.join(dir, 'project');
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, '.toolkit.json'), `${JSON.stringify({
    toolkit: 'toolkit-v2', schema: 1,
    project: { name: 'Sample app', key: 'sample-app', owner: 'Mike Rihm' },
    tracker: { type: 'notion', idPrefix: 'SA' }, memory: { type: 'notion', approval: 'onboarding' },
    salesforce: { enabled: false }, notion: {},
  }, null, 2)}\n`);
  const env = {
    ...process.env,
    HOME: path.join(dir, 'home'),
    CLAUDE_CONFIG_DIR: path.join(dir, 'home', '.claude'),
    CODEX_HOME: path.join(dir, 'home', '.codex'),
    TOOLKIT_V2_CONFIG_DIR: path.join(dir, 'machine'),
    TOOLKIT_NTN_BIN: path.join(HERE, 'fake-ntn.mjs'),
    FAKE_NOTION_STATE: state,
    TOOLKIT_NOTION_MIN_INTERVAL_MS: '0',
  };
  const run = async (args) => {
    let out = '';
    let err = '';
    const code = await main(args, { cwd: project, env, stdout: { write: (s) => { out += s; return true; } }, stderr: { write: (s) => { err += s; return true; } }, stdin: '' });
    return { code, out, err };
  };
  assert.equal((await run(['notion', 'ensure-project', '--root-page', fake.rootPageId])).code, 0);
  return { run, state };
}

test('Notion: design text with header lines but no --- fences leaves no stale header paragraph on the design page', async () => {
  const { run, state } = await notionProject();
  const made = await run(['work', 'new', '--title', 'Tip split', '--type', 'task', '--json']);
  assert.equal(made.code, 0, made.out + made.err);
  const id = JSON.parse(made.out).id;
  assert.equal((await run(['work', 'design', id, '--create'])).code, 0);
  const text = `work_item: ${id}\nstatus: proposed\napproved: "no"\n\n# ${id}: Tip split — solution design\n\n**Design status:** Proposed\n\n## What this design solves\n\nSplit a bill.\n\n## Selected design\n\nOption A.\n`;
  const saved = await run(['work', 'design', id, '--text', text]);
  assert.equal(saved.code, 0, saved.out + saved.err);
  assert.match(saved.out, /without the --- fences\. They were read as the design's header, not saved as design text\./);
  const shown = await run(['work', 'design', id]);
  const body = shown.out.slice(shown.out.indexOf(`# ${id}`));
  assert.doesNotMatch(body, /work_item:|approved: "no"/, body);
  // The design page blocks in Notion hold no paragraph made of the header lines.
  const blocks = JSON.stringify(JSON.parse(fs.readFileSync(state, 'utf8')));
  assert.doesNotMatch(blocks, /work_item: SA-001 status: proposed/);
  assert.doesNotMatch(blocks, /"content":"work_item: /);
});

test('Notion: moving an item to 11 User approval with no acceptance check prints the note', async () => {
  const { run } = await notionProject();
  const made = await run(['work', 'new', '--title', 'Tip split', '--type', 'task', '--json']);
  const id = JSON.parse(made.out).id;
  await run(['work', 'set', id, '--stage', '08-implementation']);
  const res = await run(['work', 'set', id, '--stage', '11-user-approval', '--waiting-on', 'owner']);
  assert.equal(res.code, 0, res.out + res.err);
  assert.match(res.out, new RegExp(`Note: ${id} is at 11 User approval, and no acceptance-checker check is recorded since its last build\\.`));
});

test('the briefing line for a Notion timeout does not end ".)."', () => {
  const line = notionReadProblem({ message: 'Notion is busy (timeout) and the time limit for this job does not allow another try.', notionCode: 'timeout' }, true);
  assert.equal(line, 'The Notion work items could not be read in 2 seconds (Notion is busy (timeout) and the time limit for this job does not allow another try). The list below is the local copy from the last toolkit command.');
  assert.match(notionReadProblem({ message: 'Notion refused the call.', details: { fix: 'Run ntn login.' } }, false), /^The Notion work items could not be read: Notion refused the call\. Fix: Run ntn login\. toolkit work list reads them\.$/);
});
