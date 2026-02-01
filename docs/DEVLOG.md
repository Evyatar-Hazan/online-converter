# יומן פיתוח – DEVLOG

מסמך זה מתעד את כל השינויים בקוד ובכלי, כולל קומיטים, שימושים והערות חשובות. כל שינוי **חייב** להיכנס לכאן.

---

## מבנה רשומה

כל רשומה כוללת:

1. **תאריך** – YYYY-MM-DD
2. **שם הכלי / מודול**
3. **Slug** – מזהה ייחודי
4. **סוג השינוי** – (Feature, Fix, Refactor, Update)
5. **תיאור השינוי** – מה בוצע, למה, איך
6. **קומיט ID** – Git hash (אם קיים)
7. **הערות שימוש** – טיפים או אזהרות

---

## דוגמה לרשומה

```
Date: 2026-02-01
Tool: JSON to CSV Converter
Slug: json-to-csv
Type: Feature
Description: הוספת כלי הממיר JSON ל-CSV. כולל logic.ts פונקציה טהורה, UI משולב ב-ToolLayout ו-SEO מלא.
Commit: 9f7c2a1
Notes: בדוק מובייל ו-SEO לפני merge.
```

---

## רשומות

### 2026-02-01 - התשתית הראשונית

**תאריך:** 2026-02-01  
**מודול:** Infrastructure  
**Slug:** initial-setup  
**סוג השינוי:** Feature  
**תיאור השינוי:**  
הקמת תשתית מלאה של הפרויקט לפי ARCHITECTURE_STEPS.md:

1. **שלב 1 - Next.js Setup:**
   - יצירת פרויקט Next.js 14+ עם App Router
   - TypeScript מופעל מלא
   - Tailwind CSS מותקן ומוגדר
   - ESLint מוגדר עם next/core-web-vitals
   - קבצי תצורה: tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs

2. **שלב 2 - i18n:**
   - התקנת next-intl
   - הגדרת locales: he (עברית), en (אנגלית)
   - יצירת middleware לניהול שפות
   - layout עם dir דינמי (RTL/LTR)
   - קבצי תרגום: messages/he.json, messages/en.json
   - תמיכה מלאה ב-RTL לעברית

3. **שלב 3 - Core UI Components:**
   - ToolLayout - layout ראשי לכל כלי (Mobile-First)
   - ToolInput - קומפוננטת קלט אחידה
   - ToolOutput - קומפוננטת פלט אחידה
   - ToolActions - כפתורי פעולה (Copy, Clear, Download)
   - כל הקומפוננטות עם:
     - Tap targets ≥ 44px
     - font-size מינימלי 16px
     - Column-based layout
     - אין horizontal scroll

4. **שלב 4 - SEO Infrastructure:**
   - core/seo/metadata.ts - פונקציות generateToolMetadata ו-generateToolSchema
   - תמיכה מלאה ב-Metadata API של Next.js
   - Schema.org/SoftwareApplication מוכן
   - Canonical URLs
   - hreflang אוטומטי
   - Open Graph & Twitter Cards

5. **שלב 5 - Tools Registry:**
   - core/registry/tools.registry.ts - רישום מרכזי של כל הכלים
   - ToolMetadata type עם slug, title, description, keywords לכל שפה
   - פונקציות helper: getToolBySlug, getAllTools, getToolsByCategory
   - sitemap.ts דינמי מבוסס Registry
   - robots.ts לאינדקס אופטימלי

6. **שלב 6 - AdSense Infrastructure:**
   - הוספת AdSense ב-layout ראשי (app/[locale]/layout.tsx)
   - תמיכה ב-NEXT_PUBLIC_ADSENSE_ID
   - קוד נטען רק אם מוגדר משתנה סביבה
   - .env.example עם דוגמאות

**קבצים שנוצרו:**
- /package.json
- /tsconfig.json
- /next.config.ts
- /tailwind.config.ts
- /postcss.config.mjs
- /.eslintrc.json
- /.gitignore
- /i18n.ts
- /middleware.ts
- /app/globals.css
- /app/[locale]/layout.tsx
- /app/[locale]/page.tsx
- /app/sitemap.ts
- /app/robots.ts
- /messages/he.json
- /messages/en.json
- /components/ToolLayout.tsx
- /components/ToolInput.tsx
- /components/ToolOutput.tsx
- /components/ToolActions.tsx
- /core/seo/metadata.ts
- /core/seo/index.ts
- /core/registry/tools.registry.ts
- /core/registry/index.ts
- /.env.example

**Commit:** (ממתין לקומיט ראשון)  

**הערות שימוש:**
- התשתית מוכנה להוספת כלים חדשים
- כל כלי חדש חייב לעקוב אחרי TOOL_TEMPLATE.md
- לפני הוספת כלי ראשון: הרץ `npm run dev` ובדוק שהפרויקט עובד
- הגדר .env.local עם NEXT_PUBLIC_BASE_URL
- AdSense אופציונלי - הוסף NEXT_PUBLIC_ADSENSE_ID רק כשמוכן
- Mobile-First: כל UI עובד מושלם במובייל תחילה

---

## כללים

* כל קומיט שמוסיף או משנה כלי חייב להיכנס ל-DEVLOG
* אין רשומות כפולות – אם תיקנת משהו, עדכן את הרשומה הקיימת
* שמירה על אחידות השדות
* עדכון ההערות שימוש במידה ויש שינויים חשובים

---

## משפט מסכם

> **DEVLOG הוא הסמכות הרשמית למעקב אחרי כל כלי ושינוי בפרויקט.**
