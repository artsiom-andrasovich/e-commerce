import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const zodObjectIdSchema = z
  .string()
  .refine((objectId) => isValidObjectId(objectId), {
    message: "Invalid ObjectId",
  });
