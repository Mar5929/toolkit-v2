// What each hook prints, per host (ARCHITECTURE section 6; critiques P6-P9).
//
// Both hosts read one JSON object on standard output. The rules that differ:
// - Codex PreToolUse fails the hook (and runs the tool) when the output has
//   permissionDecision "ask", continue, stopReason, or suppressOutput. Only
//   "deny" with a reason, or additionalContext, is ever printed here.
// - Codex Stop needs JSON or nothing; plain text is invalid. Codex turns a
//   Stop `reason` into a new user prompt. Claude Code shows Stop
//   additionalContext as hook feedback, not as an error.
// - Codex PostToolUse `decision: "block"` replaces the tool result, so it is
//   used only for a gate violation, with a reason that is true on its own.
// Printing nothing and exiting 0 is valid for every event in both hosts.

export const EVENTS = Object.freeze({
  'session-start': 'SessionStart',
  'user-prompt': 'UserPromptSubmit',
  'pre-tool': 'PreToolUse',
  'post-tool': 'PostToolUse',
  stop: 'Stop',
});

/** additionalContext for SessionStart, UserPromptSubmit, PreToolUse, or PostToolUse. */
export function contextOutput(eventName, text) {
  if (!text) return null;
  return { hookSpecificOutput: { hookEventName: eventName, additionalContext: text } };
}

/** A PreToolUse refusal. The same shape works in both hosts. */
export function denyOutput(reason) {
  return { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } };
}

/** PostToolUse feedback: context always; `block` only for a gate violation. */
export function postToolOutput({ context, blockReason }) {
  if (!context && !blockReason) return null;
  const out = {};
  if (blockReason) {
    out.decision = 'block';
    out.reason = blockReason;
  }
  if (context) out.hookSpecificOutput = { hookEventName: 'PostToolUse', additionalContext: context };
  return out;
}

/** Stop: keep the turn going once. Claude: hook feedback; Codex: decision block (its reason becomes the next prompt). */
export function stopOutput(host, reason) {
  if (!reason) return null;
  if (host === 'codex') return { decision: 'block', reason };
  return { hookSpecificOutput: { hookEventName: 'Stop', additionalContext: reason } };
}

/** Keys a Codex PreToolUse output must never carry. */
export const CODEX_PRETOOL_FORBIDDEN = Object.freeze(['continue', 'stopReason', 'suppressOutput']);
