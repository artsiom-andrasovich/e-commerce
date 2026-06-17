import { z } from "zod";
import { productSchema } from "./product.schema";

export const getProductsResponseSchema = z.object({
  data: z.array(productSchema),
  nextCursor: z.string().nullable(),
});

export type TGetProductsResponse = z.infer<typeof getProductsResponseSchema>;
