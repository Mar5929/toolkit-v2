# Memory review checklist

Purpose: what to look for in a whole-memory review, the command that shows
each problem, the change to propose, and examples of the proposal list and
the final report.

## Contents

- What to look for
- The proposal list
- After the changes
- The report

## What to look for

Go through every record in use (`toolkit memory list`; retired records are
left out), reading each one you judge with `toolkit memory get <key> --json`.
Tick each line.

- [ ] **Duplicates:** two records with the same meaning. Propose: keep the
      clearer one, update it with anything the other adds, retire the other
      with `--superseded-by <kept-key>`.
- [ ] **Contradictions:** two current records that cannot both be true.
      Propose a question to the owner; never pick one by date alone.
- [ ] **Stale records:** a later decision replaced it, or its
      `last_verified` is old and its subject has changed. Propose: retire it,
      supersede it with the newer fact, or check it and save it again with
      `--expect <version> --last-verified <YYYY-MM-DD>` (today's date). A
      save without `--last-verified` keeps the old date.
- [ ] **Wrong home:** a record that holds work-item status, next steps,
      undelivered requirements, a project-wide decision, or a copy of a
      requirement or design. Propose: move the meaning to its home (the work
      item, `DECISIONS.md` through `work-decide`), then retire the record.
- [ ] **Breaks the memory criteria:** a secret, an email address, raw logs,
      a guess, or a fact the owner rejected. Propose: delete (a secret or an
      email address) or retire, with the reason.
- [ ] **Wrong type or name:** a type that does not match the content, or a
      name that no longer says what the record is. Propose
      `toolkit memory rename <key> --to <new-key>`.
- [ ] **Proposals with no answer:** records marked "[proposal: the owner has
      not answered]" in the list. Put each on the list as a yes-or-no
      question. Note which ones the Stop hook saved (their Evidence and
      limits line says so): a yes to those is a full-body save, never
      `approve` (`proposals.md`).
- [ ] **Records that need review:** status `needs-review` (for example after
      a restore). Propose: check each and save it as current, or retire it.
- [ ] **The current focus:** over 50 lines, a missing `# Current focus`
      title or `Last updated:` line, a status or stage written next to a work
      item id, a finished item still under Now, a to-do that is now a work
      item, or a setup step doctor no longer reports. Read it with
      `toolkit memory focus --json`.
- [ ] **The glossary:** a term with no source, an example row still there, or
      a renamed term with no alias line. Read it with
      `toolkit memory glossary --json`.
- [ ] **Problems `toolkit memory status` lists:** broken links, an
      out-of-date index, a name that does not match its file, a record in the
      wrong folder, rows with no Record Key (Notion), bank settings
      (Hindsight).
- [ ] **Backup:** the last export date (`toolkit memory status`, "Last
      export"), and doctor's backup warning.

## The proposal list

One numbered list, each line with the change, the keys, and the reason. Ask
once, at the end, for the whole list. Example:

```markdown
Proposed changes to memory:

1. Merge: keep `feedback_merge_only_by_pull_request`, retire `feedback_merge_by_pr` (same rule, older wording).
2. Retire `project_deploy_monday`: DECISIONS.md D-7 moved deploys to Tuesday on 2026-09-20.
3. Rename `project_owner_prefers_spaces` to `user_prefers_spaces`: it is the owner's preference, not a project fact.
4. Question: `project_api_rate_limit` says 100 requests a minute, `reference_api_limits` says 60. Which is right?
5. Proposal waiting since 2026-09-24: "staging resets every Sunday". Keep it or drop it?
6. Trim the current focus from 58 to 41 lines: take WI-009 and WI-011 off Now (both Done).
7. Delete `user_personal_email`: it holds an email address.

Before any change, I will export memory to ~/Backups/toolkit/shop-app-before-tidy-2026-09-28-1430.
Say "yes to all", or give the numbers you want, and your answer to 4 and 5.
```

- His "yes to all" covers every numbered change, including the delete. It is
  the approval for the delete; the host then asks him to confirm the
  command. Quote his words for a delete in the report.
- "Yes except 3" means apply the others and leave 3.
- An answered question (4, 5) becomes a change: an update, a retire, a
  reject, or his yes to a proposal (the full-body save for one the Stop hook
  saved, `approve` for one with a full body; `proposals.md`).
- Change nothing that is not on the list and approved.

## After the changes

Repeat until both come back clean:

```text
toolkit memory status
toolkit doctor
```

- A broken link: correct the record that holds it with
  `toolkit memory save` and `--expect`.
- An out-of-date built-in index: `toolkit memory reindex`.
- A problem you cannot fix without the owner: put it in the report as a
  question.

## The report

List each change by key, with the words he can say to undo it. "Bring
back <key>" means the whole restore in `replacing-and-retiring.md`, section
7, not `toolkit memory restore` alone. Example:

```markdown
Memory is tidy. Changes:

- Retired `feedback_merge_by_pr` (superseded by `feedback_merge_only_by_pull_request`). Undo: say "bring back feedback_merge_by_pr".
- Retired `project_deploy_monday` (archived). Undo: say "bring back project_deploy_monday".
- Renamed `project_owner_prefers_spaces` to `user_prefers_spaces`. Links in 2 notes updated. Undo: say "rename it back".
- Deleted `user_personal_email`, as you said: "yes to all". This cannot be undone. Older backups still hold that email address: the day folders in ~/Backups/toolkit and the export made before this tidy. Delete those copies if you want it gone everywhere.
- Current focus: 41 lines.
- Backup before the changes: ~/Backups/toolkit/shop-app-before-tidy-2026-09-28-1430. Backup after: ~/Backups/toolkit/shop-app-2026-09-28.

Still open: which API limit is right, 100 or 60 requests a minute?
```

End with the one question still open, or the exact words that continue.
