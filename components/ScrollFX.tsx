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
      // Cheap, compositor-only update: fade a fixed gradient (see #depthveil CSS)
      // instead of rebuilding the gradient string every frame.
      if (depthveil) depthveil.style.opacity = pct.toFixed(3);
      if (dmDot) dmDot.style.top = pct * 150 + 'px';
      if (dmVal) dmVal.textContent = Math.round(pct * MAX_DEPTH) + 'm';
    }
    // Batch scroll work to one update per frame so the smooth-scroll animations
    // (e.g. a dive-type card gliding to its packages tab) don't stutter.
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScrollDepth();
        ticking = false;
      });
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScrollDepth();

    // reveal-on-scroll + animate depth bars when they enter view
    const setFill = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>('.depth-fill').forEach((f) => (f.style.width = (f.dataset.depth || '0') + '%'));

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            setFill(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      // Start the reveal ~40% of a screen BEFORE the element scrolls in, so
      // content (and its icons) is already visible by the time you reach it.
      { threshold: 0, rootMargin: '0px 0px 40% 0px' },
    );

    // On back/forward navigation the visitor has already seen this page, so
    // scroll is restored mid-page — don't replay the entrance animation (it
    // flashes / looks broken during the transition). Show everything at once,
    // instantly. Fresh loads keep the normal reveal-on-scroll.
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const revealAllInstantly = () => {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        el.style.transition = 'none';
        el.classList.add('in');
      });
      setFill(document);
    };

    if (navEntry?.type === 'back_forward') {
      revealAllInstantly();
    } else {
      document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    }

    // bfcache restore fires pageshow(persisted) without re-running React — make
    // sure nothing is left hidden if the browser restored a reset DOM.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) revealAllInstantly();
    };
    addEventListener('pageshow', onPageShow);

    return () => {
      removeEventListener('scroll', onScrollDepth);
      removeEventListener('pageshow', onPageShow);
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
