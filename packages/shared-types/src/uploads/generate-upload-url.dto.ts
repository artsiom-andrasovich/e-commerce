import { z } from "zod";

export const allowedUploadEntities = ["products", "categories", "users"] as const;
export type TUploadEntity = (typeof allowedUploadEntities)[number];

export const generateUploadUrlDto = z.object({
  filename: z.string().min(1).max(50),
  entity: z.enum(allowedUploadEntities),
  contentType: z.string().min(1).max(100),
});

export type TGenerateUploadUrl = z.infer<typeof generateUploadUrlDto>;
