import type { Course } from '@/lib/types';
import { formatPrice } from '@/lib/format';

export default function Courses({ courses }: { courses: Course[] }) {
  return (
    <section className="band courses" id="courses">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">PADI Certification</div>
          <h2>Get certified, for life</h2>
          <p>
            Internationally recognised PADI courses, beginner to professional. Prices are per
            person.
          </p>
        </div>
        <div className="reveal">
          {courses.map((c) => (
            <div className="course-row" key={c.id}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
