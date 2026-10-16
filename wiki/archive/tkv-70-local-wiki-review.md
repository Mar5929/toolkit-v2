# TKV-70: local wiki layout review

Toolkit 0.9.63 implements Mike's approved five-folder map on `codex/tkv-70-local-wiki`, based on `f69b2175` (0.9.62). This report records the reviewed branch, not an installed-project migration. The shared main checkout and other sessions' worktrees were left untouched.

## Approved map

| Scope | Previous home | New home |
| --- | --- | --- |
| Delivered starter | `system/` | `wiki/product-wiki/` |
| Delivered starter | `reference/` | `wiki/reference/` |
| Toolkit repository | `toolkit-wiki/` | `wiki/product-wiki/` |
| Toolkit repository | `reference/` | `wiki/reference/` |
| Toolkit repository | `ai-external-knowledge/` | `wiki/reference/outside-docs/` |

Mike agreed the prompt, authorized execution with a team, then selected “Use this map (Recommended)” on October 11, 2026. [TKV-70](https://app.notion.com/p/3f6b381da176818bb772d9209a9bee5c) owns the requirements, decisions, current status and approval history. Its related TKV-62 chat was read without messaging it. Its latest landed 0.9.62 changes are part of this branch's baseline.

## What changed

The record folders moved without changing their purposes or storage choices. Project maps, guides, publishing paths, template pointers, setup checks and authored relative links now use the new paths. Setup-only `reference/` folders and skill `references/` remain in place. Existing numbered-rule, approval, promotion, glossary and memory policies remain intact. Captured outside documentation remains unchanged, including its provenance records. Obsidian remains a repository-root vault; specification filenames and basename wikilinks remain unchanged.

The new [local wiki layout procedure](../../plugins/toolkit/skills/project-setup/reference/local-wiki-layout.md) reviews existing populated documents before copying templates. It handles recoverable originals, customized guides, existing destination content, concurrent work, relative links, partial completion and ignored-record link corrections after the tracked branch merges. It preserves Notion's verified authority cutover and permits retained custom layouts. Path-bearing instructions are adapted to verified retained homes or deferred while migration remains unresolved.

## Verification

- Both `claude plugin validate .` and `claude plugin validate ./plugins/toolkit` passed. `git diff --check` passed.
- All 511 baseline files are retained at their mapped homes. All 158 captured outside-documentation files have identical SHA-256 hashes. Source captures were not rewritten.
- All 594 previously valid authored relative-link targets remain present at their mapped destinations. Existing external URLs remain unchanged. Historical snapshots and already unresolved example links were not treated as current routes.
- Nine local/Notion/GitHub tracker by local/Notion/Hindsight memory assemblies passed new wiki paths, selected payload composition, guide pairs, skill symlink and JSON checks. The local-memory/GitHub fixture also passed startup Current State, index generation, Git ignore and ripgrep discovery checks.
- Shared and local work-item/design template copies remain byte-identical. Existing skill front matter differs only where an approved project path appears in a description. Runtime hooks, host configuration and the local-memory payload are unchanged.
- Codex installed `toolkit@toolkit-v2` 0.9.63 into a scratch home. No owner's host configuration was changed.
- A manual scratch fixture retained a populated architecture document, diagram, custom guide and outside-doc index; verified corrected inbound/outbound links; recovered the original architecture from Git; and preserved it across repeated `rsync --ignore-existing` copying. Separate conflict inspection left both populated records intact.
- Independent review compared content and paths, authority, publication rules, migration workflows and link targets. Findings about setup resource paths, collision routes and retained-layout operational instructions were corrected and reread. Final verdict: no unresolved findings.
- The [visual report](tkv-70-local-wiki-report.html) was inspected in the browser at desktop and 320px widths. Both scope tabs worked, and mobile DOM width checks showed no horizontal overflow.

Scratch execution scripts were used only for verification and are not shipped. The manual migration fixture demonstrates the described filesystem operations, not an automated migration program. No installed project, Notion template, live service, schedule, ignored owner record or host configuration was migrated. Full live setup/update, external tracker workflows and interactive host loading were not tested.

## Broader findings for follow-up

Mike chose local layout implementation with broader findings, rather than a cross-provider process redesign.

- Local Product Wiki still uses the inherited numbered-rule document form. Consider whether readable feature explanations and diagrams should have a broader form.
- Local promotion criteria emphasize rules used by several work items. Compare this with Notion's finalized Product Wiki documentation so lasting feature behavior is not buried in one ticket.
- Reconcile decision rationale, terminology and current-context ownership across storage choices without creating competing authorities or forcing identical schemas.
- Compare correction, supersession and diagram-maintenance processes across providers. Preserve the distinction between approved intent and verified implementation.
- Local memory remains Git-ignored and computer-local unless separately backed up or shared. A wiki folder move does not change that policy.

## Official guidance used

The harness-writing procedure and its checklist governed both-host guides, skills and references. Official [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude Code skills](https://code.claude.com/docs/en/skills), [Claude Code memory](https://code.claude.com/docs/en/memory) and [Anthropic skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) were opened on October 11, 2026. Existing front matter and guide pairs were retained; no loading mechanism was moved or replaced.
