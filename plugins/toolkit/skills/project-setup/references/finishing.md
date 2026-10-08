# Finishing setup

This file is the last step of a setup: step 8 of "New project" in `SKILL.md`. Open it when the project's files are in place and the services that the project uses are set up. Its job is done when all of these are true:

- the prompts in the copied files hold facts that the owner confirmed;
- the project's Current State is written;
- the final checks have run;
- the owner has been told the steps that only the owner does;
- the reply ends with the report and the commit offer.

Other jobs of this skill use single sections of this file. For example, "check the setup" runs "Final checks" without fixing anything.

## Contents

- Fill the prompts
- Instructions the owner gives during setup
- SOUL.md
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

The copied files are the files that setup copied into the project. They hold prompts. A prompt is text in angle brackets (`<angle bracket>`) that says which fact to write in its place. The copied files start with a fill-in guide comment, which says how to fill the file.

Fill the prompts only with facts that the owner confirmed. Three rules apply to every step below:

- Never invent a fact to fill a prompt.
- Setup is never a work item. Never create a work item for setup steps.
- Never add made-up questions to finish setup.

Fill the prompts in this order:

1. **The project's outcome.** The outcome line of `AGENTS.md` is the line under the title that starts with the prompt `<One sentence describing this project and its outcome.>`. The sentence that goes there is the owner's answer. It is never a sentence worked out from the code, the tests, or the README.
   - Ask for the outcome as its own question, with a suggestion:

     > What should this project do for you, in one sentence? From the code I'd suggest: "Export invoices to the bank's CSV format every Friday."

   - Ask the question even when the owner described the project earlier in the session (one chat with the agent). In that case, offer the owner's earlier words as the suggestion. Write nothing until the owner answers.
   - After the owner answers, put the owner's sentence in place of the outcome prompt in every one of these places at once:
     - the outcome line of `AGENTS.md`;
     - the one-sentence line under the title of `README.md`;
     - "Intended outcome" in `PROJECT.md`;
     - "Project outcome" in `PROJECT-ROADMAP.md`, when the project has local work items.
   - When the project has its project page in Notion, because its work items or its memory are kept there, also put the owner's sentence in the "Desired Outcome" field of the project's row in Notion. Then read the row back.
     - The page's "Project brief" prompts (Overview/Context, Goals, Success criteria) stay until the owner gives them. List them in the report with the prompts that are left.
   - Until the owner answers, leave the outcome prompts in `AGENTS.md`, `README.md`, `PROJECT.md`, and, with local work items, `PROJECT-ROADMAP.md`. List them in the report.
2. **The "Build, test, or deploy" row** under "Commands" in `AGENTS.md`. Ask the owner, and give a recommendation from what the repository shows, for example `npm test`. When the project is new and empty, leave the prompt and list it in the report.
3. **`PROJECT.md` and `README.md`.** Follow the fill-in guide of each file.
   - Ask the owner only what the repository cannot answer.
   - Fill a prompt only with a fact that the owner gave in this session, or with a fact that a file in the repository shows.
   - The "In scope" and "Outside scope" lines in `PROJECT.md` describe the product. They never describe setup choices or toolkit files.
   - In a new project with no code yet, ask nothing more for these two files. Leave their prompts and list them in the report.
   - In a project with code, list in the report each value that you took from the repository, so that the owner can correct it.
   - A file keeps its fill-in guide comment for as long as the file holds a prompt. Delete the guide when the last prompt is filled.
4. **`PROJECT-ROADMAP.md`**, which only a project with local work items has. Fill it only when the owner already knows the facts. In a new project it usually stays as it is. List it in the report with the prompts that are left.
   - A project with its work items in Notion or GitHub has no `PROJECT-ROADMAP.md`. The project's phases go where the work items are kept, later, with `managing-work-items`.
5. **`DECISIONS.md`, the documents in `system/`, and `sources/README.md`** stay as they were copied. They hold no prompt, and each `system/` document says Status "Not started". Never write a decision, a rule, or a source into them during setup.
6. **The fill-in guide comments.** Delete each fill-in guide comment when its own text says to delete it. Keep the guide comment inside "Toolkit settings", because later sessions read it.

