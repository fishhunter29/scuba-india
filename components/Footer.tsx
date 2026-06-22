import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { Seal } from '@/components/BrandMark';

function InstagramIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.3-.13-2.45-.13-2.43 0-4.1 1.48-4.1 4.2v2.34H7.7V13h2.75v8h3.05z" />
    </svg>
  );
}

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              <Seal /> Scuba India
            </div>
            <p style={{ color: 'rgba(220,239,239,.7)', maxWidth: 300, fontSize: '14.5px' }}>
              PADI dive centre on Havelock (Swarajdweep) Island, Andaman. Try dives, fun dives &amp;
              certification courses in India&apos;s clearest waters.
            </p>
            <div className="foot-social">
              <a
                href={settings.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={settings.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>
          <div className="foot-col">
            <h4>Dive</h4>
            <Link href="/#experiences">Try Scuba Dive</Link>
            <Link href="/#packages">Fun Dives</Link>
            <Link href="/#courses">PADI Courses</Link>
            <Link href="/learn-to-dive">New to diving?</Link>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <p>{settings.address}</p>
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Scuba India · Havelock (Swarajdweep)</span>
          <span className="foot-legal">
            <Link href="/privacy-policy">Privacy</Link>
            {' · '}
            <Link href="/terms-conditions">Terms</Link>
            {' · '}
            <Link href="/cancellation-policy">Cancellation</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
