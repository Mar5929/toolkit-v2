# Watching for misuse: monitoring, auditing and insider threat in Salesforce

This document answers one question: if we cannot lock a capability down, can we watch it
instead? It lists every tool Salesforce sells or includes for spotting misuse of a
Salesforce org, says what each one actually sees, says plainly which ones cost extra
money, and says where each one goes blind. Read it if you are deciding how much access to
give people in a Salesforce org, and you want to know what the fallback is when the
answer to "take this permission away" is no. It assumes no prior Salesforce knowledge and
spells out every term the first time it appears.

**Basis:** built from 65 official Salesforce pages (help.salesforce.com,
developer.salesforce.com, trailhead.salesforce.com), all consulted on 2026-08-25. Of
those, 23 were read in full; the rest are cited from search-engine extracts of the page,
because help.salesforce.com would not load for the retrieval tool that day. Section 16
explains this and lists everything it left unconfirmed. Every source URL is listed at the
bottom with one line saying what it covers.

---

## Read this first: the honest summary

Salesforce gives you a small amount of monitoring for free. It is enough to see who
changed the org's settings, and enough to see who logged in. It is **not** enough to see
who took the data.

Seeing who took the data costs money. It requires an add-on subscription called
**Event Monitoring**, which is also bundled inside a larger add-on called
**Salesforce Shield**. Without one of those two, an org has no record of who exported a
report, who ran a large query through the interface used by data tools, or who downloaded
a file. That gap is the single most important fact in this document.

So the shape of the decision is:

| If you want to... | You need... | Costs extra? |
| --- | --- | --- |
| See who changed a setting in Setup | Setup Audit Trail | No |
| See who logged in, from where | Login History | No |
| See old and new values on up to 20 fields per object | Field History Tracking | No |
| Score your org's security settings against a standard | Security Health Check | No |
| **See who exported a report or downloaded a large data set** | **Event Monitoring add-on, or Shield** | **Yes** |
| Automatically flag a person behaving unlike themselves | Threat Detection, part of Real-Time Event Monitoring | Yes |
| Block a risky action as it happens | Transaction Security Policies | Yes |
| Keep field history for years, on more fields | Field Audit Trail, part of Shield | Yes |
| Encrypt data at rest with your own keys | Shield Platform Encryption | Yes |
| Watch several orgs from one dashboard | Security Center | Yes |

"Costs extra" means it is not part of the base Salesforce subscription and has to be
bought as an add-on. Salesforce does not publish add-on pricing on its documentation
pages, so this document says nothing about the price. Source for the licence split:
<https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_event_log_files.htm>

---

## 1. Security Health Check

### What it is

Health Check is a single page in Salesforce Setup. Setup is the administration area of a
Salesforce org. Health Check reads your org's security-related configuration settings,
compares each one against a recommended value, and gives you one number out of 100.

It is included in the base product at no extra cost. Salesforce's own Trailhead training
describes Health Check as "available out of the box", in contrast to Security Center,
which has to be bought.
<https://trailhead.salesforce.com/content/learn/modules/security_basics/security_basics_healthcheck>

### What it measures

Health Check looks at org-wide configuration settings, not at people and not at data.
Examples of settings it checks, taken from Salesforce's own training material:

- Minimum password length, and how many failed login attempts are allowed before lockout
- Session timeout, meaning how long a person can be idle before being logged out
- Whether HTTPS is required, so traffic is encrypted in transit
- Clickjack protection, which stops your pages being embedded inside a hostile page
- Cross-site scripting protection, which stops a hostile script running in a user's browser
- HttpOnly on cookies, which stops JavaScript reading the session cookie
- Whether certificate-based authentication is enabled

Sources:
<https://trailhead.salesforce.com/content/learn/modules/secure-salesforce-configuration/run-health-check>
and
<https://trailhead.salesforce.com/content/learn/modules/security_basics/security_basics_healthcheck>

### The baseline standard, and how the score is produced

Salesforce publishes a set of recommended values called the **Salesforce Baseline
Standard**. Each setting in your org is shown next to that standard value. Settings that
meet or beat the standard raise your score. Settings below it lower your score.

Salesforce sorts each checked setting into one of four risk categories:

| Risk category | Effect on the score |
| --- | --- |
| High-Risk | Counts the most |
| Medium-Risk | Counts in the middle |
| Low-Risk | Counts the least |
| Informational | Does not affect the score at all |

If every setting meets or beats the standard, the score is 100 percent.

Salesforce calls the arithmetic behind the score a "proprietary formula" and does not
publish the exact weights. So you can know which category a setting sits in, but you
cannot reproduce the number yourself.
<https://help.salesforce.com/s/articleView?id=sf.security_health_check_score.htm&language=en_US&type=5>

### Custom baselines

If the Salesforce standard is not strict enough for your industry, you can upload your own
baseline as an XML file and score against that instead. Salesforce's training material
gives regulated industries, naming finance and healthcare, as the reason this exists.
<https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_custom_baseline_create.htm&language=en_US>

### Where Health Check goes blind

Health Check scores **settings**. It says nothing at all about behaviour. A person can
export your entire customer list on a day when the Health Check score is 100. Do not
treat a good Health Check score as evidence that nothing bad is happening.

---

## 2. Setup Audit Trail

### What it is

Setup Audit Trail is a running log of configuration changes made in Setup. It is included
in the base product at no extra cost.

### What it captures

For each change it records:

- The date and time of the change
- Who made it
- What the change was, in a short text description
- A **Delegate User** column, filled in when an administrator or a Salesforce support
  representative made the change while acting on behalf of another person
- An **AI Agent** column, filled in when the change was made through Setup with
  Agentforce, naming the agent and its identifier, with the human who used the agent shown
  in the User column

Source:
<https://help.salesforce.com/s/articleView?id=sf.admin_monitorsetup.htm&language=en_US&type=5>

### Retention, and the two different views

- The Setup page shows only the **20 most recent** changes.
- You can download the **complete history for the past 180 days** as a file. After 180
  days the records are deleted.

180 days is roughly six months. There is no way to extend it. If you need setup history
older than that, you have to export it on a schedule and keep it yourself.

Salesforce also exposes this data as an object called `SetupAuditTrail`, which can be
queried programmatically, so an automated export is possible.
<https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_setupaudittrail.htm>

### What Setup Audit Trail does NOT capture

This is the part people get wrong. Setup Audit Trail is about **configuration**, not about
**data**. It does not record:

- Any change to a record. If someone edits an Account, Setup Audit Trail is silent. That
  is Field History Tracking's job.
- Any report being run.
- Any report being exported.
- Any data being downloaded, by any method.
- Any query run against the org.
- Any file or attachment being downloaded.

So Setup Audit Trail will tell you that someone granted themselves a powerful permission.
It will not tell you what they did with it. That second half needs Event Monitoring.

I could not find a single Salesforce page that states this list of exclusions in one
place. The list above is assembled from what the Setup Audit Trail page says it covers
(setup changes) plus the existence of separate, differently licensed features for each
excluded item. Treat it as a reasoned conclusion rather than a direct quotation.

---

## 3. Field History Tracking

### What it is

Field History Tracking records the old value and the new value each time a chosen field on
a chosen object changes, along with who changed it and when. An "object" in Salesforce
means a type of record, such as Account or Contact. It is included in the base product at
no extra cost.

