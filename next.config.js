/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage public bucket — replace <project-ref> via env at deploy time.
      { protocol: 'https', hostname: '*.supabase.co' },
      // Google reviewer avatars (Places API)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async redirects() {
    return [
      // Stale URLs still indexed/sitelinked by Google from the pre-rebuild site.
      // 301 to the homepage (contact details live in the footer) instead of 404,
      // so old search traffic lands somewhere useful and Google folds these in faster.
      { source: '/contact', destination: '/#contact', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com connect.facebook.net",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: *.supabase.co lh3.googleusercontent.com *.facebook.com *.google-analytics.com",
              "connect-src 'self' *.supabase.co *.google-analytics.com *.googletagmanager.com",
              "frame-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
