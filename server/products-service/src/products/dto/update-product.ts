import { z } from 'zod';
//TODO: image ?
export const updateProductDto = z
  .object({
    _id: z.string().min(1),
    title: z.string().min(1).max(30).optional(),
    price: z
      .number()
      .positive({ message: 'Price must be positive' })
      .optional(),
    description: z.string().max(400).optional(),
  })
  .refine(
    ({ title, price, description }) =>
      title !== undefined || price !== undefined || description !== undefined,
    { message: 'One of the fields must be defined' }
  );
export type TUpdateProduct = z.infer<typeof updateProductDto>;
