import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Converter',
  description: 'Professional conversion tools',
};

const locales = ['he', 'en'];

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  // Determine text direction
  const dir = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* AdSense - מוכנס כאן בלבד, לא בכלים */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <>
            <meta
              name="google-adsense-account"
              content={process.env.NEXT_PUBLIC_ADSENSE_ID}
            />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
