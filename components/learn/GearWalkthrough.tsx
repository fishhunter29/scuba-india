'use client';

import { useState } from 'react';

// Hotspots positioned as %s over public/images/scuba-gears.jpeg (a landscape
// diver illustration). Tweak x/y if any dot drifts off its gear piece.
const GEAR = [
  {
    x: 91,
    y: 23,
    label: 'Mask',
    title: 'Mask',
    body: 'A snug mask seals over your eyes and nose so you can see clearly underwater. We help you fit it so no water gets in — and clearing it is one of the first easy skills we teach you.',
  },
  {
    x: 84,
    y: 35,
    label: 'Reg',
    title: 'Regulator',
    body: 'The mouthpiece you breathe through (the orange hose). It delivers air from your tank at exactly the right pressure — you just breathe normally, in and out.',
  },
  {
    x: 66,
    y: 41,
    label: 'Tank',
    title: 'Cylinder (air tank)',
    body: 'Holds your breathing air. For a try dive it carries far more air than you\'ll use — there is always plenty to breathe, and your guide watches it the whole time.',
  },
  {
    x: 78,
    y: 47,
    label: 'BCD',
    title: 'BCD (buoyancy vest)',
    body: 'An inflatable jacket that lets you float at the surface and hover effortlessly underwater. A button adds or releases air so you stay comfortable and in control.',
  },
  {
    x: 73,
    y: 60,
    label: 'Belt',
    title: 'Weight belt',
    body: 'A belt with small weights that helps you sink gently and stay balanced underwater. Your guide sets exactly the right amount for you — no guesswork.',
  },
  {
    x: 17,
    y: 57,
    label: 'Fins',
    title: 'Fins',
    body: 'Worn on your feet so a gentle kick glides you through the water. No tiring arm-paddling — slow, relaxed legs are all it takes.',
  },
];

export default function GearWalkthrough() {
  const [active, setActive] = useState(0);
  const g = GEAR[active];

  return (
    <div className="gear">
      <div className="gear-stage">
        <div className="gear-photo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="gear-photo" src="/images/scuba-gears.jpeg" alt="A scuba diver fully kitted out, with mask, regulator, cylinder, BCD, weight belt and fins" />
          {GEAR.map((item, i) => (
            <button
              key={item.label}
              className={`gear-hot${active === i ? ' active' : ''}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              aria-label={item.title}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="gear-info">
        <h3>{g.title}</h3>
        <p>{g.body}</p>
        <p className="hint">Tap the numbered dots on the diver to explore each piece of gear.</p>
      </div>
    </div>
  );
}
