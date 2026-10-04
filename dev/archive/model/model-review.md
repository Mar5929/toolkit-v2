# Model project review

A short record for Mike. Updated 2026-09-28.

The model project is the exact source for every file a new project gets.
`node dev/tools/import-model.mjs` copies it into
`plugins/toolkit/scaffold/model/`. `plugins/toolkit/scaffold/CONDITIONS.json`
says which parts install only for a tracker, a memory system, a host, or a
Salesforce project.

Until Mike merges the approved changes, the import reads the approved
worktree (`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`,
the `DEFAULT_SOURCE` in `dev/tools/import-model.mjs`), not Mike's own folder
(`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`).

## The 23 approved changes

Mike approved all 23 on 2026-09-26 ("go with your recommendations on all of
them"). They are in the model itself, on branch `toolkit-v2/approved-changes`
of the model's Git repository (worktree
`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`,
first applied at `9940854`). Later commits on the same branch carry the
fixes from the sample runs and Mike's decisions of 2026-09-28; the branch head
the scaffold copy was taken from is `5e7d7a0` (recorded in
`plugins/toolkit/scaffold/model/.import.json`). Mike's own model folder is
unchanged until he merges. `dev/model-changes.md` has one line per item, every
later commit, and the merge steps.

| # | Change | Status |
| --- | --- | --- |
| 1 | One root `CLAUDE.md` containing only `@AGENTS.md`; the other `CLAUDE.md` files removed | applied on branch toolkit-v2/approved-changes |
| 2 | `AGENTS.md` rewritten: what the owner decides, one routing table, "How to write replies", a generated rules list | applied on branch toolkit-v2/approved-changes |
| 3 | `SOUL.md` kept as the model has it | applied on branch toolkit-v2/approved-changes (no file change needed) |
| 4 | `.claude/RULES.md` removed; `AGENTS.md` lists the rules | applied on branch toolkit-v2/approved-changes |
| 5 | `README.md` shortened | applied on branch toolkit-v2/approved-changes |
| 6 | `DECISIONS.md` added | applied on branch toolkit-v2/approved-changes |
| 7 | `.toolkit.json` replaces `.toolkit-memory.json` | applied on branch toolkit-v2/approved-changes |
| 8 | `work-item-folders.md` rule for the local tracker | applied on branch toolkit-v2/approved-changes |
| 9 | Work item header fields `parent`, `waiting_on`, `priority`, `delivery`, `result_approved`, `updated`, `requirements_approved`; `active_phase` removed | applied on branch toolkit-v2/approved-changes |
| 10 | Six statuses; a blocked item sets `waiting_on` instead of a Blocked status | applied on branch toolkit-v2/approved-changes |
| 11 | Work item body uses IDs, "owner", and a Sub-items column | applied on branch toolkit-v2/approved-changes |
| 12 | `DESIGN.md` header: work item, status, approval | applied on branch toolkit-v2/approved-changes |
| 13 | Four-section current focus | applied on branch toolkit-v2/approved-changes |
| 14 | One-page memory criteria; the save rules live in the `memory-save` skill | applied on branch toolkit-v2/approved-changes |
| 15 | Learned-rules table removed; corrections are `feedback` memories | applied on branch toolkit-v2/approved-changes |
| 16 | `delivery/` only in Salesforce projects | applied on branch toolkit-v2/approved-changes (install condition) |
| 17 | Salesforce guards also run in Codex | applied on branch toolkit-v2/approved-changes |
| 18 | Salesforce skill descriptions rewritten, one text for both hosts | applied on branch toolkit-v2/approved-changes |
| 19 | `tests/TEST-PLAN-TEMPLATE.md` stays where the model has it | applied on branch toolkit-v2/approved-changes (no file change needed) |
| 20 | A general example in `plain-english-artifacts.md` | applied on branch toolkit-v2/approved-changes |
| 21 | `system-guide/` kept as the model has it | applied on branch toolkit-v2/approved-changes (no file change needed) |
| 22 | `.vscode/` and `.sfdx/` not copied into projects | applied on branch toolkit-v2/approved-changes (the import leaves them out) |
| 23 | V2 projects turn on the V2 plugins and turn off the `claude-toolkit` plugins | applied on branch toolkit-v2/approved-changes (init writes the switches) |

