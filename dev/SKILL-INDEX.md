# Toolkit V2 skill index

Every skill Toolkit V2 ships, its folder, and its description word for word.
`dev/GOAL.md` wins over this file, and the design is
`dev/research/skills-first-architecture.md` (draft 2), section 4. Rewritten
2026-09-30 for the skills-first layout; the older index (plugins, agents, and
the routing rounds for the retired skills) is in Git history.

- Folders are relative to `plugins/toolkit/skills/project-setup/`.
- In a project, every skill except the two of the `toolkit` plugin
  (`project-setup` and `writing-harness-files`)
  sits in `.claude/skills/<name>/`, and `.agents/skills` is a link to
  `.claude/skills`, so Claude Code and Codex read the same files.
- A description is changed in its `SKILL.md` and in this file in the same
  change. `node dev/tools/check-skills.mjs` fails when the two differ, when a
  skill has no row here, or when a row names a folder with no skill.
- After a description changes, run the routing test in both hosts again.

## Summary

- **1 onboarding skill**, `project-setup`, in the `toolkit` plugin. It is on
  for every folder in both hosts and is never copied into a project.
- **1 skill for harness files**, `writing-harness-files`, in the `toolkit`
  plugin (Mike's yes, 2026-10-05). It is on for every folder in both hosts
  and is never copied into a project. It makes every change to a harness
  file follow the current official pages. A harness file is a skill, a
  rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex
  `.rules` file, an output style, a plugin manifest or marketplace file, a
  mod, a subagent definition, or a helper-agent brief.
- **9 shared skills** that every project gets.
- **The work tracking choice** adds selected reference files to the shared
  `managing-work-items` skill: local folders with Obsidian, Notion, or GitHub
  Issues. Jira is deferred by Mike: no Jira reference files.
- **Memory**: local or Notion memory adds one `managing-project-memory` skill.
  The memory choice supplies its storage references. Hindsight memory has no
  Toolkit memory skill.
- **Notion**: work items or memory in Notion add `using-notion-cli`, once.
- **Salesforce projects** add 3 skills, plus Salesforce's own skills
  (`forcedotcom/sf-skills`), which the owner installs.
- A project has 9 + 1 = 10 skills with local or Notion memory, 11 when work
  items or memory are in Notion. With Hindsight memory, it has 9 skills, or
  10 with work items in Notion. Salesforce adds 3.

## 1. The `toolkit` plugin's own skills (onboarding and harness files)

| Skill | Folder | Description |
| --- | --- | --- |
| `project-setup` | `./` | Sets up, checks, updates, or moves a project onto Toolkit V2. It also changes the project's work or memory choice, adds SOUL.md, opens the Hindsight dashboard, or connects Hindsight on a new computer. Use for requests such as "set up this project", "check the setup", or "update the toolkit". For new commits from Git, use pull-latest. The older claude-toolkit uses project-sync. |
| `writing-harness-files` | `../writing-harness-files/` | Uses current official Claude Code and Codex guidance to write or change skills, rules, agent guides, hooks, settings, plugin files, and other harness files. Use before creating or editing one of these files. For toolkit setup, use project-setup. |

## 2. Shared skills (every project, 9)

The shared skills do not assume one tracker. Setup adds only the chosen
tracker references inside `managing-work-items`. A project with local or
Notion memory also receives `managing-project-memory`, with only its chosen
storage references. A Hindsight project has no Toolkit memory skill: its
rule `.claude/rules/hindsight-memory.md` covers that choice.

One skill owns each job (`dev/research/layout-audit/DESIGN-SPEC.md`,
section 5):

- `managing-work-items` runs one work item through its States and reads or
  saves it through the selected `references/work-tracker.md`. Its
  `references/closing.md` fills the Moved up line. It never writes
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
| `managing-work-items` | `assets/every-project/.claude/skills/managing-work-items/` | Finds and manages work items from idea to Done, keeping requirements, State, progress, and owner approvals current. Use when the owner asks about, starts, continues, changes, tests, ships, closes, or cancels a work item, or changes project phases or project tasks. For shared decisions, sources, and system rules, use filing-project-records. |
| `filing-project-records` | `assets/every-project/.claude/skills/filing-project-records/` | Files sources the project receives in sources/, decisions and open questions that more than one work item needs in DECISIONS.md, and changes to documents about system rules in system/. Each record gets an ID so later work can find it. Use when the owner gives the project a source, a shared decision or question needs recording, or a system document needs updating. For a decision that only one work item needs, use managing-work-items. |
| `handoff` | `assets/every-project/.claude/skills/handoff/` | Updates this session's work items and the project's Current State, files decisions or sources left unfiled, and writes a checked, self-contained prompt for the next session or checks one the owner provides. Use when the owner ends a session, clears context, asks for a handoff prompt, or asks to check one. For a recap without a handoff, use session-summary. |
| `braindump` | `assets/every-project/.claude/skills/braindump/` | Plays back the owner's loose ideas in simple words and waits for the owner's yes before starting work. Use when the owner asks "tell me what you heard", "play that back", or otherwise asks to check understanding first. When the owner asks only to plan the idea, use managing-work-items. |
| `session-summary` | `assets/every-project/.claude/skills/session-summary/` | Puts the owner's requests, each result, and what still needs the owner in a table. Use when the owner asks to recap or summarize this session. For a prompt that lets a new session continue the work, use handoff. |
| `pull-latest` | `assets/every-project/.claude/skills/pull-latest/` | Fetches and merges new remote commits into the local repository while preserving local work and commit history. Use when the owner asks to "get the latest" or "sync with remote". For discarding local work, use reset-to-remote. For updating installed Toolkit V2 files, use project-setup. |
| `reset-to-remote` | `assets/every-project/.claude/skills/reset-to-remote/` | Shows a plan, then makes the local repository match its remote by discarding local commits and removing branches whose remote branches are gone. Use only when the owner explicitly asks to "wipe local", "match remote exactly", or start fresh from the remote. For a routine update that keeps local work, use pull-latest. |
| `merge-and-clean-up` | `assets/every-project/.claude/skills/merge-and-clean-up/` | Merges one approved GitHub pull request only after its checks and the merge-safety check pass. It then removes only that pull request's branches and worktree. Use when the owner names a pull request to merge or managing-work-items requests its merge. For an entire work item through merge and deployment, use managing-work-items. |
| `publish-docs` | `assets/every-project/.claude/skills/publish-docs/` | Commits an approved edit to project documents directly to the default branch. Use when another skill asks for a document save or the owner asks to "publish the docs". For deciding what belongs in DECISIONS.md, sources/, or system/, use filing-project-records. For code, rules, skills, or work items, use managing-work-items. |

## 3. The work tracking choice

`managing-work-items` is a shared skill, listed in section 2. Its
`references/work-tracker.md` contains the selected tracker instructions.
The work choice supplies that file and its supporting references. Setup
copies exactly one of these folders:

| Choice | Folder supplying references | What it keeps |
| --- | --- | --- |
| Local folders and Obsidian | `assets/work-local/.claude/skills/managing-work-items/` | Work items in `work-items/`, and `PROJECT-ROADMAP.md`. |
| Notion | `assets/work-notion/.claude/skills/managing-work-items/` | Work items, phases, tasks, and questions in Notion. |
| GitHub Issues | `assets/work-github/.claude/skills/managing-work-items/` | Work items as GitHub issues. |

Moved on 2026-10-01 from `notion-work-track`, which the Notion session built
and tested (commit `82aaaa6`). Its setup steps and the Notion page texts are
in project-setup's `references/notion-build/` (`work-setup.md`,
`work-layout.md`, `work-item-page.md`, `project-page.md`).

