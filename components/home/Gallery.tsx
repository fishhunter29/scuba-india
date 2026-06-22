'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import shots from '@/lib/gallery.json';

type Shot = { src: string; w: number; h: number; alt: string };
// up to 14 cards make a clean coliseum ring with a clear centre
const PHOTOS = (shots as Shot[]).slice(0, 14);
const N = PHOTOS.length;
const THETA = 360 / N;

export default function Gallery() {
  const [rot, setRot] = useState(0);
  const [dims, setDims] = useState({ radius: 460, cw: 230, ch: 310 });
  const [smooth, setSmooth] = useState(true);
  const [open, setOpen] = useState<number | null>(null);

  const drag = useRef({ active: false, lastX: 0, vel: 0, moved: 0 });
  const raf = useRef(0);
  const reduce = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  // responsive ring size
  useEffect(() => {
    reduce.current = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const fit = () => {
      const w = innerWidth;
      if (w < 560) setDims({ radius: 250, cw: 150, ch: 205 });
      else if (w < 920) setDims({ radius: 360, cw: 195, ch: 265 });
      else setDims({ radius: 470, cw: 235, ch: 315 });
    };
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);

  const snap = useCallback(() => {
    setSmooth(true);
    setRot((r) => Math.round(r / THETA) * THETA);
  }, []);

  const spin = useCallback(
    (dir: number) => {
      cancelAnimationFrame(raf.current);
      setSmooth(true);
      setRot((r) => Math.round(r / THETA) * THETA + dir * THETA);
    },
    [],
  );

  // pointer drag + inertia
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
    drag.current.vel = dx * 0.28;
    setRot((r) => r + dx * 0.28);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (reduce.current) return snap();
    const step = () => {
      drag.current.vel *= 0.94;
      setRot((r) => r + drag.current.vel);
      if (Math.abs(drag.current.vel) > 0.08) raf.current = requestAnimationFrame(step);
      else snap();
    };
    raf.current = requestAnimationFrame(step);
  };

  // lightbox
  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus?.();
  }, []);
  const go = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + N) % N)), []);
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

  const front = ((Math.round(-rot / THETA) % N) + N) % N;
  const cur = open === null ? null : PHOTOS[open];

  return (
    <section className="band gallery-band" id="gallery">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginInline: 'auto', textAlign: 'center', maxWidth: 640 }}>
          <div className="sec-eyebrow" style={{ justifyContent: 'center' }}>
            Gallery
          </div>
          <h2>Beneath the surface</h2>
          <p>Drag to spin the ring — tap any photo to open it full-screen.</p>
        </div>

        <div className="coliseum">
          <div
            className="coliseum-stage"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            style={{ perspective: `${dims.radius * 2.4}px` }}
          >
            <div
              className={`coliseum-ring${smooth ? ' smooth' : ''}`}
              style={
                {
                  transform: `translateZ(-${dims.radius}px) rotateY(${rot}deg)`,
                  ['--cw' as string]: `${dims.cw}px`,
                  ['--ch' as string]: `${dims.ch}px`,
                } as React.CSSProperties
              }
            >
              {PHOTOS.map((p, i) => {
                const angle = i * THETA;
                // how far this card is from the front (0 = centre)
                let off = (((angle + rot) % 360) + 360) % 360;
                if (off > 180) off -= 360;
                const a = Math.abs(off);
                const opacity = a > 105 ? 0 : 1 - (a / 105) * 0.72;
                return (
                  <button
                    key={p.src}
                    className={`coliseum-card${i === front ? ' is-front' : ''}`}
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${dims.radius}px)`,
                      opacity,
                      pointerEvents: a > 100 ? 'none' : 'auto',
                    }}
                    aria-label={`Open ${p.alt}`}
                    onClick={(e) => {
                      if (drag.current.moved > 6) return; // ignore drags
                      lastFocus.current = e.currentTarget;
                      setOpen(i);
                    }}
                  >
                    <span className="coliseum-inner">
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

          <button className="coliseum-arrow ca-prev" onClick={() => spin(1)} aria-label="Previous photos">
            ‹
          </button>
          <button className="coliseum-arrow ca-next" onClick={() => spin(-1)} aria-label="Next photos">
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
