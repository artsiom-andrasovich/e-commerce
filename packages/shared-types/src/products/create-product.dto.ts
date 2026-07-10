import { z } from "zod";
import { LocaleSchema } from "../locales";
import { zodObjectIdSchema } from "../utils";
export const createProductDto = z.object({
  title: z.record(LocaleSchema, z.string().min(1).max(30)),
  price: z.number().positive({ message: "Price must be positive" }),
  description: z.record(LocaleSchema, z.string().max(400)).optional(),
  categoryId: zodObjectIdSchema,
  imageKey: z.string().max(100).optional(),
});
export type TCreateProduct = z.infer<typeof createProductDto>;
