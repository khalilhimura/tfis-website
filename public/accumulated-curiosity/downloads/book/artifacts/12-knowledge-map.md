# Knowledge map

Use with [Chapter 12](../chapters/12-the-personal-knowledge-graph.md). The map is an index of meaningful relationships between records. It does not replace the source records or grant them new authority. An ordinary document or two spreadsheet tables are sufficient; no coding or graph application is required.

## Blank reusable template

**Task and working-set boundary:**

**Question this map should help answer:**

**Current way of answering it, including missing connections:**

### Items

| ID | Readable name | Kind | Status or exact version | Location |
| --- | --- | --- | --- | --- |
| | | | | |

Use stable IDs within this set. Identify historical versions separately from the pointer that tells the next attempt which version is current.

### Relationships

| From ID | Relationship verb | To ID | Meaning, source location, and scope |
| --- | --- | --- | --- |
| | | | |

**Route tried:** Starting question → items followed → source passages inspected.

**Answer supported by this route:**

**What remains unresolved:**

**Incorrect or missing relationship found:**

**Repair and its evidence:**

**Repeat walk after repair:**

**Event that should trigger the next map review:**

## Worked sample: fictional Fieldwork

These records index the book's constructed teaching specimens. They do not report actual model runs or customer outcomes.

**Question:** If Maya proposes handling for an explicitly authorized deadline amendment, which existing materials must she inspect before approving it?

### Items in this working set