### The limits

| Limit | Value without Field Audit Trail |
| --- | --- |
| Fields you can track per object | 20 |
| How long history is kept, viewed in the interface | Up to 18 months |
| How long history is kept, read programmatically | Up to 24 months |

Source:
<https://help.salesforce.com/s/articleView?language=en_US&id=sf.tracking_field_history.htm&type=5>

20 fields per object is a hard cap and it is low. On a merged org holding patient-adjacent
or contract data, you will run out of slots and have to choose which fields matter most.

### What it does not do

Field History Tracking records **changes**. It does not record **reads**. If someone opens
a record, looks at every field, and changes nothing, Field History Tracking has no entry
for it. Watching for people who read too much is Event Monitoring's job, not this one's.

---

## 4. Field Audit Trail

### What it is

Field Audit Trail is the paid upgrade to Field History Tracking. It is part of Salesforce
Shield. It moves old field history into a long-term store called `FieldHistoryArchive` and
lets you keep it for far longer, on more fields.

### What it changes

| Limit | Standard | With Field Audit Trail |
| --- | --- | --- |
| Fields tracked per object | 20 | 60 (see the warning below) |
| Retention | 18 months in the interface, 24 months programmatically | Up to 10 years, or until you delete it (see the warning below) |

**Warning: Salesforce's own pages disagree with each other on both of these numbers.**
Retrieved 2026-08-25, I found:

