// import { AppPaths } from '@/constants/app-paths';
import { Button } from '@/components/Button';
import { AppPaths } from '@/constants/app-paths';
import { Link } from '@/i18n';
import { useTranslations } from 'next-intl';

export function AuthButtons() {
  const t = useTranslations('Auth');
  return (
    <div className="flex flex-row gap-2">
      <Button className="rounded-md" variant="outline">
        <Link href={AppPaths.AUTH.SIGN_IN}>{t('sign-in')}</Link>
      </Button>
      <Button className="rounded-md">
        <Link href={AppPaths.AUTH.SIGN_UP}>{t('sign-up')}</Link>
      </Button>
    </div>
  );
}