## Still open

Nothing below reaches new projects unless Mike approves it. An approved item
goes into the model, then the import runs again.

- [ ] **Merge the branch.** In the model folder, run
      `git merge toolkit-v2/approved-changes` (steps and checks first:
      `dev/model-changes.md`, "How to bring the changes into your model").
- [ ] **Point the import at Mike's folder after the merge.** Step 4 of
      `dev/model-changes.md` removes the approved worktree, and the import
      reads from it today. After the merge, and before that worktree is
      removed, set `DEFAULT_SOURCE` in `dev/tools/import-model.mjs` to
      `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`, run
      `node dev/tools/import-model.mjs` again, and run the tests.
- [ ] **Decision: the memory save card.** Mike's "Proposed memory saves" card
      (Change, Summary or Affected content, Your decision) left the model with
      item 14; `memory-save` now asks one line, "Save to memory: <one-line
      summary>?". Recommendation: have `memory-save` show the card, because it
      shows whether a save creates, updates, replaces, or deletes. The topic
      template's `authorization` prompt still says "Approved card"; if Mike
      keeps the one-line question instead, change that prompt to "Approved by
      <name> on <date>".
- [ ] **`.memory/AGENTS.md` link repair wording.** It tells the agent to repair
      links by hand after a rename, merge, archive, or delete. The
      `toolkit memory` command now repairs them and names each note it
      changed. Suggest: say the command repairs the links and the agent checks
      its report.
- [ ] **`.memory/project_topic_template.md` fill-in guide.** It says to copy
      the file to a new name, but `.memory/AGENTS.md` says the folder is
      written only with `toolkit memory` commands. Suggest: "save with
      `toolkit memory save`".
- [ ] **`DESIGN.md` status words.** The body line "Design status: Draft | In
      review | Approved | Superseded" differs from the header's `status`
      (`proposed`, `approved`, `superseded`). Suggest: use the header's words.
- [ ] **`PROJECT.md` System Guide line.** It names `.system-guide.json`, which
      belongs to the System Guide plugin V2 does not ship. Suggest:
      "`system-guide/`, one file per system area".
- [ ] **`requirements/system-area-template/` name.** The folder holds the
      functional-area template ("<Functional area>"); the system-area template
      is `system-guide/AREA-TEMPLATE.md`. Suggest: rename it
      `requirements/area-template/`, and state how an area is named (for
      example `requirements/billing/BILLING.md`).
- [ ] **`humanize-outbound-text.md` skill name.** It names the `humanizer`
      skill, which V2 does not ship, then falls back to `unslop`. Suggest:
      name `unslop` only.
- [ ] **Old "Project Init" name.** In `tools/permissions/README.md`, the
      comment at the top of `tools/permissions/PERMISSIONS-RUNBOOK.md`, and
      line 29 of both `sf-component-tracker` copies. Suggest: "project setup".
- [ ] **`tools/kb/graph_freshness_hook.py` memory path.** Its message points to
      `knowledge/memory/`, which does not exist. Suggest: point to project
      memory through the `memory-save` skill.
- [ ] **Skill paths in four Salesforce rules.** `check-deployment-contents.md`,
      `component-tracker.md`, `production-data-changes.md`, and
      `record-deployment-steps.md` link to `.claude/skills/sf-*/SKILL.md`;
      Codex reads its copy in `.agents/skills/`. Suggest: name the skill only.
- [ ] **Two output styles named "Plain English".** The project's
      `.claude/output-styles/plain-english.md` and Mike's user-level style have
      the same name and different text. Which one Claude Code applies is not
      documented. Check in a sample run with `/output-style`, then rename one
      if needed.
