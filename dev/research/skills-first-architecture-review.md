# Review of the skills-first architecture, draft 1 (2026-09-29)

Reviewed: `dev/research/skills-first-architecture.md` (draft 1). Inputs: four
read-only reviews (platform documentation, coverage of Mike's requests,
simplicity, and paper tests of three projects), with the main claims checked
again against the files for this summary. Nothing else was changed.

Short path names. All paths are under `/Users/michaelrihm/Documents/Projects/toolkit-v2/`.

- **Draft**: `dev/research/skills-first-architecture.md`
- **G**: `dev/GOAL.md`
- **M/**: `plugins/toolkit/scaffold/model/` (copy of Mike's approved model)
- **CC/**: `ai-external-knowledge/claude-code/`
- **CX/**: `ai-external-knowledge/codex/`

## 1. Verdict

The direction is sound and matches Mike's request (G:6-44): rules for what
always applies, skills picked by their descriptions for procedures, a few
hooks for timing, and each tool used through its own features.

It is not ready to build. Four things must change first:

- **Three of the five hooks cannot do what the draft says.** PreCompact output
  never reaches the agent. The Stop check sees only the final reply text. Hooks
  placed in the `toolkit` plugin, which is on for every project on the
  computer, would print the briefing in every project.
- **The existing text still runs on the removed program.** The draft keeps
  "the model templates", "the 27 approved model changes", and "the skill
  descriptions" (Draft:129-130). About 62 lines in 14 model files tell the
  agent to run `toolkit` commands, and so does every work and memory skill:
  11 to 39 commands in each `SKILL.md`, and more in their reference files.
  Rewriting this text is most of the build, and the draft does not list it.
- **The storage modules are bigger than needed.** One plugin per tool, on and
  off switches per project in two hosts, and shared references at plugin level
  that break the draft's own rule that each skill folder holds its own files.
- **Several of Mike's requests have no place in the design:** citing sources
  in every reply, a format for decision records, links from local memory to
  work items in Obsidian, and the jobs the program used to do (numbering items,
  finding items from a worktree, the rules list in `AGENTS.md`).

With the changes in section 6, the result is 5 plugins, 20 plugin skills plus
2 storage skills copied into each project, 4 short hooks (three one-line
commands and one end-of-reply check in Claude Code), and no custom program
running in a project.

## 2. Platform claims that are wrong or unclear

| # | Draft claim | What the documentation says | Correction |
| --- | --- | --- | --- |
| P1 | PreCompact "reminds the agent to save where things stand" (Draft:106) | The agent gets no turn before compaction. Claude Code: PreCompact can only block compaction, its stdout is not added to context, and its `systemMessage` is discarded (CC/hooks.md:797, 3057-3061). Codex: plain stdout is ignored (CX/hooks.md:969). | Delete the row. Use SessionStart with matcher `compact` in both hosts. It runs after compaction and before the next model call, even in the middle of a turn (CX/hooks.md:674-680). |
| P2 | Stop prompt hook: "a model reads the turn" and checks for a work item to update (Draft:105, 108) | A prompt hook is one call to a small model (Haiku by default) that gets only the hook input. For Stop that is `last_assistant_message`, the text of the final reply, plus flags (CC/hooks.md:2542-2544, 3520-3526). It has no tools. It cannot see Mike's message, the tool calls, or whether a file changed. | Check only what the reply text shows: a decision or "from now on" instruction that was neither saved nor proposed, and a recalled fact with no source. Return ok when `stop_hook_active` is true. Remove "work item not updated". |
| P3 | In Codex the end-of-reply check is "a very small command" (Draft:109-110) | Codex skips `prompt` and `agent` hooks (CX/hooks.md:199-200). A command can only match keywords, which fires on the wrong replies. | In Codex, leave this check to the skills and to `AGENTS.md`. |
| P4 | The hooks sit in the `toolkit` plugin (Draft:46) | That plugin is on in every project on the computer (G:112-115; `~/.claude/settings.json:111`), so its hooks would run in projects that are not V2. | Put the session hooks in the project's own `.claude/settings.json` and `.codex/hooks.json`, where the model already keeps its Salesforce guards (M/.claude/settings.json:5-33; M/.codex/hooks.json). The draft names `.codex/config.toml`; the model uses `.codex/hooks.json`. |
| P5 | The rules are the same everywhere, and `AGENTS.md` is a short map (Draft:15-17, 31) | Codex reads only `AGENTS.md` files, never `.claude/rules/` or `SOUL.md`, with a combined cap of 32 KiB (CX/agents-md.md:14-22). The rules total about 24 KB, so they cannot be pasted into `AGENTS.md`. | Keep the model's line "Codex: at session start, read the always-on rules listed under Rules" and the rules list (M/AGENTS.md:29, 114-131). Setup writes that list once. |
| P6 | The agent picks skills by description all session (Draft:11, 103) | After compaction, Claude Code does not reload the skill description list. Only the bodies of skills already used come back (CC/context-window.md:63, 632, 1612). | `AGENTS.md` gets one routing line for every V2 skill. `AGENTS.md` reloads after compaction. |
| P7 | Setup turns modules on per project (Draft:22-23, 54-57) | A plugin with no setting is on by default (`defaultEnabled` is true, CC/plugins-manifest-reference.md:184-188). Codex honors project plugin settings only in trusted projects. The Codex IDE extension loads no plugins (CX/plugins.md:21). Codex runs a hook only after Mike trusts it in `/hooks`, and again after every change (CX/hooks.md:26, 63-78). | Drop the per-tool plugins (simplification S1). Set `defaultEnabled: false` on the `work` and `memory` plugins and turn them on in V2 project settings. Setup's last step tells Mike to trust the hooks in Codex `/hooks`. |
| P8 | Not stated: old plugins | `session-skills`, `git-workflows`, `work-tracker`, `project-init`, `second-brain`, `sf-architect-solutioning` and others from `claude-toolkit` are on in every project (`~/.claude/settings.json:93-111`). V2 ships plugins with some of the same names. The model turns off only `second-brain` (M/.claude/settings.json:3-5). | V2 project settings turn off every `claude-toolkit` plugin in both hosts (approved change 23, G:278-279). |
| P9 | PreToolUse blocks AI credit and risky git commands (Draft:104) | Risky git commands are already in the model's `permissions.deny` and `ask` lists (M/.claude/settings.json:37-70). AI credit is already blocked by the `attribution` setting and Mike's machine-wide hook. In Codex, tool hooks are "a useful guardrail, not a complete enforcement boundary" (CX/hooks.md:464), and `permissionDecision: "ask"` is not supported, so the call goes ahead (CX/hooks.md:826-828). | Build no new PreToolUse hook. Keep the model's permission rules and Salesforce guards. |
| P10 | Obsidian shows `work_items` links as backlinks on the work item (Draft:92-93) | Wrong for three reasons. The model opens `.memory/` itself as the vault and says to keep paths outside it out of vault links (M/.memory/AGENTS.md:3, 9), so `.work-items/` is outside the vault. Obsidian ignores folders whose names start with a dot ([forum thread 43105](https://forum.obsidian.md/t/links-to-files-starting-with-dot-break/43105)). Every item file is named `WORK-ITEM.md`, so a link by file name cannot tell items apart. | Question 2 in section 7. |
| P11 | Output style through `.claude/output-styles/` and `"outputStyle"` (Draft:32, 122-124) | Works, with three limits. Picking a style in `/config` writes `.claude/settings.local.json`, which wins over project settings (CC/output-styles.md:99). Helper agents do not get output styles (CC/output-styles.md:205). Mike's `~/.claude/output-styles/plain-english.md` has the same name, "Plain English", with different text, and the documentation does not say which file wins. | Keep the model's file and setting. Test which file wins in the test projects. Put the writing rules helper agents need in `AGENTS.md` "How to write replies", which also covers Codex. |
| P12 | Helper skills hidden with `user-invocable: false` (proposed in two reviews) | In Claude Code this hides the skill from the `/` menu only. Its description stays in the list the agent picks from (CC/skills.md:366, 506). Codex does not document the field. | The description itself says "Used from inside the work skills. Not for the owner's requests." |
| P13 | Not stated: skill list size | Codex caps the skill list at 2% of the context window, or 8,000 characters, and shortens descriptions first (CX/build-skills.md:44-48). Today's 23 descriptions total about 8,300 characters. | Fewer skills (S3) and shorter descriptions. In Claude Code, set `skillListingBudgetFraction` (already approved, G:222-224). |
| P14 | Not stated: built-in skill overlap | Claude Code's built-in `update-config` skill says "from now on when X" behaviors "require hooks configured in settings.json" (its description in the live skill list, 2026-09-29). It competes with `memory-save` for "from now on" requests. | `memory-save` claims "from now on" and "always" instructions about how the agent works, including ones about before or after an action. `AGENTS.md`: "An owner preference goes to `owner-preferences.md`, never into a hook." |

Checked and correct: `CLAUDE.md` holding only `@AGENTS.md`; SessionStart and
UserPromptSubmit plain stdout added to context in both hosts (CC/hooks.md:797;
CX/hooks.md:658); UserPromptSubmit takes no matcher, so the word check runs
inside a one-line command (CX/hooks.md:429); Codex has no output styles; the
Notion connector and `ntn` can create and read back a two-way relation
(`dev/research/notion-live-tests.md:58`).

## 3. Gaps against Mike's requests

| # | Request | Gap | Fix |
| --- | --- | --- | --- |
| C1 | Cite recalled knowledge in every project, every memory system, both hosts (G:157-166) | Only in the memory references and the Stop check (Draft:94-95). Codex has no check, helper agents never see it, and the output style says "Stop after the answer" with no exception for a sources list. | Always-on rule `cite-recalled-knowledge.md`. One line in `AGENTS.md` "How to write replies", which reaches Codex and helper agents. One line in the output style allowing the sources list (model change). |
| C2 | Decisions in memory, one record each, linked to work items, listed per item and for the whole project (G:167-179) | No record format, no ID method, no local listing. `DECISIONS.md` is still named in M/AGENTS.md, M/PROJECT.md, M/README.md and three model rules. | `decision_template.md` in `memory-save`'s folder, with the fields from `dev/research/decisions-architecture.md` (who decided, date, reason, options, `work_items`). The ID is the record's file name or Notion row; D-numbers are dropped because they needed the program's lock. Local listing: an Obsidian Bases file (a built-in Obsidian feature) grouped by work item; the agent uses `grep`. Notion: a view on Kind = decision. The standing merge instruction moves to `owner-preferences.md`. |
| C3 | Memories, facts, entities and decisions can link to work items, in Notion and in local memory with Obsidian (G:22-26, 38-41) | Local links cannot work as drafted (P10). Mixed setups (Notion tracker with local memory, or the reverse) are not covered. The draft adds relations to Lore's Facts and Entities, which the toolkit never writes. | Always store plain IDs, `work_items: [WI-031]`, which works in every storage. In Notion, add the two-way relation "Work items" on Memories only, and only when the tracker is also Notion. State that the toolkit writes Memories rows only: a concept is Kind `note` with a Topic Key, a decision is Kind `decision`, a proposal is Status `proposed` (`dev/research/lore.md:122`). Obsidian layout: question 2. |
| C4 | Local, Notion, GitHub Issues, Jira, same rules (G:86-87) | GitHub is "later" and Jira is missing (Draft:48). Their instruction files already exist (`plugins/work/shared/tracker-github.md`, `tracker-jira.md`). | Ship GitHub and Jira as instruction-only tracker skills in the first build. |
| C5 | Notion tracker: tasks as a checklist in the body, keep it simple (`dev/next/notion-work-tracker-prompt.md:19-32`) | The Notion session's plan has a Tasks database. Phases and tasks as records, plus the Roadmap and Tasks sections of `WORK-ITEM.md` in the body, store both twice. Copying the "Project workspace" template was never tested (tests T11 and T12, `notion-live-tests.md:67-68`), and a `WI` ID prefix can exist only once per workspace (`notion-live-tests.md:76-83`). | For the Notion session: tasks as to-do blocks in the body; one place for phases (the Phases database or the Roadmap section, not both); test a template copy twice in one workspace (relations point at the copy, ID prefix, board grouped by a relation). |
| C6 | A map of which hook fires when and which skill it points to (G:36-37) | One row does not work (PreCompact), there is no Codex column, no matcher values, and no row for a helper agent finishing. Mike asked that the orchestrator keep every status current, including the items its helper agents work on (prompt:30). | The hook table in section 6, change 2. |
| C7 | Save as work goes (Draft:76-77) | Depends on the Stop check, which cannot see whether an item changed. | `work-on` and `work-delegate` update the item after each step (rule `keep-work-item-current.md`). A PostToolUse `Agent` reminder in Claude Code after each helper agent returns (CC/hooks.md:2418). |
| C8 | No custom program (G:12-20, 180-192) | Code still in the plan or not mentioned: `publish-docs.mjs` (324 lines, the agent runs it), `dev/tools/sync-skill-references.mjs` (334), `import-model.mjs` (306), `check-skills.mjs` (1,293). | Add a "Code that stays" list (section 6, change 9). |
| C9 | Jobs the program did | No new owner for: the next item number without a lock; finding `.work-items/` and `.memory/` (not in Git, main checkout only) from a worktree; noticing items Mike moved by hand; the `MEMORY.md` index; the `<!-- if -->` blocks and rules list in `AGENTS.md`; the settings in `.toolkit.json` (approval mode, ID prefix, Notion IDs, Salesforce org aliases). | Local number: highest `id:` plus one, create the folder first, then check for a duplicate. Notion: its unique ID property. GitHub: the issue number. Main checkout: the first path from `git worktree list`. Find items by their `id:` line, never by path; on resume, compare `parent:` with folder nesting (local) or "Last edited by" (Notion) and report what Mike changed. `memory-save` updates the index line. Setup fills `AGENTS.md` once. A "Toolkit settings" section in `PROJECT.md` replaces `.toolkit.json` (model change). |
| C10 | An unanswered "Save to memory?" is kept as a proposal (G:225-229) | Dropped. | Local: `status: needs-review`. Notion: Lore Status `proposed`. `work-status` lists them under "what do you need from me". |
| C11 | Lessons become rules or skills after Mike's yes (G:151-155) | Dropped. | A `memory-tidy` step finds lessons that recur and proposes the rule or skill. |
| C12 | Memory test set (G:232-234) | Not in the test plan. | Add: fresh-session handoff, corrected fact replaces the old one, "I don't know" instead of a guess, no leak between projects. |
| C13 | Hindsight as a memory option (G:93) | The draft makes it "later", which reverses a settled decision. | Question 3. |
| C14 | `SOUL.md` and the other instruction files agree (Draft:29, 31) | `SOUL.md` and `owner-preferences.md` both describe "how the agent works with Mike". Setup asks 3 questions and skips `SOUL.md`, which the model marks optional (M/SOUL.md:3). | `SOUL.md` holds the stable working style set at setup. `owner-preferences.md` holds the "from now on" lines. Setup asks whether to include `SOUL.md`. |
| C15 | Only Mike marks Done (Draft:61-62, 146-147) | No check can prove Mike said it, because the agent writes both the approval and the status. | Question 4. |
| C16 | Use what was recalled when deciding (G:157-166) | Nothing tells the agent to search memory before a design or a plan (paper test 2, step 6). | `memory-find`'s description adds "before a recommendation, design, or plan that may depend on earlier facts or decisions". `solution-design` and `work-on` open `memory-find` first. |

## 4. Simplifications

| # | Change | What it removes |
| --- | --- | --- |
| S1 | No plugin per storage tool. The toolkit keeps one folder per tool for `work-tracker` (local, Notion, GitHub, Jira) and for `memory-store` (local, Notion), in `project-setup`'s `assets/`. Setup copies the chosen one into the project's `.claude/skills/` and `.agents/skills/`, as the model already does for its `sf-*` skills. Setup's "update" mode copies them again. | 4 to 6 plugins, their entries in both marketplaces, per-project plugin switches, `defaultEnabled` settings, and two skills with the same name. It also works in the Codex IDE extension. |
| S2 | Hooks go from 5 to 4 short hooks, all in project settings (section 6, change 2). | PreCompact, the new PreToolUse hook, and the machine-wide hooks. |
| S3 | Work skills go from 9 to 7. `work-decide` joins `work-status` (its list came from `toolkit work decisions`, and `DECISIONS.md` is removed). `work-organize` is split up: splitting an item goes to `work-on` planning, moving an item goes to `work-tracker`, noticing Mike's moves goes to `work-on` and `work-status` on resume. | 2 skills and their overlapping descriptions ("go with option B" is claimed by three skills today). |
| S4 | No shared references at plugin level (Draft:47, 49). Each approval checklist goes to the skill that owns that approval. The template mapping goes to `work-tracker`. The short facts that are always true (14 stages, 6 statuses, what Mike approves, only Mike marks Done) stay in `AGENTS.md` "What the owner decides" and `keep-work-item-current.md`. Templates have one place each: the model's `.work-items/work-item-template/` for local, the Notion template page for Notion. | `sync-skill-references.mjs`, copies of the same file in up to 9 skill folders, and the three places the templates sit today (Draft:35, 47, 74). |
| S5 | `sf-architect-solutioning` is copied into Salesforce projects at setup. | The `salesforce` plugin. |
| S6 | `AGENTS.md` names the tracker and memory choice. `PROJECT.md` holds the IDs and settings. | The same choice written in two files (Draft:27, 30). |
| S7 | Written git steps in the `publish-docs` skill; one `rsync` line in place of `import-model.mjs`; `check-skills.mjs` cut down to format and description checks. | About 630 lines of scripts and most of a 1,293-line checker. |

## 5. Paper test results

Test 1: Claude Code, Salesforce project, local work items, local memory with Obsidian.

- Setup: the machine-wide hook prints its briefing in an empty folder; the old `project-init` also claims "set up this project".
- Setup: nothing fills the `<!-- if -->` blocks or the rules list in `AGENTS.md`; 62 model lines name the removed program.
- "Design the security model" with no item: `solution-design` or `sf-architect-solutioning` is picked, which skips creating the item and its requirements.
- New item: no numbering method without the lock; the template has three places; `.work-items/` is not found from a worktree.
- "Go with option A": `solution-design`, `work-decide`, and `memory-save` all claim it; there is no decision format.
- Saving a fact about the org: the topic template has no `work_items` field; `MEMORY.md` is no longer rebuilt; the Obsidian link to the item cannot work.
- "What did we decide": `memory-find`'s description still names `DECISIONS.md`; no always-on rule requires citing.
- "Mark it done": nothing checks that Mike said it; the standing merge instruction lived in `DECISIONS.md`.

Test 2: Codex, Notion work items, Notion memory.

- Setup: hooks do not run until trusted; `ntn` fails in the Codex sandbox (`notion-live-tests.md:69`); copying the template is untested.
- Parent item with two children in two phases: phases and tasks are stored twice, as records and as body text.
- Mike drags an item to another phase in Notion: nothing reports the move on resume.
- "Remember the client prefers weekly releases": works; it is unclear whether a Facts row is also written.
- "How should we release Reports?": nothing tells the agent to search memory first; Codex has no end-of-reply check; the cite instruction must be in `AGENTS.md`.

Test 3: any host, one long session, then the next day.

- "From now on, always run the tests before asking me to approve": the built-in `update-config` skill may write a hook instead; Codex does not load `owner-preferences.md` unless `AGENTS.md` lists it.
- Automatic compaction: PreCompact does nothing; Claude Code loses the skill description list; Codex keeps only a summary of the rules it read.
- Laptop closed with no handoff: only what `work-on` saved after each step survives; the current focus may be out of date.
- Next day, "keep going": works through `work-on`; the fixed briefing text cannot show the current focus.

Steps that worked by description alone: setup, requirements, build, check, ship, "remember", "keep going", "where are we", "what did we decide".

## 6. Changes to make to the draft

1. **Add "Rewrite of existing text".** Every `SKILL.md` and reference file is rewritten to name skills and plain file, `git`, `gh`, or Notion connector steps. On the model branch, after Mike's yes, rewrite the 62 lines that name the program, `.toolkit.json`, or `DECISIONS.md`: M/AGENTS.md (23), M/.memory/AGENTS.md (10), `work-item-folders.md` (6), `memory-review-and-save.md` (6), M/PROJECT.md (4), M/README.md (4), M/.memory/memory-criteria.md (3), and one line each in `session-handoff.md`, `publish-project-documents.md`, `shared-repository-work.md`, M/DECISIONS.md, M/.memory/MEMORY.md, and the `WORK-ITEM.md` template. Mark each of the 27 approved model changes as kept, changed, or reversed; changes 2, 6, 7, 14 and 15 change. Add a check that no copied file names a `toolkit` command.
2. **Replace the hook table.** All hooks sit in the project's `.claude/settings.json` and `.codex/hooks.json`. Setup's last step tells Mike to trust them in Codex `/hooks`.

   | Moment | Hook and matcher | Host | What it does | Skill it points to |
   | --- | --- | --- | --- | --- |
   | Session starts, resumes, clears, or was compacted | SessionStart `startup\|resume\|clear\|compact` | Both | Prints the current focus file from the main checkout (local memory), or one line "Fetch the Current focus page first" (Notion). After `compact` it adds "Re-read the active work item, `SOUL.md`, `PROJECT.md`, and `owner-preferences.md`." Prints nothing when `PROJECT.md` is missing. | `work-on`, `work-status` |
   | Mike's message contains "remember", "from now on", "forget that", or "we decided" | UserPromptSubmit | Both | `grep -qiE` on the message, then one line: "If this asks to keep something, use `memory-save`." Single words such as "always" and "never" are left out because they appear in ordinary sentences. | `memory-save` |
   | A helper agent returns | PostToolUse `Agent` | Claude Code | Fixed text through `additionalContext`: "Update the child work item's status and history." | `work-delegate` |
   | End of the reply | Stop, prompt type | Claude Code | Checks the reply text only: a decision or "from now on" line that was not saved or proposed, or a recalled fact with no source. Returns ok when `stop_hook_active` is true. Kept only if the test projects show it rarely fires wrongly. | `memory-save` |
   | Any other message | none | Both | The agent picks a skill by its description and by the `AGENTS.md` routing lines. | for example `work-on` |
   | Before a command runs | none new | Both | The model's permission rules and Salesforce guards stay as they are. | none |

3. **Replace the module table.** Plugins: `toolkit` (only `project-setup`, on for every project), `work` (7 skills) and `memory` (3 skills) with `defaultEnabled: false`, plus `session-skills` and `git-workflows`; the last four are turned on in V2 project settings. Copied into each project at setup: one `work-tracker` (local, Notion, GitHub, or Jira), one `memory-store` (local or Notion), and the Salesforce skills in Salesforce projects. V2 project settings turn off every `claude-toolkit` plugin in both hosts.
4. **Add a skill table with the final description of each skill** (what, why, when), including `work-tracker` and `memory-store` ("Used from inside the work skills. Not for the owner's requests."). Merge `work-decide` into `work-status` and split up `work-organize` (S3). Rewrite the out-of-date descriptions: `memory-find` and `publish-docs` (name `DECISIONS.md`), `memory-tidy` (backups, `toolkit doctor`), `project-setup` (Hindsight). Routing: `work-on` also claims "design" and "plan" requests when no item exists; `solution-design` needs an item with approved requirements; `sf-architect-solutioning` is opened by `solution-design` when designing a work item; `memory-find` runs before recommendations (C16); `memory-save` claims "from now on" including before and after an action (P14).
5. **Replace the shared references** with files inside the one skill that uses each (S4). State where the templates live.
6. **Extend the Memory section:** the decision record format and ID rule (C2); a `work_items` field on every memory template; the Lore mapping and the relation on Memories only (C3); listings by work item (Obsidian Bases, Notion views); proposals (C10); lesson promotion in `memory-tidy` (C11).
7. **Extend the rules section:** add `cite-recalled-knowledge.md` (C1). Setup writes the `AGENTS.md` rules list once and creates `owner-preferences.md`, so the list does not change later. List the kept rules that need rewording: `memory-review-and-save.md`, `session-handoff.md`, `work-item-folders.md`, and `keep-work-item-current.md:5`, which still sends Mike's decisions to the item. Add `project-file-locations.md` and `work-item-folders.md` to the list of rules. Replace "`AGENTS.md` is a short map" with "`AGENTS.md` as the model has it, without the lines that name the program, with one routing line for every V2 skill" (P5, P6).
8. **Add "What the program did, and who does it now"** with the fixes in C9.
9. **Add "Code that stays":** the three one-line hook commands; the model's Salesforce guards and `tools/kb/graph_freshness_hook.py`, unchanged because they are part of Mike's model; the dev-only `check-rules.mjs` (approved, G:141) and a smaller `check-skills.mjs`. Remove `publish-docs.mjs`, `import-model.mjs`, and `sync-skill-references.mjs` (S7).
10. **Output style:** keep the model's file and setting. "How to write replies" in `AGENTS.md` covers Codex and helper agents and includes the sources-list line (P11, C1).
11. **Setup steps:** ask the `SOUL.md` question (C14); set `skillListingBudgetFraction` (P13); turn off the `claude-toolkit` plugins (P8); tell Mike to trust hooks in Codex; use the Notion connector for Notion in both hosts, and `ntn` only outside the Codex sandbox.
12. **Trackers:** ship GitHub and Jira as instruction-only tracker skills now (C4). Pass the C5 findings to the Notion session.
13. **Test plan:** add trigger tests (about 20 prompts, 3 runs each, in both hosts), the four memory tests (C12), the Notion template copy test (C5), the output-style name test (P11), and the keep-or-drop test for the Stop check.
14. **Open questions:** replace them with section 7. Earlier questions 3 and 4 (merge permission and Jira status list; one decision record per item of a bulk yes) stay open in `dev/research/decisions-architecture.md`.

## 7. Questions only Mike can answer

1. **May the agent rewrite the model text that names the old program?** About 62 lines in 14 model files tell the agent to run `toolkit` commands, use `.toolkit.json`, or write to `DECISIONS.md`, and approved changes 2, 6, 7, 14 and 15 depend on the program. The rewrite happens on the model branch, and Mike sees the list before it is merged.
   Recommended: yes. Without it, every new project tells the agent to run commands that no longer exist.
2. **How should local memory link to work items in Obsidian?** Obsidian cannot see folders whose names start with a dot, and today the vault is only `.memory/`.
   - Recommended: open the whole project folder as the vault; rename `.memory/` to `memory/` and `.work-items/` to `work-items/` (both still kept out of Git); name each item's main file by its ID, such as `WI-031.md` in place of `WORK-ITEM.md`. Memories then hold clickable links such as `[[WI-031]]`, and each work item lists its memories as backlinks. This changes the model.
   - No model change: memories store the work item ID as plain text. An Obsidian table lists memories by work item, but nothing is clickable.
3. **Leave Hindsight out of the first build?** It would be added after local and Notion memory pass their tests. This changes the settled list of memory options (G:93).
   Recommended: yes. It halves the memory work in the first build.
4. **How is "only Mike marks Done" guarded?** Either a rule only, where the item's history quotes Mike's words and the date, or a Claude Code hook that asks Mike to click yes whenever the agent sets Done. Codex cannot ask, so it would block instead.
   Recommended: rule only. The hook is extra code for a step that already needs Mike's words, and no check can prove who typed them.
