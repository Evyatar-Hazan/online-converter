import type { ConverterCategory, Locale } from '../types';

type ContentBlock = {
  title: string;
  description: string;
};

export function getHomeTrustBlocks(locale: Locale): ContentBlock[] {
  return locale === 'he'
    ? [
        {
          title: 'עבודה מקומית בדפדפן',
          description: 'הכלים רצים בדפדפן כדי לאפשר המרה, בדיקה וניקוי בלי לפתוח חשבון ובלי להעביר את התוכן לשרת.'
        },
        {
          title: 'התחלה מהירה עם דוגמאות',
          description: 'ברוב הכלים יש דוגמאות התחלה, metadata ו-preview כדי להבין את מבנה הקלט לפני שמדביקים נתונים אמיתיים.'
        },
        {
          title: 'מעבר ישיר לכלי הבא',
          description: 'עמודי הממירים והקטגוריות בנויים כך שקל להמשיך לכלי קשור, להמרה הפוכה או לשלב הבא בתהליך.'
        }
      ]
    : [
        {
          title: 'Local work in the browser',
          description: 'The tools run in the browser so you can convert, inspect and clean content without creating an account or sending the payload to a server.'
        },
        {
          title: 'Fast starts with examples',
          description: 'Most tools include starter examples, metadata and previews so you can understand the expected input before pasting real work.'
        },
        {
          title: 'Direct path to the next tool',
          description: 'Tool and category pages are structured so it is easy to continue into a related converter, the reverse direction, or the next workflow step.'
        }
      ];
}

export function getHomeAudienceList(locale: Locale): string[] {
  return locale === 'he'
    ? [
        'מפתחים שצריכים בדיקה מהירה של JSON, JWT, headers, timestamps ופורמטים טכניים אחרים.',
        'אנשי תוכן, SEO ושיווק שצריכים לנקות רשימות, להכין slugs, snippets, UTM links ותיאורי מטא.',
        'אנליסטים, אופרציה וצוותי מוצר שצריכים המרות קטנות ומהירות בלי לפתוח גיליון או כלי כבד יותר.'
      ]
    : [
        'Developers who need quick checks for JSON, JWT, headers, timestamps and other technical formats.',
        'Content, SEO and marketing teams who need cleaner lists, slugs, snippets, UTM links and meta descriptions.',
        'Analysts, operations and product teams who need small fast conversions without opening a spreadsheet or heavier tool first.'
      ];
}

export function getCategoryAudience(category: ConverterCategory, locale: Locale): string[] {
  const copy = {
    data: {
      en: ['API and backend work', 'Spreadsheet cleanup and exports', 'Configuration and schema handoff'],
      he: ['עבודת API ו־backend', 'ניקוי יצואים וגיליונות', 'העברת קונפיגורציה ו־schema']
    },
    text: {
      en: ['SEO and content cleanup', 'List preparation and deduplication', 'Copy editing and publishing support'],
      he: ['ניקוי תוכן ו־SEO', 'הכנת רשימות והסרת כפילויות', 'עריכת טקסט ותמיכה בפרסום']
    },
    encoding: {
      en: ['Links and tracking parameters', 'Base64 and safe-string debugging', 'Copied values for scripts and embeds'],
      he: ['קישורים ופרמטרי מעקב', 'דיבוג Base64 ומחרוזות בטוחות', 'ערכים מועתקים לסקריפטים והטמעות']
    },
    time: {
      en: ['Logs and event review', 'Scheduling and timezone comparisons', 'Reporting and export checks'],
      he: ['לוגים ובדיקת אירועים', 'תזמונים והשוואות אזורי זמן', 'בדיקות דוחות ויצואים']
    },
    developer: {
      en: ['Payload inspection', 'Snippet formatting and escaping', 'Quick debugging before production changes'],
      he: ['בדיקת payloads', 'עיצוב והמרת snippets', 'דיבוג מהיר לפני שינויי production']
    },
    color: {
      en: ['CSS and design token work', 'Brand color handoff', 'Frontend polish and component styling'],
      he: ['עבודת CSS ו־design tokens', 'העברת צבעי מותג', 'ליטוש פרונטאנד ועיצוב קומפוננטות']
    },
    calculator: {
      en: ['Quick business estimates', 'Consumer and finance checks', 'Daily math before deeper planning'],
      he: ['הערכות עסקיות מהירות', 'בדיקות צרכניות ופיננסיות', 'חישובים יומיומיים לפני תכנון עמוק יותר']
    }
  };

  return copy[category][locale];
}

