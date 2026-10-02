---
name: project-setup
description: 'Sets up, checks, or updates Toolkit V2 in a project, or changes where work items or memory are kept, by copying the model project, skills, and hooks, so projects run the same files. Use when the owner says "set up this project", "initialize this project", "update the toolkit", or "check the setup". Not for a Git pull; use pull-latest. Not for the older claude-toolkit (project-init, project-sync).'
---

# Project setup

Sets up Toolkit V2 in a project, or brings a Toolkit V2 project up to date;
never the older claude-toolkit (its `project-init` and `project-sync`
skills). There is no setup program: you copy and edit the files yourself,
from this skill's `assets/` folder. This skill's folder is the folder that
holds this `SKILL.md`; both hosts show its path when they load the skill.

## Pick the path

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
  up. Update the toolkit: `references/update.md`. Check the setup: build a
  fresh setup copy and compare (`references/update.md`, steps 1 and 2), run
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
- Set up `SOUL.md` in a set-up project: copy `assets/model/SOUL.md` into
  the project when it has none, fill it with his own words as
  `references/finishing.md`, "SOUL.md", says, and offer to commit it.
- The folder has `.toolkit.json`: the retired `toolkit` program set it up.
  Tell the owner, and ask whether to set it up again as a new project.
  Nothing is removed.
- He asks to update the toolkit or check the setup, the folder has no
  filled "Toolkit settings" section, and it has older claude-toolkit files
  (`references/interview.md`, "Look before asking"): before any setup
  question, ask whether he means the older toolkit (its `project-sync`
  skill) or moving this project to Toolkit V2. Recommend the older toolkit,
  because the folder holds its files and no Toolkit V2 settings. For the
  older toolkit, stop and say `project-sync` is the skill for it. For
  Toolkit V2, continue as a new project.
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
4. **Build the setup copy** in a scratch folder: the model, minus what the
   choices leave out, the setup markers resolved, the name and "Toolkit
   settings" filled, the rules list written. `references/setup-copy.md`.
5. **Add the skills, the three hook commands, and the settings** to the
   setup copy. `references/skills-hooks-settings.md`.
6. **Put it into the project** and make the `.agents/skills` link. Never
   replace a file the project already has without showing the difference
   and asking. `references/placing-files.md`.
7. **Set up each service**, once its sign-in is done: Notion pages, the
   GitHub repository and labels, the Hindsight bank and Hindsight's
   coding-agent add-on, the Salesforce facts. `references/notion.md`,
   `references/github.md`, `references/hindsight-on-vps.md`,
   `references/salesforce.md`.
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
  `work-items/` must live there. Only `references/update.md` uses a
  worktree.
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
- The model's `.agents/skills/` folder is never copied. A project's
  `.agents/skills` is a link to `.claude/skills`, so there is one copy of
  each skill.
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
| `references/setup-copy.md` | Step 4, and step 1 of an update: the scratch folder, what never ships, what each choice leaves out, the setup markers, "Toolkit settings", the Salesforce entries, the owner-preferences rule, the rules list |
| `references/skills-hooks-settings.md` | Step 5: which skills each choice adds, the hook commands, the settings snippets and how to merge them, the older plugins turned off |
| `references/placing-files.md` | Step 6: copying into the project, files it already has, the `.agents/skills` link |
| `references/notion.md` | Work items or memory in Notion: the sign-in, his yes, which Notion setup to follow, the links |
| `references/notion-build/work-setup.md` | Work items in Notion: the steps of a new project, the links in `PROJECT.md`, bringing a project up to the current template, moving from Stage to State, building the templates, the checks |
| `references/notion-build/work-layout.md` | Work items in Notion: the database views, the property order and page layout, the request bodies |
| `references/notion-build/setup.md` | Memory in Notion: the memory steps of a new project, the links in `PROJECT.md`, bringing memory up to date, building the memory part of a template |
| `references/notion-build/lore-layout.md` | Memory in Notion: Lore's databases and every column, the views, the property order and page layout |
| `references/notion-build/project-page.md`, `references/notion-build/work-item-page.md`, `references/notion-build/memory-page.md`, `references/notion-build/project-page-memory-only.md` | Building the Notion templates: the text of the project page, the work item template, the Memory page, and the "Project: memory only" page |
| `references/notion-build/lore/` | Building or updating Notion memory: the 16 request files for Lore's databases, columns, and views, named in `lore-layout.md` and `setup.md` |
| `references/github.md` | Work items in GitHub Issues: the sign-in, the repository, the labels, bringing a project up to date, the checks |
| `references/hindsight-on-vps.md` | Memory in Hindsight: what runs on the VPS, the access key, the bank, the coding-agent add-on, the save-and-search check, opening the dashboard, checking a Hindsight project, a new computer |
| `references/salesforce.md` | A Salesforce project: the org aliases and the API version |
| `references/finishing.md` | Step 8: the prompts in the copied files, `SOUL.md`, Current State, the final checks, the owner's steps, the report, the commit offer |
| `references/update.md` | Update the toolkit, check the setup, or change a setup choice |
| `assets/model/` | Step 4: the model project, copied whole into the scratch folder |
| `assets/owner-preferences.md` | Step 4: the starting `.claude/rules/owner-preferences.md` every project gets |
| `assets/.shared-skills/` | Step 5: the skills every project gets |
| `assets/.skill-sets/` | Step 5: one folder per work tracking or memory set (`local-work`, `notion-work`, `github-work`, `local-memory`, `notion-memory`) |
| `assets/.salesforce/sf-architect-solutioning/` | Step 5, Salesforce projects only |
| `assets/hooks/` | Step 5: the three hook commands |
| `assets/settings/` | Step 5: the settings snippets for each choice |
