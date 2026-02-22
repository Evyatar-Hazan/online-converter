
import { useTranslation } from 'react-i18next';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  return (
    <footer>
      <p>&copy; {currentYear} {t('footer.rights')}</p>
    </footer>
  );
}
