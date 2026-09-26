# Salesforce Delivery Root

This rule owns one thing: which folder holds a Salesforce project's client-work artifacts.

- New projects use `delivery/`.
- A project that already uses `engagement/` keeps it. Do not rename it, move its files, or create a parallel `delivery/` tree.
- Where a rule or skill names a `delivery/` path, use `engagement/` in such a project.
- Lasting memory goes through the `memory-save` skill. Accepted feature behavior goes in `requirements/`; the work tracker owns active requirements and progress. Never create `delivery/knowledge-base/`.
- Documents under `delivery/` are saved like other project documentation: `.claude/rules/knowledge-direct-commit.md` and the `publish-docs` skill. Data files under `delivery/data/` are never committed.
