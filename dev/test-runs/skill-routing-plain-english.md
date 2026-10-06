# Routing check after the plain-English rewrite (TKV-24, 2026-10-06)

Fifteen skill descriptions were reworded: made-up words were replaced by plain ones ("original" became "source", "item" became "work item", "he" became "the owner", "chat" became "session"). No skill was added, removed, or renamed, and the "Which skill" table of the starter `AGENTS.md` kept every row. The question: does each product still open the right skill first? The method is the one in `skill-routing-0.9.0.md` and `skill-routing-memory-restore.md`; changes from it are listed under "How it ran".

Tested files: branch `claude/one-home-plain`, the working tree at commit `bd38bfe2` (both plugin manifests say 0.9.0). The branch moved to `67ed5060` during the test (another session); that commit changes only the `writing-harness-files` body and references, a repository guide, and a check tool, and no description (`git diff bd38bfe2 HEAD`). Claude Code 2.1.289 with `--model sonnet` (`claude-sonnet-5-5`). Codex CLI 0.160.0 with `gpt-6-luna`. Nothing was edited to change a result: no skill, rule, hook, instruction file, or description.

## Result

70 requests: the 60 of `skill-routing-0.9.0.md` (IDs 01 to 59 and 35b) and the 10 added in `skill-routing-memory-restore.md` (n1 to n10). One run each in a fresh session on a fresh copy of the scratch project. Misses were then run once more (a second run), as in the 0.9.0 record.

Two expectations changed since the 0.9.0 record: "update Current State ..." (requests 44 and 51) now expects `curating-project-memory`, and a plain read of memory (43, 50, n6) may pick `using-memory-store` or no skill. All counts below use the new expectations unless they say otherwise.

| Product | 60 old requests, right first time | 10 new requests, right first time | All 70, right first time | Wrong skill first | No skill where one was expected | Second run of the misses |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code | 56 | 9 | 65 | 1 (n4) | 4 (15, 18, 19, 41) | 0 of 5 changed |
| Codex | 48 | 8 | 56 | 13 (12, 18, 20, 23, 28, 41, 51, 53, 56, 57, 59, n1, n4) | 1 (19) | 7 of 14 changed to right (12, 19, 20, 23, 51, 53, 56) |

Compared with the earlier records (same requests):

| Comparison | Claude Code | Codex |
| --- | --- | --- |
| 0.9.0 record, 60 requests, right first time, its own expectations | 53 | 46 |
| Now, same 60 requests, with 44 and 51 expecting `using-memory-store` and 43 and 50 strict, as then | 52 | 46 |
| Now, same 60 requests, new expectations (the 0.9.0 picks scored the same way: 51 and 44) | 56 | 48 |
| 0.9.0 record, after the second run, its own expectations ("54 of 60" and "51 of 60") | 54 | 51 |
| Now, after the second run, new expectations | 56 | 55 |
| Memory-restore record, the 35 old requests, its own expectations | 27 | 22 |
| Now, the same 35, new expectations (the memory-restore picks scored the same way: 31 and 23) | 31 | 24 |
| Memory-restore record, the 10 new requests | 10 | 7 |
| Now, the 10 new requests | 9 | 8 |

- Claude Code gives the same verdict as the memory-restore run on every request except n4 ("what did we do today"), which now opens `session-summary` in both runs, where the memory-restore run opened `curating-project-memory`. The other four misses (15, 18, 19, 41) are steady misses of both earlier records, and in each the agent asked a question or read files without opening a skill. In 18 the pick changed from `merge-and-clean-up` to no skill; both are misses.
- Codex changed its verdict on 10 of the 45 requests it shared with the memory-restore run. Lost: 19, 23, 51, 57. Gained: 16, 21, 22, 44, 49, n10. Requests 44 and 51 swapped picks between the two memory skills, so they cancel. Request 53 was right in the 0.9.0 run and is lost now. Four of these five losses (19, 23, 51, 53) were right on the second run.
- Steady Codex misses (both runs wrong): 18, 28, 41, 57, 59, n1, n4. All seven were also wrong in at least one earlier record.
- Right in every earlier run and wrong now on the first run: Claude Code n4; Codex 19, 23, 53. Codex 19, 23, and 53 were right on the second run. Details under "Each changed description".
- Wrong in every earlier run and right now (first run): Codex 21, 44, 49, n10.
- Codex's skill list grew by about 380 characters in project (a) and 440 in project (b), because the new descriptions say "work item" and "the owner" in full (section "Codex skill list"). No description was cut.

