// Client-side conversion tracking helpers (SPEC §5.4).
// Fans a single user action out to GA4, Google Ads, and the Meta Pixel.
// All of these are no-ops unless the matching NEXT_PUBLIC_* id is set, so the
// site behaves identically in local dev with nothing configured.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID; // "AW-XXXXXXXXXX"
// Conversion label for the lead action (WhatsApp / call / book), from the
// Google Ads conversion action you create. Combined as "AW-XXXX/LABEL".
export const GOOGLE_ADS_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL;

/** GA4 event names we emit. Keep in sync with the Google Ads / Meta mapping. */
export type ConversionEvent = 'whatsapp_click' | 'call_click' | 'book_click';

// Which Meta standard event each conversion maps to.
const META_EVENT: Record<ConversionEvent, string> = {
  whatsapp_click: 'Contact',
  call_click: 'Contact',
  book_click: 'Lead',
};

/**
 * Report a conversion action. `params` are attached to the GA4 event so you can
 * segment in reports (e.g. which dive a "book" came from).
 */
export function trackConversion(
  event: ConversionEvent,
  params: Record<string, string | number | undefined> = {},
): void {
  if (typeof window === 'undefined') return;

  // GA4 — custom event (mark these as key events in the GA4 UI).
  window.gtag?.('event', event, params);

  // Google Ads — single conversion action for any lead.
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LABEL) {
    window.gtag?.('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LABEL}`,
    });
  }

  // Meta Pixel — standard event.
  window.fbq?.('track', META_EVENT[event]);
}
