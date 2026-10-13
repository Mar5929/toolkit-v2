# Designing a Salesforce role hierarchy

This document explains what a Salesforce role hierarchy actually does, what it cannot do, the limits Salesforce publishes for it, and how to decide its shape. It is written for someone who has to design or review a role hierarchy and has no prior background in Salesforce sharing. Read it before drawing any role structure, and before assuming a role hierarchy is the right tool for a given access problem. Every claim below carries a link to the Salesforce page it came from.

**Basis:** built from 26 official Salesforce pages across help.salesforce.com, developer.salesforce.com, architect.salesforce.com and trailhead.salesforce.com, including the two architect whitepapers "Record-Level Access: Under the Hood" and "Designing Record Access for Enterprise Scale". All pages retrieved 2026-08-25. Full list in the Sources section at the end.

---

## 1. The short version

If you read nothing else, read this.

- A role hierarchy grants record access **upward only**. A manager sees what the people under them own. Nobody sees sideways, and nobody sees downward.
- A role hierarchy does **nothing at all** if the organization-wide default for that object is Public Read/Write. Everyone already has full access, so there is nothing left for the hierarchy to add.
- The hierarchy is a **data access tool**, not a picture of the company. Salesforce says so in its own words. Copying the human resources organization chart is the most common design mistake.
- **Fewer levels is better.** Salesforce says to minimise levels for performance, and recommends no more than 10 levels of branches.
- **Changing the hierarchy is expensive.** Moving a role or a user triggers a recalculation of record access that can run for a long time in a large org.

---

## 2. Words you need first

Every term below is used throughout this document. Spelled out here once.

| Term | Plain meaning |
| --- | --- |
| **Record** | One row of data. One account, one contact, one case. |
| **Object** | One type of record. Account is an object. Case is an object. |
| **Standard object** | An object Salesforce ships with the product, such as Account, Contact, Opportunity, Case, Lead. |
| **Custom object** | An object your own project builds. Its API name normally ends in `__c`. |
| **Owner** | The single user (or queue) recorded on a record as owning it. Every record has exactly one owner. |
| **Organization-wide default**, often written **OWD** | The baseline rule saying what a user can do to a record they do **not** own. Set per object. This is the floor that everything else builds on top of. |
| **Role** | A label attached to a user that places them at a point in the role hierarchy. It is not a permission. It grants no field access and no ability to do anything. It only affects which records the user can see. |
| **Role hierarchy** | The tree of roles. Each role names one parent role it reports to. |
| **Sharing rule** | An automatic rule that grants extra access to a group of users. Always additive, never restrictive. |
| **Public group** | An administrator-defined bag of users, roles, territories and other public groups, used to make sharing rules simpler to write. |
| **Manual share** | One record shared by hand with one user or group. |
| **Sharing recalculation** | The background work Salesforce does to rebuild who can see what after something changes. |
| **Sharing row** | A database row recording that one user or group has access to one record. Sometimes called a share record. |
| **Experience Cloud site user**, older name **portal user** | An external person, such as a customer or a partner, logging in to a Salesforce-built site rather than to Salesforce itself. |

---

## 3. What the role hierarchy actually does

### 3.1 It grants access upward

Salesforce Help states it plainly:

> "The role hierarchy opens up access vertically so that users assigned to roles higher in the hierarchy have access to records owned by or shared with their subordinates."

