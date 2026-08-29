import type { Section } from '@/lib/types';

const FALLBACK = {
  eyebrow: 'Why Scuba India',
  title: 'The dive shop locals send you to',
  items: [
    { title: 'PADI-certified, always', body: 'Professional instructors, equipment inspected before every dive, a strict buddy system. Safety is the standard, not the upsell.' },
    { title: 'We know every reef', body: 'Tribe Gate, Red Pillar, Lighthouse, Turtle Beach — we dive them daily and know where the coral is alive and the turtles feed.' },
    { title: 'Your dive, on camera', body: 'Every package includes HD photos and GoPro video at no extra cost. You leave with proof, not just a story.' },
  ],
};

// Copy is editable in /admin -> Sections; falls back to the built-in text.
export default function WhyUs({ section }: { section?: Section }) {
  const eyebrow = section?.eyebrow || FALLBACK.eyebrow;
  const title = section?.title || FALLBACK.title;
  const items = section?.items?.length ? section.items : FALLBACK.items;

  return (
    <section className="band why" id="why">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="sec-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        <div className="why-grid">
          {items.map((it, i) => (
            <div className="why-item reveal" key={it.title || i}>
              <div className="num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
