import {
  createCategoryDto,
  getCategoriesQuery,
  updateCategoryDto,
  zodObjectIdSchema,
} from "@app/lib-shared-types";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { categoriesController } from "./categories.controller";

const router = Router();

router.get(
  "/",
  validateRequest({ query: getCategoriesQuery }),
  categoriesController.getCategories,
);

router.post(
  "/",
  validateRequest({ body: createCategoryDto }),
  categoriesController.createCategory,
);

router.put(
  "/:categoryId",
  validateRequest({
    params: z.object({ categoryId: zodObjectIdSchema }),
    body: updateCategoryDto,
  }),
  categoriesController.updateCategory,
);

router.delete(
  "/:categoryId",
  validateRequest({ params: z.object({ categoryId: zodObjectIdSchema }) }),
  categoriesController.deleteCategory,
);

export { router };
