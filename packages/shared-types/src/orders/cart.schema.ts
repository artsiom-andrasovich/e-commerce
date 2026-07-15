import { z } from "zod";
import { productListItemSchema } from "../products";
import { zodObjectIdSchema } from "../utils";

export const cartItemSchema = z.object({
  productId: zodObjectIdSchema,
  quantity: z.number().int().positive(),
  product: productListItemSchema.optional(),
});

export type TCartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  id: zodObjectIdSchema,
  userId: zodObjectIdSchema,
  items: z.array(cartItemSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TCart = z.infer<typeof cartSchema>;
