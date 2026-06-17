import { z } from "zod";
export const updateProductDto = z
  .object({
    title: z.string().min(1).max(30).optional(),
    categoryId: z.string().max(30).optional(),
    price: z
      .number()
      .positive({ message: "Price must be positive" })
      .optional(),
    description: z.string().max(400).optional(),
  })
  .refine(
    ({ title, price, description, categoryId }) =>
      title !== undefined ||
      price !== undefined ||
      description !== undefined ||
      categoryId !== undefined,
    { message: "One of the fields must be defined" },
  );
export type TUpdateProduct = z.infer<typeof updateProductDto>;
