import { z } from "zod";
import { zodObjectIdSchema } from "../utils";

export const productSchema = z.object({
  id: zodObjectIdSchema,
  title: z.string(),
  price: z.number(),
  currency: z.string().optional(),
  description: z.string().optional(),
  categoryId: zodObjectIdSchema,
  imageKey: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TProduct = z.infer<typeof productSchema>;

export const productListItemSchema = productSchema.extend({
  imageKey: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type TProductListItem = z.infer<typeof productListItemSchema>;
