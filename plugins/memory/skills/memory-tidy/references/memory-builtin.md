<!-- Generated file. Source: plugins/memory/shared/memory-builtin.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Built-in memory: the `.memory/` folder and Obsidian

Purpose: how built-in memory is laid out on disk, how its links work in
Obsidian, what the toolkit repairs by itself, and what to do after the owner
edits notes in Obsidian.

## Contents

1. Where it lives
2. The files
3. The index, `MEMORY.md`
4. Links, the Obsidian way
5. Link repair
6. The hooks
7. When the owner edits notes in Obsidian
8. Checking the folder
9. Backup

## 1. Where it lives

- `.memory/` sits in the main checkout of the project. Every Git worktree of
  the project reads and writes the same folder: the toolkit finds it from the
  main checkout, so a worktree never has its own memory.
- Git ignores it. It exists only on this computer until it is backed up
  (section 9).
- The owner can open the folder as an Obsidian vault. Obsidian's own
  settings folder (`.memory/.obsidian/`) is his. The toolkit never reads it
  as memory, but backups copy it, and `toolkit import` compares it like any
  other file. A restore conflict only in `.obsidian/` files (for example
  `workspace.json`, which Obsidian rewrites while it is open) is Obsidian's
  own state, not memory.
- The agent writes it only with `toolkit memory` commands. They lock the
  folder while they write, refuse a stale `--expect`, write through a
  temporary file, read the result back, and rebuild the index.

## 2. The files

| File | What it is | Written by |
| --- | --- | --- |
| `<type>_<slug>.md` | One record (a "topic"). Status `current`, `needs-review`, or `superseded` | `toolkit memory save`, `retire`, `restore`, `rename`, `approve` |
| `archive/<key>.md` | An archived record (retired with no replacement) | `toolkit memory retire` |
| `MEMORY.md` | The generated index | Every write command, and `toolkit memory reindex` |
| `CURRENT_FOCUS.md` | The current focus | `toolkit memory focus` |
| `terminology-glossary.md` | The glossary | `toolkit memory glossary` |
| `memory-criteria.md` | What is worth saving; the project's own copy, which the owner may change | The owner |
| `AGENTS.md` | The folder's rules for agents | The model |
| `project_topic_template.md` | The seed template (status `template`); never listed as a record | The model |
| `.toolkit-meta.json` | Last save, last action, last export time | The toolkit |
| `.lock` | Held while a toolkit command writes | The toolkit |

Only files named `<type>_<slug>.md` in the folder itself or in `archive/`
are records. The toolkit reads no other subfolder.

## 3. The index, `MEMORY.md`

The model's layout: its title and short paragraph, one `##` section per type
(User, Feedback, Project, Reference, Event), then "Other memory views" (the
current focus, the memory criteria, the glossary). Each record is one line:

```markdown
- [feedback_no_force_push.md](feedback_no_force_push.md) — Never force-push to any branch
```

| Record | Its line |
| --- | --- |
| Current | No mark |
| Needs review | Ends with "[needs-review]" |
| A proposal | Ends with "[proposal: not a fact until the owner answers]" |
| Superseded | Stays, ends with "[superseded]"; its body starts with a line naming the replacement |
| Archived | Not listed; the file is in `archive/` |

The index is a pointer list. Open a record before relying on its line. Never
edit `MEMORY.md`: the pre-tool hook refuses it, and the next write replaces
it. `toolkit memory status` warns when the index passes 150 lines or 25,000
bytes; the fix is a memory tidy, never cutting the index.

## 4. Links, the Obsidian way

- A record links another record with a relative Markdown link to its file
  name: `[deploy window](project_deploy_window.md)`. Obsidian shows the
  link, and a backlink on the target, so a reverse link is optional.
- The agent never writes `[[wikilinks]]`. The toolkit still reads and
  repairs a wikilink the owner typed.
- Link only when it helps a future session find the record, and check the
  target exists first.
- An archived record sits in `archive/`, so its own links point one folder
  up. The toolkit rewrites them when it moves the file.
- Things outside memory (work items, `DECISIONS.md`, files in
  `requirements/` or `system-guide/`, tracker addresses) are plain text under
  **Authoritative records**, never vault links.

## 5. Link repair

When a record changes, the command repairs every link to it in the other
records, in `CURRENT_FOCUS.md`, and in the glossary, and names each note it
changed:

| The record was | A link to it becomes |
| --- | --- |
| Renamed (`rename`, or a save with `--supersedes`) | A link to the new file |
| Superseded (`retire --superseded-by`) | A link to the replacement |
| Archived (`retire` alone) | The link text followed by "(archived)", no link |
| Deleted (`delete`, or a rejected proposal) | The link text only, no link |
| Restored, or saved as current again after being archived | The file moves out of `archive/`, and its own links keep working. Links in other notes that became "<words> (archived)" stay plain text: put each back (the full restore in `replacing-and-retiring.md`, section 7) |

