import { z } from "zod";
import { productListItemSchema } from "./product.schema";

export const getProductsResponseSchema = z.object({
  data: z.array(productListItemSchema),
  nextCursor: z.string().nullable(),
});

export type TGetProductsResponse = z.infer<typeof getProductsResponseSchema>;
