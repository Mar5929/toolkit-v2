# Model changes for your review (2026-09-30)

- Thirteen commits on the model branch `toolkit-v2/approved-changes`, in the folder `toolkit-v2-model-project-approved`. The first (`07aa775`) changed 39 files. The second, review fixes, changed 26 files: 25 edited and 1 deleted. The third (`7c01cd8`) deleted 3 files and added 1 link. The fourth (`19de933`) added 4 empty files. The fifth (`588d196`) changed 1 rule. The sixth (`35f2334`) changed `AGENTS.md` and `README.md`. The seventh (`45a9e2d`) changed 8 files: it adds a Current state to each work item and fixes the memory find routing lines. The eighth (`35e2177`) changes the Hindsight routing line in `AGENTS.md` the same way. The ninth (`d9f61ef`) adds two lines to `AGENTS.md` saying you dictate with voice-to-text. The tenth (`7a6928d`) changed 3 files: it rewrites `AGENTS.md` as a short map with one line per skill, and each work item's Next action now names the skill for the next step. The eleventh (`dfc6ba5`) changed 13 files: it applies your overnight review answers that change a model file (template and rule wording, a Sources list above the closing question, and new Salesforce skill descriptions and wording). The twelfth (`e189a8e`) changed `AGENTS.md`: review fixes to the helper agent line, the waiting form line, and five lines in "Skills". The thirteenth (`593d423`) changed 3 files: second-round review fixes (a Next action form for cancelled items, the roadmap line, "requirements question", cancelling, and a "remind me" line). Your own model folder was not touched.
- The hidden folders `.memory/` and `.work-items/` are now `memory/` and `work-items/`, and the whole project folder opens as one Obsidian vault.
- Current Focus is now Current State, with a line limit per section and clear points where old lines get removed.
- Each work item now opens with its own Current state block, and the project's Current State keeps one line per active item (seventh commit).
- Decisions now live in each work item's new Questions and Answers table. `DECISIONS.md` and `.toolkit.json` are gone.
- Every line that named the old `toolkit` program now names the skill that does the job.
- 19 calls were made overnight without you, from your approved decisions. Each one is listed under "Calls made overnight without Mike", so you can reverse any of them.
- 8 questions at the end still need your answer.

## Checks

- Rules checker, on the branch as it is now (after `45a9e2d`): passed, 0 failures, 2 warnings, the `memory-review-and-save.md` size and the `session-handoff.md` paragraph below. That paragraph is now 573 characters, because the Current state edit adds a sentence to it.
- Rules checker, after the second commit: passed, 0 failures, 7 warnings.
  - `memory-review-and-save.md` is 6,859 bytes, over the proposed 4 KB limit. A local or Notion project gets 3,723 bytes, because setup removes its Hindsight section. A Hindsight project gets almost all of it. See question 1.
  - `session-handoff.md` has a 470-character paragraph. It is your own wording.
  - Five warnings say `local-work-track` and `local-work-find` do not exist yet. They are built in the next step.
  - The checker ran from the main checkout's copy (commit `1c634fc`). The build folder's copy cannot run while its rebuild is in progress, because a file it loads was removed.
- The Salesforce org guard still passes `node --check`. Only its comment changed.
- The Salesforce graph tool tests (first commit): 39 of 40 pass. The one failure is older than this change: the model has `sfdx-project.json` but no `force-app/` folder, and the same test fails on the previous commit. The second commit changed no tool or test file.

## Calls made overnight without Mike

Each call below was made from your approved decisions, without asking you. Say the number to reverse one.

1. **Hindsight lines moved into the shared memory rule.** `hindsight-memory.md` is deleted. Its lines are now a "Hindsight projects" section at the end of `memory-review-and-save.md`, which setup keeps only in Hindsight projects. Its line is gone from the `AGENTS.md` rules list. Reason: the separate file was not on the approved list, and draft 2 (section 4.3) says the shared memory rule carries what Hindsight cannot know. New lines in the section: for "forget that", the agent names the memory and asks you to delete it in Hindsight or save a correction, and never says it is deleted when it is not; Hindsight has no trusted mode; results from `recall` are cited. This is the choice the first list did not recommend, so question 1 asks you.
2. **`confirm-salesforce-changes.md` line 8** now says "Record the decision in the work item's Questions and Answers; a project-wide decision is also offered to memory." Reason: the old line pointed at `DECISIONS.md`, which is gone.
3. **`sf-component-tracker` skill (both copies), lines 30, 112, and 131.** A work item is named by its ID, such as `WI-031`, plus its link when the tracker has one, and never by a folder path. Reason: a path breaks when you move a folder by hand, and `WI-12` did not match the three-digit IDs everywhere else.
4. **Jira.** `keep-work-item-current.md` line 3 says "the work track skill" instead of listing each tracker's skills. The Jira blocks in `AGENTS.md` stay, and now say the Jira skills are not built yet and setup does not offer Jira. Reason: you put Jira off ("It could just maybe be like a future thing").
5. **`AGENTS.md` Codex line** is back to your wording: "Codex: at session start, read the always-on rules listed under 'Rules'." Reason: the added "after resume, clear, or compaction" disagreed with the rules-list heading.
6. **Salesforce client files stay in `delivery/`.** A transcript or document about one work item goes there too, and the item's Sources list may name it by its `delivery/` path. It never goes in the item's `references/` folder. Reason: Git ignores `references/`, so client files there would exist only on this Mac. For Salesforce projects this sets aside topic 13's "transcripts go in the item's `references/` folder".
7. **Memory approval mode** moved from `owner-preferences.md` to `PROJECT.md` "Toolkit settings", as "Memory approval: onboarding or trusted" (local and Notion memory only). If the line is missing, the save skill's default applies. A change of mode goes through the `project-setup` skill. Reason: every other `.toolkit.json` setting moved to "Toolkit settings".
8. **Your Obsidian step is back in `README.md`**: turn off "Use `[[Wikilinks]]`" so new links use Markdown format. `[[Wikilinks]]` is now in backticks, so Obsidian does not make a stray link from it. Added: "Work item links such as `[[WI-031]]` still work with this setting off." The memory templates say why a memory's `work_items` list uses `[[WI-031]]`: Obsidian reads links in that list only in that form. Reason: the step was dropped without need.
9. **A decision made with no work item open.** Three new rows in `AGENTS.md` "Where information goes":
   - About an existing item: a row in that item's Questions and Answers; ask you which item when it is unclear.
   - Project-wide and about no item: straight to a memory record after your yes, naming the conversation and its date.
   - About something that is not a work item yet: a new work item at stage `01-discovery`, with the decision as its first Questions and Answers row.

   The same cases are in `memory/decision_template.md`. Reason: no file said where these decisions go.
