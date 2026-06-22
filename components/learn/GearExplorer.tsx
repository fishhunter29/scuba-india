'use client';

import { useEffect, useRef, useState } from 'react';

type GearItem = {
  id: string;
  name: string;
  img: string;
  alt: string;
  pos: { top: string; left: string };
  body: string;
};

// Marker positions are percentages over /images/Diver.png — nudge if they
// drift from mask/regulator/tank/BCD/fins on the actual illustration.
const GEAR: GearItem[] = [
  {
    id: 'mask',
    name: 'Mask',
    img: '/images/Mask.png',
    alt: 'Diving mask illustration',
    pos: { top: '14%', left: '50%' },
    body: "Lets you see clearly underwater. It seals gently against your face so everything stays sharp and dry. You'll get used to it in seconds.",
  },
  {
    id: 'regulator',
    name: 'Regulator',
    img: '/images/Regulator.png',
    alt: 'Diving regulator illustration',
    pos: { top: '21%', left: '58%' },
    body: 'Your air supply, and the cleverest bit of kit. It turns the high-pressure air in your tank into easy, normal breaths. In, out, slow — exactly like breathing on land. (The only rule: never hold your breath. Just breathe.)',
  },
  {
    id: 'tank',
    name: 'Tank',
    img: '/images/Tank.png',
    alt: 'Air tank illustration',
    pos: { top: '33%', left: '27%' },
    body: 'Your air supply. It looks heavy on land but feels light underwater, and your instructor handles carrying and fitting it. You just wear it and breathe.',
  },
  {
    id: 'bcd',
    name: 'BCD — the jacket',
    img: '/images/BCD.png',
    alt: 'BCD buoyancy jacket illustration',
    pos: { top: '47%', left: '50%' },
    body: "This controls your floating. A little air in and you rise; a little out and you sink — gently, in control. This is why you don't need to swim. Your instructor manages it for you.",
  },
  {
    id: 'fins',
    name: 'Fins',
    img: '/images/Fins.png',
    alt: 'Diving fins illustration',
    pos: { top: '92%', left: '50%' },
    body: "Long flippers for your feet. Slow, lazy kicks move you through the water with almost no effort. There's no rushing anywhere down there.",
  },
];

export default function GearExplorer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function close(returnFocusTo: number | null) {
    setOpenIndex(null);
    if (returnFocusTo !== null) markerRefs.current[returnFocusTo]?.focus();
  }

  useEffect(() => {
    if (openIndex === null) return;
    closeRefs.current[openIndex]?.focus();
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close(openIndex);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % GEAR.length));
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : (i - 1 + GEAR.length) % GEAR.length));
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  return (
    <div className="gear-explorer">
      <div className="gear-diagram">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Diver.png"
          alt="A fully geared scuba diver, numbered 1 to 5 marking the mask, regulator, tank, BCD and fins"
          loading="lazy"
        />
        {GEAR.map((g, i) => (
          <button
            key={g.id}
            ref={(el) => {
              markerRefs.current[i] = el;
            }}
            type="button"
            className="gear-marker"
            style={{ top: g.pos.top, left: g.pos.left }}
            aria-label={`${g.name} — tap to learn more`}
            aria-haspopup="dialog"
            onClick={() => setOpenIndex(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {GEAR.map((g, i) => (
        <div
          key={g.id}
          className="gear-modal-backdrop"
          style={{ display: openIndex === i ? 'flex' : 'none' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close(i);
          }}
        >
          <div
            className="gear-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`gear-modal-title-${g.id}`}
          >
            <button
              ref={(el) => {
                closeRefs.current[i] = el;
              }}
              type="button"
              className="gear-modal-close"
              aria-label="Close"
              onClick={() => close(i)}
            >
              ×
            </button>
            <div className="gear-modal-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="gear-modal-img" src={g.img} alt={g.alt} loading="lazy" />
            </div>
            <div className="gear-modal-num">
              {i + 1} / {GEAR.length}
            </div>
            <h3 id={`gear-modal-title-${g.id}`}>{g.name}</h3>
            <p>{g.body}</p>
            <div className="gear-modal-nav">
              <button
                type="button"
                className="gear-modal-arrow"
                aria-label="Previous piece"
                onClick={() => setOpenIndex((i + GEAR.length - 1) % GEAR.length)}
              >
                ← Prev
              </button>
              <button
                type="button"
                className="gear-modal-arrow"
                aria-label="Next piece"
                onClick={() => setOpenIndex((i + 1) % GEAR.length)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
