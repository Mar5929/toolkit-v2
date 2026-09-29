# Notion memory, in Lore's layout

Purpose: where Notion memory is stored, which parts must never change, and
how Notion memory behaves differently from built-in and Hindsight memory.

## Contents

- Where it lives
- How a record maps to a row
- Rules that keep Lore's layout working
- Sign-in and errors
- When the owner edits memory in Notion
- Retire, delete, and rename
- The session briefing
- Backup

## Where it lives

- Under the "AI Agent Second Brain" root page, the project's row in the
  Projects database has a page named "Memory". It holds the five databases
  of Lore, Notion's open-source AI memory: Projects, Topics, Memories,
  Entities, and Facts.
- Each memory record is one row of the Memories database: one row (page)
  per concept. The page body is the record's body (without its first
  `# Title` line, which Notion keeps in the Title column), with one heading
  per section.
- A section save (`--concept ... --section ...`) sends only that section to
  Notion; the rest of the page is not written again, so an edit the owner
  made in another section stays.
- The current focus is the "Current focus" page and the glossary is the
  "Terminology glossary" page, both under the project's page.
- There is no `.memory/` folder. The memory criteria come from the copy of
  `memory-criteria.md` that the `memory-save` and `memory-tidy` skills carry
  in their references folder.
- Only the `toolkit memory` commands write memory. They refuse any write
  outside the root page.

## How a record maps to a row

| Record field | Memories column |
| --- | --- |
| The key (`<type>_<slug>`) | Record Key (the toolkit finds a record by it), and Keywords |
| The body's `# Title` line | Title |
| `description` (the concept's one-line summary) | Synopsis |
| `updated` (the date of the last change) | Saved |
| `metadata.type` | Tags (`user`, `project`, `reference`, or `event`; an older record may say `feedback`) |
| `status` | Status: current = accepted, needs-review and proposals = proposed, superseded = superseded, archived = deprecated |
| `supersedes` | Supersedes (a link to the rows it replaced); Superseded by holds the replacement's key |
| `source`, `last_verified`, `authorization` | Source note, Last verified, Authorization |
| Any other frontmatter field | Other fields (JSON) |

Kind is always "note", Source is "manual", Author is the owner, and Agent is
Claude Code or Codex.

A link to another record (`[Billing](project_billing.md)`) is a link to that
record's page on the Notion page, so a click in the Notion app opens it: a
page mention when the link text is the page's title, else a Notion link with
the same text. A link to one section (`#Refund%20window`) stays a file link,
because Notion drops the section from a page link. `toolkit memory get` reads
every one back as the file link, so the text is the same as in built-in
memory. A rename keeps the page, so a page link follows it.

## Rules that keep Lore's layout working

- Never rename or remove a column, a database, or the "Memory" page. Lore's
  own tools find them by these exact names.
- The toolkit does not install or run Lore. Lore's own saving and hooks stay
  off, so every save still goes through the approval rules and
  `toolkit memory save`.
- A row with no Record Key (made by hand in Notion, or by Lore's tools) is
  not a toolkit record: list and find leave it out, and
  `toolkit memory status` names it. Tell the owner. He can give it a Record
  Key in Notion, or, with his yes, you save its content as a record with
  `toolkit memory save`.
- A project on the older layout (one "Memory" database on the project row)
  is moved to Lore's layout by the `project-setup` skill
  (`toolkit notion ensure-project`). The old database is then renamed "Old
  memory database (safe to delete)"; deleting it is the owner's choice.

## Sign-in and errors

- The toolkit reaches Notion through the Notion CLI, `ntn`. Signing in
  (`ntn login`) opens a browser, so it is always the owner's step.
- An expired sign-in, or Notion not answering: the command fails and nothing
  is saved. Lead the reply with "Not saved", keep the text, and tell the
  owner the fix the command printed (usually `ntn login`).
- In Codex, a sign-in error can come from the sandbox blocking the keychain.
  Run the `toolkit` command alone, on its own line, so the project's command
  rule runs it outside the sandbox.

## When the owner edits memory in Notion

- He may edit a record's page body or a column. The next read uses his
  version. His edit wins; never undo it.
- A save with `--expect` refuses when the record changed since you read it.
  Read it again and redo the change.
- A body save keeps his edit in a section your change does not touch. An
  edit in the same section is a conflict: nothing is saved. Read the record
  again, and ask him when the two changes disagree.
- A Status he changed by hand counts: "deprecated" reads as archived,
  "proposed" as needing review.

## Retire, delete, and rename

- Retire: Status becomes "superseded" or "deprecated"; search leaves it out.
- Delete, or reject a proposal: the page goes to the Notion trash. Notion
  deletes it for good after 30 days. Until then the owner can restore it
  from the trash; check it with `toolkit memory get <key>` afterwards.
- Rename: the same page gets the new Record Key.
- In each case the record also leaves the briefing cache at once.

## The session briefing

The briefing reads memory from a cache that every `toolkit memory` write
refreshes. When there is no cache yet, it tries one live read with a
2-second limit; a slow or unreachable Notion gives one line in the briefing,
and the session goes on.

## Backup

- Notion keeps the records, so the project needs no local copy to work.
  With the work items in Notion too, the project needs no backup folder:
  Notion keeps each page's history and keeps deleted pages in its trash
  (the owner's decision of 2026-09-28).
- `toolkit memory export --to <folder>` still makes a Markdown copy of every
  record, the focus, and the glossary; use it before switching backends or
  when the owner wants a copy, and before a memory tidy changes anything.
  The project export (`toolkit export`) and the automatic backups
  (`toolkit handoff-backup`, `toolkit work finish`) do not reach Notion.
