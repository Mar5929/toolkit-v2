# Instructions that script the agent: work-tracker-folders

I read the same 21 files again with the owner's question: does an instruction state a step of the owner's process, or does it tell the agent how to think or behave? I re-read the files for this pass and checked each quotation and line number against the file.

Paths start at `plugins/toolkit/skills/project-setup/assets/`. The text `references/` inside a path stands for `.claude/skills/managing-work-items/references/` in that folder.

## Summary

The three folders are mostly process. They say where each part of a work item is kept, the form of each record, the exact commands for each tool, what the owner decides, and what must never happen. I passed those. I found 14 places where the text may script the agent, and I marked all 14 "borderline", because each one also carries a fact or a protection that I could not separate from the scripting without the owner.

| Kind | Meaning | Count |
| --- | --- | --- |
| 1 | Tells the agent how to think or interpret, or maps a phrase to a meaning | 4 |
| 2 | A list or table of small situations where one general rule would cover them | 5 |
| 3 | A count or limit where the agent should judge | 4 |
| 4 | A phrase list that reads as if only those phrases start a process | 0 |
| 5 | Tells the agent what a capable agent does anyway | 1 |
| Total | | 14 |
| Borderline | | 14 of 14 |

Kind 4 has no finding of its own. The area holds three lists of phrases or times. Two pass. The third, the five times to run the check for hand changes, is reported as F1 (kind 2). See "Phrase lists and trigger words".

Five files tie for the most findings, with 2 each, and no file has more:
1. `work-local/references/work-tracker-folders-and-files.md` (F3, F4).
2. `work-local/work-items/work-item-template/WORK-ITEM.md` (F5, F6).
3. `work-local/work-items/work-item-template/DESIGN.md` (F7, F8).
4. `work-notion/references/work-tracker-database-layout.md` (F9, F15).
5. `work-local/references/work-tracker.md` (F1, F2).

## Findings

### `work-local/references/work-tracker.md`

**F1.** `work-local/references/work-tracker.md:28`
- Text: "Run the check at each of these times: at the first lookup of a session; before you move a work item, and before you make a new sub-item; when a work item is not where you read it before; when an ID has two files, or none; when a work item's folder, its `parent:` line, and its parent's list of sub-items disagree."
- Kind 2, borderline.
- Why: it lists five situations in which to run the check, where the goal ("the files may have changed by hand, so look before you rely on them") would cover them all.
- Protects: the owner edits, moves, and copies work items outside the agent's view, and the agent must not act on a stale picture.
- Proposal: replace the list with a general rule that keeps the two fixed points: "Run the check at the first lookup of a session, and again whenever the files may have changed by hand or look wrong: for example before you move a work item or make a sub-item, when a work item is not where you read it before, when an ID has two files or none, or when a folder, a `parent:` line, and a parent's list of sub-items disagree." The cases become examples. The owner decides whether the five cases are the process or only examples.

**F2.** `work-local/references/work-tracker.md:53`
- Text: "When the owner says "WI-31", the work item is `WI-031`."
- Kind 1, borderline.
- Why: it maps the owner's phrase to a meaning, which is the form the owner named as one to avoid.
- Protects: IDs are written with three digits, and a search for `WI-31` finds nothing.
- Proposal: keep the fact and drop the phrase mapping: "A work item's ID always has three digits (`WI-031`). Search with the three-digit form, whatever form the owner uses." This is the form of an ID, which passes.

### `work-local/references/work-tracker-folders-and-files.md`

**F3.** `work-local/references/work-tracker-folders-and-files.md:87`
- Text: "When the folders and the `parent:` line disagree, use the folders. Tell the owner each finding in one line, and then record the finding as this list says:" followed by eight cases (lines 89 to 104), each with its own action.
- Kind 2, borderline.
- Why: it is a list of situations, one per kind of hand change, where the rule "the owner's change is the one to keep; make the fields, the parent's list of sub-items, and Recent History agree with it" covers most of them.
- Protects: the owner's hand changes are never undone, and the three places that name a parent (folders, `parent:`, the parent's list) stay equal.
- Proposal: keep the first rule ("use the folders") and the exact Recent History row texts ("Moved by hand", "Archived by hand", "Changed by hand: <field> <old> to <new>"), which are record forms. Replace the case list with: "Make the work item's fields, its parent's list of sub-items, and the Recent History of every work item that changed agree with the owner's change. Name the change in a Recent History row in the form “Moved by hand”, “Archived by hand”, or “Changed by hand: <field> <old> to <new>”." Keep as separate lines the cases that need more than that: the file name that is not `<ID>.md`, and a work item that becomes top-level (ask which project phase).

