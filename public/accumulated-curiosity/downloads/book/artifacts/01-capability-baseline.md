# Capability baseline

Use with [Chapter 1: The Future Is Solo](../chapters/01-the-future-is-solo.md). This is a book-developed practice record for investigating L0 → L1 capability in one task. It does not certify an SSA-CMM level.

## How to use it without code

Copy the blank record into a text document. Use a clock to note time; paste a saved prompt into an ordinary AI chat; keep each input, output, and review in your practice folder. Use synthetic notes or material you are authorized to share. You need no paid integration, API key, or automated external action.

## Blank reusable record

**Project:**

**Date / owner:**

**Task:** Turn ___ into ___ so that ___ can ___.

**Observed repetition:** ___ instances during ___. If this is practice, label it practice.

**What I have not established:**

### Work audit

| Candidate task | Trigger / input | Useful output | Observed frequency | Who can judge it? | Remove, simplify, assist, or keep manual? Why? |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
| | | | | | |
| | | | | | |

### Manual baseline

- Input file / description:
- Output file:
- Minutes preparing:
- Minutes producing:
- Minutes checking and repairing:
- Interruptions or unusual conditions:
- Total recorded work time:
- Acceptance criteria:
- Defects that require rejection or revision:
- Parts requiring my own judgment:

### Saved prompt

Save as `task-prompt-v1`. Replace the brackets before use.

```text
Help produce [output] for [intended user and use].

Use these inputs: [paste or attach authorized/synthetic material].
Claims about people, events, and results must come from those inputs.
Keep proposals and assumptions visibly separate from supplied facts.

Return these sections: [named sections].
The output must satisfy: [observable acceptance criteria].
When necessary information is missing: [state the gap / ask a question].
Do not: [task-specific prohibited inference or action].

This is a draft for my review. List remaining uncertainties concisely.
```

### Five-attempt correction log

Keep the underlying files. A log entry is a pointer to evidence, not a replacement for the output.

| Run | Input and prompt versions | Purpose of this trial | Output file | Verdict and specific reason | Repair / next check | Total recorded minutes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

**Setup time across trials:**

**What improved, supported by which output?**

**What still fails or has not been tested?**

**Supported capability statement:** I can ___ under ___ conditions, checked by ___.

**Next trial:**

## Worked sample: fictional Fieldwork

All inputs, outputs, and timings below illustrate the record. They are not measured customer results or files supplied by a real business. Create your own practice files when using the template.

**Task:** Turn Maya's synthetic workshop-preparation notes into a short provisional design brief.

**Project output:** `workshop-brief-v1`.

**Observed context:** Repetition in Maya's fictional personal preparation practice; no evidence of demand for a paid service.

**Manual baseline:** 40 illustrative minutes, including thinking, drafting, and review. Maya found defining an inspectable learner outcome harder than arranging the headings.

**Acceptance criteria:** The brief distinguishes supplied facts from assumptions; identifies a proposed learner task or the information needed to define one; proposes an observable learner output; avoids invented interviews, outcomes, and confirmed audiences.

### Worked prompt

```text
Turn my synthetic workshop notes into a provisional design brief.
Use only the supplied notes for claims about the educator and learners.

Return:
- What the notes establish
- Proposed learner task, clearly marked as provisional
- Candidate output a learner could produce or demonstrate
- Assumptions and unresolved choices
- Questions needed before choosing the workshop design

If the learner task is unspecified, say so and ask a focused question.
If several audiences appear, preserve the choice as unresolved.
Distinguish a proposed outcome from an observed learning result.
Do not invent customer interviews, learner preferences, or demand.
Write a draft for Maya's review; take no external actions.
```

| Run | Synthetic input / trial purpose | Observed example defect or success | Verdict | Repair or retained check |
| --- | --- | --- | --- | --- |
| 1 | Ordinary notes, broad initial request | Invents learner confidence and activity preferences | Rewrite | Require input-grounded claims and explicit assumptions |
| 2 | Same notes, revised prompt | Proposed outcome is only “understand the topic” | Rewrite | Request a learner output that can be inspected |
| 3 | New notes with several possible audiences | Chooses an audience as if confirmed | Rewrite | Preserve unresolved audience choices |
| 4 | Notes deliberately omit learner task | Names the gap and asks a focused question | Accept | Retain missing-information behavior |
| 5 | Another ordinary input, current prompt | Preserves assumptions and proposes inspectable output | Accept after small wording edit | Review every future draft; vary inputs further |

**Illustrative final-attempt time:** 3 minutes input preparation + 1 minute waiting + 10 minutes checking + 8 minutes revising/filing = 22 minutes.

**Comparison:** 40 − 22 = an 18-minute difference between the recorded durations. The inputs differ, so this is not yet evidence of time saved. Run a separate comparison using comparable scope and the same quality bar, retaining input difficulty and familiarity/order as limitations. If that comparison eventually supported an 18-minute saving and setup were 90 minutes, five comparable future uses would recover setup. The arithmetic is conditional, not a measured forecast.

**Inspect the example:** The [practice specimens](../artifacts/01-workshop-practice-set.md) supply an authored bad answer and correction, a missing-task input corresponding to row 4, and an input/output pair corresponding to row 5. These are constructed teaching examples, not transcripts of model runs. Create and retain your own files for all five actual attempts.

**Supported statement within the fiction:** Maya can use a saved prompt to draft this kind of provisional brief and inspect it for the defects tested. Untested topics, autonomous delivery, customer value, and general reliability remain outside the claim.

## Acceptance and repair

The record is usable when a reviewer can locate the input and output of each attempt, understand the quality bar, and trace a prompt change to an observed defect. The latest prompt must be saved outside the chat. Five rows alone do not pass this check.

| Common failure | Repair |
| --- | --- |
| “Bad answer” is the entire review | Name the unsupported sentence or missing requirement and the evidence that exposes it |
| Only generation time is recorded | Include input preparation, review, repair, filing, and setup separately |
| Five identical easy inputs | Add a meaningfully different input and a missing-information case |
| Practice results become a claim of customer demand | Relabel practice; create a separate demand hypothesis |
| Reader cannot judge the output | Narrow the task or involve a knowledgeable reviewer before relying on it |

Close the documents and explain the task's purpose, two failure conditions, and one remaining uncertainty. Reopen them to check your explanation. Carry the actual unresolved claims into Chapter 2.
