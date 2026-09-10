# Optional Economics Calculator

This optional companion to Chapter 22 of *Accumulated Curiosity* applies the book's planning formulas to explicit assumptions. You can complete the same exercise on paper. The calculator does not establish earned revenue, an invoice, a cash receipt, tax or bookkeeping treatment, customer demand, or achieved efficiency.

Download the [complete ZIP](22-economics-calculator.zip), or inspect the [Python source](economic_scenarios.py), [synthetic scenarios](scenarios.json), [standalone tests](test_economic_scenarios.py), and [verification notes](verification.md).

## Start without code

Choose one currency and one period. Use consistent units throughout. Distinguish a unit of completed work from the whole period.

Write these inputs on paper:

| Per-unit input | Your assumption |
| --- | --- |
| Price treated as modeled earned revenue | |
| Attributable variable cash cost | |
| Delivery hours, including repair | |
| Acquisition hours allocated to a completed unit | |
| Support hours allocated to a completed unit | |
| Assumed value per owner hour | |

| Period input, when modeling a month or another period | Your assumption |
| --- | --- |
| Available owner hours | |
| Fixed operating hours | |
| Fixed cash cost | |
| Modeled whole-unit volume, or use calculated capacity | |

Then calculate:

```text
Unit cash contribution = price − attributable variable cash
Unit owner hours = delivery hours + acquisition hours + support hours
Unit owner allowance = unit owner hours × assumed hourly rate
Unit contribution after allowance = unit cash contribution − unit owner allowance

Capacity = floor((available hours − fixed operating hours) / unit owner hours)
```

“Floor” means round down to a whole unit: 120 ÷ 7 permits 17 whole units under the assumptions, not 18. This is a capacity calculation, not a demand forecast.

For a modeled period volume `n`:

```text
Revenue = price × n
Variable cash = attributable variable cash × n
Cash surplus before owner and tax = revenue − variable cash − fixed cash
Total owner hours = fixed operating hours + (unit owner hours × n)
Owner allowance = total owner hours × assumed hourly rate
Remainder after allowance = cash surplus before owner and tax − owner allowance
Exceeds capacity = n > calculated capacity
```

An equivalent cross-check is:

```text
Remainder after allowance
  = (n × unit contribution after allowance)
    − fixed cash
    − (fixed operating hours × assumed hourly rate)
```

The allowance values owner time for this planning exercise. It is not automatically a cash payment, salary, or accounting expense. The calculated cash-surplus label does not prove that revenue was collected.

## Keep the pilot unit separate from a monthly operation

The fictional pilot's unit assumptions are USD 300 price, USD 20 attributable cash, four delivery hours, two acquisition hours, one support hour, and an assumed USD 50 per owner hour.

The two acquisition hours already allocate work across the three discovery conversations and two proposals, including unsuccessful sales effort. Do not add that same effort again as another unit expense or inside fixed operating hours. Fixed operating hours should represent other work not already included in the unit's delivery, acquisition, or support hours.

The paper calculation is:

```text
Cash contribution: 300 − 20 = 280
Owner hours: 4 + 2 + 1 = 7
Owner allowance: 7 × 50 = 350
Contribution after allowance: 280 − 350 = −70
```

This calculation treats the price as modeled earned revenue. It does not turn the fictional agreement in Chapter 21 into evidence of payment or recognized income. The `pilot_unit` scenario intentionally has no period model, so no monthly fixed overhead is silently allocated to this one-unit illustration.

A separate one-unit monthly scenario would include the chosen month's fixed overhead. It answers a different question. To see that distinction, the baseline monthly model with `--volume 1` yields 80 before the owner allowance, 47 total owner hours, and −2,270 after the allowance. It does not replace the pilot's −70 unit result.

## Read the two monthly scenarios

All figures here are synthetic assumptions. The proposed price and reduced delivery time are unvalidated changes, not observed improvements.

