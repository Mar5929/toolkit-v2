# Four choice and setup fixes — independent review

The four requested fixes pass this scoped review in the uncommitted .56 tree at `/Users/michaelrihm/.codex/worktrees/tkv62-routing-fixes/toolkit-v2`. No confirmed remaining blocker was found in these changes. Lifecycle and Git policy edits being written by the other reviewers were excluded from this pass.

## Reviewed changes

Paths are relative to `plugins/toolkit/skills/project-setup/`.

| Change | Result |
| --- | --- |
| GitHub uncertain mutations, `choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md:167` | The instruction now treats an uncertain outcome as unknown, reads the target or searches for the creation before retry, and resumes only unconfirmed work. It covers the operation generally rather than prescribing a separate rule for each network failure. |
| Local memory entry, `choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md:10–35` | The entry accurately describes local memory and drops the retired Notion routes. Its entry links all resolve after the shared process and local storage overlay are assembled. The name, description, metadata requirements, retention and authorization procedures are preserved. |
| Salesforce skill availability, `choices/salesforce/reference/what-salesforce-adds-to-a-project.md:28` | The guide directs use when installed and enabled, and reporting missing skills when needed. A missing-skills project no longer gets a false installed claim. Existing setup allows owner installation to remain pending; the new wording agrees with that behavior and preserves project permission precedence. |
| Hindsight disconnect, `reference/update.md:245` | Disconnect occurs after verified cutover within the approved scope. Steps 230–243 retain installed routes/settings during staged setup and partial moves, preserve originals, read moved records back, and require approval before applying cutover. No competing earlier disconnect route was found in the shipped setup tree. |

## Replay evidence

A disposable project was assembled from `every-project`, the GitHub work tracker, the shared local memory process, its local storage overlay, and Salesforce. It is in `local-github-salesforce/` beside this report. The `.agents/skills` link was recreated as documented. Both settings JSON files parsed, the Codex skill link resolved, all 13 reference links in the local-memory entry resolved, and the Salesforce missing-dependency case uses the conditional guide instruction. `assembly-results.json` records those checks. This fixture exercises the affected overlays and entry routes; it is not a completed owner interview or a new host session.

`recovery-fixture.json` records simulated tool outcomes and the corresponding recovery actions:

- Issue creation returns a connection error while the disposable remote fixture contains issue #41. Searching its project/title finds #41, so recovery creates no duplicate.
- Editing #41 returns a timeout after the fixture applies the body. Reading the body confirms the change, so recovery repeats no confirmed work.
- Adding a comment returns a connection error while the comment is absent. Reading the comments confirms it is unconfirmed, so recovery adds only that comment. Final fixture state contains one issue and one comment.
- A move out of Hindsight stages the new destination, verifies record A while B fails, retries and verifies B, and waits for cutover file approval. The active Hindsight routing remains unchanged through those checkpoints. Once all moves and cutover are verified and approved, the fixture removes only the Harbor project’s opt-in and bank routing and retains another project’s configuration.

These are explicit simulated inputs/results followed by the written procedure. They establish that a reviewer can follow the corrected instructions through the relevant states; they do not establish real API behavior or mechanically enforce the instructions. No `gh` mutation, Hindsight request, Salesforce command, Notion operation, scheduler, commit, or real host change ran.

## Guidance and clarity

The review reread request evaluation, document clarity, the writing-harness-files procedure and its relevant Skill/AGENTS checklist sections. It used the repository copies of official Codex build-skills and AGENTS guidance and skill best practices captured 2026-09-27, and Claude Code skill and memory guidance captured 2026-10-05, within the permitted 14-day window on 2026-10-11. The fixes retain progressive reference loading and keep operating detail out of the root guide. They give the goal and process without prescribing reasoning, adding arbitrary limits, changing schema fields, or changing the three work-item levels.

The earlier read-only check of [GitHub’s official exit-code documentation](https://cli.github.com/manual/gh_help_exit-codes) established that exit 1 reports a command failure, without guaranteeing remote rollback. The corrected procedure is consistent with that distinction.

The existing policy timing defaults and retry cap were separately identified as owner choices in the broader choices audit; they are outside these four edits and were not silently changed or recast as platform limits. Concurrent TKV-60 Hindsight settings work in the main checkout was neither reviewed nor changed here. This review did not rerun the parent’s marketplace/plugin validation or prove host skill selection in fresh Claude Code/Codex sessions.
