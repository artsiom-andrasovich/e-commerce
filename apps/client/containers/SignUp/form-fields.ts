import { Path } from "react-hook-form";
import { SignUpInput } from "./useSignUpForm";

export type FieldConfig = {
  name: Path<SignUpInput>;
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
  {
    name: "firstName",
    labelKey: "firstName.label",
    type: "text",
    placeholderKey: "firstName.placeholder",
    colSpan: 1,
  },
  {
    name: "lastName",
    labelKey: "lastName.label",
    type: "text",
    placeholderKey: "lastName.placeholder",
    colSpan: 1,
  },
];

export const ADDRESS_FIELDS: FieldConfig[] = [
  {
    name: "address.country",
    labelKey: "address.country.label",
    type: "text",
    placeholderKey: "address.country.placeholder",
    colSpan: 2,
  },
  {
    name: "address.city",
    labelKey: "address.city.label",
    type: "text",
    placeholderKey: "address.city.placeholder",
    colSpan: 1,
  },
  {
    name: "address.zipCode",
    labelKey: "address.zipCode.label",
    type: "text",
    placeholderKey: "address.zipCode.placeholder",
    colSpan: 1,
  },
  {
    name: "address.street",
    labelKey: "address.street.label",
    type: "text",
    placeholderKey: "address.street.placeholder",
    colSpan: 2,
  },
];
