# Building the setup copy

The setup copy is the files that the project would get from the toolkit today, built in a temporary folder, so that they can be compared with the project's own files in an update or a check of the setup. The job is done when the temporary folder holds `every-project/` and the `files-to-add/` folders of the project's choices, with the project's name and "Toolkit settings" filled in and each choice's lines applied.

A setup folder is a folder in this skill that holds project files at the paths a project has them: `every-project/`, and each `files-to-add/` folder under `choices/`. `every-project/` goes to every project. Each choice of the owner adds one or more.

## Make the temporary folder

Make one temporary folder for this job, outside the project: in Claude Code, inside the session scratchpad when the system prompt names one; otherwise a new folder from `mktemp -d`. Never save its path in a file of the project.

## Copy the setup folders

Copy `every-project/` into the temporary folder first, hidden files included. Then copy each `files-to-add/` folder of the choices that the project's "Toolkit settings" records, into the paths the earlier folders made, because a chosen folder adds files inside skill folders that `every-project/` supplied.

- Copy `choices/notion-shared/files-to-add` once, even when work items and memory are both in Notion.
- With local or Hindsight memory, also copy `choices/memory/repository-records/files-to-add`, which holds `DECISIONS.md` and `wiki/product-wiki/`.
- Leave out `.agents`, `.DS_Store`, and `*.log`. The project has its own `.agents/skills` link, and the other two are files that macOS and a local run leave in a folder.

Every file is copied whole. In the copy, change only what the sections below and the setup files of the project's choices name. Every other line stays as it was copied.

## Apply each choice's lines

The "what it adds" reference of each choice gives the lines that the choice adds to a file of the full layout: the settings files, "Toolkit settings" in `PROJECT.md`, `AGENTS.md`, `.gitignore`, and `.ignore`. Make those changes in the copy, and configure the memory choice's startup module as its reference says, with the project's verified identifiers.

## The project name and "Toolkit settings"

Take each value from the project's own `PROJECT.md`.

- Replace `<Project name>` with the project's name in `AGENTS.md`, `README.md`, and `PROJECT.md`, on heading lines only. The fill-in guide comments that name `<Project name>` stay as they are.
- In `PROJECT.md`, "People and ownership", put the owner's row from the project's own `PROJECT.md` in place of the example row. [setup-interview.md](setup-interview.md), "Project and owner (question 1)", gives the form of that row.
- Leave every example ID in the copied files as it is, whatever prefix the project uses. The example IDs are `WI-31`, `WI-031`, `[[WI-031]]`, `[[WI-031|<item name>]]`, `DEC-001`, `SRC-###`, and `SEC-04`. The skills read the real prefix from "Toolkit settings".
- Give `PROJECT.md`, "Toolkit settings", the Tracker and Memory values and the lines of each choice, each with the value that the project's own line holds.

## The owner's own files

Two files are the owner's own from the first day: `.claude/rules/owner-preferences.md`, which every project gets, and, in a Salesforce project, `.claude/rules/salesforce-agent-permissions.md`. Setup and "update the toolkit" copy each only into a project that has none, and never compare or replace it afterwards.
