// Decorative, colourful SVG coral/fish accents for the dive detail pages
// (SPEC §5.2 — "colourful SVG coral/fish accents", no heavy animation).

export function CoralBand() {
  return (
    <div className="reef-band" aria-hidden="true">
      <svg viewBox="0 0 1200 90" preserveAspectRatio="xMidYMax slice" width="100%" height="100%">
        <g fill="none">
          {/* sea floor coral silhouettes */}
          <path d="M0 90 Q40 50 70 90 Q90 55 120 90 Z" fill="#1f8f86" />
          <path d="M140 90 Q170 40 200 90 Q220 60 250 90 Z" fill="#e07a5f" />
          <path d="M300 90 Q330 48 360 90 Q380 58 410 90 Z" fill="#f2a541" />
          <path d="M470 90 Q500 44 530 90 Q555 56 585 90 Z" fill="#1f8f86" />
          <path d="M640 90 Q670 50 700 90 Q725 58 755 90 Z" fill="#e07a5f" />
          <path d="M820 90 Q850 42 880 90 Q905 56 935 90 Z" fill="#3d9bc9" />
          <path d="M980 90 Q1010 48 1040 90 Q1065 58 1095 90 Z" fill="#f2a541" />
          <path d="M1120 90 Q1150 50 1180 90 Z" fill="#1f8f86" />
        </g>
        {/* little fish */}
        <g opacity="0.9">
          <path d="M210 30 l16 -7 v14 z" fill="#fff" />
          <circle cx="214" cy="30" r="2" fill="#1B1A17" />
          <path d="M560 22 l14 -6 v12 z" fill="#ffd9a0" />
          <path d="M900 34 l16 -7 v14 z" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

export function FishIcon({ color = '#e07a5f' }: { color?: string }) {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" aria-hidden="true">
      <path d="M2 10 C6 2, 18 2, 22 10 C18 18, 6 18, 2 10 Z" fill={color} />
      <path d="M22 10 l5 -5 v10 z" fill={color} />
      <circle cx="8" cy="9" r="1.6" fill="#fff" />
    </svg>
  );
}

export function CoralIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <path
        d="M17 32 V20 M17 24 C12 22 11 16 13 12 M17 22 C22 20 23 14 21 10 M17 18 C15 14 17 9 17 5"
        stroke="#1f8f86"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="13" cy="11" r="2.5" fill="#e07a5f" />
      <circle cx="21" cy="9" r="2.5" fill="#f2a541" />
      <circle cx="17" cy="5" r="2.5" fill="#3d9bc9" />
    </svg>
  );
}
