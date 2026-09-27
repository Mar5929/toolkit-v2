# Session 04-s2-requirements

Prompt (exact):

```text
No, I don't approve WI-001 yet. We skipped the requirements. This field goes to production, so treat it as a real build and ask me the questions first, one at a time: required or not, default value, who can edit it. Also, remember that I prefer every new custom field to have a description and help text.
```

Thread: 01a0e061-3413-79b3-845f-a7d3fbc5905e. Started 2026-09-26T21:01:01-0400, ended 2026-09-26T21:03:15-0400. exit=0.

Events from codex exec --json (command output cut to 400 characters; a failed command's output to 3000):

```text
[error] {"id": "item_0", "type": "error", "message": "`--dangerously-bypass-hook-trust` is enabled. Enabled hooks may run without review for this invocation."}
[error] {"id": "item_1", "type": "error", "message": "`--dangerously-bypass-hook-trust` is enabled. Enabled hooks may run without review for this invocation."}
[MSG] I’ll move WI-001 back to requirements, record that the result is not approved, and ask the field questions one at a time. I’ll also save your custom field documentation preference for future work.
[CMD exit=0] /bin/zsh -lc 'cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-requirements/SKILL.md /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/memory/0.2.0/skills/memory-save/SKILL.md'
   OUT: ---
        name: work-requirements
        description: 'Interviews the owner one question at a time, writes the answers into the work item''s requirements and open questions, then asks for approval. Use when the owner says "grill me", "ask me questions", "what should it do", or "check the spec", changes a requirement, or requirements are missing.'
        ---
        
        # Work requirements
        
        Voice: write to the owner in plain Eng
[MSG] I’m using the work-requirements and memory-save procedures for this correction. I’ll preserve the existing WI-001 record, then ask the first requirement.
[CMD exit=0] /bin/zsh -lc 'cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-on/SKILL.md /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/references/conventions.md /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-requirements/references/writing-requirements.md .memory/AGENTS.md .memory/memory-criteria.md'
   OUT: ---
        name: work-on
        description: 'Starts, continues, or logs project work: finds or creates the work item, works out where it stands, and runs its next step through to a built result. Use when the owner asks to build, add, fix, or change something, says "keep going" or "continue", names an item, or wants an idea logged for later.'
        ---
        
        # Work on
        
        Voice: write to the owner in plain English. Claude Co
[CMD exit=0] /bin/zsh -lc "toolkit memory find 'custom field description help text' && toolkit config get memory.approval && cat PROJECT-ROADMAP.md && rg --files requirements system-guide"
   OUT: # Project roadmap
        
        <!-- Fill-in guide: replace every angle-bracket prompt in the outcome, phase table, phase heading, and work-unit fields with this project's real text. Keep one overview row and one matching ## heading per phase. Under that heading, repeat the ### work-unit block for each deliverable-sized unit and link its canonical work item in the Linked work item field. Remove example rows an
[CMD exit=0] /bin/zsh -lc 'toolkit work show WI-001 && toolkit work lifecycle && toolkit work show WI-001 --path'
   OUT: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/.work-items/WI-001-account-tier-picklist/WORK-ITEM.md
        
[CMD exit=0] /bin/zsh -lc "cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/work/0.2.0/skills/work-decide/SKILL.md requirements/SYSTEM-DATA-MODEL.md && toolkit work show WI-001 --section Overview && toolkit work show WI-001 --section 'Open Questions' && toolkit work show WI-001 --section Requirements && toolkit work show WI-001 --section Notes"
   OUT: ## Requirements
        
        **Overall status:** Refining  
        **Finalization rule:** Mike approves the finished result before this item is marked Done.
        
        ### Starting request
        
        Add a Tier picklist field to Account so the sales team can mark each account Gold, Silver, or Bronze. Write the field XML under force-app/ and keep the component tracker current.
        
        ### Agreed goal
        
        Write the Account Tier field and deploymen
[CMD exit=0] /bin/zsh -lc 'toolkit work set --help'
   OUT: toolkit work: Work items: create, list, show, change, approve, finish, and sync them. toolkit work lifecycle shows the stages.
        
        Usage:
          toolkit work lifecycle
          toolkit work new --title <t> [--type <t>] [--parent <id>] [--stage <s>] [--priority <p>] [--request <text>] [--group <folder>]
          toolkit work list [--status <s>] [--waiting-on <w>] [--tree] [--all]
          toolkit work show <id> [--section <hea
[MSG] WI-001 was tracked as a small task even though it changes the Account object and is intended for production. I’m correcting it to a build item and returning it to refinement. The written XML is still only a draft; the unanswered field rules will determine what changes.
[CMD exit=0] /bin/zsh -lc "toolkit work set WI-001 --stage 02-refinement --type build --note 'Mike did not approve the result and asked for requirements before this production field proceeds.'"
   OUT: Updated WI-001: type task -> build; stage 11 User approval -> 02 Refinement (status Backlog).
        Now 02 Refinement (Backlog). Continue with work-decide.
        
[CMD exit=0] /bin/zsh -lc 'mktemp -d'
   OUT: /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ
        
[CMD exit=0] /bin/zsh -lc "cat > /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/questions.md <<'EOF'
## Open Questions

| ID | Question | Affects | Status | Decision needed from |
| --- | --- | --- | --- | --- |
| Q-01 | Do you approve the written Account Tier field and deployment inventory? | Result approval | Declined by Mike, 2026-09-26; requirements first | owner |
| Q-02 | Should Account Tier be required on Account records? | R-01 and field behavior | Open | owner |
EOF
cat > /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/requirements.md <<'EOF'
## Requirements

**Overall status:** Refining  
**Finalization rule:** Mike approves the finished result before this item is marked Done.

### Starting request

Add a Tier picklist field to Account so the sales team can mark each account Gold, Silver, or Bronze. Write the field XML under force-app/ and keep the component tracker current.

### Agreed goal

Add an Account Tier field so the sales team can mark accounts Gold, Silver, or Bronze. Mike confirmed this field is intended for production on 2026-09-26; the detailed requirements are still being refined.

### Active requirements

#### R-01 — Account Tier values

**Status:** Refining  
**Applies to:** Account records.  
**Required behavior:** Tier is a picklist with Gold, Silver, and Bronze values.  
**Boundaries and exceptions:** Whether the field is required, its default value, and who may edit it are undecided.  
**Acceptance check:** An Account user can select Gold, Silver, or Bronze; the required, default, and edit rules match the approved answers.  
**Decision record:** Mike's starting request, 2026-09-26; Mike requested a requirements interview before result approval, 2026-09-26.  
**Open questions:** Q-02; default value and edit access will be asked next.

#### R-02 — Field guidance

**Status:** Refining  
**Applies to:** Account Tier.  
**Required behavior:** The new custom field has a description and help text explaining its purpose to administrators and users.  
**Boundaries and exceptions:** Exact wording will be drafted after the field rules are settled.  
**Acceptance check:** The Account Tier field contains a description and help text consistent with its approved behavior.  
**Decision record:** Mike's standing preference for every new custom field, 2026-09-26.  
**Open questions:** None.

### Acceptance

The sandbox field offers Gold, Silver, and Bronze and behaves according to the approved required, default, and edit rules. The field has a description and help text. The component tracker and deployment manifests identify Account.Tier__c. Mike reviews the verified result before approving it.
EOF
cat > /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/overview.md <<'EOF'
## Overview

**Goal:** Add an Account Tier picklist with Gold, Silver, and Bronze values for the sales team.

**Current position:** Existing field XML and deployment inventory are draft work. Mike declined result approval and asked to settle requirements first.

**Next action:** Ask Mike whether Account Tier is required; then ask its default value and who can edit it, one question at a time. Record each answer and seek requirements approval before continuing the build.

**Blockers:** Required status, default value, and edit access are undecided. Sandbox validation also needs a verified Salesforce API version in place of XX.0.

**Related items:** None.
EOF
cat > /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/notes.md <<'EOF'
## Notes

### Decisions and context

- The project source API version is still XX.0, so deployment validation cannot run yet.
- The field is not deployed to the sandbox or production. Sales team access and page placement must be checked after deployment.
- Mike declined approval of the existing written result on 2026-09-26 because the requirements interview had been skipped. The existing XML and inventory remain draft work for comparison with the approved requirements.

### Resume here

Ask Q-02 first. After Mike answers, record the requirement and ask the default value, then who can edit the field, one question per turn. Include a description and help text in the completed field. Seek explicit requirements approval before returning to the build.

### Solution options and considerations

- A restricted local picklist keeps the values limited to Gold, Silver, and Bronze.
EOF"
   OUT: 
[CMD exit=0] /bin/zsh -lc "toolkit work edit WI-001 --section 'Open Questions' --set-file /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/questions.md"
   OUT: Saved "Open Questions" in WI-001.
        
[CMD exit=0] /bin/zsh -lc "toolkit work edit WI-001 --section 'Requirements' --set-file /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/requirements.md"
   OUT: Saved "Requirements" in WI-001.
        
[CMD exit=0] /bin/zsh -lc "toolkit work edit WI-001 --section 'Overview' --set-file /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/overview.md"
   OUT: Saved "Overview" in WI-001.
        
[CMD exit=0] /bin/zsh -lc "toolkit work edit WI-001 --section 'Notes' --set-file /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/notes.md"
   OUT: Saved "Notes" in WI-001.
        
[CMD exit=0] /bin/zsh -lc "cat > /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/memory.md <<'EOF'
Remember: Mike prefers every new Salesforce custom field to have a description and help text.

Why: Field purpose and guidance should be documented for administrators and users.

How to apply: Include both a field description and help text when defining a new custom field. Draft wording that fits the approved field behavior.

Evidence and limits: Mike said, \"remember that I prefer every new custom field to have a description and help text\" in chat on 2026-09-26. This is a standing preference for new custom fields; it does not approve any specific field or wording.

Related memories: None.

Authoritative records: Mike's instruction in chat, 2026-09-26. WI-001 records its application to Account Tier.
EOF"
   OUT: 
[CMD exit=0] /bin/zsh -lc "toolkit memory save --type user --name custom_field_description_help_text --description 'Every new custom field should have a description and help text.' --body-file /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/memory.md --source 'Mike, in chat, 2026-09-26' --approved-by Mike"
   OUT: Saved to memory: user_custom_field_description_help_text (new record).
        Where: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/.memory
        Version: ab11ac6ffb13
        Approved by: Mike
        
[CMD exit=0] /bin/zsh -lc "toolkit work history WI-001 --note 'Mike said: No, I do not approve WI-001 yet. We skipped the requirements. This field goes to production, so treat it as a real build and ask me the questions first, one at a time: required or not, default value, who can edit it. He also stated a preference for descriptions and help text on every new custom field.'"
   OUT: Added a Recent History row to WI-001.
        
[CMD exit=1] /bin/zsh -lc 'toolkit memory get user_custom_field_description_help_text && toolkit doctor'
   OUT: Toolkit doctor for Acme CRM (/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1).
        
        Problems (1):
        1. 1 scaffold file is missing: SOUL.md.
           Fix: Run toolkit sync.
        
        Warnings (3):
        2. Codex does not trust this folder (/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1). Codex loads the project's .codex/ settings, plugin switches, and hooks only in a trusted folder. Trust is tied to the folder path, so moving the project turns it off.
           Fix: The owner opens Codex in this folder and trusts it when Codex asks.
        3. The Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no briefing, no memory reminder, no guards).
           Fix: The owner opens /hooks in Codex once and trusts the Toolkit V2 hooks.
        4. The Salesforce org guards in .codex/hooks.json are not trusted in Codex yet, so Codex does not run them.
           Fix: The owner opens /hooks in Codex in this project and trusts the two Salesforce guards.
        
        Notes (5):
        - AGENTS.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - PROJECT.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - README.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - delivery/deployment/component-tracker.csv was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - delivery/deployment/full-project-deployment-template/package.xml was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        
        Result: 1 problem and 3 warnings.
        
[CMD exit=0] /bin/zsh -lc "toolkit work show WI-001 --section 'Recent History' && toolkit work show WI-001 --section Requirements && toolkit work show WI-001 --section 'Open Questions' && toolkit work validate WI-001"
   OUT: ## Requirements
        
        **Overall status:** Refining  
        **Finalization rule:** Mike approves the finished result before this item is marked Done.
        
        ### Starting request
        
        Add a Tier picklist field to Account so the sales team can mark each account Gold, Silver, or Bronze. Write the field XML under force-app/ and keep the component tracker current.
        
        ### Agreed goal
        
        Add an Account Tier field so the sales tea
[CMD exit=0] /bin/zsh -lc "cat > /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/memory.md <<'EOF'
Mike prefers every new Salesforce custom field to have a description and help text.

Why: Field purpose and guidance should be documented for administrators and users.

How to apply: Include both a field description and help text when defining a new custom field. Draft wording that fits the approved field behavior.

Evidence and limits: Mike wrote, \"remember that I prefer every new custom field to have a description and help text\" in chat on 2026-09-26. This is a standing preference for new custom fields; it does not approve any specific field or wording.

Related memories: None.

Authoritative records: Mike's instruction in chat, 2026-09-26. WI-001 records its application to Account Tier.
EOF"
   OUT: 
[CMD exit=0] /bin/zsh -lc "toolkit memory save --type user --name custom_field_description_help_text --description 'Every new custom field should have a description and help text.' --body-file /var/folders/rw/v2t0rhbs65g84mbl3h2ttfj40000gn/T/tmp.nKAuCzB1DZ/memory.md --source 'Mike, in chat, 2026-09-26' --approved-by Mike"
   OUT: Saved to memory: user_custom_field_description_help_text (updated).
        Where: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/.memory
        Version: 998099dd1288
        Approved by: Mike
        
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
[MSG] WI-001 is back in requirements refinement, and your approval of the written result is recorded as declined. I saved your preference for a description and help text on every new custom field.

**First question:** Should Account Tier be required? I recommend **optional**, so existing Accounts can remain unchanged until the sales team assigns a tier.
[USAGE] {"input_tokens": 808072, "cached_input_tokens": 771072, "cache_write_input_tokens": 0, "output_tokens": 4389, "reasoning_output_tokens": 1049}
```

Final message:

WI-001 is back in requirements refinement, and your approval of the written result is recorded as declined. I saved your preference for a description and help text on every new custom field.

**First question:** Should Account Tier be required? I recommend **optional**, so existing Accounts can remain unchanged until the sales team assigns a tier.

## Digest from the Codex session log (rollout)

- start 2026-09-26T21:01:01-0400, end 2026-09-26T21:03:15-0400, thread 01a0e061-3413-79b3-845f-a7d3fbc5905e
- prompt: "No, I don't approve WI-001 yet. We skipped the requirements. This field goes to production, so treat it as a real build and ask me the questions first, one at a time: required or not, default value, who can edit it. Also, remember that I prefer every new custom field to have a description and help text."
- skills opened (SKILL.md read): work-requirements, memory-save, work-on, work-decide
- sub-agents: 0
- hooks: briefing=yes, keep-line=yes, keep=remember that, records=9, post-edit validations=[], stopBlocked=False
- toolkit commands (25): toolkit memory find [0]; toolkit config get memory.approval [0]; toolkit work show WI-001 [0]; toolkit work lifecycle [0]; toolkit work show WI-001 --path [0]; toolkit work show WI-001 --section Overview [0]; toolkit work show WI-001 --section [0]; toolkit work show WI-001 --section Requirements [0]; toolkit work show WI-001 --section Notes [0]; toolkit work set --help [0]; toolkit work set WI-001 --stage 02-refinement --type build --note [0]; toolkit work edit WI-001 --section [0]; toolkit memory save --type user --name custom_field_description_help_text --description [0]; toolkit work history WI-001 --note [0]; toolkit memory get user_custom_field_description_help_text [1]; toolkit doctor [1]; toolkit work validate WI-001 [0]; toolkit memory get user_custom_field_description_help_text [0]

