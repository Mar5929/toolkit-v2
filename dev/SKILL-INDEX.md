# Toolkit V2 skill index

Every skill Toolkit V2 ships, its folder, and its description word for word.
`dev/GOAL.md` wins over this file, and the design is
`dev/research/skills-first-architecture.md` (draft 2), section 4. Rewritten
2026-09-30 for the skills-first layout; the older index (plugins, agents, and
the routing rounds for the retired skills) is in Git history.

- Folders are relative to `plugins/toolkit/skills/project-setup/`.
- In a project, every skill except `project-setup` and
  `choosing-outside-tools` sits in
  `.claude/skills/<name>/`, and `.agents/skills` is a link to
  `.claude/skills`, so Claude Code and Codex read the same files.
- A description is changed in its `SKILL.md` and in this file in the same
  change. `node dev/tools/check-skills.mjs` fails when the two differ, when a
  skill has no row here, or when a row names a folder with no skill.
- After a description changes, run the routing test in both hosts again.

## Summary

- **1 onboarding skill**, `project-setup`, in the `toolkit` plugin. It is on
  for every folder in both hosts and is never copied into a project.
- **1 tool list skill**, `choosing-outside-tools`, in the `toolkit` plugin
  (TKV-18). It is on for every folder in both hosts and is never copied into
  a project. It lists the outside tool the owner uses for each kind of job.
- **10 shared skills** that every project gets.
- **Work tracking sets**, one per project, 1 skill each, always named
  `using-work-tracker`: local folders with Obsidian, Notion, or GitHub
  Issues. Jira is deferred by Mike: no Jira skills.
- **Memory**: local or Notion memory adds 2 skills, `curating-project-memory`
  (the process, the same for both) and the project's own version of
  `using-memory-store` (local files with Obsidian, or Notion in Lore's
  layout). Hindsight memory has no toolkit skills.
- **Notion**: work items or memory in Notion add `using-notion-cli`, once.
- **Salesforce projects** add 3 skills, plus Salesforce's own skills
  (`forcedotcom/sf-skills`), which the owner installs.
- A project has 10 + 1 + 2 = 13 skills, 14 with work items or memory in
  Notion; with Hindsight memory, 11, or 12 with work items in Notion.
  Salesforce adds 3.

## 1. The `toolkit` plugin's own skills (onboarding and the tool list)

| Skill | Folder | Description |
| --- | --- | --- |
| `project-setup` | `./` | Sets up, checks, or updates Toolkit V2 in a project, moves an older claude-toolkit project onto it, or changes where work items or memory live, so projects run the same files. Use when the owner says "toolkit v2", "set up this project", "initialize this project", or "update the toolkit". Not for a Git pull; use pull-latest. Not for running the older claude-toolkit (project-sync). |
| `choosing-outside-tools` | `../choosing-outside-tools/` | Lists the outside tool the owner uses for each kind of job and how to set it up, so every computer uses the same tool. Use when he asks for a job on the list, such as "make an explainer video", and no skill for that tool is on this computer; when he asks which tool he uses for a job; or when he says "add this to my tool list". Not for doing the job when a skill for that tool is on this computer. |

## 2. Shared skills (every project, 10)

They never assume one tracker or memory. Every work tracking set holds a
skill named `using-work-tracker`, and every project with local or Notion
memory has `curating-project-memory`, so they name both directly. A
Hindsight project has no memory skills: they send it to "Project memory" in
the project's `AGENTS.md`.

