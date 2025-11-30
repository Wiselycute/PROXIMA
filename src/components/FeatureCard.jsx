// components/FeatureCard.jsx
export default function FeatureCard({
  title,
  children,
  variant = "large", // "large" or "small"
  badge = true,
  footer,
  className = "",
}) {
  const largeBase = "p-6 rounded-2xl";
  const smallBase = "p-4 rounded-xl";
  const base = variant === "large" ? largeBase : smallBase;

  return (
    <div
      className={`card-glass dotted-overlay ${base} ${className}`}
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>
            {title}
          </h4>
          <div className="mt-2 text-sm opacity-80">{children}</div>
        </div>
        {badge && (
          <div className="ml-3 flex-shrink-0">
            <div className="card-badge flex items-center justify-center" aria-hidden />
          </div>
        )}
      </div>

      {footer && <div className="mt-4 text-sm opacity-80">{footer}</div>}
    </div>
  );
}
