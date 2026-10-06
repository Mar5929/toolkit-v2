# Review: the restored project memory

Date: 2026-10-05. Work item: TKV-24. Reviewed at commit `d320ab7e` by a
separate agent, against `4a80e453` (four commits, 65 files), the
specification `dev/research/layout-audit/MEMORY-RESTORE-SPEC.md`, section 9
of `DESIGN-SPEC.md`, the builder's record `dev/test-runs/memory-restore.md`,
and the three review standards in this folder. The reviewer changed no file
of the change and ran the hook commands in scratch folders only. Short
forms: `A/` is `plugins/toolkit/skills/project-setup/assets/`; `R/` is
`plugins/toolkit/skills/project-setup/references/`; `CPM/` is
`A/memory-process/.claude/skills/curating-project-memory/`; `UMS-L/` and
`UMS-N/` are the local and Notion `using-memory-store` folders
(`A/memory-local/.claude/skills/using-memory-store/` and
`A/memory-notion/.claude/skills/using-memory-store/`). Marks: RAN = the
reviewer ran it; READ = verified by reading the file; INF = inferred.

Result: 1 blocker, 17 should fix, 9 notes. The three checks pass. The
reviewer's judgment: no step loses the owner's data, and the parts on the
approved list are all built; the blocker is that the specification's own
test is not met, and the line added to meet it can tell the owner something
untrue.

## Check results (RAN, from the worktree)

- `node dev/tools/check-skills.mjs`: passed, 0 errors, 0 warnings (23
  skills, 23 index rows).
- `node dev/tools/check-rules.mjs`: passed with 2 warnings:
  `hindsight-memory.md` is 4,423 bytes and `salesforce-org-safety.md` 4,200
  bytes, both over the proposed 4,096.
- `node --test 'dev/tests/*.test.mjs'`: 111 tests, 111 pass.

## Blocker

1. **The specification's own test is not met, and the line added to fix it
   tells the owner something untrue.** `dev/test-runs/memory-restore.md`,
   section 6 (READ). The specification says a session on the next day "must
   know all four" threads. It knew three. The rollup analysis was never
   recorded, in 6 of 6 runs, and each reply ended "Recorded: nothing new."
   No data is lost compared with before, but the owner is told nothing was
   missed when something was. Scenario 41 (a new failure of a job) also left
   no trace. Fix: do not land it as "passes". Either the owner accepts 3 of
   4, or the mechanism changes (should fix 2) and message (d) and scenario
   41 run again on the model he uses.

## Should fix

