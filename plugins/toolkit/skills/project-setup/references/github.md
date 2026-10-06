# GitHub Issues

This file gives the GitHub steps that setup runs when a project keeps its work items in GitHub Issues, for a new project and for bringing a project up to date. Open it at step 3 of "New project" in `SKILL.md` for the sign-in, at step 7 for the repository and the labels, and when a project with GitHub Issues is updated. Its job is done when every check under "Checks after either" passes.

`work-tracker-gh-commands.md`, `work-tracker-labels.md`, and `work-tracker-searching.md` are the GitHub references added to `managing-work-items`. Their source is `assets/work-github/.claude/skills/managing-work-items/references/` in this skill.

## Contents

- Before you start
- A new project
- Recording the repository in PROJECT.md
- Bringing a project up to date
- Checks after either

## Before you start

- Ask the owner for the sign-in right after the plan is approved, so that the owner can run `gh auth login` while you copy files. Never ask the owner for a token.
- When `gh` is not installed, ask the owner before you install it, because installing it changes the owner's computer. After the owner's yes, run `brew install gh`.
- The plan that the owner approved covers the labels, and a new repository, only when the plan named them. Anything else in GitHub needs a yes of its own from the owner.

## A new project

1. **Sign-in.** Run `gh auth status`.
   - When no one is signed in, ask the owner to run `gh auth login` in the owner's own terminal.
   - When the `repo` scope is missing, ask the owner to run `gh auth refresh -s repo`.
   - Then wait for the owner. `work-tracker-gh-commands.md`, "The tool and the sign-in", says what `gh auth status` prints and what you never ask the owner for.
2. **The repository.** Ask the owner which repository holds the work items, and recommend the project's own repository, which `git remote get-url origin` shows. Use only the name the owner confirms. Check the repository:

   ```text
   gh repo view <repo> --json nameWithOwner,visibility,hasIssuesEnabled
   ```

   - When the repository does not exist, ask the owner. Never create a repository without the owner's yes. After the owner's yes, when the repository will also hold this project's code (the usual case), create it private and connected to this folder in one step:

     ```text
     gh repo create <owner>/<name> --private --source . --remote origin
     ```

     Only when the repository holds the issues alone, create it with `gh repo create <repo> --private`.

     Never make a public repository unless the owner asks for one in the owner's own words.

     Do not push in this step. Never push until the owner says yes to the push question after the setup commit: "Push <default> to <owner>/<repo>?", where <default> is the branch the setup commit is on. `finishing.md`, "The commit offer", says when to ask that question.
   - When `hasIssuesEnabled` is false, ask the owner before you turn issues on (`gh repo edit <repo> --enable-issues`).
3. **Record it** in `PROJECT.md`, as "Recording the repository in PROJECT.md" below shows.
4. **Labels.** Create the missing labels after the owner's yes. `work-tracker-labels.md`, "Creating the labels", gives the question to ask the owner and the commands.
5. **Check.** Run the checks under "Checks after either" below. Then tell the owner these things in one or two lines:
   - where the work items are kept (the repository's Issues page);
   - that each work item is one issue with its State and approvals as labels;
   - that the owner may edit issues, labels, and sub-issues in the browser, and that the agent notices and carries on.

## Recording the repository in PROJECT.md

In `PROJECT.md`, section "Toolkit settings", these two lines hold the choice and the repository. The repository name here is an example:

```markdown
- Tracker: `github`
- GitHub repository: `Mar5929/ios-money-log`
```

Nothing else is recorded. The labels are the same in every project.

## Bringing a project up to date

Do these steps when the owner says "update the toolkit", after the newer skill files are copied in:

1. Run `gh auth status` and read `<repo>`.
2. List the labels and compare them with `work-tracker-labels.md`, "The full list". Ask the owner before you create the missing ones. Never change, rename, or delete an existing label.
3. A project set up before toolkit 0.6.0 has `stage:` labels. Once the `state:` labels exist, move each open issue to its State as `earlier-versions.md`, "Work items from Stage to State", says: add the issue's `state:` label, then remove its `stage:` label from the issue.
   - The `stage:` labels stay in the repository.
   - Tell the owner that the owner may delete them on the repository's Labels page.
4. List the open issues without the layout, with the command in `searching.md`, "Issues without the layout". An issue made from an older template keeps its text. Add a missing section heading only after the owner's yes, and never rewrite the owner's text.

## Checks after either

Run these checks after "A new project" and after "Bringing a project up to date":

- `gh auth status` shows the owner's account with the `repo` scope.
- `gh repo view <repo>` answers, and issues are on.
- Every one of the 30 labels in `work-tracker-labels.md`, "The full list", exists. To check, list the repository's labels with the command in `work-tracker-labels.md`, "Creating the labels", step 1, and compare name by name.
- `PROJECT.md` names the repository under "Toolkit settings".
