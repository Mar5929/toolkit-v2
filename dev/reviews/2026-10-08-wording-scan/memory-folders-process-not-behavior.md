# Instructions that script the agent: memory-folders

This is the second pass over the 28 `.md` files in `memory-process/`, `memory-local/`, `memory-notion/`, `memory-hindsight/`, and `notion-tools/`, all under `plugins/toolkit/skills/project-setup/assets/`. Every path below starts at that folder. The question is whether a line states the owner's process, or tells the agent how to think or behave. I read the section "Three instructions for text that tells an agent what to do" in the root `AGENTS.md` first, and I opened each file again for the exact lines.

Most of this area passes. The area is mainly forms of records, places where facts are kept, steps of the process, facts about `ntn` and Notion, and limits that protect something. The findings below are the lines that do more.

## Summary

There are 16 findings. 12 of them are borderline, and the owner decides those.

| Kind | Findings | Borderline |
| --- | --- | --- |
| 1. Tells the agent how to think or interpret | 2 (F9, F21) | 2 |
| 2. A sentence or list for one small situation | 4 (F10, F11, F12, F13) | 4 |
| 3. A count or limit where the agent should judge | 6 (F3, F4, F5, F6, F7, F16) | 3 (F3, F4, F16) |
| 4. A phrase list that reads as the only trigger | 3 (F1, F14, F15) | 2 (F14, F15) |
| 5. Tells the agent what a capable agent already does | 1 (F8) | 1 |

The three files with the most findings:
1. `memory-process/.claude/skills/managing-project-memory/references/saving.md`: 8 findings (F3, F4, F8, F9, F10, F11, F13, F15).
2. `memory-process/.claude/skills/managing-project-memory/references/tidying.md`: 3 findings (F3, F5, F6).
3. `memory-hindsight/.claude/rules/hindsight-memory.md`: 1 finding (F1). It is third because it is the only clear case of trigger words with no general condition in the same file. Several files have one finding each (`current-state.md`, `finding.md`, `memory-process.md`, `folders-and-files.md`, `database-layout.md`, `searching.md` of Notion, `ntn-commands.md`, `memory-criteria.md`).

You asked me to judge "two or more sessions", "30 days", and "six months" under kind 3. Under "Numbers", F3 and F4 are borderline and F5 is a finding.

## Findings

### `memory-hindsight/.claude/rules/hindsight-memory.md`

**F1. `:9`, `:11`, `:13`.**
- Text: "When the owner says "remember this", file the fact where it is kept..." and "...When the owner says "forget that", or a memory in the bank is wrong, save a correction..." and "When the owner says "clean up memory", remove the lines of the project's Current State that are no longer true..."
- Kind: 4.
- Why it scripts the agent: Each rule starts from a quoted phrase, and this file never says that the same duty exists when the owner uses other words, or no words.
- What it seems to protect: The three jobs of a Hindsight project: filing a fact, correcting a memory, and tidying the project's Current State. The local files cover the same jobs and state the general condition (`memory-process.md:61`: "The owner's own request to keep, change, or forget something is the owner's yes. Act on it at once." and `:65`: "Clean up all of memory when the owner asks for it").
- Proposal: Replace each opening with the general condition and keep the phrase as an example.
  - "When the owner asks you to remember something, or tells you a fact that a later session needs (for example, "remember this"), file the fact where it is kept, and tell the owner that the add-on saves this session at the end of the turn."
  - "When the owner asks you to forget something (for example, "forget that"), or you find that a memory in the bank is wrong, save a correction with its tool `hindsight_ingest_document`, titled "Correction: <topic>"."
  - "When the owner asks you to clean up memory (for example, "clean up memory"), do these three things: ..." (see H-4 in the first pass).

### `memory-process/.../references/saving.md`

