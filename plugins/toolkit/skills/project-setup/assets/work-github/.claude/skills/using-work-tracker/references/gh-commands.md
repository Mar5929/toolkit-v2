# Running gh: sign-in, the repository, and the commands

This file says how the agent reaches the project's GitHub issues, what only the owner can do, which commands every job uses, and what to do when a call fails. Open it before your first `gh` call in a session, and when a call fails.

## Contents

- The tool and the sign-in
- Which repository
- In Codex
- Names used in the commands
- Reading an issue
- Creating an issue
- Changing the body
- Labels
- Comments
- Closing and reopening
- Sub-issues
- When a call fails
- Limits

## The tool and the sign-in

Every step uses `gh`, GitHub's official command-line tool. Use `gh` even when the session also has a GitHub connector, so that every change is made and checked the same way.

```text
gh auth status
```

This command prints the signed-in account and the scopes. A private repository needs the `repo` scope.

- `gh auth login` opens a sign-in in the browser. Only the owner can do it. Ask the owner to run it in the owner's own terminal (GitHub.com, HTTPS, "Login with a web browser"), and then wait for the owner. Nothing can be read or created before the sign-in.
- Never ask the owner for a token, a one-time code, or a password. Never run `gh auth login --with-token`.
- When the `repo` scope is missing, ask the owner to run `gh auth refresh -s repo`.

## Which repository

`<repo>` is the "GitHub repository" line in `PROJECT.md`, section "Toolkit settings". It is written `owner/name`, for example `example-owner/money-log`.

- Pass `-R <repo>` to every `gh issue` and `gh label` command, and write `repos/<repo>/...` in every `gh api` path.
- When the line is empty, missing, or `not used`, ask the owner which repository it is, and record it with `project-setup`. Never guess the repository from the Git remote.

## In Codex

The Codex sandbox is the closed area where Codex runs commands. It blocks the network, and it blocks the keychain where `gh` keeps the sign-in. So a `gh` call inside the sandbox fails with a network error or a sign-in error.

- Run each `gh` command on its own. Never join it to another command with `&&`, `;`, or a pipe. Writing its output to a file with `>` is fine.
- Ask for escalated permissions (`sandbox_permissions` set to `require_escalated`) with a one-line reason, for example "Read issue #12 from GitHub." Codex then asks the owner, unless the project's Codex command rules already let `gh` run outside the sandbox.
- Never loosen the sandbox for the whole session.
- With approvals turned off (`codex exec`), Codex refuses the escalation. Then show the owner the exact command, ask the owner to run it in a terminal, and wait for its output.

## Names used in the commands

- `<repo>` is the repository, as "Which repository" above says.
- `<number>` is the issue number without `#`: `12` for the work item `#12`.
- `<id>` is the issue's numeric id from the REST API, for example `5638907867`. Only the sub-issue calls need it.
- `<dir>` is a temporary folder outside the repository, for body files and comment files. Make it with `mktemp -d`. In Claude Code, use a folder inside the session scratchpad when the system prompt names one.
  - Send every body from a file, and send any comment that is longer than one line from a file.
  - Remove the folder after you read the result back.

## Reading an issue

```text
gh issue view <number> -R <repo> --json number,title,body,labels,state,stateReason,url,updatedAt
```

- `state` is `OPEN` or `CLOSED`.
- `stateReason` is `COMPLETED`, `NOT_PLANNED`, `DUPLICATE`, or `REOPENED`. It is empty while the issue is open and was never closed.
- The command below reads one section of the body. To read another section, change the heading text in the command. The output starts at the heading's words, without the `## `:

  ```text
  gh issue view <number> -R <repo> --json body --jq '("\n" + .body) | split("\n## ") | map(select(startswith("Questions and Answers"))) | .[0]'
  ```

## Creating an issue

```text
gh issue create -R <repo> --title '<title>' --body-file <dir>/body.md --label 'state:backlog' --label 'type:<type>' --label 'priority:medium'
```

- The title is the owner's words, in single quotes. Write a single quote inside the title as `'\''`.
- The output is the issue's address. The last part of the address is the number, and the work item's ID is `#<number>`.

## Changing the body

The body is one piece of text. To change one part, write the whole body back with only that part changed.

1. Read the body again, right before you change it, into the folder:

   ```text
   gh issue view <number> -R <repo> --json body --jq .body > <dir>/body.md
   ```

2. Edit `<dir>/body.md` with your file edit tool. Make an exact replacement of the lines that you change, and keep every other line word for word.
3. Write the body back:

   ```text
   gh issue edit <number> -R <repo> --body-file <dir>/body.md
   ```

