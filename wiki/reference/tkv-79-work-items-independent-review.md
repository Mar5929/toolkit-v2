# TKV-79 independent review of work-item changes

The corrected work-item branch has no remaining confirmed behavior regression from this review. The review found an accidentally removed GitHub issue-creation procedure and example fence; commit `09ead1b1` restores them. Minor text and report-format defects remain below.

This review compares base `3c8113e24a4519cd41e3e9404703b4490ed3e064` with corrected head `09ead1b1` on `codex/tkv-79-work-items`. It covers all changed work-item files and the per-ID execution ledger. It does not approve a merge or mark any work item Done.

## Findings

| Priority | Finding | Evidence and correction |
| --- | --- | --- |
| P1, fixed | Extraction removed GitHub's issue-creation procedure and the closing fence of its layout example. | At original head `1e8c8a5a`, `choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker-issue-layout.md` jumped from the picture's Requirements line to common editing guidance. New-body initialization, example removal, guide preservation, default priority/labels, parent depth and milestone linking were lost. `09ead1b1` restores the picture and all creation steps. The corrected reader scenario passes. |
| P3 | Removing a sentence limit left punctuation inside a placeholder. | Both `every-project/.claude/skills/managing-work-items/assets/work-item-template.md` and the local `work-items/work-item-template/WORK-ITEM.md` say `<What this requirement achieves,>`. Remove the comma in both copies. |
| P3 | Removing a reply limit left invalid sentence punctuation. | `every-project/.claude/skills/managing-work-items/references/design-critic-brief.md`, Boundaries, says `Put each question whose answer would change a finding in your report,.`. End the sentence with a period. |
| P3 | Blank lines break the execution ledger's disposition table. | `wiki/reference/tkv-79-work-items-execution.md` inserts blank lines between phase row groups. CommonMark ends the table at the first blank line; subsequent rows have no header/separator. Keep the table contiguous or repeat its header for separate tables. |

## Commit coverage

The review read the full diffs of `777167da`, `6329c984`, `169d8bf7`, `8eb61a98`, `bc24feaa`, `ef121f99`, and `1e8c8a5a`, together with the resulting files and their linked references. It then read and checked corrective commit `09ead1b1`.

| Changes | Review result |
| --- | --- |
| Shared entry and lifecycle; work levels; short path; editing; save reporting; helper startup | Entry links expose moved references. Owner approvals, hierarchy/depth, stable IDs, shared-question handling, save-after-step and read-back requirements remain. |
| Requirements, design, building, testing, deployment, closure and team procedures | Requirement/design/result approvals and Done authorization remain. Changed requirements preserve original evidence and require approval only for affected requirements. Builders remain constrained; returned work is verified before integration. Default-branch merge and shared deployment still need scoped authorization. |
| All changed helper briefs and template pairs | Isolation, evidence inputs, prohibitions, commit/file-hash checks and task completion proofs remain. Two punctuation defects are listed above. Template pairs remain identical. |
| Local tracker, folder/field/search/roadmap references and folder guide | MAIN command, fresh reads, local storage, ID immutability, table escaping, preservation of owner edits, no-Git work records, move/level checks and phase conversion history remain. |
| GitHub tracker, issue layout, labels, command/roadmap references and setup files | Corrected creation path remains complete. Numeric IDs, repository scope, auto-close prevention, body/comment constraints, labels, uncertain-write recovery and owner milestone approval remain. |
| Notion tracker, page/command/problem references and setup files | Live schema and owner-template authority remain. Exact replacements, complete editable properties, relation ownership, child/view preservation, default-template safeguards, read-back and numeric-ID/prefix verification remain. |
| Per-ID ledger | Most dispositions match the changes. Its claim that requirements were preserved was false at `1e8c8a5a` for GitHub creation; the correction restores the lost requirements. Rendering cleanup remains. |

## Proposal coverage

Every proposal recorded by the work-items execution ledger was checked against its changed or retained files.

| IDs | Result |
| --- | --- |
| A2, A3, A4 | Tracker-specific names moved without losing exact GitHub branch/test-plan forms. Environment replaces org in shared procedures and safety boundaries. |
| A5, C14 | Retained/deferred decisions are identified explicitly. Existing platform-skill routing and one-question interview remain, pending owner choice. |
| B6, B9, B10, C9, C13, C15, C16 | Installation is operating-system-specific; history references become general rules; neutral owner wording and pointer corrections preserve the process. |
| D1, D2, D3, D6, D7, D22, D25, D27, D33 | Definition/permission duplication removed; exact local MAIN command and standalone brief context remain. Conflict handling routes to pull-latest. |
| D16, D17, D19 | On-demand save/helper/editing references preserve exact reply words, isolated complete briefs, question ordering, speaker/date/source evidence and supersession. GitHub creation repair was necessary after extraction. |
| D5, D8, D29, D42 | Shared definitions and editing rules now have linked homes; backend-specific formats remain. |
| D10, D26 | Incidental wording removed; exact staging commands and owner setup approval remain. |
| D21, D28, D34, D20 | Necessary hierarchy/storage/standalone context and the local MAIN command retained. |
| D46, D47 | Reduced field tables still route to templates/live schemas and retain fields with operational rules. |
| I5, J3, J4 | Notion helper ID query/read procedure is explicit; GitHub setup ranges were adjusted after the repeated explanation was removed. |
| D15, J2 | No new always-loaded credit instruction and no changed history contract; deferral is explicit. |
| E2, E3, E4, E7, E14, E15 | Folder/label/offer cases generalized while retaining owner-only decisions, missing-priority default, uncertain-write checks and project model preference. |
| F1, F2, F3, F5, F6 | Arbitrary text/list limits removed. Exact IDs, label values, service limits and unresolved-failure escalation remain. Punctuation cleanup is required in the two identified locations. |
| G1, G8, G6 | Hierarchy and small-item procedures moved to linked files; repository routing is direct. Fill-in comments retained as an explicit pending owner decision. |
| H2, J5 | Notion paragraphs now use clearer steps without weakening template/relations guards. Humanizer dependency remains explicitly unresolved. |

