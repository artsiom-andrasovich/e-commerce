import { TJwtPayload } from "@app/lib-shared-types";
import { env } from "@configs";
import { ApiError } from "@utils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.Unauthorized();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw ApiError.Unauthorized();
    }
    const secret = env.JWT_ACCESS_SECRET;
    const decoded = jwt.verify(token, secret) as TJwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    next(ApiError.Unauthorized("Invalid or expired token"));
  }
}
