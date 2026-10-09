# Toolkit V2 progress

Read `dev/GOAL.md` first. This file says where the work stands.

## Salesforce's plugins: setup checks and asks, version 0.9.26 (2026-10-09)

Mike found the Salesforce plugin setup of version 0.9.23 far larger than
what he asked for. His words: "It literally just should be two lines when
we're setting up the project ... 'Hey, do we want those turned off or on?'
That's it." `AGENTS.md` holds his decision ("Salesforce's own skills and
plugins" under Rules) and the wider principle ("The toolkit is a framework,
not the setup of every tool").

- `<setup>references/salesforce.md`, "Salesforce's skills", is now one short
  section: check that Salesforce's skills are installed, and ask the owner
  what to have on or off (the plugins for the whole computer, the automatic
  deploy of `salesforce-development`, and that plugin's usage data).
- Removed: the settings snippet `claude-settings-salesforce.json`, its test
  in `dev/tests/hooks.test.mjs`, its merge rules and check commands, final
  check 19's six parts, the two extra owner's steps, the steps in
  `update.md`, and the two added lines of the rule `salesforce-project.md`.
  The other files that 0.9.23 changed for this are back at their text
  before it, apart from the few words that name the new question.
- A project that was updated to 0.9.23 or later keeps the settings that
  version merged in. They do no harm, and nothing removes them.
- Not tested live: a setup of a Salesforce project with this text.

## The agent asks whether a job gets a work item, version 0.9.25 (2026-10-09, TKV-51)

The live tests of 2026-10-08 ran on version 0.9.18. Their three records are
now in `dev/test-runs/` (`skill-routing-0.9.18.md`,
`evals-small-work-item-0.9.18.md`, `evals-keeping-project-records-0.9.18.md`),
with the record of the four evals that were run again for 0.9.22.

- In six of the nine short-path runs the agent made no work item for a
  small direct job, and in one run it committed a new file to the default
  branch with no check. Mike decided that the agent asks him: "The agent
  should just ask me if something g needs a work item. Keep it simple".
- The starter root guide, section "Every session", has one new bullet. When
  the owner asks for work and no work item covers it, the agent asks in one
  short line whether to make a work item, says which it recommends, and
  waits. It does not ask in four cases: the owner has already said, the
  turn only answers a question, the whole result of the work is text in
  the agent's reply, or the guide's own tables send the request somewhere
  other than a work item. Mike has not yet confirmed the third case: it was
  put to him on 2026-10-09, and it is built until he answers, because
  without it the agent asks before every quick draft. After a no, the agent
  does the work without a work item, and the guide points to the rule
  `shared-repository-work.md`.
- That rule lost one sentence: "The one exception to using your own
  worktree and branch is a one-file edit asked for directly." In the test
  run the agent gave those words as its reason for the commit to the
  default branch. Mike's yes of 2026-10-08, that a change with no work item
  still goes on a branch and reaches the default branch only after his yes,
  replaces the exception. The rule also says now that a repository with no
  remote merges on the computer, as `deploying.md` says.
- Two lines of the guide changed so that they fit the new bullet: the row
  "A new request, idea, or bug" of "Where information goes" points to
  "Every session", and "How to write a question to the owner" now also
  yields to a form that the guide itself gives. The guide is 24,310 bytes,
  under its limit of 24,576.
- The tests follow the decision. Four of the nine short-path evals make or
  change a file, and they start with the question and Mike's yes. The
  prompts of four others, whose result is a text in the reply, now say to
  make a work item. The messages that follow say what they answer ("Yes,
  that's right."), so that a reply that asks nothing is not answered with a
  bare "Yes.". A new set, `dev/evals/work-item-question/` (5 evals), tests
  a no, a job whose result is only text in the reply, a request that
  already says "no work item", a turn that only asks a question, and work
  that a work item covers.
- The report expectation of 31 record-keeping evals now says what Mike
  approved for 0.9.22: one short line for each record that changed, and
  nothing else about the save. It is decided from the lines that report
  the save.
- The six record faults of the first run were read again. Four were
  expectations stricter than the shipped rules (evals 5, 7, 24, and 30),
  and those expectations changed. One was a question that offers further
  work, which the README now says is not a question about saving
  (eval 12). One is a real miss: in eval 26 the agent saved a decision as
  Decided, and a rule as Approved, from pasted call notes. The eval is
  unchanged, and the next run shows whether the miss repeats.
- Two things that the first run's scoring exposed in the tests changed:
  eval 3 of the short-path set now says how the staging server gets the
  file, evals 2 and 8 have Mike answer the question about personal data in
  his second message.
- `dev/evals/tools/` is new and not shipped: `build-base-project.sh` builds
  the base project with a real setup, `run-live-eval.py` runs one eval in
  the fixed test home, and `grader-brief.md` is the brief for a helper that
  grades the runs. The first run's scripts were in a temporary folder.
- Reviewed by three separate agents. The wording review changed four
  sentences. The review of how the text fits the rest of the starter found
  the one-file exception, the requests that the guide's tables send
  elsewhere, and that the Git rule already had a home. A third agent read
  the fixed text and found one more gap, in the bullet about a repository
  with no remote.
- Tested: every check in `AGENTS.md`, "Checks". A small live check ran on
  the branch on 2026-10-09, in the fixed test home, on a base project built
  by a real setup: the five evals of the new set and eval 9 of the
  short-path set, one run each. In eval 9 the agent asked the question,
  made WI-034 after the yes, took the short path, and built the file on the
  work item's branch. In the new set the agent did not ask in the four
  cases where it must not, and after "No work item for this one" it built
  the file on its own branch and asked before the merge. Eval 1 of the new
  set showed a fault in its own prompt, a value that Xcode does not accept,
  and the prompt changed. Eval 9 showed a fault that is not part of this
  change: no separate checker ran, although the result builds what a rule
  in `system/` says.
- Not tested yet: a full run. The run of all three sets on this version is
  the next step, and its record will be the baseline that the wording
  rewrite (TKV-50) is measured against.

## One statement for each of four rules, version 0.9.24 (2026-10-09)

Phase P2 of TKV-43 (`dev/research/toolkit-cohesion-audit.md`, findings 7 and
10). Mike said yes to the phase and its choices on 2026-10-09, and yes to
the meaning of the two changed rule sentences the same day.

- When a standing merge instruction counts as the owner's yes is stated in
  one place, `managing-work-items`, `references/deploying.md`, "What a merge
  into the default branch needs". The rule `shared-repository-work.md` said
  that it counts with no condition; it now names that section. Stop 4 of
  `lifecycle-rules.md` names it too.
- Which deploys need the owner's yes is stated in one place, stop 5 of
  `lifecycle-rules.md`: each deploy to an environment that other people
  use. `deploying.md` said "each deploy" and now points to stop 5. Mike
  chose the list of stops. So a deploy to an environment that nobody else
  uses no longer needs his yes inside a work item.
- Who writes a record's ID into a work item reads the same in
  `filing-project-records/SKILL.md`, `lifecycle-rules.md`, `closing.md`, and
  `update-system-doc.md`: the filing skill saves the record first, and each
  of its steps says who writes the ID. What the agent does is unchanged.
- `reference/AGENTS.md` no longer gives a wrong reason for "never commit the
  file without the owner's yes". The owner's reason for that rule is not
  recorded anywhere; ask him when the wording work reaches that file.
- The rule `memory-review-and-save.md` no longer reads as if every save
  waits for the owner's yes.
- In the folder guides `work-items/AGENTS.md` and `memory/AGENTS.md`, the
  rows of "Which skill to use" that all named one skill are one row.
- The description of the Codex hooks, in the three `codex-hooks.*.json`
  snippets, names what the prompt hook prints today. `update.md`, "Old hook
  entries", tells an update to replace an earlier description and not to
  add the new one after it. Codex may ask the owner to trust the hooks
  again in a project after the update.
- Kept on purpose: the name `codex-after-commit.mjs`, although the command
  also runs in Claude Code. A rename touches about 12 files, needs a step
  in "update the toolkit" for every project, and makes Codex ask for trust
  again (Mike's yes, 2026-10-09).
- Waits for TKV-49: naming the skill `writing-harness-files` in the starter
  root guide.
- Tested: every check in `AGENTS.md`, "Checks". A separate agent reviewed
  the change, and its findings are fixed.
- Not tested: a live session, and "update the toolkit" in an existing
  project.
- Still open from the audit: phases P3 to P5 of TKV-43.

## A Salesforce project turns on the Salesforce plugins itself, version 0.9.23 (2026-10-08, TKV-44)

Version 0.9.26 removed everything this section says was built (see the
section for 0.9.26 above). What was read and tested then still holds.

Mike decided on 2026-10-08 to "turn the Salesforce plugins on only in
Salesforce projects". On his Windows computer Salesforce's plugins were on
for every project, and their checks slowed every command and every edit in
every project. `AGENTS.md`, "Salesforce plugins" under Rules, records his
decisions with his words. The version is set when the branch
`salesforce-plugins-per-project` is merged; the four version files were not
changed.

What was built:

- One new settings snippet,
  `<setup>assets/settings/claude-settings-salesforce.json`. It names
  Salesforce's marketplace (`salesforce`, the GitHub repository
  `forcedotcom/sf-skills`), turns on the seven plugins Mike uses, and sets
  `SFDX_AUTO_DEPLOY` to `0` and `SF_DISABLE_TELEMETRY` to `true`. Setup
  merges it only into a Salesforce project. It is the one place for a
  Salesforce project's own Claude Code settings. The Salesforce hooks and the
  `sf` permission rules stay in `every-project/.claude/settings.json` for
  now; the cohesion audit (TKV-43, finding 9) moves them later.
- `skills-hooks-settings.md` has the snippet's row, its merge rules (a value
  that a project's own file sets differently is the owner's, so the agent
  asks), and its check, a `jq` command that compares the project's file with
  the snippet.
- `salesforce.md`, "Salesforce's skills", is rewritten. It names the seven
  plugins, says why automatic deploy is off (a deploy by that hook would not
  go through the org guard or the permission set check) and that telemetry
  is off by Mike's choice. It says what the owner does the first time the
  project is opened on a computer, and has the agent check with
  `claude plugin marketplace list` and `claude plugin list` that the
  computer has the marketplace and the seven plugins. For whatever is
  missing, the agent gives the owner the commands
  `claude plugin marketplace add forcedotcom/sf-skills` and
  `claude plugin install <name>@salesforce --scope project`. It holds the step for once on each
  computer: the agent lists Salesforce's plugins that are on for the whole
  computer, asks the owner, and runs `claude plugin disable <ID> --scope
  user` only after the owner's yes. It gives the command for the plugin's
  install suggestions. For Codex the line with
  `npx skills add forcedotcom/sf-skills` stays, and the check runs in every
  Salesforce project. Setup and an update also look for copies of
  Salesforce's skills that an earlier setup left in `~/.claude/skills` or
  the project's `.claude/skills`, tell the owner, and change nothing without
  the owner's yes.
- `finishing.md` (final check 19, the owner's steps, the report),
  `interview.md` (question 4 and the plan), `SKILL.md` (step 7 and the
  References row), the rule `salesforce-project.md`, `README.md`, and
  `dev/SKILL-INDEX.md` say the same.
- `update.md`: an existing Salesforce project gets the snippet through the
  "Settings" row, with what the owner is told. The check that the computer
  has the plugins and the question about the rest of the computer wait until the
  update's branch was merged, because before that the project's main folder
  does not turn the plugins on yet.
- The question to the owner says one thing the decision did not name:
  another Salesforce project on the same computer loses the plugins until
  "update the toolkit" has run in it.
- The duplicate line is gone. `every-project/.claude/settings.json` turned
  off `second-brain@claude-toolkit`, and so does `enabled-plugins-off.json`,
  which setup merges into every project. The line came in with Mike's model
  folder on 2026-09-26 (commit cd734894), before the plugins-off snippet
  existed (0.5.0, 2026-10-01). `dev/model-changes.md`, item 23, kept it then
  only because the model was copied whole. A finished project's settings are
  the same with and without it. `setup-copy.md` no longer names
  `enabledPlugins` among the entries to keep. An existing project keeps its
  line: an update deletes no entry.
- One new test in `dev/tests/hooks.test.mjs` (13 lines): the snippet parses,
  names exactly the seven plugins with `@salesforce`, holds the marketplace
  and the two values, and the every-project settings file holds none of the
  snippet's three keys.

What was checked:

- The marketplace file of `forcedotcom/sf-skills`, read with `gh api` on
  2026-10-08: the marketplace name is `salesforce`, it lists 17 plugins, all
  seven names are in it, and each plugin's source is a folder inside the
  repository.
- The plugin's source, read and not run: `scripts/sf-deploy-gate` leaves the
  automatic deploy unless `SFDX_AUTO_DEPLOY` is exactly `1`;
  `scripts/sf_telemetry.py` and `scripts/telemetry-flush.js` both treat any
  value of `SF_DISABLE_TELEMETRY` that is not empty as off.
- `claude plugin disable --help` on Claude Code 2.1.289 shows the option
  `--scope user`, and so does the captured page
  `mods/plugins-cli-reference.md`. `claude plugin list` prints a Scope and a
  Status line for each plugin.
- The official pages. Three of the four pages about how a plugin reaches a
  computer were already captured, in `ai-external-knowledge/claude-code/mods/`
  (`plugins-loading.md`, `plugins-install.md`, `plugins-cli-reference.md`),
  and the first commit (37d00b06) was written without them. The fourth,
  `/docs/en/plugins/org`, was captured with Firecrawl on 2026-10-08 as
  `ai-external-knowledge/claude-code/plugins-org.md`. Two of the pages say
  that a plugin the marketplace lists by a relative path, as all seven are,
  loads from the marketplace copy with no install.
- A live test by the session that owns TKV-44 (2026-10-08, on a Mac, in the
  test sign-in, Claude Code 2.1.289) did not show that. A scratch Salesforce
  project held the snippet and `disableAllHooks: true`, and each session was
  started with `claude -p`, so with no screen.
  - Run 1, folder not trusted: none of the seven plugins loaded, and the
    marketplace `salesforce` was not registered.
  - Run 2, folder marked trusted (`hasTrustDialogAccepted: true` in the test
    sign-in's `.claude.json`): the same.
  - Run 3, after `claude plugin marketplace add forcedotcom/sf-skills`: the
    marketplace was listed, and still none of the seven loaded.
  - Run 4, after `claude plugin install dx-devops@salesforce --scope
    project`: that one plugin loaded (8 skills, "Scope: project"), and the
    other six did not. The install changed nothing in the project's
    settings file except the order of its keys.
  - A second round from a clean state, with the folder marked trusted. In
    two sessions with the snippet only, the marketplace `salesforce` was
    not registered, nothing was downloaded, and none of the seven plugins
    loaded. After `claude plugin marketplace add forcedotcom/sf-skills`,
    the next session downloaded all seven plugins into the sign-in's plugin
    cache (`plugins/cache/salesforce/<name>/0.2.0`) and still loaded none of
    them. Two more sessions after that loaded none.

  So in a session with no screen, a plugin that a project's settings turn
  on is downloaded once the computer knows the marketplace, and it loads
  only after an install for the project. The install step stays, and the
  text has the agent check first. The test sign-in is back to its state
  before the test: the marketplace, the cache, and the trust entry were
  removed, and the plugin and marketplace lists compare equal.
- The two `jq` commands of the new check, on a scratch file that joins the
  every-project settings and the two Claude Code snippets.
- All seven checks of `AGENTS.md`, "Checks", pass: the three
  `claude plugin validate` runs, `claude plugin test` (14 pass),
  `check-skills.mjs` (0 errors, 0 warnings), `check-rules.mjs` (the same 3
  warnings as before, none on a changed file), and the tests (116 pass).

What was not tested:

- An interactive session with these settings, where Claude Code may ask the
  owner about the marketplace and the plugins when the owner trusts the
  folder. The four runs above had no screen.
- Windows.
- The plugins' own hooks, which were turned off in the test. So nobody has
  seen that `SFDX_AUTO_DEPLOY` at `0` keeps the automatic deploy off, or
  that the telemetry stays off.
- A whole setup or update of a project with the snippet, and the step that
  turns the plugins off for a computer.
- Whether the two `env` values reach the plugins' hook commands in the
  Claude desktop app, where a variable of the app's own launch environment
  wins. Final check 19 reads both values.
Known from the test:

- `claude plugin install <name>@salesforce --scope project` changed the
  order of the keys in the project's `.claude/settings.json` and nothing
  else. So the file shows as changed in Git after an install.
## The rule to evaluate the owner's request fits with the reply instructions, version 0.9.22 (2026-10-08)

Phase P1 of TKV-43, the audit of how the shipped skills, rules, and hooks
fit together (`dev/research/toolkit-cohesion-audit.md`, findings 1 to 3).
Mike approved the wording, both headings, and the changed sentence of the
goal on 2026-10-08.

- The output style and the starter root guide told the agent to answer only
  what was asked, while the rule `evaluate-the-owners-request.md` tells it
  to state the goal and show options. Both now say that what the root
  guide, a rule, or a skill tells the agent to put in a reply is part of
  the answer.
- The starter root guide names the rule under "Your job as the agent", and
  says that `owner-preferences.md` wins where it says otherwise. Before,
  only the reminder hook named the rule.
- The starter root guide has a new section, "How to write a question to the
  owner". The output style points to it. The question box and "one question
  in each reply" stay where they were (the work item interview and setup):
  Mike chose that, because he often answers through the question box.
- `lifecycle-rules.md` has a new part, "How the rule to evaluate the owner's
  request applies in a work item": the rule's checks are done once, through
  the steps of the skill.
- The report after a save is one short line for each record changed. The
  goal's sentence changed (root `AGENTS.md` of this repository, "One goal
  for keeping the records"). In `saving.md`, five reply lines lost "Say
  'forget that' to undo." or "Memory holds no copy.", and a change to the
  project's Current State has its own line. In `publish-docs`, step 8, the
  commit goes in the reply only when the owner asked to publish or commit,
  or when the main checkout does not hold the save.
- The starter root guide's byte limit is 24,576, up from 22,528
  (`finishing.md`, check 14, and `update.md`). The guide is 23,477 bytes.
  `check-skills.mjs` now fails when the starter guide is over the limit, or
  when the two references give different limits. Phase P4 of TKV-43 is to
  shorten the guide again.
- Tested: every check in `AGENTS.md`, "Checks". Four of the record-keeping
  evals that failed on the report were run again on the branch at commit
  ee7281d2, one run each (`dev/test-runs/evals-keeping-project-records-audit-p1.md`
  on the branch `live-tests-0.9.18`): the report of the save was one short
  line for each record in all four.
- Not tested: the last rewording of `publish-docs`, step 8, and of the
  reply lines, which came after those runs; a live session in Codex; and
  "update the toolkit" in an existing project, where the new heading makes
  the update rebuild the project's root `AGENTS.md`.
- Still open from the audit: phases P2 to P5 of TKV-43. The live tests also
  showed that replies stay long for other reasons (the Sources list, a
  closing question), and that is not part of this change.

## The order of the Hindsight setup steps, version 0.9.21 (2026-10-08)

The first live Hindsight setup, of the bank `toolkit-v2`, left the bank
without the settings Mike chose. Setup switched the add-on on for the folder
first and wrote his choices 25 seconds later, and the add-on had prepared
the bank with its own defaults in between. Setup had also written two
missions into the bank, so the add-on left its own three out. Mike's answers
on 2026-10-08: yes to a new order; the filter paragraph on his bank "should
sort of be the default for the new projects"; the detail of a save "short";
and yes to a throwaway test bank.

- Setup creates a bank with a name only. It writes no mission
  (`hindsight-on-vps.md`, "2. The bank").
- One command writes the bank's own settings into the add-on's settings
  together with the two entries that switch the add-on on for the folder
  ("4. The add-on", step 4). The bank's settings are step 5 now, before the
  save-and-search check.
- Setup starts the add-on's own job when the add-on has not prepared the
  bank yet, and sends the server's part of the settings only after that
  ("Apply the settings", steps 3 and 4).
- A bank has a seventh setting, the filter for saved sessions. The project's
  file keeps it as `sessionFilter`. The default is the paragraph from Mike's
  bank, word for word.
- The default for the detail of a save is `concise`. It was `verbose`.
- `dev/test-runs/hindsight-setup-order.md` holds the tests of the old and
  the new order on a bank made for the test, which was deleted afterwards.

- The test save of "6. Save and search" names the kind of save `document`.
  On a prepared bank, a save with no kind named is read with the add-on's
  mission for a Git commit.

- The rule `hindsight-memory.md` told the agent to say in its reply what a
  recurring job did, "so the add-on saves them". The default filter tells
  the model to make no memory from a summary of what the agent reported. So
  the rule now tells the agent to save the run with the add-on's tools
  (Mike, 2026-10-08: "Change it").
- A settings file with no `sessionFilter` key leaves a filter that the bank
  already holds as it is. This repository's own file had no such key, and
  its bank holds Mike's filter. The file now holds the same paragraph.
- The filter paragraph names neither secrets nor personal data. Mike was
  asked whether to add a clause for them, and said no (2026-10-08).

- The bank `toolkit-v2` no longer holds the two missions of the old setup
  (Mike, 2026-10-09: "yes, clear them"). The agent cleared both and started
  the add-on's own job. The bank now holds the add-on's three missions, and
  its observation settings, its detail, and its filter are as they were.
  The step was rehearsed first on a bank made for the test.

Open for Mike:

- Not tested: a save of a real session through the filter, Codex, and the
  installer in a real project.

## One home for what an agent may do in each Salesforce org, version 0.9.20 (2026-10-08, TKV-37)

Mike's words: "Every salesforce project is different so there will always be
things I need to tweak and rules specific to that project I need to tweak
and it shouldn't break the entire toolkit", and "maybe the toolkitv2 could
ship a default preference file and I could always adjust it on the fly if
need be." Also: "I don't want you to just keep adding more and more files.
If we need to refactor existing stuff so that everything is clean ... make
sure that happens." This is the first of two changes. The guard's code is
the second, and it is not written.

- **One new file, the owner's own.** A Salesforce project gets
  `.claude/rules/salesforce-agent-permissions.md`. It holds a table with one
  row for each kind of action and one column each for a sandbox or scratch
  org and for production, the list of changes the agent confirms with the
  owner first, and a part "Only in this project" for dated lines in the
  owner's words. Each cell says Allowed, Ask first, or Never. Setup copies
  the file once, and "update the toolkit" never compares or replaces it.
- **The defaults** (his yes, 2026-10-08). On a sandbox or scratch org:
  reads, a deploy, a deploy validation, and Apex and Flow tests are Allowed;
  a data change, anonymous Apex, a deploy with a destructive changes file,
  and a change to DevOps Center records are Ask first; a profile deploy and
  a promotion through a DevOps Center pipeline are Never. On production,
  reads are Allowed and everything else is Never. Three defaults are the
  builder's. They were shown to Mike on 2026-10-08 with the table, and the
  change was merged on his word "Merge". He did not approve the three one
  by one, and he changes any of them by telling the agent: DevOps Center
  records on a sandbox (Ask first), a promotion on a sandbox (Never), and
  the last row, "Any other change to an org" (Ask first on a sandbox, Never
  on production). Before this change such an action had no line of its own:
  the safety rule said "Read-only against every org, except the sandbox
  actions below", so it was forbidden.
- **Three homes, each with one job.** `salesforce-org-safety.md` now holds
  only the limits that are the same in every project, the commands for each
  kind of action, and what the guard checks. It says in three lines how it,
  the owner's file, and the guard fit together. Its sections "Allowed",
  "Never", and "The owner's yes for a sandbox change" are gone: the limits
  stayed, and the choices moved to the owner's file.
- **Two rules removed.** `production-data-changes.md` (the `sf-data-change`
  skill holds its steps) and `confirm-salesforce-changes.md` (its list is in
  the owner's file, "Confirm with the owner first"). A Salesforce project
  now gets ten rules, one fewer than before.
- **Pointers in place of repeated text:** `permissions-source-control.md`,
  `salesforce-delivery.md`, `salesforce-project.md`, the three `sf-*`
  skills, `PERMISSIONS-RUNBOOK.md`, the comments in `protected-orgs.json`,
  and `salesforce-deploying.md` in `managing-work-items`.
- **The stop before a deploy.** `managing-work-items` asked the owner before
  each deploy to an environment that other people use. `lifecycle-rules.md`,
  stop 5, and `deploying.md` now say that a deploy that a rule of the
  project allows without a question needs no new yes.
- **Leftovers removed from setup.** `salesforce.md` and `interview.md` still
  said that in Codex the owner runs every sandbox deploy, which has not
  been true since 2026-10-07. `salesforce.md`, `finishing.md`, and
  `move-over.md` now send an instruction about what an agent may do in an
  org to the owner's file.
- **The line "Sandbox questions: off"** no longer goes in the project's
  Current State. `update.md`, "The owner's choices for Salesforce orgs",
  moves it into the owner's file in an existing project, and moves an edit
  of the owner's out of the two removed rules. `setup-copy.md` and
  `old-toolkit-pieces.md` name the new file.
- This revisits two decisions of 2026-10-07 (TKV-31): where the sandbox
  choice is kept, and the default, which was to ask before every sandbox
  change.

Not in this change: the guard reading the type of an org from the Salesforce
command line's own login files, and asking in Claude Code when it cannot
identify an org; and telling the owner to turn off the Salesforce plugin's
install suggestions (question Q-03 of the work item). `builder-brief.md` was
left as it is: its line "Never deploy" is a limit on helper agents in every
project.

A separate reviewer read the change and found nine things that had to be
fixed and two smaller ones. All eleven were fixed. The most important: stop
5 of `managing-work-items` still told the agent to ask before every deploy
to a shared sandbox; an owner's "from now on" choice could land in
`owner-preferences.md` while the table still said Ask first; an action with
no row had no instruction; and data changes and test runs in production
had become something a project line could open, which they were not
before. Both are "Never (fixed)" again, and the safety rule forbids them in
every project. Two sentences of the safety rule are new in meaning and need
Mike's eye. The first: it said never to add a production alias to the
guard's lists, and now also says that the agent changes
`protected-orgs.json` only when the owner told it that change in this
session. The second: "The one kind of production data that a project can
open to the agent is DevOps Center records, in the owner's file." Opening
that cell changes nothing in practice yet, because the guard denies every
data write to production.

The reviewer read the fixes and found two more things, which were fixed: two
setup files sent every choice of the owner's to "Only in this project", and
a promotion into production was not marked fixed, although it is a deploy
to production.
## Memory is tidied in the background, version 0.9.19 (2026-10-08, TKV-39)

Mike first asked for a background helper that saves memory, like the one in
his Davis project, without its slowness. The agent objected to a helper for
every save, and he agreed with the main reason ("this is a fantastic point,
actually"): since the one-home layout most facts go to work items,
decisions, and sources, which the main agent must write itself, so such a
helper would cover little. He chose a helper that tidies memory, for local
and Notion memory, and wanted it simple: "Just a couple short instructions
about what files, the scope of what it's looking to tidy up, and when it
should run that stuff".

- The clean-up of all of memory already existed in the memory skill,
  `managing-project-memory`, `references/tidying.md`, as one process for
  local and Notion memory. Nothing started it except the owner asking, and
  the main agent did all the reading in the conversation.
- No skill and no agent file was added. The skill got two short sections.
  - `memory-process.md`, "When to clean up all of memory": when the owner
    asks, at once, and when the agent judges that memory is no longer
    small and true. For a clean-up it starts itself, the agent chooses a
    point where the owner is not waiting, such as after a work item closes.
    There is no schedule and no count.
  - `tidying.md`, "A helper reads memory in the background": the main agent
    starts one helper and hands it `tidying.md` and `memory-store.md`. The
    helper changes nothing. It returns the changes that do not go on the
    plan, and the plan. The main agent makes the first kind itself and
    shows the owner the plan, as the file already required.
- A Hindsight project has no toolkit memory skill and gets nothing.
- Agreed with the session that owns the cohesion audit (TKV-43): this
  change stays out of the parts of the memory skill that the audit's phase
  P3 will move.

A separate reviewer read the change and found four things that had to be
fixed, which were fixed. The helper's message pointed it at a file whose
first section told it to start a helper. The owner's own "tidy memory"
could be read as something to put off. The file said "Two changes do not go
on the plan" and then named a third. And one example was dropped that Mike
had been shown: starting a clean-up when a handoff is written. The owner
clears the session after a handoff, so the helper's plan would be lost.

Not tested live: a helper in Codex. The text has Codex call `wait_agent`
before the turn ends, because no captured Codex page says that the main
agent is told when a helper finishes.

The design for a helper that saves memory on every save, with the
measurements from Davis, is kept on the work item's page and is not built.

## A small work item is judged by the agent, version 0.9.18 (2026-10-08)

The agent asked Mike whether a task that fixes the result counts toward the
"one or two tasks" of a small work item. His answer: "Why are we hardcoding
the number of tasks to determine whether it is small? ... We cannot be
solutioning and desiging like this where are processes are so rigid and
limiting the agent's reasoning". He approved the replacement the same day
("yes build it").

- A small work item is no longer "at most one phase, one or two tasks, and
  no sub-items". It is a top-level work item whose whole job the agent can
  play back to the owner in one reply, and can build and check without an
  interview, without Designing, and without sub-items. The agent judges this
  from the owner's request, and the owner's words win
  (`lifecycle-rules.md`, "A small work item").
- A work item on the short path stops being small when the work turns out
  to need what the short path leaves out: an interview to settle the
  requirements, Designing, or sub-items. It continues with the file for the
  State it is in. A work item that needs a design moves to Designing, also
  from Building. Before, the text did not say how it got there. On leaving
  the short path, `delivery` goes back to `not-offered`, so that the offer
  of helper agents is made for a work item that has grown.
- A task that fixes the result repairs the same job, so it changes nothing.
  The sentence about which tasks count is gone.
- The second count in the skill is gone too. In Building, the offer that
  helper agents build the work item was made when the plan had "sub-items,
  more than one phase, or more than two tasks". It is now made when the work
  item is not small (`building.md`). The Recent History row for a small work
  item is now "Small item, so no delivery offer."
- The test set `dev/evals/small-work-item-short-path/` agrees with the new
  text. Eval 4 expected a fix task to move the work item to the full path;
  it now expects the work item to stay on the short path, with the agent's
  own check and a second closing question. Three limits in its README that
  were about the count are gone.
- `AGENTS.md` holds a third instruction for text that tells an agent what to
  do: do not put a count or a limit where the agent should use its
  judgment. `README.md` no longer says "with one or two tasks".

A separate reviewer read the change and walked three cases through the
text. It found one thing that had to be fixed: "<State>" in the row "Short
path ended: full path from <State>." could be read as the State the work
item leaves or the State it moves to. It is now the State the work item is
in when it leaves the short path. Three smaller findings were also fixed:
a small work item that the owner sends down the full process is still
small and gets no delivery offer; a work item that leaves the short path
can get the offer; and the wording review no longer gives "more than two
tasks" as its example of how to define "large". The README now says that
the checker runs when the result "builds or changes what a rule in
`system/` says", as the skill does.

All seven checks in `AGENTS.md` passed on the Mac. Not run: the nine evals
of the test set, with the new text.

This revisits one line of what he approved on 2026-10-07 in version 0.9.8.
It answers the first two questions that the session of 2026-10-08 left for
him, so neither is open.

## Each row of filechanges links to the file, version 0.9.17 (2026-10-08, TKV-38)

Mike asked for a link on each file in the `/filechanges` table: "each
filechange should come with a link for me to open the file (and if the file
is still on a branch or something the link should take that into account)".

- Each file name in the table is now a link that opens a copy of the file
  that holds the change. The skill says what "holds the change" means: the
  file in that copy has the changed text now, whichever commit brought it
  there.
- A link to a copy on this computer uses the copy's full path. Mike's click
  tests in the Claude Code desktop app on Windows showed why: a link with a
  relative path opens the file from the folder where the session started,
  so in a session that later worked in a worktree it opened the main
  folder's copy, without the change. A link that climbs out with `../` did
  not open. A Markdown link with a full path and forward slashes opened.
- A copy that is only on a branch on the remote gets a web link to the
  file's page on that branch. A deleted file gets no link.
- Changes that the project's main folder does not hold get their own table,
  one for each worktree and one for each branch that no folder on this
  computer holds, under one line that says so and names where they are.
- Two files changed: the skill's `SKILL.md` and its row in `README.md`. The
  skill's description did not change, so the routing test did not run again.

A separate reviewer read the first text and found nine gaps, which were
fixed. After the click tests changed the link rule to the full path, the
reviewer read the last text and found three things to fix and four smaller
ones. Five were fixed: the meaning of "holds the change", how the tables
are grouped when a worktree and its pushed branch both hold a change, the
name of a deleted file in a host where a path in code form is a link, a
file "outside the project" that could be read as a file in a worktree, and
one sentence that was hard to read. The reviewer read the fixes and found
them sound. It named one more case, a change that is only on a local branch
that no folder holds, and the table rule now covers it with the reviewer's
own words.

Two findings were not turned into text. Two worktrees that change the same
path is a case for the test set, and not a new sentence in the skill. The
README row still says "each with a link that opens it", which is not true
for a deleted file.

All seven checks in `AGENTS.md` passed on the Mac: the three validations,
the 14 plugin tests, `check-skills.mjs`, `check-rules.mjs` (three warnings,
the same as before), and the 115 Node tests. This is the first full run on
the Mac since version 0.9.10.

Mike clicked one link on the Mac on 2026-10-08, in the Claude Code desktop
app: a Markdown link with the full path of a file inside a worktree. It
opened the file.

Not tested: a path with a space between `<` and `>`, any link in the
terminal or the VS Code extension, and any link in Codex.

## The rule to evaluate the owner's request is printed on every message, version 0.9.16 (2026-10-08)

- Mike asked for the rule `.claude/rules/evaluate-the-owners-request.md` to
  be in front of the agent on every message, and not only at session start
  (2026-10-08: "create a small hook that runs on every turn to paste in that
  message"). He approved the design the same day ("I love the idea yes",
  then "yes this is good, build it").
- No new hook command. `prompt-reminder.mjs`, which already runs on every
  message in both hosts, has one more job: it prints the rule's text last,
  after one line that names the rule's file. For a message such as "hello"
  it prints the skills line, then "The owner's rule for every request, from
  .claude/rules/evaluate-the-owners-request.md. Where owner-preferences.md
  says otherwise, that file wins:", then the whole rule file.
- The command reads the project's rule file each time and holds no copy of
  the text. So the rule file is the one place to change the rule, and a
  project whose owner changed the rule prints the changed text. It finds
  the file from its own place in `.claude/hooks/`, so it works in both
  hosts and from inside a Git worktree. When the rule file is missing or
  empty, the command prints what it printed before.
- The rule has a longer text, which he approved on 2026-10-08 and refined
  twice the same day ("boom love it - build it" to the last draft). It says
  that the owner always wants the best solution for the whole project. The
  agent slows down and says what it thinks the goal is. It learns what the
  system, process, or application is for and how the people who use it are
  meant to use it. When a request changes how people use it, the agent
  looks at their whole process from start to finish. It checks that what
  the owner suggested fits how everything else is built, and it shows each
  option with what it gains and what it costs. This repository's copy in
  `.claude/rules/` holds the same text.
- He was told that the command grows from 64 lines to about 70, plus about
  15 lines of tests. It is 72 lines, and `dev/tests/hooks.test.mjs` grew by
  34 lines: 24 for the command, and 10 for a test of this repository's own
  settings entry. With the starter rule the longest output is 3,576 characters,
  and a plain message gets 2,716. Claude Code's limit is 10,000 characters,
  and Codex's is about 2,500 tokens for this entry.
- No settings entry changed, in the snippets or in the starter
  `.claude/settings.json`. So Codex does not ask him to trust the hook
  again.
- An existing project gets both files at its next "update the toolkit". The
  command is replaced after his yes, as every hook command is. The rule is
  shown as a difference: the update recommends the new text when the
  project's file holds no edit of his, and keeps his edit otherwise. A
  project that updates the command and keeps its own rule text prints its
  own rule text.
- This repository has no hook commands. Its `.claude/settings.json` has one
  new `UserPromptSubmit` entry that prints the starter rule on every message
  in Claude Code, with `node -e` and no new code file. A test runs the
  entry's command with the same arguments: it prints the line and the rule
  with the right path, and nothing with a wrong path, with exit code 0 both
  times. The same test fails when the line differs from the line the hook
  command prints. The entry has not been watched in a live session. Codex
  sessions in this repository have no such entry.
- A separate reviewer read the change. It found the code and the tests
  sound, and it found gaps in the documents, which are fixed: check 10 in
  `finishing.md` did not say what a failed result means, "each hook command
  does one job" was no longer true in two files, two sentences in
  `AGENTS.md` could be read in two ways, and this repository's own entry
  had no test. The review also raised two questions, and Mike answered both
  on 2026-10-08. The last bullet of the rule said "or the owner gives a
  direct instruction", so a direct instruction alone was enough to act. It
  now says: "When you found nothing to raise, do the work. This also holds
  for a direct instruction such as "merge it": say what you found first,
  and otherwise do it." (his words: "sure that wording"). And an instruction
  of his that begins "from now on" is filed in `owner-preferences.md`,
  which loads once, while the hook prints the rule on every message. So the
  line above the rule now ends "Where owner-preferences.md says otherwise,
  that file wins:" (his "ok"). That clause took the command to 72 lines.
- The evals in `dev/evals/` were not run with the new output.
- Checked on Windows, on the branch after the merge of version 0.9.15:
  `claude plugin validate` passes for the marketplace, `./plugins/toolkit`,
  and `./plugins/workstreams`. `claude plugin test ./plugins/workstreams`
  passes with 14 tests. The whole test folder ran on the final text with
  115 tests: 113 pass, 2 are skipped, and 0 fail. `check-skills.mjs` passes
  with 0 warnings, and `check-rules.mjs` passes with its 3 older size
  warnings. Not run on a Mac.
- Next: run the two eval sets in `dev/evals/` with the new output, to see
  whether the agent now asks the owner more often than it should; watch the
  new entry in a live Claude Code session in this repository; and decide
  whether this repository also gets a hooks file for Codex.

## The text for a small work item without a sentence for each small case, version 0.9.15 (2026-10-08)

On 2026-10-07 the short path for a small work item, in `managing-work-items`,
got about ten sentences that each settled one small case. Mike asked for them
to be removed ("Fix this absolutely. You must have another agent verify the
work too."). His instruction for such text: write the general rule, and do
not add a sentence for each small case.

- Five reference files of the skill changed: `lifecycle-rules.md`,
  `testing-loop.md`, `closing.md`, `refining-requirements.md`, and
  `deploying.md`. 30 sentences were removed or joined into general
  statements. The section in `lifecycle-rules.md` now states the goal of the
  short path and gives it in six steps.
- No decision of his about the short path changed: what a small work item
  is, the play-back in place of the interview, one closing question, when
  the separate checker runs, the questions before a merge and a deploy, the
  move to the full path, no delivery offer, and the phase
  `P01 — Ongoing support`.
- Three general statements carry what the removed sentences said. Every
  rule of the skill that the six steps do not change applies to a small
  work item as it is written. Where the skill names the checker's verdict,
  the commit that the checker passed, or a new run of the checker, the
  agent's own check takes its place, with one exception: the owner's
  standing merge instruction does not cover a merge that no checker passed.
  After the closing yes the agent follows "Marking Done" and does not ask
  again the questions that the yes already answered.
- One word changed that also applies to the full path. `deploying.md` said
  that a fix after a failed deploy goes back to the Testing Loop "when the
  fix changes code". It now says "when the fix changes the result", as
  `testing-loop.md` already did. The same line now also names a failed data
  load.
- One thing the agent now does differently: a lesson that first appears
  after the closing yes, such as one from a deploy, gets its own question.
  Before, it got no answer.
- A new test set, `dev/evals/small-work-item-short-path/`, holds nine
  situations for the short path. They are for testing only and are never
  copied into the agent's instructions. No eval existed for the short path
  before.
- A separate verifier read the rewrite: every removed sentence, the three
  general statements in every place they apply, nine walk-throughs against
  the old text, every cross-reference, the writing rule, and the fit with
  the rest of the toolkit. It had 12 findings, 2 of them places where an
  agent could act differently than before. All were fixed, and the verifier
  read the fixes. Its 4 small points from that second read were fixed and
  not read a third time.
- Not run: the nine evals in a live session.

Open for Mike:

- Does a task that fixes the result count toward "one or two tasks"? As
  written, it does, so a two-task work item whose fix is a third task moves
  to the full path.
- The skill does not say how a work item that leaves the short path during
  Building gets to Designing.

## A rule to evaluate the owner's request, and new wording in the reminder hook, version 0.9.14 (2026-10-08)

- Every project gets a new rule, `.claude/rules/evaluate-the-owners-request.md`
  (Mike approved its text on 2026-10-08). Before the agent acts, it works
  out what the owner is trying to achieve, checks the request against the
  whole project, and judges whether the way the owner suggested is the best
  one. It tells the owner about a better way, a case the request does not
  cover, or a part the request would break, before it builds. It still
  carries out a direct instruction when it found no reason to stop.
- A new project gets the rule from setup. An existing project gets it at
  its next "update the toolkit", as a missing file. Claude Code loads it by
  itself. Codex reads it at session start, because the starter `AGENTS.md`
  tells it to read every rule that has no `paths` line. No other starter
  file changed for it.
- This repository follows the same rule: `.claude/rules/evaluate-the-owners-request.md`
  is an exact copy, and `check-skills.mjs` fails when it differs from the
  starter rule. `AGENTS.md` has a new section, "The rule every agent
  follows here", with two more instructions of his for text that tells an
  agent what to do.
- The reminder hook `prompt-reminder.mjs` has new wording in its hint about
  words that are not the owner's own (his yes, 2026-10-08). It printed that
  such words "decide nothing". It now prints that only the owner's own words
  are the owner's yes, and that the agent files a shared source and records
  what it says. The old
  sentence disagreed with the goal in the starter `AGENTS.md`, which tells
  the agent to save what a source says without asking. The command is still
  64 lines. Its entry in `.codex/hooks.json` did not change, so Codex does
  not ask him to trust it again.
- The Salesforce guard tests now run on Windows (his yes, 2026-10-08: "ok
  make them work"). `dev/tests/org-guard.test.mjs` failed 6 of its 10 tests
  there, because the stand-in for `sf` was a shell script, which Windows
  cannot run as a command. On Windows the test now also writes an `sf.cmd`
  that runs the same logic in Node. The guard did not change, and the Mac
  path of the test did not change. All 113 tests now run on Windows: 111
  pass and 2 are skipped. Not run on a Mac. Older entries below that say
  the six guard tests fail on Windows describe the time before this change.
- Next: find out why the background memory helper in Davis is slow, and
  show him a design for one in Toolkit V2; then remove the sentences for
  small cases from the text for a small work item.

## Hindsight server without Ollama, and settings asked for each bank, version 0.9.13 (2026-10-07)

Mike gave his record of the Hindsight server as it is since 2026-10-07. It
is kept unedited as `dev/research/hindsight-vps-architecture.md`.

- `hindsight-on-vps.md` now says: three services on the VPS and no Ollama;
  the model `gpt-5.6-terra` at OpenAI through his ChatGPT subscription, with
  a Codex sign-in kept only on the VPS; the text of each save goes to
  OpenAI; every memory is written in English; observations are on for the
  server and automatic consolidation is off; one API key opens every bank;
  `refresh_token_reused` means the owner signs Hindsight in again.
- It has a new part, "Projects with their own review of saved knowledge":
  setup stops for Entrevest, Diligence Ready, CentraView, and Robin.
- Setup asks the owner about six settings of the project's bank (Mike,
  2026-10-07: "Each project should ask me if I want this if so. And ask me
  other hindsight settings (on a per memory bank basis)"): observations,
  whether every session is saved, the detail of a save, the summary on the
  first message, the Git history, and the code survey. Observations are
  on by default and built after every save (Mike, 2026-10-07: "Have auto
  observations by default. I don't care about token usage."). Two more
  defaults differ from the add-on's own, with his yes ("Sounds good"): a
  save keeps detailed memories (`verbose`), and the Git history holds the
  changes of each commit as well as its message (`full`). The other three
  are the add-on's own. `hindsight-on-vps.md`, "The bank's
  settings", has the table, the question, the commands, and a step to build
  observations when he asks.
- A Hindsight project gets a new file, `.claude/hindsight-bank-settings.json`
  (in `memory-hindsight/`), which holds the answers. The server keeps its
  `bank` part; the add-on keeps its `addOn` part on each computer, under
  the bank's ID.
- An existing Hindsight project gets the file, with the defaults, at its
  next "update the toolkit", and is then asked the question once.
- `README.md`, `interview.md`, `finishing.md`, `update.md`, `SKILL.md`,
  `AGENTS.md`, and `dev/GOAL.md` say the same. The description of
  `project-setup` is unchanged.
- The rule `hindsight-memory.md` has one new bullet (Mike's yes,
  2026-10-08). It names the settings file and says what the rule's
  sentences about the add-on mean when the bank's settings turn the saves
  at the end of a turn, or the summary on the first message, off. An
  existing Hindsight project sees the difference at its next "update the
  toolkit".
- The starter `AGENTS.md` project map has no row for the settings file. The
  file has 27 bytes left under its limit of 22,528, so the rule names the
  settings file instead.

A separate reviewer read the new text twice (the server facts, then the
bank's settings), and a third reviewer read the fixes and the new rule
bullet. All 22 findings were fixed; nobody has read the last 5 fixes.

Not tested: the `jq` commands were not run, because this Windows computer
has no `jq`. Run them on the Mac. The six Salesforce guard tests fail on
this Windows computer, as they do on an unchanged `main`; the other 105
tests pass. Run the guard tests on the Mac before a merge.

Not tested against the server: the three new commands (the `PATCH` of a
bank's settings, the `jq` that writes the bank's section, and the
`POST .../consolidate`) are written from the captured Hindsight pages and
were not run. Also not tested: that a bank's own setting turns automatic
consolidation on while the server's setting is off. Test them on a bank
made for the test, with Mike's yes.

His record also connects a Codex agent to a bank's own MCP address; the
toolkit keeps the add-on and tells the agent not to add that address.
## One goal for keeping the records, version 0.9.12 (2026-10-07)

Work item TKV-33. Mike named one Davis session as the example to follow:
the agent kept memory up to date with no question to him. He then approved
one goal for the agent, and decided that the toolkit states general rules
and does not list what to do in each small situation
(`reference/how-the-owner-works-with-agents.md`, "What the owner wants from
the agent, in his words").

- The starter root `AGENTS.md`, "Your job as the agent", holds the goal word
  for word, with one line of examples. The "Before a turn ends" bullet is
  gone.
- `managing-project-memory` follows from the goal. Removed: the table of 11
  situations, the two approval modes and the setting "Memory approval" (the
  "Toolkit settings" lines go from 11 to 10), the question "Save to memory:
  <one line>?", the saves that waited for his yes, and the lists "Always ask
  first" and "Never ask". A fact that the agent concluded itself is saved
  and marked as not confirmed.
- The agent keeps `PROJECT.md` current without asking. It still asks before
  it deletes a memory record, changes a rule file, changes what the project
  is for or its scope, or cleans up all of memory, and when two facts
  disagree.
- `publish-docs` may commit an edit that the root guide tells the agent to
  make without asking.
- `update.md` removes the old setting from an existing project and asks the
  owner about saves that were still waiting.
- `dev/evals/keeping-project-records/` is the test set: 32 evals from the
  situations of the Davis rule and 4 for the edges of the goal, with a
  scratch project. No eval has run in a live session.
- `reference/memory-in-toolkit-v2-and-in-davis.md` compares memory in
  Toolkit V2 at version 0.9.9 with memory in Davis.

Two separate reviewers read the change, one against the wording review and
the document clarity standard, and one against the best practices review
with eight walk-throughs and ten evals. Their findings were fixed, each
reviewer read the fixes, and the points from that second read were fixed
and not read a third time.

Open for Mike:

- The reminder hook `prompt-reminder.mjs` still prints that words in notes
  or a transcript "decide nothing". A change to a hook needs his yes. The
  smallest change is three lines in the hook and three in its test. Done in
  version 0.9.14.
- A background helper for memory, as Davis has. The rewrite keeps the main
  agent doing every save before it replies.
- When notes he pastes say that he decided something, the toolkit records
  an Open decision and asks him in one line to confirm. Eval 26 expects
  that.

Still to do: two evals for a turn that changes no fact (a job done with no
work item, and a result given only in the reply); trimming the edge-case
sentences in the short path of `managing-work-items`, with the test set as
the check (done in version 0.9.15); a live run of the evals.

## The filechanges skill, version 0.9.11 (2026-10-07)

Mike asked for a command: "I need to see exactly what files you changed and
a short sentence of what the change was", as "/filechanges", shipped with
the toolkit. His correction the same day: "It should just be which files it
changed on its last set of changes. Not all the files changed int he
session".

- `filechanges` is a new shared project skill, the tenth. Every project set
  up with the toolkit gets it. In Claude Code the owner types
  `/filechanges`, and in Codex `$filechanges`. It is a project skill because
  a skill inside the `toolkit` plugin would be typed `/toolkit:filechanges`.
- The agent replies with one table, File and What changed, for the files it
  changed since the owner's latest request for work. It checks the list
  against Git so that no file is missed.
- The skill index, the skills table and counts in setup, the README, the
  "Which skill" table in the starter `AGENTS.md`, and the `skillOverrides`
  list in this repository were updated.

A separate reviewer read the change against the wording, overlap, and best
practices reviews. Its findings were fixed: the skill no longer lists records
that are not files, and it no longer removes a file from the list because
Git does not show it. The reviewer has not read the fixes.

Not run: the routing test in Claude Code and Codex, and a live run of the
skill. `/filechanges` does not exist in this repository, where
`skillOverrides` turns the project skills off, or in a project that is not
on Toolkit V2 yet.

## The checks and two hook commands on Windows, version 0.9.10 (2026-10-07)

The checks under "Checks" in `AGENTS.md` failed on Mike's Windows computer
on an unchanged `main`. What was wrong, and what changed:

- Line endings. Git on Windows wrote every file with CRLF, and the check
  tools and tests split files at `\n` and compare copies byte for byte. A
  new `.gitattributes` in the root (`* text=auto eol=lf`) keeps LF in every
  checkout. `check-skills.mjs` went from 15 errors to none with no other
  change. It now stops with the two commands that fix a checkout made
  before that file. The main checkout and the other open worktrees on the
  Windows computer need those two commands once, after this is merged.
- The tests built a `PATH` joined with `:`, called `/bin/sh` and `which`,
  and made stand-in commands as shell scripts. `dev/tests/support.mjs`
  (48 lines, new) now holds what differs on Windows, and `hooks.test.mjs`,
  `validate-records.test.mjs`, and `validate-records-cases.test.mjs` use
  it. Two tests that need a file `chmod` made unreadable are skipped on
  Windows. The test "codex-after-commit: a long run of git options stays
  fast" now times each command against a plain `git status`, and the
  fastest of three runs counts, because starting Node alone can take
  seconds on a busy Windows computer.
- `claude plugin test ./plugins/workstreams` failed 12 of 14 tests on
  Windows. Claude Code gives the test's disk a full Windows path
  (`C:\Users\me\...`), and the disk was keyed by `/Users/me/...`. The fix
  is in the test file only (477 to 481 lines). The mod did not change.

Two hook commands that ship to projects were wrong on Windows. Mike said
yes to both fixes on 2026-10-07, after he was told the sizes:

- `validate-records.mjs` compared paths with `/`, and Windows gives `\`.
  So on Windows the check after an edit said nothing for any file in a
  folder (`system/`, `sources/`, `work-items/`, `memory/`), and a worktree
  session reported work item findings it should not. 20 tests failed for
  this reason. The command now turns each path into its `/` form, and it
  reads a work item saved with CRLF. It went from 279 to 280 lines, which
  is the limit: there is no room left.
- `session-start.mjs` started `ntn` without a shell. On Windows `ntn` is
  `ntn.cmd`, which cannot be started that way, so a project with Notion
  memory never got its Current state page printed. 2 tests failed for this
  reason. The command now starts `ntn` through the shell, on a Mac too. It
  is still 76 lines.

A separate reviewer checked both fixes against
`dev/reviews/best-practices-review.md` and the captured hook pages. It
found nothing that had to be fixed, and two things that should be. Both
were done, with no new line in the command:

- Windows tools write one folder as `C:\project` and as `c:\project`. The
  command compared the two as text, so a session folder given with a
  lower-case drive letter got no check after an edit. It now compares them
  as paths.
- The fix for a work item saved with CRLF had no test. A new test in
  `validate-records-cases.test.mjs` covers it and the drive letter. That
  file is now 256 lines.

An existing project gets both fixes at its next "update the toolkit",
which replaces the hook commands. Codex needs no new trust: it trusts the
entry in `.codex/hooks.json`, and no entry changed.

Still open:

- `org-guard.test.mjs` fails 6 of 10 tests on Windows, because its stand-in
  `sf` is a shell script. The parked branch `sandbox-checks-switch` holds
  the fix.
- A checkout made on Windows before `.gitattributes` needs the two commands
  above once: the main checkout, and the worktree `sandbox-checks-switch`
  after its work is committed.
- From the review, not changed: on Windows, an edit of an `AGENTS.md` or
  `CLAUDE.md` on another drive, outside every repository, makes
  `validate-records.mjs` report the project's findings. The findings are
  true; only the moment is wrong. `session-start.mjs` now passes the
  Current state page ID through a shell. The ID comes only from the hook's
  own entry in the settings file, so the reviewer and the writer left it
  as it is; cleaning it first would take the command to 77 lines, one over
  its limit.
- Nothing here was run on a Mac.
- Not checked: whether Codex runs its hook entries on Windows. The
  helper-agent reminder in the Claude Code settings runs `echo` with no
  shell, which on Windows needs an `echo.exe` on `PATH`; Git for Windows
  provides one on Mike's computer.


## Sandbox questions the owner turns off and on, version 0.9.9 (2026-10-07)

In the Dragonfly project Mike asked in 6 sessions for sandbox work without
a question each time. He chose this on 2026-10-07: he tells the agent to
stop asking, the choice holds in every session until he says to ask again,
and no code is added.

- `salesforce-org-safety.md` has a new section, "The owner's yes for a
  sandbox change". The agent asks before each sandbox deploy, data write, or
  `sf apex run`, unless the project's Current State holds the line "Sandbox
  questions: off". The agent adds or removes that line only when he says so.
  While it is there, the agent may also deploy a profile to a sandbox and
  delete metadata from one through a deploy.
- No code asks any more: `protected-orgs.json` has `"sandboxAction":
  "allow"`, and the seven `ask` entries for `sf` commands are out of the
  starter `settings.json` and out of the list in `setup-copy.md`.
- `update.md`, "The questions before a sandbox change", gives an existing
  Salesforce project both changes.
- `sf-data-change`, `production-data-changes.md`,
  `permissions-source-control.md`, and `salesforce-deploying.md` point to the
  new section.
- `dev/tests/org-guard.test.mjs`: four expected results changed from "ask"
  to "allow". The guard's code is unchanged.
- The starter settings now also refuse `sf project delete source` in the
  PowerShell tool, and `check-skills.mjs` reads `PowerShell(...)` entries
  as well as `Bash(...)` entries. A separate reviewer found that, with the
  guard no longer asking, that command on a sandbox would have passed in
  PowerShell. The reviewer's other findings were fixed too; the reviewer has
  not read the fixes.

Not verified on this Windows computer: 6 of the 10 guard tests fail here on
an unchanged main, because the stand-in `sf` is a shell script, and the test
that holds the four changed rows is one of them. Run the guard tests on the
Mac before a merge.

The rule is the same in Claude Code and Codex, by Mike's answer of
2026-10-07 ("the rule should just be standard across any model"). The line
that said the owner runs every sandbox change in Codex is removed from
`salesforce-org-safety.md` and from `salesforce-deploying.md`.

The line "Sandbox questions: off" covers every sandbox and scratch org of
the project. Mike on which sandboxes it should cover: "Every project is
going to be different." A project that needs a narrower rule changes its own
copy of the rule.

A switch built into the guard, for one session and 12 hours, was built
first and never merged. Mike chose the instruction over it. Its branch was
removed on 2026-10-07, and its changes are kept as
`dev/archive/research/sandbox-checks-switch.patch`.
## Small work items, working files, and the owner's usage record, version 0.9.8 (2026-10-07)

Work item TKV-30. Mike had an agent read his own messages in the session
files of two real projects: Davis (17 files, ongoing support for one client)
and Dragonfly (43 files, a Salesforce org merge). The findings are in
`reference/how-the-owner-works-with-agents.md`. Its folder, `reference/`, is
a new top-level folder that no plugin ships. With his yes, on 2026-10-07:

- **A short path for a small work item** (at most one phase, one or two
  tasks, no sub-items, no Designing). The agent plays the goal back and the
  owner's yes approves the requirements, with no interview and no
  requirements analyst. One closing question, "Approve this result and mark
  <ID> Done?", takes the place of the result approval, the move-up question,
  and the Done question. The stops for a merge and for a deploy stay.
  `lifecycle-rules.md`, "A small work item", holds the steps;
  `refining-requirements.md`, `building.md`, `testing-loop.md`, and
  `closing.md` point to it or hold their part.
- **One project phase, "P01 — Ongoing support"**, for a project with no
  planned order of work. The agent never asks whether it is done.
- **`working-files/<ID>-<short-slug>/`** in every project, kept out of Git,
  for files exported, downloaded, or made while working. The agent deletes one only when
  the owner asks. Mike: "This way is fine for now"; he may revisit putting
  these files inside the work item's own folder. `delivery/AGENTS.md` now
  keeps a client handoff file that holds real records out of Git.
- The checker can check a file that Git does not track: `testing-loop.md`,
  step 2, and one paragraph in `acceptance-checker-brief.md`.
- "Update the toolkit" now adds missing lines to a project's `.gitignore`
  and `.ignore` (`update.md`, row "Ignore files"), so an existing project
  gets `/working-files/`.

Two separate reviewers read the change, one against the wording review and
one against the best practices review with three walk-throughs of a small
work item. Their findings were fixed, and each reviewer read the fixes. The smaller
points from that second read were fixed and were not read a third time.

Mike decided on 2026-10-07 when the separate checker runs for a small work
item on the short path ("your recommendation"): only when the result changes
production, changes an environment other people use, gives a number, a list
of records, or a finding to a person outside the project, or changes a rule
in `system/`. Otherwise the main agent checks its own work and shows the
proof. This is one exception to his decision of 2026-09-28 that the checker
always runs.

Also on 2026-10-07 he had the limit of five memory records saved without a
question removed from `memory-process.md` ("I don't think we need a
limit").

Not changed, by his choice: which tests run on a Salesforce deploy
(Salesforce's own skills), and ClickUp as a tracker (maybe a skill later). A
way to turn the Salesforce sandbox checks off for one session is separate
work in another session.

## The agent's job in the starter AGENTS.md, version 0.9.7 (2026-10-07)

Mike read the starter root `AGENTS.md` in an editor page and left three
notes. With his yes, on 2026-10-07:

- A new section, "Your job as the agent", sits before "Every session". It
  says that the agent runs the project and the owner works with it as a
  team, and it names the skills for work items, records, and memory. It
  replaces the two sentences on the agent's role in the opening paragraph.
  Mike's own line "There is nothing you and the user cannot do as a team!"
  was left out at his choice, because it holds no instruction.
- The two lines on answering a question were cut, because they repeated
  each other. "Decide whether the owner asks for an answer or a change"
  stays; `managing-work-items` still says not to advance a work item for a
  question.
- The size limit for a project's `AGENTS.md` in setup's final check and in
  "update the toolkit" went from 20,480 to 22,528 bytes. The file is 20,768
  bytes. Codex reads at most 32,768 bytes of instruction files in all,
  `~/.codex/AGENTS.md` included.

A separate reviewer checked the change against the wording and best
practices reviews; its findings were fixed and it read the fixes. Open for
Mike: the reviewer found "adds context" and "gives input" vague, and they
stay until he decides. The new heading means an existing project gets a new
`AGENTS.md` built at its next "update the toolkit" (`update.md`, "Updating
AGENTS.md", second case). All checks passed, except
`hooks.test.mjs` "when MEMORY.md cannot be written", which also fails on
`main` in a container that runs as root.

## Work and memory skill merge, version 0.9.6 (2026-10-06)

Work item TKV-29. Mike approved one `managing-work-items` skill and one
`managing-project-memory` skill, each with the storage references selected
by project setup. The work-item lifecycle remains a separate reference
inside the work skill. The memory process is a reference inside the memory
skill. Hindsight keeps its rule and receives no Toolkit memory skill.
`filing-project-records` and `using-notion-cli` remain separate.

The starter `AGENTS.md` now checks each turn for work items, project records,
and memory, then routes to the relevant skill. The previous process and
storage skill files moved into the merged skill folders; their record forms
and approval rules were retained. Setup, update instructions, the skill
index, descriptions, hook text, repository guides, and test expectations
use the new names. The skill checker assembles all nine work and memory
choice combinations and checks the files contributed by each choice.

The marketplace and plugin validation, Workstreams tests, skill and rule
checks, all 112 Node tests, and `git diff --check` passed. The rule check
reported its three existing size warnings. A malformed tracker reference
was detected by the assembled-skill check. A separate verifier reviewed
the file mapping, setup combinations, and merged instructions and found no
blocking issue. Scratch installs of toolkit 0.9.6 passed in Claude Code
and Codex.
Live skill routing in Claude Code and Codex remains unverified until those
hosts have working authentication.

## Headings in the document clarity standard, version 0.9.5 (2026-10-06)

Mike liked the short, clear headings in the standard and asked for useful
changes. The rule now asks every document heading to use a short, ordinary
name for its section. It allows more detail when the reader needs it to know
what follows. The copy in `writing-harness-files` matches the rule.

## Artifact wording in the document clarity standard, version 0.9.4 (2026-10-06)

Mike asked for finished artifacts, including diagrams, charts, dashboards,
mockups, slide decks, published pages, and reports, to use short, ordinary
language that is easy to scan. The standard now says to use the fewest words
that convey the needed meaning. It allows short headings, labels, notes,
and captions, while requiring complete sentences for prose and instructions.
It also states that an artifact sent to another person follows both the
document clarity standard and the outbound text rule. The repository guide
and the copy in `writing-harness-files` are kept in step with the rule.

## Two skills removed, version 0.9.3 (landed 2026-10-06)

Work item TKV-28. Mike, 2026-10-06: "Delete the Explain Simply skill and the
Choosing Outside Tools skill. That should absolutely not be a skill. That
just needs to be something that's just a simple file that's referenced in the
toolkit v2 but doesn't get installed into projects."

- Mike asked to merge the open pull requests on 2026-10-06. Pull request 24
  landed as commit `09160592`.
- `explain-simply` is removed from `every-project/`. A project now gets 9
  shared skills. `project-setup`'s `references/update.md`, "Retired skills",
  tells "update the toolkit" to remove the folder from an existing project.
- `choosing-outside-tools` is removed from the `toolkit` plugin, which now
  holds two skills. The tool list is the plain file `OUTSIDE-TOOLS.md` in the
  repository root. No plugin ships it. This reverses the decision of
  2026-10-03 (TKV-18) that put the list on every computer as a skill: an
  agent in another project is no longer told that the list exists.
- Every check in `AGENTS.md`, "Checks", passed on the branch.
- The routing test was not run for this change. The description rewrite
  landed in PR 25, and the writing rule rename landed in PR 26. The merge
  includes both changes and raises the version to 0.9.3.

## Document clarity standard (2026-10-06)

Mike named the writing rule `document-clarity-standard.md` and asked for the
rule and `writing-harness-files` to follow their own clarity guidance. The
new name replaces `write-documents-in-plain-english.md` in the starter
project, the rule copy, the check tool, the setup update steps, and the
repository guides. The skill description and opening now state their job
without a long definition in the description. That change raised
the toolkit version to 0.9.2.

## Skill description clarity pass (2026-10-06)

The description pass landed in pull request 25 as version 0.9.1.

The 23 skills that Toolkit V2 shipped at the time had revised descriptions in their
`SKILL.md` files and in `dev/SKILL-INDEX.md`. Each description now states the
skill's job, when to use it, and any neighboring skill that could be confused
with it. The opening of `filing-project-records/SKILL.md` gives each record
type its own action and destination. The `choosing-outside-tools` and
`sf-deploy-check` openings also use direct names in place of unclear words.
The skills' operating requirements did not change. The before-and-after text is in
`dev/reviews/2026-10-06-skill-descriptions-before-after.md`.

After that description pass, Mike asked to keep the current skill names and
decide the work and memory skill structure in a separate chat. The
`writing-harness-files` description and opening no longer route an
owner-dictated line in `owner-preferences.md` to the memory skill. The
plain-English writing rule now adds the useful points from pstack's
`unslop` and `technical-writing` skills that were missing: clear pronoun
references, named evidence, readable noun phrases, natural list length,
and choosing a document form for the reader's job. Its exact copy in
`writing-harness-files/references/writing-rule.md` matches. No output style
changed. PR 24 removes `explain-simply` and `choosing-outside-tools` after this
description pass.

The plugin version is 0.9.1. The marketplace, plugin, skill, rule, workstreams,
and Node tests passed. `check-rules.mjs` gave its three existing size warnings.
Two separate readers checked the old and new descriptions for skill routing.
Live Claude Code and Codex routing runs did not start: Claude Code reported an
expired OAuth session, and a scratch Codex home reported HTTP 401 because it
has no credentials. Run live routing in both hosts when they are signed in.

## The one-home layout, version 0.9.0 (landed on main 2026-10-06)

Work item TKV-24. It landed on main on 2026-10-06 as version 0.9.0, by pull
request 22 (merge commit `1217ce07`), together with the restored memory and
the plain-English rewrite. It was built on the branch
`claude/one-home-layout`. A new project folder was set up from it for Mike
to look at (`~/Documents/Projects/toolkit-setup-preview`; he asked for a
fresh setup in place of a rebuilt HarborDesk sample, 2026-10-05).

What Mike decided is in `dev/research/layout-audit/DESIGN-SPEC.md`. The
audits, the memory scenario test, and the specification of the checking
script are beside it. The reviews are `dev/reviews/2026-10-05-*.md`.

- One folder per setup choice under `project-setup/assets/` (`every-project`,
  `work-local`, `work-notion`, `work-github`, `memory-local`,
  `memory-notion`, `memory-process`, `memory-hindsight`, `notion-tools`,
  `salesforce`, `soul`). A choice decides which files a project gets, never
  which lines: all 53 setup marker blocks are gone.
- The project layout: a root `AGENTS.md` that is the outline and the filing
  table; `DECISIONS.md`; `system/`; `sources/`; `delivery/`; `reference/`;
  a guide (`AGENTS.md` with a one-line `CLAUDE.md`) in each main folder.
  `project-wide-records/`, `requirements/`, `system-guide/`, and
  `ai-external-knowledge/` are removed from the starter.
- Skills renamed: `running-work-item-lifecycle`, `using-work-tracker`,
  `filing-project-records`, `curating-project-memory`, `using-memory-store`.
  No new project skill: closing is a step of the lifecycle skill; recording
  a decision, filing a source, and updating a system document are three
  steps of the filing skill.
- Local memory is the Davis-based memory again (Mike, 2026-10-05: "restore
  the Davis memory and fine-tune it"; he approved the component list the
  same day): Current State in five parts, one Markdown file per concept in
  four kinds (`user_`, `project_`, `reference_`, `event_`), a generated
  index, and the "Memory approval" line. No decision records, glossary, or
  system facts in memory. Two filing rows say to write an analysis of the
  existing system to `reference/current-system/`, and a run of a recurring
  job to memory, before the reply. Reviewed twice and fixed
  (`dev/reviews/2026-10-05-memory-restore-review.md`,
  `dev/test-runs/memory-restore.md`,
  `dev/test-runs/skill-routing-memory-restore.md`). A Hindsight project
  gets no toolkit memory skill (Mike, 2026-10-05): the add-on ships its own.
- A fourth hook command, `validate-records.mjs` (15 checks; Mike accepted
  279 lines plus tests on 2026-10-05), run after an edit, at stop in Claude
  Code, and before a commit through `.githooks/pre-commit`.
- A third plugin skill, `writing-harness-files` (Mike's yes, 2026-10-05),
  and the repository rule "Harness files follow the current official
  documentation". The official pages were captured again on 2026-10-05, and
  Hindsight's pages were added.
- "Update the toolkit" has steps that move a project from the old layout to
  the new one (`references/one-home-layout.md`).
- Reviews: three separate reviews, a review of the fixes, and a review of
  the second fixes. Their status sections say what is closed and what waits.
- Routing test: `dev/test-runs/skill-routing-0.9.0.md`. Claude Code 54 of
  60 right, Codex 51 of 60. The steady misses are listed there; the
  description changes they suggest are not made yet.
- A Codex project must trust its hooks again in `/hooks` after an update.

The plain-English rewrite (2026-10-06, built on the branch
`claude/one-home-plain`; it landed on main with the same pull request, and
the version is still 0.9.0):
- Seven writers rewrote the skills, the setup references, the folder
  guides, and the rules into plain English: an opening that says what the
  file is for, whole sentences, and plain words or a name the reader can
  see in place of each made-up word. No rule was changed. A last pass made
  the words and the headings the same across the files.
- The writing rule was named `write-documents-in-plain-english.md`
  (Mike, 2026-10-06). It was `write-for-the-reader.md` for about two hours on a branch, and
  `plain-english-artifacts.md` before that. "Update the toolkit" replaces
  either old file in an existing project.
- All the writing rules are in that one rule (Mike, 2026-10-06). The long
  second text in `writing-harness-files` was deleted. The skill holds an
  exact copy of the rule, `references/writing-rule.md`, and
  `check-skills.mjs` fails when the copy and the rule differ.
- The word list is `dev/reviews/word-list.md`: one answer for each made-up
  word, and one word where the files used several, such as "session" (never
  "chat"), "the project's Current State" and "the work item's Current
  state", "the owner's yes", and "source".
- Not rewritten: the Salesforce skills and rules, `choosing-outside-tools`,
  and the templates (the work item and design templates, the memory record
  template, and the three Notion page texts).
- The root guide of a project is 19,880 bytes; setup fails a project whose
  guide is over 20,480.
- The skill routing test ran in both hosts, because 15 skill descriptions
  changed (`dev/test-runs/skill-routing-plain-english.md`): of 70 requests,
  Claude Code opened the right skill first for 65 and Codex for 56.

Open with Mike (also in `dev/research/layout-audit/FIX-LIST.md`, "Waits for
the owner", and `MEMORY-SCENARIOS.md`):
- Memory, known limits from the live runs: a mid-size model does not save
  a draft it gave only in the chat, such as a meeting preparation list (0
  of 3); a reported job failure was saved in 4 of 5 runs. Fixing more needs
  a new hook job, which needs his yes.
- Memory, for him to confirm (`DESIGN-SPEC.md` section 9): the new starter
  file `.ignore`; `@PROJECT.md` in the root guide; a project task may name
  another person; whether his request for an analysis is also his yes to
  commit its record; a save about a named person waits for his yes.
- `session-handoff.md` (his wording) and the figurative words in his older
  rule files.
- What Notion memory stores and when its pointers are read.
- The twelve changes the builders made on their own, listed in
  `DESIGN-SPEC.md` section 9 for him to confirm.
- Mike's answer on whether `toolkit-setup-preview` looks right is not
  recorded.

No longer open:
- The `AGENTS.md` edit that another session left uncommitted in the main
  checkout, the rule "Challenge the current design (Mike, 2026-10-04)", is
  kept: commit `a20dadd0` holds it unchanged.
- The review file `dev/reviews/2026-10-05-memory-restore-review.md` is
  committed (commit `571e40f1`, 2026-10-06).

## Project filing system interview (2026-10-04, TKV-24)

Mike set an active goal to define one project lifecycle, filing system,
record schema, and set of agent procedures across Salesforce and SaaS
projects and across tracker and memory choices. This is design work; the
Toolkit V2 model and shipped skills have not been changed for it. The
working inventory is `dev/research/project-filing-lifecycle-working.md`.
The active Notion work item is TKV-24, "Define the project lifecycle and filing
system." TKV-4's HarborDesk review follows its approved design; TKV-21's
Claude-Obsidian evaluation follows that review. TKV-19 remains Done for the
earlier project-wide records work.
Mike chose a complete labeled setup structure with instructions and forms,
and no fictional records. He also asked agents to recommend a better design
when current files are unclear; the instruction is in this repository's
`AGENTS.md`. Mike approved one stable entry or locator for each original
source, including one-item meeting sources, so work items can lead an agent
back to their context on resume (TKV-24 Q-02). Mike also rejected a giant
collection of bite-sized decision files and requires an answer to be findable
by a human browsing in VS Code (TKV-24 Q-03). Mike did not accept the
subject-based proposal (TKV-24 Q-04); he asked for a Salesforce org-merge
walkthrough starting at setup, planning, and discovery before choosing
folders. The walkthrough and comparison are drafted in the working inventory
through target decision, build, cutover, and a changed answer. The draft also
separates claim, approval, delivery, question, and work-item states. It now
includes a candidate filing decision procedure, readback rule, and examples
showing that tracker and memory choices do not change the record route.
An event-by-event ledger now tests which record carries the source, current
answer, unresolved question, work, and verification at each org-merge stage.
An audit against `codex/tkv4-review` now lists the actual model route and
unresolved gap for each of those records, including conflicting no-item
decision instructions and the missing general SaaS release evidence route.
The changed-answer procedure has been checked against the current shared
records skill; the draft identifies six seams to settle while retaining its
existing answer history, impact checks, and readback behavior.
The org-merge scenario now compares the current role split, a single
`planning/` home, and separate dated discovery versus maintained answers
across workshop, approval, cutover, changed answer, human lookup, and
migration. No folder choice has been approved.
TKV-24's Notion summary and solution-options note now reflect the three
approaches and the open Q-05; its status remains In Progress and Waiting on
Mike for that question.
Mike clarified the missing workflow: a result-led data model design work item
uses kickoff and discovery questions, and its finished design needs a lasting
human-findable home. The working draft now traces that item through source
intake, questions, a maintained design, approval, build handoff, and a later
change. Mike agreed that the design item ends when the design is approved;
the decision is recorded in `dev/GOAL.md`. The draft now compares two
whole-project structures: one organized by record role (recommended for
testing) and one by business/system area. It identifies overlap among the
current system data model requirement, item design, and shared target
architecture. The exact paths remain proposals. Next: show the options to
Mike, test a cross-area architecture design and changed answer against his
preferred layout, then settle the folder names and procedures.
For Mike's refactor-size question, the newer model branch has 60 candidate
files mentioning the old location terms: 23 model files, 19 shared-skill
files, 2 tracker-skill files, 9 setup files, and 7 settings/docs/check files.
The working design records a provisional 30-45 substantive edits, plus file
moves, migration instructions, and scratch-project verification; it would
not require a new runtime. This is a reference inventory, not a final edit
count, and no shipped files were changed for the proposal.
The HarborDesk current-state audit is in
`dev/research/harbordesk-current-state-audit.md`. It maps the existing files
and the lifecycle gaps using the fictional sample, without changing that
project or the shipped model. Mike asked for a plain explanation, so the file
now describes the setup and each problem with an example, without proposing
a final folder design. Read it before settling the final folder layout.

## Merge update (2026-10-04)

- Mike approved both merges. Pull request 20 landed the `dev/` cleanup, and
  pull request 18 landed the project-wide records design and Toolkit V2
  version 0.8.16. Both merged into `main`; the repository checks passed.
- Notion work items TKV-19 and TKV-23 are Done. TKV-21 is no longer blocked
  by TKV-19 and has its requirements step recorded.
- The main checkout still has unrelated untracked files, including a path
  added by pull request 18. Leave them in place until their owner reconciles
  them; do not pull into that checkout yet. Existing client projects receive
  version 0.8.16 only when Mike asks to update each project.

## Developer folder cleanup (2026-10-04)

- The filing map is `dev/INDEX.md`. Superseded drafts, completed reviews,
  old handoff prompts, old model reviews, and the September diagrams were
  moved to `dev/archive/`. The current checks, research, tests, and shared
  sources remain in their working folders. The long earlier progress log is
  in `dev/archive/model/`. References within developer Markdown files were
  updated to the new paths.
- All test evidence remains in `dev/test-runs/`. Mike's approval is needed
  before any test data is deleted (`dev/GOAL.md`, "Not in this goal").
- This cleanup changes developer files only. It does not change the toolkit
  that projects receive, so it does not need a plugin version change.


## Current State (2026-10-04)

The Toolkit V2 build is tracked as work items in the Notion project "Toolkit V2" (https://app.notion.com/p/Toolkit-V2-3edb381da17681eeb7ddd0a6d662f9b2). Older sections below are history.

- 2026-10-04: TKV-19, version 0.8.16, built on pull request 18 after Mike asked to execute the plan; it merged later that day. `dev/research/project-wide-records-workflows.md` holds eleven workflow diagrams; `dev/research/project-wide-records-implementation-plan.md` lists the design and changed files. Every new project gets `project-wide-records/` with five templates and a folder `AGENTS.md`, plus the shared `managing-project-wide-records` skill, regardless of tracker or memory choice. Existing item, requirement, system-guide, source, and memory homes stay authoritative. Setup, handoff, work-item, and document-save routes were updated; no hook or program was added. Independent wording, overlap, and best-practices findings were fixed and rechecked. The repository checks pass (two pre-existing rule warnings); a scratch project copy, 18 rendered AGENTS combinations, temporary plugin installs, and six read-only routing sessions in Claude Code and Codex passed (`dev/test-runs/project-wide-records-0.8.16.md`). No live Notion or Hindsight project was changed during implementation; projects receive the new version only when Mike asks to update them.
- 2026-10-03: Wrote `dev/research/project-knowledge-proposal.md` and created Backlog item TKV-19, "Structure knowledge across complex projects." The proposal covers cross-item questions, source intake, people, target architecture, domain maps, and change propagation. Made a 107-second Explainroo video in `~/Documents/Projects/explainroo/videos/toolkit-knowledge-before-after/out/video.mp4` to show the current and proposed states; its final audio check understood all narration. At that point no model or skill change had been approved or built. The 2026-10-04 entry above supersedes that next step.

### Now (in progress)
- One Notion project template, 0.7.7: Mike's Projects database now has one template, "Project" (work items and memory). Setup makes every Notion project from it and removes the part kept elsewhere; the steps were tested live on two throwaway projects (trashed). Landed (485caff). Its work item template was in Notion's trash; restoring it through the API did not give Mike a working template, so he made a new one in the app and the agent rebuilt its four views (tested on a throwaway project). 0.7.8 replaces the toolkit's API-restore instruction: the owner restores in the app, or a new template is built.
- A review folder where Mike can read and edit every file a project gets, then hand his edits back: next, after this commit.
- Goal-gap fixes, 0.7.9 (Mike's yes, 2026-10-02): the agent keeps the whole work item true (each task's status and who does it, each phase's status, every field); the lead sets its own task In Progress and adds a task before work no task covers; work the item's goal does not need, and a defect outside the requirements, become new Backlog items; a started item is listed under "Now". Notion tasks gain Status and "Who does it" (pinned at the top of each task page), with migration steps in "update the toolkit". Next: run "update the toolkit" on the Toolkit V2 Notion project.
- Skills reminder on every prompt, 0.7.10 (work item TKV-9, Mike's request 2026-10-02): the existing prompt-reminder.mjs now prints one line before each answer telling the agent to check the project's skills and use every one that fits, then the memory hint when a phrase matches. 4 lines added to the hook (56 to 60); settings snippets unchanged, so Codex needs no new hook trust. Landed on main (e2f1962).
- Levels structure, 0.8.0 (TKV-7, Mike's yes, 2026-10-02), landed on main 2026-10-03 with his yes: the same levels in every tracker. The project has phases (P01) and its own tasks (PT-01); a top-level item has phases (P1) with tasks (P1-T01) and level-2 sub-items; level-2 and level-3 sub-items have one plain task list (T01). managing-work-items has one "Levels" section; the work item template has a sub-item form; each tracking-work-items skill says where project phases and tasks live (local PROJECT-ROADMAP.md and work-items/PROJECT-TASKS.md; Notion rows with no Work item and three new views; GitHub milestones and a pinned "Project tasks" issue); PROJECT-ROADMAP.md has no work units and is local only; "update the toolkit" converts older sub-items that have phases. Notion also gets Task type and Phase type (formulas from Work item), the project page opens Phases and Tasks on the project's own rows, and setup checks the shared "Project" template against the layout before copying it. Added 2026-10-03 (Mike's yes to all five recommendations): a Notion task has one status field, Status of Notion's status type, and no "Done" checkbox ("update the toolkit" converts an older project; the agent retypes it through the API after his yes; corrected 2026-10-03 after the live test); the shared "Project" template always matches the toolkit (R-11 confirmed); "Untracked to-dos" is gone from Current State (a project to-do goes to its work item, a project task, or a new Backlog item); "By project phase" is the first Work Items tab. Not run live: the Notion test area is gone, so the new views, the two formulas, and the Done-to-Status steps were reviewed but not run against Notion. Next (Mike's choice, 2026-10-03): run the new Notion steps on a throwaway project made from the template first; then, with his yes, on the Toolkit V2 project and the shared template (TKV-7, task P1-T11).
- The new Requirements layout, 0.8.1 (TKV-11, Mike's yes, 2026-10-03): the Notion work item page text now matches the work item template Mike rewrote in his "Project" template (the note at the top, level-1 section headings, the Requirements section, "Linked Github PRs"); local files and GitHub issues use the same Requirements layout ("Requirement <number>: <short name>" with the original requirement word for word, its goal, a numbered requirements list, and numbered Acceptance Criteria); `managing-work-items` writes requirements in it and records approval in "Requirements approved" and Questions and Answers; text in angle brackets is an instruction, so no item an agent creates or changes keeps any; setup and "update the toolkit" never change the owner's parts of the template back and never rewrite an existing item's Requirements. The same branch holds the fixes from the live test of the 0.8.0 Notion steps (`dev/test-runs/notion-levels-0.8.0.md`). Reviewed in two rounds by a separate agent (16 findings, all fixed) and landed on main 2026-10-03 with Mike's yes. Still open: a live Notion test of filling a new item from the new template, on a throwaway project.
- The 8 carried-over skills rebuilt, 0.8.2 (TKV-5, Mike's instruction 2026-10-03; a builder and a separate reviewer, both Opus). No skill added, removed, or renamed; no description, index row, or model routing line changed, so no routing test was needed. pull-latest: the never-rebase rule moved to the opening; a branch with no upstream now gets a fetch and one question before a merge of the default branch, where it stopped before; a stop when no branch is checked out. reset-to-remote: says the reset runs in the main checkout, which its commands need when the session is in its own worktree. merge-and-clean-up: the standing merge instruction's conditions live only in managing-work-items (this skill says it counts only when managing-work-items sent the agent); a check for AI credit in the pull request title, description, and commit messages before the merge. publish-docs: the merge-safety check before the local fast-forward with no remote. handoff: the memory step points to managing-project-memory and keeps "save only what the owner asked to keep or says yes to"; the phrase list for checking a pasted prompt is gone; the template no longer lists saves the owner said no to (the memory rule forbids it); the verifier brief no longer repeats step 6. braindump: two clauses cut, one of which disagreed with the model's AGENTS.md. explain-simply: one wording fix. session-summary: unchanged. The reviewer checked the plan (4 blockers, 9 should-fix, 6 notes) and the finished text (3 should-fix, 5 notes); all were fixed or held. Held for Mike then, and built in 0.8.6 after his yes (see the 0.8.6 entry): the four check steps he held in the 2026-10-01 audit (reset-to-remote: install command in the plan, a missing installer, a check after the reset; explain-simply: a check before sending), removing merge-and-clean-up's agents/openai.yaml, project tasks at a handoff, and whether unrelated uncommitted files in the base folder should still block the cleanup after a merge. Shipped and flagged for Mike's yes: pull-latest's merge question, reset-to-remote running in the main checkout, the AI credit check before a merge (not tested: that GitHub adds no co-author line of its own when a body is given), the publish-docs check, the handoff template change, and the braindump cut. Not tested live: the skills were reviewed and the repository checks pass, but none was run in a test project. Waiting on the main session: review and landing on main.
- Move-over for projects on the old toolkit, 0.8.3 (TKV-3, Mike's request 2026-10-02, his word to build and ship it 2026-10-03), built on its own branch, not landed: saying "toolkit v2" in a project opens project-setup, and the folder decides the path: a new project is set up, a Toolkit V2 project is updated, and a project set up with the older claude-toolkit, the retired toolkit program, or by hand is moved over. The move-over takes his choices, reads the project, and shows one list (Delete, Add, Update, Kept untouched, Your call), each line with a reason; nothing changes before his yes, and a plain yes never carries out a "Your call" line that changes something. Tracked files change on the agent's own branch; old work items and memory stay where they are, and the ones still in use are carried over into the Toolkit V2 form. Two new references: move-over.md (the steps and the list template) and old-toolkit-pieces.md (the old toolkit's pieces and how old records map). Tested by walking a scratch old-toolkit project through it in Claude Code (dev/test-runs/move-over-0.8.3.md) and by a routing check in both hosts (dev/test-runs/skill-routing-0.8.3.md). A separate reviewer checked the requirements and ran the wording, overlap, and best-practices reviews. Waiting on Mike: his yes to land it, and the open questions Q-02 to Q-13 in TKV-3 (points the agent decided).
- Workstream panel, 0.8.5 (TKV-12, Mike's request and his choice "Separate plugin + Windows fix", 2026-10-03), landed on main 2026-10-03 with his yes (pull request 11): a second plugin, `workstreams`, for Claude Code only. `/streams` opens a side panel that lists the project's Notion work items by status, the chat each open item belongs to, and the running helper agents. It reads the data source id from `PROJECT.md`'s Notion block (or this repository's `AGENTS.md`), reads Notion with `ntn`, and finds the chats by scanning the chat files Claude Code saves. It ran live on Mike's Mac in the desktop app from `~/.claude/skills/workstreams` before the move into the repository. A separate reviewer read it; its findings are fixed (a chat is counted only when it changed the item's own page, a slow failure is not retried, `/streams` opens at once, more than 100 items are read, `CLAUDE_CONFIG_DIR` is honored). `dev/tests/workstreams-scan.test.mjs` runs the scan with the Mac's own tools. The Windows path (the shell that comes with Git for Windows) is covered by a test with stand-ins only: Mike tests `/streams` on his Windows computer. After the merge: install `workstreams@toolkit-v2` with his yes and remove the copy in `~/.claude/skills/workstreams`.
- "Functional Requirements" label and seven gap fixes, 0.8.4 (TKV-11, task P1-T06, 2026-10-03), landed on main 2026-10-03 with Mike's yes. Notion tests now run in a throwaway project (AGENTS.md, "Notion tests"). Mike approved a new name for one list of the Requirements block (in chat, 2026-10-03), and the agent changed his Notion template and read it back: "Functional, Process, Logic, Schema, etc. Requirements" is now "Functional Requirements", and its first hint is "One line each: system behavior, process steps, business rules, and data model". Every shipped file now agrees (the Notion work item page text, the three tracking-work-items skills, `refining-requirements.md`, and both copies of the work item template); an item that holds the older label keeps it. The live Notion test of filling a new item from the new template ran on a throwaway project (`dev/test-runs/notion-requirements-0.8.1.md`): everything worked, and the agent had to guess in seven places, each now closed with one sentence (an empty requirement list, a Backlog item's Next action, Related items with no project phase yet, an empty Goal, where the Type comes from, the repository's form in a pull request link, and two Notion facts). The fixes have not been run against Notion. Waiting on the main session: the separate review, then landing on main.
- TKV-5 follow-up, 0.8.6 (Mike's yes to all five, 2026-10-03), landed on main 2026-10-03 with his yes (762df55): the four changes TKV-5 held for him, and one new one for pull-latest. reset-to-remote: the plan names the install command, a missing installer is skipped and never installed for him, and the agent confirms the branches after the reset. explain-simply: a check before sending that no fact was dropped. pull-latest: from a session's own worktree it also fast-forwards the main checkout, only when that is clean and on the default branch; uncommitted changes in the session's own worktree do not stop that update. merge-and-clean-up: agents/openai.yaml is gone (in a project, "update the toolkit" lists it and removes it after his yes), and after a merge only an uncommitted file the pull request changed blocks the cleanup. A pull that fails also skips the cleanup: Git refuses the update when another newly landed commit changed an uncommitted file in the base folder, and the skill then changes nothing there and reports it. handoff: it also updates the project tasks (PT-01 form) the session worked on. No skill added, removed, or renamed and no description changed, so no routing test was needed. Reviewed through four lenses (wording, best practices, correctness, completeness), each finding checked by a separate skeptic; the 9 confirmed findings are fixed. Not tested live. Projects get it when the owner says "update the toolkit".
- Workstream panel rebuilt around chats, 0.8.7 (TKV-14, Mike's request and his choice "Each chat reports", 2026-10-03), landed on main 2026-10-03 with his yes (pull request 12). Mike does not track work in Notion in every project, so the panel no longer reads Notion or searches chat files. Each chat's agent reports its pieces of work (name, status, next step) through the tool `mcp__workstreams__report`; the plugin notes each chat's state at no token cost; each chat saves its record in its own file under `~/.claude/workstreams/<project>/`; `/streams` shows one bordered card per piece of work and per chat. Live test in the test sign-in, 2026-10-03: a chat starting a real piece of work loaded the tool and reported it unprompted; a chat given a small one-off request did not report, and still showed as a chat with its state and last message. Not yet tried: the panel in the desktop app, two live chats side by side, and Windows.
- Workstream panel, what counts as a workstream, 0.8.8 (TKV-14, Mike's request 2026-10-03), landed on main 2026-10-03 with his yes (pull request 13). The panel ran live in the desktop app on his Mac after a restart and showed a card for the chat "TKV-5 and 3". Mike then said what a workstream is: "a significant piece of work ... a work item or some large task that I'm tracking". The instruction every chat reads and the tool's description now say that, in place of "work that takes more than one step". He did not want a "recently completed" list beyond the "Done today" one.
- Tool list, 0.8.9 (TKV-18, Mike's request and his yes to the goal, 2026-10-03), landed on main 2026-10-03 with his yes (pull request 14): a second skill in the `toolkit` plugin, `choosing-outside-tools`. It lists the outside tool Mike uses for each kind of job, where it comes from, how to set it up, and his choices for it, so every computer uses the same tool without him remembering it. It is text only; the toolkit ships none of the tools. The first row is explainroo, for narrated explainer videos, with the corner label off. `check-skills.mjs` now also checks the plugin's skills beside project-setup. A separate reviewer ran the wording, overlap, and best-practices reviews (5 should-fix findings and 1 from the fixes, all fixed and read again). The routing test ran in both hosts in two rounds, the second after the description changed (`dev/test-runs/skill-routing-0.8.9.md`): 14 of 14, then 12 of 12. One test prompt ("add this to my to-do list: buy milk") made Codex add a real task to Mike's Todoist inbox: routing prompts must not name anything a connected app can act on. Not tested: setting explainroo up on a second computer, and Windows. The test task was removed from his Todoist with his yes. Added 2026-10-03 at Mike's request: a second choice in the explainroo row, `"sfx": "minimal"` (no pencil, pop, or tick sounds), built on its own branch. Found after the merge: the `toolkit` plugin is turned off in Mike's Claude Code and in his Codex on this Mac, so no chat reads the tool list yet. Waiting on Mike: whether to turn the `toolkit` plugin on in both apps, the names of the other tools he wants on the list, and whether adding a tool from any project (not only from a chat in this repository) is worth building.
- Workstream panel, Dismiss buttons, 0.8.10 (TKV-14, Mike's choice "Add a Dismiss button", 2026-10-03), landed on main 2026-10-03 with his yes (pull request 16). Mike said the panel "looks great" in the desktop app. He archived a chat and its card stayed, because the panel is not told about archiving. Each workstream card and chat card now has a Dismiss button; the dismissed cards are in `_dismissed.json` beside the chats' files. A piece of work shows again when it is reported again; a chat shows again when Mike writes to it or it reports work. Two new tests, on the terminal and the desktop app. Not yet tried on his screen.
- Workstream panel, Done button and one card per chat, 0.8.14 (TKV-14, Mike's choice "Add a Done button" and his layout idea, 2026-10-03), landed on main 2026-10-04 with his yes (pull request 19). He used the Dismiss buttons in the desktop app and they worked. He expected a finished piece of work to move to "Done today" when he cleared its card; Dismiss only hid it. Each piece of work now has a Done button (moves it to "Done today") and a Dismiss button (hides it). The layout is now one card per chat, with the chat's pieces of work inside it, each with a colored status label; the separate Workstreams section is gone. 13 plugin tests, on the terminal and the desktop app. Not yet tried on his screen.
- Apex and Flow test runs stopped in production, 0.8.12 and 0.8.13 (TKV-6, Mike's yes 2026-10-03), landed on main 2026-10-03 with his yes. 0.8.13 added Flow test runs (`sf flow run test`) on his answer to Q-02 ("go with your recommendation") and renamed the guard's category from `apexTest` to `testRun`; Agentforce agent tests (`sf agent test run`) stay unchecked by his choice. The starter project's Salesforce guard (`guard-protected-orgs.cjs`) now checks the commands that start Apex or Flow tests in an org: `sf apex run test` in any word order or colon form, its old name `sfdx force:apex:test:run`, `sf logic run test`, and `sf flow run test`. Aimed at a production org, or an org the guard cannot classify, they get the decision a deploy gets there: blocked while the policy says deny, and blocked in Codex. Aimed at a sandbox or scratch org, they pass with no question from the guard, the way a deploy validate does. In Claude Code, `sf apex run test` on a sandbox still shows the permission prompt that the starter settings give every `sf apex run` command; the guard itself asks nothing. Known limit, shared with a sandbox validate: the guard blocks a sandbox test run when the org name is the last word inside `$( )` or backticks, or stands directly before `;` or `|`; a space or another flag after the org name avoids it. `--help` and reading results (`sf apex get test`) still pass. The guard grew by 9 lines, 986 to 995: one new line of code (the `testRun` category), two changed lines of code (`apex:run:test` left the not-guarded list, and `testRun` joined the list that is silent on a sandbox), and comments. The rule `salesforce-org-safety.md` and the text in `protected-orgs.json` now say the same. No setting value changed, and the Codex hook entry did not change, so Codex needs no new hook trust. New test: `dev/tests/org-guard.test.mjs` (171 lines, 10 tests) runs the guard in a scratch project with a stand-in `sf`, so no real org is reached. It passes on the new guard, and the 5 tests about test runs fail on the old guard. The guard from before 0.8.12 and the 0.8.12 guard were also compared on 3,960 combinations of command, target org, and host: they differ only on Apex test runs. The 0.8.12 guard and the 0.8.13 guard were compared on 4,048 combinations: their decisions differ only on `sf flow run test`, and the message names the category `testRun` where it named `apexTest`. Reviewed through three lenses (the code and 111 ways around it, wording, completeness). The review found weaknesses that were already in the guard before this change; they are a separate Backlog work item. Projects get it when the owner says "update the toolkit". The weaknesses that were already in the guard are work item TKV-20 (Backlog).
- Workstream panel, plain names, the About line, labelled layout, and collapsible cards, 0.8.15 (TKV-14, Mike's yes 2026-10-04: "build all of it then merge it into main"), landed on main 2026-10-04. Mike switches between many chats and needs reminding what each piece of work is. The agent now names a piece of work with a subject line in his own plain words and sends an "about" text, one or two sentences on what he asked for and why; the first "about" is kept. Each piece of work shows About, Status, and Next as labelled lines under its name; "Chat" and "Workstreams" labels separate the chat from its work; a card folds with Collapse. Buttons are now "Mark done" and "Hide". Live test in the test sign-in: the agent named a piece of work "Keep web shop customers logged in for a day" with a plain two-sentence reminder. 14 plugin tests. Not yet tried on his screen.

### Just done (2026-10-01 to 2026-10-02)
- Skill cut, 0.5.0 (7b51260). Hindsight on the VPS, 0.5.1 and 0.5.2 (855f1fc, 3169dd3). Work tracking rebuilt as managing-work-items and tracking-work-items, 0.6.0 (a0eda0b). Memory rebuilt as managing-project-memory, storing-project-memory, and using-notion-cli, 0.7.0 (49b1e8f). Memory clean-ups, and V2's own copy of the starter files is now the source, 0.7.1 (b62520c).
- Claude Code mods researched (1fa01f6): dev/research/claude-code-mods.md and dev/research/mods-for-memory.md.
- Notion project "Toolkit V2" made, with the Backlog item "Evaluate Claude Code mods".
- DragonFly move review (read only, kept off Git because it names the client): what moving DragonFly from the old toolkit to V2 deletes, keeps, converts, and adds.
- The voice-to-text line is now in the repository's AGENTS.md, the setup skill, and every project's AGENTS.md (0.7.2).

### Waiting on Mike
- Start the live tests of the rebuilt work-tracking and memory skills (about an hour, test sign-ins).
- After the tests: turn the toolkit plugin on in his Claude Code and install the new version in Codex.
- DragonFly: the five decisions in the review (which computer, where memory lives, which production guard, one file for DragonFly's own safety lines, keeping the data-change READMEs).
- Mods: which supervisor checks to build, if any, after the tests.
- Hindsight live run whenever he sets up a Hindsight project: his key, the add-on install, the dashboard sign-in.

### Still to do
- Routing test in both apps for the renamed skills.

### Next session starts with
- Read this section, then the Notion project "Toolkit V2".

## Earlier progress

The earlier progress log is in `dev/archive/model/progress-2026-09-29-to-2026-10-02.md`.
