import { z } from "zod";

export const generateUploadUrlDto = z.object({
  filename: z.string().min(1).max(50),
  folder: z.string().min(1).max(50),
  contentType: z.string().min(1).max(100),
});

export type TGenerateUploadUrl = z.infer<typeof generateUploadUrlDto>;
