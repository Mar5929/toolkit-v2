# Work items as GitHub issues

Each work item is one issue in the repository named on the "GitHub repository" line of `PROJECT.md` (written `<repo>` below). Use `gh` for everything, even when a GitHub connector is available. The exact commands are in `work-tracker-gh.md`.

## Layout

| Part | Where |
| --- | --- |
| ID | The issue number, `#12`. Find items by number, never by link or title. In branch names use `issue` (`claude/issue-12-csv-export`). Folders and files named for the item use its short name, as `building.md` says. |
| Header fields | Labels (table below). Status has no label. |
| Body | The work item template from `## Overview` to the end. |
| Done / Cancelled | Closed as completed / closed as not planned. |
| Sub-items | GitHub sub-issues. |
| Item phases | Roadmap rows in the body, each with a `### P1 — <name>` heading over its task checkboxes. |
| Project phases | Milestones, one per phase; each top-level issue sits in its phase's milestone. |
| Project tasks | Checkboxes in one pinned issue titled "Project tasks". |
| Design | One comment whose first line is exactly `## Solution design`. |
| Agent notes | Comments starting with "Agent:". They show the owner's name, because `gh` signs in as the owner. |

## Labels

| Field | Label |
| --- | --- |
| `state` | Exactly one `state:<state>`, lower case with hyphens (`state:refining-requirements`). Ignored once the issue is closed. |
| `type`, `priority` | Exactly one `type:<type>` and one `priority:<priority>` |
| `waiting_on` | At most one `waiting-on:owner`, `waiting-on:agent`, or `waiting-on:external`; none means `none` |
| `delivery` | `delivery:agent-led` or `delivery:owner-led`; none means `not-offered` |
| Approvals | `requirements-approved`, `result-approved`; the date and words are in the Q&A row |
| `design` | `design-proposed` or `design-approved`, never both. None means no design, or superseded if a design comment exists. |

Swap labels in one call so an issue never has two state labels or none. If labels conflict or go missing, ask which State or type applies (recommending the last State in Recent History), and restore a missing priority as `priority:medium`.

## Rules

- Always pass `-R <repo>`, and write `repos/<repo>/...` in API paths, never `{owner}/{repo}`, which `gh` fills from the folder's remote.
- **Never let GitHub close an issue.** Never put close, closes, closed, fix, fixes, fixed, resolve, resolves, or resolved right before `#12` in a pull request or commit; write "Part of #12". Never link a pull request in the issue's Development panel. If an issue closes itself anyway, reopen it and tell the owner.
- The body is one piece of text. Read it right before changing it, change only your lines, and write the whole thing back, so the owner's browser edits survive.
- Create nothing but issues and comments without the owner's yes. Labels are agreed once at setup; milestones only for approved project phases.
- Never delete an issue, comment, or label. Close or cancel instead. Remove a sub-issue link only to move an item.
- GitHub has no archive. If asked to archive an open item, say so, note that closed issues already drop out of lists, and ask whether to cancel it.
- The owner closing an issue in the browser counts as their word. An answer or request in the owner's comment counts like one in the session; someone else's comment never does.
- Never write `#1` for a requirement; GitHub reads it as an issue.
- In table cells, escape `|` as `\|` and use `<br>` for line breaks. Recent History rows go right under the header separator.
- Keep the body under 60,000 characters. Past that, tell the owner and propose sub-items; never cut the owner's words or history.

## Creating an item

Build the body from `assets/work-item-template.md`, from `## Overview` on, filled with no prompts left. Keep the headings, table headers, labels, and guide comments; write "None." under Sources and Lessons; leave Kept for the project empty. Write Related items as "Parent #12, phase P2.", "Parent #14.", or "Project phase P01." as fits, and add `Short name: <short name>` once one is chosen, as `building.md` says. Create it with its State, type, and priority labels only, then link it to its parent or milestone.

An issue the owner opened by hand (no `## Overview` or no state label) gets the layout only after the owner's yes: their text becomes Requirement 1's Original verbatim requirement, it gets `state:backlog` and `priority:medium`, and you ask the type unless it's obvious.

## Plans

- Phases live only in top-level issues. A task line ends each line with two spaces so GitHub keeps them apart. Starting a task changes its status after `·`; ticking it changes `- [ ]` to `- [x]` and the status to Done in one edit. The owner ticking a box counts.
- Linking a sub-item: make it a sub-issue, then name `#14` in the parent's Sub-items cell (or Sub-items line) and record it in the parent's Recent History. Count levels before linking.
- Moving an item: check levels, re-parent with `replace_parent=true` (or remove it to make it top-level), fix both parents' lists and its Related items, and add or remove its milestone. If the owner moved it in the browser, make the lists agree at your next change.
- Switching between phases and a plain list keeps task IDs and ticks, moves sub-item numbers between Sub-items cells and the Sub-items line, and records the old phases in Recent History.

## Design

The design is the `## Solution design` comment: the design template from its first section to the end, with no front matter or title. Add `design-proposed` when you post it. Edit it in place; never post a second one. Past 60,000 characters, continue in a `## Solution design (part 2)` comment. Two design comments that aren't parts: ask the owner which is current.

## Other notes

- Record a pull request by naming it in the item's Related items and in Recent History. In the pull request, write "Part of #12".
- A helper opens an item by ID: `gh issue view <number> -R <repo> --json title,body,labels,state`, and `--comments` for the design.
