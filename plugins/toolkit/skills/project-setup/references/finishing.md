# Finishing setup

Purpose: after the files and the services are in place, fill the prompts in
the copied files with facts the owner confirms, write Current State, run the
final checks, name the owner's own steps, and end with the report and the
commit offer.

## Contents

- Fill the prompts
- Instructions he gives during setup
- SOUL.md
- Current State
- Final checks
- The owner's steps
- The report
- The commit offer

## Fill the prompts

The copied files start with a fill-in guide comment and hold
`<angle bracket>` prompts. Fill them only with facts the owner confirmed, in
this order:

1. **The project's outcome**, the outcome line of `AGENTS.md`: the line under
   the title that starts with the prompt
   `<One sentence describing this project and its outcome.>`. It is his
   answer, never a sentence worked out from the code, the tests, or the
   README. Ask it as its own question, with a suggestion:

   > What should this project do for you, in one sentence? From the code I'd suggest: "Export invoices to the bank's CSV format every Friday."

   Ask it even when he described the project earlier in the chat: offer
   his earlier words as the suggestion, and write nothing until he
   answers. After his answer, put his sentence in place of the outcome
   prompt in every place at once: the outcome line of `AGENTS.md`, the
   one-sentence line under the title of `README.md`,
   "Intended outcome" in `PROJECT.md`, and, with local work items,
   "Project outcome" in `PROJECT-ROADMAP.md`.

   With the project page in Notion (work items or memory there), also
   put his sentence in the "Desired Outcome" field of the project's row in
   Notion, then read the row back. The page's "Project brief" prompts
   (Overview/Context, Goals, Success criteria) stay until he gives them:
   list them with the prompts left.

   Until he answers, leave the outcome prompts in `AGENTS.md`,
   `README.md`, `PROJECT.md`, and `PROJECT-ROADMAP.md` (local work items),
   and list them in the report.
2. **The "Build, test, or deploy" row** under "Commands" in `AGENTS.md`.
   Ask, with a recommendation from what the repository shows (for example
   `npm test`). A new, empty project: leave the prompt and list it.
3. **`PROJECT.md` and `README.md`.** Follow each file's guide. Ask only what
   the repository cannot answer. Fill a prompt only with a fact he gave in
   this chat or one a file in the repository shows. The "In scope" and
   "Outside scope" lines in `PROJECT.md` describe the product, never setup
   choices or toolkit files. In a new project with no code yet, ask
   nothing more for these files: leave their prompts and list them in the
   report. A file keeps its fill-in guide comment for as long as it holds
   a prompt; delete the guide when the last prompt is filled. In a project with code, list in the report each value you took
   from the repository, so he can correct it.
4. **`PROJECT-ROADMAP.md` (local work items)**: fill it only when the owner
   already knows the facts. A project with work items in Notion or GitHub
   has no `PROJECT-ROADMAP.md`: its phases go in the tracker, later, with
   `running-work-item-lifecycle`. On a new project it
   usually stays as it is; list it as prompts left.
5. **`DECISIONS.md`, the documents in `system/`, and `sources/README.md`**
   stay as copied: they hold no prompt, and each `system/` document says
   Status "Not started". Never write a decision, a rule, or a source into
   them during setup.
6. Delete each fill-in guide comment when its own text says to. Keep the
   guide comment inside "Toolkit settings": later sessions read it.

Never invent a fact to fill a prompt. Setup is never a work item: never
create one for setup steps, and never add made-up questions to finish setup.

## Instructions he gives during setup

When the owner gives an instruction for how the agent works (for example
"don't touch my real Notion pages" or "don't use those orgs"), add it to
`.claude/rules/owner-preferences.md` as one list line in his words, under
an area its layout comment names (General when none fits), ending with
(<YYYY-MM-DD>, <owner name>, in chat). A setup answer is not an
instruction: which hosts he uses, where work items and memory live, the
project name, and the outcome never go in this file. Before the setup copy
exists, keep it in the plan tool and write it when you build the copy. Say
in the report that it was saved. Write nothing else in that file during
setup.

## SOUL.md

- He said yes in the interview: fill each prompt with his own words, show
  him the text, and delete its guide after his approval.
- He turns it down now: delete `SOUL.md`, as its guide says.

