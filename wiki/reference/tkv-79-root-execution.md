# TKV-79: setup, hooks, and final verification evidence

This report records the changes and checks prepared under TKV-79. The Notion work item holds approvals, current work, remaining decisions, and the next action. Each proposal has a disposition here or in the work-items, memory, and shared/Salesforce execution reports.

## Root proposal dispositions

| Proposal | Disposition | Evidence or reason |
| --- | --- | --- |
| A1 | Implemented | Shared hooks load the installed startup module and reminder text. Setup/update configure the selected resources, preserve unrelated entries, and require review of changed Codex entries. Hook design and native verification reports describe the checks. |
| B1 | Implemented | Removed the project-specific tool paths and rule names from update guidance; owner records remain protected by the general preservation procedure. |
| B3 | Preserved approved phase 0 | Replaced the project-specific example prefix in the two Notion setup references. |
| B16 | Implemented | Copy guidance permits an available equivalent when a named command is missing, preserving copying and verification behavior. Notion CLI guidance already gives a JSON-tool fallback. |
| B17 | Implemented | Removed the one-tracker unsupported-choice example from setup problems. The confirmed-choice interview remains. |
| C1 | Preserved approved phase 0 | Removed the false claim about refused Git commands in settings. |
| C3 | Implemented | Setup follows each selected module's actual timing, retaining early sign-in and access/answer/authorization gates before dependent external steps. |
| C5 | Implemented | The finishing reference points to Salesforce step 8 for writing permission instructions. |
| C6 | Implemented | The project-store summary has an entry in the setup file table. |
| C17 | Preserved approved phase 0 | This repository's guide reflects the memory module folder merge. |
| C18 | Retained pending owner evidence | No approval of the whole update procedure was invented. Its existing operational safeguards remain; the product-wiki “Not decided yet” statement is still an owner question. |
| D11 | Implemented | Removed the repeated default-branch approval clause from the starter guide; the shared repository rule and lifecycle still require it. |
| D13 | Retained intentionally | Setup's voice-to-text instruction applies before the installed guide exists; installed projects need their own copy. |
| D35 | Implemented where redundant | Consolidated setup timing and repeated state/settings definitions. Retained definitions needed before installation and the entry procedure's required routing. |
| E12 | Retained pending owner decision | The owner-edit comparison method remains. Removing it without confirming its protected behavior risks replacing customized files. |
| E13 | Retained protective process | Kept the approved-scope repair and record-migration safeguards. They protect owner answers, records, and concurrent edits; their removal was not assumed from a general “agent judgment” finding. |
| H5 | Implemented | Local wiki guidance gives a visible path-mapping table and distinguishes project record paths from skill reference paths. Migration approval, original preservation, and link verification remain. |
| I3 | Implemented | The selected Notion module configures its startup page ID; shared update guidance routes to the selected choice and verified PROJECT.md identifiers. |
| J6 | Preserved approved phase 0 | The formerly shared local memory process now lives in the local module. |
| J7 | Preserved approved phase 0 | Removed the obsolete-version guidance; retained the protection for existing Notion projects' authoritative local records until approved migration. |

Other root contributions complete D1, F1/F6 and I1/I2: the starter guide is shorter without adding always-loaded instructions; incidental setup presentation counts are removed; each memory choice owns its finishing and migration detail. D16/D17 use small on-demand work-item references. D19 keeps common editing rules on demand and backend formatting in tracker modules. D20 keeps the two local command copies so either local choice remains complete.

## Context changes measured against phase 0

| File | Before | After | What the numbers mean |
| --- | --- | --- | --- |
| Work-item lifecycle reference | 4,354 words | 2,168 words | Every work-item turn reads this file; hierarchy, the small path, helper startup and common editing now open when needed. |
| Salesforce component tracker entry | 2,410 words | 469 words | Deploy manifests, manual steps, records and format rules have focused references. |
| Local memory entry | 439 words | 447 words | The entry is not shorter, but search no longer unconditionally loads retention and cleanup detail. |
| Starter root guide | 3,169 words | 3,150 words | No instructions were added to always-loaded text. The reduction is small; the independent review reports remaining context cost. |

Moving text alone does not prove a smaller working context. The entry routes and independent reader traces verify which references each job needs. The final scores use one rubric and are not directly comparable with the original reviewers' scores.

## Final checks

- Both `claude plugin validate .` and `claude plugin validate ./plugins/toolkit` passed.
- The full change from phase 0 passed `git diff --check`, including committed new references. Earlier checks of only the working diff missed blank EOF lines; the full comparison found and corrected them.
- All shipped skill front matter was parsed as YAML, with valid names and string descriptions. Native discovery found and prompted correction of an unescaped apostrophe in `publish-docs`.
- Eighteen scratch assemblies covered three trackers, three memory choices, and Salesforce on/off. Actual Markdown reference links resolved; illustrative inline-code links were excluded. JSON settings parsed, host skill links and guide/import pairs matched, and each assembly contained only its selected memory resources and record homes.
- Hook command checks covered startup, compaction, matching/quiet/pasted prompts for all memory choices, local worktree lookup and index filtering, and mocked Notion success/failure with closed stdin.
- Native Claude Code and Codex scratch checks accepted the final skills and hook wiring. Their exact operations and limits are in the native verification report. No live Notion, Hindsight, or Salesforce records or owner's host configuration were changed by those checks.
- Separate domain and root reviews rechecked corrections: the GitHub issue-creation section and fence, moved record-closing/helper/Org-flags pointers, template punctuation, YAML parsing, and outgoing Hindsight retirement after verified migration.

## Animated explainer artifact

The MP4 at `/Users/michaelrihm/Projects/explainroo/videos/toolkit-skill-review/out/video.mp4` explains the review process and concrete examples. It lasts 194.3 seconds at 1920×1080. Independent content review and still/contact-sheet inspection passed. The final audio/video verification has no issues, black segments, or silence findings, and reports a 99.8% speech match. Source files remain beside the video. Continuous human playback was not part of visual verification.
