"use server";

import {
  GetCategoriesResponseSchema,
  TGetCategoriesResponse,
} from "@app/lib-shared-types";
import { env } from "@/configs/env";
import { getLocale } from "next-intl/server";

export async function fetchCategories(
  page?: number,
): Promise<TGetCategoriesResponse> {
  const API_URL = env.NEXT_PUBLIC_API_URL;
  const limit = 7;
  const locale = await getLocale();

  try {
    const url = new URL(`${API_URL}/api/categories`);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("lang", locale);

    if (page) {
      url.searchParams.append("page", page.toString());
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Cannot fetch categories");

    const data = await response.json();
    return GetCategoriesResponseSchema.parse(data);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return { data: [], nextPage: null };
  }
}
