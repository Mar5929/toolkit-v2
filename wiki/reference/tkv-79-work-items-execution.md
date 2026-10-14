# TKV-79 work-item implementation

This record lists the work-tracking changes prepared for independent review. It does not approve a result, merge, deploy, or mark a work item Done.

The changes follow the three current official skill pages read on 2026-10-13: [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), and [skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices). The repository harness-writing checklist and document clarity rule also apply.

## Proposal dispositions

| Phase | IDs | Disposition and preservation |
| --- | --- | --- |
| 1 | A2, A3 | Changed. GitHub ID naming lives in its installed tracker; shared branch and test-plan procedures point there. |
| 1 | A4 | Changed. Shared procedures and helper briefs use environment instead of org. |
| 1 | A5 | Deferred. Keep the general platform-skill step until Mike settles whether it is Salesforce-only. |

| 2 | B6, B9, B10, C9, C13, C15, C16 | Changed. Installation follows GitHub's OS-specific page; repository history dates removed; owner wording is neutral; Notion section pointers target the commands reference; host permission paragraph and misleading heading removed; label question names its missing count. |
| 2 | C14 | Deferred. Preserve the requirements interview's one-question procedure pending Mike's preference against the output style. |

| 3 | D1, D2, D3, D6, D7, D22, D25, D27, D33 | Changed. Repeated definitions and the host permissions paragraph removed; conflicts route to pull-latest; local template route uses the actual local template. Helper briefs keep standalone context. |
| 3 | D16, D17, D19 | Changed with approved alternatives. Save-result words, helper start procedure, and common requirement/question edits have on-demand references linked directly from SKILL.md. Backend format, relations, and API calls stay in choices. |
| 3 | D5, D8, D29, D42 | Changed within scope. Repeated source routing and prompt explanations removed; shared requirement and question procedures extracted. Backend-specific protections remain. |
| 3 | D21, D28, D34 | Retained where local storage descriptions or standalone briefs require the detail. State-transition, hierarchy, and helper authorization protections remain explicit. |
| 3 | D20 | Retained. The exact MAIN command remains in the local tracker because its choice needs it independently of local memory. |
| 3 | D46, D47 | Changed. Header/schema tables retain field rules rather than enum restatements; templates and live schemas remain authoritative. |
| 3 | I5, J3, J4 | Changed. Notion helpers get exact ID query and page reads; repeated setup explanation and inert file-link section removed. Setup step ranges adjusted. |
| 3 | D15, J2 | Deferred. No new always-loaded instruction or changed Recent History policy without owner evidence. |

## Requirements preserved

The rewrite preserves owner approvals, exact tracker commands and values, stable IDs, work-item State transitions, owner edits, read-back verification, hierarchy and phase rules, closure protections, standalone helper context, and the local MAIN command.

## Verification

Each phase runs `git diff --check`. Structural and link checks run on the finished work-tracking scope. The parent supplies independent review, scratch host checks, version changes, cross-domain callers, and ticket updates.
