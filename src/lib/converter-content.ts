import type { ConverterTool, Locale } from '../types';
import { formatContentType, getSearchIntent } from './converter-seo';

export function getToolUseCases(tool: ConverterTool, locale: Locale) {
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
