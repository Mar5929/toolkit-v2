# Updating, replacing, retiring, and deleting memory records

Purpose: which command changes an existing memory record, what to do when a
save exits with code 2, how to undo each change, and what each change also
clears.

## Contents

1. Choose the change
2. Exit code 2: nothing was saved
3. Update a record in place (and one section of a concept)
4. Replace a record under a new key
5. Retire a record
6. Rename a record
7. Restore a retired record
8. Delete a record
9. What each change also clears
10. Examples

## 1. Choose the change

| Situation | Command | Undo |
| --- | --- | --- |
| A new fact about a concept memory already has | `toolkit memory save --concept <key> --section '<heading>'` (the `memory-save` skill) | Remove that section: the command prints it (section 3) |
| One fact of a concept, corrected | `toolkit memory save --concept <key> --section '<heading>' --expect <version>` (section 3) | Save the old section text (`previous` in the `--json` output) with `--expect` |
| "Forget that" about one fact of a concept | `toolkit memory save --concept <key> --section '<heading>' --remove --expect <version>` (section 3) | Save the old section text again as that section |
| Small records that belong in one concept | `toolkit memory merge <key> ... --into <concept> --approved-by <owner>` (the `memory-tidy` skill) | Restore each record (section 7) and remove its section from the concept |
| The same fact, corrected or better worded | Save the same type and slug with `--expect <version>` (section 3) | Save the old text from the `--json` read (section 3) |
| A newer fact replaces an older record, under a new name | Save the new record with `--supersedes <old-key>` (section 4) | Restore the old record (section 7), then retire the new one |
| Two records say the same thing | Update the one you keep; retire the other with `--superseded-by <kept-key>` | Restore it (section 7) |
| "Forget that", or no longer true and nothing replaces it | `toolkit memory retire <key> --reason '<why>'` (archives it) | Restore it (section 7) |
| A better name, or a type prefix that does not match the content | `toolkit memory rename <key> --to <new-key>` | Rename it back |
| The owner says "delete" | `toolkit memory delete <key> --owner-approved` (section 8) | None (Notion: the trash, for 30 days) |
| A proposal the owner answered | Approve it, save the full body, or reject it (`proposals.md`) | Save again, or none |

Retire before delete. A retired record can be restored; a deleted one
cannot.

"Forget that" right after a new record's save means retire that record,
with no question. Right after an update it is not clear: he may want the old
wording back, or the whole fact gone. The update's reply offers "undo that"
for the old wording; if he says "forget that" instead, ask once: "Put back
the old wording, or retire the whole record?"

## 2. Exit code 2: nothing was saved

`toolkit memory save` exits with code 2 for several reasons, and saves
nothing in every case. Read the "Error:" line, then:

| The Error line says | What to do |
| --- | --- |
| "... was not saved: memory already has a record like it", then a list of records | The duplicate check, below |
| "... was not saved: memory already has a record about the same subject. Check whether it is the same fact." | The duplicate check, below. Only the subject matches, so it is often a different fact (step 4); never overwrite that record with this fact |
| "... was not saved: it belongs in the concept <key>" | Read that concept. The fact belongs there: add it as a section with the command the "Fix:" line prints (`--concept <key> --section '<heading>'`, the same text and approval). It is a different concept: save it again with `--new-concept` |
| "... already has a section "<heading>", so it was not changed" | To replace that section, read the concept with `--json` and save again with `--expect <version>`; to add under it, add `--append`; to keep both, give a new heading |
| "... already holds this fact under "<heading>"" | That section already says it. Keep it, or change that section with `--section '<heading>' --expect <version>` |
| "... changed since it was read" | Another session or the owner changed it. Read it again with `--json`, redo the change on the new text, and save with the new version |
| "... looks like it holds <a secret>" | Save only where the secret is kept (for example "The staging key is in 1Password under Staging"), never the secret |
| "... is already a current record, so it was not saved as a proposal" | A proposal never replaces a record the owner approved. Ask him about the change in the conversation |
| "... --proposal cannot go with --approved-by" | His yes: use `--approved-by` alone. No answer yet: use `--proposal` alone |
| Any other rule (a description over 150 characters, a name over 60, a missing field) | Fix the text as the message and its "Fix:" line say, and save again |

### The duplicate check

The save refuses when memory already has a record with the same key, or one
with a very similar description or text. It lists each one with its key and
the reason ("the same key", or what is similar). Then:

1. Read each listed record, with its version:

   ```text
   toolkit memory get <key> --json
   ```

2. It is the same fact: update that record in place (section 3), or, when
   it already says everything, save nothing and tell the owner it is
   already in memory. When the listed record has the same key, the command's
   own "Fix:" line already gives its version.
3. The new fact replaces it: save the new record with `--supersedes <key>`
   (section 4).
4. It is a different fact: write down in one line why it differs, then save
   again with `--allow-similar`. Never add `--allow-similar` without reading
   every listed record.
5. A listed record is a proposal the owner has not answered: do not save a
   second copy. Ask him about the proposal (`proposals.md`).

