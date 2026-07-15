import { z } from "zod";

export const imageKeySchema = z.string().min(1).max(100);
