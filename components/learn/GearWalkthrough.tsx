'use client';

import { useState } from 'react';

// Each item carries a colour swatch matching how that gear appears in the
// illustration (public/images/scuba-gears.jpeg), so the list maps to the
// picture without dots overlapping the equipment.
const GEAR = [
  {
    name: 'Mask',
    tag: 'so you see clearly',
    color: '#16344a',
    body: 'A snug mask seals over your eyes and nose so you can see clearly underwater. We help you fit it so no water gets in — and clearing it is one of the first easy skills we teach you.',
  },
  {
    name: 'Regulator',
    tag: 'so you breathe easily',
    color: '#ef8a2c',
    body: 'The mouthpiece you breathe through (the orange hose). It delivers air from your tank at exactly the right pressure — you just breathe normally, in and out.',
  },
  {
    name: 'Cylinder (air tank)',
    tag: 'so you never run low on air',
    color: '#f2c14e',
    body: 'Holds your breathing air. For a try dive it carries far more air than you\'ll use — there is always plenty to breathe, and your guide watches it the whole time.',
  },
  {
    name: 'BCD (buoyancy vest)',
    tag: 'so you float, effortlessly',
    color: '#3f7d4a',
    body: 'An inflatable jacket that lets you float at the surface and hover effortlessly underwater. A button adds or releases air so you stay comfortable and in control.',
  },
  {
    name: 'Weight belt',
    tag: 'so you sink gently, in control',
    color: '#9aa3a8',
    body: 'A belt with small weights that helps you sink gently and stay balanced underwater. Your guide sets exactly the right amount for you — no guesswork.',
  },
  {
    name: 'Fins',
    tag: 'so you move with ease',
    color: '#5fd0e0',
    body: 'Worn on your feet so a gentle kick glides you through the water. No tiring arm-paddling — slow, relaxed legs are all it takes.',
  },
];

export default function GearWalkthrough() {
  const [open, setOpen] = useState(0);

  return (
    <div className="gear">
      <div className="gear-photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="gear-photo"
          src="/images/scuba-gears.jpeg"
          alt="A scuba diver fully kitted out, with mask, regulator, cylinder, BCD, weight belt and fins"
        />
      </div>
      <div className="gear-list">
        {GEAR.map((g, i) => (
          <div key={g.name} className={`gear-row${open === i ? ' open' : ''}`}>
            <button
              className="gear-q"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span className="gear-swatch" style={{ background: g.color }} aria-hidden="true" />
              <span className="gear-name">
                {g.name}
                <span className="gear-tag">{g.tag}</span>
              </span>
              <span className="gear-chev" aria-hidden="true">
                +
              </span>
            </button>
            <div className="gear-a">
              <p>{g.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
