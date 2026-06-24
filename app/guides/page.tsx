import type { Metadata } from 'next';
import Link from 'next/link';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getPosts, getSettings } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Dive Guides — Scuba India, Havelock',
  description:
    'Practical guides to diving in Havelock, Andaman — best season to go, what to expect on your first dive, and how to choose a PADI course.',
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default async function GuidesIndexPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);

  return (
    <>
      <InkBackground />
      <div className="section-veil" aria-hidden="true" />
      <ScrollFX />
      <Nav />

      <main className="detail">
        <section className="detail-hero">
          <div className="wrap">
            <div className="detail-eyebrow">Dive Guides</div>
            <h1>Guides to diving in Havelock</h1>
            <p className="detail-pitch">
              Practical, honest answers to the questions divers ask us most — season, first dives,
              and choosing a PADI course.
            </p>
          </div>
        </section>

        <section className="detail-body">
          <div className="wrap">
            {posts.length === 0 ? (
              <div className="panel">
                <p>New guides are on the way — check back soon.</p>
              </div>
            ) : (
              <div className="guides-grid">
                {posts.map((p) => (
                  <Link href={`/guides/${p.slug}`} key={p.id} className="guide-card">
                    <h3>{p.title}</h3>
                    {p.excerpt && <p>{p.excerpt}</p>}
                    <span className="guide-card-link">Read guide →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}
