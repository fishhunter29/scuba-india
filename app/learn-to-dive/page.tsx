import type { Metadata } from 'next';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import FearCheck from '@/components/learn/FearCheck';
import DiveChooser from '@/components/learn/DiveChooser';
import { FEAR_CHECKS } from '@/lib/faqs';
import { getSettings } from '@/lib/data';
import { faqSchema } from '@/lib/schema';
import { waGeneral, waTryDive, waCoursesGeneral } from '@/lib/whatsapp';
import { SITE_URL } from '@/lib/constants';

const title = 'First-Time Scuba Diving in Havelock — What to Expect';
const description =
  "New to diving? Here's exactly what your first scuba dive in Havelock, Andaman feels like — the safety, and your day, hour by hour. No jargon, no pressure.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/learn-to-dive` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/learn-to-dive`,
    type: 'website',
    images: [{ url: '/images/logo-full.png', width: 640, height: 640, alt: 'Scuba India' }],
  },
};

export const revalidate = 60;

export default async function LearnToDivePage() {
  const settings = await getSettings();

  return (
    <>
      <InkBackground />
      <div className="section-veil" aria-hidden="true" />
      <ScrollFX />
      <Nav />

      <a
        href={waTryDive(settings.whatsapp)}
        data-track="book_click"
        className="learn-skip"
        target="_blank"
        rel="noopener noreferrer"
      >
        Book a dive →
      </a>

      <main className="learn">

      {/* SECTION 1 — THE HOOK */}
      <section className="learn-hero">
        <div className="wrap">
          <div className="detail-eyebrow">Learn to dive · Havelock</div>
          <h1>What actually happens when you breathe underwater for the first time?</h1>
          <p>
            Most people who dive with us in Havelock have never done it before. No experience.
            Many can&apos;t swim well. Some are nervous. By the time you finish reading this,
            you&apos;ll understand exactly how it works — and why it&apos;s easier, and safer,
            than it looks.
          </p>
        </div>
        <a href="#can-i-do-this" className="scroll-cue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v15M5 13l7 7 7-7" />
          </svg>
          let&apos;s go under
        </a>
      </section>

      {/* SECTION 2 — CAN I EVEN DO THIS? */}
      <section className="learn-section" id="can-i-do-this">
        <div className="wrap">
          <div className="detail-eyebrow reveal">Your honest questions</div>
          <h2 className="reveal">&ldquo;But can <em>I</em> actually do it?&rdquo;</h2>
          <p className="lead reveal">
            The fear that stops most people isn&apos;t the water — it&apos;s &ldquo;maybe
            I&apos;m not allowed.&rdquo; Let&apos;s clear that up first. Tap whichever sounds
            like you.
          </p>
          <div className="reveal">
            <FearCheck />
          </div>
          <p className="learn-closing reveal">
            Still unsure about your situation?{' '}
            <a href={waGeneral(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>{' '}
            — we&apos;ll tell you honestly, no pressure.
          </p>
        </div>
      </section>

      {/* SECTION 3A — WHAT IT ACTUALLY FEELS LIKE */}
      <section className="learn-section">
        <div className="wrap">
          <div className="detail-eyebrow reveal">The first breath</div>
          <h2 className="reveal">It feels stranger than you&apos;d think — in the best way.</h2>
          <p className="lead reveal">
            The moment everyone remembers is the first breath underwater. Your brain says
            &ldquo;you can&apos;t breathe here&rdquo; — and then you do, slow and easy, and
            something just relaxes. After that, it&apos;s quiet. You hang weightless, like
            floating in space, the only sound your own calm breathing. No rushing. No effort.
            Just you, drifting over the reef, watching it watch you back.
          </p>
          <p className="lead reveal">
            Here&apos;s something almost no one knows until they go under: water steals colour.
            Red disappears first — gone by about 5 metres — then orange, then yellow, until
            everything turns shades of blue. It&apos;s why divers carry a torch: switch it on
            and the reef bursts back into full colour. It&apos;s the kind of thing you only
            understand once you&apos;ve seen it.
          </p>
          <div className="colour-fade reveal">
            <div className="colour-fade-bar" />
            <div className="colour-fade-labels">
              <span>Surface</span>
              <span>~5m</span>
              <span>Deeper</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — YOUR DAY, HOUR BY HOUR */}
      <section className="learn-section">
        <div className="wrap">
          <div className="detail-eyebrow reveal">What the day looks like</div>
          <h2 className="reveal">From pickup to the grin afterward.</h2>
          <p className="lead reveal">
            No guesswork. Here&apos;s exactly how a try dive day unfolds.
          </p>
          <div className="day-timeline reveal">
            <div className="day-step">
              <div className="day-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 16h1.2l1-4.5A1.8 1.8 0 018 10h8a1.8 1.8 0 011.8 1.5l1 4.5H20" />
                  <path d="M4 16v2M20 16v2" />
                  <circle cx="8" cy="18" r="1.3" fill="currentColor" stroke="none" />
                  <circle cx="16" cy="18" r="1.3" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div>
                <h4>We pick you up.</h4>
                <p>Pickup and drop within 5km is included — no figuring out transport.</p>
              </div>
            </div>
            <div className="day-step">
              <div className="day-step-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1h-9l-4 3v-3H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
                </svg>
              </div>
              <div>
                <h4>Meet your instructor &amp; briefing (~20 min).</h4>
                <p>
                  They walk you through everything on land first: how to breathe, simple hand
                  signals, what to expect. Every question answered before you touch the water.
                </p>
              </div>
            </div>
            <div className="day-step">
              <div className="day-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="7.5" />
                  <circle cx="12" cy="12" r="2.8" />
                  <path d="M12 4.5v4M12 15.5v4M4.5 12h4M15.5 12h4" />
                </svg>
              </div>
              <div>
                <h4>Gear up.</h4>
                <p>We fit your equipment and check it twice. You don&apos;t have to know how any of it works yet.</p>
              </div>
            </div>
            <div className="day-step">
              <div className="day-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 16l1.3-5h13.4L20 16" />
                  <path d="M3.5 16h17a1 1 0 01.95 1.3c-.75 1.5-2.95 2.2-5.45 1.7-1.3-.25-2.7-.6-4-.6s-2.7.35-4 .6c-2.5.5-4.7-.2-5.45-1.7a1 1 0 01.95-1.3z" />
                  <path d="M11 11V5l4.5 3-4.5 3z" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div>
                <h4>The boat ride.</h4>
                <p>A short, beautiful ride out to the dive site — often the part people don&apos;t expect to love.</p>
              </div>
            </div>
            <div className="day-step">
              <div className="day-step-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="8" cy="17" r="1.4" />
                  <circle cx="13" cy="12.5" r="2" />
                  <circle cx="10.5" cy="7" r="1.1" />
                </svg>
              </div>
              <div>
                <h4>Into the water (~30–40 min under).</h4>
                <p>
                  You descend slowly, your instructor holding on, equalising gently as you go.
                  Then the reef opens up — and you forget you were ever nervous.
                </p>
              </div>
            </div>
            <div className="day-step">
              <div className="day-step-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
                  <path d="M8.5 6l.9-1.5a1 1 0 01.86-.5h3.48a1 1 0 01.86.5L15.5 6H18a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2.5zm3.5 3a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </div>
              <div>
                <h4>Back up, and the photos.</h4>
                <p>Every dive includes free HD photos and GoPro video. You surface with proof, not just a story.</p>
              </div>
            </div>
          </div>
          <p className="learn-closing reveal">
            Total time: about half a day. Easy to fit around the rest of your island trip.
          </p>
        </div>
      </section>

      {/* SECTION 5 — TRY DIVE OR FULL COURSE? */}
      <section className="learn-section" id="chooser">
        <div className="wrap">
          <div className="detail-eyebrow reveal">Which is right for you?</div>
          <h2 className="reveal">Just trying it, or getting certified?</h2>
          <p className="lead reveal">
            Two paths into diving. Answer a couple of quick questions and we&apos;ll point you to
            the right one.
          </p>
          <div className="reveal">
            <DiveChooser />
          </div>
          <p className="pk-value learn-closing reveal">
            Same PADI standards, same reefs, same free photos and pickup as anywhere in Havelock —
            at <b>honest prices</b>. We&apos;d rather you dive with us twice than overpay once.
          </p>
        </div>
      </section>

      {/* SECTION 6 — THE PEOPLE KEEPING YOU SAFE */}
      <section className="learn-section">
        <div className="wrap">
          <div className="detail-eyebrow reveal">You&apos;re in good hands</div>
          <h2 className="reveal">One instructor. Always within arm&apos;s reach.</h2>
          <p className="lead reveal">
            Every first dive is one-on-one — a PADI-certified instructor stays beside you the
            entire time, often holding on. Our gear is inspected before every single dive. We
            dive Havelock&apos;s reefs daily; we know exactly where it&apos;s calm, clear, and
            alive. You can end the dive and surface whenever you want — you&apos;re always in
            control, and we&apos;re always right there.
          </p>
          {/* No real instructor photos yet — slot reserved here for when they exist. */}
          <div className="trust-inline reveal">
            <span>
              <b>PADI</b> Dive Centre <span className="padi-no">#27122</span>
            </span>
            <span>
              <span className="star">★</span> <b>{settings.rating_avg}</b> on Google ·{' '}
              {settings.review_count > 0 ? settings.review_count : '[XX]'}+ reviews
            </span>
            <span>
              <b>{settings.dives_guided}+</b> dives guided
            </span>
            <span>
              Based in <b>Havelock</b>
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 7 — THE PAYOFF + CTA */}
      <section className="learn-final">
        <div className="wrap">
          <div className="reveal">
            <div className="detail-eyebrow">You&apos;re ready</div>
            <h2>You now understand more about diving than most people who&apos;ve never tried.</h2>
            <p>
              Breathing, floating, the colours, your day, the safety. That&apos;s the whole
              foundation of a first dive — and you just learned it. The only thing left is the
              part you can&apos;t read your way into.
            </p>
            <div className="hero-cta">
              <a
                href={waTryDive(settings.whatsapp)}
                data-track="book_click"
                className="btn btn-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book your first dive on WhatsApp →
              </a>
              <a
                href={waCoursesGeneral(settings.whatsapp)}
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask about PADI courses →
              </a>
            </div>
            <p className="learn-final-reassure">
              No experience needed. Free photos. An instructor by your side every second. Still,
              clear water waiting.
            </p>
          </div>
        </div>
      </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />

      <JsonLd data={faqSchema(FEAR_CHECKS)} />
    </>
  );
}
