import Link from 'next/link';
import type { Dive, Course } from '@/lib/types';
import { fromPrice } from '@/lib/format';

export default function Experiences({
  dives,
  courses,
}: {
  dives: Dive[];
  courses: Course[];
}) {
  const tryDives = dives.filter(
    (d) => (d.site_key === 'tribe' || d.site_key === 'red') && d.train_min != null,
  );
  const funDives = dives.filter((d) => d.site_key === 'multi' && !d.on_request);
  const tryFrom = fromPrice(tryDives.length ? tryDives : dives);
  const funFrom = fromPrice(funDives);
  const courseFrom = (() => {
    const priced = courses.filter((c) => !c.on_request && c.price != null).map((c) => c.price!);
    return priced.length ? '₹' + Math.min(...priced).toLocaleString('en-IN') : 'On request';
  })();

  return (
    <section className="band" id="experiences">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">Choose your dive</div>
          <h2>Your first breath, or your hundredth</h2>
          <p>
            Three ways into the water, matched to where you are. Every dive includes HD photos and
            GoPro video — free.
          </p>
        </div>
        <div className="exp-grid">
          <div className="card reveal">
            <div className="card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="card-photo" src="/images/home-try-dive.jpg" alt="Try Scuba Dive in Havelock" />
              <span className="card-tag">NO EXPERIENCE</span>
            </div>
            <div className="card-body">
              <h3>Try Scuba Dive</h3>
              <p>
                Never dived before? You&apos;ll be breathing underwater within the hour, an
                instructor at your side the whole time.
              </p>
              <div className="card-meta">20–50 min · Tribe Gate / Red Pillar · Photos + GoPro</div>
              <div className="card-price">
                <span className="from">from</span>
                <span className="amt">{tryFrom}</span>
              </div>
              <Link href="/#packages" className="btn btn-primary">
                See Packages
              </Link>
            </div>
          </div>

          <div className="card reveal">
            <div className="card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="card-photo" src="/images/home-fun-dive.jpg" alt="Fun Dives across Havelock's reefs" />
              <span className="card-tag">CERTIFIED</span>
            </div>
            <div className="card-body">
              <h3>Fun Dives</h3>
              <p>
                Already certified? Explore two of Havelock&apos;s best sites in a single trip with
                our divemasters leading.
              </p>
              <div className="card-meta">2 dive sites · Red Pillar + Tribe Gate · Full guiding</div>
              <div className="card-price">
                <span className="from">from</span>
                <span className="amt">{funFrom}</span>
              </div>
              <Link href="/#packages" className="btn btn-primary">
                See Packages
              </Link>
            </div>
          </div>

          <div className="card reveal">
            <div className="card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="card-photo" src="/images/home-courses.jpg" alt="PADI certification courses in Havelock" />
              <span className="card-tag">GET CERTIFIED</span>
            </div>
            <div className="card-body">
              <h3>PADI Courses</h3>
              <p>
                Certify for life. From Scuba Diver to Rescue Diver — internationally recognised,
                taught at your pace.
              </p>
              <div className="card-meta">2–4 days · PADI certification · Beginner→Pro</div>
              <div className="card-price">
                <span className="from">from</span>
                <span className="amt">{courseFrom}</span>
              </div>
              <Link href="/#courses" className="btn btn-primary">
                View Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
