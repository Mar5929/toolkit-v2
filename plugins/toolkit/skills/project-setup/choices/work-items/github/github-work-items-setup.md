# Work items in GitHub Issues

Open this file when the owner answers "GitHub Issues" to question 5 of `SKILL.md`, and when a project with GitHub Issues is updated. It gives the default to tell the owner, the questions to ask, what the choice adds to the project, the steps in GitHub, and what the choice needs at the finish.

The job is done when every check under "Checks" passes.

`work-tracker-gh-commands.md`, `work-tracker-labels.md`, and `work-tracker-searching.md` are three of the files that this choice adds inside the project's `managing-work-items` skill. Their source is `choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/` in this skill.

## Contents

- What the toolkit sets up by default
- Questions for the owner
- What this choice adds to the project
- Outside the project folder
- At the finish
- Bringing a project up to date
- Checks

## What the toolkit sets up by default

Tell the owner this in a few plain lines, and ask whether it is what the owner wants.

- Each work item is one issue in a GitHub repository. Its ID is its issue number, such as `#12`.
- A work item's State, type, priority, and the owner's approvals are labels on the issue. Setup creates the labels that the repository does not have yet, after the owner's yes.
- The project's phases are milestones of the repository.
- The owner may edit issues, labels, and sub-issues in the browser, and the agent notices and carries on.
- The agent reaches GitHub with the GitHub command-line tool, `gh`, which the owner signs in.

## Questions for the owner

Ask them at the points that "Outside the project folder" gives.

- **Which repository holds the work items.**
- **Whether to create the repository**, when it does not exist.

Ask the owner for the sign-in as soon as the owner picks GitHub Issues, so that the owner can run `gh auth login` while the interview goes on. Never ask the owner for a token.

## What this choice adds to the project

| Kind | What it adds |
| --- | --- |
| Files inside a skill | Copy `choices/work-items/github/files-to-add/` into the project. It adds six files on how a work item is kept as an issue inside `managing-work-items`, which every project has. `references/work-tracker.md` is the one that the skill opens first. |
| Settings | Nothing. |
| `PROJECT.md`, "Toolkit settings" | Write `github` on the Tracker line. Add the line `- GitHub repository:` below the Memory line, with the repository's name, as the example below shows. |

The repository name here is an example:

```markdown
- Tracker: `github`
- GitHub repository: `Mar5929/ios-money-log`
```

Nothing else is recorded. The labels are the same in every project.

## Outside the project folder

Do these steps when the sign-in is done. Before you make anything in GitHub, tell the owner what will be made, and wait for the owner's yes: the work item labels that the repository does not have yet, and a private repository when the project has none. The yes covers only what you named. Anything else in GitHub needs a yes of its own from the owner.

1. **Sign-in.** Run `gh auth status`.
   - When `gh` is not installed, ask the owner before you install it, because installing it changes the owner's computer. After the owner's yes, run `brew install gh`.
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

     Do not push in this step. Never push until the owner says yes to the push question after the setup commit: "Push <default> to <owner>/<repo>?", where <default> is the default branch. `reference/finishing.md`, "The commit offer", says when to ask that question.
   - When `hasIssuesEnabled` is false, ask the owner before you turn issues on (`gh repo edit <repo> --enable-issues`).
3. **Record it** in `PROJECT.md`, as "What this choice adds to the project" above shows.
4. **Labels.** Create the missing labels after the owner's yes. `work-tracker-labels.md`, "Creating the labels", gives the question to ask the owner and the commands.
5. **Check.** Run the checks under "Checks" below. Then tell the owner these things in one or two lines:
   - where the work items are kept (the repository's Issues page);
   - that each work item is one issue with its State and approvals as labels;
   - that the owner may edit issues, labels, and sub-issues in the browser, and that the agent notices and carries on.

## At the finish

- **The roadmap.** Write the project's phases from question 12 as milestones of the repository. The project's `managing-work-items` skill says how, in `references/work-tracker-project-roadmap-and-tasks.md`.
- **Check.** Run the checks under "Checks" below.
- **The push.** After the setup commit, ask the push question that `reference/finishing.md`, "The commit offer", gives.
- **The owner's own step.** Run `gh auth login` in a terminal, when `gh auth status` shows no sign-in.

## Bringing a project up to date

Do these steps when the owner says "update the toolkit", after the newer skill files are copied in:

1. Run `gh auth status` and read `<repo>`.
2. List the labels and compare them with `work-tracker-labels.md`, "The full list". Ask the owner before you create the missing ones. Never change, rename, or delete an existing label.
3. List the open issues without the layout, with the command in `work-tracker-searching.md`, "Issues without the layout". An issue made from an older template keeps its text. Add a missing section heading only after the owner's yes, and never rewrite the owner's text.

## Checks

Run these checks after the steps under "Outside the project folder" and after "Bringing a project up to date":

- `gh auth status` shows the owner's account with the `repo` scope.
- `gh repo view <repo>` answers, and issues are on.
- Every one of the 30 labels in `work-tracker-labels.md`, "The full list", exists. To check, list the repository's labels with the command in `work-tracker-labels.md`, "Creating the labels", step 1, and compare name by name.
- `PROJECT.md` names the repository under "Toolkit settings".
