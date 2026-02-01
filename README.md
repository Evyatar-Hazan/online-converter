# Converter - SEO Platform for Tools

פלטפורמה של כלי המרה ממוקדי חיפוש, מהירים ומותאמים מובייל באופן מושלם.

## 📋 מסמכי תיעוד

לפני תחילת העבודה, קרא את:
- [VISION.md](./docs/VISION.md) - חזון הפרויקט
- [PRINCIPLES.md](./docs/PRINCIPLES.md) - עקרונות מחייבים
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - מבנה ותשתית
- [ARCHITECTURE_STEPS.md](./docs/ARCHITECTURE_STEPS.md) - שלבי הקמה

## 🚀 התחלה מהירה

```bash
# התקנת תלויות
npm install

# הרצה בסביבת פיתוח
npm run dev

# בנייה לייצור
npm run build

# הרצה בסביבת ייצור
npm start
```

## 🛠️ הוספת כלי חדש

עקוב אחרי המדריך המלא ב-[ADD_CONVERTER_GUIDE.md](./docs/ADD_CONVERTER_GUIDE.md)

**תהליך מקוצר:**
1. הוסף לרישום ב-`core/registry/tools.registry.ts`
2. צור תיקייה: `app/[locale]/tools/<tool-slug>/`
3. צור 3 קבצים: `page.tsx`, `logic.ts`, `seo.ts`
4. השתמש ב-[TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md)
5. בדוק mobile ו-SEO
6. עדכן DEVLOG.md

## 📁 מבנה תיקיות

```
/app
  /[locale]          # Internationalization
    /tools           # כל הכלים
      /<tool-slug>   # כלי בודד
        page.tsx     # UI בלבד
        logic.ts     # פונקציה טהורה
        seo.ts       # SEO metadata
  sitemap.ts         # Sitemap דינמי
  robots.ts          # Robots.txt

/components          # קומפוננטות משותפות
  ToolLayout.tsx
  ToolInput.tsx
  ToolOutput.tsx
  ToolActions.tsx

/core
  /seo               # תשתית SEO
  /registry          # רישום כלים
  /i18n              # תרגומים

/messages            # קבצי תרגום
  he.json
  en.json

/docs                # תיעוד מלא
```

## 🎯 עקרונות ליבה

### 1. Frontend Only
- אין Backend
- אין Database
- כל הלוגיקה בדפדפן
- Static Site Generation (SSG)

### 2. Mobile-First מוחלט
- Layout בעמודה אחת
- Tap targets ≥ 44px
- font-size מינימלי 16px
- אין horizontal scroll

### 3. הפרדת אחריות
- `page.tsx` - UI בלבד
- `logic.ts` - פונקציה טהורה
- `seo.ts` - Metadata בלבד

### 4. SEO מובנה
- Title ייחודי
- Meta Description
- Schema.org
- Canonical
- hreflang

### 5. i18n מלא
- עברית + אנגלית
- RTL מלא
- URL נפרד לכל שפה

## ✅ Quality Gate

לפני merge, חובה:
- ✅ Lighthouse Mobile ≥ 95
- ✅ LCP < 2.5s
- ✅ CLS = 0
- ✅ בדיקת RTL
- ✅ בדיקת SEO
- ✅ עדכון DEVLOG

## 🔧 טכנולוגיות

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **next-intl**
- **ESLint**

## 📝 תיעוד נוסף

- [QUALITY_GATE.md](./docs/QUALITY_GATE.md) - בדיקות חובה
- [SEO_PLAYBOOK.md](./docs/SEO_PLAYBOOK.md) - כללי SEO
- [MOBILE_UX_RULES.md](./docs/MOBILE_UX_RULES.md) - כללי UX מובייל
- [COMMIT_RULES.md](./docs/COMMIT_RULES.md) - כללי קומיט
- [DEVLOG.md](./docs/DEVLOG.md) - יומן פיתוח

## 🌍 משתני סביבה

צור קובץ `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX  # אופציונלי
```

## 📜 רישיון

כל הזכויות שמורות.

---

**משפט חזון:**
> פלטפורמה שמייצרת עמודי כלים מושלמים לגוגל ולמשתמש – בלי להתאמץ מחדש בכל פעם.
# online-converter
