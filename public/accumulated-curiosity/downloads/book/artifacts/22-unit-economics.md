# Unit economics and capacity

Use with [Chapter 22](../chapters/22-from-product-to-value.md). Define the offer, record all work, and compare a baseline with a proposed change. Paper, a calculator, or an ordinary table is sufficient. The [optional Python calculator](22-economics-calculator.md) automates these arithmetic relationships with synthetic inputs.

## Blank reusable template

```text
Record ID and date:
Decision this model will inform:
Currency:
Unit: what the buyer receives, including revision/support limits:
Evidence record for the offer and its effort:

UNIT INPUTS — record value, observed/assumed status, and source
Price treated as earned revenue:
Actual fee agreement / invoice / cash receipt, separately:
Attributable variable cash cost per unit:
Delivery hours, including review and repair:
Acquisition hours allocated per successful unit, including unsuccessful work:
Support hours per unit:
Assumed owner hourly value:

UNIT CALCULATIONS
Cash contribution before owner time/fixed costs = price − variable cash
Owner hours = delivery + acquisition + support
Owner-time allowance = owner hours × hourly value
Contribution after allowance = cash contribution − owner-time allowance

PERIOD INPUTS — record value, status, and source
Period:
Available owner hours:
Fixed operating hours (not counted again in unit effort):
Fixed cash costs (not counted again in variable costs):
Modeled units sold and completed:
Receipt/payment timing assumption:
Other costs excluded from this simplified model:

PERIOD CALCULATIONS
Unit-related hours available = available hours − fixed operating hours
Capacity = whole units fitting in unit-related hours available
Revenue = modeled volume × price
Variable cash = modeled volume × variable cash per unit
Cash surplus before owner and tax = revenue − variable cash − fixed cash
Total owner hours = fixed operating hours + modeled volume × unit owner hours
Owner-time allowance = total owner hours × hourly value
Remainder after allowance = cash surplus − owner-time allowance
Does total required work exceed available hours?

CHANGED CASE
Which assumption changes, why, and with what evidence?
Result and difference from baseline:
Which untested assumption matters most to the decision?
Next evidence to obtain, effort limit, and decision trigger:
Next action: continue / revise / stop, with reason:
```

An owner-time allowance is a selected comparison value, not cash wages paid. The remainder is not a calculation of taxable profit or personal take-home income. Cash-surplus interpretations require the stated collection/payment assumption. Keep actual cash dates in a separate list if they differ.

## Fictional worked example: Fieldwork

**Record:** `unit-economics-v1`.

**Case source:** [PP21-01 and its effort record](21-product-experiment.md). Three constructed discovery conversations led to two proposals and one agreed USD 300 pilot; the second proposal was deferred. The revised pack was accepted for rehearsal. No payment receipt is supplied.

**Unit:** One agreed workshop-brief review, one activity redesign, and a reviewable pack with one bounded revision. This is the whole pilot package, not Chapter 20's internal forty-five-minute production slot.

### Pilot unit, without monthly overhead

| Input or result | Value | Status or interpretation |
| --- | ---: | --- |
| Agreed fee | USD 300 | Fictional agreement; collection unobserved |
| Revenue used for arithmetic | USD 300 | Assumed earned for this model |
| Attributable variable cash cost | USD 20 | Authored illustrative cost |
| Delivery, including repair | 4 hours | Constructed pilot effort |
| Acquisition across all three conversations and both proposals | 2 hours | Allocated to the one agreed pilot |
| Support | 1 hour | Constructed pilot effort |
| Total owner work | 7 hours | 4 + 2 + 1 |
| Assumed hourly value | USD 50 | Comparison assumption; not a paid wage |
| Cash contribution before owner/fixed costs | USD 280 | 300 − 20 |
| Owner-time allowance | USD 350 | 7 × 50 |
| Contribution after allowance | **−USD 70** | 300 − 20 − 350; fixed costs excluded |

**Rejected interpretation:** “We made USD 280 profit from a USD 300 sale.”

**Repair:** “The fictional pilot leaves USD 280 before owner time and fixed costs if the fee is treated as earned revenue. After a USD 350 allowance for seven owner hours, the unit contribution is negative USD 70. Cash collection is unobserved.”

### Monthly baseline and proposed change

Both original planning scenarios assume 160 available owner hours, forty fixed operating hours, USD 200 fixed cash, and USD 50 per owner hour. They assume all modeled revenue is collected and all listed cash costs are paid in the same period. Actual cash timing, taxes, financing, equipment purchases, owner withdrawals, and omitted costs are outside the model. Fixed operating hours exclude the acquisition/delivery/support already counted per unit.

