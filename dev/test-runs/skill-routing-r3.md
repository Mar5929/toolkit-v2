# Skill routing check, round 3 (2026-09-27)

Each owner message ran once as a fresh session in Claude Code and once in
Codex, using the skill files as they stand in the working tree at 19:09 on
2026-09-27. That is after the round 2 fixes: new descriptions for
`work-status`, `explain-simply`, and `session-summary`, and the bare "ok" rule
in `work-on` step 1. The skill each agent opened first was compared with the
skill the index expects. Messages: all 43 from `dev/SKILL-INDEX.md` section
5.1, 28 that are new to this round (8 vague, 6 mixed, 8 other requests, 6
that should open no toolkit skill), and the 5 round 2 mismatches run again.
Previous runs: `skill-routing.md` (round 0), `skill-routing-r1.md`, and
`skill-routing-r2.md`.

**Result: passed the 0.90 bar in both hosts.**

| Host | First skill matched | Rate | Index messages (43) | New messages (28) | Round 2 mismatches (5) | Should open a skill (69) | Should open none (7) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Claude Code 2.1.280 (claude-opus-5-5) | 74 of 76 | 0.974 | 1.000 | 0.929 | 1.000 | 0.971 | 1.000 |
| Codex 0.157.0 (gpt-6-sol, high) | 72 of 76 | 0.947 | 1.000 | 0.857 | 1.000 | 0.942 | 1.000 |

Earlier rounds: round 0 Claude Code 0.81, Codex 0.94; round 1 0.923, 0.938;
round 2 0.963, 0.975.

- 6 mismatches in total: 2 in Claude Code, 4 in Codex.
- **All 6 come from two toolkit skills that both claim the message.** The
  pairs: `work-requirements` and `solution-design` (M14, both hosts),
  `work-requirements` and `work-on` (O21, Claude Code), `work-on` and
  `solution-design` (V11, Codex), `work-decide` and `work-status` (V15,
  Codex), `sf-component-tracker` and `work-on` (O27, Codex).
- No mismatch came from a skill outside the toolkit, from a skipped skill, or
  from a message that should open no skill.
- By message kind (Claude Code / Codex): vague 8 of 8 / 6 of 8, mixed 5 of 6
  / 5 of 6, other new 7 of 8 / 7 of 8, no skill 6 of 6 / 6 of 6, round 2
  mismatches 5 of 5 / 5 of 5.
- All 5 round 2 mismatches now match in both hosts: O01 "Why is WI-004
  stuck?" and T04 "is the CSV export done yet?" (`work-status`), O14 "huh?
  less jargon please" (`explain-simply`), T10 recap with a handoff
  (`handoff`), and X2 "ok" (no skill).
- Two tested description changes fix two of the six mismatches (V15 and
  O27) in 3 of 3 runs in both hosts, and none of the 18 neighbour messages
  got a worse result. M14 needs no change (the expected skill was a poor choice), V11
  has no effect on Mike, and O21 needs a body change, not a description
  change. See "Mismatches" and "Tested candidate descriptions".

## How the check ran

### Skill files and versions

- The lead had already raised the patch version of the two plugins whose
  skills changed since the last Codex install: `work` 0.2.4 to 0.2.5 and
  `session-skills` 0.2.2 to 0.2.3, in both manifests, with
  `metadata.version` 0.2.5 in `.claude-plugin/marketplace.json`. This check
  changed no version and no file in the repository other than this report.
- `node dev/tools/check-skills.mjs` at 19:09: 29 SKILL.md files, 0 failures.
- SHA-256 hashes of every `SKILL.md` under `plugins/` (the scaffold's
  Salesforce project skills included), the scaffold `AGENTS.md`,
  `plugins/toolkit/lib/project/brief.mjs`, and all 12 plugin manifests were
  saved at 19:09 and checked again at 19:28: no file changed. At 19:29 the
  whole `plugins/` folder was still identical to the copy taken at 19:09.

