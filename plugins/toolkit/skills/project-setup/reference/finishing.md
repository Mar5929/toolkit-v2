# Finishing setup

This file is the last step of a setup: Step 6 in [SKILL.md](../SKILL.md). Open it when the owner has answered the questions and each answer has added its part. Its job is done when all of these are true:

- every answer of the interview is written in its place, and the prompts in the project's files hold facts that the owner confirmed;
- the roadmap is written, and with local or Notion memory the first lines of the project's Current State are written too;
- the final checks have run;
- the owner has been told the steps that only the owner does;
- the reply ends with the report and the commit offer.

Other jobs of this skill use single sections of this file. For example, "check the setup" runs "Final checks" to inspect and report, with the generated-index and missing-template maintenance described there.

## Contents

- Fill the prompts
- Instructions the owner gives during setup
- SOUL.md
- The roadmap
- The project's Current State
- Final checks
  - The checks
  - After the checks
  - The final checks in "check the setup"
- The owner's steps
- The report
- The commit offer
  - After the owner's yes
  - After the commit

## Fill the prompts

The files that setup copied into the project hold prompts. A prompt is text in angle brackets (`<angle bracket>`) that says which fact to write in its place. Each of those files starts with a fill-in guide comment, which says how to fill the file.

Fill a prompt only with a fact that the owner confirmed. Three rules apply to every part below:

- Never invent a fact to fill a prompt.
- Setup is never a work item. Never create a work item for a setup step.
- Never add a made-up question to finish setup.

Go through these parts:

1. **The project's outcome**, from question 2. The sentence is the owner's answer. It is never a sentence worked out from the code, the tests, or the README. It goes in every one of these places:
   - the outcome line of `AGENTS.md`, which is the line under the title that starts with the prompt `<One sentence describing this project and its outcome.>`;
   - the one-sentence line under the title of `README.md`;
   - "Intended outcome" in `PROJECT.md`;
   - each further place that a step of a choice's setup file names for the finish of setup.

   When the owner gave no sentence, leave the outcome prompts, and list them in the report.
2. **The other answers.** Fill the root `AGENTS.md` work tracking and memory paragraph using [project-store-summary.md](project-store-summary.md), after the selected stores have been checked. Fill its "Project memory" section with the text that the memory choice's "what it adds" reference gives. Check each answer against the table in [SKILL.md](../SKILL.md), Step 4, which gives the place for each one.
3. **The "Build, test, or deploy" row** under "Commands" in `AGENTS.md`. Fill it when the owner gave the commands during the interview. Otherwise leave the prompt, and list it in the report with what the repository shows as a suggestion, for example `npm test`.
4. **The other prompts of `PROJECT.md` and `README.md`.** Follow the fill-in guide of each file.
   - Fill a prompt only with a fact that the owner gave or confirmed in this session. A fact that a file in the repository shows is a suggestion: offer it to the owner, and write it after the owner's yes.
   - The "In scope" and "Outside scope" lines in `PROJECT.md` describe the product. They never describe setup choices or toolkit files.
   - A file keeps its fill-in guide comment for as long as the file holds a prompt. Delete the guide when the last prompt is filled.
5. **Decisions and system documentation** hold only confirmed content. With local or Hindsight memory, use `DECISIONS.md` and `wiki/product-wiki/`. With Notion memory, use the configured wiki destinations and the Notion memory module's documentation guidance.
6. **The fill-in guide comments.** Delete each fill-in guide comment when its own text says to delete it. Keep the guide comment inside "Toolkit settings", because later sessions read it.

## Instructions the owner gives during setup

When the owner gives an instruction for how the agent works, add the instruction to `.claude/rules/owner-preferences.md`. Examples are "don't touch my real Notion pages" and "ask me before you push". In a Salesforce project, an instruction about what an agent may do in an org goes in `.claude/rules/salesforce-agent-permissions.md`, as the step on the org aliases in the Salesforce setup file, [choices/salesforce/salesforce-setup.md](../choices/salesforce/salesforce-setup.md), says.

