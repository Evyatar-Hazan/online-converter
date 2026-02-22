
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface HeaderProps {
  showBack?: boolean;
}

export function Header({ showBack = false }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <header>
      <div style={{ display: 'flex', justifyContent: showBack ? 'space-between' : 'flex-end', alignItems: 'center', marginBottom: '1.5rem' }}>
        {showBack && (
          <Link to="/" className="back-link" style={{ margin: 0 }} aria-label={t('header.back')}>
            {i18n.language === 'he' ? <ArrowLeft size={16} aria-hidden="true" style={{transform: 'rotate(180deg)'}} /> : <ArrowLeft aria-hidden="true" size={16} />} 
            {t('header.back')}
          </Link>
        )}
        <button 
          className="btn" 
          onClick={toggleLanguage} 
          aria-label={i18n.language === 'he' ? 'Switch to English' : 'החלף לשפה העברית'}
          style={{ margin: 0, padding: '0.5rem 1rem', display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
          <Globe size={16} aria-hidden="true" />
          {i18n.language === 'he' ? 'English' : 'עברית'}
        </button>
      </div>
      <h1>{t('header.title')}</h1>
      <p className="description">
        {t('header.description')}
      </p>
    </header>
  );
}
