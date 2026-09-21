import Link from 'next/link';
import type { Reef, Section, Dive } from '@/lib/types';
import { reefPackage } from '@/lib/reefs';
import { formatPrice, reefImage } from '@/lib/format';
import { waLink } from '@/lib/whatsapp';

const FALLBACK: Pick<Reef, 'key' | 'name' | 'depth_m' | 'level' | 'best_for' | 'image_url' | 'life' | 'kinds' | 'price' | 'duration_label'>[] = [
  { key: 'red', name: 'Red Pillar', depth_m: 12, level: 'All levels', best_for: 'First dives', image_url: '/images/gallery/g28', life: ['Ruby snapper', 'Fusiliers', 'Coral pillars'], kinds: ['discover'], price: 3000, duration_label: null },
  { key: 'tribe', name: 'Tribe Gate', depth_m: 12, level: 'All levels', best_for: 'First dives', image_url: '/images/gallery/g29', life: ['Clownfish', 'Green turtles', 'Anemones'], kinds: ['discover'], price: 3500, duration_label: null },
  { key: 'purple', name: 'Purple Ledge', depth_m: 12, level: 'All levels', best_for: 'Boat dives & photography', image_url: '/images/gallery/g17', life: ['Soft corals', 'Lionfish', 'Sea fans'], kinds: ['discover'], price: 4000, duration_label: null },
  { key: 'light', name: 'Lighthouse', depth_m: 12, level: 'All levels', best_for: 'Bigger fish', image_url: '/images/gallery/g26', life: ['Trevally', 'Moorish idols', 'Snapper schools'], kinds: ['discover'], price: 4500, duration_label: null },
  { key: 'slope', name: 'Slope', depth_m: 12, level: 'All levels', best_for: 'Boat dives', image_url: '/images/gallery/g25', life: ['Mantis shrimp', 'Batfish', 'Staghorn coral'], kinds: ['discover'], price: 4500, duration_label: null },
  { key: 'juvis', name: "Juvi's", depth_m: 12, level: 'All levels', best_for: 'Bigger encounters', image_url: '/images/gallery/g27', life: ['White-tip reef sharks', 'Potato coral'], kinds: ['discover'], price: 5000, duration_label: null },
  { key: 'aquarium', name: 'Aquarium', depth_m: 12, level: 'All levels', best_for: 'Boat dives & snorkelling', image_url: '/images/gallery/g08', life: ['Snapper schools', 'Fusiliers', 'Coral bommies'], kinds: ['discover'], price: 6500, duration_label: null },
  { key: 'turtle', name: 'Turtle Beach', depth_m: 12, level: 'All levels', best_for: 'Turtle encounters', image_url: '/images/gallery/g06', life: ['Green turtles', 'Stingrays', 'Seagrass'], kinds: ['discover'], price: 7500, duration_label: null },
];

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
  // Every reef shows here — choosing the reef is the first decision a visitor
  // makes. A reef can still be kept off the homepage by unticking it in admin.
  const source = (reefs.length ? reefs : (FALLBACK as Reef[])).filter((r) => r.active !== false);
  const featured = source.filter((r) => r.featured);
  const list = featured.length ? featured : source;

  const eyebrow = section?.eyebrow || "Where you'll dive";
  const title = section?.title || 'Choose your reef';
  const body =
    section?.subtitle ||
    "Every dive we run goes out by boat to one of these reefs, to a maximum depth of 12 metres. Pick the one you like and book it in a minute — no experience needed at any of them.";

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
            Compare every reef →
          </Link>
        </div>
      </div>
    </section>
  );
}
