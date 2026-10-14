# TKV-79 review of session instructions and hook context

The final static and document-reader review finds the essential owner procedures and safety protections present. No remaining behavior blocker was confirmed in the reviewed root integration. The root guide and the document clarity rule remain the largest universal loads; those scores have not been raised merely because the implementation is complete.

The final source snapshot is parent commit `be4b612c` plus the phase-7 working changes read on 2026-10-13. Those working changes correct quoted YAML, manifest prompt metadata and Hindsight source retirement. The preliminary snapshot was `15451fa40dcdb2dc4031f6e416716c956fddafb3`. These scores assess the text and documented host behavior. They do not claim live instruction loading, hook trust, successful authentication, or tested agent compliance.

Paths below are relative to `plugins/toolkit/skills/project-setup/`. Scores are judgments from one rubric; totals should not be compared directly with earlier reviewers' totals without matching their scales.

## What loads and when

The root `AGENTS.md` and unconditional rules belong to every project session. Claude Code uses its `CLAUDE.md` imports and rule loading; the root guide tells Codex to read unconditional `.claude/rules/` files at startup and after compaction. An output style is native to Claude Code; Codex and helper replies use the root guide's explicit pointer.

Folder guides are loaded or read when their folder is used. They are included here because they are mandatory context for that work, not because all folder guides load at every session start. Choice rules and choice hook resources belong only to projects that selected them. Hook commands run on their configured events; their code itself is not model context, but their output can be.

## Scoring rubric

Each point receives 1 to 5: 1 means the text repeatedly misses the point; 2 means substantial correction is needed; 3 means usable with visible gaps; 4 means consistently follows the point with minor gaps; 5 means fully follows it in the reviewed scope. A score of 5 is not proof that a live agent obeys the instruction.

| Point | What was evaluated |
| --- | --- |
| P1 | The process and required order are clear. |
| P2 | Exact details are retained where tools, identifiers or owner contracts require them. General detail is sufficient elsewhere. |
| P3 | General rules cover situations; exceptions protect actual edge cases. |
| P4 | The text gives goals and process without coaching reasoning. |
| P5 | Counts and limits serve a technical or owner-defined contract rather than replacing judgment. |
| P6 | The text avoids duplicating another instruction's owning home. |
| P7 | Context loads only when needed and remains proportionate to the job. |
| P8 | The document clarity standard is met. |

## Final text scores

| Unit | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Starter root guide | 4 | 4 | 4 | 4 | 4 | 3 | 3 | 4 | 30 |
| Shared repository rule | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 35 |
| Request-evaluation rule | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 31 |
| Document clarity rule | 5 | 5 | 4 | 4 | 4 | 3 | 3 | 5 | 33 |
| Owner preferences template | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 40 |
| Plain English output style | 5 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 34 |
| Sources folder guide | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 38 |
| Delivery folder guide | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 36 |
| Reference folder guide | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | 35 |
| Local work-items folder guide | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 36 |
| Local memory folder guide | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 36 |
| Product wiki folder guide | 5 | 5 | 4 | 5 | 5 | 3 | 3 | 4 | 34 |
| Notion records rule | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 38 |
| Hindsight memory rule | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 36 |
| Salesforce org safety rule | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 37 |
| Salesforce owner-permissions file | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 38 |
| Salesforce deployments rule | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 4 | 37 |
| Startup hook and choice resources | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 38 |
| Prompt reminder and choice text | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | 36 |
| After-commit reminder | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 38 |

The root guide has 145 lines in this snapshot. The four unconditional rules together have 168 lines, including the 111-line clarity rule. Plain English adds 36 lines when its documented loading applies. Folder and choice context varies by work and selection. These are line counts, not measured token costs. The root guide changes from 3,169 to 3,150 whitespace-separated words against base `3c8113e2`, with 145 lines in both versions. The duplication and context scores remain 3: a 19-word reduction does not justify claiming that its three routing tables became concise.

## Evidence for each point

