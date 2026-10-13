# Permission sets, groups, and muting

This document explains how Salesforce grants access to users through permission
sets, permission set groups, and muting permission sets, and how those relate to
the older profile system. It is written for someone who has never designed a
Salesforce security model and needs to make decisions about one. Read it before
deciding how an org will grant access, before writing any permission set
metadata, and before running any query that claims to answer "who can see this
field". It is a reference about how the Salesforce platform works. It is not a
decision about how any project will use it.

**Basis:** built from 22 official Salesforce pages (help.salesforce.com,
developer.salesforce.com, and the Salesforce Admins blog at
admin.salesforce.com), all retrieved on 2026-08-25. Every page is listed with a
one-line description in the Sources section at the end. Where a fact came from a
search-result summary rather than a full page read, it is marked
**(snippet only)** so a later reader knows to re-check it.

---

## 1. The short version

If you read nothing else, read this.

- A **profile** is the one mandatory container every Salesforce user must have.
  A user has exactly one profile.
- A **permission set** is an add-on grant. A user can have many. Permission sets
  only ever grant. They never take away.
- A **permission set group** bundles permission sets together so you can assign
  one thing instead of ten.
- A **muting permission set** is the only way to subtract, and it subtracts only
  inside the one permission set group it belongs to.
- Salesforce **announced on 2023-01-16** that permissions would be removed from
  profiles in the Spring '26 release. Salesforce **cancelled that enforcement**,
  confirmed in a Knowledge article published **2026-06-06**. Profiles keep their
  permissions. Salesforce still recommends moving to permission sets.
- A **permission set deploy replaces the whole component.** Since **API version
  40.0**, any permission your file does not name is turned off in the target org.
  This is the single most dangerous fact on this page.

---

## 2. What a permission set is

A permission set is a named collection of grants that you assign to a user on
top of whatever their profile already gives them. Salesforce describes it as "a
set of permissions that's used to grant more access to one or more users without
changing their profile or reassigning profiles"
(<https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_permissionset.htm>,
snippet only).

Two properties matter more than any other:

1. **A user can hold many permission sets at once.** A user holds exactly one
   profile. This is why permission sets scale and profiles do not.
2. **Permission sets are additive only.** There is no "deny" checkbox. Setting a
   field permission to false in a permission set does not revoke anything; it
   simply means that permission set is not the thing granting it. If a profile
   or another permission set grants it, the user still has it.

### What a permission set can grant

Taken from the field list of the `PermissionSet` metadata type
(<https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm>):

| Metadata field | Plain English: what it grants |
| --- | --- |
| `objectPermissions` | Read, Create, Edit, Delete, View All Records, Modify All Records, View All Fields on an object |
| `fieldPermissions` | Whether a single field is readable and editable |
| `userPermissions` | System and app permissions, for example "Modify All Data" or "Run Reports" |
| `classAccesses` | Which Apex classes the user can execute |
| `pageAccesses` | Which Visualforce pages the user can open |
| `flowAccesses` | Which flows the user can run |
| `tabSettings` | Which tabs are visible |
| `applicationVisibilities` | Which apps are visible |
| `recordTypeVisibilities` | Which record types the user can pick |
| `customPermissions` | Custom permissions, which are named flags your own code and config check |
| `customMetadataTypeAccesses` | Access to custom metadata types |
| `customSettingAccesses` | Access to custom settings |
| `externalDataSourceAccesses` | Access to external data sources |
| `externalCredentialPrincipalAccesses` | Access to named credential principals |
| `emailRoutingAddressAccesses` | Access to email routing addresses |
| `agentAccesses` | Access to Agentforce agents |
| `ServicePresenceStatusAccesses` | Service presence statuses in Omni-Channel |
| `license` | The permission set license this permission set is tied to |
| `hasActivationRequired` | Marks the permission set as session-based (see section 9) |

### What a permission set cannot grant

