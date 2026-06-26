import mongoose, { Schema, model } from "mongoose";

const AddressSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
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

const Address = model("Address", AddressSchema);
export { Address };

