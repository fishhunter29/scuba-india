import type { Metadata } from 'next';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import PageBanner from '@/components/PageBanner';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSettings } from '@/lib/data';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy — Scuba India',
  description: 'How Scuba India collects, uses and protects your personal information when you book a dive or visit our site.',
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export const revalidate = 3600;

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <>
      <InkBackground />
      <ScrollFX />
      <Nav />

      <main className="detail has-banner">
        <PageBanner image="/images/banner-legal" alt="The Scuba India dive boat on calm water, Havelock" />
        <section className="detail-hero">
          <div className="wrap">
            <div className="detail-eyebrow">Legal</div>
            <h1>Privacy Policy</h1>
            <p className="detail-pitch">
              {SITE_NAME} is a PADI dive centre on Havelock Island, Andaman. This policy explains
              what information we collect when you enquire about or book a dive with us, and how
              we use it.
            </p>
          </div>
        </section>

        <section className="detail-body">
          <div className="wrap">
            <div className="detail-main legal-wrap">
              <div className="legal-updated">Last updated: June 2026</div>

              <div className="panel">
                <h3>1. Information we collect</h3>
                <p>We collect information you give us directly, such as when you message us on WhatsApp, fill in an enquiry or booking form, or contact us by phone or email. This typically includes:</p>
                <ul>
                  <li>Your name, phone number, WhatsApp number and email address</li>
                  <li>Booking details — dates, dive or course selected, number of divers, hotel/pickup location</li>
                  <li>Health and fitness information you provide as part of the PADI medical statement before diving</li>
                  <li>Any messages, photos or feedback you choose to send us</li>
                </ul>
                <p>If you browse our website, we also collect basic technical information automatically — such as your browser type, device, and pages visited — to keep the site working correctly and to understand how it&apos;s used.</p>
              </div>

              <div className="panel">
                <h3>2. How we use your information</h3>
                <p>We use your information to:</p>
                <ul>
                  <li>Confirm bookings, arrange pickup/drop, and communicate with you about your dive or course</li>
                  <li>Assess your fitness and suitability to dive, as required under PADI standards</li>
                  <li>Respond to enquiries and provide customer support</li>
                  <li>Share booking details with our dive instructors and boat crew so they can prepare for your visit</li>
                  <li>Send you photos or video from your dive, where applicable</li>
                  <li>Improve our website and services</li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>
              </div>

              <div className="panel">
                <h3>3. Who we share information with</h3>
                <p>We share information only where necessary to run our business:</p>
                <ul>
                  <li><b>WhatsApp Business</b> — most of our booking communication happens over WhatsApp, which is operated by Meta and governed by its own privacy policy.</li>
                  <li><b>Our booking and website systems</b> (including our database provider, Supabase) — used to store booking, settings and review data securely.</li>
                  <li><b>PADI</b> — if you take a course with us, certain certification details are submitted to PADI as required to issue your certification.</li>
                  <li><b>Google</b> — if you leave us a review, that review and your public profile information is visible on Google, governed by Google&apos;s own policies.</li>
                </ul>
                <p>We may also disclose information where required by law, or to protect the safety of divers, staff or the public.</p>
              </div>

              <div className="panel">
                <h3>4. Cookies &amp; analytics</h3>
                <p>
                  Our website may use cookies or similar technology to remember basic preferences and to understand
                  how visitors use the site, so we can improve it. You can disable cookies in your browser settings,
                  though some parts of the site may not work as well without them.
                </p>
              </div>

              <div className="panel">
                <h3>5. Data security &amp; retention</h3>
                <p>
                  We take reasonable technical and organisational measures to protect your information from
                  unauthorised access, loss or misuse. We retain booking and communication records for as long as
                  needed to handle your booking, meet legal/tax requirements, and resolve any disputes, after which
                  we delete or anonymise it.
                </p>
              </div>

              <div className="panel">
                <h3>6. Your rights</h3>
                <p>
                  You can ask us at any time to tell you what information we hold about you, to correct it, or to
                  delete it (subject to any legal or safety record-keeping requirements we must follow). To make a
                  request, contact us using the details below.
                </p>
              </div>

              <div className="panel">
                <h3>7. Minors</h3>
                <p>
                  PADI courses and try dives have minimum age requirements, and divers under 18 must dive with the
                  consent of a parent or guardian. Where we collect information about a minor, we do so with the
                  involvement and consent of their parent or guardian.
                </p>
              </div>

              <div className="panel">
                <h3>8. Changes to this policy</h3>
                <p>
                  We may update this policy from time to time to reflect changes in our practices or for legal
                  reasons. The &quot;Last updated&quot; date above shows when it was last revised.
                </p>
              </div>

              <div className="panel">
                <h3>9. Contact us</h3>
                <p>
                  If you have any questions about this policy or how we handle your information, contact us at{' '}
                  <a href={`mailto:${settings.email}`}>{settings.email}</a> or{' '}
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} phone={settings.phone} />
    </>
  );
}
