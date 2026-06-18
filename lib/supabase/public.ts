import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cookie-free client for PUBLIC, read-only data (RLS: public read). Safe to use
// in any server context — sitemap, generateStaticParams, RSC — without needing
// a request scope. Never use for writes or auth.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
