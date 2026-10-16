# Finishing setup

This file is the last part of a setup, for when the owner has answered the questions and each answer has added its part. Its job is done when all of these are true:

- every answer of the interview is written in its place, and the prompts in the project's files hold facts that the owner confirmed;
- the roadmap is written, and the memory choice's startup records are written;
- the final checks have run;
- the owner has been told the steps that only the owner does;
- the reply ends with the report and the commit offer.

Other jobs of this skill use single sections of this file. For example, "check the setup" runs "Final checks".

## Fill the prompts

The files that setup copied into the project hold prompts. A prompt is text in angle brackets (`<angle bracket>`) that says which fact to write in its place. Each of those files starts with a fill-in guide comment, which says how to fill the file.

Fill a prompt only with a fact that the owner confirmed, and never invent a fact or a question to finish setup. Go through these parts:

1. **The project's outcome**, from question 2. The sentence is the owner's answer. It is never a sentence worked out from the code, the tests, or the README. It goes in every one of these places:
   - the outcome line of `AGENTS.md`, which is the line under the title that starts with the prompt `<One sentence describing this project and its outcome.>`;
   - the one-sentence line under the title of `README.md`;
   - "Intended outcome" in `PROJECT.md`;
   - each further place that a choice's setup file names for the finish of setup.

   When the owner gave no sentence, leave the outcome prompts, and list them in the report.
2. **The other answers.** Fill the root `AGENTS.md` work tracking and memory paragraph using [project-store-summary.md](project-store-summary.md), after the selected stores have been checked. Fill its "Project memory" section with the text that the memory choice's "what it adds" reference gives. Check each answer against the interview table in [SKILL.md](../SKILL.md), which gives the place for each one.
3. **The "Build, test, or deploy" row** under "Commands" in `AGENTS.md`. Fill it when the owner gave the commands during the interview. Otherwise leave the prompt, and list it in the report with what the repository shows as a suggestion, for example `npm test`.
4. **The other prompts of `PROJECT.md` and `README.md`.** Follow the fill-in guide of each file.
   - Fill a prompt only with a fact that the owner gave or confirmed in this session. A fact that a file in the repository shows is a suggestion: offer it to the owner, and write it after the owner's yes.
   - The "In scope" and "Outside scope" lines in `PROJECT.md` describe the product. They never describe setup choices or toolkit files.
5. **Decisions and system documentation** hold only confirmed content. Use the homes that the root `AGENTS.md`, "Where information goes", gives for them; the memory choice supplied those rows.
6. **The fill-in guide comments.** Delete each fill-in guide comment when its own text says to delete it, and not before its file's last prompt is filled. Keep the guide comment inside "Toolkit settings", because later sessions read it.

## Instructions the owner gives during setup

When the owner gives an instruction for how the agent works, such as "don't touch my real Notion pages" or "ask me before you push", add it to `.claude/rules/owner-preferences.md` in the form that file's layout comment gives, and end the line with `(<YYYY-MM-DD>, <owner name>, in chat)`. Say in the report that the instruction was saved. Write nothing else in `owner-preferences.md` during setup.

In a Salesforce project, an instruction about what an agent may do in an org goes in `.claude/rules/salesforce-agent-permissions.md` instead, as the Salesforce setup file says.

A setup answer is not an instruction. These answers never go in `owner-preferences.md`: whether the owner uses Claude Code, Codex, or both; where work items and memory are kept; the project name; and the outcome.

## SOUL.md

`SOUL.md` is the owner's own description of how the agent should work with the owner and the project team. Every project gets the file.

- Fill each prompt with the owner's own words, from question 9, show the owner the text, and change it until the owner says yes.
- Delete the file's fill-in guide after the owner's yes to the text.
- When the owner wants no `SOUL.md` in this project, delete the file.

## The roadmap

The roadmap is the project's phases: what each phase is for, which phases are done, which phase the project is in now, and what comes next. Write it from the owner's answers to question 11, straight into the place where the work items choice keeps it; its setup file names that place. Write only what the owner confirmed, and show the owner the roadmap after you wrote it.

## The memory choice's startup records

The memory choice's `reference/finishing-memory-setup.md` says how to write its startup records from the interview and how to check them. The steps left for the owner go only in the report. Keep the confirmed roadmap in the selected work tracker.

## Final checks

Run each check from the project folder. The checks show that setup worked; they do not test whether the project matches the toolkit, so a project that holds more than setup gave it, such as a skill or a rule of its own, is as it should be.