The check compares wording, not meaning. "Deploys only on Tuesdays" next to
"Deploys happen on Mondays after 6 pm" is not caught, and would be saved as a
second record that contradicts the first. The search before every save
(`toolkit memory find '<topic>'`) is what finds that record.

## 3. Update a record in place

Read the record with `--json`: its `version` field is the version, and its
text is the old wording. Keep that read until the owner has seen the change;
it is the undo. Save the same type and slug again with `--expect <version>`.
The first 12 characters of the version are enough. Give the whole new body;
fields you do not give again (source, authorization, supersedes, last
verified, extra fields) are kept.

- The owner's words or his yes covered this change:

  ```text
  toolkit memory get <key> --json
  toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version> --approved-by <owner>
  ```

- A routine update in `trusted` mode that no words of his cover. The stored
  authorization is kept:

  ```text
  toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version>
  ```

- `--approved-by` is only for a change his words or his yes covered. It
  writes "Approved by <owner> on <date>" into the record.
- To record that you checked the fact today, add
  `--last-verified <YYYY-MM-DD>`. Without it the old date is kept. A record
  that needs review gets today's date when it is saved.
- `--expect` refuses the save (exit code 2) when the record changed since
  you read it. Read it again and redo the change on the new text.
- `--expect absent` saves only when the key does not exist yet. It is a new
  record, so after a remark he made in passing an `--approved-by` save with
  it is stored as a proposal, like any new record or section.
- Without `--expect`, a save of an existing key is refused by the duplicate
  check.
- The text form of `toolkit memory get` shows no version; use `--json`.

**Undo right after an update** ("undo that"): save the old description and
body from the `--json` read, with `--expect <version>`, where the version is
the one the update printed. Reply: "Put back the old wording: <title>."

**One section of a concept.** Most changes touch one fact, which is one
section. The rest of the record is not changed:

- Add a section (no `--expect` needed; a heading the concept already has is
  refused):

  ```text
  toolkit memory save --concept <key> --section '<heading>' --body-file <file> --approved-by <owner>
  ```

- Replace the text of one section, after reading the concept with `--json`:

  ```text
  toolkit memory save --concept <key> --section '<heading>' --body-file <file> --expect <version> --approved-by <owner>
  ```

- Add a fact under a heading the concept already has: add `--append`.
- Take one section out ("forget that" about one fact), after a `--json` read:

  ```text
  toolkit memory save --concept <key> --section '<heading>' --remove --expect <version> --approved-by <owner>
  ```

- Change the concept's summary with the same save: add `--description '<new summary>'`.

The output's "Undo:" line gives the command that takes the change back
(`--remove` right after an add), and the `--json` output holds the old section
text as `previous`. Reply for a removed section: "Removed from memory:
<heading> (in <concept title>). Say 'undo that' to put it back."

## 4. Replace a record under a new key

Save the new record with `--supersedes <old-key>`. The command saves it, then
retires the old one as superseded: the old body gets a first line that names
the new record, the index marks it "[superseded]", and links to it now point
at the new record. Leave out `--approved-by` for a routine replacement in
`trusted` mode, as in section 3.

```text
toolkit memory save --type <type> --name <new-slug> --description '<one line>' --body-file <file> --supersedes <old-key> --approved-by <owner>
```

When the save works but the old record could not be retired, the command
says so. Retire it yourself with `--superseded-by <new-key>`.

**Undo right after a supersede:** restore the old record (section 7, which
also moves its links back), then `toolkit memory retire <new-key>` with the
reason.

## 5. Retire a record

- Superseded (something replaced it). The replacement must exist and must not
  be archived:

  ```text
  toolkit memory retire <key> --superseded-by <new-key>
  ```

- Archived (nothing replaced it). In built-in memory the file moves to
  `.memory/archive/` and leaves the index:

  ```text
  toolkit memory retire <key> --reason '<his words, or the reason>'
  ```

