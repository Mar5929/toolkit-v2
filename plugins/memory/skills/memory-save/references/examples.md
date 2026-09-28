# Worked examples for memory-save

Purpose: complete examples of the common cases, each with the owner's words,
the commands in order, and the one-line reply. Commands are shown in the
Claude Code form (`--body-file -` with the body on standard input); in Codex
use `--body '<text>'` instead, with any apostrophe written ’ (U+2019).

## Contents

1. A correction from the owner
2. A fact the agent inferred, in onboarding mode
3. A question the owner did not answer
4. "Forget that"
5. A correction that contradicts a saved record
6. The duplicate check stops a save
7. Things that are not memory
8. A preference a setting can enforce

## 1. A correction from the owner

The owner: "Stop force-pushing. Never do that again."

His words are the approval. Search first:

```text
toolkit memory find 'force push'
```

Nothing found. Save, with him as the approver:

```text
toolkit memory save --type feedback --name no-force-push --description 'Never force-push to any branch; use a merge or a new commit' --body-file - --source 'The owner, in chat, 2026-09-28' --approved-by Mike <<'EOF'
```

The body on standard input, then a line holding only `EOF`:

```markdown
# No force-push

**Remember:** Never force-push to any branch in this repository.

**Why:** Not stated by the owner.

**How to apply:** Use a merge or a new commit. If a push is rejected, pull first.

**Evidence and limits:** The owner, in chat, 2026-09-28. Applies to every branch.

**Related memories:** None.

**Authoritative records:** None.
```

Read it back and check:

```text
toolkit memory get feedback_no_force_push
toolkit doctor
```

Reply: "Saved to memory: no force-push. Say 'forget that' to undo."

## 2. A fact the agent inferred, in onboarding mode

While working, the agent sees that every test run uses `npm run test:ci`.
Nobody said to remember it, and `toolkit config get memory.approval` prints
`onboarding`. The reply ends with the question, in exactly this form:

"Save to memory: tests run with npm run test:ci?"

The owner answers "yes". If the next turn's context names a proposal the
Stop hook saved for that question, use the key the context names. For this
question the hook names `project_tests_run_npm_test_ci`. Read it with
`--json`, write the full body, and save the same key with his approval.
Never `toolkit memory approve` here: it would keep the hook's unfinished
body.

```text
toolkit memory get project_tests_run_npm_test_ci --json
toolkit memory save --type project --name tests-run-npm-test-ci --description 'Tests run with npm run test:ci' --body-file - --expect <version> --approved-by Mike <<'EOF'
```

With no proposal saved, save a new record with `--approved-by Mike` and
`--source 'The owner, in chat, 2026-09-28'` instead.

Reply: "Saved to memory: tests run with npm run test:ci. Say 'forget that'
to undo."

## 3. A question the owner did not answer

The reply ended with "Save to memory: staging resets every Sunday?" The
owner's next message is about something else. The proposal stays as it is:
it is not a fact, search leaves it out, and `work-decide` asks him later.
Do not ask the same question again in this session.

When no proposal was saved for it (the next turn's context names none), save
one yourself:

```text
toolkit memory save --type project --name staging-resets-every-sunday --description 'Staging resets every Sunday' --body-file - --source 'Agent observation in a session, 2026-09-28' --proposal <<'EOF'
```

If you mention it in the reply: "Saved as a proposal for your yes or no:
staging resets every Sunday."

## 4. "Forget that"

Right after a new record's save, the owner says "forget that". Retire the
record you just saved, with no question:

```text
toolkit memory retire feedback_no_force_push --reason 'The owner: forget that.'
```

Reply: "Retired from memory: no force-push. Say 'bring it back' to restore
it."

"Delete it for good" is different. His words are the approval, so do not
ask again: run `toolkit memory delete <key> --owner-approved`, and the host
asks him to confirm the command. Reply with his words quoted.

Right after an update, "forget that" is not clear. Ask once: "Put back the
old wording, or retire the whole record?"

## 5. A correction that contradicts a saved record

The owner: "Remember: deploys moved to Tuesdays after 6 pm."

Search first (step 2):

```text
toolkit memory find 'deploy'
```

It finds `project_deploy_window`: "Deploys happen on Mondays after 6 pm".
Without this search the save would work and leave two records that
contradict each other: the duplicate check compares wording, and these two
descriptions share too few words. Read the record with its version, and
keep this read; its old text is the undo:

```text
toolkit memory get project_deploy_window --json
```

It is the same subject with a newer day, so update it in place with the
version from that read:

```text
toolkit memory save --type project --name deploy-window --description 'Deploys happen on Tuesdays after 6 pm' --body-file - --expect 3f9c2a1b7d4e --approved-by Mike <<'EOF'
```

Reply: "Updated in memory: deploys happen on Tuesdays after 6 pm. Say 'undo
that' to put back the old wording."

If he says "undo that", save the old description and body from the `--json`
read with `--expect <the version the update printed>`.

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

Save it as a `user` record with his approval, as in example 1. Then offer
the setting that enforces it:

"Saved to memory: prefers spaces over tabs. I can also add an
`.editorconfig` rule so every editor uses spaces. Add it?"
