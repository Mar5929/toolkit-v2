# GitHub Issues as the tracker

How to keep work items in GitHub Issues when `tracker.type` is `github`. The
toolkit has no GitHub driver: every `toolkit work` command exits with code 3
here, so the agent does each step with the GitHub CLI (`gh`) and this file.

## Contents

1. Rules for every tracker
2. One issue per work item
3. Templates
4. The `toolkit work` steps in GitHub
5. Commands
6. Rules for GitHub

## 1. Rules for every tracker

- The same model as every tracker: the fourteen stages, the six statuses,
  the `WORK-ITEM.md` body, and one design per item. `toolkit work lifecycle`
  still works here and prints the stages, statuses, types, and gates.
- One tracker per project. Never create a second one, and never keep a local
  `.work-items/` copy of the issues.
- A sub-item is its own item, with its own requirements, design, roadmap, and
  approvals. Finishing it never finishes or approves its parent.
- Only the main agent changes an issue. Helper agents return findings; the
  main agent saves them.
- The work-item hooks do nothing for this tracker, so nothing checks the issue
  for you: read it back after every change.

## 2. One issue per work item

| Work item part | Where it goes in GitHub |
| --- | --- |
| `id` | The issue number, written `#12`. Use it wherever a skill says `<id>`. |
| `title` | The issue title |
| Body (Overview through Notes) | The issue body: the `WORK-ITEM.md` body from `## Overview` to the end, without the header fields and without the `# WI-001: ...` title line |
| `stage` | One label `stage:<stage>`, for example `stage:08-build`. Exactly one per issue. |
| `status` | Open for Backlog, Ready, In Progress, In Review; closed as completed for Done; closed as not planned for Cancelled. When the repository uses a GitHub Project board, also set its Status field to the same value. |
| `type` | One label `type:<type>`, for example `type:bug` |
| `priority` | One label `priority:<priority>` |
| `waiting_on` | Label `waiting-on:owner` while the item waits for the owner; remove it after his answer. Waiting on someone else goes in the Overview Blockers line. |
| `delivery` | One label `delivery:agent-led` or `delivery:owner-led` once the owner answered the delivery offer |
| `requirements_approved`, `result_approved` | Labels `requirements-approved`, `result-approved`, plus a Recent History row with the date, who approved, and his words |
| `design` | Label `design-proposed` while a design waits for the owner's yes; `design-approved` once he approved it (remove `design-proposed` then). Plus a Recent History row for each change |
| `parent` | GitHub sub-issues: the child issue is a sub-issue of the parent issue |
| Design (`DESIGN.md`) | One issue comment whose first line is `## Solution design`. Edit that comment in place; never add a second one. |
| Recent History | The Recent History table in the body; add the row yourself (there is no history command) |

## 3. Templates

- A new issue body starts from the work item template, `WORK-ITEM.md`,
  which the `work-on`, `work-requirements`, and `work-organize` skills carry
  in their assets folder: copy it from `## Overview` to the end, so every
  section exists.
- A new design comment starts from the design template, `DESIGN.md`, which
  the `solution-design`, `work-on`, and `work-organize` skills carry in their
  assets folder, without its header fields and its "Generated file" comment.
- Both open with a fill-in guide comment: follow it, then delete it.

## 4. The `toolkit work` steps in GitHub

When a skill says to run a `toolkit work` command, do what this table says
instead. `<number>` is the issue number without `#`. Section 5 has the exact
`gh` commands.

