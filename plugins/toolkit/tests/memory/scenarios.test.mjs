// The memory test set (Mike, 2026-09-27, GOAL "Memory additions" 4). Each
// scenario runs the real `toolkit memory` commands against every backend:
//   builtin    .memory/ files
//   notion     the fake Notion behind a fake ntn program (tests/notion/fake-ntn.mjs)
//   hindsight  the local Hindsight server; skipped when it is not running.
//              Only banks named tkv2-test-... are made, and they are deleted.
//
// Scenarios:
// 1. Fresh-session handoff: what one session writes in the current focus is
//    what the next session's briefing shows.
// 2. A corrected fact replaces the old one: the duplicate check stops a second
//    record, --supersedes replaces it, and the old one is no longer returned.
// 3. "Not in memory" instead of a guess: a question no record answers finds nothing.
// 4. No leak between two projects on the same backend.
// Also, for every backend: saved proposals (not facts until the owner answers)
// and clean deletes (a deleted or rejected record leaves the briefing cache).

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { requireProject } from '../../lib/core/config.mjs';
import { memoryBriefing, readCache } from '../../lib/memory/startup.mjs';
import { listProposals } from '../../lib/memory/proposals.mjs';
import { HindsightClient, DEFAULT_URL } from '../../lib/hindsight/client.mjs';
import { ensureBank } from '../../lib/hindsight/bank.mjs';
import { readCache as readNotionCache } from '../../lib/notion/context.mjs';
import { PROJECTS_BASE_PROPERTIES } from '../../lib/notion/schema.mjs';
import { FakeNotion, seedProjects } from '../notion/fake-notion.mjs';
import { cleanup, makeProject, runToolkit, tempDir } from './helpers.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FAKE_NTN = path.join(HERE, '..', 'notion', 'fake-ntn.mjs');

const hindsight = new HindsightClient({ url: DEFAULT_URL });
const banks = new Set();
let hindsightUp = false;

before(async () => {
  try {
    const h = await hindsight.health({ timeoutMs: 2000 });
    hindsightUp = Boolean(h && h.status === 'healthy');
  } catch {
    hindsightUp = false;
  }
});

after(async () => {
  for (const bank of banks) {
    if (!bank.startsWith('tkv2-test-')) continue;
    try {
      await hindsight.deleteBank(bank);
    } catch {
      // Already gone.
    }
  }
  cleanup();
});

// ------------------------------------------------------------------ backends

/** Environment variables that keep a test away from the real home folder and machine settings. */
function scratchEnv(extra = {}) {
  const home = tempDir('tk-scen-home-');
  return {
    ...process.env,
    HOME: home,
    CLAUDE_CONFIG_DIR: path.join(home, '.claude'),
    CODEX_HOME: path.join(home, '.codex'),
    TOOLKIT_V2_CONFIG_DIR: path.join(home, '.config', 'toolkit-v2'),
    ...extra,
  };
}

/** A shared fake Notion for one test: a state file the fake ntn reads and writes. */
function fakeNotion() {
  const dir = tempDir('tk-scen-notion-');
  const fake = new FakeNotion();
  seedProjects(fake, PROJECTS_BASE_PROPERTIES);
  const state = path.join(dir, 'fake-notion.json');
  fs.writeFileSync(state, JSON.stringify(fake.toJSON()));
  const env = scratchEnv({
    TOOLKIT_NTN_BIN: FAKE_NTN,
    FAKE_NOTION_STATE: state,
    TOOLKIT_V2_CONFIG_DIR: path.join(dir, 'machine'),
    TOOLKIT_NOTION_MIN_INTERVAL_MS: '0',
  });
  return { env, rootPageId: fake.rootPageId };
}

