import Link from 'next/link';
import Image from 'next/image';
import type { Dive } from '@/lib/types';
import { inferDiveKind } from '@/lib/types';
import { CURATED_SLUGS, kindToCategorySlug, DIVE_CATEGORIES } from '@/lib/categories';
import { formatPrice, diveDuration } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

const KIND_IMG: Record<string, string> = {
  try_shore: 'type-tryshore', discover: 'type-dsdboat', fun: 'type-fun',
  night: 'type-night', snorkel: 'type-snorkel', island: 'type-island', charter: 'type-dsdboat',
};
const cardImage = (d: Dive) => d.image_url ?? `/images/${KIND_IMG[inferDiveKind(d)] ?? 'type-dsdboat'}.jpg`;

// The homepage shows a curated handful — not the whole catalogue. Picks come
// from CURATED_SLUGS; if one isn't in the DB we fall back to the cheapest dive
// in that category so the row is never short.
function curate(dives: Dive[]): Dive[] {
  const active = dives.filter((d) => d.active !== false);
  const picked: Dive[] = [];
  for (const slug of CURATED_SLUGS) {
    const hit = active.find((d) => d.slug === slug);
    if (hit) picked.push(hit);
  }
  for (const cat of DIVE_CATEGORIES) {
    if (picked.some((p) => cat.kinds.includes(inferDiveKind(p)))) continue;
    const cheapest = active
      .filter((d) => cat.kinds.includes(inferDiveKind(d)) && d.price != null && !d.on_request)
      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];
    if (cheapest) picked.push(cheapest);
  }
  return picked.slice(0, 4);
}

// Some products are priced per couple / per group rather than per person —
// take the unit from the dive's duration label when it says so.
function priceUnit(d: Dive): string {
  const l = (d.duration_label ?? '').toLowerCase();
  if (l.includes('per couple')) return 'per couple';
  if (l.includes('per group')) return 'per group';
  if (l.includes('private boat')) return 'per boat';
  return 'per person';
}

export default function CuratedPicks({ dives, whatsapp }: { dives: Dive[]; whatsapp: string }) {
  const picks = curate(dives);
  if (!picks.length) return null;

  return (
    <section className="band curated" id="packages">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">Most booked</div>
          <h2>Our most popular dives</h2>
          <p>
            A quick pick of what most guests book — the easiest way in for beginners, the best value
            for certified divers, and a day on the water for everyone else. Browse a category above
            for the full list, or see the{' '}
            <Link href="/prices">complete price list</Link>.
          </p>
        </div>

        <div className="pk-grid reveal">
          {picks.map((d, i) => (
            <div className={`pk${i === 0 ? ' feat' : ''}`} key={d.id}>
              <div className="pk-img">
                <Image src={cardImage(d)} alt={d.name} fill sizes="(max-width: 768px) 100vw, 300px" />
              </div>
              {i === 0 && <span className="tier">MOST POPULAR</span>}
              <span className="dur">{diveDuration(d)}</span>
              <h3 className="pk-name">
                <Link href={`/${d.slug}`}>{d.name}</Link>
              </h3>
              {d.pitch && <p className="pk-pitch">{d.pitch}</p>}
              <div className="pk-foot">
                <span className="pk-price">
                  {formatPrice(d.price, d.on_request)}
                  <small>{d.on_request ? 'contact us' : priceUnit(d)}</small>
                </span>
                <a
                  className="pk-book"
                  href={waLink(
                    whatsapp,
                    `Hi Scuba India, I'd like to book the ${d.name}${d.price != null && !d.on_request ? ` (₹${d.price.toLocaleString('en-IN')})` : ''}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.on_request ? 'Enquire →' : 'Book on WhatsApp →'}
                </a>
              </div>
              <Link href={`/dives/${kindToCategorySlug(inferDiveKind(d))}`} className="pk-more">
                See all {DIVE_CATEGORIES.find((c) => c.kinds.includes(inferDiveKind(d)))?.plural ?? 'dives'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
