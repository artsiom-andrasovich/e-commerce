import { TCart } from "@app/lib-shared-types";
import { model, Schema } from "mongoose";

const cartSchema = new Schema<TCart>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
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

export const Cart = model<TCart>("Cart", cartSchema);
