import Link from 'next/link';
import type { Course } from '@/lib/types';
import { formatPrice, courseSlug } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

export default function Courses({
  courses,
  whatsapp,
  limit = 4,
}: {
  courses: Course[];
  whatsapp: string;
  limit?: number;
}) {
  // Homepage shows a curated few — the full list lives at /courses.
  const shown = courses.filter((c) => (c.kind ?? 'course') !== 'combo').slice(0, limit);
  return (
    <section className="band courses" id="courses">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">PADI Certification</div>
          <h2>Get certified, for life</h2>
          <p>
            Internationally recognised PADI courses, beginner to professional. Prices are per
            person — message us for dates, details and anything you&apos;re unsure about.
          </p>
        </div>
        <div className="reveal">
          {shown.map((c) => (
            <Link href={`/courses/${courseSlug(c.name)}`} className="course-row" key={c.id}>
              <span className="cthumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image_url ?? '/images/gallery/g34.jpg'} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="cname">{c.name}</span>
              <span className="cstat">
                <span>DURATION</span>
                {c.duration}
              </span>
              <span className="cstat">
                <span>DEPTH</span>
                {c.depth}
              </span>
              <span className="cstat">
                <span>MIN AGE</span>
                {c.min_age}
              </span>
              <span className="cprice">{formatPrice(c.price, c.on_request)}</span>
            </Link>
          ))}
        </div>
        <div className="courses-cta reveal">
          <p>
            {courses.length > shown.length
              ? `${courses.length} courses and combos in total — including Divemaster and money-saving bundles.`
              : 'Not sure which course is right for you? We\u2019ll help you choose.'}
          </p>
          <Link href="/courses" className="btn btn-primary">
            View all courses →
          </Link>
          <a
            href={waLink(whatsapp, 'Hi Scuba India, I have a question about your PADI courses.')}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask on WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
