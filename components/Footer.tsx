import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { Seal } from '@/components/BrandMark';

function InstagramIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#ig-grad)" />
      <rect x="11" y="11" width="18" height="18" rx="6" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="20" cy="20" r="4.6" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="26.6" cy="13.4" r="1.5" fill="#fff" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.12 5.32H17V2.14C16.4 2.06 15.55 2 14.56 2c-2.06 0-3.47 1.3-3.47 3.69v2.62H8v3.34h3.09V22h3.69v-8.35h3.27l.47-3.34h-3.74V6.02c0-.97.26-1.63 1.85-1.63z"
      />
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
          <span>Privacy · Terms · Cancellation</span>
        </div>
      </div>
    </footer>
  );
}
