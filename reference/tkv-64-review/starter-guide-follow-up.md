# Starter guide follow-up — October 11, 2026

Version 0.9.47 applies Mike's approved recommendations for the starter project's approval and retrieval guidance. The original content review addressed related authorization and store-routing problems but missed these passages in the root starter guide. This follow-up corrects those omissions and checks the rest of that guide for the same patterns.

## Changes

The guide routes approval to the work-item lifecycle and Project map, recognizes an explicit request or existing approval for the same scope, and asks only for missing authorization. It no longer imposes a blanket sign-in approval prompt. Project purpose and scope changes still require the owner's authorization, now stated in the PROJECT.md row where that file's editing rules belong.

Retrieval uses relevant project records and the configured work tracker and memory store. The fixed DECISIONS.md, system, work-item reading order and local-only search paths are removed. Before reporting no record exists, the agent searches the relevant stores.

The same review corrected unconditional local-memory/Current State assumptions in startup, work-item selection, memory routing, status reporting and the Project map's private-folder description. Local and Notion memory use managing-project-memory; Hindsight uses its rule and tools and current tracker records. Local folder ownership rules still apply when those choices are selected.

The lifecycle's actual approval steps, the Project map's protected-file rules, filing ownership, tracker choice and memory retention criteria are preserved. Other unresolved owner-intent questions from the main review remain unchanged.

## Changed files

- [Starter AGENTS.md](../../plugins/toolkit/skills/project-setup/every-project/AGENTS.md)
- [Main review](../tkv-64-content-review.md)
- [Marketplace version](../../.claude-plugin/marketplace.json)
- [Claude Code plugin version](../../plugins/toolkit/.claude-plugin/plugin.json)
- [Codex plugin version](../../plugins/toolkit/.codex-plugin/plugin.json)

The paired CLAUDE.md still imports AGENTS.md. No installed project or owner host configuration was changed. Changes remain uncommitted.

## Verification

Claude marketplace and plugin validation, git diff --check, settings/front matter parsing and nine tracker/memory assemblies passed. Codex accepted 0.9.47 in an isolated scratch home. These checks establish package integrity; they do not prove an agent obeys every instruction during an authenticated session.

Official agent-guide guidance read October 11: [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [Claude Code memory](https://code.claude.com/docs/en/memory). Independent review checked the whole guide against these pages, the repository's harness checklist and clarity standard, and representative authorization and chosen-store workflows. It found no actionable issues. Workflow verification was a document walkthrough; no authenticated host session was run.
