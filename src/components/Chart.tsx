import { monthLabel, usd } from "../engine/format";

type Series = { baseline: number[]; intervention: number[] };

export function LineChart({
  series,
  format = "usd",
}: {
  series: Series;
  format?: "usd" | "pct";
}) {
  const w = 640;
  const h = 200;
  const pad = { l: 54, r: 12, t: 12, b: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const n = Math.max(series.baseline.length, 1);
  const all = [...series.baseline, ...series.intervention];
  const min = Math.min(0, ...all);
  const max = Math.max(...all, 1e-6);
  const span = max - min || 1;
  const x = (i: number) => pad.l + (i / Math.max(1, n - 1)) * innerW;
  const y = (v: number) => pad.t + (1 - (v - min) / span) * innerH;
  const path = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const ticks = 4;
  const fmt = (v: number) => (format === "pct" ? `${(v * 100).toFixed(1)}%` : usd(v));

  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img">
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const v = min + (span * i) / ticks;
        const yy = y(v);
        return (
          <g key={i}>
            <line className="grid" x1={pad.l} x2={w - pad.r} y1={yy} y2={yy} />
            <text className="axis" x={pad.l - 8} y={yy + 3} textAnchor="end">
              {fmt(v)}
            </text>
          </g>
        );
      })}
      {series.baseline.map((_, i) =>
        i % 3 === 0 ? (
          <text key={i} className="axis" x={x(i)} y={h - 6} textAnchor="middle">
            {monthLabel(i)}
          </text>
        ) : null,
      )}
      <path className="base" d={path(series.baseline)} />
      <path className="int" d={path(series.intervention)} />
    </svg>
  );
}
