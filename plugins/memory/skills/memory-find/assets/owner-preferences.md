<!-- Generated file. Source: plugins/memory/shared/owner-preferences-template.md. Edit the source, then run node dev/tools/sync-skill-references.mjs. -->
# Owner Preferences

How the owner wants the agent to work in this project. Follow every line, every session. Each line ends with the date and where the instruction came from. Change this file only with `toolkit rule add` or `toolkit rule update`, after the owner says so.

<!-- Layout guide: this is the layout of .claude/rules/owner-preferences.md. Never create or edit that file by hand: `toolkit rule add` creates it with the title and lead paragraph above on the owner's first instruction, adds each later instruction to its area's section, and rebuilds the AGENTS.md rules list so Codex reads the file. `toolkit rule update` changes or removes one line. The file for every project, ~/.claude/rules/owner-preferences.md (written with --machine), has the same layout under the title "Owner Preferences for Every Project". Each area is one "## " section, named by --section. Each instruction is one list line in the owner's words, ending with the date and the source in parentheses; the command writes the date. The file has no `paths` frontmatter, so it applies to every file in every session. Lines the toolkit did not write are kept as they are. The sections below show the usual areas; a new file holds only the areas that have an instruction. -->

## Replies

- <One instruction in the owner's words, for example "Lead every status reply with the answer."> (<YYYY-MM-DD>, <owner name>, in chat)

## Questions

- <One instruction> (<YYYY-MM-DD>, <owner name>, in chat)

## Testing

- <One instruction> (<YYYY-MM-DD>, <owner name>, in chat)

## Git

- <One instruction> (<YYYY-MM-DD>, <owner name>, in chat)

## Work items

- <One instruction> (<YYYY-MM-DD>, <owner name>, in chat)

## Memory

- <One instruction> (<YYYY-MM-DD>, <owner name>, in chat)

## General

- <One instruction> (<YYYY-MM-DD>, <owner name>, in chat)
