# The GitHub repository that holds the work items

This file says which yes of the owner everything that setup makes in GitHub needs, how to check the repository that the owner named, and what to do when the repository does not exist or has issues turned off.

`<repo>` is the name of the repository that the owner confirmed.

## The owner's yes for what setup makes in GitHub

Do the steps in GitHub when the sign-in is done. Before you make anything in GitHub, tell the owner what will be made, and wait for the owner's yes: the work item labels that the repository does not have yet, and a private repository when the project has none. The yes covers only what you named. Anything else in GitHub needs a yes of its own from the owner.

## Check the repository

```text
gh repo view <repo> --json nameWithOwner,visibility,hasIssuesEnabled
```

## When the repository does not exist

When the repository does not exist, ask the owner. Never create a repository without the owner's yes. After the owner's yes, when the repository will also hold this project's code (the usual case), create it private and connected to this folder in one step:

```text
gh repo create <owner>/<name> --private --source . --remote origin
```

Only when the repository holds the issues alone, create it with `gh repo create <repo> --private`.

Never make a public repository unless the owner asks for one in the owner's own words.

Do not push here. Never push until the owner says yes to the push question after the setup commit: "Push <default> to <owner>/<repo>?", where <default> is the default branch. [reference/finishing.md](../../../../reference/finishing.md), "After the commit", says when to ask that question.

## When issues are turned off

When `hasIssuesEnabled` is false, ask the owner before you turn issues on (`gh repo edit <repo> --enable-issues`).
