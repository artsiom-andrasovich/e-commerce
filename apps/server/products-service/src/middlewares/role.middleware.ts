import { TRole } from "@app/lib-shared-types";
import { ApiError } from "@utils";
import { NextFunction, Request, Response } from "express";

export const requireRole = (allowedRoles: TRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(ApiError.Forbidden("Access denied. No role provided."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.Forbidden("Access denied."));
    }

    next();
  };
};
