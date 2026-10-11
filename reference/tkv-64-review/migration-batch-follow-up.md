# Migration batch approval follow-up

Mike approved one authorization for a reviewed batch of memory or work-item migrations and its confirmed destination on October 11, 2026. The answer is “Allow approval for a reviewed batch (Recommended)”, recorded in TKV-64 Q-10 in [the work item](https://app.notion.com/p/3f5b381da17680d8baddef8a6de49b5d).

Version 0.9.50 includes this policy and the previously reviewed sourced-decision follow-up. Mike approved committing and merging the combined follow-ups on October 11, 2026.

## What changed

- `project-setup/reference/update.md` previews the named records, destination and transfer limitations, then reuses a single approval for those listed moves. It preserves originals, verifies every moved record and records successes or failures so another session can resume without duplicates. Scope or destination changes require another approval.
- Still-current information from an old Current State file is mapped in the migration preview. A confirmed mapping uses the same batch approval.
- Shared Notion setup guidance recognizes an approved migration batch that explicitly names the destination Projects database and listed writes. A generic approval to make pages still leaves an unspecified destination unapproved.

## Review situations

A reviewed batch with a confirmed destination may proceed without an approval for each record. A newly discovered record or changed destination needs a new approval before that change proceeds. A failed move keeps its original and is reported accurately; a retry uses the recorded result to avoid duplicate creation. A generic request to move memory does not approve an unknown destination. Unlisted deletion of original records remains forbidden.

## Verification

Claude marketplace/plugin validation, whitespace checks, nine tracker/memory assemblies, required links, front matter/settings parsing and scratch Codex 0.9.50 installation passed. Independent review found a redundant destination question when multiple Notion databases were visible; the question and matching setup route were corrected and reread. The final review found no actionable issues. Official guidance checked October 11: [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), and [Anthropic skill authoring](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

No live records were moved, no installed projects were updated, and no host settings changed. This review checks guidance and package integrity; it does not claim a successful live migration. Unrelated edits and untracked files remain separate.
