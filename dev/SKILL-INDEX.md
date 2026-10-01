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
- **13 shared skills** that every project gets.
- **Work tracking sets**, one per project, 1 skill each: local folders with
  Obsidian, Notion, or GitHub Issues. Jira is deferred by Mike: no Jira
  skills.
- **Memory sets**, one per project, 3 skills each: local files with Obsidian,
  or Notion in Lore's layout. Hindsight memory has no toolkit skills.
- **Salesforce projects** add 4 skills.
- A project has 13 + 1 + 3 = 17 skills, or 21 with Salesforce; with Hindsight
  memory, 14 or 18.

## 1. Onboarding (the `toolkit` plugin)

| Skill | Folder | Description |
| --- | --- | --- |
| `project-setup` | `./` | Sets up, checks, or updates Toolkit V2 in a project, or changes where work items or memory are kept, by copying the model project, skills, and hooks, so projects run the same files. Use when the owner says "set up this project", "initialize this project", "update the toolkit", or "check the setup". Not for a Git pull; use pull-latest. Not for the older claude-toolkit (project-init, project-sync). |

## 2. Shared skills (every project, 13)

They never assume one tracker or memory. They say "the project's work track
skill", "memory save skill", and "memory find skill", and
the "Skills" section of the project's `AGENTS.md` names which ones it has. In
a Hindsight project they say "Hindsight's retain and recall tools, as the
memory rule says".

