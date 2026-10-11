<!-- Shared text from the Toolkit V2 repository, where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Handoff verifier: helper brief

This file is for the handoff verifier, the helper that `handoff` starts at its step 6. A helper is a separate agent that sees only the instructions it is given. The verifier checks a drafted handoff prompt and changes nothing. Its check is done when it has reported whether the draft states the overarching goal, and whether every fact in the draft matches the repository and what is saved where the work items are kept.

The file has two parts. "For the main agent" says how to start the verifier. "Brief for the helper" is the text that the verifier receives.

## Contents

- For the main agent
- Brief for the helper
  - Your job
  - Read-only means read-only
  - What you receive
  - Job one: is the goal there
  - Job two: check every checkable claim
  - Your report

## For the main agent

Start the verifier from `handoff`, after you draft the prompt and before the owner sees the prompt. Act on every verdict as step 6 of `handoff` says.

Start the verifier as a new helper that does not see this session:

- In Claude Code, use the Agent tool, with `subagent_type` set to `general-purpose` and `model` set to `opus`. Never use a fork, because the verifier must not share this session.
- In Codex, use the `spawn_agent` tool with `fork_turns` set to `none`. Wait for its report with `wait_agent`.
- The message to the helper holds everything under "Brief for the helper", word for word, and then the list of inputs below, filled in. The helper sees nothing else.
- Give the verifier the configured record links and available read access. For records it cannot read, supply freshly read text with source links, dates and relevant properties. Include each work item, wiki destination, pending capture or Hindsight record that the draft relies on; Current state alone does not verify wiki claims.

The list of inputs:

```text
Draft prompt: <the whole draft>
Main checkout: <full path; the first path git worktree list prints>
Tracker: local (work-items/ in the main checkout) | Notion (configured links
  or supplied work item text) | GitHub Issues (<account/repository>)
Memory: local (memory/CURRENT_STATE.md in the main checkout) | Notion
  (configured wiki links or supplied records) | Hindsight (no Current State page)
Sources for claims: <for each claim you can: file, repository, owner (with
  the owner's words when you have them), or worked out>
Record access and supplied text: <configured links and read access; freshly read
  work items, wiki destinations, pending captures or Hindsight records as needed>
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Check the draft and change nothing. The main agent drafted a handoff prompt, which is a prompt that a new session uses to continue the work. For each claim in the draft, say whether the claim matches what is in the repository and what is saved where the work items are kept. Also say which claims no record supports.

You have not seen the session that wrote the draft. So give a claim the verdict Confirmed only when you opened the record that holds the claim.

### Read-only means read-only

- Never create, change, move, or delete a file, a work item, or anything in memory.
- Use only read operations through the available file, Git, tracker and memory tools. Follow the installed Notion access procedure before using Notion tools.
- When you believe that something needs to change, say what and where.
- Never run tests, builds, installs, or any script. When the draft says that a test or a build passed, give that claim the verdict Unchecked, unless you were given the command output.
- When `gh` fails with a network error or a sign-in error, give each claim that needed `gh` the verdict Skipped. List the check, with the error, under "Skipped".

### What you receive

You receive the full draft, the path of the main checkout, a source for each claim where there is one, and the text of anything that you cannot open yourself. The main checkout is the project's main folder.

How you check a claim depends on its source:

- A claim from a file or from the repository: open the file, or check the claim in the repository.
- A claim that the owner made: check it against the owner's words that you were given, and write "checked against supplied text" in the Detail column. When you were given no words of the owner, give the claim the verdict Unchecked.
- A claim that the agent worked out, or a claim with no source given: give it the verdict Unchecked.

Work items are named by ID, never by path. How you open a work item depends on the "Tracker" line of the list of inputs:

- Local: find the file under `work-items/` in the main checkout whose front matter says `id: WI-014` (for example `grep -rlE '^id: *"?WI-014"? *$' <main checkout>/work-items`; the value may be in quotes). The front matter is the block of fields at the top of the file. The design of the work item is `DESIGN.md` in the same folder.
- GitHub: `gh issue view <number> -R <account/repository> --json title,body,labels,state`, and `gh issue view <number> -R <account/repository> --comments` for its design comment. The list of inputs names the repository. Pass `-R` on every `gh` command.
- Notion: read the configured record or check freshly supplied text and properties. State which evidence was used.

The other records are in these places:

- Read `PROJECT.md` for the configured record homes. Local memory uses `memory/CURRENT_STATE.md` in the main checkout; Hindsight has no Current State page. Check current work against the selected tracker and lasting knowledge against the configured memory records or supplied evidence.
- For Notion after verified wiki cutover, use the relevant Current state, Product Wiki, Terminology Glossary, Long-Term Memory and pending Wiki Inbox records. Check sources, dates, approval, implementation and supersession status separately. A pending capture is not verified filing.
- For other choices or before verified migration, shared decisions and system rules use their confirmed homes, normally `DECISIONS.md` and `system/`. Filed sources remain in `sources/`.

The first line of the prompt is a fixed notice, which says that the prompt is AI-generated and may contain hallucinations. That notice is not a claim. When the draft has no such line, say so under "Also noticed".

### Job one: is the goal there

Check that the draft states three things: the overarching goal, why the goal matters, and where the goal is written down. The overarching goal is what the work is trying to achieve, not the next action. The goal's source may be a work item, an authoritative project or wiki record, or an issue or pull request.

Open the place that the draft names, and confirm that it holds the goal that the draft claims. Then give one verdict: Confirmed, or one of these three:

- Wrong: the place does not exist, or it says something else.
- Unchecked: the draft names no place.
- Missing: the draft gives only the next step, or no goal at all. The main agent must fix a goal that is Missing before the owner sees the prompt. Say so.

### Job two: check every checkable claim

- For every file path and folder path, and every claim about what a file says, check that the path exists and that the file says what the draft claims. When a path is close to a real path, name the real path.
- For every branch, worktree, commit, pull request, issue, and work item ID, check that it is the one named, and that it is in the state the draft says. For a work item, check its State, `waiting_on`, the lines of its Current state, and its first open question.
- For each decision, source, rule, wiki record or capture, check that it exists and that its status matches the claim. Use the configured store's fields; distinguish approval from implementation and capture from completed filing.
- For every number, count, date, and duration, including any that the draft worked out from other values, work it out again.
- When no command output supports a claim that something was run, passed, failed, or was verified, give that claim the verdict Unchecked.
- An earlier handoff prompt is not a source. Check again, as a new claim, anything that was carried over from one.

Then list every sentence that sounds settled, such as "we decided" or "the owner wants", but that no file, record, or rule supports. Do not delete or reword those sentences.

### Your report

Your final message is the only thing the main agent receives. Always end your final message with the report, in this form:

```text
Handoff check

Goal
  Verdict: Confirmed / Wrong / Unchecked / Missing
  <one line: what the goal says, and what the place it is written down holds>

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
- <relevant findings, or "Nothing.">
```
