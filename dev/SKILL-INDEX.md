# Toolkit V2 skill index

Every skill Toolkit V2 ships, its folder, and its description word for word.
`dev/GOAL.md` wins over this file, and the design is
`dev/research/skills-first-architecture.md` (draft 2), section 4. Rewritten
2026-09-30 for the skills-first layout; the older index (plugins, agents, and
the routing rounds for the retired skills) is in Git history.

- Folders are relative to `plugins/toolkit/skills/project-setup/`.
- In a project, every skill except `project-setup` sits in
  `.claude/skills/<name>/`, and `.agents/skills` is a link to
  `.claude/skills`, so Claude Code and Codex read the same files.
- A description is changed in its `SKILL.md` and in this file in the same
  change. `node dev/tools/check-skills.mjs` fails when the two differ, when a
  skill has no row here, or when a row names a folder with no skill.
- After a description changes, run the routing test in both hosts again.

## Summary

- **1 onboarding skill**, `project-setup`, in the `toolkit` plugin. It is on
  for every folder in both hosts and is never copied into a project.
- **9 shared skills** that every project gets.
- **Work tracking sets**, one per project, 1 skill each, always named
  `tracking-work-items`: local folders with Obsidian, Notion, or GitHub
  Issues. Jira is deferred by Mike: no Jira skills.
- **Memory**: local or Notion memory adds 2 skills, `managing-project-memory`
  (the process, the same for both) and the project's own version of
  `storing-project-memory` (local files with Obsidian, or Notion in Lore's
  layout). Hindsight memory has no toolkit skills.
- **Notion**: work items or memory in Notion add `using-notion-cli`, once.
- **Salesforce projects** add 3 skills, plus Salesforce's own skills
  (`forcedotcom/sf-skills`), which the owner installs.
- A project has 9 + 1 + 2 = 12 skills, 13 with work items or memory in
  Notion; with Hindsight memory, 10, or 11 with work items in Notion.
  Salesforce adds 3.

## 1. Onboarding (the `toolkit` plugin)

| Skill | Folder | Description |
| --- | --- | --- |
| `project-setup` | `./` | Sets up, checks, or updates Toolkit V2 in a project, moves an older claude-toolkit project onto it, or changes where work items or memory live, so projects run the same files. Use when the owner says "toolkit v2", "set up this project", "initialize this project", or "update the toolkit". Not for a Git pull; use pull-latest. Not for running the older claude-toolkit (project-sync). |

## 2. Shared skills (every project, 9)

They never assume one tracker or memory. Every work tracking set holds a
skill named `tracking-work-items`, and every project with local or Notion
memory has `managing-project-memory`, so they name both directly. A
Hindsight project has no memory skills: they send it to "Project memory" in
the project's `AGENTS.md`.

`managing-work-items` runs every work item through its States and hands
every read and save to `tracking-work-items`. A work item's Next action
names no skill (the model's `.claude/rules/keep-work-item-current.md`).

| Skill | Folder | Description |
| --- | --- | --- |
| `managing-work-items` | `assets/.shared-skills/managing-work-items/` | Runs every work item in this project from idea to Done: refining requirements by interview, designing, building, the testing loop, reflecting, and deploying, and stops for the owner's OK at each approval point. Use this whenever the owner mentions a work item, a feature, a bug, a plan, requirements, a design, a build, testing, or shipping, even if he does not name this skill. |
| `handoff` | `assets/.shared-skills/handoff/` | Updates this session's work items and Current State, offers what is worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session or says "write a handoff", "I'm clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary. |
| `braindump` | `assets/.shared-skills/braindump/` | Plays back a loose brain dump in very simple words and waits for the owner's yes before any work starts, so nothing is planned, built, or saved on a misunderstanding. Use when he wants his brain dump checked first, such as "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". Not for a brain dump he asks only to plan; use managing-work-items. |
| `explain-simply` | `assets/.shared-skills/explain-simply/` | Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path, so the owner can follow it and no fact is lost. Use when he finds an answer too technical or hard to follow, for example "explain it like I'm five", "simpler", "less jargon", or "I don't get it". |
| `session-summary` | `assets/.shared-skills/session-summary/` | Recaps this chat as a table of the owner's requests, the result of each one, and which still need him, so he sees what is done and what is open. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", "what did we do today", or "summarize this session". Not for a handoff; use handoff. |
| `pull-latest` | `assets/.shared-skills/pull-latest/` | Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner says "get the latest", "pull the latest changes", "sync with remote", or "update from origin". Not for throwing away local work; use reset-to-remote. Not for a toolkit update; use project-setup. |
| `reset-to-remote` | `assets/.shared-skills/reset-to-remote/` | Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest. |
| `merge-and-clean-up` | `assets/.shared-skills/merge-and-clean-up/` | Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session's work is removed. Use when managing-work-items asks, or the owner names a pull request: "merge PR 12", "merge and clean up", "land this pull request". Not for shipping an approved work item; use managing-work-items. |
| `publish-docs` | `assets/.shared-skills/publish-docs/` | Commits project document edits (requirements/, system guide, PROJECT-ROADMAP.md, PROJECT.md, READMEs) to the default branch, so it needs no pull request and touches no other session. Use when the owner asked for or approved a document edit, or says "publish the docs" or "save the docs to main". Not for a work item's requirements, or for code, rules, or skills; use managing-work-items. |

## 3. Work tracking sets (one per project)

Each set holds one skill, named `tracking-work-items` in every set, whose
description ends "Only for projects that track work ...". A project holds
one set, so no two sets claim the same request. `check-skills.mjs` matches
these rows by folder.

### 3.1 Local folders and Obsidian (`assets/.skill-sets/local-work/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `tracking-work-items` | `assets/.skill-sets/local-work/tracking-work-items/` | Saves, finds, and changes work items as local files in the work-items folder, so managing-work-items reads and writes every item the same way. Use when an item must be read, created, saved, searched, nested, moved, or given a source file, such as "show me WI-031" or "put WI-007 under WI-003". Not for deciding States or approvals; use managing-work-items. Only for projects that track work locally. |

### 3.2 Notion (`assets/.skill-sets/notion-work/`)

Moved on 2026-10-01 from `notion-work-track`, which the Notion session built
and tested (commit `82aaaa6`). Its setup steps and the Notion page texts are
in project-setup's `references/notion-build/` (`work-setup.md`,
`work-layout.md`, `work-item-page.md`, `project-page.md`).

