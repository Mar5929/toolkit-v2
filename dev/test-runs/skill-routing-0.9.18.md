# Routing check after the merge of the work item skills and the memory skills (TKV-29, 2026-10-08)

The work item skills were merged into one skill, `managing-work-items`, and the memory skills into one skill, `managing-project-memory`. A new project skill, `filechanges`, was added. The `toolkit` plugin lost `choosing-outside-tools`, and the project lost `explain-simply`. This check had not run since those changes. The question: does each product still open the right skill first? The method is the one in `skill-routing-plain-english.md`, which refers to `skill-routing-0.9.0.md` and `skill-routing-memory-restore.md`. Changes from that method are listed under "How it ran".

Tested files: the worktree `.claude/worktrees/live-tests`, branch `live-tests-0.9.18`, commit `09529cb7` (main). Both plugin manifests say 0.9.18. Claude Code 2.1.289 with `--model sonnet` (`claude-sonnet-5-5`, as the session reported it). Codex CLI 0.160.0 with `gpt-6-luna`, the model the earlier record used; it is still in the test home's model list. Nothing was edited to change a result: no skill, rule, hook, instruction file, or description. The worktree had no changed file before or after the run, other than this record.

## Result

70 requests: 66 of the 70 requests of `skill-routing-plain-english.md` and 4 new ones. One run each in a fresh session on a fresh copy of the scratch project. Every request that missed was then run once more (a second run). "Wrong skill first" means the first skill the session opened was not the expected one. "No skill" means the session opened no skill where one was expected.

| Product | Right first time | Wrong skill first | No skill where one was expected | Second run of the misses | Right after the second run |
| --- | --- | --- | --- | --- | --- |
| Claude Code | 57 of 70 | 4 (39, 56, n4, f3) | 9 (01, 09, 11, 18, 19, 21, 40, 41, n7) | 2 of 13 changed to right (09, n7); 11 steady misses | 59 of 70 |
| Codex | 59 of 70 | 10 (09, 18, 21, 28, 41, 49, 55, 59, n4, f3) | 1 (n10) | 5 of 11 changed to right (21, 28, 49, 59, n10); 6 steady misses | 64 of 70 |

Steady misses (wrong in both runs): Claude Code 01, 11, 18, 19, 21, 39, 40, 41, 56, n4, f3. Codex 09, 18, 41, 55, n4, f3.

Comparison with `skill-routing-plain-english.md`, on the 66 requests both records hold. The expected skill of each request is the current one, so a renamed skill counts under its new name; the earlier column is the earlier record's own verdict.

| Comparison | Claude Code | Codex |
| --- | --- | --- |
| Earlier record, right first time, its own expectations | 61 of 66 | 52 of 66 |
| This run, right first time | 54 of 66 | 56 of 66 |
| Right before, wrong now | 01, 09, 11, 21, 39, 40, 56, n7 | 09, 21, 49, 55, n10 |
| Wrong before, right now | 15 | 12, 19, 20, 23, 51, 53, 56, 57, n1 |

- The two requests whose meaning of the expectation changed (45 "Where are we?" and n10 "where are we") are right in this table when the session opened `managing-work-items` or `managing-project-memory`. The earlier record expected no skill. By the earlier expectation, Claude Code would be wrong on both (it opened `managing-work-items` on both), and Codex would be wrong on 45 (it opened `managing-work-items`) and right on n10 (no skill). The Codex n10 miss above is therefore only a miss by the new expectation.
- Codex is better than the earlier record. In the earlier record Codex opened `using-work-tracker` before `running-work-item-lifecycle` for 12 ("Is WI-12 ready to test?") on its first run and for 57 ("is WI-31 ready to test?") on both runs. Both requests are now right in both products, because those two skills are one skill. Requests 37, 38, 47, and 48 stayed right.
- Claude Code is worse than the earlier record. Six of its eight new misses are sessions that opened no skill and asked the owner a question or said they could not write (01, 09, 11, 21, 40, n7). Request 39 opened `publish-docs`, and request 56 opened `managing-work-items` first and `sf-deploy-check` second. The reason is not shown by this run. One candidate, which this run did not test, is the rule `evaluate-the-owners-request.md` (added in 0.9.16 and printed on every message): it tells the agent to ask one short question when it cannot tell what the owner means, and most of these requests are short and name no content (see "Every wrong or unclear pick").
- Neither product opened `managing-project-memory` when another skill was expected, on a first run. `managing-work-items` was opened first when another skill was expected in 4 first runs: Claude Code 56; Codex 09, 21, 55 (and Codex 49 opened `project-setup` first, then `managing-work-items`).

## What changed since the earlier record, and the requests written down before the run

The list below, with the expected skill for each request, was saved before any session ran (the one-request smoke test under "Not counted" came after it). Its checksum was checked again after the run, and the list did not change. The expected skill comes from the "Which skill" table of the starter `AGENTS.md`, from section 9 of `dev/SKILL-INDEX.md`, and from the earlier record.

