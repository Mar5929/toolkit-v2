# Designing

Use this file to take a work item with approved requirements to one design. The job is done when the design holds the options, your recommendation, and the owner's choice, and the design is approved.

- The owner's choice is a Questions and Answers row in the work item, and the design names that row by its Q-ID.
- The design says how to build. It never adds or changes a requirement.
- A work item has one design. `references/work-tracker.md`, section "The templates for a work item and its design", says where it is kept and what it is made from. Read and save the design through that file. The working design stays with its work item. When the owner approves a rule about the system that more than one work item needs, give it to `filing-project-records`, step "update a system document".

Three kinds of helper do part of the work: a researcher looks up a fact, an architect writes one design option, and a critic checks a draft option against every requirement. `references/lifecycle-rules.md`, section "Starting a helper", says how to start one.

## Steps

1. Read the work item: the goal in its Overview, every requirement with its Acceptance Criteria, its Questions and Answers, its Notes with Sources, every field in the block at the top of the work item, including `design`, and the design itself when one exists.
   - When a design is in progress, continue from the work item's Current state and from the design's Notes, "Open design questions".
   - When the work is a single platform question that needs no options, use the official platform skills that the root `AGENTS.md` names, and stop.
   - When the requirements are not approved yet, send a missing or changed requirement to `refining-requirements.md`. Continue with the design only when the owner asked for options first. In that case, keep the work item in Refining Requirements and the design `proposed`, and say that the owner's approval of the requirements is still needed. When the owner did not ask for options first, stop and tell the owner that the approval of the requirements comes first.
2. Read existing decisions and documentation for the affected area. Read the shared decisions, system rules, and project terms for the affected area where the root `AGENTS.md`, section "Where information goes", says they are kept, together with records that are captured but not yet filed there. Read relevant memory as "Project memory" in the root `AGENTS.md` says. Read `.claude/rules/owner-preferences.md` and the existing build. List every source you use, so that you can cite it.
3. Check that the requirements are ready. Nothing is missing, each requirement is explicit from start to finish, and no requirement is likely to be misread. Send each gap back to `refining-requirements.md`.
4. Start the design.
   - Unless step 1 kept the work item in Refining Requirements, set the State to Designing.
   - Set `design: proposed`.
   - Continue an existing design, or prepare it in the tracker's form as described above. Keep its headings. Fill the header lines and opening sections.
5. Settle how the design work will go. Ask questions when their answers change the design. Present meaningfully different options when the requirements leave a real choice, with built-in mechanisms first. A built-in mechanism is one that the platform or the tool already provides.
6. Research. Start one researcher for each research question, with `researcher-brief.md`. Start at the same time the researchers whose questions do not depend on each other's answers. For platform facts, use the official platform skills that the root `AGENTS.md` names.
7. Design and critique. Start one architect for each option, with `design-architect-brief.md`, and one critic for each draft, with `design-critic-brief.md`. Then run fix rounds. In a fix round, the architect corrects its option from the critic's findings, and the critic checks again the findings that remain.
   - Stop the fix rounds when the critic returns "Clean", or when the owner has decided every finding that remains.
   - When a dispute needs an owner decision or further fix rounds are not resolving it, present the unresolved issue, evidence and recommendation to the owner.
   - When no design can meet a requirement, send the requirement back to `refining-requirements.md`. Never put a weaker form of the requirement into the design as a compromise.
8. Save the design as proposed. Merge the drafts into the design. Add the question that asks the owner to choose as a Questions and Answers row, with your recommendation, and set `waiting_on` to the owner. Add a Recent History row.
9. Present the design and ask. Describe each option concisely, your recommendation and its reason, what the owner will see when the work is done, the main risks, and the build order.
   - Cite each recalled source where you use it.
   - Put a short Sources list after the rest of the reply.
   - Put the question on the last line, after the Sources list.
10. Record the owner's choice at once. First write the owner's words and the date in the row, with Decision? `yes` and Status Answered. Then compare what the owner said with every requirement and its Acceptance Criteria, and do the first of these three cases that fits:
    - **The answer removes, narrows, or adds to what an approved requirement asks for.** An example is "B, but keep the finance people out of it" when R-02 gives them access. That answer is a change to a requirement, and not a design change. Handle the change as `refining-requirements.md`, step 7, says.
      - Until the owner approves the change, keep the design `proposed`, make no build tasks, and revise nothing.
      - After the owner's yes, add a line to the design's Notes, "Design changes during the interview", that names the `R-xx` and the Q-ID. Revise only what changed, run the critic on it, save the design as proposed, and ask again with a new row.
    - **The requirements are not approved yet.** This is the case when `requirements_approved` is `no`, or when a row that asks the owner to approve a new or changed requirement is still open. Save the owner's choice in the row only, keep the design `proposed`, and say that the owner's approval of the requirements is still needed.
    - **Otherwise, approve the design.**
      - Fill "Recommendation and owner decision", "Selected design", and "Build and verification plan". Give the plan a check for every line of each requirement's Acceptance Criteria, because the acceptance checker checks against those lines.
      - Remove every template prompt that is left.
      - Set `design: approved`.
      - Put the Build order into the work item's plan. The Build order becomes tasks under existing phases or in the work item's plain task list. For a top-level item, propose phases only when they help plan or track the outcomes. `references/lifecycle-rules.md`, section "Levels", says which level has phases. Keep existing phase and task IDs. Preserve cancelled or superseded phases with their history.
      - Add a Recent History row that names the Q-ID, and move the work item to Building.
11. Apply the test in the root `AGENTS.md`, section "Where information goes", to the owner's choice, as `refining-requirements.md`, step 6, says. When a different work item would need the choice, that step gives the choice to `filing-project-records`. When the choice went to Refining Requirements as a change, do this step after the owner approves the change.
12. The build runs next, from the work item's plan. Continue when the owner already authorized the build and its prerequisites are met. Otherwise, name the next action and ask only for authorization that is still missing.

## A change to an approved design

Use this section when the owner asks for a change after the design was approved, or when the build shows that the design does not work.

1. Say in one line what changes.
2. Move the work item back to Designing, and set `design` back to `proposed`.
3. Record the reason in the design's Notes.
4. Run a fix round for the parts the change affects, and ask the owner again with a new row.
5. When the owner answers, mark the earlier choice row "Superseded by Q-xx".

A new approach that replaces the approved one goes in the same design, as a new option. Mark the replaced option "Superseded by Option C" under its heading, with the letter of the new option.

## Mistakes to avoid

- A work item has one design. Never save a second design, or a draft in another place. Helpers return their drafts in their replies. Write no temporary files.
- Every design gets at least one critic, and a small design does too. The `delivery` value `owner-led`, or the owner's "no agent team", decides who builds. It does not decide whether the critic runs.
  - The critic is skipped in two cases only: Claude Code or Codex cannot start a helper in this session, or the owner said no to helper agents altogether.
  - When the critic is skipped, say in the reply and in the design's Notes that no independent critique ran.
- The main agent uses the official platform skills that the root `AGENTS.md` names. A helper does not. In Designing, those skills return their findings to this design, and they start no second interview.
- A sub-item that is built from its parent's approved design needs no design of its own. Say so, and move the sub-item to Building.