### Codex install

`AGENTS.md` says tests never write to Mike's real `~/.codex`. So Codex ran
from its own scratch home: a byte copy of `~/.codex/config.toml`, a link to
`~/.codex/auth.json`, and copies of `~/.codex/skills`, `~/.codex/rules`, and
the plugin cache without the toolkit-v2 folder. `~/.codex/hooks.json` (the
voice reply hook) was not copied.

- `CODEX_HOME=<scratch home> codex plugin add <name>@toolkit-v2` ran for all
  six plugins and installed `toolkit` 0.2.3, `work` 0.2.5, `memory` 0.2.3,
  `session-skills` 0.2.3, `git-workflows` 0.2.3, and
  `sf-architect-solutioning` 0.2.1.
- `diff -rq` between each source plugin folder and its cached copy: 0
  differences for all six. The cached `work-status`, `explain-simply`, and
  `session-summary` files carry the new descriptions, and the cached
  `work-on` carries the bare "ok" line.
- `codex plugin add` set the six plugins to `enabled = true` in the scratch
  config. The scratch config was then put back to the byte copy of the real
  one (`enabled = false`; each project's `.codex/config.toml` turns them on).
- Mike's real Codex was not touched: `~/.codex/config.toml` is byte for byte
  the same as before, no session log was added under `~/.codex/sessions/`,
  and its cache still holds `work` 0.2.4 and `session-skills` 0.2.2. **Mike's
  own Codex does not have the round 2 description changes yet** (see Other
  findings, point 6).

### Test projects

Rebuilt for this round with the round 2 builder, with toolkit commands only,
in the scratch folder
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/route3/proj/`.
After the build, `toolkit work sync` reported "Nothing changed" and
`toolkit work validate` reported every item clean. Every session ran in its
own copy of its project, with its own copy of the project's Git remote and,
for Notion, its own copy of the Notion data.

- **L, "Acme Portal"**: local tracker, built-in memory, Node code, 14 items
  at stages 01 to Done (full list in `skill-routing-r2.md`), `DECISIONS.md`
  D-1 to D-3, eight memory records with two near-duplicates and one conflict
  (deploys on Tuesday or Friday), a local remote that has diverged by one
  commit each way. Focus WI-012. Variants: focus WI-005, WI-006, WI-010, or
  WI-011; no dark mode item; WI-007 moved under WI-003 and WI-002 renamed by
  hand. New this round: **L (D-4 not committed)**, with `toolkit decision add`
  run for "The server moves to Node 22 LTS in November." and not committed,
  for O25.
- **S, "Northwind Service Cloud"**: `toolkit init --salesforce`, local
  tracker, WI-001 Account address sync (13, result approved), WI-002 Contact
  import (`data-load`), WI-003 Case escalation (04). Variant focus WI-001.
  New this round: **S (new Case field)**, with
  `force-app/main/default/objects/Case/fields/Escalation_Level__c.field-meta.xml`
  added and not tracked, for O27.
- **F**: a new Git repository with no toolkit files (#30).
- **N, "Acme Shop"**: Notion tracker, built-in memory, 4 items. The Notion
  CLI is still signed out (`ntn doctor`: "Token source ! no token found"), so
  N runs on the toolkit's stand-in Notion
  (`plugins/toolkit/tests/notion/fake-ntn.mjs`). Variant: "Weekly summary
  email" dragged to Done (#18).

### Claude Code

The round 2 command, with `--plugin-dir` pointing at a copy of `plugins/`
taken at 19:09 (identical to the repository, see above), so that other agents
editing the repository could not change a run half way:

```sh
claude -p --setting-sources project,local --strict-mcp-config --no-session-persistence \
  --settings '{"enabledPlugins":{"toolkit@inline":true,"work@inline":true,"memory@inline":true,"session-skills@inline":true,"git-workflows@inline":true}}' \
  --plugin-dir <copy>/toolkit --plugin-dir <copy>/work --plugin-dir <copy>/memory \
  --plugin-dir <copy>/session-skills --plugin-dir <copy>/git-workflows \
  --input-format stream-json --output-format stream-json --verbose \
  --permission-mode acceptEdits --max-turns 8 \
  --allowedTools 'Bash(toolkit *)' 'Bash(node *)' 'Bash(git *)' Read Write Edit Glob Grep Skill
```

Salesforce projects added `sf-architect-solutioning` the same way.

- All 76 sessions loaded exactly the V2 plugins (`@inline`) plus Claude
  Code's three built-in plugins, with no `plugin_errors`. Each listed the 22
  V2 skills (26 in the 5 Salesforce sessions). No user skill and no
  `claude-toolkit` skill. The SessionStart hook ran in all 76.
- First skill: the first `Skill` call (or `Read` of a `SKILL.md`) in the
  test turn. In all 69 sessions that opened a skill, it was the first tool
  call of the test turn.

### Codex

The round 2 command, with `CODEX_HOME` set to the scratch home:

```sh
CODEX_HOME=<scratch home> codex exec --json --dangerously-bypass-hook-trust -c 'notify=[]' \
  -c 'projects={"<session folder>"={trust_level="trusted"}}' \
  --sandbox workspace-write -C <session folder> "<message>" < /dev/null
```

- Two-turn sessions ran the first turn to its end, then `codex exec resume`;
  only tool calls after the resume count. F used the one-run plugin override
  from round 2.
- Every session's skill list held the 22 V2 skills (26 in Salesforce
  projects) and no `claude-toolkit` skill, among 48 (52) in total. 75 of 76
  sessions got the "Project briefing"; F got none, as expected.
- First skill: the first tool call that reads a `SKILL.md`, from the session
  log. When Codex read several in one call, the one listed first counts; the
  others are shown with "+". The reader was fixed during this round (Other
  findings, point 1) and every Codex log was read again with the fixed
  reader.

### Match rule

A match is the expected skill opened first. For "none" messages, a match is
no toolkit skill opened. For a mixed message, the expected skill is the one
for the first thing the owner asked. The expected skill was written down
before any run.

## Results

Projects: L = Acme Portal, S = Northwind (Salesforce), F = new repository,
N = Acme Shop (Notion tracker on the stand-in Notion). "no skill" = the agent
opened no skill. Kinds: index = section 5.1, vague, mixed, new = other new
requests, none = should open no toolkit skill, retest = round 2 mismatch run
again.

| # | Kind | Project | Owner message | Expected | Claude Code | Codex | Match (Claude / Codex) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | index | L | Where are we? | work-status | work-status | work-status | yes / yes |
| 02 | index | L | What's next? | work-status | work-status | work-status | yes / yes |
| 03 | index | L (focus WI-005) | Keep going. | work-on | work-on | work-on | yes / yes |
| 04 | index | L | Let's build the login page. | work-on | work-on | work-on (+ impeccable) | yes / yes |
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
| V11 | vague | L | the csv thing, can we get going on it? | work-on | work-on | solution-design | yes / no |
| V12 | vague | L | wait, do we deploy on tuesdays or fridays? | memory-find | memory-find | memory-find | yes / yes |
| V13 | vague | L (focus WI-010) | profile page is good to go, push it out | work-finish | work-finish | work-finish | yes / yes |
| V14 | vague | L | search results still don't show up, sort it out | work-on | work-on | work-on | yes / yes |
| V15 | vague | L | any loose ends I need to deal with? | work-decide | work-decide | work-status (+ work-decide) | yes / no |
| V16 | vague | L | not sure about the 2fa remember-this-device thing, 30 days feels way too long | work-requirements | work-requirements | work-requirements | yes / yes |
| V17 | vague | L (focus WI-011) | the reporting dashboard is way too big to do in one go | work-organize | work-organize | work-organize | yes / yes |
| V18 | vague | L | hmm, did we ever look at Paddle? | memory-find | memory-find | memory-find | yes / yes |
| M11 | mixed | L | Pull the latest, then keep going on the search page. | pull-latest | pull-latest | pull-latest (+ work-on) | yes / yes |
| M12 | mixed | L | Remind me to call the accountant, and what's next? | memory-save | memory-save | memory-save (+ work-status) | yes / yes |
| M13 | mixed | L | Cancel the keyboard shortcuts item, and log a bug: the profile page shows the wrong time zone. | work-finish | work-finish | work-finish (+ work-on) | yes / yes |
| M14 | mixed | L | Check the 2FA spec, then give me design options. | work-requirements | solution-design | solution-design | no / no |
| M15 | mixed | L | Tidy up memory, then tell me what we decided about deleted accounts. | memory-tidy | memory-tidy | memory-tidy (+ memory-find) | yes / yes |
| M16 | mixed | L (focus WI-006) | Test the weekly email against what I asked for, and if it passes, ship it. | work-check | work-check | work-check (+ work-finish) | yes / yes |
| O21 | new | L | I want customers to be able to download their invoices as PDFs. Ask me questions before you write anything down. | work-requirements | work-on | work-requirements | no / yes |
| O22 | new | L | Note for later: Priya's last day is October 15, so payment code reviews need someone else after that. | memory-save | memory-save | memory-save | yes / yes |
| O23 | new | L (folders moved) | Put guest checkout back at the top level, it shouldn't be under checkout. | work-organize | work-organize | work-organize | yes / yes |
| O24 | new | L | toolkit doctor is complaining about something, can you fix the setup? | project-setup | project-setup | project-setup | yes / yes |
| O25 | new | L (D-4 not committed) | The Node 22 decision is in DECISIONS.md now. Commit it straight to main. | publish-docs | publish-docs | publish-docs | yes / yes |
| O26 | new | S (focus WI-001) | Before I deploy WI-001 to UAT, what else would go out with it? | sf-deploy-check | sf-deploy-check | sf-deploy-check | yes / yes |
| O27 | new | S (new Case field) | I added an Escalation Level field on Case in force-app. Make sure it's tracked for the case escalation deploy. | sf-component-tracker | sf-component-tracker | work-on (+ sf-component-tracker) | yes / no |
| O28 | new | N | What's waiting on me in Notion? | work-decide | work-decide | work-decide | yes / yes |
| X11 | none | L | What's the difference between let and const in JavaScript? | none | no skill | no skill | yes / yes |
| X12 | none | L | cool | none | no skill | no skill | yes / yes |
| X13 | none | L | Give me a regex that matches a US ZIP code. | none | no skill | no skill | yes / yes |
| X14 | none | L | How many seconds are in a week? | none | no skill | no skill | yes / yes |
| X15 | none | L | What does git rebase -i do? Just explain, don't run anything. | none | no skill | no skill | yes / yes |
| X16 | none | L | Good morning! | none | no skill | no skill | yes / yes |
| O01 | retest | L | Why is WI-004 stuck? | work-status | work-status | work-status | yes / yes |
| O14 | retest | L | huh? less jargon please (second turn, after: "How does the weekly summary email decide who gets it? Answer from the code, short.") | explain-simply | explain-simply | explain-simply | yes / yes |
| T04 | retest | L | is the CSV export done yet? | work-status | work-status | work-status | yes / yes |
| X2 | retest | L | ok | none | no skill | no skill | yes / yes |
| T10 | retest | L | I'm done for today. Recap what we did and write me a handoff. (second turn, after: "What's WI-012 about? Short answer, don't change anything.") | handoff | handoff | handoff | yes / yes |

Three skills had an owner message of their own for the first time this round:
`publish-docs` (O25) and `sf-deploy-check` (O26) matched in both hosts, and
`sf-component-tracker` (O27) matched in Claude Code. `work-decide` also
matched on the Notion tracker (O28).

## Repeat runs (not counted in the rates)

Every message with a mismatch in either host ran twice more in both hosts, as
fresh sessions. The official guidance runs each query about 3 times and
passes a should-open query whose rate is above 0.5.

| # | Expected | Claude Code, 3 runs | Codex, 3 runs | Passes the 0.5 rule (Claude / Codex) |
| --- | --- | --- | --- | --- |
| V11 | work-on | work-on 3 of 3 | solution-design 2, work-on 1 | yes / no |
| V15 | work-decide | work-decide 3 of 3 | work-status first 3 of 3 (work-decide in the same call 1 of 3) | yes / no |
| M14 | work-requirements | solution-design 3 of 3 | solution-design 1; work-requirements first 2, each with solution-design in the same call | no / yes |
| O21 | work-requirements | work-on 3 of 3 | work-requirements 3 of 3 | no / yes |
| O27 | sf-component-tracker | sf-component-tracker 3 of 3 | work-on first 2 (both with sf-component-tracker in the same call); sf-component-tracker alone 1 | yes / no |

Two sessions also ran to the end:

- **Claude Code O21**: `work-on`, then `toolkit work list` and a search for
  "invoice". It wrote nothing, as the owner asked, said no item covers
  invoices, and asked six questions in one message (invoice source, who can
  download, where, which invoices, one or many, required PDF layout), the
  first with a recommendation. It ended "Once you've answered, I'll create
  the work item using your words and write the requirements for you to
  approve."
- **Codex M14**: read `work-requirements` and `solution-design` in one call.
  The independent spec check found that R-01 ("every staff sign-in") and R-03
  (skip the second step for 30 days) conflict, and that the second-step
  method and recovery-code use are open. It recorded Q-01 to Q-03 in WI-013,
  wrote two provisional design options (authenticator app, recommended; email
  code), and asked the first question with a recommendation.

## Mismatches: cause and suggested change

All six mismatches come from two toolkit skills that both claim the message.

### M14 "Check the 2FA spec, then give me design options." (both hosts: solution-design)

- What happened: Claude Code opened `solution-design` in 3 of 3 runs. Codex
  opened `solution-design` in 1 of 3 and read `work-requirements` and
  `solution-design` together, `work-requirements` first, in 2 of 3.
- Cause: overlap of `work-requirements` ("check the spec") and
  `solution-design` ("give me design options"). WI-013's requirements are
  already approved, and the briefing says "Continues with solution-design".
  `work-requirements` step 1 says: requirements already approved and no
  change asked, open the skill the lifecycle's "Continue with" column names,
  which is `solution-design`. `solution-design` step 2 runs the same spec
  check (the `requirements-analyst` agent) before any design.
- Effect for Mike: none seen. The spec check runs either way, and the Codex
  run taken to the end found a real conflict between R-01 and R-03.
- Suggested change: no description change. The expected skill in this test
  was a poor choice: for an item with approved requirements, "check the spec,
  then design it" is `solution-design`'s job. Future rounds should expect
  `solution-design` here.

### O21 "I want customers to be able to download their invoices as PDFs. Ask me questions before you write anything down." (Claude Code: work-on)

- What happened: Claude Code opened `work-on` in 3 of 3 runs, 4 of 4 with the
  run taken to the end. Codex opened `work-requirements` in 3 of 3.
- Cause: overlap of `work-on` (starts new work: "build, add, fix, or change
  something") and `work-requirements` ("ask me questions"; its step 1 creates
  the item when none exists). The description says "Use when an item's
  requirements are missing", and here no item exists yet, so Claude Code
  reads the request as new work for `work-on`.
- Effect for Mike: small. The run taken to the end kept to his words and
  wrote nothing, but asked six questions in one message. `work-requirements`
  asks one question at a time, each with a recommendation, and writes each
  answer into the item before the next.
- A candidate description (300 characters) was tested and **did not help**:
  "... Use when requirements are missing, even for a new idea, or the owner
  changes, adds, or drops one at any stage, or says "grill me", "ask me
  questions", or "check the spec"." Claude Code still opened `work-on` 3 of
  3. Not recommended.
- Suggested change (not tested): one sentence in `work-on` step 3, the
  sizing step: "The owner asks to be asked first ("ask me questions", "grill
  me") about new work: open `work-requirements`, which creates the item."
  The first skill stays `work-on`, but the interview then follows
  `work-requirements`.

### V11 "the csv thing, can we get going on it?" (Codex: solution-design)

- What happened: Codex opened `solution-design` in 2 of 3 runs and `work-on`
  in 1. Claude Code opened `work-on` 3 of 3.
- Cause: overlap of `work-on` ("Starts, resumes ... a work item") and
  `solution-design` ("Use when approved requirements need a design"). WI-001
  has approved requirements and no design, and the briefing line for WI-001
  ends "Continues with solution-design." Codex goes straight to the skill the
  briefing names.
- Effect for Mike: none here. `work-on` step 5 would have opened
  `solution-design` for this item. One step is skipped when `work-on` is
  skipped: step 4, the delivery offer through `work-delegate` for an item
  whose `delivery` is `not-offered`. WI-001 already records `owner-led`, so
  nothing was lost in this run. No other work skill checks `not-offered`.
- Suggested change: no description change. Either count the skill the
  briefing names as a match for "get going on <item>", or, if the lead wants
  the delivery offer to hold on this path, add the `not-offered` check to
  the start of the stage skills. The second is a body change and was not
  tested.

### V15 "any loose ends I need to deal with?" (Codex: work-status first)

- What happened: Codex read `work-status` first in 3 of 3 runs, once with
  `work-decide` in the same call. Claude Code opened `work-decide` 3 of 3.
- Cause: overlap of `work-status` and `work-decide`. The `work-status`
  description lists "decisions waiting on the owner" as part of its report,
  and "loose ends" sounds like a status question. `work-decide` claims only
  "what do you need from me".
- Effect for Mike: he gets a status report that lists the two waiting
  decisions, instead of being taken through them one at a time with a
  recommendation each.
- **Tested candidate for `work-status` (297 characters):**
  "Reports where the project's work items stand: progress, blockers, and the
  next item. Use whenever the owner asks about project or item status, even
  one item, for example "where are we", "what's next", or "is X done yet".
  Not for what he must decide (work-decide) or a chat recap
  (session-summary)."
  Result: V15 `work-decide` 3 of 3 in Codex and 3 of 3 in Claude Code.
  Neighbours #01, #02, #08, T04, O01, and M12 matched in both hosts (1 run
  each). The body still reports the waiting decisions; only the description
  stops naming them. Section 1 of `dev/SKILL-INDEX.md` must change with it
  (`check-skills.mjs` compares them), and Codex needs a `work` version bump
  and re-add.

### O27 "I added an Escalation Level field on Case in force-app. Make sure it's tracked for the case escalation deploy." (Codex: work-on first)

- What happened: Codex read `work-on` and `sf-component-tracker` in one call,
  `work-on` first, in 2 of 3 runs, and `sf-component-tracker` alone in 1.
  Claude Code opened `sf-component-tracker` 3 of 3.
- Cause: overlap of `work-on` ("add ... or change something") and
  `sf-component-tracker` ("Use when Salesforce metadata under force-app/ is
  added ..."), plus the project's `AGENTS.md` line "Anything to build, add,
  fix, or change ...: the `work-on` skill". Round 0 saw the same pattern
  with `sf-data-change` (#42 in Codex). "Use first, before work-on" in the
  `sf-data-change` description fixed it: #42 has matched in both hosts in
  every run since (round 2, and the main and candidate runs of this round).
- Effect for Mike: small. Both skills are loaded before any work, and
  `work-on` step 7 runs `sf-component-tracker` on each metadata change. The
  risk is that `work-on` also opens a new work item for a field that belongs
  to WI-003.
- **Tested candidate for `sf-component-tracker` (299 characters):**
  "Keeps the component tracker CSV, the master and per-work-item package.xml
  files, destructiveChanges.xml, and manual steps in sync. Use first, before
  work-on, when Salesforce metadata under force-app/ is added, changed,
  renamed, or deleted, a deploy result comes back, or a deploy needs manual
  steps."
  Result: O27 `sf-component-tracker` alone 3 of 3 in Codex and 3 of 3 in
  Claude Code. Neighbours #41 (`work-finish`), #42 and "Update the phone
  numbers on these 200 accounts in prod." (`sf-data-change`), #43
  (`sf-architect-solutioning`), and O26 (`sf-deploy-check`) matched in both
  hosts (1 run each).
- This skill lives in the model project (`.claude/skills/` and
  `.agents/skills/`), so the change is a model change: it needs Mike's
  approval, goes into the model, and reaches the scaffold through
  `node dev/tools/import-model.mjs`. Index section 1 row 25 changes with it.

## Tested candidate descriptions

The candidates ran in scratch copies only: a copy of `plugins/` with the new
`work-status` and `work-requirements` text, a second scratch Codex home whose
`toolkit-v2` marketplace points at that copy (`work` re-added there, cache
checked with `diff -rq`), and copies of the Salesforce projects with the new
`sf-component-tracker` text in both skill folders. No file in this repository
was changed for them. 54 sessions: 3 runs per host of V15, O21, and O27, and
1 run per host of 18 neighbours.

| Candidate | Target | Claude Code | Codex | Neighbours (both hosts) |
| --- | --- | --- | --- | --- |
| `work-status` (297 chars) | V15 | work-decide 3 of 3 | work-decide 3 of 3 | #01, #02, #08, T04, O01, M12: all matched |
| `work-requirements` (300 chars) | O21 | work-on 3 of 3 (no change) | work-requirements 3 of 3 | #04, #11, #12, #13, V16, V11: all matched, except Codex V11 (solution-design, as in the main run); M14: Claude Code solution-design, Codex work-requirements |
| `sf-component-tracker` (299 chars) | O27 | sf-component-tracker 3 of 3 | sf-component-tracker 3 of 3 | #41, #42, #43, O26, and the 200-account phone update: all matched |

Recommended: the `work-status` and `sf-component-tracker` candidates. Not
recommended: the `work-requirements` candidate.

## Other findings

1. **The Codex runner missed two ways Codex reads a skill.** Codex sometimes
   runs `cat SKILL.md` with the skill's folder as the command's working
   folder, and sometimes reads two skills with one shell brace path
   (`skills/{work-finish,work-on}/SKILL.md`). The round 2 reader matched only
   a full `skills/<name>/SKILL.md` path, so #21 and M13 first showed "no
   skill". The fixed reader (`route3/rt/skillreads.py`) handles both and no
   longer counts a search pattern such as `rg -g 'SKILL.md'` as a read. Every
   Codex log of this round was read again: #21 and M13 became `work-finish`
   (both matches), and three results changed only their source label. The 81
   one-turn Codex logs of round 2 were also read again with the fixed reader:
   no first skill changed.
2. **One skill from outside the toolkit was read.** Codex #04 read
   `impeccable`, one of Mike's own Codex skills, in the same call as
   `work-on`, with `work-on` listed first. Every other `SKILL.md` read in the
   main run came from the toolkit-v2 plugin cache or the project's own
   `.agents/skills/` folder.
3. **Codex read two skills in one call in 9 of 76 sessions**: #04, #41, M11,
   M12, M13, M15, M16, O27, and V15. In 7 of them the expected skill was
   listed first.
4. **Codex refused to ship WI-010 in the test project (#21).** Before the
   reader fix, this session was not stopped early and ran to the end. It
   found that WI-010's code has only a form, with no save handler and no
   tests, so the recorded result approval is not backed by the code. It said
   it would not mark the item shipped and moved WI-010 to `10-bug-fixing`.
   That is correct behavior. The cause is the test builder, which writes
   minimal code for items it marks as built. A later round should give the
   items at stages 09 to 13 code that meets their requirements.
5. **The round 2 fixes hold.** Bare "ok" (X2), "cool", and "Good morning!"
   opened no skill in either host. Claude Code asked whether to continue
   WI-012; Codex said it was ready and asked what to work on.
6. **Mike's own Codex still runs the old skill text.** His cache holds `work`
   0.2.4 and `session-skills` 0.2.2, without the round 2 changes to
   `work-status`, `explain-simply`, `session-summary`, and `work-on`. To pick
   them up, he (or the lead, with his OK, since `AGENTS.md` keeps tests out
   of `~/.codex`) runs `codex plugin add work@toolkit-v2` and
   `codex plugin add session-skills@toolkit-v2`, then puts `enabled = false`
   back for the six toolkit-v2 plugins in `~/.codex/config.toml`
   (`codex plugin add` turns them on for the whole computer).
7. **Unchanged from round 2:** the test builder's history rows carry dates
   (2026-09-24 to 2026-09-26) that differ from the approval dates the
   toolkit commands record (2026-09-27); the Notion CLI is still signed out;
   F still needs the one-run plugin override in Codex.

## Not covered

- Each message ran once per host. Only the 5 messages with a mismatch ran 3
  times per host.
- The candidates ran 3 times on their targets and once on each neighbour.
- Notion ran on the toolkit's stand-in Notion, not on Mike's Notion.
- #23 "Merge PR 14" still cannot be carried out: there is no GitHub
  repository. Both hosts opened `merge-and-clean-up` first.
- The `claude-toolkit` plugins were off in every run. Claude Code saw no user
  skills (`--setting-sources project,local`); Codex saw Mike's other Codex
  skills (copied into the scratch home).

## Evidence

In the scratch folder
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/route3/`
(temporary):

- `build.py` (with `r1_base.py`, `r1_sf.py`): builds the test projects in
  `proj/`, including the new variants `local-docs` and `sf-field`, and the
  candidate variants `sf-v`, `sf-deploy-v`, `sf-field-v`.
- `skills-snapshot.sha256`, `snapshot-time.txt`: the hashes checked before and
  after. `plugins-snapshot/`: the plugin copy Claude Code ran.
- `codex-home/`: the scratch Codex home; `codex-readd.txt`: the six
  `codex plugin add` results; `codex-config-real-before.toml`: Mike's Codex
  config before the run, for comparison.
- `tkv2-var/`, `codex-home-var/`: the candidate plugin copy and its Codex
  home.
- `rt/messages.json`: the 76 messages, projects, and expected skills.
  `rt/claude_run.py`, `rt/codex_run.py`, `rt/skillreads.py`, `rt/drive.py`,
  `rt/repeats3.py`, `rt/variants3.py`: the runners. `rt/reparse.py`,
  `rt/summarize.py`, `rt/summary.json`: the readers and every main-run
  result. `rt/drive-all.out`, `rt/repeats.out`, `rt/variants.out`: run logs.
- `rt/logs/`: per session, `claude-<label>.jsonl` and `.result.json`, or
  `codex-<label>.turn*.jsonl`, `.rollout0.jsonl`, and `.result.json`. Main
  runs use the message id as the label; repeats are `R1-<id>` and `R2-<id>`,
  runs to the end `E-<id>`, candidate runs `VA-<id>-<n>`.
- `rt/sessions/<host>-<label>/`: each session's project copy afterward.

In the toolkit-v2 repository this check changed only this report. Nothing was
staged or committed. `~/.codex/config.toml` is unchanged, no Codex session log
was written under `~/.codex/sessions/`, and no Claude Code transcript was
saved (`--no-session-persistence`).
