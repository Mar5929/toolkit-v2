# Tidying memory

The goal is memory that stays small and true. Tidy when the owner asks, or when you see it's needed: two records on one subject, or a startup index that was cut short. If you start it yourself, pick a moment when the owner isn't waiting on you, such as after an item closes.

## How it runs

- A fresh helper reads every record and drafts the plan in the background (Claude Code: the Agent tool; Codex: `spawn_agent` with `fork_turns` none). Tell it to read this file and `memory-store.md`, change nothing, and return two lists: the changes that need no approval, and the plan. If you can't start a helper, do it yourself.
- Make the no-approval changes yourself: remove Current State lines that are no longer true, remove secrets, and retire or trim anything past its check-by date that's no longer true. Tell the owner.
- Show the plan as one numbered list: one change per line, the records it touches, and why. A delete is its own line. A contradiction is a question, never settled by date alone. Change nothing until the owner says yes.

## What the plan looks for

- **Duplicates.** Merge two records on one subject into the broader one, keeping every section, lesson date, work item, and run, and set the other to `superseded`. Never merge an event into another type. Split a record that covers separate subjects.
- **Broken links.** Work items that no longer exist (tell the owner), links to missing records, current guidance that links to a superseded record, and links to retired records, which get "(retired)".
- **Stale facts.** Past its check-by date: check it, then set a new date or retire it. A passed date doesn't prove an unchecked claim false.
- **Wrong place.** Work item status or requirements go to the work item. Shared decisions, terms, and system facts go to `filing-project-records`. Instructions go to `owner-preferences.md`. Guesses and facts the owner rejected get retired. A record of the wrong type moves, and its links get fixed. Records the owner edited by hand stay as they are; list them, and fix one only with a yes.
- **Too much.** If the startup index was cut short, propose merges and retiring events that nothing still needs.
- **Lessons ready to promote.** An always-followed check becomes a rule. A procedure becomes a project skill in `.claude/skills/<name>/`, plus a row in the skill table in `AGENTS.md`. A lesson about the system that several items must follow becomes a decision through `filing-project-records`. Put the exact wording on the plan, write it after the yes, and mark the lesson "Promoted: <date>, to <where>".
- **The owner's rules.** Flag bullets that repeat or contradict each other, `AGENTS.md`, or something a hook already enforces. Never remove one just because it's old.
