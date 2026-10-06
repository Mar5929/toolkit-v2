# Routing check after the memory restore (TKV-24, 2026-10-05)

The question: after the memory restore, do the changed descriptions of `curating-project-memory`, `using-memory-store` (local and Notion), `session-summary`, `running-work-item-lifecycle`, `filing-project-records`, and the Notion `using-work-tracker` still send each request to the right skill? The method is the one in `skill-routing-0.9.0.md`; changes from it are listed under "How it ran".

Tested files: branch `claude/one-home-memory`, commit `7565ef09` (both plugin manifests say 0.9.0). The branch moved to `8443b0f5` during the test (another session). That move changed memory skill bodies and the starter `AGENTS.md` filing rows, and no description (checked with `git diff 7565ef09 HEAD`). The scratch projects were built from `7565ef09` files before the move, so the test used the text of that commit. Claude Code 2.1.289 with `--model sonnet` (`claude-sonnet-5-5`). Codex CLI 0.160.0 with `gpt-6-luna`. Nothing was edited to change a result: no skill, rule, hook, or description.

## Result

45 requests: 35 taken from the last record (every request whose expected skill, or whose wrong pick last time, was `curating-project-memory`, `using-memory-store`, `session-summary`, `handoff`, `running-work-item-lifecycle`, `filing-project-records`, or `using-work-tracker`) and 10 new ones (IDs n1 to n10). One run each, in a fresh session on a fresh copy of the scratch project. "Last run" is the first run of the last record (its second runs are not used, so the two are comparable).

| Product | The 35 old requests: right | wrong skill | no skill where one was expected | Last run, same 35: right | The 10 new requests: right | wrong skill |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code | 27 | 3 | 5 | 28 | 10 | 0 |
| Codex | 22 | 9 | 4 | 21 | 7 | 3 |

