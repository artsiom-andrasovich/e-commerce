import mongoose, { Schema, model } from "mongoose";
const ProductsSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    imageKey: { type: String, default: "products/default.png" },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
ProductsSchema.index(
  { title: "text", description: "text" },
  {
    weights: {
      title: 5,
      description: 2,
    },
  }
);
const Product = model("Product", ProductsSchema);
export { Product };
