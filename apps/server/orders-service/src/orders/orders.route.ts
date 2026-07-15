import { createOrderDto, zodObjectIdSchema } from "@app/lib-shared-types";
import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { ordersController } from "./orders.controller";

const router = Router();

router.post(
  "/",
  validateRequest({ body: createOrderDto }),
  ordersController.createOrder,
);
router.get("/my-orders", ordersController.getMyOrders);
router.get(
  "/:orderId",
  validateRequest({
    params: z.object({
      orderId: zodObjectIdSchema,
    }),
  }),
  ordersController.getOrderById,
);

export { router };
