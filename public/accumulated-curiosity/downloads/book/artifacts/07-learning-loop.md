# Learning-loop record

Use with [Chapter 7: The Accumulated Curiosity Loop](../chapters/07-the-accumulated-curiosity-loop.md). This is a human-led, book-developed practice for making inquiry and correction repeatable. It does not establish autonomous learning or certify an SSA-CMM level.

## No-code instructions

Keep the record in an ordinary document. Link the actual input, current instruction, output, and review. Start the second pass from those saved materials. Reopen edited files to check that your change exists, and inspect whether the next output uses it. No agent platform or automated write is required.

## Blank reusable record

**Project / owner:**

**Current procedure file and version:**

**Current working artifact:**

**Relevant prior artifacts:**

**Human review required at:**

**What the assistant is allowed to do:**

**Conditions that stop the work for clarification:**

### Pass [identifier and date]

**Question:** What uncertainty affects which decision?

**Starting understanding:** Write your own explanation before asking for help.

**Evidence inspected:** List source or practice files, exact locations, and limits.

**Proposed change:** What should behave differently, and why?

**Test:**

- Input:
- Current instruction/version actually supplied:
- Expected properties:
- Plausible failure:
- Review method:
- Stopping condition:

**Observed result:** Link the output and identify the relevant passage or behavior.

**Verdict:** Accept / revise / reject / unresolved, with a specific reason.

**Application:** Which working file changed, and how did you verify the saved change?

**Next question:**

**What remains unestablished:**

### Second-pass reuse check

- Prior correction this pass should use:
- Saved location where this correction is current:
- Different input or new task instance:
- Evidence that the correct version was supplied:
- Result showing reuse or recurrence of the defect:
- Diagnosis if the defect recurs:
- Next action:

## Reusable assistant prompt

```text
We are working on one bounded inquiry.

Question and decision: [state them]
Current explanation: [my own account]
Current instruction/version: [attach or paste]
Relevant evidence: [authorized material with source details]
Prior correction to preserve: [specific rule and reason]

Help perform this step: [investigate / critique explanation / draft /
compare output with evidence]. Do not silently expand to the whole project.

Return the requested artifact and a concise account of what it establishes,
what remains unresolved, and which evidence supports the result.
Do not invent missing facts or claim a file was saved unless an authorized
tool actually saved it and the saved state was checked.

I will review the result before adopting the change.
```

## Worked sample: fictional Himura Inc.

**Current project:** The synthetic thirty-minute meeting-notes-to-action-list workshop.

**Working artifact:** `workshop-brief-v1`.

**Prior records:** Capability baseline; `claim-evidence-ledger-v1`; `curiosity-map-v1`; `inquiry-brief-v1`; concept-deconstruction record; `connection-map-v1`.

**New cumulative record:** `learning-loop-v1`. Its first lines point to the current instruction and review sheet, illustrated by the [current-version entry](07-two-pass-practice-packet.md#current-version-entry) in the constructed practice packet. Earlier drafts remain identifiable as history.

### Pass run-01 — Get the correction into the working instruction

**Question:** Can a fresh attempt preserve an agreed action with missing ownership using saved materials alone?

**Starting diagnosis:** An old prompt still demands complete action details. The current review sheet allows an honest missing-owner flag. The two materials disagree.

**Explanation:** Agreement and readiness to execute are different conditions. The instruction must preserve an agreement while showing which required details remain unsettled.

**Proposed change:** Reconcile the current prompt with the review sheet; supply it in a fresh practice conversation. The [intermediate version](07-two-pass-practice-packet.md#intermediate-instruction-v1) shows an incomplete migration: the owner rule is restored but an old deadline instruction remains.

**Test input:** Synthetic notes include one explicit commitment, a suggestion, and an agreed change with an unassigned owner.

**Expected properties:** Preserve supported commitments; do not promote suggestions; flag missing owners and deadlines without inventing details.

**Observed fictional result:** The [first constructed output](07-two-pass-practice-packet.md#run-01-input-and-flawed-output) flags the owner gap but invents a deadline for the suggested venue inquiry.

**Verdict:** Revise. The response improved one field but still violates the evidence boundary for another.

**Application:** Compare the actual supplied instruction with the existing review sheet. Remove the old deadline suggestion and restore the already-accepted requirement; retain the failed output. The [corrected version](07-two-pass-practice-packet.md#current-instruction-v2) preserves both owner and deadline boundaries. Reopen saved files before starting again.

**Unestablished:** Customer demand, real learner outcomes, autonomous delivery, and general reliability.

### Pass run-02 — Check reuse on a changed input

**Prior correction:** Owners and deadlines require support; missing or imprecise details must remain visible.

**Changed input:** An agreed action has a deadline described only as “soon.”

**Expected property:** Preserve the imprecision or flag that a precise date is not specified. Do not invent a calendar date.

**Procedure:** Open the current-version pointer, load the saved instruction, supply the new input, and compare the output with the notes.

**Illustrative successful result:** The [second constructed output](07-two-pass-practice-packet.md#run-02-changed-input-and-reviewed-output) keeps “soon” as the stated timing and asks for a precise date before treating the assignment as scheduled.

**Verdict:** Accept the bounded behavior in this synthetic case. Preserve the output and rule; continue human review.

**Next question:** What should the procedure do when notes contain a genuine contradiction? Investigate only if that input belongs in the intended scope; otherwise define a clarification stop.

The entries illustrate the method. Readers must retain their own actual files and may observe different results. Do not use the fictional pass as a reliability statistic.

## Acceptance criteria

The record is usable when a reviewer can trace an uncertainty to evidence, evidence to a changed working instruction, and that instruction to a second attempt. The correct current version must be identifiable. Human decisions, assistant actions, and unresolved questions must be distinguishable.

A second pass that repeats a defect can still complete the exercise if the failure and broken handoff are documented. Claim improvement only when the recorded output supports it.

## Common failures and repairs

| Failure | Repair |
| --- | --- |
| Interesting explanation never changes the work | Identify the decision and update the relevant artifact, or retain the finding as background |
| Review says only “better” | Name the expected property, observed behavior, and evidence |
| Current and obsolete instructions conflict | Mark one current entry point and move superseded instructions to clearly labeled history |
| Next pass never reads the correction | Link and supply the saved current requirement before drafting |
| Model praises its own output without a check | Compare with the actual input, source, or an independent review criterion |
| Every failure creates a larger prompt | Diagnose version, conflicting examples, scope, and handoffs before adding text |
| Record becomes harder to maintain than the task | Keep question, evidence, tested change, verdict, and next action, with links to underlying files |

After an interval, explain the retained rule without opening the answer and apply it to a changed example. Use any gap to choose the next small practice. The schedule is yours to adapt; this record does not prescribe an experimentally validated review interval.

