import { converters } from '../data/converters';
import { locales, siteUrl } from '../data/site';

export function GET() {
  const urls = [
    ...locales.map((locale) => `/${locale}/`),
    ...locales.flatMap((locale) => converters.map((tool) => `/${locale}/${tool.slug}/`))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path.split('/').length <= 3 ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
