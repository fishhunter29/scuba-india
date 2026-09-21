'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Dive, DiveKind, Reef as DbReef } from '@/lib/types';
import { reefPackage } from '@/lib/reefs';
import { formatPrice, reefImage } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

type Reef = {
  key: string;
  name: string;
  depth: number;
  level: string;
  bestFor: string;
  blurb: string;
  image: string | null;
  imgKey: string;
  life: string[];
  kinds: DiveKind[]; // dive types offered here (priced from the rate sheet)
  price?: number | null; // admin override; blank => the rate-sheet dive price
  durationLabel?: string | null;
};

const REEFS: Reef[] = [
  { key: 'red', name: 'Red Pillar', depth: 12, level: 'All levels', bestFor: 'First dives',
    image: '/images/gallery/g28', imgKey: 'red', price: 3000, durationLabel: null,
    blurb: 'Standing coral pillars wrapped in clouds of reef fish — our most colourful and best-value site, brilliant on every dive.',
    life: ['Ruby snapper', 'Fusiliers', 'Coral pillars', 'Moray eels'], kinds: ['discover', 'fun'] },
  { key: 'tribe', name: 'Tribe Gate', depth: 12, level: 'All levels', bestFor: 'First dives',
    image: '/images/gallery/g29', imgKey: 'tribe', price: 3500, durationLabel: null,
    blurb: 'A shallow, sunlit coral garden in calm, sheltered water — the easiest place to take your very first breath underwater.',
    life: ['Clownfish', 'Parrotfish', 'Green turtles', 'Coral gardens'], kinds: ['discover', 'fun'] },
  { key: 'purple', name: 'Purple Ledge', depth: 12, level: 'All levels', bestFor: 'Boat dives & photography',
    image: '/images/gallery/g17', imgKey: 'purple', price: 4000, durationLabel: null,
    blurb: 'A ledge carpeted in soft corals that glow purple in the afternoon light — the most photogenic reef we dive, and calm enough for a first dive.',
    life: ['Soft corals', 'Lionfish', 'Sea fans', 'Nudibranchs'], kinds: ['discover', 'fun'] },
  { key: 'light', name: 'Lighthouse', depth: 12, level: 'All levels', bestFor: 'Bigger fish',
    image: '/images/gallery/g26', imgKey: 'light', price: 4500, durationLabel: null,
    blurb: 'More open water with bigger fish — trevally hunting through the blue, schooling snapper and moorish idols over the rocky reef.',
    life: ['Trevally', 'Moorish idols', 'Snapper schools', 'Groupers'], kinds: ['discover', 'fun'] },
  { key: 'slope', name: 'Slope', depth: 12, level: 'All levels', bestFor: 'Boat dives',
    image: '/images/gallery/g25', imgKey: 'slope', price: 4500, durationLabel: null,
    blurb: 'A gentle sloping reef that rewards a slow look — cleaning stations working away, and plenty going on in the small stuff.',
    life: ['Mantis shrimp', 'Batfish', 'Cleaning stations', 'Staghorn coral'], kinds: ['discover', 'fun'] },
  { key: 'juvis', name: "Juvi's", depth: 12, level: 'All levels', bestFor: 'Bigger encounters',
    image: '/images/gallery/g27', imgKey: 'juvis', price: 5000, durationLabel: null,
    blurb: 'Big coral heads with white-tip reef sharks resting up under the ledges — the reef to pick if you are hoping to meet something larger.',
    life: ['White-tip reef sharks', 'Potato coral', 'Moorish idols'], kinds: ['discover', 'fun'] },
  { key: 'aquarium', name: 'Aquarium', depth: 12, level: 'All levels', bestFor: 'Boat dives & snorkelling',
    image: '/images/gallery/g08', imgKey: 'aquarium', price: 6500, durationLabel: null,
    blurb: 'Coral bommies rising from clean sand, with so much fish in the water column that you swim through the schools rather than towards them.',
    life: ['Snapper schools', 'Fusiliers', 'Damselfish', 'Coral bommies'], kinds: ['discover', 'fun'] },
  { key: 'turtle', name: 'Turtle Beach', depth: 12, level: 'All levels', bestFor: 'Turtle encounters',
    image: '/images/gallery/g06', imgKey: 'turtle', price: 7500, durationLabel: null,
    blurb: 'Green sea turtles grazing the seagrass and rays gliding over the sand — an unhurried, wonderfully life-rich reef.',
    life: ['Green turtles', 'Stingrays', 'Seagrass beds', 'Hard coral'], kinds: ['discover', 'fun'] },
];

const MAX_DEPTH = 25; // visual scale for the depth bar

