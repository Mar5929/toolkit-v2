---
name: work-check
description: 'Tests a finished build against its work item''s requirements, fixes what fails, and asks the owner to approve the result. Use when the last build task is done, or the owner asks whether it is ready to ship or works, for example "is it ready", "test it", or "check it against what I asked for".'
---

# Work check

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: the work plugin's `references/conventions.md` and `references/helpers.md` (how to brief agents), two folders above this skill's folder (`../../references/`). To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`. Run each `toolkit` command alone, on its own line: in Codex a command joined by `&&`, `;`, a pipe, or a heredoc, or run from a script, runs inside the sandbox and fails. Give text with `--text`, or a file in a new `mktemp -d` folder (never a fixed `/tmp` name, deleted right after the command). Never change a record with a script.

## Steps

1. Read the requirements, the acceptance list, and the tasks, then set the testing stage. When the show output's "Design:" value is not `none`, also read the design's Acceptance checks (in "Build and verification plan") and the selected option's "How to check it" column (the design command exits 1 for an item with no design). A sub-item whose "Design:" says "none of its own" and names its parent's approved design is checked against that design: read the parent's.
   `toolkit work show <id>`
   `toolkit work design <id>`
   `toolkit work design <parent-id>`
   `toolkit work set <id> --stage 09-testing`
2. Run the project's tests and every acceptance check the item lists. A check with several scenarios or manual steps gets a test plan: a copy of `tests/TEST-PLAN-TEMPLATE.md` named for the item, with the results filled in. A check that could not run is reported as not run, never as passed.
3. Brief the `acceptance-checker` agent (never the agent that built it): one verdict per requirement (met, partly met, not met) with evidence, plus defects seen in the diff. Give it the branch and commit to check.
4. Failures: set the bug-fixing stage; a `builder` agent (or the main agent) fixes; the checker checks again. Repeat until clean, or until a failure needs an owner decision (an Open Questions row and the item waiting on the owner).
   `toolkit work set <id> --stage 10-bug-fixing`
5. Record the result: what was checked, the evidence, the known gaps.
   `toolkit work history <id> --note "Checked: <what>; evidence: <where>; gaps: <gaps or none>"`
6. Set the approval stage and wait on the owner. Show him what it does now, how to see it (a link, a command, or a screenshot), the evidence, and the gaps. Ask one line: "Do you approve this result?"
   `toolkit work set <id> --stage 11-user-approval --waiting-on owner`
7. Yes: record it (the command adds its own history row), quote his words in one note, and hand the item back to the agent unless another question for him is still open; then open `work-finish`. A requirement change goes to `work-requirements`; a fix becomes a task and continues here. Every reply ends with the approval question, or the exact words that continue.
   `toolkit work approve <id> --result --by <owner>`
   `toolkit work history <id> --note "Owner's words: <quote>"`
   `toolkit work set <id> --waiting-on agent`

## Agents

- `acceptance-checker`: step 3 and every re-check. Paste in the Agreed goal, every `R-xx` with its acceptance check, the Acceptance list, the design's Acceptance checks and "How to check it" column, and the test plan when there is one. Name the branch and commit.
- `builder`: fixes in step 4 when a team was recorded or the owner agreed; one builder per independent fix, one writer per path.
- Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. With no worker, do the work yourself and say that no independent check ran.

## Showing the result

- Lead with what the result does now, in the owner's terms: "The export button now creates a CSV file that opens in Excel."
- Then how he can see it himself: the link, the command to run, or a screenshot.
- Then the evidence: tests run and their result lines, the checker's verdicts.
- Then the gaps: anything partly met, not run, or known to be missing. Never hide a gap to get an approval.
- One question: "Do you approve this result?"

## Rules

- The checker is independent: never the agent or session that built the change. When no independent check could run, say so plainly before asking for approval.
- A check that did not run is never reported as passed.
- The approval covers the result shown. It is not an approval to merge, deploy, or publish; `work-finish` handles those.
- "Looks good" to a question other than the approval question is not the approval. Ask the approval question.
- A "no": record his words, turn each named problem into a task or a requirement change, and continue.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Change the stage label and record the result in the issue as `../../references/trackers.md` says.
