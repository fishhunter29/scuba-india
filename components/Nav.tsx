'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Seal } from '@/components/BrandMark';

const LINKS = [
  { href: '/#experiences', label: 'Dive' },
  { href: '/#packages', label: 'Packages' },
  { href: '/#courses', label: 'Courses' },
  { href: '/#sites', label: 'Sites' },
  { href: '/learn-to-dive', label: 'New to diving?' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav id="nav">
        <Link href="/" className="brand">
          <Seal />
          Scuba India
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/#packages" className="nav-cta">
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
        <button className="drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>
          ×
        </button>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/#packages" className="drawer-cta" onClick={() => setOpen(false)}>
          Book a Dive
        </Link>
      </div>
    </>
  );
}
