import Link from 'next/link';
import type { Course } from '@/lib/types';
import { formatPrice, courseSlug } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

export default function Courses({
  courses,
  whatsapp,
}: {
  courses: Course[];
  whatsapp: string;
}) {
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
          {courses.map((c) => (
            <Link href={`/courses/${courseSlug(c.name)}`} className="course-row" key={c.id}>
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
          <p>Not sure which course is right for you? We&apos;ll help you choose.</p>
          <a
            href={waLink(whatsapp, 'Hi Scuba India, I have a question about your PADI courses.')}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask about courses on WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}
