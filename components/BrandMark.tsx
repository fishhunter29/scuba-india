// Brand mark: the Scuba India circular badge (diver over the wave fan).
// Paired with the "Scuba India" wordmark set in Shippori Mincho beside it.
export function Seal({ size = 38 }: { size?: number }) {
  return (
    <span className="seal" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-mark.png" alt="Scuba India logo" width={size} height={size} />
    </span>
  );
}
