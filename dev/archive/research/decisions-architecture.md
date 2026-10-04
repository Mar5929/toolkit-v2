# Where decisions live in Toolkit V2

Recommendation for Mike's question of 2026-09-29. Research only: nothing was
built or changed. Paths are relative to
`/Users/michaelrihm/Documents/Projects/toolkit-v2`. `S/` means
`plugins/toolkit/scaffold/model/` (the copy of the model branch
`toolkit-v2/approved-changes`). `efa2440:` means Mike's untouched model
project at that commit. Line numbers are from the working tree on 2026-09-29;
other sessions are still editing some of these files.

## Recommendation

Mike is right: a decision is memory. Every decision a person has made becomes
one memory record of a new type, `decision`. Each record holds an ID such as
D-21, the date, who decided, the reason in that person's words, the options
that were considered, and the list of work items it affects. One command lists
the decisions for one work item, and one command lists every decision grouped
by work item. Both work the same way in all three memory systems (built-in
`.memory/`, Hindsight, Notion) and all four trackers (local, Notion, GitHub,
Jira). The root `DECISIONS.md` is removed from the model.

Four things keep their current home: approval gates stay on the work item,
questions still waiting on Mike stay in the work item or the current focus,
instructions for how the agent works stay rules, and settings a command reads
go in `.toolkit.json`.

The problem that started this question was a missing reason: nobody wrote down
why `DECISIONS.md` was added. So every decision record must carry a labeled
reason, and the commands the agent already runs (approving a design, answering
an open question) create the record. Mike decides now; the build starts after
the current goal's final checklist.

## Where Mike's proposal is right

- **A decision is a fact about the project.** It says what was chosen, who
  chose it, when, and why. Mike's 2026-09-29 decision puts facts in memory,
  instructions in rules, and procedures in skills (`dev/GOAL.md:103-117`).
  A decision is not an instruction for how the agent works, so it belongs in
  memory.
- **His own model already did this.** It filed an "otherwise-unowned
  decision" in a `project_` memory file (`efa2440:.memory/memory-criteria.md:22`)
  and listed up to three recent decisions in the current focus
  (`efa2440:.memory/CURRENT_FOCUS.md:23-25`). His current toolkit sends
  "decisions" to memory topic files
  (`claude-toolkit/knowledge/knowledge-manual.md:72`).
- **The tools Toolkit V2 builds on treat decisions as memory.** Claude Code's
  own `project` memory type covers "decisions that Claude can't derive from the
  code or git history" (`claude-toolkit/ai-external-knowledge/claude-code/memory.md:453`).
  Lore, whose Notion layout V2 already uses, has a `decision` kind with Decided
  At, Alternatives, Consequences, and Supersedes columns
  (`plugins/toolkit/lib/notion/lore-schema.mjs:76, 87, 89-90, 140`). The
  toolkit leaves them unused and writes every row as Kind "note"
  (`plugins/toolkit/lib/memory/notion.mjs:19`).
- **`DECISIONS.md` was the agent's idea, and Mike never saw the reason.** The
  agent added it during the first build. It was item 6 of the 23 changes he
  approved with "go with your recommendations on all of them", described in one
  line with no reason (`dev/model-changes.md:63-65`). The agent's review draft
  had asked Mike's exact question as open question 3
  (`dev/archive/research/model-review-draft.md:816-817`). Reopening it is fair.
- **"Decisions for this work item" and "all decisions by work item" is the
  right shape, and nothing supports it today.** `DECISIONS.md` has no work item
  column (`plugins/toolkit/lib/work/decisions.mjs:416`). Decisions about one
  item are free text spread over about six sections of the item with no ID.
  Answering "what did we decide for WI-012, and why" takes about nine commands.
  "Every decision, by work item" cannot be answered exactly at all.
- **The only strong reason for a separate file was Git, and it covers less
  than it seems.** The draft's reason was that memory "is Git-ignored or in a
  service" (`dev/archive/research/model-review-draft.md:101`). Work item decisions were
  never in Git: `.memory/` and `/.work-items/` are ignored
  (`S/.gitignore:1-2`, the same in `efa2440`). The two rows that truly must be
  readable from every checkout move to committed files that fit them better
  (the standing merge instruction to a rule, the Jira status map to
  `.toolkit.json`).
- **Memory is the one store that every tracker and every worktree share.**
  With GitHub or Jira, `toolkit work` stops with exit code 3, but `toolkit
  decision list --item ACME-42` still works because it reads memory. Every
  worktree reads the same `.memory/`, Hindsight bank, or Notion database.
  `toolkit decision list` today reads only the `DECISIONS.md` on the current
  branch (`plugins/toolkit/lib/commands/decision.mjs:60-62`), so a session in an
  older worktree misses newer rows.
- **Tying decisions to work items and tying memories to work items is the
  same field.** One `work_items` list on every memory record answers both this
  question and his earlier request that "memories could be tied to work items
  in Notion" (`dev/archive/model/progress-2026-09-29-to-2026-10-02.md`).
- **The reason is stored twice today.** It sits in the `DECISIONS.md` Why
  column and again as "rationale" in a `project_` memory
  (`plugins/memory/skills/memory-save/SKILL.md:15`). One record per decision
  keeps it in one place.
- **Memory keeps Mike's internal reasoning out of client repositories.**
  `DECISIONS.md` is on the committed-documents list
  (`S/.claude/rules/publish-project-documents.md:6`), so in a client's
  Salesforce repository every row, with Mike's quoted words, is pushed where
  the client's developers can read it.

## Where to push back

- **The real failure was capture.** The reason for `DECISIONS.md` was never
  written anywhere, and moving decisions to memory does not change that by
  itself. What fixes it: every decision record must carry a labeled reason
  (section "The reason label"), the commands the agent already has to run
  create the record, and a bulk "yes to all" becomes one record per item, each
  saying what reason was shown. Mike's own rule says anything that must happen
  every time lives in the `toolkit` command or a hook (`dev/GOAL.md:80-82`),
  and the sample runs showed agents skip steps that only a skill asks for
  (`dev/test-runs/final-notion/evidence.md:305-321`).
- **Use a `decision_` filename prefix and a generated index page instead of
  a real `decisions/` folder.**
  - A folder exists only in built-in memory. Hindsight and Notion have no
    folders.
  - The model says "Active topics stay flat" (`S/.memory/AGENTS.md:3`). The
    built-in driver reads only the vault and `archive/`
    (`plugins/toolkit/lib/memory/builtin.mjs:299-357`) and rewrites links for
    `archive/` only (`builtin.mjs:19-23`). A second folder is possible but
    costs code in the scan, the key-to-path lookup, link repair, export, and
    import.
  - The prefix already groups the files: in Obsidian's file list every
    `decision_` file sorts together.
  - A folder cannot group by work item. The generated index page can, and
    that grouping is what Mike asked for.