`running-work-item-lifecycle` runs every work item through its States and hands
every read and save to `using-work-tracker`. A work item's Next action
names no skill (the model's `.claude/rules/keep-work-item-current.md`).

| Skill | Folder | Description |
| --- | --- | --- |
| `running-work-item-lifecycle` | `assets/every-project/.claude/skills/running-work-item-lifecycle/` | Runs a work item from idea to Done through requirements, design, build, testing, reflection, and deployment, keeping its tracker current and asking for the owner's approval at each gate. Use when the owner asks to plan, change, build, test, or ship an item. When a source, question, or target direction affects other items, also use filing-project-records. |
| `filing-project-records` | `assets/every-project/.claude/skills/filing-project-records/` | Files what more than one work item needs: records a decision or open question in DECISIONS.md, files an original in sources/, and applies an approved change to a system/ document, each with its ID and a pointer in the work item. Use when a decision or question reaches past one item ("we decided", "let's go with"), the owner hands over a transcript or document, or a closing item changed the system. Not for one item's own requirements or decisions; use running-work-item-lifecycle. |
| `handoff` | `assets/every-project/.claude/skills/handoff/` | Updates this session's work items and Current State, offers what is worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session or says "write a handoff", "I'm clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary. |
| `braindump` | `assets/every-project/.claude/skills/braindump/` | Plays back a loose brain dump in very simple words and waits for the owner's yes before any work starts, so nothing is planned, built, or saved on a misunderstanding. Use when he wants his brain dump checked first, such as "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". Not for a brain dump he asks only to plan; use running-work-item-lifecycle. |
| `explain-simply` | `assets/every-project/.claude/skills/explain-simply/` | Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path, so the owner can follow it and no fact is lost. Use when he finds an answer too technical or hard to follow, for example "explain it like I'm five", "simpler", "less jargon", or "I don't get it". |
| `session-summary` | `assets/every-project/.claude/skills/session-summary/` | Recaps this chat as a table of the owner's requests, the result of each one, and which still need him, so he sees what is done and what is open. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", "what did we do today", or "summarize this session". Not for a handoff; use handoff. |
| `pull-latest` | `assets/every-project/.claude/skills/pull-latest/` | Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner says "get the latest", "pull the latest changes", "sync with remote", or "update from origin". Not for throwing away local work; use reset-to-remote. Not for a toolkit update; use project-setup. |
| `reset-to-remote` | `assets/every-project/.claude/skills/reset-to-remote/` | Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest. |
| `merge-and-clean-up` | `assets/every-project/.claude/skills/merge-and-clean-up/` | Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session's work is removed. Use when running-work-item-lifecycle asks, or the owner names a pull request: "merge PR 12", "merge and clean up", "land this pull request". Not for shipping an approved work item; use running-work-item-lifecycle. |
| `publish-docs` | `assets/every-project/.claude/skills/publish-docs/` | Commits project document edits (requirements/, system guide, project-wide records, PROJECT-ROADMAP.md, PROJECT.md, READMEs) to the default branch, so it needs no pull request and touches no other session. Use when the owner asked for or approved a document edit, or says "publish the docs" or "save the docs to main". Not for a work item's requirements, or for code, rules, or skills; use running-work-item-lifecycle. |

## 3. Work tracking sets (one per project)

Each set holds one skill, named `using-work-tracker` in every set, whose
description ends "Only for projects that track work ...". A project holds
one set, so no two sets claim the same request. `check-skills.mjs` matches
these rows by folder.

### 3.1 Local folders and Obsidian (`assets/work-local/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `using-work-tracker` | `assets/work-local/.claude/skills/using-work-tracker/` | Saves, finds, and changes work items as local files in the work-items folder, so running-work-item-lifecycle reads and writes every item the same way. Use when an item must be read, created, saved, searched, nested, moved, or given a source file, such as "show me WI-031" or "put WI-007 under WI-003". Not for deciding States or approvals; use running-work-item-lifecycle. Only for projects that track work locally. |

### 3.2 Notion (`assets/work-notion/`)

Moved on 2026-10-01 from `notion-work-track`, which the Notion session built
and tested (commit `82aaaa6`). Its setup steps and the Notion page texts are
in project-setup's `references/notion-build/` (`work-setup.md`,
`work-layout.md`, `work-item-page.md`, `project-page.md`).

| Skill | Folder | Description |
| --- | --- | --- |
| `using-work-tracker` | `assets/work-notion/.claude/skills/using-work-tracker/` | Stores and finds work items in the project's Notion databases for running-work-item-lifecycle, so every read and save lands in the right property or page section. Use when looking up or saving a work item, phase, task, question, comment, or file, such as "show me WI-31" or "add a task to phase 2". Only for projects that track work in Notion. |

### 3.3 GitHub Issues (`assets/work-github/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `using-work-tracker` | `assets/work-github/.claude/skills/using-work-tracker/` | Saves, finds, and changes work items as GitHub issues, so running-work-item-lifecycle reads and writes every item the same way. Use when an item must be read, created, saved, or searched, such as "show me #12" or "what is waiting on me". Not for deciding States or approvals; use running-work-item-lifecycle. Only for projects that track work in GitHub Issues. |

### 3.4 Jira

