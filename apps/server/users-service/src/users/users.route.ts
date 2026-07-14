import { updateUserDto, zodObjectIdSchema } from "@app/lib-shared-types";
import { authMiddleware } from "@middlewares";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { usersController } from "./users.controller";

const router = Router();

router.get("/me", authMiddleware, usersController.getMe);

router.get(
  "/:userId",
  validateRequest({ params: z.object({ userId: zodObjectIdSchema }) }),
  usersController.getUser,
);

router.patch(
  "/:userId",
  authMiddleware,
  validateRequest({
    params: z.object({ userId: zodObjectIdSchema }),
    body: updateUserDto,
  }),
  usersController.updateUser,
);

router.delete(
  "/:userId",
  authMiddleware,
  validateRequest({ params: z.object({ userId: zodObjectIdSchema }) }),
  usersController.deleteUser,
);

export { router };
