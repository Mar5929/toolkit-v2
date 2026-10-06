# Routing check for the one-home layout (0.9.0 branch, TKV-24, 2026-10-05)

Five project skills were renamed, most descriptions were rewritten, and a third skill (`writing-harness-files`) joined the `toolkit` plugin. The question: does each product open the right skill first, for the owner's kind of request?

Commit tested: `6ff85ccf` on `claude/one-home-layout`. The branch moved to `ce4ec05b` during the test; that commit adds one file under `dev/reviews/` and changes nothing that ships. Both plugin manifests say version 0.8.16 (the release number 0.9.0 is not raised yet). Claude Code 2.1.289 with model `claude-sonnet-5-5` (`--model sonnet`). Codex CLI 0.160.0 with model `gpt-6-luna` (the small model in the test home's model list). Nothing in this record was changed to make a result pass: no skill, rule, tool, or description was edited.

## Result

Counts for the 60 requests in the table. "Right on the 2nd run" means the first run missed and the second run was right. "Steady miss" means both runs missed.

| Product | Requests run | Right first time | Right on the 2nd run | Steady misses |
| --- | --- | --- | --- | --- |
| Claude Code | 60 | 53 | 1 (request 15) | 6 (12, 18, 19, 21, 41, 57) |
| Codex | 60 | 46 | 5 (11, 12, 38, 47, 56) | 9 (04, 09, 18, 21, 28, 41, 49, 57, 59) |

- Codex did not cut the skill list short in either project (section "Codex skill list").
- Four steady misses are shared by both products: 18, 21, 41, and 57. Request 12 missed on the first run in both products. Most misses are requests where two skills fit the words, or where the request holds nothing to act on.
- A "miss" includes a session that opened no skill when the table expected one. In those sessions the agent read the project files and answered directly, or asked a question.
- Three extra probes (not counted in the 60) show that 19 and 21 work in Claude Code once the request holds content, and that "rule for agents" goes to `writing-harness-files`, not `curating-project-memory`, in both products ("Probes").

## How it ran

The method is the one in `skill-routing-0.8.9.md`, with the changes listed under "Changes from the earlier method".

- Each request ran once as a fresh session in a fresh scratch Git repository, with its input closed (`< /dev/null`). Sessions ran 4 to 5 at a time.
- **First skill in Claude Code**: the first `Skill` tool call in the session's stream-json output. Seen in the output.
- **First skill in Codex**: the first command that reads a file inside a skill folder (a path with `skills/<name>/`), read from the `--json` events. A session was stopped at that moment. When one command reads several skills (`cat a/SKILL.md b/SKILL.md`), the first one named in the command text counts as first, and the others are listed as "then also". "No skill" in Codex means no skill file was read in the whole turn. Codex agents sometimes say they will follow a skill without reading its file (request 28 below); those are inferred, and counted as "no skill".
- **Claude Code command**: `claude -p <request> --model sonnet --max-turns 4 --output-format stream-json --verbose --no-session-persistence --strict-mcp-config --disallowedTools Bash Write Edit NotebookEdit WebFetch WebSearch --plugin-dir <worktree>/plugins/toolkit --settings '{"enabledPlugins":{"toolkit@toolkit-v2":false}}'`, with `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. The plugin loads from the worktree for the session only, and the test home's old copy (0.4.9) is turned off for the session only. No MCP server was loaded. Claude Code listed 55 skills in each session in project (a) and 59 in project (b): the project's, the 3 plugin skills, and the test home's own built-in and account skills.
- **Codex command**: `codex -p routing exec --json --ephemeral -s read-only -c model=gpt-6-luna -c 'projects."<project>".trust_level="trusted"' -C <project> <request>`, with `CODEX_HOME=~/.toolkit-v2-test-homes/codex`. The project is trusted for the run only, as in the earlier records, so the project's `.codex/config.toml` is read. Codex hooks were not trusted, so they did not run (Claude Code's hooks did run).
- **Plugin install**: Codex: a scratch marketplace folder (`toolkit-v2-routing`) whose plugin path links to `<worktree>/plugins/toolkit`, added with `codex plugin marketplace add` and `codex plugin add toolkit@toolkit-v2-routing`, so the three skills appear as `toolkit:project-setup`, `toolkit:choosing-outside-tools`, and `toolkit:writing-harness-files`, as in real use. The installed 0.4.9 copy was turned off with a profile file (`routing.config.toml`, used with `-p routing`), because a `-c` override did not turn it off in the earlier records. Claude Code: `--plugin-dir`, nothing installed.
- A set of the owner's own skills outside the test home still loads in Codex: `~/.agents/skills` held one skill (`neon-postgres`), and Codex also lists its own four built-in skills (`imagegen`, `openai-docs`, `skill-creator`, `skill-installer`). They were in every Codex session, as they are in the owner's real use.
- Codex agents often tried paths such as `~/.claude/skills/<name>/SKILL.md` first, then the right path. These were reads only.

### Changes from the earlier method

- The project is not an empty folder. It is a finished Toolkit V2 project built from the branch by the setup steps (see "The two projects").
- Codex: the skill folders are not linked into the test home's `skills/` folder. The plugin is installed from a scratch marketplace instead, so the plugin skills keep their `toolkit:` names. The plugin had two skills in 0.8.9; it has three now.
- Codex detection reads any file in a skill's folder, not only `SKILL.md`. A first pass counted only `SKILL.md`, and it missed a session that read `references/update.md` of `project-setup` first.
- Claude Code: `--no-session-persistence` and `--strict-mcp-config` were added so the runs leave no session record and reach no connector. The earlier record showed that a Codex run could act on a connected app, so no request in this list can be done by a connector (the earlier prompt "add this to my to-do list: buy milk" was left out for that reason).

## The two projects

Built by a script that follows `references/setup-copy.md`, `skills-hooks-settings.md`, and `placing-files.md` (the folder copy, the name and "Toolkit settings" filled, the settings snippets merged, the files placed, the `.agents/skills` link, `core.hooksPath` set to `.githooks`, one commit). `node .claude/hooks/validate-records.mjs --all` printed nothing in both.

| Project | Choices | Skills | Notes |
| --- | --- | --- | --- |
| (a) Acme Orders | Local work items, local memory, not Salesforce | 13 (10 shared, `using-work-tracker`, `curating-project-memory`, `using-memory-store`) + 3 plugin skills = 16 | Three real work items (WI-003, WI-007, WI-012), a filled Current State, and one decided entry in `DECISIONS.md`, so a request naming an item has something to find. A first pass ran on the bare project and was thrown away (see "Not counted"). |
| (b) Northwind CRM | Notion work items, Notion memory, Salesforce | 17 (10 shared, `using-work-tracker`, `curating-project-memory`, `using-memory-store`, `using-notion-cli`, the 3 `sf-*`) + 3 plugin skills = 20 | The Notion ids in "Toolkit settings" are made up. No Notion or Salesforce call was made or possible (no connector, no `ntn`, no `sf`). |

## The requests

60 requests. Source: E = from an earlier routing record, R = from the review "Ten requests that sit between two skills", F = fresh. Every skill a project can have and every plugin skill has at least one request expected to choose it and one near miss that should go to its neighbour (a near miss is listed under the neighbour it should choose).

Earlier requests that were not kept, because 60 is the limit (where a kept request covers the same skill, it is named): the folder variants of "toolkit v2" in `skill-routing-0.8.3.md` (they test the project state, not the skill), "move this project to toolkit v2", "initialize this project", "I got a new laptop, check the setup" (kept: "check the setup"), "Remember that I prefer short commit messages" and "From now on, use tables in status" (kept: review requests 39 and 40), "Clean up memory.", "Keep going", "Change R-02 so only admins can export", "How should we build the CSV export?", "What do you need from me?", "What did we decide about the payment provider?" (kept: review request 46), "Get the latest from origin" (kept: "get the latest"), "set up this project", "draw a flowchart of a login process", "add this to my to-do list: buy milk" (a connected app can act on it), "You drive, I'll just approve things" and "This email reads like AI wrote it" (both skills no longer exist). Two earlier requests changed a little: "Is it ready?" and "Ship it." now name WI-12, because a fresh session has no item otherwise.

Request 22 was changed once. It first read "that is only for WI-12", but the export button belongs to WI-003, so both agents rightly asked which item. That was a mistake in the request, not a result. It was rewritten ("WI-3"), run again, and the table holds the new runs.

## Table of every request

"Expected" is the skill the "Which skill" table in the starter `AGENTS.md`, or the review, names. "no skill" means the table says to answer from the project files. Each cell is the first skill the session opened. "(then also ...)" lists skills opened later in the same session (Claude Code) or in the same first step (Codex). When the first run missed, the cell shows both runs.

| ID | Source | Project | Request | Expected | Claude Code | Codex |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | E | a | toolkit v2 | project-setup | right: project-setup | right: project-setup |
| 02 | E | a | check the setup | project-setup | right: project-setup | right: project-setup |
| 03 | E | a | update the toolkit | project-setup | right: project-setup | right: project-setup |
| 04 | F | a | I want to move my work items out of local files and into Notion | project-setup | right: project-setup | 1st: MISS: running-work-item-lifecycle<br>2nd: MISS: running-work-item-lifecycle (then also using-work-tracker, project-setup) |
| 05 | F | a | bring this repo up to date with GitHub | pull-latest | right: pull-latest | right: pull-latest |
| 06 | E | a | make an explainer video about how a pull request gets merged | choosing-outside-tools | right: choosing-outside-tools | right: choosing-outside-tools |
| 07 | E | a | what do I use for explainer videos? | choosing-outside-tools | right: choosing-outside-tools | right: choosing-outside-tools |
| 08 | E | a | add this to my tool list: https://github.com/csthink/dashmotion for animated flowcharts | choosing-outside-tools | right: choosing-outside-tools | right: choosing-outside-tools |
| 09 | F | a | add a new skill to this project that makes slides for me | writing-harness-files | right: writing-harness-files | 1st: MISS: running-work-item-lifecycle (then also using-work-tracker, writing-harness-files, skill-creator)<br>2nd: MISS: skill-creator |
| 10 | F | a | write a hook that stops you from ever running git push --force | writing-harness-files | right: writing-harness-files | right: writing-harness-files |
| 11 | F | a | change the Codex rules file so git status never asks me again | writing-harness-files | right: writing-harness-files | 1st: MISS: curating-project-memory (then also writing-harness-files)<br>2nd: right: writing-harness-files |
| 12 | E | a | Is WI-12 ready to test? | running-work-item-lifecycle | 1st: MISS: no skill<br>2nd: MISS: using-work-tracker | 1st: MISS: no skill<br>2nd: right: running-work-item-lifecycle |
| 13 | E | a | ok ship WI-12 | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 14 | E | a | Add dark mode to the backlog for later. | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 15 | E | a | Grill me on the checkout flow. | running-work-item-lifecycle | 1st: MISS: no skill<br>2nd: right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 16 | R | a | We decided to drop the export feature | running-work-item-lifecycle (or filing-project-records) | right: filing-project-records | right: running-work-item-lifecycle |
| 17 | R | a | Close out WI-12 | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 18 | R | a | ok that's approved, merge it | running-work-item-lifecycle | 1st: MISS: merge-and-clean-up<br>2nd: MISS: merge-and-clean-up | 1st: MISS: no skill<br>2nd: MISS: merge-and-clean-up |
| 19 | R | a | Save this transcript | filing-project-records | 1st: MISS: no skill<br>2nd: MISS: no skill | right: filing-project-records |
| 20 | F | a | the client just confirmed accounts can only be deactivated, never deleted, and every feature that touches accounts has to follow that | filing-project-records | right: filing-project-records | right: filing-project-records |
| 21 | R | a | Update the security doc | filing-project-records | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: running-work-item-lifecycle (then also filing-project-records)<br>2nd: MISS: running-work-item-lifecycle (then also filing-project-records, using-work-tracker) |
| 22 | F | a | the export button should be blue, that is only for WI-3 | running-work-item-lifecycle | right: running-work-item-lifecycle | right: running-work-item-lifecycle |
| 23 | E | a | I'm going to clear context. | handoff | right: handoff | right: handoff |
| 24 | F | a | write me a prompt so I can pick this up in a new chat | handoff | right: handoff | right: handoff |
| 25 | F | a | I'm done for the day, wrap everything up so I can start fresh tomorrow | handoff | right: handoff | right: handoff |
| 26 | F | a | give me a quick list of what I asked for in this chat and what is still open | session-summary | right: session-summary | right: session-summary |
| 27 | F | a | ok brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. don't do anything, just tell me what you heard | braindump | right: braindump | right: braindump |
| 28 | F | a | brain dump: sales wants order export, discounts are wrong somewhere, maybe a second report. put it all in as work items | running-work-item-lifecycle | right: running-work-item-lifecycle | 1st: MISS: no skill<br>2nd: MISS: no skill |
| 29 | F | a | I don't get it, say that simpler | explain-simply | right: explain-simply | right: explain-simply |
| 30 | F | a | what is the sources folder for? | no skill | right: no skill | right: no skill |
| 31 | E | a | get the latest | pull-latest | right: pull-latest | right: pull-latest |
| 32 | F | a | my local copy is a mess, make it exactly like GitHub and throw the rest away | reset-to-remote | right: reset-to-remote | right: reset-to-remote |
| 33 | F | a | undo my last commit, I didn't mean to make it | no skill | right: no skill | right: no skill |
| 34 | E | a | Merge PR 14 and clean up. | merge-and-clean-up | right: merge-and-clean-up | right: merge-and-clean-up |
| 35 | F | a | that change to PROJECT.md looks right, commit it straight to main | publish-docs | right: publish-docs | right: publish-docs |
| 35b | F | a | PR 22 passed review, merge it and delete the branch | merge-and-clean-up | right: merge-and-clean-up | right: merge-and-clean-up |
| 36 | E | a | fix the typo in the README | no skill (or publish-docs) | right: publish-docs | right: no skill |
| 37 | E | a | Make WI-7 a sub-item of WI-3. | using-work-tracker | right: using-work-tracker | right: using-work-tracker |
| 38 | F | a | show me what WI-3 says | using-work-tracker | right: using-work-tracker | 1st: MISS: no skill<br>2nd: right: using-work-tracker |
| 39 | R | a | Remember that the client's year starts in February | curating-project-memory | right: curating-project-memory | right: curating-project-memory |
| 40 | R | a | From now on, always run the tests before you ask me | curating-project-memory | right: curating-project-memory | right: curating-project-memory |
| 41 | R | a | Write this up as a rule for agents | curating-project-memory | 1st: MISS: no skill<br>2nd: MISS: no skill | 1st: MISS: no skill<br>2nd: MISS: no skill |
| 42 | F | a | forget what I told you about the old fiscal year | curating-project-memory | right: curating-project-memory | right: curating-project-memory |
| 43 | F | a | what does memory point to? | using-memory-store | right: using-memory-store | right: using-memory-store |
| 44 | F | a | update Current State: WI-12 is built and waiting on my testing | using-memory-store | right: using-memory-store | right: using-memory-store |
| 45 | E | a | Where are we? | no skill | right: no skill | right: no skill |
| 46 | R | a | What did we decide about the date format? | no skill | right: no skill | right: no skill |
| 47 | F | b | show me WI-31 | using-work-tracker | right: using-work-tracker | 1st: MISS: using-notion-cli<br>2nd: right: using-work-tracker |
| 48 | F | b | which phases does the CRM project have? | using-work-tracker | right: using-work-tracker | right: using-work-tracker |
| 49 | R | b | Add a task to phase 2 of WI-31 | running-work-item-lifecycle | right: running-work-item-lifecycle | 1st: MISS: using-work-tracker (then also running-work-item-lifecycle)<br>2nd: MISS: using-notion-cli (then also using-work-tracker) |
| 50 | F | b | what does memory point to? | using-memory-store | right: using-memory-store | right: using-memory-store |
| 51 | F | b | update the Current state page: WI-31 is waiting on UAT | using-memory-store | right: using-memory-store | right: using-memory-store |
| 52 | F | b | ntn says I'm not signed in, fix it | using-notion-cli | right: using-notion-cli | right: using-notion-cli |
| 53 | F | b | a Notion call came back 404 on the Memories database | using-notion-cli | right: using-notion-cli | right: using-notion-cli |
| 54 | F | b | I added Account.Region__c as a new custom field, keep the tracker up to date | sf-component-tracker | right: sf-component-tracker | right: sf-component-tracker |
| 55 | F | b | the deploy result came back with two failures, update the records | sf-component-tracker | right: sf-component-tracker | right: sf-component-tracker |
| 56 | F | b | can the WI-31 changes go to the UAT sandbox? check that nothing extra goes with them | sf-deploy-check | right: sf-deploy-check | 1st: MISS: running-work-item-lifecycle (then also using-work-tracker, using-memory-store, using-notion-cli, sf-deploy-check)<br>2nd: right: sf-deploy-check |
| 57 | F | b | is WI-31 ready to test? | running-work-item-lifecycle | 1st: MISS: using-work-tracker (then also running-work-item-lifecycle, using-notion-cli)<br>2nd: MISS: using-work-tracker (then also using-notion-cli) | 1st: MISS: using-work-tracker (then also running-work-item-lifecycle, using-notion-cli)<br>2nd: MISS: using-work-tracker (then also running-work-item-lifecycle, using-notion-cli) |
| 58 | F | b | load this CSV of accounts into production | sf-data-change | right: sf-data-change | right: sf-data-change |
| 59 | F | b | load this CSV of accounts into the dev sandbox | no skill | right: no skill | 1st: MISS: sf-data-change<br>2nd: MISS: using-work-tracker (then also using-notion-cli, sf-data-change) |

## The misses

Seen in the sessions: what each agent opened and said. Inferred: the words in the descriptions that probably caused it. No description was changed.

**Steady misses in Claude Code**

| ID | Request | Expected | Chosen | Words that probably caused it (inferred) |
| --- | --- | --- | --- | --- |
| 12 | Is WI-12 ready to test? | `running-work-item-lifecycle` | 1st run: no skill (read the item file and answered). 2nd run: `using-work-tracker`. | `using-work-tracker` says "Use when an item ... must be read". The lifecycle skill says "Use when the owner asks to plan, change, build, test, deploy, close, or cancel an item": no word for asking where an item stands or whether it is ready. The same request in Codex: no skill, then the right skill. |
| 18 | ok that's approved, merge it | `running-work-item-lifecycle` | `merge-and-clean-up` both runs | `merge-and-clean-up` says "Merges one approved GitHub pull request" and "the owner names a pull request to merge". The request has "approved" and "merge". The lifecycle description has no word "merge". Codex: no skill, then `merge-and-clean-up`. The request names no pull request and no item, so this expectation (from the review) may be too strict. Claude Code then asked which pull request; Codex said the checkout has no remote. |
| 19 | Save this transcript | `filing-project-records` | no skill, both runs | The agent asked "which transcript?", because nothing was pasted. The description says "Use when the owner hands over an original, such as a transcript": there was no original in the request. With a transcript in the request (probe), Claude Code opened `filing-project-records`. Codex opened it on the plain request. |
| 21 | Update the security doc | `filing-project-records` | no skill, both runs | The agent asked what the change is. With content added (probe), `filing-project-records` was chosen. Codex chose `running-work-item-lifecycle` in all runs (see below). |
| 41 | Write this up as a rule for agents | `curating-project-memory` | no skill, both runs | "this" has nothing before it in a fresh session, so the agent asked what the rule says. With content added (probe), both products chose `writing-harness-files`. |
| 57 | is WI-31 ready to test? (Notion project) | `running-work-item-lifecycle` | `using-work-tracker` first, both runs | Same cause as 12. The Notion `using-work-tracker` says "Use when an item, phase, task, or question must be read". `using-notion-cli` ("Use before any Notion read or write") was opened as well. The lifecycle skill was opened second in the first run only. |

**Steady misses in Codex**

| ID | Request | Expected | Chosen | Words that probably caused it (inferred) |
| --- | --- | --- | --- | --- |
| 04 | I want to move my work items out of local files and into Notion | `project-setup` | `running-work-item-lifecycle` both runs (`project-setup` was opened third in the 2nd run) | The words "work items" match the lifecycle skill's name and text. `project-setup` says "changes where work items or memory are kept" in the middle of a long first sentence. Claude Code chose `project-setup`. |
| 09 | add a new skill to this project that makes slides for me | `writing-harness-files` | 1st run: `running-work-item-lifecycle` (then `writing-harness-files` and `skill-creator` in the same step). 2nd run: `skill-creator` | `skill-creator` is one of Codex's own built-in skills and matches "add a new skill". `writing-harness-files` names a skill only inside its list of harness files, after a sentence about "official Claude Code and Codex pages". Claude Code chose `writing-harness-files`. |
| 18 | ok that's approved, merge it | `running-work-item-lifecycle` | 1st run: no skill. 2nd run: `merge-and-clean-up` | As for Claude Code. |
| 21 | Update the security doc | `filing-project-records` | `running-work-item-lifecycle` both runs (`filing-project-records` second) | The lifecycle description says "plan, change, build ..." and matches "update". `filing-project-records` says "an approved change to a system/ document", and the request does not say approved. The probe with content went to the lifecycle skill too. |
| 28 | brain dump: ... put it all in as work items | `running-work-item-lifecycle` | no skill file read, both runs; the agent said it would use "the brain dump check" first and wait for a yes (inferred: it followed `braindump` from the listing) | `braindump` starts "Plays back a loose brain dump" and matches the words "brain dump". Its "Not for a brain dump he asks only to plan; use running-work-item-lifecycle" does not cover "put it all in as work items". Claude Code chose the lifecycle skill. |
| 41 | Write this up as a rule for agents | `curating-project-memory` | no skill, both runs | As for Claude Code. |
| 49 | Add a task to phase 2 of WI-31 (Notion project) | `running-work-item-lifecycle` | 1st run: `using-work-tracker` (lifecycle second). 2nd run: `using-notion-cli` (then `using-work-tracker`) | The Notion `using-work-tracker` lists "phase, task, or question" with "created". `using-notion-cli` says "before any Notion read or write". Claude Code chose the lifecycle skill. This is finding 4 of the skills review, still showing in Codex. |
| 57 | is WI-31 ready to test? | `running-work-item-lifecycle` | `using-work-tracker` first, both runs (lifecycle second) | As for Claude Code. |
| 59 | load this CSV of accounts into the dev sandbox | no skill | 1st run: `sf-data-change`. 2nd run: `using-work-tracker` (then `using-notion-cli`, `sf-data-change`) | `sf-data-change` says "load, import, update, or delete ... records" and "load this file into production". "Production" is in the description but nothing says "not a sandbox". Claude Code opened no skill. |

**Misses that passed on the second run**: Claude Code 15 (first run: no skill, the agent read WI-012 and answered from it). Codex: 11 (curating first, then the right skill in the same step), 12, 38 (no skill file read, then right), 47 (`using-notion-cli` first, then right), 56 (lifecycle first with four others, then right).

**Accepted alternatives**: request 16 allowed `filing-project-records` as well (the review says it depends on how many items the decision touches). Claude Code opened `filing-project-records`, Codex the lifecycle skill. Request 36 allowed `publish-docs` (a README save goes there once approved). Claude Code opened `publish-docs`, Codex no skill.

## Probes (not counted in the 60)

The three vague review requests with content added, run once in each product:

| Probe | Request | Expected | Claude Code | Codex |
| --- | --- | --- | --- | --- |
| x19 | Save this transcript: Sam: the discount cap is 15 percent on every order. Dana: ok, 15 percent, and Sam signs off. | `filing-project-records` | `filing-project-records` | `filing-project-records` |
| x21 | Update the security doc: only managers may delete an order. | `filing-project-records` | `filing-project-records` | `running-work-item-lifecycle` (then `filing-project-records`) |
| x41 | Write this up as a rule for agents: every date we show uses year-month-day. | `curating-project-memory` | `writing-harness-files` | `writing-harness-files` (then `running-work-item-lifecycle`) |

One run each, so these show a direction, not a rate.

## Codex skill list

Seen with `codex debug prompt-input` in each project, with the same flags as the runs:

| Project | Skills in the list | Size of the "Skills" section | Descriptions cut? |
| --- | --- | --- | --- |
| (a) | 21 (13 project, 3 plugin, 4 Codex built-in, 1 owner skill) | 10,076 characters, about 2,500 tokens (characters divided by 4: inferred) | No |
| (b) | 25 (17 project, 3 plugin, 4 built-in, 1 owner skill) | 11,838 characters, about 2,960 tokens (inferred) | No |

- Every project and plugin description in the list equals the text of its `SKILL.md` word for word (checked by program, 0 differences in both projects). No "omitted" or "shortened" warning appeared in the prompt text.
- The default limit is 2% of the model's context window. The window in the test home's model list is 272,000 tokens, so 5,440 tokens, and the list is under it even without the project's `max_context_tokens = 10000`. Codex counts tokens its own way, so the token figures are estimates. The margin in project (b) is about 2,500 tokens: another 8 to 10 descriptions of this length would reach the default limit.
- The 0.4.9 copy of `toolkit` in the test home was off for every run, so it did not add a second `project-setup`.
- Claude Code's skill list was not checked for cuts.

## Not counted

- A first pass ran on a bare project (empty Current State, no work items). It was thrown away: agents answered "there is no WI-12" and similar. Its scores were Claude Code 55 of 60 and Codex 47 of 60, with the first Codex pass counting only `SKILL.md`. The results above come from the second pass on the filled project.
- The first run and second run of the original request 22 (see "The requests").

## Not run, and limits

- One run per request, a second run only after a miss. A request that was right once could still miss on another run (the first skill changed between the two runs in 11 of the 21 pairs of runs).
- No live Notion or Salesforce call. In project (b), agents could not read WI-31, so those sessions stopped at a question or at the skill's first step.
- Codex's hooks (session start, prompt reminder) did not run, so Codex did not get the Current State text at session start. Claude Code's hooks ran.
- Claude Code ran with Bash turned off, so sessions could not run `git` or `ntn`; the first skill is still read from the first call.
- The test home holds other skills (built-in and account skills), so results include their competition (for example `skill-creator` in request 09). The owner's real set differs and is larger.
- The Codex desktop app, the older toolkit's plugins on, and Windows were not covered.

## Test homes after the run

- Added and removed: in the Codex test home, the marketplace `toolkit-v2-routing`, the plugin `toolkit@toolkit-v2-routing`, and the profile file `routing.config.toml`. `config.toml` and `auth.json` have the same checksums as before. The folder list under `plugins/` and `skills/` is the same as before. The runs used `--ephemeral`, so no Codex session files were saved.
- Claude Code test home: nothing was installed or changed (`settings.json` is identical to its saved copy). `--no-session-persistence` left no session records. Claude Code and Codex rewrote their own bookkeeping files, as on any use.
- Neither test home was deleted. The owner's real `~/.claude` and `~/.codex` were not used or changed.
