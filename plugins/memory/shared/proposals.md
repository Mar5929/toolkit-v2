# Memory proposals

Purpose: what a memory proposal is, how one is saved, and how the owner's yes
or no is recorded.

## Contents

- What a proposal is
- How a proposal is saved
- Recording the owner's answer
- Examples

## What a proposal is

A proposal is a memory record the owner has not approved yet. It exists so
that a "Save to memory?" question he did not answer is kept, not lost.

- It is saved with `--proposal`: status `needs-review`, authorization
  "Proposed by the agent on <date>", and never an approver.
- It is not a fact. The agent does not rely on it, and an answer never
  presents it as true.
- `toolkit memory find` leaves it out unless `--proposals` (or `--all`) is
  given. `toolkit memory get` ends its text with a line saying it is a
  proposal.
- `toolkit work decisions` and the session briefing list it among the things
  waiting on the owner, and the `work-decide` skill asks him about it.
- The built-in index marks it "[proposal: not a fact until the owner
  answers]". In Notion its Status is "proposed".
- A proposal never replaces a record the owner approved. The CLI refuses a
  proposal whose key is already a current or retired record.

## How a proposal is saved

1. The agent asks the question in exactly this form, at the end of its reply:
   `Save to memory: <one-line summary>?`
2. When the turn ends, the Stop hook reads that question. If no proposal was
   saved in this turn, the hook saves one from the summary alone. It never
   saves the same summary twice in a session. The next turn's context says
   what happened, in one of three notes:
   - It saved the proposal, and names its key. His answer is recorded as in
     "Recording the owner's answer" below.
   - It saved nothing, because memory already has a record like it, and
     names that record. When he answers yes, update that record (read it
     with `--json`, save with `--expect <version>`); never save a second one.
   - The save failed. Save the proposal yourself in this turn, with the
     command in step 3, so it is kept until he answers.
3. The agent may save the proposal itself in the same turn instead, with a
   full body in the record format, so the record says exactly what was
   meant:

   ```text
   toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --proposal
   ```

`--proposal` cannot go with `--approved-by` or `--authorization`; the CLI
refuses the pair.

## Recording the owner's answer

- **Yes, to a proposal the Stop hook saved.** Its Evidence and limits line
  ends "so the toolkit's Stop hook saved it as a proposal". Its body has
  only four of the six labels, and its How to apply line says "Do not rely
  on this until the owner approves it." `approve` leaves the body as it is,
  so never use it here, even though the hook's note names
  `toolkit memory approve`. Always read it with `--json`, write the full body
  in the record format, and save the same type and slug:

  ```text
  toolkit memory get <key> --json
  toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version> --approved-by <owner>
  ```

  That one save approves it too.
- **Yes, to a proposal you saved with a full body that is right:**

  ```text
  toolkit memory approve <key> --by <owner>
  ```

  The record becomes `current`, "Approved by <owner> on <date>".
- **Yes, but the body needs work:** the same full-body save as for the Stop
  hook's proposal.
- **Yes, with a better name or type:** record his yes first, as above, then
  `toolkit memory rename <key> --to <new-key>`.
- **No:**

  ```text
  toolkit memory reject <key>
  ```

  The proposal is deleted (Notion: the Notion trash). A rejection stands:
  never propose the same fact again under other words, and never put it in
  the current focus, the glossary, or another record. When his no gives a
  general rule about what to save ("don't keep my travel plans"), save only
  that rule, as a `feedback` record.
- **No answer:** leave it. It stays a proposal until he answers, here or when
  `work-decide` asks.

## Examples

- The agent inferred that tests run before every commit. Reply ends with:
  "Save to memory: tests run before every commit?" The owner's next message
  is about something else. The Stop hook saved the proposal
  `project_tests_run_before_every_commit`, and it stays until `work-decide`
  asks.
- Later the owner says "yes, save that". The Stop hook saved it, so read it
  with `--json`, write the full body, and save it:

  ```text
  toolkit memory get project_tests_run_before_every_commit --json
  toolkit memory save --type project --name tests-run-before-every-commit --description 'Tests run before every commit' --body-file - --expect <version> --approved-by Mike <<'EOF'
  ```

  Then reply: "Saved to memory: tests run before every commit. Say 'forget
  that' to undo."
- The owner says "no, that was only for last week". Run
  `toolkit memory reject project_tests_run_before_every_commit` and reply in
  one line that it is not saved.
