// Server-side data fetchers. All read paths are public (RLS: public read) and
// use a cookie-free client so they work in any context (RSC, sitemap, static).
// Each returns safe fallbacks so the site renders even before Supabase is set up.
import { createPublicClient } from './supabase/public';
import { isSupabaseConfigured } from './supabase/server';
import { FALLBACK_SETTINGS } from './constants';
import type { Dive, Course, Review, Settings, SiteKey } from './types';

const createClient = createPublicClient;

export async function getDives(): Promise<Dive[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dives')
    .select('*')
    .eq('active', true)
    .order('sort', { ascending: true });
  if (error) {
    console.error('getDives', error.message);
    return [];
  }
  return (data ?? []) as Dive[];
}

export async function getDiveBySlug(slug: string): Promise<Dive | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dives')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('getDiveBySlug', error.message);
    return null;
  }
  return (data as Dive) ?? null;
}

export async function getAllDiveSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase.from('dives').select('slug').eq('active', true);
  return (data ?? []).map((d) => d.slug as string);
}

// For the sitemap: real updated_at per page instead of a request-time
// timestamp, so lastModified actually reflects when content changed.
export async function getDiveSitemapEntries(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase.from('dives').select('slug, updated_at').eq('active', true);
  return (data ?? []).map((d) => ({ slug: d.slug as string, updatedAt: d.updated_at as string }));
}

export function groupDivesBySite(dives: Dive[]): Record<SiteKey, Dive[]> {
  const groups = { tribe: [], red: [], light: [], turtle: [], multi: [] } as Record<
    SiteKey,
    Dive[]
  >;
  for (const d of dives) groups[d.site_key]?.push(d);
  return groups;
}

export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('sort', { ascending: true });
  if (error) {
    console.error('getCourses', error.message);
    return [];
  }
  return (data ?? []) as Course[];
}

export async function getFeaturedReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('featured', true)
    .order('sort', { ascending: true })
    .limit(6);
  if (error) {
    console.error('getFeaturedReviews', error.message);
    return [];
  }
  return (data ?? []) as Review[];
}

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured()) return FALLBACK_SETTINGS;
  const supabase = createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error('getSettings', error.message);
    return FALLBACK_SETTINGS;
  }
  return data as Settings;
}
