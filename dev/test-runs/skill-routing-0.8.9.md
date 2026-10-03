# Routing check for the new `choosing-outside-tools` skill (0.8.9, TKV-18, 2026-10-03)

The `toolkit` plugin now holds two skills: `project-setup` and
`choosing-outside-tools`. The second one lists the outside tool the owner
uses for each job. Today it has one row: explainroo, for narrated explainer
videos. The question: does each app open the right skill first?

## How it ran

The method is the one in `skill-routing-0.8.3.md`. Each prompt ran once, in a
fresh session, in a fresh empty Git repository under the system temp folder.
"First skill" is the first skill the session opened, read from the tool calls
(Claude Code) or the files it read (Codex), not from the reply.

- **Claude Code**: `claude -p`, model Sonnet, `--output-format stream-json
  --verbose`, `--max-turns 6`, Bash, Write, Edit, NotebookEdit, WebFetch and
  WebSearch turned off, 5 minute limit,
  `CLAUDE_CONFIG_DIR=~/.toolkit-v2-test-homes/claude`. The plugin was loaded
  from this branch for the session only (`--plugin-dir plugins/toolkit`, 0.8.9),
  and the test home's installed copy (0.4.9) was turned off for the session
  only (`--settings '{"enabledPlugins":{"toolkit@toolkit-v2":false}}'`).
  Nothing was installed in the test home.
- **Codex**: `codex exec --json -s read-only`, 5 minute limit,
  `CODEX_HOME=~/.toolkit-v2-test-homes/codex`. Added for the runs: two links
  in the test home's `skills/` folder (`project-setup` and
  `choosing-outside-tools`, pointing at this branch's skill folders), and
  `enabled = false` for `toolkit@toolkit-v2` in the test home's
  `config.toml`. All of it was removed afterwards: both links are deleted and
  `config.toml` is back to its saved copy (byte for byte). A checksum of the
  test home's `skills/`, `plugins/`, `config.toml` and `auth.json` is the same
  before and after.
- Round 2 Claude Code runs also had `--add-dir <worktree>/plugins/toolkit`, so
  the session could read the skill's reference files. Round 1's main runs did
  not.
- Every session ran with its input closed (`< /dev/null`). See "Surprising"
  for why.
- Also removed after the runs: the scratch folders, the session records the runs
  made in the test homes (the `projects/` folders for the scratch folders and
  the Codex session files from these runs). Claude Code also rewrote its own
  bookkeeping in the test home (`.claude.json`, its backups, and the
  synced-plugin round markers). That happens on any use and is not a change
  to the plugins or settings.
- The folder `~/Documents/Projects/explainroo` exists on this Mac, and the
  test home has no `explainroo` skill of its own (that one is in the owner's
  real `~/.claude/skills`, which the test home does not read). So prompt 1 could
  only reach `choosing-outside-tools`.

## Round 1 (the first description)

Description tested:

> Lists the outside tool the owner uses for each kind of job, such as explainer videos, and how to set it up, so every computer uses the same tool without him remembering it. Use this whenever the owner asks for a job on the list, such as "make an explainer video", when he asks which tool he uses for a job, or says "add this to my tool list". Only names the tool; when that tool has its own skill on this computer, use that skill for the work.

### Results

| ID | Prompt | Expected | Claude Code | Codex |
| --- | --- | --- | --- | --- |
| 1 | make an explainer video about how a pull request gets merged | choosing-outside-tools (or `explainroo` if the test home has one; it has none) | choosing-outside-tools. Named explainroo as the tool. Did not set anything up. Could not finish the check (see below). | choosing-outside-tools. Named explainroo, found it already installed, did not set anything up. Could not make the video: the sandbox is read-only. |
| 2 | what do I use for explainer videos? | choosing-outside-tools | choosing-outside-tools. Said explainroo; said it could not read the file that says whether it is installed. | choosing-outside-tools. Said explainroo, installed on this computer, saved choice is no corner label. |
| 3 | add this to my tool list: https://github.com/csthink/dashmotion for animated flowcharts | choosing-outside-tools, and the reply says the change is made in a chat opened in the Toolkit V2 repository | choosing-outside-tools. Did not add it. Said the change is made in a chat opened in the Toolkit V2 repository and gave text to paste. | choosing-outside-tools. Did not add it. Said to open a chat in the Toolkit V2 repository and gave text to paste. |
| 4 | set up this project | project-setup | project-setup. Called the empty folder a new project and asked for the project name and owner. | project-setup. Called the folder a new Toolkit V2 setup and asked for the project name. |
| 5 | toolkit v2 | project-setup | project-setup. Called the empty folder a new project and asked the project name and owner. | project-setup. Same: new setup, asked the project name. |
| 6 | draw a flowchart of a login process | no expectation | No skill. Drew the flowchart as Mermaid text and plain text. Did not mention the tool list. | No skill. Drew the flowchart as Mermaid text. Did not mention the tool list. |
| 7 | fix the typo in the README | neither skill | No skill. Found no README and asked where it is. | No skill. Found no README (the folder is empty) and said so. |

Round 1 result: 14 of 14 sessions opened the expected skill first, or none where none
was expected (7 in Claude Code, 7 in Codex). Prompt 6 had no expectation, and
it opened no skill in either app.

### Prompt 1 in detail

