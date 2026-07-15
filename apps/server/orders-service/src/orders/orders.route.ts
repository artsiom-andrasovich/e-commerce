import { createOrderDto } from "@app/lib-shared-types";
import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { ordersController } from "./orders.controller";

const router = Router();

router.post(
  "/",
  validateRequest({ body: createOrderDto }),
  ordersController.createOrder,
);
router.get("/my-orders", ordersController.getMyOrders);

export { router };
