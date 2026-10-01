# <Release name>: cutover plan

<!-- Fill-in guide: create one release folder named with its real date and release slug. Replace every angle-bracket prompt in the fields, table cells, and paragraphs below with verified release information. Add one Included work items row per item, one Cutover sequence row per action, and one Go or no-go row per decision point; remove example rows. Keep exact operator steps and rollback checks here. Delete this guide after filling. -->

**Release folder:** `<YYYY-MM-DD>-<release-name>`  
**Owner:** <Person or team>  
**Target org:** <Verified alias and environment>  
**Window:** <Approved date, time, and time zone>  
**Status:** <Planning | Ready | In progress | Complete | Rolled back>

## Included work items and packages

| Work item | Package or deployment record | Owner | Readiness |
| --- | --- | --- | --- |
| <ID and link> | <Link to its deployment folder> | <Person> | <Ready / Open> |

## Entry conditions

- <Approvals, validation, backup, access, and communication checks required before starting.>

## Cutover sequence

| Order and time | Action | Operator | Verification | Fallback |
| --- | --- | --- | --- | --- |
| <Order> | <Exact deploy or manual action> | <Person> | <Observable check> | <Recovery action> |

## Go or no-go decisions

| Decision point | Criteria | Decision owner | Recorded outcome |
| --- | --- | --- | --- |
| <Before/after step> | <Specific pass condition> | <Person> | <Decision, time, source> |

## Rollback and recovery

<Triggers, exact restore or reversal steps, owner, and verification. Link to relevant backups or work-item records.>

## Communications and handoff

<Who receives updates, when, and where final operating ownership lands.>
