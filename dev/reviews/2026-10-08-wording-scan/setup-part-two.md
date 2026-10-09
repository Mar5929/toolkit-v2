# Wording scan: setup-part-two

All paths below start at `plugins/toolkit/skills/project-setup/references/`. Line numbers are lines of the file as it is in this worktree. "The standard" is `document-clarity-standard.md`.

## Files read

All six files were read in full.

| File | Verdict | High | Medium | Low | Biggest problem |
| --- | --- | --- | --- | --- | --- |
| `update.md` | small fixes (one section needs a rewrite) | 1 | 14 | 8 | The two tables under "Retired skills" and "Renamed skills" send the reader around a circle of skill names |
| `one-home-layout.md` | small fixes | 0 | 5 | 5 | Twenty bold labels do the work of headings, and two lines say opposite things about toolkit files |
| `earlier-versions.md` | small fixes | 0 | 5 | 2 | Steps that make the reader open other files to learn when and where to act |
| `move-over.md` | small fixes | 0 | 3 | 5 | A term is used before it is explained, and two phrases cannot be followed |
| `old-toolkit-pieces.md` | small fixes | 0 | 3 | 5 | Vague headings, and one row that gives three different parts |
| `hindsight-on-vps.md` | small fixes | 0 | 7 | 5 | Dense fact lists that define a word after using it, and bullets that come before the commands they describe |

All six files open with what they are for and what must be true when the job is done. The history in these files is mostly needed, because the reader must recognise an old file and act on it. The findings below are the places where the history is not needed for the step, or where the wording hides what to do.

## Findings

### `update.md`

**U-1. Retired and renamed skills: the names form a circle.** `update.md:230-264`. High.

- Text: "Five skills were renamed in an earlier version. This table records that history; the current merged names are described below." The first table maps `managing-work-items` to `running-work-item-lifecycle`, and the second table maps `running-work-item-lifecycle` back to `managing-work-items`.
- Standard: "Words and names", "Use the exact name the system uses for a thing"; "Extra rules for documents", "Organize the document so that a reader can find a thing from the headings alone."
- Why the reader has trouble: the first table says `managing-work-items` is an old name, but it is the current name, so the reader may rename in the wrong direction. A retired skill such as `work-refine` also takes three hops (`work-refine`, then `running-work-item-lifecycle`, then `managing-work-items`) across two sections. Line 232 also says "The current merge retires ...", and the reader was not told of any merge.
- Rewrite: join "Retired skills" and "Renamed skills" into one section, "Old skill folders and what replaces them". Keep every name and every rule in the old text. Start with one sentence: "A project may hold a folder in `.claude/skills/` under an old name. Find the folder in the left column; the right column names the skill that replaces it." Then one table:

  | Folder you may find | What replaces it now |
  | --- | --- |
  | `work-refine`, `solution-design`, `work-delegate`, `work-check`, `work-finish`, `local-work-track`, `notion-work-track`, `github-work-track` (retired in toolkit 0.6.0); `running-work-item-lifecycle`; `tracking-work-items`; `using-work-tracker` | `managing-work-items`. Its selected `references/work-tracker.md` holds what `using-work-tracker` held. |
  | `local-memory-save`, `local-memory-find`, `local-memory-refine`, `notion-memory-save`, `notion-memory-find`, `notion-memory-refine` (retired in toolkit 0.7.0); `curating-project-memory`; `storing-project-memory`; `using-memory-store` | `managing-project-memory`. Its selected `references/memory-store.md` holds what `using-memory-store` held. A project with work items or memory in Notion also gets `using-notion-cli`. A project with Hindsight memory has no toolkit memory skill. |
  | `managing-project-wide-records` | `filing-project-records` |
  | `explain-simply` (retired in toolkit 0.9.3) | Nothing |

  Then keep the rules of lines 251 and 260-264 in this order: a project may also hold an earlier, unmerged version of `managing-work-items` or `managing-project-memory`, so compare its files and replace the toolkit files after the owner's yes, and keep the folder; for any other old folder, check for the owner's edits before removal; a project must not keep the old process skill or the old storage skill beside its merged replacement.

**U-2. "Four rows ... the last paragraph of that section says which four."** `update.md:100`. Medium.

- Text: "Four rows of the table in "Find the old layout" are the exception, and the last paragraph of that section says which four."
- Standard: "Words and names", "Be specific. Name the thing."
- Why: the reader must open a second file and find "the last paragraph" before knowing which rows are meant.
- Rewrite: "Only `one-home-layout.md` handles what "Find the old layout" finds, with four exceptions. Sections 3 and 4 of this file handle the rows "Toolkit settings" in the earlier form, a rules list in `AGENTS.md`, the two removed rules, and skills under a retired name. Leave every other hit for `one-home-layout.md`."

**U-3. "In place of `./`".** `update.md:65`. Medium.