**F4.** `work-local/references/work-tracker-folders-and-files.md:114` and `:119`
- Text: "Ask whether to move the folder under the new parent. Recommend yes." and "Ask whether to move it up, or to turn it into tasks. Recommend moving it up."
- Kind 1, borderline.
- Why: it scripts which answer the agent recommends in two situations, where the agent could weigh the situation and recommend.
- Protects: probably the owner's standing preference, or a test where the agent recommended a harmful move. I cannot tell.
- Proposal: keep "Ask the owner" and the list of cases where the owner decides (this passes: it says when the owner decides). Replace each "Recommend ..." with the general rule that already exists at line 112: "Ask about one finding at a time, with your recommendation." Keep the two recommendations only if the owner confirms they are his preference.

### `work-local/work-items/AGENTS.md`

**F13.** `work-local/work-items/AGENTS.md:13`, repeated at `work-local/references/work-tracker-folders-and-files.md:49`
- Text: "`<short-slug>` is two to four lowercase words from the title, joined by hyphens." and "The slug is the part of the folder name after the ID. It is two to four lowercase words from the title, joined by hyphens."
- Kind 3, borderline.
- Why: it fixes the number of words in a folder name, where "a few lowercase words from the title" would do.
- Protects: short folder names that a person can read, and no change to a folder name once made (other files cite it).
- Proposal: keep it as the form of a folder name (it passes as a form). If the owner wants no counts, write "a short slug: lowercase words from the title, joined by hyphens".

### `work-local/work-items/work-item-template/WORK-ITEM.md`

**F5.** `work-local/work-items/work-item-template/WORK-ITEM.md:29`
- Text: "... Rewrite these lines in place after each step (...); never add a line, a date list, or a log to them. History goes to Recent History as a new row. Keep each line to one or two sentences."
- Kind 3, borderline (only the last sentence).
- Why: "one or two sentences" is a count that stands for "short enough to read at a glance".
- Protects: the five lines stay short so that a new session can pick up from them alone.
- Proposal: the first two sentences pass (the form of the record and where history goes). Replace the last with the goal: "Keep each line short enough that a new session or the owner can read all five lines at a glance."

**F6.** `work-local/work-items/work-item-template/WORK-ITEM.md:99`
- Text: "Add one row, newest first, for each of these changes: a state, `waiting_on`, blocker, or next action change for a reason a later reader could not see; an answer, approval, rejection, or decision; the independent checker's report; a plan change; a change the owner made by hand; a finished result."
- Kind 2, borderline.
- Why: it lists the events that earn a row, where the goal ("a later reader can see how the work got here") would cover them.
- Protects: Recent History is complete enough to rebuild what happened; `validate-records.mjs` or a live test may depend on rows for decisions and hand changes.
- Proposal: keep the list but state the goal in front of it, so the list reads as examples: "Recent History lets a later reader see how the work got to where it is. Add a row, newest first, for each change that the other sections do not explain, for example an answer, an approval, a rejection, a decision, the checker's report, a plan change, a change the owner made by hand, or a finished result."

### `work-local/work-items/work-item-template/DESIGN.md`

**F7.** `work-local/work-items/work-item-template/DESIGN.md:45`
- Text: "<Three to five plain-language sentences explaining the approach, why it fits the goal, and what is reused, changed, or new.>"
- Kind 3.
- Why: "three to five sentences" is a count for the length of an explanation.
- Protects: a short, readable approach text.
- Proposal: replace with the goal: "<A short plain-language explanation of the approach: why it fits the goal, and what is reused, changed, or new.>" This text is a prompt, so the owner may treat it as a blank; I report it because the agent reads and follows it.

**F8.** `work-local/work-items/work-item-template/DESIGN.md:29`
- Text: "<For an existing build, describe verified current behavior, relevant files or configuration, and the gap. For a new build, say that nothing exists yet. Distinguish observed facts from assumptions.>"
- Kind 5, borderline (only the last sentence).
- Why: telling the agent to distinguish facts from assumptions is what a capable agent does anyway.
- Protects: the section is a record of verified fact; the Constraints table below already has a column for "confirmed or open".
- Proposal: remove the sentence, or keep it as the form: "Mark each statement as observed or assumed." The second wording states a form of the record rather than a way to think.

