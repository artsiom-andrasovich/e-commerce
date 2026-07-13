import { z } from "zod";
import { LocaleSchema } from "../locales";

export const createCategoryDto = z.object({
  name: z.record(LocaleSchema, z.string().min(1).max(30)),
});

export type TCreateCategory = z.infer<typeof createCategoryDto>;
