---
name: project_billing
description: How feecalc totals are used and the billing API minimum
updated: 2026-09-29
metadata:
  type: project
status: current
source: Mike Rihm, in chat, 2026-09-29
last_verified: 2026-09-29
authorization: Approved by Mike Rihm on 2026-09-29
supersedes: none
---

# Billing

## Monthly statements

**Remember:** The totals feecalc calculates go into monthly statements that the finance team sends to customers on the 1st of each month.

**Why:** Not stated by the owner.

**How to apply:** Consider the monthly statement as a downstream use when changing how feecalc calculates or presents totals.

**Evidence and limits:** Mike Rihm, in chat, 2026-09-29. This states where the totals are used and when statements are sent; it does not specify when feecalc runs.

**Related memories:** None.

**Authoritative records:** None.

## Billing API minimum

**Remember:** The billing API rejects amounts under 50 cents.

**Why:** Not stated by the owner.

**How to apply:** Always check this limit first when specifying or sending an amount to the billing API.

**Evidence and limits:** Mike Rihm, in chat, 2026-09-29. The owner did not specify whether the limit applies to the late fee alone or the total due.

**Related memories:** None.

**Authoritative records:** None.

## Gotchas and lessons

None yet.
