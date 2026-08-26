import type { MetadataRoute } from 'next';
import { getDiveSitemapEntries, getCourses, getPostSitemapEntries } from '@/lib/data';
import { courseSlug } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';
import { DIVE_CATEGORIES } from '@/lib/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dives, courses, posts] = await Promise.all([
    getDiveSitemapEntries(),
    getCourses(),
    getPostSitemapEntries(),
  ]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/learn-to-dive`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/prices`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Dive category pages — the main browse entry points.
    ...DIVE_CATEGORIES.map((c) => ({
      url: `${SITE_URL}/dives/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/reefs`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  const divePages: MetadataRoute.Sitemap = dives.map((d) => ({
    url: `${SITE_URL}/${d.slug}`,
    lastModified: new Date(d.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const coursePages: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${courseSlug(c.name)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const guidePages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/guides/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticPages, ...divePages, ...coursePages, ...guidePages];
}
