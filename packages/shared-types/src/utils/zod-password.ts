import { z } from "zod";

export const zodPasswordSchema = z.string().min(8).max(70);
