"use client";

import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { getLocaleLabel, LOCALES } from "@/constants";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { DropdownMenuContent, DropdownMenuTrigger } from "./DropdownMenu";

export function LocaleSwitcher({ className }: { className?: string }) {
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
    <Dropdown className={cn(className)}>
      <DropdownMenuTrigger className="w-full flex flex-row row gap-2">
        <Globe />
        {getLocaleLabel(locale)}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-0 w-full">
        {LOCALES.map((item) => {
          const isActive = item.code === locale;
          return (
            <Button
              className={cn(
                "border-1 cursor-pointer",
                isActive ? "bg-primary" : "bg-background"
              )}
              onClick={() => switchLocale(item.code)}
              key={item.code}
            >
              {item.label}
            </Button>
          );
        })}
      </DropdownMenuContent>
    </Dropdown>
  );
}
