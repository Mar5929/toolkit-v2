# The solution design process

Detail for `solution-design`. Carried over from Toolkit V1's solution
design process. What changed for V2: the design lives with the work
item, in the model project's `DESIGN.md` format; the requirements live in the
item (never a PRD file); every agent runs on Opus; and the design is read and
saved with `toolkit work design`. The section names are listed in
`../../../references/conventions.md`, "Section names in `DESIGN.md`".

## Checklist before the design round

Work through every item in order. Tick each one only when it is true.

- [ ] **The requirements are read and understood**
  - [ ] The item's Requirements, Open Questions, Notes, and approval state are
        read
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
  - [ ] Size weighed from `../../../references/team-roles.md`: requirement
        count, systems touched, existing build, options wanted, unknowns
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

Only when every box is ticked does the design round (step 6) start.

## Step 1 and 2: are the requirements ready?

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

## Step 3: the way of working

The owner is one person who decides and steers; the agent runs the work. Ask
him at most one question here, with a recommendation and a one-line reason,
and only when the answer changes the design. Skip anything already answered.
Ask it in the reply text, never through a question tool (such as Codex's
`request_user_input`): a question he never sees stalls the item.

1. **Interview or scan first.** The agent decides: the interview when the goal
   or the constraints are open, the scan when the requirements are detailed
   and the unknowns are technical. Say which in one line.
2. **Approach and options.** Default: the platform's built-in mechanisms
   wherever they meet a requirement, custom only where nothing built-in does.
   One option unless the owner wants more, or the requirements leave a real
   choice he should make; then ask how many and what differs (for example
   built-in only against custom, or least change against best long-term fit).
   This is the one question worth asking.
3. **The team.** The agent picks it from `team-roles.md` and states it in one
   line. The small team (one requirements analyst, one architect, one
   critic, and a researcher when a question is open) needs no question: a solo owner cannot judge which
   helpers a small design needs. Ask only when the team is larger than that,
   because it then costs noticeably more.

Record settled answers in the item's Notes > Decisions and context as they
come. The approach also goes into the design's "Constraints and assumptions"
table, with the owner as its source.

## Step 4: the design record

- `toolkit work design <id> --create` creates the design from the project's
  template (`.work-items/work-item-template/DESIGN.md` when present,
  otherwise the model copy in the toolkit plugin) in the item's one design
  home.
- `toolkit work design <id>` prints the current design. Paste the parts each
  agent needs into its brief.
- The design's frontmatter (`work_item`, `status`, `approved`) is written by
  the CLI. Never edit it by hand. Keep the header line "Design status" in
  step with it.
- The template opens with a fill-in guide comment. Follow it and delete it,
  and delete the unused example rows and optional sections, as the guide
  says.
- Several options go under "Design options", each as its own
  `### Option A — <name>` section (then B, C), each with the same inner
  headings: Approach, End-to-end behavior, Requirement coverage, Technical
  shape, Tradeoffs and risks, Build order. With one option, remove "Option
  comparison" and keep the owner decision.

## Step 5: research

One researcher per bounded question. Good questions: what the platform offers
built in for a requirement; the current version's limits; what people are
doing for this kind of problem; what an existing component in this
repository already does. Each finding comes back with a source, a date, and a
label. Findings that change the design go into "Sources and decisions that
affect the build".

Salesforce projects: open `sf-architect-solutioning` as the specialist for
platform facts (objects, Flows, Apex, permissions). It returns its findings to
this design and starts no second interview. Pass its findings to the
architect.

## Step 6: design and critique

- **Architect.** One per option. The brief holds the design's current text,
  the requirements, the research findings, and which option to write. Where
  the draft goes:
  - Claude Code: the architect writes no file and returns its whole draft in
    its reply. Claude Code refuses `rm` outside the project, so a temporary
    folder could never be deleted. The critic's brief holds that draft,
    pasted in. For a fix round, paste its last draft and the critic's
    findings into the new brief.
  - Codex: the brief names the draft file: a file named for its option in the
    one folder made for this design with `mktemp -d` (never a fixed name in the
    shared `/tmp`, never inside `.work-items/`). The critic's brief names the
    same file. Delete the folder once the
    design is saved.

  It says plainly whether the requirements are ready and does not design
  until they are.
- **Critic.** At least one for every design, even a small one, and one per
  draft. Returns one line per requirement (satisfied, partly satisfied, not
  satisfied) with evidence, plus findings on the goal, unnecessary custom
  work, sources, and writing. Only a session with no agent tool at all (no
  Agent tool in Claude Code, no `spawn_agent` in Codex) skips the critic, and
  then the reply and the design's Notes say that no critique ran.
- **Fix loop.** Give the critic's findings to the architect. The architect
  fixes the draft and lists what changed. The critic checks again. Repeat
  until every requirement is satisfied and nothing material remains.
  - A finding the architect and critic still disagree on after two rounds
    goes to the owner as one question, with both positions in two lines each.
  - A requirement no design can meet goes to the owner as a requirements
    question.
  - Stop because the list is empty or the owner decided the rest, never
    because the loop is long.

## Step 7 and 8: save, present, approve

- Merge the final drafts into one design text: the header and opening
  sections, one `### Option` section per option under "Design options", the
  Option comparison (with several options), the Recommendation, then Sources,
  the misreading table, and Notes. "Selected design" says "Pending owner
  decision." until he chooses. Save it with
  `toolkit work design <id> --set-file <file> --status proposed` (`<file>` is
  `-` with the text on standard input in Claude Code).
- Tell the owner: how many options, one sentence each, the recommendation and
  its reason, what he will see when it is done, the main risks, the build
  order, and the decisions that need him. The full design is in the item; say
  where in one line.
- His yes, or his choice of one option: fill "Owner decision" (who, when,
  where he said it) and "Reason for decision" (his reason only; never invent
  one). Write the chosen option into every subsection of "Selected design"
  (End-to-end flow; Components and responsibilities; Data, access, and
  integration details; Edge cases and failure behavior; Release and ongoing
  operation) and into "Build and verification plan" (Technical sequence, and
  Acceptance checks with one row per requirement). Keep "Diagrams" when the
  template has it. Remove every leftover prompt, including a line that still
  says the plan comes "after Mike chooses". `work-check` reads these
  Acceptance checks, so an empty plan leaves the checker nothing to check.
- Save it with its "Design status" header line unchanged: never write
  "Approved" there yourself. Keep each header line (`**Requirements:**`,
  `**Design status:**`, and the rest) on its own line. Then run
  `toolkit work approve <id> --design --by <owner>`, which marks it approved,
  and add a history note with his words. Hand back to `work-on`, which turns
  the Build and verification plan into the Roadmap and Tasks.
- He wants changes: record them in the design's Notes > Design changes during
  the interview, run another fix round for the named changes only, and ask
  again.
- Lasting lessons the owner stated along the way go through `memory-save`.
  Decisions for the whole project go through `work-decide`. Working design
  Notes are not project memory.
- A failed save: lead with "Not saved" and keep the unsaved text.

## Changing an approved design later

- Any change to the text of an approved design gets a history note that says
  what changed and whether the owner must approve it again. A factual
  correction that changes no choice needs no new approval; say so in the note.

- A build that shows the design does not work: record what failed in the
  design's Notes, set the design back with
  `toolkit work design <id> --status proposed`, and run a fix round for the
  affected parts.
- A replaced design: `toolkit work design <id> --status superseded` on the old
  text only when a new design replaces it completely.