### `work-notion/references/work-tracker-database-layout.md`

**F9.** `work-notion/references/work-tracker-database-layout.md:342` and `work-notion/references/work-tracker-searching.md:110`
- Text: "A page that was made with "Empty" in the New menu, or made before the project had a default template, has an empty body (fewer than five blocks)." and "A work item has fewer than five blocks when the owner made it with "Empty" in the New menu, ..."
- Kind 3, borderline.
- Why: "fewer than five blocks" is a threshold that stands in for "the page has no template sections".
- Protects: a count of blocks is how the agent detects a page without template sections, since the page has no other marker; it was probably measured on the template.
- Proposal: keep the count as a tool fact if the template always has more than five blocks, and say so: "A page that has none of the template's sections has fewer than five blocks (the template has more)." Check the claim before use.

**F15.** `work-notion/references/work-tracker-database-layout.md:229`
- Text: the table "Change the plan" with eight rows, including "Reorder phases | Change only Order, on the phases that move.", "Split a phase | Add the new phase, and then move the sub-items and tasks that belong to it.", and "A phase is done | Set its Status to Done."
- Kind 2, borderline.
- Why: a table of eight situations, where several rows (split a phase, a phase is done) say what a capable agent would do from the property tables above.
- Protects: the rows "Add a phase" ("Change only Order, never Phase ID") and "Merge two phases" and "Drop a phase" carry exact record forms (the Exit result texts "Merged into P1" and "Dropped: <reason>").
- Proposal: keep the rows that carry a rule or an exact text (Add a phase, Merge, Drop, Move a task). Replace the rest with one general rule: "A change to the plan is a change to rows. Change only the properties that the change needs, and never change Phase ID or Task ID."

### `work-github/references/work-tracker-issue-layout.md`

**F10.** `work-github/references/work-tracker-issue-layout.md:159`
- Text: "Ask the owner the type, unless the owner's text makes the type plain. For example, a report of something broken is `type:bug`."
- Kind 1, borderline.
- Why: it maps a kind of text to a type, which scripts how the agent interprets the owner's words.
- Protects: every issue has exactly one type label, and the agent does not guess a type from thin evidence.
- Proposal: keep the rule and drop the mapping: "Ask the owner the type, unless the owner's text already states it." The one-type-label rule is kept in `work-tracker-labels.md`.

### `work-github/references/work-tracker-labels.md`

**F11.** `work-github/references/work-tracker-labels.md:99`
- Text: five cases under "A label the owner changed by hand": two labels of one group, a state label removed, a priority label missing, a type label missing, and an issue with no labels.
- Kind 2, borderline.
- Why: it is a list of situations, where the rule "each group has exactly one label (state, type, priority); ask the owner for a value you cannot infer, and use the default for priority" covers the first four.
- Protects: the one-label-per-group rule that the searches and the board read, and the owner's hand change being kept.
- Proposal: keep the lines that give an exact value (`priority:medium`) or point to another section. State the rule first: "After a hand change, make sure the issue has exactly one state label, one type label, and one priority label. Ask the owner for a state or type that you cannot work out from the work item. Use `priority:medium` when there is none, and say so in one line." Keep the case "A state label was removed from an open work item" as written, because it names the source of the value (the last State in Recent History).

### `work-github/references/work-tracker-searching.md`

**F12.** `work-github/references/work-tracker-searching.md:97`
- Text: "An issue that was updated since that date and has no matching Recent History row was likely changed by the owner in the browser. Name that issue to the owner."
- Kind 1, borderline.
- Why: "was likely changed by the owner" tells the agent what to infer.
- Protects: hand changes in the browser must reach the owner, because GitHub has no change log in the issue body.
- Proposal: keep the action and drop the inference: "An issue that was updated since that date and has no matching Recent History row may have been changed in the browser. Tell the owner which issues these are."

### Files checked with no finding

I passed these instructions, so the owner can see what I did not report:
- `work-notion/references/work-tracker.md`, `:46` to `:52`: the "Mistakes to avoid" bullets protect the owner's edits, templates, and data (never delete a page, never replace the whole text).
- `work-local/references/work-tracker-searching.md:66`, and the report order at `:42`: they state who asks the owner and what the report holds.
- `work-github/references/work-tracker-gh-commands.md:168` to `:176` (the table of errors): each row is a fact about a `gh` message and the step the process takes (ask the owner to sign in; never create a replacement issue).
- `work-notion/references/work-tracker-page-layout.md:57` to `:59` (read the page again after deleting lines and compare): it is a verification step that protects the owner's views and edits.
- `work-local/references/work-tracker-folders-and-files.md:112` to `:120` (the cases where the agent asks the owner): they state when the owner decides, so they pass. Only the "Recommend ..." words in F4 are a finding.

