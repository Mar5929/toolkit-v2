# Finishing setup

This file is the last step of a setup: Step 6 in `SKILL.md`. Open it when the owner has answered the questions and each answer has added its part. Its job is done when all of these are true:

- every answer of the interview is written in its place, and the prompts in the project's files hold facts that the owner confirmed;
- the roadmap and the project's Current State are written;
- the final checks have run;
- the owner has been told the steps that only the owner does;
- the reply ends with the report and the commit offer.

Other jobs of this skill use single sections of this file. For example, "check the setup" runs "Final checks" without fixing anything.

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
   - "Project outcome" in `PROJECT-ROADMAP.md`, when the project has local work items;
   - the "Desired Outcome" field of the project's row in Notion, when the project has its project page in Notion because its work items or its memory are kept there. Read the row back after you write it. The page's "Project brief" prompts (Overview/Context, Goals, Success criteria) stay until the owner gives them. List them in the report with the prompts that are left.

   When the owner gave no sentence, leave the outcome prompts, and list them in the report.
2. **The other answers.** Check each answer against the table in `SKILL.md`, Step 4, which gives the place for each one.
3. **The "Build, test, or deploy" row** under "Commands" in `AGENTS.md`. Fill it when the owner gave the commands during the interview. Otherwise leave the prompt, and list it in the report with what the repository shows as a suggestion, for example `npm test`.
4. **The other prompts of `PROJECT.md` and `README.md`.** Follow the fill-in guide of each file.
   - Fill a prompt only with a fact that the owner gave or confirmed in this session. A fact that a file in the repository shows is a suggestion: offer it to the owner, and write it after the owner's yes.
   - The "In scope" and "Outside scope" lines in `PROJECT.md` describe the product. They never describe setup choices or toolkit files.
   - A file keeps its fill-in guide comment for as long as the file holds a prompt. Delete the guide when the last prompt is filled.
5. **`DECISIONS.md` and the documents in `system/`** hold no prompt. Write into them only a decision or a rule that the owner confirmed, in the form that the guide of each gives.
6. **The fill-in guide comments.** Delete each fill-in guide comment when its own text says to delete it. Keep the guide comment inside "Toolkit settings", because later sessions read it.

## Instructions the owner gives during setup

When the owner gives an instruction for how the agent works, add the instruction to `.claude/rules/owner-preferences.md`. The owner's answers to question 9 are such instructions. Two more examples are "don't touch my real Notion pages" and "ask me before you push". In a Salesforce project, an instruction about what an agent may do in an org goes in `.claude/rules/salesforce-agent-permissions.md`, as `choices/salesforce/salesforce-setup.md`, "The org aliases", says.

- Write the instruction as one list line in the owner's words.
- Put the line under an area that the file's layout comment names. Use General when no area fits.
- End the line with `(<YYYY-MM-DD>, <owner name>, in chat)`.
- Say in the report that the instruction was saved.
- Write nothing else in `owner-preferences.md` during setup.

A setup answer is not an instruction. These answers never go in `owner-preferences.md`: whether the owner uses Claude Code, Codex, or both; where work items and memory are kept; the project name; and the outcome.

`owner-preferences.md` is the owner's own file from the first instruction on. In a Salesforce project, `salesforce-agent-permissions.md` is too.

## SOUL.md

`SOUL.md` is the owner's own description of how the agent should work with the owner and the project team. Every project gets the file.

- Fill each prompt with the owner's own words, from question 10, and show the owner the text.
- Delete the file's fill-in guide after the owner's yes to the text.
- When the owner wants no `SOUL.md` in this project, delete the file.

## The roadmap

The roadmap is the project's phases: what each phase is for, which phases are done, which phase the project is in now, and what comes next. Write it from the owner's answers to question 12, in the place where the project keeps its work items.

- With local work items, the roadmap is `PROJECT-ROADMAP.md`. Its fill-in guide says how to fill it. Write the file straight into the project folder, as `SKILL.md`, Step 4, says for every record of a setup.
- With work items in Notion or in GitHub Issues, the project's `managing-work-items` skill says how that place keeps a phase, in its `references/work-tracker.md`.

