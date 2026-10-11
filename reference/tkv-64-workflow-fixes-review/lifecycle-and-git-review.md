# Lifecycle and evidence verification

Changed files: building.md, builder-brief.md, requirements-analyst-brief.md, deploying.md and sources/AGENTS.md in the shipped project scaffold.

Disposable Git fixtures verified that a no-remote child fast-forward advances its parent branch while leaving main unchanged. A file-edit-only fixture retained both preexisting and task changes in the item worktree, without a helper branch merge or item cleanup. These are command-level fixtures and instruction walkthroughs, not host-agent sessions.

Source walkthroughs covered committed helper return, file-edit-only return and interrupted shared-worktree resumption; current project evidence, pending Notion captures and inaccessible evidence supplied as retrieved text; immutable source filing with attributed quotations; child and top-level merge targets, dirty target/main stops, changed tested head and fast-forward retry through the Testing Loop. Existing default-branch approval and exact tested-head requirements remain.

Both Claude plugin validation commands and git diff --check passed. Operational Markdown links resolve; the sources guide's SRC-004 link is an explicit example, not an installed dependency. No front matter, host settings, live systems or project records changed.

Official guidance read on 2026-10-11: Claude Code skills, sub-agents and memory; ChatGPT Learn build-skills, subagents and agents-md; Claude skill authoring best practices. The writing-harness-files checklist and repository evaluation and clarity rules were applied. A separate reviewer is responsible for acceptance.

## Independent Git skills review

Reviewed pull-latest, reset-to-remote, merge-and-clean-up and the shared repository safety rule after the Git writer completed the patch. Non-origin selection now follows through pull/default/target resolution and reset planning. Reset retains explicit preview and approval for each discarded branch and its verified upstream.

Replayed the exact requested pull request independently of the current checkout, a non-default base branch, missing or mismatched local repository remote, changed head or base, dirty target and dirty main, and unrelated commits arriving in the base checkout. The requested pull request controls the GitHub reads and merge; the actual pull request diff controls overlap checks in both local worktrees. Changed head/base restarts checks and head authorization. Checkout-update overlap is checked separately. Matching remote and base-upstream proofs guard local follow-through; absent proofs preserve local branches/worktrees.

The first review found step 6 still used origin independently of the exact pull request repository. The writer fixed it by verifying matching repository URLs and base upstream, using the matching remote throughout or skipping local cleanup. The revised paragraphs resolve that finding. No remaining material issue was found in the approved scenarios. Reviewed the Git writer's disposable non-origin fetch/pull/reset fixture evidence and actual-base diff output; GitHub API steps were simulated, not executed.
