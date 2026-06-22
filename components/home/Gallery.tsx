'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import shots from '@/lib/gallery.json';

type Shot = { src: string; w: number; h: number; alt: string };
const PHOTOS = shots as Shot[];

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus?.();
  }, []);
  const go = useCallback((dir: number) => {
    setOpen((o) => (o === null ? o : (o + dir + PHOTOS.length) % PHOTOS.length));
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        // simple focus trap within the overlay
        const f = overlayRef.current?.querySelectorAll<HTMLElement>('button');
        if (!f || !f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // focus the close button
    requestAnimationFrame(() => overlayRef.current?.querySelector<HTMLElement>('.lb-close')?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, go]);

  const cur = open === null ? null : PHOTOS[open];

  return (
    <section className="band gallery-band" id="gallery">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginInline: 'auto', textAlign: 'center', maxWidth: 640 }}>
          <div className="sec-eyebrow" style={{ justifyContent: 'center' }}>
            Gallery
          </div>
          <h2>Beneath the surface</h2>
          <p>Real moments from our dives in Havelock&apos;s reefs — tap any photo to view.</p>
        </div>

        <div className="gallery-masonry reveal">
          {PHOTOS.map((g, i) => (
            <button
              key={g.src}
              className="gallery-item"
              onClick={(e) => {
                lastFocus.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Open photo ${i + 1} of ${PHOTOS.length}`}
            >
              <picture>
                <source type="image/webp" srcSet={`${g.src}.webp`} />
                <img
                  src={`${g.src}.jpg`}
                  alt={g.alt}
                  width={g.w}
                  height={g.h}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </button>
          ))}
        </div>
      </div>

      {cur &&
        createPortal(
        <div
          className="lightbox"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <button className="lb-close" onClick={close} aria-label="Close">
            ×
          </button>
          <button className="lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous photo">
            ‹
          </button>
          <figure className="lb-figure">
            <picture>
              <source type="image/webp" srcSet={`${cur.src}.webp`} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${cur.src}.jpg`} alt={cur.alt} />
            </picture>
            <figcaption className="lb-count">
              {(open as number) + 1} / {PHOTOS.length}
            </figcaption>
          </figure>
          <button className="lb-nav lb-next" onClick={() => go(1)} aria-label="Next photo">
            ›
          </button>
        </div>,
          document.body,
        )}
    </section>
  );
}
