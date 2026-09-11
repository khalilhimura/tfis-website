# Claim-evidence ledger

Use with [Chapter 2: The End of Knowledge Scarcity](../chapters/02-the-end-of-knowledge-scarcity.md). This book-developed artifact connects claims to their support and to the decisions that depend on them.

## No-code path

Copy the record into an ordinary document. Open source links in a browser and record the exact section you inspect. If your assistant cannot browse, supply short excerpts with source details. It can help compare the wording; you still check the original.

## Blank reusable record

**Project / date / owner:**

**Decision this ledger serves:**

### Claim [identifier]

- Exact wording:
- Type: observation / empirical claim / interpretation / hypothesis / proposed action / preference
- Definition or narrower version, if needed:
- Source author or organization:
- Title / date / full reference:
- Source URL or local evidence file:
- Exact location inspected:
- Reading depth: full relevant passage / abstract only / identified but unread / own observation
- What the evidence establishes:
- What it does not establish:
- Status: supported as written / narrower support / contradicted / unresolved
- Decision affected:
- Next check / owner / stopping condition:
- Revision history:

Repeat for each consequential claim. Keep observation records and public-source references distinct. A missing source is a reason to mark uncertainty, not to invent bibliographic details.

### Verification queue

| Claim | Next observable check | Evidence needed | Owner | Decision held provisional |
| --- | --- | --- | --- | --- |
| | | | | |

## Reusable research-assistant prompt

```text
Assess this claim for this decision:
[exact claim]
[decision and intended use]

Find a small set of relevant sources within these boundaries:
[permitted source types or supplied excerpts]

For each source provide:
- Author/organization, title, date, source type, and direct URL
- Exact section or passage location relevant to the claim
- Whether you opened it, read only an abstract, or only identified it
- What it supports and the important limits
- A narrower claim if my wording exceeds the evidence

Look for relevant contrary evidence or alternative explanations.
Keep your proposed application separate from the source's finding.
Do not invent metadata, quotations, page numbers, or access claims.
If evidence is unavailable, mark the claim unresolved and identify
the next useful check. A concise source-linked rationale is enough.
```

## Worked sample: fictional Himura Inc.

The business observations and decisions below are fictional. The cited journal study is real. The example keeps these evidence types separate.

### C01 — Demand for the proposed service

- **Claim:** Independent educators need help turning a topic into a task a learner can perform and would value outside help.
- **Type/status:** Commercial hypothesis; unresolved.
- **Evidence:** None from customers. Audy's fictional preparation difficulties do not demonstrate customer demand.
- **Decision:** Whether to develop Himura Inc.'s proposed service beyond a practice brief.
- **Next check:** Prepare questions about an educator's actual design work and alternatives; later investigate with real people under appropriate consent. Do not report a conversation that has not occurred.

### C02 — Missing detail in a practice input

- **Claim:** The deliberately incomplete synthetic notes in Chapter 1's fourth trial do not specify a learner task.
- **Type/status:** Observation within the fictional practice; check against the exact input.
- **Evidence location:** [Fourth input: missing-task variant](../artifacts/01-workshop-practice-set.md#fourth-input-missing-task-variant). In your own ledger, substitute the actual input file and review.
- **Decision:** Ask a focused question before selecting an activity.
- **Limit:** This establishes a property of one synthetic input, not a pattern among actual educators.

### C03 — A research claim and a separate design inference

- **Original claim:** Adding a quiz makes any short workshop more effective.
- **Status:** Wording exceeds the cited evidence; revise.
- **Source:** Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249–255. https://doi.org/10.1111/j.1467-9280.2006.01693.x
- **Location/read depth:** Publisher abstract and bibliographic panel; abstract-only check.
- **Narrower support:** The experiments compare recall testing with restudy for students learning prose, with different patterns on immediate and delayed retention tests.
- **Separate practical inference:** Consider testing a recall attempt where retained information matters to the intended workshop task.
- **Unestablished:** Any general claim that Audy's workshop improves workplace performance, all quiz formats, or all learner groups.
- **Next check:** Identify what learners need to remember and what they need to demonstrate before choosing the activity.

### C04 — Prompt behavior in a bounded attempt

- **Claim:** The fifth fictional practice output preserves assumptions and an observable proposed learner output.
- **Type/status:** An inspectable result of that illustrated attempt.
- **Evidence location:** [Fifth input and corrected output](../artifacts/01-workshop-practice-set.md#fifth-input-and-corrected-output), an authored teaching specimen. In your own ledger, point to your actual saved input, output, and review.
- **Limit:** Does not establish that all future outputs pass or that delivery can run without review.
- **Decision:** Continue assisted drafting with human checking and varied inputs.

### C05 — A working preference

- **Claim:** Himura Inc. should prioritize inspectable learner outcomes over polished slide counts.
- **Type/status:** Proposed operating preference, owned by Audy.
- **Reason:** It directs attention toward the usefulness she wants to investigate.
- **Limit:** A preference is not a research effect, customer testimonial, or universal rule for every workshop.
- **Next check:** Examine whether the preference makes the next design decision clearer; revise when the task requires it.

## Acceptance criteria

The record is ready when another reader can locate at least one original outside source, repeat the supporting-passage check, distinguish observation from simulation, and identify which decisions remain provisional. Every consequential unsupported claim has a next action or is removed from the draft. An unresolved entry can be an acceptable outcome when its limitation is visible.

## Common failures and repairs

| Failure | Repair |
| --- | --- |
| Link opens but supports only the general topic | Find the relevant passage; narrow or remove the claim |
| Several summaries treated as independent studies | Trace them to original sources and identify overlap |
| Source reported as fully read when only abstract available | Correct reading depth; remove unsupported detail |
| Simulated persona treated as a customer | Relabel simulation and preserve demand as untested |
| Research finding merged with a recommendation | Write two sentences and identify the application as your decision |
| Ledger grows without changing any decision | Keep the decision field; defer interesting but nonessential claims |

Close the ledger and explain one claim, its support, its limitation, and its practical consequence. Compare your explanation with the record. Bring the most important unresolved question to Chapter 3.
