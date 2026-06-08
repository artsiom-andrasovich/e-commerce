import { Schema, model } from "mongoose";

const CategoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 30,
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
