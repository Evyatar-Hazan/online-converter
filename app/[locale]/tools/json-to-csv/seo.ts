import { Metadata } from 'next';
import { generateToolMetadata, generateToolSchema } from '@/core/seo';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://converter.example.com';

export function generateMetadata(): Metadata {
  return generateToolMetadata({
    title: 'JSON to CSV Converter - Free Online Tool',
    description: 'Convert JSON arrays to CSV format instantly. Free online tool for developers and data professionals. No registration needed.',
    canonical: '/tools/json-to-csv',
    locale: 'he',
    alternateLocales: [
      { locale: 'en', url: '/en/tools/json-to-csv' },
      { locale: 'he', url: '/he/tools/json-to-csv' },
    ],
  });
}

export const schema = generateToolSchema({
  name: 'JSON to CSV Converter',
  description: 'Free online tool to convert JSON arrays to CSV format instantly',
  url: `${baseUrl}/tools/json-to-csv`,
});
