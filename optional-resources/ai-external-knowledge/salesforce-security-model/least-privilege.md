# The principle of least privilege, and what it means in Salesforce

This document explains one security idea, called the principle of least privilege, and then shows exactly how that idea turns into settings inside a Salesforce org. It is written for someone who has never met the term before. Read it if you are designing who can see and do what in a Salesforce org, if you are reviewing an access model somebody else built, or if you need to explain to a business stakeholder why an access request is being narrowed. It does not assume you know any Salesforce jargon: every Salesforce term is spelled out the first time it appears.

**Basis:** built from 18 web pages read on 2026-08-25. Sources are the United States National Institute of Standards and Technology (NIST), the United States Cybersecurity and Infrastructure Security Agency (CISA) together with the National Security Agency (NSA), the Open Worldwide Application Security Project (OWASP), and Salesforce's own published material on help.salesforce.com, developer.salesforce.com, architect.salesforce.com, trailhead.salesforce.com and admin.salesforce.com. Every source URL is listed at the bottom with a line saying what it covers. Anything that could not be confirmed is called out in the section "What could not be confirmed".

---

## 1. What least privilege actually says

### The definition, quoted

NIST is a United States government agency that publishes security standards. Its glossary lists four wordings of least privilege, each taken from a different NIST or United States government publication. All four are quoted below, exactly as published, from <https://csrc.nist.gov/glossary/term/least_privilege> (retrieved 2026-08-25).

| Source publication | The definition, quoted exactly |
| --- | --- |
| NIST Special Publication (SP) 800-53 Revision 5 | "The principle that a security architecture is designed so that each entity is granted the minimum system resources and authorizations that the entity needs to perform its function." |
| NIST SP 800-171 Revision 3 | "The principle that a security architecture is designed so that each entity is granted the minimum system authorizations and resources needed to perform its function." |
| Committee on National Security Systems Instruction (CNSSI) 4009-2015 | "A security principle that a system should restrict the access privileges of users (or processes acting on behalf of users) to the minimum necessary to accomplish assigned tasks." |
| NIST SP 800-12 Revision 1 | Points at the CNSSI 4009 wording above rather than giving its own. |

NIST SP 800-53 Revision 5 is the fullest single catalogue of security controls NIST publishes. Inside it, least privilege is a numbered control called AC-6. Its control statement reads, quoted exactly:

> "Employ the principle of least privilege, allowing only authorized accesses for users (or processes acting on behalf of users) that are necessary to accomplish assigned organizational tasks."

Source: NIST SP 800-53 Revision 5, control AC-6, page 36, <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf> (retrieved 2026-08-25).

The discussion paragraph attached to AC-6 adds three things the one-line definition leaves out, quoted exactly:

> "Organizations employ least privilege for specific duties and systems. The principle of least privilege is also applied to system processes, ensuring that the processes have access to systems and operate at privilege levels no higher than necessary to accomplish organizational missions or business functions. Organizations consider the creation of additional processes, roles, and accounts as necessary to achieve least privilege. Organizations apply least privilege to the development, implementation, and operation of organizational systems."

Three points worth pulling out of that paragraph:

- It applies to **software as well as people**. An integration account, a background job, or a piece of code is an "entity" too.
- It expects you to **create more roles and accounts, not fewer**, when that is what it takes to keep each one narrow.
- It applies during **build and operation**, not only at go-live.

### The same idea in the other two source families

OWASP is a non-profit that publishes free application security guidance. Its wording, from <https://owasp.org/www-community/controls/Least_Privilege_Principle> (retrieved 2026-08-25):

> "A user, process, or program should be given only the minimum level of access or permissions necessary to perform its intended function, and nothing more."

OWASP names two reasons it matters: it reduces the **attack surface**, meaning the number of ways in, and it limits the **blast radius**, meaning how far the damage spreads once something goes wrong.

Salesforce's own wording, from its admin blog at <https://admin.salesforce.com/blog/2023/enhance-user-security-with-the-principle-of-least-privilege> (retrieved 2026-08-25):

> "users should have the minimum access needed to do their jobs, and no additional privileges."

The Salesforce security workshop on developer.salesforce.com puts it as "users should only have the permissions they need to do their job, and nothing else" (<https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/1-user-security>, retrieved 2026-08-25).

All four families of source say the same thing. There is no meaningful disagreement between NIST, OWASP and Salesforce on what the principle is. The disagreement, where there is any, is about how far to push it, and that is section 5.

### Why NIST says it helps, in its own words

NIST SP 800-53 Revision 5 states the benefit twice, in control SA-8(14) and again in SA-17(7). Quoted exactly from SA-8(14), page 219:

> "The principle of least privilege states that each system component is allocated sufficient privileges to accomplish its specified functions but no more. Applying the principle of least privilege limits the scope of the component's actions, which has two desirable effects: the security impact of a failure, corruption, or misuse of the component will have a minimized security impact, and the security analysis of the component will be simplified."

That second effect is the one people forget. Least privilege does not only reduce damage. It also makes the system **easier to reason about**, because there is less to check when you are trying to work out who could have done something.

---

## 2. Why it exists: the failure it actually prevents

The abstract answer is "it limits damage". The concrete answer is better, and CISA and NSA published it.

### The concrete failure, from a real assessment

On 2023-10-05, NSA and CISA jointly published advisory AA23-278A, "NSA and CISA Red and Blue Teams Share Top Ten Cybersecurity Misconfigurations". A red team is a group paid to break into an organization to test its defences. The advisory lists the ten misconfigurations those teams found most often. Number two on the list is **"Improper separation of user/administrator privilege"**.

Source: <https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-278a> (retrieved 2026-08-25).

The advisory names three shapes this takes, quoted exactly:

- "Excessive account privileges"
- "Elevated service account permissions"
- "Non-essential use of elevated accounts"

On excessive privileges it says, quoted exactly:

> "Account privileges are intended to control user access to host or application resources to limit access to sensitive information or enforce a least-privilege security model. When account privileges are overly permissive, users can see and/or do things they should not be able to, which becomes a security issue as it increases risk exposure and attack surface."

And the single most useful sentence in the whole advisory, describing what actually happened:

> "After obtaining initial access via an account with administrative permissions, an assessment team compromised a domain in under a business day. The team first gained initial access to the system through phishing, by which they enticed the end user to download and execute malicious payloads. The targeted end-user account had administrative permissions, enabling the team to quickly compromise the entire domain."

