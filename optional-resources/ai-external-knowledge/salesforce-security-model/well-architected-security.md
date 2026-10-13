# Salesforce Well-Architected on security and trust

This document collects what Salesforce itself publishes about how to build a secure,
compliant Salesforce system. It is a summary of Salesforce's own "Well-Architected"
guidance, which is the framework Salesforce publishes for architects. Read this if you
are deciding how access, permissions, data protection, or auditing should work in a
Salesforce org, and you want to know what the platform vendor recommends rather than
what a consultant or a blog recommends. It is a reference document. It does not decide
anything for a project; it records what the source says so a later reader
does not have to go and find it again.

**Basis:** built on 2026-08-25 from 19 official Salesforce pages, all retrieved on
2026-08-25. Seventeen are on `architect.salesforce.com`, one is on
`developer.salesforce.com`, and one is on `help.salesforce.com`. Every URL is listed
in the Sources section at the bottom, with one line saying what it covers.

---

## 1. What Salesforce Well-Architected is

**Salesforce Well-Architected** is a written framework that Salesforce publishes for
people designing systems on its platform. It is not a product, not a feature, and not
something you install. It is guidance: a set of recommendations, plus lists of good
practices and bad practices, written by Salesforce's own product teams and its
implementation staff.

Salesforce says the framework exists because the platform is so flexible that it is
hard to tell which technology choice is the right one for a given situation. The
framework's job is to narrow that down.

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/overview.html>

### Who it is aimed at

Architects and solution designers working on Salesforce. It is written for the person
deciding how a system should be built, not for the person clicking through Setup.

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/overview.html>

### A note on what could not be confirmed

The Well-Architected overview page carries **no publication date and no
last-updated date**. I checked for one and did not find one. So this document cannot
tell you how old the guidance is or when it last changed. What it can tell you is
that the pages read as described here on 2026-08-25.

---

## 2. How the framework is structured

There are three levels.

1. **Pillars.** Three of them. These are the top-level goals.
2. **Sub-characteristics.** Three under Trusted, three under Easy, two under
   Adaptable. These are the qualities that make a pillar true.
3. **Focus areas.** The specific topics under each sub-characteristic. This is where
   the actual advice lives.

Underneath all of that sit **patterns** and **anti-patterns**. A pattern is a thing
Salesforce says a well-architected solution does. An anti-pattern is a thing
Salesforce says a solution that is not well-architected does. They are published as
matching pairs, which makes them useful as a checklist.

### The three pillars

| Pillar | Salesforce's own one-line definition |
| --- | --- |
| **Trusted** | "A trusted solution protects your business and stakeholders." |
| **Easy** | "An easy solution delivers business value fast." |
| **Adaptable** | "An adaptable solution evolves with your business." |

Source: <https://architect.salesforce.com/well-architected> and
<https://architect.salesforce.com/docs/architect/well-architected/guide/overview.html>

### The full map of pillars, sub-characteristics, and focus areas

| Pillar | Sub-characteristic | Focus areas |
| --- | --- | --- |
| Trusted | Secure | Organizational Security, Session Security, Data Security |
| Trusted | Compliant | Legal Adherence, Ethical Standards, Accessibility |
| Trusted | Reliable | Availability, Performance, Scalability |
| Easy | Intentional | Strategy, Maintainability, Readability |
| Easy | Automated | Efficiency, Data Integrity |
| Easy | Engaging | Streamlined, Helpful |
| Adaptable | Resilient | Application Lifecycle Management, Incident Response, Continuity Planning |
| Adaptable | Composable | Separation of Concerns, Interoperability, Packageability |

Source: <https://architect.salesforce.com/well-architected>

Note that **Easy has three sub-characteristics and Adaptable has two**. The
sub-characteristic count is not the same across pillars.

### Where the patterns and anti-patterns live

Salesforce publishes a separate tool called the **Pattern and Anti-Pattern Explorer**.
Its front page describes itself as "Proven patterns to build trusted, easy, and
adaptable solutions on Salesforce." Each focus area has its own page in that explorer.
Most of the specific, quotable guidance in this document comes from those pages.

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/patterns.html>

**Could not confirm:** the Explorer's front page does not define, in words, what
Salesforce means by "pattern" and "anti-pattern". I looked for a definition and did
not find one. The meaning above (a pattern is what a good solution does, an
anti-pattern is what a bad one does) is my reading of how the lists are laid out, not
a quote.

---

## 3. The Trusted pillar in full

Trusted is the security pillar. Salesforce's own introduction to it says:

> "Nothing is more essential to a well-architected solution than being **Trusted**."

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/trusted-overview.html>

### What Trusted means

A Trusted solution protects the business and the people who depend on it. It has three
parts, and Salesforce defines each one in a single phrase:

| Sub-characteristic | Salesforce's definition |
| --- | --- |
| **Secure** | "control access and protect data" |
| **Compliant** | "follow legal and ethical guidelines" |
| **Reliable** | "operate efficiently and dependably" |

Source: <https://architect.salesforce.com/well-architected/trusted/overview>

### What Trusted asks you to do

Salesforce says building a Trusted solution takes careful planning, and that the
planning has to start from the business, not from the technology. The Trusted overview
page poses eight questions an architect should answer before designing:

