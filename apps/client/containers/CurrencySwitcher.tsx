"use client";

import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { useRouter } from "@/i18n";
import { setCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  TCurrencyCode,
} from "@app/lib-shared-types/src/currencies";
import { useState } from "react";
import { DropdownMenuContent, DropdownMenuTrigger } from "./DropdownMenu";

export function CurrencySwitcher({
  className,
  initialCurrency,
}: {
  className?: string;
  initialCurrency: TCurrencyCode;
}) {
  const [currency, setCurrency] = useState<TCurrencyCode>(initialCurrency);
  const router = useRouter();
  const currentSymbol =
    CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;

  const switchCurrency = async (newCurrency: TCurrencyCode) => {
    if (newCurrency !== currency) {
      setCurrency(newCurrency);
      await setCookie("currency", newCurrency);
      router.refresh();
    }
  };

  return (
    <Dropdown className={cn(className)}>
      <DropdownMenuTrigger className="w-full flex flex-row items-center gap-2">
        <span className="flex items-center justify-center w-6 font-bold">
          {currentSymbol}
        </span>
        <span>{currency}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-0 w-full min-w-[120px]">
        {CURRENCIES.map((item) => {
          const isActive = item.code === currency;
          return (
            <Button
              className={cn(
                "flex flex-row items-center border-1 cursor-pointer justify-start gap-2 w-full",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted",
              )}
              onClick={() => switchCurrency(item.code)}
              key={item.code}
            >
              <span className="flex items-center justify-center w-6 font-bold">
                {item.symbol}
              </span>
              <span>{item.code}</span>
            </Button>
          );
        })}
      </DropdownMenuContent>
    </Dropdown>
  );
}
