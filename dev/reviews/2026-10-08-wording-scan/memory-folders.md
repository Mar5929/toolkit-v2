# Wording scan: memory-folders

This file reports where the text in five setup folders is hard for a stranger to follow. The folders are `memory-process/`, `memory-local/`, `memory-notion/`, `memory-hindsight/`, and `notion-tools/`, all under `plugins/toolkit/skills/project-setup/assets/`. Every path below starts at that folder. I read all 28 `.md` files in full.

The measure is `document-clarity-standard.md`. A finding names the section of the standard and its first words.

## Files read

| File | Verdict | High | Medium | Low | Biggest problem |
| --- | --- | --- | --- | --- | --- |
| `memory-process/.claude/skills/managing-project-memory/SKILL.md` | clear as it is | 0 | 0 | 3 | Two words not explained: "Setup" and "project tasks" |
| `memory-process/.../references/memory-process.md` | small fixes | 0 | 3 | 5 | Three vague conditions |
| `memory-process/.../references/memory-criteria.md` | small fixes | 0 | 1 | 5 | An "or" that gives two dates |
| `memory-process/.../references/finding.md` | small fixes | 0 | 1 | 3 | The reason for a search warning is missing |
| `memory-process/.../references/current-state.md` | small fixes | 0 | 2 | 3 | An unclear condition and an unclear "the skill" |
| `memory-process/.../references/saving.md` | small fixes | 0 | 8 | 5 | Eight sentences that can be read two ways |
| `memory-process/.../references/tidying.md` | small fixes | 0 | 4 | 6 | Four unclear sentences about what goes on the plan |
| `memory-local/.../references/memory-store.md` | small fixes | 0 | 3 | 4 | A confusing reason about other computers |
| `memory-local/.../references/folders-and-files.md` | small fixes | 0 | 2 | 3 | "about ... at most" and two unnamed comments |
| `memory-local/.../references/record-format.md` | small fixes | 0 | 2 | 4 | "Header" used where "front matter" is the common word |
| `memory-local/.../references/searching.md` | small fixes | 0 | 1 | 3 | A line that says every command lists file names |
| `memory-local/memory/AGENTS.md` | small fixes | 0 | 1 | 3 | A heading that does not say what is under it |
| `memory-local/memory/CLAUDE.md` | clear as it is | 0 | 0 | 0 | None |
| `memory-local/memory/CURRENT_STATE.md` | small fixes | 0 | 1 | 2 | Its title uses the name of the work item's field |
| `memory-local/memory/MEMORY.md` | small fixes | 0 | 1 | 1 | A link labelled with the work item's field name |
| `memory-local/memory/project_topic_template.md` | needs a rewrite | 1 | 2 | 2 | One 2,700-character comment line that holds the rules |
| `memory-notion/.../assets/concept-record.md` | clear as it is | 0 | 0 | 0 | None (blank prompts only) |
| `memory-notion/.../assets/current-state.md` | clear as it is | 0 | 0 | 0 | None (blank prompts only) |
| `memory-notion/.../references/current-state-page.md` | small fixes | 0 | 1 | 1 | The page name "Current state" is the work item's field name |
| `memory-notion/.../references/database-layout.md` | small fixes | 0 | 2 | 4 | "proposed" status told two ways; history phrase |
| `memory-notion/.../references/memory-store.md` | small fixes | 0 | 3 | 3 | History phrase, "procedure", page name |
| `memory-notion/.../references/searching.md` | small fixes | 0 | 1 | 3 | Status words differ from the process words |
| `memory-notion/.../references/views-and-layout.md` | small fixes | 0 | 4 | 3 | One table cell holds 27 column names |
| `memory-notion/.../references/writing-pages.md` | small fixes | 0 | 1 | 4 | "A limited time" for restoring a deleted page |
| `memory-hindsight/.claude/rules/hindsight-memory.md` | needs a rewrite | 0 | 8 | 6 | 22 mixed bullets under no heading; unexplained words |
| `notion-tools/.claude/rules/notion-records.md` | small fixes | 0 | 1 | 1 | A last sentence that gives no instruction |
| `notion-tools/.claude/skills/using-notion-cli/SKILL.md` | small fixes | 0 | 1 | 1 | A "never" rule with no reason |
| `notion-tools/.../references/ntn-commands.md` | small fixes | 0 | 2 | 6 | "Those pages" and "come in pages" |

Totals: 1 High, 56 Medium, 84 Low. Every file was readable.

Two notes on scope. First, I report no problem in the blank prompts of the templates. Second, `project_topic_template.md` and `MEMORY.md` may be copied or written by `session-start.mjs`, so some headings below may be exact strings. Those findings say so.

## Findings

Each entry holds the place, the text, the seriousness, the line of the standard, the reason, and the rewrite. A rewrite keeps every rule, number, name, and exact string.

### `memory-hindsight/.claude/rules/hindsight-memory.md`

**H-1. `:3`. Medium.** Text: "This project's memory is Hindsight, on the owner's server, in the bank named under "Toolkit settings" in `PROJECT.md`."
- Standard: "Words and names", "A made-up word is new or has a meaning that exists only in this project."
- Why: A stranger does not know what Hindsight is or what a "bank" is. The word list says to explain "bank" once where the reader first meets it, and this is the first place.
- Rewrite: "This project's memory is Hindsight, a memory service on the owner's server. Hindsight keeps the memories of each project in a separate store called a bank. The name of this project's bank is under "Toolkit settings" in `PROJECT.md`."

