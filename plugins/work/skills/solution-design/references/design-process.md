# The solution design process

The detail behind each `solution-design` step: the readiness checklist, the
way of working, the design record, research, the architect and critic loop,
drafts in each host, and approval. The design's section names are in
`work-item-format.md`, "Sections of `DESIGN.md`".

## Contents

1. Checklist before the design round
2. Are the requirements ready?
3. The way of working
4. The design record
5. Research
6. Design and critique
7. Drafts in each host
8. Save, present, and approve
9. Changing an approved design later

The step numbers below are the steps in `SKILL.md`.

## 1. Checklist before the design round

Work through every item in order. Tick each one only when it is true.

- [ ] **The requirements are read and understood**
  - [ ] The item's Requirements, Open Questions, Notes, and approval state
        are read
  - [ ] The spec check ran (`requirements-analyst`)
  - [ ] The goal is written in one paragraph in the design's "What this
        design solves": who uses the result, what they need to accomplish,
        what must be true afterward, and what the design leaves to another
        item
  - [ ] New build or existing build is known, and "What exists today" says
        what the existing build does for this area, with observed facts kept
        apart from assumptions
  - [ ] Notes > Solution options and considerations are treated as ideas,
        not requirements
- [ ] **The requirements are ready to design from**
  - [ ] Nothing is missing: every step, person, error case, state, boundary
        with another system, rule for what happens after, and way to tell it
        worked
  - [ ] Every requirement is explicit end to end: who does what, when, with
        what result, and what happens when it fails
  - [ ] Every place a builder could misread the wording is listed, with the
        wrong reading, the intended reading, and a rewording
  - [ ] Every requirement that does not fit the end-to-end experience is
        flagged with the reason
  - [ ] The owner ruled on every flag, and each ruling is in the design's
        Notes > Design changes during the interview
  - [ ] Gaps were fixed in the requirements through `work-requirements`, not
        patched in the design
  - [ ] "Requirements and design readiness" has one row per `R-xx`, with its
        status in the item and any remaining decision or gap
- [ ] **The way of working is agreed**
  - [ ] Interview first, or scan and research first
  - [ ] Built-in mechanisms first, or a specialized approach
  - [ ] One option, or several, and what differs between them
  - [ ] The answers are in the item's Notes > Decisions and context, and a
        built-in-first choice is a row in "Constraints and assumptions"
- [ ] **The team is set**
  - [ ] Size weighed from `team-roles.md`: requirement count, systems
        touched, existing build, options wanted, unknowns
  - [ ] Each role named with its count, what it reads, and what it returns
  - [ ] The number of agent runs for the first pass is stated
  - [ ] At least one design critic is on it
  - [ ] The small team was stated to the owner in one line; a larger team was
        agreed by him, or the item records his team-arrangement answer from
        `work-delegate`
- [ ] **The opening sections are in the design**
  - [ ] The header lines, What this design solves, Requirements and design
        readiness, What exists today, and Constraints and assumptions are
        filled
  - [ ] Unresolved discussion is in Notes > Open design questions, and the
        next action is in Notes > Current position and next step
- [ ] **Research is done**
  - [ ] One researcher per bounded question, started together
  - [ ] Every finding has a source, a date, and a label: official
        documentation, project evidence, or community claim
  - [ ] Any requirements concern a researcher raised went back to the owner

Only when every box is ticked does the design round (step 7) start.

## 2. Are the requirements ready?

For steps 1 to 3.

- Read the requirements against the whole end-to-end experience of the
  person who uses the result, inside the larger system. A requirement that
  seems out of place, contradicts another, or makes no sense in that flow is
  flagged in the first reply, with the reason.
- Answer three questions: Is anything missing? Is every requirement explicit
  end to end? Where could a builder misread it?
- Say plainly whether the requirements are ready. List what is still
  unclear. Use no score.
