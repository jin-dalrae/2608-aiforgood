import { LineChart } from "../components/Chart";
import { pct, pp, usd } from "../engine/format";
import type { Macro, Policy, SimResult } from "../engine/types";

type Cohort = "all" | "transactor" | "prime_revolver" | "near_prime" | "subprime" | "gig";

export function Workbench({
  macro,
  policy,
  cohort,
  n,
  months,
  baseline,
  intervention,
  onMacro,
  onPolicy,
  onCohort,
}: {
  macro: Macro;
  policy: Policy;
  cohort: Cohort;
  n: number;
  months: number;
  baseline: SimResult;
  intervention: SimResult;
  onMacro: (m: Macro) => void;
  onPolicy: (p: Policy) => void;
  onCohort: (c: Cohort) => void;
}) {
  const b = baseline.totals;
  const i = intervention.totals;
  const lastB = baseline.months.at(-1);
  const lastI = intervention.months.at(-1);
  const depDelta = (i.depositsEnd - b.depositsEnd) / Math.max(1, b.depositsEnd);

  return (
    <div className="view workbench">
      <aside className="panel controls">
        <h3>Scenario</h3>
        <p className="muted" style={{ fontSize: 13 }}>
          Same households, same shocks. Only the policy arm changes.
        </p>
        <label>
          Cohort
          <select value={cohort} onChange={(e) => onCohort(e.target.value as Cohort)}>
            <option value="all">Full book ({n})</option>
            <option value="transactor">Transactors</option>
            <option value="prime_revolver">Prime revolvers</option>
            <option value="near_prime">Near-prime</option>
            <option value="subprime">Subprime</option>
            <option value="gig">Gig / irregular</option>
          </select>
        </label>
        <label>
          Inflation (annual) <span className="val">{pct(macro.inflation)}</span>
          <input
            type="range"
            min={0.01}
            max={0.12}
            step={0.001}
            value={macro.inflation}
            onChange={(e) => onMacro({ ...macro, inflation: Number(e.target.value) })}
          />
        </label>
        <label>
          Unemployment <span className="val">{pct(macro.unemployment)}</span>
          <input
            type="range"
            min={0.03}
            max={0.12}
            step={0.001}
            value={macro.unemployment}
            onChange={(e) => onMacro({ ...macro, unemployment: Number(e.target.value) })}
          />
        </label>
        <label>
          Fed funds <span className="val">{pct(macro.fedFunds)}</span>
          <input
            type="range"
            min={0.01}
            max={0.08}
            step={0.0025}
            value={macro.fedFunds}
            onChange={(e) => onMacro({ ...macro, fedFunds: Number(e.target.value) })}
          />
        </label>
        <h3 style={{ marginTop: 8 }}>Intervention</h3>
        <label>
          Credit line Δ <span className="val">{Math.round(policy.limitDelta * 100)}%</span>
          <input
            type="range"
            min={-0.4}
            max={0.2}
            step={0.01}
            value={policy.limitDelta}
            onChange={(e) => onPolicy({ ...policy, limitDelta: Number(e.target.value) })}
          />
        </label>
        <label>
          APR Δ <span className="val">{(policy.aprDelta * 100).toFixed(1)} pp</span>
          <input
            type="range"
            min={-0.03}
            max={0.05}
            step={0.0025}
            value={policy.aprDelta}
            onChange={(e) => onPolicy({ ...policy, aprDelta: Number(e.target.value) })}
          />
        </label>
        <label>
          Cashback <span className="val">{policy.cashbackBps} bps</span>
          <input
            type="range"
            min={0}
            max={300}
            step={10}
            value={policy.cashbackBps}
            onChange={(e) => onPolicy({ ...policy, cashbackBps: Number(e.target.value) })}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, gridTemplateColumns: "none" }}>
          <input
            type="checkbox"
            checked={policy.hardship}
            onChange={(e) => onPolicy({ ...policy, hardship: e.target.checked })}
          />
          Hardship program
        </label>
        <p className="muted" style={{ fontSize: 12 }}>
          Horizon {months} months · baseline policy is unchanged lines/APR.
        </p>
      </aside>

      <section>
        <div className="legend">
          <span>
            <i className="swatch base" /> Baseline policy
          </span>
          <span>
            <i className="swatch int" /> Intervention
          </span>
        </div>
        <div className="panel" style={{ marginBottom: 12 }}>
          <h3>Cumulative default rate</h3>
          <div className="chart-wrap">
            <LineChart
              format="pct"
              series={{
                baseline: baseline.months.map((m) => m.defaultRate),
                intervention: intervention.months.map((m) => m.defaultRate),
              }}
            />
          </div>
        </div>
        <div className="row cols-2" style={{ marginBottom: 12 }}>
          <div className="panel">
            <h3>Card spend</h3>
            <div className="chart-wrap">
              <LineChart
                series={{
                  baseline: baseline.months.map((m) => m.spend),
                  intervention: intervention.months.map((m) => m.spend),
                }}
              />
            </div>
          </div>
          <div className="panel">
            <h3>Deposit stock</h3>
            <div className="chart-wrap">
              <LineChart
                series={{
                  baseline: baseline.months.map((m) => m.deposits),
                  intervention: intervention.months.map((m) => m.deposits),
                }}
              />
            </div>
          </div>
        </div>
        <div className="panel">
          <h3>Household tape</h3>
          <div className="feed">
            {intervention.narratives.map((e, idx) => (
              <div className="event" data-kind={e.kind} key={`${e.agentId}-${e.month}-${idx}`}>
                <time>
                  M{e.month + 1} · {e.kind.replaceAll("_", " ")}
                </time>
                {e.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="kpis">
        <div className="kpi">
          <div className="lbl">Default rate @ 18m</div>
          <div className="num">{pct(lastI?.defaultRate ?? 0)}</div>
          <div className={`delta ${(lastI?.defaultRate ?? 0) > (lastB?.defaultRate ?? 0) ? "bad" : "good"}`}>
            {pp((lastI?.defaultRate ?? 0) - (lastB?.defaultRate ?? 0))} vs baseline {pct(lastB?.defaultRate ?? 0)}
          </div>
        </div>
        <div className="kpi">
          <div className="lbl">Spend displacement</div>
          <div className="num">{usd(i.displaced)}</div>
          <div className={`delta ${i.displaced > b.displaced ? "bad" : "good"}`}>
            {usd(i.displaced - b.displaced)} vs baseline
          </div>
        </div>
        <div className="kpi">
          <div className="lbl">Deposit retention</div>
          <div className="num">{pct(i.depositsEnd / Math.max(1, i.depositsStart))}</div>
          <div className={`delta ${depDelta >= 0 ? "good" : "bad"}`}>
            {pct(depDelta)} vs baseline stock
          </div>
        </div>
        <div className="kpi">
          <div className="lbl">NIM (18m)</div>
          <div className="num">{usd(i.nim)}</div>
          <div className={`delta ${i.nim >= b.nim ? "good" : "bad"}`}>{usd(i.nim - b.nim)}</div>
        </div>
        <div className="kpi">
          <div className="lbl">Charge-offs</div>
          <div className="num">{usd(i.chargeOffs)}</div>
          <div className={`delta ${i.chargeOffs > b.chargeOffs ? "bad" : "good"}`}>
            {usd(i.chargeOffs - b.chargeOffs)}
          </div>
        </div>
        <div className="kpi">
          <div className="lbl">Cohort LTV / hh</div>
          <div className="num">{usd(lastI?.ltv ?? 0)}</div>
          <div className={`delta ${(lastI?.ltv ?? 0) >= (lastB?.ltv ?? 0) ? "good" : "bad"}`}>
            {usd((lastI?.ltv ?? 0) - (lastB?.ltv ?? 0))} vs baseline
          </div>
        </div>
        <div className="kpi">
          <div className="lbl">Churn @ 18m</div>
          <div className="num">{pct(lastI?.churnRate ?? 0)}</div>
          <div className={`delta ${(lastI?.churnRate ?? 0) > (lastB?.churnRate ?? 0) ? "bad" : "good"}`}>
            {pp((lastI?.churnRate ?? 0) - (lastB?.churnRate ?? 0))}
          </div>
        </div>
      </aside>
    </div>
  );
}