## Instructions the owner gives during setup

When the owner gives an instruction for how the agent works, add the instruction to `.claude/rules/owner-preferences.md`. Two examples of such an instruction are "don't touch my real Notion pages" and "don't use those orgs".

- Write the instruction as one list line in the owner's words.
- Put the line under an area that the file's layout comment names. Use General when no area fits.
- End the line with `(<YYYY-MM-DD>, <owner name>, in chat)`.
- Say in the report that the instruction was saved.
- Write nothing else in `owner-preferences.md` during setup.

A setup answer is not an instruction. These answers never go in `owner-preferences.md`: whether the owner uses Claude Code, Codex, or both; where work items and memory are kept; the project name; and the outcome.

The owner can give an instruction before the setup copy exists. The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. In that case, keep the instruction in the plan tool, and write it into `owner-preferences.md` when you build the setup copy. `SKILL.md`, "Which setup job to do", says which tool the plan tool is in Claude Code and in Codex.

## SOUL.md

`SOUL.md` is the owner's own description of how the agent should work with the owner and the project team. A project has the file only when the owner keeps one.

- When the owner said yes to `SOUL.md` in the interview, fill each prompt with the owner's own words, and show the owner the text. Delete the file's fill-in guide after the owner's yes to the text.
- When the owner turns `SOUL.md` down now, delete `SOUL.md`, as its fill-in guide says.

## The project's Current State

The project's Current State is the project's one short page of what is true now. Setup writes its first lines. Where you write them depends on where the project keeps its memory:

- With local memory or Hindsight memory, write the first lines of `memory/CURRENT_STATE.md` now.
- With Notion memory, the Notion memory setup already wrote these lines on the "Current state" page, in step 7 of "New project". `notion.md` is the file that step follows for Notion. Now bring the "Waiting on" lines of the page up to date.

Keep the five headings and their line limits. The list below says what to write on the "Last updated" line and under each of the five headings:

- Last updated: the date, "setup", and "agent".
- Now: "None."
- Coming up: "None."
- Waiting on: one line for each of the owner's steps that is still open. "The owner's steps" below lists the steps. Each line starts with "Owner:" and ends with "Setup step; remove this line when it is done."
- Standing jobs and shared files: "None."
- Next session starts with: "Ask the owner for the first thing to build."

Then delete the file's fill-in guide comment, as the comment says.

## Final checks

Run each check alone, from the project folder. Each check only reads.

### The checks

1. **Nothing from a choice that the owner did not make.** Run `ls -a`. It must show each of these only in the project named beside it:
   - `work-items/` and `PROJECT-ROADMAP.md` only with local work items;
   - `memory/` only with local memory or Hindsight memory. With local memory, `memory/` holds `AGENTS.md`, `CLAUDE.md`, `CURRENT_STATE.md`, `MEMORY.md`, and `project_topic_template.md`. With Hindsight memory, `memory/` holds only `CURRENT_STATE.md`;
   - `tools/` and `sfdx-project.json` only in a Salesforce project;
   - `SOUL.md` only when the owner keeps one;
   - `.claude/rules/hindsight-memory.md` and `.claude/hindsight-bank-settings.json` only with Hindsight memory;
   - `.claude/rules/notion-records.md` only with work items or memory in Notion.
2. **Skills.** `ls .claude/skills` must show exactly the list of skills for the owner's choices, and each skill folder must hold a `SKILL.md`. `skills-hooks-settings.md`, "Skills", gives the list for each choice.
3. **Project records.** The project must hold all of these, whatever the owner chose for work items and for memory:
   - `DECISIONS.md`;
   - `system/` with its six documents, `integrations/README.md`, and `integrations/INTEGRATION-TEMPLATE.md`;
   - `sources/README.md`;
   - `delivery/` with `releases/`, `deployments/`, `migrations/`, and `client-handoffs/`;
   - `reference/` with `outside-docs/INDEX.md` and `current-system/`.
