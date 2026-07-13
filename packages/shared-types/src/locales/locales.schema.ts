import { z } from "zod";

export const LOCALES = ["en", "pl", "de"] as const;

export const LocaleSchema = z.enum(LOCALES);

export type TLocale = z.infer<typeof LocaleSchema>;