const BACKENDS = {
  builtin: {
    skip: () => null,
    shared: () => ({ env: scratchEnv() }),
    async project(shared, label) {
      const { root } = makeProject({ key: `scen-${label}`, extra: { project: { name: `Scenario ${label}`, key: `scen-${label}`, owner: 'Mike' } } });
      return { root, env: shared.env };
    },
  },
  notion: {
    skip: () => null,
    shared: () => fakeNotion(),
    async project(shared, label) {
      const { root } = makeProject({
        memory: { type: 'notion', approval: 'onboarding' },
        key: `scen-${label}`,
        extra: { project: { name: `Scenario ${label}`, key: `scen-${label}`, owner: 'Mike' }, notion: {} },
      });
      const res = await runToolkit(['notion', 'ensure-project', '--root-page', shared.rootPageId], { cwd: root, env: shared.env });
      assert.equal(res.code, 0, res.stderr || res.stdout);
      return { root, env: shared.env };
    },
  },
  hindsight: {
    skip: () => (hindsightUp ? null : `the Hindsight server is not running at ${DEFAULT_URL}`),
    shared: () => ({ env: scratchEnv() }),
    async project(shared, label) {
      const bank = `tkv2-test-scen-${label}-${crypto.randomBytes(3).toString('hex')}`;
      banks.add(bank);
      await ensureBank({ client: hindsight, bank, projectKey: bank, claimed: true });
      const { root } = makeProject({ memory: { type: 'hindsight' }, hindsight: { url: DEFAULT_URL, bank }, key: bank });
      return { root, env: shared.env, bank };
    },
  },
};

/** Run toolkit in a project; fails the test with the output when the exit code is not the one wanted. */
async function tk(p, args, { code = 0 } = {}) {
  const res = await runToolkit(args, { cwd: p.root, env: { ...p.env, TOOLKIT_DEBUG: '1' } });
  assert.equal(res.code, code, `toolkit ${args.join(' ')} gave ${res.code}:\n${res.stdout}${res.stderr}`);
  return res;
}

function note(point, why = 'The owner said so in chat.') {
  return `# Note\n\n**Remember:** ${point}\n\n**Why:** ${why}\n`;
}

function saveArgs(name, description, point, extra = []) {
  return ['memory', 'save', '--type', 'project', '--name', name, '--description', description, '--body', note(point), '--source', 'Mike, in chat, 2026-09-28', ...extra];
}

async function findJson(p, query, extra = []) {
  const res = await tk(p, ['memory', 'find', query, '--json', ...extra]);
  return res.json;
}

function forEachBackend(title, fn) {
  for (const [name, b] of Object.entries(BACKENDS)) {
    test(`${name}: ${title}`, { timeout: 240000 }, async (t) => {
      const why = b.skip();
      if (why) {
        t.skip(why);
        return;
      }
      await fn(b, name);
    });
  }
}

// ------------------------------------------------------------------ 1. fresh-session handoff

const FOCUS = [
  '## Now',
  '',
  '- WI-002 adds the --shout flag.',
  '',
  '## Waiting on the owner',
  '',
  '- None.',
  '',
  '## Untracked to-dos',
  '',
  '- None.',
  '',
  '## Next session starts with',
  '',
  '- Run the WI-002 acceptance check, then ask the owner for the result approval.',
  '',
].join('\n');

