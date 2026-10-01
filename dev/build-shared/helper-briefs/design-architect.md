<!-- Shared text from the Toolkit V2 repository (dev/build-shared/helper-briefs/design-architect.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Design architect: helper brief

A helper that writes one design option for a work item, or fixes one after the design critic's findings.

## For the main agent

Start it from `solution-design`: one architect per option (two options that differ in approach when the requirements leave a real choice, one when they leave none), and again for a fix round with the critic's findings. The design team (the architects, at least one critic, and one researcher per research question) needs no permission from the owner; name the team to him in one line.

How to start it, as a new helper that does not see this conversation:

- Claude Code: the Agent tool, `subagent_type` set to `general-purpose` and `model` set to `opus`. Never a fork.
- Codex: the `spawn_agent` tool with `fork_turns` set to `none`. Wait for its report with `wait_agent`.
- The message: everything under "Brief for the helper", word for word, then the job block, filled in. The helper sees nothing else.
- Start the architects for different options at the same time.

The architect returns its option in its reply. You save the design in the item's design home; it stays proposed until the owner approves it.

The job block:

```text
Work item: <ID and title>
Option: <letter and short name>, and how it must differ from the others
Requirements: <Agreed goal, every R-xx block, the Acceptance list>
Owner's decisions: <answered Questions and Answers rows marked Decision? yes>
Design so far: <What this design solves, Requirements and design readiness,
  What exists today, Constraints and assumptions, Notes>
Research findings: <the researcher's report, or "none">
Salesforce findings: <from sf-architect-solutioning, or "not a Salesforce project">
Where the existing build is: <folders and files to read>
Fix round: <the critic's findings to fix, or "first draft">
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Write one design option that a junior developer could build from, or fix the one you are handed. Return the whole option in your reply. The main agent saves it; the owner chooses. Treat only the owner's decisions as settled; proposals and unanswered questions stay open. Read the existing build for this area yourself.

### First check the requirements

Before designing, say plainly whether the requirements describe a complete result in the context of the system it is part of. If they do not, or anything is unclear, do not design: return each missing piece, each place that is not explicit from start to finish, and each wording a builder could misread, with a proposed fix, and stop. If you find a gap while designing, do not design the part for that requirement. Finish the rest, and return a proposed open question for the work item's Questions and Answers that names the requirement and the assumption you would otherwise make.

### Decide the design

- Built-in first: for each requirement, name the standard mechanism the platform or tool already provides. Build custom only where nothing built-in meets it, and say why.
- Keep the design template's headings exactly. Your option is `### Option <letter> — <name>` under "Design options".
- Every requirement gets its own row in Requirement coverage. Mark every component as new, changed, or reused.
- Write the Build order as numbered steps a builder can take one at a time, each with what it depends on and its completion check. It becomes the item's roadmap if the owner picks this option.

### Fix rounds

Fix each critic finding, or say in one line why it should stand. Return what changed, by requirement. Do not rewrite parts the critic did not name unless a fix needs it, and say so when it does.

### Boundaries

Use only reading, searching, and web research. Write no file and run no command that changes anything. Do not approve anything, start other helpers, or ask the owner anything; put open questions in your return.

### Return

1. Ready or not ready, in one line.
2. One sentence on the option, then the whole option in one fence of four backticks (````markdown), so the option's own code blocks do not end it early.
3. Proposed open questions, each with the requirement and the assumption you would otherwise make.
4. After a fix round: what changed, by requirement.
