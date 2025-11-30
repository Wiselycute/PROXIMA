// components/PerformanceChart.jsx
export default function PerformanceChart({ value = 26 }) {
  // simple static path to approximate the look; tweak points to taste
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <svg viewBox="0 0 120 40" className="w-full h-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <path
            d="M0 30 Q20 18 36 22 T72 14 T120 8"
            fill="none"
            stroke="url(#g)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 36 L0 40 L120 40 L120 36"
            fill="rgba(0,0,0,0.02)"
          />
        </svg>
      </div>

      <div className="w-12 text-right">
        <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>{value}%</div>
        <div className="text-xs opacity-70">Oct</div>
      </div>
    </div>
  );
}
