# Toolkit V2 skill index

Every skill Toolkit V2 ships, its folder, and its description word for word.
`dev/GOAL.md` wins over this file, and the design is
`dev/research/skills-first-architecture.md` (draft 2), section 4. Rewritten
2026-09-30 for the skills-first layout; the older index (plugins, agents, and
the routing rounds for the retired skills) is in Git history.

- Folders are relative to `plugins/toolkit/skills/project-setup/`.
- In a project, every skill except the three of the `toolkit` plugin
  (`project-setup`, `choosing-outside-tools`, and `writing-harness-files`)
  sits in `.claude/skills/<name>/`, and `.agents/skills` is a link to
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
- **1 skill for harness files**, `writing-harness-files`, in the `toolkit`
  plugin (Mike's yes, 2026-10-05). It is on for every folder in both hosts
  and is never copied into a project. It makes every change to a skill,
  rule, instruction file, hook, settings file, plugin manifest, or helper
  brief follow the current official pages.
- **10 shared skills** that every project gets.
- **The work tracking choice**, one per project, 1 skill, always named
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

## 1. The `toolkit` plugin's own skills (onboarding, the tool list, and harness files)

| Skill | Folder | Description |
| --- | --- | --- |
| `project-setup` | `./` | Sets up, checks, or updates Toolkit V2 in a project, moves an older claude-toolkit project onto it, or changes where work items or memory live, so projects run the same files. Use when the owner says "toolkit v2", "set up this project", "initialize this project", or "update the toolkit". Not for a Git pull; use pull-latest. Not for running the older claude-toolkit (project-sync). |
| `choosing-outside-tools` | `../choosing-outside-tools/` | Lists the outside tool the owner uses for each kind of job and how to set it up, so every computer uses the same tool. Use when he asks for a job on the list, such as "make an explainer video", and no skill for that tool is on this computer; when he asks which tool he uses for a job; or when he says "add this to my tool list". Not for doing the job when a skill for that tool is on this computer. |
| `writing-harness-files` | `../writing-harness-files/` | Makes every change to a skill, rule, AGENTS.md or CLAUDE.md, hook, settings file, plugin manifest, or helper-agent brief follow the current official Claude Code, Codex, and Agent Skills documentation. Use this whenever you or a helper agent is about to write or change one of these files, in any project, even for a small edit, and when you write the brief for a helper agent that will. Not for setting up or updating a project from the toolkit; use project-setup. |

## 2. Shared skills (every project, 10)

They never assume one tracker or memory. Every work tracking folder holds
a skill named `using-work-tracker`, and every project with local or Notion
memory has `curating-project-memory` and `using-memory-store`, so they name
all three directly. A Hindsight project has no memory skills: they send it
to its rule `.claude/rules/hindsight-memory.md`.

One skill owns each job (`dev/research/layout-audit/DESIGN-SPEC.md`,
section 5):

- `running-work-item-lifecycle` runs one work item through its States and
  hands every read and save to `using-work-tracker`. Its
  `references/closing.md` asks the closing question. It never writes
  `DECISIONS.md`, `sources/`, or `system/`.
- `filing-project-records` files what more than one work item needs, in
  three steps with fixed names: "record a decision", "file a source", and
  "update a system document". The form of each record is in its home (the
  comment at the top of `DECISIONS.md`, `sources/AGENTS.md`,
  `system/AGENTS.md`), never in the skill.
- `publish-docs` makes the commit for every document change.
- A work item's Next action names no skill (the starter's
  `.claude/rules/keep-work-item-current.md`).

