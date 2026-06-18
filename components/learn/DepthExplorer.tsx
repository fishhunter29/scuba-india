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

function stageIndexFor(depth: number) {
  for (let i = 0; i < STAGES.length; i++) if (depth <= STAGES[i].max) return i;
  return STAGES.length - 1;
}

// one illustrated pose per stage, matching real diver body position at that phase of the dive
const DIVER_POSES = [
  { src: '/images/depth-explorer/diver-surface.png', width: 50, height: 67 },
  { src: '/images/depth-explorer/diver-justbelow.png', width: 50, height: 67 },
  { src: '/images/depth-explorer/diver-shallowreef.png', width: 92, height: 69 },
  { src: '/images/depth-explorer/diver-deeperreef.png', width: 92, height: 69 },
  { src: '/images/depth-explorer/diver-openwater.png', width: 92, height: 69 },
  { src: '/images/depth-explorer/diver-recreationallimit.png', width: 100, height: 75 },
];

// scene geometry
const SURFACE_Y = 52;
const BOTTOM_Y = 452;
const TRAVEL = BOTTOM_Y - SURFACE_Y;

export default function DepthExplorer() {
  const [depth, setDepth] = useState(0);
  const stageIndex = stageIndexFor(depth);
  const stage = STAGES[stageIndex];
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
              <image href="/images/depth-explorer/anemone.png" x="-15" y="-6" width="30" height="36" />
            </g>
            <image href="/images/depth-explorer/clownfish.png" x="-24" y="10" width="28" height="21" />
          </g>

          {/* shallow coral garden (~12m) */}
          <g transform="translate(40 230)">
            <image href="/images/depth-explorer/coral-cluster.png" x="-15" y="-6" width="30" height="36" />
          </g>

          {/* parrotfish (~12m) */}
          <g transform="translate(120 250)">
            <image href="/images/depth-explorer/parrotfish.png" x="-23" y="-13" width="46" height="26" />
          </g>

          {/* sea turtle (~14m) */}
          <g transform="translate(245 270)">
            <image href="/images/depth-explorer/turtle.png" x="-26" y="-19" width="52" height="38" />
          </g>

          {/* fish school (~18m) */}
          <g transform="translate(70 330)" opacity="0.9">
            {[[0, 0], [14, -6], [26, 4], [40, -3], [10, 10], [34, 12], [52, 6]].map(([x, y], i) => (
              <image key={i} href="/images/depth-explorer/school-fish.png" x={x - 7} y={y - 4.5} width="14" height="9" />
            ))}
          </g>

          {/* reef shark (~24m) */}
          <g transform="translate(210 360)" className="de-shark">
            <image href="/images/depth-explorer/shark.png" x="-45" y="-25" width="90" height="50" opacity="0.92" />
          </g>

          {/* sea floor + bottom coral + ray (~30m) */}
          <path d="M0 452 Q90 438 180 450 T340 446 V480 H0 Z" fill="#0e3a55" />
          <path d="M0 462 Q120 452 240 460 T340 458 V480 H0 Z" fill="#0a2c46" />
          <g transform="translate(60 446)">
            <image href="/images/depth-explorer/bottom-coral.png" x="-20" y="-34" width="44" height="40" />
          </g>
          <g transform="translate(225 452)" opacity="0.85">
            <image href="/images/depth-explorer/stingray.png" x="-35" y="-15" width="70" height="32" />
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
            {/* diver — pose changes per depth stage to match real diving body position, crossfading between poses; floats freely at its current depth */}
            <g transform={`translate(150 ${SURFACE_Y})`}>
              <g className="de-diver-float">
                <ellipse cx="0" cy="0" rx="20" ry="20" fill="#ffffff" opacity="0.12" />
                {DIVER_POSES.map((pose, i) => (
                  <image
                    key={pose.src}
                    href={pose.src}
                    x={-pose.width / 2}
                    y={-pose.height / 2}
                    width={pose.width}
                    height={pose.height}
                    style={{ opacity: i === stageIndex ? 1 : 0, transition: 'opacity .6s ease' }}
                  />
                ))}
              </g>
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
