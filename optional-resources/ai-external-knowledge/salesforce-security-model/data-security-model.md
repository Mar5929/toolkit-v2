# The Salesforce data security model

This document explains, end to end, how Salesforce decides whether a given person is allowed to see or change a given piece of data. It covers the four layers of the model, what each layer controls, how the layers combine, and what makes access recalculate. Read it if you are designing, reviewing, or merging Salesforce security settings and you need the whole picture in one place rather than in thirty help articles. It assumes no prior Salesforce knowledge and spells out every term the first time it appears.

**Basis:** built from 30 official Salesforce pages (help.salesforce.com, developer.salesforce.com, architect.salesforce.com, and trailhead.salesforce.com), all retrieved on 2026-08-25. Every URL is listed in the Sources section at the end, with one line saying what it covers.

---

## 1. The short version

Salesforce controls data access in four layers. Each layer answers a different question.

| Layer | The question it answers | The main tools |
| --- | --- | --- |
| Organization | Who is allowed to log in at all, from where, when, and with what proof of identity? | Password policies, login hours, login IP ranges, trusted IP ranges, multi-factor authentication, single sign-on, session settings |
| Object | What **types** of records can this person work with? | Profiles, permission sets, permission set groups |
| Field | Which **columns** on those records can this person see or change? | Field permissions (also called field-level security) on profiles and permission sets |
| Record | Which **individual rows** can this person see or change? | Organization-wide defaults, role hierarchy, sharing rules, manual sharing, and several more |

Salesforce's own help page "Control Who Sees What" describes the object, field, and record layers in exactly this order and defines them like this:

- Object level: "Object-level security, or object permissions, provide the bluntest way to control data access. You can prevent a user from seeing, creating, editing, or deleting any instance of a particular object type."
- Field level: "Field-level security, or field permissions, control whether a user can see, edit, and delete the value for a particular field on an object."
- Record level: "Record-level security lets you give users access to some object records, but not others."

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_data_access.htm&language=en_US>

Two terms used throughout:

- An **object** is a type of record. It is like a table in a database. "Account" and "Case" are objects.
- A **field** is one piece of information on a record. It is like a column in a table. "Phone" and "Amount" are fields.

Source for that comparison: <https://developer.salesforce.com/blogs/developer-relations/2017/04/salesforce-data-security-model-explained-visually>

### A note on "order of evaluation"

Salesforce documents these as **layers**, and the training material presents them in the order organization, object, field, record. Trailhead frames the goal as "combining security controls at different levels" and stresses that the restrictions apply "regardless of how users get to it," including through the application programming interface (API), which is the way other systems talk to Salesforce without a browser.

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_overview>

**What I could not confirm:** I found no official Salesforce page stating a strict internal runtime order in which the four checks are executed (for example "object permission is checked first, then record access"). Practically the layers behave as an AND: you need all of them. Treat any claim about a precise internal execution order as unverified.

---

## 2. Layer one: organization level

This layer is about who gets in the front door.

### 2.1 Users and profiles

"Every Salesforce user is identified by a username, a password, and a single profile." Users are deactivated rather than deleted.

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_org>

A **profile** is a required container assigned to exactly one user at a time. It carries object permissions, field permissions, page layout assignments, login IP ranges, and login hours. Every user must have one.

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects>

### 2.2 Password policies

Administrators configure password rules including minimum length, complexity requirements (whether alphabetic, numeric, uppercase, lowercase, and special characters are required), how many days a password stays valid, and how many failed login attempts trigger a lockout.

Profile-level password policies override the organization-wide settings.

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_org>

### 2.3 Login hours

"For each profile, you can specify the hours when users can log in." A user who is already logged in when their hours end can still view the page they are on but cannot take any further action.

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_org>

In the Metadata API (the programmatic interface used to move configuration between Salesforce orgs), login hours are stored on the profile as `ProfileLoginHours`, with a start and end element per weekday (`mondayStart`, `mondayEnd`, and so on). Values are expressed as minutes since midnight and must be divisible by 60. To remove login hour restrictions from a profile that previously had them, you must explicitly include an empty `loginHours` tag with no start or end times. Leaving the tag out entirely does nothing.

Source: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>

### 2.4 Login IP ranges versus trusted IP ranges

These two are easy to confuse and they behave differently. An **IP range** is a block of network addresses, which in practice usually means "the office network" or "the company virtual private network".

| Setting | Where it is set | What happens to someone outside the range |
| --- | --- | --- |
| Login IP ranges | On a profile | Login is **denied**. There is no way around it. |
| Trusted IP ranges | Org-wide, on the Network Access page in Setup | Login is **allowed** after an identity challenge, usually a code sent to the user's phone or email. |

So trusted IP ranges are a convenience feature that removes a challenge for people inside the range. Login IP ranges on a profile are the actual lock.

Profile login IP ranges are normally enforced only at login. There is a session setting, "Enforce login IP ranges on every request", that makes them apply to every page request including requests from client applications. That setting affects only profiles that have login IP restrictions.

Sources: <https://help.salesforce.com/s/articleView?id=platform.login_ip_ranges.htm&language=en_US&type=5> and <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_org>

**Honesty note:** the login IP ranges help page above is a JavaScript application that would not render for automated retrieval on 2026-08-25. The wording above comes from Salesforce's own search index summary of that page plus the Trailhead unit, which did render. The distinction itself is stated in both.

In the Metadata API, profile login IP ranges are `ProfileLoginIpRange` with required `startAddress` and `endAddress` elements. A `description` element is available in API version 31.0 and later.

Source: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>

### 2.5 Multi-factor authentication

**Multi-factor authentication (MFA)** means proving who you are with more than one kind of evidence. Salesforce puts it this way: "One factor is something users know. For Salesforce logins, that's a username and password combination. Other factors are verification methods that a user has in their possession, such as a mobile device with an authenticator app installed or a physical security key."

MFA is not optional. "As part of the Salesforce terms of service, all customers must use MFA for user interface logins." Salesforce Well-Architected repeats this: "Salesforce requires MFA for all UI-based user logins."

Supported verification methods:

| Method | What it is |
| --- | --- |
| Salesforce Authenticator | Salesforce's own mobile app, approves by push notification |
| Third-party authenticator apps | Time-based one-time password apps such as Google Authenticator, Microsoft Authenticator, Authy |
| Security keys | Physical tokens compatible with FIDO U2F or FIDO2 WebAuthn |
| Built-in authenticators | Device-level biometrics such as Touch ID, Face ID, or Windows Hello |

