import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { waGeneral } from '@/lib/whatsapp';

export default function Hero({
  settings,
  tryFrom = '₹2,500',
}: {
  settings: Settings;
  tryFrom?: string;
}) {
  return (
    <header className="hero">
      <div className="eyebrow">Havelock (Swarajdweep) · Andaman</div>
      <h1>
        <span className="stroke-reveal" style={{ animationDelay: '.2s' }}>
          Breathe underwater
        </span>
        <br />
        <span className="stroke-reveal em" style={{ animationDelay: '.6s' }}>
          in Havelock
        </span>
      </h1>
      <p className="hero-sub">
        Try scuba diving in Andaman&apos;s clearest reefs — <b>no experience needed</b>. A PADI
        instructor is by your side the whole time, and you keep the HD photos &amp; GoPro video,
        free. From <b>{tryFrom}</b>.
      </p>
      <div className="hero-cta">
        <Link href="/#experiences" className="btn btn-primary">
          Book a Try Dive from {tryFrom} →
        </Link>
        <a
          href={waGeneral(settings.whatsapp)}
          className="btn btn-ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat on WhatsApp
        </a>
      </div>
      <div className="trust-inline">
        <span>
          <span className="star">★</span> <b>{settings.rating_avg}</b> on Google ·{' '}
          {settings.review_count > 0 ? settings.review_count : '[XX]'}+ reviews
        </span>
        <span>
          <b>PADI</b> Dive Centre
        </span>
        <span>
          <b>{settings.dives_guided}+</b> dives guided · since <b>2011</b>
        </span>
        <span>
          Based in <b>Havelock</b>
        </span>
      </div>
    </header>
  );
}
