import { Metadata } from 'next';

export type SEOConfig = {
  title: string;
  description: string;
  canonical: string;
  locale: 'he' | 'en';
  alternateLocales?: { locale: string; url: string }[];
  schema?: Record<string, unknown>;
};

export function generateToolMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://converter.example.com';
  const canonicalUrl = `${baseUrl}${config.canonical}`;

  // Build alternate languages
  const languages: Record<string, string> = {};
  if (config.alternateLocales) {
    config.alternateLocales.forEach((alt) => {
      languages[alt.locale] = `${baseUrl}${alt.url}`;
    });
  }

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: 'Converter',
      locale: config.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateToolSchema(config: {
  name: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.name,
    description: config.description,
    applicationCategory: 'Utility',
    url: config.url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
