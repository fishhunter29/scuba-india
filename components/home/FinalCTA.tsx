import Link from 'next/link';
import type { Settings, Section } from '@/lib/types';
import { waGeneral } from '@/lib/whatsapp';

export default function FinalCTA({ settings, section }: { settings: Settings; section?: Section }) {
  // Editable in /admin -> Sections. The final word is accented, as in the original.
  const title = section?.title || 'Your Andaman dive is waiting';
  const words = title.trim().split(' ');
  const lead = words.slice(0, -1).join(' ');
  const last = words[words.length - 1];
  const body = section?.subtitle || 'Book in two minutes. Free photos. Certified guides. Still, clear water.';

  return (
    <section className="final" id="book">
      <div className="wrap">
        <div className="reveal">
          <h2>
            {lead} <span className="em">{last}</span>
          </h2>
          <p>{body}</p>
          <div className="hero-cta">
            <Link href="/dives/try-dive" className="btn btn-primary">
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
