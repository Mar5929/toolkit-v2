# Toolkit V2 skill descriptions: before and after

The 23 rows below show each shipped skill's complete description before and after the clarity rewrite. Unchanged operating instructions are omitted from the diff at the end.

## Shipped skills

- **Plugin (3):** `project-setup`, `choosing-outside-tools`, `writing-harness-files`.
- **Every project (10):** `braindump`, `explain-simply`, `filing-project-records`, `handoff`, `merge-and-clean-up`, `publish-docs`, `pull-latest`, `reset-to-remote`, `running-work-item-lifecycle`, `session-summary`.
- **Work tracking (3 alternatives):** `using-work-tracker` for GitHub Issues, local files, or Notion. A project gets one.
- **Memory (3 files):** `curating-project-memory`, plus `using-memory-store` for local files or Notion. A project with Hindsight gets neither storage skill.
- **Notion tool (1):** `using-notion-cli`.
- **Salesforce (3):** `sf-component-tracker`, `sf-data-change`, `sf-deploy-check`.

## `choosing-outside-tools` — `plugins/toolkit/skills/choosing-outside-tools/SKILL.md`

**Before**

> Lists the outside tool the owner uses for each kind of job and how to set it up, so every computer uses the same tool. Use when he asks for a job on the list, such as "make an explainer video", and no skill for that tool is on this computer; when he asks which tool he uses for a job; or when he says "add this to my tool list". Not for doing the job when a skill for that tool is on this computer.

**After**

> Lists the outside tool the owner chose for each kind of job and explains how to set it up. Use when the owner asks which tool they use for a job, asks to add a tool to the list, or asks for a listed job when that tool has no installed skill. When the tool has an installed skill, use that skill to do the job.

## `project-setup` — `plugins/toolkit/skills/project-setup/SKILL.md`

**Before**

> Sets up Toolkit V2 in a project, checks or updates the setup, moves over a project set up another way, changes where work items or memory are kept, adds SOUL.md, opens the Hindsight dashboard, or connects Hindsight on a new computer, so projects run the same files. Use for any Toolkit V2 setup request, such as "toolkit v2", "set up this project", "check the setup", or "update the toolkit". Not for a Git pull; use pull-latest. Not for the older claude-toolkit (project-sync).

**After**

> Sets up, checks, updates, or moves a project onto Toolkit V2. It also changes the project's work or memory choice, adds SOUL.md, opens the Hindsight dashboard, or connects Hindsight on a new computer. Use for requests such as "set up this project", "check the setup", or "update the toolkit". For new commits from Git, use pull-latest. The older claude-toolkit uses project-sync.

## `braindump` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/braindump/SKILL.md`

**Before**

> Plays back a loose brain dump in very simple words and waits for the owner's yes before any work starts, so nothing is planned, built, or saved on a misunderstanding. Use when the owner wants a brain dump checked first, such as "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". Not for a brain dump the owner asks only to plan; use running-work-item-lifecycle.

**After**

> Plays back the owner's loose ideas in simple words and waits for the owner's yes before starting work. Use when the owner asks "tell me what you heard", "play that back", or otherwise asks to check understanding first. When the owner asks only to plan the idea, use running-work-item-lifecycle.

## `explain-simply` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/explain-simply/SKILL.md`

**Before**

> Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path, so the owner can follow it and no fact is lost. Use when the owner finds an answer too technical or hard to follow, for example "explain it like I'm five", "simpler", "less jargon", or "I don't get it".

**After**

> Explains the last answer, a plan, or a named document in short, plain bullets while keeping its facts, numbers, names, and paths. Use when the owner asks for a simpler explanation, says "less jargon", or says "I don't get it".

## `filing-project-records` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/filing-project-records/SKILL.md`

**Before**

> Files the records the whole project needs, each with an ID, so later work finds them: every source the project receives, in sources/; a decision or open question more than one work item needs, in DECISIONS.md; a change to a document that describes the system, in system/. Use when the owner hands over a source, such as a transcript, a decision affects more than one work item, or a system document must be updated. Not for a decision only one work item needs; use running-work-item-lifecycle.

**After**

> Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use running-work-item-lifecycle.

## `handoff` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/handoff/SKILL.md`

**Before**

> Updates this session's work items and the project's Current State, files any decision or source this session left unfiled, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session, clears context, or asks for a handoff prompt or a check of one, such as "write a handoff". Not for a recap alone; use session-summary.

**After**

> Updates this session's work items and the project's Current State, files decisions or sources left unfiled, and writes a checked, self-contained prompt for the next session or checks one the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.

## `merge-and-clean-up` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/merge-and-clean-up/SKILL.md`

**Before**

> Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session's work is removed. Use when running-work-item-lifecycle asks, or the owner names a pull request to merge, such as "merge PR 12". Not for taking an approved work item through merge and deployment; use running-work-item-lifecycle.

**After**

> Merges one approved GitHub pull request only after its checks and the merge-safety check pass. It then removes only that pull request's branches and worktree. Use when the owner names a pull request to merge or running-work-item-lifecycle requests its merge. For an entire work item through merge and deployment, use running-work-item-lifecycle.

## `publish-docs` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/publish-docs/SKILL.md`

**Before**

> Commits an approved edit to project documents, such as system/, DECISIONS.md, sources/, delivery/, and PROJECT.md, directly to the default branch, so it needs no pull request. Use when another skill asks for a document save, or the owner says "publish the docs". Not for deciding what DECISIONS.md, sources/, or system/ says; use filing-project-records. Not for code, rules, skills, or a work item; use running-work-item-lifecycle.

**After**