- Write the instruction as one list line in the owner's words.
- Put the line under an area that the file's layout comment names. Use General when no area fits.
- End the line with `(<YYYY-MM-DD>, <owner name>, in chat)`.
- Say in the report that the instruction was saved.
- Write nothing else in `owner-preferences.md` during setup.

A setup answer is not an instruction. These answers never go in `owner-preferences.md`: whether the owner uses Claude Code, Codex, or both; where work items and memory are kept; the project name; and the outcome.

`owner-preferences.md` is the owner's own file from the first instruction on. In a Salesforce project, `salesforce-agent-permissions.md` is too.

## SOUL.md

`SOUL.md` is the owner's own description of how the agent should work with the owner and the project team. Every project gets the file.

- Fill each prompt with the owner's own words, from question 9, and show the owner the text.
- Delete the file's fill-in guide after the owner's yes to the text.
- When the owner wants no `SOUL.md` in this project, delete the file.

## The roadmap

The roadmap is the project's phases: what each phase is for, which phases are done, which phase the project is in now, and what comes next. Write it from the owner's answers to question 11, in the place where the project keeps its work items.

The setup file of the work items choice says where the roadmap is kept, in its step for the finish of setup. Write it straight into that place, as [SKILL.md](../SKILL.md), Step 4, says for every record of a setup.

Write only what the owner confirmed. Show the owner the roadmap after you wrote it.

## The project's Current State

The project's Current State is the project's one short page of what is true now. A project with local or Notion memory has one, and setup writes its first lines. The setup file of the memory choice says where it is kept.

A Hindsight project has no Current State and no `memory/` folder. Where the work stands is in the place where work items are kept, so the rest of this section does not apply to a Hindsight project. For a Hindsight project, write each of the owner's steps that is still open as a project task, with the project's `managing-work-items` skill, so that a later session finds it. Use the words that the "Waiting on" line below gives, and name each step in the report too.

With Notion memory, verify the published librarian package and selected host access, then initialize the existing Current state sections through [choices/memory/notion/notion-memory-setup.md](../choices/memory/notion/notion-memory-setup.md). Record the current priorities, deadlines, open setup steps and next action from the interview. Keep the copied page's structure and verify the update.

With local memory, keep the five headings concise and retain what a later session needs. The list below says what to write on the "Last updated" line and under each of the five headings:

- Last updated: the date, "setup", and "agent".
- Now: the work that is going on now, from question 11, or "None."
- Coming up: each dated event or deadline that the owner named, or "None."
- Waiting on: one line for each of the owner's steps that is still open. "The owner's steps" below lists the steps. Each line starts with "Owner:" and ends with "Setup step; remove this line when it is done."
- Standing jobs and shared files: "None."
- Next session starts with: the next step on the roadmap, from question 11.

Then delete the file's fill-in guide comment, as the comment says.

## Final checks

Run each check alone, from the project folder. The checks show that setup worked. Most checks only read; the local session-start command may rebuild the generated memory index. In "check the setup", the next section also allows restoration of missing toolkit guides and templates in the ignored folders. They do not test whether the project matches the toolkit: a project that holds more than setup gave it, such as a skill or a rule of its own, is as it should be.

### The checks

