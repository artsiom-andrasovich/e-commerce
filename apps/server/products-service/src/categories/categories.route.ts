import { createCategoryDto, updateCategoryDto } from "@app/lib-shared-types";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { categoriesController } from "./categories.controller";

const router = Router();

router.get("/", categoriesController.getAllCategories);

router.post(
  "/",
  validateRequest({ body: createCategoryDto }),
  categoriesController.createCategory
);

router.put(
  "/",
  validateRequest({ body: updateCategoryDto }),
  categoriesController.updateCategory
);

router.delete(
  "/:categoryId",
  validateRequest({ params: z.object({ categoryId: z.string().min(1) }) }),
  categoriesController.deleteCategory
);

export { router };
