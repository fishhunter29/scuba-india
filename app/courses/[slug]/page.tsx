import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import PageBanner from '@/components/PageBanner';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import JsonLd from '@/components/JsonLd';
import { getCourseBySlug, getAllCourseSlugs, getSettings } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import { waCourse, waGeneral } from '@/lib/whatsapp';
import { courseSchema, courseBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL } from '@/lib/constants';

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
  const title = `${course.name} — PADI Course, Havelock`;
  const description =
    course.description || `${course.name} PADI certification course in Havelock, Andaman.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/courses/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/courses/${params.slug}`,
      type: 'website',
    },
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const [course, settings] = await Promise.all([
    getCourseBySlug(params.slug),
    getSettings(),
  ]);
  if (!course) notFound();

  const priceLabel = formatPrice(course.price, course.on_request);
  const waBook = waCourse(course.name, settings.whatsapp);

  return (
    <>
      <InkBackground />
      <div className="section-veil" aria-hidden="true" />
      <ScrollFX />
      <Nav />

      <main className="detail has-banner">
        <PageBanner image="/images/banner-courses" alt="The Scuba India dive boat off Havelock" />
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
              {course.depth && (
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
              <a href={waBook} data-track="book_click" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
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
            {course.image_url && (
              <div className="detail-photo">
                <Image
                  src={course.image_url}
                  alt={course.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}
            <div className="detail-grid">
              <div className="detail-main">
                <div className="panel">
                  <h3>About this course</h3>
                  <p>
                    {course.description ||
                      `${course.name} — an internationally recognised PADI certification, taught in Havelock's clear, warm waters.`}
                  </p>
                </div>
              </div>

              <aside className="detail-aside">
                <div className="book-card">
                  <div className="bc-price">{priceLabel}</div>
                  <div className="bc-per">
                    {course.on_request ? 'contact us for pricing' : 'per person'}
                  </div>
                  <a href={waBook} data-track="book_click" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
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
                    {course.duration && <span>Duration: {course.duration}</span>}
                    {course.depth && <span>Max depth: {course.depth}</span>}
                    {course.min_age && <span>Min age: {course.min_age}</span>}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />

      <JsonLd data={[courseSchema(course), courseBreadcrumbSchema(course)]} />
    </>
  );
}
