import type { ConverterCategory, Locale } from '../types';

export const locales: Locale[] = ['en', 'he'];
export const defaultLocale: Locale = 'en';
export const siteUrl = 'https://online-converter.evyatarhazan.com';
export const siteName = {
  en: 'Online Converter',
  he: 'אונליין קונברטר'
};

export const categoryLabels: Record<ConverterCategory, Record<Locale, string>> = {
  data: { en: 'Data formats', he: 'פורמטי נתונים' },
  text: { en: 'Text tools', he: 'כלי טקסט' },
  encoding: { en: 'Encoding', he: 'קידוד ופענוח' },
  time: { en: 'Date & time', he: 'תאריך וזמן' },
  developer: { en: 'Developer tools', he: 'כלי פיתוח' },
  color: { en: 'Colors', he: 'צבעים' }
};

export const ui = {
  en: {
    direction: 'ltr',
    langLabel: 'עברית',
    langPath: 'he',
    home: 'Home',
    tools: 'Tools',
    sitemap: 'Sitemap',
    search: 'Search converters',
    searchPlaceholder: 'Search JSON, text, Base64...',
    popular: 'Popular',
    new: 'New',
    open: 'Open converter',
    allTools: 'All converters',
    heroEyebrow: 'Fast bilingual converters for everyday web work',
    heroTitle: 'Convert files, text, data and developer formats in your browser.',
    heroText:
      'A privacy-first converter hub for everyday work in English and Hebrew, with fast pages, focused tools, and clean results.',
    heroCta: 'Browse converters',
    privacy: 'Runs locally in your browser',
    noUpload: 'No uploads',
    instant: 'Instant results',
    adLabel: 'Advertisement',
    input: 'Input',
    output: 'Output',
    convert: 'Convert',
    autoConvert: 'Auto',
    sample: 'Sample',
    clear: 'Clear',
    copy: 'Copy',
    download: 'Download',
    swap: 'Swap',
    characters: 'characters',
    lines: 'lines',
    warnings: 'Warnings',
    conversionFailed: 'Conversion failed. Check the input format and try again.',
    copied: 'Copied',
    guideTitle: 'How to use this converter',
    faqTitle: 'FAQ',
    relatedTitle: 'Related converters',
    categoriesTitle: 'Browse by category',
    strategyTitle: 'More useful converter categories',
    strategyText:
      'Find practical tools for text, files, developer utilities, dates, colors, calculators, encoding and everyday formatting work.',
    footer: 'Online Converter. Fast bilingual tools for privacy-first conversion.'
  },
  he: {
    direction: 'rtl',
    langLabel: 'English',
    langPath: 'en',
    home: 'בית',
    tools: 'כלים',
    sitemap: 'מפת אתר',
    search: 'חיפוש ממירים',
    searchPlaceholder: 'חפש JSON, טקסט, Base64...',
    popular: 'פופולרי',
    new: 'חדש',
    open: 'פתח ממיר',
    allTools: 'כל הממירים',
    heroEyebrow: 'ממירים דו־לשוניים מהירים לעבודה יומיומית ברשת',
    heroTitle: 'המרת קבצים, טקסט, נתונים וכלי פיתוח ישירות בדפדפן.',
    heroText:
      'מרכז ממירים ממוקד פרטיות, עברית ואנגלית, עם דפים סטטיים מהירים, כלים מדויקים ותוצאות נקיות.',
    heroCta: 'צפה בממירים',
    privacy: 'רץ מקומית בדפדפן',
    noUpload: 'בלי העלאות',
    instant: 'תוצאות מידיות',
    adLabel: 'פרסומת',
    input: 'קלט',
    output: 'פלט',
    convert: 'המר',
    autoConvert: 'אוטומטי',
    sample: 'דוגמה',
    clear: 'נקה',
    copy: 'העתק',
    download: 'הורד',
    swap: 'החלף',
    characters: 'תווים',
    lines: 'שורות',
    warnings: 'אזהרות',
    conversionFailed: 'ההמרה נכשלה. בדוק את פורמט הקלט ונסה שוב.',
    copied: 'הועתק',
    guideTitle: 'איך משתמשים בממיר',
    faqTitle: 'שאלות נפוצות',
    relatedTitle: 'ממירים קשורים',
    categoriesTitle: 'עיון לפי קטגוריה',
    strategyTitle: 'עוד קטגוריות שימושיות',
    strategyText:
      'מצא כלים שימושיים לטקסט, קבצים, פיתוח, תאריכים, צבעים, מחשבונים, קידוד ועיצוב נתונים יומיומי.',
    footer: 'אונליין קונברטר. כלים דו־לשוניים מהירים להמרה פרטית.'
  }
} as const;
