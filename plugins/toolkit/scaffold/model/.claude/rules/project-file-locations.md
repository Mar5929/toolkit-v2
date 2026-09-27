# Where Project Files Go

This rule owns one thing: which folder holds a Salesforce project's client-work artifacts.

- New projects use `delivery/`.
- A project that already uses `engagement/` keeps it. Do not rename it, move its files, or create a parallel `delivery/` tree.
- Where a rule or skill names a `delivery/` path, use `engagement/` in such a project.
- Curated memory goes through the `memory-save` skill; with built-in memory it is in the local `.memory/` folder. Accepted feature behavior goes in `requirements/`; the selected work tracker owns active requirements and progress. Never create `delivery/knowledge-base/`.
