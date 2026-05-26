'use client';
import { Button } from '@/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu/';
import { ShoppingBasket, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';

export function UserDropdown() {
  const t = useTranslations('UserDropdown');
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="rounded-full border-[2px] border- flex items-center justify-center h-12 w-12 border-foreground text-foreground ">
            <User className="h-8 w-8" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-background border-2 p-2 right-0 ">
          <Button variant="ghost" className="flex flex-row gap-2 ">
            <ShoppingBasket />
            {t('cart')}
          </Button>
          <LocaleSwitcher className="w-full" />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
