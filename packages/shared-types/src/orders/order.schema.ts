import { z } from "zod";
import { productListItemSchema } from "../products";
import { createAddressDto } from "../users";
import { zodObjectIdSchema } from "../utils";

export const DELIVERY_METHODS = ["COURIER", "POST", "PICKUP"] as const;
export const deliveryMethodSchema = z.enum(DELIVERY_METHODS);
export type TDeliveryMethod = z.infer<typeof deliveryMethodSchema>;

export const PAYMENT_METHODS = ["STRIPE", "CASH"] as const;
export const paymentMethodSchema = z.enum(PAYMENT_METHODS);
export type TPaymentMethod = z.infer<typeof paymentMethodSchema>;

export const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export const orderStatusSchema = z.enum(ORDER_STATUSES);
export type TOrderStatus = z.infer<typeof orderStatusSchema>;

export const billingInfoSchema = createAddressDto
  .omit({ isDefault: true })
  .extend({
    firstName: z.string().min(1).max(30),
    lastName: z.string().min(1).max(40),
  });
export type TBillingInfo = z.infer<typeof billingInfoSchema>;

export const orderItemSchema = z.object({
  productId: zodObjectIdSchema,
  quantity: z.number().int().min(1),
  priceAtPurchase: z.number().min(0),
  currencyAtPurchase: z.string(),
  product: productListItemSchema.optional(),
});
export type TOrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: zodObjectIdSchema,
  userId: zodObjectIdSchema,
  items: z.array(orderItemSchema),
  totalAmount: z.number().min(0),
  currency: z.string(),
  status: orderStatusSchema,
  deliveryMethod: deliveryMethodSchema,
  paymentMethod: paymentMethodSchema,
  billingInfo: billingInfoSchema,
  stripeSessionId: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TOrder = z.infer<typeof orderSchema>;
