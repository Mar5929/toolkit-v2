# Where each work item field goes (local files)

## Questions and Answers

The table sits under `## Questions and Answers` in the item's main file, for example `work-items/WI-031-transaction-entry/WI-031.md`.

Columns, in order: ID, Question, Answer, Date answered, Decision?, Affects, Status, Decision needed from.

- **A new row:** its ID is the highest Q-ID in this item plus one. Insert it after the last open row, or right after the separator line when none is open, so open rows stay on top, oldest first.
- **An answer:** put his words in quotes under Answer, the date as `YYYY-MM-DD`, Decision? `yes` or `no`, and Status `Answered`. Then move the row to just below the last open row, so answered rows are newest first.
- **A superseded row:** change only its Status, to `Superseded by Q-09`. Never edit its other cells.
- `waiting_on` is in the front matter at the top of the file: `waiting_on: "owner"` while a question of his is open, otherwise `"agent"` or `"none"`.

Answering Q-04, before:

```markdown
| Q-04 | Which fields must every transaction have? Recommended: amount, date, category, because reports group by all three. |  |  |  | R-01 | Open | owner |
```

After:

```markdown
| Q-04 | Which fields must every transaction have? Recommended: amount, date, category, because reports group by all three. | "Amount, date, category. Notes are optional." | 2026-10-01 | yes | R-01 | Answered | owner |
```
