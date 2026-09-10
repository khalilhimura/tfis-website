#!/usr/bin/env python3
"""Read a bounded JSON planning model and print exact-decimal scenario results.

Python 3.9+; standard library only. This program reads one regular UTF-8 file
and writes only to stdout/stderr. It does not save files or use a network.
Money and hours in JSON results are decimal strings, never binary floats.
"""
import argparse
from decimal import Decimal, DecimalException, Inexact, localcontext
import json
from pathlib import Path
import re
import sys

MAX_INPUT_BYTES = 1024 * 1024
MAX_SCENARIOS = 100
MODEL_NOTE = (
    "Planning model only: these values establish no cash receipt, tax or "
    "bookkeeping treatment, customer demand, or achieved efficiency."
)
DECIMAL_PATTERN = re.compile(r"[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?\Z")
SCENARIO_KEYS = {
    "id", "label", "price", "attributable_variable_cash", "delivery_hours",
    "acquisition_hours", "support_hours", "owner_hourly_rate", "period",
}
UNIT_NUMBERS = (
    "price", "attributable_variable_cash", "delivery_hours",
    "acquisition_hours", "support_hours", "owner_hourly_rate",
)
PERIOD_NUMBERS = ("available_hours", "fixed_operating_hours", "fixed_cash")


class ModelError(ValueError):
    """An input or request cannot be interpreted by this teaching model."""


def checked_object(value, required, allowed, where):
    if not isinstance(value, dict):
        raise ModelError(f"{where} must be an object")
    missing = sorted(required - value.keys())
    unknown = sorted(value.keys() - allowed)
    if missing:
        raise ModelError(f"{where} is missing required field(s): {', '.join(missing)}")
    if unknown:
        raise ModelError(f"{where} has unknown field(s): {', '.join(repr(key) for key in unknown)}")
    return value


def checked_text(value, where):
    if not isinstance(value, str) or not value.strip():
        raise ModelError(f"{where} must be nonempty text")
    if len(value) > 200 or any(ord(char) < 32 for char in value):
        raise ModelError(f"{where} must be at most 200 characters without control characters")
    return value.strip()


def checked_number(value, where, whole=False):
    # bool is a subclass of int in Python, so reject it before numeric handling.
    if isinstance(value, bool) or not isinstance(value, (str, int, Decimal)):
        raise ModelError(f"{where} must be a finite nonnegative decimal number, not a boolean or container")
    if isinstance(value, str):
        value = value.strip()
        if len(value) > 256 or not DECIMAL_PATTERN.fullmatch(value):
            raise ModelError(f"{where} must be a finite decimal number")
    try:
        number = Decimal(value)
    except (DecimalException, ValueError):
        raise ModelError(f"{where} must be a finite decimal number") from None
    if not number.is_finite():
        raise ModelError(f"{where} must be finite")
    if number < 0:
        raise ModelError(f"{where} must not be negative")
    digits = number.as_tuple()
    if len(digits.digits) > 100 or abs(digits.exponent) > 100:
        raise ModelError(f"{where} exceeds the teaching model's 100-digit / exponent-100 bounds")
    if whole:
        if number != number.to_integral_value():
            raise ModelError(f"{where} must be a whole nonnegative number of units")
        return int(number)
    return number


def unique_object(pairs):
    obj = {}
    for key, value in pairs:
        if key in obj:
            raise ModelError(f"duplicate JSON field: {key!r}")
        obj[key] = value
    return obj


def reject_nonfinite(token):
    raise ModelError(f"non-finite JSON number {token!r} is not allowed")


