import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const zodObjectIdSchema = z
  .string()
  .regex(objectIdRegex, {
    message: "Invalid ObjectId",
  });
