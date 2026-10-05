#!/usr/bin/env node
// After-commit reminder (PostToolUse on Bash) for Codex and Claude Code. It checks the command text
// itself: Codex has no "if" filter, and Claude Code's "Bash(git *)" lets through "$VAR git ...".
import { readFileSync } from 'node:fs';

// "git commit", also with options before "commit", such as "git -C <folder> commit".
const GIT_COMMIT = /\bgit(?:\s+(?:-[cC]\s+[^\s-]\S*|-[\w-]+(?:=\S+)?))*\s+commit(?:\s|$)/;
// The hook does not see whether the commit succeeded: Codex also runs it after a failed command.
const additionalContext = 'A git commit command just ran. If the commit succeeded, update the work'
  + " item's Recent History and status with running-work-item-lifecycle, and the item's line in"
  + " the project's Current State when that line changed.";
try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const command = [input.tool_input?.command ?? ''].flat().join(' ');
  const output = { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } };
  // A helper agent's commit gets no reminder (Claude Code adds agent_id to its tool calls).
  if (!input.agent_id && GIT_COMMIT.test(command)) console.log(JSON.stringify(output));
} catch {
  // A reminder that cannot run prints nothing and never blocks.
}
