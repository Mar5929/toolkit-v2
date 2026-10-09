# Project filing and lifecycle: working design

Tracked in Notion work item TKV-24, "Define the project lifecycle and filing
system." TKV-4's HarborDesk review and TKV-21's Claude-Obsidian evaluation
follow the approved design. TKV-19 remains Done for earlier project-wide
records work.

Status: Interview draft, 2026-10-04. This is not an approved Toolkit V2 design or a setup template. The owner is being interviewed one decision at a time. Do not copy this file into a client project. During design, inspect existing files and recommend a better end-to-end pattern when justified; explain which earlier owner choice it would change.

## Goal

Define one lifecycle and one set of record types that works for a Salesforce client project and a SaaS product project. A project may keep work items locally, in Notion, or in GitHub Issues, and memory locally, in Notion, or in Hindsight. Those choices select a storage adapter; they do not change what a source, question, requirement, decision, design, or verified system fact means.

## Current setup facts to preserve or resolve

Baseline checked on 2026-10-04: the main checkout is behind `origin/main` by
three commits. The merged TKV-19 model is present in `origin/main`; TKV-4's
newer review edits are on `codex/tkv4-review`. Use those refs when reviewing
the shipped and pending structure. Do not infer absence from the older main
checkout.

| Current rule | Evidence | Design consequence |
| --- | --- | --- |
| Setup copies one model and then removes files for choices not selected. | `plugins/toolkit/skills/project-setup/references/setup-copy.md` | Define the common model before the choice-specific removals and additions. |
| Setup asks for project and owner, work tracker, memory store, Salesforce, and `SOUL.md`. | `plugins/toolkit/skills/project-setup/references/interview.md` | The interview can stay short if the filing rules do not require another optional switch. |
| Local work items and local memory are Git-ignored; external trackers replace their local work records. | `plugins/toolkit/skills/project-setup/references/setup-copy.md` | A shared project record must not depend on the tracker or memory folder existing. |
| Salesforce client files go in `delivery/`, even when relevant to one item; non-Salesforce item sources go in item `references/`. | Model `AGENTS.md` and work item template | Source placement currently changes with the platform. Set one source rule, then define a narrow platform exception only if needed. |
| `delivery/` is removed for non-Salesforce projects by setup. This was an earlier owner-approved choice. | `dev/GOAL.md`, approved content changes item 16; `setup-copy.md` | Do not assume a general output folder is approved. Test the choice against SaaS releases, migrations, and handoffs. |
| `PROJECT.md` calls `system-guide/` optional, while the model `AGENTS.md` lists it as a standard current-system location. | Model `PROJECT.md` and `AGENTS.md` | Decide whether current-system records are universal and how an empty or new system is represented. |
| Work items have frontmatter; local memory has frontmatter; requirements and system-guide records use body fields. | Model templates | Define a small cross-record metadata contract and map it to each storage system without forcing Hindsight into a file schema. |

### Boundaries that are still unclear in the newer TKV-19 model

| Adjacent homes | What the newer model says | Confusion to test | Working direction, not approved |
| --- | --- | --- | --- |
| `PROJECT.md` people table and `project-wide-records/people/` | Add a detailed person record when the short table cannot hold needed authority. | A change of role may be updated in one place but not the other. | Make `PROJECT.md` a pointer and brief roster; one person record owns detailed authority and its evidence. |
| Work-item Q&A, shared question, and memory | The item Q&A owns an answer; the shared question coordinates impact; lasting context may also go to memory. A project-wide decision with no item is routed through memory. | A shared decision with no item may lack a durable, inspectable canonical record when memory is optional or selected. | Give project-level decisions a canonical project record; treat memory as recall and keep item decisions in the owning item. A shared question points to whichever decision owns the answer. |
| `requirements/` and work-item requirements | An item owns drafts. `requirements/` holds accepted behavior, but the root instruction says update it at Reflecting while the template permits approved future requirements. | An approved rule waiting for delivery has no obvious canonical published home. | Publish approved behavior when approved, with a separate delivery or verification state. Do not treat approval as deployment. |
| `system-guide/` and `project-wide-records/target-architecture/` | The former is verified current structure; the latter is intended shared direction. `PROJECT.md` calls System Guide optional while root `AGENTS.md` lists it as a normal location. | A human sees two architecture homes with different names and may put design under the wrong one. | Consider one `architecture/` area with explicit current and target subfolders and evidence/status fields, while item-only design stays with its item. |
| `delivery/`, work-item references, and intake | Salesforce originals go in `delivery/`; other originals go in an anchor work item, even if they later affect several items. Intake exists only after a source becomes cross-item. | The same kind of workshop source has a different home by project type, and the arbitrary anchor item may close or move. | Test a project source register or stable locator for every source; keep the original in its approved location. Preserve Salesforce deployment-specific files separately from general source intake. |
| `tests/`, item test result, and verified current system | The test plan lives under `tests/`; item status and system guide also depend on checks. | A passing staging test may be mistaken for production behavior. | Give test evidence a precise environment and item link; update verified current structure only from evidence for that environment. |

The current model's domain maps are navigation records, not a separate copy
of requirements or architecture. Test whether the same route can be made
clear in the project index before keeping a domain-map file for each area.

### Coverage check against the latest model (2026-10-04)

Checked `codex/tkv4-review`'s model `AGENTS.md`, its tracked file list, and
`project-setup/references/setup-copy.md`. This is a check of the current
instructions and scaffold, not a judgment that every folder should stay.