## How it ran

The method is the one in `skill-routing-0.9.0.md`: the first `Skill` call in Claude Code's stream-json output, and the first command that reads a file under `skills/<name>/` in Codex's `--json` events (the session is stopped at that moment). When one Codex command reads several skills at once, the first named counts as first and the others are listed as "then also". A session that opens no skill is "no skill". Claude Code was allowed 4 turns; 15 of the 70 first-run sessions ended on that limit. The first skill is read from the first call, so this changes no result.

- Claude Code: `claude -p <request> --model sonnet --max-turns 4 --output-format stream-json --verbose --no-session-persistence --strict-mcp-config --disallowedTools Bash Write Edit NotebookEdit WebFetch WebSearch --plugin-dir <worktree>/plugins/toolkit --settings '{"enabledPlugins":{"toolkit@toolkit-v2":false}}'`, `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`, input closed. Claude Code listed 55 skills in each project (a) session and 59 in each project (b) session, as before.
- Codex: `codex -p routing exec --json --ephemeral -s read-only -c model=gpt-6-luna -c 'projects."<copy>".trust_level="trusted"' -C <copy> <request>`, `CODEX_HOME=~/.toolkit-v2-test-homes/codex`. The `toolkit` plugin was installed from a scratch marketplace (`toolkit-v2-routing-plain`, plugin path linked to the worktree), so its skills are `toolkit:project-setup`, `toolkit:choosing-outside-tools`, and `toolkit:writing-harness-files`. The test home's old copy (`toolkit@toolkit-v2`) was turned off with a profile file (`routing.config.toml`). Codex hooks were not trusted, so they did not run.
- Projects: (a) Acme Orders, local work items, local memory, not Salesforce: 13 project skills and 3 plugin skills. (b) Northwind CRM, Notion work items, Notion memory, Salesforce: 17 project skills and 3 plugin skills. Both were built from the worktree's files by the same script as in the 0.9.0 record (the folders `every-project`, then one per choice, with the name and "Toolkit settings" filled and the settings merged). Project (a) holds three work items (WI-003, WI-007, WI-012), a Current State in the five-part form, and one decided entry (DEC-001, date format). The Notion ids in (b) are made up. `node .claude/hooks/validate-records.mjs --all` printed nothing in both. No Notion or Salesforce call was possible.
- Every session ran in its own copy of the finished project (`cp -R` of the scratch project), removed afterwards. Sessions ran 5 at a time, Claude Code first, then Codex.
- Three Codex sessions (requests 44, 49, 58) ended with "Selected model is at capacity". That is a service error, not a result, so they were run again and the new runs are in the table. The first attempts are not counted.

## Table of every request

"Expected" is the skill the "Which skill" table of the starter `AGENTS.md`, the review, or the memory-restore record names. Each cell is the first skill the session opened; "(then also ...)" lists skills read in the same step or later. When the first run missed, the cell shows both runs.

