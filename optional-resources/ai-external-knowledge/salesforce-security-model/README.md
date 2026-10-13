---
group: Salesforce reference documentation
summary: "How Salesforce decides who can see and change what: sharing and record access, role hierarchy, permission sets, muting, least privilege and monitoring. Seven documents."
source: https://help.salesforce.com
captured_at: "2026-08-25"
---

# The Salesforce security model

How Salesforce decides who can see and change what, read from Salesforce's own
documentation rather than from any one org. Seven documents,
6,495 lines, all written on 2026-08-25.

## What is here

Read them in this order if you are new to the subject. Each one stands alone and
spells out every term the first time it appears.

| File | What it answers | Lines |
| --- | --- | ---: |
| `data-security-model.md` | The whole model end to end: organization, object, field and record layers, what each controls, how they combine, and what makes access recalculate. Start here. | 864 |
| `least-privilege.md` | What least privilege actually means, quoted from NIST, what it protects against, and the tension it creates with covering for a colleague. | 623 |
| `sharing-and-record-access.md` | Every record sharing mechanism there is: org-wide defaults, sharing rules, manual and Apex sharing, teams, territories, implicit sharing, restriction and scoping rules, recalculation and data skew. The longest and the most reached for. | 1,252 |
| `role-hierarchy-design.md` | How to design a role hierarchy, the documented limits, and why it is modelled on data access rather than the HR org chart. | 746 |
| `permission-sets-groups-and-muting.md` | Permission sets, groups, muting sets, what a profile must still hold, and what Salesforce has and has not committed to about profiles. | 923 |
| `well-architected-security.md` | Salesforce Well-Architected's Trusted pillar: what it names as good practice and what it names as an anti-pattern. | 1,015 |
| `monitoring-and-insider-threat.md` | Watching for misuse instead of preventing it: Security Health Check, Event Monitoring, Transaction Security, Shield, audit trails, and which risky permission does what. Says clearly which parts are paid add-ons. | 1,072 |

## Where they came from

Official sources only, read on 2026-08-25: `help.salesforce.com`,
`developer.salesforce.com`, `architect.salesforce.com`,
`trailhead.salesforce.com` and `admin.salesforce.com`, plus the architect
whitepapers "Record-Level Access: Under the Hood" and "Designing Record Access
for Enterprise Scale". `least-privilege.md` also draws on the United States
National Institute of Standards and Technology (NIST), the Cybersecurity and
Infrastructure Security Agency (CISA) with the National Security Agency (NSA),
and the Open Worldwide Application Security Project (OWASP).

Every document opens with a **Basis** line saying how many pages it was built
from, and ends with a Sources section listing every URL with one line on what it
covers. Where something could not be confirmed, the document says so instead of
guessing.

## What they are not

**They are not any project's decisions.** They describe what Salesforce
publishes, digested, so that an agent does not have to read thirty help
articles to answer one question. A project's own security design belongs in
that project's records.

**They will go stale.** Salesforce changes every release. Anything version
dependent names its API version or release, so check that before relying on it.

## The one thing to read before touching a permission set

`permission-sets-groups-and-muting.md`, on what a deploy does. A permission set
deploy replaces the whole component, so any grant the local file omits is turned
off in the org. A **muting** permission set deploy does the same thing facing
the other way: dropping a line from one silently gives access back.
