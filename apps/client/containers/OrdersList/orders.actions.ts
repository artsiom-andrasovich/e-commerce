"use server";

import { env } from "@/configs";
import { fetchWithAuth } from "@/lib/fetch-with-auth";

export async function fetchMyOrders(page: number = 1, limit: number = 10) {
  try {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const res = await fetchWithAuth(
      `${env.NEXT_PUBLIC_API_URL}/api/orders/my-orders?${params}`,
      {
        method: "GET",
      },
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch user orders", error);
    return null;
  }
}