> Commits an approved edit to project documents directly to the default branch. Use when another skill asks for a document save or the owner asks to "publish the docs". For deciding what belongs in DECISIONS.md, sources/, or system/, use filing-project-records. For code, rules, skills, or work items, use running-work-item-lifecycle.

## `pull-latest` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/pull-latest/SKILL.md`

**Before**

> Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner asks for the remote's newest commits, such as "get the latest" or "sync with remote". Not for discarding local work; use reset-to-remote. Not for a toolkit update; use project-setup.

**After**

> Fetches and merges new remote commits into the local repository while preserving local work and commit history. Use when the owner asks to "get the latest" or "sync with remote". For discarding local work, use reset-to-remote. For updating installed Toolkit V2 files, use project-setup.

## `reset-to-remote` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/reset-to-remote/SKILL.md`

**Before**

> Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in the owner's own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest.

**After**

> Shows a plan, then makes the local repository match its remote by discarding local commits and removing branches whose remote branches are gone. Use only when the owner explicitly asks to "wipe local", "match remote exactly", or start fresh from the remote. For a routine update that keeps local work, use pull-latest.

## `running-work-item-lifecycle` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/running-work-item-lifecycle/SKILL.md`

**Before**

> Runs one work item from idea to Done through requirements, design, build, testing, deployment, and closing, keeping the work item current and stopping for the owner's yes before each step that needs one. Use when the owner asks to plan, change, build, test, deploy, close, or cancel a work item, or asks whether one is ready for its next step, such as "is WI-12 ready to test". Not for filing a source, or a decision or rule more than one work item needs; use filing-project-records.

**After**

> Takes one work item from idea through requirements, design, build, testing, deployment, and closing. It keeps the work item current and gets the owner's yes at each required point. Use to plan, change, build, test, deploy, close, cancel, or check the readiness of a work item. For a source, shared decision, or rule that more than one work item needs, use filing-project-records.

## `session-summary` — `plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/session-summary/SKILL.md`

**Before**

> Recaps this session as a table of the owner's requests, the result of each one, and which still need the owner, so the owner sees what is done and what is open. Use when the owner asks what happened in this session, for example "recap this chat", "what did I ask for", "what did we do in this chat", or "summarize this session". Not for a handoff; use handoff.

**After**

> Puts the owner's requests, each result, and what still needs the owner in a table. Use when the owner asks to recap or summarize this session. For a prompt that lets a new session continue the work, use handoff.

## `memory-local/using-memory-store` — `plugins/toolkit/skills/project-setup/assets/memory-local/.claude/skills/using-memory-store/SKILL.md`

**Before**

> Saves, finds, and changes project memory records and the project's Current State as Markdown files in the memory folder, so every skill reads and writes memory the same way. Use when a memory record or the project's Current State must be read, saved, searched, renamed, retired, or deleted, such as "which memory files link to WI-031" or "read Current State". Not for deciding what to keep or when to ask; use curating-project-memory. Only for projects with local memory.

**After**

> Reads, finds, saves, changes, renames, retires, and deletes project memory records and the project's Current State as files in memory/. Use when a local memory record or the project's Current State must be read or changed. curating-project-memory decides what to keep and when to ask the owner. Only for projects with local memory.

## `memory-notion/using-memory-store` — `plugins/toolkit/skills/project-setup/assets/memory-notion/.claude/skills/using-memory-store/SKILL.md`

**Before**

> Stores and finds this project's memory records and the project's Current State in Notion, in Lore's databases and the Current state page, so every memory record is saved in the right column and page section. Use when a memory record or the project's Current State must be read, saved, changed, searched, linked to a work item, merged, or deleted, such as "read the Current state page". Not for deciding what to keep or when to ask; use curating-project-memory. Only for projects with Notion memory.

**After**

> Reads, finds, saves, changes, links, merges, and deletes project memory records and the project's Current State in Notion. Use when a Notion memory record or the project's Current State page must be read or changed. curating-project-memory decides what to keep and when to ask the owner. Only for projects with Notion memory.

## `curating-project-memory` — `plugins/toolkit/skills/project-setup/assets/memory-process/.claude/skills/curating-project-memory/SKILL.md`

**Before**

> Keeps project memory true: saves what no other file holds (a fact about a person or the client, an event, a job run), sends any other fact to its place, updates the project's Current State, writes "from now on" instructions as rules, and finds or cleans up what was saved. Use when the owner asks to keep, correct, forget, or find something, or reports a fact, a date, what someone said, or a job run. Not for a decision; use filing-project-records. Not for a to-do; use running-work-item-lifecycle.

**After**

> Saves facts that no other project file holds, routes other facts to their proper files, keeps the project's Current State accurate, writes "from now on" instructions as rules, and finds or cleans up saved facts. Use when the owner asks to remember, find, correct, or forget something, or reports a fact, date, statement, or job run. For a shared decision, use filing-project-records; for a task, use running-work-item-lifecycle.

## `using-notion-cli` — `plugins/toolkit/skills/project-setup/assets/notion-tools/.claude/skills/using-notion-cli/SKILL.md`

**Before**

> Shows how to run ntn, Notion's command-line tool, for the skills that store work items and memory in Notion: sign-in, Codex permissions, the calls every Notion step uses, and fixes for failed calls, so reads and saves in Notion work the first time. Use before any Notion read or write, when ntn will not sign in or cannot find a page, in Codex, and whenever a Notion call fails. Only for projects that keep work or memory in Notion.

**After**

> Explains how to run ntn for this project's Notion work and memory records, including sign-in, Codex access, API calls, and failed calls. Use before a Notion read or write through ntn, or when a call fails. This skill applies only when the project keeps work items or memory in Notion.

