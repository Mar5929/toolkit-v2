---
paths:
  - "requirements/**"
  - "PROJECT-ROADMAP.md"
  - "PROJECT.md"
  - "DECISIONS.md"
  - "system-guide/**"
  - "tools/permissions/PERMISSIONS-RUNBOOK.md"
  - "ai-external-knowledge/**"
  - "delivery/**"
  - "**/README.md"
---

# Publish Project Documents

Steps, checks, and recovery: the `publish-docs` skill.

- In a copied Git repository, prepare each authorized documentation-only save in its own temporary Git worktree. Publish its commit directly to the default branch without a pull request.
- Saving a document does not approve its requirements or its build.
- Never force-push or change another session's checkout. Resolve a remote advance in this save's worktree.
- An unpushed commit is unfinished. Verify the complete save reached the remote. In a repository with no remote (`git remote` prints nothing), the save is finished when its commit is on the local default branch.
- `.memory/` and `.work-items/` are local and Git-ignored. Their saves do not use this publication route.
