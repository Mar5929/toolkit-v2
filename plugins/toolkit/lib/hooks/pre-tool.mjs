// PreToolUse (ARCHITECTURE section 6). Refuses, with the command to use:
// - hand edits of generated files: .work-items/DASHBOARD.md,
//   .work-items/.toolkit-state.json, .memory/MEMORY.md,
//   ai-external-knowledge/INDEX.md;
// - git clean with -x or -X in the main checkout of a project that keeps
//   Git-ignored data (critique I17);
// - git add -A / --all / ., git commit -a / --no-verify, and force pushes (the
//   model project's settings deny list, now in both hosts, critique P11).
// Only "deny" is ever returned: Codex fails a PreToolUse hook that asks.
// The Salesforce org guards run as the project's own PreToolUse hooks
// (.claude/settings.json and .codex/hooks.json, from the Salesforce scaffold).
//
// The hook stays fast: a command or path that cannot match any rule returns
// before Git is asked where the project is.

import { denyOutput } from './output.mjs';
import { findProject, trackerType, memoryType } from './common.mjs';
import { checkGit } from './shell.mjs';
import { editedPaths, generatedFile, mightMatter, GENERATED } from './paths.mjs';

export async function preTool(input, io) {
  const cwd = input.cwd || io.cwd;
  const tool = input.tool_name;
  const ti = input.tool_input || {};
  if (tool === 'Bash') {
    const cmd = typeof ti.command === 'string' ? ti.command : '';
    if (!/\bgit\b/.test(cmd)) return null;
    if (!checkGit(cmd, { mainCheckout: true, guardClean: true })) return null;
    const project = findProject(cwd);
    if (!project) return null;
    const mainCheckout = project.root === project.mainRoot;
    const guardClean = trackerType(project) === 'local' || memoryType(project) === 'builtin';
    const verdict = checkGit(cmd, { mainCheckout, guardClean });
    return verdict ? denyOutput(verdict.reason) : null;
  }
  const files = editedPaths(input, cwd);
  if (!files.length || !files.some((f) => mightMatter(f.path))) return null;
  const project = findProject(cwd);
  if (!project) return null;
  for (const f of files) {
    const rel = generatedFile(f.path, project);
    if (rel) return denyOutput(`${rel} is a generated file, so it is not edited by hand. ${GENERATED[rel]}`);
  }
  return null;
}
