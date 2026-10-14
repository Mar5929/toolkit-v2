# TKV-79 final skill scores

The final 26 units score **31–37 out of 40** under one rubric, with a mean of **34.6** and median of **35**. The strongest results are short, explicit procedures with preserved approvals. The remaining weaknesses are instruction load, repeated record-policy text, and owner decisions that the implementation correctly left unresolved.

This source review uses the integrated tree at **46aa71c4**, branch `codex/tkv-79-phase-7`, inspected in `/Users/michaelrihm/Projects/toolkit-v2/.claude/worktrees/tkv-79-review-fixes` on 2026-10-13. It includes the retirement-routing and native-loader fixes after phase 6. It does not approve a merge or mark a work item Done.

The earlier six reviewers did not use one calibrated scale. These final scores are not directly comparable with their 21–35 totals, and no numerical improvement is claimed. The scores are editorial judgments, not probabilities, test coverage, or runtime reliability measurements.

## Review scope and method

The unit list is the original list from TKV-79's Notion Notes, supplied by the parent. A setup choice includes its setup references, shipped instructions, templates, and adapters unless another named unit owns them. The local memory skill is separate from its setup/module. Notion memory excludes the separately scored librarian. Shared Notion excludes the separately scored CLI. Salesforce setup/rules/deploy references exclude the three separately scored Salesforce skills. Project-setup means its entry and shared setup references, not every nested choice counted again. Repository records owns its common closing adapter. These boundaries make the grouping reproducible; the original reports did not publish a machine-readable inventory.

The review read entry procedures, relevant installed adapters, setup/update changes, conditional reference routes, preserved template/schema contracts, independent review reports, and representative complete procedures. It inspected source structure and traced search, save, work-item change, source filing, handoff, deploy, and migration cases. It did not perform a fresh sentence-by-sentence official-command audit of every unchanged reference or execute live cloud workflows. The memory implementation was written by this reviewer; its separate independent review is recorded by the work-item reviewer.

## One rubric for all units

Each dimension uses the same five levels: **5** is clear and directly supported, with no material concern in the inspected procedure; **4** is sound with limited remaining excess or polish; **3** works but has a meaningful ambiguity, repetition, or load issue; **2** requires substantial interpretation or routinely conflicts with the intended process; **1** fails the principle or lacks a usable procedure.

| Column | Principle 1.1 point | What the score measures |
| --- | --- | --- |
| Process | 1 | The goal, step order, roles, completion condition, and approval points are clear. |
| Detail | 2 | Commands, IDs, field semantics, and necessary exceptions stay exact; ordinary work remains general. |
| General | 3 | General rules cover the job; a retained special case protects a real edge or distinct owner process. |
| Judgment | 4 | Instructions state goal and process rather than prescribing the agent's reasoning. |
| Limits | 5 | Counts constrain only actual schemas, tool limits, or confirmed process; judgment has no arbitrary quota. |
| Repeats | 6 | Each reader receives needed context without repeating another loaded guide, rule, or procedure. |
| Load | 7 | The job actually opens less supporting text; a split alone does not earn a higher score. |
| Clarity | 8 | A new reader can understand names, references, exact instructions, and the order after one read. |

A long safety reference is not automatically a low score. Distinct verified failures, exact mission strings, owner-defined schemas, and standalone helper/librarian context can require length. A short file is not automatically a high score when its instructions still require every moved reference.

## Scores

