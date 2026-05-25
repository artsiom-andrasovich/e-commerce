import { z } from 'zod';

export const createCategoryDto = z.object({
  name: z.string().min(1).max(30),
});

export type TCreateCategory = z.infer<typeof createCategoryDto>;
