import dotenv from "dotenv";
import { z } from "zod";
import { logger } from "./logger";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .refine(
      (port) => parseInt(port) > 0 && parseInt(port) < 65536,
      "Invalid port number",
    ),
  AWS_ENDPOINT: z.string().min(1),
  AWS_S3_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET_NAME: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("Invalid environment variables:\n", parsed.error);
  process.exit(1);
}

export const env: Env = parsed.data;
