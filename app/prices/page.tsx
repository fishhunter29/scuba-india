import type { Metadata } from 'next';
import Link from 'next/link';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSettings } from '@/lib/data';
import { getGoogleReviews, withLiveRating } from '@/lib/google-reviews';
import { PRICE_LIST } from '@/lib/pricelist';
import { waLink } from '@/lib/whatsapp';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

const title = 'Price List — Scuba Diving & PADI Courses in Havelock (Swaraj Dweep)';
const description =
  'Full price list for Discover Scuba dives, PADI courses, course combos, fun dives, boat charters and island hopping with Scuba India, Havelock Island, Andaman.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/prices` },
  openGraph: { title, description, url: `${SITE_URL}/prices`, type: 'website' },
};

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function PricesPage() {
  const [rawSettings, google] = await Promise.all([getSettings(), getGoogleReviews()]);
  const settings = withLiveRating(rawSettings, google);
  const wa = settings.whatsapp;

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
              Every dive, course and experience we offer in Havelock (Swaraj Dweep), with prices.
              Discover Scuba dives include HD photos and video, free — no experience needed.
            </p>
            <div className="pl-trust">
              <span><CheckIcon /> HD photos &amp; video included</span>
              <span><CheckIcon /> PADI-certified instructors</span>
              <span><CheckIcon /> No experience needed for beginners</span>
              <span><CheckIcon /> No hidden charges</span>
            </div>

            {/* quick jump */}
            <div className="pl-jump" role="navigation" aria-label="Jump to section">
              {PRICE_LIST.map((s) => (
                <a key={s.id} href={`#${s.id}`}>{s.title}</a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Price sections ── */}
        <div className="detail-body" style={{ paddingTop: 0 }}>
          <div className="wrap">
            {PRICE_LIST.map((section) => (
              <section key={section.id} id={section.id} className="pl-site">
                <header className="pl-site-header">
                  <h2 className="pl-site-name">{section.title}</h2>
                  {section.subtitle && <span className="pl-site-meta">{section.subtitle}</span>}
                </header>

                <div className="pl-table">
                  {section.items.map((item) => (
                    <div className="pl-row" key={item.name}>
                      <div className="pl-col-name">
                        <span className="pl-name-link" style={{ cursor: 'default' }}>{item.name}</span>
                      </div>
                      {item.sub ? <div className="pl-col-incl">{item.sub}</div> : <div className="pl-col-incl" />}
                      <div className="pl-col-price">
                        {item.unit && <span className="pl-unit">{item.unit} </span>}
                        {inr(item.price)}
                      </div>
                      <div className="pl-col-book">
                        <a
                          href={waLink(wa, `Hi Scuba India, I'd like to book: ${item.name} (${inr(item.price)}).`)}
                          className="pl-book-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Book →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {section.note && <p className="pl-courses-note">{section.note}</p>}
              </section>
            ))}

            {/* ── Footer note ── */}
            <div className="pl-footer-note">
              <p>
                All prices are in Indian Rupees (INR). Prices may vary during peak season and for
                larger groups — message us to confirm availability and current rates.
              </p>
              <a
                href={waLink(wa, 'Hi Scuba India, I have a question about your prices.')}
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
