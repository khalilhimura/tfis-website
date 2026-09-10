# Connection map

Use with [Chapter 6: The Polymath Advantage](../chapters/06-the-polymath-advantage.md). The map is a book-developed practice for testing an adaptation across domains. It is not a validated measure of transfer or a claim of generalist superiority.

## No-code instructions

Copy the blank record into an ordinary document. Place the source situation and the target problem beside each other. Describe a relationship, then construct a small example that could show where the adaptation fails. You can review the example by reading it; no software testing framework is required.

## Blank reusable record

**Project / date / owner:**

**Target difficulty:**

**Decision the adaptation could change:**

**Source idea:**

**Source reference / passage actually inspected:**

**What I understand well enough to evaluate:**

**Where I need specialist help:**

### Mapping

| Relationship or operation in the source | Proposed counterpart in my task | Why the relationship may fit | Important difference / missing assumption |
| --- | --- | --- | --- |
| | | | |
| | | | |

**One-sentence proposed adaptation:**

**Parts of the analogy I will not carry over:**

### Trial

- Input / example file:
- Original approach:
- Adapted approach:
- Expected useful difference:
- What would make me reject the adaptation:
- Review method and reviewer:

| Case | What changes or could fail? | Result under original approach | Result under adapted approach | Evidence and verdict |
| --- | --- | --- | --- | --- |
| Plausible defect | | | | |
| Valid variation | | | | |
| Boundary case | | | | |

**Decision:** Keep / revise / reject / seek more evidence.

**Specific reason:**

**Working artifact changed:**

**Condition under which the decision needs revisiting:**

## Worked sample: fictional Fieldwork

Maya is designing a synthetic thirty-minute workshop in which adult learners convert meeting notes into an action list. No learner performance or customer demand is established by this design exercise.

**Target difficulty:** Detect invented commitments, owners, and deadlines while allowing faithful paraphrases.

**Source idea:** Evaluate whether an output satisfies meaningful requirements rather than only matching one reference sentence.

**Relevant engineering source:** Grace, M., Hadfield, J., Olivares, R., & De Jonghe, J. (2026, January 9). *Demystifying evals for AI agents*. Anthropic. https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

**Inspected location:** “Types of graders for agents,” including limitations of exact checks, and “Design graders thoughtfully.” The source is engineering guidance about AI systems. The workshop adaptation is Maya's design proposal, not a tested finding from that article.

| Source operation | Workshop counterpart | Useful relationship | Mismatch |
| --- | --- | --- | --- |
| Defined input | Synthetic meeting notes | Review has evidence to compare with output | Real notes may omit shared context |
| Requirement | Only agreed actions are commitments | Check meaning rather than appearance | Ambiguity may require a question |
| Output condition | Named owners and deadlines need support | Detect plausible invented detail | Missing information can be validly flagged |
| Review verdict | Reason tied to a note | Shows why a response needs revision | Learners also need a chance to explain and retry |

**Rejected part of the analogy:** Treating a single model answer as the only valid output; treating a pass as proof of learning transfer.

### Synthetic notes

```text
1. The facilitator agreed to circulate the notes by Friday.
2. The group suggested asking the venue about access arrangements.
   Nobody was assigned to do this.
3. The group agreed to try a shorter introduction at the next session.
   No owner was named.
```

### Plausible defective output

```text
- The facilitator will circulate the notes by Friday.
- The coordinator will contact the venue about access.
- The facilitator will prepare the shorter introduction by Thursday.
```

**Review:** First item is supported. Second converts a suggestion into an assigned commitment and invents the coordinator. Third preserves an agreed change but invents the owner and Thursday deadline.

### Valid variation

Both “The facilitator will circulate the notes no later than Friday” and “Owner: facilitator; action: circulate notes; due: Friday” preserve the first line's meaning. An exact-wording check would be inappropriate if it rejected one solely for its expression.

### Boundary case

For “We could ask the venue; let's return to that,” the review should preserve an unresolved proposal. It should not infer agreement or assign an owner just to complete a table.

### Revision discovered by testing the check

**Defective review rule:** Every action must have an owner.

**Repair:** Show whether ownership is established. An agreed action with no stated owner should flag the missing assignment. It is not ready for execution until the relevant person resolves it; a drafting tool must not invent the resolution.

**Decision:** Keep the adapted comparison for further practice, permitting faithful variation and explicitly representing uncertainty. Add the review rule to the current brief and instructions. Do not claim learner outcomes, customer value, or general reliability.

## Acceptance criteria

The record is usable when another reader can identify the source relationship, the target decision, one consequential mismatch, and a trial that could have rejected the adaptation. The current decision must be tied to an observed example. A rejected connection may pass the exercise if the evidence explains why it should not be used.

## Common failures and repairs

| Failure | Repair |
| --- | --- |
| Connection is only “both are systems” | Name the specific dependency or operation being compared |
| Impressive source terminology replaces an explanation | Explain the relationship in ordinary words and verify the source meaning |
| Test rejects valid output variation | Change the criterion to the property that matters |
| Rule forces a complete-looking answer | Distinguish required knowledge from a permitted uncertainty flag |
| Successful desk review becomes a learning claim | Limit the result to design evidence; investigate learner performance separately |
| Target consequences exceed your expertise | Narrow the trial or obtain informed review before relying on it |

Close the map and explain the connection without its technical label. Apply it to a changed case, such as an imprecise deadline. Record whether the relationship still helps and where it stops.