| Org-merge need | Current route and file evidence | Gap to resolve in the future model |
| --- | --- | --- |
| Kickoff outcome, owner, and known systems | `PROJECT.md` and its people table are copied for every project. | The front door needs to point to actual maintained records as they appear, without duplicating their details. |
| Discovery plan and unsettled project scope | Project phases and tasks live in the chosen tracker; the model has no named discovery-plan form. | Decide whether a planning artifact earns a durable home and how it differs from the tracker roadmap. |
| One stable entry for a workshop recording | Non-Salesforce item source goes inside its item; a Salesforce client file goes in `delivery/`; cross-item processing alone gets `project-wide-records/intake/`. | Q-02 requires a common locator even when a source first affects one item. The existing three routes do not supply that contract. |
| Claim about present behavior in each org | `system-guide/` holds verified current structure; item notes can hold the unfinished investigation. | Give claims and observations a visible state and source without presenting them as verified system facts. |
| Shared customer-ID question and answer | `project-wide-records/questions/` coordinates affected items; a work-item Q&A or project-wide decision source owns the answer. A no-item project decision goes through chosen memory. | The accepted answer must be findable by a human independent of the memory choice. Define a durable current-answer home and keep Q&A as history. |
| Authority over customer identity | `PROJECT.md` has a short people table; `project-wide-records/people/` has a detailed form. | Specify when the detailed record appears and which copy owns changes in decision authority. |
| Approved rule before build | `requirements/` is described as agreed behavior, but root `AGENTS.md` says to update it when an item reaches Reflecting. | Set the publish point for approval and keep delivery state separate. |
| Proposed and approved target structure | `project-wide-records/target-architecture/` holds shared target direction; one-item design stays with the item. | Define when a target becomes shared and how each statement shows proposal versus approval. |
| Test and cutover proof | `tests/` holds test plans; Salesforce `delivery/deployment/` holds deployment records and cutover forms. Setup removes `delivery/` outside Salesforce. | Define a general proof and output route for a SaaS release without assuming the Salesforce-only folder should become universal. |
| Work progress and next session | The chosen tracker owns item status and Next action; Current State points to active work. | Keep this single-tracker boundary while making the source and accepted-answer links mandatory on each affected item. |

Two current instructions also collide on a project decision made before a
work item exists: one row sends a project-wide no-item decision to memory;
another creates a new work item for a decision about something that is not
an item yet. The future procedure must classify whether there is actual
work to do before creating an item. The interview has not yet selected the
canonical home for the current project answer.

### Changed-answer check against the existing procedure

The latest `managing-project-wide-records` skill already does several useful
things: it keeps the old item Q&A row, adds a new answer event, reopens a
shared question's incorporation checks, reads each affected destination
back, and closes the question only after those checks succeed. Preserve
those behaviors. The following seams need a single rule in the future
system:

1. **Entry point:** a corrected source or spoken owner change must find
   the existing source entry, question, affected items, and maintained
   answer. The current source-intake procedure runs only for cross-item
   sources and assigns a non-Salesforce source to an anchor item.
2. **Authority:** an item Q&A keeps the exact dated answer when an item owns
   the choice. A no-item project answer currently follows the memory route.
   The current applicable rule needs a human-readable home even when memory
   is Hindsight or a save was declined.
3. **Impact:** the shared question lists every known affected item and
   project record. Search beyond that list for later references before
   claiming incorporation is complete; the list may be stale.
4. **Approval:** changing an accepted requirement or approved target must
   follow its approval rule. A newly spoken answer is not automatically a
   revised approved requirement or a deployed change.
5. **Readback:** each affected record gets an outcome and date: updated,
   checked with no change, still open, or blocked by conflict. The question
   closes only when none remain open.
6. **Recall:** update or qualify memory through the selected memory process.
   It cannot become the only copy of the new answer, and an old memory hit
   must lead back to the maintained record before the agent relies on it.

The eventual skill changes should assign one owner to each of these steps,
so `managing-work-items`, project-record procedures, and tracker/memory
storage skills do not each attempt the same update.

### Decision and memory boundary to test (TKV-24 Q-03 and Q-04 answered)

The newer model's local `memory/decision_template.md` already permits a
project-wide decision with no work item, after the owner's yes. The root
`AGENTS.md` instead delegates that decision to the selected memory system.
Local and Notion memory need a manual save decision; Hindsight saves sessions
and retrieves them through its own add-on. Thus the existence and shape of a
project-level decision currently depend on the memory choice. In the item
process, Questions and Answers retain the owner's exact answer and date,
while a shared question links to that answer and tracks incorporation. This
is the present overlap the owner is being asked to resolve.

Mike's 2026-10-04 response to TKV-24 Q-03 rejects a giant collection of
individual, bite-sized decision files. The filing system must let him browse
by subject in VS Code and find the current answer even when no agent is
available. Revise the candidate boundary around maintained subject records,
not one file per decision:

| Case | Current decision | Historical evidence | Recall |
| --- | --- | --- | --- |
| A decision affects only one work item | That item's Q&A answer and applicable requirement or design | Original Q&A row and source link | Chosen memory system may link to the item when its own process calls for a save. |
| A decision governs a business or system subject across items | A maintained subject document, under an obvious area such as `domains/customers/`; one decision section holds the current answer, scope, status, and links | Owner's Q&A row, meeting, or dated conversation linked from that section | Memory may point to the subject document; it is not the authority for its current wording. |
| A decision governs project operations or scope rather than a subject | A clearly named section in `PROJECT.md` or one maintained project-level document if it outgrows that section | Owner's Q&A row or dated conversation and its source entry | Memory may point to the maintained section. |
| A shared answer changes | Revise or supersede the relevant section and reconcile affected records | Keep the earlier answer and its source reachable | Refresh or qualify any memory pointer through the chosen memory procedure. |

Candidate decision-section fields: a stable section anchor, one-sentence
current answer, scope, how to apply it, status, approver and decision date,
source entry or Q-ID, affected work items, and a superseded-answer link when
needed. This is a section within the subject's maintained document, not a
new file for every answer. A shared question points to the section and
closes only after every affected destination is checked. For the org merge,
the customer-ID decision would be in the Customers subject document. A
person looking for it would open `PROJECT.md`'s list of real project areas,
then Customers. The exact folder and file names remain to be tested.

#### Subject-first folder option from Q-04 (not accepted)

```text
PROJECT.md                    Project purpose, scope, real subjects, owners, and setup choices
subjects/
  customers/
    CUSTOMERS.md              Current approved customer behavior and shared decisions
    CURRENT-SYSTEM.md         Observed implementation, with environment and evidence
    TARGET-DESIGN.md          Intended shared structure, with proposal/approval state
sources/
  <one entry per retained original or source bundle>
templates/
  SUBJECT.md
  CURRENT-SYSTEM.md
  TARGET-DESIGN.md
  SOURCE.md
```

