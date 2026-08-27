'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Dive } from '@/lib/types';
import { inferDiveKind } from '@/lib/types';
import type { DiveCategoryPage } from '@/lib/categories';
import { formatPrice, diveDuration } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

const KIND_IMG: Record<string, string> = {
  try_shore: 'type-tryshore', discover: 'type-dsdboat', fun: 'type-fun',
  night: 'type-night', snorkel: 'type-snorkel', island: 'type-island', charter: 'type-dsdboat',
};
const cardImage = (d: Dive) => d.image_url ?? `/images/${KIND_IMG[inferDiveKind(d)] ?? 'type-dsdboat'}.jpg`;

// Some products are priced per couple / per group rather than per person —
// take the unit from the dive's duration label when it says so.
function priceUnit(d: Dive): string {
  const l = (d.duration_label ?? '').toLowerCase();
  if (l.includes('per couple')) return 'per couple';
  if (l.includes('per group')) return 'per group';
  if (l.includes('private boat')) return 'per boat';
  return 'per person';
}

function CameraIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.3" />
    </svg>
  );
}
function VideoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="6.5" width="13" height="11" rx="1.5" />
      <path d="M16 10.5 21 8v8l-5-2.5Z" />
    </svg>
  );
}
function PickupIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 16V9.5a1 1 0 0 1 1-1h9l4.5 4.5H21a1 1 0 0 1 1 1V16" />
      <path d="M3 16h19" />
      <circle cx="7.5" cy="17.5" r="1.7" />
      <circle cx="17.5" cy="17.5" r="1.7" />
    </svg>
  );
}

export default function CategoryDives({
  category,
  dives,
  whatsapp,
}: {
  category: DiveCategoryPage;
  dives: Dive[];
  whatsapp: string;
}) {
  // Only this category's dives, cheapest-first within the admin sort order.
  const mine = useMemo(
    () =>
      dives
        .filter((d) => d.active !== false && category.kinds.includes(inferDiveKind(d)))
        .sort((a, b) => a.sort - b.sort || (a.price ?? 0) - (b.price ?? 0)),
    [dives, category],
  );

  // Hide tabs that would be empty, and drop the tab bar entirely if only "all"
  // survives — no point showing a single tab.
  const tabs = useMemo(() => {
    const matching = (t: (typeof category.tabs)[number]) =>
      mine.filter((d) => {
        if (t.kinds && !t.kinds.includes(inferDiveKind(d))) return false;
        if (t.nameRe && !new RegExp(t.nameRe).test(d.name)) return false;
        if (t.nameReNot && new RegExp(t.nameReNot).test(d.name)) return false;
        return true;
      });
    return category.tabs.map((t) => ({ ...t, items: matching(t) })).filter((t) => t.items.length > 0);
  }, [mine, category]);

  const [active, setActive] = useState(category.tabs[0]?.key ?? 'all');
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  const list = current?.items ?? mine;

  if (!mine.length) {
    return (
      <div className="cat-empty">
        <p>
          These dives are being updated. Message us on WhatsApp and we&apos;ll send you the current
          options and prices right away.
        </p>
        <a
          className="btn btn-primary"
          href={waLink(whatsapp, `Hi Scuba India, I'd like to know about ${category.nav} options.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ask on WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <>
      {tabs.length > 1 && (
        <div className="pk-filter" role="tablist" aria-label={`${category.nav} options`}>
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={active === t.key}
              className={`pk-tab${active === t.key ? ' active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="pk-grid">
        {list.map((d) => (
          <div className="pk" key={d.id}>
            <div className="pk-img">
              <Image src={cardImage(d)} alt={d.name} fill sizes="(max-width: 768px) 100vw, 300px" />
            </div>
            {d.tier && <span className="tier">{d.tier.toUpperCase()}</span>}
            <span className="dur">{diveDuration(d)}</span>
            <h3 className="pk-name">
              <Link href={`/${d.slug}`}>{d.name}</Link>
            </h3>
            {d.pitch && <p className="pk-pitch">{d.pitch}</p>}
            <ul className="pk-incl">
              {d.photos > 0 && (
                <li>
                  <CameraIcon /> {d.photos} photos
                </li>
              )}
              {d.gopro_min > 0 && (
                <li>
                  <VideoIcon /> {d.gopro_min}min GoPro
                </li>
              )}
              <li>
                <PickupIcon /> Pickup &amp; drop
              </li>
            </ul>
            <div className="pk-foot">
              <span className="pk-price">
                {formatPrice(d.price, d.on_request)}
                <small>{d.on_request ? 'contact us' : priceUnit(d)}</small>
              </span>
              <a
                className="pk-book"
                href={waLink(
                  whatsapp,
                  `Hi Scuba India, I'd like to book the ${d.name}${d.price != null && !d.on_request ? ` (₹${d.price.toLocaleString('en-IN')})` : ''}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {d.on_request ? 'Enquire →' : 'Book on WhatsApp →'}
              </a>
            </div>
            <Link href={`/${d.slug}`} className="pk-more">
              Full details
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
