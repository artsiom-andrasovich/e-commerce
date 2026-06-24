import { z } from "zod";

export const getSignedUrlsDto = z.object({
  urls: z.array(z.string().min(1).max(100)),
});

export type TGetSignedUrlsDto = z.infer<typeof getSignedUrlsDto>;
