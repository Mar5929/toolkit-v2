---
name: using-memory-store
description: 'Saves, finds, and changes project memory as Markdown files in the memory folder, so curating-project-memory reads and writes every memory the same way. Use when a memory must be read, saved, searched, renamed, retired, or deleted, such as "which memory files link to WI-031". Not for deciding what to keep or when to ask; use curating-project-memory. Only for projects with local memory.'
---

# Storing project memory (local files)

This skill holds the storage: where each part of memory is saved in local files, and how to find it again. It never decides what to keep, an approval, or what to tell the owner.

## Where memory lives

- Memory is Markdown files in `memory/` in the main checkout, never committed. `references/folders-and-files.md` starts with a picture of the whole folder. The project folder is an Obsidian vault, so the owner can read and edit these files too.
- One file holds one concept or area, with a `##` section for each sub-topic. Each file has a header (`references/record-format.md` lists its fields and statuses), a `# ` title, and its sections.
- `MEMORY.md` is the index. The start-of-session hook rebuilds it from each file's title, `description`, and `updated` date, grouped by prefix, and leaves out retired, superseded, and withdrawn files and the seeds. Never edit it by hand: a wrong line is a wrong title, `description`, `updated`, or `status` in its file, so fix the file. The index is only as new as the last session start; search the files for a memory saved in this session.
- `CURRENT_STATE.md` holds what is true now, and the same hook prints it at the start of a session. Change one line at a time.
- `project_topic_template.md` and `decision_template.md` are blank forms (`status: template`), called seeds. Copy a seed; never write a memory into one.

## Every time

1. Find the main checkout. `memory/` lives only there, even when this session runs in a worktree: `MAIN="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"`. Each shell command starts fresh, so begin every command that uses `$MAIN` with that line and a `;`, in the same command. It prints nothing when the project is not a Git repository: then set `MAIN` to the project folder, the one that holds `AGENTS.md`. Never run a command with an empty `MAIN`. No `memory/` folder there: stop and tell the owner. A fresh clone and another computer have none, so an empty result there shows nothing about what was recorded.
2. Read the whole file in this turn, and again right before you change it: the owner edits files by hand in Obsidian, and a newer edit must not be overwritten.
3. Make the change with the matching reference (Files below). Change only the lines that change, keep every other line, heading, and bold label, and set `updated` to today. Never rewrite the whole file.
4. Read the file back. Check that what you wrote is there and that the file passes `references/record-format.md`, "A file is right when". After a delete, check that the file is gone. Report a failed save or a different read-back as `curating-project-memory` says.

## Gotchas

- Put each `work_items` entry in double quotes, ID first: `"[[WI-031]]"`. Unquoted, `#12` is a YAML comment and is lost.
- Body labels are bold paragraphs (`**Remember:**`), never `##` headings. A `##` heading is a sub-topic.
- Skip every file with `status: template`: the seeds. The commands in `references/searching.md` skip them.
- Never `git add` anything under `memory/`, not even with `-f`.
- Memory lives only in the main checkout. From a worktree, change it there; never copy it into the worktree. In Codex, the sandbox can block a session in a worktree from writing outside it. The write then asks for approval or fails with a sandbox error: ask the owner to approve it. Never write the memory into the worktree instead.
- In zsh, a `*` pattern that matches nothing stops the whole command. Use the commands in `references/searching.md` as written.

## Hand-offs

| For | Use |
| --- | --- |
| Deciding what to save, when, and with whose OK | `curating-project-memory` |

## Files

| File | Open it when |
| --- | --- |
| [references/folders-and-files.md](references/folders-and-files.md) | Seeing how the folder looks; choosing a file name and prefix; making a file from a seed; renaming, retiring, or deleting a file; the size limits. |
| [references/record-format.md](references/record-format.md) | Writing or checking a file: header fields, statuses, the marks for a proposal or a replaced or retired memory, body labels, links to memories and work items, lessons, decision files, the glossary, and the checklist. |
| [references/searching.md](references/searching.md) | Finding or reading memory: every file's summary and status, a search by topic, by work item, or by status, lessons, and links to a file. |
