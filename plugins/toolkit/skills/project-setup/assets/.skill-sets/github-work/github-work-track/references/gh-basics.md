<!-- Shared text from the Toolkit V2 repository (dev/build-shared/github/gh-basics.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# gh basics: the commands every step uses

How to read an issue, write its body, change its labels, and work with comments and sub-issues, the same way every time.

## Contents

Names used in the commands, reading one issue or one section, changing the body, labels, comments, sub-issues, reading many issues.

## Names used in the commands

| Name | Means |
| --- | --- |
| `<repo>` | The "GitHub repository" line in `PROJECT.md`, "Toolkit settings", for example `Mar5929/ios-money-log`. |
| `<number>` | The issue number without `#`: `12` for item `#12`. |
| `<id>` | The issue's number id from the REST API, for example `5638907867`. Only the sub-issue calls need it. |
| `<dir>` | A temporary folder outside the repository, where body and comment files go (`mktemp -d`; in Claude Code, a folder inside the session scratchpad when your system prompt names one). Send every body, and any comment longer than one line, from a file. Remove the folder after you read the result back. |

Run each command on its own. In Codex, ask for escalated permissions for
every `gh` call (`gh-access.md`, "In Codex").

## Reading one issue

```text
gh issue view <number> -R <repo> --json number,title,body,labels,state,stateReason,url,updatedAt
```

- `state` is `OPEN` or `CLOSED`. `stateReason` is `COMPLETED`,
  `NOT_PLANNED`, `DUPLICATE`, or `REOPENED` (empty while open and never
  closed).
- The labels hold the header fields (stage, type, priority, waiting on,
  delivery, approvals).
- The parent, if any: `gh api repos/<repo>/issues/<number>/parent --jq .number`
  ("Sub-issues" below). "No parent issue found" means it is top level.

## Reading one section of the body

```text
gh issue view <number> -R <repo> --json body --jq '("\n" + .body) | split("\n## ") | map(select(startswith("Questions and Answers"))) | .[0]'
```

Change the heading text to read another section (`Overview`, `Roadmap`,
`Tasks`, `Recent History`, `Requirements`, `Notes`). The output starts at
the heading's words, without the `## `.

## Changing the body

The body is one piece of text. To change one part, write the whole body
back with only that part changed.

1. Read it fresh, right before you change it, into the folder:

   ```text
   gh issue view <number> -R <repo> --json body --jq .body > <dir>/body.md
   ```

2. Edit `<dir>/body.md` with your file edit tool: an exact replacement of
   the lines you change. Keep every other line word for word.
3. Write it back:

   ```text
   gh issue edit <number> -R <repo> --body-file <dir>/body.md
   ```

4. Read the changed section back and check it says what you wrote.

The owner may edit the issue in the browser. Reading right before the edit
keeps his change. If he says he was editing at the same time and his text
is gone, GitHub keeps every earlier version of the body: the "edited" menu
at the top of the issue shows them. Put his text back.

## Labels

Add, remove, or swap in one call. Swapping in one call means the issue is
never left with two stage labels or none:

```text
gh issue edit <number> -R <repo> --remove-label 'stage:08-build' --add-label 'stage:09-testing'
gh issue edit <number> -R <repo> --add-label 'waiting-on:owner'
gh issue edit <number> -R <repo> --remove-label 'waiting-on:owner'
```

A label that does not exist in the repository makes the call fail. Ask the
owner before creating one.

## Comments

Add one (the output is its address, ending in `#issuecomment-<comment-id>`):

```text
gh issue comment <number> -R <repo> --body-file <dir>/comment.md
```

A one-line note with no single quote in it may use `--body 'Agent: ...'`
instead of a file.

List every comment, oldest first:

```text
gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | [.id, .created_at, .user.login, (.body | split("\n")[0])] | @tsv'
```

Read one, and edit one in place:

```text
gh api repos/<repo>/issues/comments/<comment-id> --jq .body > <dir>/comment.md
gh api repos/<repo>/issues/comments/<comment-id> -X PATCH -F body=@<dir>/comment.md
```

Comments made through `gh` show the owner's name, because `gh` signs in as
him. Start the agent's notes with "Agent:".

## Sub-issues

The sub-issue calls take the child's number id, not its issue number:

```text
gh api repos/<repo>/issues/<child-number> --jq .id
gh api repos/<repo>/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<id>
gh api repos/<repo>/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<id> -F replace_parent=true
gh api repos/<repo>/issues/<parent-number>/sub_issue -X DELETE -F sub_issue_id=<id>
gh api --paginate repos/<repo>/issues/<parent-number>/sub_issues --jq '.[] | [.number, .state, .title] | @tsv'
gh api repos/<repo>/issues/<number>/parent --jq .number
```

- `-F` (not `-f`) sends the id as a number, which the call requires.
- `replace_parent=true` moves a child that already has a parent.
- The last call fails with "No parent issue found" (HTTP 404) when the
  issue is top level. That is an answer, not an error.
- The remove call ends in `sub_issue`, without the `s`.

## Reading many issues

```text
gh issue list -R <repo> --state open --limit 200 --label 'waiting-on:owner' --json number,title,labels
```

`gh issue list` never returns pull requests. `gh api repos/<repo>/issues` does: use `gh issue list` for lists.
