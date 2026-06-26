import { zodObjectIdSchema } from "@app/lib-shared-types";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { usersController } from "./users.controller";

const router = Router();

router.get(
  "/:userId",
  validateRequest({ params: z.object({ userId: zodObjectIdSchema }) }),
  usersController.getUser,
);

export { router };
