# Two-pass practice packet

Every instruction, input, and response below is **authored teaching material for the fictional Himura Inc. case**, not a transcript of a real model run. There are no tool receipts or measured performance rates. Compare these specimens yourself, then retain actual records when performing your own exercise. The immediate output is an example action list used to check the design of `workshop-brief-v1`; it is not evidence that a learner has completed the workshop.

## Current-version entry

An illustrative `learning-loop-v1` entry:

- Current drafting instruction: [v2](#current-instruction-v2).
- Current review criteria: [review sheet](#review-sheet).
- Previous failed attempt: [run-01](#run-01-input-and-flawed-output).
- Changed-input reuse check: [run-02](#run-02-changed-input-and-reviewed-output).
- Reason for the revision: [migration diagnosis](#review-and-migration-diagnosis).

The instruction governs the next attempt. The history explains it. A link to the failed attempt does not make its instruction current again.

## Obsolete instruction v0

```text
Convert notes into a complete follow-up list. Give every action an owner.
Suggest practical deadlines so the list is ready to use.
```

Both requirements can encourage invented details. Previous chapters already rejected them as standards for a faithful action list.

## Intermediate instruction v1

```text
Convert the supplied notes into an example action list for workshop design.
Separate agreed actions from suggestions. Preserve the source line numbers.
Use an owner only when the notes name one; otherwise write "unspecified".
Suggest practical deadlines so the list is ready to use.
```

The owner correction reached this document. The deadline correction did not. This explicit conflict supports diagnosing an incomplete migration. It does not prove how a real model would respond.

## Review sheet

- Each agreed action must have support in the notes.
- Keep suggestions separate from agreements.
- Owners and deadlines must come from the notes; preserve missing or imprecise details.
- Give a short source-based reason for any correction.
- Judge meaning, allowing faithful paraphrases.

These requirements carry forward the existing decisions from Chapters 4–6.

## Run-01 input and flawed output

**Instruction supplied:** the intermediate v1 above.

**Synthetic input:**

```text
1. The facilitator agreed to circulate these notes by Friday.
2. Someone suggested asking the venue about access; nobody took this on.
3. The group agreed to shorten the next introduction. No owner was assigned.
```

**Constructed flawed output:**

| Status | Item | Owner | Timing | Source |
| --- | --- | --- | --- | --- |
| Agreed | Circulate the notes | Facilitator | Friday | 1 |
| Suggestion | Ask the venue about access | Unspecified | Wednesday | 2 |
| Agreed | Shorten the next introduction | Unspecified | Unspecified | 3 |

The second row remains a suggestion, but its Wednesday timing has no support. Keeping the status correct does not make the invented date acceptable.

## Review and migration diagnosis

**Verdict:** Revise the example; reject the unsupported Wednesday date.

**Evidence:** Input line 2 contains no date. The supplied v1 still asks for practical deadlines, while the review sheet forbids invention. The requirements conflict.

**Repair:** Remove the obsolete deadline instruction and restore the existing evidence boundary. The corrected second row reads: suggestion; ask the venue about access; owner unspecified; timing unspecified; source 2.

**Working change:** The proposed workshop brief uses that distinction in its example answer and retains an individual attempt before comparison. Its existing learner task does not change. Record v2 as current; keep v1 attached to this history.

In your real exercise, reopen the edited instruction and confirm what was saved. This specimen does not claim a tool wrote or verified a file.

## Current instruction v2

```text
Convert the supplied notes into an example action list for workshop design.
Separate agreed actions from suggestions. Preserve source line numbers.
For owners and timing, use only what the notes establish.
If a detail is absent, write "unspecified". If it is vague, retain the
wording and identify the precision still needed; do not invent a date.
Provide a brief source-based reason for any correction or clarification.
```

## Run-02 changed input and reviewed output

**Instruction supplied:** current v2, reached through the entry above.

**Synthetic input:**

```text
1. The facilitator agreed to send the revised worksheet soon.
2. The group suggested asking another educator for examples; no one agreed
   to contact them and no timing was discussed.
```

**Constructed reviewed output:**

| Status | Item | Owner | Timing | Source |
| --- | --- | --- | --- | --- |
| Agreed | Send the revised worksheet | Facilitator | Soon; precise date unspecified | 1 |
| Suggestion | Ask another educator for examples | Unspecified | Unspecified | 2 |

**Clarification:** Line 1 establishes an agreement and an owner, but “soon” cannot determine a calendar date. Confirm a precise date before treating this as a scheduled commitment. Line 2 does not authorize contacting anyone.

**Verdict:** Accept the displayed example under the review sheet. Its owner and timing fields preserve the supplied evidence. It illustrates how the saved correction applies to a changed input; it establishes neither actual model reliability nor a learner outcome.

**Next unresolved case:** Notes that contain conflicting dates for the same commitment. Preserve both statements and seek clarification; the examples above do not settle that conflict.

## Use this packet

Before reading the verdicts, mark each unsupported field yourself. Then compare v1 and v2 and explain which existing decision failed to reach the intermediate document. For your own two passes, save actual inputs and outputs, note the supplied version, and record a failure honestly if it recurs. Merely copying the successful specimen cannot demonstrate reuse.

Return to the [learning-loop record](07-learning-loop.md) or [Chapter 7](../chapters/07-the-accumulated-curiosity-loop.md).
