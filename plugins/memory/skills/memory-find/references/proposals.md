<!-- Generated file. Source: plugins/memory/shared/proposals.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Memory proposals

Purpose: what a memory proposal is, how one is saved, and how the owner's yes
or no is recorded.

## Contents

- What a proposal is
- How a proposal is saved
- Rule proposals
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
  answers]", or "[proposal for <concept>: ...]" when it names a concept. In
  Notion its Status is "proposed".
- A proposal never replaces a record the owner approved. The CLI refuses a
  proposal whose key is already a current or retired record.
- Concept memory: a proposal for a fact that belongs in an existing concept
  is its own record that names that concept and a section heading (its
  `concept` and `section` fields; the list shows "[proposal for <concept>:
  the owner has not answered]", and `toolkit work decisions` says "A yes adds
  it to the concept <concept>"). The concept itself does not change until his
  yes. A proposal for a new concept names none: its key is made from the
  fact's words (`project_tests_run_before_every_commit`), so on his yes you
  name the concept it goes in with `approve --concept` (below).

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
   - It saved the proposal, and names its key. When the question's words
     match an existing concept of the same type, the note also says "for the
     concept <key>": his yes adds the fact there as a section. His answer is
     recorded as in "Recording the owner's answer" below.
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
   meant. For a fact that belongs in an existing concept (the usual case),
   name the concept and the section; the text is that section's labels:

   ```text
   toolkit memory save --concept <key> --section '<heading>' --description '<the fact in one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --proposal
   ```

   For a fact that starts a new concept:

   ```text
   toolkit memory save --type <type> --name <slug> --description '<one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --proposal
   ```

`--proposal` cannot go with `--approved-by` or `--authorization`; the CLI
refuses the pair.

When a save with `--approved-by` runs in a turn whose message from the owner
held no keep phrase, no other words asking for a save, and no answer to a
memory question (the hooks record this), the CLI saves a new record or
section as a proposal instead and says so ("Saved as a proposal, not as
approved"). Then ask him, as below.

A proposal the Stop hook saved says what it came from on its Evidence and
limits line: the question as asked, and, when the owner's message that turn
stated the fact, his words ("On <date> the owner wrote "..."").

## Rule proposals

An instruction for how the agent works is a rule, not memory (the owner's
decision of 2026-09-29). When the agent inferred one, it asks "Add to the
project rules: <one line>?". An unanswered one, and a "Save to memory:
<one line>?" question whose line is such an instruction (a preference about
how work is done, a correction, a sentence that starts with a verb to the
agent), is kept as a rule proposal: a proposal typed `user` whose
`rule_section` field names the section of `.claude/rules/owner-preferences.md`
it would join. The list shows "[rule proposal for .claude/rules/owner-preferences.md,
section "<area>": the owner has not answered]".

- Saving one yourself:

  ```text
  toolkit memory save --type user --name rule-<slug> --description '<the instruction in one line>' --body-file <file> --source '<person or document>, <YYYY-MM-DD>' --rule-section '<area>' --proposal
  ```

- His yes writes the rule and removes the proposal. The instruction is the
  proposal's Remember line; `--text` gives better words, and `--section`
  another area:

  ```text
  toolkit memory approve <key> --by <owner>
  ```

- His no: `toolkit memory reject <key>`, as for any proposal.
- An older `feedback_` proposal is a rule proposal too: his yes writes it to
  the rules, in the section `--section` names (General when none).

## Recording the owner's answer

When you ask him about a proposal, recommend a yes only with evidence from
this project: what he said, what happened, and when. With none, ask without
a recommendation ("I have no evidence either way."). This is the one
exception to "every decision carries a recommendation" in `work-decide`.

Ask about a saved proposal as "Save to memory: <one line>?" and say it to
him: "you publish releases to npm yourself", not "Mike Rihm publishes ...".
The record keeps his name; the question speaks to him.