Write only what the owner confirmed. Show the owner the roadmap after you wrote it.

## The project's Current State

The project's Current State is the project's one short page of what is true now. Setup writes its first lines. Where you write them depends on where the project keeps its memory:

- With local memory or Hindsight memory, write the first lines of `memory/CURRENT_STATE.md`.
- With Notion memory, the Notion memory setup wrote these lines when it made the "Current state" page. Bring the lines of that page up to date.

Keep the five headings and their line limits. The list below says what to write on the "Last updated" line and under each of the five headings:

- Last updated: the date, "setup", and "agent".
- Now: the work that is going on now, from question 12, or "None."
- Coming up: each dated event or deadline that the owner named, or "None."
- Waiting on: one line for each of the owner's steps that is still open. "The owner's steps" below lists the steps. Each line starts with "Owner:" and ends with "Setup step; remove this line when it is done."
- Standing jobs and shared files: "None."
- Next session starts with: the next step on the roadmap, from question 12.

Then delete the file's fill-in guide comment, as the comment says.

## Final checks

Run each check alone, from the project folder. Each check only reads. The checks show that setup worked. They do not test whether the project matches the toolkit: a project that holds more than setup gave it, such as a skill or a rule of its own, is as it should be.

### The checks

1. **The settings files are valid.** Run `jq empty .claude/settings.json`, and the same command for `.codex/hooks.json`, and for `.mcp.json` when present. The command prints nothing when a file is valid JSON.
2. **The session-start command runs.** `node .claude/hooks/session-start.mjs --memory <memory> </dev/null` must print the project's Current State. `<memory>` is the value of the Memory line in "Toolkit settings": `local`, `notion`, or `hindsight`.
   - With Notion memory, add `--page <Current state page id>` to the command.
   - In Codex with Notion memory, run the command escalated. `SKILL.md`, "Known problems", says under "In Codex" how Codex runs a command that way. Inside the sandbox the command prints "could not be read here". That text comes from the sandbox, and it is not a setup failure.
3. **Codex reads the same skills as Claude Code.** `ls -la .agents` must show `skills -> ../.claude/skills`.
4. **"Toolkit settings" is filled.** The "Toolkit settings" section of `PROJECT.md` must hold no prompt, except a prompt that waits on the owner. "People and ownership" in `PROJECT.md` must name the owner.
5. **Git does not track `work-items/` or `memory/`.** `git status --short` must list nothing under `work-items/` or `memory/`.
6. **The services.** For each service that the project uses, do the check that the service's own file gives:
   - Notion: the check that starts "For a new project" under "Checks after any of these" in `choices/notion-shared/reference/notion-work-item-pages.md`;
   - GitHub Issues: the checks under "Checks after either" in `choices/work-items/github/github-work-items-setup.md`;
   - Hindsight: the check under "Check a Hindsight project, or connect a new computer" in `references/hindsight-on-vps.md`.

### After the checks

- When a check fails, fix what the check found, then run the check again.
- Report each check that you cannot make pass, with what it printed.
- In an update or a check, remove the temporary folder that holds the setup copy after the checks: `rm -rf <copy>`. The setup copy is the files the project would get today, built in a temporary folder, as `reference/setup-copy.md` says.

### The final checks in "check the setup"

"Check the setup" is one of the jobs in `SKILL.md`, "A project that already has the toolkit". In that job, fix nothing. Report each failed check with the fix that you recommend.

With local memory, the session-start hook command may rebuild the generated index `memory/MEMORY.md`. That index is the one file a check may change.

"Check the setup" puts one kind of file back: a toolkit file that is missing from `work-items/` or `memory/`. Git does not track `work-items/` and `memory/`, so a toolkit file that was deleted there cannot be brought back from Git.

When one of the files listed below is missing in the main checkout, copy it from the setup copy with `cp -n <copy>/<file> <main checkout>/<file>`, and name the file in the report. The `-n` option never replaces a file. The main checkout is the project's main folder, the first path that `git worktree list` prints.