That is the failure least privilege prevents, stated plainly. **One ordinary person clicked one bad link. Because that one person's account happened to carry administrator rights it did not need, the whole environment fell in under a working day.** Had the account carried only the rights that person actually used, the same click would have compromised one ordinary account.

### The two threats, separated

People usually name two reasons for least privilege. They are different and both are real.

| Threat | What happens | What least privilege does about it |
| --- | --- | --- |
| **Credential compromise** | An attacker gets hold of a legitimate person's login, usually by phishing, password reuse, or malware. They then have exactly the access that person had. | Caps the attacker's reach at what that one person needed. The CISA advisory case above is this exact scenario. |
| **Insider threat** | An authorised person misuses access they were legitimately given. It may be deliberate (theft, sabotage) or accidental (a mass delete, an export to a personal device). | Caps what any one authorised person can reach or destroy, deliberately or by mistake. |

NIST names insider threat directly in AC-6(9), the enhancement about logging privileged actions, quoted exactly:

> "The misuse of privileged functions, either intentionally or unintentionally by authorized users or by unauthorized external entities that have compromised system accounts, is a serious and ongoing concern and can have significant adverse impacts on organizations."

Note that NIST's sentence covers **both** threats in one breath, and adds a third case people miss: **unintentional** misuse by an authorised user. Least privilege protects people from their own mistakes as much as it protects the organization from bad actors. A person who cannot mass-delete cannot mass-delete by accident.

### The same failure in software, not people

OWASP's access control page gives the software version of the same failure, quoted exactly from <https://owasp.org/www-community/Access_Control> (retrieved 2026-08-25):

> "Malicious code will execute with the authority of the privileged account, thus increasing the possible damage from an exploit."

and

> "Allowing web applications to use sa or other privileged database accounts destroys the database server's ability to defend against access to or modification of unauthorized resources."

("sa" is the default all-powerful administrator account name on Microsoft SQL Server.)

The Salesforce equivalent of this is an integration user. If a system that only ever needs to read Accounts is given an administrator profile, then any compromise of that integration hands over the whole org.

### Privilege creep is the mechanism that undoes it

CISA's advisory names the process by which organizations that once had least privilege stop having it, quoted exactly:

> "Expanding organizations can undergo numerous changes in account management, personnel, and access requirements. These changes commonly lead to privilege creep—the granting of excessive access and unnecessary account privileges."

Privilege creep is not a single mistake. It is the accumulation of many small, individually reasonable grants that never get taken away. Somebody covers a colleague's job for two weeks and keeps that access for four years. Somebody is promoted and keeps everything from their old role plus everything from the new one.

The Salesforce security workshop names the same thing in a Salesforce org and gives its cause honestly: "admins frequently encounter permission creep, where access expands beyond actual job requirements. Broader access reduces operational friction but introduces security vulnerabilities and data risks." (<https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/1-user-security>, retrieved 2026-08-25). The words "reduces operational friction" are the whole reason creep happens. Wide access makes today easier. That is not a delusion, it is true, and it is why nobody resists it in the moment.

---

## 3. Related principles, and how they are different

These terms get used interchangeably in conversation. They are not the same thing. Getting them apart matters because they call for different controls.

| Principle | Plain-English meaning | How it differs from least privilege |
| --- | --- | --- |
| **Least privilege** | Give each person or system only the access their job requires. | The parent idea. It is about the **size** of what one entity can reach. |
| **Need to know** | Give access to a specific piece of information only to those whose work requires that specific information. | Least privilege is about capability ("can this person delete records?"). Need to know is about the specific data ("does this person need to see *these* records?"). A person can legitimately have delete rights and still have no need to know about a particular customer. NIST SP 800-53 uses "need-to-know" as a trigger for reviewing an account: AC-2(h)(3) requires notifying account managers "when system usage or need-to-know changes for an individual". |
| **Separation of duties** | Split a sensitive process so no single person can complete it alone. | Least privilege makes one person's access small. Separation of duties makes sure two people are required, even if each has enough access on their own to be dangerous. It exists to defeat deliberate abuse, not accidents. |
| **Privilege creep** | The slow build-up of access a person no longer needs. | Not a principle, a failure mode. It is what happens to least privilege over time when nothing removes access. |
| **Standing access** | Access a person holds permanently, whether or not they are using it right now. | The default state in most systems, including a plain Salesforce permission set assignment. It is what least privilege reduces but does not eliminate. |
| **Just-in-time (JIT) access** | Access granted only at the moment it is requested, and taken away shortly after. | A stronger version of least privilege that shrinks access along the **time** axis instead of the capability axis. A person with no standing admin rights who can request them for two hours has almost none of the exposure of a permanent admin. |
| **Just-enough access (JEA)** | Give the smallest capability that finishes the job, not a whole role. | The capability-axis partner to JIT. OWASP pairs the two terms. |
| **Deny by default** | Everything is refused unless something explicitly allows it. | The implementation stance that makes least privilege achievable. Without it, every new feature or object silently starts out open. |

### What NIST says about separation of duties

Quoted exactly from NIST SP 800-53 Revision 5, control AC-5, page 35:

> "Separation of duties addresses the potential for abuse of authorized privileges and helps to reduce the risk of malevolent activity without collusion. Separation of duties includes dividing mission or business functions and support functions among different individuals or roles, conducting system support functions with different individuals, and ensuring that security personnel who administer access control functions do not also administer audit functions."

That last clause is the sharpest example. The person who grants access should not also be the person who controls the audit log, because otherwise they can grant themselves something and then erase the evidence.

NIST also builds separation of duties into least privilege itself through AC-6(2), quoted exactly:

> "Require that users of system accounts (or roles) with access to [organization-defined security functions or security-relevant information] use non-privileged accounts or roles, when accessing nonsecurity functions."

In plain words: an administrator should read their email from an ordinary account, not from the administrator account. CISA's advisory calls the failure to do this "Non-essential use of elevated accounts" and explains why it is expensive: "Using an elevated account for normal day-to-day, non-administrative tasks increases the account's exposure and, therefore, its risk of compromise and its risk to the network."

### What the published guidance says about standing versus just-in-time

CISA and NSA recommend moving off standing privilege explicitly. Quoted exactly from advisory AA23-278A:

> "Limit the number of users within the organization with an identity and access management (IAM) role that has administrator privileges. Strive to reduce all permanent privileged role assignments, and conduct periodic entitlement reviews on IAM users, roles, and policies."