export default function ReefExplorer({
  whatsapp,
  dives = [],
  reefs = [],
  showHeading = true,
}: {
  whatsapp?: string;
  dives?: Dive[];
  reefs?: DbReef[];
  showHeading?: boolean;
}) {
  // Reefs come from admin; fall back to the built-in four before migration 0019.
  const list: Reef[] = reefs.length
    ? reefs.map((x) => ({
        key: x.key,
        name: x.name,
        depth: x.depth_m,
        level: x.level,
        bestFor: x.best_for ?? '',
        blurb: x.blurb ?? '',
        image: x.image_url,
        imgKey: x.key,
        life: Array.isArray(x.life) ? x.life : [],
        kinds: (Array.isArray(x.kinds) ? x.kinds : []) as DiveKind[],
        price: x.price ?? null,
        durationLabel: x.duration_label ?? null,
      }))
    : REEFS;
  const [active, setActive] = useState(0);
  const r = list[Math.min(active, list.length - 1)];
  const COUNT_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const countWord = COUNT_WORDS[list.length] ?? String(list.length);
  const pkg = reefPackage({ kinds: r.kinds, price: r.price ?? null, duration_label: r.durationLabel ?? null }, dives);

  return (
    <section className="band sites" id="sites">
      <div className="wrap">
        {showHeading && (
          <div className="sec-head reveal" style={{ maxWidth: 620 }}>
            <div className="sec-eyebrow">Where you&apos;ll dive</div>
            <h2>{countWord} reefs. Every level of diver.</h2>
            <p>
              We dive Havelock&apos;s (Swaraj Dweep&apos;s) healthiest sites and match each to you —
              gentle shallow coral for your first breath, deeper drifts for the certified. Warm
              water 27–30°C, visibility 15–25m. Tap a reef to explore it.
            </p>
          </div>
        )}

        <div className="reef-explorer reveal">
          {/* Feature panel — the selected reef */}
          <div className="reef-feature" key={r.key}>
            <div className="reef-feature-img">
              <picture>
                {reefImage(r.image, r.imgKey).webp && (
                  <source type="image/webp" srcSet={reefImage(r.image, r.imgKey).webp!} />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={reefImage(r.image, r.imgKey).src} alt={`${r.name} reef, Havelock`} decoding="async" />
              </picture>
              <div className="reef-feature-badges">
                <span className="reef-badge reef-badge-depth">{r.depth}m max</span>
                <span className="reef-badge reef-badge-level">{r.level}</span>
              </div>
              <h3 className="reef-feature-name">{r.name}</h3>
            </div>

            <div className="reef-feature-body">
              <div className="reef-depthbar" aria-hidden="true">
                <span
                  className="reef-depthbar-fill"
                  style={{ width: `${Math.round((r.depth / MAX_DEPTH) * 100)}%` }}
                />
              </div>
              <p className="reef-blurb">{r.blurb}</p>

              <div className="reef-see">
                <span className="reef-see-label">What you&apos;ll see</span>
                <ul className="reef-tags">
                  {r.life.map((l) => (
                    <li className="reef-tag" key={l}>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>

              {/* one package per reef — priced from the rate sheet */}
              <div className="reef-pkg">
                <span className="reef-see-label">Your dive at {r.name}</span>
                <div className="reef-pkg-row">
                  <div className="reef-pkg-what">
                    <span className="reef-pkg-name">{pkg.name}</span>
                    <span className="reef-pkg-dur">
                      {pkg.badge} · {pkg.duration}
                    </span>
                  </div>
                  <span className="reef-pkg-price">
                    {formatPrice(pkg.price, pkg.price == null)}
                    <small>{pkg.price == null ? 'contact us' : pkg.unit}</small>
                  </span>
                </div>
              </div>

              <div className="reef-cta-row">
                <a
                  className="btn btn-primary"
                  href={waLink(
                    whatsapp || '',
                    `Hi Scuba India, I'd like to dive at ${r.name}${pkg.price != null ? ` — ${pkg.name} (₹${pkg.price.toLocaleString('en-IN')})` : ''}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book {r.name} on WhatsApp →
                </a>
                <Link href="/prices" className="reef-cta-secondary">
                  Compare all dives
                </Link>
              </div>
            </div>
          </div>

          {/* Selector — every reef */}
          <div className="reef-selectors" role="tablist" aria-label="Choose a reef">
            {list.map((reef, i) => (
              <button
                key={reef.key}
                role="tab"
                aria-selected={i === active}
                className={`reef-sel${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="reef-sel-thumb">
                  <picture>
                    {reefImage(reef.image, reef.imgKey).webp && (
                      <source type="image/webp" srcSet={reefImage(reef.image, reef.imgKey).webp!} />
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={reefImage(reef.image, reef.imgKey).src} alt="" loading="lazy" decoding="async" />
                  </picture>
                </span>
                <span className="reef-sel-text">
                  <span className="reef-sel-name">{reef.name}</span>
                  <span className="reef-sel-meta">{reef.depth}m · {reef.level}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
