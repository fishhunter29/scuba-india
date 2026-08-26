import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PageBanner from '@/components/PageBanner';
import CategoryDives from '@/components/CategoryDives';
import JsonLd from '@/components/JsonLd';
import { getDives, getSettings } from '@/lib/data';
import { getGoogleReviews, withLiveRating } from '@/lib/google-reviews';
import { DIVE_CATEGORIES, getCategory } from '@/lib/categories';
import { waLink } from '@/lib/whatsapp';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const revalidate = 60;

export function generateStaticParams() {
  return DIVE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = getCategory(params.category);
  if (!cat) return { title: 'Not found' };
  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    alternates: { canonical: `${SITE_URL}/dives/${cat.slug}` },
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDescription,
      url: `${SITE_URL}/dives/${cat.slug}`,
      type: 'website',
    },
  };
}

export default async function DiveCategoryPage({ params }: { params: { category: string } }) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const [dives, rawSettings, google] = await Promise.all([
    getDives(),
    getSettings(),
    getGoogleReviews(),
  ]);
  const settings = withLiveRating(rawSettings, google);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: cat.nav, item: `${SITE_URL}/dives/${cat.slug}` },
    ],
  };

  return (
    <>
      <InkBackground />
      <ScrollFX />
      <Nav />

      <main className="detail has-banner">
        <PageBanner image={cat.banner} alt={`${cat.nav} with ${SITE_NAME}, Havelock`} />

        <section className="detail-hero">
          <div className="wrap">
            <Link href="/" className="detail-back">← Back to home</Link>
            <div className="detail-eyebrow">{cat.eyebrow}</div>
            <h1>{cat.title}</h1>
            <p className="detail-pitch">{cat.tagline}</p>
            <div className="cat-meta">
              <span>{cat.audience}</span>
              <span>PADI-certified instructors</span>
              <span>Free pickup &amp; drop within 5 km</span>
            </div>
          </div>
        </section>

        <div className="detail-body" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <CategoryDives category={cat} dives={dives} whatsapp={settings.whatsapp} />

            {/* cross-links to the other categories — keeps people exploring */}
            <div className="cat-more">
              <h2>Other ways to dive with us</h2>
              <div className="cat-more-grid">
                {DIVE_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
                  <Link key={c.slug} href={`/dives/${c.slug}`} className="cat-more-card">
                    <span className="cat-more-name">{c.nav}</span>
                    <span className="cat-more-aud">{c.audience}</span>
                  </Link>
                ))}
                <Link href="/reefs" className="cat-more-card">
                  <span className="cat-more-name">Reef Dives</span>
                  <span className="cat-more-aud">The four reefs we dive</span>
                </Link>
              </div>
            </div>

            <div className="pl-footer-note">
              <p>
                Prices are per person unless noted and apply to direct bookings. Message us to
                confirm availability, group rates and pickup.
              </p>
              <a
                href={waLink(settings.whatsapp, `Hi Scuba India, I have a question about ${cat.nav}.`)}
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
      <JsonLd data={breadcrumb} />
    </>
  );
}
