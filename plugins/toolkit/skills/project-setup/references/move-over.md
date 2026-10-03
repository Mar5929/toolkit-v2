# Moving a project to Toolkit V2

Purpose: bring a project that was set up another way onto Toolkit V2. Take
the owner's choices, read what the project holds, show one list of what
will be deleted, added, updated, and kept, and act only after his yes.

Two results must hold at every step:

- Nothing of the owner's is lost. "His" means every file the old toolkit
  did not write, and every line in an old toolkit file that the old toolkit
  did not ship.
- Nothing changes, in the project or outside it, before his yes to the
  list. Until then you write only in your scratch folder.

## Contents

- Which earlier setup it is
- 1. Look, and take his choices
- 2. Read what the project holds
- 3. Sort every piece
- 4. Show the list
- The list template
- 5. After his yes
- 6. Carry over the old records
- 7. Finish

## Which earlier setup it is

`SKILL.md`, "Pick the path", lists the files that send a folder here. Look
in the main checkout, the first path `git worktree list` prints:
Git-ignored folders such as `.work-items/` exist only there. Use the first
row that fits, and name it in your one line about the path:

| The folder holds | It was set up by |
| --- | --- |
| `.work-items/`, `knowledge/knowledge-manual.md`, `knowledge/memory/`, `.claude/toolkit-sync.md`, `.claude/RULES.md`, `.toolkit-memory.json`, `.system-guide.json`, or a name ending in `@claude-toolkit` set to `true` under `enabledPlugins` in `.claude/settings.json` | The older claude-toolkit |
| `.toolkit.json` | The retired `toolkit` program |
| None of the above | The owner or an agent, by hand |

## 1. Look, and take his choices

Do these in order.

- **Look.** Run the checks in `interview.md`, "Look before asking", down to
  the Salesforce row. They stop a folder with no Git repository, a folder
  inside another repository, and a session in a linked worktree.
- **An unfinished move.** `git branch --list 'claude/toolkit-v2-move-*'`
  prints a branch: an earlier move stopped before it landed. Say so in one
  line, and ask whether to continue it: another session may still be
  working there. After his no, stop and change nothing. After his yes,
  continue in that branch's worktree. Take
  the choices from "Toolkit settings" in that worktree's `PROJECT.md` when
  it is filled; otherwise ask again. Do steps 2 and 3 again, reading the
  files Git tracks in that worktree and the Git-ignored folders in the main
  checkout. Show the list again with each line marked "done" or "not done":
  a new session cannot see his earlier yes. After his yes to the list,
  carry out only the lines that are not done.
- **The plan tool.** Put steps 1 to 7 in the plan tool, and record each
  choice as a checked line, as `SKILL.md` says for a new project.
- **The old hooks.** The old setup's hooks still run in this session until
  the move lands. When one asks you to save knowledge, record a review, or
  open an old skill (`knowledge-save`, `work`), it is not part of the move:
  open no skill it names, run no command it names, and write no file for
  it. Tell him in one line when a hook blocks a reply.
- **What he said.** Write down, in his words, each thing he already said he
  wants or does not want from Toolkit V2. Confirm a choice he already gave
  in one line; never ask it again. A wish that is not one of the five
  choices:

  | His wish | Where it goes |
  | --- | --- |
  | Keep something he has | A "Kept untouched" line |
  | Leave out or change a Toolkit V2 piece | A "Your call" line that says what stops working without the piece |
  | An instruction for how the agent works | `.claude/rules/owner-preferences.md`, as `finishing.md` says ("Instructions he gives during setup") |

- **The questions.** Ask each question of `interview.md` (Questions 1 to 5)
  that he has not answered, one per message. Recommend from what the
  project has:

  | The project has | Recommend |
  | --- | --- |
  | Old work items in local folders (`old-toolkit-pieces.md`, "Old records") | Work items in local folders, with the ID prefix the old items use |
  | A root `AGENTS.md` that names GitHub Issues or a GitHub project board as its tracker | Work items in GitHub Issues |
  | `knowledge/memory/` | Local memory. Tell him before he answers: the old memory was committed to Git, so it reached his other computers; Toolkit V2 local memory is Git-ignored and stays on this computer. Memory in Notion or Hindsight is readable from every computer. |
  | `.toolkit-memory.json` that names `hindsight` | Hindsight memory |
  | `.toolkit-memory.json` that names another service | Tell him Toolkit V2 does not offer that service, and ask question 3 |
  | `SOUL.md` | Yes: his file stays as it is |

  Skip "The plan to confirm" in `interview.md`: the list in step 4 is the
  plan.

