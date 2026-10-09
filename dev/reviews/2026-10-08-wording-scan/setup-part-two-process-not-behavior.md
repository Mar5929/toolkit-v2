# Instructions that script the agent: setup-part-two

All paths below start at `plugins/toolkit/skills/project-setup/references/`. I read the section "Three instructions for text that tells an agent what to do" in the root `AGENTS.md` first. I opened the six files again to check each quotation and line number.

## Summary

These six files are mostly the owner's process for moving a project to the current toolkit. Almost every instruction passes the test: it states a step, an order, where information is kept, when the owner decides, or a protection. I found 11 places that may script the agent, and I am sure of none of them. All 11 are borderline, so the owner decides.

| Kind | Count | Borderline |
| --- | --- | --- |
| 1. Tells the agent how to think or interpret | 4 | 4 |
| 2. A sentence or list for one small situation | 3 | 3 |
| 3. A count or limit where the agent could judge | 3 | 3 |
| 4. A phrase list that reads as the only start | 0 | 0 |
| 5. Tells the agent what a capable agent does anyway | 1 | 1 |
| Total | 11 | 11 |

The three files with the most findings:

1. `hindsight-on-vps.md`: 4 findings (H-1 to H-4).
2. `one-home-layout.md`, `update.md`, and `move-over.md`: 2 findings each, tied. The next file, `old-toolkit-pieces.md`, has 1. `earlier-versions.md` has none.

I did not find a table of situations or a hard-coded judgment in the way the owner objected to for "small work item". The numbers that stand in for a judgment are few, and they are listed in H-2, O-2, and P-1.

## Findings

### `hindsight-on-vps.md`

**H-1. Check the memories of a non-English save.** `hindsight-on-vps.md:49`.

- Text: "The setting is an instruction to the model, not a check. So when a save held text in another language, read the memories it made before you rely on them."
- Kind: 1, borderline.
- Why it scripts the agent: it tells the agent to be careful (read before relying) instead of stating a step of the process.
- What it seems to protect: wrong memories when the model does not translate faithfully.
- Proposal: keep the fact and drop the instruction to be careful. Replace with: "The setting is an instruction to the model, not a check, so the memories of a save that held another language may not be a faithful English version." If the owner wants a step, state it as a step: "For a save in another language, the agent reads the memories it made, and the owner is told if they differ."

**H-2. Polling interval.** `hindsight-on-vps.md:247`.

- Text: "Check with the command below about every 20 seconds, until it prints `completed`."
- Kind: 3, borderline.
- Why it scripts the agent: the number stands in for the agent's judgment of how often to poll.
- What it seems to protect: cannot tell. It may protect the server from rapid calls, or the session from a long wait.
- Proposal: replace with "Check with the command below until it prints `completed` or `failed`." Keep the 20 seconds only if a test showed that a faster poll causes a problem.

**H-3. Three failure cases that one rule covers.** `hindsight-on-vps.md:79`, `:80`, `:82`.

- Text: "When the server needs work (it is down, slow, out of space, or needs a newer Hindsight), stop and tell the owner what you saw." and "When a save or a reflect fails because the ChatGPT allowance is used up, stop and tell the owner."
- Kind: 2, borderline.
- Why it scripts the agent: three bullets each give one situation, and the same rule (stop and tell the owner) applies to all three.
- What it seems to protect: the agent trying to repair the server or the sign-in itself, which is the owner's work. The `refresh_token_reused` bullet (line 80) also holds facts the agent needs: the error text, the folder `/opt/hindsight/codex-auth`, and the owner's two steps.
- Proposal: keep line 80, because it is facts. State the rule once in line 79: "When a save, a reflect, or a check fails for a reason that only the owner can fix on the server (the server is down, slow, out of space, or needs a newer Hindsight; the Codex sign-in stopped working; or the ChatGPT allowance is used up), stop and tell the owner what you saw." Then remove line 82.

**H-4. "Run each command alone."** `hindsight-on-vps.md:119` (also `one-home-layout.md:33` and `move-over.md:86`).

- Text: "Run each command alone."
- Kind: 5, borderline.
- Why it scripts the agent: it tells the agent how to run commands and gives no fact about the process.
- What it seems to protect: cannot tell. It may protect against a chained command whose failure is hidden, or against a host that approves commands one by one.
- Proposal: keep it if a test showed a problem, and add the reason in one clause. Otherwise remove it. The same decision applies to all three files.

### `one-home-layout.md`

