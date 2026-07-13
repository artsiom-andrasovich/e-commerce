import { Schema, model } from "mongoose";

const CategoriesSchema = new Schema(
  {
    name: {
      type: Map,
      of: String,
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

const Category = model("Category", CategoriesSchema);
export { Category };
