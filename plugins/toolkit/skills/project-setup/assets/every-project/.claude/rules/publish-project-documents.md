---
paths:
  - "system/**"
  - "PROJECT*.md"
  - "DECISIONS.md"
  - "sources/**"
  - "reference/**"
  - "delivery/**"
  - "tools/**/*.md"
  - "**/README.md"
---

# Publish Project Documents

- Save a change to a document under these paths with the `publish-docs` skill. It holds the steps, the checks, and the recovery, and it reads this file's `paths` list.
- Saving a document does not approve its requirements or its build.
