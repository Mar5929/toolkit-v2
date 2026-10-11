# Memory storage (local files)

Use these storage instructions to read, save, find, and change a memory record or the project's Current State. This project keeps both as Markdown files in the `memory/` folder. The goal is that every skill reads and writes memory the same way. A save is done only when you have read the file back and the change is there.

Two names are used in every file of these storage instructions:

- A memory record is what memory holds about one subject, such as the client's plans or one meeting. Here it is one file in `memory/`.
- The project's Current State is the project's one short page of what is true now. Here it is the file `memory/CURRENT_STATE.md`.

These storage instructions cover how to store memory. Open `references/memory-process.md` to decide what to keep, when to ask the owner, and what to tell the owner.

## Contents

- Where memory is kept
- Steps for every read and every save
- Mistakes to avoid
- Work that another skill does
- References

## Where memory is kept

- Memory is Markdown files in `memory/` in the main checkout. The main checkout is the project's main folder: the first path that `git worktree list` prints. Never commit these files. `references/folders-and-files.md` starts with a picture of the whole folder.
- The project folder is an Obsidian vault, which is a folder that the note app Obsidian opens. So the owner can read and edit these files too.
- One file holds one subject or area, with a `##` section for each sub-topic. Each file has three parts:
  - a header, which is the block of fields between the two `---` lines at the top of the file. `references/record-format.md` lists its fields and its statuses;
  - a `# ` title;
  - its sections.
- `MEMORY.md` is the index: a list with one line for each memory file. Never edit `MEMORY.md` by hand.
  - The session-start hook is a command that runs when a session starts. It rebuilds the index from each file's title, `description`, and `updated` date, grouped by the prefix of the file name, such as `project_`. It prints one line per file.
  - The hook leaves out each file whose status is `retired` or `superseded`, and the template.
  - When a line of the index is wrong, the title, `description`, `updated`, or `status` in its file is wrong. Correct the file.
  - The index is only as new as the last session start. To find a memory record that was saved in this session, search the files.
- `CURRENT_STATE.md` holds what is true now. The session-start hook prints it at the start of a session. `references/folders-and-files.md`, section "The project's Current State", says how to change it.
- `project_topic_template.md` is the template for a memory file. It has `status: template`. Copy it to make a new file. Never write a memory record into it.

`managing-project-memory` calls a memory record current, replaced, or retired. When you read or set a status, open `references/record-format.md`, section "Status". It gives the `status` value that a file stores for each of those three words.

## Steps for every read and every save

1. Find the main checkout, and put its path in `MAIN` with this line:

   ```bash
   MAIN="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"
   ```

   `memory/` is kept only in the main checkout, even when this session runs in a worktree. A worktree is a separate folder with its own branch.
   - Each shell command starts with no values from the command before it. So begin every command that uses `$MAIN` with that line and a `;`, in the same command.
   - When the project is not a Git repository, that line prints nothing. Then set `MAIN` to the project folder, which is the folder that holds `AGENTS.md`.
   - Never run a command with an empty `MAIN`.
   - When the folder in `MAIN` has no `memory/` folder, stop and tell the owner. A new clone of the repository has no `memory/` folder, and neither has another computer. So an empty result there shows nothing about what was recorded.
2. Read the whole file in this turn, and read it again right before you change it. The owner edits these files by hand in Obsidian, and a newer edit must not be overwritten.
3. Make the change the way the matching reference file says. The References table at the end of this file names the file for each job.
   - Change only the lines that change. Keep every other line, heading, and body label. A body label is one of the bold labels of a section, such as `**Remember:**`.
   - Maintain the header metadata as `references/record-format.md` says.
   - Never rewrite the whole file.
4. Read the file back.
   - Check that what you wrote is there, and that the file passes the list in `references/record-format.md`, section "A file is right when".
   - After a delete, check that the file is gone.
   - When the save failed, or what you read back differs from what you wrote, the change is not saved. Report it as not saved to the procedure that asked for it.

## Mistakes to avoid

- Put each entry of the header field `work_items` in double quotes, with the work item's ID first, as in `"[[WI-031]]"`. Without the quotes, `#12` is a YAML comment, and the entry is lost.
- Write each body label as a bold paragraph, such as `**Remember:**`, and never as a `##` heading. A `##` heading starts a sub-topic.
- Skip every file with `status: template`. That file is the template, and not a memory record. The commands in `references/searching.md` skip it.
- Never `git add` anything under `memory/`, not even with `-f`.
- Memory is kept only in the main checkout. When this session runs in a worktree, change memory in the main checkout. Never copy memory into the worktree.
  - When the active session blocks a write to the main checkout, use its supported approval mechanism only when approval is required and permitted. When no permitted route is available, tell the owner which save is blocked and what action is needed. Never write the memory record into the worktree instead.
- In zsh, a `*` pattern that matches nothing stops the whole command. Use the commands in `references/searching.md` as written.

## Work that another skill does

| For | Use |
| --- | --- |
| Deciding what to save, when to save it, and when to ask the owner; what each part of the project's Current State holds | `managing-project-memory` |
| What a work item's line says under Now, which is a part of the project's Current State | `managing-work-items` |

## References

| File | Open it when |
| --- | --- |
| [references/folders-and-files.md](folders-and-files.md) | You need to see how the folder looks; choose a file name and prefix; make a file from the template; rename, retire, or delete a file; keep records focused; or read or change the project's Current State. |
| [references/record-format.md](record-format.md) | You write or check a file. It gives the header fields and dates, the statuses, how to mark a memory record that was replaced or retired, the body labels, the links to memory files and work items, the lessons, the Runs table of a recurring job, and the list that says when a file is right. |
| [references/searching.md](searching.md) | You need to find or read memory. It gives the commands for every file's summary and status, a search by topic, by work item, by status, or by date, the lessons, and the links to a file. |
