import { NextFunction, Request, Response } from "express";
import { usersService } from "./users.service";

class UsersController {
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
}

export const usersController = new UsersController();