1. What is the organization's overall risk tolerance?
2. What categories of data will flow through the system?
3. Will Salesforce function as a system of record, or mainly as storage?
4. Does the data require specialized security, compliance, or ethical handling?
5. Which regulations and compliance standards apply?
6. Are there company-specific standards to consider?
7. Is this a business-critical system?
8. Must the solution handle seasonal or circumstantial spikes in use?

Source: <https://architect.salesforce.com/well-architected/trusted/overview>

A "system of record" means the place the business treats as the authoritative copy of
a piece of data. If Salesforce is the system of record for something, losing or
corrupting it there is not recoverable from somewhere else.

The same page adds five things the architect is asked to do:

| Ask | What it means in practice |
| --- | --- |
| Understand context | Assess risk tolerance, data sensitivity, regulation, and whether Salesforce is the system of record |
| Engage stakeholders | Work across the business to identify user types, what systems need access, and what permissions are needed |
| Address legal and industry factors | Fold in compliance standards, regulations, and internal policies |
| Plan for equity and accessibility | Make sure features serve users equitably, with accessibility considered |
| Ensure continuity | Plan for availability and performance during disruption or growth |

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/trusted-overview.html>

---

## 4. Secure: the sub-characteristic that covers access and data protection

Salesforce's definition:

> "A secure system protects an organization's stakeholders and data. Secure
> architectures verify user identities, restrict data access to only necessary
> information, and prevent data compromise."

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

Secure has three focus areas.

| Focus area | Salesforce's definition | Sub-topics |
| --- | --- | --- |
| **Organizational Security** | "Organizational security safeguards systems from unauthorized access by ensuring only validated, authorized users can access a system, and only necessary features and data." | Authentication, Authorization |
| **Session Security** | "The practice of configuring your system to prevent unauthorized access and data breaches by thwarting session interference or hijacking." | Session management, Device access, Threat detection and response |
| **Data Security** | "The practice of protecting your data from unauthorized access, corruption, or unintended deletion." | Sharing and visibility, Encryption |

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

Two plain-English notes on terms above:

- **Authentication** is proving who you are. Salesforce's own words: "Verifying the
  identity of users attempting to access your system."
- **Authorization** is what you are allowed to do once you are in. Salesforce's own
  words: "Defines what features, functionality, and data a user can access, and the
  actions they can perform."

### The single sentence that shapes the whole access model

> "Secure Salesforce solutions use individuals for authentication, and personas for
> authorization."

Source: <https://architect.salesforce.com/well-architected/trusted/secure>

In plain words: every human gets their own login, and no two humans share one. But
what a person is allowed to do is not decided person by person. It is decided by which
**persona** they belong to. A persona is a job-shaped group, for example "field sales
rep" or "billing clerk". Salesforce says to create "Salesforce users based on
individuals, not personas", because audit trails are worthless if two people share a
login, but to grant permissions by persona because that scales.

Salesforce's stated reason for the persona approach:

> By "defining security configurations for distinct personas, you gain granular
> control over access and privileges in your security model, which minimizes the need
> for refactoring in the long run."

Source: <https://architect.salesforce.com/well-architected/trusted/secure>

---

## 5. Access control and permissions: what Salesforce names as good and bad

This is the section most directly relevant to permission design work.

### 5.1 The security matrix

A **security matrix** is a written document, kept outside Salesforce, that lists every
persona and exactly what that persona is allowed to access. Salesforce treats it as a
required artifact, not an optional nicety. It appears in the pattern lists for
organizational security, data security, and legal adherence.

The two lines Salesforce uses to describe it:

> "Every user and system with access to Salesforce maps to one or more personas in a
> security matrix"

> "The security matrix clearly lists metadata permissions and assigned user personas"

And in the data security list:

> "A security matrix outlines the data each user persona is authorized to access"

Sources:
<https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-organizational-security.html>
and
<https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-data-security.html>

Not having one is explicitly listed as an anti-pattern: "Documentation does not
include a security matrix."

### 5.2 Least privilege

**Principle of least privilege** means giving each person only the access they need to
do their job, and nothing more. Salesforce abbreviates it to **PoLP**. Its wording:

> "Embrace the principle of least privilege (PoLP) by assigning users only the
> necessary permissions for their tasks"

It says to do this through "granular and modular permission sets", meaning many small
permission sets rather than a few large ones.

Source: <https://architect.salesforce.com/well-architected/trusted/secure>

### 5.3 Permission sets, permission set groups, and profiles

This is the clearest statement Salesforce publishes on how to choose between the
three.

**Permission sets and permission set groups are the tool of choice.** Salesforce says
they "govern what metadata users can access and what they can do with that metadata".
The specific list of what they control:

> "app assignments, feature license activations, managed package access, system
> permissions, CRUD access, and field-level access"

(CRUD means Create, Read, Update, Delete: the four basic things you can do to a
record.)

**Permission set groups add controls that single permission sets do not have.**
Salesforce's wording:

> "Permission set groups" enable "precise management of permissions, including the
> ability to mute, set expiration dates, and more."

Muting means a permission set group can switch off a permission that one of its member
permission sets grants. Expiration dates mean an assignment can be made to end on a
set date without anyone having to remember to remove it.

**Profiles are to be minimized.** Salesforce is direct about this:

