# Review: the starter files that are not skills, and the hooks

Date: 2026-10-05. Work item: TKV-24. Reviewed at commit `78297f54` by a
separate agent that changed no file. `<assets>` is
`plugins/toolkit/skills/project-setup/assets/`. "root" is
`<assets>/every-project/AGENTS.md`. Line numbers are from that commit; the
root file has changed since (the owner's own review), so find each place by
its text.

Result: 0 blockers, 15 should fix, 13 notes.

## Should fix

1. **Folder guides and document templates describe a narrower use than the
   root map.** `system/AGENTS.md:14` ("its required fields" against the
   root's "important fields" and `data-model.md:3` "their fields");
   `system/AGENTS.md:15` and `security-model.md:3` (see or change only; the
   root also covers create, delete, use of functions, how access is given);
   `automation.md:3` (three examples stated as the full list);
   `delivery/AGENTS.md:11` ("moved from an old system"; the root says moves,
   loads, changes, or corrects data in bulk); `delivery/AGENTS.md:10` ("one
   folder per work item that is deployed" against "per deployment of a work
   item to an environment"); `reference/AGENTS.md:9` (a closed list);
   `sources/AGENTS.md:3` (a closed list); root:47 leaves out Retired. Fix:
   use the root's wording in each place, mark every list "such as", name all
   four marks.
2. **Descriptions too vague.** `delivery/AGENTS.md:1, 3` ("what goes out of
   the project"); `system/AGENTS.md:20` ("A picture of the system"); root:63
   "It is background."; `PROJECT.md:43-45` "Operating conventions" (does not
   say how it differs from `system/constraints.md` or
   `owner-preferences.md`). Fix: the root's wording; delete "It is
   background"; define an operating convention or remove the section.
3. **Six rows of the root "Which skill" table give only quoted phrases as
   the condition** (the rows for memory, recap, simpler, get the latest,
   wipe local, where are we). The base file said the examples only help to
   match; that sentence is gone. Fix: write each row as the situation, with
   at most one phrase marked "such as".
4. **Three lines every project gets are false in a Hindsight project.**
   root:97 and root:44 (memory is a pointer, never a fact) against
   `hindsight-memory.md:6`; root:132 ("never save project memory in ...
   another plugin's": the Hindsight add-on is another plugin; the base had
   the qualifier "the project's one memory store is the system named under
   Memory"); `memory-review-and-save.md:7, 13, 17-19` (pointers, entry
   dates, save approval, while Hindsight saves each session by itself). Fix:
   add "other than the memory system named under Toolkit settings" to
   root:132; mark root:97 "local or Notion memory"; one line in
   `hindsight-memory.md` saying which bullets of `memory-review-and-save.md`
   do not apply.
5. **`salesforce/.claude/rules/dependency-graph.md:18-19` tells the agent to
   correct `system/` documents with no decision**, against
   `system/AGENTS.md:82`. "meaningful" has no measure. Fix: say what to do
   when no Decided entry covers the change (an Open entry and a Draft rule,
   or `reference/current-system/`); replace "meaningful" with "a change that
   makes a rule in `system/` untrue".
6. **`session-handoff.md:3` (the owner's wording; needs his yes)** names
   "the memory criteria", which exists nowhere; says "Use the `handoff`
   skill" twice; "long" and "complex" have no measure; restates the skill.
   Fix: cut to the one line the root does not have, or delete the file.
7. **`PROJECT.md:53` "Memory approval" is read by no instruction.** Fix:
   remove the line (and the count "11 lines" in the repository `AGENTS.md`
   and the setup files), or put its use back in `curating-project-memory`.
8. **`keep-work-item-current.md` restates the work item template.** Lines
   7-10, 11-14, 20 repeat `WORK-ITEM.md:29, 33, 128`. Fix: keep only lines
   3, 15, 16, 25, 29.
9. **`sources/AGENTS.md:28` and `file-source.md:10` disagree on keeping an
   original out of Git** ("large" and "refuses" have no measure; the step
   says over 10 MB, ask the owner). Fix: put the measures and "ask the
   owner" in the guide; the step points to it.
10. **`salesforce/delivery/migrations/area-template/FIELD-MAPPING-TEMPLATE.md:3,
    13-15` keeps open questions** where `delivery/AGENTS.md:65` forbids
    them. Fix: the section holds Q-IDs and DEC IDs only.
11. **`delivery/AGENTS.md:67-75` names no skill for a migration area or a
    client handoff, and differs from root:58 on the commit** (root: "Save
    with `publish-docs`"; guide: the lifecycle skill writes the record,
    `publish-docs` only after the item's branch merged). Line 26 says a
    record is one file; line 33 gives a migration area three. Fix: add the
    two rows (a skill, or "No skill: follow this file"); make the root state
    the same condition.
12. **Three gaps in `system/` for a first edit.** `update-system-doc.md:47`
    says `system/AGENTS.md` gives the steps for a diagram; it has none. No
    file says when "Overview: Not written yet." and "Governs: not set" are
    filled. `glossary.md:3` points to rule forms and marks a glossary does
    not have. Fix: add "A diagram" to the guide; the first rule or term
    fills Overview and Governs; point the glossary to "A glossary term".
13. **`memory-review-and-save.md:7` "Review memory" names no skill and no
    check.** Fix: say what is checked and with which skill.
14. **Figurative words in new text.** root:70 and root:112 "owns"; root:27
    "live in"; `memory/AGENTS.md:3` "lives in"; `system/AGENTS.md:32` "lives
    in"; root:59 "going live"; `delivery/AGENTS.md:9` "ships";
    `notion-records.md:7` "at hand". Fix: "One skill does each job", "is
    kept in", "is in", "the plan for the release", "releases", "whichever
    Notion tool is used".
15. **Lines with two readings in new text.** `hindsight-memory.md:23`
    (reads as "remove a line at each handoff"); `hindsight-memory.md:6`
    ("could not easily rebuild"); `DECISIONS.md:10` (add "The first entry is
    DEC-001."); `prompt-reminder.mjs:36` ("goes to its home in the root
    AGENTS.md" reads as "file it in AGENTS.md"; the test at
    `hooks.test.mjs:259` holds the same words); root:17 ("The next line is
    for the main conversation": two lines follow); root:58 "not the plan for
    it" beside root:59; root:39 and `work-items/AGENTS.md:3` "temporary" (an
    item is never deleted); `keep-work-item-current.md:21` "or its linked
    document"; root:83 "A chore" against "project task" elsewhere; root:9
    "the user" against "the owner" elsewhere.

## Notes

16. **One home: 25 instructions stated in more than one place.** The
    reviewer's list, by subject, with the places: (1) Next action forms,
    Current state lines, bulk yes (finding 8); (2) State and Status list,
    Blocked, task ID forms, three levels: `work-items/AGENTS.md:9, 19-28,
    43-54` and the lifecycle `SKILL.md:17-28, 34, 44-52`; (3) Done or
    Cancelled only after the closing answer: `work-items/AGENTS.md:66`,
    `WORK-ITEM.md:43`, lifecycle `SKILL.md:35`, `closing.md:3`; (4) Git does
    not track `work-items/` and `memory/`: root, both guides,
    `hindsight-memory.md:16`, `using-memory-store/SKILL.md:17`; (5) name a
    work item by ID: root, `delivery/AGENTS.md:61`, `work-items/AGENTS.md:58`,
    `WORK-ITEM.md:41`, `DEPLOYMENT-RECORD.md:5`; (6) memory holds pointers:
    root twice, `memory/AGENTS.md:3`, `MEMORY.md:3`,
    `curating-project-memory/SKILL.md:8`, `prompt-reminder.mjs:38`; (7)
    entry dates: `memory-review-and-save.md:13`, `memory/AGENTS.md:34-35,
    45`, root; (8) form and limits of Current State: `memory/AGENTS.md:14-23`
    and `hindsight-memory.md:17-23` (by design: a project gets one); (9) who
    may decide, never change a Decided entry: `DECISIONS.md:16-19` and
    `record-decision.md`; (10) a rule changes only with a decision:
    `system/AGENTS.md:82-84` and `update-system-doc.md:5, 19-20`; (11) never
    infer a glossary meaning: root, `system/AGENTS.md:71`,
    `update-system-doc.md:40`; (12) integration document steps:
    `system/AGENTS.md:77-78`, the template, the README; (13) source row in
    the same edit, never edit a filed original: `sources/AGENTS.md:36-38`,
    `sources/README.md:3`, root, `work-items/AGENTS.md:64`, `WORK-ITEM.md:145`,
    `file-source.md:3, 16`; (14) next number and collisions:
    `shared-repository-work.md:29`, `DECISIONS.md:10`, `sources/AGENTS.md:17`,
    `system/AGENTS.md:56-57`, `work-items/AGENTS.md:21, 62`, filing
    `SKILL.md:25`; (15) never commit load or backup files; (16) never edit a
    captured page; (17) handoff: the rule, the root, the skill; (18) owner
    instruction goes to `owner-preferences.md`: root, `hindsight-memory.md:9`,
    `prompt-reminder.mjs:44-45`, `curating-project-memory/SKILL.md:37-43`;
    (19) decision routing: root, `DECISIONS.md:5`, `WORK-ITEM.md:128`,
    `prompt-reminder.mjs:41-43`; (20) Sources list at the end of a reply:
    `cite-recalled-knowledge.md:8` and the output style; (21) reply rules:
    root and the output style (by design for Codex); (22) re-read after
    compaction: `session-start.mjs:10-13` and the root; (23) project check
    commands as a fill-in: root, `PROJECT.md:41`, `README.md:34`; (24)
    `publish-project-documents.md:18-21` restates `publish-docs`; (25)
    Salesforce: official skills, impact command, validate command,
    production data writes, preflight, tracker and manual steps, each in two
    Salesforce files. Fix: keep the place the design names (the folder guide
    or the template) and make the other a pointer.
17. **Wording problems in the owner's own unchanged text (a question for
    him).** `plain-english-artifacts.md:13, 17, 19, 45`;
    `publish-project-documents.md:18, 20`; `shared-repository-work.md:18,
    30`; `check-deployment-contents.md:3, 7`; `DEPLOYMENT-RECORD.md:23, 31`;
    `CUTOVER-PLAN.md:39`; `protected-orgs.json:15`; the `package.xml`
    templates and `SOUL.md:3` "seed"; `DESIGN.md:59`; `WORK-ITEM.md:111,
    118`; `README.md:3`; "he", "his", "him" for the owner in several files.
18. **Sentences that say how to regard something.** root:63 "It is
    background."; root:112 "This list stays in your context after
    compaction."; `sources/AGENTS.md:39`; `reference/AGENTS.md:3`;
    `plain-english-artifacts.md:48`; `SOUL.md:13-15`.
19. **Content for one choice in files every project gets.**
    `delivery/AGENTS.md:16-22, 72-74` (Salesforce); `README.md:28-30`
    (local work items); `publish-project-documents.md:4, 8`;
    `tests/TEST-PLAN-TEMPLATE.md:11` "org"; `.gitignore:4-6, 10-14`.
20. **`salesforce/.claude/rules/project-file-locations.md`** is for older
    projects but loads in every new Salesforce project; names a folder no
    other file mentions; its file name does not match its heading; no
    `engagement/` mapping for `client-handoffs/`.
21. **root:35 asks for a branch and pull request for every folder guide**,
    but `work-items/` and `memory/` are not in Git. Fix: say those two
    guides come from the toolkit and are restored by "check the setup".
22. **In a Claude Code session that runs in a worktree, the guides of
    `work-items/` and `memory/` probably do not load by themselves**
    (inferred from `claude-code/memory.md:152`; not tested).
23. **Hooks.** `session-start.mjs:54`: with stdout closed by the reader it
    exits 1 with a stack trace (fix: `process.stdout.on('error', () => {})`
    before the write). Line 34 comment says "or 7 days old"; line 41 tests
    `days > 7`. `prompt-reminder.mjs:16-34`: plain questions trigger the
    keep hint ("what is the root cause of the failure?", "Do you remember
    the name of the flow?", "I never use tabs", and others); line 32 says
    "epic", a word no other file uses. It does two jobs (the skills line and
    the keep hint), as on `main`. In a folder that is not a Git repository
    the start hook never prints Current State. The Claude Code snippets run
    `"command": "echo"` with `args`; the official page says exec form on
    Windows needs a real executable. `codex-after-commit.mjs` runs in both
    products; its name says Codex. `session-start.mjs:12` tells Claude Code
    to re-read `owner-preferences.md` after compaction; Claude Code
    re-injects always-on rules itself.
24. **Hook tests.** `hooks.test.mjs:95-102` tests a write the hook no
    longer makes; line 134 says "refine". No test for closed stdout, the 7
    or 8 day edge, a start with no `--memory`, a subfolder as `cwd`. No test
    reads `every-project/.claude/settings.json` or the Salesforce
    `.codex/hooks.json`, and none tests `guard-permission-set-deploy.cjs`.
25. **Salesforce items left open.** `salesforce-org-safety.md` is 4,200
    bytes (over the proposed 4,096); `production-data-changes.md:8` uses
    `MMDDYYYY`; `DATA-AREA-TEMPLATE.md:6` asks for links;
    `manual-steps.md` Status values are not in the table at
    `delivery/AGENTS.md:38-55`.
26. **A glossary can show Status Approved when its only source is
    somebody's words.** `system/AGENTS.md:41, 71`; `sources/AGENTS.md:39`.
27. **"Used by" in the sources list has no step for a decision or a rule.**
    `sources/AGENTS.md:40`; `file-source.md`; `record-decision.md`.
28. **A Hindsight project has no instruction for "clean up memory".**

## Found clean

Design decisions 1 and 5 to 17 are carried out in these files. No setup
marker, removed folder name, old skill name, old delivery path, or person's
name outside the skills. Every pointer followed from these files to a skill,
a step name, or a heading exists. The record forms match the design. Hook
input, output, matchers, and limits match the official pages; the snippets
match the commands. No input tried made a hook exit non-zero, hang, or
write a file, except the closed-stdout case.

## Not checked

Whether Codex applies its context limit to plain start-hook output; any
live session; Windows; the two guards line by line; the Python tools.

## Status of the fixes

Set on 2026-10-05, after the second fix pass
(`dev/test-runs/fix-pass-2.md`). The first fix pass is recorded in
`dev/test-runs/fix-pass-project-files.md`; the second review
(`2026-10-05-fixes-reread-review.md`) read those fixes again.

- Closed: 1 to 5, 8 to 15, 19, 21, 24, and 26 to 28.
- Closed, with a part that stays or waits:
  - 16: each of the 25 instructions has one home. Items 8 and 21 stay by
    design. Item 14 stays: they are the forms of five different records.
    Item 20 stays: the output style is the owner's own text. Item 17 waits
    for the owner.
  - 18: closed in the root, `sources/AGENTS.md`, and
    `reference/AGENTS.md`. `plain-english-artifacts.md` and `SOUL.md` are
    the owner's own text and wait for him.
  - 22: closed in the text of both storage skills. Not tested in a live
    session.
  - 23: closed. A request phrased as a question gets the keep hint again
    (second review, note 17). Three points stay by design: the hook's two
    jobs, `"command": "echo"` on Windows, and the name
    `codex-after-commit.mjs`.
  - 25: closed, except the date form and the rule size, which wait for the
    owner.
- Closed in the third fix pass (`dev/test-runs/fix-pass-3.md`), after the
  owner approved both on 2026-10-05: 6 (`session-handoff.md` holds three
  lines he approved) and 7 (the "Memory approval" line is removed, and
  "Toolkit settings" has 10 lines).
- Waits for the owner: 17 and 20.
