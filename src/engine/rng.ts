/** Deterministic streams so baseline vs intervention share the same shocks. */

export function hash32(n: number): number {
  let x = n >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  x = (x ^ (x >>> 16)) >>> 0;
  return x;
}

export function u01(seed: number, a: number, month: number, channel: number): number {
  const h = hash32(seed + Math.imul(a + 1, 374761393) + Math.imul(month + 3, 668265263) + Math.imul(channel + 7, 2147483647));
  return h / 4294967296;
}

export function randn(seed: number, a: number, month: number, channel: number): number {
  const u = Math.max(1e-9, u01(seed, a, month, channel));
  const v = Math.max(1e-9, u01(seed, a, month, channel + 97));
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function pick<T>(items: T[], seed: number, a: number, channel: number): T {
  const i = Math.floor(u01(seed, a, 0, channel) * items.length);
  return items[Math.min(i, items.length - 1)];
}
