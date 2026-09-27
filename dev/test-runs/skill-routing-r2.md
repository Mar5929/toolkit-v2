# Skill routing check, round 2 (2026-09-27)

Each owner message ran once as a fresh session in Claude Code and once in
Codex, using the skill files as they stand in the working tree at 18:28 on
2026-09-27 (after the round 1 fixes to `work-on`, `work-requirements`,
`work-delegate`, `handoff`, and `session-summary`). The skill each agent opened
first was compared with the skill the index expects. Messages: all 43 from
`dev/SKILL-INDEX.md` section 5.1, plus 37 that are new to this round: 8 vague,
5 mixed, 15 other new requests, 6 that should open no toolkit skill, and 3
round 1 mismatches run again. Previous runs: `dev/test-runs/skill-routing.md`
(round 0) and `dev/test-runs/skill-routing-r1.md` (round 1).

**Result: passed the 0.90 bar in both hosts.**

| Host | First skill matched | Rate | Index messages (43) | New messages (37) | Should open a skill (74) | Should open none (6) |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Code 2.1.280 (Opus 5.5) | 77 of 80 | 0.963 | 1.000 | 0.919 | 0.959 | 1.000 |
| Codex 0.157.0 (gpt-6-sol, high) | 78 of 80 | 0.975 | 1.000 | 0.946 | 0.986 | 0.833 |

Earlier rounds: round 0 Claude Code 0.81, Codex 0.94; round 1 Claude Code
0.923, Codex 0.938.

- 5 mismatches in total: 3 in Claude Code, 2 in Codex.
- **1 of the 5 comes from two toolkit skills that both claim the message**:
  Codex T10, where `session-summary` and `handoff` were read in the same call
  with `session-summary` listed first.
- The other 4 are not overlaps. Claude Code answered 3 questions directly,
  without opening a skill (O01, O14, T04). Codex took a bare "ok" as a go-ahead
  and opened `work-on` (X2).
- By message kind (Claude Code / Codex): vague 8 of 8 / 8 of 8, mixed 5 of 5 /
  5 of 5, other new 13 of 15 / 15 of 15, no skill 6 of 6 / 5 of 6, round 1
  mismatches run again 2 of 3 / 2 of 3.
- Four round 1 mismatches now match in both hosts: #13 "Change R-02 so only
  admins can export." (`work-requirements`), #33 "I'm going to clear
  context." (`handoff`, Claude Code opened no skill in all 3 round 1 runs),
  #38 with the email pasted in (`unslop`), and T13 "Take it from here on dark
  mode" (`work-delegate`, Codex opened `work-on` in round 1). T10 now matches
  in Claude Code.
- No session opened a skill from outside the toolkit first. In Codex, every
  `SKILL.md` read came from the toolkit-v2 plugin cache or the project's own
  `.agents/skills/` folder.
- Two tested description changes (next to last section) fixed all three
  Claude Code misses in 9 of 9 runs, in scratch copies of the plugins.

## How the check ran

### Changes made first

- The lead had already raised the patch version of the two plugins whose
  skills changed since the last Codex install: `work` 0.2.3 to 0.2.4 and
  `session-skills` 0.2.1 to 0.2.2, in both manifests, and
  `metadata.version` in `.claude-plugin/marketplace.json` to 0.2.4. This check
  changed no version.
- `codex plugin add work@toolkit-v2` and `codex plugin add
  session-skills@toolkit-v2` both exited 0 and installed to
  `~/.codex/plugins/cache/toolkit-v2/work/0.2.4` and `.../session-skills/0.2.2`.
  `diff -rq` between each of the six source `skills/` folders and its cached
  copy found no difference. The cached `work-on`, `work-delegate`,
  `work-requirements`, `handoff`, and `session-summary` files carry the new
  descriptions.
- `codex plugin add` set `[plugins."work@toolkit-v2"]` and
  `[plugins."session-skills@toolkit-v2"]` in `~/.codex/config.toml` to
  `enabled = true`. The file was put back from the copy taken just before;
  `cmp` shows it is byte for byte the same as before.
- `node dev/tools/check-skills.mjs`: 29 SKILL.md files, 0 failures.
- SHA-256 hashes of every `SKILL.md` (plugins and the Salesforce project
  skills in the scaffold), the scaffold `AGENTS.md`, and
  `plugins/toolkit/lib/project/brief.mjs` were saved at 18:28 and checked
  again after the last run: no file changed while the check ran.

