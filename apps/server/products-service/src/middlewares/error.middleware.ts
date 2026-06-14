import { logger } from "@configs";
import { ApiError } from "@utils";
import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({ message: "Internal server error" });
}