| Unit | Process | Detail | General | Judgment | Limits | Repeats | Load | Clarity | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| [Hindsight memory](../../plugins/toolkit/skills/project-setup/choices/memory/hindsight/hindsight-setup.md) | 5 | 4 | 4 | 4 | 5 | 3 | 3 | 4 | **32** |
| [managing-project-memory local version](../../plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/SKILL.md) | 5 | 4 | 4 | 4 | 5 | 3 | 4 | 3 | **32** |
| [sf-component-tracker](../../plugins/toolkit/skills/project-setup/choices/salesforce/files-to-add/.claude/skills/sf-component-tracker/SKILL.md) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **35** |
| [project-setup](../../plugins/toolkit/skills/project-setup/SKILL.md) | 5 | 4 | 4 | 4 | 5 | 3 | 3 | 4 | **32** |
| [GitHub work items](../../plugins/toolkit/skills/project-setup/choices/work-items/github/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md) | 5 | 4 | 4 | 5 | 5 | 3 | 3 | 4 | **33** |
| [Local work items](../../plugins/toolkit/skills/project-setup/choices/work-items/local/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md) | 5 | 4 | 4 | 5 | 5 | 3 | 3 | 4 | **33** |
| [Notion shared setup and rule](../../plugins/toolkit/skills/project-setup/choices/notion-shared/notion-setup.md) | 5 | 4 | 4 | 5 | 5 | 3 | 4 | 4 | **34** |
| [managing-work-items](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/managing-work-items/SKILL.md) | 5 | 4 | 3 | 4 | 5 | 3 | 3 | 4 | **31** |
| [Notion work items](../../plugins/toolkit/skills/project-setup/choices/work-items/notion/files-to-add/.claude/skills/managing-work-items/references/work-tracker.md) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **35** |
| [handoff](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/handoff/SKILL.md) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **35** |
| [Notion memory](../../plugins/toolkit/skills/project-setup/choices/memory/notion/notion-memory-setup.md) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **35** |
| [maintaining-notion-wiki](../../plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/maintaining-notion-wiki/SKILL.md) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **35** |
| [sf-deploy-check](../../plugins/toolkit/skills/project-setup/choices/salesforce/files-to-add/.claude/skills/sf-deploy-check/SKILL.md) | 5 | 4 | 4 | 5 | 5 | 4 | 5 | 4 | **36** |
| [Salesforce setup/rules/deploy reference](../../plugins/toolkit/skills/project-setup/choices/salesforce/salesforce-setup.md) | 5 | 4 | 4 | 5 | 5 | 3 | 4 | 4 | **34** |
| [using-notion-cli](../../plugins/toolkit/skills/project-setup/choices/notion-shared/files-to-add/.claude/skills/using-notion-cli/SKILL.md) | 5 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **34** |
| [sf-data-change](../../plugins/toolkit/skills/project-setup/choices/salesforce/files-to-add/.claude/skills/sf-data-change/SKILL.md) | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | **36** |
| [Local memory setup/module](../../plugins/toolkit/skills/project-setup/choices/memory/local/local-memory-setup.md) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **35** |
| [publish-docs](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/publish-docs/SKILL.md) | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | **36** |
| [Repository records](../../plugins/toolkit/skills/project-setup/choices/memory/repository-records/reference/what-repository-records-add-to-a-project.md) | 5 | 4 | 4 | 5 | 5 | 3 | 4 | 4 | **34** |
| [merge-and-clean-up](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/merge-and-clean-up/SKILL.md) | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | **36** |
| [session-summary](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/session-summary/SKILL.md) | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 4 | **37** |
| [filing-project-records](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/filing-project-records/SKILL.md) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | **35** |
| [pull-latest](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/pull-latest/SKILL.md) | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | **36** |
| [shaping-a-prompt](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/shaping-a-prompt/SKILL.md) | 5 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | **36** |
| [reset-to-remote](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/reset-to-remote/SKILL.md) | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 4 | **36** |
| [braindump](../../plugins/toolkit/skills/project-setup/every-project/.claude/skills/braindump/SKILL.md) | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 4 | **37** |

## Evidence behind the scores

