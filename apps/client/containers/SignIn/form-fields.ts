import { Path } from "react-hook-form";
import { SignInInput } from "./useSignInForm";

export type FieldConfig = {
  name: Path<SignInInput>;
  labelKey: string;
  type: string;
  placeholderKey: string;
  colSpan?: 1 | 2;
};

export const USER_FIELDS: FieldConfig[] = [
  {
    name: "email",
    labelKey: "email.label",
    type: "email",
    placeholderKey: "email.placeholder",
    colSpan: 2,
  },
  {
    name: "password",
    labelKey: "password.label",
    type: "password",
    placeholderKey: "password.placeholder",
    colSpan: 2,
  },
];