| ID | Project | Request | Expected | Claude Code | Codex |
| --- | --- | --- | --- | --- | --- |
| 01 | a | toolkit v2 | project-setup | right: project-setup | right: project-setup |
| 02 | a | check the setup | project-setup | right: project-setup | right: project-setup |
| 03 | a | update the toolkit | project-setup | right: project-setup | right: project-setup |
| 04 | a | I want to move my work items out of local files and into Notion | project-setup | right: project-setup | right: project-setup (then also using-work-tracker) |
| 05 | a | bring this repo up to date with GitHub | pull-latest | right: pull-latest | right: pull-latest |
| 06 | a | make an explainer video about how a pull request gets merged | choosing-outside-tools | right: choosing-outside-tools | right: choosing-outside-tools |
| 07 | a | what do I use for explainer videos? | choosing-outside-tools | right: choosing-outside-tools | right: choosing-outside-tools |
| 08 | a | add this to my tool list: https://github.com/csthink/dashmotion for animated flowcharts | choosing-outside-tools | right: choosing-outside-tools | right: choosing-outside-tools |
| 09 | a | add a new skill to this project that makes slides for me | writing-harness-files | right: writing-harness-files | right: writing-harness-files (then also running-work-item-lifecycle) |
| 10 | a | write a hook that stops you from ever running git push --force | writing-harness-files | right: writing-harness-files | right: writing-harness-files |
| 11 | a | change the Codex rules file so git status never asks me again | writing-harness-files | right: writing-harness-files | right: writing-harness-files |
| 12 | a | Is WI-12 ready to test? | running-work-item-lifecycle | right: running-work-item-lifecycle | 1st: MISS: using-work-tracker (then also running-work-item-lifecycle)<br>2nd: right: running-work-item-lifecycle |
| 13 | a | ok ship WI-12 | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 14 | a | Add dark mode to the backlog for later. | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle (then also using-work-tracker, curating-project-memory, using-memory-store) |
| 15 | a | Grill me on the checkout flow. | running-work-item-lifecycle | 1st: MISS: no skill<br>2nd: MISS: no skill | right: running-work-item-lifecycle |
| 16 | a | We decided to drop the export feature | running-work-item-lifecycle (or filing-project-records) | right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 17 | a | Close out WI-12 | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 18 | a | ok that's approved, merge it | running-work-item-lifecycle | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: merge-and-clean-up<br>2nd: MISS: merge-and-clean-up |
| 19 | a | Save this transcript | filing-project-records | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: no skill<br>2nd: right: filing-project-records |
| 20 | a | the client just confirmed accounts can only be deactivated, never deleted, and every feature that touches accounts has to follow that | filing-project-records | right: filing-project-records | 1st: MISS: curating-project-memory (then also using-memory-store)<br>2nd: right: filing-project-records (then also curating-project-memory) |
| 21 | a | Update the security doc | filing-project-records | right: filing-project-records | right: filing-project-records |
| 22 | a | the export button should be blue, that is only for WI-3 | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle (then also using-work-tracker) |
| 23 | a | I'm going to clear context. | handoff | right: handoff | 1st: MISS: curating-project-memory (then also using-memory-store)<br>2nd: right: handoff |
| 24 | a | write me a prompt so I can pick this up in a new chat | handoff | right: handoff | right: handoff |
| 25 | a | I'm done for the day, wrap everything up so I can start fresh tomorrow | handoff | right: handoff | right: handoff |
| 26 | a | give me a quick list of what I asked for in this chat and what is still open | session-summary | right: session-summary | right: session-summary |
| 27 | a | ok brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. don't do anything, just tell me what you heard | braindump | right: braindump | right: braindump |
| 28 | a | brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. put it all in as work items | running-work-item-lifecycle | right: running-work-item-lifecycle | 1st: MISS: braindump (then also running-work-item-lifecycle, using-work-tracker)<br>2nd: MISS: braindump |
| 29 | a | I don't get it, say that simpler | explain-simply | right: explain-simply | right: explain-simply |
| 30 | a | what is the sources folder for? | no skill | right: no skill | right: no skill |
| 31 | a | get the latest | pull-latest | right: pull-latest | right: pull-latest |
| 32 | a | my local copy is a mess, make it exactly like GitHub and throw the rest away | reset-to-remote | right: reset-to-remote | right: reset-to-remote |
| 33 | a | undo my last commit, I didn't mean to make it | no skill | right: no skill | right: no skill |
| 34 | a | Merge PR 14 and clean up. | merge-and-clean-up | right: merge-and-clean-up | right: merge-and-clean-up |
| 35 | a | that change to PROJECT.md looks right, commit it straight to main | publish-docs | right: publish-docs | right: publish-docs |
| 35b | a | PR 22 passed review, merge it and delete the branch | merge-and-clean-up | right: merge-and-clean-up | right: merge-and-clean-up |
| 36 | a | fix the typo in the README | no skill (or publish-docs) | right: no skill | right: no skill |
| 37 | a | Make WI-7 a sub-item of WI-3. | using-work-tracker | right: using-work-tracker | right: using-work-tracker |
| 38 | a | show me what WI-3 says | using-work-tracker | right: using-work-tracker | right: using-work-tracker |
| 39 | a | Remember that the client's year starts in February | curating-project-memory | right: curating-project-memory | right: curating-project-memory |
| 40 | a | From now on, always run the tests before you ask me | curating-project-memory | right: curating-project-memory | right: curating-project-memory (then also writing-harness-files) |
| 41 | a | Write this up as a rule for agents | curating-project-memory | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: writing-harness-files<br>2nd: MISS: writing-harness-files |
| 42 | a | forget what I told you about the old fiscal year | curating-project-memory | right: curating-project-memory | right: curating-project-memory (then also using-memory-store) |
| 43 | a | what does memory point to? | using-memory-store (or no skill) | right: no skill | right: no skill |
| 44 | a | update Current State: WI-12 is built and waiting on my testing | curating-project-memory | right: curating-project-memory | right: curating-project-memory (then also using-memory-store, running-work-item-lifecycle) |
| 45 | a | Where are we? | no skill | right: no skill | right: no skill |
| 46 | a | What did we decide about the date format? | no skill | right: no skill | right: no skill |
| 47 | b | show me WI-31 | using-work-tracker | right: using-work-tracker | right: using-work-tracker |
| 48 | b | which phases does the CRM project have? | using-work-tracker | right: using-work-tracker | right: using-work-tracker (then also using-notion-cli) |
| 49 | b | Add a task to phase 2 of WI-31 | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle (then also using-work-tracker, using-notion-cli) |
| 50 | b | what does memory point to? | using-memory-store (or no skill) | right: no skill | right: no skill |
| 51 | b | update the Current state page: WI-31 is waiting on UAT | curating-project-memory | right: curating-project-memory | 1st: MISS: using-memory-store (then also using-notion-cli)<br>2nd: right: curating-project-memory (then also using-memory-store, using-notion-cli) |
| 52 | b | ntn says I'm not signed in, fix it | using-notion-cli | right: using-notion-cli | right: using-notion-cli |
| 53 | b | a Notion call came back 404 on the Memories database | using-notion-cli | right: using-notion-cli | 1st: MISS: curating-project-memory (then also using-memory-store, using-notion-cli)<br>2nd: right: using-notion-cli (then also curating-project-memory, using-memory-store) |
| 54 | b | I added Account.Region__c as a new custom field, keep the tracker up to date | sf-component-tracker | right: sf-component-tracker | right: sf-component-tracker |
| 55 | b | the deploy result came back with two failures, update the records | sf-component-tracker | right: sf-component-tracker | right: sf-component-tracker |
| 56 | b | can the WI-31 changes go to the UAT sandbox? check that nothing extra goes with them | sf-deploy-check | right: sf-deploy-check | 1st: MISS: running-work-item-lifecycle<br>2nd: right: sf-deploy-check (then also sf-component-tracker, running-work-item-lifecycle, using-work-tracker) |
| 57 | b | is WI-31 ready to test? | running-work-item-lifecycle | right: running-work-item-lifecycle | 1st: MISS: using-work-tracker (then also running-work-item-lifecycle, using-notion-cli)<br>2nd: MISS: using-work-tracker |
| 58 | b | load this CSV of accounts into production | sf-data-change | right: sf-data-change | right: sf-data-change |
| 59 | b | load this CSV of accounts into the dev sandbox | no skill | right: no skill | 1st: MISS: sf-data-change<br>2nd: MISS: sf-data-change |
| n1 | a | the client said on the call they want the renewal date on the account page | running-work-item-lifecycle (or filing-project-records) | right: running-work-item-lifecycle | 1st: MISS: curating-project-memory (then also filing-project-records, running-work-item-lifecycle)<br>2nd: MISS: using-memory-store |
| n2 | a | the nightly export failed again last night | curating-project-memory | right: curating-project-memory | right: curating-project-memory (then also using-memory-store, running-work-item-lifecycle, using-work-tracker) |
| n3 | a | remember that Dana covers for Luis until the 20th | curating-project-memory | right: curating-project-memory | right: curating-project-memory |
| n4 | a | what did we do today | curating-project-memory (or no skill) | 1st: MISS: session-summary<br>2nd: MISS: session-summary | 1st: MISS: session-summary<br>2nd: MISS: session-summary |
| n5 | a | what did we do in this chat | session-summary | right: session-summary | right: session-summary |
| n6 | a | read current state | using-memory-store (or no skill) | right: no skill | right: no skill |
| n7 | a | update current state, the vendor call moved to Thursday | curating-project-memory | right: curating-project-memory | right: curating-project-memory (then also using-memory-store) |
| n8 | a | look at how the rollup fields on the account object work and tell me | no skill | right: no skill | right: no skill |
| n9 | a | we decided to keep the old approval flow for all regions | filing-project-records | right: filing-project-records | right: filing-project-records |
| n10 | a | where are we | no skill | right: no skill | right: no skill |

