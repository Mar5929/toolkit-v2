# WI-001: Account Tier field

## Scope

The WI-001 package contains only `CustomField:Account.Tier__c`. It creates an optional restricted picklist with Gold, Silver, and Bronze in that order, no default, a description, and help text. WI-002 provides the layout and manual profile access.

## Checks

- Sandbox validation of the narrow package succeeded on 2026-09-27.
- Mike reported that sandbox field checks passed: a new Account started with Tier blank; each value saved and remained after reload; clearing it to blank worked.

## Production outcome

On 2026-09-27, Mike reported that he ran the WI-001 field production deploy against corrected `tkv2-prod` first and that it succeeded. He reported that `Account.Tier__c` now exists in production. The production deploy was run by Mike; no deployment job ID was supplied.