- **Approval gates stay on the work item.** The `toolkit` command checks
  `requirements_approved`, `design`, and `result_approved` on the item before
  it lets the item move to the next stage
  (`S/.work-items/work-item-template/WORK-ITEM.md:11-13`;
  `plugins/toolkit/lib/work/ops.mjs:648, 665, 798`). A plain "approved" is a
  sign-off on what was shown, so it gets no decision record. An approval with a
  condition ("approved, but leave Contracts out") also creates a record for
  the condition. The decision list for an item still shows its gates, read
  from the tracker.
- **Decisions still waiting on Mike stay out of memory.** The model's criteria
  say pending approval is never lasting memory
  (`S/.memory/memory-criteria.md:24`). An open question stays in the item's
  Open Questions, or in "Waiting on the owner" in the current focus when there
  is no item.
- **Instructions for how the agent works are rules, and settings are
  settings.** A standing merge instruction tells agents how to work, so under
  Mike's 2026-09-29 split it is a rule. The claude-toolkit repository already
  keeps its merge instruction as a rule
  (`claude-toolkit/.claude/rules/standing-merge-instruction.md`). The Jira
  status map is a value a command reads, so it goes in `.toolkit.json`. Today
  both are `DECISIONS.md` rows (`S/.claude/rules/shared-repository-work.md:30`;
  `plugins/work/shared/tracker-jira.md:39`).
- **Leaving Git has a real cost with built-in memory and Hindsight.** Decisions
  would live on one computer. A fresh clone has none until memory is restored
  (`S/.memory/memory-criteria.md:27-29`), and a lost laptop with no backup
  loses them. For those projects the backup folder should become required.
- **Build it after the current goal.** It changes the memory contract, the work
  skills, and the model after the four sample runs passed, so finish items 9
  and 10 would have to run again (`dev/GOAL.md:283-288`). No real project uses
  V2 yet, so waiting loses nothing.

## Kinds of decision and their one home

| Kind | Example from a Salesforce project | Home | Written by |
| --- | --- | --- | --- |
| A decision for the whole project | "The Opportunity org-wide default is Private." | A decision record, `scope: project`, `work_items` naming the item where it was made | `toolkit decision add --project` |
| A decision about one or more work items: an answered question, a scope cut, a changed requirement | "Contract access is left out of WI-031 and moved to WI-036." | A decision record, `scope: work-items`, `work_items: [WI-031, WI-036]` | `toolkit decision add --items`, often with `--answers WI-031:Q-03` |
| The option chosen in a design that compared options | "Design option A: permission set groups." | A decision record. `DESIGN.md` "Owner decision" holds only the option and the ID. The comparison stays in the design. | `toolkit work approve WI-031 --design --option A --why '...'` |
| Approval gates: requirements, design, result, Done, Cancelled | `requirements_approved: 2026-09-30 by Mike` | The work item's own fields, unchanged: header fields, Notion properties, GitHub or Jira labels | `toolkit work approve`, `finish`, `cancel` |
| A condition attached to an approval | "Approved, but leave Contracts out for now." | The gate on the item, plus a decision record for the condition | `approve` then `decision add` |
| A question still waiting on Mike | "Should partner users see opportunities on shared accounts?" | The item's Open Questions, or "Waiting on the owner" in the current focus | Unchanged |
| An instruction for how the agent works | "From now on, before you ask me to approve a sharing change, test it as a sample rep user in the sandbox." | `.claude/rules/owner-preferences.md`, or `~/.claude/rules/` for every project | `toolkit rule add` |
| A setting a command reads | The Jira status map | `.toolkit.json` under `tracker.statusMap` | `toolkit config set` |
| The agent's own technical choice in delegated work | "Used a permission set for the one integration user." | The design's "Sources and decisions that affect the build" (`S/.work-items/work-item-template/DESIGN.md:159-165`) | The agent |
| A fact | "Sales Ops is four people: two analysts and two admins." | A section in a concept, such as `project_sales_access` | `toolkit memory save --concept` |
| A lesson not yet proven | "Sharing recalculation took about 40 minutes in the full sandbox." | The concept's "Gotchas and lessons" section | `toolkit memory save --lesson` |
| Agreed behavior after delivery | "Reps see only their own opportunities." | `requirements/<area>` at stage 14, committed, with a Change history line naming the decision | The agent at stage `14-spec-update` |

**How the agent tells which kind it has.** It asks these in order and stops at
the first yes:

1. Does it tell the agent how to work every time? A rule.
2. Is it a value a command reads? `.toolkit.json`.
3. Is it one of the approval gates, with nothing added? The work item, through
   `approve`, `finish`, or `cancel`.
4. Is it still waiting on an answer? Open Questions or the current focus.
5. Did a person choose between options, set a direction, reverse an earlier
   choice, or attach a condition to an approval? A decision record.
6. Otherwise it is a fact or a lesson, and goes in a concept.

`decided_by` is always a person: Mike, or someone he names, such as a client
contact. The agent's own choices are never decision records.

## The decision record

### Fields

The model's topic-template fields stay as they are: `name`, `description`,
`updated`, `metadata.type`, `status`, `source`, `last_verified`,
`authorization`, `supersedes`. The contract already keeps extra fields
(`plugins/toolkit/lib/memory/contract.mjs:71`). These are new:

