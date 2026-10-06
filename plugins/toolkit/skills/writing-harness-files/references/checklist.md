# Checklist by kind of file

This file gives, for each kind of harness file, the practices that the official pages ask for and the way to check a change. Use it at steps 3 and 6 of `SKILL.md`, after you have read the official page, so that no practice is missed and every change is checked before a reviewer sees it.

Every section ends with a line that starts "Check:". That line is the check that step 6 of `SKILL.md` asks for.

The practices were checked against the official pages on 2026-10-05 (Claude Code 2.1.289, Codex 0.160). When a page says something different, the page is right.

## Contents

- Skill
- Rule
- AGENTS.md and CLAUDE.md
- Hook
- Settings file
- Codex .rules file
- Output style
- Plugin manifest or marketplace file
- Mod
- Subagent definition or helper-agent brief

## Skill

- A skill is a folder that holds `SKILL.md`, plus `references/` and `assets/` as needed. Add `scripts/` only when the project allows scripts in skills.
- The front matter is the block of fields between two `---` lines at the top of `SKILL.md`. Its `name` field equals the folder name: lowercase letters, digits, and hyphens, 64 characters or fewer, with no hyphen at the start or the end and no two hyphens in a row. It holds neither "anthropic" nor "claude".
- `description` is required by the Agent Skills standard and by Codex, and is 1,024 characters or fewer. Claude Code cuts the text it lists for one skill at 1,536 characters.
- Codex reads only `name`, `description`, and `metadata.short-description` from the front matter. A field that only Claude Code reads, such as `when_to_use`, `allowed-tools`, `paths`, or `disable-model-invocation`, does nothing in Codex. So a skill that both products read must work with `name` and `description` alone.
- The description says what the skill does and when to use it, in the third person, with the words the owner would say. Put the main use first. When the list of skills is over its budget, Codex cuts each description from the end, and Claude Code drops whole descriptions, starting with the skills used least. Keep it far below the limit: every session reads every description.
- Name a neighbour skill in the description only where the two compete: "Not for ...; use <skill>."
- `SKILL.md` stays under 500 lines. It opens as the writing rule says a document opens, then gives the steps, then a table that links every file in the folder and says when to open it.
- A reference over 100 lines starts with a contents list. References link from `SKILL.md`, not from each other.
- A skill names its own files by a path from the skill folder, and reads no file outside that folder.
- In Claude Code a personal or project skill with the name of a built-in command or a bundled skill replaces it. A personal or project skill named `verify` or `simplify` is run before each commit. Choose another name unless that is the purpose.
- Claude Code loads a skill in a `.claude/skills/` folder below the folder a session started in once the agent reads or edits a file there. A copy of a skill kept in a repository as a template is loaded this way.

Check: run the project's skill checks when the project has them. After a new or changed name or description, test in each product that reads the skill that it is chosen for three requests that should choose it and not for three that should not.

## Rule

A rule is a Markdown file in `.claude/rules/`. Claude Code loads it. Codex does not read that folder. Codex has a `rules/` folder of its own for a different kind of file: see "Codex .rules file".

- One topic per file, with a file name that says the topic.
- One specific instruction per bullet, under one heading.
- A rule with no `paths` line loads in every session, so keep it short.
- `paths` is the only front matter field Claude Code reads in a rule. Give a rule a `paths` line only when it is about certain files. It then loads when the agent reads, writes, or edits a matching file, and not when it runs a command or answers a question.
- A procedure with several steps goes in a skill, not in a rule.
- The project's `AGENTS.md` must tell Codex which rule files to read, and when.

Check: open a session in Claude Code, read a matching file when the rule has `paths`, and confirm in `/context` that the rule is loaded. In Codex, confirm the agent read the rule the way `AGENTS.md` tells it to.

## AGENTS.md and CLAUDE.md

- The file holds what every session needs and nothing else. Keep each file under 200 lines.
- Write instructions that are specific and can be checked.
- Codex reads `AGENTS.md`. Claude Code reads `CLAUDE.md`; it reads `AGENTS.md` by itself only when no `CLAUDE.md` or `CLAUDE.local.md` is in the working folder or above it (Claude Code 2.1.277 or later). A `CLAUDE.md` that holds the one line `@AGENTS.md` makes both products read one text in every case.
- In Claude Code, a folder's `CLAUDE.md` loads when the agent reads, writes, or edits a file in that folder. The folder's `AGENTS.md` loads by itself only when the agent reads a file there and the folder has no `CLAUDE.md`.
- Codex loads the `AGENTS.md` of each folder from the project root down to the folder it was started in, and no other. So the root file must tell Codex to read a folder's file before it works there.
- Codex stops adding instruction files once they reach 32 KiB together, unless the owner's settings raise that limit.
- A procedure goes in a skill. What a hook or a check can enforce goes there, not in a sentence.

Check: open a session in each product, read a file in the folder, and confirm the text is loaded.

## Hook

- A hook does one job.
- A hook must never break a session. On its own error it prints one line and exits normally, unless stopping the action is its job.
- It needs nothing installed beyond its runtime, and it finishes fast.
- Claude Code reads hooks from the `hooks` key of a settings file. Codex reads them from a `hooks.json` file or from `[hooks]` tables in `config.toml`, in `~/.codex/` and in the project's `.codex/` folder.
- A plugin's hooks file wraps its events in a top-level `hooks` key.
- The exit code and the output stream decide what the agent sees and whether the action is stopped. They differ by event and by product. Read the page for the event you use.
- Codex runs a project's hooks only after the owner trusted the project folder, and runs a new or changed hook entry only after the owner trusted it in `/hooks`. Tell the owner when an entry changes.
- New code needs the owner's yes when the project says so.

