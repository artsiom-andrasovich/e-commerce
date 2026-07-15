import {
  DELIVERY_METHODS,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  TOrder,
} from "@app/lib-shared-types";
import { model, Schema } from "mongoose";

const orderSchema = new Schema<TOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtPurchase: { type: Number, required: true, min: 0 },
        currencyAtPurchase: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "PENDING",
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: DELIVERY_METHODS,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    billingInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      street: { type: String, required: true },
    },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const { _id, ...rest } = ret;
        return rest;
      },
    },
  },
);

export const Order = model<TOrder>("Order", orderSchema);