## Representative reader scenarios

These scenarios used the old and corrected starter root guide, the relevant skill, and references that the guide or skill names. They did not use remembered policy to fill a gap. The scratch records are at `/var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tkv79-mwi-review-7u5t0frj`. These are document-reader checks and executable content assertions, not live tracker or native-host runs.

| Scenario | Old path | Corrected path and observable difference |
| --- | --- | --- |
| Local approved requirement R-02 changes; owner's new words include a table pipe | Root guide → managing-work-items → lifecycle/tracker → refining step 7 → field mapping | Same approval/evidence behavior. Common editing reference supplies requirement/answer ordering; local tracker still requires escaped pipes, `<br>` and unchanged original verbatim requirement. Save only the changed lines, then read back. |
| GitHub issue #12 gets a requirement change and a superseding answer | Root guide → lifecycle/tracker → issue layout → refining step 7 | Same R-ID/Q-ID ordering and affected-requirement approval. Common reference owns row order; GitHub keeps escaped table cells, waiting labels and prohibition on requirement IDs written as `#1`. Restored creation procedure retains body initialization and labels for new items. |
| Notion WI-31 changes requirements and a plan phase | Root guide → lifecycle/tracker → page updates → exact API references | Same fresh reads, owner template and protected blocks. Use live section formatting and update mirrored Next action/Summary properties. Phase/task relations, Order, cancellation and retained outcomes remain. The helper now has an explicit numeric-ID query and checks the returned prefix. |
| Owner edits only local parent field; folder remains under old parent | Tracker → folder check → Findings that need the owner | Same question asking whether to move the folder, rather than moving it or replacing the owner's field unilaterally. The new automatic branch is conditioned on the folder's parent changing; a parent-only edit stays in the owner-question case. |
| Local file name no longer matches its stable ID; two files share an ID | Tracker → hand-edit checks and duplicate-ID procedure | Same stable-ID lookup, broken-link report and rename offer; duplicate-ID resolution still needs the owner and renumbers only the item created in this session. |
| A shared open question blocks a work item | Root guide → lifecycle shared-question rule → filing-project-records | Same owner wait and Next action with the shared record ID/link; no duplicate shared question. Source/evidence and approved-vs-proposed status remain distinct. |
| A builder reports partially completed work; a new owner approval would change the checked result | Building return procedure → testing → deployment/closure | Same verification before integration, open tasks for gaps, exact commit/hash evidence, recheck after a change and fresh owner approval of the changed result. A builder report does not approve the result, merge, deployment or Done. |
| A small item needs a simple export, then grows to require design | Lifecycle small-item section → testing/closure | New entry/lifecycle links open small-work-item.md. Eligibility, combined closing approval, independent-check exceptions, separate merge/deploy authorization and return to full path remain. |
| A helper must run without session history under the project model preference | Lifecycle Starting a helper → standalone brief | New entry routes to starting-a-helper.md. Claude general-purpose and Codex `fork_turns: none` remain; model preference and complete brief/inputs remain. Main-agent history is not copied. |

Executable assertions passed for old and corrected local/GitHub/Notion approval, supersession, shared-question and helper-return contracts. Assertions also passed for moved short-path eligibility/authorization/full-path conversion and standalone/model startup requirements. The corrected GitHub reader assertion requires its Creating an issue section and guide-preservation instructions.

## Official guidance and limits

The review used the repository's writing-harness-files checklist, request-evaluation rule, document clarity rule and guiding principles. Current official skill/guide pages had been read on 2026-10-13: [Claude skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude Code memory](https://code.claude.com/docs/en/memory), and [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md). The review additionally read [Claude subagents](https://code.claude.com/docs/en/sub-agents) and [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).

On-demand references fit the official skill structure. Native helpers may also receive host/project instructions; the inherited sentence that a helper “sees nothing else” must be read as excluding the parent chat, not as a guarantee that the host supplies no instructions. No new reliance on that sentence was introduced by moving the startup procedure.

Cross-domain callers of moved lifecycle headings need the parent integration's updates. The humanizer setup dependency and deferred owner-policy questions remain explicit limitations. No live data was changed, and no native-host loading or live authentication result is claimed here.
