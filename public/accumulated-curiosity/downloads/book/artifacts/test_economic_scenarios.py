"""Behavior checks with hand-derived expected values; Python standard library only.

Run directly: python3 -B test_economic_scenarios.py
Tests create temporary input files and remove them. The calculator reads inputs
and prints results; tests inspect those real CLI results, not mocks.
"""
import copy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
SCRIPT = ROOT / "economic_scenarios.py"
EXAMPLES = ROOT / "scenarios.json"


def baseline():
    return {
        "id": "baseline", "label": "Synthetic arithmetic fixture",
        "price": "300", "attributable_variable_cash": "20",
        "delivery_hours": "4", "acquisition_hours": "2", "support_hours": "1",
        "owner_hourly_rate": "50",
        "period": {"label": "month", "available_hours": "160",
                   "fixed_operating_hours": "40", "fixed_cash": "200"},
    }


class CalculatorTests(unittest.TestCase):
    def cli(self, *args, path=EXAMPLES):
        return subprocess.run(
            [sys.executable, "-B", str(SCRIPT), str(path), *args],
            text=True, capture_output=True, check=False,
        )

    def result(self, scenario=None, *args):
        if scenario is None:
            process = self.cli("--scenario", "baseline", "--json", *args)
        else:
            with tempfile.TemporaryDirectory() as temp:
                path = Path(temp) / "input.json"
                path.write_text(json.dumps({"currency": "USD", "scenarios": [scenario]}), encoding="utf-8")
                process = self.cli("--json", *args, path=path)
        self.assertEqual(process.returncode, 0, process.stderr)
        self.assertEqual(process.stderr, "")
        return json.loads(process.stdout)["results"][0]

    def assert_cli_error(self, raw, field=None):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "bad.json"
            path.write_text(raw, encoding="utf-8")
            process = self.cli("--json", path=path)
        self.assertEqual(process.returncode, 2)
        self.assertEqual(process.stdout, "")
        self.assertTrue(process.stderr.startswith("error:"), process.stderr)
        self.assertNotIn("Traceback", process.stderr)
        if field:
            self.assertIn(field, process.stderr)

    def test_baseline_includes_fixed_owner_time_and_fixed_cash(self):
        out = self.result()
        self.assertEqual(out["unit"], {
            "cash_contribution": "280", "owner_hours": "7",
            "owner_allowance": "350", "contribution_after_allowance": "-70",
        })
        for key, expected in {
            "capacity_units": 17, "modeled_volume": 17, "exceeds_capacity": False,
            "revenue": "5100", "variable_cash": "340", "fixed_cash": "200",
            "cash_surplus_before_owner_and_tax": "4560", "total_owner_hours": "159",
            "owner_allowance": "7950", "remainder_after_allowance": "-3390",
        }.items():
            with self.subTest(key=key):
                self.assertEqual(out["period"][key], expected)

    def test_proposed_scenario_does_not_inherit_baseline_hours_or_price(self):
        process = self.cli("--scenario", "proposed", "--json")
        self.assertEqual(process.returncode, 0, process.stderr)
        out = json.loads(process.stdout)["results"][0]
        self.assertEqual(out["unit"]["contribution_after_allowance"], "415")
        for key, expected in {
            "capacity_units": 20, "revenue": "15000", "variable_cash": "700",
            "cash_surplus_before_owner_and_tax": "14100", "total_owner_hours": "160",
            "owner_allowance": "8000", "remainder_after_allowance": "6100",
        }.items():
            with self.subTest(key=key):
                self.assertEqual(out["period"][key], expected)

    def test_pilot_unit_does_not_silently_allocate_monthly_overhead(self):
        process = self.cli("--scenario", "pilot_unit", "--json")
        self.assertEqual(process.returncode, 0, process.stderr)
        out = json.loads(process.stdout)["results"][0]
        self.assertEqual(out["unit"]["cash_contribution"], "280")
        self.assertEqual(out["unit"]["owner_hours"], "7")
        self.assertEqual(out["unit"]["contribution_after_allowance"], "-70")
        self.assertIsNone(out["period"])

    def test_requested_volume_above_capacity_is_reported_not_clamped(self):
        out = self.result(None, "--volume", "20")
        for key, expected in {
            "capacity_units": 17, "modeled_volume": 20, "exceeds_capacity": True,
            "revenue": "6000", "variable_cash": "400",
            "cash_surplus_before_owner_and_tax": "5400", "total_owner_hours": "180",
            "owner_allowance": "9000", "remainder_after_allowance": "-3600",
        }.items():
            with self.subTest(key=key):
                self.assertEqual(out["period"][key], expected)

    def test_supplied_json_volume_is_respected_and_cli_override_wins(self):
        scenario = baseline()
        scenario["period"]["modeled_volume"] = 2
        self.assertEqual(self.result(scenario)["period"]["revenue"], "600")
        self.assertEqual(self.result(scenario, "--volume", "3")["period"]["revenue"], "900")

    def test_zero_volume_retains_fixed_cash_and_fixed_owner_time(self):
        out = self.result(None, "--volume", "0")["period"]
        self.assertEqual(out["modeled_volume"], 0)
        self.assertEqual(out["revenue"], "0")
        self.assertEqual(out["cash_surplus_before_owner_and_tax"], "-200")
        self.assertEqual(out["total_owner_hours"], "40")
        self.assertEqual(out["remainder_after_allowance"], "-2200")
        self.assertFalse(out["exceeds_capacity"])

    def test_zero_remaining_hours_produces_zero_whole_units(self):
        scenario = baseline()
        scenario["period"]["available_hours"] = "40"
        out = self.result(scenario)["period"]
        self.assertEqual(out["capacity_units"], 0)
        self.assertEqual(out["modeled_volume"], 0)
        self.assertEqual(out["remainder_after_allowance"], "-2200")

    def test_decimal_fractional_hours_do_not_acquire_float_error(self):
        scenario = baseline()
        scenario.update(price="0.30", attributable_variable_cash="0.10", delivery_hours="0.1",
                        acquisition_hours="0.2", support_hours="0", owner_hourly_rate="0.1")
        scenario["period"].update(available_hours="1", fixed_operating_hours="0", fixed_cash="0.05")
        out = self.result(scenario)
        self.assertEqual(out["unit"]["owner_hours"], "0.3")
        self.assertEqual(out["unit"]["contribution_after_allowance"], "0.17")
        self.assertEqual(out["period"]["capacity_units"], 3)
        self.assertEqual(out["period"]["remainder_after_allowance"], "0.46")

    def test_exact_products_exceeding_default_decimal_precision_are_preserved(self):
        scenario = baseline()
        scenario.update(price="1234567890123456789012345678.90", attributable_variable_cash="0",
                        delivery_hours="1", acquisition_hours="0", support_hours="0", owner_hourly_rate="0")
        scenario["period"].update(available_hours="2", fixed_operating_hours="0", fixed_cash="0")
        self.assertEqual(self.result(scenario)["period"]["revenue"], "2469135780246913578024691357.8")

    def test_json_decimal_tokens_are_not_first_rounded_to_binary_floats(self):
        raw = json.dumps({"currency": "USD", "scenarios": [baseline()]})
        raw = raw.replace('"300"', '0.100000000000000000000000000001')
        raw = raw.replace('"20"', '0')
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "decimal.json"
            path.write_text(raw, encoding="utf-8")
            process = self.cli("--json", path=path)
        self.assertEqual(process.returncode, 0, process.stderr)
        out = json.loads(process.stdout)["results"][0]
        self.assertEqual(out["unit"]["cash_contribution"], "0.100000000000000000000000000001")

    def test_price_sensitivity_changes_income_without_inventing_more_capacity(self):
        scenario = baseline()
        scenario["price"] = "450"
        out = self.result(scenario)
        self.assertEqual(out["unit"]["contribution_after_allowance"], "80")
        self.assertEqual(out["period"]["capacity_units"], 17)
        self.assertEqual(out["period"]["revenue"], "7650")
        self.assertEqual(out["period"]["remainder_after_allowance"], "-840")

    def test_acquisition_sensitivity_counts_lost_sale_effort_once_in_hours(self):
        scenario = baseline()
        scenario["acquisition_hours"] = "3"
        out = self.result(scenario)
        self.assertEqual(out["unit"]["owner_hours"], "8")
        self.assertEqual(out["unit"]["contribution_after_allowance"], "-120")
        self.assertEqual(out["period"]["capacity_units"], 15)
        self.assertEqual(out["period"]["remainder_after_allowance"], "-4000")

    def test_every_numeric_field_rejects_boolean(self):
        paths = [(key,) for key in ("price", "attributable_variable_cash", "delivery_hours",
                 "acquisition_hours", "support_hours", "owner_hourly_rate")]
        paths += [("period", key) for key in ("available_hours", "fixed_operating_hours", "fixed_cash", "modeled_volume")]
        for path in paths:
            with self.subTest(path=path):
                scenario = baseline()
                if len(path) == 1:
                    scenario[path[0]] = True
                else:
                    scenario[path[0]][path[1]] = False
                self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [scenario]}), path[-1])

    def test_bad_nonfinite_negative_and_nonnumeric_values_are_errors(self):
        for value in ["NaN", "Infinity", "-Infinity", "sNaN", "2 hours", "", None, [], {}, "-1", -1, "1e1000000"]:
            with self.subTest(value=value):
                scenario = baseline()
                scenario["price"] = value
                self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [scenario]}), "price")
        for token in ["NaN", "Infinity", "-Infinity"]:
            with self.subTest(token=token):
                self.assert_cli_error('{"currency":"USD","scenarios":[' + json.dumps(baseline()).replace('"300"', token) + ']}')

    def test_zero_unit_hours_fixed_hours_over_budget_and_fractional_volume_are_errors(self):
        scenario = baseline()
        scenario.update(delivery_hours="0", acquisition_hours="0", support_hours="0")
        self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [scenario]}), "hours")
        scenario = baseline()
        scenario["period"]["fixed_operating_hours"] = "161"
        self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [scenario]}), "fixed_operating_hours")
        scenario = baseline()
        scenario["period"]["modeled_volume"] = "1.5"
        self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [scenario]}), "modeled_volume")

    def test_unknown_missing_duplicate_fields_and_duplicate_ids_are_errors(self):
        scenario = baseline()
        scenario["delivery_hour"] = "4"
        self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [scenario]}), "delivery_hour")
        scenario = baseline()
        del scenario["price"]
        self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [scenario]}), "price")
        self.assert_cli_error('{"currency":"USD","currency":"MYR","scenarios":[]}')
        self.assert_cli_error(json.dumps({"currency": "USD", "scenarios": [baseline(), baseline()]}), "id")
        self.assert_cli_error('{"currency":"USD","scenarios":[]}')
        self.assert_cli_error('{broken json')

    def test_cli_missing_file_unknown_scenario_bad_volume_and_ambiguous_override(self):
        for args, path in [(("--json",), ROOT / "does-not-exist.json"),
                           (("--scenario", "unknown", "--json"), EXAMPLES),
                           (("--scenario", "baseline", "--volume", "1.2"), EXAMPLES),
                           (("--scenario", "baseline", "--volume", "NaN"), EXAMPLES),
                           (("--volume", "2"), EXAMPLES),
                           (("--scenario", "pilot_unit", "--volume", "1"), EXAMPLES)]:
            with self.subTest(args=args):
                process = self.cli(*args, path=path)
                self.assertEqual(process.returncode, 2)
                self.assertEqual(process.stdout, "")
                self.assertTrue(process.stderr.startswith("error:"), process.stderr)
                self.assertNotIn("Traceback", process.stderr)

    def test_calculator_leaves_inputs_and_working_directory_unchanged(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            path = folder / "input.json"
            original = EXAMPLES.read_bytes()
            path.write_bytes(original)
            before = {p.name: p.read_bytes() for p in folder.iterdir()}
            process = subprocess.run([sys.executable, "-B", str(SCRIPT), str(path), "--json"],
                                     cwd=folder, text=True, capture_output=True, check=False)
            self.assertEqual(process.returncode, 0, process.stderr)
            self.assertEqual({p.name: p.read_bytes() for p in folder.iterdir()}, before)

    def test_human_output_explains_unit_only_and_overcapacity_states(self):
        process = self.cli("--scenario", "pilot_unit")
        self.assertEqual(process.returncode, 0, process.stderr)
        self.assertIn("Unit contribution after allowance: -70", process.stdout)
        self.assertIn("unit illustration only", process.stdout)
        process = self.cli("--scenario", "baseline", "--volume", "20")
        self.assertEqual(process.returncode, 0, process.stderr)
        self.assertIn("Exceeds capacity: yes", process.stdout)
        self.assertIn("Total owner hours: 180", process.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
