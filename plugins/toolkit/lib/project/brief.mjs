// The session briefing (ARCHITECTURE section 6, SessionStart row), also
// printed by `toolkit brief`. About 6,000 characters at most:
//   this worktree's item, active items with the skill that continues each
//   one, what waits on the owner, moves found in the tracker, the current
//   focus (and a note when it is older than the newest work item change),
//   saved memory proposals (not facts; waiting on the owner), the setup
//   steps in the focus that are done now, setup warnings, and a plain
//   statement that AGENTS.md is the project manual. Codex also gets the always-on rules list and the "How to write
//   replies" section, because Codex has no output styles and never reads
//   .claude/rules/ by itself (critique I5).
//
// The text is written as facts, not orders (the hooks docs warn that
// command-like hook text can read as a prompt injection), and never repeats
// AGENTS.md itself, which both hosts already read (critique P6).
// Notion and Hindsight are read from the Git-ignored caches their commands
// refresh; a live read is tried only with a 2-second deadline, and any
// failure becomes one line instead of an error (critique I9).

import fs from 'node:fs';
import path from 'node:path';
import { EXIT } from '../core/output.mjs';
import { stageShort, continueWith, isTerminal } from '../work/lifecycle.mjs';
import { parseFocus } from '../memory/contract.mjs';
import { alwaysOnRules } from './render.mjs';
import { describeSetup } from './setup.mjs';
import { runChecks } from './checks.mjs';

export const BRIEF_MAX_CHARS = 6000;
const NEXT_ACTION_MAX = 140;

function clip(text, max) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? `${s.slice(0, max - 3).trimEnd()}...` : s;
}

// ------------------------------------------------------------------ work

async function localWork(project, { cwd, env, pluginRoot, sync }) {
  const { workSummary } = await import('../work/report.mjs');
  return workSummary(project, { cwd, env, pluginRoot, sync });
}