**O-1. "Two findings are usual."** `one-home-layout.md:338-340`.

- Text: "Two findings are usual in a project on the old layout: A closed work item has no filled Moved up line. ... A `memory/` folder has an `AGENTS.md` and no `CLAUDE.md`."
- Kind: 2, borderline.
- Why it scripts the agent: it lists two expected situations, where the general rule ("fix what the command prints, as `update.md` says") already covers them.
- What it seems to protect: the exact text of the Moved up line for a closed work item, and the copy of `CLAUDE.md`. Both are facts the agent needs, and the Moved up text is also in the row for a closed work item (line 279).
- Proposal: keep the two facts where they already live (line 279 and `update.md:215`), and replace the list with: "Fix each finding as `update.md`, "Turning on validate-records.mjs and the pre-commit file", says."

**O-2. A size threshold for asking.** `one-home-layout.md:220`.

- Text: "Ask the owner before the source is committed when it is a file over 10 MB, a file with personal data beyond names and work roles, or a file type that is not text."
- Kind: 3, borderline.
- Why it scripts the agent: 10 MB is a number for the agent to apply, and "personal data beyond names and work roles" is a fixed test for a judgment.
- What it seems to protect: large files and personal data entering Git, which the owner cannot easily undo. This is a protection, so I expect the owner to keep it.
- Proposal: keep, if `sources/AGENTS.md` gives the same 10 MB (I could not check that file). If the number is not there, name the goal instead: "Ask the owner before the source is committed when committing it would put a large file, personal data, or a file that is not text into Git."

### `update.md`

**U-1. A fixed test for who made a commit.** `update.md:169`.

- Text: "A commit is the toolkit's when both of these are true: the second command also lists a file under `.claude/skills/` for that commit, and the commit's message names the setup, a move-over, or a toolkit update."
- Kind: 1, borderline.
- Why it scripts the agent: it fixes how the agent must interpret Git history, where the goal is "tell an edit of the owner's from a change by the toolkit".
- What it seems to protect: the owner's own edits to rules and files, which the update must never overwrite.
- Proposal: keep, and state the goal first: "To tell the owner's edits from the toolkit's changes, use the file's Git history. A commit is the toolkit's when ... (as now). When the history does not settle it, ask the owner." Line 170 already asks the owner in the unclear case, so the test is a default and not the only way.

**U-2. The same rule is repeated in every part of section 4.** `update.md:232`, `:277`, `:301`, `:346`, `:355`.

- Text: "List it, and remove it only after the owner's yes." and "List them, and delete them only after the owner's yes."
- Kind: 2, borderline.
- Why it scripts the agent: five parts each restate one general rule for one kind of old thing.
- What it seems to protect: removing a file the owner edited or still uses.
- Proposal: state the rule once in the intro of section 4 (line 228): "For each old thing below, list it for the owner, and remove it only after the owner's yes." Keep the parts that add a different rule, such as "check whether the owner edited it" (line 232) and "Never delete them" (line 349).

### `move-over.md`

**M-1. A list of signs for "the owner's line".** `move-over.md:122`.

- Text: "a differing line is the owner's when it names this project's own things (its orgs, people, folders, dates, a section about this project), or when the owner signed it."
- Kind: 1, borderline.
- Why it scripts the agent: it fixes how the agent must interpret a line, in place of stating the goal.
- What it seems to protect: the owner's words in an old toolkit file, which the move-over must not delete.
- Proposal: keep as a default and say that the list gives examples: "A differing line is the owner's when it is specific to this project, for example when it names the project's orgs, people, folders, or dates, or when the owner signed it." Lines 125-126 already put an unclear file under "Your call".

**M-2. What a "yes" covers.** `move-over.md:147-151`.

- Text: "A plain yes covers every Delete, Add, and Update line as shown. It covers a "Your call" line only when your recommendation leaves the thing as it is."
- Kind: 1, borderline. It is close to the owner's example of a sentence that maps the owner's phrase to a meaning.
- Why it scripts the agent: it maps the owner's reply to a scope.
- What it seems to protect: the agent treating a general "yes" as the owner's answer to a question that was not put clearly.
- Proposal: keep. This is "when the owner decides and what the owner is asked". The same rule is in `one-home-layout.md:96-98`. If the owner prefers the goal, it reads: "The owner's yes covers what the list showed. A "Your call" line is covered only when it left the thing as it is."

### `old-toolkit-pieces.md`

**P-1. "The ten newest entries."** `old-toolkit-pieces.md:196`.

