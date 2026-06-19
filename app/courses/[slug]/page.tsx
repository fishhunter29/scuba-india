import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import { getCourseBySlug, getAllCourseSlugs, getSettings } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import { waCourse, waGeneral } from '@/lib/whatsapp';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  if (!course) return { title: 'Course not found' };
  const title = `${course.name} — PADI Course in Havelock`;
  return {
    title,
    description:
      course.description ||
      `${course.name} PADI certification course in Havelock (Swarajdweep), Andaman.`,
    alternates: { canonical: `${SITE_URL}/courses/${params.slug}` },
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const [course, settings] = await Promise.all([getCourseBySlug(params.slug), getSettings()]);
  if (!course) notFound();

  const priceLabel = formatPrice(course.price, course.on_request);
  const waBook = waCourse(course.name, settings.whatsapp);

  const included = [
    'PADI instructor & all training materials',
    'All scuba equipment for the course',
    'Confined-water and open-water training dives',
    'Internationally recognised PADI certification',
    'Pickup & drop within 5km',
  ];

  return (
    <>
      <InkBackground />
      <ScrollFX />
      <Nav />

      <main className="detail">
        <section className="detail-hero">
          <div className="wrap">
            <Link href="/#courses" className="detail-back">
              ← All PADI courses
            </Link>
            <div className="detail-eyebrow">PADI Certification</div>
            <h1>{course.name}</h1>
            {course.description && <p className="detail-pitch">{course.description}</p>}

            <div className="detail-stats">
              {course.duration && (
                <div className="detail-stat">
                  <span>DURATION</span>
                  <b>{course.duration}</b>
                </div>
              )}
              {course.depth && course.depth !== '—' && (
                <div className="detail-stat">
                  <span>MAX DEPTH</span>
                  <b>{course.depth}</b>
                </div>
              )}
              {course.min_age && (
                <div className="detail-stat">
                  <span>MIN AGE</span>
                  <b>{course.min_age}</b>
                </div>
              )}
              <div className="detail-stat">
                <span>PRICE / PERSON</span>
                <b>{priceLabel}</b>
              </div>
            </div>

            <div className="detail-cta-row">
              <a href={waBook} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Enquire on WhatsApp →
              </a>
              <Link href="/learn-to-dive" className="btn btn-ghost">
                New to diving?
              </Link>
            </div>
          </div>
        </section>

        <section className="detail-body">
          <div className="wrap">
            <div className="detail-grid">
              <div className="detail-main">
                <div className="panel">
                  <h3>What&apos;s included</h3>
                  <ul className="included-list">
                    {included.map((it) => (
                      <li key={it}>
                        <span className="tick">✓</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="panel">
                  <h3>Who it&apos;s for</h3>
                  <p>
                    {course.min_age === 'None'
                      ? 'Open to everyone — no diving experience or minimum age required.'
                      : `Suitable from age ${course.min_age?.split('/')[0]?.trim() || '10'}. Whether you're brand new or building on an earlier certification, our PADI instructors take you at your own pace.`}
                  </p>
                </div>

                <div className="panel">
                  <h3>How booking works</h3>
                  <p>
                    Tap <strong>Enquire on WhatsApp</strong> and tell us your dates. We&apos;ll
                    confirm availability, what to bring, and answer any questions — then reserve your
                    spot. No payment gateway needed; we sort everything over chat.
                  </p>
                </div>
              </div>

              <aside className="detail-aside">
                <div className="book-card">
                  <div className="bc-price">{priceLabel}</div>
                  <div className="bc-per">
                    {course.on_request ? 'contact us for pricing' : 'per person'}
                  </div>
                  <a href={waBook} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Enquire on WhatsApp →
                  </a>
                  <a
                    href={waGeneral(settings.whatsapp)}
                    className="btn btn-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ask a question
                  </a>
                  <div className="bc-meta">
                    {course.duration && <span>{course.duration}</span>}
                    {course.depth && course.depth !== '—' && <span>To {course.depth}</span>}
                    <span>PADI-certified instructors</span>
                    <span>Certification for life</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.name,
          description:
            course.description || `${course.name} PADI certification course in Havelock, Andaman.`,
          provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        }}
      />
    </>
  );
}
