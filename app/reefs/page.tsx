import type { Metadata } from 'next';
import Link from 'next/link';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PageBanner from '@/components/PageBanner';
import ReefExplorer from '@/components/home/ReefExplorer';
import { getDives, getSettings } from '@/lib/data';
import { getGoogleReviews, withLiveRating } from '@/lib/google-reviews';
import { DIVE_CATEGORIES, REEF_CATEGORY } from '@/lib/categories';
import { waLink } from '@/lib/whatsapp';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

export const metadata: Metadata = {
  title: REEF_CATEGORY.seoTitle,
  description: REEF_CATEGORY.seoDescription,
  alternates: { canonical: `${SITE_URL}/reefs` },
  openGraph: {
    title: REEF_CATEGORY.seoTitle,
    description: REEF_CATEGORY.seoDescription,
    url: `${SITE_URL}/reefs`,
    type: 'website',
  },
};

export default async function ReefsPage() {
  const [dives, rawSettings, google] = await Promise.all([
    getDives(),
    getSettings(),
    getGoogleReviews(),
  ]);
  const settings = withLiveRating(rawSettings, google);

  return (
    <>
      <InkBackground />
      <ScrollFX />
      <Nav />

      <main className="detail has-banner">
        <PageBanner image="/images/reef-red" alt="Coral reef in Havelock, Andaman" />

        <section className="detail-hero">
          <div className="wrap">
            <Link href="/" className="detail-back">← Back to home</Link>
            <div className="detail-eyebrow">Where you&apos;ll dive</div>
            <h1>Four reefs. Every level of diver.</h1>
            <p className="detail-pitch">
              We dive Havelock&apos;s (Swaraj Dweep&apos;s) healthiest sites and match each to you —
              gentle shallow coral for your first breath, deeper drifts for the certified. Warm
              water 27–30°C, visibility 15–25m. Tap a reef below to explore it and book.
            </p>
            <div className="cat-meta">
              <span>4 reefs · 12–18 m</span>
              <span>Beginner to certified</span>
              <span>Calmest October–May</span>
            </div>
          </div>
        </section>

        <div className="detail-body" style={{ paddingTop: 0 }}>
          <ReefExplorer whatsapp={settings.whatsapp} dives={dives} showHeading={false} />

          <div className="wrap">
            <div className="cat-more">
              <h2>Choose how you want to dive</h2>
              <div className="cat-more-grid">
                {DIVE_CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/dives/${c.slug}`} className="cat-more-card">
                    <span className="cat-more-name">{c.nav}</span>
                    <span className="cat-more-aud">{c.audience}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pl-footer-note">
              <p>
                Which reef you dive is chosen on the day to suit conditions and your level — we
                always pick the best water available. Message us and we&apos;ll advise.
              </p>
              <a
                href={waLink(settings.whatsapp, 'Hi Scuba India, which reef would suit me best?')}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask us on WhatsApp →
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
