# How the toolkit sets up GitHub Issues work items by default

This file holds how the toolkit sets up work items in GitHub Issues when the owner changes nothing. Step 1 of [github-work-items-setup.md](../github-work-items-setup.md) uses it.

- Each work item is one issue in a GitHub repository. Its ID is its issue number, such as `#12`.
- A work item's State, type, priority, and the owner's approvals are labels on the issue. Setup creates the labels that the repository does not have yet, after the owner's yes.
- The project's phases are milestones of the repository.
- The owner may edit issues, labels, and sub-issues in the browser, and the agent notices and carries on.
- The agent reaches GitHub with the GitHub command-line tool, `gh`, which the owner signs in.
