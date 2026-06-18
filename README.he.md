# אונליין קונברטר

מרכז ממירים דו־לשוני וממוקד SEO, בנוי עם Astro ו־React islands. האתר מייצר דפים סטטיים בעברית ובאנגלית, וכל ממיר אינטראקטיבי רץ מקומית בדפדפן לטובת מהירות ופרטיות.

## יכולות

- 24 ממירים בקטגוריות נתונים, טקסט, קידוד, תאריכים, צבעים וכלי פיתוח.
- דפי SEO סטטיים לכל כלי ולכל קטגוריה בעברית ובאנגלית.
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

כאשר `PUBLIC_GOOGLE_ADSENSE_CLIENT` מוגדר, סקריפט AdSense נטען ב־layout ו־`/ads.txt` נוצר מתוך אותו Client ID. אזורי מודעות ידניים יוצגו רק כאשר מוגדרים גם Client ID וגם Slot ID מתאים. Google תציג מודעות אמיתיות רק אחרי שהדומיין יאושר ב־AdSense.

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
```
