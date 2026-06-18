import Link from 'next/link';
import type { Settings } from '@/lib/types';
import { waGeneral } from '@/lib/whatsapp';

export default function FinalCTA({ settings }: { settings: Settings }) {
  return (
    <section className="final" id="book">
      <div className="wrap">
        <div className="reveal">
          <h2>
            Your Andaman dive
            <br />
            is <span className="em">waiting</span>
          </h2>
          <p>Book in two minutes. Free photos. Certified guides. Still, clear water.</p>
          <div className="hero-cta">
            <Link href="/#packages" className="btn btn-primary">
              Book a Dive →
            </Link>
            <a
              href={waGeneral(settings.whatsapp)}
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
