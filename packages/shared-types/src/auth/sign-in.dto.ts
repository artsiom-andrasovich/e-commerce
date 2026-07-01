import { z } from "zod";
import { zodEmailSchema, zodPasswordSchema } from "../utils";

export const signInDto = z.object({
  email: zodEmailSchema,
  password: zodPasswordSchema,
});

export type TSignIn = z.infer<typeof signInDto>;
