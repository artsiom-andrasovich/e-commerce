import { addToCartDto, zodObjectIdSchema } from "@app/lib-shared-types";
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { cartController } from "./cart.controller";

const router = Router();

router.get("/", cartController.getCart);
router.post(
  "/",
  validateRequest({ body: addToCartDto }),
  cartController.addToCart,
);
router.put(
  "/",
  validateRequest({ body: addToCartDto }),
  cartController.updateCartItem,
);
router.delete(
  "/:productId",
  validateRequest({ params: z.object({ productId: zodObjectIdSchema }) }),
  cartController.removeFromCart,
);

export { router };