1. **The settings files are valid.** Run `jq empty .claude/settings.json`, and the same command for `.codex/hooks.json`, and for `.mcp.json` when present. The command prints nothing when a file is valid JSON.
2. **The session-start command runs.** With local or Notion memory, `node .claude/hooks/session-start.mjs --memory <memory> </dev/null` must print the project's Current State. `<memory>` is the value of the Memory line in "Toolkit settings": `local` or `notion`. The setup file of the memory choice gives the full command when the choice adds to it. A Hindsight project has no Current State, so this check does not apply to it. The Hindsight setup file, [choices/memory/hindsight/hindsight-setup.md](../choices/memory/hindsight/hindsight-setup.md), gives the checks of that choice.
3. **Codex reads the same skills as Claude Code.** `ls -la .agents` must show `skills -> ../.claude/skills`.
4. **"Toolkit settings" is complete.** The Tracker and the Memory line of `PROJECT.md`, "Toolkit settings", each name a choice, and the section holds the lines that the setup file of each of the owner's choices adds. A line may still lack its value only when the value waits on the owner. "People and ownership" in `PROJECT.md` must name the owner. Its record-home links and related pointers must agree with the verified memory choice; retain existing homes until a migration is verified. Check the root `AGENTS.md` paragraph with [project-store-summary.md](project-store-summary.md); it must name this project’s current tracker and memory destinations.
5. **Git does not track `work-items/` or `memory/`.** `git ls-files -- work-items/ memory/` must print nothing. For local work items, `git check-ignore work-items/PROJECT-TASKS.md` must print that path. For local memory, `git check-ignore memory/CURRENT_STATE.md` must print that path. These checks inspect existing paths and create no sample records.
6. **Each choice.** For each choice of the owner, do the checks that its setup file gives.

### After the checks

- When a check fails, fix what the check found, then run the check again.
- Report each check that you cannot make pass, with what it printed.
- Keep the setup copy until the job that made it has finished using it. In "check the setup", remove it after the report and any missing-template restoration. In an update, [reference/update.md](update.md), "6. Checks and report", removes it after the merge and the changes to ignored folders. The removal command is `rm -rf <copy>`. The setup copy is the files the project would get today, built in a temporary folder, as [reference/setup-copy.md](setup-copy.md) says.

### The final checks in "check the setup"

"Check the setup" compares and reports; it does not repair the project's configuration or replace existing files. Two maintenance actions are allowed: the local session-start hook may rebuild `memory/MEMORY.md`, and the check restores missing toolkit guides and templates in the ignored folders from the list below. Name each restored file in the report.

Git does not track `work-items/` or `memory/`, so Git cannot restore their missing toolkit files. The restoration adds missing guides and templates only; it never changes an existing file or an owner's record.

When one of the files listed below is missing in the main checkout, create its parent folder if needed with `mkdir -p <main checkout>/<parent folder>`. For example, the work-item templates need `work-items/work-item-template/`. Then copy the missing file from the setup copy with `cp -n <copy>/<file> <main checkout>/<file>`, and name the file in the report. The `-n` option never replaces a file. The main checkout is the project's main folder, the first path that `git worktree list` prints.

- With local work items, the files are `work-items/AGENTS.md`, `work-items/CLAUDE.md`, `work-items/work-item-template/WORK-ITEM.md`, and `work-items/work-item-template/DESIGN.md`.
- With local memory, the files are `memory/AGENTS.md`, `memory/CLAUDE.md`, and `memory/project_topic_template.md`.

## The owner's steps

The table lists the steps that the owner does in every project. The setup file of each choice names the steps that its choice adds, such as a sign-in. Say each step plainly, with the reason for it, and wait where a later step needs it. Never do one of these steps for the owner.

| Step | Why | Needed when |
| --- | --- | --- |
| Trust the project folder in Codex. | Until the folder is trusted, Codex ignores the project's `.codex/config.toml` and `.codex/hooks.json`. Trust is tied to the folder path, so it is needed again after a move. | Always, the first time the owner opens the project in Codex |
| Trust the hooks in Codex: type `/hooks` and trust them. | Codex skips a hook until it is trusted, and again after any change to its entry in `.codex/hooks.json`. A change to a `.mjs` file that the hook runs is not reviewed again. | Always. Again after "update the toolkit" changes an entry in `.codex/hooks.json`. |
| Open the project folder as an Obsidian vault. | The owner can then browse the project's records, and local work items and memory, with their links. The project's `README.md` says how. | Optional |
| Start a new session in each of Claude Code and Codex. | Some parts load only at session start, such as `CLAUDE.md`, `AGENTS.md`, and the rules. Claude Code picks up edits to skills and to most settings in the running session. It needs `/reload-plugins` for a plugin installed or changed during the session, and `/reload-skills` after each change to a skills folder made during the session. For Codex, or when unsure, start a new session. | Always |
| Say yes to committing the setup files. | New worktree sessions (the Claude desktop app, the Codex app) see only committed files. A worktree is a separate folder with its own branch. | Always |

