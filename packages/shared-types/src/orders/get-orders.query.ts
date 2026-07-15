import { z } from "zod";

export const getOrdersQuery = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? 10 : parseInt(v, 10)))
    .pipe(z.number().int().min(1).max(100)),
  page: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? 1 : parseInt(v, 10)))
    .pipe(z.number().int().min(1)),
});

export type TGetOrdersQuery = z.infer<typeof getOrdersQuery>;
