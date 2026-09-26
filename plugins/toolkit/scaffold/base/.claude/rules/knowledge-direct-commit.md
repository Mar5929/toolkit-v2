---
paths:
  - "requirements/**"
  - "PROJECT-ROADMAP.md"
  - "PROJECT.md"
  - "DECISIONS.md"
  - "docs/**"
  - "ai-external-knowledge/**"
  - "**/README.md"
<!-- if salesforce -->
  - "delivery/**"
<!-- endif -->
---
# Publish Documentation from an Isolated Workspace

- In a Git repository, prepare each authorized documentation-only save in its own temporary Git worktree. Publish its commit directly to the default branch without a pull request.
- Rules, skills, hooks, prompts, settings, and code use a worktree and a pull request, even when written in Markdown.
- Saving a document does not approve its requirements or its build.
- Stage only this save's files, by name, in its worktree. Read the full staged diff.
- Never force-push or change another session's checkout. Resolve a remote advance in this save's worktree.
- An unpushed commit is unfinished. Verify the complete save reached the remote.
- Steps, checks, and recovery: the `publish-docs` skill.

- `.memory/` and `.work-items/` are local and Git-ignored. Their changes are never committed, so they do not use this publication route.
