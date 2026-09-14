import Link from 'next/link';
import type { Reef, Section, Dive } from '@/lib/types';
import { reefPackage } from '@/lib/reefs';
import { formatPrice, reefImage } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

const FALLBACK: Pick<Reef, 'key' | 'name' | 'depth_m' | 'level' | 'best_for' | 'life' | 'kinds' | 'price' | 'duration_label'>[] = [
  { key: 'tribe', name: 'Tribe Gate', depth_m: 12, level: 'Beginner-friendly', best_for: 'First dives', life: ['Clownfish', 'Green turtles'], kinds: ['discover'], price: null, duration_label: null },
  { key: 'red', name: 'Red Pillar', depth_m: 14, level: 'All levels', best_for: 'Discover Scuba & snorkelling', life: ['Fusiliers', 'Coral pillars'], kinds: ['discover', 'snorkel'], price: null, duration_label: null },
  { key: 'light', name: 'Lighthouse', depth_m: 18, level: 'Confident divers', best_for: 'Fun & night dives', life: ['Snapper schools', 'Reef sharks'], kinds: ['fun', 'night'], price: null, duration_label: null },
  { key: 'turtle', name: 'Turtle Beach', depth_m: 16, level: 'All levels', best_for: 'Turtle encounters', life: ['Green turtles', 'Stingrays'], kinds: ['discover', 'fun'], price: null, duration_label: null },
];

const HOMEPAGE_MAX = 4; // keep the row to one tidy line; the rest live on /reefs

// Homepage: one simple bookable package per reef. The admin price wins; with
// none set we show the cheapest real dive that runs there, so the card always
// agrees with the rate sheet.
export default function ReefTeaser({
  reefs = [],
  dives = [],
  section,
  whatsapp = '',
}: {
  reefs?: Reef[];
  dives?: Dive[];
  section?: Section;
  whatsapp?: string;
}) {
  const source = reefs.length ? reefs : (FALLBACK as Reef[]);
  const featured = source.filter((r) => r.featured);
  const list = (featured.length ? featured : source).slice(0, HOMEPAGE_MAX);
  const more = source.length - list.length;

  const eyebrow = section?.eyebrow || "Where you'll dive";
  const title = section?.title || 'Pick your reef. Book in a minute.';
  const body =
    section?.subtitle ||
    "Havelock's (Swaraj Dweep's) healthiest sites, matched to your experience — gentle shallow coral for your first breath, deeper drifts for the certified.";

  return (
    <section className="band sites" id="sites">
      <div className="wrap">
        <div className="sec-head reveal" style={{ maxWidth: 620 }}>
          <div className="sec-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>

        <div className="pk-grid reef-pk-grid reveal">
          {list.map((r) => {
            const img = reefImage(r.image_url, r.key);
            const pkg = reefPackage(r, dives);
            const life = (Array.isArray(r.life) ? r.life : []).slice(0, 3).join(' · ');

            return (
              <div className="pk reef-pk" key={r.key}>
                <div className="pk-img">
                  <picture>
                    {img.webp && <source type="image/webp" srcSet={img.webp} />}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={`${r.name} reef, Havelock`} loading="lazy" decoding="async" />
                  </picture>
                </div>
                <span className="tier">{pkg.badge}</span>
                <span className="dur">{pkg.duration}</span>

                <h3 className="pk-name">
                  <Link href="/reefs">{r.name}</Link>
                </h3>
                <p className="reef-pk-meta">
                  {r.depth_m}m · {r.level}
                </p>
                {life && (
                  <p className="reef-pk-life">
                    <span>You&apos;ll see</span> {life}
                  </p>
                )}

                <div className="pk-foot">
                  <span className="pk-price">
                    {formatPrice(pkg.price, pkg.price == null)}
                    <small>{pkg.price == null ? 'contact us' : pkg.unit}</small>
                  </span>
                  <a
                    className="pk-book"
                    href={waLink(
                      whatsapp,
                      `Hi Scuba India, I'd like to dive at ${r.name}${pkg.price != null ? ` — ${pkg.name} (₹${pkg.price.toLocaleString('en-IN')})` : ''}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book on WhatsApp →
                  </a>
                </div>
                <Link href="/reefs" className="pk-more">
                  Explore this reef
                </Link>
              </div>
            );
          })}
        </div>

        <div className="reef-teaser-cta reveal">
          <Link href="/reefs" className="btn btn-primary">
            {more > 0 ? `See all ${source.length} reefs →` : 'Explore the reefs →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
