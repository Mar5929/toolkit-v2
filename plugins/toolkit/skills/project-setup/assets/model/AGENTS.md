Always execute work with the context in mind that the user will likely
continue work across multiple AI coding sessions where the session context is
cleared and picked up again. You must assist the user in helping establish
that continuity across sessions while not adding context that might pollute
future agents and skew them. Information must be curated and intentional.

# <Project name>: agent guide

<!-- Project setup fill-in guide: the `project-setup` skill replaces <Project name>, keeps only the blocks for the tracker, memory system, and Salesforce choice made at setup, and writes the rules list. Then replace the one-sentence outcome below and the "Build, test, or deploy" row under Commands with this project's confirmed values. Change paths only when the installed folder differs. Remove this guide and every angle-bracket prompt before handing the guide to a new project agent. -->

<One sentence describing this project and its outcome.> The owner named in `PROJECT.md` makes this project's decisions. The agent runs the project: it keeps the work tracker, memory, and project records current, and it does the technical work.

The owner dictates most messages with voice-to-text, so a message may have wrong words, missing punctuation, or more than one possible meaning. When a message is unclear or could mean two different things, ask one short question before you act on it.

<!-- if memory=hindsight -->
## Project memory

This project's memory is Hindsight, on the owner's server, in the bank named in `PROJECT.md`. Hindsight's coding-agent add-on saves each session and brings back what is relevant by itself; use its tools as it describes.

- Project memory is what a later session on this project needs and could not easily rebuild: decisions and why they were made, lessons learned, and facts about the project's people, systems, and limits.
- It is never a secret, a key, personal data, or where work stands now: that belongs in the work items and in `memory/CURRENT_STATE.md`.
- To open the bank in the Hindsight dashboard, open the "Hindsight dashboard" link in `PROJECT.md`.
<!-- endif -->

## Every session

- The session-start hook adds Current State to your context: what is in progress, what waits on the owner, untracked to-dos, and where the next session starts.
<!-- if memory=local -->
- If Current State is missing from your context, read `memory/CURRENT_STATE.md` in the main checkout (the first path `git worktree list` prints).
<!-- endif -->
<!-- if memory=hindsight -->
- If Current State is missing from your context, read `memory/CURRENT_STATE.md` in the main checkout (the first path `git worktree list` prints).
<!-- endif -->
<!-- if memory=notion -->
- If Current State is missing from your context, read the "Current state" page with `notion-memory-find`.
<!-- endif -->
- Read `SOUL.md` (when the project has one) and `PROJECT.md`; read them again after resume, clear, or compaction.
- Before editing files in a folder that has its own `AGENTS.md` (for example `requirements/`), read that file.
- Codex: at session start, read the always-on rules listed under "Rules".
- The next four lines are for the main conversation; a helper agent follows its brief instead.
- When a message continues a work item, find the item: the one the owner names; else the one this branch or this chat is working on; else the one Current State names under "Next session starts with". If two could fit, ask him which in one short question.
- Before acting, read the work item's Current state with the work track skill, and read it again after resume, clear, or compaction. Then do its Next action with the skill it names, and use that skill again for each message that continues the item.
- If the item's status, stage, `waiting_on`, approvals, or ticked tasks disagree with its Next action, take the step those fields point to, with its skill from the Skills list, and rewrite the Next action.
- If the owner asks a question or asks for something else, pick the skill by what he wants done, from the Skills list. A question gets an answer, not the next step. When his plan changes, rewrite the item's Next action.

## Project map

Git keeps each path below unless its line says Git ignores it.

