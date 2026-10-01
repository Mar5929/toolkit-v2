# Example: the reply that presents the design options

A Salesforce project. WI-012 is "Move the 15 personas to the new org". Its requirements were approved on 2026-09-30 (Q-05). The owner says "Design WI-012." The design is saved as proposed, with "Selected design: Pending owner decision." and the choice question as the open row Q-06. The reply to the owner:

> The design for WI-012 has two options.
>
> - Option A moves all 15 personas as they are: one permission set group
>   each. Least change, but 15 groups to maintain.
> - Option B merges the personas that have the same access into 9 groups.
>   Every persona keeps its access, and a before-and-after report shows it.
>
> I recommend B: the same access with 6 fewer groups. Its main risk is a
> merge that removes access someone needs; the report shows any lost access
> before people start using the new org. Both options follow the rule that
> access comes from permission set groups, never profiles (memory:
> `decision_permission_model.md`).
> Build order: groups, then assignments, then the report. The full design is
> in WI-012's `DESIGN.md`.
>
> Sources:
>
> - `decision_permission_model.md`: access comes through permission set
>   groups only.
> - WI-012, R-01 to R-04: who gets which access, and how to check it.
>
> Which option should we build? I recommend B.
