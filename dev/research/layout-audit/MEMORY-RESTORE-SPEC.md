# Memory: restore the Davis-based design and fine-tune it

Work item: TKV-24. Date: 2026-10-05. Status: built on a side branch
(`claude/one-home-memory`); it joins the work branch only after the owner's
yes.

## Why

The branch cut local memory down to Current State plus pointers, following
one line of the owner's layout note ("resume state + pointers only"). The
same note said "Keep as-is: ... memory/", and his recorded decisions in
`dev/GOAL.md` keep the Davis shape: "one Markdown file per concept", with
links between work items, decisions, memories, and facts. The memory
scenario test (`MEMORY-SCENARIOS.md`) then found that the cut removed the
home of facts that fit no other file, of what happened lately, and of jobs
the team runs. On 2026-10-05 the owner asked: "Didn't we have a memory
solution that we took the Davis memory system and enhanced it? Why aren't
we just using that still and fine tuning it?"

So: memory on `origin/main` (version 0.8.16) comes back, changed only where
the one-home layout gives a fact another home, and with the fixes the
scenario test found.

## What comes back from `origin/main`

Old path under `plugins/toolkit/skills/project-setup/assets/` -> new path.

| On `origin/main` | On the branch |
| --- | --- |
| `.skill-sets/memory-process/managing-project-memory/` (SKILL.md, references `saving.md`, `finding.md`, `tidying.md`, `memory-criteria.md`, `current-state.md`) | `memory-process/.claude/skills/curating-project-memory/` |
| `.skill-sets/local-memory/storing-project-memory/` (SKILL.md, references `folders-and-files.md`, `record-format.md`, `searching.md`) | `memory-local/.claude/skills/using-memory-store/` |
| `.skill-sets/notion-memory/storing-project-memory/` | `memory-notion/.claude/skills/using-memory-store/` |
| `model/memory/` (`AGENTS.md`, `CURRENT_STATE.md`, `MEMORY.md` as the generated index, `project_topic_template.md`) | `memory-local/memory/` |
| `model/.claude/rules/memory-review-and-save.md` | `every-project/.claude/rules/memory-review-and-save.md` |
| `hooks/session-start.mjs` (it rebuilds the index `MEMORY.md` from the memory files) | `every-project/.claude/hooks/session-start.mjs` |
| The "Memory approval" line in `PROJECT.md` and its readers | the same, restored (removed on 2026-10-05 only because nothing read it after the cut) |

Start from the text on `origin/main`: it was reviewed and tested. Apply the
new skill names, the new folder paths, and the changes below. Keep the
split the owner decided on 2026-10-01: the process skill names no storage
tool; each storage skill holds storage only.

## What changes from `origin/main`

Three kinds of fact have another home in the one-home layout. Memory does
not hold them.

