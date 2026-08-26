'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Seal } from '@/components/BrandMark';
import { DIVE_CATEGORIES } from '@/lib/categories';

// Every dive category is a real page. "Dive" opens a menu of them on desktop
// and expands inline in the mobile drawer.
const DIVE_MENU = [
  ...DIVE_CATEGORIES.map((c) => ({ href: `/dives/${c.slug}`, label: c.nav, meta: c.audience })),
  { href: '/reefs', label: 'Reef Dives', meta: 'The four reefs we dive' },
];

const LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/learn-to-dive', label: 'Scuba Guide' },
  { href: '/prices', label: 'Prices' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [divesOpen, setDivesOpen] = useState(false);

  const close = () => {
    setOpen(false);
    setDivesOpen(false);
  };

  return (
    <>
      <nav id="nav">
        <div className="nav-brand-group">
          <Link href="/" className="brand">
            <Seal />
            Scuba India
          </Link>
        </div>
        <div className="nav-links">
          <div
            className="nav-dd"
            onMouseEnter={() => setDivesOpen(true)}
            onMouseLeave={() => setDivesOpen(false)}
          >
            <button
              className="nav-dd-trigger"
              aria-expanded={divesOpen}
              aria-haspopup="true"
              onClick={() => setDivesOpen((v) => !v)}
            >
              Dives <span className="nav-dd-caret" aria-hidden="true">▾</span>
            </button>
            <div className={`nav-dd-menu${divesOpen ? ' open' : ''}`}>
              {DIVE_MENU.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setDivesOpen(false)}>
                  <span className="nav-dd-name">{l.label}</span>
                  <span className="nav-dd-meta">{l.meta}</span>
                </Link>
              ))}
            </div>
          </div>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/prices" className="nav-cta">
            Book a Dive
          </Link>
        </div>
        <button
          className="burger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* mobile drawer — sits above the shader (SPEC §8) */}
      <div className={`drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        <button className="drawer-close" aria-label="Close menu" onClick={close}>
          ×
        </button>
        <span className="drawer-label">Dives</span>
        {DIVE_MENU.map((l) => (
          <Link key={l.href} href={l.href} className="drawer-sub" onClick={close}>
            {l.label}
          </Link>
        ))}
        <span className="drawer-label">More</span>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
        <Link href="/prices" className="drawer-cta" onClick={close}>
          Book a Dive
        </Link>
      </div>
    </>
  );
}