**F3. `:80`** (with `tidying.md:117` to `:121`).
- Text: "When a lesson has come up in two or more sessions or work items, offer it to the owner as a rule or a skill. Make the offer in the turn in which you add the second date." In `tidying.md`: "A lesson has proved itself when one of these three is true: its Seen line names two or more sessions or work items; ..."
- Kind: 3, borderline.
- Why it scripts the agent: "Two" stands in for the judgment "has this lesson proved itself", although the second condition in `tidying.md` ("a lesson like it is in the memory record for another subject") and the third ("the owner confirmed it") are already judgments without a count.
- What it seems to protect: A lesson that is seen once is a guess, and the owner should not be asked about a guess. The count also gives the agent one clear moment to make the offer.
- Proposal: Keep the rule, state the goal, and let the agent judge. "When a lesson comes up again in another session or work item, judge whether it has proved itself, and offer it to the owner as a rule or a skill. Make the offer in the turn in which you add the new date to its Seen line." "Comes up again" is the meaning of the count, so the lesson still waits for a second sighting. If the owner wants the count to stay, keep it and say why.

**F4. `:59`.**
- Text: "a "check or remove by" date, 30 days ahead unless the owner names one."
- Kind: 3, borderline.
- Why it scripts the agent: The number could stand in for a judgment about how long a claim stays fresh.
- What it seems to protect: A default date, so that an unchecked claim is never kept without a date. The words "unless the owner names one" make it a default and not a limit.
- Proposal: Keep it. It is the form of a record (every claim carries a date) with a default value. If the owner prefers judgment, write "a "check or remove by" date that fits how fast the claim could change, unless the owner names one".

**F8. `:31`** (with `finding.md:15` and `memory-notion/.../searching.md:45`).
- Text: "Search for the fact's words and their synonyms, and read each likely memory record whole." and "Search by the subject's words and their synonyms."
- Kind: 5, borderline.
- Why it scripts the agent: A capable agent already searches for synonyms.
- What it seems to protect: A search that only matched the exact words missed a record, and a test may have shown it. I cannot tell.
- Proposal: Say it once, in `finding.md:15`, and have `saving.md:31` point there ("Search as `references/finding.md` says"). The count in `searching.md:45` is F7.

**F9. `:161`.**
- Text: "A request that a problem never happens again, such as "don't let that happen again", is an instruction. Write the bullet as the check or the step that prevents the problem."
- Kind: 1, borderline.
- Why it scripts the agent: The first sentence maps a kind of owner phrase to a meaning ("is an instruction"), which is the pattern the owner named.
- What it seems to protect: A complaint without a fix was not turned into a rule, and the same mistake came back. The second sentence is process and should stay.
- Proposal: Keep the second sentence and the rule that the owner's rules go in `owner-preferences.md`. Replace the first with the goal: "When the owner asks that a problem never happen again, the answer is a rule. Write the bullet as the check or the step that prevents the problem."

**F10. `:171` to `:182`.**
- Text: Ten scripted reply lines, one for each kind of save, such as "Saved to memory: <title>. Say 'forget that' to undo." and "Retired from memory: <title>. Say 'bring it back' to restore it."
- Kind: 2, borderline.
- Why it scripts the agent: It is a list of cases, where one rule could cover them: one line for each save that names the record, says where it is kept, and says how to undo it.
- What it seems to protect: The owner sees the same undo words every time, and "forget that" and "undo that" work the same in every session. These are exact words the owner must see, so most of the list passes.
- Proposal: Keep the exact lines for the saves that teach an undo phrase (a new record, a correction, a retire), and replace the rest with the general rule: "For every other save, give one line that names the record by its title, says where it is kept, and says how to undo the save." I would keep "Not saved: <reason>." exactly, because the root `AGENTS.md` and other files depend on it.