## 2. Read what the project holds

Every command here only reads. Run each alone, from the main checkout.

| Read | With |
| --- | --- |
| What Git tracks, what it does not, and what it ignores | `git ls-files`, then `git status --short --ignored` |
| The agent files | `find .claude .codex .agents -type f -not -path '.claude/worktrees/*' 2>/dev/null` |
| The settings | `jq . .claude/settings.json`, `jq . .codex/hooks.json`, and `cat` on `.codex/config.toml` and `.mcp.json`, each when present |
| The Git hooks of this copy | `ls "$(git rev-parse --git-path hooks)"`, leaving out names that end in `.sample` |
| The old toolkit's own copy | `old-toolkit-pieces.md`, "The old toolkit's own copy" |
| The old records, with a count for each status | `old-toolkit-pieces.md`, "Old records" |
| The Toolkit V2 files for his choices | Build the setup copy as steps 4 and 5 of "New project" in `SKILL.md` say (`setup-copy.md`, `skills-hooks-settings.md`), then `rsync -rcni <copy>/ ./` |

- Building the setup copy writes only in the scratch folder.
- In the `rsync` output, `>f+++++++` is a file the project lacks, and any
  other `>f` line is a file both have with different content.
- A file with uncommitted changes that the list would update or delete:
  put it under "Your call". Recommend that he commits it first, because
  the changes are made from the last commit. Never commit, stash, or
  discard his changes yourself.
- A repository with no commit yet: Git can bring nothing back. Say so in
  the first lines of the list, and mark every Delete line "cannot be
  brought back".

## 3. Sort every piece

Every file Git tracks, every other file Git does not ignore, every old
toolkit piece or old record that Git ignores, and every Git hook of this
copy goes under exactly one line of the list. Use the first row that fits:

| The piece | Part of the list |
| --- | --- |
| A file of the setup copy that the project lacks | Add |
| An old record (`old-toolkit-pieces.md`, "Old records") | One Update line per kind (step 6): the count for each status, how many are carried over, and that the old folder stays as it is. No "Kept untouched" line. |
| A piece `old-toolkit-pieces.md` marks Delete | Delete |
| A piece `old-toolkit-pieces.md` marks Carry | Update: the line names where his words go |
| A piece `old-toolkit-pieces.md` marks Compare, and it is an unchanged copy | Delete when Toolkit V2 has nothing of that name; Update ("replaced by the Toolkit V2 version") when the setup copy holds a file of that name |
| A piece marked Compare that differs from the old toolkit's copy | Read the difference. Use your judgment: a line that names this project's own things (its orgs, people, folders, dates, a section about this project) or that the owner signed is his. At least one differing line is his: Update, quoting his lines and naming where each goes (below); after each is read back there, the file is removed or replaced as an unchanged copy would be. No differing line is his: treat it as an unchanged copy. You cannot tell: "Your call". |
| A piece marked Compare, with no copy to compare it with | "Your call": recommend keeping it until he has read it |
| Root `AGENTS.md` | Update: built new as `update.md` says ("Updating AGENTS.md", the second case, steps 1 to 5), in place of the `AGENTS.md` row in `placing-files.md`. He sees the whole new file before it is written. |
| Any other file the project and the setup copy both have, with different content | Update, by the table in `placing-files.md`, step 3. A settings file gets one Update line that says which entries are removed, added, and kept. |
| His own rule, skill, hook, agent, output style, or folder instruction file | Kept untouched. When it names an old path, rule, or skill (`knowledge/`, `.work-items/`, a row of `old-toolkit-pieces.md`), put it under "Your call" instead: recommend changing those names to the Toolkit V2 ones, and give the count. |
| Everything else: code, documents, client files, data, his own settings | Kept untouched |
| Anything you cannot place | "Your call" |

Where his lines from an old toolkit file go:

