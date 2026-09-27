# Sample run a: local tracker and built-in memory (round 1, kept for reference)

Run on 2026-09-26 and 2026-09-27 (UTC) in real Codex sessions. The tester
played Mike, the owner, and typed every prompt below. The work item reached
Done with a sub-item. The owner's hand rename of the sub-item folder, a saved
preference that a later session found, a status question, and a "what do you
need from me" question all worked. Setup and shipping each needed a
workaround from the tester; both are listed under Problems found.

## How the sessions ran

- Codex: `codex-cli 0.157.0`, Mike's own model setting (`gpt-6-sol`), with
  reasoning effort set to medium for speed. The Toolkit V2 plugins are the
  0.2.0 copies in `~/.codex/plugins/cache/toolkit-v2/`; they were checked
  identical to the source folders before the run.
- Project folder:
  `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/a-local-builtin-r1`,
  a new Git repository with one commit holding a two-line `README.md`.
- Every session was a fresh `codex exec` process:

  ```sh
  codex exec --json --sandbox workspace-write --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c 'projects={"<project folder>"={trust_level="trusted"}}' \
    -C "<project folder>" "<prompt>" < /dev/null
  ```

  The trust setting is passed for one run only; `~/.codex/config.toml` was not
  changed by this run (checked with a diff against the backup at the end).
  `notify=[]` stops Mike's Computer Use notifier from running at each turn end.
- Two sessions used `--sandbox danger-full-access` instead. This stands in for
  Mike approving a command outside the sandbox, which `codex exec` cannot ask
  for: s00d (writing `.codex/`) and s16 (Git commits and the merge).
- Setup sessions s00c and s00d also turned the `toolkit` plugin on for that
  one run with `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`, because
  a new project has no `.codex/config.toml` yet. The dotted form
  `-c 'plugins."toolkit@toolkit-v2".enabled=true'` was tried first (s00b) and
  Codex ignored it without a message.
- For each session, `sessions/` holds the exact prompt (`.prompt.txt`), the
  `codex exec --json` output (`.jsonl`), a readable summary with every tool
  call taken from the Codex session log (`.summary.txt`), the hook messages
  Codex added (`.hooks.txt`), and the hook state file the toolkit wrote
  (`.hookstate.json`). `sessions/index.txt` lists start times and thread ids.
  The full Codex session logs stay in the scratch folder
  `.../scratchpad/runs/a-local-builtin-r1-logs/` (`*.rollout.jsonl`).

## Timeline