4. Read the changed section back, and check that it says what you wrote.

The owner may edit the issue in the browser. Reading the body right before the edit keeps the owner's change. When the owner says that text of the owner's is gone, put that text back. GitHub keeps every earlier version of the body, and the "edited" menu at the top of the issue shows them.

## Labels

Add, remove, or swap labels in one call, so that the issue is never left with two state labels or with none:

```text
gh issue edit <number> -R <repo> --remove-label 'state:building' --add-label 'state:testing-loop'
gh issue edit <number> -R <repo> --add-label 'waiting-on:owner'
gh issue edit <number> -R <repo> --remove-label 'waiting-on:owner'
```

## Comments

This command adds a comment. Its output is the comment's address, which ends in `#issuecomment-<comment-id>`:

```text
gh issue comment <number> -R <repo> --body-file <dir>/comment.md
```

A one-line note with no single quote in it may use `--body 'Agent: ...'` in place of a file.

This command lists every comment, oldest first:

```text
gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | [.id, .created_at, .user.login, (.body | split("\n")[0])] | @tsv'
```

The first command below reads one comment, and the second edits one comment in place:

```text
gh api repos/<repo>/issues/comments/<comment-id> --jq .body > <dir>/comment.md
gh api repos/<repo>/issues/comments/<comment-id> -X PATCH -F body=@<dir>/comment.md
```

## Closing and reopening

```text
gh issue close <number> -R <repo> --reason completed
gh issue close <number> -R <repo> --reason 'not planned'
gh issue reopen <number> -R <repo>
```

The state label stays as it was. Read back `state` and `stateReason`.

## Sub-issues

The calls take the child's numeric id, not its issue number:

```text
gh api repos/<repo>/issues/<child-number> --jq .id
gh api repos/<repo>/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<id>
gh api repos/<repo>/issues/<parent-number>/sub_issues -X POST -F sub_issue_id=<id> -F replace_parent=true
gh api repos/<repo>/issues/<parent-number>/sub_issue -X DELETE -F sub_issue_id=<id>
gh api --paginate repos/<repo>/issues/<parent-number>/sub_issues --jq '.[] | [.number, .state, .title] | @tsv'
gh api repos/<repo>/issues/<number>/parent --jq .number
```

- Use `-F`, not `-f`. `-F` sends the id as a number, which the call requires.
- `replace_parent=true` moves a child that already has a parent.
- The call that removes a sub-issue ends in `sub_issue`, without the `s`.
- The parent call fails with "No parent issue found" (HTTP 404) when the issue is top-level. That reply tells you that the issue has no parent. Do not treat the reply as an error.
- Count the levels before you add a sub-issue. Run the parent call on the new work item's parent, and then on that issue's parent. A parent that has two ancestors is already at level 3. Do not add a sub-issue to it.

## When a call fails

`gh` exits with 0 on success, with 1 on an error, and with 4 when no one is signed in. Nothing changed unless the error says otherwise.

| What you see | What it means and what to do |
| --- | --- |
| Exit code 4, "gh auth login" in the message, or HTTP 401 "Bad credentials" | No one is signed in, or the sign-in expired. Ask the owner to run `gh auth login`, and then wait. |
| "Could not resolve to a Repository", or HTTP 404 on `repos/<repo>` | The name in `PROJECT.md` is wrong, or this account cannot see the repository. Check `<repo>`. When `<repo>` is right, ask the owner whether this account has access. |
| "Could not resolve to an issue", or HTTP 404 on one issue | This repository has no issue with that number. Tell the owner. Never make a new issue to replace it. |
| "could not add label: '<name>' not found" | The label does not exist, and the whole `gh issue edit` call fails. Ask the owner before you create the label. `labels.md` says how to create it. |
| HTTP 422, "Validation Failed" | The request is not valid: a sub-issue was given by its number instead of its id, a child already has a parent, or a body is over 65,536 characters. Fix the request, and retry once. |

## Limits

- An issue body or one comment holds at most 65,536 characters.
- `gh issue list` returns 30 issues unless `--limit` is given. The commands in this skill use `--limit 200`. When a list returns exactly the limit, double the limit and run the command again. Repeat until the list returns fewer issues than the limit.
- `gh api` returns one page of results, which is 30 by default. Add `--paginate` to read every page.
- A parent issue holds at most 100 sub-issues.
- Many writes in a row, such as creating every label at setup, can hit GitHub's secondary rate limit. Wait at least one second between them.
