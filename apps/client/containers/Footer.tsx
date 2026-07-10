import { APP_NAME } from '@/constants';
import { useTranslations } from 'next-intl';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('Footer');
  return (
    <footer className="bg-accent-foreground/70 text-foreground border-t text-center py-2">
      &copy; {currentYear} {APP_NAME} {t('copyright')}
    </footer>
  );
}