| Skill | Folder | Description |
| --- | --- | --- |
| `tracking-work-items` | `assets/.skill-sets/notion-work/tracking-work-items/` | Stores and finds work items in the project's Notion databases for managing-work-items, so every read and save lands in the right property or page section. Use when looking up or saving a work item, phase, task, question, comment, or file, such as "show me WI-31" or "add a task to phase 2". Only for projects that track work in Notion. |

### 3.3 GitHub Issues (`assets/.skill-sets/github-work/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `tracking-work-items` | `assets/.skill-sets/github-work/tracking-work-items/` | Saves, finds, and changes work items as GitHub issues, so managing-work-items reads and writes every item the same way. Use when an item must be read, created, saved, or searched, such as "show me #12" or "what is waiting on me". Not for deciding States or approvals; use managing-work-items. Only for projects that track work in GitHub Issues. |

### 3.4 Jira

None. Mike deferred Jira on 2026-09-29 ("It could just maybe be like a future
thing").

## 4. Memory (local or Notion memory)

A project with local or Notion memory gets two skills (Mike, 2026-10-01):
`managing-project-memory`, the process, the same for both, which never names
a storage tool; and its own version of `storing-project-memory`, storage
only. Memory is kept by concept, like a wiki: one record per concept, not
one per fact. `check-skills.mjs` matches these rows by folder.

### 4.1 The process (`assets/.skill-sets/memory-process/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `managing-project-memory` | `assets/.skill-sets/memory-process/managing-project-memory/` | Keeps project memory true and small: saves facts, lessons, decisions, glossary terms, and Current State; corrects, retires, or deletes what is wrong; writes "from now on" instructions to the project rules; finds what was recorded before; tidies all memory. Use whenever the owner says "remember this", "forget that", "from now on", "what did we decide", or "clean up memory", or a hook says to review memory, even if he does not name this skill. Not for a handoff; use handoff. |

### 4.2 Local files and Obsidian (`assets/.skill-sets/local-memory/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `storing-project-memory` | `assets/.skill-sets/local-memory/storing-project-memory/` | Saves, finds, and changes project memory as Markdown files in the memory folder, so managing-project-memory reads and writes every memory the same way. Use when a memory must be read, saved, searched, renamed, retired, or deleted, such as "which memory files link to WI-031". Not for deciding what to keep or when to ask; use managing-project-memory. Only for projects with local memory. |

### 4.3 Notion in Lore's layout (`assets/.skill-sets/notion-memory/`)

Lore's database definitions are in its `assets/schema/`, and their columns,
views, and page layout in `references/database-layout.md` and
`references/views-and-layout.md`. Project-setup's
`references/notion-build/setup.md` sends them.

| Skill | Folder | Description |
| --- | --- | --- |
| `storing-project-memory` | `assets/.skill-sets/notion-memory/storing-project-memory/` | Stores and finds this project's memory in Notion, in Lore's five databases and the Current state page, for managing-project-memory, so every memory lands in the right column and page section. Use when a memory or the Current state must be read, saved, changed, searched, linked to a work item, merged, or deleted, or when the glossary is edited. Not for deciding what to keep or when to ask; use managing-project-memory. Only for projects with Notion memory. |

### 4.4 Hindsight

None (Mike, 2026-09-29: "Hindsight has its own complete way. It's a whole
memory engine"). Hindsight's coding-agent add-on saves each session to the
project's bank on Mike's VPS; the agent uses the add-on's `hindsight_*`
tools and keeps Current State in the local file `memory/CURRENT_STATE.md`.
The model's memory rule says how.

## 5. Notion's command-line tool (`assets/.skill-sets/notion-tools/`)

Every project with work items or memory in Notion gets it, once. Both Notion
storage skills (`tracking-work-items` and `storing-project-memory`) send
every `ntn` call through it, so sign-in, Codex steps, and errors are written
once.

| Skill | Folder | Description |
| --- | --- | --- |
| `using-notion-cli` | `assets/.skill-sets/notion-tools/using-notion-cli/` | Shows how to run ntn, Notion's command-line tool, for the Notion storage skills: sign-in, Codex permissions, the calls every Notion step uses, and fixes for failed calls, so reads and saves in Notion work the first time. Use before any Notion read or write, when ntn will not sign in or cannot find a page, in Codex, and whenever a Notion call fails. tracking-work-items and storing-project-memory use it for every call. Only for projects that keep work or memory in Notion. |

## 6. Salesforce projects (3)

Salesforce's own skills (`forcedotcom/sf-skills`, installed with
`npx skills add forcedotcom/sf-skills`) answer Salesforce platform questions.
Toolkit V2 ships no Salesforce architect skill (Mike, 2026-10-02); setup only
checks that Salesforce's skills are installed and gives him the command. The
three skills below are the model's own project skills: they arrive with the
model copy, and a change to them is a model change that needs Mike's yes. The
model's `.agents/skills` is a link to `.claude/skills`; onboarding removes it
from the setup copy and makes the project's own link.

| Skill | Folder | Description |
| --- | --- | --- |
| `sf-deploy-check` | `assets/model/.claude/skills/sf-deploy-check/` | Finds components or edits that a Salesforce deploy would ship beyond the intended change, so no unfinished or unintended work reaches a shared org. Use when a deploy to a shared org (UAT, full copy, staging, or production) is about to run, or before the owner gets a deploy command. Not for testing whether a work item is ready, or for running the deploy; use managing-work-items. |
| `sf-component-tracker` | `assets/model/.claude/skills/sf-component-tracker/` | Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so no changed component is left out of a deploy. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before building and update the records in the same response), a deploy result comes back, or a deploy needs manual steps. |
| `sf-data-change` | `assets/model/.claude/skills/sf-data-change/` | Builds the owner's handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use when the owner asks to load, import, update, or delete production records, even inside a build, for example "load this file into production". |

