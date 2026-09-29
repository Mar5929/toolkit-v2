# Toolkit V2: skills-first architecture (draft 2, 2026-09-29)

Draft for Mike's review. Nothing here is built. It follows `dev/GOAL.md`,
including "Interview answers" (2026-09-29), which wins where this file
differs. The Notion part is owned by the Notion session
(`dev/research/notion-skills-first.md` in its worktree); this file only
points to it. Draft 1 and its review are in Git history and
`dev/research/skills-first-architecture-review.md`.

Documentation citations: `CC/` is `ai-external-knowledge/claude-code/`,
`CX/` is `ai-external-knowledge/codex/`, `AS/` is
`ai-external-knowledge/anthropic-agent-skills/`.

## 1. The whole thing in five lines

- Toolkit V2 is rules, skills, and a few small hooks. No custom program.
- One onboarding skill copies the model project into a new project, then
  copies in one work tracking skill set, one memory skill set, the shared
  skills, and the hooks for those choices.
- Everything a project runs sits inside the project, so it works the same in
  Claude Code, the Codex CLI, and the Codex IDE extension (which loads no
  plugins, CX/plugins.md:21).
- Each tool is used its own way: plain files and Obsidian, Notion through
  `ntn` or the Notion connector, GitHub through `gh`, Jira through the
  Atlassian connector or `acli`, Hindsight through its local server.
- The same stages, statuses, approvals, `WORK-ITEM.md` sections, and
  `DESIGN.md` everywhere; only where they are stored changes. Notion keeps
  phases and tasks as linked records shown as live views on the item page.

## 2. What ships, and where it runs

| Piece | Where it lives | Runs where |
| --- | --- | --- |
| `toolkit` plugin with one skill, `project-setup` | `plugins/toolkit/` | Machine-wide in both hosts, so "set up this project" works in an empty folder. It holds no hooks. |
| The model copy and every skill set, hook file, and template | `project-setup`'s `assets/` folder | Copied into a project by onboarding; never run from the plugin |
| A project's skills | `.claude/skills/<name>/` (Claude Code, CC/skills.md:127) and `.agents/skills/<name>/` (Codex, CX/build-skills.md:142) | In that project only |
| A project's hooks | `.claude/settings.json` and `.codex/hooks.json` (CC/hooks.md:339; CX/hooks.md:49-54) | In that project only |
| A project's rules | `.claude/rules/` plus the rules list in `AGENTS.md` (Codex reads only `AGENTS.md`, CX/agents-md.md:166) | In that project only |

Why copied into the project and not turned on as plugins: the Codex IDE
extension loads no plugins, Codex honors project plugin switches only in
trusted projects (CX/config-reference.md:1459-1462), and a plugin's hooks
would run in every project on the Mac. "Update the toolkit" is the same
onboarding skill copying the newer files in again. Copying files does not
change a project's Notion databases, so the update also runs
`notion-work-track`'s "bring this workspace up to the current template"
step: it adds missing properties, views, and relations, and never removes
or renames anything.

