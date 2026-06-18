import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { waGeneral } from '@/lib/whatsapp';

export default function Hero({ settings }: { settings: Settings }) {
  return (
    <header className="hero">
      <div className="vert-label">Havelock · into the deep</div>
      <div className="eyebrow">Havelock Island · Andaman</div>
      <h1>
        <span className="stroke-reveal" style={{ animationDelay: '.2s' }}>
          Still water,
        </span>
        <br />
        <span className="stroke-reveal em" style={{ animationDelay: '.6s' }}>
          deep colour
        </span>
      </h1>
      <p className="hero-sub">
        PADI-certified scuba diving in Havelock&apos;s clearest reefs. No experience needed — we
        guide you every second below the surface.
      </p>
      <div className="hero-cta">
        <Link href="/#experiences" className="btn btn-primary">
          Book a Try Dive →
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
