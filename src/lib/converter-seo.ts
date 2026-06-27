import { siteUrl } from '../data/site';
import type { ConverterTool, FaqItem, Locale } from '../types';

export const searchIntents = ['convert', 'calculate', 'validate', 'format', 'decode', 'clean', 'generate', 'explain'] as const;

export type SearchIntent = (typeof searchIntents)[number];

export function formatContentType(value: string) {
  const names: Record<string, string> = {
    json: 'JSON',
    jsonl: 'JSONL',
    csv: 'CSV',
    xml: 'XML',
    yaml: 'YAML',
    html: 'HTML',
    'escaped html': 'escaped HTML',
    base64: 'Base64',
    binary: 'binary',
    decimal: 'decimal',
    url: 'URL',
    'query string': 'query string',
    jwt: 'JWT',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    cmyk: 'CMYK',
    regex: 'Regex',
    'unicode escape': 'Unicode escape',
    count: 'count',
    uuid: 'UUID',
    numbers: 'numbers',
    percentage: 'percentage',
    calculation: 'calculation',
    ratio: 'ratio',
    'trimmed text': 'trimmed text',
    'compact lines': 'compact lines',
    'numbered lines': 'numbered lines',
    'clean text': 'clean text',
    'camel case': 'camelCase',
    'snake case': 'snake_case',
    'kebab case': 'kebab-case',
    lines: 'lines',
    'sorted lines': 'sorted lines',
    'unique lines': 'unique lines'
  };

  return names[value] ?? value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getSearchIntent(tool: ConverterTool): SearchIntent {
  const slug = tool.slug.toLowerCase();
  const converterId = tool.converterId.toLowerCase();

  if (tool.category === 'calculator') {
    return 'calculate';
  }

  if (slug.includes('lookup') || slug.includes('parser') || slug.includes('explainer')) {
    return 'explain';
  }

  if (slug.includes('validator') || slug.includes('checker') || slug.includes('tester') || slug.includes('contrast-checker')) {
    return 'validate';
  }

  if (
    slug.includes('formatter') ||
    slug.includes('minifier') ||
    slug.includes('sorter') ||
    slug.includes('generator') ||
    slug.includes('json-path-extractor') ||
    slug.includes('column-extractor')
  ) {
    return slug.includes('generator') ? 'generate' : 'format';
  }

  if (
    slug.includes('decode') ||
    slug.includes('decoder') ||
    slug.includes('unescape') ||
    slug.includes('binary-to-text') ||
    slug.includes('morse-code-to-text') ||
    slug.includes('jwt-decoder')
  ) {
    return 'decode';
  }

  if (
    slug.includes('remove') ||
    slug.includes('trim') ||
    slug.includes('diff') ||
    slug.includes('filter') ||
    slug.includes('find-replace') ||
    slug.includes('alphabetizer')
  ) {
    return 'clean';
  }

  if (
    slug.includes('encode') ||
    slug.includes('escape') ||
    slug.includes('uuid-generator') ||
    slug.includes('random-number-generator') ||
    converterId.includes('generator')
  ) {
    return 'generate';
  }

  if (tool.inputType !== tool.outputType || slug.includes('-to-')) {
    return 'convert';
  }

  return 'format';
}

export function getConverterIntro(tool: ConverterTool, locale: Locale) {
  const intent = getSearchIntent(tool);
  const input = formatContentType(tool.inputType);
  const output = formatContentType(tool.outputType);
  const primaryKeyword = tool.keywords[locale][0] ?? tool.shortTitle[locale];
  const firstFeature = tool.features[locale][0]?.toLowerCase() ?? '';

  const intentLead = {
    convert: {
      en: `${tool.shortTitle.en} converts ${input} into ${output} when you need an exact browser-based result without changing the original meaning of the content.`,
      he: `${tool.shortTitle.he} ממיר ${input} ל־${output} כשצריך תוצאה מדויקת בדפדפן בלי לשנות את המשמעות המקורית של התוכן.`
    },
    calculate: {
      en: `${tool.shortTitle.en} gives a fast answer for ${primaryKeyword} queries when you need a simple calculation, estimate or comparison without opening a spreadsheet.`,
      he: `${tool.shortTitle.he} נותן תשובה מהירה לחיפושי ${primaryKeyword} כשצריך חישוב, הערכה או השוואה בלי לפתוח גיליון.`
    },
    validate: {
      en: `${tool.shortTitle.en} checks whether your ${input} input is valid, complete and ready to use before you publish it, share it or move it into another workflow.`,
      he: `${tool.shortTitle.he} בודק אם קלט ${input} שלך תקין, מלא ומוכן לשימוש לפני פרסום, שיתוף או העברה לתהליך אחר.`
    },
    format: {
      en: `${tool.shortTitle.en} restructures ${input} into a cleaner ${output} shape so the result is easier to read, reuse and paste into the next step of the workflow.`,
      he: `${tool.shortTitle.he} מסדר ${input} למבנה ${output} נקי יותר כדי שיהיה קל יותר לקרוא, להשתמש ולהדביק את התוצאה לשלב הבא.`
    },
    decode: {
      en: `${tool.shortTitle.en} reveals the readable ${output} behind encoded or compressed ${input} values so you can inspect real content before using it.`,
      he: `${tool.shortTitle.he} חושף את פלט ה־${output} הקריא שמאחורי ערכי ${input} מקודדים או דחוסים כדי שאפשר יהיה לבדוק את התוכן האמיתי לפני שימוש.`
    },
    clean: {
      en: `${tool.shortTitle.en} cleans ${input} quickly when the main goal is removing noise, fixing repeated formatting problems or preparing content for copy and import.`,
      he: `${tool.shortTitle.he} מנקה ${input} במהירות כשהמטרה היא להסיר רעש, לתקן בעיות פורמט חוזרות ולהכין תוכן להעתקה או לייבוא.`
    },
    generate: {
      en: `${tool.shortTitle.en} generates ready-to-use ${output} output from simple input so you can move faster through repetitive technical and content tasks.`,
      he: `${tool.shortTitle.he} מייצר פלט ${output} מוכן לשימוש מתוך קלט פשוט כדי להתקדם מהר יותר במשימות טכניות ותוכניות שחוזרות על עצמן.`
    },
    explain: {
      en: `${tool.shortTitle.en} breaks down ${input} into readable details so you can understand what a value, URL, header or code means before acting on it.`,
      he: `${tool.shortTitle.he} מפרק ${input} לפרטים קריאים כדי להבין מה ערך, URL, כותרת או קוד באמת אומרים לפני שפועלים עליהם.`
    }
  };

  const supportLine = locale === 'he'
    ? `הכלי רץ מקומית בדפדפן, תומך בעברית ובאנגלית, וכולל ${firstFeature || 'פלט מיידי'} יחד עם העתקה או הורדה בלי להעלות מידע לשרת.`
    : `It runs locally in the browser, supports Hebrew and English input, and includes ${firstFeature || 'instant output'} with copy or download actions without uploading data to a server.`;

  return `${intentLead[intent][locale]} ${supportLine}`;
}

function formatFeatureForSnippet(feature: string, locale: Locale) {
  if (!feature) return locale === 'he' ? 'תוצאה מהירה' : 'fast results';

  if (locale === 'he') {
    return feature;
  }

  return feature.charAt(0).toLowerCase() + feature.slice(1);
}

function getTitleSuffix(tool: ConverterTool, locale: Locale) {
  const intent = getSearchIntent(tool);

  const englishSuffixes: Record<SearchIntent, string> = {
    convert: 'Free Online, No Upload',
    calculate: 'Free Online Calculator',
    validate: 'Free Online Checker',
    format: 'Free Online Formatter',
    decode: 'Free Online Decoder',
    clean: 'Free Online Cleanup',
    generate: 'Free Online Generator',
    explain: 'Free Online Tool'
  };

  const hebrewSuffixes: Record<SearchIntent, string> = {
    convert: 'חינם אונליין, בלי העלאה',
    calculate: 'מחשבון חינמי אונליין',
    validate: 'בדיקה חינמית אונליין',
    format: 'עיצוב חינמי אונליין',
    decode: 'פענוח חינמי אונליין',
    clean: 'ניקוי חינמי אונליין',
    generate: 'מחולל חינמי אונליין',
    explain: 'כלי חינמי אונליין'
  };

  return locale === 'he' ? hebrewSuffixes[intent] : englishSuffixes[intent];
}

export function getConverterPageTitle(tool: ConverterTool, locale: Locale) {
  return `${tool.title[locale]} | ${getTitleSuffix(tool, locale)}`;
}

export function getConverterMetaDescription(tool: ConverterTool, locale: Locale) {
  const intent = getSearchIntent(tool);
  const input = formatContentType(tool.inputType);
  const output = formatContentType(tool.outputType);
  const featureOne = formatFeatureForSnippet(tool.features[locale][0] ?? '', locale);
  const featureTwo = formatFeatureForSnippet(tool.features[locale][1] ?? '', locale);

  const englishTemplates: Record<SearchIntent, string> = {
    convert: `${tool.shortTitle.en} converts ${input} to ${output} in your browser with ${featureOne}, ${featureTwo}, examples, copy/download actions, and no upload.`,
    calculate: `Use ${tool.shortTitle.en} in your browser for fast results with examples, instant output, copy/download actions, and no upload.`,
    validate: `${tool.shortTitle.en} checks ${input} quickly in your browser with ${featureOne}, clear results, examples, and no upload.`,
    format: `${tool.shortTitle.en} formats ${input} into cleaner ${output} output in your browser with ${featureOne}, examples, copy/download, and no upload.`,
    decode: `${tool.shortTitle.en} reveals readable ${output} from ${input} values in your browser with ${featureOne}, examples, copy/download, and no upload.`,
    clean: `${tool.shortTitle.en} cleans ${input} in your browser with ${featureOne}, examples, copy/download actions, and no upload.`,
    generate: `${tool.shortTitle.en} creates ready-to-use ${output} in your browser with ${featureOne}, examples, copy/download actions, and no upload.`,
    explain: `${tool.shortTitle.en} breaks down ${input} in your browser with ${featureOne}, examples, clear output, and no upload.`
  };

  const hebrewTemplates: Record<SearchIntent, string> = {
    convert: `${tool.shortTitle.he} ממיר ${input} ל־${output} ישירות בדפדפן עם ${featureOne}, ${featureTwo}, דוגמאות, העתקה או הורדה, ובלי העלאת מידע.`,
    calculate: `${tool.shortTitle.he} נותן תוצאה מהירה בדפדפן עם דוגמאות, פלט מיידי, העתקה או הורדה, ובלי העלאת מידע.`,
    validate: `${tool.shortTitle.he} בודק ${input} במהירות בדפדפן עם ${featureOne}, תוצאה ברורה, דוגמאות ובלי העלאת מידע.`,
    format: `${tool.shortTitle.he} מסדר ${input} לפלט ${output} נקי יותר בדפדפן עם ${featureOne}, דוגמאות, העתקה או הורדה, ובלי העלאת מידע.`,
    decode: `${tool.shortTitle.he} חושף ${output} קריא מתוך ${input} בדפדפן עם ${featureOne}, דוגמאות, העתקה או הורדה, ובלי העלאת מידע.`,
    clean: `${tool.shortTitle.he} מנקה ${input} בדפדפן עם ${featureOne}, דוגמאות, העתקה או הורדה, ובלי העלאת מידע.`,
    generate: `${tool.shortTitle.he} יוצר ${output} מוכן לשימוש בדפדפן עם ${featureOne}, דוגמאות, העתקה או הורדה, ובלי העלאת מידע.`,
    explain: `${tool.shortTitle.he} מפרק ${input} לפרטים קריאים בדפדפן עם ${featureOne}, דוגמאות, פלט ברור ובלי העלאת מידע.`
  };

  return locale === 'he' ? hebrewTemplates[intent] : englishTemplates[intent];
}

export function getConverterStructuredData(
  tool: ConverterTool,
  locale: Locale,
  description: string,
  contextualFaq: FaqItem[],
  homeLabel: string,
  categoryLabel: string
) {
  const canonicalPath = `/${locale}/${tool.slug}/`;
  const categoryPath = `/${locale}/${tool.category}/`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.title[locale],
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web browser',
      url: `${siteUrl}${canonicalPath}`,
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: contextualFaq.map((item) => ({
        '@type': 'Question',
        name: item.question[locale],
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer[locale]
        }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeLabel, item: `${siteUrl}/${locale}/` },
        { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${siteUrl}${categoryPath}` },
        { '@type': 'ListItem', position: 3, name: tool.shortTitle[locale], item: `${siteUrl}${canonicalPath}` }
      ]
    }
  ];
}
