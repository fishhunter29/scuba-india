'use client';

import { useState } from 'react';
import Link from 'next/link';
import { waLink } from '@/lib/whatsapp';

type Reef = {
  key: string;
  name: string;
  depth: number;
  level: string;
  bestFor: string;
  blurb: string;
  image: string;
  life: string[];
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
  },
];

const MAX_DEPTH = 25; // visual scale for the depth bar

export default function ReefExplorer({ whatsapp }: { whatsapp?: string }) {
  const [active, setActive] = useState(0);
  const r = REEFS[active];

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

              <p className="reef-best">
                <span>Best for</span> {r.bestFor}
              </p>

              <div className="reef-cta-row">
                <a
                  className="btn btn-primary"
                  href={waLink(whatsapp || '', `Hi Scuba India, I'd like to dive at ${r.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dive at {r.name} →
                </a>
                <Link href="/#packages" className="reef-cta-secondary">
                  See all dives &amp; prices
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
