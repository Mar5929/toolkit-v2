# Example: checking WI-031 and asking for the result approval

An iOS app that logs financial transactions, with local work items. The
owner is Mike Rihm. WI-031, "Add an expense by hand", was built on the
branch `claude/wi-031-add-expense`.

## The job block for the checker

The message is the brief text from `references/acceptance-checker.md`, word
for word, then:

```text
Work item: WI-031 Add an expense by hand
Check: result check
Folder, branch, and commit to check: /Users/mike/Projects/ledger/.claude/worktrees/wi-031-add-expense, claude/wi-031-add-expense, 9b7e210
Agreed goal: Mike can add an expense by hand in under ten seconds, and it shows in the list at once.
Requirements: <the R-01, R-02, and R-03 blocks, pasted in full; shortened here to their names and acceptance checks>
  R-01 Save an expense. Acceptance check: add $12.50 in Groceries today; it saves and shows at the top of the list.
  R-02 Reject a bad amount. Acceptance check: 0, -5, and a blank amount each show "Enter an amount above zero" and save nothing.
  R-03 Store whole cents. Acceptance check: ExpenseStoreTests.testStoresCents passes ($12.50 is stored as 1250).
Acceptance list: <the item's Acceptance list, pasted in full>
Design acceptance checks: <the design's Acceptance checks table and the How to check it column, pasted in full>
Test plan: <the text of tests/WI-031-test-plan.md>
Test commands: xcodebuild test -scheme Ledger -destination 'platform=iOS Simulator,name=iPhone 16'
```

## The reply to the owner

```text
Adding an expense by hand works: type the amount, pick a category, and it shows at the top of the list at once. An amount of 0, below 0, or blank now shows "Enter an amount above zero" and is not saved.

To try it: cd /Users/mike/Projects/ledger/.claude/worktrees/wi-031-add-expense, open Ledger.xcodeproj, and run it on the iPhone 16 simulator.

Independent check of commit 9b7e210:
- R-01 Save an expense: met. $12.50 in Groceries saved and showed at the top.
- R-02 Reject a bad amount: met. 0, -5, and blank each showed the message; nothing saved.
- R-03 Store whole cents: met. ExpenseStoreTests.testStoresCents passed.
- xcodebuild test: "Executed 42 tests, with 0 failures".

Gap: not tried on a real iPhone, only the simulator.

Sources:
- WI-031: R-01 to R-03 and the Acceptance list.
- tests/WI-031-test-plan.md: the five scenarios and their results.
- The independent checker's report on commit 9b7e210.

Do you approve this result?
```
