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

## Requirements preserved

The rewrite preserves owner approvals, exact tracker commands and values, stable IDs, work-item State transitions, owner edits, read-back verification, hierarchy and phase rules, closure protections, standalone helper context, and the local MAIN command.

## Verification

Each phase runs `git diff --check`. Structural and link checks run on the finished work-tracking scope. The parent supplies independent review, scratch host checks, version changes, cross-domain callers, and ticket updates.
