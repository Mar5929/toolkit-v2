// toolkit hook <event> --host <claude|codex>: called by the hook files, never by hand.

import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { runHook, HOOK_EVENTS } from '../hooks/index.mjs';

export const summary = 'Run one hook event (session-start, user-prompt, pre-tool, post-tool, stop); the plugin hook files call it.';

export const help = `Usage:
  toolkit hook <${HOOK_EVENTS.join('|')}> --host <claude|codex>

Reads the hook's JSON from standard input and prints JSON or nothing. Outside a
Toolkit V2 project it prints nothing. It always exits 0: a problem is written
to <git common dir>/toolkit-v2/hook-errors.log and never stops the session.
Set TOOLKIT_DEBUG=1 to also see errors on standard error.`;

export async function run(argv, ctx) {
  const { _: pos } = parseArgs(argv, { string: ['host'], boolean: ['json'] });
  const event = pos[0];
  if (!event) throw new ToolkitError(EXIT.INVALID, `Name the hook event: toolkit hook <${HOOK_EVENTS.join('|')}> --host <claude|codex>.`);
  return runHook(event, ctx);
}