| Field | Holds | Set by |
| --- | --- | --- |
| `decision_id` | `D-21` | The CLI under a lock. The next number is one more than the higher of two values: the highest number stored in the Git common folder (today's counter, `plugins/toolkit/lib/work/decisions.mjs:417-422, 474-513`), and the highest D-number already in memory, retired records included. A number is never reused. |
| `decided_on` | Date | `--date`, today by default |
| `decided_by` | `Mike`, or `Client: Jane Doe, sales director` | `--by` |
| `scope` | `project` (every later item must respect it) or `work-items` (only the listed items) | `--project`, or `--items` alone |
| `work_items` | Work item IDs, in the tracker's own form (`WI-031`, `"#12"`, `ACME-42`) | `--items`, plus IDs named in the Authoritative records line. A replacing decision also keeps the items of the decision it replaces. |
| `answers` | `WI-031 Q-02` (optional) | `--answers` |

- **Status** is `current`, `superseded`, or `archived` (withdrawn with no
  replacement). A decision record is never `needs-review`, because memory
  holds only decisions already made.
- **Key** is `decision_<slug>`. The slug names the choice, so a link to the
  record never changes. The ID is in the title line and the field.
- **IDs are compared by prefix and number** with the existing `sameId`
  (`plugins/toolkit/lib/work/model.mjs:63-66`): `WI-12` matches `WI-012`, and
  `WI-120` does not match `WI-12`.
- **Body labels** are the model's six labels with "Remember" renamed
  "Decision" and one label added, "Options considered". This changes the model
  and needs Mike's yes.
- **Never merged, split, or rewritten.** `memory-tidy` only flags problems in
  decision records. `toolkit memory delete` refuses a `decision_` key; a
  decision is replaced (`--replaces`) or withdrawn (`decision withdraw`). The
  one exception is a record that holds something that must not be kept, such
  as a password, which is deleted with Mike's yes.

### The reason label

Every Why starts with one of four labels, and `toolkit decision add` refuses
anything else:

- `Owner: "<his words>"`
- `Agent recommendation accepted: <the reason he was shown>. Owner: "<his words>"`.
  After a bulk yes it reads `Agent recommendation accepted in a bulk yes (item
  6 of 23). Reason shown: none. Owner: "go with your recommendations on all of
  them."`
- `Reported: <who decided>, <where>: "<their words>"`, for a client's decision
  Mike passes on or a meeting note.
- `Not stated.`, only for records imported from an older `DECISIONS.md`.

**The words are checked.** The UserPromptSubmit hook already keeps up to 600
characters of the owner's message in hook state
(`plugins/toolkit/lib/hooks/user-prompt.mjs:74`), but the turn file the CLI can
read holds only yes-or-no facts (`plugins/toolkit/lib/hooks/turn-facts.mjs:9-10`).
The hook also writes the owner's last few messages to that file. The CLI then
checks that the quoted words appear in one of them.

- Words not found: exit code 2 and "ask the owner". The agent asks the
  decision as an Open Question. Nothing is saved as a proposal.
- No turn file (a terminal Mike runs himself, or Codex before its hooks are
  trusted, `turn-facts.mjs:16-18`): the record is saved with the authorization
  "quote not checked".
- A `Reported:` decision needs `--source` (a meeting note or email path)
  instead.

### Commands

```text
toolkit decision add --decision '<one sentence>' --why '<labeled reason>' --by <person>
                     (--items WI-031[,WI-036] | --project [--items WI-031])
                     [--options '<A (chosen): ...; B: ...>'] [--apply '<how to apply>']
                     [--answers WI-031:Q-02] [--replaces D-22] [--source '<path>']
toolkit decision list [--item <id>] [--by-item] [--project] [--since <date>] [--all] [--json]
toolkit decision show D-21
toolkit decision link D-21 --item WI-044        adds a work item; the decision text is unchanged
toolkit decision withdraw D-21 --reason '<words>'
toolkit decision import [<file>]                 one-time move of an old DECISIONS.md, keeping its numbers
toolkit memory list --item <id>                  every memory naming the item, with the matching sections
toolkit work show <id>                           now ends with "Decisions" and "Linked memory"
toolkit work approve <id> --design --by <owner> --option A --why '<labeled reason>'
toolkit work waiting                             today's `toolkit work decisions`; the old name keeps working
```

- `--answers WI-031:Q-02` does three things in one command: it rewrites Q-02
  as "Answered: D-21" with the date, adds the Recent History row, and sets
  `waiting_on` back. Today that takes three commands in `work-decide` step 5
  (`plugins/work/skills/work-decide/SKILL.md:19-22`).
- `approve --design` requires `--option` and `--why` when the design compares
  two or more options. It writes the record and fills "Owner decision:
  Option A (D-23), Mike, 2026-10-03" in the design.
- `--replaces D-22` marks D-22 `superseded`, adds "Replaced by D-31." to its
  body, and copies its work items onto the new record.
- No commit. Today each row needs a `publish-docs` save worktree, a commit,
  and a push (`plugins/work/skills/work-decide/references/decisions-log.md:37-53`).
- `toolkit work decisions` becomes `toolkit work waiting`, so "decisions" means
  decisions already made everywhere. Today it lists pending ones
  (`plugins/toolkit/lib/work/decisions.mjs:16-91`) while `toolkit decision`
  lists recorded ones.

## By memory system

| | Built-in `.memory/` | Hindsight | Notion (Lore layout) |
| --- | --- | --- | --- |
| Stored as | A file `.memory/decision_<slug>.md`, flat, next to the concepts | A document whose ID is the key, holding the same text as the file (`plugins/toolkit/lib/memory/hindsight.mjs:8-9`) | A row in the project's Memories database, Kind `decision` |
| Link to work items | `work_items:` in the file header | One `wi:<ID>` tag per item, plus `type:decision` and `decision:D-21`, written by `recordTags` (`hindsight.mjs:123-127`) | A "Work item IDs" text column, always. A "Work items" relation to the Work Items database when the tracker is also Notion. |
| "Decisions for WI-031" | `decision list --item WI-031` reads every file (`builtin.mjs:299-357`) and filters on `work_items`. Exact. | The documents list filtered by the tags `type:decision` and `wi:WI-031`. The list already filters by tag today (`hindsight.mjs:438-440`; `plugins/toolkit/lib/hindsight/client.mjs:19, 296-297`). Exact, because the tag is written when the record is saved. Ranked search ("recall") is not used for this. | One query on Kind = decision and Work item IDs containing WI-031 (`plugins/toolkit/lib/notion/client.mjs:517-532`). Exact. |
| "All decisions by work item" | `decision list --by-item` reads every file | The documents list with `type:decision`, every page | `queryAll` with Kind = decision; stops at 10,000 rows |
| Server down | Not applicable | Reads the briefing's cache and says the list may be out of date | Same as Hindsight |
| How Mike browses | A generated `.memory/DECISION-INDEX.md` in Obsidian, linked from `MEMORY.md` | No screen. `decision list --by-item` in chat. Every backup and export also writes `DECISION-INDEX.md` into the backup folder, readable in any editor. | A "Decisions" table view (Kind = decision, newest first, with Decision ID and Work item IDs columns), next to the existing "Index" and "Retired" views (`plugins/toolkit/lib/notion/ensure.mjs:472-514`). With the Notion tracker, each work item page also shows a "Memories" column listing its decisions and memories. |

The same record, D-21 from worked example 1, in each system:

**Built-in:** the file `.memory/decision_opportunity_owd_private.md`.

```markdown
---
name: decision_opportunity_owd_private
description: "The Opportunity org-wide default is Private for internal and external users"
updated: 2026-10-02
metadata:
  type: decision
status: current
source: Mike, in chat, 2026-10-02, answering WI-031 Q-02
last_verified: 2026-10-02
authorization: Stated by Mike on 2026-10-02 (quote checked)
supersedes: none
decision_id: D-21
decided_on: 2026-10-02
decided_by: Mike
scope: project
work_items: [WI-031]
answers: WI-031 Q-02
---

# D-21: The Opportunity org-wide default is Private

**Decision:** The org-wide default for Opportunity is Private for internal and external users. A sales rep sees the opportunities they own, plus what the role hierarchy and sharing rules grant.

**Why:** Owner: "Reps must not see each other's deals. Managers see their team's."

**Options considered:** A, Private (chosen). B, Public Read Only: every rep would see the whole pipeline. C, Public Read/Write: rejected in the design.

**How to apply:** A later item that needs wider Opportunity access adds a sharing rule, a team, or a manual share. It never raises the org-wide default. A proposal to raise it is a change to this decision and goes to the owner.

**Evidence and limits:** WI-031 Solution Design, option comparison, 2026-10-02. Opportunity only; Account stays Public Read Only.

**Related memories:** [sales access](project_sales_access.md)

**Authoritative records:** WI-031 Q-02; WI-031 Solution Design.
```

**Hindsight:** document ID `decision_opportunity_owd_private`, the same text,
tags `kind:record`, `type:decision`, `status:current`, `wi:WI-031`,
`decision:D-21`. The metadata stays the fixed list of text fields it is today
(`hindsight.mjs:167-189`); the decision fields stay in the text.

**Notion:** one Memories row.

| Property | Value | Column owner |
| --- | --- | --- |
| Title | D-21: The Opportunity org-wide default is Private | Lore |
| Keywords | `decision_opportunity_owd_private` | Lore (the toolkit writes the key here today) |
| Synopsis | The Opportunity org-wide default is Private for internal and external users | Lore |
| Kind | decision | Lore (`lore-schema.mjs:76`) |
| Status | accepted | Lore (`lore-schema.mjs:80`) |
| Decided At | 2026-10-02 | Lore (`lore-schema.mjs:87`) |
| Alternatives | B, Public Read Only. C, Public Read/Write. | Lore (`lore-schema.mjs:89`) |
| Consequences | The "How to apply" text | Lore (`lore-schema.mjs:90`) |
| Author | Mike | Lore (`lore-schema.mjs:91`) |
| Lifetime | until-decision-superseded | Lore (`lore-schema.mjs:101`) |
| Affects | Relation to the `project_sales_access` row | Lore (`lore-schema.mjs:141`) |
| Record Key, Source note, Authorization, Other fields | As for every record | Toolkit (`plugins/toolkit/lib/notion/schema.mjs:179-189`) |
| Decision ID | D-21 | New toolkit column |
| Work item IDs | WI-031 | New toolkit column |
| Work items | Relation to the WI-031 card (Notion tracker only) | New toolkit relation |

The page body is the record body without its title line. Lore's own
`lore-decision` tool would read these rows if Mike ever turned Lore on
(`dev/archive/research/lore.md:242`). The Lore research turned down Lore's decisions
because they would "duplicate the toolkit's `DECISIONS.md`"
(`dev/archive/research/lore.md:441-442`). With `DECISIONS.md` removed, that reason no
longer applies. Until the Notion part is built, the new fields sit in the
"Other fields" JSON column (`schema.mjs:187`) and the filter runs in code, the
way type and status are filtered today (`plugins/toolkit/lib/memory/notion.mjs:740-751`).

## By tracker

| | Local `.work-items/` | Notion | GitHub Issues | Jira |
| --- | --- | --- | --- | --- |
| What the item holds | Short pointer rows written by the CLI: Recent History "Decision D-21: …", Q-02 "Answered: D-21", design "Owner decision: Option A (D-23)" | The same rows in the page body. With Notion memory, also the "Memories" relation column. | The same rows, added by the agent with `gh`, because `toolkit work` exits with code 3 | The same rows, added through Jira |
| `decision add --answers` | Writes the record and every item row | Same, through the Notion API | Writes the record, then prints the rows for the agent to paste into the issue | Same as GitHub |
| "Decisions for WI-031" | `toolkit decision list --item WI-031`, or `toolkit work show WI-031`, which prints the same block | Same | `toolkit decision list --item "#12"` works, because it reads memory. Gates come from the issue's labels (`plugins/work/shared/tracker-github.md:43-47`). | `toolkit decision list --item ACME-42`; gates from Jira fields |
| Parent's decisions | The CLI walks `parent`, the same way designs are inherited (`plugins/toolkit/lib/commands/work.mjs:357`) | The CLI walks the Parent item relation | The agent adds `--item` for the parent | Same as GitHub |
| What Mike sees on the item | History rows with D-numbers | History rows, plus the Memories list with Notion memory | History rows | History rows |

With a mixed setup, such as the Notion tracker with built-in memory, the link
is the ID as text: exact for the CLI, with nothing to click. The Notion
tracker with Notion memory is the only setup where decisions show on the work
item card, so `project-setup` recommends Notion memory when Mike picks the
Notion tracker.

## Worked example 1: a Salesforce security and permissions model

A Salesforce project, local tracker, built-in memory. Work item WI-031 "Sales
access model" (type build) sits under WI-030 "Sales Cloud rollout". Mike and
the agent design who can see and edit which records, and what each user can
do. Salesforce terms used:

- **Org-wide default:** the baseline access every user has to records they do
  not own, set per object.
- **Role hierarchy:** the tree of roles. A manager can see the records owned
  by the people in the roles below theirs.
- **Sharing rule:** grants extra access to a group of users on records that
  match a condition, such as the owner's role.
- **Permission set group:** a bundle of permission sets assigned to a person.
  It controls what the person can do, such as edit Opportunities or run
  reports.

### What was said, and where it was recorded

| Date | What happened | Where it went |
| --- | --- | --- |
| 2026-09-25 | In WI-030, Mike: "Sales Cloud only this year." | D-18, whole project, `work_items: [WI-030]`, Why `Not stated.`: an older row brought over by `decision import` |
| 2026-09-30 | Mike approves the WI-031 requirements: "yes, approved." | Gate only: `requirements_approved: 2026-09-30 by Mike`, and a history row with his words. No decision record. |
| 2026-10-01 | Q-01 "Role hierarchy by region or by product line?" Mike: "By region. That's how we manage the team." | D-20, whole project, answers Q-01: CEO, VP Sales, Regional Sales Manager East and West, Sales Rep East and West |
| 2026-10-02 | Q-02 "Opportunity org-wide default?" Mike: "Reps must not see each other's deals. Managers see their team's." | D-21 (the full record above), whole project, answers Q-02 |
| 2026-10-02 | Mike: "Ops builds the forecast. They read, they don't edit." | D-22, `work_items: [WI-031]`: an owner-based sharing rule shares opportunities owned by the Sales Rep roles, Read Only, with the Sales Ops public group |
| 2026-10-03 | Design option A (permission set groups on the Minimum Access - Salesforce profile) against B (one profile per role). The agent recommends A: "a person can hold several groups; a profile cannot be combined." Mike: "Go with your recommendation. Approved, but leave Contracts out for now." | `approve --design --option A`: gate `design: approved`, plus D-23, whole project, Why `Agent recommendation accepted: a person can hold several groups; a profile cannot be combined. Owner: "Go with your recommendation."` The condition becomes D-24: "Contract access is left out of WI-031 and moved to WI-036", `work_items: [WI-031, WI-036]`. `DESIGN.md` says "Owner decision: Option A (D-23), Mike, 2026-10-03". |
| 2026-10-03 | Mike: "From now on, before you ask me to approve a sharing change, test it as a sample rep user in the sandbox and show me what they can see." | A rule in `.claude/rules/owner-preferences.md` under "Salesforce". Not a decision record: it tells the agent how to work. |
| 2026-10-04 | Mike: "Sales Ops is four people, two analysts and two admins." | A fact: `project_sales_access`, section "Sales Ops group", Authoritative records WI-031 |
| 2026-10-06 | During the build, sharing recalculation after the default change took about 40 minutes in the full sandbox, and record edits waited until it finished. | A lesson: `project_sales_access`, "Gotchas and lessons", Seen 2026-10-06 (WI-031 build) |
| 2026-10-06 | Q-04 "Should partner users see opportunities on shared accounts?" is still open. | Stays in WI-031 Open Questions. Not memory. |
| 2026-10-09 | Stage 14. | `requirements/sales-access/` Change history: "2026-10-09. Opportunity records are Private. Reps see their own, managers see their region's, Sales Ops reads every rep-owned opportunity. Owner decisions D-20, D-21, D-22. WI-031." Committed. This is the part a client can read. |
| 2026-11-15 | In WI-040 "Forecast updates", Mike: "Ops needs to fix close dates during forecast week." | D-31 replaces D-22: the sharing rule becomes Read/Write. D-22 becomes `superseded`. D-31 keeps WI-031 from D-22 and adds WI-040. |

### "What did we decide for WI-031, and why?"

One command. `toolkit work show WI-031` ends with the same block.

```text
$ toolkit decision list --item WI-031
WI-031: Sales access model (Done; parent WI-030)
Approvals: requirements 2026-09-30 by Mike; design 2026-10-03 by Mike (D-23); result 2026-10-09 by Mike.
Decisions:
  D-20 (2026-10-01, Mike, whole project) Role hierarchy by region. Answers Q-01.
       Why: Owner: "By region. That's how we manage the team."
  D-21 (2026-10-02, Mike, whole project) The Opportunity org-wide default is Private. Answers Q-02.
       Why: Owner: "Reps must not see each other's deals. Managers see their team's."
  D-23 (2026-10-03, Mike, whole project) Feature access through permission set groups on the Minimum Access profile. Design option A.
       Why: Agent recommendation accepted: a person can hold several groups; a profile cannot be combined. Owner: "Go with your recommendation."
  D-24 (2026-10-03, Mike) Contract access is left out of WI-031 and moved to WI-036. Condition of the design approval.
       Why: Owner: "Approved, but leave Contracts out for now."
  D-31 (2026-11-15, Mike, from WI-040) Sales Ops gets Read/Write on rep-owned opportunities. Replaces D-22.
       Why: Owner: "Ops needs to fix close dates during forecast week."
From parent WI-030:
  D-18 (2026-09-25, Mike, whole project) Sales Cloud only this year. Why: Not stated.
Linked memories: project_sales_access (sections "Sales Ops group", "Gotchas and lessons").
Waiting on the owner: Q-04 Should partner users see opportunities on shared accounts?
1 replaced decision hidden (D-22); add --all to show it.
```

### "All decisions, by work item"

```text
$ toolkit decision list --by-item
Whole project (4):
  D-18 Sales Cloud only this year. From WI-030.
  D-20 Role hierarchy by region. From WI-031.
  D-21 The Opportunity org-wide default is Private. From WI-031.
  D-23 Feature access through permission set groups. From WI-031.
WI-030 Sales Cloud rollout: D-18
WI-031 Sales access model: D-20, D-21, D-23 (whole project); D-24; D-31
WI-036 Contract access: D-24
WI-040 Forecast updates: D-31 Sales Ops gets Read/Write on rep-owned opportunities. Replaces D-22.
1 replaced decision hidden; add --all to show it.
```

### What Mike browses

Built-in memory: `.memory/DECISION-INDEX.md` in Obsidian. Only the CLI writes
it.

```markdown
# Decision index

Generated by toolkit from the decision records. Do not edit. Newest first in each group.

## Whole project
- [D-23: Feature access through permission set groups](decision_permission_set_groups.md), 2026-10-03, Mike, from WI-031
- [D-21: The Opportunity org-wide default is Private](decision_opportunity_owd_private.md), 2026-10-02, Mike, from WI-031
- [D-20: Role hierarchy by region](decision_role_hierarchy_by_region.md), 2026-10-01, Mike, from WI-031
- [D-18: Sales Cloud only this year](decision_sales_cloud_only.md), 2026-09-25, Mike, from WI-030

## WI-040 Forecast updates
- [D-31: Sales Ops gets Read/Write on rep-owned opportunities](decision_sales_ops_edit_opportunities.md), 2026-11-15, Mike. Replaces D-22.

## WI-031 Sales access model
- [D-31: Sales Ops gets Read/Write on rep-owned opportunities](decision_sales_ops_edit_opportunities.md), 2026-11-15, Mike, from WI-040
- [D-24: Contract access moved to WI-036](decision_contracts_out_of_wi031.md), 2026-10-03, Mike
- Whole project decisions made here: D-20, D-21, D-23

## Replaced or withdrawn
- D-22: Sales Ops reads rep-owned opportunities. Replaced by D-31 on 2026-11-15.
```

With the Notion tracker and Notion memory, the WI-031 card's "Memories" column
lists D-20, D-21, D-23, D-24, D-31, and `project_sales_access`, and the
Decisions view in the Memories database shows every decision.

## Worked example 2: when and why `DECISIONS.md` was added

### What happened

- On 2026-09-26 the agent's review draft recommended a root `DECISIONS.md`,
  because decisions were "spread across 8 places" and memory "is Git-ignored
  or in a service" (`dev/archive/research/model-review-draft.md:101`). The same draft
  asked Mike whether to add the file or keep project decisions in memory (open
  question 3, `:816-817`).
- The list Mike approved at 18:45 EDT described item 6 in one line, "a log of
  project-wide decisions. Recommend: keep.", with no reason. He answered "go
  with your recommendations on all of them" (`dev/model-changes.md:63-65`).
- `dev/GOAL.md:190` recorded "6. `DECISIONS.md` added." with no reason.
- On 2026-09-29 Mike asked when and why. The answer had to be dug out of a
  chat transcript. The reason was written down only afterward
  (`dev/model-changes.md:64`).

### The same thing under this design

The bulk yes becomes one record per item, and each record copies the reason
that item showed. Item 6 becomes:

```markdown
---
name: decision_root_decisions_file
description: "Whole-project decisions go in a committed DECISIONS.md at the project root"
updated: 2026-09-26
metadata:
  type: decision
status: current
source: Mike, in chat, 2026-09-26 18:45 EDT, approving the 23 model changes
last_verified: 2026-09-26
authorization: Stated by Mike on 2026-09-26 (quote checked)
supersedes: none
decision_id: D-6
decided_on: 2026-09-26
decided_by: Mike
scope: project
work_items: []
---

# D-6: Add a root DECISIONS.md for whole-project decisions

**Decision:** Add an append-only DECISIONS.md at the project root for decisions that apply to the whole project.

**Why:** Agent recommendation accepted in a bulk yes (item 6 of 23). Reason shown: none; the list said "a log of project-wide decisions. Recommend: keep." Owner: "go with your recommendations on all of them."

**Options considered:** Not shown to the owner in the approval list. The review draft named the other option: keep project decisions in the chosen memory system.

**How to apply:** Record whole-project decisions in DECISIONS.md with toolkit decision add.

**Evidence and limits:** The agent's own reasoning, not shown to the owner: dev/archive/research/model-review-draft.md:101.

**Related memories:** None.

**Authoritative records:** dev/model-changes.md item 6.
```

- **The gap shows on day one.** `toolkit decision list` prints "Reason shown:
  none" next to D-6 from the moment it is saved, and `memory-tidy` flags
  decisions whose reason was never shown.
- **The question takes one command.** "When and why was `DECISIONS.md` added?"
  is answered by `toolkit memory find 'DECISIONS.md' --type decision` or
  `toolkit decision show D-6`: "Mike approved it on 2026-09-26 inside a bulk
  yes; no reason was shown to him (D-6)."
- **If Mike says yes to this recommendation,** a new record replaces D-6:
  "Decisions are memory records, one per decision; remove the root
  DECISIONS.md", with `Why: Owner: "<his words>"` and `--replaces D-6`. D-6
  becomes `superseded` and stays readable with `--all`.

Toolkit V2's own development decisions live in `dev/GOAL.md`; this example
shows how the same event would look in a project that uses V2.

## Memories tied to work items

Every memory record gets the `work_items` list: concepts, events, references,
and decisions.

- **The agent writes nothing new.** It keeps writing work item IDs as plain
  text in each section's **Authoritative records** line and each lesson's
  **Seen** line (`plugins/memory/shared/record-format.md:180, 202, 250-252`).
  On every save the CLI collects those IDs, plus any `--item`, into
  `work_items`.
- **The agent sees them when it opens an item.** `toolkit memory list --item
  WI-031` names each record and the matching section, for example
  `project_sales_access (section "Sales Ops group")`. `toolkit work show`
  prints the same lines, so `work-on` gets them without an extra step.
- **Search keeps `WI-012` as one word.** Today `toolkit memory find 'WI-012'`
  splits it into "wi" and "012", so every record that names any work item is a
  hit (`plugins/toolkit/lib/memory/contract.mjs:1706-1737`;
  `plugins/toolkit/lib/memory/hindsight.mjs:140-149`).

| | Built-in | Hindsight | Notion |
| --- | --- | --- | --- |
| Stored as | `work_items:` in the file header | `wi:<ID>` tags; `toolkit memory reindex` adds them to older records by rewriting them (`hindsight.mjs:682-704`) | "Work item IDs" text column; with the Notion tracker, also the two-way "Work items" relation, which adds a "Memories" column to each work item page |
| Exact list for one item | Every file is read | The documents list is filtered by tag | Notion filters on the column or the relation |
| What Mike sees | Obsidian shows `work_items` as a property on each note, and its search finds `[work_items:WI-031]` | Nothing to click; the CLI or an export | The Memories column on the work item card |

**One limit.** A relation links the whole row, so the WI-031 card links all of
`project_sales_access`, not only its "Sales Ops group" section. The CLI listing
names the section.

**One more limit, for built-in memory.** A link from a memory note to a local
work item cannot be clickable in Obsidian. The item's folder is outside the
`.memory/` vault, the folder path changes when Mike moves the item, and the
model forbids such links (`S/.memory/AGENTS.md:9`). The ID as text, the
property, and the index page are what work there.

## When the agent reads decisions without being asked

- **`toolkit work show <id>`** prints Decisions and Linked memory at the end.
  It already prints the whole item body (`plugins/toolkit/lib/commands/work.mjs:304-305`),
  and `work-on`, `work-decide`, `work-requirements`, `solution-design`,
  `work-check`, and `work-finish` all open the item with it. The loading is
  done by the command, so no skill step can be skipped.
- **Session briefing** (6,000-character limit,
  `plugins/toolkit/lib/project/brief.mjs:29`), about 400 characters:
  - this worktree's item: "WI-031 has 5 decisions (latest D-31) and 1
    linked memory";
  - the newest 3 decisions from the last 14 days, one line each. This brings
    back the "Recent decisions, at most three" section of Mike's original
    current focus (`efa2440:.memory/CURRENT_FOCUS.md:23-25`) with nobody
    keeping it by hand.
- **`solution-design`** runs `toolkit decision list --project` before it
  writes options. Each decision that limits the design is cited as "D-21" in
  "Sources and decisions that affect the build". An option that goes against a
  decision says so, and the conflict becomes an Open Question.
- **`work-check`**: the independent acceptance checker gets the item's
  decisions along with its requirements, so it can check the result against
  "Opportunity default stays Private", not only against R-01.
- **`toolkit work finish`** checks that every decision recorded during the
  item names all the items it affects, and asks whether any `work-items`
  decision applies to the whole project.
- **`memory-find`** answers "what did we decide" with `toolkit decision list
  --item <id>`, or `toolkit memory find '<words>' --type decision`.
  `S/AGENTS.md:21` already routes that question here; today the skill says the
  opposite (`plugins/memory/skills/memory-find/SKILL.md:46`).
- **`handoff`** lists the decision IDs recorded this session.
- **Hooks.** "we decided", "I decided", "let's go with", "go with option", and
  "decision:" join the phrases the hooks listen for
  (`plugins/toolkit/lib/hooks/phrases.mjs:15-22`). When Mike uses one and
  nothing was recorded, the Stop hook's one reminder per turn names
  `work-decide`. The Stop hook already counts `toolkit decision add` as a
  record (`plugins/toolkit/lib/hooks/shell.mjs:415`) and also counts `toolkit
  work approve`.
- **`toolkit work edit`** refuses to mark an Open Questions row Answered unless
  the row names a D-number or an approval. The template already defines each
  row as an unanswered decision (`S/.work-items/work-item-template/WORK-ITEM.md:81`),
  so every answered row is either a gate or a decision.

## Git, backup, and client repositories

| | Committed `DECISIONS.md` (today) | Decision records in memory (this design) |
| --- | --- | --- |
| In a fresh clone | Yes | Notion memory: yes. Built-in and Hindsight: after `toolkit memory import` from the backup, the same as all memory and all local work items today. |
| On a second computer | Yes, by push and pull | Notion memory: yes. Built-in and Hindsight: no. Local work items do not move between computers either. |
| History of changes | `git log` of one file | Records are never rewritten; a change is a new record that names the old one. Notion also keeps page history. |
| Seen from every worktree | Only rows committed on that branch | Yes |
| Linked to work items | No column | Exact list per item |
| Cost of one save | Save worktree, commit, push, check | One command |
| Two sessions adding at once | Two branches edit one table | Each writes its own record under the lock |
| Survives a lost laptop | Yes, if pushed | Notion: yes. Built-in and Hindsight: only with a backup folder. |

- **What must still be in Git, and where it goes:** the standing merge
  instruction goes to `.claude/rules/owner-preferences.md`; the Jira status
  map goes to `.toolkit.json`; agreed behavior goes to `requirements/`; how
  the system is built goes to `system-guide/`. All four are committed today.
- **Backup becomes required for built-in and Hindsight projects.** Setup
  already asks for a backup folder, and the toolkit already exports
  `.work-items/`, `.memory/`, and Hindsight memory at work-finish and handoff
  (`dev/GOAL.md` decision 13 of 2026-09-28; `dev/ARCHITECTURE.md:359-367`).
  Today `--backup-dir none` is allowed. For these projects, `toolkit doctor`
  reports a missing backup folder as an error.
- **Client Salesforce repositories.** Mike's reasons stay in his memory. What
  the client needs is already committed: the `requirements/<area>` file with
  the behavior and a Change history line naming the decision, such as
  "Owner decisions D-20, D-21, D-22". The line states the behavior itself, so
  a reader who cannot look up D-21 still knows what was agreed.
  `S/.claude/rules/confirm-salesforce-changes.md:8` ("Record the decision where
  the project keeps decisions") gets a named target: `work-decide`, then the
  requirements area at delivery. If a client asks for a decision log as a
  deliverable, the agent writes one into `delivery/` with `toolkit decision
  list --by-item --markdown`, after Mike's yes, and runs it through the
  humanize rule for outbound text.

## What changes

"Mike's yes" marks changes that need his approval before they are made.
Everything else follows from his answer to the main question.

### Decisions to record (Mike's yes)

- `dev/GOAL.md`: the decision itself; the "Rules, skills, and memory" bullet
  gains the fifth prefix and the one-record-per-decision exception; approved
  change 6 is marked replaced.
- `dev/ARCHITECTURE.md` section 4.6 (`:317-321`) and the Records part of
  section 7; `dev/model-changes.md` item 6; `dev/archive/model/progress-2026-09-29-to-2026-10-02.md`, the open
  request, placed.

### Model branch `toolkit-v2/approved-changes` (Mike's yes)

Then `node dev/tools/import-model.mjs` and the parity test.

1. Remove `DECISIONS.md` and the lines that name it: `S/PROJECT.md:37`,
   `S/README.md:26`, `S/AGENTS.md:139` and `:149`, and
   `S/.claude/rules/publish-project-documents.md:6`. This reverses approved
   change 6.
2. `S/AGENTS.md:59` becomes "A decision a person made | Memory, as a decision
   record (`work-decide`)". `:36` becomes "unless the owner's rules hold a
   standing merge instruction". `:21` stays and becomes correct.
3. `S/.memory/memory-criteria.md`: a new `decision_<slug>.md` row. The
   `project_` row (`:12`) stops routing decisions to `DECISIONS.md`.
4. New `S/.memory/decision_template.md` next to `project_topic_template.md`,
   with the labels Decision, Why, Options considered, How to apply, Evidence
   and limits, Related memories, Authoritative records.
5. `S/.memory/AGENTS.md`: `:14` adds `decision` to the allowed prefixes and
   says a decision file holds one decision; `:9` adds "work item IDs stay plain
   text; the tool copies them into `work_items`"; `DECISION-INDEX.md` is
   generated.
6. `S/.memory/MEMORY.md` index format: one line linking `DECISION-INDEX.md`.
7. `S/.claude/rules/shared-repository-work.md:30`: a standing merge
   instruction in the owner's rules counts. This changes the rule's meaning.
8. `S/.claude/rules/confirm-salesforce-changes.md:8`: "Record the decision with
   `work-decide`." This replaces the open proposal at
   `dev/research/rules-best-practices.md:485-488`.
9. `WORK-ITEM.md`: the Recent History guide (`:73`) says decision rows start
   "Decision D-n:" and the CLI writes them; the Open Questions guide (`:81`)
   says an answered row names its D-number or approval; the R-xx "Decision
   record" guide (`:111`, `:121`) says "approval, or the D-n that changed it";
   Notes "Decisions and context" (`:136-138`) becomes "Context".
10. `DESIGN.md`: "Owner decision" (`:95`) holds the chosen option and its D-n;
    the "Reason for decision" line (`:96`) is removed, because the reason lives
    in the record.
11. `project_topic_template.md` fill-in guide: one sentence about
    `work_items`.

### Toolkit code (`plugins/toolkit/lib/`)

- `memory/contract.mjs`: `decision` in `RECORD_TYPES`, `ACTIVE_TYPES`,
  `KEY_RE` (`:222, :231, :271`); decision fields checked on save; never
  `needs-review`; `work_items` collected from Authoritative records and Seen
  lines; an `item` filter on `list`; `WI-012` kept as one search word
  (`:1706-1737`); delete refused for `decision_` keys.
- `memory/concepts.mjs`: decisions are one record each, like events (`:8`).
  `memory/similar.mjs`: a new decision is compared only with current decisions
  and gets "may replace D-n" instead of a refusal.
- `memory/builtin.mjs`: generates `DECISION-INDEX.md` next to `MEMORY.md`
  (`:131-138`).
- `memory/hindsight.mjs`: `wi:`, `type:decision`, and `decision:` tags in
  `recordTags` (`:123-127`); tag-filtered listing; the search fix (`:140-149`);
  `reindex` adds tags to older records.
- `work/decisions.mjs` and `commands/decision.mjs`: `add` writes a memory
  record; new `list` filters, `show`, `link`, `withdraw`, `import`; the counter
  also reads the highest D-number in memory; gates and parents read through the
  tracker driver.
- `work/ops.mjs` and `commands/work.mjs`: `approve --design --option --why`;
  `--answers`; `show` prints Decisions and Linked memory, from the cache when
  the memory server does not answer; `work edit` refuses Answered with no
  D-number or approval; `work finish` checks decision scope; `work decisions`
  renamed `work waiting` with the old name kept.
- `project/brief.mjs`: the two briefing lines.
- Hooks: decision phrases (`hooks/phrases.mjs`); the owner's last few messages
  in the turn file (`hooks/turn-facts.mjs`, `hooks/user-prompt.mjs`); the
  `DECISIONS.md` watch removed (`hooks/common.mjs:64`); Stop counts `work
  approve`.
- `toolkit doctor`: a root `DECISIONS.md` left in a project ("run toolkit
  decision import"); a decision naming an item that does not exist; a missing
  backup folder with built-in or Hindsight memory is an error.
- Config: `tracker.statusMap` in `.toolkit.json`. `decision import` sends the
  standing-merge row to the rules and the Jira row to `.toolkit.json`.
- `project-setup`: recommend Notion memory when the tracker is Notion.
- **Notion part, built later:** `memory/notion.mjs`, `notion/schema.mjs`,
  `notion/ensure.mjs` get Kind `decision`, the Lore decision columns, Decision
  ID, Work item IDs, the Work items relation and its Memories pair, and the
  Decisions view.

### Skills and shared references

- `work-decide`: steps 5 and 7 become one step using `decision add
  --answers`. `references/decisions-log.md` is rewritten as a decision-records
  reference with no `publish-docs` step. Its line 14-15 still sends
  preferences to memory, which the 2026-09-29 split already changed.
- `plugins/work/shared/recording-owner-answers.md`: the routing rows for
  answers, design choices, and project decisions.
- `work-on`, `solution-design`, `work-requirements`, `work-check`,
  `work-finish` (`:39`, the merge instruction is a rule), `work-delegate` (the
  delivery choice is recorded), `handoff`.
- `memory-find`: steps 2 and 5, the Gotcha at `:46`, the Other homes row at
  `:54`. `memory-save`: `:15`, `:125`, `:137`; a decision the owner states goes
  to `toolkit decision add`, never into a concept section. `memory-tidy`
  checklist (`:76-79`): flags concept sections that copy a decision, decisions
  whose reason was not shown, and decisions naming items that no longer exist;
  never merges or rewrites a decision.
- `plugins/memory/shared/record-format.md`: the decision type, `work_items`,
  and the example.
- Tracker references: `tracker-jira.md:39, 122-123` (status map to
  `.toolkit.json`); GitHub and Jira pointer rows added by hand;
  `tracker-notion.md` the Memories relation.
- Last: update `dev/SKILL-INDEX.md`, then run
  `node dev/tools/sync-skill-references.mjs`.

### Checks and tests

- Contract tests in each memory system: the decision type, the four reason
  labels, the quote check, no pending decisions, delete refused, the
  replacement chain, ID matching (`WI-12` matches `WI-012`; `WI-120` does not).
- Driver tests: `list --item` returns exactly the linked records, parent
  included; `--by-item --all` is complete.
- Memory test set (`dev/GOAL.md:158-160`): the two outputs in worked example 1
  as expected results, run on all three memory systems; a reversed decision is
  answered from its replacement; "I don't know" when no decision exists.
- A live Notion test of the Memories-to-Work Items relation, which has never
  been tried (`dev/archive/research/notion-design.md:419-421`), and a live Hindsight
  test of the `wi:` tag filter.
- Briefing, hook phrase, `work edit` refusal, and parity tests; the decision
  steps of the four sample runs run again.

## Build cost and order

| Part | What | Size |
| --- | --- | --- |
| Now | Record Mike's answer; send the note to the Notion session; fix the routing text in `memory-find` | Very small |
| Phase A | Decision type, `work_items`, filters, commands, `work show`, approve and answer paths, briefing, hooks, doctor, skills, model changes, tests, for built-in and Hindsight | Medium to large: every layer changes a little, and no single piece is hard |
| Phase B | Notion: Kind `decision`, Lore columns, Decision ID, Work item IDs, the relation, the Decisions view, the live test | Medium, with risk: the relation is untested |

**Order:**

1. **Now, before the final checklist.** Only what is right whichever way Mike
   answers and does not reopen a finish item:
   - record his answer in `dev/GOAL.md` and `dev/model-changes.md` item 6;
   - send the "Notion work tracker refinement" session one note: leave room for
     a two-way relation from Memories to Work Items, a "Work item IDs" column,
     and a Decisions view. That session is designing the Work Items database
     now and owns `notion/schema.mjs` and `notion/ensure.mjs`
     (`dev/archive/handoffs/notion-work-tracker-prompt.md`);
   - fix `memory-find` so it does not contradict `S/AGENTS.md:21`, once the
     running skills workflow (`wf_6e6bebee-68e`) stops editing skill files.
   - The `WI-012` search split is a real defect. Fix it now only if no running
     workflow is editing `lib/memory/`; otherwise list it in the final report
     and fix it first in Phase A.
2. **The final checklist and report** (finish items 10 and 11). The report
   lists this design as an open decision with its answer.
3. **Phase A** as the next work item, in its own worktree. It does not touch
   `lib/notion/`, so it can run alongside the Notion session. In Notion memory,
   the new fields sit in "Other fields" until Phase B.
4. **Phase B** inside the Notion work tracker refinement build, or right after
   it, because both change the same two files and the relation points at the
   Work Items database that session is reshaping. Phase B answers Mike's open
   request (`dev/archive/model/progress-2026-09-29-to-2026-10-02.md`).

If Mike wants it inside the current goal instead, it becomes a finish item and
items 9 and 10 run again for the memory and work parts.

## Weakest points

- **The agent still has to notice that a decision was made.** The commands
  make a record correct, linked, and findable, and the approve and answer
  paths create it without a separate step. A decision said in passing ("eh,
  PDFs are fine") gets a record only if the agent recognizes it. The hook
  phrases catch common wordings, not all. `toolkit memory find` still finds a
  decision written in the wrong place, but it will not appear in the by-item
  list.
- **With built-in memory or Hindsight, decisions live on one computer.** The
  backup folder is the only copy elsewhere, which is why it becomes required.
- **Hindsight has no screen.** Mike sees decisions only in chat or in the
  exported `DECISION-INDEX.md`. That is true of all Hindsight memory, which he
  accepted when he chose it.
- **A fifth prefix, one day after Mike settled on four.** `decision_` joins
  `user_`, `project_`, `reference_`, `event_` (`dev/GOAL.md:110-117`).

## Other options considered

- **Keep decisions with the work (design B):** a Decisions table on each work
  item plus `DECISIONS.md` with a Work items column. Turned down: decisions
  keep three homes (item, file, rules), and the agent must pick the scope when
  it writes, although a decision's scope often grows later. In Notion, rows
  inside a card's body cannot be filtered or linked, which works against
  Mike's request to tie memories to work items there. For GitHub and Jira,
  "all decisions by work item" stays manual. Its reason labels are kept in
  this design.
- **Put every decision, item ones included, in `DECISIONS.md`.** Every decision
  would need a commit, parallel sessions would edit one table, item decisions
  would be committed while their items are not, and nothing would show in
  Notion.
- **Generate a committed `DECISIONS.md` from memory.** It needs a commit on
  every decision, and Git merges generated files without a conflict and leaves
  them wrong.
- **Decisions as `event_` records.** An event is a past episode; a decision
  stays in force until it is replaced, so "current decisions" would need a
  second filter.
- **Decisions as sections inside concepts.** A section has no ID, no work item
  list of its own, no replacement chain, and no Notion row of its own.
- **A real `decisions/` folder in `.memory/`.** Covered under "Where to push
  back".

## Open questions for Mike

1. Move every decision already made, for the whole project or for single work items, into memory as one record per decision, and remove `DECISIONS.md` from the model (this reverses approved change 6)? Recommended: yes.
2. Add a fifth memory prefix, `decision_`, with one record per decision the way `event_` works? Recommended: yes, because a decision needs its own ID, status, work item list, and replacement history.
3. Show decisions as flat `decision_` files plus a generated index grouped by work item (in Notion, a Decisions view), instead of a real `decisions/` folder? Recommended: yes, because it works the same in all three memory systems and groups by work item.
4. Keep plain approvals (requirements, design, result, Done) only on the work item, and create a decision record only for a choice, a condition on an approval, or a reversal? Recommended: yes.
5. Move the standing merge instruction to your owner-preferences rule and the Jira status map to `.toolkit.json`? Recommended: yes, because one is an instruction for agents and the other is a setting.
6. When you say yes to a list of recommendations, record each item as its own decision with the reason you were shown, or "reason shown: none"? Recommended: yes; this is the rule that would have answered today's question.
7. Tie every memory, not only decisions, to the work items it names, with a real Notion link on the card when tracker and memory are both Notion? Recommended: yes; this is your 2026-09-29 request.
8. Make the backup folder required for projects on built-in memory or Hindsight? Recommended: yes, because decisions would no longer be in Git.
9. Build this after the current goal's final checklist, with the Notion part inside or right after the Notion work tracker session, and send that session a note today? Recommended: yes.