async function notionWork(project, { cwd, env, pluginRoot, live }) {
  const { readTrackerCache } = await import('../notion/tracker.mjs');
  const { worktreeItem } = await import('../work/state.mjs');
  const { reportLines } = await import('../work/report.mjs');
  const mainRoot = project.mainRoot || project.root;
  let cache = readTrackerCache(mainRoot);
  let problem = null;
  let moves = [];
  if (live || !Object.keys(cache.items).length) {
    try {
      const { openTracker } = await import('../work/driver.mjs');
      const tracker = await openTracker(project, { env, cwd, pluginRoot, deadlineMs: 2000, timeoutMs: 2000 });
      // Read only, from the row properties: the briefing reports the owner's
      // moves and writes nothing, so it fits the 2-second budget, and the next
      // toolkit command records the history rows (sample run c, round 2).
      const report = await tracker.sync({ quick: true, write: false, movesOnly: true });
      moves = reportLines(report);
      cache = readTrackerCache(mainRoot);
    } catch (err) {
      const copy = Object.keys(cache.items).length ? 'The list below is the local copy from the last toolkit command.' : 'toolkit work list reads them.';
      const fix = err && err.details && err.details.fix ? ` Fix: ${clip(err.details.fix, 200)}` : '';
      const slow = err && (err.notionCode === 'deadline' || err.notionCode === 'timeout' || /did not answer in time|No answer within/.test(String(err.message)));
      problem = slow
        ? `The Notion work items could not be read in 2 seconds (${clip(err.message, 160)}). ${copy}`
        : `The Notion work items could not be read: ${clip(err.message, 200)}${fix} ${copy}`;
    }
  }
  const prefix = String((project.config.notion && project.config.notion.workItems && project.config.notion.workItems.idPrefix) || (project.config.tracker && project.config.tracker.idPrefix) || 'WI');
  let wt = { branch: null, id: null };
  try {
    wt = worktreeItem(cwd, prefix);
  } catch {
    // Not Git.
  }
  const items = Object.entries(cache.items)
    .filter(([, c]) => c && !c.missing && !c.archived)
    .map(([id, c]) => ({
      id,
      title: c.title,
      stage: c.stage,
      stageLabel: stageShort(c.stage),
      status: c.status,
      waiting_on: c.waiting_on,
      nextAction: c.nextAction || null,
      openOwnerQuestions: Number(c.openOwnerQuestions) || 0,
      continueWith: continueWith({ stage: c.stage, status: c.status, waiting_on: c.waiting_on }),
      // When the row last changed (Notion's last edit time), for staleFocusLine().
      updated: c.lastEdited ? String(c.lastEdited).slice(0, 10) : null,
    }));
  const thisItem = wt.id ? items.find((i) => i.id === wt.id) || null : null;
  const active = items.filter((i) => ['Ready', 'In Progress', 'In Review'].includes(i.status)).map((i) => ({ ...i, thisWorktree: Boolean(thisItem && thisItem.id === i.id) }));
  const waitingOnOwner = [];
  for (const i of items) {
    if (isTerminal(i.status)) continue;
    // One entry per item: the open questions when there are some, else the general line.
    if (i.openOwnerQuestions) waitingOnOwner.push({ id: i.id, title: i.title, what: `${i.openOwnerQuestions} open question${i.openOwnerQuestions === 1 ? '' : 's'} for the owner.`, continueWith: 'work-decide' });
    else if (String(i.waiting_on || '').toLowerCase() === 'owner') waitingOnOwner.push({ id: i.id, title: i.title, what: `${i.id} is waiting on the owner (${i.stageLabel}).`, continueWith: 'work-decide' });
  }
  const counts = { backlog: 0, ready: 0, inProgress: 0, inReview: 0, done: 0, cancelled: 0 };
  const key = { Backlog: 'backlog', Ready: 'ready', 'In Progress': 'inProgress', 'In Review': 'inReview', Done: 'done', Cancelled: 'cancelled' };
  for (const i of items) if (key[i.status]) counts[key[i.status]] += 1;
  return {
    tracker: 'notion',
    unsupported: false,
    reportLines: moves,
    worktree: wt,
    thisItem,
    active,
    waitingOnOwner,
    next: null,
    counts,
    problem,
    cacheTime: cache.updated || null,
  };
}

async function workPart(project, opts) {
  const type = String((project.config.tracker && project.config.tracker.type) || 'local');
  try {
    if (type === 'notion') return await notionWork(project, opts);
    const res = await localWork(project, opts);
    return res;
  } catch (err) {
    if (err && err.code === EXIT.UNSUPPORTED) return { tracker: type, unsupported: true, message: err.message };
    return { tracker: type, unsupported: false, failed: true, problem: `The work items could not be read (${clip(err.message, 200)}). toolkit work list shows the error in full.` };
  }
}

// ------------------------------------------------------------------ sections

function itemLine(i, { withSkill = true } = {}) {
  const parts = [`${i.id} ${i.title || ''}`.trim(), `: ${i.stageLabel || stageShort(i.stage)}, ${i.status}`];
  if (i.waiting_on && !['none', 'agent', ''].includes(String(i.waiting_on).toLowerCase())) parts.push(`, waiting on ${i.waiting_on}`);
  parts.push('.');
  if (i.nextAction) parts.push(` Next action: ${clip(i.nextAction, NEXT_ACTION_MAX)}`.replace(/\.?$/, '.'));
  if (withSkill && i.continueWith) parts.push(` Continues with ${i.continueWith}.`);
  return parts.join('');
}

