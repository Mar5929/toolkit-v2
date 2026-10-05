# Client-Work Folder: delivery/ or engagement/

Which folder holds a Salesforce project's client-work files.

- New projects use `delivery/`.
- A project that already uses `engagement/` keeps it. Do not rename it, move its files, or create a parallel `delivery/` tree.
- Where a rule or skill names a `delivery/` path, use `engagement/` in such a project, with the folder names it already has: `engagement/deployment/` for `delivery/deployments/` and `delivery/releases/`, and `engagement/data/` for `delivery/migrations/`.
- Never create `delivery/knowledge-base/`.
