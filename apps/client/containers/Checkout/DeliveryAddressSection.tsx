"use client";

import { Input } from "@/components/Input";
import { useTranslations } from "next-intl";
import { UseFormGetFieldState, UseFormRegister, FormState } from "react-hook-form";
import { CHECKOUT_ADDRESS_FIELDS, FieldConfig } from "./form-fields";
import { CheckoutInput } from "./useCheckoutForm";

interface DeliveryAddressProps {
  register: UseFormRegister<CheckoutInput>;
  getFieldState: UseFormGetFieldState<CheckoutInput>;
  formState: FormState<CheckoutInput>;
}

export function DeliveryAddressSection({ register, getFieldState, formState }: DeliveryAddressProps) {
  const tForms = useTranslations("Forms");
  const tCheckout = useTranslations("Checkout");

  const renderField = (field: FieldConfig) => {
    const { error } = getFieldState(field.name, formState);
    return (
      <div
        key={field.name}
        className={`flex flex-col gap-1 ${field.colSpan === 2 ? "md:col-span-2" : "col-span-1"}`}
      >
        <label className="text-sm font-medium">
          {tForms(field.labelKey as string)}
        </label>
        <Input
          type={field.type}
          placeholder={tForms(field.placeholderKey as string)}
          {...register(field.name)}
        />
        {error && <span className="text-red-500 text-xs">{error.message}</span>}
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">{tCheckout("deliveryAddress")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHECKOUT_ADDRESS_FIELDS.map(renderField)}
      </div>
    </section>
  );
}
