import { z } from "zod";
import { CategorySchema } from "./category.schema";

export const GetCategoriesResponseSchema = z.object({
  data: z.array(CategorySchema),
  nextCursor: z.string().nullable(),
});

export type TGetCategoriesResponse = z.infer<typeof GetCategoriesResponseSchema>;