At setup, `subjects/` and `sources/` would be empty but present; the
templates would be real and the root `AGENTS.md` plus a project skill would
state the filing procedure. The Customers folder above appears only after
the project actually has a Customers subject. `PROJECT.md` lists real
subjects, with a short link to each, so a human has one starting point.
The shown files divide by question: `CUSTOMERS.md` says what the approved
behavior or direction is; `CURRENT-SYSTEM.md` says what has been verified in
a named environment; `TARGET-DESIGN.md` says what may be built. A proposed
target does not alter current-system facts. If a subject needs more detail,
split by a recognizable subtopic, not by one file per decision.

Mike did not accept this as the answer. It remains one comparison option,
not the selected design. He asked to walk the org-merge project from setup
through planning and discovery, see the records that arise, and then compare
the current Toolkit V2 folders with a planning-centered layout and other
options. The candidate would replace the current separate `requirements/`,
`system-guide/`, and `project-wide-records/target-architecture/` routes with
subject folders and explicit file roles. `project-wide-records/domains/`
would become the real-subject list in `PROJECT.md`, rather than another map
that can drift. Shared questions and people/authority still need precise
homes; do not assume every such record belongs in a subject folder. The
existing files and setup procedure would require a migration plan before
this could ship. This proposal is intentionally different from the current
model and awaits scenario testing and Mike's approval.

Simplification to test: keep a shared question in the document for the
subject it is about, with its ID, status, affected work IDs, and
incorporation checks. Other subjects link to that section when affected.
Keep the cross-record processing result in the source entry itself rather
than creating a second intake-receipt file. This would remove the current
`project-wide-records/questions/` and `intake/` folders as separate active
homes. An item-only question still lives in its work item's Q&A. A person
with authority across several subjects could have one detailed `people/`
record, while `PROJECT.md` keeps only the short roster. Test this against
large workshops and answer changes before deciding whether the subject and
source files would become too crowded.

**Human lookup test:** with the agent unavailable, Mike opens `PROJECT.md`,
follows Customers, and reads the customer-ID section in `CUSTOMERS.md`.
That section gives the current answer and approval source. It links the
workshop's source entry and affected work IDs; he does not need to inspect
every work item to know the current policy.

**Agent resume test:** on an Account migration item, the agent reads the
item's Current state and Sources list, follows source IDs to the meeting
entries, reads Customers for the current approved rule, checks the shared
question if open, then resumes the item's Next action. The work item does
not keep a competing copy of the current project rule.

### Source placement in the current tracker choices

| Tracker | Current item source location | Cross-item problem |
| --- | --- | --- |
| Local | `work-items/<ID>/references/`, Git-ignored | One source relevant to several items has no stable common home; copying it creates competing originals. |
| Notion | The item's Files property, with a Sources line in its page | A file attached to one item has an arbitrary owner when it later affects other items. |
| GitHub Issues | Text in a source comment; other files require an owner attachment | A source comment belongs to one issue, and the same original may need links from several issues. |
| Salesforce exception | Client material in `delivery/` | Placement depends on project type rather than the source's purpose or sensitivity. |

Owner decision, TKV-24 Q-02, 2026-10-04: give every original source one canonical entry or stable locator, regardless of whether it first affects one item or several. A work item links to that source and names what it contributed. The original stays in its approved storage location when it is sensitive or large. The common entry carries title, kind, date, location, access limits, version or integrity cue when needed, and related record links. This rule can be implemented with Markdown, Notion, or GitHub links without requiring the work tracker to own the original. Mike's reason: when work resumes the next day, the agent should find the work item's meetings and other source context from that item.

Example to discuss with Mike: a Salesforce org-merge workshop recording and transcript stay in the client's approved SharePoint folder. One project source entry, for example `sources/SRC-001-account-ownership-workshop.md`, records the date, participants or owner, approved original links, access limit, and the fact that it affects account ownership and duplicate handling. A separate intake receipt routes findings to the shared account-ownership question and two work items; each work item links to `SRC-001` instead of copying the transcript. After approval, the lasting behavior goes in the Accounts requirement; a verified current-system record changes only after evidence of deployment. A later email that changes the answer is a second source entry and triggers an impact check. The path is illustrative, not an approved folder name.

### Source-entry contract to test (proposal, not approved)

"Source" here means a deliberately retained original used as evidence for a
project claim or decision. A meeting's recording, transcript, and notes can
form one source bundle when they describe the same event; list each original
inside the entry. A work-item Q&A row, issue, or commit with a stable ID can
be the locator for its own first-hand evidence. This avoids a second file for
every comment or code file while preserving the one-entry-or-locator rule.

| Field | Why the next agent needs it |
| --- | --- |
| Stable source ID or native stable locator | Lets an item and later records refer to the same source after a file is renamed. |
| Title and source kind | Tells a person whether it is a workshop, email, client document, vendor page, issue, or observed system evidence. |
| Event or publication date; capture date | Separates when the source existed from when the project received it. |
| Original location and owner | Leads to the authoritative original, including one kept in SharePoint or another approved system. Never use a temporary download URL. |
| Access and sensitivity note | Prevents a link from implying that the content can be copied into Git or an external tracker. |
| Version or correction link | Makes a later replacement or changed statement visible without rewriting history. |
| Related work-item and project-record IDs | Lets the next session find the source from the item and find affected records from the source. |

The source entry locates evidence; it does not repeat a transcript or decide
what is true. One-item evidence needs the entry and an item link, but no
cross-record intake receipt. A source affecting several records gets an
intake receipt that lists findings and the destination/readback result. When
a source is corrected, keep the old entry, link the correction, inspect every
related record, and record the result before closing the receipt.

This changes the current skill boundary: `managing-project-wide-records`
currently activates source intake only when a source affects several items,
while `tracking-work-items` stores one-item sources inside the chosen tracker.
Under Q-02, the shared source-entry step applies before either one-item or
cross-item processing. The tracker skill still stores item links and item
context; the shared procedure owns the source entry and conditional receipt.
Skill names, descriptions, routing lines, setup copy rules, and tracker source
instructions must all change together after the full design is approved.

The newer TKV-19 design keeps outside documentation under
`ai-external-knowledge/`, client input and deployment output together under
Salesforce-only `delivery/`, and non-Salesforce originals under an anchor
work item. These current routes conflict with a single source rule. One
candidate is a universal `sources/` area for entries and approved captured
originals, with secure originals kept outside Git by link. In that option,
`ai-external-knowledge/` becomes the vendor-documentation part of sources,
and Salesforce `delivery/` stops serving as the general home for incoming
meeting and client source material. This is a structural proposal to test
against migration and existing source records; it is not a folder decision.