## Current State

Local or Hindsight memory: write the first lines of
`memory/CURRENT_STATE.md` now. Notion memory: the Notion memory setup wrote
these lines on the "Current state" page in step 7 of "New project"
(`notion.md` in this folder); now bring its "Waiting on" lines up
to date. Keep the five headings and their line limits:

- Last updated: the date, "setup", and "agent".
- Now: "None."
- Coming up: "None."
- Waiting on: one line for each owner step still open (below), each
  starting "Owner:" and ending "Setup step; remove this line when it is
  done."
- Standing jobs and shared files: "None."
- Next session starts with: "Ask the owner for the first thing to build."

Then delete the file's fill-in guide comment, as it says.

## Final checks

Run each check alone from the project folder. Each only reads.

```text
- [ ] Nothing from an option not chosen: ls -a shows work-items/ and PROJECT-ROADMAP.md only with local work items, memory/ only with local or Hindsight memory (local: AGENTS.md, CLAUDE.md, CURRENT_STATE.md, MEMORY.md, and project_topic_template.md in it; Hindsight: only CURRENT_STATE.md), tools/ and sfdx-project.json only in a Salesforce project, SOUL.md only when he keeps one, .claude/rules/hindsight-memory.md only with Hindsight memory, and .claude/rules/notion-records.md only with work items or memory in Notion
- [ ] Skills: ls .claude/skills is exactly the list for the choices (skills-hooks-settings.md), each with a SKILL.md
- [ ] Project records, for every tracker and memory choice: DECISIONS.md; system/ with its six documents, integrations/README.md, and integrations/INTEGRATION-TEMPLATE.md; sources/README.md; delivery/ with releases/, deployments/, migrations/, and client-handoffs/; reference/ with outside-docs/INDEX.md and current-system/
- [ ] Folder guides: find . -name AGENTS.md -not -path './.claude/*' -not -path './.git/*' lists the root file and one in system/, sources/, delivery/, and reference/ (plus work-items/ with local work items and memory/ with local memory); each has a CLAUDE.md beside it that holds only the line @AGENTS.md
- [ ] The link: ls -la .agents shows skills -> ../.claude/skills
- [ ] Hook commands: ls .claude/hooks shows session-start.mjs, prompt-reminder.mjs, codex-after-commit.mjs, and validate-records.mjs (plus the two guards in a Salesforce project)
- [ ] Settings are valid: jq empty .claude/settings.json (and .codex/hooks.json, and .mcp.json when present)
- [ ] Every hook command the settings name exists in .claude/hooks/, and no {{ placeholder is left: grep -n '{{' .claude/settings.json .codex/hooks.json
- [ ] The session-start hook prints Current State, and with local memory the memory index ("No memory files yet." in a new project): node .claude/hooks/session-start.mjs --memory <memory> </dev/null (Notion memory: add --page <Current state page id>). Codex with Notion memory: run it escalated; inside the sandbox it prints "could not be read here", which is the sandbox and not a setup failure
- [ ] The prompt reminder prints a line telling the agent to check the project's skills for any message, and adds the memory reminder for a "remember this" message: echo '{"prompt":"remember this: we use Postgres"}' | node .claude/hooks/prompt-reminder.mjs (Hindsight memory: add --skill hindsight)
- [ ] The after-commit reminder answers a commit: printf '{"tool_input":{"command":"git %s -m x"}}' commit | node .claude/hooks/codex-after-commit.mjs
- [ ] The record check finds nothing: node .claude/hooks/validate-records.mjs --all < /dev/null prints nothing. Each line it prints is one finding: report it
- [ ] The pre-commit check: test -x .githooks/pre-commit && echo executable prints "executable", and git config --get core.hooksPath prints .githooks. When it prints something else or nothing: report what it prints, and the reason placing-files.md, "5. The pre-commit check", gives for it (its step 2 holds the two commands that show which row of its table fits)
- [ ] AGENTS.md is within its limits: wc -lc AGENTS.md prints 200 lines or less and 20,480 bytes or less (Claude Code recommends under 200 lines; Codex stops reading instruction files at 32,768 bytes in all, ~/.codex/AGENTS.md included). Count AGENTS.md only: PROJECT.md, which Claude Code loads through the @PROJECT.md line in AGENTS.md, is not counted, because Codex does not load it that way. When either is over, say so in the report and never cut lines from it
- [ ] The text that loads in every session: command grep -L '^paths:' .claude/rules/*.md lists the rules with no paths frontmatter; wc -c AGENTS.md and each of those files, and give the total in bytes in the report (no limit is set for it)
- [ ] PROJECT.md "Toolkit settings" holds no prompt, except one that waits on the owner
- [ ] PROJECT.md "People and ownership" names the owner: grep -n '^| Owner |' PROJECT.md
- [ ] The older plugins are off here: jq '.enabledPlugins' .claude/settings.json
- [ ] Salesforce projects only: Salesforce's skills are installed (`salesforce.md` in this skill, "Salesforce's skills"); when they are not, report it and give `npx skills add forcedotcom/sf-skills`
- [ ] Services, Notion work items or memory: the "A new project" check under "Checks after any of these" in notion-build/work-setup.md in this skill
- [ ] Services, Notion memory: the "Notion memory" line in PROJECT.md holds every bullet that `notion-build/setup.md` in this skill lists under "Recording the links in PROJECT.md", and the "Current state" page shows its first lines (ntn api v1/pages/<Current state page id>/markdown < /dev/null | jq -r .markdown)
- [ ] Services, GitHub Issues: the checks under "Checks after either" in github.md in this skill
- [ ] Services, Hindsight: "Check a Hindsight project" in hindsight-on-vps.md
- [ ] git status --short lists nothing under work-items/ or memory/
```

