import type { Metadata } from 'next';
import Link from 'next/link';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PageBanner from '@/components/PageBanner';
import CourseList from '@/components/CourseList';
import { getCourses, getSettings } from '@/lib/data';
import { getGoogleReviews, withLiveRating } from '@/lib/google-reviews';
import { DIVE_CATEGORIES } from '@/lib/categories';
import { waLink } from '@/lib/whatsapp';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

const title = 'PADI Courses in Havelock (Swaraj Dweep) — Scuba India';
const description =
  'PADI certification courses in Havelock, Andaman — Scuba Diver, Open Water, Advanced, Rescue, EFR and Divemaster, plus money-saving course combos.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/courses` },
  openGraph: { title, description, url: `${SITE_URL}/courses`, type: 'website' },
};

export default async function CoursesIndexPage() {
  const [courses, rawSettings, google] = await Promise.all([
    getCourses(),
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
        <PageBanner image="/images/banner-courses" alt="PADI course training in Havelock" />

        <section className="detail-hero">
          <div className="wrap">
            <Link href="/" className="detail-back">← Back to home</Link>
            <div className="detail-eyebrow">PADI Certification</div>
            <h1>Get certified, for life</h1>
            <p className="detail-pitch">
              Internationally recognised PADI courses, from your first certification to going pro.
              Taught at your pace by our own instructors, in some of the clearest water in India.
            </p>
            <div className="cat-meta">
              <span>PADI Dive Centre #27122</span>
              <span>Beginner → Professional</span>
              <span>Prices per person</span>
            </div>
          </div>
        </section>

        <div className="detail-body" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <CourseList courses={courses} whatsapp={settings.whatsapp} />

            <div className="cat-more">
              <h2>Not ready for a course yet?</h2>
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
                Not sure which course is right for you? Tell us where you are as a diver and
                we&apos;ll point you to the right one — no pressure.
              </p>
              <a
                href={waLink(settings.whatsapp, 'Hi Scuba India, which PADI course would suit me?')}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask about courses →
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
