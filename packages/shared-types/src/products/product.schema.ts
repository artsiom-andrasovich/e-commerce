import { z } from "zod";
import { zodObjectIdSchema } from "../utils";

export const productSchema = z.object({
  id: zodObjectIdSchema,
  title: z.string(),
  price: z.number(),
  currency: z.string().optional(),
  description: z.string().optional(),
  categoryId: zodObjectIdSchema,
  imageKey: z.string().optional(),
  imageUrl: z.url().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TProduct = z.infer<typeof productSchema>;
