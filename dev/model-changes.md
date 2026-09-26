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
- Full diff of `.memory/` and `.work-items/`:
  `dev/model-changes-ignored-folders.diff`.

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
18. **Salesforce skill descriptions.** `sf-deploy-check`, `sf-component-tracker`, and `sf-data-change` use the SKILL-INDEX texts in both `.claude/skills/` and `.agents/skills/`. The two copies are identical, and the skill bodies are unchanged.
19. **`tests/TEST-PLAN-TEMPLATE.md`.** No change.
20. **`plain-english-artifacts.md`.** The Salesforce role-hierarchy example is now a general one: who can see and edit projects in a team web app. The rule text is unchanged.
21. **`system-guide/`.** No change.
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

Planned, not built: filling `<Project name>` at init. Today's renderer fills only `{{project.name}}`-style tokens, so a rendered `AGENTS.md` still starts with `# <Project name>: agent guide`. Every other `<angle bracket>` prompt is meant to stay for the agent to fill.

## What the planned import step must leave out

The import step (`dev/tools/import-model.mjs`) and its install-condition file (`plugins/toolkit/scaffold/CONDITIONS.json`) do not exist yet; `dev/PROGRESS.md` lists them under Next. When they are built:

- Leave out `.vscode/`, `.sfdx/`, and every `__pycache__/` folder, plus `.git/` and `.DS_Store`. The memory mechanism files are already gone from the model.
- Create `CONDITIONS.json` with these install conditions: `.work-items/**` and `.claude/rules/work-item-folders.md` for the local tracker only; `.memory/**` for built-in memory only; `delivery/`, the two guard hooks, `.claude/protected-orgs.json`, `.codex/hooks.json`, and the `sf-*` skills for Salesforce projects only.

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
- "Project Init" is still named in `tools/permissions/README.md`, the comment at the top of `tools/permissions/PERMISSIONS-RUNBOOK.md`, and line 29 of both `sf-component-tracker` copies. `tools/kb/graph_freshness_hook.py` still points to `knowledge/memory/`.
- Four Salesforce rules link to `.claude/skills/sf-*/SKILL.md`. Codex can still read those files; its own copies are in `.agents/skills/`.
- In `DESIGN.md`, the body line "Design status: Draft | In review | Approved | Superseded" uses different words from the new header (`proposed`, `approved`, `superseded`).
- The topic template's `authorization` prompt still mentions an "Approved card".
- The fill-in guide in `.memory/project_topic_template.md` says "copy this file to a typed filename", but `.memory/AGENTS.md` now says the folder is written only with `toolkit memory` commands.

## What the toolkit still needs

- `toolkit memory save` writes its own record format today. ARCHITECTURE section 0 already plans the change that makes it write the model's topic YAML (`metadata.type`, `authorization`, `supersedes`). The four-section focus already matches the toolkit.
- `toolkit memory reindex` writes its own `MEMORY.md` layout (a "Generated by `toolkit memory reindex`..." paragraph and a "## Other memory files" list), not the model's (the "One short link per active topic" paragraph, the five type headings, and "## Other memory views" with the memory criteria link).
- If you agree with the recommendation under "Decision for you": `memory-save` shows your card instead of its one-line question.
- The same quoting fix for `waiting_on` in the toolkit's `plugins/toolkit/templates/WORK-ITEM.md`, `plugins/toolkit/lib/work/templates.mjs`, and ARCHITECTURE section 4.2. They still have the unquoted line, which Python's YAML reader rejects.
- Filling `<Project name>` at init (see "Setup markers").
- Build the import step and create `scaffold/CONDITIONS.json` (see "What the planned import step must leave out"), then run it once this branch is merged.