- Text: "Run sections 2 to 4 in your worktree, with `rsync` and `diff` pointed at the worktree in place of `./`."
- Standard: "Words and names", "Be specific."
- Why: no command in this file uses `./`. Section 2 already writes `<worktree>/`. The reader looks for a `./` that is not there.
- Rewrite: "Run sections 2 to 4 in your worktree."

**U-4. "Name only the toolkit's changes".** `update.md:121`. Medium.

- Text: "Never overwrite one of these files. Name only the toolkit's changes (a new section, a changed heading, a changed guide comment), and make them after the owner's yes."
- Standard: "Words and names", "Use common words"; "Sentences", "Say what to do."
- Why: "Name" does not tell the reader to make the change. The next clause then says "make them".
- Rewrite: "Never overwrite one of these files. Make only the toolkit's changes to it (a new section, a changed heading, or a changed guide comment), and make them after the owner's yes."

**U-5. "That section".** `update.md:145`. Medium.

- Text: "That section shows the form of the "Notion work items" line, and says which file shows the form of the "Notion memory" line."
- Standard: "Words and names", "Make the subject of "this", "that", "it", and "they" clear."
- Why: "That section" could be `notion-build/work-setup.md` or the "Toolkit settings" section of `PROJECT.md`. The second clause tells the reader that the section names a file, but not why that matters.
- Rewrite: "`notion-build/work-setup.md`, "Recording the links in PROJECT.md", shows the form of the "Notion work items" line. It also names the file that shows the form of the "Notion memory" line."

**U-6. How to tell the toolkit's commit.** `update.md:169`. Medium.

- Text: "A commit is the toolkit's when both of these are true: the second command also lists a file under `.claude/skills/` for that commit, and the commit's message names the setup, a move-over, or a toolkit update."
- Standard: "Sentences", "Put one idea in a sentence, or two ideas that belong together."
- Why: "also" and "the second command" make the reader look back and guess what the command lists.
- Rewrite: "A commit is the toolkit's when both of these are true: (1) the output of the second command lists a file under `.claude/skills/`, and (2) the commit's message names a setup, a move-over, or a toolkit update."

**U-7. Passive "the records pass the check first".** `update.md:199`. Medium.

- Text: "So in a project whose `.claude/settings.json` holds no entry that runs `validate-records.mjs`, the records pass the check first, and the entries that run `validate-records.mjs` go in last."
- Standard: "Sentences", "Name who acts, and put that name first."
- Why: it does not say that the agent makes the records pass, and "go in last" is an idiom.
- Rewrite: "So in a project whose `.claude/settings.json` holds no entry that runs `validate-records.mjs`, first make the records pass the check, and add the entries that run `validate-records.mjs` last."

**U-8. "When one is left".** `update.md:220`. Medium.

- Text: "Every other hook in the Git hooks folder stays. When one is left, "5. The pre-commit check" changes nothing and tells the owner."
- Standard: "Words and names", "Make the subject of ... clear."
- Why: "one" can mean a hook left after the removal, or a hook the owner had. "Left" is vague.
- Rewrite: "Every other hook in the Git hooks folder stays. When any other hook is in that folder, "5. The pre-commit check" changes nothing and tells the owner."

**U-9. "Both old folders".** `update.md:260`. Medium.

- Text: "Before replacing a merged skill, inspect both old folders and their files."
- Standard: "Words and names", "Make the subject ... clear."
- Why: the sentence does not say which two folders. The reader must work it out from the table above.
- Rewrite: "Before you replace a merged skill, inspect the project's old process folder (for example `running-work-item-lifecycle`) and its old storage folder (for example `using-work-tracker`), with all of their files."

**U-10. "Lost two files for the reason that the second bullet gives".** `update.md:273`. Medium.

- Text: "The local `memory/` folder lost two files for the reason that the second bullet gives: `decision_template.md` and `terminology-glossary.md`."
- Standard: "Sentences", "Put the condition before the action"; "Words and names", "Make the subject ... clear."
- Why: the reader counts bullets back to find the reason, and the sentence is in the wrong section (these files come from the local memory folder, not from a skill).
- Rewrite: "For the same reason, the local `memory/` folder lost `decision_template.md` and `terminology-glossary.md`. `one-home-layout.md` moves what a project wrote in those two files."

**U-11. One bullet with five instructions.** `update.md:336`. Medium.

- Text: "Record "Approved by <owner> on <date>" as what allowed the save. For a proposal that is a section, leave the status as it is, and add "Approved by <owner> on <date>." to the section's "Evidence and limits" line."
- Standard: "Extra rules for documents", "When one point needs several rules, give the main rule first. Then give each special case on its own line."; "Give each instruction its own sentence."
- Why: the bullet holds five steps in a row. "As what allowed the save" does not name a field, so the reader cannot tell where to write it.
- Rewrite: "When the owner keeps a proposal, make it current:" followed by four lines: "Set the file's status to `current`, or the page's Status to "accepted"." / "Remove "Proposal:" or "Proposal, not approved yet:" from the start of its one-line summary." / "Remove the line that starts `**Proposal, not approved yet:**`." / "Write "Approved by <owner> on <date>" in the place that records what allowed the save [name the field or place here; the old text does not]." Then a fifth line: "For a proposal that is a section, leave the status as it is, and add "Approved by <owner> on <date>." to the section's "Evidence and limits" line." Question for the file's author: which field holds "what allowed the save"?

