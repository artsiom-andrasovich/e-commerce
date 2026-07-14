"use client";

import { Button } from "@/components/Button";
import { useCart } from "@/hooks/useCart";
import { useTranslations } from "next-intl";

export function AddToCartButton({ productId }: { productId: string }) {
  const { cart, addToCart, updateQuantity, isLoading } = useCart();
  const t = useTranslations("ProductCard");

  const cartItem = cart?.items.find((item) => item.productId === productId);

  if (cartItem) {
    return (
      <div className="flex items-center gap-4 mt-2" suppressHydrationWarning>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            updateQuantity(productId, cartItem.quantity - 1);
          }}
          disabled={isLoading}
        >
          -
        </Button>
        <span>{cartItem.quantity}</span>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            updateQuantity(productId, cartItem.quantity + 1);
          }}
          disabled={isLoading}
        >
          +
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        addToCart(productId, 1);
      }}
      disabled={isLoading}
      className="w-full md:w-auto"
      suppressHydrationWarning
    >
      {t("addToCart")}
    </Button>
  );
}