- Not ready: say so in the first reply, with each missing piece, unclear
  piece, and misreading risk, each with a proposed fix. Push back even when
  the owner wants to move on: a gap fixed in the requirements costs one
  question; the same gap found by the critic costs a design round, and found
  by a builder costs a build.
- The owner can overrule a flag. Record his ruling and reason in the design's
  Notes > Design changes during the interview, with the `R-xx` it concerns.
- Requirements not approved but the owner asked for options first: keep the
  open choices visible in the design, save it as proposed, and say the
  requirements approval is still needed. A `build` or `data-load` item keeps
  its stage: the CLI refuses stage 04 without the approval.

## 3. The way of working

For step 4.

The owner is one person who decides and steers; the agent runs the work. Ask
him at most one question here, with a recommendation and a one-line reason,
and only when the answer changes the design. Skip anything already answered.
Ask it in the reply text, never through a question tool.

1. **Interview or scan first.** The agent decides: the interview when the goal
   or the constraints are open, the scan when the requirements are detailed
   and the unknowns are technical. Say which in one line.
2. **Approach and options.** Default: the platform's built-in mechanisms
   wherever they meet a requirement, custom only where nothing built-in does.
   One option unless the owner wants more, or the requirements leave a real
   choice he should make; then ask how many and what differs (for example
   built-in only against custom, or least change against best long-term
   fit). This is the one question worth asking.
3. **The team.** The agent picks it from `team-roles.md` and states it in one
   line. The small team (one requirements analyst, one architect, one critic,
   and a researcher when a question is open) needs no question. Ask only when
   the team is larger than that, because it then costs noticeably more.

Record settled answers in the item's Notes > Decisions and context as they
come. The approach also goes into the design's "Constraints and assumptions"
table, with the owner as its source.

## 4. The design record

For step 5.