10. **Notion memory criteria.** `memory-review-and-save.md` now points to the `notion-memory-save` skill and its references. Reason: the old pointer named a copy of the criteria that the skill does not hold.
11. **A memory stores the work item's ID, plus a link when the item has one** (`memory/AGENTS.md` and both memory templates). Reason: the ID still works after an item moves; a link alone can break.
12. **`[[WI-031]]` links apply only with local work items** (`AGENTS.md`, local memory block). With work items in Notion, GitHub, or Jira, a memory stores the ID and the item's web link. Reason: `[[WI-031]]` only works when the item's file is inside the vault.
13. **One name, "memory record",** for the memory copy of a project-wide decision, everywhere. The file itself is `decision_<short-name>.md`. Reason: `AGENTS.md` used two names; `PROJECT.md`, `README.md`, and the memory rule used "memory record".
14. **`session-handoff.md`** is back to your sentence. The added description of what the `handoff` skill does is gone. Reason: the skill holds that description.
15. **`humanize-outbound-text.md` fallback**, in plainer words: "If `humanizer` is not installed, rewrite the text yourself following `.claude/rules/plain-english-artifacts.md`, and tell the owner the humanizer did not run." Reason: you retired `unslop`. Question 5 asks whether to keep this.
16. **`README.md` says the Obsidian lines once**, in a new "Browse in Obsidian" section. Reason: "open as vault" and "Git ignores `.obsidian/`" appeared twice when both local choices applied. Side effect: setup markers cannot say "local work items or local memory", so every project gets this section, even one with nothing local. The sixth commit (`35f2334`) removes this side effect.
17. **`PROJECT.md` System Guide line** is now `<enabled at system-guide/, or not used>`. Reason: `.system-guide.json` is a retired claude-toolkit file.
18. **Duplicate work item IDs.** `work-item-folders.md` checks every folder under `work-items/` at any depth, including sub-items and `archive/`. The later item takes the next free number, and an agent only ever renumbers its own new item. Reason: sub-items and `archive/` are nested, so a top-level check missed them.
19. **The Salesforce org guard's comment** (lines 353 to 357) now uses a `git commit -m "... sf project deploy start ..."` example instead of a `toolkit` command. No code changed. Reason: the example named the retired program. Question 2 asks about the code.

Smaller calls the reviewers made in the same pass:

- **Done:** "Only the owner marks an item Done" is now "Mark an item Done only after the owner says yes; he may also mark it Done himself" (`AGENTS.md`, `keep-work-item-current.md`, `WORK-ITEM.md`). Reason: your words, "It should ask me."
- **Approvals:** each approval (requirements, design, result) is also a Questions and Answers row marked `Decision?` yes.
- **"After the owner's yes":** a project-wide decision gets a memory record only after your yes (`AGENTS.md`, `PROJECT.md`, `README.md`).
- **Answers:** when you answer a question, the agent also updates `waiting_on` and the "Next action" line.
- **Sources list:** a reply that used recalled knowledge now ends with a Sources list (was "may end with"), to match `cite-recalled-knowledge.md`.
- **Memory index:** it is built from each memory file's title, as your wording and open question 3 said.
- **Session start:** if Current State is missing, the agent reads `memory/CURRENT_STATE.md` in the main checkout, because a worktree does not have it.
- **IDs:** a Notion ID is written as Notion shows it, `WI-31` (no leading zeros); a GitHub file name drops the `#`, for example `12-test-plan.md`.
- **Memory links:** each `work_items` entry is in quotes, ID first, because an unquoted `#12` is read as a comment and lost.
- **Salesforce deployment and data templates:** an owner decision names its Questions and Answers row (Q-ID), and a work item is named by ID plus link.
- **Memory skills:** the save skill also handles "forget that"; the refine skill merges, retires, and prunes. "There is no curator agent." is gone.
- **`PROJECT.md` labels:** the Hindsight and Notion lines under "Work and project records" say "Memory store:", so they do not clash with "Memory:" under "Toolkit settings".

## First commit (07aa775)

This part describes the first commit. Where the second commit changed a file again, "Second commit: review fixes" below says how.

### Project root

- `.gitignore`: ignores `/memory/`, `/work-items/`, and `.obsidian/` instead of the two hidden folders. Why: Obsidian folders, open question 1 (you said "a").
- `AGENTS.md`: the "Every session" list now has one line per skill, with setup markers so each project keeps only its own tracker and memory lines. "What the owner decides" adds the Done rule, the checker before result approval, and the Questions and Answers steps. "Where information goes" sends every decision to the work item first and project-wide ones also to memory, and adds a row for source files. The tracker and memory sections name skills instead of `toolkit` commands. The `.toolkit.json` and `DECISIONS.md` rows are gone. `cite-recalled-knowledge.md` is a new line in the rules list. A citing line is added under "How to write replies". Why: rewriting old text, open question 2 ("yes"); decisions, topic 8 ("I probably would want the decisions just to be persisted right in the work item.md", then "yes love that"). Question 4 is about this file.
- `DECISIONS.md`: deleted. Why: topic 8. Decisions live in the work item; project-wide ones also go to memory.
- `PROJECT.md`: new "Toolkit settings" section: tracker, memory, work item ID prefix, Notion links, GitHub repository, Jira project and status list, Hindsight bank, and Salesforce org aliases. The `DECISIONS.md` link and the memory backup line are gone. Why: `.toolkit.json` removed, draft 2 answers ("I would go through recommendations for all of them"); no backup ("we don't need a backup folder. That's too much bloat.").
- `PROJECT-ROADMAP.md`: "open questions" becomes "Questions and Answers", and a linked work item is named by ID, such as `[[WI-031]]`. Why: topic 13 ("Yeah I think that makes sense") and open question 1.
- `README.md`: the `DECISIONS.md` line is gone. A new "Work items" section explains the local folders. The memory section drops the export and import backup steps and opens the whole project folder in Obsidian. Why: open question 1 ("a"); topic 9, no backup ("no don't need the onboarding line").

### .claude/rules/

- `cite-recalled-knowledge.md`: new always-on rule. Name each recalled source where it is used, and end the reply with a short Sources list. Why: "make sure that the agents always, if they recall something from knowledge and use it in their decision, cite that. And just briefly list where they got it from."
- `hindsight-memory.md`: added in the first commit and deleted in the second. Its lines are now in `memory-review-and-save.md` (call 1, question 1).
- `keep-work-item-current.md`: now three headings. Every question and decision gets a Questions and Answers row; a project-wide decision gets the "Save it to memory too?" question; a bulk yes is one row per item; approvals stay on the item; the checker runs before result approval; Done needs the owner. Why: topic 8; bulk approvals, open question 4B ("yes"); Done ("I should be able to mark a work item done, right? It should ask me.").
- `memory-review-and-save.md`: the memory store is now named in `PROJECT.md` "Toolkit settings". It names "the memory save skill" instead of `memory-save` and `toolkit` commands. Decisions go to the work item first. An unanswered save waits in Current State. A Current State line is removed once it is no longer true. Why: open question 2 ("yes"); topic 8; Current State clean-up.
- `work-item-folders.md`: rewritten for the new layout, `work-items/<ID>-<slug>/<ID>.md`. Find items by `id:`. The next ID is the highest plus one. Create the folder first, then check for a duplicate. The main checkout is the first path `git worktree list` prints. The `toolkit work` commands, `DASHBOARD.md`, and the state file are gone. Why: open question 1 ("a"); approved change item 14.
- `session-handoff.md`: "the current focus (`toolkit memory focus`)" becomes Current State. Why: "current focus should be current state ... it just doesn't know when to clean it up and remove old stuff."
- `shared-repository-work.md`: line 30. A standing merge instruction now lives in `.claude/rules/owner-preferences.md`. Why: open question 4A ("yes").
- `publish-project-documents.md`: `DECISIONS.md` is dropped from its paths, and the folder names are updated. Why: `DECISIONS.md` removed; open question 1.
- `humanize-outbound-text.md`: the `unslop` fallback is gone. When `humanizer` is missing, the agent now rewrites the text itself and tells you the humanizer did not run. Why: "I don't think we need the unslop skill anymore". The new fallback changes what the rule does; see question 5.
- `dependency-graph.md`: "the `memory-save` skill" becomes "the memory save skill" (two lines). Why: skill names now depend on the memory choice (change item 10).
- `salesforce-org-safety.md`: the example "a toolkit note" becomes "an echo". Why: change item 18, Salesforce wording that names the old program.

