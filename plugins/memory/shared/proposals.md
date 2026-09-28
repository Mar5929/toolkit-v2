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
   `Save to memory: <one-line summary>?` (bold is fine). Other wording, such
   as "Save it to memory?", has no one-line summary to save: the Stop hook
   then stops the turn once and asks for this form.
2. When the turn ends, the Stop hook reads that question. If no proposal was
   saved in this turn, the hook saves one from the summary alone. It never
   saves the same summary twice in a session. A record that is only about the
   same subject does not stop it. The next turn's context says what
   happened, in one of five notes:
   - It saved the proposal, and names its key. His answer is recorded as in
     "Recording the owner's answer" below.
   - It saved nothing, because memory already holds a proposal like it, and
     names that proposal. His answer approves or rejects that proposal.
   - It saved nothing, because memory already holds a record about the same
     subject, and names it. Read it with `toolkit memory get <key>`. The same
     fact in other words: keep it, or update it with `--expect <version>`. A
     different fact: after his yes, save it with `--allow-similar` and
     `--approved-by`. Never overwrite a record with a different fact.
   - It saved nothing, because the text looks like a secret. Never save it.
     After his yes, save only where the secret is kept ("The staging key is in
     1Password under Staging").
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

- **Yes, to a proposal as it stands** (one the Stop hook saved, or one you
  saved with a full body that is right):

  ```text
  toolkit memory approve <key> --by <owner>
  ```

  The record becomes `current`, "Approved by <owner> on <date>". A proposal
  the Stop hook saved ends its Evidence and limits line "so the toolkit's
  Stop hook saved it as a proposal". For that one, `approve` also takes the
  words "Do not rely on this until the owner approves it." out of How to
  apply and adds who approved it and when to the Evidence line.
- **Yes, with a reason or a detail, or the body needs work:** read it with
  `--json`, write the full body in the record format, and save the same type
  and slug. That one save approves it too:

  ```text
  toolkit memory get <key> --json
  toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --expect <version> --approved-by <owner>
  ```
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
- Later the owner says "yes, save that":

  ```text
  toolkit memory approve project_tests_run_before_every_commit --by Mike
  ```

  Then reply: "Saved to memory: tests run before every commit. Say 'forget
  that' to undo."
- He says "yes, because CI is slow": his reason goes in the body, so read it
  with `--json`, write the full body with that reason under **Why**, and save
  it:

  ```text
  toolkit memory get project_tests_run_before_every_commit --json
  toolkit memory save --type project --name tests-run-before-every-commit --description 'Tests run before every commit' --body-file - --expect <version> --approved-by Mike <<'EOF'
  ```
- The owner says "no, that was only for last week". Run
  `toolkit memory reject project_tests_run_before_every_commit` and reply in
  one line that it is not saved, then the next step.
