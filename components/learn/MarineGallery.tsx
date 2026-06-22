'use client';

// Real photos from our Havelock dives. Hover/tap reveals a short caption.
const SHOTS = [
  {
    img: '/images/gallery-01.jpg',
    name: 'Clownfish & anemone',
    fact: 'You\'ll find them at almost every site, darting in and out of their stinging anemone homes.',
  },
  {
    img: '/images/gallery-02.jpg',
    name: 'Living coral gardens',
    fact: 'Healthy hard and soft coral stretches across Havelock\'s shallow reefs.',
  },
  {
    img: '/images/gallery-03.jpg',
    name: 'Reef fish everywhere',
    fact: 'Clouds of fusiliers, sergeant majors and angelfish drift around you as you swim.',
  },
  {
    img: '/images/gallery-04.jpg',
    name: 'Reef as far as you can see',
    fact: 'The reefs roll on — there\'s always something new around the next coral outcrop.',
  },
  {
    img: '/images/gallery-05.jpg',
    name: 'Always in safe hands',
    fact: 'Your instructor stays right beside you, so you can relax and just take it all in.',
  },
  {
    img: '/images/gallery-06.jpg',
    name: 'Your dive, your photos',
    fact: 'Every dive comes with HD photos and GoPro video of you underwater — free, to keep.',
  },
];

export default function MarineGallery() {
  return (
    <div className="marine-grid">
      {SHOTS.map((s) => (
        <div className="marine-card" key={s.name} tabIndex={0}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mc-photo" src={s.img} alt={s.name} loading="lazy" />
          <div className="mc-label">{s.name}</div>
          <div className="mc-fact">{s.fact}</div>
        </div>
      ))}
    </div>
  );
}
