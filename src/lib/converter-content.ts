import type { ConverterTool, Locale } from '../types';
import { formatContentType, getSearchIntent } from './converter-seo';

type ToolSpecificContent = {
  useCases: Record<Locale, string[]>;
  resultChecklist: Record<Locale, string[]>;
  decisionChecks: Record<Locale, string[]>;
};

const toolSpecificContent: Partial<Record<string, ToolSpecificContent>> = {
  jsonToCsv: {
    useCases: {
      en: [
        'Turn API payload arrays into spreadsheet-ready rows before handing the data to content, finance or operations teams.',
        'Flatten quick exports for Google Sheets, CSV imports or reporting checks without opening a heavier data tool first.',
        'Review key names and row structure before sending a JSON response into a spreadsheet workflow.'
      ],
      he: [
        'הפוך מערכי payload של API לשורות מוכנות לגיליון לפני שמעבירים את הנתונים לצוותי תוכן, כספים או תפעול.',
        'הכן יצוא מהיר ל־Google Sheets, ייבוא CSV או בדיקות דיווח בלי לפתוח קודם כלי נתונים כבד יותר.',
        'בדוק שמות מפתחות ומבנה שורות לפני שמעבירים תגובת JSON לתהליך עבודה של גיליון.'
      ]
    },
    resultChecklist: {
      en: [
        'Check that the header row uses the field names you expect before importing the CSV into Sheets, Excel or a CMS.',
        'Scan a few rows to confirm nested values did not collapse into unreadable text before sharing the file with another team.',
        'Download the CSV only after commas, quotes and row count look right for the target import.'
      ],
      he: [
        'בדוק ששורת הכותרות משתמשת בשמות השדות שציפית להם לפני ייבוא ה־CSV ל־Sheets, Excel או CMS.',
        'עבור על כמה שורות כדי לוודא שערכים מקוננים לא קרסו לטקסט לא קריא לפני שיתוף הקובץ עם צוות אחר.',
        'הורד את ה־CSV רק אחרי שהפסיקים, המרכאות ומספר השורות נראים נכונים ליעד הייבוא.'
      ]
    },
    decisionChecks: {
      en: [
        'Confirm the JSON is an array of similar objects before expecting a clean table-like CSV result.',
        'Test one representative sample if the CSV will feed reporting, billing or a client-facing export.',
        'If nested arrays appear, decide whether raw JSON-in-cell output is acceptable before copying the result downstream.'
      ],
      he: [
        'ודא שה־JSON הוא מערך של אובייקטים דומים לפני שמצפים לתוצאת CSV נקייה בסגנון טבלאי.',
        'בדוק דוגמה מייצגת אחת אם ה־CSV ישמש לדיווח, חיוב או יצוא מול לקוח.',
        'אם מופיעים מערכים מקוננים, החלט אם פלט של JSON בתוך תא עדיין מקובל לפני שמעבירים את התוצאה הלאה.'
      ]
    }
  },
  csvToJson: {
    useCases: {
      en: [
        'Convert spreadsheet exports into JSON objects before pushing them into scripts, APIs or low-code automation tools.',
        'Clean CSV rows copied from admin panels before turning them into structured payloads for developers or analysts.',
        'Validate that header names and quoted values become predictable JSON keys before import or handoff.'
      ],
      he: [
        'המר יצוא מגיליונות לאובייקטי JSON לפני שמזינים אותם לסקריפטים, APIs או כלי אוטומציה ללא קוד.',
        'נקה שורות CSV שהועתקו ממסכי ניהול לפני שהופכים אותן ל־payloads מובנים עבור מפתחים או אנליסטים.',
        'ודא ששמות הכותרות וערכים במרכאות נהפכים למפתחות JSON צפויים לפני ייבוא או מסירה.'
      ]
    },
    resultChecklist: {
      en: [
        'Review the first object to confirm header names became the right JSON keys before using the payload anywhere else.',
        'Check a row with quotes or commas inside values so the parsed structure matches the original spreadsheet intent.',
        'Copy or download the JSON only after the row count feels right for the source CSV.'
      ],
      he: [
        'בדוק את האובייקט הראשון כדי לוודא ששמות הכותרות נהפכו למפתחות JSON נכונים לפני שימוש נוסף ב־payload.',
        'בדוק שורה עם מרכאות או פסיקים בתוך ערכים כדי לוודא שהמבנה המפוענח תואם לכוונה המקורית של הגיליון.',
        'העתק או הורד את ה־JSON רק אחרי שמספר השורות נראה נכון מול קובץ ה־CSV המקורי.'
      ]
    },
    decisionChecks: {
      en: [
        'Make sure the first CSV row is a real header row before relying on the JSON structure.',
        'Try one row with the messiest quoted content first if the CSV came from Excel, Sheets or a CMS export.',
        'Confirm empty cells are acceptable as empty JSON values before passing the result into an API or script.'
      ],
      he: [
        'ודא שהשורה הראשונה ב־CSV היא באמת שורת כותרות לפני שמסתמכים על מבנה ה־JSON.',
        'נסה קודם שורה אחת עם התוכן הכי מורכב במרכאות אם ה־CSV הגיע מ־Excel, Sheets או יצוא של CMS.',
        'ודא שתאים ריקים מקובלים כערכי JSON ריקים לפני שמעבירים את התוצאה ל־API או סקריפט.'
      ]
    }
  },
  jsonFormatter: {
    useCases: {
      en: [
        'Format pasted API responses before debugging, documenting or sharing them in tickets and chat threads.',
        'Validate messy JSON copied from logs, browser tools or CMS fields before trusting the structure.',
        'Prepare readable JSON for reviews when raw minified payloads slow down product or engineering work.'
      ],
      he: [
        'עצב תגובות API שהודבקו לפני דיבוג, תיעוד או שיתוף שלהן בטיקטים ובשיחות.',
        'אמת JSON מבולגן שהועתק מלוגים, כלי דפדפן או שדות CMS לפני שסומכים על המבנה שלו.',
        'הכן JSON קריא לבדיקות כש־payloads דחוסים מאטים עבודה של מוצר או הנדסה.'
      ]
    },
    resultChecklist: {
      en: [
        'Use the formatted output to spot missing brackets, odd nesting or duplicated patterns before reusing the JSON.',
        'Check that the prettified structure still reflects the original payload and did not hide a validation error.',
        'Copy the formatted result only after the indentation and object boundaries make the data easier to inspect.'
      ],
      he: [
        'השתמש בפלט המעוצב כדי לזהות סוגריים חסרים, קינון מוזר או דפוסים כפולים לפני שימוש חוזר ב־JSON.',
        'בדוק שהמבנה המעוצב עדיין משקף את ה־payload המקורי ולא הסתיר שגיאת אימות.',
        'העתק את התוצאה המעוצבת רק אחרי שההזחה וגבולות האובייקטים באמת מקלים על הבדיקה.'
      ]
    },
    decisionChecks: {
      en: [
        'Treat formatter errors as real validation signals before assuming the issue is only visual.',
        'Test one representative payload from production or staging before reformatting a larger batch.',
        'Avoid sharing formatted JSON externally until sensitive fields or tokens are removed.'
      ],
      he: [
        'התייחס לשגיאות של המעצב כסימני אימות אמיתיים לפני שמניחים שהבעיה רק ויזואלית.',
        'בדוק payload מייצג אחד מ־production או staging לפני שמעצבים אצווה גדולה יותר.',
        'הימנע משיתוף JSON מעוצב החוצה עד שמסירים שדות רגישים או טוקנים.'
      ]
    }
  },
  base64Decode: {
    useCases: {
      en: [
        'Decode copied Base64 snippets before debugging redirects, tokens, webhook payloads or email templates.',
        'Reveal readable Hebrew or Unicode text when an encoded value hides the real content of a message or field.',
        'Check whether a value is valid Base64 before sending it into a script, app setting or support reply.'
      ],
      he: [
        'פענח קטעי Base64 שהועתקו לפני דיבוג redirects, טוקנים, payloads של webhook או תבניות אימייל.',
        'חשוף טקסט עברי או Unicode קריא כשערך מקודד מסתיר את התוכן האמיתי של הודעה או שדה.',
        'בדוק אם ערך הוא Base64 תקין לפני שמעבירים אותו לסקריפט, הגדרת אפליקציה או תשובת תמיכה.'
      ]
    },
    resultChecklist: {
      en: [
        'Read the decoded output once as plain text to confirm it is human-readable before copying it into another system.',
        'If the result still looks broken, check whether the source used URL-safe Base64 or was cut off midway.',
        'Copy the decoded value only after special characters, spaces and line breaks look intentional.'
      ],
      he: [
        'קרא את הפלט המפוענח פעם אחת כטקסט רגיל כדי לוודא שהוא קריא לפני שמעתיקים אותו למערכת אחרת.',
        'אם התוצאה עדיין נראית שבורה, בדוק אם המקור השתמש ב־Base64 בטוח ל־URL או נחתך באמצע.',
        'העתק את הערך המפוענח רק אחרי שתווים מיוחדים, רווחים ושבירות שורה נראים מכוונים.'
      ]
    },
    decisionChecks: {
      en: [
        'Confirm the input is complete before assuming the decoded output is trustworthy.',
        'Try one short sample first when the Base64 value came from a token, browser storage or a URL parameter.',
        'Do not reuse decoded secrets or tokens without checking whether the original source was safe to expose.'
      ],
      he: [
        'ודא שהקלט שלם לפני שמניחים שאפשר לסמוך על הפלט המפוענח.',
        'נסה קודם דוגמה קצרה כאשר ערך ה־Base64 הגיע מטוקן, אחסון דפדפן או פרמטר URL.',
        'אל תשתמש מחדש בסודות או טוקנים שפוענחו בלי לבדוק שהמקור שלהם בטוח לחשיפה.'
      ]
    }
  },
  sortLines: {
    useCases: {
      en: [
        'Alphabetize keyword lists, outreach names or CMS entries before review so duplicates and ordering issues stand out faster.',
        'Sort pasted text blocks before comparing versions, cleaning lists or handing data to another teammate.',
        'Prepare line-based content for spreadsheets, imports or documentation where stable ordering matters.'
      ],
      he: [
        'מיין לפי אלפבית רשימות מילות מפתח, שמות outreach או ערכי CMS לפני בדיקה כדי שכפילויות ובעיות סדר יבלטו מהר יותר.',
        'מיין בלוקים של טקסט שהודבקו לפני השוואת גרסאות, ניקוי רשימות או מסירת נתונים לחבר צוות.',
        'הכן תוכן מבוסס שורות לגיליונות, ייבוא או תיעוד כאשר חשוב לשמור על סדר יציב.'
      ]
    },
    resultChecklist: {
      en: [
        'Scan the first and last few lines to make sure the sort direction matches the workflow you need.',
        'If the list mixes Hebrew and English, visually inspect the ordering once before using it in production content.',
        'Copy the sorted list only after line breaks and trimming rules match the destination system.'
      ],
      he: [
        'עבור על כמה שורות ראשונות ואחרונות כדי לוודא שכיוון המיון מתאים לזרימת העבודה שאתה צריך.',
        'אם הרשימה מערבבת עברית ואנגלית, בדוק ויזואלית פעם אחת את הסדר לפני שימוש בתוכן פרודקשן.',
        'העתק את הרשימה הממוינת רק אחרי ששבירות השורה וחוקי הניקוי תואמים למערכת היעד.'
      ]
    },
    decisionChecks: {
      en: [
        'Choose the sort direction before comparing outputs so the result is not technically correct but operationally wrong.',
        'Test one short mixed-language sample first if the list includes Hebrew, English or numbers together.',
        'Turn on trim mode when copied spaces could affect grouping, matching or imports later.'
      ],
      he: [
        'בחר את כיוון המיון לפני שמשווים פלטים כדי שהתוצאה לא תהיה טכנית נכונה אבל תפעולית שגויה.',
        'בדוק קודם דוגמה קצרה של שפה מעורבת אם הרשימה כוללת עברית, אנגלית או מספרים יחד.',
        'הפעל מצב ניקוי רווחים כאשר רווחים שהועתקו עלולים להשפיע בהמשך על קיבוץ, התאמה או ייבוא.'
      ]
    }
  },
  slugGenerator: {
    useCases: {
      en: [
        'Turn article titles, product names or landing-page headings into URL-safe slugs before publishing.',
        'Normalize SEO paths for bilingual content so page names stay clean across CMS, docs or spreadsheet planning.',
        'Generate quick slug candidates when marketing, content or product teams need a shareable URL draft.'
      ],
      he: [
        'הפוך כותרות מאמרים, שמות מוצרים או כותרות עמודי נחיתה ל־slug בטוח ל־URL לפני פרסום.',
        'נרמל נתיבי SEO לתוכן דו־לשוני כדי ששמות עמודים יישארו נקיים ב־CMS, מסמכים או תכנון בגיליון.',
        'ייצר מועמדי slug מהירים כשצוותי שיווק, תוכן או מוצר צריכים טיוטת URL לשיתוף.'
      ]
    },
    resultChecklist: {
      en: [
        'Check that separators, lowercase output and removed punctuation match your site routing rules.',
        'Review the slug once for meaning so it still reads clearly after stop-words and symbols are stripped out.',
        'Copy the final slug only after it looks stable enough for links, breadcrumbs and internal references.'
      ],
      he: [
        'בדוק שהמפרידים, האותיות הקטנות והסרת סימני הפיסוק תואמים לכללי הניתוב של האתר שלך.',
        'עבור פעם אחת על ה־slug כדי לוודא שהמשמעות עדיין ברורה אחרי שמילות חיבור וסימנים הוסרו.',
        'העתק את ה־slug הסופי רק אחרי שהוא נראה יציב מספיק לקישורים, breadcrumb והפניות פנימיות.'
      ]
    },
    decisionChecks: {
      en: [
        'Confirm whether the destination system expects hyphens, underscores or transliteration before publishing the slug.',
        'Test one real headline first if the page will target organic search or paid campaigns.',
        'Avoid changing a slug after publication unless redirects are already planned.'
      ],
      he: [
        'ודא אם מערכת היעד מצפה למקפים, קווים תחתונים או transliteration לפני שמפרסמים את ה־slug.',
        'בדוק קודם כותרת אמיתית אחת אם העמוד יכוון לחיפוש אורגני או קמפיינים ממומנים.',
        'הימנע משינוי slug אחרי פרסום אלא אם כבר מתוכננים redirects.'
      ]
    }
  },
  metaDescriptionLengthChecker: {
    useCases: {
      en: [
        'Check SEO snippets before publishing so title support text stays within a visible search-result range.',
        'Review drafted meta descriptions from content or AI tools before they go into a CMS field.',
        'Compare multiple snippet options quickly when you need a shorter or fuller search-result message.'
      ],
      he: [
        'בדוק סניפטים ל־SEO לפני פרסום כדי שטקסט התמיכה של הכותרת יישאר בטווח נראה בתוצאות חיפוש.',
        'בדוק meta descriptions שנכתבו על ידי צוות תוכן או כלי AI לפני שהן נכנסות לשדה CMS.',
        'השווה במהירות כמה אפשרויות סניפט כאשר צריך מסר קצר יותר או מלא יותר לתוצאת החיפוש.'
      ]
    },
    resultChecklist: {
      en: [
        'Use the status result to see whether the snippet is too short, strong enough, or likely to be trimmed in search results.',
        'Read the description once as a real SERP sentence, not only as a character count.',
        'Copy the final version only after both length and meaning still support the target query.'
      ],
      he: [
        'השתמש בסטטוס התוצאה כדי לראות אם הסניפט קצר מדי, טוב מספיק או כנראה ייחתך בתוצאות חיפוש.',
        'קרא את התיאור פעם אחת כמשפט אמיתי ל־SERP, לא רק כספירת תווים.',
        'העתק את הגרסה הסופית רק אחרי שגם האורך וגם המשמעות עדיין תומכים בשאילתת היעד.'
      ]
    },
    decisionChecks: {
      en: [
        'Check the page intent first so the meta description is optimized for the right search, not only the right length.',
        'Test one snippet per page version instead of forcing the same formula across unrelated pages.',
        'Keep important terms near the front in case Google truncates the tail of the description.'
      ],
      he: [
        'בדוק קודם את כוונת העמוד כדי שה־meta description תהיה מותאמת לחיפוש הנכון, לא רק לאורך הנכון.',
        'בדוק סניפט אחד לכל גרסת עמוד במקום לכפות את אותה נוסחה על עמודים לא קשורים.',
        'שמור מונחים חשובים קרוב להתחלה למקרה שגוגל תחתוך את סוף התיאור.'
      ]
    }
  },
  canonicalTagChecker: {
    useCases: {
      en: [
        'Inspect copied HTML before launch to confirm canonical tags point at the intended preferred URL.',
        'Audit CMS or landing pages for duplicate, missing or relative canonical tags during SEO reviews.',
        'Check staging HTML snippets quickly before sending issues back to developers or content managers.'
      ],
      he: [
        'בדוק HTML מועתק לפני השקה כדי לוודא שתגיות canonical מצביעות ל־URL המועדף הנכון.',
        'בצע audit לעמודי CMS או landing עבור תגיות canonical כפולות, חסרות או יחסיות במהלך בדיקות SEO.',
        'בדוק במהירות קטעי HTML מ־staging לפני שמחזירים הערות למפתחים או מנהלי תוכן.'
      ]
    },
    resultChecklist: {
      en: [
        'Review whether the canonical URL is absolute, unique and aligned with the page you actually want indexed.',
        'Treat warnings seriously if the page contains multiple canonicals or a non-indexable target.',
        'Share the result only after the checker output matches the intended production URL strategy.'
      ],
      he: [
        'בדוק האם כתובת ה־canonical היא אבסולוטית, יחידה ותואמת לעמוד שבאמת רוצים שייאנדקס.',
        'קח אזהרות ברצינות אם העמוד מכיל כמה canonicals או יעד שלא אמור להיכנס לאינדקס.',
        'שתף את התוצאה רק אחרי שפלט הבודק תואם לאסטרטגיית ה־URL של הפרודקשן.'
      ]
    },
    decisionChecks: {
      en: [
        'Confirm whether you are checking source HTML, rendered HTML or a copied snippet before trusting the finding.',
        'Validate one live page sample if the same template is used across many landing pages.',
        'Do not rely on a canonical alone when robots, noindex or redirect rules may conflict with it.'
      ],
      he: [
        'ודא אם אתה בודק HTML מקור, HTML מרונדר או קטע מועתק לפני שסומכים על הממצא.',
        'אמת דוגמת עמוד חי אחת אם אותה תבנית משמשת הרבה עמודי נחיתה.',
        'אל תסתמך על canonical בלבד כאשר כללי robots, noindex או redirects עלולים להתנגש איתה.'
      ]
    }
  },
  regexTester: {
    useCases: {
      en: [
        'Test search patterns against real text before moving a regex into code, automation or SEO cleanup work.',
        'Review matches, capture groups and positions when debugging a pattern copied from docs, Stack Overflow or another repo.',
        'Compare a risky regex against a small sample before running it on production content or logs.'
      ],
      he: [
        'בדוק תבניות חיפוש מול טקסט אמיתי לפני שמעבירים regex לקוד, אוטומציה או עבודת ניקוי SEO.',
        'בדוק התאמות, קבוצות לכידה ומיקומים כשמדבגים תבנית שהועתקה מדוקס, Stack Overflow או repo אחר.',
        'השווה regex מסוכן מול דוגמה קטנה לפני שמריצים אותו על תוכן פרודקשן או לוגים.'
      ]
    },
    resultChecklist: {
      en: [
        'Use the match list to confirm the regex hits only the text you want and not nearby false positives.',
        'Inspect capture groups before reusing the pattern in replacements, parsing or validation logic.',
        'Promote the regex into code only after the sample text still matches exactly as expected.'
      ],
      he: [
        'השתמש ברשימת ההתאמות כדי לוודא שה־regex פוגע רק בטקסט שרצית ולא בשגיאות חיוביות מסביב.',
        'בדוק את קבוצות הלכידה לפני שמשתמשים שוב בתבנית בהחלפות, parsing או לוגיקת אימות.',
        'העבר את ה־regex לקוד רק אחרי שטקסט הדוגמה עדיין תואם בדיוק למה שציפית.'
      ]
    },
    decisionChecks: {
      en: [
        'Start with the smallest realistic text sample before trusting a complex pattern on long content blocks.',
        'Check whether flags, greedy tokens or escaped characters change the pattern meaning more than expected.',
        'Avoid running a newly tested regex on production replacements until one manual sample is reviewed.'
      ],
      he: [
        'התחל בדוגמת טקסט ריאלית הכי קטנה לפני שסומכים על תבנית מורכבת מול בלוקים ארוכים של תוכן.',
        'בדוק אם flags, טוקנים חמדניים או תווים ממולטים משנים את משמעות התבנית יותר ממה שציפית.',
        'הימנע מהרצת regex שנבדק זה עתה על החלפות בפרודקשן עד שבודקים ידנית דוגמה אחת.'
      ]
    }
  }
};

