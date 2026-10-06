# Memory folder, file names, and sizes (local files)

## Contents

- The memory folder
- File names and prefixes
- Size limits
- Making a file from the seed
- Renaming, retiring, and deleting
- Current State

## The memory folder

```text
memory/                                  in the main checkout only; Git ignores it
├── AGENTS.md, CLAUDE.md                 the folder's own guide; part of the setup, not a memory
├── CURRENT_STATE.md                     what is true now; the start-of-session hook prints it
├── MEMORY.md                            the index; the same hook rebuilds it; never edited by hand
├── project_topic_template.md            the seed for a memory file; never a memory
├── user_team_availability.md            a concept: facts about people (user_)
├── project_client_plans.md              a concept: one area of the project or the client (project_)
├── reference_open_items_sheet.md        a concept: where to find something, and why to open it (reference_)
├── event_client_meeting_2026-10-05.md   one thing that happened, one file (event_)
└── event_weekly_account_load.md         one recurring job, one file, one row per run (event_)
```

- Every file sits at the top level. There are no subfolders: the index and the searches read only the top level.

## File names and prefixes

| Prefix | `metadata.type` | One file holds |
| --- | --- | --- |
| `user_` | `user` | facts about the owner or another person that matter to the work |
| `project_` | `project` | one concept or area of this project or the client |
| `reference_` | `reference` | where to find one thing that is hard to find again, and why to open it |
| `event_` | `event` | one thing that happened, or one recurring job with a row per run |

- The name is `<prefix>_<name>.md`: lower-case words joined by underscores, naming the concept, not one fact. An event that happened once ends its name with its date: `event_client_meeting_2026-10-05.md`. A recurring job's file has no date in its name.
- A file with none of these four prefixes is left out of the index. `feedback_` and `decision_` are retired prefixes: an old file with one is marked as `record-format.md`, "Marks for what is not current", says once its content has moved.
- `CURRENT_STATE.md`, `MEMORY.md`, and the seed have fixed names and no prefix of the four.

## Size limits

- A concept file holds about 20 sections or 300 lines at most. A bigger one is two concepts.
- The file name before `.md` and the `description` together hold at most 70 characters: the index line is cut there.

## Making a file from the seed

1. Copy the seed to the new name, with `MAIN` set as in `SKILL.md`: `cp "$MAIN/memory/project_topic_template.md" "$MAIN/memory/project_client_plans.md"`.
2. Set `name` to the file name without `.md`, `metadata.type` to its prefix, `created` and `updated` to today, and `status` to the real status (`record-format.md`, "Status"). `template` never stays.
3. Fill every header field and the first section with real, sourced text. Keep `## Gotchas and lessons` last, holding "None yet.". A recurring job also gets its `## Runs` section (`record-format.md`, "The Runs table").
4. Remove the fill-in guide comment, the final template comment, and every angle-bracket prompt.

## Renaming, retiring, and deleting

- **Rename.** Rename the file, change `name` (and `metadata.type` when the prefix changes), and set `updated`. Links point at the file name, so search for the old name and repoint each link and each `supersedes:` line (`searching.md`, "Links to a file").
- **Retire or replace.** The file stays where it is, marked as `record-format.md` says. The index drops it at the next session start.
- **Delete.** Deleting removes the one file: `rm "$MAIN/memory/<file>.md"`. `memory/` is not in Git and has no backup, so nothing can bring a deleted file back. Then repoint or remove each link to it, as for a rename.

## Current State

`memory/CURRENT_STATE.md` holds Current State. `curating-project-memory` says what each part holds and its limits; the skill that calls this one decides what a line says.

- Replace a changed line. Never add a second line beside the old one.
- Keep every heading, an empty part included: an empty part holds "None."
- Set the "Last updated:" line in the same edit. The start-of-session hook reads the date after "Last updated:", written as `YYYY-MM-DD`, to tell when the file is old.
- The file is missing: do not create it. Tell the owner, and suggest "check the setup" with `project-setup`.