> "Minimize the use of profiles and migrate any access controls out of profiles."

Profiles should only be used for a short list of things:

> "login IP ranges, login hours, and features specific to the legacy Salesforce
> Classic user interface"

Everything else should move to permission sets and permission set groups.

Source: <https://architect.salesforce.com/well-architected/trusted/secure> and
<https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

**The decision, summarised as a table:**

| Question | Salesforce's answer |
| --- | --- |
| Where do object, field, app, and system permissions go? | Permission sets |
| How are permission sets organized? | Into permission set groups, aligned to business capabilities, one group shaped around a persona |
| What are profiles still for? | Login IP ranges, login hours, and legacy Salesforce Classic features only |
| Can a profile hold access control? | No. "Profiles contain access controls for metadata" is listed as an anti-pattern |
| How big should a permission set be? | Small and modular. "Permission sets are redundant or heavily duplicated" is an anti-pattern |

### 5.4 Authorization patterns, quoted in full

These are Salesforce's own words for what a well-architected solution does. The list
below is from the Pattern and Anti-Pattern Explorer page for organizational security.

**Design standards and documentation:**

- "Every user and system with access to Salesforce maps to one or more personas in a security matrix"
- "The security matrix clearly lists metadata permissions and assigned user personas"
- "Use cases for granting elevated privileges are clearly listed", including Modify All Data and View All Data

**Org configuration:**

- "Permission sets and permission set groups are used to control access to metadata"
- "Permission sets and permission set groups align to business capabilities"
- "Permissions assigned to users follow security matrix definitions"
- "Profiles are used minimally and only to control login IP ranges and login hours"
- "A unique API only integration user is configured for every integration"
- "A unique bot user is configured for each business use case", following least privilege

**Code-level access checks:**

- "DB operations perform field-level and object-level access checks appropriately" using user mode, system mode, or `stripInaccessible`
- "SOQL and SOSL statements use `WITH USER_MODE` and `WITH SYSTEM_MODE` keywords", or use `stripInaccessible`
- "sObject describe result methods are used sparingly"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-organizational-security.html>

Plain-English notes on the code items: SOQL and SOSL are the two query languages
Salesforce uses to read records. `WITH USER_MODE` tells a query to respect the running
user's permissions. `stripInaccessible` is an Apex method that removes fields the
running user is not allowed to see. "Describe" methods are a way of asking the
platform at run time what a user can access.

### 5.5 Authorization anti-patterns, quoted in full

These are Salesforce's own words for what a solution that is not well-architected
does.

**Documentation failures:**

- "Documentation does not include a security matrix"
- "Does not clearly list metadata permissions and assigned personas"
- "Use cases for granting elevated permissions are not clearly listed"

**Configuration failures:**

- "Permissions assigned to users do not follow security matrix definitions"
- "Profiles contain access controls for metadata"
- "Permission sets are configured ad hoc"
- "Permission set groups are not configured to allow for access based on business capabilities"
- "Permission sets are redundant or heavily duplicated"
- "API only users are not configured or are shared across more than one integration"
- "Einstein Bots use the Basic Chatbot User or a generic bot user" across different purposes

**Code failures:**

- "DML, Database Class methods, SOQL and SOSL run in default system mode"
- "SOQL queries exclusively use `WITH SECURITY_ENFORCED` keywords for access restrictions"
- "DML or Database Class methods exclusively use describe checks for access"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-organizational-security.html>

Two of those deserve a plain-English note. "Default system mode" means code that runs
without checking the user's permissions at all, which is the Salesforce default and is
why it is called out. `WITH SECURITY_ENFORCED` is an older keyword; Salesforce lists
relying on it *exclusively* as an anti-pattern, which implies the newer
`WITH USER_MODE` is preferred, though the page does not say that in so many words.

### 5.6 Authentication patterns and anti-patterns

Authentication is who you are, not what you can do, but the two lists are worth having
side by side because they cover shared logins and integration users.

**Patterns:**

- "The relationship between users and entities logging into Salesforce is 1:1 (no shared users)"
- "Methods that execute authentication use named credentials to handle username/password flows"
- "No usernames or passwords appear in code in readable formats (no hard-coded values or strings)"
- "If custom login flows exist, all related custom Apex uses appropriate `SessionManagement` methods"
- "Approved security personas are clearly defined and listed"
- "Mapping between security personas and allowed authentication schemes (UI, API) exist in a security matrix"
- "API Access Control prevents users from authenticating via an unauthorized connected app"
- "Login configurations align to the Salesforce MFA Check"
- "If SSO is enabled, approved admin users have direct login access"
- "Login Forensics is used when login history must be stored for more than 6 months"

**Anti-patterns:**

- "The relationship between users and entities logging into Salesforce is not 1:1 (shared accounts)"
- "Usernames and passwords appear in code"
- "If custom login flows exist, there is no logic to assign session-level security"
- "Authentication is handled ad hoc"
- "User provisioning and deprovisioning SLAs and requirements do not exist"
- "Does not include security personas"
- "Security matrix does not have clear mappings for security personas and allowed authentication schemes"
- "API Access Control is not enabled"
- "The firewall uses hard-coded IP addresses to secure communications to/from Salesforce"
- "If SSO is enabled, no approved admin users have direct login access"
- "Login configurations do not align to the Salesforce MFA Check"
- "Legacy Named Credentials are used to authenticate to external systems"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-organizational-security.html>

