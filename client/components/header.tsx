import { APP_NAME } from '@/constants';
import { AppPaths } from '@/constants/app-paths';
import { CirclePercent } from 'lucide-react';
import Link from 'next/link';
import { AuthButtons } from './auth-buttons';
import { Container } from './container';
import { UserDropdown } from './user-dropdown';

export function Header() {
  //FIXME:
  const hasToken = true;
  return (
    <header className="bg-accent-foreground/70">
      <Container className="py-4 px-2 flex-row flex justify-between">
        <Link
          href={AppPaths.HOME}
          className="flex items-center gap-2 text-2xl text-white "
        >
          <CirclePercent />
          <h1>{APP_NAME}</h1>
        </Link>
        {hasToken ? <UserDropdown /> : <AuthButtons />}
      </Container>
    </header>
  );
}