1. **Session-start hook: an oversized Current State loses the prune request
   and names the wrong file.**
   `A/every-project/.claude/hooks/session-start.mjs:32-45, 73-75` (RAN: a
   Current State of 60 lines and 5,000 characters printed 3,947 characters,
   no "Prune it" line, no index, and "Read the rest yourself:
   memory/MEMORY.md"). The request to prune comes after the text that is
   cut. Fix: compute `size` before line 32 and push the prune line before
   `'Current State:'`; set `rest` for local memory to
   `memory/CURRENT_STATE.md and memory/MEMORY.md`; add one test for a
   Current State over 4,000 characters. The file can stay 76 lines.
2. **The "Recorded:" line and the sentence in the per-message reminder.**
   `A/every-project/AGENTS.md:20`,
   `A/every-project/.claude/hooks/prompt-reminder.mjs:51-53` (READ). Four
   problems:
   - every reply, even a plain answer, now ends with a "Recorded:" line,
     which changes what the owner sees on every turn;
   - the test shows it prints a false "nothing new" (blocker 1);
   - `CPM/references/saving.md:130-144` already gives a reply line for each
     save ("Saved to memory: ..."), so a save is reported twice, in two
     forms;
   - the hook's sentence on every message is a second job for
     `prompt-reminder.mjs`, and the code limit says a new job needs the
     owner's yes first.

   Fix: ask the owner. Recommended: drop "Recorded: nothing new.", keep one
   form (the reply lines of `saving.md`), and cut root line 20 to "Before
   you end a turn, record what a later session must know and no record holds
   yet, as `curating-project-memory`, 'Before a turn ends', says." The list
   of what to record then lives only in `CPM/SKILL.md:14-22`.
3. **"Update the toolkit" finds the old layout again on every later run.**
   `R/one-home-layout.md:50`, and step 9 at `:243` (READ; the consequence is
   INF). The command is `ls <main>/memory/decision_*.md`. Builder decision 9
   keeps the moved decision files, marked, so they are listed for ever, and
   step 9 reports each as a failure. Fix: list only the files that are not
   marked:
   `find <main>/memory -maxdepth 1 -name 'decision_*.md' -exec grep -LE '^description: *"?Moved on ' {} +`.
   This also avoids the zsh error for a pattern that matches nothing, which
   the storage skill warns about.
4. **A builder's choice is written as the owner's decision.**
   `R/notion-build/work-layout.md:17` says a project task may name another
   person "(the owner, 2026-10-05)" (READ). `DESIGN-SPEC.md` section 9 lists
   this as builder item 8, waiting for his yes, and it reverses his recorded
   "only agent or owner". Fix: remove the attribution until he confirms.
   Also not tested: Notion adding a new select option by name
   (`A/work-notion/.claude/skills/using-work-tracker/references/database-layout.md:109`).
5. **"Where are we" has two homes, and one cannot be reached.**
   `A/every-project/AGENTS.md:129` says "No skill";
   `CPM/references/current-state.md:58-60` and `CPM/SKILL.md:86` add
   instructions for the same question (READ). They also differ: the root
   says "each dated line", the reference says "every line under Coming up
   and Waiting on". Fix: delete the reference's section and the words `or
   answering "where are we"`; put its one extra instruction in the root row
   ("say when a date has passed, then prune that line with
   `curating-project-memory`").
6. **Two pointers name a section that does not exist.**
   `A/every-project/.claude/skills/handoff/SKILL.md:64` and
   `A/every-project/.claude/skills/running-work-item-lifecycle/references/closing.md:62`
   cite `curating-project-memory`, "Current State" (READ, by search). That
   skill's `SKILL.md` has no such heading. Fix: write
   `curating-project-memory` (its Current State reference, "Removing what is
   no longer true") in both.
7. **Two approval lines give different answers for one case.**
   `CPM/SKILL.md:56` (ask first for anything about a named person) against
   `:60` (an event record needs no question; an event lists "who took
   part") (READ). Also `CPM/references/saving.md:113` writes every "ask
   first" save as a proposal record in the same turn, so personal details
   about a named person reach the store before his yes; with Notion memory
   that store is a workspace outside this computer. Fix: add to `:60` "An
   event or a run row that holds more than a named person's attendance or
   work role still gets the question for that part." Add to `saving.md:113`
   "A save about a named person's personal details gets only its line in
   step 1, without the detail, until his yes."
8. **Existing records get their index line cut with no mark, and no step
   shortens them.** `session-start.mjs:65` cuts at 74 characters (READ). On
   0.8.16 a description had no limit, so most lines of an updated project
   will be cut inside a word. `CPM/references/tidying.md` and
   `R/one-home-layout.md:115` have no step for a summary over the limit.
   Fix: cut at 73 and add "…"; add to `tidying.md`, "Wrong home, wrong kind,
   or a record changed by hand", "A record whose one-line summary is over
   the limit `using-memory-store` gives: propose a shorter one that still
   states the fact."
9. **Pruning has no rule for "every line true, every section within its
   limit, still over 1,600 characters".**
   `CPM/references/current-state.md:56` (READ; the arithmetic is INF: 18
   lines fit only at about 76 characters each, and the line forms the file
   describes run longer). The hook would then ask for a prune at every
   session start. Fix: add to step 4 "The same holds when the whole is still
   40 lines or more, or over 1,600 characters: first cut each line to its ID
   and a few words, then propose cuts."
10. **Instructions stated in more than one file.** All READ.
    - The columns of the Runs table, "newest first", and the job's first
      section: `CPM/references/saving.md:85-86`,
      `UMS-L/references/record-format.md:120-125`,
      `UMS-N/references/database-layout.md:76`. Fix: `saving.md` says "one
      row per run, in the table `using-memory-store` gives".
    - "What never goes in memory", with different members:
      `A/memory-local/memory/AGENTS.md:19` (no work item status, no person's
      role), `A/every-project/.claude/rules/memory-review-and-save.md:14-15`
      (the same gaps), `CPM/references/memory-criteria.md:9-18, 37-42` (the
      full list), and the comment in the blank form. Fix: the folder guide
      keeps one sentence that points to the root table and
      `curating-project-memory`, plus the line about secrets.
    - `A/memory-local/memory/AGENTS.md:23-25` (the dates, the worktree, read
      fresh, ask before fixing his edit) repeat `CPM/SKILL.md:29, 66-67` and
      `UMS-L/SKILL.md:20-21, 30-31`. Fix: delete those three bullets from
      the guide.
    - When to search memory: `A/every-project/AGENTS.md:100` (three moments)
      and `CPM/SKILL.md:34-38` (three more, two of which say "promise a
      date" and "run a recurring job" again). Fix: one list, in the root
      line.
11. **Notion listings print the wrong column for the kind.**
    `UMS-N/references/searching.md`, "Pages linked to a work item" and
    "Every page" (READ). They print Lore's `Kind`, which is always `note`;
    the kind is in Tags (`database-layout.md:46`). Fix: replace
    `(.properties.Kind.select.name // "")` with
    `([.properties.Tags.multi_select[].name] | join(","))`.
12. **The 4,000-character limit rests on a wrong fact.**
    `session-start.mjs:72` says "Codex shows about 4,000 characters". The
    captured page (`ai-external-knowledge/codex/hooks.md:536-566`) gives the
    limit in tokens: 2,500 by default, 4,000 in the toolkit's snippets,
    about 16,000 characters. Claude Code's limit is 10,000 characters
    (`ai-external-knowledge/claude-code/hooks.md:923`) (READ). The tighter
    limit is safe and saves about 1,500 tokens at each session start, but it
    is what forces the 70-character summary and the ceiling of 30 records.
    Fix: correct the comment and the matching line in the repository
    `AGENTS.md`, and put the choice to the owner: keep 4,000 characters, or
    return to about 9,500 as on 0.8.16.
13. **Description overlap, and the routing test was not run again.** (READ)
    - Both `using-memory-store` descriptions give the example "update
      Current State" or "update the Current state page". That sends the
      owner's request to storage and skips the skill that decides which
      lines are true. Fix: a storage-only example, such as "read Current
      State".
    - `curating-project-memory` covers "what happened in a period" (root row
      118), while `session-summary` lists "what did we do today". Fix:
      change that example to "what did we do in this chat". This is a
      description change, so it needs the routing test.
    - `curating-project-memory` has no "Not for" line, although
      `filing-project-records` (a decision) and
      `running-work-item-lifecycle` (a to-do) compete for "reports a fact".
      It is at 485 characters, so the line must be traded for part of the
      parenthesis.
    - The repository rule requires the routing test in both hosts after a
      description change. Six changed; the builder's record says it was not
      run.
14. **An update row covers the blank form as the owner's record.**
    `R/update.md:104` says never to compare any file whose name starts
    `project_`; the blank form is `project_topic_template.md` (READ).
    `R/one-home-layout.md:155-156` replaces it. Fix: add "except the blank
    form `project_topic_template.md`" to the row.
15. **The Hindsight rule points to a record that project cannot have.**
    `A/memory-hindsight/.claude/rules/hindsight-memory.md:26` says "where
    its record is"; a Hindsight project has no memory records (READ). Fix:
    "and the file, link, or `delivery/` record that describes it".
16. **An unclear sentence in the root guide.**
    `A/every-project/AGENTS.md:14`: "In Claude Code this line loads the
    first: @PROJECT.md" can be read as "loads first" (READ). It also tells
    Claude Code to read a file it already has. Fix: "Claude Code loads
    `PROJECT.md` through the import at the end of this line, so read only
    `SOUL.md` there: @PROJECT.md".
17. **Handoff and the process skill differ.**
    `A/every-project/.claude/skills/handoff/SKILL.md`, step 4, says a line
    for work that is no work item holds "the thread, where work stopped, and
    the next step"; `CPM/references/current-state.md:15` says "the thread
    and its next step" (READ). Fix: make `handoff` match.

## Note

1. `.ignore` works: with it, ripgrep lists `memory/` and `work-items/`, and
   `.obsidian/` stays hidden (RAN). Three texts still say the search skips
   them: `UMS-L/references/searching.md:25`, `CPM/references/finding.md:12`,
   and root `AGENTS.md:100`. The case that remains is a session in a
   worktree. The claim about Claude Code's Glob tool in the repository
   `AGENTS.md` rests on a live test, not on a captured page. Codex was not
   tested.
2. A new Notion project still gets the `decision` tag and a "Decisions"
   view that is always empty (`UMS-N/assets/schema/08-memories-type-tags.json`,
   `11-view-decisions.json`). These are the toolkit's own additions, not
   Lore's.
3. Wording. "Seed" (13 uses) against "blank form" in
   `A/memory-local/memory/AGENTS.md:11` and "template" in the file name:
   three names for one thing, and a picture word. "Thread" (13 uses) is a
   picture word; the owner's own term is "piece of work".
   `prompt-reminder.mjs:42` says "user_ or project_" in a Notion project,
   which does not write the kinds in that form. `CPM/SKILL.md:52` says "Save
   after his yes" beside `:61`, "keep the save as a proposal".
4. Limits differ by store: local file name plus description, 70 characters;
   Notion key 60 and Synopsis 70. "Six months" is stated in
   `CPM/references/finding.md:34` and `tidying.md:65`. "Now" holds "every
   active thread" with a limit of 5 lines.
5. The index now writes `[[name]]` links; `UMS-L/references/record-format.md:81`
   says links between memory files are relative Markdown links.
6. Records carry `last_verified`, `source`, and `authorization` beyond the
   three approved dates. They come from 0.8.16.
7. `R/one-home-layout.md:155-158` replaces the old blank form without
   asking; `R/update.md:137` says to show the difference for a file Git does
   not track. A hand edit there cannot be brought back.
8. A decision record whose move the owner turns down stays in memory but is
   no longer in the index.
9. `hindsight-memory.md` at 4,423 bytes: it has to state the five parts of
   Current State because that project has no memory skill. Getting under
   4,096 would need a third file (a `memory/AGENTS.md`), which the approved
   list does not allow. The owner's call.

## Builder-made decisions

| # | Decision | Sound | Changes what a project file means (the owner confirms) |
| --- | --- | --- | --- |
| 1 | A person's lasting role stays in `PROJECT.md`; a `user_` record holds the rest | Yes | Yes: it narrows the `user_` kind |
| 2 | A proposal is saved in the same turn as the question | Yes for facts; not for personal details (should fix 7) | Yes: the approval policy |
| 3 | An event and a run row need no question | Yes, with the exception in should fix 7 | Yes: the approval policy |
| 4 | The index line is cut at 74; name plus description hold at most 70 | Only if 4,000 characters stays (should fix 12); needs should fix 8 | Yes: the form of a record |
| 5 | The "Recorded:" line and the reminder sentence | No, as built (blocker 1, should fix 2) | Yes: every reply, and a job of a hook |
| 6 | `@PROJECT.md` in the root `AGENTS.md` | Yes; seen live in Claude Code; two imports deep, the limit is four | Yes: what every session loads |
| 7 | `every-project/.ignore` | Yes (RAN) | Yes: a new project file |
| 8 | "Who does it" may name another person | Reasonable, but it reverses his recorded decision (should fix 4) | Yes |
| 9 | A decision record is kept and marked; the glossary is removed after it is read back | Yes for the data; it breaks the detection (should fix 3) | No |
| 10 | A lesson may be "kept in memory as not proven" | Yes | Yes: a third outcome at closing |
| - | 4,000 read as characters | Safe, for a wrong reason (should fix 12) | The owner's choice |
| - | `hindsight-memory.md` over 4,096 bytes | Acceptable; the limit is only proposed | No |

## Found clean

- Against the approved list: every component is present; four kinds; three
  dates; five parts of Current State with the same names and limits (5, 3,
  4, 3, 3; under 40 lines; 1,600 characters) in the process skill, the
  starter page, the Hindsight rule, the Notion asset, and the hook; the
  three new review moments are in the rule; "Toolkit settings" has 11
  lines; no decision template and no glossary remain (READ).
- Items 1 to 9 of the specification are each built (READ). No new hook
  command, no new skill, `validate-records.mjs` is not changed, and
  `session-start.mjs` is 76 lines.
- `curating-project-memory` names no memory file, folder, database, or
  storage command. Each `using-memory-store` holds storage only.
- Frontmatter holds only `name` and `description`. All six changed
  descriptions are in single quotes, under 500 characters (411 to 487), in
  the third person, with a verb first and then "Use"; each equals its row in
  `dev/SKILL-INDEX.md`. Every file in each memory skill folder is linked
  from its `SKILL.md`. Every reference over 100 lines starts with
  `## Contents`. No link leaves a skill folder. The rule file has one topic,
  a `# ` heading, and no `paths`.
- The session-start hook, by running it: exit 0 with bad input, with no Git
  repository, with a missing folder, with a missing `ntn`, and with no value
  after `--memory`; it reads the main checkout from a worktree and from a
  subfolder; it handles files with Windows line ends, files with no header,
  and old `decision_` and `feedback_` files; it writes `MEMORY.md` only when
  it changed; it never deletes a memory file.
- The update steps, walked for a project on 0.8.16: the memory records,
  Current State, and the "Memory approval" value are kept; decision records
  are marked, not removed; the glossary is removed only after it is read
  back; `MEMORY.md` and the blank form are replaced, so the dead link to the
  glossary goes. No step loses a record.

## Not checked

- No live session ran, in Claude Code or in Codex. No Notion call and no
  Hindsight call was made.
- The routing test, `claude plugin validate`, and `claude plugin test`.
- The lifecycle, filing, and handoff skills beyond their diffs and a search
  for memory instructions; the ten fixes from the sample build; the 16
  Notion schema files; `earlier-versions.md`, `hindsight-on-vps.md`, and
  `notion.md`.
- Whether Codex reads `.ignore`, and whether Codex counts plain hook output
  against `additionalContextLimit`.

## The stronger-model run

A separate test, reported to the reviewer by the coordinator after the
review; the reviewer did not run it. The rollup message (message (d) of the
owner's day) was sent again with `--model opus`, in 3 runs:

| Run | What the session recorded |
| --- | --- |
| 1 | A memory event record |
| 2 | A new file in `reference/current-system/`, which the session also committed without being asked |
| 3 | Nothing. The reply ended "Recorded: nothing new." |

So the stronger model recorded the analysis in 2 of 3 runs. Sonnet recorded
it in 0 of 6 (`dev/test-runs/memory-restore.md`, section 6).