| Skill | Folder | Description |
| --- | --- | --- |
| `running-work-item-lifecycle` | `assets/every-project/.claude/skills/running-work-item-lifecycle/` | Runs one work item from idea to Done through requirements, design, build, testing, deployment, and closing, keeping its record current and stopping for the owner's approval before each step that needs one. Use when the owner asks to plan, change, build, test, deploy, close, or cancel an item. Not for filing an original, or a decision or rule more than one item needs; use filing-project-records. |
| `filing-project-records` | `assets/every-project/.claude/skills/filing-project-records/` | Files the project's lasting records, each with an ID, so later work finds them: every original the project receives, in sources/; a decision or open question more than one work item needs, in DECISIONS.md; an approved change to a system/ document. Use when the owner hands over an original, such as a transcript, a decision affects more than one work item, or a closing item changed the system. Not for a decision only one item needs; use running-work-item-lifecycle. |
| `handoff` | `assets/every-project/.claude/skills/handoff/` | Updates this session's work items and Current State, files any decision or original this session left unfiled, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session, clears context, or asks for a handoff prompt or a check of one, such as "write a handoff". Not for a recap alone; use session-summary. |
| `braindump` | `assets/every-project/.claude/skills/braindump/` | Plays back a loose brain dump in very simple words and waits for the owner's yes before any work starts, so nothing is planned, built, or saved on a misunderstanding. Use when he wants his brain dump checked first, such as "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". Not for a brain dump he asks only to plan; use running-work-item-lifecycle. |
| `explain-simply` | `assets/every-project/.claude/skills/explain-simply/` | Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path, so the owner can follow it and no fact is lost. Use when he finds an answer too technical or hard to follow, for example "explain it like I'm five", "simpler", "less jargon", or "I don't get it". |
| `session-summary` | `assets/every-project/.claude/skills/session-summary/` | Recaps this chat as a table of the owner's requests, the result of each one, and which still need him, so he sees what is done and what is open. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", "what did we do today", or "summarize this session". Not for a handoff; use handoff. |
| `pull-latest` | `assets/every-project/.claude/skills/pull-latest/` | Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner asks for the remote's newest commits, such as "get the latest" or "sync with remote". Not for discarding local work; use reset-to-remote. Not for a toolkit update; use project-setup. |
| `reset-to-remote` | `assets/every-project/.claude/skills/reset-to-remote/` | Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest. |
| `merge-and-clean-up` | `assets/every-project/.claude/skills/merge-and-clean-up/` | Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session's work is removed. Use when running-work-item-lifecycle asks, or the owner names a pull request to merge, such as "merge PR 12". Not for taking an approved work item through merge and deployment; use running-work-item-lifecycle. |
| `publish-docs` | `assets/every-project/.claude/skills/publish-docs/` | Commits an approved edit to project documents, such as system/, DECISIONS.md, sources/, delivery/, and PROJECT.md, directly to the default branch, so it needs no pull request. Use when another skill hands over a document save, or the owner says "publish the docs". Not for deciding what DECISIONS.md, sources/, or system/ says; use filing-project-records. Not for code, rules, skills, or a work item; use running-work-item-lifecycle. |

## 3. The work tracking choice (one per project)

Each of the three folders holds one skill, named `using-work-tracker` in
every folder, whose description ends "Only for projects that track work
...". A project gets one of the three, so no two claim the same request.
`check-skills.mjs` matches these rows by folder. No version stores an
original: an original goes to `sources/`, and the item holds its SRC ID.

### 3.1 Local folders and Obsidian (`assets/work-local/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `using-work-tracker` | `assets/work-local/.claude/skills/using-work-tracker/` | Saves, finds, and changes work items as local files in the work-items folder, so running-work-item-lifecycle reads and writes every item the same way. Use when an item must be read, created, saved, searched, nested, or moved, such as "show me WI-031" or "put WI-007 under WI-003". Not for deciding an item's plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work locally. |

### 3.2 Notion (`assets/work-notion/`)

Moved on 2026-10-01 from `notion-work-track`, which the Notion session built
and tested (commit `82aaaa6`). Its setup steps and the Notion page texts are
in project-setup's `references/notion-build/` (`work-setup.md`,
`work-layout.md`, `work-item-page.md`, `project-page.md`).

| Skill | Folder | Description |
| --- | --- | --- |
| `using-work-tracker` | `assets/work-notion/.claude/skills/using-work-tracker/` | Saves, finds, and changes work items in the project's Notion databases, so running-work-item-lifecycle reads and writes every item the same way. Use when an item, phase, task, or question must be read, created, saved, or searched, such as "show me WI-31". Not for deciding an item's plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work in Notion. |

### 3.3 GitHub Issues (`assets/work-github/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `using-work-tracker` | `assets/work-github/.claude/skills/using-work-tracker/` | Saves, finds, and changes work items as GitHub issues, so running-work-item-lifecycle reads and writes every item the same way. Use when an item must be read, created, saved, or searched, such as "show me #12". Not for deciding an item's plan, State, or approvals; use running-work-item-lifecycle. Only for projects that track work in GitHub Issues. |

### 3.4 Jira

