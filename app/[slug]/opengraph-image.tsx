import { ImageResponse } from 'next/og';
import { getDiveBySlug } from '@/lib/data';
import { formatPrice, diveDuration } from '@/lib/format';
import { SITE_NAME } from '@/lib/constants';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const dive = await getDiveBySlug(params.slug);

  const name = dive?.name ?? SITE_NAME;
  const site = dive?.site ? `${dive.site}, Havelock` : 'Havelock, Andaman';
  const price = dive ? formatPrice(dive.price, dive.on_request) : '';
  const duration = dive ? diveDuration(dive) : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #DCEFEF 0%, #CDE7E7 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: '#E0523A',
            }}
          />
          <span
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#E0523A',
              fontWeight: 600,
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 980 }}>
          <span style={{ fontSize: 64, fontWeight: 700, color: '#123A47', lineHeight: 1.12 }}>
            {name}
          </span>
          <span style={{ fontSize: 30, color: '#1E6F7B', marginTop: 18 }}>{site}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {duration && (
            <span style={{ fontSize: 24, color: '#2E5A66' }}>{duration}</span>
          )}
          {price && (
            <span style={{ fontSize: 36, fontWeight: 700, color: '#E0523A' }}>{price}</span>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
