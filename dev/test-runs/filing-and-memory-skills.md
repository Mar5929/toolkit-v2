# Filing and memory skills: checks after the rewrite (TKV-24)

Date: 2026-10-05. Branch: `claude/one-home-filing-memory`. Every command ran from the worktree root. "Seen" means the command ran here and printed the result shown.

Paths are short: `<assets>` is `plugins/toolkit/skills/project-setup/assets/`, and `<shared>` is `<assets>/every-project/.claude/skills/`.

## 1. The seven checks

| Check | Result | Seen |
| --- | --- | --- |
| `claude plugin validate .` | Validation passed | Yes |
| `claude plugin validate ./plugins/toolkit` | Validation passed | Yes |
| `claude plugin validate ./plugins/workstreams` | Validation passed | Yes |
| `claude plugin test ./plugins/workstreams` | 14 pass, 0 fail | Yes |
| `node dev/tools/check-skills.mjs` | 22 skills checked, 22 rows, passed, 0 errors, 0 warnings | Yes |
| `node dev/tools/check-rules.mjs` | Passed with 2 warnings, both on rule files this work did not change (`salesforce-org-safety.md` size, `session-handoff.md` paragraph length) | Yes |
| `node --test 'dev/tests/*.test.mjs'` | 42 tests: 41 pass, 1 fail | Yes |

The one failing test is `session-start, local: with no memory files the index is the model MEMORY.md byte for byte` (`dev/tests/hooks.test.mjs`, line 72). It did not fail before this work: a clean copy of commit `2fe33ca1` ran 42 of 42 (`git archive HEAD dev/tests <assets> | tar -x`, then the same command).

Why it fails: the test reads the starter `memory/MEMORY.md` and expects the session-start hook to write the same bytes back. The starter file now holds the pointer table, and the hook still replaces the file with its old index (the headings User, Project, Reference, Event, Decision). The hook and this test are not part of this work. Section 5 says what the hook must change. Until the hook changes, it overwrites the pointer table at every session start, so this change must not ship without the hook change.

## 2. Removed folders and old skill names

Command, with `$MINE` as the files this work owns (the six shared skills, the three memory skills, the two memory starter files, and `dev/build-shared/`), and the Notion schema files left out:

```bash
command grep -rnE 'project-wide-records|requirements/|system-guide|ai-external-knowledge|managing-work-items|tracking-work-items|managing-project-memory|storing-project-memory|managing-project-wide-records|"Project memory"|memory save skill|memory find skill|Memory approval' $MINE
```

Result: no line found (grep exit 1). Seen. A second search for a person's name (`Mike`) in the same files found none.

## 3. Four cases, walked through the text

Each step names the file and line that tells the agent what to do. These are a reading of the text, not a run in a live session.

### (a) The owner says "we decided each request belongs to one workspace" while two work items are open

| Step | Where it is written |
| --- | --- |
| The root guide sends "a decision reaches past one work item" to this skill | `<assets>/every-project/AGENTS.md`, "Which skill" (not this work) |
| Apply the filing test | `<shared>/filing-project-records/SKILL.md:8`, which points to the root guide |
| Open the reference for "Record a decision" | `SKILL.md:17` |
| Search `DECISIONS.md` first | `references/record-decision.md:7` |
| The owner gave the answer, so the Status is Decided | `record-decision.md:11-12` |
| Add the entry with the next DEC number; Why and Affects | `record-decision.md:15-17`; the form and the numbering are in `DECISIONS.md` |
| The entry says how the system must work, so it is also a rule | `record-decision.md:18`, then `references/update-system-doc.md:9-21` |
| One save for `DECISIONS.md` and the system document | `record-decision.md:19` |
| A pointer row in each of the two work items | `record-decision.md:20` |
| Tell the owner the DEC ID | `record-decision.md:21` |

### (b) The owner pastes a meeting transcript with no work item open

