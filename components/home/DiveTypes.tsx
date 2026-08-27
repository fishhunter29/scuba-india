import Link from 'next/link';
import type { Dive, DiveKind } from '@/lib/types';
import { inferDiveKind } from '@/lib/types';
import { DIVE_CATEGORIES } from '@/lib/categories';

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

type IconName = 'try' | 'boat' | 'fun' | 'night' | 'snorkel' | 'island' | 'reef';

function TypeIcon({ icon }: { icon: IconName }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (icon) {
    case 'try': // mask + bubbles
      return (
        <svg {...common}>
          <path d="M4 9.5A2.5 2.5 0 0 1 6.5 7h11A2.5 2.5 0 0 1 20 9.5v2A3.5 3.5 0 0 1 16.5 15h-.7a2 2 0 0 1-1.7-1l-.5-.8a1.8 1.8 0 0 0-3.2 0l-.5.8a2 2 0 0 1-1.7 1h-.7A3.5 3.5 0 0 1 4 11.5Z" />
          <path d="M18 17c0 1-1 1.6-1 2.6M15 18.5c0 .8-.8 1.2-.8 2" />
        </svg>
      );
    case 'boat':
      return (
        <svg {...common}>
          <path d="M3 15.5h18l-2 3.5H5Z" />
          <path d="M6 15.5V8l7 3.5-7 4M13 11.5V5l4 6.5" />
        </svg>
      );
    case 'fun': // fish
      return (
        <svg {...common}>
          <path d="M3 12c3-4 8-4 11 0-3 4-8 4-11 0Z" />
          <path d="M14 12c1.5-2 4-3 7-3-1 2-1 4 0 6-3 0-5.5-1-7-3Z" />
          <circle cx="7" cy="11.5" r=".6" fill="currentColor" />
        </svg>
      );
    case 'night': // moon
      return (
        <svg {...common}>
          <path d="M20 14.5A7.5 7.5 0 1 1 10 5a6 6 0 0 0 10 9.5Z" />
          <path d="M16 5.5v2M15 6.5h2" />
        </svg>
      );
    case 'snorkel':
      return (
        <svg {...common}>
          <path d="M4 9h9a2 2 0 0 1 2 2v.5a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 10 11.5" />
          <path d="M4 9v6a2 2 0 0 0 2 2M17 7v9a2.5 2.5 0 0 1-2.5 2.5H13" />
        </svg>
      );
    case 'island':
      return (
        <svg {...common}>
          <path d="M3 19c1.5 1 3 1 4.5 0S10.5 18 12 19s3 1 4.5 0S19.5 18 21 19" />
          <path d="M12 15c-3 0-5-1-5-1s2-5 5-5 5 5 5 5-2 1-5 1Z" />
          <path d="M12 9V5M12 5c-1.2 0-2 .6-2 1.4M12 5c1.2 0 2 .6 2 1.4" />
        </svg>
      );
    case 'reef': // coral
      return (
        <svg {...common}>
          <path d="M4 20c0-3 1.5-4.5 1.5-7M9 20c0-4 1-6 1-9M15 20c0-4-1-6-1-9M20 20c0-3-1.5-4.5-1.5-7" />
          <path d="M5.5 13c-1 -1.2 -1.2 -2.6 -.4 -3.6M10 11c-1.2-1-1.6-2.4-1-3.8M14 11c1.2-1 1.6-2.4 1-3.8M18.5 13c1-1.2 1.2-2.6.4-3.6" />
          <path d="M2.5 20h19" />
        </svg>
      );
  }
}

// One card per real category — the same five that are in the nav and have their
// own pages, so browsing here matches the site structure exactly.
export default function DiveTypes({ dives }: { dives: Dive[] }) {
  const fromPrice = (kinds: DiveKind[]): number | null => {
    const prices = dives
      .filter(
        (d) => d.active !== false && kinds.includes(inferDiveKind(d)) && !d.on_request && d.price != null,
      )
      .map((d) => d.price as number);
    return prices.length ? Math.min(...prices) : null;
  };

  const cards = [
    ...DIVE_CATEGORIES.map((c) => ({
      key: c.slug,
      href: `/dives/${c.slug}`,
      name: c.nav,
      icon: c.icon as IconName,
      entry: c.entry,
      hook: c.hook,
      detail: c.tagline,
      audience: c.audience,
      image: c.card,
      from: fromPrice(c.kinds),
    })),
    {
      key: 'reefs',
      href: '/reefs',
      name: 'Reef Dives',
      icon: 'reef' as IconName,
      entry: 'boat / shore',
      hook: 'Four reefs, matched to your level — pick where you dive.',
      detail:
        'Tribe Gate, Red Pillar, Lighthouse and Turtle Beach — shallow coral gardens through to deeper water with bigger fish. Explore each reef, its marine life and what it costs.',
      audience: 'Beginner to certified',
      image: '/images/reef-red',
      from: null,
    },
  ];

  return (
    <section className="band divetypes" id="experiences">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">Ways to dive</div>
          <h2>Find your way into the water</h2>
          <p>
            However you like to dive — your very first breath from the beach, a boat out to quieter
            reefs, or a day on the water without a tank. Pick a category to explore it, or see the{' '}
            <Link href="/prices">full price list</Link>.
          </p>
        </div>

        <div className="dt-grid reveal">
          {cards.map((c) => (
            <Link href={c.href} className="dt-card" key={c.key}>
              <span className="dt-photo">
                <picture>
                  <source type="image/webp" srcSet={`${c.image}.webp`} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${c.image}.jpg`} alt={`${c.name} — Havelock`} loading="lazy" decoding="async" />
                </picture>
                <span className="dt-icon">
                  <TypeIcon icon={c.icon} />
                </span>
                <span className="dt-entry">{c.entry}</span>
              </span>
              <div className="dt-body">
                <h3>{c.name}</h3>
                <p className="dt-hook">{c.hook}</p>
                <p className="dt-detail">{c.detail}</p>
                <div className="dt-foot">
                  <span className="dt-aud">{c.audience}</span>
                  {c.from != null ? (
                    <span className="dt-price">
                      <span className="dt-from">from</span> {inr(c.from)}
                    </span>
                  ) : (
                    <span className="dt-price dt-explore">Explore →</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="dt-note reveal">
          All prices are for direct bookings — message us to confirm current rates and availability.
        </p>
      </div>
    </section>
  );
}
