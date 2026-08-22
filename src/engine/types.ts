export type Segment = "transactor" | "prime_revolver" | "near_prime" | "subprime" | "gig";

export type Macro = {
  inflation: number;
  unemployment: number;
  fedFunds: number;
};

export type Policy = {
  limitDelta: number;
  aprDelta: number;
  cashbackBps: number;
  hardship: boolean;
};

export type Agent = {
  id: number;
  name: string;
  city: string;
  segment: Segment;
  income: number;
  cash: number;
  deposits: number;
  burn: number;
  habitSpend: number;
  limit: number;
  balance: number;
  apr: number;
  walletShare: number;
  employed: boolean;
  risk: number;
  delinquencyDays: number;
  defaulted: boolean;
  churned: boolean;
  monthsUnemployed: number;
};

export type Txn = {
  id: string;
  month: number;
  day: number;
  agentId: number;
  agentName: string;
  merchant: string;
  mcc: string;
  category: string;
  amount: number;
  channel: "swipe" | "ach" | "p2p" | "payment" | "decline";
  balanceAfter: number;
  cashAfter: number;
};

export type Narrative = {
  month: number;
  agentId: number;
  agentName: string;
  kind: "job_loss" | "rehire" | "decline" | "default" | "churn" | "hardship" | "medical" | "limit";
  text: string;
};

export type MonthPoint = {
  month: number;
  spend: number;
  spendDisplaced: number;
  interchange: number;
  interest: number;
  fundingCost: number;
  nim: number;
  newDefaults: number;
  defaultRate: number;
  chargeOffs: number;
  newChurn: number;
  churnRate: number;
  deposits: number;
  utilization: number;
  dq30: number;
  dq90: number;
  walletShare: number;
  ltv: number;
  reward: number;
  active: number;
};

export type HouseholdPath = {
  agent: Agent;
  cash: number[];
  balance: number[];
  spend: number[];
  employed: boolean[];
};

export type SimResult = {
  months: MonthPoint[];
  narratives: Narrative[];
  txns: Txn[];
  households: HouseholdPath[];
  totals: {
    spend: number;
    displaced: number;
    interchange: number;
    nim: number;
    chargeOffs: number;
    defaults: number;
    churn: number;
    ltv: number;
    depositsEnd: number;
    depositsStart: number;
    reward: number;
  };
};

export const NEUTRAL_POLICY: Policy = {
  limitDelta: 0,
  aprDelta: 0,
  cashbackBps: 0,
  hardship: false,
};

export const CANONICAL_MACRO: Macro = {
  inflation: 0.065,
  unemployment: 0.068,
  fedFunds: 0.0475,
};

export const CALM_MACRO: Macro = {
  inflation: 0.024,
  unemployment: 0.042,
  fedFunds: 0.0425,
};

export const CANONICAL_POLICY: Policy = {
  limitDelta: -0.2,
  aprDelta: 0,
  cashbackBps: 0,
  hardship: false,
};
