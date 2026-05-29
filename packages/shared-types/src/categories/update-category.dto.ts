import { z } from "zod";

export const updateCategoryDto = z.object({
  _id: z.string().min(1),
  newName: z.string().min(1).max(30),
});

export type TUpdateCategory = z.infer<typeof updateCategoryDto>;