| Point | Evidence and limits |
| --- | --- |
| P1 | Root Every session identifies work and routes to owning skills; repository rule orders pre-edit reads and merge checks; source/delivery/reference guides define record placement; permission table separates action from org type. Request evaluation mixes goal discovery, project study and decision presentation without a concise procedural grouping, explaining its lower score. |
| P2 | Keep explicit commands, stable ID formats, status vocabulary, source/approval evidence and exact boundaries. Source's 10 MB approval threshold is an owner policy; Hindsight's supported-tool/correction behavior is operational. Salesforce's `-o` target, direct commands, no-script bypass and permission replacement check protect actual actions. Repeated schemas and generic command examples can load on demand where their owning skill already gives them. |
| P3 | Most rules describe classes of records/actions. Salesforce permission-set replacement and Notion template/Done hazards are real edge cases, not disposable examples. Sources' outside-Git consent and data-migration exclusions protect specific delivered artifacts. Request evaluation's lists of possible missed cases and repeated illustrative phrases can be shortened without changing the owner's scope-review requirement. |
| P4 | File ownership, approval stops, evidence and update procedures describe the owner's process. Request evaluation's “slow down and work out” and “work out the best solution” are reasoning coaching; retain the owner's evaluation and presentation contract while shortening those phrases when authorized. Clarity's “Start from the whole document” similarly combines a process with general writing advice. |
| P5 | Exact IDs, service/output allowances and owner approval thresholds serve identifiable contracts. Fixed `git log --oneline -10` is a snapshot-size choice rather than a complete history guarantee. Output style's one section for owner decisions is an owner formatting contract; it is not a limit on how many decisions matter. Counted format fields may stay when they identify a required template shape. |
| P6 | Root Project map, Where information goes and Which skill repeat destinations/routing. Clarity and Plain English repeat plain words, short sections and audience guidance, but apply to different outputs. Product wiki repeats status/mark contracts from repository-record references. Salesforce deployments now routes to its skills instead of repeating full procedures. The hook hint intentionally repeats the need to keep work current at an event where the owner wants a reminder. |
| P7 | Root and unconditional clarity dominate universal text. Choices limit Salesforce/Notion/Hindsight instructions to selected projects. Folder guides are on-demand through the root guide. Shared startup/prompt code no longer selects a backend; installed choice resources supply it. Startup output still has a technical allowance and a complete-record read pointer. No runtime token measurement or live host context observation was performed here. |
| P8 | Exact file/section names and complete sentences mostly make the instructions independently usable. Tables clarify record homes and org permissions. Root map density and long product-wiki schema explanations account for deductions. Hook recovery tells the reader what records to read; it never claims a failed read was successful. |

## Required protections to preserve

- The root guide's Codex startup/compaction rule loading and before-folder guide reads are host-compatibility requirements.
- Owner scope, requirements/result/merge/deploy/Done approvals and the prohibition on overwriting another session's work are owner process.
- Shared repository staging and overlap checks prevent unrelated changes from being committed or overwritten. Main-checkout no-switch/reset/rebase/stash and named owner exceptions remain.
- Received sources stay unchanged, with consent for specified outside-Git decisions and permanent references.
- Local work records remain in the main checkout, outside Git, identified by stable ID. Owner moves and edits are preserved.
- Notion records use owning skills and may not take a shortcut that marks work Done. Owner templates, child/view blocks, relations and full-list writes remain guarded.
- Hindsight keeps current status in the tracker, preserves provenance and uncertain claims, reads full saved-output memory, and distinguishes correction from deletion.
- Salesforce safety stays loaded before CLI actions. Explicit org targets, direct commands, read-only protection, permission-set grant comparison and owner permission duration remain.
- Reminders remain hints. A keyword, helper report or failed command cannot supply owner authorization or assert a save succeeded.

## Shortening opportunities

This review recommends no new always-loaded text. Use the existing owning references to remove root routing duplication and keep folder-specific schema/procedure detail on demand. Preserve the required protections above. Where owner-confirmed request evaluation or writing process overlaps general reasoning/writing advice, shorten the wording without changing when the owner decides or what evidence is required.

The final setup description distinguishes the three executable hook entry commands from their choice-owned startup resources. The modules do not form a setup verifier or impose a closed configuration schema on owner projects.

## Official host requirements checked

