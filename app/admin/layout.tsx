import type { Metadata } from 'next';

// Keep the whole admin area out of search results (defence in depth; robots.ts
// also disallows it). Auth is enforced in middleware + per-page.
export const metadata: Metadata = {
  title: 'Admin — Scuba India',
  robots: { index: false, follow: false },
};

// Admin is auth-gated and entirely dynamic — never statically prerender it
// (it instantiates the browser Supabase client, which needs runtime env).
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