| Step | Where it is written |
| --- | --- |
| Open the reference for "File a source" | `<shared>/filing-project-records/SKILL.md:16` |
| Search the list first | `references/file-source.md:7` |
| Pasted text is kept in `sources/` | `file-source.md:9` |
| Next SRC number; save exactly as pasted | `file-source.md:11-13`; the file name and the numbering are in `sources/AGENTS.md` |
| The row, with "none yet" under "Used by" | `file-source.md:16` and `:32` |
| Save now | `file-source.md:17` |
| List for the owner what the transcript holds, and do what the owner chooses | `file-source.md:23-32` |

### (c) A closing work item delivered security rule SEC-03

| Step | Where it is written |
| --- | --- |
| The closing step hands over with the words "update a system document" | `running-work-item-lifecycle` (not this work) |
| Open the reference | `<shared>/filing-project-records/SKILL.md:18` |
| The three conditions for Built | `references/update-system-doc.md:28-31` |
| Change the mark to Built with the work item's ID | `update-system-doc.md:33` |
| Status, Changelog row, "Last changed via" | `update-system-doc.md:34`; what each Status and mark means is in `system/AGENTS.md` |
| Save | `update-system-doc.md:35` |
| Give the rule ID and the commit ID back to the closing step | `update-system-doc.md:36` |

### (d) The owner says "remember that the client's fiscal year starts in February"

| Step | Where it is written |
| --- | --- |
| Find the fact's home with the root table | `<assets>/memory-process/.claude/skills/curating-project-memory/SKILL.md:16`. The root table gives `PROJECT.md` for a stable fact about the project. |
| Put the fact in its home; the owner's request is the yes | `SKILL.md:17`. The root guide's row for `PROJECT.md` says how it is saved. |
| Two homes fit (for example a glossary term): ask one question | `SKILL.md:19` |
| No pointer, because a line in `PROJECT.md` has no ID | `SKILL.md:20-22` and `:25` |
| Tell the owner where the fact is | `SKILL.md:23` |

### Is a step stated twice?

- No step of the four cases is written in two of these files, with one exception by design: each reference names `publish-docs` for its own save (`record-decision.md:19`, `file-source.md:17`, `update-system-doc.md:22` and `:35`). None of them describes the save.
- The forms are not copied: the entry form stays in `DECISIONS.md`, the row and file name in `sources/AGENTS.md`, and the document, rule, mark, and glossary forms in `system/AGENTS.md`.
- Two lines in `curating-project-memory/SKILL.md` say what the folder guide `memory/AGENTS.md` also says for a project with local memory: the list of what never goes in memory (line 12), and which skill decides each Current State line (lines 51 to 55). A project with Notion memory has no `memory/` folder and so no folder guide, and the process skill may not name a storage file. The same reason puts the form of Current State in the Notion skill's `references/current-state-page.md`.

## 4. Lines per skill, before and after

Counted with `wc -l`, Notion schema files left out. "Before" is commit `2fe33ca1`.

| Skill or files | Before | After |
| --- | --- | --- |
| `filing-project-records` | 350 lines in 11 files | 166 lines in 4 files |
| `curating-project-memory` | 376 lines in 6 files | 92 lines in 1 file |
| `using-memory-store` (local) | 322 lines in 4 files | 61 lines in 1 file |
| `using-memory-store` (Notion) | 630 lines in 10 files | 449 lines in 8 files |
| `handoff` | 344 lines in 4 files | 345 lines in 4 files |
| `publish-docs` | 228 lines in 2 files | 232 lines in 2 files |
| `session-summary` | 97 lines | 98 lines |
| `braindump` | 45 lines | 45 lines |
| `explain-simply` | 75 lines | 75 lines (not changed) |
| Starter files in `memory/`, without `AGENTS.md` and `CLAUDE.md` | 118 lines in 5 files | 25 lines in 2 files |
| `dev/build-shared/helper-briefs/handoff-verifier.md` | 99 lines | 100 lines |

After, per file:

