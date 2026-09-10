# Distillation record

Use this with Chapter 11. Produce a proposed record for a defined future use, review it against the source, approve a precise change, and verify the stored result. This template is an original book exercise. It is not an official SSA-CMM certificate or a universal knowledge schema.

## Blank reusable template

**Record ID and status:**

**Project, scope, and intended future use:**

**Source boundary:** Full conversation / partial export / supplied notes / other. Identify what is available and what is missing.

**Source locations and portions actually inspected:**

**Relevant charter, current-instruction route, and existing rationale:**

| Entry ID | Candidate statement | Kind: source / inference / decision / scoped preference | Support and exact location | Limits or contradiction | Proposed treatment |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

### Consequential decision

- Problem addressed:
- Alternatives and why they were rejected:
- Selected behavior and scope:
- Evidence supporting the reason:
- What remains uncertain:
- What would trigger review:
- Material excluded and why:

### Change and approval

- Is this correcting a record, receiving corrected evidence, making a new decision, or preserving unresolved disagreement?
- Previous statement and status:
- Exact proposed replacement or addition:
- Human verdict, approver, and approval scope:
- Destination and version:
- Current pointer or related records to change, if any:
- Source/history retained for explanation:

### Stored-state and reuse check

- Opened actual saved location:
- Approved wording present:
- Evidence links followed:
- Rejected/superseded content visibly labeled:
- Current-instruction pointer checked:
- Fresh input and material supplied:
- Retrieval result:
- Application result:
- Earlier case checked for regression, if relevant:
- Failure, repair, and repeat result:
- Limits of this check:

## Fictional worked sample: conflicting workshop notes

**Record:** `distillation-record-v1`, reviewed project record. The synthetic exercise belongs to Maya's proposed thirty-minute Fieldwork workshop. It is not customer evidence or an observed learning result.

**Future use:** Explain and test how action-list practice handles supplied deadline statements that conflict without an established supersession relationship.

**Source A, passage 1:** “The group agreed that the facilitator will circulate the revised action list on Thursday.”

**Source B, passage 1:** “The group agreed that the facilitator will circulate the revised action list on Friday.”

These two short passages are the complete synthetic input for this example. No authorized clarification, reliable revision order, or superseding statement is supplied. Labels A and B identify passages; their order does not establish authority.

| Entry | Statement | Kind | Support / limit | Reviewed treatment |
| --- | --- | --- | --- | --- |
| C11-01 | Source A states the facilitator will circulate the revised action list on Thursday. | Source claim | A, passage 1; synthetic statement, not proof of a real commitment. | Retain faithfully. |
| C11-02 | Source B states the same action and owner with Friday as deadline. | Source claim | B, passage 1; no evidence it supersedes A. | Retain faithfully. |
| U11-01 | The applicable deadline is unresolved in the supplied packet. | Conclusion about available evidence | A/B conflict; no supplied resolution. | Retain with both links. |
| D11-01 | Keep the shared action and owner, show both deadline claims, and request clarification before presenting one as confirmed. | Approved design decision | Addresses the specific ambiguity while preserving established shared content. | Add to the practice instructions after review. |
| R11-01 | Friday was confirmed when the schedule was clarified. | Unsupported candidate claim | No clarification exists in the input. | Reject; keep only as a labeled failure example if useful. |

**Rationale:** Selecting Friday would invent supersession. Removing the whole action would lose content consistent across the inputs. The approved response preserves what agrees and locates uncertainty specifically in the deadline.

**Change type:** Correct the candidate account's unsupported confirmation claim. No new real-world deadline decision is created.

**Approval:** Maya approves the repaired project record and the bounded conflict-handling instruction. She approves neither Thursday nor Friday as the applicable deadline. The scope is representation of this kind of supplied ambiguity in the synthetic workshop practice.

**Save route:** Save the reviewed record in the Fieldwork project workspace. Save the approved revision as `instructions-v3` and update the existing selector in `learning-loop-v1`; do not create another selector in this record. Link the explanatory `action-list-rule-rationale-v1` to this case. The general `commitment-evidence-principle-v1` can remain unchanged because it already expresses the relevant broad distinction.

### Current pointer excerpt

The following is the revised entry in the existing fictional `learning-loop-v1`, reproduced here for inspection. In a working project, this is one selector; this worksheet does not create a second selector to maintain.

