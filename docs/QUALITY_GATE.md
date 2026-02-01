# שער איכות – QUALITY_GATE

מסמך זה מגדיר את כל הבדיקות והקריטריונים שחייבים לעבור **לפני merge או פרסום כלי חדש**.

---

## 1. בדיקות מובייל

* Lighthouse Mobile ≥ 95
* LCP < 2.5s
* CLS = 0
* Tap targets ≥ 44px
* font-size מינימלי 16px
* אין horizontal scroll

❌ אם אחד הקריטריונים לא מתקיים – אין merge

---

## 2. בדיקות SEO

* title ייחודי ומדויק
* meta description תואם
* canonical נכון
* hreflang מלא לכל שפה
* schema.org/SoftwareApplication
* בדיקה מול registry
* “בדוק ש־AdSense נטען בצורה תקינה בכל עמוד – אם לא, אין merge”

❌ אם אחד החוקים לא מתקיים – אין merge

---

## 3. בדיקות i18n

* כל טקסט דרך מערכת התרגום
* בדיקה בעברית ובאנגלית
* בדיקת RTL
* אין מחרוזות hardcoded

---

## 4. בדיקות UI / UX

* שימוש ב־ToolLayout בלבד
* אין קומפוננטות חדשות לכלי
* Mobile-first נשמר
* אחידות צבעים וגופנים

---

## 5. בדיקות פונקציונליות

* logic.ts פונקציה טהורה
* input → output נכון
* אין side effects
* בדיקה ידנית קצרה לכלי

---

## 6. בדיקות אוטומציה (אם קיימות)

* unit tests עבור logic.ts
* smoke tests עבור UI בסיסי
* snapshot tests אם יש צורך

---

## 7. CI / CD

* כל merge מחייב הרצה מלאה של בדיקות
* בדיקות לא עברו → block merge

---

## משפט מסכם

> **כל כלי שלא עבר את QUALITY_GATE – לא נכנס לפרויקט, לא משנה כמה יפה הוא.**
