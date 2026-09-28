# Approved model changes: what changed and how to bring it in

All 23 approved items are applied to a copy of your model project. Your own
model folder was not touched.

- Where: `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`,
  a Git worktree (a second folder of the same repository) on branch
  `toolkit-v2/approved-changes`, started from your commit `efa2440`.
- Commits, oldest first:
  - `9c27ebf` Rewrite project instruction files for Toolkit V2 (items 1, 2, 4, 5, 6, 7)
  - `8da8b2d` Use the toolkit memory commands instead of the model's memory runtime (items 13, 14, 15)
  - `c33bd04` Update the work item templates and rules for Toolkit V2 (items 8, 9, 10, 11, 12)
  - `57b08b7` Run the Salesforce guards in Codex and rewrite the Salesforce skill descriptions (items 17, 18)
  - `ea9050f` Use a general example in the plain English rule and fill the rules list (item 20)
  - `9940854` Fix review findings in the approved model changes (items 1, 2, 9, 12, 16, 17, and your wording put back in two memory files)
  - `94b23c8` Use the approved Salesforce skill descriptions ("Skill description changes" below)
  - `031b71f` Route handoffs, requirement changes, and handovers to their skills (your routing approvals, 2026-09-27)
  - `287b0c3` Check only the Salesforce commands the shell will run in the org guard ("Fixes from the sample runs" below)
  - `8ff4d3d` Fix wording the sample runs showed sends agents wrong ("Fixes from the sample runs" below)
  - `908456e` Keep an unanswered memory question as a proposal (your memory additions, 2026-09-27)
  - `628027c` Read the whole line in the org guard when any part of it cannot be read ("Fixes from the sample runs" below)
  - `f4684a5` Take an org only from the setting in front of its own sf command in the org guard ("Fixes from the sample runs" below)
  - `54c5520` Hold the requirements layout sentence until Mike approves it (takes back the `requirements/AGENTS.md` part of `8ff4d3d`; put back in `dd49a67` after your yes)
  - `dd49a67` Keep one folder per requirements area, copied from system-area-template/ (your decision of 2026-09-28 (1); "Fixes from the sample runs", item 6)
  - `81b3bda` Skip git fetch when the repository has no remote (decision (2); item 7)
  - `9d22a3d` Say copy, not rename, in the three template guides (decision (4); item 9)
  - `8cfd0b1` Route Salesforce platform questions to sf-architect-solutioning (decision (5); item 10)
  - `9a2a69b` Use the tested sf-component-tracker description and fix old wording in two Salesforce skills (decisions (6) and (9); items 11 and 14)
  - `7faee75` Guard DevOps Center pipeline deploys, and state the Codex sandbox and script rules (decisions (3), (7), and (8); items 8, 12, and 13)
  - `5e7d7a0` Say which script lines the org guard checks, and that a script file run later is not checked (decision (7); item 12)
- Full diff of `.memory/` and `.work-items/` from `efa2440` to the branch's
  last commit: `dev/model-changes-ignored-folders.diff` (made with
  `git diff efa2440 HEAD -- .memory .work-items` in the second folder).

## Decision for you

**Memory approval question.** Your "Proposed memory saves" card (a heading,
then **Change**, **Summary** or **Affected content**, and **Your decision**)
is no longer in the model. It was in `.claude/rules/memory-review-and-save.md`
and `.memory/memory-criteria.md`. Item 14 moved the approval policy into the
toolkit's `memory-save` skill, and that skill asks one line instead:
"Save to memory: <one-line summary>?".

- Recommendation: have `memory-save` show your card. Your goal says the
  model's formats are kept, and the card shows what kind of change is proposed
  (create, update, replace, or delete), which the one line does not.
- If you agree, it is a change to the toolkit's `memory-save` skill, not to
  the model. It is listed under "What the toolkit still needs".

## One line per approved item

