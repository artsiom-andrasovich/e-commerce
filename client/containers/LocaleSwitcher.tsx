'use client';

import { Button } from '@/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { getLocaleLabel, LOCALES } from '@/constants';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    }
  };

  return (
    <DropdownMenu className={cn(className)}>
      <DropdownMenuTrigger className="w-full">
        <div className="flex flex row gap-2">
          <Globe />
          {getLocaleLabel(locale)}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-0 w-full">
        {LOCALES.map((item) => {
          const isActive = item.code === locale;
          return (
            <Button
              className={cn(
                'border-1 cursor-pointer',
                isActive ? 'bg-primary' : 'bg-background'
              )}
              onClick={() => switchLocale(item.code)}
              key={item.code}
            >
              {item.label}
            </Button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
