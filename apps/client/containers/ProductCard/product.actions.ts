"use server";

import { env } from "@/configs";
import { TProduct, productSchema } from "@app/lib-shared-types";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

export async function fetchProductById(productId: string): Promise<TProduct> {
  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const locale = await getLocale();
  const currencyCookie = (await cookies()).get("currency");
  const currency = currencyCookie?.value || "USD";

  try {
    const url = new URL(`${API_URL}/api/products/${productId}`);
    url.searchParams.append("lang", locale);
    url.searchParams.append("currency", currency);

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("Cannot fetch product");

    const data = await response.json();
    return productSchema.parse(data);
  } catch (error) {
    console.error("Fetch product error:", error);
    throw new Error("Cannot fetch product");
  }
}