- Claude Code, old requests: 8 misses (15, 18, 19, 41, 43, 44, 50, 51). Four are new misses (43, 44, 50, 51: all about Current State or "what does memory point to"). Fixed since last run: 12, 21, 57. Same misses as before: 15, 18, 19, 41.
- Codex, old requests: 13 misses (12, 16, 18, 20, 21, 22, 28, 41, 43, 49, 51, 56, 59). New misses: 16, 20, 22, 43, 51. Fixed since last run: 04, 09, 11, 38, 47, 57. Same misses as before: 12, 18, 21, 28, 41, 49, 56, 59.
- "Wrong skill" counts a skill opened first that is not expected. When one command read several skills at once in Codex, the first named counts and the rest are listed as "then also" (as in the last record). A Codex session that opened no skill and a Claude Code session that opened no skill are "no skill".
- Two misses against an expectation that the redesign may have moved: 44 and 51 ("update Current State ..." / "update the Current state page ..."). Both were expected to open `using-memory-store` (the last record's expectation). The starter `AGENTS.md` "Which skill" row says "Reading or writing Current State" goes to `using-memory-store`, while the new description of `curating-project-memory` says it "keeps Current State current", and the spec for new request n7 ("update current state, the vendor call moved to Thursday") expects `curating-project-memory`. The two expectations cannot both hold for one kind of request. Both products opened `curating-project-memory` first for 51 (and then `using-memory-store`); Claude Code did the same for 44.

## How it ran

Same as `skill-routing-0.9.0.md`: the first `Skill` call in Claude Code's stream-json output, and the first read of a file inside a skill folder in Codex's `--json` events (the session is stopped at that moment, except request n8, which was let run to its end). Commands:

- Claude Code: `claude -p <request> --model sonnet --max-turns 4 --output-format stream-json --verbose --no-session-persistence --strict-mcp-config --disallowedTools Bash Write Edit NotebookEdit WebFetch WebSearch --plugin-dir <worktree>/plugins/toolkit --settings '{"enabledPlugins":{"toolkit@toolkit-v2":false}}'`, `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`, input closed.
- Codex: `codex -p routingmr exec --json --ephemeral -s read-only -c model=gpt-6-luna -c 'projects."<copy>".trust_level="trusted"' -C <copy> <request>`, `CODEX_HOME=~/.toolkit-v2-test-homes/codex`. The `toolkit` plugin was installed from a scratch marketplace (`toolkit-v2-routing-mr`, plugin path linked to the worktree) so its skills are `toolkit:project-setup`, `toolkit:choosing-outside-tools`, and `toolkit:writing-harness-files`. The test home's old copy (`toolkit@toolkit-v2`) was turned off with a profile file (`routingmr.config.toml`).
- Projects: (a) Acme Orders, local work items, local memory, not Salesforce, 13 project skills plus 3 plugin skills; (b) Northwind CRM, Notion work items, Notion memory, Salesforce, 17 project skills plus 3 plugin skills. Built by the same script as last time, from the worktree's files, with three work items (WI-003, WI-007, WI-012), a Current State written in the current five-part form, and one decided entry (DEC-001, date format) in project (a). Notion ids in (b) are made up; no Notion or Salesforce call was possible. Codex listed 21 skills in (a) and 25 in (b), no description cut, every description equal to its `SKILL.md` (checked by program).
- Changes from the last run: a fresh copy of the project per run (the last run reused one copy per project, with sessions that could not write); Current State in (a) uses the new template's five parts; the requests are the 35 plus 10 new ones; no second run after a miss.

## Requests and results

"Expected" is the skill named by the request list. "Last run" is the first run of `skill-routing-0.9.0.md`: "right", or the skill (or "no skill") it opened instead.

| ID | Project | Request | Expected | Claude Code | Last run (Claude Code) | Codex | Last run (Codex) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 04 | a | I want to move my work items out of local files and into Notion | project-setup | right: project-setup | right | right: project-setup | running-work-item-lifecycle |
| 09 | a | add a new skill to this project that makes slides for me | writing-harness-files | right: writing-harness-files | right | right: writing-harness-files | running-work-item-lifecycle |
| 11 | a | change the Codex rules file so git status never asks me again | writing-harness-files | right: writing-harness-files | right | right: writing-harness-files | curating-project-memory |
| 12 | a | Is WI-12 ready to test? | running-work-item-lifecycle | right: running-work-item-lifecycle | no skill | MISS: no skill | no skill |
| 13 | a | ok ship WI-12 | running-work-item-lifecycle | right: running-work-item-lifecycle | right | right: running-work-item-lifecycle | right |
| 14 | a | Add dark mode to the backlog for later. | running-work-item-lifecycle | right: running-work-item-lifecycle | right | right: running-work-item-lifecycle (then also using-work-tracker, curating-project-memory, using-memory-store) | right |
| 15 | a | Grill me on the checkout flow. | running-work-item-lifecycle | MISS: no skill | no skill | right: running-work-item-lifecycle | right |
| 16 | a | We decided to drop the export feature | running-work-item-lifecycle (or filing-project-records) | right: running-work-item-lifecycle | right | MISS: curating-project-memory | right |
| 17 | a | Close out WI-12 | running-work-item-lifecycle | right: running-work-item-lifecycle | right | right: running-work-item-lifecycle (then also using-work-tracker, curating-project-memory, using-memory-store) | right |
| 18 | a | ok that's approved, merge it | running-work-item-lifecycle | MISS: merge-and-clean-up | merge-and-clean-up | MISS: merge-and-clean-up | no skill |
| 19 | a | Save this transcript | filing-project-records | MISS: no skill | no skill | right: filing-project-records | right |
| 20 | a | the client just confirmed accounts can only be deactivated, never deleted, and every feature that touches accounts has to follow that | filing-project-records | right: filing-project-records | right | MISS: curating-project-memory (then also using-memory-store, filing-project-records) | right |
| 21 | a | Update the security doc | filing-project-records | right: filing-project-records | no skill | MISS: no skill | running-work-item-lifecycle |
| 22 | a | the export button should be blue, that is only for WI-3 | running-work-item-lifecycle | right: running-work-item-lifecycle | right | MISS: using-work-tracker (then also running-work-item-lifecycle) | right |
| 23 | a | I'm going to clear context. | handoff | right: handoff | right | right: handoff | right |
| 24 | a | write me a prompt so I can pick this up in a new chat | handoff | right: handoff | right | right: handoff | right |
| 25 | a | I'm done for the day, wrap everything up so I can start fresh tomorrow | handoff | right: handoff | right | right: handoff | right |
| 26 | a | give me a quick list of what I asked for in this chat and what is still open | session-summary | right: session-summary | right | right: session-summary | right |
| 28 | a | brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. put it all in as work items | running-work-item-lifecycle | right: running-work-item-lifecycle | right | MISS: braindump | no skill |
| 37 | a | Make WI-7 a sub-item of WI-3. | using-work-tracker | right: using-work-tracker | right | right: using-work-tracker (then also running-work-item-lifecycle) | right |
| 38 | a | show me what WI-3 says | using-work-tracker | right: using-work-tracker | right | right: using-work-tracker | no skill |
| 39 | a | Remember that the client's year starts in February | curating-project-memory | right: curating-project-memory | right | right: curating-project-memory (then also using-memory-store) | right |
| 40 | a | From now on, always run the tests before you ask me | curating-project-memory | right: curating-project-memory | right | right: curating-project-memory | right |
| 41 | a | Write this up as a rule for agents | curating-project-memory | MISS: no skill | no skill | MISS: no skill | no skill |
| 42 | a | forget what I told you about the old fiscal year | curating-project-memory | right: curating-project-memory | right | right: curating-project-memory | right |
| 43 | a | what does memory point to? | using-memory-store | MISS: no skill | right | MISS: no skill | right |
| 44 | a | update Current State: WI-12 is built and waiting on my testing | using-memory-store | MISS: curating-project-memory | right | right: using-memory-store (then also curating-project-memory) | right |
| 47 | b | show me WI-31 | using-work-tracker | right: using-work-tracker | right | right: using-work-tracker (then also using-memory-store, curating-project-memory) | using-notion-cli |
| 48 | b | which phases does the CRM project have? | using-work-tracker | right: using-work-tracker | right | right: using-work-tracker (then also using-notion-cli) | right |
| 49 | b | Add a task to phase 2 of WI-31 | running-work-item-lifecycle | right: running-work-item-lifecycle | right | MISS: using-work-tracker | using-work-tracker |
| 50 | b | what does memory point to? | using-memory-store | MISS: no skill | right | right: using-memory-store (then also using-notion-cli) | right |
| 51 | b | update the Current state page: WI-31 is waiting on UAT | using-memory-store | MISS: curating-project-memory | right | MISS: curating-project-memory (then also using-memory-store, using-notion-cli) | right |
| 56 | b | can the WI-31 changes go to the UAT sandbox? check that nothing extra goes with them | sf-deploy-check | right: sf-deploy-check | right | MISS: running-work-item-lifecycle (then also using-work-tracker, sf-deploy-check) | running-work-item-lifecycle |
| 57 | b | is WI-31 ready to test? | running-work-item-lifecycle | right: running-work-item-lifecycle | using-work-tracker | right: running-work-item-lifecycle (then also using-work-tracker, using-notion-cli) | using-work-tracker |
| 59 | b | load this CSV of accounts into the dev sandbox | no skill | right: no skill | right | MISS: sf-data-change | sf-data-change |
| n1 | a | the client said on the call they want the renewal date on the account page | running-work-item-lifecycle (or filing-project-records) | right: running-work-item-lifecycle | new | MISS: curating-project-memory (then also running-work-item-lifecycle, using-work-tracker, using-memory-store) | new |
| n2 | a | the nightly export failed again last night | curating-project-memory | right: curating-project-memory | new | right: curating-project-memory | new |
| n3 | a | remember that Dana covers for Luis until the 20th | curating-project-memory | right: curating-project-memory | new | right: curating-project-memory (then also using-memory-store) | new |
| n4 | a | what did we do today | curating-project-memory (or no skill) | right: curating-project-memory | new | MISS: session-summary | new |
| n5 | a | what did we do in this chat | session-summary | right: session-summary | new | right: session-summary | new |
| n6 | a | read current state | using-memory-store (or no skill) | right: no skill | new | right: no skill | new |
| n7 | a | update current state, the vendor call moved to Thursday | curating-project-memory | right: curating-project-memory | new | right: curating-project-memory (then also using-memory-store) | new |
| n8 | a | look at how the rollup fields on the account object work and tell me | no skill | right: no skill | new | right: no skill | new |
| n9 | a | we decided to keep the old approval flow for all regions | filing-project-records | right: filing-project-records | new | right: filing-project-records (then also curating-project-memory, using-memory-store) | new |
| n10 | a | where are we | no skill | right: no skill | new | MISS: using-work-tracker (then also using-memory-store) | new |

## The new requests (n1 to n10)

| ID | Request | Claude Code | Codex |
| --- | --- | --- | --- |
| n1 | the client said on the call they want the renewal date on the account page | `running-work-item-lifecycle` (then `using-work-tracker`) | `curating-project-memory` first, then in the same step `running-work-item-lifecycle`, `using-work-tracker`, `using-memory-store` (counted as a miss: first named was memory) |
| n2 | the nightly export failed again last night | `curating-project-memory` | `curating-project-memory` |
| n3 | remember that Dana covers for Luis until the 20th | `curating-project-memory` (then `using-memory-store`) | `curating-project-memory` (then `using-memory-store`) |
| n4 | what did we do today | `curating-project-memory` | `session-summary` (miss: it is for "this chat") |
| n5 | what did we do in this chat | `session-summary` | `session-summary` |
| n6 | read current state | no skill (read the file, answered) | no skill (read the file) |
| n7 | update current state, the vendor call moved to Thursday | `curating-project-memory` | `curating-project-memory` (then `using-memory-store`) |
| n8 | look at how the rollup fields on the account object work and tell me | no skill; wrote nothing: it found no account object in the project and said so | no skill; read the system records, then said it could not save the "current system analysis" because the workspace was read only (it knew the rule, but did not write) |
| n9 | we decided to keep the old approval flow for all regions | `filing-project-records` | `filing-project-records` (then `curating-project-memory`, `using-memory-store` in the same step) |
| n10 | where are we | no skill (read Current State, work items, answered) | `using-work-tracker` first (then `using-memory-store`): miss |

n8 note: the project has no Salesforce metadata, so neither agent had an analysis to write. Whether the `reference/current-system/` rule is followed when there is a result is not shown by this run; a run in a project with real system content is needed.

## Every wrong or unclear pick

| ID | Request | Expected | Picked | Product |
| --- | --- | --- | --- | --- |
| 15 | Grill me on the checkout flow. | `running-work-item-lifecycle` | no skill (read WI-012 and asked) | Claude Code |
| 18 | ok that's approved, merge it | `running-work-item-lifecycle` | `merge-and-clean-up` | both (as last run) |
| 19 | Save this transcript | `filing-project-records` | no skill (asked which transcript) | Claude Code (as last run) |
| 41 | Write this up as a rule for agents | `curating-project-memory` | no skill (asked what the rule says) | both (as last run) |
| 43 | what does memory point to? | `using-memory-store` | no skill (read `PROJECT.md` and Current State, answered) | both (new: right last time) |
| 44 | update Current State: WI-12 is built and waiting on my testing | `using-memory-store` | `curating-project-memory` (see the note on 44 and 51 above) | Claude Code (new) |
| 50 | what does memory point to? (Notion) | `using-memory-store` | no skill | Claude Code (new) |
| 51 | update the Current state page: WI-31 is waiting on UAT | `using-memory-store` | `curating-project-memory` (then `using-memory-store`, `using-notion-cli`) | both (new) |
| 12 | Is WI-12 ready to test? | `running-work-item-lifecycle` | no skill (read the item, answered) | Codex (as last run) |
| 16 | We decided to drop the export feature | `running-work-item-lifecycle` or `filing-project-records` | `curating-project-memory` | Codex (new: lifecycle last time) |
| 20 | the client just confirmed accounts can only be deactivated ... | `filing-project-records` | `curating-project-memory` first (then `using-memory-store`, `filing-project-records`) | Codex (new) |
| 21 | Update the security doc | `filing-project-records` | no skill (read `system/security-model.md`; last time `running-work-item-lifecycle`) | Codex |
| 22 | the export button should be blue, that is only for WI-3 | `running-work-item-lifecycle` | `using-work-tracker` (then `running-work-item-lifecycle`) | Codex (new) |
| 28 | brain dump: ... put it all in as work items | `running-work-item-lifecycle` | `braindump` | Codex (as last run) |
| 49 | Add a task to phase 2 of WI-31 (Notion) | `running-work-item-lifecycle` | `using-work-tracker` | Codex (as last run) |
| 56 | can the WI-31 changes go to the UAT sandbox? ... | `sf-deploy-check` | `running-work-item-lifecycle` (then `using-work-tracker`, `sf-deploy-check`) | Codex (as last run) |
| 59 | load this CSV of accounts into the dev sandbox | no skill | `sf-data-change` | Codex (as last run) |
| n1 | the client said on the call they want the renewal date on the account page | `running-work-item-lifecycle` or `filing-project-records` | `curating-project-memory` first, lifecycle in the same step | Codex |
| n4 | what did we do today | `curating-project-memory` or no skill | `session-summary` | Codex |
| n10 | where are we | no skill | `using-work-tracker` | Codex |

## Each changed description, from the counts

One run each, so "better" and "worse" show a direction, not a rate.

| Description | Claude Code | Codex |
| --- | --- | --- |
| `curating-project-memory` | Better. Its own requests (39, 40, 42, n2, n3, n4, n7) were all right, new ones included; 41 is the same steady miss. It now also takes 44 and 51 (see the note above). | Mixed. Its own requests (39, 40, 42, n2, n3, n7) were right and 41 is the same miss. It was opened first for 16, 20, n1, and 51, where another skill was expected, so it is worse as a neighbour. |
| `using-memory-store` (local) | Worse: 43 and 44 missed (right last time); n6 opened no skill, which was accepted. | Worse on 43 (no skill; right last time); 44 right. |
| `using-memory-store` (Notion) | Worse: 50 and 51 missed (right last time). | Same on 50 (right); worse on 51. |
| `session-summary` | Same: 26 and n5 right. | Same on 26 and n5; it took n4 ("what did we do today") from the memory skill. |
| `running-work-item-lifecycle` | Better: 12 and 57 are fixed ("ready for its next step"); 15 and 18 stay missed. Nine of the 11 old expected requests were right (seven last time). | Same: 5 of 11 right (6 last time); 57 fixed, 16 and 22 lost, 12, 18, 28, 49, 56 are the same misses. |
| `filing-project-records` | Better: 21 fixed, 20, n9 right; 19 stays missed (nothing was pasted). | Mixed: 19 and n9 right; 20 lost (memory was opened first); 21 still missed (last time the lifecycle skill, now no skill). |
| `using-work-tracker` (Notion) | Better: 47 and 48 right (47 was right last time too); 57 now goes to the lifecycle skill, not this one. | Better: 47 and 57 fixed; 49 is the same miss. |
| `handoff` (not changed here, a neighbour) | Same: 23 to 25 right. | Same: 23 to 25 right. |

## Not run, and limits

- Not run: a second run after a miss; project (b) requests other than 47, 48, 49, 50, 51, 56, 57, and 59; requests of the last record whose expected skill and wrong picks were all outside the seven skills.
- Claude Code ran with Bash, Write, and Edit turned off, and Codex ran read-only, so no write could be seen. "Where it would write" is read from what the agent said.
- No live Notion or Salesforce call. The copy of the project used the text of `7565ef09`, not the later commit (see the top).
- The test homes hold other skills (built-in and account skills), so results include their competition.

## Test homes after the run

- Codex test home: removed the plugin `toolkit@toolkit-v2-routing-mr`, the marketplace `toolkit-v2-routing-mr`, its empty cache folder, and the profile `routingmr.config.toml`. `config.toml` and `auth.json` have the same checksums as before the run. The old `toolkit-v2` marketplace and plugin entries were there before and stay.
- Claude Code test home: nothing installed or changed (`settings.json` identical to its saved copy). Both homes rewrote their own bookkeeping files, as on any use. Neither home was deleted. The owner's real `~/.claude` and `~/.codex` were not used.