**U-12. The reader is never told how to learn the project's toolkit version.** `update.md:364-366`. Medium.

- Text: "For every project that was set up before toolkit 0.8.0, follow `earlier-versions.md`, "The levels structure (toolkit 0.8.0)"."
- Standard: "Extra rules for documents", "Open the document with what it is for"; the wording-review check W9, "Reads alone."
- Why: only the 0.6.0 line gives a sign the reader can check (a `stage:` line). For 0.8.0 and 0.8.1 the reader is not told where the version is recorded or how to tell.
- Rewrite: add one sentence before the list: "Learn the toolkit version that set the project up from <the file and field that hold it>. When the project does not record it, judge by the signs below." Then give a sign for 0.8.0 and 0.8.1 as the 0.6.0 line does. I could not find in my area where the version is recorded, so the file's author must supply it.

**U-13. Heading "5. Services".** `update.md:357`. Medium.

- Text: "## 5. Services" over a list that holds Notion, Hindsight, GitHub, and three version-specific steps.
- Standard: "Words and names", "Give every heading a name in ordinary words that tells the reader what the section covers."
- Why: three of the six lines are not services. A reader who looks for the 0.8.0 steps will not look under "Services".
- Rewrite: "## 5. Steps for the project's tracker, memory service, and earlier versions". Update the Contents list, line 48, and the cross-references "5. Services" in `one-home-layout.md:318`.

**U-14. Step 3 of "Changing a setup choice" says the same thing twice.** `update.md:407-410`. Medium.

- Text: "Keep that skill and its selected store reference in the old form until the records have moved in step 5." and, in the next bullet, "Keep the old choice's installed instructions until the records move in step 5."
- Standard: "Paragraphs and sections", "Leave out a sentence that the reader does not need."; "Words and names", "Say a thing in plain words before you give it a name." ("the affected merged skill folder", "a project from before the merge").
- Why: the two bullets repeat the rule, and "merged" and "the merge" are not explained in this file.
- Rewrite: "3. Build a new setup copy for the new choices and compare, as sections 1 and 2 say." / "Add each file the project lacks, as the "Missing files" row says. Leave out the folder of the skill that the choice affects (`managing-work-items` or `managing-project-memory`)." / "Leave that skill as it is until step 6. Before then, read the old choice's `references/work-tracker.md` or `references/memory-store.md` (in an older project, `using-work-tracker` or `using-memory-store`). Read the new choice's reference in the setup copy to learn how to create and read back its records. Do not install the new reference over the old one before step 6." / "A new memory choice also replaces the toolkit's hook handlers ... (unchanged)."

**U-15. Step 6 holds five ideas.** `update.md:416`. Medium.

- Text: "Check for owner edits before replacing or removing a skill file. The selected `references/work-tracker.md` or `references/memory-store.md` then contains the new choice's instructions. Remove a retired storage-skill folder only after checking it for owner edits and getting the owner's yes."
- Standard: "Sentences", "Put one idea in a sentence ... Start a new sentence for a third idea."
- Why: install, remove, check, result, and a second removal rule are in one numbered step, and "retired storage-skill folder" is not named.
- Rewrite: "6. After the records are moved and the owner says yes to the list, install the new choice's merged skill folder from the setup copy and remove the old choice's files." with these lines under it: "Before you replace or remove a skill file, check it for owner edits." / "After the install, the selected `references/work-tracker.md` or `references/memory-store.md` holds the new choice's instructions." / "Remove an old storage-skill folder (`using-work-tracker` or `using-memory-store`) only after you check it for owner edits and the owner says yes." / then the three existing sub-bullets.

**Low findings in `update.md`: 8.** Examples:

- `update.md:56-57`: "In a project that was set up before the current folder layout, the section holds only the lines of the project's own choices. In such a project, the project is a Salesforce project when ..." The second sentence repeats "In such a project, the project". Rewrite: "In a project set up before the current folder layout, that project is a Salesforce project when it has a "Salesforce org aliases" line."
- `update.md:64`: the command text repeats the definition of the main checkout ("where `<main checkout>` is the first path that `git worktree list` prints"), which line 20 gave. Cut the clause.
- `update.md:286`: "A project set up from the rewrite branch may hold `write-for-the-reader.md`." The reader cannot know "the rewrite branch". Rewrite: "Some projects hold `write-for-the-reader.md`, a name that was used before version 0.9.1."

### `one-home-layout.md`

**O-1. "The last four rows".** `one-home-layout.md:65`. Medium.