- **Dropped (4):** requests 06, 07, and 08 expected `choosing-outside-tools`, and request 29 expected `explain-simply`. Neither skill exists any more (the owner's tool list is the plain file `OUTSIDE-TOOLS.md`, and `explain-simply` is gone). Request 30 ("what is the sources folder for?") stays, because it expects no skill, though its neighbour `explain-simply` is gone.
- **Renamed expectations:** every `running-work-item-lifecycle` and `using-work-tracker` expectation is now `managing-work-items` (12 to 18, 22, 28, 37, 38, 47 to 49, 57, n1). Every `curating-project-memory` and `using-memory-store` expectation is now `managing-project-memory` (39 to 44, 50, 51, n2, n3, n4, n6, n7). A Hindsight project has no memory skill, so none is tested (no Hindsight project exists in this test).
- **A plain read of memory** (43, 50, n6) accepts `managing-project-memory` or no skill, as the earlier record did.
- **Changed in meaning (45, n10):** "Where are we?" expected no skill. The "Which skill" row now says to use `managing-work-items` for open work items and project tasks and `managing-project-memory` for the project's Current State, so either of the two is right.
- **Kept as before:** request 41 ("Write this up as a rule for agents") expects `managing-project-memory`, as it expected `curating-project-memory`; `writing-harness-files` is the pick that Codex makes on every run. Request n4 ("what did we do today") expects `managing-project-memory` or no skill; `session-summary` counts as a miss, as before.
- **New (4):** f1 "what files did you change?" and f2 "list the files you just changed" expect `filechanges`. f3 "what did you change in this chat" and f4 "recap this chat" expect `session-summary`, the neighbour that `dev/SKILL-INDEX.md` section 9 keeps apart from `filechanges`. The task asked for two requests for the pair; there are two for each skill, so the boundary is tested from both sides.

| ID | Project | Request | Expected | Compared with the earlier record |
| --- | --- | --- | --- | --- |
| 01 | a | toolkit v2 | project-setup | same request, same expected skill |
| 02 | a | check the setup | project-setup | same request, same expected skill |
| 03 | a | update the toolkit | project-setup | same request, same expected skill |
| 04 | a | I want to move my work items out of local files and into Notion | project-setup | same request, same expected skill |
| 05 | a | bring this repo up to date with GitHub | pull-latest | same request, same expected skill |
| 09 | a | add a new skill to this project that makes slides for me | writing-harness-files | same request, same expected skill |
| 10 | a | write a hook that stops you from ever running git push --force | writing-harness-files | same request, same expected skill |
| 11 | a | change the Codex rules file so git status never asks me again | writing-harness-files | same request, same expected skill |
| 12 | a | Is WI-12 ready to test? | managing-work-items | same request, expected skill renamed |
| 13 | a | ok ship WI-12 | managing-work-items | same request, expected skill renamed |
| 14 | a | Add dark mode to the backlog for later. | managing-work-items | same request, expected skill renamed |
| 15 | a | Grill me on the checkout flow. | managing-work-items | same request, expected skill renamed |
| 16 | a | We decided to drop the export feature | managing-work-items (or filing-project-records) | same request, expected skill renamed |
| 17 | a | Close out WI-12 | managing-work-items | same request, expected skill renamed |
| 18 | a | ok that's approved, merge it | managing-work-items | same request, expected skill renamed |
| 19 | a | Save this transcript | filing-project-records | same request, same expected skill |
| 20 | a | the client just confirmed accounts can only be deactivated, never deleted, and every feature that touches accounts has to follow that | filing-project-records | same request, same expected skill |
| 21 | a | Update the security doc | filing-project-records | same request, same expected skill |
| 22 | a | the export button should be blue, that is only for WI-3 | managing-work-items | same request, expected skill renamed |
| 23 | a | I'm going to clear context. | handoff | same request, same expected skill |
| 24 | a | write me a prompt so I can pick this up in a new chat | handoff | same request, same expected skill |
| 25 | a | I'm done for the day, wrap everything up so I can start fresh tomorrow | handoff | same request, same expected skill |
| 26 | a | give me a quick list of what I asked for in this chat and what is still open | session-summary | same request, same expected skill |
| 27 | a | ok brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. don't do anything, just tell me what you heard | braindump | same request, same expected skill |
| 28 | a | brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. put it all in as work items | managing-work-items | same request, expected skill renamed |
| 30 | a | what is the sources folder for? | no skill | same request, same expected skill; its neighbour explain-simply no longer exists |
| 31 | a | get the latest | pull-latest | same request, same expected skill |
| 32 | a | my local copy is a mess, make it exactly like GitHub and throw the rest away | reset-to-remote | same request, same expected skill |
| 33 | a | undo my last commit, I didn't mean to make it | no skill | same request, same expected skill |
| 34 | a | Merge PR 14 and clean up. | merge-and-clean-up | same request, same expected skill |
| 35 | a | that change to PROJECT.md looks right, commit it straight to main | publish-docs | same request, same expected skill |
| 35b | a | PR 22 passed review, merge it and delete the branch | merge-and-clean-up | same request, same expected skill |
| 36 | a | fix the typo in the README | no skill (or publish-docs) | same request, same expected skill |
| 37 | a | Make WI-7 a sub-item of WI-3. | managing-work-items | same request, expected skill renamed; was using-work-tracker |
| 38 | a | show me what WI-3 says | managing-work-items | same request, expected skill renamed; was using-work-tracker |
| 39 | a | Remember that the client's year starts in February | managing-project-memory | same request, expected skill renamed |
| 40 | a | From now on, always run the tests before you ask me | managing-project-memory | same request, expected skill renamed |
| 41 | a | Write this up as a rule for agents | managing-project-memory | same request, expected skill renamed |
| 42 | a | forget what I told you about the old fiscal year | managing-project-memory | same request, expected skill renamed |
| 43 | a | what does memory point to? | managing-project-memory (or no skill) | same request, expected skill renamed; a plain read may use the skill or no skill |
| 44 | a | update Current State: WI-12 is built and waiting on my testing | managing-project-memory | same request, expected skill renamed |
| 45 | a | Where are we? | managing-work-items (or managing-project-memory) | same request, expectation changed; the table row now names these two skills; the earlier record expected no skill |
| 46 | a | What did we decide about the date format? | no skill | same request, same expected skill |
| 47 | b | show me WI-31 | managing-work-items | same request, expected skill renamed; was using-work-tracker |
| 48 | b | which phases does the CRM project have? | managing-work-items | same request, expected skill renamed; was using-work-tracker |
| 49 | b | Add a task to phase 2 of WI-31 | managing-work-items | same request, expected skill renamed |
| 50 | b | what does memory point to? | managing-project-memory (or no skill) | same request, expected skill renamed; a plain read may use the skill or no skill |
| 51 | b | update the Current state page: WI-31 is waiting on UAT | managing-project-memory | same request, expected skill renamed |
| 52 | b | ntn says I'm not signed in, fix it | using-notion-cli | same request, same expected skill |
| 53 | b | a Notion call came back 404 on the Memories database | using-notion-cli | same request, same expected skill |
| 54 | b | I added Account.Region__c as a new custom field, keep the tracker up to date | sf-component-tracker | same request, same expected skill |
| 55 | b | the deploy result came back with two failures, update the records | sf-component-tracker | same request, same expected skill |
| 56 | b | can the WI-31 changes go to the UAT sandbox? check that nothing extra goes with them | sf-deploy-check | same request, same expected skill |
| 57 | b | is WI-31 ready to test? | managing-work-items | same request, expected skill renamed |
| 58 | b | load this CSV of accounts into production | sf-data-change | same request, same expected skill |
| 59 | b | load this CSV of accounts into the dev sandbox | no skill | same request, same expected skill |
| n1 | a | the client said on the call they want the renewal date on the account page | managing-work-items (or filing-project-records) | same request, expected skill renamed |
| n2 | a | the nightly export failed again last night | managing-project-memory | same request, expected skill renamed |
| n3 | a | remember that Dana covers for Luis until the 20th | managing-project-memory | same request, expected skill renamed |
| n4 | a | what did we do today | managing-project-memory (or no skill) | same request, expected skill renamed; session-summary counts as a miss, as in the earlier record |
| n5 | a | what did we do in this chat | session-summary | same request, same expected skill |
| n6 | a | read current state | managing-project-memory (or no skill) | same request, expected skill renamed; a plain read may use the skill or no skill |
| n7 | a | update current state, the vendor call moved to Thursday | managing-project-memory | same request, expected skill renamed |
| n8 | a | look at how the rollup fields on the account object work and tell me | no skill | same request, same expected skill |
| n9 | a | we decided to keep the old approval flow for all regions | filing-project-records | same request, same expected skill |
| n10 | a | where are we | managing-work-items (or managing-project-memory) | same request, expectation changed; the table row now names these two skills; the earlier record expected no skill |
| f1 | a | what files did you change? | filechanges | new request; new skill |
| f2 | a | list the files you just changed | filechanges | new request; new skill |
| f3 | a | what did you change in this chat | session-summary | new request; neighbour of filechanges |
| f4 | a | recap this chat | session-summary | new request; neighbour of filechanges |

## How it ran

The method is the one in `skill-routing-plain-english.md`: the first `Skill` call in Claude Code's stream-json output, and the first command that reads a file under `skills/<name>/` in Codex's `--json` events (the session is stopped at that moment). When one Codex command reads several skills at once, the first one named counts as first and the others are listed as "then also". A session that opens no skill is "no skill". Claude Code was allowed 4 turns; 18 of the 83 Claude Code sessions (70 first runs and 13 second runs) ended on that limit, which changes no result because the first skill is read from the first call.

- Claude Code: `claude -p <request> --model sonnet --max-turns 4 --output-format stream-json --verbose --no-session-persistence --strict-mcp-config --disallowedTools Bash Write Edit NotebookEdit WebFetch WebSearch --plugin-dir <worktree>/plugins/toolkit --settings '{"enabledPlugins":{"toolkit@toolkit-v2":false}}'`, with `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`, input closed (`< /dev/null`), run from a fresh copy of the scratch project. The plugin loaded from the worktree for the session only (it reported version 0.9.18), and the test home's old copy was turned off for the session only. Claude Code listed 52 skills in each project (a) session and 56 in each project (b) session (the earlier record: 55 and 59). The two plugin skills are `toolkit:project-setup` and `toolkit:writing-harness-files`.
- Codex: `codex -p routing exec --json --ephemeral -s read-only --color never -c model=gpt-6-luna -c 'projects."<copy>".trust_level="trusted"' -C <copy> <request>`, with `CODEX_HOME=~/.toolkit-v2-test-homes/codex`, input closed, run from a fresh copy of the scratch project. The `toolkit` plugin was installed from a scratch marketplace (`toolkit-v2-routing-0918`, whose plugin path is a link to `<worktree>/plugins/toolkit`) with `codex plugin marketplace add` and `codex plugin add toolkit@toolkit-v2-routing-0918`, so its skills are `toolkit:project-setup` and `toolkit:writing-harness-files`. The test home's old copy (`toolkit@toolkit-v2`) was turned off with the profile file `routing.config.toml` (a table `[plugins."toolkit@toolkit-v2"]` with `enabled = false`), used with `-p routing`. No hook event appears in the Codex output, so Codex hooks did not run (the earlier records say the project's hooks were not trusted); Claude Code's session-start hook ran in every session.
- Projects: (a) Acme Orders: local work items, local memory, not Salesforce; 11 project skills and 2 plugin skills. (b) Northwind CRM: Notion work items, Notion memory, Salesforce; 15 project skills and 2 plugin skills. Both were built from the worktree's files by the steps of `setup-copy.md`, `skills-hooks-settings.md`, and `placing-files.md` (the folders `every-project`, then one per choice, the name and the 10 lines of "Toolkit settings" filled, the settings merged, the `.agents/skills` link, `core.hooksPath` set, one commit). Project (a) holds three work items (WI-003, WI-007, WI-012), a Current State in the five-part form, and one decided entry (DEC-001, date format). The Notion ids in (b) are made up (`WI` is the work item prefix there, so a request can name WI-31). `node .claude/hooks/validate-records.mjs --all` printed nothing in both. No Notion, Hindsight, Salesforce, or GitHub call was made or possible.
- Every session ran in its own copy of the finished project (`cp -R` of the scratch project, in a folder whose name has no dot), removed afterwards. Sessions ran 5 at a time, Claude Code first, then Codex.
- Codex skill list, seen with `codex debug prompt-input` in each project with the same flags: (a) 19 skills (11 project, 2 plugin, 4 Codex built-in, 2 of the owner's own: `hindsight-coding-agent` and `neon-postgres`), 8,025 characters, about 2,000 tokens (characters divided by 4: inferred); (b) 23 skills (15 project, 2 plugin, 4 built-in, 2 owner), 9,489 characters, about 2,370 tokens. The earlier record had 10,452 and 12,275 characters. Every project and plugin description equals the text of its `SKILL.md` word for word (checked by program, 0 differences in both). Nothing was cut: the default limit is 2% of the context window, 5,440 tokens for the window in the test home's model list. The old copy of the toolkit did not appear in the list. Claude Code's skill list was not checked for cuts.
- A Codex session sometimes tried paths such as `~/.claude/skills/<name>/SKILL.md` first. These were reads only.

## Not counted

- A smoke test of one request in each product ("what files did you change?", project (a)) to check the scripts. Both opened `filechanges`. It is not in the table.
- A first Codex pass of all 70 requests. It is not in the tables, because it did not follow the method: the scratch folder name held a dot (`codex-r1-26.jsonl-...`), and Codex printed "ignoring 1 unrecognized configuration setting" for the `projects."<copy>".trust_level` override, so the project was not trusted in that pass. It was run again with folder names that have no dot, and 0 of the 70 sessions printed the warning. The first pass scored 52 of 70 right, against 59 in the counted pass; the verdict of 13 requests differed (10, 11, 26, 36, 44, 53, 56, n5, n8, n9 right only in the counted pass; 21, 49, n10 right only in the first pass). This shows that the trust setting changes Codex's picks, so a record of Codex routing should confirm that the override took effect. The earlier record names the same override and does not say whether it took effect.
- Claude Code did not need a re-run for a service error. No Claude Code or Codex session in the counted passes ended with "model at capacity" or a rate limit message (checked by the result type of every Claude Code session, which is success or the turn limit with no API error status, and by searching the Codex outputs for error events and the words "at capacity", "usage limit", and "rate limit").

## Table of every request

"Expected" is the skill named in the list above. Each cell is the first skill the session opened; "(then also ...)" lists skills read in the same step (Codex) or later in the session (Claude Code). When the first run missed, the cell shows both runs.

| ID | Project | Request | Expected | Claude Code | Codex |
| --- | --- | --- | --- | --- | --- |
| 01 | a | toolkit v2 | project-setup | 1st: MISS: no skill<br>2nd: MISS: no skill | right: project-setup |
| 02 | a | check the setup | project-setup | right: project-setup | right: project-setup |
| 03 | a | update the toolkit | project-setup | right: project-setup | right: project-setup |
| 04 | a | I want to move my work items out of local files and into Notion | project-setup | right: project-setup | right: project-setup |
| 05 | a | bring this repo up to date with GitHub | pull-latest | right: pull-latest | right: pull-latest |
| 09 | a | add a new skill to this project that makes slides for me | writing-harness-files | 1st: MISS: no skill<br>2nd: right: writing-harness-files | 1st: MISS: managing-work-items (then also skill-creator, writing-harness-files)<br>2nd: MISS: project-setup |
| 10 | a | write a hook that stops you from ever running git push --force | writing-harness-files | right: writing-harness-files | right: writing-harness-files |
| 11 | a | change the Codex rules file so git status never asks me again | writing-harness-files | 1st: MISS: no skill<br>2nd: MISS: no skill | right: writing-harness-files |
| 12 | a | Is WI-12 ready to test? | managing-work-items | right: managing-work-items | right: managing-work-items |
| 13 | a | ok ship WI-12 | managing-work-items | right: managing-work-items | right: managing-work-items |
| 14 | a | Add dark mode to the backlog for later. | managing-work-items | right: managing-work-items | right: managing-work-items |
| 15 | a | Grill me on the checkout flow. | managing-work-items | right: managing-work-items | right: managing-work-items |
| 16 | a | We decided to drop the export feature | managing-work-items (or filing-project-records) | right: managing-work-items | right: managing-work-items |
| 17 | a | Close out WI-12 | managing-work-items | right: managing-work-items | right: managing-work-items |
| 18 | a | ok that's approved, merge it | managing-work-items | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: merge-and-clean-up<br>2nd: MISS: no skill |
| 19 | a | Save this transcript | filing-project-records | 1st: MISS: no skill<br>2nd: MISS: no skill | right: filing-project-records |
| 20 | a | the client just confirmed accounts can only be deactivated, never deleted, and every feature that touches accounts has to follow that | filing-project-records | right: filing-project-records | right: filing-project-records |
| 21 | a | Update the security doc | filing-project-records | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: managing-work-items (then also filing-project-records)<br>2nd: right: filing-project-records |
| 22 | a | the export button should be blue, that is only for WI-3 | managing-work-items | right: managing-work-items | right: managing-work-items |
| 23 | a | I'm going to clear context. | handoff | right: handoff | right: handoff |
| 24 | a | write me a prompt so I can pick this up in a new chat | handoff | right: handoff | right: handoff |
| 25 | a | I'm done for the day, wrap everything up so I can start fresh tomorrow | handoff | right: handoff | right: handoff |
| 26 | a | give me a quick list of what I asked for in this chat and what is still open | session-summary | right: session-summary | right: session-summary |
| 27 | a | ok brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. don't do anything, just tell me what you heard | braindump | right: braindump | right: braindump |
| 28 | a | brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. put it all in as work items | managing-work-items | right: managing-work-items | 1st: MISS: braindump<br>2nd: right: managing-work-items |
| 30 | a | what is the sources folder for? | no skill | right: no skill | right: no skill |
| 31 | a | get the latest | pull-latest | right: pull-latest | right: pull-latest |
| 32 | a | my local copy is a mess, make it exactly like GitHub and throw the rest away | reset-to-remote | right: reset-to-remote | right: reset-to-remote |
| 33 | a | undo my last commit, I didn't mean to make it | no skill | right: no skill | right: no skill |
| 34 | a | Merge PR 14 and clean up. | merge-and-clean-up | right: merge-and-clean-up | right: merge-and-clean-up |
| 35 | a | that change to PROJECT.md looks right, commit it straight to main | publish-docs | right: publish-docs | right: publish-docs |
| 35b | a | PR 22 passed review, merge it and delete the branch | merge-and-clean-up | right: merge-and-clean-up | right: merge-and-clean-up |
| 36 | a | fix the typo in the README | no skill (or publish-docs) | right: no skill | right: no skill |
| 37 | a | Make WI-7 a sub-item of WI-3. | managing-work-items | right: managing-work-items | right: managing-work-items |
| 38 | a | show me what WI-3 says | managing-work-items | right: managing-work-items | right: managing-work-items |
| 39 | a | Remember that the client's year starts in February | managing-project-memory | 1st: MISS: publish-docs<br>2nd: MISS: publish-docs | right: managing-project-memory |
| 40 | a | From now on, always run the tests before you ask me | managing-project-memory | 1st: MISS: no skill<br>2nd: MISS: no skill | right: managing-project-memory |
| 41 | a | Write this up as a rule for agents | managing-project-memory | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: writing-harness-files<br>2nd: MISS: writing-harness-files |
| 42 | a | forget what I told you about the old fiscal year | managing-project-memory | right: managing-project-memory | right: managing-project-memory |
| 43 | a | what does memory point to? | managing-project-memory (or none) | right: no skill | right: no skill |
| 44 | a | update Current State: WI-12 is built and waiting on my testing | managing-project-memory | right: managing-project-memory | right: managing-project-memory |
| 45 | a | Where are we? | managing-work-items (or managing-project-memory) | right: managing-work-items | right: managing-work-items |
| 46 | a | What did we decide about the date format? | no skill | right: no skill | right: no skill |
| 47 | b | show me WI-31 | managing-work-items | right: managing-work-items | right: managing-work-items |
| 48 | b | which phases does the CRM project have? | managing-work-items | right: managing-work-items | right: managing-work-items |
| 49 | b | Add a task to phase 2 of WI-31 | managing-work-items | right: managing-work-items | 1st: MISS: project-setup (then also managing-work-items, using-notion-cli)<br>2nd: right: managing-work-items |
| 50 | b | what does memory point to? | managing-project-memory (or none) | right: no skill | right: no skill |
| 51 | b | update the Current state page: WI-31 is waiting on UAT | managing-project-memory | right: managing-project-memory | right: managing-project-memory |
| 52 | b | ntn says I'm not signed in, fix it | using-notion-cli | right: using-notion-cli | right: using-notion-cli |
| 53 | b | a Notion call came back 404 on the Memories database | using-notion-cli | right: using-notion-cli | right: using-notion-cli |
| 54 | b | I added Account.Region__c as a new custom field, keep the tracker up to date | sf-component-tracker | right: sf-component-tracker | right: sf-component-tracker |
| 55 | b | the deploy result came back with two failures, update the records | sf-component-tracker | right: sf-component-tracker | 1st: MISS: managing-work-items (then also sf-component-tracker, using-notion-cli)<br>2nd: MISS: managing-work-items (then also using-notion-cli) |
| 56 | b | can the WI-31 changes go to the UAT sandbox? check that nothing extra goes with them | sf-deploy-check | 1st: MISS: managing-work-items (then also sf-deploy-check, using-notion-cli)<br>2nd: MISS: managing-work-items (then also sf-deploy-check, using-notion-cli) | right: sf-deploy-check |
| 57 | b | is WI-31 ready to test? | managing-work-items | right: managing-work-items | right: managing-work-items |
| 58 | b | load this CSV of accounts into production | sf-data-change | right: sf-data-change | right: sf-data-change |
| 59 | b | load this CSV of accounts into the dev sandbox | no skill | right: no skill | 1st: MISS: sf-data-change (then also managing-work-items)<br>2nd: right: no skill |
| n1 | a | the client said on the call they want the renewal date on the account page | managing-work-items (or filing-project-records) | right: managing-work-items | right: filing-project-records |
| n2 | a | the nightly export failed again last night | managing-project-memory | right: managing-project-memory | right: managing-project-memory |
| n3 | a | remember that Dana covers for Luis until the 20th | managing-project-memory | right: managing-project-memory | right: managing-project-memory |
| n4 | a | what did we do today | managing-project-memory (or none) | 1st: MISS: session-summary<br>2nd: MISS: session-summary | 1st: MISS: session-summary<br>2nd: MISS: session-summary (then also managing-work-items) |
| n5 | a | what did we do in this chat | session-summary | right: session-summary | right: session-summary |
| n6 | a | read current state | managing-project-memory (or none) | right: no skill | right: no skill |
| n7 | a | update current state, the vendor call moved to Thursday | managing-project-memory | 1st: MISS: no skill<br>2nd: right: managing-project-memory | right: managing-project-memory |
| n8 | a | look at how the rollup fields on the account object work and tell me | no skill | right: no skill | right: no skill |
| n9 | a | we decided to keep the old approval flow for all regions | filing-project-records | right: filing-project-records | right: filing-project-records |
| n10 | a | where are we | managing-work-items (or managing-project-memory) | right: managing-work-items | 1st: MISS: no skill<br>2nd: right: managing-work-items |
| f1 | a | what files did you change? | filechanges | right: filechanges | right: filechanges |
| f2 | a | list the files you just changed | filechanges | right: filechanges | right: filechanges |
| f3 | a | what did you change in this chat | session-summary | 1st: MISS: filechanges<br>2nd: MISS: filechanges | 1st: MISS: filechanges<br>2nd: MISS: filechanges |
| f4 | a | recap this chat | session-summary | right: session-summary | right: session-summary |

## Every wrong or unclear pick

What each session opened and said, for each first-run miss. "Second run" gives the result of the second run. Product names: CC is Claude Code, CX is Codex. The `managing-work-items` and `managing-project-memory` column says whether the miss involves a merged skill (as the expected skill, or as the skill that was opened instead).

| ID | Request | Expected | Product | First run: opened, and what the agent said | Second run | Merged skill involved |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | toolkit v2 | project-setup | CC | No skill. It asked "Do you want me to check or update the Toolkit V2 setup for this project, or did you mean something else by 'toolkit v2'?" | No skill; asked the same kind of question. | No |
| 09 | add a new skill ... that makes slides | writing-harness-files | CC | No skill. It asked which form the slides should take (PowerPoint file or online page). | Right: `toolkit:writing-harness-files`, then it asked for the format. | No |
| 11 | change the Codex rules file ... | writing-harness-files | CC | No skill. It looked for Codex rules files with `Glob` and `Read`, tried a `Write` that was turned off, and ended on the turn limit. | No skill; same files looked at; it said it could not write the file and gave the content of the new rules file. | No |
| 18 | ok that's approved, merge it | managing-work-items | CC | No skill. It ran `git worktree list; git branch -a; git remote` and asked which of WI-003, WI-007, WI-012 to merge. | No skill; asked the same question. | Yes (expected) |
| 19 | Save this transcript | filing-project-records | CC | No skill. It said nothing to save yet except the message and asked which transcript. | No skill; asked the same. | No |
| 21 | Update the security doc | filing-project-records | CC | No skill. It named `system/security-model.md` and asked what the change is. | No skill; it read `system/security-model.md`, found it empty, and asked what should go in it. | No |
| 39 | Remember that the client's year starts in February | managing-project-memory | CC | `publish-docs` (after reading `PROJECT.md`). It said it could not save (no shell, no editor) and that the line belongs in `PROJECT.md`, "Operating conventions". | `publish-docs` again, same answer. | Yes (expected) |
| 40 | From now on, always run the tests before you ask me | managing-project-memory | CC | No skill. It read `.claude/rules/owner-preferences.md` and tried `Edit`, which was turned off. It said the line is ready for that file. | Same. | Yes (expected) |
| 41 | Write this up as a rule for agents | managing-project-memory | CC | No skill. It asked what the rule says ("this" has nothing before it). | Same. | Yes (expected) |
| 56 | can the WI-31 changes go to the UAT sandbox? ... | sf-deploy-check | CC | `managing-work-items` first, `sf-deploy-check` second, then `using-notion-cli`. It read the tracker and lifecycle references and ended on the turn limit. | Same order, same ending. | Yes (opened instead) |
| n4 | what did we do today | managing-project-memory (or no skill) | CC | `session-summary`. It answered "Nothing has been done in this session yet" and quoted the last Current State. | Same. | Yes (expected) |
| n7 | update current state, the vendor call moved to Thursday | managing-project-memory | CC | No skill. It asked whether Thursday means today (2026-10-08) or 2026-10-15. | Right: `managing-project-memory`; it found no vendor call in the records and asked which Thursday and what the call is about. | Yes (expected) |
| f3 | what did you change in this chat | session-summary | CC | `filechanges`. It said it changed no files in this chat. | Same. | No |
| 09 | add a new skill ... that makes slides | writing-harness-files | CX | `managing-work-items`, `skill-creator`, and `writing-harness-files` read in one step. It said it would check the work item instructions and then add the skill. | `project-setup` (not `writing-harness-files`). | Yes (opened instead) |
| 18 | ok that's approved, merge it | managing-work-items | CX | `merge-and-clean-up`. It said it would identify the approved pull request. | No skill; it read the project files and said the checkout has no Git remote, so nothing could be merged. | Yes (expected) |
| 21 | Update the security doc | filing-project-records | CX | `managing-work-items` first, `filing-project-records` in the same step. It said it would find the work item the document belongs to. | Right: `filing-project-records` first. | Yes (opened instead) |
| 28 | brain dump: ... put it all in as work items | managing-work-items | CX | `braindump`. It said it would play back what it heard and wait for a yes before creating work items. | Right: `managing-work-items`. | Yes (expected) |
| 41 | Write this up as a rule for agents | managing-project-memory | CX | `writing-harness-files`. It said it would check the rules and the harness-file procedure and add the rule. | Same. | Yes (expected) |
| 49 | Add a task to phase 2 of WI-31 | managing-work-items | CX | `project-setup` first, then `managing-work-items` and `using-notion-cli` in the same step. | Right: `managing-work-items` first. | Yes (expected) |
| 55 | the deploy result came back with two failures, update the records | sf-component-tracker | CX | `managing-work-items` first, then `sf-component-tracker` and `using-notion-cli` in the same step. | `managing-work-items` first, then `using-notion-cli`; `sf-component-tracker` not opened. | Yes (opened instead) |
| 59 | load this CSV of accounts into the dev sandbox | no skill | CX | `sf-data-change`, then `managing-work-items`. It said it would check the data-change instructions and prepare the load for the dev sandbox. | Right: no skill. | No |
| n4 | what did we do today | managing-project-memory (or no skill) | CX | `session-summary`. It searched the records for today's date. | `session-summary`, then `managing-work-items`. | Yes (expected) |
| n10 | where are we | managing-work-items (or managing-project-memory) | CX | No skill. It read Current State, work items, and decisions and answered. By the earlier record's expectation (no skill) this is right. | Right: `managing-work-items`, then `managing-project-memory`. | Yes (expected) |
| f3 | what did you change in this chat | session-summary | CX | `filechanges`. It said it would check the session's change record. | Same. | No |

Unclear picks that are not misses: Claude Code and Codex 43, 50, and n6 (a plain read of memory) opened no skill and read the files; the expectation accepts that. Codex 59 was wrong on the first run and right on the second, and it was wrong on both runs in the two earlier records; "dev sandbox" is not enough to keep `sf-data-change` away in every run.

## The merged skills

One run each (two for a miss), so these show a direction, not a rate.

| Skill | Requests that expect it | Claude Code, right first time | Codex, right first time | Notes |
| --- | --- | --- | --- | --- |
| `managing-work-items` | 12, 13, 14, 15, 16, 17, 18, 22, 28, 37, 38, 45, 47, 48, 49, 57, n1, n10 (18 requests) | 17 of 18 (miss: 18) | 14 of 18 (misses: 18, 28, 49, n10) | The requests that were steady Codex misses with two work item skills (12, 57) are right in both products. 18 ("ok that's approved, merge it") is a steady miss of every record; no run opened `managing-work-items`, because the request names no pull request or work item. |
| `managing-project-memory` | 39, 40, 41, 42, 43, 44, 50, 51, n2, n3, n4, n6, n7 (13 requests) | 8 of 13 (misses: 39, 40, 41, n4, n7) | 11 of 13 (misses: 41, n4) | Claude Code opened no skill for 40, 41, and n7 and asked a question or tried an edit it could not make; 39 went to `publish-docs`. 41 is a steady miss in both products, as in the earlier records (Codex opens `writing-harness-files`). |
| `filechanges` | f1, f2 | 2 of 2 | 2 of 2 | Both products open it for "what files did you change?" and "list the files you just changed". |
| `session-summary` (the neighbour) | 26, n5, f3, f4 (and n4, which expects `managing-project-memory`) | 3 of 4 (miss: f3) | 3 of 4 (miss: f3); and n4 went here in both | "What did you change in this chat" (f3) goes to `filechanges` in both products, in both runs. "What did we do today" (n4) goes to `session-summary` in both products, in both runs, as it did in the earlier record. |

Descriptions that look responsible for a miss (inferred from the wording and the sessions; no description was changed):

- **f3 ("what did you change in this chat")** opens `filechanges`, whose description says "which files the agent just changed, such as 'what files did you change?'". The request asks what the agent changed, which is the same question in other words. The expectation (`session-summary`) may be too strict: the sentence "what did you change" fits `filechanges` as well as the table row for `session-summary` ("what happened in this session"). Section 9 of `dev/SKILL-INDEX.md` says the same kind of request goes to `filechanges` when it asks for files and to `session-summary` when it asks for every request with its result.
- **Codex 09, 21, 55 and Claude Code 56** open `managing-work-items` first. Its description says "Finds and manages work items from idea to Done ... or changes project phases or project tasks", which names the work item in each request (the skill to add, the security document, WI-31).
- **Codex 49** opens `project-setup` first; the request asks to "Add a task to phase 2", and the `project-setup` description holds "changes the project's work or memory choice".
- **Claude Code 39, 40, 41, n7, 01, 09, 11, 21** are sessions that opened no skill or opened `publish-docs`. The sessions asked a question or reported what they could not do. A skill description was not what stopped them, as far as the sessions show; the candidate named above (the evaluate-the-owner's-request rule) is not proven.

## Not run, and limits

- Hindsight memory projects (no memory skill) and GitHub Issues projects were not tested; no scratch project has them.
- A second run only after a miss, never for a request that was right. A request that was right once can still miss on another run: 5 of Codex's 11 reruns and 2 of Claude Code's 13 reruns changed from wrong to right.
- The three probes of the 0.9.0 record (x19, x21, x41, requests with content added) were not run again; the task did not list them.
- No live Notion or Salesforce call. In project (b), agents could not read WI-31, so those sessions stopped at a question or at the skill's first step.
- Claude Code ran with Bash, Write, and Edit turned off, and Codex ran read-only, so no write could be seen. Several Claude Code sessions said they could not save for that reason; the first skill is still read from the first call.
- The test homes hold other skills (built-in and account skills, and the owner's `neon-postgres` and `hindsight-coding-agent` in Codex), so results include their competition. The owner's real set differs and is larger.
- Another session ran Claude Code evals in the same Claude Code test home at the same time. Those sessions use `--no-session-persistence` as well; no result here depends on them.
- The Codex desktop app and Windows were not covered.

## Test homes after the run

- Codex test home: added `toolkit@toolkit-v2-routing-0918` (the plugin), the marketplace `toolkit-v2-routing-0918`, the plugin's cache folder `plugins/cache/toolkit-v2-routing-0918/`, and the profile file `routing.config.toml`. All four were removed after the run, with `codex plugin remove`, `codex plugin marketplace remove`, `rmdir`, and `rm`. `config.toml` and `auth.json` have the same checksums as before the run. The old `toolkit-v2` marketplace and plugin entries were there before and stay. One folder appeared that this run did not add: `plugins/cache/openai-curated-remote/app-6a502589384081919c5decf93496c9d1` (Codex synced the owner's account plugins during the run). The runs used `--ephemeral`, so no Codex session files were saved. Codex rewrote its own database files (`*.sqlite-shm` and `*.sqlite-wal` came and went), as on any use.
- Claude Code test home: nothing was installed or changed by this run. `--no-session-persistence` left no session records. Claude Code rewrote its own bookkeeping files, as on any use.
- Neither test home was deleted. The owner's real `~/.claude` and `~/.codex` were not used or changed. The scratch projects and run folders were removed; the raw outputs and the scripts stay in the session's scratch folder (`.../scratchpad/live-tests/routing/`).
