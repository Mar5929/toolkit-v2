# Toolkit V2: skills-first architecture (draft 1, 2026-09-29)

Draft for Mike's review. Replaces the `toolkit` program approach
(`dev/GOAL.md`, "Direction change"). Nothing here is built yet.

## Principles

- Rules hold what the agent must always follow. Skills hold procedures. Hooks
  only remind the agent which skill to use at a moment, or stop an action
  that must never happen.
- The agent picks a skill from its description. Each skill folder holds its
  own references, templates, and examples.
- Every tool is used as it comes: plain files and Obsidian, Notion through its
  official connector or `ntn`, GitHub through `gh`. No custom program.
- The rules are the same in every project. Only storage changes: setup turns
  on one work-tracking module and one memory module.
- `AGENTS.md` is a short map with pointers, not a manual.

## What setup creates in a new project

The `project-setup` skill asks three questions (tracker, memory, Salesforce),
copies the model project's files from its own `assets/` folder, and turns on
the matching modules in `.claude/settings.json` and `.codex/config.toml`.

| File or folder | What it is |
| --- | --- |
| `AGENTS.md` | The map: what the project is, where things live, which tracker and memory, which skill to use when, how to write replies (for Codex) |
| `CLAUDE.md` | One line: `@AGENTS.md` |
| `SOUL.md` | How the agent works with Mike |
| `PROJECT.md`, `PROJECT-ROADMAP.md`, `README.md` | Project facts, phases, and the intro for people; `PROJECT.md` records the tracker and memory choice and any Notion IDs |
| `.claude/rules/` | The always-on rules from the model, plus `owner-preferences.md` for Mike's "from now on" instructions |
| `.claude/output-styles/plain-english.md` + `"outputStyle": "Plain English"` in `.claude/settings.json` | Claude Code uses the Plain English style automatically |
| `.claude/settings.json`, `.codex/config.toml` | Which modules are on, the hooks, permission rules |
| `requirements/`, `system-guide/`, `tests/`, `ai-external-knowledge/` | As in the model |
| `.work-items/` | Only with the local tracker |
| `.memory/` | Only with local memory |
| `delivery/`, `tools/`, `sfdx-project.json`, Salesforce rules and guards | Only in Salesforce projects (the model's own guard hooks) |

Removed: `DECISIONS.md`, the backup folder, generated dashboards and state
files, `.toolkit.json` (its content moves to `PROJECT.md`).

## Modules

| Module | On when | Contents |
| --- | --- | --- |
| `toolkit` | Always | `project-setup` skill, the hooks below |
| `work` | Always | The 9 work skills and the shared work references: stages, statuses, approvals, `WORK-ITEM.md` and `DESIGN.md` templates |
| One tracker module | Setup choice | One skill, `work-tracker`, with that tool's instructions and templates: local folders, Notion (Work Items, Phases, Tasks from the Notion template), GitHub Issues (later) |
| `memory` | Always | `memory-save`, `memory-find`, `memory-tidy` and the shared memory references: what goes where, record format, decisions, citing sources, links to work items |
| One memory module | Setup choice | One skill, `memory-store`, with that tool's instructions: local Markdown with Obsidian, Notion in Lore's layout, Hindsight (later) |
| `session-skills`, `git-workflows` | Always | braindump, explain-simply, handoff, session-summary, unslop; merge-and-clean-up, publish-docs, pull-latest, reset-to-remote |
| `salesforce` | Salesforce projects | sf-architect-solutioning (the model's own `sf-*` project skills come with the scaffold) |

Only one tracker module and one memory module are on in a project, so the
agent never reads instructions for a tool the project does not use. The work
and memory skills say "use the `work-tracker` skill" or "use the
`memory-store` skill" for every read and write.

## Work tracking

- Same rules for every tracker: 14 stages, 6 statuses, requirements approval
  before a build, design approval, result approval, only Mike marks Done.
- Skills (the agent picks them by description):
  - `work-on`: start, resume, and build a work item; update it after each step.
  - `work-status`: where things stand and what is next.
  - `work-requirements`: interview Mike, write requirements, get approval.
  - `solution-design`: design options, Mike picks one.
  - `work-delegate`: hand an item to a team of agents.
  - `work-check`: test the result with an independent checker, ask for approval.
  - `work-finish`: ship and close as Done, or cancel.
  - `work-decide`: take Mike through decisions items wait on.
  - `work-organize`: split, nest, move items; notice items Mike moved by hand.
- Schema and templates: the tracker module's `work-tracker` skill holds them
  (local: the `WORK-ITEM.md` and `DESIGN.md` templates; Notion: the template
  page and the property list).
- Saving as we go: `work-on` updates the item after each step; the end-of-reply
  hook reminds the agent when an item changed and was not updated.

## Memory

- What goes where: "from now on" instructions go to `owner-preferences.md`
  (a rule); facts and lessons go to a memory concept (one record per concept);
  decisions go to a decision record (one per decision); approvals stay on the
  work item.
- Skills: `memory-save`, `memory-find` (cites every source), `memory-tidy`.
- Links to work items (optional): a memory, fact, entity, or decision can name
  the work items it relates to, so every work item can be reached from its
  memories.
  - Notion with Lore: a two-way relation "Work items" from Memories, Facts,
    and Entities to the project's Work Items database; views "Decisions" and
    "Memories by work item".
  - Local with Obsidian: a `work_items` property with links to the work item
    notes; Obsidian shows them as backlinks on the work item.
- Citing: whenever the agent uses something it recalled, it names the source
  where it uses it and lists the sources at the end of the reply.

## Hooks: when they fire

| Moment | Hook | What it does | Skill it points to |
| --- | --- | --- | --- |
| Session starts | SessionStart | Prints a short fixed briefing text | `work-status`, `memory-find` (current focus) |
| Mike sends a message | UserPromptSubmit | Only if the message says "remember", "from now on", "always", "never", "forget", or "we decided": adds a one-line reminder | `memory-save` |
| Any other message | none | The agent picks a skill by its description | for example "build X" → `work-on` |
| Before a command runs | PreToolUse | Blocks AI credit in commits and risky git commands; the Salesforce guards in Salesforce projects | none |
| End of the agent's reply | Stop | Checks once: a decision or fact to save, a work item to update, a recalled fact not cited | `memory-save`, `work-on` |
| Before the context is compacted | PreCompact | Reminds the agent to save where things stand | `handoff` |

Claude Code can run the end-of-reply check as a prompt hook (a model reads
the turn; no script). Codex hooks run only commands or MCP tools, so in Codex
this check is either a very small command or left to the skills.

## Other rules and skills

- General rules from the model: humanize outbound text, plain English
  artifacts, publish project documents, session handoff, shared repository
  work, keep the work item current, memory review and save, outside
  documentation.
- Salesforce rules from the model (Salesforce projects only).

## Output style

- Claude Code: `.claude/settings.json` sets `"outputStyle": "Plain English"`
  and the style file sits in `.claude/output-styles/`.
- Codex has no output styles: `AGENTS.md` has a short "How to write replies"
  section.

## Kept from the current build

The model templates and the 27 approved model changes, the 18 rules, the skill
descriptions, the Notion workspace (reshaped by the Notion session), the
research and captured documentation. Hindsight stays installed but is not a
module until Mike asks for it.

## Removed

The `toolkit` program (`plugins/toolkit/lib`, about 37,000 lines) and its
tests, `DECISIONS.md`, the backup folder, generated dashboards and state files.

## Open questions

1. Build only local with Obsidian and Notion with Lore first (GitHub, Jira,
   Hindsight later)? Recommended: yes.
2. Obsidian hides folders whose names start with a dot, which may stop
   `.memory/` notes from linking to `.work-items/`. To verify; the fix may be
   renaming the folders, which changes the model and needs Mike's yes.
3. How "only Mike marks Done" is guarded without a program: a skill rule only,
   or a small check.
4. The end-of-reply check in Codex: a very small command, or skills only.
5. Earlier questions 3 and 4 (merge permission and Jira status list; one
   decision record per item of a bulk yes).

## Review and test plan

1. Now, reading only: agents check every claim here against the saved Claude
   Code and Codex documentation, check it covers every request Mike made in
   this chat, look for anything over-built, and walk through test scenarios on
   paper. The Notion session reviews the Notion part.
2. After Mike approves: build in a separate worktree, then run real test
   projects in Claude Code and Codex (local with Obsidian, Notion with Lore,
   one Salesforce project), then an independent review.