- Text: "`update.md`, "3. What to do with each kind of file" and "4. What the toolkit no longer ships", make the changes for the last four rows of the table, so leave those four rows out of the plan below. A hit in one of those four rows shows that the other rows must be looked for."
- Standard: "Words and names", "Be specific. Name the thing."
- Why: the reader counts rows to find the four. The last sentence says "the other rows must be looked for", but the reader already runs every row, so it does not say what to do.
- Rewrite: "`update.md`, "3. What to do with each kind of file" and "4. What the toolkit no longer ships", make the changes for four rows of the table: "Toolkit settings" in the earlier form, a rules list in `AGENTS.md`, the two removed rules, and skills under a retired name. Leave those four rows out of the plan below. A hit in one of them also means the project has the old layout, so run every other row too." If the last sentence has another purpose, the author must say it.

**O-2. Two lines say opposite things about toolkit files.** `one-home-layout.md:301` and `:310`. Medium.

- Text: "Toolkit files hold nothing of the owner's and need no new place." and, nine lines later, "A template file in the old `delivery/` folders may hold the owner's facts".
- Standard: wording-review W4, "two lines ... that say different things"; the standard, "Words and names", "Be specific."
- Why: the first sentence is absolute and the later text makes exceptions, so the reader cannot tell which to follow.
- Rewrite: "Toolkit files normally hold nothing of the owner's and need no new place. Give them one row in the plan."

**O-3. Where the Moved up line is written.** `one-home-layout.md:279`. Medium.

- Text: "In step 7 of "After the owner's yes", add the `**Moved up:**` line after Related items, with the text `Nothing: the item was closed before the closing step existed.`"
- Standard: "Extra rules for documents", "Give each instruction its own sentence. The sentence says who does what, and when."
- Why: lines 322-324 say that `work-items/` changes only in step 8, apart from one early fix in step 7. This line does not say that it is that early fix, and it is in the main checkout.
- Rewrite: "When `validate-records.mjs` reports the missing Moved up line in step 7, add the `**Moved up:**` line after Related items in the main checkout. This is the one early change that "After the owner's yes" allows. Write the text `Nothing: the item was closed before the closing step existed.`"

**O-4. Step 8 bullet with five items.** `one-home-layout.md:344`. Medium.

- Text: "In the work items, write each Sources line, the Moved up line, the heading "Lessons not proven yet", each Questions and Answers row that the plan carries from a memory decision record, and the ID of each new `DECISIONS.md` entry in each work item that the entry affects."
- Standard: "Extra rules for documents", "Give each instruction its own sentence."; "Give every item in a list the same form."
- Why: five different writes are in one sentence, and the end of the sentence is hard to parse.
- Rewrite: "In the work items, write these, each in the place that `<copy>/work-items/AGENTS.md` and the work item template give:" with the lines "each Sources line;" / "the Moved up line;" / "the heading "Lessons not proven yet";" / "each Questions and Answers row that the plan carries from a memory decision record;" / "the ID of each new `DECISIONS.md` entry, in each work item that the entry affects."

**O-5. Bold labels in place of headings.** `one-home-layout.md:135-287`. Medium. See "Layout".

- Text: twenty paragraphs that start with a bold label, such as "**A shared question**", "**An agreed requirement**".
- Standard: "Extra rules for documents", "Organize the document so that a reader can find a thing from the headings alone."
- Why: the Contents list and the heading outline do not show them, so the reader scrolls 150 lines to find the rule for one row of the table.
- Rewrite: make each label a `###` heading under "Where each old file or record goes", and add them to the Contents list.

**Low findings in `one-home-layout.md`: 5.** Examples:

- `one-home-layout.md:102`: "The opening of this file names the file that gives each form." This is about the document itself. Rewrite: "The paragraph before "Contents" names the file that gives each form."
- `one-home-layout.md:324`: "Only one change is made in the main checkout earlier: ..." Rewrite: "You make only one change in the main checkout earlier: a fix for a finding of `.claude/hooks/validate-records.mjs`, in step 7."
- `one-home-layout.md:130`: "It stays the same file, and parts of it change." The next bullets say which parts. Rewrite: "It stays the same file. The rules below under `PROJECT.md` list the parts that change."

### `earlier-versions.md`

**E-1. "At the time that ... gives".** `earlier-versions.md:5`. Medium.

- Text: "Make every change to a local work item or to `memory/` in the main checkout, at the time that `update.md`, "Before you start", gives."
- Standard: "Words and names", "Be specific."; "Sentences", "Put the condition before the action."
- Why: the reader must open `update.md` to learn the time, and "gives" does not say what is given.
- Rewrite: "Make every change to a local work item or to `memory/` in the main checkout, after the branch was merged, as `update.md`, "Before you start", says."

**E-2. "(under `.claude/skills/`)".** `earlier-versions.md:44`. Medium.

