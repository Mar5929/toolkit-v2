**Verdict.** Criterion 1 (one home, no two "current answers"): partly. Criterion 2 (find the answer, its source, the affected work): yes. Criterion 3 (find by subject without the agent): partly.

Paths are inside the run folder `org-merge-01-a1/`.

| Event | Where recorded | Right home? |
| --- | --- | --- |
| Kickoff: purpose, scope, people, phases | `PROJECT.md`; `PROJECT-ROADMAP.md` P01–P05; PT-01 | Yes |
| Workshop notes and recording | `sources/` SRC-001; SRC-002 as a row only | Yes |
| How each org sets the owner today | `reference/current-system/account-ownership.md` | Partly (problem 7) |
| Dan's 30% claim | `memory/project_baltic_freight_accounts.md` | Yes |
| Priya's proposal; customer ID question | `DECISIONS.md` DEC-001, DEC-002, both Open | Yes |
| Dan's export | PT-02 (due date assumed, and marked) | Yes |
| Who decides | `PROJECT.md`, "People and ownership" | Yes |
| Helen's answer | SRC-003; DEC-002; `system/data-model.md` DAT-01, DAT-02 | Yes, with overlap (problem 2) |
| Work item | WI-001 | Yes |
| UAT test | WI-001 Recent History; sandbox noted in `PROJECT.md` | Yes |
| Cutover and production load | `PROJECT.md` lines 6 and 19; WI-001 line 65 | No (problem 1) |
| Helen's change | SRC-004; DEC-003 (DEC-002 Superseded); DAT-02; WI-001 | Yes |

**Problems, most important first**

1. **The cutover has no delivery record, and the status fields contradict it.** `AGENTS.md` line 111 sends a data migration to `delivery/`, which holds only templates. Its forms cover a mapping and a release plan; none fits "the owner reports a load ran". After the cutover, DAT-01 and DAT-02 still say Approved, which `system/AGENTS.md` line 66 defines as "No work item has built what the rule says yet". WI-001 says Backlog, P05 Cutover says Not Started, and `memory/CURRENT_STATE.md` says "Now: None". Only `PROJECT.md` says the org is live.
2. **The decision and the rule hold the same sentences.** DEC-003 (line 63) and DAT-01/DAT-02 (lines 18, 25) both read as the current answer. A one-clause change also needed a whole new decision that restates the unchanged customer ID, and marked "Which customer ID the merged org uses" Superseded although the ID did not change.
3. **The legacy field rule had two possible homes.** Who can edit a field belongs in `system/security-model.md` by the guide. The agent kept it in DAT-02, and the security model says "No rules yet".
4. **One reading of the agent's is recorded as Helen's decision.** "Second year read-only for everyone" is in DEC-003 and DAT-02 unmarked. Only reply 8 says it is the agent's reading.
5. **A question for work that has no item yet had no clear home.** Reply 4 proposed `DECISIONS.md` for "how does each Baltic Account get an ERP number"; reply 5 put it in WI-001 as Q-01. "ERP integration and reports get their own items later" is only in WI-001 line 82.
6. **Helen's authority is restated.** It is in `PROJECT.md` once, then repeated with a pointer in DEC-001, DEC-002, and DEC-003 (lines 42, 53, 64). Her `PROJECT.md` row names decision IDs, so the change needed its own commit (`ea978a4`).
7. **The current-system file.** `reference/AGENTS.md` line 49 says "observed facts only"; the file holds workshop statements, each marked "not seen in the org". Line 41 requires the owner's yes to commit, so it stayed uncommitted and the agent asked in seven replies.

**Boundary tests**

- **Claim and proposal:** pass (memory line 22, DEC-001 Open), apart from problem 7.
- **Source pointers and the recording:** pass (`sources/README.md` line 8).
- **Authority once:** partly (problem 6).
- **Owner's answer:** partly (problem 2).
- **Staging test:** pass (WI-001 line 66; rules unchanged).
- **Later change:** pass; no record was found left wrong.
- **Nothing invented:** partly (problem 4); other assumptions are marked.

**Fresh session's answer.** Every statement matches the files, and it changed nothing. It repeats the unmarked second-year reading as the rule.

**Finding things from `PROJECT.md` alone**

- **(a) Customer ID rule:** found. `DECISIONS.md` has three entries; DEC-002 points to DEC-003. Through `system/` a person must guess among seven documents.
- **(b) Who decides ownership:** found at once in the people table.
- **(c) Workshop on Baltic's owners:** found at once: `sources/README.md`, then SRC-001.
- **(d) Production load:** a person looks in `delivery/` and finds nothing. The answer sits in the "Purpose" cell of the Baltic row in `PROJECT.md`, with no date.
- **Also:** "Tracker: `local`" does not tell a person to open `work-items/`.

**Agent's process**

- **Reply length:** 280 to 470 words for messages of two to four lines, each ending with a "Sources" list and repeated "still waiting" lines.
- **Unneeded questions:** the ERP system (reply 1); a Discovery work item when Mike only asked what was open (replies 2 and 3); permission to record a question (reply 4); starting WI-001 after Mike said not yet (reply 6).
- **A question it did not ask:** reply 8 said production may not match the new rule and no work item covers it, but did not ask whether to make one.
- **Correct:** it made WI-001 without asking when Mike asked for it.
- **Test artifact:** the cutover date question came from all eight messages running on one day.
- **Salesforce files:** the migration templates, cutover template, component tracker, and `tests/` were all unused. None got in the way. Three setup lines about connecting an org stayed in the Current State throughout.

**What worked well.** Sources stayed unchanged with one ID each, and every claim and question points to SRC-001. Superseding kept the earlier answer reachable, and the change reached every record. Unchecked figures and assumptions are marked where they sit.
