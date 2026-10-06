# Moving a project to Toolkit V2

This file brings a project that was set up another way onto Toolkit V2. Open it when `SKILL.md`, "Which setup job to do", says that the folder has an earlier setup to move over. You take the owner's choices, read what the project holds, show one list of what will be deleted, added, updated, and kept, and act only after the owner's yes.

Two results must hold at every step:

- Nothing of the owner's is lost. What is the owner's is every file that the old toolkit did not write, and every line in an old toolkit file that the old toolkit did not ship.
- Nothing changes, in the project or outside it, before the owner's yes to the list. Until then you write only in your temporary folder.

## Contents

- Which earlier setup it is
- 1. Look, and take the owner's choices
- 2. Read what the project holds
- 3. Sort everything the project holds
- 4. Show the list
- The list template
- 5. After the owner's yes
- 6. Carry over the old records
- 7. Finish

## Which earlier setup it is

`SKILL.md`, "Which setup job to do", lists the files that send a folder to this file. Look for them in the main checkout, because Git-ignored folders such as `.work-items/` exist only there. The main checkout is the project's main folder, the first path that `git worktree list` prints.

Use the first row of this table that fits, and name that earlier setup in the one line in which you tell the owner which job this is:

| The folder holds | It was set up by |
| --- | --- |
| `.work-items/`, `knowledge/knowledge-manual.md`, `knowledge/memory/`, `.claude/toolkit-sync.md`, `.claude/RULES.md`, `.toolkit-memory.json`, `.system-guide.json`, or a name ending in `@claude-toolkit` set to `true` under `enabledPlugins` in `.claude/settings.json` | The older claude-toolkit |
| `.toolkit.json` | The retired `toolkit` program |
| None of the above | The owner or an agent, by hand |

## 1. Look, and take the owner's choices

Do these in order.

- **Look.** Run the checks in the table in `interview.md`, "Look before asking", from the first row down to the Salesforce row. Those rows find a folder with no Git repository, a folder inside another repository, and a session in a linked worktree, and the lists under that table say when to stop. A worktree is a separate folder with its own branch.
- **An unfinished move.** Run `git branch --list 'claude/toolkit-v2-move-*'`. When it prints a branch, an earlier move stopped before its branch was merged. Tell the owner so in one line, and ask whether to continue that move, because another session may still be working there.
  - After the owner's no, stop and change nothing.
  - After the owner's yes, continue in that branch's worktree, in this order:
    - Take the choices from "Toolkit settings" in that worktree's `PROJECT.md` when the section is filled. When it is not filled, ask for the choices again.
    - Do steps 2 and 3 again. Read the files that Git tracks in that worktree, and the Git-ignored folders in the main checkout.
    - Show the list again, with each line marked "done" or "not done", because a new session cannot see the owner's earlier yes.
    - After the owner's yes to the list, carry out only the lines that are not done.
- **The plan tool.** Put steps 1 to 7 of this file in the plan tool, and record each choice as a checked line. `SKILL.md`, "Which setup job to do", says for a new project which plan tool Claude Code and Codex each have, and gives the form of a checked line.
- **The old hooks.** The old setup's hooks still run in this session until the branch of the move is merged. An old hook may ask you to save knowledge, record a review, or open an old skill (`knowledge-save`, `work`). Such a request is not part of the move: open no skill that the hook names, run no command that it names, and write no file for it. When a hook blocks a reply, tell the owner in one line.
- **What the owner said.** Write down each wish that the owner already stated about Toolkit V2, in the owner's words: what the owner wants from it, and what the owner does not want.
  - The five choices are the answers to Questions 1 to 5 of `interview.md`. When the owner already gave one of them, confirm that choice in one line, and never ask for it again.
  - When a wish is not one of the five choices, this table says where it goes:

  | The owner's wish | Where it goes |
  | --- | --- |
  | Keep something the owner has | A "Kept untouched" line |
  | Leave out or change a part of Toolkit V2, such as a file, a folder, a hook, or a setting | A "Your call" line that says what stops working without that part |
  | An instruction for how the agent works | `.claude/rules/owner-preferences.md`. `finishing.md`, "Instructions the owner gives during setup", says how the line is written. |

