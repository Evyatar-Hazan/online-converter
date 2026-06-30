import type { Locale } from '../types';

export function getHomePageTitle(locale: Locale) {
  return locale === 'he'
    ? 'אונליין קונברטר - ממירים מהירים בעברית ובאנגלית'
    : 'Online Converter - Fast bilingual converter tools';
}

export function getHomeMetaDescription(locale: Locale) {
  return locale === 'he'
    ? 'מרכז ממירים מהיר בעברית ובאנגלית עבור JSON, CSV, YAML, Base64, טקסט, צבעים, תאריכים וכלי פיתוח.'
    : 'A fast bilingual converter hub for JSON, CSV, YAML, Base64, text, colors, dates and developer tools.';
}
