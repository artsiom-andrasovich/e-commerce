import { z } from "zod";
import { LocaleSchema } from "../locales";
import { zodObjectIdSchema } from "../utils/";

export const CategorySchema = z.object({
  id: zodObjectIdSchema,
  name: z.union([
    z.string(),
    z.record(LocaleSchema, z.string().min(1).max(30)),
  ]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
