import type { Dive } from '@/lib/types';

// Short, real descriptor per site — the marine-life hook a first-timer wants.
const SITE_INFO: Record<string, { name: string; blurb: string }> = {
  tribe: {
    name: 'Tribe Gate',
    blurb: 'Shallow, sunlit coral garden — the easiest first dive. Clownfish, parrotfish and grazing green turtles.',
  },
  red: {
    name: 'Red Pillar',
    blurb: 'Coral pillars alive with fusiliers and angelfish — our most colourful, best-value reef.',
  },
  light: {
    name: 'Lighthouse',
    blurb: 'Deeper water, bigger fish — snapper schools, groupers and the odd reef shark in the blue.',
  },
  turtle: {
    name: 'Turtle Beach',
    blurb: 'Green sea turtles grazing the seagrass, rays over the sand — unhurried and life-rich.',
  },
};

function sitesFromDives(dives: Dive[]) {
  const order = ['tribe', 'red', 'light', 'turtle'];
  return order
    .map((key) => {
      const d = dives.find((x) => x.site_key === key && x.depth_m != null);
      return d ? { key, name: SITE_INFO[key].name, blurb: SITE_INFO[key].blurb, depth: d.depth_m as number } : null;
    })
    .filter(Boolean) as { key: string; name: string; blurb: string; depth: number }[];
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
              We dive Havelock&apos;s (Swarajdweep&apos;s) healthiest sites and match each to your
              experience — gentle shallow coral for your first breath, deeper drifts for the
              certified. Warm water 27–30°C, visibility 15–25m.
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
                <span className="site-blurb">{s.blurb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
