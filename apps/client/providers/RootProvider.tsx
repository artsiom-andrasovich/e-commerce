"use client";

import { PropsWithChildren } from "react";
import { I18nProvider, I18nProviderProps } from "./I18nProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";

export function RootProvider({
  children,
  messages,
  locale,
  timeZone,
}: PropsWithChildren<I18nProviderProps>) {
  return (
    <I18nProvider messages={messages} locale={locale} timeZone={timeZone}>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </I18nProvider>
  );
}
