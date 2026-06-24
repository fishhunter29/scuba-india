import Image from 'next/image';
import type { Review, Settings } from '@/lib/types';
import type { GoogleReviewsData } from '@/lib/google-reviews';

// Multicolour Google "G" mark.
function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="g-stars" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < Math.round(n) ? 'on' : 'off'}>
          ★
        </span>
      ))}
    </span>
  );
}

const AVATAR_COLORS = ['#1f8f86', '#e07a5f', '#3d9bc9', '#f2a541', '#7d5fb2', '#2E4A52'];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
function relativeDate(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const days = Math.max(0, Math.round((Date.now() - then) / 86400000));
  if (days < 7) return days <= 1 ? 'a day ago' : `${days} days ago`;
  if (days < 30) {
    const w = Math.round(days / 7);
    return w <= 1 ? 'a week ago' : `${w} weeks ago`;
  }
  if (days < 365) {
    const m = Math.round(days / 30);
    return m <= 1 ? 'a month ago' : `${m} months ago`;
  }
  const y = Math.round(days / 365);
  return y <= 1 ? 'a year ago' : `${y} years ago`;
}

interface DisplayReview {
  key: string;
  name: string;
  sub: string;
  rating: number;
  text: string;
  photo: string | null;
}

export default function Reviews({
  reviews,
  settings,
  google,
}: {
  reviews: Review[];
  settings: Settings;
  google?: GoogleReviewsData | null;
}) {
  const live = Boolean(google && google.reviews.length);

  const items: DisplayReview[] = live
    ? google!.reviews.map((g, i) => ({
        key: `g${i}`,
        name: g.name,
        sub: g.relative,
        rating: g.rating,
        text: g.text,
        photo: g.photo,
      }))
    : reviews.map((r) => ({
        key: r.id,
        name: r.name,
        sub: [r.country, relativeDate(r.created_at)].filter(Boolean).join(' · '),
        rating: r.rating,
        text: r.text,
        photo: null,
      }));

  const rating = (live ? google!.rating : null) ?? settings.rating_avg ?? 4.8;
  const totalNum = (live ? google!.count : null) ?? settings.review_count;
  const totalLabel = totalNum && totalNum > 0 ? `${totalNum}` : '[XX]';
  const reviewsUrl = (live ? google!.mapsUri : null) ?? settings.google_url ?? '';
  const hasUrl = Boolean(reviewsUrl);

  return (
    <section className="band reviews" id="reviews">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginInline: 'auto', textAlign: 'center', maxWidth: 760 }}>
          <div className="sec-eyebrow" style={{ justifyContent: 'center' }}>
            Reviews
          </div>
          <h2>Loved by divers from everywhere</h2>
        </div>

        {/* Google-style rating summary card */}
        <div className="g-summary reveal">
          <div className="g-summary-left">
            <GoogleG size={30} />
            <div>
              <div className="g-summary-title">Google Reviews</div>
              <div className="g-summary-sub">Scuba India · Havelock</div>
            </div>
          </div>
          <div className="g-summary-mid">
            <span className="g-score">{rating.toFixed(1)}</span>
            <div>
              <Stars n={rating} />
              <div className="g-count">
                Based on {totalLabel}
                {totalLabel === '[XX]' ? '' : '+'} reviews
              </div>
            </div>
          </div>
          {hasUrl ? (
            <a className="g-summary-btn" href={reviewsUrl} target="_blank" rel="noopener noreferrer">
              <GoogleG size={16} />
              View on Google
            </a>
          ) : (
            <a
              className="g-summary-btn"
              href="#"
              aria-disabled="true"
              title="Connect Google reviews (Places API) or add a Google reviews URL in admin → Settings"
            >
              <GoogleG size={16} />
              View on Google
            </a>
          )}
        </div>

        {/* review cards */}
        <div className="g-rev-grid">
          {items.map((r) => (
            <div className="g-rev reveal" key={r.key}>
              <div className="g-rev-head">
                {r.photo ? (
                  <Image
                    className="g-avatar g-avatar-img"
                    src={r.photo}
                    alt={r.name}
                    width={44}
                    height={44}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="g-avatar" style={{ background: avatarColor(r.name) }}>
                    {initials(r.name)}
                  </span>
                )}
                <div className="g-rev-meta">
                  <div className="g-rev-name">{r.name}</div>
                  <div className="g-rev-date">{r.sub}</div>
                </div>
                <span className="g-rev-badge" title="Posted on Google">
                  <GoogleG size={18} />
                </span>
              </div>
              <Stars n={r.rating} />
              <p className="g-rev-text">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="rev-foot reveal">
          {hasUrl ? (
            <a href={reviewsUrl} target="_blank" rel="noopener noreferrer">
              Read all {totalLabel} reviews on Google →
            </a>
          ) : (
            <a href="#" aria-disabled="true" title="Connect Google reviews or add a Google reviews URL in admin → Settings">
              Read all {totalLabel} reviews on Google →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