None. Mike deferred Jira on 2026-09-29 ("It could just maybe be like a future
thing").

## 4. Memory (local or Notion memory)

A project with local or Notion memory gets two skills (Mike, 2026-10-01):
`curating-project-memory`, the process, the same for both, which never names
a storage tool; and its own version of `using-memory-store`, storage
only. Memory holds where work stopped (Current State) and pointers: the ID
of a record and a link to it. It never holds a fact, a decision, or a term
(Mike, 2026-10-05). Every entry carries the date it was created and the
date it last changed. `check-skills.mjs` matches these rows by folder.

### 4.1 The process (`assets/memory-process/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `curating-project-memory` | `assets/memory-process/.claude/skills/curating-project-memory/` | Decides what project memory keeps, so no fact is kept twice: sends a fact to its home, adds or removes a pointer to a record, writes a standing instruction to the owner's preferences file, and prunes Current State. Use whenever the owner asks to keep, correct, or forget something or gives a standing instruction, such as "remember this" or "from now on", or a hook reminder names this skill. Not for a handoff; use handoff. |

### 4.2 Local files and Obsidian (`assets/memory-local/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `using-memory-store` | `assets/memory-local/.claude/skills/using-memory-store/` | Reads and writes Current State and the list of pointers as two local files in the memory folder, so every skill stores memory the same way. Use when Current State or a pointer must be read, added, changed, or removed, such as "what does memory point to". Not for deciding what a line says or what to keep; use curating-project-memory. Only for projects with local memory. |

### 4.3 Notion in Lore's layout (`assets/memory-notion/`)

Lore's database definitions are in its `assets/schema/`, and their columns,
views, and page layout in `references/database-layout.md` and
`references/views-and-layout.md`. Project-setup's
`references/notion-build/setup.md` sends them. A pointer is one page of the
Memories database. The databases stay as Lore has them; Topics, Entities,
and Facts are not written.

| Skill | Folder | Description |
| --- | --- | --- |
| `using-memory-store` | `assets/memory-notion/.claude/skills/using-memory-store/` | Reads and writes Current State and pointers in Notion, on the Current state page and in Lore's Memories database, so every skill stores memory the same way. Use when Current State or a pointer must be read, added, changed, or removed, such as "what does memory point to". Not for deciding what a line says or what to keep; use curating-project-memory. Only for projects with Notion memory. |

### 4.4 Hindsight

None (Mike, 2026-09-29: "Hindsight has its own complete way. It's a whole
memory engine"). Hindsight's coding-agent add-on saves each session to the
project's bank on Mike's VPS; the agent uses the add-on's `hindsight_*`
tools and keeps Current State in the local file `memory/CURRENT_STATE.md`.
The rule `.claude/rules/hindsight-memory.md`, which only a Hindsight project
gets (`assets/memory-hindsight/`), says how.

## 5. Notion's command-line tool (`assets/notion-tools/`)

Every project with work items or memory in Notion gets it, once. Both Notion
storage skills (`using-work-tracker` and `using-memory-store`) send
every `ntn` call through it, so sign-in, Codex steps, and errors are written
once.

| Skill | Folder | Description |
| --- | --- | --- |
| `using-notion-cli` | `assets/notion-tools/.claude/skills/using-notion-cli/` | Shows how to run ntn, Notion's command-line tool, for the Notion storage skills: sign-in, Codex permissions, the calls every Notion step uses, and fixes for failed calls, so reads and saves in Notion work the first time. Use before any Notion read or write, when ntn will not sign in or cannot find a page, in Codex, and whenever a Notion call fails. Only for projects that keep work or memory in Notion. |

## 6. Salesforce projects (3)

Salesforce's own skills (`forcedotcom/sf-skills`, installed with
`npx skills add forcedotcom/sf-skills`) answer Salesforce platform questions.
Toolkit V2 ships no Salesforce architect skill (Mike, 2026-10-02); setup only
checks that Salesforce's skills are installed and gives him the command. The
three skills below are Mike's own project skills: they arrive with the
`salesforce` folder, and a change to them needs Mike's yes. The `.agents/skills` link in `every-project/` points to `.claude/skills`;
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

Two skill templates are copies of project files. They are changed together
with the project file (`AGENTS.md`, "The model project and its copy"), and
`check-skills.mjs` fails when one differs from it:

| Skill file | Project file (the path a project has) |
| --- | --- |
| `running-work-item-lifecycle`: `assets/work-item-template.md` | `work-items/work-item-template/WORK-ITEM.md`, in `assets/work-local/` |
| `running-work-item-lifecycle`: `assets/design-template.md` | `work-items/work-item-template/DESIGN.md`, in `assets/work-local/` |

`filing-project-records` holds no template: the form of a decision, a
source, and a system document is in the project file itself, so there is no
copy to keep equal.

## 9. Neighbors the routing test watches

Each pair is kept apart by the situation each description names early: what
is open or waiting on the owner, or what he is doing right now
(`dev/reviews/overlap-review.md`, "The principle: situation, not trigger
words"). A "Not for ...; use <skill>." clause comes later, as a backup,
because Codex cuts long descriptions from the end. A project gets the
skills of one work tracking choice and one memory choice, so the versions
of one skill never meet.

- `running-work-item-lifecycle` and `using-work-tracker`: deciding what happens to
  an item (its State, an approval, Done, or Cancelled) goes to
  `running-work-item-lifecycle`, which hands each read and save to
  `using-work-tracker`; only a lookup or a save opens `using-work-tracker`
  alone ("show me WI-031").
- `running-work-item-lifecycle` and `filing-project-records`: one item's
  requirements, questions, design, tasks, and approvals stay with that
  item. A decision or a question that more than one item needs, an
  original the project received, and an approved change to a `system/`
  document go to `filing-project-records`. At closing, the lifecycle skill
  asks what moved up and hands each thing to `filing-project-records` by
  its step name.
- `filing-project-records` and `publish-docs`: writing the record, or
  committing it. `filing-project-records` sends every save to
  `publish-docs`; a plain document edit the owner approved goes to
  `publish-docs` alone.
- `filing-project-records` and `curating-project-memory` for "remember
  this" and "we decided": a decision goes to `filing-project-records`.
  "Remember this" goes to `curating-project-memory`, which sends the fact
  to its home and adds at most a pointer.
- `running-work-item-lifecycle` and `braindump`: a brain dump he asks only to plan
  goes to `running-work-item-lifecycle`; one he wants played back first goes to
  `braindump`.
- `curating-project-memory` and `using-memory-store`: deciding what to
  keep, correct, or forget goes to `curating-project-memory`, which hands
  each read and write to `using-memory-store`; only a lookup opens
  `using-memory-store` alone ("what does memory point to").
- `handoff` and `curating-project-memory`: the owner ends the session, or
  wants one thing kept.
- `curating-project-memory` and Claude Code's built-in `update-config` for
  "from now on" and "whenever you ...": an instruction for how the agent
  works is a line in `.claude/rules/owner-preferences.md`, never a settings
  hook.
- `using-notion-cli` and the two Notion storage skills: how to run `ntn`,
  or a Notion call that failed, opens `using-notion-cli`; a work item or a
  pointer to read or save opens the storage skill, which uses it.
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
  `using-work-tracker`, which saves it with `publish-docs`).
- `project-setup` and `pull-latest` for "update": Toolkit V2's own files, or
  this repository's Git remote.
- `project-setup` and `writing-harness-files`: setting up or updating a
  project from the toolkit, or writing or changing one skill, rule,
  instruction file, hook, settings file, manifest, or helper brief by
  hand. `writing-harness-files` is on in every folder, so check that it
  does not open for a plain "update the toolkit".
- `writing-harness-files` and the skill-creator skills on Mike's Mac
  (`anthropic-skills:skill-creator`, `skill-creator:skill-creator`): both
  match "write a skill". `writing-harness-files` says which pages to read
  and what to check; the skill-creator runs inside it.

Machine-wide skills on Mike's Mac that also match (check O7 in
`dev/reviews/overlap-review.md`):

- `project-setup` and the older claude-toolkit's `project-init` for
  "initialize this project" in a folder with no setup yet, and its
  `project-sync` for "toolkit v2" or "sync this project" in a project the
  older toolkit set up: "toolkit v2" goes to `project-setup`, which moves
  the project over (since 0.8.3).
- `running-work-item-lifecycle`, `using-work-tracker`, and the Notion plugin's own
  commands (`Notion:tasks:build` and the rest), and `curating-project-memory`
  and `Notion:search`: the starter's rule `.claude/rules/notion-records.md`
  says the plugin never replaces the project's skills.
- `curating-project-memory` and `anthropic-skills:consolidate-memory`: the
  starter's `AGENTS.md` says never to save project memory in another
  plugin's memory feature.
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
- `work-on` and `work-status` became lines in the starter's `AGENTS.md`, and
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
- `managing-work-items` became `running-work-item-lifecycle`,
  `tracking-work-items` became `using-work-tracker`,
  `managing-project-wide-records` became `filing-project-records`,
  `managing-project-memory` became `curating-project-memory`, and
  `storing-project-memory` became `using-memory-store` (Mike, 2026-10-05).