None. Mike deferred Jira on 2026-09-29 ("It could just maybe be like a future
thing").

## 4. Memory (local or Notion memory)

A project with local or Notion memory gets two skills (Mike, 2026-10-01):
`curating-project-memory`, the process, the same for both, which never names
a storage tool; and its own version of `using-memory-store`, storage
only. Memory is kept by concept, like a wiki: one record per concept, not
one per fact. `check-skills.mjs` matches these rows by folder.

### 4.1 The process (`assets/memory-process/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `curating-project-memory` | `assets/memory-process/.claude/skills/curating-project-memory/` | Keeps project memory to where work stopped and pointers to records: sends each fact the owner wants kept to its home, adds or removes a pointer, writes "from now on" instructions to the project rules, and tidies memory, so no fact is kept twice. Use whenever the owner says "remember this", "forget that", "from now on", or "clean up memory", or a hook reminder names this skill. Not for a handoff; use handoff. |

### 4.2 Local files and Obsidian (`assets/memory-local/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `using-memory-store` | `assets/memory-local/.claude/skills/using-memory-store/` | Reads and writes Current State and the list of pointers as two local files in the memory folder, so every skill stores memory the same way. Use when Current State or a pointer must be read, added, changed, or removed, for example a line that another skill hands over, or "what does memory point to". Not for deciding what a line says or what to keep; use curating-project-memory. Only for projects with local memory. |

### 4.3 Notion in Lore's layout (`assets/memory-notion/`)

Lore's database definitions are in its `assets/schema/`, and their columns,
views, and page layout in `references/database-layout.md` and
`references/views-and-layout.md`. Project-setup's
`references/notion-build/setup.md` sends them.

| Skill | Folder | Description |
| --- | --- | --- |
| `using-memory-store` | `assets/memory-notion/.claude/skills/using-memory-store/` | Reads and writes Current State and pointers in Notion, on the Current state page and in the Memories database of Lore's layout, so every skill stores memory the same way. Use when Current State or a pointer must be read, added, changed, or removed, for example a line that another skill hands over, or "what does memory point to". Not for deciding what a line says or what to keep; use curating-project-memory. Only for projects with Notion memory. |

### 4.4 Hindsight

None (Mike, 2026-09-29: "Hindsight has its own complete way. It's a whole
memory engine"). Hindsight's coding-agent add-on saves each session to the
project's bank on Mike's VPS; the agent uses the add-on's `hindsight_*`
tools and keeps Current State in the local file `memory/CURRENT_STATE.md`.
The model's memory rule says how.

## 5. Notion's command-line tool (`assets/notion-tools/`)

Every project with work items or memory in Notion gets it, once. Both Notion
storage skills (`using-work-tracker` and `using-memory-store`) send
every `ntn` call through it, so sign-in, Codex steps, and errors are written
once.

| Skill | Folder | Description |
| --- | --- | --- |
| `using-notion-cli` | `assets/notion-tools/.claude/skills/using-notion-cli/` | Shows how to run ntn, Notion's command-line tool, for the Notion storage skills: sign-in, Codex permissions, the calls every Notion step uses, and fixes for failed calls, so reads and saves in Notion work the first time. Use before any Notion read or write, when ntn will not sign in or cannot find a page, in Codex, and whenever a Notion call fails. using-work-tracker and using-memory-store use it for every call. Only for projects that keep work or memory in Notion. |

## 6. Salesforce projects (3)

Salesforce's own skills (`forcedotcom/sf-skills`, installed with
`npx skills add forcedotcom/sf-skills`) answer Salesforce platform questions.
Toolkit V2 ships no Salesforce architect skill (Mike, 2026-10-02); setup only
checks that Salesforce's skills are installed and gives him the command. The
three skills below are the model's own project skills: they arrive with the
`salesforce` folder, and a change to them is a model change that needs Mike's
yes. The `.agents/skills` link in `every-project/` points to `.claude/skills`;
onboarding removes it from the setup copy and makes the project's own link.

| Skill | Folder | Description |
| --- | --- | --- |
| `sf-deploy-check` | `assets/salesforce/.claude/skills/sf-deploy-check/` | Finds components or edits that a Salesforce deploy would ship beyond the intended change, so no unfinished or unintended work reaches a shared org. Use when a deploy to a shared org (UAT, full copy, staging, or production) is about to run, or before the owner gets a deploy command. Not for testing whether a work item is ready, or for running the deploy; use running-work-item-lifecycle. |
| `sf-component-tracker` | `assets/salesforce/.claude/skills/sf-component-tracker/` | Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so no changed component is left out of a deploy. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before building and update the records in the same response), a deploy result comes back, or a deploy needs manual steps. |
| `sf-data-change` | `assets/salesforce/.claude/skills/sf-data-change/` | Builds the owner's handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use when the owner asks to load, import, update, or delete production records, even inside a build, for example "load this file into production". |

