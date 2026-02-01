# הוספת קונברטר חדש – ADD_CONVERTER_GUIDE

מסמך זה מגדיר תהליך **מחייב, אחיד ונטול פרשנות** להוספת קונברטר חדש לפרויקט.

❗ כל קונברטר חדש חייב לעבור את כל השלבים כאן. אין חריגים.

---

## תנאי סף

לפני הוספת קונברטר חדש:

* ARCHITECTURE_STEPS הושלם במלואו
* Tool Template קיים ומעודכן
* Registry פעיל
* בדיקות מובייל ו־SEO עובדות

---

## שלב 1 – בחירת חיפוש יעד

* בחר ביטוי חיפוש **אחד בלבד**
* ודא שיש כוונת שימוש מיידית
* ה־slug חייב להיות זהה לביטוי באנגלית

✔ נכון:

* `json-to-csv`
* `jwt-decoder`

❌ אסור:

* `json-tools`
* `data-converters`

---

## שלב 2 – רישום ב־Registry

עדכן `tools.registry.ts`:

* slug
* title (he / en)
* description (he / en)
* keywords (he / en)

❌ אין ניווט ידני
❌ אין sitemap ידני

---

## שלב 3 – יצירת תיקיית כלי

נתיב חובה:

```
/app/[locale]/tools/<tool-slug>/
```

קבצים מחייבים:

* page.tsx
* logic.ts
* seo.ts

---

## שלב 4 – כתיבת Logic

ב־`logic.ts`:

* פונקציה טהורה בלבד
* input → output
* ללא UI
* ללא SEO
* ללא async אם לא חובה

חתימה:

```
export function convert(input: string): string
```

---

## שלב 5 – SEO

ב־`seo.ts`:

* title מדויק
* meta description ממוקד
* schema.org/SoftwareApplication
* canonical
* hreflang

אין SEO בתוך page.tsx.

---

## שלב 6 – UI

ב־`page.tsx`:

* שימוש ב־ToolLayout
* ToolInput
* ToolOutput
* ToolActions

❌ אין קומפוננטות חדשות לכלי
❌ אין CSS מותאם

---

## שלב 7 – i18n

* כל טקסט דרך מערכת התרגום
* אין מחרוזות hardcoded
* בדיקת RTL

---

## שלב 8 – בדיקות חובה

לפני קומיט:

* Lighthouse Mobile ≥ 95
* בדיקה ידנית בנייד
* בדיקת SEO בסיסית
* בדיקת CLS

---

## שלב 9 – תיעוד

* עדכון DEVLOG.md
* תיאור הקונברטר
* חיפוש יעד
* הערות שימוש

---

## שלב 10 – קומיט

* קומיט אחד לכלי
* הודעה ברורה
* ציון slug הכלי

---

## משפט מסכם

> **קונברטר שלא עבר את התהליך הזה – לא נכנס לפרויקט.**
