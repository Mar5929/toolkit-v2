# Finding work on GitHub

This file gives the calls that read work items from the project's issues. The calls only read. Open it when you find work items.

Run each command on its own. In Codex, run each command with escalated permissions, as `work-tracker-gh-commands.md`, section "In Codex", says.

## Contents

- One work item, a section, a parent
- By state
- The board
- What waits on the owner
- A parent's full tree
- Search
- Recently finished, and changes since a date
- Issues without the layout

## One work item, a section, a parent

`work-tracker-gh-commands.md` has these commands, in its sections "Reading an issue" and "Sub-issues".

## By state

```text
gh issue list -R <repo> --state open --label 'state:building' --limit 200 --json number,title,labels
```

A work item that is Done or Cancelled is a closed issue. To list closed issues, add `--state closed`, and read `stateReason`: `COMPLETED` is Done, and `NOT_PLANNED` or `DUPLICATE` is Cancelled.

## The board

The board is the list of every open issue, each with its state, its priority, its waiting-on label, its title, and its Next action. The highest priority is first:

```text
gh issue list -R <repo> --state open --limit 200 --json number,title,labels,body --jq '
def rank: . as $p | (["priority:urgent","priority:high","priority:medium","priority:low"] | index($p)) // 2;
map([.labels[].name] as $l | {number, title,
  state: ($l | map(select(startswith("state:"))) | first),
  pri: ($l | map(select(startswith("priority:"))) | first),
  wait: ($l | map(select(startswith("waiting-on:"))) | first),
  next: ((((.body // "") | capture("\\*\\*Next action:\\*\\* (?<n>[^\n]*)") | .n)) // "")})
| sort_by((.pri | rank), .number) | .[]
| ["#\(.number)", (.state // "no state"), (.pri // "-"), (.wait // "-"), .title, .next] | @tsv'
```

- An issue that shows "no state" is one of two things:
  - an issue without the layout, which the last query in this file finds;
  - the "Project tasks" issue, whose body starts with `## Project tasks`. That issue is not a work item, so leave it out.
- Leave out closed issues unless the owner asks for them.

## What waits on the owner

This command lists the issues that wait on the owner:

```text
gh issue list -R <repo> --state open --limit 200 --label 'waiting-on:owner' --json number,title
```

The next command lists the questions that the owner has not answered. They are the rows with Status Open and "Decision needed from" owner, from the Questions and Answers of every open issue. Open rows are at the top of each table, oldest first:

```text
gh issue list -R <repo> --state open --limit 200 --json number,body --jq '.[] | .number as $n | .body | split("\n")[] | select(test("^\\| *Q-[0-9]+ *\\|")) | select(test("\\| *Open *\\| *owner *\\| *$"; "i")) | "#\($n)\t\(.)"'
```

## A parent's full tree

A tree has three levels at most. Run the command again for each sub-issue, to reach the third level:

```text
gh api --paginate repos/<repo>/issues/<number>/sub_issues --jq '.[] | [.number, .state, ([.labels[].name | select(startswith("state:"))] | first // "-"), .title] | @tsv'
```

- For a top-level parent, read its Roadmap to find the phase that each sub-issue belongs to. A sub-issue that no Roadmap row names goes last, under "No phase".
- A level-2 parent has no Roadmap. Its `**Sub-items:**` line lists its sub-issues.
- `work-tracker-project-roadmap-and-tasks.md` says how to read the project's phases and its project tasks.
- When there is a fourth level, tell the owner which issue is at level 4.

## Search

```text
gh issue list -R <repo> --state all --limit 200 --search 'bank file in:title,body' --json number,title,state,labels
```

- Without `in:`, GitHub's search matches words in titles, bodies, and comments.
- `in:title,body` leaves comments out.
- Put a phrase in double quotes: `--search '"bank file" in:body'`.

## Recently finished, and changes since a date

`<date>` is the date that the owner names. When the owner names no date, it is the date on which the project's Current State was last changed.

```text
gh issue list -R <repo> --state closed --limit 200 --search 'closed:>=<date>' --json number,title,stateReason,closedAt
gh issue list -R <repo> --state all --limit 200 --search 'updated:>=<date>' --json number,title,state,updatedAt
```

An issue that was updated since that date and has no matching Recent History row was likely changed by the owner in the browser. Name that issue to the owner.

## Issues without the layout

An issue without the layout is an open issue with no `## Overview`, or without exactly one state label. Most often it is an issue that the owner opened in the browser. This command lists such issues:

```text
gh issue list -R <repo> --state open --limit 200 --json number,title,labels,body --jq '.[] | select((.body // "") | startswith("## Project tasks") | not) | select((.body | contains("## Overview") | not) or ([.labels[].name | select(startswith("state:"))] | length != 1)) | "#\(.number)\t\(.title)"'
```

Tell the owner about each issue that the command lists.

- When the issue has no `## Overview` or no state label, offer to add the layout. `work-tracker-issue-layout.md`, section "An issue made by hand", gives the steps.
- When the issue has two or more state labels, follow `work-tracker-labels.md`, section "A label the owner changed by hand".