Notes on terms: MFA means multi-factor authentication, where a password alone is not
enough to log in. SSO means single sign-on, where one company login gets you into
Salesforce. The point about keeping "approved admin users" with direct login access
when SSO is on is a lockout safeguard: if the SSO provider goes down and nobody can
log in directly, nobody can fix it.

---

## 6. Data classification and sensitive data handling

### 6.1 What Salesforce asks you to classify

Salesforce's Legal Adherence pattern list asks for two written artifacts and one org
configuration.

**The two documents:**

- An "up-to-date data dictionary containing field level names, descriptions, and classifications"
- An "up-to-date security matrix that identifies which users have access to what data"

**The org configuration:** set four classification values on sensitive objects and
fields. Salesforce names them as:

> "Compliance Categorization, Data Owner, Data Sensitivity Level, and Field Usage"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-legal-adherence.html>

Those four are real fields you can set on any standard or custom field in Salesforce.
They are metadata about the field, not data in it. The developer documentation gives
the exact definitions and the allowed values:

| Classification field | API name | Salesforce's definition | Allowed values |
| --- | --- | --- | --- |
| Data Sensitivity Level | `securityClassification` | "Indicates the sensitivity of the data contained in the field." | Public, Internal, Confidential, Restricted, MissionCritical |
| Compliance Categorization | `complianceGroup` | "Indicates the compliance acts, definitions, or regulations related to the field's data." | CCPA, COPPA, GDPR, HIPAA, PCI, PII (multi-select) |
| Data Owner (person) | `businessOwnerUser` | "Indicates the person associated with this field. The business owner understands the importance of the field's data to your company." | A user record |
| Data Owner (group) | `businessOwnerGroup` | "Indicates the group associated with this field. The business owner group understands the importance of the field's data to your company." | A public group record |
| Field Usage | `businessStatus` | "Indicates whether the field is in use." | Active, DeprecateCandidate, Hidden |

Source: <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/customfield.htm>

Those fields have been available since API version 45.0. HIPAA on that list is the
United States health privacy law, which is directly relevant to any healthcare
engagement. PII means personally identifiable information.

Salesforce Help adds that the values in the three picklists can be customised, either
through the Data Classification Settings page in Setup or through the Metadata API,
and that classification data can be reported on.

Source: <https://help.salesforce.com/s/articleView?id=platform.data_classification_intro.htm&language=en_US&type=5>

**Could not confirm:** I could not retrieve the Salesforce Help page listing the
default picklist values as shown in the user interface. The values in the table above
come from the Metadata API developer documentation, which uses API names. The labels
shown in Setup may read slightly differently.

### 6.2 Legal adherence anti-patterns

- Data dictionary missing or outdated
- Sharing and visibility documentation absent or outdated
- Design standards and regulatory automation documentation absent or outdated
- Sensitive fields lacking the required classification configurations
- Missing or inadequate analytics, org, or integration strategies addressing localization and data residency

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-legal-adherence.html>

### 6.3 Data residency and localization

Data residency means the rules about which country a piece of data is allowed to be
stored in. Salesforce asks for three written strategies:

- "an org strategy that outlines where data will be stored and maintained to comply with all applicable data residency requirements"
- "an integration strategy that outlines acceptable scenarios and processes for replicating data across borders"
- "an analytics strategy that outlines the level of granularity reports and dashboards can contain at regional, national, and global levels"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-legal-adherence.html>

### 6.4 Masking sensitive data for AI

Where generative AI is in play, Salesforce lists two masking patterns using the
Einstein Trust Layer, which is its filter between Salesforce data and a language
model:

- "Mask fields by compliance category"
- "Mask fields by sensitivity level"

Both are described as customisations of the Einstein Trust Layer driven by business
rules. This is a direct payoff for having set the classification fields in the first
place.

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-legal-adherence.html>

---

## 7. Data security: sharing, visibility, and encryption

### 7.1 Org-wide defaults

An **org-wide default**, usually shortened to OWD, is the baseline setting that says
who can see a type of record before any sharing rule opens it up. Salesforce gives a
clear starting recommendation:

> "Set internal organization-wide defaults (OWDs) to Public Read Only, unless your
> business deals with sensitive data", and in that case use Private.
>
> (The source page joins those two halves with a dash. The sentence is split here so
> the wording is unchanged but the punctuation matches the writing rules these documents follow.)

> "Set external organization-wide defaults (OWDs) to Private, unless you have a
> compelling business reason to allow greater access."

Salesforce warns against Private internal OWDs chosen without a reason, saying they
cause sharing calculation delays and can lead to data duplication.

Source: <https://architect.salesforce.com/well-architected/trusted/secure> and
<https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

The pattern list states the acceptable outcomes as:

- "Organization-wide defaults (OWDs) for internal users is Public Read, or OWDs for internal users is Private, due to compliance requirements"
- "OWDs for external users is Private"

And the anti-patterns as:

- "OWDs for internal users is set to Private without business justification or OWDs for internal users is set to Public Read/Write"
- "OWDs for external users are set to anything other than Private without business justification"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-data-security.html>

