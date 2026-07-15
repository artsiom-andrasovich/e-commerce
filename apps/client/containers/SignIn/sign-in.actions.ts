"use server";

import { env } from "@/configs";
import { redirectWithLocale, setAuthCookies } from "@/lib/server-auth";
import { signInDto } from "@app/lib-shared-types";
import { z } from "zod";

export type SignInInput = z.input<typeof signInDto>;

export async function signInAction(data: SignInInput) {
  const parsed = signInDto.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Invalid inputs",
    };
  }

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData?.message || "Please try again.",
      };
    }

    const result = await res.json();

    if (result.accessToken) {
      await setAuthCookies(result.accessToken);
    }
  } catch (error) {
    console.error(error);
    return { error: "Server error" };
  }

  await redirectWithLocale("/");
}
