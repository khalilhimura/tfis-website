# System Contracts

Use with [Chapter 19](../chapters/19-the-solo-systems-architect.md). Define a small role arrangement only when its boundaries serve a useful purpose. The core exercise is a manual simulation with authored specimens, not a claim of deployed multi-agent performance or SSA-CMM certification.

## Blank reusable template

**System-contract name and revision:**

**Bounded outcome:**

**Existing simpler workflow:**

**Limitation the proposed separation addresses:**

**Current-instruction route and version:**

**Charter and permission boundary:**

**Responsible person:**

### Role contracts

| Role | Reason for separate responsibility | Required input and versions | Permitted operations | Required returned artifact | Hold/escalation condition |
| --- | --- | --- | --- | --- | --- |
| Drafter | | | | | |
| Checker | | | | | |
| Coordinator | | | | | |
| Human reviewer | | | | | |

Roles may be performed by one person in sequence. Separate names or sessions do not establish independent errors or simultaneous work.

### Expected artifacts and receipts

| Job | Artifact role | Expected identity/version | Source and instruction | Actual return/location | Target candidate, if applicable | Completeness/compatibility result |
| --- | --- | --- | --- | --- | --- | --- |
| | Candidate | | | | | |
| | Comparison | | | | | |

**Duplicate-return rule:**

**What happens if the same identity contains different content:**

**What happens when a source or candidate changes during checking:**

**Permitted repair count and scope:**

**What requires a new human decision:**

### Review record

**Literal source or stable authorized location:**

**Candidate inspected:**

**Comparison findings with source references:**

**Human verdict and scope:**

**Approved saved result and verification:**

**Unresolved matters:**

**Earlier cases checked after repair:**

### Architecture decision after rehearsal

**Preparation, handoff, review, waiting, and repair effort observed:**

**Useful benefit of separation, if any:**

**Simplification or further bounded test warranted:**

## Fictional worked sample: Fieldwork J19-01

**Contract:** `system-contracts-v1`.

**Purpose:** Test whether separate candidate and comparison returns improve the inspectability of the existing synthetic action-list workflow. This is not a fresh test of general task capability: it deliberately reuses C16.

**Authority:** Project index → `learning-loop-v1` → `instructions-v3`. No instruction revision is introduced. Current rules preserve supported commitments, suggestions, owners, imprecise dates, and unresolved contradictory deadlines. Explicit later amendments remain an untested extension.

### Role arrangement

| Role | Input | Allowed work | Required return |
| --- | --- | --- | --- |
| Drafter | J19-01, C16 below, instructions-v3, charter, candidate requirements | Create a new candidate; make the allowed bounded repair from source-supported feedback | Candidate ID/version, source/instruction used, literal content, unknowns, actual location if saved |
| Checker | Same source and criteria; exact candidate version | Derive expected properties; compare every material item; report defects | Distinct comparison report naming candidate version and source lines; repair suggestion may be additional |
| Coordinator, performed by Maya | Expected artifact table and actual receipts | Match job, artifact role, source/instruction, target version, and locations | Complete compatible packet or precise hold; no substantive self-approval |
| Human reviewer, Maya | Candidate and matching comparison | Judge stated internal use; accept/reject/rewrite within scope | Scoped verdict, needed repair, saved-state check where applicable |

Routine reversible drafting and source comparison proceed within the existing authorization. No role may alter source, current selector, reviewed memory, or external communications under this contract. The allowed repair remains bounded; a remaining material defect returns for human diagnosis.

### Complete synthetic source C16

> C1. The coordinator agreed to upload the accessible slides by Tuesday.
>
> C2. The group suggested asking the library about a larger room. Nobody accepted that task and no timing was discussed.
>
> C3. The facilitator agreed to send the revised handout by Thursday.
>
> C4. Another note says the facilitator agreed to send the same revised handout by Friday. The packet establishes no order or supersession.
>
> C5. The group agreed to shorten the opening discussion. No owner or deadline was assigned.

### Authored candidate D19-01-v1

| Status | Item | Owner | Timing | Source |
| --- | --- | --- | --- | --- |
| Agreed | Upload accessible slides | Coordinator | By Tuesday | C1 |
| Agreed | Ask library about larger room | Coordinator | Unspecified | C2 |
| Agreed; timing unresolved | Send revised handout | Facilitator | By Thursday / by Friday; applicable deadline unresolved; clarification required | C3–C4 |
| Agreed | Shorten opening discussion | Unspecified | Unspecified | C5 |

Row two violates the already-supplied rule. Its source establishes only a suggestion and explicitly says nobody accepted it.

### Failed receipts: two returns, missing check

| Return | Job | Artifact role actually returned | Identity | Receipt conclusion |
| --- | --- | --- | --- | --- |
| Drafter | J19-01 | Candidate | D19-01-v1 | Candidate slot occupied |
| Checker | J19-01 | Another candidate with row two rewritten | D19-01-alt | Candidate category duplicated; comparison report missing |

**Incorrect coordinator conclusion:** “Two assigned tasks, two files received, ready for review.”

**Correct diagnosis:** A source-comparison artifact is missing. An alternate draft does not establish what was checked or which version was inspected.

