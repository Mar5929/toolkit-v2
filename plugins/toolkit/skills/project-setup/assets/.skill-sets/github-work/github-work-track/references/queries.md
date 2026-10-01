# Finding work on GitHub: the queries

Purpose: the exact calls that read work items from the project's issues.
They only read. `<repo>` is the "GitHub repository" line in `PROJECT.md`,
"Toolkit settings". Run each command on its own; in Codex, with escalated
permissions (`gh-access.md`).

## One item, a section, a parent

`gh-basics.md` has the commands: "Reading one issue", "Reading one section
of the body", and "Sub-issues". "Could not resolve to an issue" means the
number is wrong or the item is in another repository: tell the owner, and
never make a second issue with the same title.

## The board

Every open issue with its status (taken from the stage label), stage,
priority, waiting-on, title, and Next action, highest priority first:

```text
gh issue list -R <repo> --state open --limit 200 --json number,title,labels,body --jq '
def rank: . as $p | (["priority:urgent","priority:high","priority:medium","priority:low"] | index($p)) // 2;
def status: if . == null then "no stage" else (ltrimstr("stage:") | .[0:2] | tonumber) as $n | if $n <= 2 then "Backlog" elif $n == 3 then "Ready" elif $n <= 11 then "In Progress" else "In Review" end end;
map([.labels[].name] as $l | {number, title,
  stage: ($l | map(select(startswith("stage:"))) | first),
  pri: ($l | map(select(startswith("priority:"))) | first),
  wait: ($l | map(select(startswith("waiting-on:"))) | first),
  next: ((((.body // "") | capture("\\*\\*Next action:\\*\\* (?<n>[^\n]*)") | .n)) // "")})
| sort_by((.pri | rank), .number) | .[]
| ["#\(.number)", (.stage | status), (.stage // "-"), (.pri // "-"), (.wait // "-"), .title, .next] | @tsv'
```

"no stage" is an issue without the layout (see the last query). Leave out
closed issues unless the owner asks.

## Open questions

Rows with Status Open and "Decision needed from" owner, from every open
issue's Questions and Answers. Open rows are at the top of each table,
oldest first:

```text
gh issue list -R <repo> --state open --limit 200 --json number,body --jq '.[] | .number as $n | .body | split("\n")[] | select(test("^\\| *Q-[0-9]+ *\\|")) | select(test("\\| *Open *\\| *owner *\\| *$"; "i")) | "#\($n)\t\(.)"'
```

Report what waits on the owner first (item ID, Q-ID, what it blocks), then what is in progress, then your next step.

## A parent's full tree

Three levels at most. Run it again for each sub-issue to reach the third
level:

```text
gh api --paginate repos/<repo>/issues/<number>/sub_issues --jq '.[] | [.number, .state, ([.labels[].name | select(startswith("stage:"))] | first // "-"), .title] | @tsv'
```

Read the parent's Roadmap for the phase each sub-issue belongs to. A
sub-issue no Roadmap row names goes last, under "No phase". A fourth level:
tell the owner which issue is at level 4.

## Search

```text
gh issue list -R <repo> --state all --limit 200 --search 'bank file in:title,body' --json number,title,state,labels
```

Without `in:`, GitHub's search matches words in titles, bodies, and
comments; `in:title,body` leaves comments out. Quote a phrase:
`--search '"bank file" in:body'`.

## Recently finished, and changes since a date

`<date>` is the date the owner names, or else the "Last updated" date of
the project's Current State.

```text
gh issue list -R <repo> --state closed --limit 200 --search 'closed:>=<date>' --json number,title,stateReason,closedAt
gh issue list -R <repo> --state all --limit 200 --search 'updated:>=<date>' --json number,title,state,updatedAt
```

An issue updated since then with no matching Recent History row was likely
changed by the owner in the browser. Name it.

## Issues without the work item layout

An issue with no `## Overview`, or without exactly one stage label (most
often one the owner opened in the browser):

```text
gh issue list -R <repo> --state open --limit 200 --json number,title,labels,body --jq '.[] | select((.body | contains("## Overview") | not) or ([.labels[].name | select(startswith("stage:"))] | length != 1)) | "#\(.number)\t\(.title)"'
```

Tell the owner. For no `## Overview` or no stage label, offer to add the
layout; for two or more stage labels, ask him which one is right.
