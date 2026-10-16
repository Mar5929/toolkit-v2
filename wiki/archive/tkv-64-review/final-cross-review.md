# TKV-64 final independent cross-review addendum

Reviewed the final GitHub adapter permission and date-baseline changes, local work-item guide and blocked-write rules, local memory blocked-write rule, and Notion CLI permission/authentication changes against original Git HEAD and the scoped intended workflows. No implementation edits were made as part of this independent adapter review.

## Result

No confirmed adapter defect remains in this scope. Actual active-session permissions now determine whether commands run directly, require a supported approval, or are blocked. Approval-off does not itself imply denied filesystem/network access. Forbidden escalation is never requested, and a blocked required call with no permitted route returns an exact owner-terminal command and waits for dependent work. Network/keychain diagnostics precede unnecessary sign-in requests. Host-setting relaxation remains forbidden. Separate-call, authentication, repository scoping, API schema, and write-verification safeguards remain intact.

The GitHub recently-finished search keeps an owner-provided date first and the installed Current State baseline for local/Notion memory. Hindsight uses a recorded tracker handoff/progress date defining the reviewed period, reports that date, and asks for dates when no baseline exists. It does not invent Current State or import current task status into lasting memory.

Closed local work items remain evidence/history; current guidance still belongs in DECISIONS.md, system/, and sources/. Main-checkout-only memory/work-item storage remains protected when a write is blocked. No worktree shadow copy is authorized. Revised Git checks distinguish tracked records from ignore configuration rather than relying on clean status.

## Exact command and manifest comparison

- `plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-gh-commands.md`: 9 fenced command blocks; all identical to HEAD: True.
- `plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-project-roadmap-and-tasks.md`: 7 fenced command blocks; all identical to HEAD: True.
- `plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-searching.md`: 8 fenced command blocks; all identical to HEAD: True.
- `plugins/toolkit/skills/project-setup/choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/references/ntn-commands.md`: 8 fenced command blocks; all identical to HEAD: True.

- `plugins/toolkit/.claude-plugin/plugin.json`: `0.9.44`.
- `plugins/toolkit/.codex-plugin/plugin.json`: `0.9.44`.
- `.claude-plugin/marketplace.json`: `0.9.44`.

A shipped-text scan for escalation, sandbox and approvals-off wording found no remaining universal Codex network/keychain/read-only or mandatory-escalation assumption. Salesforce sandbox references concern actual Salesforce orgs, not host restrictions. Setup problems and both adapter references explicitly condition permission requests on the active session.

## Workflow simulations and limits

- Direct permitted access succeeds without a redundant approval request; an approval-required supported host uses its mechanism; an escalation-forbidden blocked host reports the exact owner command and waits.
- A credential-unavailable Notion session diagnoses access; a genuinely expired sign-in with access available reaches owner login. No credential disclosure is requested.
- A Hindsight recent-work query uses tracker evidence for its interval, and a query without interval evidence asks the owner instead of inventing a date.
- A later investigation may read a closed local work item while using promoted project guidance for current behavior.

This is an instruction and exact-text review, not a live authenticated GitHub/Notion call or a runtime host test. No external records or credentials were changed.

## Final direct-reference and restoration reread

Read both complete SKILL entries after the direct reference tables were added. Every target resolves in the shared base or the stated selected adapter (including the existing Salesforce choice route). Work tracker rows distinguish Local/GitHub/Notion and the action requiring the file; memory rows distinguish Local/Notion and identify search, layout, record forms, Current State or write verification. Their introductory conditions require only relevant selected-store detail, so these tables improve one-level discovery without requiring all supporting files to load. Hindsight remains outside managing-project-memory. No finding.

Reviewed finishing.md parent-folder restoration against the original missing-only rule. A disposable scratch test executed mkdir -p followed by cp -n for an initially absent nested work-item template folder; the template was restored, then a second cp -n preserved an existing owner record byte-for-byte (macOS reports exit status 1 for the skipped overwrite). No real project records were touched. The fix retains the finite toolkit guide/template list and reports restores; it does not authorize configuration repair or record replacement.
