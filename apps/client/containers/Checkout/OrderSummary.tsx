"use client";

import { Button } from "@/components/Button";
import { TCart } from "@app/lib-shared-types";
import { useLocale, useTranslations } from "next-intl";
import { FormState } from "react-hook-form";
import { CheckoutInput } from "./useCheckoutForm";

export function OrderSummary({
  cart,
  formState,
}: {
  cart: TCart;
  formState: FormState<CheckoutInput>;
}) {
  const t = useTranslations("Checkout");
  const locale = useLocale();

  const currencyCode =
    cart.items.length > 0 && cart.items[0].product?.currency
      ? cart.items[0].product.currency
      : "USD";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(price);
  };

  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0,
  );

  return (
    <div className="lg:w-96 shrink-0">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">{t("orderSummary")}</h2>

        <div className="flex max-h-[40vh] flex-col gap-4 overflow-y-auto">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              {item.product?.imageUrl && (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title as string}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium line-clamp-2">
                  {item.product?.title || t("product")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("qty")} {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                {item.product?.price
                  ? formatPrice(item.product.price * item.quantity)
                  : ""}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between">
            <p>{t("subtotal")}</p>
            <p>{formatPrice(subtotal)}</p>
          </div>
          <div className="flex justify-between">
            <p>{t("shipping")}</p>
            <p className="text-gray-500">{t("calculatedLater")}</p>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2 text-xl font-bold">
            <p>{t("total")}</p>
            <p>{formatPrice(subtotal)}</p>
          </div>
        </div>

        {formState.errors.root && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {formState.errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full"
        >
          {formState.isSubmitting ? t("processing") : t("placeOrder")}
        </Button>
      </div>
    </div>
  );
}
