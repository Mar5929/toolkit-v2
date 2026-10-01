# Setting up and updating a project's GitHub tracking

Purpose: the GitHub steps onboarding runs for a new project, and bringing a
project set up earlier up to the current labels.

## Contents

- A new project
- Recording the repository in PROJECT.md
- Bringing a project up to date
- Checks after either

## A new project

The project-setup skill runs these steps after the owner chose GitHub
Issues for work tracking.

1. **Sign-in.** Run `gh auth status`. No one signed in: ask the owner to
   run `gh auth login` in his own terminal. No `repo` scope: ask him to run
   `gh auth refresh -s repo`. Then wait (`gh-access.md`).
2. **The repository.** Ask which repository holds the work items, with a
   recommendation: the project's own repository, which
   `git remote get-url origin` shows. Use only the name he confirms. Check
   it:

   ```text
   gh repo view <repo> --json nameWithOwner,visibility,hasIssuesEnabled
   ```

   - It does not exist: ask the owner. Never create a repository without
     his yes. After his yes, when it will also hold this project's code
     (the usual case):
     `gh repo create <repo> --private --source . --remote origin`. Only
     when it holds the issues alone: `gh repo create <repo> --private`.
     Do not push in this step: the project-setup skill asks the owner
     "Push <default> to <owner>/<repo>?" after the setup commit, where
     <default> is the branch the setup commit is on.
   - `hasIssuesEnabled` is false: ask him before turning issues on
     (`gh repo edit <repo> --enable-issues`).
3. **Record it** in `PROJECT.md` (below).
4. **Labels.** Create the missing ones after his yes (`labels.md`,
   "Creating the labels").
5. **Check** (below). Tell the owner in one or two lines: where items live
   (the repository's Issues page), that each item is one issue with its
   stage and approvals as labels, and that he may edit issues, labels, and
   sub-issues in the browser; the agent notices and carries on.

## Recording the repository in PROJECT.md

`PROJECT.md`, section "Toolkit settings":

```markdown
- Tracker: `github`
- GitHub repository: `Mar5929/ios-money-log`
```

Nothing else is recorded. The labels are the same in every project.

## Bringing a project up to date

When the owner says "update the toolkit", after the project-setup skill
copies the newer skill files in:

1. Run `gh auth status` and read `<repo>`.
2. List the labels and compare with `labels.md`, "The full list". Ask
   before creating the missing ones; never change, rename, or delete an
   existing label.
3. Check the five most recently updated open issues ("Checking an issue"
   in `items.md`). An issue made from an older template keeps its text. Add
   a missing section heading only after the owner's yes, and never rewrite
   his text.

## Checks after either

- `gh auth status` shows the owner's account with the `repo` scope.
- `gh repo view <repo>` answers, and issues are on.
- Every one of the 36 labels in `labels.md`, "The full list", exists: list
  them (`labels.md`, "Creating the labels", step 1) and compare name by
  name.
- `PROJECT.md` names the repository under "Toolkit settings".