Source: [Controlling Access Using the Role Hierarchy](https://help.salesforce.com/s/articleView?id=platform.security_controlling_access_using_hierarchies.htm&language=en_US&type=5)

Trailhead says the same thing from the other direction:

> "Users at any given role level can view, edit, and report on all data owned by or shared with users below them in the role hierarchy."

Source: [Create a Role Hierarchy, Data Security module](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_roles)

Note the phrase **"owned by or shared with"**. It matters. The hierarchy does not only roll up records a subordinate owns. It also rolls up records a subordinate was given by some other route. Salesforce confirms this for sharing rules specifically: users higher in the role hierarchy automatically receive the same access level that their subordinates gained from a sharing rule. See [Sharing Rule Considerations](https://help.salesforce.com/s/articleView?id=platform.security_sharing_rule_considerations.htm&language=en_US&type=5).

So if you grant a junior user access to something through a sharing rule, you have also granted it to every manager above them, whether you meant to or not.

### 3.2 It does not grant access sideways or downward

This is the point most often misunderstood, so state it precisely.

| Direction | Does the role hierarchy grant access? |
| --- | --- |
| **Upward**, from a subordinate's records to their managers | Yes. This is its entire job. |
| **Sideways**, between two roles at the same level in different branches | No. Never. A peer in another branch gets nothing. |
| **Sideways**, between two users assigned to the same role | No. Two users in the same role do **not** see each other's records because of the role. |
| **Downward**, from a manager's records to their subordinates | No. A subordinate does not see their manager's records. |

The same-role case in row three catches people out. If a team of five sales representatives all sit in a role called "Sales Rep", the role does not let them see each other's opportunities. If they need to, that is a sharing rule sharing the "Sales Rep" role with itself, or a public group, or a team. It is not something the hierarchy does for you.

Peers in different branches are the classic "overlay" problem. Salesforce's architect guidance names it:

> "Overlays are always the tricky part of the hierarchy. If they're in their own branch, they'll require either sharing rules, teams, or territory management to gain needed access."

Source: [Platform Sharing Architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)

### 3.3 One documented exception: sharing sets

Access granted through a **sharing set**, which is a mechanism used for Experience Cloud site users, does not roll up.

> "Record access granted to users via sharing sets isn't extended to their superiors in the role hierarchy."

Source: [Controlling Access Using the Role Hierarchy](https://help.salesforce.com/s/articleView?id=platform.security_controlling_access_using_hierarchies.htm&language=en_US&type=5)

### 3.4 How Salesforce stores this internally

Worth knowing because it explains why hierarchy changes are slow.

Salesforce does not walk the tree every time someone opens a record. It pre-computes group membership and stores it. The "Record-Level Access: Under the Hood" whitepaper describes four kinds of access grant:

| Grant type | What it means | Where Salesforce stores it |
| --- | --- | --- |
| **Explicit** | A record was shared directly to a user or group, including by ownership, a sharing rule, a manual share, a team, or code. | Object Sharing tables |
| **Implicit** | Built-in, non-configurable behaviour in the Sales, Service and portal applications. For example, seeing a parent account because you can see a child case. | Object Sharing tables |
| **Group membership** | A user is in a group that has explicit access. | Group Maintenance tables |
| **Inherited** | A user inherits access "through a role or territory hierarchy, or is a member of a group that inherits access through a group hierarchy". | Group Maintenance tables |

Sources: [Access Grants](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_grants.htm) and [Database Architecture](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_arch.htm)

The role hierarchy lives in that fourth row. The whitepaper explains the payoff:

> "by scanning the Role groups, Salesforce can quickly identify the indirect members who inherit record access from users at that role."

Source: [Group Maintenance Tables](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_groups.htm)

Reads are fast because the answer is precomputed. The cost was paid at write time. That is exactly why moving a role is expensive: the precomputed answer has to be rebuilt. See section 8.

---

## 4. The role hierarchy and the organization-wide default

### 4.1 The org-wide default is the floor

Trailhead states the design order:

> "Use org-wide defaults to lock down your data, and then use the other record-level security and sharing tools ... to open up the data to users who need it."

Source: [Improve Record Access Control in Your Org](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records)

And the hard constraint, from the same unit:

> "Sharing rules can only be used to grant additional access. They can't be used to restrict access to records beyond what was originally specified with the org-wide sharing defaults."

The Sharing Rules help page applies the same rule to the hierarchy itself:

> "Like role hierarchies, a sharing rule can never be stricter than your org-wide default settings. It simply allows greater access for particular users."

Source: [Sharing Rules](https://help.salesforce.com/s/articleView?id=platform.security_about_sharing_rules.htm&language=en_US&type=5)

Read that quote carefully. It says the **role hierarchy** can never be stricter than the org-wide default either. The hierarchy is an opening mechanism only. There is no way to use it to take access away.

### 4.2 The access levels

| Org-wide default | What a non-owner can do | Is the role hierarchy meaningful? |
| --- | --- | --- |
| **Private** | Nothing. "Only users who are granted access by ownership, permissions, role hierarchy, manual sharing, or sharing rules can access the records." | **Yes.** This is where the hierarchy does the most work. |
| **Public Read Only** | View and report on every record, but only the owner and users above them in the hierarchy can edit. | **Yes.** The hierarchy is what grants edit rights upward. |
| **Public Read/Write** | "All users can view and edit all records for the object." | **No.** See below. |
| **Controlled by Parent** | A user can act on the detail record if they can perform the same action on every associated master record. | Indirectly. Access follows the master object, so the hierarchy matters on the master, not here. |

Sources: [Set Your Internal Organization-Wide Sharing Defaults](https://help.salesforce.com/s/articleView?id=platform.admin_sharing.htm&language=en_US&type=5) and [Improve Record Access Control in Your Org](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records)

Salesforce documents additional levels such as Public Full Access and View Only, available only on specific objects. They are not covered here.

### 4.3 Why the hierarchy does nothing under Public Read/Write

Under Public Read/Write, Trailhead's definition is "All users can view, edit, and report on all records." Every user already has read and write on every record of that object.

The role hierarchy's only power is to grant read or edit access to a manager. If every user already has read and edit on everything, there is nothing the hierarchy can add. It is not that the hierarchy is switched off. It is that its output is already covered by the baseline.

Salesforce's own reasoning matches this. Manual shares are removed automatically when the access granted does not exceed the object's org-wide default, because the share row is pointless. The same logic applies to hierarchy-based access.

**Practical consequence for a design review:** if someone shows you a deep, carefully designed role hierarchy and the org-wide default on the objects that matter is Public Read/Write, the hierarchy is doing nothing for record access on those objects. It may still be doing other jobs. See section 4.4.

### 4.4 The role still does other things under Public Read/Write

Do not conclude that roles are useless when the default is Public Read/Write. A role still drives:

- **Forecasting and opportunity reporting.** Salesforce states: "Every user must be assigned to a role, or their data won't display in opportunity reports, forecast roll-ups, and other displays based on roles."
- **Report filters** such as the "My team's..." option in a report's View dropdown, which is defined by the role hierarchy.
- **Delegated administration**, where a delegated administrator is scoped to specified roles and all their subordinate roles.
- **Being a target for sharing rules**, because a role or a role-and-subordinates group is a valid sharing rule target on any object.

Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

---

## 5. The "Grant Access Using Hierarchies" setting

### 5.1 What it is and where it lives

On the Sharing Settings page in Setup, each object's row in the Organization-Wide Defaults list carries a checkbox called **Grant Access Using Hierarchies**. When it is ticked, the role hierarchy rolls access upward for that object. When it is unticked, it does not.

### 5.2 Custom objects only

This is the key restriction:

> "The only exception is for custom objects, for which you can disable access using hierarchies."

And:

> "This setting can't be modified for standard objects and is enabled for most standard objects, but not all of them."

Source: [Controlling Access Using the Role Hierarchy](https://help.salesforce.com/s/articleView?id=platform.security_controlling_access_using_hierarchies.htm&language=en_US&type=5)

| Object type | Can Grant Access Using Hierarchies be turned off? |
| --- | --- |
| **Custom object** (`__c`) | Yes. |
| **Standard object** (Account, Contact, Opportunity, Case, Lead, and so on) | No. The checkbox cannot be changed. It is on for most standard objects. |

Salesforce says "most standard objects, but not all of them" and does not publish the exceptions list on that page. I could not find an official page listing which standard objects have it off. Check the Sharing Settings page in the actual org rather than assuming.

One further restriction: the option is not available when an object's default access is **Controlled by Parent**. Source: [Set Your Internal Organization-Wide Sharing Defaults](https://help.salesforce.com/s/articleView?id=platform.admin_sharing.htm&language=en_US&type=5)

**Design consequence.** If a custom object holds data that must never roll up to senior management (salary data, human resources case notes, whistleblowing records, competitive deal reviews), a custom object with the hierarchy switched off is the only way to stop the roll-up. There is no equivalent move on a standard object. If the data has to live on a standard object and must not roll up, you need a different design.

### 5.3 What exactly changes when it is off

Salesforce publishes a precise list of "access reasons" and splits them into two sets.

**These always grant access, whether or not hierarchies are on:**

- Group Member
- Queue Member
- Role Member
- Member of Subordinate Role
- Territory Member
- Member of Subordinate Territory

**These grant access only when hierarchies are on:**

- Manager of Group Member
- Manager of Queue Member
- Manager of Role
- Manager of Territory
- User Role Manager of Territory

Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

The pattern is simple. Direct membership always works. Being somebody's manager is what stops working.

There is a matching statement about sharing rules:

> "If you disable the Grant Access Using Hierarchies option, sharing with a role or territory and subordinates only shares with the users directly associated with the role or territory selected. Users in roles or territories above them in the hierarchies don't gain access."

### 5.4 Four gotchas Salesforce documents

1. **Powerful permissions still win.** "If the Grant Access Using Hierarchies option is deselected, users that are higher in the role or territory hierarchy don't receive automatic access. But some, such as those users with the View All Records and Modify All Records object permissions and the View All Data and Modify All Data system permissions can still access records that they don't own." Turning the setting off is not a security control against an administrator.

2. **Activities leak anyway.** "If your organization disables the Grant Access Using Hierarchies option, activities that are associated with a custom object are still visible to users above the activity's assignee in the role hierarchy." So the record is hidden but a task or event logged against it is not.

3. **Breaking a master-detail relationship silently re-enables it.** "If a master-detail relationship is broken by deleting the relationship, the former detail custom object's default setting is automatically reverted to Public Read/Write and Grant Access Using Hierarchies is selected by default." A schema change can therefore quietly open up a locked-down object. Re-check the setting after any master-detail change.

4. **Tell users their reports will change.** "When you deselect Grant Access Using Hierarchies, always notify users of the changes in report results that they can expect due to losing visibility of their subordinates' data." The "My team's..." report view stops returning subordinates' records.

All four: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

---

## 6. The documented limits

Every number in this table is quoted from an official Salesforce page. The source for each is given in the last column.

| Limit | Number | Notes | Source |
| --- | --- | --- | --- |
| Maximum roles, org created **Spring '21 or later** | **5,000** | Hard limit as published. | Guidelines for Success with Roles |
| Maximum roles, org created **before Spring '21** | **500** | "you can create up to 500 roles and can contact Salesforce Customer Support to increase this limit." | Guidelines for Success with Roles |
| Recommended maximum hierarchy depth | **10 levels of branches** | "As a best practice, keep the role hierarchy to no more than 10 levels of branches in the hierarchy." This is a recommendation, not an enforced ceiling. | Platform Sharing Architecture |
| Best-practice cap, internal roles | **25,000** | Stated as a best practice for large orgs, not a default limit. | Platform Sharing Architecture |
| Best-practice cap, external (portal or site) roles | **100,000** | Same. | Platform Sharing Architecture |
| Best-practice cap, public groups per org | **100,000** | | Platform Sharing Architecture |
| Public group nesting depth | **do not nest more than five levels** | | Platform Sharing Architecture |
| Sharing rules per object | **300 total**, of which up to **50** may be criteria-based or guest user rules | Support can raise it. | Sharing Rules |
| Records owned by one user before ownership skew | **more than 10,000** of one object | The threshold at which Salesforce says performance suffers. | Ownership Data Skew; Guidelines for Success with Roles |
| Child records under one account before parent-child skew | **more than 10,000** | Same shape of problem on the parent-child axis. | Considerations for Making Sharing Updates |
| Recommended frequency of structural hierarchy changes | **no more than quarterly** | "have structural changes occur no more than quarterly." | Platform Sharing Architecture |

Sources for the table: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5), [Platform Sharing Architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture), [Sharing Rules](https://help.salesforce.com/s/articleView?id=platform.security_about_sharing_rules.htm&language=en_US&type=5), [Ownership Data Skew](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_data_skew.htm), [Considerations for Making Sharing Updates](https://help.salesforce.com/s/articleView?id=platform.security_sharing_update_considerations.htm&language=en_US&type=5)

### 6.1 What happens as the hierarchy grows

Salesforce is direct about the cost of depth:

> "To improve performance, minimize the number of levels in your role hierarchy. Eliminate roles that aren't needed, and delete sharing rules that grant access to records already shared via the role hierarchy."

Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

The mechanism behind that advice is in the whitepapers. Each role has system-defined groups, and each group carries both direct members and indirect members who inherit access. The deeper the tree, the more indirect membership rows exist. The "Under the Hood" summary notes that this complexity scales sharply in large organizations with millions of records and thousands of users, roles and territories. See [Summary](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_summary.htm).

Practically, a deep hierarchy costs you in three places:

1. **Recalculation time** whenever any role or user moves, because more inherited grants have to be rebuilt.
2. **Storage** in the group maintenance tables.
3. **Human error**, because nobody can hold a 12-level tree in their head, so people stop reasoning about it and start adding sharing rules to patch it.

---

## 7. Design guidance

### 7.1 Salesforce's own wording

This is the guidance to quote in a design review. All from [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5) unless marked.

> "Don't create individual roles for each title at your company. Instead, define a hierarchy of roles to control access of information entered by users in lower-level roles."

> "Create roles only for your current requirements. Don't create temporary placeholder roles in anticipation of future needs."

> "Don't use reporting requirements to determine what hierarchy levels you need."

> "Put all users that require visibility to the entire org at the highest level in the hierarchy."

> "To prevent disruptions, avoid changing the role hierarchy during business hours."

From Trailhead, the clearest single statement of the principle:

> "Role hierarchies don't have to match your org chart. Each role in the hierarchy just represents a level of data access that a user or group of users needs."

And its worked example:

> "if a software development group has a staff software engineer and a junior software engineer, these positions can be consolidated into a single Software Engineer role in the hierarchy."

Source: [Create a Role Hierarchy](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_roles)

From the architect guidance, the balanced version:

> "Although this sounds very much like an HR organizational chart, when modeling data access, focus on data accessibility with a consideration to HR reporting."

And a warning worth taking seriously:

> "It's important to spend the time setting up the role hierarchy because it's one of the foundational aspects of the sharing model."

Source: [Platform Sharing Architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)

### 7.2 Why the org chart and the data-access tree differ

The human resources organization chart answers "who does this person report to?". The role hierarchy answers "whose records does this person need to see?". Those two questions have different answers more often than people expect.

| Situation | Org chart says | Data access needs say |
| --- | --- | --- |
| A staff engineer and a junior engineer, different pay grades, same manager | Two distinct levels | One role. Neither needs to see the other's records differently. |
| An executive assistant reporting to the Chief Executive Officer | Bottom of the tree, under the CEO | They may need to see everything the CEO sees, which the hierarchy will not give them, because access flows up, not down. Solve with a sharing rule, a public group, or a permission. |
| A regional sales director and a regional support director, peers | Two peer boxes under a Vice President | If support must see sales records, the hierarchy gives them nothing. That is a sharing rule. |
| A compliance officer who must see every deal | Somewhere in a legal branch | Needs org-wide visibility. Salesforce's answer is to put them at the top of the hierarchy, or use a permission such as View All Data, or a sharing rule. |
| A team of ten sales representatives who share leads with each other | Ten boxes under one manager | One role. The hierarchy will not let them see each other, so peer access is a separate sharing rule sharing the role with itself. |
| A contractor who owns 200,000 migrated records | An employee-shaped box | Should probably have **no role at all**, or a dedicated top-level role. See section 10. |

The consequence is that a role hierarchy built by copying the org chart is usually **too deep** and has **too many roles**, most of which grant nothing that a shallower design would not, while every one of them adds recalculation cost.

### 7.3 A practical way to design one

1. **Start from the org-wide defaults.** Decide, per object, whether the default is Private, Public Read Only or Public Read/Write. If everything ends up Public Read/Write, you may not need much of a hierarchy at all.
2. **Write down who must see whose records, and why.** In plain sentences. "The EMEA sales director must see every EMEA opportunity." Not job titles.
3. **Collapse.** Wherever two adjacent levels have identical data access needs, they are one role.
4. **Draw the tree from the top down.** Salesforce's guidance describes starting from the Chief Executive Officer, then segmenting direct reports by business unit or geographic region.
5. **Count your levels.** If you are past 10, go back to step 3.
6. **Park the exceptions.** Everything that is not a clean upward roll-up (peers, overlays, matrix teams, one-off access) is deliberately **not** solved by the hierarchy. Write those down as a separate list and solve them in section 8's table.
7. **Handle the high-volume owners separately.** See section 10.
8. **Do not create roles you do not need yet.** Salesforce says so explicitly.

---

## 8. Role hierarchy versus the other mechanisms

The role hierarchy is one of several tools. Picking the wrong one produces a hierarchy that is deep, brittle and still does not do the job.

### 8.1 Decision table

| You need... | Use | Why |
| --- | --- | --- |
| A manager to see everything their team owns | **Role hierarchy** | This is exactly and only what it does. |
| Peers in the same role to see each other's records | **Sharing rule** sharing the role to itself, or a public group | The hierarchy never grants sideways. |
| One branch of the tree to see another branch | **Sharing rule** | The hierarchy never crosses branches. |
| Access for a group that is stable and predictable | **Sharing rule**, possibly targeting a public group | "Sharing rules work best when they're defined for a particular group of users that you can determine or predict in advance, rather than a set of users that frequently changes." (Trailhead, Define Sharing Rules) |
| Access for a group that changes constantly, or is different per record | **Not a sharing rule.** Use a team, a manual share, or code. | Trailhead recommends other solutions where membership cannot be predicted in advance. |
| A sharing rule that would otherwise need several roles and several individuals named in it | **Public group**, then one sharing rule to that group | "you want to define a sharing rule that encompasses more than one or two groups or roles, or any individual." (Trailhead, Define Sharing Rules) |
| Per-record collaborators on an account, opportunity or case | **Account team, opportunity team or case team** | Teams work record by record. The record owner picks the members and the access level per member. On an account team, members also get access to that account's related contacts, opportunities and cases. |
| Account and opportunity access driven by geography, industry or segment | **Enterprise Territory Management** | Built for exactly this, and it rolls up the role hierarchy for you. |
| To take access away from someone | **None of these.** | Sharing rules, the role hierarchy and teams are all additive. Look at org-wide defaults, restriction rules, or a muting permission set inside a permission set group. |

Sources: [Define Sharing Rules](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_sharing_rules), [Platform Sharing Architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture), [Territory Management Best Practices](https://help.salesforce.com/s/articleView?id=000386766&language=en_US&type=1)

### 8.2 On territory management specifically

Salesforce's territory management best practice article is unusually direct, and the advice applies to anyone tempted to encode sales geography into roles:

> "Use your role hierarchy to configure management relationships, reporting rollups, approvals and other hierarchically structured workflows. Simplify the Sales branch of your role hierarchy to only contain roles for these purposes. Then use Territory Management to extend access to Accounts and Opportunities based on the users' territory assignments."

> "Access provided by territory management automatically rolls up to your role hierarchy. Trying to duplicate your territory structure in the sales branch of your role hierarchy is unnecessary and redundant."

Source: [Territory Management Best Practices](https://help.salesforce.com/s/articleView?id=000386766&language=en_US&type=1)

Two warnings that go with it:

- If you enable Enterprise Territory Management you now maintain **two** hierarchies, the role hierarchy and the territory hierarchy, and both affect access.
- "If your organization uses Territory Management, forecasts are based on the territory hierarchy rather than the role hierarchy." Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

### 8.3 A cleanup rule worth applying

From Salesforce's performance guidance:

> "delete sharing rules that grant access to records already shared via the role hierarchy."

Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

Redundant sharing rules are common in old orgs. Somebody could not work out why access was missing, added a sharing rule, and the real cause turned out to be something else. The rule stayed. Every redundant rule costs recalculation time and adds nothing.

---

## 9. What happens when a role changes

### 9.1 What triggers a recalculation

Salesforce lists the triggers for sharing rule recalculation:

- "Changing an organization's default sharing model"
- "Creating, editing, or deleting sharing rules"
- "Creating or transferring any records"
- "Updating public group members"
- "Creating or activating a user"
- "Changing users' roles or updating the role hierarchy"
- "Adding or removing users from territories"

Source: [Considerations for Making Sharing Updates](https://help.salesforce.com/s/articleView?id=platform.security_sharing_update_considerations.htm&language=en_US&type=5)

The sixth item is the one this document is about. Both halves count: moving a **user** between roles, and moving a **role** within the tree.

### 9.2 What actually happens when a user changes role

From the "Designing Record Access for Enterprise Scale" whitepaper, the work Salesforce performs is:

1. If the user is the first owner of data in the new role, Salesforce adjusts access for users **above** them in the hierarchy.
2. Managers in the branch above the user's **old** role "lose access to all the data that the user owns".
3. Managers above the **new** role gain that access.
4. Any child customer or partner account roles are removed from the original role and added under the new parent role.
5. Implicit shares that provide hierarchy access to records owned by or shared to customer or partner users are adjusted.
6. "Salesforce also recalculates all sharing rules that include the user's old or new role in the source group."

Source: [Group Membership Operations and Sharing Recalculation](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership.htm)

Step six is the one people forget. Changing one user's role can set off recalculation of every sharing rule that names either the old role or the new role as its source.

### 9.3 Moving a whole role versus moving users one at a time

The whitepaper notes that moving an entire role is more efficient than relocating its users individually, because "any customer or partner accounts simply move along with their parent role, and Salesforce doesn't have to change the related sharing". But Salesforce still performs the per-user migration work for every member of that role, so a role move is not free.

### 9.4 The cost, and how to keep it down

Salesforce says plainly that "sharing calculations can take a while to complete", and names the factors that make it worse:

- Users owning more than 10,000 records of a single object.
- Accounts with more than 10,000 child records.
- Large data loads into objects that already have sharing rules.

Its operational advice:

| Advice | Exact wording |
| --- | --- |
| Change leaves first | "process changes to the bottom (leaf) nodes first, then move upward to avoid duplicate processing" |
| Plan a window | "plan for a maintenance window that's sufficiently long to complete your changes" |
| Pick a quiet time | "schedule the maintenance window for a period of low activity" |
| Avoid business hours | "To prevent disruptions, avoid changing the role hierarchy during business hours." |
| Test first | Test in a full copy sandbox refreshed within 30 days of production. |
| Batch structural change | "have structural changes occur no more than quarterly." |

Sources: [Considerations for Making Sharing Updates](https://help.salesforce.com/s/articleView?id=platform.security_sharing_update_considerations.htm&language=en_US&type=5), [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5), [Platform Sharing Architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture)

The "leaf nodes first" instruction is the most actionable and the most often missed. If you restructure top-down, the same subtree gets recalculated repeatedly as each ancestor changes.

### 9.5 Deferred sharing calculation

For genuinely large realignments there is a feature, enabled by Salesforce Customer Support, that suspends sharing calculations while you make changes and then runs them all at once.

What it does:

> "Suspend sharing calculations, specifically for sharing rules and group membership, then resume calculations during an organization's maintenance period."

Who it is for:

> "If you're able to negotiate downtime with your business customers and have been struggling to complete updates in a timely fashion, deferred sharing can be a good solution."

Three warnings Salesforce attaches:

- "Test the whole process in a full copy sandbox"
- "Deferring sharing calculations doesn't defer the recalculation of some sharing changes in order to preserve data integrity"
- "Group membership locking can also still occur while sharing calculations are deferred"

Source: [Deferred Sharing Calculations](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_tools_deferred_sharing_maintenance.htm)

Note also that resuming can itself run for a long time. Salesforce warns that when calculations resume after many changes in an org with large data volumes, they "might take a long time to complete".

I did not find an official page giving a record-count threshold at which deferred sharing becomes necessary. Some Salesforce material references orgs with more than two million accounts as an example scale, but I could not confirm that figure as a documented rule, so treat it as illustrative rather than a threshold.

---

## 10. Group membership: "Roles" versus "Roles and Subordinates"

When you write a sharing rule, you choose what to share **from** and what to share **to**. Roles appear in both lists in more than one form, and they are not the same thing. Choosing wrongly is a quiet way to hand data to external users.

### 10.1 The choices, defined

| Choice | Salesforce's definition | Includes users in roles **below**? | Includes **external** site or portal users? |
| --- | --- | --- | --- |
| **Roles** | "All roles defined for your organization, excluding site and portal roles. This includes all of the users in the specified role." | No | No |
| **Roles and Subordinates** | Deprecated. Previously "all of the users in the specified role plus all of the users in roles below that role." | Yes | Historically yes, which is why it was replaced |
| **Roles and Internal Subordinates** | "All roles defined for your organization. This includes all of the users in the specified role plus all of the users in roles below that role, excluding site and portal roles." | Yes | **No** |
| **Roles, Internal and Portal Subordinates** | "All roles defined for your organization. This includes all of the users in the specified role plus all of the users in roles below that role, including site and portal roles." | Yes | **Yes** |
| **Portal Roles** | "All roles defined for your organization's site or portal. This includes all users in the specified role, except high-volume users." | No | Yes, external only |

Source: [Sharing Rule Categories](https://help.salesforce.com/s/articleView?id=platform.security_sharing_data_set_categories.htm&language=en_US&type=5)

### 10.2 Why "Roles and Subordinates" is deprecated

Salesforce marks **Roles and Subordinates** as deprecated and says to use **Roles and Internal Subordinates** instead. Source: [Role and Territory Sharing Groups](https://help.salesforce.com/s/articleView?id=platform.users_role_terr_sharing_groups.htm&language=en_US&type=5)

The reason is safety. "Roles and Internal Subordinates" is now the default group shown before digital experiences are enabled, where the old label used to appear. The split exists so that turning on an external site later cannot silently widen the reach of a sharing rule that was written when the org had no external users at all. If you enable Experience Cloud in an org whose sharing rules use the old group, you may hand records to external users nobody intended.

**Action for any org enabling external users:** audit every sharing rule for the deprecated group before you turn digital experiences on.

### 10.3 The subtlety in how these groups are stored

There is a wording difference between two Salesforce pages that is worth understanding rather than tripping over.

The **Sharing Rule Categories** page describes "Roles" as "all of the users in the specified role". That is describing what you are picking in the user interface.

The **Role and Territory Sharing Groups** page describes the underlying system group differently. For each role, Salesforce automatically creates:

| System group | Membership, in Salesforce's words |
| --- | --- |
| **Role** | "users in the role plus users in roles above it in the hierarchy" |
| **Role and Internal Subordinates** | "users in the role, plus users in roles above and below it in the hierarchy, excluding portal or site users" |
| **Roles, Internal and Portal Subordinates** | "users in the role, plus users in roles above and below it in the hierarchy, including portal or site users." Only available when digital experiences is enabled and site users are created with external account roles other than a shared person account role. |
| **Role and Subordinates** | Users in the role plus those above and below. "Deprecated. Use Roles and Internal Subordinates instead." |

Source: [Role and Territory Sharing Groups](https://help.salesforce.com/s/articleView?id=platform.users_role_terr_sharing_groups.htm&language=en_US&type=5)

Both descriptions are true. Notice that **every one of them includes users in roles above**. That is not a bug in the documentation. It is the role hierarchy doing its job: anything shared to a role must also reach that role's managers, so the managers are baked into the group as indirect members. This is the same "inherited grant" mechanism from section 3.4.

**The practical takeaway:** when you share something to a role, you are also sharing it to every role above that role, all the way to the top. There is no way to share to a role without also sharing to its management chain, short of turning off Grant Access Using Hierarchies on a custom object.

The whitepaper confirms the storage model: system-defined groups hold **direct members** (users assigned per the group's definition) and **indirect members** (those inheriting access from direct members), and "modifying a queue or hierarchy causes Salesforce to recalculate its associated system-defined groups accordingly". Source: [Group Maintenance Tables](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_groups.htm)

---

## 11. Two specific problems: parked users and leavers

### 11.1 Users parked in a role with no parent

A common pattern is a top-level role, or a stray role hanging off the root, used as a parking space for people who did not fit anywhere else: integration users, data migration users, contractors, an unclear new hire.

**What Salesforce documents about this:**

A role with no parent is a **top-level** role. Every user in it has their records rolled up to nobody, and they see nothing from anyone else through the hierarchy. That is often exactly right for an integration user, and exactly wrong for a person.

Salesforce actively recommends a top-level parking role in one specific case, high-volume record owners:

> "For users who must own more than that number of objects, don't assign them a role or place them in a separate role at the top of the hierarchy. It's also important to keep that user out of public groups potentially used as the source for sharing rules."

Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

And it recommends the top for users needing full visibility:

> "Put all users that require visibility to the entire org at the highest level in the hierarchy."

**The risks when a real person is parked there:**

1. **They are invisible to management.** Nobody above them sees their records, because there is nobody above them. Their pipeline does not roll up. Their opportunities do not appear in a manager's forecast.
2. **The related-record behaviour changes if they have no role at all.** Salesforce documents this precisely: "When an account owner isn't assigned a role, the sharing access for related contacts is Read/Write, provided the organization-wide default for contacts isn't Controlled by Parent. Sharing access on related opportunities and cases is No Access." So a roleless account owner produces contacts that are more open than expected and opportunities and cases that are more closed than expected. Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)
3. **Reporting breaks.** "Every user must be assigned to a role, or their data won't display in opportunity reports, forecast roll-ups, and other displays based on roles."
4. **They may see too much.** If the parking role happens to sit above other roles, everyone in it inherits everything beneath it.

**Rule of thumb:** a top-level or parentless role is correct for a machine account or a deliberate high-volume owner, and is a design smell for a human who has a manager.

### 11.2 Leavers left in the hierarchy

When someone leaves, three things are separate and are often confused:

| Thing | What happens when a user is deactivated |
| --- | --- |
| Their **user record** | Deactivated. They cannot log in. The record still exists. |
| Their **role assignment** | Still on the deactivated user record. |
| The **records they own** | Still owned by them. Ownership does not transfer automatically. |

The consequence: **a manager above a leaver keeps seeing the leaver's records, and only because the leaver is still sitting in that role.** Move that dead user out of the role, or delete the role, and the manager loses access to records that are still live business data.

I want to be honest about verification here. I could not retrieve the official "Considerations for Deactivating Users" page (`platform.users_deactivate_considerations.htm`) on 2026-08-25. Both the help.salesforce.com and developer.salesforce.com versions returned a loading error rather than content. So the table above is inference from the surrounding documented behaviour, not a direct quote. **Verify it in a sandbox before relying on it.**

What I can source:

- Salesforce documents **freezing** a user as a separate step from deactivating, used to block login while you work through deactivation, and notes "In some cases, you can't immediately deactivate an account, such as when a user is selected in a custom hierarchy field." Source: [Freeze or Unfreeze User Accounts](https://help.salesforce.com/s/articleView?id=sf.users_freeze.htm&language=en_US&type=5)
- Salesforce documents changing the default owner of records under a user's Preferences as part of resolving deactivation blockers.
- "Creating or activating a user" is a documented trigger for sharing recalculation. Source: [Considerations for Making Sharing Updates](https://help.salesforce.com/s/articleView?id=platform.security_sharing_update_considerations.htm&language=en_US&type=5)

**What to do about leavers, practically:**

1. Reassign the leaver's records to a live owner **before** touching their role. That breaks the dependency.
2. Only then deactivate.
3. Do not delete or restructure a role until you have checked whether deactivated users in it still own records.
4. Treat the leaver backlog as a data problem, not a user administration problem. A hierarchy full of dead users is holding live access together, and it will fail the day somebody tidies it up.

I could not find an official Salesforce page describing exactly what happens to users assigned to a role when that role is deleted. The "Create a User Role" help page covers creation only and does not address deletion. Treat role deletion as untested and prove it in a sandbox first.

---

## 12. Ownership skew

### 12.1 The definition and the number

> "Ownership data skew is when a single user owns more than 10,000 records of an object."

Source: [Ownership Data Skew](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_data_skew.htm)

Salesforce Help repeats the figure as a recommendation:

> "To avoid performance issues, we recommend that no single user owns more than 10,000 records of an object."

Source: [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

The companion problem on the parent-child axis: an account associated with more than **10,000 child records** causes similar bottlenecks. Source: [Considerations for Making Sharing Updates](https://help.salesforce.com/s/articleView?id=platform.security_sharing_update_considerations.htm&language=en_US&type=5)

### 12.2 Why it hurts, and why it is a role hierarchy problem

Skew on its own is not the failure. The failure happens when a skewed owner **moves**.

> When users with data skew are "moved around the hierarchy, or moved in to or out of a role or group that is the source group for a sharing rule", Salesforce must recalculate access across a very large number of sharing table entries.

Source: [Ownership Data Skew](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_data_skew.htm)

The Salesforce engineering blog spells out the mechanism:

> "Salesforce automatically adjusts both the sharing configuration provided by the role hierarchy and the sharing rules associated with the records that the user owns."

> "If the user owns all or a large percentage of an object's records, the sharing calculations can take a long time to complete."

Source: [Behind the Scenes of Record Ownership in Salesforce](https://developer.salesforce.com/blogs/engineering/2013/10/behind-the-scenes-of-record-ownership-in-salesforce)

This is why ownership skew belongs in a role hierarchy document. A skewed owner turns a routine one-user role change into a long-running job that can affect the whole org.

### 12.3 What to do about it

In order of preference, as Salesforce states them.

**First choice, spread ownership out:**

> "Distributing ownership of records across a greater number of users decreases the chance of long-running updates occurring."

**Second choice, take the user out of the hierarchy entirely:**

> "To avoid these long calculations, exclude the user from your role hierarchy if possible."

> "If you do have a compelling reason for assigning ownership to a small number of users, you can minimize possible performance impacts by not assigning the users to a role."

**Third choice, if they must have a role:**

> "try both to dedicate an entire branch to this user at the top of your role hierarchy and to avoid moving this user elsewhere."

Plus the group rule that goes with it:

> "It's also important to keep that user out of public groups potentially used as the source for sharing rules."

Sources: [Ownership Data Skew](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_data_skew.htm), [Behind the Scenes of Record Ownership](https://developer.salesforce.com/blogs/engineering/2013/10/behind-the-scenes-of-record-ownership-in-salesforce), [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5)

Summarised as a rule: **a skewed owner should have no role, or a dedicated top-level role they never leave, and should never appear in a public group used as a sharing rule source.**

### 12.4 Who is usually skewed

Typical skewed owners in a real org:

- The integration user that a middleware tool writes records as.
- The data migration user that loaded historical records during a merge or an acquisition.
- A default owner used as a catch-all for records with no obvious owner.
- A "Salesforce Support" or "System" account used by automation.

All four are machine accounts. All four are good candidates for having no role at all.

---

## 13. Naming conventions for roles

Official Salesforce guidance here is thin. I want to be clear about that rather than dress up an opinion as documentation.

**What Salesforce actually documents:**

- Creating a role has a **Label** field, and the **Role Name** (the API name) autopopulates from it, replacing spaces with underscores. So a label of "Onboarding Manager" produces a role name of `Onboarding_Manager`.
- There is a separate field, **Role Name as displayed on reports**. Salesforce advises using a short but readable abbreviation, because a long role name takes extra space in report columns.
- A role also has a **"This role reports to"** field, which is prefilled with the parent role you clicked Add Role beneath, and which you can change.

Source: [Create a User Role](https://help.salesforce.com/s/articleView?id=sf.admin_roles.htm&language=en_US&type=5)

**What Salesforce does not document:** I searched help.salesforce.com, developer.salesforce.com, architect.salesforce.com and trailhead.salesforce.com on 2026-08-25 and found **no official naming convention for roles**. Salesforce publishes naming conventions for Apex classes and for permission sets, but not for roles. Anything you read online prescribing a role naming pattern is community opinion, not Salesforce guidance.

**What the documented guidance implies, if you need to set a convention:**

Because Salesforce says roles are about data access rather than job titles, a name that reads as a job title invites people to add a role per title, which is the thing Salesforce tells you not to do. So a convention that names the **access scope** rather than the **person** tends to hold up better. For example, a role named for a region and a function outlasts a role named for a person's grade.

Two things worth writing into a project convention, both grounded in documented behaviour:

1. **Keep the report display name short.** This is Salesforce's own advice and it has a real effect on report readability.
2. **Do not encode temporary facts in the name.** Salesforce says not to create placeholder roles for anticipated future needs. A name containing a project code or a year becomes wrong and then nobody dares rename it, because renaming feels risky.

Flagging clearly: item 1 is sourced. Item 2 is an inference from the documented "no placeholder roles" guidance, not a Salesforce statement about naming.

---

## 14. What I could not confirm

Listed so nobody later mistakes a gap for a fact.

| Question | Status on 2026-08-25 |
| --- | --- |
| Which standard objects have Grant Access Using Hierarchies switched **off** | Not found. Salesforce says "most standard objects, but not all of them" without listing exceptions. Check the org's Sharing Settings page. |
| What happens to users assigned to a role when that role is **deleted** | Not found in official documentation. The "Create a User Role" page covers creation only. Test in a sandbox. |
| Full "Considerations for Deactivating Users" content | Page would not load on either help.salesforce.com or developer.salesforce.com. Section 11.2 is partly inference and is marked as such. |
| A documented record-count threshold at which deferred sharing calculation becomes necessary | Not found as a rule. A figure of more than two million accounts appears as an illustration in some Salesforce material, but I could not confirm it as a documented threshold. |
| An enforced (rather than recommended) maximum hierarchy depth | Not found. The 10-level figure is described as a best practice, not a hard limit. |
| An official Salesforce naming convention for roles | Does not appear to exist. See section 13. |
| Exact parent-child data skew wording from the "Designing Record Access for Enterprise Scale" chapter page | That chapter page would not render its body content. The 10,000 child-record figure in this document comes from the "Considerations for Making Sharing Updates" help page instead, which does state it. |

---

## 15. Sources

All retrieved 2026-08-25.

**Salesforce Help (help.salesforce.com)**

1. [Controlling Access Using the Role Hierarchy](https://help.salesforce.com/s/articleView?id=platform.security_controlling_access_using_hierarchies.htm&language=en_US&type=5): the core definition of upward access, the Grant Access Using Hierarchies restriction to custom objects, and the sharing sets exception.
2. [Guidelines for Success with Roles](https://help.salesforce.com/s/articleView?id=platform.setup_roles_guidelines.htm&language=en_US&type=5): the single richest page. Role count limits, the "don't create a role per title" instruction, the performance guidance, the ownership skew recommendation, the full Grant Access Using Hierarchies access-reason lists, and the roleless account owner behaviour.
3. [Set Your Internal Organization-Wide Sharing Defaults](https://help.salesforce.com/s/articleView?id=platform.admin_sharing.htm&language=en_US&type=5): definitions of Private, Public Read Only, Public Read/Write and Controlled by Parent, and the Controlled by Parent restriction on Grant Access Using Hierarchies.
4. [Sharing Rule Categories](https://help.salesforce.com/s/articleView?id=platform.security_sharing_data_set_categories.htm&language=en_US&type=5): exact definitions of Roles, Roles and Subordinates, Roles and Internal Subordinates, Roles Internal and Portal Subordinates, Portal Roles and the territory equivalents.
5. [Role and Territory Sharing Groups](https://help.salesforce.com/s/articleView?id=platform.users_role_terr_sharing_groups.htm&language=en_US&type=5): the system-defined groups Salesforce creates per role, and the deprecation of Role and Subordinates.
6. [Considerations for Making Sharing Updates](https://help.salesforce.com/s/articleView?id=platform.security_sharing_update_considerations.htm&language=en_US&type=5): the full list of recalculation triggers, the leaf-nodes-first instruction, the 10,000 child-record figure, and maintenance window advice.
7. [Sharing Rule Considerations](https://help.salesforce.com/s/articleView?id=platform.security_sharing_rule_considerations.htm&language=en_US&type=5): sharing rules cannot restrict access, high-volume portal user limitations, and hierarchy roll-up of sharing rule access.
8. [Sharing Rules](https://help.salesforce.com/s/articleView?id=platform.security_about_sharing_rules.htm&language=en_US&type=5): the 300 per object limit with up to 50 criteria-based or guest user rules, and the statement that role hierarchies can never be stricter than the org-wide default.
9. [Create a User Role](https://help.salesforce.com/s/articleView?id=sf.admin_roles.htm&language=en_US&type=5): role creation fields, the "This role reports to" field, and the report display name abbreviation advice.
10. [Territory Management Best Practices](https://help.salesforce.com/s/articleView?id=000386766&language=en_US&type=1): the instruction to keep the sales branch of the role hierarchy simple and let territory management extend access, and the statement that territory access rolls up the role hierarchy automatically.
11. [Freeze or Unfreeze User Accounts](https://help.salesforce.com/s/articleView?id=sf.users_freeze.htm&language=en_US&type=5): freezing as a step distinct from deactivating.

**Salesforce Developers (developer.salesforce.com)**

12. [Record-Level Access: Under the Hood, Data Access in Salesforce](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_intro.htm): the seven record-access mechanisms, and View All / Modify All overriding record-level settings.
13. [Record-Level Access: Under the Hood, Access Grants](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_grants.htm): explicit, implicit, group membership and inherited grants defined.
14. [Record-Level Access: Under the Hood, Database Architecture](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_arch.htm): sharing rows versus group maintenance tables, and which grant type lives where.
15. [Record-Level Access: Under the Hood, Group Maintenance Tables](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_groups.htm): Role, RoleAndSubordinates and RoleAndSubordinatesInternal system groups, direct versus indirect members, and recalculation on hierarchy change.
16. [Record-Level Access: Under the Hood, Summary](https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_summary.htm): the scaling statement for large orgs.
17. [Record-Level Access: Under the Hood, full PDF](https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_record_access_under_the_hood.pdf): Spring '26 edition of the whole whitepaper.
18. [Designing Record Access for Enterprise Scale, Ownership Data Skew](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_data_skew.htm): the 10,000 record definition of ownership skew and the three mitigations.
19. [Designing Record Access for Enterprise Scale, Group Membership Operations and Sharing Recalculation](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership.htm): the exact sequence of work when a user changes role, and role moves versus user moves.
20. [Designing Record Access for Enterprise Scale, Deferred Sharing Calculations](https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_tools_deferred_sharing_maintenance.htm): what deferral does, who it suits, and its three warnings.
21. [Designing Record Access for Enterprise Scale, full PDF](https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/draes.pdf): Spring '26 edition of the whole whitepaper.
22. [Behind the Scenes of Record Ownership in Salesforce](https://developer.salesforce.com/blogs/engineering/2013/10/behind-the-scenes-of-record-ownership-in-salesforce): Salesforce engineering blog on why concentrated ownership makes role changes slow.

**Salesforce Architects (architect.salesforce.com)**

23. [Platform Sharing Architecture](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture): the 10-level depth recommendation, the 25,000 internal and 100,000 external role best-practice caps, public group nesting and count guidance, overlay handling, and the quarterly realignment advice.

**Trailhead (trailhead.salesforce.com)**

24. [Create a Role Hierarchy, Data Security module](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_roles): the "role hierarchies don't have to match your org chart" statement and the software engineer consolidation example.
25. [Improve Record Access Control in Your Org, Data Security module](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records): the four record-access controls, the org-wide default definitions, and the lock-down-then-open-up design order.
26. [Define Sharing Rules, Data Security module](https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_sharing_rules): when a sharing rule is the right tool, what a public group is and when to create one.