function workSections(work) {
  const sections = [];
  if (work.unsupported) {
    sections.push({ key: 'tracker', priority: 9, lines: [`Work items: ${work.message}`] });
    return sections;
  }
  if (work.problem) sections.push({ key: 'tracker-problem', priority: 9, lines: [work.problem] });
  if (work.failed) return sections;

  const wt = work.worktree || {};
  const wtLines = [];
  if (work.thisItem) {
    wtLines.push(`This worktree is on branch ${wt.branch} and works on ${itemLine(work.thisItem)}`);
  } else if (wt.id) {
    wtLines.push(`This worktree's branch ${wt.branch} names ${wt.id}, which the tracker does not list as open.`);
  } else if (wt.branch) {
    wtLines.push(`This worktree is on branch ${wt.branch}, which names no work item.`);
  }
  if (wtLines.length) sections.push({ key: 'worktree', priority: 9, lines: wtLines });

  const others = (work.active || []).filter((i) => !i.thisWorktree);
  if (others.length) {
    sections.push({
      key: 'active',
      priority: 7,
      header: work.thisItem ? 'Other active items (they may be in progress in other sessions):' : 'Active items:',
      items: others.map((i) => `- ${itemLine(i)}`),
      more: 'toolkit work list shows every item.',
    });
  } else if (!work.thisItem) {
    const c = work.counts || {};
    const next = work.next;
    const lines = ['No item is Ready, In Progress, or In Review.'];
    if (next) lines.push(`The next item by priority is ${next.id} ${next.title} (${next.stageLabel}, ${next.status}); it continues with ${next.continueWith}.`);
    else if (c.backlog) lines.push(`The backlog has ${c.backlog} item${c.backlog === 1 ? '' : 's'}; toolkit work next suggests which to take up.`);
    else lines.push('The tracker has no open items. A new request starts a work item with the work-on skill.');
    sections.push({ key: 'active', priority: 7, lines });
  }

  const waiting = work.waitingOnOwner || [];
  if (waiting.length) {
    sections.push({
      key: 'waiting',
      priority: 8,
      header: 'Waiting on the owner:',
      items: waiting.map((d) => `- ${d.id}${d.title ? ` ${d.title}` : ''}: ${clip(d.what, 200)}${d.detail ? ` ${clip(d.detail, 160)}` : ''} (${d.continueWith})`),
      more: 'toolkit work decisions lists them all.',
    });
  }

  const todos = work.agentTodos || [];
  if (todos.length) {
    sections.push({
      key: 'agent-todos',
      priority: 6,
      header: 'Agent to-do (not a decision the owner is waiting on):',
      items: todos.map((d) => `- ${d.id}${d.title ? ` ${d.title}` : ''}: ${clip(d.what, 200)} (${d.continueWith})`),
      more: 'toolkit work decisions lists them all.',
    });
  }

  const c = work.counts;
  if (c) {
    const bits = [];
    if (c.inProgress) bits.push(`${c.inProgress} in progress`);
    if (c.inReview) bits.push(`${c.inReview} in review`);
    if (c.ready) bits.push(`${c.ready} ready`);
    if (c.backlog) bits.push(`${c.backlog} in the backlog`);
    if (c.done) bits.push(`${c.done} done`);
    if (bits.length) sections.push({ key: 'counts', priority: 5, lines: [`Items: ${bits.join(', ')}.${work.cacheTime ? ` (Local copy of the Notion board from ${work.cacheTime}.)` : ''}`] });
  }

  const moves = work.reportLines || [];
  if (moves.length) {
    sections.push({
      key: 'moves',
      priority: 8,
      header: 'Changes found in the tracker since the last toolkit command. The owner has not been told about them in this session; work-on and work-organize say each line below to him as written, before other work (work-organize handles moves and copies; work-decide handles questions):',
      items: moves.map((l) => `- ${clip(l, 300)}`),
      more: 'toolkit work sync prints the full report.',
    });
  }
  return sections;
}

/**
 * How long each current-focus section stays when the briefing is too long:
 * higher stays longer. The lines above the first "## " heading (the
 * "Last updated:" line) go first; "Now" and "Next session starts with" go last.
 */
const FOCUS_KEEP = Object.freeze({ now: 4, 'next session starts with': 4, 'waiting on the owner': 3, 'untracked to-dos': 2 });