| Unit | Evidence and remaining concern |
| --- | --- |
| Hindsight memory | Version-specific setup and evidence remain long; provider/delivery/survey failures stay distinct. |
| managing-project-memory local version | Conditional finding route retains search/save gates; H8 still says those metadata tags without defining those. |
| sf-component-tracker | Short entry selects four references; tracker flags, destructive lifecycle and manual edge cases stay exact. |
| project-setup | Choice-owned initialization and resources preserve exact configuration; entry and update procedure remain large. |
| GitHub work items | Creation/body/labels/relations remain exact; closing-word safeguard is necessary; first-call instruction load is still broad. |
| Local work items | Fresh whole-file reads and owner folder-change handling remain; status lookup can require several sizable references. |
| Notion shared setup and rule | Exact destination and copied relation checks stay; template setup still repeats explanations across its references. |
| managing-work-items | Hierarchy/edit/helper/failure references are conditional; every turn still loads 2,168-word lifecycle plus selected tracker. |
| Notion work items | Live schema/template owns content; verified properties and exact helper query now have explicit routes. |
| handoff | Standalone verifier evidence and unsaved-content delivery stay; repeated routing is smaller but verifier method remains detailed. |
| Notion memory | Coding-agent capture and selected startup stay separate from librarian filing; scheduler and migration setup remains dense. |
| maintaining-notion-wiki | Operation sequence, writer coordination, metadata, partial recovery and quiet operation are clear; complete published schemas deliberately stay. |
| sf-deploy-check | Short whole-component/target-read/stop sequence preserves stale-tracker and narrow-deploy safeguards. |
| Salesforce setup/rules/deploy reference | Safety remains always loaded; field-specific deploy/data details remain in skills; setup ignore check moved with stable numbering. |
| using-notion-cli | Exact stdin/list/template/page protections remain; timing uses progress, but general access/API prose still mixes reference and procedure. |
| sf-data-change | Complete load/backup/partial-upsert recovery remains exact; permissions route to owner file; operator-facing details remain needed. |
| Local memory setup/module | Choice supplies startup/index and concise project map; finishing values remain exact, while small record-policy repetitions stay. |
| publish-docs | On-demand edit carrying and main-checkout update preserve concurrency and save proofs; native YAML fix verified. |
| Repository records | Shared closing reference preserves local/Hindsight adapters; canonical statuses/marks stay; templates and guides retain repetitions for readers. |
| merge-and-clean-up | Exact PR/head/branch protections remain; credit and queue details move to a reference without early cleanup. |
| session-summary | Short recap entry and neutral example preserve exact status vocabulary and open-work offer; formatting is intentionally prescriptive. |
| filing-project-records | Record scope routes to project guide; source invariants and ID reservation/save availability remain exact. |
| pull-latest | Complete step instructions preserve chosen remote, shared-checkout safety, dirty-work stops and conflict approval. |
| shaping-a-prompt | Small interview sequence preserves deliverable choice and separate execution; goal/assumption coaching remains owner-requested process. |
| reset-to-remote | Owner reviews concrete reset plan; ignored/local data and other sessions stay protected; package-manager judgment replaces table. |
| braindump | Complete playback steps preserve read/write stop, exact dictated facts, corrected-part reapproval and scope. |

The full source size of a unit is not its per-job load. For example, managing-work-items has 25,316 words across 23 Markdown files, while its entry is 710 words and the always-required lifecycle reference is 2,168. A simple lookup still loads that lifecycle and the selected tracker; this explains its Load score of 3. Work hierarchy, small-item eligibility, editing, helper startup, and save reporting are now conditional.

The local memory skill has 14,190 words across 13 files, but finding no longer requires the 1,204-word retention/cleanup process. Its 447-word entry routes storage access and finding/searching; a save still opens the retention process and saving procedure because authorization, source evidence, corrections, and read-back are needed. These are source-route measurements, not observed token totals from a host session.

## Other guiding principles

**S** means the inspected source conforms. **R** means a remaining ambiguity or dependency prevents a complete conformity verdict. **L** means official/platform evidence is limited; it is not a confirmed contradiction. Principle 9 is assessed separately from the eight-point total. Native discovery is stronger evidence for skill/front-matter support than for a live service's schemas or behavior.

| Unit | 3: any project | 5: selected choices | 6: exact choice steps | 7: owner process | 9: official/native mechanisms |
| --- | --- | --- | --- | --- | --- |
| Hindsight memory | S | S | S | S | L |
| managing-project-memory local version | S | S | S | R | S |
| sf-component-tracker | S | S | S | S | S |
| project-setup | S | S | S | S | S |
| GitHub work items | S | S | S | S | L |
| Local work items | S | S | S | S | S |
| Notion shared setup and rule | S | S | S | S | L |
| managing-work-items | S | R | R | R | S |
| Notion work items | S | S | S | S | L |
| handoff | S | S | S | S | S |
| Notion memory | S | S | S | S | L |
| maintaining-notion-wiki | S | S | S | S | L |
| sf-deploy-check | S | S | S | S | L |
| Salesforce setup/rules/deploy reference | S | S | S | S | L |
| using-notion-cli | S | S | S | S | L |
| sf-data-change | S | S | S | S | L |
| Local memory setup/module | S | S | S | S | S |
| publish-docs | S | S | S | S | S |
| Repository records | S | S | S | S | S |
| merge-and-clean-up | S | S | S | S | S |
| session-summary | S | S | S | S | S |
| filing-project-records | S | S | S | S | S |
| pull-latest | S | S | S | S | S |
| shaping-a-prompt | S | S | S | S | S |
| reset-to-remote | S | S | S | S | S |
| braindump | S | S | S | S | S |