- Current drafting instruction: [instructions-v3](#current-instruction-instructions-v3).
- Earlier instruction v2: superseded by instructions-v3, retained with the [Chapter 7 practice history](07-two-pass-practice-packet.md#current-instruction-v2).
- Reason for change: add handling for conflicting deadlines without an established supersession relationship; retain earlier owner, timing, suggestion, and source-reference boundaries.
- Supporting record: `distillation-record-v1`, entries C11-01, C11-02, U11-01, D11-01, and rejected R11-01 above.
- Rationale route: `action-list-rule-rationale-v1` links this reviewed decision to earlier owner and deadline corrections.

### Current instruction: instructions-v3

This is authored teaching material for the fictional case, not a transcript of a real model run. It extends the literal v2 instruction with the reviewed conflict-handling boundary.

```text
Convert the supplied notes into an example action list for workshop design.
Separate agreed actions from suggestions. Preserve source line numbers.
For owners and timing, use only what the notes establish.
If a detail is absent, write "unspecified". If it is vague, retain the
wording and identify the precision still needed; do not invent a date.
Provide a brief source-based reason for any correction or clarification.
When supplied deadline statements conflict and the material establishes
no authorized supersession, keep independently supported shared content,
including the agreed action and shared owner when both are established.
Show both conflicting deadline claims with their source references.
Mark the applicable deadline unresolved and request clarification before
presenting either deadline as confirmed. Do not invent a clarification.
```

For the two passages above, source references can be `A:1` and `B:1`. Labels and document order do not establish which deadline applies. Whether an explicitly authorized later amendment would justify supersession is a further inquiry, not a result established by this practice case.

**Stored-state check:** Reopen the saved record from the project index, inspect both source claims and the unresolved status, follow the current instruction pointer, and confirm the rejected Friday confirmation stays labeled rejected in retained history. An assistant saying “saved” is not this check.

### Fresh-use specimen and regression check

Use the current instructions-v3 above. These are constructed teaching inputs and expected contrasts, not actual execution results. Keep the expected output separate when running your own attempt.

```text
C:1 The group agreed that the facilitator will circulate the revised
    action list on Tuesday.
D:1 The group agreed that the facilitator will circulate the revised
    action list on Wednesday.
The packet gives no reliable revision order or authorized supersession.
```

**Expected specimen:**

| Status | Action | Owner | Timing | Evidence |
| --- | --- | --- | --- | --- |
| Agreed | Circulate the revised action list | Facilitator | Tuesday in C:1; Wednesday in D:1; applicable date unresolved | C:1 and D:1 |

**Clarification:** Which deadline applies? Both sources agree about the action and owner, but the supplied material does not settle the date.

**Reject these candidates:** “Friday is confirmed” copies an earlier answer whose date does not occur here. “Wednesday is confirmed because D follows C” invents supersession. A candidate listing “Thursday/Friday unresolved” has preserved the idea of conflict but failed to apply it to the actual new input.

**Earlier-owner regression input:** “E:1 The group agreed to shorten the opening discussion. No owner or deadline was assigned.”

| Status | Action | Owner | Timing | Evidence |
| --- | --- | --- | --- | --- |
| Agreed | Shorten the opening discussion | Unspecified | Unspecified | E:1 |

This expected row keeps an established agreement visible without inventing an assignment. Reject a response that drops it because ownership is missing or copies “facilitator” from the unrelated deadline examples.

For your actual checks, record the input, supplied instruction version, first output, review, and any repair. The expected specimens above make comparison possible; they do not supply your observed result.

**Interpretation:** These small synthetic checks inspect particular behaviors. They do not establish a measured general reliability rate, actual learner improvement, market demand, or that a real deadline has been resolved.

## Acceptance criteria

- The future use and available source boundary are explicit.
- Consequential claims can be checked separately without losing their meaning.
- Source claims, inferences, decisions, and preferences retain their distinct status.
- Conflicting evidence remains visible unless an actual authorized resolution is supplied.
- Rationale explains a material choice and its limits; unsupported certainty is removed.
- Approval identifies the exact wording, scope, and destination.
- Reopened saved state matches the approved record; links and current pointers work.
- A fresh attempt applies the retained lesson and preserves relevant earlier corrections.

## Common failure and repair

| Failure | Repair |
| --- | --- |
| A hypothesis becomes a customer fact | Restore its hypothesis status and link the evidence ledger; do not invent validation. |
| Repeated assistant summaries look like independent support | Trace them to the original source and count the support accurately. |
| The latest-looking passage silently wins a conflict | Check actual authority and supersession; retain the conflict when neither is established. |
| A correction is recorded as though the world changed | State whether the source, record, or authorized decision changed. |
| A short summary loses the reason for the rule | Restore the consequential rejected alternatives, scope, and source route. |
| The assistant reports saving, but the next task sees an old version | Open the destination and current selector; repair the actual write or pointer. |
| Fresh attempt repeats the old example's answer | Clarify the rule's meaning, use the changed input, and repeat the check. |

Keep rejected drafts outside authoritative memory unless their labeled history has a defined purpose. Retention and sharing continue to follow the charter.
