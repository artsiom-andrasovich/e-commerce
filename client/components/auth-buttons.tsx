import { AppPaths } from '@/constants/app-paths';
import Link from 'next/link';
import { Button } from './ui/button';

export function AuthButtons() {
  return (
    <div className="flex flex-row gap-2">
      <Button asChild variant="secondary">
        <Link href={AppPaths.auth.SIGN_IN}>Sign in</Link>
      </Button>
      <Button asChild>
        <Link href={AppPaths.auth.SIGN_UP}>Sign up</Link>
      </Button>
    </div>
  );
}
