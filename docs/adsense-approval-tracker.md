# מעקב אישור Google AdSense

עודכן: 18 באוגוסט 2026

## תמונת מצב מאומתת

- סטטוס AdSense האחרון שנצפה: `נדרש טיפול`.
- הבעלות על `evyatarhazan.com` אומתה.
- הסיבה היחידה ש־Google הציגה היא `תוכן בעל ערך נמוך`.
- לא הוצגו URL בעייתי, כלל פנימי מדויק או אבחנה מפורטת יותר.
- לפי הממשק שנצפה, אי אפשר לבקש בדיקה נוספת לפני 24 באוגוסט 2026.
- לכן אין לייחס את הדחייה לפער מסוים בלי ראיה. כל פער פרויקטואלי במסמך מסומן בנפרד מהסיבה הרשמית.

## מקרא סטטוסים

- `PASS` — אומת ישירות בקוד, ב־build או באתר החי.
- `FIXED` — היה פער מוכח ותוקן בקוד הנוכחי.
- `UNVERIFIED` — דורש נתוני חשבון, תנועה או ממשק Google שאין בריפו.
- `N/A` — לא חל על המימוש הנוכחי.
- `GOOGLE RESULT` — עובדה שהוצגה ישירות ב־AdSense.

## מטריצת הסיבות הרשמית והבדיקה בפרויקט

| תחום רשמי | עובדה מתוך תיעוד Google | בדיקת הפרויקט | סטטוס | פעולה או ראיה |
| --- | --- | --- | --- | --- |
| קוד מודעה | קוד חסר או לא שלם יכול למנוע בדיקת אתר | loader ושני slots קיימים בכל אחד מ־32 עמודי הכלים | PASS | `npm run adsense:readiness` |
| נגישות לסורק | URL שגוי, login, חסימת crawler, SSL או אתר לא זמין מונעים בדיקה | HTTPS, apex/www redirect, robots, sitemap ונתיבי כלים החזירו תגובה תקינה; Google crawlers קיבלו `200` | PASS | בדיקת HTTP חיה מ־18.08.2026 |
| מעט תוכן | מעט טקסט, template לא גמור או אתר בבנייה אינם מספיקים | 32 עמודי הכלים עוברים סף תוכן, FAQ, דוגמאות ומקטעי שימוש; 124 כלים פנימיים לא מפורסמים אוטומטית | PASS | gate סטטי וכלל public registry |
| ערך ייחודי | Google דורשת תוכן מקורי ורלוונטי עם ערך נוסף | לכל כלי ציבורי יש תוכן ייחודי ממופה; קיימים גם מקטעים משותפים | PASS עם סיכון מנוטר | חותמת ביקורת גלויה; תוכן template לבדו אינו מספיק לפרסום |
| תוכן משוכפל/מיוצר | העתקה, שכתוב או יצירה אוטומטית ללא ביקורת וערך נוסף אינם מותרים | אין פרסום אוטומטי לכל registry; מדיניות עריכה מתעדת בדיקה אנושית | FIXED | `/en/editorial/`, `/he/editorial/` |
| תוכן בקנה מידה לצורכי חיפוש | הרבה עמודים שנועדו בעיקר לדירוג, עם מעט ערך, נחשבים abuse | טקסט פומבי דיבר על search demand, authority ו־internal linking | FIXED | הניסוחים הוסרו; gate נכשל אם הם חוזרים |
| ניווט וחוויית משתמש | קישורים שבורים, redirect, login, popup או אתר לא גמור הם בעיה | build בודק קישורים פנימיים, canonical, hreflang ו־sitemap | PASS | `npm run seo:check` |
| מודעות במסכי ניווט | אסור להציב מודעות במסכים בלי תוכן, עם תוכן בעל ערך נמוך או המשמשים לניווט/התנהגות | הבית והקטגוריות היו ממומנטים למרות שתפקידם העיקרי ניווט וגילוי כלים | FIXED | מודעות הוסרו מ־16 עמודי בית/קטגוריה |
| מודעה ליד פעולות | מודעות אינן יכולות להיצמד לניווט, download או controls באופן שמעודד קליק שגוי | placement עליון הופיע ליד חיפוש/quick navigation; בכלי נשארו רק inline ו־bottom אחרי תוכן | FIXED | gate מאשר אפס מודעות בדפי ניווט ושתי מודעות בדף כלי |
| יותר מודעות מתוכן | אסור שיהיו יותר מודעות מתוכן publisher; ניווט ו־footer אינם תוכן | בכל עמוד כלי יש שתי מודעות בלבד אחרי תוכן משמעותי | PASS | סף תוכן + ספירת slots |
| תוכן אסור | תוכן מסוכן, מטעה, מיני, מפר זכויות או illegal מפר Publisher Policies | לא זוהה תוכן כזה בדפי הכלים שנבדקו | PASS בגבולות הריפו | לא מהווה אישור של Policy Center בחשבון |
| fake functionality | אתר שמבטיח פעולה שאינה עובדת מפר Search spam policies | בדיקות יחידה ו־E2E מפעילות ממירים מייצגים; נתיבי backlog אינם נבנים | PASS | Vitest, Playwright, readiness gate |
| שפה נתמכת | תוכן בשפה שאינה נתמכת עלול להיפסל | אנגלית ועברית מופיעות ברשימת השפות הנתמכות של AdSense | PASS | תיעוד Google |
| מדיניות פרטיות | נדרשת מדיניות שמסבירה cookies, web beacons, IP ושימוש צד שלישי | לא היה עמוד פרטיות בדומיין הממיר; `/en/privacy/` החזיר `404` | FIXED | נוספו עמודי פרטיות מלאים בעברית ובאנגלית וקישור קבוע ב־footer |
| זהות ואחריות | תוכן people-first צריך להבהיר מי יצר אותו ומה תהליך הבדיקה | לא היו עמודי אודות, עריכה או יצירת קשר בדומיין הממיר | FIXED | נוספו שמונה עמודי מידע בשתי שפות |
| תנועה | מקורות תנועה מסוימים או תנועה לא תקינה עלולים לפגוע בזכאות | אין נתוני Acquisition או Invalid Traffic בריפו | UNVERIFIED | לבדוק בדוחות Google/Cloudflare לפני הגשה |
| Policy Center | הפרה ברמת החשבון או URL יכולה לחסום אישור | אין גישת חשבון מאומתת בתהליך הבדיקה הנוכחי | UNVERIFIED | לצלם/לייצא את כל פריטי Policy Center לפני הגשה |
| Consent/CMP | ב־EEA, בריטניה ושווייץ נדרש CMP מאושר עבור מודעות מותאמות | הגדרת Privacy & messaging היא ברמת חשבון ואינה ניתנת להוכחה מהקוד הסטטי | UNVERIFIED | לוודא CMP מאושר והודעה פעילה לפני הגשה |
| יחס מודעות אוטומטיות | Auto ads עלולים ליצור placement שלא מופיע ב־HTML המקורי | אין ראיה מה־repo אם Auto ads מופעלים בחשבון | UNVERIFIED | לבדוק AdSense > Ads > By site; להשאיר כבוי עד אישור placement |

