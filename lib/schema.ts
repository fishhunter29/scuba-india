// schema.org JSON-LD builders (SPEC §5.4).
import type { Dive, Course, Post, Settings } from './types';
import { SITE_URL, SITE_NAME } from './constants';
import { courseSlug } from './format';

export function diveCentreSchema(settings: Settings) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: SITE_NAME,
    description:
      'PADI dive centre on Havelock Island (Swaraj Dweep), Andaman. Try dives, fun dives and PADI certification courses.',
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    image: `${SITE_URL}/images/logo-full.png`,
    // Rough mid-range indicator (₹2,000–₹25,000 across dives/courses) — schema.org
    // priceRange has no India-specific convention, so this is the closest analogue.
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Govind Nagar -2, Near Helipad Ground',
      addressLocality: 'Havelock (Swaraj Dweep) Island',
      addressRegion: 'Andaman & Nicobar Island',
      postalCode: '744211',
      addressCountry: 'IN',
    },
    sport: 'Scuba Diving',
  };
  if (settings.address_map_url) {
    schema.hasMap = settings.address_map_url;
  }
  // Cross-validates the business identity across the web (Google Business
  // Profile, Instagram, Facebook, TripAdvisor) — leave out any that aren't set yet.
  const sameAs = [
    settings.google_url,
    settings.instagram,
    settings.facebook,
    settings.tripadvisor,
  ].filter(Boolean);
  if (sameAs.length) {
    schema.sameAs = sameAs;
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
    description: dive.pitch || `${dive.name} scuba dive at ${dive.site}, Havelock (Swaraj Dweep).`,
    image: dive.image_url || `${SITE_URL}/images/logo-full.png`,
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

export function courseSchema(course: Course) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.name} — ${SITE_NAME}`,
    description: course.description || `${course.name} PADI certification course in Havelock (Swaraj Dweep), Andaman.`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
  };
  if (!course.on_request && course.price != null) {
    schema.offers = {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/courses/${courseSlug(course.name)}`,
    };
  }
  return schema;
}

export function courseBreadcrumbSchema(course: Course) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: course.name,
        item: `${SITE_URL}/courses/${courseSlug(course.name)}`,
      },
    ],
  };
}

export function articleSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image_url || `${SITE_URL}/images/logo-full.png`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/guides/${post.slug}`,
  };
}

export function articleBreadcrumbSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Scuba Guide', item: `${SITE_URL}/guides` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/guides/${post.slug}`,
      },
    ],
  };
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
