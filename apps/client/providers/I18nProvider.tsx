import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { PropsWithChildren } from "react";

export interface I18nProviderProps {
  messages: AbstractIntlMessages;
  locale: string;
  timeZone: string;
}

export function I18nProvider({
  children,
  messages,
  locale,
  timeZone,
}: PropsWithChildren<I18nProviderProps>) {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}