## `sf-component-tracker` — `plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-component-tracker/SKILL.md`

**Before**

> Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so no changed component is left out of a deploy. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before building and update the records in the same response), a deploy result comes back, or a deploy needs manual steps.

**After**

> Keeps the Salesforce component tracker CSV, master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync with metadata edits. Use before building when a component under force-app/ will change, when a deploy result arrives, or when a deploy needs manual steps. Update the records in the same response as the metadata change.

## `sf-data-change` — `plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-data-change/SKILL.md`

**Before**

> Builds the owner's handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use when the owner asks to load, import, update, or delete production records, even inside a build, for example "load this file into production".

**After**

> Prepares the owner's handoff for a Salesforce production data change: the load file, backup, numbered steps, success check, and undo steps. Use when the owner asks to load, import, update, or delete production records, including during a build. The owner runs the change.

## `sf-deploy-check` — `plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-deploy-check/SKILL.md`

**Before**

> Finds components or edits that a Salesforce deploy would ship beyond the intended change, so no unfinished or unintended work reaches a shared org. Use when a deploy to a shared org (UAT, full copy, staging, or production) is about to run, or before the owner gets a deploy command. Not for testing whether a work item is ready, or for running the deploy; use running-work-item-lifecycle.

**After**

> Checks whether a Salesforce deploy would include components or edits beyond the intended change, or whose feature is not ready in the target org. Use before a deploy to a shared org or before giving the owner a deploy command. For deciding whether a work item is ready or for running the deploy, use running-work-item-lifecycle.

## `work-github/using-work-tracker` — `plugins/toolkit/skills/project-setup/assets/work-github/.claude/skills/using-work-tracker/SKILL.md`

**Before**

> Saves, finds, and changes work items as GitHub issues, so running-work-item-lifecycle reads and writes every work item the same way. Use when a work item must be read, created, saved, or searched, such as "show me #12". Not for deciding a work item's plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work in GitHub Issues.

**After**

> Reads, creates, finds, and saves work items as GitHub issues. Use when a GitHub-tracked work item must be read or changed, such as "show me #12". running-work-item-lifecycle decides the plan, State, and approvals. Only for projects that track work in GitHub Issues.

## `work-local/using-work-tracker` — `plugins/toolkit/skills/project-setup/assets/work-local/.claude/skills/using-work-tracker/SKILL.md`

**Before**

> Saves, finds, and changes work items as local files in the work-items folder, so running-work-item-lifecycle reads and writes every work item the same way. Use when a work item must be read, created, saved, searched, nested, or moved, such as "show me WI-031" or "put WI-007 under WI-003". Not for deciding a work item's plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work locally.

**After**

> Reads, creates, finds, nests, moves, and saves work items as files in work-items/. Use for a locally tracked work item, such as "show me WI-031" or "put WI-007 under WI-003". running-work-item-lifecycle decides the plan, State, and approvals. Only for projects that track work locally.

## `work-notion/using-work-tracker` — `plugins/toolkit/skills/project-setup/assets/work-notion/.claude/skills/using-work-tracker/SKILL.md`

**Before**

> Saves, finds, and changes work items in the project's Notion databases, so running-work-item-lifecycle reads and writes every work item the same way. Use when a work item, phase, task, or question must be read, saved, or searched, such as "show me WI-31". Not for adding a phase or a task, or for deciding a work item's plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work in Notion.

**After**

> Reads, creates, finds, and saves work items in the project's Notion databases. Use for a Notion-tracked work item, phase, task, or question, such as "show me WI-31". running-work-item-lifecycle decides the plan, State, and approvals, including when to add a phase or task. Only for projects that track work in Notion.

## `writing-harness-files` — `plugins/toolkit/skills/writing-harness-files/SKILL.md`

**Before**

> Makes every change to a harness file follow the current official Claude Code and Codex pages. A harness file is a skill, rule, AGENTS.md or CLAUDE.md, hook, settings file, Codex .rules file, output style, plugin manifest or marketplace file, mod, subagent definition, or helper-agent brief. Use before any agent writes or changes one. Not for toolkit setup; use project-setup. Not for a line the owner dictates for owner-preferences.md; use curating-project-memory.

**After**

> Uses current official Claude Code and Codex guidance when an agent writes or changes a harness file. A harness file is a skill, rule, AGENTS.md or CLAUDE.md, hook, settings file, Codex .rules file, output style, plugin manifest or marketplace file, mod, subagent definition, or helper-agent brief. Use before writing or changing one. For toolkit setup, use project-setup.

## `filing-project-records` opening in `SKILL.md`

The body changed here because its first list made the reader infer which action and destination belonged to each record. The remaining body instructions were already clear and remain unchanged.

**Before**

```markdown
Use this skill to save information the whole project needs, so that later work on any work item can find it. It saves three kinds of thing:

1. **Sources.** Anything the project was given by someone else, such as a meeting transcript, an email, a client document, or a screenshot. Save every one in `sources/`, unchanged, with an ID like SRC-001. Do this even when only one work item uses it, or none does yet.
2. **Decisions and open questions** that more than one work item needs. These go in `DECISIONS.md`, each with an ID like DEC-001.
3. **Rules about how the system must work** that more than one work item needs. These go in a document in `system/`, each with an ID like SEC-04.
```

**After**

```markdown
Use this skill to file records that later work may need. File the three kinds of record as follows:

1. Save every source the project receives from someone else in `sources/`, unchanged, with an ID like SRC-001. Sources include meeting transcripts, emails, client documents, and screenshots. File a source even when only one work item uses it, or none does yet.
2. Record decisions and open questions that more than one work item needs in `DECISIONS.md`. Give each entry an ID like DEC-001.
3. Record rules about how the system must work that more than one work item needs in a document in `system/`. Give each rule an ID like SEC-04.
```

