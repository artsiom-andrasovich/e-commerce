import { z } from "zod";

export const getCategoriesQuery = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? 10 : parseInt(v, 10)))
    .pipe(z.number().int().min(1).max(100)),
  cursor: z.string().optional(),
});

export type TGetCategoriesQuery = z.infer<typeof getCategoriesQuery>;