### .claude/ (other)

- `.claude/settings.json`: adds `attribution` (empty commit and pull request text, and `sessionUrl: false`) and `skillListingBudgetFraction: 0.03`. All permissions, hooks, and the output style are unchanged. Why: change item 17; your no-AI-credit rule; routing approvals of 2026-09-28 ("every Toolkit V2 description is visible"). Claude Code's settings page says to set `sessionUrl: false` as well when hiding all attribution.
- `.claude/output-styles/plain-english.md`: one line allows a short Sources list at the end of a reply. Why: change item 15, which goes with the citing rule.
- `.claude/skills/sf-component-tracker/SKILL.md` and `.agents/skills/sf-component-tracker/SKILL.md`: `.work-items/` becomes `work-items/`. Why: open question 1.

### memory/ (was .memory/)

- `memory/AGENTS.md`: rewritten for the local memory skills (`local-memory-save`, `local-memory-find`, `local-memory-refine`) instead of `toolkit memory` commands. The whole project is the vault; notes link work items in `work_items`; a fifth prefix, `decision_`, is added; `MEMORY.md` is generated by the session-start hook; Current State gets line limits and a named owner for each removal; the backup line is gone. Why: open questions 1 and 3; "Having the index rewritten by an LLM is quite expensive, right?"
- `memory/CURRENT_STATE.md` (was `CURRENT_FOCUS.md`): renamed and titled "# Current state". The fill-in guide adds line limits (Now 5, Waiting on the owner 5, Untracked to-dos 7, Next session starts with 3, the whole file under 40 lines) and says who removes lines and when. Why: "I want the file name to be 'Current State' instead of 'Current Focus'", and "it just doesn't know when to clean it up and remove old stuff."
- `memory/MEMORY.md`: its top line now says it is a generated file. It adds a Decision section and links Current state. Why: open question 3 ("Yeah, yeah.").
- `memory/decision_template.md`: new. Front matter: status, decided_on, decided_by, work_items, supersedes. Body: Decision, How to apply, Where it was decided (for example `[[WI-031]] Q-04`). Why: draft 2 answers, "a fifth prefix. Reason shown: each decision gets its own ID, work item links, and history".
- `memory/memory-criteria.md`: adds the `decision_` row and a "Decisions" section with the test ("Will a later work item, or an agent working on something else, need to follow this?"). The backup section becomes "Where this folder lives". Why: topic 8 and topic 9.
- `memory/project_topic_template.md`: adds a `work_items` property listing linked work items, such as `[[WI-031]]`. Why: change item 7, so each work item lists its memories in Obsidian's backlinks panel ("Same with the local setup + Obsidian, same concept.").
- `memory/terminology-glossary.md`: moved only; no text changed. Why: open question 1.

### work-items/ (was .work-items/)

- `work-items/work-item-template/WORK-ITEM.md`: "Open Questions" becomes "Questions and Answers", with Answer, Date answered, and Decision? columns, and moves just above Notes. "Next action" names the waiting question, for example "Waiting on Mike: Q-07". Recent History names Q-IDs. Each requirement's "Decision record" can name the Q-ID that changed it. "Decisions and context" becomes "Context". A new "Sources" list sits under Notes. The fill-in guide names the work track skill and the Done rule. Why: topic 13 ("Yeah I think that makes sense", then "perfect").
- `work-items/work-item-template/DESIGN.md`: the owner decision line names the Q-ID. Mentions of `WORK-ITEM.md` now say the item's own file, such as `WI-031.md`. Why: change item 5 and open question 1. Question 6 is about its status words.
- `work-items/work-item-template/references/.gitkeep`: new empty file, so the template carries a `references/` folder. Why: topic 13, pieces 2 and 3 ("perfect").

### requirements/ and tests/

- `requirements/AGENTS.md`: "open questions" becomes "Questions and Answers". Why: topic 13.
- `requirements/SYSTEM-DATA-MODEL.md`: the "Source and approval" prompt names the Questions and Answers row, for example WI-031 Q-04. Why: decisions live in the work item (topic 8).
- `requirements/system-area-template/AREA-TEMPLATE.md`: the same change to its "Source" prompt. Why: topic 8.
- `tests/TEST-PLAN-TEMPLATE.md`: a work item's test plan is named `<ID>-test-plan.md`, so `[[WI-031]]` points at only one file. Why: open question 1 (ID file names).

### tools/

