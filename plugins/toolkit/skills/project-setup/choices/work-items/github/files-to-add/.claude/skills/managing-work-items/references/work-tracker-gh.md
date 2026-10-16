# gh commands for work items

## Sign-in and setup

- `gh auth status` shows the account and scopes; a private repository needs `repo`.
- Only the owner signs in: ask them to run `gh auth login` (GitHub.com, HTTPS, web browser) and wait. Never ask for a token or code, and never use `--with-token`. A missing scope: ask them to run `gh auth refresh -s repo`.
- If the "GitHub repository" line in `PROJECT.md` is empty, ask the owner and record it with `project-setup`. Never guess from the Git remote.
- In Codex, run each `gh` command on its own, never chained with `&&`, `;`, or a pipe (redirecting to a file is fine).
- Write bodies and multi-line comments to files in a temporary folder outside the repository (`mktemp -d`, or the session scratchpad), and remove it when done.

## Issues and the body

```text
gh issue view <number> -R <repo> --json number,title,body,labels,state,stateReason,url,updatedAt
gh issue create -R <repo> --title '<title>' --body-file <dir>/body.md --label 'state:backlog' --label 'type:<type>' --label 'priority:medium'
```

- `stateReason` is `COMPLETED` (Done), `NOT_PLANNED` or `DUPLICATE` (Cancelled), or `REOPENED`.
- Quote titles in single quotes; write an inner single quote as `'\''`. The created issue's number is the end of the printed address.
- To change the body: read it into a file right before the change (`gh issue view <number> -R <repo> --json body --jq .body > <dir>/body.md`), edit only your lines, and write it back with `gh issue edit <number> -R <repo> --body-file <dir>/body.md`. GitHub keeps every earlier version under "edited", if the owner loses text.
- Read one section: `gh issue view <number> -R <repo> --json body --jq '("\n" + .body) | split("\n## ") | map(select(startswith("Questions and Answers"))) | .[0]'`
- Check the size after each change: `--json body --jq '.body | length'`.

## Labels, closing, comments

```text
gh issue edit <number> -R <repo> --remove-label 'state:building' --add-label 'state:testing-loop'
gh issue close <number> -R <repo> --reason completed        # or --reason 'not planned'
gh issue reopen <number> -R <repo>
gh issue comment <number> -R <repo> --body-file <dir>/comment.md
gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | [.id, .created_at, .user.login, (.body | split("\n")[0])] | @tsv'
gh api repos/<repo>/issues/comments/<comment-id> --jq .body > <dir>/comment.md
gh api repos/<repo>/issues/comments/<comment-id> -X PATCH -F body=@<dir>/comment.md
```

Find the design comment: `gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | select(.body | startswith("## Solution design")) | [.id, .html_url] | @tsv'`

## Sub-issues

These calls take the child's numeric REST id, not its issue number, and not the id from `gh issue view --json id`.

```text
gh api repos/<repo>/issues/<child-number> --jq .id
gh api repos/<repo>/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<id>
gh api repos/<repo>/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<id> -F replace_parent=true
gh api repos/<repo>/issues/<parent-number>/sub_issue -X DELETE -F sub_issue_id=<id>
gh api --paginate repos/<repo>/issues/<parent-number>/sub_issues --jq '.[] | [.number, .state, .title] | @tsv'
gh api repos/<repo>/issues/<number>/parent --jq .number
```

- Use `-F`, not `-f`, so the id is sent as a number. The delete path is `sub_issue`, singular.
- "No parent issue found" (404) just means the issue is top-level.
- Count levels before adding: run the parent call on the new parent, then on its parent. A parent with two ancestors is already level 3.

## Finding work

```text
gh issue list -R <repo> --state open --limit 200 --json number,title,labels,body
gh issue list -R <repo> --state open --limit 200 --label 'waiting-on:owner' --json number,title
gh issue list -R <repo> --state all --limit 200 --search 'bank file in:title,body' --json number,title,state,labels
gh issue list -R <repo> --state closed --limit 200 --search 'closed:>=<date>' --json number,title,stateReason,closedAt
gh issue list -R <repo> --state all --limit 200 --search 'updated:>=<date>' --json number,title,state,updatedAt
```

