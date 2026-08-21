'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Dive, DiveKind } from '@/lib/types';
import { inferDiveKind } from '@/lib/types';
import { waLink } from '@/lib/whatsapp';

// The dive types offered at each reef, priced from the rate sheet (the same
// prices as Packages / the price list — one source of truth). Labels + a
// fallback "from" price for when the live DB has no matching dive yet.
const KIND_LABEL: Record<DiveKind, string> = {
  try_shore: 'Try Dive — shore',
  discover: 'Discover Scuba — boat',
  fun: 'Fun Dive',
  night: 'Night Dive',
  snorkel: 'Snorkelling',
  island: 'Island Hopping',
  charter: 'Private Boat Charter',
};
const KIND_FROM: Record<DiveKind, number> = {
  try_shore: 3500, discover: 3800, fun: 4000, night: 4500, snorkel: 2000, island: 25000, charter: 13500,
};

type Reef = {
  key: string;
  name: string;
  depth: number;
  level: string;
  bestFor: string;
  blurb: string;
  image: string;
  life: string[];
  kinds: DiveKind[]; // dive types offered here (priced from the rate sheet)
};

const REEFS: Reef[] = [
  {
    key: 'tribe',
    name: 'Tribe Gate',
    depth: 12,
    level: 'Beginner-friendly',
    bestFor: 'Discover Scuba & first dives',
    image: '/images/reef-tribe',
    blurb:
      'A shallow, sunlit coral garden in calm, sheltered water — the easiest place to take your very first breath underwater.',
    life: ['Clownfish', 'Parrotfish', 'Green turtles', 'Coral gardens'],
    kinds: ['try_shore', 'discover'],
  },
  {
    key: 'red',
    name: 'Red Pillar',
    depth: 14,
    level: 'All levels',
    bestFor: 'Discover Scuba, fun dives & snorkelling',
    image: '/images/reef-red',
    blurb:
      'Standing coral pillars wrapped in clouds of reef fish — our most colourful and best-value site, brilliant on every dive.',
    life: ['Fusiliers', 'Angelfish', 'Coral pillars', 'Moray eels'],
    kinds: ['try_shore', 'discover', 'snorkel'],
  },
  {
    key: 'light',
    name: 'Lighthouse',
    depth: 18,
    level: 'Confident divers',
    bestFor: 'Fun dives & night dives (certified)',
    image: '/images/reef-light',
    blurb:
      'Deeper, more open water with bigger fish — schooling snapper, groupers and the occasional reef shark cruising the blue.',
    life: ['Snapper schools', 'Groupers', 'Reef sharks', 'Sweetlips'],
    kinds: ['fun', 'night'],
  },
  {
    key: 'turtle',
    name: 'Turtle Beach',
    depth: 16,
    level: 'All levels',
    bestFor: 'Fun dives & turtle encounters',
    image: '/images/reef-turtle',
    blurb:
      'Green sea turtles grazing the seagrass and rays gliding over the sand — an unhurried, wonderfully life-rich reef.',
    life: ['Green turtles', 'Stingrays', 'Seagrass beds', 'Hard coral'],
    kinds: ['discover', 'fun'],
  },
];

const MAX_DEPTH = 25; // visual scale for the depth bar

export default function ReefExplorer({ whatsapp, dives = [] }: { whatsapp?: string; dives?: Dive[] }) {
  const [active, setActive] = useState(0);
  const r = REEFS[active];

  // Cheapest live price for a dive kind (rate sheet, from the DB); fall back to
  // the known rate-sheet figure when the DB has nothing for it yet.
  const fromPrice = (kind: DiveKind): number => {
    const prices = dives
      .filter((d) => d.active !== false && inferDiveKind(d) === kind && !d.on_request && d.price != null)
      .map((d) => d.price as number);
    return prices.length ? Math.min(...prices) : KIND_FROM[kind];
  };

  return (
    <section className="band sites" id="sites">
      <div className="wrap">
        <div className="sec-head reveal" style={{ maxWidth: 620 }}>
          <div className="sec-eyebrow">Where you&apos;ll dive</div>
          <h2>Four reefs. Every level of diver.</h2>
          <p>
            We dive Havelock&apos;s (Swaraj Dweep&apos;s) healthiest sites and match each to you —
            gentle shallow coral for your first breath, deeper drifts for the certified. Warm water
            27–30°C, visibility 15–25m. Tap a reef to explore it.
          </p>
        </div>

        <div className="reef-explorer reveal">
          {/* Feature panel — the selected reef */}
          <div className="reef-feature" key={r.key}>
            <div className="reef-feature-img">
              <picture>
                <source type="image/webp" srcSet={`${r.image}.webp`} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${r.image}.jpg`} alt={`${r.name} reef, Havelock`} decoding="async" />
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

              {/* dives offered at this reef — rate-sheet prices, book from here */}
              <div className="reef-dives">
                <span className="reef-see-label">Dives at {r.name}</span>
                <ul className="reef-dive-list">
                  {r.kinds.map((kind) => {
                    const from = fromPrice(kind);
                    const label = KIND_LABEL[kind];
                    return (
                      <li className="reef-dive" key={kind}>
                        <span className="rd-name">{label}</span>
                        <span className="rd-dots" aria-hidden="true" />
                        <span className="rd-price">
                          <span className="rd-unit">from </span>₹{from.toLocaleString('en-IN')}
                        </span>
                        <a
                          className="rd-book"
                          href={waLink(
                            whatsapp || '',
                            `Hi Scuba India, I'd like to book a ${label} at ${r.name} (from ₹${from.toLocaleString('en-IN')}).`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Book
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="reef-cta-row">
                <a
                  className="btn btn-primary"
                  href={waLink(whatsapp || '', `Hi Scuba India, I'd like to dive at ${r.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enquire about {r.name} →
                </a>
                <Link href="/#packages" className="reef-cta-secondary">
                  Compare all dives
                </Link>
              </div>
            </div>
          </div>

          {/* Selector — the four reefs */}
          <div className="reef-selectors" role="tablist" aria-label="Choose a reef">
            {REEFS.map((reef, i) => (
              <button
                key={reef.key}
                role="tab"
                aria-selected={i === active}
                className={`reef-sel${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="reef-sel-thumb">
                  <picture>
                    <source type="image/webp" srcSet={`${reef.image}.webp`} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${reef.image}.jpg`} alt="" loading="lazy" decoding="async" />
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
