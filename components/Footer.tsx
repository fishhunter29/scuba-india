import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { Seal } from '@/components/BrandMark';
import { waGeneral } from '@/lib/whatsapp';
import { formatIndianPhone } from '@/lib/format';

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
            <div className="foot-padi">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/padi-logo.png" alt="PADI Dive Centre" width={40} height={53} loading="lazy" />
              <span className="foot-padi-no">
                <small>PADI Dive Centre</small>
                <b>#27122</b>
              </span>
            </div>
            <div className="foot-social">
              <a
                href={settings.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/social/instagram.png" alt="" width={28} height={28} loading="lazy" />
              </a>
              <a
                href={settings.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/social/facebook.png" alt="" width={28} height={28} loading="lazy" />
              </a>
              <a
                href={settings.tripadvisor || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TripAdvisor"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/social/tripadvisor.png" alt="" width={28} height={28} loading="lazy" />
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
            {settings.address_map_url ? (
              <a href={settings.address_map_url} target="_blank" rel="noopener noreferrer">
                {settings.address}
              </a>
            ) : (
              <p>{settings.address}</p>
            )}
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
            {settings.phone2 && (
              <a href={`tel:${settings.phone2.replace(/\s/g, '')}`}>{settings.phone2}</a>
            )}
            <a href={waGeneral(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
              WhatsApp: {formatIndianPhone(settings.whatsapp)}
            </a>
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
