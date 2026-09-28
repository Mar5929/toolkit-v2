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
// - a git commit, merge, tag, or note, a gh pr create, edit, comment, review,
//   or merge, a gh issue create, edit, or comment, a gh release create or
//   edit, or a gh api call on a pull request, issue, or release path, whose
//   text gives an AI credit (a Co-Authored-By line naming an AI, or a
//   "Generated with" line): no AI credit on anything committed, pushed, or
//   published (sample run claude-a; final review M1);
// - a toolkit command with a double-quoted argument holding a backtick, or an
//   unquoted here-document (<<EOF) holding a backtick or $(...), which the
//   shell would run as a command inside the text (sample run a). Only the
//   toolkit command's own words are checked. $(...) in a double-quoted
//   toolkit argument gets a note, not a refusal: it can be meant;
// - in Codex only, a note (additionalContext, never a refusal) when a toolkit
//   command is joined to other commands or run from a script, which runs it
//   inside the Codex sandbox instead of through the project's command rule,
//   and when a toolkit command writes an apostrophe as '\'' or leaves a quote
//   unmatched: Codex drops the backslash, and the escaped form runs inside
//   the sandbox (final review I7). The note says to write ’ (U+2019).
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
import { checkGit, toolkitCommands, allCommands, stripPrefix, checkAiCredit, backtickInDoubleQuotes, backtickInUnquotedHeredoc, substitutionInDoubleQuotes, codexApostropheProblem } from './shell.mjs';
import { editedPaths, generatedFile, mightMatter, GENERATED } from './paths.mjs';

const RECORD_TEXT = /WORK-ITEM\.md|DESIGN\.md|DASHBOARD\.md|\.toolkit-state\.json|MEMORY\.md|INDEX\.md/;

