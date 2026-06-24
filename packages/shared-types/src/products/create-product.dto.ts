import { z } from "zod";
import { zodObjectIdSchema } from "../utils";
export const createProductDto = z.object({
  title: z.string().min(1).max(30),
  price: z.number().positive({ message: "Price must be positive" }),
  description: z.string().max(400).optional(),
  categoryId: zodObjectIdSchema,
  imageKey: z.array(z.string().max(100)).optional(),
});
export type TCreateProduct = z.infer<typeof createProductDto>;