Note the shape of this rule. Private is not automatically the safe answer. Salesforce
treats **both** Private-without-a-reason and Public Read/Write as anti-patterns. The
requirement is a stated business justification, not a particular setting.

### 7.2 Sharing and visibility patterns

- "Data segregation is enforced with Data Spaces"
- "Flows initiated by a bot run in bot user context"
- "Screen flows in user context whenever possible"
- "Specifying which fields will stored by a Flow running in system context" (quoted as written; the source has a typo)
- "Generative AI operates only in user mode, or select uses for system access have clear business justification"
- "All code accessing data (SOQL/SOSL) or performing data operations (DML/Database Class methods) uses with sharing keywords"
- "Different data access standards are used for external users and internal users, if applicable"
- "A security matrix outlines the data each user persona is authorized to access"

### 7.3 Sharing and visibility anti-patterns

- "Flows initiated by a bot run in system context"
- "With sharing keywords are used inconsistently"
- "System context is used in screen flows surfaced to external users"
- "Store all fields when using a Get Records element in system context"
- "Generative AI operates in system mode without business justification"

Source for both lists:
<https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-data-security.html>

Plain-English note: "user context" or "user mode" means the automation runs as the
person using it and respects their permissions. "System context" or "system mode"
means it runs with full access and ignores their permissions. Salesforce's position is
that user context is the default choice and system context needs a reason.

### 7.4 Encryption

**Patterns:**

- "Use cases for data encryption in transit and (if needed) at rest are clear and discoverable"
- "Approved encryption protocols are clearly listed"
- "Code documentation clearly indicates where encryption is used and what protocols are used"
- "If business needs require greater data protection in transit, all code involved in integration carries out logic using Crypto Class methods to encrypt data before transmission or decrypt data upon receipt"
- "If security risks are identified that require greater data protection at rest, either Hyperforce or Salesforce Shield provide encryption at rest"

**Anti-patterns:**

- "Business needs require greater data protection in transit, but code involved in integration carries out logic without encrypting data before transmission or upon receipt, or Crypto Class methods are used ad hoc"
- "Approved encryption protocols are not clear or not listed"
- "Code is not documented or documentation is unclear on where and how encryption is used in code"
- "Business needs require greater data protection at rest, but neither Hyperforce nor Salesforce Shield is used"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-data-security.html>

The Secure overview adds that "Salesforce employs Transport Layer Security (TLS) for
all sessions" by default. Transport Layer Security is the standard that encrypts
traffic between a browser and a server. So encryption in transit for normal use is
already handled; the guidance above is about integrations and about data sitting at
rest in the database.

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

---

## 8. Session security

Session security is about the period between a user logging in and logging out. It has
three parts.

### 8.1 Session management

**Patterns:**

- "Inactive session timeout intervals do not exceed the default (2 hours)"
- "Security personas clearly list approved session types and timeout/duration settings"
- "Standards are defined for the activities that require elevated session-level security"
- "Connected app scope and token management policies are clear and discoverable"
- "Login hours have been specified (or identified as not needed)"
- "If custom login flows exist, all related custom code uses appropriate SessionManagement methods"
- "Session audits show users only access Salesforce through expected session types"
- "There is a clear, active permission set for 'API Only User' access and all integration and automated users are assigned"
- "If users access Salesforce from behind a firewall, the firewall uses an allowlist of required domains instead of IP addresses"
- All seven of these settings enabled: "Clickjack protection for Setup pages", "Clickjack protection for non-Setup Salesforce pages", "Cross-Site Request Forgery (CSRF) protection", "Cross-Site Scripting (XSS) protection", "Enable content sniffing protection", "Referrer URL protection", "Warn users before they are redirected outside of Salesforce"

**Anti-patterns:**

- "Inactive session timeout intervals exceed the default (2 hours)"
- "There is no regular session auditing"
- "There are no definitions of what session types users should have"
- "'API Only' permissions are unclear or missing from integration and automated users"
- "Connected app scope and token management policies are not documented"
- "Security personas do not exist or lack information about session types and timeout/duration settings"
- "If custom login flows exist, there is no logic to assign session-level security"
- "If users access Salesforce from behind a firewall, the firewall uses hard-coded IP addresses"
- Any of the clickjack, CSRF, XSS, content sniffing, or referrer protection settings disabled

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-session-security.html>

### 8.2 Device access

**Patterns:**

- "Security personas are clearly mapped to appropriate device usages and policies"
- "Device policies are clear and discoverable"
- "Salesforce mobile connected app configuration requires PIN/passcode unlock after inactivity"
- "If business needs require strict control of users who can access Salesforce mobile, API Access Control is enabled and permission sets are assigned"

**Anti-patterns:**

- "Security policies do not exist or do not contain information about device access"
- "Salesforce mobile connected app is not configured to require PIN/passcode unlock for inactivity"
- Business controls lacking API Access Control or the right permission set assignments for mobile access

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-session-security.html>

---

## 9. Auditing, monitoring, and detecting misuse

Salesforce puts this under Session Security, in the focus area called "threat
detection and response". This is the section that answers "how would we know if
someone misused their access?"

### 9.1 What Salesforce says the tools are

- "The Setup Audit Trail allows you to view the audit history of administrative actions." This is the log of who changed what in Setup.
- Field History Tracking and Field Audit Trail extend that visibility to changes in record data.
- Real-time event monitoring is available as an add-on or as part of Salesforce Shield.