- **The questions.** Ask each question of `interview.md` (Questions 1 to 5) that the owner has not answered, one question per message. Take each recommendation from the row of this table that fits what the project has:

  | The project has | Recommend |
  | --- | --- |
  | Old work items in local folders (`old-toolkit-pieces.md`, "Old records", lists those folders) | Work items in local folders, with the ID prefix that the old work items use |
  | A root `AGENTS.md` that names GitHub Issues or a GitHub project board as the place where the work items are kept | Work items in GitHub Issues |
  | `knowledge/memory/` | Local memory. Before the owner answers, tell the owner the facts in the list under this table. |
  | `.toolkit-memory.json` that names `hindsight` | Hindsight memory |
  | `.toolkit-memory.json` that names another service | Tell the owner that Toolkit V2 does not offer that service, and ask question 3 |
  | `SOUL.md` | Yes: the owner's file stays as it is |

  For the row `knowledge/memory/`, tell the owner these facts before the owner answers:

  - The old memory was committed to Git, so it reached the owner's other computers.
  - In Toolkit V2, the decisions, the description of the system, and the terms are files that Git tracks, with every memory choice.
  - Local memory holds the project's Current State and what no other file holds: facts about people and the client, where to find things, and what happened. The project's Current State is the project's one short page of what is true now. Local memory is Git-ignored and stays on this computer.
  - Memory in Notion or Hindsight is readable from every computer.

  Do not show the plan that `interview.md`, "The plan to confirm", describes, because the list in step 4 of this file is the plan.

## 2. Read what the project holds

Look for the places where the project keeps decisions, requirements, a description of the system, anything it was given by someone else, and outside documentation. Each place gets a line in the list. The line says where in Toolkit V2 its content goes: `DECISIONS.md`, `system/`, `sources/`, `delivery/`, or `reference/`. Three sections of `old-toolkit-pieces.md` say where: "Old records" lists the old records and where each is found, and "Old work item to Toolkit V2 work item" and "Old memory to its place in Toolkit V2" give the new place of each part of an old record.

A project that an earlier Toolkit V2 setup touched may hold `project-wide-records/`, `requirements/`, `system-guide/`, or `ai-external-knowledge/`. Sort those folders with the table in `one-home-layout.md`, "Where each old file or record goes", which gives the new place of each.

Keep every old record in place until the owner says yes to its line.

Every command in this step only reads. Run each command alone, from the main checkout.

| Read | With |
| --- | --- |
| What Git tracks, what it does not, and what it ignores | `git ls-files`, then `git status --short --ignored` |
| The agent files | `find .claude .codex .agents -type f -not -path '.claude/worktrees/*' 2>/dev/null` |
| The settings | `jq . .claude/settings.json`, `jq . .codex/hooks.json`, and `cat` on `.codex/config.toml` and `.mcp.json`, each when the file is present |
| The Git hooks of this copy of the repository | `ls "$(git rev-parse --git-path hooks)"`, leaving out names that end in `.sample` |
| The old toolkit's own copy | The commands in `old-toolkit-pieces.md`, "The old toolkit's own copy" |
| The old records, with a count for each status | The commands in the table in `old-toolkit-pieces.md`, "Old records" |
| The Toolkit V2 files for the owner's choices | Build the setup copy as steps 4 and 5 of "New project" in `SKILL.md` say, with `setup-copy.md` and `skills-hooks-settings.md`. Then run `rsync -rcni <copy>/ ./`. |

