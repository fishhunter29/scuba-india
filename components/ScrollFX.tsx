'use client';

import { useEffect } from 'react';

/**
 * Renders the fixed #depthveil + right-side depth meter, and runs the
 * scroll-driven darkening / nav-blur / reveal logic. Behaviour copied from the
 * prototype's inline script (SPEC §4). Also toggles `.scrolled` on <nav>.
 */
export default function ScrollFX() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    const depthveil = document.getElementById('depthveil');
    const dmDot = document.getElementById('dmDot');
    const dmVal = document.getElementById('dmVal');
    const MAX_DEPTH = 30; // notional metres at page bottom

    function onScrollDepth() {
      nav?.classList.toggle('scrolled', scrollY > 40);
      const pct = Math.min(scrollY / (document.body.scrollHeight - innerHeight || 1), 1);
      if (depthveil) {
        // deepen into ocean teal-navy (not black) as you descend
        depthveil.style.background =
          'linear-gradient(180deg,rgba(26,78,90,' +
          (pct * 0.3).toFixed(3) +
          ') 0%,rgba(9,40,52,' +
          (pct * 0.62).toFixed(3) +
          ') 100%)';
      }
      if (dmDot) dmDot.style.top = pct * 150 + 'px';
      if (dmVal) dmVal.textContent = Math.round(pct * MAX_DEPTH) + 'm';
    }
    addEventListener('scroll', onScrollDepth, { passive: true });
    onScrollDepth();

    // reveal-on-scroll + animate depth bars when they enter view
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            const fills = (e.target as HTMLElement).querySelectorAll<HTMLElement>('.depth-fill');
            fills.forEach((f) => (f.style.width = (f.dataset.depth || '0') + '%'));
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    return () => {
      removeEventListener('scroll', onScrollDepth);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div id="depthveil" />
      <div className="depth-meter" aria-hidden="true">
        <span className="dm-cap">DEPTH</span>
        <div className="dm-track">
          <span className="dm-dot" id="dmDot" />
        </div>
        <span className="dm-val" id="dmVal">
          0m
        </span>
      </div>
    </>
  );
}
