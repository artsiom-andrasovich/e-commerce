"use client";

import { useCart } from "@/hooks/useCart";
import { useCheckoutForm } from "./useCheckoutForm";
import { DeliveryMethodSection } from "./DeliveryMethodSection";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { DeliveryAddressSection } from "./DeliveryAddressSection";
import { OrderSummary } from "./OrderSummary";
import { useTranslations } from "next-intl";

export function CheckoutForm() {
  const { cart, isLoading } = useCart();
  const methods = useCheckoutForm();
  const t = useTranslations("Checkout");

  if (isLoading) return <div className="py-20 text-center text-gray-500">{t("loading")}</div>;
  if (!cart || cart.items.length === 0) return <div className="py-20 text-center text-gray-500">{t("empty")}</div>;

  return (
    <form onSubmit={methods.handleSubmit(methods.onSubmit)} className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 flex flex-col gap-10">
        <DeliveryMethodSection register={methods.register} />
        <PaymentMethodSection register={methods.register} />
        <DeliveryAddressSection 
          register={methods.register} 
          getFieldState={methods.getFieldState} 
          formState={methods.formState} 
        />
      </div>

      <OrderSummary cart={cart} formState={methods.formState} />
    </form>
  );
}
