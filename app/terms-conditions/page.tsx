import type { Metadata } from 'next';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSettings } from '@/lib/data';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Scuba India',
  description: 'The terms that apply when you book a try dive, fun dive or PADI course with Scuba India on Havelock Island.',
  alternates: { canonical: `${SITE_URL}/terms-conditions` },
};

export const revalidate = 3600;

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <>
      <InkBackground />
      <ScrollFX />
      <Nav />

      <main className="detail">
        <section className="detail-hero">
          <div className="wrap">
            <div className="detail-eyebrow">Legal</div>
            <h1>Terms &amp; Conditions</h1>
            <p className="detail-pitch">
              Please read these terms before booking a dive or course with {SITE_NAME}. By booking,
              you agree to them.
            </p>
          </div>
        </section>

        <section className="detail-body">
          <div className="wrap">
            <div className="detail-main legal-wrap">
              <div className="legal-updated">Last updated: June 2026</div>

              <div className="panel">
                <h3>1. About these terms</h3>
                <p>
                  These terms apply to all try dives, fun dives, PADI courses and other services booked
                  with {SITE_NAME}, a PADI dive centre operating on Havelock Island, Andaman, India. By
                  enquiring, booking or diving with us, you agree to these terms.
                </p>
              </div>

              <div className="panel">
                <h3>2. Eligibility, health &amp; fitness to dive</h3>
                <p>Scuba diving has minimum age, swimming ability and health requirements:</p>
                <ul>
                  <li>Try dives and beginner courses generally require a minimum age of 10, with parental/guardian consent required for divers under 18.</li>
                  <li>Before any dive, you must truthfully complete a PADI medical statement. If you answer &quot;yes&quot; to any question on it, you will need written clearance from a doctor before you can dive.</li>
                  <li>We reserve the right to refuse or postpone a dive for anyone we reasonably believe is medically unfit, intoxicated, or otherwise unable to dive safely, with no liability to us for doing so.</li>
                </ul>
              </div>

              <div className="panel">
                <h3>3. Bookings &amp; payment</h3>
                <ul>
                  <li>Bookings are usually made and confirmed over WhatsApp, phone or email, and are confirmed once we acknowledge them.</li>
                  <li>Prices are quoted in Indian Rupees (INR) and are per person unless stated otherwise. Prices may change without notice until a booking is confirmed.</li>
                  <li>A booking may require an advance payment or deposit to secure your slot; the balance is payable on the day unless agreed otherwise.</li>
                </ul>
              </div>

              <div className="panel">
                <h3>4. Conduct, safety &amp; instructor authority</h3>
                <p>
                  All dives are conducted under the supervision of a PADI professional. For your safety and
                  that of other divers, you must follow your instructor&apos;s or divemaster&apos;s briefing and
                  instructions at all times. The instructor has final authority to modify, shorten or cancel a
                  dive on safety grounds, including due to a diver&apos;s conduct, condition or equipment.
                </p>
              </div>

              <div className="panel">
                <h3>5. Assumption of risk</h3>
                <p>
                  Scuba diving is an adventure activity that carries inherent risks, even when carried out
                  correctly with trained professionals. Before diving, you will be asked to read and sign a
                  PADI liability release and assumption of risk form. These website terms do not replace that
                  signed waiver, which sets out the full terms governing your assumption of risk.
                </p>
              </div>

              <div className="panel">
                <h3>6. Weather &amp; sea conditions</h3>
                <p>
                  Diving and boat trips around Havelock Island are subject to weather, tide and sea
                  conditions. We may reschedule, change the dive site, or cancel a trip at short notice if
                  conditions are unsafe. We will always try to offer an alternative date or a full refund where
                  a trip cannot go ahead for this reason.
                </p>
              </div>

              <div className="panel">
                <h3>7. Photos &amp; video</h3>
                <p>
                  We often take photos and video during dives and courses, both for you to keep and,
                  occasionally, for our own marketing (website, social media, brochures). If you would prefer we
                  don&apos;t use your image for marketing, just let us know and we&apos;ll exclude it.
                </p>
              </div>

              <div className="panel">
                <h3>8. Intellectual property</h3>
                <p>
                  All text, images and design on this website belong to {SITE_NAME} or our licensors and may
                  not be copied or reused without our permission.
                </p>
              </div>

              <div className="panel">
                <h3>9. Governing law</h3>
                <p>
                  These terms are governed by the laws of India, and any disputes are subject to the
                  jurisdiction of the courts of the Andaman &amp; Nicobar Islands.
                </p>
              </div>

              <div className="panel">
                <h3>10. Changes to these terms</h3>
                <p>
                  We may update these terms from time to time. The version in force at the time of your
                  booking will apply.
                </p>
              </div>

              <div className="panel">
                <h3>11. Contact us</h3>
                <p>
                  Questions about these terms? Reach us at{' '}
                  <a href={`mailto:${settings.email}`}>{settings.email}</a> or{' '}
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} />
    </>
  );
}