The Salesforce Help page "Permission Set Considerations" names these limits
(<https://help.salesforce.com/s/articleView?id=platform.perm_sets_considerations.htm&language=en_US&type=5>):

- **A default app.** A permission set "can only specify whether apps are
  visible". It cannot say which app opens first. That is a profile setting.
- **Experience Cloud site membership through a group.** Salesforce states: "You
  can't use permission set groups to add membership to a site, only permission
  sets."
- **Apex trigger control.** "Triggers always fire on trigger events ...
  regardless of permission settings." Apex class access in a permission set only
  covers web service methods and Visualforce controller methods.

---

## 3. Profile versus permission set: the practical split

Salesforce's own guidance page, "Guidelines for Creating Permission Sets and
Permission Set Groups", gives a direct two-column split
(<https://help.salesforce.com/s/articleView?id=platform.perm_sets_best_practices.htm&language=en_US&type=5>):

> **Configure in permission sets:** Apex classes, connected app access, custom
> permissions, field permissions, object permissions, user permissions, tab
> settings, and Visualforce pages.
>
> **Configure in profiles:** Default apps, record types, IP ranges, login hours,
> and page layout assignments.

The Salesforce Admins blog post "The Salesforce Admin's Guide to Profiles and
Permissions", published 2026-03-16, says the same thing in narrative form
(<https://admin.salesforce.com/blog/2026/the-salesforce-admins-guide-to-profiles-and-permissions>):

> "Historically, profiles handled a lot of user access in Salesforce. But in the
> past few years, Salesforce has moved to a permission set led model where
> profiles provide baseline settings, and permission sets and permission set
> groups handle most user access."

That post also states plainly: "Every user must have a profile, and it defines
the baseline configuration for a user." There is no way to have a Salesforce
user with no profile.

---

## 4. What a profile must still hold, and a permission set cannot

This is the key practical constraint. It is what stops "just use permission sets
for everything" from being possible.

The table below was built by comparing the field list of the `Profile` metadata
type against the field list of the `PermissionSet` metadata type, both retrieved
on 2026-08-25
(<https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>
and
<https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm>),
and cross-checked against the two Salesforce guidance pages named in section 3.

| Setting | Profile metadata field | On a permission set? | Notes |
| --- | --- | --- | --- |
| **Page layout assignment** | `layoutAssignments` | No | The layout a user sees for an object, per record type. Profile only. |
| **Login hours** | `loginHours` | No | The hours of the week a user may log in. Profile only. |
| **Login IP ranges** | `loginIpRanges` | No | The IP addresses a user may log in from without a verification challenge. Profile only. |
| **Default record type** | `recordTypeVisibilities` with a `default` flag | Visibility yes, default no | A permission set can make a record type available. Only a profile can say which one is preselected. |
| **Default app** | `applicationVisibilities` with a `default` flag | Visibility yes, default no | "Permission sets ... can only specify whether apps are visible." (Permission Set Considerations) |
| **Password policies** | Separate metadata type `ProfilePasswordPolicy` | No | Profile password policies override the org-wide password policy for that profile's users. (snippet only) |
| **Session settings** | Separate metadata type `ProfileSessionSetting` | No | Session timeout, session security level, and similar, set per profile. (snippet only) |
| **Login flows** | `loginFlows` | No | A flow that runs at login. Profile only. |
| **Action overrides** | `profileActionOverrides` | No | Overrides for standard actions. Profile only. |
| **Category group visibility** | `categoryGroupVisibilities` | No | Data category visibility for knowledge. Profile only. |
| **User license** | `userLicense` | No | A profile is bound to one user license type. A permission set's `license` field is a permission set license, which is a different thing (see section 8). |
| **Tab visibility** | `tabVisibilities` | Yes, as `tabSettings` | Both can set it. The field is named differently on each type. |

### What I could not confirm

I did not find a single official Salesforce page that lists all of the above in
one place as "profile only". The table above is assembled from three sources and
a metadata field comparison. Treat it as strong evidence, not as a quotation.
Before relying on any one row for a real decision, check that row against the
current Metadata API Developer Guide for the API version you are on. Salesforce
adds fields to `PermissionSet` most releases, so a row that is true today can
stop being true.

---

## 5. Salesforce's stated direction on profiles

This section is the one most likely to be reported wrongly, because a lot of
community writing about it is out of date. Read the whole section before quoting
any part of it.

### 5.1 What was announced, and when

On **2023-01-16**, Salesforce published a post on its official Salesforce Admins
blog titled "Permissions Updates | Learn MOAR Spring '23". It announced "the end
of life (EOL) of permissions on profiles that will be the Spring '26 release"
(<https://admin.salesforce.com/blog/2023/permissions-updates-learn-moar-spring-23>).

The announcement said permissions would move off profiles and onto permission
sets, and named what would stay behind on the profile:

| Would stay on the profile | Would be permission-set only |
| --- | --- |
| Login hours and IP ranges | User permissions (system and app) |
| Default record types and apps | Object create, read, edit, delete permissions |
| Page layout assignments | Field-level security |
| | Tabs, record types, apps, connected app access, Apex classes, Visualforce pages, custom permissions |

### 5.2 What Salesforce has now committed to

**The enforcement was cancelled.** Salesforce Knowledge article 003834041,
titled "Permissions in Profiles Retirement Cancelled", published **2026-06-06**,
states:

> "This enforcement has now been cancelled based on customer feedback and
> remaining feature gaps."

(<https://help.salesforce.com/s/articleView?id=003834041&language=en_US&type=1>)

The same article says Salesforce still recommends "a permission set-led security
model for improved flexibility and scalability", and that Salesforce "continues
to invest in enhancements such as: Improved User management experience in Setup,
Permission Sets and Permission Set Groups, Summary views and admin usability
improvements."

The original 2023-01-16 blog post has been updated in place with an author's
note carrying the same message: "We've decided to no longer enforce the End of
Life of permissions on profiles for Spring '26."

### 5.3 Precisely what this does and does not mean

| Question | Answer as of 2026-08-25 | Source |
| --- | --- | --- |
| Will permissions be removed from profiles in Spring '26? | **No.** Enforcement cancelled. | Knowledge article 003834041, 2026-06-06 |
| Has Salesforce set a new date for removing permissions from profiles? | **No date has been announced.** The article names no replacement date. | Knowledge article 003834041 |
| Has Salesforce promised never to remove them? | **No such promise found.** The article says the enforcement is cancelled. It does not say the idea is permanently abandoned. This distinction matters and should not be smoothed over. | Absence of any statement in Knowledge article 003834041 |
| Does Salesforce still recommend permission sets over profiles? | **Yes, clearly and repeatedly.** | Knowledge article 003834041; Guidelines page; Admins blog 2026-03-16 |
| Is Salesforce still building new features for profiles? | **Unconfirmed.** The official article lists ongoing investment in permission sets, permission set groups, Setup, and summary views. It does not list profiles. Whether that means "no new profile features" is an inference, not a Salesforce statement. | Knowledge article 003834041 |

### 5.4 Community commentary, clearly labelled as such

Non-Salesforce sources report two extra details that I could **not** verify
against a Salesforce page. Do not repeat these as Salesforce statements.

- **A named spokesperson.** Community write-ups attribute the cancellation to
  Cheryl Feldman, a Senior Director of Product Management at Salesforce covering
  User Access. Her authorship of official Salesforce Admins blog posts on
  permissions is verifiable
  (<https://admin.salesforce.com/blog/author/cherylfeldman>), but I did not
  confirm a direct quotation from her about the cancellation on a Salesforce
  domain.
- **An adoption statistic.** Salesforce Ben, an independent community
  publication, reports that only 20.5% of organisations had fully transitioned
  to a permission-set-led model. I attempted to fetch
  <https://www.salesforceben.com/salesforce-backtracks-on-permission-retirement-in-profiles/>
  and received an HTTP 403 Forbidden response, so I could not read the article
  directly or check where the figure came from. **Treat this number as
  unverified community reporting, not as a Salesforce figure.**

### 5.5 What this means for a project deciding a model now

Salesforce's recommendation has not changed even though the deadline vanished.
The recommendation was never "do it or it will break"; it was "this scales and
profiles do not". Building a new org on a permission-set-led model is still the
right call, and it no longer has to be finished by a specific release. The
removal of the deadline is a reduction in urgency, not a reversal of direction.

---

## 6. The "Minimum Access - Salesforce" standard profile

Salesforce ships a standard profile named **Minimum Access - Salesforce**. The
Standard Profiles help page describes it as granting "the least privileges in
the Salesforce platform", covering only basic activity access, Chatter features,
and console functionality
(<https://help.salesforce.com/s/articleView?id=platform.standard_profiles.htm&language=en_US&type=5>).

### How Salesforce says to use it

From the Guidelines page
(<https://help.salesforce.com/s/articleView?id=platform.perm_sets_best_practices.htm&language=en_US&type=5>):

> "Assign users the Minimum Access - Salesforce profile, or a clone of it" and
> then use permission sets to grant only required permissions. Apply them "based
> on the tasks that they do rather than their job title."

The pattern is:

1. Give nearly every user the same profile: Minimum Access - Salesforce, or a
   clone of it if you need to change a default setting such as a page layout
   assignment.
2. Grant everything else through permission sets and permission set groups.

The clone exists for one reason: the profile still carries page layouts, login
hours, login IP ranges, default record type, and default app. If two groups of
users need different page layouts, they need different profiles, because there
is no other place to put that setting.

### A related profile that is often confused with it

Salesforce also ships **Minimum Access - API Only Integrations**, a separate
least-privilege profile intended for integration users, described as giving
API-only access with additional permissions granted through permission sets
(same Standard Profiles page). Do not use one where the other is meant. A human
assigned the API-only profile cannot use the user interface.

---

## 7. Permission set groups

### What they are

From the Permission Set Groups help page
(<https://help.salesforce.com/s/articleView?id=platform.perm_set_groups.htm&language=en_US&type=5>):

> "A permission set group streamlines permissions assignment and management. Use
> a permission set group to bundle permission sets together based on user job
> personas or roles."
>
> "Users assigned the permission set group receive the combined permissions of
> all the permission sets in the group."

The same page notes that "Updates in a permission set propagate to all
permission set groups that include the permission set". You change a permission
set once and every group containing it picks up the change.

### The calculated permission set

A permission set group does not evaluate its member permission sets live at the
moment a user does something. Salesforce **precalculates** a combined set of
permissions for the group and stores it. That stored result is what users
actually get.

This is why the group has a status, and why the status matters.

### The four statuses

From "Permission Set Group Status and Recalculation"
(<https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_status_recalc.htm&language=en_US&type=5>).
The page describes the status as indicating "whether the calculation and
resulting permissions in the group are up-to-date and available for the assigned
users."

| Status | Salesforce's description | What users get | Can you assign users? | Can you edit the group? |
| --- | --- | --- | --- | --- |
| **Updated** | "Combined permissions correctly reflect all permissions added to the group." | The current, correct permissions. | Yes | Yes |
| **Outdated** | "Changes are captured and system is updating the permission set group." | "Users assigned to the group don't yet have the updated permissions." | No | Yes |
| **Updating** | "The permission set group is recalculating because of recent changes to one or more of its permission sets." | "Users assigned to the group don't yet have the updated permissions." | No | No |
| **Failed** | "The permission set group recalculation failed." | The last successfully calculated permissions. The new ones never arrived. | No | Yes |

**The trap to hold in your head:** a metadata deploy that changes a permission
set inside a group can report complete success while the group's status sits at
Failed, and the users get the old permissions. Nothing in the deploy output
tells you. After deploying any permission set, check every group it belongs to.
Fix a Failed group with the **Recalculate** button on the group's detail page in
Setup.

### What makes recalculation slow

The same page lists these factors:

- "A large number of included permission sets in the permission set group"
- "Complex included permission sets"
- "The inclusion of permission sets without a required license"
- "A large number of permission and access setting changes being introduced at once"
- "A large number of users assigned to the permission set group"
- "Concurrent recalculations triggered by other processes"
- "Failures during the recalculation process"

Recalculation runs asynchronously and can take "from seconds to hours for large
or complicated updates" (snippet only, from the same help topic).

### Limits and considerations for groups

From "Permission Set Group Considerations"
(<https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_considerations.htm&language=en_US&type=5>):

| Item | Value or rule |
| --- | --- |
| Permission sets in one group | "You can add up to 100 permission sets to a permission set group." |
| Muting permission sets in one group | One. See section 8. |
| Session-based permission sets in a group | Do not require activation for users assigned via the group |
| Custom permission set changes | Recalculate immediately |
| Standard permission set changes | Recalculate daily |
| Experience Cloud site membership | Cannot be granted by a group, only by a permission set directly |
| Deleting a group | Remove all user assignments first. The member permission sets are not deleted. |
| Standard Salesforce groups | Cannot be deleted |
| Managed package groups | Require uninstalling the package to remove |

Salesforce also states a performance preference on that page: "For better
performance, we recommend assigning users permission set groups instead of many
individual permission sets", especially with large numbers of users.

---

## 8. Muting permission sets

### What they are

A muting permission set is the only mechanism in Salesforce that subtracts a
permission. It is a special kind of permission set attached to exactly one
permission set group. Anything switched on in the muting permission set is
switched **off** in that group's calculated result.

The Metadata API describes the mechanism as: "settings enabled by
MutingPermissionSet are turned off for the permission set group that it's a
component of"
(<https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_mutingpermissionset.htm>).

### It mutes. It does not deny.

This is the single most misunderstood thing about muting, and getting it wrong
produces a security model that does not do what its author thinks it does.

From the Muting Permission Sets help page
(<https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_muting.htm&language=en_US&type=5>):

> "When you mute a permission in a permission set group, the muting affects only
> users assigned to the permission set group, not users assigned directly to a
> permission set outside of the permission set group."

> "the muting permission set applies only to its related permission set group"

And the case that catches people:

> "a user is assigned a permission set group that has muted permissions. If the
> user is assigned the same permissions via a profile, permission set, or
> different permission set group, the user still has these permissions despite
> the muting permission set."

**In plain words:** muting is a subtraction inside one group's arithmetic. It is
not a global block. If the same permission arrives by any other route, the user
keeps it. There is no way in Salesforce to say "this user must never have this
permission, whatever else is assigned to them."

### What can be muted

The `MutingPermissionSet` metadata type inherits its fields from `PermissionSet`
and adds only a required `label` field. The Metadata API documentation
demonstrates muting these categories
(<https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_mutingpermissionset.htm>):

| Category | Metadata field |
| --- | --- |
| Object permissions | `objectPermissions` |
| Field permissions | `fieldPermissions` |
| User permissions | `userPermissions` |
| App visibility | `applicationVisibilities` |
| Apex class access | `classAccesses` |
| Visualforce page access | `pageAccesses` |
| Custom permissions | `customPermissions` |
| Record type visibility | `recordTypeVisibilities` |
| Tab settings | `tabSettings` |

The Muting Permission Sets help page summarises this as: you can mute "object,
field, and user permissions and other access settings."

### What cannot be muted

**I could not find an official Salesforce page that lists what cannot be muted.**
Both the Metadata API page and the "Mute a Permission in a Permission Set Group"
help page
(<https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_create_mute.htm&language=en_US&type=5>)
describe what you can do and say nothing about exclusions. Two things follow
from the structure rather than from a statement:

1. Anything that is a **profile-only setting** (page layout assignment, login
   hours, login IP ranges, default record type, default app) cannot be muted,
   because it was never in a permission set to begin with.
2. `MutingPermissionSet` inherits from `PermissionSet`, so a permission set
   field absent from the inheritance, such as `license` and
   `hasActivationRequired`, has nothing to mute.

Treat both as reasoned inference, not as documented fact. If you need certainty
about a specific permission, test it in a sandbox.

### Muting dependencies: the cascade

Muting one thing silently mutes others. From "Permission Set Group Muting
Dependencies"
(<https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_muting_dependencies.htm&language=en_US&type=5>):

| If you mute this object permission | These are muted too |
| --- | --- |
| Read | Create, Edit, Delete, View All Records, Modify All Records |
| Edit | Delete, Modify All Records |
| Delete | Modify All Records |
| View All Records | Modify All Records |

Object permissions can also cascade into user permissions. The documented
example: a permission set that includes "Activate Orders" requires Read and Edit
on Orders, so muting Edit on Orders disables the "Activate Orders" user
permission as a side effect. Similarly, muting "Activate Contracts" also mutes
"Delete Activated Contracts".

### The exception that catches people

> "If you mute the Modify All Data or View All Data user permissions, included
> object permissions aren't affected."

Muting these two very broad user permissions does **not** cascade down to
individual object access. If you want users in the group to lose object access,
you must explicitly name those object permissions in the muting permission set
as well. Muting "View All Data" alone and assuming the user can no longer see
everything is a real and easy mistake.

---

## 9. Permission set licenses versus permission sets

These two things have similar names and do completely different jobs.

| | User license | Permission set license | Permission set |
| --- | --- | --- | --- |
| What it is | The base entitlement a user is sold | An add-on entitlement that extends the base | A configuration that grants specific permissions |
| How many per user | One | Many | Many |
| Bought or built? | Bought from Salesforce | Bought from Salesforce | Built by an admin |
| What it does | Sets the ceiling of what is possible | Raises that ceiling for specific features | Grants a subset of what the ceiling allows |

From the Permission Set Licenses help page
(<https://help.salesforce.com/s/articleView?id=platform.users_permissionset_licenses_overview.htm&language=en_US&type=5>):

> "Permission set licenses extend the functionality of user licenses. With
> permission set licenses, you can assign more permissions to users than their
> user license supports."

> "Permission sets extend users' functional access without changing their
> profiles."

### How licensing constrains what can be granted

Three rules, all from official pages:

1. **The user must be entitled to the permission.** From the Guidelines page:
   "The user must have a user license or permission set license that supports
   the permission."
2. **Assignment fails without the license.** From the Permission Set Licenses
   page: "If you assign users permissions via a permission set and they don't
   have the required licenses, you receive an assignment error."
3. **Both pieces are needed.** To use a licensed feature, a user needs the
   permission set license **and** a permission set that actually grants the
   feature permission (snippet only, from the Permission Set Licenses overview).

### Two side effects worth knowing

- A permission set can be **tied to a license** through its `license` metadata
  field. Salesforce's "Permission Set Considerations" page notes that permission
  sets "without license restrictions" perform less efficiently than those tied to
  a user license or permission set license.
- Including a permission set that requires a license the user does not have,
  inside a permission set group, is listed by Salesforce as a cause of slow
  permission set group recalculation.

---

## 10. Naming and design patterns

### What Salesforce actually recommends

The Guidelines page
(<https://help.salesforce.com/s/articleView?id=platform.perm_sets_best_practices.htm&language=en_US&type=5>)
is short and direct:

> "Create permission sets that include all permissions necessary for a job or
> task. Then bundle these permission sets into permission set groups that
> correspond to your user personas."

> "If different personas perform some of the same tasks, you can reuse those
> permission sets in different permission set groups."

> "Use a naming structure that clearly identifies the contents of each permission
> set."

> To remove specific permissions from a group without changing the underlying
> sets, "create a muting permission set. You don't need to create nearly
> identical permission sets with only those few permissions removed."

### Per feature or per persona? Salesforce says both, at different layers

This is often argued as an either/or. Salesforce's guidance is that it is not
one:

- **Permission sets are per task or feature.** Small, focused, reusable.
- **Permission set groups are per persona.** They assemble the task-level
  permission sets into the shape of a real job.

So a "Case Escalation" permission set is reused by the "Support Agent" group and
the "Support Manager" group, and the manager group also carries "Case Reporting"
and mutes one thing the agent set grants.

Assigning by task rather than job title is stated explicitly: apply permission
sets "based on the tasks that they do rather than their job title."

### How many is too many

Salesforce gives limits rather than a target number.

| Limit | Value | Source |
| --- | --- | --- |
| Permission sets in one permission set group | 100 | Permission Set Group Considerations |
| Muting permission sets per group | 1 | Muting Permission Sets help page |
| Permission sets per org | Varies by edition. Professional Edition is 10. | help.salesforce.com article 000390856 **(snippet only, not verified by full page read)** |
| Permission sets per user | **Not found.** I did not find a documented maximum. | Not confirmed |

Salesforce's stated performance preference is relevant to "how many is too
many": "For better performance, we recommend assigning users permission set
groups instead of many individual permission sets." So the answer to "too many"
is less about a hard number and more about the shape: many small permission sets
is fine, many **direct assignments** to a single user is what degrades.

The Permission Set Considerations page also warns that performance degrades when
"you attempt to edit a permission set with many assigned users", which is an
argument for assigning through groups rather than directly.

### Two things that make small permission sets safer, not just tidier

Both follow from the deploy behaviour in section 11:

- A bad deploy of a small permission set destroys a small number of grants. A
  bad deploy of one giant permission set can destroy hundreds.
- Several parallel work streams editing one enormous permission set XML file
  produce merge conflicts in exactly the file where a hand-merge is most
  dangerous.

---

## 11. Session-based permission sets and expiration

### Session-based permission sets

A session-based permission set is one that only takes effect once something
activates it for the user's current session.

From the Session-Based Permission Sets help page
(<https://help.salesforce.com/s/articleView?id=platform.perm_sets_session_use.htm&language=en_US&type=5>):

> "A session-based permission set applies to a specific user session to grant
> someone functional access to permissions."

> "Session-based permission sets are valid only for the session on which they're
> enabled."

| Aspect | Detail |
| --- | --- |
| How it is marked | The **Session Activation Required** setting on the permission set. In metadata this is `hasActivationRequired` on `PermissionSet`. |
| How it is activated | A Flow core action ("Activate Session-Based Permission Set"), or inserting a record into the `SessionPermSetActivation` object via REST or SOAP API. |
| Permission needed to activate via API | "Manage Session Permission Set Activation" |
| When it ends | When the session ends or the token expires. It must be activated again. |
| Documented limitation | "Session-based permission sets don't support asynchronous processes, such as deploying custom metadata." |
| Inside a permission set group | Session-based permission sets in a group "don't require activation for assigned users" (Permission Set Group Considerations). This is a meaningful difference: putting a session-based permission set in a group removes the session gate. |

**Generally available?** The help documentation carries no beta or pilot label,
which normally indicates general availability, and there is a full Trailhead
module for it. However, **I did not find a release note naming the release in
which session-based permission sets became generally available**, so I cannot
state a date. Do not quote one.

### Permission set expiration (time-based access)

You can set an expiration date on a permission set assignment or a permission
set group assignment, after which the user loses the access automatically.

From "Set Assignment Expiration Details for Users"
(<https://help.salesforce.com/s/articleView?id=platform.permissions_assign_expire_how.htm&language=en_US&type=5>):

| Aspect | Detail |
| --- | --- |
| Generally available? | **Yes.** Available in Essentials, Contact Manager, Professional, Group, Enterprise, Performance, Unlimited, Developer, and Database.com editions. No beta label. |
| Default | Assignments do not expire unless you set a date. |
| Must be switched on first | Enable "Permission Set & Permission Set Group Assignments with Expiration Dates" in User Management Settings. |
| Exact expiry moment | "Assignments expire at 11:59 PM on the date and in the time zone that you specify." |
| Cannot be used with | Permission sets containing "Assign Permission Set", "Manage Profiles", "Manage Users", or "Permission Sets". Salesforce blocks expiration on administrative permission sets. |

**Release history (snippet only):** the related release update "Enable
Permission Set Expiration and Enhanced UI" was first available in Summer '22 and
enforced by Salesforce in Winter '23. An earlier beta of expiration dates for
permission set groups appeared before that. I did not read these release notes
in full, so treat the release names as indicative.

---

## 12. Deployment behaviour: the destructive part

This is the fact that costs people real permissions.

### The exact Salesforce wording

From the `PermissionSet` metadata type documentation, in the description of the
`userPermissions` field
(<https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm>):

> **"In API Version 40.0 and later, if a permission isn't specified for a
> deployment, it's disabled."**

API version 40.0 shipped with the Summer '17 release.

### What that means in practice

A permission set deploy is a **whole-component replace**, not a merge. Whatever
your local XML file contains becomes the entire content of that permission set
in the target org. Every grant the org held that your file does not name is
turned off.

So a permission set file that is missing 300 field permissions, for any reason,
will silently remove 300 field permissions when deployed. The deploy reports
success.

### Profiles behave the opposite way

From the `Profile` metadata type documentation
(<https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>):

> "We designed Profile metadata deployment to overlay the existing Profile
> settings in a target org. For example, if you disable permissions for a
> profile, the newly disabled permission information isn't exported."

And a second behaviour worth knowing:

> "If you deploy a profile that doesn't exist in the target org and don't specify
> any permissions or settings, then the resulting profile contains all
> permissions and settings in the standard Minimum Access - Salesforce profile."

| | Permission set deploy | Profile deploy |
| --- | --- | --- |
| Model | Replace the whole component | Overlay onto what is there |
| Omitting a permission | Turns it off in the org | Changes nothing |
| Can a diff show a revocation? | Yes, and it is the only warning you get | No. Removing a line from a profile file revokes nothing, so a profile diff cannot show removals. |
| Risk | Silent mass revocation | Silent failure to revoke |

Neither is safe by accident. They are unsafe in opposite directions.

### What standard deploy checks will not catch

`sf project deploy validate` and `sf project deploy preview` both operate at
whole-component level. A permission set file missing hundreds of grants is a
perfectly valid component, so both commands pass it and the deploy then removes
those grants. Neither command compares the file's contents against what the org
currently holds. Any safety here has to come from a comparison you run yourself
before deploying.

---

## 13. How to audit who has what

### The objects

| Object | What it holds | API version |
| --- | --- | --- |
| `PermissionSet` | One row per permission set. Also one row per **profile**, because every profile has a hidden underlying permission set. The `IsOwnedByProfile` field tells the two apart. `PermissionsXxx` fields hold the user permissions. | Long-standing |
| `PermissionSetAssignment` | The link between a user and a permission set or permission set group. Key fields: `AssigneeId`, `PermissionSetId`, `PermissionSetGroupId`, `ExpirationDate`, `IsActive`. **(field list is snippet only, not read from the full object reference page)** | Long-standing |
| `ObjectPermissions` | Object-level access for one parent permission set. "Represents the enabled object permissions for the parent PermissionSet." Key fields: `ParentId`, `SobjectType`, `PermissionsRead`, `PermissionsCreate`, `PermissionsEdit`, `PermissionsDelete`, `PermissionsViewAllRecords`, `PermissionsModifyAllRecords`. | Long-standing |
| `FieldPermissions` | Field-level security for one parent permission set. Key fields: `ParentId`, `SobjectType`, `Field`, `PermissionsRead`, `PermissionsEdit`. | Long-standing |
| `SetupEntityAccess` | Access to setup entities such as Apex classes, Visualforce pages, custom permissions, connected apps, and tab sets. "Represents the enabled setup entity access settings (such as for Apex classes) for the parent PermissionSet." Key fields: `ParentId`, `SetupEntityId`, `SetupEntityType`. | 25.0 and later |
| `PermissionSetGroup` | One row per permission set group. The `Status` field carries Updated, Outdated, Updating, or Failed. | 45.0 and later |
| `PermissionSetGroupComponent` | "A junction object that relates the PermissionSetGroup and PermissionSet objects via their respective IDs and enables permission set group recalculation to determine the aggregated permissions for the group." | 45.0 and later |
| `SessionPermSetActivation` | Records that a session-based permission set is active for a session. Insert a row to activate. | See section 11 |

### The trap in every permission query

**Every profile has a hidden permission set.** Salesforce's own developer blog
states: "For every profile, there is one underlying permission set. In the setup
user interface, you only see the profile but in the API, you can see both the
profile and the underlying permission set."
(<https://developer.salesforce.com/blogs/engineering/2012/06/using-soql-to-determine-your-users-permissions-2>,
snippet only)

This means:

- A query over `ObjectPermissions` or `FieldPermissions` with no filter returns
  **profile grants and permission set grants mixed together**, with nothing
  visually separating them.
- The fix is `PermissionSet.IsOwnedByProfile`. Filter it to `false` to see only
  real permission sets, or to `true` to see only profile grants.
- This behaviour is also the reason a `PermissionSetAssignment` query returns
  results for permissions a user holds through their profile. The Salesforce
  developer blog notes that such queries "will return any users with the two
  permissions, whether they have the permissions on their profile or were
  assigned them through a permission set"
  (<https://developer.salesforce.com/blogs/2021/05/boost-security-by-auditing-your-privileged-users-with-soql>).
  That is usually what you want for a security audit, and usually not what you
  want when reviewing a permission set's own contents.

### Worked queries from Salesforce's own documentation

Find every active user with administrator-level permissions
(<https://developer.salesforce.com/blogs/2021/05/boost-security-by-auditing-your-privileged-users-with-soql>):

```sql
SELECT Assignee.Id, Assignee.Username, Assignee.Name
FROM PermissionSetAssignment
WHERE PermissionSet.PermissionsCustomizeApplication = true
  AND PermissionSet.PermissionsModifyAllData = true
  AND Assignee.IsActive = true
```

Find every active user with any of four privileged permissions (same source):

```sql
SELECT Assignee.Id, Assignee.Username, Assignee.Name,
       PermissionSet.PermissionsModifyAllData,
       PermissionSet.PermissionsCustomizeApplication,
       PermissionSet.PermissionsManageUsers,
       PermissionSet.PermissionsViewAllData
FROM PermissionSetAssignment
WHERE (PermissionSet.PermissionsModifyAllData = true
    OR PermissionSet.PermissionsCustomizeApplication = true
    OR PermissionSet.PermissionsManageUsers = true
    OR PermissionSet.PermissionsViewAllData = true)
  AND Assignee.IsActive = true
```

Find every active user who can see or change all Opportunity records, through
either a profile or a permission set (from Salesforce Help, snippet only):

```sql
SELECT Assignee.Id, Assignee.Username, Assignee.Name
FROM PermissionSetAssignment
WHERE PermissionSetId IN (
    SELECT ParentId FROM ObjectPermissions
    WHERE (PermissionsViewAllRecords = true OR PermissionsModifyAllRecords = true)
      AND SobjectType = 'Opportunity')
  AND Assignee.IsActive = true
```

Read a permission set's field permissions as a nested query (from Salesforce
Help, snippet only):

```sql
SELECT Label, PermissionsTransferAnyLead,
       (SELECT SobjectType, Field, PermissionsRead FROM FieldPerms)
FROM PermissionSet
```

### Checking that a group actually applied

Because a permission set group's status can be Failed while a deploy reports
success, this check is worth running after every permission set deploy:

```sql
SELECT Id, DeveloperName, Status FROM PermissionSetGroup WHERE Status != 'Updated'
```

Anything returned is a group whose users are not getting the permissions the
metadata says they should have.

---

## 14. User Access Policies

A newer tool worth knowing about when designing assignment, rather than
permissions themselves.

From the User Access Policies help page
(<https://help.salesforce.com/s/articleView?id=platform.perm_user_access_policies.htm&language=en_US&type=5>):

> "With user access policies, you define aggregated access for your users in a
> single operation."

| Aspect | Detail |
| --- | --- |
| Status | Generally available. No beta label. |
| Editions | Enterprise and Unlimited |
| What it can assign | "your users' assignments to permission set licenses, permission sets, permission set groups, package licenses, queues, and public groups" |
| Two modes | A one-off bulk access change, or an active policy that automatically grants or revokes access when a user is created or updated |

This is the supported answer to "how do new users get their permission sets
without an admin doing it by hand". It was in beta earlier and reached general
availability; **I did not verify the exact GA release name**, so do not quote
one.

---

## 15. What I could not confirm

Listed together so a later reader does not mistake inference for fact.

| Question | Status |
| --- | --- |
| Has Salesforce ruled out ever retiring permissions on profiles? | No statement found either way. The Knowledge article cancels the Spring '26 enforcement and sets no new date. |
| Has Salesforce said it will make no further improvements to profiles? | Not stated on a Salesforce page. Community sources say so. The official article lists ongoing investment in permission sets and Setup, and does not mention profiles, which is suggestive but not a statement. |
| The 20.5% adoption figure | Community reporting from Salesforce Ben. The page returned HTTP 403 and could not be read. Unverified. |
| A definitive list of what cannot be muted | Not found on any Salesforce page. Section 8 gives reasoned inference only. |
| Maximum permission sets assignable to one user | Not found. |
| Maximum permission sets per org, by edition | Only a snippet naming Professional Edition at 10. Not verified by a full page read. |
| GA release for session-based permission sets | Not found. |
| GA release for User Access Policies | Not found. |
| A single official page listing all profile-only settings | Not found. The table in section 4 is assembled from a metadata field comparison plus three guidance pages. |

---

## Sources

All retrieved 2026-08-25.

**Official Salesforce Knowledge and Help**

1. <https://help.salesforce.com/s/articleView?id=003834041&language=en_US&type=1> - "Permissions in Profiles Retirement Cancelled", published 2026-06-06. The authoritative statement that the Spring '26 enforcement is cancelled.
2. <https://help.salesforce.com/s/articleView?id=platform.perm_sets_best_practices.htm&language=en_US&type=5> - "Guidelines for Creating Permission Sets and Permission Set Groups". The profile-versus-permission-set split and the naming and design advice.
3. <https://help.salesforce.com/s/articleView?id=platform.perm_sets_considerations.htm&language=en_US&type=5> - "Permission Set Considerations". What a permission set cannot do, and performance notes.
4. <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups.htm&language=en_US&type=5> - "Permission Set Groups". What a group is and how combined permissions work.
5. <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_status_recalc.htm&language=en_US&type=5> - "Permission Set Group Status and Recalculation". The four statuses and what slows recalculation.
6. <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_considerations.htm&language=en_US&type=5> - "Permission Set Group Considerations". The 100-permission-set limit and deletion rules.
7. <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_muting.htm&language=en_US&type=5> - "Muting Permission Sets". That muting is group-scoped and not a global deny.
8. <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_muting_dependencies.htm&language=en_US&type=5> - "Permission Set Group Muting Dependencies". The cascade rules and the Modify All Data exception.
9. <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_create_mute.htm&language=en_US&type=5> - "Mute a Permission in a Permission Set Group". The procedure, and confirmation that muting only affects group members.
10. <https://help.salesforce.com/s/articleView?id=platform.standard_profiles.htm&language=en_US&type=5> - "Standard Profiles". The description of Minimum Access - Salesforce and Minimum Access - API Only Integrations.
11. <https://help.salesforce.com/s/articleView?id=platform.users_permissionset_licenses_overview.htm&language=en_US&type=5> - "Permission Set Licenses". How licenses constrain what a permission set can grant.
12. <https://help.salesforce.com/s/articleView?id=platform.perm_sets_session_use.htm&language=en_US&type=5> - "Session-Based Permission Sets". Activation, session scope, and the asynchronous-process limitation.
13. <https://help.salesforce.com/s/articleView?id=platform.permissions_assign_expire_how.htm&language=en_US&type=5> - "Set Assignment Expiration Details for Users". Expiration availability, the 11:59 PM rule, and the administrative-permission exclusions.
14. <https://help.salesforce.com/s/articleView?id=platform.perm_user_access_policies.htm&language=en_US&type=5> - "User Access Policies". Automating assignment of permission sets and groups.
15. <https://help.salesforce.com/s/articleView?id=platform.users_profiles_password_policies.htm&language=en_US&type=5> - "View and Edit Password Policies in Profiles". Profile-level password policy. **(snippet only)**
16. <https://help.salesforce.com/s/articleView?id=platform.users_profiles_session.htm&language=en_US&type=5> - "Edit Session Settings in Profiles". Profile-level session settings. **(snippet only)**
17. <https://help.salesforce.com/s/articleView?id=000390856&language=en_US&type=1> - "Increase Number of Permission Sets per Organization". Per-edition permission set limits. **(snippet only)**
18. <https://help.salesforce.com/s/articleView?language=en_US&id=platform.migrate_profiles.htm&type=5> - "Migrate from Profiles to Permission Sets". Salesforce's migration guidance. **(snippet only; the page would not render for direct retrieval)**

**Official Salesforce developer documentation**

19. <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm> - `PermissionSet` Metadata API type. The full field list and the API 40.0 deploy quotation.
20. <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm> - `Profile` Metadata API type. The full field list and the overlay deploy behaviour.
21. <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_mutingpermissionset.htm> - `MutingPermissionSet` Metadata API type. What a muting permission set inherits and what it turns off.
22. <https://developer.salesforce.com/blogs/2021/05/boost-security-by-auditing-your-privileged-users-with-soql> - Salesforce Developers blog, May 2021. The privileged-user audit queries, and the note that they cover profile and permission set grants alike.
23. <https://developer.salesforce.com/blogs/engineering/2012/06/using-soql-to-determine-your-users-permissions-2> - Salesforce Developers blog, June 2012. That every profile has one underlying permission set, and the `IsOwnedByProfile` field. **(snippet only)**
24. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_setupentityaccess.htm> - `SetupEntityAccess` object reference. What it holds and its API version. **(snippet only)**
25. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_permissionsetgroupcomponent.htm> - `PermissionSetGroupComponent` object reference. The junction object description and its API version. **(snippet only)**
26. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_permissionsetassignment.htm> - `PermissionSetAssignment` object reference. **(snippet only)**
27. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_objectpermissions.htm> - `ObjectPermissions` object reference. **(snippet only)**
28. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_fieldpermissions.htm> - `FieldPermissions` object reference. **(snippet only)**

**Official Salesforce Admins blog**

29. <https://admin.salesforce.com/blog/2023/permissions-updates-learn-moar-spring-23> - "Permissions Updates, Learn MOAR Spring '23", published 2023-01-16. The original end-of-life announcement targeting Spring '26, and the later author's note withdrawing it.
30. <https://admin.salesforce.com/blog/2026/the-salesforce-admins-guide-to-profiles-and-permissions> - "The Salesforce Admin's Guide to Profiles and Permissions" by Kate Lessard, published 2026-03-16. The permission-set-led model described in narrative form.
31. <https://admin.salesforce.com/blog/author/cherylfeldman> - Author page confirming Cheryl Feldman writes Salesforce's official permissions posts. Used only to check the attribution in section 5.4.

**Community source, not official, could not be read**

32. <https://www.salesforceben.com/salesforce-backtracks-on-permission-retirement-in-profiles/> - Salesforce Ben, independent publication. Reported source of the 20.5% adoption figure. Returned HTTP 403 Forbidden on 2026-08-25 and was not read. Cited here only so a later reader knows the figure's origin and that it is unverified.
