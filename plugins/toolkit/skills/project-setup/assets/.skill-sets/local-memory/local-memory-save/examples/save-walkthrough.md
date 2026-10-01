# Example: two saves to local memory

An illustration, not a recorded run: a Salesforce project with local work items and local memory, "Memory approval: onboarding".

## 1. A fact for an existing concept

The owner: "Remember, the client's auditors need a report of who has Modify All Data, every quarter."

1. His "remember" is the approval. Searching memory finds `project_security_model.md`, which has no section about audits.
2. Add one above `## Gotchas and lessons`:

   ```markdown
   ## Quarterly access audit

   **Remember:** The client's auditors need a report of every user with Modify All Data, once a quarter.

   **Why:** A missed report is an audit finding for the client.

   **How to apply:** Keep Modify All Data in as few permission sets as possible, so the report stays short.

   **Evidence and limits:** Mike, in chat, 2026-09-30. Which auditor and the report format were not given.

   **Related memories:** None.

   **Authoritative records:** None.
   ```

3. Set `updated: 2026-09-30`. Read it back. Reply: "Saved to memory: Quarterly access audit (in Security model, `memory/project_security_model.md`). Say 'forget that' to undo."

## 2. A proposal the owner has not answered

The agent noticed the sandbox refresh wipes test users, and asked: "Save to memory: the Full sandbox refresh removes all test users?" The owner moved on without answering.

1. A marked section in `project_environments.md`:

   ```markdown
   ## Sandbox refresh and test users

   **Proposal, not approved yet:** asked on 2026-09-30. Do not rely on this until the owner says yes.

   **Remember:** A Full sandbox refresh removes every test user.
   ...
   ```

2. One line under "Waiting on the owner" in `memory/CURRENT_STATE.md`:

   ```markdown
   - Save to memory? Full sandbox refresh removes test users (proposal in memory/project_environments.md, asked 2026-09-30)
   ```

3. Next day he says "yes, keep that". Remove the proposal line from the section, add "Approved by Mike on 2026-10-01." to its **Evidence and limits** line, remove the Current State line, and reply "Saved to memory: Sandbox refresh and test users (in Environments, `memory/project_environments.md`). Say 'forget that' to undo."