1. **One root `CLAUDE.md`.** `CLAUDE.md` now holds only `@AGENTS.md`. Removed `.memory/CLAUDE.md` and `requirements/CLAUDE.md` (there were no others). Because the root `CLAUDE.md` exists, Claude Code no longer loads `.memory/AGENTS.md` or `requirements/AGENTS.md` by itself (it reads a folder's `AGENTS.md` only in a project with no `CLAUDE.md`). Root `AGENTS.md` now tells both Claude Code and Codex to read a folder's own `AGENTS.md` before editing files there, and its Memory section names `.memory/AGENTS.md`.
2. **`AGENTS.md` rewritten.** Your continuity paragraph stays at the top, word for word. New sections: Every session, What the owner decides, Where information goes (one table; the old "Quick saves" folded in), Work tracking, Memory, Rules (generated list between `<!-- toolkit:rules:start -->` and `<!-- toolkit:rules:end -->`, filled for the model's current 18 rules), Project map, Commands (the old Tools table), How to write replies. It names the V2 skills (`work-on`, `work-status`, `work-decide`, `memory-save`, `memory-find`, `memory-tidy`, `project-setup`, `solution-design`). Tracker, memory, and Salesforce parts sit inside setup markers. The ID lines say the prefix comes from `tracker.idPrefix` in `.toolkit.json`, so a project with another prefix is not misdescribed. The `PROJECT.md` row keeps your words "systems, and tracker". Your fill-in guide comment is kept and now says what toolkit init fills. Dropped: "Read `.claude/rules` first", the `.system-guide.json` line (the System Guide plugin is not in V2; `system-guide/` is still routed), the `scripts/memory.py doctor` row, and "V2 curator".
3. **`SOUL.md`.** No change. `AGENTS.md` tells the agent to read it when the project has one.
4. **`.claude/RULES.md` removed.** `docs/toolkit-manual.md` did not exist in the model, so nothing else to remove. `AGENTS.md` lists the rules.
5. **`README.md` shortened.** Now: purpose, Start here, Project records (links), Project memory (your Obsidian setup steps and the backup command, built-in memory only), and Project checks and release. Removed: the Toolkit setup section, the memory setup steps that used `scripts/memory.py` and the curator, the Toolkit files section, "Second Brain V2", and the `.toolkit-memory.json` mention.
6. **`DECISIONS.md` added** at the root (the V2 template: an append-only table of ID, Date, Decision, Why, Decided by, Replaces). Also linked from `PROJECT.md` and added to the paths of `.claude/rules/publish-project-documents.md`.
7. **`.toolkit-memory.json` removed.** Toolkit init writes `.toolkit.json`. The memory line in `PROJECT.md` now names `.toolkit.json`, with one line per memory system.
8. **`.claude/rules/work-item-folders.md` added** (the V2 rule). The example ID is written `WI-001`, the model's style, not a token. The toolkit must install it only for the local tracker.
9. **Work item header fields.** `.work-items/work-item-template/WORK-ITEM.md` now has `id`, `title`, `type`, `stage`, `status`, `parent`, `waiting_on`, `priority`, `delivery`, `requirements_approved`, `design`, `result_approved`, `updated`. `active_phase` and `requirements_status` are gone. The `waiting_on` line is in double quotes, because the colon in `external: who` stops standard YAML readers (for example Python's) from reading an unquoted line. The toolkit writes a real value the same way, for example `waiting_on: "external: Acme IT"`.
10. **Six statuses.** Backlog, Ready, In Progress, In Review, Done, Cancelled. A blocked item sets `waiting_on` and fills its Blockers line; your fill-in guide now says so.
11. **Work item body.** "Related items" asks for work item IDs, never folder paths. Open Questions "Decision needed from" says `owner` for you. The Roadmap table has a Sub-items column. Your fill-in guide changed in three places only: items are created with `toolkit work new`, no `active_phase`, and `owner`. `.claude/rules/keep-work-item-current.md` now names `work-on`, `work-decide`, `work-delegate`, `handoff`, and `toolkit work lifecycle` instead of the old `work` skill, and says to set `waiting_on` to `owner`.
12. **`DESIGN.md` header.** Added `work_item: WI-001`, `status: proposed`, `approved: "no"`. The quotes keep older YAML readers from reading `no` as the value false; the toolkit writes it the same way. The line `**Work item:** [WORK-ITEM.md](WORK-ITEM.md)` is now `**Requirements:** WI-001`. Everything else, including your guidance, is unchanged.
13. **Four-section current focus.** `.memory/CURRENT_FOCUS.md` has Now, Waiting on the owner, Untracked to-dos, Next session starts with. Your fill-in guide style and the "Last updated" line are kept.
14. **One-page memory criteria.** `.memory/memory-criteria.md` keeps your test, type table, working-context section, and never-save list, in your words. Removed: the mode and backup frontmatter and the onboarding and trusted sections, which now point to the `memory-save` skill. That removal includes your approval card; see "Decision for you". Backup uses `toolkit memory export` and `toolkit memory import`. Whole-project decisions go to `DECISIONS.md`.
15. **Learned-rules table removed.** An owner correction about what is worth saving is now a `feedback` memory. This is stated in `memory-criteria.md`, `.memory/AGENTS.md`, and `.claude/rules/memory-review-and-save.md`.
16. **`delivery/`.** No change to the folder. Install condition: Salesforce projects only. `PROJECT.md` lines that point into it are now inside Salesforce markers: the "Why this Salesforce project exists" purpose line (a non-Salesforce project gets "Why this project exists") and the three lines for `force-app/` and the two `delivery/deployment/.../package.xml` manifests.
17. **Salesforce guards also protect Codex.** `.claude/hooks/guard-protected-orgs.js` and `guard-permission-set-deploy.js` are renamed `.cjs`. With `--host codex`, every "ask" becomes "deny", because Codex cannot ask; the agent hands the command to you. The permission set guard now finds its receipts next to its own folder. `.claude/settings.json` points at the `.cjs` files, and `.codex/hooks.json` now runs both guards for Codex (matcher `^Bash$`, shell commands, the project root from `git rev-parse --show-toplevel`). References were updated in `salesforce-org-safety.md`, `permissions-source-control.md`, `tools/permissions/permsets.py`, `tools/permissions/PERMISSIONS-RUNBOOK.md`, and `.claude/protected-orgs.json`. That file's comment and its notes on `action` and `unknownOrgAction` now match the V2 reference: the guard blocks an org it cannot classify the same way it blocks production, in Claude Code and in Codex. Your other guard edits are kept.
18. **Salesforce skill descriptions.** `sf-deploy-check`, `sf-component-tracker`, and `sf-data-change` use the SKILL-INDEX texts in both `.claude/skills/` and `.agents/skills/`. The two copies are identical, and the skill bodies are unchanged. (Changed 2026-09-28: one body line each in `sf-component-tracker` and `sf-deploy-check`, and a new `sf-component-tracker` description. See "Fixes from the sample runs", items 11 and 14.)
19. **`tests/TEST-PLAN-TEMPLATE.md`.** No change to where it is. (Changed 2026-09-28: its fill-in guide says "copy this file". See "Fixes from the sample runs", item 9.)
20. **`plain-english-artifacts.md`.** The Salesforce role-hierarchy example is now a general one: who can see and edit projects in a team web app. The rule text is unchanged.
21. **`system-guide/`.** No change to the folder. (Changed 2026-09-28: the fill-in guide of `system-guide/AREA-TEMPLATE.md` says "copy this file". See "Fixes from the sample runs", item 9.)
22. **`.vscode/` and `.sfdx/`.** No change in the model. The planned import step must leave them out; that step is not built yet.
23. **Plugin switches.** No change in the model. Toolkit init writes `enabledPlugins` into each project's settings. The model's existing `"second-brain@claude-toolkit": false` line is kept.

### Memory mechanism (part of items 13 to 15)

- Removed: `scripts/memory.py`, `.claude/hooks/memory_trigger.py`, `.claude/hooks/memory_audit.py`, `.claude/hooks/_memory_patterns.py`, `.claude/hooks/toolkit-session-start.mjs`, `.claude/agents/memory-curator.md`, `tests/test_memory_runtime.py`.
- Removed from `.claude/settings.json`: the UserPromptSubmit, SessionStart, and memory Stop registrations. Kept: the graph Stop hook, both guard hooks, and every permission entry.
- Removed from `.codex/hooks.json`: the SessionStart entry.
- Text now names `toolkit memory save`, `reindex`, `find`, `get`, `focus`, `glossary`, `toolkit doctor`, and the `memory-save` and `memory-find` skills, in `.memory/AGENTS.md`, the "generated by" line of `.memory/MEMORY.md`, and the rules `memory-review-and-save.md`, `session-handoff.md`, `dependency-graph.md`, and `project-file-locations.md`. The toolkit has no `toolkit memory doctor`; `toolkit doctor` checks memory.
- `memory-review-and-save.md` no longer shows your "Proposed memory saves" card and `.memory/AGENTS.md` no longer points to it; the `memory-save` skill's one-line question replaces it. See "Decision for you".
- Kept as you had them: the Obsidian guidance (relative Markdown links, link repair on rename, merge, archive, delete), `project_topic_template.md` and its YAML, the `MEMORY.md` layout, and `terminology-glossary.md`.

## Setup markers

A marker is an HTML comment on its own line. When a project is set up, toolkit init deletes the marker lines. It keeps the lines between a marker and `<!-- endif -->` when the condition matches the setup answer, and deletes them when it does not. Blocks do not nest.

| Opening marker | Kept when |
| --- | --- |
| `<!-- if salesforce -->` | the project is a Salesforce project |
| `<!-- if not salesforce -->` | it is not |
| `<!-- if tracker=local -->`, `tracker=notion`, `tracker=github`, `tracker=jira` | that tracker was chosen |
| `<!-- if memory=builtin -->`, `memory=hindsight`, `memory=notion` | that memory system was chosen |

The closing marker is always `<!-- endif -->`. Markers are used in `AGENTS.md`, `README.md`, and `PROJECT.md`. All 24 combinations of tracker, memory, and Salesforce were rendered with the toolkit's own renderer: no errors and no markers left. `AGENTS.md` comes out at 126 to 140 lines, `README.md` at 30 to 36, and `PROJECT.md` at 46 to 49. With Salesforce off, `README.md` and `PROJECT.md` have no Salesforce, `force-app/`, or `delivery/` lines; in `AGENTS.md` only the generated rules list still names Salesforce rules, and `toolkit sync` rebuilds that list from the rules a project actually has.

Built: toolkit init fills `<Project name>` on the heading lines of `AGENTS.md`, `README.md`, and `PROJECT.md` (the `fill` rule in `plugins/toolkit/scaffold/CONDITIONS.json`). The fill-in guide comments keep their own wording. Every other `<angle bracket>` prompt is meant to stay for the agent to fill.

## What the import step leaves out

Built: `dev/tools/import-model.mjs` copies this branch's folder into `plugins/toolkit/scaffold/model/`, and `plugins/toolkit/scaffold/CONDITIONS.json` holds the install conditions.

- Always left out: `.git`, every `.sfdx/`, `.vscode/`, and `__pycache__/` folder, `.DS_Store` files, the `exclude` patterns in `CONDITIONS.json`, and any file the model's Git ignores and does not track. The memory mechanism files are already gone from the model.
- Installed only for the local tracker: `.work-items/**` and `.claude/rules/work-item-folders.md`. Only for built-in memory: `.memory/**`. Only for Salesforce projects: `delivery/`, `tools/kb/`, `tools/permissions/`, `sfdx-project.json`, `.forceignore`, the two guard hooks, `.claude/protected-orgs.json`, the `sf-*` skills, and 9 Salesforce rules. A project without Salesforce also loses the guard and graph hooks from `.claude/settings.json`, the guards from `.codex/hooks.json` (which leaves that file out), and the Salesforce lines of `.gitignore`.

## How to bring the changes into your model

Your model's `.memory/` and `.work-items/` files are tracked by Git even though `.gitignore` lists the folders. They were committed in `e7c3b37`, the same commit that added the ignore lines, and Git keeps tracking a committed file even when `.gitignore` lists it. So one merge brings in everything, including those two folders. No copying is needed.

1. Check that you have not changed or committed anything since `efa2440`:

   ```
   cd /Users/michaelrihm/Documents/Projects/toolkit-v2-model-project
   git log --oneline -1
   git status --short
   git status --short --ignored -- .memory .work-items
   ```

   The first command should print `efa2440 Clarify project rules and seed fill-in guidance`. The other two should print nothing.

   - If the first shows a different commit, you have committed since. Do not merge by hand. Ask an agent to bring your newer commits onto the branch first; files both sides changed (for example `AGENTS.md` or `README.md`) need a careful merge.
   - If either of the other two prints a file, you have edits not yet committed. Commit them first, then treat it like the case above. `dev/model-changes-ignored-folders.diff` shows exactly what this change does to `.memory/` and `.work-items/`.

2. Merge. Because the branch starts at your latest commit, this is a fast-forward: Git just moves `main` forward to the branch's last commit, with no new merge commit.

   ```
   git merge toolkit-v2/approved-changes
   ```

3. Only if step 2 did not update `.memory/` or `.work-items/` (for example, if those files are untracked on your side), copy the changed files one by one. This never deletes your own notes:

   ```
   A=/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved
   M=/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project
   cp "$A/.memory/AGENTS.md" "$A/.memory/CURRENT_FOCUS.md" "$A/.memory/MEMORY.md" "$A/.memory/memory-criteria.md" "$M/.memory/"
   rm "$M/.memory/CLAUDE.md"
   cp "$A/.work-items/work-item-template/WORK-ITEM.md" "$A/.work-items/work-item-template/DESIGN.md" "$M/.work-items/work-item-template/"
   ```

4. After the merge, remove the extra folder and branch:

   ```
   git worktree remove /Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved
   git branch -d toolkit-v2/approved-changes
   ```

## Left as they were (no approved item covers them)

- `PROJECT.md` names `.system-guide.json` on its System Guide line.
- `humanize-outbound-text.md` names the `humanizer` skill, which V2 does not ship; it already falls back to `unslop`.
- "Project Init" is still named in `tools/permissions/README.md` and the comment at the top of `tools/permissions/PERMISSIONS-RUNBOOK.md`. (Line 29 of both `sf-component-tracker` copies no longer names it: item 14 under "Fixes from the sample runs". `tools/kb/graph_freshness_hook.py` no longer points to `knowledge/memory/`; see "Fixes from the sample runs".)
- Four Salesforce rules link to `.claude/skills/sf-*/SKILL.md`. Codex can still read those files; its own copies are in `.agents/skills/`.
- In `DESIGN.md`, the body line "Design status: Draft | In review | Approved | Superseded" uses different words from the new header (`proposed`, `approved`, `superseded`).
- The topic template's `authorization` prompt still mentions an "Approved card".
- The fill-in guide in `.memory/project_topic_template.md` says "copy this file to a typed filename", but `.memory/AGENTS.md` now says the folder is written only with `toolkit memory` commands.

## What the toolkit still needs

- If you agree with the recommendation under "Decision for you": `memory-save` shows your card instead of its one-line question.
- After you merge this branch: change `DEFAULT_SOURCE` in `dev/tools/import-model.mjs` to your own model folder, before the second folder is removed, and run the import again.

Done since this list was written: `toolkit memory save` writes the model's topic YAML; `toolkit memory reindex` writes the model's `MEMORY.md` layout; work items and designs are made from the model's own templates, with `waiting_on` and `approved` in double quotes (the toolkit's separate template copies are gone); init fills `<Project name>`; and the import step and `CONDITIONS.json` are built.

## Skill description changes (approved 2026-09-27)

You asked for every skill description to follow the official Claude Code and
Codex guidance, so the agent knows exactly when to use each skill. The rules
are in `dev/research/skill-writing-guide.md`. Three of the model's Salesforce
skills are affected. Only the `description:` line changes; the skill bodies
stay as they are.

Put the same line in both copies of each skill:
`.claude/skills/<name>/SKILL.md` and `.agents/skills/<name>/SKILL.md`. It
replaces the `description:` line that item 18 wrote.

- `sf-deploy-check`: now names UAT as a shared org, and says that running the
  deploy itself is the `work-finish` skill's job, so "deploy it to UAT" starts
  `work-finish`, which runs this check first.

  ```yaml
  description: 'Finds hitch-hikers: components or pending edits that would ship with a Salesforce deploy before their feature is ready. Use before any deploy to a shared org (UAT, full copy, staging, or production), including a deploy command for the owner. Not for running the deploy; use work-finish.'
  ```

- `sf-data-change`: now says it is opened first, before `work-on`, when you ask
  for a production data load. In the routing check, Codex opened `work-on`
  first for "Load these 500 contacts into production."

  ```yaml
  description: 'Builds the owner''s package for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps. Use first, before work-on, when the owner asks to load, import, update, or delete production records, for example "load this file into production".'
  ```

- `sf-component-tracker`: the words do not change. The line is now in single
  quotes, because the guide says to quote every description: a colon added
  later would otherwise break the file's header. (Replaced on 2026-09-28 by
  the description routing round 3 tested; see item 11 under "Fixes from the
  sample runs".)

  ```yaml
  description: 'Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted, when a deploy result comes back, or when a deploy needs manual steps.'
  ```

Where it stands: applied on the branch in commit `94b23c8`, in all 6 files,
and imported. `node dev/tools/import-model.mjs --check` passes.

## Handoff rule wording (approved 2026-09-27)

You approved this with the routing approvals (`dev/GOAL.md`). It is applied
on the branch in commit `031b71f`, word for word as proposed below, and
imported. It changes one model file, `.claude/rules/session-handoff.md`.

- The problem: when you say "I'm going to clear context" after a short
  session, Claude Code often skips the handoff. It quotes the rule's last
  sentence, "Skip this for small edits and quick lookups". That sentence is
  meant for handoffs the agent offers on its own, not for one you ask for. In
  one test the agent even said a finding "will be gone after you clear" and
  still wrote no handoff.
- Evidence (Claude Code, the same test project): with the current rule, 1 of
  3 runs opened `handoff` (routing round 1 had 0 of 3). With the wording
  below, 3 of 3 did. Codex opened `handoff` in round 1 without this change.
- Recommendation: yes. The skill descriptions already say "even a short one";
  the rule is the only text that still says to skip.

Current text:

```markdown
When the session is long and the next step is complex, offer a handoff. Use the `handoff` skill. Before the handoff, review the current focus (`toolkit memory focus`) and the memory criteria; update the focus, and save only authorized lasting memory, with the `memory-save` skill. Then write the prompt. Skip this for small edits and quick lookups.
```

Proposed text (one sentence added at the start; "Skip this" becomes "Skip the
offer"):

```markdown
When the owner says he is clearing context or ending the session, or asks for a handoff, use the `handoff` skill, whatever the session's length. When the session is long and the next step is complex, offer a handoff. Use the `handoff` skill. Before the handoff, review the current focus (`toolkit memory focus`) and the memory criteria; update the focus, and save only authorized lasting memory, with the `memory-save` skill. Then write the prompt. Skip the offer for small edits and quick lookups.
```

The same commit adds your two approved routing lines to `AGENTS.md`, under
"Every session", right after the `work-on` line:

```markdown
- A change to a requirement, such as R-01, at any stage: `work-requirements`.
- "You drive", "take it from here", "run with it", even about a named item: `work-delegate`.
```

"Run with it" is the third handover phrase the `work-delegate` skill already
lists (`references/agent-led-delivery.md`).

## Fixes from the sample runs (2026-09-28)

The sample runs found 77 problems (`dev/test-runs/open-bugs.md`). Most are in
the toolkit's own code and skills. The ones below are in model files. Each
entry says what changed, which finding it fixes, and which approval covers it.
Everything under "Applied" is on the branch and imported, and
`node dev/tools/import-model.mjs --check` passes.

### Applied

1. **The org guard checks only the Salesforce commands the shell will run.**
   Commits `287b0c3`, `628027c`, and `f4684a5`.
   - Finding: b-salesforce b3. The guard matched the whole command text, so
     `toolkit work history WI-001 --note "... sf project deploy start ..."`
     was refused as a deploy (s13, s17), and `sf data create record --help`
     was refused as a data write.
   - File: `.claude/hooks/guard-protected-orgs.cjs`. What it does now:
     - It splits the command line into simple commands at `;`, `&&`, `||`,
       `&`, `|`, `(`, `)`, and line ends. Quotes, backslashes, comments,
       redirections, and here-documents are read as text.
     - An `sf` or `sfdx` command is checked by its own words: the command
       words before the first option, and that command's own `-o`,
       `--target-org`, or `-u` value. `--help` or `-h` passes, because it
       only prints help. `sf project:deploy:start` is read as
       `sf project deploy start`.
     - A command that never runs its arguments is not checked: `toolkit`,
       `echo`, `printf`, `cat`, `grep`, and a few other file and text
       commands, and the git commands that take text and run nothing
       (`git commit`, `git tag`, `git log`, `git status`, and others). So a
       note, a commit message, or a here-document written to a file can
       mention a deploy.
     - Where the guard cannot be sure what runs, it matches the whole
       command line as text, as before. That happens when the line holds any
       other command (a Python or shell script, `bash -c`, a pipe into `sh`,
       `xargs`, or `bash deploy.sh` after an `echo` wrote that script), a
       `$(...)` or backticks (even inside double quotes, because the shell
       runs them), or an unclosed quote. A line made only of `sf` commands
       and those text commands is read command by command.
     - It also matches the whole line when the reader could have misread it
       (`f4684a5`): arithmetic, `((...))` or `$[...]`, whose `<<` is a
       shift and not a here-document; a here-document whose closing line
       never comes, or that sits on a command with no words; a `NAME=value`
       setting whose value mentions `sf` (`GIT_EDITOR='sf ...' git commit`);
       any setting in front of `git`, which runs commands named in settings
       such as `GIT_EXTERNAL_DIFF`; and a bare `SF_TARGET_ORG=...;`. A
       second review ran four such lines in bash and zsh, and each really
       ran a production deploy that `628027c` let through.
     - Target org, in order: the command's own `-o`; then
       `SF_TARGET_ORG=...`, `SFDX_DEFAULTUSERNAME=...`, or
       `SF_TARGET_ORG_ALIAS=...` written in front of that same `sf` command;
       then the default org. An org set anywhere else on the line (after
       `export`, as a bare setting, in front of another command, in a quote,
       or in a comment) never replaces the default org: the whole-text check
       judges it beside the default org, and the stricter result wins
       (`f4684a5`). `628027c` took such an org from anywhere on the line, so
       `SF_TARGET_ORG=acme-uat sf project deploy validate -x p.xml && sf
       project deploy start -x p.xml` asked you to approve a sandbox deploy
       while the second deploy really went to the default org, which can be
       production. The sandbox prompt now says where the org came from.
     - A command is known by the set of words in its name (`f4684a5`). The
       installed Salesforce CLI (sf 2.128.5) reads those words in any order
       and with spaces or colons, so `sf deploy project start` and
       `sf force source deploy` are deploys; neither guard version caught
       them before. The old names sf still accepts are guarded too:
       `sf deploy metadata` (a deploy), `sf deploy metadata validate`, and
       `sf env delete scratch` or `sandbox`. `sf data update bulk` and
       `sf data update resume` are now guarded; the rule already forbade
       them in production. `sf apex run test` and `sf apex test run` run
       Apex tests, which the rule allows, so they now pass (before, the
       guard read them as `sf apex run`).
     - When one line holds several guarded commands, the strictest result
       wins.
     - Unchanged: `.claude/protected-orgs.json`, the messages apart from
       the sandbox prompt, "ask" becoming "deny" in Codex, and PowerShell
       commands (still matched as whole text).
     - Still refused: a Python or shell script whose text only mentions a
       deploy, and a line that joins a note about a deploy to a script, because
       the guard cannot tell whether the script runs it.
   - File: `.claude/rules/salesforce-org-safety.md`, section Enforcement. After
     "It does not check `apex test run` or reads." it now says: "It checks the
     `sf` and `sfdx` commands the shell will run, not text that only mentions
     one, such as a toolkit note or a commit message, and it lets `--help`
     through. A script, a `bash -c` string, or a `$(...)` that holds such a
     command is still checked." The last sentence was wrong about script
     files and was rewritten on 2026-09-28 in `5e7d7a0` (item 12).
   - Test: `plugins/toolkit/tests/scaffold/org-guard.test.mjs` runs the
     shipped guard with a fake `sf`, with no default org and with a
     production or sandbox default org. The round-3 commands and `--help`
     pass; 42 ways of really running a production deploy, data write, or
     Apex run are blocked in both hosts; an `SF_TARGET_ORG=...` elsewhere on
     the line never turns a production deploy into a sandbox prompt; Apex
     tests pass; a sandbox deploy still asks in Claude Code and is blocked in
     Codex. Of the 13 tests, the guard before `287b0c3` fails 7 and the guard
     at `628027c` fails 4.
   - Covered by: item 17. Both files were approved for change; this is a bug
     fix in them. Every command newly guarded is one the rule already
     forbids in production, and `sf apex run test` is one it allows.

2. **Where a test plan is saved.** Commit `8ff4d3d`.
   - Finding: b-salesforce, "The test plan was saved in the Git-ignored
     tracker folder" (s20 wrote `WI-002-TEST-PLAN.md` beside the item's
     `WORK-ITEM.md`, so it is never committed).
   - File: `AGENTS.md`, table "Where information goes". New row after the
     `PROJECT-ROADMAP.md` row:

     ```markdown
     | A work item's test plan | `tests/`, a copy of `TEST-PLAN-TEMPLATE.md` named for the item, committed on the item's branch; never in the tracker |
     ```

   - Covered by: item 2 (`AGENTS.md` rewritten). Its project map already said
     `tests/` holds test plans; the new row says it where agents route files.

3. **Saving documents in a repository with no remote.** Commit `8ff4d3d`.
   - Finding: d-local-hindsight 4 and claude-a. The sample projects had no
     Git remote. The rule said to verify the save reached the remote, which
     cannot happen there, so agents committed and fast-forwarded by hand with
     nothing written down.
   - File: `.claude/rules/publish-project-documents.md`. After "An unpushed
     commit is unfinished. Verify the complete save reached the remote." it
     now says: "In a repository with no remote (`git remote` prints nothing),
     the save is finished when its commit is on the local default branch."
   - Covered by: item 6 (this file was approved for change); a bug fix, since
     the rule asked for a step that cannot happen. The `publish-docs` skill
     gets the matching local mode in the toolkit.

4. **The dependency drift note pointed at a folder these projects do not
   have.** Commit `8ff4d3d`.
   - Finding: listed under "Left as they were" above; an agent reading the
     note would look for `knowledge/memory/`, the old toolkit's memory folder.
   - File: `tools/kb/graph_freshness_hook.py`, the "What to do with this file"
     text. Was: "contradicts something recorded in `knowledge/memory/` or in a
     work item. ... the main agent makes the change once the owner approves
     them." Now: "contradicts something recorded in project memory (search it
     with `toolkit memory find`) or in a work item. ... the main agent makes
     the change once the owner approves them, with the `memory-save` skill for
     memory." Its test in `tools/kb/test_graph_tools.py` now checks for
     `toolkit memory find` and that `knowledge/memory/` is gone. The file's 40
     tests pass (one skips itself when no graph has been built).
   - Covered by: your memory decision of 2026-09-26 ("Memory: Claude's
     mechanisms, Mike's formats"): model text that names the old memory
     mechanism changes to name the toolkit command.

5. **An unanswered memory question is kept as a proposal.** Commit `908456e`.
   - Not a sample-run finding: it brings the model in line with your memory
     additions of 2026-09-27 (saved proposals), which the toolkit's
     `memory-save` skill now follows.
   - File: `.claude/rules/memory-review-and-save.md`, section Approval. Was:
     "There is no proposal inbox; hold an unanswered question in the
     conversation and continue independent work." Now: "An unanswered save
     question is kept as a proposal: the agent does not rely on it, and
     `work-decide` shows it to the owner until he approves or rejects it. The
     `memory-save` skill says how."
   - File: `.memory/AGENTS.md`. Was: "only with `toolkit memory` commands
     (`save`, `retire`, `restore`, `delete`, `focus`, `glossary`,
     `reindex`)." Now: "only with `toolkit memory` commands, for example
     `save`, `retire`, `focus`, `glossary`, and `reindex` (`toolkit memory
     --help` lists them all)." The closed list left out `rename` and the new
     proposal commands, so an agent could read them as forbidden.
   - Covered by: your memory additions (1), 2026-09-27, in files items 13 to
     15 approved for change.

6. **Which layout a requirements area uses.** Commit `dd49a67`.
   - Finding: a-local-builtin, "The requirements area file layout is not the
     same from run to run": round 2 wrote `requirements/greet/GREET.md`,
     round 3 `requirements/greet-cli.md`. `requirements/AGENTS.md` said "one
     maintained file per durable business area, following
     AREA-TEMPLATE.md", but the template is a folder, `system-area-template/`.
   - File: `requirements/AGENTS.md`. Its first sentence is now: "Keep one
     folder per durable business area, holding one maintained file. Start a
     new area by copying `system-area-template/` to a folder named for the
     area, then rename the copied `AREA-TEMPLATE.md` for the area, for
     example `requirements/billing/BILLING.md`. Leave
     `system-area-template/` itself unchanged for the next area." The rest
     of the paragraph is unchanged. This is the sentence applied in
     `8ff4d3d` and taken back out in `54c5520` while it waited for your yes.
   - Covered by: your decision of 2026-09-28 (1).

7. **Skip `git fetch` when there is no remote.** Commit `81b3bda`.
   - Finding: d-local-hindsight 3. `.claude/rules/shared-repository-work.md`
     runs `git fetch origin` before the first edit. In a project with no
     remote it fails, and one session told you the refusal would need
     resolving before it could build.
   - File: `.claude/rules/shared-repository-work.md`. New first bullet under
     the commands: "- No remote (`git remote` prints nothing): skip `git
     fetch`, and never report a fetch failure as a blocker."
   - Covered by: your decision of 2026-09-28 (2).

8. **Sandbox deploys in Codex (choice b).** Commit `7faee75`.
   - Finding: b-salesforce b2. In Codex the guard turns every "ask" into
     "deny", so an agent can never run a sandbox deploy or sandbox data
     change, even after your yes; you ran each one yourself.
   - File: `.claude/rules/salesforce-org-safety.md`, section Allowed. New
     bullet after the two sandbox bullets: "- In Codex, the owner runs every
     sandbox deploy and sandbox data change, including `sf apex run` against
     a sandbox. Hand him the exact command, with its `-o <sandbox>`; do not
     run it yourself, even after his yes." The guard is unchanged: it
     already blocks these in Codex. `sf apex run` is named because the rule
     groups it with sandbox data writes and the guard blocks it the same way.
   - Covered by: your decision of 2026-09-28 (3), choice (b).

9. **Template guides say "copy", not "rename".** Commit `9d22a3d`.
   - Each template must stay for the next use. The fill-in guides now start:
     - `tests/TEST-PLAN-TEMPLATE.md`: "copy this file and rename the copy for
       the work item or release being checked."
     - `requirements/system-area-template/AREA-TEMPLATE.md`: "copy this
       folder and rename the copied folder and file for the real business
       area."
     - `system-guide/AREA-TEMPLATE.md`: "copy this file and rename the copy
       for the real system area."
   - The rest of each guide is unchanged.
   - Covered by: your decision of 2026-09-28 (4).

10. **Salesforce platform questions.** Commit `8cfd0b1`.
    - Finding: routing round 0, message 43, "Which Flow type fits this?".
    - File: `AGENTS.md`, the Salesforce block under "Every session", after
      the `solution-design` line: "- A Salesforce platform question, even
      about a work item: `sf-architect-solutioning`." A project without
      Salesforce does not get the line (it is inside the
      `<!-- if salesforce -->` block).
    - Covered by: your decision of 2026-09-28 (5).

11. **`sf-component-tracker` before `work-on`.** Commit `9a2a69b`.
    - Finding: routing round 3, O27. The tested description matched 3 of 3
      in both hosts.
    - Files: the `description:` line of `.claude/skills/sf-component-tracker/SKILL.md`
      and `.agents/skills/sf-component-tracker/SKILL.md` (the two copies
      stay identical), and row 25 of `dev/SKILL-INDEX.md` in this repository
      (299 characters):

      ```yaml
      description: 'Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync. Use first, before work-on, when Salesforce metadata under force-app/ is added, changed, renamed, or deleted, a deploy result comes back, or a deploy needs manual steps.'
      ```

    - Covered by: your decision of 2026-09-28 (6).

12. **Scripts that deploy.** Commits `7faee75` and `5e7d7a0`.
    - The guard reads the command line only. A script written in one call
      (`cat <<EOF > deploy.sh`, or the Write tool) and run in a later call
      (`bash deploy.sh`) has no `sf` text in the second call, so no guard
      sees it.
    - File: `.claude/rules/salesforce-org-safety.md`, section Never, after
      "Never trust the default org.": "- Never write or run a script, or any
      other file, that deploys, validates, writes data, or runs Apex. Run
      each `sf` command directly, so the guard sees it." (`7faee75`)
    - Same file, section Enforcement (`5e7d7a0`). The sentence "A script, a
      `bash -c` string, or a `$(...)` that holds such a command is still
      checked." said a script file is covered, which is wrong: the guard
      lets `bash deploy.sh` and `./scripts/deploy-uat.sh` through in both
      hosts. It now says: "A `bash -c` string, a `$(...)`, a here-document
      fed to a shell, or a script written and run in the same command is
      still checked. A script file run by a later command is not checked,
      which is why the Never list forbids such a script." The guard is
      unchanged.
    - Test: `plugins/toolkit/tests/scaffold/org-guard.test.mjs`, "a script
      file run by a later command is not seen by the guard, so the rule
      forbids such a script": checks both rule sentences, that `bash
      deploy.sh` and `./scripts/deploy-uat.sh` pass the guard, and that a
      script written and run in the same command, or a here-document fed to
      `bash`, is blocked, in both hosts.
    - Covered by: your decision of 2026-09-28 (7). The replaced sentence was
      agent-written in `287b0c3` (item 1), not your wording; the new one
      states what the guard does, so the rule no longer contradicts its own
      Never line.

13. **The guard checks DevOps Center pipeline deploys.** Commit `7faee75`.
    - `sf project deploy pipeline start`, `quick`, `resume`, and `validate`
      (DevOps Center, beta; checked against sf 2.142.7 with the
      devops-center plugin 1.2.28) deploy, or validate, to the org of a
      pipeline stage, which can be production. They name only the DevOps
      Center org (`-c`) and the stage's branch (`-b`), never the target org.
      The guard at `54c5520` let all four through.
    - File: `.claude/hooks/guard-protected-orgs.cjs`. The four commands are a
      new guarded kind, `pipelineDeploy`. The guard never takes an org for
      them from `-o`, a setting in front of the command, or the default org,
      because none of those is the stage's org. Each is judged as a command
      with no resolvable target org, so this project blocks it in both hosts.
      The message says a pipeline deploy goes to a pipeline stage's org that
      the command line does not name. `sf project deploy pipeline report`
      only reads and passes, as do `--help` and a note that only mentions a
      pipeline deploy.
    - File: `.claude/rules/salesforce-org-safety.md`, section Enforcement: the
      list of checked commands names "DevOps Center pipeline deploys", and a
      new sentence says the guard treats a pipeline deploy's org as
      unclassified.
    - Test: `plugins/toolkit/tests/scaffold/org-guard.test.mjs`, "a DevOps
      Center pipeline deploy is blocked, whatever org the line or the default
      org names": 9 command lines, in both hosts, with no default org and
      with a sandbox default org, are blocked, and none looks up an org.
    - Left to the rule, as recommended: `sf org assign permset` and
      `permsetlicense`.
    - Not covered by decision (8), so not guarded: the eight `sf devops`
      commands that change DevOps Center records. See proposal A under
      "Needs your yes".
    - Covered by: your decision of 2026-09-28 (8).

14. **Old wording in two Salesforce skill bodies.** Commit `9a2a69b`.
    - Item 18 kept the bodies as they were. Both copies of each skill changed
      and stay identical.
    - `sf-component-tracker`, line 29: "Project Init must fill the verified
      API version before use." is now "Fill the verified API version before
      first use."
    - `sf-deploy-check`, Related: "The production-org guard hook asks before
      a production deploy runs. This check runs before that prompt." is now
      "The production-org guard blocks a production deploy by an agent. This
      check runs before the owner gets the command."
    - Covered by: your decision of 2026-09-28 (9).

### Needs your yes

You approved the first nine proposals on 2026-09-28 ("yes to all your
recommendations"). They are items 6 to 14 above, applied on the branch and
imported, and `node dev/tools/import-model.mjs --check` passes (commit
`5e7d7a0`). Two new proposals came from the review of that work. Nothing
below is applied.

A. **Guard the DevOps Center commands that change records.**
   - The problem: the installed Salesforce CLI (sf 2.142.7, devops-center
     plugin 1.2.28) has eight DevOps Center commands that create or change
     records in the DevOps Center org: `sf devops pipeline activate`,
     `sf devops pipeline create`, `sf devops pipeline attach-project`,
     `sf devops pipeline stage add`, `sf devops project create`,
     `sf devops work-item create`, `sf devops work-item status update`, and
     `sf devops pull-request create`. Each names that org with `-o`.
     Salesforce recommends installing DevOps Center in production. The guard
     lets all eight through today, in both hosts, even with `-o acme-prod`
     (checked 2026-09-28). The rule's first line says "Read-only against
     every org". Decision (8) named pipeline deploys only, so these were left
     out.
   - Proposed: the guard treats these eight as a data write and uses their
     own `-o`. Aimed at production or an org it cannot classify: blocked, and
     the agent hands you the command. Aimed at a sandbox: it asks in Claude
     Code and is blocked in Codex, like other sandbox data changes.
     `sf devops project list` and `sf devops work-item list` only read and
     stay unguarded.
   - Files if you say yes: `.claude/hooks/guard-protected-orgs.cjs`, the
     Enforcement list in `.claude/rules/salesforce-org-safety.md` (it would
     name "DevOps Center record changes"), and a test in
     `plugins/toolkit/tests/scaffold/org-guard.test.mjs`.
   - The cost: when your DevOps Center runs in production, an agent cannot
     create a DevOps Center work item, move one to a new status, or open its
     pull request. It hands you the command instead.
   - Recommendation: yes. It keeps "read-only against every org" true.

B. **Say that a sandbox validate still runs in Codex.**
   - The problem: the Codex bullet (item 8) says "the owner runs every
     sandbox deploy". An agent could read that as including
     `sf project deploy validate -o <sandbox>`. The same rule allows a
     sandbox validate with no yes, and the guard lets it through in Codex.
   - Proposed: add one sentence at the end of that bullet in
     `.claude/rules/salesforce-org-safety.md`, section Allowed: "A sandbox
     validate is not a deploy: the agent still runs it."
   - Recommendation: yes. It is small, and it keeps an agent from handing
     you a validate it may run itself.
