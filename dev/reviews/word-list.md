# Word list for the toolkit's instruction files

Work item TKV-24. Made 2026-10-06 from a scan of 162 files: every `.md` file under `plugins/toolkit/skills/` and the four hook commands, with `salesforce/tools/` left out.

This list gives one answer for each made-up word, so that every file changes the same way. A word is made up when a dictionary does not have it, or when it has its own meaning only in this project. The rule for each word, in this order: say it in plain words; when that does not work, use a name the reader can already see, such as a folder name or a field name; keep the word only when both fail, and then explain it once where the reader first meets it. The rule is `document-clarity-standard.md`, the one place for the writing rules; the `writing-harness-files` skill holds an exact copy of it, `references/writing-rule.md`.

In the Choice column, P means plain words, N means a name the reader can see, and K means keep the word and explain it once. The last column says what else changes when a tool, a template, a heading that another file cites, or a skill description uses the word.

A writer who meets a made-up word that is not in this list adds a row in the same change.

## 1. The word list

| Word | Means | Choice | Use instead, or the explanation | Files / lines | Exact string: what else changes |
|---|---|---|---|---|---|
| record | one saved thing with an ID | K | Each file says which: source, `DECISIONS.md` entry, rule, memory record | 95 / 487 | No |
| item (alone) | a work item | P | "work item" | 77 / 575 | 5 descriptions, `dev/SKILL-INDEX.md` |
| State, Status | the step a work item is in; its short summary | N | Keep both; elsewhere say whose status | 69 / 219 | Template fields, Notion properties, GitHub labels |
| tracker, work tracker | where the work items are kept | P | "where the work items are kept" | 62 / 147 | Skill name and "Tracker:" line stay |
| Current state | the five lines at the top of a work item | N | "the work item's Current state" | 48 / 116 | Template; `check-skills.mjs` compares its Next action text |
| top-level item, sub-item, level | a work item with no parent; one inside another | K | Keep; explain once | 44 / 173 | Heading "Levels", cited 14 times |
| Mark | the word on a rule: Draft, Approved, Built, Retired | N | Keep for rules only | 42 / 82 | Read by `validate-records.mjs` |
| phase | a project phase groups work items; a work item's phase groups tasks | K | Never alone: say which | 38 / 246 | Notion property |
| Current State | the project's one short page of what is true now | K | Keep; explain once | 36 / 103 | File, Notion page, `session-start.mjs`, tests |
| original | anything the project was given and keeps | N | "source" | 36 / 67 | 3 descriptions; one cited heading; text two hooks print, with tests |
| main checkout | the project's main folder: the first path `git worktree list` prints | K | One name; drop "main project folder", "base worktree" | 36 / 118 | Hook text, tests |
| Gotchas | mistakes that are easy to make | P | "Mistakes to avoid" | 31 / 50 | Memory heading "Gotchas and lessons" |
| helper | a separate agent started for one job, which sees only its instructions | K | Keep | 28 / 105 | No |
| project task | a task that belongs to no work item | K | Keep | 28 / 63 | `PROJECT-TASKS.md`, PT- IDs |
| lesson | something the work taught that is not proven yet | K | Keep | 28 / 68 | Template heading |
| proposed, replaced, retired | a memory record not approved; replaced by another; no longer used for answers, and kept only as history | P | Keep; each storage file maps them once to its stored values | 27 / 52 | `status:` values the hook reads; Lore's names |
| Waiting on, and the other four parts of Current State | who owes what | N | Keep; add "in Current State" | 25 / 58 | Template, Notion page, tests |
| home | the place a kind of information is kept | P | "the place where it is kept" | 24 / 100 | One heading cited 5 times; one description |
| a memory, memories | a memory record | P | "memory record" | 23 / 63 | No |
| brief, job block | a helper's instructions; its filled-in inputs | N, P | Keep "brief"; "the list of inputs" | 23 / 41 | Six file names, one heading |
| lives, lands, wins, fresh | is kept; is merged; is used; read again | P | Those verbs | 21 / 47 | No |
| proposal | a save the owner has not said yes to | K | Keep | 20 / 46 | Reply line, index prefix |
| Hand-offs, hand to | work another skill does | P | "Work that another skill does"; "give", "ask" | 19 / 22 | Cited twice |
| host | Claude Code or Codex | P | Name them | 16 / 26 | No |
| concept | the subject of a memory record | P | "subject" | 16 / 54 | `concept-record.md` |
| moves up, Moved up | the owner agreed to keep it for the whole project | P | That clause; field name in part 2 | 16 / 38 | Template, `validate-records.mjs`, tests |
| bank, Lore | one project's Hindsight store; the Notion memory layout | N | Keep; explain once | 13 / 85 | Lore's names |
| setup copy, scratch folder, piece | the finished files in a temporary folder; a file or folder | K, P | "setup copy" only; "file or folder" | 12 / 81 | One cited heading |
| checker | the separate agent that tests the result | K | Keep | 12 / 26 | One file name |
| record check | the command that checks the records | N | "`.claude/hooks/validate-records.mjs`" | 11 / 24 | The command prints it; one test |
| one-home layout | the current folder layout | P | "the current folder layout" | 11 / 43 | `one-home-layout.md` |
| closing step, closing question | closing a work item | P | "`running-work-item-lifecycle` is closing a work item" | 10 / 13 | `validate-records.mjs` prints it |
| blank form | a template | N | "template" | 10 / 20 | No |
| prune, tidy | remove lines no longer true; clean up | P | Those words | 10 / 15 | `session-start.mjs` prints "Prune" |
| pointer | a record's ID in a work item | N | "the record's ID in the work item" | 8 / 15 | No |
| onboarding, trusted | ask before an inferred save; save sourced facts unasked | N | Keep as "Memory approval" values; never for setup | 8 / 11 | `PROJECT.md` line |
| delivered (a rule) | a work item built it | N | "built what the rule says" | 7 / 12 | No |
| filing test | the test in "Where information goes" | N | "the test for that" | 6 / 6 | `prompt-reminder.mjs` prints it |
| "This skill holds the process" | an author's rule | P | Say what the skill is for | 6 / 6 | No |
| lasting | needed by the whole project | P | "information the whole project needs" | 5 / 10 | One description |
| folder guide, main guide | an `AGENTS.md` | N | "the folder's `AGENTS.md`", "the root `AGENTS.md`" | 5 / 8 | No |
| save worktree | the folder `publish-docs` makes to commit a document change | K | Keep; drop "save workspace" | 4 / 16 | No |
| harness file | a skill, a rule, or an agent guide | K | Keep | 3 / 8 | Skill name |
| rests on | is based on | P | "is based on" | 3 / 4 | `DECISIONS.md` comment |
| run row | a row in the Runs table | N | "a row in the Runs table" | 2 / 3 | No |

