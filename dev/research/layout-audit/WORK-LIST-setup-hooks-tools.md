# Work list for the setup, hooks, and tools step

## From the review of step 1 (dev/reviews/2026-10-05-one-folder-per-choice-review.md)
All 7 should-fix findings and notes 8 to 13 and 15.

## From the starter files step
- `update.md` points at the removed rules-list section of the root file.
- Skills and rules that still say "Project memory" (a root section that is gone): check after the skill branches merge.
- `delivery/AGENTS.md` names `running-work-item-lifecycle` (Deploying) for delivery records; confirm the skill says where they go.

## From the rules step
- `update.md`: "Before you start" ("whether it names Salesforce org aliases" is now true in every project); "Changing a setup choice" step 3 still replaces "blocks"; it must delete `work-item-folders.md` and `ai-external-knowledge.md` in existing projects and convert `PROJECT.md` to the 11 fixed lines.
- `old-toolkit-pieces.md` lines 90-91 name the two deleted rules.
- `not used` readers: `curating-project-memory/SKILL.md` line 24; `hindsight-on-vps.md` lines 122 and 324; local `using-work-tracker/references/folders-and-files.md` line 71.
- Repository `AGENTS.md`: the `work-local/` row and the paragraph "Three model files still hold setup markers" are false.
- `check-skills.mjs` lines 346-352: change the check to "no file holds a marker".
- Root starter `AGENTS.md`: the last "How to write replies" bullet repeats `cite-recalled-knowledge.md`. `memory/AGENTS.md` repeats two lines of the memory rule.
- "Waiting on Mike" in both work item templates, `deploying.md`, and the Notion page text: use "the owner".
- `prompt-reminder.mjs` says "as the memory rule says" and still sends decisions to the item first.
- `rules-best-practices.md` R12: a path-scoped rule loads on Read, Write, or Edit.

## Hooks
- `session-start.mjs`: what the memory builder reports.
- `prompt-reminder.mjs`: `UserPromptSubmit` now also runs on turns the app starts itself.
- A changed Codex hook entry needs the owner's trust again: say so.

## For the owner, not to be changed without his yes
- Two date forms (`MMDDYYYY` in data folders, `YYYY-MM-DD` elsewhere).
- `PROJECT.md` "Operating conventions" overlaps `system/constraints.md`.
- `session-handoff.md` (his wording) restates the handoff skill's steps.
- Whether Hindsight memory and Notion memory become pointer-only.
- `salesforce-org-safety.md` is over 4096 bytes.
- No `engagement/` mapping for `delivery/client-handoffs/`.
- Project skills now load into sessions that work on the toolkit.

## From the filing and memory step
- `session-start.mjs`, exactly: `memory/MEMORY.md` is now the pointer table (What it points to | ID | Link | Created | Last changed), written only by `using-memory-store`. Delete `NEW_INDEX` (lines 13-17); replace the rebuild block (lines 44-65) with: read `MEMORY.md`, print it under "Memory pointers (memory/MEMORY.md):", never write it; drop the `readdirSync` and `writeFileSync` imports. In `hooks.test.mjs` the five rebuild tests (lines 49-110) go and the 10,000-character test needs a long `MEMORY.md`. One hook test fails until this is done.
- Root starter `AGENTS.md` row for `memory/MEMORY.md`, and `memory/AGENTS.md` "Files": "the hook writes it, never edit it" becomes "`using-memory-store` writes it".
- `prompt-reminder.mjs`; the rules `memory-review-and-save.md`, `session-handoff.md`, `cite-recalled-knowledge.md`; the "Memory approval" line in `PROJECT.md`: check each against the new memory skills.
- `hindsight-memory.md` must give the form and limits of Current State.
- `notion-build/setup.md` 121-122 still builds the glossary page; `update.md` 89 and `move-over.md` still name the old memory files.
- `dev/SKILL-INDEX.md` text outside the description rows (sections 2, 4, 8, 9) is stale.
- `dev/research/skill-writing-guide.md`: D4 says 400 characters and a required "so" clause, the repository rule says under 500; it says `skillListingBudgetFraction` 0.02 and today's page says 1%. Correct the guide.
- The lifecycle skill and the work item form: the pointer to a decision is a Questions and Answers row holding the DEC ID and its Status; the closing step passes the rule ID. Check after the lifecycle branch merges.

## For the owner (added)
- Notion memory now writes only pointer pages; concept, decision, lesson, glossary, Facts, Entities, and Topics records are never written. The databases stay.
- The 10 MB size above which the agent asks before committing an original is the builder's number.

## From the lifecycle and tracker step
- The work item form now has: a `**Moved up:**` line in the Overview after Related items; a Notes heading "Lessons not proven yet"; Sources lines in the form `SRC-###: ...`. The closing question is written once, in `running-work-item-lifecycle/references/closing.md`.
- The pointer to a filed decision in a work item: the item's Related items line holds the IDs (for example "DEC-014, SEC-04"), and the Questions and Answers row that raised the decision ends "Filed as DEC-###". `filing-project-records` must write the pointer in exactly that place. Its own text says a Questions and Answers row holding the DEC ID and its Status, "under Affects": make the two agree, with the work item form as the authority.
- `filing-project-records` steps must be named exactly "record a decision", "file a source" (takes pasted text or a file, returns the SRC-###), "update a system document" (add, change, retire, and set a rule's mark to Built with the work item ID). It needs a home for a lesson that moves up.
- `using-memory-store` must add, change, and remove one line per open item in Current State on the lifecycle skill's request; `hindsight-memory.md` must say the same for Hindsight projects.
- `publish-docs/SKILL.md` line 25 says "in Reflecting": the closing question is now at Marking Done.
- GitHub tracker: no label for a `superseded` design; no step sets `superseded` anywhere.
- `update.md` / move-over: move existing originals (item `references/` folders, GitHub source comments, Notion Files) into `sources/`; rebuild the Notion work item template from `work-item-page.md`; old items lack the Moved up line and the lessons heading.
- `dev/SKILL-INDEX.md` section 9 lines about a memory search are stale.

## For the owner (added)
- New fields in the work item form (Moved up, Lessons not proven yet, Sources as SRC IDs) change what a project file means.
- The closing question is asked at Marking Done, after merge and deploy. The owner is asked only when the list holds a decision, a rule change, or a lesson; delivered rules are set to Built without a question.
- Task proof now goes only in Recent History; the "Met <date>" on the Done-when line is removed.