- Text: "The chosen work folder adds those files inside `managing-work-items`; their sources are this skill's `assets/work-local/`, `assets/work-notion/`, and `assets/work-github/` (under `.claude/skills/`)."
- Standard: "Words and names", "Make the subject of ... clear."
- Why: "under `.claude/skills/`" could mean the sources, the skill, or the project. The reader cannot tell which folder holds the files.
- Rewrite: "The steps name storage references, such as `work-tracker-field-mapping.md` for local work. In a project, those files are inside `.claude/skills/managing-work-items/`. Setup copies them from this skill's `assets/work-local/`, `assets/work-notion/`, or `assets/work-github/`." If the path in the first sentence is not right, the author must correct it.

**E-3. Step 1 of the levels structure.** `earlier-versions.md:46`. Medium.

- Text: "List every level-2 and level-3 work item that still has a phase that is not Cancelled, or a task under a phase. Convert each one with "A work item that changes level", "Phases to a plain list"."
- Standard: "Words and names", "A made-up word is new ... explain the made-up word when it first appears."; "Sentences", "Put one idea in a sentence".
- Why: "level-2" and "level-3" are not explained in this file, and the step has five sentences, one of them a pointer to three different files.
- Rewrite: "1. **Sub-items that have phases.** List every sub-item (a work item inside another work item, at the second or third level) that still has a phase that is not Cancelled, or a task under a phase." / "Convert each one with the part "Phases to a plain list" of the section "A work item that changes level". That text is in `work-tracker-field-mapping.md` for local work items, `work-tracker-database-layout.md` for Notion, and `work-tracker-issue-layout.md` for GitHub." / "A third-level work item that sits under a phase of its second-level parent leaves that phase."

**E-4. Step 4, Notion bullet with five instructions.** `earlier-versions.md:54`. Medium.

- Text: "With work items in Notion, the "Project tasks" view comes with the views, as `notion-build/work-setup.md` says. Also add Phase type and Task type, and make "By project phase", "Project phases", and "Project tasks" the first tabs, in the project and in the shared "Project" template. ... Then give the owner the page-layout clicks ..."
- Standard: "Extra rules for documents", "When one point needs several rules, give the main rule first. Then give each special case on its own line."
- Why: "comes with the views" and "page-layout clicks" are loose, and the reader must hold five tasks in one bullet.
- Rewrite: "With work items in Notion, do these in order:" then one line each: "Add the "Project tasks" view with the other views, as `notion-build/work-setup.md` says." / "Add Phase type and Task type." / "Make "By project phase", "Project phases", and "Project tasks" the first tabs, in the project and in the shared "Project" template. Steps 2, 3, and 5 of `notion-build/work-setup.md`, "Bringing a project up to the current template", say how." / "Give the owner the steps in `notion-build/work-layout.md`, "Property order and page layout", that pin Phase type and Task type in the page layout."

**E-5. "The older label".** `earlier-versions.md:75`. Medium.

- Text: "A work item that holds the older label of its Functional Requirements (from before toolkit 0.8.4) keeps that label."
- Standard: "Words and names", "Be specific. Name the thing."
- Why: the reader is not told what the older label is, so cannot recognise such a work item.
- Rewrite: "A work item that holds the older label of its Functional Requirements, "<the older label's text>" (from before toolkit 0.8.4), keeps that label." The author must supply the text of the older label.

**Low findings in `earlier-versions.md`: 2.**

- `earlier-versions.md:53`: "`work-items/PROJECT-TASKS.md` comes in with the missing files" is an idiom. Rewrite: "the "Missing files" row adds `work-items/PROJECT-TASKS.md`, in the main checkout."
- `earlier-versions.md:50`: "your worktree, which is your separate folder with its own branch" repeats a definition the reader already has in `update.md`. Cut the clause or keep it, because this file must read alone.

### `move-over.md`

**M-1. "With every memory choice".** `move-over.md:72-73`. Medium.

- Text: "In Toolkit V2, the decisions, the description of the system, and the terms are files that Git tracks, with every memory choice."
- Standard: "Sentences", "Keep the subject and its verb close together."; wording-review W8, text for the owner is plain.
- Why: the agent says this to the owner. "With every memory choice" reads as an extra item that is tracked, not as "whichever choice".
- Rewrite: "In Toolkit V2, the decisions, the description of the system, and the terms are files that Git tracks, whichever memory choice the owner makes."

**M-2. `<copy>` is used before it is explained.** `move-over.md:96-98`. Medium.

- Text: the table row at line 96 uses `<copy>`, and the bullet at line 98 explains it: "The setup copy is the project's finished files, built in a temporary folder ... `<copy>` stands for that folder."
- Standard: "Words and names", "If plain words and a visible name do not work, explain the made-up word when it first appears."
- Why: the reader meets `<copy>` in the table first and has to read past it to learn what it is.
- Rewrite: put the first bullet of line 98 before the table: "In this step, `<copy>` stands for the setup copy. The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. Building the setup copy writes only in the temporary folder."