- With local work items, the files are `work-items/AGENTS.md`, `work-items/CLAUDE.md`, `work-items/work-item-template/WORK-ITEM.md`, and `work-items/work-item-template/DESIGN.md`.
- With local memory, the files are `memory/AGENTS.md`, `memory/CLAUDE.md`, and `memory/project_topic_template.md`.

## The owner's steps

The table lists the steps that the owner does. Say each one plainly, with the reason in the "Why" column, and wait where a later step needs it. Never do one of these steps for the owner. The "Needed when" column says when a step applies.

| Step | Why | Needed when |
| --- | --- | --- |
| Run `ntn login` in a terminal. | It signs the Notion command-line tool into the owner's account. It opens a browser. | Notion, when `ntn whoami` fails |
| Share the owner's Notion root page with "Notion CLI". | The agent can reach only shared pages. | Notion, when a call returns 404 |
| Run `gh auth login` in a terminal. | It signs the GitHub command-line tool in. | GitHub Issues, when `gh auth status` fails |
| Trust the project folder in Codex. | Until the folder is trusted, Codex ignores the project's `.codex/config.toml` and `.codex/hooks.json`. Trust is tied to the folder path, so it is needed again after a move. | Always, the first time the owner opens the project in Codex |
| Trust the hooks in Codex: type `/hooks` and trust them. | Codex skips a hook until it is trusted, and again after any change to its entry in `.codex/hooks.json`. A change to a `.mjs` file that the hook runs is not reviewed again. | Always. Again after "update the toolkit" changes an entry in `.codex/hooks.json`. With Hindsight, also the hooks of Hindsight's coding-agent add-on, after the add-on is installed |
| Install Salesforce's own skills. `choices/salesforce/salesforce-setup.md`, "Salesforce's skills", says where they come from in each host. | Salesforce publishes its own skills for Salesforce work. Setup never installs them. | Salesforce, when they are not installed yet |
| Connect the project's Salesforce org (`sf org login web --alias <alias>`) and tell the agent the alias. | The agent never picks or signs in to an org itself. | Salesforce, when the project's org does not exist yet or is not connected |
| Enter the Hindsight API key in the owner's own Terminal window, with the command that the agent gives, never in the session. | The add-on and setup read the key from `~/.hindsight/coding-agent.json`. The agent never sees the key. | Hindsight, when the key is not set yet |
| Sign in to the Hindsight dashboard with its own access key. | The dashboard asks for that key, not the API key, before it shows the bank. The bank is this project's store of memory on the Hindsight server. | Hindsight, the first time the owner opens the dashboard |
| Open the project folder as an Obsidian vault. | The owner can then browse the project's records, and local work items and memory, with their links. The project's `README.md` says how. | Optional |
| Start a new session in each of Claude Code and Codex. | The skills, hooks, and settings load at session start. | Always |
| Say yes to committing the setup files. | New worktree sessions (the Claude desktop app, the Codex app) see only committed files. A worktree is a separate folder with its own branch. | Always |

## The report

Give the owner a short, plain report. It has these parts, in this order:

1. **What was set up.** Say where work items and memory are kept, whether the project is a Salesforce project, how many skills it has, the three hook commands, where the roadmap is, and each line that was added to `owner-preferences.md`, in the owner's words.
2. **What was made outside the project folder.** Name the Notion pages, the GitHub repository and labels, the Hindsight bank, and the add-on's changes in `~/.claude`, `~/.codex`, and `~/.hindsight`.
3. **What was skipped**, and why.
4. **What the owner must do**, each step with the reason for it.
5. **The final checks.** Say that all passed, or name each check that did not pass, with its fix.
6. **The prompts that are left**, grouped by file, each with the fact it needs in a few words.
   - Find them with `grep -n '<[A-Za-z][^>]*>' AGENTS.md README.md PROJECT.md | grep -v '<!--'`. With local work items, run the same `grep` on `PROJECT-ROADMAP.md` too.
   - Then skip the lines where the angle brackets are part of a file name or a path pattern, and not a prompt: `<ID>.md`, `<ID>-<short-slug>/`, `<ID>-test-plan.md`, and `<release>-test-plan.md`.
   - When the project has its project page in Notion, also list the page's "Success criteria".
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
