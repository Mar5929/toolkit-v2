# Example: refining an iOS feature from a call transcript

A project with local work items and local memory. The owner wants people to log money transactions in his iOS app. The example shows a transcript saved and the first question asked. Replies are shortened.

## The idea and the transcript

> Owner: I want the part of the app where people log their transactions.
> Here's the transcript from yesterday's call with Dana. Help me plan this.
> (pasted transcript)

What the agent does, in order:

1. The work track skill finds no item about transactions and
   creates `WI-004`, "Log transactions in the iOS app", at
   `01-discovery`, with his words as the Starting request.
2. It saves the pasted text as
   `work-items/WI-004-log-transactions/references/2026-09-30-dana-call-transcript.md`
   and adds the Sources line.
3. The memory find skill finds nothing about transactions. The agent reads
   the transcript, writes three candidate requirements (R-01 to R-03, Status
   Refining) and four question rows (Q-01 to Q-04), and moves the item to
   `02-refinement`.

The reply:

> I made WI-004, "Log transactions in the iOS app", and saved the call
> transcript in its references folder. From the transcript: 3 draft
> requirements and 4 open questions. Nothing about transactions is in
> memory yet.
>
> Sources:
> - `references/2026-09-30-dana-call-transcript.md`: the goal and the
>   ten-second limit.
>
> Q-01: So the goal is: a person can record a purchase or a payment on
> their phone in under ten seconds, and see it in their list right away?
> Recommended: yes, because Dana said "if it takes more than ten seconds,
> nobody will do it" (`references/2026-09-30-dana-call-transcript.md`).
> Watch out: "under ten seconds" rules out a long form; required fields must
> be few.
> Not yet covered: what happens to a transaction entered twice by mistake.

The row saved before the reply ended:

```markdown
| Q-01 | So the goal is: a person can record a purchase or a payment on their phone in under ten seconds, and see it in their list right away? Recommended: yes, because Dana asked for under ten seconds. |  |  |  | Goal | Open | owner |
```
