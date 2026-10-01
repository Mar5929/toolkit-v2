# Review of the Notion database-template skill edits (2026-10-01)

Commit reviewed: 90ceb39 on claude/notion-db-templates (based on 169bbc8). Reviewers: wording, overlap, and best practices (dev/reviews/), then a verifier. Nothing was changed by the review.

Kept: 27 findings. Dropped: 14.

## Kept findings, each with its exact fix

### 1. plugins/toolkit/skills/project-setup/references/notion.md (line 8)

- Check: W4 (two lines say different things)
- Source: dev/reviews/wording-review.md W4; the same file, "Where the project page goes" (one `ntn api v1/search` call is left, line 71)
- Problem: Unchanged intro line: "Setup makes only these Notion calls itself: `ntn whoami`; the two `ntn api v1/search` calls in \"Where the project page goes\"". This change removed the page search (the root-page search) from that section, so only one search call is left (step 1). Verified: grep finds one `v1/search` call in the file. The intro promises a second call that no longer exists.
- Fix: In lines 8-9 replace "the two\n`ntn api v1/search` calls in \"Where the project page goes\"" with "the\n`ntn api v1/search` call in \"Where the project page goes\"". Nothing else changes.

### 2. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/workspace.md (line 23)

- Check: W4 (two lines say different things)
- Source: dev/reviews/wording-review.md W4; setup.md "A new project" step 3 ("If the owner has no Projects database, stop and ask him.") and project-setup notion.md "Where the project page goes" step 3
- Problem: Unchanged text beside the edit: "A project is one page (a row of the owner's Projects database, or a page under the top-level Notion page he shared with the \"Notion CLI\" connection, when he has no Projects database)." This change makes every project a row of the Projects database and tells the agent to stop when there is none. Two readings: make a plain page under the root page (this line) or stop (setup.md, notion.md).
- Fix: Replace "A project is one page (a row of the owner's Projects database, or a page under the top-level Notion page he shared with the \"Notion CLI\" connection, when he has no Projects database). Its children, in order:" (lines 23-25) with "A project is one page, a row of the owner's Projects database. Its children, in order:".

### 3. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-find/references/queries.md (line 24)

- Check: W4 (two lines say different things)
- Source: dev/reviews/wording-review.md W4; the new "Cards with no title" section of the same file (lines 182-195) runs a query that returns exactly the rows the rule says to leave out
- Problem: queries.md line 24 says "Every Work Items query also leaves out rows with an empty title", and notion-work-find SKILL.md Rules (lines 45-46) say "always leave out rows with an empty title (the work item template is one)." The new "Cards with no title" query filters for those rows (`is_empty`) and tells the agent to report them. Two readings: never list them, or run the query as written.
- Fix: queries.md lines 23-24: replace "Every Work Items query also leaves out rows with an empty title" with "Every Work Items query except \"Cards with no title\" below also leaves out rows with an empty title". notion-work-find SKILL.md lines 45-46: replace "- Leave out archived items unless the owner asks for them, and always leave out rows with an empty title (the work item template is one)." with "- Leave out archived items unless the owner asks for them. Leave out rows with an empty title (the work item template is one), except in the \"Cards with no title\" query in `references/queries.md`." (The items.md sentence is fixed in the items.md finding.)

### 4. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-find/references/queries.md (line 56)

