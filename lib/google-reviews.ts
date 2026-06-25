// Live Google reviews via the Places API (New). Server-only.
// Requires GOOGLE_MAPS_API_KEY (Places API enabled) + GOOGLE_PLACE_ID.
// Google returns a MAX of 5 reviews ("most relevant"); rating + total count
// come straight from the listing. Cached 1h (within Google's caching terms).

interface GoogleReview {
  name: string;
  photo: string | null;
  rating: number;
  text: string;
  relative: string; // e.g. "2 months ago"
  time: string; // ISO publish time
  uri: string | null; // link to the review/author on Google
}

export interface GoogleReviewsData {
  rating: number | null;
  count: number | null;
  reviews: GoogleReview[];
  mapsUri: string | null;
}

// Merges the live Google rating/count into a Settings-shaped object so every
// "[XX]+ reviews" trust line and AggregateRating schema on the site reflects
// the real listing once GOOGLE_MAPS_API_KEY/GOOGLE_PLACE_ID are configured,
// not just the admin-managed components/home/Reviews.tsx block.
export function withLiveRating<T extends { review_count: number; rating_avg: number }>(
  settings: T,
  google: GoogleReviewsData | null,
): T {
  if (!google?.count) return settings;
  return { ...settings, review_count: google.count, rating_avg: google.rating ?? settings.rating_avg };
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const place = process.env.GOOGLE_PLACE_ID;
  if (!key || !place) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${place}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('getGoogleReviews', res.status, await res.text());
      return null;
    }
    const d = await res.json();
    const reviews: GoogleReview[] = (d.reviews ?? []).map((r: any) => ({
      name: r.authorAttribution?.displayName ?? 'Google user',
      photo: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? 5,
      text: r.text?.text ?? r.originalText?.text ?? '',
      relative: r.relativePublishTimeDescription ?? '',
      time: r.publishTime ?? '',
      uri: r.authorAttribution?.uri ?? null,
    }));
    return {
      rating: d.rating ?? null,
      count: d.userRatingCount ?? null,
      reviews,
      mapsUri: d.googleMapsUri ?? null,
    };
  } catch (e) {
    console.error('getGoogleReviews', e);
    return null;
  }
}
