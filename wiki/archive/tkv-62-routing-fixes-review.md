# Notion wiki routing fixes

Version 0.9.55 repairs three retrieval gaps after the Notion Project Wiki change. The patch is on `codex/tkv-62-routing-fixes`; it is not merged. Broader TKV-64 wording cleanup remains separate.

## Changes

- Setup and verified migration align PROJECT record-home links, constraints and operating-convention pointers with the configured wiki. Setup checks inspect that alignment. Status queries use the configured records and relevant pending captures.
- Deployment reads decisions and earlier lessons through the selected memory procedure. It no longer requires the old local ledger or a removed reference heading.
- Handoff verification reads configured work and wiki records through available read access, or checks fresh supplied evidence. It distinguishes approval from implementation and capture from filing.

Existing record homes remain authoritative until verified migration. Local and Hindsight routes remain available. No hook behavior, schema, live wiki record or schedule changed.

## Review and verification

Two independent reviewers rebuilt the Harbor Services sample and replayed setup, status, deployment, capture before closure, librarian filing, corrections, supersession, concurrent contribution, partial recovery and handoff. Neither found a blocking issue in the three fixes.

- [Workflow review](wiki/archive/tkv-62-routing-review/workflow-review.md)
- [Guidance review](guidance-review.md)

Claude marketplace and plugin validation, whitespace checks, changed-module relative links, and nine module assemblies passed. Assembly checks covered skill front matter, JSON settings, host skill symlinks, guide pairs and librarian presence. Codex installed toolkit 0.9.55 into a scratch home successfully.

The sample used fictional records and operation results. These checks do not prove live Notion filing, scheduling, external writer coordination or full host loading. No live customer/template record changed.

## Next step

Review and deliver this focused patch, then resume the remaining TKV-64 convention cleanup and preserved approval-wording draft.
