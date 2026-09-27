// PreToolUse (ARCHITECTURE section 6). Refuses, with the command to use:
// - hand edits of generated files: .work-items/DASHBOARD.md,
//   .work-items/.toolkit-state.json, .memory/MEMORY.md,
//   ai-external-knowledge/INDEX.md;
// - git clean with -x or -X in the main checkout of a project that keeps
//   Git-ignored data (critique I17);
// - git add -A / --all / ., git commit -a / --no-verify, and force pushes (the
//   model project's settings deny list, now in both hosts, critique P11).
// - shell writes of a work item record or a generated file, and file edits
//   that change a record's frontmatter or create a record (records.mjs);
// - in Codex only, a note (additionalContext, never a refusal) when a toolkit
//   command is joined to other commands or run from a script, which runs it
//   inside the Codex sandbox instead of through the project's command rule.
// Only "deny" or a note is ever returned: Codex fails a PreToolUse hook that asks.
// The Salesforce org guards run as the project's own PreToolUse hooks
// (.claude/settings.json and .codex/hooks.json, from the Salesforce scaffold).
//
// The hook stays fast: a command or path that cannot match any rule returns
// before Git is asked where the project is.

import { denyOutput, contextOutput } from './output.mjs';
import { findProject, trackerType, memoryType } from './common.mjs';
import { checkGit, toolkitCommands, allCommands, stripPrefix } from './shell.mjs';
import { editedPaths, generatedFile, mightMatter, GENERATED } from './paths.mjs';

const RECORD_TEXT = /WORK-ITEM\.md|DESIGN\.md|DASHBOARD\.md|\.toolkit-state\.json|MEMORY\.md|INDEX\.md/;

function recordWriteReason(hit) {
  if (hit.kind === 'generated') return `${hit.rel} is a generated file, so it is not written by hand or from the shell. ${GENERATED[hit.rel]}`;
  return `${hit.rel} is a work item record, and ${hit.how} would change it past the toolkit's checks and its record of what it wrote. Use toolkit work edit <id> --section "<heading>" --set-file <file> for text, and toolkit work set, approve, design, move, finish, or cancel for the header fields. Nothing was changed.`;
}

const TOOLKIT_TEXT = /\btoolkit\b/;
const SCRIPT_RUNNERS = new Set(['python', 'node', 'ruby', 'perl', 'osascript', 'deno', 'bun', 'xargs']);
const TOOLKIT_IN_SCRIPT = /['"]toolkit['"]|\btoolkit\s+(?:work|memory|decision|brief|doctor|sync|notion|hindsight|config|init)\b/;

/**
 * Why a Codex shell command that holds a toolkit command will not run the way
 * the project's command rule expects, or null. The rule (.codex/rules/
 * toolkit.rules) runs a toolkit command outside the sandbox only when it is
 * the whole command. Joined to anything else, or run from a script, it runs
 * inside the sandbox (sample runs a to d, round 2).
 */
export function chainedToolkitNote(cmd) {
  if (!TOOLKIT_TEXT.test(cmd)) return null;
  const found = toolkitCommands(cmd);
  if (found.length) {
    if (allCommands(cmd).length <= 1 && !/<<-?\s*['"]?[A-Za-z_]/.test(cmd)) return null;
    return 'This shell command joins a toolkit command to other commands (&&, ;, a pipe, a heredoc, or cd). In Codex that runs the toolkit command inside the sandbox, which blocks Notion, Hindsight, and the main checkout\'s .work-items/ and .memory/ from a worktree, so it may fail or report the wrong cause. Run each toolkit command alone, as its own command; pass section text with --text instead of a file written in the same command.';
  }
  // A script runner (python, node, ...) whose text runs toolkit. A search
  // such as grep "toolkit work" is not one.
  const runsScript = allCommands(cmd).some((words) => {
    const w = stripPrefix(words);
    return w.length && SCRIPT_RUNNERS.has(String(w[0]).split('/').pop().replace(/[0-9.]+$/, ''));
  });
  // A shell loop or condition (for, while, until, if) that runs toolkit.
  const loop = /(^|[;&|\n(]\s*)(for|while|until|if)\s/.test(cmd);
  if ((runsScript || loop) && TOOLKIT_IN_SCRIPT.test(cmd)) {
    return 'This shell command runs a toolkit command from inside a script, a shell loop, or a string. In Codex that runs it inside the sandbox, which blocks Notion, Hindsight, and the main checkout\'s .work-items/ and .memory/ from a worktree. Run each toolkit command alone, as its own command.';
  }
  return null;
}

export async function preTool(input, io) {
  const cwd = input.cwd || io.cwd;
  const tool = input.tool_name;
  const ti = input.tool_input || {};
  if (tool === 'Bash') {
    const cmd = typeof ti.command === 'string' ? ti.command : '';
    const gitMatters = /\bgit\b/.test(cmd) && Boolean(checkGit(cmd, { mainCheckout: true, guardClean: true }));
    const recordMatters = RECORD_TEXT.test(cmd);
    const chainNote = io.host === 'codex' ? chainedToolkitNote(cmd) : null;
    if (!gitMatters && !recordMatters && !chainNote) return null;
    const project = findProject(cwd);
    if (!project) return null;
    if (gitMatters) {
      const mainCheckout = project.root === project.mainRoot;
      const guardClean = trackerType(project) === 'local' || memoryType(project) === 'builtin';
      const verdict = checkGit(cmd, { mainCheckout, guardClean });
      if (verdict) return denyOutput(verdict.reason);
    }
    if (recordMatters) {
      const { shellRecordWrite } = await import('./records.mjs');
      const hit = shellRecordWrite(cmd, cwd, project);
      if (hit) return denyOutput(recordWriteReason(hit));
    }
    // A note, not a refusal: a chained read of the local tracker still works.
    if (chainNote) return contextOutput('PreToolUse', chainNote);
    return null;
  }
  const files = editedPaths(input, cwd);
  if (!files.length || !files.some((f) => mightMatter(f.path))) return null;
  const project = findProject(cwd);
  if (!project) return null;
  for (const f of files) {
    const rel = generatedFile(f.path, project);
    if (rel) return denyOutput(`${rel} is a generated file, so it is not edited by hand. ${GENERATED[rel]}`);
  }
  const { recordFrontmatterEdit } = await import('./records.mjs');
  const fm = recordFrontmatterEdit(input, cwd, project);
  if (fm && fm.created) {
    return denyOutput(`${fm.rel} would be a new work item record or design made by hand. Create an item with toolkit work new --title "<title>" (it copies the template and gives the id) and a design with toolkit work design <id> --create. Nothing was changed.`);
  }
  if (fm) {
    return denyOutput(`This edit changes the header of ${fm.rel} (${fm.keys.join(', ')}). The header changes only through toolkit work set, approve, design, move, finish, and cancel, which check the approval gates and record the change. Edit only the body text with this tool. Nothing was changed.`);
  }
  return null;
}
