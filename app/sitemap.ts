import { MetadataRoute } from 'next';
import { getAllTools } from '@/core/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://converter.example.com';
  const tools = getAllTools();
  const locales = ['he', 'en'];

  const routes: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  });

  // Tool pages for each locale
  tools.forEach((tool) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return routes;
}
