# Cleaning up memory

Use this file when you review or clean up all of memory. The goal is that memory stays small and true.

Work in this order: the project's Current State first, then duplicates, links, stale records, memory records in the wrong place, lessons that should become rules, and the owner's rules. Apply the approval and immediate-maintenance rules under "Plan first, then ask".

## Contents

- A helper reads memory in the background
- Plan first, then ask
- The project's Current State
- Duplicates and merges
- Links to work items
- Links between memory records
- Stale records
- The wrong place, the wrong type, or a memory record changed by hand
- Too many memory records
- Lessons that should become rules or skills
- Writing a project skill
- The owner's rules

## A helper reads memory in the background

A clean-up reads every memory record whole, which takes time. So a helper does the reading and writes the plan, while you keep working with the owner. A helper is a separate agent that you start for one job, and that does not see this session.

- Start the helper using `managing-work-items/references/starting-a-helper.md`. Run the memory review in the background when the host supports it.
- Give the helper this message: "Read `.claude/skills/managing-project-memory/references/tidying.md` and `memory-store.md` in the same folder. You are the helper that the section 'A helper reads memory in the background' of that file describes. Skip that section, and start no helper. Follow the rest to review all of this project's memory. Change nothing. Return two lists: the changes that the file says do not go on the plan, and the plan, written as the file says. Write both for a reader who has not seen this session, as `.claude/rules/document-clarity-standard.md` says."
- When the helper returns, make the changes on its first list yourself, which takes the place of doing "The project's Current State" first. Then show the owner the plan, as "Plan first, then ask" below says. The owner gives the yes to you. The helper never asks the owner.
- When you cannot start a helper, do the whole clean-up yourself.

## Plan first, then ask

- Read every memory record whole. `references/memory-store.md` says what in its layout is not a memory record (an index, a template), and what else to check there.
- Write the plan as one numbered list. Each line holds one change, the memory records it changes, and a reason.
  - A contradiction between two memory records is a question on the list. Never settle a contradiction by date alone.
  - A delete is its own numbered line, and the line names the memory record. In every other case, retire the memory record or mark it as replaced, as `references/memory-process.md`, section "A memory record that is out of date or no longer needed", says.
- Change nothing until the owner says yes. The owner's answer often comes in the next turn. Resume from the approved plan.
- These changes do not go on the plan: removing lines of the project's Current State that are no longer true, removing secrets or information whose storage could compromise system, product, or project security at once, and retiring a memory record or removing a section whose "check or remove by" date has passed and that is no longer true, as "Stale records" below says.

## The project's Current State

Do this part first, before the plan. Remove the lines that are no longer true, as `references/current-state.md`, section "Steps for removing lines that are no longer true", says.

## Duplicates and merges

When two memory records are about the same subject, merge them into the broader one. When neither is broader, merge them into the older one.

1. Move each section of the other memory record into the kept one, above its lessons. Keep each section's source. Move the lessons too. When both memory records hold the same lesson, join the Seen lines of that lesson.
2. Join the two lists of work items, and name no work item twice.
3. Mark the other memory record as replaced by the kept one, and link them in both directions with the store's replacement procedure. Preserve both records' provenance and useful tags. Update their metadata and the kept record's summary.
4. Route links used for current guidance to the kept record, and preserve links that document history.

These rules also apply to merges:

- When two sections in one memory record say the same thing, merge them into one section.
- Never merge an event record into a memory record of the type user, project, or reference.
- When two event records are for one recurring job, merge them into one, and keep every row of both Runs tables.

When a memory record covers distinct subjects that a later session would need separately, move the sections of one sub-topic to a new memory record. Link the two under "Related memories", and correct every link that led to a section you moved.

## Links to work items

- Each work item that a memory record names must exist. Check with `managing-work-items`.
  - When a work item cannot be found, tell the owner.
  - Put this change on the plan: take the work item out of the memory record's work item links, and keep its ID under the memory record's "Authoritative records" with "(not found, <date>)".
- Correct work-item links using `references/record-format.md`, "Links to work items".
- When a memory record is clearly about a work item but is not linked to it, propose the link.

## Links between memory records

Check that the memory record that each link leads to exists.

