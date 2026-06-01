import { z } from "zod";
export const createProductDto = z.object({
  title: z.string().min(1).max(30),
  price: z.number().positive({ message: "Price must be positive" }),
  description: z.string().max(400).optional(),
  categoryId: z.string().min(1).max(30),
  imageKey: z.string().max(100).optional(),
});
export type TCreateProduct = z.infer<typeof createProductDto>;
