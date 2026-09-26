// toolkit brief: the session briefing, for both hosts.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cleanup, git, initProject, tk } from './helpers.mjs';
import { hasKeepPhrase } from '../../lib/hooks/phrases.mjs';
import { fitSections, focusDropOrder } from '../../lib/project/brief.mjs';

after(cleanup);

async function projectWithItems() {
  const p = await initProject();
  const { root, env } = p;
  const run = async (args) => {
    const r = await tk(root, args, { env });
    assert.equal(r.code, 0, `${args.join(' ')}: ${r.stderr || r.stdout}`);
    return r;
  };
  await run(['work', 'new', '--title', 'Login page', '--type', 'task']);
  await run(['work', 'set', 'WI-001', '--stage', '06-implementation-plan']);
  await run(['work', 'new', '--title', 'Billing export', '--type', 'task']);
  await run(['work', 'set', 'WI-002', '--stage', '05-breakdown', '--waiting-on', 'owner']);
  await run(['work', 'new', '--title', 'Ideas', '--type', 'research']);
  git(root, ['add', '.gitignore', 'AGENTS.md']);
  git(root, ['commit', '-q', '-m', 'first']);
  return p;
}

test('the Claude Code briefing names the manual, active items with their next skill, and what waits on the owner', async () => {
  const { root, env } = await projectWithItems();
  const res = await tk(root, ['brief', '--host', 'claude'], { env });
  assert.equal(res.code, 0, res.stderr);
  const text = res.stdout;
  assert.match(text, /^Project briefing: Acme CRM \(acme-crm\), owner Mike\./);
  assert.ok(text.includes(`Project manual: ${path.join(root, 'AGENTS.md')}.`));
  assert.match(text, /This worktree is on branch main, which names no work item\./);
  assert.match(text, /Active items:\n- WI-001 Login page: 06 [^\n]*In Progress\.[^\n]*Continues with work-on\./);
  assert.match(text, /Waiting on the owner:\n- WI-002 Billing export: WI-002 is waiting on the owner/);
  assert.match(text, /Current focus:/);
  assert.match(text, /Project memory \(builtin\): 0 records/);
  assert.doesNotMatch(text, /Always-on rules/);
  assert.doesNotMatch(text, /How to write replies/);
  assert.ok(text.length < 6000);
  assert.equal(hasKeepPhrase(text), false, 'the briefing does not itself trigger the keep reminder');
});

