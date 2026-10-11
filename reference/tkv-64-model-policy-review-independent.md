# Independent model policy review

The three-file Q15 change matches the owner-approved “Project preference, then agent judgment” policy. No actionable gap was found. It removes a fixed helper model and the blanket strongest-model requirement while preserving independent helper context, exact briefs, record evidence, and coordination boundaries.

## Scope and paper scenarios

| Case | Result under the changed policy |
| --- | --- |
| Project preference is present and available | Honor that preference using the active host’s supported model selection. The shared instruction precedes both host-specific helper routes, so it applies in Claude Code and Codex. |
| No project preference | Choose a suitable model that the current host makes available for the task. The policy no longer requires every helper or coordinated session to use the most capable model. |
| Preferred model unavailable | Availability remains a real constraint. Report an unavailable required choice rather than claiming it was selected. Apply an allowed fallback where the project preference permits one; otherwise identify the constraint. The patch does not grant permission to silently override a strict project requirement or invent a model name. |
| Fresh work-item helper | Start a new helper without this session’s history; Codex still names `fork_turns: none` and Claude Code still uses general-purpose. The complete brief and filled inputs remain required. Model choice does not turn the helper into a fork. |
| Independent handoff verifier | The verifier still receives only its read-only brief, draft and evidence inputs. It cannot run tests or change records. Wrong/Unchecked/Skipped claims and the verified Notion/wiki routes remain intact. Changing its model policy does not lower the evidence standard. |
| Coordinated sessions | Check inherited model settings and set them when needed to satisfy the project preference or suitable task choice. Existing session creation, scoped permission, file ownership, reporting, merge and archive rules remain unchanged. |

These are paper scenarios, not actual helper launches or model-availability tests. A project can define preferences appropriate to its host; the procedure need not enumerate model brands, versions or per-case overrides. The active tool and host constraints still govern selection.

## Guidance and checks

The review read request evaluation, document clarity, writing-harness-files and its Skill checklist. It reviewed the parent work-item and handoff skills and the three changed model instructions. Eligible official captures were reread: Claude Code and Codex subagent guidance captured 2026-10-05; Claude Code skills captured 2026-10-05; Codex build-skills and skill best practices captured 2026-09-27, within the allowed 14-day window on 2026-10-11.

The official subagent guidance supports model selection and inheritance that depend on the host and its configuration. The patch uses a general task-and-preference policy rather than hardcoding a host-specific alias. It states a process, adds no arbitrary limit, and preserves fresh helper briefs and existing approval requirements. No skill name, description, schema field, verdict format, or model setting outside the three reviewed instructions changes.

`git diff --check` returned no output. Other .59 memory and retry policy edits remain separately reviewed. No procedure edits, live writes, model switches, helper launches or commits ran during this review. The only write was this review record; delivery authorization remains separate.