- `tools/kb/graph_freshness_hook.py`: the note it writes says "the memory find skill" and "the memory save skill" (or Hindsight's recall and retain) instead of `toolkit memory find`. Why: open question 2 ("yes").
- `tools/kb/test_graph_tools.py`: its test now checks for the new words and that "toolkit memory" is gone. Why: it follows the hook text change.
- `tools/permissions/PERMISSIONS-RUNBOOK.md`: "Project Init fills" becomes "At setup, fill", and the sandbox alias comes from `PROJECT.md` "Toolkit settings". Why: change item 18 (org aliases moved). Question 3 is about three more pointers here.
- `tools/permissions/README.md`: "Project Init's permission set checker" becomes "this project's permission set checker". Why: change item 18, wording that names the old program.

## Second commit: review fixes

Independent reviewers checked the first commit in three rounds, and these fixes followed. 26 files: 25 edited and 1 deleted. The numbers in brackets are the calls above.

### Project root

- `AGENTS.md`:
  - The Codex line is back to your wording (5).
  - The Jira blocks say the Jira skills are not built yet (4).
  - The "We decided" line and three new "Where information goes" rows cover a decision with no work item (9).
  - "memory record" everywhere; the project map says "decision files (`decision_<short-name>.md`)" (13).
  - The Hindsight line points to the memory rule's "Hindsight projects" section, and `hindsight-memory.md` is gone from the rules list (1).
  - One Salesforce row for client files: `delivery/`, never `references/` (6).
  - The local memory block says `[[WI-031]]` links apply only with local work items (12).
  - If Current State is missing, read it in the main checkout. Done needs your yes. Answering a question also updates `waiting_on` and "Next action". A project-wide decision gets a memory record after your yes. Notion IDs look like `WI-31`. GitHub file names drop the `#`. A record that stores an item's link puts it beside the ID.
- `PROJECT.md`: "Memory approval" line for local and Notion memory (7); new System Guide line (17); "Memory store:" labels; the Decisions line says "after the owner's yes".
- `PROJECT-ROADMAP.md`: a linked work item is its ID, followed by its link for Notion, GitHub, or Jira (11).
- `README.md`: new "Browse in Obsidian" section with your Wikilinks step (8, 16); the vault sentences are gone from the Work items and Project memory sections; a memory names each work item by ID; the decisions line says "after the owner's yes".

### .claude/rules/

- `hindsight-memory.md`: deleted (1).
- `memory-review-and-save.md`: the "Hindsight projects" section (1); the Notion criteria pointer (10); the approval mode read from `PROJECT.md` (7); the no-work-item line (9); save, correct, and "forget that" go through the save skill, and merge, retire, and prune through the refine skill; long bullets split into one instruction each.
- `confirm-salesforce-changes.md`: line 8 (2).
- `keep-work-item-current.md`: "the work track skill" (4); each approval is a Questions and Answers row; the Done wording; bullets split into one instruction each.
- `session-handoff.md`: your sentence is back (14).
- `humanize-outbound-text.md`: the fallback wording (15).
- `work-item-folders.md`: the duplicate-ID check (18); a Salesforce client file stays in `delivery/`; "the folders the tracker ignores" is gone; one long bullet split in two.

### .claude/ (other)

- `.claude/hooks/guard-protected-orgs.cjs`: comment only (19).
- `.claude/output-styles/plain-english.md`: a reply that used recalled knowledge ends with a short Sources list.
- `.claude/skills/sf-component-tracker/SKILL.md` and `.agents/skills/sf-component-tracker/SKILL.md`: lines 30, 112, and 131 (3). Since `7c01cd8` there is one copy; `.agents/skills` links to it.

### memory/

- `memory/AGENTS.md`: ID plus link (11); quoted `work_items` entries and the `[[WI-031]]` note (8); the approval mode line (7); the no-work-item pointer (9); a Salesforce client file stays in `delivery/`; the index is built from each file's title; the agent changes this folder only through the memory skills.
- `memory/CURRENT_STATE.md`: "Waiting on the owner" also holds memory save questions you have not answered; an untracked to-do moves under "Now" once it gets a work item ID.
- `memory/MEMORY.md`: the generated-file line says the index is built from each file's title.
- `memory/decision_template.md`: the no-work-item case (9); ID plus link and quoted entries (8, 11).
- `memory/memory-criteria.md`: the no-work-item pointer (9).
- `memory/project_topic_template.md`: ID plus link and quoted entries (8, 11).

### work-items/

- `work-items/work-item-template/WORK-ITEM.md`: the Done wording; a Salesforce client file stays in `delivery/`; "Related items" says where to find the item's memories; Sources may name a project file by its path.
- `work-items/work-item-template/DESIGN.md`: the sources table and the design-change table cite the Q-ID of your answer.

### delivery/ (Salesforce projects)

- `delivery/deployment/work-item-deployment-template/DEPLOYMENT-RECORD.md`: the work item is its ID plus its link, never a folder path; the owner deploy decision names its Q-ID.
- `delivery/deployment/full-project-deployment-template/manual-steps.md`: "Related work item" is the ID plus its link (two lines).
- `delivery/data/area-template/TRANSFORMATION-RULES-TEMPLATE.md`: the business decision names its Questions and Answers row, for example WI-031 Q-04.

## Third commit (7c01cd8)

- `.agents/skills/sf-component-tracker/SKILL.md`, `.agents/skills/sf-data-change/SKILL.md`, `.agents/skills/sf-deploy-check/SKILL.md`: deleted; `.agents/skills` is now a link to `../.claude/skills`, so Codex reads the same single copy. Why: draft 2 answers, one copy of each skill ("Go with your recommendations").

## Fourth commit (19de933)

- `delivery/communications/.gitkeep`, `delivery/deliverables/.gitkeep`, `delivery/meeting-notes/.gitkeep`, `delivery/references/.gitkeep`: new empty files, so Git keeps these four empty folders. Why: Git drops empty folders, so the branch had lost four folders your own model has. `work-items/work-item-template/references/.gitkeep` does the same job. Only Salesforce projects get `delivery/`.

## Fifth commit (588d196)

- `.claude/rules/shared-repository-work.md`: `git fetch origin && git log --oneline -10` is now two lines, `git fetch origin` and `git log --oneline -10`. A new bullet says: "In Codex, run `git fetch` alone with escalated permissions; it writes `.git/` and needs the network." Why: Codex keeps `.git/` read-only and has no network, so the joined command failed and `git log` never ran.

## Sixth commit (35f2334)

- `AGENTS.md`:
  - The `handoff` line adds "check this handoff". Why: the `handoff` skill also checks a handoff prompt you paste in, and its description uses these words.
  - The GitHub `github-work-track` line adds phases and tasks to what it changes. Why: that skill holds a work item's phases and tasks, as the local and Notion track skills do.
  - New line: a task, phase, or sub-item you name directly ("add a task to phase 2", "mark task 3 done", "put one item under another") goes to the work track skill, not `work-on`; only marking a whole item Done goes to `work-finish`. Why: without it, "mark task 3 done" could go to `work-finish`, which closes the whole item.
  - The Hindsight Current State line also answers "refine memory" and "clean up memory". It adds: never merge or delete Hindsight memories yourself; name a stored memory that looks wrong or stale, and ask you to remove it in Hindsight or, on your yes, `retain` a correction. Why: a Hindsight project has no memory refine skill, and this matches the "Hindsight projects" section of `memory-review-and-save.md`.
- `README.md`: the "Browse in Obsidian" section now sits inside a `<!-- if tracker=local or memory=local -->` marker. Why: a project with no local work items and no local memory has nothing to browse in Obsidian. Setup now reads this marker, so the side effect of call 16 is gone.

## Seventh commit (45a9e2d)

8 files, all edited: `work-items/work-item-template/WORK-ITEM.md`, `work-items/work-item-template/DESIGN.md`, `.claude/rules/keep-work-item-current.md`, `.claude/rules/session-handoff.md`, `AGENTS.md`, `memory/AGENTS.md`, `memory/CURRENT_STATE.md`, and `memory/memory-criteria.md`. It holds two changes: a Current state in each work item, and a review fix to the memory find routing lines. `AGENTS.md` has both. Each file's change and its reason are below.

### A Current state in each work item (Mike, 2026-09-30: "go with your recommendation")

Why, for all 8: you asked for a current state in each work item and chose the recommendation. It lives inside the item, at the top, rewritten in place after each step, and the project's Current State keeps one line per active item (`dev/GOAL.md`, "A current state for each work item"). One place, the first thing you and the agent see, with no copy in "Resume here".

- `work-items/work-item-template/WORK-ITEM.md`: the Overview's middle becomes a `### Current state` block with five lines: Where it stands (was "Current position"), Next action, Waiting on (new), Blockers, and Last updated (new). Its own fill-in guide says to rewrite the lines in place after each step and never add to them; what happened goes to Recent History. The Notes "Resume here" subsection is removed. The top, Overview, Recent History, and Notes fill-in guides are changed to match.
- `work-items/work-item-template/DESIGN.md`: the closing "Current position and next step" section is removed. Open discussion stays in Notes; the next action lives in the work item's Current state. Answering a question also updates the item's Current state.
- `.claude/rules/keep-work-item-current.md`: a new "Current state" heading with six bullets: the five lines, read them first, rewrite them after each step, never add a line or a dated entry, one or two sentences each, and Next action names the first open question when the item waits on you. "Before you stop" now says to rewrite Current state so Next action names the exact next step.
- `.claude/rules/session-handoff.md`: one new sentence, "Before the handoff, rewrite the Current state block at the top of each work item the session worked on.", and "review Current State" becomes "review the project's Current State". This is your approved wording (call 14), so this edit changes your own sentence.
- `AGENTS.md`: the two "What the owner decides" lines put "Waiting on Mike: Q-07" in the Next action line of the item's Current state, and answering a question rewrites that Current state. A new "Where information goes" row sends where one item stands, its next action, what it waits on, and its blockers to that block. The Current State row now says one line per active work item, pointing to it.
- `memory/AGENTS.md`, `memory/CURRENT_STATE.md`, `memory/memory-criteria.md`: the project's Current State keeps one line per active work item (its ID and a few words); where it stands, its next action, and what it waits on stay in the item's own Current state. "Next session starts with" names the item's ID.

### The memory find routing lines (review fix, 2026-09-30, Mike: "go with your recommendation")

- `AGENTS.md`, the local memory and Notion memory lines for the memory find skill: they now say "What did we decide", "do we know", "why did we" go to `local-memory-find` (or `notion-memory-find`). `work-refine`, `solution-design`, and `work-on` search memory themselves, so "help me plan this" and "design this" open those skills first; before any other recommendation, the agent searches with the memory find skill. Why: the old line sent every plan and design to the memory find skill first. If that skill opened first, it ended the turn with its search result, and the planning interview or the design never started. Memory is still searched before every plan and design, by the skill that runs it. The Hindsight line was left for the eighth commit.

## Eighth commit (35e2177)

- `AGENTS.md`, the Hindsight line for "What did we decide": it now reads like the local and Notion lines. "What did we decide", "do we know", "why did we" go to Hindsight's `recall` tool and the work find skill; `work-refine`, `solution-design`, and `work-on` recall by themselves, so "help me plan this" and "design this" open those skills first; before any other recommendation, `recall` first. Why: the old line named the work find skill (for example `github-work-find`) before every plan and design. If that skill opened first, it ended the turn with its search result, and the planning interview or the design never started. Found in the stage 2c review; same reason as the seventh commit.

## Ninth commit (d9f61ef)

- `AGENTS.md`, right after the one-sentence outcome at the top: "The owner dictates most messages with voice-to-text, so a message may have wrong words, missing punctuation, or more than one possible meaning. When a message is unclear or could mean two different things, ask one short question before you act on it." Why: Mike asked for it on 2026-09-30 ("just a reminder: the user uses voice-to-text a lot, so if you're confused about the prompts, just ask before you actually go and execute something"). Every project gets it, in both hosts.

## Tenth commit (7a6928d)

3 files, all edited: `AGENTS.md`, `work-items/work-item-template/WORK-ITEM.md`, and `.claude/rules/keep-work-item-current.md`. You approved this overnight (2026-09-30, "routing plus review, which is your recommendation"): the 5 recommendations in `dev/archive/reviews/2026-09-30-routing-and-agents-md-review.md` section 6, and the recommended answers in `dev/archive/reviews/2026-09-30-baseline-review.md` section 4, with A6 dropped and A7 as a situation line.

### `AGENTS.md`: a short map with one line per skill

Why: you asked for `AGENTS.md` to be a map under 200 lines that lists the skills with a quick note each, and for skills to be picked by the situation, not by words you must remember. Claude Code's guidance is under 200 lines. Codex stops adding instruction files once together they reach 32 KB, so the file is also kept near 20 KB.

- **Size.** Counted on the file each setup really gets (setup markers applied, rules list built, the fill-in guide still in), with `wc -l` and `wc -c`:
  - Before: 160 to 191 lines, 15.6 to 19.8 KB.
  - Now, Salesforce projects: 180 to 181 lines, 20,028 to 20,463 bytes. The largest is Notion work items, Hindsight memory, and Salesforce.
  - Now, other projects: 156 to 157 lines, 17,405 to 17,840 bytes.
  - Once setup deletes the fill-in guide, the largest is 179 lines and 19,970 bytes.
- **New order:** Every session, Project map, What the owner decides, Where information goes, Work items and memory, Skills, Commands, Rules, How to write replies. Kept as they were: your opening paragraph, the voice-to-text lines, the six headings other files point to, the rules list and its two marker lines, the setup markers, "Commands", and "How to write replies" (both word for word).
- **Every session** keeps the startup lines and adds the 5-line main rule from the review: these lines are for the main conversation, not helper agents; how to find which work item a message continues; read its Current state and do its Next action with the skill it names; if the item's fields disagree, or no skill is named, open `work-on` and rewrite Next action; a question gets an answer, not the next step. Why: a work item's Next action now says what comes next, so a new session picks up the right step.
- **Project map** moved up and rewritten: one line per folder the agent reads or writes, saying what goes there, when, and whether Git keeps it. It adds `SOUL.md`, `README.md`, `.claude/`, `.agents/`, and `.codex/`, and says `force-app/` is made when the first metadata is added. The folder rows of "Where information goes" (design, source files, test plans, roadmap, requirements, system guide, outside documents, `delivery/`) moved here. Why: a plain folder list is something the agent can see for itself; what goes where, and why, it cannot.
- **What the owner decides:** the lines that repeated `keep-work-item-current.md` word for word are gone (Done only after your yes, the checker before approval). "Never deploy to, validate against, or write data in production" moved here from the Salesforce skill lines. The waiting example now uses the new Next action form.
- **Where information goes** keeps every decision row and the homes that are not folders. In a Salesforce project, its work item row says a client file stays in `delivery/`.
- **Work items and memory** replaces "Work tracking" and "Memory": the ID format, "this project has one tracker", refer to items by ID, memory changes only through the memory skills, and never store secrets. Facts the folder files or rules already hold (the Obsidian links, the Hindsight details) are no longer repeated here.
- **Skills** has one line per installed skill. Each starts with the situation, taken from the skill's own "Use when" words, then today's example phrases, kept as a backup until the routing test shows which ones matter. Changes from your approved review answers:
  - A1: `work-finish` adds "merge it"; `merge-and-clean-up` is for a pull request you name ("merge PR 12") or one `work-finish` asks about.
  - A3: the memory save lines add "whenever you ..." and "each time you ...", and say an instruction for how the agent works goes in `.claude/rules/owner-preferences.md`, never in a settings hook or the `update-config` skill. This is also the `AGENTS.md` part of A2.
  - A5: in Notion projects, the Notion plugin's own commands (`Notion:tasks:build` and the rest) never replace the project's skills, and its search commands never replace the memory skills. Both lines are shorter than the review's text to fit the size limit; the Skills list above them names the skill to use instead.
  - A7, as a situation line: while an interview question is open, "options" means answers to that question (`work-refine`); after requirements approval, "options" means design options (`solution-design`).
  - A8: never use `anthropic-skills:consolidate-memory`; it edits Claude Code's own memory folder.
  - A9: the `sf-deploy-check` line reads "When a deploy to a shared org is about to run, or before the owner gets a deploy command".
  - A12: `work-on` is for changes "in the product" and for "add it to the backlog", so "change WI-031's priority to high" goes to the work track skill and does not start a build.
  - The work track skill's line now covers a task you describe or say is done, not only one you name, with the example "I made the sandbox, mark it done". Why: in two routing tests, that request reached the right skill in 0 of 3 runs.
- **Rules:** the paragraph above the list is one line: keep the list matching `.claude/rules/`, and change a rule's line in the same edit.
- Left out to fit the size: the line "Open the matching skill or rule when the task needs its procedure" and, in the `work-on` line, "It opens the work item". The roadmap advice from that line is now in the `PROJECT-ROADMAP.md` map line.

### `work-items/work-item-template/WORK-ITEM.md`: Next action names the skill

- Line 33's prompt now gives three forms, word for word from the review: working ("Agent: write two design options for the permission set groups, with solution-design."), waiting ("Waiting on Mike: Q-07 (merge or move the 15 personas). After his answer: finish R-04, with work-refine."), and finished ("None. Finished."). The skill is one of the six stage skills: `work-refine`, `solution-design`, `work-on`, `work-delegate`, `work-check`, or `work-finish`. Why: the next session reads which skill does the next step, instead of guessing from your words. A waiting item also says what happens after your answer.

### `.claude/rules/keep-work-item-current.md`

- The "Current state" section gets the three Next action forms, says never to name a work track, work find, memory, Salesforce, or machine-wide skill there (those differ by setup), and says the item's fields win when they disagree with Next action. Why: an out-of-date Next action must never beat a status you changed yourself, for example a card you moved to Done.
- Line 3 now points to "Skills" in `AGENTS.md`, where the work track skill is named now, instead of "Every session".

### Checks

- Rules checker on the branch: passed, 0 failures, the same 2 warnings as before (`memory-review-and-save.md` size and the `session-handoff.md` paragraph). `keep-work-item-current.md` is 3,622 bytes, under the proposed 4 KB.
- All 18 setups built in a scratch folder: no setup marker left in any of them.

### Not in this commit

- Review answer A14 ("remind me to ..." goes to the work item, else Current State; a personal errand goes to Todoist) has no line in `AGENTS.md` yet. The review gave no text for it.
- The toolkit's copies still have to follow: the model copy is refreshed, the two `WORK-ITEM.md` copies in the work track skills are replaced, and the toolkit files that pointed to "Every session" for the skill names (`handoff` and `writing-a-project-skill.md`) are changed. That is the build's next step, not a model change.

## Eleventh commit (dfc6ba5)

13 files, all edited. You approved this overnight (2026-09-30, "routing plus review, which is your recommendation"): every recommended answer in `dev/archive/reviews/2026-09-30-baseline-review.md` section 4. This commit holds the answers that change a model file: A9 to A11 (the Salesforce skill descriptions), the model parts of part B (B1, B2, B6, B19, B22, B32), and the model parts of part C (C1 to C11 and C27 to C49). The `sf-architect-solutioning` fixes (C12 to C26) and the parts of other answers that live in skills and shared texts are not model files; the build applies them.

### A Sources list goes above the closing question (B1)

- `.claude/rules/cite-recalled-knowledge.md` line 8 now reads "Put a short Sources list at the end of the reply, just above the closing question or the words that continue the work: one line per source, naming the file, record, or work item and what you took from it."
- The same sentence is in the Plain English output style (line 17) and in `AGENTS.md`, "How to write replies" (last line). The `AGENTS.md` edit is one line, 108 bytes longer than before.
- Why: two of your instructions each said to end the reply with something else (the Sources list, and the one question). Now the question stays the last line.

### A one-line reason for lists of choices (B2)

- `AGENTS.md`, "What the owner decides", last line: "Give every item in a list of choices or recommendations you show the owner a one-line reason." Before, it said "every item in a list", which also covered a plain status list.

### One name for the first folder: "main checkout" (B32)

- `.claude/rules/shared-repository-work.md` lines 24 and 33 said "primary checkout". They now say "main checkout", the name `AGENTS.md` and `work-item-folders.md` already use.

### `work-items/work-item-template/WORK-ITEM.md`

- B6, line 89 and line 111: a dropped or replaced requirement is marked Superseded with the reason and the Q-ID in its Decision record, and a link to its replacement only when there is one. Before: "mark Superseded only with a replacement link", so a dropped requirement with no replacement could not be marked.
- B22, line 45: "A phase is complete when its tasks are complete, its sub-items are Done or Cancelled, and its exit result has been checked."
- C4, line 41: "Roadmap unit" is now "The `PROJECT-ROADMAP.md` work unit (for example P01-U01)".
- C5, line 81: the Recent History guide lists when to add a row: a stage, `waiting_on`, blocker, or next action change for a reason a later reader could not see; an answer, approval, rejection, or decision; the independent checker's report; a plan change; a change the owner made by hand; a finished result. The review's sentence began "for each change the work item format lists:". A project has no file named "work item format", so this commit says "for each of these changes:". The list is the same.
- C6, line 89: "Keep a requirement Refining" (it said "an item").
- C7, line 134: a bulk "yes to all" is saved as one row "per thing it covered". `keep-work-item-current.md` already said this.
- C8, line 96: the Starting request is "in his words" (no short summary).

### `work-items/work-item-template/DESIGN.md`

- B19, line 102: a replaced option stays in the design, marked "Superseded by Option <letter>" under its heading. Before: "retain only useful option history above".
- C1, line 9: "remove unused example rows, and each section or heading the template says to remove when unused".
- C2, line 17: "The work item's main file, not this file, holds the agreed goal, ..., its Roadmap and Tasks, and its Recent History." (It said "owns" and "roadmap tasks, and execution history".)
- C3, line 43: "the number of options chosen for this design (the owner's number when he gave one)".

### Test plan, memory criteria, memory template (C9 to C11)

- `tests/TEST-PLAN-TEMPLATE.md` line 3: the fill-in guide says which prompts to replace in Scope and in Environment and data, to add one Checks row per scenario and then delete the example row, to replace the prompts under "Results and follow-up", and to delete the guide when the plan is filled in.
- `memory/memory-criteria.md`, `project_<topic>.md` row: "technical landmark" is now "the main parts of the system and where they are".
- `memory/project_topic_template.md` line 10: `authorization:` lists the three real values: "Approved by <owner> on YYYY-MM-DD", "Trusted grant, YYYY-MM-DD", or "Proposed by the agent on YYYY-MM-DD; not approved". They match the build's `record-format.md`.

### `.claude/rules/component-tracker.md`

- Line 4: "a deploy that landed" is now "a deploy that succeeded", to match C37 (the review's note names this line).

### The three Salesforce skill descriptions (A9, A10, A11)

Each is under 400 characters and says why. The texts are the review's recommended texts (section 2.16 and 2.30). The situation comes first. Example phrases stay only as backup.

- `sf-deploy-check` (390): "Finds components or edits that a Salesforce deploy would ship beyond the intended change, so no unfinished or unintended work reaches a shared org. Use when a deploy to a shared org (UAT, full copy, staging, or production) is about to run, or before the owner gets a deploy command. Not for checking whether a work item is ready; use work-check. Not for running the deploy; use work-finish." Your word "hitch-hikers" is out of the description (A11) and stays in the body. "Is WI-31 ready to go to UAT" now goes to `work-check` first. The `AGENTS.md` routing line already matches (tenth commit).
- `sf-component-tracker` (394): "... in sync, so no changed component is left out of a deploy. Use when Salesforce metadata under force-app/ is added, changed, renamed, or deleted (open it before work-on and update the records in the same response), a deploy result comes back, or a deploy needs manual steps."
- `sf-data-change` (354): "Builds the owner's handoff for a Salesforce production data change: load file, backup, numbered steps, success check, and undo steps, so no agent writes production data and every change can be undone. Use when the owner asks to load, import, update, or delete production records, even inside a work-on build, for example "load this file into production"." The review's text added a second example, "fix these records in production", and called it a placeholder for your own words. It is left out, because you never said it.

### `sf-component-tracker` body (C27 to C38)

- C27: "another artifact root" is now "another folder".
- C28: the folder tree shows `work-item-deployment-template/` and `release-cutover-template/`, and says a release folder is one folder per release that ships several work items together, with `CUTOVER-PLAN.md` and `RELEASE-NOTES.md`.
- C29: "tracker" meaning the work tracker is "work tracker" (lines 30, 112, 131).
- C30: work-item folders are flat, with no folders by status. The work tracker holds each item's status; the component tracker's org flags record what is deployed where.
- C31: permission sets deploy to a sandbox only after a clean `permsets.py preflight`, and their org flags are set like any other component's.
- C32: "sheet" is now `manual-steps.md` or "file" (lines 77 and 106).
- C33: the pre-deploy snapshot step is a judgment call: weigh whether a rollback would need old values that Git does not hold, such as org data or org settings.
- C34: a manual step's status may also be "skipped".
- C35: the person or team in each step's Owner field runs that step and updates its status. Before: "The owner runs the deploys".
- C36: "task list" and "work log" are now the work item's Tasks and Recent History.
- C37: "lands" is now "succeeds".
- C38: "current state" is now "as it is now" (lines 135 and 157).

### `sf-data-change` body (C39 to C45, and the "handoff" name)

- C39: "without asking follow-up questions".
- C40: "No agent writes production data by CLI, API, anonymous Apex, or any tool that wraps them."
- The word "package" is "handoff" in Step 1's heading and in Step 4, so "package" means only `package.xml` (this is the body part of the review's fix to the description).
- C41: a backup file for updates, upserts, and deletes; for an insert, undo steps that delete the inserted records using the IDs in the success file.
- C42: "A project that already uses `engagement/` uses `engagement/data/` instead."
- C43: the work item and the step 4 handoff hold the record of the change, with the backup file's path; no separate README or other record.
- C44: before the first data change in a project, put a test `.csv` file in each of the two data folders, check that `git status` lists neither, then delete both files.
- C45: `record-deployment-steps.md` line: a manual step is for an action the deploy cannot perform, and the `sf-component-tracker` skill lists a pre-deploy snapshot as one.

### `sf-deploy-check` body (C46 to C49)

- C46: "Before every `sf project deploy start` to a shared org (for example UAT, full copy, staging, or production), whether it uses `-x`, `-m`, or `-d`."
- C47: diff a file against the commit last deployed to the target org (the "Source revision" line of that deploy's `DEPLOYMENT-RECORD.md`); when no record names it, run `git log -p` on the path and read each change.
- C48: "rides into production" is "would ship to production"; "the rider" is "the hitch-hiker".
- C49: the story about one past deploy is one rule: a tracker can be wrong both ways, and only a read-only check of the target org shows what it already has.

### Checks

- Rules checker on the branch: passed, 0 failures, the same 2 warnings as before (`memory-review-and-save.md` size and the `session-handoff.md` paragraph).
- The Salesforce guard hooks and `tools/` were not touched.
- Each of the three skill files was re-read after the edit; each description is under 400 characters.
- The `authorization:` line in `project_topic_template.md` still reads as valid YAML.

### Not in this commit

- Review answers B3 to B5, B7 to B18, B20, B21, B23 to B31, B33 to B48 and C12 to C26 change skills, shared texts, or `sf-architect-solutioning`, not the model. The build applies them. So does the build side of B1, B2, B6, B19, B22, and B32 (the shared sources and skill files that repeat the same lines).
- C10 also changes the three `record-format.md` copies in the local memory skills (the "technical landmarks" row). That is a build change.
- B34 adds an exception to `work-on`: a small fix with no work item. The `AGENTS.md` "Where information goes" row still says a new request, idea, or bug gets a work item. No model line was changed for it.
- `sf-data-change` line 53 still says the backup captures "every field the change may overwrite". C41 now asks for a backup for deletes too, and undoing a delete needs every field of the record. The review noted this gap and gave no text for it.
- `dev/SKILL-INDEX.md` rows for the three Salesforce skills (lines 135 to 137) still hold the old descriptions. They must change to the new texts above, word for word, with the overlap review and the routing test in both hosts.

## Twelfth commit (e189a8e)

1 file, `AGENTS.md`. A reviewer checked the tenth commit's lines against the wording, overlap, and best-practices checklists; these are the fixes a second agent confirmed. Each keeps what you approved overnight. The largest setup's `AGENTS.md` is now 179 lines and about 20,220 bytes (it was about 20,080), under the 20,480-byte limit.

- **Helper agents** ("Every session"): "These rules are for the main conversation. A helper agent follows its brief." became "The next four lines are for the main conversation; a helper agent follows its brief instead." Why: a helper loads this file and the always-on rules, and could read "these rules" as all of them, including `salesforce-org-safety.md`, which says it applies to every agent.
- **Waiting form** ("What the owner decides"): the line now points to the waiting form in `keep-work-item-current.md` without repeating its example. Why: the approved outline trims exact repeats of that rule. About 110 bytes shorter.
- **"Options"** (`solution-design` line): design options only "with no interview question open". Why: when you change an approved requirement and `work-refine` asks you about it, "give me some options" means answers to that question, as review answer A7 says, not a design.
- **Shipping** (`work-finish` line): "update requirements" became "update `requirements/`". Why: the old words also matched changing a requirement, which is `work-refine`'s job.
- **Tasks, phases, and sub-items**: the line now names what is done to one (adding, changing, moving, marking done). Why: "build task 3" names a task, and the old line sent it to the work track skill instead of `work-on`.
- **Decisions**: the line now covers "a decision that answers no open question". Why: when you answer an open question ("lets go with option b" after `solution-design` asks), the main rule sends it to the skill the item's Next action names, so that skill records your choice and takes the next step.
- **Hindsight memory**: "a fact kept" became "a fact kept, corrected, or forgotten", like the local and Notion lines, and the pointer to "Hindsight projects" in `memory-review-and-save.md` is back. Why: "forget that" matched this line, but the line said only to `retain`; the rule says never delete, tell you which memory, and ask you to remove it or `retain` a correction.

## Thirteenth commit (593d423)

3 files, all edited: `AGENTS.md`, `.claude/rules/keep-work-item-current.md`, and `work-items/work-item-template/WORK-ITEM.md`. A second review round checked tonight's text against the wording, overlap, and best-practices checklists; a second agent confirmed these fixes. Each keeps what you approved overnight. The largest setup's `AGENTS.md` is now 178 lines and about 20,237 bytes once setup removes the fill-in guide, under the 20,480-byte limit.

- **Cancelled items** (`keep-work-item-current.md`, `WORK-ITEM.md`): the third Next action form is now "Finished or cancelled: `None. Finished.` or, for a cancelled item, `None. Cancelled.`". Why: the rule allowed only "None. Finished.", while `work-finish` writes "None. Cancelled." when it cancels an item.
- **Roadmap** (Project map): "Read an item's phase before you build it." is now "Read an item's work unit in this file before you build it." Why: a work item also has its own phases (P1, P2), so "phase" could mean either. `work-on` already reads the item's unit.
- **Where information goes**: the line above the table is gone. Why: each thing it said is a row of the table, and the file is near its size limit. This frees 271 bytes.
- **"Options"** (`work-refine` and `solution-design` lines): "interview question" is now "requirements question", the name the `work-status` line and the skills use. Why: during design, `solution-design`'s own question ("which design option?") could pass for an interview question, so "give me some other options" could go to `work-refine`, which hands it back.
- **Cancelling** (the tasks line): "only marking a whole item Done or cancelling it goes to `work-finish`". Why: "cancel WI-031" matched both the work track skill and `work-finish`, and only `work-finish` offers the memory review and clears the item from Current State. The three work track skills' descriptions now also say "Not for closing or cancelling an item; use work-finish."
- **"Remind me to ..."** (a new line after the decision line): a project to-do with no time given goes to the work item it concerns (the work track skill), else "Untracked to-dos" in Current State; a personal errand goes to Todoist. This is your review answer A14, which had no line yet.

Not in this commit: four findings on text you wrote or approved word for word. They are questions 9 to 12 below.

## How to merge

In your own model folder, `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`, on `main`:

```bash
git merge toolkit-v2/approved-changes
```

This brings in all 40 commits on that branch: the earlier approved changes (`dev/model-changes.md`) and the commits in this list. After the merge, tell the build session, so it reads the model from your folder instead of the second folder.

You can merge first and answer the questions after. Each answer is a small follow-up edit on the model branch.

## Open questions for Mike

1. **Should the Hindsight instructions be their own rule file again?**
   - Now: they are a "Hindsight projects" section at the end of `memory-review-and-save.md` (lines 34 to 60), kept only in Hindsight projects (call 1). You never answered this; the branch holds the choice the first list did not recommend. In a Hindsight project the rule is about 6.8 KB, over the proposed 4 KB. Every Hindsight session also loads lines 5, 22 to 24, and 31, which name memory skills and an approval mode a Hindsight project does not have, so the section has to cancel them. The build's `project-setup` references already assume this layout.
   - Recommended: a separate `hindsight-memory.md` again, installed only in Hindsight projects. Restore it from the first commit, add the no-work-item and "forget that" lines, remove lines 34 to 60 from `memory-review-and-save.md`, put its line back in the `AGENTS.md` rules list, point `AGENTS.md` line 71 back to it, and update the build's setup references. If you keep the section instead, your answer goes into `dev/GOAL.md`.
2. **Should the Salesforce org guard stop treating `toolkit` commands as text?**
   - Now: in `.claude/hooks/guard-protected-orgs.cjs`, line 383 and line 705 let any command named `toolkit` (or `node .../bin/toolkit`) skip the production-org check, as if it only held text. The program is gone, so this skip does nothing useful. It could only let a future command with that name skip the check.
   - Recommended: remove `'toolkit'` from the list on line 383, delete line 705, and run the guard's tests again.
3. **Should the model get its own copy of `salesforce-permissions-research.md`?**
   - Now: `tools/permissions/PERMISSIONS-RUNBOOK.md` points to that file three times: lines 14 to 15, lines 20 to 22 ("See the research reference for the full reasoning and for what to do if this project later decides it wants profiles anyway."), and lines 194 to 195. Only the retired claude-toolkit has the file, so new projects point at a file they do not have.
   - Recommended: copy it into the model as `ai-external-knowledge/salesforce-permissions/salesforce-permissions-research.md`, with its `SOURCE-RECORD.md` and an `INDEX.md` line, and point all three places there. The other choice: delete those sentences.
4. **Is the new wording for keeping the `AGENTS.md` rules list OK?**
   - Now: your line said "Do not edit it by hand." Line 195 now says the `project-setup` skill writes the list from the files in `.claude/rules/`, and when a rule file is added, renamed, or removed with your yes, its line changes in the same edit. The reason: no program rebuilds the list any more, and Codex only knows the rules listed there.
   - Recommended: keep the new wording.
5. **Is the new fallback for text sent to other people OK?**
   - Now: `humanize-outbound-text.md` line 4 says: "If `humanizer` is not installed, rewrite the text yourself following `.claude/rules/plain-english-artifacts.md`, and tell the owner the humanizer did not run." Your old fallback used `unslop`, which you retired, so this is new behavior.
   - Recommended: keep it. The other choice: "When `humanizer` is not installed, tell the owner before he sees the final version."
6. **Which words should a design's status use?**
   - Now: they are written three ways. `DESIGN.md` front matter (lines 3 to 4) uses `status: proposed` and `approved: "no"`. Your body line (line 12) says "Design status: <Draft | In review | Approved | Superseded>". `WORK-ITEM.md` line 12 uses `design: <proposed | approved | superseded | none>`. The earlier list raised this, and it was never decided.
   - Recommended: change your body line to "**Design status:** <proposed | approved | superseded>", so all three places use the same words. The other choice: keep your four words and add `draft` and `in review` to both front matter lists.
7. **Should the main rule's "a question gets an answer" line leave room for the Skills list?**
   - Now: `AGENTS.md` line 34 says "If the owner asks a question or asks for something else, pick the skill by what he wants done, from the Skills list. A question gets an answer, not the next step." Several Skills lines start their skill from a question: "is it ready" (`work-check`), "how should we build it" (`solution-design`), "what am I missing" (`work-refine`). With WI-031 waiting for its check and you asking "is it ready", one reading runs the check; the other only answers "built, not checked yet".
   - Recommended: "If the owner asks a question or asks for something else, pick the skill by what he wants done, from the Skills list. A question no Skills line covers gets an answer, not the next step. When his plan changes, rewrite the item's Next action." "ok so whats next" still goes to `work-status`, which reports and starts nothing. This is your approved main rule word for word, so it waits for your yes. Then add "is it ready" (with Next action naming `work-check`) to the routing test.
8. **Should the Next action forms say the owner's name and cover waiting on someone else?**
   - Now: the waiting form in `keep-work-item-current.md`, `WORK-ITEM.md`, and the build's `work-item-format.md` says "Waiting on Mike: Q-07 ...", with your name fixed in it, while several skills write "Waiting on <first name>". And an item can wait on someone outside (`waiting_on: external: the bank, for test keys`), but no form covers it.
   - Recommended: the waiting form becomes "Waiting on <owner's first name>: Q-07 (<the question in a few words>). After his answer: <step>, with <skill>." (the example keeps "Mike"). Add: when the item waits on someone else, use the working form for what the agent does meanwhile ("Agent: build P1-T04 while the bank's test keys are pending, with work-on."), or, with nothing to do meanwhile, "Agent: check whether <who> has replied, with <skill>." This adds a rule, so it waits for your yes.
   - Another choice, from the second review round: the working form with "External" as the one who acts, naming what is awaited and the agent's step after it, for example "External: the bank sends the test keys, then the agent finishes P1-T02, with work-on."
9. **Should "may run inside these skills" say it plainly?**
   - Now: `AGENTS.md`, "Skills", first paragraph: "Method skills from other plugins (brainstorming, plans, debugging) may run inside these skills, never instead of them." It is your sentence (2026-09-26). "Run inside" can be read two ways: the agent uses another skill partway through a Toolkit skill's steps, or the other skill takes over a step.
   - Recommended: "You may use method skills from other plugins (brainstorming, plans, debugging) while you follow these skills, never in place of them."
10. **Should `sf-data-change` say its "handoff" is not the `handoff` skill?**
   - Now: the eleventh commit renamed the owner's "package" to "handoff" (your answer A10), so "package" means only `package.xml`. But `handoff` is also the skill that wraps up a chat session, and `AGENTS.md` sends "write a handoff" to it. An agent told "give the owner the handoff" could open that skill.
   - Recommended: keep the word, and add these two sentences after "This skill produces everything the owner needs to run the change without asking follow-up questions.":
     > In this skill, "the handoff" means those files and instructions for the owner. It is not the `handoff` skill, which wraps up a chat session.
   - The other choice: another word, such as "run sheet", in the description, steps 1 and 4, and `work-finish`'s `references/salesforce-deployment.md`, then the routing test again.
11. **Should the Plain English output style allow the line that continues the work?**
   - Now: line 15 of `.claude/output-styles/plain-english.md` (your text) says "Stop after the answer. Do not add extra implementation detail, related advice, next steps, or an offer to do more unless the user asked for them." Several skills tell the agent to end a reply with the words that continue the work (for example "Say 'keep going' and I'll build P2."), and line 17 of the same style already assumes those words exist. In Claude Code the agent gets two orders about the last line; Codex follows `AGENTS.md`, which has no such ban, so the two hosts end replies differently.
   - Recommended: "Stop after the answer. Do not add extra implementation detail, related advice, or unrequested suggestions. When work continues after the user's answer or go-ahead, end with one line that says what continues it."
12. **Should `sf-component-tracker`'s description name the situation instead of the steps?**
   - Now: its "Use when" holds "(open it before work-on and update the records in the same response)", which is how the skill works, and it pushes the other two situations toward the end, the part Codex cuts first. You approved this text in A10.
   - Recommended (359 characters): "Keeps the component tracker CSV, the master and per-work-item package.xml files, destructiveChanges.xml, and manual steps in sync, so no changed component is left out of a deploy. Use whenever Salesforce metadata under force-app/ is added, changed, renamed, or deleted (even during a work-on build), a deploy result comes back, or a deploy needs manual steps." The `AGENTS.md` line keeps "before `work-on`", and the skill's first line and `component-tracker.md` keep "in the same response". Then the same text goes in `dev/SKILL-INDEX.md`, and the routing test runs again in both hosts.