### Test projects

All in the scratch folder
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/r2/proj/`,
built by `r2/build.py`. Every session ran in its own copy of its project, with
its own copy of the project's Git remote and, for Notion, its own copy of the
Notion data.

Round 1 found that its projects were built by writing `WORK-ITEM.md` files by
hand, so `toolkit work sync` added "Changed by hand" rows. This round built
every item with toolkit commands only: `toolkit work new`, `work edit
--section ... --set-file -` for each body section, `work set` for stage,
priority, delivery, and waiting, `work approve` for requirements, design, and
result, `work design --create`, and `work finish`. After the build,
`toolkit work sync` reported "Nothing changed" and `toolkit work validate`
reported every item clean in the local and Salesforce projects, and no item
file contains "Changed by hand".

- **L, "Acme Portal"**: local tracker, built-in memory. Node code in `src/`
  and `tests/`. 14 items: WI-001 CSV export (03, requirements approved, no
  design), WI-002 Keyboard shortcuts (01), WI-003 Checkout flow (02, owner
  question Q-01 open), WI-004 Payment provider integration (04, design Options
  A "Stripe Checkout, hosted page" and B "Stripe Elements", waiting on the
  owner), WI-005 Admin audit log (06, design skipped with a reason), WI-006
  Weekly summary email (09, built with unit tests), WI-007 Guest checkout (01),
  WI-008 and WI-009 (Done), WI-010 Customer profile page (11, result
  approved), WI-011 Reporting dashboard (05, eight requirements), WI-012
  Customer search page (08, half built), WI-013 Two-factor login (03, new this
  round), WI-014 Dark mode (01). `DECISIONS.md` D-1 Stripe, D-2 Node 20, D-3
  "Deleted customer accounts are kept for 30 days, then purged" (new this
  round). Eight memory records, two near-duplicates and one out of date. A
  local bare remote: the remote has one commit the local copy lacks, and the
  local copy has one unpushed commit. Current focus: WI-012.
- **Variants of L**, where "this" or "it" must point at one item: focus
  WI-005 (#03, #12), WI-006 (#19, #20), WI-010 (#21), WI-011 (#15); built
  without the dark mode item (#05); WI-007's folder moved into WI-003's folder
  and WI-002's folder renamed by hand, with no toolkit command afterward (#17).
- **S, "Northwind Service Cloud"**: `toolkit init --salesforce`, local
  tracker. WI-001 Account address sync (13, result approved, Flow in
  `force-app/`), WI-002 Contact import (`data-load`, 08, with
  `data/contacts-500.csv`), WI-003 Case escalation (04, requirements approved,
  no design). New this round: `data/account-phones-200.csv` (200 rows) for
  O04. Focus WI-003; variant with focus WI-001 (#41).
- **F**: a new Git repository ("Acme Invoices", 3 files, 1 commit), no
  toolkit files (#30).
- **N, "Acme Shop"**: Notion tracker, built-in memory, 4 items (Checkout flow
  at 08, Weekly summary email at 11, CSV export at 09, Dark mode at 01). The
  Notion CLI still has no sign-in on this Mac (`ntn doctor`: "Token source !
  no token found"), so the project runs on a stand-in Notion: the toolkit's
  own test fake, `plugins/toolkit/tests/notion/fake-ntn.mjs`, through
  `TOOLKIT_NTN_BIN` and `FAKE_NOTION_STATE`. Two variants change the stand-in
  Notion data the way a drag on the board does: "Weekly summary email" Status
  set to Done (#18), and "Checkout flow" Status set to Backlog (O08). With
  this, toolkit commands in the sessions really read and write the Notion
  data; `toolkit work sync` reports the drag. One #18 session ran to the end
  (see "Variants").

### Claude Code

The same command as round 1:

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
`TOOLKIT_V2_CONFIG_DIR` pointed at a scratch folder.

- All 80 sessions loaded exactly the V2 plugins (`@inline`) plus Claude
  Code's three built-in plugins, with no `plugin_errors`. Each listed the 22
  V2 skills (26 in Salesforce projects) plus 22 skills built into Claude Code.
  No user skill and no `claude-toolkit` skill. The SessionStart hook ran in
  all 80.
- First skill: the first `Skill` tool call in the main conversation in the
  test turn. The runner stopped the session 2 seconds after it.

### Codex

The same command as round 1:

```sh
codex exec --json --dangerously-bypass-hook-trust -c 'notify=[]' \
  -c 'projects={"<session folder>"={trust_level="trusted"}}' \
  --sandbox workspace-write -C <session folder> "<message>" < /dev/null
