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
  color: { en: 'Colors', he: 'צבעים' },
  calculator: { en: 'Calculators', he: 'מחשבונים' }
};

export const categoryContent: Record<
  ConverterCategory,
  Record<
    Locale,
    {
      title: string;
      description: string;
      intro: string;
      useCases: string[];
      faq: { question: string; answer: string }[];
    }
  >
> = {
  data: {
    en: {
      title: 'Data Format Converters',
      description: 'Convert JSON, CSV, XML and YAML formats online with fast browser-based tools.',
      intro: 'Work with common data formats without uploading files. These converters help clean, reshape and move structured data between everyday tools.',
      useCases: ['Prepare API responses for spreadsheets', 'Move data between configuration formats', 'Clean pasted payloads before sharing'],
      faq: [
        {
          question: 'Do these data converters upload my files?',
          answer: 'No. The conversion happens in your browser, so pasted data stays on your device.'
        },
        {
          question: 'Which data formats are supported here?',
          answer: 'This category includes JSON, CSV, XML and YAML tools, with more structured data converters planned.'
        },
        {
          question: 'When should I use a data format converter instead of editing manually?',
          answer: 'Use a converter when you need to reshape large payloads, move data between tools, or avoid formatting mistakes that happen when editing structured content by hand.'
        },
        {
          question: 'Are these converters useful for API and spreadsheet work?',
          answer: 'Yes. This category is especially helpful when turning API responses into spreadsheet-friendly data or cleaning exports before sharing them with teammates.'
        }
      ]
    },
    he: {
      title: 'ממירי פורמטי נתונים',
      description: 'המרת JSON, CSV, XML ו־YAML אונליין באמצעות כלים מהירים שרצים בדפדפן.',
      intro: 'עבוד עם פורמטי נתונים נפוצים בלי להעלות קבצים. הממירים כאן עוזרים לנקות, לעצב ולהעביר נתונים בין כלים יומיומיים.',
      useCases: ['הכנת תגובות API לגיליונות', 'מעבר בין פורמטי קונפיגורציה', 'ניקוי payload לפני שיתוף'],
      faq: [
        {
          question: 'האם ממירי הנתונים מעלים את הקבצים שלי?',
          answer: 'לא. ההמרה מתבצעת בדפדפן שלך, כך שהמידע שהדבקת נשאר במכשיר.'
        },
        {
          question: 'אילו פורמטים נתמכים כאן?',
          answer: 'הקטגוריה כוללת כלי JSON, CSV, XML ו־YAML, ובהמשך אפשר להוסיף עוד ממירי נתונים מובנים.'
        },
        {
          question: 'מתי עדיף להשתמש בממיר פורמטים במקום לערוך ידנית?',
          answer: 'כדאי להשתמש בממיר כשצריך להעביר payloads גדולים בין כלים, לשנות מבנה נתונים במהירות, או להימנע משגיאות פורמט שנוצרות בעריכה ידנית.'
        },
        {
          question: 'האם הכלים האלה מתאימים לעבודה עם API וגיליונות?',
          answer: 'כן. הקטגוריה הזאת שימושית במיוחד כשצריך להפוך תגובות API לנתונים נוחים לגיליון או לנקות יצוא לפני שיתוף עם צוות.'
        }
      ]
    }
  },
  text: {
    en: {
      title: 'Text Tools and Converters',
      description: 'Format, clean, sort and count text online with simple browser-based tools.',
      intro: 'Use these tools for writing, editing and preparing text for websites, documents, spreadsheets and automation.',
      useCases: ['Clean lists before importing them', 'Prepare titles, slugs and snippets', 'Count words and characters for content work'],
      faq: [
        {
          question: 'Can these tools handle Hebrew text?',
          answer: 'Yes. The text tools are designed to work with Hebrew, English and Unicode text.'
        },
        {
          question: 'Can I use these tools for long lists?',
          answer: 'Yes. They run locally in your browser and are useful for sorting, counting and cleaning pasted lists.'
        },
        {
          question: 'Which text tasks are most common in this category?',
          answer: 'People usually use these tools to sort lines, remove duplicates, count words, clean pasted content, and prepare text for websites or spreadsheets.'
        },
        {
          question: 'Are these text tools good for SEO and content work?',
          answer: 'Yes. They are useful for preparing headings, slugs, meta text, keyword lists, and content drafts in both Hebrew and English.'
        }
      ]
    },
    he: {
      title: 'כלי טקסט וממירים',
      description: 'עיצוב, ניקוי, מיון וספירת טקסט אונליין באמצעות כלים פשוטים בדפדפן.',
      intro: 'הכלים כאן מתאימים לכתיבה, עריכה והכנת טקסט לאתרים, מסמכים, גיליונות ואוטומציות.',
      useCases: ['ניקוי רשימות לפני ייבוא', 'הכנת כותרות, slugs וקטעי טקסט', 'ספירת מילים ותווים לעבודה על תוכן'],
      faq: [
        {
          question: 'האם הכלים עובדים טוב עם עברית?',
          answer: 'כן. כלי הטקסט בנויים לעבוד עם עברית, אנגלית וטקסט Unicode.'
        },
        {
          question: 'אפשר להשתמש בהם לרשימות ארוכות?',
          answer: 'כן. הם רצים מקומית בדפדפן ומתאימים למיון, ספירה וניקוי של רשימות מודבקות.'
        },
        {
          question: 'אילו משימות טקסט נפוצות יש בקטגוריה הזאת?',
          answer: 'בדרך כלל משתמשים כאן כדי למיין שורות, להסיר כפילויות, לספור מילים, לנקות טקסט מודבק ולהכין תוכן לאתרים או לגיליונות.'
        },
        {
          question: 'האם כלי הטקסט טובים גם ל־SEO ולעבודה על תוכן?',
          answer: 'כן. הם מתאימים להכנת כותרות, slugs, תיאורי מטא, רשימות מילות מפתח וטיוטות תוכן בעברית ובאנגלית.'
        }
      ]
    }
  },
  encoding: {
    en: {
      title: 'Encoding and Decoding Tools',
      description: 'Encode and decode Base64, URLs and other web-safe text formats in your browser.',
      intro: 'Quickly prepare text for links, APIs, scripts and data payloads while keeping the work local to your browser.',
      useCases: ['Encode text for URLs and query strings', 'Decode Base64 snippets', 'Prepare safe values for scripts and API payloads'],
      faq: [
        {
          question: 'What is encoding useful for?',
          answer: 'Encoding helps make text safe for URLs, APIs, scripts and systems that expect a specific format.'
        },
        {
          question: 'Does Base64 encryption protect my data?',
          answer: 'No. Base64 is encoding, not encryption. Anyone can decode it.'
        },
        {
          question: 'When do I need URL encoding or decoding?',
          answer: 'You usually need it when building query strings, sharing links with special characters, or debugging parameters that break after being pasted into a browser or API request.'
        },
        {
          question: 'Are these tools useful for developers only?',
          answer: 'No. Marketers, content editors and operations teams also use encoding tools when they work with links, tracking parameters, copied snippets and embedded values.'
        }
      ]
    },
    he: {
      title: 'כלי קידוד ופענוח',
      description: 'קידוד ופענוח Base64, URL ופורמטים בטוחים לרשת ישירות בדפדפן.',
      intro: 'הכן טקסט במהירות עבור קישורים, API, סקריפטים ומטעני נתונים, בלי לשלוח את התוכן לשרת.',
      useCases: ['קידוד טקסט ל־URL ופרמטרים', 'פענוח קטעי Base64', 'הכנת ערכים בטוחים לסקריפטים ו־API'],
      faq: [
        {
          question: 'למה צריך קידוד?',
          answer: 'קידוד עוזר להפוך טקסט לבטוח לשימוש ב־URL, API, סקריפטים ומערכות שמצפות לפורמט מסוים.'
        },
        {
          question: 'האם Base64 מצפין את המידע?',
          answer: 'לא. Base64 הוא קידוד ולא הצפנה. כל אחד יכול לפענח אותו.'
        },
        {
          question: 'מתי צריך קידוד או פענוח של URL?',
          answer: 'בדרך כלל כשבונים פרמטרים לקישור, משתפים כתובות עם תווים מיוחדים, או מדבגים ערכים שנשברים אחרי הדבקה לדפדפן או לבקשת API.'
        },
        {
          question: 'האם הכלים האלה מיועדים רק למפתחים?',
          answer: 'לא. גם אנשי שיווק, תוכן ואופרציה משתמשים בכלי קידוד כשעובדים עם קישורים, פרמטרי מעקב, קטעים מועתקים וערכים משובצים.'
        }
      ]
    }
  },
  time: {
    en: {
      title: 'Date and Time Converters',
      description: 'Convert Unix timestamps and dates online for development, logs and reporting.',
      intro: 'Turn timestamps into readable dates and dates into machine-friendly values for debugging, logs, analytics and integrations.',
      useCases: ['Debug log timestamps', 'Convert dates for API requests', 'Compare UTC and local time output'],
      faq: [
        {
          question: 'Do the timestamp tools support milliseconds?',
          answer: 'Yes. Timestamp conversion handles common second and millisecond values.'
        },
        {
          question: 'Why do UTC and local dates look different?',
          answer: 'UTC is a global time standard, while local time depends on your device timezone.'
        },
        {
          question: 'What are these date and time converters useful for?',
          answer: 'They are useful for logs, analytics, API debugging, scheduling, and checking whether a system stores values in seconds, milliseconds, UTC, or local time.'
        },
        {
          question: 'Can I use these tools for product and reporting workflows?',
          answer: 'Yes. They help when reviewing exported reports, debugging event timestamps, or comparing backend time values with human-readable dates.'
        }
      ]
    },
    he: {
      title: 'ממירי תאריך וזמן',
      description: 'המרת Unix timestamps ותאריכים אונליין עבור פיתוח, לוגים ודוחות.',
      intro: 'הפוך חותמות זמן לתאריכים קריאים ותאריכים לערכים שמתאימים למערכות, לוגים, אנליטיקה ואינטגרציות.',
      useCases: ['דיבוג timestamps בלוגים', 'המרת תאריכים לבקשות API', 'השוואה בין UTC לזמן מקומי'],
      faq: [
        {
          question: 'האם כלי timestamp תומכים במילישניות?',
          answer: 'כן. ההמרה תומכת בערכי שניות ומילישניות נפוצים.'
        },
        {
          question: 'למה UTC וזמן מקומי נראים שונים?',
          answer: 'UTC הוא תקן זמן גלובלי, וזמן מקומי תלוי באזור הזמן של המכשיר שלך.'
        },
        {
          question: 'למה ממירי תאריך וזמן שימושיים בפועל?',
          answer: 'הם שימושיים ללוגים, אנליטיקה, דיבוג API, תזמונים ובדיקת השאלה אם מערכת שומרת ערכים בשניות, מילישניות, UTC או זמן מקומי.'
        },
        {
          question: 'אפשר להשתמש בהם גם בדוחות ובעבודת מוצר?',
          answer: 'כן. הם עוזרים כשבודקים דוחות מיוצאים, מדבגים timestamps של אירועים או משווים ערכי זמן מהשרת לתאריכים קריאים.'
        }
      ]
    }
  },
  developer: {
    en: {
      title: 'Developer Utilities',
      description: 'Fast browser-based tools for JSON, HTML, JWT and common development workflows.',
      intro: 'Small practical utilities for debugging payloads, preparing snippets and cleaning structured text during development.',
      useCases: ['Format JSON before debugging', 'Escape HTML snippets for docs', 'Decode JWT payloads locally'],
      faq: [
        {
          question: 'Does the JWT decoder verify signatures?',
          answer: 'No. It decodes JWT header and payload content only. It does not verify whether a token is trusted.'
        },
        {
          question: 'Are these tools meant for production secrets?',
          answer: 'Avoid pasting secrets into any web tool. These utilities run locally, but sensitive secrets should still be handled carefully.'
        },
        {
          question: 'Which developer tasks fit this category best?',
          answer: 'This category is best for quick formatting, escaping, decoding and small debugging steps that save time during everyday development work.'
        },
        {
          question: 'Can non-developers use some of these tools too?',
          answer: 'Yes. Product managers, QA and technical writers often use developer utilities for inspecting payloads, formatting snippets and checking encoded values.'
        }
      ]
    },
    he: {
      title: 'כלי פיתוח',
      description: 'כלים מהירים בדפדפן עבור JSON, HTML, JWT ותהליכי פיתוח נפוצים.',
      intro: 'כלים קטנים ושימושיים לדיבוג payloads, הכנת קטעי קוד וניקוי טקסט מובנה בזמן פיתוח.',
      useCases: ['עיצוב JSON לפני דיבוג', 'המלטת קטעי HTML לתיעוד', 'פענוח payload של JWT מקומית'],
      faq: [
        {
          question: 'האם מפענח JWT מאמת חתימות?',
          answer: 'לא. הוא מפענח רק header ו־payload של JWT. הוא לא מאמת שהטוקן אמין.'
        },
        {
          question: 'האם כדאי להדביק כאן סודות פרודקשן?',
          answer: 'לא מומלץ להדביק סודות בכלי רשת. הכלים רצים מקומית, אבל סודות רגישים עדיין דורשים זהירות.'
        },
        {
          question: 'אילו משימות פיתוח הכי מתאימות לקטגוריה הזאת?',
          answer: 'הקטגוריה מתאימה במיוחד לעיצוב מהיר, המלטה, פענוח ובדיקות קטנות שחוסכות זמן בעבודת פיתוח יומיומית.'
        },
        {
          question: 'האם גם מי שלא מפתח יכול להשתמש בחלק מהכלים?',
          answer: 'כן. מנהלי מוצר, QA וכותבים טכניים משתמשים לעיתים בכלי פיתוח כדי לבדוק payloads, לעצב קטעים ולבחון ערכים מקודדים.'
        }
      ]
    }
  },
  color: {
    en: {
      title: 'Color Converters',
      description: 'Convert HEX, RGB, HSL and CMYK color values online for CSS, design systems and frontend work.',
      intro: 'Move between common color formats and copy CSS-ready values for design, UI polish and frontend development.',
      useCases: ['Convert brand colors for CSS', 'Move between design and code formats', 'Copy RGB or HEX values quickly'],
      faq: [
        {
          question: 'Can I use these color values in CSS?',
          answer: 'Yes. The output is formatted for common CSS usage.'
        },
        {
          question: 'What formats are supported?',
          answer: 'This category currently supports HEX, RGB, HSL and CMYK conversion.'
        },
        {
          question: 'Who usually uses these color converters?',
          answer: 'They are commonly used by frontend developers, designers, marketers and anyone who needs to move a color between design tools, CSS and print-related formats.'
        },
        {
          question: 'Can these tools help with design system work?',
          answer: 'Yes. They make it easier to normalize brand colors, compare formats, and copy consistent values into tokens, stylesheets or component libraries.'
        }
      ]
    },
    he: {
      title: 'ממירי צבעים',
      description: 'המרת ערכי צבע HEX, RGB, HSL ו־CMYK אונליין עבור CSS, מערכות עיצוב ופיתוח פרונטאנד.',
      intro: 'עבור בין פורמטי צבע נפוצים והעתק ערכים מוכנים ל־CSS עבור עיצוב, ליטוש UI ופיתוח פרונטאנד.',
      useCases: ['המרת צבעי מותג ל־CSS', 'מעבר בין פורמט עיצוב לפורמט קוד', 'העתקת ערכי RGB או HEX במהירות'],
      faq: [
        {
          question: 'אפשר להשתמש בערכים האלה ב־CSS?',
          answer: 'כן. הפלט מעוצב לשימוש נפוץ ב־CSS.'
        },
        {
          question: 'אילו פורמטים נתמכים?',
          answer: 'הקטגוריה תומכת כרגע בהמרה בין HEX, RGB, HSL ו־CMYK.'
        },
        {
          question: 'מי בדרך כלל משתמש בממירי הצבעים האלה?',
          answer: 'בדרך כלל משתמשים בהם מפתחי פרונטאנד, מעצבים, אנשי שיווק וכל מי שצריך להעביר צבע בין כלי עיצוב, CSS ופורמטים שקשורים להדפסה.'
        },
        {
          question: 'האם הכלים האלה עוזרים גם בעבודה עם design systems?',
          answer: 'כן. הם מקלים על יישור צבעי מותג, השוואת פורמטים והעתקת ערכים עקביים ל־tokens, stylesheets או ספריות רכיבים.'
        }
      ]
    }
  },
  calculator: {
    en: {
      title: 'Online Calculators',
      description: 'Simple browser-based calculators for percentages, discounts, averages, ratios and everyday math.',
      intro: 'Use these quick calculators for everyday numbers, simple checks, pricing work and content planning without opening a spreadsheet.',
      useCases: ['Calculate percentages and changes', 'Check discounts and tax totals', 'Summarize number lists and ratios'],
      faq: [
        {
          question: 'Are these calculators free?',
          answer: 'Yes. The calculators are free and run in your browser.'
        },
        {
          question: 'Should I treat calculator output as professional advice?',
          answer: 'No. These tools are meant for quick everyday calculations. Verify important financial, tax or business decisions separately.'
        },
        {
          question: 'What kinds of calculator tasks fit this category?',
          answer: 'This category fits percentage checks, discount math, averages, ratios and other quick calculations that people often do before moving into a spreadsheet.'
        },
        {
          question: 'Are these calculators useful for business and pricing work?',
          answer: 'Yes. They are helpful for quick validation during pricing, content planning, simple budgeting and comparing number scenarios without opening a larger tool.'
        }
      ]
    },
    he: {
      title: 'מחשבונים אונליין',
      description: 'מחשבונים פשוטים בדפדפן עבור אחוזים, הנחות, ממוצעים, יחסים וחישובים יומיומיים.',
      intro: 'השתמש במחשבונים מהירים לבדיקת מספרים יומיומיים, מחירים, תוכן וחישובים פשוטים בלי לפתוח גיליון.',
      useCases: ['חישוב אחוזים ושינוי באחוזים', 'בדיקת הנחות וסכומים כולל מס', 'סיכום רשימות מספרים ויחסים'],
      faq: [
        {
          question: 'האם המחשבונים חינמיים?',
          answer: 'כן. המחשבונים חינמיים ורצים בדפדפן שלך.'
        },
        {
          question: 'האם התוצאה היא ייעוץ מקצועי?',
          answer: 'לא. הכלים מיועדים לחישובים יומיומיים מהירים. החלטות פיננסיות, מס או עסק חשובות כדאי לאמת בנפרד.'
        },
        {
          question: 'אילו סוגי חישובים מתאימים לקטגוריה הזאת?',
          answer: 'הקטגוריה מתאימה לבדיקות אחוזים, הנחות, ממוצעים, יחסים וחישובים מהירים שאנשים עושים לפני שעוברים לגיליון מפורט.'
        },
        {
          question: 'האם המחשבונים שימושיים גם לעבודה עסקית ותמחור?',
          answer: 'כן. הם עוזרים לבדיקות מהירות בזמן תמחור, תכנון תוכן, תקציבים בסיסיים והשוואת תרחישים מספריים בלי לפתוח כלי גדול יותר.'
        }
      ]
    }
  }
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
    footer: 'Online Converter. Fast bilingual tools for privacy-first conversion.',
    credit: 'Developed by'
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
    footer: 'אונליין קונברטר. כלים דו־לשוניים מהירים להמרה פרטית.',
    credit: 'פותח על ידי'
  }
} as const;