| Session | Mike's prompt (short form) | Skills the agent opened | What happened |
| --- | --- | --- | --- |
| s00a | "Set up this project with the toolkit. My answers: ..." | `project-init:project-init` (claude-toolkit), `second-brain:knowledge-setup`, `work-tracker:work` | No V2 skill was listed in the new folder, so Codex used the old toolkit. It wrote an old-style project and also built the greet CLI. Tree: `snapshots/s00a-resulting-tree.txt`. Tester reset the folder to the first commit. |
| s00b | Same, with "Toolkit V2" named | `project-init:project-init` (claude-toolkit) | The dotted `-c` switch did nothing, so `project-setup` was still missing. The agent used the old skill and ended with "Toolkit V2 scaffolding is set up". Reset again. |
| s00c | Same, `toolkit` plugin on for the run | `toolkit:project-setup` | `toolkit init` failed: `EPERM ... mkdir '.../.codex'`. The agent ran init again with `--hosts claude-code` without asking, then `toolkit config set hosts claude-code,codex`, which failed with the same error but still saved both hosts. It deleted `SOUL.md` as Mike asked. |
| s00d | "Finish the Toolkit V2 setup for Codex. I approve running the toolkit command outside the sandbox ..." (full access) | `toolkit:project-setup`, `work:work-on`, `memory:memory-save` | `toolkit sync` added `.codex/config.toml`, `.codex/rules/toolkit.rules`, and `SOUL.md` again; the agent removed `SOUL.md` again. Doctor still reports "1 scaffold file is missing: SOUL.md". Tester committed the setup as Mike (`30ad042`). |
| s01 | "Add a --version flag to the greet CLI. There is no greet CLI yet ..." | `work-on`, `work-requirements` | `toolkit work new --title "Build greet CLI with version flag" --type build --stage 01-discovery` made WI-001; moved to 02; wrote R-01, R-02, Q-01; asked "What should the initial version be? I recommend 0.1.0". |
| s02 | "Remember that I prefer plain Node.js with no npm packages, and tests written with the built-in node:test runner." | `memory-save` | Keep-phrase hook fired. `toolkit memory save --type user --name nodejs-implementation-preference ... --approved-by Mike`; read back with `toolkit memory get`. |
| s03 | "yes, start at version 0.1.0 ... With no name it should print Hello, world! ..." | `work-decide`, `work-on`, `work-requirements`, `work-check` | Ran `toolkit memory find 'greet CLI version Node.js'` and got the s02 record. Wrote the answers and the Agreed goal; asked "Do you approve these requirements?" |
| s04 | "Approved." | `work-decide`, `work-on`, `work-requirements`, `solution-design`, `work-check` | `toolkit work approve WI-001 --requirements --by Mike`. Then it skipped design ("one straightforward built-in Node.js approach"), made worktree `.claude/worktrees/wi-001-greet-cli` on branch `claude/wi-001-greet-cli`, built the CLI and tests, ran a Codex helper as the acceptance checker, and asked for result approval. `git add` failed in the sandbox, so nothing was committed. |
| s05 | "Not yet, I do not approve the result. You skipped the design step ... How should we build this?" | `work-on`, `solution-design`, `work-decide` | Recorded the "no" in Mike's words, moved WI-001 from 11 back to 04, `toolkit work design WI-001 --create`, saved Options A (`package.json`) and B (a constant) as proposed. The design cites the s02 memory as a constraint. |
| s06 | "Go with option A." | `work-decide`, `solution-design`, `work-on`, `work-check`, `memory-save` | `toolkit work approve WI-001 --design --by Mike`; stages 04 -> 08 -> 09 -> 11; independent check again; asked for result approval. |
| s07 | "Before I approve anything, split this up ... make the --version flag its own sub-item under it." | `work-organize`, `memory-save` | `toolkit work sync`, `toolkit work set WI-001 --stage 05-breakdown`, `toolkit work new --title "Add --version flag" --type build --parent WI-001` made WI-002 in `.work-items/WI-001-build-greet-cli-with-version-flag/WI-002-add-version-flag/`. R-02 was moved out of WI-001 into WI-002 as a new R-01 needing a new approval; a new WI-002 design was saved as proposed. |
| (hand) | Tester, as Mike, renamed the folder `WI-002-add-version-flag` to `version-flag` | none | `snapshots/before-move-tree.txt` and `snapshots/after-move-tree.txt`. |
| s08 | "Keep going." | `work-on`, `work-decide`, `work-check`, `work-delegate` | The briefing said: "Renamed folder: WI-002 is now at .work-items/WI-001-build-greet-cli-with-version-flag/version-flag/WORK-ITEM.md (was .../WI-002-add-version-flag/WORK-ITEM.md)." The agent used the new path and asked for WI-002's requirement approval. It did not mention the rename to Mike. |
| s09 | "Where are we?" | `work-status` | "Six decision prompts are waiting on you, grouped around two work items" (there were three real decisions), then "Say 'what do you need from me' ...". |
| s10 | "What do you need from me?" | `work-decide` | One decision, with a recommendation: approve WI-002's requirement. |
| s11 | "Approved: I approve the WI-002 requirement as written." | `work-decide`, `work-requirements`, `solution-design` | `toolkit work approve WI-002 --requirements --by Mike`; asked for WI-002 design approval. |
| s12 | "I approve the WI-002 design, option A. Keep going." | `work-on`, `work-decide`, `solution-design`, `work-check`, `memory-save` | `toolkit work approve WI-002 --design --by Mike`; stages 03 -> 08 -> 09 -> 11; asked "Do you approve the WI-002 result?" It said no separate independent check ran for WI-002. |
| s13 | "... I approve the WI-002 result." | `work-decide`, `memory-save` | `toolkit work approve WI-002 --result --by Mike`. |
| s14 | "... I approve the WI-001 greeting result." | `work-finish`, `work-decide`, `work-on`, `memory-save` | `toolkit work approve WI-001 --result --by Mike`. |
| s15 | "Ship it: WI-001 and WI-002 ... merge it into main locally. I approve that merge. Then mark both done." | `work-finish`, `work-on`, `publish-docs`, `memory-save` | `fatal: Unable to create '.../.git/worktrees/wi-001-greet-cli/index.lock': Operation not permitted`. Nothing committed; both items stayed at 11. |
| s16 | "Ship WI-001 and WI-002 now. I approve running git outside the sandbox ..." (full access) | `work-finish`, `work-on`, `publish-docs`, `memory-save` | Commits `78bbe1e` (WI-001) and `41fbaab` (WI-002), fast-forward merge to `main`, requirements baseline commit `85f4206` (`requirements/greeting/GREETING.md`, `system-guide/GREETING.md`), `toolkit work finish WI-002 --by Mike --evidence ...`, then the same for WI-001; worktrees and branches removed. |
| s17 | "Do you remember how I like code and tests written in this project?" | `memory-find` | "You prefer plain Node.js with no npm packages ... Write tests with node:test ... [Project memory: user_nodejs_implementation_preference, recorded from you on 2026-09-27.]" |

