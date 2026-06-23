'use client';

import { useEffect } from 'react';
import { trackConversion, type ConversionEvent } from '@/lib/analytics';

/**
 * Site-wide conversion tracking via a single delegated click listener, so every
 * WhatsApp / tap-to-call / Book link reports without each (mostly server-
 * rendered) component needing an onClick. Fires GA4 + Google Ads + Meta events.
 *
 * Classification (most specific first):
 *   1. explicit  data-track="book_click|whatsapp_click|call_click"
 *   2. href starting with the WhatsApp link  → whatsapp_click
 *   3. href starting with tel:               → call_click
 */
export default function ConversionTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest('a');
      if (!link) return;

      const explicit = link.dataset.track as ConversionEvent | undefined;
      const href = link.getAttribute('href') ?? '';

      let event: ConversionEvent | undefined = explicit;
      if (!event) {
        if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)/.test(href)) {
          event = 'whatsapp_click';
        } else if (href.startsWith('tel:')) {
          event = 'call_click';
        }
      }
      if (!event) return;

      trackConversion(event, {
        link_url: href,
        link_text: link.textContent?.trim().slice(0, 80) || undefined,
        page_path: window.location.pathname,
      });
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