**M-3. "The old project facts file".** `move-over.md:241`. Medium.

- Text: "A fact that an old file shows (the old project facts file, the owner's `AGENTS.md`) counts as a fact that a file in the repository shows."
- Standard: "Words and names", "Use the exact name the system uses"; "Be specific."
- Why: "the old project facts file" is not a name the reader has seen. `old-toolkit-pieces.md` calls it `knowledge/project.md`.
- Rewrite: "A fact from an old file (such as `knowledge/project.md`, the old root `PROJECT.md`, or the owner's `AGENTS.md`) counts as a fact that a file in the repository shows."

**Low findings in `move-over.md`: 5.** Examples:

- `move-over.md:38`: the "Look" bullet holds three sentences and a definition of a worktree. Split it, and move the definition to where "linked worktree" first appears.
- `move-over.md:124`: "After each line is read back in its new place, the file is removed or replaced as an unchanged copy would be." This does not say who acts. Rewrite: "After you read each line back in its new place, remove or replace the file as you would an unchanged copy."
- `move-over.md:235`: the line to write holds nested quotation marks: `... under "Toolkit settings".` This is an exact string; it is awkward, but leave it.

### `old-toolkit-pieces.md`

**P-1. The setup copy is explained after it is used.** `old-toolkit-pieces.md:29-32`. Medium.

- Text: "A file in `.claude/rules/`, `.claude/hooks/`, `.claude/tools/`, or `.claude/skills/` can be one that no table names and that the setup copy does not hold. The setup copy is the project's finished files, built in a temporary folder ..."
- Standard: "Sentences", "Put one idea in a sentence"; "Words and names", "explain the made-up word when it first appears."
- Why: the sentence has two conditions joined by "and that", and the made-up word is explained only in the next sentence.
- Rewrite: "The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. A file in `.claude/rules/`, `.claude/hooks/`, `.claude/tools/`, or `.claude/skills/` may be in none of the tables below and not in the setup copy." followed by the two existing bullets, with "in its place" changed to "in the last column".

**P-2. One row gives Carry, Delete, and Kept.** `old-toolkit-pieces.md:83` and `:85`. Medium.

- Text: the row says "Carry", and the sentence below says "delete the file only when every decision in it was saved, or the owner said to drop it. Otherwise the file is Kept."
- Standard: wording-review W4, "two lines ... that say different things"; the standard, "Extra rules for documents", "Decide whether each instruction is exact or general."
- Why: the reader sees three parts for one file, and the part names are the ones the move-over list uses.
- Rewrite: in the row, write the Part as "Carry, then Delete". Below the table: "For the row `.claude/toolkit-sync.md`: after step 6 of `move-over.md` carries the confirmed decisions over, delete the file when every decision in it was saved or the owner said to drop it. Otherwise the file is Kept."

**P-3. Headings that do not say what is under them.** `old-toolkit-pieces.md:54`, `:58`, `:87`. Medium. See "Layout".

- Text: "## Plugins", "## Rules", and "## Hook commands and their settings entries" (which also holds a second table for other settings entries).
- Standard: "Words and names", "Give every heading a name in ordinary words that tells the reader what the section covers."
- Why: "Rules" and "Plugins" do not say that the section is about old files, and the second table at line 107 is not about hook commands.
- Rewrite: see "Layout".

**Low findings in `old-toolkit-pieces.md`: 5.** Examples:

- `old-toolkit-pieces.md:27`: "**Update**, **Your call**: the row goes under that part as written." This repeats the part's name. Rewrite: "**Update** and **Your call**: the row goes under the part with that name."
- `old-toolkit-pieces.md:253`: "The Toolkit V2 `DECISIONS.md` takes its path" is an idiom. Rewrite: "The Toolkit V2 `DECISIONS.md` goes at the same path, so move the old file first".
- `old-toolkit-pieces.md:114` and `:147`: empty cell, and a sentence in a Part cell. Fill the cell ("Nothing") and put "Kept with the old folder" in the Part cell.

### `hindsight-on-vps.md`

**H-1. Observations and consolidation: the word is used before it is defined.** `hindsight-on-vps.md:50-52`. Medium.

- Text: "By the server's own setting, Hindsight builds observations only on request. A bank's own settings can change that for the bank. An observation is a statement that Hindsight builds from several saved memories, and consolidation is the job that builds them."
- Standard: "Words and names", "explain the made-up word when it first appears."
- Why: the reader meets "observations" and "consolidation" in the first sentence and learns what they are in the third.
- Rewrite: "An observation is a statement that Hindsight builds from several saved memories. Consolidation is the job that builds observations. By the server's own setting, Hindsight builds observations only on request, and a bank's own settings can change that for the bank." Keep the two sub-bullets that follow.

**H-2. "Knowledge pages" is never explained.** `hindsight-on-vps.md:63`, `:67`, `:68`, `:280`. Medium.

