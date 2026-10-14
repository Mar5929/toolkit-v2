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
| 3 | D10, D26 | Changed. Incidental staging words and repeated default-question lead-ins removed; commands and setup approval remain. |
| 3 | D21, D28, D34 | Retained where local storage descriptions or standalone briefs require the detail. State-transition, hierarchy, and helper authorization protections remain explicit. |
| 3 | D20 | Retained. The exact MAIN command remains in the local tracker because its choice needs it independently of local memory. |
| 3 | D46, D47 | Changed. Header/schema tables retain field rules rather than enum restatements; templates and live schemas remain authoritative. |
| 3 | I5, J3, J4 | Changed. Notion helpers get exact ID query and page reads; repeated setup explanation and inert file-link section removed. Setup step ranges adjusted. |
| 3 | D15, J2 | Deferred. No new always-loaded instruction or changed Recent History policy without owner evidence. |

| 4 | E2, E3, E4, E7, E14 | Changed after case review. Folder reconciliation becomes a general parent/list/history procedure. Label reconciliation preserves State/type questions, priority default and hand-made issue routing. Repeated Building offer case merged. Generic permission/retry coaching removed; uncertain-write read-before-retry stays. |
| 4 | E15 | Retained where model preference is helper or other-chat launch context; no extra model policy introduced. |
| 4 | F1, F2, F3, F5, F6 | Changed. Arbitrary reply, slug and prefix sizes removed; labels refer to the complete list; persistent failures use unresolved progress rather than a fix count. Exact IDs, technical service limits and interview sequencing remain. The current Notion property reference gives no two-to-four-letter prefix requirement. |

| 5 | G1, G8 | Changed. Levels/phases/tasks and the small-item short path moved to directly linked on-demand references. Duplicate repository headings became one direct route. All scoped section callers updated. |
| 5 | G6 | Deferred. Template fill-in comments preserve field and authority rules pending Mike's preference; shared and local template copies remain identical. |

| 6 | H2 | Changed. Dense Notion tracking paragraphs and plan conversion/move procedures split into steps with one subject. Live schemas, owner guide lines, protected block types, template/child-page protection and exact relation semantics stay. |
| 6 | J5 | Deferred. Humanizer routing remains until Mike decides whether setup should check it. |

## Requirements preserved

The rewrite preserves owner approvals, exact tracker commands and values, stable IDs, work-item State transitions, owner edits, read-back verification, hierarchy and phase rules, closure protections, standalone helper context, and the local MAIN command.

## Verification

- `git diff --check` passed for each phase and the final change.
- The managing-work-items skill front matter passed name/description checks.
- Scratch assemblies of every-project plus each local, GitHub and Notion tracker passed all Markdown links within the assembled managing-work-items skill. The local memory reference was supplied to resolve the configured memory entry.
- Both work-item and design template copy pairs matched byte for byte.
- All six helper briefs retain their standalone brief and input sections. An initial assertion looked for capitalized "Inputs" rather than the existing "The list of inputs"; the corrected assertion passed.
- The parent supplies independent review, actual scratch host loading, version changes, cross-domain callers, and ticket updates. No live tracker data or host configuration was changed.

## Requirement-preservation inventory

| Requirement | Location after changes |
| --- | --- |
| State/Status map, closure authorization and save-after-step rule | lifecycle-rules.md |
| Existing authorization counts only within its scope; default-branch merge and shared deployment approval | lifecycle-rules.md; deploying.md |
| Stable IDs, depth, parent ownership, project/work-item phases and project task handling | work-levels.md; installed tracker formats and relation procedures |
| Short-path eligibility, combined approval, independent-check exceptions and return to full path | small-work-item.md; testing-loop.md; closing.md |
| Fresh owner edits and save read-back | installed work-tracker.md; reporting-a-save.md |
| Requirement blocks, speaker words/source/date, unanswered-first order and supersession | editing-a-work-item.md; lifecycle-rules.md; installed tracker |
| Independent check of the exact commit/file hash and a new check after change | testing-loop.md; acceptance-checker-brief.md |
| Helper isolation, complete brief, assigned files, no-commit mode and integration review | starting-a-helper.md; building.md; each helper brief |
| Local main-checkout storage, exact MAIN command, immutable identity, non-Git work records and table escaping | local tracker and work-items folder guide |
| GitHub auto-close protection, numeric sub-issue IDs, repository scoping, no destructive record deletion and body/comment limits | GitHub tracker and command/layout references |
| Notion default-template creation, live schema authority, protected blocks/child pages, relation ownership and ID prefix validation | Notion tracker and page/API references |

## Integration dependencies

External callers of lifecycle-rules.md's moved "Levels", "A small work item" and "Starting a helper" sections must point to work-levels.md, small-work-item.md and starting-a-helper.md. Other skills can use reporting-a-save.md for the exact save-result words. No delivered file was removed; existing-project updates copy the added references through the normal update procedure. The shared platform-skill step, interview question policy, template comments, Recent History wording and humanizer setup preference remain owner decisions.

## Independent review correction

The independent reviewer found that extracting the GitHub Requirements procedure had also cut the picture’s closing fence and the issue-creation section. The correction restores the full creation procedure, template cleanup, priority default, labels, parent-depth check and milestone link, and keeps the common editing reference. The corrected file was checked for balanced fences and creation steps before handoff.
