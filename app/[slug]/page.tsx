import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { CoralBand, FishIcon, CoralIcon } from '@/components/ReefAccents';
import { getDiveBySlug, getAllDiveSlugs, getSettings } from '@/lib/data';
import { formatPrice, diveDuration } from '@/lib/format';
import { waBookDive, waGeneral } from '@/lib/whatsapp';
import { diveProductSchema, breadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllDiveSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const dive = await getDiveBySlug(params.slug);
  if (!dive) return { title: 'Dive not found' };
  const title = `${dive.name} — ${dive.site}, Havelock`;
  return {
    title,
    description: dive.pitch || `${dive.name} scuba dive at ${dive.site}, Havelock, Andaman.`,
    alternates: { canonical: `${SITE_URL}/${dive.slug}` },
    openGraph: {
      title,
      description: dive.pitch || '',
      url: `${SITE_URL}/${dive.slug}`,
      type: 'website',
    },
  };
}

export default async function DiveDetailPage({ params }: { params: { slug: string } }) {
  const [dive, settings] = await Promise.all([getDiveBySlug(params.slug), getSettings()]);
  if (!dive) notFound();

  const priceLabel = formatPrice(dive.price, dive.on_request);
  const included: string[] = [];
  if (dive.photos > 0) included.push(`${dive.photos} HD photos`);
  if (dive.gopro_min > 0) included.push(`${dive.gopro_min} min GoPro video`);
  if (dive.train_min) included.push(`${dive.train_min} min in-water training`);
  if (dive.dive_min) included.push(`${dive.dive_min} min guided dive`);
  included.push('Pickup & drop within 5km');
  included.push('All scuba gear & a PADI guide');

  const waBook = waBookDive(dive, settings.whatsapp);

  return (
    <main className="detail">
      <Nav />

      {/* HERO STRIP */}
      <section className="detail-hero">
        <div className="wrap">
          <Link href="/#packages" className="detail-back">
            ← All dives &amp; packages
          </Link>
          <div className="detail-eyebrow">
            {dive.site}
            {dive.depth_m ? ` · ${dive.depth_m}m` : ''}
            {dive.tier ? ` · ${dive.tier}` : ''}
          </div>
          <h1>{dive.name}</h1>
          {dive.pitch && <p className="detail-pitch">{dive.pitch}</p>}

          <div className="detail-stats">
            {dive.depth_m && (
              <div className="detail-stat">
                <span>DEPTH</span>
                <b>{dive.depth_m}m</b>
              </div>
            )}
            <div className="detail-stat">
              <span>DURATION</span>
              <b>{diveDuration(dive) || '—'}</b>
            </div>
            {dive.photos > 0 && (
              <div className="detail-stat">
                <span>PHOTOS</span>
                <b>
                  {dive.photos} + {dive.gopro_min}m GoPro
                </b>
              </div>
            )}
            <div className="detail-stat">
              <span>PRICE / PERSON</span>
              <b>{priceLabel}</b>
            </div>
          </div>

          <div className="detail-cta-row">
            <a href={waBook} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
              Book on WhatsApp →
            </a>
            <Link href="/learn-to-dive" className="btn btn-ghost" style={{ color: '#fff', borderColor: '#fff' }}>
              New to diving?
            </Link>
          </div>
        </div>
      </section>

      <CoralBand />

      {/* BODY */}
      <section className="detail-body">
        <div className="wrap">
          <div className="detail-grid">
            <div>
              {/* What's included */}
              <div className="panel warm">
                <h3>
                  <span style={{ verticalAlign: 'middle', marginRight: 10 }}>
                    <CoralIcon />
                  </span>
                  What&apos;s included
                </h3>
                <ul className="included-list">
                  {included.map((it) => (
                    <li key={it}>
                      <span className="tick">✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What you'll see */}
              {dive.see_text && (
                <div className="panel reef">
                  <h3>
                    <span style={{ verticalAlign: 'middle', marginRight: 10 }}>
                      <FishIcon color="#1f8f86" />
                    </span>
                    What you&apos;ll see
                  </h3>
                  <p>{dive.see_text}</p>
                </div>
              )}

              {/* Who it's for */}
              {dive.for_text && (
                <div className="panel sun">
                  <h3>Who it&apos;s for</h3>
                  <p>{dive.for_text}</p>
                </div>
              )}

              {/* How it works */}
              {dive.steps?.length > 0 && (
                <div className="panel" style={{ background: '#fff', border: '1px solid rgba(27,26,23,.1)' }}>
                  <h3>How it works</h3>
                  <div className="steps">
                    {dive.steps.map((s, i) => (
                      <div className="step" key={i}>
                        <div className="step-n" />
                        <div>
                          <h4>{s.title}</h4>
                          <p>{s.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky booking card */}
            <aside className="detail-aside">
              <div className="book-card">
                <div className="bc-price">{priceLabel}</div>
                <div className="bc-per">{dive.on_request ? 'contact us for pricing' : 'per person'}</div>
                <a href={waBook} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
                  Book on WhatsApp →
                </a>
                <a
                  href={waGeneral(settings.whatsapp)}
                  className="btn btn-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: 10 }}
                >
                  Ask a question
                </a>
                <div className="bc-meta">
                  <span>📍 {dive.site}, Havelock</span>
                  {dive.depth_m && <span>🌊 Max depth {dive.depth_m}m</span>}
                  <span>📷 Free photos &amp; GoPro with every dive</span>
                  <span>🚐 Pickup &amp; drop within 5km</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      <JsonLd data={[diveProductSchema(dive, settings), breadcrumbSchema(dive)]} />
    </main>
  );
}