and:

> "Implement time-based access for privileged accounts. For example, the just-in-time access method provisions privileged access when needed and can support enforcement of the principle of least privilege (as well as the Zero Trust model) by setting network-wide policy to automatically disable admin accounts at the Active Directory level. As needed, individual users can submit requests through an automated process that enables access to a system for a set timeframe. In cloud environments, just-in-time elevation is also appropriate and may be implemented using per-session federated claims or privileged access management tools."

OWASP says the same in its Top 10 Proactive Controls, control C1, quoted exactly from <https://top10proactive.owasp.org/the-top-10/c1-accesscontrol/> (retrieved 2026-08-25):

> "ensure that all users, programs, or processes are only given just enough access to achieve their current mission. This access should be provided just in time, when the subject makes the request, and the access should be granted for a short time."

The same page states deny by default, quoted exactly:

> "Ensure that by default, all the requests are denied, unless they are specifically allowed."

**Note on Salesforce and just-in-time:** Salesforce has no built-in "request admin rights for two hours" workflow equivalent to the privileged access management tools CISA describes. The nearest native mechanism is an **expiring permission set group assignment**, described in section 7 below. Whether third-party managed packages provide fuller just-in-time elevation for Salesforce was not researched for this document.

---

## 4. What least privilege looks like inside a Salesforce org

Salesforce access splits into two separate questions, and they are controlled by different settings. Mixing them up is the most common cause of a broken access design.

| Question | What Salesforce calls it | Controlled by |
| --- | --- | --- |
| What is this person allowed to **do**? | Object-level and field-level security, plus system permissions | Profiles, permission sets, permission set groups |
| Which **records** is this person allowed to see? | Record-level security, or "sharing" | Organization-wide defaults, role hierarchy, sharing rules, manual sharing, teams, territories, restriction rules |

Least privilege has to be applied to both. A user with no ability to delete Accounts still cannot delete an Account they can see. A user who can see every Account can still read every Account even if they cannot edit any of them.

### 4.1 Start from a minimum-access profile

A **profile** in Salesforce is a required setting on every user. Each user has exactly one and can never have more than one. Historically profiles carried most of a user's access.

Salesforce ships a standard profile called **Minimum Access - Salesforce**, built specifically as a least-privilege starting point. Salesforce's official guidance is to use it as the baseline for everyone.

