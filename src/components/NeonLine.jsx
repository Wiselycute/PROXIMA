// components/NeonLine.jsx
export default function NeonLine({ className = "", width = "100%", height = "100%" }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{
        mixBlendMode: "screen",
        filter: "drop-shadow(0 20px 60px rgba(75,226,242,0.12))",
      }}
    >
      <defs>
        <linearGradient id="g_core" x1="0" x2="1">
          <stop offset="0%" stopColor="#4BE2F2" stopOpacity="1" />
          <stop offset="100%" stopColor="#8EF8FF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="g_inner" x1="0" x2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#DFFBFF" stopOpacity="0.6" />
        </linearGradient>

        <filter id="f-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" result="b" />
          <feBlend in="SourceGraphic" in2="b" mode="screen" />
        </filter>

        <filter id="f-bloom" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="40" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* big bloom */}
      <g filter="url(#f-bloom)" opacity="0.9">
        <path
          d="M110 620 C220 460, 320 420, 420 350 C520 280, 620 260, 720 220 C820 180, 920 160, 1000 140"
          stroke="#4BE2F2"
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.16"
          fill="none"
        />
      </g>

      {/* medium core glow */}
      <g filter="url(#f-blur)" opacity="0.95">
        <path
          d="M110 620 C220 460, 320 420, 420 350 C520 280, 620 260, 720 220 C820 180, 920 160, 1000 140"
          stroke="url(#g_core)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* crisp highlight */}
      <path
        d="M110 620 C220 460, 320 420, 420 350 C520 280, 620 260, 720 220 C820 180, 920 160, 1000 140"
        stroke="url(#g_inner)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <circle cx="1000" cy="140" r="12" fill="#4BE2F2" opacity="0.95" />
      <circle cx="420" cy="350" r="9" fill="#4BE2F2" opacity="0.9" />
    </svg>
  );
}