As in Chapter 22, interpreting the period result as a cash surplus assumes all modeled revenue is collected and the listed cash costs are paid in the same period. The calculator has no separate receipt dates or payment dates; it cannot verify that assumption. Taxes, financing, equipment purchases, owner withdrawals, and omitted costs remain outside this model.

| Result | Baseline | Proposed |
| --- | ---: | ---: |
| Price | 300 | 750 |
| Variable cash per unit | 20 | 35 |
| Delivery / acquisition / support hours | 4 / 2 / 1 | 3 / 2 / 1 |
| Unit owner hours | 7 | 6 |
| Unit contribution after USD 50/hour allowance | −70 | 415 |
| Available / fixed operating hours | 160 / 40 | 160 / 40 |
| Whole-unit capacity | 17 | 20 |
| Revenue at modeled capacity | 5,100 | 15,000 |
| Variable cash | 340 | 700 |
| Fixed cash | 200 | 200 |
| Cash surplus before owner and tax | 4,560 | 14,100 |
| Total owner hours, including fixed work | 159 | 160 |
| Owner allowance | 7,950 | 8,000 |
| Remainder after allowance | −3,390 | 6,100 |

![Two hypothetical monthly scenarios share 160 available hours, 40 fixed operating hours, and an assumed USD 50 per owner hour. Baseline seven-hour units permit 17 units, producing 4,560 before the owner allowance and minus 3,390 afterward. Proposed six-hour units permit 20 units, producing 14,100 before the allowance and 6,100 afterward. These are planning assumptions, not demand or receipts.](22-value-and-capacity.svg)

*The capacity calculation constrains modeled work. The owner allowance changes the interpretation of the remainder; it does not describe a verified cash payment.*

## Run the optional script

Prerequisites: Python 3.9 or newer and an ordinary terminal. No packages, API keys, account connections, or network access are required. Extract the ZIP, open a terminal in its folder, and run:

```bash
python3 -B economic_scenarios.py scenarios.json --scenario baseline
```

The `-B` option tells Python not to create bytecode cache files. The calculator itself reads the selected input file and prints to standard output or standard error; it has no save or network operation.

Actual baseline output:

```text
Planning model only: these values establish no cash receipt, tax or bookkeeping treatment, customer demand, or achieved efficiency.

Scenario: baseline — Unvalidated monthly baseline at the assumed earned price
Currency: USD
Unit cash contribution: 280
Unit owner hours: 7
Unit owner allowance: 350
Unit contribution after allowance: -70
Period: month
Capacity (whole units): 17
Modeled volume: 17 (capacity)
Exceeds capacity: no
Period revenue: 5100
Period variable cash: 340
Period fixed cash: 200
Cash surplus before owner and tax: 4560
Total owner hours: 159
Period owner allowance: 7950
Remainder after allowance: -3390
```

Other useful runs:

```bash
python3 -B economic_scenarios.py scenarios.json --scenario pilot_unit
python3 -B economic_scenarios.py scenarios.json --scenario proposed
python3 -B economic_scenarios.py scenarios.json --scenario baseline --volume 20
python3 -B economic_scenarios.py scenarios.json --scenario baseline --json
python3 -B economic_scenarios.py scenarios.json
```

The last command prints all three supplied scenarios. Repeat `--scenario` to select several. A volume override requires exactly one selected scenario with a period model.

## Observe an overcapacity request without hiding it

For the baseline with `--volume 20`, the calculator keeps the requested volume at 20. It does not silently reduce it to 17. The result includes:

| Field | Actual result |
| --- | ---: |
| `capacity_units` | 17 |
| `modeled_volume` | 20 |
| `exceeds_capacity` | true |
| `revenue` | 6000 |
| `variable_cash` | 400 |
| `cash_surplus_before_owner_and_tax` | 5400 |
| `total_owner_hours` | 180 |
| `owner_allowance` | 9000 |
| `remainder_after_allowance` | −3600 |