export function getCategorySelectionChecks(category: ConverterCategory, locale: Locale): string[] {
  const copy = {
    data: {
      en: ['Use a formatter when structure matters first.', 'Use a converter when the target format is already known.', 'Use extractors or filters when only one part of the payload matters.'],
      he: ['התחל ממעצב כאשר קודם צריך לאמת מבנה.', 'בחר ממיר כאשר פורמט היעד כבר ידוע.', 'השתמש בחילוץ או סינון כשחשוב רק חלק מה־payload.']
    },
    text: {
      en: ['Use cleanup tools before counting or analysis.', 'Use case converters when the wording is already correct but the format is not.', 'Use counters when the decision depends on length, not wording.'],
      he: ['השתמש בכלי ניקוי לפני ספירה או ניתוח.', 'בחר ממירי אותיות כשניסוח הטקסט נכון אבל הפורמט לא.', 'השתמש בסופרים כשההחלטה תלויה באורך ולא בנוסח.']
    },
    encoding: {
      en: ['Decode first when the value is unreadable.', 'Encode only once before testing the final output.', 'Use URL-safe tools when the result is going into a query string or link.'],
      he: ['פענח קודם כשאי אפשר לקרוא את הערך.', 'בצע קידוד פעם אחת לפני בדיקת הפלט הסופי.', 'השתמש בכלים בטוחים ל־URL כשהפלט נכנס לקישור או query string.']
    },
    time: {
      en: ['Confirm whether the source is UTC, local time, seconds or milliseconds first.', 'Use a pure converter when the value is known.', 'Use calculators when the task is about duration, pace or business-day differences.'],
      he: ['בדוק קודם אם המקור הוא UTC, זמן מקומי, שניות או מילישניות.', 'השתמש בממיר פשוט כשהערך עצמו כבר ידוע.', 'בחר מחשבונים כשהמשימה עוסקת במשך, קצב או הפרשי ימי עסקים.']
    },
    developer: {
      en: ['Start with inspection tools before editing output manually.', 'Use validators when correctness matters more than formatting.', 'Use explainers and decoders when the structure is opaque but not broken.'],
      he: ['התחל בכלי בדיקה לפני עריכה ידנית של הפלט.', 'בחר validators כשהתקינות חשובה יותר מהעיצוב.', 'השתמש במסבירים ומפענחים כשהמבנה לא ברור אבל לא שבור.']
    },
    color: {
      en: ['Choose the converter by the format your destination already expects.', 'Use opacity helpers when alpha is the only missing part.', 'Keep one reference color while comparing output across formats.'],
      he: ['בחר ממיר לפי הפורמט שהיעד כבר דורש.', 'השתמש בכלי opacity כשחסר רק ערך alpha.', 'השאר צבע ייחוס אחד בזמן שאתה משווה פלטים בין פורמטים.']
    },
    calculator: {
      en: ['Check units and input order before converting.', 'Use one focused calculator instead of forcing unrelated numbers into a generic tool.', 'Re-run one small sample when the result will affect pricing or planning.'],
      he: ['בדוק יחידות וסדר קלט לפני החישוב.', 'בחר מחשבון ממוקד במקום לדחוף מספרים לא קשורים לכלי כללי.', 'הרץ דוגמה קטנה נוספת כשהתוצאה תשפיע על תמחור או תכנון.']
    }
  };

  return copy[category][locale];
}
