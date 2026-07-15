import { ROLES, TRole } from "@app/lib-shared-types";
import mongoose, { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role: TRole;
  addresses: mongoose.Types.ObjectId[];
  tokens: mongoose.Types.ObjectId[];
}

const UsersSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    tokens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Token" }],
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