4. **The `AGENTS.md` of each folder.** `find . -name AGENTS.md -not -path './.claude/*' -not -path './.git/*'` must list the root file and one `AGENTS.md` in each of `system/`, `sources/`, `delivery/`, and `reference/`. With local work items it must also list one in `work-items/`, and with local memory one in `memory/`. Each `AGENTS.md` must have a `CLAUDE.md` beside it that holds only the line `@AGENTS.md`.
5. **The link.** `ls -la .agents` must show `skills -> ../.claude/skills`. Through this link, Codex reads the same skills as Claude Code.
6. **Hook commands.** A hook command is a small command that Claude Code or Codex runs by itself at set moments, such as the start of a session. `ls .claude/hooks` must show `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`, and `validate-records.mjs`. In a Salesforce project it must also show the two guards.
7. **Settings are valid.** Run `jq empty .claude/settings.json`, and the same command for `.codex/hooks.json`, and for `.mcp.json` when present. The command prints nothing when a file is valid JSON.
8. **The settings name hook commands that exist, and hold no placeholder.** Every hook command that the settings name must exist in `.claude/hooks/`. No `{{` placeholder may be left: `grep -n '{{' .claude/settings.json .codex/hooks.json` must print nothing.
9. **The session-start check.** `node .claude/hooks/session-start.mjs --memory <memory> </dev/null` must print the project's Current State. With local memory it must also print the memory index, which reads "No memory files yet." in a new project. `<memory>` is the value of the Memory line in "Toolkit settings": `local`, `notion`, or `hindsight`.
   - With Notion memory, add `--page <Current state page id>` to the command.
   - In Codex with Notion memory, run the command escalated. `SKILL.md`, "Mistakes to avoid", says how Codex runs a command that way. Inside the sandbox the command prints "could not be read here". That text comes from the sandbox, and it is not a setup failure.
10. **The prompt reminder.** Run `echo '{"prompt":"remember this: we use Postgres"}' | node .claude/hooks/prompt-reminder.mjs`. It must print a line that tells the agent to check the project's skills, which it prints for any message. It must also print the memory reminder, which it adds for a "remember this" message. Last, it must print the line "The owner's rule for every request, from .claude/rules/evaluate-the-owners-request.md. Where owner-preferences.md says otherwise, that file wins:" and then the whole text of that rule file, which it prints for any message.
    - With Hindsight memory, add `--skill hindsight` to the command.
    - When the output lacks the rule, find the cause and report it. One cause is that `.claude/hooks/prompt-reminder.mjs` differs from the setup copy's file, which means the project's command is older than this version of the toolkit. The other cause is that `.claude/rules/evaluate-the-owners-request.md` is missing or empty. For both causes, the fix is "update the toolkit".
    - The whole output must be 10,000 characters or less. To count the characters, add `| wc -m` to the end of the command. When the output is longer, report that the rule file is too long for the agent to be shown all of it. Claude Code then gives the agent the path of a file that holds the output and a preview of at most its first 2,000 characters. Codex does the same for an output over roughly 2,500 tokens, with a preview of the start and the end of the output.
11. **The after-commit reminder.** Run `printf '{"tool_input":{"command":"git %s -m x"}}' commit | node .claude/hooks/codex-after-commit.mjs`. The input stands for a commit, and the command must answer it with its reminder.
12. **`validate-records.mjs` finds nothing.** The command that checks the records, `.claude/hooks/validate-records.mjs`, checks the form of the project's records. `node .claude/hooks/validate-records.mjs --all < /dev/null` must print nothing. Each line that it prints is one finding. Report each finding.
13. **The pre-commit check.** The pre-commit check is the file `.githooks/pre-commit`. Git runs it before each commit, and it runs `validate-records.mjs`.
    - `test -x .githooks/pre-commit && echo executable` must print "executable".
    - `git config --get core.hooksPath` must print `.githooks`. When it prints something else or nothing, report what it prints, and the reason that `placing-files.md`, "5. The pre-commit check", gives for that result. Step 2 of that section holds the two commands that show which row of its table fits.