## Proof, item by item

### Work item from 01-discovery to Done

- `final/WI-001-WORK-ITEM.md` and `final/WI-002-WORK-ITEM.md` hold the full
  Recent History. WI-001 went 01 -> 02 -> 03 -> 06 -> 08 -> 09 -> 11 ->
  (owner said no) 04 -> 08 -> 09 -> 11 -> 05 (split) -> 11 -> 14 -> Done.
  WI-002 went 01 -> 02 -> 03 -> 08 -> 09 -> 11 -> 14 -> Done.
- Each approval is a CLI record with Mike's words in the next history row,
  for example "Requirements approved by Mike." then "Owner's words: Approved."
- `final/tracker-and-doctor.txt`:
  `WI-001 Build basic greeting CLI (14 Specification update, Done)` with
  `WI-002 Add --version flag (14 Specification update, Done)` under it, and
  `Checked 2 items: 2 clean, 0 errors, 0 questions for the owner.`
- `final/git-and-app.txt`: five commits, all by `Mike Rihm <michael@rihm.com>`,
  no AI credit; `node --test` 3 pass, 0 fail; the three commands print
  `Hello, Mike!`, `Hello, world!`, and `0.1.0`.

### Sub-item made by splitting

- s07 output: `Created WI-002: Add --version flag (01 Discovery, Backlog, sub-item of WI-001) at .work-items/WI-001-build-greet-cli-with-version-flag/WI-002-add-version-flag/WORK-ITEM.md.`
- `final/DASHBOARD.md` tree: WI-002 nested under WI-001.

### Folder renamed by hand, next session carried on

- `snapshots/before-move-tree.txt` and `snapshots/after-move-tree.txt`.
- `sessions/s08-keep-going.hooks.txt`: the briefing line "Renamed folder: WI-002 is now at ..." quoted in the timeline.
- s08 then ran `toolkit work show WI-002`, which printed the new location, and
  every later session used it. Every item validated clean afterwards.

### Preference saved and found later

- s02: `sessions/s02-remember.hooks.txt` has the keep-phrase hook line "The
  owner stated something to keep; memory-save records it, or work-on if it is
  a task." `sessions/s02-remember.hookstate.json` records `"keep": "remember that"`
  and the `toolkit memory save` record.
- The record is `.memory/user_nodejs_implementation_preference.md`
  (`final/memory-listing.txt`), indexed in `.memory/MEMORY.md` under User.
