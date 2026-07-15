import { z } from "zod";
import {
  billingInfoSchema,
  deliveryMethodSchema,
  paymentMethodSchema,
} from "./order.schema";

export const createOrderDto = z.object({
  deliveryMethod: deliveryMethodSchema,
  paymentMethod: paymentMethodSchema,
  billingInfo: billingInfoSchema,
});

export type TCreateOrder = z.infer<typeof createOrderDto>;
