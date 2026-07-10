import { z } from "zod";
import { zodObjectIdSchema } from "../utils";

export const getProductsQuery = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? 10 : parseInt(v, 10)))
    .pipe(z.number().int().min(1).max(100)),
  cursor: zodObjectIdSchema.optional(),
  categoryId: zodObjectIdSchema.optional(),
  search: z.string().optional(),
  lang: z.string().optional(),
  currency: z.string().optional(),
});

export type TGetProductsQuery = z.infer<typeof getProductsQuery>;