- `toolkit work design <id> --create` creates the design from the project's
  template (`.work-items/work-item-template/DESIGN.md` when present,
  otherwise the toolkit's copy of the model) in the item's one design home.
  For GitHub or Jira, start the design comment from `assets/DESIGN.md`.
- `toolkit work design <id>` prints the current design. Paste the parts each
  agent needs into its brief.
- The design's header fields (`work_item`, `status`, `approved`) are written
  by the CLI. Never edit them by hand.
- The template opens with a fill-in guide comment. Follow it and delete it,
  and delete the unused example rows and optional sections, as the guide
  says.
- Several options go under "Design options", each as its own
  `### Option A — <name>` section (then B, C), each with the same inner
  headings: Approach, End-to-end behavior, Requirement coverage, Technical
  shape, Tradeoffs and risks, Build order. With one option, remove "Option
  comparison" and keep the owner decision.

## 5. Research

For step 6.

One researcher per bounded question. Good questions: what the platform offers
built in for a requirement; the current version's limits; what people are
doing for this kind of problem; what an existing component in this
repository already does. Each finding comes back with a source, a date, and a
label. Findings that change the design go into "Sources and decisions that
affect the build".

Salesforce projects: open `sf-architect-solutioning` as the specialist for
platform facts (objects, Flows, Apex, permissions). It is a skill the main
agent runs, not an agent. It returns its findings to this design and starts
no second interview. Pass its findings to the architect.

A community claim shapes the design only after a check against official
documentation, the project's code, or a test.

## 6. Design and critique

For step 7.

- **Architect.** One per option. The brief holds the design's current text
  (What this design solves, Requirements and design readiness, What exists
  today, Constraints and assumptions, Notes), the requirements, the research
  findings, the way of working, and which option to write. It says plainly
  whether the requirements are ready and does not design until they are.
- **Critic.** At least one for every design, even a small one, and one per
  draft. Returns one line per requirement (satisfied, partly satisfied, not
  satisfied) with evidence, plus findings on the goal, unnecessary custom
  work, sources, and writing. The critic is skipped only in a session with
  no agent tool at all (no Agent tool in Claude Code, no `spawn_agent` in
  Codex), or when the owner said no to helpers. Then the reply and the
  design's Notes say that no critique ran.
- **Fix loop.** Give the critic's findings to the architect. The architect
  fixes the draft and lists what changed. The critic checks again. Repeat
  until every requirement is satisfied and nothing material remains.
  - A finding the architect and critic still disagree on after two rounds
    goes to the owner as one question, with both positions in two lines each.
  - A requirement no design can meet goes to the owner as a requirements
    question, not a design compromise.
  - Stop because the list is empty or the owner decided the rest, never
    because the loop is long. Start another round only for a named finding
    or a changed input.
- Keep the review position in the design's Notes > Current position and next
  step (open findings, next action), not a transcript of every round.

## 7. Drafts in each host

- **Claude Code.** The architect writes no file and returns its whole draft
  in its reply. Claude Code refuses `rm` outside the project, so a temporary
  folder could never be deleted. The critic's brief holds that draft, pasted
  in. For a fix round, paste the last draft and the critic's findings into
  the new brief. Save the merged design with `--set-file -` and the text on
  standard input.
- **Codex.** Make one folder for this design with `mktemp -d`. The
  architect's brief names its draft file in that folder, named for its option
  (`option-a.md`). The critic's brief names the same file. Save the merged
  file with `--set-file <path>`, then delete the files and the folder
  (`rm <file>`, then `rmdir <folder>`) before you ask the owner anything.
- **Never** a fixed name in the shared `/tmp` (such as
  `/tmp/wi002-option-a.md`: another project's WI-002 could overwrite it), and
  never a draft inside `.work-items/`, where a second `DESIGN.md`-shaped file
  confuses the design lookup.

## 8. Save, present, and approve

For steps 8 and 9.

- Merge the final drafts into one design text: the header and opening
  sections, one `### Option` section per option under "Design options", the
  Option comparison (with several options), the Recommendation, then Sources,
  the misreading table, and Notes. "Selected design" says "Pending owner
  decision." until he chooses.
- Save it as proposed and set the item waiting on the owner (`approvals.md`,
  "Design approval"). "Saved but not verified": lead the reply with it.
- Tell the owner: how many options, one sentence each, the recommendation and
  its reason, what he will see when it is done, the main risks, the build
  order, and the decisions that need him. The full design is in the item; say
  where in one line.
- His yes, or his choice of one option: run the design approval checklist in
  `approvals.md`. Write the chosen option into every subsection of "Selected
  design" and into "Build and verification plan" (Technical sequence, and
  Acceptance checks with one row per requirement). Keep "Diagrams" when the
  template has it. Remove every leftover prompt, including a line that still
  says the plan comes after the owner chooses. `work-check` reads these
  Acceptance checks, so an empty plan leaves the checker nothing to check.
- Keep each header line (`**Requirements:**`, `**Design status:**`, and the
  rest) on its own line, and leave the Design status line as it is. Only
  `toolkit work approve <id> --design --by <owner>` marks it approved.
- He wants changes: record them in the design's Notes > Design changes during
  the interview, run another fix round for the named changes only, and ask
  again.
- Lasting lessons the owner stated along the way go through `memory-save`.
  Decisions for the whole project go through `work-decide`. Working design
  Notes are not project memory.
- The design reads like the project's writing rules: common words, real
  names, no figurative language, and a term defined the first time it
  appears.
- A failed save: lead with "Not saved" and keep the unsaved text.

## 9. Changing an approved design later

- Any change to the text of an approved design gets a history note that says
  what changed and whether the owner must approve it again. A factual
  correction that changes no choice needs no new approval; say so in the
  note.
- A build that shows the design does not work: record what failed in the
  design's Notes, set the design back to proposed, and run a fix round for
  the affected parts. Then ask for approval again.
  `toolkit work design <id> --status proposed`
- A design that a new one replaces completely: mark the old text superseded.
  `toolkit work design <id> --status superseded`
