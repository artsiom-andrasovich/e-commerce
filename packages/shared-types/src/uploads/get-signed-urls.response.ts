import { z } from "zod";
export const getSignedUrlsResponseSchema = z.object({
  urls: z.array(z.string()),
});
export type TGetSignedUrlsResponse = z.infer<
  typeof getSignedUrlsResponseSchema
>;
