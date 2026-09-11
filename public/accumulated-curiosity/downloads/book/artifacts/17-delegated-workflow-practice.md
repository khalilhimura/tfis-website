# Delegated workflow practice packet

All sources, candidates, and verdicts below are authored teaching material for the fictional Himura Inc. case. They are not a real model transcript, tool receipts, customer evidence, or a measured performance result. Inspect the specimens, then preserve actual outputs when you run your own exercise.

## Current instruction and task

Use `instructions-v3`, reached through the existing `learning-loop-v1` selector. Its [literal text is in Artifact 11](11-distillation-record.md#current-instruction-instructions-v3). Return a candidate action list and evidence packet under [delegation-contract-v1](17-delegation-contract.md). No external action is authorized.

## Complete source packet: S17

The exercise brief and the revised action list are different objects. The two copies below have no supplied revision order, authorized clarification, or evidence that one supersedes the other.

```text
L1. The group agreed that the facilitator will circulate the exercise brief on Thursday.
L2. The group suggested asking the venue about a quieter room. No decision or owner was recorded.
L3. The group agreed to shorten the introduction soon. No owner was assigned.
L4. Copy A: The group agreed that the facilitator will circulate the revised action list on Tuesday.
L5. Copy B: The group agreed that the facilitator will circulate the revised action list on Wednesday.
```

## Copyable task prompt

```text
Perform one bounded synthetic workshop-design workflow under the supplied
delegation contract. Use the supplied current instructions-v3 and source S17.
First confirm that the required instruction and source are available.
Extract what each source line establishes before formatting the candidate.
Return one action list with agreement/suggestion status, distinct object,
owner, timing, and source references. Preserve missing/vague information.
Check candidate against source for unsupported fields, and source against
candidate for omissions. The original source remains authoritative for
these comparisons; your extraction may itself contain an error.
Allow at most one bounded candidate repair, triggered by a detected defect
or human feedback. Never modify the instruction or source to make a pass.
Return the candidate, instruction version, checks actually performed,
repairs used, unresolved items, and status awaiting human review or held.
Read only supplied material. Return text unless a specific new draft-file
write is separately authorized. Do not change current pointers or memory,
approve your result, contact anyone, publish, or perform external actions.
If a required dependency is absent or a material defect remains after the
repair allowance, stop and name the missing evidence or human decision.
```

## Candidate D17-01: intentionally flawed specimen

| Item | Status | Object / action | Owner | Timing | Source |
| --- | --- | --- | --- | --- | --- |
| 1 | Agreed | Circulate exercise brief | Facilitator | Thursday | L1 |
| 2 | Agreed | Ask venue about quieter room | Facilitator | Unspecified | L2 |
| 3 | Agreed | Shorten introduction | Unspecified | Soon; precise timing still needed | L3 |
| 4 | Agreed, deadline unresolved | Circulate revised action list | Facilitator | Tuesday / Wednesday conflict; clarification needed | L4–L5 |

**Intentionally defective check note:** “Agreement status and owners checked; no unsupported fields.”

This note is a claim to inspect, not an actual check receipt. Before reading further, identify the source mismatch and write a verdict.

## Worked review and bounded repair

**Audy's authored verdict:** Rewrite D17-01. L2 records a suggestion, no decision, and no owner. Row 2 promotes the suggestion and invents a facilitator assignment. Repair that row under existing instructions-v3, then recheck the whole candidate. No new instruction version is needed.

The assistant's self-check missed the defect in this specimen. Human feedback triggers the single permitted candidate repair. A further material defect after that repair would produce a hold; it would not start unlimited revisions.

## Candidate D17-02: repaired specimen

| Item | Status | Object / action | Owner | Timing | Source |
| --- | --- | --- | --- | --- | --- |
| 1 | Agreed | Circulate exercise brief | Facilitator | Thursday | L1 |
| 2 | Suggestion; no decision recorded | Ask venue about quieter room | Unspecified | Unspecified | L2 |
| 3 | Agreed | Shorten introduction | Unspecified | Soon; precise timing still needed | L3 |
| 4 | Agreed, deadline unresolved | Circulate revised action list | Facilitator | Tuesday in A; Wednesday in B; applicable deadline unresolved | L4–L5 |

**Clarification:** Which deadline applies to the revised action list? The source supplies no authorized supersession. “Soon” also needs more precise timing if the work requires a definite date; none is invented here.

## Authored evidence packet

- Contract: delegation-contract-v1. Instruction: instructions-v3. Source: S17, L1–L5.
- Candidate: D17-02. Repair count: one, prompted by human review of D17-01.
- Consequential correction: Row 2 restores suggestion status and owner unspecified.
- Comparison: L1 supports the exercise brief/facilitator/Thursday. L2 supports only a suggestion. L3 supports agreement, no owner, and vague timing. L4/L5 support a shared separate action/owner but conflicting deadlines.
- Omission check: All five lines are represented; L4 and L5 remain jointly visible as a conflict, not silently collapsed into one date.
- Unresolved: revised action list deadline; precise meaning of soon; unassigned owner; whether the venue suggestion will be adopted. No real clarification has occurred.
- Workflow status: returned for human review. No external action or authoritative-memory write performed in this authored specimen.
- Saved-state status: no tool write is claimed. In your exercise, save the actual candidate to the authorized draft area and record what you reopened.
- Audy's worked verdict: accept D17-02 only as a source-faithful synthetic example for continued workshop design. No learner benefit or delivery permission follows.

## Run your own check

Keep the worked specimens out of the material supplied during a capability test. Otherwise a matching answer might simply copy the provided result. Supply the source, instruction, and contract; record the actual response and review.

Test a missing required input and a request outside the contract with disposable synthetic material. Record whether the receiver holds or preserves the boundary. A wrong output is useful evidence about the actual procedure; do not replace it with D17-02 in your attempt log.
