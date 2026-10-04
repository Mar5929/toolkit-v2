# Accounts workshop across two Salesforce orgs

The team reviews a workshop transcript about duplicate accounts during
an org merge. The client file already lives in `delivery/`. The agent
keeps it there and records that path as the original source in an intake
receipt.

The source raises a proposed matching rule for both the migration item
and the sales process item. The agent adds the claim to each item's
context, opens one project question about who approves the match rule,
and links both items. The `accounts` domain map links the source, the two
items, the shared question, current data model, and accepted behavior.

During the next design session, the owner approves the matching rule in
the migration item's Questions and Answers. The shared question links to
that Q-ID and becomes `answered`. The agent checks the sales process item,
the proposed target account model, and any memory pointer. It records each
readback in the question. A failed update to the second item leaves the
question open with that exact next action. Once the update succeeds and
every destination is checked, the question becomes `incorporated`.

The target account model remains proposed until its own owner approval.
After the build is tested and delivered, the verified structure goes to
`system-guide/` and the accepted behavior to `requirements/`. The domain
map points to those records; it does not repeat their content.
