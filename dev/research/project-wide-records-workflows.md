# Project-wide records: workflow diagrams

Status: Design examples for TKV-19. These flows are proposed, not built or approved as Toolkit V2 behavior.

These diagrams belong to the Toolkit V2 design record. They are not copied into client projects. The proposed project skill will carry the working instructions and a smaller example that an agent needs while doing the work.

## Terms and record owners

"Knowledge" means all useful project information, not one folder. A source is evidence. A work item owns the change being made and its questions, requirements, design, tasks, and status. `requirements/` owns maintained accepted behavior. `system-guide/` describes verified current structure. Memory holds selected lasting context under the chosen memory system's rules. Proposed `project-wide-records/` holds only the five cross-item record types below.

```mermaid
flowchart TB
    K["Project knowledge: all useful information"]
    K --> S["Sources and evidence"]
    K --> W["Work items in chosen tracker"]
    K --> R["Accepted behavior: requirements/"]
    K --> C["Verified current system: system-guide/"]
    K --> P["Project-wide records: links and coordination"]
    K --> M["Selected lasting memory"]
    P --> D["Domain maps"]
    P --> Q["Shared questions"]
    P --> A["Target architecture"]
    P --> H["People and authority"]
    P --> I["Intake receipts"]
```

The arrows classify information. They do not mean every source is copied into every record.

## 1. Set up a new client project

The project-wide pattern is standard. The owner still chooses only the work tracker, memory, Salesforce setup, and the other existing setup answers.

```mermaid
flowchart LR
    O["Owner starts a new project"] --> S["project-setup interviews for existing choices"]
    S --> M["Copy model project"]
    M --> P["Add project-wide-records/ and its AGENTS.md"]
    M --> K["Copy shared skills, including managing-project-wide-records"]
    S --> W["Add chosen tracking-work-items skill"]
    S --> R["Add chosen memory setup or Hindsight add-on"]
    P --> V["Agent checks routes and templates before first use"]
    K --> V
    W --> V
    R --> V
```

No intake receipt, person record, or domain page is filled with invented content during setup.

## 2. Discovery workshop affects several work items

Example: two Salesforce orgs assign Account ownership differently. Migration, security, and Account design all depend on the answer.

```mermaid
flowchart TD
    A["Workshop transcript or notes"] --> B["Preserve the original once"]
    B --> C["Choose its existing source home"]
    C --> D["Read and separate observations, claims, proposals, questions"]
    D --> E["Search existing work items and project-wide records"]
    E --> F["Update affected work items"]
    E --> G["Create or update one shared question"]
    E --> H["Create intake receipt"]
    G --> I["Link migration, security, and Account design"]
    H --> J["Read back every destination"]
    F --> J
    I --> J
    J --> K{"Every material finding placed?"}
    K -- Yes --> L["Mark intake complete"]
    K -- No --> N["Name remaining record and next action"]
```

In a non-Salesforce project, one work item anchors a source spanning items: a local `references/` file, a Notion Files entry, or a GitHub source comment. The intake receipt names the anchor item and source. A Salesforce client file stays in `delivery/` or an existing `engagement/`. The receipt never becomes a second transcript. Notion's temporary file download URL is not a lasting source link.

## 3. Human and agent design a large feature

Example: the owner and agent design a new security model with several independently delivered parts.

```mermaid
sequenceDiagram
    participant H as Owner
    participant A as Agent
    participant W as Work tracker
    participant P as Project-wide records
    participant M as Memory
    H->>A: Describe the large feature
    A->>W: Create or resume the owning work item
    A->>A: Read current system, requirements, sources, and related items
    A->>H: Refine one question at a time
    H-->>A: Answer and approve requirements
    A->>W: Save answers and approved requirements
    A->>W: Split independently delivered parts into sub-items
    A->>W: Draft design options with the owning item
    A->>P: Link shared target direction and open cross-item questions
    A->>H: Show design options and recommendation
    H-->>A: Choose a design
    A->>W: Record choice in item Q&A and selected design
    A->>P: Update target direction and affected domain maps
    A->>M: Offer lasting project-wide decision under memory rules
```

The item design remains the buildable solution. A target architecture page contains only direction shared by several items and states whether the owner accepted it.

## 4. An answer changes after design has started

