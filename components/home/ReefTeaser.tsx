import Link from 'next/link';
import type { Reef, Section } from '@/lib/types';

const FALLBACK = [
  { name: 'Tribe Gate', meta: '12m · Beginner-friendly', image: '/images/reef-tribe' },
  { name: 'Red Pillar', meta: '14m · All levels', image: '/images/reef-red' },
  { name: 'Lighthouse', meta: '18m · Confident divers', image: '/images/reef-light' },
  { name: 'Turtle Beach', meta: '16m · All levels', image: '/images/reef-turtle' },
];

// Homepage teaser only — the full interactive explorer lives at /reefs.
export default function ReefTeaser({ reefs = [], section }: { reefs?: Reef[]; section?: Section }) {
  const list = reefs.length
    ? reefs.map((r) => ({
        name: r.name,
        meta: `${r.depth_m}m · ${r.level}`,
        image: r.image_url || `/images/reef-${r.key}`,
      }))
    : FALLBACK;
  const eyebrow = section?.eyebrow || "Where you'll dive";
  const title = section?.title || 'Four reefs. Every level of diver.';
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

        <div className="reef-teaser-grid reveal">
          {list.map((r) => (
            <Link href="/reefs" className="reef-teaser" key={r.name}>
              <span className="reef-teaser-img">
                <picture>
                  <source type="image/webp" srcSet={`${r.image}.webp`} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${r.image}.jpg`} alt={`${r.name} reef, Havelock`} loading="lazy" decoding="async" />
                </picture>
              </span>
              <span className="reef-teaser-name">{r.name}</span>
              <span className="reef-teaser-meta">{r.meta}</span>
            </Link>
          ))}
        </div>

        <div className="reef-teaser-cta reveal">
          <Link href="/reefs" className="btn btn-primary">
            Explore the reefs →
          </Link>
        </div>
      </div>
    </section>
  );
}