**F11. `:107` to `:112`.**
- Text: "A failed run gets a row too, with the error and the fix." and "When the owner reports a run without its detail, write the row with the date and the owner's words, and write "not known yet" in each cell that the owner did not give..." and two more case bullets.
- Kind: 2, borderline.
- Why it scripts the agent: Four bullets give four situations of one rule: add a row for every run, with what is known.
- What it seems to protect: The Davis memory rule that a failed or half-reported run is still logged. The AGENTS section "One goal for keeping the records" says situations belong in the tests.
- Proposal: "Add a row for each run, also a failed run. Write what is known, and write "not known yet" in each cell that is unknown. When another record, such as a work item, already shows the run, the row holds only the date and that record's ID." Keep the example sentence about the owner's words.

**F13. `:50`.**
- Text: "When several independent things call for a save, group them into one save."
- Kind: 2, borderline.
- Why it scripts the agent: It is one rule for one situation, and it does not say what "one save" means (one record, or one reply line).
- What it seems to protect: Too many reply lines. I cannot tell.
- Proposal: Remove it. `Reply lines` (`:167`) already says to give one line for each save, and the goal says to tell the owner what was saved.

**F15. `:131` to `:138`.**
- Text: The heading `"Forget that", retiring, and deleting`, the table header `"Forget that" is about`, and "When the owner says "bring it back", reverse all of these changes."
- Kind: 4, borderline.
- Why it scripts the agent: The section is named for two owner phrases and reads as if only those phrases start the steps.
- What it seems to protect: The reply lines teach these phrases to the owner, so the owner uses them. The general condition is stated elsewhere: `memory-process.md:61` and `:69` to `:73`.
- Proposal: Keep the phrases as examples. Heading: "Forgetting, retiring, and deleting". Table header: "The owner asks you to forget (for example, "forget that")". Change `:137` to "When the owner asks you to bring it back (for example, "bring it back"), reverse all of these changes."

### `memory-process/.../references/tidying.md`

**F3 (second place).** `:117` to `:121`, see F3 above. The same change applies to both files.

**F5. `:88`** (and `finding.md:43`).
- Text: "It is about something that changes, such as a vendor, a process, or a person's role, and its last-verified date is unknown or more than six months old."
- Kind: 3.
- Why it scripts the agent: "Six months" stands in for the judgment "may this claim have changed". A vendor and a person's role do not change at the same speed. The file already picks the claims by kind ("something that changes"), so the number adds nothing the agent cannot judge.
- What it seems to protect: Old claims that were never rechecked. `finding.md:43` points here for the same age ("older than `references/tidying.md`, section "Stale records", allows"), so the two lines must change together.
- Proposal: "It is about something that changes, such as a vendor, a process, or a person's role, and its last-verified date is unknown or old enough that the claim may have changed. Judge by how fast that kind of thing changes." In `finding.md:43`: "...or when its last check is old enough that the claim may have changed."

**F6. `:61`** (with `folders-and-files.md:50` and `memory-notion/.../database-layout.md:96`).
- Text: "When a memory record is past the size limit that `references/memory-store.md` gives, move the sections of one sub-topic to a new memory record." In `folders-and-files.md`: "A file for one subject holds about 20 sections or 300 lines at most. A bigger file is two subjects."
- Kind: 3.
- Why it scripts the agent: The count stands in for "this file holds two subjects". The rule is also "about" and "at most" at once.
- What it seems to protect: One subject for each file, so that a search or a read stays useful. Cannot tell why 20 and 300.
- Proposal: "A file for one subject holds one subject. When a file grows long, check whether it holds two subjects, and split it when it does." Also correct the pointer: `memory-store.md` holds no size limit. The limit is in `folders-and-files.md` (local) and `database-layout.md` (Notion), so `tidying.md:61` should say "the size guidance in the storage instructions" or point to those files.

### `memory-process/.../references/current-state.md`

**F12. `:92` to `:99`** (with `:80` to `:85`).
- Text: "Remove every line that is no longer true... Remove each of these: under "Now", a finished or cancelled work item, or a piece of work that ended; a line under "Coming up" whose date has passed; a line under "Waiting on" that was answered or delivered..."
- Kind: 2, borderline.
- Why it scripts the agent: The general rule ("every line that is no longer true") comes first, and then five cases follow that the rule already covers.
- What it seems to protect: Stale lines that earlier agents left. `:83` already lists the same cases a second time.
- Proposal: Keep the general sentence, mark the list "for example", and keep only the last case, which is not obvious: "A line that copies a work item's status or next step is not removed: cut it to the work item's ID and a few words." Remove the duplicate list at `:83`.

