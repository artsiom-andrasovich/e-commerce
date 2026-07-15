import mongoose, { Schema, model, Document } from "mongoose";

export type TokenType = Document & {
  token: string;
  exp: Date;
  user: mongoose.Types.ObjectId;
  userAgent: string;
};

const TokensSchema = new Schema<TokenType>(
  {
    token: { type: String, required: true, unique: true },
    exp: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userAgent: { type: String, required: true },
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

const Token = model("Token", TokensSchema);
export { Token };
