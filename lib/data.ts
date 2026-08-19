// Server-side data fetchers. All read paths are public (RLS: public read) and
// use a cookie-free client so they work in any context (RSC, sitemap, static).
// Each returns safe fallbacks so the site renders even before Supabase is set up.
import { createPublicClient } from './supabase/public';
import { isSupabaseConfigured } from './supabase/server';
import { FALLBACK_SETTINGS } from './constants';
import { courseSlug } from './format';
import type { Dive, Course, Post, Review, Settings, SiteKey, DiveCategory } from './types';
import { kindToGroup } from './types';

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

export async function getDivesBySite(siteKey: SiteKey, excludeSlug?: string): Promise<Dive[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  let query = supabase
    .from('dives')
    .select('*')
    .eq('active', true)
    .eq('site_key', siteKey)
    .order('sort', { ascending: true });
  if (excludeSlug) query = query.neq('slug', excludeSlug);
  const { data, error } = await query;
  if (error) {
    console.error('getDivesBySite', error.message);
    return [];
  }
  return (data ?? []) as Dive[];
}

// What kind of dive is this? Prefer the explicit `category` set in admin;
// fall back to the old heuristic for any legacy row that hasn't been tagged
// yet. Drives the homepage packages grouping.
export function diveCategory(d: Dive): DiveCategory {
  if (d.category) return kindToGroup(d.category);
  if (d.train_min != null && !d.on_request) return 'discover';
  if (d.tier === 'Certified') return 'fun';
  return 'experience';
}

export function groupDivesByCategory(dives: Dive[]): Record<DiveCategory, Dive[]> {
  const groups = { discover: [], fun: [], experience: [] } as Record<DiveCategory, Dive[]>;
  for (const d of dives) groups[diveCategory(d)].push(d);
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

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((c) => courseSlug(c.name) === slug) ?? null;
}

export async function getAllCourseSlugs(): Promise<string[]> {
  const courses = await getCourses();
  return courses.map((c) => courseSlug(c.name));
}

export async function getPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });
  if (error) {
    console.error('getPosts', error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) {
    console.error('getPostBySlug', error.message);
    return null;
  }
  return (data as Post) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase.from('posts').select('slug').eq('published', true);
  return (data ?? []).map((p) => p.slug as string);
}

export async function getPostSitemapEntries(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true);
  return (data ?? []).map((p) => ({ slug: p.slug as string, updatedAt: p.updated_at as string }));
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