function recordWriteReason(hit) {
  if (hit.kind === 'generated') return `${hit.rel} is a generated file, so it is not written by hand or from the shell. ${GENERATED[hit.rel]}`;
  return `${hit.rel} is a work item record, and ${hit.how} would change it past the toolkit's checks and its record of what it wrote. Use toolkit work edit <id> --section '<heading>' --set-file <file> for text, and toolkit work set, approve, design, move, finish, or cancel for the header fields. Nothing was changed.`;
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
    return 'This shell command joins a toolkit command to other commands (&&, ;, a pipe, a heredoc, or cd). In Codex that runs the toolkit command inside the sandbox, which blocks Notion, Hindsight, and the main checkout\'s .work-items/ and .memory/ from a worktree, so it may fail or report the wrong cause. Run each toolkit command alone, as its own command; pass section text with --text \'<text>\' in single quotes, instead of a file written in the same command. In Codex write an apostrophe inside that text as ’ (U+2019), or reword it; never \'\\\'\'.';
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

const CREDIT_WORDS = {
  commit: ['commit message', 'Nothing was committed'],
  tag: ['tag message', 'No tag was made'],
  note: ['Git note', 'No note was written'],
  'pull request': ['pull request text', 'No pull request was created or changed'],
  issue: ['issue text', 'No issue was created or changed'],
  release: ['release text', 'No release was created or changed'],
};

/** Why a commit, tag, note, pull request, issue, or release with an AI credit line is refused. */
export function aiCreditReason(hit) {
  const [noun, verb] = CREDIT_WORDS[hit.what] || CREDIT_WORDS.commit;
  return `This ${noun} gives an AI credit: "${hit.line.slice(0, 160)}". Nothing committed, pushed, or published from this project carries an AI credit: no Co-Authored-By line naming an AI and no "Generated with" line. Remove that line and run the command again. ${verb}.`;
}

/** Codex notes for a toolkit command whose apostrophe will not work (final review I7). */
export const APOSTROPHE_NOTES = Object.freeze({
  escaped: 'This toolkit command writes an apostrophe as \'\\\'\'. In Codex that form does not work: the project\'s toolkit rule does not match the command, so it runs inside the sandbox, where Notion, the local Hindsight server, and the main checkout\'s .work-items/ and .memory/ are blocked; and the tool call can drop the backslash, which leaves an unmatched quote. Write the apostrophe as ’ (U+2019) inside the single quotes, or reword the text, and run the command again.',
  unmatched: 'This toolkit command has a quote that is never closed, so the shell stops with "unmatched \'". In Codex the escape \'\\\'\' loses its backslash on the way to the shell. Write an apostrophe inside single-quoted text as ’ (U+2019), or reword the text, and run the command again.',
});

export const BACKTICK_REASON = 'This toolkit command has text in double quotes that holds a backtick. Inside double quotes the shell runs `...` as a command and puts its output in the text, so the saved text would lose those words. Put the text in single quotes instead (--text \'...\'), or pass it on standard input. Nothing was run.';
export const SUBSTITUTION_NOTE = 'This toolkit command has $(...) inside double quotes. The shell runs it first and puts its output in the text, so toolkit saves that output, not the words $(...). If that is what you meant, nothing needs to change. If you meant the words themselves, put the text in single quotes instead.';
export const HEREDOC_REASON = 'This toolkit command reads a here-document whose end word is not quoted (<<EOF), and its text holds a backtick or $(...). The shell runs those as commands inside the text, so the saved text would lose those words. Quote the end word (<<\'EOF\') so the text is kept as written. Nothing was run.';

const CREDIT_TEXT = /co-authored-by|generated\s+(?:with|by|using)|(?:^|\s)(?:-F|--file|--body-file|--notes-file|--input)(?:\s|=|$)|=@/i;

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

/**
 * The PreToolUse hook. In Codex a refusal's reason is shown as
 * "Command blocked by PreToolUse hook: <reason>. Command: ...", so a reason
 * that ends with a period gets two (final confirmation round 1, Notion run:
 * "then run toolkit index knowledge.."). The last period is left off there.
 */
export async function preTool(input, io) {
  const out = await decide(input, io);
  const hso = out && out.hookSpecificOutput;
  if (io && io.host === 'codex' && hso && hso.permissionDecision === 'deny' && typeof hso.permissionDecisionReason === 'string') {
    hso.permissionDecisionReason = hso.permissionDecisionReason.replace(/\.\s*$/, '');
  }
  return out;
}

async function decide(input, io) {
  const cwd = input.cwd || io.cwd;
  const tool = input.tool_name;
  const ti = input.tool_input || {};
  if (tool === 'Bash') {
    const cmd = typeof ti.command === 'string' ? ti.command : '';
    const gitMatters = /\bgit\b/.test(cmd) && Boolean(checkGit(cmd, { mainCheckout: true, guardClean: true }));
    const recordMatters = RECORD_TEXT.test(cmd);
    const chainNote = io.host === 'codex' ? chainedToolkitNote(cmd) : null;
    const apostrophe = io.host === 'codex' && cmd.includes("'") && TOOLKIT_TEXT.test(cmd) ? codexApostropheProblem(cmd) : null;
    const credit = /\b(?:git|gh)\b/.test(cmd) && CREDIT_TEXT.test(cmd) ? checkAiCredit(cmd, { readFile: fileReader(cwd) }) : null;
    const backtick = cmd.includes('`') && TOOLKIT_TEXT.test(cmd) && backtickInDoubleQuotes(cmd);
    const heredoc = !backtick && cmd.includes('<<') && TOOLKIT_TEXT.test(cmd) && backtickInUnquotedHeredoc(cmd);
    const substitution = !backtick && !heredoc && cmd.includes('$(') && TOOLKIT_TEXT.test(cmd) && substitutionInDoubleQuotes(cmd);
    if (!gitMatters && !recordMatters && !chainNote && !apostrophe && !credit && !backtick && !heredoc && !substitution) return null;
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
    const notes = [apostrophe ? APOSTROPHE_NOTES[apostrophe] : null, chainNote, substitution ? SUBSTITUTION_NOTE : null].filter(Boolean);
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
    return denyOutput(`${fm.rel} would be a new work item record or design made by hand. Create an item with toolkit work new --title '<title>' (it copies the template and gives the id) and a design with toolkit work design <id> --create. Nothing was changed.`);
  }
  if (fm) {
    return denyOutput(`This edit changes the header of ${fm.rel} (${fm.keys.join(', ')}). The header changes only through toolkit work set, approve, design, move, finish, and cancel, which check the approval gates and record the change. Edit only the body text with this tool. Nothing was changed.`);
  }
  return null;
}
