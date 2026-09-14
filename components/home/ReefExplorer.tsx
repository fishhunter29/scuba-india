'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Dive, DiveKind, Reef as DbReef } from '@/lib/types';
import { inferDiveKind } from '@/lib/types';
import { formatPrice, reefImage } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

type Option = { name: string; price: number | null; onRequest?: boolean; unit?: string };

// Every dive option per type, priced from the rate sheet (same as Packages /
// the price list). Used only when the live DB has nothing for that type yet —
// on the live site the full list comes straight from the database.
const FALLBACK_DIVES: Record<DiveKind, Option[]> = {
  try_shore: [], // legacy — shore entry no longer permitted
  discover: [
    { name: '30-Min Discover Scuba Dive', price: 3800 },
    { name: '45-Min Discover Scuba Dive', price: 4500 },
    { name: '2 × 30-Min Discover Scuba Dives', price: 7500 },
    { name: '30 + 45 Min Discover Scuba Dives', price: 9000 },
  ],
  fun: [
    { name: 'Single Fun Dive', price: 4000 },
    { name: 'Fun Dives — 1 Day, 2 Dives', price: 7500 },
    { name: 'Fun Dives — 2 Days, 4 Dives', price: 14500 },
  ],
  night: [{ name: 'Night Dive', price: 4500 }],
  snorkel: [{ name: 'Open-Sea Snorkelling', price: 2000 }],
  island: [{ name: 'Island Hopping Trip', price: 25000, unit: 'per couple' }],
  charter: [
    { name: 'Boat Charter — 1 Hour', price: 13500 },
    { name: 'Boat Charter — Half Day', price: 45000 },
  ],
};

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
};

const REEFS: Reef[] = [
  {
    key: 'tribe',
    name: 'Tribe Gate',
    depth: 12,
    level: 'Beginner-friendly',
    bestFor: 'Discover Scuba & first dives',
    image: null,
    imgKey: 'tribe',
    blurb:
      'A shallow, sunlit coral garden in calm, sheltered water — the easiest place to take your very first breath underwater.',
    life: ['Clownfish', 'Parrotfish', 'Green turtles', 'Coral gardens'],
    kinds: ['discover'],
  },
  {
    key: 'red',
    name: 'Red Pillar',
    depth: 14,
    level: 'All levels',
    bestFor: 'Discover Scuba, fun dives & snorkelling',
    image: null,
    imgKey: 'red',
    blurb:
      'Standing coral pillars wrapped in clouds of reef fish — our most colourful and best-value site, brilliant on every dive.',
    life: ['Fusiliers', 'Angelfish', 'Coral pillars', 'Moray eels'],
    kinds: ['discover', 'snorkel'],
  },
  {
    key: 'light',
    name: 'Lighthouse',
    depth: 18,
    level: 'Confident divers',
    bestFor: 'Fun dives & night dives (certified)',
    image: null,
    imgKey: 'light',
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
    image: null,
    imgKey: 'turtle',
    blurb:
      'Green sea turtles grazing the seagrass and rays gliding over the sand — an unhurried, wonderfully life-rich reef.',
    life: ['Green turtles', 'Stingrays', 'Seagrass beds', 'Hard coral'],
    kinds: ['discover', 'fun'],
  },
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
      }))
    : REEFS;
  const [active, setActive] = useState(0);
  const r = list[Math.min(active, list.length - 1)];
  const COUNT_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const countWord = COUNT_WORDS[list.length] ?? String(list.length);

  // The full explorable list of dive options at a reef — every priced dive of
  // the reef's types, from the live DB (rate sheet), falling back to the known
  // rate-sheet catalogue when the DB has nothing for that type yet.
  const reefDives = (kinds: DiveKind[]): Option[] => {
    const out: Option[] = [];
    for (const kind of kinds) {
      const fromDb = dives
        .filter((d) => d.active !== false && inferDiveKind(d) === kind && (d.price != null || d.on_request))
        .sort((a, b) => a.sort - b.sort || (a.price ?? 0) - (b.price ?? 0));
      if (fromDb.length) {
        for (const d of fromDb) {
          out.push({
            name: d.name,
            price: d.price,
            onRequest: d.on_request,
            unit: d.duration_label && /per couple|per person/i.test(d.duration_label)
              ? d.duration_label.replace(/·.*$/, '').trim()
              : undefined,
          });
        }
      } else {
        out.push(...FALLBACK_DIVES[kind]);
      }
    }
    return out;
  };

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

              {/* every dive option at this reef — rate-sheet prices, book any one */}
              <div className="reef-dives">
                <span className="reef-see-label">Dives &amp; prices at {r.name}</span>
                <ul className="reef-dive-list">
                  {reefDives(r.kinds).map((d) => (
                    <li className="reef-dive" key={d.name}>
                      <span className="rd-name">{d.name}</span>
                      <span className="rd-dots" aria-hidden="true" />
                      <span className="rd-price">
                        {formatPrice(d.price, d.onRequest)}
                        {d.unit ? <span className="rd-unit"> {d.unit}</span> : null}
                      </span>
                      <a
                        className="rd-book"
                        href={waLink(
                          whatsapp || '',
                          `Hi Scuba India, I'd like to book the ${d.name} at ${r.name}${d.price != null && !d.onRequest ? ` (₹${d.price.toLocaleString('en-IN')})` : ''}.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book
                      </a>
                    </li>
                  ))}
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
