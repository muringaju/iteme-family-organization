/**
 * Signature element: a winding path with milestone dots,
 * symbolizing the journey from vulnerability to self-reliance.
 */
export default function PathwayDivider({ flip = false, className = "" }) {
  return (
    <div className={`pointer-events-none w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        className={`h-16 w-full ${flip ? "-scale-y-100" : ""}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 C 150 60, 150 20, 300 20 S 450 60, 600 60 S 750 20, 900 20 S 1050 60, 1200 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
          className="text-forest/30"
        />
        {[0, 300, 600, 900, 1200].map((x, i) => (
          <circle
            key={x}
            cx={x === 0 ? 6 : x === 1200 ? 1194 : x}
            cy={i % 2 === 0 ? 60 : 20}
            r={i === 4 ? 6 : 4}
            className={i === 4 ? "fill-gold" : "fill-forest/40"}
          />
        ))}
      </svg>
    </div>
  );
}