- Text: "The tools search and read the bank's knowledge pages and memory"
- Standard: "Words and names", "A made-up word ... explain the made-up word when it first appears."
- Why: the word appears four times, and the setting "Summary on the first message" depends on it, but the file never says what a knowledge page is.
- Rewrite: add one clause where the word first appears (line 63): "the bank's knowledge pages (<what Hindsight keeps on a knowledge page>)". The author must take the clause from Hindsight's documentation in `ai-external-knowledge/hindsight/`.

**H-3. "They set ... They ask ...".** `hindsight-on-vps.md:71-73`. Medium.

- Text: "The add-on's settings also hold two values for a bank that has no choices of its own yet: They set `defaultBankConfig.enable_observations` to `false` ... They ask for the `world` and `experience` types when the add-on recalls memories ..."
- Standard: "Words and names", "Make the subject of "this", "that", "it", and "they" clear."
- Why: "They" means the two values, but the second sentence says the values "ask", which a value cannot do. `world` and `experience` are not explained.
- Rewrite: "The add-on's settings also hold two values for a bank that has no choices of its own yet:" / "`defaultBankConfig.enable_observations` is `false`, because the add-on's bank template would otherwise turn observations on for the bank. With that value at `false`, Hindsight consolidates nothing in the bank, by itself or on request." / "`recallOptions.types` is `["world", "experience"]`, so the add-on asks for the memory types `world` and `experience` when it recalls memories. Without this value the add-on asks only for observations." The author must add one clause that says what `world` and `experience` memories are.

**H-4. Bullets come before the commands they describe.** `hindsight-on-vps.md:94-99`. Medium.

- Text: "Give the owner these two lines, which are written for zsh, the Mac's default shell. - The second line asks for the key and shows nothing while the owner types or pastes it."
- Standard: "Extra rules for documents", "Write steps in the order the reader does them."
- Why: the reader reads about "the second line" before the two lines appear, about five lines later.
- Rewrite: "Give the owner these two lines, which are written for zsh, the Mac's default shell:" [code block] "The second line asks for the key and shows nothing while the owner types or pastes it. It also writes the server address with the key, because with no server named, the add-on sends saves, with this key, to Hindsight Cloud."

**H-5. Six defaults with no names.** `hindsight-on-vps.md:284`. Medium.

- Text: "The file that setup copies holds the default of each setting: observations on and built after every save, every session saved, `"verbose"`, `"reflect"`, `"full"`, and the code survey on."
- Standard: "Sentences", "Give every item in a list the same form."; "Words and names", "Be specific."
- Why: three of the six values are bare strings. The reader must count against the table to know which setting each belongs to.
- Rewrite: "The file that setup copies holds these defaults: Observations, on and built after every save. Save every session, `true`. Detail of a save, `"verbose"`. Summary on the first message, `"reflect"`. Git history, `"full"`. Code survey, `true`." Put it as a list.

**H-6. The settings check holds three cases in one bullet.** `hindsight-on-vps.md:361`. Medium.

- Text: "When that command prints `null`, this computer has no settings for the bank yet. When this update copied the file into the project, the owner was never asked: ask as "Ask the owner" says, and then apply the answers. When the project already had the file, do steps 3 to 5 of "Apply the settings" after the owner's yes."
- Standard: "Extra rules for documents", "When one point needs several rules, give the main rule first. Then give each special case on its own line."
- Why: a condition ("prints `null`") and two sub-cases share one bullet, and "the owner was never asked" is a fact, not an instruction.
- Rewrite: "Step 4 of "Apply the settings" shows every key of the file's `addOn` part with the file's value. When it prints `null`, this computer has no settings for the bank yet:" then two lines: "When this update copied the file into the project, the owner has not been asked. Ask as "Ask the owner" says, and then apply the answers." / "When the project already had the file, do steps 3 to 5 of "Apply the settings" after the owner's yes."

**H-7. "Step 4.1 ... which is step 1".** `hindsight-on-vps.md:393`. Medium.

- Text: "Show an MCP entry only as step 4.1 does, which is step 1 of "4. The add-on", because an older entry can hold the key in its headers or `env`."
- Standard: "Words and names", "Use the exact name the system uses for a thing, and use the same name every time."
- Why: the same step has two names in one sentence, and "step 4.1" is a name that no heading uses.
- Rewrite: "Show an MCP entry only the way step 1 of "4. The add-on" does, because an older entry can hold the key in its headers or `env`."

**Low findings in `hindsight-on-vps.md`: 5.** Examples:

- `hindsight-on-vps.md:42`: the DNS and Caddy sentence is not used by any step, and "Caddy" is not explained. Cut it, or say why the agent needs it.
- `hindsight-on-vps.md:337`: "Hindsight can build no observation at all when the saved memories give it nothing to join." "Join" is figurative. Rewrite: "Hindsight builds no observation when the saved memories do not share a subject."
- `hindsight-on-vps.md:303`: "The answer must show both fields with the file's values." comes before the command shows which two fields. Rewrite: "The answer must show `enable_observations` and `enable_auto_consolidation` with the file's values."