## Lifecycle to test

### Design deliverable example from Mike's 2026-10-04 clarification

Mike asked for the workflow around a real output: in an org merge, he may
create a work item to design the data model, use kickoff and discovery
workshops to answer the questions needed for it, and then need the finished
design to remain easy to find. This example is a candidate workflow, not an
approved folder layout.

1. **Start the project.** `PROJECT.md` records the actual outcome and known
   boundaries. The chosen tracker holds a high-level discovery and design
   phase. No data model or fictional entity is created just to fill a form.
2. **Create one result-led work item.** “Design the consolidated customer
   data model” has a specific result: an approved data model with entities,
   identifiers, relationships, migration rules, and unresolved limits. The
   item owns its scope, tasks, workshop questions and exact answers, source
   links, approval, status, and next action. It is a design item, not a
   permanent container for the project's data model.
3. **Use workshops as input.** Each retained recording, transcript, or
   client diagram gets one source entry. Findings relevant only to this
   design go in the item's Questions and Answers or working notes. A question
   that changes several designs or work items gets a shared question with an
   affected-record list. A new work item is created only when a separate
   result must be produced or separately tracked; every granular question
   does not need its own item.
4. **Write the durable output at a stable path from its first useful
   draft.** A candidate is `architecture/data-model.md`, with a clear
   `draft`, `proposed`, `approved`, or `superseded` state for each material
   section, source/decision links, owner, and review date. The work item
   links to that one artifact. It is revised in place as answers arrive;
   the item retains the work and decision history. A large model may split
   by recognizable area under one `architecture/data-model/` route, with an
   overview linking the parts, not by tiny decision file.
5. **Approve the design.** The authorized owner approves a specific
   version or scoped sections. Record the approval event in the item and
   mark those sections approved in the design; leave open sections open.
   Completing this design item means the agreed design output is ready.
   Build and migration items then link to its approved sections and carry
   their own execution, tests, and delivery status.
6. **Change it later.** A later source or implementation finding can open a
   change item if it creates new work. Preserve the old approval event,
   assess affected build items and requirements, and revise the same
   maintained model with a new approval reference. Do not reopen a finished
   design item merely to overwrite its history.

This example exposes a current-model overlap: `requirements/SYSTEM-DATA-MODEL.md`
holds accepted entities and relationships, while a work item's `DESIGN.md`
holds its technical design and `project-wide-records/target-architecture/`
holds shared intended structure. The future rule should separate business
requirements (“what must be represented and constrained”) from the
maintained structural design (“which entities, keys, and relationships will
implement it”), and from the item's work history. `architecture/data-model.md`
is a candidate human-facing home, not yet Mike's choice.

| Moment | Agent action | Record that must stay authoritative |
| --- | --- | --- |
| Project setup | Record scope, owner, systems, setup choices, and starting state. Install routing instructions and forms for the selected choices. | Project context and setup settings. |
| Discovery or workshop | Preserve the original once, classify each material finding, and track destinations and unresolved conflicts. | Original source; intake receipt only for cross-record effects. |
| Plan work | Create or update project phases and work items. Link the source and affected records. | Chosen work tracker. |
| Refine requirements | Keep draft needs, questions, exact answers, and approval evidence with the item. Publish approved shared behavior at its agreed lifecycle point. | Item for draft and decision history; approved requirement record for reusable behavior. |
| Design | Keep a design for one change with its item. Maintain a shared target statement only when several items depend on it; mark each statement's approval separately. | Item design; shared target record when applicable. |
| Build and verify | Update item tasks and tests. Change delivery status only for behavior checked in a named environment. | Work tracker, test evidence, approved requirement, and verified current-system record. |
| Release or handoff | Record what was delivered, where, when, by whom, and with what evidence. | Output or release record; exact home is still open. |
| Changed answer or new evidence | Keep the prior answer and source; search affected records, update or flag each, then verify each destination. | Decision history plus linked question and affected records. |
| Session transition | Point to active items and exact next actions; retain selected durable context for recall. | Work tracker for status; Current State pointer; memory only for selected context. |

## Record types and minimum properties to test

The property names below are conceptual. Local Markdown may use frontmatter or a short header. Notion uses properties and page sections; GitHub uses issue fields, labels, and body sections. Hindsight is a memory store with its own model, so store links or tags it supports rather than cloning this schema.

| Type | Required identity and links | State or provenance that matters |
| --- | --- | --- |
| Project context | Project name, owner, systems, scope | Source and last confirmed date for material facts. |
| Work item | Stable ID, title, parent and related IDs | Type, state, status, owner or `waiting_on`, approval evidence, updated date, next action. |
| Original source or locator | Stable path or URL, source kind, date, owner | Access limit, integrity or version, relevant item or domain links. Do not copy sensitive material merely to fill a folder. |
| Intake receipt | Source link, affected record links | Each finding's destination, open conflict, readback result, completion status. |
| Shared question | Stable ID, exact question, affected records | Answer authority, source, status, answer history, incorporation checks. |
| Person or authority record | Name or role, areas of knowledge, affected questions | Evidence and last confirmation of decision authority; only necessary personal detail. |
| Requirement | Stable rule ID, scope, linked item and source | Approver and approval date, separate delivery status and verification evidence. |
| Item design | Owning item ID, requirements covered | Option status, owner choice with Q-ID, design approval, supersession. |
| Shared target statement | Stable statement ID, scope, affected items | Proposed, approved, or superseded per statement; decision source and dependencies. |
| Verified current-system record | System or area, environment, evidence | Last verified date, known gaps, change source. |
| Test or release evidence | Related item and rule IDs, environment or release | Result, date, performer, evidence location. |
| Memory | Subject and authoritative source links | Save authorization, currency or verification limits, supersession where supported. |

### Org-merge record ledger to test with Mike

This ledger names record roles, not final folders. The labels are examples;
the interview must confirm whether each record is useful and where a human
would look for it. At each moment, create only records supported by real
project information.

