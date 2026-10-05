---
paths:
  - "force-app/**"
  - "tools/kb/**"
---

# Dependency Edge List

Details and limits: `tools/kb/README.md`, section "What this cannot tell you".

## Impact questions

- Answer "what writes, reads, or breaks if this changes" from the edge list, never from memory. Run `python3 tools/kb/build_edges.py`, then `python3 tools/kb/query_graph.py <Object.Field>`. Cite it.
- Never say "nothing writes this field" from the edge list alone. It misses most Apex writes (marked `confidence: low`), runtime-built references, API integrations, and partial retrieves. Name the gap or check another source.

## Keeping the notes current

- If `tools/kb/_drift_pending.md` exists, handle it this session: correct the affected project notes, then delete the file. When they are in project memory, correct them with the memory save skill.
- After a meaningful `force-app/` change, update the written explanation of that metadata in the same session. When it is in project memory, update it with the memory save skill.
- `GRAPH_FRESHNESS=0` turns the Stop hook off. Turn it back on afterwards.
- Never commit `tools/kb/out/`, `tools/kb/_freshness_stamp.json`, or `tools/kb/_drift_pending.md`.

## Org access

- Building and querying never contact an org. Only `pull_org_dependencies.py`, `build_org_catalog.py`, and `compare_dependencies.py` may run, and only `sf data query`.
- Never add an org name to the tool's code. Map aliases in `tools/kb/org-aliases.json`.

## Cross-check results

- When you report a cross-check from `compare_dependencies.py`, give both confirmation rates. They measure Salesforce, not this tool.