Official pages read on 2026-10-13 include [Claude Code memory](https://code.claude.com/docs/en/memory), [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude Code hooks](https://code.claude.com/docs/en/hooks), [Claude hooks guide](https://code.claude.com/docs/en/hooks-guide), [Codex hooks](https://learn.chatgpt.com/docs/hooks), [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), and both products' subagent pages. The repository harness-writing checklist and clarity rule governed this review.

The root guide must route Codex to the Claude rule files; Codex does not automatically load `.claude/rules/`. Folder-guide reads and CLAUDE imports remain necessary for consistent behavior across the hosts. Codex SessionStart uses `source`, including `compact`; plaintext stdout becomes additional context. Changed non-managed hook definitions require `/hooks` trust. The shared choice loader leaves host configuration and unrelated hook handlers intact.

The startup modules' static error handling and parent scratch-hook evidence were reviewed separately. This report does not claim live startup/compaction delivery, output-style activation, project trust or loaded-context contents. The final static checks below verify the root guide's pointers, settings, setup routes and resources against the integrated tree. Native-host and live-service claims require separate evidence.


## Final root workflow review

The review followed whole procedures, not only the words in SKILL.md. It read the setup entry, interview, copying, finishing, local-wiki mapping, settings merge and update references, plus each selected memory choice's finishing route and startup resources. It compared the root integration with base `3c8113e2` and rechecked the final working changes.

| Workflow unit | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Setup entry, interview, copy and finishing | 5 | 5 | 4 | 4 | 4 | 3 | 3 | 4 | 32 |
| Check/update with owner customizations | 5 | 5 | 4 | 5 | 4 | 4 | 3 | 4 | 34 |
| Record-home mapping and storage cutover | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 37 |
| Host hooks, selected resources and trust | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 38 |

Setup keeps the exact eleven-question order, the owner's exact outcome and row, immediate answer recording, confirmed facts only, selected-choice questions, and early sign-in with dependent actions waiting for access and authorization. Removing the universal “three moments” explanation loses no timing because each choice still gives its timing and the shared procedure explicitly waits for prerequisites. The own-file/update exclusions protect owner-preferences and Salesforce permissions. Copying and settings merging still preserve unrelated content and identify owner edits before replacement.

Local finishing retains Last updated, Now, Coming up, Waiting on's exact owner-step wording, Standing jobs and shared files, and Next session starts with. Notion finishing preserves its existing page shape and read-back, verified Current state page ID, librarian access and capture/retrieval checks. Hindsight finishing records open owner steps in project tasks and makes current-work mapping explicit before an old Current State is removed. The shared finishing reference routes to the selected choice; it does not substitute a vague universal memory procedure.

For updates, the completed setup copy configures the installed choice resources from verified PROJECT.md identifiers. Changed hook code and resources are shown for owner review; changed hook entries require Codex trust. The root guide retains unconditional-rule loading after compaction, folder-guide reads, and work-item identification order. Its two deleted clauses are repetitions of the repository rule; no new always-loaded owner instruction was added.

For storage migration, the preview covers named records, destination, losses, conflicts and current-state mapping. Originals remain recoverable, each moved record is read back, and failed moves keep current routes. Only after verified movement and owner authorization are instructions, settings, resources and the active store changed. Outgoing Hindsight now has a source-retirement route, not just a destination-import route: remove only this project's opt-in path after that cutover and preserve other projects. Ignored work/memory link corrections still wait for tracked files to reach the default branch. Native output/manifest checks are parent evidence, not assumptions from readable JSON.

## Final checks and outstanding evidence

Executable static assertions passed for all three memory setup-to-finishing links, both startup resources, backend-neutral shared hook code, valid shared settings without memory-selection arguments, root Codex rule/folder reads, the CLAUDE import and verified-authorized source retirement. The reviewed update/Hindsight/root contents were identified by these SHA-256 values:

- update.md: `8ee2ddebc2454128c6bbc07d47ccf51d7adc0c5576dd7218040fad0e8283d2b0`.
- Hindsight finishing-memory-setup.md: `39fe2572c514f794191fcfd22ffc5e3e138bc386a40e19dc9037b21c5ecdc7a9`.
- Starter AGENTS.md: `b4ea97704c5be78848d9a67919331c7ba8819dfca7025539f2adc61da6bc5828`.

The full base-to-working-tree whitespace check initially found blank final lines in four newly added work-item references: editing-a-work-item.md, small-work-item.md, starting-a-helper.md and work-levels.md. The parent was notified to remove those before final checks. This is a formatting issue, not a newly discovered behavior regression.

Current official output-style and plugin packaging pages were also read on 2026-10-13: [Claude Code output styles](https://code.claude.com/docs/en/output-styles) and [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins). The parent remains responsible for recording actual native-host installation/loading, validator output and final whitespace-check results. This independent review found no remaining confirmed root behavior blocker and makes no claim that a live agent loaded or obeyed every file.
