'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Dive, Settings, DiveCategory } from '@/lib/types';
import { CATEGORY_TABS, CATEGORY_INTRO } from '@/lib/types';
import { formatPrice, diveDuration } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

const FEAT_TIERS = ['Premium', 'Premium+', 'Signature', 'Certified'];

function tierLabel(tier: string | null): string | null {
  if (!tier) return null;
  return tier.toUpperCase();
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

export default function Packages({
  grouped,
  settings,
  tryFrom,
}: {
  grouped: Record<DiveCategory, Dive[]>;
  settings: Settings;
  tryFrom: string;
}) {
  const tabs = CATEGORY_TABS.filter((t) => grouped[t.key]?.length);
  const [active, setActive] = useState<DiveCategory>(tabs[0]?.key ?? 'discover');

  // A dive-type card above links to #pk-discover / #pk-fun / #pk-experience —
  // open that tab and glide the section into view (works on first load too).
  useEffect(() => {
    const valid = new Set(tabs.map((t) => t.key));
    const apply = (scroll: boolean) => {
      const m = /^#pk-(discover|fun|experience)$/.exec(window.location.hash);
      if (!m) return;
      const key = m[1] as DiveCategory;
      if (!valid.has(key)) return;
      setActive(key);
      if (scroll) {
        document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    apply(true);
    const onHash = () => apply(true);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="band packages" id="packages">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">Dives &amp; Packages</div>
          <h2>Every dive we offer in Havelock</h2>
          <p>
            Beginner, certified or just along for the ride — pick the kind of dive that suits you.
            All dives include pickup &amp; drop within 5km, plus HD photos and GoPro video unless noted.
          </p>
          <p className="pk-value">
            PADI try dives in Havelock typically start higher — ours start at <b>{tryFrom}</b>, with
            the same certification, the same reefs and free HD photos included. See the{' '}
            <Link href="/prices">full price list</Link>.
          </p>
        </div>

        <div className="pl-direct-note reveal" role="note">
          <strong>Direct-booking rates only.</strong> The prices shown apply when you book with
          Scuba India directly. Booked through a travel agent or operator? Please{' '}
          <a href={waLink(settings.whatsapp, 'Hi Scuba India, I booked through an agent and would like to know my applicable rate.')} target="_blank" rel="noopener noreferrer">contact us</a>{' '}
          for your applicable rate.
        </div>

        <div className="pk-filter reveal" role="tablist">
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
        <div className="pk-note reveal">
          Prices are per person unless noted. Longer packages include more time underwater and more footage.
        </div>

        <div className="pk-trust reveal">
          <span>
            <span className="star">★</span> <b>{settings.rating_avg}</b> ·{' '}
            {settings.review_count > 0 ? settings.review_count : '[XX]'}+ reviews
          </span>
          <span>
            <b>PADI</b> Dive Centre <span className="padi-no">#27122</span>
          </span>
          <span>
            <b>{settings.dives_guided}+</b> dives guided
          </span>
          <span>
            Based in <b>Havelock</b>
          </span>
        </div>

        {tabs.map((t) => {
          const intro = CATEGORY_INTRO[t.key];
          return (
            <div
              key={t.key}
              className={`pk-panel${active === t.key ? ' active' : ''}`}
              data-panel={t.key}
            >
              <div className="pk-site-intro">
                <h3>{intro.title}</h3>
                <span className="pk-site-meta">{intro.meta}</span>
              </div>
              <div className="pk-grid">
                {grouped[t.key].map((d) => {
                  const feat = d.tier ? FEAT_TIERS.includes(d.tier) : false;
                  return (
                    <div key={d.id} className={`pk${feat ? ' feat' : ''}`}>
                      {d.image_url && (
                        <div className="pk-img">
                          <Image
                            src={d.image_url}
                            alt={d.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 280px"
                          />
                        </div>
                      )}
                      {d.tier && <span className="tier">{tierLabel(d.tier)}</span>}
                      <span className="dur">{diveDuration(d)}</span>
                      <h4>{d.name}</h4>
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
                          <small>{d.on_request ? 'contact us' : 'per person'}</small>
                        </span>
                        <Link href={`/${d.slug}`} className="pk-book">
                          {d.on_request ? 'Enquire →' : 'Book →'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
