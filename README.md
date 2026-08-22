# Fathom — World Model for Retail Banking

While brokerage world models simulate prices and order books, **Fathom** simulates household cash flow, credit lines, and payment networks.

> If we cut this cohort’s credit line by 20% during an inflationary spike, how do default rates, spending displacement, and deposit retention change over 18 months?

This repository is an interactive demo of that counterfactual. 1,200 synthetic households roll forward 18 months in the browser. Baseline policy and intervention share the same shocks; only the action changes.

## Run the demo

```bash
npm install
npm run dev
```

Open the printed local URL. The **Workbench** is the product: sliders for inflation, unemployment, line cuts, APR, cashback, and hardship. Charts compare default, spend, and deposits. The **Ledger** exports a synthetic event stream.

```bash
npm run build
npm run preview
```

## What’s in here

| Path | Role |
| --- | --- |
| `src/engine/` | Population, shared-shock simulator, reward (NIM, interchange, losses, LTV) |
| `src/views/` | Observatory, Workbench, Anatomy, Ledger |
| `docs/prd.md` | Product requirements |

The simulator is a calibrated microsimulation — habit spend, cash buffers, delayed default, competitor substitution — not a trained foundation model. That is intentional: it is inspectable, deterministic, and good enough to demonstrate the world-model loop. The PRD describes the path to learned dynamics on bank-hosted data.

## Not this

Fathom is **not** a credit decisioning system. Numbers are synthetic. Do not underwrite from the demo.

## License

MIT