| Moment | Create or change | Where the answer would be read | Link that prevents a second answer |
| --- | --- | --- | --- |
| Setup | Project context and chosen tracker/memory settings; empty labeled scaffold and forms | Project front door | Setup settings name the chosen work and memory routes. |
| Kickoff | Actual scope and business outcome; discovery plan; source entry for kickoff notes; phases and tasks in chosen tracker | Project context for scope; plan for unknowns; tracker for assignments | Plan links to phases and source entry, rather than copying task status. |
| First Accounts workshop | Source entry for original recording; claims about each org; proposed target; open shared customer-ID question; investigation item | Source for what was said; current-system record for supported observations; question for unresolved choice; item for next action | Every claim and question links to the same source entry; item links to question and source. |
| Authority confirmed | Person or role record with decision scope and evidence | Authority record, reached from question or project roster | Question points to the authority record, rather than copying a person's role in several items. |
| Owner answers | Preserve dated answer in its decision event; change the shared question to answered then incorporating; update accepted rule and target statement only for its approved scope | Maintained rule or target statement for the current approved answer; decision event for exact wording and date | Question checks affected records, then points to their revised sections before closing. |
| Staging verification | Item tasks and test result with environment, date, and evidence | Item for progress; test result for staging proof | Approved rule stays approved; production current-system statement is unchanged. |
| Production cutover | Release or cutover evidence and production verification; update production current-system statement; complete affected items | Current-system record for what runs now; release evidence for how it was proved | Current-system statement links to exact production evidence. |
| Owner changes answer later | New source entry and answer event; reopen shared question; mark affected records for review, then reconcile each | Question for outstanding impact; maintained rule for current approved answer | Old answer remains reachable; memory pointers are refreshed only through chosen memory procedure. |

**Duplicate check:** the exact answer event and the maintained answer have
different purposes. The event proves what the owner said at a time; the
maintained statement tells a human what currently applies. The question
tracks whether every affected record reflects that answer. A work item
tracks action. If two records each claim to be the current answer, the
filing model has failed this test.

### State fields must answer different questions

A single `status` field cannot describe every record in the org-merge
example. The following are separate facts, even when several apply to one
subject. These are conceptual states to validate, not final property names.

| Question | Candidate values | Example at the end of discovery |
| --- | --- | --- |
| How well is a statement about the current org supported? | client claim, observed, verified, disputed, stale | A workshop claim about Org B's ID field is `client claim` until an org inspection confirms it. |
| Has a future rule or architecture choice been authorized? | proposed, approved, superseded, withdrawn | Use of the parent customer ID is `proposed` until the named decision owner approves it. |
| Where has approved behavior been delivered and checked? | not delivered, in progress, staging verified, production verified | An approved matching rule may be `staging verified` while production still uses the old process. |
| Is a shared question resolved and incorporated? | open, answered, incorporating, closed, reopened | After the owner answers, the question remains `incorporating` until all linked records have been checked. |
| Where does a work item stand? | The chosen tracker's lifecycle state and status | The migration item can be in Testing Loop even while the project rule is approved. |

The project should show these states in ordinary words near the relevant
statement. Do not make a person infer production truth from an item marked
Done or from a memory hit. Each statement needs its own evidence and date;
an entire document does not become verified because one section was checked.

### Minimum retrieval and update procedure to test

1. For a project question, start at `PROJECT.md` and follow the route to the
   maintained project statement, open question, or verified current-system
   record. Read its scope and evidence before answering.
2. For active work, open the chosen tracker's item by stable ID. Read its
   Current state and Next action, then follow its source IDs and project
   record links. Do not reconstruct the work from memory alone.
3. For a meeting or document, use its one source entry or stable native
   locator. Preserve the original once. Record which findings are claims,
   which destinations changed, and which questions remain open.
4. On a changed answer, preserve the old answer and source, identify affected
   item and project records, update each authoritative destination through
   its owning procedure, read each back, and close the shared question only
   when the incorporation list is complete.
5. On release, link the exact deployment or data-load evidence and its
   environment. Only then update the verified current-system statement for
   that environment. Update memory pointers when its chosen process calls
   for it; memory does not override the project record.

The storage mappings remain to be finalized. Local, Notion, and GitHub
trackers each own the same work-item fields by their own mechanisms.
Local, Notion, and Hindsight memory can help recall context but have
different save and retrieval behavior. The project route and record meaning
must remain the same across these choices.

### Filing decision procedure for an agent (candidate)

Apply these checks in order to each distinct statement or artifact in a
conversation, workshop, or file. One source may lead to several destinations;
do not force the whole meeting into one folder.

1. **Is this original evidence?** Keep the original once in its approved
   location. Create or use its stable source entry/locator and link it from
   every record that relies on it. Do not treat the source as the project's
   accepted answer.
2. **Is this a request for work, a task, an item-specific question, or the
   exact answer to one?** Use the one chosen work tracker. Its item owns
   status, next action, approval event, design for that item, and task
   history. Use the stable source ID in the item's Sources section.
3. **Does a question or answer govern several items or the project?** Put
   the open issue and its affected destinations in the project's shared
   planning/decision route. Keep the exact owner answer and date in its
   original decision event; publish the current cross-item rule only after
   approval. Do not make memory the only authoritative home.
4. **Is it a statement of present system behavior?** Mark whether it is a
   client claim, observed, verified, disputed, or stale. A maintained
   current-system record needs environment, date, and evidence. Do not
   promote a workshop claim into a verified fact.
5. **Is it intended behavior or structure?** Keep proposal, approval, and
   delivery state separate. A work item's draft belongs with the item;
   accepted reusable behavior and shared target direction belong in their
   maintained project records, linked to the approving answer and item.
6. **Is it proof of testing, release, migration, or cutover?** Record the
   exact environment, date, result, item/rule IDs, and evidence. Update
   current-system truth only for the environment proved by that evidence.
7. **Would later recall help?** Review the chosen memory procedure. Any
   memory saved or automatically recalled must point back to the current
   project or work record and be checked before it is used as an answer.

**Readback rule:** after saving a source entry, item, shared question,
requirement, architecture statement, or release result, reopen it and verify
the links and state. If a save fails, keep the parent item or question open
with a precise next action instead of claiming the intake is complete.

### Storage choices do not change the route

| Kind | Local work + local memory | Notion work + Notion memory | GitHub work + Hindsight memory |
| --- | --- | --- | --- |
| Work item, Q&A, tasks, status, Next action | Local work-item files through the tracker skill | Notion Work Items and task/phase databases through the tracker skill | GitHub issue, sub-issues, labels, and milestones through the tracker skill |
| Original source and stable locator | Same source rule; item stores the source ID/link | Same source rule; item page stores the source ID/link | Same source rule; issue stores the source ID/link |
| Maintained project context, shared questions, requirements, and architecture | Same project-record route | Same project-record route | Same project-record route |
| Current State and longer recall | Local memory process and files | Notion memory process and databases | Current State pointer plus Hindsight add-on behavior; verify against project/work records |