- Text: "The ten newest entries become Recent History rows. The rest stay in the old work item."
- Kind: 3, borderline.
- Why it scripts the agent: the number may stand in for "enough history to show where the work stands".
- What it seems to protect: the size of the Recent History table in a Toolkit V2 work item, if the template limits it. I could not check the template.
- Proposal: keep if the work item template limits Recent History to ten rows. If it does not, replace with "The newest entries become Recent History rows, enough to show how the work got to its current state. The rest stay in the old work item."

## Phrase lists and trigger words

I found no list of words or phrases that starts a process and reads as the only trigger. These are the places where a phrase names a job. Each states its general condition as well.

| Where | Phrase | General condition stated? |
| --- | --- | --- |
| `update.md:3` | "update the toolkit", and "change a setup choice" | Yes: "in a project that is already set up with Toolkit V2", and "when the owner asks to change a setup choice, such as where memory is kept." The phrase is the name of the job. I could not check how `SKILL.md`, "Which setup job to do", chooses this file. |
| `update.md:400` | "move memory to Notion" | Yes: it is marked "for example", and the general condition is "only when the owner asks". |
| `hindsight-on-vps.md:351` | "check the setup", "update the toolkit" | Partly. The two phrases name the jobs that use this section. The section says what each job does, but gives no condition of its own. This is borderline and may be a gap in the routing text of `SKILL.md`. |
| `one-home-layout.md:158` | "clean up memory" | Yes: the text says the skill "finds such a record later and asks the owner." The phrase is the name of a job. |
| `move-over.md:24-32` | A list of old files and names | Yes: the third row, "None of the above", sends a folder with none of the signs to the same job. |
| `move-over.md:149` | "yes, but not D3", "Q2: keep mine" | Yes: they are examples of how the owner may answer, and the rule is stated in general words. |
| `hindsight-on-vps.md:296` | "Say 'defaults', or name what to change." | These are exact words that the owner sees, so they pass. |

## Numbers

Each count or limit below passes as a fact, a form, an order, or a protection.

- Fact about a tool or the server: ports 22, 80, and 443 (`hindsight-on-vps.md:43`); weekly backups (53); three hooks per file, two MCP servers, eight tools, five knowledge pages (57-68); a code survey every 20 commits at no more than US$2 (69, 282); six bank settings (70, 271); the add-on updates itself once a day (61); curl time limits `-m 10`, `-m 20`, `-m 30`, `-m 60` in the commands; `limit=100` in the bank list; file permissions 600 (88); seven `permissions.ask` entries (`update.md:307`); the Codex status values and error text.
- Form of a record or an ID: a bank ID of at most 63 characters (`hindsight-on-vps.md:157`); the 10 lines of "Toolkit settings" (`update.md:120`, `one-home-layout.md:54`); five parts of the project's Current State (`one-home-layout.md:291`); the three levels of a work item (`old-toolkit-pieces.md:187`, "more than three levels"); four file names of the writing rule (`update.md:286`); `AGENTS.md` at most 200 lines and 22,528 bytes (`update.md:194`), a protection on the size of the file.
- Order of steps: the nine steps (`one-home-layout.md:326`); the seven points (`move-over.md:198`) and steps 1 to 7 (46); the five steps (`update.md:199`); seven steps of "Changing a setup choice" (`update.md:402-419`); "first row of this table that fits" (`update.md:112`, `move-over.md:26`, `:105`).
- Protection: never edit the old toolkit's copy (`old-toolkit-pieces.md:52`); never print the key (`hindsight-on-vps.md:390-393`); the four named projects with their own review (125).
- Borderline (listed above): 20 seconds (H-2), 10 MB (O-2), the ten newest entries (P-1).

## What I passed and why

- The long tables of old files, old rules, old hooks, and old records (`old-toolkit-pieces.md`) and the table of where each old file goes (`one-home-layout.md:110-133`). They are facts about where information is kept, so they pass. They are not a table of situations in the owner's sense.
- The per-row rules in `one-home-layout.md:135-287`. They are the process for where each old record is written, so they pass.
- The long list "Mistakes to avoid" in `hindsight-on-vps.md:388-404`. Each item is a protection with a reason, such as keeping the API key out of output, so it passes.
- The migration of a retired feature in `update.md:324-338` and `:316-322`. These steps recognise one old line and move it, so they are exact process.
- The messages the agent gives the owner (`move-over.md:69-74`, `update.md:318`). They state what the owner is told when the owner decides, so they pass.