| His line | New place |
| --- | --- |
| An instruction for how the agent works with him | `.claude/rules/owner-preferences.md`, one list line in his words, as `finishing.md` says ("Instructions he gives during setup"), with the old file as its source |
| A fact about the project: a system, an org, a person, a path | The matching section of `PROJECT.md` |
| A rule only this project has, such as a safety line about its own orgs or data | One new rule file of the project's own in `.claude/rules/`, named for the project, so the Toolkit V2 rule files stay as the toolkit ships them |

## 4. Show the list

Show the whole list in one message, from the template below.

- Every line names the thing and gives one reason, in one line.
- Files of one kind with one reason share a line that gives the count and
  the names.
- A Delete line says what Toolkit V2 has in its place, or "nothing takes
  its place". A Delete line for something Git does not track ends "Git
  does not track it, so it cannot be brought back."
- A "Your call" line holds the question and your recommendation.
- Name what will be made outside the folder with the sentences in
  `interview.md`, "The plan to confirm".
- The last line is exactly: "Shall I make these changes?"

His answer:

- A plain yes covers every Delete, Add, and Update line as shown. It
  covers a "Your call" line only when your recommendation leaves the thing
  as it is. Every other "Your call" line stays untouched until he answers
  that line.
- He may answer by line ("yes, but not D3", "Q2: keep mine"). A line he
  turns down stays as it is.
- When he changes a choice, build the list again and show it again.
- Anything that is not on the list needs its own yes.

## The list template

```text
Moving <project name> to Toolkit V2

Your choices: work items in <place> (ID prefix <prefix>); memory in <place>; Salesforce <yes or no>; SOUL.md <yes or no>.
You also said: <each wish in his words, or "nothing else">.
Nothing changes until you say yes. Nothing of yours is deleted.

Counts: delete <n>, add <n>, update <n>, kept <n>, your call <n>.

Delete: old toolkit pieces that Toolkit V2 replaces or does not need
| # | What | Why |
| D1 | `.claude/hooks/memory-reminder.mjs` | The old memory reminder. `prompt-reminder.mjs` takes its place. |

Add: new Toolkit V2 files
| # | What | Why |
| A1 | 12 skills in `.claude/skills/`: <names> | The skills for your choices. |

Update: things you have that change
| # | What | Why |
| U1 | `AGENTS.md` | Rebuilt in the Toolkit V2 layout. <n> lines of yours are carried over; you see the new file before it is written. |
| U2 | `.claude/settings.json` | <n> old hook entries removed, <n> Toolkit V2 entries added, your <n> other entries kept. |
| U3 | <n> old work items in `.work-items/` (<n> In Progress, <n> Done) | <n> that are not finished are carried over to <place> in the Toolkit V2 form. The old folder stays as it is. Not carried over: <fields>. |
| U4 | `.claude/rules/<name>.md` | A rule from the old toolkit, with 2 lines of yours: "<line>", "<line>". Your lines go to `owner-preferences.md`; then the Toolkit V2 version replaces the file. |

Kept untouched
| # | What | Why |
| K1 | `src/`, `tests/` | Your code. |

Your call: I will not guess these
| # | What | Question | Recommended |
| Q1 | `.claude/rules/<name>.md` | The old toolkit has no rule of this name, and it names old toolkit skills. Is it yours? | Keep it, because I cannot tell who wrote it. |

Outside this folder: <each thing that will be made, or "nothing">.
Could not check: <what, and why, or "nothing">.

Shall I make these changes?
```

The rows show the form of a line. Write the real rows, and leave out a
part's table when the part is empty, keeping its heading with "None."

## 5. After his yes

Do these seven points in order, so nothing is removed before what replaces
it is in place.

1. **Worktree.** Make your own worktree and branch, as `update.md` says
   ("Before you start", the third bullet), named
   `toolkit-v2-move-<YYYY-MM-DD>` and `claude/toolkit-v2-move-<YYYY-MM-DD>`.
   Change the files Git tracks only there. `memory/`, `work-items/`, and
   the old Git-ignored folders are changed in the main checkout. A
   repository with no commit yet has no worktree: work in the main
   checkout.
