"use server";

import { env } from "@/configs";
import {
  getProductsResponseSchema,
  TGetProductsResponse,
} from "@app/lib-shared-types";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

import { DEFAULT_CURRENCY } from "@/constants";

export async function fetchProducts(
  categoryId?: string | null,
  search?: string | null,
  cursor?: string,
): Promise<TGetProductsResponse> {
  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const limit = 10;
  const locale = await getLocale();
  const currencyCookie = (await cookies()).get("currency");
  const currency = currencyCookie?.value || DEFAULT_CURRENCY;

  try {
    const url = new URL(`${API_URL}/api/products`);
    url.searchParams.append("limit", limit.toString());

    if (categoryId) {
      url.searchParams.append("categoryId", categoryId);
    }
    if (search) {
      url.searchParams.append("search", search);
    }
    if (cursor) {
      url.searchParams.append("cursor", cursor);
    }

    url.searchParams.append("lang", locale);
    url.searchParams.append("currency", currency);

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("Cannot fetch products");

    const data = await response.json();
    return getProductsResponseSchema.parse(data);
  } catch (error) {
    console.error("Fetch products error:", error);
    return { data: [], nextCursor: null };
  }
}
