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
// - a git commit, a gh pr create or edit, or a gh api call on a pull request
//   path, whose message gives an AI credit (a Co-Authored-By line naming an
//   AI, or a "Generated with" line): no AI credit on anything committed or
//   pushed (sample run claude-a);
// - a toolkit command with a double-quoted argument holding a backtick, or an
//   unquoted here-document (<<EOF) holding a backtick or $(...), which the
//   shell would run as a command inside the text (sample run a). Only the
//   toolkit command's own words are checked. $(...) in a double-quoted
//   toolkit argument gets a note, not a refusal: it can be meant;
// - in Codex only, a note (additionalContext, never a refusal) when a toolkit
//   command is joined to other commands or run from a script, which runs it
//   inside the Codex sandbox instead of through the project's command rule.
// Only "deny" or a note is ever returned: Codex fails a PreToolUse hook that asks.
// The Salesforce org guards run as the project's own PreToolUse hooks
// (.claude/settings.json and .codex/hooks.json, from the Salesforce scaffold).
//
// The hook stays fast: a command or path that cannot match any rule returns
// before Git is asked where the project is.

import fs from 'node:fs';
import path from 'node:path';
import { denyOutput, contextOutput } from './output.mjs';
import { findProject, trackerType, memoryType } from './common.mjs';
import { checkGit, toolkitCommands, allCommands, stripPrefix, checkAiCredit, backtickInDoubleQuotes, backtickInUnquotedHeredoc, substitutionInDoubleQuotes } from './shell.mjs';
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
    return 'This shell command joins a toolkit command to other commands (&&, ;, a pipe, a heredoc, or cd). In Codex that runs the toolkit command inside the sandbox, which blocks Notion, Hindsight, and the main checkout\'s .work-items/ and .memory/ from a worktree, so it may fail or report the wrong cause. Run each toolkit command alone, as its own command; pass section text with --text \'<text>\' in single quotes (an apostrophe written \'\\\'\'), instead of a file written in the same command.';
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

/** Why a commit or pull request with an AI credit line is refused. */
export function aiCreditReason(hit) {
  const verb = hit.what === 'commit' ? 'Nothing was committed' : 'No pull request was created or changed';
  return `This ${hit.what === 'commit' ? 'commit message' : 'pull request text'} gives an AI credit: "${hit.line.slice(0, 160)}". Nothing committed or pushed in this project carries an AI credit: no Co-Authored-By line naming an AI and no "Generated with" line. Remove that line and run the command again. ${verb}.`;
}

export const BACKTICK_REASON = 'This toolkit command has text in double quotes that holds a backtick. Inside double quotes the shell runs `...` as a command and puts its output in the text, so the saved text would lose those words. Put the text in single quotes instead (--text \'...\'), or pass it on standard input. Nothing was run.';
export const SUBSTITUTION_NOTE = 'This toolkit command has $(...) inside double quotes. The shell runs it first and puts its output in the text, so toolkit saves that output, not the words $(...). If that is what you meant, nothing needs to change. If you meant the words themselves, put the text in single quotes instead.';
export const HEREDOC_REASON = 'This toolkit command reads a here-document whose end word is not quoted (<<EOF), and its text holds a backtick or $(...). The shell runs those as commands inside the text, so the saved text would lose those words. Quote the end word (<<\'EOF\') so the text is kept as written. Nothing was run.';

const CREDIT_TEXT = /co-authored-by|generated\s+(?:with|by|using)|(?:^|\s)(?:-F|--file|--body-file|--input)(?:\s|=|$)|=@/i;

function fileReader(cwd) {
  return (file) => {
    try {
      const full = path.resolve(cwd, file);
      if (fs.statSync(full).size > 1024 * 1024) return null;
      return fs.readFileSync(full, 'utf8');
    } catch {
      return null;
    }
  };
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
    const credit = /\b(?:git|gh)\b/.test(cmd) && CREDIT_TEXT.test(cmd) ? checkAiCredit(cmd, { readFile: fileReader(cwd) }) : null;
    const backtick = cmd.includes('`') && TOOLKIT_TEXT.test(cmd) && backtickInDoubleQuotes(cmd);
    const heredoc = !backtick && cmd.includes('<<') && TOOLKIT_TEXT.test(cmd) && backtickInUnquotedHeredoc(cmd);
    const substitution = !backtick && !heredoc && cmd.includes('$(') && TOOLKIT_TEXT.test(cmd) && substitutionInDoubleQuotes(cmd);
    if (!gitMatters && !recordMatters && !chainNote && !credit && !backtick && !heredoc && !substitution) return null;
    const project = findProject(cwd);
    if (!project) return null;
    if (credit) return denyOutput(aiCreditReason(credit));
    if (backtick) return denyOutput(BACKTICK_REASON);
    if (heredoc) return denyOutput(HEREDOC_REASON);
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
    // Notes, not refusals: a chained read of the local tracker still works,
    // and $(...) in a toolkit argument can be meant.
    const notes = [chainNote, substitution ? SUBSTITUTION_NOTE : null].filter(Boolean);
    if (notes.length) return contextOutput('PreToolUse', notes.join('\n\n'));
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
