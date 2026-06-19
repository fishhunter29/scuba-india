// Brand mark: the "diver down" flag (red field + white diagonal stripe) — the
// universal scuba symbol, on-brand with the vermilion accent. Replaces the old
// "SI" monogram across nav / footer / admin.
export function Seal({ size = 30 }: { size?: number }) {
  return (
    <span className="seal" aria-hidden="true" style={{ width: size, height: size }}>
      <svg viewBox="0 0 30 30" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <polygon points="1.5,9 9,1.5 28.5,21 21,28.5" fill="#EAF4F4" />
      </svg>
    </span>
  );
}