Quoted exactly from the Salesforce Help page "Guidelines for Creating Permission Sets and Permission Set Groups" (<https://help.salesforce.com/s/articleView?id=sf.perm_sets_best_practices.htm&language=en_US&type=5>, retrieved 2026-08-25):

> "Assign users the Minimum Access - Salesforce profile, or a clone of it if you're modifying the included default settings for different users. Then, use permission sets and permission set groups to grant users only the permissions that they require."

The Salesforce security workshop states the reasoning:

> "Profiles set the minimum access for your users. For maximum restriction, use the Minimum Access - Salesforce profile as a baseline, then layer additional access using Permission Sets and Permission Set Groups."

This is deny-by-default expressed in Salesforce terms. The baseline grants close to nothing, and everything a person can do is something somebody deliberately added.

### 4.2 Permission set led design

A **permission set** is a bundle of permissions that can be assigned to a user on top of their profile. Unlike profiles, a user can hold many permission sets at once.

The published Salesforce guidance is to move essentially all access out of profiles and into permission sets. The Salesforce Well-Architected "Secure" guide states it as a rule (<https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>, retrieved 2026-08-25), quoted exactly:

> "Minimize the use of profiles and migrate any access controls out of profiles."

The same guide says profiles should be left holding only "login IP ranges" and "login hours", while "Permission sets and permission set groups" govern all other access. The admin best-practices post at <https://admin.salesforce.com/blog/2022/admin-best-practices-for-user-management> (retrieved 2026-08-25) gives a slightly wider split: profiles keep default record types and apps, page layout assignments, login hours and login IP ranges; permission sets take system permissions, object and field access, connected app access, custom permissions, and Apex class and Visualforce page access.

**Design permission sets around tasks, not job titles.** This is the point most people get wrong. Quoted from the Salesforce Help guidelines page, summarising its recommendation: apply permission sets based on the actual tasks employees perform, so a permission set can be reused across different groups of users. A permission set named "Manage Cases" can be reused by five personas. A permission set named "Senior Field Sales Rep, Northeast" can be reused by nobody.

Why it matters in numbers: the Salesforce Help guidelines page says the permission set led model lets you "avoid creating dozens or even hundreds of profiles for each user and job function". The admin post at <https://admin.salesforce.com/blog/2024/use-permission-sets-overcome-access-dilemmas> (retrieved 2026-08-25) reports one organization going "from 230+ permission sets to 30" by restructuring around reusable task-level building blocks rather than role-level ones.

### 4.3 Permission set groups

A **permission set group** bundles several permission sets together and is assigned as one unit. Salesforce's published guidance treats a permission set group as the representation of a **persona**, meaning a type of job rather than a specific person.

Quoted from the Salesforce Well-Architected Secure guide:

> "Secure Salesforce solutions use individuals for authentication, and personas for authorization."

In plain words: you prove *who* somebody is as an individual, but you decide *what they can do* based on which persona they belong to. That single sentence is the whole answer to the "unit of least privilege" question, and section 6 goes into it.

The pattern published across the Salesforce material is:

1. Build small permission sets, one per task or feature.
2. Bundle them into a permission set group per persona (for example "Sales Rep", "Case Agent", "Finance Analyst").
3. Assign the group, not the individual permission sets.

The admin post at <https://admin.salesforce.com/blog/2024/use-permission-sets-overcome-access-dilemmas> describes a specific three-tier version of this:

| Tier | What goes in it |
| --- | --- |
| Base permission set | Permissions every user needs, such as "Run flows" and "Lightning Experience user" |
| Read permission set | View-only access to objects and fields that several personas all need to read |
| Persona permission set | Create, edit and delete rights specific to one function |

### 4.4 Muting permission sets

A **muting permission set** turns a permission *off* inside one permission set group, without changing the permission sets themselves.

This exists because of a real tension. If you build reusable permission sets, one of them will eventually contain slightly more than a particular persona should have. The naive fix is to clone it and delete the extra permission, which destroys the reuse you were trying to get.

Quoted exactly from the Salesforce Help guidelines page:

> "To remove permissions from a permission set group without affecting the included permission sets, create a muting permission set. You don't need to create nearly identical permission sets with only those few permissions removed."

The Trailhead module at <https://trailhead.salesforce.com/content/learn/modules/permission-set-groups/mute-permissions-in-permission-set-groups> (retrieved 2026-08-25) defines it as: "Muting permission sets let you customize a permission set group by disabling (muting) selected permissions in it." Its worked example is a Service Reps group that needs case management but must not be able to delete cases, solved by muting Delete inside the group rather than editing the shared Case Management permission set.

**Two behaviours of muting that catch people out, both from the Trailhead module and the Salesforce Help muting-dependencies page:**

1. **Muting is scoped to the one group.** Quoted exactly: "When you mute a permission in a permission set group, the muting affects only users assigned to the permission set group." If the same user gets that permission from their profile, from a separate permission set, or from a different permission set group, they keep it. Muting is not a deny rule that overrides everything.
2. **Muting cascades through dependencies.** Muting a permission automatically mutes permissions that depend on it. The published example: mute Delete on an object and Modify All Records for that object is muted too, because it depends on full object access.

Point 1 is the important one for anyone designing an access model. **A muting permission set is not a way to guarantee somebody cannot do something.** It only subtracts within its own group. If you need a hard guarantee, the permission must not be granted anywhere.

### 4.5 Private organization-wide defaults, opened by rule

**Organization-wide defaults**, usually shortened to OWD, set the baseline level of access every user has to records they do not own. Everything else in the sharing model can only add access on top; nothing except a restriction rule can take it away.

The published Salesforce approach is to set the baseline as tight as the business allows, then open it selectively. Quoted exactly from the Salesforce architect guide "Platform Sharing Architecture" (<https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture>, retrieved 2026-08-25):

> "Use organization-wide sharing settings to lock your data to the most restrictive level. Use the other record-level security and sharing tools to selectively give access to other users."

The Trailhead unit "Improve Record Access Control in Your Org" (<https://trailhead.salesforce.com/en/modules/data_security/units/data_security_records>, retrieved 2026-08-25) says the same and adds the useful test for choosing the setting: the organization-wide default should "represent the access the most restricted user should have".

The Salesforce Well-Architected Secure guide gives an actual recommended default rather than leaving it open:

> "Set _internal_ organization-wide defaults (OWDs) to Public Read Only, unless your business deals with sensitive data — then use Private."

and

> "Set _external_ organization-wide defaults (OWDs) to Private, unless you have a compelling business reason to allow greater access."

This is worth reading carefully, because it is more nuanced than "always set everything to Private". Salesforce's published position is:

| Audience | Recommended default | Exception |
| --- | --- | --- |
| Internal users | Public Read Only | Use Private when the data is sensitive |
| External users (partners, community and portal users) | Private | Only with a stated business justification |

For a healthcare or pharmaceutical org handling patient or prescriber data, "your business deals with sensitive data" is plainly true, so Private is the recommended internal setting under Salesforce's own guidance.

The layers that open access back up, listed by the architect guide, are: role hierarchy, owner-based sharing rules, criteria-based sharing rules, manual sharing, teams, territory hierarchy, and Apex managed sharing (sharing granted by code).

### 4.6 Restriction rules, which cut the other way

Every layer above adds access. **Restriction rules** are the one native mechanism that subtracts it. Quoted exactly from the architect guide:

> "Restriction rules work in the opposite manner as the sharing components discussed in this topic; instead of opening up access to users, they further restrict it."

The Salesforce Help page on restriction rules describes the effect as filtering: records a user could reach through org-wide defaults and sharing rules get narrowed to only those matching criteria you set, permanently. They are recommended for sensitive records and for objects where org-wide defaults alone cannot achieve real privacy, specifically contracts, tasks and events.

**Documented limits** (from the Salesforce Help "Restriction Rule Considerations" page as reported in search results on 2026-08-25, not fetched directly): restriction rules support only the EQUALS operator, do not support AND or OR, do not support external IDs in criteria, and are available for custom objects, external objects, contracts, events, tasks, time sheets and time sheet entries. Confirm these limits against the current Salesforce Help page before designing around them, because the list of supported objects has expanded over time.

Do not confuse restriction rules with **scoping rules**. Scoping rules change the default set of records a user *sees first*; they do not remove access. Users can still open and report on everything their sharing settings allow.

### 4.7 View All Data and Modify All Data: what to use instead

These are the two most dangerous permissions in a Salesforce org and the ones most often handed out by accident.

The Salesforce Security Guide page "'View All' and 'Modify All' Permissions Overview" (retrieved 2026-08-25 through the Salesforce documentation content service for `securityImplGuide/users_profiles_view_all_mod_all.htm`; the reader-facing page is <https://help.salesforce.com/s/articleView?id=platform.users_profiles_view_all_mod_all.htm&type=5>) opens with, quoted exactly:

> "The 'View All' and 'Modify All' permissions ignore sharing rules and settings, allowing administrators to grant access to records associated with a given object across the organization. 'View All' and 'Modify All' can be better alternatives to the 'View All Data' and 'Modify All Data' permissions."

The distinction, which is the practical takeaway:

| Permission | Scope | Salesforce says it is for |
| --- | --- | --- |
| **View All** / **Modify All** (per object) | One named object, org-wide | "Delegation of object permissions", intended for "Delegated administrators who manage records for specific objects" |
| **View All Data** / **Modify All Data** (org-wide) | Every object and every app | "Managing all data in an organization; for example, data cleansing, deduplication, mass deletion, mass transferring, and managing record approvals" |

Salesforce's own note on the org-wide pair, quoted exactly from the same page: "Users with View All Data (or Modify All Data) permission can view (or modify) all apps and data, even if the apps and data are not otherwise accessible to them."

The practical rule that follows from the published guidance: **if a person needs org-wide reach on one object, grant View All or Modify All on that object. Never reach for View All Data or Modify All Data to solve a single-object problem.** The Salesforce security workshop describes exactly this going wrong: "a former admin gave every user View All and Modify All access", expedient at the time and a security violation afterwards.

**Four considerations from the same page that people get wrong:**

1. None of these permissions override field-level security. "Users must still have field permissions to read or edit each field on an object."
2. Enabling or disabling View All Data or Modify All Data in a profile or permission set can time out in orgs with many objects. Salesforce recommends using the Metadata API rather than the Setup user interface for these changes.
3. View All on an object does not automatically grant access to its standard child records, and does not work in reverse either. It does grant access to child **custom** object records.
4. View All Data, Modify All Data, View All and Modify All cannot be assigned to external users at all.

---

## 5. The tension least privilege creates, and what the guidance says about it

This is the part that gets skipped, and it is the part that decides whether an access model survives contact with a real business.

### The three forms the tension takes

| Tension | What it looks like day to day |
| --- | --- |
| **Coverage** | Somebody is on leave, sick, or has left. Their work still has to be done. Under a tight model, nobody else can do it, so the work stops until an administrator makes a change. |
| **Cross-team work** | One person legitimately does two jobs, or a project pulls people from four departments who all need to see each other's records for six weeks. A model built around clean job boundaries has no shape for this. |
| **Administrative overhead** | Every narrowing multiplies the number of things an administrator maintains, reviews, and troubleshoots. The tighter the model, the more requests, and the more time spent proving why somebody cannot see a record. |

### What Salesforce publishes about resolving it

Salesforce's published position is unusually direct, and it does **not** say "restrict as hard as possible". Quoted exactly from the Well-Architected Secure guide:

> "Avoid over-engineered data restrictions and sharing schemes, which can cause downstream issues for system maintainability, scalability, and adaptability."

The architect material pairs this with an instruction to take the simplest route to the principle rather than the tightest: choose the simplest path to applying the principle of least privilege, and take advantage of the layered sharing model rather than inventing bespoke restriction schemes.

That is a real position with real consequences. It means Salesforce considers an over-complicated access model to be a **failure of the design**, not an excess of caution. A sharing model nobody can reason about produces the same outcome as a permissive one, because the eventual fix under time pressure is somebody granting Modify All Data to make the problem go away.

**Three concrete mechanisms the Salesforce material offers for the tension, rather than telling you to loosen the model:**

1. **Multiple assignments instead of one big role.** The single-profile problem is that a person doing two jobs cannot have two profiles. Permission sets solve it because a user "can have many". A person covering a second role gets a second permission set group, and nothing about their normal access changes. Source: <https://admin.salesforce.com/blog/2024/use-permission-sets-overcome-access-dilemmas>.
2. **Expiring assignments for temporary work.** Permission set group assignments "can be set to expire". The worked example in the Salesforce admin post is one employee covering a colleague's marketing duties while that colleague is away: assign the Marketing permission set group with an expiry set for the end of the cover period. This is the closest native Salesforce equivalent to just-in-time access, and it addresses the coverage tension without leaving the access behind afterwards. Source: <https://admin.salesforce.com/blog/2024/use-permission-sets-overcome-access-dilemmas>.
3. **Reuse to cut the overhead.** The overhead objection is largely an objection to *duplication*, not to tightness. Task-level permission sets composed into persona groups, with muting for the exceptions, is the published answer, and the reported result was a drop from over 230 permission sets to 30.

### What CISA and OWASP say about the same tension

Neither pretends it is free. OWASP's Authorization Cheat Sheet names the specific asymmetry that makes it hard, quoted exactly from <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html> (retrieved 2026-08-25):

> "it is easier to grant users additional permissions rather than to take away some they previously enjoyed"

Its recommended response is to spend the effort at design time rather than at cleanup time: define trust boundaries during the design phase, enumerate user types, resources and operations up front, and write tests that check the intended permissions are actually enforced. The cheat sheet's argument is that careful planning early reduces the far more painful work of taking access away later.

CISA's answer to the overhead problem is automation and process rather than looseness: audit accounts routinely, limit who can create accounts, and use automated request workflows for time-boxed elevation rather than permanent grants.

### The honest summary

The published guidance across all sources lands in the same place: **the goal is the smallest access that does not require a human to intervene on ordinary work.** Restriction that stops normal work every week is not a win, because it gets removed. Restriction that is invisible on ordinary days and only bites on unusual ones is the target.

---

## 6. Detection and monitoring: the counter-argument, and the complement

There is a real argument against pushing prevention as far as it will go. It runs: perfect prevention is impossible and expensive, restrictive models break work and get relaxed under pressure, so put the effort into **seeing** what people do instead, and respond when something looks wrong.

The published guidance does not accept this as a replacement. It accepts it as a required partner.

### NIST treats logging as part of least privilege itself

Least privilege in NIST SP 800-53 Revision 5 is not only about restriction. Control enhancement AC-6(9), "Log Use of Privileged Functions", sits inside the least privilege control and requires you to "Log the execution of privileged functions." Its discussion says why, quoted exactly:

> "Logging and analyzing the use of privileged functions is one way to detect such misuse and, in doing so, help mitigate the risk from insider threats and the advanced persistent threat."

The structure is the argument. NIST put detection **inside** the least privilege control rather than in a separate one. Restriction handles what you can prevent. Logging handles the privileged access that has to exist anyway, because somebody has to be an administrator.

### CISA treats missing monitoring as a top-ten failure in its own right

The same NSA and CISA advisory that ranks improper privilege separation second ranks **"Insufficient internal network monitoring"** third. Its worked example is the point:

> "An assessment team gained persistent deep access to a large organization with a mature cyber posture. The organization did not detect the assessment team's lateral movement, persistence, and command and control (C2) activity, including when the team attempted noisy activities to trigger a security response."

Note "mature cyber posture". That organization presumably had access controls. It could not see what was happening inside them. The advisory's mitigation guidance pairs the two explicitly: "Implement authentication, authorization, and accounting (AAA) systems to limit actions users can perform, **and review logs of user actions to detect unauthorized use and abuse**." One sentence, both halves.

### What Salesforce offers as the detection half

Salesforce sells detection capability as an add-on called **Salesforce Shield**, of which the relevant part is **Real-Time Event Monitoring** and **Transaction Security Policies**.

From the Trailhead module at <https://trailhead.salesforce.com/content/learn/modules/realtime-event-monitoring/get-to-know-realtime-events-and-transaction-security> (retrieved 2026-08-25):

- Real-Time Event Monitoring lets you "monitor and detect standard events in Salesforce in near real time", both as live alerts and as stored history retained from "6 months to 10 years".
- Transaction Security Policies act on those events "in near real time", and can take "standard actions, such as blocking an operation, or custom actions defined in Apex".

The published examples of what it catches are exactly the insider-threat and compromised-credential shapes from section 2:

- "Downloading a report containing account data with over 2,000 rows"
- "Modifying a filter on a contact list view to include personally identifiable information (PII)"
- "Querying sensitive records via version 2 of the Bulk API"

One named policy example: "a Transaction Security policy on ReportEvent to limit the number of records a user can download, or trigger two-factor authentication."

The Salesforce Well-Architected Secure guide sets the target state for this as automated response, quoted exactly:

> "Automations are in place to respond to threats by deactivating user accounts or blocking access to resources in real time if abnormal usage is detected."

### Where detection genuinely substitutes, and where it does not

Reading the sources together, the honest split is this:

| Situation | Prevention or detection |
| --- | --- |
| A capability nobody in a role ever legitimately needs | **Prevention.** Do not grant it. Detection here is pure cost. |
| A capability the role needs but should rarely use at scale (bulk export, mass delete) | **Both.** Grant it, then set a threshold policy that alerts or blocks on abnormal volume. This is the case where detection genuinely earns its place, because prevention would break the legitimate use. |
| Administrator access itself | **Both, mandatory.** Somebody must be an administrator. NIST AC-6(9) exists specifically for this case. |
| A restriction that keeps breaking normal work | **Reconsider the design.** Neither prevention nor detection fixes a model that is wrong about what the job requires. |

The one caution the Trailhead module itself raises: Real-Time Event Monitoring is not free of the permission model. Object permissions to the real-time event objects "must be assigned accordingly in profiles or permission sets", so the monitoring capability is itself something to hold to least privilege. Whoever can read the events, and whoever can change the transaction security policies, should not be the same people whose behaviour those policies watch. That is separation of duties from section 3, applied to the monitoring system.

**Compensating controls, and what could not be confirmed:** the phrase "compensating control" has a specific meaning in some compliance frameworks, meaning an alternative control accepted when the specified one is not achievable. No page read for this document used that phrase in relation to least privilege. What the sources do support is the weaker and more useful claim above: detection is published as a required partner to restriction, and as the reasonable answer where restriction would break legitimate work. Do not cite these sources as saying monitoring is an accepted substitute for least privilege, because none of them say that.

---

## 7. Choosing the unit: per person, per team, per department, per region

Least privilege says "each entity gets what it needs". It does not say what an entity is. In practice organizations choose a unit, and the choice has large consequences for maintenance.

### The one clear published rule

Salesforce's Well-Architected Secure guide gives a direct instruction, quoted exactly:

> "Secure Salesforce solutions use individuals for authentication, and personas for authorization."

and the reasoning behind it, from the same architect material: think about user access in terms of personas, not individuals, because thinking of authorization in terms of individual users will not let the system scale and evolve.

That is the answer to "per individual". **Do not use the individual as the unit for what somebody is allowed to do.** Use it only for proving who they are. This is the strongest and clearest piece of published guidance on the unit question found in this research.

### The published method for choosing personas

From the Salesforce architect material: design access around meaningful job functions, and build a security matrix mapping user personas to the business functions they perform.

The admin best-practices post at <https://admin.salesforce.com/blog/2022/admin-best-practices-for-user-management> shows an actual worked matrix with the personas Sales Reps, Sales Managers, Customer Service, Finance and Operations, and Executives, each with a different level of Account and Contact access. Those are job functions, not departments and not regions.

### How the units compare

The table below is a synthesis, not a quotation. The published guidance directly supports only the first two rows (reject individuals, use personas or job functions). The rows on department, region and line of business are drawn from what the two access mechanisms in Salesforce are built to do, and no page read for this research gave explicit guidance on choosing between them. Treat rows three to five as reasoning to be checked, not as sourced fact.

| Unit | What it means | Where it works | Where it breaks |
| --- | --- | --- | --- |
| **Per individual** | Access decided one person at a time | Almost never | Explicitly advised against by Salesforce. Does not scale, and cannot be reviewed meaningfully because every user is a special case. |
| **Per persona or job function** | Access decided by the kind of work somebody does | The published default for permissions, meaning what a person can do | Needs periodic revisiting as jobs change shape. A person doing two jobs needs two assignments. |
| **Per team or department** | Access decided by which group somebody belongs to | Fits record visibility better than it fits permissions, because Salesforce's role hierarchy and sharing rules are built around groups of people | A department contains several job functions with genuinely different needs. Using department for permissions grants the union of everything anyone in it does. |
| **Per line of business** | Access decided by which business the work belongs to | Useful for record visibility when two businesses genuinely must not see each other's records | Same problem as department, one level larger. |
| **Per region or territory** | Access decided by geography | Salesforce ships a dedicated mechanism for this, territory hierarchy, listed among the sharing layers in the architect guide | Only answers "which records", never "what can they do". |

### The practical shape this points at

Reading the sources together, the two questions from section 4 take different units:

- **What a person can do** takes the **persona or job function** unit, delivered through permission set groups. This is directly published guidance.
- **Which records a person can see** takes a **group or geography** unit, delivered through the role hierarchy, sharing rules and territory hierarchy, because those are the mechanisms Salesforce built for it.

A common mistake is using one unit for both. Using department for permissions gives every person in a department the widest access anyone in it needs. Using persona for record visibility usually cannot be expressed in the sharing model at all.

---

## 8. Reviewing and reducing privilege over time

Least privilege granted once and never checked becomes privilege creep within a year. Every source read for this document says review is mandatory, not optional.

### What NIST requires

Two controls in NIST SP 800-53 Revision 5 cover this.

**AC-6(7), "Review of User Privileges"**, quoted exactly:

> "(a) Review [Assignment: organization-defined frequency] the privileges assigned to [Assignment: organization-defined roles or classes of users] to validate the need for such privileges; and (b) Reassign or remove privileges, if necessary, to correctly reflect organizational mission and business needs."

Its discussion explains why a one-time design is not enough, quoted exactly:

> "The need for certain assigned user privileges may change over time to reflect changes in organizational mission and business functions, environments of operation, technologies, or threats. A periodic review of assigned user privileges is necessary to determine if the rationale for assigning such privileges remains valid. If the need cannot be revalidated, organizations take appropriate corrective actions."

The phrase "if the need cannot be revalidated" is the whole test. A recertification review is not asking "is this person still here". It is asking "can somebody still state the reason this access exists". If nobody can, it goes.

**AC-2, "Account Management"**, adds the triggers that should prompt a change between scheduled reviews. It requires notifying account managers within a defined time period when:

> "1. [Assignment: organization-defined time period] when accounts are no longer required; 2. [Assignment: organization-defined time period] when users are terminated or transferred; and 3. [Assignment: organization-defined time period] when system usage or need-to-know changes for an individual"

and separately requires you to "Review accounts for compliance with account management requirements [Assignment: organization-defined frequency]".

Item 2, **transferred**, is the one that matters most for privilege creep. Termination is usually handled. Internal transfer usually is not, and it is how a person ends up holding three jobs' worth of access.

### What CISA recommends

From advisory AA23-278A, quoted exactly:

> "Audit user accounts and remove those that are inactive or unnecessary on a routine basis. Limit the ability for user accounts to create additional accounts."

and:

> "Strive to reduce all permanent privileged role assignments, and conduct periodic entitlement reviews on IAM users, roles, and policies."

### What OWASP recommends

From the Authorization Cheat Sheet: periodically review permissions after deployment, specifically looking for privilege creep, checking that current privileges have not grown beyond those defined during design. The check is against the **design**, not against last year's state. Comparing this year to last year normalises whatever crept in last year.

### The Salesforce tools that support this

| Tool | What it does | Where it is documented |
| --- | --- | --- |
| **User Access Summaries** | Shows everything one user can actually do, aggregated across their profile and every permission set and group they hold. It lists object permissions including Read, Create, Edit, Delete, View All Records and Modify All Records. This is the tool that answers "what can this person actually do", which is otherwise, in the words of the Salesforce admin post, "hundreds of clicks". | <https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/1-user-security> |
| **Reports on permission assignment** | Standard reporting to find over-privileged users at scale, rather than one at a time. The worked example in the Salesforce security workshop is an "Active System Administrators" report to find how many people hold the administrator profile. | Same page as above |
| **Health Check** | A single Setup page that scores the org's security settings from 0 to 100 against Salesforce's recommended values and flags gaps. It flags, among other things, an unusually high number of System Administrator profile holders. | <https://trailhead.salesforce.com/content/learn/modules/security_basics/security_basics_healthcheck> |
| **Security Center** | A paid add-on giving one dashboard across multiple orgs, covering permission assignments, authentication methods, installed packages and Health Check scores. Its distinguishing capability for review work is history: it shows when a user gained or lost a permission, and which profile or permission set granted it. | <https://help.salesforce.com/s/articleView?id=sf.security_center.htm&language=en_US&type=5> |
| **User Access Policies** | Automates granting and revoking access based on criteria on the user record. Two kinds: **manual** policies run only when an administrator starts them, intended for one-off migrations; **active** policies run automatically when a user record is created or updated to match the criteria. They can grant or revoke permission sets, permission set groups, permission set licenses, package licenses, public groups and queues. | <https://trailhead.salesforce.com/content/learn/modules/user-access-policies/get-started-with-user-access-policies> |
| **Expiring permission set group assignments** | An assignment with an end date, so temporary access removes itself. | <https://admin.salesforce.com/blog/2024/use-permission-sets-overcome-access-dilemmas> |
| **Real-Time Event Monitoring** | Historical event data retained from 6 months to 10 years, which lets a review ask "did this person ever actually use this access", not only "were they granted it". | <https://trailhead.salesforce.com/content/learn/modules/realtime-event-monitoring/get-to-know-realtime-events-and-transaction-security> |

**Active User Access Policies are the direct answer to the transfer problem.** NIST AC-2 requires a response when a user is transferred. An active user access policy triggered on a change to a user's department, role or title field can revoke the old persona's permission set group and grant the new one automatically, at the moment the user record changes. That converts a manual step somebody will forget into something the platform does.

The Salesforce admin blog also names deactivation as part of the cycle, quoted exactly from <https://admin.salesforce.com/blog/2023/enhance-user-security-with-the-principle-of-least-privilege>:

> "Once a user no longer requires access to certain data, or to Salesforce as a whole, you should remove their access as soon as possible."

### A workable review cycle

Synthesised from the above rather than quoted from any one source:

1. **On every user record change** (department, role, title, manager): active user access policies grant and revoke automatically.
2. **On departure**: deactivate the user. Deactivation, not deletion, since Salesforce records reference the user.
3. **Quarterly or half-yearly**: recertify persona assignments. For each persona, can somebody still state why each permission set in its group is there? This is NIST AC-6(7)(a) applied to the persona rather than to every user, which is what makes it possible to actually do.
4. **Continuously**: Health Check score, and a standing report on holders of the System Administrator profile, View All Data and Modify All Data.
5. **Annually**: check the design itself, not just the assignments. OWASP's point is that the comparison should be against the intended design, so the intended design has to exist in writing.

---

## 9. What could not be confirmed

Stated plainly, so nobody treats a gap as a fact.

| Item | Status |
| --- | --- |
| CISA Zero Trust Maturity Model, version 2, April 2023 | Could not be fetched. Both the CISA topic page and the PDF returned HTTP 403 Forbidden on 2026-08-25. Search result summaries indicated it places just-in-time and least-privilege access at the "Optimal" maturity stage, but that was not read from the document itself and should not be cited from this document. |
| Salesforce Help pages served by the single-page help site | Several would not render as text on 2026-08-25, including the profile-to-permission-set migration page, the muting permission sets page, and the restriction rule considerations page. Content for those is taken from Salesforce search result summaries or from the Trailhead and architect equivalents, which are noted where used. |
| Exact current limits of restriction rules | The operator limits and supported object list in section 4.6 come from a search result summary, not from the fetched page. Verify against the live Salesforce Help page before designing around them. |
| Just-in-time privilege elevation for Salesforce | Salesforce has no native "request elevated access for two hours" workflow that this research found. Expiring permission set group assignments are the nearest native equivalent. Whether third-party managed packages fill this gap was not researched. |
| The phrase "compensating control" applied to least privilege | Not used by any source read. See the caution at the end of section 6. |
| Any timeline for Salesforce retiring permissions on profiles | Not confirmed. The published guidance is to migrate access off profiles, but no source read on 2026-08-25 gave a retirement date for profile-based permissions. |
| Whether any particular org follows any of this | Not in scope for this document. This is background reference material only. It describes published guidance, not the state of any org. |

---

## Sources

Every URL below was retrieved on 2026-08-25.

**NIST**

| URL | What it covers |
| --- | --- |
| <https://csrc.nist.gov/glossary/term/least_privilege> | The four official NIST and CNSSI definitions of least privilege, with the publication each comes from. |
| <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf> | NIST SP 800-53 Revision 5. Control AC-6 Least Privilege and its ten enhancements (page 36 onward), AC-5 Separation of Duties (page 35), AC-2 Account Management, SA-8(14) and SA-17(7) on least privilege as a design principle. |

**CISA and NSA**

| URL | What it covers |
| --- | --- |
| <https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-278a> | Joint NSA and CISA advisory of 2023-10-05, "Top Ten Cybersecurity Misconfigurations". Misconfiguration 2 (improper privilege separation, excessive privileges, privilege creep, elevated service accounts) and misconfiguration 3 (insufficient monitoring), plus mitigations covering just-in-time access, account audits, and log review. |

**OWASP**

| URL | What it covers |
| --- | --- |
| <https://owasp.org/www-community/controls/Least_Privilege_Principle> | OWASP's definition of least privilege, attack surface and blast radius, and worked examples for operating systems, databases, cloud service accounts and microservices. |
| <https://owasp.org/www-community/Access_Control> | The over-permissioned server and database failure modes, and segregation of duties named as a software access control. |
| <https://top10proactive.owasp.org/the-top-10/c1-accesscontrol/> | OWASP Top 10 Proactive Controls, control C1. Just-in-time and just-enough access, deny by default, and dedicated privileged roles per function. |
| <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html> | Enforcing least privilege at design time, testing that permissions are enforced, reviewing for privilege creep after deployment, and the asymmetry that granting is easier than revoking. |

**Salesforce: architecture and design guidance**

| URL | What it covers |
| --- | --- |
| <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html> | Salesforce Well-Architected "Secure" guide. Individuals for authentication and personas for authorization, minimizing profiles, recommended internal and external org-wide defaults, the warning against over-engineered restriction schemes, automated threat response, and regular audit reviews. |
| <https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-sharing-architecture> | The full record-level sharing model: org-wide defaults, role hierarchy, owner-based and criteria-based sharing rules, manual sharing, teams, territory hierarchy, Apex managed sharing, and restriction rules as the one mechanism that subtracts access. |

**Salesforce: permissions**

| URL | What it covers |
| --- | --- |
| <https://help.salesforce.com/s/articleView?id=sf.perm_sets_best_practices.htm&language=en_US&type=5> | Official guidelines for permission sets and permission set groups. Assign the Minimum Access - Salesforce profile then layer permission sets, design by task rather than job title, use muting permission sets instead of near-duplicate permission sets, and what stays on the profile. |
| <https://help.salesforce.com/s/articleView?id=platform.users_profiles_view_all_mod_all.htm&type=5> | "View All" and "Modify All" versus "View All Data" and "Modify All Data": what each is for, who needs it, and the four considerations including field-level security, Metadata API timeouts, child record behaviour, and the block on external users. Text quoted here was retrieved through the Salesforce documentation content service for `securityImplGuide/users_profiles_view_all_mod_all.htm`, because the reader-facing page would not render. |
| <https://developer.salesforce.com/workshops/admin-security-workshop/identity-and-access/1-user-security> | Salesforce security workshop. Least privilege stated plainly, permission creep and why it happens, User Access Summaries, reporting on over-privileged users, Health Check flags, and the "former admin gave every user View All and Modify All" failure. |
| <https://trailhead.salesforce.com/content/learn/modules/permission-set-groups/mute-permissions-in-permission-set-groups> | Muting permission sets: what they are, the Service Reps worked example, that muting is scoped to one permission set group only, and that muting cascades through permission dependencies. |
| <https://admin.salesforce.com/blog/2023/enhance-user-security-with-the-principle-of-least-privilege> | Salesforce's own definition of least privilege, accurate permission provisioning, Dynamic Forms field visibility, prompt removal of access, and the privilege audit. |
| <https://admin.salesforce.com/blog/2022/admin-best-practices-for-user-management> | The split of what belongs in profiles versus permission sets, and a worked persona matrix (Sales Reps, Sales Managers, Customer Service, Finance and Operations, Executives) with different Account and Contact access. |
| <https://admin.salesforce.com/blog/2024/use-permission-sets-overcome-access-dilemmas> | The single-profile dilemma, the base / read / persona three-tier permission set model, expiring permission set group assignments for temporary cover, and the reported reduction from over 230 permission sets to 30. |
| <https://admin.salesforce.com/blog/2026/the-salesforce-admins-guide-to-profiles-and-permissions> | Current statement of the permission set led model: profiles as baseline, Minimum Access - Salesforce for maximum restriction, multiple permission sets per user, and muting inside groups. |

**Salesforce: record access, review and monitoring**

| URL | What it covers |
| --- | --- |
| <https://trailhead.salesforce.com/en/modules/data_security/units/data_security_records> | Record-level access. The four mechanisms in order, the lock-down-then-open-up instruction, and the test that org-wide defaults should represent the access the most restricted user should have. |
| <https://trailhead.salesforce.com/content/learn/modules/user-access-policies/get-started-with-user-access-policies> | User Access Policies. Manual versus active policies, what they can grant and revoke, and the promotion, role change, department move and cleanup use cases. |
| <https://trailhead.salesforce.com/content/learn/modules/realtime-event-monitoring/get-to-know-realtime-events-and-transaction-security> | Real-Time Event Monitoring and Transaction Security Policies. Retention of 6 months to 10 years, worked detection examples (large report downloads, list view filters exposing personal data, Bulk API queries on sensitive records), blocking and Apex actions, and the note that event object permissions are themselves assigned through profiles or permission sets. |
| <https://trailhead.salesforce.com/content/learn/modules/security_basics/security_basics_healthcheck> | Health Check: a 0 to 100 score comparing the org's security settings against Salesforce's recommended values. Referenced from search result summaries on 2026-08-25 rather than fetched directly. |
| <https://help.salesforce.com/s/articleView?id=sf.security_center.htm&language=en_US&type=5> | Security Center: cross-org dashboard covering permission assignments and the history of when a user gained or lost a permission and from which profile or permission set. Referenced from search result summaries on 2026-08-25 rather than fetched directly. |
| <https://help.salesforce.com/s/articleView?id=sf.security_restriction_rule.htm&language=en_US> | Restriction rules: how they filter record access already granted by sharing, and their documented operator and object limits. Referenced from search result summaries on 2026-08-25 rather than fetched directly; verify before designing around the limits. |