Salesforce also says to set schedules for auditing login history, user sessions, and
connected app usage, because a regular review catches patterns that real-time tools
miss.

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

### 9.2 Threat detection patterns

- "Audit levels have been specified for all objects in your data model"
- "Field History tracking is enabled for all fields containing private or sensitive data"
- "Steps to review logs available within Salesforce are documented"
- "Audit data is available in reports business stakeholders can understand and access"
- "Regular reviews of audit history and reports take place"
- "Security policies contain a list of events that should trigger a response along with the appropriate response type"
- "Automations are in place to respond to threats by deactivating user accounts or blocking access"
- "All automated responses are documented clearly"
- "Notifications and alerts are configured to notify appropriate users about anomalous activity"
- "Generative AI features are regularly audited Einstein Generative AI Audit Data is enabled"
- "Agent event logs include conversation data Enable the setting for enriched event logs"

### 9.3 Threat detection anti-patterns

- "No processes exist to review auditing information"
- "Audit data is only available through log files that require subject matter expertise"
- "Field History tracking is not consistently enabled for fields containing private or sensitive data"
- "Security policies do not exist or do not include information about threat detection and alerting"
- "There are no automations in place to respond to threats"
- "Documentation for automated responses does not exist or is unclear"
- "Notifications and alerts are either not configured or are ad hoc"
- "Generative AI features are not audited Generative AI conversations are not regularly audited"

Source for both lists:
<https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-session-security.html>

The most quotable one for a non-technical audience is "Audit data is only available
through log files that require subject matter expertise". Salesforce is saying that
audit data nobody outside the technical team can read does not count as auditing.

### 9.4 The Salesforce tools named under Secure

| Tool | Salesforce's own one-line description |
| --- | --- |
| **Data Mask** | "Automatically mask sensitive data in sandboxes" |
| **Field Audit Trail** | "Define a policy to retain archived field history data" |
| **Real-Time Event Monitoring** | "Monitor and detect standard events in Salesforce" |
| **Security Center** | "View security settings across all your orgs, and configure alerts for posture changes" |
| **Security Health Check** | "Identify vulnerabilities in your security settings" |
| **Shield Platform Encryption** | "Encrypt sensitive data at rest and in transit" |

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html>

**Could not confirm:** the Secure page's tool list did not include Transaction Security
Policies, which is a related Salesforce feature for blocking or flagging risky actions
in real time. I looked for it on that page and did not find it. It may be covered
elsewhere in the framework, or under Real-Time Event Monitoring, which is the feature
it belongs to.

---

## 10. Governance: who may change access, and how change is controlled

Well-Architected does not put governance under the Trusted pillar. It puts it under
**Easy > Intentional > Strategy**, and under **Adaptable > Resilient > Application
Lifecycle Management**. That placement matters: Salesforce treats "who decides" as a
delivery discipline, not a security control, even though the outcome is a security
outcome.

### 10.1 The governance framework questions

The Intentional page lists the questions a governance system has to answer. These are
Salesforce's own words.

**Work requests:**

> "How can users ask for functionality or features? How are bugs reported?"

**Prioritization and planning:**

> "Who decides what work requests matter? How is work scoped, prioritized, and
> accepted or signed off on?"

**Environments and release planning:**

> "What is the environment pipeline for development, testing, and release? Who does
> what to provision, refresh, and provide access? Who handles deployments and
> validation? How and when are changes released?"

**Service ownership and support:**

> "Who supports what? Who handles 'hot-fix' production issues? How are those items
> tested and released? Who is responsible for the overall security standards of the
> org?"

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/intentional.html>

That last question is the one that directly answers "who may change access": Salesforce
says a named person or team must own the org's security standards, and that the
governance framework has to say who that is.

### 10.2 Governance patterns and anti-patterns

**Patterns:**

- Users can easily report bugs and request features
- The prioritization process is documented and transparent
- Environment strategy is clearly documented
- Release planning is predictable and transparent
- Clear accountability throughout the application lifecycle

**Anti-patterns:**

- Bug reports and feature requests are ad hoc
- Work items lack clear prioritization
- Environments are provisioned unpredictably
- Releases are unpredictable for teams and users
- Unclear accountability

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/intentional.html>

### 10.3 How change is controlled over time

The Resilient page covers Application Lifecycle Management, which is Salesforce's name
for managing software from creation through retirement. Its position on change
control:

**Source control is the record, not the org.** Salesforce says to adopt source-driven
development, where "source control is the source of the metadata that you want to
release. Environments are just places where your teams do their work." It adds:
"Treat environments as places where work happens for a fixed amount of time", keep
"environments as ephemeral", and remember that "artifacts endure. They belong in
source control."

**Releases align to governance forums.** Release management should "tightly align with
architectural and development governance" by ensuring "releases are planned well in
advance to align with all relevant governance forums and controls."

**Recommended release mechanisms**, listed by Salesforce in order of stability:

1. Unlocked packages
2. DevOps Center
3. Salesforce CLI with source format
4. Clear release naming conventions

**One explicit prohibition:** "Don't use org-based development or release processes."

**Patterns:** deployments go through the Metadata API using source format, and
deployment logs show a clear, regular release cadence.