| Input/result | Baseline | Proposed |
| --- | ---: | ---: |
| Price, USD | 300 | 750 |
| Variable cash per unit, USD | 20 | 35 |
| Delivery hours | 4 | 3 |
| Acquisition hours | 2 | 2 |
| Support hours | 1 | 1 |
| Unit owner hours | 7 | 6 |
| Unit contribution after allowance, USD | −70 | 415 |
| Whole-unit capacity | 17 | 20 |
| Modeled units sold/completed | 17 | 20 |
| Revenue, USD | 5,100 | 15,000 |
| Variable cash total, USD | 340 | 700 |
| Fixed cash, USD | 200 | 200 |
| Cash surplus before owner and tax, USD | 4,560 | 14,100 |
| Total working hours | 159 | 160 |
| Owner-time allowance, USD | 7,950 | 8,000 |
| Remainder after allowance, USD | **−3,390** | **6,100** |

**Evidence status:** The baseline extends one authored pilot into a month; the proposed case changes price, cost, and delivery effort. Neither establishes demand, achieved efficiency, a sustainable schedule, actual collection, or real profit. Twenty slots are capacity under assumptions, not twenty buyers.

### Changed cases to inspect

| Change from proposed inputs | Whole-unit capacity | Modeled volume | Owner hours | Remainder after allowance, USD |
| --- | ---: | ---: | ---: | ---: |
| Only ten units sold/completed | 20 | 10 | 100 | 1,950 |
| Acquisition takes five hours per unit | 13 | 13 | 157 | 1,245 |

Unused available hours receive no allowance in this simplified model. If the owner needs compensation for reserving all available hours, add that separate requirement to the decision record; do not infer it from the remainder.

**Baseline capacity challenge:** Request twenty units with the original seven-hour unit. Required hours are `40 + 20 × 7 = 180`, exceeding 160 by twenty. Arithmetic at the requested volume gives USD 6,000 revenue, USD 400 variable cash, USD 5,400 cash surplus before owner/tax, USD 9,000 owner-time allowance, and **−USD 3,600** remainder. Retain those results and flag the infeasible schedule; do not silently replace twenty with seventeen.

### Decision and next evidence

Do not repeat the baseline at scale on these assumptions. Investigate whether a revised scope/price addresses a buyer's actual need and whether a specific delivery change preserves the accepted criteria in less time. Keep the price conversation, delivery timing, acquisition record, and cash collection as separate evidence. A further pilot must have a stated learning question and effort limit.

## Prompt: challenge the reasoning

```text
Review the supplied unit and period model. Do not invent demand, prices,
customer outcomes, industry benchmarks, or missing observations.

Check whether:
- the same unit is used throughout;
- acquisition includes work that did not become a sale;
- delivery includes review/repair and support is counted;
- fixed and unit-related work/cost are not double-counted;
- assumed earned revenue, agreed fees, and actual cash are distinct;
- owner-time allowance is distinguished from paid wages;
- capacity is distinguished from modeled sales;
- the required hours fit the available period;
- each decision states the assumptions on which it depends.

For every criticism, identify the exact field and its consequence.
Show any proposed arithmetic correction so I can verify it by hand.
End with the most consequential missing evidence and a bounded next test.
Do not contact buyers, change accounts, or treat the model as new evidence.
```

## Acceptance criteria

- The unit matches the scoped offer and includes its support/revision obligations.
- Every input is labeled as observed or assumed; the fictional sample is not used as market evidence.
- All three effort categories and relevant fixed work are counted once.
- Unit and period results reproduce the displayed arithmetic.
- Owner-time allowance, actual compensation, cash collection, and profit are not conflated.
- Changed cases state which inputs changed and why the result moved.
- Over-capacity volume is visible; unused availability is interpreted correctly.
- The final action follows from a stated constraint and names the missing evidence.

## Common failure and repair

**Failure:** A reader replaces the actual four delivery hours with a hoped-for one hour, calls the result measured savings, and multiplies it by every possible slot.

**Repair:** Restore the original effort record. Put the proposed one-hour case in a separate column, name the process change it depends on, and test that change against the same delivery criteria. Model a separate sales volume. Until evidence exists, label the faster work and full demand as assumptions.

**Failure:** A calculator gives the expected number, so the reader accepts the business plan.

**Repair:** Verify one result by hand, then challenge the inputs. Correct arithmetic supports only the stated calculation. It cannot establish demand, timeliness of payment, or the usefulness of the offer.