The table shows three representative combinations, not different lifecycles.
It also does not decide whether every maintained project record must be a
local Markdown file. Mike's requirement to browse answers in VS Code when
the agent is unavailable is strong evidence for a readable local project
layer, but that exact authority and the migration of existing Notion-only
information still need explicit design review.

## Placement tests before finalizing folders

1. One workshop discusses a Salesforce Account ownership rule, three work items, a person with limited decision authority, and a proposed target design. The owner changes an answer a week later.
2. One SaaS design session covers a large feature across authentication, billing, and support. One requirement is approved while another remains open; one shared architecture statement is still proposed.
3. A source applies to one item at first, then becomes relevant to several items. The agent must preserve one original and update its links without competing copies.
4. A build passes tests in staging but has not reached production. The requirement, current-system record, release record, and work item must not claim the same status.
5. A project switches work tracking from local files to Notion while keeping local memory, then later uses GitHub Issues with Hindsight. The record meanings and lifecycle must remain stable.
6. A fresh agent starts after context clears. From setup instructions and current pointers, it must find the source, current decision, open question, approved requirement, proposed design, verified state, and next action without guessing a folder.

### Scenario A: org-merge workshop and changed answer

Start with a fictional acquisition: Parent and AcquiredCo each have a
Salesforce org with about 1,000 users. For this walkthrough, work tracking
and memory are in Notion, but the project files below remain visible in VS
Code. The client keeps recordings and restricted originals in its approved
SharePoint area. These are example setup choices, not a required combination.

| Early event | What becomes known and what the agent does | Current Toolkit V2 route | Planning-centered option to test |
| --- | --- | --- | --- |
| Setup, before discovery | Confirm project purpose, owner, the two orgs, tracker/memory choices, and access limits. Create the full labeled template scaffold, with no fictional findings or decisions. | `PROJECT.md`, root `AGENTS.md`, copied templates, Notion project setup. Salesforce `delivery/` is copied. | Same setup facts, with a visible `planning/` area ready for actual discovery, current-state, target, and shared questions. No fabricated records. |
| Kickoff and rough roadmap | Record the business outcome and boundaries; create real project phases such as Discovery, Design, Build, Test, and Cutover only after Mike agrees. Name known stakeholders and unknown decision authorities. | `PROJECT.md` context and people table; project phases in Notion. | Keep `PROJECT.md` as the project front door and Notion as the only work tracker; planning documents point to the roadmap rather than copying its task status. |
| First document intake | Receive org diagrams, a statement of work, integration lists, and meeting recordings. Give each retained original one stable source entry or locator under Q-02; preserve sensitive originals in SharePoint. | Salesforce originals under `delivery/`; cross-record receipt in `project-wide-records/intake/` only when a source affects several records. | Consider `sources/` for all entries, with originals either in an approved local subfolder or linked to SharePoint. `planning/` links to sources but does not hold duplicate originals. |
| Current-state discovery | Inventory Org A and Org B data, security, integrations, users, and actual behavior. Mark each statement observed, client-claimed, or unverified, with source and environment. | `system-guide/` for verified structure; `PROJECT.md` for systems; item notes for unfinished investigations. | `planning/current-state/` can hold the two org inventories and known gaps. Test whether that name remains intelligible after implementation starts. |
| Initial target and shared unknowns | Sketch options for the consolidated org. Do not call a proposal approved. Track questions such as customer identity and permission model, with authority and affected areas. | `project-wide-records/target-architecture/`, `questions/`, and `people/`; item Q&A for item-specific answers. | `planning/target-state/` and grouped project questions might be easier to browse during discovery. Test how they stay current later and avoid one giant questions file. |
| Break discovery into work | Create an item when there is a distinct result to produce, such as inventorying integrations or resolving account identity. Link each item to its source entries and shared planning records. | Notion Work Items; item Current state, Q&A, tasks, and source attachments. | Same Notion tracker; `planning/` holds project understanding, not the item's task/status copy. |

The early-stage comparison does **not** decide that `planning/` should be the
permanent home of verified current architecture or approved target design.
That is the next lifecycle test: when discovery ends and work items are
built, should those records stay maintained under `planning/`, be moved to
permanent architecture homes, or be published elsewhere? Avoid a folder
move that breaks stable links or leaves stale copies. Mike asked to walk the
example before choosing among these layouts.

#### Continue the same org-merge example after discovery

| Moment | What happens | Records that change | What must remain distinguishable |
| --- | --- | --- | --- |
| Discovery review | The team verifies Org A and B account fields and integration flows. Some stakeholder claims remain unverified. Mike reviews the proposed consolidation approach and unresolved customer-ID question. | Source entries link to evidence; verified observations update the current-state records; unverified claims remain labeled as such; the project question stays open. | A workshop claim is not a verified current-system fact. A target proposal is not owner approval. |
| Target decision | The authorized owner chooses the parent customer ID for the merged org. The Q&A or dated decision source retains the exact answer and authority. | The shared question records the answer source, then checks every affected target design, requirement candidate, and work item before closing. The target design changes from proposed to approved. | The approved future approach still does not describe either org's present production behavior. |
| Split into delivery items | Create distinct items for Account migration, integration updates, permission design, and reporting changes. Each item gets its own requirement details, design, tasks, test plan, Current state, and source links. | Notion owns item status, approvals, tasks, Q&A, and Next action. Shared project records keep only the cross-item rule and links to affected items. | A project document must not become a second task tracker. |
| Approve detailed behavior | The owner approves the Account matching rule and migration exceptions. | Publish the accepted behavior in its agreed durable home, with approval date and source. Keep the item Q&A as the history and the target design as intended structure. | Requirement approval, target-design approval, and delivery completion are separate states. |
| Build and test | The agent builds against a sandbox and checks migration mappings in staging. A failed mapping creates a new item question and may reopen a project question. | Code/configuration changes, item task status, test evidence with environment, and the question's impact list. | Staging success is not production state. |
| Cutover | Mike reviews the exact production plan and executes the production step under the project's safety rules. The team verifies the merged org after cutover. | Cutover plan, deployment and data-load evidence, release notes, item completion, and verified current-state records for production. | The production current-state record changes only after production evidence. The source and target decision history remain reachable. |
| Later change | A new policy changes the customer-ID rule. | Preserve the earlier answer, save the new source entry, reopen the project question, inspect every affected item and document, and record each incorporation result. | Do not silently overwrite a current answer or let memory, requirements, and architecture disagree. |