Read the report. It also names notes whose links could not be repaired, with
the reason; fix each one with `toolkit memory save` and `--expect`. A link
must never point at a former location.

## 6. The hooks

- The pre-tool hook refuses a hand edit of `MEMORY.md`.
- When the agent changes a record file with the file edit tool, the
  post-tool hook rebuilds the index under the lock. That is a repair, not
  permission: change records with `toolkit memory` commands.
- The session briefing reads `.memory/` directly, so a change shows in the
  next session at once.

## 7. When the owner edits notes in Obsidian

His edits do not pass through any hook, so check with
`toolkit memory status` when he says he edited memory, or when the status
lists a problem. His edit wins; never undo it. Tell him in one line what you
found.

| What he did | What the toolkit sees | What to do |
| --- | --- | --- |
| Changed a note's body text | The new text is the record; its version changed | Nothing. Read it again (`--json`) before any update |
| Changed frontmatter so it breaks a rule (for example a `metadata.type` that differs from the file name prefix) | `status` names the file and the rule; a record with no readable frontmatter, or a bad type or status, is skipped | Tell him. With his yes, save it again or rename it with the toolkit commands |
| Renamed a note to another `<type>_<slug>.md` name | A new key. `status` reports that `name` does not match the file name, and lists links that Obsidian did not update | Ask which name he wants. Keep his: save the record again under the new key with `--expect`, which writes the matching `name`, then fix each broken link `status` names (save that note with `--expect`). Go back: `toolkit memory rename <new-key> --to <old-key>` |
| Renamed a note to a name that is not `<type>_<slug>.md` (for example `Deploy window.md`) | Not a record any more: list, find, and the index leave it out; links to it show as broken | Tell him. With his yes, save its text under a proper key with `toolkit memory save`, and ask him to remove the loose file |
| Moved a note into a subfolder other than `archive/` | Not read at all; links to it show as broken | The same as the row above |
| Moved a note into `archive/` by hand | `status`: "is in archive/ but its status is current" | Ask if he meant to archive it. Yes: `toolkit memory retire <key>`. No: `toolkit memory reindex` moves it back |
| Deleted a note | `status` says the index is out of date, and lists each link to it in other notes as broken | Ask if he meant it. Yes: fix each link `status` names (keep the link's words, drop the link) with a save and `--expect`, then `toolkit memory reindex`. No: he takes the file back from the trash (the system trash, or `.memory/.trash/` when Obsidian keeps its own), then `toolkit memory reindex` |
| Created a new note himself | Read when the file name and frontmatter follow the format | Run `status`; report any problem it names |
| Edited `CURRENT_FOCUS.md` or the glossary | Read as it is | Read with `--json` before a change, so his edit is kept |
| Edited `MEMORY.md` | Replaced at the next write | Tell him the index is generated |

After his edits, rebuild the index when `status` says it is out of date:

```text
toolkit memory reindex
```

`reindex` also moves a record to the folder its status needs, rewrites an
older toolkit record in the model's format, and sets every file to mode 644.
It never writes the seed files, and it never changes a record's meaning.

Obsidian settings that match this format, to suggest when he starts editing
notes in Obsidian (Settings, then Files and links): "Use [[Wikilinks]]" off,
"New link format" set to "Relative path to file", and "Automatically update
internal links" on. With these, a link he adds has the toolkit's form, and a
rename in Obsidian updates the links in the other notes.

## 8. Checking the folder

```text
toolkit memory status
```

It prints the backend, where memory lives, the last save and the last
export, the record counts, and each problem with its fix: an out-of-date
index, a broken link, a name that does not match its file, a record in the
wrong folder, a focus over 50 lines or without its title or `Last updated:`
line, a file that is not mode 644, or a `.lock` left behind. Never delete a
`.lock` by hand: the next toolkit command takes it over when the process
that made it is gone or it is older than 30 seconds.

## 9. Backup

- With a backup folder set (`backup.dir` in `.toolkit.json`),
  `toolkit work finish`, the handoff's last step, and the session start
  (when the last backup is more than a day old) copy `.memory/`, with
  `.obsidian/`, to `<backup.dir>/<project key>-<YYYY-MM-DD>/memory/` by
  themselves. A second backup on the same day replaces that day's copy.
- By hand: `toolkit memory export --to <folder>` copies every record (retired
  ones too), the focus, and the glossary to a folder outside the project, in
  the same layout as `.memory/`. `toolkit export --to <folder>` copies
  `.memory/` together with a local tracker's `.work-items/`.
- `toolkit doctor` warns when no backup folder is set or the last backup is
  old.
- A fresh clone or a new computer has no `.memory/` until it is restored.
  Never treat an empty index there as "nothing was ever saved": restore
  first.
