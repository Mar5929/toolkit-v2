<!-- Shared text from the Toolkit V2 repository (dev/build-shared/github/gh-access.md), where it is edited. In a project, never edit this copy: "update the toolkit" replaces it. -->

# Reaching GitHub: sign-in, the repository, Codex, and failures

How the agent reaches the project's GitHub issues, what only the owner can do, and what to do when a call fails.

## The tool

Every step uses `gh`, GitHub's official command-line tool. Use it even
when the session also has a GitHub connector, so every change is made and
checked the same way.

Check that it is ready:

```text
gh auth status
```

It prints the signed-in account and the scopes the sign-in allows. A
private repository needs the `repo` scope.

## Sign-in: always the owner's step

- `gh auth login` opens a browser sign-in. Only the owner can do it. Ask
  him to run it in his own terminal (GitHub.com, HTTPS, "Login with a web
  browser"), then wait for him.
- Never ask him for a token, a one-time code, or a password, and never run
  `gh auth login --with-token`.
- The sign-in is kept in the macOS keychain until he signs out.
- `gh auth status` shows the `repo` scope missing: ask him to run
  `gh auth refresh -s repo`.
- Nothing can be read or created before the sign-in.

## Which repository

`PROJECT.md`, section "Toolkit settings", line "GitHub repository", names it
as `owner/name`, for example `Mar5929/ios-money-log`. In this skill,
`<repo>` means that value.

- Pass `-R <repo>` to every `gh issue` and `gh label` command.
- Write `repos/<repo>/...` in every `gh api` path. Never write
  `{owner}/{repo}`: it takes the repository from the folder's Git remote,
  which can differ in a worktree or a fork.
- The line is empty or missing: ask the owner which repository it is, and
  record it with the project-setup skill. Never guess it from the Git
  remote.

## In Codex

The Codex sandbox blocks the network and the keychain where `gh` keeps the
sign-in, so a `gh` call inside it fails with a network or sign-in error.

- Run each `gh` command on its own, never joined to another command by
  `&&`, `;`, or a pipe. Writing its output to a file with `>` is fine.
- Ask for escalated permissions (`sandbox_permissions` set to
  `require_escalated`) with a one-line reason, for example "Read issue #12
  from GitHub." Codex then asks the owner, unless the project's Codex
  command rules already let `gh` run outside the sandbox.
- Never loosen the sandbox for the whole session.
- With approvals turned off (`codex exec`), Codex refuses the escalation:
  show the owner the exact command, ask him to run it in a terminal, and
  wait for its output.

## When a call fails

`gh` exits with 0 on success, 1 on an error, and 4 when no one is signed
in. Nothing changed unless the error says otherwise.

| What you see | Meaning | What to do |
| --- | --- | --- |
| Exit code 4, or "gh auth login" in the message | No one is signed in. | Ask the owner to run `gh auth login`. Stop and wait. |
| HTTP 401, "Bad credentials" | The sign-in expired or was removed. | The same. |
| "Could not resolve to a Repository", or HTTP 404 on `repos/<repo>` | The name in `PROJECT.md` is wrong, or this account cannot see the repository. | Check `<repo>`. When it is right, ask the owner whether this account has access. |
| "Could not resolve to an issue", or HTTP 404 on one issue | No issue with that number in this repository. | Tell the owner. Never make a new issue to replace it. |
| "could not add label: '<name>' not found" | The label does not exist in the repository. | Ask the owner before creating it (`references/labels.md` in github-work-track). |
| HTTP 422, "Validation Failed" | The request is wrong: a sub-issue given by number instead of its `id`, a child that already has a parent, or a body over 65,536 characters. | Read the message, fix the request, retry once. |

## Limits

- An issue body or one comment holds at most 65,536 characters.
- `gh issue list` returns 30 issues unless `--limit` is given. The steps
  here use `--limit 200`. When a list returns exactly the limit, double the
  limit and run it again, until the list returns fewer issues than the limit.
- `gh api` returns one page of results (30 by default). Add `--paginate`
  to read every page.
- A parent issue holds at most 100 sub-issues. This project uses at most
  three levels.
- Many writes in a row, such as creating every label at setup, can hit
  GitHub's secondary rate limit. Wait at least one second between those
  writes.
- `gh` cannot attach a file to an issue. GitHub accepts attachments only in
  the browser.
- `gh issue view --json id` gives a text id (`I_kw...`), not the number id
  the sub-issue calls need. Read that one with
  `gh api repos/<repo>/issues/<number> --jq .id`.
