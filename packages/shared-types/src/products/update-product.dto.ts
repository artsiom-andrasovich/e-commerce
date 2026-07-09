import { z } from "zod";
import { LocaleSchema } from "../locales";
import { zodObjectIdSchema } from "../utils";

export const updateProductDto = z
  .object({
    title: z.record(LocaleSchema, z.string().min(1).max(30)).optional(),
    categoryId: zodObjectIdSchema.optional(),
    price: z
      .number()
      .positive({ message: "Price must be positive" })
      .optional(),
    description: z.record(LocaleSchema, z.string().max(400)).optional(),
  })
  .refine(
    ({ title, price, description, categoryId }) =>
      title !== undefined ||
      price !== undefined ||
      description !== undefined ||
      categoryId !== undefined,
    { message: "One of the fields must be defined" },
  );
export type TUpdateProduct = z.infer<typeof updateProductDto>;