- Found by s03 (`toolkit memory find` returned it), used by s05 (the WI-001
  design's constraints table: "Owner preference in project memory;
  confirmed"), and answered in s17 with the record name as the source.

### Status question and "what do you need from me"

- s09 opened `work-status` and ran `toolkit brief`, `toolkit work list --tree`,
  `toolkit work next`, `toolkit work decisions`, and `toolkit memory focus`.
  It changed nothing (no toolkit write in `s09-where-are-we.hookstate.json`).
- s10 opened `work-decide`, ran `toolkit work decisions`, and asked one
  question with a recommendation.
- `snapshots/decisions-before-s10.txt` shows the queue it read.

### Hooks

- **SessionStart**: every session from s00d on has the "Project briefing:
  greet (greet), owner Mike ..." message (`sessions/*.hooks.txt`).
- **UserPromptSubmit**: the keep-phrase line in s02 only, where the prompt
  had "Remember that".
- **PostToolUse**: every `*.hookstate.json` lists the toolkit writes of that
  turn (for example 10 records in s01, 30 in s07). When the agent edited
  a work item file directly with `apply_patch`, the hook validated it and
  recorded the file under `edits`: s06 (`DESIGN.md` and `WORK-ITEM.md` of
  WI-001), s12 (WI-002), and s14 (both). All were valid, so the hook added no
  message. No session produced an invalid work item file, so a validation
  error message was not seen in this run.
- **Stop**: the `updated` time in each state file is after the last record of
  the turn, including the read-only sessions s09, s10, and s17. It never
  blocked (`stopBlocked: false`); s02 had a save.
- **PreToolUse**: no session ran a command the guard blocks, so it was not
  seen firing in this run (the Codex setup test showed it blocking
  `git add -A`).

## Problems found

Numbered by how much they hurt a solo developer. Each one has the evidence
file and a suggested fix. The same list is in the run report.

1. **A new project cannot start Toolkit V2 setup from Codex.** The V2
   plugins are off for the whole computer and are turned on only by the
   project's own `.codex/config.toml`, which `toolkit init` writes. So in a
   new folder, "set up this project" finds no `project-setup` skill and Codex
   runs claude-toolkit's `project-init` instead: s00a (old scaffold, and it
   built the app), s00b (Mike named "Toolkit V2"; the agent still used
   `project-init` and reported "Toolkit V2 scaffolding is set up"). Fix:
   turn on only `toolkit@toolkit-v2` for the whole computer in Codex (its
   hooks do nothing outside a V2 project) so `project-setup` is always
   listed, and make `project-init`'s description or the V2 skill's say which
   toolkit each sets up; or document "run `toolkit init` in a terminal first"
   in the README and machine-setup output. Tell sample-run scripts to use the
   inline-table form `-c 'plugins={"toolkit@toolkit-v2"={enabled=true}}'`.
2. **`toolkit init` inside Codex fails on `.codex/`, and a retry marks the
   toolkit's own files as the owner's.** s00c: `Error: Could not write
   .../.codex/config.toml: EPERM`. The first run had already written 27
   files. The retry printed "Kept the project's own file (the toolkit never
   replaces it)" for them (and for Mike's own `README.md`), recorded only 3 files in
   `.toolkit.json` `installed`, and doctor now lists 21 notes "X was changed
   by the project, so sync leaves it alone" for files nobody changed. Those
   files will never get toolkit updates. Reproduced outside Codex: put a file
   named `.codex` in a new repo, run init (fails), remove it, run init again
   -> 5 files in `installed`, 21 "changed by the project" notes. Fix: write
   `.codex/` (and any other file that can fail) before the model files, or
   write `.toolkit.json` with the `installed` hashes of every file copied so
   far even when a later step fails; on a retry, treat a file whose hash
   equals the scaffold source as installed by the toolkit.
