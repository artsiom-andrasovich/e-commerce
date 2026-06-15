"use server";

import {
  GetCategoriesResponseSchema,
  TGetCategoriesResponse,
} from "@app/lib-shared-types";

export async function fetchCategories(
  cursor?: string,
): Promise<TGetCategoriesResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const limit = 10;

  try {
    const url = new URL(`${API_URL}/api/categories`);
    url.searchParams.append("limit", limit.toString());

    if (cursor) {
      url.searchParams.append("cursor", cursor);
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Cannot fetch categories");

    const data = await response.json();
    return GetCategoriesResponseSchema.parse(data);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return { data: [], nextCursor: null };
  }
}