A check that fails: fix it, then run it again. Report any check you cannot
make pass, with what it printed. Then remove the scratch folder:
`rm -rf <copy>`.

In "check the setup" (`SKILL.md`, "Pick the path"), fix nothing: report
each failed check with the fix you recommend. Two checks run differently
there, so that checking changes no file:

- The session-start check runs the project's own hook command. With local
  memory it may rebuild the generated index `memory/MEMORY.md`: that is the
  one file a check may change. When `.claude/hooks/session-start.mjs`
  differs from the setup copy's file, also report the hook command as out
  of date.
- When the project has no `.claude/hooks/validate-records.mjs`, run the
  setup copy's from the project folder:
  `node <copy>/.claude/hooks/validate-records.mjs --all < /dev/null`.

"Check the setup" puts one kind of file back. Git does not track
`work-items/` and `memory/`, so a toolkit file that was deleted there cannot
be brought back from Git. When one of these is missing in the main
checkout, copy it from the setup copy with
`cp -n <copy>/<file> <main checkout>/<file>` (`-n` never replaces a file),
and name it in the report:

- local work items: `work-items/AGENTS.md`, `work-items/CLAUDE.md`,
  `work-items/work-item-template/WORK-ITEM.md`, and
  `work-items/work-item-template/DESIGN.md`;
- local memory: `memory/AGENTS.md`, `memory/CLAUDE.md`, and
  `memory/project_topic_template.md`.

Put none of them back in a project set up before the one-home layout
(`one-home-layout.md`, "Find the old layout"): "update the toolkit" gives it
these files.

## The owner's steps

Say each one plainly, with why, and wait where a later step needs it. Never
do them for him.