test('the Codex briefing adds the always-on rules and the voice section', async () => {
  const { root, env } = await initProject();
  const res = await tk(root, ['brief', '--host', 'codex'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Always-on rules\. Claude Code loads them by itself; in Codex, each one is read at session start:\n- \.claude\/rules\/humanize-outbound-text\.md: Humanize Anything Sent to Another Person/);
  assert.match(res.stdout, /How to write replies \(from AGENTS\.md\):/);
  assert.match(res.stdout, /Start with the answer, result, or current status/);
  assert.doesNotMatch(res.stdout, /\.claude\/rules\/ai-external-knowledge\.md:/, 'path-scoped rules are not in the always-on list');
});

test('a worktree branch named after an item ties the worktree to it', async () => {
  const { root, env } = await projectWithItems();
  const wt = path.join(path.dirname(root), 'wt-login');
  git(root, ['worktree', 'add', '-q', wt, '-b', 'wi-001-login-page']);
  fs.copyFileSync(path.join(root, '.toolkit.json'), path.join(wt, '.toolkit.json'));
  const res = await tk(wt, ['brief', '--json'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.json.text, /This worktree is on branch wi-001-login-page and works on WI-001 Login page/);
  assert.match(res.json.text, /Other active items \(they may be in progress in other sessions\):/);
});

test('an item folder moved by hand is reported in the briefing', async () => {
  const { root, env } = await projectWithItems();
  const from = path.join(root, '.work-items', 'WI-003-ideas');
  const parent = fs.readdirSync(path.join(root, '.work-items')).find((n) => n.startsWith('WI-001'));
  fs.renameSync(from, path.join(root, '.work-items', parent, 'WI-003-ideas'));
  const res = await tk(root, ['brief'], { env });
  assert.match(res.stdout, /Changes found in the tracker since the last toolkit command/);
  assert.match(res.stdout, /WI-003[^\n]*parent is now WI-001/);
});

test('the briefing stays under 6,000 characters with many items and memory records', async () => {
  const { root, env } = await initProject();
  for (let i = 1; i <= 40; i++) {
    const r = await tk(root, ['work', 'new', '--title', `A fairly long work item title number ${i} to fill the briefing`, '--type', 'task'], { env });
    assert.equal(r.code, 0, r.stderr);
    await tk(root, ['work', 'set', `WI-${String(i).padStart(3, '0')}`, '--stage', i % 2 ? '06-implementation-plan' : '03-requirements-approved', ...(i % 3 ? [] : ['--waiting-on', 'owner'])], { env });
  }
  for (let i = 1; i <= 30; i++) {
    const r = await tk(root, ['memory', 'save', '--type', 'project', '--name', `fact-${i}`, '--description', `A project fact number ${i} that is long enough to take some room`, '--body', `## Remember\n\nFact ${i}.\n`], { env });
    assert.equal(r.code, 0, r.stderr);
  }
  for (const host of ['claude', 'codex']) {
    const res = await tk(root, ['brief', '--host', host, '--json'], { env });
    assert.equal(res.code, 0);
    assert.ok(res.json.chars <= 6000, `${host}: ${res.json.chars} characters`);
    assert.match(res.json.text, /more\. toolkit (work list|work decisions|memory list) /);
    if (host === 'codex') assert.match(res.json.text, /How to write replies/);
  }
});

test('GitHub and Jira projects get the path to the written instructions', async () => {
  const { root, env } = await initProject({ tracker: 'github' });
  const res = await tk(root, ['brief'], { env });
  assert.equal(res.code, 0, res.stderr);
  assert.match(res.stdout, /Work items: This project tracks work in GitHub Issues\. toolkit work does not manage GitHub Issues; follow the written instructions in plugins\/work\/references\/trackers\/github\.md/);
});

test('a Notion project: the briefing lists items from the local copy of the board (fake ntn)', async () => {
  const { fileURLToPath } = await import('node:url');
  const { FakeNotion, seedProjects } = await import('../notion/fake-notion.mjs');
  const { PROJECTS_BASE_PROPERTIES } = await import('../../lib/notion/schema.mjs');
  const { makeHome, makeRepo, testEnv, tempDir } = await import('./helpers.mjs');
  const here = path.dirname(fileURLToPath(import.meta.url));
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const state = path.join(tempDir(), 'fake-notion.json');
  fs.writeFileSync(state, JSON.stringify(fake.toJSON()));
  const env = testEnv(makeHome(), { TOOLKIT_NTN_BIN: path.join(here, '..', 'notion', 'fake-ntn.mjs'), FAKE_NOTION_STATE: state, TOOLKIT_NOTION_MIN_INTERVAL_MS: '0' });
  fs.mkdirSync(env.TOOLKIT_V2_CONFIG_DIR, { recursive: true });
  fs.writeFileSync(path.join(env.TOOLKIT_V2_CONFIG_DIR, 'notion.json'), JSON.stringify({ rootPageId: fake.rootPageId }));
  const root = makeRepo();
  assert.equal((await tk(root, ['init', '--name', 'Board App', '--tracker', 'notion', '--memory', 'notion'], { env })).code, 0);
  const made = await tk(root, ['work', 'new', '--title', 'Checkout flow', '--json'], { env });
  assert.equal(made.code, 0, made.stderr || made.stdout);
  const id = (made.stdout.match(/[A-Z]+-\d{3}/) || [])[0];
  assert.equal((await tk(root, ['work', 'set', id, '--stage', '06-implementation-plan'], { env })).code, 0);
  const res = await tk(root, ['hook', 'session-start', '--host', 'codex'], { env, stdin: JSON.stringify({ session_id: 's', cwd: root, hook_event_name: 'SessionStart', model: 'm', permission_mode: 'default', source: 'startup', transcript_path: null }) });
  const text = JSON.parse(res.stdout).hookSpecificOutput.additionalContext;
  assert.match(text, new RegExp(`Active items:\\n- ${id} Checkout flow: 06 [^\\n]*In Progress`));
  assert.match(text, /Local copy of the Notion board from/);
  assert.match(text, /Project memory \(notion\)/);
});

test('a briefing too long for its limit cuts the current focus header lines first and keeps "Now" and "Next session starts with" longest', () => {
  const focus = [
    'Updated: 2026-09-26', '', 'Kept with `toolkit memory focus`. Under 50 lines.', '',
    '## Now', '', '- WI-001', '- WI-002', '',
    '## Waiting on the owner', '', '- Pick the colour scheme.', '- Name the release.', '',
    '## Untracked to-dos', '', '- Tidy the README.', '',
    '## Next session starts with', '', '- Finish WI-001 step 3.',
  ];
  const make = () => [
    { key: 'head', priority: 10, lines: ['Project briefing: Acme CRM.'] },
    { key: 'focus', priority: 6, header: 'Current focus:', items: [...focus], dropOrder: focusDropOrder(focus), more: 'toolkit memory focus prints all of it.' },
  ];
  const full = fitSections(make(), 100000);
  for (const max of [full.length - 40, full.length - 120, 230]) {
    const text = fitSections(make(), max);
    assert.ok(text.length <= max, `${text.length} <= ${max}`);
    assert.match(text, /## Now\n(\n)?- WI-001/, `max ${max}`);
    assert.match(text, /## Next session starts with\n(\n)?- Finish WI-001 step 3\./, `max ${max}`);
    assert.doesNotMatch(text, /Updated: 2026-09-26/, `max ${max}`);
  }
  assert.doesNotMatch(fitSections(make(), 230), /Untracked to-dos/);
});