- Both apps opened `choosing-outside-tools`, then its `references/explainroo.md`.
- Both said the tool is explainroo. Neither used another tool.
- Neither asked before setting anything up, because neither started to set
  anything up. Codex found explainroo already installed and stopped only
  because the sandbox is read-only. Claude Code could not tell and asked.
- Claude Code's main run could not read `references/explainroo.md`: Claude Code
  in `-p` mode refuses to read outside the folder it runs in, and the plugin
  folder is outside the scratch folder. The same refusal stopped the
  `project-setup` runs (4 and 5) from reading `references/interview.md`. This
  does not change which skill opened first.
- Extra run, not counted in the table: prompt 1 again in Claude Code with
  `--add-dir <worktree>/plugins/toolkit` added, so the file could be read. It
  opened `choosing-outside-tools`, read `references/explainroo.md`, said the
  tool is explainroo and how to check for it, but then could not look in
  `~/Documents/Projects/explainroo` (outside its folder) and so asked the
  owner whether it is installed. It said that setting it up would download
  about 400 MB and add the folder `~/Documents/Projects/explainroo`, and it
  said it would wait for a yes. So it asked before any setup, and it named the
  tool.

### Surprising

- A first pass of the Claude Code runs was thrown away. They were started from
  a shell loop, and every session read the rest of the prompt list from the
  loop's input as extra text, so some replies answered other prompts. All seven
  were run again with input closed. The table is the second pass. Anyone
  running these in a loop needs the same fix.
- Claude Code, with Bash turned off, tried to run `ls` through Bash in runs 4
  and 5 before falling back to Glob. This costs a turn only.
- In prompt 6 the tool list was not mentioned by either app, which is the right
  outcome: the list has no flowchart row and the skill did not open.
- Prompt 3: neither app opened the dashmotion page or added a row. Both told
  the owner the change is made in the Toolkit V2 repository.

## Round 2 (the description after the review)

The description and body changed after a review. Description tested (the one
now in `plugins/toolkit/skills/choosing-outside-tools/SKILL.md`):

> Lists the outside tool the owner uses for each kind of job and how to set it up, so every computer uses the same tool. Use when he asks for a job on the list, such as "make an explainer video", and no skill for that tool is on this computer; when he asks which tool he uses for a job; or when he says "add this to my tool list". Not for doing the job when a skill for that tool is on this computer.

Same method as round 1, with the six prompts below. The test homes were put
back the same way afterwards (see "How it ran"; the checksums matched again).

### Results

| ID | Prompt | Expected | Claude Code | Codex |
| --- | --- | --- | --- | --- |
| 1 | make an explainer video about how a pull request gets merged | choosing-outside-tools | choosing-outside-tools, then read `references/explainroo.md`. Named explainroo. Could not look inside `~/Documents/Projects/explainroo` (outside its folder), so it asked: read the folder, set it up first (said what setup clones, installs and downloads, about 400 MB), or use something else. Set nothing up. | choosing-outside-tools, then read `references/explainroo.md`. Named explainroo, found it installed, set nothing up. Could not render (read-only); wrote a narration script instead. |
| 2 | what do I use for explainer videos? | choosing-outside-tools; names explainroo, then stops | choosing-outside-tools. Said explainroo, said it had not checked whether it is installed, offered to check, and stopped. | choosing-outside-tools. Said explainroo and stopped. It did not read the tool's file. |
| 3 | add this to my tool list: https://github.com/csthink/dashmotion for animated flowcharts | choosing-outside-tools; change is made in a chat opened in the Toolkit V2 repository | choosing-outside-tools. Did not add it; said changes are made in a chat opened in the Toolkit V2 repository; gave text to paste. | choosing-outside-tools. Did not add it; said to open a chat in the Toolkit V2 repository; gave text to paste. |
| 4 | set up this project | project-setup | project-setup. New project; asked the project name, recommended Mike Rihm as owner. | project-setup. New setup; asked the project name. |
| 5 | add this to my to-do list: buy milk | not choosing-outside-tools | No skill. Looked for a Todoist tool and tried to add the task; the permission was refused, so nothing was created. | No skill. Added the task "buy milk" to the Todoist inbox through a connector. See "Surprising". |
| 6 | fix the typo in the README | neither skill | No skill. Found no README, asked which file. | No skill. Found no README, said so. |

Round 2 result: 12 of 12 sessions opened the expected skill first, or none
where none was expected (6 in Claude Code, 6 in Codex). Prompt 2 stopped after
naming the tool in both apps. Prompt 5 never opened `choosing-outside-tools`
in either app.

### Surprising

- Prompt 5 in Codex made a real change. Codex has a Todoist connector
  (`codex_apps`) in the test home's sign-in, and it added the task "buy milk"
  to the owner's real Todoist inbox (task id `6hgfv2PQwMQQHX9g`). The Claude
  Code run tried the same through its Todoist connector, but the permission was
  refused and nothing was created. I did not delete or complete the Codex task:
  deleting is for the owner to do. Future runs should not use a prompt that a
  connected app can act on, or should turn the connectors off.
- Prompt 1 in Codex answered with a narration script. It stayed inside the
  read-only sandbox and did not render anything.
- Claude Code tried Bash in run 4 before falling back to Glob, as in round 1.

## Not covered

- The Codex desktop app, and the older toolkit's plugins on.
- A computer where explainroo is not installed (this Mac has it).
- The whole explainroo run: nothing was rendered, by design.
