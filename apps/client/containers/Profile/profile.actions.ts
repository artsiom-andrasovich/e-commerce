"use server";

import { env } from "@/configs";
import { fetchWithAuth } from "@/lib/fetch-with-auth";

export async function fetchProfile() {
  try {
    const res = await fetchWithAuth(`${env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      method: "GET",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return null;
  }
}