## Patterns

**1. A step that packs three or more instructions into one bullet (W10).** 9 cases: U-11, U-14, U-15, O-4, E-3, E-4, H-6, and also `update.md:199` (U-7) and `update.md:408-410`. Examples: `update.md:416`, `one-home-layout.md:344`, `earlier-versions.md:54`. Fix: the main rule first, then one rule per line.

**2. A word used before it is explained, or never explained.** 6 cases: `<copy>` (M-2), "setup copy" (P-1), "observations" (H-1), "knowledge pages" (H-2), `world`/`experience` (H-3), "level-2" (E-3). Fix: explain once, in one clause, where the word first appears.

**3. A pointer the reader cannot follow without guessing.** 9 cases: "the last paragraph" (U-2), "that section" (U-5), "the second bullet" (U-10), "both old folders" (U-9), "the last four rows" (O-1), "at the time that ... gives" (E-1), "(under `.claude/skills/`)" (E-2), "step 4.1, which is step 1" (H-7), and in `old-toolkit-pieces.md` the five phrases "the line under this table" and "the list under this table" (lines 128, 211, 212, 219, 223). Fix: name the section or the rows.

**4. Headings that do not say what is under them, or labels used as headings.** 4 cases: "5. Services" (U-13), "Plugins" and "Rules" (P-3), the bold labels in `one-home-layout.md` (O-5).

**5. A sentence with no actor, especially "after the branch was merged".** About 12 cases. Examples: `update.md:70` ("only after the branch was merged"), `one-home-layout.md:324` ("Only one change is made ..."), `move-over.md:124`. Fix: name who acts.

**6. History the step does not need.** 4 cases: "The current merge retires" (U-1), "the rewrite branch" (`update.md:286`), "after the merge" and "a project from before the merge" (U-14), and the "lost two files" sentence (U-10). The version history that tells the reader how to recognise an old file is needed and is not a finding.

**7. A value or file that the sentence needs but does not name.** 4 cases: the field "what allowed the save" (U-11), the toolkit version location (U-12), the older label (E-5), the knowledge page (H-2). The author must supply these. They are questions, not rewrites.

## Layout

**`update.md`.** The Contents list matches the headings. Change these headings, and update every file that names them:

- as it is: "4. What the toolkit no longer ships" with the subsections "Retired skills", "Renamed skills", "Files dropped from a skill", ...
- proposed: "4. What the toolkit no longer ships" with "Old skill folders and what replaces them" (joins "Retired skills" and "Renamed skills", U-1), then "Files dropped from a skill", "Removed rules", ...
- as it is: "5. Services"
- proposed: "5. Steps for the project's tracker, memory service, and earlier versions" (U-13)

**`one-home-layout.md`.** Order as it is: Find the old layout, The plan, Where each old file or record goes (one table, then twenty bold labels, then two `###` sections), After the owner's yes. Proposed:

1. Find the old layout (unchanged)
2. The plan to show the owner
3. Where each old file or record goes
   - The table (unchanged)
   - One `###` heading for each bold label now in the file: "A shared question", "A memory decision record", "Every other memory record", "The glossary", "An agreed requirement", "A verified description", "A person and authority record", "A target direction record", "An intake receipt", "A domain map", "A source inside a work item", "A client file in `delivery/meeting-notes/` or `delivery/references/`", "`delivery/communications/` and `delivery/deliverables/`", "`delivery/deployment/`", "`delivery/data/`", "`delivery/archive/`", "`ai-external-knowledge/`", "A `DECISIONS.md` in another form", "`PROJECT.md`", "A work item that is not Done or Cancelled", "A work item that is Done or Cancelled", "The Notion work item template"
   - "The project's Current State in the earlier form" (already a heading)
   - "Toolkit files" (already a heading)
4. Steps after the owner's yes (was "After the owner's yes"; update the nine references to it in `update.md` and `move-over.md`)

**`old-toolkit-pieces.md`.** Proposed headings, in the same order:

- "How to read the tables" (unchanged)
- "The old toolkit's own copy" (unchanged)
- "Old plugins" (was "Plugins")
- "Old rules in `.claude/rules/`" (was "Rules")
- "Old hook commands in `.claude/hooks/`" (was "Hook commands and their settings entries")
- "Old entries in `.claude/settings.json`" (new heading for the second table, now at line 107)
- "Old tools, skills, and other agent files" (was "Tools, skills, and other agent files")
- "Knowledge files that hold no records" (unchanged)
- "Old records", "Old work item to Toolkit V2 work item", "Old memory to its place in Toolkit V2", "The retired toolkit program" (unchanged)

`move-over.md`, `earlier-versions.md`, and `hindsight-on-vps.md` need no heading changes.