forEachBackend('a fresh session picks up the current focus and the records the last session saved', async (b) => {
  const shared = b.shared();
  const p = await b.project(shared, 'handoff');
  // Session 1 saves a fact and ends by writing the focus without its heading or date.
  await tk(p, saveArgs('greet-output', 'The greet command prints Hello and the name', 'greet prints "Hello, <name>!".', ['--approved-by', 'Mike']));
  const set = await tk(p, ['memory', 'focus', '--text', FOCUS]);
  assert.match(set.stdout, /Added what the model's focus has and the text did not: the "# Current focus" heading and the "Last updated: \d{4}-\d{2}-\d{2}" line\./);

  // Session 2 starts fresh: its briefing is what the session-start hook shows.
  const project = requireProject(p.root);
  const brief = await memoryBriefing(project, { env: p.env, timeoutMs: 10000 });
  assert.equal(brief.ok, true, brief.problem || '');
  assert.match(brief.text, /Last updated: \d{4}-\d{2}-\d{2}, saved with toolkit memory focus/);
  assert.match(brief.text, /## Next session starts with\n- Run the WI-002 acceptance check, then ask the owner for the result approval\./);
  assert.match(brief.text, /## Now\n- WI-002 adds the --shout flag\./);
  assert.match(brief.text, /project_greet_output: The greet command prints Hello and the name/);
  const focus = await tk(p, ['memory', 'focus']);
  assert.match(focus.stdout, /^# Current focus\n/);
  assert.match(focus.stdout, /Run the WI-002 acceptance check/);
});

// ------------------------------------------------------------------ 2. a corrected fact

forEachBackend('a corrected fact supersedes the old one, and the old one is no longer returned', async (b) => {
  const shared = b.shared();
  const p = await b.project(shared, 'correct');
  await tk(p, saveArgs('deploy-day', 'Deploys happen on Tuesday mornings', 'Deploys happen on Tuesday mornings.', ['--approved-by', 'Mike']));
  const before = await findJson(p, 'deploy mornings');
  assert.deepEqual(before.results.map((r) => r.key), ['project_deploy_day']);

  // The owner corrects it. A second record about the same thing is stopped...
  const dup = await tk(p, saveArgs('deploy-day-thursday', 'Deploys happen on Thursday mornings', 'Deploys happen on Thursday mornings.', ['--approved-by', 'Mike']), { code: 2 });
  assert.match(dup.stderr, /project_deploy_day_thursday was not saved: memory already has a record like it\./);
  assert.match(dup.stderr, /- project_deploy_day, a very similar description: Deploys happen on Tuesday mornings/);
  assert.match(dup.stderr, /add --supersedes <key>/);
  // ...and saved as the replacement.
  const saved = await tk(p, saveArgs('deploy-day-thursday', 'Deploys happen on Thursday mornings', 'Deploys happen on Thursday mornings.', ['--approved-by', 'Mike', '--supersedes', 'project_deploy_day', '--json']));
  assert.equal(saved.json.retired, 'project_deploy_day');

  const after = await findJson(p, 'deploy mornings');
  assert.deepEqual(after.results.map((r) => r.key), ['project_deploy_day_thursday'], 'only the corrected fact is found');
  const listed = (await tk(p, ['memory', 'list', '--json'])).json.records.map((r) => r.key);
  assert.ok(!listed.includes('project_deploy_day'));
  const old = (await tk(p, ['memory', 'get', 'project_deploy_day', '--json'])).json;
  assert.equal(old.status, 'retired');
  assert.equal(old.superseded_by, 'project_deploy_day_thursday');
  const brief = await memoryBriefing(requireProject(p.root), { env: p.env, timeoutMs: 10000 });
  assert.doesNotMatch(brief.text, /project_deploy_day:/, 'the briefing does not list the old fact');
  assert.match(brief.text, /project_deploy_day_thursday: Deploys happen on Thursday mornings/);
  // It is still there on request, marked as replaced.
  const all = await tk(p, ['memory', 'find', 'deploy mornings', '--all']);
  assert.match(all.stdout, /project_deploy_day \[superseded by project_deploy_day_thursday\]/);
});

// ------------------------------------------------------------------ 3. no guessing

forEachBackend('a question no record answers finds nothing, instead of the closest record', async (b, name) => {
  const shared = b.shared();
  const p = await b.project(shared, 'abstain');
  await tk(p, saveArgs('deploy-day', 'Deploys happen on Tuesday mornings', 'Deploys happen on Tuesday mornings.', ['--approved-by', 'Mike']));
  await tk(p, saveArgs('stack', 'The app runs on Node 20 with no npm packages', 'The app runs on Node 20 with no npm packages.', ['--approved-by', 'Mike']));
  await tk(p, saveArgs('writing-style', 'Replies use plain English with short sentences', 'Replies use plain English, short sentences, and no jargon.', ['--approved-by', 'Mike']));
  const res = await tk(p, ['memory', 'find', 'What is the office wifi password?']);
  assert.match(res.stdout, /^No memory record(s match| is about| is known to be about) "What is the office wifi password\?"\./);
  assert.doesNotMatch(res.stdout, /before relying on it/, 'nothing is offered as an answer');
  const json = await findJson(p, 'What is the office wifi password?');
  assert.deepEqual(json.results, []);
  // A question a record does answer still finds it.
  const hit = await findJson(p, 'deploy tuesday');
  assert.equal(hit.results[0].key, 'project_deploy_day');

  // The plain-English record is not about the backend's language, though its
  // words are close ("language", "English"): it is never listed as an answer.
  const language = await tk(p, ['memory', 'find', 'What language is the backend written in?']);
  assert.doesNotMatch(language.stdout, /is about "What language/);
  assert.doesNotMatch(language.stdout, /before relying on it/);
  assert.deepEqual((await findJson(p, 'What language is the backend written in?')).results, []);
  // The plain-English record answers this one in other words. Keyword search
  // (built-in, Notion) cannot find it, and says so; Hindsight lists it to be
  // read before any answer, never as "not in memory" alone.
  const phrase = await tk(p, ['memory', 'find', 'How should I phrase my answers?']);
  const phraseJson = await findJson(p, 'How should I phrase my answers?');
  if (name === 'hindsight') {
    const offered = [...phraseJson.results, ...(phraseJson.maybe || []), ...(phraseJson.closest || []).slice(0, 1)].map((r) => r.key);
    assert.ok(offered.includes('project_writing_style'), `recall offers the record to read: ${phrase.stdout}`);
    if (!phraseJson.results.length) assert.match(phrase.stdout, /^Do not answer from these\. Read the first one[^\n]* with toolkit memory get <key>, and answer only if its text says it; otherwise say it is not in memory\.$/m);
    for (const q of ['What language is the backend written in?', 'What is the office wifi password?']) {
      const r = await tk(p, ['memory', 'find', q]);
      assert.match(r.stdout, /^Do not answer from these\. Read the first one/m, `the agent reads before it answers: ${r.stdout}`);
    }
  } else {
    assert.deepEqual(phraseJson.results, [], 'keyword search shares no word with the record, so it lists nothing');
    assert.match(phrase.stdout, /^No memory records match "How should I phrase my answers\?"\./);
  }
});

// ------------------------------------------------------------------ 4. no leak between projects

forEachBackend('two projects on the same backend never see each other\'s memory', async (b) => {
  const shared = b.shared();
  const a = await b.project(shared, 'leak-a');
  const other = await b.project(shared, 'leak-b');
  await tk(a, saveArgs('billing-rule', 'Invoices go out on the first of the month', 'Invoices go out on the first of the month.', ['--approved-by', 'Mike']));
  await tk(a, ['memory', 'focus', '--text', FOCUS.replace('WI-002 adds the --shout flag.', 'BILL-7 sends invoices.')]);
  await tk(other, saveArgs('greeting', 'The app greets people by name', 'The app greets people by name.', ['--approved-by', 'Mike']));

  assert.deepEqual((await findJson(other, 'invoices month')).results, []);
  assert.deepEqual((await tk(other, ['memory', 'list', '--json'])).json.records.map((r) => r.key), ['project_greeting']);
  await tk(other, ['memory', 'get', 'project_billing_rule'], { code: 1 });
  const focus = await tk(other, ['memory', 'focus']);
  assert.doesNotMatch(focus.stdout, /BILL-7/);
  const brief = await memoryBriefing(requireProject(other.root), { env: other.env, timeoutMs: 10000 });
  assert.doesNotMatch(brief.text, /billing|BILL-7/i);
  // And the first project still has its own.
  assert.deepEqual((await findJson(a, 'invoices month')).results.map((r) => r.key), ['project_billing_rule']);
});

// ------------------------------------------------------------------ proposals and clean deletes

forEachBackend('a saved proposal is not a fact until the owner answers; approve and reject record his answer', async (b, name) => {
  const shared = b.shared();
  const p = await b.project(shared, 'proposal');
  const saved = await tk(p, saveArgs('release-day', 'Releases go out on Fridays', 'Releases go out on Fridays.', ['--proposal', '--json']));
  assert.equal(saved.json.proposal, true);
  await tk(p, saveArgs('office-plant', 'The office plant is watered on Mondays', 'The office plant is watered on Mondays.', ['--proposal']));

  // Not a fact: find leaves it out, the briefing lists it as waiting on the owner.
  assert.deepEqual((await findJson(p, 'releases fridays')).results, []);
  assert.deepEqual((await findJson(p, 'releases fridays', ['--proposals'])).results.map((r) => r.key), ['project_release_day']);
  const project = requireProject(p.root);
  assert.deepEqual((await listProposals(project, { env: p.env })).map((x) => x.key).sort(), ['project_office_plant', 'project_release_day']);
  const brief = await memoryBriefing(project, { env: p.env, timeoutMs: 10000 });
  assert.match(brief.text, /Memory proposals the owner has not answered \(not facts; do not rely on them\):\n- project_office_plant/);
  assert.doesNotMatch(brief.text, /Memory records:\n[^]*project_release_day/, 'a proposal is not in the list of records');
  const got = await tk(p, ['memory', 'get', 'project_release_day']);
  assert.match(got.stdout, /this is a proposal the owner has not answered/);
  if (name === 'builtin') {
    // An agent that reads only .memory/MEMORY.md (the model's AGENTS.md says to) sees it is a proposal.
    const index = fs.readFileSync(path.join(p.root, '.memory', 'MEMORY.md'), 'utf8');
    assert.match(index, /^- \[project_release_day\.md\]\(project_release_day\.md\) — Releases go out on Fridays \[proposal: not a fact until the owner answers\]$/m);
    assert.doesNotMatch(index, /needs-review/);
  }

  // His yes.
  const approved = await tk(p, ['memory', 'approve', 'project_release_day', '--by', 'Mike']);
  assert.match(approved.stdout, /^Approved project_release_day: it is now a current memory record, approved by Mike on \d{4}-\d{2}-\d{2}\./);
  const rec = (await tk(p, ['memory', 'get', 'project_release_day', '--json'])).json;
  assert.equal(rec.status, 'current');
  if (name === 'builtin') {
    assert.match(fs.readFileSync(path.join(p.root, '.memory', 'MEMORY.md'), 'utf8'), /^- \[project_release_day\.md\]\(project_release_day\.md\) — Releases go out on Fridays$/m, 'approved: listed as a record');
  }
  assert.match(rec.authorization, /^Approved by Mike on \d{4}-\d{2}-\d{2}$/);
  assert.deepEqual((await findJson(p, 'releases fridays')).results.map((r) => r.key), ['project_release_day']);

  // His no: the proposal is deleted, and it leaves the briefing cache at once.
  await tk(p, ['memory', 'reject', 'project_release_day'], { code: 2 });
  const rejected = await tk(p, ['memory', 'reject', 'project_office_plant']);
  assert.match(rejected.stdout, /^Rejected project_office_plant: the owner said no, so the proposal was deleted\./);
  await tk(p, ['memory', 'get', 'project_office_plant'], { code: 1 });
  assert.deepEqual(await listProposals(project, { env: p.env }), []);
  const cached = readCache(project);
  if (cached) assert.ok(!cached.records.some((r) => r.key === 'project_office_plant'), 'not in the briefing cache');
  const after = await memoryBriefing(project, { env: p.env, timeoutMs: 10000 });
  assert.doesNotMatch(after.text, /office_plant/);
});

forEachBackend('delete and retire take the record out of the briefing, the caches, and the index', async (b, name) => {
  const shared = b.shared();
  const p = await b.project(shared, 'clean');
  await tk(p, saveArgs('old-host', 'The staging host is called blue', 'The staging host is called blue.', ['--approved-by', 'Mike']));
  await tk(p, saveArgs('api-key-place', 'API keys live in the team vault', 'API keys live in the team vault.', ['--approved-by', 'Mike']));
  const project = requireProject(p.root);
  assert.match((await memoryBriefing(project, { env: p.env, timeoutMs: 10000 })).text, /project_old_host/);

  await tk(p, ['memory', 'delete', 'project_old_host', '--owner-approved']);
  await tk(p, ['memory', 'retire', 'project_api_key_place']);
  const brief = await memoryBriefing(project, { env: p.env, timeoutMs: 10000 });
  assert.doesNotMatch(brief.text, /project_old_host|project_api_key_place/);
  assert.deepEqual((await findJson(p, 'staging host blue')).results, []);
  assert.deepEqual((await findJson(p, 'api keys vault')).results, []);
  if (name === 'builtin') {
    const index = fs.readFileSync(path.join(p.root, '.memory', 'MEMORY.md'), 'utf8');
    assert.doesNotMatch(index, /project_old_host|project_api_key_place/);
  }
  if (name === 'notion') {
    const cache = readNotionCache(p.root, 'memory.json');
    assert.ok(!Object.prototype.hasOwnProperty.call(cache.records || {}, 'project_old_host'), 'the Notion cache has no copy of the deleted record');
  }
  const cached = readCache(project);
  if (cached) assert.ok(!cached.records.some((r) => r.key === 'project_old_host' || r.key === 'project_api_key_place'));
});
