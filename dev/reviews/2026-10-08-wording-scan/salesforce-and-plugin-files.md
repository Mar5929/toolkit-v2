# Wording scan: salesforce-and-plugin-files

Scope: the Salesforce setup folder, the `writing-harness-files` skill (without its copy of the writing rule), the description texts of the five plugin and marketplace files, and the owner-facing and agent-facing strings of the `workstreams` mod. Read on 2026-10-08 from the `wording-scan` worktree.

Path shortcuts used below:

- `SF/` means `plugins/toolkit/skills/project-setup/assets/salesforce/`.
- `WHF/` means `plugins/toolkit/skills/writing-harness-files/`.
- `REG` means `plugins/workstreams/hooks/register.tsx`.

## Files read

Counts are High / Medium / Low. A file that is the owner's own text shows "questions" instead of findings.

| File | Verdict | H / M / L | Biggest problem |
| --- | --- | --- | --- |
| `SF/.claude/rules/check-deployment-contents.md` | small fixes | 0 / 2 / 0 | "A tracker" has two possible meanings; the rule stops for "unrelated change" but the skill also stops for "not ready" |
| `SF/.claude/rules/component-tracker.md` | small fixes | 0 / 1 / 1 | Never says what the component tracker or an org flag is |
| `SF/.claude/rules/dependency-graph.md` | small fixes | 0 / 4 / 2 | Opens without saying what an "edge list" is; "turn it back on" has no how |
| `SF/.claude/rules/permissions-source-control.md` | small fixes | 0 / 4 / 3 | "Receipt", "verify clean", and "click Recalculate" (who clicks) are unclear |
| `SF/.claude/rules/project-file-locations.md` | small fixes | 0 / 1 / 2 | The folder mapping is one overloaded sentence |
| `SF/.claude/rules/record-deployment-steps.md` | clear as it is | 0 / 0 / 1 | None worth fixing |
| `SF/.claude/rules/salesforce-agent-permissions.md` (new today) | small fixes | 0 / 4 / 2 | One bullet holds four rules; "Ask first" and "Confirm with the owner first" read as one thing |
| `SF/.claude/rules/salesforce-delivery.md` | small fixes | 0 / 2 / 0 | "Never write a record into a template" contradicts the master manifest that lives in a template folder |
| `SF/.claude/rules/salesforce-org-safety.md` (owner's, cut down today) | questions only | 4 questions | See "Questions for the owner" |
| `SF/.claude/rules/salesforce-project.md` | small fixes | 0 / 2 / 1 | The table column is called "Command" but holds pointers to rules |
| `SF/.claude/skills/sf-component-tracker/SKILL.md` | needs a rewrite | 0 / 10 / 6 | "Step 1 to 4" headings are not a sequence; "master manifest" is never defined; two meanings of "tracker" |
| `SF/.claude/skills/sf-data-change/SKILL.md` | small fixes | 0 / 5 / 3 | A line lets the owner's file override the table, which could be read to open production |
| `SF/.claude/skills/sf-deploy-check/SKILL.md` | small fixes | 0 / 3 / 3 | The long phrase "outside the intended scope or not ready" repeats five times |
| `SF/.claude/skills/sf-architect-solutioning/SKILL.md` | could not read | n/a | This file is not in this worktree (the skills folder holds only `sf-component-tracker`, `sf-data-change`, and `sf-deploy-check`) |
| `SF/.claude/protected-orgs.json` (comment text) | small fixes | 0 / 2 / 2 | The value "ask" for `unknownOrgAction` does not ask in this project |
| `SF/delivery/deployments/full-project-deployment-template/manual-steps.md` | small fixes | 0 / 1 / 0 | Three names for one manifest; the same removal instruction twice |
| `SF/delivery/deployments/work-item-deployment-template/DEPLOYMENT-RECORD.md` | small fixes | 0 / 1 / 1 | "Hitchhiker review" is explained nowhere |
| `SF/delivery/deployments/work-item-deployment-template/manual-steps.md` | small fixes | 0 / 0 / 1 | "link to the same change" is vague |
| `SF/delivery/migrations/area-template/DATA-AREA-TEMPLATE.md` | clear as it is | 0 / 0 / 0 | None |
| `SF/delivery/migrations/area-template/FIELD-MAPPING-TEMPLATE.md` | clear as it is | 0 / 0 / 1 | Guide comment is one dense block |
| `SF/delivery/migrations/area-template/TRANSFORMATION-RULES-TEMPLATE.md` | clear as it is | 0 / 0 / 0 | None |
| `SF/delivery/releases/release-cutover-template/CUTOVER-PLAN.md` | clear as it is | 0 / 0 / 1 | "where final operating ownership lands" |
| `SF/delivery/releases/release-cutover-template/RELEASE-NOTES.md` | clear as it is | 0 / 0 / 0 | None |
| `SF/tools/kb/README.md` | small fixes | 0 / 8 / 5 | "The reader" is a made-up word; history about "the project this was built in"; two lines disagree on committing output |
| `SF/tools/permissions/PERMISSIONS-RUNBOOK.md` | small fixes | 0 / 9 / 4 | Points to a file that exists nowhere; "this model" ships into projects; sections out of the order a reader needs |
| `SF/tools/permissions/README.md` | small fixes | 0 / 2 / 0 | "This model has no connected Salesforce org" ships into the project |
| `WHF/SKILL.md` | small fixes | 0 / 4 / 2 | The "owner's yes" precondition comes after step 8; "That file" points at the wrong file |
| `WHF/references/official-pages.md` | clear as it is | 0 / 0 / 3 | Minor repeats |
| `WHF/references/checklist.md` | small fixes | 0 / 4 / 4 | Bullets that give a fact with no instruction; one sentence with no actor |
| `WHF/references/rewrite-steps.md` | small fixes | 0 / 3 / 4 | The ", so" instruction cannot be followed by a stranger; "These" with no noun |
| `WHF/references/writing-rule.md` | not reviewed | n/a | A copy of the standard; reviewed at its source |
| `plugins/toolkit/.claude-plugin/plugin.json` (description) | small fixes | 0 / 1 / 0 | "model files" and "their hooks"; no mention of the second skill |
| `plugins/toolkit/.codex-plugin/plugin.json` (descriptions) | small fixes | 0 / 1 / 1 | "model project" and a three-idea sentence about moving a project |
| `plugins/workstreams/.claude-plugin/plugin.json` (description) | small fixes | 0 / 0 / 1 | "state" is not explained |
| `.claude-plugin/marketplace.json` (descriptions) | small fixes | 0 / 2 / 0 | The toolkit description differs from the plugin's own; "steers" |
| `.agents/plugins/marketplace.json` | clear as it is | 0 / 0 / 0 | The file holds no description text |
| `REG` (agent instruction, tool texts, panel words) | small fixes | 0 / 4 / 3 | The instruction is one paragraph of about 150 words; "Done today" is wrong |

Totals: High 0, Medium 80, Low 58. Every Low finding is listed, not only three per file.

## Questions for the owner

These are in text that is the owner's own. No rewrite is proposed.

1. `SF/.claude/rules/salesforce-org-safety.md:22`. "Never add a production username or alias to `neverProtect` or to any sandbox allow-list." The file `.claude/protected-orgs.json` holds `alwaysProtect` and `neverProtect` and no sandbox allow-list. Which list does "any sandbox allow-list" name? Standard: "Words and names", "Use the exact name the system uses for a thing".
2. `SF/.claude/rules/salesforce-org-safety.md:43`. "Aimed at production or an unclassified org, it asks by default; `"action": "deny"` in `.claude/protected-orgs.json` blocks." In the shipped `protected-orgs.json`, `action` is already `deny`, so for a project set up from the toolkit the guard blocks and never asks. A reader who stops at the first half expects a question. Should the line say that the shipped setting is `deny`? Standard: "Sentences", "Put the condition before the action".
3. `SF/.claude/rules/salesforce-org-safety.md:3`. "Applies to every agent and subagent." Elsewhere the toolkit says "helper agent". Should the word match? Standard: "Words and names", "use the same name every time".
4. `SF/.claude/rules/salesforce-org-safety.md:1-9`. The file opens with "Three places, each with one job" and does not say what the file is for. Would the owner accept an opening such as "This rule holds the limits that apply to every agent in every Salesforce org of every project"? Standard: "Extra rules for documents", "Open the document with what it is for".

The skill `sf-architect-solutioning` is not in this worktree, so no question about it is possible here.

## Findings

### `SF/.claude/skills/sf-component-tracker/SKILL.md`

**F1. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:37, 61, 67, 78`. Headings "Step 1: update the tracker, master manifest, and work-item manifest", "Step 2: per-work-item manifests", "Step 3: types kept out of the manifest", "Step 4: manual steps". Standard: "Extra rules for documents", "Organize the document so that a reader can find a thing from the headings alone". The four sections are not a sequence: step 3 says what to leave out of a file, and step 4 is a separate task with its own triggers. A reader will do them in order. Propose headings: "Update the tracker and the manifests when metadata changes", "The manifest of one work item", "Types that stay out of the manifests", "Manual steps (`manual-steps.md`)". Place "Tracker schema", "Org flags", and "Change Type" before them, because the first section uses all three.

**F2. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:44`. "Add the member under the correct `<types>` block in `delivery/deployments/full-project-deployment-template/package.xml`." The term "master manifest" is used from line 37 on and is never defined. Line 18 calls the same file "project-wide manifest", line 32 says "the project-wide manifest", and the template `manual-steps.md` calls it "project-wide package". Standard: "Words and names", "use the same name every time". Add after line 29: "The master manifest is the file `delivery/deployments/full-project-deployment-template/package.xml`. It lists every component in the project." Then use "master manifest" everywhere.

**F3. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:39`. "Do all three in the same response when any of these happens:" Four events follow, and event 2 changes only the tracker. Standard: "Sentences", "Name who acts". A reader cannot tell which of the three to update for event 2 or 4. Propose: "When one of these events happens, make the updates listed under it in the same response:".

**F4. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:43, 46`. "Add the row if none exists, with the correct flags" and "set that org's flag to `Yes`". The "flag" is a column in the tracker (the "Sandbox" and "Production" columns), and the skill says so first at line 136, ninety lines later. Standard: "Words and names", "explain the made-up word when it first appears". Add in the bullets at line 31: "An org flag is a tracker column named for an org, such as `Sandbox` or `Production`. It holds `Yes` when the component is deployed to that org, and `No` when it is not."

**F5. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:33, 34, 134`. "a short slug from the project's work tracker ... find the item by its ID in the project's work tracker" and, elsewhere, "tracker" alone for the CSV. Two things are called "tracker": the component tracker (a CSV) and the work tracker (where work items are kept). Standard: "Words and names", "Make the subject of ... clear". Use "component tracker" for the CSV every time, and "where the work items are kept" for the other (word list: "tracker, work tracker").

**F6. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:84-92`. The trigger list: "New permission set or permission set group: assign it to users." and "Migration that must clear a field before re-stamping: ordered Pre-deploy steps." Standard: "Sentences", "Never cut a prose sentence down to a label and a colon" and "Give every item in a list the same form". Some items give an action and some give a noun phrase ("ordered Pre-deploy steps"). "re-stamping" and "kickoff script" are not common words. Propose a common form: "When the deploy adds a permission set or permission set group, add a step to assign it to users." "When a migration must clear a field before the data is written again, add ordered Pre-deploy steps." "When a one-time backfill must run after the deploy (Batch Apex, anonymous Apex, or a data load), add a step with the whole script inline."

**F7. Medium (exact string).** `SF/.claude/skills/sf-component-tracker/SKILL.md:105-112`. Step shape table: "Title", "Phase `Pre-deploy`, `Deploy`, or `Post-deploy`", "Status: Not started, in progress, done, or skipped." The templates have no Title or Phase field. The title is the `###` heading, the phase is the `##` heading, and the templates have only Pre-deploy and Post-deploy. Status is `Not started | In progress | Done | Skipped` in both templates and in `salesforce-delivery.md:12`. Standard: "Words and names", "Use the exact name the system uses". Propose: describe the shape as "a `###` heading with the step name under a `## Pre-deploy` or `## Post-deploy` heading, then the fields Order, Owner, Status, Purpose, the numbered actions, and Verify", and write the status values with capitals.

**F8. Medium (exact string).** `SF/.claude/skills/sf-component-tracker/SKILL.md:111, 116`. "Owner | Who runs the step." and "The person or team in each step's Owner field runs that step and updates its status." In every other toolkit file, "the owner" is the project owner who decides. A step Owner field holds a different person. Standard: "Words and names", "Make the subject of ... clear". The field name is an exact string in the templates, so keep it and add one clause at line 111: "Owner (the person or team that runs the step, not the project owner)". Delete line 116, which repeats line 111.

**F9. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:14-29`, with `SF/.claude/rules/salesforce-delivery.md:11`. The tree puts the master manifest and its manual steps inside `full-project-deployment-template/`, and the rule says "Never write a record into a template." The skill tells the agent to edit `full-project-deployment-template/package.xml` on every change. Standard: "Extra rules for documents", "an instruction ... that only makes sense if you know an earlier design" (brief item 6). Add to `salesforce-delivery.md:11`: "The exception is `deployments/full-project-deployment-template/`. It holds the project's master manifest, and you update it in place." Also add one sentence to this skill after line 29 that says the same.

**F10. Medium.** `SF/.claude/skills/sf-component-tracker/SKILL.md:55-59`. "Rules for the master manifest:" followed by four bullets, the last being "These rules apply to every agent and every session." Standard: "Paragraphs and sections", "Leave out a sentence that the reader does not need". The last bullet adds nothing. The label line is not a heading. Make "Rules for the master manifest" an `###` heading and delete the last bullet.

**F11. Low.** `SF/.claude/skills/sf-component-tracker/SKILL.md:35`. "A manifest (`package.xml`) names the components a Salesforce CLI deploy includes." The definition comes after "manifest" has been used four times. Move it to line 10.

**F12. Low.** `SF/.claude/skills/sf-component-tracker/SKILL.md:44, 76, 101`. "Refresh any member counts in its header when that header uses counts." / "a clean `permsets.py preflight`" / "a normal tracker row". Vague words: "refresh", "clean", "normal". Examples: "Update the count in its header comment when the header has one." "after `permsets.py preflight` passes".

**F13. Low.** `SF/.claude/skills/sf-component-tracker/SKILL.md:69`. "cannot be deployed safely by a manifest today". "Today" gives no date. Delete "today" or give the Salesforce release.

**F14. Low.** `SF/.claude/skills/sf-component-tracker/SKILL.md:138, 170-171`. The CSV comma rule appears twice (Notes column and "CSV editing"). Keep one.

**F15. Low.** `SF/.claude/skills/sf-component-tracker/SKILL.md:3`. The description ends with "Update the records in the same response as the metadata change." The description shape in `AGENTS.md` is a verb sentence and a "Use" sentence. It also says "Use before building", while the body says to update in the same response as the change. Pick one.

**F16. Low.** `SF/.claude/skills/sf-component-tracker/SKILL.md:101`. "A step closed as "skipped" costs less than a missed action." Status values are capitalized elsewhere ("Skipped").

### `SF/tools/permissions/PERMISSIONS-RUNBOOK.md`

**F17. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:14-15, 20-22, 195-196`. "The evidence behind every claim is in the toolkit reference `salesforce-permissions-research.md`." The file is not in this repository, in the setup folder, or in a project. Standard: "Extra rules for documents", "When you point to another file, say what is in the file and when to open it." A reader looks for it and does not find it. Propose: either ship the file, or delete the three pointers and keep line 20-22's reasons in the runbook ("Profiles are excluded because a retrieve loses grants and a deploy only adds to the org, so a profile diff cannot show a revocation").

**F18. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:8-9`. "<!-- ... This runbook lives beside the permission tool because this model has no general docs/ folder. -->" In a project, "this model" has no referent. The word list reserves "model" for a language model. Propose: "because the project has no general `docs/` folder."

**F19. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:39-50`. The section "Verified on this org" sits before the procedures it depends on, and "this org" names no org. It also says "whether the counts matched" with no word on which counts. Standard: "Words and names", "Be specific"; "Extra rules for documents", "Put the sections in the order the reader needs them". Rename to "Whether retrieves have been verified for this project's sandbox", move it after "Procedure 3", and write "whether the counts that `verify` prints for the file and for the org match".

**F20. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:103-107`. "**Watch for View All Fields.** When `viewAllFields` is true on an object, Salesforce returns no individual field permissions for it ... Removing View All Fields without first rebuilding the per-field grants from the org takes away every field at once." The bold lead sentence gives no action. Standard: "Sentences", "Say what to do". Propose: "**Do not remove View All Fields before you rebuild the per-field grants.** When `viewAllFields` is true on an object, Salesforce returns no individual field permissions for it, so an empty field list is correct there. Removing View All Fields without first rebuilding the per-field grants from the org takes away every field at once."

**F21. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:125-127`. "A preflight receipt expires after 30 minutes, because the org drifts." The word "receipt" is never explained; "drifts" is figurative. Standard: "Words and names", "Name the thing directly". Propose: "The preflight writes a receipt file, which the deploy guard reads. The receipt is valid for 30 minutes, because the org's permission sets can change in the meantime. A preflight run before a long review does not cover a deploy after it, so run it again." (Check the receipt's location in `permsets.py` before writing the first sentence.)

**F22. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:164-165`. "Treat any permission visible in Setup but absent from a fresh fetch as a new member. Add it here and to `RETRIEVE_BLIND_SPOTS` in the tool." "Member" of what? Propose: "as a new blind spot".

**F23. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:167`. Heading "What "complete" cannot mean". Standard: "Words and names", "Give every heading a name ... that tells the reader what the section covers". Propose: "What a permission set file does not contain".

**F24. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:178-185`. Heading "Structural recommendation" holds two items: how to split permission sets, and a rule on merge conflicts ("Never hand-resolve a git merge conflict ..."). The second is a binding rule hidden under a heading that says "recommendation". Propose headings "How to split permission sets" (first paragraph) and a bullet "Merge conflicts" under "Procedure 2: hand-edit a permission set" (or a new "Procedure 4").

**F25. Medium.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:19-22`. "Profiles are excluded: their retrieve is lossy, their deploy is an overlay, so a profile diff cannot show a revocation." "Overlay" and "lossy" are shorthand. Propose: "Profiles are excluded. A profile retrieve leaves out some grants, and a profile deploy only adds to what the org holds, so a profile diff cannot show a revocation."

**F26. Low.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:69-71`. "Retrieves standalone, compares against the org, lints, sorts into canonical order, and only then writes into ..." No subject. Start: "The command retrieves the permission set on its own, ...".

**F27. Low.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:96-98`. "a Salesforce known issue reports it silently no-oping instead, which then produces a phantom diff". Jargon: "no-oping", "phantom diff". Propose: "Salesforce has a known issue in which the setting is silently ignored, and every later fetch then shows a difference that is not real."

**F28. Low.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:81-83`. "an org drifts, and yesterday's verified file is today's incomplete one." Figurative. Propose: "the org changes, and a file that was complete yesterday can be incomplete today."

**F29. Low.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:182`. "It shrinks the blast radius of a bad deploy". Figurative. Propose: "It limits how much a bad deploy can remove".

**F30. Low.** `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:11-14`. "binding rule", "enforces each gate". "Gate" is not defined. Propose: "The tool `permsets.py` runs each check described here."

### `SF/tools/kb/README.md`

**F31. Medium.** `SF/tools/kb/README.md:127-131, 262, 267-268, 115`. "The reader recognises assignments, DML calls ..." / "the reader's own tally". "The reader" is a made-up word for the part of the tool that parses files. The file map calls the same code "extractors" (line 283) and "the resolver". Standard: "Words and names", "A made-up word ... explain". Use "the extractor" everywhere (or define "reader" once).

**F32. Medium.** `SF/tools/kb/README.md:61, 187`. Line 61: "Nothing the tool writes is committed." Line 187: "Commit those answers". The first sentence is about `out/`, and the second is about `org-knowledge/dependency-crosscheck/`, but the first reads as a rule for everything. Standard: "Words and names", "Be specific". Propose line 61: "Nothing the build command writes into `tools/kb/out/` is committed."

**F33. Medium.** `SF/tools/kb/README.md:131-134`. "How weak this is in practice: in the two orgs this was built against, the reader found 374 Apex write edges reaching 39 distinct fields, against 5,256 field files. It does find them. It does not find most of them." The last two sentences contradict each other on first read, and "the two orgs this was built against" is a history the reader cannot use. Propose: "In a test on two real orgs, the extractor found 374 Apex write edges that reached 39 of 5,256 fields. It finds some writers and misses most."

**F34. Medium.** `SF/tools/kb/README.md:150-155`. "...one org resolved 89.6 per cent and the other 66.0, and the whole difference was the retrieve rather than the reader. Check the resolution rate before reading anything into a gap." The text never says what "resolved" counts or where to read the rate. Propose: "Check the resolution rate (the share of references that point to a component; `reports-<org>.md` prints it) before you read anything into a gap." Verify where the rate is printed before using this.

**F35. Medium.** `SF/tools/kb/README.md:174-179`. "Three scripts ask it and compare. Read-only, and only the third is safe to re-run freely: the first two ask a live org and take about 20 minutes each." "It" means the org, which was last named four sentences earlier; the second sentence has no verb. Propose: "Three scripts ask the org what it thinks depends on what, and compare the answer with the edge list. All three only read. Only the third, `compare_dependencies.py`, is cheap to run again: the first two ask a live org and take about 20 minutes each."

**F36. Medium.** `SF/tools/kb/README.md:192-196`. "**A confirmation rate measures Salesforce, not this tool.**" The bold sentence is a conclusion without its meaning, and the explanation follows. Propose: "**Read the two confirmation rates separately.** One is the share of what these files found that the org also reported. The other is the share of the org's answer that these files found. The two are usually far apart, and mixing them up makes a strong result look weak."

**F37. Medium.** `SF/tools/kb/README.md:305-318`. "Installing it in a project: 1. Copy this folder to `tools/kb/` in the project." Toolkit setup already copies this folder, so a reader in a toolkit project does not know which steps are done. Standard: "Extra rules for documents", "Give each instruction its own sentence ... who does what". Question for the writer to answer before rewriting: which of the five steps does `project-setup` do? Propose a lead sentence "Toolkit setup does steps 1 and 2 (confirm)." and move the section before "Where the org names come from", because a new reader needs it first.

**F38. Medium.** `SF/tools/kb/README.md:222-225`. "Watch `force-app/` itself, never `force-app/main/default`. An earlier version of this hook watched the fixed path, found nothing ... and exited silently at its first check for as long as it was installed." The second sentence is history. Standard: "Paragraphs and sections", "Leave out a sentence that the reader does not need". Propose: "The hook must watch `force-app/` itself and never `force-app/main/default`, because a project that keeps one folder per org has no `force-app/main/default`, and the hook would find no files and do nothing."

**F39. Low.** `SF/tools/kb/README.md:80-84, 273`. "In the project this was built in, one org's edge list came to 213.6 MB ..." and "the project this tool was built in". Four places refer to a project the reader cannot see. Example rewrite for line 80: "Sizes depend on the org. One real org's edge list was 213.6 MB and another's 51.6 MB."

**F40. Low.** `SF/tools/kb/README.md:203-208`. "It fingerprints every file under `force-app/`". "Fingerprints" is jargon. Propose: "It records a hash of every file".

**F41. Low.** `SF/tools/kb/README.md:197`. "There is no second opinion available on most of it." Idiom, and "it" is unclear. Propose: "For most of these connections the org gives no answer to compare with."

**F42. Low.** `SF/tools/kb/README.md:25`. "Python standard library only." Not a sentence. Propose: "The tool uses only the Python standard library, so nothing needs to be installed."

**F43. Low.** `SF/tools/kb/README.md` and `SF/.claude/rules/dependency-graph.md:13`. Commands are written `python tools/kb/...` in the README and the skill `sf-deploy-check`, and `python3 tools/kb/...` in the rule. Pick one (exact string).

### `SF/.claude/rules/dependency-graph.md`

**F44. Medium.** `SF/.claude/rules/dependency-graph.md:7-9`. Heading "Dependency Edge List" and the line "Details and limits: `tools/kb/README.md`, section "What this cannot tell you"." The rule never says what the edge list is. Standard: "Extra rules for documents", "Open the document with what it is for". Propose: "The edge list is a set of JSON files that `tools/kb/build_edges.py` builds from the files under `force-app/`. Each entry says which component reads, writes, or names which other component. Details and limits: `tools/kb/README.md`, section "What this cannot tell you"."

**F45. Medium.** `SF/.claude/rules/dependency-graph.md:22`. "`GRAPH_FRESHNESS=0` turns the Stop hook off. Turn it back on afterwards." The reader is not told what the Stop hook is, or how to turn it on. Propose (confirm the "how" in `graph_freshness_hook.py` first): "Setting the environment variable `GRAPH_FRESHNESS=0` turns off `graph_freshness_hook.py`, the hook that runs when you stop. After you finish, remove the variable so the hook runs again."

**F46. Medium.** `SF/.claude/rules/dependency-graph.md:26`. "Only `pull_org_dependencies.py`, `build_org_catalog.py`, and `compare_dependencies.py` may run, and only `sf data query`." The README says `compare_dependencies.py` contacts no org, and `org_api.py` and `org_catalog.py` also contact one. "May run, and only `sf data query`" can be read as "the only command you may run is `sf data query`". Propose: "Building and querying never contact an org. Of the scripts that contact an org, you may run `pull_org_dependencies.py` and `build_org_catalog.py`, and each of them makes only `sf data query` calls. `compare_dependencies.py` contacts no org."

**F47. Medium.** `SF/.claude/rules/dependency-graph.md:31`. "When you report a cross-check from `compare_dependencies.py`, give both confirmation rates. They measure Salesforce, not this tool." "Both confirmation rates" are not named, and the second sentence cannot be followed without the README. Propose: "give both rates: the share of what the files found that the org also reported, and the share of the org's answer that the files found. `tools/kb/README.md` explains why they differ."

**F48. Low.** `SF/.claude/rules/dependency-graph.md:13, 18, 21`. "Cite it." / "connection it names" / "do the same in the same session". Examples: "Cite it" has no noun (propose "Cite the query output in your answer"); "connection" and "edge" name one thing; "do the same" does not say which of the two branches.

**F49. Low.** `SF/.claude/rules/dependency-graph.md:27`. "Never add an org name to the tool's code." "The tool" is `tools/kb`. Propose "to the code in `tools/kb/`".

### `SF/.claude/rules/permissions-source-control.md`

**F50. Medium.** `SF/.claude/rules/permissions-source-control.md:29`. "A preflight receipt expires after 30 minutes." See F21: "receipt" is not explained. Propose: "A passed preflight is valid for 30 minutes. If more time passes before the deploy, run the preflight again."

**F51. Medium.** `SF/.claude/rules/permissions-source-control.md:14`. "Never commit a file that did not verify clean." The word "verify" is also a command (`permsets.py verify`), and "clean" has no measure. Propose: "Never commit a file that `permsets.py fetch` rejected."

**F52. Medium.** `SF/.claude/rules/permissions-source-control.md:34`. "If the hook matches quoted text in another command, put the text in a file." Missing: what to do with the file. Propose: "If the hook blocks a command because quoted text in it, such as a commit message, contains a deploy command, write that text to a file and pass the file by path."

**F53. Medium.** `SF/.claude/rules/permissions-source-control.md:38`. "If its status is not Updated, click Recalculate on the group in Setup." An agent cannot click in Setup. Question: does the owner click it? If yes, propose "tell the owner to click Recalculate on the group's page in Setup." The runbook (line 150) says only "Fix with Recalculate".

**F54. Low.** `SF/.claude/rules/permissions-source-control.md:16, 18`. "Fetch fresh before every edit." / "after a version bump". "Fresh" is on the word list (P); "bump" is slang. Propose: "Fetch the permission set from the org again just before every edit." / "after you raise the version".

**F55. Low.** `SF/.claude/rules/permissions-source-control.md:23`. "run `permsets.py check`, then `permsets.py tidy`." "Tidy" does not say what it does. Add "(it sorts the file into the standard order)" (runbook line 69: "sorts into canonical order").

**F56. Low.** `SF/.claude/rules/permissions-source-control.md:10`. "A permission set retrieve is complete since API 40.0." Propose: "Since API version 40.0, a retrieve of a permission set returns the whole permission set."

### `SF/.claude/rules/salesforce-agent-permissions.md` (new today)

**F57. Medium.** `SF/.claude/rules/salesforce-agent-permissions.md:6`. "Change this file only when the owner told you to in this session. A choice for every sandbox or scratch org, or for production, is a cell of the table: change the cell, and add the date and the owner's name in it. A narrower choice, such as one org, is a line under "Only in this project". A newer choice replaces the older one that says the opposite." Four rules in one bullet. Standard: "Extra rules for documents", "When one point needs several rules, give the main rule first. Then give each special case on its own line." Propose:
- "Change this file only when the owner told you to in this session."
  - "A choice for every sandbox or scratch org, or for production, is a cell of the table. Change the cell, and write the date and the owner's name in it."
  - "A narrower choice, such as one org, is a line under "Only in this project"."
  - "A newer choice replaces an older one that says the opposite."

**F58. Medium.** `SF/.claude/rules/salesforce-agent-permissions.md:33`. "When two rows fit one action, the narrower row decides." "Narrower" is the core decision rule and has no example. Rows can disagree ("Deploy metadata" is Allowed and "Deploy a profile" is Never). Propose: "When two rows fit one action, the more specific row decides. For example, a profile deploy follows the row "Deploy a profile", not the row "Deploy metadata"."

**F59. Medium.** `SF/.claude/rules/salesforce-agent-permissions.md:12-15, 37-47`. The value "Ask first" and the heading "Confirm with the owner first" name two different checks that look the same. "Ask first" is a question before one command and holds for that one change. "Confirm with the owner first" is a check on whether to start a kind of change. Standard: "Words and names", "use the same name every time" for one thing, and the reverse. Propose the heading "Changes to agree on with the owner before you start", and keep line 39's sentence about the table.

**F60. Medium.** `SF/.claude/rules/salesforce-agent-permissions.md:51`. "A line here wins over the table above." But line 15 says a "Never (fixed)" cell cannot change, and line 8 says no line here changes the safety limits. Standard: "Extra rules for documents", "two lines that say different things". Propose: "A line here wins over a table cell, except in a cell marked "Never (fixed)"."

**F61. Low.** `SF/.claude/rules/salesforce-agent-permissions.md:8`. "That rule also says how this file and the org guard fit together." "Org guard" is not defined here, and "fit together" is vague. Propose: "That rule also says that the org guard, the hook that blocks production commands, stops a command whatever this file says."

**F62. Low.** `SF/.claude/rules/salesforce-agent-permissions.md:3`. The file mixes "you" (line 3-8) and "the agent" (line 51). Use one form.

### `SF/.claude/rules/check-deployment-contents.md`

**F63. Medium.** `SF/.claude/rules/check-deployment-contents.md:6`. "A tracker is a hint, not proof." Which tracker? Propose: "The component tracker (`delivery/deployments/component-tracker.csv`) is a hint, not proof."

**F64. Medium.** `SF/.claude/rules/check-deployment-contents.md:7`. "If a confirmed unrelated change remains, stop." The skill `sf-deploy-check` stops for two cases: an edit outside the intended change, and a feature that is not ready for the target org. The rule names only the first. Standard: "Words and names", "same name every time". Propose: "If you confirm a component or edit outside the intended change, or a feature that is not ready for the target org, stop."

### `SF/.claude/rules/component-tracker.md`

**F65. Medium.** `SF/.claude/rules/component-tracker.md:1-5`. The rule does not say what the component tracker is, and uses "org flags" with no explanation. Propose opening line: "The component tracker is the file `delivery/deployments/component-tracker.csv`. It lists each component the project created or changed, and one column per org (an org flag) says whether the component is deployed there."

**F66. Low.** `SF/.claude/rules/component-tracker.md:3`. "In the same response" appears with "open the skill" and four files in one sentence. Split in two sentences.

### `SF/.claude/rules/project-file-locations.md`

**F67. Medium.** `SF/.claude/rules/project-file-locations.md:7`. "Where a rule or skill names a `delivery/` path, use `engagement/` in such a project, with the folder names it already has: `engagement/deployment/` for `delivery/deployments/` and `delivery/releases/`, and `engagement/data/` for `delivery/migrations/`." Three ideas, and "the folder names it already has" cannot be followed by a stranger. Propose: "In such a project, replace the `delivery/` path that a rule or skill names with the matching `engagement/` folder:" then a list: "`delivery/deployments/` and `delivery/releases/` become `engagement/deployment/`"; "`delivery/migrations/` becomes `engagement/data/`".

**F68. Low.** `SF/.claude/rules/project-file-locations.md:8`. "Never create `delivery/knowledge-base/`." No reason. Standard: "Extra rules for documents", "give the reason in one clause". Needs the owner's reason.

**F69. Low.** `SF/.claude/rules/project-file-locations.md:3`. "Which folder holds a Salesforce project's releases, deployments, and migrations." Not a sentence. Propose: "This rule says which folder holds a Salesforce project's releases, deployments, and migrations."

### `SF/.claude/rules/record-deployment-steps.md`

**F70. Low.** `SF/.claude/rules/record-deployment-steps.md:11`. "When unsure, add the step." No measure for "unsure", but it is judgment on purpose and the skill gives the reason ("costs less than a missed action"). Add the reason in one clause.

### `SF/.claude/rules/salesforce-delivery.md`

**F71. Medium.** `SF/.claude/rules/salesforce-delivery.md:13`. "Which skill to use: `.claude/rules/component-tracker.md` and `.claude/rules/record-deployment-steps.md` for the component tracker, a package file, and manual deploy steps; the `sf-data-change` skill for a production data change, its load file, and its backup; `.claude/rules/check-deployment-contents.md` before a deploy to a shared org." Three items in a label-and-colon line; the label says "skill", and two of three items are rules. Standard: "Sentences", "Give every item in a list the same form". Propose:
- "For the component tracker, a package file, and manual deploy steps, follow `.claude/rules/component-tracker.md` and `.claude/rules/record-deployment-steps.md`."
- "For a production data change, its load file, and its backup, use the `sf-data-change` skill."
- "Before a deploy to a shared org, follow `.claude/rules/check-deployment-contents.md`."

**F72. Medium.** `SF/.claude/rules/salesforce-delivery.md:11`. See F9: "Never write a record into a template" contradicts the master manifest.

### `SF/.claude/rules/salesforce-project.md`

**F73. Medium.** `SF/.claude/rules/salesforce-project.md:8-12`. The table header is "Need | Command", and the cells hold pointers to rules and a runbook. Standard: "Words and names", "Give every file and label a name that says its subject". Propose "Need | Where to look". Heading "Salesforce Project Commands and Skills" would become "Which Salesforce rule or skill wins, and where to look".

**F74. Medium.** `SF/.claude/rules/salesforce-project.md:4`. "its three `sf-*` skills". A count in a rule goes stale when a skill is added, and `AGENTS.md` of the toolkit says to avoid counts. Propose: "its `sf-*` skills".

**F75. Low.** `SF/.claude/rules/salesforce-project.md:3`. "are installed for this project." Passive; who installs? Propose "The toolkit installs Salesforce's official skills ...". (Verify the claim first.)

### `SF/.claude/skills/sf-data-change/SKILL.md`

**F76. Medium.** `SF/.claude/skills/sf-data-change/SKILL.md:18`. "A line there may differ from this table, and then that line wins." The table's Production column says Never, and `salesforce-org-safety.md:14` forbids production data writes in every project. A reader can take this line to mean the owner's file may open production. Propose: "For a sandbox, a line there that differs from this table wins. Production data stays Never, except DevOps Center records, which only the owner's file can open."

**F77. Medium.** `SF/.claude/skills/sf-data-change/SKILL.md:21, 59, 63`. "Step 1: build the handoff", "Step 4: hand over", and the table "Hand-offs". "Handoff" is the package given to the owner, and "Hand-offs" in the table names work another skill does. Also `sf-deploy-check.md:41` uses "Hand-offs" for the second meaning. The word list (row "Hand-offs, hand to") says "Work that another skill does". Propose heading "Other skills for related jobs" in both files.

**F78. Medium.** `SF/.claude/skills/sf-data-change/SKILL.md:23-27`. Items 1 to 5 start with a label and a fragment: "The load file. A CSV with the record `Id` plus every field the change sets ..." / "The success check. The expected row count, ...". Standard: "Sentences", "Never cut a prose sentence down to a label and a colon". Propose: "1. Write the load file: a CSV with the record `Id` and every field the change sets, one row per record, ready to load as it is. Never write a fragment, a sample, or a description."

**F79. Medium.** `SF/.claude/skills/sf-data-change/SKILL.md:56`. A 70-word sentence listing ten things to record. Standard: "Sentences", "Put one idea in a sentence". Propose a list: "Record these in the work item for this change and in the step 4 handoff: the work item, the date, the org, the objects and the records affected, the exact file paths and row counts, the operation, the mappings, the settings, the success check, and the undo steps (or the backup file's path). Write no separate README or other record for the event."

**F80. Medium.** `SF/.claude/skills/sf-data-change/SKILL.md:57`. "Before the first data change in a project ..., put a test `.csv` file ..., check that `git status` lists neither, then delete both files." No reason. Standard: "Extra rules for documents", "give the reason in one clause". Propose: add "This proves that the `.gitignore` files keep data files out of Git." Verify against the template's `.gitignore` before use.

**F81. Low.** `SF/.claude/skills/sf-data-change/SKILL.md:34`. "Fill every target cell on an update, so a restore is complete and a load does not blank fields it should not." Unclear what a "target cell" is. Propose: "On an update, include every field the change may overwrite in the load file, so the backup file can restore all of them."

**F82. Low.** `SF/.claude/skills/sf-data-change/SKILL.md:44, 48`. `prod-backup-<MMDDYYYY>-<slug>/` uses a date form that no other folder uses (`<YYYY-MM-DD>` in releases). Exact string; ask the owner whether to align.

**F83. Low.** `SF/.claude/skills/sf-data-change/SKILL.md:61`. "'You'll need to update those records' is not a handoff." Contraction. Propose: "A reply such as "You need to update those records" is not a handoff."

### `SF/.claude/skills/sf-deploy-check/SKILL.md`

**F84. Medium.** `SF/.claude/skills/sf-deploy-check/SKILL.md:8, 10, 23, 27, 29`. The phrase "a component or edit outside the intended scope, or a feature that is not ready for the target org" (or a shorter form) appears five times. Standard: "Paragraphs and sections", "Leave out a sentence that the reader does not need". Define one name once, "an unwanted shipment", after line 12: "In this skill, an unwanted shipment is a component or edit outside the intended change, or a feature that is not ready in the target org." Use it in lines 23, 27, 29.

**F85. Medium.** `SF/.claude/skills/sf-deploy-check/SKILL.md:28`. "Treat any tracker as a hint, not proof." See F5: which tracker? Propose "Treat the component tracker as a hint, not proof."

**F86. Medium.** `SF/.claude/skills/sf-deploy-check/SKILL.md:21-29`. Steps 1, 3, 4, and 5 give actions, and step 2 states a fact ("the whole current `force-app/` definition ships ..."). Standard: "Sentences", "Give every step in a procedure the same form". Propose: "2. For each component, remember that the whole current `force-app/` definition ships: the label, ..."

**F87. Low.** `SF/.claude/skills/sf-deploy-check/SKILL.md:37-39`. Heading "Why the check ends with an org read", and a paragraph that repeats step 4. Propose: delete, or rename "Why you verify against the org".

**F88. Low.** `SF/.claude/skills/sf-deploy-check/SKILL.md:27`. `python tools/kb/query_graph.py` versus `python3` in the rule (F43).

**F89. Low.** `SF/.claude/skills/sf-deploy-check/SKILL.md:3`. The description is fine; the row "Hitchhiker review" in the deployment record (F94) never links to this skill.

### `SF/.claude/protected-orgs.json` (comment text)

**F90. Medium.** `SF/.claude/protected-orgs.json:11`. `unknownOrgAction`: "Any value other than 'allow' treats the org like production and applies 'action'." and the shipped value is `"ask"` with `"action": "deny"`. Here the value "ask" does not ask; it blocks. Standard: "Words and names", "Be specific". Propose: "Any value other than 'allow' treats the org like production, and the guard then does what 'action' says. In this project 'action' is 'deny', so an org the guard cannot classify is blocked." Compare `salesforce-org-safety.md:43` (question 2).

**F91. Medium.** `SF/.claude/protected-orgs.json:12`. `sandboxAction`: "'ask' = the guard also confirms each one." "Also" has no referent. Propose: "'ask' = the guard asks the owner before each of these, in addition to the rule in `salesforce-agent-permissions.md`."

**F92. Low.** `SF/.claude/protected-orgs.json:11, 13`. "can't be classified (not authenticated yet, sf CLI unavailable)" / "since it's irreversible". Contractions and "sf CLI". Propose: "cannot be classified (for example the owner has not signed in to it yet, or the Salesforce command line is not available)".

**F93. Low.** `SF/.claude/protected-orgs.json:15`. "escape hatch for a known throwaway scratch org". Figurative. Propose: "for a scratch org you know is temporary".

### Delivery templates

**F94. Medium.** `SF/delivery/deployments/work-item-deployment-template/DEPLOYMENT-RECORD.md:23`. "Hitchhiker review | <Pass / Open> | <Link to checked deploy set and target-org read>". "Hitchhiker" is explained nowhere in the toolkit. Standard: "Words and names", "Name the thing directly". The row means the check that `sf-deploy-check` describes (finding components that ride along in a deploy). Propose: "Deploy scope check (`sf-deploy-check`)". Exact string if a person already fills it; ask the owner.

**F95. Medium.** `SF/delivery/deployments/full-project-deployment-template/manual-steps.md:3, 5`. The guide comment says "Delete this guide after filling, or remove this file if there is no full-project cutover", and line 5 says "Remove this manual-steps file during setup if no full cutover is planned; keep the project-wide package as the component inventory." The removal is stated twice, in two forms, and "project-wide package" is a third name for the master manifest (F2). Propose: keep the instruction once, in the comment, and write "master manifest" or "`package.xml`" in line 5.

**F96. Low.** `SF/delivery/deployments/work-item-deployment-template/DEPLOYMENT-RECORD.md:3`. "Delete this guide and example check rows once populated." The rows are prompts, not examples.

**F97. Low.** `SF/delivery/deployments/work-item-deployment-template/manual-steps.md:5`. "The work item and [deployment record](DEPLOYMENT-RECORD.md) link to the same change." Vague. Propose: "Link this file from the deployment record and from the work item."

**F98. Low.** `SF/delivery/migrations/area-template/FIELD-MAPPING-TEMPLATE.md:3`. The guide comment is one block with six instructions. Split into one sentence per instruction (it already is, but the block is 120 words).

**F99. Low.** `SF/delivery/releases/release-cutover-template/CUTOVER-PLAN.md:39`. "where final operating ownership lands". Figurative; the word list marks "lands" as plain-words. Propose: "who is responsible for the release after cutover".

### `SF/tools/permissions/README.md`

**F100. Medium.** `SF/tools/permissions/README.md:5`. "This model has no connected Salesforce org. In a copied project, verify retrieval behavior against that org and fill the runbook before using the tool." This file is copied into the project, where "this model" has no meaning, and "that org" has no antecedent. Propose: "Before you use the tool in a project, run `permsets.py verify` against the project's sandbox, and fill in the section "Verified on this org" of the runbook."

**F101. Medium.** `SF/tools/permissions/README.md:3`. "`permsets.py` is this project's permission set checker." The tool also fetches, sorts, and runs the preflight. Propose: "`permsets.py` fetches, checks, sorts, and runs the preflight for the permission sets of this project."

### `WHF/SKILL.md`

**F102. Medium.** `WHF/SKILL.md:36`. "A project may require the owner's yes before a rule, a skill, or a hook changes. Get that yes before step 5." This precondition comes after step 8. Standard: "Extra rules for documents", "Put the sections in the order the reader needs them". Move it into step 4 (or a new step 1): "Check whether the project requires the owner's yes before a rule, a skill, or a hook changes. If it does, get that yes before step 5."

**F103. Medium.** `WHF/SKILL.md:40`. "...follow [references/rewrite-steps.md] in place of steps 5 to 7. An agent guide is an `AGENTS.md` or a `CLAUDE.md`. That file gives the order of work ..." "That file" can mean the agent guide. Propose: "`references/rewrite-steps.md` gives the order of work, the checks that prove no rule changed, and a prompt for a team that rewrites many files."

**F104. Medium.** `WHF/SKILL.md:20, 22`. Step 2 sub-bullets: "That file names the one for each job." and "...together with the Claude Code skill page and the Codex skill page: https://platform.claude.com/...". Line 20: which file is "that file"? Line 22: the one address after a list of three pages implies it covers all three. Propose line 20: "`references/official-pages.md` names the agent or skill for each job." Line 22: "For a skill, read three pages every time: the skill best practices page (https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), the Claude Code skill page, and the Codex skill page. `references/official-pages.md` gives the last two."

**F105. Medium.** `WHF/SKILL.md:32`. "A small edit gets one reviewer and one read." "Small" has no measure, and "one read" is not an action. Standard: "Words and names", "Be specific"; the toolkit's rule: no limits where the agent judges. Propose: "For an edit that changes no rule and no wording that a tool reads, one reviewer who reads the change once is enough."

**F106. Low.** `WHF/SKILL.md:48`. "A helper does not get the output style that the replies of the main session follow, so the helper has no other writing rules." Three ideas, and "output style" is explained only in the checklist. Propose: "A helper agent does not get the output style, which is a Claude Code setting that shapes the replies of the main session. So the brief is the only place where the helper learns the writing rules."

**F107. Low.** `WHF/SKILL.md:26`. "read two existing files of the same kind". A count where the agent can judge. Propose: "read existing files of the same kind".

### `WHF/references/checklist.md`

**F108. Medium.** `WHF/references/checklist.md:33`. "A personal or project skill named `verify` or `simplify` is run before each commit." No actor, and no reason the reader should care. Confirm against the live page, then propose "Claude Code runs ... before each commit" or delete.

**F109. Medium.** `WHF/references/checklist.md:34`. "Claude Code loads a skill in a `.claude/skills/` folder below the folder a session started in once the agent reads or edits a file there. A copy of a skill kept in a repository as a template is loaded this way." The bullet states a behavior and gives no instruction. Standard: "Sentences", "Say what to do". Propose adding: "So a repository that keeps a skill as a template should turn the skill off in its `skillOverrides` setting."

**F110. Medium.** `WHF/references/checklist.md:59`. "What a hook or a check can enforce goes there, not in a sentence." "There" has no clear referent. Propose: "Put what a hook or a check can enforce in that hook or check, and not in a sentence of the file."

**F111. Medium.** `WHF/references/checklist.md:114`. "Give them the path of the writing rule." "Them" can mean Codex or the helper agents. Propose: "In a Codex session and in the brief of a helper agent, give the path of the writing rule."

**F112. Low.** `WHF/references/checklist.md:28`. One bullet with five sentences, including "Keep it far below the limit". Split with the main rule first, and replace "far below" with the toolkit's own limit (500 characters in `AGENTS.md`).

**F113. Low.** `WHF/references/checklist.md:67, 79`. "it finishes fast" / "the file whose reach matches the purpose". Vague word and figurative word.

**F114. Low.** `WHF/references/checklist.md:132-133`. The Mod section says what a mod is made of but not what it does. Add: "A mod draws a pane or adds a hook inside Claude Code."

**F115. Low.** `WHF/references/checklist.md:141-143`. "Tell the helper to report only on its own part." duplicates "the helper's own part" in line 140.

### `WHF/references/rewrite-steps.md`

**F116. Medium.** `WHF/references/rewrite-steps.md:59`. "Take what the file is for from text that exists, such as the part of a skill's description that follows ', so'." A stranger does not know which description. The toolkit's description shape has no ", so" part. Propose: "State what the file is for in words that already exist, such as the file's description or its opening. When no text says what the file is for, stop and ask the owner. Never invent a goal."

**F117. Medium.** `WHF/references/rewrite-steps.md:46`. "These are not additions: ..." "These" refers to a sentence that ends two lines earlier. Propose: "Do not report these as additions: the opening, ...".

**F118. Medium.** `WHF/references/rewrite-steps.md:53`. Step 9 is one 80-word sentence chain with two jobs: check the file, and report. Standard: "Sentences", "Write steps in the order the reader does them, and give each step its own sentence." Propose splitting into step 9 (check) and step 10 (tell the owner what step 8 of `SKILL.md` asks, and also list: each word replaced and its replacement; each heading renamed; each other file updated; each question that needed a decision).

**F119. Low.** `WHF/references/rewrite-steps.md:25-28`. "the file's word list" and "the shared word list" are two lists with close names. Propose "the file's word list" and "the project's shared word list" with a one-clause difference at line 25.

**F120. Low.** `WHF/references/rewrite-steps.md:17`. "Their wording and their order do not bind you." Figurative. Propose "You do not need to keep their wording or their order."

**F121. Low.** `WHF/references/rewrite-steps.md:23`. "in a few lines of your own". Vague. Propose "in your own words".

**F122. Low.** `WHF/references/rewrite-steps.md:71`. "The prompt is short because it sends each writer to the writing rule and to the steps above." The prompt is 30 lines. Delete the sentence.

### `WHF/references/official-pages.md`

**F123. Low.** `WHF/references/official-pages.md:11`. "these three know nothing about Codex". "These three" points at the three bullets above; name them. 
**F124. Low.** `WHF/references/official-pages.md:12`. Repeats `WHF/SKILL.md` step 3 (live page wins; tell the owner). Delete one.
**F125. Low.** `WHF/references/official-pages.md:36, 37`. Row labels "Any of them" and "What changed lately". Propose "Any kind of file" and "What changed in recent releases".

### Plugin and marketplace descriptions

**F126. Medium.** `plugins/toolkit/.claude-plugin/plugin.json:4`, same text in `plugins/toolkit/.codex-plugin/plugin.json:4`. "Sets up Toolkit V2 in a project, or moves a project from the older toolkit onto it: copies the model files, the chosen work tracking and memory skills, and their hooks." "The model files": the word list says "model" means only a language model, and `AGENTS.md` calls the same files "the starter project". "Their hooks" can be read as hooks of the plugin, but the plugin has none (the Codex long description says so). The description also omits the plugin's second skill. Propose: "Sets up Toolkit V2 in a project, or moves a project from the older toolkit onto it. It copies the project files, the skills for the work tracking and memory the owner chooses, and the hook commands those skills need. A second skill, writing-harness-files, helps write or change skills, rules, and other files that instruct an agent."

**F127. Medium.** `.claude-plugin/marketplace.json:15` against `plugins/toolkit/.claude-plugin/plugin.json:4`. The marketplace entry says "copies the project files, work and memory skills with the selected storage references, and the hooks". The plugin's own description says "the model files, the chosen work tracking and memory skills, and their hooks". Two descriptions for one plugin, in two vocabularies. Standard: "Words and names", "use the same name every time". Use the proposal in F126 in both.

**F128. Medium.** `plugins/toolkit/.codex-plugin/plugin.json:20`. "copies the model project, the skills for those choices, four small hook commands, and their settings into the project." "The model project" (see F126). Propose "copies the starter project files". Also "moves a project that was set up with the older toolkit onto Toolkit V2 from one list the owner approves first": three ideas. Propose: "...onto Toolkit V2. It shows the owner one list of changes first and applies it only after the owner says yes."

**F130. Medium.** `.claude-plugin/marketplace.json:8`. "...one solo developer's projects ... The agent runs the project; the owner decides and steers." "Steers" is figurative, and the sentence adds nothing a plugin chooser needs. Propose: "Toolkit V2: the toolkit plugin, whose project-setup skill sets up and updates a solo developer's projects in Claude Code and Codex, and the workstreams plugin, a side panel for Claude Code that lists the work a project's chats are doing."

**F131. Low.** `plugins/workstreams/.claude-plugin/plugin.json:4`, `.claude-plugin/marketplace.json:20`. "Shows the pieces of work this project's Claude chats report, the chat handling each one, and each chat's state, in a side panel." Three lists in one sentence, and "state" is not explained (the panel shows "Working", "Asking you", "Stopped"). Propose: "Shows a side panel that lists the pieces of work this project's Claude chats report, which chat handles each one, and whether each chat is working, asking you a question, or stopped. Open it with /streams. Claude Code only."

**F132. Low.** `plugins/toolkit/.codex-plugin/plugin.json:28-33`. `defaultPrompt` includes "Toolkit v2", which is a name and not a prompt. Exact string; ask the owner.

### `REG` (exact strings; tests compare several)

**F133. Medium (exact string).** `plugins/workstreams/hooks/register.tsx:43-56`. The instruction every chat reads is one 150-word paragraph with fourteen instructions. "Give the status, and the next step and who does it in one short sentence." can be read as "the status in one short sentence" or "the next step in one short sentence". "Deferred" is tool-loading jargon. Standard: "Extra rules for documents", "Give each instruction its own sentence"; "Sentences", "Put one idea in a sentence". Propose the same rules in short paragraphs:

"Workstream panel: the owner follows his significant pieces of work across his chats in a side panel. A piece of work counts when it is a work item, or a large task that the owner asked for and is following.

Call `mcp__workstreams__report` when you start such a piece of work, when its status changes, before you stop to wait for the owner, and when it is done. If the tool is deferred, load it with ToolSearch first. Do not report the steps inside a piece of work, questions, or small chores. Helper agents do not report.

The owner switches between many chats and needs reminding what each piece of work is, so write for him. The name is a subject line of 8 words or fewer that says what he asked for, in his own plain words. The "about" text is one or two plain sentences, 30 words or fewer, that say what he asked for and why it matters to him. Use no ticket numbers, file names, or technical terms in either. Keep the same name for as long as the work lasts. Give the status. Give the next step and who does it, in one short sentence. Report each piece of work separately. Do not mention the report in your reply."

**F134. Medium (exact string).** `plugins/workstreams/hooks/register.tsx:640`, tested at `register.test.tsx:248`. The panel heading "Done today (n)" lists work finished in the last 24 hours (`DAY = 24 * 60 * MINUTE`), so work finished yesterday afternoon shows as "today". Propose "Done in the last day (n)", and change the test.

**F135. Medium (exact string).** `plugins/workstreams/hooks/register.tsx:295`. The command description "Show the workstreams and chats of this project in a pane" says "pane", and the plugin descriptions say "side panel". Use one word. Also "workstreams" is the panel's word for "pieces of work" and is not defined in the instruction. Propose "Show the pieces of work and chats of this project in a side panel".

**F136. Medium (exact string).** `plugins/workstreams/hooks/register.tsx:260-266, 268-272`. Tool field texts for `name` and `about` repeat parts of the instruction (8 words, 30 words, no ticket numbers). The tool field text and the instruction can drift. Standard: "Paragraphs and sections", "a statement that the same file already made". Keep the limits in the field texts only and let the instruction point to them: "Follow the limits in the tool's field descriptions." This changes the instruction text that tests may compare; check `register.test.tsx` first.

**F137. Low (exact string).** `plugins/workstreams/hooks/register.tsx:101-110`. Time words "min ago", "h ago", "d ago". Abbreviated. Propose "minutes ago", "hours ago", "days ago".

**F138. Low (exact string).** `plugins/workstreams/hooks/register.tsx:367, 371`. "Not saved: only the main chat reports, not a helper agent." Fine in meaning; "main chat" is a term used nowhere else. Propose "Not saved: only the main agent of a chat reports, not a helper agent."

**F139. Low (exact string).** `plugins/workstreams/hooks/register.tsx:214`. "Could not read the chats." No reason or next step. Propose "Could not read the saved chats. Press Refresh to try again."

The panel words "Chat", "Workstreams", "About", "Status", "Next", "Mark done", "Hide", "Dismiss chat", "Collapse", "Expand", "Needs you", "Asking you", "Working", "Blocked", "In progress", and "You said:" are clear. The empty-panel text "No chat in this project has reported yet. A chat shows here after its next message." is clear.

## Patterns

1. **"Tracker" means two things (6 places).** The component tracker (a CSV) and the work tracker (where work items are kept) are both called "the tracker". Examples: `SF/.claude/rules/check-deployment-contents.md:6`, `SF/.claude/skills/sf-deploy-check/SKILL.md:28`, `SF/.claude/skills/sf-component-tracker/SKILL.md:33-34`. Fix: say "component tracker" for the CSV and "where the work items are kept" for the other.
2. **One manifest, three or four names (5 places).** "Master manifest", "project-wide manifest", "project-wide package", "the master". Examples: `SF/.claude/skills/sf-component-tracker/SKILL.md:18, 32, 37`, `SF/delivery/deployments/full-project-deployment-template/manual-steps.md:5`. Fix: define "master manifest" once and use only it.
3. **"This model" and "the model files" where the reader sees a project (4 places).** The word list reserves "model" for a language model. Examples: `SF/tools/permissions/README.md:5`, `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:8-9`, `plugins/toolkit/.claude-plugin/plugin.json:4`, `plugins/toolkit/.codex-plugin/plugin.json:20`. Fix: "the project" or "the starter project".
4. **Pointers to things the reader cannot open (4 places).** `salesforce-permissions-research.md` (twice, and a third time as "the research reference"), "Hitchhiker review", "the project this was built in" (4 times in the `kb` README). Examples: `SF/tools/permissions/PERMISSIONS-RUNBOOK.md:14, 21, 195`, `SF/delivery/deployments/work-item-deployment-template/DEPLOYMENT-RECORD.md:23`, `SF/tools/kb/README.md:80, 131, 153, 273`.
5. **Made-up words with no explanation (7 words).** "Receipt" (preflight), "org flag", "master manifest", "the reader" (kb), "edge list" (rule), "hand-offs"/"handoff", "slug". Examples: `SF/.claude/rules/permissions-source-control.md:29`, `SF/.claude/skills/sf-component-tracker/SKILL.md:43`, `SF/.claude/rules/dependency-graph.md:7`.
6. **A bullet or sentence that holds several rules, without a main rule and special cases (8 places).** Examples: `SF/.claude/rules/salesforce-agent-permissions.md:6`, `SF/.claude/rules/project-file-locations.md:7`, `SF/.claude/skills/sf-data-change/SKILL.md:56`, `plugins/workstreams/hooks/register.tsx:43-56`, `WHF/references/rewrite-steps.md:53`.
7. **Label-and-colon fragments in place of sentences (7 places).** Examples: `SF/.claude/skills/sf-data-change/SKILL.md:23-27`, `SF/.claude/skills/sf-component-tracker/SKILL.md:84-92`, `SF/.claude/rules/salesforce-delivery.md:13`.
8. **A heading that numbers non-sequential sections, or does not say what is under it (6 places).** Examples: "Step 1" to "Step 4" in `sf-component-tracker`, "What "complete" cannot mean", "Structural recommendation", "Salesforce Project Commands and Skills" (the table holds no commands).
9. **A word that names two checks, or a pronoun with two subjects (9 places).** "Ask first" and "Confirm with the owner first"; "Owner" field and "the owner"; "that file" in `WHF/SKILL.md:40`; "them" in `WHF/references/checklist.md:114`; "These" in `WHF/references/rewrite-steps.md:46`.
10. **A rule that is stated in a rule and a skill with different wording (4 places).** "Unrelated change" and "outside the intended scope or not ready" (F64); the status list in lowercase and capitals (F7); `python` and `python3` (F43); the date form in `sf-data-change` (F82). Fix: one source, and the others point to it.

## Layout

### `SF/.claude/skills/sf-component-tracker/SKILL.md`

As it is:
1. Salesforce component tracker
2. Deployment folder
3. Step 1: update the tracker, master manifest, and work-item manifest
4. Step 2: per-work-item manifests
5. Step 3: types kept out of the manifest
6. Step 4: manual steps (`manual-steps.md`)
7. Tracker schema
8. Org flags
9. Change Type
10. One row per component
11. Project-authored only
12. CSV editing
13. Not in the tracker
14. Related rules

Proposed:
1. Salesforce component tracker (opening: what the tracker, the master manifest, and an org flag are)
2. Deployment folder
3. Tracker schema
4. Org flags
5. Change Type
6. One row per component
7. Project-authored only
8. CSV editing
9. Not in the tracker
10. Update the tracker and the manifests when metadata changes
11. The manifest of one work item
12. Types that stay out of the manifests
13. Manual steps (`manual-steps.md`)
14. Related rules

### `SF/tools/permissions/PERMISSIONS-RUNBOOK.md`

As it is: Scope; The two facts everything else follows from; Verified on this org; What the Salesforce CLI will NOT tell you; Procedure 1: bring a permission set into git; Procedure 2: hand-edit a permission set; Procedure 3: deploy to a sandbox; Known retrieve blind spots; What "complete" cannot mean; Structural recommendation; Related.

Proposed: Scope; Why a deploy removes grants (the two facts); What the Salesforce CLI does not tell you; Procedure 1: bring a permission set into git; Procedure 2: hand-edit a permission set (with the merge-conflict rule); Procedure 3: deploy to a sandbox; Whether retrieves have been verified for this project; Known retrieve blind spots; What a permission set file does not contain; How to split permission sets; Related.

### `SF/tools/kb/README.md`

As it is: (opening); Where the org names come from; Build it first; Ask it questions; What this cannot tell you; Checking it against the org's own answer; The automatic freshness check; How it is built, and how to check it; File map; Installing it in a project.

Proposed: (opening); Installing it in a project; Build it first; Query the edge list; What this cannot tell you; Where the org names come from; Checking the edge list against the org's own answer; The automatic freshness check; How it is built, and how to check it; File map.

### `SF/.claude/rules/salesforce-project.md`

As it is: Salesforce Project Commands and Skills; Commands. Proposed: "Which Salesforce rule or skill wins" (the two bullets); "Where to look" (the table).

### `SF/.claude/rules/salesforce-agent-permissions.md`

As it is: What an Agent May Do in Each Salesforce Org; What each value means; Actions; Confirm with the owner first; Only in this project. Proposed: change "Confirm with the owner first" to "Changes to agree on with the owner before you start".

### `WHF/SKILL.md`

As it is: Steps (8 steps, then a one-line precondition); Rewriting a file that exists; Briefing a helper agent; References. Proposed: put the "owner's yes" precondition as step 4 (or before step 1) and keep the rest.