def read_document(path):
    try:
        if not path.is_file():
            raise ModelError(f"input must be an existing regular file: {path}")
        with path.open("rb") as stream:
            raw = stream.read(MAX_INPUT_BYTES + 1)
    except OSError as error:
        raise ModelError(f"cannot read input file: {error}") from None
    if len(raw) > MAX_INPUT_BYTES:
        raise ModelError("input exceeds the 1 MiB teaching-model limit")
    try:
        document = json.loads(
            raw.decode("utf-8"), parse_float=Decimal, parse_int=Decimal,
            parse_constant=reject_nonfinite, object_pairs_hook=unique_object,
        )
    except UnicodeDecodeError:
        raise ModelError("input must be UTF-8 text") from None
    except (json.JSONDecodeError, RecursionError) as error:
        raise ModelError(f"invalid JSON: {error}") from None
    checked_object(document, {"currency", "scenarios"}, {"currency", "scenarios"}, "document")
    currency = document["currency"]
    if not isinstance(currency, str) or not re.fullmatch(r"[A-Z]{3}", currency):
        raise ModelError("currency must be a three-uppercase-letter label such as USD; no conversion is performed")
    scenarios = document["scenarios"]
    if not isinstance(scenarios, list) or not 1 <= len(scenarios) <= MAX_SCENARIOS:
        raise ModelError("scenarios must be a list containing 1 to 100 scenarios")
    cleaned = []
    identifiers = set()
    for index, raw_scenario in enumerate(scenarios):
        where = f"scenarios[{index}]"
        obj = checked_object(raw_scenario, SCENARIO_KEYS - {"period"}, SCENARIO_KEYS, where)
        identifier = checked_text(obj["id"], f"{where}.id")
        if not re.fullmatch(r"[a-z][a-z0-9_-]{0,63}", identifier):
            raise ModelError(f"{where}.id must start with a lowercase letter and contain only lowercase letters, digits, '_' or '-' (64 characters maximum)")
        if identifier in identifiers:
            raise ModelError(f"duplicate scenario id: {identifier!r}")
        identifiers.add(identifier)
        scenario = {"id": identifier, "label": checked_text(obj["label"], f"{where}.label")}
        for key in UNIT_NUMBERS:
            scenario[key] = checked_number(obj[key], f"{where}.{key}")
        if all(scenario[key] == 0 for key in ("delivery_hours", "acquisition_hours", "support_hours")):
            raise ModelError(f"{where}: total unit owner hours must be greater than zero")
        scenario["period"] = None
        if "period" in obj:
            required = {"label", *PERIOD_NUMBERS}
            period = checked_object(obj["period"], required, required | {"modeled_volume"}, f"{where}.period")
            cleaned_period = {"label": checked_text(period["label"], f"{where}.period.label")}
            for key in PERIOD_NUMBERS:
                cleaned_period[key] = checked_number(period[key], f"{where}.period.{key}")
            if cleaned_period["fixed_operating_hours"] > cleaned_period["available_hours"]:
                raise ModelError(f"{where}.period.fixed_operating_hours must not exceed available_hours")
            if "modeled_volume" in period:
                cleaned_period["modeled_volume"] = checked_number(
                    period["modeled_volume"], f"{where}.period.modeled_volume", whole=True,
                )
            scenario["period"] = cleaned_period
        cleaned.append(scenario)
    return currency, cleaned


def decimal_string(value):
    if value == 0:
        return "0"
    fixed = format(value, "f")
    return fixed.rstrip("0").rstrip(".") if "." in fixed else fixed


