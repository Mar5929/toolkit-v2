---
name: solution-design
description: 'Writes design options, with screens and flows, for a work item whose requirements are approved, recommends one, and records the owner''s choice in the item and design, so the build follows his choice. Use when approved requirements need a design and no question on them is open, such as "design this", "how should we build it", or "give me options". Not for what the result must do; use work-refine.'
---

# Solution design

Input: one work item whose requirements are approved, or not yet approved when the owner asked for design options first (step 1). Output: one design in the item's design home, with options, a recommendation, and the owner's choice recorded as a Questions and Answers row that the design names by its Q-ID. The design home is where the tracker keeps the item's one design: `DESIGN.md` beside a local item's `<ID>.md`, the item's "Solution Design" child page in Notion, or its `## Solution design` comment on GitHub. The design says how to build; it never adds or changes a requirement.

## Steps

1. **Read the item** with the work track skill: Agreed goal, every `R-xx`, the Acceptance list, Questions and Answers, Notes with Sources, every routing field including `design`, and the design itself when one exists. A design in progress: resume from the item's Current state and the design's Notes, "Open design questions".
   - A single Salesforce platform question that needs no options ("Flow or Apex?"): open `sf-architect-solutioning` and stop.
   - Requirements not approved yet: a missing or changed requirement goes to `work-refine`. Go on only when the owner asked for options first. Otherwise stop, and tell the owner his requirements approval comes first; `work-refine` asks for it.
2. **Search memory first** with the memory find skill: project-wide decisions, constraints, earlier designs of the area, and lessons. Also read `.claude/rules/owner-preferences.md`, the area's `requirements/` and `system-guide/` files, and the existing build. List every source you use, to cite it.
3. **Check the requirements are ready**: nothing missing, each one explicit from start to finish, no likely misreading. Gaps go back to `work-refine`. Requirements not approved and options asked for first: design anyway, keep the design `proposed`, and say the requirements approval is still needed.
4. **Start the design** with the work track skill: stage `04-solution-design`, status In Progress, the design home created from its design template (the same headings as `assets/DESIGN.md`), and `design: proposed`. A `build` or `data-load` item without approved requirements keeps its stage and its status. Fill the header lines and the opening sections. Local front matter: `work_item` (the ID), `status` (`proposed`, `approved`, or `superseded`, the same as the item's `design` field), and `approved` (`"no"` or `"YYYY-MM-DD by <name>"`). Design status is Draft when created, In review when saved as proposed, then Approved or Superseded.
5. **Settle the way of working**: at most one question, only when its answer changes the design. Default: two options that differ in approach when the requirements leave a real choice, built-in mechanisms first.
6. **Research**: one researcher per research question (`references/researcher.md`); start together the ones whose questions do not depend on each other's answers. In a Salesforce project, open `sf-architect-solutioning` as the specialist for platform facts.
7. **Design and critique**: one architect per option (`references/design-architect.md`), one critic per draft (`references/design-critic.md`), and fix rounds until the critic returns "Clean" or the owner has decided every finding that remains. A finding still disputed after two rounds goes to him as one question. A requirement no design can meet goes back to `work-refine`, never in as a design compromise.
8. **Save as proposed**: merge the drafts into the design, with "Selected design" saying "Pending owner decision.". Add the choice question as a Questions and Answers row with your recommendation, set `waiting_on: owner`, rewrite the item's Current state (Next action in the waiting form with that Q-ID), add a Recent History row, and read it all back.
9. **Present and ask**: each option in one sentence, your recommendation and its reason, what he will see when it is done, the main risks, and the build order. Cite each recalled source where you use it. Put a short Sources list after the rest of the reply, and the question on the last line, after that list.
10. **Record his choice at once**: his words and the date in the row first (Decision? `yes`, Answered). Then compare what he said with every `R-xx` and the Acceptance list, and do the first case below that fits:
    - It removes, narrows, or adds to what an approved requirement asks for ("B, but keep the finance people out of it" when R-02 gives them access). It is a change to an approved requirement, not a design change. Open `work-refine` for it. Until he approves the change, keep the design `proposed`, make no build tasks, and revise nothing. After his yes, add a line to the design's Notes, "Design changes during the interview", naming the `R-xx` and the Q-ID, revise only what changed, run the critic on it, save as proposed, and ask again with a new row.
    - The Requirements Overall status is Refining (the requirements are not approved yet, or a change to one waits for his approval). Save his pick in the row only, keep the design proposed, set no `design: approved`, and say that his requirements approval is still needed.
    - Otherwise, approve the design: fill "Recommendation and owner decision" (Owner decision: option, who, date, Q-ID; Reason for decision: his reason in his words, or "None given.", never invented). Fill "Selected design" and "Build and verification plan", with one acceptance check per requirement, because `work-check` checks against them, and remove every leftover template prompt. Set Design status Approved, Design approval `YYYY-MM-DD by <name>`, and `design: approved`. The Build order becomes Tasks under the item's existing Roadmap phases, or becomes the phases when the item has none; never renumber, replace, or drop an existing phase. Add a Recent History row naming the Q-ID, set `waiting_on: agent`, and rewrite the Current state with Next action in the working form, naming the first task (a build step names no skill; `work-delegate` when he has said "you drive").
11. **Offer memory for a project-wide choice** as the keep-work-item-current rule says: "This looks project-wide. Save it to memory too?" as the reply's one question, with its own row. When step 10 sent the choice to `work-refine`, ask it after he approves the change. His yes: the memory save skill, linked to the item with the Q-ID.
12. **Stop**: the build runs next, from the Roadmap (`work-delegate` when he says "you drive"). With no question open, end the reply with the exact words that continue ("Say 'keep going' and I'll start the build.").

A change he asks for after approval, or a build that shows the design does not work: say what changes in one line, set the design back to `proposed` (Design status In review), record the reason in the design's Notes, run a fix round for the affected parts, and ask again with a new row. When he answers, mark the earlier choice row "Superseded by Q-xx". A new approach that replaces the approved one goes in the same design as a new option, and the replaced option is marked "Superseded by Option C" under its heading.

## Gotchas

- Never fill a requirement gap in the design, and never use a change he asks for that differs from an approved requirement before he approves it. Both go to `work-refine`.
- One design per item, in its design home. Never a second design file or page, a separate design folder, or a draft file in `work-items/`.
- Helpers return their drafts in their replies. Write no temporary files.
- Every design gets at least one critic, even a small one. Owner-led delivery or "no agent team" decides who builds, not whether the critic runs. Only a host that cannot start a helper, or an owner who said no to helper agents at all, skips it; then say in the reply and the design's Notes that no independent critique ran.
- `sf-architect-solutioning` is a skill the main agent runs, not a helper. Here it returns findings to this design and starts no second interview.
- A sub-item built from its parent's approved design needs no design of its own. Say so, and stop.

## References

| File | Open it when |
| --- | --- |
| [references/researcher.md](references/researcher.md) | Step 6: the brief and job block for each researcher. |
| [references/design-architect.md](references/design-architect.md) | Step 7: the brief and job block for each architect, first draft or fix round. |
| [references/design-critic.md](references/design-critic.md) | Step 7: the brief and job block for each critic. |
| [assets/DESIGN.md](assets/DESIGN.md) | Step 4, and before every save: the model's design template, with every heading to keep. |
| [examples/design-walkthrough.md](examples/design-walkthrough.md) | To see the reply that presents the options and ends on the question. |
