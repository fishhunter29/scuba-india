'use client';

// Hover/tap cards of Havelock reef life. Each card shows a photo from
// public/images/marine-*.jpg (replace the placeholders with real shots — same
// filename). The coloured SVG sits behind as a fallback if an image is missing.
const LIFE = [
  {
    name: 'Clownfish',
    img: '/images/marine-clownfish.jpg',
    fact: 'Live among stinging anemones that protect them — you\'ll see them at almost every site.',
    bg: '#e07a5f',
    fish: '#ff9a5a',
  },
  {
    name: 'Green sea turtle',
    img: '/images/marine-turtle.jpg',
    fact: 'Graze on seagrass at Turtle Beach. Calm and curious — a highlight of any dive.',
    bg: '#1f8f86',
    fish: '#7fd3c0',
  },
  {
    name: 'Parrotfish',
    img: '/images/marine-parrotfish.jpg',
    fact: 'Bright and beaked, they nibble algae off the coral and keep the reef healthy.',
    bg: '#3d9bc9',
    fish: '#9fe0ff',
  },
  {
    name: 'Reef shark',
    img: '/images/marine-reef-shark.jpg',
    fact: 'Small, shy and harmless to divers. A graceful sighting at deeper Lighthouse.',
    bg: '#1a4f74',
    fish: '#bcd6e6',
  },
  {
    name: 'Butterflyfish',
    img: '/images/marine-butterflyfish.jpg',
    fact: 'Paired for life, they flit through the coral in bright yellow and white.',
    bg: '#f2a541',
    fish: '#fff0c2',
  },
  {
    name: 'Moray eel',
    img: '/images/marine-moray-eel.jpg',
    fact: 'Peer out of crevices with an open mouth — that\'s just how they breathe, not a threat.',
    bg: '#5a7d4f',
    fish: '#b6d4a0',
  },
];

export default function MarineGallery() {
  return (
    <div className="marine-grid">
      {LIFE.map((l) => (
        <div className="marine-card" key={l.name} tabIndex={0} style={{ background: l.bg }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="100" height="100" fill={l.bg} />
            <circle cx="78" cy="22" r="26" fill="rgba(255,255,255,.12)" />
            <path d="M28 58 C38 44,62 44,72 58 C62 72,38 72,28 58Z" fill={l.fish} />
            <path d="M72 58 l12 -10 v20 z" fill={l.fish} />
            <circle cx="38" cy="55" r="3" fill="#1B1A17" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mc-photo" src={l.img} alt={l.name} loading="lazy" />
          <div className="mc-label">{l.name}</div>
          <div className="mc-fact">{l.fact}</div>
        </div>
      ))}
    </div>
  );
}
