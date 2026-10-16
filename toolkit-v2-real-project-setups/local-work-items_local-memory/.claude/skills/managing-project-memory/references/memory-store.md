# Memory storage (local files)

## Layout

- Memory is Markdown in `memory/`, in the main checkout only. From a worktree, read and write the main checkout's copy. Never commit it, not even with `git add -f`.
- If `memory/` is missing, tell the owner. A fresh clone has none, so its absence proves nothing about what was recorded.
- One file per subject, named `<type>_<subject>.md` (`user_`, `project_`, `reference_`, `event_`). Make new files from `memory/project_topic_template.md`; never write into the template.
- `memory/CURRENT_STATE.md` is Current State.
- `memory/MEMORY.md` is an index the session-start hook rebuilds. Never edit it; if a line is wrong, fix the file it comes from. It's only as fresh as the last session start, so search the files for anything saved this session.
- The folder is an Obsidian vault and the owner edits it by hand. Re-read a file right before changing it, and change only the lines that change.

## Header fields

Every memory file carries these fields:

- `name`: the file name without `.md`.
- `description`: the fact itself with its dates, as the index shows it.
- `type`: `user`, `project`, `reference`, or `event`.
- `status`: `current`, `superseded` (the first body line names the replacement), `retired`, or `template`.
- `created`: never changes. `updated`: set to today on every edit.
- `check_by`: a date for temporary facts, otherwise `none`. A single section with its own date gets a `**Check or remove by:**` line.
- `supersedes` and `superseded_by`: filename stems, linked both ways, or `none`.
- `work_items`: entries in double quotes, `"[[WI-031]]"`. Without them, YAML reads `#` as a comment.
- `provenance`: where the evidence is, with dates and paths or IDs a later session can follow.

## Body

Each sub-topic is a `##` section. Labels such as `**Remember:**` are bold paragraphs, never headings. "Gotchas and lessons" comes last and says "None yet." until the first lesson. A recurring job keeps a `## Runs` table.