"The model" appears only for a language model.

## 2. One word where the files used several (decided 2026-10-06)

The owner chose the first two. The orchestrator chose the rest with the owner's rule: plain words first, then a name the reader can already see, and a made-up word only as the last choice.

| Subject | Use | Do not use | Why |
|---|---|---|---|
| One run of work with the agent | "session"; explain it once in a file the owner reads as "one chat with the agent" | "chat", "conversation" | The owner's choice. Claude Code and Codex use this word, and the reader sees it in names such as the session-start hook. |
| The project's one short page, and the five lines at the top of a work item | "the project's Current State" and "the work item's Current state"; never the bare name | A new name for either | The owner's choice. No existing project or work item has to change. |
| The owner agreeing to something | "the owner's yes" | "OK", "approval", "go-ahead", "permission", except in a field name or a quoted string | 47 files already use it. |
| The owner | "the owner" | "he", "his", "him" | Another owner may read the file. A quotation of the owner stays word for word. |
| The four sorts of memory record | "type" | "kind" | The file field is `type`. Notion's "Kind" column is a different thing. |
| Keeping a change | "save" for a work item or a memory record; "commit with `publish-docs`" for a project document | "publish" as a verb for either | The reader sees `publish-docs` only as the name of the skill. |
| The field "Moved up" in a work item | Keep the field name; say in words "the owner agreed to keep it for the whole project" | "moves up" as a verb | The checking command and existing work items read the field. |
| `needs-review` and `superseded` in a memory file | Keep the stored values; the process skill says "proposed" and "replaced", and each storage file maps them once | New stored values | A hook command and existing files read them. |
| Lessons | Keep both headings as they are: "Lessons not proven yet" in a work item, and "Gotchas and lessons" in a memory record | A new name for either heading | Both are exact text: a search command and existing work items and memory records read them. Prose may say once what the section holds. |
| A section of mistakes that are easy to make | "Mistakes to avoid" | "Gotchas" | A plain heading that names what is under it. |

## 3. Words to leave alone

A few words at first use in a file the owner reads: worktree, default branch (drop "base branch"), front matter, fast-forward, hook, sandbox, manifest. None needed: commit, branch, pull request, merge, repository, deploy.

## 4. Order of work

Made-up words per 100 lines; "item" alone is most of the count in the first six.

1. lifecycle `closing.md` (73)
2. `work-items/AGENTS.md` (64)
3. `using-work-tracker/SKILL.md`, local (59)
4. the same, Notion (54)
5. `running-work-item-lifecycle/SKILL.md` (54)
6. local tracker `folders-and-files.md` (47)
7. `memory-criteria.md` (43)
8. lifecycle `designing.md` (41)
9. `using-memory-store/SKILL.md`, local (40)
10. lifecycle `deploying.md` (40)
11. `one-home-layout.md` (39)
12. `curating-project-memory/SKILL.md` (37)
13. `using-work-tracker/SKILL.md`, GitHub (37)
14. `using-memory-store/SKILL.md`, Notion (36)
15. `keep-work-item-current.md` (35)