No version stores a source the project received: it goes to `sources/`, and
the work item holds its SRC ID. Mike deferred Jira on 2026-09-29 ("It could
just maybe be like a future thing").

## 4. Memory (local or Notion memory)

A project with local or Notion memory gets one `managing-project-memory`
skill. Its common process is in `assets/memory-process/`. The selected memory
choice supplies `references/memory-store.md` and its supporting files inside
the same skill. Hindsight has no Toolkit memory skill.

Memory is the Davis-based design restored on 2026-10-05
(`dev/research/layout-audit/MEMORY-RESTORE-SPEC.md`): the project's Current
State and one record per subject in four kinds (`user_`, `project_`,
`reference_`, `event_`). Memory holds what no other project file holds. It
does not hold a decision several work items need, a project term, or how the
system works. Every record has a creation date and a last-change date; a
record true only for a while also has a "check or remove by" date.

| Skill | Folder | Description |
| --- | --- | --- |
| `managing-project-memory` | `assets/memory-process/.claude/skills/managing-project-memory/` | Finds, saves, corrects, and retires project memory and keeps the project’s Current State accurate. Use when the owner asks to remember, find, change, or forget something; reports a fact, date, or recurring job run; or a turn leaves information that no other project record holds and a later session needs. For a work item, use managing-work-items; for a shared decision or source, use filing-project-records. |

| Choice | Folder supplying references | What it keeps |
| --- | --- | --- |
| Local files and Obsidian | `assets/memory-local/.claude/skills/managing-project-memory/` | Memory records and the project's Current State in `memory/`. |
| Notion in Lore's layout | `assets/memory-notion/.claude/skills/managing-project-memory/` | Memory pages and the Current state page in Notion. |

Lore's database definitions are in the Notion choice's `assets/schema/`.
The columns, views, and page layout are in its `references/database-layout.md`
and `references/views-and-layout.md`. Project-setup's
`references/notion-build/setup.md` sends them. The databases stay as Lore
has them; the Topics database, the `decision` tag, and the glossary page
are not written.

### Hindsight

Hindsight's coding-agent add-on saves each session to the project's bank on
Mike's VPS; the agent uses the add-on's `hindsight_*` tools and keeps the
project's Current State in `memory/CURRENT_STATE.md`. The rule
`.claude/rules/hindsight-memory.md`, which only a Hindsight project gets
(`assets/memory-hindsight/`), says how. Mike decided on 2026-09-29 that
Hindsight's memory system needed no Toolkit memory skill.

## 5. Notion's command-line tool (`assets/notion-tools/`)

Every project with work items or memory in Notion gets it once. The Notion
references inside `managing-work-items` or `managing-project-memory` send
every `ntn` call through it, so sign-in, Codex steps, and errors are written
once.

| Skill | Folder | Description |
| --- | --- | --- |
| `using-notion-cli` | `assets/notion-tools/.claude/skills/using-notion-cli/` | Explains how to run ntn for this project's Notion work and memory records, including sign-in, Codex access, API calls, and failed calls. Use before a Notion read or write through ntn, or when a call fails. This skill applies only when the project keeps work items or memory in Notion. |

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
| `sf-deploy-check` | `assets/salesforce/.claude/skills/sf-deploy-check/` | Checks whether a Salesforce deploy would include components or edits beyond the intended change, or whose feature is not ready in the target org. Use before a deploy to a shared org or before giving the owner a deploy command. For deciding whether a work item is ready or for running the deploy, use managing-work-items. |
| `sf-component-tracker` | `assets/salesforce/.claude/skills/sf-component-tracker/` | Keeps the Salesforce component tracker CSV, master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync with metadata edits. Use before building when a component under force-app/ will change, when a deploy result arrives, or when a deploy needs manual steps. Update the records in the same response as the metadata change. |
| `sf-data-change` | `assets/salesforce/.claude/skills/sf-data-change/` | Prepares the owner's handoff for a Salesforce production data change: the load file, backup, numbered steps, success check, and undo steps. Use when the owner asks to load, import, update, or delete production records, including during a build. The owner runs the change. |

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

Two skill templates are copies of project files. They are changed together
with the project file (`AGENTS.md`, "The model project and its copy"), and
`check-skills.mjs` fails when one differs from it:

| Skill file | Project file (the path a project has) |
| --- | --- |
| `managing-work-items`: `assets/work-item-template.md` | `work-items/work-item-template/WORK-ITEM.md`, in `assets/work-local/` |
| `managing-work-items`: `assets/design-template.md` | `work-items/work-item-template/DESIGN.md`, in `assets/work-local/` |

`filing-project-records` holds no template: the form of a decision, a
source, and a system document is in the project file itself, so there is no
copy to keep equal.

## 9. Neighbors the routing test watches

Each pair is kept apart by the situation each description names early: what
is open or waiting on the owner, or what he is doing right now
(`dev/reviews/overlap-review.md`, "The principle: situation, not trigger
words"). A "Not for ...; use <skill>." clause comes later, as a backup,
because Codex cuts long descriptions from the end. A project gets one
work tracker reference and, for local or Notion memory, one memory store
reference. Different backend instructions never meet in one project.

- `managing-work-items` and `filing-project-records`: one item's
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
- `filing-project-records` and `managing-project-memory` for "remember
  this" and "we decided": a decision goes to `filing-project-records`.
  "Remember this" goes to `managing-project-memory`, which sends a fact
  that has a home to that home and keeps in memory only what no other
  project file holds.
- `managing-work-items` and `managing-project-memory` for a to-do
  or an action item: it goes to `managing-work-items`, as a project
  task or a task in its work item. A date it carries also gets a line in
  Current State, which `managing-project-memory` decides.
- `session-summary` and `managing-project-memory` for "what did we do":
  what happened in this chat goes to `session-summary`; what happened in a
  period, such as yesterday or last week, goes to
  `managing-project-memory`, which reads the records.
- `managing-work-items` and `braindump`: a brain dump he asks only to plan
  goes to `managing-work-items`; one he wants played back first goes to
  `braindump`.
- `handoff` and `managing-project-memory`: the owner ends the session, or
  wants one thing kept.
- `managing-project-memory` and Claude Code's built-in `update-config` for
  "from now on" and "whenever you ...": an instruction for how the agent
  works is a line in `.claude/rules/owner-preferences.md`, never a settings
  hook.
- `using-notion-cli` and the two skills that read and store work items and
  memory in Notion: a Notion sign-in or failed `ntn` call opens
  `using-notion-cli`. A work item or a memory record opens
  `managing-work-items` or `managing-project-memory`, which uses the
  Notion reference and `using-notion-cli`.
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
  `references/work-tracker.md`, which saves it with `publish-docs`).
- `project-setup` and `pull-latest` for "update": Toolkit V2's own files, or
  this repository's Git remote.
- `project-setup` and `writing-harness-files`: setting up or updating a
  project from the toolkit, or writing or changing one harness file by
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
- `managing-work-items` and the Notion plugin's own commands
  (`Notion:tasks:build` and the rest), and `managing-project-memory` and
  `Notion:search`: the starter's rule `.claude/rules/notion-records.md`
  says the plugin never replaces the project's skills.
- `managing-project-memory` and `anthropic-skills:consolidate-memory`: the
  starter's `AGENTS.md` says never to save project memory in another
  plugin's memory feature.
- `managing-project-memory` (local memory) and `obsidian:obsidian-cli` for
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
- On 2026-10-06, Mike chose `managing-work-items` and
  `managing-project-memory` as the current entry skills. The former tracker
  and memory-store skill bodies moved into selected references inside them.
