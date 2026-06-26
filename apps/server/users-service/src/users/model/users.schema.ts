import mongoose, { Schema, model } from "mongoose";

const UsersSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
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



const User = model("User", UsersSchema);
export { User };
