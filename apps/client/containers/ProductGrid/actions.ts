"use server";

import {
  getProductsResponseSchema,
  TGetProductsResponse,
} from "@app/lib-shared-types";

export async function fetchProducts(
  categoryId?: string | null,
  search?: string | null,
  cursor?: string,
): Promise<TGetProductsResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const limit = 10;

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
