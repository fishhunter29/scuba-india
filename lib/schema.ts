// schema.org JSON-LD builders (SPEC §5.4).
import type { Dive, Settings } from './types';
import { SITE_URL, SITE_NAME } from './constants';

export function diveCentreSchema(settings: Settings) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: SITE_NAME,
    description:
      'PADI dive centre on Havelock Island, Andaman. Try dives, fun dives and PADI certification courses.',
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Govind Nagar -2, Near Helipad Ground',
      addressLocality: 'Swaradjdweep (HAVELOCK) Islan',
      addressRegion: 'Andaman & Nicobar Island',
      postalCode: '744211',
      addressCountry: 'IN',
    },
    sport: 'Scuba Diving',
  };
  if (settings.address_map_url) {
    schema.hasMap = settings.address_map_url;
  }
  if (settings.review_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: settings.rating_avg,
      reviewCount: settings.review_count,
      bestRating: 5,
    };
  }
  return schema;
}

export function diveProductSchema(dive: Dive, settings: Settings) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${dive.name} — ${dive.site}`,
    description: dive.pitch || `${dive.name} scuba dive at ${dive.site}, Havelock.`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: 'Scuba Diving',
  };
  if (!dive.on_request && dive.price != null) {
    schema.offers = {
      '@type': 'Offer',
      price: dive.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/${dive.slug}`,
    };
  }
  if (settings.review_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: settings.rating_avg,
      reviewCount: settings.review_count,
      bestRating: 5,
    };
  }
  return schema;
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function breadcrumbSchema(dive: Dive) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${dive.name} — ${dive.site}`,
        item: `${SITE_URL}/${dive.slug}`,
      },
    ],
  };
}