export function getToolUseCases(tool: ConverterTool, locale: Locale) {
  const specific = toolSpecificContent[tool.converterId]?.useCases?.[locale];
  if (specific) {
    return specific;
  }

  const input = formatContentType(tool.inputType);
  const output = formatContentType(tool.outputType);
  const intent = getSearchIntent(tool);

  const intentLead = {
    convert: {
      en: `Convert ${input} into ${output} before moving content into the next tool or platform.`,
      he: `המר ${input} ל־${output} לפני שמעבירים את התוכן לכלי או לפלטפורמה הבאה.`
    },
    calculate: {
      en: `Check a fast ${output} result before opening a spreadsheet or external calculator.`,
      he: `בדוק תוצאת ${output} מהירה לפני שפותחים גיליון או מחשבון חיצוני.`
    },
    validate: {
      en: `Validate ${input} before publishing, importing or sharing it with another team.`,
      he: `בדוק ${input} לפני פרסום, ייבוא או שיתוף עם צוות אחר.`
    },
    format: {
      en: `Reshape ${input} into cleaner ${output} output for copying, review or documentation.`,
      he: `סדר ${input} לפלט ${output} נקי יותר לצורך העתקה, בדיקה או תיעוד.`
    },
    decode: {
      en: `Reveal readable ${output} before debugging, auditing or reusing the value somewhere else.`,
      he: `חשוף פלט ${output} קריא לפני דיבוג, בדיקה או שימוש חוזר בערך במקום אחר.`
    },
    clean: {
      en: `Remove noise from ${input} before importing, comparing or publishing the final text.`,
      he: `הסר רעש מ־${input} לפני ייבוא, השוואה או פרסום הטקסט הסופי.`
    },
    generate: {
      en: `Generate ready-to-use ${output} values for repetitive content, code or configuration work.`,
      he: `ייצר ערכי ${output} מוכנים לשימוש עבור משימות תוכן, קוד או קונפיגורציה שחוזרות על עצמן.`
    },
    explain: {
      en: `Break down ${input} into readable details before troubleshooting or handing it to someone else.`,
      he: `פרק ${input} לפרטים קריאים לפני דיבוג או העברה למישהו אחר.`
    }
  };

  const categoryLead = {
    data: {
      en: `Inspect structured payloads faster when exports, schemas or rows need a quick browser-side check.`,
      he: `בדוק payloads ונתונים מובנים מהר יותר כשיצואים, schemas או שורות צריכים בדיקה מהירה בדפדפן.`
    },
    text: {
      en: `Prepare cleaner copy for SEO, CMS fields, support notes or spreadsheet-friendly text workflows.`,
      he: `הכן טקסט נקי יותר ל־SEO, שדות CMS, הערות תמיכה או תהליכי עבודה ידידותיים לגיליונות.`
    },
    encoding: {
      en: `Handle encoded values safely before they reach URLs, scripts, tokens or copied payloads.`,
      he: `טפל בערכים מקודדים בצורה בטוחה לפני שהם מגיעים ל־URL, סקריפטים, טוקנים או payloads מועתקים.`
    },
    time: {
      en: `Check time, timezone or date values before they land in automation, planning or reporting flows.`,
      he: `בדוק ערכי זמן, אזור זמן או תאריך לפני שהם נכנסים לאוטומציה, תכנון או דיווח.`
    },
    developer: {
      en: `Debug technical values locally before using them in production code, APIs or deployment settings.`,
      he: `דבג ערכים טכניים מקומית לפני שמשתמשים בהם בקוד production, API או הגדרות deployment.`
    },
    color: {
      en: `Move color values between design and implementation formats without opening heavier design tools.`,
      he: `העבר ערכי צבע בין פורמטי עיצוב ויישום בלי לפתוח כלי עיצוב כבדים יותר.`
    },
    calculator: {
      en: `Estimate business or consumer numbers quickly when you need an answer before deeper planning.`,
      he: `הערך מספרים עסקיים או צרכניים במהירות כשצריך תשובה לפני תכנון עמוק יותר.`
    }
  };

  const featureText = tool.features[locale][0]
    ? locale === 'he'
      ? `נצל את ${tool.features[locale][0]} כדי להגיע מהר יותר לתוצאה שימושית.`
      : `Use ${tool.features[locale][0].toLowerCase()} to get to a practical result faster.`
    : locale === 'he'
      ? 'השתמש בכלי ישירות בדפדפן כדי לעבוד מהר יותר.'
      : 'Use the tool directly in the browser to move faster.';

  return [intentLead[intent][locale], categoryLead[tool.category][locale], featureText];
}

