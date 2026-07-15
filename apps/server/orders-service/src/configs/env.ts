import dotenv from "dotenv";
import { z } from "zod";
import { logger } from "./logger";

dotenv.config();

const envSchema = z.object({
  MONGO_USER: z.string().min(1),
  MONGO_PASSWORD: z.string().min(1),
  APP_NAME: z.string().min(1).default("orders-service"),
  STRIPE_SECRET_KEY: z.string().min(1),
  PORT: z
    .string()
    .refine(
      (port) => parseInt(port) > 0 && parseInt(port) < 65536,
      "Invalid port number",
    ),
  MONGO_URL: z.url(),
  CLIENT_URL: z.url().default("http://localhost:5050"),
  USERS_SERVICE_URL: z.url().default("http://localhost:3003"),
  UPLOADS_SERVICE_URL: z.url().default("http://localhost:3005"),
  PRODUCTS_SERVICE_URL: z.url().default("http://localhost:3001"),
  SMTP_HOST: z.string().min(1).default("smtp.gmail.com"),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("Invalid environment variables:\n", parsed.error);
  process.exit(1);
}

export const env: Env = parsed.data;