## 7. Helper briefs

Each helper is a brief file inside the skill that starts it (Mike, draft 2
answers): the skill starts a general helper agent with that brief, the same
way in both hosts, with nothing to register. The acceptance checker always
runs before the owner is asked to approve a result (Mike, 2026-09-28).

| Helper | File |
| --- | --- |
| Requirements analyst | `managing-work-items`: `references/requirements-analyst-brief.md` |
| Researcher | `managing-work-items`: `references/researcher-brief.md` |
| Design architect | `managing-work-items`: `references/design-architect-brief.md` |
| Design critic | `managing-work-items`: `references/design-critic-brief.md` |
| Builder | `managing-work-items`: `references/builder-brief.md` |
| Acceptance checker | `managing-work-items`: `references/acceptance-checker-brief.md` |
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

Some skill templates are copies of the model's files. They are refreshed with
the model copy (`AGENTS.md`, "Refresh the model copy"), and `check-skills.mjs`
fails when one differs from the model:

| Skill file | Model file |
| --- | --- |
| `managing-work-items`: `assets/work-item-template.md` | `work-items/work-item-template/WORK-ITEM.md` |
| `managing-work-items`: `assets/design-template.md` | `work-items/work-item-template/DESIGN.md` |
| `managing-project-memory`: `references/memory-criteria.md` | `memory/memory-criteria.md` |

## 9. Neighbors the routing test watches