- The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. `<copy>` stands for that folder. Building the setup copy writes only in the temporary folder.
- In the `rsync` output, a `>f+++++++` line names a file that the project lacks. Any other `>f` line names a file that the project and the setup copy both have, with different content.
- When a file that the list would update or delete has uncommitted changes, put that file under "Your call". Recommend that the owner commits it first, because the changes of the move are made from the last commit. Never commit, stash, or discard the owner's changes yourself.
- When the repository has no commit yet, Git can bring nothing back. Say so in the first lines of the list, and mark every Delete line "cannot be brought back".

## 3. Sort everything the project holds

Put each of these under exactly one line of the list: every file that Git tracks, every other file that Git does not ignore, every old toolkit file or folder and every old record that Git ignores, and every Git hook of this copy of the repository. Use the first row of this table that fits:

| What it is | Part of the list |
| --- | --- |
| A file of the setup copy that the project lacks | Add |
| An old record (`old-toolkit-pieces.md`, "Old records", lists them) | One Update line for each kind of old record. Step 6 says which records are carried over. The line gives the count for each status, how many records are carried over, the place in Toolkit V2 where they go, and that the old folder stays as it is. An old record gets no "Kept untouched" line. |
| A file, folder, or Git hook that `old-toolkit-pieces.md` marks Delete | Delete |
| A file that `old-toolkit-pieces.md` marks Carry | Update. The line names where the owner's words go. |
| A file or folder that `old-toolkit-pieces.md` marks Compare, and that is an unchanged copy | Delete when Toolkit V2 has nothing of that name. Update ("replaced by the Toolkit V2 version") when the setup copy holds a file of that name. |
| A file or folder marked Compare that differs from the old toolkit's copy | Read the difference, and decide for each differing line whether it is the owner's. The list under this table gives the part of the list for each result. |
| A file or folder marked Compare, with no copy to compare it with | "Your call". Recommend keeping it until the owner has read it. |
| Root `AGENTS.md` | Update. Build the file new with steps 1 to 5 of the second case in `update.md`, "Updating AGENTS.md", and not with the `AGENTS.md` row in `placing-files.md`. The owner sees the whole new file before it is written. |
| Any other file that the project and the setup copy both have, with different content | Update. The table in `placing-files.md`, "3. Files the project already has", says what to do with each such file. A settings file gets one Update line that says which entries are removed, added, and kept. |
| The owner's own rule, skill, hook, agent, output style, or folder instruction file | Kept untouched. When the file names an old path, rule, or skill (`knowledge/`, `.work-items/`, or a name in a row of `old-toolkit-pieces.md`), put it under "Your call" instead. Recommend changing those names to the Toolkit V2 names, and give the count. |
| Everything else: code, documents, client files, data, and the owner's own settings | Kept untouched |
| Anything you cannot place | "Your call" |

For the row of a file or folder marked Compare that differs from the old toolkit's copy: a differing line is the owner's when it names this project's own things (its orgs, people, folders, dates, a section about this project), or when the owner signed it.

- When at least one differing line is the owner's, the file goes under Update. The Update line quotes the owner's lines and names where each line goes, from the table below. After each line is read back in its new place, the file is removed or replaced as an unchanged copy would be.
- When no differing line is the owner's, treat the file as an unchanged copy.
- When you cannot tell, put the file under "Your call".

Where the owner's lines from an old toolkit file go:

| The owner's line | New place |
| --- | --- |
| An instruction for how the agent works with the owner | `.claude/rules/owner-preferences.md`, as one list line in the owner's words, with the old file as its source. `finishing.md`, "Instructions the owner gives during setup", says how the line is written. |
| A fact about the project: a system, an org, a person, or a path | The matching section of `PROJECT.md` |
| A rule only this project has, such as a safety line about its own orgs or data | One new rule file of the project's own in `.claude/rules/`, named for the project, so the Toolkit V2 rule files stay as the toolkit ships them |

## 4. Show the list

Show the whole list in one message, written from the template in "The list template" below.

