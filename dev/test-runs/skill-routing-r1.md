# Skill routing check, round 1 (2026-09-27)

Each owner message ran once as a fresh session in Claude Code and once in
Codex, using the skill files as they stand in the working tree on
2026-09-27 at 17:02 (the rewritten descriptions). The skill each agent opened
first was compared with the skill the index expects. Messages: all 43 from
`dev/SKILL-INDEX.md` section 5.1, plus 22 new ones (6 vague, 5 mixed, 5 other
new requests, 6 that should open no toolkit skill). Previous run:
`dev/test-runs/skill-routing.md`.

**Result: passed the 0.90 bar in both hosts.**

| Host | First skill matched | Rate | Index messages (43) | New messages (22) | Should open a skill (59) | Should open none (6) |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code 2.1.280 | 60 of 65 | 0.923 | 0.930 | 0.909 | 0.915 | 1.000 |
| Codex 0.157.0 | 61 of 65 | 0.938 | 0.953 | 0.909 | 0.932 | 1.000 |

Previous run: Claude Code 0.81, Codex 0.94 (48 messages, projects where many
requests did not fit).

- 9 mismatches in total: 5 in Claude Code, 4 in Codex.
- **5 of the 9 come from two toolkit skills that both claim the message**
  (Claude Code 2: #13, N10; Codex 3: #13, N10, N13).
- The other 4 are not description problems: a project rule told Claude Code
  to skip the handoff (#33), the unslop skill was already loaded from the
  first turn (#38, both hosts), and Claude Code answered a status question
  straight from the session briefing (N04).
- No session opened a skill from outside the toolkit first. All 6 messages
  that should open no skill opened none in both hosts.
- A bare "looks good" (X2), with two decisions waiting, recorded nothing in
  either host: both asked which item it meant. In the previous run Codex
  recorded a bare "yes" as an answer.
- By message kind (Claude / Codex): vague 5 of 6 / 6 of 6, mixed 4 of 5 /
  4 of 5.

## How the check ran

### Changes made first

- Patch version raised in both manifests of every plugin whose files changed
  since the last Codex install: `toolkit`, `work`, `memory`, `git-workflows`
  0.2.2 to 0.2.3; `session-skills`, `sf-architect-solutioning` 0.2.0 to
  0.2.1. `metadata.version` in `.claude-plugin/marketplace.json` 0.2.2 to
  0.2.3.
- `codex plugin add <name>@toolkit-v2` for all six plugins: each exited 0 and
  installed to `~/.codex/plugins/cache/toolkit-v2/<name>/<new version>`.
  `diff -rq` between each source `skills/` folder and its cached copy found no
  difference, and the cached `toolkit` scaffold and `lib/project/brief.mjs`
  match the source. `codex plugin add` set each user-level
  `[plugins."<name>@toolkit-v2"]` line back to `enabled = true`; the six lines
  were set to `false` again, and `~/.codex/config.toml` is now byte for byte
  the same as the copy taken before (`cmp`).
- After these changes: `claude plugin validate .` and `claude plugin validate`
  on each of the six plugin folders passed; `node dev/tools/check-skills.mjs`
  0 failures; `node --test 'plugins/toolkit/tests/**/*.test.mjs'` 696 passed,
  0 failed, 3 skipped; `node --test 'plugins/git-workflows/tests/*.test.mjs'`
  5 passed. `node dev/tools/import-model.mjs --check` fails, but not because of
  this check (see "Other findings", point 1).

### Test projects

All in the scratch folder
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/r1/proj/`.
Each was built by a script (`r1/build_local.py`, `r1/build_sf.py`) with the
current `toolkit` command. Every session ran in its own copy of its project,
with its own copy of the project's Git remote.

- **L, "Acme Portal"**: local tracker, built-in memory. Node code in `src/`
  and `tests/`. 13 work items at every kind of stage: WI-001 CSV export (03,
  requirements R-01 to R-03 approved, no design), WI-002 and WI-007 and WI-013
  "Dark mode" (01, backlog), WI-003 Checkout flow (02, open owner question
  Q-01), WI-004 Payment provider integration (04, design Options A and B,
  waiting on the owner), WI-005 Admin audit log (06), WI-006 Weekly summary
  email (09, built and unit-tested), WI-008 and WI-009 (Done), WI-010 Customer
  profile page (11, result approved), WI-011 Reporting dashboard (05, eight
  requirements), WI-012 Customer search page (08, half built). `DECISIONS.md`
  D-1 "Stripe is the payment provider", D-2 "Node 20 LTS". Eight memory
  records, two of them near-duplicates and one out of date. A local bare
  remote `origin`: the remote has one commit the local copy lacks, and the
  local copy has one unpushed commit. Current focus: WI-012.
- **Variants of L**, where "this" or "it" must point at one item: focus on
  WI-005 (#03, #12), WI-006 (#19, #20), WI-010 (#21), WI-011 (#15, N06); built
  without the dark mode item (#05); WI-007's folder moved into WI-003's folder
  and WI-002's folder renamed by hand, with no toolkit command run afterward
  (#17; the briefing reported both).
- **S, "Northwind Service Cloud"**: `toolkit init --salesforce`, local
  tracker. WI-001 Account address sync (13, result approved, Flow in
  `force-app/main/default/flows/`), WI-002 Contact import (a `data-load` item
  at 08, with `data/contacts-500.csv`, 500 rows), WI-003 Case escalation (04,
  requirements approved, no design). Focus: WI-003; variant focus WI-001
  (#41, N16).
- **F**: a new Git repository ("Acme Invoices", 3 files, 1 commit), no
  toolkit files (#30).
- **N**: a copy of the Notion sample project from sample run (c)
  (`runs/c-notion-r3`, Notion tracker and Notion memory). The Notion CLI has
  no sign-in on this Mac now (`ntn doctor`: "Token source ... no token
  found"), so toolkit commands there could not read Notion (#18).

### Claude Code

```sh
claude -p --setting-sources project,local --strict-mcp-config --no-session-persistence \
  --settings '{"enabledPlugins":{"toolkit@inline":true,"work@inline":true,"memory@inline":true,"session-skills@inline":true,"git-workflows@inline":true}}' \
  --plugin-dir <toolkit-v2>/plugins/toolkit --plugin-dir <toolkit-v2>/plugins/work \
  --plugin-dir <toolkit-v2>/plugins/memory --plugin-dir <toolkit-v2>/plugins/session-skills \
  --plugin-dir <toolkit-v2>/plugins/git-workflows \
  --input-format stream-json --output-format stream-json --verbose \
  --permission-mode acceptEdits --max-turns 8 \
  --allowedTools 'Bash(toolkit *)' 'Bash(node *)' 'Bash(git *)' Read Write Edit Glob Grep Skill
```

Salesforce projects added `sf-architect-solutioning` the same way.
`TOOLKIT_V2_CONFIG_DIR` pointed at a scratch folder in both hosts, so
`~/.config/toolkit-v2/` was not written. `--no-session-persistence` kept
every session out of `~/.claude/projects/`. A two-turn session sent both
messages to the same process (`--input-format stream-json`).

- Every one of the 65 sessions loaded exactly the V2 plugins (`@inline`) plus
  Claude Code's three built-in plugins, with no `plugin_errors`. Each listed
  the 22 V2 skills (26 in Salesforce projects: 23 plugin skills and the 3
  project skills), plus 22 skills built into Claude Code (for example
  `schedule`, `code-review`, `deep-research`, `design`). No user skill and no
  `claude-toolkit` skill. The SessionStart briefing ran in all 65.
- First skill: the first `Skill` tool call in the main conversation in the
  test turn (a `Read` of a `SKILL.md` would also count; none happened). The
  runner stopped the session 2 seconds after it.

### Codex

```sh
codex exec --json --dangerously-bypass-hook-trust -c 'notify=[]' \
  -c 'projects={"<session folder>"={trust_level="trusted"}}' \
  --sandbox workspace-write -C <session folder> "<message>" < /dev/null
```

- Two-turn sessions ran the first turn to its end, then
  `codex exec resume <thread id>` with the same `-c` options plus
  `-c sandbox_mode="workspace-write"`. Only tool calls after the resume count.
- The new repository (F) has no `.codex/config.toml`, so the V2 plugins (off
  for the whole computer) would not load there. For that one message the run
  added a `-c plugins={...}` override that turns the five V2 plugins on and the
  `claude-toolkit` plugins off for that run only, the way a V2 project's own
  config does. See "Other findings", point 3.
- Every session listed the 22 V2 skills (26 in Salesforce projects) and no
  `claude-toolkit` skill. Each also listed Mike's other Codex skills (between
  49 and 123 skills in total per session; the connector skills, such as
  Firecrawl, Notion, and Vercel, appeared only in some sessions). Every
  session in a toolkit project got the "Project briefing"; the new repository
  got none, as expected.
- First skill: the first tool call whose input reads a `SKILL.md` file, from
  the session log in `~/.codex/sessions/`. The runner stopped each session 2
  seconds after it, when the turn ended, or after 300 seconds (no session
  reached 300). When Codex read several `SKILL.md` files in one call, the one
  listed first counts; the others are shown with "+".

### Changes from the previous method

- Projects where each request can be carried out (see above), so fewer
  sessions end with "nothing here to act on".
- Messages that need earlier conversation are the second turn of a session:
  #33, #34, #35, N10 after "What's WI-012 about? Short answer, don't change
  anything."; #37 after "What does the 05-breakdown stage mean in this
  project? Short answer."; #38 after a request to draft an email to a client.
- Claude Code: `--max-turns 8` instead of 3, so a skill opened after a few
  lookups still counts (it happened once: N13, after 2 tool calls); the
  runner stops 2 seconds after the first skill, as the Codex runner already
  did; `--strict-mcp-config` and `--no-session-persistence` added.

### Match rule

A match is the expected skill opened first. For "none" messages, a match is no
toolkit skill opened. For a mixed message, the expected skill is the one for
the first thing the owner asked (N07, N11), or the one the index names for the
whole message (N08: index 5.1 row 10 says "remember we decided ..." starts
`memory-save`; N09 and N10 see below).

## Results

Projects: L = Acme Portal (local tracker), S = Northwind (Salesforce), F = new
repository, N = Notion tracker. "no skill" = the agent opened no skill.

| # | Kind | Project | Owner message | Expected | Claude Code | Codex | Match (Claude / Codex) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | index | L | Where are we? | work-status | work-status | work-status | yes / yes |
| 02 | index | L | What's next? | work-status | work-status | work-status | yes / yes |
| 03 | index | L (focus WI-005) | Keep going. | work-on | work-on | work-on | yes / yes |
| 04 | index | L | Let's build the login page. | work-on | work-on | work-on | yes / yes |
| 05 | index | L (no dark mode item) | Add dark mode to the backlog for later. | work-on | work-on | work-on | yes / yes |
| 06 | index | L | Log a bug: the export button does nothing. Not now. | work-on | work-on | work-on | yes / yes |
| 07 | index | L | Pick up WI-12 where we left off. | work-on | work-on | work-on | yes / yes |
| 08 | index | L | What do you need from me? | work-decide | work-decide | work-decide | yes / yes |
| 09 | index | L | Approved, go with option B. | work-decide | work-decide | work-decide | yes / yes |
| 10 | index | L | We've decided to use Postgres everywhere. | work-decide | work-decide | work-decide | yes / yes |
| 11 | index | L | Grill me on the checkout flow. | work-requirements | work-requirements | work-requirements | yes / yes |
| 12 | index | L (focus WI-005) | Check the spec before you build. | work-requirements | work-requirements | work-requirements | yes / yes |
| 13 | index | L | Change R-02 so only admins can export. | work-requirements | work-on | work-on | no / no |
| 14 | index | L | How should we build the CSV export? | solution-design | solution-design | solution-design | yes / yes |
| 15 | index | L (focus WI-011) | Split this into smaller pieces. | work-organize | work-organize | work-organize | yes / yes |
| 16 | index | L | Make WI-7 a sub-item of WI-3. | work-organize | work-organize | work-organize | yes / yes |
| 17 | index | L (folders moved) | I moved some folders around. | work-organize | work-organize | work-organize | yes / yes |
| 18 | index | N | I dragged a card to Done in Notion. | work-organize | work-organize | work-organize | yes / yes |
| 19 | index | L (focus WI-006) | Is this ready to ship? | work-check | work-check | work-check | yes / yes |
| 20 | index | L (focus WI-006) | Test it against what I asked for. | work-check | work-check | work-check | yes / yes |
| 21 | index | L (focus WI-010) | Ship it. | work-finish | work-finish | work-finish | yes / yes |
| 22 | index | L | Cancel the dark mode item, we don't need it. | work-finish | work-finish | work-finish | yes / yes |
| 23 | index | L | Merge PR 14 and clean up. | merge-and-clean-up | merge-and-clean-up | merge-and-clean-up | yes / yes |
| 24 | index | L | You drive, I'll just approve things. | work-delegate | work-delegate | work-delegate | yes / yes |
| 25 | index | L | Remember I hate tabs. | memory-save | memory-save | memory-save | yes / yes |
| 26 | index | L | Forget what I said about tabs. | memory-save | memory-save | memory-save | yes / yes |
| 27 | index | L | Remind me to email the client. | memory-save | memory-save | memory-save | yes / yes |
| 28 | index | L | What did we decide about the payment provider? | memory-find | memory-find | memory-find | yes / yes |
| 29 | index | L | Memory feels cluttered, clean it up. | memory-tidy | memory-tidy | memory-tidy | yes / yes |
| 30 | index | F | Set up this new repo. | project-setup | project-setup | project-setup | yes / yes |
| 31 | index | L | I got a new laptop, check the setup. | project-setup | project-setup | project-setup | yes / yes |
| 32 | index | L | Update the toolkit in this project. | project-setup | project-setup | project-setup | yes / yes |
| 33 | index | L | I'm going to clear context. (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | handoff | no skill | handoff | no / yes |
| 34 | index | L | Recap this chat. (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | session-summary | session-summary | session-summary | yes / yes |
| 35 | index | L | What did we do today? (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | session-summary | session-summary | session-summary | yes / yes |
| 36 | index | L | Here's a brain dump: I want the app to email a weekly summary, maybe with a chart, skip anyone who opted out, and I'm not sure if it should go Monday or Friday. | braindump | braindump | braindump | yes / yes |
| 37 | index | L | Explain that like I'm five. (second turn, after: "What does the 05-breakdown stage mean in this project? Short answer.") | explain-simply | explain-simply | explain-simply | yes / yes |
| 38 | index | L | This email reads like AI wrote it. (second turn, after: "Draft a short email to Dana, our client, saying the customer profile page is ready for her to review. Show it here only; don't send or save anything.") | unslop | no skill | no skill | no / no |
| 39 | index | L | Get the latest from origin. | pull-latest | pull-latest | pull-latest | yes / yes |
| 40 | index | L | Wipe local and match remote exactly. | reset-to-remote | reset-to-remote | reset-to-remote | yes / yes |
| 41 | index | S (focus WI-001) | Deploy it to the UAT sandbox. | work-finish | work-finish | work-finish (+ sf-deploy-check) | yes / yes |
| 42 | index | S | Load these 500 contacts into production. | sf-data-change | sf-data-change | sf-data-change | yes / yes |
| 43 | index | S | Which Flow type fits this? | sf-architect-solutioning | sf-architect-solutioning | sf-architect-solutioning | yes / yes |
| N01 | vague | L | ok what now? | work-status | work-status | work-status | yes / yes |
| N02 | vague | L | the password reset email never arrives | work-on | work-on | work-on | yes / yes |
| N03 | vague | L | let's do the dark mode one | work-on | work-on | work-on | yes / yes |
| N04 | vague | L | is the CSV export done yet? | work-status | no skill | work-status | no / yes |
| N05 | vague | L | anything waiting on me? | work-decide | work-decide | work-decide | yes / yes |
| N06 | vague | L (focus WI-011) | this is getting too big, can we chunk it up? | work-organize | work-organize | work-organize | yes / yes |
| N07 | mixed | L | Pull the latest from origin, then keep going on the search page. | pull-latest | pull-latest | pull-latest (+ work-on) | yes / yes |
| N08 | mixed | L | Remember we decided to email invoices as PDFs. | memory-save | memory-save | memory-save | yes / yes |
| N09 | mixed | L | Where are we, and what do you need from me? | work-status | work-status | work-status (+ work-decide) | yes / yes |
| N10 | mixed | L | I'm done for today. Recap what we did and write me a handoff. (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | handoff | session-summary | session-summary (+ handoff) | no / no |
| N11 | mixed | L | From now on use pnpm instead of npm, and switch the build scripts over. | memory-save | memory-save | memory-save (+ work-on) | yes / yes |
| N12 | new | L | Why did we pick Stripe again? | memory-find | memory-find | memory-find | yes / yes |
| N13 | new | L | Take it from here on dark mode, I'll check back tonight. | work-delegate | work-delegate (after 2 tool calls) | work-on (+ work-delegate) | yes / no |
| N14 | new | L | Tell me what you heard: invoices go out monthly as PDFs, never to test accounts, and finance gets a copy. | braindump | braindump | braindump | yes / yes |
| N15 | new | S | Should the case escalation be a record-triggered Flow or Apex? | sf-architect-solutioning | sf-architect-solutioning | sf-architect-solutioning | yes / yes |
| N16 | new | S (focus WI-001) | Deploy the address sync to production. | work-finish | work-finish | work-finish | yes / yes |
| X1 | none | L | What's the difference between git merge and git rebase? | none | no skill | no skill | yes / yes |
| X2 | none | L | looks good | none | no skill | no skill | yes / yes |
| X3 | none | L | What time zone is Tokyo in? | none | no skill | no skill | yes / yes |
| X4 | none | L | Explain what a webhook is. | none | no skill | no skill | yes / yes |
| X5 | none | L | Format this JSON for me: {"id":7,"tags":["a","b"],"active":true} | none | no skill | no skill | yes / yes |
| X6 | none | L | What's a regex for a US ZIP code? | none | no skill | no skill | yes / yes |

Claude Code opened a skill in 56 of its 65 sessions. In 55 of them the `Skill`
call was the first tool call of the test turn; in N13 it came after 2 lookups.

## Repeat runs and variants (not counted in the rates)

Every mismatch ran twice more as a fresh session with the same message and
project. Two variants tested a cause.

| # | Host | Round 1 | Repeat 1 | Repeat 2 | Expected skill first, all 3 runs |
| --- | --- | --- | --- | --- | --- |
| 13 | Claude Code | work-on | work-requirements | work-requirements | 2 of 3 |
| 13 | Codex | work-on | work-on | work-requirements | 1 of 3 |
| 33 | Claude Code | no skill | no skill | no skill | 0 of 3 |
| 38 | Claude Code | no skill | no skill | no skill | 0 of 3 |
| 38 | Codex | no skill | no skill | no skill | 0 of 3 |
| N04 | Claude Code | no skill | no skill | no skill | 0 of 3 |
| N10 | Claude Code | session-summary (then handoff) | handoff | handoff | 2 of 3 |
| N10 | Codex | session-summary (+ handoff) | session-summary (+ handoff, memory-save) | session-summary (+ handoff, memory-save) | 0 of 3 |
| N13 | Codex | work-on (+ work-delegate) | work-delegate (+ work-on, impeccable) | work-on (+ work-delegate) | 1 of 3 |

| Variant | Message | Claude Code | Codex |
| --- | --- | --- | --- |
| V38 | "This email reads like AI wrote it:" followed by a pasted, AI-sounding email to Dana, one turn | unslop | unslop |
| V33 | "I'm going to clear context." after a first turn that did real work ("Add dark mode to the backlog for later, then tell me what WI-012 is waiting on.") | no skill | handoff |

## Mismatches: cause and suggested change

### Two toolkit skills overlap (5 mismatches)

**#13 "Change R-02 so only admins can export." (Claude Code and Codex: work-on)**

- What happened: both hosts opened `work-on` ("I'm using the project's
  work-on procedure for this change."). Over 3 runs, Claude Code opened
  `work-requirements` first 2 times and Codex 1 time. In the previous run,
  with the older descriptions, both hosts matched.
- Cause: `work-on` says "Use whenever the owner asks to build, add, fix, or
  change something". `work-requirements` says "Use when an item's
  requirements are missing or must change". The word "change" fits both, and
  only the requirement id R-02 points at `work-requirements`. The project's
  `AGENTS.md` line "Anything to build, add, fix, or change ...: the `work-on`
  skill" adds weight to `work-on`.
- Suggested description for `work-on` (296 characters): "Starts, resumes, or
  logs a work item and carries it to a built result. Use whenever the owner
  asks to build, add, fix, or change something, names an item id to resume,
  says "keep going", or wants an idea or bug logged ("put it in the
  backlog"). Not for requirement changes; use work-requirements."
- Or, for `work-requirements` (298 characters), a quoted example in place of
  "ask me questions": "... Use when an item's requirements are missing or
  must change ("change R-02 so ..."), or the owner says "grill me" or "check
  the spec", including before a build starts."
- A model change for Mike, if the description change is not enough: the
  `AGENTS.md` routing line adds "Changing a requirement (R-01, R-02):
  `work-requirements`."

**N10 "I'm done for today. Recap what we did and write me a handoff." (Claude Code and Codex: session-summary first)**

- What happened: Claude Code opened `session-summary` and then `handoff` in
  the same reply. Codex read both (and `memory-save` in the repeats) in one
  call, `session-summary` first, in all 3 runs. Claude Code opened `handoff`
  first in both repeats.
- Cause: the message asks for two jobs that two skills each claim, recap
  first. `session-summary` claims the recap; `handoff` claims "I'm stopping
  for today" and "write a handoff". Its description does not say it includes
  a recap, so doing the recap first with `session-summary` follows the
  owner's order. The expected skill in this test (handoff) assumed the
  handoff covers the recap.
- Suggested change: no description change. Change the test's expectation to
  "session-summary, then handoff" (both skills ran in every run). If Mike
  wants one skill for this, `handoff` would need to say it ends with a recap
  table, which duplicates `session-summary`.

**N13 "Take it from here on dark mode, I'll check back tonight." (Codex: work-on first, with work-delegate)**

- What happened: Codex read `work-on` and `work-delegate` in one call.
  `work-on` came first in 2 of 3 runs. Claude Code opened `work-delegate`
  after listing the items and reading WI-013.
- Cause: `work-on` claims "names an item id to resume"; `work-delegate`
  claims "take it from here". The message names an item and hands it over.
  The `AGENTS.md` line "Anything to build, add, fix, or change ...: the
  `work-on` skill" again adds weight to `work-on`.
- Suggested change: a model change for Mike: the `AGENTS.md` routing line
  adds "'You drive', 'take it from here': `work-delegate`." The
  `work-on` description has no room left for a second "Not for" clause within
  the index's 300-character limit.

### Not an overlap (4 mismatches)

**#33 "I'm going to clear context." (Claude Code: no skill)**

- What happened: in all 3 runs and in variant V33, Claude Code answered
  without the skill, for example: "The saved current focus already says the
  next session starts by finishing WI-012 P1-T02 in `src/search-page.js`, so
  no handoff is needed." Codex opened `handoff` in round 1 and in V33.
- Cause: the project rule `.claude/rules/session-handoff.md` (from the model)
  says "When the session is long and the next step is complex, offer a
  handoff. ... Skip this for small edits and quick lookups." The test
  sessions were short, so Claude Code followed "skip". The description is not
  the cause: it names this situation ("about to clear context").
- Suggested change: a model change for Mike: the rule adds "When the owner
  says he is clearing context or asks for a handoff, use the handoff skill,
  whatever the session length." Or accept it: the answers were correct for a
  session that changed nothing.

**#38 "This email reads like AI wrote it." (Claude Code and Codex: no skill in the test turn)**

- What happened: in every run of both hosts, the first turn ("Draft a short
  email to Dana, our client ...") already opened `unslop`, because the
  project rule `humanize-outbound-text.md` sends text for another person
  through it. In the test turn the skill was still in the conversation, and
  both hosts rewrote the email without opening it again.
- Cause: the test design, not the description. With the email pasted into
  the message (variant V38), both hosts opened `unslop` first.
- Suggested change: none to the skills. Round 2 should use the pasted form,
  or count a skill already opened earlier in the same conversation.

**N04 "is the CSV export done yet?" (Claude Code: no skill)**

- What happened: in all 3 runs Claude Code answered with no tool call at
  all: "No. The CSV export (WI-001) has not been designed or built yet. You
  approved its requirements, and it is at stage 03 with status Ready." Codex
  opened `work-status`.
- Cause: the session briefing already lists WI-001 with its stage and next
  action, so the answer needed nothing more. The skill-writing guide (Part
  1.1, point 4) notes that an agent may not open a skill for a request it can
  answer directly. The briefing line added after the previous run ("Requests
  go through the matching skill first ...") did not change this. The answer
  was correct.
- Suggested change: none.

## Other findings

1. **`node dev/tools/import-model.mjs --check` fails.** Six Salesforce
   project skill files in `plugins/toolkit/scaffold/model/`
   (`.claude/skills/` and `.agents/skills/` copies of `sf-component-tracker`,
   `sf-data-change`, `sf-deploy-check`) differ from the model folder
   `toolkit-v2-model-project-approved`. They were changed in this working
   tree by the description rewrite, not in the model. The routing check used
   the changed copies. `AGENTS.md` says the scaffold copy is never edited by
   hand: the change belongs on the model's approved-changes branch, then an
   import. This check did not touch those files.
2. **Codex cannot start `$project-setup` in a new repository.** The V2
   plugins are off for the whole computer and on only through a project's
   `.codex/config.toml`, which `toolkit init` writes. `codex debug
   prompt-input` in a new repository (`r1/probe-fresh`) lists no V2 skill and
   does list `claude-toolkit`'s `project-init`. `dev/SKILL-INDEX.md` 5.3 says
   Mike starts setup with `$project-setup` in Codex, which does not work
   today. Options for the lead: say in `project-setup` and the index that a
   new project is started from Claude Code or with `toolkit init`; or turn the
   `toolkit` plugin on for the whole computer (Mike's config, his call).
3. **The Notion CLI is signed out.** `ntn doctor`: "Token source ! no token
   found"; `~/.config/notion/auth.json` changed at 17:13 today. All Notion
   work (tracker, memory, the Lore layout) needs Mike to run `ntn login`.
   Message 18 still routed correctly in both hosts, because both opened
   `work-organize` before any Notion read.
4. **The test projects' items carry "Changed by hand" history rows.** The
   builder wrote each `WORK-ITEM.md` after `toolkit work new`, so
   `toolkit work sync` added rows such as "Changed by hand: requirements_approved
   ... The approval was written by hand." Claude Code mentioned them in
   several answers, and in V33 it added an owner question about them to
   WI-012. No first-skill result appears to depend on them. Round 2 should
   build items with `toolkit work approve` and `toolkit work set`.
5. **`~/.config/toolkit-v2/plugin-root` names a removed folder.** It still
   points at `~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.2`, which
   `codex plugin add` removed when it installed 0.2.3. The `~/.local/bin/toolkit`
   wrapper falls back to the source folder when that folder is missing, so
   `toolkit` still runs, and the next Codex session start in a V2 project
   rewrites the pointer. Not changed here.
6. **Codex often opens several skills in one call**: #41 (work-finish +
   sf-deploy-check), N07 (pull-latest + work-on), N09 (work-status +
   work-decide), N11 (memory-save + work-on), N10, N13. In one repeat of N13
   the same call also read Mike's own Codex skill `impeccable`, third in the
   list. A skill from outside the toolkit was never first.
7. **Fixed since the previous run**: a bare "looks good" with two decisions
   waiting (X2) recorded nothing in either host. Codex asked "Which item
   looks good: the WI-004 payment design or the WI-010 customer profile
   page?"; Claude Code listed the waiting items and asked.

## Not covered

- The rates come from one run per message per host. Only the 9 mismatches
  ran three times. The skill-writing guide (Part 8, T2) asks for 3 runs of
  every prompt.
- Message 18 in a Notion project with a working sign-in and a card really
  moved to Done.
- The `claude-toolkit` plugins were off in every run (index 5.4 point 6 also
  asks for a run with them on). Claude Code saw no user skills
  (`--setting-sources project,local`); Codex saw all of Mike's other Codex
  skills.
- `#23 "Merge PR 14"` could not be carried out: there is no GitHub
  repository. Both hosts still opened `merge-and-clean-up` first.

## Evidence

In the scratch folder `r1/` (temporary):

- `build_local.py`, `build_sf.py`: build the test projects. `proj/`: the
  projects as built.
- `rt/messages.json`: the 65 messages, projects, and expected skills.
  `rt/claude_run.py`, `rt/codex_run.py`, `rt/drive.py`, `rt/repeats.py`: the
  runners. `rt/summarize.py`, `rt/summary.json`: the reader and every result.
- `rt/logs/claude-<id>.jsonl`, `.result.json`: Claude Code stream and result
  per session. `rt/logs/codex-<id>.turn*.jsonl`, `.rollout0.jsonl`,
  `.result.json`: Codex events, session log, and skills read.
  Repeats are `R1-<id>`, `R2-<id>`; variants `V33`, `V38`.
- `rt/sessions/<host>-<id>/`: each session's project copy afterward.
- `codex-config-before-r1.toml`: `~/.codex/config.toml` before the re-add;
  `readd-<plugin>.json`: the `codex plugin add` output.

In the toolkit-v2 repository this check changed only this report, the
`version` line in the 12 plugin manifests, and `metadata.version` in
`.claude-plugin/marketplace.json`. Nothing was staged or committed. Outside
it: the six Codex plugin cache folders were replaced by the new versions, and
Codex wrote its session logs to `~/.codex/sessions/2026/09/27/` and hook state
to `~/.codex/plugins/data/`, as in the previous run. `~/.codex/config.toml`
has the same content as before. `~/.config/toolkit-v2/` was not written, and
no session transcript went to `~/.claude/projects/` (`--no-session-persistence`);
`claude` itself still updates `~/.claude.json` on every run.
