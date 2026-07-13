import { z } from "zod";

export const getBatchAccessUrlsDto = z.object({
  keys: z.array(z.string().min(1).max(50)).max(100),
});

export type TGetBatchAccessUrlsDto = z.infer<typeof getBatchAccessUrlsDto>;