- To list open items, sort open issues by priority then number, and skip the "Project tasks" issue (its body starts `## Project tasks`).
- An open issue with no `## Overview` lacks the layout; handle it as `work-tracker.md`, "Creating an item", says. One without exactly one state label is handled as `work-tracker.md`, "Labels", says.
- An issue updated since a date with no matching Recent History row was probably changed by the owner; say so.

## Project phases (milestones)

A milestone's title is `P01 — <name>`; its description holds `Status:`, `Outcome:`, and `Exit result:` lines. Done or Cancelled phases are closed milestones. Never set a due date or delete a milestone. GitHub returns milestones unordered, so sort by title.

```text
gh api --paginate 'repos/<repo>/milestones?state=all' --jq '.[] | select(.title | test("^P[0-9]{2} ")) | [.number, .title, .state, .open_issues, .closed_issues] | @tsv'
gh api repos/<repo>/milestones -X POST -f title='P01 — Discovery' -F description=@<dir>/milestone.md
gh api repos/<repo>/milestones/<milestone-number> -X PATCH -F description=@<dir>/milestone.md
gh api repos/<repo>/milestones/<milestone-number> -X PATCH -f state=closed
gh issue edit <number> -R <repo> --milestone 'P01 — Discovery'    # or --remove-milestone
```

To merge or drop a phase, move its issues first, set Status to Cancelled with "Merged into P01." or "Dropped: <reason>.", and close the milestone.

## Project tasks issue

One pinned, unlabeled issue titled "Project tasks" whose body starts with `## Project tasks` (that line, not the title, identifies it). Create it the first time a project task is saved, then pin it with `gh issue pin <number> -R <repo>`; if the three-pin limit blocks that, tell the owner. Tasks are `PT-01` blocks in the template's task form, newest last. Two issues with the marker: ask the owner which to keep.

## Labels the project needs

List existing ones with `gh label list -R <repo> --limit 200 --json name --jq '.[].name'` (names match case-insensitively). Create missing ones only after the owner's yes, one at a time, never with `--force`: `gh label create '<name>' -R <repo> --color <hex> --description '<text>'`. Never change, rename, or delete an existing label.

| Labels | Color |
| --- | --- |
| `state:` backlog, refining-requirements, designing, building, testing-loop, reflecting, deploying, blocked | `C5DEF5` |
| `type:` discovery, solution-design, build, data-load, repository-maintenance, research, task, bug, enhancement | `D4C5F9` |
| `priority:urgent` / `high` / `medium` / `low` | `B60205` / `D93F0B` / `FBCA04` / `C2E0C6` |
| `waiting-on:owner` / `agent` / `external` | `E99695` / `BFDADC` / `F9D0C4` |
| `delivery:agent-led`, `delivery:owner-led` | `EDEDED` |
| `requirements-approved`, `design-approved`, `result-approved` | `0E8A16` |
| `design-proposed` | `FEF2C0` |

Give each label a one-line description of what it means, such as "State: building the change".

## When a call fails

A failed write may still have happened, so check before retrying.

| What you see | What to do |
| --- | --- |
| Exit code 4, "gh auth login", or 401 | Ask the owner to sign in, and wait. |
| "Could not resolve to a Repository" or 404 on the repo | Check `<repo>`; if it's right, ask whether this account has access. |
| 404 on one issue | Tell the owner. Never create a replacement. |
| "could not add label: not found" | The whole edit failed. Ask before creating the label. |
| 422 "Validation Failed" | Usually a sub-issue given by number, a child that already has a parent, or a body over 65,536 characters. Fix and retry. |

## Limits

- Bodies and comments: 65,536 characters. Sub-issues per parent: 100.
- `gh issue list` returns 30 unless `--limit` is set; if a list returns exactly the limit, double it and rerun. `gh api` needs `--paginate` for more than one page.
- Space out bursts of writes (such as creating labels) by at least a second to avoid the secondary rate limit.