MFA is switched on in Setup by selecting "Require multi-factor authentication (MFA) for all direct UI logins to your Salesforce org". Under Session Settings, in the Session Security Levels area, Multi-Factor Authentication should sit in the High Assurance category.

Sources: <https://trailhead.salesforce.com/content/learn/modules/identity_login/identity_login_2fa> and <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

**What I could not confirm:** the exact calendar date on which the MFA contractual requirement took effect. The Trailhead unit states the requirement but names no date.

### 2.6 Single sign-on

**Single sign-on (SSO)** lets a person log in once to a central identity system and then reach Salesforce without entering a Salesforce password. Salesforce supports inbound SSO configuration alongside MFA and My Domain (a custom login URL for the org).

Source: <https://trailhead.salesforce.com/content/learn/modules/identity_login>

### 2.7 The Well-Architected framing

Salesforce's Well-Architected guidance splits security into three areas rather than four layers:

1. Organizational security: "safeguards systems from unauthorized access by ensuring only validated, authorized users can access a system, and only necessary features and data"
2. Session security: "the practice of configuring your system to prevent unauthorized access and data breaches by thwarting session interference or hijacking"
3. Data security: "the practice of protecting your data from unauthorized access, corruption, or unintended deletion"

Two design principles from the same page are worth carrying into any design review:

- "Follow the principle of least privilege (PoLP) by assigning users only the necessary permissions for their tasks."
- "Secure Salesforce solutions use individuals for authentication, and personas for authorization." In plain words: one login per real human, and grant permissions by job role rather than by person.

It also splits the tooling cleanly: "Permission sets and permission set groups govern what metadata users can access and what they can do with that metadata" while "Use OWDs and built-in sharing tools to configure access for Salesforce data."

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

---

## 3. Layer two: object level

This layer decides which **types** of record a person can touch at all.

### 3.1 The basic four permissions

| Permission | What it allows |
| --- | --- |
| Read | View records of this object |
| Create | Make new records of this object |
| Edit | Change existing records of this object |
| Delete | Remove records of this object |

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects>

In the Metadata API these are `allowRead`, `allowCreate`, `allowEdit`, and `allowDelete` inside `PermissionSetObjectPermissions` and `ProfileObjectPermissions`.

Sources: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm> and <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>

### 3.2 The sharing-bypass permissions

These are the permissions that skip the record layer entirely. Knowing which of them are object-scoped and which are org-scoped is one of the most load-bearing distinctions in the whole model.

| Permission | Scope | What it does | Metadata name |
| --- | --- | --- | --- |
| View All Records (shown in the user interface as "View All") | One named object | Read every record of that object, ignoring all sharing settings | `viewAllRecords` |
| Modify All Records (shown as "Modify All") | One named object | Read, edit, and delete every record of that object, ignoring all sharing settings | `modifyAllRecords` |
| View All Data | The whole org | Read every record of every object | System permission on profile or permission set |
| Modify All Data | The whole org | Read, edit, and delete every record of every object | System permission on profile or permission set |
| View All Fields | One named object | See all fields and field data on that object | `viewAllFields` |
| View All Fields (Global) | The whole org | See all fields on all objects. Available **only** for the Platform Integration User. | Not documented in the pages read |

Salesforce describes the intent split: View All Records and Modify All Records are "intended for users managing particular object types," while View All Data and Modify All Data are for organization administrators doing "data cleansing, deduplication, mass deletion, mass transferring, and managing record approvals."

The critical caveat, quoted directly: "View All Data, Modify All Data, and View All Records or Modify All Records ... don't override field-level security." A user with Modify All Data still cannot see a field they have no field permission for. They must have the field permission, or the View All Fields object permission.

These permissions are not available for ideas, price books, article types, and products. External users cannot be granted them.

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.users_profiles_view_all_mod_all.htm&language=en_US>

Enabling any of View All Data, Modify All Data, View All Records, Modify All Records, or View All Fields automatically enables the permissions those depend on.

Source: <https://help.salesforce.com/s/articleView?language=en_US&id=sf.users_profiles_view_all_mod_all.htm&type=5>

Two related permissions on the same page:

- **View All Users**: read access to all user records in the org. Useful when the org-wide default for the User object is Private.
- **View All Lookup Record Names**: see record names in lookup and system fields across list views and detail pages.

### 3.3 View All Fields: which release

`viewAllFields` is "Available in API version 63.0 and later" on both `PermissionSetObjectPermissions` and `ProfileObjectPermissions`. API version 63.0 is the Spring '25 release. The matching Trailhead unit sits in the Spring '25 administrator certification maintenance module.

It "grants assignees access to all fields and field data for a specific object", applies to "all standard and custom objects that support field permissions", and users automatically get access to any new fields created later on that object. It is enabled per object on the Object Settings page inside a permission set.

Sources: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm>, <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>, and <https://trailhead.salesforce.com/content/learn/modules/administrator-certification-maintenance-spring-25/get-hands-on-with-the-view-all-fields-permission>

### 3.4 Profiles, permission sets, and permission set groups

| Container | How many per user | What it holds |
| --- | --- | --- |
| Profile | Exactly one, and it is required | Object permissions, field permissions, user permissions, plus page layout assignments, login IP ranges, and login hours |
| Permission set | Any number | Object, field, and user permissions |
| Permission set group | Any number | A bundle of permission sets, assigned as one unit |

Permission sets can be reused across different permission set groups. Salesforce guidance treats permission sets as the primary way to grant access, with the profile acting as a thin baseline, but "assigning each user a profile is still compulsory, as this is the place where you configure other things like page layout assignments or login IP restrictions."

Sources: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects> and <https://developer.salesforce.com/blogs/developer-relations/2017/04/salesforce-data-security-model-explained-visually>

In API version 50.0 and later, editing standard objects on standard profiles is disabled.

Source: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>

### 3.5 Permissions are additive: the union wins

This is the single rule that catches people out most often.

A user's permissions are the **union** of their profile plus every permission set plus every permission set group they hold. Nothing in that set denies anything. If any one of them grants Edit on Account, the user has Edit on Account.

Trailhead states the consequence plainly: to take access away, you must "remove it from the user's base profile and from any permission sets the user may have." Adding a restrictive permission set does not work, because there is no such thing.

Sources: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects> and <https://developer.salesforce.com/blogs/developer-relations/2017/04/salesforce-data-security-model-explained-visually>

### 3.6 The two exceptions that do subtract

