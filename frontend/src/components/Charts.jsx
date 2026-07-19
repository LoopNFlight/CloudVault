import { motion } from "framer-motion";

const PALETTE = ["#3B82F6", "#8B5CF6", "#06B6D4", "#F59E0B", "#EC4899", "#10B981", "#EF4444"];

/** Simple animated vertical bar chart. data: [{ label, value }] */
export function BarChart({ data, height = 200 }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(4, (d.value / max) * (height - 32))}px` }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 18 }}
            className="w-full rounded-t-lg"
            style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[11px] text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Simple animated donut chart. data: [{ label, value }] */
export function DonutChart({ data, size = 180 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size / 2 - 18;
  const circumference = 2 * Math.PI * radius;
  let offsetAccum = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={18} />
          {data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const circle = (
              <motion.circle
                key={d.label}
                r={radius}
                fill="none"
                stroke={PALETTE[i % PALETTE.length]}
                strokeWidth={18}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offsetAccum}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                strokeLinecap="butt"
              />
            );
            offsetAccum += dash;
            return circle;
          })}
        </g>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white font-display text-xl font-semibold">
          {total}
        </text>
      </svg>
      <ul className="space-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
            <span className="uppercase">{d.label}</span>
            <span className="text-white">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Simple animated line/area chart. data: [{ label, value }] */
export function LineChart({ data, height = 200 }) {
  if (!data.length) return null;
  const max = Math.max(1, ...data.map((d) => d.value));
  const width = 100; // percentage-based viewBox
  const stepX = width / Math.max(1, data.length - 1);

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - (d.value / max) * (height - 24) - 12,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;

  return (
    <div style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#lineFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={0.8}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