export function getToolResultChecklist(tool: ConverterTool, locale: Locale) {
  const specific = toolSpecificContent[tool.converterId]?.resultChecklist?.[locale];
  if (specific) {
    return specific;
  }

  const output = formatContentType(tool.outputType);
  const feature = tool.features[locale][0];

  const resultLead = locale === 'he'
    ? `${tool.shortTitle.he} מחזיר פלט ${output} שאפשר לבדוק, להעתיק או להוריד מיד אחרי ההמרה.`
    : `${tool.shortTitle.en} returns ${output} output that is ready to review, copy or download as soon as the conversion finishes.`;

  const workflowLead = locale === 'he'
    ? 'הפלט מתאים במיוחד לשלב הבא בתהליך כמו הדבקה ל־CMS, בדיקת קוד, ייצוא לגיליון או שיתוף עם צוות.'
    : 'The result is meant for the next step of the workflow, such as pasting into a CMS, checking code, exporting to a sheet or sharing with a team.';

  const featureLead = feature
    ? locale === 'he'
      ? `אפשר להיעזר ב־${feature} כדי לוודא שהתוצאה הסופית באמת מוכנה לשימוש.`
      : `Use ${feature.toLowerCase()} to verify that the final output is actually ready for use.`
    : locale === 'he'
      ? 'הפלט נשאר מקומי בדפדפן, כך שקל לבדוק אותו לפני שימוש נוסף.'
      : 'The output stays local in the browser, so it is easy to inspect before using it elsewhere.';

  return [resultLead, workflowLead, featureLead];
}

