import { z } from "zod";
import { zodObjectIdSchema } from "../utils/";

export const CategorySchema = z.object({
  id: zodObjectIdSchema,
  name: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TCategory = z.infer<typeof CategorySchema>;