| Fact | Its one home | What memory holds |
| --- | --- | --- |
| A decision that more than one work item needs | `DECISIONS.md` (DEC-###) | Nothing, or a `reference_` note that points to it when a later session would otherwise miss it. No `decision_` records, no decision template. |
| A project term | `system/glossary.md` | Nothing. No glossary file in memory. |
| How the system must work, or how it works today | `system/` or `reference/current-system/` | Nothing, or a pointer. |

The kinds of memory record after the change:

| Kind | Holds | Never holds |
| --- | --- | --- |
| `user_` | A fact about the owner or another person that matters to the work: a role, who covers for whom, when someone is away. | A working preference or correction (that is a line in `.claude/rules/owner-preferences.md`); private details. |
| `project_` | A lasting fact about the project or the client that fits no other file; a claim someone made that is not checked yet, with who said it; a lesson not proven yet, with the dates it was seen. | A decision, a system rule, a term, a requirement, work item status, an instruction for the agent. |
| `reference_` | Where to find something that is hard to find again: a record, a system, a shared file such as a spreadsheet the client shares, with why to open it. | The content of that thing. |
| `event_` | Something that happened or a job that ran, one per record or one record per recurring job with a row per run: the date, what was done, the result, where the output is. | A routine edit, a tool call, a daily progress log. |

A record that is true only for a while carries a "check or remove by" date.
Every record carries the date it was created and the date it was last
changed (the owner, 2026-10-05).

## Fine-tuning, from the scenario test

Numbers are the causes in `MEMORY-SCENARIOS.md`.

1. **A fact that fits no file** (cause 1): the restored `user_` and
   `project_` records are its home. The root "Where information goes" table
   gets the rows back. The prompt reminder names them.
2. **Saved, but never shown again** (cause 2): the root row for "where are
   we" also lists the open project tasks and every dated item in Current
   State. A reminder with a date goes to "Coming up" in Current State.
3. **Search** (cause 3): one line in the root guide: a whole-project search
   skips `work-items/` and `memory/`; search them with `using-work-tracker`
   and `using-memory-store`. Restore the line "search memory before asking
   the owner to repeat something".
4. **Jobs and runs** (cause 4): a recurring job has one `event_` record with
   a row per run (date, who ran it, what ran, result, problems and fix). The
   deployment record form in `delivery/AGENTS.md` gains "Date and time" and
   "Manual steps".
5. **Current State** (cause 5, and the owner's own words on Davis: it "knows
   when to keep it up to date" but "doesn't know when to clean it up and
   remove old stuff"). Its sections become: Now (every active thread of
   work, a work item or not, one line each); Coming up (dated events and
   deadlines); Waiting on (the owner, the client, a vendor: who owes what);
   Standing jobs and shared files (a recurring job, a shared file that is
   kept up to date, each pointing to its `event_` or `reference_` record);
   Next session starts with (a work item's ID and "read its Current state",
   or a thread and its next step when it is no work item; never a copy of an
   item's next action). Clean-up: a line is removed when it stops being
   true, at each handoff, when a work item closes, when a date has passed,
   and when the start hook says the page is too long or too old. "Where are
   we" also reports unsaved work in the worktree of each item in progress.
6. **Lessons** (cause 6): a lesson about how to do a step (deploy, load,
   test) moves up at closing as a rule line, with the owner's yes; the
   deploying step reads the decisions and lessons about deploying first; a
   lesson with no work item open is a `project_` record; a lesson keeps the
   dates it was seen, and after it is seen in two sessions the agent offers
   it as a rule (as on `origin/main`).
7. **`PROJECT.md` in front of the session** (cause 7): the root `CLAUDE.md`
   imports `PROJECT.md` after `AGENTS.md`, or the root guide's first line
   does; test which loads in Claude Code, and keep the Codex line that says
   to read it at session start. The setup size check counts the root
   `AGENTS.md` only.
8. **Notion memory** (cause 8): the Notion storage skill stores the same
   kinds in Lore's layout, as on `origin/main`, without decision records and
   without the glossary page. The start hook cannot read Notion; the process
   skill says when memory is searched.
9. **Action items for other people**: a project task may belong to the
   owner, the agent, or a named other person (a client, a vendor), so the
   action items of a meeting can be listed with who owes each.

## Also in this pass

- The ten instructions that needed a guess in the sample build
  (`dev/test-runs/sample-project-build.md`).
- Three description fixes from the routing test
  (`dev/test-runs/skill-routing-0.9.0.md`): the lifecycle skill covers a
  question about whether an item is ready for its next step; the filing
  skill covers "update a system document" in plain words; the Notion tracker
  skill sends a new phase or task to the lifecycle skill.
- `update.md` and `one-home-layout.md`: an existing project keeps its
  memory records; only decision records and the glossary move
  (`DECISIONS.md`, `system/glossary.md`).

## Limits

- `session-start.mjs` was 76 lines on `origin/main` and is 54 now. It may
  return to about 76. It must stay one job, never break a session, and keep
  its output under what Codex shows (about 4,000 characters): the index is
  one line per record, and Current State keeps a line limit.
- `validate-records.mjs` does not change.
- No new hook command and no new skill.

## Test

The owner's own day on a client project, as live sessions in a scratch
project: he gives a meeting transcript and asks for the action items; asks
for a shared spreadsheet of open items to be updated from the meeting; has a
meeting on Wednesday with the client and a vendor to prepare for; asks for
an analysis of how some automation and rollup fields work. A new session the
next day is asked "where are we" and "what did we do yesterday" and must
know all four without being told. Then the 20 gap scenarios of
`MEMORY-SCENARIOS.md` again.
