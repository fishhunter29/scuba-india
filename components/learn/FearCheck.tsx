'use client';

import { useState } from 'react';
import { FEAR_CHECKS } from '@/lib/faqs';

export default function FearCheck() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {FEAR_CHECKS.map((f, i) => (
        <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
          <button
            className="faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            &ldquo;{f.q}&rdquo;
            <span className="chev">+</span>
          </button>
          <div className="faq-a">
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
