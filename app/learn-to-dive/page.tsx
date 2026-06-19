import type { Metadata } from 'next';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import SafetyFAQ from '@/components/learn/SafetyFAQ';
import { SAFETY_FAQS } from '@/lib/faqs';
import DiveChooser from '@/components/learn/DiveChooser';
import GearWalkthrough from '@/components/learn/GearWalkthrough';
import MarineGallery from '@/components/learn/MarineGallery';
import { getSettings } from '@/lib/data';
import { faqSchema } from '@/lib/schema';
import { waTryDive } from '@/lib/whatsapp';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Scuba Diving, Explained — First-Time Diving in Havelock',
  description:
    'New to scuba diving? An interactive, jargon-free guide for first-timers: how deep you go, is it safe, what gear you wear, and what you\'ll see in Havelock\'s reefs.',
  alternates: { canonical: `${SITE_URL}/learn-to-dive` },
};

export const revalidate = 60;

export default async function LearnToDivePage() {
  const settings = await getSettings();

  return (
    <>
      <InkBackground />
      <ScrollFX />
      <Nav />
      <main className="learn">

      <section className="learn-hero">
        <div className="wrap">
          <div className="detail-eyebrow">New to diving?</div>
          <h1>Scuba diving, explained</h1>
          <p>
            Never breathed underwater before? Good — this page is for you. No jargon, no pressure.
            Just what it&apos;s really like, whether it&apos;s safe, and how easy your first dive in
            Havelock can be.
          </p>
        </div>
      </section>

      {/* What a first dive looks like — calm reassurance stats */}
      <section className="learn-section">
        <div className="wrap">
          <h2>What a first dive actually looks like</h2>
          <p className="lead">
            Less than you&apos;d think — and never on your own. A Try Scuba Dive stays shallow,
            short and fully guided. Here&apos;s exactly what to expect.
          </p>
          <div className="fd-grid">
            <div className="fd-card">
              <div className="fd-fig">~12m</div>
              <div className="fd-lab">Max depth</div>
              <div className="fd-sub">Shallow reef at Tribe Gate or Red Pillar</div>
            </div>
            <div className="fd-card">
              <div className="fd-fig">30–40 min</div>
              <div className="fd-lab">Underwater</div>
              <div className="fd-sub">At an easy, unhurried pace</div>
            </div>
            <div className="fd-card">
              <div className="fd-fig">1-to-1</div>
              <div className="fd-lab">Instructor per diver</div>
              <div className="fd-sub">A PADI pro within arm&apos;s reach the whole time</div>
            </div>
            <div className="fd-card">
              <div className="fd-fig">27–30°C</div>
              <div className="fd-lab">Water temperature</div>
              <div className="fd-sub">Warm enough for a thin wetsuit, or none</div>
            </div>
            <div className="fd-card">
              <div className="fd-fig">None</div>
              <div className="fd-lab">Certification needed</div>
              <div className="fd-sub">We teach you everything on the day</div>
            </div>
          </div>
          <p className="fd-note">
            Certified divers go further later — 18–30m, exploring on their own with a buddy — but
            your first time is the calm, shallow version above.
          </p>
        </div>
      </section>

      {/* Is it safe? */}
      <section className="learn-section">
        <div className="wrap">
          <h2>Is it safe? Your honest questions</h2>
          <p className="lead">
            The things everyone worries about before their first dive — answered straight.
          </p>
          <SafetyFAQ />
        </div>
      </section>

      {/* Chooser */}
      <section className="learn-section">
        <div className="wrap">
          <h2>Try dive or full course?</h2>
          <p className="lead">
            Two quick questions and we&apos;ll point you to the right place to start.
          </p>
          <DiveChooser />
        </div>
      </section>

      {/* Gear */}
      <section className="learn-section">
        <div className="wrap">
          <h2>What you&apos;ll be wearing</h2>
          <p className="lead">
            It looks like a lot of equipment. It isn&apos;t complicated — and we fit and check every
            piece for you. Explore each part below.
          </p>
          <GearWalkthrough />
        </div>
      </section>

      {/* Marine life */}
      <section className="learn-section">
        <div className="wrap">
          <h2>Who you&apos;ll meet down there</h2>
          <p className="lead">
            A few of the friendly locals on Havelock&apos;s reefs. Hover or tap a card to learn
            more.
          </p>
          <MarineGallery />
        </div>
      </section>

      {/* Final CTA */}
      <section className="learn-final">
        <div className="wrap">
          <h2>Ready to breathe underwater?</h2>
          <p>Book a Try Scuba Dive — no experience needed, an instructor with you the whole time.</p>
          <a href={waTryDive(settings.whatsapp)} className="btn btn-light" target="_blank" rel="noopener noreferrer">
            Book a Try Dive on WhatsApp →
          </a>
        </div>
      </section>
      </main>

      <Footer settings={settings} />

      <JsonLd data={faqSchema(SAFETY_FAQS.map((f) => ({ q: f.q, a: f.a })))} />
    </>
  );
}
