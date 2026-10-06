# Pocket Ledger: working rules

This is a scratch project for testing the work tracking skills. Nothing in it is real.

- Mike Rihm owns the project and decides. The agent runs the work.
- Work items are tracked in `work-items/` with `using-work-tracker`. The process is `running-work-item-lifecycle`. IDs look like `WI-031`; the prefix is in `PROJECT.md`, "Toolkit settings".
- `work-items/` is Git-ignored, so it exists only in the main checkout.
- Before acting on a work item, read its Current state, then do its Next action.