def calculate(scenario, volume_override=None):
    numeric = [scenario[key] for key in UNIT_NUMBERS]
    period = scenario["period"]
    if period is not None:
        numeric.extend(period[key] for key in PERIOD_NUMBERS)
        if "modeled_volume" in period:
            numeric.append(Decimal(period["modeled_volume"]))
    if volume_override is not None:
        numeric.append(Decimal(volume_override))
    integer_digits = max(1, *(number.adjusted() + 1 for number in numeric))
    fractional_digits = max(0, *(-number.as_tuple().exponent for number in numeric))
    # The model's longest expression multiplies at most three input factors.
    # This bound also covers sum carry and an integer quotient. Trap any loss
    # rather than silently rounding a planning value to the default precision.
    with localcontext() as context:
        context.prec = 4 * (integer_digits + fractional_digits) + 16
        context.traps[Inexact] = True
        hours = scenario["delivery_hours"] + scenario["acquisition_hours"] + scenario["support_hours"]
        cash = scenario["price"] - scenario["attributable_variable_cash"]
        allowance = hours * scenario["owner_hourly_rate"]
        result = {
            "id": scenario["id"], "label": scenario["label"],
            "unit": {
                "cash_contribution": decimal_string(cash),
                "owner_hours": decimal_string(hours),
                "owner_allowance": decimal_string(allowance),
                "contribution_after_allowance": decimal_string(cash - allowance),
            },
            "period": None,
        }
        if period is not None:
            remaining_hours = period["available_hours"] - period["fixed_operating_hours"]
            capacity = int(remaining_hours // hours)
            requested = volume_override if volume_override is not None else period.get("modeled_volume")
            volume = capacity if requested is None else requested
            revenue = scenario["price"] * volume
            variable_cash = scenario["attributable_variable_cash"] * volume
            cash_surplus = revenue - variable_cash - period["fixed_cash"]
            total_hours = period["fixed_operating_hours"] + hours * volume
            total_allowance = total_hours * scenario["owner_hourly_rate"]
            result["period"] = {
                "label": period["label"], "capacity_units": capacity,
                "modeled_volume": volume, "volume_basis": "capacity" if requested is None else "requested",
                "exceeds_capacity": volume > capacity,
                "revenue": decimal_string(revenue), "variable_cash": decimal_string(variable_cash),
                "fixed_cash": decimal_string(period["fixed_cash"]),
                "cash_surplus_before_owner_and_tax": decimal_string(cash_surplus),
                "total_owner_hours": decimal_string(total_hours),
                "owner_allowance": decimal_string(total_allowance),
                "remainder_after_allowance": decimal_string(cash_surplus - total_allowance),
            }
        return result


def human_report(currency, results):
    blocks = [MODEL_NOTE]
    for result in results:
        unit = result["unit"]
        lines = [f"Scenario: {result['id']} — {result['label']}", f"Currency: {currency}",
                 f"Unit cash contribution: {unit['cash_contribution']}",
                 f"Unit owner hours: {unit['owner_hours']}",
                 f"Unit owner allowance: {unit['owner_allowance']}",
                 f"Unit contribution after allowance: {unit['contribution_after_allowance']}"]
        period = result["period"]
        if period is None:
            lines.append("Period model: not supplied (unit illustration only)")
        else:
            lines.extend([
                f"Period: {period['label']}", f"Capacity (whole units): {period['capacity_units']}",
                f"Modeled volume: {period['modeled_volume']} ({period['volume_basis']})",
                f"Exceeds capacity: {'yes' if period['exceeds_capacity'] else 'no'}",
                f"Period revenue: {period['revenue']}", f"Period variable cash: {period['variable_cash']}",
                f"Period fixed cash: {period['fixed_cash']}",
                f"Cash surplus before owner and tax: {period['cash_surplus_before_owner_and_tax']}",
                f"Total owner hours: {period['total_owner_hours']}",
                f"Period owner allowance: {period['owner_allowance']}",
                f"Remainder after allowance: {period['remainder_after_allowance']}",
            ])
        blocks.append("\n".join(lines))
    return "\n\n".join(blocks)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="regular UTF-8 JSON scenario file")
    parser.add_argument("--scenario", action="append", help="scenario id to print; repeat to select several; default: all")
    parser.add_argument("--volume", help="whole-unit override for exactly one selected scenario that has a period")
    parser.add_argument("--json", action="store_true", help="print JSON with exact decimal strings")
    args = parser.parse_args(argv)
    try:
        currency, scenarios = read_document(args.input)
        if args.scenario:
            wanted = set(args.scenario)
            available = {scenario["id"] for scenario in scenarios}
            if wanted - available:
                raise ModelError(f"unknown scenario id(s): {', '.join(sorted(wanted - available))}")
            scenarios = [scenario for scenario in scenarios if scenario["id"] in wanted]
        override = None
        if args.volume is not None:
            if len(scenarios) != 1 or scenarios[0]["period"] is None:
                raise ModelError("--volume requires exactly one selected scenario with a period model")
            override = checked_number(args.volume, "--volume", whole=True)
        results = [calculate(scenario, override) for scenario in scenarios]
        if args.json:
            print(json.dumps({"currency": currency, "model_note": MODEL_NOTE, "results": results}, indent=2, ensure_ascii=False))
        else:
            print(human_report(currency, results))
    except (ModelError, DecimalException) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