| File | Lines |
| --- | --- |
| `filing-project-records/SKILL.md` | 37 |
| `filing-project-records/references/record-decision.md` | 46 |
| `filing-project-records/references/file-source.md` | 36 |
| `filing-project-records/references/update-system-doc.md` | 47 |
| `curating-project-memory/SKILL.md` | 92 |
| `using-memory-store/SKILL.md` (local) | 61 |
| `using-memory-store/SKILL.md` (Notion) | 60 |
| Notion `references/current-state-page.md` | 36 |
| Notion `references/writing-pages.md` | 65 |
| Notion `references/searching.md` | 40 |
| Notion `references/database-layout.md` | 185 |
| Notion `references/views-and-layout.md` | 49 |
| Notion `assets/current-state.md`, `assets/terminology-glossary.md` | 7 and 7 |
| `handoff/SKILL.md` | 128 |
| `handoff/assets/handoff-prompt-template.md` | 31 |
| `handoff/examples/handoff-example.md` | 86 |
| `handoff/references/handoff-verifier.md` | 100 |
| `publish-docs/SKILL.md` | 167 |
| `publish-docs/references/recovery.md` | 65 |

## 5. What the session-start hook must change

File: `<assets>/every-project/.claude/hooks/session-start.mjs`. Not changed in this work.

The new form: `memory/MEMORY.md` is the list of pointers itself, one table row per pointer, written only by `using-memory-store`. No other pointer file exists, and the hook no longer builds anything.

1. Delete the constant `NEW_INDEX` (lines 13 to 17).
2. Replace the block "Local memory: rebuild the index" (lines 44 to 65) with a read and a print, and no write:

   ```js
   if (memory === 'local') {
     const pointers = read('MEMORY.md').trim();
     if (pointers) out.push('', 'Memory pointers (memory/MEMORY.md):', pointers);
   }
   ```

3. Remove `readdirSync` and `writeFileSync` from the import on line 6, and change the comment on lines 2 and 3: the hook prints `memory/MEMORY.md` and never writes it.
4. In `dev/tests/hooks.test.mjs`, the five tests of the rebuild go (lines 49 to 110), and the test of the 10,000-character limit (line 191) needs a long `MEMORY.md` in place of 200 memory files. New tests: the hook prints `MEMORY.md` unchanged, never writes it, and prints nothing extra when the file is missing.
5. Unchanged: reading `CURRENT_STATE.md`, the "Last updated:" date, the 40-line and 7-day prune request, and the Notion and Hindsight paths.

## 6. Sentences kept only because no check exists

Audit 2, section 6, proposes a check for each of these. No checking script exists, so each sentence stays.

| # | Sentence (short form) | File | Proposed check |
| --- | --- | --- | --- |
| 1 | An ID is yours only when its save is on the default branch; take the next ID when another save took it | `filing-project-records/SKILL.md:25` | V-01 |
| 2 | In each work item under Affects, add the pointer row | `record-decision.md:20` | V-25 |
| 3 | In the old entry, change two lines only: Status to Superseded, and "replaced by" | `record-decision.md:36` | V-03 |
| 4 | Save the original unchanged; never tidy, shorten, translate, or correct it | `file-source.md:12-13` | V-10 |
| 5 | Add the row to `sources/README.md` in the same edit | `file-source.md:16` | V-09 |
| 6 | Write the short name in lowercase words joined by hyphens | `file-source.md:12` | V-33 |
| 7 | Add the source's line to each work item that uses it | `file-source.md:18` | V-24 |
| 8 | Add the DEC ID under Open questions for a Draft rule; remove it when the entry is Decided | `update-system-doc.md:12`, `:18` | V-07 |
| 9 | Set "Last changed via" and the document's Status again | `update-system-doc.md:19`, `:34` | V-04, V-05 |
| 10 | Add one Changelog row | `update-system-doc.md:20`, `:34` | V-05, V-08 |
| 11 | Each file must be under the rule's paths and of a listed type; the refused files | `publish-docs/SKILL.md`, step 1 and "Refused files" | V-32 |
| 12 | Check that no row has the ID, and that the record exists, before adding a pointer | `using-memory-store/SKILL.md:45` (local), `writing-pages.md` (Notion) | V-27 |
| 13 | Remove each Current State line that is no longer true | `curating-project-memory/SKILL.md`, "Current State", step 2 | V-26 |
| 14 | A pointer whose record is gone: remove it | `curating-project-memory/SKILL.md`, "Clean up memory" | V-27 |

## 7. What other files must change so this text is true

