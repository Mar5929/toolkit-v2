# Recover a documentation save without losing work

Purpose: what to do when `publish-docs.mjs start` or `publish` stops, a push
is refused, or the default branch moved on during the save.

Codex: each Git command here (`git fetch`, `git rebase`, `git checkout`,
`git add`, `git -c core.editor=true rebase --continue`) and each `toolkit`
command runs alone, with `sandbox_permissions` set to `require_escalated` and
a one-line reason (`git-rules.md` in this folder, "Git writes in Codex").

## The default branch advanced

The push was refused, or `publish` reports the remote is ahead.

1. Stay in this save workspace. Never touch another checkout.
2. Bring the save workspace current. With a remote:

   ```text
   git fetch origin
   git rebase origin/<default-branch>
   ```

   With no remote, rebase onto the local branch instead:

   ```text
   git rebase <default-branch>
   ```

3. The save touches `ai-external-knowledge/`: regenerate the index there and
   stage it again.

   ```text
   toolkit index knowledge
   ```

4. Run the checks for the changed documents again.
5. Run `publish` again:

   ```text
   node <this skill's folder>/scripts/publish-docs.mjs publish --message '<plain commit message>'
   ```

Ask the owner only when the meaning of the change, or who approved it, has
changed.

## Both sides added `DECISIONS.md` rows

The rebase above stops on a conflict in `DECISIONS.md`, because both sides
took the same next id. In the save workspace:

1. Take the remote's `DECISIONS.md` (with no remote, use the local
   `<default-branch>` in place of `origin/<default-branch>`):

   ```text
   git checkout origin/<default-branch> -- DECISIONS.md
   ```

2. Run `toolkit decision add` again for each of this save's rows, so each gets
   the next free id:

   ```text
   toolkit decision add --decision '<decision>' --why '<why>' --by '<who>'
   ```

3. Stage `DECISIONS.md` by name, then finish the rebase without opening an
   editor:

   ```text
   git add DECISIONS.md
   git -c core.editor=true rebase --continue
   ```

4. Run `publish` again. Never renumber the other rows.

## A save that cannot finish now

A refused push, an account mismatch, a login prompt, a protected branch, a
conflict, or a failed check:

- Report separately what is written, checked, committed, and published.
- Keep the save workspace and any commit id.
- Write the exact next action into the work item or the handoff.

An unpushed commit is unfinished work, not a finished save.

## The repository has remotes, but none named `origin`

`start` stops, names the remotes, and makes nothing. The script fetches and
pushes `origin` only. Ask the owner which remote holds the default branch.
Rename it to `origin` only with his yes.

## Never do these

- Force-push, bypass branch protection, or retry through another account.
- Reset, or stash another session's work.
- Delete another session's save workspace.
- Reuse a save workspace for anything other than a follow-up save to the same
  files that is still pending in this task.