3. **Git writes are blocked by the Codex sandbox, so work-on and
   work-finish cannot commit.** s04 and s15: `fatal: Unable to create
   '.../.git/worktrees/wi-001-greet-cli/index.lock': Operation not permitted`.
   Delivery worked only in s16 with full access. `.codex/rules/toolkit.rules`
   lets only `toolkit` run outside the sandbox. Fix: add `prefix_rule`
   entries for the Git commands the skills need (`git add`, `git commit`,
   `git worktree add`, `git worktree remove`, `git merge`, `git branch -d`,
   `git push`) with `decision = "prompt"` so Codex asks the owner once per
   command, and say in `work-on` step 7 and `work-finish` step 2 that in Codex
   these commands need the owner's approval outside the sandbox.
4. **Setup agent changed Mike's host answer without asking, and
   `toolkit config set` saved a value although it failed.** s00c: after the
   EPERM, the agent ran `toolkit init ... --hosts claude-code` (Mike said
   both hosts), then `toolkit config set hosts claude-code,codex`, which
   exited 1 with the same EPERM but left `"hosts": ["claude-code", "codex"]`
   in `.toolkit.json`. Fix: in `project-setup` step 3, say "If init fails with
   EPERM on `.codex/`, stop and ask the owner to approve running it outside
   the sandbox; never change a setup answer to get past an error." Make
   `config set` write `.toolkit.json` only after its sync succeeds, or print
   that the value was saved and the sync still needs a rerun.
5. **Saying no to `SOUL.md` leaves a permanent doctor problem, and sync
   brings the file back.** `project-setup` says to remove `SOUL.md` when the
   owner says no. After that, `toolkit sync` (run by `config set` in s00c and
   by s00d) added it again, the agent deleted it again, and doctor still says
   "Problems (1): 1 scaffold file is missing: SOUL.md. Fix: Run toolkit sync."
   (`final/tracker-and-doctor.txt`). The agent even wrote this exception into
   the current focus so later sessions would not "fix" it. Fix: record the
   declined optional file in `.toolkit.json` (for example
   `"declined": ["SOUL.md"]`, set by a `toolkit config` command or by init
   `--no-soul`), and have sync and doctor skip declined files.
6. **Splitting after approval moves an approved requirement and asks for the
   same approvals again.** s07: `work-organize` says "Each child links the
   parent's R-xx ids and copies none", but the agent moved WI-001 R-02 out of
   WI-001 into WI-002 as a new R-01 at stage 01/02, and proposed a new
   WI-002 design. Mike then had to approve WI-002's requirement (s11) and
   design (s12) that he had already approved in s04 and s06. WI-001 kept
   `requirements_approved` although its requirement list changed. Fix: in
   `work-organize` step 6 and `references/moves.md`, say that a split never
   removes or renumbers a parent's R-xx; a child that only covers approved
   parent requirements links them ("Covers WI-001 R-02") and starts at the
   parent's stage with the parent's approvals, and a new child approval is
   needed only for new or changed behavior. Consider a CLI option such as
   `toolkit work new --parent WI-001 --covers R-02` that copies the approval
   record.
7. **The decision queue counts one decision two or three times.** s09 said
   "Six decision prompts are waiting on you" when three were real (WI-001
   result, WI-002 requirement, WI-002 design).
   `snapshots/decisions-before-s10.txt` lists, for WI-001, both "WI-001 is
   waiting on the owner (11 User approval)" and "WI-001 is at 11 User
   approval: the owner reviews the result", plus "The agent-led delivery
   offer has not been made for WI-001 (it has 1 sub-item)", which is an agent
   step, not a question for Mike. WI-002 has the `waiting_on` line, the Q-03
   row, and the design line. The same duplicates are in the briefing and
   `DASHBOARD.md`. Fix: in `toolkit work decisions`, drop the generic
   `waiting_on: owner` line when a more specific entry exists for that item,
   and show an unmade delivery offer to the agent (briefing "Agent to-dos"),
   not as an owner decision.
