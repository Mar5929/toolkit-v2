---
name: memory-tidy
description: 'Reviews the project''s whole memory: merges duplicates, retires stale or contradicted records, trims the current focus, proposes proven lessons as rules or skills, and backs it up, so memory stays small and correct. Use when the owner says "clean up memory" or "tidy memory", thinks memory is wrong or out of date, a lesson keeps coming up ("turn that lesson into a skill"), or toolkit doctor flags memory.'
---

# Memory tidy

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Reviews all of memory, proposes one numbered list of changes, backs memory up, applies only what the owner approves, checks the result, and backs it up again. Memory keeps one record per concept, with one `##` section per fact (`references/record-format.md`), so a tidy also merges small one-fact records into concepts and splits a concept that grew too large. It moves older `feedback_` records out of memory (instructions to the rules, facts to concepts), and proposes lessons that proved themselves as rules or skills ("Promotion" below).

## Steps

Track these steps in the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

1. Check the setup and the backend, list the records in use, and get the concept plan. The plan changes nothing: it names one-fact records to merge into concepts (with each `merge` command and a draft summary), concepts that grew too large, `feedback_` records to move out (each part with its command), and lessons ready to promote.
   `toolkit doctor`
   `toolkit memory status`
   `toolkit memory list`
   `toolkit memory tidy --plan`
   `toolkit config get backup.dir`
2. Review each record, the focus, and the glossary against `references/review-checklist.md`. Read each record you judge with its version.
   `toolkit memory get <key> --json`
   `toolkit memory focus --json`
3. Show one numbered list of proposed changes, each with its keys and reason, and ask once for the whole list (example in `references/review-checklist.md`). The list also names the folder the step 4 backup goes to.
4. After his yes, and before any change, export memory to a new folder: `<backup.dir>/<project key>-before-tidy-<YYYY-MM-DD-HHMM>`, or `~/Backups/<project key>-before-tidy-<YYYY-MM-DD-HHMM>` when the backup folder is not set or is none. It works for every backend. Never the step 7 command here: it replaces today's backup folder, which may be the only copy of the state before the tidy.
   `toolkit memory export --to <new folder>`
5. Apply only what the owner approved ("Approval" below), each with its command from `references/replacing-and-retiring.md`. A merge or a split: its command from the plan or `references/review-checklist.md`, with `--approved-by <owner>`. A `feedback_` record: its commands from the plan, then retire it. A promotion: `toolkit memory promote` with `--approved-by <owner>` ("Promotion" below). The focus: `references/current-focus.md`. The glossary: `references/glossary.md`. A proposal: `references/proposals.md`.
6. Check. Fix each memory problem the output names, and check again until none is left. Report any you cannot fix without the owner.
   `toolkit memory status`
   `toolkit doctor`
7. Back up the result (`references/backup-and-restore.md`). With a backup folder set, this backs up every part except Notion memory:
   `toolkit handoff-backup`
   Notion memory: no automatic backup reaches it, so export it to a new folder:
   `toolkit memory export --to <new folder>`
8. Report each change by key, with the words he can say to undo it, and where the step 4 backup is. End with the one question still open, or the exact words that continue.

## Approval

- A tidy is a bulk change: every change on the list needs the owner's yes, in both approval modes.
- His yes covers only the numbered changes he approved, as shown. "Yes except 3" leaves 3 alone.
- His answer usually comes in the next turn. Codex does not keep a skill across turns, so open `memory-tidy` again before step 4 when he answers.
- A contradiction is a question for him. Never settle it by date alone.
- Propose a delete only for a secret, an email address, or a record he asked to delete; otherwise retire. His yes to a numbered delete is the approval; the host then asks him to confirm the command. Quote his words for each delete in the report. For a secret or an email address, tell him that older backups still hold it and that he removes those copies himself.
- A restore runs only when he asks for one, after a dry run and his yes (`references/backup-and-restore.md`).

## Promotion

A lesson under a concept's "Gotchas and lessons" section is know-how the agent has not proven. The plan lists one as a candidate when it came up in two or more sessions (two entries on its Seen line: two dates, or one date with two different sources), when a lesson like it is in another concept, or when the owner confirmed it. For each candidate:

1. Decide where it goes: an instruction followed every time is a rule; a procedure with steps is a skill.
2. Get the proposal. It changes nothing and prints the question for the owner:
   `toolkit memory promote <key> --section '<lesson heading>' --to rule`
