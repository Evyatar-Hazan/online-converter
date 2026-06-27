import { categoryLabels } from '../data/site';
import type { ConverterCategory, Locale } from '../types';

const categoryFocusTerms: Record<
  ConverterCategory,
  Record<Locale, { titleLead: string; titleSuffix: string; descriptionLead: string }>
> = {
  data: {
    en: {
      titleLead: 'Data Format Converters',
      titleSuffix: 'JSON, CSV, XML and YAML Online',
      descriptionLead: 'Use browser-based data format converters for JSON, CSV, XML and YAML'
    },
    he: {
      titleLead: 'ממירי פורמטי נתונים',
      titleSuffix: 'JSON, CSV, XML ו־YAML אונליין',
      descriptionLead: 'השתמש בממירי פורמטי נתונים בדפדפן עבור JSON, CSV, XML ו־YAML'
    }
  },
  text: {
    en: {
      titleLead: 'Text Tools',
      titleSuffix: 'Sort, Clean and Format Text Online',
      descriptionLead: 'Use browser-based text tools to sort, clean, count and format text'
    },
    he: {
      titleLead: 'כלי טקסט',
      titleSuffix: 'מיון, ניקוי ועיצוב טקסט אונליין',
      descriptionLead: 'השתמש בכלי טקסט בדפדפן כדי למיין, לנקות, לספור ולעצב טקסט'
    }
  },
  encoding: {
    en: {
      titleLead: 'Encoding and Decoding Tools',
      titleSuffix: 'Base64, URL and Web Text Online',
      descriptionLead: 'Use browser-based encoding and decoding tools for Base64, URL values and web-safe text'
    },
    he: {
      titleLead: 'כלי קידוד ופענוח',
      titleSuffix: 'Base64, URL וטקסט לרשת אונליין',
      descriptionLead: 'השתמש בכלי קידוד ופענוח בדפדפן עבור Base64, ערכי URL וטקסט בטוח לרשת'
    }
  },
  time: {
    en: {
      titleLead: 'Date and Time Converters',
      titleSuffix: 'Timestamps and Dates Online',
      descriptionLead: 'Use browser-based date and time converters for Unix timestamps, readable dates and UTC checks'
    },
    he: {
      titleLead: 'ממירי תאריך וזמן',
      titleSuffix: 'טיימסטמפים ותאריכים אונליין',
      descriptionLead: 'השתמש בממירי תאריך וזמן בדפדפן עבור Unix timestamps, תאריכים קריאים ובדיקות UTC'
    }
  },
  developer: {
    en: {
      titleLead: 'Developer Tools',
      titleSuffix: 'JSON, JWT and Web Utilities Online',
      descriptionLead: 'Use browser-based developer tools for JSON, JWT, HTML, headers and everyday debugging tasks'
    },
    he: {
      titleLead: 'כלי פיתוח',
      titleSuffix: 'JSON, JWT וכלי Web אונליין',
      descriptionLead: 'השתמש בכלי פיתוח בדפדפן עבור JSON, JWT, HTML, headers ומשימות דיבוג יומיומיות'
    }
  },
  color: {
    en: {
      titleLead: 'Color Converters',
      titleSuffix: 'HEX, RGB, HSL and CMYK Online',
      descriptionLead: 'Use browser-based color converters for HEX, RGB, HSL and CMYK values'
    },
    he: {
      titleLead: 'ממירי צבעים',
      titleSuffix: 'HEX, RGB, HSL ו־CMYK אונליין',
      descriptionLead: 'השתמש בממירי צבעים בדפדפן עבור ערכי HEX, RGB, HSL ו־CMYK'
    }
  },
  calculator: {
    en: {
      titleLead: 'Online Calculators',
      titleSuffix: 'Percentages, Discounts and Everyday Math',
      descriptionLead: 'Use browser-based calculators for percentages, discounts, averages, ratios and everyday math'
    },
    he: {
      titleLead: 'מחשבונים אונליין',
      titleSuffix: 'אחוזים, הנחות וחישובים יומיומיים',
      descriptionLead: 'השתמש במחשבונים בדפדפן עבור אחוזים, הנחות, ממוצעים, יחסים וחישובים יומיומיים'
    }
  }
};

export function getCategoryPageTitle(category: ConverterCategory, locale: Locale) {
  const focus = categoryFocusTerms[category][locale];
  return `${focus.titleLead} | ${focus.titleSuffix}`;
}

export function getCategoryMetaDescription(category: ConverterCategory, locale: Locale, toolCount: number) {
  const focus = categoryFocusTerms[category][locale];
  const categoryLabel = categoryLabels[category][locale];

  if (locale === 'he') {
    return `${focus.descriptionLead}. הקטגוריה כוללת ${toolCount} כלים בקטגוריית ${categoryLabel}, עם תמיכה בעברית ובאנגלית, בלי העלאות ועם תוצאה מיידית.`;
  }

  return `${focus.descriptionLead}. Includes ${toolCount} ${categoryLabel.toLowerCase()} with Hebrew and English support and no uploads.`;
}