There are exactly two mechanisms in Salesforce that take access away rather than add it.

**Muting permission sets.** A muting permission set lets you "customize a permission set group by disabling (muting) selected permissions in it". Rules that matter:

- You can have **at most one** muting permission set per permission set group.
- You can mute object permissions, field permissions, user permissions, and other access settings.
- The muting affects **only** users assigned to that permission set group. Someone assigned the underlying permission set directly is unaffected.
- If the user gets the same permission from a profile, another permission set, or a different permission set group, "the user still has these permissions despite the muting permission set." Muting does not reach outside its own group.
- Muting cascades through dependencies. Muting Read on an object also mutes Create, Edit, Delete, View All Records, and Modify All Records, because you cannot act on data you cannot read.

Sources: <https://trailhead.salesforce.com/content/learn/modules/permission-set-groups/mute-permissions-in-permission-set-groups> and <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_muting.htm&language=en_US&type=5>

**Restriction rules.** These are covered in section 5.9 because they act on records, not on permissions.

---

## 4. Layer three: field level

This layer decides which columns on a record a person can see or change.

### 4.1 The three settings

| Setting | Effect |
| --- | --- |
| Read and Edit | User can see and change the field |
| Read | User can see the field but not change it |
| None | User cannot access the field at all |

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.users_profiles_field_perms.htm&language=en_US>

In the Metadata API these are two booleans, `readable` and `editable`, inside `PermissionSetFieldPermissions` and `ProfileFieldLevelSecurity`, keyed by a `field` element holding the full API name such as `Warehouse__c.Description__c`.

Source: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm>

### 4.2 Field permissions versus page layouts

A **page layout** controls what appears on a record's detail page and edit page. It is presentation. Field permissions are security. They are not the same thing and they are not interchangeable.

- Page layouts control field visibility **on detail and edit pages only**.
- Field permissions "control the visibility of fields in any part of the app, including related lists, list views, reports, and search results."

When the two disagree, "the most restrictive field access settings of the two always applies."

The practical rule: never rely on a page layout to hide sensitive data. Removing a field from a layout hides it from one screen. It does not hide it from reports, list views, the API, or search.

Sources: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields> and <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.users_profiles_field_perms.htm&language=en_US>

### 4.3 Where field permissions are enforced

Field-level security applies across:

- APIs
- Reports
- Search results
- List views
- Related lists
- Lookup dialog search results

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields>

### 4.4 Fields whose permissions cannot be changed

Some fields do not obey field permissions, or cannot have them set at all.

| Field kind | Behaviour |
| --- | --- |
| Universally required fields | Appear on edit pages regardless of field-level security restrictions. They cannot be hidden. |
| Roll-up summary fields | Read-only by nature. Read-only on detail pages and unavailable on edit pages. |
| Formula fields | Read-only by nature. Same behaviour as roll-up summary fields. |
| Required fields (API 30.0 and later) | "In API version 30.0 and later, permissions for required fields can't be retrieved or deployed." They do not appear in retrieved metadata and must not be added by hand. |
| Activity fields | Use `Event` or `Task` as the object name, never `Activity`. |
| Einstein Insights | Remain visible to users even when they reference fields the user cannot access. |

Autonumber fields are also read-only by nature in the same way formula and roll-up summary fields are, since their value is generated by the platform. I did not find a page in this research set that states that in those exact words, so treat the autonumber case as consistent with the documented formula and roll-up behaviour rather than as separately cited.

Sources: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.users_profiles_field_perms.htm&language=en_US> and <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>

### 4.5 API version history worth knowing

