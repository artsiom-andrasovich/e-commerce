import { z } from "zod";

export const zodEmailSchema = z.email().min(1).max(90);