/**
 * The order in which the lines of the current focus are dropped: a list of
 * line indexes. Within a section, the last bullet goes first and the heading
 * goes with the section's last line.
 */
export function focusDropOrder(lines) {
  const groups = [];
  let cur = { rank: 0, n: 0, lines: [] };
  lines.forEach((line, i) => {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      groups.push(cur);
      const name = m[1].toLowerCase();
      cur = { rank: Object.prototype.hasOwnProperty.call(FOCUS_KEEP, name) ? FOCUS_KEEP[name] : 1, n: groups.length, lines: [i] };
      return;
    }
    cur.lines.push(i);
  });
  groups.push(cur);
  // Lower rank first; among equal ranks, the later section first.
  groups.sort((a, b) => a.rank - b.rank || b.n - a.n);
  return groups.flatMap((g) => [...g.lines].reverse());
}

/**
 * The lines of the current focus for the briefing, from the model's four-section
 * format: "Last updated: ..." (when filled), then each section that has text,
 * as "## <heading>" and its lines. The fill-in guide comment and lines that are
 * still template prompts are left out. [] when there is no focus; null when
 * it is still the template (no section has text).
 */
export function focusItems(text) {
  if (!String(text || '').trim()) return [];
  const focus = parseFocus(text);
  if (!focus.filled) return null;
  const items = [];
  if (focus.lastUpdated) items.push(`Last updated: ${focus.lastUpdated}`);
  for (const s of focus.sections) {
    if (!s.lines.length) continue;
    items.push(`## ${s.heading}`, ...s.lines);
  }
  return items;
}

/**
 * A line for the briefing when the current focus is older than the newest
 * change to an open work item, or null. Sample run d, round 3 (bug 6): the
 * focus's "Next session starts with" line stayed as session 5 wrote it while
 * WI-001 moved on for four sessions. items: [{ id, updated }], updated a
 * YYYY-MM-DD date or an ISO time; items with no date are left out.
 */
export function staleFocusLine(focusText, items) {
  if (!String(focusText || '').trim()) return null;
  const focus = parseFocus(focusText);
  if (!focus.filled) return null;
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(focus.lastUpdated || '');
  if (!m) return null;
  let newest = null;
  for (const i of items || []) {
    const d = /^(\d{4}-\d{2}-\d{2})/.exec(String((i && i.updated) || ''));
    if (d && d[1] > m[1] && (!newest || d[1] > newest.date)) newest = { id: i.id, date: d[1] };
  }
  if (!newest) return null;
  return `The current focus was last updated ${m[1]}, before ${newest.id} changed on ${newest.date}. Its "Now" and "Next session starts with" lines may be out of date: check them against the work items, and save the focus again when they differ.`;
}

// ------------------------------------------------------------------ setup reminders

/**
 * Setup steps that project-setup writes under "Waiting on the owner" in the
 * current focus, and how to tell that each one is done. Without this, every
 * session copied them forward, even after the owner had done them (sample
 * runs a and d, round 3).
 *   test(line)       the focus line is this reminder
 *   done(facts)      it is done now; facts: { codexFolderTrusted, codexHooksTrusted, newClaudeSession }
 */
const SETUP_REMINDERS = Object.freeze([
  {
    id: 'codex-hooks',
    test: (l) => /\/hooks\b/i.test(l) || (/\btrust/i.test(l) && /\bhooks?\b/i.test(l)),
    done: (f) => f.codexHooksTrusted,
    why: 'Codex trusts the Toolkit V2 hooks now',
  },
  {
    id: 'codex-folder',
    test: (l) => /\btrust/i.test(l) && /\b(folder|project)\b/i.test(l) && !/\bhooks?\b/i.test(l),
    done: (f) => f.codexFolderTrusted,
    why: 'Codex trusts this project folder now',
  },
  {
    id: 'new-claude-session',
    test: (l) => /\b(start|open)\b[^.]*\bnew\b[^.]*\bsession\b/i.test(l) || /\bnext session\b[^.]*\b(settings|load)/i.test(l),
    done: (f) => f.newClaudeSession,
    why: 'a new Claude Code session has started since setup, so it loaded the project settings',
  },
]);

