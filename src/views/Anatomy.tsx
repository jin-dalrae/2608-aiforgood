export function Anatomy() {
  return (
    <div className="view">
      <div className="kicker">Core anatomy</div>
      <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
        A generative simulator of the <em>financial lifecycle</em>
      </h1>
      <p className="lede" style={{ marginBottom: 28 }}>
        State and policy enter a transition kernel. The kernel is not a price process — it is latent
        intent, shock propagation, and competitor substitution. The next state carries the reward
        the institution actually cares about.
      </p>

      <div className="diagram" style={{ marginBottom: 16 }}>
        <div className="dbox">
          <h4>State S<sub>t</sub></h4>
          <ul>
            <li>Cash buffers & deposit stock</li>
            <li>Recurring burn (rent, utilities, debt service)</li>
            <li>Merchant graph / MCC mix</li>
            <li>Macro climate (inflation, unemployment, rates)</li>
          </ul>
        </div>
        <div className="arrow">+</div>
        <div className="dbox">
          <h4>Action / policy A<sub>t</sub></h4>
          <ul>
            <li>Credit limit changes</li>
            <li>APR adjustments</li>
            <li>Targeted incentives / cashback</li>
            <li>Authorization & hardship timing</li>
          </ul>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16, textAlign: "center" }}>
        <h4 className="kicker" style={{ marginBottom: 8 }}>Transition dynamics P(S<sub>t+1</sub> | S<sub>t</sub>, A<sub>t</sub>)</h4>
        <p style={{ margin: 0 }}>
          Latent consumption needs · unemployment and inflation shocks · competitor card substitution
          when an authorization fails or a line is exhausted.
        </p>
      </div>

      <div className="row cols-4" style={{ marginBottom: 16 }}>
        <div className="dbox">
          <h4>NIM</h4>
          <p>Interest on revolvers minus cost of funds.</p>
        </div>
        <div className="dbox">
          <h4>Interchange</h4>
          <p>Fee income on card spend that still clears.</p>
        </div>
        <div className="dbox">
          <h4>Losses</h4>
          <p>Charge-offs after 90–180 day lag; churn LTV leakage.</p>
        </div>
        <div className="dbox">
          <h4>Customer LTV</h4>
          <p>Discounted reward path under the policy.</p>
        </div>
      </div>

      <section className="row cols-3">
        <article className="panel">
          <h3>1. Latent representation</h3>
          <p>
            Sequence embeddings over raw events: timestamp, MCC, amount, merchant, balance-after.
            Cash-flow velocity versus non-discretionary burn. Wallet hierarchy: top-of-wallet vs.
            promotional second card.
          </p>
        </article>
        <article className="panel">
          <h3>2. Generative engine</h3>
          <p>
            This demo uses a calibrated microsimulator with shared idiosyncratic shocks so the two
            arms differ only by policy. The production path adds learned residual dynamics and
            diffusion/autoregressive event generators conditioned on macro factors.
          </p>
        </article>
        <article className="panel">
          <h3>3. Interventions</h3>
          <p>
            Dynamic line management on real-time risk, not monthly bureau cycles. Alerts and
            restructures before delinquency. Reward multipliers to steer category mix.
          </p>
        </article>
      </section>
    </div>
  );
}
