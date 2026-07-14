import { TJwtPayload } from "@app/lib-shared-types";
import { env } from "@configs";
import { ApiError } from "@utils";
import { NextFunction, Request, Response } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.Unauthorized();
    }

    const response = await fetch(`${env.USERS_SERVICE_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw ApiError.Unauthorized("Invalid or expired token");
    }

    const user = (await response.json()) as TJwtPayload;
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.Unauthorized("Authentication failed"));
    }
  }
}