/**
 * The setup reminders in the focus's "Waiting on the owner" section that are
 * done: [{ line, why }]. facts: see SETUP_REMINDERS.
 */
export function doneSetupReminders(focusText, facts) {
  if (!String(focusText || '').trim()) return [];
  const focus = parseFocus(focusText);
  const waiting = focus.sections.find((s) => s.heading.trim().toLowerCase() === 'waiting on the owner');
  if (!waiting) return [];
  const out = [];
  for (const raw of waiting.lines) {
    const line = raw.replace(/^\s*[-*]\s+/, '').trim();
    const r = SETUP_REMINDERS.find((x) => x.test(line));
    if (r && r.done(facts)) out.push({ line, why: r.why });
  }
  return out;
}

/** What the briefing knows about the owner's setup steps (see SETUP_REMINDERS). */
async function setupFacts(project, { env, host, fromHook }) {
  const { codexTrust, codexHookTrustKeys, MARKETPLACE } = await import('./hosts.mjs');
  let folder = false;
  let hooks = false;
  try {
    folder = codexTrust(project.root, env) === 'trusted';
    hooks = codexHookTrustKeys(`toolkit@${MARKETPLACE}:`, env).length > 0;
  } catch {
    // Codex's config cannot be read: nothing is marked done.
  }
  // A Toolkit V2 hook that Codex ran means Codex runs them here.
  if (fromHook && host === 'codex') hooks = true;
  return { codexFolderTrusted: folder, codexHooksTrusted: hooks, newClaudeSession: Boolean(fromHook && host === 'claude') };
}

function reminderSection(done) {
  if (!done.length) return [];
  return [{
    key: 'setup-reminders',
    priority: 7,
    header: 'Setup steps in the current focus that are done now. They are not copied forward: take them out of "Waiting on the owner" at the next focus update:',
    items: done.map((d) => `- "${clip(d.line, 160)}": ${d.why}.`),
  }];
}

function memorySections(mem) {
  const sections = [];
  if (!mem.ok) {
    sections.push({ key: 'memory', priority: 8, lines: [mem.problem || mem.text] });
    return sections;
  }
  const proposals = (mem.records || []).filter((r) => r.proposal && r.status === 'needs-review');
  const live = (mem.records || []).filter((r) => r.status !== 'retired' && !proposals.includes(r));
  const items = focusItems(mem.focus);
  if (items === null) {
    sections.push({ key: 'focus', priority: 6, lines: ['Current focus: still the empty template from setup. The memory-save skill fills it with toolkit memory focus --text \'<text>\'.'] });
  } else if (items.length) {
    sections.push({ key: 'focus', priority: 6, header: 'Current focus:', items, dropOrder: focusDropOrder(items), more: 'toolkit memory focus prints all of it.' });
  }
  if (proposals.length) {
    // Saved proposals (Mike, 2026-09-27): not facts, and waiting on the owner's yes or no.
    sections.push({
      key: 'memory-proposals',
      priority: 8,
      header: 'Memory proposals waiting on the owner (not facts: do not rely on them; work-decide asks him):',
      items: proposals.map((r) => `- ${r.key}: ${clip(r.description, 150)}${r.saved ? ` (proposed ${r.saved})` : ''}`),
      more: 'toolkit work decisions lists them all.',
    });
  }
  const needsReview = live.filter((r) => r.status === 'needs-review').length;
  sections.push({
    key: 'memory-count',
    priority: 5,
    lines: [`Project memory (${mem.backend}): ${live.length} record${live.length === 1 ? '' : 's'}${needsReview ? `, ${needsReview} needing review` : ''}${proposals.length ? `, and ${proposals.length} proposal${proposals.length === 1 ? '' : 's'} the owner has not answered` : ''}${mem.source === 'cache' ? ', from the local copy' : ''}. toolkit memory find searches it; toolkit memory get <key> reads one record.`],
  });
  if (live.length) {
    sections.push({
      key: 'memory-index',
      priority: 2,
      header: 'Memory records:',
      items: live.map((r) => `- ${r.key}: ${clip(r.description, 150)}${r.status === 'needs-review' ? ' (needs review)' : ''}`),
      more: 'toolkit memory list shows every record.',
    });
  }
  return sections;
}

