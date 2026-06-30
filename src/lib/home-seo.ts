import type { Locale } from '../types';

export function getHomePageTitle(locale: Locale) {
  return locale === 'he'
    ? 'אונליין קונברטר | כלים בדפדפן בעברית ובאנגלית'
    : 'Online Converter | Browser-Based Tools in Hebrew and English';
}

export function getHomeMetaDescription(locale: Locale) {
  return locale === 'he'
    ? 'מרכז ממירים בדפדפן עבור JSON, CSV, YAML, Base64, טקסט, צבעים, תאריכים וכלי פיתוח. תמיכה בעברית ובאנגלית, בלי העלאה, עם תוצאות מהירות.'
    : 'Browser-based converter hub for JSON, CSV, YAML, Base64, text, colors, dates and developer tools. Hebrew and English support, no upload, fast results.';
}
