'use client';

// Browser Supabase client (anon key). Safe for the public site & admin UI.
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Fall back to harmless placeholders if env is missing so the admin UI can
  // still render (auth calls will simply fail until env is configured) rather
  // than throwing during SSR. Real values are required for the admin to work.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';
  return createBrowserClient(url, key);
}