- 60 fields per object, on the Shield training module
  (<https://trailhead.salesforce.com/content/learn/modules/secure-salesforce-configuration/protect-apps-with-shield>)
- 50 fields per object, on the Field Audit Trail training module
  (<https://trailhead.salesforce.com/content/learn/modules/field-audit-trail-basics/configure-field-audit-trail>)
- 200 fields per object, quoted from a Salesforce help page in search results

And on retention:

- "The overall maximum time to retain a field history record is 10 years", on the Field
  Audit Trail developer documentation
- "keep field history data indefinitely", with a retention period of "Until deleted", on
  the same documentation set
  (<https://developer.salesforce.com/docs/atlas.en-us.field_history_retention.meta/field_history_retention/meta_historyretentionpolicy.htm>)

I could not resolve either conflict from public documentation. **Confirm both numbers
against the actual org before designing anything that depends on them.** The safe planning
assumption is the smallest figure: 50 fields per object and 10 years.

### How it is configured

The retention policy is set through the Metadata API, which is the programmatic interface
for an org's configuration, not through a normal Setup page. Two settings control it:

- `archiveAfterMonths`: how long history stays in the normal history list before moving to
  the archive. The default is 18 months in production and 1 month in a sandbox.
- `archiveRetentionYears`: how long it stays in the archive after that.

Source:
<https://developer.salesforce.com/docs/atlas.en-us.field_history_retention.meta/field_history_retention/meta_historyretentionpolicy.htm>

---

## 5. Event Monitoring

This is the centre of the whole "watch instead of block" question, so it gets the most
space.

### What it is

Event Monitoring gives you a detailed record of what people actually did in the org: what
they clicked, what they queried, what they ran, and what they downloaded. Salesforce
describes it as letting you "see the granular details of user activity in an
organization".

It comes in two halves, and they are licensed the same way but behave very differently:

1. **Event Log Files**, the older half. Files delivered daily or hourly, after the fact.
   More than 60 event types.
2. **Real-Time Event Monitoring**, the newer half. Events streamed within seconds, and
   stored in long-term objects. Around 20 event types.

Source:
<https://trailhead.salesforce.com/content/learn/modules/event_monitoring/event_monitoring_intro>

### Does it need Shield, or is it sold separately?

**Both are true, and this matters for the buying decision.** Event Monitoring is available
either as its own add-on subscription, called the Event Monitoring add-on, or as one of
the components bundled inside the larger Salesforce Shield add-on. The Salesforce
documentation states the requirement as "either the Salesforce Shield or Salesforce Event
Monitoring add-on subscription".

So you do **not** have to buy the whole of Shield to get Event Monitoring. You can buy
Event Monitoring on its own. That is the cheaper path if the goal is watching rather than
encrypting.

Source, stated on every event object page, for example:
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_apievent.htm>

Editions: Enterprise, Unlimited, or Developer Edition. Developer Edition gets it free,
which makes a Developer Edition org a legitimate place to trial it before buying.
<https://trailhead.salesforce.com/content/learn/modules/realtime-event-monitoring/get-to-know-realtime-events-and-transaction-security>

### What you get for free, without any add-on

Every org gets a small set of event log files at no cost, with **one day** of retention:

- Login
- Logout
- Apex Unexpected Exception
- CORS Violation Record
- CSP Violation
- Hostname Redirects
- API Total Usage

Source:
<https://trailhead.salesforce.com/content/learn/modules/event-log-files-quick-look/access-and-use-your-event-log-files>

Note what is not on that free list: nothing about reports, nothing about exports, nothing
about files. The free tier tells you people arrived. It does not tell you what they took.

### Retention

| Org type | Event Log File retention |
| --- | --- |
| Developer Edition and trial orgs | 1 day |
| Base subscription, free event types only | 1 day |
| With Shield or the Event Monitoring add-on | 1 year by default, then automatically deleted; the period can be adjusted |

Source:
<https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_event_log_files.htm>

Older Salesforce material cites a 30-day retention figure for Event Monitoring. I could
not confirm 30 days as the current figure on any page retrieved on 2026-08-25, and the
current REST API documentation says 1 year. Treat the 30-day figure as out of date unless
the org proves otherwise.

For Real-Time Event Monitoring, stored events are kept for "six months to 10 years"
depending on the event type. I could not find a per-event-type retention table, so which
events get 6 months and which get 10 years is unconfirmed.
<https://trailhead.salesforce.com/content/learn/modules/realtime-event-monitoring/get-to-know-realtime-events-and-transaction-security>

### Delivery timing

- Daily log files are generated during off-peak hours **the day after** the event.
- Hourly log files typically appear **3 to 6 hours** after the event, and can be later.

So Event Log Files are for investigating after the fact. They are not an alarm. If you
need an alarm, you need Real-Time Event Monitoring and Transaction Security, covered
below.
<https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_event_log_files.htm>

### Permissions needed to read the logs

To query Event Log Files, a person needs the **View Event Log Files** permission and the
**API Enabled** permission. Someone with **View All Data** can also reach the data.

For Real-Time Event Monitoring, the permission is **View Real-Time Event Monitoring
Data**. If that permission does not appear in your org's list at all, it means the org has
neither Shield nor the Event Monitoring add-on.

Sources:
<https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_event_log_files.htm>
and
<https://help.salesforce.com/s/articleView?language=en_US&id=xcloud.real_time_event_monitoring_enable.htm&type=5>

Note the trap: giving someone the ability to review the logs also tends to require giving
them broad read access. Keep the log reviewers separate from the people whose behaviour is
being reviewed.

### The event types that reveal large data exports and report runs

These are the specific names to ask for. Everything below is an Event Log File event type
unless marked otherwise.

| Event type | What it reveals | Why it matters for misuse |
| --- | --- | --- |
| **Report Export** | A user exported a report as a file | The single most direct record of a person taking data out through the interface |
| **Report** | A report was generated or accessed | Shows the run even when nothing was exported |
| **Asynchronous Report Run** | A report was generated in the background | Catches large reports that run out of band |
| **Multiblock Report** | A multi-section report ran | A joined report can pull several objects at once |
| **Bulk API** | A Bulk API 1.0 operation ran | Bulk API is the interface used by data loading tools for very large jobs |
| **Bulk API Request** | An individual Bulk API 1.0 request | Finer detail than the above |
| **Bulk API 2.0** | A Bulk API 2.0 job ran | The current version of the same interface |
| **API** family (REST API, SOAP API, Composite API, GraphQL Query) | Programmatic calls into the org | Where a scripted extraction shows up |
| **Content Transfer** | Downloads, uploads and previews of files and attachments | Catches someone taking documents rather than records |
| **Content Distribution** | A file was shared out through a distribution link | Catches sharing a file to the outside world |
| **Document Attachment Downloads** | An attachment was downloaded | Older attachment model equivalent |
| **URI** | Pages requested in the classic interface | Reconstructs a browsing session |
| **Lightning Page View** and **Lightning Interaction** | Pages and clicks in the modern interface | Reconstructs a browsing session |
| **Login** and **Logout** | Session start and end | Anchors everything else to a session |
| **Login As** | An administrator logged in as another user | Catches impersonation, an insider-threat classic |
| **Permission Update** | A permission or access change | Catches someone granting themselves more access |
| **Metadata API Operation** | A configuration deployment or retrieval | Catches someone pulling the org's whole configuration out |
| **Change Set Operation** | A change set was deployed or retrieved | Same risk, different mechanism |
| **Package Install** | A managed package was installed | Catches unvetted code entering the org |
| **Transaction Security** | A Transaction Security policy fired | Your own alarms, logged |
| **Wave Download** | An analytics dataset was downloaded | Catches extraction from the analytics layer |
| **Insufficient Access** | Someone was denied access | Repeated denials are a probing signal |
| **Search** and **Search Click** | Search queries and clicks on results | Shows what someone went looking for |

Full list, from which the above is drawn:
<https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_supportedeventtypes.htm>

Detail pages:
<https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_reportexport.htm>,
<https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_contenttransfer.htm>,
<https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_bulkapi.htm>

---

## 6. Real-Time Event Monitoring

### What it is

The newer half of Event Monitoring. Instead of waiting for a file, events are published
within seconds and can be subscribed to by other systems. Same licence requirement as
Event Log Files: Shield, or the Event Monitoring add-on.

Each event type generally exists twice:

- A **streaming** version, for example `ReportEventStream`, which fires immediately and is
  not stored.
- A **stored** version, for example `ReportEvent`, held in a long-term store called a big
  object, which you can query later.

Source:
<https://trailhead.salesforce.com/content/learn/modules/realtime-event-monitoring/get-to-know-realtime-events-and-transaction-security>

### The event types

The Trailhead module lists these, retrieved 2026-08-25:

ApiAnomalyEvent, ApiEventStream, BulkApiResultEvent, ConcurLongRunApexErrEvent,
CredentialStuffingEvent, FileEvent, GuestUserAnomalyEvent, IdentityVerificationEvent,
LightningUriEventStream, ListViewEventStream, LoginAsEventStream, LoginEventStream,
LogoutEventStream, MobileEmailEvent, MobileEnforcedPolicyEvent, MobileScreenshotEvent,
MobileTelephonyEvent, PermissionSetEvent, ReportAnomalyEvent, ReportEventStream,
SessionHijackingEvent, UriEventStream.

The four that matter most for data leaving the org:

| Event | What it captures | Notable fields |
| --- | --- | --- |
| **ReportEvent** | Every report run, including exports | `RowsProcessed`, `Operation` (which tells you whether it was a run or an export), `ReportId`, `Format`, `UserId`, `SourceIp`, `ColumnHeaders`, and even `Records` holding the returned data as JSON |
| **ApiEvent** | Read-only API calls: `query()`, `queryMore()`, `count()`, through SOAP and Bulk APIs | `Query` holding the actual query text, `RowsReturned`, `QueriedEntities`, `SourceIp`, `ElapsedTime` |
| **BulkApiResultEvent** | A user downloading the results of a Bulk API or Bulk API 2.0 request | `Query`, `UserId`, `SourceIp`, `SessionKey`, `LoginHistoryId` |
| **ListViewEvent** | A user viewing a list view, through the interface or the API | Catches bulk reading without a report |

`ReportEvent` is available from API version 46.0. `BulkApiResultEvent` is available from
API version 50.0.

Sources:
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_reportevent.htm>,
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_apievent.htm>,
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_bulkapiresultevent.htm>

**An important gap in ApiEvent:** the documentation states it does not capture Tooling API
calls or mobile app requests. The Tooling API is the programmatic interface used by
development tools. So a person using a developer tool is partly invisible to this event
type.

---

## 7. Threat Detection

### What it is

Threat Detection is a set of machine learning models that run inside Real-Time Event
Monitoring and flag suspicious behaviour without you writing any rules. Salesforce
describes it as using "statistical and machine learning methods to detect threats to your
Salesforce org". It requires the same licence: Shield, or the Event Monitoring add-on,
plus the **View Real-Time Event Monitoring Data** permission.

There is a Threat Detection app in the Salesforce interface for reviewing what it found,
and a `ThreatDetectionFeedback` object where you tell Salesforce whether a flag was right
or wrong, which feeds the models.

### The four detections, and what each one actually flags

| Detection | Event object | What it actually flags |
| --- | --- | --- |
| **Session Hijacking** | `SessionHijackingEvent` | Someone else has taken over a live session using a stolen session identifier. Salesforce compares the browser fingerprint during a session against the one known at the start. It watches five things: IP address, user agent, platform, screen resolution and window dimensions. It produces a score from 0.0 to 1.0. A score of 0.8 or higher means two different browsers appear to be active in the same session. |
| **Credential Stuffing** | `CredentialStuffingEvent` | Someone **successfully logged in** during an identified credential stuffing attack. Credential stuffing means an attacker tries stolen username and password pairs at scale until one works. The `Score` field is always 1, because the event only fires on a successful login, so there is nothing probabilistic about it. |
| **Report Anomaly** | `ReportAnomalyEvent` and `ReportAnomalyEventStore` | A person is running or exporting reports in a way unlike their own past behaviour, including unsaved reports. Score runs 0 to 100. The `Summary` field gives a plain reason, for example "Report was exported from an infrequent network" or "Report was generated with an unusually high number of rows". A `SecurityEventData` field breaks down which factors contributed and by what percentage. |
| **API Anomaly** | `ApiAnomalyEvent` and `ApiAnomalyEventStore` | A person is making programmatic calls unlike their own past behaviour. Score runs 0 to 1, where low means normal and high means different. `Summary` gives a reason, for example "API was generated with an unusually high number of rows". |

Sources:
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_sessionhijackingevent.htm>,
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_credentialstuffingevent.htm>,
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_reportanomalyeventstore.htm>,
<https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_apianomalyevent.htm>

There is a fifth, `GuestUserAnomalyEvent`, which watches unauthenticated visitors to a
public site rather than employees. It is outside the insider-threat question, so this
document does not cover it.

### The one thing to understand about how Threat Detection judges people

Salesforce is explicit that the model compares a person against **their own history**, not
against a fixed threshold and not against other people. Salesforce's own words: an anomaly
is "any user activity that is sufficiently different from the historical activity of the
same user", and "Salesforce doesn't look at the actual data that a user interacts with, it
looks at how the user interacts with the data".

Two consequences follow, and both matter:

1. **A person who has always exported large amounts of data will not be flagged for doing
   it again.** Their baseline already includes it. Threat Detection catches a change in
   behaviour, not a level of behaviour. So it is weakest exactly where an established
   insider with broad access is concerned.
2. **A new employee has no baseline yet**, so early behaviour has less to compare against.
   I could not find documentation on how long the model needs before it is reliable, so
   treat that as unconfirmed.

Source:
<https://help.salesforce.com/s/articleView?id=sf.real_time_em_threat_reportanomaly.htm&language=en_US&type=5>
and
<https://help.salesforce.com/s/articleView?id=sf.real_time_em_threat_detection_bestpractices.htm&language=en_US&type=5>

---

## 8. Transaction Security Policies

### What they are

Everything above watches. Transaction Security **acts**. A Transaction Security Policy is
a rule that looks at an event as it happens and can stop the action before it completes.
It requires Shield or the Event Monitoring add-on.

Salesforce's description: policies "enforce policies in near real time. When a policy is
triggered, notifications are sent through email or in-app notifications."

### What a policy can do when it fires

| Action | Effect |
| --- | --- |
| **Block** | The operation does not complete. The person is stopped. |
| **Require multi-factor authentication** | The person has to prove who they are again with a second factor before the action proceeds. Salesforce calls this "a higher level of assurance". |
| **Do nothing** | The policy records that it fired but allows the action. Useful for testing a rule before turning it on for real. |

On top of the action, notifications can be sent by email, in-app, or both, with a default
message or a custom one.

Source:
<https://trailhead.salesforce.com/content/learn/modules/enhanced_transaction_security/enhanced_transaction_security_basics>

### Which events a policy can be built on

Policies can be created on these Real-Time Event Monitoring events:

| Policy type | Watches |
| --- | --- |
| ApiEvent | Programmatic queries. Used to stop unauthorised data extraction. |
| ApiAnomalyEventStore | An API anomaly flagged by Threat Detection |
| BulkApiResultEventStore | Someone downloading Bulk API results |
| CredentialStuffingEventStore | A successful login during a credential stuffing attack |
| FileEvent | File uploads, downloads, previews |
| ListViewEvent | List view access through the interface or API |
| LoginEvent | Logins. Used to block untrusted locations or unsupported browsers. |
| PermissionSetEventStore | Permission assignments |
| ReportEvent | Report views and exports. Used to block or require MFA. |
| ReportAnomalyEventStore | A report anomaly flagged by Threat Detection |
| SessionHijackingEventStore | A suspected session takeover |

Source:
<https://help.salesforce.com/s/articleView?id=sf.enhanced_transaction_security_policy_list.htm&language=en_US>

### How a policy is built

Two ways:

- **Condition Builder**, a point-and-click interface with no code. You pick the event, then
  build conditions from that event's fields with operators such as "equals" and "greater
  than or equal to", combined with "all conditions are met" logic.
- **Apex**, which is Salesforce's programming language, for logic Condition Builder cannot
  express.

Salesforce's own training gives the worked example that matters most here. To stop a large
report export:

> Event: Report Event. Conditions: `Rows Processed` greater than or equal to 1000
> **AND** `Operation` equals `ReportExported`. Action: Block, plus an email to the security
> team.

That is, in one rule, the answer to "can we watch instead of blocking". You can do better
than watching: you can set a size threshold above which an export simply does not happen.

Source:
<https://trailhead.salesforce.com/content/learn/modules/enhanced_transaction_security/enhanced_transaction_security_create>

### The limits of this

- It only covers the eleven event types listed above. An action Salesforce does not publish
  an event for cannot be blocked this way.
- It needs the paid licence. Without Shield or Event Monitoring, none of it exists.
- A threshold has to be chosen, and a person who knows the threshold can stay under it by
  exporting in smaller batches. Nothing in the documentation suggests policies aggregate
  across a session or a day, and I could not confirm whether they can. Assume each event is
  judged on its own.

---

## 9. Login Forensics

Login Forensics is a feature that surfaces login activity for security review, sitting
alongside Event Monitoring. It has its own Setup pages, "Enable Login Forensics" and
"Considerations for Using Login Forensics".

Sources:
<https://help.salesforce.com/s/articleView?id=sf.monitor_login_forensics_enable.htm&language=en_US&type=5>
and
<https://help.salesforce.com/s/articleView?id=sf.monitor_login_forensics_considerations.htm&language=en_US&type=5>

**I could not retrieve the content of either page.** Both are on help.salesforce.com,
which would not render for me on 2026-08-25, and search result snippets did not quote
enough to describe the feature accurately. So this document cannot tell you what Login
Forensics captures, what it costs, or how it differs from the plain Login History page
that every org has for free. Treat Login Forensics as a known unknown and check it
directly in the org or with Salesforce before relying on it.

What I can say with confidence, because it is documented elsewhere: every org, with no
add-on, has a **Login History** page in Setup showing who logged in, when, from what IP
address, using which browser, and whether the login succeeded or failed. That is the free
baseline for login visibility.

---

## 10. Salesforce Shield in full

### What Shield is

Shield is a bundle of security add-ons. Salesforce's description: tools to "protect
business-critical apps with enhanced encryption, event monitoring, historical data
retention, and data classification capabilities".

The documentation retrieved on 2026-08-25 lists **four** components, not three:

| Component | What it does |
| --- | --- |
| **Platform Encryption** | Encrypts data at rest, with encryption keys you control |
| **Event Monitoring** | Detailed records of user activity, covered in sections 5 to 8 above |
| **Field Audit Trail** | Long retention of field history, on more fields, covered in section 4 |
| **Data Detect** | Scans the org to find sensitive data such as credit card numbers and social security numbers, and applies classification tags |

Source:
<https://trailhead.salesforce.com/content/learn/modules/secure-salesforce-configuration/protect-apps-with-shield>

Event Monitoring is separately purchasable outside Shield, as established in section 5. I
could not confirm whether Platform Encryption, Field Audit Trail or Data Detect can be
bought individually. Assume they come with Shield unless Salesforce says otherwise.

### Shield Platform Encryption: what it does

It encrypts data at rest, meaning the data as stored on disk. Keys are derived using
hardware security modules, and you can either let Salesforce generate the key material or
supply your own.

### Shield Platform Encryption: what it costs you in lost function

This is the part that decides whether it is worth buying, so it gets its own table. Every
row is from Salesforce's own considerations pages.

| What breaks | Detail |
| --- | --- |
| **Sorting** | You cannot sort records in a list view by a field containing encrypted data. |
| **Filtering, with probabilistic encryption** | Probabilistic encryption produces a different ciphertext each time, so filtering does not work at all on those fields. Salesforce states this "results in a loss of functionality, such as filtering operations". |
| **Filtering, with deterministic encryption** | Deterministic encryption produces the same ciphertext for the same input, so exact-match filtering works. It uses AES 256-bit CBC keys with a field-specific static initialisation vector. It comes in case-sensitive and case-insensitive versions, chosen field by field. |
| **Formula fields** | A formula field that references encrypted data works **only in Salesforce Classic**. It does not work in Lightning Experience, the modern interface, and does not work through SOQL, the query language. |
| **Formula field count** | At most 200 formula fields can reference a given encrypted custom field. A field already referenced by more than 200 formula fields cannot be encrypted at all. |
| **Case Feed** | A formula field referring to an encrypted field cannot be used in Case Feed. |
| **Reports** | If you encrypt the User email field, you cannot use it as a report filter. |
| **Flows and processes** | You cannot reference encrypted fields in filtering or sorting contexts inside flows, orchestrations and processes. |
| **Search** | Search is supported, but Salesforce notes that "search and reporting performance might be slightly affected due to the encryption process". |

Sources:
<https://help.salesforce.com/s/articleView?id=xcloud.security_pe_considerations_general.htm&language=en_US&type=5>,
<https://help.salesforce.com/s/articleView?id=sf.security_pe_deterministic.htm&language=en_US&type=5>,
<https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_pe_formulas.htm&language=th>

Deterministic encryption recovers filtering but not sorting, and I could not confirm from
the documentation whether it supports wildcard or range comparisons. Assume it does not,
and confirm before designing around it.

### Shield Platform Encryption: what it is NOT

This is the most important paragraph about Platform Encryption, and Salesforce says it
plainly:

> "Encryption is not the same thing as field-level security or object-level security. You
> must put those controls in place before you implement your encryption policy."

> "Encryption doesn't take the place of field-level access controls. At runtime, encrypted
> data looks just like unencrypted data from the user's point of view."

> "If you have data that you don't want some users to see, revisit those users'
> field-level security settings, record access settings, and object permissions."

In plain terms: **Platform Encryption does not stop an insider seeing anything.** A person
logged into Salesforce who has permission to see a field sees the real value, encrypted or
not. Encryption protects against someone getting at the stored data by going around
Salesforce, for example at the database or backup level. It does nothing whatever about a
legitimate user misusing legitimate access.

So for the insider-threat question this document is about, **Platform Encryption is not an
answer.** Event Monitoring is.

Source:
<https://help.salesforce.com/s/articleView?id=sf.security_pe_overview.htm&language=en_US&type=5>
and
<https://help.salesforce.com/s/articleView?id=xcloud.security_pe_concepts.htm&language=en_US>

### Related permissions

- **Manage Encryption Keys** is needed to generate, destroy, export and import the key
  material, called tenant secrets.
- **Customize Application** is needed to view the encryption setup pages and edit the
  encryption policy.

Source:
<https://trailhead.salesforce.com/content/learn/modules/spe_admins/spe_admins_set_up_hoc>

Note that **View Encrypted Data** is a different, older feature called Classic Encryption,
not Shield Platform Encryption. Salesforce documents that the View Encrypted Data
permission is not needed with Shield Platform Encryption.
<https://help.salesforce.com/s/articleView?id=000382508&language=en_US&type=1>

---

## 11. Data export controls

### What limits exist

| Route out of the org | What limits it | Can it be restricted? |
| --- | --- | --- |
| **Report export** | The **Export Reports** permission | Yes. Remove the permission and the person cannot export reports. |
| **Report export, extra layer** | Salesforce is rolling out mandatory time-based step-up multi-factor authentication on report exports. A person has to complete an additional identity challenge if enough time has passed since the last one. | Not a restriction you configure, it is enforced by Salesforce. It can be avoided only if the person's profile has Login IP restrictions configured and the IP has not changed, or the org enforces login IP ranges on every request. |
| **Data Loader and similar tools** | The **API Enabled** permission. These tools reach the org through the API. | Yes. Remove API Enabled and the tools cannot connect at all. |
| **Bulk API permanent deletion** | The **Bulk API Hard Delete** permission | Yes. It is off by default and is not even available on the standard System Administrator profile; it has to be added through a cloned profile or a permission set. |
| **Data Export Service**, the built-in scheduled backup in Setup | Frequency limits: manual export once every 7 days on Enterprise, Performance and Unlimited Edition; once every 29 days on Professional and Developer Edition | The frequency is fixed by Salesforce. Access is controlled by Setup access. |
| **Connected apps** | IP ranges can be set per connected app | Yes |
| **Any login** | Login IP ranges set on a profile | Yes |

Sources:
<https://help.salesforce.com/s/articleView?id=000383962&language=en_US&type=1>,
<https://help.salesforce.com/s/articleView?id=005321566&language=en_US&type=1>,
<https://help.salesforce.com/s/articleView?id=000385694&language=en_US&type=1>,
<https://help.salesforce.com/s/articleView?id=platform.login_ip_ranges.htm&language=en_US&type=5>,
<https://help.salesforce.com/s/articleView?id=sf.connected_app_edit_ip_ranges.htm&language=en_US&type=5>

### The practical point

Two of these are genuinely strong and cost nothing: removing **Export Reports** and
removing **API Enabled**. Between them they close the two widest doors. Restricting login
IP ranges on a profile is a third, and it has the useful side effect of exempting people
from the step-up MFA prompt on report exports.

None of them help against a person whose job requires those permissions. For those people,
Transaction Security with a row-count threshold, plus Report Anomaly detection, is the
fallback, and both need the paid licence.

---

## 12. The risky permissions, and how to detect their use

This is the table to keep. "How to detect its use" says which log or event would show a
person exercising the permission, and marks whether that detection needs the paid add-on.

| Permission | What it lets a person do | How to detect its use | Needs paid add-on to detect? |
| --- | --- | --- | --- |
| **Export Reports** | Export report data out of Salesforce as a file | `Report Export` event log file type; `ReportEvent` with `Operation` = `ReportExported` in Real-Time Event Monitoring; `ReportAnomalyEvent` if the behaviour is unusual for that person | Yes |
| **Manage Reports in Public Folders** | Create, edit, delete and move reports in shared folders that other people rely on. Effectively lets someone build any report they want over any data they can see, and change reports others use. | `Report` event log file type shows runs; Setup Audit Trail does **not** cover report changes | Yes, for the runs |
| **View All Data** | Read every record of every object, ignoring sharing rules and sharing settings. Does **not** override field-level security, so field permissions or View All Fields are still needed per field. | Nothing logs the fact of the permission being used. Detect the consequences: `Report`, `Report Export`, `API`, `ListViewEvent`. Detect the grant itself in Setup Audit Trail and the `Permission Update` event. | Yes, for consequences. No, for the grant. |
| **Modify All Data** | Read, create, edit and delete every record of every object, ignoring all sharing rules and object permissions. Salesforce documents that turning it on automatically enables Read, Create, Edit, Delete, View All Records and Modify All Records on every standard and custom object. The single most powerful data permission in Salesforce. | Field History Tracking shows what changed on tracked fields; `Database Save` event log type shows record changes; `Permission Update` and Setup Audit Trail show the grant | Yes, for `Database Save`. No, for field history and the grant. |
| **API Enabled** | Reach the org through programmatic interfaces rather than the browser. This is what makes Data Loader, scripts, and integration tools work. Without it those tools cannot connect. | `API`, `REST API`, `SOAP API`, `Bulk API`, `Bulk API 2.0`, `Composite API`, `GraphQL Query` event log types; `ApiEvent` and `ApiAnomalyEvent` in Real-Time Event Monitoring | Yes |
| **Bulk API Hard Delete** | Permanently delete records through the Bulk API, bypassing the Recycle Bin. There is no undo. Off by default and cannot be added to the standard System Administrator profile directly. | `Bulk API` and `Bulk API 2.0` event log types. Note that because records are gone, after-the-fact detection is all you get. | Yes |
| **Manage Users** | Create, edit and deactivate users, reset passwords, and change what other people can do. A person with this can grant themselves or an accomplice any other permission on this list. | Setup Audit Trail records the change and who made it; `Permission Update` event log type; `PermissionSetEvent` in Real-Time Event Monitoring, which can also carry a Transaction Security policy | No, for Setup Audit Trail. Yes, for the events. |
| **Customize Application** | Change the org's configuration: objects, fields, page layouts, validation rules, encryption policy, and more. Automatically enabled for the System Administrator profile. A person with this can weaken controls rather than break them. | Setup Audit Trail records every configuration change with who and when; `Metadata API Operation` and `Change Set Operation` event log types catch programmatic configuration moves | No, for Setup Audit Trail. Yes, for the events. |
| **Author Apex** | Write and deploy Apex, Salesforce's programming language, and execute arbitrary Apex through the `executeAnonymous()` API call, for example via Workbench or the Developer Console. Apex normally runs without enforcing the running user's sharing rules unless the code says otherwise, so this is close to unlimited data access by another route. | `Apex Execution`, `Apex Unexpected Exception`, and the related Apex event log types; Setup Audit Trail records class deployment | Yes, for the Apex event types. No, for the deployment record. |
| **View Encrypted Data** | See the real values in fields protected by Classic Encryption, the older encryption feature. Without it, those fields appear masked. It also governs cloning an encrypted field's value and seeing unmasked encrypted data in debug logs. **Not** required or relevant for Shield Platform Encryption. | No dedicated log event found. Detect the grant in Setup Audit Trail and `Permission Update`. | No |
| **Manage Encryption Keys** | Generate, destroy, export and import the tenant secrets behind Shield Platform Encryption. Destroying a key makes the data it protected unreadable. | `Platform Encryption` event log type; Setup Audit Trail | Yes, for the event type |
| **View Event Log Files** | Read the Event Monitoring logs themselves. Whoever has this can see everyone's activity, and knows what is and is not being watched. | Access to the logs is itself an API read, so `API` event types will show the queries | Yes |
| **View Real-Time Event Monitoring Data** | Read Real-Time Event Monitoring events and use the Threat Detection app | Same as above | Yes |

Sources for the permission behaviours:
<https://help.salesforce.com/s/articleView?language=en_US&id=sf.users_profiles_view_all_mod_all.htm&type=5>,
<https://help.salesforce.com/s/articleView?id=000384401&language=en_US&type=1>,
<https://help.salesforce.com/s/articleView?id=000385694&language=en_US&type=1>,
<https://help.salesforce.com/s/articleView?id=000386957&language=en_US&type=1>,
<https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest_compatible_editions.htm>,
<https://help.salesforce.com/s/articleView?language=en_US&id=sf.fields_about_encrypted_fields.htm&type=5>

### The pattern to notice in that table

Look down the "needs paid add-on" column. Almost every **grant** of a risky permission is
detectable for free, through Setup Audit Trail. Almost every **use** of a risky permission
is only detectable with the paid add-on.

That is the whole trade-off in one sentence. Without Event Monitoring you can prove who
gave someone the keys. You cannot prove what they drove away in.

---

## 13. Salesforce's published guidance on insider threat

Salesforce does publish material on insider threat specifically. It is training content
rather than product documentation, and it is generic security guidance rather than
Salesforce-specific mechanics, but it is Salesforce's own published position.

### The two categories

Salesforce splits insider threat into **accidental** and **intentional**.

- Accidental comes from unintentional behaviour, naming "using unauthorized removable
  media" and "falling for phishing emails".
- Intentional is deliberate: actors who "steal confidential information for personal or
  financial gain, or damage systems or destroy data in retribution".

### The indicators Salesforce names

**Direct indicators**, meaning things you can see happening:

- Unauthorised access attempts
- "Disregard of security procedures and protocols"
- Requests from insiders for clearance or higher-level access
- Accessing workspaces outside normal working hours
- Sharing internal confidential information with external parties
- "Financial changes including unexplained affluence or excessive debt"

**Indirect indicators**, meaning things that need interpretation:

- "Visible animosity toward a coworker"
- "Sudden decline in work performance"

**Technical indicators:**

- Unusual network traffic spikes during off-hours
- "High volumes of unmonitored USB/mobile storage use, data exfiltration, inappropriate
  use of encryption"
- Unusual offline activities and high printing volumes off-hours
- Use of uncommon protocols or unapproved applications such as personal webmail and
  web-based file managers
- Data moving to unauthorised geographic destinations

### The controls Salesforce recommends

- **Capture, review and correlate audit log data**, and log all activity performed by users
  in cloud environments. This is the direct argument for Event Monitoring.
- **Forward logs to a SIEM**, which stands for Security Information and Event Management,
  a system that pulls logs from many sources into one place and correlates them. Event
  Monitoring data is designed to be fed into one; Salesforce names Splunk and Tableau as
  destinations.
- **Use User and Entity Behaviour Analytics**, often shortened to UEBA or UBA, which builds
  a baseline of normal behaviour and flags deviation. Threat Detection is Salesforce's own
  version of this.
- **Define explicit security agreements** for cloud services, "especially regarding access
  restrictions and monitoring capabilities".
- **Work with Human Resources**, including "pre-hire background checks that are regularly
  updated after hire".
- **Run periodic audits and trend analysis.** Salesforce specifically notes that "subtle or
  long-term threats, such as slow, unauthorized data exfiltration by a valid user, are
  often best identified through periodic audits and trend analysis". That is an explicit
  acknowledgement that real-time alerting misses the patient insider.

Sources:
<https://trailhead.salesforce.com/content/learn/modules/public-sector-data-security-in-the-cloud/identify-insider-threats-to-public-sector-data>
and
<https://trailhead.salesforce.com/content/learn/modules/threat-intelligence-analyst-responsibilities/identify-malicious-activity>

Salesforce also publishes a help article titled "Investigating Data Exfiltration Using
Event Logs", at
<https://help.salesforce.com/s/articleView?id=005229030&language=en_US&type=1>. I could not
retrieve its content on 2026-08-25, so this document does not summarise it. It is worth
opening directly, because its title suggests it is the most on-point Salesforce page for
this question.

---

## 14. Security Center

Security Center is a separate paid add-on that aggregates security data across several
Salesforce orgs into one app. It is free in Developer Edition and requires a purchased
licence in every other edition.

What it shows:

- Authentication, permission, user and configuration metrics in one place
- Up to **6 months** of data in dashboards and graphs
- Health Check data across orgs
- Threat Detection events across orgs

How the multi-org part works: you nominate one org as a **parent tenant** and connect other
orgs as **child tenants**. The parent's Security Center app then shows data from all
connected orgs.

Sources:
<https://help.salesforce.com/s/articleView?id=sf.security_center.htm&language=en_US&type=5>,
<https://trailhead.salesforce.com/content/learn/modules/security-center/learn-about-security-center>,
<https://help.salesforce.com/s/articleView?id=sf.security_center_threat_detection_events.htm&language=en_US&type=5>

Where this matters: during an org merger, when several orgs exist side by side, Security
Center is the only Salesforce-native way to see all of them from one place. Whether that is
worth an add-on licence for a temporary period is a business decision, not a technical one.

---

## 15. What none of this can do

Being clear about the gaps matters more than listing the features.

1. **Nothing here stops a person with legitimate access from reading data on screen.** They
   can read it, photograph it, or retype it. Event Monitoring records that they looked. It
   cannot record what they remembered.
2. **Detection is not prevention.** Only Transaction Security Policies prevent, and only on
   eleven event types, and only with the paid licence.
3. **Threat Detection compares a person to their own past.** Someone who has always taken a
   lot of data will not be flagged for taking a lot of data.
4. **Free retention is short.** One day for the free event log files, 180 days for Setup
   Audit Trail. A slow leak over a year leaves no trail you can still read.
5. **Someone has to actually look.** Event Monitoring produces files and events. Nothing in
   the base product reads them for you, decides something is wrong, and tells a person.
   That is what a SIEM is for, and a SIEM is a separate purchase and a separate project.
6. **The Tooling API is not covered by ApiEvent.** A person working through developer
   tooling is partly invisible to that event type.
7. **Encryption does not help.** Section 10 covers this. Shield Platform Encryption is not
   an insider-threat control.

---

## 16. What I could not confirm

Listed plainly, so nobody treats a gap as a fact.

| Item | Status |
| --- | --- |
| Field Audit Trail: fields tracked per object | Salesforce pages say 50, 60 and 200 in different places. Unresolved. Check the org. |
| Field Audit Trail: maximum retention | Documentation says both "10 years maximum" and "indefinitely, until deleted". Unresolved. |
| Login Forensics | Could not retrieve either help page. What it captures and what it costs are unknown. |
| Real-Time Event Monitoring: per-event-type retention | Documented only as a range, "six months to 10 years". No per-event table found. |
| Event Log File retention: the 30-day figure | Older material cites 30 days. Current REST API documentation says 1 year. The 30-day figure appears superseded but I could not find a page confirming the change. |
| Deterministic encryption: wildcard and range comparisons | Not confirmed either way. Assume unsupported. |
| Transaction Security: whether policies can aggregate across a session or a day | Not confirmed. Assume each event is judged alone. |
| Threat Detection: how long before a new user's baseline is reliable | Not documented anywhere I found. |
| Whether Platform Encryption, Field Audit Trail and Data Detect can be bought separately from Shield | Not confirmed. Only Event Monitoring is documented as separately purchasable. |
| Add-on pricing for any of this | Salesforce does not publish it on documentation pages. |

**A note on method, so the next reader can judge the evidence.** On 2026-08-25 the
help.salesforce.com website would not render for the tool used to retrieve these pages;
every attempt returned a loading error rather than content. Where a fact in this document
cites a help.salesforce.com URL, it came from a search engine's quoted extract of that
page rather than from the page itself. Facts citing developer.salesforce.com or
trailhead.salesforce.com came from the pages directly. The distinction matters if you are
verifying anything: open the help.salesforce.com links yourself before acting on them.

---

## 17. What this means for the decision

Stated as a recommendation, since that is what the document is for.

**Recommended: buy the Event Monitoring add-on, and do not buy the rest of
Shield for insider-threat reasons.** The one reason: Event Monitoring is the only thing on
this list that records who took data out, and it can be bought without the rest of Shield.
Platform Encryption, the most expensive-feeling part of Shield, explicitly does nothing
about insiders, and Field Audit Trail solves a retention problem rather than a detection
problem.

The cheaper option, worth knowing: **spend nothing, and lock down instead.** Remove
**Export Reports** and **API Enabled** from everyone who does not provably need them, set
login IP ranges on profiles, and rely on Setup Audit Trail to catch anyone granting
themselves those permissions back. What this gives up is any visibility at all into the
people who genuinely do need those permissions, which on a large org is likely
to include administrators, the integration accounts, and part of the operations team. For
that group you would be trusting rather than verifying.

Between the two, the deciding question is not technical. It is: how many people in the org
will legitimately need Export Reports or API Enabled? If the answer is a handful, locking
down may be enough. If it is dozens, buy the add-on.

---

## Sources

Every URL below was retrieved on 2026-08-25.

### Health Check
1. <https://help.salesforce.com/s/articleView?id=sf.security_health_check_score.htm&language=en_US&type=5> How the Health Check score is calculated, and the four risk categories.
2. <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_health_check.htm&language=en_us> Security Health Check overview.
3. <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_custom_baseline_create.htm&language=en_US> Creating a custom baseline for Health Check.
4. <https://trailhead.salesforce.com/content/learn/modules/security_basics/security_basics_healthcheck> Health Check training: the baseline, custom baselines, that it is included at no cost.
5. <https://trailhead.salesforce.com/content/learn/modules/secure-salesforce-configuration/run-health-check> Health Check training: the 0 to 100 score and example settings measured.

### Event Monitoring, Event Log Files
6. <https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_event_log_files.htm> Retention (1 year with the add-on, 1 day otherwise), generation timing, required permissions, licence requirement.
7. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_supportedeventtypes.htm> The complete list of Event Log File event types.
8. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_reportexport.htm> The Report Export event type.
9. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_contenttransfer.htm> The Content Transfer event type, covering file downloads, uploads and previews.
10. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_bulkapi.htm> The Bulk API event type.
11. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_eventlogfile_documentattach.htm> The Document Attachment Downloads event type.
12. <https://trailhead.salesforce.com/content/learn/modules/event_monitoring/event_monitoring_intro> Event Monitoring training: what it is, free versus paid event types, licence split.
13. <https://trailhead.salesforce.com/content/learn/modules/event-log-files-quick-look/access-and-use-your-event-log-files> Event Log File access methods, the free event type list, retention by licence.

### Real-Time Event Monitoring
14. <https://help.salesforce.com/s/articleView?language=en_US&id=sf.real_time_event_monitoring_overview.htm&type=5> Real-Time Event Monitoring overview.
15. <https://trailhead.salesforce.com/content/learn/modules/realtime-event-monitoring/get-to-know-realtime-events-and-transaction-security> The event type list, editions, streaming versus stored, the 6 months to 10 years retention range.
16. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_reportevent.htm> ReportEvent: fields, licence, Transaction Security support, API version 46.0.
17. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_apievent.htm> ApiEvent: what it captures, the Tooling API exclusion, fields, licence.
18. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_bulkapiresultevent.htm> BulkApiResultEvent: Bulk API result downloads, fields, licence.
19. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_bulkapiresulteventstore.htm> The stored companion to BulkApiResultEvent.
20. <https://help.salesforce.com/s/articleView?language=en_US&id=xcloud.real_time_event_monitoring_enable.htm&type=5> Enabling access, and the View Real-Time Event Monitoring Data permission.

### Threat Detection
21. <https://help.salesforce.com/s/articleView?language=en_US&id=xcloud.real_time_em_threat_detection.htm&type=5> Threat Detection overview and the statistical and machine learning basis.
22. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_sessionhijackingevent.htm> Session hijacking: the five fingerprint features, the 0.0 to 1.0 score, the 0.8 threshold.
23. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_credentialstuffingevent.htm> Credential stuffing: successful login during an attack, score always 1.
24. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_reportanomalyeventstore.htm> Report anomaly: the 0 to 100 score, example Summary text, SecurityEventData breakdown.
25. <https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/sforce_api_objects_apianomalyevent.htm> API anomaly: the 0 to 1 score, Summary text, policy outcomes.
26. <https://help.salesforce.com/s/articleView?id=sf.real_time_em_threat_reportanomaly.htm&language=en_US&type=5> How the report anomaly model defines an anomaly against a user's own history.
27. <https://help.salesforce.com/s/articleView?id=sf.real_time_em_threat_detection_bestpractices.htm&language=en_US&type=5> Best practices for investigating a report anomaly.
28. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_threatdetectionfeedback.htm> The feedback object used to tell Salesforce whether a flag was correct.

### Transaction Security
29. <https://trailhead.salesforce.com/content/learn/modules/enhanced_transaction_security/enhanced_transaction_security_basics> Transaction Security: licence, actions available, Condition Builder versus Apex.
30. <https://trailhead.salesforce.com/content/learn/modules/enhanced_transaction_security/enhanced_transaction_security_create> The worked example blocking a report export at a row threshold.
31. <https://help.salesforce.com/s/articleView?id=sf.enhanced_transaction_security_policy_list.htm&language=en_US> The full list of Transaction Security policy types.
32. <https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_transactionsecurity.htm> The TransactionSecurityPolicy metadata type.

### Shield, Platform Encryption, Field Audit Trail
33. <https://trailhead.salesforce.com/content/learn/modules/secure-salesforce-configuration/protect-apps-with-shield> The four Shield components, and the 60 fields per object figure.
34. <https://help.salesforce.com/s/articleView?id=sf.security_pe_overview.htm&language=en_US&type=5> Platform Encryption overview, and that it is not a substitute for field-level security.
35. <https://help.salesforce.com/s/articleView?id=xcloud.security_pe_concepts.htm&language=en_US> How Platform Encryption works, and that encrypted data looks normal to a permitted user.
36. <https://help.salesforce.com/s/articleView?id=xcloud.security_pe_considerations_general.htm&language=en_US&type=5> General Platform Encryption limitations: sorting, list views, flows, report filters.
37. <https://help.salesforce.com/s/articleView?id=sf.security_pe_deterministic.htm&language=en_US&type=5> Deterministic encryption, and what it recovers over probabilistic.
38. <https://help.salesforce.com/apex/HTViewHelpDoc?id=sf.security_pe_formulas.htm&language=th> Formula field limitations with encrypted data: Classic only, the 200 formula field cap.
39. <https://trailhead.salesforce.com/content/learn/modules/spe_admins/spe_admins_set_up_hoc> Permissions for Platform Encryption: Manage Encryption Keys, Customize Application.
40. <https://help.salesforce.com/s/articleView?id=000382508&language=en_US&type=1> That View Encrypted Data is not needed with Shield Platform Encryption.
41. <https://developer.salesforce.com/docs/atlas.en-us.field_history_retention.meta/field_history_retention/meta_historyretentionpolicy.htm> HistoryRetentionPolicy, archiveAfterMonths, the 18 month production default.
42. <https://trailhead.salesforce.com/content/learn/modules/field-audit-trail-basics/configure-field-audit-trail> Field Audit Trail configuration, and the 50 fields per object figure.
43. <https://developer.salesforce.com/blogs/isv/2015/04/field-audit-trail-briefing-isvs> The 60 fields per object figure and the 10 year retention maximum.

### Audit trails and field history
44. <https://help.salesforce.com/s/articleView?id=sf.admin_monitorsetup.htm&language=en_US&type=5> Setup Audit Trail: 180 day retention, 20 most recent shown, Delegate User and AI Agent columns.
45. <https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_setupaudittrail.htm> The SetupAuditTrail object, for programmatic export.
46. <https://help.salesforce.com/s/articleView?language=en_US&id=sf.tracking_field_history.htm&type=5> Field History Tracking: 20 fields per object, 18 months and 24 months retention.

### Permissions
47. <https://help.salesforce.com/s/articleView?language=en_US&id=sf.users_profiles_view_all_mod_all.htm&type=5> View All and Modify All: they ignore sharing but not field-level security.
48. <https://help.salesforce.com/s/articleView?id=000384401&language=en_US&type=1> Modify All Data: what it automatically enables on every object.
49. <https://help.salesforce.com/s/articleView?id=000385694&language=en_US&type=1> Bulk API Hard Delete: permanent deletion, not on the standard admin profile.
50. <https://help.salesforce.com/s/articleView?id=000386957&language=en_US&type=1> Author Apex: required to run Apex through executeAnonymous().
51. <https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest_compatible_editions.htm> API Enabled: required to call the platform APIs.
52. <https://help.salesforce.com/s/articleView?language=en_US&id=sf.fields_about_encrypted_fields.htm&type=5> View Encrypted Data and Classic Encryption for custom fields.

### Data export controls
53. <https://help.salesforce.com/s/articleView?id=000383962&language=en_US&type=1> Data Export FAQ: the 7 day and 29 day frequency limits by edition.
54. <https://help.salesforce.com/s/articleView?id=005321566&language=en_US&type=1> Step-up multi-factor authentication on report exports, and the login IP range exemption.
55. <https://help.salesforce.com/s/articleView?id=platform.login_ip_ranges.htm&language=en_US&type=5> Restricting login IP addresses on profiles.
56. <https://help.salesforce.com/s/articleView?id=sf.connected_app_edit_ip_ranges.htm&language=en_US&type=5> IP ranges on connected apps.
57. <https://help.salesforce.com/s/articleView?id=000383352&language=en_US&type=1> Restricting user access to Data Loader.

### Insider threat and Security Center
58. <https://trailhead.salesforce.com/content/learn/modules/public-sector-data-security-in-the-cloud/identify-insider-threats-to-public-sector-data> Salesforce's insider threat guidance: accidental versus intentional, indicators, recommended controls.
59. <https://trailhead.salesforce.com/content/learn/modules/threat-intelligence-analyst-responsibilities/identify-malicious-activity> Behavioural and technical indicators, and the IDS, EDR, SIEM, UBA tool categories.
60. <https://help.salesforce.com/s/articleView?id=005229030&language=en_US&type=1> Investigating data exfiltration using event logs. Content not retrieved; listed because the title is directly on point.
61. <https://help.salesforce.com/s/articleView?id=sf.security_center.htm&language=en_US&type=5> Security Center: what it does, the 6 months of data, parent and child tenants.
62. <https://trailhead.salesforce.com/content/learn/modules/security-center/learn-about-security-center> Security Center training, and that it is free only in Developer Edition.
63. <https://help.salesforce.com/s/articleView?id=sf.security_center_threat_detection_events.htm&language=en_US&type=5> Reviewing Threat Detection events inside Security Center.

### Login Forensics, content not retrieved
64. <https://help.salesforce.com/s/articleView?id=sf.monitor_login_forensics_enable.htm&language=en_US&type=5> Enabling Login Forensics.
65. <https://help.salesforce.com/s/articleView?id=sf.monitor_login_forensics_considerations.htm&language=en_US&type=5> Considerations for using Login Forensics.