14. **`AGENTS.md` is within its limits.** `wc -lc AGENTS.md` must print 200 lines or less and 22,528 bytes or less.
    - Claude Code recommends under 200 lines. Codex stops reading instruction files at 32,768 bytes in all, `~/.codex/AGENTS.md` included.
    - Count `AGENTS.md` only. `PROJECT.md` is not counted. Claude Code loads `PROJECT.md` through the `@PROJECT.md` line in `AGENTS.md`, and Codex does not load it that way.
    - When either number is over its limit, say so in the report. Never cut lines from `AGENTS.md`.
15. **The text that loads in every session.** `command grep -L '^paths:' .claude/rules/*.md` lists the rules with no `paths` line in their front matter. Count the bytes of `AGENTS.md` and of each of those files with `wc -c`, and give the total in bytes in the report. No limit is set for the total.
16. **"Toolkit settings" holds no prompt.** The "Toolkit settings" section of `PROJECT.md` must hold no prompt, except a prompt that waits on the owner.
17. **The owner is named.** "People and ownership" in `PROJECT.md` must name the owner. Check it with `grep -n '^| Owner |' PROJECT.md`.
18. **The older plugins are off in this project.** Check it with `jq '.enabledPlugins' .claude/settings.json`. `skills-hooks-settings.md`, "The older plugins, off in this project", says which plugins must be off.
19. **Salesforce's skills, in a Salesforce project only.** Salesforce's skills must be installed. `salesforce.md`, "Salesforce's skills", says where to look for them. When they are not installed, report it and give the owner `npx skills add forcedotcom/sf-skills`.
20. **Services: Notion work items or memory.** Do the check that starts "For a new project" under "Checks after any of these" in `notion-build/work-setup.md`.
21. **Services: Notion memory.**
    - The "Notion memory" line in `PROJECT.md` must hold every bullet that `notion-build/setup.md` lists under "Recording the links in PROJECT.md".
    - The "Current state" page must show its first lines. Read the page with `ntn api v1/pages/<Current state page id>/markdown < /dev/null | jq -r .markdown`.
22. **Services: GitHub Issues.** Do the checks under "Checks after either" in `github.md`.
23. **Services: Hindsight.** Do the checks under "Check a Hindsight project" in `hindsight-on-vps.md`.
24. **Git does not track `work-items/` or `memory/`.** `git status --short` must list nothing under `work-items/` or `memory/`.

### After the checks

- When a check fails, fix what the check found, then run the check again.
- Report each check that you cannot make pass, with what it printed.
- Then remove the temporary folder that holds the setup copy: `rm -rf <copy>`.

### The final checks in "check the setup"

"Check the setup" is one of the jobs in `SKILL.md`, "Which setup job to do". In that job, fix nothing. Report each failed check with the fix that you recommend.

Two checks run differently in "check the setup", so that checking changes no file:

- The session-start check runs the project's own hook command. With local memory, the hook command may rebuild the generated index `memory/MEMORY.md`. That index is the one file a check may change. When `.claude/hooks/session-start.mjs` differs from the setup copy's file, also report the hook command as out of date.
- When the project has no `.claude/hooks/validate-records.mjs`, run the setup copy's `validate-records.mjs` from the project folder: `node <copy>/.claude/hooks/validate-records.mjs --all < /dev/null`.

"Check the setup" puts one kind of file back: a toolkit file that is missing from `work-items/` or `memory/`. Git does not track `work-items/` and `memory/`, so a toolkit file that was deleted there cannot be brought back from Git.

When one of the files listed below is missing in the main checkout, copy it from the setup copy with `cp -n <copy>/<file> <main checkout>/<file>`, and name the file in the report. The `-n` option never replaces a file. The main checkout is the project's main folder, the first path that `git worktree list` prints.

- With local work items, the files are `work-items/AGENTS.md`, `work-items/CLAUDE.md`, `work-items/work-item-template/WORK-ITEM.md`, and `work-items/work-item-template/DESIGN.md`.
- With local memory, the files are `memory/AGENTS.md`, `memory/CLAUDE.md`, and `memory/project_topic_template.md`.