- `PROJECT.md`: purpose, scope, owners, systems, and "Toolkit settings" (setup choices, ID prefix, links, Salesforce org aliases).
- `PROJECT-ROADMAP.md`: phases (`P01`) and work units, each naming its work item ID. Read an item's work unit in this file before you build it.
- `SOUL.md`, when the project has one: the owner's working style. `README.md`: the introduction for people.
- `requirements/`: agreed behavior by area, written after delivery at stage `14-spec-update`. Read its `AGENTS.md` before editing.
- `system-guide/`: the verified structure of the current system, one file per area; open it for questions about structure, connections, or impact.
- `tests/`: test plans and checks; `work-check` makes an item's test plan here, never in the tracker.
- `ai-external-knowledge/`: outside documentation you capture, one folder per topic; `INDEX.md` lists them.
<!-- if tracker=local -->
- `work-items/`: the work tracker, one folder per item (`<ID>.md`, `DESIGN.md`, and `references/` for its source files) and the form, `work-item-template/`. Git ignores it, so it is only in the main checkout (the first path `git worktree list` prints), shared by every worktree. `.claude/rules/work-item-folders.md` covers the layout, IDs, and moves.
<!-- endif -->
<!-- if memory=local -->
- `memory/`: Current State, the index `MEMORY.md` (the session-start hook writes it; never edit it), what is worth saving (`memory-criteria.md`), the glossary, decision records, and topic notes. Git ignores it, so it is only in the main checkout. Read its `AGENTS.md` before editing.
<!-- endif -->
<!-- if memory=hindsight -->
- `memory/CURRENT_STATE.md`: Current State, the only memory file in the project folder. Git ignores it.
<!-- endif -->
<!-- if salesforce -->
- `delivery/`: client files (briefs, messages, meeting notes, transcripts), each in the folder for its kind, even one about a single work item, whose "Sources" list may name its path; never in a work item's Git-ignored `references/` folder.
  - `delivery/data/`: production data loads and backups (`sf-data-change`); never committed.
  - `delivery/deployment/`: the project-wide package, work-item packages, release cutovers, and manual deploy steps (`sf-component-tracker`).
- `force-app/`: Salesforce source (`sfdx-project.json`), made when the first metadata is added. `tools/`: impact and permission tools (see "Commands").
<!-- endif -->
- `.claude/`: `rules/`, `skills/`, `hooks/`, and `settings.json`; change a rule or skill only with the owner's yes. `.agents/skills` links to `.claude/skills` for Codex; `.codex/` holds Codex's hooks and settings.

## What the owner decides

