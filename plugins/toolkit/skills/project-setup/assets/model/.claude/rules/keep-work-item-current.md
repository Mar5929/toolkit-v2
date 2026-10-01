# Keep the Active Work Item Accurate

The work tracker is the source of truth for current work. What needs the owner's approval, and how to ask for his decision: `AGENTS.md`, "What the owner decides". Change items with the work track skill that `AGENTS.md` names under "Skills".

## Current state

- Each work item's Overview holds its Current state: five lines (Where it stands, Next action, Waiting on, Blockers, Last updated) that say where the item stands now.
- Read the item's Current state first when you open the item.
- After each step (a task finished, a question asked or answered, a stage or `waiting_on` change, a pause), rewrite those five lines in place.
- Never add a line or a dated entry to Current state; write what happened as a new Recent History row.
- Keep each Current state line to one or two sentences.
- Write Next action in one of these three forms, with one of the five stage skills where the form says `<skill>`: `work-refine`, `solution-design`, `work-delegate`, `work-check`, or `work-finish`.
  - Working: `<Who>: <the exact next step, one sentence>, with <skill>.` For example: "Agent: write two design options for the permission set groups, with solution-design." A build step names no skill: "Agent: build the entry screen for WI-031."
  - Waiting: `Waiting on Mike: Q-07 (<the question in a few words>). After his answer: <step>, with <skill>.` For example: "Waiting on Mike: Q-07 (merge or move the 15 personas). After his answer: finish R-04, with work-refine."
  - Finished or cancelled: `None. Finished.` or, for a cancelled item, `None. Cancelled.`
- Never name a work track, memory, Salesforce, or machine-wide skill in Next action: those differ by setup.
- When the item waits on the owner, use the waiting form with the first open question.
- The item's fields win when they disagree with Next action: when its status, stage, `waiting_on`, approvals, or ticked tasks say something else, rewrite Next action to match them.

## Questions and decisions

- Give every question you ask the owner about the item a row in its Questions and Answers.
- Write his answer, in his words, and the date in that row the moment he gives it.
- Then update the goal or requirement the answer affects.
- Save every decision made while working the item as a Questions and Answers row marked `Decision?` yes, with the owner's words and the date, before moving on. The item's decisions are those rows.
- When a decision looks project-wide (a later work item, or an agent working on something else, will need to follow it), ask "This looks project-wide. Save it to memory too?" and on his yes also save it with the memory save skill.
- When the item finishes, ask that question once more over the item's decisions.
- Save a bulk "yes to all" as one row for each thing it approved, each with the reason the owner was shown ("reason shown: none" when there was none).
- Save the owner's requirements and corrections in the item or its linked document before moving on.

## Approvals and Done

- Record each approval (requirements, design, result) as a Questions and Answers row marked `Decision?` yes, with the owner's words and the date, and set the matching field on the work item.
- Moving an item to a later stage does not revoke its requirements approval.
- Before you ask the owner to approve a result, run the independent checker agent with the `work-check` skill.
- Mark an item Done only after the owner says yes.
- Record that yes, in his words and with the date, as a Questions and Answers row, and name its Q-ID in Recent History.
- He may also mark it Done himself.

## Before you stop

- Before ending unfinished work, rewrite the item's Current state so its Next action names the exact next step.
