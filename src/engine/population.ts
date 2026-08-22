import { pick, randn, u01 } from "./rng";
import type { Agent, Segment } from "./types";

const NAMES = [
  "Maya Chen", "Luis Ortega", "Priya Shah", "Jonah Hale", "Amina Diallo",
  "Eli Navarro", "Sofia Park", "Marcus Quinn", "Leila Hassan", "Owen Briggs",
  "Hana Sato", "Diego Ruiz", "Nora Ellison", "Ibrahim Cole", "Ruthie Lang",
  "Theo Marquez", "Yara Nasser", "Felix Cho", "Gita Raman", "Andre Walsh",
  "Camille Drey", "Nate Okonkwo", "Iris Feldman", "Pavel Horvat", "June Solis",
];

const CITIES = [
  "Austin", "Cleveland", "Atlanta", "Phoenix", "Newark",
  "Omaha", "Tampa", "Portland", "Memphis", "Raleigh",
  "Spokane", "Buffalo", "Tucson", "Pittsburgh", "Des Moines",
];

type Spec = {
  segment: Segment;
  weight: number;
  income: [number, number];
  cashMonths: [number, number];
  util: [number, number];
  wallet: [number, number];
  risk: [number, number];
  revolver: number;
};

const SPECS: Spec[] = [
  { segment: "transactor", weight: 0.28, income: [7200, 0.35], cashMonths: [4.2, 0.5], util: [0.04, 0.05], wallet: [0.62, 0.15], risk: [0.08, 0.04], revolver: 0.08 },
  { segment: "prime_revolver", weight: 0.3, income: [5800, 0.32], cashMonths: [1.8, 0.45], util: [0.38, 0.18], wallet: [0.55, 0.16], risk: [0.22, 0.08], revolver: 0.92 },
  { segment: "near_prime", weight: 0.22, income: [3900, 0.3], cashMonths: [0.9, 0.5], util: [0.58, 0.16], wallet: [0.48, 0.18], risk: [0.42, 0.1], revolver: 0.86 },
  { segment: "subprime", weight: 0.14, income: [2700, 0.28], cashMonths: [0.35, 0.55], util: [0.78, 0.12], wallet: [0.36, 0.16], risk: [0.68, 0.1], revolver: 0.95 },
  { segment: "gig", weight: 0.06, income: [3200, 0.55], cashMonths: [0.7, 0.65], util: [0.52, 0.22], wallet: [0.41, 0.2], risk: [0.5, 0.12], revolver: 0.7 },
];

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function lognormal(mean: number, sd: number, seed: number, i: number, ch: number): number {
  return Math.max(400, mean * Math.exp(sd * randn(seed, i, 0, ch) * 0.55));
}

function chooseSegment(seed: number, i: number): Spec {
  let r = u01(seed, i, 0, 1);
  for (const spec of SPECS) {
    r -= spec.weight;
    if (r <= 0) return spec;
  }
  return SPECS[0];
}

export function createPopulation(n: number, seed: number): Agent[] {
  const agents: Agent[] = [];
  for (let i = 0; i < n; i++) {
    const spec = chooseSegment(seed, i);
    const income = lognormal(spec.income[0], spec.income[1], seed, i, 2);
    const burn = income * clamp(0.42 + 0.08 * randn(seed, i, 0, 3), 0.28, 0.62);
    const cashMonths = clamp(spec.cashMonths[0] * Math.exp(spec.cashMonths[1] * randn(seed, i, 0, 4)), 0.05, 10);
    const cash = burn * cashMonths;
    const limit = clamp(income * (2.4 - spec.risk[0] * 1.4) * (0.85 + 0.3 * u01(seed, i, 0, 5)), 500, 45000);
    const util = clamp(spec.util[0] + spec.util[1] * randn(seed, i, 0, 6), 0.01, 0.97);
    const revolver = u01(seed, i, 0, 7) < spec.revolver;
    const balance = revolver ? limit * util : limit * util * 0.15;
    const apr = clamp(0.1699 + spec.risk[0] * 0.16 + 0.03 * randn(seed, i, 0, 8), 0.1299, 0.3299);
    const wallet = clamp(spec.wallet[0] + spec.wallet[1] * randn(seed, i, 0, 9), 0.08, 0.92);
    const habit = clamp(income * (0.18 + 0.1 * wallet) * (0.8 + 0.4 * u01(seed, i, 0, 10)), 120, income * 0.55);

    agents.push({
      id: i,
      name: pick(NAMES, seed, i, 11),
      city: pick(CITIES, seed, i, 12),
      segment: spec.segment,
      income,
      cash,
      deposits: cash * (0.85 + 0.2 * u01(seed, i, 0, 13)),
      burn,
      habitSpend: habit,
      limit,
      balance,
      apr,
      walletShare: wallet,
      employed: u01(seed, i, 0, 14) > 0.045,
      risk: clamp(spec.risk[0] + spec.risk[1] * randn(seed, i, 0, 15), 0.02, 0.95),
      delinquencyDays: u01(seed, i, 0, 16) < spec.risk[0] * 0.12 ? 30 : 0,
      defaulted: false,
      churned: false,
      monthsUnemployed: 0,
    });
  }
  return agents;
}

export function cloneAgents(agents: Agent[]): Agent[] {
  return agents.map((a) => ({ ...a }));
}
