---
name: writing-harness-files
description: 'Uses current official Claude Code and Codex guidance to write or change skills, rules, agent guides, hooks, settings, plugin files, and other harness files. Use before creating or editing one of these files. For toolkit setup, use project-setup.'
---

# Writing harness files

Use this skill to write or change a file that tells Claude Code or Codex how to behave. It is one of these kinds: a skill, a rule, an `AGENTS.md` or `CLAUDE.md`, a hook, a settings file, a Codex `.rules` file, an output style, a plugin manifest or marketplace file, a mod, a subagent definition, or a helper-agent brief. A hook includes its command and its entry in a settings or hooks file.

The finished file follows current official guidance for its kind. A reader who opens it alone can follow it after one read. The owner is the person the agent works for and one of the file's readers.

Get current official guidance before writing. Claude Code and Codex can change between releases.

Setting up or updating the toolkit in a project is the job of `project-setup`.

## Steps

1. Name the kind of file you will change. Identify whether Claude Code, Codex, or both read it.
2. Get the current official guidance for that kind of file. [references/official-pages.md](references/official-pages.md) says how, and gives the address of the official page for each kind of file and each product.
   - In Claude Code, first use the agent or skill that Claude Code provides for the job, when it is available. That file names the one for each job.
   - When none is available, open the address of the page. Always do so for a Codex page.
   - For a skill, read the skill best practices page every time, together with the Claude Code skill page and the Codex skill page: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
   - Use a copy that the project keeps only when it was captured in the last 14 days. Otherwise, read the live page.
   - When you cannot read the page, tell the owner before you write. Name the page, and say that the change is based on the checklist alone.
3. Open the section for that kind of file in [references/checklist.md](references/checklist.md). It gives the practices and checks for the file. If the live page and checklist differ, follow the page. Tell the owner which checklist line needs correction.
4. Read the project's own rules for these files in its root `AGENTS.md`. Then read two existing files of the same kind in the project, and match their form.
5. Write the change.
   - Follow the project's `.claude/rules/document-clarity-standard.md` when it exists. The owner may have changed that file.
   - In a folder without that rule, follow [references/writing-rule.md](references/writing-rule.md). It is an exact copy of the rule that `project-setup` gives every project.
   - A file that both products read uses only what both support.
6. Check the change the way the checklist section says under "Check".
7. Have an agent that did not write the change review it against the official page, the checklist, and the writing rule. Fix each confirmed finding and have the reviewer read the fix. A small edit gets one reviewer and one read.
   - If the product cannot start a helper agent, review the change yourself against all three sources. Tell the owner in step 8 that no separate review ran.
8. Tell the owner which pages you read and their dates, what you changed, and what the review found.

A project may require the owner's yes before a rule, a skill, or a hook changes. Get that yes before step 5.

## Rewriting a file that exists

When the job is to make a skill, a rule, or an agent guide clearer without changing what it requires, follow [references/rewrite-steps.md](references/rewrite-steps.md) in place of steps 5 to 7. An agent guide is an `AGENTS.md` or a `CLAUDE.md`. That file gives the order of work, the checks that prove no rule changed, and a prompt for a team that rewrites many files.

## Briefing a helper agent

A helper agent starts with only its brief. When a helper will change a harness file, the brief does four things:

- It names the kind of file and the products that read it.
- It tells the helper to use this skill. When the helper cannot load skills, the brief gives it the page addresses and the checklist section for that kind of file.
- It gives the helper the path of the writing rule, or the text of that file when the helper cannot open it. Step 5 says which file is the writing rule. A helper does not get the output style that the replies of the main session follow, so the helper has no other writing rules.
- It says that a separate agent reviews the change.

## References

| File | Open it when |
| --- | --- |
| [references/official-pages.md](references/official-pages.md) | Step 2: you need the official page for a kind of file. |
| [references/checklist.md](references/checklist.md) | Steps 3 and 6: you need the practices and the check for a kind of file. |
| [references/writing-rule.md](references/writing-rule.md) | Step 5, and every rewrite: you need the writing rules. The file is an exact copy of the rule `.claude/rules/document-clarity-standard.md`. |
| [references/rewrite-steps.md](references/rewrite-steps.md) | The job is to rewrite a file that exists: you need the order of work, the checks, and the prompt for a team. |
