# Session 26-s20-memory-find

Prompt (exact):

```text
Next week I'll want a Region field on Contact. Don't start it yet. What do you remember about how I like new custom fields?
```

Thread: 01a0e08d-f7df-7811-b208-66989e2321dc. Started 2026-09-26T21:49:54-0400, ended 2026-09-26T21:50:17-0400. exit=0.

Events from codex exec --json (command output cut to 400 characters; a failed command's output to 3000):

```text
[error] {"id": "item_0", "type": "error", "message": "`--dangerously-bypass-hook-trust` is enabled. Enabled hooks may run without review for this invocation."}
[error] {"id": "item_1", "type": "error", "message": "`--dangerously-bypass-hook-trust` is enabled. Enabled hooks may run without review for this invocation."}
[MSG] I’ll check the saved project memory and leave the Contact field untouched.
[MSG] I’m using the project’s memory lookup procedure to verify the saved preference and its scope.
[CMD exit=0] /bin/zsh -lc 'toolkit memory focus'
   OUT: # Current focus
        
        Last updated: 2026-09-26, WI-001 closeout, Codex
        
        ## Now
        
        None.
        
        ## Waiting on the owner
        
        None.
        
        ## Untracked to-dos
        
        - Commit the WI-001 closeout document edits on local main when Git metadata write access is available: deployment record, manual steps, component tracker, Accounts requirements, and Accounts system guide. The field source is already committed at `e43580c`; the thre
[CMD exit=0] /bin/zsh -lc "rg -n \"description|help text|custom field\" DECISIONS.md requirements system-guide PROJECT-ROADMAP.md .work-items --glob '*.md'"
   OUT: system-guide/ACCOUNTS.md:11:| `Account.Tier__c` | Restricted picklist with description and help text | [field source](../force-app/main/default/objects/Account/fields/Tier__c.field-meta.xml) | Source inspected on 2026-09-26; Mike reported successful sandbox and production deployments. |
        .work-items/account-tier/WI-001-account-tier-picklist/DESIGN.md:25:| R-02 — Field guidance | Finalized | Both op
[CMD exit=0] /bin/zsh -lc 'toolkit work list'
   OUT: No open work items. Add --all to include finished, cancelled, and archived ones.
        
[CMD exit=0] /bin/zsh -lc 'toolkit memory find "new custom field description help text"'
   OUT: 1 memory record matches "new custom field description help text" (best first):
        - user_custom_field_description_help_text: Every new custom field should have a description and help text.
            # Custom field description help text **Remember:** Mike prefers every new Salesforce custom field to have a description and help text. Why: Field purpose and...
        Read a record with toolkit memory get <key> befor
[CMD exit=0] /bin/zsh -lc 'toolkit memory get user_custom_field_description_help_text'
   OUT: ---
        name: user_custom_field_description_help_text
        description: Every new custom field should have a description and help text.
        metadata:
          type: user
        status: current
        source: Mike, in chat, 2026-09-26
        last_verified: 2026-09-26
        authorization: Approved by Mike on 2026-09-26
        supersedes: none
        ---
        
        # Custom field description help text
        
        **Remember:** Mike prefers every new Salesforce custom field to have
[MSG] You prefer every new Salesforce custom field to have **a description and help text**. The wording should explain the field’s purpose and fit its approved behavior. You stated this as a standing preference on September 26, 2026. [Project memory](.memory/user_custom_field_description_help_text.md)

I haven’t started the Contact Region field.
[USAGE] {"input_tokens": 158869, "cached_input_tokens": 135936, "cache_write_input_tokens": 0, "output_tokens": 607, "reasoning_output_tokens": 49}
```

Final message:

You prefer every new Salesforce custom field to have **a description and help text**. The wording should explain the field’s purpose and fit its approved behavior. You stated this as a standing preference on September 26, 2026. [Project memory](.memory/user_custom_field_description_help_text.md)

I haven’t started the Contact Region field.

## Digest from the Codex session log (rollout)

- start 2026-09-26T21:49:54-0400, end 2026-09-26T21:50:17-0400, thread 01a0e08d-f7df-7811-b208-66989e2321dc
- prompt: "Next week I'll want a Region field on Contact. Don't start it yet. What do you remember about how I like new custom fields?"
- skills opened (SKILL.md read): memory-find
- sub-agents: 0
- hooks: briefing=yes, keep-line=no, keep=None, records=0, post-edit validations=[], stopBlocked=False
- toolkit commands (4): toolkit memory focus [0]; toolkit work list [0]; toolkit memory find [0]; toolkit memory get user_custom_field_description_help_text [0]

