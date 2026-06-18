import type { MetadataRoute } from 'next';
import { getAllDiveSlugs } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllDiveSlugs();
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

  const divePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...divePages];
}