Check: run the command by hand with a sample input for the event, once for the normal case and once for a failing case. Add or update its test.

## Settings file

- Claude Code has three files a person changes: `~/.claude/settings.json` for every project, `.claude/settings.json` for everyone who works on the project, and `.claude/settings.local.json` for one person in one project. The local file wins over the project file, and the project file over the user file.
- Change the file whose reach matches the purpose. A setting for one project never goes in the user file.
- Add to the file; never replace entries you did not write.
- Never put a key, a token, or a password in a settings file that Git tracks.
- Read the page for the key before you rely on it: some keys are read from only some of the files.

Check: confirm the file still parses, then confirm in a session that the setting is in force.

## Codex .rules file

A `.rules` file tells Codex which commands it may run outside the sandbox. Only Codex reads it. Claude Code sets command permissions in a settings file.

- The feature is experimental. Read the page again before every change.
- The file sits in a `rules/` folder beside a Codex settings layer: `~/.codex/rules/` for every project, `<repo>/.codex/rules/` for one project. Codex loads a project's rules only after the owner trusted the project's `.codex/` folder.
- Codex reads the files when it starts. Tell the owner to restart Codex after a change.
- Each rule is one `prefix_rule(...)` call, written in Starlark:
  - `pattern` is required: the list of words the command starts with. One position may hold a list of alternatives.
  - `decision` is `allow`, `prompt`, or `forbidden`. With none, it is `allow`.
  - `justification` is optional: the reason, in words the owner can read. For `forbidden`, name the command to use in its place.
  - `match` and `not_match` are example commands. Codex tests them when it loads the file.
- When several rules match one command, the strictest decision applies: `forbidden`, then `prompt`, then `allow`.
- Give every rule at least one `match` and one `not_match` example.
- Codex splits a `bash -lc` script into its commands only when the script is plain words joined by `&&`, `||`, `;`, or `|`. A script with a redirect, a substitution, a variable, a wildcard, or control flow is tested as one `bash -lc` command.
- Codex writes `~/.codex/rules/default.rules` itself when the owner allows a command in a session. Add to that file; never replace it.

Check: `codex execpolicy check --pretty --rules <file> -- <command>`, once with a command the rule must match and once with one it must not. The answer names the decision and the rules that matched.

## Output style

An output style is a Markdown file of instructions that Claude Code sends with every request in a session. Only Claude Code reads it.

- The file sits in `~/.claude/output-styles/` for every project or `.claude/output-styles/` for one project. A plugin ships output styles in its `output-styles/` folder.
- Every front matter field is optional: `name` (with none, the file name), `description`, and `keep-coding-instructions`. A plugin's style may also set `force-for-plugin`. Claude Code ignores a misspelled field without an error.
- `keep-coding-instructions: true` keeps Claude Code's own software engineering instructions. Without it, a custom style leaves them out. Set it in a style that changes only how replies are written.
- A style is chosen by the `outputStyle` key of a settings file. The value must equal the style's name, letter for letter, with the same capitals. A value that matches no style gives the default style, with no error.
- Keep the style short: its text is sent with every request.
- Codex never sees an output style. In Claude Code a helper agent does not get it either, except a fork, which inherits the style of the session it was forked from. Give them the path of the writing rule. `SKILL.md`, step 5, says which file is the writing rule.
- A style is an instruction, and nothing enforces it. What must happen every time goes in a hook.
- In the terminal, Claude Code reads style files when it starts. Tell the owner to restart it after a change.

Check: start a new session and run `/output-style` with no argument. It lists the styles and marks the one in use.

## Plugin manifest or marketplace file

- Claude Code reads `.claude-plugin/plugin.json`. Codex reads a `plugin.json` at the plugin's root in the Agent Plugins format; `.codex-plugin/plugin.json` is the older form and still works. A plugin for both carries the same `name` and `version` in each manifest.
- A marketplace file lists the plugins a folder or repository offers. Claude Code reads `.claude-plugin/marketplace.json`. Codex reads `.agents/plugins/marketplace.json`, in a repository or in the home folder. The two files have different fields: read the page for the product before you add one.
- `claude plugin validate` refuses a plugin name that starts with `claude-`, `anthropic-`, `anthropics-`, or `cc-plugin-`.
- A `version` in the manifest pins the plugin: a person who installed it gets a change only after the version is raised. Raise it with every shipped change.
- Codex loads every `SKILL.md` under a plugin's `skills/` folder as a skill of the plugin. No official page says how to keep one out. In a test with Codex 0.160 on 2026-10-05, Codex did not load a `SKILL.md` below a folder whose name starts with a dot. Test it again before you rely on it.

Check: `claude plugin validate <folder>`. For Codex, install the plugin into a scratch `CODEX_HOME`, never the owner's own, and list the skills it loads.

## Mod

- A mod is a Claude Code plugin whose `hooks/hooks.json` names a JavaScript or TypeScript module. Codex cannot run one.
- The feature is new and changes between releases. Read the pages again before every change.

Check: `claude plugin validate <folder>` lists what the mod hooks and calls. `claude plugin test` runs its tests with no session.

## Subagent definition or helper-agent brief

- A Claude Code subagent definition is a Markdown file in `.claude/agents/`. A Codex custom agent is a TOML file in `.codex/agents/`. Neither product reads the other's file.
- A helper starts with only the brief. State the goal, the helper's own part, the files to read first, what it must not change, how to verify the work, and what to report.
- Tell the helper to report only on its own part.
- Give the helper the writing rule in the brief: its path, or its text when the helper cannot open it. `SKILL.md`, step 5, says which file is the writing rule. A helper does not get the output style that the replies of the main session follow.
- Ask it to mark what it verified and what it inferred.

Check: read the brief as if you knew nothing else. Every file it names exists, and every instruction has one meaning.