```

- Two-turn sessions ran the first turn to its end, then `codex exec resume`.
  Only tool calls after the resume count.
- The new repository (F) needed the same one-run `-c plugins={...}` override
  as round 1 (V2 plugins on, `claude-toolkit` plugins off), regenerated from
  the current `~/.codex/config.toml`
  (`r2/codex-fresh-plugins-override.txt`). Round 1 "Other findings" point 2
  still applies.
- Every session listed the 22 V2 skills (26 in Salesforce projects) and no
  `claude-toolkit` skill, among 47 to 121 skills in total. 79 of 80 sessions
  got the "Project briefing"; the new repository got none, as expected.
- First skill: the first tool call that reads a `SKILL.md`, from the session
  log in `~/.codex/sessions/`. The runner stopped each session 2 seconds after
  it or when the turn ended. When Codex read several `SKILL.md` files in one
  call, the one listed first counts; the others are shown with "+".

### Match rule

A match is the expected skill opened first. For "none" messages, a match is
no toolkit skill opened. For a mixed message, the expected skill is the one
for the first thing the owner asked. T10 follows `dev/SKILL-INDEX.md` 5.2: "A
recap with a handoff or with leaving: `handoff`, which shows the
`session-summary` table first."

Message #38 used the form round 1 recommended: the message followed by the
pasted email, in one turn.

## Results

Projects: L = Acme Portal, S = Northwind (Salesforce), F = new repository,
N = Acme Shop (Notion tracker on the stand-in Notion). "no skill" = the agent
opened no skill. Kinds: index = section 5.1, vague, mixed, new = other new
requests, none = should open no toolkit skill, retest = round 1 mismatch run
again.

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
| 13 | index | L | Change R-02 so only admins can export. | work-requirements | work-requirements | work-requirements | yes / yes |
| 14 | index | L | How should we build the CSV export? | solution-design | solution-design | solution-design | yes / yes |
| 15 | index | L (focus WI-011) | Split this into smaller pieces. | work-organize | work-organize | work-organize | yes / yes |
| 16 | index | L | Make WI-7 a sub-item of WI-3. | work-organize | work-organize | work-organize | yes / yes |
| 17 | index | L (folders moved) | I moved some folders around. | work-organize | work-organize | work-organize | yes / yes |
| 18 | index | N (card dragged to Done) | I dragged a card to Done in Notion. | work-organize | work-organize | work-organize | yes / yes |
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
| 33 | index | L | I'm going to clear context. (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | handoff | handoff | handoff | yes / yes |
| 34 | index | L | Recap this chat. (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | session-summary | session-summary | session-summary | yes / yes |
| 35 | index | L | What did we do today? (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | session-summary | session-summary | session-summary | yes / yes |
| 36 | index | L | Here's a brain dump: I want the app to email a weekly summary, maybe with a chart, skip anyone who opted out, and I'm not sure if it should go Monday or Friday. | braindump | braindump | braindump | yes / yes |
| 37 | index | L | Explain that like I'm five. (second turn, after: "What does the 05-breakdown stage mean in this project? Short answer.") | explain-simply | explain-simply | explain-simply | yes / yes |
| 38 | index | L | This email reads like AI wrote it: (followed by a pasted email to Dana, 5 lines) | unslop | unslop | unslop | yes / yes |
| 39 | index | L | Get the latest from origin. | pull-latest | pull-latest | pull-latest | yes / yes |
| 40 | index | L | Wipe local and match remote exactly. | reset-to-remote | reset-to-remote | reset-to-remote | yes / yes |
| 41 | index | S (focus WI-001) | Deploy it to the UAT sandbox. | work-finish | work-finish | work-finish (+ sf-deploy-check) | yes / yes |
| 42 | index | S | Load these 500 contacts into production. | sf-data-change | sf-data-change | sf-data-change | yes / yes |
| 43 | index | S | Which Flow type fits this? | sf-architect-solutioning | sf-architect-solutioning | sf-architect-solutioning | yes / yes |
| V01 | vague | L | what's left on the search page? | work-status | work-status | work-status | yes / yes |
| V02 | vague | L | signup page crashes on Safari | work-on | work-on | work-on | yes / yes |
| V03 | vague | L | ok for payments let's just do the hosted Stripe page | work-decide | work-decide | work-decide | yes / yes |
| V04 | vague | L | nah, drop the keyboard shortcuts thing | work-finish | work-finish (after 1 lookup) | work-finish | yes / yes |
| V05 | vague | L | can you double-check the weekly email actually works? | work-check | work-check | work-check | yes / yes |
| V06 | vague | L | hmm, how would you do the two-factor login? | solution-design | solution-design | solution-design | yes / yes |
| V07 | vague | L | did we ever settle how long we keep deleted accounts? | memory-find | memory-find | memory-find | yes / yes |
| V08 | vague | L | btw staging moved to staging2.acme.test | memory-save | memory-save | memory-save | yes / yes |
| M01 | mixed | L | Log a bug: search is slow when you type 3 letters. Then tell me where we are overall. | work-on | work-on | work-on (+ work-status) | yes / yes |
| M02 | mixed | L | What's waiting on me? After that, ship anything that's approved. | work-decide | work-decide | work-decide (+ work-finish) | yes / yes |
| M03 | mixed | L | Remember that Priya reviews all payment code, and add a task on WI-004 for her review. | memory-save | memory-save | memory-save (+ work-on) | yes / yes |
| M04 | mixed | L | Grab the latest from origin and then run the tests. | pull-latest | pull-latest | pull-latest | yes / yes |
| M05 | mixed | L | Merge PR 21, then tell me what's next. | merge-and-clean-up | merge-and-clean-up | merge-and-clean-up (+ work-status) | yes / yes |
| O01 | new | L | Why is WI-004 stuck? | work-status | no skill | work-status | no / yes |
| O02 | new | L | From now on, always run the tests before you tell me something's done. | memory-save | memory-save | memory-save | yes / yes |
| O03 | new | S | Is there a limit on how many scheduled Flows we can have in the org? | sf-architect-solutioning | sf-architect-solutioning | sf-architect-solutioning | yes / yes |
| O04 | new | S | Update the phone numbers on these 200 accounts in prod. | sf-data-change | sf-data-change | sf-data-change | yes / yes |
| O05 | new | L | Switch this project's memory over to Hindsight. | project-setup | project-setup | project-setup | yes / yes |
| O06 | new | L | Make my local copy exactly like origin, I don't care about my local changes. | reset-to-remote | reset-to-remote | reset-to-remote | yes / yes |
| O07 | new | L | Write me a handoff so I can pick this up on my laptop tonight. | handoff | handoff | handoff | yes / yes |
| O08 | new | N (card dragged to Backlog) | I moved the checkout card back to Backlog in Notion. | work-organize | work-organize | work-organize | yes / yes |
| O09 | new | N | What's in progress on the board? | work-status | work-status | work-status | yes / yes |
| O10 | new | L | Go ahead and take the reporting dashboard, run it with a team of agents. | work-delegate | work-delegate | work-delegate | yes / yes |
| O11 | new | L | Make this PR description sound less robotic: (followed by a pasted pull request description, 9 lines) | unslop | unslop | unslop | yes / yes |
| O12 | new | L | put guest checkout under the checkout item | work-organize | work-organize | work-organize | yes / yes |
| O13 | new | L | hang on, what have I asked you for so far? (second turn, after: "Add a note to WI-012 that the search must ignore accents. Nothing else.") | session-summary | session-summary | session-summary | yes / yes |
| O14 | new | L | huh? less jargon please (second turn, after: "How does the weekly summary email decide who gets it? Answer from the code, short.") | explain-simply | no skill | explain-simply | no / yes |
| O15 | new | L | the reporting dashboard requirements feel wrong, go over them with me again | work-requirements | work-requirements | work-requirements | yes / yes |
| X1 | none | L | What does git stash pop do? | none | no skill | no skill | yes / yes |
| X2 | none | L | ok | none | no skill | work-on | yes / no |
| X3 | none | L | Convert 72°F to Celsius. | none | no skill | no skill | yes / yes |
| X4 | none | L | Write a one-line bash command that counts the lines in every .js file. | none | no skill | no skill | yes / yes |
| X5 | none | L | In JavaScript, why is 0.1 + 0.2 not exactly 0.3? | none | no skill | no skill | yes / yes |
| X6 | none | L | Thanks, that helps! | none | no skill | no skill | yes / yes |
| T04 | retest | L | is the CSV export done yet? | work-status | no skill | work-status | no / yes |
| T10 | retest | L | I'm done for today. Recap what we did and write me a handoff. (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | handoff | handoff | session-summary (+ handoff) | yes / no |
| T13 | retest | L | Take it from here on dark mode, I'll check back tonight. | work-delegate | work-delegate | work-delegate | yes / yes |

In 70 of the 71 Claude Code sessions that opened a skill, the `Skill` call was
the first tool call of the test turn. In V04 it came after one lookup
(`toolkit work list` and a search for "keyboard").

## Repeat runs (not counted in the rates)

Every mismatch ran twice more as a fresh session with the same message and
project. The official guidance
(`ai-external-knowledge/anthropic-agent-skills/agentskills-optimizing-descriptions.md`,
"Running multiple times") runs each query about 3 times and passes a
should-open query whose rate is above 0.5, and a should-not-open query whose
rate is below 0.5.

| # | Host | Main run | Repeat 1 | Repeat 2 | Expected result, all 3 runs | Passes the 0.5 rule |
| --- | --- | --- | --- | --- | --- | --- |
| O01 | Claude Code | no skill | no skill | work-status | 1 of 3 | no |
| O14 | Claude Code | no skill | no skill | no skill | 0 of 3 | no |
| T04 | Claude Code | no skill | no skill | no skill | 0 of 3 (0 of 6 with round 1) | no |
| X2 | Codex | work-on | no skill | no skill | 2 of 3 (toolkit skill opened in 1 of 3) | yes |
| T10 | Codex | session-summary (+ handoff) | session-summary (+ handoff) | handoff (+ session-summary) | 1 of 3 first; `handoff` read in the first call 3 of 3 | no, for "first" |

## Variants (not counted in the rates)

| Variant | What ran | Claude Code | Codex |
| --- | --- | --- | --- |
| Candidate `work-status` description | T04 and O01, 3 runs each, with the plugins copied to a scratch folder and only this description changed | work-status 6 of 6 | not run |
| Candidate `explain-simply` description | O14, 3 runs, same way | explain-simply 3 of 3 | not run |
| Neighbours of the two candidates | #01, #35, V01, #37, #38 once each with both candidates in place | all 5 matched | not run |
| Bare "yes" | "yes" in L, fresh session | no skill (1 run) | work-decide in 2 of 4 runs; 3 runs taken to the end recorded nothing and asked which decision "yes" answers |
| Bare "ok" | "ok" in L, taken to the end | not run | no skill; "Ready for the next task" |
| #18 to the end | "I dragged a card to Done in Notion." on the stand-in Notion, no early stop | work-organize, then `toolkit work sync` found the drag; it kept Done, said a card in Done is not an approval, and asked Mike whether he approves the result | not run |

The candidate descriptions were tested only in Claude Code, and only in
scratch copies (`r2/variant-plugins/`). No file in this repository was
changed for them.

## Mismatches: cause and suggested change

### Two toolkit skills overlap (1 mismatch)

**T10 "I'm done for today. Recap what we did and write me a handoff." (Codex: session-summary first, handoff in the same call)**

- What happened: in all 3 runs Codex read `session-summary` and `handoff` in
  one call ("I'll recap this chat, then prepare a handoff ... I'm using the
  session-summary and handoff procedures."). `session-summary` came first in 2
  of 3. Claude Code opened `handoff` first. In round 1 Codex also read both,
  `session-summary` first 3 of 3.
- Cause: the message asks for two jobs, recap first. `session-summary` claims
  "recap this chat" and says "Not for project status or a handoff";
  `handoff` claims leaving "even ... with a recap". Codex loads the skill for
  each job the message names, in the order the owner named them.
- Effect for Mike: none seen. Both skills are loaded before any work, and
  `handoff` step 6 now opens `session-summary` and shows its table first, so
  the result is the same either way.
- Suggested change: no description change. `session-summary` is at 298 of
  300 characters, so a longer "Not for" clause does not fit. Change this
  test's pass rule to "`handoff` opened in the first call". By that rule T10
  passes in Codex 3 of 3.

### Not an overlap (4 mismatches)

**O01 "Why is WI-004 stuck?" and T04 "is the CSV export done yet?" (Claude Code: no skill)**

- What happened: Claude Code answered correctly without a skill. T04: no tool
  call at all ("No. The CSV export (WI-001) hasn't been started yet. Its
  requirements are approved, and it is marked Ready."). O01: one
  `toolkit work show WI-004`, then a correct answer (the design choice waits
  on Mike, with the recommendation). Codex opened `work-status` for both.
- Cause: the session briefing already lists each active item with its stage
  and next action, so a question about one item can be answered from it. The
  `work-status` description says "Use when the owner asks for project or item
  status" and gives only project-wide examples ("where are we", "what's
  next", "catch me up"). The skill-writing guide (Part 1.1, point 4) notes an
  agent may skip a skill for a request it can answer directly. The briefing
  line "Requests go through the matching skill first" did not change this.
- Suggested description for `work-status` (295 characters; tested 6 of 6 in
  Claude Code, neighbours #01, #35, V01 still matched):
  "Reports where the project's work items stand: progress, blockers, the next
  item, and decisions waiting on the owner. Use whenever the owner asks about
  project or item status, even one item, for example "where are we", "what's
  next", or "is X done yet". Not for a chat recap; use session-summary."
  It drops "catch me up" to stay under 300 characters; no test message used
  that phrase. Section 1 of `dev/SKILL-INDEX.md` must change with it
  (`check-skills.mjs` compares them), and Codex needs a `work` version bump
  and re-add.

**O14 "huh? less jargon please", second turn (Claude Code: no skill)**

- What happened: in all 3 runs Claude Code rewrote its previous answer in
  plainer words without opening `explain-simply`. The rewrite was good (short
  bullets, "UTC" defined). Codex opened `explain-simply`.
- Cause: the description lists "explain it like I'm five", "simpler", "put
  that in plain bullets", and "I don't get it". "Less jargon" is none of
  them, and a plain rewrite is something Claude Code does without a skill.
- Suggested description for `explain-simply` (289 characters; tested 3 of 3
  in Claude Code, neighbours #37 and #38 still matched):
  "Re-explains the last answer, a plan, or a named document as short plain
  bullets, keeping every number, name, and path. Use whenever the owner finds
  an answer hard to follow, for example "explain it like I'm five",
  "simpler", "less jargon", "put that in plain bullets", or "I don't get it"."
  It drops "types /explain-simply": typing the command starts the skill
  without the description. Section 1 of the index must change with it, and
  Codex needs a `session-skills` version bump and re-add.

**X2 "ok" in a fresh session (Codex: work-on)**

- What happened: Codex said "I'll continue WI-012 from the current focus and
  finish the customer search results task", opened `work-on`, and read
  project files. The runner stopped it 2 seconds later; no work item, memory,
  or code file had changed (checked with `diff -rq` against the project).
  In 3 more Codex runs of "ok" (2 repeats and 1 taken to the end) it opened
  nothing and said it was ready. Claude Code asked whether to continue WI-012.
- Cause: not two skills competing. The briefing's current focus says "Next
  session starts with: Finish WI-012 P1-T02", and Codex once read "ok" as
  consent to that plan. `dev/SKILL-INDEX.md` 5.1 says a bare "ok" starts no
  skill and the agent asks what the owner is approving. By the 0.5 rule this
  message passes (toolkit skill opened in 1 of 4 runs).
- Suggested change: one briefing line in
  `plugins/toolkit/lib/project/brief.mjs`, beside "Requests go through the
  matching skill first": "A bare "ok", "yes", or "looks good" with no
  question asked in this chat approves nothing and starts nothing: ask what
  the owner wants." This is toolkit code, so it is the lead's call. Not
  tested.

## Other findings

1. **Design approval fails on the Notion tracker when the design text has no
   header lines.** On the stand-in Notion, `toolkit work design WI-001
   --create --text "<text without the **Design status:** line>"` followed by
   `toolkit work approve WI-001 --design --by "Mike Rihm"` exits 1 with
   "Saved but not verified: the design of WI-001 does not read back as
   approved." The design then reads back with `status: proposed` and
   `approved: "2026-09-27 by Mike Rihm"`. The same steps on the local tracker
   succeed, and on Notion they succeed when the design is created from the
   template. Not investigated further. Reproduction: scratch folder
   `r2/try/nd2`. The test project used template designs for its Notion items.
2. **The test projects mix two sets of dates.** Toolkit commands record
   approvals with the build date (2026-09-27), while the history text the
   builder wrote says 2026-09-25. Claude Code noticed it in O01 and a repeat
   ("The item's dates don't agree"). It came after the routing choice and did
   not change any first skill. A later round should let the commands write
   the history rows, or write history dates that match.
3. **Codex still cannot start `project-setup` in a new repository** without
   the one-run plugin override (round 1, other findings, point 2). Unchanged.
4. **The Notion CLI is still signed out.** Mike needs to run `ntn login`
   before any real Notion run. This round used the toolkit's stand-in Notion
   instead.
5. **Codex opened two skills in one call in 6 sessions**: #41, M01, M02,
   M03, M05, and T10. Of the mixed messages, only M04 opened one skill. In
   all 6 but T10 the expected skill was listed first.
6. **The `work-decide` fix from round 0 holds.** A bare "yes" with two
   decisions waiting recorded nothing in any Codex run taken to the end
   (`diff -rq` against the project: only the toolkit's own state file
   differs). The run that opened `work-decide` said "A bare "yes" can approve only a
   yes-or-no question asked earlier in this chat, so I haven't recorded an
   approval."

## Not covered

- Each message ran once per host. Only the 5 mismatches ran 3 times. The
  official guidance runs every query about 3 times.
- The candidate descriptions were tested in Claude Code only.
- Notion ran on the toolkit's stand-in Notion, not on Mike's Notion.
- #23 "Merge PR 14" and M05 "Merge PR 21" could not be carried out: there is
  no GitHub repository. Both hosts still opened `merge-and-clean-up` first.
- The `claude-toolkit` plugins were off in every run (index 5.4 point 6 also
  asks for a run with them on). Claude Code saw no user skills
  (`--setting-sources project,local`); Codex saw Mike's other Codex skills.

## Evidence

In the scratch folder
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/r2/`
(temporary):