export function getToolDecisionChecks(tool: ConverterTool, locale: Locale) {
  const specific = toolSpecificContent[tool.converterId]?.decisionChecks?.[locale];
  if (specific) {
    return specific;
  }

  const input = formatContentType(tool.inputType);
  const output = formatContentType(tool.outputType);

  return locale === 'he'
    ? [
        `ודא שקלט ה־${input} מלא לפני שמסתמכים על תוצאת ה־${output}.`,
        'כדאי לבדוק קודם דוגמה קטנה כאשר הפלט ישמש בהמשך בקוד, SEO, דיווח או עבודה תפעולית.',
        'בצע העתקה או הורדה רק אחרי שהמבנה, המפרידים והתווים תואמים למה שאתה מצפה לקבל.'
      ]
    : [
        `Confirm that the ${input} input is complete before relying on the ${output} result.`,
        'Compare one small sample first when the converter output will be reused in production, SEO or reporting work.',
        'Use copy or download only after the result matches the structure, separators and characters you expect.'
      ];
}

export function getToolContentReadiness(tool: ConverterTool) {
  const useCases = getToolUseCases(tool, 'en');
  const faqCount = tool.faq.length + 2;
  const exampleCount = tool.examples.length;

  return {
    exampleCount,
    faqCount,
    useCaseCount: useCases.length,
    launchReady: exampleCount >= 2 && faqCount >= 4 && useCases.length >= 3
  };
}

export function isLaunchReadyFreshTool(tool: ConverterTool) {
  return Boolean(tool.new) && getToolContentReadiness(tool).launchReady;
}
