import mongoose, { Schema, model } from "mongoose";
const ProductsSchema = new Schema(
  {
    title: { type: Map, of: String, required: true },
    price: { type: Number, required: true },
    description: { type: Map, of: String, required: false },
    imageKeys: { type: [String], default: ["products/default.png"] },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        const { _id, ...rest } = ret;
        return rest;
      },
    },
  },
);
ProductsSchema.index({ title: "text", description: "text" });
const Product = model("Product", ProductsSchema);
export { Product };