Installer catalogs legitimately name choices while asking the owner to select them. Principle 5 applies to the runtime text a configured project receives; it does not require hiding the installer catalog. Hindsight's owner-selected shared service is not a named-project dependency, but applying its measured profile to another service remains conditional.

Principle 9 source alignment was checked against [Claude Code skills](https://code.claude.com/docs/en/skills), [skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude Code memory](https://code.claude.com/docs/en/memory), [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Codex hooks](https://learn.chatgpt.com/docs/hooks), [Notion CLI](https://developers.notion.com/cli/get-started/overview), [Notion API](https://developers.notion.com/reference/intro), [Salesforce Flow tests](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_flow_run_test.html), [Hindsight configuration](https://hindsight.vectorize.io/developer/configuration), and [Hindsight models](https://hindsight.vectorize.io/developer/models). External-service units remain L because this turn did not prove every unchanged command, live schema, patch version, scheduler, or provider behavior. Their instructions generally require those checks before acting.

## Remaining owner questions and retained safeguards

- **C2:** the central setup offer and Hindsight's literal default-question wording still differ. The rewrite preserved the two exact owner-facing strings instead of selecting a new requirement.
- **H8:** the local skill still says to maintain those metadata tags without identifying those tags in that sentence. Record-format.md defines actual fields, but the owner-written sentence's intended reference remains unclear.
- **A5:** shared Designing still asks for official platform skills named in root AGENTS.md, while the Salesforce choice is the one that supplies such a list. A general platform route or choice-owned step needs the owner decision already identified in the proposal list.
- **C14:** Refining Requirements retains one question per reply, while the output style groups questions at the end. The exact interview rule remains pending the owner's choice.
- **J5:** deploying retains a humanizer dependency that setup does not conclusively establish. Preserve the owner’s chosen tool contract until its setup expectation is decided.
- **C18:** the product setup document still calls the update procedure undecided. Implementation of the authorized plan does not settle the separate documentation/approval status by itself.

D50's complete schema inventories remain because a published cloud librarian cannot depend on local setup files. E6's distinct Hindsight failure limits remain because processing success, raw retrieval, generated summaries, host delivery, scheduled refresh, and current accuracy are different checks. E1's manual-deploy examples preserve distinct assignment, migration, scheduling, dependency, backfill, and rollback protections. D20's duplicated MAIN command remains necessary when either local choice is installed on its own. These are deliberate retained safeguards, not unresolved rewrite failures.

## Root setup review and verification limits

The root setup review found one introduced routing issue: moving out of Hindsight did not route to its opt-in retirement step. The parent corrected shared update to prepare source retirement and destination import, then apply retirement only after the verified, owner-authorized move. Hindsight's choice reference now has a separate retirement heading. The fix was read again in 46aa71c4; no unresolved root process-loss finding remains from the inspected setup/finishing/update/hook changes.

The parent reported native CLI samples for version 0.9.91: only toolkit:project-setup is exposed by the plugin in a blank project; the assembled local project loads all 11 expected skills including publish-docs; both hosts show startup and prompt markers, read owner/evaluate instructions and the lifecycle, and preserve owner-only Done. The native loader/defaultPrompt warnings are resolved. These are finite CLI samples, not desktop coverage, sustained behavior, or live-service proof. Additional compaction/helper evidence belongs in the parent verification report when completed.

This worker ran whole-baseline diff checking, inspected old/new source routes, exercised scratch memory copies and exact-ID search/read-back, and independently reviewed shared/Salesforce procedure changes. The parent owns integrated marketplace/plugin checks and scratch host tests. No live Salesforce deploy, Notion migration/librarian write, Hindsight save/configuration change, GitHub merge, or default-branch merge was performed by this scoring review.