**Anti-patterns:** active use of change sets; deployments using `package.xml` format;
uneven deployment clusters that indicate hotfixes and ad hoc rollbacks.

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/resilient.html>

**Worth flagging:** Salesforce lists "deployments use package.xml format" as an
anti-pattern, in contrast to "source format". That is a distinction between two
Salesforce file layouts, not a statement that manifests are bad. A `package.xml`
manifest is still used to select what a source-format deploy includes. The page's
wording is terse and I could not find a fuller explanation of what it means, so treat
this one as noted but not fully understood.

### 10.4 Governance of AI use cases

The Resilient page also names an approval body for AI work:

- "all prioritized Agentforce use cases reviewed and approved by the AI Council"
- "high-risk Agentforce use cases reviewed by Legal and Ethical Use teams"

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/resilient.html>

The Ethical Standards page adds the AI patterns:

- "Policies and approved use cases for AI applications are clear and easy to find"
- "No generative responses are sent directly to end users without points of human involvement"
- "Generative AI is used as an assistant to a human", with human review of accuracy
- "Generative responses always identify data sources used by AI models"
- "Bots and generative AI responses are clearly identified to users"
- "Processes are in place to monitor your organization's AI models for data drift, changes in fairness and bias scores, accuracy, and robustness"
- "Prompt templates are tested for quality", including "toxicity & bias"

And the AI anti-patterns:

- "Generative responses are sent directly to end users without points of human involvement"
- "Bots and generative AI responses are not identified to users"
- "Generative responses do not identify data sources used by AI models"
- "AI monitoring processes do not exist or are not documented"

Source: <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-ethical-standards.html>

---

## 11. Compliant, in brief

Salesforce's definition:

> "A compliant system is designed to adhere to applicable legal and ethical
> guidelines, with its adherence being both measurable and auditable."

The word "auditable" is doing work there. Salesforce's test for compliance is not
whether you follow the rules, it is whether you can prove it.

Compliant has three focus areas: Legal Adherence, Ethical Standards, and Accessibility.
Legal Adherence and Ethical Standards are covered in sections 6 and 10 above.
Accessibility covers data entry and navigation, and its patterns are about testing with
multiple input devices, consistent navigation standards, visible keyboard focus, and
proper colour contrast. Its anti-patterns are ad hoc accessibility testing,
colour-only information cues, and inconsistent navigation patterns. Accessibility is
outside the scope of a security reference, so it is summarised here rather than
quoted in full.

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/compliant.html>

---

## 12. Reliable, in brief

Salesforce's definition:

> "Reliable solutions operate effectively and dependably. They are available, perform
> consistently, and scale to support growing businesses."

Reliable sits inside the Trusted pillar, which surprises people who expect Trusted to
mean only security. Salesforce's reasoning is that a system nobody can rely on is not
one anybody trusts.

| Focus area | Salesforce's definition |
| --- | --- |
| **Availability** | "Availability is a measure of the percentage of time that your system is operational." |
| **Performance** | "System architecture performance is a measure of how much a system processes (throughput) and how fast it responds (latency)." |
| **Scalability** | "Scalability is a system's ability to perform consistently as it evolves and grows." |

One line worth keeping, on why availability work should not be deferred:

> "The longer you defer architecting for availability, the higher the actual cost of
> availability issues will be in the long run."

Salesforce also says availability is a **shared responsibility**: Salesforce handles
the infrastructure, but the availability a customer actually experiences depends on
how the solution was designed.

Two scalability limits Salesforce states as hard numbers, both listed as
anti-patterns when breached:

- No parent record should have more than 10,000 child records
- No user should be assigned more than 10,000 records of the same type

Source: <https://architect.salesforce.com/docs/architect/well-architected/guide/reliable.html>

Reliable is included here for completeness of the Trusted pillar. Its performance and
scalability advice is outside the scope of a security reference.

---

## 13. Templates Salesforce publishes

Two downloadable templates are linked from the Secure pages.

| Template | What it is for | URL |
| --- | --- | --- |
| **Well-Architected Security Policy Template** | Writing down security policy. Salesforce says it covers "overall organizational security, authentication and authorization." | `/docs/architect/resources/guide/security-policy-template` |
| **Design Standards Template** | "Create design standards for your organization." | `/docs/architect/resources/guide/design-standards-template` |

Source: <https://architect.salesforce.com/well-architected/trusted/secure> and
<https://architect.salesforce.com/docs/architect/resources/guide/security-policy-template.html>

The security policy template is offered as a PDF and as an editable Quip document.
Quip is Salesforce's own document tool and requires an account.

**Could not confirm:** the template's page does not list the section names inside the
template itself. I could only confirm the three policy areas it covers. To see the
sections you would have to download the file.

---

## 14. The shortest possible summary

If you read only one part of this document, read this table. It is the well-architected
versus not-well-architected contrast, condensed, for the access-control topic.

