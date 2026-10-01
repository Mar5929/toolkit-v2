# Roadmap and sub-items

How to write an item's roadmap during refinement and when to split a large feature into sub-items. The work track skill holds the rules for levels, phases, and tasks.

## 1. The roadmap during refinement

- Propose the phases as a question, each with a one-line reason. After his answer, save it in the question's row and write the phases in the Roadmap: `P1 — <name>`, its Outcome, Status Not Started, its Exit result (what shows the phase is complete), and its Sub-items ("None." until there are some).
- Name phases by the result they deliver ("P1 — Personas agreed"), not by the kind of work ("P1 — Analysis").
- Leave the build tasks to the later stages. During refinement, add a task only for work refinement itself needs, for example "P1-T01 — Get the current persona list from the client".
- Every roadmap change goes through the work track skill.

## 2. When to split into sub-items

Propose a split when a part of the work:

- can be approved, built, or shipped on its own;
- is for different people, or a different area of the system;
- needs its own design; or
- is large enough that the owner will want to see it tracked by itself: weigh how many tasks and sessions it needs against the work of keeping one more item current.

Split before the requirements are approved. After approval, split with the same tests and the work track skill. Do not split for a single step of work (that is a task) or for a stage. An item has at most three levels.

## 3. Proposing a split

Show the split in one message and ask one question:

- each proposed sub-item: a plain title, a one-line reason, the phase it belongs to, and the parent requirements it covers ("covers R-02 and R-03") or "needs its own requirements";
- the order you recommend refining and building them, with the reason;
- the question, as a row: "Shall I split WI-012 into these 4 sub-items?"

A yes covers the split only, not the requirements or a design. He picks only some: record exactly which, in his words.

## 4. Making the sub-items

After his yes, with the work track skill, for each sub-item:

- a new item with `parent` set to the parent's ID, at `01-discovery`, with a plain title from the proposal;
- its `type`, chosen as for the parent (usually `build`);
- a Starting request that quotes the part of the parent it covers and names the parent's `R-xx` IDs;
- the parent's ID under its Overview "Related items".

Then, in the parent:

- list each sub-item's ID in the Sub-items column of its phase;
- add a Recent History row naming the Q-ID of the split;
- rewrite its Current state so Next action names the next step in one of two forms. A question of his is open: "Waiting on Mike: <Q-ID> (<the question in a few words>). After his answer: <step>, with work-refine." Otherwise: "Agent: refine the first sub-item, with work-refine."
- when its `delivery` is `not-offered`, `SKILL.md` step 5 says whether to offer agent delivery now.

Read each new item back. Tell the owner the new IDs and titles in one list.
