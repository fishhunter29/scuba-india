// Brand mark: a clean single-colour scuba diver in a circle with a wave.
// Uses currentColor so it adapts — ink-navy on the light nav, light on the
// dark footer — like a standard monochrome web logo.
export function Seal({ size = 38 }: { size?: number }) {
  return (
    <span className="seal" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="Scuba India">
        {/* ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
        {/* wave */}
        <path
          d="M9 64 Q28 55 48 61 T92 59"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* diver — limbs/body as round-capped strokes, head + fin + bubbles filled */}
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M40 47 L57 42.5" strokeWidth="9.5" />
          <path d="M42 47 L32 52 L24 56" strokeWidth="6" />
          <path d="M53 45.5 L66 51" strokeWidth="3.6" />
          <path d="M50 41.5 L46.5 35.5" strokeWidth="4.6" />
        </g>
        <g fill="currentColor">
          <circle cx="62" cy="39.5" r="5.2" />
          <rect x="64.4" y="38" width="4.2" height="3.2" rx="1.2" />
          <path d="M23 56 l-7 1 1.5 5 7 -2 z" />
          <circle cx="70" cy="33" r="1.9" />
          <circle cx="74" cy="28.6" r="1.4" />
          <circle cx="77" cy="25" r="1" />
        </g>
      </svg>
    </span>
  );
}