3. Put it on the numbered list with that question. After his yes, in the turn he answers, run the same command with `--approved-by <owner>`. Without his answer that turn, the command refuses. A rule goes into `.claude/rules/owner-preferences.md` (`--rule-section` and `--text` change the area and the words; layout: `assets/owner-preferences.md`). A skill gets a `SKILL.md` skeleton in `.claude/skills/<name>/`: fill in its description and steps from the lesson as `references/writing-a-project-skill.md` says, then copy it to `.agents/skills/<name>/` when the project also uses Codex.
4. The lesson gets a Promoted line naming where it went, and stays as its history. Commit what the command's Commit line names: the first rule also changes the rules list in `AGENTS.md`, and that line says where two files may be committed. Commit the skill folder once it is filled.

## Gotchas

- A `feedback_` record is a type memory no longer uses. Move each part on its own: an instruction with `toolkit rule add`, a fact with `toolkit memory split` into a `user_` or `project_` concept (a record with no `##` sections: `merge` or `rename` the whole record; the plan prints which), then retire the record (a merge retires it already). Doctor warns until none is left. An older `feedback_` proposal is a rule proposal: his yes writes it to the rules (`references/proposals.md`).

- Retire before delete. A retired record can be restored; a deleted one cannot.
- A correction in place saves the same type and slug with `--expect <version>` from the `--json` read. Without it the save is refused.
- Small records that belong in one concept: the plan's `merge` command. Each record becomes a section of the concept and is retired as superseded by it; links to it point at its section, and it leaves the index. The concept keeps its own authorization line; a merged fact whose approval differs keeps it on its section's Evidence and limits line. A new concept needs `--description`: write a better summary than the plan's draft.
- A concept that grew too large: `split` moves the named sections into another concept, and links to them follow (`references/review-checklist.md`).
- `merge` and `split` refuse without `--approved-by <owner>`: his yes to the numbered list is that approval. Events are never merged: each episode stays its own record.
- A duplicate record kept under a new key uses `--supersedes <old-key>`, which retires the old record. Retiring a duplicate that is not saved again uses `--superseded-by <kept-key>`. An archive with nothing to replace it uses `--reason '<the tidy reason>'`.
- Exit code 2 saved nothing. Read the "Error:" line. Records listed: the duplicate check. "Changed since it was read": read it again and redo the change. Any other rule: fix the text as the message says (`references/replacing-and-retiring.md`, section 2).
- After a rename, supersede, retire, or delete, the CLI repairs links in other notes and names each note it changed. Check that report, and fix any note it could not repair.
- A restore by itself is not an undo: it leaves dated lines in the body and links in other notes as plain text (`references/replacing-and-retiring.md`, section 7).
- Never drop an open owner to-do from the focus only to meet the 50-line limit.
- Never edit `.memory/` files by hand, including `MEMORY.md`. The owner may edit notes in Obsidian; `references/memory-builtin.md` says what to do about each kind of edit.
- Run each `toolkit` command alone, on its own line, in both hosts. In Claude Code the body or focus text goes on standard input (`<file>` is `-`, with a quoted heredoc `<<'EOF'`); in Codex use `--body '<text>'` or `--text '<text>'`.
- One-line values go in single quotes. An apostrophe inside them: Claude Code writes `'\''`; Codex writes ’ (U+2019) or rewords, and never uses `'\''`.
- Ask the owner in the reply text, never through a question tool.

## References

| File | Open it when |
| --- | --- |
| `references/review-checklist.md` | Step 2 (what to look for), step 3 (the list), step 6 (the check loop), and the report |
| `references/replacing-and-retiring.md` | Step 5: the command for each change, exit code 2, how to undo each change, what each change also clears |
| `references/record-format.md` | Writing a merged or corrected record's description and body |
| `assets/project_topic_template.md` | Step 5: the layout a merged or split concept must keep (frontmatter, one `##` section per fact, the last "Gotchas and lessons" section) |
| `assets/owner-preferences.md` | Promotion to a rule, and moving a `feedback_` instruction to the rules: the layout of the rule file |
| `references/writing-a-project-skill.md` | Promotion to a skill: filling the `SKILL.md` skeleton (the description, the steps, the files it needs) |
| `references/current-focus.md` | Trimming or correcting the current focus |
| `references/glossary.md` | Correcting the glossary |
| `references/proposals.md` | A proposal on the list: his yes or no |
| `references/memory-criteria.md` | Judging what belongs in memory, with Hindsight or Notion memory (built-in projects read `.memory/memory-criteria.md`) |
| `references/memory-builtin.md` | Built-in memory: the index, links, archive, and notes the owner edited in Obsidian |
| `references/memory-hindsight.md` | Hindsight memory: the server, the bank, and its backup |
| `references/memory-notion.md` | Notion memory: Lore's layout, rows without a Record Key, sign-in |
| `references/backup-and-restore.md` | Step 4 and step 7, any restore, or a new computer |
| `references/toolkit-commands.md` | A `toolkit` command fails, is refused by a hook, or you are unsure how to pass text in this host |
