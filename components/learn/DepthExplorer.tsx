'use client';

import { useState } from 'react';

const STAGES = [
  {
    max: 0,
    name: 'The surface',
    light: 'Full daylight',
    pressure: '1 atmosphere — normal',
    see: 'You float on the surface in your gear, breathing easily through your regulator before you go down.',
  },
  {
    max: 5,
    name: 'Just below',
    light: 'Bright, warm light',
    pressure: '1.5 atmospheres',
    see: 'Sunbeams cut through the water. Clownfish, anemones and shoals of small reef fish are all around you. Most try dives stay around here.',
  },
  {
    max: 12,
    name: 'Shallow reef',
    light: 'Plenty of light, colours rich',
    pressure: '2.2 atmospheres',
    see: 'Coral gardens in full colour — parrotfish, butterflyfish, the odd turtle. This is Tribe Gate, where most first dives happen.',
  },
  {
    max: 18,
    name: 'Deeper reef',
    light: 'Cooler blue, reds start to fade',
    pressure: '2.8 atmospheres',
    see: 'Bigger fish, schools of snapper, maybe a reef shark cruising past. This is Lighthouse depth — for confident or certified divers.',
  },
  {
    max: 25,
    name: 'Open water',
    light: 'Deep blue, dim',
    pressure: '3.5 atmospheres',
    see: 'The reef drops away into blue. Advanced Open Water divers explore here. Colours look blue-grey without a torch.',
  },
  {
    max: 30,
    name: 'Recreational limit',
    light: 'Dark blue, torch needed for colour',
    pressure: '4 atmospheres',
    see: 'The deepest recreational divers go. Calm, quiet, otherworldly — and as deep as PADI Advanced training takes you.',
  },
];

function stageFor(depth: number) {
  for (const s of STAGES) if (depth <= s.max) return s;
  return STAGES[STAGES.length - 1];
}

// scene geometry
const SURFACE_Y = 52;
const BOTTOM_Y = 452;
const TRAVEL = BOTTOM_Y - SURFACE_Y;