| Step | Why | Needed when |
| --- | --- | --- |
| `ntn login` in a terminal | Signs the Notion command-line tool into his account; it opens a browser. | Notion, when `ntn whoami` fails |
| Share his Notion root page with "Notion CLI" | The agent can reach only shared pages. | Notion, when a call returns 404 |
| Set the page layout of each database in the new "Project" template in the Projects database (the clicks are in the Notion setup files) | Only the Notion app can set it; every project copied from the template keeps it. | Notion, when setup built the template |
| `gh auth login` in a terminal | Signs the GitHub command-line tool in. | GitHub Issues, when `gh auth status` fails |
| Trust the project folder in Codex | Until then Codex ignores the project's `.codex/config.toml` and `.codex/hooks.json`. Trust is tied to the folder path, so it is needed again after a move. | Always, the first time he opens the project in Codex |
| Trust the hooks in Codex: type `/hooks` and trust them | Codex skips a hook until it is trusted, and again after any change to its entry in `.codex/hooks.json`. A change to a `.mjs` file it runs is not reviewed again. | Always; again after "update the toolkit" changes an entry in `.codex/hooks.json`; with Hindsight, also the add-on's hooks after it is installed |
| Install Salesforce's skills: run `npx skills add forcedotcom/sf-skills` in a terminal | Salesforce publishes its own skills for Salesforce work; setup never installs them. | Salesforce, when they are not installed yet |
| Connect the project's Salesforce org (`sf org login web --alias <alias>`) and tell the agent the alias | The agent never picks or signs in to an org itself. | Salesforce, when the project's org does not exist yet or is not connected |
| Enter the Hindsight API key in his own Terminal window, with the two lines in `hindsight-on-vps.md` ("The access key"), never in the chat | The add-on and setup read it from `~/.hindsight/coding-agent.json`; the agent never sees it. | Hindsight, when the key is not set yet |
| Sign in to the Hindsight dashboard with its own access key | The dashboard asks for that key, not the API key, before it shows the bank. | Hindsight, the first time he opens it |
| Open the project folder as an Obsidian vault | To browse the project's records, and local work items and memory, with their links (the project's `README.md` says how). | Optional |
| Start a new session in each host | The skills, hooks, and settings load at session start. | Always |
| Say yes to committing the setup files | New worktree sessions (the Claude desktop app, the Codex app) see only committed files. | Always |

## The report

A short, plain report, in this order:

1. What was set up: where work items and memory live, Salesforce or not,
   how many skills, the four hook commands, the pre-commit check (on, or
   why it is not), and each line added to
   `owner-preferences.md`, in his words.
2. What was made outside this folder: Notion pages, the GitHub repository
   and labels, the Hindsight bank, and the add-on's changes in `~/.claude`,
   `~/.codex`, and `~/.hindsight`.
3. What was skipped, and why.
4. What the owner must do himself, each with why.
5. The final checks: all passed, or each one that did not, with its fix.
6. The prompts left, grouped by file, each with the fact it needs in a few
   words. Find them with
   `grep -n '<[A-Za-z][^>]*>' AGENTS.md README.md PROJECT.md | grep -v '<!--'`,
   and, with local work items, the same `grep` on `PROJECT-ROADMAP.md`,
   then skip lines where the angle brackets are part of a file name or
   path pattern, not a prompt: `<ID>.md`, `<ID>-<short-slug>/`,
   `<ID>-test-plan.md`, and `<release>-test-plan.md`. With the project page
   in Notion, also list its "Success criteria".
7. The last line: the commit offer.

## The commit offer

The setup files are not committed yet, and the first merge of a work item
needs them committed. Say in one line why it matters now: sessions that
start in their own worktree (the Claude desktop app, the Codex app) see only
committed files, so until this commit, and a push when the app starts
worktrees from the remote, they get no `AGENTS.md`, skills, or hooks. The
reply's last line is:

> Setup files are not committed. Commit them now?

After his yes:

- Stage each file setup wrote or changed, by name, and the `.agents/skills`
  link. List the candidates with `git status --short --untracked-files=all`:
  plain `git status --short` shows a new folder, not the files in it. A file
  he already had that setup did not write or change, such as his own code
  that Git does not track yet, stays unstaged.
- Read `git diff --cached --name-status`: it lists no file under
  `work-items/` or `memory/`. `git diff --cached --check` may list template
  lines that end with two spaces: they are Markdown line breaks, so leave
  them.
- Commit with a plain message and no AI credit, for example
  `git commit -m 'Set up Toolkit V2'`.
- Push only after his yes.

When the project has the remote `origin` and
`git ls-remote --heads origin <default>` prints nothing (for example, a
repository setup just created), ask next, as its own question. `<default>`
is the branch the setup commit is on, usually `main`:

> Push <default> to <owner>/<repo>? The first pull request needs <default> on GitHub.

After his yes: `git push -u origin <default>`.

The setup commit is made on the default branch, with no worktree and no
pull request. Read `git diff --cached --stat` for the files setup copied in,
and `git diff --cached -- <file>` for each file the project had before setup
and setup merged or changed (`.gitignore`, settings files).

After the commit, and the push when it was asked, the reply's last line is
"Tell me the first thing you want built."
