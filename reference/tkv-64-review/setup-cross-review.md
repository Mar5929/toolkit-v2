# TKV-64 separate review: project setup

## Method
Read the revised files as a whole and compared tracked files against git HEAD. Reviewed modular relocation against the live toolkit wiki, owner working-process references, root instructions, shared clarity rule, and official Claude Code/Codex skill guidance already retrieved in this session. This is an independent review of setup-agent edits; I did not edit the reviewed files. Scenario walkthroughs below simulate a newly loaded reader rather than running onboarding against external services.

## Findings
1. **Clarify check-mode exceptions everywhere.** reference/finishing.md opening still says check setup runs Final checks “without fixing anything.” reference/update.md Before you start says “Checking the setup changes nothing.” Both conflict with the integrated maintenance exceptions in finishing.md: rebuilding the memory index and restoring missing ignored guides/templates. These are permitted exceptions inherited from the original procedure, not new policy. Replace the blanket statements with routing to the explicit permitted actions.
2. **Avoid a blanket approval requirement in update step 3.** Its new introduction says “Carry out only the changes the owner approves.” The following Ignore files section says add missing ignore lines without a new question, and Toolkit skills retains automatic replacement except file deletions. Change the introduction to qualify changes requiring a fresh answer; otherwise a new reader could stop for every routine addition contrary to the retained process.
3. **Verify ignored as well as untracked private records.** git ls-files catches clean tracked files that the original git status missed. But replacing the latter entirely lets a folder with untracked yet unignored private records pass. The wiki requires work-items/ and memory/ to be Git ignored. Preserve the improved tracking check and add a check that the selected folder or representative template is ignored. This applies to finishing.md, placing-files.md and the local choice checks. Do not treat ls-files alone as proof of ignoring.

## Scenario walkthroughs
| Scenario | New-reader action | Assessment |
| --- | --- | --- |
| New project, local tracker and memory | Read entry, inspect repository/main checkout, copy missing layout, ask ordered interview and choice defaults, copy selected folders, fill confirmed facts, run checks, report owner steps and offer commit. | Preserves source workflow. Exact owner row and interview questions remain in setup-interview.md. |
| Existing project with custom guides | Inspect existing agent files, ask everything versus pick-and-choose, keep originals until diff approval, merge on branch, preserve old records. | Preserves owner control and project extensions. |
| Resume incomplete setup | Read recorded answers and diagnose prompts/missing chosen lines/current-state placeholder, continue first unanswered question and choice prerequisites. | Preserves resume behavior. As before, interrupted operational steps after all answers may require reconciliation; no new defect established. |
| Update owner-edited instructions | Build choice-specific copy, compare in worktree and ignored folders in main checkout, use history plus owner uncertainty, show diffs, retain owner fields/edits, merge before ignored-folder writes. | Safeguards remain; blanket step-3 approval wording needs clarification as finding 2 says. |
| Check missing ignored template | Build setup copy, compare, diagnose, restore only listed absent guides/templates with cp -n, retain records/existing files, report restored files, remove copy after using it. | Behavior preserved and clearer in final-checks body; contradictory opening statements remain (finding 1). |
| Mixed Notion tracker and local memory | Select tracker and memory independently; copy shared Notion setup once, shared memory process plus local storage; retain DECISIONS/system/sources in repository. | Choice independence and authoritative records preserved. |
| Local tracker and Hindsight memory | Copy tracker only, Hindsight rule/add-on route, no local memory folder or Current State, use tracker/project tasks for setup follow-up. | Preserves owner wiki choice difference. |
| Private folder not ignored but not tracked | git ls-files prints nothing despite git status listing private records. | Revised check misses accidental-ignore failure (finding 3). |

## Preservation and removals
- setup-interview.md relocates choice comparison and answer-handling detail; exact owner row, optional auto-memory question, owner-confirmed facts, SOUL approval, source reading before roadmap, and independent tracker/memory choices remain.
- setup-problems.md preserves folder-collision approval, Git-root/main-checkout requirements, partial-setup signs, question fallback, unsupported Jira routing, and no alternative-folder workaround.
- Host permissions now follow active session settings rather than claiming Codex always blocks network/files and requiring forbidden escalation. This correction follows actual supported host permission variation and does not weaken active restrictions.
- Automatic global stopping after any failure was replaced by reporting/fixing within existing authorization and waiting only for dependent owner action. This aligns owner autonomy request; no permission was invented.
- update.md integrates old table and its exception appendices into coherent per-kind sections. All substantive commands and safeguards remain, including no-delete owner records, per-owner settings, default-branch timing for ignored folders, changed-choice migration/readback, and no new owner schema behavior.
- Keeping setup copy through post-merge ignored-folder writes fixes premature cleanup and supports the retained update flow.

## Reviewed files
- plugins/toolkit/skills/project-setup/SKILL.md
- plugins/toolkit/skills/project-setup/reference/update.md
- plugins/toolkit/skills/project-setup/reference/finishing.md
- plugins/toolkit/skills/project-setup/reference/placing-files.md
- plugins/toolkit/skills/project-setup/reference/setup-interview.md
- plugins/toolkit/skills/project-setup/reference/setup-problems.md
- plugins/toolkit/skills/project-setup/choices/memory/local/local-memory-setup.md
- plugins/toolkit/skills/project-setup/choices/work-items/local/local-work-items-setup.md

## Re-review of fixes

Re-read finishing.md opening, update.md Before you start and step-3 introduction, placing-files.md privacy checks, finishing.md checks, and both local choice checks. All three earlier findings are resolved: maintenance exceptions are named in all blanket statements; approval is explicitly limited to changes requiring it; git check-ignore complements git ls-files on real selected-store records. No temporary sample record is created. The selected local-store checks retain mixed-store applicability. No regression found in these fixes.
