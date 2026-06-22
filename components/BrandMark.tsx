// Brand mark: the Scuba India circular badge (white disc with the navy diver),
// extracted from logo.png. Self-contained, so it reads on light and dark.
// Paired with the "Scuba India" wordmark set in Shippori Mincho beside it.
export function Seal({ size = 40 }: { size?: number }) {
  return (
    <span className="seal" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-badge.png" alt="" width={size} height={size} loading="eager" />
    </span>
  );
}
