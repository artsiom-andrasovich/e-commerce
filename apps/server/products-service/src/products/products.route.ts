import { createProductDto, updateProductDto } from "@app/lib-shared-types";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { productsController } from "./products.controller";

const router = Router();

router.get("/", productsController.getProducts);

router.get("/:productId", productsController.getProduct);

router.post(
  "/",
  validateRequest({ body: createProductDto }),
  productsController.createProduct
);

router.patch(
  "/",
  validateRequest({ body: updateProductDto }),
  productsController.updateProduct
);

router.delete(
  "/:productId",
  validateRequest({ params: z.object({ productId: z.string().min(1) }) }),
  productsController.deleteProduct
);

export { router };