| ID | Item | Kind and status | Inspectable location |
| --- | --- | --- | --- |
| P | `workshop-brief-v1` | Proposed design; learner task remains provisional | [Starting bounded proposal](01-workshop-practice-set.md#fifth-input-and-corrected-output); [later working change](07-two-pass-practice-packet.md#review-and-migration-diagnosis) |
| E | `learning-loop-v1` current entry | Pointer to current instruction, review, and history | [Updated current-version pointer](11-distillation-record.md#current-pointer-excerpt) |
| I1 | Intermediate instruction v1 | Historical, incomplete migration | [v1](07-two-pass-practice-packet.md#intermediate-instruction-v1) |
| I2 | Instruction v2 | Historical version used in run-02 | [v2](07-two-pass-practice-packet.md#current-instruction-v2) |
| I3 | Instruction v3 | Current, after Chapter 11 adds conflict handling | [Approved v3 instruction](11-distillation-record.md#current-instruction-instructions-v3) |
| D | `distillation-record-v1` / D11-01 | Reviewed conflict-handling decision | [Decision and rationale](11-distillation-record.md#fictional-worked-sample-conflicting-workshop-notes) |
| T3 | Thursday/Friday conflict specimen | Constructed source claims with no supported supersession | [Literal conflict packet](11-distillation-record.md#fictional-worked-sample-conflicting-workshop-notes) |
| R | Review sheet | Core criteria retained through later revisions | [Review sheet](07-two-pass-practice-packet.md#review-sheet) |
| N | `action-list-rule-rationale-v1` | Linked explanation; not another current instruction | [Literal worked rationale and later updates](08-memory-inventory.md#worked-rationale-with-later-updates) |
| T1 | run-01 | Constructed failed example | [Input and flawed output](07-two-pass-practice-packet.md#run-01-input-and-flawed-output) |
| T2 | run-02 | Constructed changed-input example | [Input and reviewed output](07-two-pass-practice-packet.md#run-02-changed-input-and-reviewed-output) |
| V1 | Migration diagnosis | Fictional review tied to visible instruction conflict | [Diagnosis and repair](07-two-pass-practice-packet.md#review-and-migration-diagnosis) |
| C | `claim-evidence-ledger-v1` | Separates observations, hypotheses, and decisions | [Claims ledger](02-claim-evidence-ledger.md) |
| G | `connection-map-v1` | Includes rejected universal-owner requirement | [Connection map](06-connection-map.md) |
| Q | Explicit-amendment extension | Proposed; untested | [Open extension below](#open-extension) |

### Relationships in the worked map

| From | Relationship | To | Meaning and scope |
| --- | --- | --- | --- |
| P | starts through | E | New design work follows the current entry. |
| E | points to current | I3 | Current use resolves to v3; history remains separate. |
| I3 | implements | D | Includes the approved unresolved-conflict behavior. |
| I3 | supersedes | I2 | Adds conflict handling while retaining the earlier owner/date boundaries. |
| D | draws on | T3 | The shared action/owner remain supported; the applicable date remains unresolved. |
| I3 | is checked against | R | Review meaning and supported details. |
| I2 | supersedes | I1 | The old deadline suggestion was removed. |
| N | explains | I3 | Rationale links the existing rule to its history. |
| N | draws on | G | The rejected completeness rule helps explain missing-owner treatment. |
| T1 | used | I1 | Historical supplied version; never silently change this to “latest.” |
| V1 | reviews | T1 | Wednesday is unsupported by line 2. |
| V1 | motivates correction in | I2 | Repair removes the visible instruction conflict. |
| T2 | used | I2 | The later constructed example preserves “soon.” |
| T2 | illustrates a check of | R | It makes timing fidelity inspectable; it supplies no reliability rate. |
| P | retains claim boundaries from | C | Design specimens do not become evidence of market demand. |
| Q | proposes extending | I3 | The proposal is not an approved instruction. |
| Q | requires review of | R | Any extension must preserve existing acceptance criteria. |
| Q | must preserve cases | T1 | No invented date when the source supplies none. |
| Q | must preserve cases | T2 | No invented precision when the source says “soon.” |

### Open extension

**Proposed new input:** A synthetic record would explicitly identify an authorized coordinator changing the worksheet deadline from Friday to Monday. Maya has not yet prepared and reviewed that complete case.

**Existing counterexample to preserve:** Two source statements giving different dates without establishing an authorized change, as in Chapter 11, must remain an unresolved conflict.

**Present decision:** Keep Chapter 11’s approved unresolved-conflict rule. Investigate what evidence would distinguish an authorized amendment and how its history should remain visible. Do not record that extension as tested merely because it appears in the map.

**Review needed:** Inspect I3, D, and R, compare T1, T2, and T3, retain their distinctions, then prepare and review a separate case for the new condition.

### A walk that answers the question

Start at P → E → I3, then follow its links to D and R. Follow the case relationships to T1, T2, and T3. Open the actual notes and outputs. The answer is: inspect the current instruction and review sheet, the migration diagnosis, the rationale, and the existing no-date, vague-date, and unresolved-conflict cases before approving a separate amendment-handling extension.

The route identifies relevant dependencies. It does not settle what missing context would establish approval of the date change.

### Deliberate failure and repair

**Broken relationship:** `T1 used I2`.

Every file can still open, but the packet explicitly identifies I1 as the supplied instruction for run-01. The incorrect edge would attribute the flawed example to the wrong version.

**Repair:** Change that historical edge to `T1 used I1`. Keep `E points to current I3`. Repeat the historical walk and the current-use walk; they must reach different versions. Explain the distinction in your own words.

## Prompt for proposing relationships

```text
Help map only the authorized records supplied below.
Working question: [one question about evidence or dependencies]
Record list: [IDs, titles, status/version, and relevant text or links]

Propose a small table: from ID, relationship verb, to ID,
exact supporting passage, and uncertainty or scope limit.

Distinguish current pointers from historical versions.
Preserve proposed, rejected, disputed, and accepted statuses.
Do not infer approval, causation, market evidence, or permission
from two records merely mentioning similar words.
If the necessary record is missing, identify the gap.
Do not modify the records or treat your proposals as accepted edges.

I will inspect consequential relationships before adopting them.
```

## Acceptance criteria

- Every item resolves to an inspectable record or is explicitly marked missing.
- Each consequential relationship can be explained as a sentence supported by the underlying records.
- Current instructions and historical versions remain distinguishable.
- A question can be answered through the links without adding an unstated personal memory.
- The deliberate wrong-version relationship can be diagnosed and repaired from the supplied packet.
- A proposal, a synthetic specimen, and a reviewed decision retain their distinct statuses.
- The map can be copied as ordinary text or tables without losing its relationship verbs and source locations.

## Common failures and repairs

**Everything is “related to” everything:** Replace vague edges with the operation they support. Remove a connection if it does not help answer a working question.

**An old test points to the latest instruction:** Restore its actual historical version. If the supplied version is unknown, say so and design a fresh comparison instead of guessing.

**A generated relationship invents support:** Open the cited passage. Reject or narrow the edge; do not let a polished summary alter the evidence's status.

**Maintaining the map costs more than its use saves:** Reduce the number of items, use document-level links, and retain an ordinary index where it is sufficient.
