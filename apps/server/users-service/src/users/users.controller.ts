import { TUpdateUser } from "@app/lib-shared-types";
import { ApiError } from "@utils";
import { NextFunction, Request, Response } from "express";
import { usersService } from "./users.service";

class UsersController {
  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.findById(req.user!.id);
      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async getUser(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.params;
      const user = await usersService.findById(userId);
      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateUser(
    req: Request<{ userId: string }, any, TUpdateUser>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.params;
      if (req.user?.id !== userId) {
        throw ApiError.Forbidden();
      }
      
      const dto = req.body;
      const updatedUser = await usersService.updateUserData(userId, dto);
      return res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  public async deleteUser(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.params;
      if (req.user?.id !== userId) {
        throw ApiError.Forbidden();
      }

      await usersService.delete(userId);
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const usersController = new UsersController();
