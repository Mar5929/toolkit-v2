# Finding work on GitHub

The calls that read work items from the project's issues. They only read. Run each command on its own; in Codex, with escalated permissions (`gh-commands.md`).

## Contents

- One item, a section, a parent
- By state
- The board
- What waits on the owner
- A parent's full tree
- Search
- Recently finished, and changes since a date
- Issues without the layout

## One item, a section, a parent

`gh-commands.md` has the commands: "Reading an issue" and "Sub-issues".

## By state

```text
gh issue list -R <repo> --state open --label 'state:building' --limit 200 --json number,title,labels
```

Done and Cancelled are closed issues: add `--state closed`, and read `stateReason` (`COMPLETED` is Done, `NOT_PLANNED` or `DUPLICATE` is Cancelled).

## The board

Every open issue with its state, priority, waiting-on label, title, and Next action, highest priority first:

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

"no state" is an issue without the layout (see the last query), or the "Project tasks" issue, whose body starts with `## Project tasks`: it is not a work item, so leave it out. Leave out closed issues unless the owner asks.

## What waits on the owner

The issues that wait on him:

```text
gh issue list -R <repo> --state open --limit 200 --label 'waiting-on:owner' --json number,title
```

The questions he has not answered: rows with Status Open and "Decision needed from" owner, from every open issue's Questions and Answers. Open rows are at the top of each table, oldest first:

```text
gh issue list -R <repo> --state open --limit 200 --json number,body --jq '.[] | .number as $n | .body | split("\n")[] | select(test("^\\| *Q-[0-9]+ *\\|")) | select(test("\\| *Open *\\| *owner *\\| *$"; "i")) | "#\($n)\t\(.)"'
```

## A parent's full tree

Three levels at most. Run it again for each sub-issue to reach the third level:

```text
gh api --paginate repos/<repo>/issues/<number>/sub_issues --jq '.[] | [.number, .state, ([.labels[].name | select(startswith("state:"))] | first // "-"), .title] | @tsv'
```

For a top-level parent, read its Roadmap for the phase each sub-issue belongs to; a sub-issue no Roadmap row names goes last, under "No phase". A level-2 parent has no Roadmap: its `**Sub-items:**` line lists its sub-issues. The project's phases and its project tasks: `project-roadmap-and-tasks.md`. A fourth level: tell the owner which issue is at level 4.

## Search

```text
gh issue list -R <repo> --state all --limit 200 --search 'bank file in:title,body' --json number,title,state,labels
```

Without `in:`, GitHub's search matches words in titles, bodies, and comments. `in:title,body` leaves comments out. Quote a phrase: `--search '"bank file" in:body'`.

## Recently finished, and changes since a date

`<date>` is the date the owner names, or else the "Last updated" date of the project's Current State.

```text
gh issue list -R <repo> --state closed --limit 200 --search 'closed:>=<date>' --json number,title,stateReason,closedAt
gh issue list -R <repo> --state all --limit 200 --search 'updated:>=<date>' --json number,title,state,updatedAt
```

An issue updated since then with no matching Recent History row was likely changed by the owner in the browser. Name it.

## Issues without the layout

An open issue with no `## Overview`, or without exactly one state label (most often one the owner opened in the browser):

```text
gh issue list -R <repo> --state open --limit 200 --json number,title,labels,body --jq '.[] | select((.body // "") | startswith("## Project tasks") | not) | select((.body | contains("## Overview") | not) or ([.labels[].name | select(startswith("state:"))] | length != 1)) | "#\(.number)\t\(.title)"'
```

Tell the owner. For no `## Overview` or no state label, offer to add the layout (`issue-layout.md`, "An issue made by hand"). For two or more state labels, see `labels.md`, "A label the owner changed by hand".
