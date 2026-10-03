# Deleting the example rows of Questions and Answers (TKV-17, 2026-10-03)

## What happened

While tidying five work items of the Toolkit V2 project (TKV-10, TKV-13,
TKV-15, TKV-16, TKV-17), an agent deleted the two example rows of the
Questions and Answers table with one `update_content` call per page. Each
time, everything after the table (the Notes heading and its three
sub-headings) was gone afterwards, and Notion returned no error. Those
sections held only template prompts, and the agent wrote the headings
again. These pages use the project's older work item template, where Notes
is the only section after the table.

In each of those calls, `old_str` was the end of the header row, the two
example rows, and a line break after the last `</tr>`; `new_str` was the
end of the header row with no line break after it. So `old_str` ended with
a line break that `new_str` lacked.

## The test

A throwaway project, "TKV-17 check (safe to delete)", was made from the
"Project" template with the owner's yes. On pages made from the newer work
item template, four pages each got one `update_content` call. Three calls deleted the two
example rows, and one was refused:

| Run | `old_str` | `new_str` | Result |
| --- | --- | --- | --- |
| 1 | the two rows and the `</table>` line | the `</table>` line | Rows gone; Notes, the four `<database …>` lines, and the embed line kept |
| 1b | the end of the header row and the two rows | the end of the header row | The same |
| 1d | the two rows, the `</table>` line, and the `# Notes` line | the `</table>` line and the `# Notes` line | The same |
| 1c | as run 1, with each row line indented by a tab | the `</table>` line | Refused: 400, no match |

In runs 1, 1b, and 1d the only blocks that disappeared were the two
example `table_row` blocks (54 blocks before, 52 after). In none of these
runs did `old_str` end with a line break that `new_str` lacked.

## What is known and what is not

- The method in `page-layout.md` (the lines to delete plus one neighbouring
  line that stays) works on the newer template.
- The loss was not reproduced. The line break at the end of `old_str` is
  one difference between the calls that lost text and the calls that did
  not; the older template is another. Neither was tested as the cause: the owner moved the
  throwaway project to the trash during the test, and decided that no
  further test was needed.
- Not tested: the older template, the full "fill a new item" call with many
  edits at once, and deleting a row block through the block API.

## The change (0.8.10)

`ntn-commands.md` says that inside a table `old_str` and `new_str` end the
same way.
`page-layout.md` names the `</table>` line as the neighbouring line for the
two example rows, and adds a check after any call that deletes lines.
