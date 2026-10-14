# The sign-in of `gh` for work items in GitHub Issues

This file says how to check that the GitHub command-line tool, `gh`, is installed and signed in, and what to ask the owner for when it is not. Step 2 of [github-work-items-setup.md](../github-work-items-setup.md) uses it.

Run `gh auth status`.

- When `gh` is not installed, ask the owner before you install it, because installing it changes the owner's computer. After the owner's yes, follow [GitHub CLI installation](https://github.com/cli/cli#installation) for the owner's operating system.
- When no one is signed in, ask the owner to run `gh auth login` in the owner's own terminal.
- When the `repo` scope is missing, ask the owner to run `gh auth refresh -s repo`.

Then wait for the owner. The interview goes on while the owner signs in, and steps 6 to 10 of the setup file wait until `gh auth status` shows the owner's account with the `repo` scope.

[files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md](../files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md), "The tool and the sign-in", says what `gh auth status` prints and what you never ask the owner for.