## תיקונים שבוצעו בקוד

1. מודעות הוגבלו ל־32 עמודי כלים שעברו ביקורת; 24 עמודי בית, קטגוריה ומידע נטענים ללא AdSense.
2. נוספו עמודי About, Editorial, Privacy ו־Contact באנגלית ובעברית, כולל קישורי footer בכל עמוד ציבורי.
3. מדיניות הפרטיות מפרטת עיבוד מקומי, local storage, Cloudflare, Google AdSense, cookies, web beacons, כתובות IP, Google partner sites ו־Ads Settings.
4. לכל עמוד כלי נוספה ראיית ביקורת עריכה גלויה עם תאריך וקישור למדיניות.
5. הוסרו ניסוחים פומביים שמציגים את האתר כמוצר שנבנה עבור search demand, authority או internal linking.
6. הוסר `SearchAction` לא מדויק: האתר לא קרא את `?q=` בזמן טעינת עמוד.
7. הוחלפו מדדי אמון לא מבוססים (`100%`, `0`, `<1s`) בניסוחים טכניים מדויקים.
8. בדיקת AdSense שונתה מהנחת "כל עמוד ציבורי חייב מודעה" למדיניות "רק עמוד כלי שנבדק רשאי להיטען עם מודעה".
9. ה־sitemap הורחב לעמודי הבעלות והמדיניות, ובדיקות metadata ו־E2E עודכנו בהתאם.

## שער חובה לפני בקשת בדיקה מחדש

- [x] build מלא עובר ב־Node 22.
- [x] 56 עמודים ציבוריים indexable נמצאים ב־sitemap.
- [x] רק 32 עמודי כלים ממומנטים.
- [x] דפי ניווט, מידע, analytics ו־404 ללא מודעות.
- [x] privacy/about/editorial/contact זמינים בשתי השפות ב־build.
- [ ] הקוד הנוכחי נפרס ל־production ונבדק ישירות בכל הנתיבים החדשים.
- [ ] Cloudflare production build ירוק על commit המדויק.
- [ ] Policy Center נבדק ואין בו פריט פתוח נוסף.
- [ ] Privacy & messaging/CMP נבדק בחשבון.
- [ ] מקורות התנועה נבדקו ולא נמצאה תנועה לא תקינה או קנויה.
- [ ] Auto ads נבדק כדי שלא יעקוף את גבול ה־placement.
- [ ] תאריך 24.08.2026 הגיע וממשק AdSense מאפשר הגשה.

אין לבקש בדיקה מחדש לפני שכל הסעיפים מסומנים. גם אחרי השלמתם אין הבטחת אישור: ההחלטה והאבחנה הפנימית נשארות בידי Google.

## מקורות רשמיים

- [If your site is not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en)
- [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563?hl=en-EN)
- [Your AdSense account wasn't approved](https://support.google.com/adsense/answer/81904?hl=en)
- [Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10502938?hl=en)
- [Replicated content](https://support.google.com/publisherpolicies/answer/11190248?hl=en)
- [More ads or paid promotional material than publisher-content](https://support.google.com/publisherpolicies/answer/11169917?hl=en)
- [Google AdSense crawlers](https://support.google.com/adsense/answer/99376?hl=en)
- [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Privacy disclosures in the Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10437794?hl=en)
- [Required content for a privacy policy](https://support.google.com/adsense/answer/1348695?hl=en)
- [Google-certified CMP requirements](https://support.google.com/adsense/answer/13554020?hl=en-GB)
- [Ads interfering with content or user interactions](https://support.google.com/publisherpolicies/answer/11035030?hl=en)

## פקודות ראיה

```bash
fnm exec --using=22.23.2 npm run adsense:readiness
fnm exec --using=22.23.2 npm run seo:check
fnm exec --using=22.23.2 npm test
fnm exec --using=22.23.2 npm run test:e2e
fnm exec --using=22.23.2 npm run perf:check
fnm exec --using=22.23.2 npm audit --omit=dev
fnm exec --using=22.23.2 npm run smoke:prod
```