`--reason` goes into the dated line the record gets ("**Archived <date>:**
<reason>"). Without it the line says "No reason was given."

A retired record is left out of `toolkit memory find`. To search retired
records and proposals too, add `--all`:

```text
toolkit memory find '<query>' --all
```

## 6. Rename a record

```text
toolkit memory rename <key> --to <new-key>
```

The new key sets the new type and slug. The content stays. Links to it and
`supersedes` entries that name it are repaired, and the command names each
record it changed ("No other note linked to it." when none did).

## 7. Restore a retired record

"Bring it back" is this whole sequence, not the `restore` command alone. A
restore by itself leaves the record at `needs-review`, keeps dated lines in
its body, and leaves the links in other notes as plain text.
`toolkit memory status` reports none of these.

1. Restore it. It comes back with the status `needs-review`:

   ```text
   toolkit memory restore <key>
   ```

2. Read it with `--json`. Its body now has dated lines under the title, for
   example `**Restored <date>:** check that this is still true.` and
   `**Archived <date>:** <reason>` (or `**Superseded <date>:** ...`).
3. Check that the fact is still true. Save it again with
   `--expect <version>` and without those dated lines, so it is `current`
   again. Add `--approved-by <owner>` when he asked for it back. Its
   `last_verified` becomes today.
4. Put its links back. An archive turned every link to it in other notes
   into plain text: the link's words followed by "(archived)". A supersede
   pointed them at the replacement. Find the notes:

   ```text
   toolkit memory find '<title> archived'
   ```

   Read each hit with `--json`. In each note that shows "<words> (archived)"
   for this record (or, after a supersede you are undoing, a link to the
   replacement), write the link again as `[<words>](<key>.md)` and save that
   note with `--expect <version>`. Check the current focus and the glossary
   the same way (`toolkit memory focus --json`,
   `toolkit memory glossary --json`).

## 8. Delete a record

A delete cannot be undone (Notion: the page goes to the Notion trash, which
Notion empties after 30 days). The command refuses without
`--owner-approved`.

The approval is his own words about this record ("delete the note about my
old address", "remove it for good"), or his yes to a numbered list that
shows this delete. Nothing else counts. "Forget that" is a retire, not a
delete. When the approval is there, do not ask a second question: the host
asks him to confirm `toolkit memory delete` (Claude Code's ask rule, Codex's
prompt rule), and that prompt is the confirmation.

Checklist:

- [ ] His words, or his yes to a numbered delete, cover this record.
- [ ] You read the record and it is the one he means.
- [ ] Run the delete, alone. In Codex, run it with `sandbox_permissions`
      set to `require_escalated` and a one-line reason; the approval alone
      keeps it inside the sandbox, where it cannot reach Hindsight or Notion:

      ```text
      toolkit memory delete <key> --owner-approved
      ```

- [ ] The host refused the delete without asking him (Codex with approvals
      off: "AskForApproval is set to Never"): say that this approval
      setting is the cause, show him the exact command to run in a terminal,
      and wait. Do not retire the record in its place unless he asks.
- [ ] Read the report: the records whose links were repaired.
- [ ] Reply with his words quoted, in the reply line of `memory-save`
      ("Deleted from memory, as you said: '<his words>'. This cannot be
      undone."), and end with the next step. For a secret or an email address, also
      say that older backups still hold it (the day folders in the backup
      folder, and every memory export made before the delete) and that he
      removes those copies himself. With Notion memory, add that the page
      stays in the Notion trash for 30 days unless he empties it.

## 9. What each change also clears

"Clean deletes": a record that is deleted, rejected, retired, renamed, or
superseded leaves the session briefing at once, even if the rest of the
refresh fails.

| Change | Built-in index (`MEMORY.md`) | Briefing cache (Hindsight, Notion) | Hindsight bank | Notion | Links to it in other records |
| --- | --- | --- | --- | --- | --- |
| Supersede (`--supersedes`, or `retire --superseded-by`) | Line stays, marked "[superseded]" | Removed | Tagged retired, so search leaves it out | Status "superseded" | Point at the new record |
| Archive (`retire` alone) | Line removed; file to `archive/` | Removed | Tagged retired | Status "deprecated" | The link text plus "(archived)" |
| Rename | Line under the new key | Old key removed | New document; old one deleted | Same page, new Record Key | Point at the new key |
| Delete | Line and file removed | Removed | Document deleted | Page to the Notion trash | The link text only |
| Reject a proposal | Line and file removed | Removed | Document deleted | Page to the Notion trash | The link text only |
| Merge into a concept (`merge`) | Line removed: the concept's line covers its facts | Removed | Tagged retired | Status "superseded" | Point at the concept's section |

The briefing cache is `<git common dir>/toolkit-v2/memory-cache.json`,
shared by every worktree. Built-in memory has no cache: the briefing reads
`.memory/` directly.

## 10. Examples

- The owner: "Actually the deploy window is Tuesday, not Monday."
  `project_deploy_window` exists. Read it with `--json`, change the Remember
  line, save the same type and slug with `--expect <version>` and
  `--approved-by <owner>`. Reply: "Updated in memory: deploy window is
  Tuesday. Say 'undo that' to put back the old wording."
- The owner: "Forget what I said about the Friday demos." Retire
  `project_friday_demos` with `--reason 'The owner: forget what I said about the Friday demos.'`.
  Reply: "Retired from memory: Friday demos. Say 'bring it back' to restore it."
- The same, when it is one section ("Friday demos") of `project_release`: read
  `project_release` with `--json`, then
  `toolkit memory save --concept project_release --section 'Friday demos' --remove --expect <version> --approved-by <owner>`.
  Reply: "Removed from memory: Friday demos (in Release). Say 'undo that' to put it back."
- An instruction he takes back ("forget that rule about tables") is a rule,
  not memory: `toolkit rule list`, then `toolkit rule update --section '<area>' --entry <n> --remove`.
- A tidy finds `reference_stripe_dashboard` and `reference_billing_dashboard`
  saying the same thing. Keep the clearer one, update it with anything the
  other adds, then:

  ```text
  toolkit memory retire reference_stripe_dashboard --superseded-by reference_billing_dashboard
  ```

- The owner: "Delete the note about my old address." That is his approval.
  Run the delete with `--owner-approved`; the host asks him to confirm it.
  Reply with his words quoted.
