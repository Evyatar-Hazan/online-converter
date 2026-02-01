# תבנית כלי – TOOL_TEMPLATE

קובץ זה מגדיר את השלד של קונברטר חדש. כל כלי חדש **חייב להעתיק את התבנית הזו**. אין חריגים.

---

## מבנה תיקייה

```
/app/[locale]/tools/<tool-slug>/
  page.tsx       ← UI בלבד
  logic.ts       ← פונקציה טהורה
  seo.ts         ← metadata + schema
```

---

## page.tsx – UI Layer

```ts
import ToolLayout from '@/components/ToolLayout';
import ToolInput from '@/components/ToolInput';
import ToolOutput from '@/components/ToolOutput';
import ToolActions from '@/components/ToolActions';
import { convert } from './logic';
import { useTranslations } from 'next-intl';

export default function ToolPage() {
  const t = useTranslations('<tool-slug>');

  const handleConvert = (input: string) => convert(input);

  return (
    <ToolLayout title={t('title')} description={t('description')}>
      <ToolInput onConvert={handleConvert} />
      <ToolOutput />
      <ToolActions />
    </ToolLayout>
  );
}
```

* אין לוגיקה עסקית מעבר לפונקציה טהורה
* אין SEO inline
* Mobile-first

---

## logic.ts – Tool Logic Layer

```ts
export function convert(input: string): string {
  // TODO: כתוב כאן את הלוגיקה של הכלי
  return input;
}
```

* פונקציה טהורה בלבד
* אין async אם לא חובה
* אין side effects

---

## seo.ts – SEO Layer

```ts
export const SEO = {
  title: '<Tool Name>',
  description: '<Tool Description>',
  canonical: '/tools/<tool-slug>',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '<Tool Name>',
    description: '<Tool Description>',
    applicationCategory: 'Utility',
    url: '/tools/<tool-slug>'
  },
  hreflang: [
    { lang: 'en', url: '/en/tools/<tool-slug>' },
    { lang: 'he', url: '/he/tools/<tool-slug>' }
  ]
};
```

* חובה לכלול title, description, canonical, schema, hreflang
* אין תוספות אחרות

---

## תהליך שימוש

1. צור תיקייה עם slug ייחודי
2. העתק את כל הקבצים
3. עדכן logic.ts עם פונקציית ההמרה
4. עדכן seo.ts
5. בדוק מובייל ו־SEO
6. קומיט אחד עם תיעוד DEVLOG
