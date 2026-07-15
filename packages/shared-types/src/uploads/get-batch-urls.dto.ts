import { z } from "zod";
import { imageKeySchema } from "../utils";

export const getBatchAccessUrlsDto = z.object({
  keys: z.array(imageKeySchema).max(100),
});

export type TGetBatchAccessUrlsDto = z.infer<typeof getBatchAccessUrlsDto>;