### `memory-process/.../references/memory-process.md`

**F14. `:51`.**
- Text: "Search memory at the moments that the root `AGENTS.md`, section "Where information goes", lists."
- Kind: 4, borderline.
- Why it scripts the agent: The root list is a list of moments ("before you ask the owner to repeat something, name who does or decides something, set a date, deploy, load data, or run a recurring job"), and this sentence reads as if those are the only moments.
- What it seems to protect: Facts that the agent would otherwise guess or ask the owner again. I did not edit or judge the root file, which is outside my area.
- Proposal: "Search memory whenever a fact from earlier could matter to the work, for example at the moments that the root `AGENTS.md`, section "Where information goes", lists."

### `memory-process/.../references/memory-criteria.md`

**F21. `:28` to `:36`.**
- Text: "Save a subject in a memory record when all five of these are true: it concerns this project; it has a credible source; it would matter in a future session; it would be costly or unreliable to reconstruct; no other file is the place for it."
- Kind: 1, borderline.
- Why it scripts the agent: Four of the five tests ask the agent to weigh ("credible", "matter", "costly or unreliable").
- What it seems to protect: The criteria of the owner's memory design, which this file is named for. They state what memory is for, so they may count as process.
- Proposal: Keep it. It states the goal of memory and tells the agent what to weigh, which `wording-review.md` W5 allows. The owner may confirm.

### `memory-notion/.../references/searching.md`

**F7. `:45`.**
- Text: "Try two or three words and their synonyms."
- Kind: 3.
- Why it scripts the agent: The agent can judge how many words to try. The local `finding.md:15` says the same thing with no count.
- What it seems to protect: A search with one word that finds nothing. Cannot tell.
- Proposal: Remove the line. `finding.md:15` already says "Search by the subject's words and their synonyms."

### `notion-tools/.../references/ntn-commands.md`

**F16. `:143`, `:149`.**
- Text: "Check every 5 seconds until the page has its blocks:" and "A work item that is made from the template has more than 20 blocks."
- Kind: 3, borderline.
- Why it scripts the agent: "More than 20" is a stand-in for "the page is complete".
- What it seems to protect: A half-filled page that the agent reads as the finished page. This is a fact about how Notion fills a page in the background, so the number may be a measured fact. The 5 seconds and the two minutes (`:151`) protect against a loop that never ends, and I pass them.
- Proposal: Keep "20 blocks" only if the number was measured. Otherwise: "Check until the page holds the content of the template."

## Phrase lists and trigger words