The 180 modeled owner hours exceed the 160 available. The arithmetic remains visible so that you can decide which assumption needs reconsideration. The flag does not authorize overtime, prove available demand, or resolve the conflict for you.

## Edit a scenario deliberately

Keep the supplied examples intact and create your own scenario file manually. Each input document contains a three-uppercase-letter `currency` label and a `scenarios` list. The label does not convert currencies or validate an exchange rate.

Each scenario requires:

```text
id
label
price
attributable_variable_cash
delivery_hours
acquisition_hours
support_hours
owner_hourly_rate
```

A period model is optional. When included, it requires:

```text
period.label
period.available_hours
period.fixed_operating_hours
period.fixed_cash
```

Optional `period.modeled_volume` selects a whole-unit volume. Omit it to use capacity. `--volume` overrides that field for the one selected period scenario. Omitting `period` creates a unit-only illustration; the JSON result then contains `period: null`.

Use decimal strings such as `"20.25"` for easy inspection. Ordinary JSON number tokens are also read directly into `Decimal`, without first becoming binary floating-point values. Money and hour values in JSON output are exact decimal strings. Unit counts are integers and the capacity flag is a Boolean. No values are rounded to two decimal places by this model.

All numeric inputs must be finite and nonnegative. The total unit owner hours must be positive. Fixed operating hours may equal, but may not exceed, available hours. Volumes must be whole numbers. Booleans are rejected wherever a number is required, even though some programming languages treat `true` as one.

This is deliberately bounded teaching software: at most 100 scenarios, a regular UTF-8 input file of at most 1 MiB, up to 100 coefficient digits per number, and a stored decimal exponent between −100 and 100. Unknown or duplicate fields, duplicate scenario IDs, missing required fields, non-finite values, and malformed input produce explicit errors. There is no silent fallback to zero.

## Inspect an error and repair its input

For example:

```bash
python3 -B economic_scenarios.py scenarios.json --scenario baseline --volume 1.5
```

Actual error:

```text
error: --volume must be a whole nonnegative number of units
```

The program exits with status 2 and prints no result for invalid model input. Correct the specific field and rerun. A valid overcapacity request is different: it exits successfully and reports `exceeds_capacity: true` because its arithmetic is defined, even though its requested work exceeds the modeled capacity.

## Check one assumption at a time

The tests include two independently hand-derived sensitivities:

- Raising only the baseline price to 450 leaves capacity at 17. Unit contribution after allowance becomes 80; period remainder is still −840 after fixed cash and all owner hours.
- Increasing only baseline acquisition time from two to three hours makes each unit eight hours. Capacity falls to 15; unit contribution after allowance becomes −120; period remainder becomes −4,000.

These are arithmetic consequences, not recommendations or validated scenarios. If an acquisition-time figure already includes unsuccessful sales effort, count that effort once. If work exists even when no units are completed, place the relevant unallocated work in the fixed category rather than letting it disappear from the model.

## Verify the companion

Run the standalone tests:

```bash
python3 -B test_economic_scenarios.py
```

They exercise the actual CLI with literal expected values, including the supplied monthly scenarios, unit-only pilot, zero volume, overcapacity, exact decimal handling, high-precision products, malformed input, booleans, and sensitivity cases. Tests create and remove temporary fixture files; they verify that the calculator leaves the tested input and working folder unchanged.

The [verification notes](verification.md) record the independent arithmetic checks and observed test result. Passing these checks establishes the tested calculations and input behavior. It does not validate the business assumptions or establish tax treatment, accounting recognition, demand, payment, or future delivery performance.

## Acceptance and repair

The exercise is useful when you can explain the formulas without running the script, distinguish the unit from the period, identify which inputs are assumptions, and reproduce at least one result by hand.

If the result differs from your worksheet, first check whether you included fixed owner hours, used the same modeled volume, or counted acquisition/support effort twice. If input validation fails, repair the named field. If a valid scenario exceeds capacity, change or investigate the assumption deliberately; do not remove the flag merely to make the plan look feasible.
