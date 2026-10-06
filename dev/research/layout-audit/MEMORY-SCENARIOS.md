# Memory design test: does a new session know what the owner means?

Date: 2026-10-05. Work item: TKV-24. Tested at commit `7e3e1817` by a
separate agent that changed no file in the repository. The owner asked for
it: many scenarios, from his side, talking to a new session that remembers
nothing ("the client said this", "another developer said that", "we need to
change a few things around"), to find gaps in memory that holds only where
work stopped plus links.

## Result

- 81 scenarios traced on paper against the real files: 50 work, 11 work
  after a fair question to the owner, 20 have a gap.
- 24 live sessions (Claude Code, Sonnet, one message each, a fresh scratch
  project each time, with a short made-up history). Cost about 5 US dollars.
- The new design handles decisions, work in progress, originals, and
  deployments well, and in several cases better than the old one.
- It has eight causes of gaps. Only one is a memory problem: a fact or a
  statement that fits no file has nowhere to go. The others are missing
  instructions or missing form fields; memory would not fix them.
- Recommended: memory holds links plus a short list of dated notes, only for
  facts that fit no other file (option B below, kept narrow).

Marks: LIVE = seen in a live run; READ = verified in a file; INF = inferred.

## What a new session has at the start (LIVE)

- The root guide, the always-on rules, and the list of skills.
- The start hook's output: Current State and the pointer table.
- On each message: one line to check the project's skills, plus a hint when
  the message has a keep or decision phrase.
- Not in context: `PROJECT.md` (a session answered "not in my context"),
  `DECISIONS.md`, `system/`, the sources list, the work items, the project
  tasks, `delivery/`.

## The scenarios

| # | The owner's words | Verdict | What is missing |
| --- | --- | --- | --- |
| 1 | "hey, where did we leave off?" | Works (LIVE) | Did not mention an unsaved file or a project task due in 2 days |
| 2 | "what's next?" | Works | |
| 3 | "what were we doing yesterday?" | Works | Only for work on an item or a commit |
| 4 | "what did we get done last week?" | Works (LIVE) | No instruction told it where to look; it chose `git log` itself |
| 5 | "what changed since Friday?" | Works, partly | An edit the owner made by hand leaves no trace; only the GitHub tracker has a "changes since" search |
| 6 | "I'm back after two weeks" | Works | |
| 7 | An answer taken from Current State after a session with no handoff | Gap (LIVE) | "Next session starts with" repeats the item's next action and goes stale; a session repeated a stale line as fact |
| 8 | After a crash mid-task | Gap, small (LIVE) | "Where did we leave off" does not report unsaved work |
| 9 | "continue", "keep going" | Works | |
| 10 | "what did we finish this week?" | Works (LIVE) | |
| 11 | "recap the last chat" | Works | The chat itself is not kept |
| 12 | Context compacted mid-session | Works | |
| 13 | "what did we conclude yesterday about pricing?" (talk only) | Gap | Talk that ended in no record is gone |
| 14 | "that thing we discussed" | Question | Unavoidable |
| 15 | "the issue from last week" | Question | Fair |
| 16 | "we need to change a few things around" | Question | Fair |
| 17 | "go back to how it was" | Question | Only when more than one recent change |
| 18 | "do the same as last time" (a deploy) | Works | Other repeated jobs: row 40 |
| 19 | "remember the problem with the login?" | Works (LIVE) | |
| 20 | "that workaround when the export failed in staging" | Works (LIVE) | Found only with a shell search |
| 21 | "why clinic time and not UTC?" | Works | |
| 22 | "what did Tom say at kickoff?" | Works | |
| 23 | "what do you know about the SFTP server?" | Works, partly | Facts sit in 5 places; the search tool skips work items |
| 24 | "the client said they want it weekly not daily" | Question (LIVE) | Asked which report |
| 25 | "the client said the fiscal year starts in February" | Question (LIVE) | Found the open decision; asked whether he decides it. Nothing saved until he answers |
| 26 | "client is unhappy with the export ... a must have" | Works (LIVE) | |
| 27 | "another developer said the API is rate limited" | Question and gap (LIVE) | An unchecked claim has no light home; it saved nothing |
| 28 | "another developer already changed the trigger" | Gap, partly | Recorded only when an open item concerns it |
| 29 | "Sarah is the approver now, not Tom" | Question (LIVE) | |
| 30 | "the client's IT person said no new permission sets" | Question | Right |
| 31 | A statement that affects one item | Works | |
| 32 | A statement that affects several | Works | |
| 33 | Affects none yet: "they will open two more clinics next year" | Gap | No home |
| 34 | Contradicts a decision | Question | Better than the old design |
| 35 | Opinion only: "Tom thinks the email is too long, change nothing yet" | Gap, partly | Nowhere when no item is open |
| 36 | Arrives with a document | Works | |
| 37 | Arrives with nothing | Gap when it lands nowhere | |
| 38 | "Tom's on holiday till the 20th, Sarah covers" | Gap | A temporary fact has no home |
| 39 | "what did we deploy last Tuesday? who ran it, manual steps?" | Works (LIVE) | The deployment form has no field for the date or the manual steps |
| 40 | "run the same load as last month" | Gap | A recurring job has no record of each run |
| 41 | "the nightly job broke again" | Gap (LIVE) | The search skipped `work-items/`; it missed an earlier failure and said "the only failure on file" |
| 42 | "the weekly load ran fine, note it" | Gap | No home |
| 43 | "the monthly release is tomorrow, what's in it?" | Works | |
| 44 | "a scheduled job failed last night" | Works | |
| 45 | "who ran the last deployment?" | Works | |
| 46 | "what did we promise in the last call?" | Works (LIVE) | Needs the notes handed over |
| 47 | "what's open for Thursday's call?" | Works, partly | Project tasks not listed |
| 48 | "when did the SFTP key last change?" | Works with a shell search | Missed with the search tool |
| 49 | "last time the deploy failed because of the permission thing, don't let that happen again" | Question and gap (LIVE) | Found the decision; nothing makes a later session read it before a deploy |
| 50 | "why did we decide not to use X for this?" | Works with a shell search | |
| 51 | The same lesson seen a second time in another item | Gap | No count across items |
| 52 | A lesson learned with no work item open | Gap | No home |
| 53 | "the staging deploy needs the VPN on" | Works | |
| 54 | "who decides the layout?" | Works when `PROJECT.md` is opened | Opened in 4 of 20 sessions |
| 55 | "which environment is which?" | Works | |
| 56 | "where do we keep the API token?" | Works (LIVE) | |
| 57 | "what are the client's hours?" | Question | |
| 58 | "remember that the client's accountant is ..." | Works (LIVE) | A commit to main for one line (19 turns) |
| 59 | An agent acts without looking up a people fact | Gap risk | `PROJECT.md` is not in front of the session |
| 60 | A quick question | Works | |
| 61 | A one-line fix | Works | |
| 62 | "remind me to ask the client about the holiday schedule" | Gap (LIVE) | Saved as a project task; the next session, asked "what do you need from me?", did not name it |
| 63 | "note that I'm away next week" | Question and gap (LIVE) | The agent said it "has no home in this project's records" |
| 64 | "remind me tomorrow at 9" | Gap, small | |
| 65 | Two sessions, two items, same day | Works | One handoff may replace the other's "Next session" line |
| 66 | Claude Code after Codex | Works | Codex cuts hook output at 4,000 characters |
| 67 | A helper agent | Works, small risk | Rule IDs arrive without their text |
| 68 | A handoff prompt pasted | Works | |
| 69 | A session in a worktree | Works | |
| 70 | Two sessions take the same decision number | Works | |
| 71 | "actually scrap the fiscal year total" | Works (LIVE) | |
| 72 | "we're going back to option A" | Works | |
| 73 | "that decision is off" | Question | Right |
| 74 | "forget the holiday reminder" | Works | |
| 75 | Local work items, local memory | As tested | |
| 76 | Notion memory | Gap | Pointers are printed for local memory only; nothing says when to look them up |
| 77 | Notion work items | Works (not run) | No "changes since" search |
| 78 | GitHub work items, Hindsight memory | Works, by a different design | A decision then has two homes |
| 79 | The owner edits an item by hand | Works | No history of the edit |
| 80 | A new computer or a fresh clone | Works | Better than the old design |
| 81 | "what does 'clinic time' mean?" | Works | |

## The gaps, by cause

1. **A fact or statement that fits no file** (rows 13, 27, 28, 33, 35, 37,
   38, 52, 63): the owner is away, a person is on holiday, a claim nobody
   checked, an opinion, a future plan, a lesson with no item open. The owner
   repeats himself, or it is lost. The old design had a home (memory notes).
   Smallest change: a new kind of memory note. A note in memory is the right
   home here: these facts are short, true for a while, belong to no record,
   and every session should see them. It is not the right home for a
   decision, a rule, a term, a requirement, or a lesson that passed closing.
2. **Saved, but never shown again** (rows 1, 47, 62, 64): a project task due
   in 2 days was not named. Smallest change: add "the open project tasks" to
   the root row for "where are we"; one sentence for a reminder with a time.
3. **A whole-project search does not look inside `work-items/` or
   `memory/`** (rows 23, 41, 48, 50; LIVE in six runs). The agent says
   "nothing on file" when there is something. Smallest change: one line in
   the root guide: a whole-project search skips these two folders; search
   work items with `using-work-tracker`.
4. **A recurring job, a run, or a failure has no record** (rows 40, 41, 42,
   and the form in 39). Smallest change, in `delivery/AGENTS.md`: add "Date
   and time" and "Manual steps" to the deployment record, and one new
   record, a run log (one row per run: date, who ran it, what ran, result,
   problems and fix).
5. **Current State repeats the item and goes stale** (rows 7, 8). Smallest
   change: "Next session starts with" holds the item's ID and "read its
   Current state", never the action; "where are we" also checks for unsaved
   work in the worktree of each item in progress.
6. **A lesson is not read when it matters, or not counted** (rows 49, 51,
   52). Smallest change: at closing, a lesson about how to do a step (deploy,
   load, test) moves up as a rule line, not a decision; the deploying step
   reads the decisions about deploying first; a lesson with no item becomes
   a note.
7. **Project facts are not in front of the session** (rows 54, 59).
   Smallest change: one line `@PROJECT.md` in the root guide. LIVE: with it,
   Claude Code answered from context with no file read. Not tested in Codex.
8. **Storage choices differ** (rows 76, 78): Notion memory never shows its
   pointers; Hindsight keeps the old scope. Needs the owner's decision.

## The three options

- **A. Links only; plain facts in a "Project facts" section of
  `PROJECT.md`.** Works for stable facts (LIVE: saved in one session, found
  in the next). Does not fit short-lived or unchecked facts. Every fact is a
  commit to main. The file is not in context unless the import line is
  added.
- **B. Links plus short notes for facts that fit no other file.
  Recommended.** LIVE: with two notes in `memory/MEMORY.md`, a session
  refused a deploy date because "you are away", with no file read. The start
  hook already prints the whole file, so no hook code changes.
- **C. Memory as before.** Not needed: the live runs show decisions,
  lessons, and originals are found in their own files. It would bring back
  two homes for one fact.

What B needs: a "Notes" table in `MEMORY.md` (the note in one sentence, who
it came from, created, last changed, "check or remove by"); a limit of about
15, pruned with Current State; a rule that a note is used only when "Where
information goes" gives no home, and never for a decision, rule, term,
requirement, status, instruction, or secret; one new row in "Where
information goes"; changes to `curating-project-memory` and
`memory/AGENTS.md`; the same note in Notion as a page with no Record Key.
The fixes for causes 2 to 7 are needed under any option.

## Better and worse than the old design

Better: a decision has one home, a status, and a replaced-by line; a
client's word could not close a decision by itself; decisions, rules,
sources, and delivery records are in Git and survive a clone; originals are
kept unchanged; a lesson cannot stay unreviewed, because closing asks;
memory cannot disagree with the record.

Worse: facts with no home; no count of a lesson seen twice; one subject is
spread over several files; these lines were dropped: "search before asking
the owner to repeat", the "remind me" line, the timed reminder, the check of
old facts; a small fact costs a commit or two questions.

## Not tested

Codex, Notion, GitHub Issues, and Hindsight (read only); more than one
message per session; two sessions at once; the `handoff` skill live;
compaction; a long history (50 items, not 3); other models than Sonnet.

## Status

The owner has not decided between the options. The fixes for causes 2 to 7
are not built.
