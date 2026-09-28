# Confirmation run d: local tracker and local Hindsight memory (Codex)

Run on 2026-09-28 from 16:22 to 17:12 UTC, after the final fix round
(toolkit-v2 commit `9d21337`). 20 fresh `codex exec` sessions plus 4 turns
that resumed an earlier session (codex-cli 0.157.0, reasoning effort medium).
Plugin versions in Codex: toolkit 0.2.4, work 0.2.6, memory 0.2.4,
session-skills 0.2.4, git-workflows 0.2.4. The confirm-a-local run re-added
the plugins and set them back to `enabled = false` before this run started
(`scratchpad/codex-readd.done`, 16:21:33 UTC: "cache copies match the source
folders file for file").

## Result

**Not passed.** The work item went from `01-discovery` to Done with every
approval in Mike's words, and nothing found blocks a solo developer. Two of
the new memory features did not work as Mike approved them:

1. **An unanswered "Save to memory?" is dropped (3 of 3 tries).** The agent
   asked, Mike's next message did not answer, and the agent never saved a
   proposal. Once, it said "I haven't saved the suggestion, and I'll leave it
   for you to decide later", and then nothing kept it. A proposal was saved
   only after Mike asked for one outright. After that, the rest worked: the
   proposal appeared in "What do you need from me?" and Mike rejected it.
2. **The duplicate check misses a reworded copy.** A near-copy with the same
   words was refused with the similar record listed. A copy with the same
   meaning in other words ("Explain each ..." against "Document every ...")
   was saved as a second record.

A third problem, for Codex with Hindsight memory: a `toolkit` command whose
text holds an apostrophe written `'\''`, the form every skill teaches, runs
inside the Codex sandbox, so Hindsight is blocked (problem 3).

Everything else worked:

- WI-001 "Add a --shout flag to the greet CLI" (type `build`) reached Done.
  WI-002 "Document the --shout flag in README" was split out with
  `toolkit work new --parent WI-001 --covers R-02`. It inherited the
  requirements approval and the parent's approved design, got its own result
  approval, and reached Done.
- Between s06 and s07, the tester (as Mike) made a new group folder `docs/`
  inside WI-001's folder and moved WI-002's folder into it under a new name,
  `WI-002-readme`. The s07 briefing reported the move. The reply told Mike in
  one line, and the next `toolkit work` command wrote the history row "Moved
  by hand: ... Its parent stays WI-001. Group: docs."
- "Remember that I prefer every command-line flag to be documented in the
  README" (s04) was saved to the Hindsight bank `greet-cli-confirm-d`. A
  later fresh session (s11) found it with `toolkit memory find` and quoted it
  back.
- "Where are we?" (s07) opened `work-status`. "What do you need from me?" (s08
  and s12) opened `work-decide`. In s12 it listed the memory proposal as a
  decision.
- Clean delete: the retired record no longer shows in `toolkit memory find`,
  `toolkit memory list`, the briefing, or the briefing cache
  (`.git/toolkit-v2/memory-cache.json`). The rejected proposal is gone from
  the Hindsight bank.
- No commit carries an AI credit line (`final/git.txt`).
- `~/.codex/config.toml` after the run equals the copy taken before it
  (`snapshots/codex-config-compare.txt`).

## How the sessions ran

- Project folder: a new Git repository with no remote. Its first commit
  `87232ba` holds the same four files as earlier rounds (`bin/greet.mjs`,
  `test/greet.test.mjs`, `package.json`, `README.md`):
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/confirm-d-hindsight`
- A fresh session:

  ```sh
  codex exec --json <sandbox choice> --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" "<prompt>" < /dev/null
  ```

- A resumed turn (s10b, s10c, s10d, s18b) adds `resume <thread id>` after
  `-C <project folder>`. This is Mike's next message in the same chat, which
  the unanswered-proposal check needs.
- Sandbox choice: `--sandbox workspace-write`. s02, s09, s13, and s17 used
  `--approve-for-me` instead. It stands in for Mike clicking "approve" on the
  Git commands; each of those prompts said he approved them.
- s00 also passed
  `-c 'plugins={"toolkit@toolkit-v2"={enabled=true},"project-init@claude-toolkit"={enabled=true},"second-brain@claude-toolkit"={enabled=true},"git-workflows@claude-toolkit"={enabled=true},"sf-architect-solutioning@claude-toolkit"={enabled=true}}'`.
  After setup, the project's own `.codex/config.toml` switched the plugins.
- Folder trust came from the `-c projects=...` value and hook trust from
  `--dangerously-bypass-hook-trust`. So `toolkit doctor` always warns "Codex
  does not trust this folder" and "The Toolkit V2 hooks are not trusted in
  Codex yet". Both warnings come from the test method.
- The Hindsight server at 127.0.0.1:8888 was not stopped. It had 20 banks
  before the run and 21 after; the new one is `greet-cli-confirm-d`. It is
  kept like the banks of the earlier rounds; Mike can delete it.
- `sessions/` holds each session's prompt, command line (`.command.txt`),
  `codex exec --json` output (`.jsonl`), a readable summary with every tool
  call and its `toolkit` output (`.summary.txt`), the hook text Codex added
  (`.hooks.txt`), and the hook state file (`.hookstate.json`).
  `sessions/index.txt` lists times and thread ids. The full Codex session
  logs stay in `.../scratchpad/runs/confirm-d-hindsight-logs/`
  (`*.rollout.jsonl`).

## Timeline

| # | Mike's prompt | Skills opened | What happened |
| --- | --- | --- | --- |
| s00 | "Set up this project with the toolkit: the project name is Greet CLI Confirm D, key greet-cli-confirm-d, id prefix WI, owner Mike. Track work items in local folders. Use local Hindsight for memory. It is not a Salesforce project. I use both Claude Code and Codex. I don't want a SOUL.md." | `project-setup` | `toolkit init` stopped: "The Codex sandbox blocked ... Nothing was written." The agent gave the exact terminal command with every answer kept. |
| terminal | Tester, as Mike, ran that command (`snapshots/s00b-terminal-init.txt`) | none | Added 27 files, kept the project's `README.md`, created bank `greet-cli-confirm-d`, wrote `.toolkit.json` last. |
| s01 | "I ran the toolkit init command in a terminal and it finished. Finish setting up the project." | `project-setup` | Doctor (0 problems), sync dry run, `hindsight service status`, `ensure-bank`, `npm test`. Wrote the focus. Asked the outcome in its own question ("What should this project do for you, in one sentence?"), with a suggestion, and wrote nothing from the code. |
| s02 | "The outcome I want for this project: a small, friendly greeting command that I can grow with a few simple flags. Then yes, commit the setup files. I approve the git add and git commit commands." (`--approve-for-me`) | `project-setup`, `memory-save` | Wrote the outcome, committed `24c8716 Set up Toolkit V2 for greeting CLI`. Last line: "Tell me the first thing you want built." |
| s03 | "New work: Add a --shout flag to the greet CLI. It should print the greeting in capital letters. Track it as a work item and ask me what you need to pin down the requirements." | `work-on`, `work-requirements`, `memory-save`, `publish-docs` | `toolkit work new ... --type build --stage 01-discovery` made WI-001. Stage 02, Q-01 asked with a recommendation. |
| s04 | "Yes, go with your recommendation: the whole greeting in capitals, like HELLO, MIKE!, and the flag works before or after the name. Also, remember that I prefer every command-line flag to be documented in the README." | `work-decide`, `work-requirements`, `work-on`, `memory-save` | Keep-phrase hook fired. "Saved to memory: user_document_cli_flags_in_readme (new record). Where: Hindsight bank greet-cli-confirm-d". A `requirements_review` worker ran. Asked "Do you approve these requirements?" |
| s05 | "Approved." | `work-decide`, `work-requirements`, `solution-design`, `memory-save` | Requirements approved by Mike. Stage 04. Three workers ran (`requirements_review`, `design_architect`, `design_critic`); the critic's finding was fixed and checked again. Asked "Do you approve Option A for the build?" |
| s06 | "Go with option A. And split this: put the README documentation part into its own sub-item, so it can be built and checked on its own." | `work-decide`, `work-organize`, `work-delegate`, `solution-design`, `memory-save` | `approve WI-001 --design --by Mike`. `toolkit work new --title 'Document the --shout flag in README' --type build --parent WI-001 --covers R-02`: "It delivers WI-001 R-02 and inherits that requirements approval ... WI-001's approved design covers it". Delivery offer asked once (Q-02). |
| move | Tester, as Mike: `mkdir .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs`, then `mv .../WI-002-document-the-shout-flag-in-readme .../docs/WI-002-readme` | none | `snapshots/before-move.txt`, `snapshots/after-move.txt`. |
| s07 | "Where are we?" | `work-status` | Briefing: "Moved: WI-002 from WI-001-add-a-shout-flag-to-the-greet-cli/WI-002-document-the-shout-flag-in-readme to WI-001-add-a-shout-flag-to-the-greet-cli/docs/WI-002-readme (moved and renamed by hand). It is still a sub-item of WI-001." Reply led with the one waiting decision and said "You moved and renamed WI-002's folder under `docs/`; it remains a sub-item of WI-001." |
| s08 | "What do you need from me?" | `work-decide`, `work-delegate` | One decision (Q-02), with a recommendation. |
| s09 | "No, work with me directly. It's a small change, so no helper agents. Keep going with the build. I approve the git commands you need for it (worktree, add, commit)." (`--approve-for-me`) | `work-decide`, `work-on`, `work-delegate`, `work-check`, `memory-save` | `--delivery owner-led`. Worktrees on `claude/wi-001-...` and `claude/wi-002-...`. Commits `6250bf5` (flag and tests) and `9c30dd9` (README). WI-002 at stage 11. "No independent checker ran, as you requested no helper agents." |
| s10 | "From how this work has gone so far, is there anything about how I like to work that you would save to memory? Suggest it, but ask me first before saving anything." | `memory-save` | Suggested "give distinct documentation work its own item" and asked "**Save it to memory?**" |
| s10b (resumed s10) | "Is WI-001 ready for me to look at yet?" | `work-status`, `work-check` | Answered the status question. **No proposal saved** (problem 1). |
| s10c (resumed s10) | "I'll decide on that memory suggestion later, not now." | none | "Understood. I haven't saved the suggestion, and I'll leave it for you to decide later." **No proposal saved.** |
| s10d (resumed s10) | "Then don't lose it: keep it as a proposal I can say yes or no to later, the way the toolkit is meant to handle an unanswered save question." | `memory-save` | `toolkit memory save ... --proposal`: "Saved to memory as a proposal: user_separate_documentation_work_item (new record). It is not a fact until the owner answers." Status `needs-review`, authorization "Proposed by the agent on 2026-09-28; the owner has not answered". |
| s11 | "Before I approve anything: what did I tell you earlier about command-line flags and the README? Does this change follow it?" | `memory-find` | `toolkit memory find 'command-line flags README'` returned only the current record (the proposal was left out). Reply: "You told me to document **every command-line flag in the README** ... recorded as `user_document_cli_flags_in_readme`". Yes, the change follows it. |
| s12 | "What do you need from me?" | `work-decide` | `toolkit work decisions`: "2 decisions wait on the owner": WI-002 result approval, and under "Memory proposals": `user_separate_documentation_work_item`. Asked the first decision; said the memory proposal comes next. |
| s13 | "I approve the WI-002 README result. And no to that memory proposal about separate documentation work items: don't keep it. Then carry on with WI-001; I approve the git commands you need." (`--approve-for-me`) | `work-decide`, `memory-save`, `work-on`, `work-finish`, `work-check` | `approve WI-002 --result --by Mike`. `toolkit memory reject user_separate_documentation_work_item`: "Rejected ...: the owner said no, so the proposal was deleted." WI-002's commit brought into WI-001's branch, WI-001 checked, stage 11. |
| s14 | "Remember that I want each command-line flag explained in the README file." | `memory-save` | Searched first, found the existing record, saved nothing. The Stop hook blocked once; the agent answered in one line that the record already exists. |
| terminal | Tester ran two saves by hand (`snapshots/s14b-terminal-duplicate.txt`) | none | A reworded copy was **saved** (problem 2). A closer copy was refused with both similar records listed. |
| s15 | "I saved a second memory about README flags by mistake: user_explain_each_cli_flag_in_readme. It repeats the older one. Forget that one and keep the older one." | `memory-save` | `toolkit memory retire user_explain_each_cli_flag_in_readme`. Status retired (stored `archived`). |
| terminal | Tester checked find, list, briefing, cache (`snapshots/s15b-terminal-retired-check.txt`), and ran `--reflect` (`snapshots/reflect-terminal.txt`) | none | The retired record is absent from all of them. Reflect answered in 36.7 s and named only the current record. |
| s16 | "Good. I approve the WI-001 result." | `work-decide`, `work-finish`, `memory-save` | `approve WI-001 --result --by Mike`, stage 12, merge question Q-03 asked. |
| s17 | "Yes, merge it locally into main; there is no remote. I approve the merge and the git commands you need, and you can close both items out when they are done." (`--approve-for-me`) | `work-finish`, `work-decide`, `publish-docs`, `memory-save` | Fast-forward merge to `9c30dd9`. `publish-docs.mjs`: "No remote: this save will be committed locally on main; nothing is fetched or pushed." then "No remote: committed locally. f2d8a08... is on main." `requirements/greeting/GREETING.md`, `system-guide/greeting.md`. Both worktrees and branches removed. `work finish` WI-002, then WI-001. Focus cleared. |
| s18 | "Now that both items are done, is there anything about how this project works that you would save to memory? Ask me first." | `memory-save` | Asked: "Do you want 'work with me directly on small changes, without helper agents' saved as a standing preference for this project?" |
| s18b (resumed s18) | "What is next on the project roadmap?" | `work-status` | Answered the roadmap question: "nothing is waiting on your decision". **No proposal saved**; `toolkit work decisions`: "Nothing is waiting on the owner." |
| s19 | "Please run this exact shell command once, on its own, and show me its output: toolkit memory find 'Mike'\''s README preference'" | none | The shell received exactly that command, alone. It ran inside the sandbox: "The request to the Hindsight server ... was blocked before it left this computer (EPERM ...)" (problem 3). |

## Proof by requirement

### Work item from 01-discovery to Done

`final/WI-001-WORK-ITEM.md`, `final/WI-002-WORK-ITEM.md`, `final/work-list-all.txt`.

- `toolkit work show WI-001`: "Stage: Done | Waiting on: none | Continue with: nothing (finished) ... Sub-items: WI-002 | Design: approved".
- WI-002: "Stage: Done ... Parent: WI-001 ... delivery: owner-led ... result_approved: "2026-09-28 by Mike"".
- Recent History of WI-001, newest first, holds each approval in Mike's
  words ("Mike said: Approved.", "Owner's words: Go with option A. ...",
  "Owner's words: Good. I approve the WI-001 result.", "Owner's words: Yes,
  merge it locally into main; ...").
- `toolkit work validate`: "Checked 2 items: 2 clean, 0 errors, 0 approval gate problems. No open question waits on the owner."
- Overview of both: "**Blockers:** None." and "**Current position:** Done on 2026-09-28. ...".
- No fill-in guide comment is left in either `WORK-ITEM.md`.

### Sub-item and hand move

- Related items: WI-001 names "Sub-item WI-002 covers R-02"; WI-002 names
  "Parent WI-001 (R-02)". WI-001's Roadmap P2 row has `WI-002` in the
  Sub-items column.
- WI-002 history: "Moved by hand: .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/WI-002-document-the-shout-flag-in-readme/WORK-ITEM.md -> .work-items/WI-001-add-a-shout-flag-to-the-greet-cli/docs/WI-002-readme/WORK-ITEM.md. | Its parent stays WI-001. Group: docs."
- `toolkit work list --tree` after the move shows `docs/ (group)` with WI-002
  under it. Every later session found WI-002 at the new path.

### "Remember that I prefer X", saved and found later

- s04 save output: "Saved to memory: user_document_cli_flags_in_readme (new record). Where: Hindsight bank greet-cli-confirm-d at http://127.0.0.1:8888 ... Approved by: Mike".
- The record uses the model's bold labels (`**Remember:**`, `**Why:** Not stated by the owner.`, `**How to apply:**`, and the rest).
- s11, a fresh session, found it with `toolkit memory find` and quoted it.

### "Where are we?" and "What do you need from me?"

- s07 opened `work-status` and led with "**One decision is waiting on you:**".
- s08 and s12 opened `work-decide`. s12's `toolkit work decisions` listed the
  WI-002 result approval and the memory proposal.

### Memory proposal

- Organic path (Mike does not answer "Save to memory?"): failed 3 of 3
  (s10b, s10c, s18b). See problem 1.
- After Mike asked for it (s10d): the proposal was saved as `needs-review`,
  left out of `toolkit memory find` (s11), listed in the briefing ("Memory
  proposals waiting on the owner (not facts: do not rely on them; work-decide
  asks him)") and in `toolkit work decisions` (s12), and rejected by Mike
  (s13). After the rejection, `toolkit memory list --status all` no longer
  lists it, and a direct Hindsight recall for "separate documentation work
  item" returns `user_document_cli_flags_in_readme`, `focus`, and
  `user_explain_each_cli_flag_in_readme`, but not the proposal.

### Duplicate check

`snapshots/s14b-terminal-duplicate.txt`:

- Same key, no `--expect`: "Error: user_document_cli_flags_in_readme was not
  saved: memory already has a record like it. - user_document_cli_flags_in_readme,
  the same key ... Fix: ... save again with --expect 98ae4331b503 ..." (exit 2).
- Close near-copy ("Document each command-line flag in the README file"):
  "Error: user_readme_documents_each_cli_flag was not saved: memory already
  has records like it." Both similar records are listed (exit 2).
- Reworded copy ("Explain each command-line flag in the README file"; body
  "Mike wants each command-line flag explained in the README file."):
  "Saved to memory: user_explain_each_cli_flag_in_readme (new record)." (exit
  0). See problem 2.
- In a session (s14) the agent searched first and saved nothing, so the
  duplicate did not happen there.

### Clean delete

`snapshots/s15b-terminal-retired-check.txt`:

- `toolkit memory find 'explain each command-line flag in the README file'` lists only `user_document_cli_flags_in_readme`.
- `toolkit memory list` lists only the current record; `--status retired` lists `user_explain_each_cli_flag_in_readme [archived]`.
- `toolkit brief`: "Project memory (hindsight): 1 record ... Memory records: - user_document_cli_flags_in_readme".
- `.git/toolkit-v2/memory-cache.json` holds only the current record (`grep -c explain_each` gives 0).
- The s16 and s17 session logs hold no `explain_each` text.
- In the Hindsight bank the retired record is still stored, with metadata
  `"status": "retired"`, so `toolkit memory restore` can bring it back. That
  is the documented retire behavior. `toolkit memory delete` is the command
  that removes it; it was not run.

### No AI credit in commits

`final/git.txt`: five commits, all by "Mike Rihm <michael@rihm.com>". A search of
every commit message for "co-authored", "generated with", "claude", "codex",
"openai", "anthropic", and "gpt" finds nothing.

### Hooks

| Hook | Seen |
| --- | --- |
| SessionStart briefing | Every session after setup (s01 to s19), and again on each resumed turn. No briefing carried a hook-trust or folder-trust warning. |
| UserPromptSubmit keep phrase | s04 and s14: "The owner stated something to keep; memory-save records it, or work-on if it is a task." |
| PreToolUse chained-command note | s05, s06 (twice), s09. |
| PostToolUse direct-edit note | s06 ("The design of WI-001 was edited directly and passes validation. toolkit work design <id> --set-file ..."), s13 ("WI-001 was edited directly and passes validation."). |
| Stop | s14: blocked once with "The owner asked this turn for something to be kept ... or say in one line why it was not recorded." The agent then said the record already exists. |

## Fixed bugs checked in this run

Numbers are from `open-bugs-status.md`. "Held" means the fix held in this run.

| Bug | What this run showed | Result |
| --- | --- | --- |
| 1, 40 delivery offer listed twice | `toolkit work decisions` listed Q-02 once (s06, s07, s08). | Held |
| 2 Done item keeps a stale Overview | Both items: "Blockers: None." and "Current position: Done on 2026-09-28: ...". | Held |
| 3 `git fetch` with no remote as a blocker | The agent ran `git fetch origin` once, in s02 (`project-setup`, following the model rule that is still left for Mike). It failed in the sandbox. The agent then checked `git remote`, and never called the fetch a blocker. No work skill ran a fetch. | Held (model rule still left for Mike) |
| 4, 60 publish-docs with no remote | "No remote: committed locally. f2d8a08... is on main." | Held |
| 5 outcome filled without asking | s01 asked the outcome in its own question; s02 wrote Mike's words. | Held |
| 6 stale current focus | The focus was rewritten in every session that changed work; no out-of-date line in the final briefing. | Held |
| 7 "Continue with: work-finish" on Done | "Continue with: nothing (finished)". | Held |
| 8, 15 validate "0 questions" | "0 approval gate problems. 1 open question waits on the owner". | Held |
| 12, 24 setup steps kept forever | The briefing listed which setup steps are done, and the agent dropped them from "Waiting on the owner". | Held |
| 17, 63 memory labels | Bold labels in every saved record. | Held |
| 21, 46 move report | Briefing and reply said what moved and that the parent stayed WI-001. | Held |
| 22 requirements area layout | `requirements/greeting/GREETING.md` (from `system-area-template/`). | Held |
| 27 no design agents | `design_architect` and `design_critic` workers ran in s05. | Held |
| 28 result approval counted twice | Each stage-11 item listed once. | Held |
| 29 branch prefix | `show` printed "Worktree branch for this item: claude/wi-001-add-a-shout-flag-to-the-greet"; that branch was used. | Held |
| 31 task field line breaks | Tasks have one field per line with hard breaks. | Held |
| 38 questions in a question tool | No question tool was called; every question was in the reply text. | Held |
| 41, 62 focus heading | Every saved focus keeps `# Current focus` and `Last updated:`. A focus with wrong section names was refused (s01). | Held |
| 42, 61 fixed-name temp files | Workers' `mktemp -d` folders (`tmp.LzoQXJUuDE`, `tmp.iMiLlPrZ74`) were deleted; `git status` clean after every session. | Held |
| 45 PostToolUse command for a design | Named `toolkit work design` for DESIGN.md. | Held |
| 47(a) sub-item delivery | WI-002 `delivery: owner-led`, copied from WI-001. | Held |
| 48 V2 plugins off machine-wide | All six `enabled = false`; config unchanged by the run. | Held |
| 49 trust warnings inside the hook briefing | None in any briefing. | Held |
| 50 memory save written with a temp file in one script | Every `toolkit memory save` passed `--body '<text>'` on its own. | Held |
| 58 AI credit in commits | None. | Held |
| 65 Recent History order | Newest first. | Held |
| 72 parent and sub-item links in the text | Both items name each other in Related items; WI-001's Roadmap names WI-002. | Held |

## Problems found

### 1. An unanswered "Save to memory?" is dropped (medium; a feature Mike approved does not work)

Evidence:

- s10 ended: "One possible preference to save: ... **Save it to memory?**"
- s10b, the same chat, Mike's next message: "Is WI-001 ready for me to look
  at yet?" The agent answered it and saved nothing.
- s10c, the same chat: "I'll decide on that memory suggestion later, not
  now." Reply: "Understood. I haven't saved the suggestion, and I'll leave it
  for you to decide later." Nothing was saved.
- s18 and s18b, a separate chat: "Do you want 'work with me directly on small
  changes, without helper agents' saved as a standing preference for this
  project?" Next message: "What is next on the project roadmap?" Reply:
  "nothing is waiting on your decision". `toolkit work decisions`: "Nothing is
  waiting on the owner."
- The rule was in the agent's context each time. In s10 it had read
  `memory-save/SKILL.md` step 3 ("An unanswered 'Save to memory?' ... is not
  dropped: save it as a proposal (`--proposal`, never with an approver)"),
  and the project rule `.claude/rules/memory-review-and-save.md` says the
  same.
- Only a skill's text asks for this save. No hook checks for it
  (`plugins/toolkit/lib/hooks/stop.mjs` checks only keep phrases and failed
  validation).

Why it matters: Mike's decision (GOAL.md, "Memory additions" 1) is that an
unanswered "Save to memory?" becomes a `needs-review` record listed under
"what do you need from me". Without the save, the question is lost when the
chat ends.

Suggested fix:

- `plugins/memory/skills/memory-save/SKILL.md` step 3: save the proposal at
  the moment the question is asked. Run `toolkit memory save ... --proposal`
  first, then ask "Save to memory: <one line>? It is saved as a proposal until
  you say yes or no." His yes runs `toolkit memory approve <key> --by <owner>`
  and his no runs `toolkit memory reject <key>`. This no longer depends on the
  agent noticing a missing answer in a later turn.
- As a backstop, the Stop hook blocks once when the turn's last assistant
  message asks a "save ... to memory" question and no `--proposal` save ran
  that turn. Reason text: "Save that suggestion with toolkit memory save
  --proposal, so it is kept if the owner does not answer." Check the Stop
  input fields in both hosts' captured hook pages first.
- Add a test that a proposal exists right after the question.

### 2. The duplicate check misses a reworded copy (medium)

Evidence (`snapshots/s14b-terminal-duplicate.txt`, and
`compareRecords` run by hand on the same text):

- Existing: description "Document every command-line flag in the README";
  Remember "Mike prefers every command-line flag to be documented in the
  README."
- New: description "Explain each command-line flag in the README file";
  Remember "Mike wants each command-line flag explained in the README file."
- `compareRecords`: `{ description: 0.444, body: 0.417, similar: false }`. The
  cut-off is `SIMILAR_AT = 0.6`
  (`plugins/toolkit/lib/memory/similar.mjs`). The save went through as a
  second record.
- `toolkit memory find 'explain each command-line flag in the README file'`
  returns the older record as its first match (s15b), so the Hindsight search
  finds it. `findSimilar` reads those matches (`results`, `maybe`,
  `closest`), but only word overlap decides.

Suggested fix, in `plugins/toolkit/lib/memory/similar.mjs`:

- Compare word stems ("documented" and "document", "explained" and
  "explain"), and treat "each" and "every" as one word.
- A record that the backend's meaning search returns first, with a word
  overlap of 0.4 or more on the description or the Remember point, counts as
  similar.
- Add the pair above as a test case.

The agent's own search-first step caught this copy in s14, so real use is
protected most of the time. The check exists as the backstop for when the
agent skips that step.

### 3. An apostrophe written `'\''` breaks toolkit commands in Codex (medium for Hindsight and Notion memory)

Every skill header teaches: "one-line values ... go in single quotes, with an
apostrophe written `'\''`". In Codex this fails in two ways.

- **(a) The Codex tool call drops the backslash.** Codex runs shell commands
  from JavaScript (`tools.exec_command({cmd:"..."})`). In a JavaScript string,
  `\'` is only `'`, so `'Owner'\''s words: ...'` reaches the shell as
  `'Owner'''s words: ...'`. Result: "zsh:1: unmatched '" in s05 and s06.
  The agent recovered each time: in s05 it wrote "Mike said: Approved."
  instead, in s06 it built the quoting with a small function, and in s09, s16,
  and s17 it used the typographic apostrophe (’). Mike's quoted "It's" was
  stored as "It’s".
- **(b) Written correctly, the command runs inside the sandbox.** In s19 the
  shell received exactly `toolkit memory find 'Mike'\''s README preference'`,
  alone. The project's `.codex/rules/toolkit.rules` did not let it out of the
  sandbox: "The request to the Hindsight server at http://127.0.0.1:8888 was
  blocked before it left this computer (EPERM ...)". The same command without
  an apostrophe reached Hindsight in s11, s14, and s15. This answers the open
  question in PROGRESS.md ("whether the `toolkit` allow rule matches a
  command with an escaped apostrophe"): it does not.

Why it matters: in a Codex project with Hindsight or Notion memory, a memory
save, focus update, or find whose text holds an ASCII apostrophe (for example
"Mike's") fails with EPERM. With the local tracker, a `toolkit work` command
still works inside the sandbox, because it writes only inside the project.

Suggested fix:

- In every skill header and in the PreToolUse chained-command note
  (`plugins/toolkit/lib/hooks/pre-tool.mjs` `chainedToolkitNote`), replace the
  `'\''` advice for Codex with: "write an apostrophe as ’ (U+2019), or reword
  it; never `'\''`". Claude Code can keep `'\''`.
- In Codex, the PreToolUse hook notes a `toolkit` command that holds `'\''`:
  "This form runs inside the Codex sandbox. Write the apostrophe as ’."
- Add a test for the note.

### 4. A test wrote to Mike's real toolkit settings folder (low; test isolation)

At the start of this run, `~/.config/toolkit-v2/plugin-root` (changed at
11:54) held
`/private/tmp/.../scratchpad/budget/plugins/toolkit`, a scratch copy at
version 0.2.3 (`toolkit version` printed `0.2.3`). The `scratchpad/budget/`
folder is dated 11:53 to 11:54, so the test that made it most likely wrote
the pointer. By the end of s00 it pointed at
`~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.4` again (every session-start
hook refreshes it). Until a hook runs, `toolkit`
in Mike's terminal would run an old scratch copy, or fail once that scratch
folder is deleted. AGENTS.md says tests point `TOOLKIT_V2_CONFIG_DIR` at a
temporary folder.

Suggested fix: find the harness that made `scratchpad/budget/`, and set
`TOOLKIT_V2_CONFIG_DIR` (and `HOME`) to a temporary folder in it.

### 5. Small reply wording gaps (low)

- s04 said "I saved your standing preference ..." instead of the skill's line
  "Saved to memory: <title>. Say 'forget that' to undo."
- s15 (retire) and s10c ended with no question and no next step, which
  `memory-save` step 8 asks for.

## Test-method notes (not bugs)

- Doctor's two Codex trust warnings come from `-c projects=...` and
  `--dangerously-bypass-hook-trust`. The hook-delivered briefing said "Codex
  trusts the Toolkit V2 hooks now", because the hook ran; doctor still reads
  no trust key. With real trust from Mike in `/hooks` both would agree
  (finding 51, left for Mike).
- Resumed turns (`codex exec ... resume <id>`) receive the session-start
  briefing again. That is expected for a resumed session.
- `--approve-for-me` stood in for Mike clicking "approve" on Git commands.
