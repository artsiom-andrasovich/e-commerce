"use server";

import { env } from "@/configs";
import { TAddToCart, TCart } from "@app/lib-shared-types";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

export async function fetchCart(): Promise<TCart | null> {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken") && !cookieStore.get("refreshToken")) {
    return null;
  }

  try {
    const locale = await getLocale();
    const currencyCookie = cookieStore.get("currency");
    const currency = currencyCookie?.value || "USD";
    const params = new URLSearchParams({ lang: locale, currency });
    const res = await fetchWithAuth(`${env.NEXT_PUBLIC_API_URL}/api/cart?${params}`, {
      method: "GET",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function addToCartAction(data: TAddToCart): Promise<TCart> {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken") && !cookieStore.get("refreshToken")) {
    throw new Error("Unauthorized");
  }

  const res = await fetchWithAuth(`${env.NEXT_PUBLIC_API_URL}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to add to cart");
  }

  return res.json();
}

export async function updateCartItemAction(data: TAddToCart): Promise<TCart> {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken") && !cookieStore.get("refreshToken")) {
    throw new Error("Unauthorized");
  }

  const res = await fetchWithAuth(`${env.NEXT_PUBLIC_API_URL}/api/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to update cart item");
  }

  return res.json();
}

export async function removeFromCartAction(productId: string): Promise<TCart> {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken") && !cookieStore.get("refreshToken")) {
    throw new Error("Unauthorized");
  }

  const res = await fetchWithAuth(
    `${env.NEXT_PUBLIC_API_URL}/api/cart/${productId}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to remove from cart");
  }

  return res.json();
}