**Repair request:** Return C19-01-v1 identifying D19-01-v1, C16, instructions-v3, each material comparison, unresolved items, and the specific repair. A rewritten row can accompany the report but cannot replace it.

### Required comparison C19-01-v1

**Target:** D19-01-v1. **Source:** C16. **Instruction:** instructions-v3.

| Candidate item | Source finding | Review result |
| --- | --- | --- |
| Slides | C1 establishes action, coordinator, and “by Tuesday” deadline. | Preserved. |
| Library inquiry | C2 establishes suggestion only; no accepted owner or timing. | Rewrite status and owner; retain source gap. |
| Handout | C3–C4 share action/owner but conflict on deadline with no supersession. | Preserve both dates and clarification requirement. |
| Opening discussion | C5 establishes agreement without owner/deadline. | Keep item and gaps visible. |

This report supports a bounded repair. It does not resolve the handout deadline or certify all future outputs.

### Authored repaired candidate D19-01-v2

| Status | Item | Owner | Timing | Source |
| --- | --- | --- | --- | --- |
| Agreed | Upload accessible slides | Coordinator | By Tuesday | C1 |
| Suggestion | Ask library about larger room | Unspecified | Unspecified | C2 |
| Agreed; timing unresolved | Send revised handout | Facilitator | By Thursday / by Friday; applicable deadline unresolved; clarification required | C3–C4 |
| Agreed | Shorten opening discussion | Unspecified | Unspecified | C5 |

### Deliberate stale-report defect

Attempted packet: **D19-01-v2 + C19-01-v1**.

C19-01-v1 explicitly targets D19-01-v1. The coordinator holds the join because the target candidate differs. Reopening the old report does not change its target.

Repair: compare D19-01-v2 against C16 and the retained properties, then return **C19-01-v2** naming D19-01-v2. Its observations must confirm the corrected library status/owner and the preserved slides, conflict, and opening-discussion properties. Keep the earlier report in its original attempt history.

### Authored fresh comparison C19-01-v2

**Job:** J19-01. **Target:** [D19-01-v2](#authored-repaired-candidate-d19-01-v2). **Source:** [C16](#complete-synthetic-source-c16). **Instruction:** [instructions-v3](11-distillation-record.md#current-instruction-instructions-v3).

| Candidate item | Source finding | Outcome for D19-01-v2 |
| --- | --- | --- |
| Slides | C1 establishes the slides action, coordinator, and deadline “by Tuesday.” | Preserved, including the deadline qualifier and C1 reference. |
| Library inquiry | C2 establishes a suggestion; nobody accepted it, and no timing was discussed. | Corrected to Suggestion with unspecified owner/timing and C2 reference. |
| Handout | C3–C4 share the action and facilitator but give “by Thursday” and “by Friday,” without an established supersession. | Both deadline claims remain visible with their qualifiers, references, unresolved status, and clarification requirement. |
| Opening discussion | C5 establishes agreement but no owner or deadline. | Agreed item retained with unspecified owner/timing and C5 reference. |

**Report conclusion:** This displayed candidate satisfies the stated representation criteria. The handout deadline remains unresolved in the source; the report does not select one. This is an authored comparison specimen, with no model execution or saved-file verification implied.

### Complete repaired receipt

| Job | Candidate | Comparison | Source/instruction | Status |
| --- | --- | --- | --- | --- |
| J19-01 | D19-01-v2 | [C19-01-v2](#authored-fresh-comparison-c19-01-v2), targeting D19-01-v2 | C16 / instructions-v3 | Complete compatible packet for Maya's internal review |

**Scoped verdict:** The displayed corrected candidate represents the synthetic source under the stated criteria. Handout timing remains unresolved. No customer delivery, repeated model reliability, or learner outcome is established.

These are authored specimens. Preserve your own actual first returns, failed receipts, repair, and repeated check when conducting the exercise.

## Acceptance criteria

- Each role has a stated purpose and an inspectable returned object.
- Current instruction and permission authority remain unchanged unless separately reviewed.
- Candidate and comparison are different required artifacts.
- Returns identify job, source/instruction, output version, and comparison target.
- Duplicate-category, missing-artifact, and stale-target defects are detected.
- Disagreement returns to source and governing authority rather than a vote.
- Routine authorized drafting can proceed; consequential changes have explicit boundaries.
- The exercise records coordination cost and whether separation helped.

## Common failure and repair

| Failure | Repair |
| --- | --- |
| Two files are counted as two required results. | Match artifact roles and content, not only message count. |
| Checker returns a rewritten draft without a report. | Require source findings and the exact inspected candidate; keep rewrite as an optional addition. |
| Old comparison accompanies a new candidate. | Hold the join; check the new version and identify the new target. |
| Same identity arrives with different content. | Preserve ambiguity and require a clear versioned return. |
| Source changes while roles are working. | Keep attempt inputs stable; identify and review the new source version before combining results. |
| Two roles agree without inspecting source. | Derive expected properties from source and require traceable comparison. |
| Coordinator invents substantive approval. | Limit it to completeness/compatibility; route meaning to responsible review. |
| Repair limit is bypassed by renaming the job. | Preserve the job's bounded allowance and escalate remaining defects. |
| Role separation adds work without useful evidence. | Return to the simpler workflow or narrow the additional role. |
