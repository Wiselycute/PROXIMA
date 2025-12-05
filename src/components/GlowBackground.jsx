
export default function GlowBackground({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: -1 }}
    >
      {/* Left soft glow */}
      <div
        style={{
          position: "absolute",
          left: "-12%",
          top: "-10%",
          width: "48rem",
          height: "48rem",
          borderRadius: "9999px",
          filter: "blur(140px)",
          background: "color-mix(in oklch, var(--primary) 55%, var(--accent) 45%)",
          opacity: 0.22,
          transform: "translateZ(0)",
        }}
      />
      {/* Right darker vignette */}
      <div
        style={{
          position: "absolute",
          right: "-8%",
          bottom: "-10%",
          width: "60rem",
          height: "40rem",
          borderRadius: "50%",
          filter: "blur(100px)",
          background: "linear-gradient(180deg, transparent, color-mix(in oklch, var(--background) 60%, black 30%))",
          opacity: 0.6,
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
