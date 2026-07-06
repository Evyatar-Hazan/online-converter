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

export function getCategoryPageSignals(category: ConverterCategory, locale: Locale): { label: string; value: string }[] {
  const copy = {
    data: {
      en: [
        { label: 'Best for', value: 'Moving payloads between APIs, spreadsheets and config files.' },
        { label: 'Start with', value: 'Formatters first, then direct converters once the structure is valid.' },
        { label: 'Typical outcome', value: 'Cleaner exports and fewer manual fixes before sharing.' }
      ],
      he: [
        { label: 'מתאים במיוחד ל', value: 'מעבר payloads בין APIs, גיליונות וקבצי קונפיגורציה.' },
        { label: 'כדאי להתחיל עם', value: 'Formatter קודם, ואז ממיר ישיר כשהמבנה כבר תקין.' },
        { label: 'מה בדרך כלל מרוויחים', value: 'יצוא נקי יותר ופחות תיקונים ידניים לפני שיתוף.' }
      ]
    },
    text: {
      en: [
        { label: 'Best for', value: 'Cleaning lists, shaping copy and preparing SEO text quickly.' },
        { label: 'Start with', value: 'Cleanup tools before counters, formatters or text reshaping.' },
        { label: 'Typical outcome', value: 'Less repetitive editing and better publishing readiness.' }
      ],
      he: [
        { label: 'מתאים במיוחד ל', value: 'ניקוי רשימות, עיצוב קופי והכנת טקסט ל־SEO במהירות.' },
        { label: 'כדאי להתחיל עם', value: 'כלי ניקוי לפני ספירה, עיצוב או שינוי מבנה הטקסט.' },
        { label: 'מה בדרך כלל מרוויחים', value: 'פחות עריכה חוזרת ומוכנות טובה יותר לפרסום.' }
      ]
    },
    encoding: {
      en: [
        { label: 'Best for', value: 'URLs, copied snippets, embedded values and safe transport strings.' },
        { label: 'Start with', value: 'Decode when the source is unreadable and encode only at the final step.' },
        { label: 'Typical outcome', value: 'Cleaner links and fewer broken parameters in shared flows.' }
      ],
      he: [
        { label: 'מתאים במיוחד ל', value: 'קישורים, snippets מועתקים, ערכים משובצים ומחרוזות מעבר בטוחות.' },
        { label: 'כדאי להתחיל עם', value: 'פענוח כשהמקור לא קריא, וקידוד רק בשלב הסופי.' },
        { label: 'מה בדרך כלל מרוויחים', value: 'קישורים נקיים יותר ופחות פרמטרים שבורים.' }
      ]
    },
    time: {
      en: [
        { label: 'Best for', value: 'Logs, reporting, schedules and timestamp debugging.' },
        { label: 'Start with', value: 'Check seconds vs milliseconds before comparing outputs.' },
        { label: 'Typical outcome', value: 'Faster debugging when systems disagree on date formats.' }
      ],
      he: [
        { label: 'מתאים במיוחד ל', value: 'לוגים, דוחות, תזמונים ודיבוג timestamps.' },
        { label: 'כדאי להתחיל עם', value: 'בדיקת שניות מול מילישניות לפני שמשווים פלטים.' },
        { label: 'מה בדרך כלל מרוויחים', value: 'דיבוג מהיר יותר כשמערכות לא מסכימות על פורמט התאריך.' }
      ]
    },
    developer: {
      en: [
        { label: 'Best for', value: 'Quick inspection, formatting and debugging before production changes.' },
        { label: 'Start with', value: 'Inspection and validation tools before manual edits.' },
        { label: 'Typical outcome', value: 'Less guesswork when dealing with opaque payloads and snippets.' }
      ],
      he: [
        { label: 'מתאים במיוחד ל', value: 'בדיקה, עיצוב ודיבוג מהיר לפני שינויי production.' },
        { label: 'כדאי להתחיל עם', value: 'כלי בדיקה ו־validation לפני עריכה ידנית.' },
        { label: 'מה בדרך כלל מרוויחים', value: 'פחות ניחושים מול payloads וקטעים טכניים לא ברורים.' }
      ]
    },
    color: {
      en: [
        { label: 'Best for', value: 'CSS, design tokens and handoff between brand and frontend work.' },
        { label: 'Start with', value: 'Match the tool to the exact format your destination already expects.' },
        { label: 'Typical outcome', value: 'Cleaner UI polish with fewer manual color conversions.' }
      ],
      he: [
        { label: 'מתאים במיוחד ל', value: 'CSS, design tokens והעברת צבעים בין מותג לפרונטאנד.' },
        { label: 'כדאי להתחיל עם', value: 'בחירת הכלי לפי הפורמט שהיעד כבר דורש.' },
        { label: 'מה בדרך כלל מרוויחים', value: 'ליטוש UI נקי יותר עם פחות המרות ידניות.' }
      ]
    },
    calculator: {
      en: [
        { label: 'Best for', value: 'Everyday business math, pricing checks and quick estimates.' },
        { label: 'Start with', value: 'A focused calculator that matches the actual decision you need to make.' },
        { label: 'Typical outcome', value: 'Faster answers before opening a spreadsheet or larger model.' }
      ],
      he: [
        { label: 'מתאים במיוחד ל', value: 'חישובים עסקיים יומיומיים, בדיקות תמחור והערכות מהירות.' },
        { label: 'כדאי להתחיל עם', value: 'מחשבון ממוקד שמתאים בדיוק להחלטה שצריך לקבל.' },
        { label: 'מה בדרך כלל מרוויחים', value: 'תשובה מהירה לפני פתיחת גיליון או מודל גדול יותר.' }
      ]
    }
  };

  return copy[category][locale];
}

