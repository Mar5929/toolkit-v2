# Memory folder, file names, and sizes (local files)

## Contents

- The memory folder
- File names and prefixes
- Size limits
- Making a file from a seed
- Renaming, retiring, and deleting

## The memory folder

```text
memory/                                  in the main checkout only; Git ignores it
├── AGENTS.md                            the folder's own rules; part of the setup, not a memory
├── CURRENT_STATE.md                     what is true now; the start-of-session hook prints it
├── MEMORY.md                            the index; the same hook rebuilds it; never edited by hand
├── terminology-glossary.md              the glossary: one table row per term
├── project_topic_template.md            the seed for a concept file; never a memory
├── decision_template.md                 the seed for a decision file; never a memory
├── user_profile.md                      a concept: the owner (user_)
├── project_billing.md                   a concept: one area of the project (project_)
├── project_security_model.md            a concept, with one ## section for each sub-topic
├── reference_sandbox_setup.md           a concept: a route to a system or source outside the project (reference_)
├── event_sandbox_refresh_wipe.md        one episode, one file (event_)
└── decision_use_platform_events.md      one decision that matters beyond its work item (decision_)
```

- Every file sits at the top level. There are no subfolders: the index and the searches read only the top level.

## File names and prefixes

| Prefix | `metadata.type` | One file holds |
| --- | --- | --- |
| `user_` | `user` | a fact about the owner that he stated, such as his role |
| `project_` | `project` | one concept or area of this project |
| `reference_` | `reference` | a route to a source, system, or dashboard outside the project, and why to open it |
| `event_` | `event` | one episode: what was done and what resulted |
| `decision_` | `decision` | one decision that matters beyond its work item |

- The name is `<prefix>_<name>.md`: lower-case words joined by underscores, naming the concept, not one fact.
- A file with none of these five prefixes is left out of the index. `feedback_` is a retired prefix: an old `feedback_` file is marked in `record-format.md`, "Marks for what is not current", once its content has moved.
- `CURRENT_STATE.md`, `MEMORY.md`, `terminology-glossary.md`, and the two seeds have fixed names and no prefix of the five.

## Size limits

- A concept file holds about 20 sections or 300 lines at most. A bigger one is two concepts.
- A file name is at most 60 characters before `.md`.

## Making a file from a seed

1. Copy the seed to the new name, with `MAIN` set as in `SKILL.md`: `cp "$MAIN/memory/project_topic_template.md" "$MAIN/memory/project_billing.md"`. Use `project_topic_template.md` for a `project_`, `user_`, `reference_`, or `event_` file, and `decision_template.md` for a `decision_` file.
2. Set `name` to the file name without `.md`, `metadata.type` to its prefix, and `status` to the real status (`record-format.md`, "Status"). `template` never stays.
3. Fill every header field and the first section with real, sourced text. Keep `## Gotchas and lessons` last, holding "None yet.".
4. Remove the fill-in guide comment, the final template comment, and every angle-bracket prompt.

## Renaming, retiring, and deleting

- **Rename.** Rename the file, change `name` (and `metadata.type` when the prefix changes), and set `updated`. Links point at the file name, so search for the old name and repoint each link and each `supersedes:` line (`searching.md`, "Links to a file").
- **Retire or replace.** The file stays where it is, marked as `record-format.md` says. The index drops it at the next session start.
- **Delete.** Deleting removes the one file: `rm "$MAIN/memory/<file>.md"`. `memory/` is not in Git and has no backup, so nothing can bring a deleted file back. Then repoint or remove each link to it, as for a rename.
