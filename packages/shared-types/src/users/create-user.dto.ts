import { z } from "zod";
import { zodEmailSchema, zodPasswordSchema } from "../utils";

export const createAddressDto = z.object({
  country: z.string().min(1).max(30),
  city: z.string().min(1).max(80),
  street: z.string().min(1).max(80),
  zipCode: z.string().min(1).max(10),
  isDefault: z.boolean().optional().default(false),
});

export const createUserDto = z.object({
  email: zodEmailSchema,
  password: zodPasswordSchema,
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  address: createAddressDto.optional(),
});

export type TCreateAddress = z.infer<typeof createAddressDto>;
export type TCreateUser = z.infer<typeof createUserDto>;
