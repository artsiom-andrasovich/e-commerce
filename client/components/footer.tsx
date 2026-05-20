import { APP_NAME } from '@/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-accent-foreground/70 text-center py-2">
      &copy; {currentYear} {APP_NAME} Poland. All rights reserved.
    </footer>
  );
}
