import { z } from "zod";

export const updateCategoryDto = z.object({
  name: z.string().min(1).max(30),
});

export type TUpdateCategory = z.infer<typeof updateCategoryDto>;
