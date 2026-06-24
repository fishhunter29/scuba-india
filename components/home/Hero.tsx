import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { waGeneral } from '@/lib/whatsapp';
import { HERO_BLUR } from '@/lib/heroBlur';

export default function Hero({
  settings,
  tryFrom = '₹2,500',
  tryFromSite,
}: {
  settings: Settings;
  tryFrom?: string;
  tryFromSite?: string | null;
}) {
  return (
    <header className="hero hero--photo">
      {/* background photo (desktop/mobile), painted over the shader in the hero only */}
      <div className="hero-bg" style={{ backgroundImage: `url(${HERO_BLUR})` }}>
        <picture>
          <source media="(max-width:820px)" type="image/webp" srcSet="/images/hero-bg-mobile.webp" />
          <source media="(max-width:820px)" srcSet="/images/hero-bg-mobile.jpg" />
          <source type="image/webp" srcSet="/images/hero-bg-desktop.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-bg-desktop.jpg" alt="" fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-social">
          <a href={settings.instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/social/instagram.png" alt="" width={26} height={26} loading="lazy" />
          </a>
          <a href={settings.facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/social/facebook.png" alt="" width={26} height={26} loading="lazy" />
          </a>
          <a href={settings.tripadvisor || '#'} target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/social/tripadvisor.png" alt="" width={26} height={26} loading="lazy" />
          </a>
        </div>
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
          free. From <b>{tryFrom}</b>
          {tryFromSite ? ` at ${tryFromSite}` : ''}.
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
          <span className="trust-padi">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/padi-logo.png" alt="PADI Dive Centre" width={38} height={50} loading="eager" />
            Dive Centre <b className="padi-no">#27122</b>
          </span>
          <span>
            <span className="star">★</span> <b>{settings.rating_avg}</b> on Google ·{' '}
            {settings.review_count > 0 ? settings.review_count : '[XX]'}+ reviews
          </span>
          <span>
            <b>{settings.dives_guided}+</b> dives guided · since <b>2011</b>
          </span>
          <span>
            Based in <b>Havelock</b>
          </span>
        </div>
      </div>
    </header>
  );
}
