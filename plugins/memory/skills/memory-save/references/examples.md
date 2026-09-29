# Worked examples for memory-save

Purpose: complete examples of the common cases, each with the owner's words,
the commands in order, and the one-line reply. Commands are shown in the
Claude Code form (`--body-file -` with the body on standard input); in Codex
use `--body '<text>'` instead, with any apostrophe written ’ (U+2019).

## Contents

1. A correction from the owner, into an existing concept
2. A fact the agent inferred, in onboarding mode
3. A question the owner did not answer
4. "Forget that"
5. A correction that contradicts a saved section
6. The duplicate check stops a save
7. Things that are not memory
8. A preference a setting can enforce
9. The first fact of a new concept
10. The check names the concept a fact belongs in

## 1. A correction from the owner, into an existing concept

The owner: "Stop force-pushing. Never do that again."

His words are the approval. Find the concept it belongs in:

```text
toolkit memory list --type feedback
toolkit memory find 'force push'
```

The list shows `feedback_ways_of_working` ("Ways of working — How the owner
wants the agent to work: questions, replies, Git habits"). Nothing mentions
force-pushing yet. Read the concept whole, then add the fact as a section:

```text
toolkit memory get feedback_ways_of_working
toolkit memory save --concept feedback_ways_of_working --section 'Force-push' --body-file - --source 'The owner, in chat, 2026-09-28' --approved-by Mike <<'EOF'
```

The section text on standard input (labels only: the command writes the
`## Force-push` heading), then a line holding only `EOF`:

```markdown
**Remember:** Never force-push to any branch in this repository.

**Why:** Not stated by the owner.

**How to apply:** Use a merge or a new commit. If a push is rejected, pull first.

**Evidence and limits:** The owner, in chat, 2026-09-28. Applies to every branch.

**Related memories:** None.

**Authoritative records:** None.
```

The rest of `feedback_ways_of_working.md` is not changed. Read it back and
check:

```text
toolkit memory get feedback_ways_of_working
toolkit doctor
```

Reply (the line the command printed): "Saved to memory: Force-push (in Ways
of working). Say 'forget that' to undo."

## 2. A fact the agent inferred, in onboarding mode

While working, the agent sees that every test run uses `npm run test:ci`.
Nobody said to remember it, and `toolkit config get memory.approval` prints
`onboarding`. The reply ends with the question, in exactly this form:

"Save to memory: tests run with npm run test:ci?"

The owner answers "yes". If the next turn's context names a proposal the
Stop hook saved for that question, use the key the context names. For this
question the hook names `project_proposal_tests_run_npm_test_ci`, for the
concept `project_testing`. His plain yes adds it there:

```text
toolkit memory approve project_proposal_tests_run_npm_test_ci --by Mike
```

To add his detail too, change that section afterwards with `--expect`
(`references/proposals.md`, "Recording the owner's answer").

With no proposal saved, add the section yourself with `--approved-by Mike`
and `--source 'The owner, in chat, 2026-09-28'`:

```text
toolkit memory save --concept project_testing --section 'Test command' --body-file - --source 'The owner, in chat, 2026-09-28' --approved-by Mike <<'EOF'
```

Reply: "Saved to memory: tests run with npm run test:ci. Say 'forget that'
to undo."

## 3. A question the owner did not answer

The reply ended with "Save to memory: staging resets every Sunday?" The
owner's next message is about something else. The proposal stays as it is:
it is not a fact, search leaves it out, and `work-decide` asks him later.
Do not ask the same question again in this session.