- **Yes, to a proposal that names a concept** (the list shows "[proposal
  for <concept> ...]"):

  ```text
  toolkit memory approve <key> --by <owner>
  ```

  Its fact is added to that concept, under its section heading (or under
  that heading's existing section), and the proposal record is removed; the
  output names the concept and the section.
- **Yes, to a proposal that names no concept** (a new concept, or one whose
  concept is gone): name the concept its fact goes in with `--concept`. Run
  `toolkit memory list --type <type>` first. Name an existing concept of the
  same type when the fact belongs there, or a new key named for the subject,
  never for the fact (`project_testing`, not
  `project_tests_run_before_every_commit`). A new concept also takes its
  title and its one-line summary:

  ```text
  toolkit memory approve <key> --by <owner> --concept <type>_<subject> --title '<Concept title>' --description '<one-line summary of the concept>'
  ```

  The fact becomes a `## ` section of that concept, under the proposal's
  title, and the proposal record is removed. When the proposal's own key
  already names its subject, give that key to `--concept`: it is approved
  where it is. Without `--concept`, `approve` refuses such a proposal and
  lists the concepts of that type.

  Either way the concept keeps its own authorization line. When his approval
  differs from it, the section records it on its Evidence and limits line. A
  proposal the Stop hook saved ends its Evidence and limits line "so the
  toolkit's Stop hook saved it as a proposal". For that one, `approve` also
  takes the words "Do not rely on this until the owner approves it." out of
  How to apply and adds who approved it and when to the Evidence line.
- **Yes, with a reason or a detail, or the body needs work:** approve it
  first, as above, then change its section in the concept with his words
  (read the concept with `--json` for the version):

  ```text
  toolkit memory approve <key> --by <owner> [--concept <type>_<subject> ...]
  toolkit memory get <concept> --json
  toolkit memory save --concept <concept> --section '<heading>' --body-file <file> --expect <version> --approved-by <owner>
  ```

  Saving a one-fact proposal again under its own key with `--approved-by` is
  refused; a full body with `## ` sections approves it in that one save.
- **Yes, with a better name or type:** record his yes with `--concept`
  naming the better key, as above. To change a type, rename after the yes:
  `toolkit memory rename <key> --to <new-key>`.
- **No:**

  ```text
  toolkit memory reject <key>
  ```

  The proposal is deleted (Notion: the Notion trash). A rejection stands:
  never propose the same fact again under other words, and never put it in
  the current focus, the glossary, or another record. When his no gives a
  general rule about what to save ("don't keep my travel plans"), write only
  that rule, with `toolkit rule add`.
- **No answer:** leave it. It stays a proposal until he answers, here or when
  `work-decide` asks.

## Examples

- The agent inferred that tests run before every commit. Reply ends with:
  "Save to memory: tests run before every commit?" The owner's next message
  is about something else. The Stop hook saved the proposal
  `project_tests_run_before_every_commit`, and it stays until `work-decide`
  asks.
- Later the owner says "yes, save that". The list of project concepts
  (`toolkit memory list --type project`) has none about testing, so the fact
  starts one, named for its subject:

  ```text
  toolkit memory approve project_tests_run_before_every_commit --by Mike --concept project_testing --title 'Testing' --description 'How and when tests run'
  ```

  Then reply with the line the output gives: "Saved to memory: tests run
  before every commit (in Testing). Say 'forget that' to undo." When
  `project_testing` exists already, the same command without `--title` and
  `--description` adds the fact to it as a section.
- He says "yes, because CI is slow": record his yes, then put his reason in
  the section under **Why**:

  ```text
  toolkit memory approve project_tests_run_before_every_commit --by Mike --concept project_testing --title 'Testing' --description 'How and when tests run'
  toolkit memory get project_testing --json
  toolkit memory save --concept project_testing --section 'tests run before every commit' --body-file - --expect <version> --approved-by Mike <<'EOF'
  ```
- The owner says "no, that was only for last week". Run
  `toolkit memory reject project_tests_run_before_every_commit` and reply in
  one line that it is not saved, then the next step.