1. **The settings files are valid JSON:** `.claude/settings.json`, `.codex/hooks.json`, and `.mcp.json` when present.
2. **The shared hook commands run.** `node .claude/hooks/session-start.mjs </dev/null` prints what the memory choice's startup check expects. The prompt reminder, run with a representative message, prints the installed reminder text.
3. **Codex reads the same skills as Claude Code.** `.agents/skills` is a link to `../.claude/skills`.
4. **"Toolkit settings" and the root guide agree with the choices.** The Tracker and Memory lines each name a choice, and the section holds the lines that each choice's "what it adds" reference gives. A line may lack its value only when the value waits on the owner. "People and ownership" in `PROJECT.md` names the owner. The root `AGENTS.md` summary paragraph names this project's tracker and memory destinations, as [project-store-summary.md](project-store-summary.md) says, and its "Project memory" section holds the memory choice's text with no prompt left. The memory choice's `managing-project-memory` skill is in `.claude/skills/`, and its `references/shared-record-paths.md` is in `publish-docs`.
5. **Each choice.** Run the checks that each choice's setup file gives.
6. **The humanizing resource is available.** The skill or plugin recorded under "Resources and project paths" in `PROJECT.md` is installed and can be invoked in each host the project uses. Report any unavailable resource and the setup action still needed.

When a check fails, fix what it found, then run it again. Report each check that you cannot make pass, with what it printed. Remove the setup copy once the job that made it has finished using it.

### What "check the setup" may change

"Check the setup" compares and reports; it does not repair the project's configuration or replace existing files. It makes two kinds of change, and names each in the report:

- The local session-start command may rebuild `memory/MEMORY.md`.
- When one of the toolkit guides or templates below is missing in the main checkout, copy it from the setup copy, making its parent folder if needed. Git does not track `work-items/` or `memory/`, so Git cannot restore these files. Never change an existing file or an owner's record.
  - With local work items: `work-items/AGENTS.md`, `work-items/CLAUDE.md`, and the two templates in `work-items/work-item-template/`, copied from `.claude/skills/managing-work-items/assets/` in the setup copy.
  - With local memory: `memory/AGENTS.md`, `memory/CLAUDE.md`, and `memory/project_topic_template.md`.

## The owner's steps

The table lists the steps that the owner does in every project. Each choice's setup file names the steps that its choice adds, such as a sign-in. Say each step plainly, with the reason for it, and wait where a later step needs it. Never do one of these steps for the owner.

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
6. **The prompts that are left**, grouped by file, each with the fact it needs in a few words. Search `AGENTS.md`, `README.md`, `PROJECT.md`, and each further file that a choice's setup file names. Angle brackets that are part of a file name or a path pattern are not prompts, such as `<ID>.md`, `<short name>/`, `<short name>-test-plan.md`, and `<release>-test-plan.md`.
7. **The last line** is the commit offer, which the next section gives.

## The commit offer

The setup files are not committed yet, and the first merge of a work item needs them committed. So the reply ends with an offer to commit them, with the reason: sessions that start in their own worktree (the Claude desktop app, the Codex app) see only committed files, so until this commit they get no `AGENTS.md`, skills, or hooks. When the app starts worktrees from the remote, they get none until this commit is also pushed.

### After the owner's yes

In a new project, the setup commit is made on the default branch, with no worktree and no pull request. In an existing project, it is made on the branch that holds the changes, and that branch is merged only after the owner's yes.

1. Stage each file that setup wrote or changed, by name, and the `.agents/skills` link. List the candidates with `git status --short --untracked-files=all`, because plain `git status --short` shows a new folder and not the files in it. A file that the owner already had, and that setup did not write or change, stays unstaged.
2. Read what is staged. `git diff --cached --name-status` must list no file under `work-items/` or `memory/`. Read the full staged difference for each file that the project had before setup and that setup merged or changed, such as `.gitignore` and the settings files. Template lines that end with two spaces are Markdown line breaks, so leave them.
3. Commit with a plain message and no AI credit, for example `git commit -m 'Set up Toolkit V2'`.
4. Push only after the owner's yes.

### After the commit

In a new project whose verified remote has no default branch yet, such as a repository that setup just created, ask about a push next, as its own question. Explain that the first pull request needs the default branch on the remote, and ask whether the owner wants to push it to the confirmed repository. After the owner's yes, push the default branch and set its upstream.

After the commit, and the push when it was asked, end the reply with the next step on the roadmap, and ask the owner whether to start it.