| Topic | Well-architected | Not well-architected |
| --- | --- | --- |
| Logins | One login per person, no sharing | Shared accounts |
| Multi-factor authentication | Aligned to the Salesforce MFA Check | Not aligned |
| Who gets what access | Decided by persona, written in a security matrix | Decided ad hoc, no matrix |
| Where permissions live | Permission sets, grouped into permission set groups by business capability | Profiles carrying access control; ad hoc permission sets |
| Profiles | Login IP ranges and login hours only | Holding metadata access control |
| Permission set design | Granular, modular, least privilege | "Redundant or heavily duplicated" |
| Elevated rights (Modify All Data, View All Data) | Use cases "clearly listed" | Not listed |
| Integration accounts | "A unique API only integration user is configured for every integration" | Shared across more than one integration |
| Internal org-wide default | Public Read Only, or Private with a compliance reason | Private with no reason, or Public Read/Write |
| External org-wide default | Private | Anything else without a stated reason |
| Apex sharing | `with sharing` used consistently | Used inconsistently, or default system mode |
| Flow context | User context wherever possible | System context in flows shown to external users |
| Sensitive fields | Classified with Compliance Categorization, Data Owner, Data Sensitivity Level, Field Usage | Sensitive fields with no classification set |
| Field history | Tracked on all private or sensitive fields | Tracked inconsistently |
| Audit review | Regular, in reports business people can read | No process, or log files only an expert can read |
| Response to a threat | Documented triggers, documented responses, automations in place | No automation, ad hoc alerts |
| Security ownership | Someone named owns the org's security standards | Unclear accountability |
| Change control | Source control is the record; predictable releases | Change sets; unpredictable releases; ad hoc rollbacks |

---

## Sources

All retrieved on 2026-08-25.

| # | URL | What it covers |
| --- | --- | --- |
| 1 | <https://architect.salesforce.com/well-architected> | The framework landing page: the three pillars, all sub-characteristics, and all focus areas |
| 2 | <https://architect.salesforce.com/docs/architect/well-architected/guide/overview.html> | What Well-Architected is, who it is for, how the three levels fit together |
| 3 | <https://architect.salesforce.com/docs/architect/well-architected/guide/trusted-overview.html> | The Trusted pillar: its definition, the five things it asks of an architect, the "nothing is more essential" line |
| 4 | <https://architect.salesforce.com/well-architected/trusted/overview> | The same Trusted overview on the live site, including the eight planning questions |
| 5 | <https://architect.salesforce.com/docs/architect/well-architected/guide/secure.html> | The Secure sub-characteristic: definitions of organizational, session, and data security, plus the list of Salesforce tools relevant to Secure |
| 6 | <https://architect.salesforce.com/well-architected/trusted/secure> | The Secure page on the live site: security matrix, personas, least privilege, permission sets versus profiles, org-wide default recommendations, template links |
| 7 | <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-organizational-security.html> | The full pattern and anti-pattern lists for authentication and authorization |
| 8 | <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-session-security.html> | The full pattern and anti-pattern lists for session management, device access, and threat detection and response |
| 9 | <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-data-security.html> | The full pattern and anti-pattern lists for sharing and visibility, and for encryption |
| 10 | <https://architect.salesforce.com/docs/architect/well-architected/guide/compliant.html> | The Compliant sub-characteristic: its definition and its three focus areas |
| 11 | <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-legal-adherence.html> | Data privacy, data classification, data dictionary, security matrix, data residency, and localization patterns |
| 12 | <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/trusted-ethical-standards.html> | AI governance patterns: human oversight, bias testing, disclosure, approved use cases |
| 13 | <https://architect.salesforce.com/docs/architect/well-architected/guide/reliable.html> | The Reliable sub-characteristic: availability, performance, scalability, and the 10,000 record limits |
| 14 | <https://architect.salesforce.com/docs/architect/well-architected/guide/resilient.html> | Application lifecycle management: source-driven development, release mechanisms, the AI Council, deployment patterns |
| 15 | <https://architect.salesforce.com/docs/architect/well-architected/guide/intentional.html> | The governance framework questions and the governance patterns and anti-patterns |
| 16 | <https://architect.salesforce.com/docs/architect/resources/guide/security-policy-template.html> | The downloadable Security Policy Template and what it covers |
| 17 | <https://architect.salesforce.com/docs/architect/well-architected-tools/guide/patterns.html> | The Pattern and Anti-Pattern Explorer landing page |
| 18 | <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/customfield.htm> | Exact definitions and allowed values for the four data classification metadata fields |
| 19 | <https://help.salesforce.com/s/articleView?id=platform.data_classification_intro.htm&language=en_US&type=5> | What Salesforce data classification is and where the settings live |

---

## Things this document could not confirm

Listed together so a later reader does not assume they were checked.

1. **When the Well-Architected pages were written or last updated.** No page carried a
   date. The only date this document can vouch for is 2026-08-25, the day the pages
   were read.
2. **Salesforce's own definition of "pattern" and "anti-pattern".** The Explorer front
   page does not define the terms.
3. **The default picklist values as shown in Setup** for Data Sensitivity Level,
   Compliance Categorization, and Field Usage. The Salesforce Help article would not
   load its body text. The values in section 6.1 come from the Metadata API developer
   documentation and use API names.
4. **Whether Transaction Security Policies appear in the Well-Architected tool list.**
   They were not on the Secure page's tool list.
5. **What Salesforce means by listing "deployments use package.xml format" as an
   anti-pattern.** The wording is terse and no fuller explanation was found.
6. **The section names inside the Security Policy Template.** Only the three policy
   areas it covers were confirmable without downloading the file.
