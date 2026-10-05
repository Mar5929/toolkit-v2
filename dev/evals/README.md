# Evals for the work tracking skills

Six prompts, three for each skill, in skill-creator's format (`evals.json`, with `expectations` as the schema names them). Nothing here is shipped.

- `running-work-item-lifecycle/evals.json`: start a rough idea, ask for approval of requirements, finish an item with nothing to deploy.
- `using-work-tracker/evals.json`: save an answer, find what waits on Mike, add a sub-item at the right level.
- `fixtures/pocket-ledger/`: the scratch project every eval uses. The `files` lists in `evals.json` are repository-relative paths.

## Running an eval

1. Copy `fixtures/pocket-ledger/` to a scratch folder. Make a fresh copy for every run, because the runs change the items.
2. Copy the model's `work-items/work-item-template/` (from `plugins/toolkit/skills/project-setup/assets/work-local/`) into the copy's `work-items/`. The template is not stored here, so it cannot drift from the model.
3. `git init` the copy and add `work-items/` and `memory/` to its `.gitignore`, as the model does. Install `running-work-item-lifecycle` and the local version of `using-work-tracker` into its `.claude/skills/`.
4. Run the prompt in that folder. Today's date is the date to expect in saved answers.

## The scratch project

```text
pocket-ledger/
├── AGENTS.md
├── PROJECT.md                 Tracker: local. Work item ID prefix: WI.
├── memory/
│   └── MEMORY.md
└── work-items/
    ├── WI-031-transaction-entry/              level 1, Refining Requirements (Preparing)
    │   ├── WI-031.md                          Q-05 and Q-06 wait on Mike
    │   ├── references/
    │   │   └── 2026-09-28-kickoff-notes.md    decoy: holds waiting_on and status lines
    │   └── WI-032-offline-sync/               level 2, Refining Requirements (Preparing)
    │       ├── WI-032.md                      every question answered; ready for approval
    │       └── references/
    │           └── 2026-09-29-signal-notes.md
    └── WI-033-charting-library/               level 1, Testing Loop (In Progress)
        ├── WI-033.md                          Q-04 (approve the result) waits on Mike
        └── references/
            └── charting-options.md
```

| Eval | Uses |
| --- | --- |
| managing 1, rough idea | Next free ID is WI-034; WI-031 is the related item. |
| managing 2, approve requirements | WI-032. |
| managing 3, nothing to deploy | WI-033 (a research item). |
| tracking 1, save an answer | WI-031, Q-05, with Q-06 still open. |
| tracking 2, what waits on Mike | WI-031 (two) and WI-033 (one); WI-032 and the decoy do not count. |
| tracking 3, sub-item level | A new item under WI-032 is level 3; the next one down would be level 4. |
