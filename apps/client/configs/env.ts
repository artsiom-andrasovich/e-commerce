import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_UPLOADS_URL: z.url(),
});

type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_UPLOADS_URL: process.env.NEXT_PUBLIC_UPLOADS_URL,
});

if (!parsed.success) {
  console.error("Invalid environment variables:\n", parsed.error);
  throw new Error("Invalid environment variables");
}

export const env: Env = parsed.data;