## Every wrong or unclear pick

First-run picks. "Earlier" gives the first skill opened for the same request in `skill-routing-0.9.0.md` (first run) and `skill-routing-memory-restore.md`. Where an earlier pick equals the expected skill, it is named the same way. Requests 44 and 51 changed expectation (see "Result"). "2nd run" is the second run of this test.

| ID | Request | Expected | Picked | Product | Earlier | Second run |
| --- | --- | --- | --- | --- | --- | --- |
| 15 | Grill me on the checkout flow. | running-work-item-lifecycle | no skill | Claude Code | 0.9.0: no skill; memory restore: no skill | 2nd run: no skill |
| 18 | ok that's approved, merge it | running-work-item-lifecycle | no skill | Claude Code | 0.9.0: merge-and-clean-up; memory restore: merge-and-clean-up | 2nd run: no skill |
| 19 | Save this transcript | filing-project-records | no skill | Claude Code | 0.9.0: no skill; memory restore: no skill | 2nd run: no skill |
| 41 | Write this up as a rule for agents | curating-project-memory | no skill | Claude Code | 0.9.0: no skill; memory restore: no skill | 2nd run: no skill |
| n4 | what did we do today | curating-project-memory (or none) | session-summary | Claude Code | memory restore: curating-project-memory | 2nd run: session-summary |
| 12 | Is WI-12 ready to test? | running-work-item-lifecycle | using-work-tracker (then also running-work-item-lifecycle) | Codex | 0.9.0: no skill; memory restore: no skill | 2nd run: right |
| 18 | ok that's approved, merge it | running-work-item-lifecycle | merge-and-clean-up | Codex | 0.9.0: no skill; memory restore: merge-and-clean-up | 2nd run: merge-and-clean-up |
| 19 | Save this transcript | filing-project-records | no skill | Codex | 0.9.0: filing-project-records; memory restore: filing-project-records | 2nd run: right |
| 20 | the client just confirmed accounts can only be deactivated, never deleted, and e | filing-project-records | curating-project-memory (then also using-memory-store) | Codex | 0.9.0: filing-project-records; memory restore: curating-project-memory | 2nd run: right |
| 23 | I'm going to clear context. | handoff | curating-project-memory (then also using-memory-store) | Codex | 0.9.0: handoff; memory restore: handoff | 2nd run: right |
| 28 | brain dump: sales wants order export, discounts are wrong somewhere, maybe a sec | running-work-item-lifecycle | braindump (then also running-work-item-lifecycle, using-work-tracker) | Codex | 0.9.0: no skill; memory restore: braindump | 2nd run: braindump |
| 41 | Write this up as a rule for agents | curating-project-memory | writing-harness-files | Codex | 0.9.0: no skill; memory restore: no skill | 2nd run: writing-harness-files |
| 51 | update the Current state page: WI-31 is waiting on UAT | curating-project-memory | using-memory-store (then also using-notion-cli) | Codex | 0.9.0: using-memory-store; memory restore: curating-project-memory | 2nd run: right |
| 53 | a Notion call came back 404 on the Memories database | using-notion-cli | curating-project-memory (then also using-memory-store, using-notion-cli) | Codex | 0.9.0: using-notion-cli | 2nd run: right |
| 56 | can the WI-31 changes go to the UAT sandbox? check that nothing extra goes with  | sf-deploy-check | running-work-item-lifecycle | Codex | 0.9.0: running-work-item-lifecycle; memory restore: running-work-item-lifecycle | 2nd run: right |
| 57 | is WI-31 ready to test? | running-work-item-lifecycle | using-work-tracker (then also running-work-item-lifecycle, using-notion-cli) | Codex | 0.9.0: using-work-tracker; memory restore: running-work-item-lifecycle | 2nd run: using-work-tracker |
| 59 | load this CSV of accounts into the dev sandbox | none | sf-data-change | Codex | 0.9.0: sf-data-change; memory restore: sf-data-change | 2nd run: sf-data-change |
| n1 | the client said on the call they want the renewal date on the account page | running-work-item-lifecycle (or filing-project-records) | curating-project-memory (then also filing-project-records, running-work-item-lifecycle) | Codex | memory restore: curating-project-memory | 2nd run: using-memory-store |
| n4 | what did we do today | curating-project-memory (or none) | session-summary | Codex | memory restore: session-summary | 2nd run: session-summary |