**H-2. `:5` to `:23`. Medium.** Text: 19 bullets under the title, with no headings.
- Standard: "Extra rules for documents", "Organize the document so that a reader can find a thing from the headings alone."
- Why: The bullets cover six subjects (what Hindsight is for, searching, saving, correcting and deleting, secrets, and the bank's settings). A reader cannot find the rule about deleting without reading all of them.
- Rewrite: Add headings. See "Layout".

**H-3. `:10`. Medium.** Text: "When a recurring job ran, or another thing happened, make no event record."
- Standard: "Words and names", "A made-up word is new or has a meaning that exists only in this project."
- Why: "Event record" is a memory file type from the local and Notion memory. This project has none, so the reader does not know what is forbidden.
- Rewrite: "When a recurring job ran or something else happened, do not make a memory file for it. In your reply, say the date, what ran or happened, and the result, so that the add-on saves them. When the job has a `delivery/` record, write the run there."

**H-4. `:13`. Medium.** Text: "...save a correction for each memory you checked and found wrong, and list for the owner the memories only the owner can delete."
- Standard: "Sentences", "Put one idea in a sentence, or two ideas that belong together."
- Why: One sentence holds three actions. "The memories only the owner can delete" can mean every wrong memory or only some.
- Rewrite: "When the owner says "clean up memory", do these three things and change nothing else in the bank:
  1. Remove the lines of the project's Current State that are no longer true, as the last section of this file says.
  2. For each memory that you checked and found wrong, save a correction.
  3. Give the owner a list of the wrong memories, because only the owner can delete a memory."
- Question for the owner: Does step 3 list every wrong memory? I read it that way, because the add-on cannot delete (`:11`).

**H-5. `:16`. Medium.** Text: "Never store where work stands now in Hindsight with a tool."
- Standard: "Words and names", "Be specific."
- Why: The add-on saves each session by itself, and the sentence does not say whether that save is allowed. "With a tool" is the only limit.
- Rewrite: "Do not use a Hindsight tool to store where work stands now. The work items and `memory/CURRENT_STATE.md` hold it."

**H-6. `:27`. Medium.** Text: "It is in the main checkout only (`AGENTS.md`, "Project map")."
- Standard: "Words and names", "A made-up word is new..." and "Extra rules for documents", "When you point to another file, say what is in the file".
- Why: "Main checkout" is not explained in this file, and the pointer does not say what the Project map says.
- Rewrite: "Git ignores it, so it exists only in the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints. `AGENTS.md`, section "Project map", lists the file."

**H-7. `:28` to `:33`. Medium.** Text: "Now: one line per active piece of work, at most 5."
- Standard: "Sentences", "Never cut a prose sentence down to a label and a colon."
- Why: Six instructions are a label and a fragment. The reader must guess the verb, and "at most 5" has no unit in some lines.
- Rewrite:
  - "Start the file with "Last updated:", then one line that holds the date as YYYY-MM-DD, what caused the change, and who made it. Set this line with every change."
  - "Under "Now", write one line for each active piece of work, and no more than 5 lines. A work item that has left Backlog and is not Done or Cancelled gets its ID and a few words; `managing-work-items` decides that line. Other work gets a few words and the ID of its record."
  - "Under "Coming up", write a dated event or deadline, with the date first as YYYY-MM-DD, and no more than 3 lines."
  - "Under "Waiting on", write who owes what, with the person or party first and the date asked, and no more than 4 lines. Name a project task or an Open decision by its ID and a few words."
  - "Under "Standing jobs and shared files", write a recurring job, or a shared file that is kept up to date, and the file, link, or `delivery/` record that describes it, and no more than 3 lines."
  - "Under "Next session starts with", write one line for each piece of work worked on last, and no more than 3 lines. A work item gets its ID and "read its Current state". Other work gets what it is and its next step."

**H-8. `:33`. Medium.** Text: "`handoff` writes these lines; with no handoff, set them with a change under Now."
- Standard: "Words and names", "Be specific."
- Why: "Set them with a change under Now" has no clear meaning. The process file says the part is set in the turn in which the work starts or changes (`memory-process/.../current-state.md:69`).
- Rewrite: "The `handoff` skill writes these lines. When there is no handoff, set them in the turn in which the work starts or changes."

Low (6): the file does not open with what must be true when its job is done (`:3`); "a memory" is used for Hindsight's own object where the word list says "memory record" (`:11`, `:12`, `:13`); `:17` names two sections of another rule without saying what they say; `:23` holds two ideas; `:6` "DEC-### or rule ID" does not say what a rule ID is; the five-part definition at `:28` to `:36` copies `current-state.md` (see Patterns).

### `memory-local/memory/project_topic_template.md`

**TP-1. `:20`. High.** Text: "For a local work item, the list entry uses `[[WI-031]]`, because Obsidian reads links in properties only in that form; a local work item link in the note's text uses the same form, because the item's file keeps its ID name when its folder moves, and other links in the note's text use Markdown format."
- Standard: "Sentences", "Put one idea in a sentence" and "Extra rules for documents", "When one point needs several rules, give the main rule first."
- Why: The comment is one line of about 2,700 characters. The rule for the `work_items` field is spread over four long sentences of 50 to 60 words each. An agent that copies this template for every new memory file cannot find the rule and may write a wrong entry.
- Rewrite of the `work_items` part: "Set `work_items` to one entry for each related work item, or to `[]` when no work item applies. Write each entry in double quotes, with the work item's ID first. An unquoted `#12` is read as a YAML comment and the entry is lost.
  - When the work items are local files, write an Obsidian link, such as `"[[WI-031]]"`. Obsidian reads a link in a property only in this form. Use the same form for a link to the work item in the text of the file, because the work item's file keeps its ID as its name when its folder moves.
  - When the work items are in Notion, write the ID and the web address of the page, such as `"WI-31 https://www.notion.so/<page>"`.
  - When the work items are in GitHub, write the ID and the web address of the issue, such as `"#12 https://github.com/<owner>/<repo>/issues/12"`.
  
  Then write the work item's ID under Authoritative records. Write every other link in the text as a Markdown link. Write examples in backticks so that Obsidian does not count them as links, and write real links without backticks."
- Also split the rest of the comment into one numbered step for each instruction, each on its own line.

**TP-2. `:20`. Medium.** Text: "...one topic file holds one concept or area ... Set name to that filename stem ... status to the real lifecycle state ... front matter ... properties ... the item's ID file ... names the home of every other fact."
- Standard: "Words and names", "Use the exact name the system uses for a thing, and use the same name every time."
- Why: The comment uses "concept", "filename stem", "lifecycle state", "front matter", "properties", "the item's ID file", and "home". The skill files say "subject", "file name without `.md`", "status", "header", "field", "the work item's file", and "the place where it is kept". The word list also removes "concept" and "home".
- Rewrite: Use "subject", "the file name without `.md`", "status", the one word chosen for the block of fields (see RF-1), "field", "the work item's file", and "the place where it is kept".

**TP-3. `:20`. Medium.** Text: the whole guide comment.
- Standard: "Extra rules for documents", "When another skill or file does a neighbouring job, say in one sentence which one does which part."
- Why: `record-format.md` already holds the rules for the header fields, the body labels, the links, and the lessons. The comment repeats them in different words. A change must be made in two places, and the two texts already differ ("filename stem" and "file name without `.md`").
- Rewrite: Keep in the comment only the steps for copying the template, and add one sentence: "`references/record-format.md` holds the rules for each field and each body label."

Low (2): `:20` "the home of every other fact" (word list: "the place where it is kept"); the last comment at `:40` repeats `:20` ("Remove this comment ... before saving").

### `memory-process/.../references/saving.md`

**SV-1. `:27`. Medium.** Text: "When nothing qualifies for a save, save nothing. A reminder that a hook prints is only a hint. A hook is a small command that Claude Code or Codex runs by itself at set moments."
- Standard: "Words and names", "Be specific."
- Why: "Qualifies" does not say what the test is. The sentence about the reminder does not say what a hint means for the reader's next step. The definition comes after the word it explains.
- Rewrite: "When nothing needs a save, save nothing. A hook is a small command that Claude Code or Codex runs by itself at set moments. A hook may print a reminder to save something, but the reminder does not mean that a save is needed."

**SV-2. `:47`, `:49`. Medium.** Text: "The one-line summary states the fact itself..." and "Record what allowed the save."
- Standard: "Extra rules for documents", "Never leave a file name where the instruction should be" and "Words and names", "Name the thing directly."
- Why: The reader does not know where the summary, the dates, or the record of what allowed the save are written. The storage files call them `description`, `updated`, `authorization` (local) and Synopsis, Saved, Authorization (Notion).
- Rewrite: Add under the heading "Write the change": "`references/memory-store.md` names the field or column that holds the one-line summary, each date, and the record of what allowed the save."

**SV-3. `:72`. Medium.** Text: "When `managing-work-items` closes the work item, one of three things happens to the lesson: the owner agrees to keep it for the whole project, it is dropped, or it is given to this skill to be kept."
- Standard: "Sentences", "Name who acts, and put that name first."
- Why: Three passive clauses do not say who drops the lesson or who gives it. The first outcome does not say where the lesson goes (step 5 of "The owner's instructions" at `:163` says it becomes a rule).
- Rewrite: "When `managing-work-items` closes the work item, it settles each lesson in one of three ways: the owner agrees to keep the lesson for the whole project, `managing-work-items` drops it, or `managing-work-items` gives it to this skill to keep."
- Question for the owner: Where does a lesson go when the owner agrees to keep it? `:163` says a rule. Say so here.

**SV-4. `:98`. Medium.** Text: "One kind of result gets no event record. When the root `AGENTS.md`, section "Where information goes", names a place for the result, write the result in that place."
- Standard: "Paragraphs and sections", "Start a paragraph or a section with the sentence that states its point."
- Why: The first sentence names a "kind of result" and the reader must wait for the next sentence to learn which kind.
- Rewrite: "When the root `AGENTS.md`, section "Where information goes", names a place for the result, write the result in that place and make no event record. For example, write an analysis of how the system works today in `reference/current-system/`."

**SV-5. `:125`. Medium.** Text: "Replace the text of the fact's section, with the new source and date, and set the last-verified date to today."
- Standard: "Words and names", "Make the subject of ... clear" and "Sentences", "Write steps in the order the reader does them."
- Why: "Write the change" (`:42`) says to set the last-changed date on every change, and this step names only the last-verified date. A reader can leave the last-changed date old.
- Rewrite: "Replace the text of the fact's section, with the new source and date. Set the last-verified date and the last-changed date to today."

**SV-6. `:140` to `:147`. Medium.** Text: "Delete a memory record in these cases: ... it holds a secret or an email address. In this case, ask the owner first." and "When you find a secret or an email address in memory, remove that text at once, and tell the owner."
- Standard: "Sentences", "Put the condition before the action" and "Paragraphs and sections", "Use as many points as the subject needs."
- Why: One reading is that the agent deletes the record and asks. The other reading is that it removes the text at once and asks only about deleting the record. The two lines look like they disagree.
- Rewrite: "Delete a memory record when the owner says to delete it. When a memory record holds a secret or an email address, first remove that text at once and tell the owner. Then ask the owner whether to delete the whole record."
- Also: `memory-criteria.md:89` ("Never save in a memory record") lists secrets but not email addresses. Add "an email address" there.

**SV-7. `:153`. Medium.** Text: "Write a line that the owner dictates with the steps below alone. For every other change to a rule file, use `writing-harness-files`."
- Standard: "Sentences", "Say what to do."
- Why: "With the steps below alone" can be read as "write a line using only these steps" or "write only a line".
- Rewrite: "To add a line that the owner dictates, use only the steps below. For every other change to a rule file, use the skill `writing-harness-files`."

**SV-8. `:160`. Medium.** Text: "...add the bullet to the files that the root `AGENTS.md` names for every project, in place of this project's file."
- Standard: "Words and names", "Be specific."
- Why: "In place of" can mean "instead of" or "as well as".
- Rewrite: "...add the bullet to the files that the root `AGENTS.md` names for every project, and not to this project's file."
- Question for the owner: Is "instead of" the meaning? If the bullet should also be in this project's file, say "and also".

Low (5): `:151` "So is a preference of the owner" is awkward; `:161` "a DEC" and `:94` "an SRC ID" use abbreviations that are not written out; `:173` "A retire:" and "A delete:" turn verbs into nouns; `:94` and `:158` use "chat" where the word list says "session" (exact strings, so only report).

### `memory-process/.../references/tidying.md`

**TI-1. `:30`. Medium.** Text: "When the helper returns, make the changes on its first list yourself, which takes the place of doing "The project's Current State" first."
- Standard: "Words and names", "Make the subject of ... 'which' clear."
- Why: "Which" can point to the helper, the list, or the act of making the changes.
- Rewrite: "When the helper returns, make the changes on its first list yourself. These are the changes that the section "The project's Current State" describes, so you do not do that section again."

**TI-2. `:110`. Medium.** Text: "The text that is shown at the start of a session can end with "Cut short to fit the hook limit"."
- Standard: "Sentences", "Name who acts, and put that name first."
- Why: The reader does not know which text, who shows it, or what the hook limit is.
- Rewrite: "The session-start hook shows the list of memory records at the start of a session. The hook cuts the list when it is too long, and then the list ends with "Cut short to fit the hook limit". When it does, put two kinds of change on the plan until the whole list is shown:"

**TI-3. `:40`. Medium.** Text: "These changes do not go on the plan: removing lines of the project's Current State that are no longer true, removing a secret or an email address at once, and retiring a memory record or removing a section whose "check or remove by" date has passed and that is no longer true, as "Stale records" below says."
- Standard: "Sentences", "Put one idea in a sentence" and "Give every item in a list the same form."
- Why: Three changes and a pointer are in one sentence, and the reader must find which changes are safe to make without the owner's yes.
- Rewrite: "These changes do not go on the plan. Make them, and tell the owner:
  - removing lines of the project's Current State that are no longer true;
  - removing a secret or an email address at once;
  - retiring a memory record, or removing a section, whose "check or remove by" date has passed and that is no longer true ("Stale records" below)."

**TI-4. `:35`. Medium.** Text: "`references/memory-store.md` says what in its layout is not a memory record (an index, a template), and what else to check there."
- Standard: "Words and names", "Be specific."
- Why: "What else to check there" names nothing.
- Rewrite: "`references/memory-store.md` lists the files or rows that are not memory records, such as an index, a template, or a row with no key."

Low (6): `:28` "when your host can" (word list: name Claude Code or Codex); `:101` "Old feedback records" does not say which projects have them; `:156` uses the bare name "Current State" as a label in the sample report; `:67` "Authoritative records" is not explained here; `:88` holds three ideas in one list item; `:133` "is proposed as a rule" does not say who proposes.

### `memory-process/.../references/memory-process.md`

**MP-1. `:65`. Medium.** Text: "Start a clean-up yourself when you judge that memory is no longer small and true."
- Standard: "Words and names", "Be specific."
- Why: "Small and true" is a goal. The agent cannot tell when memory stops being small.
- Rewrite: "Start a clean-up yourself when you judge that memory has grown too large to read quickly, or that it holds lines that are no longer true."

**MP-2. `:51`. Medium.** Text: "In a project that does not show its memory records at the start of a session, this search is the only way that you see a memory record."
- Standard: "Words and names", "Be specific."
- Why: The reader does not know which projects show them.
- Rewrite: "Some projects show the list of memory records at the start of a session. A project that keeps memory in Notion does not. When the project does not show them, searching is the only way to see a memory record."

**MP-3. `:59`. Medium.** Text: "...or a part of the project's Current State is over its limit with only true lines."
- Standard: "Sentences", "Keep the subject and its verb close together."
- Why: "With only true lines" is unclear.
- Rewrite: "...or a part of the project's Current State is over its line limit even though every line in it is true."

Low (5): `:1` repeats the title of `SKILL.md` ("Managing project memory"); `:12` and `:81` to `:89` say the same thing about the neighbouring skills; `:67` "A helper" is not explained in this file; `:37` "like a wiki"; `:58` "the Project map" is not placed in a file.

### `memory-process/.../references/current-state.md`

**CU-1. `:48`. Medium.** Text: "Write a line only for what work waits on, or for what has no other record."
- Standard: "Words and names", "Make the subject of ... clear" and "Sentences", "Put the condition before the action."
- Why: The sentence can mean two conditions or one.
- Rewrite: "Write a line under "Waiting on" only when work waits on the thing owed, or when no other record holds it."

**CU-2. `:69`. Medium.** Text: "`managing-work-items` for a work item, and this skill for every other piece of work. The skill sets this part in the turn in which that work starts or changes..."
- Standard: "Words and names", "Make the subject of 'this' ... clear."
- Why: "The skill" follows two skill names.
- Rewrite: "`managing-work-items` for a work item, and `managing-project-memory` (this skill) for every other piece of work. Each skill sets the line in the turn in which that work starts or changes, so that the part names that piece of work."

Low (3): `:32` "in as few words as say it" is awkward; `:89` "The session-start hook asks for these steps" does not say what a hook is (SV-1 does); `:92` "the plan that `references/tidying.md` describes" does not say what the plan is.

### `memory-process/.../references/finding.md`

**FI-1. `:20`. Medium.** Text: "A search of the project's files does not always reach the work items and memory."
- Standard: "Extra rules for documents", "When an instruction would look arbitrary, give the reason in one clause."
- Why: The reader does not know why the search misses them.
- Rewrite: "A search of the project's files can miss the work items and memory. The folders `work-items/` and `memory/` are kept out of Git, and work items and memory kept in Notion are not in the project's files at all."

Low (3): `:18` "A session shows it at its start" (the hook shows it); `:17` "Questions and Answers" and `:27` "Recent History" are not placed in the work item; `:47` "as `.claude/rules/cite-recalled-knowledge.md` says" does not say what it says. Rewrite for `:47`: "Cite each source you use. Name the source by its ID when it has one, as `.claude/rules/cite-recalled-knowledge.md` says."

### `memory-process/.../references/memory-criteria.md`

**MC-1. `:83`. Medium.** Text: "That date is the day after the fact stops being true, or the day the fact must be checked again."
- Standard: "Words and names", "Be specific."
- Why: "Or" gives two dates and no rule for which one to use.
- Rewrite: "When the fact has a known end, the date is the day after the fact stops being true. Otherwise, it is the day the fact must be checked again."

Low (5): `:11` "Memory then gets nothing"; `:89` "dropped guesses"; `:91` "unshipped requirements"; `:92` "The owner's no stands"; `:36` repeats `memory-process.md:37`.

### `memory-process/.../SKILL.md`

Low (3): `:3` the description's "Use when the owner asks ...; reports ...; or a turn leaves ..." changes subject twice (exact string, because it matches `dev/SKILL-INDEX.md`); `:10` "Setup places only ..." should say "The `project-setup` skill places only ..."; `:12` "its project tasks" is never explained in this skill.

### `memory-local/.../references/memory-store.md`

**ML-1. `:50`. Medium.** Text: "A new clone of the repository has no `memory/` folder, and neither has another computer. So an empty result there shows nothing about what was recorded."
- Standard: "Words and names", "Make the subject of ... clear."
- Why: "Another computer" and "there" have no clear subject.
- Rewrite: "Git ignores `memory/`, so a new clone of the repository has no `memory/` folder, and neither does a copy of the project on another computer. A search there that finds nothing does not show that nothing was recorded."

**ML-2. `:47`. Medium.** Text: "So begin every command that uses `$MAIN` with that line and a `;`, in the same command."
- Standard: "Sentences", "Say what to do."
- Why: "That line and a `;`" is unclear.
- Rewrite: "So begin every command that uses `$MAIN` with the `MAIN=` line from this step, followed by `;`, in the same command."

**ML-3. `:59`. Medium.** Text: "Report it as not saved to the procedure that asked for it."
- Standard: "Words and names", "Be specific."
- Why: "The procedure" is not a thing the reader can see. See the pattern "procedure that asked".
- Rewrite: "Tell the skill or step that asked for the save that the change is not saved."

Low (4): `:67` repeats `:46`; `:30` names the stored value `superseded` before `:36` maps it to "replaced"; `:22` "starts with a picture"; `:68` is a long Codex note inside a bullet.

### `memory-local/.../references/folders-and-files.md`

**FF-1. `:50`. Medium.** Text: "A file for one subject holds about 20 sections or 300 lines at most."
- Standard: "Words and names", "Be specific."
- Why: "About" and "at most" contradict each other. `tidying.md:61` depends on the limit being exact.
- Rewrite: "Keep a file for one subject to about 20 sections or 300 lines. A file that is bigger holds two subjects: split it."
- Question for the owner: Should this limit be a count at all, or should the agent judge when a file holds two subjects?

**FF-2. `:68`. Medium.** Text: "Remove the fill-in guide comment, the final template comment, and every prompt in angle brackets."
- Standard: "Extra rules for documents", "Never leave a file name where the instruction should be."
- Why: The reader must find the two comments in the template.
- Rewrite: "Remove the comment that starts "Fill-in guide" under the title, the comment at the end of the file, and every prompt in angle brackets."

Low (3): `:45` is history ("prefixes that are no longer used"); `:18` "the folder's own guide"; `:84` "The skill that asked for the change decides what a line says".

### `memory-local/.../references/record-format.md`

**RF-1. `:21`. Medium.** Text: "The header is the block of fields between the two `---` lines at the top of the file."
- Standard: "Words and names", "Use common words" and "A made-up word is new or has a meaning that exists only in this project."
- Why: The common word for this block is "front matter" (the word list keeps it). The file uses "header" 16 times in `memory-local/`, and the template says "front matter" and "properties". A table also has a "header row" in the same folder.
- Rewrite: "The front matter is the block of fields between the two `---` lines at the top of the file." Use "front matter" in all 16 places, in the template, and in the Notion files that mention it.

**RF-2. `:26`. Medium.** Text: "`managing-project-memory` gives the length of the line."
- Standard: "Extra rules for documents", "When you point to another file, say what is in the file and when to open it."
- Why: The sentence points to a skill and not to a file or a section.
- Rewrite: "`references/saving.md`, section "Write the change", gives the length of the line."

Low (4): `:66` a table row of 60 words; `:83` "(a DEC, an SRC, ...)"; `:32` "absolute date" is not explained (write "a full date, as `YYYY-MM-DD`"); `:43` a history rule for older files in the middle of the table notes.

### `memory-local/.../references/searching.md`

**SL-1. `:10`. Medium.** Text: "A command lists file names. Open a file to read it."
- Standard: "Paragraphs and sections", "Two lines ... say different things" (W4 of the wording review).
- Why: Four commands print matching lines, not file names (`:17`, `:63`, `:70`, `:78`).
- Rewrite: "A command with `-l` lists file names. The other commands print matching lines with their file names. Open a file to read all of it."

Low (3): `:67` "take two things" is awkward; `:70` has a date that the reader must replace, and `:8` does not list it; `:20` "has no header" (see RF-1).

### `memory-local/memory/AGENTS.md`

**MA-1. `:25`. Medium.** Text: "## What must stay true"
- Standard: "Words and names", "Give every heading a name in ordinary words that tells the reader what the section covers."
- Why: The section holds a pointer to a rule and a pointer to a check. The heading does not say so.
- Rewrite: "## The rule and the check for this folder"

Low (3): `:1` the title is a sentence; `:22` gives a permission under the heading "What never goes in memory"; `:32` to `:38` the table names the same skill in five rows.

### `memory-local/memory/CURRENT_STATE.md`

**CS-1. `:1`. Medium.** Text: "# Current state"
- Standard: "Words and names", "Use the exact name the system uses for a thing, and use the same name every time."
- Why: This file is the project's Current State. "Current state" is the name of the work item's five lines. The owner decided on 2026-10-06 that every file says which one it means.
- Rewrite: "# The project's Current State". Exact string check: confirm that `session-start.mjs` and `validate-records.mjs` do not read this title.

Low (2): the guide at `:3` says "makes every change" for a skill; "Remove a line the moment it stops being true".

### `memory-local/memory/MEMORY.md`

**MI-1. `:21`. Medium.** Text: "- [Current state](CURRENT_STATE.md)"
- Standard: same as CS-1.
- Why: The link label is the work item's field name.
- Rewrite: "- [The project's Current State](CURRENT_STATE.md)". This line may be written by `session-start.mjs`, which would make it an exact string. Then change the hook text and its test together. The heading "Other memory views" at `:19` could also read "The project's Current State".

Low (1): `:5` "are left out" does not say who leaves them out (the hook).

### `memory-notion/.../references/current-state-page.md`

**NP-1. `:1`, `:3`, `:7`, `:18`. Medium.** Text: "# The Current state page" and "the project's Notion "Current state" page".
- Standard: "Words and names", "Use the exact name the system uses for a thing."
- Why: The page title "Current state" matches the work item's field name. The reader cannot tell which one is meant without reading the next sentence. The page name is an exact string (the `PROJECT.md` bullet "Current state page").
- Rewrite: "This file says how to read and change the Notion page named "Current state". The page holds the project's Current State. It is not a work item's Current state. In the rest of this file, "the page" means that page." Use "the project's Current State page" in headings and prose.

Low (1): `:5` repeats the sentence in `folders-and-files.md:84`.

### `memory-notion/.../references/memory-store.md`

**MN-1. `:8`, `:29`, `:31`, `:74`, `:77`. Medium.** Text: "the Notion page named **Current state**" and "the **Current state** page".
- Standard: same as NP-1.
- Why: The same confusion as NP-1, repeated in five lines.
- Rewrite: At `:8`: "Here it is the Notion page named **Current state**. The page title is only a name: the page holds the project's Current State." In the other lines write "the project's Current State page".

**MN-2. `:30`. Medium.** Text: "Never write the **Terminology glossary** page beside the Memory page, or a page of Memories with the `decision` tag. ... Both are from the layout that was used before the current folder layout."
- Standard: "Paragraphs and sections", "Write about the subject. Do not write about the document itself or about the session that produced it." and "Sentences", "Say what to do."
- Why: "Never write the page" can read as "never create it" or "never write to it". "The layout that was used before the current folder layout" is history that a new reader cannot place.
- Rewrite: "Do not write to, and do not read from, a page named **Terminology glossary** beside the Memory page, or a Memories page with the `decision` tag. Projects set up with an older toolkit have them. Find a project term in `system/glossary.md` and a decision in `DECISIONS.md`."

**MN-3. `:44`, `:45`. Medium.** Text: "Report it as not saved to the procedure that asked for it." and "Give the procedure that asked each page's title and link."
- Standard: "Words and names", "Be specific."
- Why: The second sentence is hard to parse, and "the procedure" is not a thing the reader can see.
- Rewrite: "Tell the skill or step that asked for the save that the change is not saved." and "Give the skill or step that asked for the save the title and the link of each page. The link is the `url` in the page's answer."

Low (3): `:31` "Only the Current state page is printed" does not say who prints it; `:33` and elsewhere write "ids" and "id" in lower case, and the work item files write "ID"; `:27` "slug".

### `memory-notion/.../references/database-layout.md`

**DL-1. `:81`. Medium.** Text: "A page with the Status "proposed" was saved by an earlier version of the toolkit: do not rely on it..."
- Standard: "Paragraphs and sections" and the wording review check W4: two lines say different things.
- Why: `searching.md:9` and `views-and-layout.md:15` return and list "proposed" pages with "accepted" pages and give no warning.
- Rewrite: Keep this line, and add to `searching.md:9`: "A page with the Status proposed was saved by an earlier version of the toolkit. Do not rely on it."

**DL-2. `:34`, `:248`. Medium.** Text: "A page with the `decision` tag, or a row on the glossary page, is from the layout that was used before the current folder layout."
- Standard: "Paragraphs and sections", "Write about the subject."
- Why: The reader cannot place "the layout that was used before". The phrase appears five times in `memory-notion/`.
- Rewrite: "A page with the `decision` tag, or a row on the glossary page, comes from a project set up with an older toolkit. Leave it as it is, and tell the skill that asked that it exists."

Low (4): `:240` the heading "What is not written" (use "Parts of the layout that get no new content"); `:5` "The bodies that create the databases" (use "request bodies"); `:66` "The id of that row"; `:102` lists Jira, which the toolkit does not support.

### `memory-notion/.../references/searching.md`

**SN-1. `:9` to `:11`. Medium.** Text: "return pages with the Status accepted or proposed."
- Standard: "Words and names", "Use the exact name the system uses for a thing, and use the same name every time."
- Why: The process files say current, replaced, and retired. This file says accepted, proposed, and superseded without the mapping.
- Rewrite: Add: "`database-layout.md`, section "Status", maps these options to current, replaced, and retired."

Low (3): `:59` "In every setup"; `:66` says "check or remove by" and the filter uses Review By; `:14` the contents list follows the text and not the title.

### `memory-notion/.../references/views-and-layout.md`

**VL-1. `:28`. Medium.** Text: one table cell holding 27 hidden column names for Memories, and "·" between sections.
- Standard: "Extra rules for documents", "Organize the document so that a reader can find a thing from the headings alone."
- Why: The reader cannot find a column in a cell of 60 words.
- Rewrite: One list for each database with three lines: "Pinned in the heading", "Sections, in order", and "Hidden".

**VL-2. `:20`. Medium.** Text: "So the Decisions view lists only pages from the layout that was used before the current folder layout."
- Standard: same as DL-2.
- Rewrite: "So the Decisions view lists only pages from projects that were set up before decisions moved to `DECISIONS.md`."

**VL-3. `:34`. Medium.** Text: "Table views list the columns in this order, with the hidden ones `"visible": false`."
- Standard: "Sentences", "Say what to do."
- Why: "In this order" does not say which order, and the second clause has no verb.
- Rewrite: "A table view lists the columns in the order of the table above. A request sets `"visible": false` on each hidden column."

**VL-4. `:62`. Medium.** Text: "It is a list, not a body: send them with every existing option (its `note` says how)."
- Standard: "Words and names", "Make the subject of ... clear."
- Why: "It" and "them" point to different things, and the file calls the other files "bodies".
- Rewrite: "This file is a list of options and not a request body. Send the options together with every option that already exists. The `note` field in the file says how."

Low (3): `:24` and `:44` give dates that the reader cannot use ("approved this grouping (2026-09-30)", "tested 2026-09-30"); `:36` "once per database of a template"; `:55` "bodies".

### `memory-notion/.../references/writing-pages.md`

**WP-1. `:141`. Medium.** Text: "A deleted page can be brought back for a limited time... Notion empties its trash itself later."
- Standard: "Words and names", "Be specific."
- Why: `memory-process.md:72` tells the agent to say whether a deleted record can be brought back, and this line does not say for how long.
- Rewrite: "A deleted page can be brought back for as long as Notion keeps it in the trash, which is [number of days, from Notion's help page]. After that, Notion removes it for good." Question for the owner: confirm the period.

Low (4): `:22` "slug"; `:54` and `:151` "<item page id>" and "<item-page-id>" use "item" alone; `:97` "the new `<tr>`"; `:158` passive "One page is kept".

### `notion-tools/.claude/rules/notion-records.md`

**NR-1. `:9`. Medium.** Text: "A memory record holds the fields that `managing-project-memory` names."
- Standard: "Sentences", "Say what to do."
- Why: The sentence states a fact. The reader does not learn what to do, and the sentence says nothing about the fields of a work item.
- Rewrite: "A work item has the fields that `managing-work-items` names, and a memory record has the fields that `managing-project-memory` names. Fill in those fields."
- Question for the owner: Does the work item part belong here? The rule covers both.

Low (1): `:7` "They also apply" has two possible subjects.

### `notion-tools/.../using-notion-cli/SKILL.md`

**UN-1. `:44`. Medium.** Text: "Never remove the line of a database view or the line of a child page from a page's text."
- Standard: "Extra rules for documents", "When an instruction would look arbitrary, give the reason in one clause."
- Why: A `Never` rule with no reason. The reader does not know what happens if the line goes.
- Rewrite: "Never remove the line of a database view or the line of a child page from a page's text, because [state the result, for example that Notion removes the view or the page]."
- Question for the owner: What does Notion do when that line is removed? I could not confirm it from the files.

Low (1): `:26` "other sessions on this Mac".

### `notion-tools/.../references/ntn-commands.md`

**NC-1. `:70`. Medium.** Text: "`{{CURRENT_STATE_PAGE_ID}}`, `{{GLOSSARY_PAGE_ID}}` | Those pages | `PROJECT.md`"
- Standard: "Words and names", "Be specific."
- Why: "Those pages" has no earlier subject.
- Rewrite: "The ids of the Notion pages named "Current state" and "Terminology glossary"".

**NC-2. `:99`. Medium.** Text: "More than 100 rows come in pages, as `SKILL.md`, section "Any Notion write", says."
- Standard: "Words and names", "Be specific."
- Why: "Pages" can mean Notion pages or pages of results.
- Rewrite: "A query returns at most 100 rows at a time, as `SKILL.md`, section "Any Notion write", says. When `has_more` is true, send the same query again with `"start_cursor": "<next_cursor>"`."

Low (6): `:16` and `:165` the heading "Ids" (use "Notion IDs"); `:188` "text piece" (use "rich-text object"); `:45` "on every Mac" (the tests also run on Windows); `:63` the sentence holds two clauses with "which is"; `:119` points to a rule and does not give it; `:143` "has its blocks".

### Files with no finding above

`memory-process/.../SKILL.md` has only Low findings. `memory-local/memory/CLAUDE.md` holds one line, `@AGENTS.md`. The two Notion assets, `concept-record.md` and `current-state.md`, hold only blank prompts.

## Patterns

1. **The bare name for the project's Current State.** 14 lines in 7 files use "Current state" for the project's page, which is the work item's field name. Examples: `memory-local/memory/CURRENT_STATE.md:1`, `memory-local/memory/MEMORY.md:21`, `memory-notion/.../memory-store.md:8` (and `:29`, `:31`, `:74`, `:77`). The others are in `current-state-page.md`, `database-layout.md:33`, `searching.md:12`, and `tidying.md:156`. The Notion page is really titled "Current state", so the prose needs a clause that says which one. The lines "read its Current state" in `current-state.md:58` and in the Hindsight rule are correct, because they speak of a work item.
2. **"The procedure that asked for it".** 3 lines: `memory-local/.../memory-store.md:59`, `memory-notion/.../memory-store.md:44` and `:45`. The reader cannot see a "procedure". Use "the skill or step that asked for the save".
3. **"Header" for the front matter.** 16 lines in `memory-local/`. "Front matter" is the common word and the template already uses it.
4. **History in an instruction.** 8 places: "the layout that was used before the current folder layout" (5 in `memory-notion/`), `folders-and-files.md:45`, `record-format.md:66`, and `tidying.md:99`. A new reader cannot place the earlier layout. Say "a project set up with an older toolkit".
5. **Abbreviations and section names with no place.** "DEC" and "SRC" as nouns (5 lines: `saving.md:94`, `saving.md:161`, `record-format.md:66`, `record-format.md:83`, the template `:34`); "Questions and Answers" (`finding.md:17`); "Recent History" (`finding.md:27`); "Project map" (`memory-process.md:58`, `memory-criteria.md:67`, `hindsight-memory.md:27`).
6. **The system acts and the sentence hides it.** 5 lines: `finding.md:18`, `memory-notion/.../memory-store.md:31`, `tidying.md:110`, `MEMORY.md:5`, `current-state.md:89`. Name the hook.
7. **A label and a colon in place of a sentence.** 6 lines in `hindsight-memory.md:28` to `:33`. Example: "Now: one line per active piece of work, at most 5." (H-7).
8. **The same rule in several files.** The five parts of the project's Current State and their line limits are in four places: `current-state.md`, `memory-local/memory/CURRENT_STATE.md` (guide at `:3`), `memory-notion/.../assets/current-state.md`, and `hindsight-memory.md:28` to `:36`. The rule for the `work_items` field is in the template (`:20`), `record-format.md:97` to `:109`, and `memory-store.md:63`. The size limit of a memory file is in `folders-and-files.md:50` and `database-layout.md:96`. Each copy must change together. The Hindsight project has no skill, so its copy has a reason. The others are a risk of drift.
9. **Counts where the agent could judge.** These are questions for the owner, under the rule "Do not put a count or a limit where the agent should use its judgment": "two or more sessions" (`saving.md:80`, `tidying.md:119`), "30 days" (`saving.md:59`), "six months" (`tidying.md:88`), and "about 20 sections or 300 lines" (`folders-and-files.md:50`). The line limits of the five parts of the project's Current State are rules, so I do not question them.

## Layout

### `memory-hindsight/.claude/rules/hindsight-memory.md`

Headings as they are: the title "Hindsight Project Memory", then 19 bullets, then "The project's Current State".

Headings I propose, in order, with the bullets (by line) under each:
1. Hindsight Project Memory (keep; add the opening in H-1)
2. What Hindsight holds and what it does not (`:5`, `:6`, `:8`, `:16`, `:17`)
3. How to search, save, and file (`:7`, `:9`, `:10`, `:14`)
4. Correcting, deleting, and cleaning up (`:11`, `:12`, `:13`)
5. Secrets and the API key (`:15`, `:23`)
6. The bank and its settings (`:18`, `:19` to `:22`)
7. The project's Current State (keep)

### `memory-local/memory/AGENTS.md`

As they are: "memory/: what a later session needs and no other file holds", "Files", "What never goes in memory", "What must stay true", "Which skill to use".
Proposed: "The memory/ folder", "Files", "What never goes in memory", "The rule and the check for this folder", "Which skill to use". Move `:22` ("A memory record may name a record outside memory by its ID") out of "What never goes in memory" into "Files".

### `memory-local/memory/project_topic_template.md`

As it is: one comment of about 2,700 characters on one line.
Proposed: split the comment into numbered steps, one instruction on each line: (1) copy and name the file, (2) set the front matter fields, (3) write the `work_items` entries (TP-1), (4) write the body sections, (5) keep "Gotchas and lessons" last, (6) remove both comments.

### `memory-notion/.../references/views-and-layout.md`

As they are: "Views", "Property order and page layout", "The schema files".
Proposed: "Views", "Pinned properties, sections, and hidden properties of each database" (one list for each database, VL-1), "How to set the page layout in the Notion app" (the five clicks at `:36` to `:42`), "Schema files". The five clicks are a procedure and the table is a reference, so they should not share one section.

### `memory-notion/.../references/searching.md`

As it is: three notes, then "Contents", then the sections.
Proposed: put "Contents" before the three notes, as in the other reference files.

### `memory-notion/.../references/database-layout.md`

Rename "What is not written" to "Parts of the layout that get no new content". All other headings say what is under them.

## Questions for the owner

1. `saving.md:72` and `:163`: Where does a lesson go when the owner agrees to keep it for the whole project? I read "a rule".
2. `saving.md:160`: Does "in place of this project's file" mean "instead of" or "as well as"?
3. `hindsight-memory.md:13`: Does the list for the owner hold every wrong memory?
4. `writing-pages.md:141`: How many days does Notion keep a trashed page?
5. `using-notion-cli/SKILL.md:44`: What does Notion do when the line of a view or child page is removed?
6. `folders-and-files.md:50`: Should the size of a memory file be a count?
7. `notion-records.md:9`: Should the field rule also name the work item fields?
8. Hindsight uses "a memory" for its own object, and the word list says "memory record". Keep "a memory" in the Hindsight rule, because Hindsight uses that word?
