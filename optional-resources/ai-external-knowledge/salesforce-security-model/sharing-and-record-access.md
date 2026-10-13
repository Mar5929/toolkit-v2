# Salesforce record sharing: every mechanism

This document explains every way Salesforce decides which individual records a person can see, edit, transfer or delete. It covers what each mechanism does, when to reach for it, what it costs, and the exact published limits. Read it before you design record access for an org, before you change an org-wide default, and before you promise a client that a particular access rule is possible. It assumes you know nothing about Salesforce sharing beyond the fact that it exists.

**Basis:** built on 2026-08-25 from 34 official Salesforce pages and documents: the two architect whitepapers "Record-Level Access: Under the Hood" and "Designing Record Access for Enterprise Scale" (both Spring '26 editions, last updated 2026-03-31), the "Understanding Defer Sharing Calculations" tip sheet (last updated 2026-03-31), the Sales Territories Implementation Guide (Spring '26), plus pages on help.salesforce.com, developer.salesforce.com, architect.salesforce.com and trailhead.salesforce.com. Every URL is listed in the Sources section at the bottom, each with one line saying what it covers.

---

## Contents

1. [Words you need first](#1-words-you-need-first)
2. [The shape of the whole system](#2-the-shape-of-the-whole-system)
3. [Summary table: every mechanism at a glance](#3-summary-table-every-mechanism-at-a-glance)
4. [Org-wide defaults](#4-org-wide-defaults-owd)
5. [Role hierarchy and Grant Access Using Hierarchies](#5-role-hierarchy-and-grant-access-using-hierarchies)
6. [Ownership-based sharing rules](#6-ownership-based-sharing-rules)
7. [Criteria-based sharing rules](#7-criteria-based-sharing-rules)
8. [Guest user sharing rules](#8-guest-user-sharing-rules)
9. [Manual sharing](#9-manual-sharing)
10. [Apex managed sharing](#10-apex-managed-sharing)
11. [Teams: account, opportunity and case](#11-teams-account-opportunity-and-case)
12. [Enterprise Territory Management, now called Sales Territories](#12-enterprise-territory-management-now-called-sales-territories)
13. [Implicit sharing, the one nobody configures and everybody trips over](#13-implicit-sharing-the-one-nobody-configures-and-everybody-trips-over)
14. [Restriction rules](#14-restriction-rules)
15. [Scoping rules](#15-scoping-rules)
16. [Sharing recalculation, deferral and group membership locking](#16-sharing-recalculation-deferral-and-group-membership-locking)
17. [Data skew: ownership, parent-child and lookup](#17-data-skew-ownership-parent-child-and-lookup)
18. [Under the hood: how Salesforce actually stores access](#18-under-the-hood-how-salesforce-actually-stores-access)
19. [Things I could not confirm](#19-things-i-could-not-confirm)
20. [Sources](#20-sources)

---

## 1. Words you need first

Spelled out once, used freely after that.

| Term | Plain meaning |
| --- | --- |
| **Record** | One row of data. One account, one case, one opportunity. |
| **Object** | A type of record. Account is an object. Case is an object. A custom object is one an org's own team made. |
| **Owner** | The one user or queue named on a record as responsible for it. Every record has exactly one owner. |
| **Org-wide default**, abbreviated **OWD** | The baseline answer to "who can see records of this type that they do not own?" Set once per object. |
| **Role hierarchy** | A tree of job levels. It exists so that a manager can see what their people can see. It is not the same as a reporting chart, though most orgs build it to look like one. |
| **Public group** | A named bag of users, roles, territories and other public groups, made by an admin so that sharing can point at the bag instead of at each person. |
| **Queue** | A holding pen that owns records until a person takes one. Salesforce grants access to a queue the same way it grants access to a public group. |
| **Sharing rule** | A standing instruction that automatically opens up access to a set of records for a set of people. |
| **Manual sharing** | One person clicking a button to give one record to another person. |
| **Share object** | The hidden table behind each object that stores who has been granted what. `AccountShare` holds the grants for Account. A custom object called `Job__c` has `Job__Share`. |
| **Sharing recalculation** | The background job Salesforce runs to rewrite those hidden tables after you change something. It can take a long time in a big org. |
| **Sandbox** | A copy of an org used for testing. A "full copy" sandbox holds all the real data. |
| **Experience Cloud site** | Salesforce's customer or partner portal product. Its users are "external users". |
| **Guest user** | An unauthenticated visitor to an Experience Cloud site. Nobody logged in. |

Two more that matter and are easy to mix up:

- **Object-level access** answers "can this person touch Accounts at all?" It is set on profiles and permission sets, with the Read, Create, Edit and Delete permissions. It is not what this document is about.
- **Record-level access**, which Salesforce simply calls **Sharing**, answers "which particular Account records can this person see?" That is what this document is about.

Source for that split: the "Record-Level Access: Under the Hood" whitepaper, which states that data access "falls into two main categories: object-level access, which includes field-level access, and record-level access", and lists the record-level tools as org-wide defaults, role hierarchy, territory hierarchy, sharing rules, teams, manual sharing and programmatic sharing.

---

## 2. The shape of the whole system

Four sentences that explain almost everything.

1. **The org-wide default is the floor.** It sets the least access anyone has to a record they do not own.
2. **Almost every other mechanism only builds upward from that floor.** Role hierarchy, sharing rules, teams, territories, manual sharing, Apex sharing and implicit sharing can all add access. None of them can take access away.
3. **When two mechanisms disagree, the more generous one wins.** The whitepaper puts it plainly: "For users with multiple access grants to a record, Salesforce uses the most permissive grant when determining record access."
4. **Restriction rules are the one real exception.** They filter down what the rest of the system granted. Everything else is additive.

Salesforce does not work this out live when you open a page. It calculates access when configuration changes and stores the answer, so that a page can render inside its 300 millisecond benchmark. The whitepaper says this outright: "Rather than applying every sharing rule, traversing all hierarchies, and analyzing record access inheritance in real time, Salesforce calculates record access data only when configuration changes occur."

That single design decision is the reason nearly every performance problem in this document exists. Changing configuration is what costs money, not reading data.

---

## 3. Summary table: every mechanism at a glance

| Mechanism | What it does | Direction | Who or what it targets | Survives owner change? | Key published limit |
| --- | --- | --- | --- | --- | --- |
| **Org-wide default (OWD)** | Sets the baseline access to records you do not own, per object | Sets the floor | Everyone in the org, split into internal and external | Not applicable | One setting per object; external must be equal to or tighter than internal |
| **Role hierarchy** | Gives a manager the same record access as the people below them | Adds | Users in roles above the owner | Yes, it is recalculated to follow the new owner | 5,000 roles in orgs created in Spring '21 or later; 500 in older orgs. Best practice: no more than 10 levels of branches |
| **Ownership-based sharing rule** | Shares every record owned by one group with another group | Adds | Roles, roles-and-subordinates, public groups, queues, territories | Yes, it follows ownership by definition | Counts toward 300 total sharing rules per object |
| **Criteria-based sharing rule** | Shares every record whose field values match a condition, whoever owns it | Adds | Same set of groups | Yes, it does not depend on the owner | 50 per object, shared with guest user sharing rules; counts toward the 300 total |
| **Guest user sharing rule** | The only way to give records to an unauthenticated website visitor | Adds | The site's guest user | Yes | Read Only access only; 50 per object, shared with criteria-based rules |
| **Manual sharing** | One person hands one record to another | Adds | A user, group, role or queue | **No. It is deleted on owner change** | No published numeric limit found |
| **Apex managed sharing** | Code writes rows into the share object for cases the point-and-click tools cannot express | Adds | A user, group, role, queue or territory | **Only if the row cause is a custom Apex sharing reason** | 10 Apex sharing reasons per custom object; custom objects only |
| **Account, opportunity and case teams** | A named set of collaborators on one record, each with their own access level | Adds | Individual users | Team membership is separate from ownership; see section 11 | One team per record |
| **Sales Territories (Enterprise Territory Management)** | Grants access to accounts, leads, opportunities, contacts and cases by territory assignment | Adds | Users assigned to a territory | Yes, it follows the territory assignment, not the owner | One active territory model at a time |
| **Implicit sharing** | Built-in parent and child access between Account and its Contacts, Cases and Opportunities | Adds | Automatic | Recalculated automatically | **Cannot be turned on or off.** Does not apply to custom objects |
| **Restriction rule** | Filters down what a user can reach, after everything else granted it | **Removes** | A named set of users, against records matching criteria | Not applicable | 2 per object in Enterprise and Developer; 5 per object in Performance and Unlimited |
| **Scoping rule** | Changes what a user sees *by default* in list views, reports and search. Does not change access | Neither. It filters the default view only | A named set of users | Not applicable | 2 per object in Developer; 5 per object in Performance and Unlimited |

---

## 4. Org-wide defaults (OWD)

### What it does

The org-wide default is one setting per object that answers: for a record I do not own, what can I do with it by default? Salesforce's own words: "Organization-wide sharing settings specify the default level of access that users have to each others' records."

You set it in Setup, under Sharing Settings, in the Organization-Wide Defaults area.

### The values

| Value | What it means | Where it appears |
| --- | --- | --- |
| **Private** | "Only users who are granted access by ownership, permissions, role hierarchy, manual sharing, or sharing rules." Nobody else sees the record at all. | Available on most objects |
| **Public Read Only** | "All users can view and report on records, but only the owner, and users above that role in the hierarchy, can edit them." | Available on most objects |
| **Public Read/Write** | "All users can view, edit, and report on all records." | Available on most objects |
| **Public Read/Write/Transfer** | Everything Public Read/Write allows, plus any user can change the record's owner. | Only on specific objects. Salesforce's default-access table shows this level as the shipped default for **Case** and **Lead** only |
| **Public Full Access** | Everything Public Read/Write/Transfer allows, plus delete and share. | Only on specific objects. The default-access table shows it as the shipped default for **Campaign** |
| **Controlled by Parent** | "A user can view, edit, or delete a record if they can perform that same action on the object it belongs to." The child object has no independent setting; it copies whatever the parent grants. | The shipped default for **Contact** and **Asset**. It is also the automatic and unchangeable setting for the detail side of any master-detail relationship |
| **Use** | Price Book's shipped default. It lets users work with the price book on opportunities without editing the price book itself. | Price Book |
| **View Only** | Named by Salesforce as one of the levels "available for only specific objects". | Price Book, in practice |
| **Hide Details / Hide Details and Add Events / Show Details / Show Details and Add Events** | Calendar-specific levels. The shipped default is Hide Details and Add Events. | Calendar |

The Salesforce OWD overview page summarises it this way: "For most objects, you can assign default access to Controlled by Parent, Private, Public Read Only, or Public Read/Write" and "Other access levels, like Public Full Access and View Only, are available for only specific objects."

The Metadata API enumeration for the same thing uses the names `Private`, `Read`, `ReadWrite`, `ReadWriteTransfer`, `FullAccess` and `ControlledByParent`. That is what you will see inside a `.object-meta.xml` file, in the `sharingModel` element.

### The shipped defaults, object by object

Straight from the Salesforce "Default Organization-Wide Access Levels" page.

| Object | Default internal access | Default external access, orgs created before Spring '20 | Default external access, orgs created in Spring '20 or later |
| --- | --- | --- | --- |
| Account | Public Read/Write | Public Read/Write | Private |
| Activity | Private | Private | Private |
| Asset | Controlled by Parent | Controlled by Parent | Controlled by Parent |
| Calendar | Hide Details and Add Events | Hide Details and Add Events | Hide Details and Add Events |
| Campaign | Public Full Access | Public Full Access | Private |
| Case | Public Read/Write/Transfer | Public Read/Write/Transfer | Private |
| Contact | Controlled by Parent | Controlled by Parent | Controlled by Parent |
| Contract | Public Read/Write | Public Read/Write | Private |
| Custom object | Public Read/Write | Varies by when it was created | Private |
| Flow Interview | Private | Private | Private |
| Lead | Public Read/Write/Transfer | Public Read/Write/Transfer | Private |
| Opportunity | Public Read Only | Public Read Only | Private |
| Price Book | Use | Use | Use |
| Service Contract | Private | Private | Private |
| User | Public Read Only | Private | Private |

### Internal versus external defaults

Every object gets two settings, not one. The internal one covers your employees. The external one covers authenticated external users, meaning Experience Cloud site users, customer and partner portal users, and similar licence types.

The hard rule, quoted from Salesforce: "The default external access level must be more restrictive or equal to the default internal access level." You cannot let customers see more than employees.

Three points that catch people out:

- **Guest users are not external users.** Salesforce states: "Guest users aren't considered external users" and their access "is always set to Private for all objects" with no exception. That is why guest user sharing rules exist as a separate thing (section 8).
- **Turning the external sharing model on is one-way.** "After it's enabled, the External Sharing Model can't be disabled." You can manually set both columns to the same value, but the two-column view stays.
- **Reporting has its own catch.** "An object's external organization-wide default must be set to Private for an external authenticated user to view the object in a report."

### When to use it

Always. It is not optional, it is the first decision. The pattern Salesforce teaches is: lock the org down to the tightest setting the business can live with, then open specific holes with the other mechanisms.

The counter-pressure comes from the enterprise scale whitepaper, which says the opposite for anything not confidential: "Use a Public Read Only or Read/Write organization-wide default sharing model for all non-confidential data." Private OWDs are what create sharing rows, and sharing rows are what make recalculation slow. So: Private where the business genuinely needs it, and Public where it does not.

### What changing an OWD costs

This is the part people underestimate.

Changing an org-wide default triggers a full sharing recalculation for that object. Salesforce's own wording on the setup page: "sharing recalculation applies the access changes to your records. If you have a lot of data, the update can take longer." You get an email when it finishes.

The architect guidance adds: "Organization-wide default settings can be changed from one setting to another (Private to Controlled by Parent, then back to Private). However, these changes require sharing recalculation and depending on volume could result in long processing times."

Three consequences worth writing on the wall:

1. **Widening access is instant. Tightening it is not.** Increasing access takes effect immediately. Decreasing access only takes effect once recalculation finishes. So there is a window during a tightening change where people still see what you just took away.
2. **Account, case, contact and opportunity move together.** "If sharing rules are recalculated for accounts, cases, contacts, or opportunities, sharing rules are also recalculated for the other three objects since cases, contacts, and opportunities are child objects of accounts." You cannot recalculate one of those four alone.
3. **You are locked out while it runs.** "You cannot modify org-wide defaults when sharing rule recalculation is underway for any object, and vice versa." Other objects are still editable.

Also: "When sharing is recalculated, Salesforce also runs all Apex sharing recalculations." If somebody wrote a `Database.Batchable` sharing recalculation class, changing an OWD sets it off.

**Practical rule for a merge or migration project: decide the OWD before you load data, not after. Changing it once ten million rows are in place is a maintenance-window job, not an afternoon.**

---

## 5. Role hierarchy and Grant Access Using Hierarchies

### What it does

The role hierarchy gives every user the record access of everyone below them in their branch. Salesforce: "The role hierarchy ensures that managers always have access to the same data as their employees, regardless of the organization-wide default settings."

It is a sharing tool first and an org chart second. Build it to describe who needs to see whose records, not to describe who reports to whom. Those two are often the same and sometimes are not.

Note the direction carefully. Access flows **upward**. A manager sees a rep's records. A rep does not see the manager's records, and two peers do not see each other's, unless something else grants it.

### Limits and best practice numbers

| Item | Number | Source |
| --- | --- | --- |
| Roles per org, orgs created in Spring '21 or later | 5,000 | Platform Sharing Architecture |
| Roles per org, orgs created before Spring '21 | 500, raisable by support case | Platform Sharing Architecture |
| Recommended maximum depth | "no more than 10 levels of branches" | Platform Sharing Architecture |
| Recommended maximum internal roles | 25,000 | Platform Sharing Architecture |
| Recommended maximum external roles | 100,000 | Platform Sharing Architecture |
| Public group nesting depth | up to 5 levels | Platform Sharing Architecture |
| Recommended maximum public groups | 100,000 | Platform Sharing Architecture |

### Grant Access Using Hierarchies

This is a checkbox next to each object's org-wide default. When it is ticked, the role hierarchy opens access upward for that object. When it is unticked, it does not, and only ownership plus the OWD plus explicit sharing decide who sees what.

The rules, quoted and paraphrased from Salesforce's setup page:

- It is **on by default** for every object.
- It can only be **turned off for custom objects**, and only for custom objects whose default access is not Controlled by Parent.
- For standard objects, it cannot be turned off at all.
- When it is off, "users won't automatically inherit access to records owned by subordinates in the hierarchy."

**When to turn it off:** a custom object holding data that a manager genuinely must not see, such as an employee's own confidential submissions, or a compliance record where the manager is the subject. It is rare and it should be deliberate.

**The trap:** turning it off does not stop a user with the View All or Modify All permission on that object, or View All Data or Modify All Data at org level. Those are object-level permissions and they sit above all of this.

### What a role change costs

This is the single most expensive routine admin action in Salesforce, and the enterprise scale whitepaper spends its first three pages on it.

Moving one user from one branch of the hierarchy to another makes Salesforce:

- Add or remove access to that user's data for everyone above their old and new role, if they were the first data owner in the new role.
- If the user owns customer or partner accounts, detach every child customer or partner role from the old role and reattach it under the new role, for every such account they own.
- Adjust the implicit shares that gave access to records owned by or shared to those portal users.
- Recalculate every sharing rule that names the old role or the new role as its source group.

Their conclusion, quoted: "a lot can happen under the hood when an administrator takes what looks like a simple action, such as changing the role of a user."

Two related operations cost as much or more:

- **Moving a whole role to another branch.** Cheaper in one way, because customer and partner accounts travel with the role and their sharing does not change. More expensive in another, because Salesforce does the single-user work "for all users in the role being moved and for all of those users' data."
- **Changing the owner of a customer or partner account.** Looks like editing one field. Actually reparents the portal roles under that account and adjusts sharing for everything associated with it.

**Best practice from the whitepaper: "When making changes to the hierarchy, process changes to the bottom (leaf) nodes first, then move upward to avoid duplicate processing."**

---

## 6. Ownership-based sharing rules

### What it does

An ownership-based sharing rule, which Salesforce also calls an owner-based sharing rule, says: take every record owned by group A, and give it to group B at this access level. It is a standing rule, not a one-off. New records that land in group A are shared automatically.

Salesforce's description: "Owner-based sharing rules allow for exceptions to organization-wide default settings and the role hierarchy."

### What it can target

Both sides of the rule, the source group and the destination group, can be:

- A role
- A role and its subordinates
- A public group
- A queue
- A territory

### Access levels

Read Only or Read/Write. Salesforce's Trailhead module states plainly: "You can assign either Read-Only or Read/Write access when creating sharing rules."

### Which objects support sharing rules

From the Sharing Rule Considerations page:

- **Enterprise, Performance, Unlimited and Developer editions:** account, campaign, case, contact, lead, opportunity, and custom objects.
- **Professional Edition:** account, asset, campaign and contact only.
- **Product2:** "you can create only guest user sharing rules. Criteria-based and owner-based sharing rules aren't available."

### Prerequisite

"To create sharing rules, your organization-wide defaults must be Public Read Only or Private." If an object is already Public Read/Write, there is nothing left to grant, so there is no rule to write.

### Limits

| Limit | Number | Source |
| --- | --- | --- |
| Total sharing rules of all kinds, per object | **300** | Platform Sharing Architecture |
| Criteria-based plus guest user sharing rules, per object | **50** | Platform Sharing Architecture |

Ownership-based rules therefore have no separate cap of their own. They compete for the 300 with everything else.

### When to use it

When the group of people who need access is stable and describable in advance, and when what defines the records is *who owns them*. Trailhead: "Sharing rules work best when they're defined for a particular group of users that you can determine or predict in advance, rather than a set of users that frequently changes."

### Limits and traps

- **They only open access.** There is no such thing as a sharing rule that takes access away.
- **They cost recalculation.** Creating, editing or deleting one starts a recalculation. So does moving a user in or out of a source group.
- **Redundant rules are a real cost.** The enterprise scale whitepaper says to "Remove redundant paths of access, such as sharing rules that provide access to people who already have it through the hierarchy." Every redundant rule is extra rows to write and extra work on every realignment.
- **A user in a skewed role is a landmine.** If the source role or group of a sharing rule contains a user who owns more than 10,000 records, moving that user costs a very large recalculation. See section 17.

---

## 7. Criteria-based sharing rules

### What it does

A criteria-based sharing rule ignores who owns the record and looks at field values instead. "Criteria-based sharing rules provide access to records based on the record's field values." For example: share every Job Application record where Department equals IT with the IT Managers public group.

### What it can target

The destination group is the same set as an ownership-based rule: roles, roles and subordinates, public groups, queues, territories.

The source is a condition on the record itself, expressed as field, operator, value.

### The field types you can use, and the ones you cannot

This is the single most important practical limitation of criteria-based sharing, and the reason so many orgs end up writing Apex instead.

**Salesforce's exact sentence: "In criteria-based sharing rules, you can't use lookup fields, encrypted fields, formula fields, or fields whose values are derived from other fields on the record."**

That means:

- **No formula fields at all**, including and especially a formula field that reaches across a relationship to pull a value from another object. If your rule needs "share this Case when its parent Account's Region is EMEA", you cannot express it directly.
- **No lookup fields**, except a lookup to a user or a queue, which is allowed as a field type.
- **No encrypted fields.**
- **No roll-up summary fields or anything else derived from other fields.**

The supported field types are: Auto Number, Checkbox, Date, Date/Time, Email, Lookup (to a user or queue ID), Number, Percent, Phone, Picklist, Text, Text Area, and URL.

### The documented workaround

Straight from Salesforce: "You can use a field that's not supported by criteria-based sharing rules. Create a workflow rule or Apex trigger to copy the value of the field into a text or numeric field. Then use that field as the criterion."

In plain terms: add a plain text or number field, have automation copy the real value into it whenever it changes, and point the sharing rule at the copy. It works, and it is what most orgs do. The cost is that the copy can drift out of date if the automation misses an edit path, and a stale copy means stale access. Bulk data loads, `Database.update` with automation bypassed, and changes made on the *parent* record without touching the child are the three places drift creeps in.

### Other limits

- **50 per object**, shared with guest user sharing rules.
- **240 character value limit.** "The value criteria is limited to 240 characters, and strings or picklist values that go beyond this limit are truncated."
- The value must be "a literal number or string". You cannot compare one field to another field.
- They count toward the 300 total sharing rules per object.

### When to use it

When the records that need sharing are defined by what they contain rather than who owns them, and when the deciding field is a plain stored field. Classic cases: a Region picklist, a Confidential checkbox, a Record Type stamped into a text field.

### When not to

When the deciding value lives on a related record, unless you are willing to maintain the copied-field workaround. When the rule count on that object is already near 50. When the criteria change frequently, because every edit triggers a recalculation.

---

## 8. Guest user sharing rules

### What it does

A guest user is a visitor to an Experience Cloud site who has not logged in. Salesforce sets every object's access for guest users to Private, permanently, with no way to change it through org-wide defaults. A guest user sharing rule is the only door.

Salesforce's own words: "A guest user sharing rule is a special type of criteria-based sharing rule and the only way to grant record access to unauthenticated guest users."

### What it can grant

**Read Only. That is the entire list.** A guest user sharing rule cannot grant create, edit or delete.

### The warning

Salesforce writes this in unusually blunt language, and it is worth quoting in full because it is the sentence to show a client who asks for one:

> "By creating a guest user sharing rule, you're allowing immediate and unlimited access to all records matching the sharing rule's criteria to anyone."

And: "Salesforce is not responsible for any exposure of your data to unauthenticated users based on this change from default settings."

### Limits

- **50 per object**, the same pool that criteria-based sharing rules draw from.
- Counts toward the 300 total sharing rules per object.
- Product2 supports guest user sharing rules and no other kind.

### When to use it

Only for data that could sit on a public web page with no harm done: a public product catalogue, a list of published events, a knowledge article set. Salesforce's guest user profile guidance is to give the guest user no object access at all wherever possible, and Read at most where a business case exists.

**Never use it as a shortcut to make an integration work.** An integration should authenticate.

---

## 9. Manual sharing

### What it does

Manual sharing is one person clicking Sharing on one record and handing it to somebody. Salesforce also calls it **user managed sharing** in developer documentation. "Manual sharing lets record owners or users with sufficient permissions give read and edit access to users."

### Who can do it

- The record's owner.
- Anyone above the owner in the role hierarchy, when Grant Access Using Hierarchies is on for that object.
- Anyone with Full Access to that record.
- Anyone with the Modify All permission on that object, or Modify All Data at org level.

### What it can target

A user, a personal group, a public group, a role, a role and subordinates, or a queue.

### Access levels

Read Only or Read/Write. Full Access exists as a value in the underlying share object but is described as internal in developer documentation, and is not something a user grants by hand.

### Which objects support it

Any object that has a share object, which means any object whose org-wide default is Private or Public Read Only. Standard objects and custom objects alike. If an object's OWD is Public Read/Write there is nothing left to grant and the Sharing button does not appear.

### The limit that catches everyone

**Manual sharing is deleted when the record's owner changes.** Salesforce states it twice in different documents:

> "Manual sharing is removed when the record owner changes or when the sharing access granted doesn't grant additional access beyond the object's organization-wide sharing default access level."

and

> "User managed sharing is removed when the record owner changes or when the access granted in the sharing does not grant additional access beyond the object's organization-wide sharing default access level."

So the second half matters too: if you widen an object's OWD so that the manual share no longer adds anything, the share row is deleted. If you later narrow the OWD again, it does not come back.

### When to use it

Genuine one-offs. "Give Priya this one deal because she is covering while I am away." A manual share is a fine answer to a question that will not be asked again.

### When not to

Whenever the same hand-off happens repeatedly. Manual shares are invisible in aggregate, cannot be reported on easily, and vanish on the next owner change. If the business is doing it a lot, they are describing a sharing rule, a team, or an Apex sharing requirement, and they do not know it yet.

---

## 10. Apex managed sharing

### What it does

Apex managed sharing is code that writes rows directly into an object's share object. It exists for the cases the point-and-click tools genuinely cannot express.

Salesforce's framing: it "provides developers with the ability to support an application's particular sharing requirements programmatically through Apex or the SOAP API."

### The three kinds of sharing, in developer language

The Apex Developer Guide names three, and knowing the names makes error messages readable:

| Name | What it is |
| --- | --- |
| **Managed sharing** (older docs say "Force.com managed sharing") | Everything Salesforce does by itself: ownership, role hierarchy, sharing rules |
| **User managed sharing** | Manual sharing, as in section 9 |
| **Apex managed sharing** | Rows written by code with a custom sharing reason |

### The share object pattern

Every object whose org-wide default is Private or Public Read Only has a partner share object.

- **Standard objects:** object name plus `Share`. Account has `AccountShare`. Case has `CaseShare`.
- **Custom objects:** the object name with `__c` replaced by `__Share`. `Job__c` has `Job__Share`.

Every share row carries four things:

| Field | What goes in it |
| --- | --- |
| `ParentId` | The ID of the record being shared. Cannot be updated after insert |
| `UserOrGroupId` | The ID of the user or group receiving access |
| `AccessLevel`, named per object, for example `JobAccessLevel` or `AccountAccessLevel` | `Read`, `Edit`, or `All`. `All` is internal and cannot be granted by code |
| `RowCause` | Why the access exists. This is the field that decides everything below |

The whitepaper lists the row causes you will see when querying a share object, including `Owner`, `Rule`, `Manual`, `Team`, `Territory` and `ImplicitChild`.

### The rule that Apex managed sharing exists for

**A share row with `RowCause` set to `Manual` is deleted when the record's owner changes. A share row with a custom Apex sharing reason is not.**

Salesforce's exact sentence: "Apex managed sharing is maintained when the record owner changes or is deactivated."

This is the whole point. If you write a trigger that inserts share rows with `RowCause = 'Manual'`, everything works in testing, and then the first time a record is reassigned all your grants silently disappear. You must create a custom Apex sharing reason and use that instead.

### Apex sharing reasons

An Apex sharing reason is a named label you define on a custom object in Setup, so that share rows can say *why* they exist.

| Fact | Detail |
| --- | --- |
| Purpose | "Apex sharing reasons for individual custom objects to indicate why sharing was implemented" |
| **Limit** | **10 Apex sharing reasons per custom object** |
| **Scope** | **Custom objects only.** There is no equivalent for standard objects |
| Who can write to those rows | "Only users with the 'Modify All Data' permission can add, edit, or delete sharing that uses an Apex sharing reason" |
| **Deleting a reason** | **"Deleting an Apex sharing reason will delete all sharing on the object that uses the reason."** This is destructive and immediate |
| Naming | Underscores and alphanumeric characters only; must be unique in the org |
| How you reference it in code | `Schema.Job__Share.RowCause.Recruiter__c`, or in the older documented form `Schema.Job__Share.Apex_Reason.Recruiter` |

Because standard objects have no Apex sharing reasons, code that shares a standard object can only write `Manual` rows, and those rows die on owner change. That is a real architectural constraint, not a detail. If a standard object needs programmatic sharing that survives ownership changes, the usual answers are: re-run the code on owner change with a trigger, or move the requirement to a criteria-based sharing rule fed by a copied field.

### One more behaviour to know

"When sharing is recalculated, Salesforce also runs all Apex sharing recalculations." If you implement the `Database.Batchable` sharing recalculation interface and register it against your custom object, changing an org-wide default will set it running.

### When to use it

- The sharing condition depends on a value on a related record, and the copied-field workaround for criteria-based rules is not acceptable.
- The set of people who need access is computed, not describable as a static group.
- You are past the 50 criteria-based rules per object limit.
- Access must be granted to a specific individual per record, computed from data.

### When not to

Anything a sharing rule can express. Apex sharing is code you now own forever, it needs tests, it needs a recalculation batch job for the case where it falls out of step, and it is invisible in Setup.

---

## 11. Teams: account, opportunity and case

### What they do

A team is a named list of collaborators on one specific record, each with their own access level. "A team is a group of users that work together on an account, sales opportunity, or case."

Three kinds exist, one per object:

| Team | Lives on | Typical use |
| --- | --- | --- |
| **Account team** | Account | The people who jointly look after one customer |
| **Opportunity team** | Opportunity | The people working one deal |
| **Case team** | Case | The people working one support ticket |

**There is only one team per record.** You cannot have two account teams on the same account.

### What each grants

**Account teams.** A member gets Read/Write or Read Only on the account. Salesforce's wording: "A member's access level can be read and write or read only, but it's at least equal to the default account sharing access." Members can additionally be given access to the account's related contacts, opportunities and cases, which is set per member when they are added.

**Opportunity teams.** A member gets an access level on that one opportunity, Read Only or Read/Write. Opportunity teams are also the prerequisite for opportunity splits: you must enable team selling before you can enable splits.

**Case teams.** Access is decided by the **case team role** the member is given, not by picking an access level per person. A role carries one of three levels:

| Case team role access | What it allows |
| --- | --- |
| **Read/Write** | View and edit cases, and add related records, notes and attachments |
| **Read Only** | View cases and add related records to them |
| **Private** | No access to the case at all |

That last one is worth pausing on. A Private case team role adds someone to the team for visibility and notification purposes without giving them the record. It is not a way to take access away from someone who already has it.

### Who can add members

"Only owners, people higher in the hierarchy, and administrators can add team members and provide more access."

### Default teams

A user can set up a **default account team** in their own personal settings. When they create an account, or take ownership of one, their default team is added automatically. The important boundary, quoted: "Changes that you make to one account's account team don't affect your default account team or the teams on your other accounts." Editing a default team does not retroactively update accounts that already have the old version.

There is an equivalent default opportunity team. Case teams have **predefined case teams** instead, which an admin sets up centrally, and which can be attached automatically by case assignment rules that match specific criteria.

### How team membership interacts with the rest of sharing

- A team membership produces an **explicit grant**, exactly like a sharing rule does. The whitepaper lists "A user becomes part of a team for an account, opportunity, or case" as one of the situations that creates an explicit grant, and the row appears in the share object with a `Team` row cause.
- Because it is an ordinary share row, the role hierarchy still applies on top. A team member's manager inherits what the team member got.
- **A team never reduces access.** If someone already has Read/Write through a sharing rule and you add them to the team as Read Only, they keep Read/Write. The most permissive grant wins.
- **Teams are per record, so they scale badly by hand.** Ten thousand accounts with five team members each is fifty thousand rows an admin has to maintain. That is what account team assignment automation, or territories, are for.
- **Account teams participate in implicit child sharing.** The implicit sharing table explicitly says the child implicit share "Supports account team access based on team settings", which is how an account team member ends up seeing the account's opportunities and cases.

### One reporting trap

Salesforce warns that "The account team member record shows only the directly granted access, while the Team Member Access action shows the user's total access from all sources." If you build a report from team member records to answer "who can see this account", the answer will be wrong, because it misses everything granted by other mechanisms.

### When to use teams

When collaboration on a record is genuinely ad hoc and record-specific, and the people change deal by deal. Teams are the right tool for "this deal has a solution engineer and this one does not".

### When not to

When the same set of people always works the same set of records, defined by a rule. That is a sharing rule or a territory, and it will be a fraction of the maintenance.

---

## 12. Enterprise Territory Management, now called Sales Territories

### Naming

The current Salesforce implementation guide is titled **Sales Territories Implementation Guide** and the Setup button now reads **Enable Sales Territories**. Older documentation, older help URLs, and every certification exam guide call the same feature **Enterprise Territory Management**, often abbreviated ETM. They are the same feature. Both names appear in live Salesforce help pages as at 2026-08-25.

There is also an older, retired feature called simply "Territory Management", sometimes called Territory Management 1.0. This document is about the current one.

### What it does

Territories are a second hierarchy, running alongside the role hierarchy, that grants record access based on which territory a record belongs to and which territories a user is assigned to.

The building blocks:

| Piece | What it is |
| --- | --- |
| **Territory model** | One complete territory setup: the hierarchy, the account assignment rules, and the user assignments. **Only one model can be Active at a time.** Others sit in Planning or Archived state |
| **Territory hierarchy** | The tree of territories inside a model. This is the main screen you work from |
| **Territory type** | A label that groups territories for your own reference. Types do not appear in the hierarchy |
| **Assignment rules** | Rules that put accounts into territories automatically, based on account field values |
| **User assignment** | Which people belong to which territory |

Territory model states, quoted from the implementation guide:

- **Planning:** "The default state for every new territory model you create. The Planning state lets you preview a model's territory hierarchy before deploying it."
- **Active:** "Only one model in your Salesforce organization can be active at a time." Users assigned to territories in the active model can access and modify the accounts and leads assigned to them.
- **Archived:** admins can still view how it was configured. "Only the active model can be archived, and archived models can't be reactivated." Archiving blanks the Territory field on opportunities and deletes territory forecasts, forecast types, quotas and adjustments.

### What access it grants

You set default access levels in Setup, under Territory Settings, then you can override them per territory. From the implementation guide:

> "Standard record access settings apply to accounts, leads, and opportunities. If you use Private default internal access for contacts or cases, you can set access for those records."

So five objects in total: **accounts, leads, opportunities**, plus **contacts and cases** but only when their internal org-wide default is Private.

There is one more setting, and it is the one that surprises people:

> "You can also choose the access level that users get to the opportunities assigned to their territories' child territories."

And the direction of inheritance, quoted exactly, because it reads backwards at first:

> "The territory's access level is inherited by the parent territories above it in the territory hierarchy. For example, San Francisco (view opportunities) is a child territory of California (view and edit opportunities). A user assigned to California has view access to San Francisco opportunities, but not view and edit."

Read that twice. The **child's** setting decides what the **parent** gets. A user in California does not get their own California setting when looking at San Francisco records. They get San Francisco's setting.

### How records get assigned

- **Accounts** can belong to **many** territories, assigned by rules or by hand.
- **Opportunities** can belong to **one** territory only, held in the standard `Territory2Id` lookup field on Opportunity.
- **Filter-Based Opportunity Territory Assignment** is a job that assigns territories to opportunities. Salesforce supplies sample Apex you can use as-is or modify. Its logic: skip opportunities excluded from the filter; otherwise take the territory from the opportunity's account; if the account has several territories from the active model, use the `Priority` field on the `Territory2Type` object, or your own criteria, to pick one.

### Permissions

| To do this | You need |
| --- | --- |
| Create territory models and all related records, view models in every state, activate, archive, delete or clone a model | **Manage Territories** |
| Create or edit account assignment rules | **View All on Accounts** and **Manage Territories** and (**View Setup and Configuration** or **Customize Application**) |
| View the Setup tree and the Active model | **View Setup and Configuration** |

One warning from the guide: Manage Territories lets a user see the *list* of accounts and leads assigned to Planning and Archived territories, but "Doesn't provide access to the accounts and leads assigned to territories in planning and archived state. Only the name and ID fields appear in the list." To run territory planning reports, those users need access to the records some other way.

### Editions

Performance and Developer editions, and Enterprise and Unlimited editions with Sales Cloud.

### When Sales Territories is the right answer instead of sharing rules

Reach for territories, not sharing rules, when **any** of these is true:

1. **Selling responsibility is matrixed.** One account is worked by a named-account team, a product overlay and a geographic rep at the same time. A role hierarchy is a tree and cannot express that. The architect guidance is explicit that territories support "matrix reporting structures where individuals report to multiple managers".
2. **Coverage is realigned on a schedule.** Quarterly or annual realignment is the scenario territories were built for. Planning-state models let you build and preview the next alignment while the current one is still live, then flip.
3. **Assignment is driven by account attributes.** Territory assignment rules do this natively. The equivalent with sharing rules would be criteria-based rules on a copied field, one rule per territory, and you would hit the 50 rule cap fast.
4. **Access must follow the account down to its opportunities and cases** without you writing a rule per object.

Reach for sharing rules instead when the grouping is stable, small, and describable as "this role's records go to that group". Territories are a large piece of machinery. Do not install them for three exceptions.

### The cost

Territory operations are group membership operations. That means they contend for the same locks as role changes and user provisioning. Section 16 has the concurrency table, and territory operations appear all over it.

---

## 13. Implicit sharing, the one nobody configures and everybody trips over

### Why this section matters most

Implicit sharing is access that Salesforce grants by itself, that appears in no Setup screen, and that **cannot be switched on or off**. Salesforce's own sentence, quoted exactly:

> "Implicit sharing is automatic. You can neither turn it off, nor turn it on, it is native to the application."

Nearly every "why can this person see that account?" mystery in a Salesforce org ends here. It is the most commonly missed mechanism, and it is the one that makes people believe the sharing model is broken when it is working exactly as designed.

The enterprise scale whitepaper explains its purpose: "This kind of sharing is called implicit because it's defined and maintained by the system to support collaboration among members of sales teams, customer service representatives, and clients or customers."

### The two you will meet in every org

**Parent implicit sharing.**

> "Parent implicit sharing is providing access to parent records (account only) when a user has access to children opportunities, cases, or contacts for that account."

In plain words: **if you can see a Contact, a Case or an Opportunity, you can see its Account, read only.** Even if the Account org-wide default is Private and nothing grants you that Account.

The details from the whitepaper's table:

- It grants **read only** access to the parent account. Never edit.
- It is **not used** when the child's sharing is Controlled by Parent. If Contact is Controlled by Parent, contacts create no parent implicit shares, because the child had no independent access to inherit from.
- It is **expensive to maintain with many account children**. See parent-child data skew in section 17.
- **When a user loses access to one child, Salesforce must check every other child** of that account before it can delete the parent implicit share.
- It is **not granted by the View All permission on the child object.** If you can see all cases through View All, that does not implicitly hand you every account.

Their worked example: "Henry is a Standard User with access to an opportunity through an owner-based sharing rule. He can view data about the opportunity's parent account, but he can't edit the account's data."

**Child implicit sharing.**

> "Child implicit sharing is providing access to an account's child records to the account owner. This access is defined at the owner's role in the role hierarchy."

In plain words: **if you own an Account, you may automatically get its Contacts, Cases and Opportunities**, and how much you get is set on your **role**, not on the account and not on the child records.

Those three settings live on the role record in Setup and are named Contact Access, Opportunity Access and Case Access. Each can be set to no access, view, or view and edit, depending on the object.

The details from the table:

- **Not used** when the child's sharing is Controlled by Parent.
- **Controlled by the child access settings for the account owner's role.**
- **Supports account sharing rules that grant child record access.** An account sharing rule can carry child access with it.
- **Supports account team access based on team settings.** This is how an account team member sees the account's opportunities and cases.
- **When a user loses access to the parent, Salesforce removes the user's access to all child records.**
- **Not granted by the View All permission on the parent object.**

Their worked example: "Henry is a Standard User who owns an account. The Salesforce admin set up Henry's role so that assigned users can view all opportunities, cases, and contacts associated with accounts they own."

### The full implicit sharing table

All five kinds, from the enterprise scale whitepaper.

| Type | What it provides | Key details |
| --- | --- | --- |
| **Parent** | Read-only access to the parent account, for a user with access to a child case, contact or opportunity | Not used when child sharing is Controlled by Parent. Expensive with many children. Losing access to one child forces a scan of all other children. Not granted by View All on the child object |
| **Child** | Access to child case, contact or opportunity records, for the owner of the parent account | Not used when child sharing is Controlled by Parent. Controlled by the child access settings on the account owner's role. Supports account sharing rules and account teams. Losing parent access removes all child access. Not granted by View All on the parent object |
| **Experience Cloud Site** | Access to a customer or partner account and all associated contacts, for all customer or partner users under that account. Also access to a case for the customer or partner user who is the contact on that case | "Account and associated contacts shared with the lowest role under the customer or partner account" |
| **High Volume** | Full access to data owned by high-volume users associated with a sharing set, for members of the sharing set's share group | High-volume users have a streamlined sharing model that does not use roles or groups, so external users can scale into the millions. Covers the Customer Community, High Volume Customer Portal and Authenticated Website licence types |
| **High Volume Parent** | Read-only access to the parent account of records shared through a sharing set's share group | Keeps the parent account visible to people given access to account children owned by high-volume users |

### What implicit sharing does not do

- **It does not apply to custom objects.** Quoted: "Implicit sharing doesn't apply to custom objects." A custom object with a lookup to Account gets none of this. If you need a user who can see a custom child record to also see the Account, you have to build that yourself.
- **It does not apply between two standard objects other than the Account-to-Contact, Account-to-Case and Account-to-Opportunity relationships**, plus the portal cases above. Orders get implicit read-only access to the parent account for owners and their managers in the hierarchy; Contracts are configured through the same org-wide default setting as accounts.
- **It does not give edit on the parent.** Parent implicit sharing is read only, always.

### What to do about it

You cannot turn it off. What you can do:

1. **Design around it.** If Contact must never leak the Account, set Contact to Controlled by Parent. The whitepaper's own recommendation: "To avoid creating parent implicit shares, configure child objects to be Controlled by Parent wherever this configuration meets security requirements."
2. **Expect it when auditing.** When somebody can see an account they should not, look at their access to that account's cases, contacts and opportunities first.
3. **Keep child counts under control**, because parent implicit sharing is where account data skew turns into an outage. Section 17.

---

## 14. Restriction rules

### What it does

Restriction rules are the one mechanism in this document that **takes access away**. Everything else adds.

Salesforce's framing: "instead of opening up access to users, they further restrict it." And the mechanism: "the records that the user is granted access to via org-wide defaults, sharing rules, and other sharing mechanisms are filtered by criteria that you specify."

So the order is: everything else runs and decides what you can reach, then the restriction rule filters that set down. A restriction rule can never grant anything. It can only remove.

The user experience: "When users navigate to list views, reports, or perform searches, they see only the records that meet the restriction rule's criteria."

### Which objects support them

Salesforce's two pages give slightly different lists as at 2026-08-25.

- The **Restriction Rules** overview page lists: custom objects, external objects, **quotes**, contracts, events, tasks, time sheets, and time sheet entries.
- The **Restriction Rule Considerations** page lists: custom objects, external objects, contracts, events, tasks, time sheets, and time sheet entries. It does not name quotes.

Treat the union as the working list and check the object you actually need in your own org before designing around it. Note what is **not** on either list: Account, Contact, Case, Opportunity and Lead. Restriction rules are not available on the core sales and service objects.

### Limits

| Limit | Number |
| --- | --- |
| Active restriction rules per object, Enterprise and Developer editions | **2** |
| Active restriction rules per object, Performance and Unlimited editions | **5** |
| Restriction or scoping rules that can evaluate to true for one user on one object at a time | **1** |

Editions: Enterprise, Performance, Unlimited and Developer. Lightning Experience only. Salesforce recommends turning off Salesforce Classic for the org.

### Where they apply

"Links, list views, lookups, records, related lists, reports, search, SOQL, and SOSL."

### The gaps you must know about

These are the ones that turn a restriction rule from a security control into a false sense of security.

1. **View All and Modify All bypass them.** Users with View All Records or View All Data see everything regardless. Users with Modify All Records or Modify All Data can view, edit and delete everything regardless.
2. **They do not apply to code running in system mode.** Apex without sharing enforcement ignores them entirely.
3. **They do not cascade to child objects.** "Creating a rule on Contracts won't restrict associated notes." Each object needs its own rule.
4. **`UserRecordAccess` ignores them.** If you query that object to answer "can this user see this record", the answer will not account for restriction rules.
5. **Record names can still leak in global search shortcuts**, even though the record itself cannot be opened.
6. **Cloning a record that has a lookup to a restricted record produces an error.**

### When to use it

When a defined group of people must be prevented from reaching a subset of records on a supported object, and the ordinary approach of "just do not grant it" is not available because the access comes from somewhere you cannot remove, such as an OWD you cannot tighten or a role hierarchy grant.

### When not to

- As the only control on genuinely sensitive data. The View All bypass alone means a restriction rule is a guardrail, not a wall.
- On Account, Case, Contact, Opportunity or Lead, because it is not available there.
- When you have already used your two, or five, rules on that object.

---

## 15. Scoping rules

### What it does

Scoping rules are frequently confused with restriction rules and are a completely different thing.

> "Scoping rules let you control the records that your users see based on criteria that you select."

and, critically:

> "Scoping rules don't restrict the record access that your users already have. Your users can still open and report on all records that they have access to per your org's sharing settings."

A scoping rule is a **default filter**, not a security control. It makes a user's list views, reports and searches start out narrowed to the records they usually care about. They can still remove the filter and see everything they have access to.

### Which objects support them

> "Scoping rules are available for custom objects and the account, case, contact, event, lead, opportunity, and task standard objects."

Note that this list is almost the inverse of the restriction rules list. Scoping rules cover the core sales and service objects; restriction rules do not.

### Limits

| Limit | Number |
| --- | --- |
| Active scoping rules per object, Developer edition | **2** |
| Active scoping rules per object, Performance and Unlimited editions | **5** |
| Scoping or restriction rules that can evaluate to true for one user on one object at a time | **1** |

Lightning Experience only.

### Other constraints

- **Operators:** outside SOQL, only the EQUALS operator is supported. AND and OR are not.
- **In SOQL:** the SELECT statement must include `USING SCOPE EVERYTHING`, and only the `$User.Id` dynamic variable is supported. Other user field variables are not.
- **Supported data types:** boolean, date, dateTime, double, int, reference, string, time, and single picklist values.
- **Cross-object references:** "You can reference another object's field using dot notation ... only one lookup level from the targetEntity."
- **Person accounts:** avoid `IsPersonAccount` fields on accounts. Person Account fields are not supported.
- **Not supported for the SOQL operator:** ActivityHistory, Attachments, Event, EventAttendee, Note, OpenActivity, and tag objects.
- Salesforce may disable a scoping rule that performs badly.

### When to use it

When a user's default working set is a subset of what they are allowed to see, and starting them in the subset saves them time. "Show me my region's accounts first" is the shape of the requirement.

### When not to

Anywhere the requirement is security. It is not a security control and Salesforce says so plainly.

---

## 16. Sharing recalculation, deferral and group membership locking

### What triggers a recalculation

Salesforce's defer sharing tip sheet splits this into two kinds of calculation, and the split matters because you can defer them separately.

**Group membership calculation runs anytime you:**

- Change or reparent roles
- Add or remove users from territories
- Update public group members
- Update portal account ownership if the new owner has a different role

**Sharing rule calculation runs anytime you:**

- Change an organization's default sharing model (that is, change an OWD)
- Create, edit or delete sharing rules
- Create or transfer any records
- Update public group members
- Create or activate a user
- Change users' roles or update the role hierarchy
- Add or remove users from territories
- Reparent territories
- Make changes to roles, territories or public groups involved in sharing rules

The Recalculate Sharing Rules page gives a shorter list of automatic triggers: adding or removing individual users from a group, role or territory; changing which role a role reports to; changing which territory a territory is subordinate to; and adding or removing a group from within another group.

### How it runs

- **Asynchronously and in parallel.** You can carry on working, subject to the lock-outs below.
- You get an **email** when it finishes.
- Progress is visible in **Setup, Background Jobs**. Job subtypes include "Account, Extra Parent Access Removal", "Account, Parent Access Grant" and "Object, Access Cleanup".
- Every sharing-related change is logged in **Setup Audit Trail**, including suspending, resuming and recalculating. The audit trail download covers the past **180 days**.
- **Account, case, contact and opportunity recalculate together**, because the other three are children of Account.
- **You cannot modify org-wide defaults while sharing rule recalculation is running for any object, and vice versa.** Other objects stay editable.
- Apex sharing recalculations run as part of it.

### Manual recalculation

There is a Recalculate button on each object's Sharing Rules related list in Setup. Salesforce's guidance: only use it "if sharing rule updates have failed or aren't working as expected", because it takes a long time. The button is greyed out while calculations are deferred.

### Deferred sharing calculations

**What it is.** A feature that lets an admin suspend and resume sharing calculations, so a large batch of configuration changes can be made without each one setting off its own recalculation.

**It is off by default and Salesforce Customer Support has to turn it on.** Quoted: "The Defer Sharing Calculation feature isn't enabled by default. To enable Defer Sharing Calculation, contact Salesforce Customer Support."

**How it is used, from the enterprise scale whitepaper:**

1. The admin identifies the changes to the role hierarchy, group membership or sharing rules.
2. The admin negotiates a maintenance window, having modelled it in a full copy sandbox first.
3. The admin prepares everything ahead of the window instead of processing changes one at a time.
4. At the start of the window, the admin uses the deferral feature to turn off group membership or sharing rule calculations, then makes all the changes at once.
5. After the changes complete, the admin resumes calculations.
6. The org is now in a state that requires a **full recalculation of all sharing rules** before access is correct. The admin runs it immediately or schedules it.

**The dependency to remember:** "You can choose to only defer sharing rules calculations. However, if you defer group membership calculations, sharing rule calculations are automatically deferred." Group membership deferral is the bigger hammer and it drags sharing rules with it.

**What still happens while deferred.** This is the part that surprises people:

- If you defer **sharing rule** calculations only, "other sharing-related changes are still processed immediately". Manual shares, teams, queues, and roles not referenced in any sharing rule all still evaluate live.
- If you defer **group membership** calculations, "membership changes involving individual users are still reflected immediately". What stops is nested group membership and anything driven by role hierarchy changes.
- "Deferring sharing calculations doesn't defer the recalculation of some sharing changes in order to preserve data integrity. These calculations that can't be suspended can take significant time to process."
- **"Group membership locking can also still occur while sharing calculations are deferred."**

**Salesforce's own timing advice:** "We recommend that you resume sharing calculations immediately after making your changes, and then start the full sharing rule recalculation as soon as possible during a period of low activity."

**Testing advice, stated twice in two documents:** test the whole process in a full copy sandbox "refreshed within the last 30 days" that reflects all major changes.

**Who should use it.** The whitepaper's test: if your organizational changes and sharing rule updates already finish quickly enough to fit in a workday or a weekend, you will not benefit. If you can negotiate downtime with the business and you have been struggling to finish updates in time, it is the right tool.

**One warning to carry into the decision:** "deferring organizational maintenance requires recalculating sharing rules for all objects."

### Group membership locking

**What it is.** When you change roles or group membership, Salesforce locks the tables holding group membership data so that two changes cannot corrupt each other. If two operations collide you get "could not acquire lock" or "Group membership operation already in progress" and have to retry.

**When it bites.** "Customers who experience these locking errors are typically executing large-scale data loads or integrations with other internal systems that are making changes to role and group structure, user assignments to roles and groups, or both." The peak risk is "during periodic organizational realignment events, such as end-of-year or end-of-quarter processing".

There is also a deployment trap: "You can also receive locking errors if you're updating the role hierarchy or group membership while running other deployments that also update group membership information or have Apex tests that do so." That is directly relevant to any project running metadata deploys and admin changes at the same time.

**How to lessen it**, from the whitepaper:

- Schedule separate group maintenance processes so they do not overlap
- Put retry logic in integrations and automated group maintenance
- Try serial processing if parallel processing causes locks

**Granular locking.** This is on by default. It analyses each operation and locks only the parts of the table that operation touches, so unrelated changes can run at the same time.

Its stated advantages:

- Groups in separate hierarchies can be changed concurrently
- Public groups and roles that do not include territories are not blocked by territory operations
- Users can be added concurrently to territories and public groups
- User provisioning can happen in parallel; creating external users needs a lock only if new external roles are being created; provisioning new external users in existing accounts happens concurrently
- A single long-running process, such as deleting a role, blocks only a small subset of operations

**What still blocks nearly everything: role reparenting**, meaning moving a role within the hierarchy. The whitepaper calls it out by name: "certain operations, such as reparenting (moving roles within the role hierarchy), still block almost all other group updates." Changing the owner of a customer or partner account counts as role reparenting.

**The concurrency table**, reproduced from the whitepaper. If a pairing is not in this table, it is not supported and locking can occur.

| Group operation | Can run at the same time as |
| --- | --- |
| **Role creation** | User role change (owner must not own customer or partner accounts); territory reparenting; territory deletion; territory creation; removal of user from territory; addition of user to territory; provisioning a standard or external user in an existing role |
| **Role deletion** | Territory reparenting; territory deletion; territory insertion; removal of user from territory; addition of user to territory |
| **Role reparenting**, which includes changing the owner of a customer or partner account | Territory creation, and nothing else |
| **Adding user to territory** | Role deletion; role insertion; territory creation; addition of user to territory; user provisioning |
| **Removing user from territory** | Role deletion; role insertion; territory creation; user provisioning |
| **Territory reparenting** | Role deletion; role insertion; user provisioning |
| **Territory deletion** | Role deletion; role insertion; user provisioning |
| **Territory creation** | Role reparenting; role deletion; role insertion; user role change; addition of user to territory; removal of user from territory; user provisioning |
| **Provisioning an internal user with an existing role** | Role insertion; user role change; territory reparenting; territory deletion; territory creation; removal of user from territory; addition of user to territory; user provisioning |
| **Changing user role**, where the user owns no customer or partner accounts | Role insertion; territory insertion; user provisioning |
| **Provisioning the first customer or partner user under an account** | User role change; territory reparenting; territory deletion; territory creation; removal of user from territory; addition of user to territory; provisioning a standard or external user in an existing role |
| **Creating a second customer or partner user under an account** | Role insertion; user role change; territory reparenting; territory deletion; territory creation; removal of user from territory; addition of user to territory; user provisioning |
| **Provisioning a high-volume Experience Cloud site user** | Any group membership operation |
| **Changing customer or partner account owner** | Territory creation, and nothing else |
| **Changing the role of a user who owns a customer or partner account** | Territory creation, and nothing else |

### Record-level locking, which is a different thing

Separate from group membership locking, Salesforce takes brief record-level database locks during ordinary data updates. These are held "very briefly" and are not the same performance risk, but they still cause failures.

The specific case to know: **for objects in a master-detail relationship, updating a child record locks both the child and the parent.** Two situations produce locking errors:

- Updates to parent records and their children processed at the same time in separate threads
- Updates to child records that share the same parent processed at the same time in separate threads

The fix, from the whitepaper: "Sequence operations on parent and child objects by `ParentID` and ensure that different threads are operating on unique sets of records." Add retry logic for occasional errors.

---

## 17. Data skew: ownership, parent-child and lookup

Data skew means too many things pointing at one thing. Three kinds matter, and all three have a **10,000 record** threshold.

The general statement from the architect guidance: "The ratio where we start seeing performance degradation is 1:10,000."

### Ownership skew

**Definition, quoted from the enterprise scale whitepaper:**

> "Ownership data skew is when a single user owns more than 10,000 records of an object."

**How it happens.** Somebody assigns all unassigned leads to a dummy user. Somebody makes an integration user the owner of every record it creates. Somebody parks retired records under a "Data Migration" account owner.

**Why it hurts.** If that user is moved around the hierarchy, or moved into or out of a role or public group that is the source of a sharing rule, "Salesforce must adjust a very large number of entries in the sharing tables, which can lead to a long-running recalculation of access rights."

**What to do, in the whitepaper's own order of preference:**

1. **Distribute ownership across more users.** This is the real fix.
2. If you must concentrate ownership, **do not give that user a role at all.** A user with no role is not in the hierarchy, so there is nothing to recalculate.
3. If the user must have a role in order to share data:
   - "Place them in a separate role at the top of the hierarchy." The whitepaper adds a warning in the same breath: "Note that this user inherits access to all data owned by or shared with users below them in the hierarchy."
   - "Don't move them out of that top-level role to avoid triggering sharing recalculations."
   - "Keep them out of public groups that can be used as the source for sharing rules."

**The stated best-practice limit:** "Limit the number of records of an object owned by a single user to 10,000."

The same warning applies to a partner or customer account with a large amount of data under it. Changing that account's owner, or moving its users in the hierarchy, forces Salesforce to recalculate all the sharing and inheritance for everything under the account.

### Parent-child data skew, also called account data skew

**Definition, quoted:**

> "A common configuration that can lead to poor performance is the association of a large number of child records (10,000 or more) with a single parent account."

**How it happens.** Contacts bought from a list or generated by marketing, with no real account. A contact must have an account, so an admin parks all of them under one dummy account. Salesforce names this exact scenario as the common case.

**Why it hurts.** This is where implicit sharing turns into a performance problem, and the whitepaper's worked example is the clearest explanation of the whole mechanism:

> "assume that you have 300,000 contacts all under the same account. A user with access to one of these contacts also has a parent implicit share in the account sharing table that gives the user access to that account. Now what happens if that user loses access to the contact? In order to determine whether to remove the user's sharing to the account, Salesforce must scan all of the other 299,999 contacts to ensure that the user doesn't have access to them either."

So a single visibility change on one contact costs a scan of 299,999 siblings. Do that in a bulk load and the org falls over.

There is a second cost too. Record-level locking means concurrent updates to children under the same parent contend for the parent's lock.

**The stated best-practice limit:** "Configure parent-child relationships with no more than 10,000 children to one parent record."

**Mitigations:**

- Spread children across more parents instead of one dummy account.
- Set the child object's org-wide default to **Controlled by Parent** where security allows, because that stops parent implicit shares being created at all. The whitepaper recommends exactly this.

### Lookup skew

**Definition, from the Salesforce engineering blog:**

> "Lookup skew happens when a very large number of records are associated to a single record in the lookup object."

Unlike the first two, this is not about sharing. It is about record locks during saves.

**Why it hurts.** When a record is saved, Salesforce locks the record its lookup fields point at, to keep referential integrity. If a hundred thousand records all point at the same lookup value, and many are being inserted or updated at once, they queue for the same lock. The blog notes that "locks are held the entire time your custom code is executing", so slow triggers make it much worse.

**The threshold.** Trailhead's large data volumes module states the general guidance as: do not have more than 10,000 records owned by a single user, with lookups to one record, or related to the same Account record. The engineering blog itself does **not** give a numeric threshold; it identifies risk by pattern instead, namely a large number of records plus heavy concurrent insert and update activity. Its worked example uses 500,000 accounts with more than 166,000 pointing at a single lookup record.

**Mitigations, from the blog:**

1. **Reduce save time.** Optimise Apex, consolidate workflows, move work to asynchronous processing. Shorter transactions hold locks for less time.
2. **Distribute the skew.** Add more lookup values so the pointing records spread out.
3. **Use a picklist instead of a lookup** when the set of values is small and stable.
4. **Reduce load.** Serialise automated processes and run them off-peak.

### Summary of the three

| Skew type | The thing that is concentrated | Threshold | What breaks |
| --- | --- | --- | --- |
| **Ownership skew** | Records owned by one user | more than 10,000 records of one object | Sharing recalculation when that user moves role or group |
| **Parent-child / account data skew** | Child records under one parent | 10,000 or more children to one parent | Implicit sharing maintenance; record locks on the parent |
| **Lookup skew** | Records pointing at one lookup target | no official number; Trailhead's general guidance is 10,000 | Record lock exceptions during concurrent saves |

---

## 18. Under the hood: how Salesforce actually stores access

You do not need this to configure sharing. You do need it to explain why something is slow, and to read a share object query.

### The four kinds of access grant

When an object's org-wide default is Private or Public Read Only, Salesforce records each grant of access as a grant of one of four kinds.

| Grant type | When it happens |
| --- | --- |
| **Explicit grant** | A record is shared directly to a user or group. This covers: a user or queue becoming the owner; a sharing rule sharing to a group, queue, role or territory; an assignment rule sharing to a user or queue; a territory assignment rule; a manual share; **a user joining an account, opportunity or case team**; and a programmatic customization sharing the record |
| **Group membership grant** | A user, group, queue, role or territory is a member of a group that has explicit access. Bob is in the Strategy group, the Strategy group has the record, so Bob has the record |
| **Inherited grant** | Access flows through a role hierarchy, a territory hierarchy, or a nested group hierarchy |
| **Implicit grant** | The built-in behaviours in section 13 |

The whitepaper flags the risk on explicit grants directly: "If your organization doesn't have an efficient sharing architecture, it might encounter performance problems when you use automated processes that generate a very large number of explicit grants, such as major sales realignments."

### The three kinds of table

| Table type | What it holds |
| --- | --- |
| **Object Record tables** | The records themselves, including who owns each one |
| **Object Sharing tables** | The rows supporting explicit and implicit grants. `AccountShare`, `CaseShare`, `Job__Share` and so on |
| **Group Maintenance tables** | Who belongs to which group, including Salesforce's own internal system-defined groups |

**An object does not get an Object Sharing table when any of these is true:**

- The object is the detail side of a master-detail relationship. The master's sharing table controls the detail.
- **Both** org-wide defaults, internal and external, are Public Read/Write. There is nothing to record.
- The object type does not support sharing tables at all, such as Activities and Files. Those have their own access mechanisms.

### How a query is answered

When you search or open a list view, Salesforce builds a SQL statement against the Object Record table, then joins it to the Object Sharing table on record ID, then joins that to the Group Maintenance tables on user ID or group ID. A record comes back only if it exists **and** one of those two paths grants you access.

| When joining | Salesforce matches on |
| --- | --- |
| Object Record and Object Sharing | Record ID |
| Object Sharing and Group Maintenance | User ID or group ID |

### What a sharing row contains

Each row in a share object holds:

- The ID of the record it grants access to
- The ID of the user or group it grants access to
- The level of access, such as Read Only or Full Access
- The **row cause**, which says why

Row causes you will see include `Owner`, `Rule` (a sharing rule), `Manual` (a manual share), `Team`, `Territory`, `ImplicitChild`, and any custom Apex sharing reason you defined.

The number of rows matters. The whitepaper's efficiency advice: "If many users have the same record access requirements, it's efficient to place those users in a group and grant access to the group instead of to the individuals. This practice saves time and results in fewer sharing rows, thus reducing your organization's record access data volume."

### System-defined groups

Salesforce creates hidden groups to make hierarchy questions fast. Up to three per role, depending on whether digital experiences is enabled.

| Group | Who is in it | What it is for |
| --- | --- | --- |
| **Role** | Users assigned to a specific role, or to one of its manager roles | Giving managers access to their subordinates' records |
| **RoleAndSubordinates** | Users assigned to a specific role, one of its manager roles, or one of its subordinate roles | Rules that share records with a role and its subordinates |
| **RoleAndSubordinatesInternal** | The same, but excluding portal roles. Only exists when digital experiences is enabled and Experience Cloud users have external account roles other than a shared person account role | Rules that share with a role and its non-portal subordinates |

Each has **direct members**, defined by the group type, and **indirect members**, who inherit access from the direct members and sit in manager roles above them.

Territories work the same way: each territory gets a **Territory** group and a **TerritoryAndSubordinates** group.

Users cannot modify system-defined groups. But "modifying a queue or hierarchy causes Salesforce to recalculate its associated system-defined groups accordingly. Thus, the size and complexity of an organization's queues and hierarchies directly affect the duration of record access calculations."

### Scale, for perspective

The whitepaper's own closing note on what "large" means: many large organizations "have more than 10,000,000 account records, 7,000 users, 2,000 roles, and 1,000 territories."

---

## 19. Things I could not confirm

Stated plainly rather than guessed at.

1. **The official one-sentence definitions of Public Read/Write/Transfer and Public Full Access.** I confirmed which objects ship with those defaults, from Salesforce's own default-access table, and I confirmed the Metadata API enum names `ReadWriteTransfer` and `FullAccess`. I did **not** retrieve a Salesforce page giving a formal one-line definition of either level. The plain-English descriptions in section 4 are my reading of the names and the enum, not quoted Salesforce wording.

2. **The full option set for Price Book's org-wide default.** Salesforce's default-access table shows Price Book's default is `Use`, and the org-wide-defaults overview page names `View Only` as an object-specific level. I did not retrieve a page listing the complete Price Book option set, so I cannot confirm whether `No Access` is one of the choices.

3. **Whether the 300 sharing rules per object limit can be raised by a support case.** Third-party sources say it can be raised to 500. I found no Salesforce page saying so, and I am not repeating it as fact.

4. **The claim that Salesforce recommends staying under 100 ownership-based sharing rules per object.** This appears in third-party guides. Salesforce's own pages give 300 total and 50 criteria-based-plus-guest, and no separate ownership-based recommendation. Treat the 100 figure as community advice, not documentation.

5. **Whether restriction rules are available on Quote.** Salesforce's Restriction Rules overview page lists quotes; its Restriction Rule Considerations page does not. Both were live on 2026-08-25. Check in the target org before relying on it.

6. **Scoping rules and Enterprise Edition.** The Salesforce considerations page I retrieved names Developer edition (2 rules per object) and Performance and Unlimited (5 rules per object). It does not mention Enterprise. Search-result summaries also claim scoping rules require a Signature or Premier Priority Support plan, or a Technical Account Manager, Program Architect or Implementation Architect engagement, plus Performance or Unlimited Edition. **I did not see that requirement in the page text I retrieved.** If scoping rules matter to a design, confirm availability with Salesforce before promising them.

7. **A maximum number of manual shares per record or per org.** I found no published figure.

8. **A maximum number of members on an account, opportunity or case team.** I found no published figure.

9. **The exact Salesforce release that renamed Enterprise Territory Management to Sales Territories.** Third-party sources say Summer '24. The Spring '26 implementation guide uses "Sales Territories" throughout, and both names appear in live help URLs, which confirms the rename happened but not when.

10. **The number of territory models allowed per edition.** The implementation guide says "Your Salesforce edition determines the number of territory models you can create in production" but the specific numbers were not in the text I extracted.

11. **How many case team roles an org can define.** Not found.

12. **The Orders and Contracts implicit sharing detail.** The Salesforce Help implicit sharing page mentions that order owners and their managers get implicit read-only access to the parent account, and that Contracts use the same org-wide default setting as accounts. These did not appear in the enterprise scale whitepaper's implicit sharing table, so I have reported them but with less confidence than the five rows in that table.

---

## 20. Sources

All retrieved on **2026-08-25**.

### The two architect whitepapers

| URL | What it covers |
| --- | --- |
| https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/draes.pdf | "Designing Record Access for Enterprise Scale", Spring '26, last updated 2026-03-31. The full whitepaper: group membership operations, ownership data skew, group membership locking with the complete concurrency table, implicit sharing with the full five-row table, parent-child data skew, record-level locking, deferred sharing calculations. The single richest source in this document |
| https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_introduction.htm | The same guide's introduction in HTML, with its chapter list and its stated audience |
| https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_locking.htm | Group membership locking and granular locking, as a standalone page |
| https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_tools_deferred_sharing_maintenance.htm | Deferred sharing calculations, as a standalone page |
| https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_object_relationships_implicit_sharing.htm | The implicit sharing chapter, as a standalone page |
| https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_object_relationships_parent_child_data_skew.htm | Parent-child data skew and the 300,000 contact worked example |
| https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_record_access_under_the_hood.pdf | "Record-Level Access: Under the Hood", Spring '26. The full whitepaper: the four grant types, the three table types, sharing rows and row causes, system-defined groups, the 300 millisecond page benchmark, the worked role-change scenario |
| https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_intro.htm | The same whitepaper's introduction in HTML, and its chapter list |

### Architect guidance

| URL | What it covers |
| --- | --- |
| https://architect.salesforce.com/fundamentals/platform-sharing-architecture | Platform Sharing Architecture. The best single overview: OWD, role limits (5,000 and 500), sharing rule limits (300 and 50), manual sharing removal, Apex managed sharing, teams, territories, the exact "you can neither turn it off, nor turn it on" wording for implicit sharing, the 1:10,000 skew ratio, and the public group limits |

### Org-wide defaults

| URL | What it covers |
| --- | --- |
| https://help.salesforce.com/s/articleView?id=platform.security_sharing_owd_default_settings.htm&language=en_US&type=5 | The full table of shipped org-wide defaults per object, with separate columns for orgs created before and after Spring '20 |
| https://help.salesforce.com/s/articleView?id=platform.security_sharing_owd_about.htm&language=en_US&type=5 | Which access levels are available on most objects and which are object-specific |
| https://help.salesforce.com/s/articleView?id=platform.admin_sharing.htm&language=en_US&type=5 | Setting internal org-wide defaults, the Grant Access Using Hierarchies checkbox and when it can be turned off, and the recalculation warning |
| https://help.salesforce.com/s/articleView?id=platform.security_owd_external_setting.htm&language=en_US&type=5 | External org-wide defaults, the equal-or-more-restrictive rule, guest users being excluded, and the one-way nature of enabling the external model |
| https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_sharingsettings.htm | The SharingSettings metadata type, including `deferGroupMembership` and `deferSharingRules`, and every other org-level sharing switch |

### Sharing rules

| URL | What it covers |
| --- | --- |
| https://help.salesforce.com/s/articleView?id=platform.security_sharing_rule_considerations.htm&language=en_US&type=5 | Which objects support sharing rules per edition, the Product2 exception, the requirement that OWD be Private or Public Read Only, and recalculation behaviour |
| https://help.salesforce.com/s/articleView?id=sf.security_sharing_rule_considerations.htm&language=en_US&type=5 | The exact sentence naming the field types you cannot use in criteria-based sharing rules |
| https://help.salesforce.com/s/articleView?id=platform.security_sharing_rules_criteria.htm&language=en_US&type=5 | How to create a criteria-based sharing rule, the 240 character value limit, and the documented copied-field workaround |
| https://help.salesforce.com/s/articleView?id=platform.security_sharing_rules_guest.htm&language=en_US&type=5 | Guest user sharing rules: read-only only, the only route to unauthenticated access, and the "immediate and unlimited access" warning |
| https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_sharing_rules | Trailhead on defining sharing rules, including the Read-Only or Read/Write access levels and the "predict in advance" guidance |

### Manual, Apex and programmatic sharing

| URL | What it covers |
| --- | --- |
| https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_understanding.htm | The three kinds of sharing (managed, user managed, Apex managed), the access level values, and the sentence that Apex managed sharing survives owner change while user managed sharing does not |
| https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_creating_with_apex.htm | Share object naming for standard and custom objects, and the four required fields including RowCause |
| https://help.salesforce.com/s/articleView?id=platform.security_apex_sharing_reasons.htm&language=en_US&type=5 | Apex sharing reasons: the 10 per custom object limit, custom objects only, the Modify All Data requirement, and that deleting a reason deletes every share using it |

### Implicit sharing

| URL | What it covers |
| --- | --- |
| https://help.salesforce.com/s/articleView?id=sf.sharing_across_objects.htm&language=en_US&type=5 | Salesforce Help on implicit sharing, including the internal and external cases, orders, contracts and portal case access |

### Restriction and scoping rules

| URL | What it covers |
| --- | --- |
| https://help.salesforce.com/s/articleView?id=sf.security_restriction_rule.htm&language=en_US&type=5 | What restriction rules are, that they filter what other mechanisms granted, the supported object list including quotes, and the per-edition limits |
| https://help.salesforce.com/s/articleView?id=sf.security_restriction_rule_considerations.htm&language=en_US&type=5 | Restriction rule considerations: the 2 and 5 per object limits, where rules apply, the View All and Modify All bypass, no cascade to child objects, and the UserRecordAccess gap |
| https://developer.salesforce.com/docs/atlas.en-us.scoping_rules.meta/scoping_rules/scoping_rules_intro.htm | What scoping rules are, the exact sentence that they do not restrict access, and the supported object list |
| https://developer.salesforce.com/docs/atlas.en-us.scoping_rules.meta/scoping_rules/scoping_rules_considerations.htm | Scoping rule considerations: per-edition limits, the EQUALS-only operator restriction, supported data types, the SOQL `USING SCOPE EVERYTHING` requirement, and unsupported objects |

### Recalculation and deferral

| URL | What it covers |
| --- | --- |
| https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_defer_sharing_tipsheet.pdf | "Understanding Defer Sharing Calculations", last updated 2026-03-31. The definitive list of what triggers group membership calculation and what triggers sharing rule calculation, what is and is not deferred, and the Setup Audit Trail 180-day window |
| https://help.salesforce.com/s/articleView?id=platform.security_sharing_recalculating_parallel.htm&language=en_US&type=5 | Automatic recalculation: asynchronous and parallel, the account-case-contact-opportunity grouping, the lock-out while running, the Background Jobs subtypes, and that Apex sharing recalculations run too |
| https://help.salesforce.com/s/articleView?id=sf.security_sharing_recalculating.htm&language=en_US&type=5 | Manual recalculation: when to use it, the four automatic triggers, and that the Recalculate button is disabled while calculations are deferred |

### Teams

| URL | What it covers |
| --- | --- |
| https://help.salesforce.com/s/articleView?id=sales.accountteam_add.htm&language=en_US&type=5 | Account team member access levels, the "at least equal to the default account sharing access" rule, and default account team behaviour |
| https://help.salesforce.com/s/articleView?id=sales.accountteam_admin.htm&language=en_US&type=5 | Administering account teams, and the warning that a team member record shows only directly granted access rather than total access |
| https://help.salesforce.com/s/articleView?id=service.caseteam_def.htm&language=en_US&type=5 | What a case team is, the Read Only / Read/Write / Private role access levels, and predefined case teams |

### Territories

| URL | What it covers |
| --- | --- |
| https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_implementing_territory_mgmt2_guide.pdf | Sales Territories Implementation Guide, Spring '26. Territory models and states, the hierarchy, the exact child-to-parent access inheritance rule, the permissions table, filter-based opportunity territory assignment, and editions |
| https://help.salesforce.com/s/articleView?id=sf.tm2_define_default_record_access.htm&language=en_US&type=5 | Defining default user access for territory records: which objects, and the child-territory opportunity access setting |

### Data skew and general record access

| URL | What it covers |
| --- | --- |
| https://trailhead.salesforce.com/content/learn/modules/large-data-volumes/design-your-data-model | Trailhead on account data skew, ownership skew and lookup skew, with the 10,000 child record threshold and the mitigations |
| https://developer.salesforce.com/blogs/engineering/2013/04/managing-lookup-skew-to-avoid-record-lock-exceptions | Salesforce engineering blog, published April 2013, on lookup skew: the definition, why it causes record lock exceptions, and the four mitigations |
| https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records | Trailhead on record-level security: the four-layer model and the plain-English definitions of Private, Public Read Only, Public Read/Write and Controlled by Parent |
