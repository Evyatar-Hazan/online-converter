import type { Locale } from '../types';

export const infoPageSlugs = ['about', 'editorial', 'privacy', 'contact'] as const;

export type InfoPageSlug = (typeof infoPageSlugs)[number];

type InfoPageSection = {
  title: string;
  paragraphs: string[];
  links?: Array<{ href: string; label: string }>;
};

type InfoPageContent = {
  title: string;
  eyebrow: string;
  description: string;
  updatedLabel: string;
  sections: InfoPageSection[];
};

export const infoPages: Record<InfoPageSlug, Record<Locale, InfoPageContent>> = {
  about: {
    en: {
      title: 'About Online Converter',
      eyebrow: 'Who builds and reviews this site',
      description:
        'Learn who builds Online Converter, how its browser-based tools work, and which quality boundaries apply before a page is published.',
      updatedLabel: 'Last reviewed: August 18, 2026',
      sections: [
        {
          title: 'A focused browser utility',
          paragraphs: [
            'Online Converter is a bilingual collection of small tools for data, text, encoding, dates, colors, developer checks and everyday calculations. Its purpose is to help a visitor complete one concrete task without uploading the input to a conversion server.',
            'The public site is intentionally smaller than the internal tool registry. A converter is published only after its function, examples and page-specific guidance have been reviewed.'
          ]
        },
        {
          title: 'Built and maintained by Evyatar Hazan',
          paragraphs: [
            'Evyatar Hazan designs, develops and maintains the product. The site is part of his public engineering portfolio, and its implementation, testing and production operation are maintained as one product rather than as an anonymous collection of generated pages.'
          ],
          links: [{ href: 'https://evyatarhazan.com/', label: 'Visit Evyatar Hazan’s portfolio' }]
        },
        {
          title: 'What browser-side means',
          paragraphs: [
            'Converter input is processed by JavaScript in the visitor’s browser. The application does not send pasted converter input to an Online Converter backend.',
            'The website still uses normal hosting, measurement and advertising services. Those services can receive technical request or advertising data as described in the privacy notice; browser-side conversion does not mean that the entire website is free of third-party requests.'
          ]
        },
        {
          title: 'Corrections and limitations',
          paragraphs: [
            'The tools are designed for practical checks, not as professional financial, legal, tax or security advice. Important outputs should be verified against the requirements of the system where they will be used.',
            'If a tool produces an incorrect result or a page contains an unclear explanation, use the contact page and include the tool URL plus a non-sensitive example.'
          ]
        }
      ]
    },
    he: {
      title: 'אודות Online Converter',
      eyebrow: 'מי בונה ובודק את האתר',
      description:
        'מידע על מי שבונה את Online Converter, אופן הפעולה של הכלים בדפדפן וגבולות האיכות שנבדקים לפני פרסום עמוד.',
      updatedLabel: 'נבדק לאחרונה: 18 באוגוסט 2026',
      sections: [
        {
          title: 'כלי דפדפן עם מטרה ממוקדת',
          paragraphs: [
            'Online Converter הוא אוסף דו־לשוני של כלים קטנים לנתונים, טקסט, קידוד, תאריכים, צבעים, בדיקות פיתוח וחישובים יומיומיים. המטרה היא לעזור למשתמש להשלים משימה מוגדרת בלי להעלות את הקלט לשרת המרה.',
            'האתר הציבורי קטן בכוונה מרשימת הכלים הפנימית. ממיר מתפרסם רק לאחר בדיקה של הפונקציה, הדוגמאות וההנחיות הייחודיות לעמוד.'
          ]
        },
        {
          title: 'נבנה ומתוחזק על ידי אביתר חזן',
          paragraphs: [
            'אביתר חזן מתכנן, מפתח ומתחזק את המוצר. האתר הוא חלק מהפורטפוליו ההנדסי הציבורי שלו, והפיתוח, הבדיקות והתפעול בפרודקשן מנוהלים כמוצר אחד ולא כאוסף אנונימי של עמודים שנוצרו אוטומטית.'
          ],
          links: [{ href: 'https://evyatarhazan.com/', label: 'לפורטפוליו של אביתר חזן' }]
        },
        {
          title: 'מה פירוש עיבוד בדפדפן',
          paragraphs: [
            'הקלט של הממירים מעובד באמצעות JavaScript בדפדפן של המשתמש. האפליקציה אינה שולחת את הקלט שהודבק לשרת backend של Online Converter.',
            'האתר עדיין משתמש בשירותי אחסון, מדידה ופרסום רגילים. שירותים אלה עשויים לקבל נתוני בקשה טכניים או נתוני פרסום כמתואר במדיניות הפרטיות; עיבוד מקומי אינו אומר שבאתר כולו אין בקשות לצד שלישי.'
          ]
        },
        {
          title: 'תיקונים ומגבלות',
          paragraphs: [
            'הכלים מיועדים לבדיקות מעשיות ואינם תחליף לייעוץ פיננסי, משפטי, מיסויי או אבטחתי מקצועי. תוצאות חשובות כדאי לאמת מול דרישות המערכת שבה הן ישמשו.',
            'אם כלי מחזיר תוצאה שגויה או שהסבר בעמוד אינו ברור, אפשר לפנות דרך עמוד יצירת הקשר ולצרף את כתובת הכלי ודוגמה שאינה רגישה.'
          ]
        }
      ]
    }
  },
  editorial: {
    en: {
      title: 'Editorial and tool review policy',
      eyebrow: 'How a converter becomes public',
      description:
        'The review process used before Online Converter publishes, indexes, or monetizes a browser-based tool page.',
      updatedLabel: 'Last reviewed: August 18, 2026',
      sections: [
        {
          title: 'Public pages are selected, not generated in bulk',
          paragraphs: [
            'The internal registry contains more converter definitions than the public website. Registry membership alone does not create an indexable page.',
            'A public tool must have a working conversion function, representative examples, tool-specific questions and answers, practical use cases, result checks and clear limitations in both English and Hebrew.'
          ]
        },
        {
          title: 'Functional review',
          paragraphs: [
            'Automated tests cover converter behavior, metadata, links, static output and representative browser flows. The production checks also verify that public routes return the expected status, that unpublished routes remain unavailable, and that converter input is not included in analytics events.',
            'Automated checks support editorial review; they do not replace a human check of whether the page explains a real task clearly.'
          ]
        },
        {
          title: 'Content review',
          paragraphs: [
            'Each public page must explain when the tool is useful, what input it expects, what the output means, which mistakes are common and what should be checked before the result is reused.',
            'Generic word count is not treated as proof of value. Pages that rely only on shared template text stay outside the public sitemap and do not load advertising.'
          ]
        },
        {
          title: 'Advertising boundary',
          paragraphs: [
            'Advertising is limited to reviewed tool pages. Home, category, policy, contact, analytics, error and other navigation-oriented pages do not load Google AdSense.',
            'A tool page uses two separated placements after substantial tool and guidance content. Advertising must not cover controls, sit next to conversion actions, or become the only way to leave a screen.'
          ]
        },
        {
          title: 'Corrections',
          paragraphs: [
            'Reported defects are checked against a reproducible, non-sensitive example. A page can be removed from indexing and advertising if its function or guidance no longer passes review.'
          ],
          links: [{ href: '/en/contact/', label: 'Report a content or tool issue' }]
        }
      ]
    },
    he: {
      title: 'מדיניות עריכה ובדיקת כלים',
      eyebrow: 'איך ממיר הופך לעמוד ציבורי',
      description:
        'תהליך הבדיקה שמתבצע לפני ש־Online Converter מפרסם, מאנדקס או ממנטז עמוד של כלי בדפדפן.',
      updatedLabel: 'נבדק לאחרונה: 18 באוגוסט 2026',
      sections: [
        {
          title: 'עמודים ציבוריים נבחרים ולא נוצרים בהיקף אוטומטי',
          paragraphs: [
            'ה־registry הפנימי כולל יותר הגדרות ממירים ממה שמוצג באתר הציבורי. עצם ההימצאות ב־registry אינה יוצרת עמוד שניתן לאינדוקס.',
            'כלי ציבורי חייב לכלול פונקציית המרה עובדת, דוגמאות מייצגות, שאלות ותשובות ייחודיות, מקרי שימוש מעשיים, בדיקות לתוצאה ומגבלות ברורות בעברית ובאנגלית.'
          ]
        },
        {
          title: 'בדיקה פונקציונלית',
          paragraphs: [
            'בדיקות אוטומטיות מכסות את פעולת הממירים, metadata, קישורים, build סטטי וזרימות דפדפן מייצגות. בדיקות הפרודקשן מוודאות גם שנתיבים ציבוריים מחזירים סטטוס נכון, שנתיבים שלא פורסמו אינם זמינים ושקלט הממיר אינו נכנס לאירועי analytics.',
            'בדיקות אוטומטיות תומכות בביקורת העריכה; הן אינן מחליפות בדיקה אנושית שהעמוד מסביר משימה אמיתית באופן ברור.'
          ]
        },
        {
          title: 'בדיקת תוכן',
          paragraphs: [
            'כל עמוד ציבורי צריך להסביר מתי הכלי שימושי, איזה קלט הוא מצפה לקבל, מה משמעות הפלט, אילו טעויות נפוצות ומה צריך לבדוק לפני שימוש נוסף בתוצאה.',
            'ספירת מילים כללית אינה נחשבת הוכחה לערך. עמודים שמסתמכים רק על טקסט משותף של התבנית נשארים מחוץ ל־sitemap הציבורי ואינם טוענים פרסום.'
          ]
        },
        {
          title: 'גבול הפרסום',
          paragraphs: [
            'הפרסום מוגבל לעמודי כלים שעברו ביקורת. דפי בית, קטגוריות, מדיניות, יצירת קשר, analytics, שגיאה ומסכי ניווט אחרים אינם טוענים Google AdSense.',
            'עמוד כלי משתמש בשני מיקומים נפרדים לאחר תוכן משמעותי של הכלי וההנחיות. מודעות אינן אמורות לכסות controls, להיצמד לפעולות ההמרה או להפוך לדרך היחידה לצאת מהמסך.'
          ]
        },
        {
          title: 'תיקונים',
          paragraphs: [
            'תקלה שדווחה נבדקת מול דוגמה ניתנת לשחזור שאינה רגישה. אפשר להסיר עמוד מאינדוקס ומפרסום אם הפונקציה או ההנחיות שלו אינן עוברות עוד את הבדיקה.'
          ],
          links: [{ href: '/he/contact/', label: 'דיווח על בעיית תוכן או כלי' }]
        }
      ]
    }
  },
  privacy: {
    en: {
      title: 'Privacy policy',
      eyebrow: 'Data use and visitor choices',
      description:
        'Privacy information for Online Converter, including browser-side input processing, hosting analytics, Google AdSense cookies, and visitor choices.',
      updatedLabel: 'Effective and last reviewed: August 18, 2026',
      sections: [
        {
          title: 'Converter input',
          paragraphs: [
            'Text or values entered into a converter are processed in the browser. Online Converter does not operate an application backend that receives or stores the pasted converter input.',
            'Do not paste passwords, private keys, access tokens, personal records or other secrets into any website tool. Browser-side processing reduces data transfer but does not make a device, browser extension or network environment automatically safe.'
          ]
        },
        {
          title: 'Local browser storage',
          paragraphs: [
            'The site stores the selected light or dark theme in browser local storage. Shared converter links can contain input and option values in the URL only when a visitor explicitly uses the share-link feature; visitors should inspect and remove sensitive values before sharing a URL.'
          ]
        },
        {
          title: 'Hosting and measurement',
          paragraphs: [
            'The site is hosted by Cloudflare Pages. Hosting infrastructure can process technical request data such as IP address, user agent, requested URL, time and security signals needed to deliver and protect the website.',
            'When configured, Cloudflare Web Analytics measures page-level usage and performance. The application’s own converter events record event names and page context, not pasted converter input or generated output.'
          ],
          links: [{ href: 'https://www.cloudflare.com/privacypolicy/', label: 'Cloudflare privacy policy' }]
        },
        {
          title: 'Advertising and Google AdSense',
          paragraphs: [
            'Reviewed tool pages use Google AdSense. Google and other third-party vendors may place or read cookies, use web beacons, IP addresses or device identifiers, and process usage data to deliver, personalize and measure advertising according to user settings, consent requirements and applicable law.',
            'Google’s use of advertising cookies can enable Google and its partners to serve ads based on visits to this site or other sites. Visitors can manage personalized advertising through Google Ads Settings.'
          ],
          links: [
            { href: 'https://policies.google.com/technologies/partner-sites', label: 'How Google uses data on partner sites' },
            { href: 'https://adssettings.google.com/', label: 'Google Ads Settings' }
          ]
        },
        {
          title: 'Consent and browser choices',
          paragraphs: [
            'Where consent is legally required, advertising and related storage must follow the consent choices presented to the visitor. Visitors can also block or delete cookies and local storage through browser settings, although this can affect site or advertising behavior.',
            'Online Converter does not ask visitors to create an account and does not sell converter input.'
          ]
        },
        {
          title: 'Privacy questions',
          paragraphs: [
            'For a privacy question or correction request, contact the site owner at evyatarhazan3.14@gmail.com. Include the relevant page URL, but do not include sensitive converter input.'
          ],
          links: [{ href: 'mailto:evyatarhazan3.14@gmail.com', label: 'Email the site owner' }]
        }
      ]
    },
    he: {
      title: 'מדיניות פרטיות',
      eyebrow: 'שימוש בנתונים ובחירות המשתמש',
      description:
        'מידע על פרטיות ב־Online Converter, כולל עיבוד קלט בדפדפן, אחסון ואנליטיקה, cookies של Google AdSense ובחירות המשתמש.',
      updatedLabel: 'בתוקף ונבדק לאחרונה: 18 באוגוסט 2026',
      sections: [
        {
          title: 'הקלט של הממירים',
          paragraphs: [
            'טקסט או ערכים שמוזנים לממיר מעובדים בדפדפן. Online Converter אינו מפעיל backend אפליקטיבי שמקבל או שומר את הקלט שהודבק לממיר.',
            'אין להדביק סיסמאות, מפתחות פרטיים, access tokens, רשומות אישיות או סודות אחרים לכלי באתר כלשהו. עיבוד בדפדפן מפחית העברת נתונים, אך אינו הופך באופן אוטומטי מכשיר, תוסף דפדפן או סביבת רשת לבטוחים.'
          ]
        },
        {
          title: 'אחסון מקומי בדפדפן',
          paragraphs: [
            'האתר שומר ב־local storage את בחירת מצב התצוגה הבהיר או הכהה. קישור שיתוף של ממיר יכול לכלול קלט ואפשרויות ב־URL רק כאשר המשתמש מפעיל במפורש את פעולת השיתוף; לפני שיתוף URL יש לבדוק ולהסיר ערכים רגישים.'
          ]
        },
        {
          title: 'אחסון האתר ומדידה',
          paragraphs: [
            'האתר מאוחסן ב־Cloudflare Pages. תשתית האחסון עשויה לעבד נתוני בקשה טכניים כגון כתובת IP, סוג דפדפן, URL שהתבקש, זמן וסימני אבטחה הדרושים להצגת האתר ולהגנה עליו.',
            'כאשר הוא מוגדר, Cloudflare Web Analytics מודד שימוש וביצועים ברמת העמוד. אירועי הממיר של האפליקציה עצמה מתעדים שמות אירועים והקשר עמוד, ולא את הקלט שהודבק או את הפלט שנוצר.'
          ],
          links: [{ href: 'https://www.cloudflare.com/privacypolicy/', label: 'מדיניות הפרטיות של Cloudflare' }]
        },
        {
          title: 'פרסום ו־Google AdSense',
          paragraphs: [
            'עמודי כלים שעברו ביקורת משתמשים ב־Google AdSense. Google וספקי צד שלישי אחרים עשויים להציב או לקרוא cookies, להשתמש ב־web beacons, כתובות IP או מזהי מכשיר ולעבד נתוני שימוש כדי להציג, להתאים ולמדוד פרסום בהתאם להגדרות המשתמש, לדרישות הסכמה ולדין החל.',
            'השימוש של Google ב־cookies לפרסום יכול לאפשר ל־Google ולשותפיה להציג מודעות על בסיס ביקורים באתר זה או באתרים אחרים. אפשר לנהל פרסום מותאם אישית דרך Google Ads Settings.'
          ],
          links: [
            { href: 'https://policies.google.com/technologies/partner-sites', label: 'איך Google משתמשת בנתונים באתרי שותפים' },
            { href: 'https://adssettings.google.com/', label: 'הגדרות המודעות של Google' }
          ]
        },
        {
          title: 'הסכמה ובחירות בדפדפן',
          paragraphs: [
            'כאשר הדין דורש הסכמה, פרסום ואחסון קשור צריכים לפעול בהתאם לבחירות ההסכמה שמוצגות למשתמש. אפשר גם לחסום או למחוק cookies ו־local storage דרך הגדרות הדפדפן, אך פעולה זו עשויה להשפיע על התנהגות האתר או הפרסום.',
            'Online Converter אינו דורש פתיחת חשבון ואינו מוכר את הקלט של הממירים.'
          ]
        },
        {
          title: 'שאלות בנושא פרטיות',
          paragraphs: [
            'לשאלה בנושא פרטיות או לבקשת תיקון אפשר לפנות לבעל האתר בכתובת evyatarhazan3.14@gmail.com. יש לצרף את כתובת העמוד הרלוונטי, אך לא לצרף קלט רגיש של ממיר.'
          ],
          links: [{ href: 'mailto:evyatarhazan3.14@gmail.com', label: 'שליחת אימייל לבעל האתר' }]
        }
      ]
    }
  },
  contact: {
    en: {
      title: 'Contact Online Converter',
      eyebrow: 'Report a tool or content issue',
      description:
        'Contact the maintainer of Online Converter to report a reproducible tool defect, unclear guidance, accessibility issue, or privacy question.',
      updatedLabel: 'Last reviewed: August 18, 2026',
      sections: [
        {
          title: 'What to include',
          paragraphs: [
            'Include the exact page URL, the expected result, the result you received and a small non-sensitive example that reproduces the problem. For a display or accessibility issue, include the browser and device type.',
            'Do not email passwords, private keys, access tokens, personal records or production data.'
          ]
        },
        {
          title: 'Email',
          paragraphs: [
            'The direct contact address for Online Converter is evyatarhazan3.14@gmail.com. Messages are reviewed by the site owner; there is no separate support account or automated ticket database.'
          ],
          links: [{ href: 'mailto:evyatarhazan3.14@gmail.com?subject=Online%20Converter%20issue', label: 'Email Online Converter support' }]
        },
        {
          title: 'Other project information',
          paragraphs: [
            'The maintainer’s portfolio contains additional project context and public engineering work. Use the email address above for a concrete Online Converter correction so the report can be tied to the correct page.'
          ],
          links: [{ href: 'https://evyatarhazan.com/contact/', label: 'Open the portfolio contact page' }]
        }
      ]
    },
    he: {
      title: 'יצירת קשר עם Online Converter',
      eyebrow: 'דיווח על בעיה בכלי או בתוכן',
      description:
        'יצירת קשר עם מתחזק Online Converter לצורך דיווח על תקלה ניתנת לשחזור, הסבר לא ברור, בעיית נגישות או שאלת פרטיות.',
      updatedLabel: 'נבדק לאחרונה: 18 באוגוסט 2026',
      sections: [
        {
          title: 'מה כדאי לצרף',
          paragraphs: [
            'יש לצרף את כתובת העמוד המדויקת, התוצאה הצפויה, התוצאה שהתקבלה ודוגמה קטנה שאינה רגישה ומאפשרת לשחזר את הבעיה. בבעיית תצוגה או נגישות כדאי לציין גם דפדפן וסוג מכשיר.',
            'אין לשלוח באימייל סיסמאות, מפתחות פרטיים, access tokens, רשומות אישיות או נתוני production.'
          ]
        },
        {
          title: 'אימייל',
          paragraphs: [
            'כתובת הקשר הישירה של Online Converter היא evyatarhazan3.14@gmail.com. ההודעות נבדקות על ידי בעל האתר; אין חשבון תמיכה נפרד או מסד נתונים אוטומטי של פניות.'
          ],
          links: [{ href: 'mailto:evyatarhazan3.14@gmail.com?subject=Online%20Converter%20issue', label: 'שליחת אימייל לתמיכת Online Converter' }]
        },
        {
          title: 'מידע נוסף על הפרויקט',
          paragraphs: [
            'בפורטפוליו של המתחזק מופיעים הקשר נוסף על הפרויקט ועבודות הנדסיות ציבוריות. לתיקון ממוקד ב־Online Converter עדיף להשתמש באימייל שלמעלה כדי לקשר את הדיווח לעמוד הנכון.'
          ],
          links: [{ href: 'https://evyatarhazan.com/contact/', label: 'פתיחת עמוד יצירת הקשר בפורטפוליו' }]
        }
      ]
    }
  }
};

export function getInfoPage(slug: InfoPageSlug, locale: Locale) {
  return infoPages[slug][locale];
}