function warningSection(findings) {
  const shown = findings.filter((f) => f.severity === 'problem' || f.severity === 'warning');
  if (!shown.length) return [];
  return [{
    key: 'warnings',
    priority: 8,
    header: 'Setup warnings (toolkit doctor lists every check; the project-setup skill fixes them):',
    items: shown.map((f) => `- ${clip(f.message, 500)}${f.fix ? ` Fix: ${clip(f.fix, 300)}` : ''}`),
    more: 'toolkit doctor lists them all.',
  }];
}

/** The "How to write replies" section of the project's AGENTS.md, without its heading. */
export function voiceSection(root) {
  let text = '';
  try {
    text = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  } catch {
    return [];
  }
  const lines = text.split('\n');
  const at = lines.findIndex((l) => /^##\s+How to write replies\s*$/.test(l));
  if (at === -1) return [];
  const out = [];
  for (let i = at + 1; i < lines.length; i++) {
    if (/^#{1,2}\s/.test(lines[i])) break;
    out.push(lines[i]);
  }
  return out.join('\n').trim().split('\n');
}

function codexSections(root) {
  const sections = [];
  const rules = alwaysOnRules(root);
  if (rules.length) {
    sections.push({
      key: 'rules',
      priority: 8,
      header: 'Always-on rules. Claude Code loads them by itself; in Codex, each one is read at session start:',
      items: rules.map((r) => `- .claude/rules/${r.name}: ${r.purpose}`),
      more: 'The "Rules" section of AGENTS.md lists them all.',
    });
  }
  const voice = voiceSection(root);
  if (voice.length) sections.push({ key: 'voice', priority: 8, header: 'How to write replies (from AGENTS.md):', items: voice, more: 'The rest is in the "How to write replies" section of AGENTS.md.' });
  return sections;
}

// ------------------------------------------------------------------ assembly

function render(sections) {
  const blocks = [];
  for (const s of sections) {
    const lines = [];
    if (s.header) lines.push(s.header);
    if (s.lines) lines.push(...s.lines);
    if (s.items) {
      lines.push(...s.items.filter((l) => l !== null));
      if (s.cut) lines.push(`- ... ${s.cut} more. ${s.more || ''}`.trimEnd());
    }
    if (lines.length) blocks.push(lines.join('\n'));
  }
  return blocks.join('\n\n');
}

/** Shorten the lowest-priority lists first until the text fits. */
export function fitSections(sections, maxChars) {
  let text = render(sections);
  let guard = 0;
  while (text.length > maxChars && guard++ < 2000) {
    const candidates = sections.filter((s) => s.items && s.items.filter((l) => l !== null).length > 1).sort((a, b) => a.priority - b.priority);
    let target = candidates[0];
    if (!target) {
      const drop = sections.filter((s) => s.priority < 9).sort((a, b) => a.priority - b.priority)[0];
      if (!drop) break;
      sections.splice(sections.indexOf(drop), 1);
      text = render(sections);
      continue;
    }
    if (target.dropOrder && target.dropOrder.length) {
      const at = target.dropOrder.shift();
      const blank = target.items[at] !== null && !String(target.items[at]).trim();
      target.items[at] = null;
      if (!blank) target.cut = (target.cut || 0) + 1;
    } else {
      target.items.pop();
      target.cut = (target.cut || 0) + 1;
    }
    text = render(sections);
  }
  if (text.length > maxChars) text = `${text.slice(0, maxChars - 60).replace(/\n[^\n]*$/, '')}\n[Cut to fit. toolkit brief prints this again.]`;
  return text;
}

/**
 * Build the briefing.
 * opts: { host: 'claude'|'codex', env, pluginRoot, cwd, sync: 'full'|'quick'|false, maxChars, fetch, liveNotion, fromHook }
 *   fromHook: the SessionStart hook delivers the text (see the Codex trust findings below).
 * Returns { text, work, memory, findings }.
 */
export async function buildBriefing(project, opts = {}) {
  const env = opts.env || process.env;
  const host = opts.host === 'codex' ? 'codex' : 'claude';
  const cwd = opts.cwd || project.root;
  const maxChars = opts.maxChars || BRIEF_MAX_CHARS;
  const config = project.config;

  const [work, memory, checks] = await Promise.all([
    workPart(project, { cwd, env, pluginRoot: opts.pluginRoot, sync: opts.sync === undefined ? 'quick' : opts.sync, live: Boolean(opts.liveNotion) }),
    (async () => {
      const { memoryBriefing } = await import('../memory/startup.mjs');
      return memoryBriefing(project, { timeoutMs: 2000, env, fetch: opts.fetch });
    })(),
    runChecks(project, { env, pluginRoot: opts.pluginRoot, quick: true }).catch(() => ({ findings: [] })),
  ]);

  // Codex trust matters only to a Codex session; toolkit doctor shows it everywhere.
  let findings = checks.findings.filter((f) => host === 'codex' || f.area !== 'codex');
  if (opts.fromHook && host === 'codex') {
    // This text comes from a Toolkit V2 hook that Codex ran, so Codex runs the
    // Toolkit V2 hooks here: a finding that says it skips them is false.
    // When the toolkit plugin is off for the whole computer, only the
    // project's own .codex/config.toml turned it on, and Codex reads that file
    // only in a trusted folder, so the folder-trust finding is false too.
    // toolkit doctor still reports both.
    const { codexPluginOnEverywhere } = await import('./hosts.mjs');
    const folderTrusted = !codexPluginOnEverywhere('toolkit', env);
    findings = findings.filter((f) => f.id !== 'codex-hook-trust' && !(folderTrusted && f.id === 'codex-trust'));
  }
  if (work.report && Array.isArray(work.report.problems)) {
    for (const p of work.report.problems) {
      if (p.severity === 'error') findings.push({ id: 'tracker-problem', severity: 'warning', message: p.message, fix: 'toolkit work validate shows the details.' });
    }
  }

  const sections = [];
  sections.push({
    key: 'head',
    priority: 10,
    lines: [
      `Project briefing: ${describeSetup(config)}`,
      `Project manual: ${path.join(project.root, 'AGENTS.md')}. Stages, statuses, and approval gates: toolkit work lifecycle.`,
      // Routing check, 2026-09-27 (dev/test-runs/skill-routing.md): Claude Code
      // often ran toolkit commands first and then answered without the skill.
      // Stated as a fact, as the hooks docs advise for injected context.
      'Requests go through the matching skill first: its first step checks whether the request fits, before any toolkit command runs.',
    ],
  });
  sections.push(...workSections(work));
  const memSections = memorySections(memory);
  if (memory.ok && memory.focus) {
    const stale = staleFocusLine(memory.focus, [work.thisItem, ...(work.active || []), work.next].filter(Boolean));
    const at = memSections.findIndex((x) => x.key === 'focus');
    if (stale && at !== -1) memSections.splice(at + 1, 0, { key: 'focus-stale', priority: 7, lines: [stale] });
  }
  sections.push(...memSections);
  if (memory.ok && memory.focus) {
    const facts = await setupFacts(project, { env, host, fromHook: Boolean(opts.fromHook) });
    sections.push(...reminderSection(doneSetupReminders(memory.focus, facts)));
  }
  sections.push(...warningSection(findings));
  if (host === 'codex') sections.push(...codexSections(project.root));

  const text = fitSections(sections, maxChars);
  return { text, work, memory, findings };
}
