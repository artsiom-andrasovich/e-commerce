"use client";

import { PropsWithChildren } from "react";
import { I18nProvider, I18nProviderProps } from "./I18nProvider";

export function RootProvider({
  children,
  messages,
  locale,
  timeZone,
}: PropsWithChildren<I18nProviderProps>) {
  return (
    <I18nProvider messages={messages} locale={locale} timeZone={timeZone}>
      {children}
    </I18nProvider>
  );
}
