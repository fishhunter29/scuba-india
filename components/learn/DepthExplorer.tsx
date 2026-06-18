'use client';

import { useState } from 'react';

const STAGES = [
  {
    max: 0,
    name: 'The surface',
    light: 'Full daylight',
    pressure: '1 atmosphere — normal',
    see: 'You float on the surface in your gear, breathing easily through your regulator before you go down.',
    bg: 'linear-gradient(180deg,#7fd3e0,#49b3c7)',
  },
  {
    max: 5,
    name: 'Just below',
    light: 'Bright, warm light',
    pressure: '1.5 atmospheres',
    see: 'Sunbeams cut through the water. Clownfish, anemones and shoals of small reef fish are all around you. Most try dives stay around here.',
    bg: 'linear-gradient(180deg,#49b3c7,#2f93b4)',
  },
  {
    max: 12,
    name: 'Shallow reef',
    light: 'Plenty of light, colours rich',
    pressure: '2.2 atmospheres',
    see: 'Coral gardens in full colour — parrotfish, butterflyfish, the odd turtle. This is Tribe Gate, where most first dives happen.',
    bg: 'linear-gradient(180deg,#2f93b4,#246f93)',
  },
  {
    max: 18,
    name: 'Deeper reef',
    light: 'Cooler blue, reds start to fade',
    pressure: '2.8 atmospheres',
    see: 'Bigger fish, schools of snapper, maybe a reef shark cruising past. This is Lighthouse depth — for confident or certified divers.',
    bg: 'linear-gradient(180deg,#246f93,#1a4f74)',
  },
  {
    max: 25,
    name: 'Open water',
    light: 'Deep blue, dim',
    pressure: '3.5 atmospheres',
    see: 'The reef drops away into blue. Advanced Open Water divers explore here. Colours look blue-grey without a torch.',
    bg: 'linear-gradient(180deg,#1a4f74,#123c5a)',
  },
  {
    max: 30,
    name: 'Recreational limit',
    light: 'Dark blue, torch needed for colour',
    pressure: '4 atmospheres',
    see: 'The deepest recreational divers go. Calm, quiet, otherworldly — and as deep as PADI Advanced training takes you.',
    bg: 'linear-gradient(180deg,#123c5a,#0a2740)',
  },
];

function stageFor(depth: number) {
  for (const s of STAGES) if (depth <= s.max) return s;
  return STAGES[STAGES.length - 1];
}

export default function DepthExplorer() {
  const [depth, setDepth] = useState(0);
  const stage = stageFor(depth);

  return (
    <div className="depth-explorer">
      <div className="de-stage" style={{ background: stage.bg }}>
        <svg className="de-fish" style={{ top: '18%', left: '12%' }} width="40" height="26" viewBox="0 0 40 26">
          <path d="M3 13 C9 2,27 2,33 13 C27 24,9 24,3 13Z" fill="rgba(255,255,255,.85)" />
          <path d="M33 13 l6 -6 v12 z" fill="rgba(255,255,255,.85)" />
        </svg>
        <svg className="de-fish" style={{ top: '40%', right: '16%' }} width="30" height="20" viewBox="0 0 40 26">
          <path d="M3 13 C9 2,27 2,33 13 C27 24,9 24,3 13Z" fill="rgba(255,217,160,.85)" />
          <path d="M33 13 l6 -6 v12 z" fill="rgba(255,217,160,.85)" />
        </svg>
        <div className="de-name">{stage.name}</div>
        <div className="de-depth">{depth}m</div>
      </div>

      <div className="de-panel">
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={depth}
          aria-label="Depth in metres"
          onChange={(e) => setDepth(Number(e.target.value))}
        />
        <div className="de-readout">
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
            <div className="de-fact">
              <b>Depth</b>
              <span>{depth} metres below the surface</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