Put none of these files back in a project that was set up before the current folder layout. "Update the toolkit" gives such a project these files. The current folder layout is the layout in which information the whole project needs is kept in five places, as files in the repository: `DECISIONS.md`, `system/`, `sources/`, `delivery/`, and `reference/`. `one-home-layout.md`, "Find the old layout", says how to tell that a project was set up before that layout.

## The owner's steps

The table lists the steps that the owner does. Say each one plainly, with the reason in the "Why" column, and wait where a later step needs it. Never do one of these steps for the owner. The "Needed when" column says when a step applies.

| Step | Why | Needed when |
| --- | --- | --- |
| Run `ntn login` in a terminal. | It signs the Notion command-line tool into the owner's account. It opens a browser. | Notion, when `ntn whoami` fails |
| Share the owner's Notion root page with "Notion CLI". | The agent can reach only shared pages. | Notion, when a call returns 404 |
| Set the page layout of each database in the new "Project" template in the Projects database. The clicks are in the Notion setup files. | Only the Notion app can set the page layout. Every project copied from the template keeps it. | Notion, when setup built the template |
| Run `gh auth login` in a terminal. | It signs the GitHub command-line tool in. | GitHub Issues, when `gh auth status` fails |
| Trust the project folder in Codex. | Until the folder is trusted, Codex ignores the project's `.codex/config.toml` and `.codex/hooks.json`. Trust is tied to the folder path, so it is needed again after a move. | Always, the first time the owner opens the project in Codex |
| Trust the hooks in Codex: type `/hooks` and trust them. | Codex skips a hook until it is trusted, and again after any change to its entry in `.codex/hooks.json`. A change to a `.mjs` file that the hook runs is not reviewed again. | Always. Again after "update the toolkit" changes an entry in `.codex/hooks.json`. With Hindsight, also the hooks of Hindsight's coding-agent add-on, after the add-on is installed |
| Install Salesforce's skills: run `npx skills add forcedotcom/sf-skills` in a terminal. | Salesforce publishes its own skills for Salesforce work. Setup never installs them. | Salesforce, when they are not installed yet |
| Connect the project's Salesforce org (`sf org login web --alias <alias>`) and tell the agent the alias. | The agent never picks or signs in to an org itself. | Salesforce, when the project's org does not exist yet or is not connected |
| Enter the Hindsight API key in the owner's own Terminal window, with the two lines in `hindsight-on-vps.md` ("The access key"), never in the session. | The add-on and setup read the key from `~/.hindsight/coding-agent.json`. The agent never sees the key. | Hindsight, when the key is not set yet |
| Sign in to the Hindsight dashboard with its own access key. | The dashboard asks for that key, not the API key, before it shows the bank. The bank is this project's store of memory on the Hindsight server. | Hindsight, the first time the owner opens the dashboard |
| Open the project folder as an Obsidian vault. | The owner can then browse the project's records, and local work items and memory, with their links. The project's `README.md` says how. | Optional |
| Start a new session in each of Claude Code and Codex. | The skills, hooks, and settings load at session start. | Always |
| Say yes to committing the setup files. | New worktree sessions (the Claude desktop app, the Codex app) see only committed files. A worktree is a separate folder with its own branch. | Always |

## The report

Give the owner a short, plain report. It has these parts, in this order:

1. **What was set up.** Say where work items and memory are kept, whether the project is a Salesforce project, how many skills it has, the four hook commands, whether the pre-commit check is on or why it is not, and each line that was added to `owner-preferences.md`, in the owner's words.
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

The setup commit is made on the default branch, with no worktree and no pull request. Do these steps in order:

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

Ask about a push next, as its own question, when both of these are true: the project has the remote `origin`, and `git ls-remote --heads origin <default>` prints nothing. An example is a repository that setup just created. `<default>` is the branch that the setup commit is on, usually `main`. The question is:

> Push <default> to <owner>/<repo>? The first pull request needs <default> on GitHub.

After the owner's yes, run `git push -u origin <default>`.

After the commit, and the push when it was asked, the reply's last line is "Tell me the first thing you want built."