Claude Code reads only `.claude/skills/` and Codex only `.agents/skills/`
(neither documents the other's folder). Recommended: one real copy in
`.claude/skills/`, and `.agents/skills` as a link to it (Codex follows
linked folders, CX/build-skills.md:153). If the test projects show a problem,
fall back to two copies, as the model does today for its `sf-*` skills.

## 3. Onboarding (`project-setup`)

Asks, one at a time: work tracking (local + Obsidian, Notion, GitHub Issues,
Jira), memory (local + Obsidian, Notion in Lore's layout, Hindsight),
Salesforce (yes or no). When the owner picks Notion for work, it suggests
Notion for memory. Then it:

1. Copies the model files: `AGENTS.md`, `CLAUDE.md` (`@AGENTS.md` only),
   `SOUL.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`, `README.md`,
   `.gitignore`, `requirements/`, `system-guide/`, `tests/`,
   `ai-external-knowledge/`, the rules, the Plain English style, and the
   settings. Adds `work-items/` (local tracking), `memory/` (local memory),
   and the Salesforce files (Salesforce projects).
2. Copies the shared skills and the chosen sets into `.claude/skills/`.
3. Writes the hooks for the chosen sets into `.claude/settings.json` and
   `.codex/hooks.json`.
4. Fills `AGENTS.md` once: project name, the tracker and memory choice, the
   routing table (section 5), and the rules list.
5. Asks Mike to sign in to the chosen tools (`ntn login`, `gh auth login`,
   Jira) and waits, because nothing can be created before that.
6. Notion: picks which template to copy (work only, memory only, or both,
   depending on the mix), proposes the Work Items ID prefix (Notion allows
   one database per prefix in a workspace), makes the project's pages, and
   records the links and prefix in `PROJECT.md` "Toolkit settings". The
   first time, the template itself is built once in Mike's workspace; its
   "this page" filters can be set only in the Notion app, so Mike may need to
   click once (Notion session, test behavior 3). Hindsight: creates the
   project's memory bank.
7. Tells Mike to trust the project and its hooks once in Codex `/hooks`
   (CX/hooks.md:65, 72-77).

## 4. Skills

A skill is a folder: `SKILL.md` (name, description, short steps, and a table
saying when to open each other file), `references/`, `assets/` (templates),
and `examples/`. The description is the only thing the agent sees until it
picks the skill (AS/agent-skills-overview.md:112-114), so it says what,
why, and when, names the project setup it is for, and ends with "Not for
...; use <skill>" where a neighbor competes. A skill reads only files in its
own folder. Descriptions stay under about 350 characters, so the whole list
fits Codex's 8,000-character budget (CX/build-skills.md:45-46) and Claude
Code's (set higher with `skillListingBudgetFraction`, CC/settings-reference.md:2915).

### 4.1 Skills in every project (16)

| Skill | Description (draft) |
| --- | --- |
| `work-refine` | 'Turns a rough idea, meeting transcripts, and documents into a work item's agreed goal, requirements, and roadmap by interviewing the owner one question at a time and saving each answer as he gives it, so large work can resume on any day. Use when the owner says "help me plan this", "scope this out", "here are the meeting notes", or "what am I missing". Not for how to build it; use solution-design.' |
| `solution-design` | 'Writes design options for how a work item with approved requirements gets built, recommends one, and records the owner's choice, so the build follows an agreed plan. Use when the owner says "design this", "how should we build it", or "give me options".' |
| `work-on` | 'Builds a work item from its roadmap and tasks, or resumes one, and updates the item after each step, so the work and its record stay in step. Use when the owner says "build it", "keep going", "pick up WI-031", or "start the next item". Not for planning; use work-refine.' |
| `work-delegate` | 'Hands a work item to a team of helper agents with the owner as product owner, and keeps each helper's sub-item current, so larger work runs in parallel. Use when the owner says "you drive", "take it from here", or "use a team of agents".' |
| `work-check` | 'Tests a finished work item against its requirements with an independent checker agent, then asks the owner to approve the result, so nothing is called finished untested. Use when a build is done or the owner says "check it", "is it ready", or "test it".' |
| `work-finish` | 'Ships and closes an approved work item, or cancels one, asking the owner before marking it Done and recording his words, so only the owner closes work. Use when the owner says "ship it", "close it", "mark it done", or "cancel WI-031".' |
| `work-status` | 'Reports where the project's work stands: what is in progress, what waits on the owner, the questions he needs to answer, and what is next, so he can decide quickly. Use when the owner says "where are we", "what do you need from me", or "what's next". Not for a recap of this chat; use session-summary.' |
| `handoff` | Kept; steps rewritten to update the work item and Current State through the project's sets. |
| `braindump`, `explain-simply`, `session-summary`, `unslop` | Kept as they are. |
| `pull-latest`, `reset-to-remote`, `merge-and-clean-up`, `publish-docs` | Kept; `publish-docs` loses its 324-line script for written git steps. |

Changes from diagram 1: "requirements" and the old `requirements-helper`
and `grill-me` become `work-refine` (Mike's decision). `work-decide` joins
`work-status` and `work-organize` is split between the track skills and
`work-on` (question 3 below).

### 4.2 Work tracking sets (pick one; 2 skills each)

| Set | Skills | What its folder holds |
| --- | --- | --- |
| Local + Obsidian | `local-work-track`, `local-work-find` | How to make an item folder under `work-items/` (next ID = highest `id:` plus one; make the folder first, then check for a duplicate), fields, stages, the `WORK-ITEM.md` and `DESIGN.md` templates, how to find items from a git worktree (the first path of `git worktree list`), how to notice items Mike moved (find by `id:`, never by path). |
| Notion | `notion-work-track`, `notion-work-find` | The Notion session's part: `ntn` calls, sign-in (pages shared with the "Notion CLI" connection; `ntn` runs outside the Codex sandbox), the page template plus `DESIGN.md`, Phases and Tasks as linked records, and the full written definition of the template (every property, relation, view, and order), so a damaged template can be rebuilt and an older project brought up to date. |
| GitHub Issues | `github-work-track`, `github-work-find` | `gh` steps from today's `tracker-github.md`: one issue per item, the body in `WORK-ITEM.md` form, labels for stage, approvals, and waiting-on, sub-issues for children, the design as one comment. |
| Jira | `jira-work-track`, `jira-work-find` | Steps from today's `tracker-jira.md`: the Atlassian connector or `acli`, the description in `WORK-ITEM.md` form, the six statuses mapped once at setup, sub-tasks or child issues. |

Description pattern (Notion shown): 'Creates and changes work items in this
project's Notion workspace with ntn or the Notion connector: new items from the template, fields,
stage and status, phases, tasks, questions and answers, comments, and
attachments, so every change lands the same way. Use whenever the owner or a
work skill needs a work item created or changed. Only for projects that
track work in Notion.' The `-find` skill mirrors it for looking up.

### 4.3 Memory sets (pick one; 3 skills each)

| Set | Skills | What its folder holds |
| --- | --- | --- |
| Local + Obsidian | `local-memory-save`, `local-memory-find`, `local-memory-refine` | The concept file template (with a `work_items` property of links such as `[[WI-031]]`), the four prefixes, memory criteria, the decision record template, Current State rules, Obsidian link rules. |
| Notion + Lore | `notion-memory-save`, `notion-memory-find`, `notion-memory-refine` | The Notion session's part: Lore's databases, Kind values, the Work items relation, and Lore's full property list (moved from `plugins/toolkit/lib/notion/lore-schema.mjs`, which goes with the program). Lore finds its databases and columns by exact name, so the "never rename or remove a Lore property" rule points to this list. |
| Hindsight | None (Mike, 2026-09-29: "Hindsight has its own complete way. It's a whole memory engine") | The agent uses Hindsight's own MCP tools (`retain`, `recall`, `reflect`) on the project's bank at `127.0.0.1:8888/mcp/<bank>/`, with the delete tools hidden. The shared memory rule carries what Hindsight cannot know (what to keep, ask first, cite). Work item tags and a Current State home: research pending. |

Description pattern (local shown):
- save: 'Saves what the owner wants kept in this project's local memory: facts and lessons to a concept file, project-wide decisions to a decision record, instructions to the owner-preferences rule, each linked to its work items and saved after his yes, and keeps Current State current. Use when the owner says "remember this", "from now on", "we decided", or a reminder says a save may be due. Only for projects with local memory.'
- find: 'Searches this project's local memory, rules, and work items for what was recorded before, and cites each source, so answers and designs rest on what was agreed. Use before a recommendation, design, or plan, and when the owner asks "what did we decide" or "do we know". Only for projects with local memory.'
- refine: 'Reviews this project's local memory: merges duplicates, retires stale records, fixes links to work items, clears old entries from Current State, and proposes lessons that should become rules or skills, so memory stays small and true. Use when the owner says "refine memory" or "clean up memory", or at handoff when Current State has grown. Only for projects with local memory.'

### 4.4 Salesforce projects add (4)

`sf-architect-solutioning` (description only was rewritten), and the model's
`sf-deploy-check`, `sf-component-tracker`, `sf-data-change`. None calls the
old program.

### 4.5 Helper agents

The acceptance checker must always run (Mike, 2026-09-28). Recommended: each
helper (acceptance checker, builder, design architect, design critic,
requirements analyst, researcher, handoff verifier) is a brief file inside
the skill that starts it, and the skill starts a general helper agent with
that brief. It works the same in both hosts with nothing to register.
Question 5 below.

### 4.6 Count and overlap

A project gets 16 shared + 2 work + 3 memory = 21 skills, 25 with
Salesforce (18 and 22 with Hindsight memory, which has no toolkit skills). Pairs most likely to be confused, each tested by the routing
test: `work-refine` / `braindump`; `work-status` / `session-summary`;
`work-on` / `work-delegate`; `<memory>-find` / `<tracker>-work-find`;
`handoff` / `<memory>-save`; `<memory>-save` / Claude Code's built-in
`update-config` for "from now on" (review P14).

## 5. `AGENTS.md` and rules

- `AGENTS.md` stays the model's, without the lines that name the program,
  plus one routing line per skill. This matters: after compaction Claude Code
  does not show the skill list again (CC/context-window.md:63), but it does
  reload `CLAUDE.md` and always-on rules from disk (CC/context-window.md:1605).
- The rules list in `AGENTS.md` stays, because Codex reads only `AGENTS.md`
  (CX/agents-md.md:166; combined cap 32 KiB, :22).
- New always-on rule `cite-recalled-knowledge.md`, plus one line in
  `AGENTS.md` "How to write replies" (Codex and helper agents read that; they
  do not get the output style, CC/output-styles.md:205).
- Rewritten (Mike's yes, open question 2): `memory-review-and-save.md`,
  `work-item-folders.md`, `shared-repository-work.md` line 30,
  `publish-project-documents.md`, `session-handoff.md`.
- Where decisions go (written the same in the rules, the skills, and
  `AGENTS.md`): every decision is saved in the work item's Questions and
  Answers first; a project-wide decision also gets a memory record.

## 6. Hooks

| Moment | Claude Code (`.claude/settings.json`) | Codex (`.codex/hooks.json`) | Agent then uses |
| --- | --- | --- | --- |
| Session starts, resumes, clears, or was compacted | SessionStart `startup\|resume\|clear\|compact`; plain output is added to context (CC/hooks.md:1177; cap 10,000 characters, :929) | SessionStart, same four matchers; plain output is added (CX/hooks.md:426, 658; about 2,500 tokens, :529) | the memory find skill when it needs more |
| Mike's message matches Davis's phrase list or a decision phrase | UserPromptSubmit, no matcher (CC/hooks.md:331) | UserPromptSubmit (CX/hooks.md:995) | the memory save skill |
| After a commit | PostToolUse `Bash` with `if: "Bash(git commit *)"`; the text goes in `additionalContext` (CC/hooks.md:433, 2027) | PostToolUse `Bash`; the command checks `tool_input.command` (CX/hooks.md:909, 927) | the work track skill |
| A helper agent returns | PostToolUse on the `Agent` tool (CC/hooks.md:2418) | None: SubagentStop cannot add text for the main agent (CX/hooks.md:1031-1056); `work-delegate` carries it | the work track skill |
| End of each reply | Stop hook of type prompt: checks only the reply text for an unsaved decision or instruction and a recalled fact with no source (CC/hooks.md:2542, 3524-3579). Kept only if tests show it rarely fires wrongly. | None: prompt hooks are skipped (CX/hooks.md:200) | the memory save skill |
| Before marking Done | No hook: a written rule | Same | `work-finish` |
| Risky git, AI credit | Permission deny and ask rules (the model's), `attribution` set to empty (CC/settings-reference.md:3783) | The model's Salesforce guards only | none |

What each hook prints:
- Session start: Current State; with local memory it first rebuilds
  `memory/MEMORY.md` from each memory file's title, summary, and updated
  date, then prints it. After `compact` it adds: "Re-read the active work
  item, `SOUL.md`, `PROJECT.md`, and `owner-preferences.md`." If Current
  State is over its size limit or older than 7 days, one line asks for
  `memory-refine`. Notion reads the "Current state" page with `ntn`;
  Hindsight reads the Current State document from the local server. If the
  read fails, one line says so and the session goes on. In Codex the
  sandbox blocks the keychain `ntn` needs, so this read may fail every time;
  the test projects check it, and if it fails the line tells the agent to
  read the page with `notion-memory-find`. After `compact` in a Notion
  project, "re-read the active work item" means `notion-work-find`, not
  opening a file.
- Prompt reminder: "This may be something to keep. Use <memory save skill>;
  it decides whether anything is saved." The skill name is written in at
  onboarding.
- After a commit: "You just committed. Update the work item's Recent History
  and status, and Current State if it changed."
- Helper agent returned: "Update that helper's work item status and
  history." To test: whether it fires when a background helper finishes
  (not documented).

Hooks in worktrees: `work-items/` and `memory/` are kept out of Git, so they
exist only in the main checkout. Claude Code keeps `$CLAUDE_PROJECT_DIR`
where the session started when the agent enters a worktree later
(CC/hooks.md:614); a session started inside a worktree is not documented. So
every hook command finds the main checkout itself from
`git rev-parse --git-common-dir`, in both hosts, and the test projects check
it. Codex runs changed hooks only after Mike
trusts them again (CX/hooks.md:72-77).

## 7. Current State stays current

- Four sections as today: Now, Waiting on the owner, Untracked to-dos, Next
  session starts with. Each has a line limit.
- A line is removed when it stops being true: `work-finish` removes the
  item's line, answering a question removes its "waiting" line, `handoff`
  rewrites "Next session starts with".
- The session-start hook flags a file that is too long or too old;
  `memory-refine` prunes it.

## 8. Decisions and links

- Every decision: a row in the work item's Questions and Answers (Mike's
  words, date, marked as a decision).
- Project-wide decisions also: a memory record with one sentence, how to
  apply it, and a link back to the work item naming the Q-ID of its
  Questions and Answers row (a single table row cannot be linked to in
  Notion). Local format: question 4.
- Every memory stores the IDs of its work items, plus a link when there is
  one: `[[WI-031]]` in Obsidian, the Notion page, the GitHub issue, or the
  Jira ticket. Both in Notion: a two-way relation and a "Linked memory" view
  on the work item page (Notion session). Local: Obsidian's backlinks panel
  on `WI-031.md`.

## 9. Code that stays, and why

| Code | Size | Why it cannot be a skill |
| --- | --- | --- |
| Session-start command, one per memory set | about 30 lines each | A hook must print Current State; the local one also writes the index, which saves LLM work and cannot drift (Mike, open question 3). |
| Prompt reminder command | about 30 lines | Matches Davis's phrase list; one file for both hosts. |
| Codex after-commit check | about 15 lines | Codex has no `if` filter, so a command reads `tool_input.command`. |
| Claude Code after-commit and helper-returned hooks | one line each, no file | Fixed text. |
| The model's Salesforce guards and graph hook | unchanged | Mike's model. |
| `dev/tools/check-rules.mjs`, a smaller `check-skills.mjs` | dev only, not shipped | Format and description checks. |

Removed: `plugins/toolkit/lib` (36,952 lines), its tests (22,838), the
`toolkit` command and wrapper, `publish-docs.mjs`,
`sync-skill-references.mjs` (each skill holds its own files), the 505-line
`scripts/memory.py`, `DECISIONS.md`, `.toolkit.json` (question 6), the
backup folder, and generated dashboards.

## 10. Model changes (on the model branch, list shown to Mike before he merges)

- `.memory/` becomes `memory/`, `.work-items/` becomes `work-items/`, each
  item's main file is named by its ID, `.obsidian/` is kept out of Git.
- `CURRENT_FOCUS.md` becomes `CURRENT_STATE.md`.
- `WORK-ITEM.md`: Questions and Answers (answer and date columns, decision
  marker), moved above Notes; a Sources list; a `references/` folder beside
  it; "Next action" names the next open question.
- The topic template gets `work_items`; a decision record template.
- `MEMORY.md` is generated by the session-start hook.
- `DECISIONS.md` removed; about 62 lines that name the program rewritten.
- `shared-repository-work.md`: the merge permission lives in
  `owner-preferences.md`.
- `AGENTS.md`: routing lines, the cite line, decisions line.
- Settings: the hooks in section 6.

## 11. Test plan

Test projects (Claude Code sessions one at a time):
1. Local + Obsidian work, local memory, Salesforce, in Claude Code and Codex.
2. Notion work, Notion memory, in Claude Code and Codex.
3. GitHub Issues work, Hindsight memory (needs a test repository: Mike's yes).
4. Jira work, local memory (needs a Jira site: Mike's answer).
5. Notion work, local memory (a mix).

Each runs one work item from idea to Done: `work-refine` with a meeting
transcript, a sub-item, a design, a build, the check, and Mike's Done, plus
a file moved by hand. Also:
- Routing test: about 20 requests, 3 runs each, in both hosts.
- Memory tests: fresh-session resume, a corrected fact replaces the old one,
  "I don't know" instead of a guess, no leak between projects.
- Hook tests: every row in section 6 seen firing; the Stop check's false
  alarms counted; the helper-returned hook with a background helper; hooks
  from inside a git worktree.
- Notion: the six behaviors in the Notion session's section 8; updating an
  existing Notion project after a template change; the `ntn` session-start
  read in Codex. Notion test projects run in the private Notion test area
  (`dev/test-runs/notion-test-area.json`), never on Mike's real "AI Agent
  Second Brain" page unless he says yes.
- An independent review, then a plain report to Mike.

## 12. Questions for Mike (one at a time, with the draft)

1. Skills copied into each project, one onboarding plugin (recommended),
   instead of plugins turned on per project.
2. One skill copy with `.agents/skills` linked to it (recommended; tested).
3. `work-decide` joins `work-status`; `work-organize` split between the track
   skills and `work-on` (recommended: fewer overlapping descriptions).
4. Project-wide decisions in local memory: one `decision_<slug>.md` file each,
   a fifth prefix (recommended), or a section in the related concept file.
5. Helper agents as brief files inside skills (recommended), or registered
   agents per host.
6. `.toolkit.json` removed; its settings (ID prefix, Notion links, Jira status
   list, Salesforce org aliases) move to a "Toolkit settings" section in
   `PROJECT.md` (recommended).
7. `spec-check`, `work-guide`, `track-tasks`: retire and fold into
   `work-refine`, `AGENTS.md`, and Current State (recommended).
8. The everyday install: Claude Code runs the `toolkit` plugin's program
   hooks from this folder in every session. Switch it off (steps in
   `dev/test-runs/install-everyday.md`) before the program is deleted.
9. A GitHub test repository and a Jira site for test projects 3 and 4.
10. Later lists: the 16 rules questions, the 13 model-review items, and the
    test data to delete: about 20 Hindsight test banks and the stopped
    `hindsight-v2-research` store; in Notion, "Toolkit V2 sample (safe to
    delete)", "Notion tracker sample (safe to delete)", the "Old structure
    (safe to delete)" page, and the "Tracker run ..." and "Experiment ..."
    pages in the private test area.
