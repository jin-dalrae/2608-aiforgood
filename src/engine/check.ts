import { createPopulation } from "./population";
import { runCounterfactual } from "./simulate";
import { CANONICAL_MACRO, CANONICAL_POLICY } from "./types";
import { pct, usd } from "./format";

const agents = createPopulation(1200, 7);
const { baseline, intervention } = runCounterfactual({
  agents,
  months: 18,
  macro: CANONICAL_MACRO,
  policy: CANONICAL_POLICY,
  seed: 7,
});

const b = baseline.months.at(-1)!;
const i = intervention.months.at(-1)!;

const lines = [
  `hh=${agents.length}`,
  `default base=${pct(b.defaultRate)} int=${pct(i.defaultRate)}`,
  `spend base=${usd(baseline.totals.spend)} int=${usd(intervention.totals.spend)}`,
  `displaced base=${usd(baseline.totals.displaced)} int=${usd(intervention.totals.displaced)}`,
  `deposits base=${usd(b.deposits)} int=${usd(i.deposits)}`,
  `nim base=${usd(baseline.totals.nim)} int=${usd(intervention.totals.nim)}`,
  `chargeoff base=${usd(baseline.totals.chargeOffs)} int=${usd(intervention.totals.chargeOffs)}`,
  `churn base=${pct(b.churnRate)} int=${pct(i.churnRate)}`,
];
console.log(lines.join("\n"));

if (intervention.totals.spend >= baseline.totals.spend) {
  throw new Error("expected line cut to reduce spend");
}
if (intervention.totals.displaced <= baseline.totals.displaced) {
  throw new Error("expected line cut to increase displaced spend");
}
console.log("ok");