Five of them are the stage skills: `work-refine`, `solution-design`,
`work-delegate`, `work-check`, and `work-finish`. A work item's Next action
names one of these five for its next step (a build step names none), and
never a work track, memory, Salesforce, or machine-wide skill, because those
differ by setup (the model's `.claude/rules/keep-work-item-current.md`).

| Skill | Folder | Description |
| --- | --- | --- |
| `work-refine` | `assets/.shared-skills/work-refine/` | Refines a work item from a rough idea, notes, or files into approved requirements, a roadmap, and sub-items, one question at a time, so any session resumes it. Use before its requirements are approved or when a requirement changes, such as "help me plan this", "here are the meeting notes", "grill me", or "what am I missing". Not for design; use solution-design. Not for a playback; use braindump. |
| `solution-design` | `assets/.shared-skills/solution-design/` | Writes design options, with screens and flows, for a work item whose requirements are approved, recommends one, and records the owner's choice in the item and design, so the build follows his choice. Use when approved requirements need a design and no question on them is open, such as "design this", "how should we build it", or "give me options". Not for what the result must do; use work-refine. |
| `work-delegate` | `assets/.shared-skills/work-delegate/` | Hands a work item to helper agents with the owner as product owner, runs them from this chat, and updates each helper's sub-item and tasks, so helpers work separate sub-items in parallel while he only decides. Use when the owner hands an item over or says yes to agents running it, for example "you drive", "take it from here", or "run with it". |
| `work-check` | `assets/.shared-skills/work-check/` | Tests a finished work item against every requirement's acceptance check with an independent checker agent, records the result, and asks the owner to approve it, so nothing reaches him untested. Use when a work item's build is done, or the owner asks "check it", "is it ready", "does it work", or "test it". Not for a pasted handoff; use handoff. Not for shipping or closing; use work-finish. |
| `work-finish` | `assets/.shared-skills/work-finish/` | Ships and closes a whole work item whose result the owner approved (merge, deployment, specification update), or cancels any item, and asks him before marking it Done, so nothing merges, deploys, or closes without his yes. Use when he says "ship it", "merge it", "mark it done", or "cancel WI-031". Not for testing a build; use work-check. Not for a task's status; use the work track skill. |
| `handoff` | `assets/.shared-skills/handoff/` | Updates this session's work items and Current State, offers what is worth keeping to memory, then writes a checked, self-contained prompt for a new session, or checks a pasted one, so nothing is lost when context clears. Use when the owner ends the session or says "write a handoff", "I'm clearing context", "start a new session", or "check this handoff". Not for a recap alone; use session-summary. |
| `braindump` | `assets/.shared-skills/braindump/` | Plays back a loose brain dump in very simple words and waits for the owner's yes before any work starts, so nothing is planned, built, or saved on a misunderstanding. Use when he wants his brain dump checked first, such as "here's a brain dump", "play that back", "tell me what you heard", or "make sure you understood before you start". Not for a brain dump he asks only to plan; use work-refine. |
| `explain-simply` | `assets/.shared-skills/explain-simply/` | Re-explains the last answer, a plan, or a named document as short plain bullets, keeping every number, name, and path, so the owner can follow it and no fact is lost. Use when he finds an answer too technical or hard to follow, for example "explain it like I'm five", "simpler", "less jargon", or "I don't get it". |
| `session-summary` | `assets/.shared-skills/session-summary/` | Recaps this chat as a table of the owner's requests, the result of each one, and which still need him, so he sees what is done and what is open. Use when he asks what happened in this chat, for example "recap this chat", "what did I ask for", "what did we do today", or "summarize this session". Not for a handoff; use handoff. |
| `pull-latest` | `assets/.shared-skills/pull-latest/` | Brings the local repository up to date with its remote by fetching and merging, never rebasing or resetting, so no local work or shared history is lost. Use when the owner says "get the latest", "pull the latest changes", "sync with remote", or "update from origin". Not for throwing away local work; use reset-to-remote. Not for a toolkit update; use project-setup. |
| `reset-to-remote` | `assets/.shared-skills/reset-to-remote/` | Makes the local repository an exact copy of its remote, discarding local commits and branches the remote no longer has, after showing a plan, so cloning again is not needed and nothing is lost without warning. Use only when the owner asks for it in his own words, for example "wipe local", "match remote exactly", or "fresh start from remote". Not for a routine update; use pull-latest. |
| `merge-and-clean-up` | `assets/.shared-skills/merge-and-clean-up/` | Merges one approved GitHub pull request, then removes only its branches and worktree, after its checks and the merge-safety check pass, so nothing unchecked is merged and no other session's work is removed. Use when work-finish asks, or the owner names a pull request: "merge PR 12", "merge and clean up", "land this pull request". Not for shipping an approved work item; use work-finish. |
| `publish-docs` | `assets/.shared-skills/publish-docs/` | Commits project document edits (requirements/, system guide, PROJECT-ROADMAP.md, PROJECT.md, READMEs) to the default branch, so it needs no pull request and touches no other session. Use when the owner asked for or approved a document edit, or says "publish the docs" or "save the docs to main". Not for a work item's requirements; use work-refine. Not for code, rules, or skills; use work-finish. |

## 3. Work tracking sets (one per project)

Each set's descriptions end "Only for projects that track work ...". A
project holds one set, so no two sets claim the same request.

### 3.1 Local folders and Obsidian (`assets/.skill-sets/local-work/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `local-work-track` | `assets/.skill-sets/local-work/local-work-track/` | Finds, creates, and changes work items in work-items/ folders: lookups, fields, phases, tasks, questions, sub-items, and moves, so each read and write matches the files. Use when finding or changing an item, such as "show me WI-031" or "add a task to phase 2". Not for closing or cancelling; use work-finish. Only for projects that track work locally. |

### 3.2 Notion (`assets/.skill-sets/notion-work/`)

Built and tested by the Notion session (commit `82aaaa6`).

| Skill | Folder | Description |
| --- | --- | --- |
| `notion-work-track` | `assets/.skill-sets/notion-work/notion-work-track/` | Finds, creates, and changes work items in Notion: lookups, fields, phases, tasks, questions, sub-items, comments, and files, so each read and write matches the tracker. Use when finding or changing an item, such as "show me WI-31" or "add a task to phase 2". Not for closing or cancelling; use work-finish. Only for projects that track work in Notion. |

### 3.3 GitHub Issues (`assets/.skill-sets/github-work/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `github-work-track` | `assets/.skill-sets/github-work/github-work-track/` | Finds, creates, and changes work items in GitHub Issues: lookups, labels, phases, tasks, questions, sub-issues, and the design, so each read and write matches the issues. Use when finding or changing an item, such as "show me #12" or "add a task to phase 2". Not for closing or cancelling; use work-finish. Only for projects that track work in GitHub. |

### 3.4 Jira

None. Mike deferred Jira on 2026-09-29 ("It could just maybe be like a future
thing").

## 4. Memory sets (one per project)

### 4.1 Local files and Obsidian (`assets/.skill-sets/local-memory/`)

| Skill | Folder | Description |
| --- | --- | --- |
| `local-memory-save` | `assets/.skill-sets/local-memory/local-memory-save/` | Saves facts, lessons, and project-wide decisions to local memory, changes to Current State, and "from now on" instructions to project rules, never settings.json hooks, so later sessions follow them. Use when the owner wants something kept, corrected, or forgotten, such as "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with local memory. |
| `local-memory-find` | `assets/.skill-sets/local-memory/local-memory-find/` | Searches this project's local memory, rules, requirements, and memories linked to work items, and cites every source, so each answer comes from what was agreed. Use when the owner asks what was decided or recorded before, or why, such as "what did we decide", "do we know", or "search my notes". Not for planning or design; use work-refine or solution-design. Only for projects with local memory. |
| `local-memory-refine` | `assets/.skill-sets/local-memory/local-memory-refine/` | Reviews all this project's local memory: merges duplicates, retires stale files, fixes work item links, prunes Current State, and proposes proven lessons as rules or skills, so memory stays small and true. Use when the owner says "refine memory" or "clean up memory", or the session-start hook says so. Not for fixing one memory; use local-memory-save. Only for projects with local memory. |

### 4.2 Notion in Lore's layout (`assets/.skill-sets/notion-memory/`)

Built and tested by the Notion session (commit `82aaaa6`).

| Skill | Folder | Description |
| --- | --- | --- |
| `notion-memory-save` | `assets/.skill-sets/notion-memory/notion-memory-save/` | Saves facts, lessons, and project-wide decisions to Notion memory, changes to Current state, and "from now on" instructions to project rules, never settings.json hooks, so later sessions follow them. Use when the owner wants something kept, corrected, or forgotten, such as "remember this", "whenever you ...", or "forget that". Not for a handoff; use handoff. Only for projects with Notion memory. |
| `notion-memory-find` | `assets/.skill-sets/notion-memory/notion-memory-find/` | Searches this project's Notion memory, Current state, and memories linked to work items, and cites each source, so each answer comes from what was agreed. Use when the owner asks what was decided or recorded before, or why, such as "what did we decide", "do we know", or "search Notion for it". Not for planning or design; use work-refine or solution-design. Only for projects with Notion memory. |
| `notion-memory-refine` | `assets/.skill-sets/notion-memory/notion-memory-refine/` | Reviews all this project's Notion memory: merges duplicates, retires stale records, fixes work item links, prunes Current state, and proposes proven lessons as rules or skills, so memory stays small and true. Use when the owner says "refine memory" or "clean up memory", or the session-start hook says so. Not for fixing one memory; use notion-memory-save. Only for projects with Notion memory. |

### 4.3 Hindsight

None (Mike, 2026-09-29: "Hindsight has its own complete way. It's a whole
memory engine"). The agent uses Hindsight's own `retain`, `recall`, and
`reflect` tools, tags each memory `wi:<ID>`, and keeps Current State in the
local file `memory/CURRENT_STATE.md`. The model's memory rule says how.

## 5. Salesforce projects (4)

`sf-architect-solutioning` is copied from `assets/.salesforce/`. Its
description was rewritten on 2026-09-27, and its body was reworded and given
a "Which phases to run" section on 2026-09-30, both with Mike's yes. The
other three are the model's own project skills: they arrive with the model
copy, and a change to them is a model change that needs Mike's yes. The
model's `.agents/skills` is a link to `.claude/skills`; onboarding removes it
from the setup copy and makes the project's own link.

| Skill | Folder | Description |
| --- | --- | --- |
| `sf-architect-solutioning` | `assets/.salesforce/sf-architect-solutioning/` | Answers Salesforce platform questions, checking each fact against official Salesforce docs, so every design uses verified platform behavior. Use whenever the owner asks a Salesforce platform question that needs no design options, even about a work item ("which Flow type", "Flow or Apex"), or solution-design asks for platform facts. Not for planning or design; use work-refine or solution-design. |
| `sf-deploy-check` | `assets/model/.claude/skills/sf-deploy-check/` | Finds components or edits that a Salesforce deploy would ship beyond the intended change, so no unfinished or unintended work reaches a shared org. Use when a deploy to a shared org (UAT, full copy, staging, or production) is about to run, or before the owner gets a deploy command. Not for checking whether a work item is ready; use work-check. Not for running the deploy; use work-finish. |
| `sf-component-tracker` | `assets/model/.claude/skills/sf-component-tracker/` | Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so no changed component is left out of a deploy. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before building and update the records in the same response), a deploy result comes back, or a deploy needs manual steps. |
| `sf-data-change` | `assets/model/.claude/skills/sf-data-change/` | Builds the owner's handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use when the owner asks to load, import, update, or delete production records, even inside a build, for example "load this file into production". |

## 6. Helper briefs

Each helper is a brief file inside the skill that starts it (Mike, draft 2
answers): the skill starts a general helper agent with that brief, the same
way in both hosts, with nothing to register. The acceptance checker always
runs before the owner is asked to approve a result (Mike, 2026-09-28).

| Helper | Source | Skills that hold it (file) |
| --- | --- | --- |
| Acceptance checker | `dev/build-shared/helper-briefs/acceptance-checker.md` | `work-check` (`references/acceptance-checker.md`) |
| Builder | `dev/build-shared/helper-briefs/builder.md` | `work-delegate` (`references/builder-brief.md`) |
| Design architect | `dev/build-shared/helper-briefs/design-architect.md` | `solution-design` (`references/design-architect.md`) |
| Design critic | `dev/build-shared/helper-briefs/design-critic.md` | `solution-design` (`references/design-critic.md`) |
| Requirements analyst | `dev/build-shared/helper-briefs/requirements-analyst.md` | `work-refine` (`references/requirements-analyst.md`) |
| Researcher | `dev/build-shared/helper-briefs/researcher.md` | `work-refine`, `solution-design` (`references/researcher.md`) |
| Handoff verifier | `dev/build-shared/helper-briefs/handoff-verifier.md` | `handoff` (`references/handoff-verifier.md`) |

## 7. Shared texts

A skill reads only files in its own folder, so text several skills need is
copied into each one. The source is in `dev/build-shared/`, and each copy's
first line names it. Edit the source, then copy it over every copy
(`grep -rl 'dev/build-shared/<file>' plugins` lists them).
`check-skills.mjs` fails on a copy that differs from its source.

| Source | Skills that hold a copy (in `references/`, unless the row says `assets/`) |
| --- | --- |
| `git-rules.md` | `work-delegate` |
| `notion/ntn-basics.md` | `notion-work-track`, `notion-memory-find`, `notion-memory-save`, `notion-memory-refine` |
| `notion/notion-access.md` | `notion-work-track`, `notion-memory-find`, `notion-memory-save`, `notion-memory-refine` |
| `notion/record-mapping.md` | `notion-memory-find`, `notion-memory-save`, `notion-memory-refine` |
| `notion/current-state.md` | `notion-memory-save`, `notion-memory-refine` |
| `github/gh-access.md` | `github-work-track` |
| `github/gh-basics.md` | `github-work-track` |
| `local-memory/record-format.md` | `local-memory-save`, `local-memory-refine` |
| `helper-briefs/*.md` | Section 6 |

Some skill templates are copies of the model's files. They are refreshed with
the model copy (`AGENTS.md`, "Refresh the model copy"), and `check-skills.mjs`
fails when one differs from the model:

| Skill file | Model file |
| --- | --- |
| `github-work-track`: `assets/WORK-ITEM.md` | `work-items/work-item-template/WORK-ITEM.md` |
| `solution-design`: `assets/DESIGN.md` | `work-items/work-item-template/DESIGN.md` |

## 8. Neighbors the routing test watches

Each pair is kept apart by the situation each description names early: the
work item's stage, what is open or waiting on the owner, or what he is doing
right now (`dev/reviews/overlap-review.md`, "The principle: situation, not
trigger words"). A "Not for ...; use <skill>." clause comes later, as a
backup, because Codex cuts long descriptions from the end. The project's
setup keeps the sets apart (draft 2, section 4.6).

- `work-refine` and `solution-design` for "give me options": while a
  requirements question is open, before or after approval, options are
  answers to it (`work-refine`); after approval, with no such question open,
  they are design options (`solution-design`).
- `work-refine` and `braindump`: a brain dump he asks only to plan goes to
  `work-refine`; one he wants played back first goes to `braindump`.
- The memory find skill and the work track skill: what was recorded, or where
  one item stands.
- `handoff` and the memory save skill: the owner ends the session, or wants
  one thing kept. A handoff saves only what the owner says yes to.
- The memory save skill and the memory refine skill: one memory kept,
  corrected, or forgotten, or a review of all memory.
- The memory save skill and Claude Code's built-in `update-config` for "from
  now on" and "whenever you ...": an instruction for how the agent works is a
  line in `.claude/rules/owner-preferences.md`, never a settings hook.
- `handoff` and `work-check` for "check it": a pasted handoff prompt ("check
  this handoff") goes to `handoff`, never to `work-check`, which tests a work
  item.
- `work-check` and `sf-deploy-check` for "is WI-31 ready to go to UAT": the
  item is tested first (`work-check`); `sf-deploy-check` runs when a deploy
  to a shared org is about to run.
- `work-finish` and the work track skill for "mark ... done": one task, named
  or described ("mark task 3 done", "I made the sandbox") goes to the work
  track skill; marking a whole item Done, or cancelling it, goes to
  `work-finish`.
- `work-finish` and `merge-and-clean-up` for "merge it": an item whose result
  the owner approved goes to `work-finish`; a pull request he names ("merge
  PR 12"), or one `work-finish` asks about, goes to `merge-and-clean-up`.
- `publish-docs` and `work-refine` for "update the roadmap": the
  `PROJECT-ROADMAP.md` file, or one item's plan. When it is unclear, ask one
  short question.
- `project-setup` and `pull-latest` for "update": Toolkit V2's own files, or
  this repository's Git remote.
- The memory find skill, `work-refine`, and `solution-design` for "help me
  plan this" and "design this": the memory find skill's "Not for planning or
  design; use work-refine or solution-design." clause keeps them apart, so
  `work-refine` or `solution-design` opens first and runs the memory find
  skill itself. Check which skill opens first.

Machine-wide skills on Mike's Mac that also match (check O7 in
`dev/reviews/overlap-review.md`):

- `project-setup` and the older claude-toolkit's `project-init` for
  "initialize this project" in a folder with no setup yet.
- The work skills and the Notion plugin's own commands (`Notion:tasks:build`
  and the rest), and the memory find skill and `Notion:search`: the model's
  `AGENTS.md` says the plugin never replaces the project's skills.
- The memory refine skill and `anthropic-skills:consolidate-memory`: the
  model's `AGENTS.md` says never to use `consolidate-memory`.
- `local-memory-find` and `obsidian:obsidian-cli` for "search my notes".

## 9. Retired skills

- `work-requirements`, `requirements-helper`, and `grill-me` became
  `work-refine`.
- `work-decide` joined `work-status`; `work-organize` was split between the
  work track skills and `work-on`.
- `work-on` and `work-status` became lines in the model's `AGENTS.md`, and
  each work find skill joined its work track skill (Mike, 2026-10-01).
- `memory-save`, `memory-find`, and `memory-tidy` became one set per storage
  option; `memory-tidy` is now `local-memory-refine` and
  `notion-memory-refine`.
- `spec-check`, `work-guide`, and `track-tasks` were folded into
  `work-refine`, `AGENTS.md`, and Current State.
- `unslop` was retired (Mike, 2026-09-29).
