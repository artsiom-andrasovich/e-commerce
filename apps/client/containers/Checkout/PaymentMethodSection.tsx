"use client";

import { UseFormRegister } from "react-hook-form";
import { CheckoutInput } from "./useCheckoutForm";
import { CHECKOUT_PAYMENT_METHODS } from "./form-fields";
import { useTranslations } from "next-intl";

export function PaymentMethodSection({ register }: { register: UseFormRegister<CheckoutInput> }) {
  const tForms = useTranslations("Forms");
  const tCheckout = useTranslations("Checkout");
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">{tCheckout("paymentMethod")}</h2>
      <div className="flex flex-col gap-2">
        {CHECKOUT_PAYMENT_METHODS.map((method) => (
          <label key={method.id} className="flex items-center gap-2">
            <input 
              type="radio" 
              value={method.id} 
              {...register("paymentMethod")} 
            />
            <span>{tForms(method.labelKey)}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
