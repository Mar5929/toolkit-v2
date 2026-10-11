# Local and GitHub workflow review

Read-only source review and scratch payload assembly covered local and GitHub trackers with local and Hindsight memory. All four assemblies contain the expected tracker, lifecycle, filing and handoff procedures. Local assemblies include their memory-store reference; Hindsight assemblies include the Hindsight rule and no local memory skill. Walkthroughs covered setup, status lookup, requirements/design, build/check, completion, filing, handoff and update. These are instruction simulations, not real host sessions or service operations.

## Additional findings

1. **P1 — No-remote sub-item merge targets the wrong branch.** `every-project/.claude/skills/managing-work-items/references/deploying.md:55` prescribes merging every item into the main checkout/default branch. Line 47 requires sub-items to merge into their parent. A local-tracker project without a remote can therefore publish a child before the parent is checked or approved. Lines 58 and 62 also record/verify the default branch rather than the actual parent target. Resolve the target branch/worktree first and use that target throughout local merge and confirmation; reserve default-branch approval for the parent.

2. **P2 — Old Hindsight access is disabled before verified migration.** `reference/update.md:241` removes the project from the coding-agent add-on during step 4, before step 5 moves and verifies records. A partial migration followed by a new session can leave the old memory procedure installed but its tools disconnected. Move disconnection to step 6 after verification, alongside the instruction/settings cutover. This is an ordering bug; the approved migration scope need not change.

## Findings confirmed from the other review

- `Commit: no` allows a helper to edit the item worktree, but the helper-return procedure still assumes a separate committed helper branch to merge and remove. Add the shared-worktree return path without changing authorization.
- Recovery commands assume `origin` despite permitting a confirmed non-origin remote. Carry the confirmed remote through fetch and comparison.
- The local memory entry still advertises Notion support and links absent Notion references. Actual local operations can follow the local branch; remove the stale scope and unavailable routes rather than treating this as a failed local save.

The deliberate three work-item levels were retained. Hindsight's explicit override resolves general references to `managing-project-memory`; these references were not counted as missing-skill bugs. The small-item Testing Loop explicitly substitutes the agent's own check wherever the lifecycle names a checker, so no additional standing-merge checker conflict is asserted. Existing approval scopes were reviewed as policy, not changed.
