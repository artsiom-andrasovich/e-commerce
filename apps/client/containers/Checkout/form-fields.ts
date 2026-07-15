import { Path } from "react-hook-form";
import { CheckoutInput } from "./useCheckoutForm";

export type FieldConfig = {
  name: Path<CheckoutInput>;
  labelKey: string;
  type: string;
  placeholderKey: string;
  colSpan?: 1 | 2;
};

export const CHECKOUT_DELIVERY_METHODS = [
  { id: "COURIER", labelKey: "deliveryMethod.courier" },
  { id: "POST", labelKey: "deliveryMethod.post" },
  { id: "PICKUP", labelKey: "deliveryMethod.pickup" },
] as const;

export const CHECKOUT_PAYMENT_METHODS = [
  { id: "STRIPE", labelKey: "paymentMethod.stripe" },
  { id: "CASH", labelKey: "paymentMethod.cash" },
] as const;

export const CHECKOUT_ADDRESS_FIELDS: FieldConfig[] = [
  {
    name: "billingInfo.firstName",
    labelKey: "firstName.label",
    type: "text",
    placeholderKey: "firstName.placeholder",
    colSpan: 1,
  },
  {
    name: "billingInfo.lastName",
    labelKey: "lastName.label",
    type: "text",
    placeholderKey: "lastName.placeholder",
    colSpan: 1,
  },
  {
    name: "billingInfo.country",
    labelKey: "address.country.label",
    type: "text",
    placeholderKey: "address.country.placeholder",
    colSpan: 1,
  },
  {
    name: "billingInfo.city",
    labelKey: "address.city.label",
    type: "text",
    placeholderKey: "address.city.placeholder",
    colSpan: 1,
  },
  {
    name: "billingInfo.zipCode",
    labelKey: "address.zipCode.label",
    type: "text",
    placeholderKey: "address.zipCode.placeholder",
    colSpan: 1,
  },
  {
    name: "billingInfo.street",
    labelKey: "address.street.label",
    type: "text",
    placeholderKey: "address.street.placeholder",
    colSpan: 1,
  },
];