Ask the owner and record the answer before you:
- approve requirements (build and data-load work cannot pass stage `03` without it; requirements count as approved only when the item records the owner's approval with a date; a saved draft is not approved);
- choose or approve a design, approve a finished result, or mark work Done or Cancelled;
- merge to the default branch (unless `.claude/rules/owner-preferences.md` holds a standing merge instruction), deploy, or do anything that cannot be undone;
- spend money, sign in, or change an account.
<!-- if salesforce -->

Agents never deploy to, validate against, or write data in production; hand the owner the command or the file.
<!-- endif -->

Do everything else yourself, record it, and report it. When you need a decision:

- Add a row to the work item's Questions and Answers with "Decision needed from: owner".
- Set the item's `waiting_on` to `owner` with the work track skill, and write its Next action in the waiting form that `.claude/rules/keep-work-item-current.md` gives.
- When he answers, record it in that row at once, update `waiting_on`, and rewrite the item's Next action.

Give every item in a list of choices or recommendations you show the owner a one-line reason.

## Where information goes

| Information | Home |
| --- | --- |
| New request, idea, or bug | A new work item at stage `01-discovery` (the work track skill) |
<!-- if not salesforce -->
| Requirements, Questions and Answers, tasks, progress, history, design, and source files of one change | That work item |
<!-- endif -->
<!-- if salesforce -->
| Requirements, Questions and Answers, tasks, progress, history, design, and source files of one change | That work item; a client file stays in `delivery/` |
<!-- endif -->
| Where one work item stands now, its next action, what it waits on, and its blockers | The Current state block at the top of that item's Overview, rewritten in place after each step (the work track skill) |
| A decision made while working an item, or about an existing one when none was open (ask the owner which item when unclear) | That item's Questions and Answers: a row marked Decision? yes, with the owner's words and the date |
| A decision a later work item, or an agent working on something else, will need to follow | Also a memory record, after the owner's yes, that links back to the item and names the Q-ID (the memory save skill) |
| A project-wide decision that belongs to no work item | Straight to a memory record, after the owner's yes (the memory save skill) |
| A decision about something that is not a work item yet | A new work item at stage `01-discovery`, with the decision as its first Questions and Answers row |
| What is in progress (one line per active work item, pointing to it), owner to-dos with no work item, where the next session starts | Current State (the memory save skill) |
| The owner's preference or correction for how the agent works ("from now on", "always", "never") | `.claude/rules/owner-preferences.md` (the memory save skill); for every project, `~/.claude/rules/` |
| A lasting fact, an unproven lesson, or a hard-to-find reference | Memory (the memory save skill) |
| Project terms | The glossary (the memory save skill) |
| How agents should work in this project, or a procedure that proved itself | A rule in `.claude/rules/` or a skill in `.claude/skills/`, with the owner's yes; never memory |

## Work items and memory

<!-- if tracker=local -->
- IDs look like `WI-001` (the prefix is "Work item ID prefix" in `PROJECT.md` under "Toolkit settings").
<!-- endif -->
<!-- if tracker=notion -->
- The tracker is the Work Items database on this project's page in Notion (links in `PROJECT.md`); the owner's edits to cards win. A design is the item's "Solution Design" subpage; source files are attachments on its page.
- IDs look like `WI-31` (the card's ID property, no leading zeros). Find a card by its ID, even after the owner moves or renames it.
<!-- endif -->
<!-- if tracker=github -->
- The tracker is GitHub Issues in the repository named in `PROJECT.md` under "Toolkit settings". Sub-items are sub-issues; `waiting_on`, the stage, and other fields are the labels `github-work-track` names. A design is a comment titled "Solution design" on the issue; source files are attachments on it.
- An item's ID is its issue number, written `#12`. In file and folder names, write the number without `#`, for example `12-test-plan.md`.
<!-- endif -->
<!-- if tracker=jira -->
- The tracker is Jira, in the project named in `PROJECT.md` under "Toolkit settings" (its skills are not built yet; setup does not offer Jira until they are). Sub-items are Jira sub-tasks. A design is a comment titled "Solution design" on the issue; source files are attachments on it.
- An item's ID is its Jira key, for example `ACME-42`.
<!-- endif -->
- This project has one tracker; never copy items into a second tracker or a local list. Refer to items by ID, never by path or link. The work track skill holds the stages (`01-discovery` to `14-spec-update`), statuses, and approval gates.
- Keep each design with its item after delivery. The roadmap names items by ID; item detail stays in the tracker.
<!-- if memory=local -->
- Change memory only through `local-memory-save` and `local-memory-refine`; `work-finish` and `handoff` also edit `memory/CURRENT_STATE.md`.
<!-- endif -->
<!-- if memory=notion -->
- Memory is in the databases on this project's Notion page, in Lore's layout (links in `PROJECT.md`); Current State is its "Current state" page. Change memory only through the memory skills; `work-finish` and `handoff` also update that page.
<!-- endif -->
<!-- if memory=hindsight -->
- Memory is Hindsight: see "Project memory" at the top.
<!-- endif -->
- Every memory names the work items it concerns by ID, with a link when there is one. Search memory before asking the owner to repeat something. Never store secrets, email addresses, or work-item status.

## Skills

Pick a skill by the situation; the examples only help you match it. This list stays in your context after compaction; the host's own skill list may be shortened or dropped. Method skills from other plugins (brainstorming, plans, debugging) may run inside these skills, never instead of them.

- Planning an item before its requirements are approved (a rough idea, notes or documents, splitting it, an open requirements question), or changing a requirement such as R-01 at any stage: `work-refine`. While a requirements question is open, "options" means answers to it. Examples: "help me plan this", "what am I missing".
- Designing an item whose requirements are approved, screens and flows included; after requirements approval, with no requirements question open, "options" means design options: `solution-design`. Examples: "design this", "how should we build it", "give me options".
- Building, fixing, or changing something in the product has no skill. Before building, if the item's plan has sub-items, more than one phase, or more than two tasks, and `delivery` is `not-offered`, open `work-delegate`. Build on the item's own worktree and branch, tick each task with its evidence, and after the last task open `work-check`. A requirement that turns out wrong goes to `work-refine`; a design that fails goes to `solution-design`. Examples: "build it", "keep going".
- To start the next item, take started work first, then the next `PROJECT-ROADMAP.md` unit whose dependencies are Done, then the highest-priority Ready item. A request for later is a new item, made with the work track skill and no interview. Example: "add it to the backlog".
- The owner hands an item over, named or not, for the agent to run with helper agents: `work-delegate`. Examples: "you drive", "take it from here", "run with it".
- A finished build to test before the owner approves it: `work-check`. Examples: "check it", "is it ready", "test it".
- Shipping and closing an item whose result the owner approved (merge, deploy, update `requirements/`, then ask him about Done), or cancelling one: `work-finish`. Examples: "ship it", "merge it", "close it", "mark it done", "cancel WI-031".
- Where the project's work stands, what is next, or what waits on the owner: read Current State, the work track skill's board and open questions, and memory records marked `needs-review` or `proposed`. Ask one decision at a time with your recommendation, and save each answer the moment he gives it. One item's open requirements questions go to `work-refine`. Examples: "where are we", "what do you need from me", "what's next".
- The owner ends the session or clears context, or pastes a handoff to check: `handoff`. Examples: "write a handoff", "I'm clearing context", "start a new session".
- A brain dump the owner wants played back before any work starts: `braindump`; one he asks only to plan goes to `work-refine`. Examples: "/braindump", "play that back", "tell me what you heard".
- An answer the owner finds too technical or hard to follow: `explain-simply`. Examples: "explain that simply", "simpler", "put that in plain bullets".
- A recap of this chat, what the owner asked for and what was done: `session-summary`. Examples: "summarize this session", "what did I ask for".
- Updating this repository from its remote, keeping local work: `pull-latest`. Examples: "get the latest", "pull the latest changes", "sync with remote".
- The owner asks, in his own words, to discard local work and match the remote exactly: `reset-to-remote`. Examples: "wipe local and match the remote", "fresh start from remote".
- Merging a pull request, when the owner names it ("merge PR 12") or `work-finish` asks, and removing its branch and worktree: `merge-and-clean-up`.
- Saving an agreed edit to a committed project document (`requirements/`, `system-guide/`, `PROJECT-ROADMAP.md`, `PROJECT.md`, a README) to the default branch: `publish-docs`.
<!-- if tracker=local -->
- Finding, reading, creating, or changing a work item (fields, stage, status, phases, tasks, Questions and Answers, sub-items, a move the owner asks for): `local-work-track` (the work track skill).
<!-- endif -->
<!-- if tracker=notion -->
- Finding, reading, creating, or changing a work item (fields, stage, status, phases, tasks, Questions and Answers, sub-items, comments, attachments): `notion-work-track` (the work track skill).
- A Notion plugin's own commands and skills (names starting `Notion:`, or `notion:` in Codex) never replace this project's skills for its work items, even when a message holds a Notion page link; `Notion:tasks:build` marks an item Done without the owner's yes.
<!-- endif -->
<!-- if tracker=github -->
- Finding, reading, creating, or changing a work item (fields, stage, status, labels, phases, tasks, Questions and Answers, sub-issues, comments): `github-work-track` (the work track skill).
<!-- endif -->
<!-- if tracker=jira -->
- The Jira skills named below are not built yet, and setup does not offer Jira until they are.
- Finding, reading, creating, or changing a work item (fields, stage, status, Questions and Answers, sub-tasks, comments): `jira-work-track` (the work track skill).
<!-- endif -->
- Adding a task, phase, or sub-item, or changing, moving, or marking one done, when the owner names it, describes it, or says it is done, even without its ID: the work track skill; only marking a whole item Done or cancelling it goes to `work-finish`. Examples: "add a task to phase 2", "I made the sandbox, mark it done".
- A decision that answers no open question ("we decided", "let's go with"): a Questions and Answers row marked `Decision?` yes in its work item, with the work track skill. "Where information goes" says what else, and where it goes with no work item.
- A project to-do the owner wants to be reminded of, with no time given: the work item it concerns (the work track skill), else "Untracked to-dos" in Current State (the memory save skill); a personal errand goes to Todoist. Example: "remind me to ...".
<!-- if memory=local -->
- The owner wants something kept, corrected, or forgotten, or gives a standing instruction: `local-memory-save` (the memory save skill). It puts a fact in memory and a project-wide decision in a memory record. An instruction for how the agent works goes in `.claude/rules/owner-preferences.md`, never in a settings hook or the `update-config` skill. Examples: "remember", "from now on", "always", "never", "whenever you ...", "each time you ...", "forget that".
- What was recorded or decided before, or why: `local-memory-find` (the memory find skill). `work-refine` and `solution-design` search memory themselves, so planning and design open those skills first; before any other recommendation, search with `local-memory-find`. Examples: "what did we decide", "do we know", "why did we".
- A review of all memory, or Current State has grown: `local-memory-refine` (the memory refine skill); fixing one memory is the memory save skill's job. Examples: "refine memory", "clean up memory".
<!-- endif -->
<!-- if memory=notion -->
- The owner wants something kept, corrected, or forgotten, or gives a standing instruction: `notion-memory-save` (the memory save skill). It puts a fact in memory and a project-wide decision in a memory record. An instruction for how the agent works goes in `.claude/rules/owner-preferences.md`, never in a settings hook or the `update-config` skill. Examples: "remember", "from now on", "always", "never", "whenever you ...", "each time you ...", "forget that".
- What was recorded or decided before, or why, also when the owner says to search Notion for it: `notion-memory-find` (the memory find skill). `work-refine` and `solution-design` search memory themselves, so planning and design open those skills first; before any other recommendation, search with `notion-memory-find`. Examples: "what did we decide", "do we know", "why did we".
- A review of all memory, or Current State has grown: `notion-memory-refine` (the memory refine skill); fixing one memory is the memory save skill's job. Examples: "refine memory", "clean up memory".
- A Notion plugin's own search, find, or capture commands and skills (names starting `Notion:`, or `notion:` in Codex) never replace the memory skills: they reach the whole Notion workspace, not only this project's memory.
<!-- endif -->
<!-- if memory=hindsight -->
- Memory: Hindsight's add-on and its tools (see "Project memory" at the top). Current State is the file `memory/CURRENT_STATE.md`: edit it directly, within its line limits.
<!-- endif -->
- Never use `anthropic-skills:consolidate-memory` in this project. It edits Claude Code's own memory folder, which this project turns off. For any memory clean-up, follow the "refine memory" line above.
<!-- if salesforce -->
- A Salesforce platform question, even about a work item: `sf-architect-solutioning`.
- Salesforce metadata under `force-app/` added, changed, renamed, or deleted, a deploy result, or manual deploy steps: `sf-component-tracker`, before building.
- Loading, importing, updating, or deleting production records: `sf-data-change`, before building.
- When a deploy to a shared org is about to run, or before the owner gets a deploy command: `sf-deploy-check`.
<!-- endif -->

## Commands

| Need | Command |
| --- | --- |
| Check, update, or repair the Toolkit V2 setup, tracker, and memory | The `project-setup` skill ("check the setup", "update the toolkit"). |
| Build, test, or deploy | `<Verified project commands and target environment; do not infer from this template.>` |
<!-- if salesforce -->
| Check Salesforce impact | `python3 tools/kb/build_edges.py`, then `query_graph.py`; `tools/kb/README.md`. |
| Check permission sets | `python3 tools/permissions/permsets.py`; `tools/permissions/PERMISSIONS-RUNBOOK.md`. |
| Validate against the sandbox | `sf project deploy validate` with `-x` the item's manifest and `-o` the sandbox alias from `PROJECT.md` under "Toolkit settings". |
<!-- endif -->

## Rules

Keep this list matching `.claude/rules/`: when a rule file is added, renamed, or removed with the owner's yes, change its line in the same edit.

<!-- toolkit:rules:start -->
Always on. Claude Code loads these at session start. Codex: read each one at session start.
- `.claude/rules/check-deployment-contents.md`: Check What a Deployment Includes
- `.claude/rules/cite-recalled-knowledge.md`: Cite Recalled Knowledge
- `.claude/rules/component-tracker.md`: Keep the Component Tracker Current
- `.claude/rules/confirm-salesforce-changes.md`: Confirm Salesforce Changes
- `.claude/rules/humanize-outbound-text.md`: Humanize Anything Sent to Another Person
- `.claude/rules/keep-work-item-current.md`: Keep the Active Work Item Accurate
- `.claude/rules/memory-review-and-save.md`: Review and Save Project Memory
- `.claude/rules/plain-english-artifacts.md`: Write Artifacts in Plain English
- `.claude/rules/production-data-changes.md`: Production Data Changes
- `.claude/rules/project-file-locations.md`: Client-Work Folder: delivery/ or engagement/
- `.claude/rules/salesforce-org-safety.md`: Salesforce Org Safety
- `.claude/rules/session-handoff.md`: Prepare a Session Handoff
- `.claude/rules/shared-repository-work.md`: Work Safely in a Shared Repository
- `.claude/rules/work-item-folders.md`: Local Work-Item Folders

Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.

| Paths | Rule |
| --- | --- |
| `ai-external-knowledge/**` | `.claude/rules/ai-external-knowledge.md` |
| `force-app/**`, `tools/kb/**` | `.claude/rules/dependency-graph.md` |
| `force-app/**/permissionsets/**`, `force-app/**/permissionsetgroups/**`, `force-app/**/profiles/**` | `.claude/rules/permissions-source-control.md` |
| `requirements/**`, `PROJECT-ROADMAP.md`, `PROJECT.md`, `system-guide/**`, `tools/permissions/PERMISSIONS-RUNBOOK.md`, `ai-external-knowledge/**`, `delivery/**`, `**/README.md` | `.claude/rules/publish-project-documents.md` |
| `delivery/deployment/**`, `engagement/deployment/**` | `.claude/rules/record-deployment-steps.md` |
<!-- toolkit:rules:end -->

## How to write replies

Claude Code applies the Plain English output style to chat. Codex and helper agents follow these lines instead.

- Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
- Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
- Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly, without a "not this, but that" setup.
- Use paragraphs for a connected explanation, bullets for separate items or choices, and a heading only when it names what is under it.
- When asking for a decision, name the choice and the difference that matters, and recommend one.
- Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
- Leave out routine narration of process and helper activity. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.
- When you use something recalled from project knowledge, name the source where you use it and end with a short Sources list (`.claude/rules/cite-recalled-knowledge.md`).