Unclear: Codex 43, 50, and n6 (a plain read of memory) and Claude Code 43, 50, and n6 opened no skill and read the files; the new expectation accepts that. Codex 59 expects no skill and opened `sf-data-change` in the first run of all three records: "dev sandbox" is not enough to keep it out. Claude Code n4 is a judgment call: `session-summary` answered "nothing has been done in this chat yet".

## Each changed description

"Better", "same", or "worse" compares this run with the earlier runs for the same requests (the memory-restore run where there is one, else the 0.9.0 run), by the verdict of each request under the new expectations. Requests used: the ones that expect the skill, and its near misses. One run each (two for a miss), so "better" and "worse" show a direction, not a rate. Seven of Codex's 14 missed requests were right on the second run, so a single Codex change of one request is within the run-to-run variation.

| Description | Requests | Claude Code | Codex |
| --- | --- | --- | --- |
| `running-work-item-lifecycle` | 12 13 14 15 16 17 18 22 28 49 57 n1 | Same (10 of 12 right then and now; 15 and 18 steady misses). | Better (7 of 12, was 5): 16, 22, and 49 are now right; 57 is lost. See below. |
| `filing-project-records` | 19 20 21 n9 | Same (3 of 4; 19 is a steady miss). | Same (2 of 4): 21 is now right; 19 is lost on the first run (right on the second); 20 was wrong in the memory-restore run too. See below. |
| `handoff` | 23 24 25 | Same (3 of 3). | Worse on one run: 23 first opened `curating-project-memory` (right on the second run); 24 and 25 right. See below. |
| `braindump` | 27 28 | Same: 27 right; 28 right in Claude Code. | Same: 27 right; 28 opens `braindump`, as in the memory-restore run. |
| `explain-simply` | 29 30 | Same (2 of 2). | Same (2 of 2). |
| `session-summary` | 26 n5 n4 | Same on 26 and n5; it now takes n4 from `curating-project-memory` (see below). | Same on all three (it took n4 in the memory-restore run too). |
| `reset-to-remote` | 32 33 | Same (2 of 2). | Same (2 of 2). |
| `publish-docs` | 35 36 | Same (2 of 2). | Same (2 of 2). |
| `using-work-tracker` (local) | 37 38 | Same (2 of 2). | Same (2 of 2). |
| `using-work-tracker` (Notion) | 47 48 49 57 | Same (4 of 4). | Same (3 of 4): 49 is right now, 57 is wrong (see below). |
| `using-work-tracker` (GitHub) | none | Not run: the test has no GitHub project. | Not run. |
| `curating-project-memory` | 39 40 41 42 44 51 n2 n3 n7 n4 | 8 of 10 on its own requests (was 9): n4 moved to `session-summary` (see below); 41 is a steady miss. Otherwise same. | Same count (7 of 10). Opened first for 23, 53 (and 20 and n1, as before) where another skill was expected: worse as a neighbour. |
| `using-memory-store` (local) | 43 n6 | Same (both read the files and opened no skill, which is accepted). | Same. |
| `using-memory-store` (Notion) | 50 | Same (no skill, accepted). | Same. It was opened first for 51, where `curating-project-memory` is now expected (the request has swapped between the two memory skills from one run to the next). |
| `using-notion-cli` | 52 53 | Same (2 of 2). | Worse on one run: 53 first opened `curating-project-memory` (right on the second run); 52 right. |