## The report

Give the owner a short, plain report. It has these parts, in this order:

1. **What was set up.** Say where work items and memory are kept, whether the project is a Salesforce project, how many skills it has, the three hook commands, where the roadmap is, and each line that was added to `owner-preferences.md`, in the owner's words. Then tell the owner that they can say at any time how they want the agent to work, such as "always ask me before you push", and that the agent saves each such instruction in `.claude/rules/owner-preferences.md`.
2. **What was made outside the project folder.** Name the Notion pages, the GitHub repository and labels, the Hindsight bank, and the add-on's changes in `~/.claude`, `~/.codex`, and `~/.hindsight`.
3. **What was skipped**, and why.
4. **What the owner must do**, each step with the reason for it.
5. **The final checks.** Say that all passed, or name each check that did not pass, with its fix.
6. **The prompts that are left**, grouped by file, each with the fact it needs in a few words.
   - Find them with `grep -n '<[A-Za-z][^>]*>' AGENTS.md README.md PROJECT.md | grep -v '<!--'`. Run the same `grep` on each further file that the setup file of a choice names.
   - Then skip the lines where the angle brackets are part of a file name or a path pattern, and not a prompt: `<ID>.md`, `<ID>-<short-slug>/`, `<ID>-test-plan.md`, and `<release>-test-plan.md`.
7. **The last line** is the commit offer, which the next section gives.

## The commit offer

The setup files are not committed yet, and the first merge of a work item needs them committed. So the reply ends with an offer to commit them.

Say in one line why the commit matters now. The reason is this: sessions that start in their own worktree (the Claude desktop app, the Codex app) see only committed files. Until this commit, those sessions get no `AGENTS.md`, skills, or hooks. When the app starts worktrees from the remote, they get none until this commit is also pushed.

The reply's last line is:

> Setup files are not committed. Commit them now?

### After the owner's yes

In a new project, the setup commit is made on the default branch, with no worktree and no pull request. In an existing project, it is made on the branch that holds the changes, and that branch is merged only after the owner's yes. Do these steps in order:

1. Stage each file that setup wrote or changed, by name, and the `.agents/skills` link.
   - List the candidates with `git status --short --untracked-files=all`. Plain `git status --short` shows a new folder, and not the files in it.
   - A file that the owner already had, and that setup did not write or change, stays unstaged. An example is the owner's own code that Git does not track yet.
2. Read what is staged.
   - Read `git diff --cached --name-status`. It must list no file under `work-items/` or `memory/`.
   - Read `git diff --cached --stat` for the files that setup copied in.
   - Read `git diff --cached -- <file>` for each file that the project had before setup and that setup merged or changed (`.gitignore`, settings files).
   - `git diff --cached --check` may list template lines that end with two spaces. Those lines are Markdown line breaks, so leave them.
3. Commit with a plain message and no AI credit, for example `git commit -m 'Set up Toolkit V2'`.
4. Push only after the owner's yes.

### After the commit

In a new project, ask about a push next, as its own question, when both of these are true: the project has the remote `origin`, and `git ls-remote --heads origin <default>` prints nothing. An example is a repository that setup just created. `<default>` is the default branch, usually `main`. The question is:

> Push <default> to <owner>/<repo>? The first pull request needs <default> on GitHub.

After the owner's yes, run `git push -u origin <default>`.

After the commit, and the push when it was asked, end the reply with the next step on the roadmap, and ask the owner whether to start it.