2. **Add.** Copy the missing files. Into the worktree:
   `rsync -rlt --ignore-existing --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/`.
   Into the main checkout: only `<copy>/memory/` and `<copy>/work-items/`,
   when his choices have them, with the same `rsync -rlt --ignore-existing`.
   The main checkout ignores these two folders only after the branch
   lands: stage nothing in them, and run the final check on them after
   landing.
3. **Update.** Carry out each approved Update line. Merge settings with the
   merge rules in `skills-hooks-settings.md`. Put each line of his in its
   new place and read it back there.
4. **Services.** Step 7 of "New project" in `SKILL.md`.
5. **Records.** Step 6, "Carry over the old records".
6. **Delete**, last. Remove only what an approved Delete line names.
   - Before each one, check that the file is still as it was when you
     listed it. A file that changed since then stays: ask again.
   - A file Git tracks: `git rm`. Any other: `rm`, with the exact path
     from the list.
   - A hook command and its settings entry go in the same step.
   - A guard goes only after its replacement is in the settings and the
     replacement's own check has passed.
7. **Check.** `git status --short` in the worktree lists only paths that
   are on approved lines. Any other path: put it back with
   `git restore <path>` and tell him.

## 6. Carry over the old records

The old records stay where they are, unchanged, except as points 5 and 7
below say. A carry-over writes a new record in the Toolkit V2 form.

1. What the list offers by default:
   - work items that are not Done or Cancelled, archived ones included;
   - with local folders, also the old item with the highest number,
     whatever its status, so new IDs continue above every old ID;
   - memory topic files whose status is `current` or not set, and the
     glossary.

   Finished work items and superseded or retired memory stay where they
   are. He may change any of this on the list.
2. Before you write a record, search the new place for "Carried over from
   `<its old path>`". A record that is already there is not written again.
3. Write the first work item, mapped as `old-toolkit-pieces.md` says ("Old
   work item to Toolkit V2 work item"), and read it back. Show it to him
   and ask: "Is this the right form? I'll carry over the other <n> the same
   way." After his yes, do the rest. For a move-over, this takes the place
   of the preview of every record in `update.md`, "Changing a setup
   choice".
4. Do the same for memory, with "Old memory to Toolkit V2 memory": the
   first record, his yes, then the rest. Each record's source line reads
   "Carried over from `<its old path>`", once for each old file whose
   facts it holds.
5. Old records that already sit where the new ones go (issues in the same
   GitHub repository, pages in the same Notion database, a root
   `work-items/` or `memory/` folder with files of his) are not copied.
   They are a "Your call" line: recommend bringing each open one to the
   Toolkit V2 form in place, and change nothing in them before he answers
   that line.
6. Add one line to `PROJECT.md`, under "Work and project records": "Old
   records, kept as history, read only: `<each old folder>`. Current work
   items and memory are under "Toolkit settings"." A folder named there is
   never offered for removal again.
7. An `AGENTS.md`, `CLAUDE.md`, or `README.md` that the old toolkit wrote
   inside a kept old record folder, and that tells agents to use the old
   toolkit, is an Update line. Its text becomes: "This folder holds old
   records, kept as history, read only. Current work items and memory: see
   "Toolkit settings" in the root `PROJECT.md`." A record is never
   rewritten this way.
8. Never delete an old record. When he asks later to remove an old folder
   that Git does not track, tell him it cannot be brought back, and remove
   it only after his yes to that exact folder.

## 7. Finish

1. Follow `finishing.md`. A fact that an old file shows (the old project
   facts file, his `AGENTS.md`) counts as a fact a file in the repository
   shows: use it, and list it in the report so he can correct it.
2. Run the final checks as `update.md` says ("6. Checks and report"). A
   check that fails only because of something on a "Kept untouched" line,
   such as a skill or folder of his own, is not a failure: say so in the
   report.
3. The report says what was deleted, added, updated, and kept, with the
   counts; what was carried over and what stayed; and his own steps. Add
   to the steps in `finishing.md`: on each other computer that has this
   project, pull the default branch and say "toolkit v2"; the update there
   lists that copy's old Git hook and removes it after his yes
   (`update.md`, "4. What the toolkit no longer ships").
4. Offer the commit, and land the branch after his yes, as `update.md`
   says ("6. Checks and report"). Until it lands, `PROJECT.md` is only in
   the worktree, so the main checkout still shows the old setup: step 1
   ("An unfinished move") finds it.
