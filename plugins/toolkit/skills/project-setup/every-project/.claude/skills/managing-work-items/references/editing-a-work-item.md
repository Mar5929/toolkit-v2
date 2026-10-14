# Editing a work item

Use this reference when creating or changing requirements or Questions and Answers. Follow the installed tracker for storage, formatting, exact calls, and verification.

## Requirements

Each requirement is one block under `## Requirements`, in the order of its number. The block has the form of the requirement block in the template selected by `work-tracker.md`.

- **A new requirement.** Add its block after the last block, with the next unused number. Take the form from the template, never from a prompt that was left in a work item.
- **A new line.** Add the line at the end of its numbered list.
- **A part with nothing to write yet.** Keep the part's label, and write nothing after the label.

## Questions and Answers

- **A new row.** Its ID is the highest Q-ID in this work item plus one. Insert the row after the last open row. When no row is open, insert it right after the separator line. Open rows then stay on top, oldest first.
- **An answer.** Put the answer in the speaker's words in quotation marks under Answer, name its speaker and source evidence when applicable, and write the decision date as `YYYY-MM-DD`. Use the authority checks in `filing-project-records/references/record-decision.md` for a sourced decision. Then move the row to just below the last open row, so that answered rows are newest first.
- **A superseded row.** Change only the row's Status cell, to `Superseded by Q-09`.
