'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Dive, SiteKey } from '@/lib/types';
import { SITE_TABS, SITE_INTRO } from '@/lib/types';
import { formatPrice, diveDuration } from '@/lib/format';

const FEAT_TIERS = ['Premium', 'Premium+', 'Signature', 'Certified'];

function tierLabel(tier: string | null): string | null {
  if (!tier) return null;
  return tier.toUpperCase();
}

export default function Packages({ grouped }: { grouped: Record<SiteKey, Dive[]> }) {
  const tabs = SITE_TABS.filter((t) => grouped[t.key]?.length);
  const [active, setActive] = useState<SiteKey>(tabs[0]?.key ?? 'tribe');

  return (
    <section className="band packages" id="packages">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">Dives &amp; Packages</div>
          <h2>Every dive we offer in Havelock</h2>
          <p>
            Choose a dive site to see its packages. All include pickup &amp; drop within 5km, plus
            HD photos and GoPro video unless noted.
          </p>
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
              {t.depth && <span className="tab-depth">{t.depth}</span>}
            </button>
          ))}
        </div>
        <div className="pk-note reveal">
          Prices are per person. Premium tiers include longer dives and more footage.
        </div>

        {tabs.map((t) => {
          const intro = SITE_INTRO[t.key];
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
                      {d.tier && <span className="tier">{tierLabel(d.tier)}</span>}
                      <span className="dur">{diveDuration(d)}</span>
                      <h4>{d.name}</h4>
                      <ul>
                        {d.photos > 0 && (
                          <li>
                            {d.photos} photos + {d.gopro_min} min GoPro
                          </li>
                        )}
                        <li>Pickup &amp; drop within 5km</li>
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
