# Putting the setup copy into the project

Purpose: copy the finished setup copy into the project without overwriting
a file the project already has, decide each file that differs with the
owner, and make the `.agents/skills` link. Run every command from the
project folder. `<copy>` is the scratch folder from `setup-copy.md`.

## 1. See what would change

```text
rsync -rcni <copy>/ ./
```

It writes nothing. Each line that starts with `>f` names a file:

- `>f+++++++` is a file the project does not have yet;
- any other `>f` line is a file the project has, with different content.

Lines for folders (`cd`) need nothing.

## 2. Copy the files the project does not have

```text
rsync -rlt --ignore-existing <copy>/ ./
```

It writes only missing files and never replaces one the project has. In a
new, empty folder this is the whole copy. Use `-rlt`, not `-a`: `-a` would
give the project folder the scratch folder's private permissions.

## 3. Files the project already has

For each file that differs, read the difference:

```text
diff -u <file> <copy>/<file>
```

| File | What to do |
| --- | --- |
| `.gitignore` | Add each line of the setup copy's file that the project's file lacks, at the end after one blank line. It only adds, so no question is needed. |
| `.claude/settings.json`, `.codex/hooks.json`, `.codex/config.toml`, `.mcp.json` | Merge the setup copy's entries into the project's file with the merge rules in `skills-hooks-settings.md`. Ask before changing any value the project already has. |
| `CLAUDE.md` with more than the line `@AGENTS.md` | Keep it. Ask whether to add the line `@AGENTS.md` at its top: while a `CLAUDE.md` exists, Claude Code reads `AGENTS.md` only through that line. |
| `AGENTS.md` without the two rules-list marker lines (a repository that had its own) | Keep it. Show the owner what the Toolkit V2 version adds. After his yes, add its sections and the rules list with both marker lines, and keep his text. |
| Every other file (`README.md`, a rule, a template) | In its table row, say in one line what differs, and recommend one: keep his, take the toolkit's, or merge the two. His file stays until he chooses. |

Show every file that needs his answer in one numbered table, one row per
file, each with a one-line reason, and ask once. Carry out each row as he
answers it; a "yes to all" applies every row as shown.

## 4. The .agents/skills link

Codex reads project skills from `.agents/skills`; Claude Code from
`.claude/skills`. The project keeps one copy, so a fix reaches both hosts:
`.agents/skills` is a link to `.claude/skills` (Codex follows linked
folders).

```text
mkdir -p .agents
ln -s ../.claude/skills .agents/skills
```

When `.agents/skills` is already a real folder:

```text
diff -r .agents/skills .claude/skills
```

- No difference, or only lines that start with "Only in .claude/skills"
  (every file in `.agents/skills` is also in `.claude/skills`, with the same
  content): tell the owner, and after his yes remove the folder and make the
  link.
- Anything else: stop and ask. It may hold his own Codex skills; after his
  yes, move each into `.claude/skills/` first.

Git stores the link as a link. Never replace it with copied folders to get
past a problem; tell the owner instead.

## 5. Check

```text
rsync -rcni <copy>/ ./
ls -la .agents
git status --short
```

- The first lists only files the owner chose to keep as his.
- `.agents` shows `skills -> ../.claude/skills`, and `ls .agents/skills`
  shows the skills.
- `git status` lists the new files and nothing under `work-items/` or
  `memory/`: Git ignores both.

Keep the scratch folder until the end of the final checks in `finishing.md`,
which says when to remove it.
