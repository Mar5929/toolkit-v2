---
name: project_money_calculation
description: tipcalc money arithmetic constraint and its reason
updated: 2026-09-28
metadata:
  type: project
status: current
source: Mike Rihm, in chat, 2026-09-28
last_verified: 2026-09-28
authorization: Approved by Mike Rihm on 2026-09-28
supersedes: none
---

# Money calculation

## Whole cents

**Remember:** tipcalc must always do its money math in whole cents, never in floating-point dollars.

**Why:** Floating-point gave Mike split shares like $33.339999 in his last calculator.

**How to apply:** Parse money values exactly, carry calculations with integer cents or exact decimal representations until rounded to cents, and format output from whole cents. Check this constraint when changing tip, total, or split calculations.

**Evidence and limits:** Mike Rihm, in chat, 2026-09-28. Applies to all tipcalc money calculations. The current WI-001 and WI-002 designs already use exact decimal input and integer-cent calculations.

**Related memories:** None.

**Authoritative records:** WI-001 DESIGN.md; WI-002 DESIGN.md.

## Venmo rejects payments with a fraction of a cent, so every split share must be a whole-cent amount

**Remember:** Venmo rejects payments with a fraction of a cent, so every split share must be a whole-cent amount.

**Why:** Venmo rejects fractional-cent payments.

**How to apply:** Keep every displayed split share in whole cents, using the approved upward rounding rule in WI-001 R-02.

**Evidence and limits:** Mike Rihm confirmed in chat on 2026-09-28 that he had told the agent this earlier and approved keeping it. This records his statement about Venmo; no separate Venmo source was checked.