- Check: W4 (two readings of one file) and best-practices anti-pattern "Something only the agent knows to do that is written nowhere it will read at the right moment"
- Source: dev/reviews/wording-review.md W4; dev/reviews/best-practices-review.md anti-patterns; test record on branch worktree-notion-work-tracker, dev/test-runs/notion-skill-sets.md, "Real migration" step 4 (a query with the condition returns 0 of the 1 row, the template) and "The board fix" step 5 (the template holds number 1)
- Problem: Lines 24-27 say every Work Items query must have `{"property":"Work item","title":{"is_not_empty":true}}` added, but the exact call under "Where things stand (the board)" does not hold it: its filter is Archived false, Status not Done, Status not Cancelled. "What waits on the owner" and "What is next" build on this call, and work-status runs it for every "where are we". An agent that copies it exactly gets the work item template row (empty title, Status Backlog, Archived unticked, usually ID 1) as an untitled Backlog item in the report.
- Fix: In the board query, change the first two filter lines from "  \"filter\":{\"and\":[{\"property\":\"Archived\",\"checkbox\":{\"equals\":false}},\n    {\"property\":\"Status\",\"status\":{\"does_not_equal\":\"Done\"}}," to "  \"filter\":{\"and\":[{\"property\":\"Archived\",\"checkbox\":{\"equals\":false}},\n    {\"property\":\"Work item\",\"title\":{\"is_not_empty\":true}},\n    {\"property\":\"Status\",\"status\":{\"does_not_equal\":\"Done\"}},". Keep lines 24-27 as they are (with the \"except\" change from the finding above).

### 5. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-find/SKILL.md (line 30)

- Check: W4 (a step whose trigger is unclear) and best-practices anti-pattern "written nowhere it will read at the right moment"
- Source: dev/reviews/wording-review.md W4; dev/reviews/best-practices-review.md anti-patterns; .shared-skills/work-status/SKILL.md step 1 (it asks the work find skill only for the board, what waits on the owner, and what is next)
- Problem: notion-work-track items.md line 349 says "The status report lists them (notion-work-find, `queries.md`, \"Cards with no title\")". Nothing makes the status report run that query: the SKILL.md step 2 table sends "Where things stand" to the "Where things stand" query only, that query's section does not mention it, and work-status asks only for the board, what waits, and what is next. A card with no title is hidden from the board, so no board row prompts the agent to look (the "Pages without the template" case at least shows a board row with no stage). The new rule has no trigger and the card stays lost.
- Fix: SKILL.md step 2 table, line 30: replace "| Where things stand (for work-status), or \"show me the board\" | Where things stand |" with "| Where things stand (for work-status), or \"show me the board\" | Where things stand, then Cards with no title |". queries.md, at the end of "Where things stand (the board)" (after the line "and Cancelled only when asked (then drop those two filters)."), add: "Then run \"Cards with no title\" below and report each card it returns as a record problem." (work-status already reports \"any record problem\", one line each.)

### 6. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/items.md (line 348)

- Check: W4 (two lines say different things; "which" with two readings)
- Source: dev/reviews/wording-review.md W4; queries.md "Cards with no title" (asks the owner "to name it or archive it")
- Problem: "A card with an empty title is hidden from every Work Items view and query. The status report lists them (...); name or archive one only after the owner says which." (1) "hidden from every ... query" contradicts the sentence right after it and the "Cards with no title" query. (2) "says which" can mean which card, or which of the two actions (name it, archive it); naming also needs a title the sentence does not mention.
- Fix: Replace lines 348-350 ("A card with an empty title is hidden from every Work Items view and query. The status report lists them (notion-work-find, `queries.md`, \"Cards with no title\"); name or archive one only after the owner says which.") with "A card with an empty title is hidden from every Work Items view and from every query except notion-work-find's \"Cards with no title\" (`queries.md`). The status report lists these cards. For each one, name it or archive it only after the owner says which of the two he wants and, to name it, what the title is."

### 7. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 48)

- Check: W6 (a sentence that would not change what the agent does) and W2 (label defined, never used)
- Source: dev/reviews/wording-review.md W6, W2; grep of setup.md: "Notion root" and `<root-page-id>` appear nowhere else in the file
- Problem: "In this file, \"the owner's Notion root\" and `<root-page-id>` mean that page." This change removed every use of both labels (the root-page fallback in step 3 and the build under the Notion root). The sentence defines two labels nothing uses.
- Fix: Delete the sentence "In this\nfile, \"the owner's Notion root\" and `<root-page-id>` mean that page." (lines 48-49). Keep the rest of the paragraph ("Before anything: ... \"Which pages the agent can reach\").").

### 8. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 173)

- Check: W7 (one name for one thing) and W4 (term with two referents)
- Source: dev/reviews/wording-review.md W7, W4
- Problem: Step 4 now calls the new database template "the work item template" and, in the same step, names the older plain page a "plain \"Work item template\" page" that "is no longer used". Three bullets of the same step still say "On the template page" (lines 173-174 and 180) and "A template page whose Next action prompt is the older one" (line 187). Two readings: the old plain page, or the new database template. Only the new template should be changed.
- Fix: Lines 173-174: replace "On the\n     template page, change the header row" with "On the\n     work item template, change the header row". Line 180: replace "On the template page, replace the Overview" with "On the work item template, replace the Overview". Line 187: replace "A template page whose Next action prompt is the older one" with "A work item template whose Next action prompt is the older one".

### 9. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 148)

- Check: W4 (two readings, no rule for the other case) and the file's own rule (line 119) "Never remove, rename, or retype anything; the owner may have added his own columns and views, and they stay."
- Source: dev/reviews/wording-review.md W4; setup.md lines 117-120; the tested method in migrate-real.mjs on branch worktree-notion-work-tracker (it sends {and:[...the view's own conditions, the title condition]}); the old Board and All items assets held a single Archived condition, not an "and" list
- Problem: "A Work Items view whose filter does not leave out an empty title gets the filter from its asset: `PATCH v1/views/<id>` with only `filter`." (1) "A Work Items view" includes views the owner added, which have no asset, so "its asset" has no referent. (2) Two readings of "gets the filter from its asset": replace the whole filter with the asset's (this erases filter changes the owner made on a toolkit view and breaks line 119), or add only the empty-title condition (what was tested). (3) It does not say which views have an asset: files 10, 11, 12, 13, 14, and 17 (Board, By stage, All items, Roadmap, Waiting on Mike, Top-level items).
- Fix: Replace the sentence (lines 148-149) with: "Each view named Board, By stage, All items, Roadmap, Waiting on Mike, or Top-level items (files 10, 11, 12, 13, 14, and 17) whose filter lacks `{\"property\":\"title\",\"title\":{\"is_not_empty\":true}}` gets it: read the view's filter (`ntn api v1/views/<id> < /dev/null | jq -c .filter`), then send `PATCH v1/views/<id>` with only `filter`: `{\"and\":[<its conditions>,{\"property\":\"title\",\"title\":{\"is_not_empty\":true}}]}`, where <its conditions> are the items of its \"and\" list, or its one condition. Its grouping and sub-items stay. Leave the owner's own views as they are."

### 10. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 164)

- Check: W6 (no repeated rule in the same file; no story about what happened)
- Source: dev/reviews/wording-review.md W6
- Problem: "Never fill a template with `template_id`: that turns it into a row that shows on the owner's boards (tested 2026-10-01)." appears twice in this file: step 4 of "Bringing a project up to the current template" (lines 164-165) and the opening paragraph of "Building the templates" (lines 200-202). The test date is a story about a past test and does not change what the agent does. Do not simply delete step 4's copy: step 4 sends the agent to steps 9 and 10, and the rule must stay reachable there.
- Fix: Lines 200-202: change "Never fill a template with `template_id`: that turns it into a row that shows on the owner's boards (tested 2026-10-01)." to "Never fill a template with `template_id`: that turns it into a row that shows on the owner's boards." Lines 163-166: replace "then fill the new template the way steps 9 and 10 do (text, then views). Never fill a template with `template_id`: that turns it into a row that shows on the owner's boards (tested 2026-10-01). Tell the owner the plain page is no longer used and he may delete it." with "then fill the new template as the opening paragraph of \"Building the templates\" and its steps 9 and 10 say (text, then views). Tell the owner the plain page is no longer used and he may delete it." (The test evidence stays in the test record.)

### 11. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 40)

- Check: W4 (a condition with no rule for the other case, where the other case can happen)
- Source: dev/reviews/wording-review.md W4; best-practices anti-pattern "written nowhere it will read at the right moment"; the section title "Building the templates (first time, or a damaged one)"
- Problem: "If the Projects database has none of the three, build the templates first" covers zero templates only. One or two of the three can exist (the owner deleted one, or a build stopped halfway). Then step 1 of "A new project" finds no id for the template it needs, and "Building the templates" step 1 asks for all three templates, which would make duplicates. The same gap is in project-setup notion.md line 52 ("asked when they do not exist yet").
- Fix: setup.md lines 40-41: replace "If the Projects database has none of the three, build the templates first (\"Building the templates\" below)." with "If the Projects database lacks any of the three, build the missing ones first (\"Building the templates\" below; ask for the clicks in its step 1 only for the templates that are missing)." The matching notion.md change ("asked when any of the three does not exist yet") is in the notion.md question finding. If Mike wants all three rebuilt whenever one is missing, that changes the meaning and is his decision.

### 12. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 246)

- Check: W4 (a term with two referents) and W7
- Source: dev/reviews/wording-review.md W4, W7; ntn-basics.md placeholder table (`{{ITEM_PAGE_ID}}` is the work item template)
- Problem: In "Building the templates", "the template" means the project template in steps 1 to 8 ("The steps below use the template's id as `{{PROJECT_PAGE_ID}}`"). Step 9, titled "The work item template.", says "in the template's Work Items database", and step 10 says "`{{ITEM_PAGE_ID}}` the template's id". A work item template has no Work Items database, so step 9 means the project template; step 10 means the work item template. An agent can put `{{ITEM_PAGE_ID}}` on the project template, and the item views would then be made on the wrong page.
- Fix: Step 9 (lines 245-246): replace "in the\n   template's Work Items database" with "in the\n   Work Items database of the project template you are building". Step 10 (line 257): replace "`{{ITEM_PAGE_ID}}` the template's id" with "`{{ITEM_PAGE_ID}}` the work item template's id".

### 13. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 280)

- Check: W4 (vague; no call to run; "it" with two referents)
- Source: dev/reviews/wording-review.md W4; ntn-basics.md "Finding rows" and "Database templates"; test record "Real migration" step 5 (the query returned the three new templates, found by their ids)
- Problem: "The Projects database query returns no template: a template it returns shows as a card on the owner's board." No "Projects database query" is defined or shown, so the agent has no call to run and no rule for what to compare. "it" can be the query or the database. Two agents run different checks.
- Fix: Replace lines 280-281 with: "- No row of the Projects database is a template. List the rows (`ntn api v1/data_sources/<projects-data-source-id>/query -d '{\"page_size\":100}' < /dev/null | jq -r '.results[].id'`; `ntn-basics.md`, \"Finding rows\") and the templates (`ntn api v1/data_sources/<projects-data-source-id>/templates < /dev/null | jq -r '.templates[].id'`). No row may have a template's id: a template that comes back as a row shows as a card on the owner's board."

### 14. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 200)

- Check: W6 and W3 (a sentence that changes nothing the agent does; a saying)
- Source: dev/reviews/wording-review.md W3, W6
- Problem: "Build each template piece by piece, as below." is a saying, and "as below" points at eleven numbered steps that already give the order; the sentence changes nothing the agent does. Line 31-32: "Every project copy takes it along, still the default." uses "takes it along" for "holds".
- Fix: Line 200: delete "Build each template piece by piece, as below." Lines 31-32: replace "Every\nproject copy takes it along, still the default." with "Every\nproject made from these templates has this template, still set as the default."

### 15. plugins/toolkit/skills/project-setup/references/notion.md (line 83)

- Check: W4 and W5 (an open decision not stated as one)
- Source: dev/reviews/wording-review.md W4, W5
- Problem: "When he has none, stop and ask him: the templates live in a Projects database, so a Notion project needs one." The text after the colon is a reason, not a question, so two agents ask different things (make one? which page? use another tracker?). The same gap is in notion.md lines 93-94 ("stop and ask him: the templates live in a Projects database.") and notion-work-track setup.md line 75 ("If the owner has no Projects database, stop and ask him.").
- Fix: notion.md lines 83-85: replace "stop and ask him: the templates live in a Projects database, so a Notion project needs one." with "stop, tell him a Notion project needs a Projects database because the templates live in one, and ask him to make one in Notion." notion.md lines 93-94: replace "stop and ask him: the templates live in a Projects database." with "stop, tell him that page has no Projects database, and ask him to make one on it or to name another page." setup.md line 75: replace "stop and ask him." with "stop, tell him a Notion project needs a Projects database, and ask him to make one in Notion." (If Mike wants a different question, such as offering another tracker, he decides.)

### 16. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-memory/notion-memory-save/references/setup.md (line 36)

- Check: W4 (pronoun with two referents; a case with no rule)
- Source: dev/reviews/wording-review.md W4
- Problem: "The templates live in the Projects database; if the owner has none, stop and ask him." "none" can mean no Projects database (stop) or no templates (build them). The matching line in the work track setup says "has no Projects database".
- Fix: Replace "if the owner has none, stop and ask him." with "if the owner has no Projects database, stop and ask him to make one in Notion; if the templates list has no \"Project: memory only\", build the templates first (the notion-work-track skill's setup, \"Building the templates\")."

### 17. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-memory/notion-memory-save/references/setup.md (line 107)

- Check: W4 (pronoun with two referents)
- Source: dev/reviews/wording-review.md W4
- Problem: "Used by the template build in the notion-work-track skill's setup (and for the Projects database template \"Project: memory only\", ...). \"The template page\" below is that Projects database template." "that" can point to "Project: memory only" (the nearest name) or to the template the work track build is making. Read the first way, the Memory page of a work-and-memory build goes under the memory-only template.
- Fix: Replace "\"The template page\" below is that Projects database template." with "\"The template page\" below is the Projects database template being built: \"Project: work and memory\" when the notion-work-track skill's build calls this, or \"Project: memory only\" when it is built on its own."

### 18. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/examples/new-item-walkthrough.md (line 24)

- Check: W4 and W6 (a name that points at nothing; a story)
- Source: dev/reviews/wording-review.md W4, W6; the Gotcha added in notion-work-track SKILL.md (the work item template usually takes ID 1)
- Problem: "and the default template (this run used the older `template_id`). Answer:" "the older `template_id`" names no older thing (a key, a call, or an id), and an agent may think it should send `template_id`. The real difference is the run's IDs: the recorded run shows IML-1 for the first item, which the new Gotcha (the template usually takes ID 1) would not give.
- Fix: Replace "and the default template (this run used the older `template_id`). Answer:" with "and `\"template\":{\"type\":\"default\"}`. This run was recorded before database templates, when the work item template was a plain page that took no ID, so its first item got ID 1. Now the work item template usually takes ID 1, so the first real item is usually 2. Answer:"

### 19. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-find/references/queries.md (line 184)

- Check: W3 and W4 (vague words)
- Source: dev/reviews/wording-review.md W3, W4; workspace.md ("A new card the owner makes"); test record: a card left untitled stays hidden by the filter
- Problem: "A card the owner opened and left without a title is hidden from every view." "opened and left" does not say what the owner did, and the rule depends on the empty title, not on opening. "every view" is wider than the toolkit's Work Items views, which hold the filter. Line 193: "Report each one left" uses "left" as a saying for "that remains".
- Fix: Line 184: replace "A card the owner opened and left without a title is hidden from every view." with "A card the owner made and gave no title is hidden from every Work Items view the toolkit made." Line 193: replace "Report each one left" with "Report each card that remains".

### 20. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/workspace.md (line 137)

- Check: W6 (no repeated rule in the same file; no sentence that would not change what the agent does)
- Source: dev/reviews/wording-review.md W6
- Problem: The same rule is in this file twice: lines 33-38 ("so every Work Items view and query leaves out rows with an empty title") and lines 137-140 ("Every Work Items view also leaves out rows with an empty title (...), which hides the work item template."). The last sentence, "A new card the owner makes opens in a side panel, so it stays in view while he types its title.", explains what happens and changes nothing the agent does.
- Fix: Replace lines 137-140 with: "Each Work Items view's filter holds `{\"property\":\"title\",\"title\":{\"is_not_empty\":true}}`, for the reason given under \"What a project holds\"." (The filter text is kept; the reason stays once.)

### 21. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/SKILL.md (line 132)

- Check: W7 (one name for one thing)
- Source: dev/reviews/wording-review.md W7
- Problem: This change renamed "work item template page" to "work item template" everywhere else (workspace.md last table row: "the views inside the work item template"), but this References row still says "Building the work item template page's views." for the same files (20 to 23). Two names for one thing in one skill.
- Fix: Replace "Building the work item template page's views." with "Building the work item template's views."

### 22. dev/build-shared/work-item-format.md (line 373)

- Check: W7 (one name for one thing; text outside the changed lines, made stale by this change)
- Source: dev/reviews/wording-review.md W7; AGENTS.md Rules, "Shared texts"
- Problem: Not in the diff, but this change makes it wrong: the Notion column of section 10 says "A page in the project's Work Items database, made from the work item template page". Notion work items are now made from the Work Items database's default template, not from a page. Every other file now says "work item template".
- Fix: In the source, replace "made from the work item template page" with "made from the work item template (the Work Items database's default template)". Then copy the source over every copy (`grep -rl 'dev/build-shared/work-item-format.md' plugins` lists them: the .shared-skills copies and the local-work and github-work copies; this commit has no sync tool, so copy by hand) and run `node dev/tools/check-skills.mjs`, which fails when a copy differs from its source.

### 23. plugins/toolkit/skills/project-setup/references/notion.md (line 50)

- Check: W7 and W8 (text the agent says to Mike) with best-practices P6 (his yes must be to the real job)
- Source: dev/reviews/wording-review.md W7, W8; dev/reviews/best-practices-review.md P6; notion-work-track setup.md "Building the templates" steps 1, 9, and 11; notion-memory-save setup.md "Building the memory part of a template" step 6
- Problem: The question reads: "Your Projects database has no Toolkit V2 templates yet. You make three empty templates with a few clicks, and I fill them; ...". (1) "Toolkit V2 templates" was the name of the removed page; the templates are now "Project: work and memory" and so on, so he cannot match the name to anything. (2) The real job is larger than "three empty templates with a few clicks": three templates in the Projects database (step 1), one template in the Work Items database of each of the two work templates (step 9), three \"Set as default\" choices, and the page layout of the databases in each template (step 11 and the memory step 6). He says yes to a smaller job than he is then asked to do. (3) "asked when they do not exist yet" does not cover one or two missing templates (see the setup.md line 40 finding).
- Fix: Replace lines 50-55 ("- The three project templates ... Go ahead?\"") with: "- The three project templates in his Projects database are built once per workspace, the first time any project needs them. Building them is its own question, asked when any of the three does not exist yet: \"Your Projects database has no project templates yet. I need you to make them in the Notion app: five empty templates (three in your Projects database, and one in the Work Items database of each template that tracks work), three choices of 'Set as default', and the page layout of the databases inside the templates. I give you the clicks in small groups and fill in everything else. Then every Notion project, and every card you make with New, starts from them. Go ahead?\" When only some are missing, say which ones and ask only for the clicks for those."

### 24. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/items.md (line 334)

- Check: Best-practices anti-pattern "written nowhere it will read at the right moment" (and a coverage lost by the edit)
- Source: dev/reviews/best-practices-review.md anti-patterns; test record "Database templates test" follow-up (a card copies every property value of its template; the build sets none) on branch worktree-notion-work-tracker; the old text of this section (git show 169bbc8)
- Problem: "A card the owner makes with \"New\" or \"+ New page\" gets the work item template by itself." It gets the sections, but not the properties that "A new work item" sets (Stage, Type, Priority, Waiting on, the approvals "no", Delivery "not-offered"), because the build does not put values on the template. The line "Wait for it, set any empty properties to the defaults of \"A new work item\", and add a history row" now follows the PATCH for an empty page, so it covers only that route. Before this change the same lines covered every hand-made card. The most common hand-made card now never gets its properties or its history row, and the "fewer than five blocks" test does not catch it.
- Fix: Replace lines 334-346 with: "A card the owner makes with \"New\" or \"+ New page\" gets the work item template's sections by itself. Its other properties are empty unless the template holds a value, so its Stage is empty. A page he made with \"Empty\" in the New menu, or made before the project had a default template, has an empty body (fewer than five blocks). Give such a page the default template (its properties are kept): read the id of the template with `is_default` true in the Work Items templates list (`ntn-basics.md`, \"Database templates\"), then:\n\n```bash\nntn api v1/pages/<page-id> -X PATCH -d '{\"template\":{\"type\":\"template_id\",\"template_id\":\"<default-template-id>\"}}' < /dev/null\n```\n\nWait for it. Then, for every card made by hand, set any empty properties to the defaults of \"A new work item\" and add a history row: \"Made in Notion by hand.\" (for a page you gave the template: \"Made in Notion by hand; the template was filled in.\")." Optional (Mike's choice, test in the test area first): put those defaults on the work item template so Notion fills them on every New card.

### 25. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-find/references/queries.md (line 189)

- Check: The file's own rule (line 23: "Every query leaves out archived items unless the owner asks for them") and P6 (Mike only decides)
- Source: queries.md lines 23-24; dev/reviews/best-practices-review.md P6
- Problem: The "Cards with no title" query filters only on an empty title, and prints only Notion's internal id and the number. (1) It does not leave out archived rows, but the advice is to ask the owner "to name it or archive it". An archived card still matches, so it is reported again in every status report and archiving never clears it. (2) The card is hidden from every view, so Mike has no way to open it and see what it is before he decides.
- Fix: Replace the first command (line 189) with: ntn api v1/data_sources/{{WORK_ITEMS_DS}}/query -d '{"filter":{"and":[{"property":"Work item","title":{"is_empty":true}},{"property":"Archived","checkbox":{"equals":false}}]}}' < /dev/null | jq -r '.results[] | "\(.id)\t\(.properties.ID.unique_id.prefix)-\(.properties.ID.unique_id.number)\t\(.url)"'  Keep the templates command. On line 193 change the example to ("A card with no title, IML-6: <link>").

### 26. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 191)

- Check: Best-practices anti-pattern "written nowhere it will read at the right moment"
- Source: setup.md "Recording the links in PROJECT.md" (line 109) and "Bringing a project up to the current template" step 5; project-setup references/update.md and notion.md (no step updates an older Notion block); dev/build-shared/notion/notion-access.md "Where the project's Notion links are"
- Problem: Step 5 says "The project templates in the Projects database. Bring the three up to date the same way". That needs the Projects data source id, which only new projects record ("- Projects database: data source <id>"). An older project's PROJECT.md block still has "- Work item template page: <id>" and "- Templates page: <id>" and no Projects line, and no step in the update flow changes the block. On "update the toolkit" the agent has no written way to get the id, and the old lines point at pages that are no longer used.
- Fix: Replace step 5 (lines 191-192) with: "5. **The project templates** in the Projects database. Its data source id is on the \"Projects database\" line of the Notion block in `PROJECT.md`. When the block has none (an older project), read it from the project page's parent (`ntn api v1/pages/<project-page-id> < /dev/null | jq -r .parent.data_source_id`), add the line `- Projects database: data source <id>`, and remove the block's \"Work item template page\" and \"Templates page\" lines. When the parent is a page, ask the owner which Projects database holds the templates. Then bring the three templates up to date the same way, so new projects start current." Also in `dev/build-shared/notion/notion-access.md` ("Where the project's Notion links are") change "the project page, each database and data source, the \"Current state\" page" to "the project page, each database and data source, the Projects database, the \"Current state\" page", and copy it over its five copies.

### 27. plugins/toolkit/skills/project-setup/assets/.skill-sets/notion-work/notion-work-track/references/setup.md (line 210)

- Check: P6 (exact clicks, no guessing) and consistency with step 9 of the same section
- Source: setup.md step 9 (\"Set as default\" → \"All views\"); Notion release notes 2022-08-11 (Set as default asks whether the default applies to the current view or the whole database)
- Problem: Step 1 gives the clicks as '"…" beside "Project: work and memory" → "Set as default".' and stops. Notion then asks whether the default applies to the current view or the whole database. Step 9 names the choice ("→ \"All views\""), but step 1 does not. If Mike picks the current view, "New" from his other Projects views does not use the template.
- Fix: Lines 210-211: replace '→ "…" beside "Project: work and memory" → "Set as default".' with '→ "…" beside "Project: work and memory" → "Set as default" → "All views".'

## Dropped

- Finding 14 (setup.md line 20, "the same"): the line is a reason, not an instruction, and changes nothing the agent does. The claim is true for what it describes (database templates behind "New"); the proposed rewrite swaps a rationale for a mechanism, which is taste.
- Finding 19 (notion.md line 63, "its id"): the next steps find the Projects data source id and cannot be read as finding a template id, so an agent cannot act differently. Pronoun nit only.
- Finding 20 (interview.md line 147, "they"): "when they do not exist yet" is true of this project's pages by definition, so only the templates reading makes sense. One workable reading, no different behavior.
- Finding 40 (SKILL.md line 98 Gotcha): the record shows a template filled with template_id is a row; it does not show that a template built the new way (replace_content, step 9) is not a row in a project copy. The Gotcha says "usually", and the action (leave out empty-title rows) is the same either way. The proposed rewrite would state a cause the record has not shown for project copies. Worth one check in the test area, not a text defect.
- Finding 41 (items.md line 336, use {"type":"default"} in the PATCH): an optimization, not a defect. The record has tested "default" only on page create, not on PATCH of an existing page, and the finding admits it is untested. Drop unless it is tested first.
- Finding 43 (plugin.json version still 0.4.8): the AGENTS.md rule is real, but the project raises versions in a separate "Release x.y.z" commit by the main session (git log: 0.4.5 to 0.4.8 all this way). Raising it on this side branch would collide with the next release on claude/v2-build. Reminder for the merge: both toolkit manifests and metadata.version in .claude-plugin/marketplace.json, then "update the toolkit" in projects.
- Finding 44 (test record sections missing on this branch): true (grep finds none of "Database templates test" or "Which fill makes a template a row" in this branch's dev/test-runs/notion-skill-sets.md; they are on branch worktree-notion-work-tracker, commits 9b66d08 to 5292312, with the tools in dev/test-runs/notion-skill-sets-tools/), but it is merge order, not a defect in the edits. Note the review task's cited record path does not hold those sections on this branch. Merge worktree-notion-work-tracker with or before this branch.
- Duplicate of kept finding on setup.md line 48: finding 33 / setup.md line 49 "Notion root" sentence (same sentence).
- Duplicate of kept finding on workspace.md line 23: finding 25 / workspace.md line 24 (same line; the proposed fix with a dated "made before 2026-10-01" note adds a story and a case no project is known to have).
- Duplicate of kept finding on notion.md line 8: finding about the list of calls (same line).
- Duplicate of kept findings on the Cards with no title trigger (SKILL.md line 30): the overlap-hand-off finding on SKILL.md line 30 and the P6 finding on items.md line 348 are the same defect.
- Duplicate of kept findings on the "always leave out" rule (queries.md line 24 and SKILL.md line 45): the overlap finding on SKILL.md line 45 and the P1 finding on queries.md line 56 (the contradiction part) are the same defect; the board-query part is kept separately.
- Duplicate of kept finding on setup.md line 148: the finding citing "Never remove, rename, or retype anything" (merged into it).
- Duplicate of kept findings on setup.md line 40: the best-practices version of the partial-templates gap (merged into it).