| Skill step | In GitHub |
| --- | --- |
| `toolkit work lifecycle` | Run it as usual: it works for every tracker |
| `toolkit work show <id>` | `gh issue view <number> --json number,title,body,labels,state,comments` |
| `toolkit work show <id> --section '<heading>'` | Read the body (`gh issue view <number> --json body --jq .body`) and use only that section |
| `toolkit work show <id> --path` | There is no file. The issue is the record: `gh issue view <number> --json url --jq .url` |
| `toolkit work list` | `gh issue list --state open --json number,title,labels --limit 200` |
| `toolkit work list --tree` | The open issues, then each parent's sub-issues (section 5, "Sub-issues") |
| `toolkit work next` | From the open issues: leave out any labeled `waiting-on:owner`, any whose Overview Blockers line names someone else, and any past `stage:11-user-approval`. Pick the highest `priority:` label (urgent, then high, medium, low); among equals, the lowest number. Say why in one line |
| `toolkit work decisions` | The three searches in section 5, "Decisions waiting on the owner": `waiting-on:owner`, `stage:11-user-approval`, and `design-proposed`. Add the memory proposals the session briefing lists under "Memory proposals waiting on the owner" (`toolkit brief`) |
| `toolkit work new ...` | Create the issue with the template body, the stage label, and the type label |
| `toolkit work new ... --parent <id>` | Create the issue, then make it a sub-issue of the parent |
| `toolkit work new ... --covers R-02,R-03` | In the child's `Active requirements`, write one line: "Covers #<parent> R-02 and R-03, approved there." Copy no requirement text. Add the `requirements-approved` label, the label `stage:03-requirements-approved` (or `stage:06-implementation-plan` when the parent has `design-approved`, because that design covers the child), and a Recent History row that names the parent's approval |
| `toolkit work edit <id> --section '<heading>' --set-file <file>` or `--text` | Read the body, change only that section, write the whole body back |
| `toolkit work edit <id> --section '<heading>' --append-row '<row>'` | Read the body, add the row as the last row of that table, write the whole body back |
| `toolkit work edit <id> --remove-guide` | Delete the fill-in guide comment (`<!-- ... -->`) above `## Overview`, then write the whole body back |
| `toolkit work history <id> --note ... --effect ...` | Add a row at the top of the Recent History table in the body: the date, the note, the effect |
| `toolkit work set <id> --stage <s>` | Swap the stage label in one call |
| `toolkit work set <id> --stage <s> --reopen` | `gh issue reopen <number>`, then swap the stage label |
| `toolkit work set <id> --waiting-on owner` | Add the `waiting-on:owner` label |
| `toolkit work set <id> --waiting-on agent` or `none` | Remove the `waiting-on:owner` label |
| `toolkit work set <id> --waiting-on 'external: <who>'` | Remove the `waiting-on:owner` label, and name who and what is missing in the Overview Blockers line |
| `toolkit work set <id> --delivery agent-led` or `owner-led` | Add that `delivery:` label (remove the other one), mark the offer's Open Questions row Answered, and remove `waiting-on:owner` when no other question for him is open |
| `toolkit work set <id> --title '<title>'` | `gh issue edit <number> --title '<title>'` |
| `toolkit work set <id> --type <type>` or `--priority <priority>` | Swap the `type:` or `priority:` label |
| `toolkit work design <id> --create` | Add the design comment, started from the design template (section 3), without its header fields and its "Generated file" comment |
| `toolkit work design <id>` | Find the design comment and read its body (section 5, "The design comment") |
| `toolkit work design <id> --set-file <file>` or `--text` | Edit the design comment in place (section 5) |
| `toolkit work design <id> ... --status proposed` | Edit the design comment with its Design status line set to Proposed, and add the `design-proposed` label |
| `toolkit work design <id> --status superseded` | Set the design comment's Design status line to Superseded, and remove `design-proposed` and `design-approved` |
| `toolkit work approve <id> --requirements` | Set the Requirements Overall status line to Finalized, add the `requirements-approved` label, remove `waiting-on:owner`, mark the Open Questions rows that asked for it Answered, and add the Recent History row with his words. An item before stage 03 moves to `stage:03-requirements-approved` |
| `toolkit work approve <id> --design` | Set the design comment's Design status line to Approved, swap `design-proposed` for `design-approved`, remove `waiting-on:owner`, mark the Open Questions rows that asked for it Answered, and add the Recent History row with his words |
| `toolkit work approve <id> --result` | Add the `result-approved` label, remove `waiting-on:owner`, and add the Recent History row with his words |
| `toolkit work finish <id> ...` | Add the Recent History row with the evidence; set Overview Current position to "Done on <date>: <evidence>", Next action to "None. Finished.", and Notes > Resume here to "Finished on <date>. Nothing to resume."; then close it as completed. When the project keeps built-in or Hindsight memory, run `toolkit handoff-backup` next and read its line: "No backup folder is set" or "failed" goes to the owner |
| `toolkit work cancel <id> --reason '<his words>'` | Add the Recent History row with his reason, then close it as not planned |
| `toolkit work move <id> --under <parent-id>` | Make it a sub-issue of the new parent, replacing its old parent (section 5, "Sub-issues") |
| `toolkit work move <id> --under root` | Remove it from its parent's sub-issues |
| `toolkit work move <id> --under archive` | GitHub has no archive. Tell the owner in one line; a Done or Cancelled issue is already closed |
| `toolkit work validate` | Read the issue back and check: one `stage:` label and one `type:` label; every `##` section of the work item body (the list in `work-item-format.md`, section 3) in the body; the Open Questions and Recent History tables intact; at most one design comment |
| `toolkit work sync` | Nothing to sync. Read the issues again. A label, state, or parent the owner changed by hand is his value: keep it and tell him in one line. A hand change that skipped a gate (a `build` or `data-load` issue past stage 03 without `requirements-approved`, or closed as completed without `result-approved`) is asked about as a question |