| File (not part of this work) | Change |
| --- | --- |
| `session-start.mjs` and `dev/tests/hooks.test.mjs` | Section 5. |
| `<assets>/every-project/AGENTS.md`, row `memory/MEMORY.md` | Today: "The session-start hook writes it. Never edit it." New: `using-memory-store` writes it; the hook prints it. |
| `<assets>/memory-local/memory/AGENTS.md`, "Files" | The same change for `MEMORY.md`. The row "A pointer entry" becomes "one row of `MEMORY.md`". |
| `prompt-reminder.mjs` | Its hint says a decision goes in the work item first, and that words inside a pasted transcript are "source material for running-work-item-lifecycle". A decision more than one item needs, and an original, now go to `filing-project-records`. |
| `running-work-item-lifecycle` and the work item form | Hand over with the step names "record a decision", "file a source", "update a system document". The pointer to a decision is a Questions and Answers row that holds the DEC ID and its Status (`record-decision.md:20`). The source line under Notes, Sources holds the SRC ID (`file-source.md:18`). The closing step gives, for each rule it says was delivered: the rule ID, that the change is on the default branch, and that the result was approved; and it takes back the rule ID and the commit ID. Its line under Now in Current State goes through `using-memory-store`. |
| `.claude/rules/memory-review-and-save.md`, `session-handoff.md`, `cite-recalled-knowledge.md` | They still name the memory approval mode, "the memory save skill", proposals, and `requirements/`. The approval modes are gone from the memory skill. |
| `PROJECT.md` | The "Memory approval" line is no longer read by any skill. |
| `.claude/rules/hindsight-memory.md` | `handoff` and the starter `CURRENT_STATE.md` send a Hindsight project to this rule for the form and limits of Current State. It does not give them yet. |
| `.claude/rules/publish-project-documents.md` | Its `paths` list is now the one list of paths `publish-docs` may save. It still names `project-wide-records/AGENTS.md` in its last line. |
| `<setup>/references/notion-build/setup.md`, lines 121 and 122 | It still builds the "Terminology glossary" page, which nothing writes now. When that step goes, `assets/terminology-glossary.md` in the Notion skill can go too. |
| `<setup>/references/update.md`, line 89; `move-over.md` | They name `memory/terminology-glossary.md`, memory records, and a generated `MEMORY.md`. A project on the old layout has concept files, decision files, and a glossary in `memory/` (or pages in Notion): each fact must move to its home, and the three starter files deleted here must be removed from the project. |
| Notion schema file `07-memories-toolkit-columns.json` | Its column descriptions still say "<prefix>_<slug>". To show the date a pointer was created as a column, add a `created_time` property to Memories. Adding is allowed; nothing was added here. |
| `dev/SKILL-INDEX.md`, sections 2, 4, 8, and 9 | Text outside the skill rows still describes memory "kept by concept, like a wiki", "Project memory" in `AGENTS.md`, the five old assets of `filing-project-records`, and the old neighbor pairs. |
| `dev/tools/check-skills.mjs`, lines 81 and 82 | A comment about the five old assets of `filing-project-records`. No check is false, so the file was not changed. |

## 8. Where a toolkit guide and today's official page differ

- `dev/research/skill-writing-guide.md`, D4, says a description is at most 400 characters and that `check-skills.mjs` requires a "so" clause. The repository `AGENTS.md` and the script say under 500, and the script tests no "so" clause. The official pages give 1,024 characters (Agent Skills specification) and 1,536 in the Claude Code listing. The six descriptions written here are 411 to 483 characters.
- The same guide says new projects set `skillListingBudgetFraction` to 0.02. Today's Claude Code skills page says the listing budget is 1% of the context window by default, and that descriptions are dropped starting with the skills used least.
- No difference was found for frontmatter fields, the 500-line limit of `SKILL.md`, references one level deep, or the contents list for a reference over 100 lines.

## 9. Not done here

- The reviews by a separate agent that the repository rule asks for (wording, overlap, best practices) and the routing test in both hosts. Six descriptions changed, so the routing test must run again.
- No live session ran these skills. Section 3 is a reading of the text.
