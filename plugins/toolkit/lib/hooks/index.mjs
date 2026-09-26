// `toolkit hook <event> --host <claude|codex>`: the entry point both hosts'
// hook files call (hooks/hooks.json for Claude Code, hooks/codex-hooks.json
// for Codex). Each event reads one JSON object from standard input, finds the
// project from its `cwd`, and exits 0. Outside a Toolkit V2 project, and on
// any error, it prints nothing: a hook must never stop a session. Errors go to
// <git common dir>/toolkit-v2/hook-errors.log.

import { EXIT, ToolkitError } from '../core/output.mjs';
import { EVENTS } from './output.mjs';
import { logHookError } from './common.mjs';

export const HOOK_EVENTS = Object.freeze(Object.keys(EVENTS));
export const STDIN_TIMEOUT_MS = 3000;

async function handlerFor(event) {
  switch (event) {
    case 'session-start': return (await import('./session-start.mjs')).sessionStart;
    case 'user-prompt': return (await import('./user-prompt.mjs')).userPrompt;
    case 'pre-tool': return (await import('./pre-tool.mjs')).preTool;
    case 'post-tool': return (await import('./post-tool.mjs')).postTool;
    case 'stop': return (await import('./stop.mjs')).stop;
    default: return null;
  }
}

/** The host a hook runs for: --host, else the environment. Codex also sets CLAUDE_PLUGIN_ROOT, so --host is always passed. */
export function hookHost(ctx, input) {
  if (ctx.host === 'codex' || ctx.host === 'claude') return ctx.host;
  if (input && input.turn_id) return 'codex';
  return 'claude';
}

/**
 * Run one hook event. Returns the exit code (always 0 for a known event).
 * ctx: the command context from lib/cli.mjs, plus optional ctx.fetch for tests.
 */
export async function runHook(event, ctx) {
  const handler = await handlerFor(event);
  if (!handler) {
    throw new ToolkitError(EXIT.INVALID, `Unknown hook event "${event}". Events: ${HOOK_EVENTS.join(', ')}.`);
  }
  let input = null;
  try {
    const text = await ctx.stdin({ timeoutMs: STDIN_TIMEOUT_MS });
    input = text && text.trim() ? JSON.parse(text) : {};
  } catch (err) {
    logHookError(event, err, { cwd: ctx.cwd, env: ctx.env });
    return EXIT.OK;
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) input = {};
  const host = hookHost(ctx, input);
  const cwd = typeof input.cwd === 'string' && input.cwd ? input.cwd : ctx.cwd;
  let output = null;
  try {
    output = await handler(input, { host, env: ctx.env || process.env, cwd, pluginRoot: ctx.pluginRoot, fetch: ctx.fetch });
  } catch (err) {
    logHookError(event, err, { cwd, env: ctx.env });
    return EXIT.OK;
  }
  if (output) {
    const write = ctx.stdout && typeof ctx.stdout.write === 'function' ? (s) => ctx.stdout.write(s) : (s) => process.stdout.write(s);
    write(`${JSON.stringify(output)}\n`);
  }
  return EXIT.OK;
}
