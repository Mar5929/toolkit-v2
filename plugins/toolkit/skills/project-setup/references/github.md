# GitHub Issues

Purpose: what setup does when work items live in GitHub Issues. The
`github-work-track` skill holds the steps; setup follows them.

Open the project's own copy of the skill,
`.claude/skills/github-work-track/SKILL.md`, follow its References table to
`references/setup.md`, and follow "A new project": the sign-in, the
repository, the "Toolkit settings" line, the labels, and its checks. In an
update, use the copy in your update worktree.

- Ask for the sign-in right after the plan is approved, so the owner can run
  `gh auth login` while you copy files. Never ask him for a token.
- `gh` not installed: installing it changes his computer. After his yes:
  `brew install gh`.
- The plan he approved covers the labels, and a new repository, only when
  it named them. Anything else in GitHub needs its own yes.
- A new repository that also holds this project's code: create it private
  and connected to this folder in one step, after his yes:

  ```text
  gh repo create <owner>/<name> --private --source . --remote origin
  ```

  Never make a public repository unless he asks in his own words. Never
  push until he says yes to the push question after the setup commit
  ("Push <default> to <owner>/<repo>?", `finishing.md`, "The commit offer").