## Phrase lists and trigger words

| Where | List | Does the text also state the general condition? |
| --- | --- | --- |
| `work-github/references/work-tracker.md:34` | The words `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, `resolved` before `#12` in a pull request or commit | Yes, in the same bullet: "When the pull request or the commit is merged, GitHub closes the issue, which marks the work item Done without the owner's yes." The words are a fact about GitHub, not triggers for the agent. The list passes. |
| `work-local/work-items/PROJECT-TASKS.md:3` | "an administrative task, a to-do the owner asked to keep, and an action item from a meeting or a message" | Yes, in the same sentence: the file holds "the project's tasks that belong to no work item". The three are examples. The list passes. |
| `work-local/references/work-tracker.md:28` | The five times to run the check for hand changes | Partly. The text states the goal elsewhere ("Check for changes that the owner made by hand") but reads as if only these five times start the check. This is F1. |

No file in the area holds a list of the owner's phrases that start a process. The one phrase that maps to a meaning is "WI-31" (F2).

## Numbers

Counts, limits, and thresholds that I passed, grouped.

- Levels: a work item is at level 1, 2, or 3, and a fourth level is not allowed (`work-local/references/work-tracker.md:11`, `work-local/references/work-tracker-folders-and-files.md:34` and `:126`, `work-notion/references/work-tracker.md:37`, `work-notion/references/work-tracker-searching.md:65`, `work-github/references/work-tracker.md:17`, `work-github/references/work-tracker-gh-commands.md:164`, `work-github/references/work-tracker-searching.md:67`). This is the owner's structure of the process, defined in `lifecycle-rules.md`, "Levels". Passed as a limit of the process.
- IDs and their forms: three digits (`WI-031`), `P1`, `P01`, `P2-T01`, `T01`, `PT-01`, `Q-02`, `R-01`, `SRC-###`, `DEC-###`. Passed as forms of a record.
- "The five lines of the work item's Current state" (many files). Passed as the form of the record.
- "The ten States" (`work-local/work-items/AGENTS.md:41`, `:48`). Passed as a fact of the process.
- "At most one design" for a work item (`work-local/references/work-tracker-field-mapping.md:147`). Passed as a form.
- "Two spaces" at the end of a task line (`work-local/references/work-tracker-field-mapping.md:51`, `work-github/references/work-tracker-issue-layout.md:90`). Passed as a Markdown fact.
- 30 labels (`work-github/references/work-tracker-labels.md:34`, `work-github/references/work-tracker-issue-layout.md:38`). Passed as a fact about this project's setup.
- 65,536 characters in an issue body or a comment, and 60,000 as the point to tell the owner (`work-github/references/work-tracker-issue-layout.md:140`, `:164`, `:170`; `work-github/references/work-tracker-gh-commands.md:176`, `:180`). The first is a fact about GitHub; the second is a protection with a margin below it. Passed.
- 30 results by default, `--limit 200`, and "double the limit and run again" (`work-github/references/work-tracker-gh-commands.md:181`, `:182`). Passed as facts about `gh`.
- 100 sub-issues for a parent, and at most three pinned issues (`work-github/references/work-tracker-gh-commands.md:183`, `work-github/references/work-tracker-project-roadmap-and-tasks.md:86`). Passed as GitHub limits.
- "Wait at least one second" between writes (`work-github/references/work-tracker-gh-commands.md:184`). Passed as a protection against GitHub's secondary rate limit.
- `page_size` 100 in the Notion board queries (`work-notion/references/work-tracker-searching.md:45`, `:93`). Passed as a fact about the Notion call.
- "Once, at setup" for the question about labels (`work-github/references/work-tracker.md:40`, `work-github/references/work-tracker-labels.md:80`). Passed as a step of the process.
- "Fewer than five blocks" in Notion: reported as F9, borderline.
- "Two to four lowercase words" for a folder name: reported as F13, borderline.
- "One or two sentences" and "Three to five sentences": reported as F5 and F7.