8. **The agent did not tell Mike about the rename it was told about.** s08:
   the briefing said "Renamed folder: WI-002 is now at ... (the work-organize
   skill handles moves and copies ...)", but the agent neither opened
   `work-organize` nor said it in its reply; `work-organize` says "Say each
   one to the owner in one line". Fix: make the briefing line an instruction
   ("Tell the owner in one line: ...") and add to `work-on` step 1: "If the
   briefing lists tracker changes, report each one in one line before other
   work."
9. **`work-on` skipped the design for a build item that had two reasonable
   designs.** s04 set WI-001 from 03 to 06 with "The approved CLI has one
   straightforward built-in Node.js approach; a separate design is
   unnecessary", then built and checked it in the same turn. In s05 the same
   question produced two real options (read `package.json` or a constant).
   The owner only learned about the skip from the result. Fix: in `work-on`
   step 5, when design is skipped for a `build` item, say it to the owner in
   one line before building ("I plan to skip design because ...; say 'design
   first' to stop me") or require the owner's yes to skip.
10. **Fill-in guides and history order in finished items.** The Done items
    still carry the template's `<!-- Fill-in guide ... Delete this guide after
    filling the item. -->` comment and the Recent History guide comment; the
    CLI never removes them and `toolkit work validate` reports the items as
    clean. The template says history rows go "newest first", but
    `toolkit work history` and every CLI row are appended at the bottom
    (oldest first). Many CLI rows ("Set waiting on owner.", "Owner's words:
    ...") leave the "Effect on the work" column empty. Fix: have
    `toolkit work` remove each section's guide comment when it writes that
    section (or when the item leaves 02), have validate warn about guides left
    after stage 03, and either insert history rows at the top or change the
    model's guide text to "oldest first" (a model change needs Mike's yes).
11. **Temporary body files use fixed names in a shared folder.** Agents wrote
    `--set-file` and `--body-file` files as `/tmp/wi001-requirements.txt`,
    `/tmp/wi001-roadmap.txt`, `/private/tmp/greet-current-focus.md`, and
    similar. Other sample projects running at the same time used the same
    names (`/tmp/wi001-overview.md`, `/tmp/wi001-notes.md`,
    `/private/tmp/greet-cli-sample-d-focus-2026-09-27.md`), and none of the
    files are deleted. Two sessions writing `/tmp/wi001-overview.md` at once
    would save one project's text into the other's work item. Fix: in the
    shared conventions, say "make a new folder with `mktemp -d` for each
    save, and delete it after the toolkit command succeeded", or let the
    commands read the text from standard input (`--set-file -`) and document
    that form for Codex.
12. **Branch name rule disagrees between the model and the skill.** `work-on`
    step 6 says the item's branch and worktree are `wi-<number>-<slug>`; the
    model rule `shared-repository-work.md` says
    `git worktree add .claude/worktrees/<name> -b claude/<name>`. The agent
    used `claude/wi-001-greet-cli`. The toolkit still maps it to WI-001, so
    nothing broke. Fix: pick one form and say it in both (the model rule
    change needs Mike's yes).
13. **Still present from the Codex setup test:** the briefing lists "The
    Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no
    briefing, ...)" inside the briefing a hook delivered (every
    `sessions/*.hooks.txt` from s00d on).

## Files in this folder

- `final/`: `WI-001-WORK-ITEM.md`, `WI-001-DESIGN.md`, `WI-002-WORK-ITEM.md`,
  `WI-002-DESIGN.md`, `DASHBOARD.md`, `requirements-greeting-GREETING.md`,
  `memory-listing.txt` (the `.memory/` folder, index, the saved record,
  `toolkit memory find`, and the current focus), `file-tree.txt` (the whole
  project without `.git`), `git-and-app.txt`, `tracker-and-doctor.txt`.
- `sessions/`: per-session prompt, JSON events, summary, hook messages, hook
  state, and `index.txt`.
- `snapshots/`: the s00a tree, the s00c tree, the item before and after
  s04, s06, and s14, the tree before and after the hand rename, the rename
  time, and the decision queue before s10.