**Pressure test for `planning/`:** Discovery notes and draft options naturally
fit there. The approved customer-ID rule, target design, and verified current
architecture continue to be used during build, cutover, and maintenance. If
they remain under `planning/`, the folder must explicitly mean maintained
project understanding, not a closed phase. If they move out later, stable
links and one authoritative copy must be preserved. A third option is to
separate dated planning/discovery evidence from maintained architecture and
requirements from the start. Compare these options only after Mike confirms
the lifecycle and the human lookup route.

#### Folder options to compare after the lifecycle interview

These are filing tests, not setup decisions. All three use the chosen tracker
for work and one stable entry for each retained original. The question is
where a human finds maintained project answers after discovery ends.

| Test | Keep the current role split | Put all project understanding under `planning/` | Keep discovery activity apart from maintained answers |
| --- | --- | --- | --- |
| First workshop | Route verified facts to `system-guide/`, future direction to `project-wide-records/target-architecture/`, accepted behavior to `requirements/`, and cross-item questions to `project-wide-records/questions/`. | Put discovery notes, current facts, target options, and questions under `planning/`, with clear subfolders or document sections. | Put a dated discovery plan and synthesis under `planning/`; publish maintained current facts, approved rules, and target direction in stable role-based homes from the start. |
| Answer approved during design | Update the target record and, under a clarified publish rule, the accepted requirement. The root currently says `requirements/` changes at Reflecting, creating a timing gap. | Keep the answer in `planning/` even after approval. The folder must explicitly stay active through delivery and operation. | Keep the dated answer event linked from an approved requirement or shared target statement. The event stays with its original work or source context. |
| Production cutover | Update `system-guide/` after production evidence; Salesforce deployment proof is in `delivery/`. A SaaS release needs a defined proof home. | Update the `planning/` current-state section after proof. Humans may read “planning” as a finished phase. | Update the maintained current-system statement after proof; link a separate release/cutover record. Discovery history remains unchanged. |
| Owner changes the answer later | Search requirements, project-wide records, item Q&A, system guide, and memory, then reconcile. Several top-level routes must be taught well. | Reopen the relevant `planning/` answer and impact list, despite the project being in maintenance. A large planning folder may accumulate unrelated material. | Reopen the shared question or impact check; revise only the authoritative maintained statements and affected items. Preserve the older event in history. |
| Human in VS Code | Several named folders reflect record roles, but the distinction between `requirements/`, `system-guide/`, and `project-wide-records/` is not obvious from names alone. | One obvious top-level place during discovery; long-lived answers may be harder to distinguish from drafts and dated workshop notes. | Dated work and maintained answers have distinct names; the project front door must route a human to the right one. |
| Migration from today's model | Smallest structural move, but the source contract, no-item decision route, requirement timing, and SaaS release route still need changes. | Largest conceptual change: current maintained records move or are reclassified under `planning/`. | Move or rename overlapping project-wide records, create a common source route, and preserve links to existing requirements and system records. |

The third option currently survives the “approved before build” and “find
the production answer later” tests most cleanly. It still needs Mike's
feedback on the real discovery workflow and on which maintained homes feel
natural. Do not turn this comparison into a folder scaffold yet.

#### Two whole-project layout candidates after the data-model decision

Mike confirmed that a data-model design item ends at design approval and
that its guiding artifact must remain shared across later items. Both
layouts below keep that artifact at one stable path from first useful draft
through approval and later revision. They are proposals, not setup files.

**A. Record-role layout (recommended for testing).** The top-level name
answers what kind of record is here. `PROJECT.md` links the real records that
exist. Folder instructions and record schemas come from root `AGENTS.md` and
the project-record skill; no README is needed inside these folders.

```text
PROJECT.md                 outcome, scope, real areas, owners, links, setup choices
AGENTS.md                  routing rules and skill triggers
GLOSSARY.md                accepted project terms, when needed
discovery/                 dated plans and synthesis; no lasting approved answer
sources/                   one stable entry per retained original; originals may stay elsewhere
questions/                 shared questions grouped by substantial topic
people/                    detailed roles and decision authority when needed
requirements/              approved business and system behavior
architecture/
  observed/                evidence-backed facts about named environments or systems
  designs/                 maintained intended designs; each section shows approval state
    data-model.md           example only after real design work starts
tests/                     test plans and evidence with environment and item links
delivery/                  release, migration, cutover, and handoff outputs
work-items/                only when the chosen work tracker is local
memory/                    only for the selected memory files; external memory stays external
.claude/ .codex/ .agents/   installed skills, rules, hooks, and host settings
<project source code>       force-app/ for Salesforce or the SaaS code tree
```

At setup, create the labeled structure and reusable forms, not the example
`data-model.md` or pretend findings. If Git needs a marker to retain an
empty folder, the marker carries no record content. For a Notion or GitHub
tracker, `PROJECT.md` links to the external roadmap and work items rather
than creating a second local tracker. For Notion or Hindsight memory, the
project points to the selected store rather than copying memories locally.

**B. Area-centered layout.** A person browses first by business or system
area, then record kind. Common project-level routes still exist for sources,
people, and work. Cross-area designs need an explicit shared home.

```text
PROJECT.md
AGENTS.md
GLOSSARY.md
discovery/
sources/
people/
areas/
  customer-data/
    questions.md
    requirements.md
    data-model.md
    observed-systems.md
  identity-and-access/
    questions.md
    requirements.md
    design.md
architecture/shared/       designs affecting several areas
tests/
delivery/
work-items/                local tracker only
memory/                    selected memory files only
.claude/ .codex/ .agents/
<project source code>
```

The area-centered option matches how a human may think about Accounts or
Billing, but a data model or identity decision that spans several areas can
land either under an area or under `architecture/shared/`. That is the
same ambiguity Mike wants removed. The record-role option can still group
files by area inside `requirements/` and `architecture/designs/` when a
project grows, while keeping one answer to “where does a data model go?”

