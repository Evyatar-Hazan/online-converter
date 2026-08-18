# אונליין קונברטר

מרכז ממירים דו־לשוני וממוקד מוצר, בנוי עם Astro ו־React islands. האתר מפרסם דפים שנבדקו בעברית ובאנגלית, וכל ממיר אינטראקטיבי רץ מקומית בדפדפן.

## יכולות

- 140 הגדרות ממירים, שמתוכן 16 כלים שעברו ביקורת מפורסמים בעברית ובאנגלית.
- דפים סטטיים לכלים שנבדקו, קטגוריות, בעלות, מדיניות עריכה, פרטיות ויצירת קשר.
- המרה מקומית בדפדפן: הקלט לא נשלח לשרת.
- canonical URLs, hreflang, OpenGraph, JSON-LD, FAQ schema, sitemap ו־robots.txt.
- תמיכה אופציונלית באנליטיקה פרטיותית דרך Cloudflare Web Analytics או Plausible.
- טעינת Google AdSense, אזורי מודעות ידניים ו־`ads.txt` שנוצר מההגדרות.
- בדיקות יחידה עם Vitest ובדיקות דפדפן עם Playwright.

## טכנולוגיות

- Astro ליצירת אתר סטטי
- React לווידג׳ט ההמרה האינטראקטיבי
- TypeScript
- פענוח YAML באמצעות `yaml`
- Playwright ו־Vitest

## פיתוח מקומי

```bash
npm install
npm run dev
```

Preview מקומי:

```bash
npm run build
npm run preview
```

## Analytics

Analytics כבוי כברירת מחדל ונטען רק אם מוגדרים משתני סביבה.

```bash
PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN=your_cloudflare_token
PUBLIC_PLAUSIBLE_DOMAIN=online-converter.evyatarhazan.com
```

Cloudflare Web Analytics מודד צפיות עמוד. Plausible מקבל גם אירועי שימוש בממירים כמו `convert_tool`, `convert_error`, `copy_output` ו־`download_output`.

## Google AdSense

AdSense כבוי כברירת מחדל ונטען רק אם מוגדר Client ID אמיתי.

```bash
PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-6696643120887220
PUBLIC_GOOGLE_ADSENSE_SLOT_TOP=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_INLINE=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR=1234567890
PUBLIC_GOOGLE_ADSENSE_SLOT_BOTTOM=1234567890
```

כאשר `PUBLIC_GOOGLE_ADSENSE_CLIENT` מוגדר, סקריפט AdSense נטען רק בעמודי כלים שעברו ביקורת ו־`/ads.txt` נוצר מתוך אותו Client ID. דפי בית, קטגוריה, מידע ועמודים פנימיים נשארים ללא מודעות. Google תציג מודעות אמיתיות רק אחרי שהדומיין יאושר. ראה `docs/adsense-approval-tracker.md` ו־`docs/adsense-setup.md`.

## פריסה לפרודקשן

הפרודקשן מנוהל דרך Cloudflare Pages Git integration.

- אתר: `https://online-converter.evyatarhazan.com/`
- פרויקט Cloudflare Pages: `online-converter`
- ענף פרודקשן: `main`
- פקודת build: `npm run build`
- תיקיית output: `dist`

כל push ל־`main` מפעיל פריסה חדשה ב־Cloudflare Pages.

## בדיקות איכות

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
npm audit --omit=dev
npm run smoke:prod
```

## מסמכי ניהול והפעלה

- מסמך מעקב ראשי: `docs/project-tracker-he.md`
- מסמך משימות: `docs/project-tasks-he.md`
- תצורת AdSense: `docs/adsense-setup.md`
- מעקב אישור AdSense: `docs/adsense-approval-tracker.md`
- לוח analytics פנימי: `docs/analytics-dashboard.md`
- רעיונות עתידיים לממירים: `docs/next-converters.md`

## הוספת ממיר חדש

1. מוסיפים את פונקציית ההמרה ב־`src/lib/converter-functions.ts`.
2. רושמים את ה־metadata של הכלי ב־`src/data/converters.ts` כולל כותרת, תיאור, keywords, דוגמאות, FAQ וקישורים קשורים בעברית ובאנגלית.
3. מוסיפים או מרחיבים בדיקות יחידה ב־`src/lib/converter-functions.test.ts`.
4. מריצים `npm run test` כדי לבדוק registry, SEO והתנהגות ממירים.
5. מריצים `npm run build` ו־`npm run test:e2e` לפני push.

רעיונות לממירים עתידיים מרוכזים ב־`docs/next-converters.md`; הימצאות ב־registry אינה מפרסמת עמוד באופן אוטומטי.
