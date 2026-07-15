export const APP_NAME = 'e-commerce' as const;
export const DEFAULT_CURRENCY = 'USD' as const;


export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'German' },
  { code: 'pl', label: 'Polish' },
] as const;

export const getLocaleLabel = (code: string) => {
  const foundLocale = LOCALES.find((item) => item.code === code);
  return foundLocale ? foundLocale.label : code;
};
