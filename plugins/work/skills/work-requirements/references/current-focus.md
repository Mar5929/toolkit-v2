<!-- Generated file. Source: plugins/memory/shared/current-focus.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# The current focus

Purpose: the format of the current focus, when to change it, and the exact
read-change-save sequence, in every memory backend.

## Contents

- What the focus is for
- The format
- What goes in each section
- When to check it
- Read, change, save
- A new project's focus
- Examples
- Checklist for a focus save

## What the focus is for

The current focus is the first thing the next session reads: the session
briefing includes it. It says what is happening now and where the next
session starts. It never repeats the tracker: a work item's status, tasks,
and history stay in the work item.

| Backend | Where the focus lives |
| --- | --- |
| Built-in | `.memory/CURRENT_FOCUS.md` in the main checkout |
| Hindsight | The document `focus` in the project's bank |
| Notion | The "Current focus" page under the project's page |

The same commands read and save it in every backend. Never edit the file or
the page by hand.

## The format

The model's format: a `# Current focus` title line, a `Last updated:` line,
then exactly four `##` sections in this order, under 50 lines in total.

```markdown
# Current focus

Last updated: <YYYY-MM-DD>, <source>, <person or agent>

## Now

## Waiting on the owner

## Untracked to-dos

## Next session starts with
```

What the command enforces:

- It refuses a focus that lacks one of the four sections, has another
  section, or is over 50 lines (exit code 2, nothing saved).
- It adds the title line or the `Last updated:` line when either is missing,
  and sets an older date to today. It cannot know the source or who wrote
  it, so write the line yourself.

## What goes in each section

- **Last updated:** the date, the source (for example `handoff`,
  `work-finish`, `chat`), and who wrote it (a person, or `agent`). Change it
  on every save.
- **Now:** the current outcome or area, with work item ids and titles only,
  for example `- WI-012 CSV export`. Never a status or a stage: the tracker
  holds those.
- **Waiting on the owner:** a decision or action only the owner can take
  that has no work item: what it is, who needs it, and when to check again.
  Work items that wait on him are listed by `toolkit work decisions`, not
  here. A setup step (trust the hooks in Codex, sign in to Notion with
  `ntn login`) stays only while `toolkit doctor` still reports it.
- **Untracked to-dos:** things the owner asked for that have no work item.
  When one becomes a work item, replace the line with the item's id under
  Now.
- **Next session starts with:** one entry: where to resume, what to read,
  and the next action. It is replaced at each handoff, not added to.
- Write "None." in a section with nothing in it.
- Keep it under 50 lines by replacing stale lines, never by appending. Never
  drop an owner to-do that is still open only to meet the limit.

## When to check it

Check the focus before the reply ends when:

- a work item's stage changes, or its next step changes to something the
  focus does not say. Check two things:
  1. Now lists the item (id and title). Add it when it is missing; take it
     off when the item is Done or Cancelled. For Done, take it off just
     before `toolkit work finish`, which backs up the focus as it is then.
  2. Next session starts with does not name a step that is done or no longer
     next. Replace that line with the item's real next step, in one line that
     points at the item, for example "Continue WI-012 from its Resume here:
     build P1."
- the owner asks for something with no work item (add it under Untracked
  to-dos), or a decision only he can make has no work item (Waiting on the
  owner).
- `toolkit doctor` no longer reports a setup step listed under Waiting on the
  owner (drop it).
- a session hands off (replace the one entry under Next session starts
  with).

Skip the save when nothing in the focus is wrong. Leave every line you are
not changing exactly as it is.

## Read, change, save

1. Read it with its version. The output has `text` and `version`:

   ```text
   toolkit memory focus --json
   ```

2. Change only the lines that need it, in the whole text, and update the
   `Last updated:` line.
3. Save the whole text with the version you read.
   Claude Code: `<file>` is `-`, with the text on standard input after a
   quoted heredoc (`<<'EOF'`), then a line holding only `EOF`.

   ```text
   toolkit memory focus --set-file <file> --expect <version>
   ```

   Codex: give the text in single quotes instead (newlines are kept), or
   use a file in a new `mktemp -d` folder and delete it after the save.
   Write an apostrophe as ’ (the curly apostrophe, U+2019), or reword the
   text. Never `'\''` in Codex: the project's command rule does not match
   that form, so the command runs inside the sandbox, and the tool call can
   drop the backslash.

   ```text
   toolkit memory focus --text '<text>' --expect <version>
   ```

4. Exit code 2 with "changed since it was read" means another session saved
   the focus after you read it. Read it again, make your change in the new
   text, and save with the new version. Never save without `--expect`: that
   would silently drop the other session's change.
5. No focus yet (`version` is null): save with `--expect absent`, in the full
   format above.
6. Read it back:

   ```text
   toolkit memory focus
   ```

## A new project's focus

A new project's focus still holds the model's setup text: a fill-in guide
comment under the title (`<!-- Fill-in guide: ... -->`) and an
`<angle-bracket>` prompt in every section. At the first save:

- remove the fill-in guide comment;
- replace each prompt with real content, or with "None." when there is none;
- never leave an angle-bracket prompt in a saved focus.

## Examples

A full focus:

```markdown
# Current focus

Last updated: 2026-09-26, handoff, agent

## Now

- WI-012 CSV export
- WI-015 Large exports (sub-item of WI-012)

## Waiting on the owner

- Pick a hosting provider before the first deploy (no work item yet); check again 2026-10-01.

## Untracked to-dos

- Email the client about the October demo.

## Next session starts with

- 2026-09-26 17:40 UTC | CSV export: continue WI-012 from its Resume here. Goal: exports finish under 10 seconds.
```

The handoff entry with a work item is a pointer only:
`<UTC date and time> | <topic>: continue <WI-id> from its Resume here. Goal: <one line>.`

With no work item, the entry is a short note: the goal or topic, where work
stopped, the first next action, limits on what may be done without the
owner, and open questions. Do not create a work item only to hold it.

## Checklist for a focus save

- [ ] Read with `--json`; you have the version.
- [ ] The `# Current focus` title and the `Last updated:` line (date,
      source, who) are there.
- [ ] Four sections, in order; "None." in each empty one.
- [ ] Work item ids and titles only; no status or stage.
- [ ] No angle-bracket prompt and no fill-in guide comment left.
- [ ] Under 50 lines; no open owner to-do dropped.
- [ ] Saved with `--expect`; read back.