```mermaid
flowchart TD
    A["Owner changes an earlier answer"] --> B["Find authoritative item Q&A or project-wide decision"]
    B --> C["Preserve old answer and record new words and date"]
    C --> D["Find shared question and all linked records"]
    D --> E["Update affected work-item requirements and designs"]
    D --> F["Update target architecture and domain map"]
    D --> G["Correct memory if a lasting decision changed"]
    D --> H["Check Current State if active work is blocked"]
    E --> I["Read back changes"]
    F --> I
    G --> I
    H --> I
    I --> J{"Every effect resolved?"}
    J -- Yes --> K["Shared question: incorporated"]
    J -- No --> L["Keep question open with conflict and next action"]
```

The existing work-item approval rules still apply when an approved requirement or design changes. A project-wide record cannot approve that change on its own.

## 5. A new source contradicts the current direction

```mermaid
flowchart LR
    S["New source makes a conflicting claim"] --> P["Preserve and cite the source"]
    P --> C["Compare with approved decision and current records"]
    C --> Q{"Conflict verified?"}
    Q -- No --> U["Record uncertainty and verification step"]
    Q -- Yes --> O["Open or update shared question"]
    O --> I["Flag affected work items and target direction"]
    I --> H["Ask the owner for the decision through owning work item"]
    H --> R["Apply answer and check every affected record"]
```

A stakeholder claim is evidence until the owner confirms what the project should do. An agent does not silently replace an approved decision.

## 6. Decision authority changes

```mermaid
flowchart TD
    A["Source says a stakeholder's authority changed"] --> B["Check source and date"]
    B --> C["Update short role map in PROJECT.md if confirmed"]
    B --> D["Update detailed person record if one is needed"]
    D --> E["Find shared questions assigned to old authority"]
    C --> E
    E --> F["Reassign only after authority is confirmed"]
    F --> G["Keep unresolved ownership visible on each question"]
```

The person record holds project role and decision authority, not a biography or unnecessary personal details. `PROJECT.md` stays the short route to owners.

## 7. A fresh agent resumes the project

```mermaid
flowchart TD
    A["New session starts"] --> B["Session-start hook loads Current State"]
    B --> C["Read PROJECT.md and the active work item"]
    C --> D{"Does this work span items or a domain?"}
    D -- Yes --> E["Open domain map and shared questions"]
    D -- No --> F["Continue from item's Next action"]
    E --> G["Read linked authoritative records and sources"]
    G --> F
    F --> H["Save changes and read them back"]
```

Current State points to a shared question only while it blocks active work. The domain map is a route to records, not a second status list.

## 8. A feature is delivered and reflected into maintained records

```mermaid
flowchart LR
    A["Build and testing evidence"] --> B["Owner approves result"]
    B --> C["Work item enters Reflecting"]
    C --> D["Write verified delivered behavior to requirements/"]
    C --> E["Write verified current structure to system-guide/"]
    C --> F["Offer durable decisions and lessons to memory"]
    D --> G["Update domain map links"]
    E --> G
    F --> G
    G --> H["Check shared questions for full incorporation"]
    H --> I["Continue existing merge, deploy, and Done gates"]
```

Target architecture does not automatically become current architecture. The system guide changes only after its structure is verified.

## 9. Outside documentation informs a design

```mermaid
flowchart TD
    A["Official outside documentation"] --> B["Capture raw source in ai-external-knowledge/"]
    B --> C["Record publisher, URL, date, and coverage"]
    C --> D["Read it for the current design question"]
    D --> E{"What did the project conclude?"}
    E --> F["Item design or requirement proposal"]
    E --> G["Shared target direction if several items depend on it"]
    F --> H["Link back to captured source"]
    G --> H
```

The captured page remains source material. Its wording is not copied into a project-wide record as though it were an accepted project decision.

## 10. Mixed tracker and memory choices

```mermaid
flowchart TB
    P["Same project-wide record forms and procedure"]
    P --> L["Local work items"]
    P --> N["Notion work items"]
    P --> G["GitHub Issues work items"]
    P --> LM["Local memory"]
    P --> NM["Notion memory"]
    P --> HM["Hindsight memory"]
    L --> A["Links use stable item IDs and locations"]
    N --> A
    G --> A
    LM --> B["Memory follows chosen system's own rules"]
    NM --> B
    HM --> B
```

The forms and placement rules do not change with the work tracker or memory choice. Only the steps for reading and writing those existing stores change.

## What these examples must prove in a test

An end-to-end test should show that an agent can find the source, the owning answer, every affected record, and the next action from a fresh session. A changed answer must update or explicitly flag each affected record. A failed save leaves the intake or shared question open. The test must also show that the agent does not copy a transcript into Git, treat a proposed target as current structure, or use memory as a second work tracker.