| Where | The list | General condition stated? | Verdict |
| --- | --- | --- | --- |
| `hindsight-memory.md:9`, `:11`, `:13` | "remember this", "forget that", "clean up memory" | Not in this file. The root `AGENTS.md` states the goal of keeping the records, and the local `memory-process.md:61` and `:65` state the condition. | Finding F1 |
| `hindsight-memory.md:36` | "Check every line at each handoff, when a work item closes, when a date under Coming up has passed, and when the session-start hook says the file is too long or too old." | Yes. The sentence before it says "Remove a line when it stops being true." The events are a safety net. | Passes |
| `saving.md:131` to `:138`, `:127`, `:136` | "forget that", "bring it back", "undo that" | Yes, in `memory-process.md:61` and `:72`, but not in the section. | F15 for "bring it back" and the heading. The "undo that" lines pass: they tell the owner which words to say. |
| `saving.md:171` to `:182`, `:169`, `tidying.md:165` | "Say 'forget that' to undo", "Say 'keep going' and I'll <next action>" | Not a trigger. These are words the agent says. | Passes (exact words the owner must see). See F10 for the length of the list. |
| `saving.md:107` | "the weekly load ran fine", "the nightly job broke again" | Yes, in the same sentence: "The owner may report a run in words such as". | Passes (marked as examples) |
| `saving.md:161` | "don't let that happen again" | Yes, in the same sentence: "A request that a problem never happens again". | Passes, with the mapping in F9 |
| `saving.md:27` | "A reminder that a hook prints is only a hint." | Yes. `saving.md:24` and `memory-process.md:27` to `:29` state that the agent saves in the turn in which the change happens. | Passes. This sentence says that a hook is not the trigger, which is the owner's "insurance" idea. |
| `tidying.md:94`, `:133` | "always ...", "never ..." | Yes: "A section may be an instruction". | Passes (marked "such as") |
| `current-state.md:76` | "at 9 tomorrow" | Yes: "A to-do with a set time". | Passes |
| `finding.md:24` | "what did we do yesterday" | Yes: "a question about what was done or what changed in a period". | Passes |
| `current-state.md:89` | The session-start hook prints that the project's Current State is too long or too old | Yes: `:3` and `:73` state that every line is true now and is corrected in the turn in which the change happens. | Passes |
| `tidying.md:110` | The hook prints "Cut short to fit the hook limit" | Not a trigger. It is exact text that a hook prints. | Passes |
| `memory-process.md:51` | The moments in the root `AGENTS.md` | Not here. | F14 |
| `memory-process.md:65` | "Clean up all of memory when the owner asks for it ... Start a clean-up yourself when you judge..." | Yes, and it leaves the judgment to the agent. | Passes. This is the form the owner wants. |
| `notion-records.md:7` | "when a message holds a link to a Notion page, and when the owner says to search Notion" | Yes: the same sentence says "whichever Notion tool is used", and `:5` and `:6` say "only through". | Passes |

## Numbers

Every number I judged a fact, a form of a record, or a protection.

- **Line limits of the project's Current State: 5, 3, 4, 3, 3 lines for the five parts, and under 40 lines for the file** (`current-state.md:24` to `:32`, `memory-local/memory/CURRENT_STATE.md:3`, `hindsight-memory.md:29` to `:34`). Protection: the session-start hook prints the whole page at the start of every session, and Claude Code and Codex limit the size of that output. The tests check that it prints whole. Pass.
- **About 100 characters for the one-line summary** (`saving.md:47`). Protection: the index prints this line for every record, and its output is limited. "About" makes it soft. Pass.
- **60 characters for a file name and for a key** (`folders-and-files.md:51`, `writing-pages.md:22`). Form of a record. I cannot tell why 60; it does not stand in for a judgment. Pass.
- **Four types of memory record, three statuses, five parts of the Current State, six body labels, and one `## Runs` table** (`memory-process.md:41` and `:43`, `record-format.md:74`). Forms of records. Pass.
- **100 rows for each request, `page_size` 100, and 2,000 characters for one text piece** (`searching.md:82`, `ntn-commands.md:95`, `:99`, `:188`, `using-notion-cli/SKILL.md:43`). Facts about the Notion API. Pass.
- **At most 15 pinned properties** (`views-and-layout.md:39`). Fact about Notion. Pass.
- **5 seconds between checks, two minutes at most, retry once, and wait 5 seconds after a conflict** (`ntn-commands.md:143`, `:151`, `:183`, `:184`). Protection against a loop that never ends. Pass.
- **32 hexadecimal characters in a Notion link** (`ntn-commands.md:168`). Fact about Notion. Pass.
- **Dates as `YYYY-MM-DD`, an ID such as `WI-031`, and the check that `WI-031` does not match `WI-0310`** (many files). Forms of records and a protection against a wrong match. Pass.
- **Judged in the findings:** "two or more sessions or work items" (F3, borderline), "30 days" (F4, borderline), "six months" (F5, finding), "about 20 sections or 300 lines" (F6), "two or three words" (F7), and "more than 20 blocks" (F16, borderline).
