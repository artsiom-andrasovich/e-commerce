import {
  createProductDto,
  getProductsQuery,
  updateProductDto,
  zodObjectIdSchema,
  ROLES,
} from "@app/lib-shared-types";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { productsController } from "./products.controller";
import { authMiddleware, requireRole } from "@middlewares";

const router = Router();

router.get(
  "/",
  validateRequest({ query: getProductsQuery }),
  productsController.getProducts,
);

router.get(
  "/:productId",
  validateRequest({ params: z.object({ productId: zodObjectIdSchema }) }),
  productsController.getProduct,
);

router.post(
  "/",
  authMiddleware,
  requireRole([ROLES.ADMIN]),
  validateRequest({ body: createProductDto }),
  productsController.createProduct,
);

router.patch(
  "/:productId",
  authMiddleware,
  requireRole([ROLES.ADMIN]),
  validateRequest({
    params: z.object({ productId: zodObjectIdSchema }),
    body: updateProductDto,
  }),
  productsController.updateProduct,
);

router.delete(
  "/:productId",
  authMiddleware,
  requireRole([ROLES.ADMIN]),
  validateRequest({ params: z.object({ productId: zodObjectIdSchema }) }),
  productsController.deleteProduct,
);

export { router };
