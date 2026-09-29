# Writing a project skill from a promoted lesson

How to fill the `SKILL.md` skeleton that `toolkit memory promote --to skill`
writes in `.claude/skills/<name>/`, after the owner said yes to the promotion.
A project skill is a procedure that proved itself: steps the agent follows the
same way every time. An instruction without steps is a rule, not a skill.

## Contents

1. What the command writes
2. The description
3. The body
4. Files the skill needs
5. Finishing

## 1. What the command writes

- Frontmatter with `name` (the folder name) and a `description` placeholder.
- A `#` title from the lesson's heading.
- A fill-in guide comment, a `## Steps` section with one placeholder step, and
  a `## Where this came from` section that names the lesson and its concept.

Keep the frontmatter to `name` and `description`. Keep "Where this came from".
Delete the fill-in guide comment when the skill is filled.

## 2. The description

The description is the only text Claude Code and Codex read when they decide
whether to open the skill. Write one line, in single quotes, in this order:

1. **What it does**: a third-person verb and the job, for example "Checks the
   invoice export against the bank's CSV format". Never "I", "you", or "This
   skill".
2. **Why**: a short clause with the outcome or the risk it prevents, starting
   with ", so", for example ", so the bank accepts every file the first time".
3. **When**: "Use when" with the situation and two to four phrases the owner
   actually says, in double quotes.
4. **Not for**: only when another skill could claim the same message, naming
   that skill ("Not for a one-off export; use work-on").

Rules:

- The job and the main trigger words sit in the first 120 characters. Codex
  shortens descriptions from the end when many skills are installed.
- Under 450 characters. Codex cuts any description at 1,024 characters.
- An apostrophe inside the single quotes is written twice (`''`).
- No `when_to_use` field, no exclamation mark in front of a command in
  backticks, no `$ARGUMENTS`, and no `CLAUDE_` variables in `${...}`: Codex
  shows them as plain text.
- No quoted phrase that another skill's description already uses.

Example:

```yaml
description: 'Checks an invoice export against the bank''s CSV format before it is sent, so the bank accepts every file the first time. Use when the owner says "send the invoices", "export for the bank", or a new invoice export is ready. Not for changing the export itself; use work-on.'
```

## 3. The body

- A one-line purpose under the title: what the skill does and what it never
  does.
- `## Steps`: numbered, one action each, in the order the lesson proved. Give
  each command exactly, on its own line. Say where to stop and ask the owner,
  with the one-line reason.
- `## Gotchas`: the facts from the lesson that break a reasonable guess, for
  example "The bank rejects a file with a trailing blank line".
- Keep `SKILL.md` under 500 lines. Move long detail into a reference file
  (section 4).
- Plain English: short sentences, real names, no figures of speech.

## 4. Files the skill needs

A skill reads only files inside its own folder.

- A template or example the steps fill goes in the skill's assets folder; a
  longer procedure or checklist goes in its references folder; a script that
  must run exactly goes in its scripts folder.
- `SKILL.md` links every one of these files directly, in a `## References`
  table with when to open it. A file only another reference links is never
  found.
- Never point a step at a file outside the skill folder, such as a path in
  `.memory/` or in another skill. Copy what the step needs into the folder,
  or name the project file the step reads (for example `DECISIONS.md`).

## 5. Finishing

1. Read the finished file back. Check that `name` equals the folder name and
   that the description follows section 2.
2. When the project also uses Codex, copy the whole folder to
   `.agents/skills/<name>/`, as the command's output says. Both copies stay
   the same.
3. Commit the skill folder by name, as the command's Commit line says.
4. Tell the owner in one line what the skill does and the words that start it.
