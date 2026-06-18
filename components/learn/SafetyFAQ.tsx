'use client';

import { useState } from 'react';
import { SAFETY_FAQS } from '@/lib/faqs';

export default function SafetyFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {SAFETY_FAQS.map((f, i) => (
        <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
          <button
            className="faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
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
