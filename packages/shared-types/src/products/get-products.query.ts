import { z } from "zod";
import { zodObjectIdSchema } from "../utils";

export const getProductsQuery = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? 10 : parseInt(v, 10)))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
  categoryId: zodObjectIdSchema.optional(),
});

export type TGetProductsQuery = z.infer<typeof getProductsQuery>;
