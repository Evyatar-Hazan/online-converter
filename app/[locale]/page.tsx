import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg md:text-xl">{t('description')}</p>
      </div>
    </main>
  );
}
