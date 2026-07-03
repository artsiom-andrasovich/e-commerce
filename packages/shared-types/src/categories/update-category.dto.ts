import { z } from "zod";
import { LocaleSchema } from "../locales";

export const updateCategoryDto = z.object({
  name: z.record(LocaleSchema, z.string().min(1).max(30)),
});

export type TUpdateCategory = z.infer<typeof updateCategoryDto>;
