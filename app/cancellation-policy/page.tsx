import type { Metadata } from 'next';
import InkBackground from '@/components/InkBackground';
import ScrollFX from '@/components/ScrollFX';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSettings } from '@/lib/data';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy — Scuba India',
  description: 'Our cancellation, rescheduling and refund policy for try dives, fun dives and PADI courses booked with Scuba India.',
  alternates: { canonical: `${SITE_URL}/cancellation-policy` },
};

export const revalidate = 3600;

export default async function CancellationPolicyPage() {
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
            <h1>Cancellation &amp; Refund Policy</h1>
            <p className="detail-pitch">
              Plans change, and sea conditions sometimes do too. Here&apos;s how cancellations,
              rescheduling and refunds work with {SITE_NAME}.
            </p>
          </div>
        </section>

        <section className="detail-body">
          <div className="wrap">
            <div className="detail-main legal-wrap">
              <div className="legal-updated">Last updated: June 2026</div>

              <div className="panel">
                <h3>1. Cancelling or rescheduling your booking</h3>
                <ul>
                  <li>Cancel or reschedule more than 24 hours before your dive: full refund of any amount paid, or you can simply move to a new date at no extra cost.</li>
                  <li>Cancel within 24 hours of your scheduled dive: we may deduct a reasonable cost already incurred (e.g. boat or instructor booked for you), with the remainder refunded.</li>
                  <li>No-shows, or cancellations after your boat/instructor has already departed, are not eligible for a refund.</li>
                </ul>
                <p>To cancel or reschedule, just message us on WhatsApp or call us — the earlier you let us know, the more flexibility we can offer.</p>
              </div>

              <div className="panel">
                <h3>2. If we cancel or reschedule</h3>
                <p>
                  If we need to cancel, postpone or change your dive — most commonly due to unsafe weather or
                  sea conditions, or for safety/operational reasons — we will offer you a free reschedule to
                  another date, or a full refund of any amount paid, your choice.
                </p>
              </div>

              <div className="panel">
                <h3>3. Found unfit to dive on the day</h3>
                <p>
                  If you are assessed as medically unfit to dive on the day (for example, due to your PADI
                  medical statement, an ear/sinus problem, or being unwell or intoxicated), the instructor&apos;s
                  decision is final for safety reasons. Where this happens, we will try to offer a reschedule;
                  amounts already spent on boat fuel, crew or instructor time for that trip may not be
                  refundable.
                </p>
              </div>

              <div className="panel">
                <h3>4. PADI courses</h3>
                <p>
                  For multi-day PADI courses, the same windows above apply to the course as a whole before it
                  starts. Once your PADI eLearning has been activated or physical course materials issued,
                  that portion of the course fee is non-refundable, as it is paid through to PADI on your
                  behalf. If you need to pause a course partway through, ask us about transferring your
                  remaining sessions to a later date — we&apos;ll always try to make this work.
                </p>
              </div>

              <div className="panel">
                <h3>5. How refunds are paid</h3>
                <p>
                  Approved refunds are returned using the same method you paid with, and are typically
                  processed within 5–7 business days of approval. If you paid in cash, we&apos;ll agree a
                  convenient way to return it.
                </p>
              </div>

              <div className="panel">
                <h3>6. Force majeure</h3>
                <p>
                  Neither party is liable for a cancellation caused by events beyond reasonable control —
                  including extreme weather, cyclones, government restrictions, or similar circumstances. In
                  these cases we will still offer a reschedule or refund wherever possible.
                </p>
              </div>

              <div className="panel">
                <h3>7. Contact us</h3>
                <p>
                  To cancel, reschedule, or ask about a refund, contact us at{' '}
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
