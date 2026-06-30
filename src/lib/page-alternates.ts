import { locales, siteUrl } from '../data/site';
import type { Locale } from '../types';

export function getCanonicalUrl(canonicalPath: string) {
  return new URL(canonicalPath, siteUrl).toString();
}

export function getAlternateHref(locale: Locale, alternateSlug = '') {
  return `${siteUrl}/${locale}/${alternateSlug ? `${alternateSlug}/` : ''}`;
}

export function getAlternateUrls(alternateSlug = '') {
  return {
    en: getAlternateHref('en', alternateSlug),
    he: getAlternateHref('he', alternateSlug),
    default: getAlternateHref('en', alternateSlug)
  };
}

export function getAlternateEntries(alternateSlug = '') {
  return locales.map((locale) => ({
    locale,
    href: getAlternateHref(locale, alternateSlug)
  }));
}