export function getCategoryWorkflowPaths(category: ConverterCategory, locale: Locale): { title: string; description: string }[] {
  const copy = {
    data: {
      en: [
        { title: 'Validate structure first', description: 'Use a formatter when pasted data looks broken or hard to scan.' },
        { title: 'Convert for the target tool', description: 'Move into CSV, XML or YAML only after the source structure is trustworthy.' },
        { title: 'Share or export cleanly', description: 'Finish with a format your spreadsheet, config file or teammate can use immediately.' }
      ],
      he: [
        { title: 'מתחילים מאימות מבנה', description: 'בחר formatter כשהמידע המודבק נראה שבור או קשה לסריקה.' },
        { title: 'ממירים לפי יעד ברור', description: 'עוברים ל־CSV, XML או YAML רק אחרי שהמקור כבר אמין.' },
        { title: 'מסיימים עם פלט שנוח לשתף', description: 'המטרה היא פורמט שאפשר להעביר מיד לגיליון, קונפיגורציה או איש צוות.' }
      ]
    },
    text: {
      en: [
        { title: 'Clean the raw text', description: 'Remove noise, duplicates and empty lines before reshaping copy.' },
        { title: 'Format for the destination', description: 'Use slugs, case converters or list tools once the wording is stable.' },
        { title: 'Check size and readiness', description: 'Finish with counters or previews when length and structure matter.' }
      ],
      he: [
        { title: 'מנקים קודם את הטקסט', description: 'מסירים רעש, כפילויות ושורות ריקות לפני שעוברים לעיצוב הקופי.' },
        { title: 'מתאימים לפורמט היעד', description: 'משתמשים ב־slug, case converters או כלי רשימות כשהנוסח כבר יציב.' },
        { title: 'בודקים אורך ומוכנות', description: 'מסיימים עם ספירה או preview כשהאורך והמבנה חשובים.' }
      ]
    },
    encoding: {
      en: [
        { title: 'Figure out the original shape', description: 'Decode first when a string looks unreadable or broken.' },
        { title: 'Adjust for transport', description: 'Apply the right encoding only for the exact place the value will live.' },
        { title: 'Re-test the final link or payload', description: 'A quick final check prevents broken URLs and embedded snippets.' }
      ],
      he: [
        { title: 'מבינים קודם את המקור', description: 'מפענחים כשהמחרוזת לא קריאה או נראית שבורה.' },
        { title: 'מתאימים למעבר נכון', description: 'מקודדים רק לפי המקום המדויק שבו הערך אמור לחיות.' },
        { title: 'בודקים שוב את הקישור או ה־payload', description: 'בדיקה קצרה בסוף מונעת URLs שבורים וערכים משובצים לא תקינים.' }
      ]
    },
    time: {
      en: [
        { title: 'Identify the source type', description: 'Check timezone, unit and format before converting.' },
        { title: 'Convert once to a readable or machine-safe value', description: 'Use the direct converter when the source is known.' },
        { title: 'Compare with the next system', description: 'Use the result to verify exports, logs or schedule expectations.' }
      ],
      he: [
        { title: 'מזהים קודם את סוג המקור', description: 'בודקים אזור זמן, יחידה ופורמט לפני ההמרה.' },
        { title: 'ממירים פעם אחת לערך קריא או טכני', description: 'משתמשים בממיר הישיר כשהמקור כבר ידוע.' },
        { title: 'משווים מול המערכת הבאה', description: 'משתמשים בתוצאה כדי לאמת יצוא, לוגים או תזמונים.' }
      ]
    },
    developer: {
      en: [
        { title: 'Inspect before changing', description: 'Use decoders, parsers and formatters to understand the payload first.' },
        { title: 'Normalize the output', description: 'Escape, format or re-shape content for the exact environment you need.' },
        { title: 'Ship with fewer surprises', description: 'A final validator or checker reduces production mistakes.' }
      ],
      he: [
        { title: 'בודקים לפני שמשנים', description: 'משתמשים ב־decoders, parsers ו־formatters כדי להבין קודם את ה־payload.' },
        { title: 'מנרמלים את הפלט', description: 'מעצבים או ממירים את התוכן לסביבה המדויקת שבה צריך להשתמש בו.' },
        { title: 'מעלים פחות הפתעות ל־production', description: 'validator או checker בסוף מפחית טעויות יקרות.' }
      ]
    },
    color: {
      en: [
        { title: 'Start from the reference color', description: 'Pick the format you already trust, then branch out from there.' },
        { title: 'Convert only to what the next tool needs', description: 'HEX, RGB, HSL and alpha helpers should match the destination exactly.' },
        { title: 'Finish with a visual sanity check', description: 'Use the resulting value in CSS or design tokens with confidence.' }
      ],
      he: [
        { title: 'מתחילים מצבע הייחוס', description: 'בוחרים את הפורמט שכבר סומכים עליו וממנו ממשיכים.' },
        { title: 'ממירים רק למה שהיעד דורש', description: 'HEX, RGB, HSL ו־alpha helpers צריכים להתאים בדיוק לשלב הבא.' },
        { title: 'מסיימים בבדיקה ויזואלית קצרה', description: 'כך אפשר להשתמש בערך החדש ב־CSS או design tokens בביטחון.' }
      ]
    },
    calculator: {
      en: [
        { title: 'Choose the calculator by the decision', description: 'Match the tool to pricing, ratios, time or health instead of forcing a generic flow.' },
        { title: 'Check input order and units', description: 'Small unit mistakes usually matter more than the math itself.' },
        { title: 'Use the result as a quick decision aid', description: 'Confirm the answer before moving to a spreadsheet or a larger planning model.' }
      ],
      he: [
        { title: 'בוחרים מחשבון לפי ההחלטה', description: 'מתאימים את הכלי לתמחור, יחס, זמן או בריאות במקום לכפות שימוש כללי.' },
        { title: 'בודקים סדר קלט ויחידות', description: 'טעויות קטנות ביחידות בדרך כלל יקרות יותר מהחישוב עצמו.' },
        { title: 'משתמשים בתוצאה כעזר החלטה מהיר', description: 'מאשרים את הכיוון לפני שעוברים לגיליון או מודל רחב יותר.' }
      ]
    }
  };

  return copy[category][locale];
}
