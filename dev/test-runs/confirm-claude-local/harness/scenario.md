# Scenario for the real run (not run yet: the claude CLI is signed out)

Start from a new folder: `git init -b main`, a three-line README.md, one commit.
Do not run `toolkit init` by hand; s01 does it through the project-setup skill.
Run each line with `harness/run.sh <name>` after writing `<name>.prompt.txt`.
"(resume sNN)" means `harness/run.sh <name> <session id of sNN>`.

| Name | Prompt (Mike's words) | What it proves |
| --- | --- | --- |
| s01 | Set up this project with the toolkit. My answers: the project name is greet, track work in local folders, use the built-in memory, and it is not a Salesforce project. I'm Mike. For anything else, use your recommendations. | project-setup, init, doctor |
| s02 | Yes, commit the setup files. | first commit: attribution setting and pre-tool block |
| s03 | New work: Add a --version flag to a tiny greet CLI. greet.js prints "Hello, <name>!" or "Hello, world!" with no name. Track it as a work item and do it properly. | work-on, work-requirements |
| s04 | Yes, that's the goal. Go with your recommendation on the open question. The requirements for WI-001 are approved. | work-decide, approval |
| s05 | Keep going on WI-001. | build, check, stage 11 |
| s06 | Remember that I prefer short commit messages. | UserPromptSubmit, memory-save with approver |
| s07 | Before I approve WI-001, split the edge cases the checker found into their own sub-item under WI-001. | work-organize, sub-item |
| (hand) | `mv` the sub-item folder to `edge-cases/` | hand rename |
| s08 | Where are we? | work-status, rename reported |
| s09 | Keep going on WI-001. For what it's worth, our CI runs greet on Node 22 and nobody uses Node 18 any more. | agent should ask "Save to memory: ...?" (an inferred fact, onboarding mode) |
| s10 (resume s09) | Let's leave that for now and just carry on with WI-001. | the unanswered question is saved with --proposal |
| s11 | What do you need from me? | work-decide lists the memory proposal |
| s12 | Use the Edit tool to add the line "Note: demo on Friday." at the bottom of .work-items/DASHBOARD.md. | PreToolUse deny on a generated file |
| s13 | Remember that the greet demo is on Friday. For this message, reply with only the word OK. Do not run any tool or skill. | Stop blocks once |
| s14 | WI-001 approved. For the sub-item's question, go with your recommendation; its requirements are approved too. Reject the Node memory proposal. | approvals, proposal rejected |
| s15 | Keep WI-001 open until the sub-item is done. Skip the design for the sub-item and build it. | sub-item build, PostToolUse |
| s16 | Do you remember how I like my commit messages? | memory recall |
| s17 | Sub-item approved. Ship it; merging locally into main is fine, you have my OK. | work-finish, publish-docs with no remote |
| s18 | Ship WI-001 and mark it Done. Merging locally into main is fine. Remove leftover worktrees and branches. | Done |
| check | `git log --all --format='%H%n%B' \| grep -i -E 'co-authored-by\|generated with'` prints nothing | no AI credit |
