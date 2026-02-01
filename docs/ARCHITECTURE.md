# ארכיטקטורת הפרויקט – ARCHITECTURE

מסמך זה מתאר את מבנה המערכת, חלוקת האחריות, וההחלטות ההנדסיות שמאפשרות סקייל מהיר, SEO חזק, ותחזוקה קלה – תוך עמידה מלאה בעקרונות הפרויקט.

---

## עקרון־על ארכיטקטוני

> **תשתית אחת שמולידה עמודי כלים עצמאיים, אחידים ומוכווני־חיפוש – ללא לוגיקה חוזרת וללא תלות בשרת.**

---

## טכנולוגיות ליבה

* **Next.js – App Router**
* Static Site Generation (SSG)
* TypeScript
* Tailwind CSS (Mobile-First)
* next-intl (i18n + RTL)

❌ אין Backend
❌ אין Database

---

## מבנה תיקיות ראשי

```
/app
  /[locale]
    /tools
      /<tool-slug>
        page.tsx
        logic.ts
        seo.ts

/components
  ToolLayout.tsx
  ToolInput.tsx
  ToolOutput.tsx
  ToolActions.tsx

/core
  seo
  i18n
  registry

/docs
  *.md
```

---

## שכבות המערכת

### 1️⃣ Tool Logic Layer

**מיקום:** `/app/[locale]/tools/<tool>/logic.ts`

* פונקציה טהורה בלבד
* input → output
* ללא UI
* ללא SEO
* ללא side effects

דוגמה:

```
export function convert(input: string): string
```

---

### 2️⃣ Tool UI Layer

**מיקום:** `page.tsx`

* שימוש אך ורק בקומפוננטות משותפות
* ללא לוגיקה עסקית
* Mobile-first
* תוצאה מיידית

---

### 3️⃣ SEO Layer

**מיקום:** `seo.ts`

אחראי על:

* title
* meta description
* schema
* canonical
* hreflang

אין SEO inline בתוך page.tsx.

“כל קוד פרסומות חיצוני (AdSense) מוכנס ב־_document.tsx בלבד, לא ב־page.tsx או logic.ts”

---

## קומפוננטות משותפות (Core UI)

כל הכלים משתמשים באותן קומפוננטות:

* ToolLayout
* ToolInput
* ToolOutput
* ToolActions

יתרונות:

* אחידות מלאה
* מובייל נעול
* תחזוקה קלה

---

## Registry – לב המערכת

**מיקום:** `/core/registry/tools.registry.ts`

* רשימת כל הכלים
* slug
* titles
* descriptions
* keywords
* הגדרות i18n

ה־Registry משמש ל:

* ניווט
* Sitemap
* SEO
* יצירת עמודים

---

## i18n ו־RTL

* כל עמוד נבנה לכל שפה
* URL נפרד (`/he`, `/en`)
* hreflang אוטומטי
* `dir` לפי locale

---

## Mobile-First בתשתית

* Layout אחד
* ללא Grid במובייל
* `md:` רק לשיפור
* אין CSS מותאם־כלי

---

## Performance כברירת מחדל

* אין Lazy Load לכלי
* אין ספריות כבדות
* מינימום JS
* HTML נגיש לגוגל

---

## למה הארכיטקטורה הזו עובדת

* הוספת כלי = קבצים בודדים
* SEO לא נשבר
* מובייל לא נשבר
* קופיילוט לא ממציא דברים

---

## משפט סיכום

> **כל החלטה ארכיטקטונית בפרויקט הזה נועדה לשרת סקייל, SEO ומהירות – לא נוחות רגעית.**
