import type { MetadataRoute } from 'next';
import { getDiveSitemapEntries, getCourses } from '@/lib/data';
import { courseSlug } from '@/lib/format';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dives, courses] = await Promise.all([getDiveSitemapEntries(), getCourses()]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/learn-to-dive`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
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

  return [...staticPages, ...divePages, ...coursePages];
}