- Every line names the thing and gives one reason, in one line.
- Files of one kind with one reason share a line that gives the count and the names.
- A Delete line says what Toolkit V2 has in its place, or "nothing takes its place". A Delete line for something that Git does not track ends with "Git does not track it, so it cannot be brought back."
- A "Your call" line holds the question and your recommendation.
- Name everything that will be made outside the project folder, with the sentences that the table in `interview.md`, "The plan to confirm", gives for each choice.
- The last line is exactly: "Shall I make these changes?"

Read the owner's answer by these rules:

- A plain yes covers every Delete, Add, and Update line as shown. It covers a "Your call" line only when your recommendation leaves the thing as it is. Every other "Your call" line stays untouched until the owner answers that line.
- The owner may answer for single lines, for example "yes, but not D3" or "Q2: keep mine". A line that the owner turns down stays as it is.
- When the owner changes a choice, build the list again and show it again.
- Anything that is not on the list needs its own yes.

## The list template

```text
Moving <project name> to Toolkit V2

Your choices: work items in <place> (ID prefix <prefix>); memory in <place>; Salesforce <yes or no>; SOUL.md <yes or no>.
You also said: <each wish in the owner's words, or "nothing else">.
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

The rows in the template show the form of a line. Write the real rows. When a part of the list is empty, leave out that part's table, and keep its heading with "None."

## 5. After the owner's yes

Do these seven points in order, so that nothing is removed before what replaces it is in place.

1. **Worktree.** Make your own worktree and branch. Name the worktree `toolkit-v2-move-<YYYY-MM-DD>` and the branch `claude/toolkit-v2-move-<YYYY-MM-DD>`. `update.md`, "Before you start", gives the command, in its bullet about making your own worktree and branch.
   - Change the files that Git tracks only in that worktree.
   - Change `memory/`, `work-items/`, and the old Git-ignored folders in the main checkout.
   - A repository with no commit yet has no worktree. In such a repository, work in the main checkout.
2. **Add.** Copy the missing files.
   - Copy them into the worktree with `rsync -rlt --ignore-existing --exclude /memory/ --exclude /work-items/ <copy>/ <worktree>/`.
   - Copy into the main checkout only `<copy>/memory/` and `<copy>/work-items/`, when the owner's choices have them, with the same `rsync -rlt --ignore-existing`.
   - The main checkout ignores these two folders only after the branch is merged. Until then, stage nothing in them. Run the final check on them after the branch is merged.
3. **Update.** Carry out each approved Update line.
   - Merge the settings files with the rules in `skills-hooks-settings.md`, "Merge rules". Leave out the entries that run the command that checks the records, `.claude/hooks/validate-records.mjs`. Step 4 of `update.md`, "Turning on validate-records.mjs and the pre-commit file", adds those entries after the records pass the check. "7. Finish", step 2, below runs that section.
   - Put each line of the owner's in its new place, and read it back there.
4. **Services.** Do step 7 of "New project" in `SKILL.md`, which sets up each service that the owner chose.
5. **Records.** Do step 6 of this file, "Carry over the old records".
6. **Delete**, last. Remove only what an approved Delete line names.
   - Before you remove a file, check that it is still as it was when you listed it. A file that changed since then stays: ask the owner again.
   - Remove a file that Git tracks with `git rm`. Remove any other file with `rm`, with the exact path from the list.
   - Remove a hook command and its settings entry in the same step.
   - Remove a guard only after its replacement is in the settings and the replacement's own check has passed.
7. **Check.** Run `git status --short` in the worktree. It must list only paths that are on approved lines. When it lists any other path, put that path back with `git restore <path>` and tell the owner.

## 6. Carry over the old records

The old records stay where they are, unchanged, except as points 6 and 8 below say. A carry-over writes a new record in the Toolkit V2 form.

1. The list offers these by default:
   - Work items that are not Done or Cancelled, archived ones included.
   - With work items in local folders, also the old work item with the highest number, whatever its status, so that new IDs continue above every old ID.
   - What the old memory holds that is still true: topic files whose status is `current` or not set, and the glossary. Each fact goes to the place where Toolkit V2 keeps it. Only a fact that fits no other file becomes a memory record.

   Finished work items and superseded or retired memory stay where they are. The owner may change any of these defaults on the list.
2. Before you write a record, search the new place for "Carried over from `<its old path>`". When a record is already there, do not write it again.
3. Write the first work item and read it back. The table in `old-toolkit-pieces.md`, "Old work item to Toolkit V2 work item", says where each old field goes. Show the new work item to the owner and ask: "Is this the right form? I'll carry over the other <n> the same way." After the owner's yes, write the rest. In a move-over, this one question takes the place of the preview of every record that `update.md`, "Changing a setup choice", asks for.
4. Do the same for the old memory: write the first record, get the owner's yes, then write the rest. The table in `old-toolkit-pieces.md`, "Old memory to its place in Toolkit V2", says where each old memory file goes. Each new record names where it came from with "Carried over from `<its old path>`". `one-home-layout.md`, "Where each old file or record goes", says on which line of each kind of record that text goes.
5. Write a record that goes into a file Git tracks (`DECISIONS.md`, `system/`, `sources/`, `PROJECT.md`) in your worktree. A line in a work item or in memory that names such a record by its ID is different: write that line in the main checkout, after the branch was merged. `one-home-layout.md`, "After the owner's yes", step 8, lists what is written in the main checkout at that time.
6. Do not copy old records that are already in the place where the new ones go: issues in the same GitHub repository, pages in the same Notion database, or a root `work-items/` or `memory/` folder with files of the owner's. Put them on a "Your call" line. Recommend bringing each open record to the Toolkit V2 form in place, and change nothing in these records before the owner answers that line.
7. Add one line to `PROJECT.md`, under "Work and project records". The line is: "Old records, kept as history, read only: `<each old folder>`. Current work items and memory are under "Toolkit settings"." Never offer a folder that this line names for removal again.
8. When the old toolkit wrote an `AGENTS.md`, `CLAUDE.md`, or `README.md` inside an old record folder that is kept, and that file tells agents to use the old toolkit, the file gets an Update line. Its text becomes: "This folder holds old records, kept as history, read only. Current work items and memory: see "Toolkit settings" in the root `PROJECT.md`." Never rewrite a record in this way.
9. Never delete an old record. When the owner asks later to remove an old folder that Git does not track, tell the owner that it cannot be brought back, and remove it only after the owner's yes to that exact folder.

## 7. Finish

1. Follow `finishing.md`, which fills the prompts in the copied files, writes the project's Current State, and gives the final checks, the owner's steps, the report, and the commit offer. A fact that an old file shows (the old project facts file, the owner's `AGENTS.md`) counts as a fact that a file in the repository shows. Use such a fact, and list it in the report so that the owner can correct it.
2. Run `validate-records.mjs` and the final checks as steps 1 and 2 of `update.md`, "7. Checks and report", say. When a check fails only because of something on a "Kept untouched" line, such as a skill or folder of the owner's own, do not count it as a failure, and say so in the report.
3. Write the report. It says what was deleted, added, updated, and kept, with the counts. It says what was carried over and what stayed. It gives the owner's own steps: the steps in `finishing.md`, and one more. On each other computer that has this project, the owner pulls the default branch and says "toolkit v2". The update on that computer lists that copy's old Git hook and removes it after the owner's yes, as `update.md`, "4. What the toolkit no longer ships", says.
4. Offer the commit, and merge the branch after the owner's yes, as steps 4 to 6 of `update.md`, "7. Checks and report", say. Until the branch is merged, `PROJECT.md` is only in the worktree, so the main checkout still shows the old setup. A later session finds the move with step 1, "An unfinished move".
