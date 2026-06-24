"use server";

import { TProduct, productSchema } from "@app/lib-shared-types";

export async function fetchProductById(productId: string): Promise<TProduct> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const url = new URL(`${API_URL}/api/products/${productId}`);

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

export async function fetchSignedUrls(keys: string[]): Promise<string[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${API_URL}/api/upload/signed-urls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: keys }),
      next: { revalidate: 60 * 50 },
    });

    if (!response.ok) throw new Error("Cannot fetch signed urls");

    const data = await response.json();
    return data.urls as string[];
  } catch (error) {
    console.error("Fetch signed urls error:", error);
    return [];
  }
}

