# Memory folder, file names, and sizes (local files)

This file shows the `memory/` folder. It says how to name a memory file, how large a file may be, how to make, rename, retire, or delete a file, and how to change the project's Current State. Open it before you do one of those things.

## Contents

- The memory folder
- File names and prefixes
- Size limits
- Making a file from the template
- Renaming, retiring, and deleting
- The project's Current State

## The memory folder

```text
memory/                                  in the main checkout only; Git ignores it
├── AGENTS.md, CLAUDE.md                 the folder's own guide; part of the setup, not a memory record
├── CURRENT_STATE.md                     what is true now; the session-start hook prints it
├── MEMORY.md                            the index; the same hook rebuilds it; never edited by hand
├── project_topic_template.md            the template for a memory file; never a memory record
├── user_team_availability.md            a subject: facts about people (user_)
├── project_client_plans.md              a subject: one area of the project or the client (project_)
├── reference_open_items_sheet.md        a subject: where to find something, and why to open it (reference_)
├── event_client_meeting_2026-10-05.md   one thing that happened, one file (event_)
└── event_weekly_account_load.md         one recurring job, one file, one row per run (event_)
```

Every file sits at the top level of `memory/`. There are no subfolders, because the index and the searches read only the top level.

## File names and prefixes

The prefix of a file name is the type of the memory record. There are four types:

| Prefix | `metadata.type` | One file holds |
| --- | --- | --- |
| `user_` | `user` | facts about the owner or another person that matter to the work |
| `project_` | `project` | one subject or area of this project or the client |
| `reference_` | `reference` | where to find one thing that is hard to find again, and why to open it |
| `event_` | `event` | one thing that happened, or one recurring job with a row per run |

- The name is `<prefix>_<name>.md`. Write the name as lower-case words joined by underscores. The name says the subject of the file, not one fact.
- An event that happened once ends its name with its date, as in `event_client_meeting_2026-10-05.md`. The file of a recurring job has no date in its name.
- A file with none of these four prefixes is left out of the index.
- `feedback_` and `decision_` are prefixes that are no longer used. Once the content of an old file with one of them has moved, mark the file the way `record-format.md`, section "Marks for what is not current", says.
- `CURRENT_STATE.md`, `MEMORY.md`, and the template have fixed names and no prefix of the four.

## Size limits

- A file for one subject holds about 20 sections or 300 lines at most. A bigger file is two subjects.
- A file name is at most 60 characters before `.md`.

## Making a file from the template

1. Copy the template to the new name, with `MAIN` set as step 1 of `SKILL.md` says:

   ```bash
   cp "$MAIN/memory/project_topic_template.md" "$MAIN/memory/project_client_plans.md"
   ```
2. Set these header fields:
   - `name` to the file name without `.md`;
   - `metadata.type` to the file's prefix;
   - `created` and `updated` to today;
   - `status` to the real status. `record-format.md`, section "Status", lists the statuses. Never leave `status` as `template`.
3. Fill every header field and the first section with real text that has a source.
   - Keep `## Gotchas and lessons` as the last section, holding "None yet.".
   - For a recurring job, also add its `## Runs` section. `record-format.md`, section "The Runs table", shows that section.
4. Remove the fill-in guide comment, the final template comment, and every prompt in angle brackets.

## Renaming, retiring, and deleting

- **Rename.** Rename the file, change `name`, and set `updated`. When the prefix changes, change `metadata.type` too. Links point at the file name. So search for the old name, and change each link and each `supersedes:` line to the new name. `searching.md`, section "Links to a file", gives the search.
- **Retire or replace.** Leave the file where it is, and mark it the way `record-format.md`, section "Marks for what is not current", says. The index leaves the file out from the next session start.
- **Delete.** Delete only the one file:

  ```bash
  rm "$MAIN/memory/<file>.md"
  ```

  `memory/` is not in Git and has no backup, so nothing can bring a deleted file back. After the delete, change or remove each link to the file, as for a rename.

## The project's Current State

`memory/CURRENT_STATE.md` holds the project's Current State. `curating-project-memory` says what each part of it holds, and the limits of each part. The skill that asked for the change decides what a line says.

- When a line changes, replace it. Never add a second line beside the old one.
- Keep every heading, also the heading of an empty part. An empty part holds "None."
- Set the "Last updated:" line in the same edit. The session-start hook reads the date after "Last updated:", written as `YYYY-MM-DD`, to tell when the file is old.
- When the file is missing, do not create it. Tell the owner, and suggest "check the setup" with `project-setup`.
