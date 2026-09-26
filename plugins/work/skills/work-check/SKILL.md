---
name: work-check
description: 'Checks a finished build against every requirement with an independent checker agent, fixes what fails, then shows the owner the result to approve. Use when the owner asks "is it ready", "does it work", "test it", or "check it against what I asked for", or when a build''s last task is done.'
---

# Work check

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Shared rules: `../../references/conventions.md`. How to brief agents: `../../references/helpers.md`. To open another skill, Claude Code uses the Skill tool; Codex reads that skill's `SKILL.md`.

## Steps

1. Read the requirements, the acceptance list, and the tasks, then set the testing stage. When the show output's "Design:" value is not `none`, also read the design's "How to check it" lines (the design command exits 1 for an item with no design).
   `toolkit work show <id>`
   `toolkit work design <id>`
   `toolkit work set <id> --stage 09-testing`
2. Run the project's tests and every acceptance check the item lists. A check that could not run is reported as not run, never as passed.
3. Brief the `acceptance-checker` agent (never the agent that built it): one verdict per requirement (met, partly met, not met) with evidence, plus defects seen in the diff. Give it the branch and commit to check.
4. Failures: set the bug-fixing stage; a `builder` agent (or the main agent) fixes; the checker checks again. Repeat until clean, or until a failure needs an owner decision (an Open Questions row and the item waiting on the owner).
   `toolkit work set <id> --stage 10-bug-fixing`
5. Record the result: what was checked, the evidence, the known gaps.
   `toolkit work history <id> --note "Checked: <what>; evidence: <where>; gaps: <gaps or none>"`
6. Set the approval stage and wait on the owner. Show him what it does now, how to see it (a link, a command, or a screenshot), the evidence, and the gaps. Ask one line: "Do you approve this result?"
   `toolkit work set <id> --stage 11-user-approval --waiting-on owner`
7. Yes: record it (the command adds its own history row), quote his words in one note, and hand the item back to the agent unless another question for him is still open; then open `work-finish`. A requirement change goes to `work-requirements`; a fix becomes a task and continues here.
   `toolkit work approve <id> --result --by <owner>`
   `toolkit work history <id> --note "Owner's words: <quote>"`
   `toolkit work set <id> --waiting-on agent`

## Agents

- `acceptance-checker`: step 3 and every re-check. Paste in the Agreed goal, every `R-xx` with its acceptance check, the Acceptance list, and the design's "How to check it" lines. Name the branch and commit.
- `builder`: fixes in step 4 when a team was recorded or the owner agreed; one builder per independent fix, one writer per path.
- Codex: this plugin's agents do not load there. Read the agent's file in this plugin's `agents/` folder and give its full text, with the brief, to a native Codex worker. With no worker, do the work yourself and say that no independent check ran.

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
