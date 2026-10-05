<!-- Shared text from the Toolkit V2 repository (dev/build-shared/helper-briefs/handoff-verifier.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Handoff verifier: helper brief

A helper that checks, without changing anything, that a drafted handoff prompt states the overarching goal and that every fact in it matches the repository and the work tracker.

## For the main agent

Start it from `handoff`, after you draft the prompt and before the owner sees it. Act on every verdict as `handoff` step 6 says.

How to start it, as a new helper that does not see this conversation:

- Claude Code: the Agent tool, `subagent_type` set to `general-purpose` and `model` set to `opus`. Never a fork: the verifier must not share this conversation.
- Codex: the `spawn_agent` tool with `fork_turns` set to `none`. Wait for its report with `wait_agent`.
- The message: everything under "Brief for the helper", word for word, then the job block, filled in. The helper sees nothing else.
- The verifier can open local files and run `gh`. It cannot read Notion or Hindsight: paste the text of each Notion work item, the Notion "Current state" page, and each Hindsight memory that the draft relies on.

The job block:

```text
Draft prompt: <the whole draft>
Main checkout: <full path; the first path git worktree list prints>
Tracker: local (work-items/ in the main checkout) | Notion (item text
  pasted below) | GitHub Issues (<account/repository>)
Current State: memory/CURRENT_STATE.md in the main checkout | Notion
  (page text pasted below)
Sources for claims: <for each claim you can: file, repository, owner (with
  the owner's words when you have them), or worked out>
Supplied text: <Notion items, the Notion Current state page, Hindsight memories>
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Check the draft and change nothing. The main agent drafted a handoff prompt for a fresh session. Say, claim by claim, whether each one matches what is in the repository and the work tracker, and say which claims no record supports. You have not seen the conversation: give a claim the verdict Confirmed only when you opened the record that holds it.

### Read-only means read-only

- Never create, change, move, or delete a file, a work item, or anything in memory. Run only reading commands, each on its own (`git status`, `log`, `diff`, `show`, `worktree list`, `ls`, `cat`, `grep`, `rg`, `gh issue view`, `gh pr view`). If you believe something needs changing, say what and where.
- Never run tests, builds, installs, or any script. If the draft says a test or a build passed, that claim is Unchecked unless you were given the command output.
- If `gh` fails with a network or sign-in error, give each claim that needed `gh` the verdict Skipped, and list the check, with the error, under "Skipped".

### What you receive

The full draft, the main checkout's path, a source for each claim where there is one, and the text of anything you cannot open yourself. A claim from a file or the repository: open it or check it. A claim the owner said: check it against his supplied words and write "checked against supplied text" in the Detail column; with no words, it is Unchecked. A claim the agent worked out, or with no source given, is Unchecked.

Work items are named by ID, never by path. To open one:

- Local: find the file under `work-items/` in the main checkout whose front matter says `id: WI-014` (for example `grep -rlE '^id: *"?WI-014"? *$' <main checkout>/work-items`; the value may be in quotes). Its design is `DESIGN.md` in the same folder.
- GitHub: `gh issue view <number> -R <account/repository> --json title,body,labels,state`, and `gh issue view <number> -R <account/repository> --comments` for its design comment. The job block names the repository. Pass `-R` on every `gh` command.
- Notion: check against the supplied text.

Current State is `memory/CURRENT_STATE.md` in the main checkout, except in a project with Notion memory. The Notion "Current state" page and Hindsight memories: the supplied text only. A decision that more than one work item needs is an entry in `DECISIONS.md`, an approved rule of the system is in `system/`, and a filed original is in `sources/`, all in the repository. The fixed notice on the first line of the prompt (that it is AI-generated and may contain hallucinations) is not a claim; if the draft has no such line, say so under "Also noticed".

### Job one: is the goal there

Does the draft state the overarching goal (what the work is trying to achieve, not the next action), why it matters, and where it is written down (a work item ID, a rule ID in `system/`, a DEC ID in `DECISIONS.md`, an issue or pull request number)? Open the pointer and confirm it holds the goal the draft claims. Verdict: Confirmed; Wrong (the pointer does not exist or says something else); Unchecked (no pointer); or Missing (only the next step, or no goal at all). Missing must be fixed before the owner sees the prompt; say so.

### Job two: check every checkable claim

- Every file and folder path, and every claim about what a file says: does it exist, and does it say that? If a path is close to a real one, name the real one.
- Every branch, worktree, commit, pull request, issue, and work item ID: is it the one named, in the state the draft says (for a work item: its State, `waiting_on`, the lines of its Current state, and its first open question)?
- Every decision (DEC), source (SRC), and rule ID: does it exist, with the Status or the mark the draft says?
- Every number, count, date, and duration, including any the draft worked out from others: work it out again.
- Every claim that something was run, passed, failed, or was verified: with no command output behind it, Unchecked.
- Anything carried over from an earlier handoff prompt is not a source: check it again as a new claim.

Then list every sentence that sounds settled ("we decided", "the owner wants") but that no file, record, or rule supports. Do not delete or reword them.

### Your report

Your final message is the only thing the main agent receives. Always end it with the report.

```text
Handoff check

Goal
  Verdict: Confirmed / Wrong / Unchecked / Missing
  <one line: what the goal says, and what its pointer led to>

Claims

| # | Claim | Source kind | Verdict | Detail |
| --- | --- | --- | --- | --- |
| 1 | <short quote> | file / repository / owner / worked out / none given | Confirmed | path:line, or WI-014 Overview |
| 2 | <short quote> | file | Wrong | the file says 4 files, not 9 |

Carried over from an earlier handoff
- <claim>: <what checking it again found>
  (or "Nothing in the draft is carried over from an earlier handoff.")

Skipped (a check that could not run; never report it as Confirmed)
- <check that could not run, and why>   (or "Nothing skipped.")

Also noticed
- <at most two lines, or "Nothing.">
```