Both candidates would revisit earlier owner-approved choices: today
`delivery/` is Salesforce-only, `system-guide/` is a separate current-system
home, `requirements/SYSTEM-DATA-MODEL.md` holds accepted structure, and
local memory owns the glossary. A universal release-output home and a
project-level glossary are recommendations to test, not silent replacements
of those choices. The exact handling of general architecture versus
requirements and shared questions needs Mike's review.

#### Scope if record-role layout A is selected

Inventory made 2026-10-04 against `codex/tkv4-review` (`dd346d4`), the newer
model review branch. A Git search for the six current location terms
(`project-wide-records`, `system-guide`, `SYSTEM-DATA-MODEL`, `delivery/`,
`requirements/`, `project-file-locations`) found **60 candidate files** in
project setup, its model and skill assets, root README, skill index, and dev
checks. This is a reference inventory, not a count of required edits: some
mentions are examples or unaffected Salesforce deployment instructions.

| Area | Candidate files with those terms | Likely work |
| --- | ---: | --- |
| Model project | 23 | Root routing and project front door, folder AGENTS files, record templates, Salesforce source/output rules; move or replace overlapping folders while preserving the Salesforce guards and deployment forms. |
| Shared project skills and their assets | 19 | Rewrite the project-wide-records route and its boundary with work items; adjust work-item design, source intake, handoff, and document publishing. Review name and description overlap. |
| Tracker-specific skills | 2 found by these terms | Confirm source links and item-to-artifact links in all three trackers; the search does not prove the third tracker needs no edit. |
| Setup instructions and skill front door | 9 | Copy the new universal structure, stop removing any approved universal output folder, update move-over and existing-project refresh instructions. |
| Settings snippets, root docs, and dev checks | 7 | Update referenced paths and checks only where their meaning changes; run validation and routing tests in both hosts. |

The likely implementation is a **medium-to-large text and template refactor**,
not a new runtime. A provisional planning range is roughly 30 to 45
substantive file edits, with up to the 60 reference hits needing review, plus
file moves and scratch-project verification. This is an estimate until the
names and record authority are settled. It should not add a hook or program.
Three separate risks require deliberate migration: links from existing
project records to old paths; client source files currently mixed with
Salesforce delivery outputs; and local, Notion, or GitHub items pointing to
the old design location. Existing projects would update only when the owner
chooses “update the toolkit” for each one; the new-project scaffold can be
changed first and verified independently.

**Human lookup at three dates:** Before the owner answers, the customer-ID
question says open and the target document says proposed. After approval but
before cutover, the accepted requirement and target direction say approved,
while the production current-state record still describes the old orgs.
After cutover evidence, the production current-state record describes the
merged org. The project front door must lead Mike to these distinct answers
without an agent.

| Event | Record read or changed | Boundary test |
| --- | --- | --- |
| A client workshop covers account ownership for both acquired orgs. | Keep the recording and transcript once in the client's approved location. Add one stable source entry under the Q-02 decision; add an intake receipt for the findings routed to several records. | Source location should not depend on which work item heard the answer first. |
| The VP of Sales proposes an ownership rule but has authority only for one region. | Record the role and scope of authority with evidence; keep the cross-item question open. Link the two affected work items. | A person record establishes who may answer, not the answer itself. |
| The authorized owner answers, then changes the answer a week later. | Preserve both answer events in the owning decision record. Reopen the shared question, inspect both work items, the requirement, and target architecture, and log each incorporation result before closing it. | The shared question coordinates changes; it does not become a competing answer. Memory can point to the current decision after its own save rule is met. |
| A change passes staging and later reaches production. | Keep the staging and production evidence separately. Publish the approved rule with its delivery state; update verified current structure for production only after production evidence. | Approval, staging success, and production state are three different facts. |

### Scenario B: SaaS feature design across three areas

| Event | Record read or changed | Boundary test |
| --- | --- | --- |
| Mike and an agent design organization accounts across authentication, billing, and support. | Create or use one top-level feature item with its item design and sub-items. A shared target architecture record exists only for a direction that several items must follow. | An item design describes the change; shared target direction gives other items a stable dependency without copying the full design. |
| Billing's rule is approved, while support ownership remains open. | Publish the approved billing rule with `approved, not delivered`; keep the support question and draft requirement in the owning item. | The published requirements folder must not claim support behavior is approved. |
| The feature is tested in staging, then released. | Store test plan and result with environment, item ID, and evidence; record release or deployment separately; update current-system architecture only for the verified environment. | The `tests/` plan, work status, release record, and current architecture each answer a different question. |
| The project changes tracker from local files to Notion. | Move the work-item record through the tracker migration procedure; keep stable requirement, architecture, source, and release records and their links. | Tracker choice changes item storage, not the meaning or home of project records. |

## Interview decisions still open

1. Initial scaffold: settled 2026-10-04. Create a complete labeled structure with filing instructions and reusable forms. Do not create fictional records. The structure should make every available record type and its format discoverable at setup.
2. Source placement: settled in TKV-24 Q-02 on 2026-10-04. Every original has one common entry or locator, including an item-only source; work items link to it. The exact folder and tool mapping remain design questions.
3. Project-wide decision with no work item: TKV-24 Q-03 recorded Mike's constraint on 2026-10-04. The result must be useful to a human browsing VS Code and must not become a giant set of bite-sized decision files.
4. Subject-based maintained documents: TKV-24 Q-04 answered on 2026-10-04. Mike did not accept the proposed subject-first layout and asked for an end-to-end Salesforce org-merge walkthrough starting with setup, planning, and discovery. Folder names are not settled.
5. Early lifecycle check: TKV-24 Q-05 asks whether the setup, kickoff, and discovery sequence matches Mike's real workflow. Awaiting his answer before continuing the same example through design and delivery.
6. Confirm the common record taxonomy and the precise home for approved behavior, current-system facts, and delivery outputs. Test both project types before naming folders.
7. Decide which properties are mandatory for every record and which belong only to a record type. Keep metadata short enough for humans to maintain.
8. Decide how completed output and release records work across SaaS and Salesforce projects, while respecting the earlier Salesforce-only `delivery/` choice unless the owner changes it.
9. Approve the final folder names, setup contents, and agent routing procedure after the scenarios above expose overlap or missing homes.
