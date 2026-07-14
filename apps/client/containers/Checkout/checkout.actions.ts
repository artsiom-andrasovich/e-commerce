"use server";

import { env } from "@/configs";
import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { getLocale } from "next-intl/server";

export async function checkoutAction(
  data: any,
): Promise<{ checkoutUrl?: string; order: any }> {
  const cookieStore = await cookies();
  if (!cookieStore.get("accessToken") && !cookieStore.get("refreshToken")) {
    throw new Error("Unauthorized");
  }

  const locale = await getLocale();
  const currencyCookie = cookieStore.get("currency");
  const currency = currencyCookie?.value || "USD";
  const params = new URLSearchParams({ lang: locale, currency });
  const res = await fetchWithAuth(`${env.NEXT_PUBLIC_API_URL}/api/orders?${params}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Checkout failed");
  }

  return res.json();
}
