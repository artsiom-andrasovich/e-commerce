import dotenv from "dotenv";
import { z } from "zod";
import { logger } from "./logger";

dotenv.config();

const envSchema = z.object({
  PRODUCTS_SERVICE_URL: z.url().default("http://localhost:3001"),
  API_GATEWAY_PORT: z
    .string()
    .refine(
      (port) => parseInt(port) > 0 && parseInt(port) < 65536,
      "Invalid port number",
    ),
  CLIENT_URL: z.url().default("http://localhost:5050"),
  UPLOADS_SERVICE_URL: z.url().default("http://localhost:3005"),
});

type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("Invalid environment variables:\n", parsed.error);
  process.exit(1);
}

export const env: Env = parsed.data;