When no proposal was saved for it (the next turn's context names none), save
one yourself, for the concept it belongs in:

```text
toolkit memory save --concept project_environments --section 'Staging resets' --description 'Staging resets every Sunday' --body-file - --source 'Agent observation in a session, 2026-09-28' --proposal <<'EOF'
```

If you mention it in the reply: "Saved as a proposal for your yes or no:
staging resets every Sunday."

## 4. "Forget that"

Right after the section save in example 1, the owner says "forget that".
Run the "Undo:" command that save printed, with no question. It takes that
section out and leaves the rest of the concept:

```text
toolkit memory save --concept feedback_ways_of_working --section 'Force-push' --remove --expect 3f9c2a1b7d4e
```

Reply: "Removed from memory: Force-push (in Ways of working). Say 'undo that'
to put it back."

"Forget everything about the old billing setup" is about a whole concept:
retire it.

```text
toolkit memory retire project_billing --reason 'The owner: forget the old billing setup.'
```

"Delete it for good" is different. His words are the approval, so do not
ask again: run `toolkit memory delete <key> --owner-approved`, and the host
asks him to confirm the command. Reply with his words quoted.

Right after an update, "forget that" is not clear. Ask once: "Put back the
old wording, or remove that fact?"

## 5. A correction that contradicts a saved section

The owner: "Remember: deploys moved to Tuesdays after 6 pm."

Search first (step 2):

```text
toolkit memory find 'deploy'
```

It finds `project_deploys`, whose section "Deploy window" says "Deploys
happen on Mondays after 6 pm". Without this search the save would work and
leave two facts that contradict each other: the duplicate check compares
wording, and these two share too few words. Read the concept with its
version, and keep this read; its old section text is the undo:

```text
toolkit memory get project_deploys --json
```

It is the same sub-topic with a newer day, so replace that section with the
version from that read:

```text
toolkit memory save --concept project_deploys --section 'Deploy window' --body-file - --expect 3f9c2a1b7d4e --approved-by Mike <<'EOF'
```

Reply: "Updated in memory: Deploy window (in Deploys). Say 'undo that' to
put back the old wording."

If he says "undo that", save the old section text (the `previous` field of
the `--json` output of the update) with `--expect`, giving the version the
update printed.

## 6. The duplicate check stops a save

The owner: "Document every command-line flag in the README." The search in
step 2 used other words (`toolkit memory find 'option docs'`) and found
nothing. The save exits with code 2 and prints:

```text
Error: project_document_flags was not saved: memory already has a record like it.
- project_readme_flags, a very similar description: Explain each command-line flag in the README
Fix: To update project_readme_flags, read it with toolkit memory get project_readme_flags --json, then save that key with --expect <version> (the version field of that read). To replace a record with this one, add --supersedes <key>. When it is a different fact, add --allow-similar.
```

Read the listed record:

```text
toolkit memory get project_readme_flags --json
```

It is the same rule in other words, and it already says everything, so
nothing new is saved. Reply: "Already in memory: explain each command-line
flag in the README."

Had it been a different fact, write down in one line why it differs, then
save again with `--allow-similar`.

The same check runs on a section save. "project_billing already holds this
fact under "Stripe"" means that section says it already: keep it, or change
that section with `--expect`.

## 7. Things that are not memory

| The owner says | Where it goes | Reply |
| --- | --- | --- |
| "Remember we decided to use Postgres everywhere." | `DECISIONS.md`, through `work-decide` | "That is a project-wide decision; recording it in DECISIONS.md." |
| "Remind me to email the client." (no time given, no work item) | Current focus, Untracked to-dos | "Added to the current focus under Untracked to-dos." |
| "Add dark mode to the backlog." | A work item, through `work-on` | "That is project work; starting a work item." |
| "When I say 'job' I mean an Apex batch." | The glossary | "Added 'job' to the glossary." |
| "Remember the login page must load in 2 seconds." | A requirement on the work item, through `work-requirements` | "That is a requirement; adding it to the work item." |

## 8. A preference a setting can enforce

The owner: "I hate tabs. Always use spaces."

Save it as a section of the `user` concept that holds his working
preferences (for example `user_profile`, section "Tabs"), with his
approval, as in example 1. Then offer the setting that enforces it:

"Saved to memory: Tabs (in Profile). I can also add an `.editorconfig` rule
so every editor uses spaces. Add it?"

## 9. The first fact of a new concept

The owner: "Remember that Stripe handles all our invoices and refunds."
`toolkit memory list --type project` shows no concept about billing. Start
one, named for the concept, with this fact as its first section:

```text
toolkit memory save --type project --name billing --description 'Billing: Stripe setup, invoices, and refunds' --section 'Payment provider' --body-file - --source 'The owner, in chat, 2026-09-28' --approved-by Mike <<'EOF'
```

The file `project_billing.md` starts with its title (`# Billing`), its
summary, and today's date as `updated`, then `## Payment provider`. The next
billing fact ("refunds are allowed for 30 days") goes into it as a section:

```text
toolkit memory save --concept project_billing --section 'Refund window' --body-file - --source 'The owner, in chat, 2026-09-29' --approved-by Mike <<'EOF'
```

Reply to the first: "Saved to memory: Billing. Say 'forget that' to undo."

## 10. The check names the concept a fact belongs in

A save of a new record exits with code 2:

```text
Error: project_invoice_day was not saved: it belongs in the concept project_billing ("Billing"), which shares its words (invoice, billing).
- project_billing: Billing: Stripe setup, invoices, and refunds
Fix: Add it there as a section: toolkit memory save --concept project_billing --section 'Invoice day' --body-file <file> <the same --approved-by or --proposal> ...
```

Read `project_billing`. The invoice day is part of billing, so run the
printed command with the same text and approval. Only when it is really a
different concept, save the new record again with `--new-concept`.