- `build.py` (with `r1_base.py`, `r1_sf.py`): builds the test projects.
  `proj/`: the projects as built, and the stand-in Notion data files
  `proj/notion*.fake-notion.json`.
- `rt/messages.json`: the 80 messages, projects, and expected skills.
  `rt/claude_run.py`, `rt/codex_run.py`, `rt/drive.py`, `rt/repeats.py`,
  `rt/variants.py`: the runners. `rt/summarize.py`, `rt/summary-main.json`:
  the reader and every main-run result.
- `rt/logs/claude-<id>.jsonl` and `.result.json`: Claude Code stream and
  result per session. `rt/logs/codex-<id>.turn*.jsonl`, `.rollout0.jsonl`,
  `.result.json`: Codex events, session log, and skills read. Repeats are
  `R1-<id>` and `R2-<id>`; variants `VD-*`, `VY-*`, `VE-*`.
- `rt/sessions/<host>-<id>/`: each session's project copy afterward.
- `variant-plugins/`: the scratch plugin copies with the two candidate
  descriptions.
- `skills-snapshot.sha256`: the skill file hashes checked before and after.
  `codex-config-before-r2.toml`: `~/.codex/config.toml` before the re-add.
  `readd-work.txt`, `readd-session-skills.txt`: the `codex plugin add` output.

In the toolkit-v2 repository this check changed only this report. Nothing was
staged or committed. Outside it: the `work` and `session-skills` Codex plugin
cache folders were replaced by 0.2.4 and 0.2.2, and Codex wrote its session
logs to `~/.codex/sessions/2026/09/27/`. `~/.codex/config.toml` has the same
content as before. `~/.config/toolkit-v2/` was not written, and no session
transcript went to `~/.claude/projects/` (`--no-session-persistence`).
