# GitHub Issues as the tracker

Toolkit V2 has no GitHub driver. `toolkit work` commands exit with code 3 in
a GitHub project. Use the GitHub CLI (`gh`) and follow this file. The model is
the same as every other tracker: the fourteen stages, the six statuses, the
`WORK-ITEM.md` body, and one design per item.

## One issue per work item

| Work item part | Where it goes in GitHub |
| --- | --- |
| `id` | The issue number, written `#12`. Use it wherever a skill says `<id>`. |
| `title` | The issue title |
| Body (Overview through Notes) | The issue body: the `WORK-ITEM.md` body from `## Overview` to the end, without the frontmatter and without the `# WI-001: ...` title line |
| `stage` | One label `stage:<stage>`, for example `stage:08-build`. Exactly one per issue. |
| `status` | Open issue for Backlog, Ready, In Progress, In Review; closed as completed for Done; closed as not planned for Cancelled. When the repository uses a GitHub Project board, also set its Status field to the same value. |
| `type` | One label `type:<type>`, for example `type:bug` |
| `priority` | One label `priority:<priority>` |
| `waiting_on` | Label `waiting-on:owner` while the item waits for the owner; remove it after the answer. Waiting on someone else goes in the Overview Blockers line. |
| `delivery` | One label `delivery:<agent-led or owner-led>` once the owner answered the delivery offer |
| `requirements_approved`, `design`, `result_approved` | Labels `requirements-approved`, `design-approved`, `result-approved`, plus a Recent History row with the date, who approved, and his words |
| `parent` | GitHub sub-issues: the child issue is a sub-issue of the parent issue |
| Design (`DESIGN.md`) | One issue comment whose first line is `## Solution design`. Edit that comment in place; never add a second one. |
| Recent History | The Recent History table in the body |

Start a new issue body from the model's work item template (from
`## Overview` to the end) so every section exists, and a new design comment
from the model's design template, without its frontmatter.
[../trackers.md](../trackers.md), "Templates for every tracker", says where
both are.

## Commands

Read before changing anything:

```text
gh issue view <number> --json number,title,body,labels,state,comments
```

Create an item (the body file holds the template body with the owner's
starting request filled in):

```text
gh issue create --title '<title>' --body-file <file> --label 'stage:01-discovery' --label 'type:<type>'
```

Change the body (always read it first, change only what needs to change, and
write the whole body back):

```text
gh issue edit <number> --body-file <file>
```

Change the stage (remove the old stage label, add the new one, in one call):

```text
gh issue edit <number> --remove-label 'stage:08-build' --add-label 'stage:09-testing'
```

Add the design comment the first time, then edit it:

```text
gh issue comment <number> --body-file <file>
gh api repos/{owner}/{repo}/issues/comments/<comment-id> -X PATCH -F body=@<file>
```

Make an issue a sub-issue of another (the API needs the child's numeric `id`,
not its number):

```text
gh api repos/{owner}/{repo}/issues/<child-number> --jq .id
gh api repos/{owner}/{repo}/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<child-id>
```

Finish or cancel, only after the owner's approval or reason is recorded:

```text
gh issue close <number> --reason completed
gh issue close <number> --reason 'not planned'
```

## Rules

- Treat the body, the labels, the design comment, and the board field as one
  update. Read them back. When only part of an update worked, say which part
  failed and fix it.
- Labels are created once during setup, with the owner's yes. When a label is
  missing during normal work, ask before creating it.
- Never create a local `.work-items/` copy of GitHub issues.
- No AI credit in issue bodies, comments, or labels.
