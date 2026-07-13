"use client";
import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { ShoppingBasket, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { DropdownMenuContent, DropdownMenuTrigger } from "./DropdownMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { TCurrencyCode } from "@app/lib-shared-types";

export function UserDropdown({ initialCurrency }: { initialCurrency: TCurrencyCode }) {
  const t = useTranslations("UserDropdown");
  return (
    <Dropdown>
      <DropdownMenuTrigger className="rounded-full border-[2px] flex items-center justify-center h-12 w-12 border-foreground text-foreground p-0">
        <User className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border-2 p-2 right-0 ">
        <Button variant="ghost" className="flex flex-row gap-2 ">
          <ShoppingBasket />
          {t("cart")}
        </Button>
        <LocaleSwitcher className="w-full" />
        <CurrencySwitcher className="w-full mt-2" initialCurrency={initialCurrency} />
      </DropdownMenuContent>
    </Dropdown>
  );
}
