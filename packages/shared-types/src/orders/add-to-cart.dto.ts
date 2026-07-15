import { z } from "zod";
import { zodObjectIdSchema } from "../utils";

export const addToCartDto = z.object({
  productId: zodObjectIdSchema,
  quantity: z.number().int().positive(),
});

export type TAddToCart = z.infer<typeof addToCartDto>;
