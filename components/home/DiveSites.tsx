import type { Dive } from '@/lib/types';

// Distinct physical dive sites (one row each) with their typical max depth.
function sitesFromDives(dives: Dive[]) {
  const order: { key: string; name: string }[] = [
    { key: 'tribe', name: 'Tribe Gate' },
    { key: 'red', name: 'Red Pillar' },
    { key: 'light', name: 'Lighthouse' },
    { key: 'turtle', name: 'Turtle Beach' },
  ];
  return order
    .map((o) => {
      const d = dives.find((x) => x.site_key === o.key && x.depth_m != null);
      return d ? { name: o.name, depth: d.depth_m as number } : null;
    })
    .filter(Boolean) as { name: string; depth: number }[];
}

export default function DiveSites({ dives }: { dives: Dive[] }) {
  const sites = sitesFromDives(dives);
  // Bar fill scaled against a 25m visual maximum (matches prototype proportions).
  const pct = (d: number) => Math.round((d / 25) * 100);

  return (
    <section className="band sites" id="sites">
      <div className="wrap">
        <div className="site-row">
          <div className="sites-copy reveal">
            <div className="sec-eyebrow">Where you&apos;ll dive</div>
            <h2>Four reefs. Every level of diver.</h2>
            <p>
              We dive Havelock&apos;s healthiest sites and match each to your experience — gentle
              shallow coral to deeper drifts for the certified.
            </p>
            <p>Depths shown are typical maximums. Conditions are calmest October through May.</p>
          </div>
          <div className="depth-chart reveal">
            {sites.map((s) => (
              <div className="depth-item" key={s.name}>
                <span className="name">{s.name}</span>
                <div className="depth-bar">
                  <span className="depth-fill" data-depth={pct(s.depth)} />
                </div>
                <span className="m">{s.depth}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
