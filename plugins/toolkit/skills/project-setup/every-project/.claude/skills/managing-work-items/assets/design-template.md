---
work_item: WI-001
---

# <Work item title>: solution design

<!-- This file says how to meet the work item's requirements. The work item holds the goal, the requirements, the decisions, and whether this design is proposed or approved. Replace every <prompt>; remove unused rows and sections. -->

**Requirements checked:** <YYYY-MM-DD>  
**Last updated:** <YYYY-MM-DD>

## What this design solves

<Who uses the result, what they need to do, and what must be true afterward. What this design covers and leaves out.>

## Requirements and design readiness

| Requirement | Status in work item | Design coverage | Remaining gap |
| --- | --- | --- | --- |
| R-01 — <name> | <Approved / Not approved / Dropped> | <Option and section, or Pending> | <Q-ID or None> |

## What exists today

<Verified current behavior, relevant files or configuration, and the gap; or "Nothing exists yet." Separate facts from assumptions.>

## Constraints and assumptions

| Type | Statement | Source and status | Effect on the design |
| --- | --- | --- | --- |
| <Constraint / Assumption> | <Statement> | <Decision ID, SRC-###, link, or person and date; confirmed or open> | <What it limits> |

## Design options

### Option A — <Short name>

#### Approach

<The approach, why it fits the goal, and what's reused, changed, or new.>

#### End-to-end behavior

1. <Who starts it, when, and with what.>
2. <What happens, including decisions and failure paths.>
3. <What the person sees, and what happens next.>

#### Requirement coverage

| Requirement | Build or reuse (new / changed / reused) | Why it meets the requirement | How to check it |
| --- | --- | --- | --- |
| R-01 | <Component or setting> | <Why> | <Test or observable result> |

#### Technical shape

- **Components and files:** <What changes.>
- **Data and state:** <Records, fields, lifecycle, migration.>
- **Access and security:** <Who can see or change what.>
- **Integrations:** <Systems, interfaces, failure handling.>
- **Operations:** <Monitoring, rollback, ownership.>

#### Tradeoffs and risks

| Risk | Likelihood and effect | Mitigation or owner decision |
| --- | --- | --- |
| <Concern> | <Impact> | <Action or question> |

#### Build order

1. <Step, its dependencies, and its completion check.>

## Option comparison

<!-- Only with more than one option. -->

| Criterion | Option A | Option B | Evidence or uncertainty |
| --- | --- | --- | --- |
| <Criterion> | <Assessment> | <Assessment> | <Source or question> |

## Recommendation and owner decision

**Recommendation:** <Option, reason, and main tradeoff.>  
**Owner decision:** <Pending, or the chosen option, who, when, and the Q-ID.>  
**Reason for decision:** <The owner's reason if given; never invent one.>

## Selected design

<"Pending owner decision." until chosen; then the current buildable design.>

### End-to-end flow

1. <Trigger, actor, input.>
2. <Steps, decisions, error paths, handoffs.>
3. <Result and what happens next.>

### Components and responsibilities

| Component or file | New / changed / reused | Responsibility | Requirement IDs |
| --- | --- | --- | --- |
| <Name or path> | <New> | <Behavior> | R-01 |

### Data, access, and integration details

<Enough detail to build without guessing, or "Not applicable".>

### Edge cases and failure behavior

| Situation | Expected behavior | How it's checked |
| --- | --- | --- |
| <Case> | <Result and recovery> | <Test or observation> |

### Release and ongoing operation

<Deployment order, migration, rollback, monitoring, owner.>

## Diagrams

<Optional Mermaid diagrams, each with a one-sentence explanation. They never replace the written behavior.>

## Build and verification plan

### Technical sequence

<The selected option's Build order, as approved. Its steps become the work item's tasks.>

### Acceptance checks

| Requirement or acceptance criterion | Verification method | Expected result | Evidence location |
| --- | --- | --- | --- |
| R-01 | <Test, review, or demo> | <Pass condition> | <Where it's recorded> |

## Sources and decisions that affect the build

| Claim or decision | Source | Date | Evidence type | Checked how |
| --- | --- | --- | --- | --- |
| <Claim> | <ID, SRC-###, link, or Q-ID> | <YYYY-MM-DD> | <Official documentation / Project evidence / Owner decision / Community claim> | <How, or Pending> |

## Where a builder could misread this design

| Requirement or section | Plausible wrong reading | Intended reading |
| --- | --- | --- |
| R-01 | <Likely mistake> | <Correct reading and where the design makes it clear> |

## Notes

### Open design questions

| Question (with Q-ID) | Affects | Decision needed from | Status | Next step |
| --- | --- | --- | --- | --- |
| <Question> | <Section or requirement> | <Person> | Open | <Action> |

### Design changes during the interview

| Date | Answer or decision | Section updated | Source and approval state |
| --- | --- | --- | --- |
| <YYYY-MM-DD> | <What changed> | <Heading> | <Q-ID; proposed or approved> |