## 7. Helper briefs

Each helper is a brief file inside the skill that starts it (Mike, draft 2
answers): the skill starts a general helper agent with that brief, the same
way in both hosts, with nothing to register. The acceptance checker always
runs before the owner is asked to approve a result (Mike, 2026-09-28).

| Helper | File |
| --- | --- |
| Requirements analyst | `running-work-item-lifecycle`: `references/requirements-analyst-brief.md` |
| Researcher | `running-work-item-lifecycle`: `references/researcher-brief.md` |
| Design architect | `running-work-item-lifecycle`: `references/design-architect-brief.md` |
| Design critic | `running-work-item-lifecycle`: `references/design-critic-brief.md` |
| Builder | `running-work-item-lifecycle`: `references/builder-brief.md` |
| Acceptance checker | `running-work-item-lifecycle`: `references/acceptance-checker-brief.md` |
| Handoff verifier | `handoff`: `references/handoff-verifier.md`, a copy of `dev/build-shared/helper-briefs/handoff-verifier.md` |

## 8. Shared texts

A skill reads only files in its own folder, so text several skills need is
copied into each one. The source is in `dev/build-shared/`, and each copy's
first line names it. Edit the source, then copy it over every copy
(`grep -rl 'dev/build-shared/<file>' plugins` lists them).
`check-skills.mjs` fails on a copy that differs from its source.

| Source | Skills that hold a copy (in `references/`, unless the row says `assets/`) |
| --- | --- |
| `helper-briefs/handoff-verifier.md` | `handoff` |

Some skill templates are copies of project files. They are changed together
with the project file (`AGENTS.md`, "The model project and its copy"), and
`check-skills.mjs` fails when one differs from it:

| Skill file | Project file (the path a project has) |
| --- | --- |
| `running-work-item-lifecycle`: `assets/work-item-template.md` | `work-items/work-item-template/WORK-ITEM.md` |
| `running-work-item-lifecycle`: `assets/design-template.md` | `work-items/work-item-template/DESIGN.md` |

The five assets of `filing-project-records` were copies of
`project-wide-records/templates/`. The starter project no longer has that
folder (TKV-24), so `check-skills.mjs` compares nothing for them.

## 9. Neighbors the routing test watches

