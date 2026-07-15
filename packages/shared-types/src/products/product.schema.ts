import { z } from "zod";
import { zodObjectIdSchema, imageKeySchema } from "../utils";

export const productSchema = z.object({
  id: zodObjectIdSchema,
  title: z.string(),
  price: z.number(),
  currency: z.string().optional(),
  description: z.string().optional(),
  categoryId: zodObjectIdSchema,
  imageKeys: z.array(imageKeySchema).optional(),
  imageUrls: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TProduct = z.infer<typeof productSchema>;

export const productListItemSchema = productSchema.omit({ imageKeys: true }).extend({
  imageKey: imageKeySchema.nullable().optional(),
  imageUrl: z.string().optional(),
});

export type TProductListItem = z.infer<typeof productListItemSchema>;
