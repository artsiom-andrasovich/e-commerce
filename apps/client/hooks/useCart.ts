import {
  addToCartAction,
  fetchCart,
  removeFromCartAction,
  updateCartItemAction,
} from "@/containers/Cart/cart.actions";
import { TCart } from "@app/lib-shared-types";
import { useCallback, useEffect, useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState<TCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const updatedCart = await addToCartAction({ productId, quantity });
      setCart(updatedCart);
    } catch (e: any) {
      console.error(e);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const updatedCart = await removeFromCartAction(productId);
      setCart(updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      const updatedCart = await updateCartItemAction({ productId, quantity });
      setCart(updatedCart);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    loadCart,
  };
};
