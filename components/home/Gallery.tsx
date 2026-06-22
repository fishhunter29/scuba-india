'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import shots from '@/lib/gallery.json';

type Shot = { src: string; w: number; h: number; alt: string };
const PHOTOS = (shots as Shot[]).slice(0, 16);
const N = PHOTOS.length;
const VIS = 3.4; // how many cards each side stay visible

export default function Gallery() {
  // pos = fractional focused index; drag/inertia move it, snap to whole numbers
  const [pos, setPos] = useState(0);
  const [d, setD] = useState({ cw: 300, ch: 360, gap: 188, depth: 170, tilt: 50 });
  const [smooth, setSmooth] = useState(true);
  const [open, setOpen] = useState<number | null>(null);

  const drag = useRef({ active: false, lastX: 0, vel: 0, moved: 0 });
  const raf = useRef(0);
  const reduce = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    reduce.current = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const fit = () => {
      const w = innerWidth;
      if (w < 560) setD({ cw: 210, ch: 270, gap: 120, depth: 130, tilt: 52 });
      else if (w < 920) setD({ cw: 260, ch: 320, gap: 158, depth: 150, tilt: 50 });
      else setD({ cw: 310, ch: 380, gap: 196, depth: 175, tilt: 48 });
    };
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);

  const snap = useCallback(() => {
    setSmooth(true);
    setPos((p) => Math.round(p));
  }, []);
  const step = useCallback((dir: number) => {
    cancelAnimationFrame(raf.current);
    setSmooth(true);
    setPos((p) => Math.round(p) + dir);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    if (open !== null) return;
    cancelAnimationFrame(raf.current);
    drag.current = { active: true, lastX: e.clientX, vel: 0, moved: 0 };
    setSmooth(false);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    drag.current.moved += Math.abs(dx);
    const dp = -dx / d.gap;
    drag.current.vel = dp;
    setPos((p) => p + dp);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (reduce.current) return snap();
    const run = () => {
      drag.current.vel *= 0.92;
      setPos((p) => p + drag.current.vel);
      if (Math.abs(drag.current.vel) > 0.002) raf.current = requestAnimationFrame(run);
      else snap();
    };
    raf.current = requestAnimationFrame(run);
  };

  // lightbox
  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus?.();
  }, []);
  const go = useCallback((dir: number) => setOpen((o) => (o === null ? o : (o + dir + N) % N)), []);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const f = overlayRef.current?.querySelectorAll<HTMLElement>('button');
        if (!f?.length) return;
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlayRef.current?.querySelector<HTMLElement>('.lb-close')?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, go]);

  const center = ((Math.round(pos) % N) + N) % N;
  const cur = open === null ? null : PHOTOS[open];

  return (
    <section className="band gallery-band" id="gallery">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginInline: 'auto', textAlign: 'center', maxWidth: 640 }}>
          <div className="sec-eyebrow" style={{ justifyContent: 'center' }}>
            Gallery
          </div>
          <h2>Beneath the surface</h2>
          <p>Drag to glide through the reef — tap any photo to open it full-screen.</p>
        </div>

        <div className="coliseum">
          <div
            className="coliseum-stage"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            style={{ height: `${d.ch + 60}px` }}
          >
            <div
              className={`coverflow${smooth ? ' smooth' : ''}`}
              style={{ ['--cw' as string]: `${d.cw}px`, ['--ch' as string]: `${d.ch}px` }}
            >
              {PHOTOS.map((p, i) => {
                // shortest signed offset (wraps around the ring)
                let off = ((i - pos + N + N / 2) % N) - N / 2;
                const a = Math.abs(off);
                const tx = off * d.gap;
                const tz = -a * d.depth;
                const ry = Math.max(-70, Math.min(70, off * -d.tilt)); // concave: sides cup toward centre
                const opacity = a > VIS ? 0 : 1 - (a / (VIS + 0.6)) * 0.85;
                return (
                  <button
                    key={p.src}
                    className={`cf-card${i === center ? ' is-front' : ''}`}
                    style={{
                      transform: `translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg)`,
                      opacity,
                      zIndex: 100 - Math.round(a * 10),
                      pointerEvents: a > VIS ? 'none' : 'auto',
                    }}
                    aria-label={`Open ${p.alt}`}
                    aria-hidden={a > VIS}
                    onClick={(e) => {
                      if (drag.current.moved > 6) return;
                      lastFocus.current = e.currentTarget;
                      setOpen(i);
                    }}
                  >
                    <span className="cf-inner">
                      <picture>
                        <source type="image/webp" srcSet={`${p.src}.webp`} />
                        <img src={`${p.src}.jpg`} alt={p.alt} loading="lazy" decoding="async" draggable={false} />
                      </picture>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button className="coliseum-arrow ca-prev" onClick={() => step(-1)} aria-label="Previous photo">
            ‹
          </button>
          <button className="coliseum-arrow ca-next" onClick={() => step(1)} aria-label="Next photo">
            ›
          </button>
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
            onClick={(e) => e.target === e.currentTarget && close()}
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
                {(open as number) + 1} / {N}
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
