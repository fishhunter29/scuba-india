import type { Metadata } from 'next';
import Link from 'next/link';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getDives, getCourses, getSettings } from '@/lib/data';
import { getGoogleReviews, withLiveRating } from '@/lib/google-reviews';
import { groupDivesBySite } from '@/lib/data';
import { formatPrice, diveDuration, courseSlug } from '@/lib/format';
import { waBookDive, waCourse, waGeneral } from '@/lib/whatsapp';
import { SITE_TABS, SITE_INTRO } from '@/lib/types';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

const title = 'Price List — Scuba Diving & PADI Courses in Havelock (Swaraj Dweep)';
const description =
  'Full price list for try dives, fun dives, snorkelling and PADI courses with Scuba India, Havelock Island, Andaman. All packages include HD photos, GoPro video and pickup.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/prices` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/prices`,
    type: 'website',
  },
};

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function PricesPage() {
  const [dives, courses, rawSettings, google] = await Promise.all([
    getDives(),
    getCourses(),
    getSettings(),
    getGoogleReviews(),
  ]);
  const settings = withLiveRating(rawSettings, google);
  const grouped = groupDivesBySite(dives);

  return (
    <>
      <InkBackground />
      <div className="section-veil" aria-hidden="true" />
      <ScrollFX />
      <Nav />

      <main className="detail">
        {/* ── Hero ── */}
        <section className="detail-hero">
          <div className="wrap">
            <Link href="/" className="detail-back">← Back to home</Link>
            <div className="detail-eyebrow">Pricing</div>
            <h1>Scuba India price list</h1>
            <p className="detail-pitch">
              Every dive and course we offer in Havelock (Swaraj Dweep), with prices. All try-dive
              packages include free pickup within 5 km, HD photos and GoPro video. No hidden charges.
            </p>
            <div className="pl-trust">
              <span><CheckIcon /> Free pickup &amp; drop within 5 km</span>
              <span><CheckIcon /> HD photos &amp; GoPro video included</span>
              <span><CheckIcon /> PADI-certified instructors</span>
              <span><CheckIcon /> No experience needed for try dives</span>
            </div>
          </div>
        </section>

        {/* ── Dive sites ── */}
        <div className="detail-body" style={{ paddingTop: 0 }}>
          <div className="wrap">

            {SITE_TABS.map((tab) => {
              const siteDives = grouped[tab.key] ?? [];
              if (!siteDives.length) return null;
              const intro = SITE_INTRO[tab.key];
              return (
                <section key={tab.key} className="pl-site">
                  <header className="pl-site-header">
                    <h2 className="pl-site-name">{intro.title}</h2>
                    <span className="pl-site-meta">{intro.meta}</span>
                  </header>

                  <div className="pl-table">
                    {/* header row — desktop only */}
                    <div className="pl-row pl-row-head" aria-hidden="true">
                      <span className="pl-col-name">Package</span>
                      <span className="pl-col-dur">Duration</span>
                      <span className="pl-col-incl">Included</span>
                      <span className="pl-col-price">Price</span>
                      <span className="pl-col-book" />
                    </div>

                    {siteDives.map((dive) => {
                      const dur = diveDuration(dive);
                      const inclParts: string[] = [];
                      if (dive.photos > 0) inclParts.push(`${dive.photos} HD photos`);
                      if (dive.gopro_min > 0) inclParts.push(`${dive.gopro_min} min GoPro`);
                      inclParts.push('Pickup & drop');
                      const incl = inclParts.join(' · ');

                      return (
                        <div className="pl-row" key={dive.id}>
                          <div className="pl-col-name">
                            <Link href={`/${dive.slug}`} className="pl-name-link">
                              {dive.name}
                            </Link>
                            {dive.tier && (
                              <span className="pl-tier">{dive.tier}</span>
                            )}
                          </div>
                          <div className="pl-col-dur">{dur || '—'}</div>
                          <div className="pl-col-incl">{incl}</div>
                          <div className="pl-col-price">
                            {formatPrice(dive.price, dive.on_request)}
                          </div>
                          <div className="pl-col-book">
                            {dive.on_request ? (
                              <a
                                href={waGeneral(settings.whatsapp)}
                                className="pl-book-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Enquire →
                              </a>
                            ) : (
                              <a
                                href={waBookDive(dive, settings.whatsapp)}
                                className="pl-book-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Book →
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* ── PADI Courses ── */}
            {courses.length > 0 && (
              <section className="pl-site">
                <header className="pl-site-header">
                  <h2 className="pl-site-name">PADI Courses</h2>
                  <span className="pl-site-meta">Get certified, for life — internationally recognised</span>
                </header>

                <div className="pl-table">
                  <div className="pl-row pl-row-head" aria-hidden="true">
                    <span className="pl-col-name">Course</span>
                    <span className="pl-col-dur">Duration</span>
                    <span className="pl-col-incl">Depth / Min age</span>
                    <span className="pl-col-price">Price</span>
                    <span className="pl-col-book" />
                  </div>

                  {courses.map((c) => (
                    <div className="pl-row" key={c.id}>
                      <div className="pl-col-name">
                        <Link href={`/courses/${courseSlug(c.name)}`} className="pl-name-link">
                          {c.name}
                        </Link>
                      </div>
                      <div className="pl-col-dur">{c.duration ?? '—'}</div>
                      <div className="pl-col-incl">
                        {c.depth && c.depth !== '—' ? `${c.depth} depth` : ''}
                        {c.depth && c.depth !== '—' && c.min_age ? ' · ' : ''}
                        {c.min_age && c.min_age !== 'None' ? `Age ${c.min_age}` : ''}
                      </div>
                      <div className="pl-col-price">
                        {formatPrice(c.price, c.on_request)}
                      </div>
                      <div className="pl-col-book">
                        <a
                          href={waCourse(c.name, settings.whatsapp)}
                          className="pl-book-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.on_request ? 'Enquire →' : 'Book →'}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="pl-courses-note">
                  Course prices are per person. Message us for available dates and group discounts.
                </p>
              </section>
            )}

            {/* ── Footer note ── */}
            <div className="pl-footer-note">
              <p>
                All prices are in Indian Rupees (INR) and include applicable taxes. Prices may vary
                during peak season. Contact us to confirm availability and current rates.
              </p>
              <a
                href={waGeneral(settings.whatsapp)}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask us anything on WhatsApp →
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}
