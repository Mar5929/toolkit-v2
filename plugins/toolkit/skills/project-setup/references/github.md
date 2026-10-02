# GitHub Issues

Purpose: the GitHub steps setup runs when work items live in GitHub Issues,
for a new project and for bringing a project up to date. `gh-commands.md`,
`labels.md`, and `searching.md` are in the GitHub `tracking-work-items`
skill, `assets/.skill-sets/github-work/tracking-work-items/references/` in
this skill.

## Contents

- Before you start
- A new project
- Recording the repository in PROJECT.md
- Bringing a project up to date
- Checks after either

## Before you start

- Ask for the sign-in right after the plan is approved, so the owner can run
  `gh auth login` while you copy files. Never ask him for a token.
- `gh` not installed: installing it changes his computer. After his yes:
  `brew install gh`.
- The plan he approved covers the labels, and a new repository, only when
  it named them. Anything else in GitHub needs its own yes.

## A new project

1. **Sign-in.** Run `gh auth status`. No one signed in: ask the owner to
   run `gh auth login` in his own terminal. No `repo` scope: ask him to run
   `gh auth refresh -s repo`. Then wait (`gh-commands.md`, "The tool and
   the sign-in").
2. **The repository.** Ask which repository holds the work items, with a
   recommendation: the project's own repository, which
   `git remote get-url origin` shows. Use only the name he confirms. Check
   it:

   ```text
   gh repo view <repo> --json nameWithOwner,visibility,hasIssuesEnabled
   ```

   - It does not exist: ask the owner. Never create a repository without
     his yes. After his yes, when it will also hold this project's code
     (the usual case), create it private and connected to this folder in
     one step:

     ```text
     gh repo create <owner>/<name> --private --source . --remote origin
     ```

     Only when it holds the issues alone: `gh repo create <repo> --private`.
     Never make a public repository unless he asks in his own words. Do not
     push in this step: never push until he says yes to the push question
     after the setup commit ("Push <default> to <owner>/<repo>?",
     `finishing.md`, "The commit offer"), where <default> is the branch the
     setup commit is on.
   - `hasIssuesEnabled` is false: ask him before turning issues on
     (`gh repo edit <repo> --enable-issues`).
3. **Record it** in `PROJECT.md` (below).
4. **Labels.** Create the missing ones after his yes (`labels.md`,
   "Creating the labels").
5. **Check** (below). Tell the owner in one or two lines: where items live
   (the repository's Issues page), that each item is one issue with its
   State and approvals as labels, and that he may edit issues, labels, and
   sub-issues in the browser; the agent notices and carries on.

## Recording the repository in PROJECT.md

`PROJECT.md`, section "Toolkit settings":

```markdown
- Tracker: `github`
- GitHub repository: `Mar5929/ios-money-log`
```

Nothing else is recorded. The labels are the same in every project.

## Bringing a project up to date

When the owner says "update the toolkit", after the newer skill files are
copied in:

1. Run `gh auth status` and read `<repo>`.
2. List the labels and compare with `labels.md`, "The full list". Ask
   before creating the missing ones; never change, rename, or delete an
   existing label.
3. A project set up before toolkit 0.6.0 has `stage:` labels. Once the
   `state:` labels exist, move each open issue to its State as `update.md`,
   "Work items from Stage to State", says: add its `state:` label, then
   remove its `stage:` label from the issue. The `stage:` labels stay in
   the repository. Tell the owner he may delete them himself on its Labels
   page.
4. List the open issues without the layout (`searching.md`, "Issues
   without the layout"). An issue made from an older template keeps its
   text. Add a missing section heading only after the owner's yes, and
   never rewrite his text.

## Checks after either

- `gh auth status` shows the owner's account with the `repo` scope.
- `gh repo view <repo>` answers, and issues are on.
- Every one of the 30 labels in `labels.md`, "The full list", exists: list
  them (`labels.md`, "Creating the labels", step 1) and compare name by
  name.
- `PROJECT.md` names the repository under "Toolkit settings".
