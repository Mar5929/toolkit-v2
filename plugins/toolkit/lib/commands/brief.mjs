// toolkit brief: the session briefing the SessionStart hook adds.

import { parseArgs } from '../core/args.mjs';
import { EXIT, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { buildBriefing, BRIEF_MAX_CHARS } from '../project/brief.mjs';

export const summary = 'Print the session briefing: this worktree\'s item, active items, what waits on the owner, the current focus, and setup warnings.';

export const help = `Usage:
  toolkit brief [--host claude|codex]

The same text the session-start hook adds (about ${BRIEF_MAX_CHARS} characters at
most). --host codex adds the always-on rules list and the "How to write
replies" section, because Codex has no output styles. Run it when a session
has no "Project briefing" in its context.`;

export async function run(argv, ctx) {
  parseArgs(argv, { string: ['host'], boolean: ['json'] });
  const project = requireProject(ctx.cwd);
  const host = ctx.host === 'codex' ? 'codex' : 'claude';
  const res = await buildBriefing(project, { host, env: ctx.env, pluginRoot: ctx.pluginRoot, cwd: ctx.cwd, sync: 'quick', fetch: ctx.fetch, liveNotion: true });
  out(ctx, res.text, {
    ok: true,
    host,
    text: res.text,
    chars: res.text.length,
    work: res.work,
    memory: { ok: res.memory.ok, backend: res.memory.backend, source: res.memory.source, problem: res.memory.problem },
    findings: res.findings,
  });
  return EXIT.OK;
}
