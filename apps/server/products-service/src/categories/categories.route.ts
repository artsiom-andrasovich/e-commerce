import {
  createCategoryDto,
  getCategoriesQuery,
  updateCategoryDto,
  zodObjectIdSchema,
  ROLES,
} from "@app/lib-shared-types";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware, requireRole } from "@middlewares";
import { categoriesController } from "./categories.controller";

const router = Router();

router.get(
  "/",
  validateRequest({ query: getCategoriesQuery }),
  categoriesController.getCategories,
);

router.post(
  "/",
  authMiddleware,
  requireRole([ROLES.ADMIN]),
  validateRequest({ body: createCategoryDto }),
  categoriesController.createCategory,
);

router.put(
  "/:categoryId",
  authMiddleware,
  requireRole([ROLES.ADMIN]),
  validateRequest({
    params: z.object({ categoryId: zodObjectIdSchema }),
    body: updateCategoryDto,
  }),
  categoriesController.updateCategory,
);

router.delete(
  "/:categoryId",
  authMiddleware,
  requireRole([ROLES.ADMIN]),
  validateRequest({ params: z.object({ categoryId: zodObjectIdSchema }) }),
  categoriesController.deleteCategory,
);

export { router };