Each pair is kept apart by the situation each description names early: what
is open or waiting on the owner, or what he is doing right now
(`dev/reviews/overlap-review.md`, "The principle: situation, not trigger
words"). A "Not for ...; use <skill>." clause comes later, as a backup,
because Codex cuts long descriptions from the end. The project's setup keeps
the sets apart (draft 2, section 4.6).

- `managing-work-items` and `tracking-work-items`: deciding what happens to
  an item (its State, an approval, Done, or Cancelled) goes to
  `managing-work-items`, which hands each read and save to
  `tracking-work-items`; only a lookup or a save opens `tracking-work-items`
  alone ("show me WI-031").
- `managing-work-items` and `braindump`: a brain dump he asks only to plan
  goes to `managing-work-items`; one he wants played back first goes to
  `braindump`.
- `managing-project-memory` and `tracking-work-items`: what was recorded, or
  where one item stands.
- `managing-project-memory` and `storing-project-memory`: deciding what to
  keep, correct, or forget goes to `managing-project-memory`, which hands
  each read and save to `storing-project-memory`; only a lookup opens
  `storing-project-memory` alone ("which memory files link to WI-031").
- `handoff` and `managing-project-memory`: the owner ends the session, or
  wants one thing kept. A handoff saves only what the owner says yes to.
- `managing-project-memory` and Claude Code's built-in `update-config` for
  "from now on" and "whenever you ...": an instruction for how the agent
  works is a line in `.claude/rules/owner-preferences.md`, never a settings
  hook.
- `using-notion-cli` and the two Notion storage skills: how to run `ntn`,
  or a Notion call that failed, opens `using-notion-cli`; a work item or a
  memory to read or save opens the storage skill, which uses it.
- `handoff` and `managing-work-items` for "check it": a pasted handoff
  prompt ("check this handoff") goes to `handoff`; testing a work item goes
  to `managing-work-items` (the Testing Loop).
- `managing-work-items` and `sf-deploy-check` for "is WI-31 ready to go to
  UAT": the item is tested first (`managing-work-items`); `sf-deploy-check`
  runs when a deploy to a shared org is about to run.
- `managing-work-items` and `merge-and-clean-up` for "merge it": an item
  whose result the owner approved goes to `managing-work-items` (Deploying);
  a pull request he names ("merge PR 12"), or one `managing-work-items`
  hands over, goes to `merge-and-clean-up`.
- `publish-docs` and `managing-work-items` for "update the roadmap": the
  project's phases and one item's plan both go to `managing-work-items`
  (since 0.8.0, a local project's `PROJECT-ROADMAP.md` is changed through
  `tracking-work-items`, which saves it with `publish-docs`). A plain
  document edit he already approved may still go to `publish-docs`.
- `project-setup` and `pull-latest` for "update": Toolkit V2's own files, or
  this repository's Git remote.
- `managing-project-memory` and `managing-work-items` for "help me plan
  this" and "design this": `managing-work-items` opens first and searches
  memory with `managing-project-memory` itself (the model's `AGENTS.md`
  says so). Check which skill opens first.

Machine-wide skills on Mike's Mac that also match (check O7 in
`dev/reviews/overlap-review.md`):

- `project-setup` and the older claude-toolkit's `project-init` for
  "initialize this project" in a folder with no setup yet, and its
  `project-sync` for "toolkit v2" or "sync this project" in a project the
  older toolkit set up: "toolkit v2" goes to `project-setup`, which moves
  the project over (since 0.8.3).
- `managing-work-items`, `tracking-work-items`, and the Notion plugin's own
  commands (`Notion:tasks:build` and the rest), and `managing-project-memory`
  and `Notion:search`: the model's `AGENTS.md` says the plugin never
  replaces the project's skills.
- `managing-project-memory` and `anthropic-skills:consolidate-memory`: the
  model's `AGENTS.md` says never to use `consolidate-memory`.
- `managing-project-memory` (local memory) and `obsidian:obsidian-cli` for
  "search my notes".

## 10. Retired skills

- `work-refine`, `solution-design`, `work-delegate`, `work-check`, and
  `work-finish` became `managing-work-items`, and `local-work-track`,
  `notion-work-track`, and `github-work-track` became the three versions of
  `tracking-work-items` (Mike, 2026-10-01).
- `work-requirements`, `requirements-helper`, and `grill-me` became
  `work-refine`.
- `work-decide` joined `work-status`; `work-organize` was split between the
  work track skills and `work-on`.
- `work-on` and `work-status` became lines in the model's `AGENTS.md`, and
  each work find skill joined its work track skill (Mike, 2026-10-01).
- `local-memory-save`, `local-memory-find`, `local-memory-refine`,
  `notion-memory-save`, `notion-memory-find`, and `notion-memory-refine`
  became `managing-project-memory` and the two versions of
  `storing-project-memory`. The `ntn` text that each of them and the Notion
  `tracking-work-items` held became `using-notion-cli` (Mike, 2026-10-01).
- `memory-save`, `memory-find`, and `memory-tidy` became one set per storage
  option; `memory-tidy` became `local-memory-refine` and
  `notion-memory-refine`.
- `spec-check`, `work-guide`, and `track-tasks` were folded into
  `work-refine`, `AGENTS.md`, and Current State.
- `unslop` was retired (Mike, 2026-09-29).
