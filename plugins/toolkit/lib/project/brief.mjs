// The session briefing (ARCHITECTURE section 6, SessionStart row), also
// printed by `toolkit brief`. About 6,000 characters at most:
//   this worktree's item, active items with the skill that continues each
//   one, what waits on the owner, moves found in the tracker, the current
//   focus, setup warnings, and a plain statement that AGENTS.md is the project
//   manual. Codex also gets the always-on rules list and the "How to write
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
  const mainRoot = project.mainRoot || project.root;
  let cache = readTrackerCache(mainRoot);
  let problem = null;
  if (live || !Object.keys(cache.items).length) {
    try {
      const { openTracker } = await import('../work/driver.mjs');
      const tracker = await openTracker(project, { env, cwd, pluginRoot, deadlineMs: 2000, timeoutMs: 2000 });
      await tracker.sync({ quick: true });
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
    }));
  const thisItem = wt.id ? items.find((i) => i.id === wt.id) || null : null;
  const active = items.filter((i) => ['Ready', 'In Progress', 'In Review'].includes(i.status)).map((i) => ({ ...i, thisWorktree: Boolean(thisItem && thisItem.id === i.id) }));
  const waitingOnOwner = [];
  for (const i of items) {
    if (isTerminal(i.status)) continue;
    if (String(i.waiting_on || '').toLowerCase() === 'owner') waitingOnOwner.push({ id: i.id, title: i.title, what: `${i.id} is waiting on the owner (${i.stageLabel}).`, continueWith: 'work-decide' });
    if (i.openOwnerQuestions) waitingOnOwner.push({ id: i.id, title: i.title, what: `${i.openOwnerQuestions} open question${i.openOwnerQuestions === 1 ? '' : 's'} for the owner.`, continueWith: 'work-decide' });
  }
  const counts = { backlog: 0, ready: 0, inProgress: 0, inReview: 0, done: 0, cancelled: 0 };
  const key = { Backlog: 'backlog', Ready: 'ready', 'In Progress': 'inProgress', 'In Review': 'inReview', Done: 'done', Cancelled: 'cancelled' };
  for (const i of items) if (key[i.status]) counts[key[i.status]] += 1;
  return {
    tracker: 'notion',
    unsupported: false,
    reportLines: [],
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
      header: 'Changes found in the tracker since the last toolkit command (the work-organize skill handles moves and copies; work-decide handles questions):',
      items: moves.map((l) => `- ${clip(l, 300)}`),
      more: 'toolkit work sync prints the full report.',
    });
  }
  return sections;
}

/**
 * How long each current-focus section stays when the briefing is too long:
 * higher stays longer. The lines above the first "## " heading (the
 * "Updated:" date and the usage note) go first; "Now" and "Next session
 * starts with" go last.
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

function memorySections(mem) {
  const sections = [];
  if (!mem.ok) {
    sections.push({ key: 'memory', priority: 8, lines: [mem.problem || mem.text] });
    return sections;
  }
  const live = (mem.records || []).filter((r) => r.status !== 'retired');
  const focus = String(mem.focus || '').trim().split('\n').filter((l) => !/^# /.test(l)).join('\n').trim();
  if (focus) {
    const items = focus.split('\n');
    sections.push({ key: 'focus', priority: 6, header: 'Current focus:', items, dropOrder: focusDropOrder(items), more: 'toolkit memory focus prints all of it.' });
  }
  const needsReview = live.filter((r) => r.status === 'needs-review').length;
  sections.push({
    key: 'memory-count',
    priority: 5,
    lines: [`Project memory (${mem.backend}): ${live.length} record${live.length === 1 ? '' : 's'}${needsReview ? `, ${needsReview} needing review` : ''}${mem.source === 'cache' ? ', from the local copy' : ''}. toolkit memory find searches it; toolkit memory get <key> reads one record.`],
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
 * opts: { host: 'claude'|'codex', env, pluginRoot, cwd, sync: 'full'|'quick'|false, maxChars, fetch, liveNotion }
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
  const findings = checks.findings.filter((f) => host === 'codex' || f.area !== 'codex');
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
    ],
  });
  sections.push(...workSections(work));
  sections.push(...memorySections(memory));
  sections.push(...warningSection(findings));
  if (host === 'codex') sections.push(...codexSections(project.root));

  const text = fitSections(sections, maxChars);
  return { text, work, memory, findings };
}
