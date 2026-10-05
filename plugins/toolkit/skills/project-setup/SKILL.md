---
name: project-setup
description: 'Sets up, checks, or updates Toolkit V2 in a project, moves an older claude-toolkit project onto it, or changes where work items or memory live, so projects run the same files. Use when the owner says "toolkit v2", "set up this project", "initialize this project", or "update the toolkit". Not for a Git pull; use pull-latest. Not for running the older claude-toolkit (project-sync).'
---

# Project setup

The user dictates most messages with voice-to-text, so words may be misheard, missing, or out of order. Read for what the user means rather than the literal wording, and ask one short question when a message is unclear or could mean two things.

Sets up Toolkit V2 in a project, brings a Toolkit V2 project up to date,
or moves a project that was set up another way onto Toolkit V2. It never
runs the older claude-toolkit (its `project-init` and `project-sync`
skills). There is no setup program: you copy and edit the files yourself,
from this skill's `assets/` folder. This skill's folder is the folder that
holds this `SKILL.md`; both hosts show its path when they load the skill.

## Pick the path

The folder decides whether this is a new project, a project already on
Toolkit V2, or a project to move over, whatever words he used. "Toolkit v2"
with nothing else means: bring this folder onto Toolkit V2 by the path that
fits. For a setup, an update, a check, or a move, say which path it is in
one line before the first question.

Check the first case before the others: a setup that stopped part way also
has a filled "Toolkit settings" section.

- `PROJECT.md` "Toolkit settings" is filled, but a service line still shows
  its prompt (with Notion: "Work item ID prefix", "Notion work items", or
  "Notion memory"; with GitHub Issues: "GitHub repository"; with Hindsight:
  "Hindsight bank"), `{{CURRENT_STATE_PAGE_ID}}` is still in
  `.claude/settings.json` or `.codex/hooks.json`, or Current State still
  has its fill-in guide: setup stopped part way. Say so in one line, take
  the choices from "Toolkit settings", and continue at step 7 of "New
  project", then step 8.
- `PROJECT.md` has a filled "Toolkit settings" section: the project is set
  up. Update the toolkit, also when he says only "toolkit v2":
  `references/update.md`. Check the setup: build a fresh setup copy and
  compare (`references/update.md`, steps 1 and 2), run
  the final checks (`references/finishing.md`) without fixing any that
  fail, and report each difference and each failed check with the fix you
  recommend. Change nothing in the project; only the session-start hook run
  in the final checks may rebuild the generated `memory/MEMORY.md`. Change a
  setup choice (where work items or memory live, or the Memory approval
  mode): `references/update.md`, "Changing a setup choice".
- He asks to open a project's Hindsight dashboard, or a Hindsight project is
  set up but this computer lacks its key or the add-on (a new computer):
  `references/hindsight-on-vps.md`, "Open the dashboard" or "A new
  computer".
- Set up `SOUL.md` in a set-up project: copy `assets/soul/SOUL.md` into
  the project when it has none, fill it with his own words as
  `references/finishing.md`, "SOUL.md", says, and offer to commit it.
- No filled "Toolkit settings" section, and the main checkout holds any of
  these: `AGENTS.md`, `CLAUDE.md`, `.work-items/`, `.toolkit.json`, or a
  file in `.claude/`, `.codex/`, or `.agents/` other than
  `.claude/settings.local.json` and `.claude/worktrees/`. The folder has an
  earlier setup (the older claude-toolkit, the retired `toolkit` program,
  or agent files made by hand), even when it is one hand-written
  `AGENTS.md`: move it over, `references/move-over.md`. One case asks
  first: the folder holds older claude-toolkit files, and he asked to
  update the toolkit or check the setup without naming Toolkit V2. Before
  any setup question, ask whether he means the older toolkit (its
  `project-sync` skill) or moving this project to Toolkit V2. Recommend
  the older toolkit, because the folder holds its files and no Toolkit V2
  settings. For the older toolkit, stop and say `project-sync` is the
  skill for it. For Toolkit V2, move it over.
- Otherwise it is a new project. Put the eight steps below in the plan tool
  (Claude Code: the task list; Codex: `update_plan`; when the host has none,
  continue without it). Record each answer he gives as a checked line (for
  example `- [x] Work items: local`): a later turn may start without this
  skill loaded.

