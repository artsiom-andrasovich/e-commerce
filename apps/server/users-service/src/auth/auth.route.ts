import { createUserDto, signInDto } from "@app/lib-shared-types";
import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "@middlewares";
import { authController } from "./auth.controller";

const router = Router();

router.post("/sign-up", validateRequest({ body: createUserDto }), authController.signUp);

router.post("/sign-in", validateRequest({ body: signInDto }), authController.signIn);

router.post("/sign-out", authController.signOut);

router.post("/refresh", authController.refreshTokens);

router.get("/verify", authMiddleware, authController.verify);

export { router };