## Exact changes to shipped skill files

The patch below shows the old and new lines in every changed `SKILL.md`.

```diff
diff --git a/plugins/toolkit/skills/choosing-outside-tools/SKILL.md b/plugins/toolkit/skills/choosing-outside-tools/SKILL.md
index f508df6f..1f8cca3e 100644
--- a/plugins/toolkit/skills/choosing-outside-tools/SKILL.md
+++ b/plugins/toolkit/skills/choosing-outside-tools/SKILL.md
@@ -1,21 +1,21 @@
 ---
 name: choosing-outside-tools
-description: 'Lists the outside tool the owner uses for each kind of job and how to set it up, so every computer uses the same tool. Use when he asks for a job on the list, such as "make an explainer video", and no skill for that tool is on this computer; when he asks which tool he uses for a job; or when he says "add this to my tool list". Not for doing the job when a skill for that tool is on this computer.'
+description: 'Lists the outside tool the owner chose for each kind of job and explains how to set it up. Use when the owner asks which tool they use for a job, asks to add a tool to the list, or asks for a listed job when that tool has no installed skill. When the tool has an installed skill, use that skill to do the job.'
 ---
 
 # The owner's tool list
 
-The owner uses outside tools for some jobs. Toolkit V2 does not ship them, and a tool set up on one of his computers is not on the others. This skill lists the tool he chose for each job, so every computer uses the same one.
+The owner uses outside tools for some jobs. Toolkit V2 does not ship them, and a tool set up on one of the owner's computers is not on the others. This skill lists the tool the owner chose for each job, so every computer uses the same one.
 
 ## Steps
 
-When the owner only asks which tool he uses for a job, answer from the list and stop. When he asks to add, change, or remove a tool, go to "Changing the list". When he asks for a job:
+When the owner only asks which tool they use for a job, answer from the list and stop. When the owner asks to add, change, or remove a tool, go to "Changing the list". When the owner asks for a job:
 
 1. Find the job in the list below. When no row fits, tell the owner the list has no tool for that job, then do the job the way you would without this skill.
 2. Open the row's file. It says how to tell whether the tool is on this computer.
 3. When the tool is on this computer, use it, and follow the owner's choices in the file.
-4. When it is not, tell the owner which tool he uses for this job and that it is not on this computer. Say what setting it up downloads and which folders it adds. Set it up only after his yes. When he says no, ask him how he wants the job done.
-5. Never use another tool for a job on the list unless the owner says so.
+4. When it is not, tell the owner which tool they use for this job and that it is not on this computer. Say what setting it up downloads and which folders it adds. Set it up only after the owner's yes. When the owner says no, ask how they want the job done.
+5. Use another tool for a job on the list only when the owner says so.
 
 ## The list
 
@@ -28,5 +28,5 @@ When the owner only asks which tool he uses for a job, answer from the list and
 The list is kept in the Toolkit V2 repository, in the folder `plugins/toolkit/skills/choosing-outside-tools/`.
 
 - In a chat opened in that repository, add, change, or remove the row and its file there, and follow that repository's `AGENTS.md`.
-- In any other folder, never edit the copy of this skill that is installed on the computer. Tell the owner the change is made in a chat opened in the Toolkit V2 repository, and give him the tool's name and web address to paste there.
-- A row holds a tool the owner chose. Never add a tool he has not chosen.
+- In any other folder, never edit the copy of this skill that is installed on the computer. Tell the owner the change is made in a session opened in the Toolkit V2 repository, and give the owner the tool's name and web address to paste there.
+- A row holds a tool the owner chose. Add a tool only after the owner chooses it.
diff --git a/plugins/toolkit/skills/project-setup/SKILL.md b/plugins/toolkit/skills/project-setup/SKILL.md
index fc969423..dfab8658 100644
--- a/plugins/toolkit/skills/project-setup/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: project-setup
-description: 'Sets up Toolkit V2 in a project, checks or updates the setup, moves over a project set up another way, changes where work items or memory are kept, adds SOUL.md, opens the Hindsight dashboard, or connects Hindsight on a new computer, so projects run the same files. Use for any Toolkit V2 setup request, such as "toolkit v2", "set up this project", "check the setup", or "update the toolkit". Not for a Git pull; use pull-latest. Not for the older claude-toolkit (project-sync).'
+description: 'Sets up, checks, updates, or moves a project onto Toolkit V2. It also changes the project''s work or memory choice, adds SOUL.md, opens the Hindsight dashboard, or connects Hindsight on a new computer. Use for requests such as "set up this project", "check the setup", or "update the toolkit". For new commits from Git, use pull-latest. The older claude-toolkit uses project-sync.'
 ---
 
 # Project setup
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/braindump/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/braindump/SKILL.md
index 62f02d23..9715fb82 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/braindump/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/braindump/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: braindump
-description: 'Plays back a loose brain dump in very simple words and waits for the owner''s yes before any work starts, so nothing is planned, built, or saved on a misunderstanding. Use when the owner wants a brain dump checked first, such as "here''s a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". Not for a brain dump the owner asks only to plan; use running-work-item-lifecycle.'
+description: 'Plays back the owner''s loose ideas in simple words and waits for the owner''s yes before starting work. Use when the owner asks "tell me what you heard", "play that back", or otherwise asks to check understanding first. When the owner asks only to plan the idea, use running-work-item-lifecycle.'
 ---
 
 # Brain dump playback
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/explain-simply/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/explain-simply/SKILL.md
index fb076a66..203f0149 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/explain-simply/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/explain-simply/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: explain-simply
-description: 'Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path, so the owner can follow it and no fact is lost. Use when the owner finds an answer too technical or hard to follow, for example "explain it like I''m five", "simpler", "less jargon", or "I don''t get it".'
+description: 'Explains the last answer, a plan, or a named document in short, plain bullets while keeping its facts, numbers, names, and paths. Use when the owner asks for a simpler explanation, says "less jargon", or says "I don''t get it".'
 ---
 
 # Explain it simply
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/filing-project-records/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/filing-project-records/SKILL.md
index 2b635fb2..c542ea9a 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/filing-project-records/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/filing-project-records/SKILL.md
@@ -1,15 +1,15 @@
 ---
 name: filing-project-records
-description: 'Files the records the whole project needs, each with an ID, so later work finds them: every source the project receives, in sources/; a decision or open question more than one work item needs, in DECISIONS.md; a change to a document that describes the system, in system/. Use when the owner hands over a source, such as a transcript, a decision affects more than one work item, or a system document must be updated. Not for a decision only one work item needs; use running-work-item-lifecycle.'
+description: 'Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use running-work-item-lifecycle.'
 ---
 
 # Filing project records
 
-Use this skill to save information the whole project needs, so that later work on any work item can find it. It saves three kinds of thing:
+Use this skill to file records that later work may need. File the three kinds of record as follows:
 
-1. **Sources.** Anything the project was given by someone else, such as a meeting transcript, an email, a client document, or a screenshot. Save every one in `sources/`, unchanged, with an ID like SRC-001. Do this even when only one work item uses it, or none does yet.
-2. **Decisions and open questions** that more than one work item needs. These go in `DECISIONS.md`, each with an ID like DEC-001.
-3. **Rules about how the system must work** that more than one work item needs. These go in a document in `system/`, each with an ID like SEC-04.
+1. Save every source the project receives from someone else in `sources/`, unchanged, with an ID like SRC-001. Sources include meeting transcripts, emails, client documents, and screenshots. File a source even when only one work item uses it, or none does yet.
+2. Record decisions and open questions that more than one work item needs in `DECISIONS.md`. Give each entry an ID like DEC-001.
+3. Record rules about how the system must work that more than one work item needs in a document in `system/`. Give each rule an ID like SEC-04.
 
 If only one work item needs a decision or a requirement, do not save it here. It stays in that work item: use `running-work-item-lifecycle`.
 
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/handoff/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/handoff/SKILL.md
index 9002d0fd..a1f98ae3 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/handoff/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/handoff/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: handoff
-description: 'Updates this session''s work items and the project''s Current State, files any decision or source this session left unfiled, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session, clears context, or asks for a handoff prompt or a check of one, such as "write a handoff". Not for a recap alone; use session-summary.'
+description: 'Updates this session''s work items and the project''s Current State, files decisions or sources left unfiled, and writes a checked, self-contained prompt for the next session or checks one the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary.'
 ---
 
 # Handoff
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/merge-and-clean-up/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/merge-and-clean-up/SKILL.md
index e05bcc49..0c98d33d 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/merge-and-clean-up/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/merge-and-clean-up/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: merge-and-clean-up
-description: 'Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session''s work is removed. Use when running-work-item-lifecycle asks, or the owner names a pull request to merge, such as "merge PR 12". Not for taking an approved work item through merge and deployment; use running-work-item-lifecycle.'
+description: 'Merges one approved GitHub pull request only after its checks and the merge-safety check pass. It then removes only that pull request''s branches and worktree. Use when the owner names a pull request to merge or running-work-item-lifecycle requests its merge. For an entire work item through merge and deployment, use running-work-item-lifecycle.'
 ---
 
 # Merge and clean up
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/publish-docs/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/publish-docs/SKILL.md
index 5fe3d482..2f99e64d 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/publish-docs/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/publish-docs/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: publish-docs
-description: 'Commits an approved edit to project documents, such as system/, DECISIONS.md, sources/, delivery/, and PROJECT.md, directly to the default branch, so it needs no pull request. Use when another skill asks for a document save, or the owner says "publish the docs". Not for deciding what DECISIONS.md, sources/, or system/ says; use filing-project-records. Not for code, rules, skills, or a work item; use running-work-item-lifecycle.'
+description: 'Commits an approved edit to project documents directly to the default branch. Use when another skill asks for a document save or the owner asks to "publish the docs". For deciding what belongs in DECISIONS.md, sources/, or system/, use filing-project-records. For code, rules, skills, or work items, use running-work-item-lifecycle.'
 ---
 
 # Commit project documents to the default branch
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/pull-latest/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/pull-latest/SKILL.md
index a0fc3618..576a47e5 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/pull-latest/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/pull-latest/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: pull-latest
-description: 'Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner asks for the remote''s newest commits, such as "get the latest" or "sync with remote". Not for discarding local work; use reset-to-remote. Not for a toolkit update; use project-setup.'
+description: 'Fetches and merges new remote commits into the local repository while preserving local work and commit history. Use when the owner asks to "get the latest" or "sync with remote". For discarding local work, use reset-to-remote. For updating installed Toolkit V2 files, use project-setup.'
 ---
 
 # Pull the latest from the remote
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/reset-to-remote/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/reset-to-remote/SKILL.md
index b7cd8950..edc0b6f2 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/reset-to-remote/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/reset-to-remote/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: reset-to-remote
-description: 'Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in the owner''s own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest.'
+description: 'Shows a plan, then makes the local repository match its remote by discarding local commits and removing branches whose remote branches are gone. Use only when the owner explicitly asks to "wipe local", "match remote exactly", or start fresh from the remote. For a routine update that keeps local work, use pull-latest.'
 ---
 
 # Reset to remote
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/running-work-item-lifecycle/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/running-work-item-lifecycle/SKILL.md
index 797392a2..895314db 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/running-work-item-lifecycle/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/running-work-item-lifecycle/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: running-work-item-lifecycle
-description: 'Runs one work item from idea to Done through requirements, design, build, testing, deployment, and closing, keeping the work item current and stopping for the owner''s yes before each step that needs one. Use when the owner asks to plan, change, build, test, deploy, close, or cancel a work item, or asks whether one is ready for its next step, such as "is WI-12 ready to test". Not for filing a source, or a decision or rule more than one work item needs; use filing-project-records.'
+description: 'Takes one work item from idea through requirements, design, build, testing, deployment, and closing. It keeps the work item current and gets the owner''s yes at each required point. Use to plan, change, build, test, deploy, close, cancel, or check the readiness of a work item. For a source, shared decision, or rule that more than one work item needs, use filing-project-records.'
 ---
 
 # Running a work item's lifecycle
diff --git a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/session-summary/SKILL.md b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/session-summary/SKILL.md
index 9215f493..25eb2e9c 100644
--- a/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/session-summary/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/every-project/.claude/skills/session-summary/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: session-summary
-description: 'Recaps this session as a table of the owner''s requests, the result of each one, and which still need the owner, so the owner sees what is done and what is open. Use when the owner asks what happened in this session, for example "recap this chat", "what did I ask for", "what did we do in this chat", or "summarize this session". Not for a handoff; use handoff.'
+description: 'Puts the owner''s requests, each result, and what still needs the owner in a table. Use when the owner asks to recap or summarize this session. For a prompt that lets a new session continue the work, use handoff.'
 ---
 
 # Session summary
diff --git a/plugins/toolkit/skills/project-setup/assets/memory-local/.claude/skills/using-memory-store/SKILL.md b/plugins/toolkit/skills/project-setup/assets/memory-local/.claude/skills/using-memory-store/SKILL.md
index 5ef0f5d9..074f75b0 100644
--- a/plugins/toolkit/skills/project-setup/assets/memory-local/.claude/skills/using-memory-store/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/memory-local/.claude/skills/using-memory-store/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: using-memory-store
-description: 'Saves, finds, and changes project memory records and the project''s Current State as Markdown files in the memory folder, so every skill reads and writes memory the same way. Use when a memory record or the project''s Current State must be read, saved, searched, renamed, retired, or deleted, such as "which memory files link to WI-031" or "read Current State". Not for deciding what to keep or when to ask; use curating-project-memory. Only for projects with local memory.'
+description: 'Reads, finds, saves, changes, renames, retires, and deletes project memory records and the project''s Current State as files in memory/. Use when a local memory record or the project''s Current State must be read or changed. curating-project-memory decides what to keep and when to ask the owner. Only for projects with local memory.'
 ---
 
 # Using the memory store (local files)
diff --git a/plugins/toolkit/skills/project-setup/assets/memory-notion/.claude/skills/using-memory-store/SKILL.md b/plugins/toolkit/skills/project-setup/assets/memory-notion/.claude/skills/using-memory-store/SKILL.md
index 8cbde41b..43458cc6 100644
--- a/plugins/toolkit/skills/project-setup/assets/memory-notion/.claude/skills/using-memory-store/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/memory-notion/.claude/skills/using-memory-store/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: using-memory-store
-description: 'Stores and finds this project''s memory records and the project''s Current State in Notion, in Lore''s databases and the Current state page, so every memory record is saved in the right column and page section. Use when a memory record or the project''s Current State must be read, saved, changed, searched, linked to a work item, merged, or deleted, such as "read the Current state page". Not for deciding what to keep or when to ask; use curating-project-memory. Only for projects with Notion memory.'
+description: 'Reads, finds, saves, changes, links, merges, and deletes project memory records and the project''s Current State in Notion. Use when a Notion memory record or the project''s Current State page must be read or changed. curating-project-memory decides what to keep and when to ask the owner. Only for projects with Notion memory.'
 ---
 
 # Using the memory store (Notion)
diff --git a/plugins/toolkit/skills/project-setup/assets/memory-process/.claude/skills/curating-project-memory/SKILL.md b/plugins/toolkit/skills/project-setup/assets/memory-process/.claude/skills/curating-project-memory/SKILL.md
index 661eace5..928b6253 100644
--- a/plugins/toolkit/skills/project-setup/assets/memory-process/.claude/skills/curating-project-memory/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/memory-process/.claude/skills/curating-project-memory/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: curating-project-memory
-description: 'Keeps project memory true: saves what no other file holds (a fact about a person or the client, an event, a job run), sends any other fact to its place, updates the project''s Current State, writes "from now on" instructions as rules, and finds or cleans up what was saved. Use when the owner asks to keep, correct, forget, or find something, or reports a fact, a date, what someone said, or a job run. Not for a decision; use filing-project-records. Not for a to-do; use running-work-item-lifecycle.'
+description: 'Saves facts that no other project file holds, routes other facts to their proper files, keeps the project''s Current State accurate, writes "from now on" instructions as rules, and finds or cleans up saved facts. Use when the owner asks to remember, find, correct, or forget something, or reports a fact, date, statement, or job run. For a shared decision, use filing-project-records; for a task, use running-work-item-lifecycle.'
 ---
 
 # Curating project memory
diff --git a/plugins/toolkit/skills/project-setup/assets/notion-tools/.claude/skills/using-notion-cli/SKILL.md b/plugins/toolkit/skills/project-setup/assets/notion-tools/.claude/skills/using-notion-cli/SKILL.md
index 31931df5..72ce0ef9 100644
--- a/plugins/toolkit/skills/project-setup/assets/notion-tools/.claude/skills/using-notion-cli/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/notion-tools/.claude/skills/using-notion-cli/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: using-notion-cli
-description: 'Shows how to run ntn, Notion''s command-line tool, for the skills that store work items and memory in Notion: sign-in, Codex permissions, the calls every Notion step uses, and fixes for failed calls, so reads and saves in Notion work the first time. Use before any Notion read or write, when ntn will not sign in or cannot find a page, in Codex, and whenever a Notion call fails. Only for projects that keep work or memory in Notion.'
+description: 'Explains how to run ntn for this project''s Notion work and memory records, including sign-in, Codex access, API calls, and failed calls. Use before a Notion read or write through ntn, or when a call fails. This skill applies only when the project keeps work items or memory in Notion.'
 ---
 
 # Using the Notion command line
diff --git a/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-component-tracker/SKILL.md b/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-component-tracker/SKILL.md
index adc40a71..73468d0e 100644
--- a/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-component-tracker/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-component-tracker/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: sf-component-tracker
-description: 'Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so no changed component is left out of a deploy. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before building and update the records in the same response), a deploy result comes back, or a deploy needs manual steps.'
+description: 'Keeps the Salesforce component tracker CSV, master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync with metadata edits. Use before building when a component under force-app/ will change, when a deploy result arrives, or when a deploy needs manual steps. Update the records in the same response as the metadata change.'
 ---
 
 # Salesforce component tracker
diff --git a/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-data-change/SKILL.md b/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-data-change/SKILL.md
index 1695276e..7a71f6d8 100644
--- a/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-data-change/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-data-change/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: sf-data-change
-description: 'Builds the owner''s handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use when the owner asks to load, import, update, or delete production records, even inside a build, for example "load this file into production".'
+description: 'Prepares the owner''s handoff for a Salesforce production data change: the load file, backup, numbered steps, success check, and undo steps. Use when the owner asks to load, import, update, or delete production records, including during a build. The owner runs the change.'
 ---
 
 # Salesforce data change handoff
diff --git a/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-deploy-check/SKILL.md b/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-deploy-check/SKILL.md
index fd3e8287..ca716156 100644
--- a/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-deploy-check/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/salesforce/.claude/skills/sf-deploy-check/SKILL.md
@@ -1,15 +1,15 @@
 ---
 name: sf-deploy-check
-description: 'Finds components or edits that a Salesforce deploy would ship beyond the intended change, so no unfinished or unintended work reaches a shared org. Use when a deploy to a shared org (UAT, full copy, staging, or production) is about to run, or before the owner gets a deploy command. Not for testing whether a work item is ready, or for running the deploy; use running-work-item-lifecycle.'
+description: 'Checks whether a Salesforce deploy would include components or edits beyond the intended change, or whose feature is not ready in the target org. Use before a deploy to a shared org or before giving the owner a deploy command. For deciding whether a work item is ready or for running the deploy, use running-work-item-lifecycle.'
 ---
 
-# Salesforce deploy hitch-hiker check
+# Salesforce deploy scope check
 
-A metadata deploy ships the whole current source of every component it names, not only your edit. A hitch-hiker is a component in the deploy set, or an undeployed edit inside a named component's file, that would land in the target org although it is not the intended change or its feature is not ready there.
+Use this skill to find components or edits that a Salesforce metadata deploy would ship beyond the intended change, or whose feature is not ready in the target org. A metadata deploy ships the whole current source of every component it names, including edits outside the work item's scope.
 
-Two shapes:
-1. A whole component the target does not have yet. The deploy creates it. Example: a field whose LWC, Apex, page, or backfill has not shipped.
-2. Extra edits inside a file you touch for one reason. Example: you change a field's help text; the deploy also ships a renamed label, a new rollup filter, a changed formula, or added picklist values in that file.
+A change outside the intended scope, or a feature that is not ready for the target org, can enter the deploy in two ways:
+1. The deploy includes a whole component that the target org does not have yet. For example, it creates a field whose LWC, Apex, page, or backfill has not shipped.
+2. The deploy includes other edits in a file you changed for one reason. For example, you change a field's help text, but the file also contains a renamed label, a new rollup filter, a changed formula, or added picklist values.
 
 ## When to run
 
@@ -20,13 +20,13 @@ Two shapes:
 
 1. List the exact deploy set: every `<members>` in the `-x` manifest, every member in the `-m` list, every file or folder under `-d`. An `-x` deploy of a full-cutover manifest is the highest risk. Check the whole member list.
 2. For each named component, the whole current `force-app/` definition ships: label, inline help text, formula, rollup and summary filters, picklist values, all field metadata, and the component itself if the target lacks it.
-3. For each component, decide whether its feature is already live in the target. Hitch-hiker signals:
+3. For each component, decide whether its feature is already live in the target. Check for these signs of a change outside the intended scope or a feature that is not ready:
    - The component tracker (if the project keeps one) marks it as not in the target org.
    - It belongs to a work item or feature the owner has not called ready for that org.
    - The file has edits beyond the intended one. Diff it against the commit last deployed to the target org (the "Source revision" line of that deploy's `DEPLOYMENT-RECORD.md`). When no record names it, run `git log -p` on the path and read each change.
-   - When `tools/kb/` exists, run `python tools/kb/query_graph.py <Object.Field>` to see what the component connects to. A connected component that is not in the target org is a candidate hitch-hiker.
+   - When `tools/kb/` exists, run `python tools/kb/query_graph.py <Object.Field>` to see what the component connects to. A connected component that is not in the target org may be outside the intended scope or not ready there.
 4. Treat any tracker as a hint, not proof. Before you call a component missing, verify against the target org read-only: `sf sobject describe`, or a SOQL or Tooling query for the field, class, or flag. Do not block a deploy on a stale tracker alone. Do not tell the owner a component would ship to production until a read-only check confirms it is not already there.
-5. If a confirmed hitch-hiker remains, stop. Do not deploy. Do not hand over the command. Tell the owner which component, what would ship, and why it may be unintended. The owner decides: narrow the deploy set, or confirm the hitch-hiker is wanted.
+5. If you confirm that a component or edit outside the intended scope, or a feature not ready for the target org, would ship, stop. Do not deploy or hand over the command. Tell the owner which component or edit would ship and why it is outside the scope or not ready. The owner decides whether to narrow the deploy set or confirm that the change is wanted.
 
 ## Narrow the deploy set
 
diff --git a/plugins/toolkit/skills/project-setup/assets/work-github/.claude/skills/using-work-tracker/SKILL.md b/plugins/toolkit/skills/project-setup/assets/work-github/.claude/skills/using-work-tracker/SKILL.md
index 3e925d73..72289c60 100644
--- a/plugins/toolkit/skills/project-setup/assets/work-github/.claude/skills/using-work-tracker/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/work-github/.claude/skills/using-work-tracker/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: using-work-tracker
-description: 'Saves, finds, and changes work items as GitHub issues, so running-work-item-lifecycle reads and writes every work item the same way. Use when a work item must be read, created, saved, or searched, such as "show me #12". Not for deciding a work item''s plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work in GitHub Issues.'
+description: 'Reads, creates, finds, and saves work items as GitHub issues. Use when a GitHub-tracked work item must be read or changed, such as "show me #12". running-work-item-lifecycle decides the plan, State, and approvals. Only for projects that track work in GitHub Issues.'
 ---
 
 # Work items kept as GitHub issues
diff --git a/plugins/toolkit/skills/project-setup/assets/work-local/.claude/skills/using-work-tracker/SKILL.md b/plugins/toolkit/skills/project-setup/assets/work-local/.claude/skills/using-work-tracker/SKILL.md
index e674c378..71b90f78 100644
--- a/plugins/toolkit/skills/project-setup/assets/work-local/.claude/skills/using-work-tracker/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/work-local/.claude/skills/using-work-tracker/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: using-work-tracker
-description: 'Saves, finds, and changes work items as local files in the work-items folder, so running-work-item-lifecycle reads and writes every work item the same way. Use when a work item must be read, created, saved, searched, nested, or moved, such as "show me WI-031" or "put WI-007 under WI-003". Not for deciding a work item''s plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work locally.'
+description: 'Reads, creates, finds, nests, moves, and saves work items as files in work-items/. Use for a locally tracked work item, such as "show me WI-031" or "put WI-007 under WI-003". running-work-item-lifecycle decides the plan, State, and approvals. Only for projects that track work locally.'
 ---
 
 # Work items kept as local files
diff --git a/plugins/toolkit/skills/project-setup/assets/work-notion/.claude/skills/using-work-tracker/SKILL.md b/plugins/toolkit/skills/project-setup/assets/work-notion/.claude/skills/using-work-tracker/SKILL.md
index f821eded..ed4960fb 100644
--- a/plugins/toolkit/skills/project-setup/assets/work-notion/.claude/skills/using-work-tracker/SKILL.md
+++ b/plugins/toolkit/skills/project-setup/assets/work-notion/.claude/skills/using-work-tracker/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: using-work-tracker
-description: 'Saves, finds, and changes work items in the project''s Notion databases, so running-work-item-lifecycle reads and writes every work item the same way. Use when a work item, phase, task, or question must be read, saved, or searched, such as "show me WI-31". Not for adding a phase or a task, or for deciding a work item''s plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work in Notion.'
+description: 'Reads, creates, finds, and saves work items in the project''s Notion databases. Use for a Notion-tracked work item, phase, task, or question, such as "show me WI-31". running-work-item-lifecycle decides the plan, State, and approvals, including when to add a phase or task. Only for projects that track work in Notion.'
 ---
 
 # Work items kept in Notion
diff --git a/plugins/toolkit/skills/writing-harness-files/SKILL.md b/plugins/toolkit/skills/writing-harness-files/SKILL.md
index e5fab74b..b97ebb0a 100644
--- a/plugins/toolkit/skills/writing-harness-files/SKILL.md
+++ b/plugins/toolkit/skills/writing-harness-files/SKILL.md
@@ -1,6 +1,6 @@
 ---
 name: writing-harness-files
-description: 'Makes every change to a harness file follow the current official Claude Code and Codex pages. A harness file is a skill, rule, AGENTS.md or CLAUDE.md, hook, settings file, Codex .rules file, output style, plugin manifest or marketplace file, mod, subagent definition, or helper-agent brief. Use before any agent writes or changes one. Not for toolkit setup; use project-setup. Not for a line the owner dictates for owner-preferences.md; use curating-project-memory.'
+description: 'Uses current official Claude Code and Codex guidance when an agent writes or changes a harness file. A harness file is a skill, rule, AGENTS.md or CLAUDE.md, hook, settings file, Codex .rules file, output style, plugin manifest or marketplace file, mod, subagent definition, or helper-agent brief. Use before writing or changing one. For toolkit setup, use project-setup.'
 ---
 
 # Writing harness files

```
