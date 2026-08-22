export function usd(n: number, digits = 0): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(digits === 0 ? 1 : digits)}k`;
  return `${sign}$${abs.toFixed(digits)}`;
}

export function pct(n: number, digits = 1): string {
  const sign = n < 0 ? "−" : "";
  return `${sign}${(Math.abs(n) * 100).toFixed(digits)}%`;
}

export function pp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${(Math.abs(n) * 100).toFixed(digits)} pp`;
}

export function signedPct(n: number, digits = 1): string {
  if (Math.abs(n) < 1e-6) return "0%";
  const sign = n > 0 ? "+" : "−";
  return `${sign}${(Math.abs(n) * 100).toFixed(digits)}%`;
}

export function monthLabel(m: number): string {
  return `M${m + 1}`;
}

export function segmentLabel(s: string): string {
  return s.replaceAll("_", " ");
}