export default function DepthExplorer() {
  const [depth, setDepth] = useState(0);
  const stage = stageFor(depth);
  const diverY = (depth / 30) * TRAVEL; // translateY for the diver group

  return (
    <div className="depth-explorer">
      <div className="de-stage">
        <svg className="de-ocean" viewBox="0 0 340 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cross-section of the ocean from the surface to 30 metres">
          <defs>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cdeef6" />
              <stop offset="14%" stopColor="#8fd4e6" />
              <stop offset="34%" stopColor="#4fa9c9" />
              <stop offset="58%" stopColor="#2c7ba6" />
              <stop offset="80%" stopColor="#164e76" />
              <stop offset="100%" stopColor="#0a2c46" />
            </linearGradient>
            <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="sun" cx="78%" cy="6%" r="40%">
              <stop offset="0%" stopColor="#fff7e0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fff7e0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* water */}
          <rect x="0" y="0" width="340" height="480" fill="url(#water)" />
          <rect x="0" y="0" width="340" height="480" fill="url(#sun)" />

          {/* god rays */}
          <g className="de-rays">
            <polygon points="120,0 150,0 90,480 40,480" fill="url(#ray)" />
            <polygon points="210,0 230,0 200,480 165,480" fill="url(#ray)" />
            <polygon points="285,0 300,0 320,480 290,480" fill="url(#ray)" />
          </g>

          {/* surface ripples */}
          <path d="M0 50 Q30 40 60 50 T120 50 T180 50 T240 50 T300 50 T360 50 V0 H0 Z" fill="#eaf8fc" opacity="0.5" />
          <path d="M0 54 Q34 46 68 54 T136 54 T204 54 T272 54 T340 54" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5" />

          {/* depth ticks */}
          <g fontFamily="var(--mono), monospace" fontSize="11" fill="#ffffff" opacity="0.75">
            {[0, 10, 20, 30].map((m) => {
              const y = SURFACE_Y + (m / 30) * TRAVEL;
              return (
                <g key={m}>
                  <line x1="0" y1={y} x2="14" y2={y} stroke="#ffffff" strokeOpacity="0.5" />
                  <text x="18" y={y + 4}>{m}m</text>
                </g>
              );
            })}
          </g>

          {/* ---- marine life at depth ---- */}
          {/* shallow: anemone + clownfish (~5m) */}
          <g transform="translate(250 120)">
            <g className="de-sway">
              <path d="M0 24 q-8 -22 -2 -24 q4 -1 5 12 q3 -16 9 -14 q4 2 -1 14 q9 -12 12 -7 q3 4 -7 12 q14 -4 13 2 q-1 5 -14 5 z" fill="#d56fae" opacity="0.92" />
            </g>
            <g transform="translate(-8 18)">
              <ellipse cx="0" cy="0" rx="13" ry="8" fill="#f08a2c" />
              <rect x="-6" y="-8" width="4" height="16" rx="2" fill="#fff" />
              <rect x="4" y="-8" width="4" height="16" rx="2" fill="#fff" />
              <path d="M11 0 l9 -6 v12 z" fill="#f08a2c" />
              <circle cx="-8" cy="-1" r="1.6" fill="#1b1a17" />
            </g>
          </g>

          {/* shallow coral garden (~12m) */}
          <g transform="translate(40 230)">
            <path d="M0 30 V12 M0 20 q-7 -3 -8 -12 M0 16 q8 -2 9 -12" stroke="#1f9b8e" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="-8" cy="-2" r="3.5" fill="#e07a5f" />
            <circle cx="9" cy="2" r="3.5" fill="#f2a541" />
            <circle cx="0" cy="-9" r="3.5" fill="#3d9bc9" />
          </g>

          {/* parrotfish (~12m) */}
          <g transform="translate(120 250)">
            <ellipse cx="0" cy="0" rx="18" ry="10" fill="#3aa6c9" />
            <ellipse cx="0" cy="0" rx="18" ry="10" fill="#2bc7a8" opacity="0.4" />
            <path d="M16 0 l12 -8 v16 z" fill="#2bc7a8" />
            <circle cx="-11" cy="-2" r="2" fill="#fff" />
            <circle cx="-11" cy="-2" r="1" fill="#1b1a17" />
          </g>

          {/* sea turtle (~14m) */}
          <g transform="translate(245 270)">
            <ellipse cx="0" cy="0" rx="20" ry="15" fill="#3f7d4a" />
            <path d="M-12 -6 l6 4 -3 7 M4 -8 l7 3 -2 8 M-2 -2 l5 2 -1 6" stroke="#2c5a36" strokeWidth="2" fill="none" opacity="0.7" />
            <circle cx="20" cy="-4" r="6" fill="#4a8c56" />
            <ellipse cx="-16" cy="8" rx="9" ry="5" fill="#4a8c56" transform="rotate(25 -16 8)" />
            <ellipse cx="14" cy="12" rx="8" ry="4" fill="#4a8c56" transform="rotate(-20 14 12)" />
          </g>

          {/* fish school (~18m) */}
          <g transform="translate(70 330)" fill="#bfe0ea" opacity="0.85">
            {[[0, 0], [14, -6], [26, 4], [40, -3], [10, 10], [34, 12], [52, 6]].map(([x, y], i) => (
              <path key={i} d={`M${x} ${y} q5 -4 10 0 q-5 4 -10 0 z`} />
            ))}
          </g>

          {/* reef shark (~24m) */}
          <g transform="translate(210 360)" className="de-shark">
            <path d="M-40 0 q22 -16 70 -2 q-6 3 -14 3 q10 4 14 12 q-16 -8 -24 -6 q-30 4 -46 -7 z" fill="#5c7184" opacity="0.85" />
            <path d="M8 -10 l8 -14 4 16 z" fill="#5c7184" opacity="0.85" />
            <circle cx="22" cy="0" r="1.6" fill="#0a2c46" />
          </g>

          {/* sea floor + bottom coral + ray (~30m) */}
          <path d="M0 452 Q90 438 180 450 T340 446 V480 H0 Z" fill="#0e3a55" />
          <path d="M0 462 Q120 452 240 460 T340 458 V480 H0 Z" fill="#0a2c46" />
          <g transform="translate(60 446)">
            <path d="M0 6 V-12 M0 -2 q-9 -3 -10 -14 M0 -6 q10 -3 12 -15" stroke="#1f9b8e" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M16 6 V-8 M16 0 q8 -2 9 -12" stroke="#e07a5f" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
          </g>
          <g transform="translate(225 452)" opacity="0.8">
            <ellipse cx="0" cy="0" rx="24" ry="9" fill="#243b4f" />
            <path d="M22 0 q14 0 22 -6 q-10 9 -22 6 z" fill="#243b4f" />
          </g>

          {/* rising bubbles */}
          <g className="de-bubbles" fill="#ffffff" opacity="0.5">
            <circle className="de-bubble b1" cx="150" cy="0" r="3" />
            <circle className="de-bubble b2" cx="158" cy="0" r="2" />
            <circle className="de-bubble b3" cx="146" cy="0" r="2.4" />
          </g>

          {/* ---- the diver (glides to selected depth) ---- */}
          <g className="de-diver" style={{ transform: `translateY(${diverY}px)` }}>
            {/* guide line + depth badge */}
            <line x1="150" y1={SURFACE_Y} x2="312" y2={SURFACE_Y} stroke="#ffffff" strokeWidth="1" strokeDasharray="3 4" opacity="0.55" />
            <g transform={`translate(298 ${SURFACE_Y})`}>
              <rect x="-2" y="-13" width="44" height="26" rx="13" fill="#C8472E" />
              <text x="20" y="5" textAnchor="middle" fontFamily="var(--mono), monospace" fontSize="13" fontWeight="700" fill="#fff">{depth}m</text>
            </g>
            {/* diver silhouette (descending, head-down-ish) */}
            <g transform={`translate(150 ${SURFACE_Y}) scale(1.05)`}>
              <ellipse cx="0" cy="0" rx="20" ry="20" fill="#ffffff" opacity="0.12" />
              <g fill="#14304a">
                <circle cx="-2" cy="-12" r="6.5" />
                <rect x="-9" y="-8" width="16" height="20" rx="7" />
                <rect x="-15" y="10" width="7" height="15" rx="3.5" transform="rotate(10 -12 16)" />
                <rect x="3" y="10" width="7" height="15" rx="3.5" transform="rotate(-8 6 16)" />
                <rect x="-16" y="-6" width="7" height="14" rx="3.5" transform="rotate(28 -13 0)" />
                <rect x="6" y="-6" width="7" height="14" rx="3.5" transform="rotate(-24 9 0)" />
              </g>
              {/* tank + fins accents */}
              <rect x="6" y="-7" width="6" height="14" rx="3" fill="#f2c14e" />
              <path d="M-18 24 l-9 5 9 3 z" fill="#1f6f78" />
              <path d="M8 26 l9 5 -9 3 z" fill="#1f6f78" />
              {/* mask glint */}
              <circle cx="-4" cy="-13" r="2.2" fill="#bfe9f2" />
            </g>
          </g>
        </svg>
      </div>

      <div className="de-panel">
        <div className="de-slider-wrap">
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={depth}
            aria-label="Depth in metres"
            onChange={(e) => setDepth(Number(e.target.value))}
          />
          <div className="de-slider-scale">
            <span>0m</span>
            <span>Surface</span>
            <span>30m</span>
          </div>
        </div>
        <div className="de-readout">
          <div className="de-depth-big">
            {depth}
            <span>m</span>
          </div>
          <h3>{stage.name}</h3>
          <p>{stage.see}</p>
          <div className="de-facts">
            <div className="de-fact">
              <b>Light</b>
              <span>{stage.light}</span>
            </div>
            <div className="de-fact">
              <b>Pressure</b>
              <span>{stage.pressure}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
