---
name: work-check
description: 'Tests a finished build against its work item''s requirements, fixes what fails, and asks the owner to approve the result. Use when the last build task is done, or the owner asks whether it is ready to ship or works, for example "is it ready", "test it", or "check it against what I asked for".'
---

# Work check

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Checks a finished build against every requirement with an independent checker, fixes what fails, and asks the owner to approve the result; it never merges, deploys, or marks Done. Track these steps with the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

## Steps

1. Find the item as `work-on` does: the id he named, this worktree's item, or a title that matches; two matches, ask one question naming both. Read the requirements, the Acceptance list, the Tasks, and the design's Acceptance checks; a sub-item with no design of its own is checked against its parent's (`references/testing.md`, section 1). Then set the testing stage.
   `toolkit work show <id>`
   `toolkit work design <id>`
   `toolkit work set <id> --stage 09-testing`
2. Run the project's tests and every acceptance check the item lists. Several scenarios or manual steps: write a test plan in `tests/` on the item's branch (`references/testing.md`, sections 2 and 3).
3. Brief the `acceptance-checker`, never the agent that built it, naming the branch and the exact commit (`references/testing.md`, section 4). It runs before every result approval, whoever built the change (`references/helpers.md`, section 6).
4. Failures: run the check and fix loop until clean, or until a failure needs an owner decision (`references/testing.md`, section 5).
   `toolkit work set <id> --stage 10-bug-fixing`
5. Record what was checked, the checker's verdict, the evidence, and the gaps.
   `toolkit work history <id> --note 'Checked: <what>; acceptance-checker: <its verdict>; evidence: <where>; gaps: <gaps or none>'`
6. Ask for the result approval with the checklist in `references/approvals.md`, section 4: stage 11, the item waiting on the owner, the result shown as "Showing the result" says below, and one question: "Do you approve this result?"
   `toolkit work set <id> --stage 11-user-approval --waiting-on owner`
7. His yes: save his words first, record the approval, hand the item back to the agent, and open `work-finish`. A requirement change goes to `work-requirements`; a fix becomes a task and continues here.
   `toolkit work history <id> --note 'Owner said: <quote>' --effect 'Result approved; work-finish continues.'`
   `toolkit work approve <id> --result --by <owner>`
   `toolkit work set <id> --waiting-on agent`
8. Update the current focus when the item's next step changed (`references/current-focus.md`). End every reply with the approval question, or the exact words that continue.

## Gotchas

- Run each `toolkit` command alone: never joined by `&&`, `;`, or a pipe, and never from a script (in Codex that runs it inside the sandbox, where it fails). One-line values go in single quotes, never double quotes; an apostrophe inside them is `'\''` in Claude Code and ’ (U+2019) in Codex, or reword the text. Section text goes on standard input (`--set-file -`) in Claude Code, and in `--text '<text>'` or a `mktemp -d` file in Codex (`references/toolkit-commands.md`, "Text in a command").
- The checker is never the agent or session that built the change. When no independent check could run, say so plainly before asking for approval.
- The `acceptance-checker` runs before every result approval (the owner's decision of 2026-09-28). "No agent team", "owner-led", "I'll lead it myself", or a no to the team question decide only who builds; they never remove it. Only when this host has no way to start a worker, check the result yourself and say plainly that no independent check ran, and why. If he asks to skip it, remind him of that decision and ask whether he wants to change it (`references/helpers.md`, section 6).
- The change is only in a worktree until it is merged. When the reply gives him a command to try, name the worktree folder and give the command with its folder, for example `cd <worktree path>` first.
- A check that did not run is reported as not run, never as passed.
- The test plan lives in `tests/` on the item's branch, committed there. Never in `.work-items/`, which Git ignores.
- "Looks good" to any question other than the approval question is not the approval. Ask the approval question.
- Add no Open Questions row for the result approval: stage 11 already lists it as the owner's decision.
- When the approve command fails, show the owner its error. Never work around it by editing the record.
- The result approval covers the result shown, never merge, deployment, or publishing; `work-finish` handles those.
- GitHub Issues or Jira: `toolkit work` exits with code 3. Change the stage label and record the result in the issue (`references/tracker-github.md` or `references/tracker-jira.md`).

## Showing the result

- Lead with what the result does now, in the owner's terms: "The export button now creates a CSV file that opens in Excel."
- Then how he can see it himself: the link, the command to run, or a screenshot.
- Then the evidence: tests run and their result lines, the checker's verdicts.
- Then the gaps: anything partly met, not run, or known to be missing. Never hide a gap to get an approval.
- One question: "Do you approve this result?"

A "no": record his words, turn each named problem into a task or a requirement change, and continue.

## Agents

- `acceptance-checker` (`references/agent-acceptance-checker.md`): step 3 and every re-check.
- `builder` (`references/agent-builder.md`): fixes in step 4 when a team was recorded or the owner agreed; one builder per independent fix, one writer per path. In Codex the main agent first makes each builder's worktree (`references/helpers.md`, section 2, "Codex builders").
- Brief them as `references/helpers.md` says.
- Codex: this plugin's agents do not load there. Give the full text of this skill's `references/agent-<name>.md`, with the brief, to a native Codex worker: the `spawn_agent` tool, started without this conversation (`fork_turns` set to `none`), so a checker never shares the builder's thread. Only when this host cannot start a worker (no `spawn_agent` tool) do the work yourself, and say that no independent check ran. The `acceptance-checker` still runs when the owner chose owner-led delivery or no agent team.

## References

| File | Open it when |
| --- | --- |
| [references/testing.md](references/testing.md) | Steps 1 to 5: what to check against, the test plan, the checker's brief, the fix loop |
| [references/approvals.md](references/approvals.md) | Steps 6 and 7: the result approval checklist; what counts as a yes |
| [references/git-rules.md](references/git-rules.md) | Committing the test plan or a fix, and Git writes in Codex |
| [references/helpers.md](references/helpers.md) | Before starting any agent |
| [references/agent-acceptance-checker.md](references/agent-acceptance-checker.md), [references/agent-builder.md](references/agent-builder.md) | Codex only: the text to give the worker |
| [references/recording-owner-answers.md](references/recording-owner-answers.md) | The owner answers; history notes; `waiting_on`; a failed save |
| [references/work-item-format.md](references/work-item-format.md) | Before any section edit or table row |
| [references/current-focus.md](references/current-focus.md) | Step 8: the item's next step changed |
| [references/toolkit-commands.md](references/toolkit-commands.md) | Before a command that carries text, and on any exit code other than 0 |
| [references/tracker-notion.md](references/tracker-notion.md) | `tracker.type` is `notion`, or a command prints a Notion error |
| [references/tracker-github.md](references/tracker-github.md) | A `toolkit work` command exits 3 in a GitHub Issues project |
| [references/tracker-jira.md](references/tracker-jira.md) | A `toolkit work` command exits 3 in a Jira project |
