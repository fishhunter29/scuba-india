import Link from 'next/link';

// The four reefs we dive, with typical maximum depths (fixed dive-site facts).
// This is a "where you'll dive" showcase — pricing lives in Packages / /prices.
const SITES: { key: string; name: string; level: string; blurb: string; depth: number; image: string }[] = [
  {
    key: 'tribe',
    name: 'Tribe Gate',
    depth: 12,
    level: 'Beginner-friendly',
    image: '/images/reef-tribe',
    blurb: 'Shallow, sunlit coral garden — the easiest first dive. Clownfish, parrotfish and grazing green turtles.',
  },
  {
    key: 'red',
    name: 'Red Pillar',
    depth: 14,
    level: 'All levels',
    image: '/images/reef-red',
    blurb: 'Coral pillars alive with fusiliers and angelfish — our most colourful, best-value reef.',
  },
  {
    key: 'light',
    name: 'Lighthouse',
    depth: 18,
    level: 'Confident divers',
    image: '/images/reef-light',
    blurb: 'Deeper water, bigger fish — snapper schools, groupers and the odd reef shark in the blue.',
  },
  {
    key: 'turtle',
    name: 'Turtle Beach',
    depth: 16,
    level: 'All levels',
    image: '/images/reef-turtle',
    blurb: 'Green sea turtles grazing the seagrass, rays over the sand — unhurried and life-rich.',
  },
];

export default function DiveSites() {
  const sites = SITES;
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
              We dive Havelock&apos;s (Swaraj Dweep&apos;s) healthiest sites and match each to your
              experience — gentle shallow coral for your first breath, deeper drifts for the
              certified. Warm water 27–30°C, visibility 15–25m.
            </p>
            <p>Depths shown are typical maximums. Conditions are calmest October through May.</p>
            <p className="sites-cross">
              Not sure which dive suits you? Start with{' '}
              <Link href="/#experiences">the ways to dive</Link>, then{' '}
              <Link href="/#packages">book your reef</Link>.
            </p>
          </div>
          <div className="depth-chart reveal">
            {sites.map((s) => (
              <div className="depth-item" key={s.name}>
                <span className="depth-thumb">
                  <picture>
                    <source type="image/webp" srcSet={`${s.image}.webp`} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${s.image}.jpg`} alt={`${s.name} reef, Havelock`} loading="lazy" decoding="async" />
                  </picture>
                </span>
                <div className="depth-main">
                  <span className="name">{s.name}</span>
                  <div className="depth-bar">
                    <span className="depth-fill" data-depth={pct(s.depth)} />
                  </div>
                  <span className="m">{s.depth}m</span>
                  <span className="site-level">{s.level}</span>
                  <span className="site-blurb">{s.blurb}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