## New project

1. **Look, then interview**, one question per message, each with a
   recommendation: the name and owner, where work items live, where memory
   lives, Salesforce, `SOUL.md`. `references/interview.md`.
2. **Show the plan and wait for his yes.** Name every thing that will be
   made outside this folder. `references/interview.md`, "The plan to
   confirm".
3. **Ask for the sign-ins the choices need now** (`ntn login` for Notion,
   `gh auth login` for GitHub), so he can do them while you copy.
   `references/notion.md`, `references/github.md`.
4. **Build the setup copy** in a scratch folder: the `every-project` folder
   and the folder for each choice, the setup markers resolved, and the name
   and "Toolkit settings" filled. `every-project` holds `DECISIONS.md`,
   `system/`, `sources/`, `delivery/`, and `reference/`, so every tracker
   and memory choice gets them.
   `references/setup-copy.md`.
5. **Add the settings** to the setup copy, and check its skills and hook
   commands. `references/skills-hooks-settings.md`.
6. **Put it into the project** and make the `.agents/skills` link. Never
   replace a file the project already has without showing the difference
   and asking. `references/placing-files.md`.
7. **Set up each service**, once its sign-in is done: Notion pages, the
   GitHub repository and labels, the Hindsight bank and Hindsight's
   coding-agent add-on, the Salesforce facts. For a Salesforce project, also
   check that Salesforce's skills are installed on this computer or in the
   project (`~/.claude/skills`, the project's `.claude/skills`,
   `~/.agents/skills`, or the plugin list). When they are not, tell the owner
   and give him `npx skills add forcedotcom/sf-skills` to run himself; setup
   never installs them. `references/notion.md`,
   `references/github.md`, `references/hindsight-on-vps.md`,
   `references/salesforce.md` (it starts with checking that Salesforce's
   skills are installed).
8. **Finish**: fill the prompts in the copied files with facts he confirms,
   write Current State, run the final checks, name his own steps, report,
   and offer the commit. `references/finishing.md`.

## Gotchas

- Ask each question in the reply text, never through a question tool: in
  `codex exec` the box is never shown and the turn ends with no answer.
  Never answer a question for him, even when he does not reply.
- Never change an answer he gave (work items, memory, Salesforce) to get
  past a failure. Never get past a failure by setting the project up in
  some other folder and copying it over; the scratch setup copy in steps 4
  to 6 is the normal path. Stop, say what failed, and say what he must
  approve or run.
- Set up a new project in its main checkout, never from a worktree, even
  when a machine-wide rule asks for one: the Git-ignored `memory/` and
  `work-items/` must live there. Only `references/update.md` and
  `references/move-over.md` use a worktree.
- Nothing is made outside the project folder without his yes: no Notion
  page, no GitHub repository or label, no Hindsight bank, no install. The
  plan he approved covers only what it named. The only other files written
  outside it are the scratch folders (`references/setup-copy.md`, "Make the
  scratch folder"; a folder for a Notion body) and, after his yes, the
  Hindsight add-on's files and settings (`references/hindsight-on-vps.md`,
  "4. The add-on"). Never save a path, a file list, or a diff in a file.
  Remove each scratch folder once its step is done (the setup copy after
  the final checks), so nothing from setup is left in `/tmp`, `$TMPDIR`, or
  the session scratchpad.
- Codex: the sandbox refuses to create `.codex/` and `.agents/`, keeps
  `.git/` read-only, and blocks the network. Run each command that writes
  those folders or a file in the home folder outside the project
  (`~/.hindsight/`, `~/.claude/`, `~/.codex/`), each Git write, and
  each `ntn`, `gh`, `curl`, `npx`, `open`, and `sf` call alone, with
  `sandbox_permissions` set to `require_escalated` and a one-line reason.
  Keep a `| jq` filter in the same command. Never join two such commands.
  Refused without asking (as in `codex exec`): show him the exact command
  to run in a terminal, and wait.
  Never drop the Codex files to get past a refusal.
- Never change anything in this skill's `assets/` folder: it is the source
  for every project.
- The `.agents/skills` link in `assets/every-project/` is never copied. A
  project's `.agents/skills` is a link to `.claude/skills`, so there is one
  copy of each skill.