## 5. Commands

Read before changing anything:

```text
gh issue view <number> --json number,title,body,labels,state,comments
```

Create an item. In Claude Code, `--body-file -` reads the body from standard
input; in Codex, write the body to a file in a new `mktemp -d` folder and
delete it after the command.

```text
gh issue create --title '<title>' --body-file <file> --label 'stage:01-discovery' --label 'type:<type>'
```

Change the body (read it first, change only what needs to change, write the
whole body back):

```text
gh issue edit <number> --body-file <file>
```

Change the stage (remove the old label and add the new one in one call):

```text
gh issue edit <number> --remove-label 'stage:08-build' --add-label 'stage:09-testing'
```

Decisions waiting on the owner (three searches, one command each):

```text
gh issue list --state open --label 'waiting-on:owner' --json number,title,labels
gh issue list --state open --label 'stage:11-user-approval' --json number,title,labels
gh issue list --state open --label 'design-proposed' --json number,title,labels
```

The design comment. Add it the first time, then find its id, read it, and
edit it in place. `--paginate` reads every page of comments; without it a
busy issue can hide the design comment past the first 30.

```text
gh issue comment <number> --body-file <file>
gh api --paginate repos/{owner}/{repo}/issues/<number>/comments --jq '.[] | select(.body | startswith("## Solution design")) | .id'
gh api repos/{owner}/{repo}/issues/comments/<comment-id> --jq .body
gh api repos/{owner}/{repo}/issues/comments/<comment-id> -X PATCH -F body=@<file>
```

Sub-issues. The API needs the child's numeric `id`, not its number.
`replace_parent=true` moves a child that already has a parent.

```text
gh api repos/{owner}/{repo}/issues/<child-number> --jq .id
gh api repos/{owner}/{repo}/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<child-id>
gh api repos/{owner}/{repo}/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<child-id> -F replace_parent=true
gh api repos/{owner}/{repo}/issues/<parent-number>/sub_issue -X DELETE -F sub_issue_id=<child-id>
gh api repos/{owner}/{repo}/issues/<parent-number>/sub_issues --jq '.[] | [.number, .title, .state] | @tsv'
```

Finish or cancel, only after the owner's approval or reason is recorded:

```text
gh issue close <number> --reason completed
gh issue close <number> --reason 'not planned'
```

## 6. Rules for GitHub

- Treat the body, the labels, the design comment, and the board field as one
  update. Read them back. When only part of an update worked, say which part
  failed and fix it.
- Labels are created once during setup, with the owner's yes. When a label is
  missing during normal work (for example `design-proposed` in a project set
  up before it existed), ask before creating it.
- Creating and updating issues for work items is normal work once the owner
  chose this tracker. Create nothing else (labels, fields, workflows) without
  his yes.
- No AI credit in issue bodies, comments, or labels.
- In Codex, a `gh` call that fails with a network or sign-in error ran inside
  the sandbox: run it alone and ask for escalated permissions
  (`sandbox_permissions` set to `require_escalated`, with a one-line reason).
