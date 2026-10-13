# Toolkit V2

Toolkit V2 gives Claude Code and Codex the instructions to run a project for Mike Rihm. The owner decides and steers. The agent does the work, keeps the project records current, and saves lasting knowledge in the chosen memory system.

The toolkit consists of written procedures, project files, host settings, and three small hook commands. It has no custom setup program. The agent follows the setup skill and copies the files.

## How Toolkit V2 is defined

Mike defines the intended behavior in [Product Wiki](wiki/product-wiki/). The plugin implements that behavior. Existing implementation text can contain an assumption or an older decision; it is not evidence that Mike approved it.

- [Guiding design principles](wiki/product-wiki/Toolkit%20Guiding%20Design%20Principles.md) explain the agent's role and the freedom it retains.
- [Setup process](wiki/product-wiki/Toolkit%20Setup%20Process.md) gives the interview and the outcomes of setup.
- [Project structure](wiki/product-wiki/ToolkitV2%20Structure.md) describes the project files and what each choice adds.
- [Persistent memory](wiki/product-wiki/Toolkit%27s%20Definition%20of%20Persistent%20Memory.md) defines what belongs in memory and its metadata.

Toolkit work is tracked in the [Toolkit V2 Notion project](https://app.notion.com/3edb381da17681eeb7ddd0a6d662f9b2). Work items hold the request, questions, decisions, progress, and approval. When the wiki and implementation differ, the agent checks the relevant owner decisions before changing behavior.

## What the plugin supplies

The `toolkit` plugin has one entry skill, [project-setup](plugins/toolkit/skills/project-setup/SKILL.md). It sets up a new project, helps an existing project adopt the toolkit, checks a setup, and updates an installed toolkit.

The skill has these parts:

| Folder | What it holds |
| --- | --- |
| `reference/` | Supporting setup, finishing, and update procedures. |
| `every-project/` | The files, shared skills, rules, settings, and hooks every project receives. |
| `choices/work-items/` | Modules for work items in local files, Notion, or GitHub Issues. |
| `choices/memory/` | Modules for memory in local files, Notion, or Hindsight. Local and Notion memory share one memory process. |
| `choices/notion-shared/` | Tools and guidance shared by Notion work items and Notion memory. |
| `choices/salesforce/` | Salesforce setup, rules, skills, and delivery templates. |

A choice module holds its setup procedure, focused reference files, and complete files to add when needed. Setup copies only the choices the owner confirms. A project may add tools or change the defaults; the agent records those choices and supports them.

This repository also has a local [writing-harness-files](.claude/skills/writing-harness-files/SKILL.md) skill. It guides changes to instructions, skills, rules, settings, and hooks using current official documentation and independent review. It is separate from the plugin's entry skill.

## Set up a project

Open Claude Code or Codex in the project's main folder and say **“set up this project.”** The agent examines what is already there and asks the interview questions in order, one question at a time. Answers the folder already shows are confirmed together.

The interview records the project name, purpose, people and authority, systems and production environments, work tracker, memory system, Salesforce needs, outside tools, working relationship, source material, and roadmap. For each selected module, the agent shows its defaults and records any changes the owner wants.

The agent preserves existing files and records. Before replacing an existing file, it shows the difference and gets approval. Before creating or changing something outside the project folder, it gets approval for the destination and the named change. Examples include Notion pages, GitHub labels, a Hindsight bank, and host configuration.

The agent checks the completed files, settings, and chosen services. It reports setup steps only the owner can complete, such as signing in or trusting hooks. A new session loads the completed setup.

For an existing toolkit project, say **“check the setup”** or **“update the toolkit.”** The [update procedure](plugins/toolkit/skills/project-setup/reference/update.md) explains the comparison, preservation of owner choices, and treatment of existing records. Checking can rebuild a generated index and restore missing toolkit guides or templates in ignored local folders; it preserves existing records.

## How the agent maintains a project

Every project has these shared records:

| Record | What it owns |
| --- | --- |
| `PROJECT.md` | Stable project facts and confirmed setup choices. |
| `DECISIONS.md` | Decisions and open questions needed across work items. |
| `wiki/product-wiki/` | The approved description of what the system should do. |
| `sources/` | Material received from someone, kept unchanged with its provenance. |
| `wiki/reference/` | Material to look up, including verified observations of the system today. |
| `delivery/` | Releases, deployments, migrations, and handoffs. |

The [filing-project-records](plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md) skill maintains shared decisions, sources, and approved system records. The project guides route stable facts, observed system details, and delivery records to their appropriate files. The [managing-work-items](plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md) skill manages the work lifecycle and uses the installed tracker instructions.

The agent updates work-item status, questions, tasks, and history as work changes. A question or decision that spans items goes in `DECISIONS.md`, with pointers in the affected items. At closure, the agent checks what should remain useful for later work and files it in the appropriate project record. The owner approves the result before an item is marked Done.

Memory holds lasting project knowledge that another record does not already own. The agent searches and reads before saving or correcting memory, preserves sources and supersession history, verifies saves, and cites what it recalls. Memory informs an answer; a saved claim still needs appropriate evidence before the agent relies on it.

A project with local or Notion memory has a short Current State for the next session. A Hindsight project has no local memory folder or Current State. Active work remains in its chosen tracker, and qualifying lasting knowledge goes through Hindsight.

Working files belong in `working-files/`, which Git ignores. Local work items and local memory are also ignored and remain in the main checkout. The agent preserves them during branch work and toolkit updates.

## What loads when

Skill descriptions tell the agent which procedure applies. The selected `SKILL.md` supplies the essential steps and points to supporting files, which the agent reads when the task needs them.

| Hook command | When it runs | What it supplies |
| --- | --- | --- |
| `session-start.mjs` | At session start or compaction | Current State and the local memory index when applicable; a reminder to reread active records after compaction. |
| `prompt-reminder.mjs` | On an owner message | The owner-request rule and reminders to use relevant skills and the chosen memory instructions. |
| `codex-after-commit.mjs` | After a Codex commit | A reminder to keep the work item current. |

Host settings also remind the agent to update a work item after helper work. Hooks remind the agent; they do not decide what to save or approve a result.

## Install the plugin

The installation changes host configuration. Run it yourself or authorize the agent to do so. Replace `<toolkit-v2 folder>` with the path of your copy of this repository.

```bash
claude plugin marketplace add <toolkit-v2 folder>
claude plugin install toolkit@toolkit-v2
claude plugin enable toolkit@toolkit-v2 --scope user
codex plugin marketplace add <toolkit-v2 folder>
codex plugin add toolkit@toolkit-v2
```

After a plugin version changes, update the marketplace and installed plugin using the host's supported commands. Updating the plugin gives setup the latest source files. Each existing project receives those files when its owner asks to update the toolkit there.

## Change the toolkit

Change `plugins/toolkit/skills/project-setup/every-project/` for shared project content, or the appropriate module under `choices/` for a selected feature. Preserve owner decisions and necessary behavior, keep reference routes current, verify the affected workflows, and raise the version in both plugin manifests and the Claude marketplace metadata.

[AGENTS.md](AGENTS.md) gives this repository's instructions and checks. [reference](wiki/reference/) contains evidence of Mike's ways of working. [archive](archive/) contains earlier setup material and tools; the plugin ships neither folder.
