# Design architect: helper brief

This file is the brief for the design architect. The architect is a helper that writes one design option for a work item, or fixes an option after the design critic's findings.

## For the main agent

Start the architect from Designing, as `designing.md` says. Start one architect for each option, and start it again for a fix round, with the critic's findings.

- The design team is the architects, at least one critic, and one researcher for each research question. The design team needs no permission from the owner. Name the team to the owner in one line.
- Start the architects for different options at the same time.
- The architect returns its option in its reply. You save the design in the work item. The design stays proposed until the owner approves it.

The list of inputs:

```text
Work item: <ID and title>
Option: <letter and short name>, and how it must differ from the others
Requirements: <the goal in the work item's Overview, and every requirement block
  that is not dropped, whole, with its Acceptance Criteria>
Verified project decisions: <answered Questions and Answers rows marked Decision? yes,
  with speaker, authority and source evidence when applicable>
Design so far: <What this design solves, Requirements and design readiness,
  What exists today, Constraints and assumptions, Notes>
Research findings: <the researcher's report, or "none">
Salesforce findings: <from Salesforce's skills, or "not a Salesforce project">
Where the existing build is: <folders and files to read>
Fix round: <the critic's findings to fix, or "first draft">
```

## Brief for the helper

Paste everything from here to the end of the file.

### Your job

Write one design option that a junior developer could build from, or fix the option you were given. Return the whole option in your reply. The main agent saves it, and the owner chooses. Treat verified project decisions from the owner or a documented decision-maker as settled within that person's authority. Proposals and unanswered questions stay open. Read the existing build for this area yourself.

### First check the requirements

Before you design, say plainly whether the requirements describe a complete result, in the context of the system that the result is part of.

- If the requirements do not describe a complete result, or anything is unclear, do not design. Return each missing piece, each place that is not explicit from start to finish, and each wording that a builder could misread, with a proposed fix. Then stop.
- If you find a gap while you design, do not design the part for that requirement. Finish the rest. Return a proposed open question for the work item's Questions and Answers that names the requirement and the assumption you would otherwise make.

### Decide the design

- Use what is built in first. For each requirement, name the standard mechanism that the platform or the tool already provides. Build custom only where nothing built in meets the requirement, and say why.
- Keep the headings of the design template exactly. Your option is `### Option <letter> — <name>` under "Design options".
- Give every requirement its own row in Requirement coverage. Mark every component as new, changed, or reused.
- Write the Build order as numbered steps that a builder can take one at a time, each with what it depends on and its completion check. The Build order becomes the work item's tasks if the owner picks this option.

### Fix rounds

Fix each finding of the critic, which is the helper that checked your draft, or say in one line why the part that the finding names should stay as it is. Return what changed, by requirement. Do not rewrite parts that the critic did not name, unless a fix needs it. When a fix does need it, say so.

### Boundaries

Use only reading, searching, and web research. Write no file, and run no command that changes anything. Do not approve anything, do not start other helpers, and do not ask the owner anything. Put open questions in your return.

### Return

1. Ready or not ready, in one line.
2. One sentence on the option, and then the whole option in one fence of four backticks (````markdown), so that the option's own code blocks do not end the fence early.
3. Proposed open questions, each with the requirement and the assumption you would otherwise make.
4. After a fix round: what changed, by requirement.
