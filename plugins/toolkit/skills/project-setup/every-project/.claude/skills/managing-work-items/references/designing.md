# Designing

The goal is one approved design that names the owner's choice by its Q-ID. The design says how to build. It never adds or changes a requirement.

## Before you start

- The requirements must be approved. If the owner wants options first, design anyway, but keep the item in Refining Requirements with `design: proposed`, and say approval is still needed. Otherwise stop.
- A single platform question with no real options: answer it with the project's platform skills and stop.
- A sub-item built from its parent's approved design needs no design of its own. Move it to Building.
- Read the item whole, the shared decisions, rules, and terms for the area, relevant memory, `owner-preferences.md`, and the existing build. Cite your sources. Send any gap or ambiguity back to `refining-requirements.md`.

## Running it

- Set the State to Designing and `design: proposed`. An item has one design, kept where `work-tracker.md` says. Continue an existing design rather than starting over.
- Offer genuinely different options only where the requirements leave a real choice. Put built-in platform mechanisms first.
- Research in parallel: one researcher per independent question, with `researcher-brief.md`.
- One architect per option (`design-architect-brief.md`) and one critic per draft (`design-critic-brief.md`). Run fix rounds until the critic says "Clean" or the owner has decided what's left.
- Every design gets a critic, small ones too. The only exceptions: helpers can't start in this session, or the owner refused helpers. Then say so in the reply and in the design's Notes.
- If no design can meet a requirement, send it back to `refining-requirements.md`. Never design to a weaker version of it.
- Helpers return drafts in their replies. No temporary files and no second design.

## Asking the owner

Save the design as proposed, add the choice as a Q&A row with your recommendation, and set `waiting_on` to the owner. Present each option briefly, your recommendation and why, what the owner will see when it's done, the main risks, and the build order. Put the question last.

## Recording the choice

- **The answer changes what a requirement asks** ("B, but keep finance out of it"): it's a requirement change, handled in `refining-requirements.md`. Keep the design proposed until it's approved, then revise only what changed, re-run the critic, and ask again.
- **The requirements aren't approved yet:** record the choice in its row only, and keep the design proposed.
- **Otherwise, approve it:** fill in the decision, the selected design, and a build and verification plan with a check for every acceptance criterion. Remove the template prompts, set `design: approved`, turn the build order into tasks (keeping existing IDs), add Recent History, and move to Building. If another work item would need the choice, file it with `filing-project-records`.

Go on to the build if the owner already authorized it. Otherwise ask only for what's missing.

## Changing an approved design

Say what changes, move the item back to Designing with `design: proposed`, and note the reason in the design. Re-run the critic on the affected parts, ask again in a new row, and mark the old choice row superseded. A replacement approach is a new option in the same design; mark the old one "Superseded by Option C".
