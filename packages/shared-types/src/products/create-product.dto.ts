import { z } from "zod";
//TODO: image ?
export const createProductDto = z.object({
  title: z.string().min(1).max(30),
  price: z.number().positive({ message: "Price must be positive" }),
  description: z.string().max(400).optional(),
});

export type TCreateProduct = z.infer<typeof createProductDto>;