- When that memory record is missing, change the link so that it leads to the right memory record, or keep the link's words and remove the link.
- When that memory record is replaced, route links used for current guidance to its replacement. Preserve links that document history or supersession.
- When that memory record is retired, add " (retired)" after the link.

## Stale records

A stale record is a memory record, or a section of one, that may no longer be true. Choose review dates from the information’s usefulness, likelihood of changing and available evidence. Verify uncertain or changing information against its source before consequential use.

- When a "check or remove by" date is due, check the record or section. If it is still true, choose its next review date. If it is no longer true, retire the record or remove the section; this change does not go on the plan. Tell the owner.
- For an unchecked claim, follow `references/saving.md`, section "An unchecked claim". A passed review date does not prove the claim false.
- For information that changes, such as a vendor, a process or a person’s role, use the source and last-verified date to decide when another check is needed. Update the last-verified date only after checking.

When verification is unavailable, keep the uncertainty visible and preserve useful context. Ask the owner only when the unresolved issue blocks the work. Required approval for other cleanup changes still follows "Plan first, then ask" above.

## The wrong place, the wrong type, or a memory record changed by hand

- A section may hold work item status, next steps, undelivered requirements, a decision that only one work item needs, or a copy of a requirement or a design. Propose moving its meaning to the work item, and then removing the section.
- A memory record or a section may hold a decision that more than one work item needs, a project term, or how the system works or must work. Propose saving it in the place where it is kept, with `filing-project-records`, and then removing it from memory. Check first whether that place already holds it. `references/memory-criteria.md`, section "First find the place where the fact is kept", names the place for each of these.
- A section may be an instruction, such as "always ...", "never ...", or a preference. Propose moving it to `.claude/rules/owner-preferences.md`, and then removing the section. `references/saving.md`, section "The owner's instructions", says how to write the line.
- Retire a guess, or a fact that the owner rejected.
- When a memory record is of the wrong type, move it to the right type, and correct every link to it. `references/memory-store.md` says how to move it.
- A memory record may no longer follow the layout because the owner made it or changed it by hand. Keep the owner's edit. List these memory records for the owner, and correct one only with the owner's yes.

## Too many memory records

The text that is shown at the start of a session can end with "Cut short to fit the hook limit". When it does, put two kinds of change on the plan, so that useful memory fits in startup context:

- merges of memory records about one subject;
- retirements of event records that no open work, job, or person still needs.

## Lessons that should become rules or skills

Propose promoting a lesson when its evidence supports a reusable rule or procedure. Describe where it has worked, any conflicting evidence, and whether the owner confirmed it. Repetition alone does not prove a lesson.

1. Decide where the lesson goes.
   - An instruction that is followed every time, such as a check before a deploy, a load, or a test, is a rule.
   - A procedure with steps is a project skill.
   - A lesson about the system or the project that more than one work item must follow is a decision. Save it with `filing-project-records`.
2. Put the lesson on the plan with the exact words: the rule bullet and its area, or the skill's name and description.
3. After the owner's yes, write the rule or the skill.
   - A rule is one bullet in `.claude/rules/owner-preferences.md`, in the words that the owner approved. The bullet ends with `(<YYYY-MM-DD of the owner's yes>, <owner name>, from the lesson in <record title>)`.
   - For a skill, follow "Writing a project skill" below.
4. Add "Promoted: <date>, to <where>" to the lesson. The lesson stays as history.

A fact that is really an instruction, such as "always check X before Y", is proposed as a rule in the same way.

## Writing a project skill

- A project skill goes in `.claude/skills/<name>/SKILL.md`. Codex reads `.agents/skills`, which is a link to `.claude/skills`, so one copy serves both Claude Code and Codex.
- Write the skill as the official skill pages of Claude Code and Codex say, and follow `.claude/rules/document-clarity-standard.md` for its words.
- Add one row for the skill to the "Which skill" table in the root `AGENTS.md`.

## The owner's rules

Read `.claude/rules/owner-preferences.md` and the other files in `.claude/rules/`. Put a bullet on the plan, with a reason, in each of these cases:

- the bullet repeats or contradicts another bullet, another rule file, or a line of the root `AGENTS.md`;
- a hook or a setting already enforces the bullet.

Change or remove a bullet only after the owner's yes. A contradiction is a question for the owner. Never remove a bullet only because it is old.
