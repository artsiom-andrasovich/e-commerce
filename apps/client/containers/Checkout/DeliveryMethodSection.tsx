"use client";

import { UseFormRegister } from "react-hook-form";
import { CheckoutInput } from "./useCheckoutForm";
import { CHECKOUT_DELIVERY_METHODS } from "./form-fields";
import { useTranslations } from "next-intl";

export function DeliveryMethodSection({ register }: { register: UseFormRegister<CheckoutInput> }) {
  const tForms = useTranslations("Forms");
  const tCheckout = useTranslations("Checkout");
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">{tCheckout("deliveryMethod")}</h2>
      <div className="flex flex-col gap-2">
        {CHECKOUT_DELIVERY_METHODS.map((method) => (
          <label key={method.id} className="flex items-center gap-2">
            <input 
              type="radio" 
              value={method.id} 
              {...register("deliveryMethod")} 
            />
            <span>{tForms(method.labelKey)}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
