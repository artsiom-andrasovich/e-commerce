import { z } from "zod";

export const updateUserDto = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

export type TUpdateUser = z.infer<typeof updateUserDto>;
