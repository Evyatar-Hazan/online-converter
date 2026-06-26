import type { ConverterTool, Locale } from '../types';

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
