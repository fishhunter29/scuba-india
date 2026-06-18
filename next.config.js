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
};

module.exports = nextConfig;