Right before, wrong now, with the words in the new description that most likely caused it (inferred from the wording and the sessions; no description was changed):

- **Codex 57** ("is WI-31 ready to test?", Notion): first opened `using-work-tracker` in both runs. Right in the memory-restore run, wrong in the 0.9.0 run. The Notion `using-work-tracker` now says "Use when a work item, phase, task, or question must be read, saved, or searched, such as "show me WI-31"". The request names a work item, and the lifecycle description's "asks whether one is ready for its next step" no longer repeats the words "work item" in that clause. Codex 12 ("Is WI-12 ready to test?") did the same on its first run and was right on the second.
- **Codex 23** ("I'm going to clear context."): first opened `curating-project-memory` (then `using-memory-store`), right on the second run. Both the `handoff` description ("Updates this session's work items and the project's Current State") and the `curating-project-memory` description ("updates the project's Current State") now name the project's Current State. The agent's reply said it would prepare a handoff.
- **Codex 53** ("a Notion call came back 404 on the Memories database"): first opened `curating-project-memory`, right on the second run. `using-notion-cli` now says "for the skills that store work items and memory in Notion", which puts "memory" next to Notion; the request says "Memories".
- **Codex 19** ("Save this transcript"): opened no skill file on the first run (it read the project's filing files, said it saw no transcript, and still described filing it); right on the second run. `filing-project-records` says "Use when the owner hands over a source, such as a transcript", and nothing was handed over. The same words are in Claude Code's two runs, which opened no skill and asked which transcript, as in both earlier records.
- **Claude Code n4** ("what did we do today"): `session-summary` in both runs, where the memory-restore run opened `curating-project-memory`. `session-summary` now says "Use when the owner asks what happened in this session". In a fresh session that is the only thing "today" can be about, and the memory skill's description never mentions a recap.
- **Codex 51** is not a loss: its pick is the same as in the 0.9.0 run (`using-memory-store`, then `using-notion-cli`) and different from the memory-restore run (`curating-project-memory`); the expectation moved. `curating-project-memory` was first on the second run.

No change is recommended from this one run. The two requests that stay wrong in Codex because of the neighbour pairs (57 and 12: `using-work-tracker` against `running-work-item-lifecycle`; 59: `sf-data-change` for a sandbox) were wrong in earlier records too.

## Codex skill list

Seen with `codex debug prompt-input` in each project, with the same flags as the runs:

| Project | Skills in the list | Size of the "Skills" section | Last record | Descriptions cut? |
| --- | --- | --- | --- | --- |
| (a) | 21 (13 project, 3 plugin, 4 Codex built-in, 1 owner skill) | 10,452 characters, about 2,610 tokens (characters divided by 4: inferred) | 10,076 | No |
| (b) | 25 (17 project, 3 plugin, 4 built-in, 1 owner skill) | 12,275 characters, about 3,070 tokens (inferred) | 11,838 | No |

Every project and plugin description in the list equals the text of its `SKILL.md` word for word (checked by program, 0 differences in both projects). The default limit is 2% of the model's context window, 5,440 tokens for the 272,000-token window in the test home's model list, so the list is under it. The new wording added 376 characters in (a) and 437 in (b) (about 100 tokens). Claude Code's skill list was not checked for cuts.

## Not run, and limits

- The `using-work-tracker` description for GitHub projects was not tested: no scratch project tracks work in GitHub. Neither were the Hindsight memory projects (they have no memory skill).
- A second run only after a miss, never for a request that was right. A request that was right once can still miss on another run (7 of Codex's 14 reruns changed from wrong to right).
- The three probes of the 0.9.0 record (x19, x21, x41, the vague requests with content added) were not run again; the task did not list them.
- No live Notion or Salesforce call. In project (b), agents could not read WI-31, so those sessions stopped at a question or at the skill's first step.
- Claude Code ran with Bash, Write, and Edit turned off, and Codex ran read-only, so no write could be seen. Codex hooks did not run (not trusted); Claude Code's hooks did.
- Claude Code loaded the plugin live from the worktree, which moved to `67ed5060` during the run; that commit changes no description, but it did change the `writing-harness-files` body. Codex ran from a copy of the plugin installed at the start.
- The test homes hold other skills (built-in and account skills), so results include their competition. The owner's real set differs and is larger.
- Three Codex sessions failed with a service error ("Selected model is at capacity") and were run again (see "How it ran").
- The Codex desktop app and Windows were not covered.

## Test homes after the run

- Codex test home: removed the plugin `toolkit@toolkit-v2-routing-plain`, the marketplace `toolkit-v2-routing-plain`, its empty cache folder, and the profile `routing.config.toml`. `config.toml` and `auth.json` have the same checksums as before the run, and the folder lists under `plugins/` and `skills/` are the same as before. The old `toolkit-v2` marketplace and plugin entries were there before and stay.
- Claude Code test home: nothing installed or changed (`settings.json` has the same checksum as before). `--no-session-persistence` left no session records. Both products rewrote their own bookkeeping files, as on any use.
- Neither test home was deleted. The owner's real `~/.claude` and `~/.codex` were not used or changed. The scratch projects and run folders were removed.