- Never write a script into a project. The only code a project runs is the
  three hook commands and, in a Salesforce project, the model's own
  Salesforce code: the two guards, the graph Stop hook, and the scripts in
  `tools/`.
- Jira is not offered yet. Hindsight memory has no memory skills: the agent
  uses the tools of Hindsight's coding-agent add-on.
- Setup is never a work item. The project's one-sentence outcome is the
  owner's answer, never a sentence worked out from the code.

## References

| File | Open it when |
| --- | --- |
| `references/interview.md` | Steps 1 and 2: what to check before asking, the five questions with their recommendations, and the plan to confirm |
| `references/setup-copy.md` | Step 4, and step 1 of an update: the scratch folder, the folders each choice adds, what never ships, the setup markers, "Toolkit settings", the Salesforce entries, the owner-preferences rule |
| `references/skills-hooks-settings.md` | Step 5: which skills each folder holds, the hook commands, the settings snippets and how to merge them, the older plugins turned off |
| `references/placing-files.md` | Step 6: copying into the project, files it already has, the `.agents/skills` link |
| `references/notion.md` | Work items or memory in Notion: the sign-in, his yes, which Notion setup to follow, the links |
| `references/notion-build/work-setup.md` | Work items or memory in Notion: the steps of a new project, removing the part kept elsewhere, the links in `PROJECT.md`, adding work items or memory later, bringing a project up to the current template, moving from Stage to State, building the template, the checks |
| `references/notion-build/work-layout.md` | Work items in Notion: the database views, the property order and page layout, the request bodies |
| `references/notion-build/setup.md` | Memory in Notion: the memory steps of a new project, the links in `PROJECT.md`, bringing memory up to date, building the memory part of a template. Lore's databases, columns, views, and request files are in the Notion `using-memory-store` skill, in `assets/memory-notion/.claude/skills/` |
| `references/notion-build/project-page.md`, `references/notion-build/work-item-page.md`, `references/notion-build/memory-page.md` | Building the Notion template: the text of the project page, the work item template, and the Memory page |
| `references/github.md` | Work items in GitHub Issues: the sign-in, the repository, the labels, bringing a project up to date, the checks |
| `references/hindsight-on-vps.md` | Memory in Hindsight: what runs on the VPS, the access key, the bank, the coding-agent add-on, the save-and-search check, opening the dashboard, checking a Hindsight project, a new computer |
| `references/salesforce.md` | A Salesforce project: Salesforce's skills check, the org aliases, and the API version |
| `references/finishing.md` | Step 8: the prompts in the copied files, `SOUL.md`, Current State, the final checks, the owner's steps, the report, the commit offer |
| `references/update.md` | Update the toolkit, check the setup, or change a setup choice |
| `references/move-over.md` | Moving a project that was set up another way onto Toolkit V2: which earlier setup it is, his choices, reading the project, sorting each piece, the list and its template, the order of the changes after his yes, carrying over old records, finishing |
| `references/old-toolkit-pieces.md` | A move-over, steps 2, 3, and 6: the old toolkit's plugins, rules, hook commands, tools, and knowledge files with what Toolkit V2 has in their place, the old records, and how an old work item and old memory map to the Toolkit V2 form |
| `assets/every-project/` | Step 4: everything every project gets: the project files, the shared skills, and the three hook commands, copied first into the scratch folder |
| `assets/work-local/`, `assets/work-notion/`, `assets/work-github/` | Step 4: the files and the `using-work-tracker` skill for the work tracking choice |
| `assets/memory-local/`, `assets/memory-notion/`, `assets/memory-process/`, `assets/memory-hindsight/` | Step 4: the memory files, skills, and rule for the memory choice (`memory-process` goes with local or Notion memory; Hindsight takes `memory-hindsight` and one file of `memory-local`) |
| `assets/notion-tools/` | Step 4: the `using-notion-cli` skill and the `notion-records.md` rule, for work items or memory in Notion |
| `assets/salesforce/` | Step 4: everything only a Salesforce project gets |
| `assets/soul/` | Step 4: `SOUL.md`, when the owner keeps it |
| `assets/owner-preferences.md` | Step 4: the starting `.claude/rules/owner-preferences.md` every project gets |
| `assets/settings/` | Step 5: the settings snippets for each choice |