| API version | Change |
| --- | --- |
| 22.0 and earlier | Field visibility expressed with a `hidden` element |
| 23.0 and later | `readable` replaces `hidden` |
| 30.0 and later | `editable` defaults to false for new custom fields; permissions for required fields cannot be retrieved or deployed |
| 54.0 and later | "only field permissions enabled in the permission set are returned in queries" |
| 63.0 and later | `viewAllFields` object permission available (Spring '25) |

Sources: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm> and <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm>

### 4.6 Encrypted fields

There are two different encryption features in Salesforce and they behave differently with field permissions.

**Classic encryption** applies to a special custom text field type created for that purpose. Its behaviour:

- Only users with the **View Encrypted Data** permission can see the data in plain text.
- "Encrypted fields are editable regardless of whether the user has the View Encrypted Data permission." To stop editing you must use validation rules, field-level security, or page layout settings.
- "Encrypted fields are always masked in email templates regardless of whether you have the View Encrypted Data permission."
- If you have View Encrypted Data and you grant login access to another user, that user can see the encrypted fields in plain text.
- Only users with View Encrypted Data can clone the value of an encrypted field when cloning a record.

Source: <https://help.salesforce.com/s/articleView?language=en_US&id=sf.fields_about_encrypted_fields.htm&type=5>

**Shield Platform Encryption** is a separate paid feature covering a much wider set of fields. Salesforce publishes a knowledge article titled "View Encrypted Data permission not needed with Shield Platform Encryption".

**What I could not confirm:** I read only that article's title through search results, not its body. Do not act on the Shield behaviour from this document alone. Read <https://help.salesforce.com/s/articleView?id=000382508&language=en_US&type=1> and <https://help.salesforce.com/s/articleView?language=en_US&id=xcloud.security_pe_permissions.htm&type=5> before designing anything that depends on it.

---

## 5. Layer four: record level

This is the largest layer. It decides which individual rows a person can reach.

Salesforce's "Control Who Sees What" page lists eight mechanisms at this layer:

1. Organization-wide sharing settings
2. Role hierarchy
3. Sharing rules
4. Manual sharing
5. User sharing
6. Apex managed sharing
7. Restriction rules
8. Scoping rules

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_data_access.htm&language=en_US>

The first four are the classic set that the training material calls "the four ways", "listed in order of increasing access". The pattern is: lock everything down with organization-wide defaults, then open it back up selectively.

Source: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records>

### 5.1 Organization-wide defaults

An **organization-wide default** (OWD) sets the baseline level of access users have to records they do **not** own. It is set separately for each object, and separately for internal and external users.

The available access levels:

| Level | Meaning |
| --- | --- |
| Private | Only the record owner, and users above the owner in the role hierarchy, can access the record |
| Public Read Only | Everyone can view. Only the owner and those above them in the hierarchy can edit. |
| Public Read/Write | Everyone can view, edit, and report on all records |
| Public Read/Write/Transfer | As above, plus everyone can reassign ownership. Used for Case and Lead. |
| Public Full Access | The highest level. Used for Campaign. |
| Controlled by Parent | "A user can view, edit, or delete a record if they can perform that same action on the object it belongs to." Used where a master-detail relationship exists. |
| Use | Applies to certain objects such as Price Book |

Sources: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_sharing_owd_default_settings.htm&language=en_US> and <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records>

Salesforce's own default settings per object, as documented on 2026-08-25:

| Object | Internal default | External default, orgs created before Spring '20 | External default, orgs created after Spring '20 |
| --- | --- | --- | --- |
| Account | Public Read/Write | Public Read/Write | Private |
| Activity | Private | Private | Private |
| Asset | Controlled by Parent | Controlled by Parent | Controlled by Parent |
| Calendar | Hide Details and Add Events | Hide Details and Add Events | Hide Details and Add Events |
| Campaign | Public Full Access | Public Full Access | Private |
| Case | Public Read/Write/Transfer | Public Read/Write/Transfer | Private |
| Contact | Controlled by Parent | Controlled by Parent | Controlled by Parent |
| Contract | Public Read/Write | Public Read/Write | Private |
| Custom object | Public Read/Write | Varies by creation date | Private |
| Lead | Public Read/Write/Transfer | Public Read/Write/Transfer | Private |
| Opportunity | Public Read Only | Public Read Only | Private |
| User | Public Read Only | Private | Private |

"In orgs created after Spring '20, the default external authenticated access level is set to Private for all objects" with limited exceptions.

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_sharing_owd_default_settings.htm&language=en_US>

In the Metadata API the OWD lives on the object as `sharingModel`, of enumeration type `SharingModel`. A second element, `externalSharingModel`, holds the external default and is available in API version 31.0 and later. `sharingModel` was read-only through the API in version 29.0 and earlier; from version 30.0 it can be set for internal users through both the API and the user interface.

Source: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/customobject.htm>

Changing an OWD triggers sharing recalculation and "depending on volume could result in long processing times."

Source: <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 5.2 Role hierarchy

A **role** is a position in a tree that controls record access. It is not the same thing as a profile. A profile says what object and field permissions you have; a role says whose records you can see.

The role hierarchy "ensures that managers always have access to the same data as their employees, regardless of the organization-wide default settings." Users can view, edit, and report on "all data owned by or shared with users below them in the role hierarchy."

Important: "Peers within the same role don't guarantee them access to each other's data." The hierarchy only reaches downward.

"Role hierarchies don't have to match your organization chart exactly. Instead, each role in the hierarchy should represent a level of data access that a user or group of users needs."

Limits and best practices:

| Item | Value |
| --- | --- |
| Maximum roles, orgs on Spring '21 and later | 5,000 |
| Maximum roles, orgs before Spring '21 | 500 |
| Best practice branch depth | No more than 10 levels |
| Best practice internal roles | Keep to 25,000 |
| Best practice external roles | Keep to 100,000 |

**Grant Access Using Hierarchies** is a checkbox on the org-wide default settings. Unchecking it stops role-hierarchy inheritance so that "only the record owner and users granted access through sharing features receive access to the object's records." The documentation states this applies to **custom objects**. It says nothing about disabling it for standard objects, and in practice it cannot be disabled for standard objects. I found no page in this research set that states the standard-object restriction in those words, so treat that last sentence as widely-held practice rather than a cited fact.

Sources: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_roles> and <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 5.3 Sharing rules

A **sharing rule** is an automatic exception to the org-wide default. It opens access sideways, to people the hierarchy would never reach.

The fundamental constraint: sharing rules "can never be stricter than your org-wide default settings." They only ever expand access.

Two main kinds, plus one for unauthenticated visitors:

| Kind | Basis | Limit per object |
| --- | --- | --- |
| Owner-based | Who owns the record. Record field values are irrelevant. | 300 sharing rules total per object |
| Criteria-based | "provide access to records based on the record's field values (criteria)". Record ownership is irrelevant. | 50 criteria-based and guest user rules combined |
| Guest user | A criteria-based rule targeting unauthenticated site visitors | Counts toward the same 50 |

Access levels a sharing rule can grant: Read-Only or Read/Write.

Recipients: individual users, roles, roles and subordinates (with options for including or excluding Experience Cloud site and portal users), territories, territories and subordinates, and public groups.

Salesforce publishes a warning about guest user sharing rules: the rule type "grants access to guest users without login credentials", allowing "immediate and unlimited access to all records matching the sharing rule's criteria to anyone."

One quirk worth noting: contact owner-based rules do not apply to private contacts or to contacts not associated with an account.

Sharing rules work best "for a particular group of users that you can determine or predict in advance, rather than a set of users that frequently changes."

Sources: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_sharing_rules> and <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 5.4 Public groups

A **public group** is "a collection of individual users, roles, territories, and so on, that all have a function in common." It is a convenience container used as the target of sharing rules.

Membership can include: users, Customer Portal users, Partner users, roles, roles and internal subordinates, roles internal and portal subordinates, portal roles, portal roles and subordinates, territories, territories and subordinates, and other public groups.

Nesting behaviour: "If Group A is a member of Group B, then the members of Group A will have access to data shared to Group B at the same access level as the members of Group B."

Two limits that matter for performance:

- Maximum five levels of nesting.
- Best practice: keep the total to 100,000 groups per org.

And the sentence that trips people up: "Group membership alone doesn't provide data access." A group is a target for sharing, not a grant in itself.

Source: <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 5.5 Manual sharing

**Manual sharing** lets a record owner, or a user with sufficient permission, hand read or edit access on one record to someone who has no other route to it. It "isn't automated like organization-wide sharing settings, role hierarchies, or sharing rules."

Two behaviours that surprise people:

- "Manual sharing is removed when the record owner changes." Change the owner and every manual share on that record disappears.
- A manual share is removed if it "doesn't grant additional access beyond the object's organization-wide sharing default access level". Raise the OWD and the now-redundant manual shares are cleaned up.

Any share whose row cause is set to "manual share" can be edited and deleted through the Share button in the user interface, **even if it was created programmatically**.

Manual sharing is available when the org-wide default is Private or Public Read Only. If everyone can already edit everything, there is nothing to share.

Sources: <https://architect.salesforce.com/fundamentals/platform-sharing-architecture> and <https://developer.salesforce.com/blogs/developer-relations/2017/04/salesforce-data-security-model-explained-visually>

### 5.6 How shares are actually stored

Every grant beyond the OWD and the hierarchy is stored as a row in a **share table**.

| Object kind | Share table name |
| --- | --- |
| Standard object | `AccountShare`, `ContactShare`, `LeadShare`, and so on |
| Custom object | `MyObject__Share` |

Each sharing row holds four things:

| Column | Meaning |
| --- | --- |
| Record ID (`ParentId`, or an `AccountId` style name on some standard objects) | "ID of the record to which the row grants access". Cannot be changed after creation. |
| `UserOrGroupId` | "ID of the user or group to whom the row grants access". Cannot be changed after creation. Cannot grant access to unauthenticated guest users. |
| Access level (named `[ObjectName]AccessLevel`, for example `AccountAccessLevel`) | "Level of access the row allows, such as Read Only or Full Access" |
| `RowCause` | "the reason Salesforce grants the user or group access to the record". Cannot be changed after creation. |

Valid access level values are `Read`, `Edit`, and `All`. Note: "The All access level is an internal value and can't be granted." An access level set on a share must exceed the object's org-wide default.

Row cause values include `Manual` ("when a record owner manually shares a record with a user or group"), `Rule` ("when a sharing rule shares the record with a user or group"), `Owner`, `Team`, and custom Apex sharing reasons. The row cause is what determines who is allowed to modify the sharing record.

Key evaluation rule: "For users with multiple access grants to a record, Salesforce uses the most permissive grant when determining record access."

Sources: <https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_entity.htm> and <https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_creating_with_apex.htm>

### 5.7 The four kinds of access grant

Under the hood, when an org-wide default is Private or Public Read Only, Salesforce grants record access in four ways:

| Grant type | What causes it |
| --- | --- |
| Explicit | "when records are shared directly to users or groups". Record ownership, queue ownership, sharing rules, assignment rules, and manual shares all create explicit grants. |
| Group membership | The user belongs to a group that has an explicit grant. If a sharing rule gives the Strategy group access to a record and Bob is in Strategy, Bob's membership is what gets him in. |
| Inherited | "when a user, personal or public group, queue, role, or territory inherits access through a role or territory hierarchy, or is a member of a group that inherits access through a group hierarchy" |
| Implicit | Built-in application behaviour that grants access to related records. See the next section. |

Warning from the same page: orgs without an efficient sharing design can hit performance trouble when automated processes generate very large numbers of explicit grants, such as during a major sales territory realignment.

Source: <https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_grants.htm>

### 5.8 Implicit sharing

**Implicit sharing** is access Salesforce grants automatically because of how the standard sales and service objects relate to each other. Salesforce calls it "sharing behaviors that are built into Salesforce". Critically, "it isn't a configurable setting". You cannot switch it on or off. You can only understand it and design around it.

| Type | What it grants |
| --- | --- |
| Parent | "Read-only access to the parent account for a user with access to a child case, contact, or opportunity." Not used when child sharing is parent-controlled. Expensive to maintain on accounts with many children. |
| Child | Access to an account's child records for the account owner, "controlled by child access settings for the account owner's role". Removed when parent access is lost. |
| Experience Cloud site | "Account and associated contacts shared with the lowest role under the customer or partner account" |
| High volume | "Full access to data owned by high-volume users associated with a sharing set for members of the sharing set's share group" |
| High volume parent | Read-only access to the parent account record, keeping the account visible where a high-volume user's record is accessible |

Child implicit sharing access levels (View, Edit, or No access) are set per child object when the role is created.

**Implicit sharing does not apply to custom objects.** It is a standard-object behaviour only.

Sources: <https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_object_relationships_implicit_sharing.htm> and <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 5.9 Restriction rules and scoping rules

These two are the only record-layer features that reduce access rather than expand it.

**Restriction rules** "let you enhance your security by allowing certain users to access only specified records." They act as a filter on top of everything else: "When a restriction rule is applied to a user, the data that they had read access to via your sharing settings is further scoped to only records matching the recordFilter."

Salesforce compares it to a permanent list-view filter: "similar to how you can filter results in a list view or report, except that it's permanent."

| Item | Detail |
| --- | --- |
| Supported objects | Custom objects, external objects, contracts, events, quotes, tasks, time sheets, time sheet entries |
| Not supported | Standard objects such as Account and Opportunity |
| Limit, Enterprise and Developer Editions | Up to 2 active rules per object |
| Limit, Performance and Unlimited Editions | Up to 5 active rules per object |
| Where they apply | List Views, Lookups, Related Lists, Reports, Search, SOQL, SOSL |
| Editions | Enterprise, Performance, Unlimited, Developer |

Design guidance from the same page: "When creating more than one restriction or scoping rule, configure the rules so that only one active rule applies to a given user."

**Scoping rules** are the sibling feature. The one-line difference: "A restriction rule controls the access that specified users have to designated records, while a scoping rule controls the default records that your users see without restricting access." In other words, a scoping rule changes the default view; a restriction rule changes what is reachable at all.

**What I could not confirm:** the pages I read describe scoping rules only in that one sentence. I did not read the full scoping rules documentation, so treat anything beyond that sentence as unverified.

Sources: <https://developer.salesforce.com/docs/atlas.en-us.restriction_rules.meta/restriction_rules/restriction_rules_about.htm> and <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_restriction_rule.htm&language=en_US>

### 5.10 Apex managed sharing

**Apex managed sharing** is record sharing driven by code. Salesforce defines it as providing "developers with the ability to support an application's particular sharing requirements programmatically through Apex or the SOAP API."

| Property | Behaviour |
| --- | --- |
| Who can create or change it | "Only users with 'Modify All Data' permission can add or change" Apex managed sharing |
| Ownership change | It persists when record ownership changes or the owner is deactivated. This is the opposite of manual sharing. |
| Custom sharing reasons | Available for custom objects only |
| Recalculation feature | Available for custom objects only |

Access levels supported:

| Level | Meaning |
| --- | --- |
| Read Only (`Read`) | View only |
| Read/Write (`Edit`) | View and change |
| Full Access (`All`) | View, edit, transfer, share, and delete. Internal value, cannot be granted directly. |
| Private (`None`) | Owner and hierarchy superiors only. `AccountShare` only. |

An important catch: if programmatically created shares use the `Manual` row cause, they can then be maintained through the Share button in the user interface **and they follow all manual share rules, including deletion when ownership is transferred**. Using a custom Apex sharing reason instead is what makes a programmatic share durable.

Sources: <https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_understanding.htm> and <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 5.11 Teams

A **team** is a group of users working together on one record. Salesforce supports account teams, opportunity teams, and case teams.

- "Record owners can build a team for each record that they own" and specify each member's access level.
- Only owners, people above them in the hierarchy, and administrators can add members or increase access.
- Team members who hold read/write access can add members who already have access, as long as doing so does not increase access.
- There is **one team per record**.
- Creating a team member through the user interface generates both a team record and a share record. Creating one programmatically means you must manage both records yourself.

Teams are not available on custom objects natively. Apex managed sharing is the documented route to team-like behaviour on a custom object.

Source: <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 5.12 Territory management

**Enterprise Territory Management** adds a second hierarchy alongside the role hierarchy. The territory hierarchy "shows territory structure and serves as its main interaction point."

- The role hierarchy can model the human resources reporting structure while the territory hierarchy models the sales structure.
- Territory management accommodates "matrix reporting structure, where someone can report to multiple managers", which the role hierarchy cannot.
- Do not make the two hierarchies identical. Doing so "causes unnecessary sharing activity."
- Prefer the territory hierarchy over teams for sales overlays where possible.

Source: <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

---

## 6. How the layers combine

### 6.1 AND across layers, OR within a layer

To read a value, a user needs **all** of the following at once:

1. Read permission on the object, from a profile or any permission set.
2. Read permission on the field, from a profile or any permission set, or the View All Fields object permission.
3. Access to that specific record, from an org-wide default, the role hierarchy, a share row, or a sharing-bypass permission.

Miss any one and the value is not visible. That is the AND.

Within each layer, access is the **union** of every source. Profile plus permission set plus permission set group. Org-wide default plus hierarchy plus every share row, with "the most permissive grant" winning. That is the OR.

Sources: <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects> and <https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_entity.htm>

### 6.2 There is no deny, with two exceptions

Nothing in a profile, permission set, or sharing rule takes access away. The model only ever grants. The two things that subtract:

| Mechanism | What it subtracts | Its blind spot |
| --- | --- | --- |
| Muting permission set | Permissions, within one permission set group only | The user keeps the permission if it also comes from a profile, another permission set, or a different permission set group |
| Restriction rule | Record read access, on the supported objects only | Does not apply to standard objects such as Account or Opportunity |

Sources: <https://trailhead.salesforce.com/content/learn/modules/permission-set-groups/mute-permissions-in-permission-set-groups> and <https://developer.salesforce.com/docs/atlas.en-us.restriction_rules.meta/restriction_rules/restriction_rules_about.htm>

### 6.3 The bypass permissions, side by side

| Permission | Bypasses sharing? | Bypasses field-level security? | Scope |
| --- | --- | --- | --- |
| View All Records ("View All") | Yes, for that one object | **No** | One object |
| Modify All Records ("Modify All") | Yes, for that one object | **No** | One object |
| View All Data | Yes, everywhere | **No** | Whole org |
| Modify All Data | Yes, everywhere | **No** | Whole org |
| View All Fields | Not applicable | Yes, for that one object | One object |
| View All Fields (Global) | Not applicable | Yes, everywhere | Platform Integration User only |

The row that matters: **none of the record-level bypass permissions bypass field-level security.** Salesforce states it directly: "View All Data, Modify All Data, and View All Records or Modify All Records ... don't override field-level security."

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.users_profiles_view_all_mod_all.htm&language=en_US>

### 6.4 A worked example

Say a user needs to see the Amount field on one Opportunity record.

| Check | What must be true | Where it comes from |
| --- | --- | --- |
| Object | Read on Opportunity | Their profile, or any permission set they hold |
| Field | Read on `Opportunity.Amount` | Their profile, or any permission set, or View All Fields on Opportunity |
| Record | Access to that one Opportunity | They own it, or the OWD is Public Read Only or better, or they are above the owner in the role hierarchy, or a sharing rule reaches them, or someone manually shared it, or code created a share row, or they hold View All Records on Opportunity, or they hold View All Data |

If Amount is hidden from them at field level, holding Modify All Data changes nothing about Amount. They will see the record and not the number.

---

## 7. Sharing recalculation

Share rows are stored, not computed on the fly. So when the inputs change, Salesforce has to rebuild them. That rebuild is **sharing recalculation**, and on a large org it is the single biggest performance concern in this whole model.

### 7.1 What triggers automatic recalculation

Salesforce Help lists these actions as triggering automatic recalculation:

- Adding or removing users from groups, roles, or territories
- Changing role reporting relationships
- Changing territory subordination
- Adding or removing groups within other groups

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_sharing_recalculating.htm&language=en_US>

The architect guidance states it more broadly: recalculation is triggered by "every individual change to the role hierarchy, territory hierarchy, groups, sharing rules, user roles, team membership, or ownership of records."

Source: <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

Changing an org-wide default also triggers recalculation and "depending on volume could result in long processing times."

Salesforce Help also states that when you update org-wide defaults or sharing rules, automatic recalculation is processed asynchronously and in parallel. **Provenance note:** that sentence came from the search index summary of <https://help.salesforce.com/s/articleView?id=sf.security_sharing_recalculating.htm&language=en_US&type=5>. The legacy renderer version of the same page, which I did read in full, does not repeat it. Treat the asynchronous-and-parallel detail as reported by Salesforce but not independently verified here.

### 7.2 What one small change can set off

The "Record-Level Access: Under the Hood" guide walks through changing a single user's role. That one action causes Salesforce to:

- Arrange access to that user's data for everyone in roles above them, if they are the first member of the new role to own any data
- Adjust shares for child records (Contacts, Cases, Opportunities) where the role's child access settings differ
- Move portal role associations: "Salesforce removes these portal roles from her old role and appends them to her new role for every portal-enabled account she owns"
- Recalculate "all sharing rules that include Wendy's old or new role in the source group"

The guide's own summary: "a lot can go on under the hood when an administrator takes what looks like a simple action, such as changing a user's role."

Source: <https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_putting_it_all_together.htm>

### 7.3 Manual recalculation

An administrator with the Manage Sharing permission can force a recalculation from the Sharing Rules related lists using the **Recalculate** button. Salesforce recommends doing this "only if updates have failed or record access isn't working as expected," because the process can take a long time.

Users get an email when recalculation finishes for all affected objects. Progress can be watched in the Background Jobs page in Setup.

Available in Professional, Enterprise, Performance, Unlimited, and Developer Editions.

Source: <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_sharing_recalculating.htm&language=en_US>

### 7.4 Deferred sharing calculation

For large-scale maintenance, Salesforce can temporarily suspend recalculation so that many changes are made first and recalculated once, in bulk, at a chosen time.

| Item | Detail |
| --- | --- |
| Introduced | Summer '11 |
| Permissions needed | Manage Users, View Setup and Configuration, Manage Sharing Calculation Deferral |
| While deferred | The Recalculate button is disabled |
| After deferral | The administrator must resume calculations and run a full manual recalculation, or errors follow |
| When Salesforce enables it | Salesforce Customer Support can turn it on for orgs with large data volumes, cited as 2 million or more accounts |

Doing bulk changes this way is "typically more efficient and better performing for bulk changes" than letting each change recalculate on its own.

Sources: <https://developer.salesforce.com/blogs/developer-relations/2011/05/bulk-sharing-recalculation-in-summer-11>, <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_sharing_recalculating.htm&language=en_US>, and <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

### 7.5 Group membership locking

Salesforce locks the group membership tables during updates "to prevent incompatible simultaneous updates or timing issues." That lock is what produces the locking errors people see during bulk loads and quarter-end realignments.

**Granular locking** is enabled by default. It "allows some group maintenance operations to proceed simultaneously if there's no hierarchical or other relationship between the roles or groups involved." Groups in separate hierarchies can be changed at the same time, public group and role changes can proceed during territory operations, and user provisioning can run in parallel.

The exception: **reparenting**, meaning moving a role to a different place in the role hierarchy, "still block[s] almost all other group updates."

Ways to reduce locking errors:

- "Scheduling separate group maintenance processes carefully so they don't overlap"
- "Implementing retry logic in integrations and other automated group maintenance processes"
- "Trying serial processing if using parallel processing leads to locking errors"

Source: <https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_locking.htm>

### 7.6 Data skew and ownership skew

Two shapes of data that make recalculation slow:

| Skew | What it is | Threshold |
| --- | --- | --- |
| Data skew | A parent record with a very large number of children | Ratios above 1:10,000 degrade performance |
| Ownership skew | A single user, role, or group owning a very large number of records | Ratios above 1:10,000 degrade performance |

Best practice for a user owning 10,000 or more records: that user record should either have no role at all, or hold a role at the top of the hierarchy in its own separate branch.

Salesforce also recommends keeping structural hierarchy changes to no more than quarterly, and planning, testing, and coordinating bulk changes rather than running them ad hoc. Orgs with 2 million or more accounts that also use teams or Territory Management can generate "a huge volume of share records and hence, long running transactions."

Source: <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>

---

## 8. Design rules that fall out of all this

These follow directly from the facts above. They are stated here so a reader does not have to derive them.

1. **Lock down first, open up second.** Set org-wide defaults to the access the most restricted user should have, then grant back with hierarchy, sharing rules, and shares. You cannot subtract later.
2. **Never use a page layout as a security control.** It covers two screens. Field permissions cover reports, list views, search, and the API.
3. **Removing access means removing it everywhere.** Union semantics mean one forgotten permission set keeps the access alive.
4. **Prefer many small permission sets over a few large ones.** Smaller blast radius, fewer merge conflicts, and it matches Salesforce's current guidance.
5. **Do not assume Modify All Data solves a field visibility problem.** It does not touch field-level security.
6. **Understand implicit sharing before you conclude a user should not see an account.** They may see it because they can see a case on it, and there is no setting to turn that off.
7. **Treat any change to roles, groups, territories, ownership, or org-wide defaults as a performance event on a large org**, not a configuration tweak.
8. **Watch the manual-share row cause when writing sharing code.** A programmatic share using the `Manual` row cause dies the moment ownership changes.

---

## 9. What this document does not cover

Named explicitly so nobody assumes silence means completeness:

- **Scoping rules** beyond the one-sentence definition in section 5.9.
- **Shield Platform Encryption** behaviour with field permissions. Section 4.6 says why.
- **User sharing** (controlling who can see which user records) is listed as a record-level mechanism by Salesforce but is not described in detail here.
- **Experience Cloud site and portal security** in depth, including sharing sets and share groups. Only the implicit-sharing rows in section 5.8 touch it.
- **Connected app and API-level access control**, including OAuth scopes and named credentials.
- **Event Monitoring, Field Audit Trail, Security Health Check, and Transaction Security**, which are detection and audit features rather than access control.
- **The precise internal order** in which Salesforce evaluates the four layers at runtime. Section 1 explains why.

---

## Sources

All URLs retrieved on 2026-08-25.

### The layered model overall

- <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_data_access.htm&language=en_US>: Salesforce Help, "Control Who Sees What". The canonical definitions of object, field, and record level security, and the list of all eight record-level mechanisms.
- <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_overview>: Trailhead, "Overview of Data Security". The four levels including the organization level, with the recruiting-app worked example.
- <https://developer.salesforce.com/blogs/developer-relations/2017/04/salesforce-data-security-model-explained-visually>: Salesforce Developers blog, "Salesforce Data Security Model Explained Visually". Objects as tables and fields as columns; the additive nature of permissions; the five record-level methods.
- <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>: Salesforce Well-Architected, "Secure". Organizational, session, and data security; least privilege; individuals for authentication and personas for authorization.

### Organization level

- <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_org>: Trailhead, "Control Access to the Org". Users and profiles, password policies, login hours, trusted and profile IP restrictions.
- <https://trailhead.salesforce.com/content/learn/modules/identity_login/identity_login_2fa>: Trailhead, "Secure Your Users' Identity", MFA unit. The contractual MFA requirement, the four verification methods, High Assurance session security.
- <https://trailhead.salesforce.com/content/learn/modules/identity_login>: Trailhead, "Secure Your Users' Identity" module. MFA, My Domain, and single sign-on setup.
- <https://help.salesforce.com/s/articleView?id=platform.login_ip_ranges.htm&language=en_US&type=5>: Salesforce Help, "Restrict Login IP Addresses in Profiles". Profile login IP ranges versus org-level trusted IP ranges, and the enforce-on-every-request session setting. Note: read through Salesforce's search index summary only; the page itself did not render.
- <https://trailhead.salesforce.com/content/learn/projects/protect-your-data-in-salesforce/restrict-login-hours-and-ip-ranges>: Trailhead project, "Restrict Login Hours and IP Ranges". Worked example of profile login hours. Did not cover IP ranges despite its title.

### Object level

- <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_objects>: Trailhead, "Control Access to Objects". Profiles, permission sets, permission set groups, the four object permissions, and the statement that permissions are additive.
- <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.users_profiles_view_all_mod_all.htm&language=en_US>: Salesforce Help, "View All and Modify All Permissions Overview". The full comparison of View All Records, Modify All Records, View All Data, Modify All Data, View All Fields, View All Fields (Global), View All Users, and View All Lookup Record Names, plus the statement that none of them override field-level security.
- <https://help.salesforce.com/s/articleView?language=en_US&id=sf.users_profiles_view_all_mod_all.htm&type=5>: Same page, modern URL. Source of the note that dependent permissions are enabled automatically.
- <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_permissionset.htm>: Metadata API Developer Guide, PermissionSet. Exact metadata element names for object and field permissions; `viewAllFields` available in API 63.0 and later; API 54.0 query behaviour.
- <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_profile.htm>: Metadata API Developer Guide, Profile. ProfileObjectPermissions, ProfileFieldLevelSecurity, ProfileLoginIpRange, ProfileLoginHours, and the API version history for required fields and standard profiles.
- <https://trailhead.salesforce.com/content/learn/modules/administrator-certification-maintenance-spring-25/get-hands-on-with-the-view-all-fields-permission>: Trailhead, Spring '25 admin certification maintenance. What View All Fields does and where it is enabled.
- <https://trailhead.salesforce.com/content/learn/modules/permission-set-groups/mute-permissions-in-permission-set-groups>: Trailhead, "Mute Permissions in Permission Set Groups". One muting permission set per group, group-only scope, and muting dependencies.
- <https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_muting.htm&language=en_US&type=5>: Salesforce Help, "Muting Permission Sets". Confirms the scope limits and the dependency cascade. Read through search index summary.

### Field level

- <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.users_profiles_field_perms.htm&language=en_US>: Salesforce Help, "Field Permissions". Read, Edit, and None; the most-restrictive-wins rule against page layouts; universally required fields; roll-up summary and formula fields.
- <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_fields>: Trailhead, "Control Access to Fields". Where field-level security is enforced, and why page layouts are not a security control.
- <https://help.salesforce.com/s/articleView?language=en_US&id=sf.fields_about_encrypted_fields.htm&type=5>: Salesforce Help, "Classic Encryption for Custom Fields". View Encrypted Data permission, editability of encrypted fields, masking in email templates. Read through search index summary.
- <https://help.salesforce.com/s/articleView?id=000382508&language=en_US&type=1>: Salesforce Help knowledge article, "View Encrypted Data permission not needed with Shield Platform Encryption". Title only; body not read. Listed so the next reader can check it.
- <https://help.salesforce.com/s/articleView?language=en_US&id=xcloud.security_pe_permissions.htm&type=5>: Salesforce Help, "Which User Permissions Does Shield Platform Encryption Require?". Not read; listed as the place to confirm Shield behaviour.

### Record level

- <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_records>: Trailhead, "Control Access to Records". The four classic mechanisms in order of increasing access; org-wide default values; internal versus external; Grant Access Using Hierarchies.
- <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_sharing_owd_default_settings.htm&language=en_US>: Salesforce Help, "Default Organization-Wide Access Levels". The full per-object default table and the Spring '20 change to external defaults.
- <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_roles>: Trailhead, "Create a Role Hierarchy". What the role hierarchy grants and the Grant Access Using Hierarchies checkbox on custom objects.
- <https://trailhead.salesforce.com/content/learn/modules/data_security/data_security_sharing_rules>: Trailhead, "Define Sharing Rules". Owner-based versus criteria-based, the never-stricter-than-OWD rule, access levels, and recipient types.
- <https://architect.salesforce.com/fundamentals/platform-sharing-architecture>: Salesforce Architects, "Platform Sharing Architecture". The single richest source here: OWDs, role hierarchy limits, sharing rule limits, manual sharing behaviour, Apex managed sharing, implicit sharing, teams, territory management, public groups, sharing recalculation triggers, deferred calculation, and skew thresholds.
- <https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_object_relationships_implicit_sharing.htm>: "Designing Record Access for Enterprise Scale", Implicit Sharing. The five implicit sharing types and what each grants.
- <https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_grants.htm>: "Record-Level Access: Under the Hood", Access Grants. The four grant types: explicit, group membership, inherited, implicit.
- <https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_entity.htm>: "Record-Level Access: Under the Hood", Sharing Rows. Share row columns, row causes, and the most-permissive-grant-wins rule.
- <https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_understanding.htm>: Apex Developer Guide, "Understanding Sharing". Apex managed sharing definition, Modify All Data requirement, persistence through owner change, and the four access levels.
- <https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_creating_with_apex.htm>: Apex Developer Guide, "Creating Sharing Rules with Apex". Share object naming for standard and custom objects, the four properties, and the note that `All` cannot be granted.
- <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/customobject.htm>: Metadata API Developer Guide, CustomObject. The `sharingModel` and `externalSharingModel` elements and their API version history.
- <https://developer.salesforce.com/docs/atlas.en-us.restriction_rules.meta/restriction_rules/restriction_rules_about.htm>: Restriction Rules Developer Guide, "About Restriction Rules". What restriction rules filter, supported objects, per-edition limits, and where they apply.
- <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_restriction_rule.htm&language=en_US>: Salesforce Help, "Restriction Rules". Confirms the object list and edition limits.
- <https://help.salesforce.com/s/articleView?language=en_US&id=platform.security_restriction_rule.htm&type=5>: Salesforce Help, "Restriction Rules", modern URL. Source of the one-sentence restriction-versus-scoping difference. Read through search index summary.

### Recalculation and performance

- <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_sharing_recalculating.htm&language=en_US>: Salesforce Help, "Recalculate Sharing Rules Manually". The list of automatic triggers, the manual Recalculate button, deferred calculation, email notification, and Background Jobs.
- <https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/uth_putting_it_all_together.htm>: "Record-Level Access: Under the Hood", Putting It All Together. What a single role change sets off.
- <https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_locking.htm>: "Designing Record Access for Enterprise Scale", Group Membership Locking. Table locking, granular locking, reparenting, and mitigation strategies.
- <https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_intro.htm>: "Designing Record Access for Enterprise Scale", Introduction. The guide's four chapters and its intended audience.
- <https://developer.salesforce.com/blogs/developer-relations/2011/05/bulk-sharing-recalculation-in-summer-11>: Salesforce Developers blog, "Bulk Sharing Recalculation in Summer '11". When deferred sharing calculation arrived and which three permissions it needs.
