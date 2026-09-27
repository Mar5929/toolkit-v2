// toolkit decision add | list: the project-wide decision log DECISIONS.md at
// the project root (ARCHITECTURE 4.6). Decisions about one work item stay in
// that item. The next id is assigned under one lock in the shared Git folder
// and counts the rows in every worktree plus a number that is never reused, so
// parallel sessions, even in different worktrees, never pick the same one.

import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { readText } from '../core/fsx.mjs';
import { addDecision, readDecisions, DECISIONS_FILE } from '../work/decisions.mjs';
import { todayFor } from '../project/manifest.mjs';

export const summary = 'Project-wide decisions: add a row to DECISIONS.md with the next id, or list them.';

const USAGE = `Usage:
  toolkit decision add --decision <text> --why <text> --by <name> [--replaces D-n]
  toolkit decision list

DECISIONS.md is at the project root and is committed; save it with publish-docs.
Rows are never changed or removed: a later decision names the one it replaces.`;

export function help() {
  return USAGE;
}

const SPEC = { string: ['decision', 'why', 'by', 'replaces', 'host'], boolean: ['json'] };

function one(flags, name) {
  const v = flags[name];
  return Array.isArray(v) ? v[v.length - 1] : v;
}

export async function run(argv, ctx) {
  const sub = argv[0];
  if (!sub || sub === 'help' || sub === '--help' || sub === '-h') {
    out(ctx, USAGE, { ok: true, usage: USAGE });
    return EXIT.OK;
  }
  const args = parseArgs(argv.slice(1), SPEC);
  const project = requireProject(ctx.cwd);
  if (sub === 'add') {
    const res = await addDecision(project.root, {
      decision: one(args.flags, 'decision'),
      why: one(args.flags, 'why'),
      by: one(args.flags, 'by'),
      replaces: one(args.flags, 'replaces'),
      mainRoot: project.mainRoot,
      // The same local date every toolkit command uses (TOOLKIT_TODAY in tests).
      date: todayFor(ctx.env),
    });
    const rel = path.relative(ctx.cwd, res.file) || DECISIONS_FILE;
    const lines = [`Added ${res.id} to ${rel}${res.created ? ' (new file)' : ''}: ${res.row.Decision}`];
    if (res.row.Replaces) lines.push(`It replaces ${res.row.Replaces}.`);
    lines.push('DECISIONS.md is committed to Git: save it with publish-docs.');
    out(ctx, lines, { ok: true, id: res.id, file: res.file, created: res.created, row: res.row });
    return EXIT.OK;
  }
  if (sub === 'list') {
    const file = path.join(project.root, DECISIONS_FILE);
    const rows = readDecisions(readText(file) || '');
    const lines = rows.length
      ? rows.map((r) => `${r.id} (${r.date}, ${r.by}): ${r.decision}${r.replaces ? ` [replaces ${r.replaces}]` : ''}`)
      : [`No decisions in ${DECISIONS_FILE} yet.`];
    out(ctx, lines, { ok: true, file, decisions: rows });
    return EXIT.OK;
  }
  throw new ToolkitError(EXIT.INVALID, `Unknown decision command "${sub}". Commands: add, list.`, { fix: 'Run toolkit decision help.' });
}
