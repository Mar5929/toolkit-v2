# Running gh: sign-in, the repository, and the commands

How the agent reaches the project's GitHub issues, what only the owner can do, the commands every job uses, and what to do when a call fails.

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

Every step uses `gh`, GitHub's official command-line tool. Use it even when the session also has a GitHub connector, so every change is made and checked the same way.

```text
gh auth status
```

It prints the signed-in account and the scopes. A private repository needs the `repo` scope.

- `gh auth login` opens a browser sign-in. Only the owner can do it. Ask him to run it in his own terminal (GitHub.com, HTTPS, "Login with a web browser"), then wait for him. Nothing can be read or created before it.
- Never ask him for a token, a one-time code, or a password, and never run `gh auth login --with-token`.
- The `repo` scope is missing: ask him to run `gh auth refresh -s repo`.

## Which repository

`<repo>` is the "GitHub repository" line in `PROJECT.md`, "Toolkit settings", written `owner/name`, for example `example-owner/money-log`.

- Pass `-R <repo>` to every `gh issue` and `gh label` command, and write `repos/<repo>/...` in every `gh api` path.
- The line is empty, missing, or `not used`: ask the owner which repository it is, and record it with the project-setup skill. Never guess it from the Git remote.

## In Codex

The Codex sandbox blocks the network and the keychain where `gh` keeps the sign-in, so a `gh` call inside it fails with a network or sign-in error.

- Run each `gh` command on its own, never joined to another by `&&`, `;`, or a pipe. Writing its output to a file with `>` is fine.
- Ask for escalated permissions (`sandbox_permissions` set to `require_escalated`) with a one-line reason, for example "Read issue #12 from GitHub." Codex then asks the owner, unless the project's Codex command rules already let `gh` run outside the sandbox.
- Never loosen the sandbox for the whole session.
- With approvals turned off (`codex exec`), Codex refuses the escalation: show the owner the exact command, ask him to run it in a terminal, and wait for its output.

## Names used in the commands

- `<repo>`: the repository, as above.
- `<number>`: the issue number without `#`: `12` for item `#12`.
- `<id>`: the issue's numeric id from the REST API, for example `5638907867`. Only the sub-issue calls need it.
- `<dir>`: a temporary folder outside the repository, for body and comment files (`mktemp -d`; in Claude Code, a folder inside the session scratchpad when the system prompt names one). Send every body, and any comment longer than one line, from a file. Remove the folder after you read the result back.

## Reading an issue

```text
gh issue view <number> -R <repo> --json number,title,body,labels,state,stateReason,url,updatedAt
```

- `state` is `OPEN` or `CLOSED`. `stateReason` is `COMPLETED`, `NOT_PLANNED`, `DUPLICATE`, or `REOPENED` (empty while open and never closed).
- One section of the body. Change the heading text to read another section; the output starts at the heading's words, without the `## `:

  ```text
  gh issue view <number> -R <repo> --json body --jq '("\n" + .body) | split("\n## ") | map(select(startswith("Questions and Answers"))) | .[0]'
  ```

## Creating an issue

```text
gh issue create -R <repo> --title '<title>' --body-file <dir>/body.md --label 'state:backlog' --label 'type:<type>' --label 'priority:medium'
```

The title is the owner's words, in single quotes (write a single quote inside it as `'\''`). The output is the issue's address; its last part is the number, and the item's ID is `#<number>`.

## Changing the body

The body is one piece of text. To change one part, write the whole body back with only that part changed.

1. Read it fresh, right before you change it, into the folder:

   ```text
   gh issue view <number> -R <repo> --json body --jq .body > <dir>/body.md
   ```

2. Edit `<dir>/body.md` with your file edit tool: an exact replacement of the lines you change. Keep every other line word for word.
3. Write it back:

   ```text
   gh issue edit <number> -R <repo> --body-file <dir>/body.md
   ```

4. Read the changed section back and check it says what you wrote.

The owner may edit the issue in the browser. Reading right before the edit keeps his change. If he says his text is gone, GitHub keeps every earlier version of the body: the "edited" menu at the top of the issue shows them. Put his text back.

## Labels

Add, remove, or swap in one call, so the issue is never left with two state labels or none:

```text
gh issue edit <number> -R <repo> --remove-label 'state:building' --add-label 'state:testing-loop'
gh issue edit <number> -R <repo> --add-label 'waiting-on:owner'
gh issue edit <number> -R <repo> --remove-label 'waiting-on:owner'
```

## Comments

Add one (the output is its address, ending in `#issuecomment-<comment-id>`):

```text
gh issue comment <number> -R <repo> --body-file <dir>/comment.md
```

A one-line note with no single quote in it may use `--body 'Agent: ...'` instead of a file.

List every comment, oldest first:

```text
gh api --paginate repos/<repo>/issues/<number>/comments --jq '.[] | [.id, .created_at, .user.login, (.body | split("\n")[0])] | @tsv'
```

Read one, and edit one in place:

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

- `-F` (not `-f`) sends the id as a number, which the call requires.
- `replace_parent=true` moves a child that already has a parent.
- The remove call ends in `sub_issue`, without the `s`.
- The parent call fails with "No parent issue found" (HTTP 404) when the issue is top level. That is an answer, not an error.
- Count the levels before adding a sub-issue: run the parent call on the new item's parent, then on that issue's parent. A parent that has two ancestors is already at level 3. Do not add a sub-issue to it.

## When a call fails

`gh` exits with 0 on success, 1 on an error, and 4 when no one is signed in. Nothing changed unless the error says otherwise.

| What you see | What it means and what to do |
| --- | --- |
| Exit code 4, "gh auth login" in the message, or HTTP 401 "Bad credentials" | No one is signed in, or the sign-in expired. Ask the owner to run `gh auth login`, then wait. |
| "Could not resolve to a Repository", or HTTP 404 on `repos/<repo>` | The name in `PROJECT.md` is wrong, or this account cannot see the repository. Check `<repo>`. When it is right, ask the owner whether this account has access. |
| "Could not resolve to an issue", or HTTP 404 on one issue | No issue with that number in this repository. Tell the owner. Never make a new issue to replace it. |
| "could not add label: '<name>' not found" | The label does not exist, and the whole `gh issue edit` call fails. Ask the owner before creating it (`labels.md`). |
| HTTP 422, "Validation Failed" | A sub-issue given by number instead of its id, a child that already has a parent, or a body over 65,536 characters. Fix the request and retry once. |

## Limits

- An issue body or one comment holds at most 65,536 characters.
- `gh issue list` returns 30 issues unless `--limit` is given. The commands here use `--limit 200`. When a list returns exactly the limit, double it and run it again, until the list returns fewer issues than the limit.
- `gh api` returns one page of results (30 by default). Add `--paginate` to read every page.
- A parent issue holds at most 100 sub-issues.
- Many writes in a row, such as creating every label at setup, can hit GitHub's secondary rate limit. Wait at least one second between them.