Each pair is kept apart by the situation each description names early: what
is open or waiting on the owner, or what he is doing right now
(`dev/reviews/overlap-review.md`, "The principle: situation, not trigger
words"). A "Not for ...; use <skill>." clause comes later, as a backup,
because Codex cuts long descriptions from the end. The project's setup keeps
the sets apart (draft 2, section 4.6).

- `running-work-item-lifecycle` and `using-work-tracker`: deciding what happens to
  an item (its State, an approval, Done, or Cancelled) goes to
  `running-work-item-lifecycle`, which hands each read and save to
  `using-work-tracker`; only a lookup or a save opens `using-work-tracker`
  alone ("show me WI-031").
- `running-work-item-lifecycle` and `filing-project-records`: one item's
  requirements, questions, design, tasks, and approvals stay with that
  item. The project-wide skill opens when a source, answer, or target
  direction affects several items; it links back to each authority.
- `filing-project-records` and `curating-project-memory`: active
  shared questions and intake receipts stay in project-wide records;
  lasting selected decisions follow the chosen memory route.
- `running-work-item-lifecycle` and `braindump`: a brain dump he asks only to plan
  goes to `running-work-item-lifecycle`; one he wants played back first goes to
  `braindump`.
- `curating-project-memory` and `using-work-tracker`: what was recorded, or
  where one item stands.
- `curating-project-memory` and `using-memory-store`: deciding what to
  keep, correct, or forget goes to `curating-project-memory`, which hands
  each read and save to `using-memory-store`; only a lookup opens
  `using-memory-store` alone ("which memory files link to WI-031").
- `handoff` and `curating-project-memory`: the owner ends the session, or
  wants one thing kept. A handoff saves only what the owner says yes to.
- `curating-project-memory` and Claude Code's built-in `update-config` for
  "from now on" and "whenever you ...": an instruction for how the agent
  works is a line in `.claude/rules/owner-preferences.md`, never a settings
  hook.
- `using-notion-cli` and the two Notion storage skills: how to run `ntn`,
  or a Notion call that failed, opens `using-notion-cli`; a work item or a
  memory to read or save opens the storage skill, which uses it.
- `handoff` and `running-work-item-lifecycle` for "check it": a pasted handoff
  prompt ("check this handoff") goes to `handoff`; testing a work item goes
  to `running-work-item-lifecycle` (the Testing Loop).
- `running-work-item-lifecycle` and `sf-deploy-check` for "is WI-31 ready to go to
  UAT": the item is tested first (`running-work-item-lifecycle`); `sf-deploy-check`
  runs when a deploy to a shared org is about to run.
- `running-work-item-lifecycle` and `merge-and-clean-up` for "merge it": an item
  whose result the owner approved goes to `running-work-item-lifecycle` (Deploying);
  a pull request he names ("merge PR 12"), or one `running-work-item-lifecycle`
  hands over, goes to `merge-and-clean-up`.
- `publish-docs` and `running-work-item-lifecycle` for "update the roadmap": the
  project's phases and one item's plan both go to `running-work-item-lifecycle`
  (since 0.8.0, a local project's `PROJECT-ROADMAP.md` is changed through
  `using-work-tracker`, which saves it with `publish-docs`). A plain
  document edit he already approved may still go to `publish-docs`.
- `project-setup` and `pull-latest` for "update": Toolkit V2's own files, or
  this repository's Git remote.
- `curating-project-memory` and `running-work-item-lifecycle` for "help me plan
  this" and "design this": `running-work-item-lifecycle` opens first and searches
  memory with `curating-project-memory` itself (the model's `AGENTS.md`
  says so). Check which skill opens first.

Machine-wide skills on Mike's Mac that also match (check O7 in
`dev/reviews/overlap-review.md`):

- `project-setup` and the older claude-toolkit's `project-init` for
  "initialize this project" in a folder with no setup yet, and its
  `project-sync` for "toolkit v2" or "sync this project" in a project the
  older toolkit set up: "toolkit v2" goes to `project-setup`, which moves
  the project over (since 0.8.3).
- `running-work-item-lifecycle`, `using-work-tracker`, and the Notion plugin's own
  commands (`Notion:tasks:build` and the rest), and `curating-project-memory`
  and `Notion:search`: the model's `AGENTS.md` says the plugin never
  replaces the project's skills.
- `curating-project-memory` and `anthropic-skills:consolidate-memory`: the
  model's `AGENTS.md` says never to use `consolidate-memory`.
- `curating-project-memory` (local memory) and `obsidian:obsidian-cli` for
  "search my notes".

## 10. Retired skills

- `work-refine`, `solution-design`, `work-delegate`, `work-check`, and
  `work-finish` became `running-work-item-lifecycle`, and `local-work-track`,
  `notion-work-track`, and `github-work-track` became the three versions of
  `using-work-tracker` (Mike, 2026-10-01).
- `work-requirements`, `requirements-helper`, and `grill-me` became
  `work-refine`.
- `work-decide` joined `work-status`; `work-organize` was split between the
  work track skills and `work-on`.
- `work-on` and `work-status` became lines in the model's `AGENTS.md`, and
  each work find skill joined its work track skill (Mike, 2026-10-01).
- `local-memory-save`, `local-memory-find`, `local-memory-refine`,
  `notion-memory-save`, `notion-memory-find`, and `notion-memory-refine`
  became `curating-project-memory` and the two versions of
  `using-memory-store`. The `ntn` text that each of them and the Notion
  `using-work-tracker` held became `using-notion-cli` (Mike, 2026-10-01).
- `memory-save`, `memory-find`, and `memory-tidy` became one set per storage
  option; `memory-tidy` became `local-memory-refine` and
  `notion-memory-refine`.
- `spec-check`, `work-guide`, and `track-tasks` were folded into
  `work-refine`, `AGENTS.md`, and Current State.
- `unslop` was retired (Mike, 2026-09-29).
