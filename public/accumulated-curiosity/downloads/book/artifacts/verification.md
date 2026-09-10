# Calculator verification

Checked on September 10, 2026, using Python 3.11.3. The program is a standard-library teaching model intended for Python 3.9 or newer. This is a report of the checks performed, not a claim that every operating system or input has been tested.

## Behavior checks

The supplied `test_economic_scenarios.py` contains 19 standalone test methods. They run the real command-line program with synthetic JSON files and check returned results and errors. Expected numbers are literal independently calculated values; the tests do not import the calculator's arithmetic to generate their expectations.

The tests were written before the calculator. The first run failed because the production program did not yet exist. After implementation, the observed result was:

```text
Ran 19 tests in 1.700s

OK
```

The checks cover:

- the baseline, proposed, and separate pilot-unit calculations;
- requested volume above capacity remaining unclamped and flagged;
- a JSON volume setting and an explicit command-line override;
- zero volume retaining fixed costs and fixed operating hours;
- zero remaining unit capacity;
- exact decimal fractions and products beyond Decimal's default precision;
- JSON numeric decimals avoiding binary-float conversion;
- price and acquisition-hour sensitivity;
- rejection of booleans in numeric fields, negative/nonfinite/nonnumeric numbers, excessive numeric bounds, zero unit hours, excessive fixed hours, and fractional volume;
- duplicate, missing, unknown, or malformed fields, duplicate scenario IDs, invalid JSON, missing files, unknown scenario selectors, and invalid volume overrides;
- readable output distinguishing a unit-only illustration from a period and reporting overcapacity;
- unchanged input-file bytes and unchanged working-directory contents across a calculator run.

Run them from the extracted folder with:

```bash
python3 -B -m unittest -v test_economic_scenarios.py
```

The test runner creates and removes temporary synthetic fixture files. The calculator itself only reads its selected file and prints results or errors. Source inspection found no network or file-save operations in the calculator. The read-only observation is bounded to the tested runs; it is not a security certification of Python or the host computer.

## Independent arithmetic

A separate check used Python's exact `fractions.Fraction` arithmetic, literal assumptions, and literal expected totals. It did not import any calculator code. For each row, it independently evaluated:

```text
revenue = price × volume
cash surplus = revenue − variable cash per unit × volume − 200
owner hours = 40 + unit owner hours × volume
owner allowance = owner hours × 50
remainder = cash surplus − owner allowance
```

All comparisons matched:

| Case | Revenue | Before owner/tax | Owner hours | Owner allowance | After allowance |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline, 17 units | 5,100 | 4,560 | 159 | 7,950 | −3,390 |
| Proposed, 20 units | 15,000 | 14,100 | 160 | 8,000 | 6,100 |
| Baseline, requested 20 units | 6,000 | 5,400 | 180 | 9,000 | −3,600 |
| Baseline with only price changed to 450 | 7,650 | 7,110 | 159 | 7,950 | −840 |
| Baseline with only acquisition changed to 3 hours | 4,500 | 4,000 | 160 | 8,000 | −4,000 |
| Baseline, one unit in a month | 300 | 80 | 47 | 2,350 | −2,270 |

Capacity independently follows from 120 hours remaining after fixed work: `floor(120 / 7) = 17`, `floor(120 / 6) = 20`, and `floor(120 / 8) = 15`. The baseline requested-volume case exceeds the 160-hour availability by twenty hours; its modeled volume remains twenty.

The separate pilot-unit calculation is `300 − 20 − ((4 + 2 + 1) × 50) = −70`. No monthly overhead is allocated to this unit-only result. The two acquisition hours already include the allocated unsuccessful sales effort; that effort is not charged twice.

An additional direct calculator run verified the guide's one-unit monthly result. A fractional override `--volume 1.5` returned exit status 2, no standard output, and:

```text
error: --volume must be a whole nonnegative number of units
```

## Document and visual checks

The companion guide was compared with Chapter 22's formulas, actual command-line options, field names, and output. It states the same-period collection/payment assumption required to interpret the period cash-surplus label. It does not assert that an agreed pilot fee was collected.

The original SVG was rendered locally and visually inspected. Both monthly comparisons separate capacity, cash before the owner allowance, and the remainder after valuing all working hours. Text alternatives describe the values and their limits. A long label that approached the panel boundary was split into two lines before the final inspection.

## Interpretation limits

Correct arithmetic does not establish demand, achieved efficiency, a sustainable workload, a payment, or a financial reporting conclusion. This model assumes constant per-unit costs and effort, separately supplied fixed costs and hours, one currency, whole-unit volume, and the reader's chosen hourly allowance. It does not infer taxes, financing, equipment costs, owner withdrawals, cash timing, market price, or omitted work.
